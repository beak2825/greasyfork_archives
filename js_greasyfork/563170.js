// ==UserScript==
// @name         万物脉络
// @name:en      The Core Pulse
// @namespace    https://core-pulse.dev/
// @version      2.0.0
// @description  高度人文感、全透明的浏览器"里层"透视系统
// @description:en A humanistic, transparent "inner-layer" perspective system for your browser.
// @author       Core Pulse Team
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563170/%E4%B8%87%E7%89%A9%E8%84%89%E7%BB%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/563170/%E4%B8%87%E7%89%A9%E8%84%89%E7%BB%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // 🌌 第一章：核心状态管理系统
    // ═══════════════════════════════════════════════════════════════

    const CoreState = {
        // 持久化状态键
        STORAGE_KEY: 'CORE_PULSE_STATE_V2',

        // 默认状态
        defaults: {
            isPanelOpen: false,
            activeTab: 'guide',
            isFirstVisit: true,
            inspectMode: false,
            theme: 'dark'
        },

        // 当前状态缓存
        _state: null,

        // 获取状态
        get() {
            if (this._state) return this._state;
            try {
                const saved = typeof GM_getValue !== 'undefined'
                    ? GM_getValue(this.STORAGE_KEY, null)
                    : localStorage.getItem(this.STORAGE_KEY);
                this._state = saved ? JSON.parse(saved) : { ...this.defaults };
            } catch (e) {
                this._state = { ...this.defaults };
            }
            return this._state;
        },

        // 设置状态
        set(key, value) {
            this._state = this.get();
            this._state[key] = value;
            this.save();
        },

        // 保存状态
        save() {
            try {
                const data = JSON.stringify(this._state);
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(this.STORAGE_KEY, data);
                } else {
                    localStorage.setItem(this.STORAGE_KEY, data);
                }
            } catch (e) {
                console.warn('[CorePulse] 状态保存失败:', e);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🎨 第二章：样式注入系统（高斯模糊 + 呼吸动画）
    // ═══════════════════════════════════════════════════════════════

    const CoreStyles = `
        /* ═══ CSS变量定义 ═══ */
        :root {
            --cp-bg-primary: rgba(15, 15, 25, 0.92);
            --cp-bg-secondary: rgba(25, 25, 40, 0.85);
            --cp-bg-tertiary: rgba(35, 35, 55, 0.75);
            --cp-text-primary: #e8e8f0;
            --cp-text-secondary: #a0a0b8;
            --cp-text-muted: #6a6a80;
            --cp-accent-blue: #4a9eff;
            --cp-accent-purple: #9b6dff;
            --cp-accent-green: #50e3a4;
            --cp-accent-orange: #ff9f43;
            --cp-accent-red: #ff6b6b;
            --cp-accent-cyan: #00d9ff;
            --cp-border-color: rgba(255, 255, 255, 0.08);
            --cp-shadow-glow: 0 0 40px rgba(74, 158, 255, 0.15);
            --cp-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            --cp-transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --cp-blur-strength: 20px;
            --cp-panel-width: 420px;
        }

        /* ═══ 呼吸感动画定义 ═══ */
        @keyframes cp-breathe {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes cp-pulse-ring {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.7; }
        }

        @keyframes cp-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes cp-fade-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes cp-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes cp-glow-pulse {
            0%, 100% { box-shadow: 0 0 5px var(--cp-accent-blue), 0 0 10px transparent; }
            50% { box-shadow: 0 0 10px var(--cp-accent-blue), 0 0 20px var(--cp-accent-blue); }
        }

        /* ═══ 触发按钮 ═══ */
        #cp-trigger-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--cp-accent-purple), var(--cp-accent-blue));
            border: none;
            cursor: pointer;
            z-index: 2147483646;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--cp-shadow-glow), 0 4px 20px rgba(0,0,0,0.3);
            transition: var(--cp-transition-smooth);
            animation: cp-breathe 3s ease-in-out infinite;
            flex-shrink: 0;
        }

        #cp-trigger-btn:hover {
            transform: scale(1.1);
            animation: none;
        }

        #cp-trigger-btn:active {
            transform: scale(0.95);
        }

        #cp-trigger-btn svg {
            width: 28px;
            height: 28px;
            fill: white;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        #cp-trigger-btn.active {
            animation: cp-pulse-ring 1.5s ease-in-out infinite;
        }

        /* ═══ 主面板容器 ═══ */
        #cp-main-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: var(--cp-panel-width);
            max-width: 100vw;
            height: 100dvh;
            background: var(--cp-bg-primary);
            backdrop-filter: blur(var(--cp-blur-strength)) saturate(180%);
            -webkit-backdrop-filter: blur(var(--cp-blur-strength)) saturate(180%);
            border-left: 1px solid var(--cp-border-color);
            z-index: 2147483647;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            color: var(--cp-text-primary);
            box-shadow: -10px 0 60px rgba(0, 0, 0, 0.4);
            overflow: hidden;
        }

        #cp-main-panel.open {
            display: flex;
            animation: cp-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ═══ 头部区域 ═══ */
        #cp-header {
            flex-shrink: 0;
            padding: 20px;
            background: linear-gradient(180deg, rgba(74, 158, 255, 0.1), transparent);
            border-bottom: 1px solid var(--cp-border-color);
        }

        #cp-header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        #cp-header-title h1 {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            background: linear-gradient(135deg, var(--cp-accent-cyan), var(--cp-accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        #cp-header-title .version {
            font-size: 11px;
            padding: 2px 8px;
            background: var(--cp-bg-tertiary);
            border-radius: 10px;
            color: var(--cp-text-muted);
        }

        #cp-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--cp-bg-tertiary);
            border: 1px solid var(--cp-border-color);
            color: var(--cp-text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--cp-transition-fast);
            flex-shrink: 0;
        }

        #cp-close-btn:hover {
            background: var(--cp-accent-red);
            color: white;
        }

        /* ═══ 标签导航 ═══ */
        #cp-tab-nav {
            display: flex;
            gap: 4px;
            padding: 4px;
            background: var(--cp-bg-secondary);
            border-radius: 12px;
            flex-shrink: 0;
        }

        .cp-tab-btn {
            flex: 1;
            padding: 10px 8px;
            border: none;
            background: transparent;
            color: var(--cp-text-secondary);
            font-size: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--cp-transition-fast);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }

        .cp-tab-btn:hover {
            background: var(--cp-bg-tertiary);
            color: var(--cp-text-primary);
        }

        .cp-tab-btn.active {
            background: linear-gradient(135deg, var(--cp-accent-blue), var(--cp-accent-purple));
            color: white;
            box-shadow: 0 2px 10px rgba(74, 158, 255, 0.3);
        }

        .cp-tab-btn svg {
            width: 18px;
            height: 18px;
        }

        .cp-tab-btn span {
            font-size: 10px;
            white-space: nowrap;
        }

        /* ═══ 内容区域 ═══ */
        #cp-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px;
            scrollbar-width: thin;
            scrollbar-color: var(--cp-bg-tertiary) transparent;
        }

        #cp-content::-webkit-scrollbar {
            width: 6px;
        }

        #cp-content::-webkit-scrollbar-track {
            background: transparent;
        }

        #cp-content::-webkit-scrollbar-thumb {
            background: var(--cp-bg-tertiary);
            border-radius: 3px;
        }

        .cp-tab-content {
            display: none;
            animation: cp-fade-up 0.3s ease;
        }

        .cp-tab-content.active {
            display: block;
        }

        /* ═══ 卡片样式 ═══ */
        .cp-card {
            background: var(--cp-bg-secondary);
            border: 1px solid var(--cp-border-color);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            transition: var(--cp-transition-fast);
        }

        .cp-card:hover {
            border-color: rgba(74, 158, 255, 0.3);
            box-shadow: 0 0 20px rgba(74, 158, 255, 0.1);
        }

        .cp-card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .cp-card-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .cp-card-icon svg {
            width: 20px;
            height: 20px;
        }

        .cp-card-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--cp-text-primary);
        }

        .cp-card-subtitle {
            font-size: 11px;
            color: var(--cp-text-muted);
            margin-top: 2px;
        }

        /* ═══ 请求条目样式 ═══ */
        .cp-request-item {
            background: var(--cp-bg-tertiary);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            border-left: 3px solid var(--cp-accent-blue);
            transition: var(--cp-transition-fast);
        }

        .cp-request-item:hover {
            transform: translateX(4px);
        }

        .cp-request-item.error {
            border-left-color: var(--cp-accent-red);
        }

        .cp-request-item.success {
            border-left-color: var(--cp-accent-green);
        }

        .cp-request-method {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            margin-right: 8px;
        }

        .cp-request-method.GET { background: rgba(80, 227, 164, 0.2); color: var(--cp-accent-green); }
        .cp-request-method.POST { background: rgba(74, 158, 255, 0.2); color: var(--cp-accent-blue); }
        .cp-request-method.PUT { background: rgba(255, 159, 67, 0.2); color: var(--cp-accent-orange); }
        .cp-request-method.DELETE { background: rgba(255, 107, 107, 0.2); color: var(--cp-accent-red); }

        .cp-request-url {
            font-size: 12px;
            color: var(--cp-text-secondary);
            word-break: break-all;
            margin: 8px 0;
        }

        .cp-request-status {
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .cp-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .cp-status-dot.success { background: var(--cp-accent-green); }
        .cp-status-dot.error { background: var(--cp-accent-red); }
        .cp-status-dot.pending { background: var(--cp-accent-orange); animation: cp-breathe 1s infinite; }

        /* ═══ 性能指标样式 ═══ */
        .cp-metric-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .cp-metric-item {
            background: var(--cp-bg-tertiary);
            border-radius: 10px;
            padding: 14px;
            text-align: center;
        }

        .cp-metric-value {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, var(--cp-accent-cyan), var(--cp-accent-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .cp-metric-label {
            font-size: 11px;
            color: var(--cp-text-muted);
            margin-top: 4px;
        }

        /* ═══ 存储条目样式 ═══ */
        .cp-storage-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px;
            background: var(--cp-bg-tertiary);
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .cp-storage-key {
            font-size: 12px;
            font-weight: 600;
            color: var(--cp-accent-cyan);
            word-break: break-all;
        }

        .cp-storage-value {
            font-size: 11px;
            color: var(--cp-text-secondary);
            word-break: break-all;
            max-height: 60px;
            overflow: hidden;
        }

        .cp-storage-tag {
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(155, 109, 255, 0.2);
            color: var(--cp-accent-purple);
            margin-left: auto;
            flex-shrink: 0;
        }

        /* ═══ 日志条目样式 ═══ */
        .cp-log-item {
            padding: 10px 12px;
            background: var(--cp-bg-tertiary);
            border-radius: 8px;
            margin-bottom: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 11px;
            border-left: 3px solid var(--cp-accent-blue);
        }

        .cp-log-item.log { border-left-color: var(--cp-accent-blue); }
        .cp-log-item.warn { border-left-color: var(--cp-accent-orange); background: rgba(255, 159, 67, 0.1); }
        .cp-log-item.error { border-left-color: var(--cp-accent-red); background: rgba(255, 107, 107, 0.1); }

        .cp-log-time {
            font-size: 9px;
            color: var(--cp-text-muted);
            margin-bottom: 4px;
        }

        .cp-log-content {
            color: var(--cp-text-secondary);
            word-break: break-all;
        }

        /* ═══ 引导页样式 ═══ */
        .cp-guide-section {
            margin-bottom: 20px;
        }

        .cp-guide-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cp-guide-item {
            display: flex;
            gap: 14px;
            padding: 14px;
            background: var(--cp-bg-secondary);
            border-radius: 12px;
            margin-bottom: 10px;
            border: 1px solid var(--cp-border-color);
            transition: var(--cp-transition-fast);
        }

        .cp-guide-item:hover {
            transform: translateX(6px);
            border-color: var(--cp-accent-blue);
        }

        .cp-guide-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .cp-guide-icon svg {
            width: 24px;
            height: 24px;
        }

        .cp-guide-text h3 {
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: var(--cp-text-primary);
        }

        .cp-guide-text p {
            font-size: 12px;
            margin: 0;
            color: var(--cp-text-secondary);
            line-height: 1.5;
        }

        /* ═══ 按钮样式 ═══ */
        .cp-btn {
            padding: 10px 16px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--cp-transition-fast);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }

        .cp-btn-primary {
            background: linear-gradient(135deg, var(--cp-accent-blue), var(--cp-accent-purple));
            color: white;
        }

        .cp-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(74, 158, 255, 0.4);
        }

        .cp-btn-danger {
            background: rgba(255, 107, 107, 0.2);
            color: var(--cp-accent-red);
            border: 1px solid rgba(255, 107, 107, 0.3);
        }

        .cp-btn-danger:hover {
            background: var(--cp-accent-red);
            color: white;
        }

        /* ═══ 开关样式 ═══ */
        .cp-switch {
            position: relative;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
        }

        .cp-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .cp-switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--cp-bg-tertiary);
            border-radius: 12px;
            transition: var(--cp-transition-fast);
        }

        .cp-switch-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: white;
            border-radius: 50%;
            transition: var(--cp-transition-fast);
        }

        .cp-switch input:checked + .cp-switch-slider {
            background: linear-gradient(135deg, var(--cp-accent-blue), var(--cp-accent-purple));
        }

        .cp-switch input:checked + .cp-switch-slider:before {
            transform: translateX(20px);
        }

        /* ═══ 空状态 ═══ */
        .cp-empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--cp-text-muted);
        }

        .cp-empty-state svg {
            width: 60px;
            height: 60px;
            opacity: 0.3;
            margin-bottom: 16px;
        }

        .cp-empty-state p {
            font-size: 13px;
        }

        /* ═══ 底部工具栏 ═══ */
        #cp-footer {
            flex-shrink: 0;
            padding: 12px 16px;
            background: var(--cp-bg-secondary);
            border-top: 1px solid var(--cp-border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #cp-footer-info {
            font-size: 11px;
            color: var(--cp-text-muted);
        }

        /* ═══ 元素审查高亮 ═══ */
        .cp-inspect-highlight {
            position: fixed;
            pointer-events: none;
            z-index: 2147483645;
            border: 2px solid var(--cp-accent-cyan);
            background: rgba(0, 217, 255, 0.1);
            box-shadow: 0 0 0 4px rgba(0, 217, 255, 0.2),
                        inset 0 0 20px rgba(0, 217, 255, 0.1);
            border-radius: 4px;
            transition: all 0.1s ease;
        }

        .cp-inspect-tooltip {
            position: fixed;
            z-index: 2147483646;
            background: var(--cp-bg-primary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--cp-border-color);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 11px;
            color: var(--cp-text-primary);
            font-family: 'Monaco', 'Menlo', monospace;
            pointer-events: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        /* ═══ 元素操作菜单 ═══ */
        .cp-element-menu {
            position: fixed;
            z-index: 2147483647;
            background: var(--cp-bg-primary);
            backdrop-filter: blur(20px);
            border: 1px solid var(--cp-border-color);
            border-radius: 12px;
            padding: 8px;
            min-width: 180px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            animation: cp-fade-up 0.2s ease;
        }

        .cp-element-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            color: var(--cp-text-primary);
            transition: var(--cp-transition-fast);
        }

        .cp-element-menu-item:hover {
            background: var(--cp-bg-tertiary);
        }

        .cp-element-menu-item svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }

        .cp-element-menu-divider {
            height: 1px;
            background: var(--cp-border-color);
            margin: 6px 0;
        }

        /* ═══ 徽章计数 ═══ */
        .cp-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            background: var(--cp-accent-red);
            border-radius: 9px;
            font-size: 10px;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* ═══ 加载动画 ═══ */
        .cp-loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid var(--cp-bg-tertiary);
            border-top-color: var(--cp-accent-blue);
            border-radius: 50%;
            animation: cp-spin 0.8s linear infinite;
        }

        @keyframes cp-spin {
            to { transform: rotate(360deg); }
        }

        /* ═══ 响应式适配 ═══ */
        @media (max-width: 480px) {
            :root {
                --cp-panel-width: 100vw;
            }

            #cp-trigger-btn {
                width: 48px;
                height: 48px;
                right: 12px;
                bottom: 12px;
            }

            .cp-tab-btn span {
                display: none;
            }

            .cp-metric-grid {
                grid-template-columns: 1fr;
            }
        }

        /* ═══ 详情展开面板 ═══ */
        .cp-detail-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: calc(100vw - var(--cp-panel-width));
            height: 100dvh;
            background: var(--cp-bg-primary);
            backdrop-filter: blur(var(--cp-blur-strength));
            z-index: 2147483645;
            display: none;
            flex-direction: column;
            border-right: 1px solid var(--cp-border-color);
        }

        .cp-detail-panel.open {
            display: flex;
            animation: cp-fade-up 0.3s ease;
        }

        /* ═══ 进度条 ═══ */
        .cp-progress-bar {
            height: 4px;
            background: var(--cp-bg-tertiary);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 8px;
        }

        .cp-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--cp-accent-blue), var(--cp-accent-purple));
            border-radius: 2px;
            transition: width 0.3s ease;
        }
    `;

    // ═══════════════════════════════════════════════════════════════
    // 🔌 第三章：网络请求劫持系统（XHR + Fetch）
    // ═══════════════════════════════════════════════════════════════

    const NetworkInterceptor = {
        requests: [],
        maxRequests: 100,
        listeners: [],

        // HTTP状态码语义化映射
        statusMap: {
            200: { text: '连接顺畅', type: 'success' },
            201: { text: '创建成功', type: 'success' },
            204: { text: '操作成功（无返回）', type: 'success' },
            301: { text: '永久迁移', type: 'info' },
            302: { text: '临时跳转', type: 'info' },
            304: { text: '内容未变', type: 'info' },
            400: { text: '请求有误', type: 'error' },
            401: { text: '身份未验', type: 'error' },
            403: { text: '禁止访问', type: 'error' },
            404: { text: '内容失踪', type: 'error' },
            405: { text: '方法不允', type: 'error' },
            408: { text: '请求超时', type: 'error' },
            429: { text: '请求过频', type: 'error' },
            500: { text: '服务器崩溃', type: 'error' },
            502: { text: '网关故障', type: 'error' },
            503: { text: '服务不可用', type: 'error' },
            504: { text: '网关超时', type: 'error' }
        },

        getStatusInfo(code) {
            return this.statusMap[code] || {
                text: code >= 200 && code < 300 ? '请求成功' :
                      code >= 300 && code < 400 ? '重定向' :
                      code >= 400 && code < 500 ? '客户端错误' : '服务器错误',
                type: code >= 200 && code < 400 ? 'success' : 'error'
            };
        },

        addRequest(req) {
            this.requests.unshift(req);
            if (this.requests.length > this.maxRequests) {
                this.requests.pop();
            }
            this.notify();
        },

        subscribe(callback) {
            this.listeners.push(callback);
            return () => {
                this.listeners = this.listeners.filter(l => l !== callback);
            };
        },

        notify() {
            this.listeners.forEach(cb => cb(this.requests));
        },

        clear() {
            this.requests = [];
            this.notify();
        },

        init() {
            this.interceptXHR();
            this.interceptFetch();
        },

        interceptXHR() {
            const self = this;
            const originalXHR = unsafeWindow.XMLHttpRequest || window.XMLHttpRequest;

            function InterceptedXHR() {
                const xhr = new originalXHR();
                const requestData = {
                    id: Date.now() + Math.random(),
                    type: 'XHR',
                    method: 'GET',
                    url: '',
                    payload: null,
                    status: 0,
                    statusText: '',
                    startTime: 0,
                    endTime: 0,
                    duration: 0,
                    response: null,
                    state: 'pending'
                };

                const originalOpen = xhr.open;
                xhr.open = function(method, url, ...args) {
                    requestData.method = method.toUpperCase();
                    requestData.url = url;
                    requestData.startTime = Date.now();
                    return originalOpen.apply(xhr, [method, url, ...args]);
                };

                const originalSend = xhr.send;
                xhr.send = function(data) {
                    if (data) {
                        try {
                            requestData.payload = typeof data === 'string' ? JSON.parse(data) : data;
                        } catch {
                            requestData.payload = data;
                        }
                    }
                    self.addRequest(requestData);
                    return originalSend.apply(xhr, arguments);
                };

                xhr.addEventListener('load', function() {
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.status = xhr.status;
                    requestData.statusText = xhr.statusText;
                    requestData.state = xhr.status >= 200 && xhr.status < 400 ? 'success' : 'error';
                    try {
                        requestData.response = JSON.parse(xhr.responseText);
                    } catch {
                        requestData.response = xhr.responseText?.substring(0, 500);
                    }
                    self.notify();
                });

                xhr.addEventListener('error', function() {
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.state = 'error';
                    requestData.statusText = '网络错误';
                    self.notify();
                });

                xhr.addEventListener('timeout', function() {
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.state = 'error';
                    requestData.statusText = '请求超时';
                    self.notify();
                });

                return xhr;
            }

            InterceptedXHR.prototype = originalXHR.prototype;
            Object.keys(originalXHR).forEach(key => {
                try { InterceptedXHR[key] = originalXHR[key]; } catch(e) {}
            });

            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.XMLHttpRequest = InterceptedXHR;
            }
            window.XMLHttpRequest = InterceptedXHR;
        },

        interceptFetch() {
            const self = this;
            const originalFetch = unsafeWindow.fetch || window.fetch;

            const interceptedFetch = async function(input, init = {}) {
                const requestData = {
                    id: Date.now() + Math.random(),
                    type: 'Fetch',
                    method: (init.method || 'GET').toUpperCase(),
                    url: typeof input === 'string' ? input : input.url,
                    payload: null,
                    status: 0,
                    statusText: '',
                    startTime: Date.now(),
                    endTime: 0,
                    duration: 0,
                    response: null,
                    state: 'pending'
                };

                if (init.body) {
                    try {
                        requestData.payload = typeof init.body === 'string'
                            ? JSON.parse(init.body)
                            : init.body;
                    } catch {
                        requestData.payload = init.body;
                    }
                }

                self.addRequest(requestData);

                try {
                    const response = await originalFetch.apply(this, arguments);
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.status = response.status;
                    requestData.statusText = response.statusText;
                    requestData.state = response.ok ? 'success' : 'error';

                    // 克隆响应以便读取
                    const clonedResponse = response.clone();
                    try {
                        requestData.response = await clonedResponse.json();
                    } catch {
                        try {
                            const text = await clonedResponse.text();
                            requestData.response = text.substring(0, 500);
                        } catch {
                            requestData.response = '[无法解析]';
                        }
                    }

                    self.notify();
                    return response;
                } catch (error) {
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.state = 'error';
                    requestData.statusText = error.message || '网络错误';
                    self.notify();
                    throw error;
                }
            };

            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.fetch = interceptedFetch;
            }
            window.fetch = interceptedFetch;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🎯 第四章：元素审查系统
    // ═══════════════════════════════════════════════════════════════

    const ElementInspector = {
        isActive: false,
        highlightEl: null,
        tooltipEl: null,
        menuEl: null,
        currentTarget: null,

        // CSS类名中文映射
        classNameMap: {
            'container': '容器',
            'wrapper': '包裹层',
            'header': '头部',
            'footer': '底部',
            'nav': '导航',
            'sidebar': '侧边栏',
            'main': '主体',
            'content': '内容区',
            'btn': '按钮',
            'button': '按钮',
            'input': '输入框',
            'form': '表单',
            'list': '列表',
            'item': '条目',
            'card': '卡片',
            'modal': '弹窗',
            'menu': '菜单',
            'dropdown': '下拉框',
            'tab': '标签页',
            'panel': '面板',
            'icon': '图标',
            'image': '图片',
            'img': '图片',
            'text': '文本',
            'title': '标题',
            'link': '链接',
            'active': '激活态',
            'disabled': '禁用态',
            'hidden': '隐藏',
            'visible': '可见',
            'loading': '加载中',
            'error': '错误态',
            'success': '成功态',
            'primary': '主要',
            'secondary': '次要'
        },

        translateClassName(className) {
            if (!className) return '';
            return className.split(/[\s-_]+/).map(part => {
                const lower = part.toLowerCase();
                return this.classNameMap[lower] || part;
            }).join(' · ');
        },

        init() {
            this.createHighlightElement();
            this.createTooltipElement();
        },

        createHighlightElement() {
            this.highlightEl = document.createElement('div');
            this.highlightEl.className = 'cp-inspect-highlight';
            this.highlightEl.style.display = 'none';
            document.body.appendChild(this.highlightEl);
        },

        createTooltipElement() {
            this.tooltipEl = document.createElement('div');
            this.tooltipEl.className = 'cp-inspect-tooltip';
            this.tooltipEl.style.display = 'none';
            document.body.appendChild(this.tooltipEl);
        },

        activate() {
            this.isActive = true;
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('click', this.handleClick, true);
            document.addEventListener('keydown', this.handleKeyDown);
            document.body.style.cursor = 'crosshair';
        },

        deactivate() {
            this.isActive = false;
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('click', this.handleClick, true);
            document.removeEventListener('keydown', this.handleKeyDown);
            document.body.style.cursor = '';
            this.hideHighlight();
            this.hideTooltip();
            this.hideMenu();
        },

        handleMouseMove: function(e) {
            if (!ElementInspector.isActive) return;

            const target = e.target;
            if (target.closest('#cp-main-panel') ||
                target.closest('#cp-trigger-btn') ||
                target.closest('.cp-inspect-highlight') ||
                target.closest('.cp-inspect-tooltip') ||
                target.closest('.cp-element-menu')) {
                ElementInspector.hideHighlight();
                ElementInspector.hideTooltip();
                return;
            }

            ElementInspector.currentTarget = target;
            ElementInspector.showHighlight(target);
            ElementInspector.showTooltip(target, e);
        },

        handleClick: function(e) {
            if (!ElementInspector.isActive) return;

            const target = e.target;
            if (target.closest('#cp-main-panel') ||
                target.closest('#cp-trigger-btn') ||
                target.closest('.cp-element-menu')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            ElementInspector.showMenu(ElementInspector.currentTarget, e);
        },

        handleKeyDown: function(e) {
            if (e.key === 'Escape') {
                ElementInspector.deactivate();
                CoreState.set('inspectMode', false);
                document.querySelector('#cp-inspect-toggle')?.click();
            }
        },

        showHighlight(el) {
            const rect = el.getBoundingClientRect();
            this.highlightEl.style.display = 'block';
            this.highlightEl.style.left = rect.left + window.scrollX + 'px';
            this.highlightEl.style.top = rect.top + window.scrollY + 'px';
            this.highlightEl.style.width = rect.width + 'px';
            this.highlightEl.style.height = rect.height + 'px';
        },

        hideHighlight() {
            if (this.highlightEl) {
                this.highlightEl.style.display = 'none';
            }
        },

        showTooltip(el, e) {
            const tagName = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const classes = el.className && typeof el.className === 'string'
                ? '.' + el.className.split(' ').filter(Boolean).join('.')
                : '';

            this.tooltipEl.innerHTML = `
                <div style="color: var(--cp-accent-cyan)">&lt;${tagName}${id}${classes}&gt;</div>
                <div style="color: var(--cp-text-muted); margin-top: 4px; font-size: 10px;">
                    ${el.offsetWidth} × ${el.offsetHeight}
                </div>
            `;

            this.tooltipEl.style.display = 'block';
            this.tooltipEl.style.left = Math.min(e.clientX + 15, window.innerWidth - 200) + 'px';
            this.tooltipEl.style.top = Math.min(e.clientY + 15, window.innerHeight - 60) + 'px';
        },

        hideTooltip() {
            if (this.tooltipEl) {
                this.tooltipEl.style.display = 'none';
            }
        },

        showMenu(el, e) {
            this.hideMenu();

            const menu = document.createElement('div');
            menu.className = 'cp-element-menu';

            const tagName = el.tagName.toLowerCase();
            const classInfo = this.translateClassName(el.className);

            menu.innerHTML = `
                <div style="padding: 8px 12px; border-bottom: 1px solid var(--cp-border-color); margin-bottom: 6px;">
                    <div style="font-size: 12px; color: var(--cp-accent-cyan); font-family: monospace;">&lt;${tagName}&gt;</div>
                    <div style="font-size: 10px; color: var(--cp-text-muted); margin-top: 4px;">${classInfo || '无样式类'}</div>
                </div>
                <div class="cp-element-menu-item" data-action="edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span>实时编辑</span>
                </div>
                <div class="cp-element-menu-item" data-action="delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span>物理抹除</span>
                </div>
                <div class="cp-element-menu-item" data-action="copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>复制结构</span>
                </div>
                <div class="cp-element-menu-divider"></div>
                <div class="cp-element-menu-item" data-action="inspect">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span>属性透视</span>
                </div>
            `;

            menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
            menu.style.top = Math.min(e.clientY, window.innerHeight - 250) + 'px';

            menu.addEventListener('click', (evt) => {
                const item = evt.target.closest('.cp-element-menu-item');
                if (!item) return;

                const action = item.dataset.action;
                this.executeAction(action, el);
                this.hideMenu();
            });

            document.body.appendChild(menu);
            this.menuEl = menu;

            // 点击其他地方关闭菜单
            setTimeout(() => {
                document.addEventListener('click', this.closeMenuHandler);
            }, 0);
        },

        closeMenuHandler: function(e) {
            if (!e.target.closest('.cp-element-menu')) {
                ElementInspector.hideMenu();
                document.removeEventListener('click', ElementInspector.closeMenuHandler);
            }
        },

        hideMenu() {
            if (this.menuEl) {
                this.menuEl.remove();
                this.menuEl = null;
            }
        },

        executeAction(action, el) {
            switch (action) {
                case 'edit':
                    this.enableEditing(el);
                    break;
                case 'delete':
                    this.deleteElement(el);
                    break;
                case 'copy':
                    this.copyStructure(el);
                    break;
                case 'inspect':
                    this.showAttributes(el);
                    break;
            }
        },

        enableEditing(el) {
            el.setAttribute('contenteditable', 'true');
            el.focus();
            el.style.outline = '2px dashed var(--cp-accent-cyan)';
            el.style.outlineOffset = '2px';

            const handler = () => {
                el.removeAttribute('contenteditable');
                el.style.outline = '';
                el.style.outlineOffset = '';
                el.removeEventListener('blur', handler);
            };

            el.addEventListener('blur', handler);
        },

        deleteElement(el) {
            el.style.transition = 'all 0.3s ease';
            el.style.transform = 'scale(0.8)';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        },

        copyStructure(el) {
            const html = el.outerHTML;
            navigator.clipboard.writeText(html).then(() => {
                this.showNotification('结构已复制到剪贴板');
            });
        },

        showAttributes(el) {
            const attrs = Array.from(el.attributes).map(a => `${a.name}: ${a.value}`).join('\n');
            const styles = window.getComputedStyle(el);
            const importantStyles = [
                'display', 'position', 'width', 'height',
                'margin', 'padding', 'font-size', 'color', 'background'
            ].map(p => `${p}: ${styles.getPropertyValue(p)}`).join('\n');

            alert(`【元素属性】\n${attrs}\n\n【计算样式】\n${importantStyles}`);
        },

        showNotification(msg) {
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--cp-bg-primary);
                color: var(--cp-text-primary);
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 13px;
                z-index: 2147483647;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                animation: cp-fade-up 0.3s ease;
            `;
            notif.textContent = msg;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 2000);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 💾 第五章：存储分析系统
    // ═══════════════════════════════════════════════════════════════

    const StorageAnalyzer = {
        // 存储项类型识别
        patterns: {
            token: /token|auth|jwt|session|credential|bearer/i,
            userId: /user[_-]?id|uid|member[_-]?id|account/i,
            preference: /theme|lang|locale|setting|preference|config|mode/i,
            tracking: /analytics|track|utm|ga_|_ga|fbclid|gclid|pixel/i,
            cache: /cache|cached|temp|tmp/i,
            consent: /consent|gdpr|cookie[_-]?policy|privacy/i
        },

        categorize(key) {
            for (const [category, pattern] of Object.entries(this.patterns)) {
                if (pattern.test(key)) {
                    return category;
                }
            }
            return 'other';
        },

        getCategoryLabel(category) {
            const labels = {
                token: '🔐 身份令牌',
                userId: '👤 用户标识',
                preference: '⚙️ 用户偏好',
                tracking: '📊 追踪数据',
                cache: '📦 缓存数据',
                consent: '✅ 隐私同意',
                other: '📎 其他数据'
            };
            return labels[category] || labels.other;
        },

        scanAll() {
            const result = {
                localStorage: this.scanStorage(localStorage, 'local'),
                sessionStorage: this.scanStorage(sessionStorage, 'session'),
                cookies: this.scanCookies()
            };
            return result;
        },

        scanStorage(storage, type) {
            const items = [];
            try {
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    const value = storage.getItem(key);
                    items.push({
                        key,
                        value: this.truncateValue(value),
                        fullValue: value,
                        size: new Blob([value]).size,
                        category: this.categorize(key),
                        type
                    });
                }
            } catch (e) {
                console.warn('[CorePulse] 存储扫描错误:', e);
            }
            return items;
        },

        scanCookies() {
            const items = [];
            try {
                document.cookie.split(';').forEach(cookie => {
                    const [key, ...valueParts] = cookie.split('=');
                    const value = valueParts.join('=');
                    if (key?.trim()) {
                        items.push({
                            key: key.trim(),
                            value: this.truncateValue(decodeURIComponent(value || '')),
                            fullValue: decodeURIComponent(value || ''),
                            category: this.categorize(key.trim()),
                            type: 'cookie'
                        });
                    }
                });
            } catch (e) {
                console.warn('[CorePulse] Cookie扫描错误:', e);
            }
            return items;
        },

        truncateValue(value, maxLen = 100) {
            if (!value) return '';
            const str = String(value);
            return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
        },

        getStats() {
            const data = this.scanAll();
            return {
                localCount: data.localStorage.length,
                sessionCount: data.sessionStorage.length,
                cookieCount: data.cookies.length,
                totalSize: data.localStorage.reduce((sum, item) => sum + (item.size || 0), 0)
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // ⚡ 第六章：性能监控系统
    // ═══════════════════════════════════════════════════════════════

    const PerformanceMonitor = {
        startTime: Date.now(),

        getMetrics() {
            const perf = window.performance;
            const timing = perf?.timing || {};
            const navigation = perf?.getEntriesByType?.('navigation')?.[0];

            // 页面存活时长
            const uptime = Date.now() - this.startTime;

            // 首屏渲染时间
            let firstPaint = 0;
            try {
                const paintEntries = perf?.getEntriesByType?.('paint') || [];
                const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
                firstPaint = fcp ? Math.round(fcp.startTime) :
                             (timing.domContentLoadedEventEnd - timing.navigationStart) || 0;
            } catch (e) {
                firstPaint = timing.domComplete ? timing.domComplete - timing.navigationStart : 0;
            }

            // 页面完全加载时间
            const loadTime = navigation?.loadEventEnd ||
                            (timing.loadEventEnd - timing.navigationStart) || 0;

            // 内存占用（带安全降级）
            let memory = null;
            try {
                if (perf?.memory) {
                    memory = {
                        used: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024),
                        limit: Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024)
                    };
                }
            } catch (e) {
                // 不支持memory API
            }

            // DOM节点数量
            const domNodes = document.querySelectorAll('*').length;

            // 资源统计
            let resourceStats = { scripts: 0, styles: 0, images: 0, total: 0 };
            try {
                const resources = perf?.getEntriesByType?.('resource') || [];
                resourceStats = {
                    scripts: resources.filter(r => r.initiatorType === 'script').length,
                    styles: resources.filter(r => r.initiatorType === 'link' || r.initiatorType === 'css').length,
                    images: resources.filter(r => r.initiatorType === 'img').length,
                    total: resources.length
                };
            } catch (e) {}

            return {
                uptime,
                firstPaint,
                loadTime: Math.round(loadTime),
                memory,
                domNodes,
                resourceStats
            };
        },

        formatUptime(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (hours > 0) {
                return `${hours}时${minutes % 60}分`;
            } else if (minutes > 0) {
                return `${minutes}分${seconds % 60}秒`;
            }
            return `${seconds}秒`;
        },

        formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        getLoadTimeRating(ms) {
            if (ms < 1000) return { text: '极速', color: 'var(--cp-accent-green)' };
            if (ms < 2500) return { text: '良好', color: 'var(--cp-accent-cyan)' };
            if (ms < 4000) return { text: '一般', color: 'var(--cp-accent-orange)' };
            return { text: '较慢', color: 'var(--cp-accent-red)' };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 📋 第七章：控制台日志捕获系统
    // ═══════════════════════════════════════════════════════════════

    const ConsoleInterceptor = {
        logs: [],
        maxLogs: 200,
        listeners: [],

        init() {
            this.interceptConsole();
            this.interceptErrors();
        },

        interceptConsole() {
            const self = this;
            const methods = ['log', 'warn', 'error', 'info', 'debug'];

            methods.forEach(method => {
                const original = console[method];
                console[method] = function(...args) {
                    self.addLog({
                        type: method,
                        content: args.map(arg => self.stringify(arg)).join(' '),
                        timestamp: Date.now(),
                        stack: new Error().stack
                    });
                    return original.apply(console, args);
                };
            });
        },

        interceptErrors() {
            const self = this;

            window.addEventListener('error', (e) => {
                self.addLog({
                    type: 'error',
                    content: `${e.message} (${e.filename}:${e.lineno}:${e.colno})`,
                    timestamp: Date.now(),
                    isGlobalError: true
                });
            });

            window.addEventListener('unhandledrejection', (e) => {
                self.addLog({
                    type: 'error',
                    content: `未处理的Promise拒绝: ${self.stringify(e.reason)}`,
                    timestamp: Date.now(),
                    isPromiseError: true
                });
            });
        },

        stringify(obj) {
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            if (typeof obj === 'string') return obj;
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
            if (obj instanceof Error) return `${obj.name}: ${obj.message}`;
            try {
                return JSON.stringify(obj, null, 2);
            } catch {
                return String(obj);
            }
        },

        addLog(log) {
            this.logs.unshift(log);
            if (this.logs.length > this.maxLogs) {
                this.logs.pop();
            }
            this.notify();
        },

        subscribe(callback) {
            this.listeners.push(callback);
            return () => {
                this.listeners = this.listeners.filter(l => l !== callback);
            };
        },

        notify() {
            this.listeners.forEach(cb => cb(this.logs));
        },

        clear() {
            this.logs = [];
            this.notify();
        },

        formatTime(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🎨 第八章：图标库
    // ═══════════════════════════════════════════════════════════════

    const Icons = {
        logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
        </svg>`,

        guide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>`,

        network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
        </svg>`,

        element: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
        </svg>`,

        storage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>`,

        performance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>`,

        console: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>`,

        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,

        clear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>`,

        refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>`
    };

    // ═══════════════════════════════════════════════════════════════
    // 🖥️ 第九章：主界面渲染系统
    // ═══════════════════════════════════════════════════════════════

    const CoreUI = {
        panel: null,
        triggerBtn: null,

        init() {
            this.injectStyles();
            this.createTriggerButton();
            this.createMainPanel();
            this.bindEvents();
            this.restoreState();
        },

        injectStyles() {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(CoreStyles);
            } else {
                const style = document.createElement('style');
                style.textContent = CoreStyles;
                (document.head || document.documentElement).appendChild(style);
            }
        },

        createTriggerButton() {
            this.triggerBtn = document.createElement('button');
            this.triggerBtn.id = 'cp-trigger-btn';
            this.triggerBtn.innerHTML = Icons.logo;
            this.triggerBtn.title = '万物脉络';
            document.body.appendChild(this.triggerBtn);
        },

        createMainPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'cp-main-panel';

            this.panel.innerHTML = `
                <div id="cp-header">
                    <div id="cp-header-title">
                        <h1>万物脉络</h1>
                        <span class="version">v2.0</span>
                    </div>
                    <button id="cp-close-btn">${Icons.close}</button>
                    <nav id="cp-tab-nav">
                        <button class="cp-tab-btn active" data-tab="guide">
                            ${Icons.guide}
                            <span>引导</span>
                        </button>
                        <button class="cp-tab-btn" data-tab="network">
                            ${Icons.network}
                            <span>通讯</span>
                        </button>
                        <button class="cp-tab-btn" data-tab="element">
                            ${Icons.element}
                            <span>元素</span>
                        </button>
                        <button class="cp-tab-btn" data-tab="storage">
                            ${Icons.storage}
                            <span>存储</span>
                        </button>
                        <button class="cp-tab-btn" data-tab="performance">
                            ${Icons.performance}
                            <span>性能</span>
                        </button>
                        <button class="cp-tab-btn" data-tab="console">
                            ${Icons.console}
                            <span>日志</span>
                        </button>
                    </nav>
                </div>

                <div id="cp-content">
                    ${this.renderGuideTab()}
                    ${this.renderNetworkTab()}
                    ${this.renderElementTab()}
                    ${this.renderStorageTab()}
                    ${this.renderPerformanceTab()}
                    ${this.renderConsoleTab()}
                </div>

                <div id="cp-footer">
                    <div id="cp-footer-info">
                        <span>当前页面: ${window.location.hostname}</span>
                    </div>
                    <button class="cp-btn cp-btn-danger" id="cp-clear-all">
                        ${Icons.clear}
                        无痕清空
                    </button>
                </div>
            `;

            document.body.appendChild(this.panel);
        },

        renderGuideTab() {
            return `
                <div class="cp-tab-content active" data-content="guide">
                    <div class="cp-guide-section">
                        <div class="cp-guide-title">
                            🌟 欢迎来到万物脉络
                        </div>
                        <p style="color: var(--cp-text-secondary); font-size: 13px; line-height: 1.7; margin-bottom: 20px;">
                            这是一个帮助你"看透"网页的工具。每个网页都像一座城市，
                            这里有街道（网络请求）、建筑（元素）、仓库（存储）和监控室（日志）。
                            让我们一起探索吧！
                        </p>
                    </div>

                    <div class="cp-guide-section">
                        <div class="cp-guide-title">📚 功能地图</div>

                        <div class="cp-guide-item">
                            <div class="cp-guide-icon" style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(74, 158, 255, 0.1));">
                                ${Icons.network}
                            </div>
                            <div class="cp-guide-text">
                                <h3>影影随行 · 通讯监测</h3>
                                <p>像邮局一样，记录网页发出和收到的每一封"信"（网络请求）。你可以看到谁在和谁说话。</p>
                            </div>
                        </div>

                        <div class="cp-guide-item">
                            <div class="cp-guide-icon" style="background: linear-gradient(135deg, rgba(155, 109, 255, 0.2), rgba(155, 109, 255, 0.1));">
                                ${Icons.element}
                            </div>
                            <div class="cp-guide-text">
                                <h3>因果画布 · 元素审查</h3>
                                <p>像X光一样，让你看穿网页上的每一个"零件"。还可以直接修改或删除它们！</p>
                            </div>
                        </div>

                        <div class="cp-guide-item">
                            <div class="cp-guide-icon" style="background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 217, 255, 0.1));">
                                ${Icons.storage}
                            </div>
                            <div class="cp-guide-text">
                                <h3>时光留痕 · 存储透视</h3>
                                <p>网站会在你的电脑上存东西（比如登录信息）。这里可以看到它们存了什么。</p>
                            </div>
                        </div>

                        <div class="cp-guide-item">
                            <div class="cp-guide-icon" style="background: linear-gradient(135deg, rgba(80, 227, 164, 0.2), rgba(80, 227, 164, 0.1));">
                                ${Icons.performance}
                            </div>
                            <div class="cp-guide-text">
                                <h3>性能脉动 · 体征监控</h3>
                                <p>像体检报告一样，告诉你这个网页"健不健康"——加载快不快，用了多少内存。</p>
                            </div>
                        </div>

                        <div class="cp-guide-item">
                            <div class="cp-guide-icon" style="background: linear-gradient(135deg, rgba(255, 159, 67, 0.2), rgba(255, 159, 67, 0.1));">
                                ${Icons.console}
                            </div>
                            <div class="cp-guide-text">
                                <h3>暗流监测 · 日志审计</h3>
                                <p>网页后台的"悄悄话"都会被记录在这里。有错误发生时，你第一时间知道。</p>
                            </div>
                        </div>
                    </div>

                    <div class="cp-card" style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(155, 109, 255, 0.1)); border-color: var(--cp-accent-blue);">
                        <div style="text-align: center; padding: 10px 0;">
                            <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">🚀 准备好探索了吗？</div>
                            <div style="font-size: 12px; color: var(--cp-text-secondary);">点击上方标签页，开始你的透视之旅</div>
                        </div>
                    </div>
                </div>
            `;
        },

        renderNetworkTab() {
            return `
                <div class="cp-tab-content" data-content="network">
                    <div class="cp-card">
                        <div class="cp-card-header">
                            <div class="cp-card-icon" style="background: linear-gradient(135deg, var(--cp-accent-blue), var(--cp-accent-purple));">
                                ${Icons.network}
                            </div>
                            <div>
                                <div class="cp-card-title">影影随行 · 通讯监测</div>
                                <div class="cp-card-subtitle">实时捕获所有网络请求</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                            <button class="cp-btn cp-btn-primary" id="cp-network-refresh">
                                ${Icons.refresh} 刷新
                            </button>
                            <button class="cp-btn cp-btn-danger" id="cp-network-clear">
                                ${Icons.clear} 清空
                            </button>
                        </div>
                    </div>
                    <div id="cp-network-list"></div>
                </div>
            `;
        },

        renderElementTab() {
            return `
                <div class="cp-tab-content" data-content="element">
                    <div class="cp-card">
                        <div class="cp-card-header">
                            <div class="cp-card-icon" style="background: linear-gradient(135deg, var(--cp-accent-purple), var(--cp-accent-cyan));">
                                ${Icons.element}
                            </div>
                            <div>
                                <div class="cp-card-title">因果画布 · 元素审查</div>
                                <div class="cp-card-subtitle">透视并操控网页元素</div>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--cp-bg-tertiary); border-radius: 8px;">
                            <div>
                                <div style="font-size: 13px; font-weight: 500;">审查模式</div>
                                <div style="font-size: 11px; color: var(--cp-text-muted); margin-top: 2px;">开启后可指向元素进行操作</div>
                            </div>
                            <label class="cp-switch">
                                <input type="checkbox" id="cp-inspect-toggle">
                                <span class="cp-switch-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="cp-card">
                        <div class="cp-card-title" style="margin-bottom: 12px;">使用指南</div>
                        <div style="font-size: 12px; color: var(--cp-text-secondary); line-height: 1.8;">
                            <p>1️⃣ 开启审查模式后，鼠标移到页面元素上会显示高亮边框</p>
                            <p>2️⃣ 点击元素会弹出操作菜单：</p>
                            <ul style="margin-left: 20px; margin-top: 8px;">
                                <li><strong>实时编辑</strong> - 直接修改文字内容</li>
                                <li><strong>物理抹除</strong> - 删除该元素（去广告神器）</li>
                                <li><strong>复制结构</strong> - 复制HTML代码</li>
                                <li><strong>属性透视</strong> - 查看详细属性</li>
                            </ul>
                            <p style="margin-top: 8px;">3️⃣ 按 ESC 键可快速退出审查模式</p>
                        </div>
                    </div>
                </div>
            `;
        },

        renderStorageTab() {
            return `
                <div class="cp-tab-content" data-content="storage">
                    <div class="cp-card">
                        <div class="cp-card-header">
                            <div class="cp-card-icon" style="background: linear-gradient(135deg, var(--cp-accent-cyan), var(--cp-accent-green));">
                                ${Icons.storage}
                            </div>
                            <div>
                                <div class="cp-card-title">时光留痕 · 存储透视</div>
                                <div class="cp-card-subtitle">扫描网站在本地存储的所有数据</div>
                            </div>
                        </div>
                        <button class="cp-btn cp-btn-primary" id="cp-storage-scan">
                            ${Icons.refresh} 扫描存储
                        </button>
                    </div>
                    <div id="cp-storage-stats"></div>
                    <div id="cp-storage-list"></div>
                </div>
            `;
        },

        renderPerformanceTab() {
            return `
                <div class="cp-tab-content" data-content="performance">
                    <div class="cp-card">
                        <div class="cp-card-header">
                            <div class="cp-card-icon" style="background: linear-gradient(135deg, var(--cp-accent-green), var(--cp-accent-cyan));">
                                ${Icons.performance}
                            </div>
                            <div>
                                <div class="cp-card-title">性能脉动 · 体征监控</div>
                                <div class="cp-card-subtitle">页面运行状态实时监测</div>
                            </div>
                        </div>
                        <button class="cp-btn cp-btn-primary" id="cp-perf-refresh">
                            ${Icons.refresh} 刷新数据
                        </button>
                    </div>
                    <div id="cp-perf-metrics"></div>
                </div>
            `;
        },

        renderConsoleTab() {
            return `
                <div class="cp-tab-content" data-content="console">
                    <div class="cp-card">
                        <div class="cp-card-header">
                            <div class="cp-card-icon" style="background: linear-gradient(135deg, var(--cp-accent-orange), var(--cp-accent-red));">
                                ${Icons.console}
                            </div>
                            <div>
                                <div class="cp-card-title">暗流监测 · 日志审计</div>
                                <div class="cp-card-subtitle">捕获所有控制台输出与错误</div>
                            </div>
                        </div>
                        <button class="cp-btn cp-btn-danger" id="cp-console-clear">
                            ${Icons.clear} 清空日志
                        </button>
                    </div>
                    <div id="cp-console-list"></div>
                </div>
            `;
        },

        bindEvents() {
            // 触发按钮
            this.triggerBtn.addEventListener('click', () => this.togglePanel());

            // 关闭按钮
            document.getElementById('cp-close-btn').addEventListener('click', () => this.togglePanel(false));

            // 标签切换
            document.querySelectorAll('.cp-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.currentTarget.dataset.tab;
                    this.switchTab(tab);
                });
            });

            // 审查模式开关
            document.getElementById('cp-inspect-toggle').addEventListener('change', (e) => {
                if (e.target.checked) {
                    ElementInspector.activate();
                } else {
                    ElementInspector.deactivate();
                }
                CoreState.set('inspectMode', e.target.checked);
            });

            // 网络请求刷新
            document.getElementById('cp-network-refresh')?.addEventListener('click', () => {
                this.updateNetworkList(NetworkInterceptor.requests);
            });

            // 网络请求清空
            document.getElementById('cp-network-clear')?.addEventListener('click', () => {
                NetworkInterceptor.clear();
            });

            // 存储扫描
            document.getElementById('cp-storage-scan')?.addEventListener('click', () => {
                this.updateStorageView();
            });

            // 性能刷新
            document.getElementById('cp-perf-refresh')?.addEventListener('click', () => {
                this.updatePerformanceView();
            });

            // 日志清空
            document.getElementById('cp-console-clear')?.addEventListener('click', () => {
                ConsoleInterceptor.clear();
            });

            // 全部清空
            document.getElementById('cp-clear-all')?.addEventListener('click', () => {
                if (confirm('确定要清空所有监测数据吗？')) {
                    NetworkInterceptor.clear();
                    ConsoleInterceptor.clear();
                    this.updateStorageView();
                    this.updatePerformanceView();
                }
            });

            // 订阅数据更新
            NetworkInterceptor.subscribe((requests) => {
                this.updateNetworkList(requests);
            });

            ConsoleInterceptor.subscribe((logs) => {
                this.updateConsoleList(logs);
            });
        },

        togglePanel(forceState) {
            const isOpen = forceState !== undefined ? forceState : !this.panel.classList.contains('open');

            if (isOpen) {
                this.panel.classList.add('open');
                this.triggerBtn.classList.add('active');
                this.onPanelOpen();
            } else {
                this.panel.classList.remove('open');
                this.triggerBtn.classList.remove('active');
            }

            CoreState.set('isPanelOpen', isOpen);
        },

        onPanelOpen() {
            // 首次打开时初始化数据
            this.updateNetworkList(NetworkInterceptor.requests);
            this.updateConsoleList(ConsoleInterceptor.logs);
            this.updatePerformanceView();
        },

        switchTab(tabName) {
            // 更新按钮状态
            document.querySelectorAll('.cp-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });

            // 更新内容显示
            document.querySelectorAll('.cp-tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.content === tabName);
            });

            // 特定标签页的初始化
            if (tabName === 'storage') {
                this.updateStorageView();
            } else if (tabName === 'performance') {
                this.updatePerformanceView();
            }

            CoreState.set('activeTab', tabName);
        },

        restoreState() {
            const state = CoreState.get();

            // 恢复标签页
            if (state.activeTab && state.activeTab !== 'guide') {
                this.switchTab(state.activeTab);
            }

            // 恢复面板状态
            if (state.isPanelOpen) {
                setTimeout(() => this.togglePanel(true), 100);
            }
        },

        updateNetworkList(requests) {
            const container = document.getElementById('cp-network-list');
            if (!container) return;

            if (!requests.length) {
                container.innerHTML = `
                    <div class="cp-empty-state">
                        ${Icons.network}
                        <p>暂无网络请求<br>刷新页面或进行操作后会自动捕获</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = requests.slice(0, 50).map(req => {
                const statusInfo = NetworkInterceptor.getStatusInfo(req.status);
                return `
                    <div class="cp-request-item ${req.state}">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="cp-request-method ${req.method}">${req.method}</span>
                            <span style="font-size: 10px; color: var(--cp-text-muted);">${req.type}</span>
                        </div>
                        <div class="cp-request-url">${this.truncateUrl(req.url)}</div>
                        <div class="cp-request-status">
                            <span class="cp-status-dot ${req.state}"></span>
                            <span>${req.status || '等待中'}</span>
                            <span style="color: var(--cp-text-muted);">·</span>
                            <span>${statusInfo.text}</span>
                            ${req.duration ? `<span style="color: var(--cp-text-muted);">· ${req.duration}ms</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        },

        updateStorageView() {
            const statsContainer = document.getElementById('cp-storage-stats');
            const listContainer = document.getElementById('cp-storage-list');
            if (!statsContainer || !listContainer) return;

            const data = StorageAnalyzer.scanAll();
            const stats = StorageAnalyzer.getStats();

            statsContainer.innerHTML = `
                <div class="cp-metric-grid" style="margin-bottom: 16px;">
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${stats.localCount}</div>
                        <div class="cp-metric-label">本地存储项</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${stats.sessionCount}</div>
                        <div class="cp-metric-label">会话存储项</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${stats.cookieCount}</div>
                        <div class="cp-metric-label">Cookie数量</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${StorageAnalyzer.formatBytes ? PerformanceMonitor.formatBytes(stats.totalSize) : stats.totalSize + 'B'}</div>
                        <div class="cp-metric-label">总存储大小</div>
                    </div>
                </div>
            `;

            const allItems = [
                ...data.localStorage,
                ...data.sessionStorage,
                ...data.cookies
            ];

            if (!allItems.length) {
                listContainer.innerHTML = `
                    <div class="cp-empty-state">
                        ${Icons.storage}
                        <p>未发现任何存储数据</p>
                    </div>
                `;
                return;
            }

            // 按类型分组显示
            const grouped = {};
            allItems.forEach(item => {
                const cat = StorageAnalyzer.getCategoryLabel(item.category);
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(item);
            });

            listContainer.innerHTML = Object.entries(grouped).map(([category, items]) => `
                <div class="cp-card">
                    <div class="cp-card-title" style="margin-bottom: 12px;">${category} (${items.length})</div>
                    ${items.slice(0, 10).map(item => `
                        <div class="cp-storage-item">
                            <div style="flex: 1; overflow: hidden;">
                                <div class="cp-storage-key">${item.key}</div>
                                <div class="cp-storage-value">${item.value}</div>
                            </div>
                            <span class="cp-storage-tag">${item.type}</span>
                        </div>
                    `).join('')}
                    ${items.length > 10 ? `<div style="font-size: 11px; color: var(--cp-text-muted); text-align: center; padding: 8px;">还有 ${items.length - 10} 项...</div>` : ''}
                </div>
            `).join('');
        },

        updatePerformanceView() {
            const container = document.getElementById('cp-perf-metrics');
            if (!container) return;

            const metrics = PerformanceMonitor.getMetrics();
            const loadRating = PerformanceMonitor.getLoadTimeRating(metrics.loadTime);

            container.innerHTML = `
                <div class="cp-metric-grid">
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${PerformanceMonitor.formatUptime(metrics.uptime)}</div>
                        <div class="cp-metric-label">页面存活时长</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value" style="color: ${loadRating.color}">${metrics.loadTime}ms</div>
                        <div class="cp-metric-label">完全加载 · ${loadRating.text}</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${metrics.firstPaint}ms</div>
                        <div class="cp-metric-label">首屏渲染</div>
                    </div>
                    <div class="cp-metric-item">
                        <div class="cp-metric-value">${metrics.domNodes}</div>
                        <div class="cp-metric-label">DOM节点数</div>
                    </div>
                </div>

                ${metrics.memory ? `
                    <div class="cp-card" style="margin-top: 16px;">
                        <div class="cp-card-title" style="margin-bottom: 12px;">💭 精神压力 (内存占用)</div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                            <span>已使用: ${metrics.memory.used} MB</span>
                            <span style="color: var(--cp-text-muted);">/ ${metrics.memory.total} MB</span>
                        </div>
                        <div class="cp-progress-bar">
                                                        <div class="cp-progress-fill" style="width: ${Math.min((metrics.memory.used / metrics.memory.total * 100), 100)}%"></div>
                        </div>
                    </div>
                ` : ''}

                        <div class="cp-card" style="margin-top: 16px;">
                            <div class="cp-card-title" style="margin-bottom: 12px;">📦 资源统计</div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                                <div>📜 JS脚本: <strong>${metrics.resourceStats.scripts}</strong></div>
                                <div>🎨 样式表: <strong>${metrics.resourceStats.styles}</strong></div>
                                <div>🖼️ 图片: <strong>${metrics.resourceStats.images}</strong></div>
                                <div>📊 总计: <strong>${metrics.resourceStats.total}</strong></div>
                            </div>
                        </div>
                    </div>
            `;
        },

        updateConsoleList(logs) {
            const container = document.getElementById('cp-console-list');
            if (!container) return;

            if (!logs.length) {
                container.innerHTML = `
                    <div class="cp-empty-state">
                        ${Icons.console}
                        <p>暂无日志输出<br>系统错误或控制台消息会显示在这里</p>
                    </div>
                `;
                return;
            }

            // 为日志项添加动画效果
            const newLogId = logs[0]?.id || Date.now();
            if (container.lastLogId !== newLogId) {
                container.lastLogId = newLogId;
                container.style.animation = 'none';
                setTimeout(() => container.style.animation = '', 10);
            }

            container.innerHTML = logs.slice(0, 100).map(log => `
                <div class="cp-log-item ${log.type}">
                    <div class="cp-log-time">${ConsoleInterceptor.formatTime(log.timestamp)}</div>
                    <div class="cp-log-content">${this.escapeHtml(log.content)}</div>
                </div>
            `).join('');
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        truncateUrl(url, maxLen = 80) {
            if (!url) return '';
            return url.length > maxLen ? url.substring(0, maxLen) + '...' : url;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🛡️ CSP绕过与兼容性处理
    // ═══════════════════════════════════════════════════════════════

    const CSPBypass = {
        // 动态注入样式绕过CSP限制
        injectStyleWithCSPBypass() {
            try {
                // 通过创建<link>标签注入样式，某些CSP策略下更稳定
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = 'data:text/css;base64,' + btoa(unescape(encodeURIComponent(CoreStyles)));
                (document.head || document.documentElement).appendChild(link);

                // 备份方案：直接内联样式
                const style = document.createElement('style');
                style.textContent = CoreStyles;
                style.setAttribute('data-cp-bypass', '1');
                document.head.appendChild(style);

                console.log('[CorePulse] 样式注入完成 (CSP优化)');
            } catch (e) {
                console.warn('[CorePulse] 样式注入失败:', e);
                // 最终降级方案
                GM_addStyle?.(CoreStyles);
            }
        },

        // 确保所有元素都在shadow DOM中运行（如果需要）
        createShadowRoot() {
            // 可选：将面板放入shadow DOM以完全隔离
            // 当前设计不需要，但预留接口
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🔄 异步队列处理器
    // ═══════════════════════════════════════════════════════════════

    const AsyncQueue = {
        queue: [],
        isProcessing: false,
        batchSize: 10,
        interval: 50,

        add(task) {
            this.queue.push(task);
            this.process();
        },

        async process() {
            if (this.isProcessing) return;
            this.isProcessing = true;

            while (this.queue.length > 0) {
                const batch = this.queue.splice(0, this.batchSize);
                await Promise.all(batch.map(task => task().catch(console.warn)));
                await this.sleep(this.interval);
            }

            this.isProcessing = false;
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // 🚀 启动器与错误边界
    // ═══════════════════════════════════════════════════════════════

    // 性能优化：防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 安全启动包装器
    const SafeInitializer = {
        errors: [],

        async init() {
            try {
                console.log('[CorePulse] 开始初始化...');

                // 等待DOM就绪
                await this.waitForCompleteDOM();

                // 注入样式（带CSP绕过）
                CSPBypass.injectStyleWithCSPBypass();

                // 初始化核心系统
                CoreUI.init();
                ElementInspector.init();
                NetworkInterceptor.init();
                ConsoleInterceptor.init();

                // 注册性能监控
                this.registerPerformanceObserver();

                // 注册内存清理
                this.registerMemoryCleanup();

                console.log('[CorePulse] ✅ 万物脉络已完全激活 🌌');

            } catch (error) {
                this.handleInitError(error);
            }
        },

        waitForCompleteDOM() {
            return new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        },

        registerPerformanceObserver() {
            // 监听长任务
            if (window.PerformanceObserver) {
                try {
                    const observer = new PerformanceObserver(list => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 100) {
                                console.warn('[CorePulse] 检测到长任务:', entry.duration + 'ms');
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                } catch (e) {
                    // 浏览器不支持
                }
            }
        },

        registerMemoryCleanup() {
            // 定期清理旧数据
            setInterval(() => {
                const now = Date.now();
                // 清理超过5分钟的请求
                NetworkInterceptor.requests = NetworkInterceptor.requests.filter(
                    req => now - req.startTime < 300000
                );
                // 清理超过5分钟的日志
                ConsoleInterceptor.logs = ConsoleInterceptor.logs.filter(
                    log => now - log.timestamp < 300000
                );
            }, 60000); // 每分钟检查一次
        },

        handleInitError(error) {
            this.errors.push(error);
            console.error('[CorePulse] 初始化失败:', error);

            // 显示用户友好的错误提示
            try {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    padding: 16px;
                    background: rgba(255, 107, 107, 0.9);
                    color: white;
                    border-radius: 8px;
                    z-index: 2147483647;
                    font-size: 13px;
                    backdrop-filter: blur(10px);
                `;
                errorDiv.innerHTML = `
                    <strong>万物脉络加载失败</strong><br>
                    ${error.message}<br>
                    请刷新页面重试
                `;
                document.body.appendChild(errorDiv);
                setTimeout(() => errorDiv.remove(), 5000);
            } catch (e) {
                // 如果连错误提示都显示不了，那就放弃
            }
        }
    };

    // 启动应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SafeInitializer.init());
    } else {
        SafeInitializer.init();
    }

    // ═══════════════════════════════════════════════════════════════
    // 📋 导出API（供外部调用）
    // ═══════════════════════════════════════════════════════════════

    // 将核心对象暴露到全局（可选）
    window.CorePulse = {
        state: CoreState,
        network: NetworkInterceptor,
        storage: StorageAnalyzer,
        performance: PerformanceMonitor,
        console: ConsoleInterceptor,
        element: ElementInspector,
        version: '2.0.0'
    };

    console.log('[CorePulse] 系统内核已加载完成，等待启动...');

})();