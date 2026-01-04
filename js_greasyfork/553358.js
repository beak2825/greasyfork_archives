// ==UserScript==
// @name         CDK 福利领取提醒
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  CDK 福利领取提醒功能，支持倒计时和自动跳转
// @author       A嘉技术
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.open
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553358/CDK%20%E7%A6%8F%E5%88%A9%E9%A2%86%E5%8F%96%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/553358/CDK%20%E7%A6%8F%E5%88%A9%E9%A2%86%E5%8F%96%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const styles = `
        #cdk-reminder-panel {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            left: -320px;
            width: 340px;
            max-height: 50vh;
            background: #fff;
            border: 2px solid #4CAF50;
            border-radius: 0 8px 8px 0;
            box-shadow: 4px 0 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: left 0.3s ease;
        }
        #cdk-reminder-panel.show {
            left: 0;
            transform: translateY(-50%);
        }
        #cdk-reminder-trigger {
            position: fixed;
            top: 50%;
            left: 0;
            width: 30px;
            height: 80px;
            background: #4CAF50;
            border-radius: 0 8px 8px 0;
            z-index: 9999;
            transform: translateY(-50%);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 13px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            box-shadow: 2px 0 8px rgba(0,0,0,0.2);
            transition: width 0.2s ease, background 0.2s ease;
        }
        #cdk-reminder-trigger:hover {
            width: 35px;
            background: #45a049;
        }
        #cdk-reminder-header {
            background: #4CAF50;
            color: white;
            padding: 12px 15px;
            font-weight: bold;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        #cdk-reminder-controls {
            display: flex;
            gap: 10px;
        }
        #cdk-reminder-pin {
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        #cdk-reminder-pin:hover {
            opacity: 1;
        }
        #cdk-reminder-pin.pinned {
            opacity: 1;
            transform: rotate(45deg);
            color: #FFD700;
        }
        #cdk-reminder-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
        }
        #cdk-reminder-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }
        #cdk-form-section {
            margin-top: 15px;
        }
        #cdk-form-toggle-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            margin-bottom: 15px;
        }
        #cdk-form-toggle-btn:hover {
            background: #1976D2;
        }
        #cdk-form-container {
            display: none;
        }
        #cdk-form-container.show {
            display: block;
        }
        .cdk-form-group {
            margin-bottom: 12px;
        }
        .cdk-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 13px;
            color: #333;
        }
        .cdk-form-group input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 13px;
        }
        .cdk-form-group input[type="checkbox"] {
            margin-right: 5px;
        }
        .cdk-form-hint {
            font-size: 11px;
            color: #999;
            margin-top: 3px;
        }
        .cdk-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            margin-top: 10px;
        }
        .cdk-btn:hover {
            background: #45a049;
        }
        .cdk-item {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 10px;
            position: relative;
        }
        .cdk-item-name {
            font-weight: bold;
            font-size: 14px;
            color: #2196F3;
            margin-bottom: 5px;
            cursor: pointer;
            text-decoration: underline;
            word-break: break-word;
            padding-right: 60px;
        }
        .cdk-item-name:hover {
            color: #1976D2;
        }
        .cdk-item-time {
            font-size: 12px;
            color: #888;
            margin-bottom: 5px;
        }
        .cdk-item-countdown {
            font-size: 16px;
            font-weight: bold;
            color: #4CAF50;
            margin: 8px 0;
        }
        .cdk-item-countdown.warning {
            color: #FF9800;
        }
        .cdk-item-countdown.danger {
            color: #F44336;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
        }
        .cdk-item-auto {
            font-size: 12px;
            color: #4CAF50;
            margin-bottom: 5px;
        }
        .cdk-item-delete {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #F44336;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .cdk-item-delete:hover {
            background: #d32f2f;
        }
        .cdk-divider {
            border-top: 1px solid #ddd;
            margin: 15px 0;
        }
        .cdk-empty {
            text-align: center;
            color: #999;
            padding: 20px;
            font-size: 14px;
        }
        .cdk-notice {
            background: #FFF3CD;
            border: 1px solid #FFE69C;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 12px;
            color: #856404;
        }
        .cdk-notice-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        /* 弹幕样式 */
        /* 调整弹幕位置：修改 top 值，建议范围 50px-100px */
        #cdk-danmaku-container {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            height: 50px;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        }
        .cdk-danmaku {
            position: absolute;
            white-space: nowrap;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5);
            padding: 8px 16px;
            border-radius: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            animation: danmaku-move 15s linear;
            pointer-events: auto;
            cursor: pointer;
            transition: font-size 0.3s ease, padding 0.3s ease;
        }
        .cdk-danmaku.urgent {
            font-size: 20px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            animation: danmaku-move 15s linear, pulse 1s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .cdk-danmaku:hover {
            animation-play-state: paused;
        }
        @keyframes danmaku-move {
            from {
                transform: translateX(100vw);
            }
            to {
                transform: translateX(-100%);
            }
        }
    `;

    // 注入样式
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // 创建弹幕容器
    const danmakuContainer = document.createElement('div');
    danmakuContainer.id = 'cdk-danmaku-container';
    document.body.appendChild(danmakuContainer);

    // 创建触发器
    const trigger = document.createElement('div');
    trigger.id = 'cdk-reminder-trigger';
    trigger.textContent = 'CDK提醒';
    document.body.appendChild(trigger);

    // 创建主面板
    const panel = document.createElement('div');
    panel.id = 'cdk-reminder-panel';
    panel.innerHTML = `
        <div id="cdk-reminder-header">
            <span>CDK 福利提醒</span>
            <div id="cdk-reminder-controls">
                <button id="cdk-reminder-pin" title="固定面板">📌</button>
                <button id="cdk-reminder-close" title="关闭面板">×</button>
            </div>
        </div>
        <div id="cdk-reminder-content">
            <div class="cdk-notice">
                <div class="cdk-notice-title">💡 使用提示</div>
                首次使用自动跳转功能时，请在浏览器弹窗拦截提示中选择"始终允许"，以确保自动跳转正常工作。
            </div>
            <div id="cdk-reminder-list"></div>
            <div id="cdk-form-section">
                <button id="cdk-form-toggle-btn">+ 添加新提醒</button>
                <div id="cdk-form-container">
                    <div class="cdk-form-group">
                        <label>CDK 名称</label>
                        <input type="text" id="cdk-name" placeholder="例如：Cursor Pro Token">
                    </div>
                    <div class="cdk-form-group">
                        <label>CKD 地址</label>
                        <input type="text" id="cdk-url" placeholder="https://cdk.linux.do/receive/*****">
                    </div>
                    <div class="cdk-form-group">
                        <label>开始时间</label>
                        <input type="text" id="cdk-time" placeholder="2025/10/22 17:00:00" value="2025/10/22 17:00:00">
                        <div class="cdk-form-hint">格式：年/月/日 时:分:秒</div>
                    </div>
                    <div class="cdk-form-group">
                        <label>
                            <input type="checkbox" id="cdk-auto" checked>
                            倒计时 30 秒时自动跳转
                        </label>
                    </div>
                    <div class="cdk-form-group">
                        <label>
                            <input type="checkbox" id="cdk-danmaku" checked>
                            启用弹幕提醒
                        </label>
                    </div>
                    <button class="cdk-btn" id="cdk-add-btn">添加提醒</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 侧边栏交互逻辑
    let hideTimeout = null;
    let isPinned = GM_getValue('panel_pinned', false);
    const pinBtn = document.getElementById('cdk-reminder-pin');

    // 初始化固定状态
    if (isPinned) {
        panel.classList.add('show');
        pinBtn.classList.add('pinned');
    }

    // 固定按钮点击事件
    pinBtn.addEventListener('click', () => {
        isPinned = !isPinned;
        GM_setValue('panel_pinned', isPinned);
        if (isPinned) {
            pinBtn.classList.add('pinned');
            panel.classList.add('show');
        } else {
            pinBtn.classList.remove('pinned');
        }
    });

    // 鼠标移入触发器或面板时显示
    trigger.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        panel.classList.add('show');
    });

    panel.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        panel.classList.add('show');
    });

    // 鼠标移出时延迟隐藏（仅在未固定时）
    trigger.addEventListener('mouseleave', () => {
        if (isPinned) return;
        hideTimeout = setTimeout(() => {
            if (!panel.matches(':hover')) {
                panel.classList.remove('show');
            }
        }, 300);
    });

    panel.addEventListener('mouseleave', () => {
        if (isPinned) return;
        hideTimeout = setTimeout(() => {
            panel.classList.remove('show');
        }, 300);
    });

    // 关闭按钮
    document.getElementById('cdk-reminder-close').addEventListener('click', () => {
        panel.classList.remove('show');
        if (isPinned) {
            isPinned = false;
            GM_setValue('panel_pinned', false);
            pinBtn.classList.remove('pinned');
        }
    });

    // 切换表单显示/隐藏
    const formToggleBtn = document.getElementById('cdk-form-toggle-btn');
    const formContainer = document.getElementById('cdk-form-container');
    formToggleBtn.addEventListener('click', () => {
        formContainer.classList.toggle('show');
        formToggleBtn.textContent = formContainer.classList.contains('show') ? '− 收起表单' : '+ 添加新提醒';
    });

    // 解析用户输入的时间格式
    function parseCustomTime(timeStr) {
        // 支持格式：2025/10/22 17:00:00
        const regex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        const match = timeStr.trim().match(regex);

        if (!match) {
            return null;
        }

        const [, year, month, day, hour, minute, second] = match;
        const date = new Date(
            parseInt(year),
            parseInt(month) - 1, // 月份从 0 开始
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second)
        );

        // 验证日期是否有效
        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    // 弹幕管理
    class DanmakuManager {
        constructor() {
            this.activeCount = 0;
            this.maxConcurrent = 3;
            this.lastShowTime = {};
            this.minInterval = 30000; // 同一事项最小显示间隔30秒
        }

        canShow(reminderId) {
            const now = Date.now();
            const lastTime = this.lastShowTime[reminderId] || 0;
            return (now - lastTime) >= this.minInterval;
        }

        show(reminder, isUrgent = false) {
            if (this.activeCount >= this.maxConcurrent) return;
            if (!this.canShow(reminder.id)) return;

            this.activeCount++;
            this.lastShowTime[reminder.id] = Date.now();

            const danmaku = document.createElement('div');
            danmaku.className = isUrgent ? 'cdk-danmaku urgent' : 'cdk-danmaku';
            danmaku.style.top = `${Math.random() * 30}px`;
            danmaku.dataset.reminderId = reminder.id;
            danmaku.dataset.reminderTime = reminder.time;

            // 初始化倒计时文本
            this.updateDanmakuText(danmaku, reminder);

            // 点击弹幕打开链接
            danmaku.addEventListener('click', () => {
                window.open(reminder.url, '_blank');
            });

            danmakuContainer.appendChild(danmaku);

            // 动画结束后移除
            danmaku.addEventListener('animationend', () => {
                danmaku.remove();
                this.activeCount--;
            });
        }

        updateDanmakuText(danmaku, reminder) {
            const now = Date.now();
            const diff = reminder.time - now;
            const countdown = formatCountdown(diff);
            danmaku.textContent = `🎁 ${reminder.name} 剩余时间 ${countdown}`;
        }

        updateAllDanmaku() {
            const danmakus = danmakuContainer.querySelectorAll('.cdk-danmaku');
            danmakus.forEach(danmaku => {
                const reminderId = parseInt(danmaku.dataset.reminderId);
                const reminderTime = parseInt(danmaku.dataset.reminderTime);
                const reminder = reminderManager.reminders.find(r => r.id === reminderId);
                if (reminder) {
                    this.updateDanmakuText(danmaku, reminder);

                    // 检查是否需要切换为紧急模式
                    const diff = reminderTime - Date.now();
                    if (diff <= 10000 && !danmaku.classList.contains('urgent')) {
                        danmaku.classList.add('urgent');
                    }
                }
            });
        }
    }

    const danmakuManager = new DanmakuManager();

    // 数据管理
    class CDKReminder {
        constructor() {
            this.reminders = this.loadReminders();
            this.updateInterval = null;
            this.autoOpenedUrls = new Set();
            this.userInteracted = GM_getValue('user_interacted', false);
        }

        loadReminders() {
            const data = GM_getValue('cdk_reminders', '[]');
            return JSON.parse(data);
        }

        saveReminders() {
            GM_setValue('cdk_reminders', JSON.stringify(this.reminders));
        }

        addReminder(name, url, time, autoJump, enableDanmaku) {
            const reminder = {
                id: Date.now(),
                name,
                url,
                time: time,
                autoJump,
                enableDanmaku,
                created: Date.now()
            };
            this.reminders.push(reminder);
            this.saveReminders();
            return reminder;
        }

        deleteReminder(id) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveReminders();
        }

        getActiveReminders() {
            const now = Date.now();
            return this.reminders.filter(r => r.time > now);
        }

        cleanExpiredReminders() {
            const now = Date.now();
            const before = this.reminders.length;
            this.reminders = this.reminders.filter(r => r.time > now);
            if (this.reminders.length !== before) {
                this.saveReminders();
                console.log('[CDK Reminder] 已自动清理过期提醒');
            }
        }

        setUserInteracted() {
            this.userInteracted = true;
            GM_setValue('user_interacted', true);
        }
    }

    const reminderManager = new CDKReminder();

    // 渲染提醒列表
    function renderReminders() {
        const listContainer = document.getElementById('cdk-reminder-list');
        const activeReminders = reminderManager.getActiveReminders();

        if (activeReminders.length === 0) {
            listContainer.innerHTML = '<div class="cdk-empty">暂无提醒事项</div>';
            return;
        }

        listContainer.innerHTML = activeReminders.map(reminder => {
            const now = Date.now();
            const diff = reminder.time - now;
            const countdown = formatCountdown(diff);
            const countdownClass = diff <= 30000 ? 'danger' : (diff <= 300000 ? 'warning' : '');

            return `
                <div class="cdk-item" data-id="${reminder.id}">
                    <button class="cdk-item-delete" data-id="${reminder.id}">删除</button>
                    <div class="cdk-item-name" data-url="${escapeHtml(reminder.url)}">${escapeHtml(reminder.name)}</div>
                    <div class="cdk-item-time">⏰ ${new Date(reminder.time).toLocaleString('zh-CN')}</div>
                    <div class="cdk-item-countdown ${countdownClass}">${countdown}</div>
                    ${reminder.autoJump ? '<div class="cdk-item-auto">✓ 已启用自动跳转</div>' : ''}
                    ${reminder.enableDanmaku ? '<div class="cdk-item-auto">✓ 已启用弹幕提醒</div>' : ''}
                </div>
            `;
        }).join('');

        // 绑定删除按钮事件
        listContainer.querySelectorAll('.cdk-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm('确定要删除这个提醒吗？')) {
                    reminderManager.deleteReminder(id);
                    renderReminders();
                }
            });
        });

        // 绑定事项名称点击事件
        listContainer.querySelectorAll('.cdk-item-name').forEach(nameEl => {
            nameEl.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                if (url) {
                    reminderManager.setUserInteracted();
                    window.open(url, '_blank');
                }
            });
        });
    }

    // 格式化倒计时
    function formatCountdown(ms) {
        if (ms <= 0) {
            return '⏰ 时间已到！';
        }

        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} 天 ${hours % 24} 小时 ${minutes % 60} 分 ${seconds % 60} 秒`;
        } else if (hours > 0) {
            return `${hours} 小时 ${minutes % 60} 分 ${seconds % 60} 秒`;
        } else if (minutes > 0) {
            return `${minutes} 分 ${seconds % 60} 秒`;
        } else {
            return `${seconds} 秒`;
        }
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 添加提醒
    document.getElementById('cdk-add-btn').addEventListener('click', () => {
        const name = document.getElementById('cdk-name').value.trim();
        const url = document.getElementById('cdk-url').value.trim();
        const timeStr = document.getElementById('cdk-time').value.trim();
        const autoJump = document.getElementById('cdk-auto').checked;
        const enableDanmaku = document.getElementById('cdk-danmaku').checked;

        if (!name) {
            alert('请输入事项名称');
            return;
        }
        if (!url) {
            alert('请输入 URL 地址');
            return;
        }
        if (!timeStr) {
            alert('请输入开始时间');
            return;
        }

        // 解析时间
        const parsedDate = parseCustomTime(timeStr);
        if (!parsedDate) {
            alert('时间格式不正确！\n请使用格式：2025/10/22 17:00:00');
            return;
        }

        const selectedTime = parsedDate.getTime();
        if (selectedTime <= Date.now()) {
            if (!confirm('选择的时间已经过去，确定要添加吗？')) {
                return;
            }
        }

        reminderManager.addReminder(name, url, selectedTime, autoJump, enableDanmaku);
        reminderManager.setUserInteracted();

        // 清空表单
        document.getElementById('cdk-name').value = '';
        document.getElementById('cdk-url').value = '';
        document.getElementById('cdk-time').value = '';
        document.getElementById('cdk-auto').checked = true;
        document.getElementById('cdk-danmaku').checked = true;

        // 收起表单
        formContainer.classList.remove('show');
        formToggleBtn.textContent = '+ 添加新提醒';

        renderReminders();
        alert('提醒添加成功！');
    });

    // 自动跳转检查
    function checkAutoJump() {
        const now = Date.now();
        reminderManager.getActiveReminders().forEach(reminder => {
            if (!reminder.autoJump) return;

            const diff = reminder.time - now;
            const urlKey = `${reminder.id}_${reminder.url}`;

            // 倒计时在 30 秒以内且未打开过
            if (diff <= 30000 && diff > 0 && !reminderManager.autoOpenedUrls.has(urlKey)) {
                console.log(`[CDK Reminder] 自动打开: ${reminder.name} - ${reminder.url}`);

                const newWindow = window.open(reminder.url, '_blank');

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    console.warn('[CDK Reminder] 弹窗被拦截，请允许弹窗');
                    reminderManager.autoOpenedUrls.add(urlKey);

                    if (Notification.permission === 'granted') {
                        new Notification('CDK 提醒', {
                            body: `${reminder.name} 的时间到了！但弹窗被拦截，请手动打开。`,
                            icon: 'https://linux.do/favicon.ico'
                        });
                    }
                } else {
                    reminderManager.autoOpenedUrls.add(urlKey);
                }
            }
        });
    }

    // 弹幕提醒检查
    function checkDanmaku() {
        const now = Date.now();
        reminderManager.getActiveReminders().forEach(reminder => {
            if (!reminder.enableDanmaku) return;

            const diff = reminder.time - now;

            // 在5分钟内显示弹幕
            if (diff > 0 && diff <= 300000) {
                const isUrgent = diff <= 10000; // 最后10秒标记为紧急
                danmakuManager.show(reminder, isUrgent);
            }
        });

        // 更新所有弹幕的倒计时文本
        danmakuManager.updateAllDanmaku();
    }

    // 请求通知权限
    if (Notification.permission === 'default') {
        document.addEventListener('click', function requestNotification() {
            Notification.requestPermission();
            document.removeEventListener('click', requestNotification);
        }, { once: true });
    }

    // 定时更新
    function startUpdateLoop() {
        renderReminders();
        let counter = 0;
        reminderManager.updateInterval = setInterval(() => {
            renderReminders();
            checkAutoJump();
            reminderManager.cleanExpiredReminders();

            // 每10秒检查一次弹幕
            counter++;
            if (counter % 10 === 0) {
                checkDanmaku();
            }
        }, 1000);
    }

    // 初始化
    startUpdateLoop();

    console.log('[CDK Reminder] 脚本已加载');
})();

