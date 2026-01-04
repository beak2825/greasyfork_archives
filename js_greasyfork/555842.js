// ==UserScript==
// @name         学工系统自动填充验证码 + 自动登录
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动填入学号密码验证码并自动登录（仅用于授权测试环境）
// @author       kiorry
// @match        http://172.31.129.65/PzhuXGNew/Sys/UserLogin.aspx*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555842/%E5%AD%A6%E5%B7%A5%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81%20%2B%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/555842/%E5%AD%A6%E5%B7%A5%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81%20%2B%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置账号密码 ===
    const USERNAME = '您的账号';
    const PASSWORD = '您的密码';

    let isLoggingIn = false; // 防止重复登录

    // 填充账号密码
    function fillCredentials() {
        const userInput = document.getElementById('UserName');
        const passInput = document.getElementById('Password');

        if (userInput && !userInput.value) {
            userInput.value = USERNAME;
            userInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[AutoFill] 用户名已填充:', USERNAME);
        }

        if (passInput && !passInput.value) {
            passInput.value = PASSWORD;
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[AutoFill] 密码已填充');
        }
    }

    // 填充验证码并自动登录
    function fillCodeAndLogin() {
        if (isLoggingIn) return;

        const codeBox = document.getElementById('code-box');
        const codeInput = document.getElementById('codeInput');
        const loginBtn = document.getElementById('queryBtn');

        if (!codeBox || !codeInput || !loginBtn) return;

        const code = codeBox.innerText.trim();
        if (code && code.length === 4 && codeInput.value !== code) {
            codeInput.value = code;
            codeInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[AutoFill] 验证码已填充：', code);

            // 验证码填好后，延迟一点点击登录（确保 cmdEncrypt 有时间准备）
            setTimeout(() => {
                if (!isLoggingIn && loginBtn && typeof loginBtn.onclick === 'function') {
                    isLoggingIn = true;
                    console.log('[AutoLogin] 正在自动登录...');
                    loginBtn.click(); // 触发 onclick="return cmdEncrypt();"
                }
            }, 200);
        }
    }

    // 页面加载后执行
    window.addEventListener('load', () => {
        setTimeout(() => {
            fillCredentials();
            fillCodeAndLogin();
        }, 400);
    });

    // === 监听验证码变化（刷新时自动重填 + 重登录）===
    const codeBox = document.getElementById('code-box');
    if (codeBox) {
        const mo = new MutationObserver(() => {
            isLoggingIn = false; // 允许重新登录
            fillCodeAndLogin();
        });
        mo.observe(codeBox, { childList: true, characterData: true, subtree: true });
    }

    // === 兜底：DOM 动态加载时补填 ===
    const globalObserver = new MutationObserver(() => {
        if (document.getElementById('UserName') && !isLoggingIn) {
            fillCredentials();
        }
    });
    globalObserver.observe(document.body, { childList: true, subtree: true });

})();