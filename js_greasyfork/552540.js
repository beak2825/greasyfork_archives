// ==UserScript==
// @name         auto gpt
// @namespace    http://tampermonkey.net/
// @version      2.4.4
// @author       PastKing
// @match        *://*/c/pay/*
// @match        https://buy.stripe.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @description  信用卡自动填写工具 - 支持可视化设置
// @downloadURL https://update.greasyfork.org/scripts/552540/auto%20gpt.user.js
// @updateURL https://update.greasyfork.org/scripts/552540/auto%20gpt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('信用卡自动填写脚本已启动');

    // ────────── 卡信息存储 ──────────
    const STORAGE_KEY = 'auto_gpt_card_info';
    const STORAGE_EXPIRY_KEY = 'auto_gpt_card_info_expiry';
    const EXPIRY_HOURS = 24; // 信息保存24小时

    // 从 localStorage 获取卡信息
    function getCardInfo() {
        try {
            const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
            if (expiry && new Date().getTime() > parseInt(expiry)) {
                // 信息已过期，清除
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(STORAGE_EXPIRY_KEY);
                return null;
            }

            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('获取卡信息失败:', error);
            return null;
        }
    }

    // 保存卡信息到 localStorage
    function saveCardInfo(info) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
            const expiryTime = new Date().getTime() + (EXPIRY_HOURS * 60 * 60 * 1000);
            localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
            console.log(`✅ 卡信息已保存（有效期${EXPIRY_HOURS}小时）`);
            return true;
        } catch (error) {
            console.error('保存卡信息失败:', error);
            return false;
        }
    }

    // 清除卡信息
    function clearCardInfo() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EXPIRY_KEY);
        console.log('🗑️ 卡信息已清除');
    }

    // ────────── 插入样式 ──────────
    GM_addStyle(`
        /* 一键输入按钮样式 - 深色主题 */
        #oneClickBtn {
            position: fixed !important;
            top: 15px !important;
            right: 140px !important;
            z-index: 999999 !important;
            padding: 12px 20px !important;
            border: 2px solid #00ff88 !important;
            border-radius: 8px !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #00ff88 !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow:
                0 4px 15px rgba(0, 255, 136, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5) !important;
            backdrop-filter: blur(10px) !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-width: 120px !important;
            text-align: center !important;
            user-select: none !important;
            outline: none !important;
            transform: translateZ(0) !important;
            will-change: transform, box-shadow !important;
        }

        #oneClickBtn:hover {
            background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%) !important;
            color: #000000 !important;
            border-color: #00ff88 !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow:
                0 8px 25px rgba(0, 255, 136, 0.4),
                0 0 20px rgba(0, 255, 136, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            text-shadow: none !important;
        }

        #oneClickBtn:active {
            transform: translateY(-1px) scale(1.02) !important;
            box-shadow:
                0 4px 15px rgba(0, 255, 136, 0.3),
                0 0 15px rgba(0, 255, 136, 0.4) !important;
        }

        /* 设置按钮样式 */
        #settingsBtn {
            position: fixed !important;
            top: 15px !important;
            right: 15px !important;
            z-index: 999999 !important;
            padding: 12px 20px !important;
            border: 2px solid #ff9500 !important;
            border-radius: 8px !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #ff9500 !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow:
                0 4px 15px rgba(255, 149, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            text-shadow: 0 0 10px rgba(255, 149, 0, 0.5) !important;
            backdrop-filter: blur(10px) !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-width: 100px !important;
            text-align: center !important;
            user-select: none !important;
            outline: none !important;
        }

        #settingsBtn:hover {
            background: linear-gradient(135deg, #ff9500 0%, #ff7a00 100%) !important;
            color: #000000 !important;
            border-color: #ff9500 !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow:
                0 8px 25px rgba(255, 149, 0, 0.4),
                0 0 20px rgba(255, 149, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            text-shadow: none !important;
        }

        /* 开通下一个按钮样式 */
        #nextBtn {
            position: fixed !important;
            top: 15px !important;
            right: 270px !important;
            z-index: 999999 !important;
            padding: 12px 20px !important;
            border: 2px solid #00a8ff !important;
            border-radius: 8px !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #00a8ff !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow:
                0 4px 15px rgba(0, 168, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            text-shadow: 0 0 10px rgba(0, 168, 255, 0.5) !important;
            backdrop-filter: blur(10px) !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-width: 120px !important;
            text-align: center !important;
            user-select: none !important;
            outline: none !important;
        }

        #nextBtn:hover {
            background: linear-gradient(135deg, #00a8ff 0%, #0080cc 100%) !important;
            color: #000000 !important;
            border-color: #00a8ff !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow:
                0 8px 25px rgba(0, 168, 255, 0.4),
                0 0 20px rgba(0, 168, 255, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            text-shadow: none !important;
        }

        /* 设置窗口样式 */
        #settingsModal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.8) !important;
            z-index: 9999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            backdrop-filter: blur(5px) !important;
        }

        #settingsModal.hidden {
            display: none !important;
        }

        .settings-content {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%) !important;
            border-radius: 10px !important;
            padding: 18px !important;
            width: 90% !important;
            max-width: 560px !important;
            box-shadow: 0 10px 50px rgba(0, 255, 136, 0.3) !important;
            border: 2px solid #00ff88 !important;
            color: #ffffff !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
        }

        .settings-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
            border-bottom: 2px solid #00ff88 !important;
        }

        .settings-header h2 {
            margin: 0 !important;
            color: #00ff88 !important;
            font-size: 18px !important;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5) !important;
        }

        .close-btn {
            background: transparent !important;
            border: none !important;
            color: #ff4444 !important;
            font-size: 22px !important;
            cursor: pointer !important;
            padding: 0 !important;
            width: 26px !important;
            height: 26px !important;
            line-height: 26px !important;
            text-align: center !important;
            transition: all 0.3s ease !important;
        }

        .close-btn:hover {
            color: #ff6666 !important;
            transform: rotate(90deg) !important;
        }

        .form-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
        }

        .form-group {
            margin-bottom: 0 !important;
        }

        .form-group.full-width {
            grid-column: 1 / -1 !important;
        }

        .form-group label {
            display: block !important;
            margin-bottom: 4px !important;
            color: #00ff88 !important;
            font-weight: 600 !important;
            font-size: 12px !important;
        }

        .form-group input,
        .form-group select {
            width: 100% !important;
            padding: 7px 9px !important;
            border: 2px solid #444 !important;
            border-radius: 5px !important;
            background: #1a1a1a !important;
            color: #ffffff !important;
            font-size: 12px !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
            transition: all 0.3s ease !important;
            box-sizing: border-box !important;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none !important;
            border-color: #00ff88 !important;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.3) !important;
        }

        .button-group {
            display: flex !important;
            gap: 10px !important;
            margin-top: 12px !important;
        }

        .btn {
            flex: 1 !important;
            padding: 9px 14px !important;
            border: 2px solid !important;
            border-radius: 6px !important;
            font-weight: 600 !important;
            font-size: 12px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif !important;
        }

        .btn-save {
            background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%) !important;
            color: #000000 !important;
            border-color: #00ff88 !important;
        }

        .btn-save:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4) !important;
        }

        .btn-clear {
            background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%) !important;
            color: #ffffff !important;
            border-color: #ff4444 !important;
        }

        .btn-clear:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4) !important;
        }

        .info-text {
            margin-top: 8px !important;
            padding: 7px !important;
            background: rgba(0, 255, 136, 0.1) !important;
            border-left: 3px solid #00ff88 !important;
            border-radius: 4px !important;
            color: #aaa !important;
            font-size: 10px !important;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            #oneClickBtn {
                top: 10px !important;
                right: 110px !important;
                padding: 10px 16px !important;
                font-size: 13px !important;
                min-width: 90px !important;
            }

            #settingsBtn {
                top: 10px !important;
                right: 10px !important;
                padding: 10px 16px !important;
                font-size: 13px !important;
                min-width: 80px !important;
            }

            #nextBtn {
                top: 60px !important;
                right: 10px !important;
                padding: 10px 16px !important;
                font-size: 13px !important;
                min-width: 100px !important;
            }

            .settings-content {
                padding: 12px !important;
                width: 95% !important;
                max-width: 95% !important;
            }

            .form-grid {
                grid-template-columns: 1fr !important;
            }

            .button-group {
                flex-direction: column !important;
                gap: 8px !important;
            }
        }

        /* 防止被其他样式覆盖 */
        #oneClickBtn *,
        #settingsBtn *,
        #nextBtn * {
            pointer-events: none !important;
        }
    `);

    // ────────── 状态变量 ──────────
    let oneClickBtn = null;
    let settingsBtn = null;
    let nextBtn = null;
    let settingsModal = null;
    let isCreating = false;

    // ────────── 辅助函数 ──────────
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function setNativeValue(element, value) {
        if (!element) return;

        const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
        if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }

        // 触发各种事件
        ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        await delay(100);
    }

    // 专门处理选择器的函数
    async function setSelectValue(selectElement, value) {
        if (!selectElement || selectElement.tagName !== 'SELECT') return false;

        // 检查选项是否存在
        const option = selectElement.querySelector(`option[value="${value}"]`);
        if (!option) {
            console.warn(`⚠️ 选择器中未找到值为 "${value}" 的选项`);
            return false;
        }

        // 设置选中值
        selectElement.value = value;

        // 触发各种事件
        const events = ['change', 'input', 'blur'];
        for (const eventType of events) {
            selectElement.dispatchEvent(new Event(eventType, { bubbles: true }));
            await delay(50);
        }

        // 验证是否设置成功
        const success = selectElement.value === value;
        console.log(`${success ? '✅' : '❌'} 选择器设置${success ? '成功' : '失败'}:`, {
            element: selectElement.id,
            targetValue: value,
            actualValue: selectElement.value,
            selectedText: selectElement.selectedOptions[0]?.textContent
        });

        return success;
    }

    // ────────── 设置窗口功能 ──────────
    function createSettingsModal() {
        if (settingsModal) return;

        // 默认卡信息
        const defaultCardInfo = {
            email: "abc@gpt.com",
            cardNumber: "1234567890",
            expiryDate: "11/31",
            cvv: "287",
            name: "John Doe",
            address: "131 Lupine Drive",
            city: "Torrington",
            postalCode: "82240",
            state: "WY",
            country: "US"
        };

        const cardInfo = getCardInfo() || defaultCardInfo;

        const modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'hidden';
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>卡信息设置</h2>
                    <button class="close-btn" type="button">×</button>
                </div>
                <form id="cardInfoForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>邮箱</label>
                            <input type="email" id="input_email" value="${cardInfo.email}" placeholder="example@gmail.com">
                        </div>
                        <div class="form-group">
                            <label>卡号</label>
                            <input type="text" id="input_cardNumber" value="${cardInfo.cardNumber}" placeholder="1234567890">
                        </div>
                        <div class="form-group">
                            <label>过期日期</label>
                            <input type="text" id="input_expiryDate" value="${cardInfo.expiryDate}" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" id="input_cvv" value="${cardInfo.cvv}" placeholder="123">
                        </div>
                        <div class="form-group full-width">
                            <label>持卡人姓名</label>
                            <input type="text" id="input_name" value="${cardInfo.name}" placeholder="John Doe">
                        </div>
                        <div class="form-group full-width">
                            <label>地址</label>
                            <input type="text" id="input_address" value="${cardInfo.address}" placeholder="123 Main St">
                        </div>
                        <div class="form-group">
                            <label>城市</label>
                            <input type="text" id="input_city" value="${cardInfo.city}" placeholder="New York">
                        </div>
                        <div class="form-group">
                            <label>邮编</label>
                            <input type="text" id="input_postalCode" value="${cardInfo.postalCode}" placeholder="10001">
                        </div>
                        <div class="form-group">
                            <label>州/省</label>
                            <input type="text" id="input_state" value="${cardInfo.state}" placeholder="NY">
                        </div>
                        <div class="form-group">
                            <label>国家</label>
                            <input type="text" id="input_country" value="${cardInfo.country}" placeholder="US">
                        </div>
                    </div>
                    <div class="info-text">
                        💡 信息保存${EXPIRY_HOURS}小时后自动清除
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn btn-save">保存</button>
                        <button type="button" class="btn btn-clear" id="clearBtn">清除</button>
                    </div>
                </form>
            </div>
        `;

        document.documentElement.appendChild(modal);
        settingsModal = modal;

        // 绑定事件
        const closeBtn = modal.querySelector('.close-btn');
        const form = modal.querySelector('#cardInfoForm');
        const clearBtn = modal.querySelector('#clearBtn');

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // 保存表单
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newInfo = {
                email: document.getElementById('input_email').value.trim(),
                cardNumber: document.getElementById('input_cardNumber').value.trim(),
                expiryDate: document.getElementById('input_expiryDate').value.trim(),
                cvv: document.getElementById('input_cvv').value.trim(),
                name: document.getElementById('input_name').value.trim(),
                address: document.getElementById('input_address').value.trim(),
                city: document.getElementById('input_city').value.trim(),
                postalCode: document.getElementById('input_postalCode').value.trim(),
                state: document.getElementById('input_state').value.trim(),
                country: document.getElementById('input_country').value.trim() || 'US'
            };

            if (saveCardInfo(newInfo)) {
                alert('✅ 卡信息已保存！');
                modal.classList.add('hidden');
            } else {
                alert('❌ 保存失败，请重试');
            }
        });

        // 清除数据
        clearBtn.addEventListener('click', () => {
            if (confirm('确定要清除所有保存的卡信息吗？')) {
                clearCardInfo();
                // 重置表单并设置默认值
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    if (input.id === 'input_country') {
                        input.value = 'US';
                    } else {
                        input.value = '';
                    }
                });
                alert('🗑️ 数据已清除');
            }
        });

        console.log('✅ 设置窗口创建成功');
    }

    function openSettings() {
        if (!settingsModal) {
            createSettingsModal();
        }
        settingsModal.classList.remove('hidden');
    }

    // ────────── 一键输入功能 ──────────
    async function oneClickFill() {
        console.log('🚀 开始执行一键输入功能');

        // 获取保存的卡信息
        const cardInfo = getCardInfo();
        if (!cardInfo) {
            alert('⚠️ 请先设置卡信息！\n点击右上角"设置"按钮进行配置。');
            openSettings();
            return;
        }

        // 显示加载状态
        if (oneClickBtn) {
            oneClickBtn.textContent = '填写中...';
            oneClickBtn.style.pointerEvents = 'none';
        }

        try {
            // 查找表单元素
            const fields = {
                email: document.querySelector('input[type="email"]') || document.getElementById('email'),
                cardNumber: document.getElementById('cardNumber'),
                cardExpiry: document.getElementById('cardExpiry'),
                cardCvc: document.getElementById('cardCvc'),
                billingName: document.getElementById('billingName'),
                billingAddressLine1: document.getElementById('billingAddressLine1'),
                billingLocality: document.getElementById('billingLocality'),
                billingPostalCode: document.getElementById('billingPostalCode'),
                billingAdministrativeArea: document.getElementById('billingAdministrativeArea'),
                billingCountry: document.getElementById('billingCountry'),
                termsCheckbox: document.getElementById('termsOfServiceConsentCheckbox')
            };

            console.log('📋 找到的表单字段:', fields);

            // 填写邮箱
            if (fields.email && cardInfo.email) {
                await setNativeValue(fields.email, cardInfo.email);
                console.log('✅ 邮箱已填写:', cardInfo.email);
            }

            // 填写卡号
            if (fields.cardNumber && cardInfo.cardNumber) {
                await setNativeValue(fields.cardNumber, cardInfo.cardNumber);
                console.log('✅ 卡号已填写:', cardInfo.cardNumber);
            }

            // 填写过期日期
            if (fields.cardExpiry && cardInfo.expiryDate) {
                await setNativeValue(fields.cardExpiry, cardInfo.expiryDate);
                console.log('✅ 过期日期已填写:', cardInfo.expiryDate);
            }

            // 填写CVV
            if (fields.cardCvc && cardInfo.cvv) {
                await setNativeValue(fields.cardCvc, cardInfo.cvv);
                console.log('✅ CVV已填写:', cardInfo.cvv);
            }

            // 填写姓名
            if (fields.billingName && cardInfo.name) {
                await setNativeValue(fields.billingName, cardInfo.name);
                console.log('✅ 姓名已填写:', cardInfo.name);
            }

            // 填写地址
            if (fields.billingAddressLine1 && cardInfo.address) {
                await setNativeValue(fields.billingAddressLine1, cardInfo.address);
                console.log('✅ 地址已填写:', cardInfo.address);
            }

            // 填写城市
            if (fields.billingLocality && cardInfo.city) {
                await setNativeValue(fields.billingLocality, cardInfo.city);
                console.log('✅ 城市已填写:', cardInfo.city);
            }

            // 填写邮政编码
            if (fields.billingPostalCode && cardInfo.postalCode) {
                await setNativeValue(fields.billingPostalCode, cardInfo.postalCode);
                console.log('✅ 邮政编码已填写:', cardInfo.postalCode);
            }

            // 填写国家（改为直接输入）
            if (fields.billingCountry && cardInfo.country) {
                await setNativeValue(fields.billingCountry, cardInfo.country);
                console.log('✅ 国家已填写:', cardInfo.country);
                await delay(200);
            }

            // 填写州/省（特别处理选择器）
            if (fields.billingAdministrativeArea && cardInfo.state) {
                const stateSuccess = await setSelectValue(fields.billingAdministrativeArea, cardInfo.state);
                if (stateSuccess) {
                    console.log('✅ 州/省已选择:', cardInfo.state);
                } else {
                    console.error('❌ 州/省选择失败');
                }
            }

            // 勾选服务条款复选框（使用 click 方法触发）
            if (fields.termsCheckbox && !fields.termsCheckbox.checked) {
                // 方法1：直接设置
                fields.termsCheckbox.checked = true;

                // 方法2：触发点击事件
                fields.termsCheckbox.click();
                await delay(100);

                // 方法3：触发多个事件确保生效
                ['change', 'input', 'click'].forEach(eventType => {
                    fields.termsCheckbox.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                await delay(200);

                // 验证是否勾选成功
                if (fields.termsCheckbox.checked) {
                    console.log('✅ 服务条款复选框已勾选');
                } else {
                    console.warn('⚠️ 服务条款复选框勾选可能失败，请手动检查');
                }
            }

            // 等待一下确保所有字段都已填写完成
            await delay(300);

            // 点击提交按钮
            const submitButton = document.querySelector('#payment-form > div > div > div > div.PaymentForm-confirmPaymentContainer.mt5.flex-item.width-grow > div > div:nth-child(3) > div > button');
            if (submitButton) {
                submitButton.click();
                console.log('✅ 已点击提交按钮');
            } else {
                console.warn('⚠️ 未找到提交按钮');
            }

            console.log('🎉 一键输入完成！');

            // 恢复按钮状态
            if (oneClickBtn) {
                oneClickBtn.textContent = '填写完成 ✓';
                oneClickBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
                oneClickBtn.style.color = '#000000';

                setTimeout(() => {
                    oneClickBtn.textContent = '一键输入';
                    oneClickBtn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                    oneClickBtn.style.color = '#00ff88';
                    oneClickBtn.style.pointerEvents = 'auto';
                }, 2000);
            }

        } catch (error) {
            console.error('❌ 一键输入时出错:', error);

            if (oneClickBtn) {
                oneClickBtn.textContent = '填写出错 ✗';
                oneClickBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
                oneClickBtn.style.color = '#ffffff';

                setTimeout(() => {
                    oneClickBtn.textContent = '一键输入';
                    oneClickBtn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                    oneClickBtn.style.color = '#00ff88';
                    oneClickBtn.style.pointerEvents = 'auto';
                }, 3000);
            }
        }
    }

    // ────────── 创建按钮 ──────────
    function createOneClickButton() {
        if (isCreating || oneClickBtn) return;

        isCreating = true;
        console.log('🔨 正在创建一键输入按钮...');

        try {
            oneClickBtn = document.createElement('button');
            oneClickBtn.id = 'oneClickBtn';
            oneClickBtn.textContent = '一键输入';
            oneClickBtn.type = 'button';

            // 添加到页面最前面
            document.documentElement.appendChild(oneClickBtn);

            // 绑定点击事件
            oneClickBtn.addEventListener('click', oneClickFill);

            // 防止事件冒泡
            oneClickBtn.addEventListener('mousedown', (e) => e.stopPropagation());
            oneClickBtn.addEventListener('mouseup', (e) => e.stopPropagation());

            console.log('✅ 一键输入按钮创建成功');

        } catch (error) {
            console.error('❌ 创建一键输入按钮失败:', error);
        } finally {
            isCreating = false;
        }
    }

    function createSettingsButton() {
        if (settingsBtn) return;

        console.log('🔨 正在创建设置按钮...');

        try {
            settingsBtn = document.createElement('button');
            settingsBtn.id = 'settingsBtn';
            settingsBtn.textContent = '设置';
            settingsBtn.type = 'button';

            // 添加到页面
            document.documentElement.appendChild(settingsBtn);

            // 绑定点击事件
            settingsBtn.addEventListener('click', openSettings);

            // 防止事件冒泡
            settingsBtn.addEventListener('mousedown', (e) => e.stopPropagation());
            settingsBtn.addEventListener('mouseup', (e) => e.stopPropagation());

            console.log('✅ 设置按钮创建成功');

        } catch (error) {
            console.error('❌ 创建设置按钮失败:', error);
        }
    }

    // ────────── 开通下一个功能 ──────────
    async function getAccessToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://chatgpt.com/api/auth/session',
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.accessToken);
                    } catch (error) {
                        console.error('❌ 解析 accessToken 失败:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('❌ 获取 accessToken 失败:', error);
                    reject(error);
                }
            });
        });
    }

    async function createCheckout(accessToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://chatgpt.com/backend-api/payments/checkout',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'oai-language': 'zh-CN'
                },
                data: JSON.stringify({
                    plan_name: 'chatgptteamplan',
                    team_plan_data: {
                        workspace_name: 'Team',
                        price_interval: 'month',
                        seat_quantity: 5
                    },
                    billing_details: {
                        country: 'US',
                        currency: 'USD'
                    },
                    cancel_url: 'https://chatgpt.com/?numSeats=5&selectedPlan=month&referrer=https%3A%2F%2Fauth.openai.com%2F#team-pricing-seat-selection',
                    promo_campaign: 'team-1-month-free',
                    checkout_ui_mode: 'redirect'
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('📦 API 响应数据:', data);
                        // API 返回的字段名是 url，不是 checkout_url
                        resolve(data.url);
                    } catch (error) {
                        console.error('❌ 解析 checkout URL 失败:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('❌ 创建 checkout 失败:', error);
                    reject(error);
                }
            });
        });
    }

    async function openNextCheckout() {
        console.log('🚀 开始开通下一个...');

        // 显示加载状态
        if (nextBtn) {
            nextBtn.textContent = '处理中...';
            nextBtn.style.pointerEvents = 'none';
        }

        try {
            // 获取 accessToken
            console.log('🔑 正在获取 accessToken...');
            const accessToken = await getAccessToken();
            console.log('✅ accessToken 获取成功');

            // 创建 checkout
            console.log('💳 正在创建 checkout...');
            const checkoutUrl = await createCheckout(accessToken);
            console.log('✅ checkout URL 创建成功:', checkoutUrl);

            // 打开新窗口
            window.open(checkoutUrl, '_blank');
            console.log('✅ 已在新窗口打开 checkout 页面');

            // 恢复按钮状态
            if (nextBtn) {
                nextBtn.textContent = '已打开 ✓';
                nextBtn.style.background = 'linear-gradient(135deg, #00a8ff 0%, #0080cc 100%)';
                nextBtn.style.color = '#000000';

                setTimeout(() => {
                    nextBtn.textContent = '开通下一个';
                    nextBtn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                    nextBtn.style.color = '#00a8ff';
                    nextBtn.style.pointerEvents = 'auto';
                }, 2000);
            }

        } catch (error) {
            console.error('❌ 开通下一个时出错:', error);
            alert('❌ 操作失败，请查看控制台了解详情');

            if (nextBtn) {
                nextBtn.textContent = '打开失败 ✗';
                nextBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
                nextBtn.style.color = '#ffffff';

                setTimeout(() => {
                    nextBtn.textContent = '开通下一个';
                    nextBtn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                    nextBtn.style.color = '#00a8ff';
                    nextBtn.style.pointerEvents = 'auto';
                }, 3000);
            }
        }
    }

    function createNextButton() {
        if (nextBtn) return;

        console.log('🔨 正在创建开通下一个按钮...');

        try {
            nextBtn = document.createElement('button');
            nextBtn.id = 'nextBtn';
            nextBtn.textContent = '开通下一个';
            nextBtn.type = 'button';

            // 添加到页面
            document.documentElement.appendChild(nextBtn);

            // 绑定点击事件
            nextBtn.addEventListener('click', openNextCheckout);

            // 防止事件冒泡
            nextBtn.addEventListener('mousedown', (e) => e.stopPropagation());
            nextBtn.addEventListener('mouseup', (e) => e.stopPropagation());

            console.log('✅ 开通下一个按钮创建成功');

        } catch (error) {
            console.error('❌ 创建开通下一个按钮失败:', error);
        }
    }

    // ────────── 监控按钮状态 ──────────
    function monitorButtons() {
        setInterval(() => {
            if (!document.getElementById('oneClickBtn')) {
                console.log('🔄 检测到一键输入按钮丢失，重新创建...');
                oneClickBtn = null;
                createOneClickButton();
            }
            if (!document.getElementById('settingsBtn')) {
                console.log('🔄 检测到设置按钮丢失，重新创建...');
                settingsBtn = null;
                createSettingsButton();
            }
            if (!document.getElementById('nextBtn')) {
                console.log('🔄 检测到开通下一个按钮丢失，重新创建...');
                nextBtn = null;
                createNextButton();
            }
        }, 3000);
    }

    // ────────── 初始化 ──────────
    function init() {
        console.log('🎯 脚本初始化开始...');

        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createOneClickButton();
                    createSettingsButton();
                    createNextButton();
                }, 500);
            });
        } else {
            setTimeout(() => {
                createOneClickButton();
                createSettingsButton();
                createNextButton();
            }, 500);
        }

        // 监控按钮状态
        monitorButtons();

        // 页面完全加载后再次检查
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!document.getElementById('oneClickBtn')) {
                    createOneClickButton();
                }
                if (!document.getElementById('settingsBtn')) {
                    createSettingsButton();
                }
                if (!document.getElementById('nextBtn')) {
                    createNextButton();
                }
            }, 1000);
        });

        console.log('🚀 脚本初始化完成');
    }

    // 启动脚本
    init();

    // ────────── 调试功能 ──────────
    window.debugAutoFillButton = function() {
        const btn = document.getElementById('oneClickBtn');
        console.log('🔍 一键输入按钮调试信息:');
        console.log('- 按钮元素:', btn);
        if (btn) {
            console.log('- 是否在DOM中:', document.contains(btn));
            console.log('- 位置信息:', btn.getBoundingClientRect());
            console.log('- 计算样式:', window.getComputedStyle(btn));
            console.log('- 父元素:', btn.parentElement);
        } else {
            console.log('❌ 按钮不存在，尝试重新创建...');
            oneClickBtn = null;
            createOneClickButton();
        }
    };

    window.debugSelectElement = function(elementId = 'billingAdministrativeArea') {
        const select = document.getElementById(elementId);
        console.log(`🔍 选择器调试信息 [${elementId}]:`);
        console.log('- 选择器元素:', select);
        if (select) {
            console.log('- 当前值:', select.value);
            console.log('- 所有选项:', Array.from(select.options).map(opt => ({
                value: opt.value,
                text: opt.textContent,
                selected: opt.selected
            })));
        }
    };

    window.debugCardInfo = function() {
        const info = getCardInfo();
        console.log('🔍 当前保存的卡信息:');
        if (info) {
            console.log(info);
            const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
            if (expiry) {
                const expiryDate = new Date(parseInt(expiry));
                console.log('⏰ 过期时间:', expiryDate.toLocaleString());
                const remainingHours = (parseInt(expiry) - new Date().getTime()) / (1000 * 60 * 60);
                console.log(`⏰ 剩余时间: ${remainingHours.toFixed(2)} 小时`);
            }
        } else {
            console.log('❌ 未找到保存的卡信息');
        }
    };

    window.clearCardData = function() {
        clearCardInfo();
        console.log('✅ 卡信息已手动清除');
    };

    console.log('✅ 脚本加载完成！');
    console.log('📝 调试命令:');
    console.log('- window.debugAutoFillButton() - 调试一键输入按钮');
    console.log('- window.debugSelectElement("elementId") - 调试选择器');
    console.log('- window.debugCardInfo() - 查看保存的卡信息');
    console.log('- window.clearCardData() - 手动清除卡信息');

})();
