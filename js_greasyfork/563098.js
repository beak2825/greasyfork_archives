// ==UserScript==
// @name         头歌助手
// @namespace    https://github.com/xbang
// @version      2.2.1
// @description  AI 智能答题，自动纠错，让编程实训更高效
// @author       xbang
// @license      MIT
// @match        *://*.educoder.net/tasks/*
// @icon         https://img.icons8.com/fluency/48/magic-wand.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.openai.com
// @connect      api.deepseek.com
// @connect      generativelanguage.googleapis.com
// @connect      api.anthropic.com
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563098/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563098/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[头歌助手 v2.2.0] 启动', 'color: #667eea; font-weight: bold;');

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
        TEST_CASE_HEADER: '.case-header___xppld, .case-header',
        DIFF_PANEL: '[class*="diff-panel-container"]',

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
            models: ['gpt-5', 'gpt-5-mini']
        },
        CLAUDE: {
            id: 'claude',
            name: 'Claude',
            defaultUrl: 'https://api.anthropic.com/v1/messages',
            defaultModel: 'claude-sonnet-4-5',
            models: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-4-5']
        },
        GEMINI: {
            id: 'gemini',
            name: 'Gemini',
            defaultUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
            defaultModel: 'gemini-2.5-flash',
            models: ['gemini-2.5-flash', 'gemini-3.0-flash', 'gemini-3.0-pro']
        },
        DEEPSEEK: {
            id: 'deepseek',
            name: 'DeepSeek',
            defaultUrl: 'https://api.deepseek.com/v1/chat/completions',
            defaultModel: 'deepseek-chat',
            models: ['deepseek-chat', 'deepseek-reasoner']
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
    const SYSTEM_BASE_PROMPT = `你是编程题解答专家，擅长解决 OJ（在线评测）类编程题目。

【解题步骤】
1. 仔细阅读题目，理解输入输出格式（注意：空格、换行、数据类型）
2. 分析示例，手动模拟一遍确保理解正确
3. 考虑边界情况：空输入、单元素、最大值、最小值
4. 编写代码，确保输出格式与要求完全一致

【输出格式要求】
- 直接输出可运行的完整代码
- 禁止使用 \`\`\` 代码块包裹
- 禁止添加任何解释、注释、前缀文字
- 输出必须与预期格式完全一致（包括空格和换行）

【常见错误提醒】
- 行末多余空格或缺少换行
- 整数溢出（考虑使用 long long / BigInteger）
- 浮点精度问题（注意保留小数位数）
- 数组越界（检查循环边界）

`;

    // === 系统纠错 Prompt 模板（封装在代码中，用户不可见）====================
    const SYSTEM_RETRY_PROMPT = `你是代码纠错专家。之前提交的代码测试失败了，你需要修复它。

【错误诊断流程】
1. 逐字符对比「预期输出」和「实际输出」，找出第一个不同的位置
2. 判断错误类型：
   - 格式错误：多余空格、缺少换行、大小写不对、标点符号错误
   - 逻辑错误：算法实现有误、边界条件处理不当、循环次数错误
   - 数据类型错误：整数溢出、浮点精度、类型转换问题
3. 针对性修复，不要大幅重写代码

【修复原则】
- 最小改动原则：只修改导致错误的部分
- 如果有模板代码，必须保持模板结构不变
- 仔细检查输出格式：空格、换行、数字精度

【输出要求】
- 直接输出修正后的完整可运行代码
- 禁止使用 \`\`\` 代码块包裹
- 禁止添加任何解释或分析文字

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
        maxRetryCount: 2,      // 默认 2 次，用户可配置 1-5 次
        enableImage: false     // 默认不启用图片识别
    };

    // === IconPark 风格 SVG 图标 ====================
    const ICONS = {
        // 魔法棒 - 智能答题默认
        magic: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.57932 35.4207C5.32303 32.1826 4 28.2458 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C19.7542 44 15.8174 42.677 12.5793 40.4207M7.57932 35.4207C8.93657 37.3685 10.6315 39.0634 12.5793 40.4207M7.57932 35.4207L16 27M12.5793 40.4207L21 32M16 27L20 23L25 28L21 32M16 27L21 32" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 14H21M19 12V16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 17H34M31 14V20" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 29H36M34 27V31" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 搜索 - 识别中
        search: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 38C30.389 38 38 30.389 38 21C38 11.611 30.389 4 21 4C11.611 4 4 11.611 4 21C4 30.389 11.611 38 21 38Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M33 33L44 44" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 思考中 - 双圈加载
        brain: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 对勾 - 完成
        check: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M43 11L16.875 37L5 25.1818" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 圆形对勾 - 成功
        checkCircle: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" stroke="currentColor" stroke-width="4"/><path d="M16 24L22 30L34 18" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 关闭 X
        close: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 14L34 34M14 34L34 14" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 错误
        error: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" stroke="currentColor" stroke-width="4"/><path d="M18 18L30 30M18 30L30 18" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 粘贴
        paste: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 12H8V44H40V12H32" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8H32V16H16V8Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`,
        // 设置齿轮
        settings: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`,
        // 加载中/同步
        sync: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        // 警告
        warning: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" stroke="currentColor" stroke-width="4"/><path d="M24 14V26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="33" r="2" fill="currentColor"/></svg>`,
        // 信息
        info: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" stroke="currentColor" stroke-width="4"/><path d="M24 22V34" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="15" r="2" fill="currentColor"/></svg>`,
        // 展开箭头（向下）
        chevronDown: `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 18L24 30L12 18" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };

    // === UI 样式常量 ====================
    const UI_STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* 图标通用样式 */
        .tou-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            vertical-align: middle;
        }
        .tou-icon svg {
            width: 100%;
            height: 100%;
            display: block;
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
            gap: 6px;
            padding: 6px 12px;
            background: rgba(96, 122, 251, 0.1);
            color: #607AFB;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
            line-height: 1;
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
        #smart-answer-btn .tou-icon {
            width: 14px;
            height: 14px;
        }
        #smart-answer-btn span:not(.tou-icon) {
            line-height: 14px;
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
        .tou-icon-btn .tou-icon {
            width: 14px;
            height: 14px;
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

        /* 进度状态胶囊（紧挨按钮组右侧，与按钮组风格一致） */
        #tou-progress-capsule {
            display: none;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: white;
            border: none;
            border-radius: 9999px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            margin-left: 6px;
            line-height: 1;
        }
        #tou-progress-capsule.show {
            display: inline-flex;
        }
        #tou-progress-capsule .tou-icon {
            width: 14px;
            height: 14px;
        }
        #tou-progress-capsule .tou-capsule-text {
            line-height: 14px;
        }
        /* working 状态 - 与智能答题按钮 working 一致 */
        #tou-progress-capsule.working {
            background: rgba(96, 122, 251, 0.1);
            color: #607AFB;
        }
        #tou-progress-capsule.working .tou-icon {
            animation: spin 1s linear infinite;
        }
        #tou-progress-capsule.success {
            background: rgba(17, 153, 142, 0.1);
            color: #11998E;
        }
        #tou-progress-capsule.error {
            background: rgba(235, 51, 73, 0.1);
            color: #EB3349;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .tou-capsule-steps {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-left: 2px;
        }
        .tou-capsule-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            opacity: 0.3;
            transition: all 0.3s;
        }
        .tou-capsule-dot.active {
            opacity: 1;
        }
        .tou-capsule-dot.completed {
            opacity: 1;
            background: #11998E;
        }
        .tou-capsule-dot.error {
            opacity: 1;
            background: #EB3349;
        }

        .tou-capsule-close {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            color: inherit;
            padding: 0;
            margin-left: 2px;
            opacity: 0.6;
            transition: all 0.2s;
        }
        .tou-capsule-close:hover {
            opacity: 1;
        }
        .tou-capsule-close .tou-icon {
            width: 12px;
            height: 12px;
        }
        .tou-capsule-close.hidden {
            display: none;
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
        .tou-collapsible-header .tou-icon {
            width: 18px;
            height: 18px;
            color: #607AFB;
        }
        .tou-collapsible-toggle {
            width: 18px;
            height: 18px;
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
        .tou-warning .tou-icon {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            margin-top: 1px;
            color: #607AFB;
        }

        /* Toast 提示框样式 */
        .tou-toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            pointer-events: none;
        }
        .tou-toast {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: white;
            pointer-events: auto;
            animation: toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tou-toast.hiding {
            animation: toastSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .tou-toast.success { background: #11998E; }
        .tou-toast.error { background: #EB3349; }
        .tou-toast.warning { background: #F5A623; }
        .tou-toast.info { background: #607AFB; }
        .tou-toast .tou-icon {
            width: 18px;
            height: 18px;
        }
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
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
     * 支持提供商：OpenAI, Claude, Gemini, DeepSeek
     */
    const APIAdapter = {
        /**
         * 构建请求配置（根据提供商自动选择格式）
         * @param {string} provider - API 提供商 ID
         * @param {string} prompt - 完整的 prompt
         * @param {Object} config - 用户配置
         * @param {string[]} images - 图片 base64 数组（可选）
         * @returns {Object} - { url, headers, body, method }
         */
        buildRequest(provider, prompt, config, images = []) {
            switch (provider) {
                case 'claude':
                    return this.buildClaudeRequest(prompt, config, images);
                case 'gemini':
                    return this.buildGeminiRequest(prompt, config, images);
                case 'openai':
                case 'deepseek':
                case 'custom':
                default:
                    return this.buildOpenAIRequest(prompt, config, images);
            }
        },

        /**
         * 构建 OpenAI 兼容格式请求（OpenAI, DeepSeek, 自定义）
         */
        buildOpenAIRequest(prompt, config, images = []) {
            let messages;

            if (images.length > 0) {
                const content = [{ type: 'text', text: prompt }];
                images.forEach((imageBase64) => {
                    content.push({
                        type: 'image_url',
                        image_url: { url: imageBase64 }
                    });
                });
                messages = [{ role: 'user', content: content }];
            } else {
                messages = [{ role: 'user', content: prompt }];
            }

            return {
                url: config.apiUrl,
                method: 'POST',
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
         * 构建 Claude API 请求
         */
        buildClaudeRequest(prompt, config, images = []) {
            let content;

            if (images.length > 0) {
                content = [];
                images.forEach((imageBase64) => {
                    // 解析 base64 格式: data:image/png;base64,xxx
                    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
                    if (matches) {
                        content.push({
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: matches[1],
                                data: matches[2]
                            }
                        });
                    }
                });
                content.push({ type: 'text', text: prompt });
            } else {
                content = prompt;
            }

            return {
                url: config.apiUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: {
                    model: config.model,
                    max_tokens: 4096,
                    messages: [{ role: 'user', content: content }]
                }
            };
        },

        /**
         * 构建 Gemini API 请求
         */
        buildGeminiRequest(prompt, config, images = []) {
            const parts = [];

            // 添加图片
            if (images.length > 0) {
                images.forEach((imageBase64) => {
                    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
                    if (matches) {
                        parts.push({
                            inline_data: {
                                mime_type: matches[1],
                                data: matches[2]
                            }
                        });
                    }
                });
            }

            // 添加文本
            parts.push({ text: prompt });

            // Gemini API URL 格式: baseUrl/model:generateContent?key=apiKey
            const url = `${config.apiUrl}/${config.model}:generateContent?key=${config.apiKey}`;

            return {
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    contents: [{ parts: parts }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096
                    }
                }
            };
        },

        /**
         * 解析 API 响应（根据提供商自动选择格式）
         * @param {string} provider - API 提供商 ID
         * @param {Object} responseData - 响应 JSON 数据
         * @returns {string} - 提取的答案文本
         */
        parseResponse(provider, responseData) {
            switch (provider) {
                case 'claude':
                    return this.parseClaudeResponse(responseData);
                case 'gemini':
                    return this.parseGeminiResponse(responseData);
                case 'openai':
                case 'deepseek':
                case 'custom':
                default:
                    return this.parseOpenAIResponse(responseData);
            }
        },

        /**
         * 解析 OpenAI 兼容格式响应
         */
        parseOpenAIResponse(responseData) {
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
                console.error('[API适配器] OpenAI 响应解析失败:', err.message);
                throw new Error('API 响应格式错误: ' + err.message);
            }
        },

        /**
         * 解析 Claude API 响应
         */
        parseClaudeResponse(responseData) {
            try {
                if (!responseData || !responseData.content || responseData.content.length === 0) {
                    throw new Error('Claude 响应数据格式错误');
                }

                // Claude 返回 content 数组，提取 text 类型
                const textContent = responseData.content.find(c => c.type === 'text');
                if (!textContent || !textContent.text) {
                    throw new Error('Claude 响应缺少 text content');
                }

                return textContent.text.trim();
            } catch (err) {
                console.error('[API适配器] Claude 响应解析失败:', err.message);
                throw new Error('Claude API 响应格式错误: ' + err.message);
            }
        },

        /**
         * 解析 Gemini API 响应
         */
        parseGeminiResponse(responseData) {
            try {
                if (!responseData || !responseData.candidates || responseData.candidates.length === 0) {
                    throw new Error('Gemini 响应数据格式错误');
                }

                const firstCandidate = responseData.candidates[0];
                if (!firstCandidate.content || !firstCandidate.content.parts) {
                    throw new Error('Gemini 响应缺少 content.parts');
                }

                // 提取所有 text 部分并合并
                const textParts = firstCandidate.content.parts
                    .filter(p => p.text)
                    .map(p => p.text);

                if (textParts.length === 0) {
                    throw new Error('Gemini 响应缺少 text');
                }

                return textParts.join('\n').trim();
            } catch (err) {
                console.error('[API适配器] Gemini 响应解析失败:', err.message);
                throw new Error('Gemini API 响应格式错误: ' + err.message);
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

                console.log(`[编辑器] 已粘贴 ${text.length} 字符`);
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

                console.log('[编辑器] 已清空');
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

    // === Toast 提示模块 ===
    /**
     * Toast 助手 - 封装用户提示操作
     */
    const ToastHelper = {
        container: null,

        /**
         * 获取或创建 Toast 容器
         */
        getContainer() {
            if (!this.container || !document.contains(this.container)) {
                this.container = document.createElement('div');
                this.container.className = 'tou-toast-container';
                document.body.appendChild(this.container);
            }
            return this.container;
        },

        /**
         * 显示 Toast 提示
         * @param {string} message - 提示消息
         * @param {string} type - 类型: success | error | warning | info
         * @param {number} duration - 显示时长（毫秒）
         */
        show(message, type = 'info', duration = 3000) {
            const container = this.getContainer();

            const iconMap = {
                success: ICONS.checkCircle,
                error: ICONS.error,
                warning: ICONS.warning,
                info: ICONS.info
            };

            const toast = document.createElement('div');
            toast.className = `tou-toast ${type}`;
            toast.innerHTML = `
                <span class="tou-icon">${iconMap[type] || ICONS.info}</span>
                <span>${message}</span>
            `;

            container.appendChild(toast);
            console.log(`[Toast] ${type.toUpperCase()}: ${message}`);

            // 自动消失
            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        },

        success(message, duration = 3000) {
            this.show(message, 'success', duration);
        },

        error(message, duration = 4000) {
            this.show(message, 'error', duration);
        },

        warning(message, duration = 3500) {
            this.show(message, 'warning', duration);
        },

        info(message, duration = 3000) {
            this.show(message, 'info', duration);
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

            // 并行下载并转换为 base64
            console.log('[图片处理] 开始并行下载图片...');

            const results = await Promise.allSettled(
                imageUrls.map(url => this.downloadAsBase64(url))
            );

            const imageBase64Array = [];
            let successCount = 0;
            let failCount = 0;

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    imageBase64Array.push(result.value);
                    successCount++;
                    console.log(`[图片处理] 图片${index + 1}转换成功 (${Math.round(result.value.length / 1024)} KB)`);
                } else {
                    failCount++;
                    console.warn(`[图片处理] 图片${index + 1}转换失败: ${result.reason?.message || '未知错误'}`);
                }
            });

            console.log(`[图片处理] 完成：成功 ${successCount} 张，失败 ${failCount} 张`);
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
                prompt += '【额外要求】\n' + userTemplate + '\n\n';
            }

            prompt += '【题目】\n' + questionText;

            // 如果有现有代码，作为模板提供给 AI，并强调必须保留
            if (currentCode && currentCode.trim().length > 0) {
                prompt += `

═══════════════════════════════════════════════════════════════
⚠️ 强制要求：以下是编辑器中的模板代码，你必须基于此模板修改！
═══════════════════════════════════════════════════════════════

${currentCode}

═══════════════════════════════════════════════════════════════
🚨 模板使用规则（违反将导致答案错误）：
1. 严禁从零开始编写代码，必须在上述模板基础上修改
2. 保留模板中的所有标记：#Begin/#End、echo、print、scanf、printf 等
3. 保留模板中的输入输出格式和变量声明
4. 只在需要填充逻辑的位置编写你的代码
5. 输出的代码必须是完整的、可直接运行的
═══════════════════════════════════════════════════════════════`;
            }

            console.log(`%c[Prompt] 初始答题 | 题目${questionText.length}字 | 模板${currentCode.length}字`, 'color: #667eea; font-weight: bold;');
            console.log('%c========== 完整 Prompt 开始 ==========', 'color: #f093fb; font-weight: bold;');
            console.log(prompt);
            console.log('%c========== 完整 Prompt 结束 ==========', 'color: #f093fb; font-weight: bold;');
            return prompt;
        },

        /**
         * 构建纠错 Prompt
         * @param {string} originalQuestion - 原始题目
         * @param {string} originalTemplate - 原始模板代码
         * @param {Array} retryHistory - 纠错历史数组 [{attemptNumber, code, expected, actual, testInfo}]
         * @returns {string} - 纠错 Prompt
         */
        buildRetryPrompt(originalQuestion, originalTemplate, retryHistory) {
            let prompt = SYSTEM_RETRY_PROMPT;

            prompt += `【题目】
${originalQuestion}

`;

            // 如果有原始模板，强调必须保持结构
            if (originalTemplate && originalTemplate.trim().length > 0) {
                prompt += `═══════════════════════════════════════════════════════════════
⚠️ 原始模板代码（必须保持此结构，严禁重写）
═══════════════════════════════════════════════════════════════
${originalTemplate}
═══════════════════════════════════════════════════════════════

`;
            }

            // 遍历所有尝试历史，重点突出预期和实际的对比
            prompt += `【失败记录分析】\n`;
            retryHistory.forEach((attempt) => {
                prompt += `
┌─────────────────────────────────────────────────────────────┐
│ 第 ${attempt.attemptNumber} 次尝试 - 失败                                        │
└─────────────────────────────────────────────────────────────┘

✅ 预期输出（正确答案）：
「${attempt.expected}」

❌ 实际输出（你的代码产生）：
「${attempt.actual}」

`;
            });

            prompt += `═══════════════════════════════════════════════════════════════
🔧 请执行以下步骤修复：
1. 逐字符对比「预期输出」和「实际输出」
2. 找出第一个不同的位置，判断是格式问题还是逻辑问题
3. 针对性修复，输出完整的修正后代码
═══════════════════════════════════════════════════════════════

直接输出修正后的完整代码：`;

            const lastAttempt = retryHistory[retryHistory.length - 1];
            console.log(`%c[Prompt] 纠错第${retryHistory.length}次 | 预期${lastAttempt.expected.length}字 | 实际${lastAttempt.actual.length}字`, 'color: #f45c43; font-weight: bold;');
            console.log('%c========== 纠错 Prompt 开始 ==========', 'color: #f093fb; font-weight: bold;');
            console.log(prompt);
            console.log('%c========== 纠错 Prompt 结束 ==========', 'color: #f093fb; font-weight: bold;');

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

                    console.log('[AI服务] 请求配置:', {
                        provider: config.apiProvider,
                        url: request.url,
                        model: config.model
                    });

                    GM_xmlhttpRequest({
                        method: request.method || 'POST',
                        url: request.url,
                        headers: request.headers,
                        data: JSON.stringify(request.body),
                        timeout: 60000,
                        onload: (response) => {
                            console.log('[AI服务] 响应状态:', response.status);

                            if (response.status === 200) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    console.log('[AI服务] 响应数据结构:', Object.keys(data));

                                    const answer = APIAdapter.parseResponse(config.apiProvider, data);

                                    // 增强的格式清理
                                    let cleanAnswer = answer;

                                    // 1. 清理 markdown 代码块标记（支持多种格式）
                                    cleanAnswer = cleanAnswer.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');

                                    // 2. 清理常见的无用前缀
                                    cleanAnswer = cleanAnswer.replace(/^(答案[：:]\s*|代码如下[：:]\s*|解答[：:]\s*|Solution[：:]\s*)/i, '');

                                    // 3. 清理开头的空行
                                    cleanAnswer = cleanAnswer.replace(/^\s*\n+/, '');

                                    // 4. 清理末尾多余空白
                                    cleanAnswer = cleanAnswer.trimEnd();

                                    console.log(`[AI服务] 成功获取答案 (${cleanAnswer.length} 字符)`);
                                    resolve(cleanAnswer);
                                } catch (parseErr) {
                                    console.error('[AI服务] 响应解析失败:', parseErr.message);
                                    console.error('[AI服务] 原始响应:', response.responseText.substring(0, 1000));
                                    reject(new Error('API 响应格式错误: ' + parseErr.message));
                                }
                            } else {
                                console.error('[AI服务] API 错误:', response.status, response.statusText);
                                console.error('[AI服务] 错误响应:', response.responseText.substring(0, 1000));
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
         * 检测按钮是否可用
         * @param {HTMLElement} btn - 按钮元素
         * @returns {boolean} - 可用返回 true
         */
        isButtonReady(btn) {
            if (!btn) return false;
            const isDisabled = btn.disabled;
            const hasDisabledClass = btn.classList.contains('disabled') ||
                                     btn.classList.contains('loading') ||
                                     btn.classList.contains('cooldown');
            const btnText = btn.innerText || btn.textContent || '';
            const hasCountdown = /\d+\s*(秒|s)/i.test(btnText);
            return !isDisabled && !hasDisabledClass && !hasCountdown;
        },

        /**
         * 等待提交按钮可用（处理冷却时间）
         * @param {number} maxWait - 最大等待时间（毫秒），默认30秒
         * @returns {Promise<HTMLElement|null>} - 可用的按钮元素或null
         */
        async waitForButtonReady(maxWait = 30000) {
            const checkInterval = 500;
            let waited = 0;

            while (waited < maxWait) {
                const btn = DOMHelper.trySelectors(SELECTORS.SUBMIT_BUTTONS);
                if (this.isButtonReady(btn)) {
                    if (waited > 0) {
                        console.log(`[提交操作] 按钮可用（等待了 ${waited / 1000} 秒）`);
                    }
                    return btn;
                }

                if (waited === 0) {
                    console.log('[提交操作] 等待评测按钮冷却...');
                } else if (waited % 5000 === 0) {
                    console.log(`[提交操作] 仍在等待，已 ${waited / 1000} 秒...`);
                }

                await new Promise(resolve => setTimeout(resolve, checkInterval));
                waited += checkInterval;
            }

            console.warn(`[提交操作] 等待超时（${maxWait / 1000}秒）`);
            return null;
        },

        /**
         * 自动提交（立即，不等待冷却）
         * @returns {boolean} - 成功返回 true
         */
        autoSubmit() {
            const btn = DOMHelper.trySelectors(SELECTORS.SUBMIT_BUTTONS);
            if (this.isButtonReady(btn)) {
                setTimeout(() => btn.click(), 1000 + Math.random() * 1000);
                return true;
            }
            console.warn('[提交操作] 按钮不可用');
            return false;
        },

        /**
         * 等待按钮可用后自动提交
         * @param {number} maxWait - 最大等待时间
         * @returns {Promise<boolean>} - 成功返回 true
         */
        async autoSubmitWithWait(maxWait = 30000) {
            const btn = await this.waitForButtonReady(maxWait);
            if (!btn) return false;

            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
            btn.click();
            console.log('[提交操作] 已点击提交按钮');
            return true;
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
                // 直接定位 diff-panel-container
                const diffPanel = document.querySelector(SELECTORS.DIFF_PANEL);
                if (!diffPanel) {
                    console.warn('[测试监控] 未找到 diff-panel-container');
                    return null;
                }

                const divs = diffPanel.querySelectorAll(':scope > div');
                if (divs.length < 2) {
                    console.warn('[测试监控] diff-panel 子元素不足');
                    return null;
                }

                // 第1个div = 预期输出，第2个div = 实际输出
                const expectedRaw = divs[0].innerText || '';
                const actualRaw = divs[1].innerText || '';

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

                console.log(`[测试监控] 提取成功（预期${expected.length}字符，实际${actual.length}字符）`);

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
                            console.log(`[测试监控] 成功（耗时 ${elapsed}s）`);
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
                        console.log(`[测试监控] 失败（耗时 ${elapsed}s）`);
                        resolve('failure');
                        return;
                    }

                    // 检查超时
                    if (Date.now() - startTime > timeout) {
                        resolved = true;
                        observer.disconnect();
                        console.warn('[测试监控] 超时');
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
                        console.warn('[测试监控] 强制超时');
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
        // 任务ID，用于取消旧任务
        currentTaskId: 0,
        // 原始模板代码（用于纠错时保持模板结构）
        originalTemplate: '',
        // 纠错历史记录（累积每次尝试的代码和输出）
        retryHistory: [],

        /**
         * 检查任务是否已被取消
         * @param {number} taskId - 任务ID
         * @returns {boolean} - 是否已取消
         */
        isTaskCancelled(taskId) {
            return taskId !== this.currentTaskId;
        },

        /**
         * 自动纠错主函数
         * @param {string} originalQuestion - 原始题目文本
         * @param {string} originalTemplate - 原始模板代码
         * @param {string[]} images - 题目图片 base64 数组
         * @param {Object} config - 用户配置
         * @param {number} retryCount - 当前重试次数
         * @returns {Promise<boolean>} - 纠错成功返回 true
         */
        async autoRetry(originalQuestion, originalTemplate, images, config, retryCount = 0) {
            console.log(`%c[纠错] 第 ${retryCount + 1}/${config.maxRetryCount} 次`, 'color: #667eea; font-weight: bold;');

            if (retryCount >= config.maxRetryCount) {
                console.warn('[纠错] 已达到最大重试次数');
                return false;
            }

            try {
                // 步骤 1: 等待测试结果加载
                const testCaseElement = await DOMHelper.waitForElement(
                    [SELECTORS.TEST_CASE_ITEM, 'li'],
                    8000,
                    500
                );

                if (!testCaseElement) {
                    throw new Error('等待测试用例元素超时');
                }

                // 点击展开详情
                const header = testCaseElement.querySelector(SELECTORS.TEST_CASE_HEADER);
                if (header) {
                    header.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // 等待 diff-panel 出现
                let foundOutputs = false;
                let waitTime = 0;
                const maxWaitTime = 8000;

                while (!foundOutputs && waitTime < maxWaitTime) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    waitTime += 500;
                    foundOutputs = !!document.querySelector(SELECTORS.DIFF_PANEL);
                }

                if (!foundOutputs) {
                    throw new Error('等待测试结果超时');
                }

                // 步骤 2: 提取测试输出
                const testOutput = TestMonitor.extractOutputs();
                if (!testOutput) {
                    throw new Error('无法提取测试输出');
                }
                console.log(`[纠错] 预期: "${testOutput.expected.substring(0, 50)}${testOutput.expected.length > 50 ? '...' : ''}"`);
                console.log(`[纠错] 实际: "${testOutput.actual.substring(0, 50)}${testOutput.actual.length > 50 ? '...' : ''}"`);

                // 步骤 3: 获取当前代码并记录历史
                const currentCode = EditorHelper.getCode();
                if (!currentCode) {
                    throw new Error('无法获取当前代码');
                }

                this.retryHistory.push({
                    attemptNumber: retryCount + 1,
                    code: currentCode,
                    expected: testOutput.expected,
                    actual: testOutput.actual,
                    testInfo: testOutput.testInfo
                });

                // 步骤 4-5: 构建 Prompt 并调用 AI
                const retryPrompt = PromptBuilder.buildRetryPrompt(originalQuestion, originalTemplate, this.retryHistory);
                const fixedCode = await AIService.generateAnswer(retryPrompt, config, images);
                if (!fixedCode) {
                    throw new Error('AI 返回空答案');
                }
                console.log(`[纠错] AI 返回 ${fixedCode.length} 字符`);

                // 步骤 6: 清空并粘贴
                await EditorHelper.clear();
                await new Promise(resolve => setTimeout(resolve, 500));

                // 粘贴新代码
                const success = await EditorHelper.paste(fixedCode);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!success) {
                    throw new Error('粘贴修正代码失败');
                }

                // 步骤 7: 自动提交
                if (config.autoSubmit) {
                    const submitted = await SubmitHelper.autoSubmitWithWait(30000);
                    if (!submitted) {
                        console.warn('[纠错] 提交按钮不可用');
                        return false;
                    }

                    // 监控测试结果
                    const result = await TestMonitor.waitForResult();

                    if (result === 'success') {
                        console.log('%c[纠错] 成功！', 'color: #38ef7d; font-weight: bold;');
                        return true;
                    } else if (result === 'failure') {
                        console.log(`%c[纠错] 第 ${retryCount + 1} 次失败`, 'color: #f45c43; font-weight: bold;');
                        return await this.autoRetry(originalQuestion, originalTemplate, images, config, retryCount + 1);
                    } else {
                        console.warn('[纠错] 超时');
                        return false;
                    }
                } else {
                    return false;
                }

            } catch (err) {
                console.error(`[纠错] 错误: ${err.message}`);
                return false;
            }
        },

        /**
         * 智能答题主流程
         * @param {Object} config - 用户配置
         * @returns {Promise<boolean>} - 成功返回 true
         */
        async smartAnswer(config) {
            const taskId = ++this.currentTaskId;
            this.retryHistory = [];
            console.log('%c[答题] 开始', 'color: #667eea; font-weight: bold;');

            try {
                // 步骤 1: 识别题目
                EventBus.emit('answer:step', { step: 1, status: 'active', message: '正在分析题目内容和图片...' });
                const question = await QuestionDetector.detect(config.enableImage);
                if (!question) {
                    EventBus.emit('answer:step', { step: 1, status: 'error', message: '未检测到题目内容' });
                    throw new Error('未检测到题目内容');
                }
                EventBus.emit('answer:step', { step: 1, status: 'completed', message: `已识别题目（${question.text.length}字${question.images.length > 0 ? `, ${question.images.length}张图片` : ''}）` });

                if (this.isTaskCancelled(taskId)) return false;

                // 步骤 2: 获取模板代码
                const currentCode = EditorHelper.getCode();
                this.originalTemplate = currentCode || '';

                // 步骤 3: 调用 AI
                EventBus.emit('answer:step', { step: 2, status: 'active', message: 'AI正在分析题目并生成答案...' });
                const prompt = PromptBuilder.buildInitialPrompt(question.text, currentCode, config.promptTemplate);
                const answer = await AIService.generateAnswer(prompt, config, question.images);
                if (!answer) {
                    EventBus.emit('answer:step', { step: 2, status: 'error', message: 'AI 返回空答案' });
                    throw new Error('AI 返回空答案');
                }
                EventBus.emit('answer:step', { step: 2, status: 'completed', message: `已生成答案（${answer.length}字符）` });

                if (this.isTaskCancelled(taskId)) return false;

                // 步骤 4: 清空并粘贴
                EventBus.emit('answer:step', { step: 3, status: 'active', message: '正在填入编辑器...' });
                await EditorHelper.clear();
                await new Promise(resolve => setTimeout(resolve, 300));
                const success = await EditorHelper.paste(answer);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!success) {
                    EventBus.emit('answer:step', { step: 3, status: 'error', message: '粘贴失败' });
                    throw new Error('粘贴失败');
                }
                EventBus.emit('answer:step', { step: 3, status: 'completed', message: '答案已填入编辑器' });

                if (this.isTaskCancelled(taskId)) return false;

                // 步骤 5: 自动提交
                if (config.autoSubmit) {
                    EventBus.emit('answer:step', { step: 4, status: 'active', message: '正在提交代码...' });
                    const submitted = SubmitHelper.autoSubmit();
                    if (!submitted) {
                        EventBus.emit('answer:step', { step: 4, status: 'error', message: '未找到提交按钮' });
                        EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过' });
                        EventBus.emit('answer:complete', { success: true });
                        return true;
                    }
                    EventBus.emit('answer:step', { step: 4, status: 'completed', message: '已提交' });

                    // 步骤 6: 自动纠错
                    if (config.autoRetry) {
                        EventBus.emit('answer:step', { step: 5, status: 'active', message: '监控测试结果...' });
                        const result = await TestMonitor.waitForResult();

                        if (result === 'success') {
                            EventBus.emit('answer:step', { step: 5, status: 'completed', message: '一次通过！' });
                            EventBus.emit('answer:complete', { success: true });
                            console.log('%c[答题] 通过', 'color: #38ef7d; font-weight: bold;');
                            return true;
                        } else if (result === 'failure') {
                            EventBus.emit('answer:step', { step: 5, status: 'active', message: '正在纠错...' });
                            const retrySuccess = await this.autoRetry(question.text, this.originalTemplate, question.images, config, 0);
                            if (retrySuccess) {
                                EventBus.emit('answer:step', { step: 5, status: 'completed', message: '纠错成功！' });
                                EventBus.emit('answer:complete', { success: true });
                            } else {
                                EventBus.emit('answer:step', { step: 5, status: 'error', message: '纠错失败' });
                                EventBus.emit('answer:complete', { success: false });
                            }
                            return retrySuccess;
                        } else {
                            EventBus.emit('answer:step', { step: 5, status: 'error', message: '超时' });
                            EventBus.emit('answer:complete', { success: false });
                        }
                    } else {
                        EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过' });
                        EventBus.emit('answer:complete', { success: true });
                    }
                } else {
                    EventBus.emit('answer:step', { step: 4, status: 'completed', message: '已跳过' });
                    EventBus.emit('answer:step', { step: 5, status: 'completed', message: '已跳过' });
                    EventBus.emit('answer:complete', { success: true });
                }

                return true;

            } catch (err) {
                console.error(`[答题] 错误: ${err.message}`);
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
                console.log('[EventBus] 智能答题完成');
            } else {
                console.warn('[EventBus] 智能答题完成（有失败）');
            }
        });

        EventBus.on('answer:error', (data) => {
            console.error('[EventBus] 智能答题错误:', data.error);
        });

        // 创建按钮组容器
        const buttonGroup = document.createElement('div');
        buttonGroup.id = 'tou-button-group';

        // 创建智能答题按钮（主按钮）
        const smartAnswerBtn = document.createElement('button');
        smartAnswerBtn.id = 'smart-answer-btn';
        smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.magic}</span><span>智能答题</span>`;

        // 智能答题按钮点击事件
        smartAnswerBtn.addEventListener('click', async () => {
            if (smartAnswerBtn.disabled) return;

            smartAnswerBtn.disabled = true;

            try {
                // 打开进度弹窗
                openProgressModal();

                // 显示识别状态
                smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.search}</span><span>识别中...</span>`;
                smartAnswerBtn.className = 'working';

                await new Promise(resolve => setTimeout(resolve, 300));

                // 显示 AI 思考状态
                smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.brain}</span><span>思考中...</span>`;

                // 执行智能答题（不再传递 progressCallback）
                await AnswerEngine.smartAnswer(currentConfig);

                // 显示成功状态
                smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.checkCircle}</span><span>完成!</span>`;
                smartAnswerBtn.className = 'success';

                // 3秒后自动关闭进度弹窗
                setTimeout(() => {
                    closeProgressModal();
                }, 3000);

            } catch (err) {
                console.error('[错误]', err.message);
                ToastHelper.error('请求失败：' + err.message);
                smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.error}</span><span>失败</span>`;
                smartAnswerBtn.className = 'error';

                // 错误时也关闭进度弹窗
                setTimeout(() => {
                    closeProgressModal();
                }, 2000);

            } finally {
                // 2秒后恢复
                setTimeout(() => {
                    smartAnswerBtn.disabled = false;
                    smartAnswerBtn.innerHTML = `<span class="tou-icon">${ICONS.magic}</span><span>智能答题</span>`;
                    smartAnswerBtn.className = '';
                }, 2000);
            }
        });

        // 创建手动粘贴按钮（图标按钮）
        const pasteBtn = document.createElement('button');
        pasteBtn.id = 'tou-manual-paste-btn';
        pasteBtn.className = 'tou-icon-btn';
        pasteBtn.innerHTML = `<span class="tou-icon">${ICONS.paste}</span>`;
        pasteBtn.title = '手动粘贴代码';
        pasteBtn.addEventListener('click', () => {
            console.log('%c[点击] 打开手动粘贴弹窗', 'color: #667eea; font-weight: bold;');
            openManualPasteModal();
        });

        // 创建设置按钮（图标按钮）
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'tou-settings-btn';
        settingsBtn.className = 'tou-icon-btn';
        settingsBtn.innerHTML = `<span class="tou-icon">${ICONS.settings}</span>`;
        settingsBtn.title = '设置';
        settingsBtn.addEventListener('click', () => {
            console.log('%c[点击] 打开设置面板', 'color: #667eea; font-weight: bold;');
            toggleSettingsPanel();
        });

        // 按钮添加到容器
        buttonGroup.appendChild(smartAnswerBtn);
        buttonGroup.appendChild(pasteBtn);
        buttonGroup.appendChild(settingsBtn);

        // 创建进度胶囊（紧挨按钮组右侧）
        const progressCapsule = document.createElement('div');
        progressCapsule.id = 'tou-progress-capsule';
        progressCapsule.innerHTML = `
            <span class="tou-icon tou-capsule-icon">${ICONS.sync}</span>
            <span class="tou-capsule-text">准备中</span>
            <div class="tou-capsule-steps">
                <div class="tou-capsule-dot" id="capsule-dot-1"></div>
                <div class="tou-capsule-dot" id="capsule-dot-2"></div>
                <div class="tou-capsule-dot" id="capsule-dot-3"></div>
                <div class="tou-capsule-dot" id="capsule-dot-4"></div>
                <div class="tou-capsule-dot" id="capsule-dot-5"></div>
            </div>
            <button class="tou-capsule-close hidden" id="tou-capsule-close-btn">
                <span class="tou-icon">${ICONS.close}</span>
            </button>
        `;

        // 将按钮组插入到 div.grade-info 元素之后（48441 数字后面）
        const gradeInfo = document.querySelector('div.grade-info');
        if (gradeInfo) {
            // 插入到 grade-info 元素的后面
            gradeInfo.insertAdjacentElement('afterend', buttonGroup);
            // 进度胶囊紧跟在按钮组后面
            buttonGroup.insertAdjacentElement('afterend', progressCapsule);
            console.log('%c[按钮组] 已创建（在 48441 数字后面）', 'color: #38ef7d; font-weight: bold;');
        } else {
            // 如果找不到 grade-info，回退到添加到 body（兼容其他页面）
            document.body.appendChild(buttonGroup);
            document.body.appendChild(progressCapsule);
            console.log('%c[按钮组] 已创建（未找到 div.grade-info，添加到 body）', 'color: #f5a623; font-weight: bold;');
        }

        // 创建设置面板
        createSettingsPanel();

        // 创建手动粘贴弹窗
        createManualPasteModal();

        // 绑定进度胶囊关闭按钮事件
        const capsuleCloseBtn = document.getElementById('tou-capsule-close-btn');
        capsuleCloseBtn.addEventListener('click', () => {
            closeProgressModal();
        });
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
                    <button id="tou-settings-close" title="关闭"><span class="tou-icon">${ICONS.close}</span></button>
                </div>

                <div id="tou-settings-body">
                    <!-- AI 设置（可折叠） -->
                    <div class="tou-collapsible-section">
                        <div class="tou-collapsible-header" id="tou-ai-settings-toggle">
                            <h3>AI 设置</h3>
                            <span class="tou-icon tou-collapsible-toggle">${ICONS.chevronDown}</span>
                        </div>
                        <div class="tou-collapsible-content" id="tou-ai-settings-content">
                            <div class="tou-collapsible-body">
                                <div class="tou-form-row">
                                    <div class="tou-form-group">
                                        <label for="tou-api-provider">API 提供商</label>
                                        <select id="tou-api-provider">
                                            <option value="openai">OpenAI</option>
                                            <option value="claude">Claude</option>
                                            <option value="gemini">Gemini</option>
                                            <option value="deepseek">DeepSeek</option>
                                            <option value="custom">自定义</option>
                                        </select>
                                    </div>

                                    <div class="tou-form-group">
                                        <label for="tou-model">模型</label>
                                        <select id="tou-model">
                                            <option value="gpt-5-mini">GPT-5 mini（推荐）</option>
                                            <option value="gpt-5">GPT-5</option>
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

                                <div class="tou-form-group">
                                    <label for="tou-max-retry">纠错次数</label>
                                    <select id="tou-max-retry">
                                        <option value="1">1 次</option>
                                        <option value="2">2 次（默认）</option>
                                        <option value="3">3 次</option>
                                        <option value="4">4 次</option>
                                        <option value="5">5 次</option>
                                    </select>
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

        // 加载纠错次数
        document.getElementById('tou-max-retry').value = currentConfig.maxRetryCount || 2;

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
            maxRetryCount: parseInt(document.getElementById('tou-max-retry').value, 10) || 2,
            enableImage: document.getElementById('tou-enable-image').checked
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
                ToastHelper.warning('请填写自定义模型名称');
                return;
            }

            // 验证配置
            const validation = Config.validate(newConfig);
            if (!validation.isValid) {
                console.error('[设置面板] 配置验证失败:', validation.errors.join(', '));
                ToastHelper.warning(validation.errors[0]);
                return;
            }

            // 保存配置
            Config.save(newConfig);
            currentConfig = newConfig;

            console.log('[设置面板] 配置已保存', newConfig);
            ToastHelper.success('设置已保存');
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
                    <button class="tou-modal-close" id="tou-modal-close-btn" title="关闭"><span class="tou-icon">${ICONS.close}</span></button>
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
                console.log('%c[手动粘贴弹窗] 粘贴成功', 'color: #38ef7d; font-weight: bold;');
                // 延迟关闭弹窗，让用户看到粘贴效果
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 300);
            } else {
                console.error('%c[手动粘贴弹窗] 粘贴失败', 'color: #f45c43; font-weight: bold;');
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

    // === 打开进度胶囊 ====================
    function openProgressModal() {
        const capsule = document.getElementById('tou-progress-capsule');
        const settingsPanel = document.getElementById('tou-settings-panel');
        const pasteModal = document.getElementById('tou-manual-paste-modal');

        // 关闭其他弹窗
        if (settingsPanel && settingsPanel.classList.contains('show')) {
            settingsPanel.classList.remove('show');
        }
        if (pasteModal && pasteModal.classList.contains('show')) {
            pasteModal.classList.remove('show');
        }

        // 重置状态
        capsule.className = 'working show';

        const icon = capsule.querySelector('.tou-capsule-icon');
        icon.innerHTML = ICONS.sync;

        const text = capsule.querySelector('.tou-capsule-text');
        text.textContent = '准备中';

        // 重置所有步骤点
        for (let i = 1; i <= 5; i++) {
            const dot = document.getElementById(`capsule-dot-${i}`);
            if (dot) dot.className = 'tou-capsule-dot';
        }

        // 隐藏关闭按钮
        const closeBtn = document.getElementById('tou-capsule-close-btn');
        closeBtn.classList.add('hidden');

        console.log('[进度胶囊] 已打开');
    }

    // === 关闭进度胶囊 ====================
    function closeProgressModal() {
        const capsule = document.getElementById('tou-progress-capsule');
        capsule.classList.remove('show');
        console.log('[进度胶囊] 已关闭');
    }

    // === 步骤名称映射 ====================
    const STEP_NAMES = {
        1: '识别题目',
        2: 'AI思考中',
        3: '粘贴答案',
        4: '自动提交',
        5: '自动纠错'
    };

    // === 更新进度 ====================
    /**
     * @param {number} stepNumber - 步骤编号 (1-5)
     * @param {string} status - 状态: 'active' | 'completed' | 'error'
     * @param {string} message - 可选的自定义消息
     */
    function updateProgress(stepNumber, status, message = '') {
        const capsule = document.getElementById('tou-progress-capsule');
        if (!capsule) return;

        const icon = capsule.querySelector('.tou-capsule-icon');
        const text = capsule.querySelector('.tou-capsule-text');
        const dot = document.getElementById(`capsule-dot-${stepNumber}`);

        // 更新步骤点状态
        if (dot) {
            dot.className = `tou-capsule-dot ${status}`;
        }

        // 更新整体状态
        if (status === 'active') {
            capsule.className = 'working show';
            icon.innerHTML = ICONS.sync;
            text.textContent = message || STEP_NAMES[stepNumber] || '处理中';
        } else if (status === 'completed') {
            // 检查是否是最后一步
            if (stepNumber === 5) {
                capsule.className = 'success show';
                icon.innerHTML = ICONS.checkCircle;
                text.textContent = message || '完成';
                // 显示关闭按钮
                const closeBtn = document.getElementById('tou-capsule-close-btn');
                closeBtn.classList.remove('hidden');
            } else {
                // 非最后一步，保持 working 状态
                icon.innerHTML = ICONS.sync;
            }
        } else if (status === 'error') {
            capsule.className = 'error show';
            icon.innerHTML = ICONS.error;
            text.textContent = message || '失败';
            // 显示关闭按钮
            const closeBtn = document.getElementById('tou-capsule-close-btn');
            closeBtn.classList.remove('hidden');
        }

        console.log(`[进度胶囊] 步骤 ${stepNumber} - ${status}${message ? ': ' + message : ''}`);
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
