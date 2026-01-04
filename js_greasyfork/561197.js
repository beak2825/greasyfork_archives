// ==UserScript==
// @name         IELTS 雅思考位监控助手
// @namespace    https://ielts.neea.cn/
// @version      2.2.3
// @description  雅思考位监控与自动报名 - 支持登录、考位监控
// @author       SkyBlue997
// @homepageURL  https://github.com/SkyBlue997/ielts-auto-booking
// @supportURL   https://github.com/SkyBlue997/ielts-auto-booking/issues
// @license      MIT
// @match        https://ielts.neea.cn/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @connect      ielts.neea.cn
// @connect      checkimage.neea.cn
// @connect      api.jfbym.com
// @connect      api.day.app
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561197/IELTS%20%E9%9B%85%E6%80%9D%E8%80%83%E4%BD%8D%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561197/IELTS%20%E9%9B%85%E6%80%9D%E8%80%83%E4%BD%8D%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置区域 ====================
    // 动态计算默认日期（明天）
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (d) => d.toISOString().split('T')[0];
    const defaultQueryDate = formatDate(tomorrow);

    // 兼容旧版 queryDate，同时支持 start/end 日期配置
    const storedQueryDate = GM_getValue('queryDate', defaultQueryDate);
    const storedStartDate = GM_getValue('startDate', storedQueryDate) || storedQueryDate;
    const storedEndDate = GM_getValue('endDate', storedStartDate) || storedStartDate;

    const CONFIG = {
        productType: GM_getValue('productType', 'IELTSPBT'),
        targetCities: GM_getValue('targetCities', ['110100']),
        targetCenters: GM_getValue('targetCenters', ''),  // 考点过滤关键词，逗号分隔
        // 日期：默认单日查询（startDate=endDate），保留 queryDate 作为旧版兼容字段
        startDate: storedStartDate,
        endDate: storedEndDate,
        queryDate: storedStartDate,
        refreshInterval: GM_getValue('refreshInterval', 5000),
        autoRegister: GM_getValue('autoRegister', false),
        soundAlert: GM_getValue('soundAlert', true),
        desktopNotification: GM_getValue('desktopNotification', true),
        monitorEnabled: GM_getValue('monitorEnabled', false),
        // 登录配置
        savedUserId: GM_getValue('savedUserId', ''),
        rememberLogin: GM_getValue('rememberLogin', false),
        // OCR配置
        ocrProvider: GM_getValue('ocrProvider', 'jfbym'),  // 'jfbym' 或 'local'
        ocrServerUrl: GM_getValue('ocrServerUrl', 'http://127.0.0.1:9898'),
        jfbymToken: GM_getValue('jfbymToken', ''),
        jfbymType: GM_getValue('jfbymType', '10103'),
        autoOcr: GM_getValue('autoOcr', true),
        ocrRetryCount: GM_getValue('ocrRetryCount', 3),
        // Bark推送配置
        barkEnabled: GM_getValue('barkEnabled', false),
        barkUrl: GM_getValue('barkUrl', '')  // 格式: https://api.day.app/your_key
    };

    const CITY_MAP = {
        '110100': '北京', '120100': '天津', '130100': '石家庄', '140100': '太原',
        '210100': '沈阳', '210200': '大连', '220100': '长春', '230100': '哈尔滨',
        '310100': '上海', '320100': '南京', '320200': '无锡', '320500': '苏州',
        '330100': '杭州', '330200': '宁波', '340100': '合肥', '350100': '福州',
        '350200': '厦门', '360100': '南昌', '370100': '济南', '370200': '青岛',
        '410100': '郑州', '420100': '武汉', '430100': '长沙', '440100': '广州',
        '440300': '深圳', '440600': '佛山', '450100': '南宁', '460100': '海口',
        '500100': '重庆', '510100': '成都', '520100': '贵阳', '530100': '昆明',
        '610100': '西安', '620100': '兰州', '650100': '乌鲁木齐'
    };

    let state = {
        isMonitoring: false,
        intervalId: null,
        csrfToken: null,
        neeaId: null,
        foundSeats: [],
        panelMinimized: GM_getValue('panelMinimized', false),
        isLoggedIn: false,
        queryCount: 0,
        lastQueryTime: null,
        // OCR状态
        ocrAvailable: false,
        ocrRecognizing: false,
        // 可用日期
        availableDates: [],
        loadingDates: false
    };

    // ==================== 两栏布局 CSS ====================
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
            --panel-bg: rgba(255, 255, 255, 0.95);
            --panel-border: rgba(0, 0, 0, 0.06);
            --text-primary: #1d1d1f;
            --text-secondary: #86868b;
            --accent-color: #0071e3;
            --accent-hover: #0077ed;
            --danger-color: #ff3b30;
            --success-color: #34c759;
            --warning-color: #ff9500;
            --input-bg: rgba(0, 0, 0, 0.04);
            --input-focus-bg: rgba(0, 0, 0, 0.02);
            --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
            --radius-lg: 14px;
            --radius-md: 8px;
            --radius-sm: 6px;
            --transition: all 0.2s ease;
        }

        #ielts-monitor-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 700px;
            max-width: calc(100vw - 40px);
            background: var(--panel-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--panel-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 99999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-primary);
            opacity: 0;
            transform: translateY(-10px);
            animation: slideIn 0.4s forwards ease-out;
            overflow: hidden;
        }

        @keyframes slideIn {
            to { opacity: 1; transform: translateY(0); }
        }

        /* 头部设计 */
        .panel-header {
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.04);
            cursor: move;
            user-select: none;
            background: linear-gradient(135deg, rgba(0,113,227,0.05) 0%, rgba(52,199,89,0.05) 100%);
        }

        .panel-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e5e5ea;
            box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
            transition: var(--transition);
        }
        .status-dot.active {
            background: var(--success-color);
            box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.2);
            animation: pulse-green 2s infinite;
        }
        .status-dot.warning {
            background: var(--warning-color);
        }
        @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.4); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(52, 199, 89, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
        }

        .action-btns {
            display: flex;
            gap: 4px;
        }
        .action-btns button {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px 6px;
            font-size: 16px;
            line-height: 1;
            transition: color 0.2s;
            border-radius: 4px;
        }
        .action-btns button:hover {
            color: var(--text-primary);
            background: rgba(0,0,0,0.05);
        }

        /* 两栏主体布局 */
        .panel-body {
            display: flex;
            height: 550px;
            max-height: 75vh;
        }

        /* 左侧控制面板 */
        .left-panel {
            width: 340px;
            border-right: 1px solid var(--panel-border);
            overflow-y: auto;
            padding: 14px;
        }
        .left-panel::-webkit-scrollbar { width: 4px; }
        .left-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }

        /* 右侧日志面板 */
        .right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: rgba(0,0,0,0.02);
        }

        .log-panel-header {
            padding: 10px 14px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid var(--panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .log-panel-header .clear-btn {
            font-size: 10px;
            color: var(--accent-color);
            cursor: pointer;
            background: none;
            border: none;
        }

        .log-scroll-area {
            flex: 1;
            overflow-y: auto;
            padding: 8px 12px;
            font-family: 'SF Mono', 'Menlo', monospace;
            font-size: 10px;
            line-height: 1.5;
        }
        .log-scroll-area::-webkit-scrollbar { width: 4px; }
        .log-scroll-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }

        .log-entry {
            padding: 3px 0;
            display: flex;
            gap: 6px;
            border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .log-entry .log-time {
            color: var(--text-secondary);
            flex-shrink: 0;
            font-size: 9px;
        }
        .log-entry .log-msg {
            color: var(--text-primary);
            word-break: break-all;
        }
        .log-entry.success .log-msg { color: var(--success-color); }
        .log-entry.error .log-msg { color: var(--danger-color); }
        .log-entry.warning .log-msg { color: var(--warning-color); }

        /* 区块标题 */
        .section-title {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 14px 0 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid var(--panel-border);
        }
        .section-title:first-child { margin-top: 0; }

        /* 表单控件 */
        .form-group {
            margin-bottom: 14px;
        }
        .form-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .glass-input {
            width: 100%;
            padding: 9px 11px;
            background: var(--input-bg);
            border: 1px solid transparent;
            border-radius: var(--radius-md);
            color: var(--text-primary);
            font-size: 13px;
            font-family: inherit;
            outline: none;
            transition: var(--transition);
            box-sizing: border-box;
        }

        .glass-input:focus {
            background: var(--input-focus-bg);
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }

        .glass-input::placeholder {
            color: var(--text-secondary);
        }

        select.glass-input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: var(--input-bg);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2386868b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            padding: 10px 28px 10px 11px;
            min-height: 38px;
            line-height: 1.4;
            cursor: pointer;
            color: #1d1d1f;
            font-weight: 400;
            font-size: 13px;
        }
        select.glass-input option {
            background: white;
            color: #1d1d1f;
            padding: 8px;
        }

        .row-group {
            display: flex;
            gap: 10px;
        }
        .col {
            flex: 1;
        }

        /* 城市选择器 */
        .city-picker {
            max-height: 120px;
            overflow-y: auto;
            border: 1px solid var(--panel-border);
            border-radius: var(--radius-md);
            padding: 8px;
            background: var(--panel-bg);
        }
        .city-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
        }
        .city-checkbox {
            display: flex;
            align-items: center;
            font-size: 12px;
            cursor: pointer;
            padding: 3px 4px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .city-checkbox:hover {
            background: rgba(0, 113, 227, 0.08);
        }
        .city-checkbox input {
            margin-right: 4px;
            accent-color: var(--accent-color);
        }
        .city-checkbox.selected {
            background: rgba(0, 113, 227, 0.12);
            color: var(--accent-color);
        }
        .city-actions {
            display: flex;
            gap: 8px;
            margin-top: 6px;
            align-items: center;
        }
        .city-actions .link-btn {
            font-size: 11px;
            color: var(--accent-color);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        }
        .city-actions .link-btn:hover {
            text-decoration: underline;
        }
        .city-count {
            font-size: 11px;
            color: var(--text-secondary);
            margin-left: auto;
        }

        /* iOS风格开关 */
        .toggle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 3px 0;
        }
        .toggle-label {
            font-size: 13px;
            color: var(--text-primary);
        }

        .ios-switch {
            position: relative;
            width: 40px;
            height: 22px;
        }
        .ios-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #e5e5ea;
            transition: .3s;
            border-radius: 22px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        input:checked + .slider {
            background-color: var(--success-color);
        }
        input:checked + .slider:before {
            transform: translateX(18px);
        }

        /* 按钮样式 */
        .primary-btn {
            width: 100%;
            padding: 11px;
            margin-top: 10px;
            background: linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .primary-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .primary-btn:active {
            transform: translateY(0);
        }
        .primary-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .btn-running {
            background: linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 59, 48, 0.15) 100%);
            color: var(--danger-color);
            box-shadow: none;
        }
        .btn-running:hover {
            background: linear-gradient(135deg, rgba(255, 59, 48, 0.15) 0%, rgba(255, 59, 48, 0.2) 100%);
            box-shadow: none;
        }

        .secondary-btn {
            padding: 8px 14px;
            background: rgba(0,0,0,0.05);
            color: var(--text-primary);
            border: none;
            border-radius: var(--radius-sm);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
        }
        .secondary-btn:hover {
            background: rgba(0,0,0,0.1);
        }

        /* 登录状态信息 */
        .login-status {
            background: linear-gradient(135deg, rgba(52,199,89,0.1) 0%, rgba(52,199,89,0.05) 100%);
            border-radius: var(--radius-sm);
            padding: 10px 12px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .login-status.logged-out {
            background: linear-gradient(135deg, rgba(255,149,0,0.1) 0%, rgba(255,149,0,0.05) 100%);
        }
        .login-status .status-icon {
            font-size: 18px;
        }
        .login-status .status-text {
            flex: 1;
        }
        .login-status .status-text h4 {
            margin: 0;
            font-size: 12px;
            font-weight: 600;
        }
        .login-status .status-text p {
            margin: 2px 0 0;
            font-size: 11px;
            color: var(--text-secondary);
        }

        /* 考位卡片 */
        .seats-container {
            margin-top: 14px;
        }
        .seats-header {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .seats-count {
            background: var(--success-color);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
        }
        .seat-card {
            background: #fff;
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: var(--radius-sm);
            padding: 10px 12px;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: var(--transition);
        }
        .seat-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-color: var(--accent-color);
        }
        .seat-info h4 {
            margin: 0;
            font-size: 12px;
            color: var(--text-primary);
            font-weight: 600;
        }
        .seat-info p {
            margin: 3px 0 0;
            font-size: 10px;
            color: var(--text-secondary);
        }
        .seat-info .seat-time {
            color: var(--success-color);
            font-weight: 500;
        }
        .book-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
        }
        .book-btn:hover {
            background: var(--accent-hover);
            transform: scale(1.05);
        }

        /* 日志区域 */
        .log-container {
            margin-top: 14px;
            border-top: 1px dashed rgba(0,0,0,0.08);
            padding-top: 10px;
        }
        .log-header {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .mini-log {
            font-family: 'SF Mono', 'Menlo', monospace;
            font-size: 10px;
            color: var(--text-secondary);
            max-height: 80px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .log-entry {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 0;
        }
        .log-entry::before {
            content: '';
            display: block;
            width: 4px;
            height: 4px;
            background: #d1d1d6;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .log-entry.success::before { background: var(--success-color); }
        .log-entry.error::before { background: var(--danger-color); }
        .log-entry.warning::before { background: var(--warning-color); }

        /* 统计信息 */
        .stats-bar {
            display: flex;
            justify-content: space-around;
            padding: 10px 16px;
            background: rgba(0,0,0,0.02);
            border-top: 1px solid rgba(0,0,0,0.04);
        }
        .stat-item {
            text-align: center;
        }
        .stat-item .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        .stat-item .stat-label {
            font-size: 9px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* 最小化状态 */
        #ielts-monitor-panel.minimized {
            width: auto;
            border-radius: 100px;
        }
        #ielts-monitor-panel.minimized .panel-body,
        #ielts-monitor-panel.minimized .tab-container,
        #ielts-monitor-panel.minimized .stats-bar { display: none; }
        #ielts-monitor-panel.minimized .panel-header {
            border: none;
            padding: 10px 14px;
            background: transparent;
        }
        #ielts-monitor-panel.minimized .panel-title span { display: none; }

        /* 空状态 */
        .empty-state {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
        }
        .empty-state .empty-icon {
            font-size: 32px;
            margin-bottom: 8px;
            opacity: 0.5;
        }
        .empty-state p {
            font-size: 12px;
            margin: 0;
        }

        /* OCR状态 */
        .ocr-status {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: var(--radius-sm);
            font-size: 11px;
            margin-bottom: 10px;
        }
        .ocr-status.online {
            background: linear-gradient(135deg, rgba(52,199,89,0.1) 0%, rgba(52,199,89,0.05) 100%);
            color: var(--success-color);
        }
        .ocr-status.offline {
            background: linear-gradient(135deg, rgba(255,59,48,0.1) 0%, rgba(255,59,48,0.05) 100%);
            color: var(--danger-color);
        }
        .ocr-status .ocr-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
        }
        .ocr-status.online .ocr-dot {
            animation: pulse-green 2s infinite;
        }

        /* 验证码识别中动画 */
        .captcha-recognizing {
            position: relative;
        }
        .captcha-recognizing::after {
            content: '识别中...';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            border-radius: 4px;
        }

        /* 自动识别按钮 */
        .auto-ocr-btn {
            padding: 4px 8px;
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 10px;
            cursor: pointer;
            transition: var(--transition);
        }
        .auto-ocr-btn:hover {
            background: var(--accent-hover);
        }
        .auto-ocr-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `);

    // ==================== MD5 实现 ====================
    function md5(string) {
        function rotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function addUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else return (lResult ^ lX8 ^ lY8);
        }

        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }

        function FF(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function GG(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function HH(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function II(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function convertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }

        function wordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }

        var x = convertToWordArray(string);
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }

        return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    }

    // ==================== 工具函数 ====================

    // 日志持久化存储
    const LOG_STORAGE_KEY = 'ielts_pro_logs';
    const MAX_STORED_LOGS = 200;

    // 从存储加载日志
    function loadStoredLogs() {
        try {
            const stored = GM_getValue(LOG_STORAGE_KEY, '[]');
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }

    // 保存日志到存储
    function saveLogsToStorage(logs) {
        try {
            // 只保留最新的日志
            const toSave = logs.slice(-MAX_STORED_LOGS);
            GM_setValue(LOG_STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.error('Failed to save logs:', e);
        }
    }

    // 恢复日志到UI
    function restoreLogsToUI() {
        const logArea = document.getElementById('log-scroll-area');
        if (!logArea) return;

        const logs = loadStoredLogs();
        logs.forEach(entry => {
            const div = document.createElement('div');
            div.className = `log-entry ${entry.type}`;
            div.innerHTML = `<span class="log-time">${entry.time}</span><span class="log-msg">${entry.message}</span>`;
            logArea.appendChild(div);
        });

        // 滚动到底部
        logArea.scrollTop = logArea.scrollHeight;
    }

    function log(message, type = 'normal') {
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        console.log(`[IELTS Pro ${time}] ${message}`);

        // 保存到持久化存储
        const logs = loadStoredLogs();
        logs.push({ time, message, type });
        saveLogsToStorage(logs);

        // 更新UI
        const logArea = document.getElementById('log-scroll-area');
        if (logArea) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.innerHTML = `<span class="log-time">${time}</span><span class="log-msg">${message}</span>`;
            logArea.appendChild(entry);
            logArea.scrollTop = logArea.scrollHeight;

            // UI中限制显示数量
            while (logArea.children.length > MAX_STORED_LOGS) {
                logArea.removeChild(logArea.firstChild);
            }
        }
    }

    function playAlert() {
        if (!CONFIG.soundAlert) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);

            // 第二声
            setTimeout(() => {
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.frequency.value = 1100;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                osc2.start(audioCtx.currentTime);
                osc2.stop(audioCtx.currentTime + 0.5);
            }, 200);
        } catch (e) {
            console.warn('Audio alert failed:', e);
        }
    }

    function showNotification(title, message) {
        if (!CONFIG.desktopNotification) return;
        if (typeof GM_notification !== 'undefined') {
            GM_notification({ title, text: message, timeout: 8000 });
        } else if (Notification.permission === 'granted') {
            new Notification(title, { body: message, icon: 'https://ielts.neea.cn/favicon.ico' });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Bark 推送通知 (iOS)
    function sendBarkNotification(title, message) {
        if (!CONFIG.barkEnabled || !CONFIG.barkUrl) return;

        const barkUrl = CONFIG.barkUrl.replace(/\/$/, ''); // 移除末尾斜杠
        const url = `${barkUrl}/${encodeURIComponent(title)}/${encodeURIComponent(message)}?sound=alarm`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    console.log('[Bark] 推送成功');
                } else {
                    console.error('[Bark] 推送失败:', response.status);
                }
            },
            onerror: (error) => {
                console.error('[Bark] 推送错误:', error);
            }
        });
    }

    // 测试 Bark 推送
    function testBarkNotification() {
        if (!CONFIG.barkUrl) {
            log('请先填写 Bark URL', 'warning');
            return;
        }

        const barkUrl = CONFIG.barkUrl.replace(/\/$/, '');
        const url = `${barkUrl}/IELTS考位监控/测试推送成功!?sound=alarm`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    log('Bark 推送测试成功!', 'success');
                } else {
                    log(`Bark 推送失败: ${response.status}`, 'error');
                }
            },
            onerror: (error) => {
                log(`Bark 推送错误: ${error.message || '网络错误'}`, 'error');
            }
        });
    }

    function extractNeeaId() {
        const match = window.location.pathname.match(/\/myHome\/(\d+)/);
        if (match) {
            state.neeaId = match[1];
            state.isLoggedIn = true;
            updateLoginStatus();
        }
    }

    function extractCsrfToken() {
        // 尝试多种方式获取CSRF token
        // 1. 从hidden input获取
        const csrfInput = document.querySelector('input[name="_csrf"]');
        if (csrfInput && csrfInput.value) {
            state.csrfToken = csrfInput.value;
            return;
        }

        // 2. 从meta标签获取
        const csrfMeta = document.querySelector('meta[name="_csrf"]');
        if (csrfMeta && csrfMeta.content) {
            state.csrfToken = csrfMeta.content;
            return;
        }

        // 3. 从cookie获取 (某些系统会这样做)
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'XSRF-TOKEN' || name === '_csrf') {
                state.csrfToken = decodeURIComponent(value);
                return;
            }
        }
    }

    function saveConfig() {
        Object.keys(CONFIG).forEach(key => GM_setValue(key, CONFIG[key]));
    }

    // 获取可用考试日期
    async function fetchAvailableDates(cityCode) {
        if (!state.neeaId || !state.csrfToken) {
            log('需要先登录获取可用日期', 'warning');
            return [];
        }

        const $ = unsafeWindow.jQuery || unsafeWindow.$;
        if (!$) return [];

        state.loadingDates = true;
        state.availableDates = [];
        updateDateDropdown();

        const productCode = CONFIG.productType;
        const dates = [];

        // 生成未来90天的日期
        const today = new Date();
        const futureDates = [];
        for (let i = 1; i <= 90; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            futureDates.push(d.toISOString().split('T')[0]);
        }

        log(`正在加载 ${cityCode ? CITY_MAP[cityCode] : '全部城市'} 的可用日期...`, 'normal');

        // 查询每个日期（使用Promise.all + 限制并发）
        const city = cityCode || CONFIG.targetCities[0] || '110100';

        return new Promise((resolve) => {
            let completed = 0;
            const batchSize = 10;

            const processDate = (date) => {
                return new Promise((dateResolve) => {
                    $.ajax({
                        url: `/myHome/${state.neeaId}/queryTestSeats`,
                        type: 'POST',
                        data: {
                            productCode: productCode,
                            queryCity: city,
                            queryTestDate: date,
                            queryActionType: 'Order.QueryOrder',
                            neeaAppId: '',
                            _csrf: state.csrfToken
                        },
                        dataType: 'json',
                        success: (data) => {
                            // 如果返回了对象且有adminDate或productCode，说明这天有考试安排
                            // (即使没有testSeats也算有考试日期，只是没空位)
                            if (data && typeof data === 'object' && data !== true) {
                                if (data.adminDate || data.productCode) {
                                    dates.push(date);
                                } else if (Array.isArray(data) && data.some(d => d && d.adminDate)) {
                                    dates.push(date);
                                }
                            }
                            dateResolve();
                        },
                        error: () => dateResolve()
                    });
                });
            };

            // 分批处理
            const processBatch = async (batchDates) => {
                await Promise.all(batchDates.map(d => processDate(d)));
                completed += batchDates.length;

                if (completed >= futureDates.length) {
                    dates.sort();
                    state.availableDates = dates;
                    state.loadingDates = false;
                    updateDateDropdown();
                    log(`找到 ${dates.length} 个可用日期`, 'success');
                    resolve(dates);
                }
            };

            // 分批发送请求
            for (let i = 0; i < futureDates.length; i += batchSize) {
                setTimeout(() => {
                    processBatch(futureDates.slice(i, i + batchSize));
                }, Math.floor(i / batchSize) * 500);
            }
        });
    }

    // 更新日期下拉框
    function updateDateDropdown() {
        const dateSelect = document.getElementById('cfg-date-select');
        if (!dateSelect) return;

        if (state.loadingDates) {
            dateSelect.innerHTML = '<option value="">加载中...</option>';
            dateSelect.disabled = true;
            return;
        }

        if (state.availableDates.length === 0) {
            dateSelect.innerHTML = '<option value="">无可用日期</option>';
            dateSelect.disabled = true;
            return;
        }

        dateSelect.disabled = false;
        dateSelect.innerHTML = state.availableDates.map(date =>
            `<option value="${date}" ${date === CONFIG.queryDate ? 'selected' : ''}>${date}</option>`
        ).join('');
    }

    // 解析日期字符串 (支持 "2026年01月10日" 和 "2026-01-10" 格式)
    function parseTestDate(dateStr) {
        if (!dateStr) return null;

        // 格式: 2026年01月10日
        const cnMatch = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (cnMatch) {
            return `${cnMatch[1]}-${cnMatch[2]}-${cnMatch[3]}`;
        }

        // 格式: 2026-01-10
        const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            return dateStr;
        }

        return null;
    }

    // 生成日期范围（最多 maxDays 天，避免请求过多）
    function getDateRange(start, end, maxDays = 7) {
        if (!start) return [];

        const startDate = new Date(start);
        const endDate = new Date(end || start);

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return [];
        }

        // end < start 时自动纠正为单日
        const normalizedEnd = endDate < startDate ? new Date(startDate) : endDate;

        const dates = [];
        let current = new Date(startDate);
        let count = 0;

        while (current <= normalizedEnd && count < maxDays) {
            dates.push(formatDate(current));
            current.setDate(current.getDate() + 1);
            count++;
        }

        return dates;
    }

    // ==================== Hook 逻辑 ====================
    function hookNetwork() {
        // XHR Hook
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            const xhr = this;

            // Hook queryTestSeats 响应
            if (this._url && this._url.includes('/queryTestSeats')) {
                xhr.addEventListener('load', function () {
                    if (xhr.status === 200) {
                        try {
                            const res = JSON.parse(xhr.responseText);
                            handleSeatResponse(res, body);
                        } catch (e) {
                            console.error('Parse queryTestSeats response error:', e);
                        }
                    }
                });
            }

            // 从请求体提取CSRF token
            if (body && typeof body === 'string') {
                const csrfMatch = body.match(/_csrf=([^&]+)/);
                if (csrfMatch) {
                    state.csrfToken = decodeURIComponent(csrfMatch[1]);
                }
            }

            return originalSend.apply(this, arguments);
        };

        // 设置请求头时提取CSRF
        const originalSetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            if (name.toLowerCase() === 'x-csrf-token' && value) {
                state.csrfToken = value;
            }
            return originalSetHeader.apply(this, arguments);
        };

        // Fetch Hook
        const originalFetch = window.fetch;
        window.fetch = function (url, options = {}) {
            const promise = originalFetch.apply(this, arguments);

            if (url && url.toString().includes('/queryTestSeats')) {
                promise.then(res => {
                    res.clone().json().then(data => {
                        handleSeatResponse(data, options.body);
                    }).catch(e => { });
                }).catch(e => { });
            }

            // 从headers提取CSRF
            if (options.headers) {
                const headers = options.headers;
                if (headers['X-CSRF-TOKEN']) {
                    state.csrfToken = headers['X-CSRF-TOKEN'];
                } else if (headers instanceof Headers && headers.get('X-CSRF-TOKEN')) {
                    state.csrfToken = headers.get('X-CSRF-TOKEN');
                }
            }

            return promise;
        };

        log('网络监控已启动', 'success');
    }

    /**
     * 处理考位查询响应
     * 响应格式:
     * {
     *   productCode: "IELTSPBT",
     *   cityCode: "110100",
     *   cityName: "北京市",
     *   adminDate: "2026-01-10",
     *   testDate: "2026年01月10日",
     *   testSeats: [{
     *     id: "0900",
     *     testTime: "09:00",
     *     testSeat: [{
     *       seatId: "...",
     *       centerName: "北京语言大学雅思纸笔考点",
     *       seatStatus: 1,  // 1=有名额
     *       optStatus: 1,   // 1=可预定
     *       seatStatusMsg: "有名额"
     *     }]
     *   }]
     * }
     */
    function handleSeatResponse(response, requestBody) {
        if (!response) return;

        state.queryCount++;
        state.lastQueryTime = new Date();
        updateStats();

        // 调试：查看响应结构
        console.log('[IELTS Debug] handleSeatResponse 响应:', JSON.stringify(response).substring(0, 300));

        // 检查是否有testSeats数组
        if (!response.testSeats || !Array.isArray(response.testSeats)) {
            // 有考试日期但无考位
            const cityName = response.cityName || CITY_MAP[response.cityCode] || response.cityCode || '';
            const testDate = parseTestDate(response.adminDate || response.testDate) || '';
            if (cityName || testDate) {
                log(`${cityName} ${testDate} 暂无考位`, 'normal');
            }
            return;
        }

        const testDate = parseTestDate(response.adminDate || response.testDate);
        const cityCode = response.cityCode;
        const cityName = response.cityName || CITY_MAP[cityCode] || cityCode;

        // 日期范围过滤
        if (testDate) {
            if (CONFIG.startDate && testDate < CONFIG.startDate) {
                return;
            }
            if (CONFIG.endDate && testDate > CONFIG.endDate) {
                return;
            }
        }

        // 提取所有可用考位
        const availableSeats = [];

        for (const timeSlot of response.testSeats) {
            if (!timeSlot.testSeat || !Array.isArray(timeSlot.testSeat)) continue;

            for (const seat of timeSlot.testSeat) {
                // seatStatus=1 且 optStatus=1 表示有名额且可预定
                if (seat.seatStatus === 1 && seat.optStatus === 1) {
                    // 考点过滤：如果设置了考点关键词，检查是否匹配
                    if (CONFIG.targetCenters) {
                        const keywords = CONFIG.targetCenters.split(',').map(k => k.trim()).filter(k => k);
                        const centerName = seat.centerName || '';
                        const matchesCenter = keywords.some(kw => centerName.includes(kw));
                        if (!matchesCenter) continue; // 不匹配则跳过
                    }

                    availableSeats.push({
                        seatId: seat.seatId,
                        centerGuid: seat.centerGuid,
                        centerCode: seat.centerCode,
                        centerName: seat.centerName,
                        testTime: timeSlot.testTime,
                        testDate: testDate,
                        cityCode: cityCode,
                        cityName: cityName,
                        productCode: response.productCode || CONFIG.productType,
                        levelCode: seat.levelCode,
                        seatStatusMsg: seat.seatStatusMsg
                    });
                }
            }
        }

        if (availableSeats.length > 0) {
            log(`发现 ${availableSeats.length} 个可用考位!`, 'success');

            // 合并到已发现列表,避免重复
            for (const seat of availableSeats) {
                const exists = state.foundSeats.some(s => s.seatId === seat.seatId);
                if (!exists) {
                    state.foundSeats.unshift(seat);
                }
            }

            // 限制列表大小
            if (state.foundSeats.length > 20) {
                state.foundSeats = state.foundSeats.slice(0, 20);
            }

            updateSeatList();
            playAlert();
            showNotification('IELTS 考位提醒',
                `发现 ${availableSeats.length} 个可用考位!\n${cityName} - ${testDate}`);
            sendBarkNotification('IELTS考位提醒',
                `发现 ${availableSeats.length} 个可用考位! ${cityName} - ${testDate}`);

            if (CONFIG.autoRegister && availableSeats.length > 0) {
                autoRegister(availableSeats[0]);
            }
        } else {
            log(`${cityName} ${testDate || ''} 暂无考位`, 'normal');
        }
    }

    function updateSeatList() {
        const container = document.getElementById('seats-container');
        if (!container) return;

        if (state.foundSeats.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>暂未发现可用考位</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="seats-header">
                <span>发现的考位</span>
                <span class="seats-count">${state.foundSeats.length}</span>
            </div>
            ${state.foundSeats.map((seat, idx) => `
                <div class="seat-card">
                    <div class="seat-info">
                        <h4>${seat.cityName} · ${seat.testDate}</h4>
                        <p>${seat.centerName}</p>
                        <p class="seat-time">⏰ ${seat.testTime} · ${seat.levelCode || 'A/G'}</p>
                    </div>
                    <button class="book-btn" onclick="window.ieltsPro.register(${idx})">预定</button>
                </div>
            `).join('')}
        `;
    }

    function updateStats() {
        const queryCountEl = document.getElementById('stat-query-count');
        const lastTimeEl = document.getElementById('stat-last-time');
        const seatsCountEl = document.getElementById('stat-seats-count');

        if (queryCountEl) queryCountEl.textContent = state.queryCount;
        if (lastTimeEl) lastTimeEl.textContent = state.lastQueryTime ?
            state.lastQueryTime.toLocaleTimeString('zh-CN', { hour12: false }) : '--';
        if (seatsCountEl) seatsCountEl.textContent = state.foundSeats.length;
    }

    function autoRegister(seat) {
        if (!state.neeaId) {
            log('请先登录', 'error');
            return;
        }

        log(`自动跳转报名: ${seat.centerName}`, 'success');

        // 构建报名URL
        const url = `#!/registration?productType=${seat.productCode}&examId=${seat.seatId}`;

        if (typeof window.changePage === 'function') {
            window.changePage(url, true);
        } else {
            window.location.hash = url;
        }
    }

    // ==================== 监控控制 ====================
    function startMonitor() {
        if (state.isMonitoring) return;
        if (!state.neeaId) {
            extractNeeaId();
            if (!state.neeaId) {
                log('请先登录NEEA账号', 'error');
                alert('请先登录NEEA账号');
                return;
            }
        }

        state.isMonitoring = true;
        CONFIG.monitorEnabled = true;
        saveConfig();
        updateUIState();
        log('监控已启动', 'success');

        // 立即执行一次查询
        triggerQuery();

        // 设置定时器
        state.intervalId = setInterval(triggerQuery, CONFIG.refreshInterval);
    }

    function stopMonitor() {
        state.isMonitoring = false;
        CONFIG.monitorEnabled = false;
        saveConfig();
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        updateUIState();
        log('监控已停止', 'warning');
    }

    function triggerQuery() {
        if (!state.csrfToken) {
            extractCsrfToken();
            if (!state.csrfToken) {
                log('等待CSRF Token...', 'warning');
                return;
            }
        }

        // 使用页面的jQuery发送请求（避免412错误）
        const $ = unsafeWindow.jQuery || unsafeWindow.$;
        if (!$) {
            log('页面jQuery不可用，使用备用方案', 'warning');
            triggerQueryFallback();
            return;
        }

        const queryDate = CONFIG.queryDate || defaultQueryDate;
        log(`查询 ${CONFIG.targetCities.length} 个城市, 日期: ${queryDate}`, 'normal');

        // 遍历每个城市
        CONFIG.targetCities.forEach((city, idx) => {
            // 延迟请求，避免服务器压力
            setTimeout(() => {
                const cityName = CITY_MAP[city] || city;

                $.ajax({
                    url: `/myHome/${state.neeaId}/queryTestSeats`,
                    type: 'POST',
                    data: {
                        productCode: CONFIG.productType,
                        queryCity: city,
                        queryTestDate: queryDate,
                        queryActionType: 'Order.QueryOrder',
                        neeaAppId: '',
                        _csrf: state.csrfToken
                    },
                    dataType: 'json',
                    success: function (data) {
                        // 调试日志
                        console.log(`[IELTS Debug] ${cityName} ${queryDate} 响应:`, typeof data, Array.isArray(data) ? `数组[${data.length}]` : (data ? Object.keys(data) : 'null'));
                        // 响应处理由 XHR Hook 统一处理
                    },
                    error: function (xhr) {
                        if (xhr.status === 412) {
                            log('412错误 - 刷新Token', 'warning');
                            extractCsrfToken();
                        }
                    }
                });
            }, idx * 200);
        });
    }

    // 备用查询方案（GM_xmlhttpRequest）
    function triggerQueryFallback() {
        const queryDate = CONFIG.queryDate || defaultQueryDate;

        CONFIG.targetCities.forEach((city, idx) => {
            const body = new URLSearchParams({
                productCode: CONFIG.productType,
                queryCity: city,
                queryTestDate: queryDate,
                queryActionType: 'Order.QueryOrder',
                neeaAppId: '',
                _csrf: state.csrfToken
            });

            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${window.location.origin}/myHome/${state.neeaId}/queryTestSeats`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: body.toString(),
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (Array.isArray(data)) {
                                    data.forEach(item => handleSeatResponse(item));
                                } else if (data && typeof data === 'object') {
                                    handleSeatResponse(data);
                                }
                            } catch (e) {
                                log(`解析失败: ${e.message}`, 'error');
                            }
                        }
                    }
                });
            }, idx * 200);
        });
    }

    function updateUIState() {
        const btn = document.getElementById('toggle-btn');
        const dot = document.getElementById('status-dot');

        if (btn) {
            btn.textContent = state.isMonitoring ? '停止监控' : '开始监控';
            btn.className = state.isMonitoring ? 'primary-btn btn-running' : 'primary-btn';
        }
        if (dot) {
            dot.className = `status-dot ${state.isMonitoring ? 'active' : (state.isLoggedIn ? '' : 'warning')}`;
        }
    }

    function updateLoginStatus() {
        const statusEl = document.getElementById('login-status');
        if (!statusEl) return;

        if (state.isLoggedIn && state.neeaId) {
            statusEl.className = 'login-status';
            statusEl.innerHTML = `
                <span class="status-icon">✅</span>
                <div class="status-text">
                    <h4>已登录</h4>
                    <p>NEEA ID: ${state.neeaId}</p>
                </div>
            `;
        } else {
            statusEl.className = 'login-status logged-out';
            statusEl.innerHTML = `
                <span class="status-icon">⚠️</span>
                <div class="status-text">
                    <h4>未登录</h4>
                    <p>请先登录NEEA账号</p>
                </div>
            `;
        }
    }

    // ==================== 登录功能 ====================

    // 登录错误类型
    const LOGIN_ERROR = {
        CAPTCHA_WRONG: 'CAPTCHA_WRONG',
        CREDENTIALS_WRONG: 'CREDENTIALS_WRONG',
        CSRF_ERROR: 'CSRF_ERROR',
        NETWORK_ERROR: 'NETWORK_ERROR',
        UNKNOWN: 'UNKNOWN'
    };

    /**
     * 登录函数 - 支持两种模式
     * @param {string} userId - 用户名
     * @param {string} password - 密码  
     * @param {string} captcha - 验证码
     * @param {boolean} useFormSubmit - 是否使用表单提交（手动登录用，自动处理重定向）
     */
    function doLogin(userId, password, captcha, useFormSubmit = false) {
        if (!userId || !password) {
            log('请输入用户名和密码', 'error');
            return Promise.reject({ type: LOGIN_ERROR.CREDENTIALS_WRONG, message: '请输入用户名和密码' });
        }

        return new Promise((resolve, reject) => {
            // 先获取登录页面以获取CSRF token
            fetch('/login', {
                method: 'GET',
                credentials: 'include'
            }).then(res => res.text()).then(html => {
                const csrfMatch = html.match(/name="_csrf"\s+value="([^"]+)"/);
                if (!csrfMatch) {
                    throw { type: LOGIN_ERROR.CSRF_ERROR, message: '无法获取CSRF Token' };
                }

                const csrf = csrfMatch[1];
                const passwordHash = md5(password);

                // 保存用户名
                if (CONFIG.rememberLogin) {
                    GM_setValue('savedUserId', userId);
                }

                // 模式1: 表单提交（手动登录用，页面会自动导航）
                if (useFormSubmit) {
                    log('正在提交登录...', 'normal');
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = '/login';
                    form.style.display = 'none';

                    const addField = (name, value) => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = name;
                        input.value = value;
                        form.appendChild(input);
                    };

                    addField('userId', userId);
                    addField('userPwd', passwordHash);
                    if (captcha) addField('checkImageCode', captcha);
                    addField('_csrf', csrf);

                    document.body.appendChild(form);
                    form.submit();
                    resolve({ success: true, message: '表单已提交' });
                    return;
                }

                // 模式2: Fetch模式（自动登录用，可检测错误并重试）
                const formData = new URLSearchParams();
                formData.append('userId', userId);
                formData.append('userPwd', passwordHash);
                if (captcha) formData.append('checkImageCode', captcha);
                formData.append('_csrf', csrf);

                return fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                    credentials: 'include',
                    redirect: 'follow'
                });
            }).then(async res => {
                if (!res) return; // 表单提交模式不会到这里

                const finalUrl = res.url || '';

                // 登录成功
                if (finalUrl.includes('/myHome/')) {
                    const match = finalUrl.match(/\/myHome\/(\d+)/);
                    if (match) {
                        state.neeaId = match[1];
                        state.isLoggedIn = true;
                        log('登录成功! 正在跳转...', 'success');
                        updateLoginStatus();

                        // 直接跳转到正确的首页URL (包含hash)
                        const homeUrl = `/myHome/${match[1]}/index#!/homepage`;
                        window.location.href = homeUrl;

                        resolve({ success: true, neeaId: match[1] });
                        return;
                    }
                }

                // 登录失败，检测错误类型
                const responseHtml = await res.text();

                // 验证码错误检测
                const captchaPatterns = ['验证码', 'checkImage', '图形码', 'captcha'];
                const errorPatterns = ['错误', '不正确', '无效', '失败', 'error', 'invalid'];
                const hasCaptchaError = captchaPatterns.some(p => responseHtml.includes(p)) &&
                    errorPatterns.some(p => responseHtml.toLowerCase().includes(p));
                if (hasCaptchaError) {
                    throw { type: LOGIN_ERROR.CAPTCHA_WRONG, message: '验证码错误' };
                }

                // 凭证错误检测
                const credPatterns = ['用户名或密码', '密码错误', '账号不存在', '用户不存在'];
                if (credPatterns.some(p => responseHtml.includes(p))) {
                    throw { type: LOGIN_ERROR.CREDENTIALS_WRONG, message: '用户名或密码错误' };
                }

                // 默认为验证码错误（触发重试）
                throw { type: LOGIN_ERROR.CAPTCHA_WRONG, message: '登录失败,可能验证码错误' };

            }).catch(err => {
                const errorInfo = err.type ? err : { type: LOGIN_ERROR.NETWORK_ERROR, message: err.message || '网络错误' };
                log(`登录失败: ${errorInfo.message}`, 'error');
                reject(errorInfo);
            });
        });
    }

    function checkLoginStatus() {
        // 检查是否需要验证码
        const userId = document.getElementById('login-userId')?.value;
        if (!userId) return;

        fetch(`/getLoginCountsState?loginName=${encodeURIComponent(userId)}`, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(data => {
            const captchaArea = document.getElementById('captcha-area');
            if (data === 'CHECKIMAGE' && captchaArea) {
                captchaArea.style.display = 'block';
                refreshCaptcha();
            }
        }).catch(() => { });
    }

    async function refreshCaptcha() {
        const captchaImg = document.getElementById('captcha-img');
        if (!captchaImg) return;

        const url = `/checkImage?t=${Date.now()}`;
        try {
            const res = await fetch(url, { method: 'GET', credentials: 'include' });
            const contentType = res.headers.get('content-type') || '';

            // 新版：/checkImage 返回 JSON，包含实际图片URL
            if (contentType.includes('application/json')) {
                const data = await res.json().catch(() => null);
                if (data && data.chkImgFilename) {
                    captchaImg.src = data.chkImgFilename;
                    return;
                }
            }

            // 旧版：/checkImage 直接返回图片
            captchaImg.src = url;
        } catch (e) {
            // 兜底：至少触发一次刷新（如果返回JSON，此处可能仍无法展示图片）
            captchaImg.src = url;
        }
    }

    /**
     * 刷新验证码并自动识别
     */
    async function refreshAndRecognizeCaptcha() {
        if (!state.ocrAvailable) {
            refreshCaptcha();
            return null;
        }
        return autoRecognizeCaptcha();
    }

    // ==================== OCR 功能 ====================

    /**
     * 检查OCR服务是否可用
     */
    function checkOcrServer() {
        return new Promise((resolve) => {
            // 如果使用 jfbym 云端服务，只需检查 token 是否存在
            if (CONFIG.ocrProvider === 'jfbym') {
                if (CONFIG.jfbymToken && CONFIG.jfbymToken.length > 10) {
                    state.ocrAvailable = true;
                    log('jfbym云端打码已配置', 'success');
                    updateOcrStatus();
                    resolve(true);
                } else {
                    state.ocrAvailable = false;
                    log('jfbym Token未配置', 'warning');
                    updateOcrStatus();
                    resolve(false);
                }
                return;
            }

            // 本地 OCR 服务检查
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.ocrServerUrl}/health`,
                timeout: 3000,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.status === 'ok') {
                                state.ocrAvailable = true;
                                log('本地OCR服务已连接', 'success');
                                updateOcrStatus();
                                resolve(true);
                                return;
                            }
                        } catch (e) { }
                    }
                    state.ocrAvailable = false;
                    updateOcrStatus();
                    resolve(false);
                },
                onerror: () => {
                    state.ocrAvailable = false;
                    updateOcrStatus();
                    resolve(false);
                },
                ontimeout: () => {
                    state.ocrAvailable = false;
                    updateOcrStatus();
                    resolve(false);
                }
            });
        });
    }

    /**
     * 更新OCR状态显示
     */
    function updateOcrStatus() {
        const statusEl = document.getElementById('ocr-status');
        if (!statusEl) return;

        const providerName = CONFIG.ocrProvider === 'jfbym' ? 'jfbym云端' : '本地OCR';

        if (state.ocrAvailable) {
            statusEl.className = 'ocr-status online';
            statusEl.innerHTML = `<span class="ocr-dot"></span> ${providerName}已连接`;
        } else {
            statusEl.className = 'ocr-status offline';
            statusEl.innerHTML = '<span class="ocr-dot"></span> OCR服务未连接';
        }
    }

    /**
     * 获取验证码图片的Base64 (使用GM_xmlhttpRequest绕过跨域)
     * 1. 先请求 /checkImage 获取图片URL
     * 2. 再请求实际图片URL获取图片数据
     */
    function fetchCaptchaBase64() {
        return new Promise((resolve, reject) => {
            const captchaApiUrl = `https://ielts.neea.cn/checkImage?t=${Date.now()}`;

            // 第一步: 获取验证码图片URL
            GM_xmlhttpRequest({
                method: 'GET',
                url: captchaApiUrl,
                timeout: 10000,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            // 解析JSON响应获取图片URL
                            const data = JSON.parse(response.responseText);
                            if (!data.chkImgFilename) {
                                reject(new Error('未获取到验证码图片URL'));
                                return;
                            }

                            const imageUrl = data.chkImgFilename;
                            log(`获取到验证码图片URL: ${imageUrl}`);

                            // 第二步: 获取实际图片数据
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: imageUrl,
                                responseType: 'arraybuffer',
                                timeout: 10000,
                                onload: (imgResponse) => {
                                    if (imgResponse.status === 200) {
                                        try {
                                            // 将 ArrayBuffer 转换为 Base64
                                            const bytes = new Uint8Array(imgResponse.response);
                                            let binary = '';
                                            for (let i = 0; i < bytes.byteLength; i++) {
                                                binary += String.fromCharCode(bytes[i]);
                                            }
                                            const base64 = btoa(binary);
                                            const dataUrl = `data:image/jpeg;base64,${base64}`;
                                            resolve(dataUrl);
                                        } catch (e) {
                                            reject(new Error(`转换图片失败: ${e.message}`));
                                        }
                                    } else {
                                        reject(new Error(`下载图片失败: ${imgResponse.status}`));
                                    }
                                },
                                onerror: () => reject(new Error('下载图片失败')),
                                ontimeout: () => reject(new Error('下载图片超时'))
                            });

                        } catch (e) {
                            reject(new Error(`解析验证码API响应失败: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`获取验证码URL失败: ${response.status}`));
                    }
                },
                onerror: () => reject(new Error('请求验证码API失败')),
                ontimeout: () => reject(new Error('请求验证码API超时'))
            });
        });
    }

    /**
     * 调用OCR服务识别验证码
     * 支持两种提供商: jfbym (云端) 和 local (本地ddddocr)
     */
    function recognizeCaptcha(imageBase64) {
        if (CONFIG.ocrProvider === 'jfbym') {
            return recognizeCaptchaJfbym(imageBase64);
        } else {
            return recognizeCaptchaLocal(imageBase64);
        }
    }

    /**
     * jfbym.com 云端打码 API
     * 文档: https://zhuce.jfbym.com/demo.html
     */
    function recognizeCaptchaJfbym(imageBase64) {
        return new Promise((resolve, reject) => {
            // 去掉 data:image/xxx;base64, 前缀
            let b64 = imageBase64;
            if (b64.includes(',')) {
                b64 = b64.split(',')[1];
            }

            log(`调用jfbym API, 图片大小: ${b64.length} 字符`, 'normal');

            const requestData = {
                token: CONFIG.jfbymToken,
                type: CONFIG.jfbymType,
                image: b64
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.jfbym.com/api/YmServer/customApi',  // 使用 HTTPS
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestData),
                timeout: 30000,
                onload: (response) => {
                    log(`jfbym响应状态: ${response.status}`, 'normal');
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            log(`jfbym响应: ${JSON.stringify(data).substring(0, 200)}`, 'normal');
                            // jfbym 返回格式: {code: 10000, msg: "success", data: {data: "xxxx"}}
                            if (data.code === 10000 && data.data && data.data.data) {
                                const code = data.data.data.trim();
                                log(`jfbym识别成功: ${code}`, 'success');
                                resolve(code);
                                return;
                            } else {
                                log(`jfbym返回错误: code=${data.code}, msg=${data.msg}`, 'error');
                            }
                        } catch (e) {
                            log(`jfbym响应解析失败: ${e.message}, 原始响应: ${response.responseText.substring(0, 100)}`, 'error');
                        }
                    } else {
                        log(`jfbym请求失败: HTTP ${response.status}, 响应: ${response.responseText?.substring(0, 100)}`, 'error');
                    }
                    reject(new Error('jfbym识别失败'));
                },
                onerror: (err) => {
                    log(`jfbym请求出错: ${JSON.stringify(err)}`, 'error');
                    reject(new Error('jfbym请求出错'));
                },
                ontimeout: () => {
                    log('jfbym请求超时 (30秒)', 'error');
                    reject(new Error('jfbym请求超时'));
                }
            });
        });
    }

    /**
     * 本地 ddddocr 服务 (备用)
     */
    function recognizeCaptchaLocal(imageBase64) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.ocrServerUrl}/ocr/b64`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ image: imageBase64 }),
                timeout: 10000,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.success && data.code) {
                                resolve(data.code);
                                return;
                            }
                        } catch (e) { }
                    }
                    reject(new Error('本地OCR识别失败'));
                },
                onerror: (err) => {
                    reject(new Error('本地OCR请求失败'));
                },
                ontimeout: () => {
                    reject(new Error('本地OCR请求超时'));
                }
            });
        });
    }

    /**
     * 自动识别当前验证码
     * @param {number} retryCount - 当前重试次数 (内部使用)
     * @param {boolean} isInternalRetry - 是否是内部重试 (内部使用)
     */
    async function autoRecognizeCaptcha(retryCount = 0, isInternalRetry = false) {
        // 只在首次调用时检查状态，内部重试跳过检查
        if (!isInternalRetry) {
            if (!state.ocrAvailable) {
                log('OCR服务不可用', 'warning');
                return null;
            }
            if (state.ocrRecognizing) {
                log('正在识别中，请稍候...', 'warning');
                return null;
            }
        }

        const captchaImg = document.getElementById('captcha-img');
        const captchaInput = document.getElementById('login-captcha');

        if (!captchaInput) {
            log('找不到验证码输入框', 'error');
            return null;
        }

        state.ocrRecognizing = true;
        if (captchaImg?.parentElement) {
            captchaImg.parentElement.classList.add('captcha-recognizing');
        }

        try {
            log('正在获取验证码图片...', 'normal');

            // 使用GM_xmlhttpRequest获取验证码图片 (绕过跨域)
            const base64 = await fetchCaptchaBase64();

            // 同时更新页面上的验证码图片显示
            if (captchaImg && base64) {
                captchaImg.src = base64;
            }

            log('正在识别验证码...', 'normal');

            // 调用OCR识别
            const code = await recognizeCaptcha(base64);

            if (code) {
                // IELTS验证码全部为大写字母
                const upperCode = code.toUpperCase();
                captchaInput.value = upperCode;
                log(`验证码识别成功: ${upperCode}`, 'success');
                state.ocrRecognizing = false;
                if (captchaImg?.parentElement) {
                    captchaImg.parentElement.classList.remove('captcha-recognizing');
                }
                return upperCode;
            } else {
                throw new Error('识别结果为空');
            }
        } catch (err) {
            log(`验证码识别失败: ${err.message}`, 'error');

            // 重试逻辑
            if (retryCount < CONFIG.ocrRetryCount - 1) {
                log(`重试识别 (${retryCount + 2}/${CONFIG.ocrRetryCount})...`, 'warning');
                // 重置状态以允许重试
                state.ocrRecognizing = false;
                // 延迟后重试
                await new Promise(r => setTimeout(r, 1000));
                return autoRecognizeCaptcha(retryCount + 1, true);  // 标记为内部重试
            }
        }

        // 最终清理
        state.ocrRecognizing = false;
        if (captchaImg?.parentElement) {
            captchaImg.parentElement.classList.remove('captcha-recognizing');
        }

        return null;
    }

    /**
     * 带自动打码的登录流程 - 支持失败重试直到成功
     * @param {string} userId - 用户名
     * @param {string} password - 密码
     * @param {number} maxAttempts - 最大重试次数 (默认10次)
     */
    async function doLoginWithOcr(userId, password, maxAttempts = 10) {
        if (!userId || !password) {
            log('请输入用户名和密码', 'error');
            return Promise.reject({ type: LOGIN_ERROR.CREDENTIALS_WRONG, message: '请输入用户名和密码' });
        }

        // 检查OCR服务
        if (!CONFIG.autoOcr || !state.ocrAvailable) {
            log('OCR服务不可用，请手动输入验证码', 'warning');
            refreshCaptcha();
            return Promise.reject({ type: 'OCR_UNAVAILABLE', message: 'OCR不可用，请手动登录' });
        }

        log(`开始自动登录流程 (最多尝试 ${maxAttempts} 次)...`, 'normal');

        // 显示验证码区域
        const captchaArea = document.getElementById('captcha-area');
        if (captchaArea) {
            captchaArea.style.display = 'block';
        }

        let attempt = 0;
        let lastError = null;

        while (attempt < maxAttempts) {
            attempt++;
            log(`第 ${attempt}/${maxAttempts} 次尝试登录...`, 'normal');

            try {
                // 1. 获取并识别验证码
                log('正在获取并识别验证码...', 'normal');
                const captchaCode = await autoRecognizeCaptcha();

                if (!captchaCode) {
                    log(`验证码识别失败，${attempt < maxAttempts ? '即将重试...' : '已达最大次数'}`, 'warning');
                    await sleep(1000);
                    continue;
                }

                log(`验证码识别结果: ${captchaCode}，正在提交登录...`, 'normal');

                // 2. 尝试登录
                const result = await doLogin(userId, password, captchaCode);

                if (result && result.success) {
                    log(`登录成功! 共尝试 ${attempt} 次`, 'success');
                    playAlert();
                    showNotification('IELTS 登录成功', `已成功登录 NEEA 账号`);
                    return result;
                }
            } catch (err) {
                lastError = err;

                // 根据错误类型决定是否继续重试
                if (err.type === LOGIN_ERROR.CAPTCHA_WRONG) {
                    log(`验证码错误，${attempt < maxAttempts ? '刷新重试...' : '已达最大次数'}`, 'warning');
                    // 验证码错误，继续重试
                    await sleep(500);
                    continue;
                } else if (err.type === LOGIN_ERROR.CREDENTIALS_WRONG) {
                    // 用户名密码错误，不再重试
                    log('用户名或密码错误，请检查后重试', 'error');
                    return Promise.reject(err);
                } else if (err.type === LOGIN_ERROR.CSRF_ERROR) {
                    // CSRF错误，等待后重试
                    log('CSRF Token错误，等待后重试...', 'warning');
                    await sleep(2000);
                    continue;
                } else {
                    // 其他错误 (网络等)
                    log(`登录出错: ${err.message}，${attempt < maxAttempts ? '重试中...' : '已达最大次数'}`, 'warning');
                    await sleep(1500);
                    continue;
                }
            }
        }

        // 达到最大重试次数
        log(`已尝试 ${maxAttempts} 次，登录失败`, 'error');
        showNotification('IELTS 登录失败', `已尝试 ${maxAttempts} 次，请手动登录`);
        return Promise.reject(lastError || { type: LOGIN_ERROR.UNKNOWN, message: '达到最大重试次数' });
    }

    /**
     * 辅助函数: 延时
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== UI 渲染 ====================
    function renderGUI() {
        const panel = document.createElement('div');
        panel.id = 'ielts-monitor-panel';
        if (state.panelMinimized) panel.classList.add('minimized');

        // 生成城市复选框列表
        let cityCheckboxes = Object.entries(CITY_MAP).map(([code, name]) => {
            const checked = CONFIG.targetCities.includes(code) ? 'checked' : '';
            const selectedClass = CONFIG.targetCities.includes(code) ? 'selected' : '';
            return `<label class="city-checkbox ${selectedClass}">
                <input type="checkbox" name="city" value="${code}" ${checked}>${name}
            </label>`;
        }).join('');

        const isLoginPage = window.location.pathname === '/login';

        panel.innerHTML = `
            <div class="panel-header" id="panel-drag-area">
                <div class="panel-title">
                    <div id="status-dot" class="status-dot ${state.isMonitoring ? 'active' : (state.isLoggedIn ? '' : 'warning')}"></div>
                    <span>IELTS 考位监控</span>
                </div>
                <div class="action-btns">
                    <button id="minimize-btn" title="最小化">━</button>
                </div>
            </div>

            <div class="panel-body">
                <!-- 左侧控制面板 -->
                <div class="left-panel">
                    <!-- 登录状态 -->
                    <div id="login-status" class="login-status ${state.isLoggedIn ? '' : 'logged-out'}">
                        <span class="status-icon">${state.isLoggedIn ? '✅' : '⚠️'}</span>
                        <div class="status-text">
                            <h4>${state.isLoggedIn ? '已登录' : '未登录'}</h4>
                            <p>${state.isLoggedIn ? 'NEEA ID: ' + state.neeaId : '请先登录NEEA账号'}</p>
                        </div>
                    </div>

                    ${isLoginPage ? `
                    <!-- 登录区域 -->
                    <div class="section-title">账号登录</div>
                    <div id="ocr-status" class="ocr-status offline">
                        <span class="ocr-dot"></span> OCR服务检测中...
                    </div>
                    <div class="form-group">
                        <label class="form-label">NEEA ID / 邮箱 / 手机号</label>
                        <input type="text" id="login-userId" class="glass-input" placeholder="请输入账号" value="${CONFIG.savedUserId}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">密码</label>
                        <input type="password" id="login-password" class="glass-input" placeholder="请输入密码">
                    </div>
                    <div id="captcha-area" class="form-group" style="display: none;">
                        <label class="form-label">验证码</label>
                        <div class="row-group">
                            <div class="col">
                                <input type="text" id="login-captcha" class="glass-input" placeholder="验证码" maxlength="4">
                            </div>
                            <div class="col" style="flex: 0 0 auto; display: flex; align-items: center; gap: 6px;">
                                <img id="captcha-img" src="" style="height: 32px; cursor: pointer; border-radius: 4px;" onclick="window.ieltsPro.refreshCaptcha()">
                                <button type="button" class="auto-ocr-btn" onclick="window.ieltsPro.autoOcr()">识别</button>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-label">记住账号</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-remember" ${CONFIG.rememberLogin ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-label">自动识别验证码</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-auto-ocr" ${CONFIG.autoOcr ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <button id="login-btn" class="primary-btn">自动登录</button>
                    <button id="login-btn-manual" class="secondary-btn" style="width: 100%; margin-top: 6px;">手动登录</button>
                    ` : ''}

                    <!-- 监控设置 -->
                    <div class="section-title">监控设置</div>
                    <div class="form-group">
                        <label class="form-label">考试类型</label>
                        <select id="cfg-product" class="glass-input">
                            <option value="IELTSPBT" ${CONFIG.productType === 'IELTSPBT' ? 'selected' : ''}>纸笔考试 (PBT)</option>
                            <option value="IELTSCDI" ${CONFIG.productType === 'IELTSCDI' ? 'selected' : ''}>机考 (CDI)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">目标城市</label>
                        <div class="city-picker" id="city-picker">
                            <div class="city-grid">${cityCheckboxes}</div>
                        </div>
                        <div class="city-actions">
                            <button type="button" class="link-btn" id="select-all-cities">全选</button>
                            <button type="button" class="link-btn" id="select-major-cities">一线城市</button>
                            <button type="button" class="link-btn" id="clear-all-cities">清空</button>
                            <span class="city-count" id="city-count">已选 ${CONFIG.targetCities.length} 个城市</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">查询日期 <button type="button" class="link-btn" id="refresh-dates-btn" style="margin-left: 8px;">刷新可用日期</button></label>
                        <select id="cfg-date-select" class="glass-input">
                            <option value="${CONFIG.queryDate}">${CONFIG.queryDate || '选择日期'}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">指定考点 (可选，逗号分隔)</label>
                        <input type="text" id="cfg-centers" class="glass-input" value="${CONFIG.targetCenters}" placeholder="如: 北大,语言大学">
                    </div>
                    <div class="form-group">
                        <label class="form-label">刷新间隔 (毫秒)</label>
                        <input type="number" id="cfg-interval" class="glass-input" value="${CONFIG.refreshInterval}" min="3000" step="1000">
                    </div>

                    <button id="toggle-btn" class="primary-btn ${state.isMonitoring ? 'btn-running' : ''}">${state.isMonitoring ? '停止监控' : '开始监控'}</button>

                    <!-- 高级设置 -->
                    <div class="section-title">高级设置</div>
                    <div class="toggle-item">
                        <span class="toggle-label">自动报名</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-autobook" ${CONFIG.autoRegister ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-label">声音提醒</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-sound" ${CONFIG.soundAlert ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-label">桌面通知</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-notify" ${CONFIG.desktopNotification ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-label">Bark推送</span>
                        <label class="ios-switch"><input type="checkbox" id="cfg-bark-enabled" ${CONFIG.barkEnabled ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="form-group" style="margin-top: 8px;">
                        <label class="form-label">Bark URL <button type="button" class="link-btn" id="test-bark-btn" style="margin-left: 8px;">测试推送</button></label>
                        <input type="text" id="cfg-bark-url" class="glass-input" value="${CONFIG.barkUrl}" placeholder="https://api.day.app/你的密钥">
                    </div>
                    <div class="form-group" style="margin-top: 8px;">
                        <label class="form-label">打码Token (jfbym)</label>
                        <input type="text" id="cfg-jfbym-token" class="glass-input" value="${CONFIG.jfbymToken}" placeholder="填写jfbym平台的Token">
                    </div>

                    <!-- 发现的考位 -->
                    <div class="section-title">发现的考位</div>
                    <div id="seats-container" class="seats-container">
                        <p style="font-size: 11px; color: var(--text-secondary); text-align: center; padding: 10px;">暂未发现可用考位</p>
                    </div>
                </div>

                <!-- 右侧日志面板 -->
                <div class="right-panel">
                    <div class="log-panel-header">
                        <span>运行日志</span>
                        <button class="clear-btn" onclick="window.ieltsPro.clearLogs()">清空</button>
                    </div>
                    <div id="log-scroll-area" class="log-scroll-area"></div>
                </div>
            </div>


            <div class="stats-bar">
                <div class="stat-item">
                    <div class="stat-value" id="stat-query-count">0</div>
                    <div class="stat-label">查询次数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="stat-seats-count">0</div>
                    <div class="stat-label">发现考位</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="stat-last-time">--</div>
                    <div class="stat-label">最后查询</div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        bindEvents(panel);
        makeDraggable(panel);
        updateUIState();
    }

    function bindEvents(panel) {
        const $ = (sel) => panel.querySelector(sel);

        // 最小化
        $('#minimize-btn').onclick = () => {
            panel.classList.toggle('minimized');
            state.panelMinimized = panel.classList.contains('minimized');
            GM_setValue('panelMinimized', state.panelMinimized);
        };

        // 标签页切换
        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabId = `tab-${btn.dataset.tab}`;
                const tabContent = document.getElementById(tabId);
                if (tabContent) tabContent.classList.add('active');
            };
        });

        // 监控按钮
        $('#toggle-btn').onclick = () => state.isMonitoring ? stopMonitor() : startMonitor();

        $('#cfg-product').onchange = (e) => {
            CONFIG.productType = e.target.value;
            saveConfig();
        };

        // 城市选择器事件
        const updateCitySelection = () => {
            const checkboxes = document.querySelectorAll('#city-picker input[name="city"]');
            CONFIG.targetCities = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            // 更新视觉样式
            checkboxes.forEach(cb => {
                cb.parentElement.classList.toggle('selected', cb.checked);
            });
            // 更新计数
            const countEl = document.getElementById('city-count');
            if (countEl) countEl.textContent = `已选 ${CONFIG.targetCities.length} 个城市`;
            saveConfig();
        };

        // 绑定每个城市复选框
        document.querySelectorAll('#city-picker input[name="city"]').forEach(cb => {
            cb.onchange = updateCitySelection;
        });

        // 全选按钮
        $('#select-all-cities')?.addEventListener('click', () => {
            document.querySelectorAll('#city-picker input[name="city"]').forEach(cb => cb.checked = true);
            updateCitySelection();
        });

        // 一线城市按钮
        const majorCities = ['110100', '310100', '440100', '440300']; // 北京、上海、广州、深圳
        $('#select-major-cities')?.addEventListener('click', () => {
            document.querySelectorAll('#city-picker input[name="city"]').forEach(cb => {
                cb.checked = majorCities.includes(cb.value);
            });
            updateCitySelection();
        });

        // 清空按钮
        $('#clear-all-cities')?.addEventListener('click', () => {
            document.querySelectorAll('#city-picker input[name="city"]').forEach(cb => cb.checked = false);
            updateCitySelection();
        });

        // 查询日期下拉框
        $('#cfg-date-select').onchange = (e) => {
            const date = e.target.value;
            if (date) {
                CONFIG.queryDate = date;
                saveConfig();
            }
        };

        // 刷新可用日期按钮
        $('#refresh-dates-btn')?.addEventListener('click', () => {
            const city = CONFIG.targetCities[0];
            if (city) {
                fetchAvailableDates(city);
            } else {
                log('请先选择城市', 'warning');
            }
        });

        // 考点过滤
        $('#cfg-centers').onchange = (e) => {
            CONFIG.targetCenters = e.target.value.trim();
            saveConfig();
        };

        $('#cfg-interval').onchange = (e) => {
            CONFIG.refreshInterval = Math.max(3000, parseInt(e.target.value) || 5000);
            saveConfig();
            // 如果正在监控，重启定时器
            if (state.isMonitoring) {
                clearInterval(state.intervalId);
                state.intervalId = setInterval(triggerQuery, CONFIG.refreshInterval);
            }
        };

        $('#cfg-autobook')?.addEventListener('change', (e) => {
            CONFIG.autoRegister = e.target.checked;
            saveConfig();
        });

        $('#cfg-sound')?.addEventListener('change', (e) => {
            CONFIG.soundAlert = e.target.checked;
            saveConfig();
        });

        $('#cfg-notify')?.addEventListener('change', (e) => {
            CONFIG.desktopNotification = e.target.checked;
            saveConfig();
        });

        // Bark 设置事件
        $('#cfg-bark-enabled')?.addEventListener('change', (e) => {
            CONFIG.barkEnabled = e.target.checked;
            saveConfig();
        });

        $('#cfg-bark-url')?.addEventListener('change', (e) => {
            CONFIG.barkUrl = e.target.value;
            saveConfig();
        });

        $('#cfg-jfbym-token')?.addEventListener('change', (e) => {
            CONFIG.jfbymToken = e.target.value;
            saveConfig();
        });

        $('#test-bark-btn')?.addEventListener('click', () => {
            testBarkNotification();
        });

        $('#cfg-remember')?.addEventListener('change', (e) => {
            CONFIG.rememberLogin = e.target.checked;
            saveConfig();
        });

        // 登录相关
        const loginBtn = $('#login-btn');
        const loginBtnManual = $('#login-btn-manual');
        const userIdInput = $('#login-userId');

        // 自动登录按钮 (带OCR)
        if (loginBtn) {
            loginBtn.onclick = async () => {
                const userId = $('#login-userId').value;
                const password = $('#login-password').value;

                loginBtn.disabled = true;
                loginBtn.textContent = '登录中...';

                try {
                    await doLoginWithOcr(userId, password);
                } catch (err) {
                    // 如果自动登录失败，提示用户
                    log(`自动登录失败: ${err.message}`, 'error');
                } finally {
                    loginBtn.disabled = false;
                    loginBtn.textContent = '自动登录';
                }
            };
        }

        // 手动登录按钮
        if (loginBtnManual) {
            loginBtnManual.onclick = () => {
                const userId = $('#login-userId').value;
                const password = $('#login-password').value;
                const captcha = $('#login-captcha')?.value;

                loginBtnManual.disabled = true;
                loginBtnManual.textContent = '登录中...';

                // 使用表单提交模式，确保页面正常跳转
                doLogin(userId, password, captcha, true).finally(() => {
                    loginBtnManual.disabled = false;
                    loginBtnManual.textContent = '手动登录';
                });
            };
        }

        // 自动OCR开关
        $('#cfg-auto-ocr')?.addEventListener('change', (e) => {
            CONFIG.autoOcr = e.target.checked;
            saveConfig();
        });

        if (userIdInput) {
            userIdInput.onblur = checkLoginStatus;
        }
    }

    function makeDraggable(el) {
        const handle = el.querySelector('#panel-drag-area');
        let isDown = false, offX, offY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDown = true;
            offX = e.clientX - el.offsetLeft;
            offY = e.clientY - el.offsetTop;
            el.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            el.style.top = `${e.clientY - offY}px`;
            el.style.left = `${e.clientX - offX}px`;
            el.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            el.style.transition = '';
        });
    }

    // ==================== 全局接口 ====================
    window.ieltsPro = {
        start: startMonitor,
        stop: stopMonitor,
        register: (idx) => {
            if (state.foundSeats[idx]) {
                autoRegister(state.foundSeats[idx]);
            }
        },
        clearSeats: () => {
            state.foundSeats = [];
            updateSeatList();
            log('已清空考位列表', 'normal');
        },
        clearLogs: () => {
            // 清空存储
            GM_setValue(LOG_STORAGE_KEY, '[]');
            // 清空UI
            const logArea = document.getElementById('log-scroll-area');
            if (logArea) {
                logArea.innerHTML = '';
            }
            log('日志已清空', 'normal');
        },
        testAlert: () => {
            playAlert();
            showNotification('测试通知', '这是一条测试通知');
            log('测试提醒已触发', 'success');
        },
        refreshCaptcha: refreshCaptcha,
        login: doLogin,
        loginWithOcr: doLoginWithOcr,
        autoOcr: autoRecognizeCaptcha,
        checkOcr: checkOcrServer,
        getState: () => state,
        getConfig: () => CONFIG
    };

    // ==================== 初始化 ====================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 提取关键信息
        extractNeeaId();
        extractCsrfToken();

        // Hook网络请求
        hookNetwork();

        // 渲染UI
        renderGUI();

        // 恢复持久化的日志
        restoreLogsToUI();

        // 检查OCR服务状态 (登录页面时)
        if (window.location.pathname === '/login') {
            checkOcrServer();
        }

        // 自动恢复监控
        if (CONFIG.monitorEnabled && state.isLoggedIn) {
            setTimeout(startMonitor, 2000);
        }

        // 请求通知权限
        if (CONFIG.desktopNotification && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    init();

})();
