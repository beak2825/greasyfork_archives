// ==UserScript==
// @name         Augment自动注册-私人域名
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Augment注册流程完全自动化 - 一键开始，全程自动（新增：域名均衡分布算法 + 菜单折叠功能）
// @author       Trace
// @match        *://auth.augmentcode.com/*
// @match        *://billing.augmentcode.com/*
// @match        *://*.augmentcode.com/*
// @match        *://checkout.stripe.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      tempmail.plus
// @connect      auth.augmentcode.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555780/Augment%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C-%E7%A7%81%E4%BA%BA%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/555780/Augment%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C-%E7%A7%81%E4%BA%BA%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 样式 ====================
    
    GM_addStyle(`
        /* 按钮容器 - 右下角固定（最高优先级） */
        #augment-register-buttons {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            pointer-events: auto !important;
            isolation: isolate !important;
        }
        
        /* 单个按钮样式（最高优先级） */
        .aug-step-btn {
            min-width: 200px !important;
            padding: 10px 16px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            position: relative !important;
            overflow: hidden !important;
            pointer-events: auto !important;
            z-index: inherit !important;
        }
        
        .aug-step-btn:hover {
            transform: translateX(-4px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }
        
        .aug-step-btn:active {
            transform: translateX(-2px);
        }
        
        .aug-step-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        /* 按钮图标 */
        .aug-step-btn .icon {
            font-size: 16px;
        }
        
        /* 重置按钮特殊样式 */
        .aug-step-btn.reset {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            min-width: 150px;
            font-size: 12px;
        }
        
        /* 一键自动注册按钮特殊样式 */
        .aug-step-btn.auto {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            min-width: 200px;
            font-weight: 700;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .aug-step-btn.auto:hover {
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.6);
        }

        /* 折叠/展开按钮特殊样式 */
        .aug-step-btn.toggle {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            min-width: 50px;
            padding: 8px 12px;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .aug-step-btn.toggle:hover {
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.6);
        }

        /* 按钮容器折叠状态 */
        #augment-register-buttons.collapsed .aug-step-btn:not(.toggle) {
            display: none !important;
        }

        #augment-register-buttons.collapsed {
            gap: 0 !important;
        }
        
        /* 状态提示框（最高优先级） */
        .aug-toast {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            min-width: 300px !important;
            max-width: 400px !important;
            padding: 16px !important;
            background: white !important;
            color: #1f2937 !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
            z-index: 2147483647 !important;
            animation: slideInRight 0.3s ease !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            line-height: 1.6 !important;
            pointer-events: auto !important;
            isolation: isolate !important;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .aug-toast.success {
            border-left: 4px solid #10b981 !important;
            background: #f0fdf4 !important;
            color: #166534 !important;
        }
        
        .aug-toast.error {
            border-left: 4px solid #ef4444 !important;
            background: #fef2f2 !important;
            color: #991b1b !important;
        }
        
        .aug-toast.info {
            border-left: 4px solid #0ea5e9 !important;
            background: #f0f9ff !important;
            color: #075985 !important;
        }
        
        .aug-toast.warning {
            border-left: 4px solid #f59e0b !important;
            background: #fffbeb !important;
            color: #92400e !important;
        }
        
        /* 步骤完成标记 */
        .aug-step-btn.completed::after {
            content: '✓';
            position: absolute;
            top: 4px;
            right: 8px;
            font-size: 12px;
            color: #10b981;
            background: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Cookie历史记录弹窗（最高优先级） */
        .aug-cookie-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.6) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            animation: fadeIn 0.3s ease !important;
            pointer-events: auto !important;
            isolation: isolate !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .aug-cookie-modal-content {
            background: white !important;
            border-radius: 16px !important;
            padding: 24px !important;
            max-width: 900px !important;
            width: 90% !important;
            max-height: 80vh !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            animation: slideUp 0.3s ease !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 1 !important;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .aug-cookie-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .aug-cookie-modal-title {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }
        
        .aug-cookie-modal-close {
            width: 32px;
            height: 32px;
            border: none;
            background: #f3f4f6;
            border-radius: 8px;
            cursor: pointer;
            font-size: 20px;
            color: #6b7280;
            transition: all 0.2s;
        }
        
        .aug-cookie-modal-close:hover {
            background: #e5e7eb;
            color: #1f2937;
        }
        
        .aug-cookie-modal-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .aug-cookie-action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .aug-cookie-action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .aug-cookie-action-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .aug-cookie-action-btn.danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }
        
        .aug-cookie-action-btn.danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .aug-cookie-list {
            flex: 1;
            overflow-y: auto;
            margin: 0;
            padding: 0;
        }
        
        .aug-cookie-item {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s;
        }
        
        .aug-cookie-item:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
            transform: translateX(-4px);
        }
        
        .aug-cookie-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .aug-cookie-item-time {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .aug-cookie-item-actions {
            display: flex;
            gap: 8px;
        }
        
        .aug-cookie-item-btn {
            padding: 4px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .aug-cookie-item-btn.copy {
            background: #10b981;
            color: white;
        }
        
        .aug-cookie-item-btn.copy:hover {
            background: #059669;
        }
        
        .aug-cookie-item-btn.delete {
            background: #ef4444;
            color: white;
        }
        
        .aug-cookie-item-btn.delete:hover {
            background: #dc2626;
        }
        
        .aug-cookie-item-value {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            word-break: break-all;
            color: #374151;
            border: 1px solid #e5e7eb;
            max-height: 80px;
            overflow-y: auto;
        }
        
        .aug-cookie-item-info {
            display: flex;
            gap: 16px;
            margin-top: 8px;
            font-size: 11px;
            color: #6b7280;
        }
        
        .aug-cookie-empty {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
        }
        
        .aug-cookie-empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }
        
        .aug-cookie-empty-text {
            font-size: 16px;
            font-weight: 500;
        }
    `);

    // ==================== 配置数据 ====================
    
    // 统一卡头配置（合并后的10个卡头，用于随机选择）
    const unifiedCardBins = [
        {
            id: 'bin1',
            prefix: "379240",
            name: "美国运通",
            totalLength: 15,
            cvcLength: 4,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin2',
            prefix: "623358",
            name: "银联卡-1",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin3',
            prefix: "622194",
            name: "银联卡-2",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin4',
            prefix: "623307",
            name: "银联卡-3",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin5',
            prefix: "623323",
            name: "银联卡-4",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin6',
            prefix: "623331",
            name: "银联卡-5",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin7',
            prefix: "623336",
            name: "银联卡-6",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin8',
            prefix: "623407",
            name: "银联卡-7",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin9',
            prefix: "626202",
            name: "银联卡-8",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        },
        {
            id: 'bin10',
            prefix: "628319",
            name: "银联卡-9",
            totalLength: 16,
            cvcLength: 3,
            enabled: true,
            autoSubmitEnabled: true
        }
    ];

    // 默认个人信息配置（中国真实地址）
    const defaultProfiles = [
        {
            id: 'profile1',
            name: '北京-朝阳',
            data: {
                billingName: '张伟',
                billingCountry: 'CN',
                billingPostalCode: '100020',
                billingAdministrativeArea: '北京市',
                billingLocality: '北京市',
                billingDependentLocality: '朝阳区',
                billingAddressLine1: '建国路88号SOHO现代城'
            }
        },
        {
            id: 'profile2',
            name: '上海-浦东',
            data: {
                billingName: '李娜',
                billingCountry: 'CN',
                billingPostalCode: '200120',
                billingAdministrativeArea: '上海市',
                billingLocality: '上海市',
                billingDependentLocality: '浦东新区',
                billingAddressLine1: '世纪大道1001号'
            }
        },
        {
            id: 'profile3',
            name: '深圳-南山',
            data: {
                billingName: '王芳',
                billingCountry: 'CN',
                billingPostalCode: '518057',
                billingAdministrativeArea: '广东省',
                billingLocality: '深圳市',
                billingDependentLocality: '南山区',
                billingAddressLine1: '科技园南区深南大道9988号'
            }
        },
        {
            id: 'profile4',
            name: '广州-天河',
            data: {
                billingName: '刘洋',
                billingCountry: 'CN',
                billingPostalCode: '510630',
                billingAdministrativeArea: '广东省',
                billingLocality: '广州市',
                billingDependentLocality: '天河区',
                billingAddressLine1: '天河路208号天河城广场'
            }
        },
        {
            id: 'profile5',
            name: '杭州-西湖',
            data: {
                billingName: '陈静',
                billingCountry: 'CN',
                billingPostalCode: '310013',
                billingAdministrativeArea: '浙江省',
                billingLocality: '杭州市',
                billingDependentLocality: '西湖区',
                billingAddressLine1: '文一西路998号海创园'
            }
        },
        {
            id: 'profile6',
            name: '成都-高新',
            data: {
                billingName: '赵强',
                billingCountry: 'CN',
                billingPostalCode: '610041',
                billingAdministrativeArea: '四川省',
                billingLocality: '成都市',
                billingDependentLocality: '高新区',
                billingAddressLine1: '天府大道中段1号'
            }
        },
        {
            id: 'profile7',
            name: '武汉-光谷',
            data: {
                billingName: '周敏',
                billingCountry: 'CN',
                billingPostalCode: '430074',
                billingAdministrativeArea: '湖北省',
                billingLocality: '武汉市',
                billingDependentLocality: '洪山区',
                billingAddressLine1: '光谷大道61号智慧园'
            }
        },
        {
            id: 'profile8',
            name: '南京-江宁',
            data: {
                billingName: '吴涛',
                billingCountry: 'CN',
                billingPostalCode: '211100',
                billingAdministrativeArea: '江苏省',
                billingLocality: '南京市',
                billingDependentLocality: '江宁区',
                billingAddressLine1: '秣周东路9号'
            }
        },
        {
            id: 'profile9',
            name: '西安-雁塔',
            data: {
                billingName: '郑磊',
                billingCountry: 'CN',
                billingPostalCode: '710061',
                billingAdministrativeArea: '陕西省',
                billingLocality: '西安市',
                billingDependentLocality: '雁塔区',
                billingAddressLine1: '高新路52号科技大厦'
            }
        },
        {
            id: 'profile10',
            name: '重庆-渝北',
            data: {
                billingName: '孙丽',
                billingCountry: 'CN',
                billingPostalCode: '401120',
                billingAdministrativeArea: '重庆市',
                billingLocality: '重庆市',
                billingDependentLocality: '渝北区',
                billingAddressLine1: '黄山大道中段66号'
            }
        },
        {
            id: 'profile11',
            name: '苏州-工业园',
            data: {
                billingName: '林浩',
                billingCountry: 'CN',
                billingPostalCode: '215021',
                billingAdministrativeArea: '江苏省',
                billingLocality: '苏州市',
                billingDependentLocality: '工业园区',
                billingAddressLine1: '星湖街328号创意产业园'
            }
        },
        {
            id: 'profile12',
            name: '天津-滨海',
            data: {
                billingName: '何晨',
                billingCountry: 'CN',
                billingPostalCode: '300450',
                billingAdministrativeArea: '天津市',
                billingLocality: '天津市',
                billingDependentLocality: '滨海新区',
                billingAddressLine1: '新华路88号'
            }
        },
        {
            id: 'profile13',
            name: '南京-鼓楼',
            data: {
                billingName: '黄伟',
                billingCountry: 'CN',
                billingPostalCode: '210009',
                billingAdministrativeArea: '江苏省',
                billingLocality: '南京市',
                billingDependentLocality: '鼓楼区',
                billingAddressLine1: '中山路199号'
            }
        },
        {
            id: 'profile14',
            name: '厦门-思明',
            data: {
                billingName: '谢婷',
                billingCountry: 'CN',
                billingPostalCode: '361001',
                billingAdministrativeArea: '福建省',
                billingLocality: '厦门市',
                billingDependentLocality: '思明区',
                billingAddressLine1: '湖滨南路76号'
            }
        },
        {
            id: 'profile15',
            name: '长沙-岳麓',
            data: {
                billingName: '马超',
                billingCountry: 'CN',
                billingPostalCode: '410013',
                billingAdministrativeArea: '湖南省',
                billingLocality: '长沙市',
                billingDependentLocality: '岳麓区',
                billingAddressLine1: '麓山南路36号'
            }
        },
        {
            id: 'profile16',
            name: '青岛-崂山',
            data: {
                billingName: '许静',
                billingCountry: 'CN',
                billingPostalCode: '266101',
                billingAdministrativeArea: '山东省',
                billingLocality: '青岛市',
                billingDependentLocality: '崂山区',
                billingAddressLine1: '海尔路1号创新园'
            }
        },
        {
            id: 'profile17',
            name: '郑州-金水',
            data: {
                billingName: '石军',
                billingCountry: 'CN',
                billingPostalCode: '450003',
                billingAdministrativeArea: '河南省',
                billingLocality: '郑州市',
                billingDependentLocality: '金水区',
                billingAddressLine1: '金水路288号'
            }
        },
        {
            id: 'profile18',
            name: '大连-高新园',
            data: {
                billingName: '罗敏',
                billingCountry: 'CN',
                billingPostalCode: '116023',
                billingAdministrativeArea: '辽宁省',
                billingLocality: '大连市',
                billingDependentLocality: '高新园区',
                billingAddressLine1: '黄浦路531号'
            }
        },
        {
            id: 'profile19',
            name: '宁波-鄞州',
            data: {
                billingName: '钱芳',
                billingCountry: 'CN',
                billingPostalCode: '315100',
                billingAdministrativeArea: '浙江省',
                billingLocality: '宁波市',
                billingDependentLocality: '鄞州区',
                billingAddressLine1: '钱湖南路8号'
            }
        },
        {
            id: 'profile20',
            name: '合肥-蜀山',
            data: {
                billingName: '曹亮',
                billingCountry: 'CN',
                billingPostalCode: '230031',
                billingAdministrativeArea: '安徽省',
                billingLocality: '合肥市',
                billingDependentLocality: '蜀山区',
                billingAddressLine1: '黄山路468号通和大厦'
            }
        }
    ];

    // TempMail.Plus 配置（私有服务器配置）
    const TEMPMAIL_CONFIG = {
        email: 'chaogei666@mailto.plus',
        epin: '9825369',
        domains: [
            'gfnbajbskjdsa.dns.army',
            'augment.dns.army',
            'augment.dns.navy',
            'augment.v6.army',
            'augment.v6.navy'
        ],
        baseUrl: 'https://tempmail.plus/api'
    };

    // ==================== 数据管理器 ====================
    
    const DataManager = {
        // 获取卡头列表
        getCardBins() {
            const saved = GM_getValue('cardBins_standalone');
            return saved ? JSON.parse(saved) : unifiedCardBins;
        },

        // 保存卡头列表
        saveCardBins(bins) {
            GM_setValue('cardBins_standalone', JSON.stringify(bins));
        },

        // 获取启用的卡头
        getEnabledCardBins() {
            return this.getCardBins().filter(b => b.enabled);
        },

        // 获取标注用于自动提交的卡头（使用统一的卡头列表）
        getAutoSubmitCardBins() {
            // 使用统一的卡头列表（10个卡头）
            const enabledBins = unifiedCardBins.filter(b => b.enabled && b.autoSubmitEnabled);
            console.log(`🎯 使用统一卡头列表，共 ${enabledBins.length} 个可用卡头`);
            return enabledBins;
        },
        
        // 获取配置列表
        getProfiles() {
            const saved = GM_getValue('profiles_standalone');
            return saved ? JSON.parse(saved) : defaultProfiles;
        },
        
        // 保存配置列表
        saveProfiles(profiles) {
            GM_setValue('profiles_standalone', JSON.stringify(profiles));
        },
        
        // 添加历史记录
        addHistory(record) {
            const history = this.getHistory();
            record.id = Date.now();
            record.timestamp = new Date().toISOString();
            history.unshift(record);
            if (history.length > 50) {
                history.splice(50);
            }
            GM_setValue('history_standalone', JSON.stringify(history));
        },
        
        // 获取历史记录
        getHistory() {
            const saved = GM_getValue('history_standalone');
            return saved ? JSON.parse(saved) : [];
        },
        
        // ========== Session Cookie 管理 ==========
        
        // 保存Session Cookie
        saveSessionCookie(cookie) {
            GM_setValue('sessionCookie_standalone', JSON.stringify({
                cookie: cookie,
                timestamp: new Date().toISOString(),
                domain: 'auth.augmentcode.com'
            }));
            console.log('💾 Session Cookie已保存到本地存储');
            
            // 同时添加到历史记录
            this.addSessionCookieHistory(cookie);
        },
        
        // 获取Session Cookie
        getSessionCookie() {
            const saved = GM_getValue('sessionCookie_standalone');
            return saved ? JSON.parse(saved) : null;
        },
        
        // 删除Session Cookie
        deleteSessionCookie() {
            GM_deleteValue('sessionCookie_standalone');
            console.log('🗑️ Session Cookie已删除');
        },
        
        // ========== Session Cookie 历史记录管理 ==========
        
        // 添加Session Cookie历史记录
        addSessionCookieHistory(cookie) {
            const history = this.getSessionCookieHistory();
            
            // 尝试获取当前注册的邮箱
            const email = GM_getValue('augment_register_email', '') || 
                         GM_getValue('augment_register_email_for_cookie', '') ||
                         '未知账户';
            
            const newRecord = {
                id: Date.now(),
                cookie: cookie,
                timestamp: new Date().toISOString(),
                domain: 'auth.augmentcode.com',
                length: cookie.length,
                email: email  // 新增：关联的邮箱账户
            };
            
            // 添加到列表开头
            history.unshift(newRecord);
            
            // 最多保存100条记录
            if (history.length > 100) {
                history.splice(100);
            }
            
            GM_setValue('sessionCookieHistory_standalone', JSON.stringify(history));
            console.log('✅ Session Cookie已添加到历史记录, 总数:', history.length);
            console.log('   关联账户:', email);
        },
        
        // 获取Session Cookie历史记录
        getSessionCookieHistory() {
            const saved = GM_getValue('sessionCookieHistory_standalone');
            return saved ? JSON.parse(saved) : [];
        },
        
        // 清除Session Cookie历史记录
        clearSessionCookieHistory() {
            GM_setValue('sessionCookieHistory_standalone', JSON.stringify([]));
            console.log('🗑️ Session Cookie历史记录已清除');
        },
        
        // 删除单条Session Cookie历史记录
        deleteSessionCookieHistoryItem(id) {
            const history = this.getSessionCookieHistory();
            const filtered = history.filter(item => item.id !== id);
            GM_setValue('sessionCookieHistory_standalone', JSON.stringify(filtered));
            console.log('🗑️ 已删除Session Cookie历史记录:', id);
        }
    };

    // ==================== TempMail API ====================

    const TempEmailAPI = {
        // 域名使用计数器（用于均衡分布）
        domainUsageCount: {},

        // 初始化域名使用计数器
        initDomainUsageCount() {
            if (Object.keys(this.domainUsageCount).length === 0) {
                TEMPMAIL_CONFIG.domains.forEach(domain => {
                    this.domainUsageCount[domain] = 0;
                });
            }
        },

        // 高质量随机域名选择（基于使用次数均衡分布）
        selectRandomDomain() {
            this.initDomainUsageCount();

            // 找出使用次数最少的域名
            const minUsage = Math.min(...Object.values(this.domainUsageCount));
            const leastUsedDomains = TEMPMAIL_CONFIG.domains.filter(
                domain => this.domainUsageCount[domain] === minUsage
            );

            // 从使用次数最少的域名中随机选择一个
            // 使用时间戳增强随机性
            const timestamp = Date.now();
            const randomSeed = (timestamp % 1000) + Math.random() * 1000;
            const index = Math.floor(randomSeed % leastUsedDomains.length);
            const selectedDomain = leastUsedDomains[index];

            // 增加该域名的使用计数
            this.domainUsageCount[selectedDomain]++;

            console.log('🎲 域名选择统计:', this.domainUsageCount);
            console.log('✅ 选中域名:', selectedDomain);

            return selectedDomain;
        },

        // 英文名字词库（用于生成邮箱前缀）
        firstNames: [
            'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph',
            'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald',
            'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george',
            'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary',
            'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon',
            'benjamin', 'samuel', 'raymond', 'gregory', 'frank', 'alexander', 'patrick', 'jack',
            'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'henry', 'nathan',
            'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold',
            'keith', 'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean',
            'austin', 'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe', 'jordan',
            'billy', 'bruce', 'albert', 'willie', 'gabriel', 'logan', 'alan', 'juan',
            'ralph', 'roy', 'eugene', 'randy', 'vincent', 'russell', 'louis', 'philip',
            'bobby', 'johnny', 'bradley', 'mary', 'patricia', 'jennifer', 'linda', 'barbara',
            'elizabeth', 'susan', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty',
            'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy',
            'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura',
            'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela',
            'emma', 'nicole', 'helen', 'samantha', 'katherine', 'christine', 'debra', 'rachel',
            'catherine', 'carolyn', 'janet', 'ruth', 'maria', 'heather', 'diane', 'virginia',
            'julie', 'joyce', 'victoria', 'olivia', 'kelly', 'christina', 'lauren', 'joan',
            'evelyn', 'judith', 'megan', 'cheryl', 'andrea', 'hannah', 'jacqueline', 'martha',
            'gloria', 'teresa', 'sara', 'janice', 'jean', 'alice', 'kathryn', 'doris',
            'madison', 'abigail', 'sophia', 'grace', 'natalie', 'chloe', 'ella', 'avery'
        ],

        middleNames: [
            'lee', 'ann', 'marie', 'lynn', 'rose', 'jean', 'mae', 'ray',
            'james', 'michael', 'john', 'david', 'allen', 'wayne', 'scott', 'thomas',
            'alexander', 'joseph', 'william', 'robert', 'charles', 'edward', 'paul', 'anthony',
            'grace', 'elizabeth', 'jane', 'louise', 'claire', 'nicole', 'renee', 'michelle',
            'christine', 'anne', 'catherine', 'frances', 'victoria', 'margaret', 'patricia', 'susan',
            'kay', 'joy', 'faith', 'hope', 'dawn', 'eve', 'belle', 'may',
            'june', 'april', 'autumn', 'summer', 'winter', 'sky', 'star', 'pearl',
            'ruby', 'jade', 'amber', 'crystal', 'diamond', 'emerald', 'sapphire', 'ivory',
            'sage', 'river', 'lake', 'forest', 'meadow', 'brook', 'dale', 'glen',
            'ridge', 'stone', 'wood', 'field', 'hill', 'vale', 'marsh', 'heath',
            'chase', 'hunter', 'archer', 'knight', 'king', 'prince', 'duke', 'earl',
            'baron', 'lord', 'noble', 'royal', 'crown', 'throne', 'reign', 'empire',
            'phoenix', 'dragon', 'eagle', 'hawk', 'falcon', 'raven', 'wolf', 'bear',
            'lion', 'tiger', 'panther', 'leopard', 'jaguar', 'cougar', 'lynx', 'fox'
        ],

        lastNames: [
            'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis',
            'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson', 'thomas',
            'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson', 'white',
            'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson', 'walker', 'young',
            'allen', 'king', 'wright', 'scott', 'torres', 'nguyen', 'hill', 'flores',
            'green', 'adams', 'nelson', 'baker', 'hall', 'rivera', 'campbell', 'mitchell',
            'carter', 'roberts', 'gomez', 'phillips', 'evans', 'turner', 'diaz', 'parker',
            'cruz', 'edwards', 'collins', 'reyes', 'stewart', 'morris', 'morales', 'murphy',
            'cook', 'rogers', 'gutierrez', 'ortiz', 'morgan', 'cooper', 'peterson', 'bailey',
            'reed', 'kelly', 'howard', 'ramos', 'kim', 'cox', 'ward', 'richardson',
            'watson', 'brooks', 'chavez', 'wood', 'james', 'bennett', 'gray', 'mendoza',
            'ruiz', 'hughes', 'price', 'alvarez', 'castillo', 'sanders', 'patel', 'myers',
            'long', 'ross', 'foster', 'jimenez', 'powell', 'jenkins', 'perry', 'russell',
            'sullivan', 'bell', 'coleman', 'butler', 'henderson', 'barnes', 'gonzales', 'fisher',
            'vasquez', 'simmons', 'romero', 'jordan', 'patterson', 'alexander', 'hamilton', 'graham',
            'reynolds', 'griffin', 'wallace', 'west', 'cole', 'hayes', 'bryant', 'herrera',
            'gibson', 'ellis', 'tran', 'medina', 'aguilar', 'stevens', 'murray', 'ford',
            'castro', 'marshall', 'owens', 'harrison', 'fernandez', 'mcdonald', 'woods', 'washington'
        ],

        // 生成随机邮箱前缀（人名组合 + 随机数字后缀）
        generateEmailPrefix() {
            // 从各个词库中随机选择
            const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
            const middleName = this.middleNames[Math.floor(Math.random() * this.middleNames.length)];
            const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];

            // 生成3-4位随机数字后缀（范围：100-9999）
            const randomSuffix = Math.floor(Math.random() * 9900) + 100;

            return `${firstName}_${middleName}_${lastName}${randomSuffix}`;
        },

        // 生成随机邮箱
        async generateRandomEmail() {
            try {
                const username = this.generateEmailPrefix();

                // 使用改进的域名选择算法（均衡分布）
                const domain = this.selectRandomDomain();
                const email = `${username}@${domain}`;

                console.log('📧 生成临时邮箱:', email);
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
        
        // 删除单个邮件（使用TempMail.Plus API）
        async deleteEmail(mailId) {
            return new Promise((resolve, reject) => {
                const url = `${TEMPMAIL_CONFIG.baseUrl}/mails/${mailId}`;
                const params = `email=${encodeURIComponent(TEMPMAIL_CONFIG.email)}&epin=${TEMPMAIL_CONFIG.epin}`;
                
                console.log('🗑️ 删除邮件 ID:', mailId);
                console.log('🗑️ 删除请求 URL:', url);
                
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
                                console.log('✅ 邮件删除成功 ID:', mailId);
                                resolve(true);
                            } else {
                                console.log('⚠️ 邮件删除失败 ID:', mailId);
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

        // 从邮件中提取验证码
        extractVerificationCode(text, html) {
            const patterns = [
                { regex: /Your verification code is:\s*<b>(\d{6})<\/b>/i, desc: 'Augment HTML格式' },
                { regex: /Your verification code is:\s*(\d{6})/i, desc: 'Augment 文本格式' },
                { regex: /verification code is:\s*(\d{6})/i, desc: '验证码 is 格式' },
                { regex: /验证码。\s*\n\s*\n\s*(\d{6})/m, desc: 'Cursor 中文格式' },
                { regex: /\n\s*\n\s*(\d{6})\s*\n\s*\n/m, desc: '独立一行的6位数字' },
                { regex: /验证码[：:]\s*(\d{6})/i, desc: '验证码：123456' },
                { regex: /code[：:]\s*(\d{6})/i, desc: 'code: 123456' },
                { regex: /\b(\d{6})\b/, desc: '任意6位数字' }
            ];
            
            if (text) {
                for (const { regex, desc } of patterns) {
                    const match = text.match(regex);
                    if (match && match[1]) {
                        console.log(`🔑 使用模式 [${desc}] 提取到验证码: ${match[1]}`);
                        return match[1];
                    }
                }
            }
            
            if (html) {
                for (const { regex, desc } of patterns) {
                    const match = html.match(regex);
                    if (match && match[1]) {
                        console.log(`🔑 使用模式 [${desc}] 从HTML提取到验证码: ${match[1]}`);
                        return match[1];
                    }
                }
            }
            
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

        // 等待接收验证码邮件（轮询TempMail.Plus - 新策略：匹配收件人邮箱并立即删除）
        async waitForVerificationCode(generatedEmail, maxWaitTime = 120000, checkInterval = 3000) {
            console.log('📬 开始等待验证码邮件（使用TempMail.Plus）...');
            
            // 清理和规范化目标邮箱地址
            const targetEmail = (generatedEmail || '').trim().toLowerCase();
            if (!targetEmail) {
                throw new Error('目标邮箱地址为空！');
            }
            
            console.log('📧 目标邮箱（已规范化）:', targetEmail);
            console.log('📧 原始邮箱参数:', generatedEmail);
            console.log('📮 查询主邮箱:', TEMPMAIL_CONFIG.email);
            console.log('💡 新策略：遍历邮件列表，匹配to字段确认收件人，处理后立即删除');
            
            // 记录开始时间
            const startTime = Date.now();
            const startTimeStr = new Date(startTime).toLocaleString('zh-CN');
            console.log('🕒 请求发起时间:', startTimeStr);
            
            while (Date.now() - startTime < maxWaitTime) {
                try {
                    // 每次都从 first_id=0 获取最新邮件
                    const result = await this.getInbox(generatedEmail, 0);
                    
                    if (result.success && result.mails && result.mails.length > 0) {
                        console.log(`📨 获取到 ${result.mails.length} 封邮件`);
                        
                        // 遍历所有邮件，查找匹配目标邮箱的邮件
                        let foundCode = false;
                        let code = null;
                        let processedMailIds = [];
                        
                        for (const mail of result.mails) {
                            const fromMail = mail.from_mail || mail.from || '';
                            const toMail = mail.to || '';
                            const subject = mail.subject || '';
                            const mailId = mail.mail_id || mail.id;
                            const mailTime = mail.time || '';
                            
                            console.log(`\n📧 检查邮件 [ID: ${mailId}]:`);
                            console.log(`   邮件对象包含的字段:`, Object.keys(mail));
                            console.log(`   发件人: ${fromMail}`);
                            console.log(`   收件人: ${toMail}`);
                            console.log(`   主题: ${subject || '(无主题)'}`);
                            console.log(`   时间: ${mailTime}`);
                            
                            // 如果邮件列表中没有to字段，需要读取详情获取
                            let actualToMail = toMail;
                            let fullMessage = null;
                            
                            if (!actualToMail) {
                                console.log('⚠️ 邮件列表中没有to字段，读取详情获取...');
                                try {
                                    fullMessage = await this.readEmail(mailId);
                                    actualToMail = fullMessage.to || '';
                                    console.log(`   从详情获取收件人: ${actualToMail}`);
                                } catch (error) {
                                    console.error('❌ 读取邮件详情失败:', error);
                                    continue;
                                }
                            }
                            
                            // 规范化实际收件人邮箱（去除空格、转小写）
                            const normalizedToMail = (actualToMail || '').trim().toLowerCase();
                            
                            // 检查收件人是否匹配目标邮箱
                            if (normalizedToMail === targetEmail) {
                                console.log('✅ 收件人匹配目标邮箱！');
                                
                                // 验证是否为Augment/Cursor验证邮件
                                if (this.isValidMail(fromMail, actualToMail, subject)) {
                                    console.log('✅ 确认为有效验证邮件，读取详情...');
                                    
                                    try {
                                        // 如果还没有读取邮件详情，现在读取
                                        if (!fullMessage) {
                                            fullMessage = await this.readEmail(mailId);
                                        }
                                        
                                        // 调试：输出邮件详情的完整数据结构
                                        console.log('📋 邮件详情数据结构:', Object.keys(fullMessage));
                                        console.log('📝 text字段长度:', (fullMessage.text || '').length);
                                        console.log('📝 html字段长度:', (fullMessage.html || '').length);
                                        
                                        // 如果有text内容，显示前500个字符
                                        if (fullMessage.text) {
                                            console.log('📄 text内容预览:', fullMessage.text.substring(0, 500));
                                        }
                                        
                                        code = this.extractVerificationCode(fullMessage.text || '', fullMessage.html || '');
                                        
                                        if (code) {
                                            console.log('✅ 成功提取验证码:', code);
                                            foundCode = true;
                                            processedMailIds.push(mailId);
                                            // 找到验证码后跳出循环
                                            break;
                                        } else {
                                            console.log('⚠️ 未能从邮件中提取到验证码');
                                            console.log('⚠️ 请检查上方输出的邮件内容');
                                        }
                                    } catch (error) {
                                        console.error('❌ 读取邮件内容失败:', error);
                                    }
                                } else {
                                    console.log('⚠️ 不是目标验证邮件');
                                }
                            } else {
                                console.log(`⚠️ 收件人不匹配`);
                                console.log(`   期望: ${targetEmail}`);
                                console.log(`   实际: ${normalizedToMail}`);
                                console.log(`   原始: ${actualToMail}`);
                            }
                        }
                        
                        // 如果成功提取到验证码，删除邮件后返回
                        if (foundCode && code) {
                            console.log('🎉 验证码提取成功！');
                            
                            // 删除已处理的单个邮件（使用mailId）
                            if (processedMailIds.length > 0) {
                                const mailIdToDelete = processedMailIds[0];
                                console.log('🗑️ 删除已确认的验证码邮件 ID:', mailIdToDelete);
                                try {
                                    await this.deleteEmail(mailIdToDelete);
                                    console.log('✅ 邮件已删除');
                                } catch (error) {
                                    console.error('⚠️ 删除邮件失败:', error);
                                    // 删除失败不影响返回验证码
                                }
                            }
                            
                            console.log('🎉 结束等待，返回验证码');
                            return code;
                        }
                        
                        // 否则继续等待下一批邮件
                        console.log('⏳ 继续等待下一批邮件...');
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
            
            throw new Error('等待验证码超时（120秒）');
        }
    };

    // ==================== Turnstile验证码检测 ====================
    
    // 检测Turnstile验证码是否成功（包括shadow-root）
    function checkTurnstileSuccess() {
        try {
            // 方法1：检查captcha hidden input（最可靠）
            const captchaInput = document.querySelector('input[name="captcha"]');
            if (captchaInput && captchaInput.value && captchaInput.value.length > 10) {
                return { success: true, method: 'captcha input', value: captchaInput.value.substring(0, 20) + '...' };
            }
            
            // 方法2：检查cf-turnstile-response
            const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]');
            if (turnstileInput && turnstileInput.value && turnstileInput.value.length > 10) {
                return { success: true, method: 'cf-turnstile-response', value: turnstileInput.value.substring(0, 20) + '...' };
            }
            
            // 方法3：遍历所有元素查找shadow-root
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                if (element.shadowRoot) {
                    try {
                        // 在shadow-root中查找success元素
                        const successDiv = element.shadowRoot.querySelector('#success');
                        const successContainer = element.shadowRoot.querySelector('.ob-container[role="alert"][style*="grid"]');
                        
                        if (successDiv) {
                            return { success: true, method: 'shadow-root #success', element: successDiv };
                        }
                        
                        if (successContainer) {
                            return { success: true, method: 'shadow-root success container', element: successContainer };
                        }
                    } catch (e) {
                        // shadow-root可能是closed，无法访问
                    }
                }
            }
            
            // 方法4：检查Continue按钮是否可点击（间接判断）
            const continueBtn = document.querySelector('button[type="submit"]');
            if (continueBtn && !continueBtn.disabled) {
                // 再次确认captcha input
                const captcha = document.querySelector('input[name="captcha"]');
                if (captcha && captcha.value) {
                    return { success: true, method: 'continue button enabled', value: 'button ready' };
                }
            }
            
            return { success: false };
            
        } catch (e) {
            console.error('检测Turnstile时出错:', e);
            return { success: false };
        }
    }
    
    // ==================== 工具函数 ====================

    // 随机选择一个启用的卡BIN（使用统一的卡头列表）
    function getRandomCardBin() {
        // 使用统一的卡头列表（10个卡头）
        const enabled = unifiedCardBins.filter(b => b.enabled);
        if (enabled.length === 0) {
            console.warn('⚠️ 没有启用的卡头，使用第一个卡头');
            return unifiedCardBins[0];
        }
        const randomIndex = Math.floor(Math.random() * enabled.length);
        const selectedBin = enabled[randomIndex];
        console.log(`🎲 从统一卡头列表随机选择: ${selectedBin.prefix} (${selectedBin.name})`);
        return selectedBin;
    }
    
    // 生成随机月份
    function generateRandomMonth() {
        return String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    }
    
    // 生成随机年份
    function generateRandomYear() {
        const currentYear = new Date().getFullYear();
        return String(currentYear + Math.floor(Math.random() * 5) + 1).slice(-2);
    }
    
    // 生成随机CVC
    function generateRandomCVC(length) {
        const max = Math.pow(10, length) - 1;
        return String(Math.floor(Math.random() * max)).padStart(length, '0');
    }
    
    // Luhn算法生成有效信用卡号
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

    // 可靠地设置输入框的值（触发所有必要事件）
    function setInputValueReliably(input, value) {
        input.focus();
        input.value = value;
        
        const events = ['input', 'change', 'blur', 'focus', 'keydown', 'keyup', 'keypress'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
        });
        
        // React特殊处理
        try {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
            
            const reactEvent = new Event('input', { bubbles: true });
            reactEvent.simulated = true;
            input.dispatchEvent(reactEvent);
            
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
        } catch (e) {
            // 忽略错误
        }
        
        return input.value === value;
    }

    // 可靠地设置下拉框的值
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

    // 填写字段（自动识别类型）
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

    // 填写信用卡字段（支持Stripe和iframe）
    function fillCreditCardFields(cardNumber, expiry, cvc) {
        console.log('🔍 尝试填写信用卡字段...');
        
        const cardFields = [
            { 
                selectors: [
                    'input[data-elements-stable-field-name="cardNumber"]',
                    'input[autocomplete="cc-number"]',
                    'input[placeholder*="card number"]',
                    'input[placeholder*="Card number"]',
                    'input[name="cardnumber"]',
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
                    'input[placeholder*="MM"]',
                    'input[name="exp-date"]',
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
                    'input[placeholder*="CVC"]',
                    'input[placeholder*="CVV"]',
                    'input[name="cvc"]',
                    '#cardCvc'
                ], 
                value: cvc,
                name: 'CVC'
            }
        ];
        
        cardFields.forEach(field => {
            let element = null;
            
            // 尝试多个选择器
            for (const selector of field.selectors) {
                element = document.querySelector(selector);
                if (element) {
                    console.log(`✅ 找到${field.name}输入框:`, selector);
                    break;
                }
            }
            
            // 尝试在iframe中查找
            if (!element) {
                const iframes = document.querySelectorAll('iframe');
                for (const iframe of iframes) {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        for (const selector of field.selectors) {
                            element = iframeDoc.querySelector(selector);
                            if (element) {
                                console.log(`✅ 在iframe中找到${field.name}输入框:`, selector);
                                break;
                            }
                        }
                        if (element) break;
                    } catch (e) {
                        // 跨域iframe无法访问，忽略
                    }
                }
            }
            
            if (element) {
                if (setInputValueReliably(element, field.value)) {
                    console.log(`✅ 已填写: ${field.name} (${field.value})`);
                } else {
                    console.log(`⚠️ 填写可能失败: ${field.name}`);
                }
            } else {
                console.log(`❌ 未找到字段: ${field.name}`);
            }
        });
    }

    // 点击提交按钮
    function clickSubmitButton() {
        console.log('🔍 开始查找并点击提交按钮...');
        
        let submitButton = null;
        
        // 策略1: 通过data-testid精确查找
        const testIdSelectors = [
            'button[data-testid="hosted-payment-submit-button"]',
            '[data-testid="hosted-payment-submit-button"]',
            'button[data-testid*="submit-button"]',
            '[data-testid*="submit"]'
        ];
        
        for (const selector of testIdSelectors) {
            submitButton = document.querySelector(selector);
            if (submitButton && submitButton.offsetParent !== null) {
                console.log(`✅ 通过data-testid找到提交按钮`);
                break;
            }
        }
        
        // 策略2: 通过类名和type属性组合查找
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
                for (const btn of buttons) {
                    if (!btn.disabled && btn.offsetParent !== null) {
                        submitButton = btn;
                        console.log(`✅ 通过类名找到提交按钮`);
                        break;
                    }
                }
                if (submitButton) break;
            }
        }
        
        // 策略3: 通过文本内容查找
        if (!submitButton) {
            const textPatterns = ['保存银行卡', '处理中', 'Submit', 'Pay', 'Subscribe', '订阅', '支付', 'Continue', '继续'];
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
        
        // 执行点击
        if (submitButton) {
            console.log('🎯 找到提交按钮，准备点击...');
            
            try {
                // 确保按钮可见
                submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
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
                        new PointerEvent('pointerup', { bubbles: true, cancelable: true })
                    ];
                    
                    events.forEach(event => {
                        try {
                            submitButton.dispatchEvent(event);
                        } catch (e) {
                            // 忽略错误
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
            console.log('❌ 未找到提交按钮');
            return false;
        }
    }

    // 可靠的表单填写函数（完整版）
    function reliableFillForm(profileData, cardNumber, expiry, cvc, cardType, autoSubmit = false) {
        console.log(`🚀 开始填写表单，卡类型: ${cardType}, 卡号: ${cardNumber}`);
        
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
                console.log(`⚠️ 未找到字段: ${field.name}`);
            }
        });
        
        // 填写信用卡字段
        fillCreditCardFields(cardNumber, expiry, cvc);
        
        console.log(`✅ 填写完成，成功填写 ${filledCount} 个字段`);
        
        // 根据autoSubmit参数决定是否自动提交
        if (autoSubmit) {
            setTimeout(() => {
                console.log('⏰ 延迟执行提交操作...');
                const submitSuccess = clickSubmitButton();
                
                if (submitSuccess) {
                    console.log('✅ 表单已自动提交');
                } else {
                    console.log('⚠️ 自动提交失败，尝试重试...');
                    // 重试一次
                    setTimeout(() => {
                        console.log('🔄 尝试第二次提交...');
                        clickSubmitButton();
                    }, 2000);
                }
            }, 1500); // 1.5秒延迟，确保所有字段都已正确填充
        } else {
            console.log('ℹ️ 仅填表模式，不执行自动提交');
        }
        
        return true;
    }

    // 显示Toast提示消息
    function showMessage(text, type = 'info', duration = 5000) {
        // 移除已存在的toast
        const existingToast = document.querySelector('.aug-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新toast
        const toast = document.createElement('div');
        toast.className = `aug-toast ${type}`;
        toast.innerHTML = text;
        
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    // ==================== Cookie历史记录管理 ====================
    
    // 复制文本到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('复制失败:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
    
    // 格式化时间戳
    function formatTimestamp(isoString) {
        try {
            const date = new Date(isoString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (e) {
            return isoString;
        }
    }
    
    // 显示Cookie历史记录弹窗
    function showCookieHistoryModal() {
        // 检查是否已存在弹窗
        const existingModal = document.querySelector('.aug-cookie-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const history = DataManager.getSessionCookieHistory();
        console.log('📋 当前Cookie历史记录数量:', history.length);
        
        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'aug-cookie-modal';
        modal.innerHTML = `
            <div class="aug-cookie-modal-content" onclick="event.stopPropagation()">
                <div class="aug-cookie-modal-header">
                    <div class="aug-cookie-modal-title">Session Cookie 历史记录 (${history.length})</div>
                    <button class="aug-cookie-modal-close">×</button>
                </div>
                
                <div class="aug-cookie-modal-actions">
                    <button class="aug-cookie-action-btn primary" id="aug-copy-all-cookies">
                        批量复制 (${history.length})
                    </button>
                    <button class="aug-cookie-action-btn danger" id="aug-clear-all-cookies">
                        清除全部
                    </button>
                </div>
                
                <div class="aug-cookie-list" id="aug-cookie-list">
                    ${history.length === 0 ? `
                        <div class="aug-cookie-empty">
                            <div class="aug-cookie-empty-icon">🍪</div>
                            <div class="aug-cookie-empty-text">暂无Cookie历史记录</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 渲染Cookie列表
        if (history.length > 0) {
            renderCookieList(history);
        }
        
        // 绑定事件
        // 1. 点击背景关闭
        modal.addEventListener('click', () => {
            modal.remove();
        });
        
        // 2. 点击关闭按钮
        modal.querySelector('.aug-cookie-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // 3. 批量复制
        modal.querySelector('#aug-copy-all-cookies').addEventListener('click', () => {
            if (history.length === 0) {
                showMessage('❌ 没有可复制的Cookie', 'error');
                return;
            }
            
            // 复制所有Cookie，用换行分隔
            const allCookies = history.map(item => item.cookie).join('\n');
            if (copyToClipboard(allCookies)) {
                showMessage(`✅ 已复制 ${history.length} 条Cookie到剪贴板`, 'success');
            } else {
                showMessage('❌ 复制失败', 'error');
            }
        });
        
        // 4. 清除全部
        modal.querySelector('#aug-clear-all-cookies').addEventListener('click', () => {
            if (history.length === 0) {
                showMessage('❌ 没有可清除的记录', 'error');
                return;
            }
            
            if (confirm(`确定要清除全部 ${history.length} 条Cookie历史记录吗？`)) {
                DataManager.clearSessionCookieHistory();
                showMessage('✅ 已清除所有Cookie历史记录', 'success');
                modal.remove();
            }
        });
    }
    
    // 渲染Cookie列表
    function renderCookieList(history) {
        const listContainer = document.getElementById('aug-cookie-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        history.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'aug-cookie-item';
            
            // 获取账户邮箱（兼容旧数据）
            const accountEmail = item.email || '未记录';
            
            itemDiv.innerHTML = `
                <div class="aug-cookie-item-header">
                    <div class="aug-cookie-item-time">
                        #${index + 1} - ${formatTimestamp(item.timestamp)}
                    </div>
                    <div class="aug-cookie-item-actions">
                        <button class="aug-cookie-item-btn copy" data-cookie-id="${item.id}">
                            复制
                        </button>
                        <button class="aug-cookie-item-btn delete" data-cookie-id="${item.id}">
                            删除
                        </button>
                    </div>
                </div>
                <div class="aug-cookie-item-value">${item.cookie}</div>
                <div class="aug-cookie-item-info">
                    <span>长度: ${item.length}</span>
                    <span>域名: ${item.domain}</span>
                    <span style="color: #7c3aed; font-weight: 600;">
                        账户: ${accountEmail}
                        ${accountEmail !== '未记录' ? `<button class="aug-cookie-copy-email" style="margin-left: 6px; padding: 2px 8px; background: #7c3aed; color: white; border: none; border-radius: 4px; font-size: 10px; cursor: pointer;" title="复制邮箱">📋</button>` : ''}
                    </span>
                </div>
            `;
            
            // 绑定复制Cookie按钮
            itemDiv.querySelector('.copy').addEventListener('click', () => {
                if (copyToClipboard(item.cookie)) {
                    showMessage('✅ Cookie已复制到剪贴板', 'success', 2000);
                } else {
                    showMessage('❌ 复制失败', 'error');
                }
            });
            
            // 绑定删除按钮
            itemDiv.querySelector('.delete').addEventListener('click', () => {
                if (confirm('确定要删除这条Cookie记录吗？')) {
                    DataManager.deleteSessionCookieHistoryItem(item.id);
                    showMessage('✅ 已删除', 'success', 2000);
                    
                    // 重新加载弹窗
                    setTimeout(() => {
                        document.querySelector('.aug-cookie-modal').remove();
                        showCookieHistoryModal();
                    }, 500);
                }
            });
            
            // 绑定复制邮箱按钮（如果存在）
            const copyEmailBtn = itemDiv.querySelector('.aug-cookie-copy-email');
            if (copyEmailBtn && item.email && item.email !== '未记录') {
                copyEmailBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止触发其他事件
                    if (copyToClipboard(item.email)) {
                        showMessage('✅ 邮箱已复制到剪贴板', 'success', 2000);
                    } else {
                        showMessage('❌ 复制失败', 'error');
                    }
                });
            }
            
            listContainer.appendChild(itemDiv);
        });
    }

    // ==================== Session Cookie 提取 ====================
    
    // 方法1：从document.cookie提取（非HttpOnly Cookie）
    function getSessionFromDocumentCookie() {
        try {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'session') {
                    console.log('✅ 从document.cookie获取到Session Cookie, 长度:', value.length);
                    return value;
                }
            }
            console.log('⚠️ document.cookie中未找到Session Cookie（可能是HttpOnly）');
            return null;
        } catch (e) {
            console.error('❌ 读取document.cookie失败:', e);
            return null;
        }
    }
    
    // 方法2：通过拦截XHR/Fetch请求头获取Cookie
    let capturedSessionCookie = null;
    
    function interceptRequests() {
        console.log('🔍 启动请求拦截器，尝试从请求头获取Cookie...');
        
        // 拦截XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    // 尝试从请求头获取Cookie
                    try {
                        const cookieHeader = this.getResponseHeader('set-cookie');
                        if (cookieHeader && cookieHeader.includes('session=')) {
                            const match = cookieHeader.match(/session=([^;]+)/);
                            if (match && match[1]) {
                                capturedSessionCookie = match[1];
                                console.log('✅ 从XHR响应头拦截到Session Cookie, 长度:', capturedSessionCookie.length);
                            }
                        }
                    } catch (e) {
                        // 忽略跨域请求错误
                    }
                }
            });
            return originalSend.apply(this, args);
        };
        
        // 拦截Fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                try {
                    const cookieHeader = response.headers.get('set-cookie');
                    if (cookieHeader && cookieHeader.includes('session=')) {
                        const match = cookieHeader.match(/session=([^;]+)/);
                        if (match && match[1]) {
                            capturedSessionCookie = match[1];
                            console.log('✅ 从Fetch响应头拦截到Session Cookie, 长度:', capturedSessionCookie.length);
                        }
                    }
                } catch (e) {
                    // 忽略错误
                }
                return response;
            });
        };
        
        console.log('✅ 请求拦截器已启动');
    }
    
    // 方法3：使用GM_cookie API（推荐，支持HttpOnly）
    function getSessionFromGMCookie() {
        return new Promise((resolve) => {
            try {
                GM_cookie.list({ name: 'session' }, function(cookies, error) {
                    if (error) {
                        console.error('❌ GM_cookie获取失败:', error);
                        resolve(null);
                        return;
                    }
                    
                    if (cookies && cookies.length > 0) {
                        const session = cookies[0].value;
                        console.log('✅ 从GM_cookie获取到Session Cookie, 长度:', session.length);
                        console.log('📋 Cookie详情:', {
                            domain: cookies[0].domain,
                            path: cookies[0].path,
                            httpOnly: cookies[0].httpOnly,
                            secure: cookies[0].secure
                        });
                        resolve(session);
                    } else {
                        console.log('⚠️ GM_cookie中未找到Session Cookie');
                        resolve(null);
                    }
                });
            } catch (e) {
                console.error('❌ GM_cookie调用异常:', e);
                resolve(null);
            }
        });
    }
    
    // 方法4：使用GM_xmlhttpRequest主动请求并从响应头获取Cookie（最强大）
    function getSessionFromXMLHttpRequest() {
        return new Promise((resolve) => {
            console.log('🔍 方法4：使用GM_xmlhttpRequest主动请求...');
            
            // 发起一个简单的API请求，触发Cookie返回
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://auth.augmentcode.com/api/v1/me',
                headers: {
                    'accept': 'application/json'
                },
                onload: function(response) {
                    try {
                        // 从响应头中提取Set-Cookie
                        const setCookieHeader = response.responseHeaders;
                        console.log('📋 响应头:', setCookieHeader);
                        
                        if (setCookieHeader) {
                            // 解析响应头
                            const lines = setCookieHeader.split('\n');
                            for (const line of lines) {
                                if (line.toLowerCase().startsWith('set-cookie:')) {
                                    const cookieValue = line.substring(11).trim();
                                    if (cookieValue.includes('session=')) {
                                        const match = cookieValue.match(/session=([^;]+)/);
                                        if (match && match[1]) {
                                            console.log('✅ 从GM_xmlhttpRequest响应头获取到Session, 长度:', match[1].length);
                                            resolve(match[1]);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        
                        console.log('⚠️ 响应头中未找到session cookie');
                        resolve(null);
                    } catch (e) {
                        console.error('❌ 解析响应头失败:', e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('❌ GM_xmlhttpRequest请求失败:', error);
                    resolve(null);
                }
            });
        });
    }
    
    // 综合方法：尝试多种方式获取Cookie
    async function getSessionFromCurrentPage() {
        console.log('========================================');
        console.log('🔍 开始提取Session Cookie（尝试4种方法）');
        console.log('========================================');
        
        // 优先级1：GM_cookie API（最可靠，支持HttpOnly）
        console.log('\n📍 方法1：GM_cookie API（推荐）...');
        let session = await getSessionFromGMCookie();
        if (session) {
            console.log('✅ 方法1成功：GM_cookie API');
            return session;
        }
        
        // 优先级2：document.cookie（简单但不支持HttpOnly）
        console.log('\n📍 方法2：document.cookie...');
        session = getSessionFromDocumentCookie();
        if (session) {
            console.log('✅ 方法2成功：document.cookie');
            return session;
        }
        
        // 优先级3：从拦截的请求中获取
        console.log('\n📍 方法3：检查拦截到的请求...');
        if (capturedSessionCookie) {
            console.log('✅ 方法3成功：从请求头拦截');
            return capturedSessionCookie;
        }
        
        // 优先级4：主动发起请求获取（最后手段）
        console.log('\n📍 方法4：GM_xmlhttpRequest主动请求...');
        session = await getSessionFromXMLHttpRequest();
        if (session) {
            console.log('✅ 方法4成功：GM_xmlhttpRequest');
            return session;
        }
        
        console.log('\n========================================');
        console.log('❌ 所有4种方法均失败，未能提取到Session Cookie');
        console.log('💡 建议：');
        console.log('   1. 检查是否已登录auth.augmentcode.com');
        console.log('   2. 刷新页面后重试');
        console.log('   3. 手动查看DevTools中的Cookie');
        console.log('========================================');
        return null;
    }
    
    // 处理auth页面的Cookie提取
    async function handleAuthPageCookieExtraction() {
        try {
            const isExtracting = GM_getValue('augment_extracting', 'false');
            
            if (isExtracting === 'true') {
                console.log('🍪 检测到Cookie提取请求...');
                showMessage('正在提取Session Cookie...', 'info');
                
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
                        showMessage('✅ Cookie提取成功！注册流程完成！', 'success', 10000);
                        
                        // 在页面上显示成功信息
                        const successDiv = document.createElement('div');
                        successDiv.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: white;
                            padding: 30px;
                            border-radius: 16px;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                            z-index: 2147483647;
                            text-align: center;
                            max-width: 500px;
                        `;
                        successDiv.innerHTML = `
                            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                            <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 15px;">
                                注册流程完成！
                            </div>
                            <div style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                                <strong>邮箱：</strong>${registerEmail}<br>
                                <strong>Cookie：</strong>${session.substring(0, 40)}...<br>
                                <strong>长度：</strong>${session.length} 字符<br>
                                <strong>域名：</strong>auth.augmentcode.com
                            </div>
                            <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; font-size: 12px; color: #166534;">
                                ✅ Cookie已自动保存<br>
                                ✅ 历史记录已保存<br>
                                可以在任意Augment页面打开助手查看Cookie和历史记录
                            </div>
                        `;
                        document.body.appendChild(successDiv);
                        
                        // 清除注册流程标记
                        GM_setValue('augment_no_return', 'false');
                        
                        console.log('✅ 注册流程全部完成！');
                    } else {
                        // 普通模式：返回原页面
                        showMessage('✅ Cookie提取成功！正在返回...', 'success');
                        
                        setTimeout(() => {
                            const returnUrl = GM_getValue('augment_return_url', window.location.href);
                            GM_setValue('augment_no_return', 'false');
                            window.location.href = returnUrl;
                        }, 1000);
                    }
                } else {
                    console.log('❌ Cookie提取失败');
                    showMessage('❌ Cookie提取失败，请检查是否已登录', 'error');
                    
                    GM_setValue('augment_extracting', 'false');
                    GM_setValue('augment_no_return', 'false');
                }
            }
        } catch (error) {
            console.error('Cookie提取异常:', error);
            GM_setValue('augment_extracting', 'false');
            GM_setValue('augment_no_return', 'false');
        }
    }

    // ==================== 注册流程 ====================
    
    // 步骤1：生成邮箱并提交验证
    async function step1_GenerateEmail() {
        try {
            showMessage('⏳ 正在生成邮箱...', 'info');
            
            console.log('=== 步骤①：生成邮箱并填写 ===');
            
            // 生成邮箱
            const email = await TempEmailAPI.generateRandomEmail();
            GM_setValue('augment_register_email', email);
            
            console.log('📧 生成的邮箱:', email);
            
            // 查找邮箱输入框
            const emailSelectors = [
                'input[name="username"]#username',
                'input#username[type="text"]',
                'input[type="email"]',
                'input[name="email"]',
                'input[name="username"]',
                '#email',
                '#username'
            ];
            
            let emailInput = null;
            for (const selector of emailSelectors) {
                emailInput = document.querySelector(selector);
                if (emailInput && emailInput.offsetParent !== null) {
                    console.log('✅ 找到邮箱输入框:', selector);
                    break;
                }
            }
            
            if (!emailInput) {
                throw new Error('未找到邮箱输入框，请手动填写: ' + email);
            }
            
            // 填写邮箱
            setInputValueReliably(emailInput, email);
            console.log('✅ 邮箱已填写');
            
            // 检测并等待Turnstile验证码完成
            console.log('🔐 检测Turnstile验证码...');
            showMessage('⏳ 等待人机验证（Turnstile）...', 'info');
            
            let turnstileSuccess = false;
            const maxTurnstileWait = 30000; // 最多等待30秒
            const turnstileStartTime = Date.now();
            
            while (Date.now() - turnstileStartTime < maxTurnstileWait) {
                // 使用统一的检测函数
                const result = checkTurnstileSuccess();
                
                if (result.success) {
                    console.log('✅ Turnstile验证成功！');
                    console.log('   检测方法:', result.method);
                    if (result.value) {
                        console.log('   值:', result.value);
                    }
                    turnstileSuccess = true;
                    break;
                }
                
                // 等待1秒后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 每5秒输出一次等待状态
                const elapsed = Math.floor((Date.now() - turnstileStartTime) / 1000);
                if (elapsed % 5 === 0 && elapsed > 0) {
                    console.log(`⏳ 等待Turnstile验证... (${elapsed}秒)`);
                    showMessage(`⏳ 等待人机验证... (${elapsed}秒)<br><small>请完成验证或等待自动完成</small>`, 'info', 3000);
                }
            }
            
            if (!turnstileSuccess) {
                throw new Error('Turnstile验证超时（30秒），请手动完成验证或刷新重试');
            }
            
            console.log('✅ Turnstile验证已完成，继续流程');
            showMessage('✅ 人机验证完成！', 'success', 2000);
            
            // 再等待1秒确保验证完全完成
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 查找并点击Continue按钮
            const continueSelectors = [
                'button[type="submit"][data-action-button-primary="true"]',
                'button[type="submit"]'
            ];
            
            let continueBtn = null;
            for (const selector of continueSelectors) {
                continueBtn = document.querySelector(selector);
                if (continueBtn && continueBtn.offsetParent !== null && !continueBtn.disabled) {
                    break;
                }
            }
            
            if (!continueBtn) {
                continueBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find(btn => 
                    btn.textContent.trim() === 'Continue' || btn.textContent.includes('继续')
                );
            }
            
            if (continueBtn) {
                continueBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 300));
                
                continueBtn.disabled = false;
                continueBtn.focus();
                continueBtn.click();
                
                console.log('✅ 已点击Continue按钮');
                
                showMessage(`✅ 步骤①完成！<br><small>邮箱: ${email}</small><br><small>已点击Continue按钮</small><br><small>等待页面跳转后点击"步骤②"</small>`, 'success');
                
                // 标记步骤完成
                markStepCompleted(1);
                
                // 启用步骤2按钮
                const step2Btn = document.getElementById('btn-step2');
                if (step2Btn) step2Btn.disabled = false;
            } else {
                showMessage(`⚠️ 邮箱已填写！<br><small>邮箱: ${email}</small><br><small>请手动点击Continue按钮</small>`, 'warning');
            }
            
        } catch (error) {
            console.error('步骤①失败:', error);
            showMessage('❌ ' + error.message, 'error');
        }
    }

    // 步骤2：接收验证码并填写
    async function step2_ReceiveCode() {
        try {
            // 优先从页面上读取显示的邮箱地址
            let email = '';
            const emailSpan = document.querySelector('.ulp-authenticator-selector-text') ||
                             document.querySelector('span.ulp-authenticator-selector-text');
            
            if (emailSpan && emailSpan.textContent.trim()) {
                email = emailSpan.textContent.trim();
                console.log('✅ 从页面读取到邮箱:', email);
                // 更新存储中的邮箱地址
                GM_setValue('augment_register_email', email);
            } else {
                // 如果页面上没有，从存储中获取
                email = GM_getValue('augment_register_email', '');
                console.log('⚠️ 页面上未找到邮箱显示，使用存储的邮箱:', email);
            }
            
            if (!email) {
                throw new Error('未找到邮箱地址，请先完成步骤①生成邮箱');
            }
            
            console.log('📧 将使用此邮箱匹配验证码邮件:', email);
            showMessage(`📬 正在等待验证码邮件（最多120秒）...<br><small>邮箱: ${email}</small>`, 'info');

            // 等待接收验证码
            const code = await TempEmailAPI.waitForVerificationCode(email);
            GM_setValue('augment_register_code', code);
            console.log('✅ 收到验证码:', code);

            // 查找验证码输入框
            let codeInput = document.querySelector('input[name="code"]') ||
                            document.querySelector('input#code') ||
                            Array.from(document.querySelectorAll('input[type="text"]')).find(input => 
                                !input.value && !input.readOnly && (input.name === 'code' || input.id === 'code')
                            );

            if (!codeInput) {
                throw new Error('未找到验证码输入框');
            }

            setInputValueReliably(codeInput, code);
            console.log('✅ 验证码已填写');

            // 500ms后自动点击Continue按钮
            await new Promise(r => setTimeout(r, 500));
            const continueBtn = Array.from(document.querySelectorAll('button[type="submit"]'))
                .find(btn => !btn.disabled);
            
            if (continueBtn) {
                continueBtn.click();
                console.log('✅ 已点击Continue提交按钮');
            }

            showMessage(`✅ 步骤②完成！<br><small>验证码: ${code}</small><br><small>等待页面跳转后点击"步骤③"</small>`, 'success');
            
            // 标记步骤完成
            markStepCompleted(2);
            
        } catch (error) {
            console.error('步骤②失败:', error);
            showMessage('❌ ' + error.message, 'error');
        }
    }

    // 步骤3：前往绑卡界面
    async function step3_GoToBindCard() {
        try {
            console.log('========================================');
            console.log('=== 步骤③：前往绑卡界面 ===');
            console.log('========================================');
            console.log('📍 当前URL:', window.location.href);
            
            showMessage('⏳ 正在查找绑卡按钮...', 'info');
            
            // 等待页面完全加载
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let bindCardBtn = null;
            
            // 优先查找 "Add Payment Method" 按钮（onboard页面）
            if (window.location.href.includes('app.augmentcode.com/onboard')) {
                console.log('📍 检测到onboard页面，查找"Add Payment Method"按钮...');
                
                // 精确查找
                const selectors = [
                    'button.payment-button',
                    'button.btn-primary',
                    'button.rt-Button[class*="payment"]',
                    'button:has(+ svg.arrow-icon)' // 包含箭头图标的按钮
                ];
                
                for (const selector of selectors) {
                    try {
                        bindCardBtn = document.querySelector(selector);
                        if (bindCardBtn && bindCardBtn.textContent.includes('Add Payment Method')) {
                            console.log('✅ 找到Add Payment Method按钮（选择器:', selector, '）');
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                
                // 如果精确选择器没找到，用文本匹配
                if (!bindCardBtn) {
                    bindCardBtn = Array.from(document.querySelectorAll('button')).find(btn => 
                        btn.textContent.includes('Add Payment Method')
                    );
                    if (bindCardBtn) {
                        console.log('✅ 通过文本找到Add Payment Method按钮');
                    }
                }
            } else {
                // 其他页面，通用查找
                console.log('📍 非onboard页面，使用通用查找...');
                bindCardBtn = Array.from(document.querySelectorAll('button, a')).find(btn => 
                    btn.textContent.includes('绑卡') || 
                    btn.textContent.includes('添加卡') ||
                    btn.textContent.includes('Add Card') ||
                    btn.textContent.includes('Add Payment') ||
                    btn.textContent.includes('绑定') ||
                    btn.textContent.includes('Payment Method') ||
                    btn.textContent.includes('card')
                );
            }
            
            if (bindCardBtn) {
                console.log('🎯 准备点击绑卡按钮...');
                console.log('   按钮文本:', bindCardBtn.textContent.trim().substring(0, 50));
                console.log('   按钮类名:', bindCardBtn.className);
                
                // 确保按钮可见
                bindCardBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 点击按钮
                bindCardBtn.click();
                console.log('✅ 已点击绑卡按钮');
                
                showMessage('✅ 步骤③完成！<br><small>等待页面跳转到Stripe绑卡页面...</small>', 'success');
                
                // 标记步骤完成
                markStepCompleted(3);
            } else {
                console.log('❌ 未找到绑卡按钮');
                console.log('💡 页面中的所有按钮:');
                document.querySelectorAll('button').forEach((btn, i) => {
                    console.log(`   Button[${i}]:`, btn.textContent.trim().substring(0, 30));
                });
                throw new Error('未找到绑卡按钮，请检查页面是否正确加载');
            }
            
        } catch (error) {
            console.error('步骤③失败:', error);
            showMessage('❌ ' + error.message, 'error');
        }
    }

    // 步骤4：一键绑卡并提交（完整自动化版本）
    async function step4_BindCard() {
        console.log('\n========================================');
        console.log('🚀 步骤④：自动绑卡 - 开始执行');
        console.log('========================================');
        
        try {
            showMessage('⏳ 正在自动绑卡...', 'info');
            
            console.log('📍 当前URL:', window.location.href);
            console.log('🕒 当前时间:', new Date().toLocaleString('zh-CN'));
            
            // 检查DataManager是否正常
            console.log('🔍 检查DataManager...');
            const allBins = DataManager.getCardBins();
            console.log('✅ 卡头总数:', allBins.length);
            console.log('✅ 卡头列表:', allBins.map(b => b.name).join(', '));
            
            // 随机选择一个信息配置
            const profiles = DataManager.getProfiles();
            console.log('✅ 信息配置数量:', profiles.length);
            
            if (profiles.length === 0) {
                throw new Error('没有可用的信息配置');
            }
            
            // 随机选择
            const randomIndex = Math.floor(Math.random() * profiles.length);
            const profile = profiles[randomIndex];
            console.log('🎲 随机选择信息配置 [' + (randomIndex + 1) + '/' + profiles.length + ']:', profile.name);
            console.log('📋 配置详情:', JSON.stringify(profile.data, null, 2));
            
            // 随机选择一个标注的卡头
            const autoSubmitBins = DataManager.getAutoSubmitCardBins();
            console.log('🚀 标注自动提交的卡头数量:', autoSubmitBins.length);
            
            if (autoSubmitBins.length === 0) {
                throw new Error('没有标注的卡头，请检查配置');
            }
            
            // 随机选择卡头
            const randomBinIndex = Math.floor(Math.random() * autoSubmitBins.length);
            const selectedBin = autoSubmitBins[randomBinIndex];
            console.log('🎲 随机选择卡头 [' + (randomBinIndex + 1) + '/' + autoSubmitBins.length + ']:', selectedBin.name);
            
            // 生成卡号信息
            const cardNumber = generateLuhnCardNumber(selectedBin.prefix, selectedBin.totalLength);
            const expiryMonth = generateRandomMonth();
            const expiryYear = generateRandomYear();
            const cvc = generateRandomCVC(selectedBin.cvcLength);
            const expiry = `${expiryMonth}/${expiryYear}`;
            
            console.log('🔢 卡号:', cardNumber);
            console.log('📅 有效期:', expiry);
            console.log('🔐 CVC:', cvc);
            
            // 等待页面加载
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 执行填表（自动提交）
            reliableFillForm(profile.data, cardNumber, expiry, cvc, selectedBin.name, true);
            
            showMessage(`✅ 步骤④完成！<br><small>卡号: ${cardNumber.slice(0, 6)}******${cardNumber.slice(-4)}</small><br><small>正在自动提交...</small><br><small>提交成功后点击"步骤⑤"</small>`, 'success');
            
            // 标记步骤完成
            markStepCompleted(4);
            
            // 记录历史
            DataManager.addHistory({
                action: '注册绑卡',
                profile: profile.name,
                cardBin: selectedBin.name,
                cardNumber: cardNumber.slice(0, 6) + '******' + cardNumber.slice(-4),
                success: true
            });
            
        } catch (error) {
            console.error('步骤④失败:', error);
            showMessage('❌ ' + error.message, 'error');
        }
    }

    // 步骤5：检测get-started页面并跳转到auth提取Cookie
    async function step5_ExtractCookie() {
        try {
            console.log('========================================');
            console.log('=== 步骤⑤：立即跳转提取Cookie ===');
            console.log('========================================');
            
            const currentUrl = window.location.href;
            console.log('📍 当前URL:', currentUrl);
            
            // 清除自动执行步骤⑤的标记（防止循环）
            GM_setValue('augment_auto_execute_step5', 'false');
            
            // 停止自动模式（最后一步，不需要继续）
            GM_setValue('augment_auto_mode', 'false');
            console.log('⏸️ 已停止自动模式（步骤⑤是最后一步）');
            
            // 获取注册邮箱
            const email = GM_getValue('augment_register_email', '');
            console.log('📧 当前注册邮箱:', email);
            
            // 标记为注册流程的Cookie提取
            GM_setValue('augment_extracting_from_register', 'true');
            GM_setValue('augment_register_email_for_cookie', email);
            GM_setValue('augment_extracting', 'true');
            GM_setValue('augment_no_return', 'true');
            
            console.log('🔗 准备跳转到 https://auth.augmentcode.com/');
            console.log('💾 已保存提取标记');
            
            // 简化逻辑：不等待元素加载，直接跳转
            if (currentUrl.includes('app.augmentcode.com/get-started') || (currentUrl.includes('app.augmentcode.com') && currentUrl.includes('get-started'))) {
                console.log('✅ 确认在get-started页面');
                showMessage('✅ 注册成功！<br><small>正在跳转提取Cookie...</small>', 'success', 2000);
            } else {
                console.log('⚠️ 当前不在get-started页面，仍然执行跳转');
                showMessage('⏳ 正在跳转到auth页面提取Cookie...', 'info', 2000);
            }
            
            // 标记步骤完成
            markStepCompleted(5);
            
            // 延迟1秒后跳转（给用户看到提示的时间）
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🔗 正在跳转...');
            window.location.href = 'https://auth.augmentcode.com/';
            
            console.log('✅ 跳转命令已执行');
            
        } catch (error) {
            console.error('❌ 步骤⑤失败:', error);
            showMessage('❌ ' + error.message, 'error');
            
            // 失败时也尝试跳转
            console.log('⚠️ 尝试强制跳转...');
            setTimeout(() => {
                window.location.href = 'https://auth.augmentcode.com/';
            }, 1000);
        }
    }

    // 重置注册流程
    function resetRegister() {
        if (confirm('确定要重置注册流程吗？这将清除保存的邮箱和验证码。')) {
            GM_setValue('augment_register_email', '');
            GM_setValue('augment_register_code', '');
            GM_setValue('augment_auto_mode', 'false');
            GM_setValue('augment_auto_execute_step5', 'false');
            showMessage('✅ 注册流程已重置', 'success');
            
            // 清除所有完成标记
            for (let i = 1; i <= 5; i++) {
                const btn = document.getElementById(`btn-step${i}`);
                if (btn) {
                    btn.classList.remove('completed');
                }
            }
            
            // 禁用步骤2按钮
            const step2Btn = document.getElementById('btn-step2');
            if (step2Btn) step2Btn.disabled = true;
        }
    }
    
    // ==================== 一键自动注册 ====================
    
    // 检测当前页面是哪一步
    function detectCurrentStep() {
        const url = window.location.href;
        
        // 优先检查：如果正在提取Cookie，返回0（不执行任何自动操作）
        const isExtracting = GM_getValue('augment_extracting', 'false');
        if (isExtracting === 'true') {
            console.log('🍪 正在提取Cookie，跳过自动检测');
            return 0; // 提取Cookie期间不执行任何自动操作
        }
        
        // 排除中间跳转页面（这些页面不应该触发任何步骤）
        const redirectPages = [
            '/auth/continue',
            '/authorize',
            '/callback',
            '/redirect'
        ];
        
        for (const redirectPath of redirectPages) {
            if (url.includes(redirectPath)) {
                console.log('⏳ 检测到中间跳转页面，跳过检测:', redirectPath);
                return 0; // 跳转页面不执行任何操作
            }
        }
        
        // 检测是否在注册页面（步骤1）
        if (url.includes('login.augmentcode.com') && (url.includes('signup') || url.includes('login'))) {
            // 检查是否有邮箱输入框
            const emailInput = document.querySelector('input[name="username"]') || 
                              document.querySelector('input[type="email"]');
            if (emailInput && !emailInput.value) {
                return 1; // 步骤1：需要填写邮箱
            }
            
            // 检查是否有验证码输入框
            const codeInput = document.querySelector('input[name="code"]');
            if (codeInput) {
                return 2; // 步骤2：需要填写验证码
            }
        }
        
        // 检测是否在get-started页面（步骤5）
        // 优先使用URL判断，避免元素未加载导致检测失败
        if (url.includes('app.augmentcode.com/get-started') || (url.includes('app.augmentcode.com') && url.includes('get-started'))) {
            console.log('✅ 检测到get-started页面（步骤⑤）- 通过URL判断');
            
            // 检测是否来自绑卡流程（无论成功还是失败）
            const autoMode = GM_getValue('augment_auto_mode', 'false');
            const registerEmail = GM_getValue('augment_register_email', '');
            
            if (autoMode === 'true' || registerEmail) {
                console.log('🎯 检测到来自注册流程，强制启用步骤⑤自动执行');
                // 强制设置步骤⑤自动执行标记，确保无论绑卡成功与否都继续执行
                GM_setValue('augment_auto_execute_step5', 'true');
                console.log('💾 已设置步骤⑤自动执行标记');
            }
            
            // 尝试检测关键元素（非强制）
            const heading = document.querySelector('h1[data-testid="get-started-heading"]');
            if (heading) {
                console.log('   ✓ 确认：找到get-started-heading元素');
            } else {
                console.log('   ⚠️ 未找到特征元素，但URL匹配，继续执行');
            }
            
            return 5; // 步骤5：需要跳转提取Cookie
        }
        
        // 检测是否在绑卡引导页（步骤3）
        // 优先使用URL判断，避免按钮未加载导致检测失败
        if (url.includes('app.augmentcode.com/onboard')) {
            console.log('✅ 检测到onboard页面（步骤③）- 通过URL判断');
            
            // 尝试检测Add Payment Method按钮（非强制）
            const addPaymentBtn = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Add Payment Method')
            );
            if (addPaymentBtn) {
                console.log('   ✓ 确认：找到Add Payment Method按钮');
            } else {
                console.log('   ⚠️ 未找到按钮，但URL匹配，继续执行');
            }
            
            return 3; // 步骤3：需要点击绑卡
        }
        
        // 检测是否在Stripe绑卡页（步骤4）
        if (url.includes('checkout.stripe.com') || url.includes('billing.augmentcode.com')) {
            const cardInput = document.querySelector('input[autocomplete="cc-number"]') ||
                             document.querySelector('input[data-elements-stable-field-name="cardNumber"]');
            if (cardInput) {
                return 4; // 步骤4：需要填写卡信息
            }
        }
        
        // 其他app页面（排除正在提取Cookie和中间跳转页面）
        // 注意：这个检测放在最后，避免误判
        if (url.includes('app.augmentcode.com') && !url.includes('get-started') && !url.includes('onboard')) {
            const bindCardBtn = Array.from(document.querySelectorAll('button, a')).find(btn => 
                btn.textContent.includes('绑卡') || 
                btn.textContent.includes('Add Card') ||
                btn.textContent.includes('Payment Method') ||
                btn.textContent.includes('Payment')
            );
            if (bindCardBtn) {
                console.log('✅ 检测到需要绑卡的页面');
                return 3; // 步骤3：需要点击绑卡
            }
        }
        
        return 0; // 未知状态
    }
    
    // 自动执行对应步骤
    async function autoExecuteStep() {
        const autoMode = GM_getValue('augment_auto_mode', 'false');
        if (autoMode !== 'true') {
            return; // 未启用自动模式
        }
        
        console.log('🤖 自动模式已启用，检测当前页面...');
        
        const currentStep = detectCurrentStep();
        console.log('📍 检测到当前步骤:', currentStep);
        
        switch(currentStep) {
            case 1:
                console.log('🚀 自动执行步骤①：生成邮箱');
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待页面完全加载
                await step1_GenerateEmail();
                break;
                
            case 2:
                console.log('🚀 自动执行步骤②：接收验证码');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await step2_ReceiveCode();
                break;
                
            case 3:
                console.log('🚀 自动执行步骤③：前往绑卡');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await step3_GoToBindCard();
                break;
                
            case 4:
                console.log('🚀 自动执行步骤④：自动绑卡');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 记录绑卡前的URL
                const beforeBindUrl = window.location.href;
                console.log('📍 绑卡前URL:', beforeBindUrl);
                
                // 执行绑卡
                await step4_BindCard();
                
                // 等待并检测页面跳转
                console.log('⏳ 监测页面跳转...');
                
                for (let i = 0; i < 20; i++) { // 最多等待20秒（20次 × 1秒）
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const afterBindUrl = window.location.href;
                    
                    // 检测到URL变化，说明跳转成功
                    if (afterBindUrl !== beforeBindUrl) {
                        console.log('========================================');
                        console.log('✅ 检测到页面跳转！绑卡成功！');
                        console.log('   原URL:', beforeBindUrl);
                        console.log('   新URL:', afterBindUrl);
                        console.log('   耗时:', (i + 1), '秒');
                        console.log('========================================');
                        
                        // 但是，这里页面可能还在跳转中，JS上下文可能会丢失
                        // 所以我们直接保存标记，让新页面加载时自动执行步骤⑤
                        console.log('💾 保存自动执行标记，等待新页面加载...');
                        GM_setValue('augment_auto_execute_step5', 'true');
                        
                        return; // 退出循环
                    }
                    
                    // 每5秒输出一次状态
                    if ((i + 1) % 5 === 0) {
                        console.log(`⏳ 等待页面跳转中... (${i + 1}秒)`);
                    }
                }
                
                // 20秒后仍未跳转，检查错误
                console.log('⚠️ 等待20秒后页面仍未跳转');
                
                const errorMessage = document.querySelector('[role="alert"]') ||
                                   document.querySelector('.error') ||
                                   document.querySelector('[class*="Error"]');
                
                if (errorMessage) {
                    console.log('❌ 检测到错误提示:', errorMessage.textContent);
                    showMessage('❌ 绑卡失败：' + errorMessage.textContent.substring(0, 50) + '<br><small>可能需要人机验证，请手动处理</small><br><small>完成后跳转到get-started页面将自动继续</small>', 'error', 15000);
                    
                    // 绑卡失败时不立即停止自动模式，给用户处理人机验证的时间
                    console.log('⚠️ 绑卡可能遇到人机验证，保持自动模式等待用户处理');
                    console.log('💡 用户手动处理后跳转到get-started页面时将自动继续执行步骤⑤');
                    
                    // 设置延时停止标记，5分钟后如果仍未跳转则停止自动模式
                    console.log('⏱️ 设置5分钟延时停止，给用户足够时间处理人机验证');
                    setTimeout(() => {
                        // 检查是否仍在同一页面且自动模式仍开启
                        if (GM_getValue('augment_auto_mode', 'false') === 'true' && 
                            window.location.href === beforeBindUrl) {
                            console.log('⏸️ 5分钟超时，自动停止自动模式');
                            GM_setValue('augment_auto_mode', 'false');
                            showMessage('⏸️ 自动模式已超时停止<br><small>如需继续请手动点击相应步骤按钮</small>', 'warning', 8000);
                        }
                    }, 5 * 60 * 1000); // 5分钟
                    
                } else {
                    console.log('⚠️ 未检测到错误，但页面未跳转');
                    showMessage('⚠️ 绑卡提交后页面未跳转<br><small>请手动检查绑卡状态</small><br><small>如跳转到get-started页面将自动继续</small>', 'warning', 10000);
                    
                    // 没有明确错误时，也给用户时间手动处理
                    console.log('💡 保持自动模式，等待用户手动处理或页面跳转');
                }
                
                // 不立即停止自动模式，让用户有机会手动处理人机验证
                console.log('🔄 继续保持自动模式，等待get-started页面跳转');
                break;
                
            case 5:
                console.log('🚀 自动执行步骤⑤：检测get-started页面并提取Cookie');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await step5_ExtractCookie();
                break;
                
            default:
                console.log('========================================');
                console.log('⚠️ 未检测到可自动执行的步骤（返回值: 0）');
                console.log('📍 当前URL:', window.location.href);
                console.log('🤖 自动模式状态:', GM_getValue('augment_auto_mode', 'false'));
                console.log('========================================');
                console.log('💡 可能原因：');
                console.log('   1. 页面正在加载中，元素未完全加载');
                console.log('   2. 当前页面不在注册流程中');
                console.log('   3. 页面结构发生变化');
                console.log('========================================');
                console.log('🔄 保持自动模式继续运行，等待页面变化...');
                console.log('   提示：自动模式仍处于启用状态，页面跳转后会继续检测');
                console.log('========================================');
                
                // 不停止自动模式，让它在下次页面加载时继续尝试
                // 只在特定情况下才停止（比如明显不在注册流程中）
                const currentUrl = window.location.href;
                const isInRegistrationFlow = currentUrl.includes('augmentcode.com') && 
                                            !currentUrl.includes('docs') && 
                                            !currentUrl.includes('blog') &&
                                            !currentUrl.includes('pricing');
                
                if (!isInRegistrationFlow) {
                    console.log('⏸️ 检测到不在注册流程中，停止自动模式');
                    GM_setValue('augment_auto_mode', 'false');
                } else {
                    console.log('✅ 仍在注册流程相关页面，保持自动模式');
                }
                break;
        }
    }
    
    // 启动一键自动注册（新版：智能跳转+持续执行）
    async function startAutoRegister() {
        const currentUrl = window.location.href;
        
        console.log('========================================');
        console.log('🚀 一键自动注册 - 点击执行');
        console.log('📍 当前URL:', currentUrl);
        console.log('========================================');
        
        // 启用自动模式（持续执行后续步骤）
        GM_setValue('augment_auto_mode', 'true');
        console.log('✅ 已启用自动模式，将持续执行所有步骤');
        
        // 检查是否在注册页面
        const isOnLoginPage = currentUrl.includes('login.augmentcode.com/u/login/identifier') || 
                             currentUrl.includes('login.augmentcode.com/u/signup');
        
        if (isOnLoginPage) {
            // 情况1：已经在注册页面，直接开始注册流程
            console.log('✅ 检测到注册页面，立即开始注册流程...');
            showMessage('🚀 开始自动注册流程！<br><small>将自动完成所有步骤</small>', 'success', 3000);
            
            // 执行步骤1
            setTimeout(async () => {
                try {
                    await step1_GenerateEmail();
                } catch (error) {
                    console.error('❌ 执行步骤1失败:', error);
                    showMessage('❌ 执行失败: ' + error.message, 'error');
                    // 失败时停止自动模式
                    GM_setValue('augment_auto_mode', 'false');
                }
            }, 1000);
            
        } else {
            // 情况2：不在注册页面，跳转到app页面（会自动重定向到登录/注册页）
            console.log('📍 当前不在注册页面');
            console.log('🔗 准备跳转到: https://app.augmentcode.com/');
            
            showMessage('🔗 正在跳转到注册页面...<br><small>到达后将自动开始注册</small>', 'info', 2000);
            
            // 设置标记，跳转后自动开始
            GM_setValue('augment_auto_start_after_redirect', 'true');
            GM_setValue('augment_redirect_time', Date.now().toString());
            
            // 延迟500ms后跳转
            setTimeout(() => {
                console.log('🔗 执行跳转...');
                window.location.href = 'https://app.augmentcode.com/';
            }, 500);
        }
    }
    
    // 停止一键自动注册
    function stopAutoRegister() {
        GM_setValue('augment_auto_mode', 'false');
        showMessage('⏸️ 一键自动注册已停止', 'info');
        console.log('⏸️ 一键自动注册已停止');
    }

    // ==================== UI 构建与防护 ====================
    
    // 创建UI（防重复）
    function createUI() {
        // 检查是否已存在
        const existing = document.getElementById('augment-register-buttons');
        if (existing) {
            console.log('ℹ️ 按钮容器已存在，跳过创建');
            return existing;
        }

        const savedEmail = GM_getValue('augment_register_email', '');

        // 创建按钮容器
        const container = document.createElement('div');
        container.id = 'augment-register-buttons';
        
        // 添加标记属性，防止被页面JS误删
        container.setAttribute('data-augment-script', 'true');
        container.setAttribute('data-version', '2.1.0');
        
        // 读取折叠状态
        const isCollapsed = GM_getValue('augment_menu_collapsed', false);

        // 创建按钮：1个折叠/展开 + 1个自动注册 + 5个步骤 + 1个Cookie历史 + 1个重置
        container.innerHTML = `
            <button class="aug-step-btn toggle" id="btn-toggle-menu" title="折叠/展开菜单">
                <span class="icon">${isCollapsed ? '▲' : '▼'}</span>
            </button>

            <button class="aug-step-btn auto" id="btn-auto-start">
                <span class="icon">🚀</span>
                <span>一键自动注册</span>
            </button>

            <button class="aug-step-btn" id="btn-step1">
                <span class="icon">📧</span>
                <span>① 生成邮箱</span>
            </button>

            <button class="aug-step-btn" id="btn-step2" ${!savedEmail ? 'disabled' : ''}>
                <span class="icon">📬</span>
                <span>② 接收验证码</span>
            </button>

            <button class="aug-step-btn" id="btn-step3">
                <span class="icon">💳</span>
                <span>③ 前往绑卡</span>
            </button>

            <button class="aug-step-btn" id="btn-step4">
                <span class="icon">🚀</span>
                <span>④ 自动绑卡</span>
            </button>

            <button class="aug-step-btn" id="btn-step5">
                <span class="icon">🍪</span>
                <span>⑤ 提取Cookie</span>
            </button>

            <button class="aug-step-btn" id="btn-cookie-history" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                <span class="icon">📜</span>
                <span>Cookie历史</span>
            </button>

            <button class="aug-step-btn reset" id="btn-reset">
                <span class="icon">🔄</span>
                <span>重置</span>
            </button>
        `;

        // 应用折叠状态
        if (isCollapsed) {
            container.classList.add('collapsed');
        }

        // 确保body存在
        if (!document.body) {
            console.warn('⚠️ document.body不存在，等待body创建...');
            setTimeout(createUI, 100);
            return null;
        }

        document.body.appendChild(container);
        
        // 确保容器在最顶层（使用内联样式强制优先级）
        container.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
        `;
        
        // 使用 addEventListener 绑定事件（比 onclick 更可靠）
        document.getElementById('btn-toggle-menu').addEventListener('click', toggleMenu);
        document.getElementById('btn-auto-start').addEventListener('click', startAutoRegister);
        document.getElementById('btn-step1').addEventListener('click', step1_GenerateEmail);
        document.getElementById('btn-step2').addEventListener('click', step2_ReceiveCode);
        document.getElementById('btn-step3').addEventListener('click', step3_GoToBindCard);
        document.getElementById('btn-step4').addEventListener('click', step4_BindCard);
        document.getElementById('btn-step5').addEventListener('click', step5_ExtractCookie);
        document.getElementById('btn-cookie-history').addEventListener('click', showCookieHistoryModal);
        document.getElementById('btn-reset').addEventListener('click', resetRegister);

        console.log('✅ Augment注册按钮已创建（右下角）');
        console.log('✅ 事件监听器已绑定');
        console.log('🚀 包含一键自动注册按钮');
        console.log('📜 包含Cookie历史记录查看按钮');
        console.log('🔽 包含菜单折叠/展开按钮');

        return container;
    }

    // 折叠/展开菜单
    function toggleMenu() {
        const container = document.getElementById('augment-register-buttons');
        const toggleBtn = document.getElementById('btn-toggle-menu');

        if (!container || !toggleBtn) {
            console.error('❌ 找不到按钮容器或折叠按钮');
            return;
        }

        const isCollapsed = container.classList.contains('collapsed');

        if (isCollapsed) {
            // 展开菜单
            container.classList.remove('collapsed');
            toggleBtn.querySelector('.icon').textContent = '▼';
            GM_setValue('augment_menu_collapsed', false);
            console.log('📖 菜单已展开');
        } else {
            // 折叠菜单
            container.classList.add('collapsed');
            toggleBtn.querySelector('.icon').textContent = '▲';
            GM_setValue('augment_menu_collapsed', true);
            console.log('📕 菜单已折叠');
        }
    }
    
    // 定时检查并恢复UI（防止被页面JS覆盖）
    function ensureUIExists() {
        const container = document.getElementById('augment-register-buttons');
        
        if (!container || !container.isConnected || !document.body.contains(container)) {
            console.warn('⚠️ 检测到按钮容器被移除，正在恢复...');
            createUI();
            console.log('✅ 按钮容器已恢复');
        } else {
            // 确保z-index始终保持最高
            const currentZIndex = window.getComputedStyle(container).zIndex;
            if (currentZIndex !== '2147483647') {
                console.warn('⚠️ 检测到z-index被修改，正在恢复...');
                container.style.cssText = `
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    z-index: 2147483647 !important;
                    pointer-events: auto !important;
                `;
                console.log('✅ z-index已恢复为最高优先级');
            }
        }
    }
    
    // MutationObserver 监听DOM变化
    function setupDOMProtection() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // 检查是否有节点被移除
                if (mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        // 检查是否是我们的按钮容器
                        if (node.id === 'augment-register-buttons' || 
                            (node.querySelector && node.querySelector('#augment-register-buttons'))) {
                            console.warn('🚨 检测到按钮容器被移除！正在恢复...');
                            setTimeout(createUI, 100);
                            break;
                        }
                    }
                }
            }
        });
        
        // 监听整个body的变化
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('✅ DOM保护已启动（MutationObserver）');
        }
        
        return observer;
    }
    
    // 定时检查机制（每5秒检查一次）
    function startPeriodicCheck() {
        setInterval(() => {
            ensureUIExists();
        }, 5000);
        console.log('✅ 定时检查已启动（每5秒）');
    }
    
    // 标记步骤完成
    function markStepCompleted(stepNumber) {
        const btn = document.getElementById(`btn-step${stepNumber}`);
        if (btn) {
            btn.classList.add('completed');
        }
    }

    // ==================== 初始化 ====================
    
    // 暴露全局接口（供控制台调试使用）
    window.augmentRegister = {
        step1: step1_GenerateEmail,
        step2: step2_ReceiveCode,
        step3: step3_GoToBindCard,
        step4: step4_BindCard,
        step5: step5_ExtractCookie,
        reset: resetRegister,
        // 一键自动注册
        startAuto: startAutoRegister,
        stopAuto: stopAutoRegister,
        // Cookie历史记录
        showCookieHistory: showCookieHistoryModal,
        getCookieHistory: () => DataManager.getSessionCookieHistory(),
        clearCookieHistory: () => DataManager.clearSessionCookieHistory(),
        // 调试工具
        showButtons: createUI,
        detectStep: detectCurrentStep,
        test: () => {
            console.log('=== 调试信息 ===');
            console.log('DataManager:', DataManager);
            console.log('卡头数量:', DataManager.getCardBins().length);
            console.log('信息配置:', DataManager.getProfiles().length);
            console.log('Cookie历史记录数量:', DataManager.getSessionCookieHistory().length);
            console.log('按钮容器存在:', !!document.getElementById('augment-register-buttons'));
            console.log('步骤1按钮存在:', !!document.getElementById('btn-step1'));
            console.log('步骤4按钮存在:', !!document.getElementById('btn-step4'));
            console.log('Cookie历史按钮存在:', !!document.getElementById('btn-cookie-history'));
            console.log('自动模式:', GM_getValue('augment_auto_mode', 'false'));
            console.log('当前步骤:', detectCurrentStep());
        }
    };

    // 启动请求拦截器（提前启动，捕获所有请求）
    interceptRequests();

    // 初始化函数（包含所有初始化逻辑）
    function initializeScript() {
        console.log('🔧 开始初始化脚本...');
        
        // 创建UI
        createUI();
        
        // 启动DOM保护
        setupDOMProtection();
        
        // 启动定时检查
        startPeriodicCheck();
        
        // 优先检查：是否是跳转后需要自动开始注册
        const autoStartAfterRedirect = GM_getValue('augment_auto_start_after_redirect', 'false');
        const redirectTime = GM_getValue('augment_redirect_time', '0');
        const currentTime = Date.now();
        const timeSinceRedirect = currentTime - parseInt(redirectTime);
        
        if (autoStartAfterRedirect === 'true' && timeSinceRedirect < 30000) { // 30秒内有效
            console.log('🎯 检测到跳转后自动开始标记！');
            console.log('⏱️ 跳转时间:', new Date(parseInt(redirectTime)).toLocaleString());
            console.log('⏱️ 已过时间:', Math.floor(timeSinceRedirect / 1000), '秒');
            
            // 清除标记
            GM_setValue('augment_auto_start_after_redirect', 'false');
            GM_setValue('augment_redirect_time', '0');
            
            // 检查是否到达注册页面
            const currentUrl = window.location.href;
            const isOnLoginPage = currentUrl.includes('login.augmentcode.com/u/login/identifier') || 
                                 currentUrl.includes('login.augmentcode.com/u/signup');
            
            if (isOnLoginPage) {
                console.log('✅ 已到达注册页面，2秒后自动开始注册...');
                showMessage('✅ 已到达注册页面！<br><small>即将开始自动注册...</small>', 'success', 3000);
                
                // 启用自动模式（持续执行后续步骤）
                GM_setValue('augment_auto_mode', 'true');
                console.log('✅ 已启用自动模式，将持续执行所有步骤');
                
                setTimeout(async () => {
                    try {
                        console.log('🚀 开始执行步骤1：生成邮箱');
                        await step1_GenerateEmail();
                    } catch (error) {
                        console.error('❌ 执行步骤1失败:', error);
                        showMessage('❌ 执行失败: ' + error.message, 'error');
                        // 失败时停止自动模式
                        GM_setValue('augment_auto_mode', 'false');
                    }
                }, 2000);
                
                return; // 不执行其他自动检测
            } else {
                console.log('⚠️ 当前不在注册页面，继续等待重定向...');
                console.log('📍 当前URL:', currentUrl);
                
                // 如果3秒后还不在注册页面，再次尝试跳转
                setTimeout(() => {
                    const url = window.location.href;
                    if (!url.includes('login.augmentcode.com')) {
                        console.log('🔗 重新尝试跳转到注册页面...');
                        window.location.href = 'https://login.augmentcode.com/u/signup/identifier';
                    }
                }, 3000);
            }
        }
        
        // 优先检查是否需要自动执行步骤⑤（绑卡成功/失败后的跳转）
        const autoStep5 = GM_getValue('augment_auto_execute_step5', 'false');
        if (autoStep5 === 'true') {
            console.log('🎯 检测到需要自动执行步骤⑤！');
            console.log('   原因：绑卡流程完成（无论成功与否）跳转到get-started页面');
            GM_setValue('augment_auto_execute_step5', 'false'); // 清除标记
            
            // 确保即使自动模式已关闭也要执行步骤⑤
            const currentAutoMode = GM_getValue('augment_auto_mode', 'false');
            if (currentAutoMode === 'false') {
                console.log('💡 自动模式已关闭，但强制执行步骤⑤（因为来自绑卡流程）');
            }
            
            setTimeout(() => {
                console.log('🚀 自动执行步骤⑤：提取Cookie');
                step5_ExtractCookie();
            }, 2000);
            return; // 不执行其他自动检测
        }
        
        // 检查是否需要提取Cookie
        if (window.location.href.includes('auth.augmentcode.com')) {
            handleAuthPageCookieExtraction();
        }
        
        // 检查是否启用了自动模式（持续执行所有步骤）
        const autoMode = GM_getValue('augment_auto_mode', 'false');
        const registerEmail = GM_getValue('augment_register_email', '');
        
        if (autoMode === 'true') {
            console.log('🤖 检测到自动模式已启用，将自动执行当前步骤...');
            setTimeout(autoExecuteStep, 3000);
        } else if (registerEmail && window.location.href.includes('get-started')) {
            // 即使自动模式关闭，但如果在get-started页面且来自注册流程，也要执行步骤⑤
            console.log('🎯 检测到get-started页面且来自注册流程，强制执行步骤⑤');
            console.log('   注册邮箱:', registerEmail);
            console.log('   自动模式状态:', autoMode);
            
            // 设置步骤⑤自动执行标记并触发执行
            GM_setValue('augment_auto_execute_step5', 'true');
            setTimeout(() => {
                console.log('🚀 强制执行步骤⑤：提取Cookie');
                step5_ExtractCookie();
            }, 3000);
        }
        
        console.log('✅ 脚本初始化完成');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // 页面已加载，立即初始化
        if (document.body) {
            initializeScript();
        } else {
            // body还不存在，等待
            setTimeout(initializeScript, 100);
        }
    }

    console.log('========================================');
    console.log('✅ Augment自动注册脚本已加载（完整版 v2.1.0）');
    console.log('========================================');
    console.log('🚀 【新版特性】一键自动注册 2.0');
    console.log('   - 智能识别：自动判断当前是否在注册页面');
    console.log('   - 自动跳转：不在注册页面则自动跳转');
    console.log('   - 全程自动：启用持续自动模式，自动完成所有步骤');
    console.log('   - 验证码自动：页面跳转后自动接收并填写验证码');
    console.log('   - URL优先检测：优先使用URL判断，避免元素加载慢导致中断');
    console.log('   - 智能重试：检测失败时保持自动模式，等待页面变化');
    console.log('   - 快速跳转：get-started页面立即跳转，不等待元素加载');
    console.log('   - 更加可靠：解决部分浏览器不执行的问题');
    console.log('   - 排除跳转页：自动识别中间跳转页面（/auth/continue等）'); 
    console.log('========================================');
    console.log('📝 功能：5步完成Augment注册流程');
    console.log('🎲 随机选择：地址从20个中随机、卡头从2个中随机');
    console.log('🍪 Cookie提取：4种方法自动提取Session Cookie');
    console.log('   方法1: GM_cookie API（推荐，支持HttpOnly）');
    console.log('   方法2: document.cookie（备用）');
    console.log('   方法3: 请求头拦截（备用）');
    console.log('   方法4: GM_xmlhttpRequest主动请求（备用）');
    console.log('📜 Cookie历史：自动记录每次保存的Cookie，支持查看、复制、删除');
    console.log('   - 自动记录：每次保存Cookie时自动添加到历史记录');
    console.log('   - 账户信息：自动关联注册邮箱，可单独复制');
    console.log('   - 批量复制：一键复制所有历史Cookie');
    console.log('   - 单独复制：复制指定的Cookie或邮箱');
    console.log('   - 清除记录：支持单条删除或全部清除');
    console.log('   - 最多保存：100条历史记录');
    console.log('🎯 UI优化：按钮始终显示在所有页面元素最上层（z-index: 2147483647）');
    console.log('   - 使用 !important 强制优先级');
    console.log('   - 自动监测并恢复被修改的样式');
    console.log('   - 每5秒自动检查z-index保持最高');
    console.log('🎨 Toast优化：彩色背景+深色文字，清晰美观');
    console.log('🔧 调试：在控制台输入 window.augmentRegister.test() 查看状态');
    console.log('🔧 Cookie历史：window.augmentRegister.showCookieHistory() 查看历史');
    console.log('💡 提示：点击右下角的"🚀 一键自动注册"按钮开始流程');
    console.log('========================================');

})();
