// ==UserScript==
// @name         批量兑换助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动化批量兑换工具，支持延迟控制和结果导出
// @author       Claude
// @license      MIT
// @match        https://api.vectorengine.ai/console/topup*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560944/%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560944/%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 状态管理 ====================
    let isRunning = false;
    let codes = [];
    let results = [];
    let currentIndex = 0;
    let redeemDelay = 1000;
    let stopRequested = false;
    let panelVisible = false;

    // ==================== 工具函数 ====================

    // 存储函数（替代 chrome.storage）
    const storage = {
        get: (keys, callback) => {
            const result = {};
            if (Array.isArray(keys)) {
                keys.forEach(key => {
                    result[key] = GM_getValue(key, null);
                });
            } else {
                result[keys] = GM_getValue(keys, null);
            }
            if (callback) callback(result);
            return result;
        },
        set: (items, callback) => {
            for (const [key, value] of Object.entries(items)) {
                GM_setValue(key, value);
            }
            if (callback) callback();
        }
    };

    // 解析兑换码（支持任意格式分隔）
    function parseCodes(text) {
        if (!text || text.trim() === '') return [];
        const codePattern = /[A-Za-z0-9-_]{4,}/g;
        const found = text.match(codePattern) || [];
        return [...new Set(found)].filter(code => code.length >= 4);
    }

    // 延迟函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== 元素查找 ====================

    // 查找元素（支持多种选择器）
    function findElement(selectors) {
        const selectorList = selectors.split(',').map(s => s.trim());

        for (const selector of selectorList) {
            // 处理 :contains() 伪选择器
            if (selector.includes(':contains(')) {
                const match = selector.match(/^([^:]+):contains\(['"](.+?)['"]\)$/);
                if (match) {
                    const [, baseSelector, text] = match;
                    const elements = document.querySelectorAll(baseSelector);
                    for (const el of elements) {
                        if (el.textContent.includes(text)) {
                            return el;
                        }
                    }
                    continue;
                }
            }

            // 普通选择器
            try {
                const element = document.querySelector(selector);
                if (element) return element;
            } catch (e) {
                // 忽略无效选择器
            }
        }

        return null;
    }

    // 查找输入框
    function findInput(inputSelector) {
        // 首先尝试用户配置的选择器
        if (inputSelector) {
            const customInput = findElement(inputSelector);
            if (customInput) return customInput;
        }

        // 尝试常见的输入框模式
        const patterns = [
            'input[type="text"]',
            'input:not([type])',
            'input[type*="text"]',
            'input[placeholder*="兑换"]',
            'input[placeholder*="码"]',
            'input[name*="code"]',
            'input[name*="redeem"]',
            'input[id*="code"]',
            'input[id*="redeem"]',
            '.semi-input[type="text"]',
            '.ant-input',
            'textarea[placeholder*="兑换"]',
            'textarea[placeholder*="码"]',
        ];

        for (const pattern of patterns) {
            const elements = document.querySelectorAll(pattern);
            for (const el of elements) {
                if (el.offsetParent !== null) {
                    return el;
                }
            }
        }

        return null;
    }

    // 查找确认按钮
    function findButton(buttonSelector) {
        // 首先尝试用户配置的选择器
        if (buttonSelector) {
            const customButton = findElement(buttonSelector);
            if (customButton) return customButton;
        }

        // 尝试常见的按钮模式
        const patterns = [
            'button[type="submit"]',
            'button:not([disabled])',
            'input[type="submit"]',
            '.semi-button-primary:not([disabled])',
            '.ant-btn-primary',
            '.ant-btn-primary:not([disabled])',
        ];

        const textPatterns = ['确认', '兑换', '提交', '立即兑换', '确定', 'Exchange', 'Redeem', 'Submit'];

        for (const pattern of patterns) {
            const elements = document.querySelectorAll(pattern);
            for (const el of elements) {
                if (el.offsetParent !== null && !el.disabled) {
                    return el;
                }
            }
        }

        // 按文本查找按钮
        const allButtons = document.querySelectorAll('button, [role="button"]');
        for (const btn of allButtons) {
            if (btn.offsetParent && !btn.disabled) {
                const text = btn.textContent.trim();
                if (textPatterns.some(p => text.includes(p))) {
                    return btn;
                }
            }
        }

        return null;
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve) => {
            const element = findElement(selector);
            if (element) {
                resolve(element);
                return;
            }

            const startTime = Date.now();
            const interval = setInterval(() => {
                const el = findElement(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 100);
        });
    }

    // 检查兑换结果
    function checkRedeemResult() {
        // 检查失败提示
        const failPatterns = [
            /兑换失败|失败|无效|已使用|过期|不存在|错误|error|failed|invalid|expired|used/i
        ];

        // 检查成功提示
        const successPatterns = [
            /兑换成功|成功|已兑换|已到账|completed|success/i
        ];

        const pageText = document.body.textContent;

        // 优先检查失败
        for (const pattern of failPatterns) {
            if (pattern.test(pageText)) {
                return { success: false, message: '兑换失败' };
            }
        }

        // 检查成功
        for (const pattern of successPatterns) {
            if (pattern.test(pageText)) {
                return { success: true };
            }
        }

        // 检查成功消息元素
        const successElements = document.querySelectorAll(
            '.success, .success-message, [class*="success"], .ant-message-success, .semi-notification-success'
        );
        for (const el of successElements) {
            if (el.offsetParent && /成功|success/i.test(el.textContent)) {
                return { success: true };
            }
        }

        // 无法确定，假设成功
        return { success: true };
    }

    // ==================== 兑换核心逻辑 ====================

    // 执行单个兑换
    async function redeemCode(code, inputSelector, buttonSelector) {
        try {
            updateStatus(`正在兑换: ${code}...`);
            addResultItem(code, 'pending');

            // 查找输入框
            const input = findInput(inputSelector);
            if (!input) {
                throw new Error('找不到输入框，请检查选择器配置');
            }

            // 清空并输入兑换码
            input.value = '';
            input.focus();

            // 触发输入事件（确保框架能检测到变化）
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            )?.set;

            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(input, code);
            } else {
                input.value = code;
            }

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));

            await delay(300);

            // 查找并点击按钮
            const button = findButton(buttonSelector);
            if (!button) {
                throw new Error('找不到确认按钮，请检查选择器配置');
            }

            button.click();
            button.dispatchEvent(new Event('click', { bubbles: true }));

            // 等待响应
            await delay(redeemDelay);

            // 检查结果
            const result = checkRedeemResult();
            updateResultItem(code, result.success ? 'success' : 'fail', result.message);

            return result.success;

        } catch (error) {
            updateResultItem(code, 'fail', error.message);
            return false;
        }
    }

    // 批量兑换主流程
    async function runBatchRedeem(inputSelector, buttonSelector) {
        isRunning = true;
        stopRequested = false;
        currentIndex = 0;
        results = [];

        for (const code of codes) {
            if (stopRequested) {
                updateStatus('已停止', 'normal');
                break;
            }

            currentIndex++;
            updateProgress();

            await redeemCode(code, inputSelector, buttonSelector);

            // 每次兑换后等待
            if (codes.indexOf(code) < codes.length - 1) {
                await delay(redeemDelay);
            }
        }

        isRunning = false;

        // 更新按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('exportBtn').disabled = false;

        const successCount = results.filter(r => r.status === 'success').length;
        const failCount = results.filter(r => r.status === 'fail').length;
        updateStatus(`完成! 成功: ${successCount}, 失败: ${failCount}`, 'normal');
    }

    // ==================== UI 更新函数 ====================

    function updateStatus(text, type = 'normal') {
        const statusDiv = document.getElementById('redeemStatus');
        if (statusDiv) {
            statusDiv.textContent = text;
            statusDiv.className = 'status ' + type;
        }
    }

    function updateProgress() {
        const currentProgressSpan = document.getElementById('currentProgress');
        const totalProgressSpan = document.getElementById('totalProgress');
        const successCountSpan = document.getElementById('successCount');
        const failCountSpan = document.getElementById('failCount');
        const progressFill = document.getElementById('progressFill');

        if (currentProgressSpan) currentProgressSpan.textContent = currentIndex;
        if (totalProgressSpan) totalProgressSpan.textContent = codes.length;

        const successCount = results.filter(r => r.status === 'success').length;
        const failCount = results.filter(r => r.status === 'fail').length;

        if (successCountSpan) successCountSpan.textContent = `成功: ${successCount}`;
        if (failCountSpan) failCountSpan.textContent = `失败: ${failCount}`;

        const progress = codes.length > 0 ? (currentIndex / codes.length) * 100 : 0;
        if (progressFill) progressFill.style.width = `${progress}%`;
    }

    function addResultItem(code, status) {
        const result = { code, status, message: '', time: new Date().toLocaleTimeString() };
        results.push(result);

        const resultsList = document.getElementById('resultsList');
        if (!resultsList) return;

        const item = document.createElement('div');
        item.className = `result-item ${status}`;
        item.id = `result-${code}`;

        item.innerHTML = `
            <span class="result-code">${code}</span>
            <span class="result-status ${status}">${status === 'success' ? '成功' : status === 'fail' ? '失败' : '处理中'}</span>
        `;

        resultsList.appendChild(item);
        resultsList.scrollTop = resultsList.scrollHeight;
    }

    function updateResultItem(code, status, message = '') {
        const item = document.getElementById(`result-${code}`);
        if (item) {
            const statusSpan = item.querySelector('.result-status');
            item.className = `result-item ${status}`;
            if (statusSpan) {
                statusSpan.className = `result-status ${status}`;
                statusSpan.textContent = status === 'success' ? '成功' : '失败';
            }
        }

        const result = results.find(r => r.code === code);
        if (result) {
            result.status = status;
            result.message = message;
        }
    }

    function updateCodeCount() {
        const codesTextarea = document.getElementById('codes');
        const codeCountSpan = document.getElementById('codeCount');
        if (codesTextarea && codeCountSpan) {
            codes = parseCodes(codesTextarea.value);
            codeCountSpan.textContent = codes.length;
        }
    }

    // ==================== 控制函数 ====================

    function startRedemption() {
        const codesTextarea = document.getElementById('codes');
        const delayInput = document.getElementById('delay');
        const inputSelectorInput = document.getElementById('inputSelector');
        const buttonSelectorInput = document.getElementById('buttonSelector');

        codes = parseCodes(codesTextarea.value);
        redeemDelay = parseInt(delayInput.value) || 1000;
        const inputSelector = inputSelectorInput.value;
        const buttonSelector = buttonSelectorInput.value;

        if (codes.length === 0) {
            updateStatus('请输入有效的兑换码', 'error');
            return;
        }

        // 更新 UI 状态
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('exportBtn').disabled = true;
        codesTextarea.disabled = true;

        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsList').innerHTML = '';

        updateStatus('兑换中...', 'running');
        updateProgress();

        // 开始兑换
        runBatchRedeem(inputSelector, buttonSelector);
    }

    function stopRedemption() {
        stopRequested = true;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('codes').disabled = false;
        updateStatus('正在停止...', 'normal');
    }

    function exportResults() {
        if (results.length === 0) {
            updateStatus('没有可导出的结果', 'error');
            return;
        }

        const success = results.filter(r => r.status === 'success');
        const fail = results.filter(r => r.status === 'fail');
        const pending = results.filter(r => r.status === 'pending');

        let content = `批量兑换结果报告\n`;
        content += `导出时间: ${new Date().toLocaleString()}\n`;
        content += `总计: ${results.length} | 成功: ${success.length} | 失败: ${fail.length} | 未完成: ${pending.length}\n`;
        content += `${'='.repeat(50)}\n\n`;

        if (success.length > 0) {
            content += `【成功兑换】(${success.length}个)\n`;
            success.forEach(r => {
                content += `  ${r.code} - ${r.time}\n`;
            });
            content += '\n';
        }

        if (fail.length > 0) {
            content += `【兑换失败】(${fail.length}个)\n`;
            fail.forEach(r => {
                content += `  ${r.code} - ${r.message || '未知错误'} - ${r.time}\n`;
            });
            content += '\n';
        }

        if (pending.length > 0) {
            content += `【未完成】(${pending.length}个)\n`;
            pending.forEach(r => {
                content += `  ${r.code}\n`;
            });
        }

        // 下载文件
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `兑换结果_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateStatus('结果已导出', 'normal');
    }

    function saveSettings() {
        storage.set({
            delay: document.getElementById('delay').value,
            inputSelector: document.getElementById('inputSelector').value,
            buttonSelector: document.getElementById('buttonSelector').value
        });
    }

    function togglePanel() {
        const panel = document.getElementById('redeemHelperPanel');
        const btn = document.getElementById('redeemToggleBtn');

        panelVisible = !panelVisible;

        if (panelVisible) {
            panel.classList.add('show');
            btn.textContent = '✖';
        } else {
            panel.classList.remove('show');
            btn.textContent = '🎟️';
        }
    }

    // ==================== 创建 UI 面板 ====================

    function createPanel() {
        // 如果面板已存在，直接返回
        if (document.getElementById('redeemHelperPanel')) {
            return;
        }

        // 恢复保存的设置
        const savedSettings = storage.get(['delay', 'inputSelector', 'buttonSelector']);
        const savedDelay = savedSettings.delay || 1000;
        const savedInputSelector = savedSettings.inputSelector || '';
        const savedButtonSelector = savedSettings.buttonSelector || '';

        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            #redeemToggleBtn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                cursor: pointer;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
                border: none;
                transition: transform 0.2s;
            }

            #redeemToggleBtn:hover {
                transform: scale(1.1);
            }

            #redeemHelperPanel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 380px;
                max-height: 80vh;
                overflow-y: auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 999998;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: none;
            }

            #redeemHelperPanel.show {
                display: block;
            }

            #redeemHelperPanel .panel-content {
                padding: 20px;
            }

            #redeemHelperPanel .header h2 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
            }

            #redeemHelperPanel .section {
                margin-bottom: 15px;
            }

            #redeemHelperPanel .section label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 13px;
                color: #333;
            }

            #redeemHelperPanel .section textarea {
                width: 100%;
                height: 100px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 13px;
                font-family: monospace;
                resize: vertical;
                box-sizing: border-box;
            }

            #redeemHelperPanel .section input[type="text"],
            #redeemHelperPanel .section input[type="number"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 13px;
                box-sizing: border-box;
            }

            #redeemHelperPanel .code-count {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }

            #redeemHelperPanel .code-count span {
                color: #667eea;
                font-weight: 600;
            }

            #redeemHelperPanel .delay-input {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            #redeemHelperPanel .delay-input input {
                flex: 1;
            }

            #redeemHelperPanel .hint {
                font-size: 11px;
                color: #999;
            }

            #redeemHelperPanel .actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            #redeemHelperPanel .btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            #redeemHelperPanel .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            #redeemHelperPanel .btn-primary:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            #redeemHelperPanel .btn-danger {
                background: #f56565;
                color: white;
            }

            #redeemHelperPanel .btn-danger:hover:not(:disabled) {
                background: #e53e3e;
            }

            #redeemHelperPanel .btn-secondary {
                background: #e2e8f0;
                color: #4a5568;
            }

            #redeemHelperPanel .btn-secondary:hover:not(:disabled) {
                background: #cbd5e0;
            }

            #redeemHelperPanel .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            #redeemHelperPanel .status {
                padding: 10px;
                border-radius: 8px;
                font-size: 13px;
                text-align: center;
                margin-bottom: 15px;
                background: #f7fafc;
                color: #4a5568;
            }

            #redeemHelperPanel .status.running {
                background: #bee3f8;
                color: #2b6cb0;
            }

            #redeemHelperPanel .status.error {
                background: #fed7d7;
                color: #c53030;
            }

            #redeemHelperPanel .progress-section {
                display: none;
                margin-top: 15px;
                padding: 15px;
                background: #f7fafc;
                border-radius: 8px;
            }

            #redeemHelperPanel .progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin-bottom: 8px;
            }

            #redeemHelperPanel .success { color: #48bb78; }
            #redeemHelperPanel .fail { color: #f56565; }

            #redeemHelperPanel .progress-bar {
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
            }

            #redeemHelperPanel .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                transition: width 0.3s;
                width: 0%;
            }

            #redeemHelperPanel .results-section {
                display: none;
                margin-top: 15px;
            }

            #redeemHelperPanel .results-section h3 {
                font-size: 14px;
                margin-bottom: 10px;
                color: #333;
            }

            #redeemHelperPanel .results-list {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 10px;
            }

            #redeemHelperPanel .result-item {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                border-radius: 6px;
                margin-bottom: 5px;
                font-size: 13px;
            }

            #redeemHelperPanel .result-item.pending {
                background: #fef3c7;
            }

            #redeemHelperPanel .result-item.success {
                background: #d1fae5;
            }

            #redeemHelperPanel .result-item.fail {
                background: #fee2e2;
            }

            #redeemHelperPanel .result-code {
                font-family: monospace;
                font-weight: 600;
            }

            #redeemHelperPanel .result-status {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 4px;
            }

            #redeemHelperPanel .result-status.success {
                background: #48bb78;
                color: white;
            }

            #redeemHelperPanel .result-status.fail {
                background: #f56565;
                color: white;
            }

            #redeemHelperPanel .result-status.pending {
                background: #ecc94b;
                color: white;
            }
        `;
        document.head.appendChild(style);

        // 创建悬浮按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'redeemToggleBtn';
        toggleBtn.textContent = '🎟️';
        toggleBtn.title = '批量兑换助手';
        toggleBtn.addEventListener('click', togglePanel);
        document.body.appendChild(toggleBtn);

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'redeemHelperPanel';
        panel.innerHTML = `
            <div class="panel-content">
                <div class="header">
                    <h2>批量兑换助手</h2>
                    <div class="status" id="redeemStatus">准备就绪</div>
                </div>

                <div class="section">
                    <label for="codes">兑换码列表</label>
                    <textarea
                        id="codes"
                        placeholder="粘贴兑换码，支持任意格式分隔&#10;例如：&#10;CODE1,CODE2,CODE3&#10;或&#10;CODE1 CODE2&#10;或每行一个"
                    ></textarea>
                    <div class="code-count">
                        已识别 <span id="codeCount">0</span> 个兑换码
                    </div>
                </div>

                <div class="section">
                    <label for="delay">兑换间隔（毫秒）</label>
                    <div class="delay-input">
                        <input type="number" id="delay" value="${savedDelay}" min="100" max="10000" step="100">
                        <span class="hint">建议 1000-3000ms</span>
                    </div>
                </div>

                <div class="section">
                    <label for="inputSelector">兑换码输入框选择器（可选）</label>
                    <input
                        type="text"
                        id="inputSelector"
                        value="${savedInputSelector}"
                        placeholder="留空自动识别"
                    >
                </div>

                <div class="section">
                    <label for="buttonSelector">确认按钮选择器（可选）</label>
                    <input
                        type="text"
                        id="buttonSelector"
                        value="${savedButtonSelector}"
                        placeholder="留空自动识别"
                    >
                </div>

                <div class="actions">
                    <button id="startBtn" class="btn btn-primary">开始兑换</button>
                    <button id="stopBtn" class="btn btn-danger" disabled>停止</button>
                    <button id="exportBtn" class="btn btn-secondary" disabled>导出</button>
                </div>

                <div class="progress-section" id="progressSection">
                    <div class="progress-info">
                        <span>进度: <span id="currentProgress">0</span> / <span id="totalProgress">0</span></span>
                        <span id="successCount" class="success">成功: 0</span>
                        <span id="failCount" class="fail">失败: 0</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>

                <div class="results-section" id="resultsSection">
                    <h3>兑换结果</h3>
                    <div id="resultsList" class="results-list"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('codes').addEventListener('input', updateCodeCount);
        document.getElementById('startBtn').addEventListener('click', startRedemption);
        document.getElementById('stopBtn').addEventListener('click', stopRedemption);
        document.getElementById('exportBtn').addEventListener('click', exportResults);
        document.getElementById('delay').addEventListener('change', saveSettings);
        document.getElementById('inputSelector').addEventListener('change', saveSettings);
        document.getElementById('buttonSelector').addEventListener('change', saveSettings);

        // 初始化兑换码计数
        updateCodeCount();
    }

    // ==================== 初始化 ====================

    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanel);
        } else {
            createPanel();
        }
    }

    // 注册菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('显示/隐藏兑换面板', togglePanel);
    }

    // 启动
    init();

})();
