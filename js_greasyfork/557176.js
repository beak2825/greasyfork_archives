// ==UserScript==
// @name         海外支付类页面丨账单地址自动填写/解锁
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动检测全网所有 Stripe 支付页面自动填充免税区地址。
// @author       Gemini & ChatGPT指导员
// @license      V:chatgpt4v
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557176/%E6%B5%B7%E5%A4%96%E6%94%AF%E4%BB%98%E7%B1%BB%E9%A1%B5%E9%9D%A2%E4%B8%A8%E8%B4%A6%E5%8D%95%E5%9C%B0%E5%9D%80%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/557176/%E6%B5%B7%E5%A4%96%E6%94%AF%E4%BB%98%E7%B1%BB%E9%A1%B5%E9%9D%A2%E4%B8%A8%E8%B4%A6%E5%8D%95%E5%9C%B0%E5%9D%80%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // 1. 配置区域
    // ==============================
    const config = {
        fillEmail: false, // 是否覆盖邮箱
        email: "your_email@example.com",
    };

    // --- 账单地址 1 (默认地址 / 点击空白处使用的地址) ---
    const billingAddress1 = {
        name: "Kcgnrj Plitoy",
        line1: "5681 Pear Ln",
        city: "Miami",
        postal_code: "33128",
        state: "FL",
    };

    // --- 账单地址 2 (备用地址) ---
    const billingAddress2 = {
        name: "Garcia Jaban",
        line1: "86 Rinehart Road",
        city: "Miami",
        postal_code: "33128",
        state: "FL",
    };

    // ==============================
    // 2. 状态变量
    // ==============================
    let formLock = false;        // 是否检测到了表单
    let userSelectedInfo = null; // 用户选择了哪个地址 (null表示未选择)
    let isModalShowing = false;  // 弹窗是否正在显示

    // ==============================
    // 3. UI 界面逻辑 (新增：选择弹窗)
    // ==============================
    function showChoiceModal() {
        if (isModalShowing) return;
        isModalShowing = true;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; /* 提示可点击 */
        `;

        // 核心修改：点击遮罩层（空白处）自动选择默认地址
        overlay.onclick = (e) => {
            // 确保点击的是遮罩层本身，而不是里面的内容框
            if (e.target === overlay) {
                userSelectedInfo = billingAddress1; // 默认使用地址 1
                closeModal();
                console.log("[StripeBot] 用户点击空白处，自动应用默认地址 (地址 1)");
            }
        };

        // 创建内容框
        const box = document.createElement('div');
        box.style.cssText = `
            background: white; padding: 25px; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center;
            font-family: sans-serif; min-width: 320px;
            cursor: default; /* 恢复鼠标样式 */
        `;

        // 标题
        const title = document.createElement('h3');
        title.innerText = "🤖 检测到支付页面";
        title.style.cssText = "margin: 0 0 5px 0; color: #333; font-size: 18px;";

        // 提示信息
        const subTitle = document.createElement('p');

        // 按钮样式生成器
        const createBtnStyle = (color) => `
            display: block; width: 100%; padding: 12px; margin: 10px 0;
            border: none; border-radius: 6px; cursor: pointer;
            font-size: 16px; font-weight: bold; color: white;
            background: ${color}; transition: opacity 0.2s;
        `;

        // 按钮 1
        const btn1 = document.createElement('button');
        btn1.innerText = `使用 账单地址 1 (${billingAddress1.city}, ${billingAddress1.state})`;
        btn1.style.cssText = createBtnStyle('#007bff'); // 蓝色
        btn1.onclick = () => {
            userSelectedInfo = billingAddress1;
            closeModal();
            console.log("[StripeBot] 用户选择了地址 1");
        };

        // 按钮 2
        const btn2 = document.createElement('button');
        btn2.innerText = `使用 账单地址 2 (${billingAddress2.city}, ${billingAddress2.state})`;
        btn2.style.cssText = createBtnStyle('#28a745'); // 绿色
        btn2.onclick = () => {
            userSelectedInfo = billingAddress2;
            closeModal();
            console.log("[StripeBot] 用户选择了地址 2");
        };

        // 关闭按钮
        const btnClose = document.createElement('button');
        btnClose.innerText = "暂不填充 (手动填写)";
        btnClose.style.cssText = "margin-top: 10px; background: none; border: none; color: #999; cursor: pointer; text-decoration: underline;";
        btnClose.onclick = () => {
            // 用户选择手动，不再锁定，也不填充
            formLock = true; // 保持锁定状态防止重复弹窗，但不赋值
            userSelectedInfo = null;
            closeModal();
        };

        box.appendChild(title);
        box.appendChild(subTitle);
        box.appendChild(btn1);
        box.appendChild(btn2);
        box.appendChild(btnClose);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        function closeModal() {
            if(overlay && overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            isModalShowing = false;
        }
    }


    // ==============================
    // 4. 智能嗅探逻辑 (核心)
    // ==============================
    function isPaymentPage() {
        const url = location.href;
        const hostname = location.hostname;

        // 1. 白名单域名
        if (hostname.endsWith('.stripe.com')) return true;
        if (hostname === 'pay.openai.com') return true;

        // 2. 页面特征检测
        if (document.querySelector('.LOADING-container')) return true;
        if (document.querySelector('#Field-countryInput') || document.querySelector('#billingName')) return true;

        // 3. 标题关键词检测
        const title = document.title.toLowerCase();
        if (title.includes('checkout') || title.includes('payment') || title.includes('stripe')) return true;

        return false;
    }

    // ==============================
    // 5. 业务逻辑
    // ==============================

    const log = (msg) => console.log(`[StripeBot] ${msg}`);

    function isVisible(elem) {
        if (!elem) return false;
        const style = window.getComputedStyle(elem);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    function nativeInputValueSetter(el, value) {
        if (!el || el.value === value) return;
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        valueSetter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function nativeSelectValueSetter(el, value) {
        if (!el || el.value === value) return;
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function checkAndAct() {
        // --- 智能门卫 ---
        if (!isPaymentPage()) return;

        // --- 目标检测 ---
        const targetElement = document.querySelector('#billingName') ||
                              document.querySelector('#cardholderName') ||
                              document.querySelector('input[name="name"]') ||
                              document.querySelector('#Field-countryInput') ||
                              document.querySelector('#Field-addressLine1Input');

        // 检测到表单后，如果没锁且没弹过窗，则弹窗询问
        if (isVisible(targetElement)) {
            if (!formLock && !isModalShowing && !userSelectedInfo) {
                log(`>>> 发现支付表单，请求用户选择地址... <<<`);
                formLock = true; // 锁定防止重复弹窗
                showChoiceModal();
                return;
            }
        }

        // 只有当用户做出了选择 (userSelectedInfo 不为空) 时，才执行填充
        if (formLock && userSelectedInfo) {
            fillBillingForm(userSelectedInfo);
        } else {
            // 这里保留原逻辑：处理 "不用 Link 支付" 按钮
            if (location.hostname !== 'js.stripe.com') {
                const noLinkBtn = Array.from(document.querySelectorAll('button, a, span')).find(el => {
                    if (!isVisible(el)) return false;
                    const text = (el.innerText || "").toLowerCase();
                    return text.includes('不用 link 支付') ||
                           text.includes('pay without link') ||
                           text.includes('checkout as guest');
                });
                if (noLinkBtn) {
                    log("点击【不用 Link 支付/游客支付】...");
                    noLinkBtn.click();
                }
            }
        }
    }

    function fillBillingForm(info) {
        if (!info) return;

        // 1. 国家 (默认 US)
        const elCountry = document.querySelector('#billingCountry') ||
                          document.querySelector('select[name="billingCountry"]') ||
                          document.querySelector('#Field-countryInput');
        if (elCountry) nativeSelectValueSetter(elCountry, 'US');

        // 2. 姓名
        const elName = document.querySelector('#billingName') ||
                       document.querySelector('#cardholderName') ||
                       document.querySelector('input[name="name"]') ||
                       document.querySelector('#Field-nameInput');
        if (elName) nativeInputValueSetter(elName, info.name);

        // 3. 邮箱
        if (config.fillEmail) {
            const elEmail = document.querySelector('#email') || document.querySelector('#Field-emailInput');
            if (elEmail) nativeInputValueSetter(elEmail, config.email);
        }

        // 4. 地址行 1
        const elLine1 = document.querySelector('#billingAddressLine1') ||
                        document.querySelector('input[name="address[line1]"]') ||
                        document.querySelector('#Field-addressLine1Input');
        if (elLine1) nativeInputValueSetter(elLine1, info.line1);

        // 5. 城市
        const elCity = document.querySelector('#billingLocality') ||
                       document.querySelector('input[name="address[city]"]') ||
                       document.querySelector('#Field-localityInput');
        if (elCity) nativeInputValueSetter(elCity, info.city);

        // 6. 邮编
        const elZip = document.querySelector('#billingPostalCode') ||
                      document.querySelector('input[name="address[postal_code]"]') ||
                      document.querySelector('#Field-postalCodeInput');
        if (elZip) nativeInputValueSetter(elZip, info.postal_code);

        // 7. 州/省
        const elState = document.querySelector('#billingAdministrativeArea') ||
                        document.querySelector('#billingSubdivision') ||
                        document.querySelector('select[name="address[state]"]') ||
                        document.querySelector('#Field-administrativeAreaInput');

        if (elState && info.state) {
            nativeSelectValueSetter(elState, info.state);
        }

        // 8. 展开手动地址 (备用)
        if (!elLine1) {
             const manualEntryBtn = Array.from(document.querySelectorAll('button, a')).find(el => {
                if (!isVisible(el)) return false;
                const text = (el.innerText || "").toLowerCase();
                return text.includes("enter address manually") ||
                       text.includes("手动输入地址") ||
                       el.classList.contains('Button--checkoutSecondaryLink');
            });
            if (manualEntryBtn) manualEntryBtn.click();
        }

        // 9. 条款勾选
        const elCheckbox = document.querySelector('#termsOfServiceConsentCheckbox');
        if (elCheckbox && !elCheckbox.checked) elCheckbox.click();

        // 10. 强制激活 (解锁)
        const disabledInputs = document.querySelectorAll('input[disabled], select[disabled]');
        disabledInputs.forEach(input => {
             input.disabled = false;
             input.removeAttribute('disabled');
        });
    }

    // ==============================
    // 6. 启动
    // ==============================

    setInterval(checkAndAct, 1000);

    // URL 变化监听
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 页面跳转后重置状态，允许重新选择
            formLock = false;
            userSelectedInfo = null;
            isModalShowing = false;
            // 移除可能存在的旧弹窗
            const oldOverlay = document.querySelector('div[style*="z-index: 999999"]');
            if(oldOverlay) oldOverlay.remove();
        }
    }).observe(document, {subtree: true, childList: true});

})();