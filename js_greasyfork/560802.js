// ==UserScript==
// @name         真题墙vip破解
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  修改用户会员账户、修改会员过期时间
// @author       xiuming
// @match        *://zhentiqiang.com/*
// @license      CC BY-NC-SA 4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560802/%E7%9C%9F%E9%A2%98%E5%A2%99vip%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/560802/%E7%9C%9F%E9%A2%98%E5%A2%99vip%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 浮窗状态管理
    let floatWindow = null;
    let isDragging = false;
    let isExpanded = false;
    let modificationCount = 0;
    let lastModification = null;
    let dragOffset = { x: 0, y: 0 };
    let autoHideTimer = null;

    // 开关状态管理 - 使用全局变量
    window.isTamperEnabled = true; // 默认开启

    // ====== 全局函数定义 ======
    // 更新倒计时 - 提升到全局作用域
    function updateCountdown() {
        const expiryDate = new Date('2999-12-31');
        const now = new Date();
        const diffTime = expiryDate - now;

        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = `距离过期: ${diffYears}年${diffMonths}月`;
        }
    }

    // 更新修改统计 - 提升到全局作用域
    function updateModificationStats() {
        modificationCount++;
        lastModification = new Date().toLocaleTimeString();

        if (floatWindow) {
            const countElement = document.getElementById('modification-count');
            const timeElement = document.getElementById('last-modification');
            if (countElement) countElement.textContent = modificationCount;
            if (timeElement) timeElement.textContent = `最后修改: ${lastModification}`;
            updateCountdown();
        }
    }

    // 检查是否启用
    function checkTamperEnabled() {
        return window.isTamperEnabled !== false;
    }

    // 创建浮窗
    function createFloatWindow() {
        // 创建主容器
        floatWindow = document.createElement('div');
        floatWindow.id = 'membership-tamper-window';
        floatWindow.innerHTML = `
            <style>
                #membership-tamper-window {
                    position: fixed;
                    right: -250px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 280px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px 0 0 12px;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.3);
                    transition: right 0.3s ease;
                    z-index: 999999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    backdrop-filter: blur(10px);
                    cursor: grab;
                }

                #membership-tamper-window.dragging {
                    cursor: grabbing;
                    transition: none;
                }

                #membership-tamper-window.expanded {
                    right: 0;
                }

                #membership-tamper-window.collapsed {
                    right: -235px;
                }

                .tamper-header {
                    background: rgba(255,255,255,0.1);
                    padding: 12px 15px;
                    border-radius: 12px 0 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    user-select: none;
                }

                .tamper-title {
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .tamper-status {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .tamper-status.disabled {
                    background: #ef4444;
                    animation: none;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .tamper-arrow {
                    transition: transform 0.3s ease;
                    font-size: 12px;
                }

                .tamper-arrow.expanded {
                    transform: rotate(180deg);
                }

                .tamper-content {
                    padding: 15px;
                }

                .tamper-section {
                    margin-bottom: 15px;
                }

                .tamper-section:last-child {
                    margin-bottom: 0;
                }

                .tamper-section-title {
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 0.8;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .tamper-info {
                    font-size: 13px;
                    line-height: 1.4;
                }

                .tamper-counter {
                    background: rgba(255,255,255,0.2);
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-align: center;
                }

                .tamper-author {
                    background: rgba(255,255,255,0.1);
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 12px;
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,0.2);
                }

                .tamper-time {
                    font-size: 11px;
                    opacity: 0.8;
                    margin-top: 5px;
                }

                .collapsed-title {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    height: 120px;
                    justify-content: center;
                    padding: 8px 3px;
                    line-height: 1.3;
                    letter-spacing: 1px;
                }

                .countdown-text {
                    color: #fbbf24;
                    font-weight: 600;
                }

                /* 开关按钮样式 */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                    margin-left: 10px;
                }

                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }

                input:checked + .slider {
                    background-color: #4ade80;
                }

                input:checked + .slider:before {
                    transform: translateX(20px);
                }

                .status-text {
                    font-size: 11px;
                    font-weight: 600;
                    margin-top: 5px;
                }

                .status-enabled {
                    color: #4ade80;
                }

                .status-disabled {
                    color: #ef4444;
                }

                /* URL匹配提示 */
                .url-match-info {
                    background: rgba(255,255,255,0.1);
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    margin-top: 5px;
                }

                .url-match-success {
                    color: #4ade80;
                }

                .url-match-fail {
                    color: #fbbf24;
                }
            </style>

            <div class="tamper-header" id="tamper-header">
                <div class="collapsed-title" id="collapsed-title" style="display: none;">
                    <div class="tamper-status" id="collapsed-status"></div>
                    会员修改器
                </div>
                <div class="expanded-title" id="expanded-title">
                    <div class="tamper-title">
                        <div class="tamper-status" id="expanded-status"></div>
                        会员状态修改器
                    </div>
                    <div class="tamper-arrow" id="tamper-arrow">◀</div>
                </div>
            </div>

            <div class="tamper-content" id="tamper-content">
                <div class="tamper-section">
                    <div class="tamper-section-title">运行状态</div>
                    <div class="tamper-info">
                        <div>状态: <span id="running-status" style="color: #4ade80;">运行中</span></div>
                        <div>版本: v2.2</div>
                    </div>
                </div>

                <div class="tamper-section">
                    <div class="tamper-section-title">开关控制</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 13px;">破解功能:</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="enable-toggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="status-text" id="status-text">已开启 - 正在破解VIP状态</div>
                    <div class="url-match-info" id="url-match-info">
                        <div>监听URL: /api/membership/status</div>
                        <div>当前访问: <span id="current-url">无</span></div>
                    </div>
                </div>

                <div class="tamper-section">
                    <div class="tamper-section-title">修改统计</div>
                    <div class="tamper-counter">
                        <div>已修改: <strong id="modification-count">0</strong> 次</div>
                        <div class="tamper-time" id="last-modification">暂无修改</div>
                    </div>
                </div>

                <div class="tamper-section">
                    <div class="tamper-section-title">修改详情</div>
                    <div class="tamper-info">
                        <div id="modification-details">
                            <div>✓ 已修改为VIP状态</div>
                            <div>✓ 过期时间: 2999年12月31日</div>
                            <div class="countdown-text" id="countdown">距离过期: 974年</div>
                        </div>
                        <div id="disabled-message" style="display: none; color: #ef4444; text-align: center; padding: 10px;">
                            破解功能已关闭
                        </div>
                    </div>
                </div>

                <div class="tamper-author">
                    <div>作者: xiuming</div>
                </div>
            </div>
        `;

        document.body.appendChild(floatWindow);

        // 获取元素
        const header = document.getElementById('tamper-header');
        const collapsedTitle = document.getElementById('collapsed-title');
        const expandedTitle = document.getElementById('expanded-title');
        const content = document.getElementById('tamper-content');
        const arrow = document.getElementById('tamper-arrow');
        const enableToggle = document.getElementById('enable-toggle');
        const statusText = document.getElementById('status-text');
        const runningStatus = document.getElementById('running-status');
        const modificationDetails = document.getElementById('modification-details');
        const disabledMessage = document.getElementById('disabled-message');
        const collapsedStatus = document.getElementById('collapsed-status');
        const expandedStatus = document.getElementById('expanded-status');
        const currentUrlSpan = document.getElementById('current-url');
        const urlMatchInfo = document.getElementById('url-match-info');

        // 初始状态
        floatWindow.classList.add('collapsed');
        collapsedTitle.style.display = 'flex';
        expandedTitle.style.display = 'none';
        content.style.display = 'none';

        // 开关切换功能
        enableToggle.addEventListener('change', function() {
            window.isTamperEnabled = this.checked; // 更新全局变量
            updateStatusDisplay();
            console.log('Tampermonkey: 破解功能' + (window.isTamperEnabled ? '开启' : '关闭'));
        });

        // 更新状态显示
        function updateStatusDisplay() {
            if (window.isTamperEnabled) {
                statusText.textContent = '已开启 - 正在破解VIP状态';
                statusText.className = 'status-text status-enabled';
                runningStatus.textContent = '运行中';
                runningStatus.style.color = '#4ade80';
                modificationDetails.style.display = 'block';
                disabledMessage.style.display = 'none';
                collapsedStatus.className = 'tamper-status';
                expandedStatus.className = 'tamper-status';
            } else {
                statusText.textContent = '已关闭 - 破解功能停止';
                statusText.className = 'status-text status-disabled';
                runningStatus.textContent = '已停止';
                runningStatus.style.color = '#ef4444';
                modificationDetails.style.display = 'none';
                disabledMessage.style.display = 'block';
                collapsedStatus.className = 'tamper-status disabled';
                expandedStatus.className = 'tamper-status disabled';
            }
        }

        // 更新当前URL显示
        function updateCurrentUrl(url) {
            if (currentUrlSpan) {
                currentUrlSpan.textContent = url;
                // 检查是否匹配
                const isMatch = url.includes('/api/membership/status');
                urlMatchInfo.className = 'url-match-info ' + (isMatch ? 'url-match-success' : 'url-match-fail');
                if (isMatch) {
                    urlMatchInfo.innerHTML = `
                        <div>✓ 匹配成功: /api/membership/status</div>
                        <div>当前: ${url}</div>
                    `;
                } else {
                    urlMatchInfo.innerHTML = `
                        <div>✗ 未匹配: /api/membership/status</div>
                        <div>当前: ${url}</div>
                    `;
                }
            }
        }

        // 计算倒计时
        function updateCountdown() {
            const expiryDate = new Date('2999-12-31');
            const now = new Date();
            const diffTime = expiryDate - now;

            const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
            const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = `距离过期: ${diffYears}年${diffMonths}月`;
            }
        }

        // 拖拽功能
        header.addEventListener('mousedown', function(e) {
            if (e.target.closest('.collapsed-title')) return;

            isDragging = true;
            floatWindow.classList.add('dragging');

            const rect = floatWindow.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            floatWindow.style.left = x + 'px';
            floatWindow.style.right = 'auto';
            floatWindow.style.top = y + 'px';
            floatWindow.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                floatWindow.classList.remove('dragging');

                setTimeout(() => {
                    snapToEdge();
                }, 100);
            }
        });

        // 悬浮显示功能
        floatWindow.addEventListener('mouseenter', function() {
            if (!isDragging && floatWindow.classList.contains('collapsed')) {
                clearTimeout(autoHideTimer);
                expandWindow();
            }
        });

        floatWindow.addEventListener('mouseleave', function() {
            if (!isDragging && !floatWindow.classList.contains('collapsed')) {
                autoHideTimer = setTimeout(() => {
                    collapseWindow();
                }, 500);
            }
        });

        // 点击展开/收起
        header.addEventListener('click', function(e) {
            if (isDragging) return;

            if (floatWindow.classList.contains('collapsed')) {
                expandWindow();
            } else {
                collapseWindow();
            }
        });

        // 展开函数
        function expandWindow() {
            isExpanded = true;
            floatWindow.classList.remove('collapsed');
            floatWindow.classList.add('expanded');
            collapsedTitle.style.display = 'none';
            expandedTitle.style.display = 'flex';
            content.style.display = 'block';
            arrow.classList.add('expanded');
        }

        // 收起函数
        function collapseWindow() {
            isExpanded = false;
            floatWindow.classList.remove('expanded');
            floatWindow.classList.add('collapsed');
            collapsedTitle.style.display = 'flex';
            expandedTitle.style.display = 'none';
            content.style.display = 'none';
            arrow.classList.remove('expanded');
        }

        // 吸附到边缘
        function snapToEdge() {
            const rect = floatWindow.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            const distanceToRight = windowWidth - rect.right;
            const distanceToLeft = rect.left;

            if (distanceToRight < distanceToLeft) {
                floatWindow.style.right = '0';
                floatWindow.style.left = 'auto';
                floatWindow.style.transform = 'translateY(-50%)';
                floatWindow.style.top = '50%';
            } else {
                floatWindow.style.left = '0';
                floatWindow.style.right = 'auto';
                floatWindow.style.transform = 'translateY(-50%)';
                floatWindow.style.top = '50%';
            }

            collapseWindow();
        }

        // 初始化状态显示
        updateStatusDisplay();
    }

    // 等待DOM加载完成后创建浮窗
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatWindow);
    } else {
        createFloatWindow();
    }

    // 修复的拦截逻辑 - 扩大URL匹配范围
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const clonedResponse = response.clone();

        try {
            // 扩大URL匹配范围 - 匹配更多可能的VIP状态接口
            const url = args[0] || '';
            const isVipStatusApi = url.includes('/api/membership/status') ||
                                 url.includes('/api/papers/') ||
                                 url.includes('/api/user/status') ||
                                 url.includes('/api/account/status') ||
                                 url.includes('membership') ||
                                 url.includes('status');

            if (isVipStatusApi) {
                console.log('Tampermonkey: 检测到可能的API请求: ' + url);
                console.log('Tampermonkey: 开关状态: ' + (checkTamperEnabled() ? '开启' : '关闭'));

                const data = await clonedResponse.json();

                if (data && checkTamperEnabled()) {
                    let modified = false;
                    if (typeof data.is_member !== 'undefined') {
                        data.is_member = true;
                        modified = true;
                    }
                    if (typeof data.expiry_date !== 'undefined') {
                        data.expiry_date = "2999-12-31 00:00:00";
                        modified = true;
                    }
                    // 尝试其他可能的字段名
                    if (typeof data.member !== 'undefined') {
                        data.member = true;
                        modified = true;
                    }
                    if (typeof data.vip !== 'undefined') {
                        data.vip = true;
                        modified = true;
                    }
                    if (typeof data.premium !== 'undefined') {
                        data.premium = true;
                        modified = true;
                    }

                    if (modified) {
                        updateModificationStats();
                        console.log('Tampermonkey: ✅ 已修改响应数据', data);
                    } else {
                        console.log('Tampermonkey: 未找到可修改的字段', data);
                    }
                } else if (!checkTamperEnabled()) {
                    console.log('Tampermonkey: ❌ 破解功能已关闭，跳过修改');
                }

                const modifiedResponse = new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });

                return modifiedResponse;
            }
        } catch (error) {
            console.error('Tampermonkey: 修改响应失败', error);
        }

        return response;
    };

    // 修复的XHR拦截逻辑
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        let url = '';

        xhr.open = function(method, urlParam, ...args) {
            url = urlParam;
            return originalOpen.apply(this, [method, urlParam, ...args]);
        };

        xhr.send = function(...args) {
            // 扩大URL匹配范围
            const isVipStatusApi = url.includes('/api/membership/status') ||
                                 url.includes('/api/papers/') ||
                                 url.includes('/api/user/status') ||
                                 url.includes('/api/account/status') ||
                                 url.includes('membership') ||
                                 url.includes('status');

            if (isVipStatusApi) {
                const originalOnReadyStateChange = xhr.onreadystatechange;
                const originalOnLoad = xhr.onload;

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        try {
                            const responseText = xhr.responseText;
                            const data = JSON.parse(responseText);

                            console.log('Tampermonkey: 检测到XHR请求: ' + url);
                            console.log('Tampermonkey: XHR开关状态: ' + (checkTamperEnabled() ? '开启' : '关闭'));

                            if (data && checkTamperEnabled()) {
                                let modified = false;
                                if (typeof data.is_member !== 'undefined') {
                                    data.is_member = true;
                                    modified = true;
                                }
                                if (typeof data.expiry_date !== 'undefined') {
                                    data.expiry_date = "2999-12-31 00:00:00";
                                    modified = true;
                                }
                                // 尝试其他可能的字段名
                                if (typeof data.member !== 'undefined') {
                                    data.member = true;
                                    modified = true;
                                }
                                if (typeof data.vip !== 'undefined') {
                                    data.vip = true;
                                    modified = true;
                                }
                                if (typeof data.premium !== 'undefined') {
                                    data.premium = true;
                                    modified = true;
                                }

                                if (modified) {
                                    updateModificationStats();
                                    console.log('Tampermonkey: ✅ 已修改XHR响应数据', data);

                                    Object.defineProperty(xhr, 'responseText', {
                                        value: JSON.stringify(data),
                                        writable: false
                                    });

                                    Object.defineProperty(xhr, 'response', {
                                        value: JSON.stringify(data),
                                        writable: false
                                    });
                                } else {
                                    console.log('Tampermonkey: XHR未找到可修改的字段', data);
                                }
                            } else if (!checkTamperEnabled()) {
                                console.log('Tampermonkey: ❌ XHR破解功能已关闭，跳过修改');
                            }
                        } catch (error) {
                            console.error('Tampermonkey: 修改XHR响应失败', error);
                        }
                    }

                    if (originalOnReadyStateChange) {
                        originalOnReadyStateChange.apply(this, arguments);
                    }
                };

                xhr.onload = function() {
                    if (originalOnLoad) {
                        originalOnLoad.apply(this, arguments);
                    }
                };
            }

            return originalSend.apply(this, args);
        };

        return xhr;
    };

    console.log('Tampermonkey: 会员状态修改脚本已加载 (v2.2)');
})();