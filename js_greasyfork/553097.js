// ==UserScript==
// @name         头歌破解粘贴-AI答题
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  AI智能答题助手
// @author       xbang
// @match        *://*.educoder.net/tasks/*
// @icon         https://img.icons8.com/fluency/48/bot.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.openai.com
// @connect      api.deepseek.com
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553097/%E5%A4%B4%E6%AD%8C%E7%A0%B4%E8%A7%A3%E7%B2%98%E8%B4%B4-AI%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553097/%E5%A4%B4%E6%AD%8C%E7%A0%B4%E8%A7%A3%E7%B2%98%E8%B4%B4-AI%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[头歌破解粘贴-AI答题 v2.1.0] 启动', 'color: #667eea; font-weight: bold;');

    // === DOM 选择器常量 ===
    const SELECTORS = {
        // 编辑器
        EDITOR_TEXTAREA: 'textarea.inputarea',
        MONACO_EDITOR: '.monaco-editor',

        // 题目容器（按优先级排序）
        QUESTION_CONTAINERS: [
            '.task_pass_content',
            '.task-content',
            '.question-content',
            '.markdown-body',
            '.edu-txt-center',
            'div[class*="task"]'
        ],

        // 提交按钮（按优先级排序）
        SUBMIT_BUTTONS: [
            'button[title="运行评测"]',
            'button.btn-run___fh7pl',
            'button.task_btn_submit',
            'button[type="submit"]'
        ],

        // 测试结果
        TEST_RESULT_SUCCESS: '.test-result:not(.failer)',
        TEST_RESULT_FAILURE: '.test-result.failer',
        TEST_CASE_ITEM: '.test-case-item___E3CU9, .test-case-item',
        TEST_CASE_HEADER: '.case-header___xppld, .case-header, a, h2',

        // UI 元素ID
        SMART_ANSWER_BTN: 'smart-answer-btn',
        SETTINGS_BTN: 'tou-settings-btn',
        MANUAL_PASTE_BTN: 'tou-manual-paste-btn',
        SETTINGS_PANEL: 'tou-settings-panel',
        MANUAL_PASTE_MODAL: 'tou-manual-paste-modal'
    };

    // === 存储键名 ===
    const STORAGE_KEYS = {
        API_PROVIDER: 'tou_api_provider',
        API_URL: 'tou_api_url',
        API_KEY: 'tou_api_key',
        API_MODEL: 'tou_api_model',
        PROMPT_TEMPLATE: 'tou_prompt_template',
        AUTO_SUBMIT: 'tou_auto_submit',
        AUTO_RETRY: 'tou_auto_retry',
        MAX_RETRY_COUNT: 'tou_max_retry_count',
        ENABLE_IMAGE: 'tou_enable_image'
    };

    // === API 提供商配置 ===
    const API_PROVIDERS = {
        OPENAI: {
            id: 'openai',
            name: 'OpenAI',
            defaultUrl: 'https://api.openai.com/v1/chat/completions',
            defaultModel: 'gpt-5-mini',
            models: ['gpt-5-mini', 'gpt-5', 'gpt-5-nano', 'gpt-4o']
        },
        DEEPSEEK: {
            id: 'deepseek',
            name: 'DeepSeek',
            defaultUrl: 'https://api.deepseek.com/v1/chat/completions',
            defaultModel: 'deepseek-chat',
            models: ['deepseek-chat', 'deepseek-coder']
        },
        CUSTOM: {
            id: 'custom',
            name: '自定义 (OpenAI 兼容)',
            defaultUrl: '',
            defaultModel: '',
            models: []
        }
    };

    // === 系统基础 Prompt 模板（封装在代码中，用户不可见）====================
    const SYSTEM_BASE_PROMPT = `你是一个编程助手。请为以下题目提供完整的代码解决方案。

要求：
1. 只输出可直接运行的代码，不要任何文字解释
2. 不要添加 markdown 代码块标记（不要 \`\`\`）
3. 代码要能通过测试
4. 如果题目包含图片，请仔细分析图片内容


`;

    // === 系统纠错 Prompt 模板（封装在代码中，用户不可见）====================
    const SYSTEM_RETRY_PROMPT = `你是一个编程助手。刚才你为以下题目生成的代码输出了错误的结果。

请分析差异原因，重新生成完整的正确代码。


1. 只输出可直接运行的代码，不要任何文字解释
2. 不要添加 markdown 代码块标记（不要 \`\`\`）
3. 确保输出格式与【预期输出】完全一致
4. 代码要能通过测试

`;

    // === 默认配置 ====================
    const DEFAULT_CONFIG = {
        apiProvider: 'openai',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-5-mini',
        promptTemplate: '',
        autoSubmit: true,      // 默认启用自动提交（隐藏）
        autoRetry: true,       // 默认启用自动纠错（隐藏）
        maxRetryCount: 1,      // 固定为 1 次（隐藏）
        enableImage: false     // 默认不启用图片识别
    };

    // === UI 样式常量 ====================
    const UI_STYLES = `
        /* Material Symbols 图标样式 */
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 20px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
        }

        /* 按钮组容器（现代化胶囊设计 - Stitch风格 - 标题下方内联显示） */
        #tou-button-group {
            position: relative;
            z-index: 999999999;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            background: white;
            border-radius: 9999px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            padding: 4px;
            margin: 8px 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #tou-button-group:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        /* 智能答题按钮（主按钮 - Stitch风格） */
        #smart-answer-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 10px;
            background: rgba(96, 122, 251, 0.1);
            color: #607AFB;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
        }
        #smart-answer-btn:hover {
            background: rgba(96, 122, 251, 0.2);
        }
        #smart-answer-btn:active {
            transform: scale(0.96);
        }
        #smart-answer-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        #smart-answer-btn .material-symbols-outlined {
            font-size: 13px;
        }

        /* 状态样式 */
        #smart-answer-btn.working {
            background: rgba(240, 147, 251, 0.1);
            color: #F093FB;
        }
        #smart-answer-btn.success {
            background: rgba(17, 153, 142, 0.1);
            color: #11998E;
        }
        #smart-answer-btn.error {
            background: rgba(235, 51, 73, 0.1);
            color: #EB3349;
        }

        /* 图标按钮（手动粘贴、设置 - Stitch风格） */
        .tou-icon-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            padding: 0;
            background: #F3F4F6;
            color: #6B7280;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tou-icon-btn:hover {
            background: #E5E7EB;
            color: #374151;
        }
        .tou-icon-btn:active {
            transform: scale(0.92);
        }
        .tou-icon-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        .tou-icon-btn .material-symbols-outlined {
            font-size: 13px;
        }

        /* 手动粘贴弹窗样式（Stitch风格 - 左侧任务区域右对齐显示） */
        #tou-manual-paste-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 550px;
            height: 100vh;
            background: transparent;
            z-index: 999999998;
            display: none;
            pointer-events: none;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
        }
        #tou-manual-paste-modal.show {
            display: block;
            pointer-events: auto;
        }

        .tou-modal-content {
            position: absolute;
            top: 60px;
            left: 30px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            max-height: calc(100vh - 140px);
            display: flex;
            flex-direction: column;
            animation: modalSlideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlideInLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes modalSlideInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .tou-modal-header {
            background: white;
            color: #111827;
            padding: 20px 24px;
            border-radius: 24px 24px 0 0;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .tou-modal-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            font-family: 'Inter', sans-serif;
        }
        .tou-modal-close {
            background: transparent;
            border: none;
            color: #6B7280;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        .tou-modal-close:hover {
            background: rgba(107, 114, 128, 0.1);
            color: #374151;
        }

        .tou-modal-body {
            padding: 0 24px 24px 24px;
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        #tou-answer-preview {
            width: 100%;
            min-height: 300px;
            max-height: 400px;
            padding: 16px;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.6;
            resize: vertical;
            box-sizing: border-box;
            background: white;
            color: #111827;
            transition: all 0.2s;
        }
        #tou-answer-preview:focus {
            outline: none;
            border-color: #607AFB;
            box-shadow: 0 0 0 3px rgba(96, 122, 251, 0.1);
        }
        #tou-answer-preview::placeholder {
            color: #9CA3AF;
        }

        .tou-modal-footer {
            padding: 16px 24px 24px 24px;
            background: #F9FAFB;
            border-radius: 0 0 24px 24px;
            border-top: 1px solid #E5E7EB;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .tou-btn-paste {
            padding: 10px 20px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: #607AFB;
            color: white;
            font-family: 'Inter', sans-serif;
        }
        .tou-btn-paste:hover {
            background: rgba(96, 122, 251, 0.9);
            transform: translateY(-1px);
        }
        .tou-btn-paste:active {
            transform: scale(0.98);
        }
        .tou-btn-cancel {
            padding: 10px 20px;
            border: 1px solid #D1D5DB;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: white;
            color: #374151;
            font-family: 'Inter', sans-serif;
        }
        .tou-btn-cancel:hover {
            background: #F9FAFB;
        }

        /* 进度弹窗样式（Stitch风格 - 左侧任务区域右对齐显示） */
        #tou-progress-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 550px;
            height: 100vh;
            background: transparent;
            z-index: 999999999;
            display: none;
            pointer-events: none;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
        }
        #tou-progress-modal.show {
            display: block;
            pointer-events: auto;
        }

        .tou-progress-content {
            position: absolute;
            top: 60px;
            left: 30px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            animation: modalSlideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tou-progress-header {
            background: white;
            color: #111827;
            padding: 20px 24px;
            border-radius: 24px 24px 0 0;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .tou-progress-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tou-progress-header .material-symbols-outlined {
            font-size: 24px;
            color: #607AFB;
        }

        .tou-progress-body {
            padding: 24px;
        }

        .tou-progress-steps {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .tou-progress-step {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            background: #F9FAFB;
            border-radius: 12px;
            transition: all 0.3s;
        }
        .tou-progress-step.active {
            background: rgba(96, 122, 251, 0.1);
            border: 1px solid rgba(96, 122, 251, 0.3);
        }
        .tou-progress-step.completed {
            background: rgba(17, 153, 142, 0.1);
            border: 1px solid rgba(17, 153, 142, 0.3);
        }
        .tou-progress-step.error {
            background: rgba(235, 51, 73, 0.1);
            border: 1px solid rgba(235, 51, 73, 0.3);
        }

        .tou-progress-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .tou-progress-step .material-symbols-outlined {
            font-size: 20px;
            color: #9CA3AF;
        }
        .tou-progress-step.active .material-symbols-outlined {
            color: #607AFB;
            animation: spin 1s linear infinite;
        }
        .tou-progress-step.completed .material-symbols-outlined {
            color: #11998E;
        }
        .tou-progress-step.error .material-symbols-outlined {
            color: #EB3349;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .tou-progress-text {
            flex: 1;
        }
        .tou-progress-text h3 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            font-family: 'Inter', sans-serif;
        }
        .tou-progress-step.active .tou-progress-text h3 {
            color: #607AFB;
        }
        .tou-progress-step.completed .tou-progress-text h3 {
            color: #11998E;
        }
        .tou-progress-step.error .tou-progress-text h3 {
            color: #EB3349;
        }
        .tou-progress-text p {
            margin: 0;
            font-size: 12px;
            color: #6B7280;
            font-family: 'Inter', sans-serif;
        }

        .tou-progress-footer {
            padding: 16px 24px 24px 24px;
            background: #F9FAFB;
            border-radius: 0 0 24px 24px;
            border-top: 1px solid #E5E7EB;
            display: flex;
            justify-content: flex-end;
        }
        .tou-btn-close-progress {
            padding: 10px 20px;
            border: 1px solid #D1D5DB;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: white;
            color: #374151;
            font-family: 'Inter', sans-serif;
            display: none;
        }
        .tou-btn-close-progress.show {
            display: block;
        }
        .tou-btn-close-progress:hover {
            background: #F9FAFB;
        }

        /* 设置面板样式（Stitch风格 - 左侧任务区域右对齐显示） */
        #tou-settings-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 550px;
            height: 100vh;
            background: transparent;
            z-index: 999999998;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
            display: none;
            pointer-events: none;
        }
        #tou-settings-panel.show {
            display: block;
            pointer-events: auto;
        }

        .tou-settings-wrapper {
            position: absolute;
            top: 60px;
            left: 30px;
            width: 100%;
            height: 60%;
            max-width: 400px;
            max-height: calc(100vh - 140px);
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            animation: modalSlideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* 面板头部 */
        #tou-settings-header {
            background: white;
            color: #111827;
            padding: 20px 24px;
            border-radius: 24px 24px 0 0;
            border-bottom: 1px solid #E5E7EB;
        }
        #tou-settings-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            font-family: 'Inter', sans-serif;
        }
        #tou-settings-close {
            position: absolute;
            top: 20px;
            right: 24px;
            background: transparent;
            border: none;
            color: #9CA3AF;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        #tou-settings-close:hover {
            background: rgba(107, 114, 128, 0.1);
            color: #374151;
        }

        /* 可折叠区域 */
        .tou-collapsible-section {
            margin-bottom: 20px;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            overflow: hidden;
        }
        .tou-collapsible-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #F9FAFB;
            cursor: pointer;
            transition: all 0.2s;
            user-select: none;
        }
        .tou-collapsible-header:hover {
            background: #F3F4F6;
        }
        .tou-collapsible-header h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Inter', sans-serif;
        }
        .tou-collapsible-header .material-symbols-outlined {
            font-size: 18px;
            color: #607AFB;
        }
        .tou-collapsible-toggle {
            font-size: 20px;
            color: #6B7280;
            transition: transform 0.3s;
        }
        .tou-collapsible-toggle.expanded {
            transform: rotate(180deg);
        }
        .tou-collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .tou-collapsible-content.expanded {
            max-height: 800px;
        }
        .tou-collapsible-body {
            padding: 20px;
            background: white;
        }

        /* 面板主体 */
        #tou-settings-body {
            padding: 0 24px 24px 24px;
            flex: 1;
            overflow-y: auto;
        }

        /* 表单组 */
        .tou-form-group {
            margin-bottom: 20px;
        }
        .tou-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        .tou-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #6B7280;
            font-size: 12px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
        }
        .tou-form-group input,
        .tou-form-group select,
        .tou-form-group textarea {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.2s;
            background: #F9FAFB;
            color: #111827;
            font-family: 'Inter', sans-serif;
        }
        .tou-form-group input:focus,
        .tou-form-group select:focus,
        .tou-form-group textarea:focus {
            outline: none;
            border-color: #607AFB;
            background: white;
            box-shadow: 0 0 0 3px rgba(96, 122, 251, 0.1);
        }
        .tou-form-group textarea {
            resize: vertical;
            min-height: 260px;
            font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.6;
        }
        .tou-form-group small {
            display: block;
            margin-top: 6px;
            color: #9CA3AF;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
        }
        .tou-form-group small a {
            color: #607AFB;
            text-decoration: none;
        }
        .tou-form-group small a:hover {
            text-decoration: underline;
        }

        /* 复选框样式 */
        .tou-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 12px;
            background: #F9FAFB;
            border-radius: 12px;
            transition: all 0.2s;
        }
        .tou-checkbox-group:hover {
            background: #F3F4F6;
        }
        .tou-checkbox-group input[type="checkbox"] {
            width: auto;
            margin-right: 10px;
            cursor: pointer;
        }
        .tou-checkbox-group label {
            margin: 0;
            font-weight: normal;
            color: #374151;
            cursor: pointer;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
        }

        /* 面板底部按钮 */
        #tou-settings-footer {
            padding: 16px 24px;
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
            border-radius: 0 0 24px 24px;
            display: flex;
            flex-direction: row-reverse;
            gap: 12px;
        }
        .tou-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
        }
        .tou-btn-primary {
            background: #607AFB;
            color: white;
        }
        .tou-btn-primary:hover {
            background: rgba(96, 122, 251, 0.9);
            transform: translateY(-1px);
        }
        .tou-btn-primary:active {
            transform: scale(0.98);
        }
        .tou-btn-secondary {
            background: #E5E7EB;
            color: #111827;
            font-weight: 700;
        }
        .tou-btn-secondary:hover {
            background: #D1D5DB;
        }

        /* 提示框样式 */
        .tou-warning {
            background: #EFF6FF;
            border: 1px solid #BFDBFE;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-size: 12px;
            color: #1E40AF;
            line-height: 1.6;
            display: flex;
            gap: 12px;
            align-items: flex-start;
            font-family: 'Inter', sans-serif;
        }
        .tou-warning .material-symbols-outlined {
            font-size: 16px;
            flex-shrink: 0;
            margin-top: 1px;
            color: #607AFB;
        }
    `;

    // === 事件总线模块（解耦业务逻辑和UI）====================
    const EventBus = {
        listeners: {},

        /**
         * 订阅事件
         * @param {string} event - 事件名称
         * @param {Function} callback - 回调函数
         */
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },

        /**
         * 发布事件
         * @param {string} event - 事件名称
         * @param {*} data - 事件数据
         */
        emit(event, data) {
            if (!this.listeners[event]) return;
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`[EventBus] 事件处理器错误 (${event}):`, err);
                }
            });
        }
    };

    // === 配置管理模块 ====================
    const Config = {
        // 加载配置
        load() {
            const config = {
                apiProvider: GM_getValue(STORAGE_KEYS.API_PROVIDER, DEFAULT_CONFIG.apiProvider),
                apiUrl: GM_getValue(STORAGE_KEYS.API_URL, DEFAULT_CONFIG.apiUrl),
                apiKey: GM_getValue(STORAGE_KEYS.API_KEY, DEFAULT_CONFIG.apiKey),
                model: GM_getValue(STORAGE_KEYS.API_MODEL, DEFAULT_CONFIG.model),
                promptTemplate: GM_getValue(STORAGE_KEYS.PROMPT_TEMPLATE, DEFAULT_CONFIG.promptTemplate),
                autoSubmit: GM_getValue(STORAGE_KEYS.AUTO_SUBMIT, DEFAULT_CONFIG.autoSubmit),
                autoRetry: GM_getValue(STORAGE_KEYS.AUTO_RETRY, DEFAULT_CONFIG.autoRetry),
                maxRetryCount: GM_getValue(STORAGE_KEYS.MAX_RETRY_COUNT, DEFAULT_CONFIG.maxRetryCount),
                enableImage: GM_getValue(STORAGE_KEYS.ENABLE_IMAGE, DEFAULT_CONFIG.enableImage)
            };
            return config;
        },

        // 保存配置
        save(config) {
            GM_setValue(STORAGE_KEYS.API_PROVIDER, config.apiProvider);
            GM_setValue(STORAGE_KEYS.API_URL, config.apiUrl);
            GM_setValue(STORAGE_KEYS.API_KEY, config.apiKey);
            GM_setValue(STORAGE_KEYS.API_MODEL, config.model);
            GM_setValue(STORAGE_KEYS.PROMPT_TEMPLATE, config.promptTemplate);
            GM_setValue(STORAGE_KEYS.AUTO_SUBMIT, config.autoSubmit);
            GM_setValue(STORAGE_KEYS.AUTO_RETRY, config.autoRetry);
            GM_setValue(STORAGE_KEYS.MAX_RETRY_COUNT, config.maxRetryCount);
            GM_setValue(STORAGE_KEYS.ENABLE_IMAGE, config.enableImage);
        },

        // 验证配置
        validate(config) {
            const errors = [];

            // 验证 API URL
            if (!config.apiUrl || !config.apiUrl.startsWith('http')) {
                errors.push('API URL 格式错误（必须以 http:// 或 https:// 开头）');
            }

            // 验证 API Key
            if (!config.apiKey || config.apiKey.trim().length === 0) {
                errors.push('API Key 不能为空');
            }

            // 验证模型
            if (!config.model || config.model.trim().length === 0) {
                errors.push('模型名称不能为空');
            }

            // Prompt 模板现在是可选的，不需要验证

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },

        // 重置为默认配置
        reset() {
            console.log('[配置] 重置为默认配置');
            this.save(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }
    };

    // 加载当前配置
    let currentConfig = Config.load();

    // === 样式注入 ====================
    // 强制启用文本选择功能（覆盖网站的禁用样式）
    GM_addStyle(`* { user-select: text !important; }`);

    // === API 适配器模块 ====================
    /**
     * API 适配器 - 支持多种 AI API 格式
     */
    const APIAdapter = {
        /**
         * 构建请求配置
         * @param {string} _provider - API 提供商 ID（预留参数，暂未使用）
         * @param {string} prompt - 完整的 prompt
         * @param {Object} config - 用户配置
         * @param {string[]} images - 图片 base64 数组（可选）
         * @returns {Object} - { url, headers, body }
         */
        buildRequest(_provider, prompt, config, images = []) {
            let messages;

            if (images.length > 0) {
                const content = [{ type: 'text', text: prompt }];
                images.forEach((imageBase64) => {
                    content.push({
                        type: 'image_url',
                        image_url: { url: imageBase64 } // 直接使用 base64 (data:image/xxx;base64,...)
                    });
                });
                messages = [{ role: 'user', content: content }];
            } else {
                messages = [{ role: 'user', content: prompt }];
            }

            return {
                url: config.apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: {
                    model: config.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 4096
                }
            };
        },

        /**
         * 解析 API 响应
         * @param {Object} responseData - 响应 JSON 数据
         * @returns {string} - 提取的答案文本
         */
        parseResponse(responseData) {
            try {
                if (!responseData || !responseData.choices || responseData.choices.length === 0) {
                    throw new Error('响应数据格式错误');
                }

                const firstChoice = responseData.choices[0];
                if (!firstChoice.message || !firstChoice.message.content) {
                    if (firstChoice.finish_reason === 'length') {
                        throw new Error('输出被截断（token 限制）');
                    }
                    throw new Error('响应缺少 content');
                }

                return firstChoice.message.content.trim();
            } catch (err) {
                console.error('[API适配器] 响应解析失败:', err.message);
                throw new Error('API 响应格式错误: ' + err.message);
            }
        }
    };

    // === 编辑器操作模块 ===
    /**
     * 编辑器助手 - 封装所有编辑器操作
     */
    const EditorHelper = {
        /**
         * 获取编辑器 textarea 元素
         * @returns {HTMLTextAreaElement|null}
         */
        getTextarea() {
            return document.querySelector(SELECTORS.EDITOR_TEXTAREA);
        },

        /**
         * 激活 Monaco 编辑器（点击容器 + 聚焦 textarea）
         * @returns {Promise<boolean>} - 成功返回 true
         */
        async activateEditor() {
            // 点击 Monaco 编辑器容器
            const monacoEditor = document.querySelector(SELECTORS.MONACO_EDITOR);
            if (monacoEditor) {
                monacoEditor.click();
                if (monacoEditor.focus) monacoEditor.focus();
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 点击并聚焦 textarea
            const textarea = this.getTextarea();
            if (textarea) {
                textarea.click();
                textarea.focus();
                await new Promise(resolve => setTimeout(resolve, 50));
                return true;
            }
            return false;
        },

        /**
         * 粘贴文本到编辑器
         * @param {string} text - 要粘贴的文本内容
         * @returns {Promise<boolean>} - 成功返回 true，失败返回 false
         */
        async paste(text) {
            await this.activateEditor();

            const textarea = this.getTextarea();
            if (!textarea) {
                console.error('[编辑器] 粘贴失败：未找到 textarea');
                return false;
            }

            try {
                textarea.focus();
                const start = textarea.selectionStart || 0;
                const end = textarea.selectionEnd || 0;

                textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;

                // 触发事件
                textarea.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: text
                }));
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                // 强制同步
                textarea.blur();
                setTimeout(() => textarea.focus(), 50);
                setTimeout(() => textarea.focus(), 150);

                console.log(`[编辑器] ✅ 已粘贴 ${text.length} 字符`);
                return true;
            } catch (err) {
                console.error('[编辑器] 粘贴失败:', err);
                return false;
            }
        },

        /**
         * 清空编辑器内容
         * @returns {Promise<boolean>} - 成功返回 true，失败返回 false
         */
        async clear() {
            await this.activateEditor();

            const textarea = this.getTextarea();
            if (!textarea) {
                console.error('[编辑器] 清空失败：未找到 textarea');
                return false;
            }

            try {
                textarea.focus();

                // 模拟 Ctrl+A / Command+A 全选
                textarea.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'a', code: 'KeyA', keyCode: 65, which: 65,
                    ctrlKey: true, bubbles: true, cancelable: true
                }));
                textarea.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'a', code: 'KeyA', keyCode: 65, which: 65,
                    metaKey: true, bubbles: true, cancelable: true
                }));

                // 模拟 Delete / Backspace 删除
                textarea.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Delete', code: 'Delete', keyCode: 46, which: 46,
                    bubbles: true, cancelable: true
                }));
                textarea.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8,
                    bubbles: true, cancelable: true
                }));

                console.log('[编辑器] ✅ 已清空');
                return true;
            } catch (err) {
                console.error('[编辑器] 清空失败:', err);
                return false;
            }
        },

        /**
         * 获取当前编辑器中的代码
         * @returns {string} - 当前代码
         */
        getCode() {
            const textarea = this.getTextarea();
            return textarea ? textarea.value : '';
        }
    };

    // === DOM 操作工具模块 ===
    /**
     * DOM 助手 - 封装常用的 DOM 查询操作
     */
    const DOMHelper = {
        /**
         * 尝试多个选择器，返回第一个匹配的元素
         * @param {string[]} selectors - 选择器数组（按优先级排序）
         * @returns {Element|null} - 找到的元素，如果都没找到则返回 null
         */
        trySelectors(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element;
                }
            }
            return null;
        },

        /**
         * 等待元素出现（轮询检测）
         * @param {string|string[]} selector - 单个选择器或选择器数组
         * @param {number} timeout - 超时时间（毫秒）
         * @param {number} interval - 检查间隔（毫秒）
         * @returns {Promise<Element|null>} - 找到的元素，超时返回 null
         */
        async waitForElement(selector, timeout = 5000, interval = 500) {
            const selectors = Array.isArray(selector) ? selector : [selector];
            const startTime = Date.now();
            let waitTime = 0;

            while (waitTime < timeout) {
                const element = this.trySelectors(selectors);
                if (element) {
                    return element;
                }

                await new Promise(resolve => setTimeout(resolve, interval));
                waitTime = Date.now() - startTime;
            }

            return null;
        }
    };

    // === 图片处理模块 ===
    /**
     * 图片助手 - 封装图片下载和转换操作
     */
    const ImageHelper = {
        /**
         * 下载图片并转换为 base64
         * @param {string} imageUrl - 图片 URL
         * @returns {Promise<string>} - base64 格式图片（data:image/xxx;base64,...）
         */
        async downloadAsBase64(imageUrl) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const blob = response.response;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                resolve(reader.result); // data:image/xxx;base64,...
                            };
                            reader.onerror = () => {
                                reject(new Error('FileReader 转换失败'));
                            };
                            reader.readAsDataURL(blob);
                        } catch (err) {
                            reject(err);
                        }
                    },
                    onerror: () => reject(new Error(`下载图片失败: ${imageUrl}`)),
                    ontimeout: () => reject(new Error(`下载图片超时: ${imageUrl}`))
                });
            });
        },

        /**
         * 从容器元素中提取并转换所有图片
         * @param {Element} container - 包含图片的容器元素
         * @returns {Promise<string[]>} - base64 图片数组
         */
        async extractAndConvert(container) {
            // 提取图片 URL
            const imgElements = Array.from(container.querySelectorAll('img'));
            const imageUrls = imgElements
                .map(img => img.src)
                .filter(src => src && src.startsWith('http'));

            console.log(`[图片处理] 找到 ${imageUrls.length} 张图片`);

            if (imageUrls.length === 0) {
                return [];
            }

            // 下载并转换为 base64
            console.log('[图片处理] 开始下载并转换图片...');
            const imageBase64Array = [];

            for (const url of imageUrls) {
                try {
                    const base64 = await this.downloadAsBase64(url);
                    imageBase64Array.push(base64);
                    console.log(`[图片处理] ✅ 图片转换成功 (${Math.round(base64.length / 1024)} KB)`);
                } catch (err) {
                    console.warn(`[图片处理] ⚠️ 图片转换失败: ${err.message}`);
                    // 继续处理其他图片，不中断
                }
            }

            return imageBase64Array;
        }
    };

    // === 题目识别模块 ===
    /**
     * 题目检测器 - 封装题目识别逻辑
     */
    const QuestionDetector = {
        /**
         * 检测题目（文本 + 图片）
         * @param {boolean} enableImage - 是否启用图片识别
         * @returns {Promise<{text: string, images: string[]}>} - 题目对象 {text: 题目文本, images: base64数组}
         */
        async detect(enableImage = true) {
            for (const selector of SELECTORS.QUESTION_CONTAINERS) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.innerText.trim();
                    if (text && text.length > 10) {
                        console.log(`[题目识别] 找到题目 (选择器: ${selector})`);

                        // 根据配置决定是否提取图片
                        let images = [];
                        if (enableImage) {
                            images = await ImageHelper.extractAndConvert(element);
                        } else {
                            console.log('[题目识别] 图片识别已禁用');
                        }

                        return { text: text, images: images };
                    }
                }
            }

            console.warn('[题目识别] 未找到有效题目');
            return null;
        }
    };

    // === Prompt 构建模块 ===
    /**
     * Prompt 构建器 - 封装 Prompt 生成逻辑
     */
    const PromptBuilder = {
        /**
         * 构建初始答题 Prompt
         * @param {string} questionText - 题目文本
         * @param {string} currentCode - 编辑器中的现有代码（可选）
         * @param {string} userTemplate - 用户自定义模板（可选）
         * @returns {string} - 完整 Prompt
         */
        buildInitialPrompt(questionText, currentCode = '', userTemplate = '') {
            let prompt = SYSTEM_BASE_PROMPT;

            if (userTemplate && userTemplate.trim().length > 0) {
                prompt += userTemplate + '\n\n';
            }

            prompt += '题目：\n' + questionText;

            // 添加现有代码提示
            if (currentCode && currentCode.trim().length > 0) {
                prompt += `\n\n【编辑器中的现有代码】：\n${currentCode}\n\n重要提示：
1. 编辑器中已经有上面这些代码了
2. 请仔细分析题目要求和现有代码的关系
3. 如果题目是要求在现有代码基础上**继续编写、补全、追加**，则只输出需要**新增的代码部分**，不要重复现有代码
4. 如果现有代码本身有错误需要修改，或者题目要求重构/重写，则输出完整的修改后代码
5. 如果不确定，优先只输出新增部分，避免重复`;
            }

            return prompt;
        },

        /**
         * 构建纠错 Prompt
         * @param {string} originalQuestion - 原始题目
         * @param {string} currentCode - 当前错误代码
         * @param {Object} testOutput - 测试输出对象 {expected, actual, testInfo}
         * @returns {string} - 纠错 Prompt
         */
        buildRetryPrompt(originalQuestion, currentCode, testOutput) {
            console.log('[Prompt构建] 构建纠错 Prompt...');

            let prompt = SYSTEM_RETRY_PROMPT;

            prompt += `
【原题目】：
${originalQuestion}

【你之前生成的代码】：
${currentCode}

【测试失败】：${testOutput.testInfo}

【预期输出】：
${testOutput.expected}

【实际输出】：
${testOutput.actual}

直接输出修正后的完整代码：`;

            console.log('[Prompt构建] ✅ Prompt 构建完成');
            console.log('[Prompt构建] Prompt 总长度:', prompt.length, '字符');

            return prompt;
        }
    };

    // === AI 服务模块 ===
    /**
     * AI 服务 - 封装 AI API 调用逻辑
     */
    const AIService = {
        /**
         * 调用 AI 生成答案
         * @param {string} prompt - 完整的 prompt
         * @param {Object} config - 用户配置
         * @param {string[]} images - 图片 base64 数组（可选）
         * @returns {Promise<string>} - AI 生成的答案（已清理格式）
         */
        async generateAnswer(prompt, config, images = []) {
            return new Promise((resolve, reject) => {
                try {
                    const request = APIAdapter.buildRequest(config.apiProvider, prompt, config, images);

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: request.url,
                        headers: request.headers,
                        data: JSON.stringify(request.body),
                        timeout: 60000,
                        onload: (response) => {
                            if (response.status === 200) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    const answer = APIAdapter.parseResponse(data);

                                    // 清理 markdown 代码块标记
                                    let cleanAnswer = answer;
                                    if (cleanAnswer.startsWith('```')) {
                                        cleanAnswer = cleanAnswer.replace(/```[\w]*\n/g, '').replace(/```$/g, '').trim();
                                    }

                                    console.log(`[AI服务] 成功获取答案 (${cleanAnswer.length} 字符)`);
                                    resolve(cleanAnswer);
                                } catch (parseErr) {
                                    reject(new Error('API 响应格式错误'));
                                }
                            } else {
                                console.error('[AI服务] API 错误:', response.status, response.statusText);
                                reject(new Error(`API 错误: ${response.status} - ${response.statusText}`));
                            }
                        },
                        onerror: () => reject(new Error('网络请求失败')),
                        ontimeout: () => reject(new Error('API 请求超时（60秒）'))
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }
    };

    // === 提交按钮操作模块 ===
    /**
     * 提交操作 - 封装自动提交逻辑
     */
    const SubmitHelper = {
        /**
         * 自动点击提交按钮
         * @returns {boolean} - 成功返回 true，失败返回 false
         */
        autoSubmit() {
            const btn = DOMHelper.trySelectors(SELECTORS.SUBMIT_BUTTONS);

            if (btn && !btn.disabled) {
                const delay = 1000 + Math.random() * 2000;
                setTimeout(() => {
                    btn.click();
                    console.log('[提交操作] 已点击提交按钮');
                }, delay);
                return true;
            }

            console.warn('[提交操作] 未找到可用的提交按钮');
            return false;
        }
    };

    // === 测试监控模块 ====================
    /**
     * 测试监控器 - 封装测试结果监控和提取逻辑
     */
    const TestMonitor = {
        /**
         * 提取测试结果的预期输出和实际输出
         * @returns {{expected: string, actual: string, testInfo: string}|null} - 提取成功返回对象，失败返回 null
         */
        extractOutputs() {
            try {
                // 通过文本内容"预期输出"查找
                const allElements = Array.from(document.querySelectorAll('*'));
                const candidates = allElements.filter(el => {
                    const text = el.innerText || '';
                    return text.includes('预期输出') && text.includes('实际输出');
                });

                if (candidates.length === 0) {
                    console.warn('[测试监控] 未找到包含"预期输出"的元素');
                    return null;
                }

                // 找到最小的包含元素
                const container = candidates.reduce((smallest, current) => {
                    return current.innerText.length < smallest.innerText.length ? current : smallest;
                });

                // 提取完整文本
                const fullText = container.innerText;
                const expectedMarker = '—— 预期输出 ——';
                const actualMarker = '—— 实际输出 ——';

                const expectedIdx = fullText.indexOf(expectedMarker);
                const actualIdx = fullText.indexOf(actualMarker);

                if (expectedIdx === -1 || actualIdx === -1) {
                    console.warn('[测试监控] 未找到标记文字');
                    return null;
                }

                // 提取预期输出和实际输出
                const expectedRaw = fullText.substring(expectedIdx + expectedMarker.length, actualIdx).trim();
                const actualRaw = fullText.substring(actualIdx + actualMarker.length).trim();

                // 清理额外文字
                const cleanLine = (text) => {
                    return text.split('\n').filter(line => {
                        const l = line.trim();
                        return l &&
                               !l.includes('展示原始输出') &&
                               !l.includes('current') &&
                               !l.startsWith('——');
                    }).join('\n').trim();
                };

                const expected = cleanLine(expectedRaw);
                const actual = cleanLine(actualRaw);

                console.log(`[测试监控] ✅ 提取成功（预期${expected.length}字符，实际${actual.length}字符）`);

                return {
                    expected: expected,
                    actual: actual,
                    testInfo: '测试集1'
                };

            } catch (err) {
                console.error('[测试监控] 提取失败:', err);
                return null;
            }
        },

        /**
         * 等待测试结果并检测是否失败
         * @param {number} timeout - 超时时间（毫秒）
         * @returns {Promise<'success'|'failure'|'timeout'>} - 测试结果
         */
        waitForResult(timeout = 15000) {
            return new Promise((resolve) => {
                const startTime = Date.now();
                let resolved = false;

                const observer = new MutationObserver(() => {
                    if (resolved) return;

                    // 检测成功标记
                    const successIndicator = document.querySelector(SELECTORS.TEST_RESULT_SUCCESS);
                    if (successIndicator && successIndicator.innerText.includes('/')) {
                        const match = successIndicator.innerText.match(/(\d+)\/(\d+)/);
                        if (match && match[1] === match[2] && match[1] !== '0') {
                            resolved = true;
                            observer.disconnect();
                            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                            console.log(`[测试监控] ✅ 成功（耗时 ${elapsed}s）`);
                            resolve('success');
                            return;
                        }
                    }

                    // 检测失败标记
                    const failIndicator = document.querySelector(SELECTORS.TEST_RESULT_FAILURE);
                    if (failIndicator) {
                        resolved = true;
                        observer.disconnect();
                        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                        console.log(`[测试监控] ❌ 失败（耗时 ${elapsed}s）`);
                        resolve('failure');
                        return;
                    }

                    // 检查超时
                    if (Date.now() - startTime > timeout) {
                        resolved = true;
                        observer.disconnect();
                        console.warn('[测试监控] ⏱️ 超时');
                        resolve('timeout');
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });

                // 额外的超时保护
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        observer.disconnect();
                        console.warn('[测试监控] ⏱️ 强制超时');
                        resolve('timeout');
                    }
                }, timeout);
            });
        }
    };

    // === 答题引擎模块 ====================
    /**
     * 答题引擎 - 封装智能答题和自动纠错的核心业务逻辑
     */
    const AnswerEngine = {
        /**
         * 自动纠错主函数
         * @param {string} originalQuestion - 原始题目文本
         * @param {string[]} images - 题目图片 base64 数组
         * @param {Object} config - 用户配置
         * @param {number} retryCount - 当前重试次数
         * @returns {Promise<boolean>} - 纠错成功返回 true
         */
        async autoRetry(originalQuestion, images, config, retryCount = 0) {
            console.log(`%c[答题引擎] ========== 尝试纠错 (第 ${retryCount + 1} 次) ==========`, 'color: #667eea; font-weight: bold; font-size: 14px;');

            if (retryCount >= config.maxRetryCount) {
                console.warn(`%c[答题引擎] ⚠️ 已达到最大重试次数 (${config.maxRetryCount})`, 'color: #f5a623; font-weight: bold;');
                return false;
            }

            try {
                // 步骤 1: 智能等待测试结果加载（最多8秒）
                console.log('[答题引擎] 步骤 1/7: 智能等待测试结果加载（最多8秒）...');

                // 1.1 等待测试用例元素出现（使用 DOMHelper）
                const testCaseElement = await DOMHelper.waitForElement(
                    [SELECTORS.TEST_CASE_ITEM, 'li'],  // 优先使用 class，备用文本查找
                    8000,  // 最多等待 8 秒
                    500    // 每 500ms 检查一次
                );

                if (!testCaseElement) {
                    throw new Error('等待测试用例元素超时（8秒）');
                }

                console.log('[答题引擎] 步骤 1/7: ✅ 测试用例元素已加载');

                // 1.2 点击测试用例 header 来展开详情
                console.log('[答题引擎] 尝试展开测试用例详情...');
                const header = testCaseElement.querySelector(SELECTORS.TEST_CASE_HEADER);
                if (header) {
                    header.click();
                    console.log('[答题引擎] ✅ 已点击 header，等待详情展开...');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待展开动画完成
                } else {
                    console.log('[答题引擎] ⚠️ 未找到可点击的 header');
                }

                // 1.3 再次等待"预期输出"文字出现
                let foundOutputs = false;
                let waitTime = 0;
                const maxWaitTime = 8000;
                const checkInterval = 500;

                while (!foundOutputs && waitTime < maxWaitTime) {
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                    waitTime += checkInterval;

                    // 检查页面中是否出现"预期输出"文字
                    const pageText = document.body.innerText || '';
                    foundOutputs = pageText.includes('预期输出') && pageText.includes('实际输出');

                    if (waitTime % 1000 === 0) {
                        console.log(`[答题引擎] 已等待 ${waitTime / 1000} 秒，${foundOutputs ? '✅ 找到输出对比' : '继续等待...'}`);
                    }
                }

                if (!foundOutputs) {
                    console.error('[答题引擎] ⏱️ 等待超时，页面中未出现"预期输出"文字');
                    throw new Error('等待测试结果超时（8秒）');
                }

                console.log(`[答题引擎] 步骤 1/7: ✅ 测试输出已加载（耗时 ${waitTime / 1000} 秒）`);

                // 步骤 2: 提取测试输出
                console.log('[答题引擎] 步骤 2/7: 提取测试输出...');
                const testOutput = TestMonitor.extractOutputs();
                if (!testOutput) {
                    throw new Error('无法提取测试输出数据');
                }
                console.log('[答题引擎] 步骤 2/7: ✅ 测试输出提取成功');

                // 步骤 3: 获取当前错误代码
                console.log('[答题引擎] 步骤 3/7: 获取当前错误代码...');
                const currentCode = EditorHelper.getCode();
                if (!currentCode) {
                    throw new Error('无法获取当前代码');
                }
                console.log('[答题引擎] 步骤 3/7: ✅ 当前代码获取成功');

                // 步骤 4: 构建纠错 Prompt
                console.log('[答题引擎] 步骤 4/7: 构建纠错 Prompt...');
                const retryPrompt = PromptBuilder.buildRetryPrompt(originalQuestion, currentCode, testOutput);
                console.log('[答题引擎] 步骤 4/7: ✅ Prompt 构建成功');

                // 步骤 5: 调用 AI 生成修正代码
                console.log('[答题引擎] 步骤 5/7: 调用 AI 生成修正代码...');
                console.log('[答题引擎] 使用提供商:', config.apiProvider);
                console.log('[答题引擎] 使用模型:', config.model);
                console.log('[答题引擎] 图片数量:', images.length);
                const fixedCode = await AIService.generateAnswer(retryPrompt, config, images);
                if (!fixedCode) {
                    throw new Error('AI 返回空答案');
                }
                console.log('[答题引擎] 步骤 5/7: ✅ AI 返回修正代码');
                console.log('[答题引擎] 修正代码长度:', fixedCode.length, '字符');

                // 步骤 6: 清空编辑器并粘贴修正后的代码
                console.log('[答题引擎] 步骤 6/7: 清空编辑器...');
                const clearSuccess = await EditorHelper.clear();
                if (!clearSuccess) {
                    throw new Error('清空编辑器失败');
                }

                // 等待清空完成
                console.log('[答题引擎] 等待清空同步完成（500ms）...');
                await new Promise(resolve => setTimeout(resolve, 500));

                // 粘贴新代码
                console.log('[答题引擎] 开始粘贴修正代码...');
                const success = await EditorHelper.paste(fixedCode);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!success) {
                    throw new Error('粘贴修正代码失败');
                }
                console.log('[答题引擎] 步骤 6/7: ✅ 修正代码已粘贴');

                // 步骤 7: 自动提交
                if (config.autoSubmit) {
                    console.log('[答题引擎] 步骤 7/7: 自动提交修正后的代码...');
                    const submitted = SubmitHelper.autoSubmit();
                    if (!submitted) {
                        console.warn('%c[答题引擎] ⚠️ 未找到提交按钮，请手动提交', 'color: #f5a623; font-weight: bold;');
                        return false;
                    }
                    console.log('[答题引擎] 步骤 7/7: ✅ 已提交修正代码');

                    // 步骤 8: 监控测试结果
                    console.log('[答题引擎] 监控测试结果...');
                    const result = await TestMonitor.waitForResult();

                    if (result === 'success') {
                        console.log('%c[答题引擎] ========== ✅ 纠错成功！ ==========', 'color: #38ef7d; font-weight: bold; font-size: 14px;');
                        return true;
                    } else if (result === 'failure') {
                        console.log(`%c[答题引擎] ========== ❌ 第 ${retryCount + 1} 次纠错失败 ==========`, 'color: #f45c43; font-weight: bold; font-size: 14px;');
                        // 递归重试
                        console.log(`[答题引擎] 准备第 ${retryCount + 2} 次重试...`);
                        return await this.autoRetry(originalQuestion, images, config, retryCount + 1);
                    } else {
                        console.warn('%c[答题引擎] ⚠️ 测试结果超时，无法判断', 'color: #f5a623; font-weight: bold;');
                        return false;
                    }
                } else {
                    console.log('[答题引擎] 自动提交已禁用，请手动提交并检查结果');
                    return false;
                }

            } catch (err) {
                console.error(`%c[答题引擎] ========== ❌ 第 ${retryCount + 1} 次尝试失败 ==========`, 'color: #f45c43; font-weight: bold; font-size: 14px;');
                console.error('[答题引擎] 错误信息:', err.message);
                console.error('[答题引擎] 错误堆栈:', err.stack);
                return false;
            }
        },

        /**
         * 智能答题主流程
         * @param {Object} config - 用户配置
         * @returns {Promise<boolean>} - 成功返回 true
         */
        async smartAnswer(config) {
            console.log('[答题引擎] ========== 开始智能答题 ==========');

            try {
                // 步骤 1: 识别题目
                EventBus.emit('answer:step', { step: 1, status: 'active', message: '正在分析题目内容和图片...' });
                const question = await QuestionDetector.detect(config.enableImage);
                if (!question) {
                    EventBus.emit('answer:step', { step: 1, status: 'error', message: '未检测到题目内容' });
                    throw new Error('未检测到题目内容');
                }
                EventBus.emit('answer:step', { step: 1, status: 'completed', message: `已识别题目（${question.text.length}字${question.images.length > 0 ? `, ${question.images.length}张图片` : ''}）` });

                // 步骤 2: 获取现有代码
                const currentCode = EditorHelper.getCode();
                if (currentCode && currentCode.trim().length > 0) {
                    console.log(`[答题引擎] 检测到现有代码（${currentCode.length}字符），将基于此改进或补全`);
                }

                // 步骤 3: 调用 AI 生成答案
                EventBus.emit('answer:step', { step: 2, status: 'active', message: 'AI正在分析题目并生成答案...' });
                const prompt = PromptBuilder.buildInitialPrompt(question.text, currentCode, config.promptTemplate);
                const answer = await AIService.generateAnswer(prompt, config, question.images);
                if (!answer) {
                    EventBus.emit('answer:step', { step: 2, status: 'error', message: 'AI 返回空答案' });
                    throw new Error('AI 返回空答案');
                }
                EventBus.emit('answer:step', { step: 2, status: 'completed', message: `已生成答案（${answer.length}字符）` });

                // 步骤 4: 粘贴答案
                EventBus.emit('answer:step', { step: 3, status: 'active', message: '正在填入编辑器...' });
                const success = await EditorHelper.paste(answer);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!success) {
                    EventBus.emit('answer:step', { step: 3, status: 'error', message: '粘贴失败' });
                    throw new Error('粘贴失败');
                }
                EventBus.emit('answer:step', { step: 3, status: 'completed', message: '答案已填入编辑器' });

                // 步骤 5: 自动提交（可选）
                if (config.autoSubmit) {
                    EventBus.emit('answer:step', { step: 4, status: 'active', message: '正在提交代码...' });
                    const submitted = SubmitHelper.autoSubmit();
                    if (!submitted) {
                        EventBus.emit('answer:step', { step: 4, status: 'error', message: '未找到提交按钮，请手动提交' });
                        EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过（需手动提交）' });
                        EventBus.emit('answer:complete', { success: true });
                        return true;
                    }
                    EventBus.emit('answer:step', { step: 4, status: 'completed', message: '已自动提交代码' });

                    // 步骤 6: 自动纠错（可选）
                    if (config.autoRetry) {
                        EventBus.emit('answer:step', { step: 5, status: 'active', message: '正在监控测试结果...' });
                        const result = await TestMonitor.waitForResult();

                        if (result === 'success') {
                            EventBus.emit('answer:step', { step: 5, status: 'completed', message: '✅ 一次通过！' });
                            EventBus.emit('answer:complete', { success: true });
                            console.log('[答题引擎] ========== ✅ 一次通过！ ==========');
                            return true;
                        } else if (result === 'failure') {
                            EventBus.emit('answer:step', { step: 5, status: 'active', message: '检测到失败，正在自动纠错...' });
                            const retrySuccess = await this.autoRetry(question.text, question.images, config, 0);
                            if (retrySuccess) {
                                EventBus.emit('answer:step', { step: 5, status: 'completed', message: '✅ 纠错成功！' });
                                EventBus.emit('answer:complete', { success: true });
                                console.log('[答题引擎] ========== ✅ 纠错成功！ ==========');
                            } else {
                                EventBus.emit('answer:step', { step: 5, status: 'error', message: '⚠️ 纠错失败' });
                                EventBus.emit('answer:complete', { success: false });
                                console.warn('[答题引擎] ========== ⚠️ 纠错失败 ==========');
                            }
                            return retrySuccess;
                        } else {
                            EventBus.emit('answer:step', { step: 5, status: 'error', message: '⏱️ 测试结果超时' });
                            EventBus.emit('answer:complete', { success: false });
                        }
                    } else {
                        EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过（未启用自动纠错）' });
                        EventBus.emit('answer:complete', { success: true });
                    }
                } else {
                    EventBus.emit('answer:step', { step: 4, status: 'completed', message: '已跳过（未启用自动提交）' });
                    EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过（未启用自动纠错）' });
                    EventBus.emit('answer:complete', { success: true });
                }

                console.log('[答题引擎] ========== 完成 ✅ ==========');
                return true;

            } catch (err) {
                console.error('[答题引擎] ========== 失败 ❌ ==========');
                console.error('[答题引擎] 错误详情:', err.message);
                EventBus.emit('answer:error', { error: err.message });
                throw err;
            }
        }
    };

    // === 创建按钮组（现代化设计） ====================
    function createButton() {
        // 注入 UI 样式
        GM_addStyle(UI_STYLES);

        // 订阅 EventBus 事件（业务逻辑和 UI 解耦）
        EventBus.on('answer:step', (data) => {
            updateProgress(data.step, data.status, data.message);
        });

        EventBus.on('answer:complete', (data) => {
            if (data.success) {
                console.log('[EventBus] ✅ 智能答题完成');
            } else {
                console.warn('[EventBus] ⚠️ 智能答题完成（有失败）');
            }
        });

        EventBus.on('answer:error', (data) => {
            console.error('[EventBus] ❌ 智能答题错误:', data.error);
        });

        // 创建按钮组容器
        const buttonGroup = document.createElement('div');
        buttonGroup.id = 'tou-button-group';

        // 创建智能答题按钮（主按钮）
        const smartAnswerBtn = document.createElement('button');
        smartAnswerBtn.id = 'smart-answer-btn';
        smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span><span>智能答题</span>';

        // 智能答题按钮点击事件
        smartAnswerBtn.addEventListener('click', async () => {
            if (smartAnswerBtn.disabled) return;

            smartAnswerBtn.disabled = true;

            try {
                // 打开进度弹窗
                openProgressModal();

                // 显示识别状态
                smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">search</span><span>识别中...</span>';
                smartAnswerBtn.className = 'working';

                await new Promise(resolve => setTimeout(resolve, 300));

                // 显示 AI 思考状态
                smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">psychology</span><span>思考中...</span>';

                // 执行智能答题（不再传递 progressCallback）
                await AnswerEngine.smartAnswer(currentConfig);

                // 显示成功状态
                smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span><span>完成!</span>';
                smartAnswerBtn.className = 'success';

                // 3秒后自动关闭进度弹窗
                setTimeout(() => {
                    closeProgressModal();
                }, 3000);

            } catch (err) {
                console.error('[错误]', err.message);
                smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">error</span><span>失败</span>';
                smartAnswerBtn.className = 'error';

                // 错误时也关闭进度弹窗
                setTimeout(() => {
                    closeProgressModal();
                }, 2000);

            } finally {
                // 2秒后恢复
                setTimeout(() => {
                    smartAnswerBtn.disabled = false;
                    smartAnswerBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span><span>智能答题</span>';
                    smartAnswerBtn.className = '';
                }, 2000);
            }
        });

        // 创建手动粘贴按钮（图标按钮）
        const pasteBtn = document.createElement('button');
        pasteBtn.id = 'tou-manual-paste-btn';
        pasteBtn.className = 'tou-icon-btn';
        pasteBtn.innerHTML = '<span class="material-symbols-outlined">content_paste</span>';
        pasteBtn.title = '手动粘贴代码';
        pasteBtn.addEventListener('click', () => {
            console.log('%c[点击] 打开手动粘贴弹窗', 'color: #667eea; font-weight: bold;');
            openManualPasteModal();
        });

        // 创建设置按钮（图标按钮）
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'tou-settings-btn';
        settingsBtn.className = 'tou-icon-btn';
        settingsBtn.innerHTML = '<span class="material-symbols-outlined">settings</span>';
        settingsBtn.title = '设置';
        settingsBtn.addEventListener('click', () => {
            console.log('%c[点击] 打开设置面板', 'color: #667eea; font-weight: bold;');
            toggleSettingsPanel();
        });

        // 按钮添加到容器
        buttonGroup.appendChild(smartAnswerBtn);
        buttonGroup.appendChild(pasteBtn);
        buttonGroup.appendChild(settingsBtn);

        // 将按钮组插入到 div.grade-info 元素之后（48441 数字后面）
        const gradeInfo = document.querySelector('div.grade-info');
        if (gradeInfo) {
            // 插入到 grade-info 元素的后面
            gradeInfo.insertAdjacentElement('afterend', buttonGroup);
            console.log('%c[按钮组] 已创建（在 48441 数字后面）', 'color: #38ef7d; font-weight: bold;');
        } else {
            // 如果找不到 grade-info，回退到添加到 body（兼容其他页面）
            document.body.appendChild(buttonGroup);
            console.log('%c[按钮组] 已创建（未找到 div.grade-info，添加到 body）', 'color: #f5a623; font-weight: bold;');
        }

        // 创建设置面板
        createSettingsPanel();

        // 创建手动粘贴弹窗
        createManualPasteModal();

        // 创建进度弹窗
        createProgressModal();
    }

    // === 创建设置面板（现代化设计） ====================
    function createSettingsPanel() {
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'tou-settings-panel';
        panel.innerHTML = `
            <div class="tou-settings-wrapper">
                <div id="tou-settings-header">
                    <h2>设置</h2>
                    <button id="tou-settings-close" title="关闭"><span class="material-symbols-outlined">close</span></button>
                </div>

                <div id="tou-settings-body">
                    <!-- AI 设置（可折叠） -->
                    <div class="tou-collapsible-section">
                        <div class="tou-collapsible-header" id="tou-ai-settings-toggle">
                            <h3>AI 设置</h3>
                            <span class="material-symbols-outlined tou-collapsible-toggle">expand_more</span>
                        </div>
                        <div class="tou-collapsible-content" id="tou-ai-settings-content">
                            <div class="tou-collapsible-body">
                                <div class="tou-form-row">
                                    <div class="tou-form-group">
                                        <label for="tou-api-provider">API 提供商</label>
                                        <select id="tou-api-provider">
                                            <option value="openai">OpenAI</option>
                                            <option value="deepseek">DeepSeek</option>
                                            <option value="custom">自定义</option>
                                        </select>
                                    </div>

                                    <div class="tou-form-group">
                                        <label for="tou-model">模型</label>
                                        <select id="tou-model">
                                            <option value="gpt-5-mini">GPT-5 mini（推荐，性价比高）</option>
                                            <option value="gpt-5">GPT-5（标准版）</option>
                                            <option value="gpt-5-nano">GPT-5 nano（超轻量）</option>
                                            <option value="gpt-4o">GPT-4o（已弃用，仍可用）</option>
                                            <option value="custom">自定义模型</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="tou-form-group" id="tou-custom-model-group" style="display: none;">
                                    <label for="tou-custom-model">自定义模型名称</label>
                                    <input type="text" id="tou-custom-model" placeholder="" />
                                </div>

                                <div class="tou-form-group">
                                    <label for="tou-api-url">API 地址</label>
                                    <input type="text" id="tou-api-url" placeholder="" />
                                </div>

                                <div class="tou-form-group">
                                    <label for="tou-api-key">API 密钥</label>
                                    <input type="password" id="tou-api-key" placeholder="" />
                                </div>

                                <div class="tou-checkbox-group">
                                    <input type="checkbox" id="tou-enable-image" />
                                    <label for="tou-enable-image">启用图片识别</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 提示词 -->
                    <div class="tou-form-group">
                        <label for="tou-prompt">提示词</label>
                        <textarea id="tou-prompt" placeholder=""></textarea>
                    </div>
                </div>

                <div id="tou-settings-footer">
                    <button class="tou-btn tou-btn-primary" id="tou-save-btn">保存</button>
                    <button class="tou-btn tou-btn-secondary" id="tou-reset-btn">重置</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        console.log('[设置面板] HTML 已创建');

        // 加载当前配置到面板
        loadConfigToPanel();

        // 绑定面板事件
        bindPanelEvents();
    }

    // === 加载配置到面板 ====================
    function loadConfigToPanel() {
        // 加载 API 提供商
        document.getElementById('tou-api-provider').value = currentConfig.apiProvider || 'openai';

        document.getElementById('tou-api-url').value = currentConfig.apiUrl;
        document.getElementById('tou-api-key').value = currentConfig.apiKey;

        // 处理模型选择（根据提供商动态生成）
        const provider = currentConfig.apiProvider || 'openai';
        updateModelOptions(provider, currentConfig.model);

        document.getElementById('tou-prompt').value = currentConfig.promptTemplate;

        // 加载图片识别复选框状态
        document.getElementById('tou-enable-image').checked = currentConfig.enableImage || false;

        console.log('[设置面板] 配置已加载');
    }

    // === 更新模型选项 ====================
    function updateModelOptions(providerId, currentModel) {
        const modelSelect = document.getElementById('tou-model');
        const customModelInput = document.getElementById('tou-custom-model');
        const customModelGroup = document.getElementById('tou-custom-model-group');

        // 根据 providerId 找到对应的提供商配置
        const providerConfig = Object.values(API_PROVIDERS).find(p => p.id === providerId);
        if (!providerConfig) {
            console.error('[设置面板] 未找到提供商配置:', providerId);
            return;
        }

        // 清空现有选项
        modelSelect.innerHTML = '';

        // 添加预设模型选项
        if (providerConfig.models && providerConfig.models.length > 0) {
            providerConfig.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }

        // 始终添加自定义模型选项
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = '自定义模型';
        modelSelect.appendChild(customOption);

        // 设置当前模型
        if (providerConfig.models && providerConfig.models.includes(currentModel)) {
            modelSelect.value = currentModel;
            customModelGroup.style.display = 'none';
        } else {
            // 自定义模型
            modelSelect.value = 'custom';
            customModelInput.value = currentModel || '';
            customModelGroup.style.display = 'block';
        }

        console.log(`[设置面板] 已更新模型列表 (提供商: ${providerId}, 当前模型: ${currentModel})`);
    }

    // === 从面板读取配置 ====================
    function getConfigFromPanel() {
        const modelSelect = document.getElementById('tou-model').value;
        const customModel = document.getElementById('tou-custom-model').value.trim();

        return {
            apiProvider: document.getElementById('tou-api-provider').value,
            apiUrl: document.getElementById('tou-api-url').value.trim(),
            apiKey: document.getElementById('tou-api-key').value.trim(),
            model: modelSelect === 'custom' ? customModel : modelSelect,
            promptTemplate: document.getElementById('tou-prompt').value,
            autoSubmit: true,       // 固定为 true（隐藏）
            autoRetry: true,        // 固定为 true（隐藏）
            maxRetryCount: 1,       // 固定为 1（隐藏）
            enableImage: document.getElementById('tou-enable-image').checked  // 读取复选框状态
        };
    }

    // === 绑定面板事件 ====================
    function bindPanelEvents() {
        const panel = document.getElementById('tou-settings-panel');
        const closeBtn = document.getElementById('tou-settings-close');
        const saveBtn = document.getElementById('tou-save-btn');
        const resetBtn = document.getElementById('tou-reset-btn');
        const providerSelect = document.getElementById('tou-api-provider');
        const modelSelect = document.getElementById('tou-model');
        const customModelGroup = document.getElementById('tou-custom-model-group');

        // AI 设置折叠展开事件
        const aiSettingsToggle = document.getElementById('tou-ai-settings-toggle');
        const aiSettingsContent = document.getElementById('tou-ai-settings-content');
        const toggleIcon = aiSettingsToggle.querySelector('.tou-collapsible-toggle');

        aiSettingsToggle.addEventListener('click', () => {
            const isExpanded = aiSettingsContent.classList.contains('expanded');
            if (isExpanded) {
                aiSettingsContent.classList.remove('expanded');
                toggleIcon.classList.remove('expanded');
                console.log('[设置面板] 折叠 AI 设置');
            } else {
                aiSettingsContent.classList.add('expanded');
                toggleIcon.classList.add('expanded');
                console.log('[设置面板] 展开 AI 设置');
            }
        });

        // API 提供商选择变化事件 - 自动更新 URL 和模型列表
        providerSelect.addEventListener('change', () => {
            const providerId = providerSelect.value;
            console.log(`[设置面板] 切换提供商: ${providerId}`);

            // 根据提供商 ID 找到配置
            const providerConfig = Object.values(API_PROVIDERS).find(p => p.id === providerId);
            if (providerConfig) {
                // 自动填充 API URL
                document.getElementById('tou-api-url').value = providerConfig.defaultUrl;

                // 更新模型列表，使用默认模型
                updateModelOptions(providerId, providerConfig.defaultModel);

                console.log(`[设置面板] 已切换到 ${providerConfig.name}`);
            }
        });

        // 模型选择变化事件 - 显示/隐藏自定义模型输入框
        modelSelect.addEventListener('change', () => {
            if (modelSelect.value === 'custom') {
                customModelGroup.style.display = 'block';
                console.log('[设置面板] 切换到自定义模型');
            } else {
                customModelGroup.style.display = 'none';
                console.log('[设置面板] 选择预设模型:', modelSelect.value);
            }
        });

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
            console.log('[设置面板] 已关闭');
        });

        // 保存按钮
        saveBtn.addEventListener('click', () => {
            const newConfig = getConfigFromPanel();

            // 额外验证：如果选择了自定义模型，确保输入了模型名称
            const modelSelect = document.getElementById('tou-model').value;
            if (modelSelect === 'custom' && (!newConfig.model || newConfig.model.trim().length === 0)) {
                console.error('[设置面板] 配置验证失败：自定义模型名称不能为空');
                return;
            }

            // 验证配置
            const validation = Config.validate(newConfig);
            if (!validation.isValid) {
                console.error('[设置面板] 配置验证失败:', validation.errors.join(', '));
                return;
            }

            // 保存配置
            Config.save(newConfig);
            currentConfig = newConfig;

            console.log('[设置面板] 配置已保存', newConfig);
            panel.classList.remove('show');
        });

        // 重置按钮
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置为默认配置吗？\n\n这将清除所有自定义设置（包括 API Key）')) {
                currentConfig = Config.reset();
                loadConfigToPanel();
                console.log('[设置面板] 已重置为默认配置');
            }
        });

        // 点击面板外部关闭（可选）
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tou-settings-panel') {
                panel.classList.remove('show');
                console.log('[设置面板] 点击外部关闭');
            }
        });

        console.log('[设置面板] 事件已绑定');
    }

    // === 打开/关闭设置面板 ====================
    function toggleSettingsPanel() {
        const panel = document.getElementById('tou-settings-panel');
        const pasteModal = document.getElementById('tou-manual-paste-modal');

        if (panel.classList.contains('show')) {
            panel.classList.remove('show');
            console.log('[设置面板] 已关闭');
        } else {
            // 关闭手动粘贴弹窗
            if (pasteModal && pasteModal.classList.contains('show')) {
                pasteModal.classList.remove('show');
                console.log('[手动粘贴弹窗] 自动关闭（设置面板打开）');
            }

            panel.classList.add('show');
            // 重新加载配置（防止被其他操作修改）
            loadConfigToPanel();
            console.log('[设置面板] 已打开');
        }
    }

    // === 创建手动粘贴弹窗（现代化设计） ====================
    function createManualPasteModal() {
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.id = 'tou-manual-paste-modal';
        modal.innerHTML = `
            <div class="tou-modal-content">
                <div class="tou-modal-header">
                    <h2>手动粘贴</h2>
                    <button class="tou-modal-close" id="tou-modal-close-btn" title="关闭"><span class="material-symbols-outlined">close</span></button>
                </div>

                <div class="tou-modal-body">
                    <textarea id="tou-answer-preview" placeholder="在此输入或粘贴代码..."></textarea>
                </div>

                <div class="tou-modal-footer">
                    <button class="tou-btn-cancel" id="tou-modal-cancel-btn">取消</button>
                    <button class="tou-btn-paste" id="tou-modal-paste-btn">继续</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('[手动粘贴弹窗] HTML 已创建');

        // 绑定事件
        bindManualPasteModalEvents();
    }

    // === 绑定手动粘贴弹窗事件 ====================
    function bindManualPasteModalEvents() {
        const modal = document.getElementById('tou-manual-paste-modal');
        const closeBtn = document.getElementById('tou-modal-close-btn');
        const cancelBtn = document.getElementById('tou-modal-cancel-btn');
        const pasteBtn = document.getElementById('tou-modal-paste-btn');

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            console.log('[手动粘贴弹窗] 已关闭');
        });

        // 取消按钮
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            console.log('[手动粘贴弹窗] 已取消');
        });

        // 粘贴按钮
        pasteBtn.addEventListener('click', async () => {
            const answerPreview = document.getElementById('tou-answer-preview');
            const answerText = answerPreview.value;

            if (!answerText || answerText.trim().length === 0) {
                console.warn('[手动粘贴弹窗] 答案内容为空，无法粘贴');
                return;
            }

            console.log(`[手动粘贴弹窗] 开始粘贴答案（长度: ${answerText.length} 字符）`);

            const success = await EditorHelper.paste(answerText);

            if (success) {
                console.log('%c[手动粘贴弹窗] ✅ 粘贴成功', 'color: #38ef7d; font-weight: bold;');
                // 延迟关闭弹窗，让用户看到粘贴效果
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 300);
            } else {
                console.error('%c[手动粘贴弹窗] ❌ 粘贴失败', 'color: #f45c43; font-weight: bold;');
            }
        });

        // 点击弹窗外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'tou-manual-paste-modal') {
                modal.classList.remove('show');
                console.log('[手动粘贴弹窗] 点击外部关闭');
            }
        });

        console.log('[手动粘贴弹窗] 事件已绑定');
    }

    // === 打开手动粘贴弹窗 ====================
    function openManualPasteModal() {
        const modal = document.getElementById('tou-manual-paste-modal');
        const answerPreview = document.getElementById('tou-answer-preview');
        const settingsPanel = document.getElementById('tou-settings-panel');

        // 关闭设置面板
        if (settingsPanel && settingsPanel.classList.contains('show')) {
            settingsPanel.classList.remove('show');
            console.log('[设置面板] 自动关闭（手动粘贴弹窗打开）');
        }

        // 清空 textarea，让用户自己粘贴内容
        answerPreview.value = '';
        console.log('[手动粘贴弹窗] 已打开，等待用户输入');

        // 显示弹窗
        modal.classList.add('show');

        // 自动聚焦到 textarea，方便用户直接粘贴
        setTimeout(() => {
            answerPreview.focus();
        }, 100);
    }

    // === 创建进度弹窗（现代化设计） ====================
    function createProgressModal() {
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.id = 'tou-progress-modal';
        modal.innerHTML = `
            <div class="tou-progress-content">
                <div class="tou-progress-header">
                    <h2><span class="material-symbols-outlined">auto_awesome</span>智能答题</h2>
                </div>

                <div class="tou-progress-body">
                    <div class="tou-progress-steps">
                        <!-- 步骤1：识别题目 -->
                        <div class="tou-progress-step" id="progress-step-1">
                            <div class="tou-progress-icon">
                                <span class="material-symbols-outlined">search</span>
                            </div>
                            <div class="tou-progress-text">
                                <h3>识别题目</h3>
                                <p>正在分析题目内容和图片...</p>
                            </div>
                        </div>

                        <!-- 步骤2：调用AI -->
                        <div class="tou-progress-step" id="progress-step-2">
                            <div class="tou-progress-icon">
                                <span class="material-symbols-outlined">psychology</span>
                            </div>
                            <div class="tou-progress-text">
                                <h3>AI思考中</h3>
                                <p>AI正在生成答案...</p>
                            </div>
                        </div>

                        <!-- 步骤3：粘贴答案 -->
                        <div class="tou-progress-step" id="progress-step-3">
                            <div class="tou-progress-icon">
                                <span class="material-symbols-outlined">edit_note</span>
                            </div>
                            <div class="tou-progress-text">
                                <h3>粘贴答案</h3>
                                <p>正在填入编辑器...</p>
                            </div>
                        </div>

                        <!-- 步骤4：自动提交 -->
                        <div class="tou-progress-step" id="progress-step-4">
                            <div class="tou-progress-icon">
                                <span class="material-symbols-outlined">play_arrow</span>
                            </div>
                            <div class="tou-progress-text">
                                <h3>自动提交</h3>
                                <p>正在运行测试...</p>
                            </div>
                        </div>

                        <!-- 步骤5：自动纠错 -->
                        <div class="tou-progress-step" id="progress-step-5">
                            <div class="tou-progress-icon">
                                <span class="material-symbols-outlined">auto_fix_high</span>
                            </div>
                            <div class="tou-progress-text">
                                <h3>自动纠错</h3>
                                <p>监控测试结果...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tou-progress-footer">
                    <button class="tou-btn-close-progress" id="tou-close-progress-btn">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('[进度弹窗] HTML 已创建');

        // 绑定关闭按钮事件
        const closeBtn = document.getElementById('tou-close-progress-btn');
        closeBtn.addEventListener('click', () => {
            closeProgressModal();
        });

        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'tou-progress-modal') {
                closeProgressModal();
            }
        });

        console.log('[进度弹窗] 事件已绑定');
    }

    // === 打开进度弹窗 ====================
    function openProgressModal() {
        const modal = document.getElementById('tou-progress-modal');
        const settingsPanel = document.getElementById('tou-settings-panel');
        const pasteModal = document.getElementById('tou-manual-paste-modal');

        // 关闭其他弹窗
        if (settingsPanel && settingsPanel.classList.contains('show')) {
            settingsPanel.classList.remove('show');
        }
        if (pasteModal && pasteModal.classList.contains('show')) {
            pasteModal.classList.remove('show');
        }

        // 重置所有步骤状态
        for (let i = 1; i <= 5; i++) {
            const step = document.getElementById(`progress-step-${i}`);
            step.className = 'tou-progress-step';
        }

        // 隐藏关闭按钮（答题过程中不允许关闭）
        const closeBtn = document.getElementById('tou-close-progress-btn');
        closeBtn.classList.remove('show');

        // 显示弹窗
        modal.classList.add('show');
        console.log('[进度弹窗] 已打开');
    }

    // === 关闭进度弹窗 ====================
    function closeProgressModal() {
        const modal = document.getElementById('tou-progress-modal');
        modal.classList.remove('show');
        console.log('[进度弹窗] 已关闭');
    }

    // === 更新进度 ====================
    /**
     * @param {number} stepNumber - 步骤编号 (1-5)
     * @param {string} status - 状态: 'active' | 'completed' | 'error'
     * @param {string} message - 可选的自定义消息
     */
    function updateProgress(stepNumber, status, message = '') {
        const step = document.getElementById(`progress-step-${stepNumber}`);
        if (!step) return;

        // 更新步骤状态
        step.className = `tou-progress-step ${status}`;

        // 更新图标
        const icon = step.querySelector('.material-symbols-outlined');
        if (status === 'completed') {
            icon.textContent = 'check_circle';
        } else if (status === 'error') {
            icon.textContent = 'error';
        }

        // 更新消息（如果提供）
        if (message) {
            const p = step.querySelector('p');
            p.textContent = message;
        }

        // 如果是最后一步且完成，显示关闭按钮
        if (stepNumber === 5 && (status === 'completed' || status === 'error')) {
            const closeBtn = document.getElementById('tou-close-progress-btn');
            closeBtn.classList.add('show');
        }

        console.log(`[进度弹窗] 步骤 ${stepNumber} - ${status}${message ? ': ' + message : ''}`);
    }

    // === 初始化 ====================
    /**
     * 检测编辑器是否加载完成，然后创建智能答题按钮
     */
    function init() {
        let attempts = 0;  // 尝试次数计数器

        // 每 500ms 检测一次编辑器是否出现
        const interval = setInterval(() => {
            attempts++;

            // 检测页面中是否存在 Monaco 编辑器的标志元素
            const hasEditor = document.querySelector('textarea.inputarea') ||
                             document.querySelector('.monaco-editor');

            if (hasEditor) {
                // 找到编辑器,停止检测
                clearInterval(interval);
                console.log('[初始化] 检测到编辑器');
                createButton();

                // 首次运行检查 - 如果 API Key 为空，提示用户配置
                setTimeout(() => {
                    if (!currentConfig.apiKey || currentConfig.apiKey.trim().length === 0) {
                        console.log('[初始化] 检测到未配置 API Key，自动打开设置面板');
                        toggleSettingsPanel();
                    }
                }, 1500);
            } else if (attempts >= 20) {
                // 超过 10 秒（20 * 500ms）仍未找到，放弃检测
                clearInterval(interval);
                console.warn('[初始化] 未检测到编辑器，仍创建按钮');
                createButton();
            }
        }, 500);
    }

    // === 启动脚本 ====================
    // 根据页面加载状态选择启动时机
    if (document.readyState === 'loading') {
        // 页面还在加载中，等待 DOM 加载完成
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        // 页面已加载完成，延迟 1 秒后启动（确保网站脚本已执行）
        setTimeout(init, 1000);
    }

})();
