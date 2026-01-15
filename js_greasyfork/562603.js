// ==UserScript==
// @name         云汇通自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制聚焦输入框，循环监测直至填充成功，修复2FA不自动填入的问题
// @author       Gemini
// @license      I
// @match        https://agent.yunhuitong1.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.4.2/sha.js
// @downloadURL https://update.greasyfork.org/scripts/562603/%E4%BA%91%E6%B1%87%E9%80%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/562603/%E4%BA%91%E6%B1%87%E9%80%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置区域 ---
    const SECRET_KEY = "KPAO4242IV4MTJGZHCU245FLQ6DSXK2T";
    // ------------------

    console.log("脚本已加载：V5.0 焦点增强版");

    // 状态锁：只锁“点击确认按钮”这个动作，不锁“填值”动作
    // 这样如果填值失败，下一轮循环还能继续补填
    let isConfirmClicked = false;

    // 循环检测
    setInterval(function() {
        try {
            fixAgreementCheckbox();
            autoFill2FA();
        } catch (e) {
            console.error("脚本运行出错:", e);
        }
    }, 500);

    // --- 功能1：协议勾选 (V4.0 逻辑保持不变) ---
    function fixAgreementCheckbox() {
        const labels = document.querySelectorAll('label.el-checkbox');
        labels.forEach(label => {
            const text = label.textContent.replace(/\s+/g, '');
            if (text.includes("用户协议") || text.includes("阅读并同意")) {
                const inputSpan = label.querySelector('.el-checkbox__input');
                const isChecked = inputSpan && inputSpan.classList.contains('is-checked');
                if (!isChecked) {
                    const visualBox = label.querySelector('.el-checkbox__inner');
                    if (visualBox) visualBox.click();
                    else label.click();
                }
            }
        });
    }

    // --- 功能2：2FA 弹窗填充 (增强焦点与重试机制) ---
    function autoFill2FA() {
        // 1. 寻找弹窗
        const dialog = document.querySelector('div[role="dialog"][aria-label="需要双重验证"]');

        // 2. 检查弹窗是否存在且可见
        if (!dialog || dialog.style.display === 'none' || dialog.offsetParent === null) {
            // 弹窗消失后，重置确认锁，以便下次使用
            if (isConfirmClicked) isConfirmClicked = false;
            return;
        }

        // 3. 在弹窗内查找输入框
        const inputField = dialog.querySelector('input');
        if (!inputField) return;

        // 计算验证码
        const code = getTOTP(SECRET_KEY);

        // --- 核心修改：检查当前输入框的值 ---

        // 如果输入框是空的，或者值不对，就强制执行填入逻辑
        // (不要用锁锁死，只要发现值不对，就立刻纠正)
        if (inputField.value !== code) {
            console.log("检测到输入框为空或数值不对，正在执行强制填充...");

            // A. 模拟鼠标点击和聚焦 (这就是你说的“选中输入框”)
            inputField.focus();
            inputField.click();

            // B. 填入数值
            inputField.value = code;

            // C. 触发一系列事件，确保 Vue 收到通知
            inputField.dispatchEvent(new Event('focus', { bubbles: true })); // 获得焦点
            inputField.dispatchEvent(new Event('input', { bubbles: true })); // 输入内容
            inputField.dispatchEvent(new Event('change', { bubbles: true })); // 内容改变
            inputField.dispatchEvent(new Event('blur', { bubbles: true }));  // 失去焦点
        }

        // 4. 只有当验证码填对了，才去点击确认
        if (inputField.value === code && !isConfirmClicked) {
            console.log("验证码填充正确，准备点击确认...");

            // 查找确认按钮
            const buttons = dialog.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.textContent.trim() === "确认" || btn.textContent.trim() === "确 认") {
                    // 稍微延时一点点，给人眼一个反应过程，也防止Vue状态没更新
                    setTimeout(() => {
                         btn.click();
                         isConfirmClicked = true; // 锁定，防止重复点击确认
                         console.log("已点击确认");
                    }, 500);
                    break;
                }
            }
        }
    }

    // --- 算法部分 ---
    function getTOTP(secret) {
        const epoch = Math.round(new Date().getTime() / 1000.0);
        const time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
        const key = base32tohex(secret);
        // eslint-disable-next-line no-undef
        const shaObj = new jsSHA("SHA-1", "HEX");
        shaObj.setHMACKey(key, "HEX");
        shaObj.update(time);
        const hmac = shaObj.getHMAC("HEX");
        const offset = hex2dec(hmac.substring(hmac.length - 1));
        let otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
        otp = (otp).substr(otp.length - 6, 6);
        return otp;
    }
    function base32tohex(base32) {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";
        for (let i = 0; i < base32.length; i++) {
            const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    }
    function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
    function hex2dec(s) { return parseInt(s, 16); }
    function leftpad(str, len, pad) {
        if (len + 1 >= str.length) {
            str = new Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
    }

})();