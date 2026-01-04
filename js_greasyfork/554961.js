// ==UserScript==
// @name         Resumer
// @namespace    https://greasyfork.org/zh-CN/users/1375382-ryanli
// @version      4.1.3
// @description  侧边栏形式的个人简历助手、信息管理助手，支持自动填充、分类、搜索、拖拽排序等功能
// @author       Ryanli
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554961/Resumer.user.js
// @updateURL https://update.greasyfork.org/scripts/554961/Resumer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * ----------------------------------------------------------------
     * 模块: Config
     * 存储所有常量、选择器、类名、存储键和魔法数字
     * ----------------------------------------------------------------
     */
    const Config = {
        SELECTORS: {
            ASSISTANT: '#personal-info-assistant',
            HEADER: '#assistant-header',
            TITLE: '#assistant-title',
            CONTROLS: '#assistant-controls',
            TOGGLE_BTN: '#toggle-btn',
            FIX_BTN: '#fix-btn',
            CLOSE_BTN: '#close-btn',
            CONTENT: '#assistant-content',
            CATEGORY_CONTAINER: '#category-container',
            CATEGORY_BTN: '.category-btn',
            ADD_CATEGORY_BTN: '#add-category',
            ITEMS_CONTAINER: '#items-container',
            INFO_ITEM: '.info-item',
            ITEM_TITLE: '.item-title',
            ITEM_CATEGORY: '.item-category',
            FOOTER: '#assistant-footer',
            SEARCH_INPUT: '#search-input',
            ADD_ITEM_BTN: '#add-item-btn',
            CONTEXT_MENU: '#context-menu',
            EDIT_ITEM_MENU: '#edit-item',
            DELETE_ITEM_MENU: '#delete-item',
            CATEGORY_CONTEXT_MENU: '#category-context-menu',
            RENAME_CATEGORY_MENU: '#rename-category',
            DELETE_CATEGORY_MENU: '#delete-category-menu',
            EDIT_MODAL: '#edit-modal',
            EDIT_TITLE: '#edit-title',
            EDIT_START_DATE: '#edit-start-date',
            EDIT_END_DATE: '#edit-end-date',
            EDIT_CONTENT: '#edit-content',
            EDIT_CATEGORY: '#edit-category',
            CANCEL_EDIT_BTN: '#cancel-edit',
            SAVE_EDIT_BTN: '#save-edit',
            CATEGORY_MODAL: '#category-modal',
            CATEGORY_NAME_INPUT: '#category-name',
            CANCEL_CATEGORY_BTN: '#cancel-category',
            SAVE_CATEGORY_BTN: '#save-category',
            OVERLAY: '#overlay',
            DETAIL_MODAL: '#detail-modal',
            DETAIL_TITLE: '#detail-title',
            DETAIL_CATEGORY: '#detail-category',
            DETAIL_DATE: '#detail-date',
            DETAIL_CONTENT: '#detail-content',
            // 动态创建的 Modal ID
            DELETE_ITEM_MODAL: '#delete-item-modal',
            CANCEL_DELETE_ITEM_BTN: '#cancel-delete-item',
            CONFIRM_DELETE_ITEM_BTN: '#confirm-delete-item',
            DELETE_CATEGORY_MODAL: '#delete-category-modal',
            CANCEL_DELETE_CATEGORY_BTN: '#cancel-delete-category',
            CONFIRM_DELETE_CATEGORY_BTN: '#confirm-delete-category',
            RENAME_CATEGORY_MODAL: '#rename-category-modal',
            NEW_CATEGORY_NAME_INPUT: '#new-category-name',
            CANCEL_RENAME_CATEGORY_BTN: '#cancel-rename-category',
            CONFIRM_RENAME_CATEGORY_BTN: '#confirm-rename-category',
            ALERT_MODAL: '#alert-modal', // 新增：通用提示框
        },
        CLASSES: {
            LEFT: 'left',
            COLLAPSED: 'collapsed',
            DRAGGING: 'dragging',
            DRAG_READY: 'drag-ready',
            FIXED: 'isFixed',
            OPEN: 'open',
            ACTIVE: 'active',
            CATEGORY_BTN: 'category-btn', // 修复：移除类名前的点
            INFO_ITEM: 'info-item', // 修复：添加 info-item 类名
            DYNAMIC_MODAL: 'assistant-dynamic-modal', // 动态模态框的通用类
            HIDDEN_SIDEBAR: 'hidden-sidebar', // 隐藏最小化侧边栏 - 保持 Flex 布局完整性
        },
        STORAGE_KEYS: {
            RESET_FLAG: 'personalInfoAssistant_resetStorage',
            CATEGORIES: 'personalInfoAssistant_categories',
            ITEMS: 'personalInfoAssistant_items',
            IS_FIXED: 'personalInfoAssistant_isFixed',
            SIDEBAR_POSITION: 'personalInfoAssistant_sidebarPosition',
            COLLAPSED_POSITION: 'personalInfoAssistant_collapsedPosition',
            HIDE_COLLAPSED: 'personalInfoAssistant_hideCollapsed', // 新增：隐藏最小化侧边栏设置
            OLD_DATA: 'personalInfoAssistantData', // 兼容旧版
        },
        TIMERS: {
            SIDEBAR_DRAG_START_DELAY: 300,  // 侧边栏拖拽延迟
            DETAIL_HOVER_DELAY: 1000,        // 详情悬停
            AUTO_FILL_TIMEOUT: 3000,         // 自动填充
            TINYMCE_POLL_INTERVAL: 200,    // TinyMCE 轮询间隔
            TINYMCE_POLL_TIMEOUT: 2000,        // TinyMCE 轮询超时
            SIMULATE_INPUT_INTERVAL: 300,    // 模拟输入检查间隔
            SIMULATE_INPUT_TIMEOUT: 3000,        // 模拟输入超时
        },
        DEFAULT_CATEGORY: '全部',
    };

    /**
     * ----------------------------------------------------------------
     * 模块: StyleManager
     * 负责管理和注入所有 CSS 样式
     * ----------------------------------------------------------------
     */
    const StyleManager = {
        inject: function() {
            GM_addStyle(this.getStyles());
            this.addAntiSelectStyles();
        },

        addAntiSelectStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                /* 彻底禁用整个侧边栏的文本选择 */
                ${Config.SELECTORS.ASSISTANT},
                ${Config.SELECTORS.ASSISTANT} *,
                ${Config.SELECTORS.ASSISTANT} *:before,
                ${Config.SELECTORS.ASSISTANT} *:after {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                    cursor: default !important;
                }

                /* 特殊处理按钮和可点击元素 */
                ${Config.SELECTORS.ASSISTANT} button,
                ${Config.SELECTORS.INFO_ITEM},
                ${Config.SELECTORS.CATEGORY_BTN} {
                    cursor: pointer !important;
                }
                
                /* 屏蔽整个侧边栏的右键菜单 */
                ${Config.SELECTORS.ASSISTANT},
                ${Config.SELECTORS.ASSISTANT} * {
                    -webkit-touch-callout: none !important;
                    -webkit-user-select: none !important;
                    -khtml-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
            `;
            document.head.appendChild(style);
        },

        getStyles: function() {
            // (样式字符串过长，此处折叠)
            return `
        #personal-info-assistant {
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100vh;
            background: #f5f5f5;
            border-left: 1px solid #ddd;
            box-shadow: -4px 0 20px rgba(0,0,0,0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border-radius: 16px 0 0 16px; /* 左侧大圆角，右侧贴边不留 */
            overflow: hidden;
        }
         /* 隐藏最小化侧边栏的样式 - 保持 Flex 布局完整性 */
         #personal-info-assistant.hidden-sidebar {
             display: none;
        }
        #personal-info-assistant.left {
            right: auto;
            left: 0;
            border-left: none;
            border-right: 1px solid #ddd;
            border-radius: 0 16px 16px 0;
            box-shadow: 4px 0 20px rgba(0,0,0,0.08);
        }
        #personal-info-assistant.collapsed {
            width: 48px;
            height: auto;
            top: var(--collapsed-top, 45%);
            transform: translateY(-50%);
            border-radius: 16px;
            box-shadow: 0 6px 24px rgba(0,0,0,0.12);
            cursor: pointer;
            /* 优化拖拽动画性能 */
            will-change: top;
            transition: top 0.1s ease-out;
        }
        
        /* 拖拽过程中的流畅动画 */
        #personal-info-assistant.collapsed.dragging {
            transition: none; /* 拖拽时禁用过渡动画 */
            box-shadow: 0 8px 32px rgba(0,0,0,0.16); /* 拖拽时增强阴影 */
            transform: translateY(-50%) scale(1.02); /* 轻微放大效果 */
            background: linear-gradient(135deg, #4CAF50, #45a049); /* 拖拽时改变背景色 */
        }
        
        /* 拖拽准备状态（长按计时器期间） */
        #personal-info-assistant.collapsed.drag-ready {
            background: linear-gradient(135deg, #FF9800, #F57C00); /* 橙色表示准备拖拽 */
            box-shadow: 0 6px 24px rgba(255, 152, 0, 0.3);
        }
        #personal-info-assistant.collapsed #assistant-content,
        #personal-info-assistant.collapsed #assistant-footer {
            display: none;
        }
        /* 固定状态 - 保持固定定位不随页面滚动 */
        #personal-info-assistant.fixed {
            position: fixed;
            z-index: 10000;
        }
        #assistant-header {
            padding: 15px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 16px 0 0 0; /* 顶部圆角与主容器一致 */
        }
        
        /* 面板最小化时的通用样式 */
        #personal-info-assistant.collapsed #assistant-header {
            justify-content: center;
            position: relative;
        }
        
        #personal-info-assistant.collapsed #assistant-title {
            text-align: center;
            position: relative;
            z-index: 2;
        }
        
        /* 右侧最小化时的按钮位置 - 紧贴左侧边缘 */
        #personal-info-assistant.collapsed:not(.left) #assistant-controls {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            display: flex;
            justify-content: center;
            z-index: 1;
        }
        
        /* 左侧最小化时的按钮位置 - 紧贴右侧边缘 */
        #personal-info-assistant.collapsed.left #assistant-controls {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            display: flex;
            justify-content: center;
            z-index: 1;
        }
        #personal-info-assistant.collapsed #fix-btn,
        #personal-info-assistant.collapsed #close-btn {
            display: none;
        }
        #assistant-title {
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
        }
        #assistant-controls {
            display: flex;
            gap: 8px;
        }
        .control-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: white;
            cursor: pointer;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            user-select: none;
        }
        .control-btn:hover {
            background: rgba(255,255,255,0.4);
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(255,255,255,0.3);
        }
        .control-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(255,255,255,0.3);
        }
        #assistant-content {
            flex: 1;
            display: flex;
            overflow: hidden;
        }
        #category-container {
            width: 80px;
            background: #e8e8e8;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px 0;
            border-right: 1px solid #ddd;
        }
        .category-btn {
            width: 100%;
            padding: 12px 8px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
            word-break: break-all;
            position: relative;
            transition: all 0.3s ease;
            border-radius: 8px;
            color: #4a4a4a;
            margin-bottom: 4px;
            user-select: none;
        }
        .category-btn.active {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        .category-btn:hover:not(.active) {
            background: #f0f0f0;
            transform: translateX(2px);
            color: #333;
        }
        
        /* 分类拖拽相关样式 */
        .category-btn.dragging {
            opacity: 0.5;
            border: 2px dashed #666;
        }
        .category-btn .delete-category {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 8px;
            display: none;
            align-items: center;
            justify-content: center;
        }
        .category-btn:hover .delete-category {
            display: flex;
        }
        #add-category {
            width: 100%;
            padding: 5px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 20px;
            color: #666;
            user-select: none;
        }
        #items-container {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        .info-item {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 12px 15px 10px;
            margin-bottom: 12px;
            cursor: pointer;
            position: relative;
            /* 全面禁止文本选择的CSS属性 */
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            /* 禁用拖动选择和长按菜单 */
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            transition: all 0.3s ease;
            transform: translateY(0);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .info-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        .info-item:hover {
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
            transform: translateY(-3px);
            border-color: #d0d0d0;
        }
        .info-item:hover::before {
            transform: scaleX(1);
        }
        .info-item.dragging {
            opacity: 0.5;
            border: 2px dashed #666;
        }
        .item-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 15px;
            width: 100%;
            display: block;
            text-align: center;
            user-select: none;
        }
        .item-date {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
            text-align: center;
            display: block;
        }
        .item-category {
            font-size: 11px;
            color: #666;
            background: rgba(240, 240, 240, 0.8);
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: auto;
            margin-bottom: 1px;
            display: inline-block;
            margin-top: -5px;
            user-select: none;
        }
        .info-item-header {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            margin-bottom: -3px;
            width: 100%;
        }
        #assistant-footer {
            padding: 15px;
            background: #e8e8e8;
            border-top: 1px solid #ddd;
        }
        #search-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            background: white;
            outline: none;
        }
        #search-input:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        #add-item-btn {
            width: 100%;
            padding: 12px 16px;
            margin-top: 12px;
            border: none;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
        }
        #add-item-btn:hover {
            background: linear-gradient(135deg, #45a049, #3d8b40);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
        }
        #add-item-btn:active {
            transform: translateY(0);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        .context-menu {
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            padding: 8px 0;
            display: none;
            z-index: 10000;
            min-width: 120px;
        }
        .context-menu-item {
            padding: 10px 18px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
            user-select: none;
        }
        .context-menu-item:hover {
            background: #f0f0f0;
        }
        #edit-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            padding: 25px;
            width: 90%;
            max-width: 450px;
            display: none;
            z-index: 10000;
            border: 1px solid #e0e0e0;
        }
        .modal-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
            user-select: none;
        }
        .form-group {
            margin-bottom: 18px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
            color: #444;
            user-select: none;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 25px;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            user-select: none;
        }
        .btn-primary {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }
        .btn-primary:hover {
            background: linear-gradient(135deg, #45a049, #3d8b40);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }
        .btn-primary:active {
            transform: translateY(0);
        }
        .btn-secondary {
            background: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
        }
        .btn-secondary:hover {
            background: #e0e0e0;
            transform: translateY(-1px);
        }
        .btn-secondary:active {
            transform: translateY(0);
        }
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            display: none;
            z-index: 9998;
        }
        /* 详情弹窗样式 - 基于编辑弹窗样式但不包含操作按钮 */
        #detail-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            padding: 25px;
            width: 90%;
            max-width: 450px;
            display: none;
            z-index: 10000;
            border: 1px solid #e0e0e0;
        }
        
        #detail-modal .modal-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
        }
        
        #detail-modal .info-field {
            margin-bottom: 18px;
        }
        
        #detail-modal .field-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
            color: #444;
        }
        
        #detail-modal .field-value {
            padding: 10px 12px;
            background: #f8f8f8;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        
        #detail-modal .field-value.content {
            min-height: 100px;
            line-height: 1.5;
        }
        /* 动态创建的模态框的通用样式 */
        .assistant-dynamic-modal {
             position: fixed;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             background: white;
             border-radius: 16px;
             box-shadow: 0 10px 30px rgba(0,0,0,0.25);
             padding: 25px;
             width: 90%;
             max-width: 450px;
             display: none;
             z-index: 10000;
             border: 1px solid #e0e0e0;
         }
             `;
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: Utils
     * 存放可复用的工具函数
     * ----------------------------------------------------------------
     */
    const Utils = {
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        copyToClipboard: function(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('[Clipboard Debug] 成功复制到剪贴板:', text);
            }).catch(err => {
                console.error('[Clipboard Debug] 复制失败:', err);
            });
        },

        simulateInputAtCursor: function(message) {
            const maxWaitTime = Config.TIMERS.SIMULATE_INPUT_TIMEOUT;
            const checkInterval = Config.TIMERS.SIMULATE_INPUT_INTERVAL;
            let attempts = 0;

            const interval = setInterval(() => {
                const activeElement = document.activeElement;

                if (activeElement && (
                    activeElement instanceof HTMLInputElement ||
                    activeElement instanceof HTMLTextAreaElement ||
                    (activeElement.isContentEditable && activeElement.contentEditable === 'true')
                )) {
                    clearInterval(interval);
                    activeElement.focus();

                    // 方式一：尝试使用 document.execCommand 插入文本
                    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                        try {
                            document.execCommand('insertText', false, message);
                            console.log('粘贴成功（方式一：execCommand）');
                            return;
                        } catch (e) {
                            console.warn('方式一失败，尝试其他方法');
                        }
                    }

                    // 方式二：现代API setRangeText（仅限 input/textarea）
                    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
                        if (typeof activeElement.setRangeText === 'function') {
                            try {
                                activeElement.setRangeText(
                                    message,
                                    activeElement.selectionStart,
                                    activeElement.selectionEnd,
                                    'end'
                                );
                                console.log('粘贴成功（方式二：setRangeText）');
                                return;
                            } catch (e) {
                                console.warn('方式二失败');
                            }
                        }
                    }

                    // 方式三：contenteditable 的 Selection + Range API
                    if (activeElement.isContentEditable) {
                        try {
                            const sel = window.getSelection();
                            if (sel.rangeCount > 0) {
                                const range = sel.getRangeAt(0);
                                range.deleteContents();
                                range.insertNode(document.createTextNode(message));
                                range.collapse(false);
                                console.log('粘贴成功（方式三：Range API）');
                                return;
                            }
                        } catch (e) {
                            console.error('方式三失败');
                        }
                    }
                    
                    // 备用方法: 模拟粘贴事件
                    try {
                        const clipboardData = new DataTransfer();
                        clipboardData.setData('text/plain', message);
                        const pasteEvent = new ClipboardEvent('paste', {
                            bubbles: true,
                            cancelable: true,
                            clipboardData
                        });
                        activeElement.dispatchEvent(pasteEvent);
                        console.log("尝试模拟触发粘贴事件");
                        return;
                    } catch(e) {
                         console.error('模拟粘贴事件失败');
                    }

                } else {
                    attempts++;
                    if (attempts * checkInterval >= maxWaitTime) {
                        clearInterval(interval);
                        console.error(`在${maxWaitTime / 1000}秒内未找到可输入的焦点元素，放弃执行粘贴动作。`);
                    }
                }
            }, checkInterval);
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: State
     * 管理应用所有内存中的动态数据
     * ----------------------------------------------------------------
     */
    const State = {
        // 持久化数据
        data: {
            isFixed: true,
            sidebarPosition: 'right', // 'left' or 'right'
            collapsedPosition: null,  // { top: number }
            hideCollapsed: false,     // 是否隐藏最小化的侧边栏
            categories: ['工作', '学习', '生活'],
            items: [
                {
                    title: '示例信息',
                    content: '这是一条示例信息，您可以编辑或删除它。',
                    category: '工作',
                    startDate: '2025-10-03',
                    endDate: '2025-10-03',
                    id: Utils.generateId(),
                    order: 1
                }
            ],
            activeCategory: Config.DEFAULT_CATEGORY,
        },
        // 临时 UI 状态
        ui: {
            isExpanded: false,
            isDraggingSidebar: false,
            sidebarDragStartY: 0,
            sidebarDragStartTop: 0,
            sidebarLongPressTimer: null,
            hasDraggedSidebar: false,
            lastSidebarDragY: 0,
            sidebarDragVelocity: 0,
            lastSidebarDragTime: 0,
            lastSidebarAnimationFrame: null,
        },
        // 自动填充状态
        autofill: {
            lastClickedItemContent: null,
            timeout: null,
        },
        // 详情悬停状态
        hoverDetail: {
            timer: null,
            isMouseOver: false,
            currentItem: null,
        },
        // 拖拽状态
        drag: {
            draggedItem: null,
            overItem: null,
            draggedCategory: null,
            overCategory: null,
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: Storage (Model)
     * 封装 GM API，负责数据的持久化、加载和 CRUD 操作
     * ----------------------------------------------------------------
     */
    const Storage = {
        initialize: function() {
            const resetFlag = GM_getValue(Config.STORAGE_KEYS.RESET_FLAG, true);
            if (resetFlag) {
                GM_setValue(Config.STORAGE_KEYS.RESET_FLAG, false);
                // 使用 State 中的默认数据
                GM_setValue(Config.STORAGE_KEYS.CATEGORIES, State.data.categories);
                GM_setValue(Config.STORAGE_KEYS.ITEMS, State.data.items);
                GM_setValue(Config.STORAGE_KEYS.IS_FIXED, State.data.isFixed);
                GM_setValue(Config.STORAGE_KEYS.SIDEBAR_POSITION, State.data.sidebarPosition);
                GM_setValue(Config.STORAGE_KEYS.COLLAPSED_POSITION, State.data.collapsedPosition);
                GM_setValue(Config.STORAGE_KEYS.HIDE_COLLAPSED, State.data.hideCollapsed);
                console.log('个人信息助手存储结构已初始化');
            }
        },

        load: function() {
            // 兼容旧版
            const oldFormatData = GM_getValue(Config.STORAGE_KEYS.OLD_DATA, null);
            if (oldFormatData) {
                try {
                    const parsedData = JSON.parse(oldFormatData);
                    State.data = { ...State.data, ...parsedData };
                    this.save(); // 迁移到新格式
                    GM_setValue(Config.STORAGE_KEYS.OLD_DATA, null); // 删除旧数据
                    console.error('数据已从旧格式迁移到新格式');
                    return;
                } catch (e) {
                    console.error('Failed to parse old format data:', e);
                }
            }

            // 加载新格式数据
            const categories = GM_getValue(Config.STORAGE_KEYS.CATEGORIES, null);
            const items = GM_getValue(Config.STORAGE_KEYS.ITEMS, null);
            const isFixed = GM_getValue(Config.STORAGE_KEYS.IS_FIXED, null);
            const sidebarPosition = GM_getValue(Config.STORAGE_KEYS.SIDEBAR_POSITION, null);
            const collapsedPosition = GM_getValue(Config.STORAGE_KEYS.COLLAPSED_POSITION, null);
            const hideCollapsed = GM_getValue(Config.STORAGE_KEYS.HIDE_COLLAPSED, null);

            if (categories) State.data.categories = categories;
            if (items) State.data.items = items;
            if (isFixed !== null) State.data.isFixed = isFixed;
            if (sidebarPosition) State.data.sidebarPosition = sidebarPosition;
            if (collapsedPosition) State.data.collapsedPosition = collapsedPosition;
            if (hideCollapsed !== null) State.data.hideCollapsed = hideCollapsed;
        },

        save: function() {
            // 格式化 items 确保数据一致性
            const formattedItems = State.data.items.map(item => ({
                title: item.title || '',
                content: item.content || '',
                category: item.category || Config.DEFAULT_CATEGORY,
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                id: item.id || Utils.generateId(),
                order: item.order || 1
            }));
            State.data.items = formattedItems;
            
            // 保存所有状态数据
            GM_setValue(Config.STORAGE_KEYS.CATEGORIES, State.data.categories);
            GM_setValue(Config.STORAGE_KEYS.ITEMS, State.data.items);
            GM_setValue(Config.STORAGE_KEYS.IS_FIXED, State.data.isFixed);
            GM_setValue(Config.STORAGE_KEYS.SIDEBAR_POSITION, State.data.sidebarPosition);
            GM_setValue(Config.STORAGE_KEYS.COLLAPSED_POSITION, State.data.collapsedPosition);
            GM_setValue(Config.STORAGE_KEYS.HIDE_COLLAPSED, State.data.hideCollapsed);
        },

        saveItem: function(itemData) {
            if (itemData.id) {
                // 编辑
                const index = State.data.items.findIndex(i => i.id === itemData.id);
                if (index !== -1) {
                    State.data.items[index] = { ...State.data.items[index], ...itemData };
                }
            } else {
                // 新增
                const maxOrder = State.data.items.length > 0 ? Math.max(...State.data.items.map(i => i.order)) : 0;
                State.data.items.push({
                    ...itemData,
                    id: Utils.generateId(),
                    order: maxOrder + 1
                });
            }
            this.save();
        },

        deleteItemById: function(itemId) {
            State.data.items = State.data.items.filter(item => item.id !== itemId);
            this.save();
        },

        saveCategory: function(categoryName) {
            if (categoryName && !State.data.categories.includes(categoryName)) {
                State.data.categories.push(categoryName);
                this.save();
                return true;
            }
            return false;
        },

        deleteCategory: function(categoryName, moveItems) {
            if (moveItems) {
                // 移动项目到“全部”
                State.data.items = State.data.items.map(item => {
                    if (item.category === categoryName) {
                        return { ...item, category: Config.DEFAULT_CATEGORY };
                    }
                    return item;
                });
            } else {
                // 删除分类下的所有项目
                State.data.items = State.data.items.filter(item => item.category !== categoryName);
            }
            // 删除分类
            State.data.categories = State.data.categories.filter(cat => cat !== categoryName);
            this.save();
        },

        renameCategory: function(oldName, newName) {
            if (!newName || newName === oldName) return false;
            if (State.data.categories.includes(newName)) {
                UI.showAlertModal('该分类名称已存在');
                return false;
            }

            // 更新分类数组
            const index = State.data.categories.indexOf(oldName);
            if (index !== -1) {
                State.data.categories[index] = newName;
            }

            // 更新所有相关条目
            State.data.items = State.data.items.map(item => {
                if (item.category === oldName) {
                    return { ...item, category: newName };
                }
                return item;
            });

            this.save();
            return true;
        },

        updateItemOrder: function(draggedId, targetId) {
            const items = State.data.items;
            const draggedItem = items.find(item => item.id === draggedId);
            const targetItem = items.find(item => item.id === targetId);

            if (draggedItem && targetItem) {
                items.sort((a, b) => a.order - b.order);
                const draggedIdx = items.findIndex(item => item.id === draggedId);
                let targetIdx = items.findIndex(item => item.id === targetId);

                if (draggedIdx !== -1 && targetIdx !== -1) {
                    const [removedItem] = items.splice(draggedIdx, 1);
                    // 调整目标索引
                    targetIdx = items.findIndex(item => item.id === targetId);
                    items.splice(targetIdx, 0, removedItem);
                    
                    // 重新分配 order
                    items.forEach((item, index) => {
                        item.order = index + 1;
                    });
                    this.save();
                }
            }
        },

        updateCategoryOrder: function(draggedCategory, targetCategory) {
            if (draggedCategory === Config.DEFAULT_CATEGORY || targetCategory === Config.DEFAULT_CATEGORY) {
                return;
            }
            
            const categories = State.data.categories;
            const draggedIdx = categories.indexOf(draggedCategory);
            const targetIdx = categories.indexOf(targetCategory);

            if (draggedIdx !== -1 && targetIdx !== -1) {
                const [removedCategory] = categories.splice(draggedIdx, 1);
                categories.splice(targetIdx, 0, removedCategory);
                this.save();
            }
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: DOM (View)
     * 负责 DOM 的创建、缓存和渲染
     * ----------------------------------------------------------------
     */
    const DOM = {
        elements: {}, // 缓存 DOM 元素

        create: function() {
            const assistant = document.createElement('div');
            assistant.id = 'personal-info-assistant';
            assistant.className = Config.CLASSES.COLLAPSED; // 默认收起

            const isLeftSide = State.data.sidebarPosition === 'left';
            const toggleBtnText = isLeftSide ? '▶' : '◀';
            const toggleBtnTitle = isLeftSide ? '移到右侧' : '移到左侧';

            assistant.innerHTML = `
                <div id="assistant-header">
                    <div id="assistant-title">信息助手</div>
                    <div id="assistant-controls">
                        <button class="control-btn" id="toggle-btn" title="${toggleBtnTitle}">${toggleBtnText}</button>
                        <button class="control-btn" id="fix-btn" title="固定">🔒</button>
                        <button class="control-btn" id="close-btn" title="点击关闭侧边栏">×</button>
                    </div>
                </div>
                <div id="assistant-content">
                    <div id="category-container"></div>
                    <div id="items-container"></div>
                </div>
                <div id="assistant-footer">
                    <input type="text" id="search-input" placeholder="搜索...">
                    <button id="add-item-btn">+ 添加信息</button>
                </div>
            `;

            const itemContextMenu = document.createElement('div');
            itemContextMenu.className = 'context-menu';
            itemContextMenu.id = 'context-menu';
            itemContextMenu.innerHTML = `
                <div class="context-menu-item" id="edit-item">编辑</div>
                <div class="context-menu-item" id="delete-item">删除</div>
            `;

            const categoryContextMenu = document.createElement('div');
            categoryContextMenu.className = 'context-menu';
            categoryContextMenu.id = 'category-context-menu';
            categoryContextMenu.innerHTML = `
                <div class="context-menu-item" id="rename-category">重命名</div>
                <div class="context-menu-item" id="delete-category-menu">删除</div>
            `;

            const editModal = document.createElement('div');
            editModal.id = 'edit-modal';
            editModal.innerHTML = `
                <div class="modal-title">编辑信息</div>
                <div class="form-group">
                    <label for="edit-title">标题</label>
                    <input type="text" id="edit-title" required>
                </div>
                <div class="form-group">
                    <label for="edit-start-date">开始日期</label>
                    <input type="date" id="edit-start-date">
                </div>
                <div class="form-group">
                    <label for="edit-end-date">结束日期</label>
                    <input type="date" id="edit-end-date">
                </div>
                <div class="form-group">
                    <label for="edit-content">内容</label>
                    <textarea id="edit-content" required></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-category">分类</label>
                    <select id="edit-category"></select>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-edit">取消</button>
                    <button class="btn btn-primary" id="save-edit">保存</button>
            </div>
            `;

            const categoryModal = document.createElement('div');
            categoryModal.id = 'category-modal';
            categoryModal.className = Config.CLASSES.DYNAMIC_MODAL; // 使用通用类
            categoryModal.style.display = 'none'; // 确保默认隐藏
            categoryModal.innerHTML = `
                <div class="modal-title">添加分类</div>
                <div class="form-group">
                    <label for="category-name">分类名称</label>
                    <input type="text" id="category-name" placeholder="请输入分类名称" required>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-category">取消</button>
                    <button class="btn btn-primary" id="save-category">确定</button>
            </div>
            `;
            
            // --- 新增：创建所有“动态”模态框 ---

            const detailModal = document.createElement("div");
            detailModal.id = Config.SELECTORS.DETAIL_MODAL.slice(1);
            detailModal.className = Config.CLASSES.DYNAMIC_MODAL; // 使用通用类
            detailModal.innerHTML = `
                <div class="modal-title" id="detail-title"></div>
                <div class="info-field">
                    <div class="field-label">分类</div>
                    <div class="field-value" id="detail-category"></div>
                </div>
                <div class="info-field">
                    <div class="field-label">日期范围</div>
                    <div class="field-value" id="detail-date"></div>
                </div>
                <div class="info-field">
                    <div class="field-label">内容</div>
                    <div class="field-value content" id="detail-content"></div>
                </div>
            `;

            const deleteItemModal = document.createElement('div');
            deleteItemModal.id = Config.SELECTORS.DELETE_ITEM_MODAL.slice(1);
            deleteItemModal.className = Config.CLASSES.DYNAMIC_MODAL; // 使用通用类
            deleteItemModal.innerHTML = `
                <div class="modal-title">删除信息</div>
                <div style="margin: 20px 0; font-size: 14px; color: #333;">
                    确定要删除这条信息吗？此操作无法撤销。
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-delete-item">取消</button>
                    <button class="btn btn-primary" id="confirm-delete-item">确定</button>
                </div>
            `;

            const deleteCategoryModal = document.createElement('div');
            deleteCategoryModal.id = Config.SELECTORS.DELETE_CATEGORY_MODAL.slice(1);
            deleteCategoryModal.className = Config.CLASSES.DYNAMIC_MODAL; // 使用通用类
            deleteCategoryModal.innerHTML = `
                <div class="modal-title">删除分类</div>
                <div class="delete-category-message" style="margin: 20px 0; font-size: 14px; color: #333;"></div>
                <div style="margin-bottom: 20px; display: flex; gap: 12px; flex-direction: column;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="delete-option" value="move" checked style="margin-right: 8px;">
                        <span>将该分类下的所有信息移动到“<strong>${Config.DEFAULT_CATEGORY}</strong>”</span>
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="delete-option" value="delete" style="margin-right: 8px;">
                        <span>直接删除该分类下的所有信息</span>
                    </label>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-delete-category">取消</button>
                    <button class="btn btn-primary" id="confirm-delete-category">确定</button>
                </div>
            `;

            const renameCategoryModal = document.createElement('div');
            renameCategoryModal.id = Config.SELECTORS.RENAME_CATEGORY_MODAL.slice(1);
            renameCategoryModal.className = Config.CLASSES.DYNAMIC_MODAL; // 使用通用类
            renameCategoryModal.innerHTML = `
                <div class="modal-title">重命名分类</div>
                <div class="rename-category-message" style="margin: 20px 0; font-size: 14px; color: #333;"></div>
                <div class="form-group">
                    <label for="new-category-name">新分类名称</label>
                    <input type="text" id="new-category-name" required>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-rename-category">取消</button>
                    <button class="btn btn-primary" id="confirm-rename-category">确定</button>
                </div>
            `;

            const alertModal = document.createElement('div');
            alertModal.id = Config.SELECTORS.ALERT_MODAL.slice(1);
            alertModal.className = Config.CLASSES.DYNAMIC_MODAL;
            alertModal.innerHTML = `
                <div class="modal-title" id="alert-modal-title">提示</div>
                <div class="alert-message" style="margin: 20px 0; font-size: 14px; color: #333; text-align: center;"></div>
                <div class="modal-actions" style="justify-content: center;">
                    <button class="btn btn-primary" id="alert-modal-confirm">确定</button>
                </div>
            `;

            // --- 结束：创建所有“动态”模态框 ---


            const overlay = document.createElement('div');
            overlay.id = 'overlay';

            document.body.appendChild(assistant);
            document.body.appendChild(itemContextMenu);
            document.body.appendChild(categoryContextMenu);
            document.body.appendChild(editModal);
            document.body.appendChild(categoryModal);
            document.body.appendChild(overlay);
            // --- 新增：附加所有“动态”模态框 ---
            document.body.appendChild(detailModal);
            document.body.appendChild(deleteItemModal);
            document.body.appendChild(deleteCategoryModal);
            document.body.appendChild(renameCategoryModal);
            document.body.appendChild(alertModal); // 附加 alert modal
            // --- 结束：附加所有“动态”模态框 ---

            this.cache(); // 创建后立即缓存
        },

        cache: function() {
            // 缓存所有需要频繁访问的 DOM 元素
            this.elements.assistant = document.querySelector(Config.SELECTORS.ASSISTANT);
            this.elements.header = document.querySelector(Config.SELECTORS.HEADER);
            this.elements.title = document.querySelector(Config.SELECTORS.TITLE);
            this.elements.toggleBtn = document.querySelector(Config.SELECTORS.TOGGLE_BTN);
            this.elements.fixBtn = document.querySelector(Config.SELECTORS.FIX_BTN);
            this.elements.closeBtn = document.querySelector(Config.SELECTORS.CLOSE_BTN);
            this.elements.categoryContainer = document.querySelector(Config.SELECTORS.CATEGORY_CONTAINER);
            this.elements.itemsContainer = document.querySelector(Config.SELECTORS.ITEMS_CONTAINER);
            this.elements.searchInput = document.querySelector(Config.SELECTORS.SEARCH_INPUT);
            this.elements.addItemBtn = document.querySelector(Config.SELECTORS.ADD_ITEM_BTN);
            this.elements.itemContextMenu = document.querySelector(Config.SELECTORS.CONTEXT_MENU);
            this.elements.editItemMenu = document.querySelector(Config.SELECTORS.EDIT_ITEM_MENU);
            this.elements.deleteItemMenu = document.querySelector(Config.SELECTORS.DELETE_ITEM_MENU);
            this.elements.categoryContextMenu = document.querySelector(Config.SELECTORS.CATEGORY_CONTEXT_MENU);
            this.elements.renameCategoryMenu = document.querySelector(Config.SELECTORS.RENAME_CATEGORY_MENU);
            this.elements.deleteCategoryMenu = document.querySelector(Config.SELECTORS.DELETE_CATEGORY_MENU);
            this.elements.editModal = document.querySelector(Config.SELECTORS.EDIT_MODAL);
            this.elements.editTitle = document.querySelector(Config.SELECTORS.EDIT_TITLE);
            this.elements.editStartDate = document.querySelector(Config.SELECTORS.EDIT_START_DATE);
            this.elements.editEndDate = document.querySelector(Config.SELECTORS.EDIT_END_DATE);
            this.elements.editContent = document.querySelector(Config.SELECTORS.EDIT_CONTENT);
            this.elements.editCategory = document.querySelector(Config.SELECTORS.EDIT_CATEGORY);
            this.elements.cancelEditBtn = document.querySelector(Config.SELECTORS.CANCEL_EDIT_BTN);
            this.elements.saveEditBtn = document.querySelector(Config.SELECTORS.SAVE_EDIT_BTN);
            this.elements.categoryModal = document.querySelector(Config.SELECTORS.CATEGORY_MODAL);
            this.elements.categoryNameInput = document.querySelector(Config.SELECTORS.CATEGORY_NAME_INPUT);
            this.elements.cancelCategoryBtn = document.querySelector(Config.SELECTORS.CANCEL_CATEGORY_BTN);
            this.elements.saveCategoryBtn = document.querySelector(Config.SELECTORS.SAVE_CATEGORY_BTN);
            this.elements.overlay = document.querySelector(Config.SELECTORS.OVERLAY);
            
            // --- 新增：缓存所有“动态”模态框及其内容 ---
            this.elements.detailModal = document.querySelector(Config.SELECTORS.DETAIL_MODAL);
            this.elements.detailTitle = document.querySelector(Config.SELECTORS.DETAIL_TITLE);
            this.elements.detailCategory = document.querySelector(Config.SELECTORS.DETAIL_CATEGORY);
            this.elements.detailDate = document.querySelector(Config.SELECTORS.DETAIL_DATE);
            this.elements.detailContent = document.querySelector(Config.SELECTORS.DETAIL_CONTENT);

            this.elements.deleteItemModal = document.querySelector(Config.SELECTORS.DELETE_ITEM_MODAL);
            this.elements.deleteCategoryModal = document.querySelector(Config.SELECTORS.DELETE_CATEGORY_MODAL);
            this.elements.renameCategoryModal = document.querySelector(Config.SELECTORS.RENAME_CATEGORY_MODAL);
            this.elements.alertModal = document.querySelector(Config.SELECTORS.ALERT_MODAL); // 缓存 alert modal
            // --- 结束：缓存所有“动态”模态框及其内容 ---
        },

        renderCategories: function() {
            const container = this.elements.categoryContainer;
            if (!container) return;
            
            const activeCategory = State.data.activeCategory;
            container.innerHTML = ''; // 清空

            // 1. 添加 "全部"
            const allBtn = document.createElement('button');
            allBtn.className = `${Config.CLASSES.CATEGORY_BTN} ${activeCategory === Config.DEFAULT_CATEGORY ? Config.CLASSES.ACTIVE : ''}`;
            allBtn.textContent = Config.DEFAULT_CATEGORY;
            allBtn.dataset.category = Config.DEFAULT_CATEGORY;
            allBtn.draggable = false;
            container.appendChild(allBtn);

            // 2. 添加所有自定义分类
            State.data.categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = `${Config.CLASSES.CATEGORY_BTN} ${activeCategory === category ? Config.CLASSES.ACTIVE : ''}`;
                btn.textContent = category;
                btn.dataset.category = category;
                btn.draggable = true;
                container.appendChild(btn);
            });

            // 3. 添加 "添加" 按钮
            const addBtn = document.createElement('button');
            addBtn.id = Config.SELECTORS.ADD_CATEGORY_BTN.slice(1); //
            addBtn.textContent = '+';
            addBtn.draggable = false;
            container.appendChild(addBtn);
        },

        renderItems: function() {
            const container = this.elements.itemsContainer;
            if (!container) return;

            const filterCategory = State.data.activeCategory;
            const searchTerm = this.elements.searchInput ? this.elements.searchInput.value : '';
            container.innerHTML = ''; // 清空

            let filteredItems = State.data.items.filter(item => {
                const categoryMatch = filterCategory === Config.DEFAULT_CATEGORY || item.category === filterCategory;
                const searchMatch = !searchTerm ||
                    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()));
                return categoryMatch && searchMatch;
            });

            filteredItems.sort((a, b) => a.order - b.order);

            filteredItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = Config.CLASSES.INFO_ITEM; // 修复：直接使用 Config.CLASSES.INFO_ITEM
                itemEl.dataset.id = item.id;
                itemEl.draggable = true;
                itemEl.innerHTML = `
                    <div class="info-item-header">
                        <div class="item-category">${item.category}</div>
                    </div>
                    <div class="item-title">${item.title}</div>
                    ${(item.startDate || item.endDate) ? `
                        <div class="item-date">
                            ${item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : (item.startDate || item.endDate)}
                        </div>
                    ` : ''}
                `;
                container.appendChild(itemEl);
            });
        },

        update: function() {
            this.renderCategories();
            this.renderItems();
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: UI (View-State Controller)
     * 负责 UI 状态管理 (Modals, Menus, Sidebar 状态)
     * ----------------------------------------------------------------
     */
    const UI = {
        // --- Context Menus ---
        showItemContextMenu: function(event, itemId) {
                const menu = DOM.elements.itemContextMenu;
            menu.style.left = `${event.clientX}px`;
            menu.style.top = `${event.clientY}px`;
            menu.style.display = 'block';
            menu.dataset.itemId = itemId;
        },
        hideItemContextMenu: function() {
                if(DOM.elements.itemContextMenu) DOM.elements.itemContextMenu.style.display = 'none';
        },
        showCategoryContextMenu: function(event, categoryName) {
            const menu = DOM.elements.categoryContextMenu;
            menu.style.left = `${event.clientX}px`;
            menu.style.top = `${event.clientY}px`;
            menu.style.display = 'block';
            menu.dataset.categoryName = categoryName;
        },
        hideCategoryContextMenu: function() {
            if(DOM.elements.categoryContextMenu) DOM.elements.categoryContextMenu.style.display = 'none';
        },

        // --- Modals (Edit / Add Item) ---
        showEditModal: function(itemId = null) {
            const modal = DOM.elements.editModal;
            const categorySelect = DOM.elements.editCategory;

            categorySelect.innerHTML = '';
            State.data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });

            if (itemId) {
                // 编辑模式
                const item = State.data.items.find(i => i.id === itemId);
                if (item) {
                    DOM.elements.editTitle.value = item.title;
                    DOM.elements.editStartDate.value = item.startDate || '';
                    DOM.elements.editEndDate.value = item.endDate || '';
                    DOM.elements.editContent.value = item.content;
                    categorySelect.value = item.category;
                    modal.dataset.itemId = itemId;
                    modal.querySelector('.modal-title').textContent = '编辑信息';
                }
            } else {
                // 新增模式
                DOM.elements.editTitle.value = '';
                DOM.elements.editStartDate.value = '';
                DOM.elements.editEndDate.value = '';
                DOM.elements.editContent.value = '';
                modal.dataset.itemId = '';
                modal.querySelector('.modal-title').textContent = '添加信息';

                if (State.data.activeCategory !== Config.DEFAULT_CATEGORY) {
                    categorySelect.value = State.data.activeCategory;
                }
            }

            modal.style.display = 'block';
            DOM.elements.overlay.style.display = 'block';
            DOM.elements.editTitle.focus();
        },
        hideEditModal: function() {
            DOM.elements.editModal.style.display = 'none';
            DOM.elements.overlay.style.display = 'none';
        },
        getEditModalData: function() {
            const modal = DOM.elements.editModal;
            return {
                id: modal.dataset.itemId || null,
                title: DOM.elements.editTitle.value.trim(),
                startDate: DOM.elements.editStartDate.value,
                endDate: DOM.elements.editEndDate.value,
                content: DOM.elements.editContent.value.trim(),
                category: DOM.elements.editCategory.value,
            };
        },

        // --- Modals (Category) ---
        showCategoryModal: function() {
            DOM.elements.categoryNameInput.value = '';
            DOM.elements.categoryModal.style.display = 'block';
            DOM.elements.overlay.style.display = 'block';
            DOM.elements.categoryNameInput.focus();
        },
        hideCategoryModal: function() {
            DOM.elements.categoryModal.style.display = 'none';
            DOM.elements.overlay.style.display = 'none';
        },
        getCategoryModalData: function() {
            return DOM.elements.categoryNameInput.value.trim();
        },
        
        // --- Modals (Confirmations) ---
        showDeleteItemConfirm: function(itemId, onConfirm) {
            let modal = DOM.elements.deleteItemModal; // 使用缓存的 modal
            if (!modal) return; // 安全检查

            modal.style.display = 'block';
            DOM.elements.overlay.style.display = 'block';

            const confirmBtn = modal.querySelector(Config.SELECTORS.CONFIRM_DELETE_ITEM_BTN);
            const cancelBtn = modal.querySelector(Config.SELECTORS.CANCEL_DELETE_ITEM_BTN);

            const close = () => {
                modal.style.display = 'none';
                DOM.elements.overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', close);
                DOM.elements.overlay.removeEventListener('click', overlayHandler);
            };
            
            const confirmHandler = () => {
                onConfirm(itemId);
                close();
            };
            
            const overlayHandler = (e) => {
                if (e.target === DOM.elements.overlay) close();
            };

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', close);
            DOM.elements.overlay.addEventListener('click', overlayHandler);
        },
        
        showDeleteCategoryConfirm: function(categoryName, onConfirm) {
            let modal = DOM.elements.deleteCategoryModal; // 使用缓存的 modal
            if (!modal) return; // 安全检查

            modal.querySelector('.delete-category-message').innerHTML = `确定要删除分类“<strong>${categoryName}</strong>”吗？`;
            modal.style.display = 'block';
            DOM.elements.overlay.style.display = 'block';
            
            const confirmBtn = modal.querySelector(Config.SELECTORS.CONFIRM_DELETE_CATEGORY_BTN);
            const cancelBtn = modal.querySelector(Config.SELECTORS.CANCEL_DELETE_CATEGORY_BTN);
            
            const close = () => {
                modal.style.display = 'none';
                DOM.elements.overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', close);
                DOM.elements.overlay.removeEventListener('click', overlayHandler);
            };

            const confirmHandler = () => {
                const moveItems = modal.querySelector('input[name="delete-option"]:checked').value === 'move';
                onConfirm(categoryName, moveItems);
                close();
            };

            const overlayHandler = (e) => {
                if (e.target === DOM.elements.overlay) close();
            };

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', close);
            DOM.elements.overlay.addEventListener('click', overlayHandler);
        },

        showRenameCategoryPrompt: function(oldName, onConfirm) {
            let modal = DOM.elements.renameCategoryModal; // 使用缓存的 modal
            if (!modal) return; // 安全检查
            
            modal.querySelector('.rename-category-message').innerHTML = `请为分类“<strong>${oldName}</strong>”输入新名称：`;
            const input = modal.querySelector(Config.SELECTORS.NEW_CATEGORY_NAME_INPUT);
            input.value = oldName;

            modal.style.display = 'block';
            DOM.elements.overlay.style.display = 'block';
            input.focus();

            const confirmBtn = modal.querySelector(Config.SELECTORS.CONFIRM_RENAME_CATEGORY_BTN);
            const cancelBtn = modal.querySelector(Config.SELECTORS.CANCEL_RENAME_CATEGORY_BTN);

            const close = () => {
                modal.style.display = 'none';
                DOM.elements.overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', close);
                DOM.elements.overlay.removeEventListener('click', overlayHandler);
            };

            const confirmHandler = () => {
                const newName = input.value.trim();
                if (onConfirm(oldName, newName)) {
                    close();
                }
            };
            
            const overlayHandler = (e) => {
                if (e.target === DOM.elements.overlay) close();
            };

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', close);
            DOM.elements.overlay.addEventListener('click', overlayHandler);
        },

        // --- Modals (Detail View) ---
        showDetailModal: function(item) {
            let modal = DOM.elements.detailModal; // 使用缓存的 modal
            if (!modal) return; // 安全检查
            
            DOM.elements.detailTitle.textContent = item.title;
            DOM.elements.detailCategory.textContent = item.category;
            
            const dateElement = DOM.elements.detailDate;
            
            // --- 修复开始 ---
            // 恢复日期显示逻辑，并移除错误粘贴的 HTML
            if (item.startDate || item.endDate) {
                dateElement.textContent = item.startDate && item.endDate 
                    ? `${item.startDate} - ${item.endDate}` 
                    : (item.startDate || item.endDate);
                // 显示包含日期的整个 .info-field
                if(dateElement.parentElement) dateElement.parentElement.style.display = "block";
            } else {
                // 隐藏包含日期的整个 .info-field
                if(dateElement.parentElement) dateElement.parentElement.style.display = "none";
            }
            
            DOM.elements.detailContent.textContent = item.content;
            modal.style.display = "block";
            // --- 修复结束 ---
        },
        hideDetailModal: function() {
            if (DOM.elements.detailModal) { // 使用缓存的 modal
                DOM.elements.detailModal.style.display = "none";
            }
        },

        showAlertModal: function(message, title = '提示') {
            let modal = DOM.elements.alertModal;
            if (!modal) return;

            modal.querySelector('#alert-modal-title').textContent = title;
            modal.querySelector('.alert-message').innerHTML = message;
            modal.style.display = 'block';

            const confirmBtn = modal.querySelector('#alert-modal-confirm');
            const close = () => {
                modal.style.display = 'none';
                confirmBtn.removeEventListener('click', close);
            };
            confirmBtn.addEventListener('click', close);
        },

        // --- Sidebar State ---
        expandSidebar: function() {
            DOM.elements.assistant.classList.remove(Config.CLASSES.COLLAPSED);
            DOM.elements.assistant.classList.remove(Config.CLASSES.HIDDEN_SIDEBAR);
            DOM.elements.assistant.classList.add(Config.CLASSES.OPEN);
            State.ui.isExpanded = true;
        },
        collapseSidebar: function() {
            // 在折叠侧边栏时关闭所有右键菜单
            UI.hideItemContextMenu();
            UI.hideCategoryContextMenu();
            
            DOM.elements.assistant.classList.remove(Config.CLASSES.OPEN);
            DOM.elements.assistant.classList.add(Config.CLASSES.COLLAPSED);
            State.ui.isExpanded = false;
            
            // 根据设置决定是否隐藏最小化的侧边栏
            UI.applyHideCollapsedState();
        },
        // 应用隐藏最小化侧边栏的状态
        applyHideCollapsedState: function() {
            if (State.data.hideCollapsed) {
                // 使用 CSS class 而非 display 属性，防止破坏 Flex 布局
                DOM.elements.assistant.classList.add(Config.CLASSES.HIDDEN_SIDEBAR);
            } else {
                DOM.elements.assistant.classList.remove(Config.CLASSES.HIDDEN_SIDEBAR);
            }
        },
        // 切换隐藏最小化侧边栏的设置
        toggleHideCollapsed: function() {
            State.data.hideCollapsed = !State.data.hideCollapsed;
            Storage.save();
            UI.collapseSidebar();
            UI.applyHideCollapsedState();
        },
        toggleSidebarPosition: function() {
            const assistant = DOM.elements.assistant;
            const toggleBtn = DOM.elements.toggleBtn;

            if (assistant.classList.contains(Config.CLASSES.LEFT)) {
                assistant.classList.remove(Config.CLASSES.LEFT);
                toggleBtn.textContent = '◀';
                toggleBtn.title = '移到左侧';
                State.data.sidebarPosition = 'right';
            } else {
                assistant.classList.add(Config.CLASSES.LEFT);
                toggleBtn.textContent = '▶';
                toggleBtn.title = '移到右侧';
                State.data.sidebarPosition = 'left';
            }
            Storage.save();
        },
        applyFixedState: function(isFixed) {
            const assistant = DOM.elements.assistant;
            const fixBtn = DOM.elements.fixBtn;
            if (isFixed) {
                assistant.classList.add(Config.CLASSES.FIXED);
                fixBtn.textContent = '🔒';
                fixBtn.title = '固定';
            } else {
                assistant.classList.remove(Config.CLASSES.FIXED);
                fixBtn.textContent = '🔓';
                fixBtn.title = '取消固定';
            }
        },
        applySidebarPosition: function(position) {
            const assistant = DOM.elements.assistant;
            if (position === 'left') {
                assistant.classList.add(Config.CLASSES.LEFT);
            } else {
                assistant.classList.remove(Config.CLASSES.LEFT);
            }
        },

        // --- Sidebar Drag (Collapsed) ---
        startSidebarDrag: function(e) {
            State.ui.isDraggingSidebar = true;
            State.ui.hasDraggedSidebar = true;
            State.ui.sidebarDragStartY = e.clientY;
            
            const computedStyle = window.getComputedStyle(DOM.elements.assistant);
            State.ui.sidebarDragStartTop = parseFloat(computedStyle.top) || 0;
            
            DOM.elements.assistant.classList.remove(Config.CLASSES.DRAG_READY);
            DOM.elements.assistant.classList.add(Config.CLASSES.DRAGGING);
            
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'ns-resize';
        },
        handleSidebarDrag: function(e) {
            if (!State.ui.isDraggingSidebar) return;

            if (State.ui.lastSidebarAnimationFrame) {
                cancelAnimationFrame(State.ui.lastSidebarAnimationFrame);
            }

            State.ui.lastSidebarAnimationFrame = requestAnimationFrame(() => {
                const currentTime = Date.now();
                const deltaY = e.clientY - State.ui.sidebarDragStartY;
                const newTop = State.ui.sidebarDragStartTop + deltaY;
                
                if (State.ui.lastSidebarDragTime > 0) {
                    const deltaTime = currentTime - State.ui.lastSidebarDragTime;
                    if (deltaTime > 0) {
                        State.ui.sidebarDragVelocity = (deltaY - State.ui.lastSidebarDragY) / deltaTime;
                    }
                }
                State.ui.lastSidebarDragY = deltaY;
                State.ui.lastSidebarDragTime = currentTime;
                
                const viewportHeight = window.innerHeight;
                const sidebarHeight = DOM.elements.assistant.offsetHeight;
                const minTop = 0;
                const maxTop = viewportHeight - sidebarHeight;
                
                let clampedTop = Math.max(minTop, Math.min(maxTop, newTop));
                
                if (newTop < minTop) {
                    const overshoot = minTop - newTop;
                    clampedTop = minTop - Math.min(overshoot * 0.3, 20);
                } else if (newTop > maxTop) {
                    const overshoot = newTop - maxTop;
                    clampedTop = maxTop + Math.min(overshoot * 0.3, 20);
                }
                
                DOM.elements.assistant.style.setProperty('--collapsed-top', clampedTop + 'px');
            });
        },
        endSidebarDrag: function() {
            State.ui.isDraggingSidebar = false;
            
            if (State.ui.lastSidebarAnimationFrame) {
                cancelAnimationFrame(State.ui.lastSidebarAnimationFrame);
                State.ui.lastSidebarAnimationFrame = null;
            }
            
            setTimeout(() => {
                DOM.elements.assistant.classList.remove(Config.CLASSES.DRAGGING);
            }, 10);
            
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            
            if (DOM.elements.assistant.classList.contains(Config.CLASSES.COLLAPSED)) {
                const currentTop = parseFloat(DOM.elements.assistant.style.getPropertyValue('--collapsed-top')) || 0;
                State.data.collapsedPosition = { top: currentTop };
                Storage.save();
            }
            
            State.ui.lastSidebarDragY = 0;
            State.ui.sidebarDragVelocity = 0;
            State.ui.lastSidebarDragTime = 0;
        },
        restoreCollapsedPosition: function() {
            if (State.data.collapsedPosition && DOM.elements.assistant.classList.contains(Config.CLASSES.COLLAPSED)) {
                const { top } = State.data.collapsedPosition;
                const viewportHeight = window.innerHeight;
                const sidebarHeight = DOM.elements.assistant.offsetHeight;
                const minTop = 0;
                const maxTop = viewportHeight - sidebarHeight;
                const validTop = Math.max(minTop, Math.min(maxTop, parseInt(top) || viewportHeight / 2 - sidebarHeight / 2));
                
                DOM.elements.assistant.style.setProperty('--collapsed-top', validTop + 'px');
            }
        },

        // --- Helper ---
        isClickInExcludedElements: function(target) {
            const excludedIds = [
                Config.SELECTORS.EDIT_MODAL,
                Config.SELECTORS.CATEGORY_MODAL,
                Config.SELECTORS.DELETE_ITEM_MODAL,
                Config.SELECTORS.DELETE_CATEGORY_MODAL,
                Config.SELECTORS.RENAME_CATEGORY_MODAL,
                Config.SELECTORS.CONTEXT_MENU,
                Config.SELECTORS.CATEGORY_CONTEXT_MENU,
                Config.SELECTORS.OVERLAY,
                Config.SELECTORS.DETAIL_MODAL,
                Config.SELECTORS.ALERT_MODAL, // 新增：通用提示框
            ];

            for (const id of excludedIds) {
                if (target.closest(id)) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: TinyMCEIntegrator
     * 封装所有与 TinyMCE 编辑器集成的逻辑
     * ----------------------------------------------------------------
     */
    const TinyMCEIntegrator = {
        init: function() {
            this.checkAndBindExisting();
            this.observeForNewEditors();
            console.log("[TinyMCE] 事件监听初始化完成 (Observer + 短轮询).");

            // 自动填充的全局监听
            document.addEventListener('mouseup', (e) => {
                if (State.autofill.lastClickedItemContent) {
                    console.log('[AutoFill Debug] 执行自动填充');
                    
                    // 检查是否点击在 TinyMCE 实例上
                    const tinymceEditor = this.findEditorForElement(e.target);
                    if (tinymceEditor) {
                        console.log(`[AutoFill Debug] 填充到 TinyMCE: ${tinymceEditor.id}`);
                        tinymceEditor.setContent(State.autofill.lastClickedItemContent);
                    } else {
                        // 否则，使用通用模拟输入
                        Utils.simulateInputAtCursor(State.autofill.lastClickedItemContent);
                    }
                    
                    this.clearAutofill();
                }
            });
        },
        
        findEditorForElement: function(element) {
            if (!unsafeWindow.tinymce || !unsafeWindow.tinymce.editors) return null;
            
            for (const editor of unsafeWindow.tinymce.editors) {
                if (editor.iframeElement && editor.iframeElement.contains(element)) {
                    return editor;
                }
                if (editor.inline && editor.getBody().contains(element)) {
                    return editor;
                }
            }
            // 检查 e.target 是否是某个 editor 的 iframe
            const iframe = element.closest('iframe.tox-edit-area__iframe');
            if (iframe) {
                return unsafeWindow.tinymce.editors.find(ed => ed.iframeElement === iframe);
            }
            
            return null;
        },

        clearAutofill: function() {
            State.autofill.lastClickedItemContent = null;
            if (State.autofill.timeout) {
                clearTimeout(State.autofill.timeout);
                State.autofill.timeout = null;
            }
        },

        setAutofill: function(content) {
            this.clearAutofill();
            State.autofill.lastClickedItemContent = content;
            State.autofill.timeout = setTimeout(() => {
                this.clearAutofill();
                console.log('[AutoFill Debug] 自动填充超时，已清除缓存的内容');
            }, Config.TIMERS.AUTO_FILL_TIMEOUT);
        },

        bindEditorEvents: function(editor) {
            if (!editor || editor._tampermonkeyBound) return;
            editor._tampermonkeyBound = true;
            console.log("[TinyMCE] 绑定事件:", editor.id);

            editor.on('init', () => {
                const iframe = editor.iframeElement;
                if (iframe && iframe.contentDocument) {
                    const doc = iframe.contentDocument;
                    doc.addEventListener('click', (e) => {
                        if (State.autofill.lastClickedItemContent) {
                            editor.setContent(State.autofill.lastClickedItemContent);
                            this.clearAutofill();
                            console.log(`[TinyMCE DOM] [${editor.id}] Clicked and filled:`, e.target);
                        }
                    });
                    console.log(`[TinyMCE] DOM 监听已挂载 -> ${editor.id}`);
                }
            });
        },

        checkAndBindExisting: function() {
            let bound = false;
            if (unsafeWindow.tinymce && unsafeWindow.tinymce.editors) {
                unsafeWindow.tinymce.editors.forEach(editor => {
                    if (editor && !editor.destroyed && !editor._tampermonkeyBound) {
                        this.bindEditorEvents(editor);
                        bound = true;
                    }
                });
            }
            return bound;
        },

        startShortPolling: function() {
            let elapsed = 0;
            const interval = setInterval(() => {
                if (this.checkAndBindExisting()) {
                    clearInterval(interval);
                    return;
                }
                elapsed += Config.TIMERS.TINYMCE_POLL_INTERVAL;
                if (elapsed >= Config.TIMERS.TINYMCE_POLL_TIMEOUT) {
                    clearInterval(interval);
                }
            }, Config.TIMERS.TINYMCE_POLL_INTERVAL);
        },

        observeForNewEditors: function() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        this.startShortPolling();
                        break;
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: Handlers
     * 存放所有事件处理函数 (业务逻辑)
     * ----------------------------------------------------------------
     */
    const Handlers = {
        // --- Sidebar Controls ---
        onTogglePositionClick: function(e) {
            e.stopPropagation();
            UI.toggleSidebarPosition();
        },
        onFixBtnClick: function(e) {
            e.stopPropagation();
            State.data.isFixed = !State.data.isFixed;
            UI.applyFixedState(State.data.isFixed);
            Storage.save();
        },
        onCloseBtnClick: function(e) {
            e.stopPropagation();
            UI.collapseSidebar();
        },
        onTitleClick: function(e) {
            e.stopPropagation();
            if (DOM.elements.assistant.classList.contains(Config.CLASSES.COLLAPSED) && !State.ui.hasDraggedSidebar) {
                UI.expandSidebar();
            } else {
                UI.collapseSidebar();
            }
        },
        onAssistantClick: function(e) {
            if (DOM.elements.assistant.classList.contains(Config.CLASSES.COLLAPSED) &&
                !e.target.closest(Config.SELECTORS.CONTROLS) &&
                e.target.id !== Config.SELECTORS.TITLE.slice(1) &&
                !State.ui.hasDraggedSidebar) {
                UI.expandSidebar();
            }
        },

        // --- Sidebar Drag ---
        onSidebarMouseDown: function(e) {
            if (DOM.elements.assistant.classList.contains(Config.CLASSES.COLLAPSED)) {
                e.preventDefault();
                DOM.elements.assistant.classList.add(Config.CLASSES.DRAG_READY);
                State.ui.hasDraggedSidebar = false;
                
                State.ui.sidebarLongPressTimer = setTimeout(() => {
                    UI.startSidebarDrag(e);
                }, Config.TIMERS.SIDEBAR_DRAG_START_DELAY);
            }
        },
        onDocumentMouseMove: function(e) {
            if (State.ui.isDraggingSidebar) {
                UI.handleSidebarDrag(e);
            }
        },
        onDocumentMouseUp: function() {
            DOM.elements.assistant.classList.remove(Config.CLASSES.DRAG_READY);
            if (State.ui.sidebarLongPressTimer) {
                clearTimeout(State.ui.sidebarLongPressTimer);
                State.ui.sidebarLongPressTimer = null;
            }
            if (State.ui.isDraggingSidebar) {
                UI.endSidebarDrag();
            }
        },

        // --- Global Clicks / Keys ---
        onDocumentClick: function(e) {
            // 1. 关闭右键菜单
            UI.hideItemContextMenu();
            UI.hideCategoryContextMenu();
            
            // 2. 点击外部自动收起侧边栏
            const assistant = DOM.elements.assistant;
            if (!assistant.contains(e.target) &&
                State.ui.isExpanded &&
                !State.data.isFixed &&
                !UI.isClickInExcludedElements(e.target)) {
                UI.collapseSidebar();
            }
        },
        onDocumentKeydown: function(e) {
            // ESC 关闭 Modals
            if (e.key === 'Escape') {
                UI.hideEditModal();
                UI.hideCategoryModal();
                // (确认框由其各自的取消按钮处理)
            }
            // 快捷键 Alt+Shift+L
            if (e.key && e.key.toLowerCase() === 'l' && e.altKey && e.shiftKey) {
                e.preventDefault();
                State.ui.isExpanded ? UI.collapseSidebar() : UI.expandSidebar();
            }
            // Ctrl 键按下 (用于详情)
            if (State.hoverDetail.isMouseOver && State.hoverDetail.currentItem && (e.key === "Control" || e.key === "Ctrl")) {
                Handlers.startDetailTimer(State.hoverDetail.currentItem);
            }
        },
        onDocumentKeyup: function(e) {
            // Ctrl 键松开
            if (e.key === "Control" || e.key === "Ctrl") {
                if (State.hoverDetail.timer) clearTimeout(State.hoverDetail.timer);
                State.hoverDetail.timer = null;
                UI.hideDetailModal();
            }
        },
        startDetailTimer: function(itemEl) {
            if (State.hoverDetail.timer) clearTimeout(State.hoverDetail.timer);
            State.hoverDetail.timer = setTimeout(() => {
                const fullItem = State.data.items.find(i => i.id === itemEl.dataset.id);
                if (fullItem) UI.showDetailModal(fullItem);
            }, Config.TIMERS.DETAIL_HOVER_DELAY);
        },

        // --- Footer ---
        onSearchInput: function() {
            DOM.renderItems();
        },
        onAddItemClick: function() {
            UI.showEditModal(null);
        },

        // --- Modals (Item) ---
        onSaveItemClick: function() {
            const data = UI.getEditModalData();
            if (!data.title || !data.content) {
                UI.showAlertModal('请填写标题和内容');
                return;
            }
            Storage.saveItem(data);
            DOM.update();
            UI.hideEditModal();
        },
        onCancelEditClick: function() {
            UI.hideEditModal();
        },

        // --- Modals (Category) ---
        onSaveCategoryClick: function() {
            const name = UI.getCategoryModalData();
            if (name) {
                if (Storage.saveCategory(name)) {
                    DOM.update();
                    UI.hideCategoryModal();
                } else {
                    UI.showAlertModal('分类已存在！');
                }
            }
        },
        onCancelCategoryClick: function() {
            UI.hideCategoryModal();
        },

        // --- Category Container (Delegated) ---
        onCategoryContainerClick: function(e) {
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn) {
                State.data.activeCategory = categoryBtn.dataset.category;

                // 关键修复：
                // 修复方法巧妙地利用了 JavaScript 的事件循环机制：使用 setTimeout(() => {}, 0) 将渲染操作延迟到下一个事件循环执行。
                // 如果不延迟，renderCategories() 会立即销毁 e.target (被点击的按钮),
                // 导致事件冒泡到 document 时, onDocumentClick 中的 assistant.contains(e.target) 会返回 false, 从而错误地关闭侧边栏。
                setTimeout(() => {
                    DOM.renderCategories();
                    DOM.renderItems();
                }, 0);
            }
            if (e.target.closest(Config.SELECTORS.ADD_CATEGORY_BTN)) {
                UI.showCategoryModal();
            }
        },
        onCategoryContainerContextMenu: function(e) {
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn) {
                // 在打开新菜单前，关闭所有已打开的菜单
                UI.hideItemContextMenu();
                UI.hideCategoryContextMenu();
                const categoryName = categoryBtn.dataset.category;
                if (categoryName !== Config.DEFAULT_CATEGORY) {
                    UI.showCategoryContextMenu(e, categoryName);
                }
            }
        },
        onCategoryDragStart: function(e) {
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn && categoryBtn.dataset.category !== Config.DEFAULT_CATEGORY) {
                e.stopPropagation();
                State.drag.draggedCategory = categoryBtn;
                categoryBtn.classList.add(Config.CLASSES.DRAGGING);
                e.dataTransfer.effectAllowed = 'move';
            }
        },
        onCategoryDragEnd: function(e) {
            if (State.drag.draggedCategory) {
                State.drag.draggedCategory.classList.remove(Config.CLASSES.DRAGGING);
            }
            if (State.drag.overCategory) {
                State.drag.overCategory.style.borderTop = 'none';
            }
            State.drag.draggedCategory = null;
            State.drag.overCategory = null;
        },
        onCategoryDragOver: function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        },
        onCategoryDragEnter: function(e) {
            e.preventDefault();
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn && categoryBtn !== State.drag.draggedCategory && categoryBtn !== State.drag.overCategory && categoryBtn.dataset.category !== Config.DEFAULT_CATEGORY) {
                if (State.drag.overCategory) {
                    State.drag.overCategory.style.borderTop = 'none';
                }
                State.drag.overCategory = categoryBtn;
                State.drag.overCategory.style.borderTop = '2px solid #4CAF50';
            }
        },
        onCategoryDragLeave: function(e) {
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn && State.drag.overCategory === categoryBtn) {
                if (!categoryBtn.contains(e.relatedTarget)) {
                    categoryBtn.style.borderTop = 'none';
                    State.drag.overCategory = null;
                }
            }
        },
        onCategoryDrop: function(e) {
            e.preventDefault();
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            if (categoryBtn && categoryBtn !== State.drag.draggedCategory && categoryBtn.dataset.category !== Config.DEFAULT_CATEGORY && State.drag.draggedCategory) {
                const draggedName = State.drag.draggedCategory.dataset.category;
                const targetName = categoryBtn.dataset.category;
                Storage.updateCategoryOrder(draggedName, targetName);
                DOM.renderCategories(); // 只重绘分类
            }
            if (State.drag.overCategory) {
                State.drag.overCategory.style.borderTop = 'none';
            }
            State.drag.overCategory = null;
        },
        
        // --- Category Context Menu ---
        onRenameCategoryMenuClick: function() {
            const categoryName = DOM.elements.categoryContextMenu.dataset.categoryName;
            UI.hideCategoryContextMenu();
            if (categoryName) {
                UI.showRenameCategoryPrompt(categoryName, (oldName, newName) => {
                    const success = Storage.renameCategory(oldName, newName);
                    if (success) DOM.update();
                    return success;
                });
            }
        },
        onDeleteCategoryMenuClick: function() {
            const categoryName = DOM.elements.categoryContextMenu.dataset.categoryName;
            UI.hideCategoryContextMenu();
            if (categoryName) {
                UI.showDeleteCategoryConfirm(categoryName, (name, moveItems) => {
                    Storage.deleteCategory(name, moveItems);
                    // 如果删除的是当前激活的分类，则切换到“全部”
                    if (State.data.activeCategory === name) {
                        State.data.activeCategory = Config.DEFAULT_CATEGORY;
                    }
                    DOM.update();
                });
            }
        },

        // --- Items Container (Delegated) ---
        onItemsContainerClick: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (!itemEl) return;

            // 检查右键菜单是否可见
            if (DOM.elements.itemContextMenu.style.display === 'block') return;

            const itemId = itemEl.dataset.id;
            const item = State.data.items.find(i => i.id === itemId);
            if (!item) return;

            const isShift = e.shiftKey;
            const isCtrl = e.ctrlKey;

            if (isShift && isCtrl) {
                // Shift+Ctrl: 复制标题
                console.log('[AutoFill Debug] Shift+Ctrl: 复制标题');
                Utils.copyToClipboard(item.title);
            } else if (isCtrl) {
                // Ctrl: 复制内容
                console.log('[AutoFill Debug] Ctrl: 复制内容');
                Utils.copyToClipboard(item.content);
            } else if (isShift) {
                // Shift: 自动填充标题
                console.log('[AutoFill Debug] Shift: 准备填充标题');
                TinyMCEIntegrator.setAutofill(item.title);
            } else {
                // Click: 自动填充内容
                console.log('[AutoFill Debug] Click: 准备填充内容');
                TinyMCEIntegrator.setAutofill(item.content);
            }
        },
        onItemsContainerContextMenu: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl) {
                UI.hideItemContextMenu();
                UI.hideCategoryContextMenu();
                const itemId = itemEl.dataset.id;
                UI.showItemContextMenu(e, itemId);
            }
        },
        onItemsContainerDragStart: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl) {
                e.stopPropagation();
                State.drag.draggedItem = itemEl;
                itemEl.classList.add(Config.CLASSES.DRAGGING);
                e.dataTransfer.effectAllowed = 'move';
                // (自定义拖拽图像的逻辑可以加在这里)
            }
        },
        onItemsContainerDragEnd: function() {
            if (State.drag.draggedItem) {
                State.drag.draggedItem.classList.remove(Config.CLASSES.DRAGGING);
            }
            if (State.drag.overItem) {
                State.drag.overItem.style.borderTop = 'none';
            }
            State.drag.draggedItem = null;
            State.drag.overItem = null;
        },
        onItemsContainerDragOver: function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        },
        onItemsContainerDragEnter: function(e) {
            e.preventDefault();
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl && itemEl !== State.drag.draggedItem && itemEl !== State.drag.overItem) {
                if (State.drag.overItem) {
                    State.drag.overItem.style.borderTop = 'none';
                }
                State.drag.overItem = itemEl;
                State.drag.overItem.style.borderTop = '2px solid #4CAF50';
            }
        },
        onItemsContainerDragLeave: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
             if (itemEl && State.drag.overItem === itemEl) {
                if (!itemEl.contains(e.relatedTarget)) {
                    itemEl.style.borderTop = 'none';
                    State.drag.overItem = null;
                }
            }
        },
        onItemsContainerDrop: function(e) {
            e.preventDefault();
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl && itemEl !== State.drag.draggedItem && State.drag.draggedItem) {
                const draggedId = State.drag.draggedItem.dataset.id;
                const targetId = itemEl.dataset.id;
                Storage.updateItemOrder(draggedId, targetId);
                DOM.renderItems(); // 只重绘 Items
            }
            if (State.drag.overItem) {
                State.drag.overItem.style.borderTop = 'none';
            }
            State.drag.overItem = null;
        },
        onItemsContainerMouseOver: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl) {
                State.hoverDetail.isMouseOver = true;
                State.hoverDetail.currentItem = itemEl;
                if (e.ctrlKey) {
                    // 直接处理Ctrl+悬停逻辑，清除旧的timer并创建新的timer
                    Handlers.startDetailTimer(itemEl);
                }
            }
        },
        onItemsContainerMouseOut: function(e) {
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            if (itemEl) {
                State.hoverDetail.isMouseOver = false;
                State.hoverDetail.currentItem = null;
                if (State.hoverDetail.timer) clearTimeout(State.hoverDetail.timer);
                State.hoverDetail.timer = null;
                UI.hideDetailModal();
            }
        },

        // --- Item Context Menu ---
        onEditItemMenuClick: function() {
            const itemId = DOM.elements.itemContextMenu.dataset.itemId;
                UI.hideItemContextMenu();
            if (itemId) {
                UI.showEditModal(itemId);
            }
        },
        onDeleteItemMenuClick: function() {
            const itemId = DOM.elements.itemContextMenu.dataset.itemId;
                UI.hideItemContextMenu();
            if (itemId) {
                UI.showDeleteItemConfirm(itemId, (id) => {
                    Storage.deleteItemById(id);
                    DOM.update();
                });
            }
        },

        // --- 右键菜单屏蔽 ---
        onAssistantContextMenu: function(e) {
            // 总是阻止浏览器的默认右键行为
            e.preventDefault();
            e.stopPropagation();
            
            // 检查是否点击在条目或分类按钮上
            const itemEl = e.target.closest(Config.SELECTORS.INFO_ITEM);
            const categoryBtn = e.target.closest(Config.SELECTORS.CATEGORY_BTN);
            
            // 如果不是点击在条目或分类按钮上，则关闭所有右键菜单
            if (!itemEl && !categoryBtn) {
                // 在右键点击侧边栏空白区域时关闭所有右键菜单
                UI.hideItemContextMenu();
                UI.hideCategoryContextMenu();
            }
            // 如果点击在条目或分类按钮上，不关闭菜单，让相应的右键菜单处理函数处理
            return false;
        },
    };


    /**
     * ----------------------------------------------------------------
     * 模块: Events
     * 集中管理所有 DOM 事件监听器的绑定
     * ----------------------------------------------------------------
     */
    const Events = {
        init: function() {
            const els = DOM.elements; //
            
            // --- Sidebar Controls ---
            els.toggleBtn.addEventListener('click', Handlers.onTogglePositionClick);
            els.fixBtn.addEventListener('click', Handlers.onFixBtnClick);
            els.closeBtn.addEventListener('click', Handlers.onCloseBtnClick);
            els.title.addEventListener('click', Handlers.onTitleClick);
            els.assistant.addEventListener('click', Handlers.onAssistantClick);
            
            // --- 屏蔽侧边栏右键菜单 ---
            els.assistant.addEventListener('contextmenu', Handlers.onAssistantContextMenu);

            // --- Sidebar Drag ---
            els.assistant.addEventListener('mousedown', Handlers.onSidebarMouseDown);
            document.addEventListener('mousemove', Handlers.onDocumentMouseMove);
            document.addEventListener('mouseup', Handlers.onDocumentMouseUp);

            // --- Global ---
            document.addEventListener('click', Handlers.onDocumentClick);
            document.addEventListener('keydown', Handlers.onDocumentKeydown);
            document.addEventListener('keyup', Handlers.onDocumentKeyup);
            window.addEventListener('resize', UI.restoreCollapsedPosition);
            
            // --- Footer ---
            els.searchInput.addEventListener('input', Handlers.onSearchInput);
            els.addItemBtn.addEventListener('click', Handlers.onAddItemClick);
            
            // --- Modals ---
            els.saveEditBtn.addEventListener('click', Handlers.onSaveItemClick);
            els.cancelEditBtn.addEventListener('click', Handlers.onCancelEditClick);
            els.saveCategoryBtn.addEventListener('click', Handlers.onSaveCategoryClick);
            els.cancelCategoryBtn.addEventListener('click', Handlers.onCancelCategoryClick);
            
            // --- Category Container (Event Delegation) ---
            els.categoryContainer.addEventListener('click', Handlers.onCategoryContainerClick);
            els.categoryContainer.addEventListener('contextmenu', Handlers.onCategoryContainerContextMenu);
            els.categoryContainer.addEventListener('dragstart', Handlers.onCategoryDragStart);
            els.categoryContainer.addEventListener('dragend', Handlers.onCategoryDragEnd);
            els.categoryContainer.addEventListener('dragover', Handlers.onCategoryDragOver);
            els.categoryContainer.addEventListener('dragenter', Handlers.onCategoryDragEnter);
            els.categoryContainer.addEventListener('dragleave', Handlers.onCategoryDragLeave);
            els.categoryContainer.addEventListener('drop', Handlers.onCategoryDrop);
            
            // --- Category Context Menu ---
            els.renameCategoryMenu.addEventListener('click', Handlers.onRenameCategoryMenuClick);
            els.deleteCategoryMenu.addEventListener('click', Handlers.onDeleteCategoryMenuClick);
            
            // --- Items Container (Event Delegation) ---
            els.itemsContainer.addEventListener('click', Handlers.onItemsContainerClick);
            els.itemsContainer.addEventListener('contextmenu', Handlers.onItemsContainerContextMenu);
            els.itemsContainer.addEventListener('dragstart', Handlers.onItemsContainerDragStart);
            els.itemsContainer.addEventListener('dragend', Handlers.onItemsContainerDragEnd);
            els.itemsContainer.addEventListener('dragover', Handlers.onItemsContainerDragOver);
            els.itemsContainer.addEventListener('dragenter', Handlers.onItemsContainerDragEnter);
            els.itemsContainer.addEventListener('dragleave', Handlers.onItemsContainerDragLeave);
            els.itemsContainer.addEventListener('drop', Handlers.onItemsContainerDrop);
            els.itemsContainer.addEventListener('mouseover', Handlers.onItemsContainerMouseOver);
            els.itemsContainer.addEventListener('mouseout', Handlers.onItemsContainerMouseOut);
            
            // --- Item Context Menu ---
            els.editItemMenu.addEventListener('click', Handlers.onEditItemMenuClick);
            els.deleteItemMenu.addEventListener('click', Handlers.onDeleteItemMenuClick);
        }
    };

    /**
     * ----------------------------------------------------------------
     * 模块: Menu
     * 负责处理油猴菜单命令注册
     * ----------------------------------------------------------------
     */
const Menu = {
    _menuCommandId: null, // 用于存储菜单命令ID
    
    // 注册或更新油猴菜单命令
    registerOrUpdateMenuCommand: function() {
        try {
            
            // 如果已经注册过，先注销旧的
            if (this._menuCommandId !== null) {
                GM_unregisterMenuCommand(this._menuCommandId);
                this._menuCommandId = null;
            }

            // 根据当前状态确定菜单项标题
            const menuTitle = State.data.hideCollapsed ?
                '显示最小化侧边栏' : '隐藏最小化侧边栏';
            
            // 注册新的菜单命令并保存其ID
            this._menuCommandId = GM_registerMenuCommand(
                menuTitle,
                this.menuCommandHandler,
                "h" 
            );
            
            console.log('已注册/更新油猴菜单：', menuTitle);
        } catch (error) {
            console.error('注册/更新油猴菜单失败:', error);
        }
    },

    // 菜单命令处理函数
    menuCommandHandler: function() {
        // 切换隐藏状态
        UI.toggleHideCollapsed();
        // 重新注册以更新菜单项文本
        Menu.registerOrUpdateMenuCommand();
        console.log(`最小化侧边栏已${State.data.hideCollapsed ? '隐藏' : '显示'}`);
    },

    // 初始化油猴菜单
    init: function() {
        this.registerOrUpdateMenuCommand();
    }
};

    /**
     * ----------------------------------------------------------------
     * 模块: App
     * 应用主控制器，负责初始化和协调所有模块
     * ----------------------------------------------------------------
     */
    const App = {
        init: function() {
            console.log("正在启动 Resumer (Refactored)...");
            
            // 1. 注入样式
            StyleManager.inject();

            // 2. 加载数据
            Storage.initialize();
            Storage.load();

            // 3. 创建并渲染 DOM
            DOM.create(); // 内部已包含 DOM.cache()
            DOM.update();

            // 4. 恢复 UI 状态
            UI.applyFixedState(State.data.isFixed);
            UI.applySidebarPosition(State.data.sidebarPosition);
            UI.restoreCollapsedPosition(); // 恢复收起时的位置
            UI.applyHideCollapsedState(); // 应用隐藏最小化侧边栏设置

            // 5. 绑定所有事件
            Events.init();

            // 6. 初始化第三方集成
            TinyMCEIntegrator.init();
            
            // 7. 注册油猴菜单
            Menu.init();

            console.log("Resumer (Refactored) 启动完成。");
        }
    };

    // --- 启动应用 ---
    App.init();

})();