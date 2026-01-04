// ==UserScript==
// @name         XJTLU box 自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动完成登录，支持手动输入账号或自动填入账号，右上角显示操作进度
// @author       wujinjun
// @license      MIT
// @match        https://box.xjtlu.edu.cn/accounts/login/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550860/XJTLU%20box%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550860/XJTLU%20box%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================================
    // !!! 请在这里替换为您的用户名和密码 !!!
    // 如果留空，脚本将等待用户手动输入或浏览器自动填充。
    // =========================================================================================
    const SAVED_USERNAME = 'YOUR_SAVED_USERNAME'; // <-- 替换为您的用户名 (例如: '202112345')
    const SAVED_PASSWORD = 'YOUR_SAVED_PASSWORD'; // <-- 替换为您的密码 (例如: 'MySecurePassword')
    // =========================================================================================


    // --- 元素选择器定义 ---
    const USERNAME_SELECTOR = '#login-form > input.input.name-input';
    const PASSWORD_SELECTOR = '#login-form > input.input.passwd-input';
    const CHECKBOX_SELECTOR = '#login-form > label > input[type="checkbox"]'; // 确保是checkbox
    const LOGIN_BUTTON_SELECTOR = '#login-form > button';

    // --- 进度显示逻辑 ---
    let progressIndicator = null;
    const HELPER_PREFIX = "[XJTLU box login helper] "; // 新增前缀常量

    // 创建并注入进度显示框到页面右上角
    function createProgressIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'tampermonkey-progress-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: 'Inter', Arial, sans-serif;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    /**
     * 更新进度显示框的内容和颜色
     * @param {string} text 显示的文字
     * @param {'info'|'waiting'|'success'|'error'|'default'} type 颜色类型
     */
    function updateProgress(text, type = 'info') {
        if (!progressIndicator) return;

        // 添加前缀到显示内容
        progressIndicator.textContent = HELPER_PREFIX + text;
        
        let colorCode = '#6B7280'; // default: Gray

        switch (type) {
            case 'info':
                colorCode = '#3B82F6'; // Blue
                break;
            case 'waiting':
                colorCode = '#FBBF24'; // Yellow/Amber
                break;
            case 'success':
                colorCode = '#10B981'; // Green
                break;
            case 'error':
                colorCode = '#EF4444'; // Red
                break;
            default:
                colorCode = '#6B7280';
        }
        progressIndicator.style.border = `2px solid ${colorCode}`;
    }

    // --- 辅助函数：等待元素出现 ---
    function waitForElement(selector) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver((mutationsList, observer) => {
                const target = document.querySelector(selector);
                if (target) {
                    observer.disconnect();
                    resolve(target);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- 核心逻辑函数：等待输入完成（已添加轮询和自动填写逻辑） ---
    function waitForStableInput(inputSelectors, stabilityDelay = 1000) {
        return new Promise((resolve) => {
            const inputs = inputSelectors.map(sel => document.querySelector(sel)).filter(el => el);

            if (inputs.length !== inputSelectors.length) {
                updateProgress('错误：登录元素未找到', 'error');
                console.error('部分或全部输入框未找到。');
                return resolve(false); // 提前退出
            }

            let timeoutId = null;
            let pollingIntervalId = null; // 用于轮询的 Interval ID

            // 检查所有输入框是否都包含非空值
            const allInputsFilled = () => inputs.every(input => input.value.trim() !== '');

            // 监听输入事件/启动稳定检查
            const inputListener = () => {
                updateProgress('等待账号和密码输入稳定(≈1000ms)...', 'waiting');
                
                if (allInputsFilled()) {
                    clearTimeout(timeoutId); // 清除旧的计时器

                    // 启动新的计时器，等待内容稳定
                    timeoutId = setTimeout(() => {
                        console.log('输入内容已稳定，准备下一步。');
                        inputs.forEach(input => input.removeEventListener('input', inputListener));
                        clearInterval(pollingIntervalId); // 稳定后清除轮询
                        resolve(true);
                    }, stabilityDelay);
                } else {
                    // 如果内容被清空，或未填满，清除计时器
                    clearTimeout(timeoutId);
                }
            };

            // 轮询检查（用于检测浏览器自动填充）
            function checkPolling() {
                if (allInputsFilled() && timeoutId === null) {
                    // 如果通过轮询发现内容已填充，且稳定计时器尚未启动，则模拟一次事件触发稳定检查
                    console.log('通过轮询检测到内容已填充，启动稳定检查...');
                    inputListener();
                }
            }


            // 初始检查
            if (allInputsFilled()) {
                 console.log('页面加载时账号和密码输入框已有内容，等待稳定(≈1000ms)...');
                 inputListener(); // 启动稳定检查
            } else {
                 // --- 自动填写或等待用户输入逻辑 ---
                if (SAVED_USERNAME && SAVED_PASSWORD && SAVED_USERNAME !== 'YOUR_SAVED_USERNAME') {
                    // 自动填充逻辑
                    inputs[0].value = SAVED_USERNAME;
                    inputs[1].value = SAVED_PASSWORD;
                    
                    // 填充后，立即检查并启动稳定计时器
                    if (allInputsFilled()) {
                        console.log('自动填写完成，启动稳定检查...');
                        updateProgress('自动填写账号和密码完成 (1/3 正在等待稳定)', 'info');
                        inputListener(); // 立即启动稳定检查 (进入步骤1)
                    } else {
                        // 如果某种原因填充失败，回退到等待用户输入
                        console.warn('自动填写失败，回退到等待用户输入。');
                        updateProgress('等待用户输入账号和密码 (1/3)', 'waiting');
                        
                        // 启动轮询和聚焦
                        inputs[0].click();
                        inputs[0].focus();
                        pollingIntervalId = setInterval(checkPolling, 200); 
                    }

                } else {
                    // 如果没有保存的凭据，或者输入框为空，回退到等待用户输入/自动填充和聚焦
                    updateProgress('等待用户输入账号和密码 (1/3)', 'waiting');
                    
                    const usernameInput = inputs[0];
                    if (usernameInput) {
                        setTimeout(() => {
                            console.log('检测到输入框为空且未保存凭据，聚焦用户名输入框。');
                            // 模拟点击 (click) 并聚焦 (focus)
                            usernameInput.click();
                            usernameInput.focus();
                        }, 100); 
                    }
                    
                    // 启动轮询
                    pollingIntervalId = setInterval(checkPolling, 200); // 每 200ms 检查一次
                }
                 // ------------------------------------------------------------------

                 // 如果初始为空，则启动轮询
                 pollingIntervalId = setInterval(checkPolling, 200); // 每 200ms 检查一次
            }

            // 无论初始状态如何，都添加监听器，以便在用户手动输入时立即响应
            inputs.forEach(input => input.addEventListener('input', inputListener));

            console.log('等待用户填写账号和密码输入框...');
        });
    }

    // --- 主执行函数 ---
    function main() {
        console.log('Tampermonkey 脚本启动...');
        
        // 1. 初始化进度指示器
        progressIndicator = createProgressIndicator();
        updateProgress('脚本初始化中...', 'info');

        // 使用 Promise.all 等待关键元素加载
        Promise.all([
            waitForElement(USERNAME_SELECTOR),
            waitForElement(PASSWORD_SELECTOR),
            waitForElement(CHECKBOX_SELECTOR),
            waitForElement(LOGIN_BUTTON_SELECTOR)
        ])
        .then(() => {
            // 元素加载成功，开始步骤 1：等待输入稳定
            return waitForStableInput([USERNAME_SELECTOR, PASSWORD_SELECTOR], 1000);
        })
        .then((inputStable) => {
            if (!inputStable) {
                console.log('输入未稳定或元素未找到，脚本结束。');
                return;
            }

            // --- 从这里开始执行同步和 setInterval 逻辑 ---
            const checkboxEl = document.querySelector(CHECKBOX_SELECTOR);
            const loginButtonEl = document.querySelector(LOGIN_BUTTON_SELECTOR);
            let checkInterval = null;
            let initialUrl = window.location.href;

            updateProgress('账号和密码输入稳定，准备勾选(7天内保持登录) (1/3 完成)', 'info');

            // 步骤 2：处理单选框/复选框
            if (checkboxEl) {
                if (!checkboxEl.checked) {
                    console.log('步骤 2：勾选复选框(7天内保持登录)。');
                    checkboxEl.click();
                } else {
                    console.log('步骤 2：复选框已勾选，跳过。');
                }
                updateProgress('复选框(7天内保持登录)处理完毕，准备登录 (2/3 完成)', 'info');
            } else {
                console.warn('复选框元素未找到。');
                updateProgress('警告：复选框(7天内保持登录)未找到 (2/3 完成)', 'info');
            }

            // 步骤 3：点击登录按钮并验证跳转
            
            // 设置一个间隔执行的函数来点击按钮
            function attemptLogin() {
                if (window.location.href !== initialUrl) {
                    // URL 发生变化，认为跳转成功
                    clearInterval(checkInterval);
                    updateProgress('成功跳转！脚本结束', 'success');
                    console.log('步骤 3 完成：页面已跳转，脚本结束。');

                    // 2秒后自动隐藏指示器
                    setTimeout(() => {
                        if (progressIndicator) progressIndicator.style.display = 'none';
                    }, 2000);
                    return;
                }

                if (loginButtonEl) {
                    console.log('步骤 3：点击登录按钮...');
                    updateProgress('尝试点击登录按钮...', 'waiting');
                    loginButtonEl.click();
                } else {
                    console.error('登录按钮未找到，停止点击。');
                    updateProgress('错误：登录按钮未找到', 'error');
                    clearInterval(checkInterval);
                }
            }

            // 首次点击
            attemptLogin();

            // 间隔 1000ms 重复点击，直到跳转
            checkInterval = setInterval(attemptLogin, 1000);
        })
        .catch(error => {
            // 捕获 Promise 链中任何步骤的错误
            updateProgress('脚本发生致命错误', 'error');
            console.error('脚本执行出错:', error);
        });
    }

    // 运行主函数
    main();

})();
