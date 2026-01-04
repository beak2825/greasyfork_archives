// ==UserScript==
// @name           解除粘贴限制
// @namespace      https://github.com/Delta-Water
// @version        2.0.2
// @description    允许在CQUPT内网上的代码平台上粘贴文本并通过平台的按键检测
// @author         Delta_Water
// @match          *://172.22.181.82/train/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @license        AGPL-3.0-only
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/552273/%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/552273/%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
/* global monaco */

(function () {
    'use strict';

    /***********************
     * 基本配置
     ***********************/
    const WS_URL = 'ws://127.0.0.1:8765';
    const STORAGE_KEY = 'https://github.com/Delta-Water@allow-CTRL-V';
    const LONG_PRESS_THRESHOLD = 1000;
    const PROJECT_URL = 'https://github.com/Delta-Water/allow-CTRL-V';
    const AUTHOR_URL = 'https://github.com/Delta-Water';
    const PREVIEW_DEMO_CODE = `#include <stdio.h>

int main() {
    for (;;) {
        printf("I am. I loop.\n");
    }
    return 0;
}`;

    // 扩展结构性字符，包含更多编程语言符号
    const STRUCTURAL_CHARS = new Set([
        '{', '}', '(', ')', '[', ']', '#',  // 添加#号
        ';', ':', ',', '.', '<', '>', '=', '!', '&', '|', '^', '~', '%',
        '+', '-', '*', '/', '\\', '\'', '"', '`',
        '\n', '\t'
    ]);

    let ws = null;
    let osConnected = false;
    let wsReconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    let simulationTimer = null;
    let longPressTimer = null;
    let autoReturnTimer = null;
    let isTyping = false;
    let isPaused = false;
    let currentPasteData = '';
    let currentIndex = 0;
    let isConfigUIShown = false;
    let isLongPress = false;
    let previousStatus = "闲置";
    let previewTimer = null;
    let isPreviewRunning = false;
    let savedEditorState = null;

    let settings = {
        baseDelay: 70,
        randomDelay: 40,
        mistakeProb: 0.05,
        intermittentCharCount: 50,
        intermittentDelay: 500,
        useOSKeyboard: true
    };

    /***********************
     * 数据加载与保存
     ***********************/
    function loadSettings() {
        if (typeof GM_getValue === 'function') {
            try {
                const stored = GM_getValue(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    Object.assign(settings, parsed);
                }
            } catch (e) {
                console.error("加载设置失败，使用默认值。", e);
            }
        }
        settings.baseDelay = Math.max(20, Math.min(500, settings.baseDelay));
    }

    function saveSettings() {
        if (typeof GM_getValue === 'function') {
            try {
                GM_setValue(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) {
                console.error("保存设置失败:", e);
            }
        }
    }

    /***********************
     * OS WebSocket 连接管理
     ***********************/
    function initWS() {
        if (!settings.useOSKeyboard || wsReconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            return;
        }

        if (ws) {
            try {
                ws.close();
            } catch (e) {
                console.warn("关闭WebSocket连接时出错:", e);
            }
            ws = null;
        }

        try {
            ws = new WebSocket(WS_URL);
            wsReconnectAttempts++;

            ws.onopen = () => {
                osConnected = true;
                wsReconnectAttempts = 0;
                console.log('[OS] WebSocket连接成功');
                updateSpeedDisplay();
            };

            ws.onclose = () => {
                osConnected = false;
                console.log('[OS] WebSocket连接关闭');
                updateSpeedDisplay();

                // 自动重连
                if (settings.useOSKeyboard && wsReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    setTimeout(() => {
                        console.log(`[OS] 尝试重新连接 (${wsReconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                        initWS();
                    }, 2000);
                }
            };

            ws.onerror = (error) => {
                osConnected = false;
                console.error('[OS] WebSocket连接错误:', error);
                updateSpeedDisplay();
            };

            ws.onmessage = (event) => {
                console.log('[OS] 收到消息:', event.data);
            };

        } catch (error) {
            console.error('[OS] 创建WebSocket连接失败:', error);
            osConnected = false;
            updateSpeedDisplay();
        }
    }

    function osType(ch) {
        if (!osConnected || !ws || ws.readyState !== WebSocket.OPEN) return false;
        try {
            ws.send(JSON.stringify({ type: 'TYPE', text: ch }));
            return true;
        } catch (e) {
            console.error('[OS] 发送数据失败:', e);
            osConnected = false;
            updateSpeedDisplay();
            return false;
        }
    }

    /***********************
     * Monaco 工具 - 修复光标处理
     ***********************/
    function getMonacoEditor() {
        try {
            if (typeof monaco === 'object' && monaco.editor) {
                const focused = monaco.editor.getFocusedEditor ? monaco.editor.getFocusedEditor() : null;
                if (focused) return focused;
                const editors = monaco.editor.getEditors();
                if (editors && editors.length) return editors[0];
            }
        } catch (_) { }
        return null;
    }

    function monacoType(ch) {
        const editor = getMonacoEditor();
        if (!editor) return;

        editor.trigger('tm-smart', 'type', { text: ch });
    }

    function monacoInsertText(ch) {
        const editor = getMonacoEditor();
        if (!editor) return;

        editor.executeEdits('tm-insert', [{
            range: editor.getSelection(),
            text: ch,
            forceMoveMarkers: true
        }]);
    }

    function simulateBackspaceWithMonaco() {
        const editor = getMonacoEditor();
        if (!editor) return false;

        try {
            editor.trigger('tm-script-backspace', 'deleteLeft', {});
            return true;
        } catch (err) {
            console.error("Backspace failed:", err);
            return false;
        }
    }

    // 修复：只在暂停时保存编辑器状态
    function saveEditorState() {
        // 只在暂停时保存状态，用于恢复焦点
        const editor = getMonacoEditor();
        if (!editor || !isTyping) return;

        try {
            savedEditorState = {
                selection: editor.getSelection(),
                position: editor.getPosition(),
                hasTextSelection: !editor.getSelection().isEmpty()
            };
        } catch (e) {
            console.warn("保存编辑器状态失败:", e);
            savedEditorState = null;
        }
    }

    // 修复：只在继续时恢复焦点
    function restoreEditorFocus() {
        if (!savedEditorState) return;

        const editor = getMonacoEditor();
        if (!editor) return;

        try {
            // 如果有文本被选中，保持选中状态
            if (savedEditorState.hasTextSelection) {
                editor.setSelection(savedEditorState.selection);
            } else {
                // 否则恢复光标位置
                editor.setPosition(savedEditorState.position);
            }

            // 确保编辑器获得焦点
            setTimeout(() => {
                try {
                    editor.focus();
                } catch (e) {
                    console.warn("恢复编辑器焦点失败:", e);
                }
            }, 50);

        } catch (e) {
            console.warn("恢复编辑器状态失败:", e);
        }
    }

    /***********************
     * 核心：智能单字符输入 - 修复光标处理
     ***********************/
    function typeOneChar(ch) {
        // 结构性字符交给 Monaco
        if (STRUCTURAL_CHARS.has(ch)) {
            monacoType(ch);
            return;
        }

        // 普通字符：OS 优先，如果没有OS连接则使用Monaco
        if (settings.useOSKeyboard && osConnected) {
            if (!osType(ch)) {
                // OS输入失败，回退到Monaco
                monacoInsertText(ch);
            }
        } else {
            monacoInsertText(ch);
        }
    }

    /***********************
     * 模拟输入核心逻辑（带错误模拟）
     ***********************/
    function randDelay() {
        return settings.baseDelay + Math.floor(Math.random() * settings.randomDelay);
    }

    async function typeTextSimulationRecursive() {
        if (!isTyping || isPaused) return;

        if (currentIndex >= currentPasteData.length) {
            simulationTimer = null;
            isTyping = false;
            isPaused = false;
            savedEditorState = null; // 输入完成后清理保存的状态
            updateSpeedDisplay("完成");
            return;
        }

        const char = currentPasteData[currentIndex];
        let nextDelay = randDelay();

        if (settings.intermittentCharCount > 0 && settings.intermittentDelay > 0 &&
            currentIndex > 0 && currentIndex % settings.intermittentCharCount === 0) {
            nextDelay += settings.intermittentDelay;
        }

        if (Math.random() < settings.mistakeProb) {
            const mistakeChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);

            // 1. 插入错误字符
            typeOneChar(mistakeChar);

            // 2. 短暂延迟后，执行回删和插入正确字符
            simulationTimer = setTimeout(() => {
                if (!isTyping || isPaused) return;

                // 3. 回删错误的字符
                simulateBackspaceWithMonaco();

                // 4. 插入正确的字符
                typeOneChar(char);
                currentIndex++;

                updateSpeedDisplay(`输入中... (${currentIndex}/${currentPasteData.length})`);

                // 5. 继续下一个循环
                simulationTimer = setTimeout(typeTextSimulationRecursive, nextDelay);
            }, settings.baseDelay / 2);

        } else {
            // 正常插入字符
            typeOneChar(char);
            currentIndex++;
            updateSpeedDisplay(`输入中... (${currentIndex}/${currentPasteData.length})`);
            simulationTimer = setTimeout(typeTextSimulationRecursive, nextDelay);
        }
    }

    function stopSimulation(forceStop = false) {
        if (simulationTimer) {
            clearTimeout(simulationTimer);
            simulationTimer = null;
        }

        if (forceStop || (isTyping && isPaused)) {
            isTyping = false;
            isPaused = false;
            currentPasteData = '';
            currentIndex = 0;
            savedEditorState = null; // 强制停止时清理保存的状态
            updateSpeedDisplay("已中断 (长按ESC)");
        } else if (isTyping && !isPaused) {
            // 暂停时保存编辑器状态（只在这里保存）
            saveEditorState();
            isPaused = true;
            updateSpeedDisplay("已暂停 (按ESC继续)");
        }
    }

    async function continueSimulation() {
        if (isTyping && isPaused) {
            // 恢复时重新聚焦编辑器
            isPaused = false;
            updateSpeedDisplay("输入中...");

            // 短暂延迟后恢复焦点
            setTimeout(() => {
                restoreEditorFocus();
            }, 50);

            typeTextSimulationRecursive();
        }
    }

    /***********************
     * 格式化剪贴板文本
     ***********************/
    function formatClipboardText(text) {
        return text.replace(/\r\n/g, '\n');
    }

    /***********************
     * UI 控制 - 紧凑设计
     ***********************/
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'tm_style';
        style.textContent = `
            /* 紧凑状态显示 */
            #tm_speed_display {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: linear-gradient(145deg, #2d3748, #1a202c);
                color: #e2e8f0;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 11px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow:
                    0 3px 8px rgba(0, 0, 0, 0.15),
                    0 1px 2px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
                line-height: 1.3;
                min-width: 200px;
                backdrop-filter: blur(4px);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #tm_speed_display:hover {
                transform: translateY(-1px);
                box-shadow:
                    0 4px 12px rgba(0, 0, 0, 0.2),
                    0 1px 2px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
            }

            .tm_status_header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                padding-bottom: 5px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .tm_status_title {
                font-weight: 600;
                color: #63b3ed;
                font-size: 12px;
                letter-spacing: 0.2px;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .tm_status_title:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #4299e1, #3182ce);
                border-radius: 2px;
            }

            .tm_config_btn {
                width: 20px;
                height: 20px;
                background: rgba(66, 153, 225, 0.15);
                border: 1px solid rgba(66, 153, 225, 0.25);
                border-radius: 3px;
                color: #63b3ed;
                cursor: pointer;
                font-size: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                padding: 0;
                line-height: 1;
            }

            .tm_config_btn:hover {
                background: rgba(66, 153, 225, 0.25);
                transform: rotate(90deg);
                border-color: rgba(66, 153, 225, 0.4);
            }

            .tm_status_grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px 8px;
                margin-bottom: 6px;
            }

            .tm_status_item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .tm_status_label {
                color: #a0aec0;
                font-size: 10px;
                font-weight: 500;
            }

            .tm_status_value {
                color: #fff;
                font-weight: 600;
                font-size: 10px;
                padding: 1px 6px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 2px;
                min-width: 60px;
                text-align: center;
            }

            .tm_status_connected {
                color: #68d391 !important;
                background: rgba(104, 211, 145, 0.1);
            }

            .tm_status_disconnected {
                color: #fc8181 !important;
                background: rgba(252, 129, 129, 0.1);
            }

            .tm_status_disabled {
                color: #a0aec0 !important;
                background: rgba(160, 174, 192, 0.1);
            }

            .tm_status_main {
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-weight: 600;
                color: #f6e05e;
                font-size: 11px;
                text-align: center;
                padding: 3px 6px;
                background: rgba(246, 224, 94, 0.1);
                border-radius: 3px;
            }

            /* 紧凑配置界面 */
            #tm_config_ui {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 1px solid #cbd5e0;
                border-radius: 8px;
                padding: 16px;
                z-index: 10001;
                width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }

            #tm_config_ui h3 {
                margin: 0 0 14px 0;
                padding: 0 0 10px 0;
                font-size: 14px;
                color: #2d3748;
                font-weight: 600;
                border-bottom: 2px solid #4299e1;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            #tm_config_ui h3:before {
                content: "";
                display: inline-block;
                width: 14px;
                height: 14px;
                background: linear-gradient(45deg, #4299e1, #3182ce);
                border-radius: 2px;
            }

            .tm_setting_section {
                margin: 12px 0;
                background: white;
                padding: 14px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }

            .tm_setting_title {
                font-weight: 600;
                color: #4a5568;
                margin-bottom: 10px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 5px;
                padding-bottom: 6px;
                border-bottom: 1px solid #e2e8f0;
            }

            .tm_setting_title:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #4c51bf, #434190);
                border-radius: 2px;
            }

            .tm_setting_row {
                display: flex;
                align-items: center;
                margin: 8px 0;
                gap: 10px;
            }

            .tm_setting_label {
                flex: 1;
                color: #718096;
                font-size: 11px;
                min-width: 100px;
            }

            .tm_setting_value {
                width: 60px;
                text-align: right;
                font-weight: 600;
                color: #2d3748;
                font-size: 11px;
                font-variant-numeric: tabular-nums;
            }

            input[type="range"] {
                flex: 2;
                height: 5px;
                margin: 0 8px;
                background: #e2e8f0;
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
                transition: background 0.2s;
            }

            input[type="range"]:hover {
                background: #cbd5e0;
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(45deg, #4299e1, #3182ce);
                cursor: pointer;
                box-shadow: 0 2px 3px rgba(66, 153, 225, 0.4);
                border: 2px solid white;
                transition: transform 0.2s;
            }

            input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }

            input[type="number"] {
                width: 70px;
                padding: 5px 8px;
                border: 1px solid #cbd5e0;
                border-radius: 4px;
                font-size: 11px;
                text-align: center;
                transition: all 0.2s;
                font-variant-numeric: tabular-nums;
            }

            input[type="number"]:focus {
                border-color: #4299e1;
                outline: none;
                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
            }

            .tm_checkbox_row {
                display: flex;
                align-items: center;
                margin: 12px 0;
                padding: 10px 12px;
                background: #f8fafc;
                border-radius: 5px;
                border: 1px solid #e2e8f0;
            }

            .tm_checkbox_row input[type="checkbox"] {
                width: 14px;
                height: 14px;
                margin-right: 8px;
                border-radius: 3px;
                border: 2px solid #cbd5e0;
                transition: all 0.2s;
                cursor: pointer;
            }

            .tm_checkbox_row input[type="checkbox"]:checked {
                background-color: #4299e1;
                border-color: #4299e1;
            }

            .tm_checkbox_label {
                color: #4a5568;
                font-weight: 500;
                flex: 1;
                font-size: 12px;
            }

            /* 连接状态显示 */
            .tm_connection_status {
                margin: 8px 0;
                padding: 8px 10px;
                border-radius: 5px;
                font-size: 11px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .tm_connection_status.connected {
                background: rgba(104, 211, 145, 0.1);
                color: #38a169;
                border: 1px solid rgba(104, 211, 145, 0.2);
            }

            .tm_connection_status.disconnected {
                background: rgba(252, 129, 129, 0.1);
                color: #e53e3e;
                border: 1px solid rgba(252, 129, 129, 0.2);
            }

            .tm_connection_status.disabled {
                display: none;
            }

            .tm_connection_status:before {
                content: "";
                display: inline-block;
                width: 7px;
                height: 7px;
                border-radius: 50%;
            }

            .tm_connection_status.connected:before {
                background: #38a169;
                box-shadow: 0 0 6px rgba(56, 161, 105, 0.5);
            }

            .tm_connection_status.disconnected:before {
                background: #e53e3c;
            }

            /* 作者信息和项目地址 */
            .tm_author_info {
                margin: 8px 0;
                padding: 6px 8px;
                background: rgba(66, 153, 225, 0.05);
                border-radius: 4px;
                border: 1px solid rgba(66, 153, 225, 0.1);
                font-size: 10px;
                color: #4a5568;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
            }

            .tm_author_info a {
                color: #3182ce;
                text-decoration: none;
                font-weight: 500;
                padding: 2px 6px;
                border-radius: 3px;
                transition: all 0.2s;
            }

            .tm_author_info a:hover {
                color: #2c5282;
                text-decoration: underline;
                background: rgba(66, 153, 225, 0.1);
            }

            .tm_project_link {
                margin: 10px 0;
                padding: 8px 10px;
                background: rgba(66, 153, 225, 0.1);
                border-radius: 5px;
                border: 1px solid rgba(66, 153, 225, 0.2);
                font-size: 11px;
                display: none; /* 默认隐藏 */
            }

            .tm_project_link.visible {
                display: block;
            }

            .tm_project_link a {
                color: #3182ce;
                text-decoration: none;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 11px;
            }

            .tm_project_link a:hover {
                color: #2c5282;
                text-decoration: underline;
            }

            .tm_project_link a:before {
                content: "🔗";
                font-size: 12px;
            }

            /* 紧凑预览区域 */
            #tm_preview_area {
                margin: 14px 0;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #cbd5e0;
                background: #1a202c;
                box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.2);
            }

            #tm_preview_header {
                background: linear-gradient(135deg, #2d3748, #4a5568);
                padding: 10px 12px;
                border-bottom: 1px solid #4a5568;
                font-size: 11px;
                font-weight: 600;
                color: #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .preview-header-text {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .preview-header-text:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #ed8936, #dd6b20);
                border-radius: 2px;
            }

            #tm_preview_editor {
                width: 100%;
                height: 140px;
                padding: 12px;
                font-family: 'Consolas', 'Monaco', 'Cascadia Code', 'JetBrains Mono', monospace;
                font-size: 12px;
                border: none;
                resize: none;
                outline: none;
                box-sizing: border-box;
                background: #1a202c;
                color: #cbd5e0;
                line-height: 1.5;
                tab-size: 4;
                letter-spacing: 0.2px;
            }

            .preview-status {
                font-size: 10px;
                color: #a0aec0;
                padding: 3px 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
                margin-left: 8px;
                font-variant-numeric: tabular-nums;
                min-width: 90px;
                text-align: center;
            }

            .preview-running {
                color: #68d391 !important;
                background: rgba(104, 211, 145, 0.1);
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            /* 按钮区域 */
            .tm_button_row {
                display: flex;
                gap: 10px;
                margin-top: 16px;
            }

            #tm_close_save_btn {
                flex: 1;
                padding: 8px 0;
                background: linear-gradient(135deg, #4299e1, #3182ce);
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                letter-spacing: 0.3px;
            }

            #tm_close_save_btn:before {
                content: "";
                display: inline-block;
                width: 12px;
                height: 12px;
                background: linear-gradient(45deg, white, #e2e8f0);
                border-radius: 2px;
                margin-right: 2px;
            }

            #tm_close_save_btn:hover {
                background: linear-gradient(135deg, #3182ce, #2b6cb0);
                transform: translateY(-1px);
                box-shadow: 0 3px 8px rgba(49, 130, 206, 0.3);
            }

            #tm_close_save_btn:active {
                transform: translateY(0);
            }

            /* 演示按钮 */
            #tm_preview_demo_btn {
                background: linear-gradient(135deg, #ed8936, #dd6b20);
                color: white;
                border: none;
                border-radius: 5px;
                padding: 6px 12px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 5px;
                letter-spacing: 0.2px;
            }

            #tm_preview_demo_btn:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, white, #fed7d7);
                border-radius: 2px;
                margin-right: 2px;
            }

            #tm_preview_demo_btn:hover {
                background: linear-gradient(135deg, #dd6b20, #c05621);
                transform: translateY(-1px);
                box-shadow: 0 3px 6px rgba(237, 137, 54, 0.3);
            }

            #tm_preview_demo_btn.running {
                background: linear-gradient(135deg, #f56565, #e53e3e);
            }

            #tm_preview_demo_btn.running:before {
                background: linear-gradient(45deg, white, #fed7d7);
                transform: rotate(90deg);
            }

            /* 快捷键提示 */
            .tm_hotkey_hint {
                font-size: 10px;
                color: #718096;
                margin-top: 14px;
                padding-top: 10px;
                border-top: 1px solid #e2e8f0;
                line-height: 1.5;
            }

            .tm_hotkey_hint strong {
                color: #4a5568;
                font-weight: 600;
                margin-bottom: 3px;
                display: block;
            }

            .tm_hotkey_hint kbd {
                background: #edf2f7;
                border: 1px solid #cbd5e0;
                border-radius: 3px;
                padding: 1px 5px;
                font-family: 'Consolas', monospace;
                font-size: 10px;
                margin: 0 2px;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
                color: #4a5568;
            }

            /* 遮罩层 */
            .tm_overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                backdrop-filter: blur(2px);
            }
        `;
        document.head.appendChild(style);
    }

    function updateSpeedDisplay(status) {
        if (typeof status === 'undefined') {
            status = isTyping ? (isPaused ? "已暂停" : "输入中...") : "闲置";
        }

        let display = document.getElementById('tm_speed_display');

        if (autoReturnTimer) {
            clearTimeout(autoReturnTimer);
            autoReturnTimer = null;
        }

        if (!display) {
            display = document.createElement('div');
            display.id = 'tm_speed_display';
            document.body.appendChild(display);
        }

        const statusType = typeof status === 'string' ? status.split('(')[0].trim() : "闲置";
        let tempStatus = status;

        if (statusType === '输入中...') {
            // 保持显示
        } else if (statusType === '已暂停') {
            tempStatus = `${status}`;
        } else if (["完成", "已中断"].includes(statusType)) {
            autoReturnTimer = setTimeout(() => {
                updateSpeedDisplay("闲置");
            }, 2000);
        }

        let osStatus, osStatusClass;
        if (settings.useOSKeyboard) {
            osStatus = osConnected ? "已连接" : "未连接";
            osStatusClass = osConnected ? "tm_status_connected" : "tm_status_disconnected";
        } else {
            osStatus = "已禁用";
            osStatusClass = "tm_status_disabled";
        }

        display.innerHTML = `
            <div class="tm_status_header">
                <div class="tm_status_title">智能模拟输入</div>
                <button class="tm_config_btn" id="tm_config_btn" title="配置">⚙</button>
            </div>
            <div class="tm_status_grid">
                <div class="tm_status_item">
                    <span class="tm_status_label">延迟</span>
                    <span class="tm_status_value">${settings.baseDelay}ms</span>
                </div>
                <div class="tm_status_item">
                    <span class="tm_status_label">随机</span>
                    <span class="tm_status_value">±${settings.randomDelay}ms</span>
                </div>
                <div class="tm_status_item">
                    <span class="tm_status_label">OS输入</span>
                    <span class="tm_status_value ${osStatusClass}">${osStatus}</span>
                </div>
                <div class="tm_status_item">
                    <span class="tm_status_label">错误率</span>
                    <span class="tm_status_value">${(settings.mistakeProb * 100).toFixed(0)}%</span>
                </div>
            </div>
            <div class="tm_status_main">${tempStatus}</div>
        `;

        const configBtn = document.getElementById('tm_config_btn');
        if (configBtn) {
            configBtn.addEventListener('click', showConfigUI);
        }
    }

    /***********************
     * 真正的预览演示功能
     ***********************/
    function simulatePreviewInput() {
        const previewEditor = document.getElementById('tm_preview_editor');
        const previewStatus = document.getElementById('preview_status');
        const demoBtn = document.getElementById('tm_preview_demo_btn');

        if (!previewEditor || isPreviewRunning) {
            stopPreviewDemo();
            return;
        }

        isPreviewRunning = true;
        previewEditor.value = '';
        demoBtn.classList.add('running');
        demoBtn.innerHTML = '停止演示';

        let index = 0;
        let errorCount = 0;
        let lastErrorIndex = -1;

        function randPreviewDelay() {
            return settings.baseDelay + Math.floor(Math.random() * settings.randomDelay);
        }

        function typePreviewChar() {
            if (!isPreviewRunning || index >= PREVIEW_DEMO_CODE.length) {
                stopPreviewDemo();
                previewStatus.textContent = '演示完成';
                previewStatus.classList.remove('preview-running');
                return;
            }

            const char = PREVIEW_DEMO_CODE[index];
            let nextDelay = randPreviewDelay();

            // 更新状态
            previewStatus.textContent = `输入中... (${index + 1}/${PREVIEW_DEMO_CODE.length})`;
            previewStatus.classList.add('preview-running');

            // 模拟间歇性延迟
            if (settings.intermittentCharCount > 0 && settings.intermittentDelay > 0 &&
                index > 0 && index % settings.intermittentCharCount === 0) {
                nextDelay += settings.intermittentDelay;
                previewStatus.textContent = `暂停中... (${index + 1}/${PREVIEW_DEMO_CODE.length})`;
            }

            // 模拟打错字
            if (Math.random() < settings.mistakeProb && lastErrorIndex !== index) {
                const mistakeChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
                previewEditor.value += mistakeChar;
                errorCount++;
                lastErrorIndex = index;

                // 短暂延迟后修正
                setTimeout(() => {
                    if (!isPreviewRunning) return;
                    previewEditor.value = previewEditor.value.slice(0, -1);
                    previewEditor.value += char;
                    index++;
                    previewEditor.scrollTop = previewEditor.scrollHeight;
                    previewTimer = setTimeout(typePreviewChar, nextDelay);
                }, settings.baseDelay / 2);
            } else {
                previewEditor.value += char;
                previewEditor.scrollTop = previewEditor.scrollHeight;
                index++;
                previewTimer = setTimeout(typePreviewChar, nextDelay);
            }
        }

        typePreviewChar();
    }

    function stopPreviewDemo() {
        isPreviewRunning = false;
        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }

        const demoBtn = document.getElementById('tm_preview_demo_btn');
        const previewStatus = document.getElementById('preview_status');

        if (demoBtn) {
            demoBtn.classList.remove('running');
            demoBtn.innerHTML = '开始演示';
        }

        if (previewStatus) {
            previewStatus.textContent = '准备演示';
            previewStatus.classList.remove('preview-running');
        }
    }

    async function showConfigUI() {
        if (isTyping && !isPaused) return;

        previousStatus = isTyping ? (isPaused ? "已暂停" : "输入中...") : "闲置";

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'tm_overlay';
        overlay.addEventListener('click', () => {
            document.getElementById('tm_close_save_btn')?.click();
        });
        document.body.appendChild(overlay);

        let ui = document.getElementById('tm_config_ui');
        if (ui) {
            ui.remove();
            document.querySelector('.tm_overlay')?.remove();
        }

        ui = document.createElement('div');
        ui.id = 'tm_config_ui';
        isConfigUIShown = true;

        // 只在启用OS键盘时显示连接状态
        const showConnectionStatus = settings.useOSKeyboard;
        const connectionStatusClass = showConnectionStatus ?
            (osConnected ? 'connected' : 'disconnected') : 'disabled';
        const connectionStatusText = osConnected ?
            `OS键盘连接正常` :
            `OS键盘未连接`;

        // 只在启用OS键盘且未连接时显示项目地址引导
        const showProjectLink = settings.useOSKeyboard && !osConnected;

        ui.innerHTML = `
            <h3>智能模拟输入配置</h3>

            ${showConnectionStatus ? `
            <div class="tm_connection_status ${connectionStatusClass}">
                ${connectionStatusText}
            </div>
            ` : ''}

            ${showProjectLink ? `
            <div class="tm_project_link visible">
                <a href="${PROJECT_URL}" target="_blank" title="访问项目地址">
                    需要启动本地OS键盘服务？请查看项目说明
                </a>
            </div>
            ` : ''}

            <div class="tm_setting_section">
                <div class="tm_setting_title">输入速度设置</div>

                <div class="tm_setting_row">
                    <span class="tm_setting_label">基础延迟</span>
                    <input type="range" id="baseDelayRange" min="20" max="200" step="5" value="${settings.baseDelay}">
                    <span class="tm_setting_value" id="baseDelayValue">${settings.baseDelay}ms</span>
                </div>

                <div class="tm_setting_row">
                    <span class="tm_setting_label">随机延迟</span>
                    <input type="range" id="randomDelayRange" min="0" max="50" step="5" value="${settings.randomDelay}">
                    <span class="tm_setting_value" id="randomDelayValue">±${settings.randomDelay}ms</span>
                </div>

                <div class="tm_setting_row">
                    <span class="tm_setting_label">错误概率</span>
                    <input type="range" id="mistakeProbRange" min="0" max="20" step="1" value="${settings.mistakeProb * 100}">
                    <span class="tm_setting_value" id="mistakeProbValue">${(settings.mistakeProb * 100).toFixed(0)}%</span>
                </div>
            </div>

            <div class="tm_setting_section">
                <div class="tm_setting_title">间歇性设置</div>

                <div class="tm_setting_row">
                    <span class="tm_setting_label">每输入字符数</span>
                    <input type="number" id="charCount" min="0" max="200" value="${settings.intermittentCharCount}">
                    <span class="tm_setting_label">个字符后暂停</span>
                </div>

                <div class="tm_setting_row">
                    <span class="tm_setting_label">暂停时间</span>
                    <input type="number" id="delayTime" min="0" max="2000" value="${settings.intermittentDelay}">
                    <span class="tm_setting_label">毫秒</span>
                </div>
            </div>

            <div class="tm_checkbox_row">
                <input type="checkbox" id="useOSKeyboard" ${settings.useOSKeyboard ? 'checked' : ''}>
                <span class="tm_checkbox_label">启用OS键盘输入 (需要本地WebSocket服务)</span>
            </div>

            <div id="tm_preview_area">
                <div id="tm_preview_header">
                    <div class="preview-header-text">实时演示效果</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span id="preview_status" class="preview-status">准备演示</span>
                        <button id="tm_preview_demo_btn">开始演示</button>
                    </div>
                </div>
                <textarea id="tm_preview_editor" readonly></textarea>
            </div>

            <div class="tm_author_info">
                <a href="${AUTHOR_URL}" target="_blank" title="查看作者资料">
                    Delta_Water
                </a>
                |
                <a href="${PROJECT_URL}" target="_blank" title="访问项目地址">
                    项目地址
                </a>
            </div>

            <div class="tm_hotkey_hint">
                <strong>快捷键说明</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; margin-top: 3px;">
                    <div><kbd>ESC</kbd> 暂停/继续输入</div>
                    <div><kbd>长按ESC</kbd> 强制中断</div>
                </div>
            </div>

            <div class="tm_button_row">
                <button id="tm_close_save_btn">保存并关闭</button>
            </div>
        `;

        document.body.appendChild(ui);

        // 绑定滑块事件
        const bindRange = (id, settingKey, valueId, suffix, factor = 1) => {
            const range = document.getElementById(id);
            const value = document.getElementById(valueId);
            range.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                settings[settingKey] = val / factor;
                value.textContent = settingKey === 'mistakeProb' ? `${val}%` : `${val}${suffix}`;
                stopPreviewDemo(); // 更改设置时停止演示
            });
        };

        bindRange('baseDelayRange', 'baseDelay', 'baseDelayValue', 'ms');
        bindRange('randomDelayRange', 'randomDelay', 'randomDelayValue', 'ms');
        bindRange('mistakeProbRange', 'mistakeProb', 'mistakeProbValue', '', 100);

        // 监听OS键盘复选框变化
        const osKeyboardCheckbox = document.getElementById('useOSKeyboard');
        if (osKeyboardCheckbox) {
            osKeyboardCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                settings.useOSKeyboard = isChecked;

                // 更新UI显示
                updateUIForOSKeyboard(isChecked);
            });
        }

        // 更新UI的辅助函数
        function updateUIForOSKeyboard(isEnabled) {
            const connectionStatusDiv = document.querySelector('.tm_connection_status');
            const projectLinkDiv = document.querySelector('.tm_project_link');

            if (isEnabled) {
                // 显示连接状态
                if (!connectionStatusDiv) {
                    const newConnectionDiv = document.createElement('div');
                    newConnectionDiv.className = `tm_connection_status ${osConnected ? 'connected' : 'disconnected'}`;
                    newConnectionDiv.innerHTML = osConnected ?
                        `OS键盘连接正常` :
                        `OS键盘未连接`;

                    // 插入到标题后面
                    const h3 = document.querySelector('h3');
                    h3.insertAdjacentElement('afterend', newConnectionDiv);
                } else {
                    connectionStatusDiv.className = `tm_connection_status ${osConnected ? 'connected' : 'disconnected'}`;
                    connectionStatusDiv.innerHTML = osConnected ?
                        `OS键盘连接正常` :
                        `OS键盘未连接`;
                }

                // 更新项目地址显示
                const shouldShowProjectLink = !osConnected;
                if (projectLinkDiv) {
                    projectLinkDiv.classList.toggle('visible', shouldShowProjectLink);
                } else if (shouldShowProjectLink) {
                    // 创建项目地址引导
                    const newProjectLink = document.createElement('div');
                    newProjectLink.className = 'tm_project_link visible';
                    newProjectLink.innerHTML = `
                        <a href="${PROJECT_URL}" target="_blank" title="访问项目地址">
                            需要启动本地OS键盘服务？请查看项目说明
                        </a>
                    `;

                    const currentConnectionDiv = document.querySelector('.tm_connection_status');
                    currentConnectionDiv.insertAdjacentElement('afterend', newProjectLink);
                }
            } else {
                // 隐藏连接状态和项目地址
                if (connectionStatusDiv) {
                    connectionStatusDiv.remove();
                }
                if (projectLinkDiv) {
                    projectLinkDiv.remove();
                }
            }

            updateSpeedDisplay();
        }

        // 绑定演示按钮
        const demoBtn = document.getElementById('tm_preview_demo_btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', simulatePreviewInput);
        }

        // 绑定关闭保存按钮
        document.getElementById('tm_close_save_btn').addEventListener('click', async () => {
            // 停止演示
            stopPreviewDemo();

            // 保存设置
            settings.intermittentCharCount = parseInt(document.getElementById('charCount').value) || 0;
            settings.intermittentDelay = parseInt(document.getElementById('delayTime').value) || 0;
            settings.useOSKeyboard = document.getElementById('useOSKeyboard').checked;

            saveSettings();

            // 如果启用了OS键盘，重新初始化连接
            if (settings.useOSKeyboard) {
                initWS();
            } else if (ws) {
                // 如果禁用了OS键盘，关闭现有连接
                try {
                    ws.close();
                } catch (e) {
                    console.warn("关闭WebSocket连接时出错:", e);
                }
                ws = null;
                osConnected = false;
            }

            isConfigUIShown = false;
            ui.remove();
            overlay.remove();

            // 恢复编辑器焦点
            setTimeout(() => {
                const editor = getMonacoEditor();
                if (editor) {
                    editor.focus();
                }
            }, 100);

            updateSpeedDisplay(previousStatus);
        });
    }

    /***********************
     * 事件处理
     ***********************/
    function handleGlobalKeydown(e) {
        if (isConfigUIShown) {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('tm_close_save_btn')?.click();
                return;
            }
        }

        if (e.target.closest('#tm_config_ui')) return;

        if (e.key === 'Escape' && isTyping) {
            if (longPressTimer === null) {
                isLongPress = false;
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    stopSimulation(true);
                    longPressTimer = null;
                }, LONG_PRESS_THRESHOLD);
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function handleGlobalKeyup(e) {
        if (isConfigUIShown) return;

        if (e.key === 'Escape') {
            if (longPressTimer !== null) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            if (isTyping && !isLongPress) {
                if (!isPaused) {
                    stopSimulation();
                } else {
                    continueSimulation();
                }
            }

            isLongPress = false;
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /***********************
     * 粘贴处理 - 修复光标处理
     ***********************/
    document.addEventListener('paste', async function(e) {
        if (e.target.closest('#tm_config_ui')) return;

        // 阻止默认粘贴行为，我们自己处理模拟输入
        e.preventDefault();
        e.stopPropagation();

        const pasteData = (e.clipboardData || window.clipboardData)?.getData('text');
        if (!pasteData) return;

        // 停止任何正在进行的输入
        if (isTyping) {
            stopSimulation(true);
        }

        // 开始新的模拟输入
        currentPasteData = formatClipboardText(pasteData);

        currentIndex = 0;
        isTyping = true;
        isPaused = false;
        savedEditorState = null; // 开始新的输入时清除保存的状态

        if (simulationTimer) clearTimeout(simulationTimer);
        updateSpeedDisplay("开始输入...");
        typeTextSimulationRecursive();
    }, true);

    /***********************
     * 初始化
     ***********************/
    function init() {
        loadSettings();
        addStyles();

        // 简化粘贴处理
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                // 允许正常的粘贴操作
                e.stopPropagation();
            }
        }, true);

        document.addEventListener('keydown', handleGlobalKeydown, true);
        document.addEventListener('keyup', handleGlobalKeyup, true);

        // 初始化WebSocket连接
        if (settings.useOSKeyboard) {
            initWS();
        }
        updateSpeedDisplay("闲置");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();
