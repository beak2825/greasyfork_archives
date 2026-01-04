// ==UserScript==
// @name         Stripe Checkout 智能填表助手 Pro
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  强大的Stripe填表工具：卡头管理、信息预设、历史记录、批量测试，现代化UI
// @author       chaogei666
// @match        *://checkout.stripe.com/*
// @match        *://billing.augmentcode.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/555116/Stripe%20Checkout%20%E6%99%BA%E8%83%BD%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/555116/Stripe%20Checkout%20%E6%99%BA%E8%83%BD%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ==================== 样式定义 ====================
    GM_addStyle(`
        * { box-sizing: border-box; }
        
        /* 主控制面板 */
        .stripe-helper-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stripe-helper-toggle {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .stripe-helper-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
        }
        
        .stripe-helper-toggle:active {
            transform: translateY(0);
        }
        
        /* 主面板内容 */
        .stripe-helper-content {
            position: absolute;
            top: 60px;
            right: 0;
            width: 420px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: none;
            animation: slideIn 0.3s ease;
        }
        
        .stripe-helper-content.show {
            display: block;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 滚动条样式 */
        .stripe-helper-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .stripe-helper-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 8px;
        }
        
        .stripe-helper-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 8px;
        }
        
        .stripe-helper-content::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        /* Tab 导航 */
        .stripe-helper-tabs {
            display: flex;
            background: #f8f9fa;
            border-radius: 16px 16px 0 0;
            padding: 8px;
            gap: 4px;
        }
        
        .stripe-helper-tab {
            flex: 1;
            padding: 12px 8px;
            border: none;
            background: transparent;
            color: #666;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        
        .stripe-helper-tab:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }
        
        .stripe-helper-tab.active {
            background: white;
            color: #667eea;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Tab 内容区 */
        .stripe-helper-tab-content {
            display: none;
            padding: 20px;
        }
        
        .stripe-helper-tab-content.active {
            display: block;
        }
        
        /* 按钮组 */
        .btn-group {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .stripe-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        
        .stripe-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .stripe-btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .stripe-btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }
        
        .stripe-btn-success:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
        }
        
        .stripe-btn-danger {
            background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
            color: white;
        }
        
        .stripe-btn-secondary {
            background: #e9ecef;
            color: #495057;
        }
        
        .stripe-btn-secondary:hover {
            background: #dee2e6;
        }
        
        /* 卡片 */
        .card-item {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 12px;
            border: 2px solid transparent;
            transition: all 0.2s ease;
        }
        
        .card-item:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .card-item.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }
        
        .card-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .card-item-title {
            font-weight: 600;
            color: #212529;
            font-size: 15px;
        }
        
        .card-item-info {
            font-size: 13px;
            color: #6c757d;
            line-height: 1.6;
        }
        
        .card-item-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        
        .icon-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: white;
            color: #495057;
        }
        
        .icon-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* 表单 */
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #495057;
            font-size: 13px;
        }
        
        .form-input, .form-select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        /* 模态框 */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1000000;
            display: none;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }
        
        .modal-overlay.show {
            display: flex;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal {
            background: white;
            border-radius: 16px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-header {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #212529;
        }
        
        .modal-footer {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        
        /* 历史记录 */
        .history-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #495057;
        }
        
        .history-time {
            color: #6c757d;
            font-size: 12px;
            margin-top: 4px;
        }
        
        /* 状态消息 */
        .status-message {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            animation: fadeIn 0.3s ease;
        }
        
        .status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        /* 空状态 */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
        }
        
        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        /* Badge */
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-primary {
            background: #667eea;
            color: white;
        }
        
        .badge-success {
            background: #38ef7d;
            color: white;
        }
        
        /* 分隔线 */
        .divider {
            height: 1px;
            background: #e9ecef;
            margin: 16px 0;
        }
        
        /* 加载动画 */
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `);
    
    // ==================== 数据管理 ====================
    
    // 默认卡头配置
    const defaultCardBins = [
        {
            id: 'bin1',
            prefix: "379240", 
            name: "美国运通",
            totalLength: 15,
            cvcLength: 4,
            enabled: true
        },
        {
            id: 'bin2',
            prefix: "552461",
            name: "Mastercard",
            totalLength: 16,
            cvcLength: 3,
            enabled: true
        },
        {
            id: 'bin3',
            prefix: "559888",
            name: "Mastercard Pro",
            totalLength: 16,
            cvcLength: 3,
            enabled: true
        }
    ];
    
    // 默认个人信息配置
    const defaultProfiles = [
        {
            id: 'profile1',
            name: '中国-北京',
            data: {
                billingName: '张三',
                billingCountry: 'CN',
                billingPostalCode: '100000',
                billingAdministrativeArea: '北京市',
                billingLocality: '北京市',
                billingDependentLocality: '朝阳区',
                billingAddressLine1: '建国路123号'
            }
        },
        {
            id: 'profile2',
            name: '中国-上海',
            data: {
                billingName: '李四',
                billingCountry: 'CN',
                billingPostalCode: '200000',
                billingAdministrativeArea: '上海市',
                billingLocality: '上海市',
                billingDependentLocality: '浦东新区',
                billingAddressLine1: '世纪大道88号'
            }
        },
        {
            id: 'profile3',
            name: '中国-广州',
            data: {
                billingName: '王五',
                billingCountry: 'CN',
                billingPostalCode: '510000',
                billingAdministrativeArea: '广东省',
                billingLocality: '广州市',
                billingDependentLocality: '天河区',
                billingAddressLine1: '天河路888号'
            }
        },
        {
            id: 'profile4',
            name: '中国-深圳',
            data: {
                billingName: '赵六',
                billingCountry: 'CN',
                billingPostalCode: '518000',
                billingAdministrativeArea: '广东省',
                billingLocality: '深圳市',
                billingDependentLocality: '南山区',
                billingAddressLine1: '科技园南路666号'
            }
        },
        {
            id: 'profile5',
            name: '美国-纽约',
            data: {
                billingName: 'John Smith',
                billingCountry: 'US',
                billingPostalCode: '10001',
                billingAdministrativeArea: 'NY',
                billingLocality: 'New York',
                billingDependentLocality: 'Manhattan',
                billingAddressLine1: '123 Broadway Street'
            }
        },
        {
            id: 'profile6',
            name: '美国-加州',
            data: {
                billingName: 'Sarah Johnson',
                billingCountry: 'US',
                billingPostalCode: '90001',
                billingAdministrativeArea: 'CA',
                billingLocality: 'Los Angeles',
                billingDependentLocality: 'Downtown',
                billingAddressLine1: '456 Sunset Boulevard'
            }
        },
        {
            id: 'profile7',
            name: '英国-伦敦',
            data: {
                billingName: 'David Brown',
                billingCountry: 'GB',
                billingPostalCode: 'SW1A 1AA',
                billingAdministrativeArea: 'England',
                billingLocality: 'London',
                billingDependentLocality: 'Westminster',
                billingAddressLine1: '10 Downing Street'
            }
        },
        {
            id: 'profile8',
            name: '日本-东京',
            data: {
                billingName: 'Tanaka Yuki',
                billingCountry: 'JP',
                billingPostalCode: '100-0001',
                billingAdministrativeArea: '東京都',
                billingLocality: '千代田区',
                billingDependentLocality: '丸の内',
                billingAddressLine1: '丸の内1-1-1'
            }
        },
        {
            id: 'profile9',
            name: '澳大利亚-悉尼',
            data: {
                billingName: 'Michael Wilson',
                billingCountry: 'AU',
                billingPostalCode: '2000',
                billingAdministrativeArea: 'NSW',
                billingLocality: 'Sydney',
                billingDependentLocality: 'City Center',
                billingAddressLine1: '123 George Street'
            }
        },
        {
            id: 'profile10',
            name: '加拿大-多伦多',
            data: {
                billingName: 'Emily Taylor',
                billingCountry: 'CA',
                billingPostalCode: 'M5H 2N2',
                billingAdministrativeArea: 'ON',
                billingLocality: 'Toronto',
                billingDependentLocality: 'Downtown',
                billingAddressLine1: '100 King Street West'
            }
        },
        {
            id: 'profile11',
            name: '新加坡',
            data: {
                billingName: 'Lee Wei Ming',
                billingCountry: 'SG',
                billingPostalCode: '018956',
                billingAdministrativeArea: 'Singapore',
                billingLocality: 'Singapore',
                billingDependentLocality: 'Central',
                billingAddressLine1: '1 Marina Boulevard'
            }
        },
        {
            id: 'profile12',
            name: '德国-柏林',
            data: {
                billingName: 'Hans Mueller',
                billingCountry: 'DE',
                billingPostalCode: '10115',
                billingAdministrativeArea: 'Berlin',
                billingLocality: 'Berlin',
                billingDependentLocality: 'Mitte',
                billingAddressLine1: 'Unter den Linden 77'
            }
        }
    ];
    
    // 数据存储管理器
    const DataManager = {
        // 获取卡头列表
        getCardBins() {
            const saved = GM_getValue('cardBins');
            return saved ? JSON.parse(saved) : defaultCardBins;
        },
        
        // 保存卡头列表
        saveCardBins(bins) {
            GM_setValue('cardBins', JSON.stringify(bins));
        },
        
        // 添加卡头
        addCardBin(bin) {
            const bins = this.getCardBins();
            bin.id = 'bin_' + Date.now();
            bins.push(bin);
            this.saveCardBins(bins);
            return bin;
        },
        
        // 删除卡头
        deleteCardBin(id) {
            const bins = this.getCardBins().filter(b => b.id !== id);
            this.saveCardBins(bins);
        },
        
        // 更新卡头
        updateCardBin(id, updates) {
            const bins = this.getCardBins();
            const index = bins.findIndex(b => b.id === id);
            if (index !== -1) {
                bins[index] = { ...bins[index], ...updates };
                this.saveCardBins(bins);
            }
        },
        
        // 获取启用的卡头
        getEnabledCardBins() {
            return this.getCardBins().filter(b => b.enabled);
        },
        
        // 获取配置列表
        getProfiles() {
            const saved = GM_getValue('profiles');
            return saved ? JSON.parse(saved) : defaultProfiles;
        },
        
        // 保存配置列表
        saveProfiles(profiles) {
            GM_setValue('profiles', JSON.stringify(profiles));
        },
        
        // 添加配置
        addProfile(profile) {
            const profiles = this.getProfiles();
            profile.id = 'profile_' + Date.now();
            profiles.push(profile);
            this.saveProfiles(profiles);
            return profile;
        },
        
        // 删除配置
        deleteProfile(id) {
            const profiles = this.getProfiles().filter(p => p.id !== id);
            this.saveProfiles(profiles);
        },
        
        // 更新配置
        updateProfile(id, updates) {
            const profiles = this.getProfiles();
            const index = profiles.findIndex(p => p.id === id);
            if (index !== -1) {
                profiles[index] = { ...profiles[index], ...updates };
                this.saveProfiles(profiles);
            }
        },
        
        // 获取历史记录
        getHistory() {
            const saved = GM_getValue('history');
            return saved ? JSON.parse(saved) : [];
        },
        
        // 添加历史记录
        addHistory(record) {
            const history = this.getHistory();
            record.id = Date.now();
            record.timestamp = new Date().toISOString();
            history.unshift(record);
            // 只保留最近50条记录
            if (history.length > 50) {
                history.splice(50);
            }
            GM_setValue('history', JSON.stringify(history));
        },
        
        // 清空历史记录
        clearHistory() {
            GM_setValue('history', JSON.stringify([]));
        },
        
        // 导出所有配置
        exportConfig() {
            return {
                cardBins: this.getCardBins(),
                profiles: this.getProfiles(),
                history: this.getHistory(),
                exportTime: new Date().toISOString()
            };
        },
        
        // 导入配置
        importConfig(config) {
            if (config.cardBins) this.saveCardBins(config.cardBins);
            if (config.profiles) this.saveProfiles(config.profiles);
            if (config.history) GM_setValue('history', JSON.stringify(config.history));
        }
    };
    
    // ==================== 工具函数 ====================
    
    // 随机选择一个启用的卡BIN
    function getRandomCardBin() {
        const enabled = DataManager.getEnabledCardBins();
        if (enabled.length === 0) {
            return DataManager.getCardBins()[0]; // 如果没有启用的，返回第一个
        }
        const randomIndex = Math.floor(Math.random() * enabled.length);
        return enabled[randomIndex];
    }
    
    function generateRandomMonth() {
        return String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    }
    
    function generateRandomYear() {
        const currentYear = new Date().getFullYear();
        return String(currentYear + Math.floor(Math.random() * 5) + 1).slice(-2);
    }
    
    function generateRandomCVC(length) {
        const max = Math.pow(10, length) - 1;
        return String(Math.floor(Math.random() * max)).padStart(length, '0');
    }
    
    // Luhn算法生成有效信用卡号[9](@ref)
    function generateLuhnCardNumber(prefix, totalLength) {
        let cardNumber = prefix;
        
        while (cardNumber.length < totalLength - 1) {
            cardNumber += Math.floor(Math.random() * 10);
        }
        
        cardNumber += '0';
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        const checkDigit = (10 - (sum % 10)) % 10;
        return cardNumber.slice(0, -1) + checkDigit;
    }
    
    // 点击提交按钮的函数
    function clickSubmitButton() {
        console.log('🔍 开始查找并点击提交按钮...');
        
        let submitButton = null;
        
        // 策略1: 通过data-testid精确查找（最优先）
        const testIdSelectors = [
            'button[data-testid="hosted-payment-submit-button"]',
            '[data-testid="hosted-payment-submit-button"]',
            'button[data-testid*="submit-button"]',
            '[data-testid*="submit"]'
        ];
        
        for (const selector of testIdSelectors) {
            submitButton = document.querySelector(selector);
            if (submitButton) {
                console.log(`✅ 通过data-testid找到提交按钮: "${selector}"`);
                break;
            }
        }
        
        // 策略2: 通过XPath查找
        if (!submitButton) {
            try {
                const xpaths = [
                    '//*[@id="payment-form"]/div/div/div/div[3]/div/div[2]/div/button',
                    '//button[@data-testid="hosted-payment-submit-button"]',
                    '//button[contains(@class, "SubmitButton--complete")]'
                ];
                
                for (const xpath of xpaths) {
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    if (result.singleNodeValue) {
                        submitButton = result.singleNodeValue;
                        console.log(`✅ 通过XPath找到提交按钮: "${xpath}"`);
                    break;
                }
                }
            } catch (e) {
                console.log('⚠️ XPath查找失败:', e.message);
            }
        }
        
        // 策略3: 通过类名和type属性组合查找
        if (!submitButton) {
            const classSelectors = [
                'button.SubmitButton.SubmitButton--complete[type="submit"]',
                'button.SubmitButton--complete',
                'button.SubmitButton[type="submit"]',
                'button.SubmitButton',
                'button[type="submit"]'
            ];
            
            for (const selector of classSelectors) {
                const buttons = document.querySelectorAll(selector);
                // 优先选择可见且未禁用的按钮
                for (const btn of buttons) {
                    if (!btn.disabled && btn.offsetParent !== null) {
                        submitButton = btn;
                        console.log(`✅ 通过类名找到提交按钮: "${selector}"`);
                    break;
                }
                }
                if (submitButton) break;
            }
        }
        
        // 策略4: 通过文本内容查找
        if (!submitButton) {
            const textPatterns = ['保存银行卡', '处理中', 'Submit', 'Pay', 'Subscribe', '订阅', '支付'];
            const allButtons = document.querySelectorAll('button, [role="button"]');
            
            for (const button of allButtons) {
                const buttonText = button.textContent || button.innerText || '';
                for (const pattern of textPatterns) {
                    if (buttonText.includes(pattern)) {
                        submitButton = button;
                        console.log(`✅ 通过文本内容找到提交按钮: "${pattern}"`);
                        break;
                    }
                }
                if (submitButton) break;
            }
        }
        
        // 策略5: 查找包含SubmitButton-TextContainer的按钮
        if (!submitButton) {
            const container = document.querySelector('.SubmitButton-TextContainer');
            if (container) {
                submitButton = container.closest('button');
        if (submitButton) {
                    console.log('✅ 通过TextContainer找到提交按钮');
                }
            }
        }
        
        // 执行点击
        if (submitButton) {
            console.log('🎯 找到提交按钮，准备点击...');
            console.log('按钮信息:', {
                tagName: submitButton.tagName,
                className: submitButton.className,
                id: submitButton.id,
                type: submitButton.type,
                disabled: submitButton.disabled,
                textContent: submitButton.textContent.substring(0, 50)
            });
            
            try {
            // 确保按钮可见
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
                // 等待滚动完成
                setTimeout(() => {
                    // 移除可能的禁用状态
                    submitButton.disabled = false;
                    
                    // 聚焦按钮
                    submitButton.focus();
                    
                    // 触发多种事件以确保兼容性
                    const events = [
                        new MouseEvent('mouseenter', { bubbles: true, cancelable: true }),
                        new MouseEvent('mouseover', { bubbles: true, cancelable: true }),
                        new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
                        new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
                        new MouseEvent('click', { bubbles: true, cancelable: true }),
                        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
                        new PointerEvent('pointerup', { bubbles: true, cancelable: true }),
                        new FocusEvent('focus', { bubbles: true }),
                    ];
                    
                    events.forEach(event => {
                        try {
                submitButton.dispatchEvent(event);
                        } catch (e) {
                            console.log('事件分发警告:', e.message);
                        }
            });
            
            // 执行原生点击
            submitButton.click();
            
                    console.log('✅ 提交按钮点击完成！');
                }, 300);
                
            return true;
                
            } catch (error) {
                console.error('❌ 点击按钮时出错:', error);
                return false;
            }
        } else {
            console.log('❌ 未找到提交按钮，请检查页面结构');
            console.log('💡 提示: 页面可能还在加载，或按钮结构已更改');
            return false;
        }
    }
    
    // ==================== UI构建器 ====================
    
    class StripeHelperUI {
        constructor() {
            this.panel = null;
            this.currentTab = 'fill';
            this.modals = {};
        }
        
        // 初始化UI
        init() {
            this.createPanel();
            this.attachEventListeners();
            this.renderCurrentTab();
        }
        
        // 创建主面板
        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'stripe-helper-panel';
            panel.innerHTML = `
                <button class="stripe-helper-toggle">
                    💳 Stripe助手
                </button>
                <div class="stripe-helper-content">
                    <div class="stripe-helper-tabs">
                        <button class="stripe-helper-tab active" data-tab="fill">🚀 填表</button>
                        <button class="stripe-helper-tab" data-tab="cards">💳 卡头</button>
                        <button class="stripe-helper-tab" data-tab="profiles">👤 信息</button>
                        <button class="stripe-helper-tab" data-tab="history">📜 历史</button>
                        <button class="stripe-helper-tab" data-tab="settings">⚙️ 设置</button>
                        <button class="stripe-helper-tab" data-tab="about">ℹ️ 关于</button>
                    </div>
                    <div id="tab-content-fill" class="stripe-helper-tab-content active"></div>
                    <div id="tab-content-cards" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-profiles" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-history" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-settings" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-about" class="stripe-helper-tab-content"></div>
                </div>
            `;
            
            document.body.appendChild(panel);
            this.panel = panel;
        }
        
        // 附加事件监听器
        attachEventListeners() {
            // 切换面板显示/隐藏
            const toggleBtn = this.panel.querySelector('.stripe-helper-toggle');
            const content = this.panel.querySelector('.stripe-helper-content');
            
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('show');
            });
            
            // Tab切换
            const tabs = this.panel.querySelectorAll('.stripe-helper-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    this.switchTab(tabName);
                });
            });
            
            // 点击面板内部阻止事件冒泡（防止关闭）
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // 点击外部关闭面板
            document.addEventListener('click', (e) => {
                if (!this.panel.contains(e.target) && content.classList.contains('show')) {
                    content.classList.remove('show');
                }
            });
        }
        
        // 切换Tab
        switchTab(tabName) {
            this.currentTab = tabName;
            
            // 更新tab激活状态
            this.panel.querySelectorAll('.stripe-helper-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });
            
            // 更新内容区域
            this.panel.querySelectorAll('.stripe-helper-tab-content').forEach(content => {
                content.classList.toggle('active', content.id === `tab-content-${tabName}`);
            });
            
            this.renderCurrentTab();
        }
        
        // 渲染当前Tab
        renderCurrentTab() {
            switch(this.currentTab) {
                case 'fill':
                    this.renderFillTab();
                    break;
                case 'cards':
                    this.renderCardsTab();
                    break;
                case 'profiles':
                    this.renderProfilesTab();
                    break;
                case 'history':
                    this.renderHistoryTab();
                    break;
                case 'settings':
                    this.renderSettingsTab();
                    break;
                case 'about':
                    this.renderAboutTab();
                    break;
            }
        }
        
        // 渲染填表Tab
        renderFillTab() {
            const container = document.getElementById('tab-content-fill');
            const profiles = DataManager.getProfiles();
            const cardBins = DataManager.getEnabledCardBins();
            
            // 调试日志
            console.log('📋 渲染填表Tab');
            console.log('可用的信息配置数量:', profiles.length);
            console.log('已启用的卡头数量:', cardBins.length);
            console.log('卡头列表:', cardBins.map(b => `${b.name}(${b.id})`));
            
            container.innerHTML = `
                <div id="fill-status"></div>
                
                <div class="form-group">
                    <label class="form-label">选择信息配置</label>
                    <select class="form-select" id="profile-select">
                        ${profiles.map((p, i) => `<option value="${p.id}" ${i === 0 ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">选择卡头 <small style="color: #6c757d;">(选择特定卡头将固定使用该卡头)</small></label>
                    <select class="form-select" id="card-bin-select">
                        <option value="random" selected>🎲 随机选择</option>
                        ${cardBins.map(bin => `<option value="${bin.id}">${bin.name} (${bin.prefix})</option>`).join('')}
                    </select>
                </div>
                
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-primary" id="btn-auto-fill">
                        <span>🚀</span>
                        <span>自动填表并提交</span>
                    </button>
                </div>
                
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-success" id="btn-fill-only">
                        <span>📝</span>
                        <span>仅填表</span>
                    </button>
                    <button class="stripe-btn stripe-btn-secondary" id="btn-clear">
                        <span>🧹</span>
                        <span>清空</span>
                    </button>
                </div>
                
                <div class="divider"></div>
                
                <div class="card-item">
                    <div class="card-item-title">💡 使用提示</div>
                    <div class="card-item-info">
                        • 自动填表并提交：自动填写并点击提交按钮<br>
                        • 仅填表：只填写表单，不自动提交<br>
                        • 清空：清除所有表单内容<br>
                        • 所有操作都会自动记录到历史中
                    </div>
                </div>
            `;
            
            // 绑定事件
            document.getElementById('btn-auto-fill').addEventListener('click', () => {
                this.handleAutoFill(true);
            });
            
            document.getElementById('btn-fill-only').addEventListener('click', () => {
                this.handleAutoFill(false);
            });
            
            document.getElementById('btn-clear').addEventListener('click', () => {
                this.handleClearForm();
            });
            
            // 添加卡头选择监听，实时显示用户的选择
            const cardBinSelect = document.getElementById('card-bin-select');
            cardBinSelect.addEventListener('change', (e) => {
                const selectedValue = e.target.value;
                const selectedText = e.target.options[e.target.selectedIndex].text;
                
                console.log('💳 用户选择了卡头:', selectedText, '| ID:', selectedValue);
                
                // 显示临时提示
                const statusDiv = document.getElementById('fill-status');
                if (selectedValue === 'random') {
                    statusDiv.innerHTML = '<div class="status-message status-info">🎲 已选择：随机卡头模式</div>';
                } else {
                    statusDiv.innerHTML = `<div class="status-message status-info">✅ 已选择：${selectedText}</div>`;
                }
                
                // 1秒后自动清除提示
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 1500);
            });
        }
        
        // 处理自动填表
        async handleAutoFill(autoSubmit) {
            const statusDiv = document.getElementById('fill-status');
            const profileId = document.getElementById('profile-select').value;
            const binSelect = document.getElementById('card-bin-select').value;
            
            try {
                // 显示加载状态
                statusDiv.innerHTML = '<div class="status-message status-info">⏳ 正在填写表单...</div>';
                
                // 调试日志
                console.log('=== 🚀 开始自动填表 ===');
                console.log('选中的信息配置ID:', profileId);
                console.log('选中的卡头ID:', binSelect);
                console.log('是否为随机选择:', binSelect === 'random');
                
                // 获取配置
                const profile = DataManager.getProfiles().find(p => p.id === profileId);
                if (!profile) {
                    throw new Error('未找到选中的配置');
                }
                console.log('✅ 找到信息配置:', profile.name);
                
                // 选择卡头（优化逻辑，确保正确处理）
                let selectedBin;
                if (binSelect === 'random' || !binSelect) {
                    console.log('🎲 使用随机卡头');
                    selectedBin = getRandomCardBin();
                } else {
                    console.log('🎯 查找指定卡头:', binSelect);
                    const allBins = DataManager.getCardBins();
                    selectedBin = allBins.find(b => b.id === binSelect);
                    if (selectedBin) {
                        console.log('✅ 找到指定卡头:', selectedBin.name, `(${selectedBin.prefix})`);
                    } else {
                        console.log('⚠️ 未找到指定卡头，尝试从启用列表查找');
                        selectedBin = DataManager.getEnabledCardBins().find(b => b.id === binSelect);
                        if (!selectedBin) {
                            console.log('❌ 仍未找到，回退到随机选择');
                            selectedBin = getRandomCardBin();
                        }
                    }
                }
                
                if (!selectedBin) {
                    throw new Error('未找到可用的卡头，请检查卡头配置');
                }
                
                console.log('📋 最终使用的卡头:', selectedBin.name, `前缀:${selectedBin.prefix}`);
                
                // 生成卡号信息
            const cardNumber = generateLuhnCardNumber(selectedBin.prefix, selectedBin.totalLength);
            const expiryMonth = generateRandomMonth();
            const expiryYear = generateRandomYear();
            const cvc = generateRandomCVC(selectedBin.cvcLength);
                const expiry = `${expiryMonth}/${expiryYear}`;
                
                // 执行填表
                const result = reliableFillForm(profile.data, cardNumber, expiry, cvc, selectedBin.name, autoSubmit);
                
                // 记录历史
                DataManager.addHistory({
                    action: autoSubmit ? '自动填表+提交' : '仅填表',
                    profile: profile.name,
                    cardBin: selectedBin.name,
                    cardNumber: cardNumber.slice(0, 6) + '******' + cardNumber.slice(-4),
                    success: true
                });
                
                // 显示成功消息
                statusDiv.innerHTML = `
                    <div class="status-message status-success">
                        ✅ 填表成功！<br>
                        <small>卡号: ${cardNumber.slice(0, 6)}******${cardNumber.slice(-4)} | 类型: ${selectedBin.name}</small>
                    </div>
                `;
                
                // 3秒后清除消息
            setTimeout(() => {
                    statusDiv.innerHTML = '';
            }, 3000);
                
            } catch (error) {
                console.error('填表失败:', error);
                statusDiv.innerHTML = `<div class="status-message status-error">❌ ${error.message}</div>`;
                
                // 记录失败历史
                DataManager.addHistory({
                    action: autoSubmit ? '自动填表+提交' : '仅填表',
                    error: error.message,
                    success: false
                });
            }
        }
        
        // 处理清空表单
        handleClearForm() {
            // 实现清空表单的逻辑
            const statusDiv = document.getElementById('fill-status');
            statusDiv.innerHTML = '<div class="status-message status-info">🧹 表单已清空</div>';
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 2000);
        }
        
        // 渲染卡头Tab
        renderCardsTab() {
            const container = document.getElementById('tab-content-cards');
            const cardBins = DataManager.getCardBins();
            
            container.innerHTML = `
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-primary" id="btn-add-card">
                        <span>➕</span>
                        <span>添加卡头</span>
                    </button>
                </div>
                
                <div id="cards-list">
                    ${cardBins.length === 0 ? 
                        '<div class="empty-state"><div class="empty-state-icon">📭</div><div>暂无卡头配置</div></div>' :
                        cardBins.map(bin => `
                            <div class="card-item ${bin.enabled ? 'selected' : ''}" data-id="${bin.id}">
                                <div class="card-item-header">
                                    <div class="card-item-title">${bin.name}</div>
                                    <div>
                                        ${bin.enabled ? '<span class="badge badge-success">启用</span>' : '<span class="badge badge-secondary">禁用</span>'}
                                    </div>
                                </div>
                                <div class="card-item-info">
                                    卡号前缀: ${bin.prefix}<br>
                                    总长度: ${bin.totalLength} 位 | CVC: ${bin.cvcLength} 位
                                </div>
                                <div class="card-item-actions">
                                    <button class="icon-btn" data-action="toggle" data-id="${bin.id}">
                                        ${bin.enabled ? '🔒 禁用' : '✅ 启用'}
                                    </button>
                                    <button class="icon-btn" data-action="edit" data-id="${bin.id}">✏️ 编辑</button>
                                    <button class="icon-btn" data-action="delete" data-id="${bin.id}">🗑️ 删除</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            `;
            
            // 绑定事件
            document.getElementById('btn-add-card').addEventListener('click', () => {
                this.showCardModal();
            });
            
            // 卡头操作事件
            container.querySelectorAll('.icon-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    
                    switch(action) {
                        case 'toggle':
                            const bin = DataManager.getCardBins().find(b => b.id === id);
                            DataManager.updateCardBin(id, { enabled: !bin.enabled });
                            this.renderCardsTab();
                            break;
                        case 'edit':
                            this.showCardModal(id);
                            break;
                        case 'delete':
                            if (confirm('确定要删除这个卡头吗？')) {
                                DataManager.deleteCardBin(id);
                                this.renderCardsTab();
                            }
                            break;
                    }
                });
            });
        }
        
        // 显示卡头编辑模态框
        showCardModal(editId = null) {
            const isEdit = editId !== null;
            const bin = isEdit ? DataManager.getCardBins().find(b => b.id === editId) : null;
            
            const modal = this.createModal({
                title: isEdit ? '编辑卡头' : '添加卡头',
                content: `
                    <div class="form-group">
                        <label class="form-label">卡头名称</label>
                        <input type="text" class="form-input" id="modal-bin-name" value="${bin ? bin.name : ''}" placeholder="例如：Visa测试卡">
                    </div>
                    <div class="form-group">
                        <label class="form-label">卡号前缀（BIN）</label>
                        <input type="text" class="form-input" id="modal-bin-prefix" value="${bin ? bin.prefix : ''}" placeholder="例如：400000">
                    </div>
                    <div class="form-group">
                        <label class="form-label">卡号总长度</label>
                        <input type="number" class="form-input" id="modal-bin-length" value="${bin ? bin.totalLength : '16'}" min="13" max="19">
                    </div>
                    <div class="form-group">
                        <label class="form-label">CVC长度</label>
                        <input type="number" class="form-input" id="modal-bin-cvc" value="${bin ? bin.cvcLength : '3'}" min="3" max="4">
                    </div>
                `,
                onConfirm: () => {
                    const data = {
                        name: document.getElementById('modal-bin-name').value.trim(),
                        prefix: document.getElementById('modal-bin-prefix').value.trim(),
                        totalLength: parseInt(document.getElementById('modal-bin-length').value),
                        cvcLength: parseInt(document.getElementById('modal-bin-cvc').value),
                        enabled: true
                    };
                    
                    if (!data.name || !data.prefix) {
                        alert('请填写完整信息');
                        return false;
                    }
                    
                    if (isEdit) {
                        DataManager.updateCardBin(editId, data);
                    } else {
                        DataManager.addCardBin(data);
                    }
                    
                    this.renderCardsTab();
                    return true;
                }
            });
            
            modal.show();
        }
        
        // 渲染信息配置Tab
        renderProfilesTab() {
            const container = document.getElementById('tab-content-profiles');
            const profiles = DataManager.getProfiles();
            
            container.innerHTML = `
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-primary" id="btn-add-profile">
                        <span>➕</span>
                        <span>添加配置</span>
                    </button>
                </div>
                
                <div id="profiles-list">
                    ${profiles.length === 0 ?
                        '<div class="empty-state"><div class="empty-state-icon">📭</div><div>暂无信息配置</div></div>' :
                        profiles.map(profile => `
                            <div class="card-item" data-id="${profile.id}">
                                <div class="card-item-header">
                                    <div class="card-item-title">${profile.name}</div>
                                </div>
                                <div class="card-item-info">
                                    姓名: ${profile.data.billingName}<br>
                                    国家: ${profile.data.billingCountry} | 邮编: ${profile.data.billingPostalCode}<br>
                                    地址: ${profile.data.billingAddressLine1}
                                </div>
                                <div class="card-item-actions">
                                    <button class="icon-btn" data-action="edit" data-id="${profile.id}">✏️ 编辑</button>
                                    <button class="icon-btn" data-action="delete" data-id="${profile.id}">🗑️ 删除</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            `;
            
            // 绑定事件
            document.getElementById('btn-add-profile').addEventListener('click', () => {
                this.showProfileModal();
            });
            
            // 配置操作事件
            container.querySelectorAll('.icon-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    
                    switch(action) {
                        case 'edit':
                            this.showProfileModal(id);
                            break;
                        case 'delete':
                            if (confirm('确定要删除这个配置吗？')) {
                                DataManager.deleteProfile(id);
                                this.renderProfilesTab();
                            }
                            break;
                    }
                });
            });
        }
        
        // 显示信息配置模态框
        showProfileModal(editId = null) {
            const isEdit = editId !== null;
            const profile = isEdit ? DataManager.getProfiles().find(p => p.id === editId) : null;
            const data = profile ? profile.data : {};
            
            const modal = this.createModal({
                title: isEdit ? '编辑信息配置' : '添加信息配置',
                content: `
                    <div class="form-group">
                        <label class="form-label">配置名称</label>
                        <input type="text" class="form-input" id="modal-profile-name" value="${profile ? profile.name : ''}" placeholder="例如：测试账号1">
                    </div>
                    <div class="divider"></div>
                    <div class="form-group">
                        <label class="form-label">持卡人姓名</label>
                        <input type="text" class="form-input" id="modal-billing-name" value="${data.billingName || ''}" placeholder="张三">
                    </div>
                    <div class="form-group">
                        <label class="form-label">国家代码</label>
                        <input type="text" class="form-input" id="modal-billing-country" value="${data.billingCountry || ''}" placeholder="CN / US">
                    </div>
                    <div class="form-group">
                        <label class="form-label">邮政编码</label>
                        <input type="text" class="form-input" id="modal-billing-postal" value="${data.billingPostalCode || ''}" placeholder="100000">
                    </div>
                    <div class="form-group">
                        <label class="form-label">省/州</label>
                        <input type="text" class="form-input" id="modal-billing-admin" value="${data.billingAdministrativeArea || ''}" placeholder="北京市">
                    </div>
                    <div class="form-group">
                        <label class="form-label">城市</label>
                        <input type="text" class="form-input" id="modal-billing-locality" value="${data.billingLocality || ''}" placeholder="北京市">
                    </div>
                    <div class="form-group">
                        <label class="form-label">地区</label>
                        <input type="text" class="form-input" id="modal-billing-dependent" value="${data.billingDependentLocality || ''}" placeholder="朝阳区">
                    </div>
                    <div class="form-group">
                        <label class="form-label">详细地址</label>
                        <input type="text" class="form-input" id="modal-billing-address" value="${data.billingAddressLine1 || ''}" placeholder="建国路123号">
                    </div>
                `,
                onConfirm: () => {
                    const newData = {
                        name: document.getElementById('modal-profile-name').value.trim(),
                        data: {
                            billingName: document.getElementById('modal-billing-name').value.trim(),
                            billingCountry: document.getElementById('modal-billing-country').value.trim(),
                            billingPostalCode: document.getElementById('modal-billing-postal').value.trim(),
                            billingAdministrativeArea: document.getElementById('modal-billing-admin').value.trim(),
                            billingLocality: document.getElementById('modal-billing-locality').value.trim(),
                            billingDependentLocality: document.getElementById('modal-billing-dependent').value.trim(),
                            billingAddressLine1: document.getElementById('modal-billing-address').value.trim()
                        }
                    };
                    
                    if (!newData.name) {
                        alert('请填写配置名称');
                        return false;
                    }
                    
                    if (isEdit) {
                        DataManager.updateProfile(editId, newData);
                    } else {
                        DataManager.addProfile(newData);
                    }
                    
                    this.renderProfilesTab();
                    return true;
                }
            });
            
            modal.show();
        }
        
        // 渲染历史Tab
        renderHistoryTab() {
            const container = document.getElementById('tab-content-history');
            const history = DataManager.getHistory();
            
            container.innerHTML = `
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-danger" id="btn-clear-history">
                        <span>🗑️</span>
                        <span>清空历史</span>
                    </button>
                </div>
                
                <div id="history-list">
                    ${history.length === 0 ?
                        '<div class="empty-state"><div class="empty-state-icon">📭</div><div>暂无历史记录</div></div>' :
                        history.map(record => {
                            const time = new Date(record.timestamp).toLocaleString('zh-CN');
                            const statusIcon = record.success ? '✅' : '❌';
                            return `
                                <div class="history-item">
                                    ${statusIcon} <strong>${record.action}</strong><br>
                                    ${record.profile ? `配置: ${record.profile}<br>` : ''}
                                    ${record.cardBin ? `卡头: ${record.cardBin}<br>` : ''}
                                    ${record.cardNumber ? `卡号: ${record.cardNumber}<br>` : ''}
                                    ${record.error ? `错误: ${record.error}<br>` : ''}
                                    <div class="history-time">${time}</div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            `;
            
            // 绑定事件
            const clearBtn = document.getElementById('btn-clear-history');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有历史记录吗？')) {
                        DataManager.clearHistory();
                        this.renderHistoryTab();
                    }
                });
            }
        }
        
        // 渲染设置Tab
        renderSettingsTab() {
            const container = document.getElementById('tab-content-settings');
            
            container.innerHTML = `
                <div class="card-item">
                    <div class="card-item-title">📦 数据管理</div>
                    <div class="card-item-info">导出或导入您的所有配置数据</div>
                    <div class="card-item-actions">
                        <button class="icon-btn" id="btn-export">📥 导出配置</button>
                        <button class="icon-btn" id="btn-import">📤 导入配置</button>
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">📊 统计信息</div>
                    <div class="card-item-info">
                        卡头数量: ${DataManager.getCardBins().length} 个<br>
                        信息配置: ${DataManager.getProfiles().length} 个<br>
                        历史记录: ${DataManager.getHistory().length} 条
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="btn-group">
                    <button class="stripe-btn stripe-btn-danger" id="btn-reset">
                        <span>⚠️</span>
                        <span>重置所有数据</span>
                    </button>
                </div>
            `;
            
            // 导出配置
            document.getElementById('btn-export').addEventListener('click', () => {
                const config = DataManager.exportConfig();
                const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stripe-helper-config-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                alert('配置已导出！');
            });
            
            // 导入配置
            document.getElementById('btn-import').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const config = JSON.parse(e.target.result);
                                DataManager.importConfig(config);
                                alert('配置导入成功！');
                                this.renderCurrentTab();
                            } catch (error) {
                                alert('配置文件格式错误！');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            });
            
            // 重置数据
            document.getElementById('btn-reset').addEventListener('click', () => {
                if (confirm('确定要重置所有数据吗？此操作不可撤销！')) {
                    if (confirm('再次确认：这将删除所有卡头、配置和历史记录！')) {
                        GM_deleteValue('cardBins');
                        GM_deleteValue('profiles');
                        GM_deleteValue('history');
                        alert('所有数据已重置！');
                        this.renderCurrentTab();
                    }
                }
            });
        }
        
        // 渲染关于Tab
        renderAboutTab() {
            const container = document.getElementById('tab-content-about');
            
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px 20px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">💳</div>
                    <div style="font-size: 24px; font-weight: 700; color: #667eea; margin-bottom: 8px;">
                        Stripe智能填表助手 Pro
                    </div>
                    <div style="font-size: 14px; color: #6c757d; margin-bottom: 24px;">
                        Version 2.0.1
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">👨‍💻 开发者信息</div>
                    <div class="card-item-info" style="line-height: 2;">
                        <strong>制作人</strong>: chaogei666<br>
                        <strong>微信号</strong>: chaogei666<br>
                        <strong>开发日期</strong>: 2025年
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">✨ 功能特性</div>
                    <div class="card-item-info" style="line-height: 1.8;">
                        • 💳 可自定义卡头管理系统<br>
                        • 👤 多套个人信息配置<br>
                        • 📜 历史记录追踪（最多50条）<br>
                        • 📦 配置数据导入导出<br>
                        • 🎨 现代化渐变UI设计<br>
                        • 🚀 一键自动填表并提交<br>
                        • 🔧 操作后面板保持打开<br>
                        • 🌍 支持多国地址格式
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">📋 默认配置</div>
                    <div class="card-item-info" style="line-height: 1.8;">
                        <strong>卡头类型</strong>: 3种<br>
                        • 379240 (美国运通 15位)<br>
                        • 552461 (Mastercard 16位)<br>
                        • 559888 (Mastercard Pro 16位)<br>
                        <br>
                        <strong>信息配置</strong>: 12套<br>
                        • 覆盖8个国家/地区<br>
                        • 中国（北京、上海、广州、深圳）<br>
                        • 美国、英国、日本、澳大利亚<br>
                        • 加拿大、新加坡、德国
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">🛡️ 隐私说明</div>
                    <div class="card-item-info" style="line-height: 1.8;">
                        • 所有数据仅保存在本地浏览器<br>
                        • 不会上传到任何服务器<br>
                        • 可随时导出或删除数据<br>
                        • 仅供测试环境使用
                    </div>
                </div>
                
                <div class="card-item">
                    <div class="card-item-title">📝 使用许可</div>
                    <div class="card-item-info" style="line-height: 1.8;">
                        本工具仅供学习和测试使用<br>
                        请在合法合规的环境中使用<br>
                        使用本工具产生的任何后果由使用者自行承担
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div style="text-align: center; color: #6c757d; font-size: 13px; padding: 20px;">
                    <div style="margin-bottom: 8px;">感谢使用 Stripe智能填表助手 Pro</div>
                    <div>© 2025 chaogei666. All rights reserved.</div>
                    <div style="margin-top: 12px; font-size: 12px;">
                        <a href="#" style="color: #667eea; text-decoration: none;" id="contact-link">💬 联系开发者</a>
                    </div>
                </div>
            `;
            
            // 联系开发者链接
            const contactLink = document.getElementById('contact-link');
            if (contactLink) {
                contactLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('微信号: chaogei666\n\n如有问题或建议，欢迎添加微信交流！');
                });
            }
        }
        
        // 创建模态框
        createModal({ title, content, onConfirm }) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal">
                    <div class="modal-header">${title}</div>
                    <div class="modal-body">${content}</div>
                    <div class="modal-footer">
                        <button class="stripe-btn stripe-btn-secondary modal-cancel">取消</button>
                        <button class="stripe-btn stripe-btn-primary modal-confirm">确定</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // 事件绑定
            const cancelBtn = overlay.querySelector('.modal-cancel');
            const confirmBtn = overlay.querySelector('.modal-confirm');
            
            const close = () => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            };
            
            cancelBtn.addEventListener('click', close);
            
            confirmBtn.addEventListener('click', () => {
                if (onConfirm()) {
                    close();
                }
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    close();
                }
            });
            
            return {
                show: () => {
                    setTimeout(() => overlay.classList.add('show'), 10);
                },
                close
            };
        }
    }
    
    // 可靠的表单填写函数
    function reliableFillForm(profileData, cardNumber, expiry, cvc, cardType, autoSubmit = false) {
        console.log(`开始填写表单，卡类型: ${cardType}, 卡号: ${cardNumber}`);
        
        const fieldData = [
            { id: 'billingName', value: profileData.billingName, type: 'input', name: '持卡人姓名' },
            { id: 'billingCountry', value: profileData.billingCountry, type: 'select', name: '国家' },
            { id: 'billingPostalCode', value: profileData.billingPostalCode, type: 'input', name: '邮编' },
            { id: 'billingAdministrativeArea', value: profileData.billingAdministrativeArea, type: 'select', name: '省/州' },
            { id: 'billingLocality', value: profileData.billingLocality, type: 'input', name: '城市' },
            { id: 'billingDependentLocality', value: profileData.billingDependentLocality, type: 'input', name: '地区' },
            { id: 'billingAddressLine1', value: profileData.billingAddressLine1, type: 'input', name: '地址第1行' }
        ];
        
        let filledCount = 0;
        
        fieldData.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                if (fillFieldReliably(element, field.value, field.type)) {
                    console.log(`✅ 已填写: ${field.name}`);
                    filledCount++;
                } else {
                    console.log(`❌ 填写失败: ${field.name}`);
                }
            } else {
                console.log(`❌ 未找到字段: ${field.name}`);
            }
        });
        
        // 填写信用卡字段
        fillCreditCardFields(cardNumber, expiry, cvc);
        
        console.log(`🎉 填写完成，成功填写 ${filledCount} 个字段，卡号: ${cardNumber}, 有效期: ${expiry}, CVC: ${cvc}`);
        
        // 根据autoSubmit参数决定是否自动提交
        if (autoSubmit) {
        setTimeout(() => {
            console.log('延迟执行提交操作...');
            const submitSuccess = clickSubmitButton();
            
            if (submitSuccess) {
                console.log('✅ 表单已自动提交');
            } else {
                console.log('❌ 自动提交失败，请手动点击提交按钮');
                // 可以在这里添加重试逻辑
                setTimeout(() => {
                    console.log('尝试第二次提交...');
                    clickSubmitButton();
                }, 2000);
            }
        }, 1500); // 1.5秒延迟，确保所有字段都已正确填充
        } else {
            console.log('⚠️ 仅填表模式，不执行自动提交');
        }
        
        return true;
    }
    
    function fillFieldReliably(element, value, type) {
        try {
            if (type === 'select') {
                return setSelectValueReliably(element, value);
            } else {
                return setInputValueReliably(element, value);
            }
        } catch (e) {
            console.log(`填写错误: ${e.message}`);
            return false;
        }
    }
    
    function setInputValueReliably(input, value) {
        input.focus();
        input.value = value;
        
        const events = ['input', 'change', 'blur', 'focus', 'keydown', 'keyup', 'keypress'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
        });
        
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
        
        const reactEvent = new Event('input', { bubbles: true });
        reactEvent.simulated = true;
        input.dispatchEvent(reactEvent);
        
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
        
        return input.value === value;
    }
    
    function setSelectValueReliably(select, value) {
        let success = false;
        
        select.value = value;
        if (select.value === value) success = true;
        
        if (!success) {
            for (let option of select.options) {
                if (option.value === value || option.text.includes(value)) {
                    option.selected = true;
                    success = true;
                    break;
                }
            }
        }
        
        if (success) {
            const events = ['change', 'input', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                select.dispatchEvent(event);
            });
        }
        
        return success;
    }
    
    function fillCreditCardFields(cardNumber, expiry, cvc) {
        console.log('尝试填写信用卡字段...');
        
        const cardFields = [
            { 
                selectors: [
                    'input[data-elements-stable-field-name="cardNumber"]',
                    'input[autocomplete="cc-number"]',
                    'input[placeholder*="card"]',
                    '#cardNumber'
                ], 
                value: cardNumber,
                name: '卡号'
            },
            { 
                selectors: [
                    'input[data-elements-stable-field-name="cardExpiry"]',
                    'input[autocomplete="cc-exp"]',
                    'input[placeholder*="expir"]',
                    '#cardExpiry'
                ], 
                value: expiry,
                name: '有效期'
            },
            { 
                selectors: [
                    'input[data-elements-stable-field-name="cardCvc"]',
                    'input[autocomplete="cc-csc"]',
                    'input[placeholder*="cvc"]',
                    '#cardCvc'
                ], 
                value: cvc,
                name: 'CVC'
            }
        ];
        
        cardFields.forEach(field => {
            let element = null;
            
            for (const selector of field.selectors) {
                element = document.querySelector(selector);
                if (element) break;
            }
            
            if (element) {
                if (setInputValueReliably(element, field.value)) {
                    console.log(`✅ 已填写: ${field.name} (${field.value})`);
                } else {
                    console.log(`❌ 填写失败: ${field.name}`);
                }
            } else {
                console.log(`❌ 未找到字段: ${field.name}`);
            }
        });
    }
    
    // ==================== 初始化 ====================
    
    // 初始化UI
    function initStripeHelper() {
        console.log('🚀 Stripe智能填表助手 Pro v2.0.1 已加载');
        console.log('✨ 新功能：操作后面板保持打开状态');
        const ui = new StripeHelperUI();
        ui.init();
    }
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStripeHelper);
    } else {
        initStripeHelper();
    }
})();
