// ==UserScript==
// @name         学习进度速通器（自考）
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  一键完成学习进度，修复服务器记录问题
// @author       WebDeveloperPro
// @match        *://*/*xcware*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/549590/%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E9%80%9F%E9%80%9A%E5%99%A8%EF%BC%88%E8%87%AA%E8%80%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549590/%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E9%80%9F%E9%80%9A%E5%99%A8%EF%BC%88%E8%87%AA%E8%80%83%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        #speedStudyPanel {
            position: fixed !important;
            top: 50% !important;
            left: 20px !important;
            transform: translateY(-50%) !important;
            z-index: 999999 !important;
            background: rgba(255,255,255,0.95) !important;
            border: 1px solid #3498db !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25) !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
            max-width: 900px !important;
            min-width: 600px !important;
            padding: 20px !important;
            user-select: none !important;
        }

        #panelHeader {
            cursor: move;
            padding: 10px;
            margin: -20px -20px 15px -20px;
            background: #3498db;
            color: white;
            border-radius: 8px 8px 0 0;
            text-align: center;
            font-weight: bold;
            position: relative;
        }

        .sim-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.2s;
        }
        .sim-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .sim-btn:active {
            transform: translateY(0);
        }
        #speedStudyBtn {
            background: linear-gradient(135deg, #3498db, #9b59b6);
            color: white;
            border: none;
            border-radius: 30px;
            padding: 12px 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            font-size: 1.1em;
            letter-spacing:1px;
            box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);
        }
        #speedStudyBtn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 10px rgba(52, 152, 219, 0.5);
        }
        .log-entry {
            padding: 8px 10px;
            margin-bottom: 6px;
            border-radius: 4px;
            background: rgba(0,0,0,0.03);
            position:relative;
            padding-left:30px;
            cursor: pointer;
        }
        .log-entry:hover {
            background-color: #f0f8ff;
        }
        .log-entry:before {
            content: "•";
            position:absolute;
            left:15px;
            top:8px;
            font-size:20px;
        }
        .log-success {
            color: #27ae60;
        }
        .log-warning {
            color: #f39c12;
        }
        .log-error {
            color: #e74c3c;
        }
        .config-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }
        .config-label {
            min-width: 120px;
            font-weight: bold;
        }
        .config-value {
            flex-grow: 1;
        }
        #copyLogBtn {
            position: absolute;
            right: 40px;
            top: 12px;
            cursor: pointer;
            color: white;
        }
        .context-menu {
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 4px;
            z-index: 10000;
            display: none;
        }
        .context-menu-item {
            padding: 8px 12px;
            cursor: pointer;
            white-space: nowrap;
        }
        .context-menu-item:hover {
            background: #f0f8ff;
        }
        .timer-display {
            position: absolute;
            right: 10px;
            top: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
        }
    `);

    // 创建控制面板
    const panelHTML = `
    <div id="speedStudyPanel">
        <div id="panelHeader">
            <i class="fa fa-tachometer-alt"></i> 学习进度速通器 v5.1
            <span id="closePanel" style="float:right;cursor:pointer;margin-top:-3px;padding:0 10px">✖✖</span>
            <i id="copyLogBtn" class="fas fa-copy" title="复制日志"></i>
            <div id="runtimeTimer" class="timer-display">00:00</div>
        </div>

        <div style="display:flex;gap:20px">
            <div style="flex:1">
                <h3 style="margin-top:0"><i class="fa fa-cogs"></i> 学习参数配置</h3>

                <div class="config-row">
                    <span class="config-label">用户ID:</span>
                    <input type="text" id="configUserID" class="config-value" placeholder="自动检测">
                </div>

                <div class="config-row">
                    <span class="config-label">课程ID:</span>
                    <input type="text" id="configCwareID" class="config-value" placeholder="自动检测">
                </div>

                <div class="config-row">
                    <span class="config-label">视频ID:</span>
                    <input type="text" id="configVideoID" class="config-value" placeholder="自动检测">
                </div>

                <div class="config-row">
                    <span class="config-label">认证密钥:</span>
                    <input type="text" id="configAuthKey" class="config-value" placeholder="尝试自动发现">
                </div>

                <div class="config-row">
                    <span class="config-label">安全参数:</span>
                    <input type="text" id="configSecureParam" class="config-value" placeholder="如sign、token等">
                </div>

                <button id="loadDefaultConfig" class="sim-btn" style="background:#2c3e50">读取默认配置</button>
                <button id="findSecurityParams" class="sim-btn" style="background:#8e44ad">扫描安全参数</button>
            </div>

            <div style="flex:1">
                <h3><i class="fa fa-sliders-h"></i> 高级设置</h3>

                <div class="config-row">
                    <span class="config-label">请求方法:</span>
                    <select id="requestMethod" class="config-value">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                    </select>
                </div>

                <div class="config-row">
                    <span class="config-label">请求间隔(ms):</span>
                    <input type="range" id="delayRange" min="200" max="5000" value="200" style="width:100%">
                    <span id="delayValue" style="min-width:80px">200ms</span>
                </div>

                <div class="config-row">
                    <input type="checkbox" id="randomDelay" checked>
                    <label for="randomDelay">随机延迟发送请求</label>
                </div>

                <div class="config-row">
                    <input type="checkbox" id="fakeDevice" checked>
                    <label for="fakeDevice">模拟真实设备特征</label>
                </div>

                <div class="config-row">
                    <input type="checkbox" id="useSessionToken" checked>
                    <label for="useSessionToken">使用会话令牌</label>
                </div>

                <div class="config-row">
                    <input type="checkbox" id="useRealEvents" checked>
                    <label for="useRealEvents">使用真实事件序列</label>
                </div>

                <div style="text-align:center;margin-top:15px">
                    <button id="speedStudyBtn">
                        <i class="fa fa-bolt"></i> 一键完成学习
                    </button>
                </div>
            </div>
        </div>

        <div id="resultPanel" style="margin-top:20px">
            <h4><i class="fa fa-history"></i> 执行报告 <small>(点击日志条目可复制)</small></h4>
            <div id="progressLog" style="max-height:150px;overflow-y:auto;font-size:0.85em"></div>
        </div>
    </div>

    <div class="context-menu" id="logContextMenu">
        <div class="context-menu-item" id="copyLogItem">复制日志内容</div>
    </div>
    `;

    // 添加控制面板到页面
    document.body.insertAdjacentHTML('afterbegin', panelHTML);

    // 全局变量
    let isRunning = false;
    let startTime = null;
    let runtimeInterval = null;
    let runTimer = null;

    // 更新运行时间显示
    function updateRuntimeDisplay() {
        if (!startTime) return;

        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');

        document.getElementById('runtimeTimer').textContent = `${minutes}:${seconds}`;
    }

    // 启动运行计时器
    function startRuntimeTimer() {
        if (runtimeInterval) clearInterval(runtimeInterval);

        startTime = new Date();
        document.getElementById('runtimeTimer').style.display = 'block';
        runtimeInterval = setInterval(updateRuntimeDisplay, 1000);
    }

    // 停止运行计时器
    function stopRuntimeTimer() {
        if (runtimeInterval) {
            clearInterval(runtimeInterval);
            runtimeInterval = null;
        }
        document.getElementById('runtimeTimer').style.display = 'none';
        startTime = null;
    }

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;
    const panel = document.getElementById('speedStudyPanel');
    const header = document.getElementById('panelHeader');

    header.addEventListener('mousedown', function(e) {
        if (e.target.id === 'closePanel' || e.target.id === 'copyLogBtn') return;

        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.opacity = '0.8';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
        panel.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        panel.style.opacity = '1';
    });

    // 关闭面板
    document.getElementById('closePanel').addEventListener('click', function() {
        panel.style.display = 'none';
    });

    // 日志复制功能
    document.getElementById('copyLogBtn').addEventListener('click', function() {
        const logContent = document.getElementById('progressLog').innerText;
        GM_setClipboard(logContent, 'text');
        showNotification('日志已复制到剪贴板！', 'success');
    });

    // 单个日志条目复制
    document.getElementById('progressLog').addEventListener('click', function(e) {
        if (e.target.classList.contains('log-entry')) {
            GM_setClipboard(e.target.textContent, 'text');
            e.target.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 1000);
        }
    });

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 10px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease-in-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 3000);
    }

    // 生成设备指纹
    function generateDeviceFingerprint() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            deviceMemory: navigator.deviceMemory || 4,
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            screen: `${screen.width}x${screen.height}`
        };
    }

    // 寻找页面安全参数
    function findSecurityParams() {
        const log = (msg) => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `${new Date().toLocaleTimeString()}: ${msg}`;
            document.getElementById('progressLog').appendChild(entry);
        };

        log('开始扫描安全参数...');

        try {
            let found = false;
            const securityKeys = [
                'token', 'auth_token', 'authKey', 'signature', 'sign',
                'securityToken', 'access_token', 'app_secret', 'encryptKey'
            ];

            for (const key of securityKeys) {
                if (unsafeWindow[key]) {
                    document.getElementById('configSecureParam').value = key;
                    document.getElementById('configAuthKey').value = typeof unsafeWindow[key] === 'string' ?
                        unsafeWindow[key] : JSON.stringify(unsafeWindow[key]);
                    log(`✅ 发现全局安全参数: ${key}`);
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (const key of securityKeys) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        document.getElementById('configSecureParam').value = key;
                        document.getElementById('configAuthKey').value = value;
                        log(`✅ 发现localStorage安全参数: ${key}`);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                for (const key of securityKeys) {
                    const element = document.querySelector(`input[name="${key}"], [data-token], [data-sign]`);
                    if (element) {
                        const value = element.value || element.getAttribute('value') ||
                                     element.getAttribute('data-token') || element.getAttribute('data-sign');
                        document.getElementById('configSecureParam').value = key;
                        document.getElementById('configAuthKey').value = value;
                        log(`✅ 发现DOM安全参数: ${element.tagName}`);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                log('⚠️ 未能自动发现安全参数，请手动输入');
                GM_notification({
                    title: '安全参数扫描',
                    text: '未能自动发现安全参数，请检查网络请求并手动输入',
                    timeout: 5000
                });
            } else {
                GM_notification({
                    title: '安全参数扫描',
                    text: '已发现安全参数并填充到表单',
                    timeout: 3000
                });
            }

        } catch (e) {
            log(`❌❌ 扫描错误: ${e.message}`);
        }
    }

    // 获取学习配置
    function getLearningConfig() {
        const config = {};

        config.userID = document.getElementById('configUserID').value ||
            unsafeWindow.pageData?.userID ||
            document.querySelector('[userid]')?.getAttribute('userid') ||
            '95669309';

        config.cwareID = document.getElementById('configCwareID').value ||
            unsafeWindow.pageData?.cwareID ||
            document.querySelector('[cwareid]')?.getAttribute('cwareid') ||
            location.pathname.match(/\/(\d+)\//)?.[1] ||
            '505765';

        config.videoID = document.getElementById('configVideoID').value ||
            unsafeWindow.pageData?.videoID ||
            '1';

        config.authKey = document.getElementById('configAuthKey').value;
        config.secureParam = document.getElementById('configSecureParam').value;

        const video = document.querySelector('video');
        config.totalDuration = video ? Math.floor(video.duration) : 695;

        config.barInfo = [];
        try {
            if (unsafeWindow.barInfo && unsafeWindow.barInfo.length) {
                config.barInfo = unsafeWindow.barInfo;
            } else {
                const chapterItems = document.querySelectorAll('.chapter-item, .section-item');
                if (chapterItems.length > 0) {
                    chapterItems.forEach((item, index) => {
                        const time = item.querySelector('.item-time')?.textContent || `00:${index.toString().padStart(2, '0')}:00`;
                        const name = item.querySelector('.item-name')?.textContent || `章节 ${index + 1}`;
                        config.barInfo.push({name, time});
                    });
                } else {
                    for (let i = 1; i <= 8; i++) {
                        config.barInfo.push({
                            name: `章节 ${i}`,
                            time: `00:${i.toString().padStart(2, '0')}:00`
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('获取章节信息失败', e);
        }

        return config;
    }

    // 生成安全签名
    function generateSecureSignature(params, secret) {
        if (unsafeWindow.generateSignature) {
            return unsafeWindow.generateSignature(params);
        }

        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
        return CryptoJS.HmacSHA256(sortedParams, secret).toString(CryptoJS.enc.Hex);
    }

    // 伪造学习行为
    function generateFakeBehavior() {
        const behaviors = [];
        const now = new Date();
        const baseTimestamp = now.getTime();

        behaviors.push({type: 'pageview', timestamp: baseTimestamp - 5000});
        behaviors.push({type: 'video_play', timestamp: baseTimestamp - 4000});

        for (let i = 0; i < 8; i++) {
            behaviors.push({
                type: 'video_heartbeat',
                timestamp: baseTimestamp - 3800 + i * 500,
                progress: (i + 1) * 12,
                section: i + 1
            });
        }

        behaviors.push({type: 'video_completed', timestamp: baseTimestamp - 500});
        behaviors.push({type: 'course_completed', progress: 100, timestamp: baseTimestamp - 300});

        return behaviors;
    }

    // 获取会话令牌
    function getSessionToken() {
        try {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                if (cookie.includes('SESSIONID') || cookie.includes('JSESSIONID')) {
                    return cookie.split('=')[1].trim();
                }
            }

            if (localStorage.getItem('sessionToken')) {
                return localStorage.getItem('sessionToken');
            }

            if (unsafeWindow.sessionToken) {
                return unsafeWindow.sessionToken;
            }

            return null;
        } catch (e) {
            console.error('获取会话令牌失败', e);
            return null;
        }
    }

    // 获取真实事件序列
    function getRealEventSequence() {
        try {
            if (unsafeWindow.videoEvents && Array.isArray(unsafeWindow.videoEvents)) {
                return unsafeWindow.videoEvents;
            }

            const eventDataElements = document.querySelectorAll('[data-event]');
            if (eventDataElements.length > 0) {
                const events = [];
                eventDataElements.forEach(el => {
                    try {
                        events.push(JSON.parse(el.dataset.event));
                    } catch (e) {
                        console.warn('解析事件数据失败', el.dataset.event, e);
                    }
                });
                return events;
            }

            return null;
        } catch (e) {
            console.error('获取真实事件序列失败', e);
            return null;
        }
    }

    // 更新页面进度显示
    async function updatePageProgress(progress) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    if (unsafeWindow.refreshUserProgress) {
                        unsafeWindow.refreshUserProgress();
                    }

                    const videoElement = document.querySelector('video');
                    if (videoElement) {
                        videoElement.dispatchEvent(new Event('ended'));
                        videoElement.dispatchEvent(new Event('timeupdate'));
                    }

                    const progressBars = document.querySelectorAll('.progress-bar, .progress');
                    if (progressBars.length > 0) {
                        progressBars.forEach(bar => {
                            bar.style.width = `${progress}%`;
                            if (bar.querySelector('.progress-text')) {
                                bar.querySelector('.progress-text').textContent = `${progress}%`;
                            }
                        });
                    }

                    resolve();
                } catch (e) {
                    console.error('更新页面进度失败', e);
                    resolve();
                }
            }, 1000);
        });
    }

    // 发送伪造学习数据
    async function sendFakeLearningData() {
        // 检查是否达到3分钟限制
        if (startTime && (new Date() - startTime) > 180000) {
            log('⏰ 脚本已运行3分钟，即将刷新页面...', 'log-success');
            setTimeout(() => { location.reload(); }, 1000);
            return;
        }

        const config = getLearningConfig();
        const endpoint = '/xcware/statisticalTime/studyRecord.shtm';
        const fullUrl = new URL(endpoint, location.origin).href;
        const requestDelay = parseInt(document.getElementById('delayRange').value);
        const useRandomDelay = document.getElementById('randomDelay').checked;
        const requestMethod = document.getElementById('requestMethod').value;
        const fakeDevice = document.getElementById('fakeDevice').checked;
        const useSessionToken = document.getElementById('useSessionToken').checked;
        const useRealEvents = document.getElementById('useRealEvents').checked;

        // 日志函数
        const log = (message, type = '') => {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            document.getElementById('progressLog').appendChild(entry);
            return entry.id;
        };

        const logElement = document.getElementById('progressLog');
        if (logElement.children.length > 20) {
            logElement.innerHTML = '';
        }

        const logId = log('开始伪造学习数据...');

        try {
                   // 生成设备指纹
        const deviceInfo = fakeDevice ? generateDeviceFingerprint() : null;

        // 获取会话令牌
        const sessionToken = useSessionToken ? getSessionToken() : null;

        // 初始化基本数据
        const baseData = {
            userID: config.userID,
            cwareID: config.cwareID,
            videoID: config.videoID,
            videoRefID: `${location.host}.${config.cwareID}.${config.videoID}`,
            startTime: '00:00',
            totalTime: config.totalDuration,
            clientTime: new Date().getTime(),
            ...(config.authKey && config.secureParam ?
                {[config.secureParam]: config.authKey} : {}),
            ...(sessionToken ? {sessionToken} : {})
        };

        // 生成签名
        if (config.authKey && config.secureParam) {
            baseData.sign = generateSecureSignature(baseData, config.authKey);
        }

        // 创建事件序列
        let behavior;
        if (useRealEvents) {
            const realBehavior = getRealEventSequence();
            if (realBehavior) {
                log('✅ 使用真实事件序列');
                behavior = realBehavior;
            } else {
                log('⚠️ 未找到真实事件序列，使用模拟序列');
                behavior = generateFakeBehavior();
            }
        } else {
            behavior = generateFakeBehavior();
        }

        // 视频处理状态跟踪
        let videoCompletion = {
            started: false,
            progress: 0,
            completed: false
        };

        // 发送每个事件
        for (let i = 0; i < behavior.length; i++) {
            const event = behavior[i];
            const eventData = {...baseData, ...event};

            // 如果是进度事件，添加时间参数
            if (event.progress) {
                eventData.currentTime = Math.floor(
                    eventData.progress * eventData.totalTime / 100
                );

                // 更新视频进度状态
                videoCompletion.progress = event.progress;
                videoCompletion.started = true;
            }

            // 如果是完成事件
            if (event.type === 'video_completed') {
                videoCompletion.completed = true;
            }

            // 添加设备信息
            if (deviceInfo) {
                eventData.deviceInfo = JSON.stringify(deviceInfo);
            }

            // 构建请求
            const params = new URLSearchParams(eventData).toString();
            const requestUrl = requestMethod === 'GET' ?
                `${fullUrl}?${params}` : fullUrl;

            // 延迟发送
            const delay = useRandomDelay ?
                requestDelay * (0.5 + Math.random()) : requestDelay;
            await new Promise(resolve => setTimeout(resolve, delay));

            // 发送请求
            const logId = log(`发送 ${event.type} 事件 (进度: ${event.progress || 0}%)...`);

            await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: requestMethod,
                    url: requestUrl,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': location.href,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        ...(deviceInfo ? {'User-Agent': deviceInfo.userAgent} : {}),
                        ...(sessionToken ? {'Cookie': `SESSIONID=${sessionToken}`} : {})
                    },
                    data: requestMethod === 'POST' ? params : null,
                    onload: function(response) {
                        const logEntry = document.getElementById(logId);

                        if (logEntry) {
                            if (response.status >= 200 && response.status < 300) {
                                // 检查响应是否是HTML（错误页面）
                                if (response.responseText.includes('<!DOCTYPE') ||
                                    response.responseText.includes('xuexi.zikao365')) {
                                    logEntry.textContent += `⚠️ 请等待所有章节视频切换完成后手动刷新页面`;
                                    logEntry.className = 'log-entry log-warning';
                                } else {
                                    // 尝试解析JSON响应
                                    try {
                                        const jsonResponse = JSON.parse(response.responseText);
                                        if (jsonResponse.success) {
                                            logEntry.textContent += `✅ 成功 (状态码: ${response.status})`;
                                            logEntry.className = 'log-entry log-success';
                                        } else {
                                            logEntry.textContent += `⚠️ 服务端返回错误: ${jsonResponse.message || '未知错误'}`;
                                            logEntry.className = 'log-entry log-warning';
                                        }
                                    } catch {
                                        // 非JSON响应
                                        if (response.responseText.trim() === '') {
                                            logEntry.textContent += `✅ 成功 (空响应)`;
                                            logEntry.className = 'log-entry log-success';
                                        } else {
                                            logEntry.textContent += `⚠️ 服务端返回: ${response.responseText.substr(0, 100)}...`;
                                            logEntry.className = 'log-entry log-warning';
                                        }
                                    }
                                }
                            } else {
                                logEntry.textContent += `❌❌ 失败 (状态码: ${response.status})`;
                                logEntry.className = 'log-entry log-error';
                            }
                        }

                        resolve();
                    },
                    onerror: function(error) {
                        const logEntry = document.getElementById(logId);
                        if (logEntry) {
                            logEntry.textContent += `❌❌ 网络错误: ${error}`;
                            logEntry.className = 'log-entry log-error';
                        }

                        resolve();
                    }
                });
            });

            // 检查是否完成当前视频
            if (videoCompletion.completed) {
                // 更新页面进度显示
                log('⏳ 更新页面进度显示...');
                await updatePageProgress(videoCompletion.progress);

                // 重置视频完成状态
                videoCompletion = {
                    started: false,
                    progress: 0,
                    completed: false
                };

                // 等待一段时间再处理下一个视频
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // 最终刷新页面状态
        log('⏳ 最终更新页面进度显示...');
        await updatePageProgress(100);

        log('🎉 学习进度提交完成！', 'log-success');

        // 检查是否达到3分钟限制
        const elapsedTime = new Date() - startTime;
        if (elapsedTime >= 180000) {
            log('⏰ 脚本已运行3分钟，即将刷新页面...', 'log-success');
            setTimeout(() => { location.reload(); }, 1000);
        } else {
            log(`💡 脚本将在2秒后重新运行 (剩余时间: ${Math.floor((180000 - elapsedTime)/1000)}秒)`, 'log-success');
            // 2秒后重新运行整个学习过程
            setTimeout(sendFakeLearningData, 2000);
        }

    } catch (error) {
        log(`❌❌ 发生严重错误: ${error.message}`, 'log-error');
        // 在出错的情况下，也检查运行时间
        const elapsedTime = new Date() - startTime;
        if (elapsedTime >= 180000) {
            log('⏰ 脚本已运行3分钟，即将刷新页面...', 'log-success');
            setTimeout(() => { location.reload(); }, 1000);
        } else {
            log(`💡 脚本将在2秒后尝试重新运行 (剩余时间: ${Math.floor((180000 - elapsedTime)/1000)}秒)`, 'log-success');
            setTimeout(sendFakeLearningData, 2000);
        }
    }
}

// 初始化UI和事件
function initUI() {
    // 填充默认配置
    const config = getLearningConfig();
    document.getElementById('configUserID').value = config.userID;
    document.getElementById('configCwareID').value = config.cwareID;
    document.getElementById('configVideoID').value = config.videoID;

    // 主按钮事件
    document.getElementById('speedStudyBtn').addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            startRuntimeTimer();
            sendFakeLearningData();
        }
    });

    // 扫描安全参数按钮
    document.getElementById('findSecurityParams').addEventListener('click', findSecurityParams);

    // 读取默认配置按钮
    document.getElementById('loadDefaultConfig').addEventListener('click', function() {
        const config = getLearningConfig();
        document.getElementById('configUserID').value = config.userID;
        document.getElementById('configCwareID').value = config.cwareID;
        document.getElementById('configVideoID').value = config.videoID;
        document.getElementById('progressLog').innerHTML +=
            `<div class="log-entry log-success">已加载默认配置</div>`;
    });

    // 请求间隔显示
    document.getElementById('delayRange').addEventListener('input', function() {
        document.getElementById('delayValue').textContent = this.value + 'ms';
    });
}

// 加载Font Awesome图标
function loadFontAwesome() {
    // 避免重复加载
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        document.head.appendChild(link);
    }
}

// 初始化
window.addEventListener('load', function() {
    loadFontAwesome();
    setTimeout(initUI, 1000);
});
})();