// ==UserScript==
// @name         图书馆抢座助手 - 功能完整版
// @name:en      新Library Seat Sniper - Full Featured Edition
// @namespace    https://github.com/seat-sniper
// @version      4.0.0
// @description  图书馆自动抢座助手，高并发抢座
// @description:en  Complete library seat reservation assistant for BTBU, full Python feature parity
// @author       SeatSniper
// @match        http://libreservation.btbu.edu.cn/*
// @match        https://libreservation.btbu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js
// @license      MIT
// @supportURL   https://github.com/seat-sniper/library-seat-sniper/issues
// @homepageURL  https://github.com/seat-sniper/library-seat-sniper
// @compatible   chrome 支持Chrome浏览器，推荐使用
// @compatible   firefox 支持Firefox浏览器
// @compatible   edge 支持Edge浏览器
// @compatible   safari 支持Safari浏览器
// @downloadURL https://update.greasyfork.org/scripts/549424/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E5%8A%A9%E6%89%8B%20-%20%E5%8A%9F%E8%83%BD%E5%AE%8C%E6%95%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549424/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E5%8A%A9%E6%89%8B%20-%20%E5%8A%9F%E8%83%BD%E5%AE%8C%E6%95%B4%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================== 配置参数 ==========================
    const CONFIG = {
        BASE_URL: "http://libreservation.btbu.edu.cn/ic-web",
        REQ_TIMEOUT: 500,                    // 单个请求超时(ms)
        CONCURRENT_TIMEOUT: 200,             // 并发等待超时(ms) - 快速切换到下一轮
        ROUND_INTERVAL: 200,                 // 轮次间隔(ms) - 进一步压缩时间
        DEFAULT_CONCURRENT_REQUESTS: 30,     // 默认并发数 - 优化为30
        MAX_CONCURRENT_REQUESTS: 200,        // 最大并发数限制
        RETRY_DELAY: 50,                     // 重试延迟(ms)
        PER_ATTEMPT_GAP_MS: 0,              // 座位间隔时间
        UI_UPDATE_INTERVAL: 100              // UI更新间隔(ms)
    };

    // ========================== 全局状态 ==========================
    let globalState = {
        token: null,
        accNo: null,
        isRunning: false,
        stopFlag: false,
        currentConcurrentRequests: CONFIG.DEFAULT_CONCURRENT_REQUESTS,
        currentMaxWorkers: CONFIG.DEFAULT_CONCURRENT_REQUESTS,
        flashInterval: null,
        timeUpdateInterval: null,
        // ★ 会话池 - 对标Python版本 ★
        sessionPool: [],
        mainSession: null,
        // ★ 性能优化：座位ID缓存 ★
        seatIdCache: new Map(),
        roomDataCache: null
    };

    // ========================== 工具函数 ==========================

    // 解析座位名称列表 - 对标Python parse_target_seat_names
    function parseTargetSeatNames(raw) {
        if (typeof raw === 'string') {
            const parts = raw.trim().split(/[,\s，、;；]+/);
            const seen = new Set();
            const result = [];
            for (const part of parts) {
                if (part && !seen.has(part)) {
                    seen.add(part);
                    result.push(part);
                }
            }
            return result;
        }
        return raw || [];
    }

    // 收集座位输入框的值
    function collectSeatNames() {
        const seatInputs = document.querySelectorAll('.seat-input');
        const seats = [];
        seatInputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                seats.push(value);
            }
        });
        return seats;
    }

    // 时间格式标准化 - 对标Python ensure_hhmmss
    function ensureHHMMSS(timeStr) {
        timeStr = timeStr.trim();
        if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
        if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr + ":00";
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (match) {
            const hour = String(parseInt(match[1])).padStart(2, '0');
            const minute = match[2];
            const second = match[3] || '00';
            return `${hour}:${minute}:${second}`;
        }
        return timeStr;
    }

    // 日期格式化 - 对标Python ymd_no_dash
    function ymdNoDash(dateStr) {
        return dateStr.replace(/\D/g, '');
    }

    // 格式化当前时间
    function formatCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }

    // 添加日志 - 对标Python _append_log
    function addLog(message, type = 'info') {
        const logArea = document.getElementById('seat-sniper-log');
        if (!logArea) return;

        const timestamp = formatCurrentTime();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;

        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;

        // 限制日志条数
        if (logArea.children.length > 500) {
            logArea.removeChild(logArea.firstChild);
        }
    }

    // 显示通知
    function showNotification(title, message, type = 'info') {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                title: title,
                text: message,
                timeout: 5000
            });
        }
        addLog(`${title}: ${message}`, type);
    }

    // ========================== 会话池管理 - 对标Python ========================

    // 初始化会话池 - 对标Python _init_session_pool
    function initSessionPool() {
        addLog(`🔧 初始化 ${globalState.currentConcurrentRequests} 个并发会话...`);
        globalState.sessionPool = [];

        for (let i = 0; i < globalState.currentConcurrentRequests; i++) {
            // 创建会话对象（模拟requests.Session）
            const session = {
                id: i + 1,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                cookies: new Map(), // 模拟cookies存储
                // 添加请求方法
                request: function(options) {
                    return makeRequest({
                        ...options,
                        headers: {
                            ...this.headers,
                            ...options.headers
                        }
                    });
                }
            };
            globalState.sessionPool.push(session);
        }

        addLog("✅ 会话池初始化完成");
    }

    // 同步登录状态到所有会话 - 对标Python _sync_login_to_all_sessions
    function syncLoginToAllSessions() {
        if (!globalState.token || !globalState.accNo) {
            return false;
        }

        addLog("🔄 同步登录状态到所有会话...");

        globalState.sessionPool.forEach((session, index) => {
            try {
                // 将token添加到每个session的headers中
                session.headers['token'] = globalState.token;
                session.headers['lan'] = '1';

                // 如果主session有cookies，同步到所有session
                if (globalState.mainSession && globalState.mainSession.cookies) {
                    session.cookies = new Map(globalState.mainSession.cookies);
                }
            } catch (error) {
                addLog(`⚠️ 会话${index + 1}同步失败: ${error.message}`, 'warning');
            }
        });

        return true;
    }

    // ========================== 网络请求封装 ==========================

    // 发送HTTP请求 - 增强版
    function makeRequest(options) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: options.method || 'GET',
                url: options.url,
                headers: options.headers || {},
                data: options.data,
                timeout: CONFIG.REQ_TIMEOUT,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        resolve({ responseText: response.responseText, status: response.status });
                    }
                },
                onerror: (error) => reject(error),
                ontimeout: () => reject(new Error('Request timeout'))
            };

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest(requestOptions);
            } else {
                // 降级到普通 fetch
                const controller = new AbortController();
                setTimeout(() => controller.abort(), CONFIG.REQ_TIMEOUT);

                fetch(options.url, {
                    method: options.method || 'GET',
                    headers: options.headers,
                    body: options.data,
                    signal: controller.signal
                })
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
            }
        });
    }

    // ========================== 登录模块 - 对标Python ==========================

    // RSA加密密码 - 严格按后端返回的Base64 DER公钥处理，明文为 password;nonce
    async function encryptPassword(password, publicKeyStr, nonce) {
        try {
            addLog("🔐 开始RSA密码加密(Base64→DER→ASN.1→PKCS1_v1_5)...");
            if (!publicKeyStr || typeof publicKeyStr !== 'string') {
                throw new Error('无效的publicKey');
            }

            // 1) Base64 → DER 原始字节
            let derBinary;
            try {
                derBinary = forge.util.decode64(publicKeyStr);
            } catch (e) {
                throw new Error('publicKey Base64 解码失败');
            }

            // 2) DER → ASN.1 → PublicKey
            let publicKey;
            try {
                const derBuffer = forge.util.createBuffer(derBinary, 'raw');
                const asn1 = forge.asn1.fromDer(derBuffer);
                publicKey = forge.pki.publicKeyFromAsn1(asn1);
            } catch (e) {
                throw new Error('DER/ASN.1 公钥解析失败');
            }

            // 3) 明文拼接：password;nonce（参照Python版本格式）
            const plaintext = `${password};${nonce}`;
            addLog(`🔐 加密明文格式: ${password.substring(0,3)}***;${nonce.substring(0,8)}...`);

            // 4) PKCS#1 v1.5 加密
            let encryptedBytes;
            try {
                encryptedBytes = publicKey.encrypt(plaintext, 'RSAES-PKCS1-v1_5');
            } catch (e) {
                throw new Error('PKCS1_v1_5 加密失败');
            }

            // 5) 输出Base64
            const result = forge.util.encode64(encryptedBytes);
            addLog('✅ 密码加密成功', 'success');
            return result;
        } catch (error) {
            addLog(`❌ 密码加密失败: ${error.message}`, 'error');
            throw new Error(`密码加密失败: ${error.message}`);
        }
    }

    // 执行登录 - 对标Python _login_thread
    async function performLogin() {
        try {
            addLog("ℹ️ 正在登录...");

            // 初始化主会话
            if (!globalState.mainSession) {
                globalState.mainSession = {
                    headers: {},
                    cookies: new Map()
                };
            }

            // 1. 获取公钥和随机数 - 对标Python第240-245行
            addLog("🔐 正在获取登录公钥...");
            const keyData = await makeRequest({
                url: `${CONFIG.BASE_URL}/login/publicKey`,
                method: 'GET'
            });

            addLog(`🔐 公钥接口响应: code=${keyData.code}`);

            if (keyData.code !== 0) {
                throw new Error(`获取公钥失败: ${keyData.message}`);
            }

            const { publicKey, nonceStr } = keyData.data;
            addLog(`🔐 获取到公钥长度: ${publicKey ? publicKey.length : 'null'}, nonce长度: ${nonceStr ? nonceStr.length : 'null'}`);

            // 2. 加密密码 - 对标Python第247-249行
            const username = document.getElementById('seat-sniper-username').value;
            const password = document.getElementById('seat-sniper-password').value;

            if (!username || !password) {
                throw new Error("请输入学号和密码");
            }

            addLog("🔐 正在加密密码...");
            const encryptedPassword = await encryptPassword(password, publicKey, nonceStr);

            // 3. 执行登录 - 对标Python第251-266行
            addLog("🔐 正在登录...");
            const loginPayload = {
                logonName: username,
                password: encryptedPassword,
                captcha: "",
                privacy: true,
                consoleType: 16
            };

            const loginData = await makeRequest({
                url: `${CONFIG.BASE_URL}/login/user`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(loginPayload)
            });

            addLog(`🔐 登录接口响应: code=${loginData.code}, message=${loginData.message || 'none'}`);

            // 4. 处理登录结果 - 对标Python第268-273行
            if (loginData.code === 0) {
                globalState.token = loginData.data.token;
                globalState.accNo = loginData.data.accNo;

                // 保存登录信息
                GM_setValue('saved_username', username);
                GM_setValue('saved_password', password);
                GM_setValue('saved_token', globalState.token);
                GM_setValue('saved_accNo', globalState.accNo);

                addLog("✅ 登录成功", 'success');
                showNotification("登录成功", `欢迎 ${username}`, 'success');

                updateLoginButton(true);
                return true;
            } else {
                throw new Error(loginData.message || '登录失败');
            }

        } catch (error) {
            addLog(`❌ 登录失败: ${error.message}`, 'error');
            showNotification("登录失败", error.message, 'error');
            return false;
        }
    }

    // 更新登录按钮状态
    function updateLoginButton(isLoggedIn) {
        const loginBtn = document.getElementById('seat-sniper-login-btn');
        if (!loginBtn) return;

        if (isLoggedIn) {
            loginBtn.textContent = '已登录';
            loginBtn.style.background = '#4CAF50';
            loginBtn.disabled = true;
            } else {
            loginBtn.textContent = '登录';
            loginBtn.style.background = '#2196F3';
            loginBtn.disabled = false;
        }
    }

    // ========================== 抢座核心逻辑 - 对标Python ==========================

    // 单个预约请求 - 对标Python _single_reserve_request
    async function singleReserveRequest(seatName, session, workerId) {
        try {
            const roomId = document.getElementById('seat-sniper-room-id').value;
            const dateStr = ymdNoDash(document.getElementById('seat-sniper-date').value);

            // ★ 性能优化：使用缓存的座位ID ★
            const cacheKey = `${roomId}_${dateStr}_${seatName}`;
            let deviceId = globalState.seatIdCache.get(cacheKey);

            if (!deviceId) {
                // 1. 查询座位ID - 对标Python第440-451行
                const reserveData = await session.request({
                    url: `${CONFIG.BASE_URL}/reserve?roomIds=${roomId}&resvDates=${dateStr}&sysKind=8`,
                    method: 'GET'
                });

                if (reserveData.code !== 0) {
                    throw new Error(`查询座位失败: ${reserveData.message}`);
                }

                // 查找座位ID - 对标Python第453-457行
                const devices = reserveData.data;
                const device = devices.find(d => d.devName === seatName);

                if (!device) {
                    addLog(`❌ 工作线程${workerId}: 找不到座位 ${seatName}`, 'error');
                    return false;
                }

                deviceId = device.devId;
                // 缓存座位ID，避免重复查询
                globalState.seatIdCache.set(cacheKey, deviceId);
            }

            // 2. 执行预约 - 对标Python第459-475行
            const beginTime = ensureHHMMSS(document.getElementById('seat-sniper-begin-time').value);
            const endTime = ensureHHMMSS(document.getElementById('seat-sniper-end-time').value);
            const dateValue = document.getElementById('seat-sniper-date').value.trim();

            const payload = {
                sysKind: 8,
                appAccNo: globalState.accNo,
                memberKind: 1,
                resvMember: [globalState.accNo],
                resvBeginTime: `${dateValue} ${beginTime}`,
                resvEndTime: `${dateValue} ${endTime}`,
                captcha: "",
                resvProperty: 0,
                resvDev: [deviceId],
                memo: ""
            };

            const result = await session.request({
                url: `${CONFIG.BASE_URL}/reserve`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(payload)
            });

            // 3. 处理预约结果 - 对标Python第489-501行
            if (result.code === 0) {
                addLog(`🎉 工作线程${workerId}: ${seatName} 预约成功！`, 'success');
                showNotification("抢座成功", `${seatName} 预约成功！`, 'success');
                return true;
            } else {
                const message = result.message || '未知错误';
                if (message.includes('当前设备正在被预约')) {
                    addLog(`🔒 工作线程${workerId}: ${seatName} - ${message}`, 'warning');
                } else if (message.includes('请在22:00后开始预约')) {
                    addLog(`⏰ 工作线程${workerId}: ${seatName} - ${message}`, 'warning');
                } else {
                    addLog(`❌ 工作线程${workerId}: ${seatName} 失败 - ${message}`, 'error');
                }
                return false;
            }

        } catch (error) {
            if (error.message === 'Request timeout') {
                addLog(`⏱️ 工作线程${workerId}: ${seatName} 请求超时`, 'warning');
            } else {
                addLog(`❌ 工作线程${workerId}: ${seatName} 异常 - ${error.message}`, 'error');
            }
            return false;
        }
    }

    // 并发预约单个座位 - 优化版：快速超时切换
    async function concurrentReserveSeat(seatName) {
        const promises = [];

        // 提交并发任务 - 30个线程同时发起
        for (let i = 0; i < globalState.currentConcurrentRequests; i++) {
            if (globalState.stopFlag) break;

            // 每个并发请求使用不同的session
            const session = globalState.sessionPool[i % globalState.sessionPool.length];
            promises.push(singleReserveRequest(seatName, session, i + 1));
        }

        try {
            // ★ 关键优化：200ms超时，快速切换到下一轮 ★
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('轮次超时')), CONFIG.CONCURRENT_TIMEOUT);
            });

            const raceResult = await Promise.race([
                Promise.allSettled(promises),
                timeoutPromise
            ]);

            // 检查是否有成功的请求
            if (raceResult && Array.isArray(raceResult)) {
                const success = raceResult.some(result => result.status === 'fulfilled' && result.value === true);

                if (success) {
                    addLog(`🎉 ${seatName} 预约成功！`, 'success');
                    globalState.stopFlag = true;
                    return true;
                }
            }

            // 没有成功，记录本轮结果
            addLog(`⏱️ ${seatName} 本轮未成功，${CONFIG.CONCURRENT_TIMEOUT}ms后继续下一轮`, 'info');
            return false;

        } catch (error) {
            if (error.message === '轮次超时') {
                addLog(`⏱️ ${seatName} 轮次超时(${CONFIG.CONCURRENT_TIMEOUT}ms)，切换下一轮`, 'warning');
            } else {
                addLog(`⚠️ ${seatName} 并发请求异常: ${error.message}`, 'error');
            }
            return false;
        }
    }

    // 抢座主循环 - 优化版：快速轮次切换
    async function sniperMainLoop() {
        const seatNames = collectSeatNames();

        if (seatNames.length === 0) {
            addLog("❌ 没有配置座位名称", 'error');
            return;
        }

        addLog("🚀 开始高速循环尝试！(快速轮次切换模式)", 'info');
        addLog(`📊 策略：每轮${globalState.currentConcurrentRequests}个并发，${CONFIG.CONCURRENT_TIMEOUT}ms超时，${CONFIG.ROUND_INTERVAL}ms间隔`, 'info');
        addLog(`🎯 目标座位: ${seatNames.join(', ')}`, 'info');

        let roundCount = 0;

        // 主循环 - 快速轮次模式
        while (!globalState.stopFlag) {
            roundCount++;
            let success = false;

            // 遍历每个座位
            for (const seatName of seatNames) {
                if (globalState.stopFlag) break;

                addLog(`🎯 第${roundCount}轮 尝试座位：${seatName}`, 'info');

                // 并发请求同一个座位（200ms超时）
                if (await concurrentReserveSeat(seatName)) {
                    addLog("✅ 抢到座位，停止任务", 'success');
                    success = true;
                    globalState.stopFlag = true;
                    break;
                }

                // 座位间无间隔（CONFIG.PER_ATTEMPT_GAP_MS = 0）
                if (CONFIG.PER_ATTEMPT_GAP_MS > 0 && !globalState.stopFlag) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.PER_ATTEMPT_GAP_MS));
                }
            }

            if (success) break;

            // ★ 关键优化：轮次间隔400ms，避免过于频繁 ★
            if (!globalState.stopFlag) {
                addLog(`⏸️ 第${roundCount}轮结束，${CONFIG.ROUND_INTERVAL}ms后开始第${roundCount + 1}轮`, 'info');
                await new Promise(resolve => setTimeout(resolve, CONFIG.ROUND_INTERVAL));
            }
        }

        stopSniper();
    }

    // ========================== 性能优化函数 ==========================

    // 预热座位查询，提前缓存座位ID
    async function preloadSeatIds(seatNames) {
        if (seatNames.length === 0) return;

        try {
            addLog("🔥 预热座位查询缓存...", 'info');

            const roomId = document.getElementById('seat-sniper-room-id').value;
            const dateStr = ymdNoDash(document.getElementById('seat-sniper-date').value);

            // 使用第一个session查询座位数据
            const session = globalState.sessionPool[0];
            const reserveData = await session.request({
                url: `${CONFIG.BASE_URL}/reserve?roomIds=${roomId}&resvDates=${dateStr}&sysKind=8`,
                method: 'GET'
            });

            if (reserveData.code === 0) {
                const devices = reserveData.data;

                // 缓存所有目标座位的ID
                let cachedCount = 0;
                seatNames.forEach(seatName => {
                    const device = devices.find(d => d.devName === seatName);
                    if (device) {
                        const cacheKey = `${roomId}_${dateStr}_${seatName}`;
                        globalState.seatIdCache.set(cacheKey, device.devId);
                        cachedCount++;
                    }
                });

                addLog(`✅ 预热完成，缓存了${cachedCount}个座位ID`, 'success');
            } else {
                addLog(`⚠️ 预热失败: ${reserveData.message}`, 'warning');
            }
        } catch (error) {
            addLog(`⚠️ 预热异常: ${error.message}`, 'warning');
        }
    }

    // ========================== 准备开始抢座 - 对标Python _prepare_sniper ==========================

    async function prepareSniper() {
        // 对标Python第283-286行
        if (globalState.isRunning) {
            globalState.stopFlag = true;
            stopSniper();
            return;
        }

        globalState.stopFlag = false;

        // ★ 解析并发数配置 - 对标Python第291-305行 ★
        try {
            globalState.currentConcurrentRequests = parseInt(document.getElementById('seat-sniper-concurrent').value);
            if (globalState.currentConcurrentRequests <= 0) {
                addLog("❌ 并发数必须大于0", 'error');
                return;
            }
            if (globalState.currentConcurrentRequests > CONFIG.MAX_CONCURRENT_REQUESTS) {
                addLog(`❌ 并发数不能超过${CONFIG.MAX_CONCURRENT_REQUESTS}（系统保护）`, 'error');
                return;
            }

            globalState.currentMaxWorkers = globalState.currentConcurrentRequests + Math.max(10, Math.floor(globalState.currentConcurrentRequests / 5));
            addLog(`🔧 配置并发数: ${globalState.currentConcurrentRequests}, 线程池大小: ${globalState.currentMaxWorkers}`, 'info');

        } catch (error) {
            addLog("❌ 请输入有效的并发数", 'error');
            return;
        }

        // 检查登录状态 - 对标Python第307-314行
        if (!globalState.token || !globalState.accNo) {
            addLog("ℹ️ 尚未登录，正在自动登录…", 'info');
            const loginSuccess = await performLogin();
            if (!loginSuccess) {
                addLog("❌ 登录失败，无法开始抢座", 'error');
                return;
            }
        }

        // ★ 解析座位列表 - 对标Python第316-320行 ★
        const seats = collectSeatNames();
        if (seats.length === 0) {
            addLog("⚠️ 无座位名，终止", 'warning');
            return;
        }

        // ★ 初始化线程池和会话池 - 对标Python第322-327行 ★
        initSessionPool();
        syncLoginToAllSessions();

        // ★ 性能优化：预热座位查询 ★
        await preloadSeatIds(seats);

        // 计算等待时间 - 对标Python第329-347行
        const targetTime = ensureHHMMSS(document.getElementById('seat-sniper-start-time').value);
        const today = new Date().toISOString().split('T')[0];
        const targetDateTime = new Date(`${today} ${targetTime}`);

        // 如果目标时间已过，则设置为明天
        if (targetDateTime < new Date()) {
            targetDateTime.setDate(targetDateTime.getDate() + 1);
        }

        const delay = Math.max(0, targetDateTime.getTime() - new Date().getTime());

        globalState.isRunning = true;

        addLog(`⏳ 等待到 ${targetTime} 开始抢座...`, 'info');
        addLog(`🚀 将使用 ${globalState.currentConcurrentRequests} 个并发请求同时抢座！`, 'info');
        addLog(`🎯 目标座位: ${seats.join(', ')}`, 'info');

        updateStartButton(true);
        startFlashing();

        if (delay > 0) {
            addLog(`⏰ 距离开始还有 ${Math.round(delay / 1000)} 秒`, 'info');
            setTimeout(() => {
                if (!globalState.stopFlag) {
                    sniperMainLoop();
                }
            }, delay);
        } else {
            // 立即开始
            sniperMainLoop();
        }
    }

    // 停止抢座 - 对标Python _stop_flashing
    function stopSniper() {
        globalState.isRunning = false;
        globalState.stopFlag = true;
        stopFlashing();
        updateStartButton(false);
        addLog("⏹️ 抢座已停止", 'info');
    }

    // ========================== UI 控制 - 简化版 ==========================

    function updateStartButton(isRunning) {
        const startBtn = document.getElementById('seat-sniper-start-btn');
        if (!startBtn) return;

        if (isRunning) {
            startBtn.textContent = '停止抢座';
            startBtn.style.background = '#f44336';
            startBtn.onclick = stopSniper;
        } else {
            startBtn.textContent = `开始抢座 (并发数:${globalState.currentConcurrentRequests})`;
            startBtn.style.background = '#E53935';
            startBtn.onclick = prepareSniper;
        }
    }

    function startFlashing() {
        const colors = ['#E53935', '#2E7D32', '#1565C0'];
        let colorIndex = 0;

        globalState.flashInterval = setInterval(() => {
            const startBtn = document.getElementById('seat-sniper-start-btn');
            if (startBtn && globalState.isRunning) {
                startBtn.style.background = colors[colorIndex % colors.length];
                colorIndex++;
            }
        }, 220);
    }

    function stopFlashing() {
        if (globalState.flashInterval) {
            clearInterval(globalState.flashInterval);
            globalState.flashInterval = null;
        }

        const startBtn = document.getElementById('seat-sniper-start-btn');
        if (startBtn) {
            startBtn.style.background = '#E53935';
        }
    }

    function updateCurrentTime() {
        const timeLabel = document.getElementById('seat-sniper-current-time');
        if (timeLabel) {
            timeLabel.textContent = formatCurrentTime();
        }
    }

    // ========================== UI 创建 - 可收缩展开版 ==========================

    function createUI() {
        if (document.getElementById('seat-sniper-container')) {
            return;
        }

        // 加载保存的配置
        const savedUsername = GM_getValue('saved_username', '');
        const savedPassword = GM_getValue('saved_password', '');
        const savedRoomId = GM_getValue('saved_room_id', '1');
        const savedSeats = JSON.parse(GM_getValue('saved_seats', '["", "", ""]'));
        const savedToken = GM_getValue('saved_token', '');
        const savedAccNo = GM_getValue('saved_accNo', '');
        const savedExpanded = GM_getValue('ui_expanded', false); // 记住展开状态

        if (savedToken && savedAccNo) {
            globalState.token = savedToken;
            globalState.accNo = savedAccNo;
        }

        // 创建主容器
        const container = document.createElement('div');
        container.id = 'seat-sniper-container';
        container.className = savedExpanded ? 'expanded' : 'collapsed';
        container.innerHTML = `
            <style>
                #seat-sniper-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #fff;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    cursor: move;
                    user-select: none;
                }

                /* 收缩状态 */
                #seat-sniper-container.collapsed {
                    width: 250px;
                    height: auto;
                }

                /* 展开状态 */
                #seat-sniper-container.expanded {
                    width: 420px;
                    height: auto;
                }

                .sniper-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 15px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: move;
                    position: relative;
                }

                .sniper-title {
                    flex: 1;
                }

                .toggle-size-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                }

                .toggle-size-btn:hover {
                    background: rgba(255,255,255,0.3);
                }

                .sniper-content {
                    padding: 15px;
                    cursor: default;
                }

                /* 收缩状态下隐藏部分内容 */
                .collapsed .expandable-content {
                    display: none;
                }

                .collapsed .sniper-content {
                    padding: 10px 15px;
                }

                .form-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    gap: 8px;
                }

                .form-row.compact {
                    margin-bottom: 8px;
                }

                .form-row label {
                    min-width: 60px;
                    font-weight: bold;
                    color: #333;
                    font-size: 13px;
                }

                .form-row input, .form-row textarea {
                    flex: 1;
                    padding: 6px 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                }

                /* 收缩状态下输入框宽度限制 */
                .collapsed .form-row input[type="text"],
                .collapsed .form-row input[type="password"] {
                    max-width: 120px;
                }

                .seat-grid {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .seat-input {
                    width: 60px !important;
                    flex: none !important;
                    padding: 4px 6px !important;
                    text-align: center;
                    border: 2px solid #ddd !important;
                    border-radius: 4px !important;
                    font-size: 11px !important;
                    font-weight: bold;
                }

                .seat-input:focus {
                    border-color: #4CAF50 !important;
                    box-shadow: 0 0 3px rgba(76, 175, 80, 0.3);
                    outline: none;
                }

                .btn-primary {
                    background: #2196F3;
                    color: white;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                }

                .btn-danger {
                    background: #E53935;
                    color: white;
                    width: 100%;
                    padding: 10px;
                    font-size: 14px;
                    margin-top: 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .current-time {
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    color: #1976D2;
                    font-size: 12px;
                }

                .log-area {
                    height: 150px;
                    overflow-y: auto;
                    background: #0b1020;
                    color: #cde0ff;
                    padding: 8px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                }

                .expanded .log-area {
                    height: 200px;
                }

                .log-entry {
                    margin-bottom: 3px;
                    line-height: 1.3;
                }

                .log-entry .timestamp {
                    color: #888;
                }

                .log-success {
                    color: #4CAF50;
                }

                .log-error {
                    color: #f44336;
                }

                .log-warning {
                    color: #ff9800;
                }

                .separator {
                    height: 1px;
                    background: #eee;
                    margin: 10px 0;
                }

                .highlight-input {
                    border: 2px solid #4CAF50 !important;
                    font-weight: bold;
                }

                .dragging {
                    opacity: 0.8;
                    transform: scale(1.02);
                }

                /* 状态指示 */
                .status-indicator {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4CAF50;
                    border: 2px solid white;
                }

                /* 切换按钮容器 */
                .toggle-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }

                .toggle-hint {
                    font-size: 8px;
                    color: rgba(255,255,255,0.8);
                    line-height: 1;
                    pointer-events: none;
                }
            </style>

            <div class="sniper-header" id="sniper-header">
                <div class="sniper-title">🎯 抢座助手</div>
                <div class="toggle-container">
                    <button class="toggle-size-btn" id="toggle-size-btn" title="展开/收缩">🎯</button>
                    <span class="toggle-hint" id="toggle-hint">小</span>
                </div>
                <div class="status-indicator"></div>
            </div>

            <div class="sniper-content">
                <!-- 基本信息（始终显示） -->
                <div class="form-row compact">
                    <label>学号:</label>
                    <input type="text" id="seat-sniper-username" value="${savedUsername}" placeholder="请输入学号">
                    <button id="seat-sniper-login-btn" class="btn-primary">登录</button>
                </div>

                <div class="form-row compact">
                    <label>密码:</label>
                    <input type="password" id="seat-sniper-password" value="${savedPassword}" placeholder="请输入密码">
                </div>

                <!-- 可展开内容 -->
                <div class="expandable-content">
                    <div class="form-row compact">
                        <label>房间ID:</label>
                        <input type="text" id="seat-sniper-room-id" value="${savedRoomId}" placeholder="房间ID">
                    </div>

                    <div class="separator"></div>

                    <div class="form-row compact">
                        <label>当前时间:</label>
                        <span id="seat-sniper-current-time" class="current-time">${formatCurrentTime()}</span>
                    </div>

                    <div class="form-row compact">
                        <label>抢座日期:</label>
                        <input type="date" id="seat-sniper-date" value="${new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}">
                    </div>

                    <div class="form-row compact">
                        <label>预约时段:</label>
                        <input type="time" id="seat-sniper-begin-time" value="08:00" style="width: 60px;">
                        <span>-</span>
                        <input type="time" id="seat-sniper-end-time" value="20:00" style="width: 60px;">
                    </div>

                    <div class="form-row compact">
                        <label>开始时间:</label>
                        <input type="time" id="seat-sniper-start-time" value="21:59:39" step="1">
                    </div>

                    <div class="separator"></div>

                    <div class="form-row compact">
                        <label>并发数:</label>
                        <input type="number" id="seat-sniper-concurrent" value="${CONFIG.DEFAULT_CONCURRENT_REQUESTS}"
                               min="1" max="${CONFIG.MAX_CONCURRENT_REQUESTS}" class="highlight-input" style="width: 80px;">
                    </div>
                </div>

                <!-- 座位配置（始终显示） -->
                <div class="form-row compact">
                    <label>座位:</label>
                    <div class="seat-grid">
                        <input type="text" class="seat-input" value="${savedSeats[0] || ''}" placeholder="1">
                        <input type="text" class="seat-input" value="${savedSeats[1] || ''}" placeholder="2">
                        <input type="text" class="seat-input" value="${savedSeats[2] || ''}" placeholder="3">
                    </div>
                </div>

                <!-- 开始按钮（始终显示） -->
                <button id="seat-sniper-start-btn" class="btn-danger">开始抢座 (并发:${CONFIG.DEFAULT_CONCURRENT_REQUESTS})</button>

                <!-- 日志区域（始终显示，但高度会变化） -->
                <div style="margin-top: 10px;">
                    <label><strong>📋 日志:</strong></label>
                    <div id="seat-sniper-log" class="log-area"></div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 绑定事件
        document.getElementById('seat-sniper-login-btn').onclick = performLogin;
        document.getElementById('seat-sniper-start-btn').onclick = prepareSniper;

        // 展开/收缩切换
        document.getElementById('toggle-size-btn').onclick = function(e) {
            e.stopPropagation(); // 防止触发拖拽
            const isExpanded = container.classList.contains('expanded');
            if (isExpanded) {
                container.classList.remove('expanded');
                container.classList.add('collapsed');
                GM_setValue('ui_expanded', false);
                document.getElementById('toggle-hint').textContent = '小';
            } else {
                container.classList.remove('collapsed');
                container.classList.add('expanded');
                GM_setValue('ui_expanded', true);
                document.getElementById('toggle-hint').textContent = '大';
            }
        };

        // 设置初始提示文字
        document.getElementById('toggle-hint').textContent = savedExpanded ? '大' : '小';

        // 添加拖拽功能
        makeDraggable(container);

        // 自动保存配置
        const usernameInput = document.getElementById('seat-sniper-username');
        const passwordInput = document.getElementById('seat-sniper-password');
        const roomIdInput = document.getElementById('seat-sniper-room-id');

        usernameInput.addEventListener('input', function() {
            GM_setValue('saved_username', this.value);
        });

        passwordInput.addEventListener('input', function() {
            GM_setValue('saved_password', this.value);
        });

        roomIdInput.addEventListener('input', function() {
            GM_setValue('saved_room_id', this.value);
        });

        // 座位配置自动保存
        const seatInputs = document.querySelectorAll('.seat-input');
        seatInputs.forEach(input => {
            input.addEventListener('input', function() {
                const seats = [];
                seatInputs.forEach(s => seats.push(s.value.trim()));
                GM_setValue('saved_seats', JSON.stringify(seats));
            });
        });

        // 并发数更新
        const concurrentInput = document.getElementById('seat-sniper-concurrent');
        concurrentInput.addEventListener('input', function() {
            globalState.currentConcurrentRequests = parseInt(this.value) || CONFIG.DEFAULT_CONCURRENT_REQUESTS;
            updateStartButton(false);
        });

        // 开始时间更新
        globalState.timeUpdateInterval = setInterval(updateCurrentTime, CONFIG.UI_UPDATE_INTERVAL);

        // 检查登录状态
        updateLoginButton(globalState.token && globalState.accNo);

        addLog("🚀 图书馆抢座助手已启动 - 功能完整版", 'success');
        addLog(`📊 默认并发数: ${CONFIG.DEFAULT_CONCURRENT_REQUESTS}`, 'info');
        addLog(`⏱️ 请求超时: ${CONFIG.REQ_TIMEOUT}ms`, 'info');
    }

    // 拖拽功能
    function makeDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = element.querySelector('.sniper-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.toggle-size-btn') || e.target.closest('.toggle-container')) {
                return; // 不拖拽切换按钮和容器
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                element.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                // 限制拖拽范围在窗口内
                const rect = element.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }

        function dragEnd() {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                element.classList.remove('dragging');

                // 保存位置
                GM_setValue('container_position_x', currentX);
                GM_setValue('container_position_y', currentY);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // 恢复保存的位置
        const savedX = GM_getValue('container_position_x', null);
        const savedY = GM_getValue('container_position_y', null);

        // 如果有保存的位置，则恢复；否则使用默认位置
        if (savedX !== null && savedY !== null) {
            xOffset = savedX;
            yOffset = savedY;
            setTranslate(savedX, savedY, element);
        } else {
            // 首次使用时，保存当前默认位置
            GM_setValue('container_position_x', 0);
            GM_setValue('container_position_y', 0);
        }
    }

    // ========================== 初始化 ==========================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', function() {
        if (globalState.timeUpdateInterval) {
            clearInterval(globalState.timeUpdateInterval);
        }
        if (globalState.flashInterval) {
            clearInterval(globalState.flashInterval);
        }
        globalState.stopFlag = true;
    });

    // 启动
    init();

})();