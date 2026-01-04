// ==UserScript==
// @name         hh自动抽奖助手
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNWMyOThjIiBkPSJNMTIuNSAyYy0zLjU3IDAtNC4zNiAzLjk2LTIuMzcgNy42NWMtLjQxLjMyLS43My43NC0uOTIgMS4yMmMtLjkzLS4xOS0xLjk4LS42Mi0yLjQ4LTEuNjFDNS41NiA2Ljg5IDIgNyAyIDExLjVjMCAzLjU3IDMuOTUgNC4zNSA3LjY0IDIuMzdjLjMyLjQuNzUuNzIgMS4yNC45MmMtLjIuOTItLjY0IDEuOTYtMS42MiAyLjQ1QzYuOSAxOC40MiA3IDIyIDExLjUgMjJjLjgxIDAgMS41LS4yMiAyLS41OWMtLjMxLS43NC0uNS0xLjU1LS41LTIuNDFjMC0xLjQxLjUtMi43IDEuMy0zLjcyYy0uMTMtLjMxLS4yNy0uNjMtLjQ0LS45NGMuNC0uMzQuNzEtLjc1LjkxLTEuMjNjLjQ5LjEgMS4wMS4yOCAxLjQ4LjU2YTYgNiAwIDAgMSA1LjY0LjA3Yy4wNi0uMzcuMTEtLjc4LjExLTEuMjRjMC0zLjU4LTMuOTctNC4zNy03LjY3LTIuMzdjLS4zMy0uNC0uNzQtLjcxLTEuMjItLjkxYy4xOS0uOTMuNjMtMS45OCAxLjYyLTIuNDdDMTcuMDkgNS41NyAxNyAyIDEyLjUgMm0tLjUgOWMuNTQgMCAxIC40NSAxIDFzLS40NiAxLTEgMWMtLjU3IDAtMS0uNDUtMS0xcy40My0xIDEtMW02IDRhMiAyIDAgMCAwLTIgMnY2aDJ2LTJoMnYyaDJ2LTZjMC0xLjEtLjktMi0yLTJtLTIgMmgydjJoLTJaIi8+PC9zdmc+
// @namespace    https://greasyfork.org/
// @version      2.1
// @description  自动进行抽奖操作，支持开始/停止控制，抽中vip自动暂停
// @author       leo_lin
// @license MIT
// @match        https://hhanclub.top/lucky.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hhanclub.top
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550585/hh%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550585/hh%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        #autoLotteryPanel {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
            padding: 30px;
            width: 380px;
            color: white;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(15px);
            transform: translateZ(0);
            overflow: hidden;
        }

        .panel-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 25px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
        }

        .panel-header h2 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6);
            letter-spacing: 0.8px;
            background: linear-gradient(to right, #ff7e5f, #feb47b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .panel-header h2:before {
            content: "🎮";
            margin-right: 18px;
            font-size: 36px;
        }

        .control-buttons {
            display: flex;
            gap: 25px;
            margin-bottom: 30px;
        }

        .control-btn {
            flex: 1;
            padding: 18px 0;
            border: none;
            border-radius: 15px;
            font-weight: 700;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            letter-spacing: 0.8px;
            position: relative;
            overflow: hidden;
        }

        .control-btn:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(-100%);
            transition: all 0.5s ease;
        }

        .control-btn:hover:before {
            transform: translateX(0);
        }

        .control-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
        }

        .control-btn:active {
            transform: translateY(2px);
        }

        #startBtn {
            background: linear-gradient(to right, #11998e, #38ef7d);
            color: white;
        }

        #stopBtn {
            background: linear-gradient(to right, #ff416c, #ff4b2b);
            color: white;
        }

        .status-display {
            background: rgba(0, 0, 0, 0.35);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .status-title {
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 18px;
            color: #aaccff;
        }

        .status-title:before {
            content: "📊";
            margin-right: 12px;
            font-size: 24px;
        }

        .stats-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .stat-item {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 18px;
            text-align: center;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
        }

        .stat-item:hover {
            transform: translateY(-5px);
        }

        .stat-label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 12px;
        }

        .stat-value {
            font-size: 28px;
            font-weight: 800;
            margin-top: 8px;
            color: #fff;
            text-shadow: 0 0 15px rgba(255,255,255,0.7);
        }

        .log-container {
            background: rgba(0, 0, 0, 0.35);
            border-radius: 15px;
            padding: 25px;
            height: 200px;
            overflow-y: auto;
        }

        .log-title {
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #aaccff;
        }

        .log-title:before {
            content: "📝";
            margin-right: 12px;
            font-size: 24px;
        }

        .log-content {
            font-size: 16px;
            line-height: 1.7;
        }

        .log-entry {
            margin-bottom: 10px;
            padding-left: 30px;
            position: relative;
            border-left: 2px solid rgba(126, 192, 255, 0.5);
            padding-left: 15px;
            transition: all 0.3s ease;
        }

        .log-entry:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
        }

        .log-entry {
            padding-left: 30px;
        }

        .log-entry:before {
            content: "›";
            position: absolute;
            left: 15px;
            top: 45%;
            transform: translateY(-50%);
            font-weight: bold;
            font-size: 24px;
            color: inherit; /* 关键修复 - 继承父元素颜色 */
        }

        .success {
            color: #7eff7e;
            border-left-color: rgba(126, 255, 126, 0.5);
        }

        .infoo {
            color: #7ec0ff;
        }

        .warning {
            color: #fffd8c;
            border-left-color: rgba(255, 253, 140, 0.5);
        }

        .error {
            color: #ff7e7e;
            border-left-color: rgba(255, 126, 126, 0.5);
        }

        .binggo {
            color: #b700ff;
            font-weight: bold;
            border-left-color: rgba(183, 0, 255, 0.5);
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(17, 153, 142, 0.7);
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(17, 153, 142, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(17, 153, 142, 0);
            }
        }

        .floating {
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
            border-radius: 50%;
            top: -50px;
            right: -50px;
        }

        .status-indicator {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
            box-shadow: 0 0 15px currentColor;
        }

        .running {
            background-color: #38ef7d;
            animation: glow-green 1.5s infinite alternate;
        }

        .stopped {
            background-color: #ff416c;
        }

        @keyframes glow-green {
            from {
                box-shadow: 0 0 5px #38ef7d, 0 0 10px #38ef7d;
            }
            to {
                box-shadow: 0 0 15px #38ef7d, 0 0 30px #38ef7d;
            }
        }

        .progress-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            border: 2px solid transparent;
            border-top-color: #38ef7d;
            animation: rotate 2s linear infinite;
            pointer-events: none;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .result-checking .progress-ring {
            display: block;
        }

        .result-checking {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'autoLotteryPanel';
    panel.innerHTML = `
        <div class="panel-header">
            <div class="floating"></div>
            <h2>智能抽奖助手</h2>
        </div>

        <div class="control-buttons">
            <button id="startBtn" class="control-btn pulse">开始抽奖</button>
            <button id="stopBtn" class="control-btn">停止抽奖</button>
        </div>

        <div class="status-display">
            <div class="status-title">抽奖统计</div>
            <div class="stats-container">
                <div class="stat-item">
                    <div class="stat-label">抽奖次数</div>
                    <div id="drawCount" class="stat-value">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">成功次数</div>
                    <div id="successCount" class="stat-value">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">运行状态</div>
                    <div id="statusText" class="stat-value">
                        <span class="status-indicator stopped"></span>
                        <span>已停止</span>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">下次抽奖</div>
                    <div id="nextDraw" class="stat-value">--:--</div>
                </div>
            </div>
        </div>

        <div class="log-container" id="logContainer">
            <div class="log-title">操作日志</div>
            <div id="logContent" class="log-content"></div>
        </div>
    `;

    document.body.appendChild(panel);

    // 获取DOM元素
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const drawCountEl = document.getElementById('drawCount');
    const successCountEl = document.getElementById('successCount');
    const statusTextEl = document.getElementById('statusText');
    const nextDrawEl = document.getElementById('nextDraw');
    const logContentEl = document.getElementById('logContent');
    const logContainer = document.getElementById('logContainer');
    const statusIndicator = statusTextEl.querySelector('.status-indicator');

    // 状态变量
    let isRunning = false;
    let drawCount = 0;
    let successCount = 0;
    let timer = null;
    let nextDrawTime = null;
    let isWaitingForResult = false;

    //奖品统计
    let moli=0;
    let shangchuan=0;
    let vip=0;
    let caihong=0;
    let yaoqing=0;
    let buqian=0;
    let lostmoli=0;

    // 添加日志
    function addLog(message, type = 'infoo') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContentEl.appendChild(logEntry);

        // 自动滚动到底部
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // 点击抽奖按钮
    function clickCanvas() {
        const canvas = document.getElementById('lotteryButton');
        if (!canvas) {
            addLog('错误：未找到抽奖按钮', 'error');
            stopAutoDraw();
            return false;
        }

        try {
            // 使用最可靠的方法
            canvas.click();
            //addLog('已点击抽奖按钮');
            return true;
        } catch (e) {
            addLog(`点击抽奖按钮出错: ${e.message}`, 'error');
            return false;
        }
    }

    // 检测结果弹窗并点击确认按钮
    function checkAndConfirmResult() {
        if (!isRunning) return false;

        isWaitingForResult = true;
        panel.classList.add('result-checking');

        // 支持多种常见的选择器
        const selectors = [
            '#confirm'
        ];

        const startTime = Date.now();
        const timeout = 25000; // 25秒超时

        // 轮询检测结果弹窗
        const checkInterval = setInterval(() => {
            if (!isRunning) {
                clearInterval(checkInterval);
                panel.classList.remove('result-checking');
                isWaitingForResult = false;
                return;
            }

            // 检查是否超时
            if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                panel.classList.remove('result-checking');
                isWaitingForResult = false;
                addLog('等待结果超时，继续下一次抽奖', 'warning');
                scheduleNextDraw();
                return;
            }

            // 尝试所有选择器
            for (const selector of selectors) {
                try {
                    const buttons = document.querySelectorAll(selector);
                    if (buttons.length > 0) {
                        // 只点击可见的按钮
                        for (const btn of buttons) {
                            if (btn.offsetParent !== null) {
                                setTimeout(() => {
                                    btn.click();
                                }, 1800);
                                let identifier=Array.from(btn.parentNode.parentNode.children).map(node => node.textContent.trim()).join('_').replace(/(\r\n|\n|\s|恭喜本次抽奖获得:|_确认)/gm, "").substring(0, 20);
                                //addLog(`已点击结果确认 (${identifier})`, 'success');
                                let stopstr="vip";
                                if (identifier.toLowerCase().indexOf(stopstr)>-1) {
                                    addLog(`抽中：${identifier}，自动停止`, 'binggo');
                                    stopAutoDraw();
                                }
                                else{
                                    addLog(identifier, 'success');
                                }
                                totleBinggo(identifier);
                                successCount++;
                                successCountEl.textContent = successCount;

                                clearInterval(checkInterval);
                                panel.classList.remove('result-checking');
                                isWaitingForResult = false;

                                // 结果确认后安排下一次抽奖
                                scheduleNextDraw();
                                return;
                            }
                        }
                    }
                } catch (e) {
                    // 忽略选择器错误
                }
            }

            //addLog('正在等待抽奖结果...', 'infoo');
        }, 500); // 每500ms检查一次
    }

    // 统计结果抽奖
    function totleBinggo(identifier) {
        let str=identifier;
        lostmoli=lostmoli+2000;

        if (str.toLowerCase().indexOf("vip")>-1) {
            vip=vip+1;
        }
        else if (str.toLowerCase().indexOf("邀请")>-1) {
            yaoqing=yaoqing+1;
        }
        else if (str.toLowerCase().indexOf("补签")>-1) {
            buqian=buqian+1;
        }
        else if (str.toLowerCase().indexOf("彩虹")>-1) {
            caihong=caihong+1;
        }
        else if (str.toLowerCase().indexOf("魔力")>-1) {
            moli=moli+parseInt(str.replace(/(魔力)/gm, ""));
        }
        else if (str.toLowerCase().indexOf("上传量")>-1) {
            shangchuan=shangchuan+parseInt(str.replace(/(上传量|GB)/gm, ""));
        }
        addLog(`统计：邀请*${yaoqing}，补签*${buqian}，彩虹*${caihong}，VIP*${vip}，魔力${moli/1000}K，上传量${shangchuan}GB，总共花费魔力${lostmoli/1000}K，亏损${(lostmoli-moli)/1000}K`, 'binggo');
    }

    // 安排下一次抽奖
    function scheduleNextDraw() {
        if (!isRunning) return;

        // 设置下一次抽奖时间（2秒后）
        const nextTime = new Date(Date.now() + 2000);
        nextDrawTime = nextTime;
        nextDrawEl.textContent = nextTime.toLocaleTimeString();

        // 2秒后执行下一次抽奖
        timer = setTimeout(() => {
            if (isRunning) {
                performLottery();
            }
        }, 2000);
    }

    // 执行一次抽奖循环
    function performLottery() {
        if (!isRunning) return;

        drawCount++;
        drawCountEl.textContent = drawCount;
        addLog(`开始第 ${drawCount} 次抽奖`);

        // 点击抽奖按钮
        if (clickCanvas()) {
            // 启动结果检测
            setTimeout(() => {
                checkAndConfirmResult();
            }, 500);
        } else {
            stopAutoDraw();
        }
    }

    // 开始自动抽奖
    function startAutoDraw() {
        if (isRunning) return;

        isRunning = true;
        statusTextEl.innerHTML = `
            <span class="status-indicator running"></span>
            <span>运行中</span>
        `;
        startBtn.disabled = true;
        stopBtn.disabled = false;

        // 添加动画效果
        startBtn.classList.remove('pulse');

        addLog('自动抽奖已启动');

        // 立即开始第一次抽奖
        performLottery();
    }

    // 停止自动抽奖
    function stopAutoDraw() {
        if (!isRunning) return;

        isRunning = false;
        clearTimeout(timer);
        statusTextEl.innerHTML = `
            <span class="status-indicator stopped"></span>
            <span>已停止</span>
        `;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        nextDrawEl.textContent = '--:--';
        panel.classList.remove('result-checking');
        isWaitingForResult = false;

        // 添加动画效果
        startBtn.classList.add('pulse');

        addLog('自动抽奖已停止');
    }

    // 事件监听
    startBtn.addEventListener('click', startAutoDraw);
    stopBtn.addEventListener('click', stopAutoDraw);

    // 初始状态设置
    stopBtn.disabled = true;
    addLog('自动抽奖助手已加载');

    // 每10秒检查一次抽奖按钮是否存在
    setInterval(() => {
        const canvas = document.getElementById('lotteryButton');
        if (!canvas && isRunning) {
            addLog('警告：抽奖按钮丢失，自动停止', 'warning');
            stopAutoDraw();
        }
    }, 10000);

    // 添加进度环
    const progressRing = document.createElement('div');
    progressRing.className = 'progress-ring';
    panel.querySelector('.status-display').appendChild(progressRing);
    progressRing.style.display = 'none';
})();