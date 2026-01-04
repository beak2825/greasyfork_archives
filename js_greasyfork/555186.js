// ==UserScript==
// @name         Galactic Tycoons 物资检查器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  为 Galactic Tycoons 游戏定制的物资检查器，包含差额计算功能
// @author       梦
// @match        https://g2.galactictycoons.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555186/Galactic%20Tycoons%20%E7%89%A9%E8%B5%84%E6%A3%80%E6%9F%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555186/Galactic%20Tycoons%20%E7%89%A9%E8%B5%84%E6%A3%80%E6%9F%A5%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #gt-material-checker {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            border: 2px solid #444;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            max-width: 400px;
            min-width: 300px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        
        .gt-checker-header {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 8px 12px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            font-weight: bold;
            cursor: move;
            user-select: none;
        }
        
        .gt-checker-body {
            padding: 8px;
        }
        
        .gt-material-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 4px;
            border-bottom: 1px solid #333;
            font-size: 11px;
        }
        
        .gt-material-name {
            flex: 1;
            font-weight: bold;
            color: #ecf0f1;
            min-width: 60px;
        }
        
        .gt-material-numbers {
            flex: 2;
            display: flex;
            justify-content: space-between;
            text-align: center;
            gap: 2px;
        }
        
        .gt-material-usage, .gt-material-demand, .gt-material-stock, .gt-material-diff {
            flex: 1;
            padding: 2px 4px;
            border-radius: 3px;
            min-width: 50px;
        }
        
        .gt-material-usage {
            background: rgba(155, 89, 182, 0.2);
            color: #9b59b6;
            font-size: 10px;
            cursor: help;
        }
        
        .gt-material-demand {
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
        }
        
        .gt-material-stock {
            background: rgba(52, 152, 219, 0.2);
            color: #3498db;
            cursor: pointer;
        }
        
        .gt-material-stock.locked {
            background: rgba(243, 156, 18, 0.3);
            color: #f39c12;
        }
        
        .gt-material-diff.positive {
            background: rgba(46, 204, 113, 0.2);
            color: #2ecc71;
        }
        
        .gt-material-diff.negative {
            background: rgba(231, 76, 60, 0.3);
            color: #e74c3c;
        }
        
        .gt-checker-controls {
            display: flex;
            gap: 6px;
            margin-top: 8px;
            padding: 8px 4px;
            border-top: 1px solid #333;
        }
        
        .gt-checker-btn {
            flex: 1;
            padding: 6px;
            border: none;
            border-radius: 4px;
            background: #34495e;
            color: white;
            font-size: 10px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .gt-checker-btn:hover {
            background: #4a6b8a;
        }
        
        .gt-btn-config {
            background: #8e44ad;
        }
        
        .gt-btn-refresh {
            background: #27ae60;
        }
        
        .gt-btn-hide {
            background: #c0392b;
        }
        
        .gt-btn-difference {
            background: #16a085;
        }
        
        .gt-config-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.98);
            color: white;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #555;
            z-index: 10000;
            width: 90%;
            max-width: 400px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        
        .gt-config-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            padding: 8px;
            background: #1a1a1a;
            border-radius: 4px;
        }
        
        .gt-config-name {
            flex: 1;
            min-width: 80px;
            font-weight: bold;
        }
        
        .gt-config-inputs {
            display: flex;
            gap: 5px;
            align-items: center;
        }
        
        .gt-config-input {
            width: 60px;
            padding: 4px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 3px;
            text-align: center;
            font-size: 11px;
        }
        
        .gt-config-stock {
            width: 50px;
            padding: 4px;
            background: #333;
            color: #3498db;
            border: 1px solid #555;
            border-radius: 3px;
            text-align: center;
            font-size: 11px;
            cursor: pointer;
        }
        
        .gt-config-stock.locked {
            background: rgba(243, 156, 18, 0.3);
            color: #f39c12;
        }
        
        .gt-lock-btn {
            background: #f39c12;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 10px;
            width: 40px;
        }
        
        .gt-time-toggle {
            background: #9b59b6;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 10px;
            width: 50px;
        }
        
        .gt-delete-btn {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 10px;
        }
        
        .gt-add-material {
            display: flex;
            gap: 6px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #333;
        }
        
        .gt-add-input {
            flex: 1;
            padding: 6px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 3px;
            font-size: 11px;
        }
        
        .gt-usage-info {
            font-size: 10px;
            color: #9b59b6;
            text-align: right;
            margin-top: 2px;
            margin-bottom: 8px;
            padding: 2px 5px;
            background: rgba(155, 89, 182, 0.1);
            border-radius: 3px;
        }
        
        .empty-state {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            font-style: italic;
        }
        
/* 恢复按钮 - 添加可移动样式 */
.gt-restore-btn {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    z-index: 9998;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: move;
    user-select: none;
    /* 添加固定尺寸 */
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    max-width: 40px !important;
    max-height: 40px !important;
    line-height: 1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
}   
        .gt-restore-btn:hover {
            background: #2980b9;
        }
        
        /* 配置面板遮罩 */
        .gt-config-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
        
        /* 差额计算样式 */
        .gt-difference-enabled {
            border-left: 3px solid #16a085;
        }
    `);

    // 用户配置
    let userRequirements = GM_getValue('gt_material_requirements', {});
    let lockedStocks = GM_getValue('gt_locked_stocks', {});
    let timeDisplayEnabled = GM_getValue('gt_time_display_enabled', false);
    let checkerPosition = GM_getValue('gt_checker_position', { left: '10px', bottom: '10px' });
    let isCheckerHidden = GM_getValue('gt_checker_hidden', false);
    let differenceEnabled = GM_getValue('gt_difference_enabled', false);
    let restoreBtnPosition = GM_getValue('gt_restore_btn_position', { top: '10px', right: '10px' });

    // 创建界面
    function createInterface() {
        // 移除已存在的检查器
        const existingChecker = document.getElementById('gt-material-checker');
        const existingConfig = document.getElementById('gt-config-panel');
        const existingOverlay = document.getElementById('gt-config-overlay');
        const existingRestoreBtn = document.getElementById('gt-restore-btn');
        
        if (existingChecker) existingChecker.remove();
        if (existingConfig) existingConfig.remove();
        if (existingOverlay) existingOverlay.remove();
        if (existingRestoreBtn) existingRestoreBtn.remove();
        
        // 创建主检查器
        const checker = document.createElement('div');
        checker.id = 'gt-material-checker';
        if (differenceEnabled) {
            checker.classList.add('gt-difference-enabled');
        }
        
        // 应用保存的位置
        if (checkerPosition.left) checker.style.left = checkerPosition.left;
        if (checkerPosition.bottom) checker.style.bottom = checkerPosition.bottom;
        if (checkerPosition.top) checker.style.top = checkerPosition.top;
        if (checkerPosition.right) checker.style.right = checkerPosition.right;
        
        checker.innerHTML = `
            <div class="gt-checker-header" id="gt-checker-header">
                <span>🚀 物资检查</span>
                <span id="gt-checker-status">加载中...</span>
            </div>
            <div class="gt-checker-body">
                <div id="gt-checker-content">
                    <div class="empty-state">正在扫描仓库数据...</div>
                </div>
            </div>
            <div class="gt-checker-controls">
                <button class="gt-checker-btn gt-btn-config" id="gt-btn-config">配置</button>
                <button class="gt-checker-btn gt-btn-refresh" id="gt-btn-refresh">刷新</button>
                <button class="gt-checker-btn gt-btn-difference" id="gt-btn-difference">${differenceEnabled ? '关闭差额' : '开启差额'}</button>
                <button class="gt-checker-btn gt-btn-hide" id="gt-btn-hide">${isCheckerHidden ? '显示' : '隐藏'}</button>
            </div>
        `;
        
        document.body.appendChild(checker);
        
        // 创建配置面板
        const configPanel = document.createElement('div');
        configPanel.id = 'gt-config-panel';
        configPanel.className = 'gt-config-panel';
        configPanel.style.display = 'none';
        configPanel.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px; font-weight: bold; color: #3498db;">配置每日需求</div>
            <div style="margin-bottom: 15px; padding: 8px; background: #1a1a1a; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>时间显示</span>
                    <button class="gt-time-toggle" id="gt-global-time-toggle">${timeDisplayEnabled ? '关闭时间' : '开启时间'}</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span>表格差额</span>
                    <button class="gt-time-toggle" id="gt-difference-toggle">${differenceEnabled ? '关闭差额' : '开启差额'}</button>
                </div>
            </div>
            <div id="gt-config-content"></div>
            <div class="gt-add-material">
                <input type="text" class="gt-add-input" id="gt-new-material-input" placeholder="输入物资名称">
                <button class="gt-checker-btn" id="gt-btn-add-material">添加</button>
            </div>
            <button class="gt-checker-btn" id="gt-btn-close-config" style="width: 100%; margin-top: 12px; background: #34495e;">关闭配置</button>
        `;
        document.body.appendChild(configPanel);
        
        // 创建恢复按钮（当检查器隐藏时显示）
        if (isCheckerHidden) {
            createRestoreButton();
            checker.style.display = 'none';
        }
        
        // 绑定事件监听器
        bindEvents();
        
        // 初始化主检查器拖动功能
        initDraggable();
        
        // 启动差额计算功能
        if (differenceEnabled) {
            startDifferenceMonitoring();
        }
    }

    // 创建恢复按钮
    function createRestoreButton() {
        const existingRestoreBtn = document.getElementById('gt-restore-btn');
        if (existingRestoreBtn) existingRestoreBtn.remove();
        
        const restoreBtn = document.createElement('button');
        restoreBtn.id = 'gt-restore-btn';
        restoreBtn.className = 'gt-restore-btn';
        restoreBtn.innerHTML = '📦 ';
        restoreBtn.title = '点击显示物资检查器';
        
        // 应用保存的位置
        if (restoreBtnPosition.top) restoreBtn.style.top = restoreBtnPosition.top;
        if (restoreBtnPosition.right) restoreBtn.style.right = restoreBtnPosition.right;
        if (restoreBtnPosition.left) restoreBtn.style.left = restoreBtnPosition.left;
        if (restoreBtnPosition.bottom) restoreBtn.style.bottom = restoreBtnPosition.bottom;
        
        restoreBtn.addEventListener('click', function() {
            toggleChecker();
        });
        
        // 初始化恢复按钮拖动功能
        initRestoreBtnDraggable(restoreBtn);
        
        document.body.appendChild(restoreBtn);
    }

    // 初始化恢复按钮拖动功能
// 初始化恢复按钮拖动功能
function initRestoreBtnDraggable(restoreBtn) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let dragThreshold = 5; // 拖动阈值，移动超过5px才认为是拖动
    
    restoreBtn.addEventListener('mousedown', startDrag);
    restoreBtn.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        isDragging = false; // 初始状态不是拖动
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = restoreBtn.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }
    
    function startDragTouch(e) {
        isDragging = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        const rect = restoreBtn.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);
        e.preventDefault();
    }
    
    function drag(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 检查是否超过拖动阈值
        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
            isDragging = true;
        }
        
        if (!isDragging) return;
        
        let newX = initialX + dx;
        let newY = initialY + dy;
        
        // 边界检查
        const maxX = window.innerWidth - restoreBtn.offsetWidth - 10;
        const maxY = window.innerHeight - restoreBtn.offsetHeight - 10;
        
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));
        
        restoreBtn.style.left = newX + 'px';
        restoreBtn.style.top = newY + 'px';
        restoreBtn.style.right = 'auto';
        restoreBtn.style.bottom = 'auto';
    }
    
    function dragTouch(e) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        // 检查是否超过拖动阈值
        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
            isDragging = true;
        }
        
        if (!isDragging) return;
        
        let newX = initialX + dx;
        let newY = initialY + dy;
        
        // 边界检查
        const maxX = window.innerWidth - restoreBtn.offsetWidth - 10;
        const maxY = window.innerHeight - restoreBtn.offsetHeight - 10;
        
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));
        
        restoreBtn.style.left = newX + 'px';
        restoreBtn.style.top = newY + 'px';
        restoreBtn.style.right = 'auto';
        restoreBtn.style.bottom = 'auto';
    }
    
    function stopDrag() {
        // 如果不是拖动操作，就触发点击事件
        if (!isDragging) {
            toggleChecker();
        }
        
        isDragging = false;
        
        // 保存位置（只有在真正拖动时才保存）
        if (restoreBtn.style.left || restoreBtn.style.top) {
            const rect = restoreBtn.getBoundingClientRect();
            restoreBtnPosition = {
                left: restoreBtn.style.left,
                top: restoreBtn.style.top
            };
            GM_setValue('gt_restore_btn_position', restoreBtnPosition);
        }
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

    // ==================== 修复数字提取函数 ====================
    
    // 改进的数字提取函数，处理带逗号的数字格式
    function extractNumber(text) {
        if (!text) return 0;
        
        // 移除逗号和其他非数字字符（除了负号和小数点）
        const cleanedText = text.replace(/,/g, '').replace(/[^\d.-]/g, '');
        
        // 提取数字
        const match = cleanedText.match(/-?\d+(\.\d+)?/);
        return match ? parseInt(match[0], 10) : 0;
    }

    // ==================== 差额计算功能 ====================
    
    // 添加差额列到总消耗表格
    function addDifferenceColumn() {
        try {
            // 查找包含"总消耗"文字的表头
            const allHeaders = document.querySelectorAll('th');
            let targetHeader = Array.from(allHeaders).find(h => 
                h.textContent.trim() === '总消耗' || h.textContent.trim().includes('总消耗')
            );

            if (!targetHeader) return;

            // 获取表头所在的表格
            const table = targetHeader.closest('table');
            if (!table) return;

            // 检查是否已经添加过差额列
            if (table.querySelector('th[data-column="difference"]')) {
                updateDifferenceValues(table);
                return;
            }

            // 获取表头行
            const headerRow = targetHeader.closest('tr');
            if (!headerRow) return;

            // 添加差额列表头
            const diffHeader = document.createElement('th');
            diffHeader.className = 'col-1';
            diffHeader.textContent = '差额';
            diffHeader.setAttribute('data-column', 'difference');

            // 插入到表头的适当位置（在储备列之前）
            const reserveHeader = headerRow.querySelector('th:nth-child(4)');
            if (reserveHeader) {
                headerRow.insertBefore(diffHeader, reserveHeader);
            } else {
                headerRow.appendChild(diffHeader);
            }

            // 为每一行添加差额列
            updateDifferenceValues(table);

        } catch (error) {
            console.error('添加差额列时出错:', error);
        }
    }

    // 更新差额值
    function updateDifferenceValues(table) {
        try {
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach((row) => {
                try {
                    const cells = row.querySelectorAll('td');

                    if (cells.length >= 4) {
                        const warehouseCell = cells[1];
                        const dailyCell = cells[2];

                        // 使用修复的数字提取函数
                        const warehouseValue = extractNumber(warehouseCell.textContent.trim());
                        const dailyValue = extractNumber(dailyCell.textContent.trim());

                        if (!isNaN(warehouseValue) && !isNaN(dailyValue)) {
                            const difference = warehouseValue - dailyValue;

                            let diffCell = row.querySelector('td[data-column="difference"]');

                            if (!diffCell) {
                                diffCell = document.createElement('td');
                                diffCell.setAttribute('data-column', 'difference');

                                const reserveCell = cells[3];
                                if (reserveCell) {
                                    row.insertBefore(diffCell, reserveCell);
                                } else {
                                    row.appendChild(diffCell);
                                }
                            }

                            diffCell.textContent = difference;

                            // 根据差额值设置不同的颜色
                            if (difference < 0) {
                                diffCell.className = 'text-danger';
                            } else if (difference > 0) {
                                diffCell.className = 'text-success';
                            } else {
                                diffCell.className = '';
                            }
                        }
                    }
                } catch (err) {
                    console.error('处理行时出错:', err);
                }
            });

        } catch (error) {
            console.error('更新差额值时出错:', error);
        }
    }

    // 防抖函数
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // 启动差额计算监听
    function startDifferenceMonitoring() {
        console.log('启动表格差额计算监听');

        const debouncedAddColumn = debounce(addDifferenceColumn, 100);

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(debouncedAddColumn);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 立即执行一次
        addDifferenceColumn();
    }

    // 停止差额计算监听
    function stopDifferenceMonitoring() {
        // 移除所有差额列
        const diffHeaders = document.querySelectorAll('th[data-column="difference"]');
        diffHeaders.forEach(header => {
            header.remove();
        });
        
        const diffCells = document.querySelectorAll('td[data-column="difference"]');
        diffCells.forEach(cell => {
            cell.remove();
        });
    }

    // 切换差额计算功能
    function toggleDifference() {
        differenceEnabled = !differenceEnabled;
        GM_setValue('gt_difference_enabled', differenceEnabled);
        
        const differenceBtn = document.getElementById('gt-btn-difference');
        const differenceToggle = document.getElementById('gt-difference-toggle');
        const checker = document.getElementById('gt-material-checker');
        
        if (differenceBtn) {
            differenceBtn.textContent = differenceEnabled ? '关闭差额' : '开启差额';
        }
        if (differenceToggle) {
            differenceToggle.textContent = differenceEnabled ? '关闭差额' : '开启差额';
        }
        if (checker) {
            if (differenceEnabled) {
                checker.classList.add('gt-difference-enabled');
                startDifferenceMonitoring();
            } else {
                checker.classList.remove('gt-difference-enabled');
                stopDifferenceMonitoring();
            }
        }
    }

    // ==================== 原有功能 ====================
    
    // 初始化主检查器拖动功能
    function initDraggable() {
        const header = document.getElementById('gt-checker-header');
        const checker = document.getElementById('gt-material-checker');
        
        if (!header || !checker) return;
        
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDragTouch);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = checker.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        }
        
        function startDragTouch(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            
            const rect = checker.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            document.addEventListener('touchmove', dragTouch);
            document.addEventListener('touchend', stopDrag);
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // 边界检查
            const maxX = window.innerWidth - checker.offsetWidth - 10;
            const maxY = window.innerHeight - checker.offsetHeight - 10;
            
            newX = Math.max(10, Math.min(newX, maxX));
            newY = Math.max(10, Math.min(newY, maxY));
            
            checker.style.left = newX + 'px';
            checker.style.top = newY + 'px';
            checker.style.bottom = 'auto';
            checker.style.right = 'auto';
        }
        
        function dragTouch(e) {
            if (!isDragging) return;
            
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // 边界检查
            const maxX = window.innerWidth - checker.offsetWidth - 10;
            const maxY = window.innerHeight - checker.offsetHeight - 10;
            
            newX = Math.max(10, Math.min(newX, maxX));
            newY = Math.max(10, Math.min(newY, maxY));
            
            checker.style.left = newX + 'px';
            checker.style.top = newY + 'px';
            checker.style.bottom = 'auto';
            checker.style.right = 'auto';
        }
        
        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            
            // 保存位置
            const rect = checker.getBoundingClientRect();
            checkerPosition = {
                left: checker.style.left,
                top: checker.style.top
            };
            GM_setValue('gt_checker_position', checkerPosition);
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', dragTouch);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }

    // 绑定所有事件
    function bindEvents() {
        // 配置按钮
        const configBtn = document.getElementById('gt-btn-config');
        const refreshBtn = document.getElementById('gt-btn-refresh');
        const hideBtn = document.getElementById('gt-btn-hide');
        const differenceBtn = document.getElementById('gt-btn-difference');
        const addMaterialBtn = document.getElementById('gt-btn-add-material');
        const closeConfigBtn = document.getElementById('gt-btn-close-config');
        const globalTimeToggle = document.getElementById('gt-global-time-toggle');
        const differenceToggle = document.getElementById('gt-difference-toggle');
        
        if (configBtn) configBtn.addEventListener('click', toggleConfig);
        if (refreshBtn) refreshBtn.addEventListener('click', refreshData);
        if (hideBtn) hideBtn.addEventListener('click', toggleChecker);
        if (differenceBtn) differenceBtn.addEventListener('click', toggleDifference);
        if (addMaterialBtn) addMaterialBtn.addEventListener('click', addNewMaterial);
        if (closeConfigBtn) closeConfigBtn.addEventListener('click', toggleConfig);
        if (globalTimeToggle) globalTimeToggle.addEventListener('click', toggleGlobalTimeDisplay);
        if (differenceToggle) differenceToggle.addEventListener('click', toggleDifference);
        
        // 输入框回车事件
        const newMaterialInput = document.getElementById('gt-new-material-input');
        if (newMaterialInput) {
            newMaterialInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addNewMaterial();
                }
            });
        }
    }

    // 切换检查器显示/隐藏
    function toggleChecker() {
        const checker = document.getElementById('gt-material-checker');
        const restoreBtn = document.getElementById('gt-restore-btn');
        const hideBtn = document.getElementById('gt-btn-hide');
        
        if (!checker) return;
        
        if (checker.style.display === 'none' || isCheckerHidden) {
            // 显示检查器
            checker.style.display = 'block';
            isCheckerHidden = false;
            if (hideBtn) hideBtn.textContent = '隐藏';
            if (restoreBtn) restoreBtn.remove();
        } else {
            // 隐藏检查器
            checker.style.display = 'none';
            isCheckerHidden = true;
            if (hideBtn) hideBtn.textContent = '显示';
            createRestoreButton();
        }
        
        GM_setValue('gt_checker_hidden', isCheckerHidden);
    }

    // 切换配置面板
    function toggleConfig() {
        const configPanel = document.getElementById('gt-config-panel');
        const overlay = document.getElementById('gt-config-overlay');
        
        if (!configPanel) return;
        
        if (configPanel.style.display === 'block') {
            // 关闭配置面板
            configPanel.style.display = 'none';
            if (overlay) overlay.remove();
        } else {
            // 打开配置面板
            renderConfigPanel();
            configPanel.style.display = 'block';
            
            // 创建遮罩层
            const newOverlay = document.createElement('div');
            newOverlay.id = 'gt-config-overlay';
            newOverlay.className = 'gt-config-overlay';
            newOverlay.addEventListener('click', toggleConfig);
            document.body.appendChild(newOverlay);
        }
    }

    // 检查是否在仓库页面
    function isInWarehousePage() {
        const url = window.location.href;
        const hasTable = document.querySelector('table');
        const hasWarehouseText = document.body.textContent.includes('仓库');
        return (url.includes('/base/') || url.includes('/exchange/')) && (hasTable || hasWarehouseText);
    }

    // 自动检测仓库物资
    function autoDetectWarehouse() {
        const warehouseData = {};
        const isWarehousePage = isInWarehousePage();
        
        if (isWarehousePage) {
            // 扫描所有表格
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 2) {
                        const materialName = cells[0].textContent.trim();
                        const quantityText = cells[1].textContent.trim();
                        
                        // 跳过表头和空行
                        if (!materialName || materialName === '材料' || materialName === 'QTY') return;
                        
                        // 跳过价格信息
                        if (row.textContent.includes('$')) return;
                        
                        // 使用修复的数字提取函数
                        const quantity = extractNumber(quantityText);
                        
                        if (materialName && quantity > 0) {
                            if (!lockedStocks[materialName]) {
                                warehouseData[materialName] = quantity;
                            } else {
                                warehouseData[materialName] = lockedStocks[materialName];
                            }
                        }
                    }
                });
            });
        }
        
        // 使用锁定值或缓存值
        Object.keys(userRequirements).forEach(material => {
            if (!warehouseData[material]) {
                if (lockedStocks[material]) {
                    warehouseData[material] = lockedStocks[material];
                } else {
                    const cachedData = GM_getValue('gt_warehouse_cache', {});
                    warehouseData[material] = cachedData[material] || 0;
                }
            }
        });
        
        // 更新缓存
        if (isWarehousePage) {
            const cacheData = {};
            Object.keys(warehouseData).forEach(material => {
                if (!lockedStocks[material]) {
                    cacheData[material] = warehouseData[material];
                }
            });
            GM_setValue('gt_warehouse_cache', cacheData);
        }
        
        return warehouseData;
    }

    // 计算使用时间
    function calculateUsageTime(stock, dailyDemand) {
        if (!dailyDemand || dailyDemand <= 0 || !stock || stock <= 0) return null;
        
        const hourlyUsage = dailyDemand / 24;
        const hoursAvailable = stock / hourlyUsage;
        
        if (hoursAvailable >= 24 * 30) {
            const months = (hoursAvailable / (24 * 30)).toFixed(1);
            return `${months}月`;
        } else if (hoursAvailable >= 24 * 7) {
            const weeks = (hoursAvailable / (24 * 7)).toFixed(1);
            return `${weeks}周`;
        } else if (hoursAvailable >= 24) {
            const days = (hoursAvailable / 24).toFixed(1);
            return `${days}天`;
        } else {
            return `${hoursAvailable.toFixed(1)}时`;
        }
    }

    // 更新显示内容
    function updateDisplay() {
        const warehouseData = autoDetectWarehouse();
        const content = document.getElementById('gt-checker-content');
        const status = document.getElementById('gt-checker-status');
        
        if (!content) return;
        
        let html = '';
        let hasData = false;
        let detectedCount = 0;
        const isWarehousePage = isInWarehousePage();
        
        Object.keys(userRequirements).forEach(material => {
            const demand = userRequirements[material];
            const stock = warehouseData[material] || 0;
            const isLocked = !!lockedStocks[material];
            
            let usageDisplay = '-';
            if (timeDisplayEnabled && demand > 0 && stock > 0) {
                const usageTime = calculateUsageTime(stock, demand);
                if (usageTime) {
                    usageDisplay = usageTime;
                }
            }
            
            if (stock > 0 || demand > 0) {
                const difference = stock - demand;
                const lockIndicator = isLocked ? '🔒' : '';
                
                html += `
                    <div class="gt-material-row">
                        <div class="gt-material-name">${material}${lockIndicator}</div>
                        <div class="gt-material-numbers">
                            <span class="gt-material-usage" title="当前库存可维持时间">${usageDisplay}</span>
                            <span class="gt-material-demand">需:${demand}</span>
                            <span class="gt-material-stock ${isLocked ? 'locked' : ''}" 
                                  onclick="window.gtToggleLock('${material}', ${stock})"
                                  title="${isLocked ? '点击取消锁定' : '点击锁定库存'}">仓:${stock}</span>
                            <span class="gt-material-diff ${difference >= 0 ? 'positive' : 'negative'}">差:${difference}</span>
                        </div>
                    </div>
                `;
                hasData = true;
                detectedCount++;
            }
        });
        
        if (!hasData) {
            html = `
                <div class="empty-state">
                    暂无配置的物资<br>
                    <small>点击"配置"添加要监控的物资</small>
                </div>
            `;
        }
        
        content.innerHTML = html;
        if (status) {
            const pageInfo = isWarehousePage ? '仓库页面' : '其他页面';
            const lockedCount = Object.keys(lockedStocks).length;
            const lockInfo = lockedCount > 0 ? ` | 锁定:${lockedCount}` : '';
            const timeInfo = timeDisplayEnabled ? ' | 时间开' : '';
            const diffInfo = differenceEnabled ? ' | 差额开' : '';
            status.textContent = `监控:${detectedCount}种 | ${pageInfo}${lockInfo}${timeInfo}${diffInfo}`;
        }
    }

    // 渲染配置面板
    function renderConfigPanel() {
        const configContent = document.getElementById('gt-config-content');
        if (!configContent) return;
        
        const warehouseData = autoDetectWarehouse();
        
        let html = '';
        
        if (Object.keys(userRequirements).length === 0) {
            html = '<div class="empty-state">暂无配置，请添加物资</div>';
        } else {
            Object.keys(userRequirements).forEach(material => {
                const demand = userRequirements[material];
                const stock = warehouseData[material] || 0;
                const isLocked = !!lockedStocks[material];
                
                let usageInfo = '';
                if (timeDisplayEnabled && demand > 0 && stock > 0) {
                    const usageTime = calculateUsageTime(stock, demand);
                    if (usageTime) {
                        usageInfo = `可用: ${usageTime}`;
                    }
                }
                
                html += `
                    <div class="gt-config-item">
                        <div class="gt-config-name">${material}</div>
                        <div class="gt-config-inputs">
                            <input type="number" class="gt-config-input" value="${demand}" 
                                   data-material="${material}" min="0" placeholder="需求">
                            <span class="gt-config-stock ${isLocked ? 'locked' : ''}" 
                                  onclick="window.gtToggleLock('${material}', ${stock})"
                                  title="${isLocked ? '点击取消锁定' : '点击锁定库存'}">${stock}</span>
                            <button class="gt-lock-btn" data-material="${material}">${isLocked ? '解锁' : '锁定'}</button>
                            <button class="gt-delete-btn" data-material="${material}">删除</button>
                        </div>
                    </div>
                    ${usageInfo ? `<div class="gt-usage-info">${usageInfo}</div>` : ''}
                `;
            });
        }
        
        configContent.innerHTML = html;
        
        // 绑定输入框事件
        const inputs = configContent.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                const material = this.getAttribute('data-material');
                const value = parseInt(this.value) || 0;
                updateRequirement(material, value);
            });
        });
        
        // 绑定锁定按钮事件
        const lockBtns = configContent.querySelectorAll('.gt-lock-btn');
        lockBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const material = this.getAttribute('data-material');
                const warehouseData = autoDetectWarehouse();
                const currentStock = warehouseData[material] || 0;
                toggleStockLock(material, currentStock);
            });
        });
        
        // 绑定删除按钮事件
        const deleteBtns = configContent.querySelectorAll('.gt-delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const material = this.getAttribute('data-material');
                deleteMaterial(material);
            });
        });
    }

    // 切换物资锁定状态
    function toggleStockLock(material, currentStock) {
        if (lockedStocks[material]) {
            delete lockedStocks[material];
        } else {
            lockedStocks[material] = currentStock;
        }
        
        GM_setValue('gt_locked_stocks', lockedStocks);
        updateDisplay();
        renderConfigPanel();
    }

    // 切换全局时间显示
    function toggleGlobalTimeDisplay() {
        timeDisplayEnabled = !timeDisplayEnabled;
        GM_setValue('gt_time_display_enabled', timeDisplayEnabled);
        
        const toggleBtn = document.getElementById('gt-global-time-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = timeDisplayEnabled ? '关闭时间' : '开启时间';
        }
        
        updateDisplay();
        renderConfigPanel();
    }

    // 更新需求配置
    function updateRequirement(material, value) {
        userRequirements[material] = value;
        GM_setValue('gt_material_requirements', userRequirements);
        updateDisplay();
        renderConfigPanel();
    }

    // 删除物资
    function deleteMaterial(material) {
        if (confirm(`确定要删除 ${material} 吗？`)) {
            delete userRequirements[material];
            delete lockedStocks[material];
            GM_setValue('gt_material_requirements', userRequirements);
            GM_setValue('gt_locked_stocks', lockedStocks);
            renderConfigPanel();
            updateDisplay();
        }
    }

    // 添加新物资
    function addNewMaterial() {
        const input = document.getElementById('gt-new-material-input');
        if (!input) return;
        
        const newMaterial = input.value.trim();
        
        if (newMaterial) {
            if (!userRequirements[newMaterial]) {
                userRequirements[newMaterial] = 0;
                GM_setValue('gt_material_requirements', userRequirements);
                renderConfigPanel();
                updateDisplay();
                input.value = '';
            } else {
                alert('该物资已存在！');
            }
        }
    }

    // 刷新数据
    function refreshData() {
        GM_setValue('gt_warehouse_cache', {});
        updateDisplay();
        const status = document.getElementById('gt-checker-status');
        if (status) {
            status.textContent = '刷新中...';
            setTimeout(() => {
                updateDisplay();
            }, 500);
        }
    }

    // 暴露函数到全局作用域
    window.gtToggleLock = function(material, currentStock) {
        toggleStockLock(material, currentStock);
    };

    // 初始化
    function init() {
        setTimeout(() => {
            createInterface();
            updateDisplay();
            
            setInterval(updateDisplay, 10000);
            
            console.log('Galactic Tycoons 物资检查器已加载');
        }, 2000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(updateDisplay, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();