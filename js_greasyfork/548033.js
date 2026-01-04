// ==UserScript==
// @name         Chacuo AES Auto Config
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动设置查错网 AES 参数
// @author       YourName
// @match        *://tool.chacuo.net/cryptaes*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548033/Chacuo%20AES%20Auto%20Config.user.js
// @updateURL https://update.greasyfork.org/scripts/548033/Chacuo%20AES%20Auto%20Config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完毕
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // 设置 AES 配置
    function setAESConfig() {
        // 模式 CBC
        const modeSelect = document.querySelector('select[prop="m"]');
        if(modeSelect) modeSelect.value = 'cbc';

        // 填充 pkcs5
        const padSelect = document.querySelector('select[prop="pad"]');
        if(padSelect) padSelect.value = 'pkcs5';

        // 密码
        const passwordInput = document.querySelector('input[prop="p"]');
        if(passwordInput) passwordInput.value = '1234567890123456';

        // 偏移量 IV
        const ivInput = document.querySelector('input[prop="i"]');
        if(ivInput) ivInput.value = 'abcdef9876543210';

        // 字符集 UTF-8
        const charsetSelect = document.querySelector('select[prop="s"]');
        if(charsetSelect) charsetSelect.value = 'utf-8';
    }

    // 页面加载完后设置
    waitForElement('select[prop="m"]', setAESConfig);

})();
