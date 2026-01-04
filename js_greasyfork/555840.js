// ==UserScript==
// @name         学生竞赛系统自动绕过验证码登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动填充学号密码 + 绕过验证码 + 自动登录
// @author       You
// @match        http://172.31.129.57/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555840/%E5%AD%A6%E7%94%9F%E7%AB%9E%E8%B5%9B%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%BB%95%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/555840/%E5%AD%A6%E7%94%9F%E7%AB%9E%E8%B5%9B%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%BB%95%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 学号和密码
    const USER_ID = '您的账号';
    const PASSWORD = '您的密码';

    // 等待关键对象加载完成
    const waitForApp = setInterval(() => {
        if (typeof App !== 'undefined' && App.txtCode && App.btnSubmit) {
            clearInterval(waitForApp);
            bypassCaptcha();
        }
    }, 100);

    function bypassCaptcha() {
        // === 自动填入学号 ===
        const userInput = document.querySelector('input[name="txtUserId"]') ||
                          document.getElementById('txtUserId-inputEl');
        if (userInput && !userInput.value) {
            userInput.value = USER_ID;
            userInput.dispatchEvent(new Event('input', { bubbles: true }));
            userInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // === 自动填充密码 ===
        const passInput = document.querySelector('input[name="txtPassword"]') ||
                          document.getElementById('txtPassword-inputEl');
        if (passInput && !passInput.value) {
            passInput.value = PASSWORD;
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // === 重写 getValue 方法，始终返回 4 位验证码 ===
        if (App.txtCode.getValue && !App.txtCode._patched) {
            const originalGetValue = App.txtCode.getValue;
            App.txtCode.getValue = function () {
                return "1234"; // 固定返回 4 位数
            };
            App.txtCode._patched = true; // 防止重复 patch
        }

        // === 强制设置验证码为有效 ===
        window.isValidCode = true;

        // === 直接触发登录点击 ===
        setTimeout(() => {
            if (App.btnSubmit && typeof App.btnSubmit.fireEvent === 'function') {
                console.log("[AutoLogin] 学号密码已填充，绕过验证码，自动点击登录！");
                App.btnSubmit.fireEvent("click");
            }
        }, 300);
    }

    // 可选：如果你发现页面是动态加载的，也可以监听 DOM 变化
    const observer = new MutationObserver((mutations, obs) => {
        if (typeof App !== 'undefined' && App.txtCode && App.btnSubmit && !window._bypassDone) {
            window._bypassDone = true;
            obs.disconnect();
            bypassCaptcha();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();