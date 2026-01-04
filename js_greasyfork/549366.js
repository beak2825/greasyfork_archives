// ==UserScript==
// @name         B站直播摸鱼模式|偷偷看直播|上班摸鱼
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  隐身模式下伪装成AI聊天界面，支持拖动按钮和随机间隔自动发送
// @author       小派sama
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/549366/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%91%B8%E9%B1%BC%E6%A8%A1%E5%BC%8F%7C%E5%81%B7%E5%81%B7%E7%9C%8B%E7%9B%B4%E6%92%AD%7C%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/549366/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%91%B8%E9%B1%BC%E6%A8%A1%E5%BC%8F%7C%E5%81%B7%E5%81%B7%E7%9C%8B%E7%9B%B4%E6%92%AD%7C%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #stealth-mode-btn {
            position: fixed;
            bottom: 100px;
            right: -25px;
            z-index: 10000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #FB7299;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s;
            user-select: none;
            touch-action: none;
        }

        #stealth-mode-btn:hover {
            background: #FF85AD;
            transform: scale(1.05);
        }

        #stealth-mode-btn.stealth-active {
            background: #00A1D6;
        }

        #stealth-mode-btn.dragging {
            opacity: 0.8;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }

        /* 隐身模式样式 */
        .stealth-mode body > *:not(#stealth-mode-btn):not(#stealth-danmu-panel):not(#stealth-emoji-panel):not(#stealth-ai-chat) {
            display: none !important;
        }

        .stealth-mode {
            background: #f7f7f7 !important;
        }

        /* AI聊天界面容器 */
        #stealth-ai-chat {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9000;
            background: #f7f7f7;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* AI聊天头部 */
        .stealth-ai-header {
            padding: 15px;
            background: white;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .stealth-ai-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .stealth-ai-subtitle {
            font-size: 14px;
            color: #666;
        }

        /* AI聊天消息区域 */
        .stealth-ai-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f7f7f7;
        }

        /* AI消息气泡 */
        .stealth-ai-message {
            max-width: 80%;
            margin-bottom: 15px;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.4;
            position: relative;
        }

        .stealth-ai-message.ai {
            background: white;
            align-self: flex-start;
            border-top-left-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            color: #333;
        }

        .stealth-ai-message.user {
            background: #00A1D6;
            color: white;
            align-self: flex-end;
            border-top-right-radius: 4px;
        }

        /* 弹幕面板样式 - 伪装成AI输入框 */
        #stealth-danmu-panel {
            position: fixed !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 9999 !important;
            background: white !important;
            padding: 12px !important;
            border-radius: 12px !important;
            width: 90% !important;
            max-width: 600px !important;
            border: 1px solid #e5e5e5 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* 表情面板样式 */
        #stealth-emoji-panel {
            position: fixed !important;
            bottom: 150px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 9998 !important;
            background: white !important;
            padding: 10px !important;
            border-radius: 12px !important;
            width: 90% !important;
            max-width: 600px !important;
            max-height: 250px !important;
            overflow-y: auto !important;
            border: 1px solid #e5e5e5 !important;
            display: none;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 5px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        #stealth-emoji-panel.show {
            display: flex !important;
        }

        /* 优化后的表情按钮样式 */
        .stealth-emoji-btn {
            padding: 8px 12px !important;
            background: #f7f7f7 !important;
            border: 1px solid #e5e5e5 !important;
            border-radius: 8px !important;
            color: #333 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.2s !important;
        }

        .stealth-emoji-btn:hover {
            background: #e5e5e5 !important;
        }

        /* 显示控制 */
        .panel-visible #stealth-danmu-panel,
        .stealth-mode #stealth-danmu-panel {
            opacity: 1 !important;
            visibility: visible !important;
        }

        /* 输入框样式 */
        #stealth-danmu-input {
            width: 95% !important;
            height: 40px !important;
            background: #f7f7f7 !important;
            border: 1px solid #e5e5e5 !important;
            border-radius: 8px !important;
            color: #333 !important;
            padding: 0 12px !important;
            font-size: 14px !important;
        }

        #stealth-danmu-input:focus {
            outline: none;
            border-color: #00A1D6;
        }

        /* 按钮样式 */
        #stealth-danmu-send,
        #stealth-emoji-btn,
        #stealth-meow-btn {
            height: 40px !important;
            background: #00A1D6 !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: background 0.2s;
        }

        #stealth-danmu-send:hover,
        #stealth-emoji-btn:hover,
        #stealth-meow-btn:hover {
            background: #0088B4 !important;
        }

        /* 按钮容器 */
        .stealth-btn-container {
            display: flex !important;
            gap: 8px !important;
        }

        .stealth-btn-container button {
            flex: 1 !important;
        }

        /* 喵按钮激活状态 */
        #stealth-meow-btn.active {
            background: #FB7299 !important;
        }

        /* 音量控制按钮 */
        #stealth-volume-control {
            position: absolute;
            top: -40px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            user-select: none;
            -webkit-user-select: none;
        }

        #stealth-refresh-control {
            position: absolute;
            top: -40px;
            right: 50px;
            width: 30px;
            height: 30px;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
        }

        #stealth-volume-control:hover,
        #stealth-refresh-control:hover {
            background: #f7f7f7;
        }

        #stealth-volume-control.muted svg {
            fill: #999;
        }

        #stealth-volume-control svg,
        #stealth-refresh-control svg {
            width: 20px;
            height: 20px;
            fill: #333;
        }

        /* 静音状态下的音量条样式 */
        #stealth-volume-slider-container.muted #stealth-volume-slider {
            opacity: 0.5;
        }

        /* 音量滑块容器 */
        #stealth-volume-slider-container {
            position: absolute;
            bottom: 150px;
            right: 0px;
            width: 36px;
            height: 100px;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            padding: 10px 5px;
            display: none;
            flex-direction: column;
            align-items: center;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            user-select: none;
            -webkit-user-select: none;
        }

        #stealth-volume-slider-container.show {
            display: flex;
        }

        /* 音量百分比显示 */
        #stealth-volume-percent {
            font-size: 12px;
            color: #fff;
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.6);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            min-width: 30px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            user-select: none;
            -webkit-user-select: none;
        }

        /* 音量滑块 */
        #stealth-volume-slider {
            -webkit-appearance: slider-vertical;
            width: 20px;
            height: 100%;
            cursor: pointer;
        }

        #stealth-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: slider-vertical;
        }
    `);

    // 创建控制按钮
    const btn = document.createElement('button');
    btn.id = 'stealth-mode-btn';
    btn.textContent = '隐';
    document.body.appendChild(btn);

    // 创建AI聊天界面容器
    const aiChatContainer = document.createElement('div');
    aiChatContainer.id = 'stealth-ai-chat';
    aiChatContainer.style.display = 'none';
    aiChatContainer.innerHTML = `
        <div class="stealth-ai-header">
            <div>
                <div class="stealth-ai-title">AI 助手</div>
                <div class="stealth-ai-subtitle">随时为您解答问题</div>
            </div>
        </div>
        <div class="stealth-ai-messages">
            <div class="stealth-ai-message ai">
                您好！我是AI助手，有什么可以帮您的吗？
            </div>
            <div class="stealth-ai-message user">
                帮我写一段JavaScript代码
            </div>
            <div class="stealth-ai-message ai">
                当然可以！您需要实现什么功能的JavaScript代码呢？比如DOM操作、AJAX请求、动画效果等。
            </div>
            <div class="stealth-ai-message ai">
                请描述您的需求，我会为您生成合适的代码示例。
            </div>
        </div>
    `;
    document.body.appendChild(aiChatContainer);

    // 创建弹幕面板
    const danmuPanel = document.createElement('div');
    danmuPanel.id = 'stealth-danmu-panel';
    danmuPanel.innerHTML = `
        <div id="stealth-volume-control">
            <svg class="volume-icon" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
            </svg>
            <svg class="mute-icon" style="display:none" viewBox="0 0 24 24">
                <path d="M16.5 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
            </svg>
        </div>
        <div id="stealth-refresh-control">
            <svg viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
            </svg>
        </div>
        <div id="stealth-volume-slider-container">
            <div id="stealth-volume-percent">10%</div>
            <input type="range" id="stealth-volume-slider" min="0" max="100" value="10" orient="vertical">
        </div>
        <input type="text" id="stealth-danmu-input" placeholder="输入您的问题...">
        <div class="stealth-btn-container">
            <button id="stealth-meow-btn">喵</button>
            <button id="stealth-emoji-btn">表情</button>
            <button id="stealth-danmu-send">发送</button>
        </div>
    `;
    document.body.appendChild(danmuPanel);

    // 创建表情面板
    const emojiPanel = document.createElement('div');
    emojiPanel.id = 'stealth-emoji-panel';
    document.body.appendChild(emojiPanel);

    let isStealthMode = false;
    let isPanelVisible = false;
    let autoMeowInterval = null;
    let meowCountdownInterval = null;
    const BASE_MEOW_INTERVAL = 15 * 60 * 1000; // 15分钟基础值
    const RANDOM_RANGE = 2 * 60 * 1000; // ±2分钟随机范围
    let remainingTime = 0;
    let nextMeowTime = 0;
    let lastMeowTime = 0; // 添加这行用于记录上次发送时间
    // 消息历史相关变量
    let messageHistory = []; // 存储消息历史
    let historyIndex = -1;   // 当前浏览的历史记录索引

    // B站常用表情文字代码
    const emojiList = [
        '[大笑]', '[大哭]', '[哈欠]', '[抓狂]', '[傲娇]',
        '[热]', '[冷]', '[委屈]', '[dog]', '[吓]'
    ];

    // 获取随机间隔时间 (13-17分钟)
    function getRandomInterval() {
        return BASE_MEOW_INTERVAL + (Math.random() * RANDOM_RANGE * 2 - RANDOM_RANGE);
    }

    // 渲染表情按钮
    function renderEmojis() {
        emojiPanel.innerHTML = '';

        emojiList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'stealth-emoji-btn';
            btn.textContent = emoji;
            btn.dataset.text = emoji;
            emojiPanel.appendChild(btn);
        });
    }

    // 查找原始弹幕元素
    function findOriginalDanmuElements() {
        return {
            input: document.querySelector('.bl-textarea, .chat-input-ctnr textarea, .chat-input-container textarea, [contenteditable="true"]'),
            sendBtn: document.querySelector('.bl-button--primary, .send-btn, .chat-send-btn')
        };
    }

    // 发送弹幕
    function sendDanmu() {
        const text = document.getElementById('stealth-danmu-input').value.trim();
        if (!text) return;

        // 将发送的消息添加到历史记录中
        if (messageHistory.length === 0 || messageHistory[messageHistory.length - 1] !== text) {
            messageHistory.push(text);
            // 限制历史记录数量，只保留最近的50条
            if (messageHistory.length > 50) {
                messageHistory.shift();
            }
        }
        // 重置历史记录索引
        historyIndex = messageHistory.length;

        const { input, sendBtn } = findOriginalDanmuElements();

        if (input) {
            // 设置原始输入框的值
            if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
                input.value = text;
            } else if (input.contentEditable === 'true') {
                input.textContent = text;
            }

            // 触发输入事件
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);

            // 尝试点击发送按钮
            if (sendBtn) {
                sendBtn.click();
            } else {
                // 模拟回车键
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                input.dispatchEvent(enterEvent);
            }

            // 清空输入框
            document.getElementById('stealth-danmu-input').value = '';

            // 如果是隐身模式，添加"用户消息"
            if (isStealthMode) {
                addAIMessage(text);
            }
        }
    }

    // 更新倒计时显示
    function updateCountdownDisplay() {
        const meowBtn = document.getElementById('stealth-meow-btn');
        if (!meowBtn) return;

        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        meowBtn.textContent = `喵(${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
    }

    // 自动发送"喵"弹幕
    function autoSendMeow() {
        const input = document.getElementById('stealth-danmu-input');
        input.value = '喵';
        sendDanmu();

        // 记录发送日志
        const now = Date.now();
        if (lastMeowTime > 0) {
            const interval = now - lastMeowTime;
            const intervalMinutes = Math.floor(interval / 60000);
            const intervalSeconds = Math.floor((interval % 60000) / 1000);
            console.log(`[自动发送喵] ${new Date(now).toLocaleString()} - 距离上次发送间隔: ${intervalMinutes}分${intervalSeconds}秒`);
        } else {
            console.log(`[自动发送喵] ${new Date(now).toLocaleString()} - 首次发送`);
        }
        lastMeowTime = now;
    }

    // 安排下一次发送
    function scheduleNextMeow() {
        const interval = getRandomInterval();
        nextMeowTime = Date.now() + interval;
        remainingTime = interval;

        // 清除现有定时器
        if (autoMeowInterval) {
            clearTimeout(autoMeowInterval);
        }

        // 设置新定时器
        autoMeowInterval = setTimeout(() => {
            autoSendMeow();
            // 自动安排下一次发送
            scheduleNextMeow();
        }, interval);
        updateCountdownDisplay();

        // 启动倒计时
        startCountdown();
    }

    // 开始倒计时
    function startCountdown() {
        if (meowCountdownInterval) {
            clearInterval(meowCountdownInterval);
        }

        meowCountdownInterval = setInterval(() => {
            remainingTime = nextMeowTime - Date.now();
            if (remainingTime <= 0) {
                remainingTime = 0;
                clearInterval(meowCountdownInterval);
                meowCountdownInterval = null;
            }
            updateCountdownDisplay();
        }, 1000);
    }

    // 停止倒计时
    function stopCountdown() {
        if (meowCountdownInterval) {
            clearInterval(meowCountdownInterval);
            meowCountdownInterval = null;
        }
        remainingTime = 0;
        updateCountdownDisplay();
    }

    // 切换自动发送喵功能
    function toggleAutoMeow() {
        const meowBtn = document.getElementById('stealth-meow-btn');

        if (autoMeowInterval) {
            // 如果已经有定时器，则关闭
            clearTimeout(autoMeowInterval);
            autoMeowInterval = null;
            stopCountdown();
            meowBtn.classList.remove('active');
            meowBtn.textContent = '喵';
            console.log('已关闭自动发送喵功能');
        } else {
            // 如果没有定时器，则开启
            meowBtn.classList.add('active');
            console.log('已开启自动发送喵功能，随机间隔13-17分钟');

            // 立即发送一次
            autoSendMeow();
            // 安排下一次发送
            scheduleNextMeow();
        }
    }

    // 添加AI消息
    function addAIMessage(text) {
        const messagesContainer = document.querySelector('.stealth-ai-messages');

        // 添加用户消息
        const userMsg = document.createElement('div');
        userMsg.className = 'stealth-ai-message user';
        userMsg.textContent = text;
        messagesContainer.appendChild(userMsg);

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 模拟AI回复
        setTimeout(() => {
            const aiResponses = [
                "我明白了，这个问题很有深度。",
                "让我思考一下如何回答这个问题...",
                "这是一个很好的问题！",
                "根据我的分析，这个问题可以这样理解...",
                "我正在处理您的请求，请稍等...",
                "感谢您的提问，我会尽力解答。",
                "这个问题涉及到多个方面，让我详细解释。",
                "我已经记录下您的问题，正在生成回答。"
            ];

            const aiMsg = document.createElement('div');
            aiMsg.className = 'stealth-ai-message ai';
            aiMsg.textContent = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            messagesContainer.appendChild(aiMsg);

            // 滚动到底部
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000 + Math.random() * 2000);
    }

    // 切换面板显示状态
    function togglePanel(show) {
        isPanelVisible = show;
        if (show) {
            document.documentElement.classList.add('panel-visible');
            setTimeout(() => {
                document.getElementById('stealth-danmu-input').focus();
            }, 100);
        } else {
            document.documentElement.classList.remove('panel-visible');
            emojiPanel.classList.remove('show');
        }
    }

    // 切换表情面板
    function toggleEmojiPanel() {
        emojiPanel.classList.toggle('show');
        if (emojiPanel.classList.contains('show') && emojiPanel.children.length === 0) {
            renderEmojis();
        }

        // 重新定位面板
        const danmuPanel = document.getElementById('stealth-danmu-panel');
        if (danmuPanel) {
            emojiPanel.style.bottom = `${danmuPanel.offsetHeight + danmuPanel.offsetTop + 10}px`;
        }
    }

    // 初始化按钮位置
    function initButtonPosition() {
        const savedPos = GM_getValue('btnPosition', { x: -25, y: 100 });
        btn.style.right = `${savedPos.x}px`;
        btn.style.bottom = `${savedPos.y}px`;
    }

    // 保存按钮位置
    function saveButtonPosition() {
        const x = parseInt(btn.style.right) || -25;
        const y = parseInt(btn.style.bottom) || 100;
        GM_setValue('btnPosition', { x, y });
    }

    // 处理按钮拖动
    function setupDrag() {
        let isDragging = false;
        let startX, startY, startRight, startBottom;

        btn.addEventListener('mousedown', startDrag);
        btn.addEventListener('touchstart', startDrag);

        function startDrag(e) {
            // 如果是点击事件，不处理拖动
            if (e.type === 'mousedown' && e.button !== 0) return;

            e.preventDefault();
            isDragging = true;
            btn.classList.add('dragging');

            // 获取初始位置
            const rect = btn.getBoundingClientRect();
            startRight = parseInt(btn.style.right) || -25;
            startBottom = parseInt(btn.style.bottom) || 100;

            // 获取初始鼠标/触摸位置
            if (e.type === 'mousedown') {
                startX = e.clientX;
                startY = e.clientY;
            } else {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }

            // 添加移动和结束事件监听器
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'mousemove') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }

            // 计算新位置
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            let newRight = startRight - deltaX;
            let newBottom = startBottom - deltaY;

            // 限制在窗口范围内
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const btnWidth = btn.offsetWidth;
            const btnHeight = btn.offsetHeight;

            newRight = Math.min(Math.max(newRight, -btnWidth / 2), windowWidth - btnWidth / 2);
            newBottom = Math.min(Math.max(newBottom, 0), windowHeight - btnHeight);

            // 应用新位置
            btn.style.right = `${newRight}px`;
            btn.style.bottom = `${newBottom}px`;
        }

        function endDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            isDragging = false;
            btn.classList.remove('dragging');

            // 移除事件监听器
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);

            // 检查是否需要吸附到边缘
            const rect = btn.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const btnWidth = btn.offsetWidth;

            // 如果靠近右侧边缘，则吸附到边缘
            if (rect.right >= windowWidth - btnWidth / 4) {
                btn.style.right = `-${btnWidth / 2}px`;
            }

            // 保存位置
            saveButtonPosition();
        }
    }

    // 点击控制按钮
    btn.addEventListener('click', function (e) {
        // 如果正在拖动，不处理点击
        if (btn.classList.contains('dragging')) {
            e.stopPropagation();
            return;
        }

        if (!isStealthMode) {
            // 正常模式下切换面板显示
            togglePanel(!isPanelVisible);
        } else {
            // 隐身模式下退出隐身
            isStealthMode = false;
            btn.classList.remove('stealth-active');
            btn.textContent = '隐';
            document.documentElement.classList.remove('stealth-mode');
            aiChatContainer.style.display = 'none';
            togglePanel(false);
        }
    });

    // 双击控制按钮进入隐身模式
    btn.addEventListener('dblclick', function (e) {
        // 如果正在拖动，不处理双击
        if (btn.classList.contains('dragging')) {
            e.stopPropagation();
            return;
        }

        isStealthMode = true;
        btn.classList.add('stealth-active');
        btn.textContent = '显';
        document.documentElement.classList.add('stealth-mode');
        aiChatContainer.style.display = 'flex';
        togglePanel(true);
    });

    // 喵按钮点击事件
    document.getElementById('stealth-meow-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        toggleAutoMeow();
    });

    // 表情按钮点击事件
    document.getElementById('stealth-emoji-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        toggleEmojiPanel();
    });

    // 表情按钮点击事件
    emojiPanel.addEventListener('click', function (e) {
        if (e.target.classList.contains('stealth-emoji-btn')) {
            const input = document.getElementById('stealth-danmu-input');
            input.value += e.target.dataset.text;
            input.focus();
        }
    });

    // 发送按钮点击事件
    document.getElementById('stealth-danmu-send').addEventListener('click', sendDanmu);

    // 输入框回车发送
    document.getElementById('stealth-danmu-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendDanmu();
        }
    });

    // 输入框上下键导航历史消息
    document.getElementById('stealth-danmu-input').addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            
            // 如果历史记录为空，直接返回
            if (messageHistory.length === 0) return;
            
            // 如果当前是第一次按下向上键，初始化索引
            if (historyIndex === messageHistory.length) {
                // 保存当前正在输入的内容（如果有）
                const currentInput = this.value;
                if (currentInput && (messageHistory.length === 0 || messageHistory[messageHistory.length - 1] !== currentInput)) {
                    // 临时保存当前输入，但不加入正式历史记录
                    this.setAttribute('data-temp-input', currentInput);
                }
            }
            
            // 更新索引
            if (historyIndex > 0) {
                historyIndex--;
                this.value = messageHistory[historyIndex];
            } else if (this.hasAttribute('data-temp-input')) {
                // 如果有临时保存的输入内容，显示它
                this.value = this.getAttribute('data-temp-input');
                this.removeAttribute('data-temp-input');
                historyIndex = messageHistory.length;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            
            // 如果历史记录为空，或者已经是最新的记录，清空输入框
            if (messageHistory.length === 0 || historyIndex >= messageHistory.length) {
                this.value = this.getAttribute('data-temp-input') || '';
                this.removeAttribute('data-temp-input');
                historyIndex = messageHistory.length;
                return;
            }
            
            // 更新索引
            historyIndex++;
            if (historyIndex < messageHistory.length) {
                this.value = messageHistory[historyIndex];
            } else {
                // 回到最新状态
                this.value = this.getAttribute('data-temp-input') || '';
                this.removeAttribute('data-temp-input');
            }
        } else if (e.key !== 'Enter') {
            // 如果按了其他键（除了回车），清除临时输入内容
            this.removeAttribute('data-temp-input');
            // 如果当前不是在浏览历史记录，更新索引为最新
            if (historyIndex !== messageHistory.length - 1) {
                historyIndex = messageHistory.length;
            }
        }
    });

    // 点击表情面板外部隐藏表情面板
    document.addEventListener('click', function (e) {
        if (emojiPanel.classList.contains('show') &&
            !emojiPanel.contains(e.target) &&
            e.target.id !== 'stealth-emoji-btn') {
            emojiPanel.classList.remove('show');
        }
    });

    // 音量控制功能
    function setupVolumeControl() {
        // 延迟执行确保DOM元素已创建
        setTimeout(() => {
            const volumeControl = document.getElementById('stealth-volume-control');
            const refreshControl = document.getElementById('stealth-refresh-control');
            const volumeSliderContainer = document.getElementById('stealth-volume-slider-container');
            const volumeSlider = document.getElementById('stealth-volume-slider');
            const volumePercent = document.getElementById('stealth-volume-percent');

            if (!volumeControl || !volumeSliderContainer || !volumeSlider || !volumePercent) {
                console.log('音量控制元素未找到');
                return;
            }

            // 设置初始音量为10%
            volumeSlider.value = 10;
            volumePercent.textContent = '10%';
            setInitialVolume(10);

            // 点击音量按钮切换静音状态
            volumeControl.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMute();
            });

            // 点击刷新按钮刷新直播
            refreshControl.addEventListener('click', function(e) {
                e.stopPropagation();
                refreshLiveStream();
            });

            // 鼠标悬停显示音量滑块
            volumeControl.addEventListener('mouseenter', function() {
                volumeSliderContainer.classList.add('show');
            });

            // 鼠标离开隐藏音量滑块
            volumeControl.addEventListener('mouseleave', function(e) {
                // 检查鼠标是否移动到了滑块上
                if (!volumeSliderContainer.contains(e.relatedTarget) && e.relatedTarget !== volumeSlider) {
                    volumeSliderContainer.classList.remove('show');
                }
            });

            // 鼠标离开滑块时隐藏
            volumeSliderContainer.addEventListener('mouseleave', function() {
                volumeSliderContainer.classList.remove('show');
            });

            // 滚轮调节音量
            volumeControl.addEventListener('wheel', function(e) {
                e.preventDefault();
                const currentVolume = parseInt(volumeSlider.value);
                const delta = e.deltaY > 0 ? -5 : 5;
                const newVolume = Math.max(0, Math.min(100, currentVolume + delta));
                volumeSlider.value = newVolume;
                volumePercent.textContent = newVolume + '%';
                onVolumeChange(newVolume);
            });

            // 滑块值改变事件
            volumeSlider.addEventListener('input', function() {
                const volume = parseInt(this.value);
                volumePercent.textContent = volume + '%';
                onVolumeChange(volume);
            });
        }, 0);
    }

    // 设置初始音量
    function setInitialVolume(volume) {
        // 延迟执行确保页面加载完成
        setTimeout(() => {
            onVolumeChange(volume);
        }, 1000);
    }

    // 音量改变处理函数
    function onVolumeChange(volume) {
        // 查找B站原生的视频元素
        const videoElements = document.querySelectorAll('video');
        let mainVideo = null;

        // 找到主视频（通常是第一个或有特定类名的视频元素）
        for (let video of videoElements) {
            // B站直播的主视频通常较大
            if (video.offsetWidth > 300 && video.offsetHeight > 200) {
                mainVideo = video;
                break;
            }
        }

        // 如果没找到符合尺寸的视频，就使用第一个视频元素
        if (!mainVideo && videoElements.length > 0) {
            mainVideo = videoElements[0];
        }

        // 设置音量
        if (mainVideo) {
            mainVideo.volume = volume / 100;
        }

        console.log(`音量已调整为: ${volume}%`);
    }

    // 静音切换功能
    function toggleMute() {
        const volumeControl = document.getElementById('stealth-volume-control');
        const volumeSlider = document.getElementById('stealth-volume-slider');
        const volumeIcon = volumeControl.querySelector('.volume-icon');
        const muteIcon = volumeControl.querySelector('.mute-icon');

        if (!volumeControl || !volumeSlider) return;

        // 切换静音状态
        volumeControl.classList.toggle('muted');

        if (volumeControl.classList.contains('muted')) {
            // 保存当前音量以便恢复
            volumeSlider.dataset.prevVolume = volumeSlider.value;
            // 设置音量为0
            volumeSlider.value = 0;
            onVolumeChange(0);
            // 切换图标显示
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            // 恢复之前的音量
            const prevVolume = volumeSlider.dataset.prevVolume || 10;
            volumeSlider.value = prevVolume;
            onVolumeChange(parseInt(prevVolume));
            // 切换图标显示
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    // 刷新直播流功能
    function refreshLiveStream() {
        console.log('尝试刷新直播流');

        // 方法1: 查找B站直播页面可能存在的刷新按钮并点击
        const possibleRefreshButtons = [
            '.live-player-reload',
            '.reload-btn',
            '.refresh-btn',
            '[class*="reload"]',
            '[class*="refresh"]',
            '.reload',
            '.refresh',
            '[title*="刷新"]',
            '[title*="reload"]',
            '[title*="refresh"]'
        ];

        for (const selector of possibleRefreshButtons) {
            const button = document.querySelector(selector);
            if (button) {
                try {
                    button.click();
                    console.log(`通过点击页面按钮(${selector})刷新直播流`);
                    return;
                } catch (e) {
                    console.log(`点击按钮(${selector})失败:`, e);
                }
            }
        }

        // 方法2: 尝试触发页面的重新加载机制
        try {
            // 查找播放器容器
            const playerContainer = document.querySelector('.live-player-mounter') ||
                                  document.querySelector('.bilibili-live-player') ||
                                  document.querySelector('.web-player') ||
                                  document.querySelector('.player-model-body');

            if (playerContainer) {
                // 查找容器内的视频元素
                const video = playerContainer.querySelector('video');
                if (video) {
                    // 尝试重新加载视频
                    const src = video.src;
                    video.src = '';
                    setTimeout(() => {
                        video.src = src;
                        video.play().catch(e => console.log('播放失败:', e));
                    }, 100);
                    console.log('通过重置video元素src属性刷新直播流');
                    return;
                }
            }
        } catch (e) {
            console.log('重置video元素失败:', e);
        }

        // 方法3: 尝试使用B站播放器API
        try {
            // B站播放器对象可能存在于不同的全局变量中
            const playerObjects = [
                window.player,
                window.livePlayer,
                window.bilibiliPlayer,
                document.querySelector('video')?.parentNode?.__vue__,
                document.querySelector('.bilibili-live-player')?.__vue__
            ];

            for (const player of playerObjects) {
                if (player) {
                    // 尝试调用播放器的重载方法
                    if (typeof player.reload === 'function') {
                        player.reload();
                        console.log('通过调用player.reload()刷新直播流');
                        return;
                    }

                    if (typeof player.refresh === 'function') {
                        player.refresh();
                        console.log('通过调用player.refresh()刷新直播流');
                        return;
                    }

                    // 尝试重新设置播放源
                    if (player.hasOwnProperty('src')) {
                        const src = player.src;
                        player.src = '';
                        setTimeout(() => {
                            player.src = src;
                        }, 100);
                        console.log('通过重置player.src刷新直播流');
                        return;
                    }
                }
            }
        } catch (e) {
            console.log('调用播放器API失败:', e);
        }

        // 方法4: 查找页面上的视频元素并尝试刷新
        try {
            const videoElements = document.querySelectorAll('video');
            for (let video of videoElements) {
                // 检查是否是直播视频（通常较大）
                if (video.offsetWidth > 300 && video.offsetHeight > 200) {
                    // 尝试重新加载
                    video.load();
                    video.play().catch(e => console.log('播放失败:', e));
                    console.log('通过重新加载video元素刷新直播流');
                    return;
                }
            }
        } catch (e) {
            console.log('重新加载视频元素失败:', e);
        }

        // 方法5: 模拟F5刷新（仅刷新视频部分）
        try {
            // 查找播放器相关的Vue组件并尝试触发更新
            const playerElement = document.querySelector('.live-player-mounter') ||
                                 document.querySelector('.bilibili-live-player') ||
                                 document.querySelector('.web-player');

            if (playerElement && playerElement.__vue__) {
                // 如果是Vue组件，尝试强制更新
                if (typeof playerElement.__vue__.$forceUpdate === 'function') {
                    playerElement.__vue__.$forceUpdate();
                    console.log('通过Vue组件强制更新刷新直播流');
                    return;
                }
            }
        } catch (e) {
            console.log('Vue组件更新失败:', e);
        }

        console.log('所有刷新方法都失败了，请提供更多页面信息');
    }

    // 确保元素在最上层
    setInterval(() => {
        btn.style.zIndex = '10000';
        danmuPanel.style.zIndex = '9999';
        emojiPanel.style.zIndex = '9998';
        aiChatContainer.style.zIndex = '9000';
    }, 1000);

    // 初始化按钮位置
    initButtonPosition();

    // 设置拖动功能
    setupDrag();

    // 设置音量控制
    setupVolumeControl();

    // 初始渲染表情
    renderEmojis();
})();