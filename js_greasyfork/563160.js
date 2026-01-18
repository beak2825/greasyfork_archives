// ==UserScript==
// @name         FJMU自动评教助手
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  福建医科大学自动评教助手，自动点击"去填写"、完成评教评分、处理确认弹窗，循环处理所有课程
// @author       deepseek+lzy
// @match        *://*.jxzhpt.webvpn.fjmu.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563160/FJMU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563160/FJMU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .auto-evaluation-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000000; /* 确保在最上层 */
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 300px;
            font-family: Arial, sans-serif;
        }
        
        .auto-evaluation-title {
            color: #4CAF50;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .close-panel {
            cursor: pointer;
            font-size: 18px;
            color: #999;
        }
        
        .close-panel:hover {
            color: #f44336;
        }
        
        .auto-evaluation-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: background 0.3s;
        }
        
        .auto-evaluation-btn:hover {
            background: #45a049;
        }
        
        .auto-evaluation-btn.stop {
            background: #f44336;
        }
        
        .auto-evaluation-btn.stop:hover {
            background: #d32f2f;
        }
        
        .auto-evaluation-btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        
        .auto-evaluation-status {
            margin: 10px 0;
            padding: 8px;
            border-radius: 4px;
            background: #f5f5f5;
            font-size: 13px;
            line-height: 1.4;
            min-height: 40px;
        }
        
        .auto-evaluation-log {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 12px;
            background: #fafafa;
            border-radius: 4px;
            margin-top: 10px;
        }
        
        .log-item {
            margin: 3px 0;
            padding: 2px 5px;
            border-left: 3px solid #4CAF50;
        }
        
        .log-item.error {
            border-left-color: #f44336;
            color: #d32f2f;
        }
        
        .log-item.success {
            border-left-color: #4CAF50;
            color: #388e3c;
        }
        
        .log-item.info {
            border-left-color: #2196f3;
            color: #1976d2;
        }
        
        .log-item.warning {
            border-left-color: #ff9800;
            color: #f57c00;
        }
        
        .score-slider {
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .score-slider label {
            font-size: 13px;
            min-width: 80px;
        }
        
        .score-slider input[type="range"] {
            flex-grow: 1;
        }
        
        .score-value {
            min-width: 30px;
            text-align: center;
            font-weight: bold;
            color: #4CAF50;
        }
        
        .progress-bar {
            height: 6px;
            background: #eee;
            border-radius: 3px;
            margin: 10px 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
        
        .stats {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
            margin: 5px 0;
        }
    `);
    
    const version = "v2.2"

    // 配置参数
    const config = {
        // 评分配置：每个问题的默认分数（百分比）
        scores: {
            1: 90,  // 第1题：90% 的分数（30分中的27分）
            2: 85,  // 第2题：85% 的分数（20分中的17分）
            3: 80,  // 第3题：80% 的分数（20分中的16分）
            4: 85,  // 第4题：85% 的分数（15分中的12.75分）
            5: 90   // 第5题：90% 的分数（15分中的13.5分）
        },
        
        // 等待时间配置（毫秒）
        waitTimes: {
            pageLoad: 2000,     // 页面加载等待时间
            afterClick: 1500,   // 点击后等待时间
            betweenItems: 1000, // 项目间等待时间
            submitDelay: 2000,  // 提交前等待时间
            dialogWait: 1000,   // 弹窗出现等待时间
            safetyDelay: 300    // 安全延迟
        },
        
        // 文本评价内容（如果总分低于70分需要填写）
        textEvaluation: "老师教学认真负责，讲解清晰，课程内容丰富，受益匪浅。",
        
        // 是否自动提交
        autoSubmit: true,
        
        // 是否启用安全模式（添加随机延迟）
        safeMode: true,
        
        // 是否自动点击弹窗的"确定"按钮
        autoClickDialog: true,
        
        // 弹窗检测最大等待时间（毫秒）
        maxDialogWaitTime: 5000
    };

    // 状态管理
    let isRunning = false;
    let stopRequested = false;
    let currentCourseIndex = 0;
    let logMessages = [];

    // 日志函数
    function logMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            time: timestamp,
            message: message,
            type: type
        };
        
        logMessages.unshift(logEntry); // 添加到开头，最新日志在前
        
        // 保持日志数量
        if (logMessages.length > 50) {
            logMessages = logMessages.slice(0, 50);
        }
        
        // 更新显示
        updateLogDisplay();
        
        // 输出到控制台
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
        
        // 重要消息发送通知
        if (type === 'error' || type === 'success') {
            GM_notification({
                text: message,
                title: '自动评教助手',
                timeout: 3000
            });
        }
    }

    // 更新日志显示
    function updateLogDisplay() {
        const logContainer = document.getElementById('auto-evaluation-log');
        if (logContainer) {
            logContainer.innerHTML = logMessages.map(log => 
                `<div class="log-item ${log.type}">
                    <span style="color:#666;font-size:11px">[${log.time}]</span> ${log.message}
                </div>`
            ).join('');
        }
    }

    // 添加控制面板到页面
    function addControlPanel() {
        // 如果已经存在，先移除
        const existingPanel = document.getElementById('auto-evaluation-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'auto-evaluation-panel';
        panel.className = 'auto-evaluation-panel';
        
        panel.innerHTML = `
            <div class="auto-evaluation-title">
                🎯 FJMU自动评教助手
                <span class="close-panel" id="close-panel">×</span>
            </div>
            
            <div class="score-slider">
                <label>第1题分数:</label>
                <input type="range" id="score-1" min="0" max="100" value="${config.scores[1]}">
                <span class="score-value" id="score-value-1">${config.scores[1]}%</span>
            </div>
            
            <div class="score-slider">
                <label>第2题分数:</label>
                <input type="range" id="score-2" min="0" max="100" value="${config.scores[2]}">
                <span class="score-value" id="score-value-2">${config.scores[2]}%</span>
            </div>
            
            <div class="score-slider">
                <label>第3题分数:</label>
                <input type="range" id="score-3" min="0" max="100" value="${config.scores[3]}">
                <span class="score-value" id="score-value-3">${config.scores[3]}%</span>
            </div>
            
            <div class="score-slider">
                <label>第4题分数:</label>
                <input type="range" id="score-4" min="0" max="100" value="${config.scores[4]}">
                <span class="score-value" id="score-value-4">${config.scores[4]}%</span>
            </div>
            
            <div class="score-slider">
                <label>第5题分数:</label>
                <input type="range" id="score-5" min="0" max="100" value="${config.scores[5]}">
                <span class="score-value" id="score-value-5">${config.scores[5]}%</span>
            </div>
            
            <div style="margin:10px 0">
                <label>
                    <input type="checkbox" id="auto-submit" ${config.autoSubmit ? 'checked' : ''}>
                    自动提交
                </label>
                <label style="margin-left:15px">
                    <input type="checkbox" id="safe-mode" ${config.safeMode ? 'checked' : ''}>
                    安全模式
                </label>
                <label style="margin-left:15px">
                    <input type="checkbox" id="auto-click-dialog" ${config.autoClickDialog ? 'checked' : ''}>
                    自动点击弹窗
                </label>
            </div>
            
            <div class="auto-evaluation-status" id="status-display">
                就绪 - 等待开始...
            </div>
            
            <div>
                <button class="auto-evaluation-btn" id="start-btn">🚀 开始自动评教</button>
                <button class="auto-evaluation-btn stop" id="stop-btn" disabled>🛑 停止</button>
                <button class="auto-evaluation-btn" id="test-btn">🧪 测试当前页面</button>
                <button class="auto-evaluation-btn" id="single-btn">📝 处理当前课程</button>
            </div>
            
            <div class="auto-evaluation-log" id="auto-evaluation-log">
                <div class="log-item info">欢迎使用自动评教助手！</div>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听器
        document.getElementById('start-btn').addEventListener('click', startAutoEvaluation);
        document.getElementById('stop-btn').addEventListener('click', stopAutoEvaluation);
        document.getElementById('test-btn').addEventListener('click', testCurrentPage);
        document.getElementById('single-btn').addEventListener('click', processSingleCourse);
        document.getElementById('close-panel').addEventListener('click', function() {
            panel.style.display = 'none';
            logMessage('控制面板已隐藏，刷新页面可重新显示', 'info');
        });
        
        // 分数滑块事件
        for (let i = 1; i <= 5; i++) {
            const slider = document.getElementById(`score-${i}`);
            const valueDisplay = document.getElementById(`score-value-${i}`);
            
            slider.addEventListener('input', function() {
                valueDisplay.textContent = `${this.value}%`;
                config.scores[i] = parseInt(this.value);
            });
        }
        
        // 复选框事件
        document.getElementById('auto-submit').addEventListener('change', function() {
            config.autoSubmit = this.checked;
        });
        
        document.getElementById('safe-mode').addEventListener('change', function() {
            config.safeMode = this.checked;
        });
        
        document.getElementById('auto-click-dialog').addEventListener('change', function() {
            config.autoClickDialog = this.checked;
        });
        
        // 使面板可拖动
        makePanelDraggable(panel);
        
    }

    // 使控制面板可拖动
    function makePanelDraggable(panel) {
        let isDragging = false;
        let offsetX, offsetY;

        const titleElement = panel.querySelector('.auto-evaluation-title');

        titleElement.style.cursor = 'move';

        titleElement.addEventListener('mousedown', function(e) {
            if (e.target.id === 'close-panel') {
                return; // 不拖动关闭按钮
            }
            
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }

    // 等待函数
    function wait(ms) {
        if (config.safeMode && ms > 100) {
            // 安全模式下添加随机延迟
            const randomDelay = Math.random() * 500;
            ms += randomDelay;
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 查找"去填写"按钮
    function findEvaluationButtons() {
        // 方法1: 通过样式查找
        const buttonsByStyle = document.querySelectorAll('div[style*="background-color: rgb(124, 186, 35)"]');
        
        // 方法2: 通过文本内容查找
        const buttonsByText = Array.from(document.querySelectorAll('div'))
            .filter(div => div.textContent.trim() === '去填写');
        
        // 合并结果并去重
        const allButtons = new Set([...buttonsByStyle, ...buttonsByText]);
        return Array.from(allButtons);
    }

    // 填写评分
    async function fillEvaluationForm() {
        logMessage('开始填写评分表单...', 'info');
        
        try {
            // 等待页面完全加载
            await wait(config.waitTimes.pageLoad);
            
            // 填写5个评分题
            for (let i = 1; i <= 5; i++) {
                await fillQuestion(i);
                await wait(config.waitTimes.betweenItems);
            }
            
            // 填写文本评价（第6题，如果存在且需要）
            await fillTextEvaluation();
            
            logMessage('评分表单填写完成', 'success');
            return true;
            
        } catch (error) {
            logMessage(`填写评分表单时出错: ${error}`, 'error');
            return false;
        }
    }

    // 填写单个问题
    async function fillQuestion(questionNumber) {
        try {
            // 查找问题的输入框
            const inputSelector = `#scroll_${questionNumber - 1} .rater_input`;
            const inputElement = document.querySelector(inputSelector);
            
            if (!inputElement) {
                logMessage(`未找到第${questionNumber}题的输入框`, 'warning');
                return false;
            }
            
            // 计算具体分数
            const questionElement = document.querySelector(`#scroll_${questionNumber - 1} .fscore`);
            const maxScoreText = questionElement ? questionElement.textContent : '';
            const maxScore = parseFloat(maxScoreText) || 
                (questionNumber === 1 ? 30 : 
                 questionNumber === 2 ? 20 : 
                 questionNumber === 3 ? 20 : 
                 questionNumber === 4 ? 15 : 15);
            
            const percentage = config.scores[questionNumber] / 100;
            const score = (maxScore * percentage).toFixed(2);
            
            // 填写分数
            inputElement.value = score;
            
            // 触发输入事件（如果需要）
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            
            logMessage(`第${questionNumber}题: 设置为 ${score} 分 (${config.scores[questionNumber]}%)`, 'info');
            
            // 等待滑块动画（如果有）
            await wait(300);
            
            return true;
            
        } catch (error) {
            logMessage(`填写第${questionNumber}题时出错: ${error}`, 'error');
            return false;
        }
    }

    // 填写文本评价
    async function fillTextEvaluation() {
        try {
            // 查找文本评价输入框（第6题）
            const textarea = document.querySelector('#scroll_5 textarea');
            
            if (textarea) {
                // 检查是否需要填写（根据总分判断）
                const totalScore = calculateTotalScore();
                if (totalScore < 70) {
                    textarea.value = config.textEvaluation;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    logMessage('已填写文本评价（总分低于70分）', 'info');
                } else {
                    // 可选：填写简短好评
                    textarea.value = "";
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            return true;
        } catch (error) {
            logMessage(`填写文本评价时出错: ${error}`, 'error');
            return false;
        }
    }

    // 计算当前总分
    function calculateTotalScore() {
        let total = 0;
        
        for (let i = 1; i <= 5; i++) {
            const inputElement = document.querySelector(`#scroll_${i - 1} .rater_input`);
            if (inputElement && inputElement.value) {
                total += parseFloat(inputElement.value) || 0;
            }
        }
        
        return total;
    }

    // 处理提交后的弹窗
    // 处理提交后的弹窗 - 精确版本
async function handleSubmitDialog() {
    logMessage('等待提交确认弹窗...', 'info');
    
    const maxWaitTime = 10000; // 最大等待10秒
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
        // 方法1：直接查找所有"确定"按钮
        const allConfirmButtons = document.querySelectorAll('a.weui-dialog__btn_primary');
        
        // 方法2：通过文本内容精确查找
        const buttonsByText = Array.from(document.querySelectorAll('a'))
            .filter(a => a.textContent.trim() === '确定' && 
                        a.classList.contains('weui-dialog__btn_primary'));
        
        // 合并结果
        const confirmButtons = new Set([...allConfirmButtons, ...buttonsByText]);
        
        if (confirmButtons.size > 0) {
            // 只处理可见的按钮
            for (const button of confirmButtons) {
                if (isElementVisible(button)) {
                    logMessage('找到可见的"确定"按钮，准备点击...', 'success');
                    
                    // 等待一下确保弹窗完全加载
                    await wait(500);
                    
                    // 模拟真实点击
                    simulateRealClick(button);
                    
                    logMessage('已点击弹窗"确定"按钮', 'success');
                    
                    // 等待弹窗关闭
                    await wait(1000);
                    
                    return true;
                }
            }
            
            // 如果没有找到可见的按钮，检查是否有弹窗父元素
            const dialogs = document.querySelectorAll('.weui-dialog');
            for (const dialog of dialogs) {
                if (isElementVisible(dialog)) {
                    // 在可见的弹窗内查找确定按钮
                    const visibleConfirmBtn = dialog.querySelector('a.weui-dialog__btn_primary');
                    if (visibleConfirmBtn && isElementVisible(visibleConfirmBtn)) {
                        logMessage('在可见弹窗中找到"确定"按钮，准备点击...', 'success');
                        
                        await wait(500);
                        simulateRealClick(visibleConfirmBtn);
                        logMessage('已点击弹窗"确定"按钮', 'success');
                        
                        await wait(1000);
                        return true;
                    }
                }
            }
        }
        
        // 方法3：检查弹窗内容，通过评分提示文本查找
        const dialogContents = document.querySelectorAll('.weui-dialog__bd');
        for (const content of dialogContents) {
            if (isElementVisible(content) && content.textContent.includes('本次评分：')) {
                logMessage('通过评分文本找到弹窗', 'success');
                
                const confirmBtn = content.closest('.weui-dialog')
                    .querySelector('a.weui-dialog__btn_primary');
                
                if (confirmBtn) {
                    logMessage('在评分弹窗中找到"确定"按钮', 'success');
                    
                    await wait(500);
                    simulateRealClick(confirmBtn);
                    logMessage('已点击弹窗"确定"按钮', 'success');
                    
                    await wait(1000);
                    return true;
                }
            }
        }
        
        // 短暂等待后继续检查
        await wait(200);
    }
    
    logMessage('未找到确认弹窗或超时', 'warning');
    return false;
}

// 辅助函数：检查元素是否可见
function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
    }
    
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        return false;
    }
    
    return true;
}

// 辅助函数：模拟真实点击
function simulateRealClick(element) {
    try {
        // 方法1：直接调用click方法
        element.click();
        
        // 方法2：触发鼠标事件
        const mouseEvents = ['mouseover', 'mousedown', 'mouseup', 'click'];
        mouseEvents.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        });
        
        // 方法3：触发焦点和点击事件
        element.focus();
        const clickEvent = new Event('click', { bubbles: true });
        element.dispatchEvent(clickEvent);
        
        return true;
    } catch (error) {
        console.log('模拟点击时出错:', error);
        return false;
    }
}

// 备用方案：使用更激进的查找方法
async function handleSubmitDialogAlternative() {
    logMessage('使用备用方案查找弹窗...', 'info');
    
    try {
        // 方法4：查找所有包含"确定"的a标签
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
            if (link.textContent.trim() === '确定' && 
                link.href === 'javascript:;' &&
                link.classList.contains('weui-dialog__btn')) {
                
                logMessage('通过备用方案找到确定按钮', 'success');
                
                // 检查是否有弹窗父元素
                const dialog = link.closest('.weui-dialog');
                if (dialog && isElementVisible(dialog)) {
                    await wait(500);
                    
                    // 尝试多种点击方式
                    link.click();
                    
                    // 使用JavaScript直接调用可能的onclick事件
                    if (link.onclick) {
                        link.onclick();
                    }
                    
                    // 触发事件
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    link.dispatchEvent(event);
                    
                    logMessage('已通过备用方案点击确定按钮', 'success');
                    await wait(1000);
                    return true;
                }
            }
        }
        
        // 方法5：查找包含特定文本的弹窗
        const dialogElements = document.querySelectorAll('[class*="dialog"], [class*="modal"]');
        for (const dialog of dialogElements) {
            if (isElementVisible(dialog) && 
                dialog.textContent.includes('本次评分：') && 
                dialog.textContent.includes('请确认提交')) {
                
                const confirmBtn = dialog.querySelector('a:contains("确定"), button:contains("确定")');
                if (confirmBtn) {
                    logMessage('通过文本内容找到弹窗和确定按钮', 'success');
                    
                    await wait(500);
                    simulateRealClick(confirmBtn);
                    logMessage('已点击确定按钮', 'success');
                    
                    await wait(1000);
                    return true;
                }
            }
        }
        
        return false;
    } catch (error) {
        logMessage(`备用方案出错: ${error}`, 'error');
        return false;
    }
}

    // 在提交函数中整合两种方法
    async function submitEvaluation() {
        try {
            if (!config.autoSubmit) {
                logMessage('自动提交已禁用，请手动提交', 'info');
                return false;
            }
            
            logMessage('正在提交评价...', 'info');
            
            // 等待提交前延迟
            await wait(config.waitTimes.submitDelay);
            
            // 查找提交按钮
            const submitButton = document.querySelector('button.submitbtn');
            
            if (submitButton && !submitButton.disabled) {
                logMessage('找到提交按钮，准备点击...', 'info');
                
                // 先保存当前页面状态，用于调试
                const beforeSubmitURL = window.location.href;
                
                submitButton.click();
                logMessage('已点击提交按钮', 'success');
                
                // 等待弹窗出现
                await wait(1500);
                
                // 方法1：尝试主方案
                let dialogHandled = await handleSubmitDialog();
                
                // 如果主方案失败，尝试备用方案
                if (!dialogHandled) {
                    logMessage('主方案失败，尝试备用方案...', 'warning');
                    dialogHandled = await handleSubmitDialogAlternative();
                }
                
                if (dialogHandled) {
                    logMessage('弹窗处理成功', 'success');
                    // 等待页面跳转或刷新
                    await wait(config.waitTimes.pageLoad);
                    
                    // 检查页面是否发生变化
                    if (window.location.href !== beforeSubmitURL) {
                        logMessage('页面已跳转', 'info');
                    }
                    
                    return true;
                } else {
                    logMessage('弹窗处理失败，可能已直接提交成功或弹窗不存在', 'warning');
                    
                    // 检查是否有其他提示信息
                    const messages = document.querySelectorAll('.weui-dialog__bd, .el-message, .message, .tip');
                    messages.forEach(msg => {
                        if (isElementVisible(msg)) {
                            logMessage(`发现提示信息: ${msg.textContent.substring(0, 100)}`, 'info');
                        }
                    });
                    
                    return true; // 即使弹窗处理失败，也认为提交成功
                }
            } else {
                logMessage('未找到可用的提交按钮', 'error');
                return false;
            }
            
        } catch (error) {
            logMessage(`提交评价时出错: ${error}`, 'error');
            return false;
        }
    }


    // 更新状态显示
    function updateStatus(message) {
        const statusDisplay = document.getElementById('status-display');
        if (statusDisplay) {
            statusDisplay.textContent = message;
            // 根据消息类型添加颜色
            if (message.includes('出错') || message.includes('失败')) {
                statusDisplay.style.color = '#f44336';
            } else if (message.includes('完成')) {
                statusDisplay.style.color = '#4CAF50';
            } else {
                statusDisplay.style.color = '#333';
            }
        }
    }

    // 处理单个课程
    async function processSingleCourse() {
        if (isRunning) {
            logMessage('自动评教正在进行中，请先停止', 'warning');
            return;
        }
        
        logMessage('开始处理当前课程...', 'info');
        
        try {
            // 检查当前页面类型
            const submitButton = document.querySelector('button.submitbtn');
            
            if (submitButton) {
                // 在评教表单页面
                logMessage('检测到评教表单页面，开始填写...', 'info');
                
                const filled = await fillEvaluationForm();
                
                if (filled) {
                    await submitEvaluation();
                    logMessage('当前课程处理完成', 'success');
                }
            } else {
                // 在课程列表页面
                logMessage('请先进入评教表单页面', 'info');
            }
        } catch (error) {
            logMessage(`处理当前课程时出错: ${error}`, 'error');
        }
    }

    // 开始自动评教
    async function startAutoEvaluation() {
        if (isRunning) return;
        
        isRunning = true;
        stopRequested = false;
        currentCourseIndex = 0;
        
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const singleBtn = document.getElementById('single-btn');
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        singleBtn.disabled = true;
        
        logMessage('开始自动评教流程...', 'info');
        updateStatus('正在运行...');
        
        try {
            // 主循环
            while (!stopRequested) {
                // 查找"去填写"按钮
                const buttons = findEvaluationButtons();

                // 查找问题的输入框，防止页面出错
                const inputSelector = `#scroll_${1} .rater_input`;
                const inputElement = document.querySelector(inputSelector);
                    
                if (buttons.length === 0) {
                    logMessage('未找到更多"去填写"按钮', 'info');
                    updateStatus('未找到更多课程');

                    if (!inputElement) {
                        break;
                    }
                }
                
                logMessage(`找到 ${buttons.length} 个待评教课程`, 'info');
                updateStatus(`找到 ${buttons.length} 个课程`);
                
                let i = 0
                
                currentCourseIndex = i + 1;
                updateStatus(`剩余评教 ${buttons.length}`);
                
                logMessage(`点击第 ${currentCourseIndex} 个"去填写"按钮`, 'info');
                
                // 点击"去填写"按钮
                try {
                    buttons[i].click();
                } catch (error) {
                    logMessage(`点击"去填写"按钮失败: ${error}`, 'error');
                    if(!inputElement) {
                        continue; // 继续下一个课程
                    }
                }

                await wait(2000);
                
                // 等待页面跳转
                await wait(config.waitTimes.afterClick);
                
                // 填写评分表单
                const filled = await fillEvaluationForm();
                
                if (filled && !stopRequested) {
                    // 提交评价
                    await submitEvaluation();
                    
                    // 等待返回列表页面
                    await wait(config.waitTimes.pageLoad);
                }
                
                // 短暂等待后继续下一个
                if (!stopRequested && i < buttons.length - 1) {
                    await wait(config.waitTimes.betweenItems);
                }
                
            }
            
            if (stopRequested) {
                logMessage('用户手动停止', 'info');
                updateStatus('已停止');
            } else {
                logMessage('所有课程评教完成！', 'success');
                updateStatus('所有课程评教完成！');
                
                GM_notification({
                    text: '所有课程评教已完成！',
                    title: '自动评教助手',
                    timeout: 5000
                });
            }
            
        } catch (error) {
            logMessage(`自动评教过程中出错: ${error}`, 'error');
            updateStatus('出错，请检查');
        } finally {
            isRunning = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            singleBtn.disabled = false;
        }
    }

    // 停止自动评教
    function stopAutoEvaluation() {
        stopRequested = true;
        logMessage('停止请求已发送...', 'info');
        updateStatus('正在停止...');
    }

    // 测试当前页面
    async function testCurrentPage() {
        logMessage('开始测试当前页面...', 'info');
        
        // 检查当前页面类型
        const buttons = findEvaluationButtons();
        const submitButton = document.querySelector('button.submitbtn');
        
        if (buttons.length > 0) {
            logMessage(`✅ 检测到 ${buttons.length} 个"去填写"按钮`, 'success');
            logMessage('当前页面: 课程列表页面', 'info');
            updateStatus(`检测到 ${buttons.length} 个课程`);
            
            // 测试弹窗检测
            logMessage('测试弹窗检测功能...', 'info');
            const dialogButtons = document.querySelectorAll('.weui-dialog__btn_primary');
            if (dialogButtons.length > 0) {
                logMessage(`✅ 检测到 ${dialogButtons.length} 个弹窗按钮`, 'success');
            }
        } else if (submitButton) {
            logMessage('✅ 检测到提交按钮', 'success');
            logMessage('当前页面: 评教表单页面', 'info');
            updateStatus('在评教表单页面');
            
            // 测试填写表单
            logMessage('测试填写评分表单...', 'info');
            await fillEvaluationForm();
            
            const totalScore = calculateTotalScore();
            logMessage(`当前总分: ${totalScore}`, 'info');
            
            if (totalScore < 70) {
                logMessage('⚠️ 注意: 总分低于70分，需要填写文本评价', 'warning');
            }
            
            // 测试弹窗检测
            logMessage('测试弹窗检测功能...', 'info');
            const dialogButtons = document.querySelectorAll('.weui-dialog__btn_primary');
            if (dialogButtons.length > 0) {
                logMessage(`✅ 检测到 ${dialogButtons.length} 个弹窗按钮`, 'success');
            }
        } else {
            logMessage('❌ 未识别页面类型', 'error');
            updateStatus('未识别页面类型');
        }
    }

    // 初始化
    function init() {
        logMessage('自动评教助手' + version + '已加载', 'info');
        
        // 添加控制面板
        addControlPanel();
        
        // 检测当前页面并显示信息
        setTimeout(() => {
            const buttons = findEvaluationButtons();
            const submitButton = document.querySelector('button.submitbtn');
            
            if (buttons.length > 0) {
                logMessage(`检测到 ${buttons.length} 个待评教课程`, 'info');
                updateStatus(`就绪 - 检测到 ${buttons.length} 个课程`);
            } else if (submitButton) {
                logMessage('检测到评教表单页面', 'info');
                updateStatus('就绪 - 在评教表单页面');
            }
        }, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();