// ==UserScript==
// @name         B4U批量兑换脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量兑换B4U兑换码，支持从剪贴板/输入框读取多个兑换码
// @author       You
// @match        https://b4u.qzz.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      b4u.qzz.io
// @downloadURL https://update.greasyfork.org/scripts/557960/B4U%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557960/B4U%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建UI界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'batch-topup-container';
        container.innerHTML = `
            <style>
                #batch-topup-container {
                    position: fixed;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                    width: 400px;
                    background: #fff;
                    border: 2px solid #1890ff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    color: #333;
                }
                #batch-topup-header {
                    background: #1890ff;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                }
                #batch-topup-content {
                    padding: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                #batch-topup-textarea {
                    width: 100%;
                    min-height: 150px;
                    padding: 8px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                    background: #fff;
                    color: #333;
                }
                .batch-topup-button {
                    background: #1890ff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    margin: 5px 5px 5px 0;
                }
                .batch-topup-button:hover {
                    background: #40a9ff;
                }
                .batch-topup-button:disabled {
                    background: #d9d9d9;
                    color: #999;
                    cursor: not-allowed;
                }
                #batch-topup-log {
                    margin-top: 12px;
                    padding: 8px;
                    background: #f5f5f5;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    font-size: 12px;
                }
                .log-item {
                    padding: 4px 0;
                    border-bottom: 1px solid #e8e8e8;
                }
                .log-item:last-child {
                    border-bottom: none;
                }
                .log-success {
                    color: #52c41a;
                }
                .log-error {
                    color: #f5222d;
                }
                .log-info {
                    color: #1890ff;
                }
                #batch-topup-stats {
                    margin: 10px 0;
                    padding: 8px;
                    background: #e6f7ff;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #333;
                }
                #batch-topup-toggle {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                }
                .batch-topup-label {
                    font-size: 13px;
                    margin-bottom: 6px;
                    color: #666;
                }
                .batch-topup-input-group {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 10px;
                }
                #batch-topup-delay {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    background: #fff;
                    color: #333;
                }
                #batch-topup-userid {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                }

                /* 深色模式适配 */
                @media (prefers-color-scheme: dark) {
                    #batch-topup-container {
                        background: #1f1f1f;
                        border-color: #40a9ff;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                        color: #e8e8e8;
                    }
                    #batch-topup-content {
                        color: #e8e8e8;
                    }
                    #batch-topup-textarea {
                        background: #2d2d2d;
                        border-color: #404040;
                        color: #e8e8e8;
                    }
                    #batch-topup-textarea::placeholder {
                        color: #888;
                    }
                    #batch-topup-log {
                        background: #2d2d2d;
                        color: #e8e8e8;
                    }
                    .log-item {
                        border-bottom-color: #404040;
                    }
                    .log-success {
                        color: #73d13d;
                    }
                    .log-error {
                        color: #ff7875;
                    }
                    .log-info {
                        color: #69c0ff;
                    }
                    #batch-topup-stats {
                        background: #0d3a5f;
                        color: #e8e8e8;
                    }
                    .batch-topup-label {
                        color: #b8b8b8;
                    }
                    #batch-topup-delay {
                        background: #2d2d2d;
                        border-color: #404040;
                        color: #e8e8e8;
                    }
                    #batch-topup-userid[readonly] {
                        background: #0d3a5f !important;
                        border-color: #40a9ff !important;
                        color: #69c0ff !important;
                    }
                    #batch-topup-userid:not([readonly]) {
                        background: #2d2d2d !important;
                        border-color: #404040 !important;
                        color: #e8e8e8 !important;
                    }
                    .batch-topup-button:disabled {
                        background: #404040;
                        color: #666;
                    }
                }

                /* 适配已经使用深色主题的页面 */
                html[data-theme="dark"] #batch-topup-container,
                html.dark #batch-topup-container,
                body[data-theme="dark"] #batch-topup-container,
                body.dark #batch-topup-container {
                    background: #1f1f1f;
                    border-color: #40a9ff;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    color: #e8e8e8;
                }
                html[data-theme="dark"] #batch-topup-content,
                html.dark #batch-topup-content,
                body[data-theme="dark"] #batch-topup-content,
                body.dark #batch-topup-content {
                    color: #e8e8e8;
                }
                html[data-theme="dark"] #batch-topup-textarea,
                html.dark #batch-topup-textarea,
                body[data-theme="dark"] #batch-topup-textarea,
                body.dark #batch-topup-textarea {
                    background: #2d2d2d;
                    border-color: #404040;
                    color: #e8e8e8;
                }
                html[data-theme="dark"] #batch-topup-log,
                html.dark #batch-topup-log,
                body[data-theme="dark"] #batch-topup-log,
                body.dark #batch-topup-log {
                    background: #2d2d2d;
                    color: #e8e8e8;
                }
                html[data-theme="dark"] .log-item,
                html.dark .log-item,
                body[data-theme="dark"] .log-item,
                body.dark .log-item {
                    border-bottom-color: #404040;
                }
                html[data-theme="dark"] .log-success,
                html.dark .log-success,
                body[data-theme="dark"] .log-success,
                body.dark .log-success {
                    color: #73d13d;
                }
                html[data-theme="dark"] .log-error,
                html.dark .log-error,
                body[data-theme="dark"] .log-error,
                body.dark .log-error {
                    color: #ff7875;
                }
                html[data-theme="dark"] .log-info,
                html.dark .log-info,
                body[data-theme="dark"] .log-info,
                body.dark .log-info {
                    color: #69c0ff;
                }
                html[data-theme="dark"] #batch-topup-stats,
                html.dark #batch-topup-stats,
                body[data-theme="dark"] #batch-topup-stats,
                body.dark #batch-topup-stats {
                    background: #0d3a5f;
                    color: #e8e8e8;
                }
                html[data-theme="dark"] .batch-topup-label,
                html.dark .batch-topup-label,
                body[data-theme="dark"] .batch-topup-label,
                body.dark .batch-topup-label {
                    color: #b8b8b8;
                }
                html[data-theme="dark"] #batch-topup-delay,
                html.dark #batch-topup-delay,
                body[data-theme="dark"] #batch-topup-delay,
                body.dark #batch-topup-delay {
                    background: #2d2d2d;
                    border-color: #404040;
                    color: #e8e8e8;
                }
                html[data-theme="dark"] #batch-topup-userid[readonly],
                html.dark #batch-topup-userid[readonly],
                body[data-theme="dark"] #batch-topup-userid[readonly],
                body.dark #batch-topup-userid[readonly] {
                    background: #0d3a5f !important;
                    border-color: #40a9ff !important;
                    color: #69c0ff !important;
                }
                html[data-theme="dark"] #batch-topup-userid:not([readonly]),
                html.dark #batch-topup-userid:not([readonly]),
                body[data-theme="dark"] #batch-topup-userid:not([readonly]),
                body.dark #batch-topup-userid:not([readonly]) {
                    background: #2d2d2d !important;
                    border-color: #404040 !important;
                    color: #e8e8e8 !important;
                }
                html[data-theme="dark"] .batch-topup-button:disabled,
                html.dark .batch-topup-button:disabled,
                body[data-theme="dark"] .batch-topup-button:disabled,
                body.dark .batch-topup-button:disabled {
                    background: #404040;
                    color: #666;
                }
            </style>
            <div id="batch-topup-header">
                <span>批量兑换</span>
                <button id="batch-topup-toggle">−</button>
            </div>
            <div id="batch-topup-content">
                <div class="batch-topup-label">用户ID（自动检测，如失败请手动填写）：</div>
                <div class="batch-topup-input-group">
                    <input type="text" id="batch-topup-userid" placeholder="自动检测中..." readonly style="flex: 1; padding: 6px; border: 1px solid #d9d9d9; border-radius: 4px; background: #f5f5f5; color: #333;" />
                    <button class="batch-topup-button" id="batch-topup-userid-edit" style="margin: 0;">编辑</button>
                </div>

                <div class="batch-topup-label" style="margin-top: 10px;">兑换码（支持换行、逗号、分号、空格分隔）：</div>
                <textarea id="batch-topup-textarea" placeholder="粘贴兑换码，每行一个或用逗号、分号、空格分隔"></textarea>

                <div class="batch-topup-label" style="margin-top: 10px;">请求间隔（毫秒）：</div>
                <div class="batch-topup-input-group">
                    <input type="number" id="batch-topup-delay" value="500" min="0" max="5000" />
                </div>

                <div>
                    <button class="batch-topup-button" id="batch-topup-paste">从剪贴板粘贴</button>
                    <button class="batch-topup-button" id="batch-topup-start">开始兑换</button>
                    <button class="batch-topup-button" id="batch-topup-stop" disabled>停止</button>
                    <button class="batch-topup-button" id="batch-topup-clear">清空</button>
                </div>

                <div id="batch-topup-stats" style="display:none;">
                    <div>总数: <span id="stat-total">0</span> | 成功: <span id="stat-success">0</span> | 失败: <span id="stat-fail">0</span> | 进度: <span id="stat-progress">0%</span></div>
                </div>

                <div id="batch-topup-log"></div>
            </div>
        `;

        document.body.appendChild(container);

        // 使窗口可拖动
        makeDraggable(container);

        // 绑定事件
        bindEvents();
    }

    // 使元素可拖动
    function makeDraggable(element) {
        const header = element.querySelector('#batch-topup-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.id === 'batch-topup-toggle') return;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
                element.style.right = 'auto';
                element.style.transform = 'none';
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // 绑定事件
    let isRunning = false;
    let shouldStop = false;

    function bindEvents() {
        const toggleBtn = document.getElementById('batch-topup-toggle');
        const content = document.getElementById('batch-topup-content');
        const pasteBtn = document.getElementById('batch-topup-paste');
        const startBtn = document.getElementById('batch-topup-start');
        const stopBtn = document.getElementById('batch-topup-stop');
        const clearBtn = document.getElementById('batch-topup-clear');
        const textarea = document.getElementById('batch-topup-textarea');
        const userIdInput = document.getElementById('batch-topup-userid');
        const userIdEditBtn = document.getElementById('batch-topup-userid-edit');

        // 初始化用户ID显示
        initUserIdDisplay();

        // 用户ID编辑按钮
        userIdEditBtn.addEventListener('click', () => {
            if (userIdInput.readOnly) {
                // 切换到编辑模式
                userIdInput.readOnly = false;
                userIdInput.style.background = '#fff';
                userIdInput.style.color = '#333';
                userIdInput.focus();
                userIdEditBtn.textContent = '保存';
                userIdEditBtn.style.background = '#52c41a';
            } else {
                // 保存并切换回只读模式
                const userId = userIdInput.value.trim();
                if (userId) {
                    userIdInput.readOnly = true;
                    userIdInput.style.background = '#e6f7ff';
                    userIdInput.style.color = '#1890ff';
                    userIdEditBtn.textContent = '编辑';
                    userIdEditBtn.style.background = '#1890ff';
                    addLog(`用户ID已更新为: ${userId}`, 'info');
                } else {
                    addLog('用户ID不能为空', 'error');
                }
            }
        });

        // 折叠/展开
        toggleBtn.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleBtn.textContent = '−';
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
            }
        });

        // 从剪贴板粘贴
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                textarea.value = text;
                addLog('已从剪贴板读取内容', 'info');
            } catch (err) {
                addLog('无法读取剪贴板，请手动粘贴', 'error');
            }
        });

        // 开始兑换
        startBtn.addEventListener('click', () => {
            startBatchTopup();
        });

        // 停止兑换
        stopBtn.addEventListener('click', () => {
            shouldStop = true;
            stopBtn.disabled = true;
            addLog('正在停止...', 'info');
        });

        // 清空
        clearBtn.addEventListener('click', () => {
            textarea.value = '';
            document.getElementById('batch-topup-log').innerHTML = '';
            document.getElementById('batch-topup-stats').style.display = 'none';
            resetStats();
        });
    }

    // 分割兑换码
    function splitCodes(text) {
        // 支持换行、逗号、分号、空格等分隔符
        const codes = text
            .split(/[\n,;，；\s]+/)
            .map(code => code.trim())
            .filter(code => code.length > 0);
        return codes;
    }

    // 统计数据
    let stats = {
        total: 0,
        success: 0,
        fail: 0,
        current: 0
    };

    function resetStats() {
        stats = { total: 0, success: 0, fail: 0, current: 0 };
        updateStats();
    }

    function updateStats() {
        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-success').textContent = stats.success;
        document.getElementById('stat-fail').textContent = stats.fail;
        const progress = stats.total > 0 ? Math.round((stats.current / stats.total) * 100) : 0;
        document.getElementById('stat-progress').textContent = progress + '%';
    }

    // 添加日志
    function addLog(message, type = 'info') {
        const log = document.getElementById('batch-topup-log');
        const item = document.createElement('div');
        item.className = `log-item log-${type}`;
        const time = new Date().toLocaleTimeString();
        item.textContent = `[${time}] ${message}`;
        log.insertBefore(item, log.firstChild);

        // 限制日志数量
        while (log.children.length > 100) {
            log.removeChild(log.lastChild);
        }
    }

    // 获取用户ID
    function getUserId() {
        // 优先从输入框获取（如果用户手动填写了）
        const userIdInput = document.getElementById('batch-topup-userid');
        if (userIdInput && userIdInput.value && !userIdInput.readOnly) {
            return userIdInput.value;
        }

        // 尝试从 localStorage 获取 user 对象
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.id) return user.id;
            }
        } catch (e) {}

        // 尝试从 localStorage 获取 userInfo
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                if (parsed.id) return parsed.id;
            }
        } catch (e) {}

        // 尝试从 sessionStorage 获取
        try {
            const userStr = sessionStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.id) return user.id;
            }
        } catch (e) {}

        // 尝试从 sessionStorage 获取 userInfo
        try {
            const userInfo = sessionStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                if (parsed.id) return parsed.id;
            }
        } catch (e) {}

        // 尝试从其他可能的存储位置获取
        try {
            const userId = localStorage.getItem('userId') ||
                          sessionStorage.getItem('userId') ||
                          localStorage.getItem('user_id') ||
                          sessionStorage.getItem('user_id');
            if (userId) return userId;
        } catch (e) {}

        return null;
    }

    // 初始化用户ID显示
    function initUserIdDisplay() {
        const userId = getUserId();
        const userIdInput = document.getElementById('batch-topup-userid');

        if (userId) {
            userIdInput.value = userId;
            userIdInput.style.background = '#e6f7ff';
            userIdInput.style.color = '#1890ff';
        } else {
            userIdInput.value = '';
            userIdInput.placeholder = '未检测到，请手动输入';
            userIdInput.style.background = '#fff';
        }
    }

    // 发送兑换请求
    function topupRequest(key) {
        return new Promise((resolve, reject) => {
            const userId = getUserId();
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Cache-Control': 'no-store'
            };

            // 添加用户ID请求头
            if (userId) {
                headers['New-API-User'] = userId.toString();
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://b4u.qzz.io/api/user/topup',
                headers: headers,
                data: JSON.stringify({ key: key }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result);
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 开始批量兑换
    async function startBatchTopup() {
        if (isRunning) {
            addLog('已经在运行中，请勿重复启动', 'error');
            return;
        }

        // 检查用户ID
        const userId = getUserId();
        if (!userId) {
            addLog('❌ 无法获取用户ID，请点击"编辑"按钮手动输入', 'error');
            addLog('提示：用户ID可能存储在 localStorage 的 "user" 字段中', 'info');
            // 高亮用户ID输入框
            const userIdInput = document.getElementById('batch-topup-userid');
            userIdInput.style.border = '2px solid #f5222d';
            setTimeout(() => {
                userIdInput.style.border = '1px solid #d9d9d9';
            }, 2000);
            return;
        }
        addLog(`✓ 当前用户ID: ${userId}`, 'info');

        const textarea = document.getElementById('batch-topup-textarea');
        const text = textarea.value.trim();

        if (!text) {
            addLog('请输入兑换码', 'error');
            return;
        }

        const codes = splitCodes(text);
        if (codes.length === 0) {
            addLog('没有找到有效的兑换码', 'error');
            return;
        }

        const delay = parseInt(document.getElementById('batch-topup-delay').value) || 500;

        // 重置状态
        isRunning = true;
        shouldStop = false;
        resetStats();
        stats.total = codes.length;

        // 更新UI
        document.getElementById('batch-topup-start').disabled = true;
        document.getElementById('batch-topup-stop').disabled = false;
        document.getElementById('batch-topup-stats').style.display = 'block';
        updateStats();

        addLog(`开始批量兑换，共 ${codes.length} 个兑换码`, 'info');

        // 逐个兑换
        for (let i = 0; i < codes.length; i++) {
            if (shouldStop) {
                addLog('用户停止了兑换', 'info');
                break;
            }

            const code = codes[i];
            stats.current = i + 1;
            updateStats();

            try {
                addLog(`[${i + 1}/${codes.length}] 正在兑换: ${code.substring(0, 8)}...`, 'info');
                const result = await topupRequest(code);

                if (result.success) {
                    stats.success++;
                    const amount = result.data ? (result.data / 1000000).toFixed(2) : '未知';
                    addLog(`✓ [${i + 1}/${codes.length}] 兑换成功: ${code.substring(0, 8)}... (+${amount}元)`, 'success');
                } else {
                    stats.fail++;
                    const message = result.message || '未知错误';
                    addLog(`✗ [${i + 1}/${codes.length}] 兑换失败: ${code.substring(0, 8)}... (${message})`, 'error');
                }
            } catch (error) {
                stats.fail++;
                addLog(`✗ [${i + 1}/${codes.length}] 请求异常: ${code.substring(0, 8)}... (${error.message})`, 'error');
            }

            updateStats();

            // 延迟
            if (i < codes.length - 1 && !shouldStop) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // 完成
        isRunning = false;
        shouldStop = false;
        document.getElementById('batch-topup-start').disabled = false;
        document.getElementById('batch-topup-stop').disabled = true;

        addLog(`兑换完成！成功: ${stats.success}, 失败: ${stats.fail}`, 'info');
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();
