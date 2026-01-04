// ==UserScript==
// @name         90图书馆自动填写并登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写90图书馆登录页的账号与密码，并触发登录提交（不处理验证码）
// @author       anonymous
// @match        http://www.90tsg.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560036/90%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/560036/90%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // —— 账号信息（如需修改，仅改此处）——
    const USERNAME = '';
    const PASSWORD = '';

    // 简单的执行延迟，确保 DOM 完全稳定
    setTimeout(() => {
        const usernameInput = document.getElementById('user_name');
        const passwordInput = document.getElementById('password');
        const submitBtn    = document.getElementById('ok');

        // 必要节点存在性校验
        if (!usernameInput || !passwordInput || !submitBtn) {
            return;
        }

        // 填写账号与密码
        usernameInput.value = USERNAME;
        passwordInput.value = PASSWORD;

        // 触发登录（等价于人工点击）
        submitBtn.click();

    }, 600);
})();
