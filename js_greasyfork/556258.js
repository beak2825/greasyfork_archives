// ==UserScript==
// @name         一键填充手机号
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  支持在界面上需要输入手机号的地方一键填充手机号
// @author       Moodles
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556258/%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85%E6%89%8B%E6%9C%BA%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/556258/%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85%E6%89%8B%E6%9C%BA%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "my_auto_phone_number";
    const isTopWindow = (window.self === window.top);

    let isClosedByUser = false;

    // ==============================
    // 1. 配置逻辑
    // ==============================
    function getOrAskPhoneNumber() {
        let phone = GM_getValue(STORAGE_KEY, "");
        if (!phone) {
            if (isTopWindow) {
                phone = prompt("请输入要自动填充的手机号：");
                if (phone && phone.trim()) {
                    GM_setValue(STORAGE_KEY, phone.trim());
                }
            } else {
                alert("请在网页主界面点击油猴菜单设置手机号");
                return null;
            }
        }
        return phone;
    }

    if (isTopWindow) {
        GM_registerMenuCommand("⚙️ 设置/修改手机号", () => {
            const current = GM_getValue(STORAGE_KEY, "");
            const input = prompt("请输入新的手机号：", current);
            if (input !== null) GM_setValue(STORAGE_KEY, input.trim());
        });
    }

    // ==============================
    // 2. 智能识别逻辑
    // ==============================
    function isCaptchaOrVerifyCode(input) {
        if (input.maxLength > 0 && input.maxLength < 11) return true;

        const attributes = (
            (input.name || "") +
            (input.id || "") +
            (input.className || "") +
            (input.placeholder || "")
        ).toLowerCase();

        const blackList = ["code", "verify", "captcha", "digits", "auth", "pass", "pwd", "验证码", "search", "搜索"];
        return blackList.some(keyword => attributes.includes(keyword));
    }

    function isPhoneInput(input) {
        if (input.offsetParent === null) return false;
        if (isCaptchaOrVerifyCode(input)) return false;

        const type = (input.type || "").toLowerCase();
        const attrStr = (
            (input.name || "") +
            (input.id || "") +
            (input.placeholder || "")
        ).toLowerCase();

        if (type === 'tel') return true;
        const whiteList = ['mobile', 'phone', 'user', 'tel', '手机', '账号', '登录'];
        if (whiteList.some(key => attrStr.includes(key))) return true;

        return false;
    }

    function findValidInput() {
        const inputs = document.querySelectorAll('input');
        for (let input of inputs) {
            if (isPhoneInput(input)) return true;
        }
        return false;
    }

    // ==============================
    // 3. 填充逻辑
    // ==============================
    function fillPhoneNumber() {
        const phone = getOrAskPhoneNumber();
        if (!phone) return;

        const inputs = document.querySelectorAll('input');
        let hasFilled = false;

        for (let input of inputs) {
            if (hasFilled) break;
            if (isPhoneInput(input)) {
                simulateInput(input, phone);
                hasFilled = true;
                input.style.backgroundColor = "#e8f0fe";
                input.style.transition = "background-color 0.5s";
                setTimeout(() => input.style.backgroundColor = "", 1000);
            }
        }

        if (!hasFilled) {
            const active = document.activeElement;
            if (active && active.tagName === "INPUT") {
                 simulateInput(active, phone);
            }
        }
    }

    function simulateInput(element, value) {
        element.focus();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, value);
        ['input', 'change', 'blur'].forEach(type => {
            element.dispatchEvent(new Event(type, { bubbles: true }));
        });
    }

    // ==============================
    // 4. 界面 UI
    // ==============================
    function createButton() {
        if (isClosedByUser) return;

        if (document.getElementById('tm-auto-fill-container')) return;
        if (!findValidInput()) return;

        const container = document.createElement('div');
        container.id = 'tm-auto-fill-container';
        Object.assign(container.style, {
            position: "fixed", bottom: "20px", left: "20px", zIndex: "2147483647",
            width: "40px", height: "40px", cursor: "pointer", userSelect: "none",
            fontFamily: "sans-serif"
        });

        const mainBtn = document.createElement('div');
        Object.assign(mainBtn.style, {
            width: "100%", height: "100%", borderRadius: "50%",
            backgroundColor: "#3b82f6", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.1s, opacity 0.2s"
        });
        mainBtn.innerText = "📱";
        mainBtn.title = "点击填充手机号";

        container.onmouseenter = () => mainBtn.style.transform = "scale(1.05)";
        container.onmouseleave = () => mainBtn.style.transform = "scale(1)";

        mainBtn.onclick = (e) => {
            e.stopPropagation();
            fillPhoneNumber();
        };

        const closeBtn = document.createElement('div');
        closeBtn.innerText = "×";
        closeBtn.title = "关闭此按钮";
        Object.assign(closeBtn.style, {
            position: "absolute", top: "-5px", right: "-5px",
            width: "16px", height: "16px", borderRadius: "50%",
            backgroundColor: "#ef4444", color: "white",
            fontSize: "12px", fontWeight: "bold", lineHeight: "14px", textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "none"
        });

        container.onmouseenter = () => {
            mainBtn.style.transform = "scale(1.05)";
            closeBtn.style.display = "block";
        };
        container.onmouseleave = () => {
            mainBtn.style.transform = "scale(1)";
            closeBtn.style.display = "none";
        };

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            isClosedByUser = true;
            container.remove();
        };

        container.appendChild(mainBtn);
        container.appendChild(closeBtn);
        document.body.appendChild(container);
    }

    const observer = new MutationObserver(() => {
        // Observer 触发时，先检查用户是不是之前关掉过
        if (!isClosedByUser && !document.getElementById('tm-auto-fill-container')) {
             createButton();
        }
    });

    window.addEventListener('load', () => {
        createButton();
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();