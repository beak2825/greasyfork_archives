// ==UserScript==
// @name         Stripe 支付信息自动填写
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  根据实际字段名称自动填写 Stripe 支付表单
// @author       https://github.com/945967063
// @match        https://billing.augmentcode.com/c/pay*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augmentcode.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553066/Stripe%20%E6%94%AF%E4%BB%98%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/553066/Stripe%20%E6%94%AF%E4%BB%98%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置（可在“配置”面板修改并持久化到 localStorage）
    const DEFAULT_PAYMENT_INFO = {
        cardholderName: '张三',
        country: 'CN',
        postalCode: '100000',
        state: '北京市',
        city: '北京市',
        district: '朝阳区',
        addressLine1: '朝阳区建国路1号',
        addressLine2: '10层1001室',
        cardNumber: '4242 4242 4242 4242',
        cardExpiry: '12/34',
        cardCvc: '123'
    };

    const AFP_CFG_KEY = 'AFP_PAYMENT_INFO';
    function getConfig() {
        try {
            const raw = localStorage.getItem(AFP_CFG_KEY);
            if (!raw) return { ...DEFAULT_PAYMENT_INFO };
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_PAYMENT_INFO, ...parsed };
        } catch (_) {
            return { ...DEFAULT_PAYMENT_INFO };
        }
    }
    function setConfig(next) {
        try {
            localStorage.setItem(AFP_CFG_KEY, JSON.stringify(next));
            console.log('✅ 配置已保存');
        } catch (e) {
            console.warn('配置保存失败:', e);
        }
    }

    // 填写输入框（支持 React）
    function fillInput(el, value) {
        if (!el || !value) return;
        try {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {
            console.error('填写失败:', e);
        }
    }


    // 创建一个页面按钮用于手动触发和打开配置，避免样式受 CSP 影响，只用原生按钮
    const AFP_BUTTON_ID = 'afp-trigger-button';
    const AFP_CONFIG_BTN_ID = 'afp-config-button';
    const AFP_WIN_FLAG = '__AFP_BTN_ADDED__';
    const AFP_DIALOG_ID = 'afp-config-dialog';

    // 使用 GM_addStyle 注入样式（绕过 CSP）
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(`
/* 触发按钮样式 */
#${AFP_BUTTON_ID}, #${AFP_CONFIG_BTN_ID} {
    padding: 10px 20px;
    margin: 8px 4px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','PingFang SC','Microsoft YaHei',sans-serif;
}
#${AFP_BUTTON_ID} {
    background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
    color: #fff;
}
#${AFP_BUTTON_ID}:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102,126,234,.4);
}
#${AFP_BUTTON_ID}:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(102,126,234,.3);
}
#${AFP_CONFIG_BTN_ID} {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
}
#${AFP_CONFIG_BTN_ID}:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
#${AFP_CONFIG_BTN_ID}:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
}

/* 配置弹窗样式 */
#${AFP_DIALOG_ID} { padding: 0; border: none; max-width: none; background: transparent; }
#${AFP_DIALOG_ID}::backdrop { background: rgba(0,0,0,.5); backdrop-filter: blur(4px); }
#${AFP_DIALOG_ID} form { min-width: min(92vw,540px); max-width: 540px; padding: 0; border: none; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.3); font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','PingFang SC','Microsoft YaHei',sans-serif; background: #fff; }
#${AFP_DIALOG_ID} header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; border-radius: 12px 12px 0 0; }
#${AFP_DIALOG_ID} header strong { font-size: 18px; font-weight: 600; }
#${AFP_DIALOG_ID} header button { background: rgba(255,255,255,.2); border: none; color: #fff; font-size: 24px; line-height: 1; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: background .2s; }
#${AFP_DIALOG_ID} header button:hover { background: rgba(255,255,255,.3); }
#${AFP_DIALOG_ID} .afp-body { max-height: 60vh; overflow: auto; padding: 24px; }
#${AFP_DIALOG_ID} .afp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
#${AFP_DIALOG_ID} .afp-divider { border-top: 1px solid #e5e7eb; margin: 20px 0; padding-top: 20px; }
#${AFP_DIALOG_ID} .afp-card-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
#${AFP_DIALOG_ID} label { display: flex; flex-direction: column; gap: 6px; }
#${AFP_DIALOG_ID} label.full { margin-top: 16px; }
#${AFP_DIALOG_ID} label span { font-size: 13px; font-weight: 500; color: #374151; }
#${AFP_DIALOG_ID} input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: all .2s; }
#${AFP_DIALOG_ID} input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,.1); }
#${AFP_DIALOG_ID} menu { display: flex; gap: 12px; justify-content: flex-end; padding: 16px 24px; margin: 0; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 12px 12px; }
#${AFP_DIALOG_ID} menu button { padding: 10px 20px; border: 1px solid #d1d5db; background: #fff; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s; color: #374151; }
#${AFP_DIALOG_ID} menu button:hover { background: #f3f4f6; }
#${AFP_DIALOG_ID} menu button.primary { padding: 10px 24px; border: none; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; box-shadow: 0 4px 12px rgba(102,126,234,.3); }
#${AFP_DIALOG_ID} menu button.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,.4); }
        `);
    }

    function ensureConfigDialog() {
        if (document.getElementById(AFP_DIALOG_ID)) return;
        const cfg = getConfig();
        const dlg = document.createElement('dialog');
        dlg.id = AFP_DIALOG_ID;
        dlg.innerHTML = `
  <form method="dialog">
    <header>
      <strong>自动填写配置</strong>
      <button value="cancel" aria-label="关闭">×</button>
    </header>
    <div class="afp-body">
      <div class="afp-grid">
        <label><span>卡号</span><input id="afp_card" value="${cfg.cardNumber}"></label>
        <label><span>到期(MM/YY)</span><input id="afp_exp" value="${cfg.cardExpiry}"></label>  
        <label><span>CVC</span><input id="afp_cvc" value="${cfg.cardCvc}"></label>
        <label><span>持卡人姓名</span><input id="afp_name" value="${cfg.cardholderName}"></label>
        <label><span>国家(代码)</span><input id="afp_country" value="${cfg.country}"></label>
        <label><span>邮编</span><input id="afp_postal" value="${cfg.postalCode}"></label>
        <label><span>省/州</span><input id="afp_state" value="${cfg.state}"></label>
        <label><span>城市</span><input id="afp_city" value="${cfg.city}"></label>
        <label><span>地区</span><input id="afp_district" value="${cfg.district}"></label>
        <label><span>地址1</span><input id="afp_addr1" value="${cfg.addressLine1}"></label>
        <label><span>地址2</span><input id="afp_addr2" value="${cfg.addressLine2}"></label>
      </div>
    </div>
    <menu>
      <button value="cancel">取消</button>
      <button id="afp_save_btn" value="default" class="primary">保存</button>
    </menu>
  </form>`;
        document.body.appendChild(dlg);

        dlg.querySelector('#afp_save_btn').addEventListener('click', (e) => {
            e.preventDefault();
            const next = {
                cardholderName: dlg.querySelector('#afp_name').value.trim(),
                country: dlg.querySelector('#afp_country').value.trim(),
                postalCode: dlg.querySelector('#afp_postal').value.trim(),
                state: dlg.querySelector('#afp_state').value.trim(),
                city: dlg.querySelector('#afp_city').value.trim(),
                district: dlg.querySelector('#afp_district').value.trim(),
                addressLine1: dlg.querySelector('#afp_addr1').value.trim(),
                addressLine2: dlg.querySelector('#afp_addr2').value.trim(),
                cardNumber: dlg.querySelector('#afp_card').value.trim(),
                cardExpiry: dlg.querySelector('#afp_exp').value.trim(),
                cardCvc: dlg.querySelector('#afp_cvc').value.trim(),
            };
            setConfig(next);
            dlg.close();
        });
    }

    // 打开配置弹窗
    function openConfigModal() {
        ensureConfigDialog();
        const dlg = document.getElementById(AFP_DIALOG_ID);
        if (dlg && typeof dlg.showModal === 'function') {
            dlg.showModal();
        }
    }

    function createTriggerButton() {
        try {
            if (window[AFP_WIN_FLAG]) return;
            const container = document.getElementById('cardForm-fieldset') || document.body;
            if (!container) return;

            // 自动填写按钮
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = AFP_BUTTON_ID;
            btn.textContent = '自动填写';
            btn.addEventListener('click', () => autoFillPaymentForm());

            // 配置按钮
            const cfgBtn = document.createElement('button');
            cfgBtn.type = 'button';
            cfgBtn.id = AFP_CONFIG_BTN_ID;
            cfgBtn.textContent = '配置';
            cfgBtn.addEventListener('click', () => openConfigModal());

            container.insertBefore(cfgBtn, container.firstChild);
            container.insertBefore(btn, container.firstChild);
            window[AFP_WIN_FLAG] = true;
        } catch (err) {
            console.warn('添加按钮失败：', err);
        }
    }

    // 选择下拉框
    function selectOption(el, value) {
        if (!el || !value) return;
        const opt = Array.from(el.options).find(o =>
            o.value === value || o.value.toUpperCase() === value.toUpperCase() || o.text.includes(value)
        );
        if (opt) {
            el.value = opt.value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // 等待元素
    function waitForElement(selector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) resolve(el);
                else if (Date.now() - start > timeout) reject();
                else setTimeout(check, 50);
            };
            check();
        });
    }

    // 主填写函数
    async function autoFillPaymentForm() {
        try {
            const cfg = getConfig();
            await waitForElement('input, select');

            // 填写持卡人姓名
            const nameInput = document.querySelector('input[name*="name"], input[autocomplete="cc-name"]');
            if (nameInput) fillInput(nameInput, cfg.cardholderName);

            // 选择国家
            const countrySelect = document.querySelector('#billingCountry, select[name="billingCountry"]');
            if (countrySelect) {
                selectOption(countrySelect, cfg.country);
                try { await waitForElement('#billingAdministrativeArea', 1000); } catch (_) { }
            }

            // 填写邮编
            const postalInput = document.querySelector('#billingPostalCode, input[name="billingPostalCode"]');
            if (postalInput) fillInput(postalInput, cfg.postalCode);

            // 选择省/州
            const stateSelect = document.querySelector('#billingAdministrativeArea, select[name="billingAdministrativeArea"]');
            if (stateSelect) selectOption(stateSelect, cfg.state);

            // 填写城市
            const cityInput = document.querySelector('#billingLocality, input[name="billingLocality"]');
            if (cityInput) fillInput(cityInput, cfg.city);

            // 填写地区
            const districtInput = document.querySelector('#billingDependentLocality, input[name="billingDependentLocality"]');
            if (districtInput) fillInput(districtInput, cfg.district);

            // 填写地址1
            const address1Input = document.querySelector('#billingAddressLine1, input[name="billingAddressLine1"]');
            if (address1Input) fillInput(address1Input, cfg.addressLine1);

            // 填写地址2
            const address2Input = document.querySelector('#billingAddressLine2, input[name="billingAddressLine2"]');
            if (address2Input) fillInput(address2Input, cfg.addressLine2);

            // 填写银行卡信息
            const cardNumberInput = document.querySelector('#cardNumber, input[name="cardNumber"][autocomplete="cc-number"]');
            if (cardNumberInput) fillInput(cardNumberInput, cfg.cardNumber);

            const cardExpiryInput = document.querySelector('#cardExpiry, input[name="cardExpiry"][autocomplete="cc-exp"]');
            if (cardExpiryInput) fillInput(cardExpiryInput, cfg.cardExpiry);

            const cardCvcInput = document.querySelector('#cardCvc, input[name="cardCvc"][autocomplete="cc-csc"]');
            if (cardCvcInput) fillInput(cardCvcInput, cfg.cardCvc);

        } catch (error) {
            console.error('填写失败:', error);
        }
    }

    // 页面加载后仅创建按钮，不自动执行（每个窗口独立）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createTriggerButton();
        });
    } else {
        createTriggerButton();
    }

    // 添加快捷键 Ctrl+Shift+F 手动触发
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            console.log('🔄 手动触发自动填写...');
            autoFillPaymentForm();
        }
    });

    // 暴露到全局，方便控制台调用
    window.autoFillPaymentForm = autoFillPaymentForm;

    console.log('💡 提示：按 Ctrl+Shift+F 可手动触发填写');
})();

