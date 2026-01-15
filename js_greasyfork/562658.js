// ==UserScript==
// @name         AI Multi-Window Chat
// @name:zh-CN   AI 多窗口对话
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Multi-window AI assistant using OpenAI-compatible APIs
// @description:zh-CN  支持多窗口对话的AI助手，使用OpenAI兼容接口
// @author       wenrizc
// @license MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562658/AI%20Multi-Window%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/562658/AI%20Multi-Window%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== i18n =====
    const i18n = {
        en: {
            extName: "AI Multi-Window Chat",
            popup__title: "AI Assistant",
            popup__tabConfig: "Config",
            popup__tabHistory: "History",
            popup__tabPrompts: "Prompts",
            popup__sectionApiConfig: "API Configuration",
            popup__labelApiUrl: "API URL",
            popup__labelApiKey: "API Key",
            popup__labelModelName: "Model Name",
            popup__labelProfileName: "Name",
            popup__placeholderProfileName: "Profile name",
            popup__labelActiveProfile: "Default",
            popup__placeholderApiUrl: "https://api.openai.com/v1",
            popup__placeholderApiKey: "",
            popup__placeholderModelName: "",
            popup__btnSaveConfig: "Save Config",
            popup__btnAddProfile: "New",
            popup__btnSaveProfile: "Save",
            popup__btnDeleteProfile: "Delete",
            popup__btnSetActive: "Set Current",
            popup__btnTestConnection: "Test",
            popup__btnShowKey: "Show",
            popup__btnHideKey: "Hide",
            popup__btnCopyKey: "Copy",
            popup__statusSaved: "Configuration saved",
            popup__statusError: "Save failed, please check your input",
            popup__statusDeleted: "Profile deleted",
            popup__statusCopied: "API key copied",
            popup__statusTestSuccess: "Connection OK",
            popup__statusTestFailed: "Connection failed: $1$",
            popup__statusTestTimeout: "Timeout",
            popup__statusSetActive: "Current profile updated",
            popup__confirmDeleteProfile: 'Delete profile "$1$"?',
            popup__profileNameEmpty: "Untitled",
            popup__defaultProfileName: "Profile $1$",
            popup__presetOpenAI: "OpenAI",
            popup__presetDeepSeek: "DeepSeek",
            popup__presetQwen: "Qwen",
            chat__welcome: "Start Chatting",
            chat__welcomeHint: "Enter a question to start chatting with AI",
            chat__placeholderInput: "Enter your question...",
            chat__btnSend: "Send",
            chat__thinking: "AI is thinking...",
            chat__windowTitle: "Window $1$",
            chat__roleUser: "User",
            chat__roleAI: "AI",
            content__toolbarChat: "Discuss in a new chat window",
            content__toolbarBtnChat: "AI Chat",
            content__btnMinimize: "Minimize",
            content__btnClose: "Close",
            common__loading: "Loading...",
            common__error: "Error",
            common__success: "Success",
            common__cancel: "Cancel",
            common__confirm: "Confirm",
            prompt__empty: "No prompts yet",
            prompt__labelName: "Name",
            prompt__labelContent: "Content",
            prompt__placeholderName: "Prompt name",
            prompt__placeholderContent: "Enter prompt content...",
            prompt__btnAdd: "New",
            prompt__btnSave: "Save",
            prompt__btnDelete: "Delete",
            prompt__defaultLabel: "Default",
            prompt__noPrompt: "No Prompt",
            prompt__statusSaved: "Prompt saved",
            prompt__statusDeleted: "Prompt deleted",
            prompt__statusDefaultSet: "Default prompt updated",
            prompt__confirmDelete: 'Delete prompt "$1$"?',
            prompt__defaultName: "Prompt $1$",
            history__title: "Chat History",
            history__empty: "No chat history yet",
            history__btnExportAll: "Export All",
            history__btnClearHistory: "Clear History",
            history__btnView: "View",
            history__btnExport: "Export",
            history__btnDelete: "Delete",
            history__messageCount: "$1$ messages",
            history__confirmDeleteAll: "Are you sure you want to clear all history?",
            history__confirmDeleteItem: 'Are you sure you want to delete chat "$1$"?',
            history__successDeleted: "Chat deleted",
            history__errorDeleted: "Delete failed",
            history__successCleared: "History cleared",
            history__successExported: "Export successful",
            history__errorExported: "Export failed",
            error__apiConfigMissing: "API config missing. Please add a profile and set it as current.",
            error__emptyApiResponse: "Empty response from API. Please try again.",
            config__btnExport: "Export",
            config__btnImport: "Import",
            config__errorNoProfiles: "No profiles to export",
            config__errorNoPrompts: "No prompts to export",
            config__errorInvalidFormat: "Invalid file format",
            config__statusExported: "Exported $1$ items",
            config__statusImported: "Added $1$, updated $2$ items",
            menu__openSettings: "⚙️ Open Settings"
        },
        zh: {
            extName: "AI 多窗口对话",
            popup__title: "AI 助手",
            popup__tabConfig: "配置",
            popup__tabHistory: "历史记录",
            popup__tabPrompts: "提示词",
            popup__sectionApiConfig: "API 配置",
            popup__labelApiUrl: "API 地址",
            popup__labelApiKey: "API 密钥",
            popup__labelModelName: "模型名称",
            popup__labelProfileName: "名称",
            popup__placeholderProfileName: "配置名称",
            popup__labelActiveProfile: "默认",
            popup__placeholderApiUrl: "https://api.openai.com/v1",
            popup__placeholderApiKey: "",
            popup__placeholderModelName: "",
            popup__btnSaveConfig: "保存配置",
            popup__btnAddProfile: "新增",
            popup__btnSaveProfile: "保存",
            popup__btnDeleteProfile: "删除",
            popup__btnSetActive: "设为当前",
            popup__btnTestConnection: "测试连接",
            popup__btnShowKey: "显示",
            popup__btnHideKey: "隐藏",
            popup__btnCopyKey: "复制",
            popup__statusSaved: "配置已保存",
            popup__statusError: "保存失败，请检查输入",
            popup__statusDeleted: "记录已删除",
            popup__statusCopied: "密钥已复制",
            popup__statusTestSuccess: "连接成功",
            popup__statusTestFailed: "连接失败：$1$",
            popup__statusTestTimeout: "超时",
            popup__statusSetActive: "已设为当前",
            popup__confirmDeleteProfile: '确定要删除 "$1$" 吗？',
            popup__profileNameEmpty: "未命名",
            popup__defaultProfileName: "配置 $1$",
            popup__presetOpenAI: "OpenAI",
            popup__presetDeepSeek: "DeepSeek",
            popup__presetQwen: "Qwen",
            chat__welcome: "开始对话",
            chat__welcomeHint: "输入问题，开始与 AI 对话",
            chat__placeholderInput: "输入你的问题...",
            chat__btnSend: "发送",
            chat__thinking: "AI 正在思考...",
            chat__windowTitle: "窗口 $1$",
            chat__roleUser: "用户",
            chat__roleAI: "AI",
            content__toolbarChat: "在新的对话窗口中讨论",
            content__toolbarBtnChat: "AI对话",
            content__btnMinimize: "最小化",
            content__btnClose: "关闭",
            common__loading: "加载中...",
            common__error: "错误",
            common__success: "成功",
            common__cancel: "取消",
            common__confirm: "确定",
            prompt__empty: "暂无提示词",
            prompt__labelName: "名称",
            prompt__labelContent: "内容",
            prompt__placeholderName: "提示词名称",
            prompt__placeholderContent: "输入提示词内容...",
            prompt__btnAdd: "新增",
            prompt__btnSave: "保存",
            prompt__btnDelete: "删除",
            prompt__defaultLabel: "默认",
            prompt__noPrompt: "无提示词",
            prompt__statusSaved: "提示词已保存",
            prompt__statusDeleted: "提示词已删除",
            prompt__statusDefaultSet: "已设为默认",
            prompt__confirmDelete: '确定要删除提示词「$1$」吗？',
            prompt__defaultName: "提示词 $1$",
            history__title: "对话历史",
            history__empty: "暂无历史对话",
            history__btnExportAll: "导出所有",
            history__btnClearHistory: "清空历史",
            history__btnView: "查看",
            history__btnExport: "导出",
            history__btnDelete: "删除",
            history__messageCount: "$1$ 条消息",
            history__confirmDeleteAll: "确定要清空所有历史记录吗？",
            history__confirmDeleteItem: '确定要删除对话"$1$"吗？',
            history__successDeleted: "对话已删除",
            history__errorDeleted: "删除失败",
            history__successCleared: "历史记录已清空",
            history__successExported: "导出成功",
            history__errorExported: "导出失败",
            error__apiConfigMissing: "API 配置缺失，请新增配置并设为当前。",
            error__emptyApiResponse: "API 返回空响应，请重试。",
            config__btnExport: "导出",
            config__btnImport: "导入",
            config__errorNoProfiles: "没有可导出的配置",
            config__errorNoPrompts: "没有可导出的提示词",
            config__errorInvalidFormat: "无效的文件格式",
            config__statusExported: "已导出 $1$ 项",
            config__statusImported: "已添加 $1$ 项，更新 $2$ 项",
            menu__openSettings: "⚙️ 打开设置"
        }
    };

    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const locale = browserLang.startsWith('zh') ? 'zh' : 'en';
    const messages = i18n[locale] || i18n.en;

    // Translation function
    function t(key, substitutions = []) {
        let result = messages[key] || key;

        if (substitutions) {
            if (typeof substitutions === 'object' && !Array.isArray(substitutions)) {
                for (const [name, value] of Object.entries(substitutions)) {
                    result = result.replace(new RegExp(`\\$${name}\\$`, 'g'), value);
                }
            } else {
                if (!Array.isArray(substitutions)) {
                    substitutions = [substitutions];
                }
                substitutions.forEach((value, index) => {
                    result = result.replace(new RegExp(`\\$${index + 1}\\$`, 'g'), value);
                });
            }
        }
        return result;
    }

    // ===== CSS =====
    const css = `
        .ai-selection-toolbar {
            position: absolute;
            z-index: 2147483647;
            display: none;
            gap: 4px;
            padding: 8px;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: toolbarFadeIn 0.2s ease-out;
        }

        @keyframes toolbarFadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .ai-toolbar-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            background: #fafafa;
            color: #262626;
            font-size: 13px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .ai-toolbar-btn:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .ai-multi-window {
            position: fixed;
            z-index: 2147483646;
            width: 450px;
            height: 600px;
            min-width: 350px;
            min-height: 400px;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: column;
            overflow: visible;
            animation: windowFadeIn 0.3s ease-out;
        }

        @keyframes windowFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .ai-multi-window.minimized {
            height: 48px !important;
            min-height: 48px !important;
        }

        .ai-multi-window.minimized .ai-window-content {
            display: none;
        }

        .ai-window-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #fafafa;
            border-bottom: 1px solid #e5e5e5;
            cursor: move;
            user-select: none;
        }

        .ai-window-title {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .ai-window-number {
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            cursor: text;
        }

        .ai-title-input {
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            padding: 4px 8px;
            border: 2px solid #667eea;
            border-radius: 6px;
            outline: none;
            background: #ffffff;
            font-family: inherit;
            min-width: 200px;
        }

        .ai-title-input:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .ai-window-controls {
            display: flex;
            gap: 4px;
        }

        .ai-window-btn {
            width: 28px;
            height: 28px;
            border: none;
            border-radius: 6px;
            background: transparent;
            color: #737373;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .ai-window-btn:hover {
            background: #e5e5e5;
            color: #262626;
        }

        .ai-close-btn:hover {
            background: #fee2e2;
            color: #dc2626;
        }

        .ai-window-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .ai-chat-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }

        .ai-resize-handle {
            position: absolute;
            z-index: 1000;
        }

        .ai-resize-e {
            top: 0;
            right: -10px;
            width: 20px;
            height: 100%;
            cursor: e-resize;
        }

        .ai-resize-w {
            top: 0;
            left: -10px;
            width: 20px;
            height: 100%;
            cursor: w-resize;
        }

        .ai-resize-s {
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 20px;
            cursor: s-resize;
        }

        .ai-resize-se {
            bottom: -10px;
            right: -10px;
            width: 24px;
            height: 24px;
            cursor: se-resize;
            z-index: 1001;
        }

        .ai-resize-sw {
            bottom: -10px;
            left: -10px;
            width: 24px;
            height: 24px;
            cursor: sw-resize;
            z-index: 1001;
        }

        .ai-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483647;
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        .ai-settings-panel.show {
            display: flex;
        }

        .ai-settings-header {
            padding: 16px 20px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fafafa;
        }

        .ai-settings-title {
            font-size: 18px;
            font-weight: 600;
            color: #262626;
        }

        .ai-settings-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #737373;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .ai-settings-close:hover {
            background: #f3f4f6;
            color: #262626;
        }

        .ai-settings-tabs {
            display: flex;
            border-bottom: 1px solid #e5e5e5;
            background: #ffffff;
        }

        .ai-settings-tab {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            color: #737373;
            transition: color 0.2s, border-color 0.2s;
        }

        .ai-settings-tab:hover {
            color: #667eea;
        }

        .ai-settings-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .ai-settings-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .ai-settings-tab-content {
            display: none;
        }

        .ai-settings-tab-content.active {
            display: block;
        }

        .ai-config-grid {
            display: grid;
            grid-template-columns: 160px 1fr;
            gap: 16px;
            align-items: start;
        }

        .ai-profile-list {
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            padding: 8px;
            background: #fafafa;
            height: 400px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .ai-profile-list.empty {
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 12px;
        }

        .ai-profile-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 8px 10px;
            border: 1px solid transparent;
            border-radius: 8px;
            background: transparent;
            text-align: left;
            cursor: pointer;
            color: #1a1a1a;
            font-size: 13px;
        }

        .ai-profile-item:hover {
            background: #f3f4f6;
        }

        .ai-profile-item.active {
            background: #ffffff;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.12);
        }

        .ai-profile-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid #cbd5f5;
            background: transparent;
            flex-shrink: 0;
        }

        .ai-profile-item.current .ai-profile-dot {
            background: #667eea;
            border-color: #667eea;
        }

        .ai-profile-name {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ai-profile-details {
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            padding: 16px;
            background: #ffffff;
            min-height: 400px;
        }

        .ai-input-group {
            margin-bottom: 14px;
        }

        .ai-input-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #4a4a4a;
        }

        .ai-input-group input,
        .ai-input-group select,
        .ai-input-group textarea {
            width: 100%;
            padding: 9px 12px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 13px;
            font-family: inherit;
            transition: border-color 0.2s, box-shadow 0.2s;
            background: #ffffff;
        }

        .ai-input-group textarea {
            resize: vertical;
            min-height: 80px;
            line-height: 1.5;
        }

        .ai-input-group input:focus,
        .ai-input-group select:focus,
        .ai-input-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .ai-inline-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ai-inline-actions input {
            flex: 1;
        }

        .ai-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .ai-btn-primary {
            background: #667eea;
            color: #ffffff;
        }

        .ai-btn-primary:hover {
            background: #5a6fe0;
        }

        .ai-btn-secondary {
            background: #ffffff;
            color: #1a1a1a;
            border: 1px solid #e5e5e5;
        }

        .ai-btn-secondary:hover {
            border-color: #667eea;
            color: #667eea;
        }

        .ai-btn-danger {
            background: #ffffff;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .ai-btn-danger:hover {
            background: #fef2f2;
            border-color: #dc2626;
        }

        .ai-btn:disabled {
            background: #e5e7eb;
            color: #9ca3af;
            border-color: #e5e7eb;
            cursor: not-allowed;
            box-shadow: none;
        }

        .ai-btn-small {
            padding: 6px 10px;
            font-size: 12px;
        }

        .ai-btn-inline {
            padding: 8px 10px;
            font-size: 12px;
        }

        .ai-config-toolbar {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .ai-config-toolbar-right {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #737373;
        }

        .ai-status {
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 12px;
            margin-bottom: 12px;
            display: none;
        }

        .ai-status.show {
            display: block;
        }

        .ai-status.success {
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
        }

        .ai-status.error {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fad2cf;
        }

        .ai-preset-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 8px;
        }

        .ai-preset-btn {
            padding: 4px 8px;
            font-size: 11px;
            background: #f3f4f6;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
        }

        .ai-preset-btn:hover {
            background: #e5e7eb;
            border-color: #d1d5db;
        }

        .ai-action-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            justify-content: flex-end;
        }

        .ai-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483646;
            display: none;
        }

        .ai-overlay.show {
            display: block;
        }

        /* Chat Window Styles */
        .ai-chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #ffffff;
        }

        .ai-messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #ffffff;
        }

        .ai-messages-container::-webkit-scrollbar {
            width: 6px;
        }

        .ai-messages-container::-webkit-scrollbar-track {
            background: #f5f5f5;
        }

        .ai-messages-container::-webkit-scrollbar-thumb {
            background: #d4d4d4;
            border-radius: 3px;
        }

        .ai-welcome-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #737373;
            text-align: center;
        }

        .ai-welcome-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.6;
        }

        .ai-welcome-text {
            font-size: 18px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 8px;
        }

        .ai-welcome-hint {
            font-size: 13px;
            color: #a3a3a3;
        }

        .ai-message {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            background: #ffffff;
            animation: messageIn 0.3s ease-out;
        }

        @keyframes messageIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .ai-message-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #737373;
        }

        .ai-message-avatar {
            font-size: 16px;
            line-height: 1;
        }

        .ai-message-role {
            color: #262626;
        }

        .ai-message-content {
            padding: 0;
            max-width: 100%;
            word-wrap: break-word;
            white-space: pre-wrap;
            color: #262626;
            line-height: 1.8;
            font-size: 14px;
        }

        .ai-message-content code {
            background: rgba(0, 0, 0, 0.05);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
        }

        .ai-prompt-selector {
            padding: 8px 20px;
            background: #fafafa;
            border-top: 1px solid #e5e5e5;
        }

        .ai-prompt-selector select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            font-size: 13px;
            font-family: inherit;
            background: #ffffff;
            color: #1a1a1a;
            cursor: pointer;
        }

        .ai-input-container {
            display: flex;
            gap: 8px;
            padding: 16px 20px;
            background: #ffffff;
            border-top: 1px solid #e5e5e5;
        }

        .ai-message-input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            resize: none;
            outline: none;
            background: #fafafa;
            transition: all 0.2s;
            max-height: 120px;
            overflow-y: auto;
        }

        .ai-message-input:focus {
            border-color: #667eea;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .ai-send-btn {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .ai-send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .ai-send-btn:active {
            transform: scale(0.95);
        }

        .ai-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .ai-loading-indicator {
            display: flex;
            align-items: center;
            padding: 0 20px 12px;
            width: 100%;
        }

        .ai-loading-text {
            font-size: 13px;
            color: #737373;
        }

        @media (max-width: 600px) {
            .ai-multi-window {
                width: calc(100vw - 40px);
                height: 70vh;
                left: 20px !important;
                top: 80px !important;
            }

            .ai-selection-toolbar {
                padding: 6px;
            }

            .ai-toolbar-btn {
                padding: 6px 12px;
                font-size: 12px;
            }

            .ai-toolbar-btn span {
                display: none;
            }

            .ai-toolbar-btn svg {
                display: block;
            }

            .ai-config-grid {
                grid-template-columns: 1fr;
            }

            .ai-profile-list {
                height: 200px;
            }
        }
    `;

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ===== Storage Helpers =====
    const Storage = {
        get(key) {
            const value = GM_getValue(key);
            return value ? JSON.parse(value) : null;
        },
        set(key, value) {
            GM_setValue(key, JSON.stringify(value));
        },
        delete(key) {
            GM_deleteValue(key);
        }
    };

    // ===== Storage Keys =====
    const STORAGE_KEYS = {
        profiles: 'apiProfiles',
        activeProfileId: 'activeApiProfileId',
        prompts: 'system_prompts',
        defaultPromptId: 'default_system_prompt_id',
        chatHistory: 'chat_history'
    };

    // ===== Utility Functions =====
    function generateId() {
        return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderMarkdown(content) {
        if (!content) return '';

        // Escape HTML first
        let html = escapeHtml(content);

        // Code blocks (must be processed before other markdown)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${code}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');

        // Bold
        html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+?)_/g, '<em>$1</em>');

        // Strikethrough
        html = html.replace(/~~([^~]+?)~~/g, '<del>$1</del>');

        // Headers
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Links
        html = html.replace(/\[([^\]]+?)\]\(([^\)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Unordered lists
        html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Ordered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
        html = html.replace(/(<oli>.*<\/oli>)/s, '<ol>$1</ol>'.replace('<oli>', '<li>').replace('</oli>', '</li>'));

        // Blockquotes
        html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/^\*\*\*$/gm, '<hr>');

        // Line breaks and paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // Wrap in paragraphs
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ol>)/g, '$1');
        html = html.replace(/(<\/ol>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)/g, '$1');
        html = html.replace(/(<hr>)<\/p>/g, '$1');

        return html;
    }

    function renderMath(content) {
        if (!content) return content;

        try {
            // Render display math: $$...$$
            content = content.replace(/\$\$([^$]+?)\$\$/g, (match, formula) => {
                const escaped = escapeHtml(formula);
                return `<div class="math-display" style="padding: 16px; margin: 12px 0; background: #f5f5f5; border-radius: 8px; overflow-x: auto; font-family: 'Times New Roman', serif; font-size: 16px; text-align: center;">${escaped}</div>`;
            });

            // Render inline math: $...$
            content = content.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
                const escaped = escapeHtml(formula);
                return `<span class="math-inline" style="font-family: 'Times New Roman', serif; font-style: italic;">${escaped}</span>`;
            });
        } catch (e) {
            console.error('Math rendering error:', e);
        }

        return content;
    }

    // ===== API Helper =====
    async function callChatAPI(profile, messages) {
        return new Promise((resolve, reject) => {
            const baseUrl = profile.apiUrl.replace(/\/$/, '');
            const url = `${baseUrl}/chat/completions`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${profile.apiKey}`
                },
                data: JSON.stringify({
                    model: profile.modelName,
                    messages: messages
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            resolve(data.choices[0].message.content);
                        } else {
                            reject(new Error('Invalid response format'));
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
    }

    // ===== Settings Panel =====
    class SettingsPanel {
        constructor() {
            this.overlay = null;
            this.panel = null;
            this.profiles = [];
            this.prompts = [];
            this.selectedProfileId = null;
            this.activeProfileId = null;
            this.selectedPromptId = null;
            this.defaultPromptId = null;
            this.currentTab = 'config';
        }

        init() {
            this.createPanel();
            this.loadProfiles();
            this.loadPrompts();
        }

        createPanel() {
            // Overlay
            this.overlay = document.createElement('div');
            this.overlay.className = 'ai-overlay';
            this.overlay.addEventListener('click', () => this.hide());

            // Panel
            this.panel = document.createElement('div');
            this.panel.className = 'ai-settings-panel';
            this.panel.innerHTML = `
                <div class="ai-settings-header">
                    <div class="ai-settings-title">${t('popup__title')}</div>
                    <button class="ai-settings-close">&times;</button>
                </div>
                <div class="ai-settings-tabs">
                    <button class="ai-settings-tab active" data-tab="config">${t('popup__tabConfig')}</button>
                    <button class="ai-settings-tab" data-tab="prompts">${t('popup__tabPrompts')}</button>
                    <button class="ai-settings-tab" data-tab="history">${t('popup__tabHistory')}</button>
                </div>
                <div class="ai-settings-body">
                    <div class="ai-settings-tab-content active" id="configTab"></div>
                    <div class="ai-settings-tab-content" id="promptsTab"></div>
                    <div class="ai-settings-tab-content" id="historyTab"></div>
                </div>
            `;

            document.body.appendChild(this.overlay);
            document.body.appendChild(this.panel);

            // Event listeners
            this.panel.querySelector('.ai-settings-close').addEventListener('click', () => this.hide());

            this.panel.querySelectorAll('.ai-settings-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchTab(tab.dataset.tab);
                });
            });

            this.renderConfigTab();
            this.renderPromptsTab();
            this.renderHistoryTab();
        }

        show() {
            this.overlay.classList.add('show');
            this.panel.classList.add('show');
            this.loadProfiles();
            this.loadPrompts();
            this.loadHistory();
        }

        hide() {
            this.overlay.classList.remove('show');
            this.panel.classList.remove('show');
        }

        switchTab(tabName) {
            this.currentTab = tabName;

            this.panel.querySelectorAll('.ai-settings-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            this.panel.querySelectorAll('.ai-settings-tab-content').forEach(content => {
                content.classList.toggle('active', content.id === `${tabName}Tab`);
            });

            if (tabName === 'history') {
                this.loadHistory();
            } else if (tabName === 'prompts') {
                this.loadPrompts();
            }
        }

        renderConfigTab() {
            const tab = this.panel.querySelector('#configTab');
            tab.innerHTML = `
                <div class="ai-config-toolbar">
                    <button class="ai-btn ai-btn-primary ai-btn-small" id="aiAddProfileBtn">${t('popup__btnAddProfile')}</button>
                    <button class="ai-btn ai-btn-secondary ai-btn-small" id="aiExportProfilesBtn">${t('config__btnExport')}</button>
                    <button class="ai-btn ai-btn-secondary ai-btn-small" id="aiImportProfilesBtn">${t('config__btnImport')}</button>
                    <input type="file" id="aiImportProfilesInput" accept=".json" style="display: none;" />
                    <div class="ai-config-toolbar-right">
                        <label>${t('popup__labelActiveProfile')}</label>
                        <select id="aiActiveProfileSelect"></select>
                    </div>
                </div>
                <div id="aiConfigStatus" class="ai-status"></div>
                <div class="ai-config-grid">
                    <div class="ai-profile-list" id="aiProfileList"></div>
                    <div class="ai-profile-details">
                        <div class="ai-input-group">
                            <label>${t('popup__labelProfileName')}</label>
                            <input type="text" id="aiProfileName" />
                        </div>
                        <div class="ai-input-group">
                            <label>${t('popup__labelApiUrl')}</label>
                            <input type="url" id="aiApiUrl" />
                            <div class="ai-preset-buttons">
                                <button class="ai-preset-btn" data-url="https://api.openai.com/v1">${t('popup__presetOpenAI')}</button>
                                <button class="ai-preset-btn" data-url="https://api.deepseek.com">${t('popup__presetDeepSeek')}</button>
                                <button class="ai-preset-btn" data-url="https://dashscope.aliyuncs.com/compatible-mode/v1">${t('popup__presetQwen')}</button>
                            </div>
                        </div>
                        <div class="ai-input-group">
                            <label>${t('popup__labelApiKey')}</label>
                            <div class="ai-inline-actions">
                                <input type="password" id="aiApiKey" />
                                <button class="ai-btn ai-btn-secondary ai-btn-inline" id="aiToggleApiKeyBtn">${t('popup__btnShowKey')}</button>
                                <button class="ai-btn ai-btn-secondary ai-btn-inline" id="aiCopyApiKeyBtn">${t('popup__btnCopyKey')}</button>
                            </div>
                        </div>
                        <div class="ai-input-group">
                            <label>${t('popup__labelModelName')}</label>
                            <input type="text" id="aiModelName" />
                        </div>
                        <div class="ai-action-row">
                            <button class="ai-btn ai-btn-secondary" id="aiTestBtn">${t('popup__btnTestConnection')}</button>
                            <button class="ai-btn ai-btn-secondary" id="aiSetActiveBtn">${t('popup__btnSetActive')}</button>
                            <button class="ai-btn ai-btn-primary" id="aiSaveProfileBtn">${t('popup__btnSaveProfile')}</button>
                            <button class="ai-btn ai-btn-danger" id="aiDeleteProfileBtn">${t('popup__btnDeleteProfile')}</button>
                        </div>
                    </div>
                </div>
            `;

            // Event listeners
            tab.querySelector('#aiAddProfileBtn').addEventListener('click', () => this.addProfile());
            tab.querySelector('#aiSaveProfileBtn').addEventListener('click', () => this.saveProfile());
            tab.querySelector('#aiDeleteProfileBtn').addEventListener('click', () => this.deleteProfile());
            tab.querySelector('#aiSetActiveBtn').addEventListener('click', () => this.setActiveProfile());
            tab.querySelector('#aiTestBtn').addEventListener('click', () => this.testConnection());
            tab.querySelector('#aiToggleApiKeyBtn').addEventListener('click', () => this.toggleApiKeyVisibility());
            tab.querySelector('#aiCopyApiKeyBtn').addEventListener('click', () => this.copyApiKey());
            tab.querySelector('#aiExportProfilesBtn').addEventListener('click', () => this.exportProfiles());
            tab.querySelector('#aiImportProfilesBtn').addEventListener('click', () => {
                tab.querySelector('#aiImportProfilesInput').click();
            });
            tab.querySelector('#aiImportProfilesInput').addEventListener('change', (e) => this.importProfiles(e));
            tab.querySelector('#aiActiveProfileSelect').addEventListener('change', (e) => {
                this.selectProfile(e.target.value);
                this.setActiveProfile(e.target.value);
            });
            tab.querySelector('#aiProfileList').addEventListener('click', (e) => {
                const item = e.target.closest('.ai-profile-item');
                if (item) this.selectProfile(item.dataset.id);
            });
            tab.querySelectorAll('.ai-preset-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    tab.querySelector('#aiApiUrl').value = btn.dataset.url;
                });
            });
        }

        renderPromptsTab() {
            const tab = this.panel.querySelector('#promptsTab');
            tab.innerHTML = `
                <div class="ai-config-toolbar">
                    <button class="ai-btn ai-btn-primary ai-btn-small" id="aiAddPromptBtn">${t('prompt__btnAdd')}</button>
                    <button class="ai-btn ai-btn-secondary ai-btn-small" id="aiExportPromptsBtn">${t('config__btnExport')}</button>
                    <button class="ai-btn ai-btn-secondary ai-btn-small" id="aiImportPromptsBtn">${t('config__btnImport')}</button>
                    <input type="file" id="aiImportPromptsInput" accept=".json" style="display: none;" />
                    <div class="ai-config-toolbar-right">
                        <label>${t('prompt__defaultLabel')}</label>
                        <select id="aiDefaultPromptSelect">
                            <option value="">${t('prompt__noPrompt')}</option>
                        </select>
                    </div>
                </div>
                <div id="aiPromptStatus" class="ai-status"></div>
                <div class="ai-config-grid">
                    <div class="ai-profile-list" id="aiPromptList"></div>
                    <div class="ai-profile-details">
                        <div class="ai-input-group">
                            <label>${t('prompt__labelName')}</label>
                            <input type="text" id="aiPromptName" />
                        </div>
                        <div class="ai-input-group">
                            <label>${t('prompt__labelContent')}</label>
                            <textarea id="aiPromptContent" rows="12"></textarea>
                        </div>
                        <div class="ai-action-row">
                            <button class="ai-btn ai-btn-primary" id="aiSavePromptBtn">${t('prompt__btnSave')}</button>
                            <button class="ai-btn ai-btn-danger" id="aiDeletePromptBtn">${t('prompt__btnDelete')}</button>
                        </div>
                    </div>
                </div>
            `;

            // Event listeners
            tab.querySelector('#aiAddPromptBtn').addEventListener('click', () => this.addPrompt());
            tab.querySelector('#aiSavePromptBtn').addEventListener('click', () => this.savePrompt());
            tab.querySelector('#aiDeletePromptBtn').addEventListener('click', () => this.deletePrompt());
            tab.querySelector('#aiExportPromptsBtn').addEventListener('click', () => this.exportPrompts());
            tab.querySelector('#aiImportPromptsBtn').addEventListener('click', () => {
                tab.querySelector('#aiImportPromptsInput').click();
            });
            tab.querySelector('#aiImportPromptsInput').addEventListener('change', (e) => this.importPrompts(e));
            tab.querySelector('#aiDefaultPromptSelect').addEventListener('change', (e) => {
                this.setDefaultPrompt(e.target.value);
            });
            tab.querySelector('#aiPromptList').addEventListener('click', (e) => {
                const item = e.target.closest('.ai-profile-item');
                if (item) this.selectPrompt(item.dataset.id);
            });
        }

        renderHistoryTab() {
            const tab = this.panel.querySelector('#historyTab');
            tab.innerHTML = `
                <div id="aiHistoryStatus" class="ai-status"></div>
                <div id="aiHistoryList" class="ai-profile-list" style="height: auto; max-height: 400px;">
                    <div class="history-empty">
                        <div class="ai-welcome-icon">💬</div>
                        <div>${t('history__empty')}</div>
                    </div>
                </div>
                <div class="ai-action-row">
                    <button class="ai-btn ai-btn-primary" id="aiExportAllBtn">${t('history__btnExportAll')}</button>
                    <button class="ai-btn ai-btn-danger" id="aiClearHistoryBtn">${t('history__btnClearHistory')}</button>
                </div>
            `;

            tab.querySelector('#aiClearHistoryBtn').addEventListener('click', () => {
                if (confirm(t('history__confirmDeleteAll'))) {
                    this.clearHistory();
                }
            });
            tab.querySelector('#aiExportAllBtn').addEventListener('click', () => {
                this.exportAllHistory();
            });
            // Event delegation for view and delete buttons
            tab.querySelector('#aiHistoryList').addEventListener('click', (e) => {
                const viewBtn = e.target.closest('.ai-history-view-btn');
                const deleteBtn = e.target.closest('.ai-history-delete-btn');
                if (viewBtn) {
                    const chatId = viewBtn.dataset.chatId;
                    if (window.aiMultiWindow) {
                        window.aiMultiWindow.resumeChat(chatId);
                    }
                } else if (deleteBtn) {
                    const chatId = deleteBtn.dataset.chatId;
                    if (window.aiMultiWindow) {
                        window.aiMultiWindow.deleteChat(chatId);
                    }
                }
            });
        }

        loadHistory() {
            const history = Storage.get(STORAGE_KEYS.chatHistory) || [];
            const container = this.panel.querySelector('#aiHistoryList');

            if (history.length === 0) {
                container.innerHTML = `
                    <div class="history-empty">
                        <div class="ai-welcome-icon">💬</div>
                        <div>${t('history__empty')}</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = history.map(chat => {
                // Escape single quotes for HTML attribute
                const safeChatId = chat.chatId.replace(/'/g, '&#39;');
                return `
                <div class="ai-message" style="cursor: pointer;">
                    <div class="ai-message-header">
                        <span class="ai-message-avatar">💬</span>
                        <span class="ai-message-role">${escapeHtml(chat.title)}</span>
                    </div>
                    <div style="font-size: 12px; color: #737373;">
                        ${new Date(chat.updatedAt).toLocaleString()} · ${t('history__messageCount', chat.messageCount)}
                    </div>
                    <div class="ai-action-row">
                        <button class="ai-btn ai-btn-secondary ai-btn-small ai-history-view-btn" data-chat-id="${safeChatId}">${t('history__btnView')}</button>
                        <button class="ai-btn ai-btn-danger ai-btn-small ai-history-delete-btn" data-chat-id="${safeChatId}">${t('history__btnDelete')}</button>
                    </div>
                </div>
            `}).join('');
        }

        // Profile methods
        loadProfiles() {
            const data = Storage.get(STORAGE_KEYS.profiles) || [];
            this.profiles = Array.isArray(data) ? data : [];
            this.activeProfileId = Storage.get(STORAGE_KEYS.activeProfileId) || null;

            if (this.profiles.length > 0 && (!this.activeProfileId || !this.profiles.find(p => p.id === this.activeProfileId))) {
                this.activeProfileId = this.profiles[0].id;
                Storage.set(STORAGE_KEYS.activeProfileId, this.activeProfileId);
            }

            this.selectedProfileId = this.activeProfileId || (this.profiles[0] && this.profiles[0].id);
            this.renderProfiles();
            this.updateProfileForm();
        }

        renderProfiles() {
            const list = this.panel.querySelector('#aiProfileList');
            const select = this.panel.querySelector('#aiActiveProfileSelect');

            if (!list) return;

            if (this.profiles.length === 0) {
                list.classList.add('empty');
                list.innerHTML = '';
            } else {
                list.classList.remove('empty');
                list.innerHTML = this.profiles.map(profile => {
                    const isActive = profile.id === this.activeProfileId;
                    const isSelected = profile.id === this.selectedProfileId;
                    const name = profile.name || t('popup__profileNameEmpty');
                    return `
                        <button class="ai-profile-item${isSelected ? ' active' : ''}${isActive ? ' current' : ''}" data-id="${profile.id}">
                            <span class="ai-profile-dot"></span>
                            <span class="ai-profile-name">${escapeHtml(name)}</span>
                        </button>
                    `;
                }).join('');
            }

            if (select) {
                select.innerHTML = this.profiles.map(profile => {
                    const name = profile.name || t('popup__profileNameEmpty');
                    return `<option value="${profile.id}">${escapeHtml(name)}</option>`;
                }).join('');
                select.value = this.activeProfileId || '';
            }
        }

        selectProfile(profileId) {
            this.selectedProfileId = profileId;
            this.renderProfiles();
            this.updateProfileForm();
        }

        updateProfileForm() {
            const profile = this.profiles.find(p => p.id === this.selectedProfileId);
            const tab = this.panel.querySelector('#configTab');
            if (!tab) return;

            const nameInput = tab.querySelector('#aiProfileName');
            const urlInput = tab.querySelector('#aiApiUrl');
            const keyInput = tab.querySelector('#aiApiKey');
            const modelInput = tab.querySelector('#aiModelName');

            if (profile) {
                nameInput.value = profile.name || '';
                urlInput.value = profile.apiUrl || '';
                keyInput.value = profile.apiKey || '';
                modelInput.value = profile.modelName || '';
                keyInput.type = 'password';
                tab.querySelector('#aiToggleApiKeyBtn').textContent = t('popup__btnShowKey');
            } else {
                nameInput.value = '';
                urlInput.value = '';
                keyInput.value = '';
                modelInput.value = '';
            }

            const isEmpty = !profile;
            [nameInput, urlInput, keyInput, modelInput].forEach(el => el.disabled = isEmpty);
            tab.querySelectorAll('.ai-btn').forEach(btn => {
                // Always enable import/export buttons and add button
                const alwaysEnabled = ['aiAddProfileBtn', 'aiExportProfilesBtn', 'aiImportProfilesBtn'].includes(btn.id);
                if (!alwaysEnabled) btn.disabled = isEmpty;
            });
        }

        saveProfile() {
            const tab = this.panel.querySelector('#configTab');
            const profile = {
                id: this.selectedProfileId,
                name: tab.querySelector('#aiProfileName').value.trim(),
                apiUrl: tab.querySelector('#aiApiUrl').value.trim(),
                apiKey: tab.querySelector('#aiApiKey').value.trim(),
                modelName: tab.querySelector('#aiModelName').value.trim()
            };

            if (!profile.name || !profile.apiUrl || !profile.apiKey || !profile.modelName) {
                this.showConfigStatus(t('popup__statusError'), 'error');
                return;
            }

            const index = this.profiles.findIndex(p => p.id === profile.id);
            if (index === -1) {
                profile.id = generateId();
                this.profiles.push(profile);
                this.selectedProfileId = profile.id;
            } else {
                this.profiles[index] = { ...this.profiles[index], ...profile };
            }

            Storage.set(STORAGE_KEYS.profiles, this.profiles);
            this.renderProfiles();
            this.showConfigStatus(t('popup__statusSaved'), 'success');
        }

        addProfile() {
            const newProfile = {
                id: generateId(),
                name: t('popup__defaultProfileName', this.profiles.length + 1),
                apiUrl: 'https://api.openai.com/v1',
                apiKey: '',
                modelName: ''
            };
            this.profiles = [newProfile, ...this.profiles];
            this.selectedProfileId = newProfile.id;
            this.renderProfiles();
            this.updateProfileForm();
            Storage.set(STORAGE_KEYS.profiles, this.profiles);
        }

        deleteProfile() {
            if (!this.selectedProfileId) return;
            this.profiles = this.profiles.filter(p => p.id !== this.selectedProfileId);

            if (this.profiles.length === 0) {
                this.activeProfileId = null;
                this.selectedProfileId = null;
            } else if (this.selectedProfileId === this.activeProfileId) {
                this.activeProfileId = this.profiles[0].id;
                this.selectedProfileId = this.profiles[0].id;
            } else {
                this.selectedProfileId = this.activeProfileId || this.profiles[0].id;
            }

            Storage.set(STORAGE_KEYS.profiles, this.profiles);
            Storage.set(STORAGE_KEYS.activeProfileId, this.activeProfileId);
            this.renderProfiles();
            this.updateProfileForm();
            this.showConfigStatus(t('popup__statusDeleted'), 'success');
        }

        setActiveProfile(profileId) {
            if (!profileId) return;
            this.activeProfileId = profileId;
            Storage.set(STORAGE_KEYS.activeProfileId, this.activeProfileId);
            this.renderProfiles();
            this.showConfigStatus(t('popup__statusSetActive'), 'success');
        }

        toggleApiKeyVisibility() {
            const tab = this.panel.querySelector('#configTab');
            const input = tab.querySelector('#aiApiKey');
            const btn = tab.querySelector('#aiToggleApiKeyBtn');
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = t('popup__btnHideKey');
            } else {
                input.type = 'password';
                btn.textContent = t('popup__btnShowKey');
            }
        }

        async copyApiKey() {
            const tab = this.panel.querySelector('#configTab');
            const key = tab.querySelector('#aiApiKey').value.trim();
            if (!key) {
                this.showConfigStatus(t('popup__statusError'), 'error');
                return;
            }

            try {
                await navigator.clipboard.writeText(key);
                this.showConfigStatus(t('popup__statusCopied'), 'success');
            } catch (e) {
                this.showConfigStatus(t('popup__statusError'), 'error');
            }
        }

        async testConnection() {
            const tab = this.panel.querySelector('#configTab');
            const apiUrl = tab.querySelector('#aiApiUrl').value.trim();
            const apiKey = tab.querySelector('#aiApiKey').value.trim();

            if (!apiUrl || !apiKey) {
                this.showConfigStatus(t('popup__statusError'), 'error');
                return;
            }

            try {
                const response = await fetch(`${apiUrl.replace(/\/$/, '')}/models`, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });

                if (response.ok) {
                    this.showConfigStatus(t('popup__statusTestSuccess'), 'success');
                } else {
                    this.showConfigStatus(t('popup__statusTestFailed', response.status), 'error');
                }
            } catch (e) {
                this.showConfigStatus(t('popup__statusTestFailed', e.message), 'error');
            }
        }

        showConfigStatus(message, type) {
            const status = this.panel.querySelector('#aiConfigStatus');
            if (status) {
                status.textContent = message;
                status.className = `ai-status show ${type}`;
                setTimeout(() => status.classList.remove('show'), 3000);
            }
        }

        // Prompt methods
        loadPrompts() {
            const data = Storage.get(STORAGE_KEYS.prompts) || [];
            this.prompts = Array.isArray(data) ? data : [];
            this.defaultPromptId = Storage.get(STORAGE_KEYS.defaultPromptId) || null;

            if (this.prompts.length > 0 && (!this.defaultPromptId || !this.prompts.find(p => p.id === this.defaultPromptId))) {
                this.defaultPromptId = null;
                Storage.delete(STORAGE_KEYS.defaultPromptId);
            }

            this.selectedPromptId = this.defaultPromptId || (this.prompts[0] && this.prompts[0].id);
            this.renderPrompts();
            this.updatePromptForm();
        }

        renderPrompts() {
            const list = this.panel.querySelector('#aiPromptList');
            const select = this.panel.querySelector('#aiDefaultPromptSelect');

            if (!list) return;

            if (this.prompts.length === 0) {
                list.classList.add('empty');
                list.innerHTML = '';
            } else {
                list.classList.remove('empty');
                list.innerHTML = this.prompts.map(prompt => {
                    const isDefault = prompt.id === this.defaultPromptId;
                    const isSelected = prompt.id === this.selectedPromptId;
                    const name = prompt.name || t('prompt__empty');
                    return `
                        <button class="ai-profile-item${isSelected ? ' active' : ''}${isDefault ? ' current' : ''}" data-id="${prompt.id}">
                            <span class="ai-profile-dot"></span>
                            <span class="ai-profile-name">${escapeHtml(name)}</span>
                        </button>
                    `;
                }).join('');
            }

            if (select) {
                select.innerHTML = `<option value="">${t('prompt__noPrompt')}</option>` + this.prompts.map(prompt => {
                    const name = prompt.name || t('prompt__empty');
                    return `<option value="${prompt.id}">${escapeHtml(name)}</option>`;
                }).join('');
                select.value = this.defaultPromptId || '';
            }
        }

        selectPrompt(promptId) {
            this.selectedPromptId = promptId;
            this.renderPrompts();
            this.updatePromptForm();
        }

        updatePromptForm() {
            const prompt = this.prompts.find(p => p.id === this.selectedPromptId);
            const tab = this.panel.querySelector('#promptsTab');
            if (!tab) return;

            const nameInput = tab.querySelector('#aiPromptName');
            const contentInput = tab.querySelector('#aiPromptContent');

            if (prompt) {
                nameInput.value = prompt.name || '';
                contentInput.value = prompt.content || '';
            } else {
                nameInput.value = '';
                contentInput.value = '';
            }

            const isEmpty = !prompt;
            nameInput.disabled = isEmpty;
            contentInput.disabled = isEmpty;
        }

        savePrompt() {
            const tab = this.panel.querySelector('#promptsTab');
            const prompt = {
                id: this.selectedPromptId,
                name: tab.querySelector('#aiPromptName').value.trim(),
                content: tab.querySelector('#aiPromptContent').value.trim()
            };

            if (!prompt.name || !prompt.content) {
                this.showPromptStatus(t('popup__statusError'), 'error');
                return;
            }

            const now = new Date().toISOString();
            const index = this.prompts.findIndex(p => p.id === prompt.id);
            if (index === -1) {
                prompt.id = generateId();
                prompt.createdAt = now;
                prompt.updatedAt = now;
                this.prompts.push(prompt);
                this.selectedPromptId = prompt.id;
            } else {
                this.prompts[index] = { ...this.prompts[index], ...prompt, updatedAt: now };
            }

            Storage.set(STORAGE_KEYS.prompts, this.prompts);
            this.renderPrompts();
            this.showPromptStatus(t('prompt__statusSaved'), 'success');
        }

        addPrompt() {
            const now = new Date().toISOString();
            const newPrompt = {
                id: generateId(),
                name: t('prompt__defaultName', this.prompts.length + 1),
                content: '',
                createdAt: now,
                updatedAt: now
            };
            this.prompts = [newPrompt, ...this.prompts];
            this.selectedPromptId = newPrompt.id;
            this.renderPrompts();
            this.updatePromptForm();
            Storage.set(STORAGE_KEYS.prompts, this.prompts);
        }

        deletePrompt() {
            if (!this.selectedPromptId) return;
            this.prompts = this.prompts.filter(p => p.id !== this.selectedPromptId);

            if (this.selectedPromptId === this.defaultPromptId) {
                this.defaultPromptId = null;
                Storage.delete(STORAGE_KEYS.defaultPromptId);
            }

            this.selectedPromptId = this.prompts[0]?.id || null;
            Storage.set(STORAGE_KEYS.prompts, this.prompts);
            this.renderPrompts();
            this.updatePromptForm();
            this.showPromptStatus(t('prompt__statusDeleted'), 'success');
        }

        setDefaultPrompt(promptId) {
            this.defaultPromptId = promptId || null;
            if (promptId) {
                Storage.set(STORAGE_KEYS.defaultPromptId, promptId);
            } else {
                Storage.delete(STORAGE_KEYS.defaultPromptId);
            }
            this.renderPrompts();
            this.showPromptStatus(t('prompt__statusDefaultSet'), 'success');
        }

        showPromptStatus(message, type) {
            const status = this.panel.querySelector('#aiPromptStatus');
            if (status) {
                status.textContent = message;
                status.className = `ai-status show ${type}`;
                setTimeout(() => status.classList.remove('show'), 3000);
            }
        }

        // History methods
        clearHistory() {
            Storage.delete(STORAGE_KEYS.chatHistory);
            this.loadHistory();
            this.showHistoryStatus(t('history__successCleared'), 'success');
        }

        exportAllHistory() {
            const history = Storage.get(STORAGE_KEYS.chatHistory) || [];
            let content = `# ${t('history__title')}\n\n`;
            content += `Exported: ${new Date().toLocaleString()}\n`;
            content += `Total: ${history.length} chats\n\n---\n\n`;

            history.forEach((chat, index) => {
                content += `## ${index + 1}. ${chat.title}\n\n`;
                content += `Time: ${new Date(chat.updatedAt).toLocaleString()}\n`;
                content += `Messages: ${chat.messageCount}\n\n`;

                chat.messages.forEach(msg => {
                    const role = msg.role === 'user' ? '👤 User' : '🤖 AI';
                    content += `### ${role}\n\n${msg.content}\n\n`;
                });
                content += `---\n\n`;
            });

            this.downloadFile(content, `ai-chats-all-${Date.now()}.md`);
            this.showHistoryStatus(t('history__successExported'), 'success');
        }

        showHistoryStatus(message, type) {
            const status = this.panel.querySelector('#aiHistoryStatus');
            if (status) {
                status.textContent = message;
                status.className = `ai-status show ${type}`;
                setTimeout(() => status.classList.remove('show'), 3000);
            }
        }

        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        // Profile Import/Export
        async exportProfiles() {
            try {
                const profiles = Storage.get(STORAGE_KEYS.profiles) || [];

                if (profiles.length === 0) {
                    this.showConfigStatus(t('config__errorNoProfiles'), 'error');
                    return;
                }

                const exportData = {
                    version: '1.0.0',
                    type: 'api-profiles',
                    exportDate: new Date().toISOString(),
                    profiles: profiles,
                    activeProfileId: Storage.get(STORAGE_KEYS.activeProfileId)
                };

                const content = JSON.stringify(exportData, null, 2);
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `api-profiles-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);

                this.showConfigStatus(t('config__statusExported', profiles.length), 'success');
            } catch (error) {
                console.error('Failed to export profiles:', error);
                this.showConfigStatus(t('config__statusError'), 'error');
            }
        }

        async importProfiles(event) {
            try {
                const file = event.target.files[0];
                if (!file) return;

                // Reset input to allow importing the same file again
                event.target.value = '';

                const content = await file.text();
                const importData = JSON.parse(content);

                // Validate import data structure
                if (!importData.profiles || !Array.isArray(importData.profiles)) {
                    this.showConfigStatus(t('config__errorInvalidFormat'), 'error');
                    return;
                }

                // Get existing profiles
                let profiles = Storage.get(STORAGE_KEYS.profiles) || [];
                const existingIds = new Set(profiles.map(p => p.id));

                let addedCount = 0;
                let updatedCount = 0;

                for (const importedProfile of importData.profiles) {
                    // Validate profile structure
                    if (!importedProfile.id || !importedProfile.name || !importedProfile.apiUrl) {
                        continue;
                    }

                    const existingIndex = profiles.findIndex(p => p.id === importedProfile.id);
                    if (existingIndex !== -1) {
                        profiles[existingIndex] = importedProfile;
                        updatedCount++;
                    } else {
                        profiles.push(importedProfile);
                        addedCount++;
                    }
                }

                // Update active profile ID if imported and valid
                if (importData.activeProfileId && profiles.some(p => p.id === importData.activeProfileId)) {
                    Storage.set(STORAGE_KEYS.activeProfileId, importData.activeProfileId);
                    this.activeProfileId = importData.activeProfileId;
                }

                // Ensure we have at least one active profile
                if (profiles.length > 0 && !this.activeProfileId) {
                    this.activeProfileId = profiles[0].id;
                    Storage.set(STORAGE_KEYS.activeProfileId, this.activeProfileId);
                }

                Storage.set(STORAGE_KEYS.profiles, profiles);
                this.loadProfiles();
                this.showConfigStatus(t('config__statusImported', [addedCount, updatedCount]), 'success');
            } catch (error) {
                console.error('Failed to import profiles:', error);
                this.showConfigStatus(t('config__statusError'), 'error');
            }
        }

        // Prompt Import/Export
        async exportPrompts() {
            try {
                const prompts = Storage.get(STORAGE_KEYS.prompts) || [];

                if (prompts.length === 0) {
                    this.showPromptStatus(t('config__errorNoPrompts'), 'error');
                    return;
                }

                const exportData = {
                    version: '1.0.0',
                    type: 'prompts',
                    exportDate: new Date().toISOString(),
                    prompts: prompts,
                    defaultPromptId: Storage.get(STORAGE_KEYS.defaultPromptId)
                };

                const content = JSON.stringify(exportData, null, 2);
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `prompts-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);

                this.showPromptStatus(t('config__statusExported', prompts.length), 'success');
            } catch (error) {
                console.error('Failed to export prompts:', error);
                this.showPromptStatus(t('config__statusError'), 'error');
            }
        }

        async importPrompts(event) {
            try {
                const file = event.target.files[0];
                if (!file) return;

                // Reset input to allow importing the same file again
                event.target.value = '';

                const content = await file.text();
                const importData = JSON.parse(content);

                // Validate import data structure
                if (!importData.prompts || !Array.isArray(importData.prompts)) {
                    this.showPromptStatus(t('config__errorInvalidFormat'), 'error');
                    return;
                }

                // Get existing prompts
                let prompts = Storage.get(STORAGE_KEYS.prompts) || [];
                const existingIds = new Set(prompts.map(p => p.id));

                let addedCount = 0;
                let updatedCount = 0;

                for (const importedPrompt of importData.prompts) {
                    // Validate prompt structure
                    if (!importedPrompt.id || !importedPrompt.name || !importedPrompt.content) {
                        continue;
                    }

                    const existingIndex = prompts.findIndex(p => p.id === importedPrompt.id);
                    if (existingIndex !== -1) {
                        prompts[existingIndex] = importedPrompt;
                        updatedCount++;
                    } else {
                        prompts.push(importedPrompt);
                        addedCount++;
                    }
                }

                // Update default prompt ID if imported and valid
                if (importData.defaultPromptId && prompts.some(p => p.id === importData.defaultPromptId)) {
                    Storage.set(STORAGE_KEYS.defaultPromptId, importData.defaultPromptId);
                    this.defaultPromptId = importData.defaultPromptId;
                }

                Storage.set(STORAGE_KEYS.prompts, prompts);
                this.loadPrompts();
                this.showPromptStatus(t('config__statusImported', [addedCount, updatedCount]), 'success');
            } catch (error) {
                console.error('Failed to import prompts:', error);
                this.showPromptStatus(t('config__statusError'), 'error');
            }
        }
    }

    // ===== Chat Window =====
    class ChatWindow {
        constructor(windowId, windowNumber, options = {}) {
            this.windowId = windowId;
            this.windowNumber = windowNumber;
            this.title = options.title || t('chat__windowTitle', windowNumber);
            this.chatId = options.chatId || generateId();
            this.promptId = options.promptId || null;
            this.messages = options.messages || [];
            this.messagesContainer = null;
            this.messageInput = null;
            this.promptSelect = null;
            this.loadingIndicator = null;
            this.isLoading = false;

            this.createWindow(options);
            this.setupEventListeners();
            this.loadPrompts();

            if (this.messages.length > 0) {
                this.renderMessages();
            }
        }

        createWindow(options = {}) {
            this.container = document.createElement('div');
            this.container.id = this.windowId;
            this.container.className = 'ai-multi-window';
            this.container.innerHTML = `
                <div class="ai-window-header">
                    <div class="ai-window-title">
                        <span class="ai-window-number">${escapeHtml(this.title)}</span>
                    </div>
                    <div class="ai-window-controls">
                        <button class="ai-window-btn ai-minimize-btn" title="${t('content__btnMinimize')}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                        <button class="ai-window-btn ai-close-btn" title="${t('content__btnClose')}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ai-window-content">
                    <div class="ai-chat-container">
                        <div class="ai-messages-container" id="${this.windowId}-messages">
                            <div class="ai-welcome-message">
                                <div class="ai-welcome-icon">💬</div>
                                <div class="ai-welcome-text">${t('chat__welcome')}</div>
                                <div class="ai-welcome-hint">${t('chat__welcomeHint')}</div>
                            </div>
                        </div>
                        <div class="ai-prompt-selector">
                            <select id="${this.windowId}-prompt-select">
                                <option value="">${t('prompt__noPrompt')}</option>
                            </select>
                        </div>
                        <div class="ai-input-container">
                            <textarea class="ai-message-input" id="${this.windowId}-input" rows="1" placeholder="${t('chat__placeholderInput')}"></textarea>
                            <button class="ai-send-btn" id="${this.windowId}-send" title="${t('chat__btnSend')}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="ai-loading-indicator" id="${this.windowId}-loading" style="display: none;">
                            <div class="ai-loading-text">${t('chat__thinking')}</div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.container);

            // Position
            const offset = (aiMultiWindow.windowCounter - 1) * 30;
            this.container.style.top = `${80 + offset}px`;
            this.container.style.left = `${200 + offset}px`;

            // Make draggable
            this.makeDraggable();
            this.makeResizable();

            // Cache elements
            this.messagesContainer = this.container.querySelector(`#${this.windowId}-messages`);
            this.messageInput = this.container.querySelector(`#${this.windowId}-input`);
            this.promptSelect = this.container.querySelector(`#${this.windowId}-prompt-select`);
            this.loadingIndicator = this.container.querySelector(`#${this.windowId}-loading`);

            // Auto-resize textarea
            this.messageInput.addEventListener('input', () => {
                this.messageInput.style.height = 'auto';
                this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
            });
        }

        setupEventListeners() {
            // Close button
            this.container.querySelector('.ai-close-btn').addEventListener('click', () => {
                this.close();
            });

            // Minimize button
            this.container.querySelector('.ai-minimize-btn').addEventListener('click', () => {
                this.container.classList.toggle('minimized');
                const content = this.container.querySelector('.ai-window-content');
                content.style.display = this.container.classList.contains('minimized') ? 'none' : 'block';
            });

            // Send button
            this.container.querySelector('.ai-send-btn').addEventListener('click', () => {
                this.sendMessage();
            });

            // Enter to send
            this.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Title edit
            const titleElement = this.container.querySelector('.ai-window-number');
            titleElement.addEventListener('click', () => {
                this.editTitle();
            });

            // Bring to front
            this.container.addEventListener('mousedown', () => {
                this.container.style.zIndex = aiMultiWindow.getHighestZIndex() + 1;
            });

            // Initial message
            if (this.messages.length === 0 && aiMultiWindow.initialMessage) {
                this.messageInput.value = aiMultiWindow.initialMessage;
                aiMultiWindow.initialMessage = '';
            }
        }

        loadPrompts() {
            const prompts = Storage.get(STORAGE_KEYS.prompts) || [];
            const defaultPromptId = Storage.get(STORAGE_KEYS.defaultPromptId) || null;

            this.promptSelect.innerHTML = `<option value="">${t('prompt__noPrompt')}</option>` +
                prompts.map(p => `<option value="${p.id}">${escapeHtml(p.name || t('prompt__empty'))}</option>`).join('');

            if (this.promptId && prompts.find(p => p.id === this.promptId)) {
                this.promptSelect.value = this.promptId;
            } else if (defaultPromptId) {
                this.promptSelect.value = defaultPromptId;
            }
        }

        editTitle() {
            const titleElement = this.container.querySelector('.ai-window-number');
            const currentTitle = titleElement.textContent;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentTitle;
            input.className = 'ai-title-input';

            titleElement.style.display = 'none';
            titleElement.parentNode.insertBefore(input, titleElement.nextSibling);
            input.focus();
            input.select();

            const saveTitle = () => {
                const newTitle = input.value.trim() || currentTitle;
                this.title = newTitle;
                titleElement.textContent = newTitle;
                titleElement.style.display = '';
                input.remove();
            };

            input.addEventListener('blur', saveTitle);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    input.blur();
                } else if (e.key === 'Escape') {
                    titleElement.style.display = '';
                    input.remove();
                }
            });
        }

        async sendMessage() {
            const content = this.messageInput.value.trim();
            if (!content || this.isLoading) return;

            // Get profile
            const profiles = Storage.get(STORAGE_KEYS.profiles) || [];
            const activeProfileId = Storage.get(STORAGE_KEYS.activeProfileId);
            const profile = profiles.find(p => p.id === activeProfileId);

            if (!profile) {
                this.showError(t('error__apiConfigMissing'));
                return;
            }

            // Build messages
            let messages = [];

            // Add system prompt if selected
            const promptId = this.promptSelect.value;
            if (promptId) {
                const prompts = Storage.get(STORAGE_KEYS.prompts) || [];
                const prompt = prompts.find(p => p.id === promptId);
                if (prompt && prompt.content) {
                    messages.push({ role: 'system', content: prompt.content });
                }
                this.promptId = promptId;
            }

            // Add existing messages
            messages = messages.concat(this.messages);

            // Add user message
            messages.push({ role: 'user', content });
            this.messages = messages;

            // Clear input
            this.messageInput.value = '';
            this.messageInput.style.height = 'auto';

            // Render user message
            this.appendMessage('user', content);

            // Show loading
            this.isLoading = true;
            this.loadingIndicator.style.display = 'flex';
            this.scrollToBottom();

            try {
                const response = await callChatAPI(profile, messages);

                // Add AI response
                this.messages.push({ role: 'assistant', content: response });
                this.appendMessage('assistant', response);

                // Save to history
                this.saveToHistory();
            } catch (error) {
                this.showError(error.message || t('error__emptyApiResponse'));
            } finally {
                this.isLoading = false;
                this.loadingIndicator.style.display = 'none';
            }
        }

        appendMessage(role, content) {
            // Remove welcome message
            const welcome = this.messagesContainer.querySelector('.ai-welcome-message');
            if (welcome) welcome.remove();

            const messageEl = document.createElement('div');
            messageEl.className = 'ai-message';

            const avatar = role === 'user' ? '👤' : '🤖';
            const roleName = role === 'user' ? t('chat__roleUser') : t('chat__roleAI');

            // Render content with markdown and math
            let renderedContent = renderMarkdown(content);
            renderedContent = renderMath(renderedContent);

            messageEl.innerHTML = `
                <div class="ai-message-header">
                    <span class="ai-message-avatar">${avatar}</span>
                    <span class="ai-message-role">${roleName}</span>
                </div>
                <div class="ai-message-content">${renderedContent}</div>
            `;

            this.messagesContainer.appendChild(messageEl);
            this.scrollToBottom();
        }

        showError(message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'ai-message';
            messageEl.style.border = '1px solid #dc2626';
            messageEl.style.background = '#fef2f2';
            messageEl.innerHTML = `
                <div class="ai-message-header">
                    <span class="ai-message-avatar">⚠️</span>
                    <span class="ai-message-role">${t('common__error')}</span>
                </div>
                <div class="ai-message-content">${escapeHtml(message)}</div>
            `;
            this.messagesContainer.appendChild(messageEl);
            this.scrollToBottom();
        }

        renderMessages() {
            this.messagesContainer.innerHTML = '';
            this.messages.forEach(msg => {
                this.appendMessage(msg.role, msg.content);
            });
        }

        scrollToBottom() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        saveToHistory() {
            const history = Storage.get(STORAGE_KEYS.chatHistory) || [];
            const existingIndex = history.findIndex(h => h.chatId === this.chatId);

            const chatData = {
                chatId: this.chatId,
                title: this.title,
                messages: this.messages,
                messageCount: this.messages.length,
                promptId: this.promptId,
                updatedAt: new Date().toISOString()
            };

            if (existingIndex !== -1) {
                history[existingIndex] = chatData;
            } else {
                history.unshift(chatData);
            }

            Storage.set(STORAGE_KEYS.chatHistory, history);
        }

        makeDraggable() {
            const header = this.container.querySelector('.ai-window-header');
            let isDragging = false;
            let startX, startY, initialX, initialY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.ai-window-controls')) return;
                if (e.target.closest('.ai-window-number')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = this.container.offsetLeft;
                initialY = this.container.offsetTop;
                this.container.style.zIndex = aiMultiWindow.getHighestZIndex() + 1;

                const onMouseMove = (e) => {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    this.container.style.left = `${initialX + dx}px`;
                    this.container.style.top = `${initialY + dy}px`;
                };

                const onMouseUp = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        makeResizable() {
            const minWidth = 350;
            const minHeight = 400;
            const positions = ['e', 'w', 's', 'se', 'sw'];

            positions.forEach(position => {
                const handle = document.createElement('div');
                handle.className = `ai-resize-handle ai-resize-${position}`;
                this.container.appendChild(handle);

                handle.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let isResizing = true;
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = this.container.offsetWidth;
                    const startHeight = this.container.offsetHeight;
                    const startLeft = this.container.offsetLeft;
                    const startTop = this.container.offsetTop;

                    this.container.style.zIndex = aiMultiWindow.getHighestZIndex() + 1;

                    const onMouseMove = (e) => {
                        if (!isResizing) return;
                        const dx = e.clientX - startX;
                        const dy = e.clientY - startY;

                        if (position.includes('e')) {
                            const newWidth = Math.max(minWidth, startWidth + dx);
                            this.container.style.width = `${newWidth}px`;
                        }
                        if (position.includes('w')) {
                            const newWidth = Math.max(minWidth, startWidth - dx);
                            if (newWidth > minWidth) {
                                this.container.style.width = `${newWidth}px`;
                                this.container.style.left = `${startLeft + dx}px`;
                            }
                        }
                        if (position.includes('s')) {
                            const newHeight = Math.max(minHeight, startHeight + dy);
                            this.container.style.height = `${newHeight}px`;
                        }
                    };

                    const onMouseUp = () => {
                        isResizing = false;
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
            });
        }

        close() {
            this.container.remove();
            aiMultiWindow.windows.delete(this.windowId);
        }
    }

    // ===== Main Multi-Window Manager =====
    class AIMultiWindow {
        constructor() {
            this.windows = new Map();
            this.windowCounter = 0;
            this.initialMessage = '';
            this.settingsPanel = new SettingsPanel();
            this.init();
        }

        async init() {
            this.setupTextSelection();
            this.setupKeyboardShortcuts();
            this.settingsPanel.init();

            // Register menu command
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand(t('menu__openSettings'), () => {
                    this.settingsPanel.show();
                });
            }
        }

        setupTextSelection() {
            let selectionTimeout;
            let toolbar = null;

            document.addEventListener('mouseup', (e) => {
                if (e.target.closest('.ai-multi-window') || e.target.closest('.ai-selection-toolbar')) return;

                clearTimeout(selectionTimeout);
                selectionTimeout = setTimeout(() => {
                    this.handleTextSelection(e);
                }, 300);
            });

            document.addEventListener('mousedown', (e) => {
                if (!e.target.closest('.ai-selection-toolbar')) {
                    if (toolbar) toolbar.style.display = 'none';
                }
            });
        }

        handleTextSelection(event) {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText.length < 2) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            this.showToolbar(rect, selectedText);
        }

        showToolbar(rect, selectedText) {
            let toolbar = document.querySelector('.ai-selection-toolbar');

            if (!toolbar) {
                toolbar = document.createElement('div');
                toolbar.className = 'ai-selection-toolbar';
                toolbar.innerHTML = `
                    <button class="ai-toolbar-btn" title="${t('content__toolbarChat')}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        </svg>
                        <span>${t('content__toolbarBtnChat')}</span>
                    </button>
                `;

                const btn = toolbar.querySelector('.ai-toolbar-btn');
                btn.addEventListener('click', () => {
                    const text = toolbar.dataset.selectedText;
                    this.createChatWindow(text);
                    toolbar.style.display = 'none';
                });

                document.body.appendChild(toolbar);
            }

            toolbar.dataset.selectedText = selectedText;

            const toolbarRect = toolbar.getBoundingClientRect();
            let top = rect.top - toolbarRect.height - 8;
            let left = rect.left + (rect.width - toolbarRect.width) / 2;

            if (top < 10) top = rect.bottom + 8;
            if (left < 10) left = 10;
            if (left + toolbarRect.width > window.innerWidth - 10) {
                left = window.innerWidth - toolbarRect.width - 10;
            }

            toolbar.style.top = `${top + window.scrollY}px`;
            toolbar.style.left = `${left + window.scrollX}px`;
            toolbar.style.display = 'flex';
        }

        createChatWindow(initialMessage = '', chatId = null, title = null, messages = null, promptId = null) {
            this.windowCounter++;
            const windowId = `ai-window-${this.windowCounter}`;
            const windowNumber = this.windowCounter;

            const win = new ChatWindow(windowId, windowNumber, {
                title,
                chatId,
                messages,
                promptId
            });

            this.windows.set(windowId, win);
            this.initialMessage = initialMessage;

            if (initialMessage) {
                setTimeout(() => {
                    win.messageInput.value = initialMessage;
                    win.messageInput.focus();
                }, 100);
            }

            return windowId;
        }

        getHighestZIndex() {
            let max = 100;
            document.querySelectorAll('.ai-multi-window').forEach(win => {
                const zIndex = parseInt(window.getComputedStyle(win).zIndex) || 100;
                if (zIndex > max) max = zIndex;
            });
            return max;
        }

        resumeChat(chatId) {
            const history = Storage.get(STORAGE_KEYS.chatHistory) || [];
            const chat = history.find(h => h.chatId === chatId);

            if (chat) {
                this.settingsPanel.hide();
                this.createChatWindow('', chat.chatId, chat.title, chat.messages, chat.promptId);
            }
        }

        deleteChat(chatId) {
            const history = Storage.get(STORAGE_KEYS.chatHistory) || [];
            const newHistory = history.filter(h => h.chatId !== chatId);
            Storage.set(STORAGE_KEYS.chatHistory, newHistory);
            this.settingsPanel.loadHistory();
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 'n') {
                    e.preventDefault();
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();
                    this.createChatWindow(selectedText);
                }

                if (e.altKey && e.key === 'Escape') {
                    e.preventDefault();
                    this.windows.forEach((win) => win.close());
                }
            });
        }
    }

    // Initialize
    const aiMultiWindow = new AIMultiWindow();

    // Expose for history actions
    window.aiMultiWindow = aiMultiWindow;

    console.log(t('extName') + ' loaded');
})();
