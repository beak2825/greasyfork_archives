// ==UserScript==
// @name         QQ邮箱暗黑模式
// @namespace    https://mail.qq.com/
// @version      1.1
// @description  为QQ邮箱提供暗黑模式，支持手动、自动（跟随系统）、定时三种模式。
// @author       blackzro358
// @license      AGPLv3
// @match        https://mail.qq.com/*
// @match        https://wx.mail.qq.com/*
// @match        https://*.mail.qq.com/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563159/QQ%E9%82%AE%E7%AE%B1%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563159/QQ%E9%82%AE%E7%AE%B1%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =====================
    // 配置常量
    // =====================
    const STORAGE_KEYS = {
        MODE: 'darkMode_mode',
        ENABLED: 'darkMode_enabled',
        SCHEDULE_START: 'darkMode_scheduleStart',
        SCHEDULE_END: 'darkMode_scheduleEnd'
    };

    const MODES = {
        MANUAL: 'manual',
        AUTO: 'auto',
        SCHEDULED: 'scheduled'
    };

    const MODE_LABELS = {
        [MODES.MANUAL]: '手动模式',
        [MODES.AUTO]: '自动模式（跟随系统）',
        [MODES.SCHEDULED]: '定时模式'
    };

    // =====================
    // 暗黑模式样式
    // =====================
    const DARK_MODE_CSS = `
        body.qqmail-dark-mode {
            /* 基础颜色反转 */
            --base_black: #E8E8E8;
            --base_gray_003: rgba(255, 255, 255, 0.03);
            --base_gray_005: rgba(255, 255, 255, 0.05);
            --base_gray_007: rgba(255, 255, 255, 0.07);
            --base_gray_010: rgba(255, 255, 255, 0.10);
            --base_gray_015: rgba(255, 255, 255, 0.15);
            --base_gray_020: rgba(255, 255, 255, 0.20);
            --base_gray_025: rgba(255, 255, 255, 0.25);
            --base_gray_030: rgba(255, 255, 255, 0.30);
            --base_gray_040: rgba(255, 255, 255, 0.40);
            --base_gray_050: rgba(255, 255, 255, 0.50);
            --base_gray_060: rgba(255, 255, 255, 0.60);
            --base_gray_070: rgba(255, 255, 255, 0.70);
            --base_gray_080: rgba(255, 255, 255, 0.80);
            --base_gray_090: rgba(255, 255, 255, 0.90);
            --base_gray_100: #E8E8E8;

            /* 白色基础 - 转为深色 */
            --base_white_003: rgba(0, 0, 0, 0.03);
            --base_white_005: rgba(0, 0, 0, 0.05);
            --base_white_007: rgba(0, 0, 0, 0.07);
            --base_white_010: rgba(0, 0, 0, 0.10);
            --base_white_015: rgba(0, 0, 0, 0.15);
            --base_white_020: rgba(0, 0, 0, 0.20);
            --base_white_025: rgba(0, 0, 0, 0.25);
            --base_white_030: rgba(0, 0, 0, 0.30);
            --base_white_040: rgba(0, 0, 0, 0.40);
            --base_white_050: rgba(0, 0, 0, 0.50);
            --base_white_060: rgba(0, 0, 0, 0.60);
            --base_white_070: rgba(0, 0, 0, 0.70);
            --base_white_080: rgba(0, 0, 0, 0.80);
            --base_white_090: rgba(0, 0, 0, 0.90);
            --base_white_100: #1E1E1E;

            /* 背景颜色 */
            --bg_gray_web_0: #121212;
            --bg_gray_web_1: #1A1A1A;
            --bg_gray_web_2: #222222;
            --bg_gray_web_3: #2A2A2A;
            --bg_white_web: #1E1E1E;
            --bg_white_web_alpha_090: rgba(30, 30, 30, 0.9);

            /* 遮罩颜色 */
            --mask_gray_030: rgba(0, 0, 0, 0.5);
            --mask_white_030: rgba(255, 255, 255, 0.1);
            --mask_white_095: rgba(30, 30, 30, 0.95);

            /* 其他UI元素 */
            --bg_segmented_control_option_selected: #3A3A3A;
            --bg_switch_grabber: #4A4A4A;
            --button_clearbutton_gray_xmark: #E8E8E8;
            --button_clearbutton_white_xmark: rgba(255, 255, 255, 0.6);
            --bg_panel_blur_stroke: #2A2A2A;
            --bg_invoiceCard_unselected_hover: #2A2A2A;

            /* 阴影调整 */
            --shadow_1: 0 2px 3px 0 rgba(0, 0, 0, 0.3);
            --shadow_2: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
            --shadow_3: 0 6px 9px 0 rgba(0, 0, 0, 0.35);
            --shadow_4: 0 8px 12px 0 rgba(0, 0, 0, 0.35);
            --shadow_5: 0 10px 15px 0 rgba(0, 0, 0, 0.4);
            --shadow_6: 0 12px 18px 0 rgba(0, 0, 0, 0.4);
            --shadow_7: 0 14px 21px 0 rgba(0, 0, 0, 0.45);
            --shadow_8: 0 16px 24px 0 rgba(0, 0, 0, 0.45);
            --shadow_card: 0 8px 16px 0 rgba(0, 0, 0, 0.2);

            /* 滚动条 */
            --color-scroll-bar-bg: rgba(255, 255, 255, 0.2);
            --color-scroll-bar-hover-bg: rgba(255, 255, 255, 0.4);
            --color-scroll-bar-active-bg: rgba(255, 255, 255, 0.5);

            /* 强制背景色 */
            background-color: #121212 !important;
        }

        /* -------------------------------------------
           通用组件修复
           ------------------------------------------- */
        body.qqmail-dark-mode .xm-modal-content,
        body.qqmail-dark-mode .xm-modal-header {
            background-color: #2A2A2A !important;
            color: #E8E8E8 !important;
        }

        body.qqmail-dark-mode .xm-modal-body {
            color: #CCCCCC !important;
        }

        body.qqmail-dark-mode input:not([class*="editor"]),
        body.qqmail-dark-mode textarea:not([class*="editor"]) {
            background-color: #2A2A2A !important;
            color: #E8E8E8 !important;
            border-color: #444444 !important;
        }

        body.qqmail-dark-mode .frame-route-content::before {
            background: #1E1E1E !important;
        }

        /* 邮件内容区域（读信） */
        body.qqmail-dark-mode .mail-detail-content,
        body.qqmail-dark-mode .mail-content-container,
        body.qqmail-dark-mode [class*="mail-content"]:not([contenteditable="true"]),
        body.qqmail-dark-mode [class*="message-body"] {
            background-color: #1E1E1E !important;
            color: #E8E8E8 !important;
        }

        /* 列表项悬停效果 */
        body.qqmail-dark-mode [class*="list-item"]:hover {
            background-color: #2A2A2A !important;
        }

        /* 按钮样式优化 */
        body.qqmail-dark-mode .xmail-ui-btn.ui-btn-them-white {
            background-color: #3A3A3A !important;
            border-color: #555555 !important;
        }

        /* 确保图标可见 */
        body.qqmail-dark-mode .xmail-ui-icon svg {
            fill: currentColor;
        }

        /* 链接颜色保持可读 */
        body.qqmail-dark-mode a {
            color: var(--accent_blue_lighten_2) !important;
        }

        body.qqmail-dark-mode a:visited {
            color: var(--accent_blue_lighten_3) !important;
        }

        /* Iframe 处理:
           仅反转普通读信的 iframe，
           排除编辑器(editor)、写信(compose)相关的 iframe，以免编辑器变黑。
        */
        body.qqmail-dark-mode iframe:not([class*="editor"]):not([id*="editor"]):not([class*="compose"]) {
            filter: invert(0.9) hue-rotate(180deg);
        }

        /* -------------------------------------------
           写信/编辑器区域核心修复 (Keep Light)
           ------------------------------------------- */
        
        /* 目标：.xmail-cmp-editor-content, [contenteditable="true"], .mail-reply-editor-wrap
           强制背景为白色，文字为黑色，恢复 CSS 变量
        */
        body.qqmail-dark-mode .mail-compose-mail-content-editor .mail-content-editor-inner,
        body.qqmail-dark-mode .xmail-cmp-editor-content,
        body.qqmail-dark-mode [contenteditable="true"],
        body.qqmail-dark-mode .mail-reply-editor-wrap .reply-editor-content,
        body.qqmail-dark-mode #contentDiv_0 {
            background-color: #FFFFFF !important;
            color: #000000 !important;
            caret-color: #000000 !important;
            
            /* 在编辑器内部局部重置暗黑模式变量回正常模式 */
            --base_black: #000000;
            --base_gray_100: #000000;
            --base_gray_090: #1a1a1a;
            --base_gray_080: #2b2b2b;
            --base_gray_050: #808080;
        }

        /* 确保编辑器内的所有子元素继承黑色文字，除非有内联样式 */
        body.qqmail-dark-mode .xmail-cmp-editor-content *,
        body.qqmail-dark-mode [contenteditable="true"] * {
            color: inherit; 
        }
        
        /* 修复快捷回复框等输入区域 */
        body.qqmail-dark-mode .mail-reply-editor-wrap {
            border-color: #444 !important; /* 边框保持深色适配主题 */
        }
        
        /* 修复工具栏背景，让它还是暗色，只让"纸张"是白色 */
        body.qqmail-dark-mode .compose-editor-toolbar-wrap {
            background-color: #1E1E1E !important; 
            border-bottom-color: #333 !important;
        }
        body.qqmail-dark-mode .compose-editor-toolbar-wrap::before {
            background: #1E1E1E !important;
        }
    `;

    // =====================
    // 状态管理
    // =====================
    let styleElement = null;
    let menuCommandIds = [];
    let mediaQueryList = null;

    // =====================
    // 工具函数
    // =====================
    function getSettings() {
        return {
            mode: GM_getValue(STORAGE_KEYS.MODE, MODES.MANUAL),
            enabled: GM_getValue(STORAGE_KEYS.ENABLED, false),
            scheduleStart: GM_getValue(STORAGE_KEYS.SCHEDULE_START, '18:00'),
            scheduleEnd: GM_getValue(STORAGE_KEYS.SCHEDULE_END, '06:00')
        };
    }

    function saveSettings(settings) {
        if (settings.mode !== undefined) GM_setValue(STORAGE_KEYS.MODE, settings.mode);
        if (settings.enabled !== undefined) GM_setValue(STORAGE_KEYS.ENABLED, settings.enabled);
        if (settings.scheduleStart !== undefined) GM_setValue(STORAGE_KEYS.SCHEDULE_START, settings.scheduleStart);
        if (settings.scheduleEnd !== undefined) GM_setValue(STORAGE_KEYS.SCHEDULE_END, settings.scheduleEnd);
    }

    function isInSchedule(startTime, endTime) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        // 处理跨午夜的情况
        if (startMinutes <= endMinutes) {
            // 不跨午夜：例如 09:00 - 18:00
            return currentMinutes >= startMinutes && currentMinutes < endMinutes;
        } else {
            // 跨午夜：例如 18:00 - 06:00
            return currentMinutes >= startMinutes || currentMinutes < endMinutes;
        }
    }

    function isDarkModePreferred() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // =====================
    // 暗黑模式控制
    // =====================
    function enableDarkMode() {
        if (!styleElement) {
            styleElement = GM_addStyle(DARK_MODE_CSS);
        }
        document.body?.classList.add('qqmail-dark-mode');
    }

    function disableDarkMode() {
        document.body?.classList.remove('qqmail-dark-mode');
    }

    function updateDarkMode() {
        const settings = getSettings();
        let shouldEnable = false;

        switch (settings.mode) {
            case MODES.MANUAL:
                shouldEnable = settings.enabled;
                break;
            case MODES.AUTO:
                shouldEnable = isDarkModePreferred();
                break;
            case MODES.SCHEDULED:
                shouldEnable = isInSchedule(settings.scheduleStart, settings.scheduleEnd);
                break;
        }

        if (shouldEnable) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    // =====================
    // 菜单管理
    // =====================
    function unregisterAllMenuCommands() {
        menuCommandIds.forEach(id => {
            try {
                GM_unregisterMenuCommand(id);
            } catch (e) {
                // 忽略错误
            }
        });
        menuCommandIds = [];
    }

    function registerMenuCommands() {
        unregisterAllMenuCommands();
        const settings = getSettings();

        // 1. 切换暗黑模式开关（仅手动模式）
        if (settings.mode === MODES.MANUAL) {
            const toggleLabel = settings.enabled ? '🌙 关闭暗黑模式' : '☀️ 开启暗黑模式';
            const id1 = GM_registerMenuCommand(toggleLabel, () => {
                saveSettings({ enabled: !settings.enabled });
                updateDarkMode();
                registerMenuCommands();
            });
            menuCommandIds.push(id1);
        }

        // 2. 模式选择
        const id2 = GM_registerMenuCommand(`⚙️ 当前模式: ${MODE_LABELS[settings.mode]}`, () => {
            // 循环切换模式
            const modes = Object.values(MODES);
            const currentIndex = modes.indexOf(settings.mode);
            const nextIndex = (currentIndex + 1) % modes.length;
            const nextMode = modes[nextIndex];

            saveSettings({ mode: nextMode });
            setupModeListeners();
            updateDarkMode();
            registerMenuCommands();

            // 显示提示
            showToast(`已切换到: ${MODE_LABELS[nextMode]}`);
        });
        menuCommandIds.push(id2);

        // 3. 定时模式设置（仅定时模式）
        if (settings.mode === MODES.SCHEDULED) {
            const id3 = GM_registerMenuCommand(`⏰ 定时: ${settings.scheduleStart} - ${settings.scheduleEnd}`, () => {
                const newStart = prompt('请输入开始时间 (HH:MM):', settings.scheduleStart);
                if (newStart && /^\d{2}:\d{2}$/.test(newStart)) {
                    const newEnd = prompt('请输入结束时间 (HH:MM):', settings.scheduleEnd);
                    if (newEnd && /^\d{2}:\d{2}$/.test(newEnd)) {
                        saveSettings({ scheduleStart: newStart, scheduleEnd: newEnd });
                        updateDarkMode();
                        registerMenuCommands();
                        showToast(`定时已更新: ${newStart} - ${newEnd}`);
                    }
                }
            });
            menuCommandIds.push(id3);
        }

        // 4. 显示当前状态
        const statusLabel = document.body?.classList.contains('qqmail-dark-mode') ? '🌙 暗黑模式已启用' : '☀️ 正常模式';
        const id4 = GM_registerMenuCommand(statusLabel, () => { });
        menuCommandIds.push(id4);
    }

    // =====================
    // 提示消息
    // =====================
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            animation: fadeInOut 2s ease-in-out forwards;
        `;

        // 添加动画样式
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            styleSheet.remove();
        }, 2000);
    }

    // =====================
    // 监听器设置
    // =====================
    function setupModeListeners() {
        const settings = getSettings();

        // 清理旧的监听器
        if (mediaQueryList) {
            mediaQueryList.removeEventListener('change', handleMediaQueryChange);
        }

        // 自动模式：监听系统偏好变化
        if (settings.mode === MODES.AUTO) {
            mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQueryList.addEventListener('change', handleMediaQueryChange);
        }

        // 定时模式：每分钟检查
        if (settings.mode === MODES.SCHEDULED) {
            setInterval(() => {
                updateDarkMode();
            }, 60000);
        }
    }

    function handleMediaQueryChange() {
        updateDarkMode();
        registerMenuCommands();
    }

    // =====================
    // 初始化
    // =====================
    function init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    function onDOMReady() {
        // 预加载样式
        styleElement = GM_addStyle(DARK_MODE_CSS);

        // 设置监听器
        setupModeListeners();

        // 应用暗黑模式
        updateDarkMode();

        // 注册菜单
        registerMenuCommands();

        console.log('[QQ邮箱暗黑模式] 已加载 - 写信区域保持亮色模式');
    }

    // 启动
    init();
})();