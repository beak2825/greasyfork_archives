// ==UserScript==
// @name         KYB的小本本
// @namespace    https://www.lspsp.me/
// @version      1.0
// @description  谁乐透中奖了，通通小本本记下来。
// @author       KYB
// @match        https://www.lspsp.me/lottery*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.1.2/otpauth.umd.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563478/KYB%E7%9A%84%E5%B0%8F%E6%9C%AC%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563478/KYB%E7%9A%84%E5%B0%8F%E6%9C%AC%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 1. 用户配置区 ====================
    const USER_ENCRYPTED_SECRET = "U2FsdGVkX1/McvBg7icrvHv3AkLPkExVpgufM3aan0cQjNfGUAxLiteybrONZYGl";

    const CONFIG = {
        apiEndpoint: "https://www.lspsp.me/api/v1/lottery/result",
        storageKey: "lsp_lottery_stats_db",
        salt: "LSP_Secure_Salt_2026",
        themes: {
            pink: {
                primary: '#d24f70',
                secondary: '#ff7e9d',
                bg: '#fff0f5',
                panelBg: 'rgba(255, 240, 245, 0.98)',
                text: '#5a2a3a',
                textSec: '#8c4a5e',
                border: '#ffb3c8',
                card: '#ffe6ee',
                hover: 'rgba(210, 79, 112, 0.15)',
                shadow: 'rgba(210, 79, 112, 0.2)',
                chartText: '#5a2a3a',
                tooltipBg: '#ffffff',
                tooltipText: '#5a2a3a',
                gradientStart: '#ffd9e4',
                gradientEnd: '#ffe6ee',
                chartGrid: 'rgba(90, 42, 58, 0.1)',
                chartAxis: '#5a2a3a',
                chartBorder: 'rgba(90, 42, 58, 0.2)'
            },
            dark: {
                primary: '#d24f70',
                secondary: '#e55d8a',
                bg: '#121212',
                panelBg: 'rgba(30, 30, 30, 0.97)',
                text: '#f0f0f0',
                textSec: '#bbbbbb',
                border: '#444',
                card: '#2a2a2a',
                hover: 'rgba(210, 79, 112, 0.2)',
                shadow: 'rgba(0, 0, 0, 0.5)',
                chartText: '#f0f0f0',
                tooltipBg: '#333333',
                tooltipText: '#f0f0f0',
                gradientStart: '#2a2a2a',
                gradientEnd: '#1a1a1a',
                chartGrid: 'rgba(255, 255, 255, 0.15)',
                chartAxis: '#e0e0e0',
                chartBorder: 'rgba(255, 255, 255, 0.3)'
            },
            light: {
                primary: '#d24f70',
                secondary: '#c13a62',
                bg: '#ffffff',
                panelBg: 'rgba(255, 255, 255, 0.98)',
                text: '#333333',
                textSec: '#666666',
                border: '#e0e0e0',
                card: '#f8f8f8',
                hover: 'rgba(210, 79, 112, 0.12)',
                shadow: 'rgba(0, 0, 0, 0.1)',
                chartText: '#333333',
                tooltipBg: '#ffffff',
                tooltipText: '#333333',
                gradientStart: '#ffffff',
                gradientEnd: '#f5f5f5',
                chartGrid: 'rgba(51, 51, 51, 0.1)',
                chartAxis: '#333333',
                chartBorder: 'rgba(51, 51, 51, 0.2)'
            }
        },
        colors: {
            gold: '#ffc107',
            silver: '#c0c0c0',
            bronze: '#cd7f32',
            steam: '#36a2eb',
            local: '#ff6384',
            unlucky: '#6c757d',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545'
        }
    };

    // 标签定义
    const TAG_DEFS = {
        '欧皇LSP': '总中奖次数 > 20 次',
        '顶级LSP': '总中奖次数 ≥ 10 次',
        '人上人LSP': '总中奖次数 ≥ 5 次',
        '资本家LSP': '高价值/实体中奖次数 > 激活码次数',
        '酋长我们回家吧': '估算中奖率 < 1.0%',
        '耐心猎人': '平均中奖间隔 > 50 期',
        'TOP': '全站中奖次数排名',
        '前50强': '全站中奖次数排名前 50',
        '尚能饭否': '排名 100-1000 之间',
        '谢谢参与': '排名 1000 以后',
        '未收录/0中奖': '本地数据库中未找到该用户的中奖记录'
    };

    // ==================== 2. 工具与安全模块 ====================
    const Utils = {
        sleep: (ms) => new Promise(r => setTimeout(r, ms)),
        decryptSecret: () => {
            if (!USER_ENCRYPTED_SECRET) return null;
            try {
                const bytes = CryptoJS.AES.decrypt(USER_ENCRYPTED_SECRET, CONFIG.salt);
                return bytes.toString(CryptoJS.enc.Utf8) || null;
            } catch (e) { return null; }
        },
        verifyCode: (token) => {
            const secretStr = Utils.decryptSecret();
            if (!secretStr) { alert("⚠️ 验证失败，未配置密钥。"); return false; }
            const totp = new OTPAuth.TOTP({
                algorithm: "SHA1", digits: 6, period: 30,
                secret: OTPAuth.Secret.fromBase32(secretStr)
            });
            return totp.validate({ token: token, window: 1 }) !== null;
        },
        // 跨域请求封装
        request: (details) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...details,
                    onload: (res) => resolve(res),
                    onerror: (err) => reject(err)
                });
            });
        },
        // 格式化数字
        formatNumber: (num) => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        // 防抖函数
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        // 去除前导零
        removeLeadingZeros: (str) => {
            if (!str) return str;
            // 如果是数字字符串，去除前导零
            if (/^\d+$/.test(str)) {
                return String(parseInt(str, 10));
            }
            // 如果包含"第"和"期"，提取中间的数字
            const match = str.match(/第(\d+)期/);
            if (match) {
                const num = match[1];
                return `第${parseInt(num, 10)}期`;
            }
            return str;
        }
    };

    // ==================== 3. 样式注入 ====================
    // 使用 CSS 变量以支持主题切换
    GM_addStyle(`
        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--lsp-bg);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--lsp-border);
            border-radius: 5px;
            transition: background 0.2s;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--lsp-primary);
        }

        * {
            scrollbar-width: thin;
            scrollbar-color: var(--lsp-border) var(--lsp-bg);
        }

        :root {
            --lsp-primary: ${CONFIG.themes.pink.primary};
            --lsp-secondary: ${CONFIG.themes.pink.secondary};
            --lsp-bg: ${CONFIG.themes.pink.bg};
            --lsp-panel-bg: ${CONFIG.themes.pink.panelBg};
            --lsp-text: ${CONFIG.themes.pink.text};
            --lsp-text-sec: ${CONFIG.themes.pink.textSec};
            --lsp-border: ${CONFIG.themes.pink.border};
            --lsp-card: ${CONFIG.themes.pink.card};
            --lsp-hover: ${CONFIG.themes.pink.hover};
            --lsp-shadow: ${CONFIG.themes.pink.shadow};
            --lsp-chart-text: ${CONFIG.themes.pink.chartText};
            --lsp-tooltip-bg: ${CONFIG.themes.pink.tooltipBg};
            --lsp-tooltip-text: ${CONFIG.themes.pink.tooltipText};
            --lsp-gradient-start: ${CONFIG.themes.pink.gradientStart};
            --lsp-gradient-end: ${CONFIG.themes.pink.gradientEnd};
            --lsp-chart-grid: ${CONFIG.themes.pink.chartGrid};
            --lsp-chart-axis: ${CONFIG.themes.pink.chartAxis};
            --lsp-chart-border: ${CONFIG.themes.pink.chartBorder};
        }

        body.dark-mode {
            --lsp-primary: ${CONFIG.themes.dark.primary};
            --lsp-secondary: ${CONFIG.themes.dark.secondary};
            --lsp-bg: ${CONFIG.themes.dark.bg};
            --lsp-panel-bg: ${CONFIG.themes.dark.panelBg};
            --lsp-text: ${CONFIG.themes.dark.text};
            --lsp-text-sec: ${CONFIG.themes.dark.textSec};
            --lsp-border: ${CONFIG.themes.dark.border};
            --lsp-card: ${CONFIG.themes.dark.card};
            --lsp-hover: ${CONFIG.themes.dark.hover};
            --lsp-shadow: ${CONFIG.themes.dark.shadow};
            --lsp-chart-text: ${CONFIG.themes.dark.chartText};
            --lsp-tooltip-bg: ${CONFIG.themes.dark.tooltipBg};
            --lsp-tooltip-text: ${CONFIG.themes.dark.tooltipText};
            --lsp-gradient-start: ${CONFIG.themes.dark.gradientStart};
            --lsp-gradient-end: ${CONFIG.themes.dark.gradientEnd};
            --lsp-chart-grid: ${CONFIG.themes.dark.chartGrid};
            --lsp-chart-axis: ${CONFIG.themes.dark.chartAxis};
            --lsp-chart-border: ${CONFIG.themes.dark.chartBorder};
        }

        body.light-mode {
            --lsp-primary: ${CONFIG.themes.light.primary};
            --lsp-secondary: ${CONFIG.themes.light.secondary};
            --lsp-bg: ${CONFIG.themes.light.bg};
            --lsp-panel-bg: ${CONFIG.themes.light.panelBg};
            --lsp-text: ${CONFIG.themes.light.text};
            --lsp-text-sec: ${CONFIG.themes.light.textSec};
            --lsp-border: ${CONFIG.themes.light.border};
            --lsp-card: ${CONFIG.themes.light.card};
            --lsp-hover: ${CONFIG.themes.light.hover};
            --lsp-shadow: ${CONFIG.themes.light.shadow};
            --lsp-chart-text: ${CONFIG.themes.light.chartText};
            --lsp-tooltip-bg: ${CONFIG.themes.light.tooltipBg};
            --lsp-tooltip-text: ${CONFIG.themes.light.tooltipText};
            --lsp-gradient-start: ${CONFIG.themes.light.gradientStart};
            --lsp-gradient-end: ${CONFIG.themes.light.gradientEnd};
            --lsp-chart-grid: ${CONFIG.themes.light.chartGrid};
            --lsp-chart-axis: ${CONFIG.themes.light.chartAxis};
            --lsp-chart-border: ${CONFIG.themes.light.chartBorder};
        }

        #lsp-nav-item a {
            color: var(--lsp-primary) !important;
            font-weight: bold;
            display: flex;
            align-items: center;
            padding: 0 5px !important;
            min-width: auto !important;
            transition: all 0.2s;
        }

        #lsp-nav-item a:hover {
            color: var(--lsp-secondary) !important;
            transform: scale(1.1);
        }

        #lsp-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--lsp-panel-bg);
            z-index: 9999;
            display: none;
            flex-direction: column;
            color: var(--lsp-text);
            font-family: 'Segoe UI', 'Microsoft YaHei', Tahoma, sans-serif;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        }

        .lsp-header {
            padding: 10px 30px;
            background: linear-gradient(135deg, var(--lsp-gradient-start), var(--lsp-gradient-end));
            border-bottom: 1px solid var(--lsp-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            min-height: 55px;
            box-shadow: 0 2px 15px var(--lsp-shadow);
        }

        .lsp-title {
            font-size: 1.3em;
            color: var(--lsp-primary);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .lsp-title span {
            font-size: 1.5em;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: nowrap;
        }

        .action-group {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-right: 12px;
            border-right: 1px solid var(--lsp-border);
        }

        .lsp-btn {
            background: var(--lsp-card);
            border: 1px solid var(--lsp-border);
            color: var(--lsp-text);
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.85em;
            min-height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
        }

        .lsp-btn:hover {
            background: var(--lsp-hover);
            border-color: var(--lsp-primary);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px var(--lsp-shadow);
        }

        .lsp-btn-icon {
            padding: 6px 10px;
            font-size: 0.9em;
            min-width: 32px;
        }

        .lsp-btn-primary {
            border-color: var(--lsp-primary);
            color: var(--lsp-primary);
        }

        .lsp-btn-danger {
            border-color: ${CONFIG.colors.danger};
            color: ${CONFIG.colors.danger};
        }

        .lsp-btn-lg {
            padding: 14px 28px;
            font-size: 1.1em;
            border-width: 2px;
            border-radius: 8px;
            margin: 12px;
            transition: all 0.2s;
            font-weight: 600;
            background: var(--lsp-card);
            border-color: var(--lsp-border);
            color: var(--lsp-text);
        }

        .lsp-btn-lg:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px var(--lsp-shadow);
        }

        .lsp-content {
            padding: 30px;
            max-width: 1600px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

        .lsp-auth-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 70vh;
            background: var(--lsp-card);
            border-radius: 16px;
            border: 1px solid var(--lsp-border);
            padding: 50px 40px;
            box-shadow: 0 8px 25px var(--lsp-shadow);
            margin: 40px auto;
            max-width: 800px;
        }

        .lsp-auth-box h2 {
            color: var(--lsp-primary);
            margin: 30px 0 40px 0;
            font-size: 1.8em;
            text-align: center;
            line-height: 1.4;
        }

        .lsp-input {
            background: var(--lsp-bg);
            border: 2px solid var(--lsp-border);
            color: var(--lsp-text);
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 1.1em;
            text-align: center;
            width: 220px;
            margin-left: 10px;
            transition: all 0.2s;
        }

        .lsp-input:focus {
            outline: none;
            border-color: var(--lsp-primary);
            box-shadow: 0 0 0 3px rgba(210, 79, 112, 0.2);
        }

        .lsp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .lsp-card {
            background: var(--lsp-card);
            border-radius: 12px;
            padding: 25px;
            border: 1px solid var(--lsp-border);
            box-shadow: 0 4px 15px var(--lsp-shadow);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .lsp-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px var(--lsp-shadow);
        }

        .lsp-card h3 {
            margin-top: 0;
            color: var(--lsp-text);
            border-left: 4px solid var(--lsp-primary);
            padding-left: 12px;
            margin-bottom: 20px;
            font-size: 1.2em;
            font-weight: 600;
        }

        .lsp-table-wrap {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--lsp-border);
            box-shadow: 0 2px 8px var(--lsp-shadow);
        }

        table.lsp-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 700px;
        }

        table.lsp-table th {
            background: linear-gradient(to bottom, var(--lsp-gradient-start), var(--lsp-gradient-end));
            color: var(--lsp-primary);
            padding: 14px 16px;
            text-align: center;
            position: sticky;
            top: 0;
            border-bottom: 2px solid var(--lsp-border);
            font-size: 0.95em;
            font-weight: 600;
            z-index: 10;
            letter-spacing: 0.5px;
        }

        table.lsp-table td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--lsp-border);
            color: var(--lsp-text);
            font-size: 0.9em;
            text-align: center;
            vertical-align: middle;
        }

        table.lsp-table tr {
            position: relative;
            transition: background-color 0.2s;
        }

        table.lsp-table tr:hover {
            background: var(--lsp-hover);
        }

        .lsp-tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            margin-right: 6px;
            margin-bottom: 4px;
            border: 1px solid transparent;
            cursor: help;
            line-height: 1.2;
            font-weight: 500;
            transition: all 0.2s;
            color: var(--lsp-text);
        }

        .lsp-tag:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .tag-god {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.25));
            border-color: ${CONFIG.colors.gold};
            color: ${CONFIG.colors.gold} !important;
        }

        .tag-sad {
            background: linear-gradient(135deg, rgba(108, 117, 125, 0.1), rgba(108, 117, 125, 0.2));
            border-color: ${CONFIG.colors.unlucky};
            color: ${CONFIG.colors.unlucky} !important;
        }

        .tag-rich {
            background: linear-gradient(135deg, rgba(210, 79, 112, 0.15), rgba(210, 79, 112, 0.25));
            border-color: var(--lsp-primary);
            color: var(--lsp-primary) !important;
        }

        .tag-npc {
            background: linear-gradient(135deg, rgba(160, 160, 160, 0.08), rgba(160, 160, 160, 0.12));
            border: 1px dashed var(--lsp-text-sec);
            color: var(--lsp-text-sec) !important;
        }

        #lsp-search {
            width: 100%;
            padding: 14px 20px;
            background: var(--lsp-bg);
            border: 2px solid var(--lsp-border);
            color: var(--lsp-text);
            font-size: 1.05em;
            border-radius: 8px;
            margin-bottom: 20px;
            box-sizing: border-box;
            transition: all 0.2s;
        }

        #lsp-search:focus {
            outline: none;
            border-color: var(--lsp-primary);
            box-shadow: 0 0 0 3px rgba(210, 79, 112, 0.2);
        }

        .progress-container {
            width: 100%;
            background: var(--lsp-bg);
            height: 10px;
            border-radius: 5px;
            margin-top: 15px;
            overflow: hidden;
            border: 1px solid var(--lsp-border);
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--lsp-primary), var(--lsp-secondary));
            width: 0%;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Tooltip & Modal */
        #lsp-tooltip {
            position: fixed;
            background: var(--lsp-tooltip-bg);
            color: var(--lsp-tooltip-text);
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 0.9em;
            pointer-events: none;
            z-index: 10002; /* 高于模态框的10001避免被覆盖 */
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            animation: fadeIn 0.15s;
            border: 1px solid var(--lsp-border);
            max-width: 300px;
            backdrop-filter: blur(5px);
        }

        #lsp-tooltip::after {
            content:'';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: var(--lsp-tooltip-bg) transparent transparent transparent;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #lsp-modal-overlay {
            position: fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background: rgba(0,0,0,0.75);
            z-index: 10001;
            display:flex;
            justify-content:center;
            align-items:center;
            backdrop-filter: blur(8px);
            animation: fadeIn 0.2s;
        }

        #lsp-modal {
            background: var(--lsp-card);
            width: 92%;
            max-width: 1100px;
            max-height: 90vh;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            overflow: hidden;
            border: 1px solid var(--lsp-border);
            animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-head {
            padding: 18px 24px;
            background: linear-gradient(135deg, var(--lsp-gradient-start), var(--lsp-gradient-end));
            border-bottom: 1px solid var(--lsp-border);
            display:flex;
            justify-content:space-between;
            align-items:center;
        }

        .modal-body {
            padding: 24px;
            overflow-y: auto;
            color: var(--lsp-text);
        }

        .modal-close {
            font-size: 1.5em;
            cursor: pointer;
            color: var(--lsp-text-sec);
            padding: 5px 10px;
            transition: all 0.2s;
            border-radius: 4px;
        }

        .modal-close:hover {
            color: var(--lsp-primary);
            background: var(--lsp-hover);
            transform: rotate(90deg);
        }

        .stat-badge {
            display:inline-block;
            padding: 12px 20px;
            background: var(--lsp-card);
            border-radius: 10px;
            border: 1px solid var(--lsp-border);
            text-align:center;
            min-width: 90px;
            box-shadow: 0 3px 10px var(--lsp-shadow);
            transition: transform 0.2s;
        }

        .stat-badge:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px var(--lsp-shadow);
        }

        .stat-val {
            font-size: 1.6em;
            font-weight: 700;
            display:block;
            color: var(--lsp-primary);
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 0.8em;
            color: var(--lsp-text-sec);
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .section-title {
            font-size: 1.2em;
            color: var(--lsp-primary);
            margin: 20px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--lsp-border);
            font-weight: 600;
            position: relative;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 60px;
            height: 2px;
            background: var(--lsp-primary);
        }

        .chart-container {
            position: relative;
            height: 320px;
            width: 100%;
        }

        .modal-chart-container {
            position: relative;
            height: 280px;
            width: 100%;
        }

        .user-history-table {
            max-height: 350px;
            overflow-y: auto;
            border: 1px solid var(--lsp-border);
            border-radius: 10px;
            box-shadow: 0 3px 12px var(--lsp-shadow);
            /* 隐藏滚动条但仍然可以滚动 */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
        }

        .user-history-table::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }

        .user-history-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .user-history-table th {
            position: sticky;
            top: 0;
            background: linear-gradient(to bottom, var(--lsp-gradient-start), var(--lsp-gradient-end));
            z-index: 20;
            border-bottom: 2px solid var(--lsp-border);
            font-weight: 600;
            color: var(--lsp-primary);
            text-align: center;
            padding: 14px 16px;
            font-size: 0.95em;
        }

        .user-history-table td {
            padding: 12px 16px;
            text-align: center;
            border-bottom: 1px solid var(--lsp-border);
            color: var(--lsp-text);
            font-size: 0.9em;
            vertical-align: middle;
        }

        .user-history-table tr {
            transition: background-color 0.2s;
        }

        .user-history-table tr:hover {
            background: var(--lsp-hover);
            cursor: pointer;
        }

        .search-result-card {
            flex: 1;
            text-align: center;
            min-width: 320px;
        }

        .search-result-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            background: var(--lsp-card);
            padding: 20px;
            border-radius: 10px;
            margin-top: 15px;
            border: 1px solid var(--lsp-border);
        }

        .search-result-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-radius: 8px;
            background: var(--lsp-bg);
            border: 1px solid var(--lsp-border);
            transition: all 0.2s;
        }

        .search-result-stat:hover {
            background: var(--lsp-hover);
            transform: translateY(-2px);
        }

        .user-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
        }

        .history-row-tooltip {
            position: absolute;
            background: var(--lsp-tooltip-bg);
            color: var(--lsp-tooltip-text);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.85em;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 1px solid var(--lsp-border);
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
        }

        .ranking-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 600;
            margin-left: 5px;
        }

        .ranking-1 { background: ${CONFIG.colors.gold}; color: #000; }
        .ranking-2 { background: ${CONFIG.colors.silver}; color: #000; }
        .ranking-3 { background: ${CONFIG.colors.bronze}; color: #fff; }

        .chart-tooltip {
            background: var(--lsp-tooltip-bg) !important;
            border: 1px solid var(--lsp-border) !important;
            color: var(--lsp-tooltip-text) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
            border-radius: 6px !important;
            padding: 12px !important;
            backdrop-filter: blur(5px);
        }

        .chart-tooltip .tooltip-header {
            color: var(--lsp-primary) !important;
            font-weight: 600 !important;
            margin-bottom: 5px !important;
            border-bottom: 1px solid var(--lsp-border) !important;
            padding-bottom: 5px !important;
        }

        .chart-tooltip .tooltip-body {
            color: var(--lsp-tooltip-text) !important;
        }

        .chart-tooltip .tooltip-body span {
            color: var(--lsp-tooltip-text) !important;
        }

        .lottery-link {
            color: var(--lsp-text);
            text-decoration: none;
            transition: all 0.2s;
            display: block;
            padding: 8px;
            border-radius: 4px;
        }

        .lottery-link:hover {
            color: var(--lsp-primary);
            background: var(--lsp-hover);
            text-decoration: underline;
        }

        .user-info-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 15px;
            background: var(--lsp-card);
            border-radius: 8px;
            border: 1px solid var(--lsp-border);
        }

        .user-info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }

        .user-info-label {
            font-size: 0.85em;
            color: var(--lsp-text-sec);
            margin-bottom: 5px;
        }

        .user-info-value {
            font-size: 1.2em;
            font-weight: 600;
            color: var(--lsp-text);
        }

        .user-info-value.highlight {
            color: var(--lsp-primary);
        }

        .theme-selector {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-left: 10px;
        }

        .theme-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid var(--lsp-border);
            cursor: pointer;
            transition: all 0.2s;
        }

        .theme-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 5px var(--lsp-primary);
        }

        .theme-btn.active {
            border-color: var(--lsp-primary);
            box-shadow: 0 0 0 2px var(--lsp-primary);
        }

        .theme-pink {
            background: linear-gradient(135deg, #ffd9e4, #ffe6ee);
        }

        .theme-dark {
            background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
        }

        .theme-light {
            background: linear-gradient(135deg, #ffffff, #f5f5f5);
        }
    `);

    // ==================== 4. 数据管理 ====================
    class DataManager {
        constructor() {
            this.db = this.loadDB();
        }

        loadDB() {
            try {
                const data = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {
                    lotteries: {},
                    meta: {
                        lastUpdated: 0,
                        version: "v10",
                        lastMaxId: 0
                    }
                };
                return data;
            }
            catch (e) {
                console.error("加载数据库失败:", e);
                return { lotteries: {}, meta: { lastUpdated: 0, version: "v10", lastMaxId: 0 } };
            }
        }

        saveDB() {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.db));
        }

        scanAndGetMissing() {
            const nodes = document.querySelectorAll('.widget.lottery');
            const missingIds = [];
            let currentMaxId = this.db.meta.lastMaxId || 0;

            nodes.forEach(node => {
                const data = node.dataset;
                const id = parseInt(data.lotteryId);
                if (isNaN(id)) return;

                if (id > currentMaxId) {
                    currentMaxId = id;
                }

                // 只处理ID大于上次最大ID的数据（增量更新）
                if (id <= this.db.meta.lastMaxId) {
                    return;
                }

                let realIssue = data.lotteryId;
                const stateText = node.querySelector('.state')?.innerText || '';
                const issueMatch = stateText.match(/第(\d+)期/);
                if (issueMatch) realIssue = issueMatch[1];

                const title = node.querySelector('.description .title')?.innerText.trim() || '未知标题';
                let quota = '未知', date = '未知';
                node.querySelectorAll('.description .info li').forEach(li => {
                    const txt = li.innerText;
                    if (txt.includes('名额')) quota = txt.split(':')[1]?.trim() || quota;
                    if (txt.includes('日期')) date = txt.split(':')[1]?.trim() || date;
                });

                const meta = {
                    id: id,
                    issue: realIssue,
                    title: title,
                    quota: quota,
                    date: date,
                    isInstant: data.isInstant === '1',
                    state: data.lotteryState,
                    platform: data.platform
                };

                if (!this.db.lotteries[id]) {
                    this.db.lotteries[id] = { winners: [] };
                }

                this.db.lotteries[id] = {
                    ...this.db.lotteries[id],
                    ...meta,
                    winners: this.db.lotteries[id].winners || []
                };

                if (meta.state === 'ended' && !meta.isInstant) {
                    const localWinners = this.db.lotteries[id].winners;
                    if (!localWinners || localWinners.length === 0) {
                        missingIds.push(id);
                    }
                }
            });

            this.saveDB();

            return { missingIds, currentMaxId };
        }

        importData(json) {
            try {
                const data = typeof json === 'string' ? JSON.parse(json) : json;
                if (data.lotteries) {
                    let maxId = this.db.meta.lastMaxId || 0;
                    Object.keys(data.lotteries).forEach(id => {
                        const numId = parseInt(id);
                        if (data.lotteries[id] && data.lotteries[id].winners) {
                            this.db.lotteries[id] = data.lotteries[id];
                            if (numId > maxId) {
                                maxId = numId;
                            }
                        }
                    });

                    if (maxId > this.db.meta.lastMaxId) {
                        this.db.meta.lastMaxId = maxId;
                    }

                    this.saveDB();
                    return true;
                }
            } catch (e) {
                console.error("导入数据失败:", e);
                alert("导入失败: " + e.message);
            }
            return false;
        }
    }

    // ==================== 5. 统计引擎 ====================
    class StatsEngine {
        constructor(db) {
            this.db = db;
            this.users = {};
            this.sortedUsers = [];
        }

        run() {
            const validLotteries = Object.values(this.db.lotteries)
                .filter(l => l.state === 'ended' && !l.isInstant && l.winners && l.winners.length > 0)
                .sort((a, b) => (parseInt(a.issue) || 0) - (parseInt(b.issue) || 0));

            const totalIssues = validLotteries.length;

            validLotteries.forEach((lottery, idx) => {
                lottery.winners.forEach(uid => {
                    if (!this.users[uid]) {
                        this.users[uid] = {
                            uid: uid,
                            total: 0,
                            local: 0,
                            steam: 0,
                            wins: [],
                            tags: [],
                            firstWinIndex: -1,
                            lastWinIndex: -1,
                            lastWinIssue: '',
                            intervals: [],
                            avgInterval: 0,
                            rate: 0
                        };
                    }
                    this.users[uid].total++;
                    if (lottery.platform === 'steam') this.users[uid].steam++;
                    else this.users[uid].local++;

                    this.users[uid].wins.push({
                        issue: lottery.issue,
                        id: lottery.id,
                        title: lottery.title || '历史数据无标题',
                        quota: lottery.quota || '-',
                        date: lottery.date || '-',
                        platform: lottery.platform,
                        index: idx
                    });
                });
            });

            this.sortedUsers = Object.values(this.users).map(u => {
                // 按中奖时间排序
                u.wins.sort((a, b) => a.index - b.index);

                // 记录首次和最后中奖索引
                u.firstWinIndex = u.wins[0].index;
                u.lastWinIndex = u.wins[u.wins.length - 1].index;
                u.lastWinIssue = u.wins[u.wins.length - 1].issue;

                // 计算中奖间隔
                const intervals = [];
                for (let i = 1; i < u.wins.length; i++) {
                    intervals.push(u.wins[i].index - u.wins[i - 1].index - 1);
                }
                u.intervals = intervals;

                // 计算平均间隔
                u.avgInterval = intervals.length ?
                    (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(1) :
                    '0';

                // 计算中奖率：假设从第一次中奖到最后一次中奖之间的所有乐透都参与了
                // 总参与期数 = 最后中奖索引 - 第一次中奖索引 + 1
                const participationSpan = u.lastWinIndex - u.firstWinIndex + 1;
                u.rate = participationSpan > 0 ?
                    ((u.total / participationSpan) * 100).toFixed(2) :
                    '100.00';

                this.assignTags(u);
                return u;
            }).sort((a, b) => b.total - a.total);

            return this.sortedUsers;
        }

        assignTags(u) {
            const r = parseFloat(u.rate);
            if (u.local > u.steam) u.tags.push({ t: '资本家LSP', c: 'tag-rich' });
            if (u.total > 20) u.tags.push({ t: '欧皇LSP', c: 'tag-god' });
            else if (u.total >= 10) u.tags.push({ t: '顶级LSP', c: 'tag-rich' });
            else if (u.total >= 5) u.tags.push({ t: '人上人LSP', c: 'tag-rich' });

            if (r < 1.0) u.tags.push({ t: '酋长我们回家吧', c: 'tag-sad' });
            else if (u.avgInterval !== '0' && parseFloat(u.avgInterval) > 50) u.tags.push({ t: '耐心猎人', c: 'tag-npc' });
        }

        getUser(uid) {
            return this.users[uid] || null;
        }

        getUnluckyUsers() {
            const usersWithWins = this.sortedUsers.filter(u => u.total > 0);
            return [...usersWithWins].reverse();
        }

        // 获取欧皇天梯数据（按中奖次数分组，取前10组）
        getLuckyLeaderboard() {
            const groups = {};
            this.sortedUsers.forEach(u => {
                if (!groups[u.total]) groups[u.total] = [];
                groups[u.total].push(u.uid);
            });

            const sortedGroups = Object.keys(groups)
                .map(count => ({
                    count: parseInt(count),
                    uids: groups[count],
                    totalUsers: groups[count].length
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            return sortedGroups;
        }

        // 获取非酋天梯数据（按中奖次数分组，取后10组）
        getUnluckyLeaderboard() {
            const usersWithWins = this.sortedUsers.filter(u => u.total > 0);
            const groups = {};
            usersWithWins.forEach(u => {
                if (!groups[u.total]) groups[u.total] = [];
                groups[u.total].push(u.uid);
            });

            const sortedGroups = Object.keys(groups)
                .map(count => ({
                    count: parseInt(count),
                    uids: groups[count],
                    totalUsers: groups[count].length
                }))
                .sort((a, b) => a.count - b.count)
                .slice(0, 10);

            return sortedGroups;
        }
    }

    // ==================== 6. UI 控制 ====================
    class UIManager {
        constructor() {
            this.dataMgr = new DataManager();
            // 默认主题为粉色系，检查本地存储
            const savedTheme = localStorage.getItem('lsp_theme');
            this.currentTheme = savedTheme || 'pink';
            // 初始化图表实例存储
            this.charts = {
                lucky: null,
                unlucky: null,
                userDetail: []
            };
            this.applyTheme();
            this.initNav();
            this.createPanel();
            this.hoverTimer = null;
            this.historyTooltipTimer = null;
            this.searchDebounceTimer = null; // 搜索防抖
        }

        applyTheme() {
            // 移除所有主题类
            document.body.classList.remove('pink-mode', 'dark-mode', 'light-mode');

            // 根据当前主题添加对应的类
            if (this.currentTheme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (this.currentTheme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                // 默认粉色主题，不添加特殊类，使用:root默认值
                document.body.classList.remove('dark-mode', 'light-mode');
            }

            // 保存主题选择
            localStorage.setItem('lsp_theme', this.currentTheme);

            // 更新所有图表的颜色（如果有图表实例）
            this.updateChartsTheme();
        }

        // 更新所有图表主题
        updateChartsTheme() {
            const theme = CONFIG.themes[this.currentTheme];

            // 更新欧皇天梯图表
            if (this.charts.lucky && this.charts.lucky._active && !this.charts.lucky._destroyed) {
                this.applyChartTheme(this.charts.lucky, theme);
            }

            // 更新非酋天梯图表
            if (this.charts.unlucky && this.charts.unlucky._active && !this.charts.unlucky._destroyed) {
                this.applyChartTheme(this.charts.unlucky, theme);
            }

            // 更新用户详情图表
            if (this.charts.userDetail && this.charts.userDetail.length > 0) {
                // 过滤掉已销毁的图表
                this.charts.userDetail = this.charts.userDetail.filter(chart =>
                    chart && chart._active && !chart._destroyed
                );

                this.charts.userDetail.forEach(chart => {
                    if (chart && chart._active && !chart._destroyed) {
                        this.applyChartTheme(chart, theme);
                    }
                });
            }
        }

        // 应用主题到单个图表
        applyChartTheme(chart, theme) {
            if (!chart || !chart._active || chart._destroyed) return;

            try {
                // 更新X轴和Y轴的网格线、刻度和边框颜色
                if (chart.options && chart.options.scales) {
                    if (chart.options.scales.x) {
                        if (chart.options.scales.x.grid) {
                            chart.options.scales.x.grid.color = theme.chartGrid;
                        }
                        if (chart.options.scales.x.ticks) {
                            chart.options.scales.x.ticks.color = theme.chartAxis;
                        }
                        if (chart.options.scales.x.border) {
                            chart.options.scales.x.border.color = theme.chartBorder;
                        }
                    }

                    if (chart.options.scales.y) {
                        if (chart.options.scales.y.grid) {
                            chart.options.scales.y.grid.color = theme.chartGrid;
                        }
                        if (chart.options.scales.y.ticks) {
                            chart.options.scales.y.ticks.color = theme.chartAxis;
                        }
                        if (chart.options.scales.y.border) {
                            chart.options.scales.y.border.color = theme.chartBorder;
                        }
                    }
                }

                // 更新图例颜色
                if (chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                    chart.options.plugins.legend.labels.color = theme.chartText;
                }

                // 更新工具提示颜色
                if (chart.options && chart.options.plugins && chart.options.plugins.tooltip) {
                    chart.options.plugins.tooltip.backgroundColor = theme.tooltipBg;
                    chart.options.plugins.tooltip.bodyColor = theme.tooltipText;
                    chart.options.plugins.tooltip.borderColor = theme.border;
                }

                // 强制更新图表
                chart.update();
            } catch (e) {
                console.warn("更新图表主题失败:", e);
            }
        }

        setTheme(theme) {
            this.currentTheme = theme;
            this.applyTheme();
        }

        initNav() {
            const navUl = document.querySelector('#nav ul');
            if (!navUl) return;
            const li = document.createElement('li');
            li.id = 'lsp-nav-item';
            li.innerHTML = `<a href="javascript:void(0)" title="KYB的小本本">📒</a>`;
            const hotLi = navUl.querySelector('li.hot');
            if (hotLi && hotLi.nextSibling) navUl.insertBefore(li, hotLi.nextSibling);
            else navUl.appendChild(li);

            li.onclick = () => {
                document.getElementById('lsp-panel').style.display = 'flex';
                this.renderHome();
            };
        }

        createPanel() {
            const div = document.createElement('div');
            div.id = 'lsp-panel';
            div.innerHTML = `
                <div class="lsp-header">
                    <div class="lsp-title"><span>📓</span> 老山炮死亡笔记</div>
                    <div class="header-actions">
                        <div class="action-group">
                            <div class="theme-selector">
                                <div class="theme-btn theme-pink ${this.currentTheme === 'pink' ? 'active' : ''}" title="粉色主题" data-theme="pink"></div>
                                <div class="theme-btn theme-dark ${this.currentTheme === 'dark' ? 'active' : ''}" title="暗色主题" data-theme="dark"></div>
                                <div class="theme-btn theme-light ${this.currentTheme === 'light' ? 'active' : ''}" title="亮色主题" data-theme="light"></div>
                            </div>
                            <button class="lsp-btn" id="btn-export" title="导出数据">⥯</button>
                            <button class="lsp-btn lsp-btn-danger" id="btn-reset" title="删除所有数据">del</button>
                        </div>
                        <button class="lsp-btn lsp-btn-primary" onclick="document.getElementById('lsp-panel').style.display='none'">关闭</button>
                    </div>
                </div>
                <div class="lsp-content" id="lsp-view-area"></div>
            `;
            document.body.appendChild(div);

            // 主题切换按钮事件
            const themeButtons = div.querySelectorAll('.theme-btn');
            themeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    this.setTheme(theme);

                    // 更新激活状态
                    themeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            document.getElementById('btn-export').onclick = () => {
                const blob = new Blob([JSON.stringify(this.dataMgr.db)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `lsp_data_pro_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
            };

            document.getElementById('btn-reset').onclick = () => {
                if (confirm('⚠️ 确定删除所有数据吗？这将丢失所有历史记录！')) {
                    localStorage.removeItem(CONFIG.storageKey);
                    location.reload();
                }
            };
        }

        // --- 首页与导入 ---
        renderHome() {
            const area = document.getElementById('lsp-view-area');
            area.innerHTML = `
                <div class="lsp-auth-box">
                    <h2>📈 暗杀名单数据导入</h2>
                    <p style="color:var(--lsp-text-sec);margin-bottom:40px;text-align:center;max-width:600px;">
                        混账！你中了甚么！纳命来！
                    </p>
                    <div style="display:flex; gap:20px; align-items:center; flex-wrap: wrap; justify-content: center; margin-bottom:40px;">
                        <button class="lsp-btn lsp-btn-lg" id="act-import-link" style="background:linear-gradient(135deg, ${CONFIG.colors.steam}, #2a8fbd);color:white;">🔗 链接导入</button>
                        <button class="lsp-btn lsp-btn-lg" id="act-import-file" style="background:linear-gradient(135deg, ${CONFIG.colors.local}, #e55376);color:white;">📂 文件导入</button>
                        <button class="lsp-btn lsp-btn-lg" id="act-import-clip" style="background:linear-gradient(135deg, ${CONFIG.colors.gold}, #e6b400);color:#333;">📋 剪贴板导入</button>
                    </div>
                    <div style="width:100%; height:1px; background:linear-gradient(to right, transparent, var(--lsp-border), transparent); margin:40px 0;"></div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
                        <h3 style="color:var(--lsp-text-sec);margin-bottom:10px;">在线导入/更新</h3>
                        <div style="display:flex; align-items:center; flex-wrap: wrap; justify-content: center; gap:15px;">
                            <button class="lsp-btn lsp-btn-lg" id="act-fetch" style="background:linear-gradient(135deg, var(--lsp-primary), var(--lsp-secondary));color:white;padding:15px 35px;">☁️ 开始(增量)</button>
                            <input type="text" id="totp-code" class="lsp-input" placeholder="输入6位验证码" maxlength="6">
                        </div>
                        <p style="color:var(--lsp-text-sec);font-size:0.9em;text-align:center;max-width:500px;">
                            该功能需要验证，请输入验证码后使用，仅拉取本地未收录的最新数据
                        </p>
                    </div>
                </div>
            `;

            document.getElementById('act-import-file').onclick = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = e => {
                    const r = new FileReader();
                    r.onload = ev => {
                        if (this.dataMgr.importData(ev.target.result)) this.renderDashboard();
                    };
                    r.readAsText(e.target.files[0]);
                };
                input.click();
            };

            document.getElementById('act-import-clip').onclick = async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (this.dataMgr.importData(text)) this.renderDashboard();
                    else alert('剪贴板内容格式错误');
                } catch (e) { alert('无法访问剪贴板'); }
            };

            document.getElementById('act-import-link').onclick = () => this.handleLinkImport();
            document.getElementById('act-fetch').onclick = () => this.startFetch();
        }

        // --- 链接导入逻辑 ---
        async handleLinkImport() {
            const url = prompt("请输入json文件分享链接：");
            if (!url) return;

            if (!url.includes('myurl.7li7li.com')) {
                alert("❌ 输入的链接格式不匹配，不在许可的域名内");
                return;
            }

            const area = document.getElementById('lsp-view-area');
            area.innerHTML = `<div class="lsp-auth-box"><h3>🔗 正在解析云端数据...</h3><div style="color:var(--lsp-text-sec)">Step 1/3: 解析短链...</div><div class="progress-container"><div class="progress-bar" id="p-bar"></div></div></div>`;

            try {
                const res1 = await Utils.request({ method: 'GET', url: url });

                let jsonData = null;
                try { jsonData = JSON.parse(res1.responseText); } catch(e) {}

                if (!jsonData || !Array.isArray(jsonData) || !jsonData[0].kodo_key) {
                    throw new Error("无法解析响应元数据");
                }

                const kodoKey = jsonData[0].kodo_key;

                document.getElementById('p-bar').style.width = '33%';
                area.innerHTML = `<div class="lsp-auth-box"><h3>🔗 正在解析云端数据...</h3><div style="color:var(--lsp-text-sec)">Step 2/3: 获取下载地址...</div><div class="progress-container"><div class="progress-bar" id="p-bar"></div></div></div>`;
                const infoUrl = `https://service.easylink.cc/kodo/object/${kodoKey}`;

                const res2 = await Utils.request({ method: 'GET', url: infoUrl });
                const json2 = JSON.parse(res2.responseText);

                if (!json2.download_url) throw new Error("未找到下载地址");

                document.getElementById('p-bar').style.width = '66%';
                area.innerHTML = `<div class="lsp-auth-box"><h3>🔗 正在解析云端数据...</h3><div style="color:var(--lsp-text-sec)">Step 3/3: 下载中...</div><div class="progress-container"><div class="progress-bar" id="p-bar"></div></div></div>`;
                const res3 = await Utils.request({ method: 'GET', url: json2.download_url });

                if (this.dataMgr.importData(res3.responseText)) {
                    document.getElementById('p-bar').style.width = '100%';
                    setTimeout(() => this.renderDashboard(), 500);
                } else {
                    alert("❌ 导入失败：JSON 数据格式不正确");
                    this.renderHome();
                }

            } catch (e) {
                console.error(e);
                alert(`❌ 导入出错: ${e.message || "网络请求失败"}`);
                this.renderHome();
            }
        }

        // --- 数据抓取 (增量更新) ---
        async startFetch() {
            const code = document.getElementById('totp-code').value;
            if (!Utils.verifyCode(code)) {
                alert("❌ TOTP验证失败");
                return;
            }

            const area = document.getElementById('lsp-view-area');
            area.innerHTML = `<div class="lsp-auth-box"><h3>🔄 数据同步中...</h3><div class="progress-container"><div class="progress-bar" id="p-bar"></div></div><div id="p-text" style="margin-top:15px;color:var(--lsp-text-sec);">准备中...</div></div>`;

            const { missingIds, currentMaxId } = this.dataMgr.scanAndGetMissing();
            const total = missingIds.length;

            if (total === 0) {
                document.getElementById('p-bar').style.width = '100%';
                document.getElementById('p-text').innerText = '本地数据已是最新！';
                setTimeout(() => this.renderDashboard(), 500);
                return;
            }

            const fetcher = async (lotteryId) => {
                const params = new URLSearchParams();
                params.append('lotteryid', lotteryId);
                try {
                    const response = await fetch(CONFIG.apiEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params
                    });
                    return await response.json();
                } catch (e) { console.error(e); return null; }
            };

            for (let i = 0; i < total; i++) {
                const id = missingIds[i];
                const meta = this.dataMgr.db.lotteries[id];
                document.getElementById('p-text').innerText = `获取: [${meta.issue}] ${meta.title.slice(0,20)}... (${i + 1}/${total})`;
                document.getElementById('p-bar').style.width = `${((i + 1) / total) * 100}%`;

                try {
                    const res = await fetcher(id);
                    if (res && res.success && res.result && res.result.winners) {
                        this.dataMgr.db.lotteries[id].winners = res.result.winners;
                    }
                    await Utils.sleep(400);
                } catch (e) {
                    console.error(`获取第${id}期数据失败:`, e);
                }
            }

            if (currentMaxId > this.dataMgr.db.meta.lastMaxId) {
                this.dataMgr.db.meta.lastMaxId = currentMaxId;
            }

            this.dataMgr.saveDB();
            this.renderDashboard();
        }

        // --- 展示面板 ---
        renderDashboard() {
            const engine = new StatsEngine(this.dataMgr.db);
            const users = engine.run();

            users.forEach((u, i) => {
                const rank = i + 1;
                if (rank <= 10) u.tags.unshift({ t: `TOP ${rank}`, c: 'tag-god' });
                else if (rank <= 50) u.tags.unshift({ t: '前50强', c: 'tag-rich' });
                else if (rank >= 100 && rank <= 1000) u.tags.push({ t: '尚能饭否', c: 'tag-npc' });
                else if (rank > 1000) u.tags.push({ t: '谢谢参与', c: 'tag-sad' });
            });
            this.engine = engine;

            const area = document.getElementById('lsp-view-area');
            area.innerHTML = `
                <input type="text" id="lsp-search" placeholder="🔍 搜索【UID】查看用户数据 或【UID UID】对比用户数据 (例: 1799 或 24 1799)">
                <div id="lsp-search-res"></div>

                <div class="lsp-grid">
                    <div class="lsp-card">
                        <h3>🏆 欧皇天梯 (Top 10)</h3>
                        <div class="chart-container">
                            <canvas id="chart-lucky"></canvas>
                        </div>
                    </div>
                    <div class="lsp-card">
                        <h3>☠️ 非酋天梯 (倒数 Top 10)</h3>
                        <div class="chart-container">
                            <canvas id="chart-unlucky"></canvas>
                        </div>
                    </div>
                </div>

                <div class="lsp-card">
                    <h3>📋 暗杀榜 (总中奖 Top 100)</h3>
                    <div class="lsp-table-wrap">
                        <table class="lsp-table">
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>UID</th>
                                    <th>标签</th>
                                    <th>总中奖</th>
                                    <th>高价值/实体</th>
                                    <th>激活码</th>
                                    <th>中奖率</th>
                                    <th>平均间隔</th>
                                </tr>
                            </thead>
                            <tbody id="table-body"></tbody>
                        </table>
                    </div>
                </div>
                <div id="tooltip-container"></div>
            `;

            this.renderLuckyChart();
            this.renderUnluckyChart();
            this.renderList(users);
            this.bindSearch(users);
        }

        // --- 欧皇天梯图表 ---
        renderLuckyChart() {
            const luckyData = this.engine.getLuckyLeaderboard();

            // 如果没有数据，显示空图表
            if (luckyData.length === 0) {
                const ctx = document.getElementById('chart-lucky').getContext('2d');
                // 销毁旧的图表实例
                if (this.charts.lucky) {
                    this.charts.lucky.destroy();
                    this.charts.lucky = null;
                }

                const theme = CONFIG.themes[this.currentTheme];

                this.charts.lucky = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['暂无数据'],
                        datasets: [{
                            label: '中奖次数',
                            data: [0],
                            backgroundColor: theme.chartGrid,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: theme.chartBorder
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                labels: {
                                    color: theme.chartText
                                }
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: theme.chartGrid,
                                    drawBorder: true,
                                    drawOnChartArea: true,
                                    drawTicks: true
                                },
                                ticks: {
                                    color: theme.chartAxis,
                                    font: {
                                        size: 11
                                    }
                                },
                                title: {
                                    display: true,
                                    text: '中奖次数',
                                    color: theme.chartAxis,
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    }
                                },
                                border: {
                                    color: theme.chartBorder
                                }
                            },
                            x: {
                                grid: {
                                    color: theme.chartGrid,
                                    drawBorder: true,
                                    drawOnChartArea: false,
                                    drawTicks: true
                                },
                                ticks: {
                                    color: theme.chartAxis,
                                    font: {
                                        size: 11
                                    },
                                    maxRotation: 45,
                                    minRotation: 0
                                },
                                border: {
                                    color: theme.chartBorder
                                }
                            }
                        }
                    }
                });
                return;
            }

            const labels = luckyData.map(group => {
                const uids = group.uids;
                const total = group.totalUsers;

                if (total <= 3) {
                    return uids.join(', ');
                } else {
                    return `${uids.slice(0, 3).join(', ')} 等${total}人`;
                }
            });

            const dataVals = luckyData.map(group => group.count);

            const ctx = document.getElementById('chart-lucky').getContext('2d');

            // 销毁旧的图表实例
            if (this.charts.lucky) {
                this.charts.lucky.destroy();
                this.charts.lucky = null;
            }

            // 获取当前主题
            const theme = CONFIG.themes[this.currentTheme];

            this.charts.lucky = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '中奖次数',
                        data: dataVals,
                        backgroundColor: CONFIG.colors.local,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: theme.chartBorder
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: theme.chartText
                            }
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: theme.tooltipBg,
                            titleColor: CONFIG.colors.local,
                            bodyColor: theme.tooltipText,
                            borderColor: theme.border,
                            borderWidth: 1,
                            cornerRadius: 6,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                title: function(tooltipItems) {
                                    const index = tooltipItems[0].dataIndex;
                                    const group = luckyData[index];
                                    const uids = group.uids;
                                    const total = group.totalUsers;

                                    if (total <= 10) {
                                        return `中奖次数: ${group.count}次 (${total}人)`;
                                    } else {
                                        return `中奖次数: ${group.count}次 (${total}人)`;
                                    }
                                },
                                label: function(context) {
                                    const index = context.dataIndex;
                                    const group = luckyData[index];
                                    const uids = group.uids;
                                    const total = group.totalUsers;

                                    if (total <= 10) {
                                        return `用户: ${uids.join(', ')}`;
                                    } else {
                                        return `用户: ${uids.slice(0, 10).join(', ')} 等${total}人`;
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                }
                            },
                            title: {
                                display: true,
                                text: '中奖次数',
                                color: theme.chartAxis,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        },
                        x: {
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: false,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                },
                                maxRotation: 45,
                                minRotation: 0
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        }
                    }
                }
            });
        }

        // --- 非酋天梯图表 ---
        renderUnluckyChart() {
            const unluckyData = this.engine.getUnluckyLeaderboard();

            // 如果没有数据，显示空图表
            if (unluckyData.length === 0) {
                const ctx = document.getElementById('chart-unlucky').getContext('2d');
                // 销毁旧的图表实例
                if (this.charts.unlucky) {
                    this.charts.unlucky.destroy();
                    this.charts.unlucky = null;
                }

                const theme = CONFIG.themes[this.currentTheme];

                this.charts.unlucky = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['暂无数据'],
                        datasets: [{
                            label: '中奖次数',
                            data: [0],
                            backgroundColor: theme.chartGrid,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: theme.chartBorder
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                labels: {
                                    color: theme.chartText
                                }
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: theme.chartGrid,
                                    drawBorder: true,
                                    drawOnChartArea: true,
                                    drawTicks: true
                                },
                                ticks: {
                                    color: theme.chartAxis,
                                    font: {
                                        size: 11
                                    }
                                },
                                title: {
                                    display: true,
                                    text: '中奖次数',
                                    color: theme.chartAxis,
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    }
                                },
                                border: {
                                    color: theme.chartBorder
                                }
                            },
                            x: {
                                grid: {
                                    color: theme.chartGrid,
                                    drawBorder: true,
                                    drawOnChartArea: false,
                                    drawTicks: true
                                },
                                ticks: {
                                    color: theme.chartAxis,
                                    font: {
                                        size: 11
                                    },
                                    maxRotation: 45,
                                    minRotation: 0
                                },
                                border: {
                                    color: theme.chartBorder
                                }
                            }
                        }
                    }
                });
                return;
            }

            const labels = unluckyData.map(group => {
                const uids = group.uids;
                const total = group.totalUsers;

                if (total <= 3) {
                    return uids.join(', ');
                } else {
                    return `${uids.slice(0, 3).join(', ')} 等${total}人`;
                }
            });

            const dataVals = unluckyData.map(group => group.count);

            const ctx = document.getElementById('chart-unlucky').getContext('2d');

            // 销毁旧的图表实例
            if (this.charts.unlucky) {
                this.charts.unlucky.destroy();
                this.charts.unlucky = null;
            }

            // 获取当前主题
            const theme = CONFIG.themes[this.currentTheme];

            this.charts.unlucky = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '中奖次数',
                        data: dataVals,
                        backgroundColor: CONFIG.colors.unlucky,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: theme.chartBorder
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: theme.chartText
                            }
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: theme.tooltipBg,
                            titleColor: CONFIG.colors.unlucky,
                            bodyColor: theme.tooltipText,
                            borderColor: theme.border,
                            borderWidth: 1,
                            cornerRadius: 6,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                title: function(tooltipItems) {
                                    const index = tooltipItems[0].dataIndex;
                                    const group = unluckyData[index];
                                    const uids = group.uids;
                                    const total = group.totalUsers;

                                    if (total <= 10) {
                                        return `中奖次数: ${group.count}次 (${total}人)`;
                                    } else {
                                        return `中奖次数: ${group.count}次 (${total}人)`;
                                    }
                                },
                                label: function(context) {
                                    const index = context.dataIndex;
                                    const group = unluckyData[index];
                                    const uids = group.uids;
                                    const total = group.totalUsers;

                                    if (total <= 10) {
                                        return `用户: ${uids.join(', ')}`;
                                    } else {
                                        return `用户: ${uids.slice(0, 10).join(', ')} 等${total}人`;
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                }
                            },
                            title: {
                                display: true,
                                text: '中奖次数',
                                color: theme.chartAxis,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        },
                        x: {
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: false,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                },
                                maxRotation: 45,
                                minRotation: 0
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        }
                    }
                }
            });
        }

        renderList(users) {
            const tbody = document.getElementById('table-body');
            // 使用文档片段批量插入
            const fragment = document.createDocumentFragment();
            users.slice(0, 100).forEach((u, i) => {
                const rank = i + 1;
                let rankBadge = '';
                if (rank === 1) rankBadge = '<span class="ranking-badge ranking-1">🥇</span>';
                else if (rank === 2) rankBadge = '<span class="ranking-badge ranking-2">🥈</span>';
                else if (rank === 3) rankBadge = '<span class="ranking-badge ranking-3">🥉</span>';

                const row = document.createElement('tr');
                row.dataset.uid = u.uid;
                row.innerHTML = `
                    <td><span style="font-weight:600;">${rank}</span>${rankBadge}</td>
                    <td style="font-weight:500;">${u.uid}</td>
                    <td>${u.tags.map(t => `<span class="lsp-tag ${t.c}" title="${TAG_DEFS[t.t]||t.t}">${t.t}</span>`).join('')}</td>
                    <td style="color:var(--lsp-primary);font-weight:bold;font-size:1.1em;">${Utils.formatNumber(u.total)}</td>
                    <td style="color:${CONFIG.colors.local};font-weight:500;">${Utils.formatNumber(u.local)}</td>
                    <td style="color:${CONFIG.colors.steam};font-weight:500;">${Utils.formatNumber(u.steam)}</td>
                    <td style="color:${parseFloat(u.rate) > 5 ? CONFIG.colors.success : parseFloat(u.rate) > 1 ? CONFIG.colors.warning : CONFIG.colors.danger};font-weight:500;">${u.rate}%</td>
                    <td style="color:${parseFloat(u.avgInterval) > 50 ? CONFIG.colors.unlucky : CONFIG.colors.success};font-weight:500;">${u.avgInterval}</td>
                `;
                fragment.appendChild(row);
            });
            tbody.innerHTML = '';
            tbody.appendChild(fragment);

            // 绑定悬浮 Tooltip
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const uid = row.dataset.uid;

                row.addEventListener('mouseenter', (e) => {
                    this.hoverTimer = setTimeout(() => {
                        this.showRowTooltip(e, `🖱️ 点击查看用户 <b style="color:var(--lsp-primary)">${uid}</b> 详细中奖情况`);
                    }, 300);
                });

                row.addEventListener('mouseleave', () => {
                    clearTimeout(this.hoverTimer);
                    this.hideRowTooltip();
                });

                row.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'SPAN' && !e.target.closest('.lsp-tag') && !e.target.closest('.ranking-badge')) {
                        this.showUserDetail(uid);
                    }
                });
            });
        }

        // --- 悬浮 Tooltip ---
        showRowTooltip(e, message) {
            // 创建或获取tooltip元素
            let tooltip = document.getElementById('lsp-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'lsp-tooltip';
                document.body.appendChild(tooltip);
            }

            tooltip.innerHTML = message;

            // 获取鼠标位置
            const x = e.clientX;
            const y = e.clientY;

            // 设置tooltip位置（跟随鼠标）
            tooltip.style.left = (x + 15) + 'px';
            tooltip.style.top = (y - 50) + 'px';
            tooltip.style.display = 'block';

            // 确保tooltip在可视区域内
            const rect = tooltip.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                tooltip.style.left = (x - rect.width - 15) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                tooltip.style.top = (y - rect.height - 15) + 'px';
            }
            if (rect.top < 0) {
                tooltip.style.top = '15px';
            }
        }

        hideRowTooltip() {
            const tooltip = document.getElementById('lsp-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }

        // --- 用户详情模态框 ---
        showUserDetail(uid) {
            const user = this.engine.getUser(uid);
            if (!user) {
                alert("无该用户数据");
                return;
            }

            const overlay = document.createElement('div');
            overlay.id = 'lsp-modal-overlay';
            overlay.innerHTML = `
                <div id="lsp-modal">
                    <div class="modal-head">
                        <div class="lsp-title">👤 用户: ${uid}</div>
                        <div class="modal-close" onclick="document.getElementById('lsp-modal-overlay').remove()">×</div>
                    </div>
                    <div class="modal-body">
                        <div class="user-info-row">
                            <div class="user-info-item">
                                <div class="user-info-label">总中奖次数</div>
                                <div class="user-info-value highlight">${Utils.formatNumber(user.total)}</div>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-label">高价值/实体</div>
                                <div class="user-info-value" style="color:${CONFIG.colors.local}">${Utils.formatNumber(user.local)}</div>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-label">激活码</div>
                                <div class="user-info-value" style="color:${CONFIG.colors.steam}">${Utils.formatNumber(user.steam)}</div>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-label">中奖率</div>
                                <div class="user-info-value" style="color:${parseFloat(user.rate) > 5 ? CONFIG.colors.success : parseFloat(user.rate) > 1 ? CONFIG.colors.warning : CONFIG.colors.danger}">${user.rate}%</div>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-label">平均间隔</div>
                                <div class="user-info-value" style="color:${parseFloat(user.avgInterval) > 50 ? CONFIG.colors.unlucky : CONFIG.colors.success}">${user.avgInterval}期</div>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-label">最后中奖期数</div>
                                <div class="user-info-value">${Utils.removeLeadingZeros(user.lastWinIssue)}</div>
                            </div>
                        </div>

                        <div style="margin-bottom:25px;">
                            ${user.tags.map(t => `<span class="lsp-tag ${t.c}" title="${TAG_DEFS[t.t]||''}">${t.t}</span>`).join('')}
                        </div>

                        <div class="section-title">📊 奖品成分分布</div>
                        <div class="lsp-grid" style="grid-template-columns: 1fr 2fr; margin-bottom: 30px;">
                            <div class="lsp-card">
                                <div class="modal-chart-container">
                                    <canvas id="modal-chart-pie"></canvas>
                                </div>
                            </div>
                            <div class="lsp-card">
                                <div class="modal-chart-container">
                                    <canvas id="modal-chart-interval"></canvas>
                                </div>
                            </div>
                        </div>

                        <div class="section-title">📅 完整中奖历史</div>
                        <div class="user-history-table" id="history-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>期数</th>
                                        <th>标题</th>
                                        <th>类型</th>
                                        <th>名额</th>
                                        <th>开奖日期</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${user.wins.map(w => {
                                        const issueNo = Utils.removeLeadingZeros(w.issue);
                                        const platformText = w.platform === 'steam' ? '激活码' : '高价值/实体';
                                        const platformColor = w.platform === 'steam' ? CONFIG.colors.steam : CONFIG.colors.local;
                                        return `
                                        <tr class="history-row" data-id="${w.id}" data-issue="${issueNo}">
                                            <td>第${issueNo}期</td>
                                            <td>${w.title}</td>
                                            <td style="color:${platformColor};font-weight:500;">${platformText}</td>
                                            <td>${w.quota}</td>
                                            <td>${w.date}</td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // 绑定历史行点击事件和Tooltip
            const historyRows = overlay.querySelectorAll('.history-row');
            historyRows.forEach(row => {
                const lotteryId = row.dataset.id;
                const issue = row.dataset.issue;

                row.addEventListener('mouseenter', (e) => {
                    this.historyTooltipTimer = setTimeout(() => {
                        this.showRowTooltip(e, `🖱️ 点击跳转到第 <b style="color:var(--lsp-primary)">${issue}</b> 期乐透`);
                    }, 300);
                });

                row.addEventListener('mouseleave', () => {
                    clearTimeout(this.historyTooltipTimer);
                    this.hideRowTooltip();
                });

                row.addEventListener('click', () => {
                    window.open(`https://www.lspsp.me/lottery#lottery-${lotteryId}`, '_blank');
                });
            });

            // 获取当前主题
            const theme = CONFIG.themes[this.currentTheme];

            // 清除之前的用户详情图表
            if (this.charts.userDetail && this.charts.userDetail.length > 0) {
                this.charts.userDetail.forEach(chart => {
                    if (chart && chart._active && !chart._destroyed) {
                        chart.destroy();
                    }
                });
            }
            this.charts.userDetail = [];

            // 奖品成分分布饼图
            const pieCtx = document.getElementById('modal-chart-pie').getContext('2d');
            const pieChart = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: ['高价值/实体', '激活码'],
                    datasets: [{
                        data: [user.local, user.steam],
                        backgroundColor: [CONFIG.colors.local, CONFIG.colors.steam],
                        borderWidth: 2,
                        borderColor: 'var(--lsp-card)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: theme.chartText,
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: theme.tooltipBg,
                            titleColor: CONFIG.colors.local,
                            bodyColor: theme.tooltipText,
                            borderColor: theme.border,
                            borderWidth: 1,
                            cornerRadius: 6,
                            padding: 12
                        }
                    }
                }
            });
            this.charts.userDetail.push(pieChart);

            // 中奖间隔分布图
            const intervalCtx = document.getElementById('modal-chart-interval').getContext('2d');
            const intervalData = user.intervals;
            const intervalLabels = intervalData.map((_, i) => `第${i+1}次间隔`);

            const intervalChart = new Chart(intervalCtx, {
                type: 'line',
                data: {
                    labels: intervalLabels,
                    datasets: [{
                        label: '中奖间隔分布',
                        data: intervalData,
                        borderColor: theme.primary,
                        backgroundColor: `rgba(${this.currentTheme === 'dark' ? '210, 79, 112, 0.3' : '210, 79, 112, 0.15'})`,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: theme.primary,
                        pointBorderColor: 'var(--lsp-card)',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: theme.chartText
                            }
                        },
                        tooltip: {
                            backgroundColor: theme.tooltipBg,
                            titleColor: theme.primary,
                            bodyColor: theme.tooltipText,
                            borderColor: theme.border,
                            borderWidth: 1,
                            cornerRadius: 6,
                            padding: 12,
                            callbacks: {
                                title: function() {
                                    return '中奖间隔分布';
                                },
                                label: function(context) {
                                    return `第${context.dataIndex+1}次间隔: ${context.parsed.y}期`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                }
                            },
                            title: {
                                display: true,
                                text: '中奖间隔（期）',
                                color: theme.chartAxis,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        },
                        x: {
                            grid: {
                                color: theme.chartGrid,
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: true
                            },
                            ticks: {
                                color: theme.chartAxis,
                                font: {
                                    size: 11
                                },
                                maxRotation: 45
                            },
                            title: {
                                display: true,
                                text: '中奖间隔次数（次）',
                                color: theme.chartAxis,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            border: {
                                color: theme.chartBorder
                            }
                        }
                    }
                }
            });
            this.charts.userDetail.push(intervalChart);
        }

        bindSearch(users) {
            const ipt = document.getElementById('lsp-search');
            ipt.oninput = Utils.debounce((e) => {
                const val = e.target.value.trim();
                const res = document.getElementById('lsp-search-res');
                res.innerHTML = '';
                if (!val) return;

                const ids = val.split(/\s+/);
                const findU = (id) => users.find(u => u.uid == id) || {
                    uid: id,
                    total: 0,
                    tags: [{ t: '未收录/0中奖', c: 'tag-sad' }],
                    local: 0,
                    steam: 0,
                    rate: '0.00',
                    avgInterval: '0',
                    lastWinIssue: '-'
                };

                const cards = ids.slice(0, 2).map(id => {
                    const u = findU(id);
                    const btnHtml = u.total > 0 ? `<button class="lsp-btn" style="margin-top:15px;padding:10px 20px;font-weight:600;" data-uid="${u.uid}">📄 查看详细中奖情况</button>` : '';
                    return `
                        <div class="lsp-card search-result-card">
                            <h2 style="color:var(--lsp-primary);margin-bottom:10px;font-size:1.5em;">${u.uid}</h2>
                            <div style="margin-bottom:15px;">${u.tags.map(t => `<span class="lsp-tag ${t.c}" title="${TAG_DEFS[t.t]||''}">${t.t}</span>`).join('')}</div>
                            <h1 style="font-size:3.5em;margin:15px 0;color:var(--lsp-primary);font-weight:700;">${Utils.formatNumber(u.total)}</h1>
                            <div class="search-result-grid">
                                <div class="search-result-stat">
                                    <div style="font-size:0.9em;color:var(--lsp-text-sec);margin-bottom:5px;">高价值/实体</div>
                                    <div style="font-size:1.3em;font-weight:bold;color:${CONFIG.colors.local}">${Utils.formatNumber(u.local)}</div>
                                </div>
                                <div class="search-result-stat">
                                    <div style="font-size:0.9em;color:var(--lsp-text-sec);margin-bottom:5px;">激活码</div>
                                    <div style="font-size:1.3em;font-weight:bold;color:${CONFIG.colors.steam}">${Utils.formatNumber(u.steam)}</div>
                                </div>
                                <div class="search-result-stat">
                                    <div style="font-size:0.9em;color:var(--lsp-text-sec);margin-bottom:5px;">中奖率</div>
                                    <div style="font-size:1.3em;font-weight:bold;color:${parseFloat(u.rate) > 5 ? CONFIG.colors.success : parseFloat(u.rate) > 1 ? CONFIG.colors.warning : CONFIG.colors.danger}">${u.rate}%</div>
                                </div>
                                <div class="search-result-stat">
                                    <div style="font-size:0.9em;color:var(--lsp-text-sec);margin-bottom:5px;">平均间隔</div>
                                    <div style="font-size:1.3em;font-weight:bold;color:${parseFloat(u.avgInterval) > 50 ? CONFIG.colors.unlucky : CONFIG.colors.success}">${u.avgInterval}期</div>
                                </div>
                            </div>
                            ${btnHtml}
                        </div>
                    `;
                });

                res.innerHTML = `<div style="display:flex;gap:25px;margin-bottom:25px;flex-wrap:wrap;justify-content:center;">${cards.join(ids.length > 1 ? '<div style="display:flex;align-items:center;font-size:2.5em;font-weight:bold;color:var(--lsp-primary);padding:0 20px;">VS</div>' : '')}</div>`;

                res.querySelectorAll('button').forEach(btn => {
                    btn.onclick = () => this.showUserDetail(btn.dataset.uid);
                });
            }, 300);
        }
    }

    // 启动入口
    window.addEventListener('load', () => setTimeout(() => new UIManager(), 800));
})();
