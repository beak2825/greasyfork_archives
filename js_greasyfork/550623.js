// ==UserScript==
// @name         万维自动填充验证码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  万维自动填充登录验证码（随机数）
// @author       damu
// @match        https://wanwei.myapp.com/login
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550623/%E4%B8%87%E7%BB%B4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550623/%E4%B8%87%E7%BB%B4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInitialized = false;
    let observer = null;

    function init() {
        if (isInitialized) return;
        setupRefreshButton();
        setupButtonListener();
        isInitialized = true;
    }

    // 设置刷新按钮（放在验证码输入框内部左侧）
    function setupRefreshButton() {
        const codeInput = document.querySelector('input[placeholder*="验证码"]');
        if (!codeInput) return;
        if (codeInput.parentNode.querySelector('.email-refresh-btn')) return; // 检查是否已添加过按钮
        const refreshBtn = document.createElement('i');
        refreshBtn.className = 'el-icon-refresh-left email-refresh-btn';
        refreshBtn.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:16px;color:#909399;cursor:pointer;z-index:10;pointer-events:auto;';
        refreshBtn.title = '重新获取验证码';
        refreshBtn.onclick = fillVerificationCode;
        const inputWrapper = codeInput.parentNode;
        inputWrapper.style.position = 'relative';
        codeInput.style.paddingLeft = '30px';
        inputWrapper.appendChild(refreshBtn);
    }

    // 设置获取验证码按钮监听
    function setupButtonListener() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent.includes('获取邮箱验证码') && !btn.hasListener) {
                btn.hasListener = true;
                btn.addEventListener('click', function() {
                    monitorCaptchaCompletion();
                });
            }
        });
    }

    // 监控验证码完成
    function monitorCaptchaCompletion() {
        const checkInterval = setInterval(() => {
            const captcha = document.getElementById('tcaptcha_transform_dy');
            if (!captcha || captcha.style.display === 'none') {
                clearInterval(checkInterval);
                setTimeout(fillVerificationCode, 1500);
            }
        }, 500);

        // 30秒后自动停止监控
        setTimeout(() => clearInterval(checkInterval), 30000);
    }

    // 填充验证码
    function fillVerificationCode() {
        const codeInput = document.querySelector('input[placeholder*="验证码"]');
        if (codeInput) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            codeInput.value = code;
            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            codeInput.dispatchEvent(event);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 2000);
    }

    // 使用轻量级观察器
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(function(mutations) {
            if (!isInitialized) return;
            let shouldCheck = false;
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches && (
                                node.matches('input[placeholder*="验证码"]') ||
                                node.matches('button') ||
                                node.querySelector('input[placeholder*="验证码"]') ||
                                node.querySelector('button')
                            )) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (shouldCheck) {
                setupRefreshButton();
                setupButtonListener();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();