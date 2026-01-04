// ==UserScript==
// @name         139邮箱登录助手 (v10.0 终极精准版)
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  精确ID定位输入框，解决了步骤2卡住的问题
// @author       Gemini
// @match        *://*.10086.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556382/139%E9%82%AE%E7%AE%B1%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B%20%28v100%20%E7%BB%88%E6%9E%81%E7%B2%BE%E5%87%86%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556382/139%E9%82%AE%E7%AE%B1%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B%20%28v100%20%E7%BB%88%E6%9E%81%E7%B2%BE%E5%87%86%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MY_PHONE = "13148339368";

    // --- 状态提示框 ---
    let box = document.createElement('div');
    box.style.cssText = `position: fixed; top: 10px; right: 10px; background: #008000; color: #fff; padding: 12px; z-index: 9999999; font-size: 14px; border: 2px solid #fff; font-weight: bold;`;
    document.body.appendChild(box);

    function log(msg) {
        box.innerHTML = `139助手 v10.0<br>${msg}`;
        console.log(`[139助手] ${msg}`);
    }

    // --- 终极事件模拟函数 ---
    function ultimateClick(element) {
        if (!element || element.offsetParent === null) return false;

        // 模拟触摸事件
        element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
        element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));

        // 模拟鼠标事件
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));

        // 执行最终点击
        element.click();

        return true;
    }

    let step = 1;

    const scanner = setInterval(() => {

        // --- 步骤 1: 找“短信验证”并点击 ---
        if (step === 1) {
            let tab = document.evaluate("//*[contains(text(),'短信验证')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (tab && tab.offsetParent !== null) {
                if (ultimateClick(tab)) {
                    step = 2;
                    log("步骤1: 成功触发短信验证 Tab");
                }
            } else {
                 log("步骤1: 正在等待短信验证 Tab 出现...");
            }
        }

        // --- 步骤 2: 填手机号 (核心修改) ---
        if (step === 2) {
            // !!! 精准定位您提供的 ID !!!
            let input = document.getElementById("txtMobile");

            if (input && input.offsetParent !== null) {
                if(input.value !== MY_PHONE) {
                    input.focus();
                    input.value = MY_PHONE;
                    // 触发全套事件
                    input.dispatchEvent(new Event('input', {bubbles:true}));
                    input.dispatchEvent(new Event('change', {bubbles:true}));
                    input.dispatchEvent(new Event('blur', {bubbles:true}));
                }
                step = 3;
                log("步骤2: 手机号填写完毕 (ID: txtMobile)");
            } else {
                 log("步骤2: 正在等待手机号输入框出现...");
            }
        }

        // --- 步骤 3: 勾选协议 (使用精准ID) ---
        if (step === 3) {
            let agreeBtn = document.getElementById("accountSelImg");

            if (agreeBtn && agreeBtn.offsetParent !== null) {
                let isChecked = agreeBtn.classList.contains("icon-selected");

                if (!isChecked) {
                    ultimateClick(agreeBtn);
                }
                step = 4;
                log("步骤3: 协议勾选处理完成");
            } else {
                log("步骤3: 正在寻找协议勾选框 (ID: accountSelImg)...");
            }
        }

        // --- 步骤 4: 点击获取验证码 ---
        if (step === 4) {
            let getCodeBtn = document.getElementById("btnGetCode");

            if (!getCodeBtn) {
                let xpath = "//*[contains(text(),'获取验证码')]";
                let res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                getCodeBtn = res.singleNodeValue;
            }

            if (getCodeBtn && getCodeBtn.offsetParent !== null) {
                let isDisabled = getCodeBtn.disabled || getCodeBtn.classList.contains("disabled") || getCodeBtn.classList.contains("btn-gray");

                if (!isDisabled) {
                    setTimeout(() => {
                        ultimateClick(getCodeBtn);
                        log(">>> 成功! <<< <br>已点击获取验证码");
                        clearInterval(scanner);
                    }, 500);
                } else {
                    log("步骤4: 等待获取验证码按钮变亮...");
                }
            } else {
                 log("步骤4: 正在等待获取验证码按钮出现...");
            }
        }

    }, 500);

})();