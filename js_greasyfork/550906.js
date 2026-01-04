// ==UserScript==
// @name         地理信息安全在线培训自动化学习（极简自动版）
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  自动化学习脚本，修复自动启动标志检测问题
// @author       YourName
// @match        https://gistraining.webmap.cn/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550906/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AD%A6%E4%B9%A0%EF%BC%88%E6%9E%81%E7%AE%80%E8%87%AA%E5%8A%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550906/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AD%A6%E4%B9%A0%EF%BC%88%E6%9E%81%E7%AE%80%E8%87%AA%E5%8A%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[培训助手] 脚本开始执行");

    // 极简样式
    GM_addStyle(`
        #control-panel {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 280px !important;
            background: linear-gradient(135deg, #4361ee, #3a0ca3) !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            color: white !important;
            font-family: 'Segoe UI', Arial, sans-serif !important;
            z-index: 999999 !important;
            padding: 20px !important;
            transition: all 0.3s ease !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }

        #control-panel.collapsed {
            height: 60px !important;
            overflow: hidden !important;
        }

        .panel-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 15px !important;
            padding-bottom: 10px !important;
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }

        .panel-title {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-weight: 600 !important;
            font-size: 18px !important;
        }

        .toggle-btn {
            background: rgba(255,255,255,0.1) !important;
            border: none !important;
            color: white !important;
            width: 30px !important;
            height: 30px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-weight: bold !important;
            transition: all 0.2s !important;
        }

        .toggle-btn:hover {
            background: rgba(255,255,255,0.2) !important;
            transform: scale(1.1) !important;
        }

        .control-group, .checkbox-group {
            margin: 10px 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .control-label {
            font-size: 14px !important;
            min-width: 100px !important;
            color: #e0e0e0 !important;
        }

        .control-input {
            flex: 1 !important;
            padding: 8px !important;
            border-radius: 8px !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            background: rgba(255,255,255,0.1) !important;
            color: white !important;
        }

        .checkbox-input {
            width: 18px !important;
            height: 18px !important;
        }

        .btn-group {
            display: flex !important;
            gap: 10px !important;
            margin: 15px 0 !important;
        }

        .panel-btn {
            flex: 1 !important;
            padding: 10px !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-size: 14px !important;
        }

        .start-btn {
            background: linear-gradient(135deg, #4cc9f0, #4895ef) !important;
            color: white !important;
        }

        .start-btn.disabled {
            background: linear-gradient(135deg, #6c757d, #495057) !important;
            cursor: not-allowed !important;
            opacity: 0.7 !important;
        }

        .stop-btn {
            background: linear-gradient(135deg, #f72585, #b5179e) !important;
            color: white !important;
        }

        .panel-btn:hover:not(.disabled) {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }

        .action-btn {
            width: 100% !important;
            padding: 8px 12px !important;
            background: rgba(255,255,255,0.1) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 6px !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            margin: 10px 0 !important;
            text-align: center !important;
        }

        .action-btn:hover {
            background: rgba(255,255,255,0.2) !important;
        }

        .scroll-progress {
            height: 6px !important;
            background: rgba(255,255,255,0.1) !important;
            border-radius: 3px !important;
            margin: 15px 0 !important;
            overflow: hidden !important;
        }

        .scroll-progress-bar {
            height: 100% !important;
            background: linear-gradient(90deg, #4cc9f0, #4895ef) !important;
            width: 0% !important;
            transition: width 0.3s ease !important;
        }

        .debug-info {
            font-family: monospace !important;
            font-size: 11px !important;
            max-height: 150px !important;
            overflow-y: auto !important;
            padding: 10px !important;
            background: rgba(0,0,0,0.2) !important;
            border-radius: 8px !important;
            white-space: pre-wrap !important;
            margin-top: 15px !important;
        }
    `);

    // 简化状态管理
    const state = {
        isRunning: false,
        intervals: {},
        lastActivity: Date.now(),
        activityStats: { scrolls: 0, clicks: 0, keystrokes: 0, mousemoves: 0 },
        scrollDirection: 1,
        debugInfo: "",
        startTime: null,
        refreshTimer: null,
        config: {
            scrollInterval: 30000,
            microScrollInterval: 10000,
            clickInterval: 15000,
            moveInterval: 5000,
            activityInterval: 20000,
            studyTimeInterval: 30000,
            autoRefreshInterval: 30 * 60 * 1000, // 默认30分钟
            minReadTime: 180000,
            debug: true
        }
    };

    // 简化日志函数（仅控制台输出）
    function log(msg) {
        const time = new Date().toLocaleTimeString();
        const message = `[${time}] ${msg}`;
        console.log(`[培训助手] ${message}`);

        if (state.config.debug) {
            state.debugInfo = message + "\n" + state.debugInfo.substring(0, 1000);
            updateDebugInfo();
        }
    }

    // 更新调试信息
    function updateDebugInfo() {
        const debugInfoEl = document.querySelector('.debug-info');
        if (debugInfoEl) {
            debugInfoEl.textContent = state.debugInfo;
        }
    }

    // 简化活动记录
    function recordActivity(type) {
        state.lastActivity = Date.now();
        if (state.activityStats[type] !== undefined) {
            state.activityStats[type]++;
        }
        updateActivityStats();
    }

    // 简化滚动容器获取
    function getScrollContainer() {
        const selectors = [
            '.box.itembox[style*="overflow-y: scroll"]',
            '.box.itembox[style*="overflow"]',
            'div[style*="overflow-y: scroll"]',
            'div[style*="overflow: auto"]',
            '.box.itembox:not(.collapsed)'
        ];

        return selectors.map(sel => document.querySelector(sel))
                       .find(el => el && el.scrollHeight > el.clientHeight);
    }

    // 简化平滑滚动
    function smoothScroll(element, target, duration = 2000) {
        if (!element) return;

        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);

            element.scrollTop = start + change * easeProgress;

            // 更新滚动进度条
            const scrollBar = document.querySelector('.scroll-progress-bar');
            if (scrollBar && element.scrollHeight > element.clientHeight) {
                const progress = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
                scrollBar.style.width = `${progress}%`;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                recordActivity('scrolls');
            }
        }

        requestAnimationFrame(animate);
    }

    // 简化滚动模拟
    function simulateScroll() {
        if (!state.isRunning) return;

        const container = getScrollContainer();
        if (!container) {
            log("未找到滚动容器");
            return;
        }

        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll <= 0) return;

        const current = container.scrollTop;
        let target;

        if (state.scrollDirection === 1) { // 向下
            target = Math.min(current + 200, maxScroll);
            if (target >= maxScroll - 50) {
                target = maxScroll;
                setTimeout(() => {
                    if (state.isRunning) {
                        state.scrollDirection = -1;
                    }
                }, 5000);
            }
        } else { // 向上
            target = Math.max(current - 200, 0);
            if (target <= 50) {
                target = 0;
                setTimeout(() => {
                    if (state.isRunning) {
                        state.scrollDirection = 1;
                    }
                }, 3000);
            }
        }

        smoothScroll(container, target);
    }

    // 简化点击模拟
    function simulateClick() {
        if (!state.isRunning) return;

        try {
            const container = getScrollContainer() || document.body;
            const rect = container.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width * 0.8;
            const y = rect.top + Math.random() * rect.height * 0.8;

            const element = document.elementFromPoint(x, y);
            if (element) {
                element.click();
                recordActivity('clicks');
            }
        } catch (e) {
            // 忽略错误
        }
    }

    // 简化键盘模拟
    function simulateKeyPress() {
        if (!state.isRunning) return;

        const keys = ['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp'];
        const key = keys[Math.floor(Math.random() * keys.length)];

        try {
            document.dispatchEvent(new KeyboardEvent('keydown', { key }));
            recordActivity('keystrokes');
        } catch (e) {
            // 忽略错误
        }
    }

    // 简化鼠标移动
    function simulateMouseMove() {
        if (!state.isRunning) return;

        try {
            const container = getScrollContainer() || document.body;
            const rect = container.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;

            container.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
            recordActivity('mousemoves');
        } catch (e) {
            // 忽略错误
        }
    }

    // 自动刷新功能（支持自定义时间，刷新后自动启动）
    function setupAutoRefresh() {
        // 清除之前的定时器
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
            state.refreshTimer = null;
        }

        // 如果自动刷新被禁用，直接返回
        const autoRefreshCheckbox = document.getElementById('auto-refresh');
        if (!autoRefreshCheckbox || !autoRefreshCheckbox.checked) {
            log("自动刷新已禁用");
            return;
        }

        // 获取自定义刷新时间
        const refreshTimeInput = document.getElementById('refresh-time');
        let refreshInterval = state.config.autoRefreshInterval;

        if (refreshTimeInput) {
            const customMinutes = parseInt(refreshTimeInput.value) || 30;
            refreshInterval = customMinutes * 60 * 1000;
            state.config.autoRefreshInterval = refreshInterval;
        }

        // 设置新的自动刷新定时器
        state.refreshTimer = setTimeout(() => {
            const refreshMinutes = refreshInterval / 60000;
            log(`准备自动刷新页面... (间隔: ${refreshMinutes}分钟)`);

            // 保存当前运行状态
            const wasRunning = state.isRunning;

            // 停止脚本
            if (state.isRunning) {
                stopScript();
            }

            // 延迟刷新，确保状态保存
            setTimeout(() => {
                // 如果之前是运行状态，设置自动启动标志
                if (wasRunning) {
                    localStorage.setItem('trainingAutoStart', 'true');
                    log("已设置自动启动标志，将在刷新后自动启动");
                }
                window.location.reload();
            }, 2000);
        }, refreshInterval);

        log(`设置自动刷新: ${refreshInterval/60000}分钟后`);
    }

    // 启动脚本
    function startScript() {
        if (state.isRunning) {
            log("脚本已在运行");
            return;
        }

        state.isRunning = true;
        state.startTime = Date.now();
        state.scrollDirection = 1;

        // 清空活动统计
        state.activityStats = { scrolls: 0, clicks: 0, keystrokes: 0, mousemoves: 0 };

        // 启动各种模拟
        state.intervals.scroll = setInterval(simulateScroll, state.config.scrollInterval);
        state.intervals.microScroll = setInterval(() => {
            const container = getScrollContainer();
            if (container) {
                const offset = (Math.random() > 0.5 ? 1 : -1) * 20;
                const target = Math.max(0, Math.min(container.scrollTop + offset, container.scrollHeight - container.clientHeight));
                smoothScroll(container, target, 500);
            }
        }, state.config.microScrollInterval);

        state.intervals.click = setInterval(simulateClick, state.config.clickInterval);
        state.intervals.move = setInterval(simulateMouseMove, state.config.moveInterval);

        // 启动自动刷新
        setupAutoRefresh();

        // 初始滚动
        setTimeout(simulateScroll, 1000);

        log("脚本已启动");
        updateUI();
    }

    // 停止脚本
    function stopScript() {
        state.isRunning = false;

        // 清除所有定时器
        Object.keys(state.intervals).forEach(key => {
            clearInterval(state.intervals[key]);
            delete state.intervals[key];
        });

        // 清除自动刷新定时器
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
            state.refreshTimer = null;
        }

        log("脚本已停止");
        updateUI();
    }

    // 更新活动统计显示
    function updateActivityStats() {
        const statsEl = document.getElementById('activity-stats');
        if (!statsEl) return;

        const elapsed = Date.now() - (state.startTime || Date.now());
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        statsEl.innerHTML = `
            <div>⏱️ 运行时间: ${minutes}分${seconds}秒</div>
            <div>↕️ 滚动次数: ${state.activityStats.scrolls}</div>
            <div>🖱️ 点击次数: ${state.activityStats.clicks}</div>
            <div>⌨️ 按键次数: ${state.activityStats.keystrokes}</div>
            <div>:pointer: 鼠标移动: ${state.activityStats.mousemoves}</div>
        `;
    }

    // 更新UI（主要是按钮状态）
    function updateUI() {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');

        if (startBtn && stopBtn) {
            if (state.isRunning) {
                startBtn.textContent = '✅ 已启动';
                startBtn.classList.add('disabled');
                startBtn.disabled = true;
                stopBtn.disabled = false;
            } else {
                startBtn.textContent = '▶️ 启动';
                startBtn.classList.remove('disabled');
                startBtn.disabled = false;
                stopBtn.disabled = false;
            }
        }

        // 更新活动统计
        updateActivityStats();
    }

    // 创建控制面板
    function createControlPanel() {
        if (document.getElementById('control-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'control-panel';

        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">
                    <span class="panel-icon">🎓</span>
                    <span>培训助手 6.6</span>
                </div>
                <button class="toggle-btn" id="toggle-panel">−</button>
            </div>
            <div class="panel-content">
                <div class="control-group">
                    <label class="control-label">自动刷新(分钟)</label>
                    <input type="number" class="control-input" id="refresh-time"
                           value="30" min="5" max="120">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" class="checkbox-input" id="auto-refresh" checked>
                    <label class="control-label" for="auto-refresh">启用自动刷新</label>
                </div>
                <div class="btn-group">
                    <button class="panel-btn start-btn" id="start-btn">▶️ 启动</button>
                    <button class="panel-btn stop-btn" id="stop-btn">⏹️ 停止</button>
                </div>
                <div class="scroll-progress">
                    <div class="scroll-progress-bar"></div>
                </div>
                <div id="activity-stats">活跃度数据载入中...</div>
                <button class="action-btn" id="page-refresh">🔄 页面刷新并自启插件</button>
                <div class="debug-info"></div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const refreshBtn = document.getElementById('page-refresh');

        startBtn.addEventListener('click', function() {
            startScript();
            // 设置自动启动标志
            localStorage.setItem('trainingAutoStart', 'true');
            log("已设置自动启动标志");
        });

        stopBtn.addEventListener('click', function() {
            stopScript();
            // 只有在用户主动停止时才清除标志
            localStorage.removeItem('trainingAutoStart');
            log("已清除自动启动标志");
        });

        // 页面刷新并自启插件按钮
        refreshBtn.addEventListener('click', () => {
            if (confirm("确定要刷新页面并自动重启插件吗？")) {
                log("准备刷新页面并自动重启插件...");

                if (state.isRunning) {
                    // 设置自动启动标志
                    localStorage.setItem('trainingAutoStart', 'true');
                    stopScript();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // 如果未运行，清除自动启动标志
                    localStorage.removeItem('trainingAutoStart');
                    window.location.reload();
                }
            }
        });

        document.getElementById('toggle-panel').addEventListener('click', function() {
            panel.classList.toggle('collapsed');
            this.textContent = panel.classList.contains('collapsed') ? '+' : '−';
        });

        // 自动刷新时间更改时重新设置定时器
        document.getElementById('refresh-time').addEventListener('change', function() {
            const minutes = parseInt(this.value) || 30;
            state.config.autoRefreshInterval = minutes * 60 * 1000;
            log(`自动刷新时间已更新为: ${minutes}分钟`);

            // 如果脚本正在运行，重新设置刷新定时器
            if (state.isRunning) {
                setupAutoRefresh();
            }
        });

        // 自动刷新开关
        document.getElementById('auto-refresh').addEventListener('change', function() {
            if (this.checked) {
                log('自动刷新已开启');
                if (state.isRunning) {
                    setupAutoRefresh();
                }
            } else {
                if (state.refreshTimer) {
                    clearTimeout(state.refreshTimer);
                    state.refreshTimer = null;
                }
                log('自动刷新已关闭');
            }
        });

        updateUI();
        log("控制面板创建完成");
    }

    // 自动启动检查函数
    function checkAutoStart() {
        // 检查localStorage中的自动启动标志
        const autoStart = localStorage.getItem('trainingAutoStart');

        if (autoStart === 'true') {
            log("检测到自动启动标志，准备启动脚本...");

            // 不清除标志，保持它以便下次刷新也能自动启动

            // 确保页面完全加载后再启动
            const waitForPageLoad = () => {
                if (document.readyState === 'complete') {
                    // 延迟启动，确保所有元素都已加载
                    setTimeout(() => {
                        startScript();
                    }, 3000);
                } else {
                    // 等待页面加载完成
                    window.addEventListener('load', () => {
                        setTimeout(() => {
                            startScript();
                        }, 3000);
                    }, { once: true });
                }
            };

            waitForPageLoad();
        } else {
            log("未检测到自动启动标志，等待用户手动启动");
        }
    }

    // 页面加载完成后初始化
    function init() {
        log("开始初始化...");

        // 首先检查是否需要自动启动
        checkAutoStart();

        // 创建控制面板
        const createPanelWhenReady = () => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    createControlPanel();
                    log("DOMContentLoaded: 控制面板已创建");
                }, { once: true });
            } else {
                createControlPanel();
                log("立即创建控制面板");
            }
        };

        createPanelWhenReady();

        // 备用创建（如果3秒后仍未创建）
        setTimeout(() => {
            if (!document.getElementById('control-panel')) {
                createControlPanel();
                log("备用创建: 控制面板已创建");
            }
        }, 3000);

        log("初始化完成");
    }

    // 启动初始化
    init();

    console.log("[培训助手] 脚本加载完成 - 修复自动启动版");
})();