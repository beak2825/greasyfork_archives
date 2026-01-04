// ==UserScript==
// @name         数独Canvas游戏助手
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  针对Canvas数独游戏的自动填充工具，仅针对sudoku.com网站适用
// @author       beizhi
// @match        https://sudoku.com/zh/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557633/%E6%95%B0%E7%8B%ACCanvas%E6%B8%B8%E6%88%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557633/%E6%95%B0%E7%8B%ACCanvas%E6%B8%B8%E6%88%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式 - 简洁版
    GM_addStyle(`
        #sudoku-canvas-helper {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: white !important;
            padding: 15px !important;
            border-radius: 10px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            z-index: 10000 !important;
            font-family: Arial, sans-serif !important;
            width: 320px !important;
            border: 2px solid #4CAF50 !important;
        }
        .sudoku-section {
            margin-bottom: 15px !important;
        }
        .sudoku-title {
            font-weight: bold !important;
            color: #333 !important;
            margin-bottom: 8px !important;
            font-size: 16px !important;
            padding-bottom: 5px !important;
            border-bottom: 2px solid #4CAF50 !important;
        }
        .sudoku-input {
            width: 100% !important;
            padding: 8px !important;
            border: 1px solid #ddd !important;
            border-radius: 4px !important;
            font-family: monospace !important;
            font-size: 14px !important;
            margin-bottom: 8px !important;
            box-sizing: border-box !important;
        }
        .sudoku-input:focus {
            border-color: #4CAF50 !important;
            outline: none !important;
        }
        .sudoku-btn {
            background: #4CAF50 !important;
            color: white !important;
            border: none !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: bold !important;
            width: 100% !important;
            margin: 5px 0 !important;
            transition: all 0.2s !important;
        }
        .sudoku-btn:hover {
            background: #45a049 !important;
        }
        .sudoku-btn.blue {
            background: #2196F3 !important;
        }
        .sudoku-btn.blue:hover {
            background: #0b7dda !important;
        }
        .sudoku-btn.orange {
            background: #FF9800 !important;
        }
        .sudoku-btn.orange:hover {
            background: #e68900 !important;
        }
        .sudoku-btn.red {
            background: #f44336 !important;
        }
        .sudoku-btn.red:hover {
            background: #d32f2f !important;
        }
        .sudoku-status {
            margin-top: 10px !important;
            padding: 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            text-align: center !important;
            min-height: 36px !important;
        }
        .sudoku-status.success {
            background: #d4edda !important;
            color: #155724 !important;
            border: 1px solid #c3e6cb !important;
        }
        .sudoku-status.error {
            background: #f8d7da !important;
            color: #721c24 !important;
            border: 1px solid #f5c6cb !important;
        }
        .sudoku-status.info {
            background: #d1ecf1 !important;
            color: #0c5460 !important;
            border: 1px solid #bee5eb !important;
        }
        .sudoku-row {
            display: flex !important;
            gap: 10px !important;
            margin-bottom: 8px !important;
        }
        .sudoku-row .sudoku-btn {
            width: auto !important;
            flex: 1 !important;
        }
        .sudoku-char-count {
            font-size: 11px !important;
            color: #666 !important;
            text-align: right !important;
            margin-top: -5px !important;
            margin-bottom: 8px !important;
        }
        .delay-control {
            margin: 10px 0 !important;
        }
        .delay-label {
            display: flex !important;
            justify-content: space-between !important;
            font-size: 12px !important;
            color: #666 !important;
            margin-bottom: 5px !important;
        }
        .delay-slider {
            width: 100% !important;
        }
    `);

    // 全局变量
    let canvas = null;
    let canvasRect = null;
    let cellSize = { width: 0, height: 0 };

    function init() {
        console.log('Canvas数独助手初始化...');

        // 移除旧面板
        const oldPanel = document.getElementById('sudoku-canvas-helper');
        if (oldPanel) oldPanel.remove();

        // 查找Canvas
        findCanvas();

        // 创建控制面板
        createControlPanel();

        // 如果找到Canvas，显示坐标信息
        if (canvas) {
            updateCanvasInfo();
        }
    }

    function findCanvas() {
        canvas = document.querySelector('#game canvas');
        if (!canvas) {
            canvas = document.querySelector('canvas');
        }

        if (canvas) {
            console.log('找到Canvas:', {
                width: canvas.width,
                height: canvas.height,
                styleWidth: canvas.style.width,
                styleHeight: canvas.style.height,
                clientWidth: canvas.clientWidth,
                clientHeight: canvas.clientHeight
            });

            // 获取Canvas的实际屏幕位置和尺寸
            canvasRect = canvas.getBoundingClientRect();

            // 计算单元格大小（假设是9x9网格）
            cellSize.width = canvasRect.width / 9;
            cellSize.height = canvasRect.height / 9;

            console.log('Canvas位置和尺寸:', canvasRect);
            console.log('单元格估算尺寸:', cellSize);

            return true;
        } else {
            console.warn('未找到Canvas元素');
            return false;
        }
    }

    function updateCanvasInfo() {
        if (!canvas) return;

        canvasRect = canvas.getBoundingClientRect();
        cellSize.width = canvasRect.width / 9;
        cellSize.height = canvasRect.height / 9;

        const infoEl = document.getElementById('canvas-info');
        if (infoEl) {
            infoEl.textContent = `Canvas: ${canvasRect.width.toFixed(0)}×${canvasRect.height.toFixed(0)}px, 单元格: ${cellSize.width.toFixed(1)}×${cellSize.height.toFixed(1)}px`;
        }
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'sudoku-canvas-helper';

        // 加载保存的数据
        const savedMission = GM_getValue('sudoku_mission', '');
        const savedSolution = GM_getValue('sudoku_solution', '');

        panel.innerHTML = `
            <div class="sudoku-section">
                <div class="sudoku-title">数独自动填充助手</div>
                <div id="canvas-info" style="font-size: 12px; color: #666; margin-bottom: 10px;">
                    ${canvas ? '✅ 已检测到Canvas游戏' : '正在查找游戏...'}
                </div>
            </div>

            <div class="sudoku-section">
                <div style="font-size: 13px; color: #333; margin-bottom: 8px;">📝 输入数据：</div>

                <div style="font-size: 11px; color: #666; margin-bottom: 4px;">题目（81位，0=空格）：</div>
                <input type="text" id="sudoku-mission" class="sudoku-input"
                       placeholder="例如: 008000040060003000..."
                       value="${savedMission}" maxlength="81">
                <div id="mission-count" class="sudoku-char-count">${savedMission.length}/81</div>

                <div style="font-size: 11px; color: #666; margin-bottom: 4px;">答案（81位完整解法）：</div>
                <input type="text" id="sudoku-solution" class="sudoku-input"
                       placeholder="例如: 578291346461783952..."
                       value="${savedSolution}" maxlength="81">
                <div id="solution-count" class="sudoku-char-count">${savedSolution.length}/81</div>

                <div class="sudoku-row">
                    <button id="btn-save" class="sudoku-btn">💾 保存</button>
                    <button id="btn-clear" class="sudoku-btn red">🗑️ 清空</button>
                </div>
            </div>

            <div class="sudoku-section">
                <div style="font-size: 13px; color: #333; margin-bottom: 8px;">⚡ 填充设置：</div>

                <div class="delay-control">
                    <div class="delay-label">
                        <span>填充速度：</span>
                        <span id="delay-value">200ms</span>
                    </div>
                    <input type="range" id="delay-slider" class="delay-slider"
                           min="50" max="1000" value="200" step="50">
                </div>

                <button id="btn-fill-step" class="sudoku-btn orange">⏳ 逐步填充</button>
                <button id="btn-fill-fast" class="sudoku-btn blue">⚡ 快速填充</button>
                <button id="btn-fill-selected" class="sudoku-btn">🎯 仅填空格</button>
            </div>

            <div id="sudoku-status" class="sudoku-status info">
                ${canvas ? '就绪。请输入题目和答案后保存。' : '正在查找游戏，请稍候...'}
            </div>

            <div style="font-size: 10px; color: #888; margin-top: 10px; text-align: center;">
                快捷键: Ctrl+Shift+S (逐步) | Ctrl+Shift+F (快速)
            </div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听
        setupEventListeners();

        // 如果没有找到Canvas，定期检查
        if (!canvas) {
            setTimeout(findCanvas, 1000);
        }
    }

    function setupEventListeners() {
        // 输入框实时验证
        const missionInput = document.getElementById('sudoku-mission');
        const solutionInput = document.getElementById('sudoku-solution');

        missionInput.addEventListener('input', validateInput);
        solutionInput.addEventListener('input', validateInput);

        // 延迟滑块
        const delaySlider = document.getElementById('delay-slider');
        const delayValue = document.getElementById('delay-value');

        delaySlider.addEventListener('input', function() {
            delayValue.textContent = this.value + 'ms';
        });

        // 按钮事件
        document.getElementById('btn-save').addEventListener('click', saveData);
        document.getElementById('btn-clear').addEventListener('click', clearData);
        document.getElementById('btn-fill-step').addEventListener('click', () => fillSudoku(true));
        document.getElementById('btn-fill-fast').addEventListener('click', () => fillSudoku(false));
        document.getElementById('btn-fill-selected').addEventListener('click', fillSelectedCells);

        // 键盘快捷键
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey) {
                if (e.key === 'S') {
                    e.preventDefault();
                    fillSudoku(true);
                } else if (e.key === 'F') {
                    e.preventDefault();
                    fillSudoku(false);
                }
            }
        });

        // 窗口大小变化时更新Canvas信息
        window.addEventListener('resize', function() {
            setTimeout(updateCanvasInfo, 100);
        });
    }

    function validateInput() {
        const mission = document.getElementById('sudoku-mission').value;
        const solution = document.getElementById('sudoku-solution').value;

        // 验证长度
        if (mission.length > 81) {
            document.getElementById('sudoku-mission').value = mission.substring(0, 81);
        }
        if (solution.length > 81) {
            document.getElementById('sudoku-solution').value = solution.substring(0, 81);
        }

        // 验证只能是数字
        const missionInput = document.getElementById('sudoku-mission');
        const solutionInput = document.getElementById('sudoku-solution');

        missionInput.value = missionInput.value.replace(/[^\d]/g, '');
        solutionInput.value = solutionInput.value.replace(/[^\d]/g, '');

        // 更新字符计数
        document.getElementById('mission-count').textContent = missionInput.value.length + '/81';
        document.getElementById('solution-count').textContent = solutionInput.value.length + '/81';
    }

    function saveData() {
        const mission = document.getElementById('sudoku-mission').value.trim();
        const solution = document.getElementById('sudoku-solution').value.trim();

        if (mission.length !== 81 || solution.length !== 81) {
            showStatus('题目和答案都必须是81位数字！', 'error');
            return;
        }

        if (!/^\d+$/.test(mission) || !/^\d+$/.test(solution)) {
            showStatus('只能包含数字0-9！', 'error');
            return;
        }

        GM_setValue('sudoku_mission', mission);
        GM_setValue('sudoku_solution', solution);

        showStatus('✅ 数据保存成功！', 'success');
        console.log('保存的题目:', mission);
        console.log('保存的答案:', solution);
    }

    function clearData() {
        if (confirm('确定要清空所有数据吗？')) {
            GM_setValue('sudoku_mission', '');
            GM_setValue('sudoku_solution', '');
            document.getElementById('sudoku-mission').value = '';
            document.getElementById('sudoku-solution').value = '';
            document.getElementById('mission-count').textContent = '0/81';
            document.getElementById('solution-count').textContent = '0/81';
            showStatus('数据已清空', 'info');
        }
    }

    function fillSudoku(stepByStep = false) {
        const mission = GM_getValue('sudoku_mission', '');
        const solution = GM_getValue('sudoku_solution', '');

        if (!mission || !solution) {
            showStatus('请先保存题目和答案！', 'error');
            return;
        }

        if (!canvas) {
            showStatus('请先扫描Canvas', 'error');
            return;
        }

        const delay = parseInt(document.getElementById('delay-slider').value);

        console.log('开始填充Canvas数独...');
        console.log('题目:', mission);
        console.log('答案:', solution);
        console.log('延迟:', delay, 'ms');

        showStatus('开始填充...', 'info');

        let filledCount = 0;
        let currentIndex = 0;

        function fillNextCell() {
            if (currentIndex >= 81) {
                showStatus(`✅ 填充完成！共填充 ${filledCount} 个数字`, 'success');
                return;
            }

            const missionChar = mission.charAt(currentIndex);
            const solutionChar = solution.charAt(currentIndex);

            // 只填充空格（mission中为0的位置）
            if (missionChar === '0' && solutionChar !== '0') {
                const row = Math.floor(currentIndex / 9);
                const col = currentIndex % 9;

                // 计算点击位置（单元格中心偏上，避免点到边框）
                const clickX = canvasRect.left + (col * cellSize.width) + (cellSize.width * 0.5);
                const clickY = canvasRect.top + (row * cellSize.height) + (cellSize.height * 0.4);

                console.log(`填充 [${row},${col}] (索引${currentIndex}) = ${solutionChar}`);

                // 模拟点击
                simulateCanvasClick(clickX, clickY);

                // 等待一小段时间后输入数字
                setTimeout(() => {
                    simulateKeyPress(solutionChar);
                    filledCount++;

                    // 更新状态
                    const statusEl = document.getElementById('sudoku-status');
                    if (statusEl) {
                        statusEl.innerHTML = `填充中... ${currentIndex + 1}/81 (已填: ${filledCount})<br>
                                            <span style="font-size: 11px;">位置: [${row},${col}] 数字: ${solutionChar}</span>`;
                    }

                    // 继续下一个
                    currentIndex++;

                    if (stepByStep) {
                        setTimeout(fillNextCell, delay);
                    } else {
                        fillNextCell();
                    }
                }, 50);
            } else {
                // 这个位置不需要填充（已经是题目数字）
                currentIndex++;

                if (stepByStep) {
                    setTimeout(fillNextCell, delay / 2);
                } else {
                    fillNextCell();
                }
            }
        }

        fillNextCell();
    }

    function fillSelectedCells() {
        const mission = GM_getValue('sudoku_mission', '');
        const solution = GM_getValue('sudoku_solution', '');

        if (!mission || !solution) {
            showStatus('请先保存题目和答案！', 'error');
            return;
        }

        if (!canvas) {
            showStatus('请先扫描Canvas', 'error');
            return;
        }

        showStatus('准备填空格...', 'info');

        // 让用户选择要填充的位置
        const emptyCells = [];
        for (let i = 0; i < 81; i++) {
            if (mission.charAt(i) === '0' && solution.charAt(i) !== '0') {
                const row = Math.floor(i / 9);
                const col = i % 9;
                emptyCells.push({ index: i, row, col, number: solution.charAt(i) });
            }
        }

        if (emptyCells.length === 0) {
            showStatus('没有需要填充的空格', 'info');
            return;
        }

        showStatus(`找到 ${emptyCells.length} 个空格需要填充`, 'info');

        const delay = parseInt(document.getElementById('delay-slider').value);
        let currentCellIndex = 0;

        function fillNextSelectedCell() {
            if (currentCellIndex >= emptyCells.length) {
                showStatus(`✅ 空格填充完成！共填充 ${emptyCells.length} 个数字`, 'success');
                return;
            }

            const cell = emptyCells[currentCellIndex];
            const { row, col, number } = cell;

            // 计算点击位置
            const clickX = canvasRect.left + (col * cellSize.width) + (cellSize.width * 0.5);
            const clickY = canvasRect.top + (row * cellSize.height) + (cellSize.height * 0.4);

            console.log(`填充空格 [${row},${col}] = ${number}`);

            // 模拟点击
            simulateCanvasClick(clickX, clickY);

            // 输入数字
            setTimeout(() => {
                simulateKeyPress(number);

                // 更新状态
                const statusEl = document.getElementById('sudoku-status');
                if (statusEl) {
                    statusEl.innerHTML = `填充空格中... ${currentCellIndex + 1}/${emptyCells.length}<br>
                                        <span style="font-size: 11px;">位置: [${row},${col}] 数字: ${number}</span>`;
                }

                currentCellIndex++;
                setTimeout(fillNextSelectedCell, delay);
            }, 50);
        }

        fillNextSelectedCell();
    }

    function simulateCanvasClick(x, y) {
        console.log(`模拟点击: (${x.toFixed(1)}, ${y.toFixed(1)})`);

        // 方法1: 直接使用 Canvas 的 click() 方法
        if (canvas) {
            // 创建鼠标事件
            const eventInit = {
                view: unsafeWindow || window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: 0
            };

            // 发送完整的事件序列
            const events = [
                new MouseEvent('mousedown', eventInit),
                new MouseEvent('mouseup', eventInit),
                new MouseEvent('click', eventInit)
            ];

            events.forEach(event => {
                canvas.dispatchEvent(event);
            });

            // 确保 Canvas 获得焦点
            canvas.focus();

            return true;
        }

        return false;
    }

    function simulateKeyPress(key) {
        console.log(`模拟按键: ${key}`);

        // Canvas 游戏可能需要更具体的事件
        const eventTypes = ['keydown', 'keypress', 'keyup'];

        eventTypes.forEach(eventType => {
            const eventInit = {
                key: key,
                code: `Digit${key}`,
                keyCode: 48 + parseInt(key),
                bubbles: true,
                cancelable: true,
                view: unsafeWindow || window
            };

            const event = new KeyboardEvent(eventType, eventInit);

            // 发送到 Canvas
            if (canvas) {
                canvas.dispatchEvent(event);
            }
        });
    }

    function showStatus(message, type = 'info') {
        const statusEl = document.getElementById('sudoku-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `sudoku-status ${type}`;
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();