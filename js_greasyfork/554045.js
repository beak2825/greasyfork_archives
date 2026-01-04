// ==UserScript==
// @name         Stripe Checkout 智能填表助手 Pro
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  强大的Stripe填表工具：卡头管理、Augment自动注册、Session Cookie提取、信息预设、历史记录
// @author       chaogei666
// @match        *://checkout.stripe.com/*
// @match        *://billing.augmentcode.com/*
// @match        *://auth.augmentcode.com/*
// @match        *://*.augmentcode.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      tempmail.plus
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554045/Stripe%20Checkout%20%E6%99%BA%E8%83%BD%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554045/Stripe%20Checkout%20%E6%99%BA%E8%83%BD%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ==================== 样式定义 ====================
    GM_addStyle(`
        /* 仅对脚本内部元素应用box-sizing，避免影响其他网页 */
        .stripe-helper-panel,
        .stripe-helper-panel * {
            box-sizing: border-box !important;
        }
        
        /* 主控制面板 - 使用!important确保不被覆盖 */
        .stripe-helper-panel {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            pointer-events: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
        }
        
        /* 确保面板不被隐藏或移除 */
        .stripe-helper-panel[data-stripe-helper="true"] {
            display: block !important;
            visibility: visible !important;
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
        .sh-btn-group {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .sh-btn {
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
        
        .sh-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .sh-btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .sh-btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }
        
        .sh-btn-success:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
        }
        
        .sh-btn-danger {
            background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
            color: white;
        }
        
        .sh-btn-secondary {
            background: #e9ecef;
            color: #495057;
        }
        
        .sh-btn-secondary:hover {
            background: #dee2e6;
        }
        
        /* 卡片 */
        .sh-card-item {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 12px;
            border: 2px solid transparent;
            transition: all 0.2s ease;
        }
        
        .sh-card-item:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .sh-card-item.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }
        
        .sh-card-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .sh-card-item-title {
            font-weight: 600;
            color: #212529;
            font-size: 15px;
        }
        
        .sh-card-item-info {
            font-size: 13px;
            color: #6c757d;
            line-height: 1.6;
        }
        
        .sh-card-item-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        
        .sh-icon-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: white;
            color: #495057;
        }
        
        .sh-icon-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* 表单 */
        .sh-form-group {
            margin-bottom: 16px;
        }
        
        .sh-form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #495057;
            font-size: 13px;
        }
        
        .sh-form-input, .sh-form-select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .sh-form-input:focus, .sh-form-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        /* 模态框 */
        .sh-modal-overlay {
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
            animation: sh-fadeIn 0.2s ease;
        }
        
        .sh-modal-overlay.show {
            display: flex;
        }
        
        @keyframes sh-fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .sh-modal {
            background: white;
            border-radius: 16px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            animation: sh-modalSlideIn 0.3s ease;
        }
        
        @keyframes sh-modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .sh-modal-header {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #212529;
        }
        
        .sh-modal-body {
            margin-bottom: 20px;
        }
        
        .sh-modal-footer {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        
        /* 历史记录 */
        .sh-history-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #495057;
        }
        
        .sh-history-time {
            color: #6c757d;
            font-size: 12px;
            margin-top: 4px;
        }
        
        /* 状态消息 */
        .sh-status-message {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            animation: sh-fadeIn 0.3s ease;
        }
        
        .sh-status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .sh-status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .sh-status-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        /* 空状态 */
        .sh-empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
        }
        
        .sh-empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        /* Badge */
        .sh-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .sh-badge-primary {
            background: #667eea;
            color: white;
        }
        
        .sh-badge-success {
            background: #38ef7d;
            color: white;
        }
        
        .sh-badge-secondary {
            background: #6c757d;
            color: white;
        }
        
        /* 分隔线 */
        .sh-divider {
            height: 1px;
            background: #e9ecef;
            margin: 16px 0;
        }
        
        /* 加载动画 */
        .sh-loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: sh-spin 0.6s linear infinite;
        }
        
        @keyframes sh-spin {
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
            enabled: true,
            autoSubmitEnabled: true  // 默认标注用于自动提交
        },
        {
            id: 'bin2',
            prefix: "623358",
            name: "银联卡",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true  // 默认标注用于自动提交
        },
        {
            id: 'bin3',
            prefix: "552461",
            name: "Mastercard",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: false  // 默认不用于自动提交
        },
        {
            id: 'bin4',
            prefix: "559888",
            name: "Mastercard Pro",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: false  // 默认不用于自动提交
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
        
        // 获取标注用于自动提交的卡头
        getAutoSubmitCardBins() {
            return this.getCardBins().filter(b => b.enabled && b.autoSubmitEnabled);
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
        },
        
        // ========== Session Cookie 管理 ==========
        
        // 保存Session Cookie
        saveSessionCookie(cookie) {
            GM_setValue('sessionCookie', JSON.stringify({
                cookie: cookie,
                timestamp: new Date().toISOString(),
                domain: 'auth.augmentcode.com'
            }));
        },
        
        // 获取Session Cookie
        getSessionCookie() {
            const saved = GM_getValue('sessionCookie');
            return saved ? JSON.parse(saved) : null;
        },
        
        // 删除Session Cookie
        deleteSessionCookie() {
            GM_deleteValue('sessionCookie');
        }
    };
    
    // ==================== 临时邮箱API（TempMail.Plus）====================
    
    // TempMail.Plus 配置
    const TEMPMAIL_CONFIG = {
        email: 'chaogei666@mailto.plus',
        epin: '9825369',
        domains: [
            'gfnbajbskjdsa.dns.army',
            'email.chaogei.top',
            'mxd.chaogei.asia'
        ],
        baseUrl: 'https://tempmail.plus/api'
    };
    
    const TempEmailAPI = {
        // 生成随机邮箱（使用配置的域名）
        async generateRandomEmail() {
            try {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 10000);
                const username = `aug${timestamp}${random}`;
                
                // 随机选择一个配置的域名
                const domain = TEMPMAIL_CONFIG.domains[Math.floor(Math.random() * TEMPMAIL_CONFIG.domains.length)];
                const email = `${username}@${domain}`;
                
                console.log('📧 生成临时邮箱:', email);
                console.log('📍 使用域名:', domain);
                return email;
            } catch (error) {
                console.error('生成邮箱失败:', error);
                throw error;
            }
        },
        
        // 获取收件箱邮件列表（使用TempMail.Plus API）
        async getInbox(generatedEmail, firstId = 0) {
            return new Promise((resolve, reject) => {
                // 使用固定的chaogei666@mailto.plus邮箱查询
                // 生成的邮箱会自动转发到这个主邮箱
                const url = `${TEMPMAIL_CONFIG.baseUrl}/mails?email=${encodeURIComponent(TEMPMAIL_CONFIG.email)}&first_id=${firstId}&epin=${TEMPMAIL_CONFIG.epin}`;
                
                console.log('📨 请求邮件列表:', url);
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'accept': 'application/json',
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.result && data.mail_list) {
                                console.log('✅ 获取到邮件列表:', data.mail_list.length, '封');
                                resolve({
                                    success: true,
                                    mails: data.mail_list,
                                    firstId: data.first_id || firstId
                                });
                            } else {
                                resolve({ success: false, mails: [] });
                            }
                        } catch (e) {
                            console.error('解析邮件列表失败:', e);
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        console.error('请求邮件列表失败:', error);
                        reject(error);
                    }
                });
            });
        },
        
        // 读取邮件内容（使用TempMail.Plus API）
        async readEmail(mailId) {
            return new Promise((resolve, reject) => {
                const url = `${TEMPMAIL_CONFIG.baseUrl}/mails/${mailId}?email=${encodeURIComponent(TEMPMAIL_CONFIG.email)}&epin=${TEMPMAIL_CONFIG.epin}`;
                
                console.log('📖 读取邮件详情:', mailId);
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'accept': 'application/json',
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.result) {
                                console.log('✅ 读取邮件成功');
                                console.log('   发件人:', data.from);
                                console.log('   主题:', data.subject);
                                resolve(data);
                            } else {
                                reject(new Error('读取邮件失败'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        },
        
        // 删除邮件（使用TempMail.Plus API）
        async deleteEmail(firstId) {
            return new Promise((resolve, reject) => {
                const url = `${TEMPMAIL_CONFIG.baseUrl}/mails/`;
                const params = `email=${encodeURIComponent(TEMPMAIL_CONFIG.email)}&first_id=${firstId}&epin=${TEMPMAIL_CONFIG.epin}`;
                
                console.log('🗑️ 删除邮件:', firstId);
                
                GM_xmlhttpRequest({
                    method: 'DELETE',
                    url: url,
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    data: params,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.result) {
                                console.log('✅ 邮件删除成功');
                                resolve(true);
                            } else {
                                console.log('⚠️ 邮件删除失败');
                                resolve(false);
                            }
                        } catch (e) {
                            console.error('解析删除响应失败:', e);
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        console.error('删除邮件请求失败:', error);
                        resolve(false);
                    }
                });
            });
        },
        
        // 从邮件中提取验证码（适配TempMail.Plus返回的数据结构）
        extractVerificationCode(text, html) {
            console.log('🔍 尝试提取验证码...');
            
            // 尝试多种验证码格式（按Python代码中的优先级）
            const patterns = [
                // Augment 专用格式
                { regex: /Your verification code is:\s*<b>(\d{6})<\/b>/i, desc: 'Augment HTML格式' },
                { regex: /Your verification code is:\s*(\d{6})/i, desc: 'Augment 文本格式' },
                { regex: /verification code is:\s*(\d{6})/i, desc: '验证码 is 格式' },
                
                // Cursor 格式
                { regex: /验证码。\s*\n\s*\n\s*(\d{6})/m, desc: 'Cursor 中文格式' },
                { regex: /verification code[.。:：]\s*\n\s*\n\s*(\d{6})/im, desc: 'Cursor 英文格式' },
                
                // 通用格式
                { regex: /\n\s*\n\s*(\d{6})\s*\n\s*\n/m, desc: '独立一行的6位数字' },
                { regex: /验证码[：:]\s*(\d{6})/i, desc: '验证码：123456' },
                { regex: /code[：:]\s*(\d{6})/i, desc: 'code: 123456' },
                { regex: /\b(\d{6})\b/, desc: '任意6位数字' }
            ];
            
            // 先从文本内容提取
            if (text) {
                for (const { regex, desc } of patterns) {
                    const match = text.match(regex);
                    if (match && match[1]) {
                        console.log(`🔑 成功！使用模式 [${desc}] 从文本提取到验证码: ${match[1]}`);
                        return match[1];
                    }
                }
            }
            
            // 再从HTML内容提取
            if (html) {
                console.log('🔍 文本中未找到，尝试从HTML中提取...');
                for (const { regex, desc } of patterns) {
                    const match = html.match(regex);
                    if (match && match[1]) {
                        console.log(`🔑 成功！使用模式 [${desc}] 从HTML提取到验证码: ${match[1]}`);
                        return match[1];
                    }
                }
            }
            
            console.log('⚠️ 未能从邮件中提取到验证码');
            return null;
        },
        
        // 验证邮件是否来自Augment或Cursor
        isValidMail(fromMail, toMail, subject) {
            const keywords = ['cursor', 'chaogei', 'augment', 'augmentcode'];
            const fromLower = (fromMail || '').toLowerCase();
            const toLower = (toMail || '').toLowerCase();
            const subjectLower = (subject || '').toLowerCase();
            
            // 1. 检查关键词（发件人、收件人、主题）
            for (const keyword of keywords) {
                if (fromLower.includes(keyword) || toLower.includes(keyword) || subjectLower.includes(keyword)) {
                    console.log(`   ✅ 匹配关键词: ${keyword}`);
                    return true;
                }
            }
            
            // 2. 检查收件人域名
            for (const domain of TEMPMAIL_CONFIG.domains) {
                if (toLower.includes(domain.toLowerCase()) || toLower.includes('chaogei')) {
                    console.log(`   ✅ 匹配收件人域名: ${domain}`);
                    return true;
                }
            }
            
            // 3. 检查发件人域名（转发邮件特征）
            // TempMail转发的邮件，发件人通常包含转发域名，如：bounces-imx+xxx@xxx.dns.army
            for (const domain of TEMPMAIL_CONFIG.domains) {
                const domainPattern = domain.toLowerCase().replace('mailto.plus', 'dns.army');
                if (fromLower.includes(domainPattern) || fromLower.includes(domain.toLowerCase())) {
                    console.log(`   ✅ 匹配发件人转发域名: ${domainPattern}`);
                    return true;
                }
            }
            
            // 4. 检查系统邮件特征（bounces, noreply等）
            // 这些通常是验证邮件的发件人前缀
            const systemMailKeywords = ['bounces', 'noreply', 'no-reply', 'notification', 'verify', 'auth'];
            for (const keyword of systemMailKeywords) {
                if (fromLower.includes(keyword)) {
                    console.log(`   ✅ 匹配系统邮件特征: ${keyword}`);
                    return true;
                }
            }
            
            console.log('   ❌ 未匹配任何验证条件');
            return false;
        },
        
        // 解析邮件时间字符串为时间戳
        parseMailTime(timeStr) {
            if (!timeStr) return null;
            
            try {
                // TempMail.Plus返回格式："2025-10-30 12:34:56"
                // 转换为ISO格式再解析
                const isoFormat = timeStr.replace(' ', 'T') + 'Z';
                const timestamp = new Date(isoFormat).getTime();
                
                if (isNaN(timestamp)) {
                    // 尝试直接解析
                    const directParse = new Date(timeStr).getTime();
                    return isNaN(directParse) ? null : directParse;
                }
                
                return timestamp;
            } catch (e) {
                console.warn('解析邮件时间失败:', timeStr, e);
                return null;
            }
        },
        
        // 检查邮件是否在指定时间之后发送（时效性检查）
        isMailAfterTime(mail, startTime) {
            // 获取邮件时间（多种字段兼容）
            const mailTimeStr = mail.time || mail.date || mail.created_at || mail.timestamp;
            
            if (!mailTimeStr) {
                console.log('   ⚠️ 邮件无时间戳，跳过时效性检查');
                return true; // 无时间信息时不过滤
            }
            
            // 如果是数字类型，直接作为时间戳使用
            let mailTime;
            if (typeof mailTimeStr === 'number') {
                mailTime = mailTimeStr;
            } else {
                mailTime = this.parseMailTime(mailTimeStr);
            }
            
            if (!mailTime) {
                console.log('   ⚠️ 邮件时间解析失败，跳过时效性检查');
                return true;
            }
            
            // 计算时间差（秒）
            const timeDiff = Math.floor((mailTime - startTime) / 1000);
            console.log(`   📅 邮件时间: ${mailTimeStr}`);
            console.log(`   ⏰ 时间差: ${timeDiff}秒 (${timeDiff >= 0 ? '请求后' : '请求前'})`);
            
            // 只接收在发起请求之后的邮件（允许5秒的时间误差）
            if (timeDiff < -5) {
                console.log(`   ⏱️ 邮件过旧，跳过（发送于请求前${Math.abs(timeDiff)}秒）`);
                return false;
            }
            
            console.log('   ✅ 邮件时效性验证通过');
            return true;
        },
        
        // 等待接收验证码邮件（轮询TempMail.Plus - 新策略：获取最新邮件并立即删除）
        async waitForVerificationCode(generatedEmail, maxWaitTime = 60000, checkInterval = 3000) {
            console.log('📬 开始等待验证码邮件（使用TempMail.Plus）...');
            console.log('📧 生成的邮箱:', generatedEmail);
            console.log('📮 查询主邮箱:', TEMPMAIL_CONFIG.email);
            console.log('💡 新策略：只获取最新邮件，处理后立即删除');
            
            // 记录开始时间
            const startTime = Date.now();
            const startTimeStr = new Date(startTime).toLocaleString('zh-CN');
            console.log('🕒 请求发起时间:', startTimeStr);
            
            while (Date.now() - startTime < maxWaitTime) {
                try {
                    // 每次都从 first_id=0 获取最新邮件
                    const result = await this.getInbox(generatedEmail, 0);
                    
                    if (result.success && result.mails && result.mails.length > 0) {
                        console.log(`📨 获取到 ${result.mails.length} 封最新邮件`);
                        
                        // 只处理第一封（最新的）邮件
                        const mail = result.mails[0];
                        const fromMail = mail.from_mail || mail.from || '';
                        const toMail = mail.to || '';
                        const subject = mail.subject || '';
                        const mailId = mail.mail_id || mail.id;
                        const mailTime = mail.time || '';
                        const firstId = result.firstId;
                        
                        console.log(`\n📧 处理最新邮件 [ID: ${mailId}]:`);
                        console.log(`   发件人: ${fromMail}`);
                        console.log(`   收件人: ${toMail}`);
                        console.log(`   主题: ${subject || '(无主题)'}`);
                        console.log(`   时间: ${mailTime}`);
                        
                        let shouldDelete = true;
                        let foundCode = false;
                        let code = null;
                        
                        // 验证是否为Augment/Cursor验证邮件
                        if (this.isValidMail(fromMail, toMail, subject)) {
                            console.log('✅ 确认为有效验证邮件，读取详情...');
                            
                            try {
                                // 读取邮件详情
                                const fullMessage = await this.readEmail(mailId);
                                code = this.extractVerificationCode(fullMessage.text || '', fullMessage.html || '');
                                
                                if (code) {
                                    console.log('✅ 成功提取验证码:', code);
                                    foundCode = true;
                                } else {
                                    console.log('⚠️ 未能从邮件中提取到验证码');
                                }
                            } catch (error) {
                                console.error('❌ 读取邮件内容失败:', error);
                            }
                        } else {
                            console.log('⚠️ 不是目标验证邮件');
                        }
                        
                        // 无论是否成功提取验证码，都删除邮件
                        if (shouldDelete && firstId > 0) {
                            console.log('🗑️ 删除已处理的邮件...');
                            await this.deleteEmail(firstId);
                        }
                        
                        // 如果成功提取到验证码，立即返回
                        if (foundCode && code) {
                            console.log('🎉 验证码提取成功，结束等待');
                            return code;
                        }
                        
                        // 否则继续等待下一封邮件
                        console.log('⏳ 继续等待下一封邮件...');
                    } else {
                        // 没有新邮件
                        const elapsed = Math.floor((Date.now() - startTime) / 1000);
                        console.log(`⏳ 暂无新邮件，继续等待... (已等待${elapsed}秒)`);
                    }
                    
                    // 等待一段时间后再次检查
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                    
                } catch (error) {
                    console.error('检查邮箱时出错:', error);
                    // 出错后也等待一段时间再重试
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                }
            }
            
            throw new Error('等待验证码超时（60秒）');
        }
    };
    
    // ==================== Session Cookie 提取工具 ====================
    
    // 判断当前页面类型
    function getCurrentPageType() {
        const url = window.location.href;
        if (url.includes('auth.augmentcode.com')) {
            return 'auth';
        } else if (url.includes('app.augmentcode.com/account/subscription')) {
            return 'subscription';
        } else if (url.includes('checkout.stripe.com') || url.includes('billing.augmentcode.com')) {
            return 'stripe';
        }
        return 'unknown';
    }
    
    // 从当前页面提取Session Cookie
    function getSessionFromCurrentPage() {
        return new Promise((resolve) => {
            try {
                GM_cookie.list({ name: 'session' }, function(cookies, error) {
                    if (error) {
                        console.error('获取Cookie失败:', error);
                        resolve(null);
                        return;
                    }
                    
                    if (cookies && cookies.length > 0) {
                        const session = cookies[0].value;
                        console.log('✅ 成功获取Session Cookie, 长度:', session.length);
                        resolve(session);
                    } else {
                        console.log('❌ 未找到Session Cookie');
                        resolve(null);
                    }
                });
            } catch (e) {
                console.error('GM_cookie调用异常:', e);
                resolve(null);
            }
        });
    }
    
    // 跳转到auth页面提取Cookie
    function jumpToAuthPageForCookie(noReturn = false) {
        GM_setValue('augment_extracting', 'true');
        
        if (noReturn) {
            // 注册流程：不保存返回URL，提取后留在auth页面
            GM_setValue('augment_no_return', 'true');
            console.log('🔗 跳转到auth页面（注册流程，不返回）...');
        } else {
            // 普通流程：保存返回URL，提取后返回
            GM_setValue('augment_return_url', window.location.href);
            GM_setValue('augment_no_return', 'false');
            console.log('🔗 跳转到auth页面（自动返回模式）...');
        }
        
        window.location.href = 'https://auth.augmentcode.com/';
    }
    
    // 从auth页面返回
    function returnFromAuthPage(session) {
        GM_setValue('augment_session', session);
        GM_setValue('augment_extracting', 'false');
        
        const returnUrl = GM_getValue('augment_return_url', window.location.href);
        console.log('🔙 返回原页面:', returnUrl);
        window.location.href = returnUrl;
    }
    
    // 显示Toast通知
    function showToast(message, type = 'info') {
        const existingToast = document.getElementById('stripe-helper-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const toast = document.createElement('div');
        toast.id = 'stripe-helper-toast';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            max-width: 350px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            // 尝试使用GM_setClipboard
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                return true;
            }
            
            // 降级方案1: 现代浏览器API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            
            // 降级方案2: 传统方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        } catch (error) {
            console.error('复制失败:', error);
            return false;
        }
    }
    
    // ==================== Augment注册自动化 ====================
    
    // 通用按钮查找函数
    function findButton(keywords) {
        const allButtons = document.querySelectorAll('button, [role="button"], a.btn, input[type="submit"]');
        
        for (const button of allButtons) {
            const text = (button.textContent || button.value || '').toLowerCase();
            
            for (const keyword of keywords) {
                if (text.includes(keyword.toLowerCase())) {
                    // 确保按钮可见且未禁用
                    if (button.offsetParent !== null && !button.disabled) {
                        console.log(`✅ 找到按钮: "${button.textContent || button.value}" (关键词: ${keyword})`);
                        return button;
                    }
                }
            }
        }
        
        return null;
    }
    
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
            // 检查是否已存在，避免重复创建
            const existing = document.querySelector('.stripe-helper-panel');
            if (existing) {
                console.log('⚠️ 检测到已存在的面板，移除旧面板');
                existing.remove();
            }
            
            const panel = document.createElement('div');
            panel.className = 'stripe-helper-panel';
            panel.id = 'stripe-helper-panel-main'; // 添加ID方便查找
            
            // 添加数据属性标记，防止被误删
            panel.setAttribute('data-stripe-helper', 'true');
            panel.setAttribute('data-version', '2.1.0');
            
            panel.innerHTML = `
                <button class="stripe-helper-toggle">
                    💳 Stripe助手
                </button>
                <div class="stripe-helper-content">
                    <div class="stripe-helper-tabs">
                        <button class="stripe-helper-tab active" data-tab="fill">🚀 填表</button>
                        <button class="stripe-helper-tab" data-tab="register">🔐 注册</button>
                        <button class="stripe-helper-tab" data-tab="cards">💳 卡头</button>
                        <button class="stripe-helper-tab" data-tab="profiles">👤 信息</button>
                        <button class="stripe-helper-tab" data-tab="history">📜 历史</button>
                        <button class="stripe-helper-tab" data-tab="settings">⚙️ 设置</button>
                        <button class="stripe-helper-tab" data-tab="about">ℹ️ 关于</button>
                    </div>
                    <div id="tab-content-fill" class="stripe-helper-tab-content active"></div>
                    <div id="tab-content-register" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-cards" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-profiles" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-history" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-settings" class="stripe-helper-tab-content"></div>
                    <div id="tab-content-about" class="stripe-helper-tab-content"></div>
                </div>
            `;
            
            // 确保body存在
            if (!document.body) {
                console.error('❌ document.body不存在，等待body创建...');
                return setTimeout(() => this.createPanel(), 100);
            }
            
            // 插入到body末尾（更稳定的位置）
            document.body.appendChild(panel);
            this.panel = panel;
            
            console.log('✅ 面板已创建并插入DOM');
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
                case 'register':
                    this.renderRegisterTab();
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
                
                <div class="sh-form-group">
                    <label class="sh-form-label">选择信息配置</label>
                    <select class="sh-form-select" id="profile-select">
                        ${profiles.map((p, i) => `<option value="${p.id}" ${i === 0 ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="sh-form-group">
                    <label class="sh-form-label">选择卡头 <small style="color: #6c757d;">(选择特定卡头将固定使用该卡头)</small></label>
                    <select class="sh-form-select" id="card-bin-select">
                        <option value="random" selected>🎲 随机选择</option>
                        ${cardBins.map(bin => `<option value="${bin.id}">${bin.name} (${bin.prefix})</option>`).join('')}
                    </select>
                </div>
                
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-primary" id="btn-auto-fill">
                        <span>🚀</span>
                        <span>自动填表并提交</span>
                    </button>
                </div>
                
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-success" id="btn-fill-only">
                        <span>📝</span>
                        <span>仅填表</span>
                    </button>
                    <button class="sh-btn sh-btn-secondary" id="btn-clear">
                        <span>🧹</span>
                        <span>清空</span>
                    </button>
                </div>
                
                <div class="sh-divider"></div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">💡 使用提示</div>
                    <div class="sh-card-item-info">
                        • <strong>自动填表并提交</strong>：自动填写并点击提交按钮<br>
                        &nbsp;&nbsp;→ 随机模式下只使用标注了"🚀自动提交"的卡头<br>
                        &nbsp;&nbsp;→ 当前已标注: ${(() => {
                            const autoSubmitBins = DataManager.getAutoSubmitCardBins();
                            if (autoSubmitBins.length === 0) {
                                return '<span style="color: #dc3545;">⚠️ 无（请在卡头管理中标注）</span>';
                            }
                            return '<span style="color: #667eea;">' + autoSubmitBins.map(b => b.name).join('、') + '</span>';
                        })()}<br>
                        • <strong>仅填表</strong>：只填写表单，不自动提交<br>
                        &nbsp;&nbsp;→ 可使用所有启用的卡头<br>
                        • <strong>清空</strong>：清除所有表单内容<br>
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
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">🎲 已选择：随机卡头模式</div>';
                } else {
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-info">✅ 已选择：${selectedText}</div>`;
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
                statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 正在填写表单...</div>';
                
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
                
                // 选择卡头（优化逻辑，区分自动提交和仅填表模式）
                let selectedBin;
                if (binSelect === 'random' || !binSelect) {
                    console.log('🎲 使用随机卡头');
                    
                    // 如果是自动提交模式，只从标注的卡头中选择
                    if (autoSubmit) {
                        const autoSubmitBins = DataManager.getAutoSubmitCardBins();
                        if (autoSubmitBins.length > 0) {
                            const randomIndex = Math.floor(Math.random() * autoSubmitBins.length);
                            selectedBin = autoSubmitBins[randomIndex];
                            console.log('✅ 从标注的自动提交卡头中随机选择:', selectedBin.name);
                        } else {
                            console.log('⚠️ 没有标注的自动提交卡头，回退到所有启用的卡头');
                            selectedBin = getRandomCardBin();
                        }
                    } else {
                        // 仅填表模式，从所有启用的卡头中选择
                        selectedBin = getRandomCardBin();
                    }
                } else {
                    console.log('🎯 查找指定卡头:', binSelect);
                    const allBins = DataManager.getCardBins();
                    selectedBin = allBins.find(b => b.id === binSelect);
                    if (selectedBin) {
                        console.log('✅ 找到指定卡头:', selectedBin.name, `(${selectedBin.prefix})`);
                        
                        // 如果是自动提交模式，检查该卡头是否被标注
                        if (autoSubmit && !selectedBin.autoSubmitEnabled) {
                            console.log('⚠️ 该卡头未标注为自动提交，但用户手动选择，继续使用');
                        }
                    } else {
                        console.log('⚠️ 未找到指定卡头，尝试从启用列表查找');
                        selectedBin = DataManager.getEnabledCardBins().find(b => b.id === binSelect);
                        if (!selectedBin) {
                            console.log('❌ 仍未找到，回退到随机选择');
                            selectedBin = autoSubmit ? 
                                (DataManager.getAutoSubmitCardBins()[0] || getRandomCardBin()) : 
                                getRandomCardBin();
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
                    <div class="sh-status-message sh-status-success">
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
                statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                
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
            statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">🧹 表单已清空</div>';
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 2000);
        }
        
        // 渲染注册Tab
        renderRegisterTab() {
            const container = document.getElementById('tab-content-register');
            const savedEmail = GM_getValue('augment_register_email', '');
            const savedCode = GM_getValue('augment_register_code', '');
            
            container.innerHTML = `
                <div id="register-status"></div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">📧 当前邮箱</div>
                    <div class="sh-card-item-info" id="current-email-display">
                        ${savedEmail ? `
                            <strong style="color: #10b981;">${savedEmail}</strong><br>
                            <small style="color: #6c757d;">已生成的临时邮箱</small>
                        ` : `
                            <span style="color: #6c757d;">未生成</span>
                        `}
                    </div>
                </div>
                
                <div class="sh-card-item" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);">
                    <div class="sh-card-item-title">🎯 注册流程</div>
                    <div class="sh-card-item-info" style="line-height: 2;">
                        ① 生成邮箱并提交验证<br>
                        ② 等待接收验证码并自动填写<br>
                        ③ 验证完成，跳转绑卡<br>
                        ④ 一键绑卡并提交<br>
                        ⑤ 跳转auth页面提取Cookie（不返回）
                    </div>
                </div>
                
                <div class="sh-divider"></div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">步骤 ① 生成邮箱并验证</div>
                    <div class="sh-card-item-info">
                        自动生成临时邮箱，填写到注册表单并点击"验证+继续"按钮
                    </div>
                    <div class="sh-card-item-actions">
                        <button class="sh-btn sh-btn-primary" id="btn-step1" style="width: 100%;">
                            <span>📧</span>
                            <span>生成邮箱并提交验证</span>
                        </button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">步骤 ② 接收验证码并填写</div>
                    <div class="sh-card-item-info">
                        自动轮询邮箱，接收验证码并填写提交（最多等待60秒）
                    </div>
                    <div class="sh-card-item-actions">
                        <button class="sh-btn sh-btn-success" id="btn-step2" style="width: 100%;" ${!savedEmail ? 'disabled' : ''}>
                            <span>📬</span>
                            <span>接收并填写验证码</span>
                        </button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">步骤 ③ 前往绑卡界面</div>
                    <div class="sh-card-item-info">
                        验证完成后，点击"前往绑卡"按钮
                    </div>
                    <div class="sh-card-item-actions">
                        <button class="sh-btn sh-btn-primary" id="btn-step3" style="width: 100%;">
                            <span>💳</span>
                            <span>点击前往绑卡</span>
                        </button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">步骤 ④ 一键绑卡并提交</div>
                    <div class="sh-card-item-info">
                        自动填写卡片信息并提交
                    </div>
                    <div class="sh-card-item-actions">
                        <button class="sh-btn sh-btn-success" id="btn-step4" style="width: 100%;">
                            <span>🚀</span>
                            <span>自动绑卡并提交</span>
                        </button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">步骤 ⑤ 获取Session Cookie</div>
                    <div class="sh-card-item-info">
                        跳转到auth.augmentcode.com自动提取Cookie并保存（完成后停留在auth页面）
                    </div>
                    <div class="sh-card-item-actions">
                        <button class="sh-btn sh-btn-primary" id="btn-step5" style="width: 100%;">
                            <span>🍪</span>
                            <span>跳转提取Cookie</span>
                        </button>
                    </div>
                </div>
                
                <div class="sh-divider"></div>
                
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-danger" id="btn-reset-register">
                        <span>🔄</span>
                        <span>重置注册流程</span>
                    </button>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">💡 使用说明</div>
                    <div class="sh-card-item-info" style="font-size: 12px; line-height: 1.8;">
                        • 按顺序点击每个步骤的按钮<br>
                        • 每个步骤完成后会有提示<br>
                        • 验证码接收需要等待3-60秒<br>
                        • 步骤⑤会跳转到auth页面提取Cookie<br>
                        • 提取成功后停留在auth页面（不返回）<br>
                        • 所有操作会自动记录到历史<br>
                        • 使用TempMail.Plus服务（私有配置）<br>
                        • 邮箱格式: aug{时间戳}@{自定义域名}
                    </div>
                </div>
            `;
            
            // 绑定事件
            this.bindRegisterEvents();
        }
        
        // 绑定注册相关事件
        bindRegisterEvents() {
            const statusDiv = document.getElementById('register-status');
            
            // 步骤1：生成邮箱并验证
            document.getElementById('btn-step1').addEventListener('click', async () => {
                try {
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 正在生成邮箱...</div>';
                    
                    console.log('=== 步骤①：生成邮箱并填写 ===');
                    
                    // 生成邮箱
                    const email = await TempEmailAPI.generateRandomEmail();
                    GM_setValue('augment_register_email', email);
                    
                    console.log('📧 生成的邮箱:', email);
                    
                    // 多种选择器查找邮箱输入框（适配Auth0表单）
                    const emailSelectors = [
                        // Auth0专用选择器
                        'input[name="username"]#username',
                        'input#username[type="text"]',
                        'input.input.cc88028e5',
                        // 通用选择器
                        'input[type="email"]',
                        'input[name="email"]',
                        'input[name="username"]',
                        'input[inputmode="email"]',
                        '#email',
                        '#username',
                        'input[autocomplete="email"]',
                        '[data-testid="email-input"]'
                    ];
                    
                    let emailInput = null;
                    for (const selector of emailSelectors) {
                        try {
                            emailInput = document.querySelector(selector);
                            if (emailInput && emailInput.offsetParent !== null) {
                                console.log('✅ 找到邮箱输入框:', selector);
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    if (!emailInput) {
                        throw new Error('未找到邮箱输入框，请手动填写邮箱: ' + email);
                    }
                    
                    // 填写邮箱
                    setInputValueReliably(emailInput, email);
                    console.log('✅ 邮箱已填写到输入框');
                    
                    // 检查Turnstile验证码状态
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const captchaContainer = document.querySelector('[data-captcha-provider="auth0_v2"]') || 
                                           document.querySelector('.ulp-captcha-container');
                    
                    if (captchaContainer) {
                        console.log('🔐 检测到Turnstile验证码');
                        
                        // 检查验证码是否已自动完成
                        const captchaInput = document.querySelector('input[name="captcha"]');
                        if (captchaInput && captchaInput.value) {
                            console.log('✅ Turnstile验证码已自动完成');
                        } else {
                            console.log('⏳ 等待Turnstile验证码加载...');
                            statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 等待人机验证加载（Turnstile）...</div>';
                            
                            // 等待最多10秒让验证码自动完成
                            let waited = 0;
                            while (waited < 10000) {
                                await new Promise(resolve => setTimeout(resolve, 500));
                                waited += 500;
                                
                                const currentValue = document.querySelector('input[name="captcha"]');
                                if (currentValue && currentValue.value) {
                                    console.log('✅ Turnstile验证码已完成');
                                    break;
                                }
                            }
                        }
                    }
                    
                    // 查找并点击Continue按钮
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const continueSelectors = [
                        // Auth0专用选择器
                        'button[type="submit"][data-action-button-primary="true"]',
                        'button._button-login-id',
                        'button.c7ae0cd73',
                        'button[name="action"][value="default"]',
                        // 通用选择器
                        'button[type="submit"]',
                        'button:contains("Continue")',
                        'button:contains("继续")'
                    ];
                    
                    let continueBtn = null;
                    for (const selector of continueSelectors) {
                        try {
                            continueBtn = document.querySelector(selector);
                            if (continueBtn && continueBtn.offsetParent !== null && !continueBtn.disabled) {
                                console.log('✅ 找到Continue按钮:', selector);
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    // 如果通过选择器未找到，使用文本查找
                    if (!continueBtn) {
                        continueBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find(btn => 
                            btn.textContent.trim() === 'Continue' ||
                            btn.textContent.includes('继续') ||
                            btn.textContent.includes('Verify')
                        );
                    }
                    
                    if (continueBtn) {
                        console.log('🖱️ 准备点击Continue按钮...');
                        
                        // 确保按钮可见
                        continueBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(resolve => setTimeout(resolve, 300));
                        
                        // 移除可能的禁用状态
                        continueBtn.disabled = false;
                        
                        // 触发点击事件
                        continueBtn.focus();
                        continueBtn.click();
                        
                        console.log('✅ 已点击Continue按钮');
                        
                        statusDiv.innerHTML = `
                            <div class="sh-status-message sh-status-success">
                                ✅ 步骤①完成！<br>
                                <small>邮箱: ${email}</small><br>
                                <small>已点击Continue按钮</small><br>
                                <small>等待页面跳转后点击"步骤②"</small>
                            </div>
                        `;
                    } else {
                        // 邮箱已填写，但未找到按钮
                        statusDiv.innerHTML = `
                            <div class="sh-status-message sh-status-success">
                                ⚠️ 邮箱已填写！<br>
                                <small>邮箱: ${email}</small><br>
                                <small>请手动点击Continue按钮</small>
                            </div>
                        `;
                    }
                    
                    // 刷新UI显示邮箱
                    setTimeout(() => this.renderRegisterTab(), 2000);
                    
                } catch (error) {
                    console.error('步骤①失败:', error);
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                    
                    // 如果已生成邮箱，也显示出来
                    const email = GM_getValue('augment_register_email', '');
                    if (email) {
                        setTimeout(() => this.renderRegisterTab(), 2000);
                    }
                }
            });
            
            // 步骤2：接收验证码
            document.getElementById('btn-step2').addEventListener('click', async () => {
                try {
                    const email = GM_getValue('augment_register_email', '');
                    if (!email) {
                        throw new Error('请先完成步骤①生成邮箱');
                    }
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">📬 正在等待验证码邮件（最多60秒）...</div>';

                    // 等待接收验证码
                    const code = await TempEmailAPI.waitForVerificationCode(email);
                    GM_setValue('augment_register_code', code);
                    console.log('✅ 收到验证码:', code);

                    // 优先选择验证码输入框
                    let codeInput = document.querySelector('input[name="code"]')
                        || document.querySelector('input#code')
                        || Array.from(document.querySelectorAll('input.input.cc88028e5')).find(input => !input.value && !input.readOnly && input.type === 'text' && (input.name === 'code' || input.id === 'code' || input.ariaLabel === 'Enter the code' || input.ariaLabel === '验证码'));

                    if (!codeInput) {
                        // 回退：查找所有input[type='text']，优先看label for="code"
                        const labelCode = document.querySelector('label[for="code"]');
                        if (labelCode) {
                            const byId = document.querySelector('#code');
                            if (byId && byId.type === 'text') codeInput = byId;
                        }
                    }

                    if (!codeInput) {
                        // 兼容极端：只找第一个空input.input.cc88028e5或ccba96020
                        codeInput = Array.from(document.querySelectorAll('input.input.cc88028e5,input.ccba96020')).find(input => input.type === 'text' && !input.value);
                    }

                    if (!codeInput) {
                        throw new Error('未找到验证码输入框');
                    }

                    setInputValueReliably(codeInput, code);
                    console.log('✅ 验证码已填写:', code);

                    // 500ms后自动点击Continue按钮
                    await new Promise(r => setTimeout(r, 500));
                    const continueBtn = Array.from(document.querySelectorAll('button[type="submit"]'))
                        .find(btn => (btn.className.includes('ca65675d0') || btn.className.includes('c7ae0cd73')) && !btn.disabled);
                    if (continueBtn) {
                        continueBtn.click();
                        console.log('✅ 已点击Continue提交按钮');
                    } else {
                        throw new Error('未能自动找到并点击验证码页面的Continue提交按钮，请手动操作');
                    }

                    statusDiv.innerHTML = `
                        <div class="sh-status-message sh-status-success">
                            ✅ 步骤2完成！<br>
                            <small>验证码: ${code}</small><br>
                            <small>等待页面跳转后点击\"步骤③\"</small>
                        </div>
                    `;
                } catch (error) {
                    console.error('步骤2失败:', error);
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                }
            });
            
            // 步骤3：前往绑卡
            document.getElementById('btn-step3').addEventListener('click', async () => {
                try {
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 正在查找绑卡按钮...</div>';
                    
                    // 查找"前往绑卡"相关按钮
                    const bindCardBtn = Array.from(document.querySelectorAll('button, a')).find(btn => 
                        btn.textContent.includes('绑卡') || 
                        btn.textContent.includes('添加卡') ||
                        btn.textContent.includes('Add Card') ||
                        btn.textContent.includes('绑定') ||
                        btn.textContent.includes('Payment')
                    );
                    
                    if (bindCardBtn) {
                        bindCardBtn.click();
                        console.log('✅ 已点击前往绑卡按钮');
                        
                        statusDiv.innerHTML = `
                            <div class="sh-status-message sh-status-success">
                                ✅ 步骤3完成！<br>
                                <small>等待页面跳转后点击"步骤④"</small>
                            </div>
                        `;
                    } else {
                        throw new Error('未找到绑卡按钮');
                    }
                    
                } catch (error) {
                    console.error('步骤3失败:', error);
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                }
            });
            
            // 步骤4：一键绑卡
            document.getElementById('btn-step4').addEventListener('click', async () => {
                try {
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 正在自动绑卡...</div>';
                    
                    // 获取第一个信息配置
                    const profiles = DataManager.getProfiles();
                    const profile = profiles[0];
                    
                    // 获取第一个标注的卡头
                    const autoSubmitBins = DataManager.getAutoSubmitCardBins();
                    if (autoSubmitBins.length === 0) {
                        throw new Error('没有标注的卡头，请先在卡头管理中标注');
                    }
                    const selectedBin = autoSubmitBins[0];
                    
                    // 生成卡号信息
                    const cardNumber = generateLuhnCardNumber(selectedBin.prefix, selectedBin.totalLength);
                    const expiryMonth = generateRandomMonth();
                    const expiryYear = generateRandomYear();
                    const cvc = generateRandomCVC(selectedBin.cvcLength);
                    const expiry = `${expiryMonth}/${expiryYear}`;
                    
                    // 执行填表（自动提交）
                    reliableFillForm(profile.data, cardNumber, expiry, cvc, selectedBin.name, true);
                    
                    statusDiv.innerHTML = `
                        <div class="sh-status-message sh-status-success">
                            ✅ 步骤4完成！<br>
                            <small>卡号: ${cardNumber.slice(0, 6)}******${cardNumber.slice(-4)}</small><br>
                            <small>等待提交成功后点击"步骤⑤"</small>
                        </div>
                    `;
                    
                    // 记录历史
                    DataManager.addHistory({
                        action: '注册绑卡',
                        profile: profile.name,
                        cardBin: selectedBin.name,
                        cardNumber: cardNumber.slice(0, 6) + '******' + cardNumber.slice(-4),
                        success: true
                    });
                    
                } catch (error) {
                    console.error('步骤4失败:', error);
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                }
            });
            
            // 步骤5：跳转到auth页面获取Cookie（不返回）
            document.getElementById('btn-step5').addEventListener('click', async () => {
                try {
                    console.log('=== 步骤⑤：跳转到auth页面获取Cookie ===');
                    
                    statusDiv.innerHTML = '<div class="sh-status-message sh-status-info">⏳ 正在跳转到auth页面提取Cookie...</div>';
                    
                    // 保存当前邮箱信息（用于后续记录）
                    const email = GM_getValue('augment_register_email', '');
                    
                    // 标记为注册流程的Cookie提取
                    GM_setValue('augment_extracting_from_register', 'true');
                    GM_setValue('augment_register_email_for_cookie', email);
                    
                    // 显示提示
                    showToast('正在跳转到auth页面提取Cookie（不返回）...', 'info');
                    
                    console.log('🔗 即将跳转到 https://auth.augmentcode.com/');
                    console.log('📧 当前注册邮箱:', email);
                    console.log('ℹ️ 注册流程：提取Cookie后停留在auth页面');
                    
                    // 延迟500ms后跳转（让用户看到提示）
                    setTimeout(() => {
                        jumpToAuthPageForCookie(true); // 传入 true 表示不返回
                    }, 500);
                    
                } catch (error) {
                    console.error('步骤5失败:', error);
                    statusDiv.innerHTML = `<div class="sh-status-message sh-status-error">❌ ${error.message}</div>`;
                }
            });
            
            // 重置注册流程
            document.getElementById('btn-reset-register').addEventListener('click', () => {
                if (confirm('确定要重置注册流程吗？这将清除保存的邮箱和验证码。')) {
                    GM_setValue('augment_register_email', '');
                    GM_setValue('augment_register_code', '');
                    showToast('✅ 注册流程已重置', 'success');
                    this.renderRegisterTab();
                }
            });
        }
        
        // 渲染卡头Tab
        renderCardsTab() {
            const container = document.getElementById('tab-content-cards');
            const cardBins = DataManager.getCardBins();
            
            container.innerHTML = `
                <div class="sh-status-message sh-status-info" style="margin-bottom: 16px;">
                    <strong>🚀 自动提交标注说明</strong><br>
                    • 点击"🚀 标注"按钮可将卡头设为"自动填表并提交"专用<br>
                    • 已标注的卡头会显示"🚀自动提交"徽章<br>
                    • 当前已标注: <strong>${DataManager.getAutoSubmitCardBins().map(b => b.name).join('、') || '无'}</strong>
                </div>
                
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-primary" id="btn-add-card">
                        <span>➕</span>
                        <span>添加卡头</span>
                    </button>
                </div>
                
                <div id="cards-list">
                    ${cardBins.length === 0 ? 
                        '<div class="sh-empty-state"><div class="sh-empty-state-icon">📭</div><div>暂无卡头配置</div></div>' :
                        cardBins.map(bin => `
                            <div class="card-item ${bin.enabled ? 'selected' : ''}" data-id="${bin.id}">
                                <div class="sh-card-item-header">
                                    <div class="sh-card-item-title">${bin.name}</div>
                                    <div style="display: flex; gap: 6px;">
                                        ${bin.enabled ? '<span class="sh-badge sh-badge-success">启用</span>' : '<span class="sh-badge sh-badge-secondary">禁用</span>'}
                                        ${bin.autoSubmitEnabled ? '<span class="sh-badge sh-badge-primary">🚀自动提交</span>' : ''}
                                    </div>
                                </div>
                                <div class="sh-card-item-info">
                                    卡号前缀: ${bin.prefix}<br>
                                    总长度: ${bin.totalLength} 位 | CVC: ${bin.cvcLength} 位<br>
                                    ${bin.autoSubmitEnabled ? 
                                        '<strong style="color: #667eea;">✅ 此卡头可用于"自动填表并提交"</strong>' : 
                                        '<span style="color: #6c757d;">⚪ 此卡头仅用于"仅填表"</span>'
                                    }
                                </div>
                                <div class="sh-card-item-actions">
                                    <button class="sh-icon-btn" data-action="toggle" data-id="${bin.id}">
                                        ${bin.enabled ? '🔒 禁用' : '✅ 启用'}
                                    </button>
                                    <button class="sh-icon-btn" data-action="toggle-autosubmit" data-id="${bin.id}" style="background: ${bin.autoSubmitEnabled ? '#667eea' : '#e9ecef'}; color: ${bin.autoSubmitEnabled ? 'white' : '#495057'};">
                                        ${bin.autoSubmitEnabled ? '🚀 取消标注' : '🚀 标注'}
                                    </button>
                                    <button class="sh-icon-btn" data-action="edit" data-id="${bin.id}">✏️ 编辑</button>
                                    <button class="sh-icon-btn" data-action="delete" data-id="${bin.id}">🗑️ 删除</button>
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
                        case 'toggle-autosubmit':
                            const binAuto = DataManager.getCardBins().find(b => b.id === id);
                            const newAutoSubmitState = !binAuto.autoSubmitEnabled;
                            DataManager.updateCardBin(id, { autoSubmitEnabled: newAutoSubmitState });
                            console.log(`${newAutoSubmitState ? '✅ 已标注' : '⚪ 已取消标注'} ${binAuto.name} 用于自动提交`);
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
                    <div class="sh-form-group">
                        <label class="sh-form-label">卡头名称</label>
                        <input type="text" class="sh-form-input" id="modal-bin-name" value="${bin ? bin.name : ''}" placeholder="例如：Visa测试卡">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">卡号前缀（BIN）</label>
                        <input type="text" class="sh-form-input" id="modal-bin-prefix" value="${bin ? bin.prefix : ''}" placeholder="例如：400000">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">卡号总长度</label>
                        <input type="number" class="sh-form-input" id="modal-bin-length" value="${bin ? bin.totalLength : '16'}" min="13" max="19">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">CVC长度</label>
                        <input type="number" class="sh-form-input" id="modal-bin-cvc" value="${bin ? bin.cvcLength : '3'}" min="3" max="4">
                    </div>
                `,
                onConfirm: () => {
                    const data = {
                        name: document.getElementById('modal-bin-name').value.trim(),
                        prefix: document.getElementById('modal-bin-prefix').value.trim(),
                        totalLength: parseInt(document.getElementById('modal-bin-length').value),
                        cvcLength: parseInt(document.getElementById('modal-bin-cvc').value),
                        enabled: true,
                        autoSubmitEnabled: bin ? bin.autoSubmitEnabled : false  // 保持原有状态或默认false
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
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-primary" id="btn-add-profile">
                        <span>➕</span>
                        <span>添加配置</span>
                    </button>
                </div>
                
                <div id="profiles-list">
                    ${profiles.length === 0 ?
                        '<div class="sh-empty-state"><div class="sh-empty-state-icon">📭</div><div>暂无信息配置</div></div>' :
                        profiles.map(profile => `
                            <div class="sh-card-item" data-id="${profile.id}">
                                <div class="sh-card-item-header">
                                    <div class="sh-card-item-title">${profile.name}</div>
                                </div>
                                <div class="sh-card-item-info">
                                    姓名: ${profile.data.billingName}<br>
                                    国家: ${profile.data.billingCountry} | 邮编: ${profile.data.billingPostalCode}<br>
                                    地址: ${profile.data.billingAddressLine1}
                                </div>
                                <div class="sh-card-item-actions">
                                    <button class="sh-icon-btn" data-action="edit" data-id="${profile.id}">✏️ 编辑</button>
                                    <button class="sh-icon-btn" data-action="delete" data-id="${profile.id}">🗑️ 删除</button>
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
                    <div class="sh-form-group">
                        <label class="sh-form-label">配置名称</label>
                        <input type="text" class="sh-form-input" id="modal-profile-name" value="${profile ? profile.name : ''}" placeholder="例如：测试账号1">
                    </div>
                    <div class="sh-divider"></div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">持卡人姓名</label>
                        <input type="text" class="sh-form-input" id="modal-billing-name" value="${data.billingName || ''}" placeholder="张三">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">国家代码</label>
                        <input type="text" class="sh-form-input" id="modal-billing-country" value="${data.billingCountry || ''}" placeholder="CN / US">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">邮政编码</label>
                        <input type="text" class="sh-form-input" id="modal-billing-postal" value="${data.billingPostalCode || ''}" placeholder="100000">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">省/州</label>
                        <input type="text" class="sh-form-input" id="modal-billing-admin" value="${data.billingAdministrativeArea || ''}" placeholder="北京市">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">城市</label>
                        <input type="text" class="sh-form-input" id="modal-billing-locality" value="${data.billingLocality || ''}" placeholder="北京市">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">地区</label>
                        <input type="text" class="sh-form-input" id="modal-billing-dependent" value="${data.billingDependentLocality || ''}" placeholder="朝阳区">
                    </div>
                    <div class="sh-form-group">
                        <label class="sh-form-label">详细地址</label>
                        <input type="text" class="sh-form-input" id="modal-billing-address" value="${data.billingAddressLine1 || ''}" placeholder="建国路123号">
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
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-danger" id="btn-clear-history">
                        <span>🗑️</span>
                        <span>清空历史</span>
                    </button>
                </div>
                
                <div id="history-list">
                    ${history.length === 0 ?
                        '<div class="sh-empty-state"><div class="sh-empty-state-icon">📭</div><div>暂无历史记录</div></div>' :
                        history.map(record => {
                            const time = new Date(record.timestamp).toLocaleString('zh-CN');
                            const statusIcon = record.success ? '✅' : '❌';
                            return `
                                <div class="sh-history-item">
                                    ${statusIcon} <strong>${record.action}</strong><br>
                                    ${record.profile ? `配置: ${record.profile}<br>` : ''}
                                    ${record.cardBin ? `卡头: ${record.cardBin}<br>` : ''}
                                    ${record.cardNumber ? `卡号: ${record.cardNumber}<br>` : ''}
                                    ${record.error ? `错误: ${record.error}<br>` : ''}
                                    <div class="sh-history-time">${time}</div>
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
            const savedCookie = DataManager.getSessionCookie();
            
            container.innerHTML = `
                <div class="sh-card-item">
                    <div class="sh-card-item-title">🍪 Session Cookie 提取</div>
                    <div class="sh-card-item-info" id="cookie-status">
                        ${savedCookie ? `
                            <strong style="color: #10b981;">状态：✅ 已保存</strong><br>
                            <strong>时间</strong>: ${new Date(savedCookie.timestamp).toLocaleString('zh-CN')}<br>
                            <strong>域名</strong>: ${savedCookie.domain}<br>
                            <strong>长度</strong>: ${savedCookie.cookie.length} 字符<br>
                            <div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 6px; font-size: 11px; word-break: break-all; max-height: 60px; overflow-y: auto;">
                                ${savedCookie.cookie.substring(0, 100)}...
                            </div>
                        ` : `
                            <strong style="color: #f59e0b;">状态：⚠️ 未保存</strong><br>
                            <small style="color: #6c757d;">点击"🔗 自动提取"按钮自动跳转到auth页面提取Cookie</small>
                        `}
                    </div>
                    <div class="sh-card-item-actions" style="flex-wrap: wrap;">
                        <button class="sh-icon-btn" id="btn-auto-extract" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white;">
                            🔗 自动提取
                        </button>
                        <button class="sh-icon-btn" id="btn-copy-cookie" ${!savedCookie ? 'disabled' : ''} style="${!savedCookie ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            📋 复制
                        </button>
                        <button class="sh-icon-btn" id="btn-manual-cookie">
                            ✏️ 手动输入
                        </button>
                        <button class="sh-icon-btn" id="btn-delete-cookie" ${!savedCookie ? 'disabled' : ''} style="${!savedCookie ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            🗑️ 删除
                        </button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">📦 数据管理</div>
                    <div class="sh-card-item-info">导出或导入您的所有配置数据</div>
                    <div class="sh-card-item-actions">
                        <button class="sh-icon-btn" id="btn-export">📥 导出配置</button>
                        <button class="sh-icon-btn" id="btn-import">📤 导入配置</button>
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">📊 统计信息</div>
                    <div class="sh-card-item-info">
                        卡头数量: ${DataManager.getCardBins().length} 个<br>
                        信息配置: ${DataManager.getProfiles().length} 个<br>
                        历史记录: ${DataManager.getHistory().length} 条
                    </div>
                </div>
                
                <div class="sh-divider"></div>
                
                    <div class="sh-btn-group">
                    <button class="sh-btn sh-btn-danger" id="btn-reset">
                        <span>⚠️</span>
                        <span>重置所有数据</span>
                    </button>
                </div>
            `;
            
            // 自动提取Cookie
            document.getElementById('btn-auto-extract').addEventListener('click', () => {
                showToast('正在跳转到auth页面自动提取Cookie...', 'info');
                setTimeout(() => {
                    jumpToAuthPageForCookie();
                }, 500);
            });
            
            // 复制Cookie
            const copyCookieBtn = document.getElementById('btn-copy-cookie');
            if (copyCookieBtn && !copyCookieBtn.disabled) {
                copyCookieBtn.addEventListener('click', async () => {
                    if (savedCookie) {
                        const success = await copyToClipboard(savedCookie.cookie);
                        if (success) {
                            showToast('✅ Session Cookie已复制到剪贴板！', 'success');
                        } else {
                            showToast('❌ 复制失败，请查看控制台', 'error');
                            console.log('Session Cookie:', savedCookie.cookie);
                        }
                    }
                });
            }
            
            // 手动输入Cookie
            document.getElementById('btn-manual-cookie').addEventListener('click', () => {
                const modal = this.createModal({
                    title: '✏️ 手动输入Session Cookie',
                    content: `
                        <div class="sh-status-message sh-status-info">
                            <strong>ℹ️ 如何获取Cookie？</strong><br><br>
                            1. 访问 https://auth.augmentcode.com/<br>
                            2. 按F12打开开发者工具<br>
                            3. 切换到"应用程序"(Application)标签<br>
                            4. 左侧点击"Cookie" → "https://auth.augmentcode.com"<br>
                            5. 找到名为"session"的Cookie<br>
                            6. 复制其"值"(Value)字段的内容<br>
                            7. 粘贴到下方输入框
                        </div>
                        <div class="sh-form-group">
                            <label class="sh-form-label">Session Cookie 值</label>
                            <textarea class="sh-form-input" id="manual-cookie-input" 
                                rows="6" 
                                placeholder="粘贴完整的session cookie值..."
                                style="font-family: monospace; font-size: 12px;"></textarea>
                        </div>
                    `,
                    onConfirm: () => {
                        const cookieValue = document.getElementById('manual-cookie-input').value.trim();
                        if (!cookieValue) {
                            alert('请输入Cookie值');
                            return false;
                        }
                        
                        DataManager.saveSessionCookie(cookieValue);
                        showToast('✅ Session Cookie已保存！', 'success');
                        this.renderSettingsTab();
                        return true;
                    }
                });
                modal.show();
            });
            
            // 删除Cookie
            const deleteCookieBtn = document.getElementById('btn-delete-cookie');
            if (deleteCookieBtn && !deleteCookieBtn.disabled) {
                deleteCookieBtn.addEventListener('click', () => {
                    if (confirm('确定要删除已保存的Session Cookie吗？')) {
                        DataManager.deleteSessionCookie();
                        showToast('✅ Session Cookie已删除', 'success');
                        this.renderSettingsTab();
                    }
                });
            }
            
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
                        Version 2.2.0
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">👨‍💻 开发者信息</div>
                    <div class="sh-card-item-info" style="line-height: 2;">
                        <strong>制作人</strong>: chaogei666<br>
                        <strong>微信号</strong>: chaogei666<br>
                        <strong>开发日期</strong>: 2025年
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">✨ 功能特性</div>
                    <div class="sh-card-item-info" style="line-height: 1.8;">
                        • 🔐 Augment自动注册流程（5步完成）<br>
                        • 📧 临时邮箱自动生成和验证<br>
                        • 📬 自动接收和填写验证码<br>
                        • 💳 可自定义卡头管理系统<br>
                        • 🚀 自动提交卡头标注（指定专用BIN）<br>
                        • 🍪 Session Cookie自动提取（跨页面）<br>
                        • 👤 多套个人信息配置（12个预设）<br>
                        • 📜 历史记录追踪（最多50条）<br>
                        • 📦 配置数据导入导出<br>
                        • 🎨 现代化渐变UI设计<br>
                        • 🎯 智能卡头选择（自动/手动模式）<br>
                        • 🔧 操作后面板保持打开<br>
                        • 🌍 支持多国地址格式<br>
                        • 📋 一键复制Cookie到剪贴板
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">📋 默认配置</div>
                    <div class="sh-card-item-info" style="line-height: 1.8;">
                        <strong>卡头类型</strong>: 4种<br>
                        • 379240 (美国运通 15位) 🚀<br>
                        • 623358 (银联卡 16位) 🚀<br>
                        • 552461 (Mastercard 16位)<br>
                        • 559888 (Mastercard Pro 16位)<br>
                        <small style="color: #667eea;">🚀 = 默认标注为自动提交</small><br>
                        <br>
                        <strong>信息配置</strong>: 12套<br>
                        • 覆盖8个国家/地区<br>
                        • 中国（北京、上海、广州、深圳）<br>
                        • 美国、英国、日本、澳大利亚<br>
                        • 加拿大、新加坡、德国
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">🛡️ 隐私说明</div>
                    <div class="sh-card-item-info" style="line-height: 1.8;">
                        • 所有数据仅保存在本地浏览器<br>
                        • 不会上传到任何服务器<br>
                        • 可随时导出或删除数据<br>
                        • 仅供测试环境使用
                    </div>
                </div>
                
                <div class="sh-card-item">
                    <div class="sh-card-item-title">📝 使用许可</div>
                    <div class="sh-card-item-info" style="line-height: 1.8;">
                        本工具仅供学习和测试使用<br>
                        请在合法合规的环境中使用<br>
                        使用本工具产生的任何后果由使用者自行承担
                    </div>
                </div>
                
                <div class="sh-divider"></div>
                
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
            overlay.className = 'sh-modal-overlay';
            overlay.innerHTML = `
                <div class="sh-modal">
                    <div class="sh-modal-header">${title}</div>
                    <div class="sh-modal-body">${content}</div>
                    <div class="sh-modal-footer">
                        <button class="sh-btn sh-btn-secondary sh-modal-cancel">取消</button>
                        <button class="sh-btn sh-btn-primary sh-modal-confirm">确定</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // 事件绑定
            const cancelBtn = overlay.querySelector('.sh-modal-cancel');
            const confirmBtn = overlay.querySelector('.sh-modal-confirm');
            
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
    
    // ==================== Auth页面处理 ====================
    
    // 处理auth页面的Cookie提取
    async function handleAuthPageCookieExtraction() {
        try {
            const isExtracting = GM_getValue('augment_extracting', 'false');
            
            if (isExtracting === 'true') {
                console.log('🍪 检测到Cookie提取请求...');
                showToast('正在提取Session Cookie...', 'info');
                
                // 检查是否来自注册流程
                const noReturn = GM_getValue('augment_no_return', 'false') === 'true';
                const isFromRegister = GM_getValue('augment_extracting_from_register', 'false') === 'true';
                const registerEmail = GM_getValue('augment_register_email_for_cookie', '');
                
                console.log('🔍 提取模式:', noReturn ? '注册流程（不返回）' : '普通模式（自动返回）');
                if (isFromRegister) {
                    console.log('📧 注册邮箱:', registerEmail);
                }
                
                // 等待页面完全加载
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 提取Cookie
                const session = await getSessionFromCurrentPage();
                
                if (session) {
                    console.log('✅ Session Cookie提取成功, 长度:', session.length);
                    DataManager.saveSessionCookie(session);
                    
                    // 如果是注册流程，记录完整的注册历史
                    if (isFromRegister && registerEmail) {
                        DataManager.addHistory({
                            action: '完整注册流程',
                            email: registerEmail,
                            sessionCookie: session.substring(0, 20) + '...',
                            success: true
                        });
                        console.log('✅ 已记录注册历史');
                    }
                    
                    // 清除临时标记
                    GM_setValue('augment_extracting', 'false');
                    GM_setValue('augment_extracting_from_register', 'false');
                    GM_setValue('augment_register_email_for_cookie', '');
                    
                    if (noReturn) {
                        // 注册流程：不返回，显示完整信息
                        showToast('✅ Cookie提取成功！注册流程完成！', 'success');
                        
                        // 在页面上显示成功信息
                        const successDiv = document.createElement('div');
                        successDiv.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            padding: 24px 32px;
                            border-radius: 12px;
                            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                            z-index: 999999;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            max-width: 500px;
                            text-align: center;
                        `;
                        successDiv.innerHTML = `
                            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                            <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px;">
                                注册流程全部完成！
                            </div>
                            <div style="font-size: 14px; opacity: 0.95; line-height: 1.8;">
                                ${registerEmail ? `📧 邮箱: ${registerEmail}<br>` : ''}
                                🍪 Cookie长度: ${session.length} 字符<br>
                                💾 已保存到本地存储<br>
                                📝 已记录到历史
                            </div>
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px; opacity: 0.9;">
                                可以在任意Augment页面打开助手查看Cookie和历史记录
                            </div>
                        `;
                        document.body.appendChild(successDiv);
                        
                        console.log('🎉 注册流程全部完成！');
                        console.log('📧 注册邮箱:', registerEmail);
                        console.log('🍪 Cookie已保存');
                        console.log('📝 历史已记录');
                    } else {
                        // 普通模式：自动返回
                        showToast('✅ Cookie提取成功！正在返回...', 'success');
                        GM_setValue('augment_no_return', 'false');
                        
                        setTimeout(() => {
                            returnFromAuthPage(session);
                        }, 800);
                    }
                } else {
                    console.error('❌ 未能获取Session Cookie');
                    showToast('❌ 未找到Cookie，请确保已登录', 'error');
                    GM_setValue('augment_extracting', 'false');
                    GM_setValue('augment_no_return', 'false');
                    
                    if (!noReturn) {
                        setTimeout(() => {
                            const returnUrl = GM_getValue('augment_return_url', window.location.href);
                            window.location.href = returnUrl;
                        }, 3000);
                    }
                }
            } else {
                console.log('ℹ️ auth页面，但不是Cookie提取模式');
            }
        } catch (error) {
            console.error('处理auth页面失败:', error);
            showToast('❌ Cookie提取失败: ' + error.message, 'error');
            GM_setValue('augment_extracting', 'false');
            GM_setValue('augment_no_return', 'false');
        }
    }
    
    // 检查是否从auth页面返回并携带Cookie
    async function checkReturnFromAuth() {
        const extractedSession = GM_getValue('augment_session', null);
        
        if (extractedSession) {
            console.log('✅ 检测到刚提取的Session Cookie');
            GM_setValue('augment_session', null); // 清除临时存储
            
            showToast('✅ Session Cookie提取成功并已保存！', 'success');
            
            // 如果UI已初始化，刷新设置页面
            setTimeout(() => {
                const settingsTab = document.querySelector('[data-tab="settings"]');
                if (settingsTab) {
                    settingsTab.click(); // 自动切换到设置页面查看结果
                }
            }, 1000);
        }
    }
    
    // ==================== 初始化 ====================
    
    // 等待页面完全加载（包括所有资源）
    function waitForPageFullyLoaded() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                console.log('✅ 页面已完全加载（complete）');
                resolve();
            } else if (document.readyState === 'interactive') {
                console.log('⏳ 页面DOM已加载，等待资源加载完成...');
                window.addEventListener('load', () => {
                    console.log('✅ 页面资源加载完成（load事件）');
                    resolve();
                });
            } else {
                console.log('⏳ 页面加载中，等待DOM完成...');
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('✅ DOM加载完成，等待资源加载...');
                    window.addEventListener('load', () => {
                        console.log('✅ 所有资源加载完成');
                        resolve();
                    });
                });
            }
        });
    }
    
    // 额外延迟等待（确保页面JS执行完毕）
    function waitExtraTime(ms = 1000) {
        console.log(`⏰ 额外等待 ${ms}ms 确保页面完全稳定...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 检查UI是否存在
    function checkUIExists() {
        return document.querySelector('.stripe-helper-panel') !== null;
    }
    
    // 防覆盖监听器
    function setupAntiOverwriteMonitor(ui) {
        let checkCount = 0;
        const maxChecks = 10;
        
        const checkInterval = setInterval(() => {
            checkCount++;
            
            if (!checkUIExists()) {
                console.log('⚠️ 检测到UI被移除，重新创建...');
                clearInterval(checkInterval);
                
                // 安全地移除旧panel
                try {
                    if (ui.panel && ui.panel.parentNode) {
                        ui.panel.remove();
                    }
                } catch (e) {
                    console.log('移除旧panel时出错（可能已被删除）:', e.message);
                }
                
                // 重新创建UI
                ui.init();
                
                // 继续监听
                setupAntiOverwriteMonitor(ui);
            }
            
            if (checkCount >= maxChecks) {
                console.log('✅ UI稳定，停止定时检查（MutationObserver继续监听）');
                clearInterval(checkInterval);
            }
        }, 1000); // 每秒检查一次，持续10秒
    }
    
    // 使用MutationObserver监听DOM变化
    function setupMutationObserver(ui) {
        const observer = new MutationObserver((mutations) => {
            // 检查UI是否还在
            if (!checkUIExists()) {
                console.log('⚠️ MutationObserver检测到UI被移除');
                
                // 延迟重新创建，避免冲突
                setTimeout(() => {
                    if (!checkUIExists()) {
                        console.log('🔄 重新创建UI...');
                        
                        // 安全地移除旧panel
                        try {
                            if (ui.panel && ui.panel.parentNode) {
                                ui.panel.remove();
                            }
                        } catch (e) {
                            console.log('移除时出错:', e.message);
                        }
                        
                        // 重新初始化
                        ui.init();
                        
                        console.log('✅ UI已重新创建');
                    }
                }, 500);
            }
        });
        
        // 观察body的子元素变化
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: false
            });
            
            console.log('👀 已启动MutationObserver持续监听');
        }
        
        return observer;
    }
    
    // 初始化UI
    async function initStripeHelper() {
        const pageType = getCurrentPageType();
        console.log('🚀 Stripe智能填表助手 Pro v2.2.0');
        console.log('📍 当前页面类型:', pageType);
        console.log('⏳ 等待页面完全加载...');
        
        // 等待页面完全加载
        await waitForPageFullyLoaded();
        
        // 额外等待1秒，确保页面JS执行完毕
        await waitExtraTime(1000);
        
        console.log('✅ 页面已稳定，开始初始化脚本');
        console.log('✨ 功能：Augment自动注册、卡头标注、Session Cookie提取');
        
        // 如果在auth页面，处理Cookie提取
        if (pageType === 'auth') {
            handleAuthPageCookieExtraction();
            return; // auth页面不显示主UI
        }
        
        // 其他页面正常显示UI
        const ui = new StripeHelperUI();
        ui.init();
        
        console.log('✅ UI初始化完成');
        
        // 设置防覆盖监听
        setupAntiOverwriteMonitor(ui);
        
        // 设置MutationObserver
        setupMutationObserver(ui);
        
        // 检查是否刚从auth页面返回
        checkReturnFromAuth();
        
        console.log('🎉 Stripe智能填表助手已完全启动！');
    }
    
    // 立即执行初始化
    initStripeHelper();
})();
