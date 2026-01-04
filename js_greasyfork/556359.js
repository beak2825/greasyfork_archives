// ==UserScript==
// @name         FF14陆行鸟区服状态监控
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  显示FF14陆行鸟区服状态的悬浮窗，可选刷新频率，状态改善时发送桌面通知
// @author       AI1S
// @match        *://ff.web.sdo.com/*
// @match        *://ff14bjz.sdo.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556359/FF14%E9%99%86%E8%A1%8C%E9%B8%9F%E5%8C%BA%E6%9C%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/556359/FF14%E9%99%86%E8%A1%8C%E9%B8%9F%E5%8C%BA%E6%9C%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前域名是否为ff14bjz.sdo.com
    const isMainDomain = window.location.hostname === 'ff14bjz.sdo.com';

    // 存储上一次的大区状态
    let previousAreaStatus = null;
    // 当前刷新间隔ID
    let refreshIntervalId = null;
    // 当前刷新间隔时间（毫秒）
    let currentRefreshInterval = 60000; // 默认1分钟
    // 最后更新时间
    let lastUpdateTime = null;
    // 倒计时ID
    let countdownIntervalId = null;
    // 当前倒计时剩余时间
    let currentCountdown = 0;

    // 存储当前小时的推荐大区
    let currentRecommendedArea = null;

    // 状态变更历史记录（最多保留48小时的数据点）
    let statusHistory = JSON.parse(GM_getValue('statusHistory', '[]')) || [];
    const MAX_HISTORY_HOURS = 48;
    const MAX_HISTORY_POINTS = 288; // 48小时 * 6点/小时 = 288点（每10分钟一个点）

    // 折线图Canvas元素
    let chartCanvas = null;
    let chartCtx = null;
    let chartRect = null;
    let hoveredPoint = null;

    // 清理过期的历史记录（超过48小时）
    function cleanupExpiredHistory() {
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - (MAX_HISTORY_HOURS * 60 * 60 * 1000));

        statusHistory = statusHistory.filter(record => {
            return new Date(record.time) >= cutoffTime;
        });

        // 限制最大点数
        if (statusHistory.length > MAX_HISTORY_POINTS) {
            statusHistory = statusHistory.slice(-MAX_HISTORY_POINTS);
        }

        // 保存到GM存储
        GM_setValue('statusHistory', JSON.stringify(statusHistory));
    }

    // 检查并请求通知权限
    function requestNotificationPermission() {
        return new Promise((resolve) => {
            if (Notification.permission === 'default') {
                // 显示提示信息
                const permissionPrompt = document.createElement('div');
                permissionPrompt.id = 'ff14-notification-prompt';
                permissionPrompt.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                background: white; padding: 20px; border: 2px solid #4a90e2;
                                border-radius: 8px; z-index: 10001; font-family: 'Microsoft YaHei', Arial, sans-serif;">
                        <h3>FF14陆行鸟区服状态监控</h3>
                        <p>是否允许显示桌面通知？</p>
                        <p>当陆行鸟区状态改善时，将发送通知提醒您。</p>
                        <div style="text-align: center; margin-top: 15px;">
                            <button id="ff14-allow-notification" style="margin-right: 10px; padding: 8px 16px;
                                    background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                允许
                            </button>
                            <button id="ff14-deny-notification" style="padding: 8px 16px;
                                    background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer;">
                                拒绝
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(permissionPrompt);

                // 绑定允许按钮事件
                document.getElementById('ff14-allow-notification').addEventListener('click', () => {
                    Notification.requestPermission().then(permission => {
                        document.body.removeChild(permissionPrompt);
                        resolve(permission === 'granted');
                    });
                });

                // 绑定拒绝按钮事件
                document.getElementById('ff14-deny-notification').addEventListener('click', () => {
                    document.body.removeChild(permissionPrompt);
                    resolve(false);
                });
            } else {
                resolve(Notification.permission === 'granted');
            }
        });
    }

    // 发送桌面通知
    function sendNotification(areaStatus = null, isTest = false) {
        if (Notification.permission === 'granted') {
            let title, body;
            if (isTest) {
                title = 'FF14陆行鸟区服状态监控测试';
                body = '这是测试通知，功能正常！';
            } else {
                if (areaStatus === null) return;
                const statusText = areaStatus === 0 ? '流畅' : '热门';
                title = 'FF14陆行鸟区状态改善';
                body = `大区状态已从火爆变为${statusText}！`;
            }

            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="%234a90e2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
                tag: isTest ? 'ff14-test-notification' : 'ff14-area-status'
            });

            // 3秒后自动关闭通知
            setTimeout(() => {
                notification.close();
            }, 3000);
        }
    }

    // 更新倒计时显示
    function updateCountdownDisplay() {
        const seconds = Math.floor(currentCountdown / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        let countdownText;
        if (minutes > 0) {
            countdownText = `${minutes}分${remainingSeconds}秒后刷新`;
        } else {
            countdownText = `${remainingSeconds}秒后刷新`;
        }

        document.getElementById('ff14-last-update').textContent =
            `最后更新: ${lastUpdateTime.toLocaleTimeString()} (${countdownText})`;
    }

    // 开始倒计时
    function startCountdown() {
        // 清除之前的倒计时
        if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
        }

        currentCountdown = currentRefreshInterval;
        updateCountdownDisplay();

        countdownIntervalId = setInterval(() => {
            currentCountdown -= 1000;
            if (currentCountdown <= 0) {
                currentCountdown = 0;
                updateCountdownDisplay();
                clearInterval(countdownIntervalId);
            } else {
                updateCountdownDisplay();
            }
        }, 1000);
    }

    // 根据当前小时获取推荐大区（确保每天同一小时不重复）
    function getRecommendedAreaForCurrentHour() {
        const now = new Date();
        const currentHour = now.getHours();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

        // 计算种子值（结合小时和年份，确保每天同一小时不重复）
        const seed = (dayOfYear * 24 + currentHour) % 24;

        // 使用种子值选择推荐大区
        const recommendedAreas = ['猫小胖', '莫古力', '豆豆柴'];
        const index = seed % 3;

        return recommendedAreas[index];
    }

    // 添加状态变更记录
    function addStatusRecord(status, timestamp = new Date()) {
        const record = {
            status: status,
            time: timestamp.toISOString()
        };

        // 添加到历史记录开头
        statusHistory.unshift(record);

        // 清理过期数据
        cleanupExpiredHistory();

        // 更新UI
        updateStatusHistoryDisplay();
    }

    // 更新状态历史记录显示
    function updateStatusHistoryDisplay() {
        // 更新日志表格（只显示最近20条）
        const logTable = document.getElementById('ff14-status-log-table');
        if (logTable) {
            const recentRecords = statusHistory.slice(0, 20);
            let logHtml = '<table><thead><tr><th>时间</th><th>状态</th></tr></thead><tbody>';
            for (const record of recentRecords) {
                const statusMap = { 0: '流畅', 1: '热门', 2: '火爆' };
                const statusText = statusMap[record.status] || '未知';
                const statusClass = record.status === 0 ? 'status-0' :
                                   record.status === 1 ? 'status-1' : 'status-2';
                const timeStr = new Date(record.time).toLocaleString();

                logHtml += `
                    <tr>
                        <td>${timeStr}</td>
                        <td><span class="${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            }
            logHtml += '</tbody></table>';
            logTable.innerHTML = logHtml;
        }

        // 更新折线图
        drawStatusChart();
    }

    // 绘制48小时状态折线图（连续折线，固定时间间隔）
    function drawStatusChart() {
        if (!chartCtx || statusHistory.length === 0) return;

        const canvas = chartCanvas;
        const ctx = chartCtx;
        const width = canvas.width;
        const height = canvas.height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 设置坐标系
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;

        // 绘制网格线
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;

        // 水平网格线（3条：0, 1, 2）
        for (let i = 0; i <= 2; i++) {
            const y = padding + (2 - i) * (graphHeight / 2);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // 获取要显示的记录（按时间从小到大排序）
        const recordsToShow = [...statusHistory].reverse(); // 从小到大

        if (recordsToShow.length > 0) {
            // 计算48小时的时间范围
            const now = new Date();
            const startTime = new Date(now.getTime() - (48 * 60 * 60 * 1000));
            const endTime = now;
            const timeRange = endTime.getTime() - startTime.getTime();

            // 绘制折线
            ctx.strokeStyle = '#4a90e2';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const points = [];
            let hasValidPoint = false;

            for (let i = 0; i < recordsToShow.length; i++) {
                const record = recordsToShow[i];
                const recordTime = new Date(record.time).getTime();

                // 只绘制48小时内的数据
                if (recordTime < startTime.getTime() || recordTime > endTime.getTime()) {
                    continue;
                }

                const x = padding + ((recordTime - startTime.getTime()) / timeRange) * graphWidth;
                const y = padding + (2 - record.status) * (graphHeight / 2);

                points.push({ x, y, record });

                if (!hasValidPoint) {
                    ctx.moveTo(x, y);
                    hasValidPoint = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // 如果有有效点，绘制折线
            if (hasValidPoint) {
                ctx.stroke();

                // 绘制数据点
                for (const point of points) {
                    ctx.fillStyle = point.record.status === 0 ? 'green' :
                                   point.record.status === 1 ? 'orange' : 'red';
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }

            // 绘制X轴时间标签（每6小时一个标签，共9个标签）
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';

            for (let i = 0; i <= 8; i++) {
                const timePoint = startTime.getTime() + (timeRange / 8) * i;
                const x = padding + ((timePoint - startTime.getTime()) / timeRange) * graphWidth;
                const timeLabel = new Date(timePoint).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // X轴刻度线
                ctx.strokeStyle = '#ccc';
                ctx.beginPath();
                ctx.moveTo(x, height - padding);
                ctx.lineTo(x, height - padding + 5);
                ctx.stroke();

                // 时间标签
                ctx.fillText(timeLabel, x, height - padding + 15);
            }

            // 绘制Y轴标签
            ctx.textAlign = 'right';
            for (let i = 0; i <= 2; i++) {
                const y = padding + (2 - i) * (graphHeight / 2);
                const label = i === 0 ? '流畅' : i === 1 ? '热门' : '火爆';
                ctx.fillStyle = i === 0 ? 'green' : i === 1 ? 'orange' : 'red';
                ctx.fillText(label, padding - 5, y + 4);
            }

            // 如果有悬停点，绘制高亮效果和tooltip
            if (hoveredPoint !== null && hoveredPoint < points.length) {
                const point = points[hoveredPoint];
                // 高亮点
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.stroke();

                // 绘制tooltip背景
                const tooltipText = new Date(point.record.time).toLocaleString('zh-CN');
                ctx.font = '12px Arial';
                const textWidth = ctx.measureText(tooltipText).width;
                const tooltipX = Math.max(padding + 10, Math.min(point.x - textWidth / 2, width - padding - textWidth - 10));
                const tooltipY = point.y - 20;

                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(tooltipX - 5, tooltipY - 15, textWidth + 10, 20);
                ctx.fillStyle = 'white';
                ctx.fillText(tooltipText, tooltipX, tooltipY);
            }
        }

        // 绘制X轴和Y轴
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        // X轴
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        // Y轴
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
    }

    // 处理鼠标移动事件
    function handleMouseMove(e) {
        if (!chartRect || statusHistory.length === 0) {
            hoveredPoint = null;
            drawStatusChart();
            return;
        }

        const mouseX = e.clientX - chartRect.left;
        const mouseY = e.clientY - chartRect.top;

        // 获取要显示的记录（按时间从小到大排序）
        const recordsToShow = [...statusHistory].reverse();

        if (recordsToShow.length === 0) {
            hoveredPoint = null;
            drawStatusChart();
            return;
        }

        // 计算48小时的时间范围
        const now = new Date();
        const startTime = new Date(now.getTime() - (48 * 60 * 60 * 1000));
        const endTime = now;
        const timeRange = endTime.getTime() - startTime.getTime();

        const padding = 40;
        const graphWidth = chartCanvas.width - 2 * padding;
        const graphHeight = chartCanvas.height - 2 * padding;

        // 找到48小时内的有效点
        const validPoints = [];
        for (const record of recordsToShow) {
            const recordTime = new Date(record.time).getTime();
            if (recordTime >= startTime.getTime() && recordTime <= endTime.getTime()) {
                const x = padding + ((recordTime - startTime.getTime()) / timeRange) * graphWidth;
                const y = padding + (2 - record.status) * (graphHeight / 2);
                validPoints.push({ x, y, record });
            }
        }

        if (validPoints.length === 0) {
            hoveredPoint = null;
            drawStatusChart();
            return;
        }

        // 找到最近的点
        let closestPoint = null;
        let minDistance = Infinity;

        for (let i = 0; i < validPoints.length; i++) {
            const point = validPoints[i];
            const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
            if (distance < minDistance && distance < 12) { // 12像素范围内
                minDistance = distance;
                closestPoint = i;
            }
        }

        if (closestPoint !== null) {
            hoveredPoint = closestPoint;
        } else {
            hoveredPoint = null;
        }

        drawStatusChart();
    }

    // 创建状态历史记录区域
    function createStatusHistorySection() {
        const historyContainer = document.createElement('div');
        historyContainer.id = 'ff14-status-history-container';

        historyContainer.innerHTML = `
            <div id="ff14-history-toggle" style="margin-top: 10px; padding: 8px; background-color: #f5f5f5;
                border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <span>📊 过去24小时状态</span>
                <span id="ff14-history-arrow">▼</span>
            </div>
            <div id="ff14-status-history-content" style="display: none; margin-top: 10px;">
                <div style="margin-bottom: 10px; position: relative;">
                    <canvas id="ff14-status-chart" width="380" height="200"></canvas>
                </div>
                <div id="ff14-status-log-table"></div>
            </div>
        `;

        return historyContainer;
    }

    // 切换历史记录显示/隐藏
    function toggleHistoryDisplay() {
        const content = document.getElementById('ff14-status-history-content');
        const arrow = document.getElementById('ff14-history-arrow');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            arrow.textContent = '▲';
            // 更新图表尺寸
            setTimeout(() => {
                if (chartCanvas) {
                    chartRect = chartCanvas.getBoundingClientRect();
                }
            }, 100);
        } else {
            content.style.display = 'none';
            arrow.textContent = '▼';
        }
    }

    // 创建悬浮窗HTML元素
    function createFloatingWindow() {
        const container = document.createElement('div');
        container.id = 'ff14-status-container';

        // 根据当前域名决定显示内容
        if (isMainDomain) {
            // 在ff14bjz.sdo.com上显示完整功能
            container.innerHTML = `
                <div id="ff14-status-header">
                    <span>FF14陆行鸟区服状态监控</span>
                    <button id="ff14-close-btn">×</button>
                </div>
                <div id="ff14-status-content">
                    <div id="ff14-area-status">大区状态: --</div>
                    <div id="ff14-last-update">最后更新: --</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                        <div>
                            <button id="ff14-test-notification" style="padding: 6px 12px;
                                    background: #4CAF50; color: white; border: none;
                                    border-radius: 4px; cursor: pointer; font-size: 0.9em; margin-right: 5px;">
                                测试通知
                            </button>
                            <button id="ff14-request-notification" style="padding: 6px 12px;
                                    background: #FF9800; color: white; border: none;
                                    border-radius: 4px; cursor: pointer; font-size: 0.9em; margin-right: 5px;">
                                开启通知
                            </button>
                            <button id="ff14-goto-region" style="padding: 6px 12px;
                                    background: #2196F3; color: white; border: none;
                                    border-radius: 4px; cursor: pointer; font-size: 0.9em;">
                                超域出发
                            </button>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <label for="ff14-refresh-interval" style="margin-right: 5px; font-size: 0.9em;">刷新频率:</label>
                            <select id="ff14-refresh-interval" style="padding: 4px 6px; border-radius: 4px; border: 1px solid #ccc;">
                                <option value="10000">10秒</option>
                                <option value="30000">30秒</option>
                                <option value="60000" selected>1分钟</option>
                                <option value="300000">5分钟</option>
                                <option value="600000">10分钟</option>
                            </select>
                        </div>
                    </div>
                    <div id="ff14-recommendation" style="margin: 10px 0; padding: 10px; background-color: #fff3cd;
                        border: 1px solid #ffeaa7; border-radius: 4px; display: none;">
                        陆行鸟大区当前繁忙，不妨去<span id="ff14-recommendation-area">猫小胖</span>大区玩玩呢。
                    </div>
                    <div id="ff14-status-table"></div>
                </div>
            `;
        } else {
            // 在其他域名上仅显示超域出发按钮
            container.innerHTML = `
                <div id="ff14-status-header">
                    <span>FF14陆行鸟区服状态监控</span>
                    <button id="ff14-close-btn">×</button>
                </div>
                <div id="ff14-status-content">
                    <div style="text-align: center; padding: 20px;">
                        <button id="ff14-goto-region" style="padding: 12px 24px;
                                background: #2196F3; color: white; border: none;
                                border-radius: 4px; cursor: pointer; font-size: 1em; font-weight: bold;">
                            超域出发
                        </button>
                        <div style="margin-top: 10px; color: #666; font-size: 0.9em;">
                            当前页面不在主监控页面
                        </div>
                    </div>
                </div>
            `;
        }

        document.body.appendChild(container);

        // 如果是主域名，添加状态历史记录区域
        if (isMainDomain) {
            const historySection = createStatusHistorySection();
            document.getElementById('ff14-status-content').appendChild(historySection);

            // 初始化Canvas
            chartCanvas = document.getElementById('ff14-status-chart');
            chartCtx = chartCanvas.getContext('2d');

            // 绑定历史记录切换事件
            document.getElementById('ff14-history-toggle').addEventListener('click', toggleHistoryDisplay);

            // 绑定鼠标事件
            chartCanvas.addEventListener('mousemove', handleMouseMove);
            chartCanvas.addEventListener('mouseleave', () => {
                hoveredPoint = null;
                drawStatusChart();
            });
        }

        // 添加样式
        GM_addStyle(`
            #ff14-status-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                height: 600px; /* 增加高度以容纳更大的图表 */
                background: white;
                border: 2px solid #4a90e2;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: "Microsoft YaHei", Arial, sans-serif;
                overflow: hidden;
            }
            #ff14-status-header {
                background: #4a90e2;
                color: white;
                padding: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }
            #ff14-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #ff14-status-content {
                padding: 10px;
                height: calc(100% - 50px);
                overflow-y: auto;
            }
            #ff14-area-status {
                font-weight: bold;
                font-size: 1.1em;
                margin-bottom: 5px;
                padding: 5px;
                background-color: #f0f8ff;
                border-radius: 4px;
            }
            #ff14-last-update {
                text-align: right;
                font-size: 0.8em;
                color: #666;
                margin-bottom: 10px;
            }
            #ff14-status-table table {
                width: 100%;
                border-collapse: collapse;
            }
            #ff14-status-table th, #ff14-status-table td {
                border: 1px solid #ddd;
                padding: 6px;
                text-align: left;
            }
            #ff14-status-table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            .status-0 { color: green; font-weight: bold; }
            .status-1 { color: orange; font-weight: bold; }
            .status-2 { color: red; font-weight: bold; }
            .queue-time { font-family: monospace; }
            .server-item {
                margin: 2px 0;
            }
            .loading {
                text-align: center;
                padding: 20px;
                color: #666;
            }
            #ff14-status-history-container {
                margin-top: 15px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            #ff14-history-toggle:hover {
                background-color: #e9ecef;
            }
            #ff14-status-log-table table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.85em;
            }
            #ff14-status-log-table th, #ff14-status-log-table td {
                border: 1px solid #ddd;
                padding: 4px;
                text-align: left;
            }
            #ff14-status-log-table th {
                background-color: #f8f9fa;
            }
            canvas {
                cursor: crosshair;
            }
        `);

        // 关闭按钮事件
        document.getElementById('ff14-close-btn').addEventListener('click', function() {
            container.style.display = 'none';
        });

        // 如果是主域名，添加完整功能
        if (isMainDomain) {
            // 测试通知按钮事件
            document.getElementById('ff14-test-notification').addEventListener('click', function() {
                if (Notification.permission === 'granted') {
                    // 显示倒计时提示
                    const testBtn = document.getElementById('ff14-test-notification');
                    testBtn.textContent = '10秒后发送...';
                    testBtn.disabled = true;

                    let countdown = 10;
                    const countdownInterval = setInterval(() => {
                        countdown--;
                        testBtn.textContent = `${countdown}秒后发送...`;
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            sendNotification(null, true); // 发送测试通知
                            testBtn.textContent = '测试通知';
                            testBtn.disabled = false;
                        }
                    }, 1000);
                } else {
                    alert('请先允许通知权限！');
                }
            });

            // 开启通知权限按钮事件
            document.getElementById('ff14-request-notification').addEventListener('click', function() {
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            alert('通知权限已开启！');
                        } else {
                            alert('通知权限被拒绝，将无法接收状态改善通知');
                        }
                    });
                } else {
                    alert('通知权限已开启！');
                }
            });

            // 刷新频率下拉框事件
            document.getElementById('ff14-refresh-interval').addEventListener('change', function() {
                const newInterval = parseInt(this.value);
                if (newInterval !== currentRefreshInterval) {
                    // 清除当前的定时器
                    if (refreshIntervalId) {
                        clearInterval(refreshIntervalId);
                    }

                    // 更新当前间隔
                    currentRefreshInterval = newInterval;

                    // 重置倒计时
                    lastUpdateTime = new Date();
                    currentCountdown = currentRefreshInterval;
                    startCountdown();

                    // 启动新的定时器
                    refreshIntervalId = setInterval(async () => {
                        const data = await fetchServerStatus();
                        displayServerStatus(data);
                        lastUpdateTime = new Date();
                        currentCountdown = currentRefreshInterval;
                        startCountdown();
                    }, currentRefreshInterval);
                }
            });
        }

        // 超域出发按钮事件（在所有域名下都存在）
        document.getElementById('ff14-goto-region').addEventListener('click', function() {
            // 导航到指定URL
            window.location.href = 'https://ff14bjz.sdo.com/RegionKanTelepo';
        });

        // 拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = document.getElementById('ff14-status-header');

        header.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header) {
                isDragging = true;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, container);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }
    }

    // 获取区服状态数据
    async function fetchServerStatus() {
        try {
            // 随机选择areaId为6、7、8中的一个
            const randomAreaId = Math.floor(Math.random() * 3) + 6; // 6, 7, 8
            const url = `https://ff14bjz.sdo.com/api/orderserivce/queryGroupListTravelTarget?appId=100001900&areaId=${randomAreaId}&groupId=-1`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
                    'content-type': 'application/json',
                    'priority': 'u=1, i',
                    'referer': 'https://ff14bjz.sdo.com/RegionKanTelepo?&',
                    'sec-ch-ua': '"Chromium";v="142", "Microsoft Edge";v="142", "Not_A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0'
                },
                credentials: 'include' // 尝试使用当前页面的cookie
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取区服状态失败:', error);
            return null;
        }
    }

    // 解析并显示数据（仅陆行鸟区）
    function displayServerStatus(data) {
        if (!data || data.return_code !== 0) {
            document.getElementById('ff14-status-table').innerHTML =
                '<div class="loading">获取数据失败</div>';
            document.getElementById('ff14-area-status').textContent = '大区状态: --';
            // 隐藏推荐区域信息
            document.getElementById('ff14-recommendation').style.display = 'none';
            return;
        }

        try {
            const groupList = JSON.parse(data.data.groupList);

            // 查找陆行鸟区（areaId=1）
            const luXingNiaoArea = groupList.find(area => area.areaId === 1);

            if (!luXingNiaoArea) {
                document.getElementById('ff14-status-table').innerHTML =
                    '<div class="loading">未找到陆行鸟区数据</div>';
                document.getElementById('ff14-area-status').textContent = '大区状态: --';
                // 隐藏推荐区域信息
                document.getElementById('ff14-recommendation').style.display = 'none';
                return;
            }

            const statusMap = {
                0: { text: '流畅', class: 'status-0' },
                1: { text: '热门', class: 'status-1' },
                2: { text: '火爆', class: 'status-2' }
            };

            const status = statusMap[luXingNiaoArea.state] || { text: '未知', class: '' };

            // 检查是否需要发送通知（状态改善：从2变为0或1）
            if (previousAreaStatus === 2 && (luXingNiaoArea.state === 0 || luXingNiaoArea.state === 1)) {
                sendNotification(luXingNiaoArea.state);
            }

            // 更新大区状态显示
            document.getElementById('ff14-area-status').innerHTML =
                `大区状态: <span class="${status.class}">${status.text}</span>`;

            // 如果状态发生变化，添加记录
            if (previousAreaStatus !== luXingNiaoArea.state) {
                addStatusRecord(luXingNiaoArea.state);
            }

            // 更新上一次的大区状态
            previousAreaStatus = luXingNiaoArea.state;

            let html = '<table><thead><tr><th>服务器</th><th>排队时间</th></tr></thead><tbody>';

            for (const server of luXingNiaoArea.groups) {
                // queueTime为-999时显示为繁忙
                let queueTime, timeColor;
                if (server.queueTime === -999) {
                    queueTime = '繁忙';
                    timeColor = 'red';
                } else {
                    queueTime = `${server.queueTime}s`;
                    timeColor = server.queueTime > 300 ? 'red' :
                               server.queueTime > 60 ? 'orange' : 'green';
                }

                html += `
                    <tr>
                        <td>${server.groupName}</td>
                        <td><span style="color:${timeColor}">${queueTime}</span></td>
                    </tr>
                `;
            }

            html += '</tbody></table>';

            // 更新最后刷新时间
            lastUpdateTime = new Date();
            document.getElementById('ff14-last-update').textContent =
                `最后更新: ${lastUpdateTime.toLocaleTimeString()}`;

            document.getElementById('ff14-status-table').innerHTML = html;

            // 检查是否需要显示推荐信息（陆行鸟区繁忙时）
            if (luXingNiaoArea.state === 2) { // 2表示火爆/繁忙
                // 获取当前小时的推荐大区
                const recommendedArea = getRecommendedAreaForCurrentHour();

                // 更新推荐信息
                document.getElementById('ff14-recommendation-area').textContent = recommendedArea;
                document.getElementById('ff14-recommendation').style.display = 'block';
            } else {
                // 隐藏推荐区域信息
                document.getElementById('ff14-recommendation').style.display = 'none';
            }
        } catch (e) {
            console.error('解析数据失败:', e);
            document.getElementById('ff14-status-table').innerHTML =
                '<div class="loading">解析数据失败</div>';
            document.getElementById('ff14-area-status').textContent = '大区状态: --';
            // 隐藏推荐区域信息
            document.getElementById('ff14-recommendation').style.display = 'none';
        }
    }

    // 初始化
    createFloatingWindow();

    // 如果是主域名，启动监控功能
    if (isMainDomain) {
        // 请求通知权限
        requestNotificationPermission().then((granted) => {
            if (granted) {
                console.log('通知权限已获得');
            } else {
                console.log('通知权限被拒绝');
            }

            // 首次加载数据
            fetchServerStatus().then(displayServerStatus);

            // 启动定时器
            refreshIntervalId = setInterval(async () => {
                const data = await fetchServerStatus();
                displayServerStatus(data);
                lastUpdateTime = new Date();
                currentCountdown = currentRefreshInterval;
                startCountdown();
            }, currentRefreshInterval);

            // 开始倒计时显示
            lastUpdateTime = new Date();
            currentCountdown = currentRefreshInterval;
            startCountdown();

            // 初始化状态历史记录显示
            updateStatusHistoryDisplay();
        });
    }

})();