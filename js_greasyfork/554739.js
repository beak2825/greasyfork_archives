// ==UserScript==
// @name         Linux.do 大召唤师
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  进行一个呼朋唤友～
// @author       Maple_oWo
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554739/Linuxdo%20%E5%A4%A7%E5%8F%AC%E5%94%A4%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554739/Linuxdo%20%E5%A4%A7%E5%8F%AC%E5%94%A4%E5%B8%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // 数据层 (Data Layer)
    // ========================================

    /**
     * 默认配置
     */
    const DEFAULT_CONFIG = {
        groups: {
            "示例分组": {
                id: "example-group",
                members: [
                    { username: "user1", displayName: "用户1" },
                    { username: "user2", displayName: "用户2" }
                ],
                enabled: true
            }
        }
    };

    /**
     * 配置管理器
     * 职责：持久化存储配置数据
     */
    class ConfigManager {
        constructor() {
            this.storageKey = 'summoner_config';
        }

        load() {
            try {
                const stored = GM_getValue(this.storageKey, null);
                if (stored) {
                    return this.validate(stored) ? stored : DEFAULT_CONFIG;
                }
                return DEFAULT_CONFIG;
            } catch (error) {
                console.error('[召唤师] 加载配置失败:', error);
                return DEFAULT_CONFIG;
            }
        }

        save(config) {
            try {
                if (!this.validate(config)) {
                    throw new Error('配置数据格式无效');
                }
                GM_setValue(this.storageKey, config);
                return true;
            } catch (error) {
                console.error('[召唤师] 保存配置失败:', error);
                return false;
            }
        }

        validate(config) {
            if (!config || typeof config !== 'object') return false;
            if (!config.groups || typeof config.groups !== 'object') return false;
            return true;
        }

        reset() {
            return this.save(DEFAULT_CONFIG);
        }
    }

    // ========================================
    // 业务逻辑层 (Business Logic Layer)
    // ========================================

    /**
     * @用户生成器
     * 职责：将分组成员转换为 @用户名 格式
     */
    class MentionGenerator {
        constructor(config) {
            this.config = config;
        }

        generate(groupName) {
            const group = this.config.groups[groupName];
            if (!group || !group.enabled) {
                return null;
            }

            return group.members
                .map(member => `@${member.username}`)
                .join(' ');
        }
    }

    // ========================================
    // UI 层 (UI Layer)
    // ========================================

    /**
     * iOS 18 风格样式
     */
    const iOS18Styles = `
        :root {
            --summoner-primary: #007AFF;
            --summoner-secondary: #8E8E93;
            --summoner-background: rgba(255, 255, 255, 0.95);
            --summoner-surface: #F2F2F7;
            --summoner-text-primary: #000000;
            --summoner-text-secondary: #3C3C43;
            --summoner-border: rgba(60, 60, 67, 0.18);
            --summoner-success: #34C759;
            --summoner-error: #FF3B30;
            --summoner-warning: #FF9500;
            --summoner-radius-sm: 8px;
            --summoner-radius-md: 12px;
            --summoner-radius-lg: 16px;
            --summoner-spacing-xs: 4px;
            --summoner-spacing-sm: 8px;
            --summoner-spacing-md: 16px;
            --summoner-spacing-lg: 24px;
            --summoner-font-sm: 13px;
            --summoner-font-md: 15px;
            --summoner-font-lg: 17px;
        }

        /* 配置面板容器 */
        .summoner-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 85%;
            max-width: 520px;
            max-height: 75vh;
            background: var(--summoner-background);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: var(--summoner-radius-lg);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: summoner-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 用户提示条 */
        .summoner-user-hint {
            padding: var(--summoner-spacing-md);
            background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05));
            border-bottom: 1px solid var(--summoner-border);
            display: flex;
            align-items: center;
            gap: var(--summoner-spacing-sm);
            animation: summoner-hint-slide 0.3s ease-out;
        }

        @keyframes summoner-hint-slide {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .summoner-user-hint-icon {
            font-size: 20px;
        }

        .summoner-user-hint-text {
            flex: 1;
            font-size: var(--summoner-font-md);
            color: var(--summoner-text-primary);
        }

        .summoner-user-hint-text strong {
            color: var(--summoner-primary);
            font-weight: 600;
        }

        .summoner-user-hint-close {
            background: none;
            border: none;
            color: var(--summoner-secondary);
            cursor: pointer;
            padding: var(--summoner-spacing-xs);
            font-size: 18px;
            line-height: 1;
            border-radius: var(--summoner-radius-sm);
            transition: all 0.2s;
        }

        .summoner-user-hint-close:hover {
            background: rgba(0, 0, 0, 0.05);
            color: var(--summoner-text-primary);
        }

        @keyframes summoner-slide-in {
            from {
                opacity: 0;
                transform: translate(-50%, -48%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }

        /* 标题栏 */
        .summoner-header {
            padding: var(--summoner-spacing-md);
            border-bottom: 1px solid var(--summoner-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--summoner-surface);
        }

        .summoner-title {
            font-size: var(--summoner-font-lg);
            font-weight: 600;
            color: var(--summoner-text-primary);
            margin: 0;
        }

        .summoner-close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--summoner-secondary);
            cursor: pointer;
            padding: var(--summoner-spacing-xs);
            line-height: 1;
            transition: color 0.2s;
        }

        .summoner-close-btn:hover {
            color: var(--summoner-text-primary);
        }

        /* 内容区 */
        .summoner-content {
            flex: 1;
            overflow-y: auto;
            padding: var(--summoner-spacing-lg);
        }

        /* 分组列表 */
        .summoner-groups {
            display: flex;
            flex-direction: column;
            gap: var(--summoner-spacing-md);
        }

        .summoner-group {
            background: white;
            border-radius: var(--summoner-radius-md);
            padding: var(--summoner-spacing-md);
            border: 1px solid var(--summoner-border);
        }

        .summoner-group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--summoner-spacing-sm);
        }

        .summoner-group-title {
            display: flex;
            align-items: center;
            gap: var(--summoner-spacing-sm);
            flex: 1;
        }

        .summoner-group-name {
            font-size: var(--summoner-font-md);
            font-weight: 500;
            color: var(--summoner-text-primary);
        }

        .summoner-group-name.editing {
            display: none;
        }

        .summoner-group-name-input {
            display: none;
            padding: 4px 8px;
            border: 1px solid var(--summoner-primary);
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-md);
            outline: none;
        }

        .summoner-group-name-input.editing {
            display: block;
        }

        .summoner-group-actions {
            display: flex;
            gap: var(--summoner-spacing-xs);
        }

        .summoner-icon-btn {
            background: none;
            border: none;
            padding: var(--summoner-spacing-xs);
            cursor: pointer;
            color: var(--summoner-secondary);
            font-size: 16px;
            transition: color 0.2s;
            border-radius: var(--summoner-radius-sm);
        }

        .summoner-icon-btn:hover {
            color: var(--summoner-text-primary);
            background: var(--summoner-surface);
        }

        .summoner-icon-btn.danger:hover {
            color: var(--summoner-error);
        }

        .summoner-group-toggle {
            position: relative;
            width: 51px;
            height: 31px;
            background: var(--summoner-secondary);
            border-radius: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            flex-shrink: 0;
        }

        .summoner-group-toggle.active {
            background: var(--summoner-success);
        }

        .summoner-group-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 27px;
            height: 27px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .summoner-group-toggle.active::after {
            transform: translateX(20px);
        }

        .summoner-members {
            display: flex;
            flex-wrap: wrap;
            gap: var(--summoner-spacing-sm);
            margin-top: var(--summoner-spacing-sm);
        }

        .summoner-member {
            display: inline-flex;
            align-items: center;
            gap: var(--summoner-spacing-xs);
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-sm);
            background: var(--summoner-surface);
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            color: var(--summoner-text-secondary);
            position: relative;
            padding-right: 24px;
        }

        .summoner-member-remove {
            position: absolute;
            right: 4px;
            background: none;
            border: none;
            color: var(--summoner-secondary);
            cursor: pointer;
            font-size: 12px;
            padding: 2px;
            line-height: 1;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .summoner-member-remove:hover {
            color: var(--summoner-error);
            background: rgba(255, 59, 48, 0.1);
        }

        .summoner-add-member {
            display: inline-flex;
            align-items: center;
            gap: var(--summoner-spacing-xs);
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-sm);
            background: var(--summoner-primary);
            color: white;
            border: none;
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            cursor: pointer;
            transition: all 0.2s;
        }

        .summoner-add-member:hover {
            background: #0051D5;
            transform: scale(1.05);
        }

        /* 快速添加用户按钮 */
        .summoner-quick-add-user {
            display: inline-flex;
            align-items: center;
            gap: var(--summoner-spacing-xs);
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-sm);
            background: var(--summoner-success);
            color: white;
            border: none;
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            cursor: pointer;
            transition: all 0.2s;
            animation: summoner-pulse-highlight 1s ease-in-out infinite;
        }

        @keyframes summoner-pulse-highlight {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.4);
            }
            50% {
                box-shadow: 0 0 0 4px rgba(52, 199, 89, 0);
            }
        }

        .summoner-quick-add-user:hover {
            background: #28a745;
            transform: scale(1.05);
            animation: none;
        }

        .summoner-quick-add-user:active {
            transform: scale(0.95);
        }

        /* 添加成员输入区 */
        .summoner-member-input-area {
            display: none;
            margin-top: var(--summoner-spacing-sm);
            padding: var(--summoner-spacing-sm);
            background: var(--summoner-surface);
            border-radius: var(--summoner-radius-sm);
            gap: var(--summoner-spacing-sm);
        }

        .summoner-member-input-area.active {
            display: flex;
        }

        .summoner-member-input-area input {
            flex: 1;
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-sm);
            border: 1px solid var(--summoner-border);
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            outline: none;
        }

        .summoner-member-input-area input:focus {
            border-color: var(--summoner-primary);
        }

        .summoner-member-input-area button {
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-md);
            border: none;
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            cursor: pointer;
            transition: all 0.2s;
        }

        .summoner-member-input-area .confirm-btn {
            background: var(--summoner-primary);
            color: white;
        }

        .summoner-member-input-area .cancel-btn {
            background: var(--summoner-secondary);
            color: white;
        }

        /* 批量导入按钮 */
        .summoner-batch-import {
            display: inline-flex;
            align-items: center;
            gap: var(--summoner-spacing-xs);
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-sm);
            background: var(--summoner-success);
            color: white;
            border: none;
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            cursor: pointer;
            transition: all 0.2s;
        }

        .summoner-batch-import:hover {
            background: #28a745;
            transform: scale(1.05);
        }

        /* 批量导入输入区 */
        .summoner-batch-input-area {
            display: none;
            margin-top: var(--summoner-spacing-sm);
            padding: var(--summoner-spacing-md);
            background: var(--summoner-surface);
            border-radius: var(--summoner-radius-sm);
            flex-direction: column;
            gap: var(--summoner-spacing-sm);
        }

        .summoner-batch-input-area.active {
            display: flex;
        }

        .summoner-batch-input-area textarea {
            width: 100%;
            min-height: 120px;
            padding: var(--summoner-spacing-sm);
            border: 1px solid var(--summoner-border);
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            font-family: monospace;
            outline: none;
            resize: vertical;
            box-sizing: border-box;
        }

        .summoner-batch-input-area textarea:focus {
            border-color: var(--summoner-primary);
        }

        .summoner-batch-input-area .hint {
            font-size: 12px;
            color: var(--summoner-text-secondary);
            line-height: 1.4;
        }

        .summoner-batch-input-area .buttons {
            display: flex;
            gap: var(--summoner-spacing-sm);
        }

        .summoner-batch-input-area button {
            flex: 1;
            padding: var(--summoner-spacing-xs) var(--summoner-spacing-md);
            border: none;
            border-radius: var(--summoner-radius-sm);
            font-size: var(--summoner-font-sm);
            cursor: pointer;
            transition: all 0.2s;
        }

        .summoner-batch-input-area .import-btn {
            background: var(--summoner-success);
            color: white;
        }

        .summoner-batch-input-area .import-btn:hover {
            background: #28a745;
        }

        .summoner-batch-input-area .cancel-batch-btn {
            background: var(--summoner-secondary);
            color: white;
        }

        /* 添加分组按钮 */
        .summoner-add-group {
            width: 100%;
            padding: var(--summoner-spacing-md);
            background: white;
            border: 2px dashed var(--summoner-border);
            border-radius: var(--summoner-radius-md);
            color: var(--summoner-secondary);
            font-size: var(--summoner-font-md);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--summoner-spacing-sm);
        }

        .summoner-add-group:hover {
            border-color: var(--summoner-primary);
            color: var(--summoner-primary);
            background: rgba(0, 122, 255, 0.05);
        }

        /* 底部操作栏 */
        .summoner-footer {
            padding: var(--summoner-spacing-md);
            border-top: 1px solid var(--summoner-border);
            display: flex;
            gap: var(--summoner-spacing-sm);
            background: var(--summoner-surface);
        }

        .summoner-btn {
            flex: 1;
            padding: var(--summoner-spacing-sm) var(--summoner-spacing-md);
            border-radius: var(--summoner-radius-md);
            font-size: var(--summoner-font-md);
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .summoner-btn-primary {
            background: var(--summoner-primary);
            color: white;
        }

        .summoner-btn-primary:hover {
            background: #0051D5;
            transform: scale(1.02);
        }

        .summoner-btn-primary:active {
            transform: scale(0.98);
        }

        .summoner-btn-secondary {
            background: white;
            color: var(--summoner-primary);
            border: 1px solid var(--summoner-border);
        }

        .summoner-btn-secondary:hover {
            background: var(--summoner-surface);
        }

        /* 浮动按钮 */
        .summoner-fab {
            position: fixed;
            bottom: var(--summoner-spacing-lg);
            left: var(--summoner-spacing-lg);
            width: 48px;
            height: 48px;
            background: var(--summoner-primary);
            border-radius: 50%;
            border: none;
            color: white;
            font-size: 22px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }

        .summoner-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 122, 255, 0.5);
        }

        .summoner-fab:active {
            transform: scale(0.95);
        }

        .summoner-fab.long-pressing {
            background: var(--summoner-warning);
            animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        /* 召唤菜单 */
        .summoner-menu {
            position: fixed;
            bottom: 90px;
            left: var(--summoner-spacing-lg);
            background: var(--summoner-background);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: var(--summoner-radius-md);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            min-width: 200px;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
            animation: summoner-menu-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes summoner-menu-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .summoner-menu-header {
            padding: var(--summoner-spacing-md);
            border-bottom: 1px solid var(--summoner-border);
            font-size: var(--summoner-font-md);
            font-weight: 600;
            color: var(--summoner-text-primary);
        }

        .summoner-menu-item {
            padding: var(--summoner-spacing-md);
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--summoner-border);
        }

        .summoner-menu-item:last-child {
            border-bottom: none;
        }

        .summoner-menu-item:hover {
            background: var(--summoner-surface);
        }

        .summoner-menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .summoner-menu-item-name {
            font-size: var(--summoner-font-md);
            color: var(--summoner-text-primary);
        }

        .summoner-menu-item-count {
            font-size: var(--summoner-font-sm);
            color: var(--summoner-text-secondary);
        }

        /* 用户卡片按钮 */
        .summoner-usercard-item {
            width: 100%;
        }

        .summoner-usercard-btn {
            width: 100%;
            display: flex !important;
            align-items: center;
            justify-content: flex-start;
            gap: 6px;
            padding: 8px 12px;
            background: var(--summoner-primary);
            color: white !important;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .summoner-usercard-btn:hover {
            background: #0051D5 !important;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
        }

        .summoner-usercard-btn:active {
            transform: translateY(0);
        }

        /* 确保按钮内的文本样式正确 */
        .summoner-usercard-btn .d-button-label {
            color: white !important;
            font-size: 14px;
        }

        /* 分组选择弹窗 */
        .summoner-group-selector {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--summoner-background);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: var(--summoner-radius-lg);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            min-width: 300px;
            max-width: 400px;
            animation: summoner-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .summoner-group-selector-header {
            padding: var(--summoner-spacing-md);
            border-bottom: 1px solid var(--summoner-border);
            font-size: var(--summoner-font-lg);
            font-weight: 600;
            color: var(--summoner-text-primary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .summoner-group-selector-content {
            max-height: 400px;
            overflow-y: auto;
        }

        .summoner-group-selector-item {
            padding: var(--summoner-spacing-md);
            cursor: pointer;
            transition: background 0.2s;
            border-bottom: 1px solid var(--summoner-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .summoner-group-selector-item:last-child {
            border-bottom: none;
        }

        .summoner-group-selector-item:hover {
            background: var(--summoner-surface);
        }

        .summoner-group-selector-item.selected {
            background: rgba(0, 122, 255, 0.1);
        }

        /* 提示组件 */
        .summoner-toast {
            position: fixed;
            bottom: var(--summoner-spacing-lg);
            left: 50%;
            transform: translateX(-50%);
            padding: var(--summoner-spacing-md) var(--summoner-spacing-lg);
            background: var(--summoner-text-primary);
            color: white;
            border-radius: var(--summoner-radius-md);
            font-size: var(--summoner-font-md);
            z-index: 10002;
            animation: summoner-toast-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes summoner-toast-in {
            from {
                opacity: 0;
                transform: translate(-50%, 20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }

        .summoner-toast.success {
            background: var(--summoner-success);
        }

        .summoner-toast.error {
            background: var(--summoner-error);
        }

        .summoner-toast.warning {
            background: var(--summoner-warning);
        }

        /* 遮罩层 */
        .summoner-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            animation: summoner-fade-in 0.3s;
        }

        @keyframes summoner-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 滚动条样式 */
        .summoner-content::-webkit-scrollbar,
        .summoner-menu::-webkit-scrollbar,
        .summoner-group-selector-content::-webkit-scrollbar {
            width: 8px;
        }

        .summoner-content::-webkit-scrollbar-track,
        .summoner-menu::-webkit-scrollbar-track,
        .summoner-group-selector-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .summoner-content::-webkit-scrollbar-thumb,
        .summoner-menu::-webkit-scrollbar-thumb,
        .summoner-group-selector-content::-webkit-scrollbar-thumb {
            background: var(--summoner-secondary);
            border-radius: 4px;
        }

        .summoner-content::-webkit-scrollbar-thumb:hover,
        .summoner-menu::-webkit-scrollbar-thumb:hover,
        .summoner-group-selector-content::-webkit-scrollbar-thumb:hover {
            background: var(--summoner-text-secondary);
        }
    `;

    /**
     * UI 管理器
     */
    class UIManager {
        constructor(config, onConfigChange) {
            this.config = config;
            this.onConfigChange = onConfigChange;
            this.panel = null;
            this.overlay = null;
            this.fab = null;
            this.menu = null;
            this.longPressTimer = null;
            this.isLongPress = false;
            this.savedActiveEditor = null; // 保存聚焦的编辑器
            this.pendingUsername = null; // 待添加的用户名
        }

        /**
         * 解析用户名或 URL，提取用户名
         * @param {string} input - 用户输入的字符串（用户名或 URL）
         * @returns {string|null} - 提取的用户名，失败返回 null
         */
        parseUsername(input) {
            const trimmed = input.trim();
            if (!trimmed) return null;

            // 尝试从 URL 中提取用户名
            // 匹配格式：https://linux.do/u/用户名/... 或 /u/用户名/...
            const urlMatch = trimmed.match(/\/u\/([^\/\s]+)/);
            if (urlMatch) {
                return urlMatch[1];
            }

            // 如果不是 URL，直接作为用户名返回（去除 @ 符号）
            return trimmed.replace(/^@/, '');
        }

        /**
         * 批量解析用户名列表
         * @param {string} text - 多行文本
         * @returns {string[]} - 提取的用户名数组（去重）
         */
        parseBatchUsernames(text) {
            const lines = text.split('\n');
            const usernames = new Set();

            for (const line of lines) {
                const username = this.parseUsername(line);
                if (username) {
                    usernames.add(username);
                }
            }

            return Array.from(usernames);
        }

        init() {
            GM_addStyle(iOS18Styles);
            this.createFAB();
        }

        createFAB() {
            this.fab = document.createElement('button');
            this.fab.className = 'summoner-fab';
            this.fab.innerHTML = '🧙‍♂️';
            this.fab.title = '召唤师';
            this.fab.tabIndex = -1; // 防止按钮获得焦点

            // 鼠标事件
            this.fab.addEventListener('mousedown', (e) => this.handleFABMouseDown(e));
            this.fab.addEventListener('mouseup', (e) => this.handleFABMouseUp(e));
            this.fab.addEventListener('mouseleave', () => this.handleFABMouseLeave());

            // 触摸事件
            this.fab.addEventListener('touchstart', (e) => this.handleFABMouseDown(e));
            this.fab.addEventListener('touchend', (e) => this.handleFABMouseUp(e));
            this.fab.addEventListener('touchcancel', () => this.handleFABMouseLeave());

            document.body.appendChild(this.fab);
        }

        handleFABMouseDown(e) {
            e.preventDefault(); // 防止按钮获得焦点

            // 保存当前聚焦的编辑器
            this.savedActiveEditor = document.querySelector('textarea.d-editor-input:focus, .reply-area textarea:focus');

            this.isLongPress = false;
            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.fab.classList.add('long-pressing');
                this.showSummonMenu();
            }, 500);
        }

        handleFABMouseUp(e) {
            e.preventDefault(); // 防止按钮获得焦点
            clearTimeout(this.longPressTimer);
            this.fab.classList.remove('long-pressing');

            if (!this.isLongPress) {
                // 短按：打开配置
                this.showPanel();
            }
        }

        handleFABMouseLeave() {
            clearTimeout(this.longPressTimer);
            this.fab.classList.remove('long-pressing');
        }

        showPanel(username = null) {
            if (this.panel) return;

            // 保存待添加的用户名
            this.pendingUsername = username;

            this.overlay = document.createElement('div');
            this.overlay.className = 'summoner-overlay';
            this.overlay.addEventListener('click', () => this.hidePanel());

            this.panel = document.createElement('div');
            this.panel.className = 'summoner-panel';
            this.panel.innerHTML = this.renderPanel();

            document.body.appendChild(this.overlay);
            document.body.appendChild(this.panel);

            this.bindPanelEvents();
        }

        renderPanel() {
            // 检查是否有待添加的用户
            const hasQuickAdd = this.pendingUsername;
            const username = this.pendingUsername;

            const groupsHTML = Object.entries(this.config.groups)
                .map(([name, group]) => {
                    const isMember = hasQuickAdd && group.members.some(m => m.username === username);
                    const showQuickAdd = hasQuickAdd && !isMember;

                    return `
                        <div class="summoner-group" data-group="${name}">
                            <div class="summoner-group-header">
                                <div class="summoner-group-title">
                                    <span class="summoner-group-name">${name}</span>
                                    <input type="text" class="summoner-group-name-input" value="${name}" />
                                    <div class="summoner-group-actions">
                                        <button class="summoner-icon-btn edit-group" title="编辑分组名">✏️</button>
                                        <button class="summoner-icon-btn danger delete-group" title="删除分组">🗑️</button>
                                    </div>
                                </div>
                                <div class="summoner-group-toggle ${group.enabled ? 'active' : ''}" data-group="${name}"></div>
                            </div>
                            <div class="summoner-members">
                                ${group.members.map(m => `
                                    <span class="summoner-member" data-username="${m.username}">
                                        <span>@${m.username}</span>
                                        <button class="summoner-member-remove" title="移除成员">×</button>
                                    </span>
                                `).join('')}
                                ${showQuickAdd ? `
                                    <button class="summoner-quick-add-user" data-username="${username}">
                                        ✨ 添加 @${username}
                                    </button>
                                ` : ''}
                                <button class="summoner-add-member">+ 添加成员</button>
                                <button class="summoner-batch-import">📋 批量导入</button>
                            </div>
                            <div class="summoner-member-input-area">
                                <input type="text" placeholder="输入用户名" class="member-username-input" value="${hasQuickAdd && !showQuickAdd ? '' : hasQuickAdd ? username : ''}" />
                                <button class="confirm-btn">确定</button>
                                <button class="cancel-btn">取消</button>
                            </div>
                            <div class="summoner-batch-input-area">
                                <div class="hint">
                                    💡 每行一个用户名或用户主页链接<br>
                                    支持格式：<br>
                                    • 用户名：xiyu-link<br>
                                    • 用户链接：https://linux.do/u/xiyu-link/activity
                                </div>
                                <textarea placeholder="xiyu-link&#10;https://linux.do/u/another-user/summary&#10;user3" class="batch-textarea"></textarea>
                                <div class="buttons">
                                    <button class="import-btn">导入</button>
                                    <button class="cancel-batch-btn">取消</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

            // 用户提示条
            const userHintHTML = hasQuickAdd ? `
                <div class="summoner-user-hint">
                    <span class="summoner-user-hint-icon">👤</span>
                    <span class="summoner-user-hint-text">
                        正在添加 <strong>@${username}</strong> -
                        点击下方分组中的 <strong>✨ 添加</strong> 按钮，或创建新分组后添加
                    </span>
                    <button class="summoner-user-hint-close">×</button>
                </div>
            ` : '';

            return `
                <div class="summoner-header">
                    <h2 class="summoner-title">✨ 召唤师配置</h2>
                    <button class="summoner-close-btn">×</button>
                </div>
                ${userHintHTML}
                <div class="summoner-content">
                    <div class="summoner-groups">
                        ${groupsHTML}
                        <button class="summoner-add-group">
                            <span>➕</span>
                            <span>${hasQuickAdd ? `创建新分组并添加 @${username}` : '添加新分组'}</span>
                        </button>
                    </div>
                </div>
                <div class="summoner-footer">
                    <button class="summoner-btn summoner-btn-secondary" data-action="reset">重置</button>
                    <button class="summoner-btn summoner-btn-primary" data-action="save">保存</button>
                </div>
            `;
        }

        bindPanelEvents() {
            // 关闭按钮
            const closeBtn = this.panel.querySelector('.summoner-close-btn');
            closeBtn.addEventListener('click', () => this.hidePanel());

            // 用户提示条关闭按钮
            const hintCloseBtn = this.panel.querySelector('.summoner-user-hint-close');
            if (hintCloseBtn) {
                hintCloseBtn.addEventListener('click', () => {
                    this.pendingUsername = null;
                    this.hidePanel();
                    setTimeout(() => this.showPanel(), 100);
                });
            }

            // 快速添加用户按钮
            this.panel.querySelectorAll('.summoner-quick-add-user').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const username = e.target.dataset.username || e.target.closest('.summoner-quick-add-user').dataset.username;
                    const groupDiv = e.target.closest('.summoner-group');
                    const groupName = groupDiv.dataset.group;

                    // 添加成员
                    this.config.groups[groupName].members.push({
                        username: username,
                        displayName: username
                    });

                    // 清除待添加用户
                    this.pendingUsername = null;

                    // 保存配置
                    this.onConfigChange(this.config);

                    // 刷新面板
                    this.hidePanel();
                    setTimeout(() => {
                        this.showPanel();
                        this.showToast(`已将 @${username} 添加到"${groupName}"`, 'success');
                    }, 100);
                });
            });

            // 分组开关
            const toggles = this.panel.querySelectorAll('.summoner-group-toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    const groupName = e.target.dataset.group;
                    e.target.classList.toggle('active');
                    this.config.groups[groupName].enabled = e.target.classList.contains('active');
                });
            });

            // 编辑分组名
            this.panel.querySelectorAll('.edit-group').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const nameSpan = groupDiv.querySelector('.summoner-group-name');
                    const nameInput = groupDiv.querySelector('.summoner-group-name-input');

                    if (nameSpan.classList.contains('editing')) {
                        // 保存编辑
                        const oldName = nameSpan.textContent;
                        const newName = nameInput.value.trim();

                        if (newName && newName !== oldName) {
                            if (this.config.groups[newName]) {
                                this.showToast('分组名已存在', 'error');
                                return;
                            }

                            this.config.groups[newName] = this.config.groups[oldName];
                            delete this.config.groups[oldName];
                            nameSpan.textContent = newName;
                            groupDiv.dataset.group = newName;
                        }

                        nameSpan.classList.remove('editing');
                        nameInput.classList.remove('editing');
                    } else {
                        // 进入编辑
                        nameSpan.classList.add('editing');
                        nameInput.classList.add('editing');
                        nameInput.focus();
                        nameInput.select();
                    }
                });
            });

            // 删除分组
            this.panel.querySelectorAll('.delete-group').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const groupName = groupDiv.dataset.group;

                    if (confirm(`确定要删除分组"${groupName}"吗？`)) {
                        delete this.config.groups[groupName];
                        groupDiv.remove();
                        this.showToast('分组已删除', 'success');
                    }
                });
            });

            // 添加成员按钮
            this.panel.querySelectorAll('.summoner-add-member').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const inputArea = groupDiv.querySelector('.summoner-member-input-area');
                    inputArea.classList.add('active');
                    inputArea.querySelector('.member-username-input').focus();
                });
            });

            // 确认添加成员
            this.panel.querySelectorAll('.summoner-member-input-area .confirm-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const groupName = groupDiv.dataset.group;
                    const inputArea = groupDiv.querySelector('.summoner-member-input-area');
                    const input = inputArea.querySelector('.member-username-input');
                    const username = input.value.trim();

                    if (!username) {
                        this.showToast('请输入用户名', 'error');
                        return;
                    }

                    // 检查是否已存在
                    if (this.config.groups[groupName].members.some(m => m.username === username)) {
                        this.showToast('该用户已在分组中', 'error');
                        return;
                    }

                    this.config.groups[groupName].members.push({
                        username: username,
                        displayName: username
                    });

                    input.value = '';
                    inputArea.classList.remove('active');

                    // 刷新面板
                    this.hidePanel();
                    setTimeout(() => this.showPanel(), 100);
                });
            });

            // 取消添加成员
            this.panel.querySelectorAll('.summoner-member-input-area .cancel-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const inputArea = e.target.closest('.summoner-member-input-area');
                    inputArea.classList.remove('active');
                    inputArea.querySelector('.member-username-input').value = '';
                });
            });

            // 批量导入按钮
            this.panel.querySelectorAll('.summoner-batch-import').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const batchArea = groupDiv.querySelector('.summoner-batch-input-area');
                    batchArea.classList.add('active');
                    batchArea.querySelector('.batch-textarea').focus();
                });
            });

            // 确认批量导入
            this.panel.querySelectorAll('.summoner-batch-input-area .import-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupDiv = e.target.closest('.summoner-group');
                    const groupName = groupDiv.dataset.group;
                    const batchArea = groupDiv.querySelector('.summoner-batch-input-area');
                    const textarea = batchArea.querySelector('.batch-textarea');
                    const text = textarea.value;

                    if (!text.trim()) {
                        this.showToast('请输入用户名或链接', 'error');
                        return;
                    }

                    // 解析用户名列表
                    const usernames = this.parseBatchUsernames(text);

                    if (usernames.length === 0) {
                        this.showToast('未能识别到有效的用户名', 'error');
                        return;
                    }

                    // 添加用户到分组（去重）
                    let addedCount = 0;
                    let skippedCount = 0;

                    usernames.forEach(username => {
                        // 检查是否已存在
                        if (this.config.groups[groupName].members.some(m => m.username === username)) {
                            skippedCount++;
                        } else {
                            this.config.groups[groupName].members.push({
                                username: username,
                                displayName: username
                            });
                            addedCount++;
                        }
                    });

                    textarea.value = '';
                    batchArea.classList.remove('active');

                    // 保存并刷新
                    this.hidePanel();
                    setTimeout(() => {
                        this.showPanel();
                        const message = `成功导入 ${addedCount} 个用户` +
                            (skippedCount > 0 ? `，跳过 ${skippedCount} 个重复` : '');
                        this.showToast(message, 'success');
                    }, 100);
                });
            });

            // 取消批量导入
            this.panel.querySelectorAll('.summoner-batch-input-area .cancel-batch-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const batchArea = e.target.closest('.summoner-batch-input-area');
                    batchArea.classList.remove('active');
                    batchArea.querySelector('.batch-textarea').value = '';
                });
            });

            // 移除成员
            this.panel.querySelectorAll('.summoner-member-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const memberSpan = e.target.closest('.summoner-member');
                    const username = memberSpan.dataset.username;
                    const groupDiv = memberSpan.closest('.summoner-group');
                    const groupName = groupDiv.dataset.group;

                    this.config.groups[groupName].members =
                        this.config.groups[groupName].members.filter(m => m.username !== username);

                    memberSpan.remove();
                    this.showToast('成员已移除', 'success');
                });
            });

            // 添加新分组
            const addGroupBtn = this.panel.querySelector('.summoner-add-group');
            addGroupBtn.addEventListener('click', () => {
                const defaultName = this.pendingUsername ? `${this.pendingUsername}的分组` : '';
                const groupName = prompt('请输入新分组名称：', defaultName);
                if (!groupName || !groupName.trim()) return;

                const trimmedName = groupName.trim();
                if (this.config.groups[trimmedName]) {
                    this.showToast('分组名已存在', 'error');
                    return;
                }

                // 创建新分组
                const members = this.pendingUsername ? [{
                    username: this.pendingUsername,
                    displayName: this.pendingUsername
                }] : [];

                this.config.groups[trimmedName] = {
                    id: `group-${Date.now()}`,
                    members: members,
                    enabled: true
                };

                // 如果添加了用户，清除待添加状态
                const addedUser = this.pendingUsername;
                if (this.pendingUsername) {
                    this.pendingUsername = null;
                }

                // 刷新面板
                this.hidePanel();
                setTimeout(() => {
                    this.showPanel();
                    if (addedUser) {
                        this.showToast(`已创建"${trimmedName}"并添加 @${addedUser}`, 'success');
                    }
                }, 100);
            });

            // 保存按钮
            const saveBtn = this.panel.querySelector('[data-action="save"]');
            saveBtn.addEventListener('click', () => {
                if (this.onConfigChange(this.config)) {
                    this.showToast('配置已保存', 'success');
                    this.hidePanel();
                } else {
                    this.showToast('保存失败', 'error');
                }
            });

            // 重置按钮
            const resetBtn = this.panel.querySelector('[data-action="reset"]');
            resetBtn.addEventListener('click', () => {
                if (confirm('确定要重置所有配置吗？')) {
                    this.config = { ...DEFAULT_CONFIG };
                    this.hidePanel();
                    setTimeout(() => this.showPanel(), 100);
                }
            });
        }

        hidePanel() {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
            }
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            // 注意：不在这里清除 pendingUsername，因为可能需要刷新面板
        }

        showSummonMenu() {
            if (this.menu) {
                this.hideSummonMenu();
                return;
            }

            // 使用保存的编辑器，如果没有则尝试查找
            if (!this.savedActiveEditor) {
                this.savedActiveEditor = document.querySelector('textarea.d-editor-input:focus, .reply-area textarea:focus');
            }

            // 检查是否有编辑器
            if (!this.savedActiveEditor) {
                this.showToast('请先聚焦到编辑器', 'warning');
                return;
            }

            this.menu = document.createElement('div');
            this.menu.className = 'summoner-menu';

            const enabledGroups = Object.entries(this.config.groups)
                .filter(([_, group]) => group.enabled && group.members.length > 0);

            if (enabledGroups.length === 0) {
                this.menu.innerHTML = `
                    <div class="summoner-menu-header">选择分组</div>
                    <div class="summoner-menu-item disabled">
                        <span class="summoner-menu-item-name">暂无可用分组</span>
                    </div>
                `;
            } else {
                const itemsHTML = enabledGroups.map(([name, group]) => `
                    <div class="summoner-menu-item" data-group="${name}">
                        <span class="summoner-menu-item-name">${name}</span>
                        <span class="summoner-menu-item-count">${group.members.length}人</span>
                    </div>
                `).join('');

                this.menu.innerHTML = `
                    <div class="summoner-menu-header">选择分组召唤</div>
                    ${itemsHTML}
                `;
            }

            document.body.appendChild(this.menu);

            // 绑定事件
            this.menu.querySelectorAll('.summoner-menu-item:not(.disabled)').forEach(item => {
                item.addEventListener('click', (e) => {
                    const groupName = e.currentTarget.dataset.group;
                    this.insertMentions(groupName);
                    this.hideSummonMenu();
                });
            });

            // 点击外部关闭
            setTimeout(() => {
                document.addEventListener('click', this.handleClickOutsideMenu);
            }, 100);
        }

        handleClickOutsideMenu = (e) => {
            if (this.menu && !this.menu.contains(e.target) && !this.fab.contains(e.target)) {
                this.hideSummonMenu();
            }
        }

        hideSummonMenu() {
            if (this.menu) {
                this.menu.remove();
                this.menu = null;
                document.removeEventListener('click', this.handleClickOutsideMenu);
            }
        }

        insertMentions(groupName) {
            const generator = new MentionGenerator(this.config);
            const mentions = generator.generate(groupName);

            if (!mentions) {
                this.showToast('分组不可用', 'error');
                return;
            }

            // 使用保存的编辑器
            const activeEditor = this.savedActiveEditor || document.querySelector('textarea.d-editor-input, .reply-area textarea');
            if (!activeEditor) {
                this.showToast('未找到编辑器', 'error');
                return;
            }

            const start = activeEditor.selectionStart;
            const end = activeEditor.selectionEnd;
            const text = activeEditor.value;

            activeEditor.value = text.substring(0, start) + mentions + ' ' + text.substring(end);
            activeEditor.selectionStart = activeEditor.selectionEnd = start + mentions.length + 1;

            activeEditor.dispatchEvent(new Event('input', { bubbles: true }));
            activeEditor.focus(); // 重新聚焦编辑器

            const group = this.config.groups[groupName];
            this.showToast(`已召唤 ${group.members.length} 人`, 'success');

            // 清除保存的编辑器引用
            this.savedActiveEditor = null;
        }

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `summoner-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'summoner-toast-in 0.3s reverse';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }

        // 在用户卡片上添加按钮（简化版，避免焦点循环）
        injectUserCardButton(cardElement) {
            // 避免重复注入
            if (cardElement.querySelector('.summoner-usercard-btn')) {
                return;
            }

            // 获取用户名
            const usernameLink = cardElement.querySelector('.user-profile-link') ||
                                 cardElement.querySelector('a[href^="/u/"]');
            if (!usernameLink) return;

            const username = usernameLink.textContent.trim();
            if (!username) return;

            // 找到控制按钮区域
            const controls = cardElement.querySelector('.usercard-controls');
            if (!controls) return;

            // 创建按钮
            const li = document.createElement('li');
            li.className = 'summoner-usercard-item';

            const btn = document.createElement('button');
            btn.className = 'summoner-usercard-btn btn btn-icon-text btn-default';
            btn.innerHTML = '<span class="d-button-label">✨ 加入分组</span>';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showPanel(username);
            });

            li.appendChild(btn);
            controls.appendChild(li);
        }
    }

    // ========================================
    // 应用主控制器
    // ========================================

    class SummonerApp {
        constructor() {
            this.configManager = new ConfigManager();
            this.config = this.configManager.load();
            this.uiManager = new UIManager(this.config, (config) => this.saveConfig(config));
        }

        init() {
            console.log('[召唤师] 初始化中...');
            console.log('[召唤师] 当前配置:', this.config);
            this.uiManager.init();
            this.observeUserCards();
            console.log('[召唤师] 初始化完成');
        }

        observeUserCards() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // 检查是否是用户卡片
                            if (node.matches && node.matches('.card-content')) {
                                this.uiManager.injectUserCardButton(node);
                            }
                            // 检查子元素
                            if (node.querySelectorAll) {
                                const cards = node.querySelectorAll('.card-content');
                                cards.forEach(card => this.uiManager.injectUserCardButton(card));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 处理已存在的卡片
            document.querySelectorAll('.card-content').forEach(card => {
                this.uiManager.injectUserCardButton(card);
            });
        }

        saveConfig(config) {
            console.log('[召唤师] 正在保存配置:', config);
            const success = this.configManager.save(config);
            if (success) {
                this.config = config;
                // 更新 UIManager 的配置引用
                this.uiManager.config = config;
                console.log('[召唤师] 配置保存成功');
            } else {
                console.error('[召唤师] 配置保存失败');
            }
            return success;
        }
    }

    // ========================================
    // 应用启动
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const app = new SummonerApp();
            app.init();
        });
    } else {
        const app = new SummonerApp();
        app.init();
    }

})();
