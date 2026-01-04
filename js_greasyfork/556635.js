// ==UserScript==
// @name         重庆理工大学校园网自动登录脚本 2025-11-23
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  脚本内置凭据管理，首次使用时弹出输入框，之后自动填充并登录。安全稳定。
// @author       You
// @match        https://uis.cqut.edu.cn/center-auth-server/*
// @match        http://202.202.145.132/eportal/index.jsp*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556635/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC%202025-11-23.user.js
// @updateURL https://update.greasyfork.org/scripts/556635/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC%202025-11-23.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'cqut_auto_login_credentials';

    /**
     * 创建并显示一个从顶部滑入的提示框
     */
    function showTopNotification(message, duration = 3000) {
        const existingNotification = document.querySelector('.auto-login-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'auto-login-notification';
        notification.textContent = message;

        if (!document.querySelector('#auto-login-notification-style')) {
            const style = document.createElement('style');
            style.id = 'auto-login-notification-style';
            style.textContent = `
                .auto-login-notification { position: fixed; top: 0; left: 50%; z-index: 99999; transform: translateX(-50%) translateY(-100%); background-color: #409EFF; color: white; padding: 12px 24px; border-radius: 0 0 8px 8px; font-size: 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: transform 0.5s ease-in-out; opacity: 0.9; pointer-events: none; }
                .auto-login-notification.show { transform: translateX(-50%) translateY(0); }
                .credential-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif; }
                .credential-modal { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 400px; }
                .credential-modal h3 { margin-top: 0; text-align: center; color: #333; }
                .credential-modal input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 14px; }
                .credential-modal .buttons { display: flex; justify-content: space-between; }
                .credential-modal button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; }
                .credential-modal .save-btn { background-color: #409EFF; color: white; flex-grow: 1; margin-right: 10px; }
                .credential-modal .save-btn:hover { background-color: #66b1ff; }
                .credential-modal .reset-btn { background-color: #f56c6c; color: white; }
                .credential-modal .reset-btn:hover { background-color: #f78989; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('show'));
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                notification.addEventListener('transitionend', () => notification.remove(), { once: true });
            }, duration);
        }
    }

    /**
     * 创建并显示凭据输入模态框
     */
    function showCredentialModal() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'credential-modal-overlay';
            overlay.innerHTML = `
                <div class="credential-modal">
                    <h3>首次使用：请输入您的凭据</h3>
                    <input type="text" id="script-username" placeholder="请输入工号/学号" autocomplete="off">
                    <input type="password" id="script-password" placeholder="请输入密码" autocomplete="off">
                    <div class="buttons">
                        <button class="save-btn">保存并登录</button>
                        <button class="reset-btn" id="reset-credentials-btn">重置</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            const saveBtn = overlay.querySelector('.save-btn');
            const resetBtn = overlay.querySelector('#reset-credentials-btn');

            saveBtn.onclick = () => {
                const username = overlay.querySelector('#script-username').value;
                const password = overlay.querySelector('#script-password').value;
                if (username && password) {
                    GM_setValue(STORAGE_KEY, { username, password });
                    overlay.remove();
                    resolve({ username, password });
                } else {
                    alert('账号和密码不能为空！');
                }
            };

            resetBtn.onclick = () => {
                GM_deleteValue(STORAGE_KEY);
                overlay.remove();
                showTopNotification('凭据已重置，请刷新页面重新输入。', 5000);
                resolve(null);
            };

            // 点击遮罩层关闭
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(null);
                }
            };
        });
    }

    /**
     * 获取凭据，如果没有则弹出输入框
     */
    async function getCredentials() {
        let credentials = GM_getValue(STORAGE_KEY);
        if (!credentials) {
            showTopNotification('未找到凭据，请输入您的账号密码。', 0);
            credentials = await showCredentialModal();
        }
        return credentials;
    }

    /**
     * 场景1: 填充凭据并点击登录
     */
    async function fillAndLogin() {
        const credentials = await getCredentials();
        if (!credentials) return; // 用户取消输入或重置

        const { username, password } = credentials;
        const usernameSelector = 'input[placeholder="请输入工号/学号"]';
        const passwordSelector = 'input[placeholder="请输入密码"]';
        const loginButtonSelector = 'button.el-button.el-button--primary';

        const usernameInput = document.querySelector(usernameSelector);
        const passwordInput = document.querySelector(passwordSelector);

        if (usernameInput && passwordInput) {
            showTopNotification('正在自动填充账号密码...', 1500);
            usernameInput.value = username;
            passwordInput.value = password;

            // 触发input事件，确保Vue等框架能检测到变化
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            showTopNotification('账号密码已填充，准备点击登录...', 1500);
            setTimeout(() => {
                const loginButton = document.querySelector(loginButtonSelector);
                if (loginButton) {
                    loginButton.click();
                    showTopNotification('已自动执行点击操作', 3000);
                } else {
                    showTopNotification('错误：未找到登录按钮。', 5000);
                }
            }, 500);
        } else {
            showTopNotification('错误：未找到用户名或密码输入框。', 5000);
        }
    }

    /**
     * 场景2: 等待元素出现并点击 (用于校园网登录页)
     */
    function waitForElementAndClick(selector, maxAttempts = 60, interval = 500) {
        let attempts = 0;
        showTopNotification('正在查找登录按钮...', 0);
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            attempts++;
            if (element) {
                showTopNotification('已找到登录按钮，准备点击...', 1500);
                setTimeout(() => { element.click(); showTopNotification('已自动执行点击操作', 3000); }, 500);
                clearInterval(timer);
            } else if (attempts >= maxAttempts) {
                showTopNotification(`超时：在 ${maxAttempts * interval / 1000} 秒内未找到登录按钮。`, 5000);
                clearInterval(timer);
            }
        }, interval);
    }

    // --- 主逻辑 ---
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('https://uis.cqut.edu.cn/center-auth-server/')) {
        fillAndLogin();
    } else if (currentUrl.startsWith('http://202.202.145.132/eportal/index.jsp')) {
        showTopNotification('检测到校园网登录页面', 2000);
        const portalButtonSelector = 'a#loginLink';
        waitForElementAndClick(portalButtonSelector);
    }

})();
