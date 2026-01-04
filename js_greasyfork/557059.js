// ==UserScript==
// @name         Codesign 自动密码填充器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动检测URL中的密码参数并填充到 codesign 页面被遮挡的密码输入框
// @author       You
// @match        https://codesign.qq.com/*
// @grant        none
// @run-at       document-end
// @author       shiyi
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557059/Codesign%20%E8%87%AA%E5%8A%A8%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557059/Codesign%20%E8%87%AA%E5%8A%A8%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getPassword() {
        const url = new URL(window.location.href);
        return url.searchParams.get('pwd') || url.searchParams.get('password');
    }

    function fillPassword() {
        const password = getPassword();
        if (!password) return;

        const input = document.querySelector('.t-input__wrap .t-input__inner');
        if (input) {
            input.focus();
            input.value = password;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.blur();

            console.log('[Codesign] 密码已自动填充');
        } else {
            console.warn('[Codesign] 未找到密码输入框');
        }
    }

    function waitForInput() {
        const interval = setInterval(() => {
            const input = document.querySelector('.t-input__wrap .t-input__inner');
            if (input) {
                clearInterval(interval);
                fillPassword();
            }
        }, 200);

        setTimeout(() => clearInterval(interval), 10000); // 最多等10秒
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForInput);
    } else {
        waitForInput();
    }
})();