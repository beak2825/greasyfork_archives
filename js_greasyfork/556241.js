// ==UserScript==
// @name         AI 对话助手(一键同步多模型)
// @name:zh-CN   AI 对话助手(一键同步多模型)
// @name:en      AI Chat Assistant (One-click Sync Multi-Model)
// @namespace    https://github.com/YHangbin
// @version      2.0
// @description  拒绝复制粘贴！一键将你的问题分发给 ChatGPT、Claude、Gemini、豆包、Kimi 等所有 AI 模型。在任意 AI 网站提问，脚本会自动将问题同步到其他已打开的 AI 标签页。助你快速横向对比模型效果，效率提升 10 倍。
// @description:en  Do not copy and paste! Sync your questions to ChatGPT、 Claude、 Gemini、 Doubao、 Kimi and other AI models with one click.
// @author       Gemini 3 Pro & User
// @match        https://doubao.com/chat/*
// @match        https://www.doubao.com/chat/*
// @match        https://chat.qwen.ai/*
// @match        https://qianwen.com/*
// @match        https://www.qianwen.com/*
// @match        https://aistudio.google.com/*
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://chat.deepseek.com/*
// @match        https://kimi.com/*
// @match        https://www.kimi.com/*
// @match        https://claude.ai/*
// @match        https://grok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556241/AI%20%E5%AF%B9%E8%AF%9D%E5%8A%A9%E6%89%8B%28%E4%B8%80%E9%94%AE%E5%90%8C%E6%AD%A5%E5%A4%9A%E6%A8%A1%E5%9E%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556241/AI%20%E5%AF%B9%E8%AF%9D%E5%8A%A9%E6%89%8B%28%E4%B8%80%E9%94%AE%E5%90%8C%E6%AD%A5%E5%A4%9A%E6%A8%A1%E5%9E%8B%29.meta.js
// ==/UserScript==

/*
 * =================================================================================================
 * --- v2.0 功能简介与使用说明 (基于 v1.2.16 稳定版内核) ---
 *
 * 【AI 对话助手(一键同步多模型)】
 *
 * 核心目标：拒绝复制粘贴，实现“一处提问，多处同步”。
 *
 * 核心亮点:
 * 1. 光速同步: 在一个页面输入，所有选中的模型即刻响应。
 * 2. 智能双向同步: 不分“主次”，任何聊天窗口都可作为控制台。开启“同步选择状态”后体验更佳。
 * 3. 原生体验: 使用网站原生输入框，保留文件上传等所有富文本功能。
 * 4. 高度可定制: 提供设置面板，可自定义常用模型、动画效果和同步逻辑。
 * 5. 精美 UI: 悬浮球拥有谷歌 AI 同款动态彩虹光环，视觉反馈生动有趣。
 *
 * 简易使用说明:
 * 1. 打开面板: 点击页面右下角的【悬浮球】图标。
 * 2. 选择目标:
 *    - 在面板中点击模型名称（如“Kimi”）即可选中/取消。
 *    - 点击【全选】图标可一键选中/取消所有可见模型。
 * 3. 高级设置: 点击面板标题旁的【齿轮】图标，可进行个性化设置。
 * 4. 发送问题: 在当前页面的输入框正常提问并发送，脚本将自动分发给所有“已选中”的目标。
 *
 * 开发者提示:
 * - 想要添加对新 AI 网站的支持吗？过程很简单，只需在代码的 `config.SITES` 对象中，
 *   仿照现有格式添加一个新的网站配置即可。欢迎大家贡献代码！
 *
 * 维护说明:
 * - 本脚本为个人兴趣项目，随缘更新，主要看心情和灵感。感谢理解！
 * =================================================================================================
 */

(function () {
    'use strict';

    const AITabSync = {
        // --- 1. State Management ---
        state: {
            thisSite: null,
            visibleTargets: [],
            selectedTargets: new Set(),
            isLoggingEnabled: false,
            isSubmitting: false,
            isProcessingTask: false,
            menuCommandId: null,
            tooltipTimeoutId: null,
            animationStyle: 'spin',
            isSelectionSynced: true,
        },

        // --- 2. Configuration ---
        config: {
            SCRIPT_VERSION: '2.0',
            KEYS: {
                SHARED_QUERY: 'multi_sync_query_v1.0',
                ACTIVE_TABS: 'multi_sync_active_tabs_v1.0',
                LOGGING_ENABLED: 'multi_sync_logging_v1.0',
                VISIBLE_TARGETS: 'multi_sync_visible_targets_v1.0',
                ANIMATION_STYLE: 'multi_sync_animation_style_v1.0',
                SELECTION_SYNC_ENABLED: 'multi_sync_selection_sync_v1.0',
                SHARED_SELECTION: 'multi_sync_shared_selection_v1.0',
            },
            TIMINGS: {
                HEARTBEAT_INTERVAL: 5000,
                STALE_THRESHOLD: 15000,
                CLEANUP_INTERVAL: 10000,
                SUBMIT_TIMEOUT: 20000,
                HUMAN_LIKE_DELAY: 500,
                FRESHNESS_THRESHOLD: 5000,
                TOOLTIP_DELAY: 300,
            },
            DISPLAY_ORDER: ['AI_STUDIO', 'GEMINI', 'TONGYI', 'QWEN', 'YUANBAO', 'CHATGPT', 'CLAUDE', 'DOUBAO', 'DEEPSEEK', 'KIMI', 'GROK'],
            SITES: {
                GROK: {
                    id: 'GROK',
                    name: 'Grok',
                    host: 'grok.com',
                    url: 'https://grok.com/',
                    apiPaths: ['/rest/app-chat/conversations/'],
                    inputSelectors: ['div.tiptap.ProseMirror'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.message || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                CLAUDE: {
                    id: 'CLAUDE',
                    name: 'Claude',
                    host: 'claude.ai',
                    url: 'https://claude.ai/new',
                    apiPaths: ['/api/organizations/', '/completion'],
                    inputSelectors: ['div[contenteditable="true"][role="textbox"]'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.prompt || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                KIMI: {
                    id: 'KIMI',
                    name: 'Kimi',
                    host: 'kimi.com',
                    url: 'https://www.kimi.com/',
                    apiPaths: ['/apiv2/kimi.gateway.chat.v1.ChatService/Chat'],
                    inputSelectors: ['[data-lexical-editor="true"]'],
                    queryExtractor: (body) => {
                        try {
                            const first = body.indexOf('{'),
                                last = body.lastIndexOf('}');
                            if (first === -1 || last < first) return '';
                            return JSON.parse(body.substring(first, last + 1))?.message?.blocks?.[0]?.text?.content || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                GEMINI: {
                    id: 'GEMINI',
                    name: 'Gemini',
                    host: 'gemini.google.com',
                    url: 'https://gemini.google.com/app',
                    apiPaths: ['/StreamGenerate'],
                    inputSelectors: ['div.ql-editor[contenteditable="true"]'],
                    queryExtractor: (body) => {
                        try {
                            const p = new URLSearchParams(body);
                            const f = p.get('f.req');
                            if (!f) return '';
                            return JSON.parse(JSON.parse(f)?.[1])?.[0]?.[0] || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                YUANBAO: {
                    id: 'YUANBAO',
                    name: '元宝',
                    host: 'yuanbao.tencent.com',
                    url: 'https://yuanbao.tencent.com/',
                    apiPaths: ['/api/chat/'],
                    inputSelectors: ['.ql-editor[contenteditable="true"]'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.prompt || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                DEEPSEEK: {
                    id: 'DEEPSEEK',
                    name: 'DeepSeek',
                    host: 'chat.deepseek.com',
                    url: 'https://chat.deepseek.com/',
                    apiPaths: ['/api/v0/chat/completion'],
                    inputSelectors: ['textarea[placeholder="给 DeepSeek 发送消息 "]'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.prompt || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                DOUBAO: {
                    id: 'DOUBAO',
                    name: '豆包',
                    host: 'doubao.com',
                    url: 'https://www.doubao.com/chat/',
                    apiPaths: ['/chat/completion', '/samantha/chat/completion'],
                    inputSelectors: ['textarea[data-testid="chat_input_input"]', 'textarea'],
                    queryExtractor: (body) => {
                        try {
                            const json = JSON.parse(body);
                            const msgs = json.messages;
                            if (!msgs || msgs.length === 0) return '';
                            const lastMsg = msgs[msgs.length - 1];
                            if (lastMsg.content_block && Array.isArray(lastMsg.content_block)) {
                                for (const block of lastMsg.content_block) {
                                    if (block.content && block.content.text_block && block.content.text_block.text) {
                                        return block.content.text_block.text;
                                    }
                                }
                            }
                            if (lastMsg.content) {
                                if (typeof lastMsg.content === 'string') {
                                    try {
                                        const inner = JSON.parse(lastMsg.content);
                                        if (inner.text) return inner.text;
                                    } catch (e) {}
                                    return lastMsg.content;
                                }
                            }
                            return '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                QWEN: {
                    id: 'QWEN',
                    name: 'Qwen',
                    host: 'chat.qwen.ai',
                    url: 'https://chat.qwen.ai/',
                    apiPaths: ['/api/v2/chat/completions'],
                    inputSelectors: ['textarea#chat-input', 'textarea[data-testid="yuntu-textarea"]'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.messages?.slice(-1)?.[0]?.content || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                TONGYI: {
                    id: 'TONGYI',
                    name: '千问',
                    host: 'qianwen.com',
                    url: 'https://www.qianwen.com/',
                    apiPaths: ['/dialog/conversation'],
                    inputSelectors: ['div[class*="textareaWrap"] textarea', 'textarea[class*="ant-input"]'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.contents?.[0]?.content || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                AI_STUDIO: {
                    id: 'AI_STUDIO',
                    name: 'AI Studio',
                    host: 'aistudio.google.com',
                    url: 'https://aistudio.google.com/prompts/new_chat',
                    apiPaths: ['/GenerateContent'],
                    inputSelectors: ['ms-autosize-textarea textarea'],
                    queryExtractor: (body) => {
                        try {
                            const j = JSON.parse(body);
                            const m = j?.[1];
                            if (Array.isArray(m)) {
                                for (let i = m.length - 1; i >= 0; i--) {
                                    if (Array.isArray(m[i]) && m[i][1] === 'user') return m[i][0]?.[0]?.[1] || '';
                                }
                            }
                            return '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
                CHATGPT: {
                    id: 'CHATGPT',
                    name: 'ChatGPT',
                    host: 'chatgpt.com',
                    url: 'https://chatgpt.com/',
                    apiPaths: ['/backend-api/conversation', '/backend-api/f/conversation'],
                    inputSelectors: ['#prompt-textarea'],
                    queryExtractor: (body) => {
                        try {
                            return JSON.parse(body)?.messages?.slice(-1)?.[0]?.content?.parts?.[0] || '';
                        } catch (e) {
                            return '';
                        }
                    },
                },
            },
        },

        // --- 3. Cached Elements ---
        elements: {
            container: null,
            fab: null,
            chipsContainer: null,
            settingsModal: null,
            tooltip: null,
        },

        // --- 4. Utility Methods ---
        utils: {
            log(message, ...optionalParams) {
                if (!AITabSync.state.isLoggingEnabled || typeof console === 'undefined') return;
                console.log(`%c[AI Sync v${AITabSync.config.SCRIPT_VERSION}] ${message}`, 'color: #1976D2; font-weight: bold;', ...optionalParams);
            },
            waitFor(conditionFn, timeout, description) {
                return new Promise((resolve, reject) => {
                    let result = conditionFn();
                    if (result) return resolve(result);
                    let timeoutId = null;
                    const observer = new MutationObserver(() => {
                        result = conditionFn();
                        if (result) {
                            if (timeoutId) clearTimeout(timeoutId);
                            observer.disconnect();
                            resolve(result);
                        }
                    });
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                    });
                    timeoutId = setTimeout(() => {
                        observer.disconnect();
                        const lastResult = conditionFn();
                        lastResult ? resolve(lastResult) : reject(new Error(`waitFor timed out after ${timeout}ms for: ${description}`));
                    }, timeout);
                });
            },
            deepQuerySelector(selector, root = document) {
                try {
                    const el = root.querySelector(selector);
                    if (el) return el;
                } catch (e) {}
                for (const host of root.querySelectorAll('*')) {
                    if (host.shadowRoot) {
                        const found = AITabSync.utils.deepQuerySelector(selector, host.shadowRoot);
                        if (found) return found;
                    }
                }
                return null;
            },
            getCurrentSiteInfo() {
                const { SITES } = AITabSync.config;
                const currentHost = window.location.hostname;
                if (currentHost.includes('chatgpt.com')) return SITES.CHATGPT;
                for (const siteKey in SITES) {
                    if (Object.prototype.hasOwnProperty.call(SITES, siteKey) && currentHost.includes(SITES[siteKey].host)) return SITES[siteKey];
                }
                return null;
            },
            simulateInput(element, value) {
                element.focus();
                const siteId = AITabSync.state.thisSite?.id;
                if (siteId === 'GROK') {
                    const dt = new DataTransfer();
                    dt.setData('text/plain', value);
                    element.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
                } else if (siteId === 'KIMI') {
                    element.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, composed: true, inputType: 'insertText', data: value }));
                } else if (element.isContentEditable || element.contentEditable === 'true') {
                    if (siteId === 'CLAUDE') {
                        element.innerHTML = '';
                        const p = document.createElement('p');
                        p.textContent = value;
                        element.appendChild(p);
                    } else {
                        element.textContent = value;
                    }
                    element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                } else if (element.tagName === 'TEXTAREA') {
                    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    valueSetter.call(element, value);
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
        },

        // --- 5. UI Module (CSP Safe) ---
        ui: {
            injectStyle() {
                GM_addStyle(`
                    :root {
                        --ai-g-blue: #1a73e8;
                        --ai-g-red: #ea4335;
                        --ai-g-yellow: #fbbc04;
                        --ai-g-green: #34a853;
                    }
                    @keyframes ae-fg {
                        0% { opacity: 0; }
                        30% { opacity: 1; }
                        50% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                    @keyframes ae-rg {
                        from { transform: translate(-50%, -50%) rotate(0deg); }
                        to { transform: translate(-50%, -50%) rotate(180deg); }
                    }
                    @keyframes ai-breathe {
                        0%, 100% { opacity: 0.35; }
                        50% { opacity: 0.6; }
                    }
                    @keyframes ai-spin-sending {
                        from { transform: translate(-50%, -50%) rotate(0deg); }
                        to { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    @property --ai-border-angle {
                        syntax: '<angle>';
                        initial-value: 0deg;
                        inherits: false;
                    }
                    @keyframes ai-border-rotate-once {
                        0% { --ai-border-angle: 0deg; opacity: 1; }
                        85% { opacity: 1; }
                        100% { --ai-border-angle: 360deg; opacity: 0; }
                    }
                    @keyframes ae-zoom-in {
                        from { transform: scale(0.92); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    @keyframes ai-spin-slow-infinite {
                        from { transform: translate(-50%, -50%) rotate(0deg); }
                        to { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    #ai-sync-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 99998;
                        display: flex;
                        align-items: flex-end;
                        gap: 12px;
                        pointer-events: none;
                        font-family: sans-serif;
                    }
                    #ai-sync-container.expanded {
                        pointer-events: auto;
                    }
                    #ai-sync-toggle-fab {
                        position: relative;
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        padding: 0;
                        pointer-events: auto;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                        transition: transform 0.2s, box-shadow 0.2s;
                        overflow: visible;
                        --mouse-angle: 180deg;
                    }
                    #ai-sync-toggle-fab:hover {
                        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                        transform: scale(1.08);
                    }
                    .ai-visual-clipper {
                        position: absolute;
                        inset: 0;
                        border-radius: 50%;
                        overflow: hidden;
                        z-index: 0;
                    }
                    .ai-gradient-layer {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 200%;
                        height: 200%;
                        background: conic-gradient(#3186ff00 0deg, #34a853 43deg, #ffd314 65deg, #ff4641 105deg, #3186ff 144deg, #3186ff 180deg, #3186ff00 324deg);
                        transform: translate(-50%, -50%) rotate(var(--mouse-angle));
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 400ms linear, transform 0.1s linear;
                    }
                    .ai-layer-blur {
                        filter: blur(2px);
                        opacity: 0;
                    }
                    .ai-layer-sharp {
                        filter: blur(0px);
                        opacity: 0;
                    }
                    #ai-sync-toggle-fab.intro-playing.animation-aurora .ai-gradient-layer {
                        animation: ae-fg 2000ms linear backwards, ae-rg 2000ms cubic-bezier(0.20, 0.00, 0.00, 1.00) backwards;
                    }
                    #ai-sync-toggle-fab.intro-playing.animation-spin .ai-gradient-layer {
                        opacity: 0.5;
                        animation: ai-spin-slow-infinite 8s linear infinite;
                    }
                    #ai-sync-toggle-fab:not(.intro-playing):hover .ai-layer-blur {
                        opacity: 0.35;
                        animation: ai-breathe 3s infinite alternate;
                    }
                    #ai-sync-toggle-fab:not(.intro-playing):hover .ai-layer-sharp {
                        opacity: 1;
                    }
                    #ai-sync-toggle-fab.sending .ai-gradient-layer,
                    #ai-sync-toggle-fab.sending:hover .ai-gradient-layer {
                        opacity: 1 !important;
                        animation: ai-spin-sending 1s linear infinite !important;
                        transition: opacity 0.2s;
                    }
                    .ai-inner-mask {
                        position: absolute;
                        inset: 2px;
                        background: #fff;
                        border-radius: 50%;
                        z-index: 1;
                        transition: filter 1s cubic-bezier(0,0,0,1);
                    }
                    .ai-inner-mask::after {
                        content: '';
                        position: absolute;
                        inset: -1px;
                        border-radius: 50%;
                        border: 1px solid #dadce0;
                        transition: opacity 0.2s;
                    }
                    #ai-sync-toggle-fab:hover .ai-inner-mask::after,
                    #ai-sync-toggle-fab.sending .ai-inner-mask::after {
                        opacity: 0;
                    }
                    .ai-icon-wrapper {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 2;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                    }
                    .ai-icon-wrapper svg {
                        width: 100%;
                        height: 100%;
                        color: #5f6368;
                        transition: color 0.3s;
                    }
                    #ai-sync-toggle-fab:hover svg,
                    #ai-sync-toggle-fab.sending svg {
                        color: var(--ai-g-blue);
                    }
                    .ai-sync-fab-badge {
                        position: absolute;
                        top: -4px;
                        right: -4px;
                        background: linear-gradient(135deg, #00c6ff, #0072ff);
                        color: white;
                        border-radius: 10px;
                        padding: 0 5px;
                        font-size: 10px;
                        font-weight: bold;
                        min-width: 16px;
                        line-height: 16px;
                        text-align: center;
                        z-index: 10;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                    }
                    #ai-sync-content-panel {
                        display: inline-block;
                        background: rgba(255,255,255,0.98);
                        backdrop-filter: blur(12px);
                        border: 1px solid #dadce0;
                        border-radius: 16px;
                        padding: 12px 16px;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                        opacity: 0;
                        transform: translateX(15px);
                        visibility: hidden;
                        margin-bottom: 4px;
                        transition: all 0.2s;
                        position: relative;
                        z-index: 1;
                    }
                    #ai-sync-container.expanded #ai-sync-content-panel {
                        opacity: 1;
                        transform: translateX(0);
                        visibility: visible;
                        border-color: transparent;
                    }
                    #ai-sync-container.expanded #ai-sync-content-panel::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        border-radius: 16px;
                        padding: 2px;
                        background: conic-gradient(from var(--ai-border-angle), transparent 0%, transparent 60%, var(--ai-g-blue) 80%, var(--ai-g-red) 86%, var(--ai-g-yellow) 92%, var(--ai-g-green) 98%, transparent 100%);
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        animation: ai-border-rotate-once 0.8s linear forwards;
                        pointer-events: none;
                        z-index: 10;
                    }
                    #ai-sync-panel-title-wrapper {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #f1f3f4;
                    }
                    #ai-sync-panel-title {
                        font-weight: 600;
                        font-size: 15px;
                        color: #202124;
                        flex-grow: 1;
                    }
                    #ai-sync-select-all-btn,
                    #ai-sync-settings-btn {
                        all: unset;
                        cursor: pointer;
                        color: #5f6368;
                        padding: 4px;
                        border-radius: 50%;
                        transition: background 0.2s, color 0.2s;
                        display: flex;
                        flex-shrink: 0;
                    }
                    #ai-sync-select-all-btn:hover,
                    #ai-sync-settings-btn:hover {
                        color: #202124;
                        background-color: #f1f3f4;
                    }
                    #ai-sync-chips-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        max-width: 260px;
                    }
                    #ai-sync-chips-container > i {
                        flex-grow: 1;
                    }
                    .ai-sync-chip {
                        all: unset;
                        box-sizing: border-box;
                        cursor: pointer;
                        padding: 6px 12px;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 500;
                        border: 1px solid #dadce0;
                        color: #5f6368;
                        background-color: #fff;
                        transition: all 0.2s ease;
                        flex-grow: 1;
                        text-align: center;
                    }
                    .ai-sync-chip:hover {
                        background-color: #f8f9fa;
                        border-color: #dadce0;
                        color: #202124;
                    }
                    .ai-sync-chip.online {
                        border-color: var(--ai-g-blue);
                        color: var(--ai-g-blue);
                        background: #f1f8ff;
                    }
                    .ai-sync-chip.selected {
                        background-color: var(--ai-g-blue);
                        border-color: var(--ai-g-blue);
                        color: white;
                        box-shadow: 0 1px 2px rgba(26,115,232,0.3);
                    }
                    #ai-sync-settings-overlay {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(0,0,0,0.5);
                        backdrop-filter: blur(4px);
                        z-index: 99999;
                        justify-content: center;
                        align-items: center;
                    }
                    #ai-sync-settings-panel {
                        background: #fff;
                        border-radius: 16px;
                        width: 340px;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 0 12px 40px rgba(0,0,0,0.2);
                        overflow: hidden;
                        animation: ae-zoom-in 0.2s ease-out;
                    }
                    .ai-sync-settings-header {
                        padding: 16px 24px;
                        border-bottom: 1px solid #f1f3f4;
                        background: #fff;
                    }
                    .ai-sync-settings-title {
                        margin: 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #202124;
                    }
                    .ai-sync-settings-list {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        padding: 20px;
                        background: #fff;
                        max-height: 400px;
                        overflow-y: auto;
                    }
                    .ai-sync-settings-item label {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        font-size: 14px;
                        color: #3c4043;
                        padding: 10px 12px;
                        border-radius: 8px;
                        background-color: #f8f9fa;
                        transition: background 0.2s;
                        user-select: none;
                    }
                    .ai-sync-settings-item label:hover {
                        background-color: #e8f0fe;
                        color: #1967d2;
                    }
                    .ai-sync-settings-item input[type="checkbox"] {
                        appearance: none;
                        -webkit-appearance: none;
                        width: 20px;
                        height: 20px;
                        border: 2px solid #5f6368;
                        border-radius: 4px;
                        margin-right: 12px;
                        position: relative;
                        flex-shrink: 0;
                        transition: all 0.2s;
                        background: #fff;
                        cursor: pointer;
                    }
                    .ai-sync-settings-item input[type="checkbox"]:checked {
                        background-color: var(--ai-g-blue);
                        border-color: var(--ai-g-blue);
                    }
                    .ai-sync-settings-item input[type="checkbox"]:checked::after {
                        content: '';
                        position: absolute;
                        left: 6px;
                        top: 2px;
                        width: 5px;
                        height: 10px;
                        border: solid white;
                        border-width: 0 2px 2px 0;
                        transform: rotate(45deg);
                        display: block;
                    }
                    .ai-sync-settings-divider {
                        border: none;
                        height: 1px;
                        background-color: #f1f3f4;
                        margin: 0 20px;
                    }
                    .ai-sync-settings-uigroup {
                        padding: 10px 20px;
                        background: #fff;
                    }
                    .ai-sync-settings-toggle {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .ai-sync-settings-toggle > span {
                        font-size: 14px;
                        color: #3c4043;
                        cursor: default;
                    }
                    .toggle-switch {
                        position: relative;
                        display: inline-block;
                        width: 38px;
                        height: 22px;
                    }
                    .toggle-switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .toggle-switch-track {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #ccc;
                        transition: .4s;
                        border-radius: 22px;
                    }
                    .toggle-switch-thumb {
                        position: absolute;
                        content: '';
                        height: 18px;
                        width: 18px;
                        left: 2px;
                        bottom: 2px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }
                    input:checked + .toggle-switch-track {
                        background-color: var(--ai-g-blue);
                    }
                    input:checked + .toggle-switch-track .toggle-switch-thumb {
                        transform: translateX(16px);
                    }
                    #ai-sync-custom-tooltip {
                        display: none;
                        position: fixed;
                        background: rgba(32,33,36,0.9);
                        color: #fff;
                        padding: 6px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        z-index: 100000;
                        pointer-events: none;
                        transform: translate(-50%, -100%);
                        margin-top: -8px;
                        white-space: nowrap;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    }
                `);
            },
            createMainPanel() {
                if (document.getElementById('ai-sync-container')) return;
                const { elements } = AITabSync;
                const svgNS = 'http://www.w3.org/2000/svg';
                elements.container = document.createElement('div');
                elements.container.id = 'ai-sync-container';
                const panel = document.createElement('div');
                panel.id = 'ai-sync-content-panel';
                const titleWrapper = document.createElement('div');
                titleWrapper.id = 'ai-sync-panel-title-wrapper';
                const title = document.createElement('span');
                title.id = 'ai-sync-panel-title';
                title.textContent = '发送给:';
                titleWrapper.appendChild(title);
                const selectAllBtn = document.createElement('button');
                selectAllBtn.id = 'ai-sync-select-all-btn';
                selectAllBtn.title = '全选';
                const saSvg = document.createElementNS(svgNS, 'svg');
                saSvg.setAttribute('width', '20');
                saSvg.setAttribute('height', '20');
                saSvg.setAttribute('viewBox', '0 0 24 24');
                saSvg.setAttribute('fill', 'currentColor');
                const saPath = document.createElementNS(svgNS, 'path');
                saPath.setAttribute('d', 'M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5-4v4h13V5H8zm0 5h13v-4H8v4zm0 5h13v-4H8v4z');
                saSvg.appendChild(saPath);
                selectAllBtn.appendChild(saSvg);
                titleWrapper.appendChild(selectAllBtn);
                const settingsBtn = document.createElement('button');
                settingsBtn.id = 'ai-sync-settings-btn';
                settingsBtn.title = '自定义常用模型';
                const setSvg = document.createElementNS(svgNS, 'svg');
                setSvg.setAttribute('width', '20');
                setSvg.setAttribute('height', '20');
                setSvg.setAttribute('viewBox', '0 0 24 24');
                setSvg.setAttribute('fill', 'currentColor');
                const setPath = document.createElementNS(svgNS, 'path');
                setPath.setAttribute('d', 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z');
                setSvg.appendChild(setPath);
                settingsBtn.appendChild(setSvg);
                titleWrapper.appendChild(settingsBtn);
                panel.appendChild(titleWrapper);
                elements.chipsContainer = this.buildChipsContainer();
                panel.appendChild(elements.chipsContainer);
                elements.fab = document.createElement('button');
                elements.fab.id = 'ai-sync-toggle-fab';
                elements.fab.title = 'AI 对话助手';
                elements.fab.classList.add('intro-playing');
                const clipper = document.createElement('div');
                clipper.className = 'ai-visual-clipper';
                const blurLayer = document.createElement('div');
                blurLayer.className = 'ai-gradient-layer ai-layer-blur';
                const sharpLayer = document.createElement('div');
                sharpLayer.className = 'ai-gradient-layer ai-layer-sharp';
                const innerMask = document.createElement('div');
                innerMask.className = 'ai-inner-mask';
                const iconWrapper = document.createElement('div');
                iconWrapper.className = 'ai-icon-wrapper';
                const fabSvg = document.createElementNS(svgNS, 'svg');
                fabSvg.setAttribute('viewBox', '0 0 24 24');
                fabSvg.setAttribute('fill', 'none');
                fabSvg.setAttribute('stroke', 'currentColor');
                fabSvg.setAttribute('stroke-width', '1.5');
                fabSvg.setAttribute('stroke-linecap', 'round');
                fabSvg.setAttribute('stroke-linejoin', 'round');
                const fabRect = document.createElementNS(svgNS, 'rect');
                fabRect.setAttribute('x', '9');
                fabRect.setAttribute('y', '9');
                fabRect.setAttribute('width', '13');
                fabRect.setAttribute('height', '13');
                fabRect.setAttribute('rx', '2');
                fabRect.setAttribute('ry', '2');
                const fabPath = document.createElementNS(svgNS, 'path');
                fabPath.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
                fabSvg.appendChild(fabRect);
                fabSvg.appendChild(fabPath);
                iconWrapper.appendChild(fabSvg);
                clipper.appendChild(blurLayer);
                clipper.appendChild(sharpLayer);
                clipper.appendChild(innerMask);
                clipper.appendChild(iconWrapper);
                elements.fab.appendChild(clipper);
                const updateAngle = (e) => {
                    const rect = elements.fab.getBoundingClientRect();
                    const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * (180 / Math.PI) + 180;
                    elements.fab.style.setProperty('--mouse-angle', `${angle}deg`);
                };
                elements.fab.addEventListener('mousemove', updateAngle);
                elements.fab.addEventListener('mouseenter', (e) => {
                    elements.fab.classList.remove('intro-playing');
                    updateAngle(e);
                });
                elements.fab.addEventListener('mouseleave', () => {
                    if (AITabSync.state.animationStyle === 'spin') {
                        AITabSync.elements.fab.classList.add('intro-playing');
                    }
                });
                elements.container.appendChild(panel);
                elements.container.appendChild(elements.fab);
                document.body.appendChild(elements.container);
            },
            createSettingsModal() {
                if (document.getElementById('ai-sync-settings-overlay')) return;
                const { config, state } = AITabSync;
                const overlay = document.createElement('div');
                overlay.id = 'ai-sync-settings-overlay';
                const panel = document.createElement('div');
                panel.id = 'ai-sync-settings-panel';
                const header = document.createElement('div');
                header.className = 'ai-sync-settings-header';
                const title = document.createElement('h2');
                title.className = 'ai-sync-settings-title';
                title.textContent = '自定义常用模型';
                header.appendChild(title);
                panel.appendChild(header);
                const list = document.createElement('div');
                list.className = 'ai-sync-settings-list';
                config.DISPLAY_ORDER.forEach((siteId) => {
                    const site = config.SITES[siteId];
                    if (!site) return;
                    const item = document.createElement('div');
                    item.className = 'ai-sync-settings-item';
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = siteId;
                    checkbox.checked = state.visibleTargets.includes(siteId);
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(site.name));
                    item.appendChild(label);
                    list.appendChild(item);
                });
                panel.appendChild(list);
                const divider = document.createElement('hr');
                divider.className = 'ai-sync-settings-divider';
                panel.appendChild(divider);
                const uiGroup = document.createElement('div');
                uiGroup.className = 'ai-sync-settings-uigroup';
                const toggleContainer = document.createElement('div');
                toggleContainer.className = 'ai-sync-settings-toggle';
                const animLabel = document.createElement('span');
                animLabel.textContent = '启用持续旋转动画';
                toggleContainer.appendChild(animLabel);
                const switchLabel = document.createElement('label');
                switchLabel.className = 'toggle-switch';
                const switchInput = document.createElement('input');
                switchInput.type = 'checkbox';
                switchInput.id = 'ai-sync-animation-toggle';
                switchInput.checked = state.animationStyle === 'spin';
                const switchTrack = document.createElement('div');
                switchTrack.className = 'toggle-switch-track';
                const switchThumb = document.createElement('div');
                switchThumb.className = 'toggle-switch-thumb';
                switchTrack.appendChild(switchThumb);
                switchLabel.appendChild(switchInput);
                switchLabel.appendChild(switchTrack);
                toggleContainer.appendChild(switchLabel);
                uiGroup.appendChild(toggleContainer);
                panel.appendChild(uiGroup);
                const uiGroupSync = document.createElement('div');
                uiGroupSync.className = 'ai-sync-settings-uigroup';
                const toggleContainerSync = document.createElement('div');
                toggleContainerSync.className = 'ai-sync-settings-toggle';
                const syncLabel = document.createElement('span');
                syncLabel.textContent = '同步选择状态';
                toggleContainerSync.appendChild(syncLabel);
                const switchLabelSync = document.createElement('label');
                switchLabelSync.className = 'toggle-switch';
                const switchInputSync = document.createElement('input');
                switchInputSync.type = 'checkbox';
                switchInputSync.id = 'ai-sync-selection-sync-toggle';
                switchInputSync.checked = state.isSelectionSynced;
                const switchTrackSync = document.createElement('div');
                switchTrackSync.className = 'toggle-switch-track';
                const switchThumbSync = document.createElement('div');
                switchThumbSync.className = 'toggle-switch-thumb';
                switchTrackSync.appendChild(switchThumbSync);
                switchLabelSync.appendChild(switchInputSync);
                switchLabelSync.appendChild(switchTrackSync);
                toggleContainerSync.appendChild(switchLabelSync);
                uiGroupSync.appendChild(toggleContainerSync);
                panel.appendChild(uiGroupSync);
                overlay.appendChild(panel);
                document.body.appendChild(overlay);
                AITabSync.elements.settingsModal = overlay;
            },
            createTooltip() {
                if (document.getElementById('ai-sync-custom-tooltip')) return;
                AITabSync.elements.tooltip = document.createElement('div');
                AITabSync.elements.tooltip.id = 'ai-sync-custom-tooltip';
                document.body.appendChild(AITabSync.elements.tooltip);
            },
            buildChipsContainer() {
                const { config, state } = AITabSync;
                const container = document.createElement('div');
                container.id = 'ai-sync-chips-container';
                config.DISPLAY_ORDER.filter((id) => state.visibleTargets.includes(id) && id !== state.thisSite.id).forEach((siteId) => {
                    const site = config.SITES[siteId];
                    if (!site) return;
                    const chip = document.createElement('button');
                    chip.className = 'ai-sync-chip';
                    chip.dataset.siteId = site.id;
                    chip.textContent = site.name;
                    container.appendChild(chip);
                });
                container.appendChild(document.createElement('i'));
                container.appendChild(document.createElement('i'));
                return container;
            },
            async rebuildChipsUI() {
                const { elements } = AITabSync;
                const oldContainer = elements.chipsContainer || document.getElementById('ai-sync-chips-container');
                if (oldContainer && oldContainer.parentElement) {
                    const newContainer = this.buildChipsContainer();
                    oldContainer.parentElement.replaceChild(newContainer, oldContainer);
                    elements.chipsContainer = newContainer;
                    await this.updatePanelState();
                    this.updateSelectAllButtonState();
                }
            },
            async updatePanelState() {
                const activeTabs = JSON.parse(await GM_getValue(AITabSync.config.KEYS.ACTIVE_TABS, '{}'));
                document.querySelectorAll('.ai-sync-chip').forEach((chip) => {
                    const siteId = chip.dataset.siteId;
                    chip.classList.toggle('online', !!activeTabs[siteId]);
                    chip.classList.toggle('selected', AITabSync.state.selectedTargets.has(siteId));
                });
                this.updateFabBadge();
            },
            updateFabBadge() {
                const { fab } = AITabSync.elements;
                if (!fab) return;
                const targetsWithoutSelf = Array.from(AITabSync.state.selectedTargets).filter(id => id !== AITabSync.state.thisSite.id);
                const count = targetsWithoutSelf.length;
                let badge = fab.querySelector('.ai-sync-fab-badge');
                if (count > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'ai-sync-fab-badge';
                        fab.appendChild(badge);
                    }
                    badge.textContent = count;
                } else {
                    badge?.remove();
                }
            },
            updateSelectAllButtonState() {
                const { state, config } = AITabSync;
                const btn = document.getElementById('ai-sync-select-all-btn');
                if (!btn) return;
                const visibleTargets = config.DISPLAY_ORDER.filter(id => state.visibleTargets.includes(id) && id !== state.thisSite.id);
                const allSelected = visibleTargets.length > 0 && visibleTargets.every(id => state.selectedTargets.has(id));
                btn.title = allSelected ? '全部取消' : '全选';
                btn.style.color = allSelected ? 'var(--ai-g-blue)' : '#5f6368';
            },
            togglePanelVisibility() {
                const { container } = AITabSync.elements;
                if (!container) return;
                container.classList.toggle('expanded');
                if (container.classList.contains('expanded')) {
                    this.updatePanelState();
                    this.updateSelectAllButtonState();
                    document.addEventListener('click', AITabSync.events.onClickOutside, true);
                } else {
                    document.removeEventListener('click', AITabSync.events.onClickOutside, true);
                }
            },
            updateMenuCommand() {
                const { state } = AITabSync;
                if (state.menuCommandId) GM_unregisterMenuCommand(state.menuCommandId);
                const label = state.isLoggingEnabled ? '停用调试日志' : '启用调试日志';
                state.menuCommandId = GM_registerMenuCommand(label, AITabSync.events.onToggleLogging);
            },
        },

        // --- 6. Event Handlers ---
        events: {
            register() {
                const { elements, ui } = AITabSync;
                elements.fab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    ui.togglePanelVisibility();
                });
                elements.container.addEventListener('click', this.onChipClick);
                elements.container.querySelector('#ai-sync-select-all-btn').addEventListener('click', this.onSelectAllClick);
                elements.container.querySelector('#ai-sync-settings-btn').addEventListener('click', () => {
                    if (elements.settingsModal) elements.settingsModal.style.display = 'flex';
                });
                elements.settingsModal.addEventListener('click', (e) => {
                    if (e.target === elements.settingsModal) elements.settingsModal.style.display = 'none';
                });
                elements.settingsModal.querySelector('.ai-sync-settings-list').addEventListener('change', this.onSettingsChange);
                elements.settingsModal.querySelector('#ai-sync-animation-toggle').addEventListener('change', this.onAnimationToggleChange);
                elements.settingsModal.querySelector('#ai-sync-selection-sync-toggle').addEventListener('change', this.onSelectionSyncToggleChange);
                elements.container.addEventListener('mouseover', this.onChipMouseOver, true);
                elements.container.addEventListener('mouseout', this.onChipMouseOut, true);
            },
            async onChipClick(event) {
                if (event.target.matches('.ai-sync-chip')) {
                    const { config, state, ui, utils } = AITabSync;
                    const chip = event.target;
                    const siteId = chip.dataset.siteId;
                    const siteInfo = config.SITES[siteId];
                    if (!siteInfo) return;
                    if (state.selectedTargets.has(siteId)) {
                        state.selectedTargets.delete(siteId);
                        if (state.isSelectionSynced && state.selectedTargets.size === 1 && state.selectedTargets.has(state.thisSite.id)) {
                            state.selectedTargets.clear();
                        }
                    } else {
                        state.selectedTargets.add(siteId);
                        if (state.isSelectionSynced) {
                            state.selectedTargets.add(state.thisSite.id);
                        }
                        const activeTabs = JSON.parse(await GM_getValue(config.KEYS.ACTIVE_TABS, '{}'));
                        if (!activeTabs[siteId]) {
                            utils.log(`打开新标签页: ${siteId}`);
                            window.open(siteInfo.url, `ai_sync_window_for_${siteId}`);
                        }
                    }
                    ui.updatePanelState();
                    ui.updateSelectAllButtonState();
                    if (state.isSelectionSynced) {
                        await GM_setValue(config.KEYS.SHARED_SELECTION, JSON.stringify(Array.from(state.selectedTargets)));
                    }
                } else if (event.target === AITabSync.elements.container) {
                    AITabSync.ui.togglePanelVisibility();
                }
            },
            async onSelectAllClick() {
                const { config, state, ui, utils } = AITabSync;
                const visibleTargets = config.DISPLAY_ORDER.filter(id => state.visibleTargets.includes(id) && id !== state.thisSite.id);
                const allSelected = visibleTargets.length > 0 && visibleTargets.every(id => state.selectedTargets.has(id));
                if (allSelected) {
                    state.selectedTargets.clear();
                } else {
                    const activeTabs = JSON.parse(await GM_getValue(config.KEYS.ACTIVE_TABS, '{}'));
                    visibleTargets.forEach(siteId => {
                        state.selectedTargets.add(siteId);
                        const siteInfo = config.SITES[siteId];
                        if (!activeTabs[siteId] && siteInfo) {
                            utils.log(`(全选) 打开新标签页: ${siteId}`);
                            window.open(siteInfo.url, `ai_sync_window_for_${siteId}`);
                        }
                    });
                    if (state.isSelectionSynced) {
                        state.selectedTargets.add(state.thisSite.id);
                    }
                }
                ui.updatePanelState();
                ui.updateSelectAllButtonState();
                if (state.isSelectionSynced) {
                    await GM_setValue(config.KEYS.SHARED_SELECTION, JSON.stringify(Array.from(state.selectedTargets)));
                }
            },
            async onSettingsChange(event) {
                if (event.target.type !== 'checkbox') return;
                const { config, state, ui } = AITabSync;
                const list = event.currentTarget;
                const checkboxes = list.querySelectorAll('input[type="checkbox"]:checked');
                const newVisibleTargets = Array.from(checkboxes).map((cb) => cb.value);
                await GM_setValue(config.KEYS.VISIBLE_TARGETS, newVisibleTargets);
                state.visibleTargets = newVisibleTargets;
                const oldTargets = config.DISPLAY_ORDER;
                oldTargets.forEach((id) => {
                    if (!newVisibleTargets.includes(id) && state.selectedTargets.has(id)) state.selectedTargets.delete(id);
                });
                ui.rebuildChipsUI();
            },
            async onAnimationToggleChange(event) {
                const { state, config, elements, utils } = AITabSync;
                const isSpinEnabled = event.target.checked;
                const newStyle = isSpinEnabled ? 'spin' : 'aurora';
                if (state.animationStyle === newStyle) return;
                await GM_setValue(config.KEYS.ANIMATION_STYLE, newStyle);
                state.animationStyle = newStyle;
                utils.log(`动画样式已切换为: ${newStyle}`);
                elements.fab.classList.remove('animation-aurora', 'animation-spin', 'intro-playing');
                elements.fab.classList.add(isSpinEnabled ? 'animation-spin' : 'animation-aurora');
                if (isSpinEnabled) {
                    elements.fab.classList.add('intro-playing');
                }
            },
            async onSelectionSyncToggleChange(event) {
                const { state, config, utils } = AITabSync;
                const isEnabled = event.target.checked;
                state.isSelectionSynced = isEnabled;
                await GM_setValue(config.KEYS.SELECTION_SYNC_ENABLED, isEnabled);
                utils.log(`选择状态同步已 ${isEnabled ? '开启' : '关闭'}.`);
                if (!isEnabled) {
                    GM_deleteValue(config.KEYS.SHARED_SELECTION);
                }
            },
            onClickOutside(event) {
                const { container } = AITabSync.elements;
                if (container && !container.contains(event.target) && container.classList.contains('expanded')) {
                    AITabSync.ui.togglePanelVisibility();
                }
            },
            onChipMouseOver(event) {
                if (!event.target.matches('.ai-sync-chip')) return;
                const { state, config, elements } = AITabSync;
                const chip = event.target;
                const siteId = chip.dataset.siteId;
                let tooltipText = state.selectedTargets.has(siteId) ? '已选中 (点击取消)' : (chip.classList.contains('online') ? '待发送 (点击选中)' : '点击启动');
                state.tooltipTimeoutId = setTimeout(() => {
                    elements.tooltip.textContent = tooltipText;
                    const chipRect = chip.getBoundingClientRect();
                    elements.tooltip.style.left = `${chipRect.left + chipRect.width / 2}px`;
                    elements.tooltip.style.top = `${chipRect.top}px`;
                    elements.tooltip.style.display = 'block';
                }, config.TIMINGS.TOOLTIP_DELAY);
            },
            onChipMouseOut(event) {
                if (!event.target.matches('.ai-sync-chip')) return;
                clearTimeout(AITabSync.state.tooltipTimeoutId);
                AITabSync.elements.tooltip.style.display = 'none';
            },
            async onToggleLogging() {
                const { state, ui } = AITabSync;
                state.isLoggingEnabled = !state.isLoggingEnabled;
                await GM_setValue(AITabSync.config.KEYS.LOGGING_ENABLED, state.isLoggingEnabled);
                alert(`[AI Sync] 调试日志 ${state.isLoggingEnabled ? '已开启' : '已关闭'}。`);
                ui.updateMenuCommand();
            },
        },

        // --- 7. Lifecycle & Background Tasks ---
        lifecycle: {
            ensureWindowName() {
                const { thisSite } = AITabSync.state;
                if (!thisSite) return;
                const expectedName = `ai_sync_window_for_${thisSite.id}`;
                if (window.name !== expectedName) window.name = expectedName;
            },
            deployHistoryInterceptor() {
                const { thisSite } = AITabSync.state;
                if (!thisSite) return;
                const originalPushState = history.pushState;
                const originalReplaceState = history.replaceState;
                let lastUrl = location.href;
                const handleUrlChange = () => {
                    setTimeout(() => {
                        if (location.href !== lastUrl) {
                            lastUrl = location.href;
                            this.ensureWindowName();
                            this.registerTabAsActive();
                        }
                    }, 100);
                };
                history.pushState = function (...args) {
                    originalPushState.apply(this, args);
                    handleUrlChange();
                };
                history.replaceState = function (...args) {
                    originalReplaceState.apply(this, args);
                    handleUrlChange();
                };
                window.addEventListener('popstate', handleUrlChange);
            },
            async registerTabAsActive() {
                const { thisSite } = AITabSync.state;
                if (!thisSite) return;
                try {
                    const activeTabs = JSON.parse(await GM_getValue(AITabSync.config.KEYS.ACTIVE_TABS, '{}'));
                    activeTabs[thisSite.id] = { url: window.location.href, timestamp: Date.now() };
                    await GM_setValue(AITabSync.config.KEYS.ACTIVE_TABS, JSON.stringify(activeTabs));
                } catch (e) {
                    AITabSync.utils.log('心跳注册失败:', e);
                }
            },
            async unregisterTabAsInactive() {
                const { thisSite } = AITabSync.state;
                if (!thisSite) return;
                try {
                    const key = AITabSync.config.KEYS.ACTIVE_TABS;
                    const activeTabs = JSON.parse(await GM_getValue(key, '{}'));
                    if (activeTabs[thisSite.id]) {
                        delete activeTabs[thisSite.id];
                        await GM_setValue(key, JSON.stringify(activeTabs));
                    }
                } catch (e) {}
            },
            async cleanupStaleTabs() {
                try {
                    const activeTabs = JSON.parse(await GM_getValue(AITabSync.config.KEYS.ACTIVE_TABS, '{}'));
                    const now = Date.now();
                    let hasChanged = false;
                    for (const siteId in activeTabs) {
                        if (Object.prototype.hasOwnProperty.call(activeTabs, siteId)) {
                            const tabInfo = activeTabs[siteId];
                            if (typeof tabInfo !== 'object' || tabInfo === null || now - tabInfo.timestamp > AITabSync.config.TIMINGS.STALE_THRESHOLD) {
                                delete activeTabs[siteId];
                                hasChanged = true;
                            }
                        }
                    }
                    if (hasChanged) await GM_setValue(AITabSync.config.KEYS.ACTIVE_TABS, JSON.stringify(activeTabs));
                } catch (e) {}
            },
        },

        // --- 8. Communication Module ---
        comms: {
            deployNetworkInterceptor() {
                const { thisSite } = AITabSync.state;
                if (!thisSite?.queryExtractor) return;
                const { send } = unsafeWindow.XMLHttpRequest.prototype;
                if (!send._isHooked) {
                    const { open } = unsafeWindow.XMLHttpRequest.prototype;
                    unsafeWindow.XMLHttpRequest.prototype.open = function (method, url, ...args) {
                        this._url = url;
                        return open.apply(this, [method, url, ...args]);
                    };
                    unsafeWindow.XMLHttpRequest.prototype.send = function (body) {
                        const site = AITabSync.utils.getCurrentSiteInfo();
                        if (site?.apiPaths.some((p) => this._url?.includes(p)) && body && typeof body === 'string' && !AITabSync.state.isSubmitting) {
                            const query = site.queryExtractor(body);
                            if (query) AITabSync.comms.handleQueryFound(query, site);
                        }
                        return send.apply(this, arguments);
                    };
                    unsafeWindow.XMLHttpRequest.prototype.send._isHooked = true;
                }
                const { fetch } = unsafeWindow;
                if (!fetch._isHooked) {
                    unsafeWindow.fetch = async function (...args) {
                        const site = AITabSync.utils.getCurrentSiteInfo();
                        const url = args[0] instanceof Request ? args[0].url : args[0];
                        const config = args[1] || {};
                        if (site?.apiPaths.some((p) => url.includes(p)) && (config.method || 'GET').toUpperCase() === 'POST' && !AITabSync.state.isSubmitting) {
                            try {
                                if (config.body && typeof config.body === 'string') {
                                    const query = site.queryExtractor(config.body);
                                    if (query) AITabSync.comms.handleQueryFound(query, site);
                                }
                            } catch (e) {}
                        }
                        return fetch.apply(this, args);
                    };
                    unsafeWindow.fetch._isHooked = true;
                }
            },
            async handleQueryFound(query, sourceSite) {
                const { utils, state, config, elements } = AITabSync;
                const targets = Array.from(state.selectedTargets);
                if (targets.length === 0) return;
                if (elements.fab) {
                    elements.fab.classList.add('sending');
                    setTimeout(() => elements.fab?.classList.remove('sending'), 2000);
                }
                await GM_setValue(config.KEYS.SHARED_QUERY, JSON.stringify({
                    query,
                    timestamp: Date.now(),
                    sourceId: sourceSite.id,
                    targetIds: targets
                }));
            },
            async processSharedQuery(value) {
                const { state, utils, config } = AITabSync;
                if (state.isProcessingTask || !value) return;
                state.isProcessingTask = true;
                try {
                    const data = JSON.parse(value);
                    if (!data.targetIds?.includes(state.thisSite.id) || Date.now() - data.timestamp >= config.TIMINGS.FRESHNESS_THRESHOLD) return;
                    const remainingTargets = data.targetIds.filter((id) => id !== state.thisSite.id);
                    if (remainingTargets.length > 0) {
                        await GM_setValue(config.KEYS.SHARED_QUERY, JSON.stringify({ ...data, targetIds: remainingTargets }));
                    } else {
                        await GM_deleteValue(config.KEYS.SHARED_QUERY);
                    }
                    await this.processSubmission(state.thisSite, data.query);
                } catch (e) {
                    await GM_deleteValue(config.KEYS.SHARED_QUERY);
                } finally {
                    state.isProcessingTask = false;
                }
            },
            async processSubmission(site, query) {
                const { utils, config, state } = AITabSync;
                const inputArea = await utils.waitFor(() => site.inputSelectors.map((s) => utils.deepQuerySelector(s)).find(Boolean), config.TIMINGS.SUBMIT_TIMEOUT, '输入框');
                utils.simulateInput(inputArea, query);
                await new Promise((resolve) => setTimeout(resolve, config.TIMINGS.HUMAN_LIKE_DELAY));
                try {
                    state.isSubmitting = true;
                    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                    const eventType = site.id === 'QWEN' ? 'keypress' : 'keydown';
                    const useModifierKey = site.id === 'AI_STUDIO';
                    inputArea.dispatchEvent(new KeyboardEvent(eventType, {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                        ctrlKey: useModifierKey && !isMac,
                        metaKey: useModifierKey && isMac
                    }));
                    setTimeout(() => (state.isSubmitting = false), 2000);
                } catch (error) {
                    state.isSubmitting = false;
                }
            },
            async initReceiver() {
                const { utils, config } = AITabSync;
                try {
                    await utils.waitFor(() => AITabSync.state.thisSite.inputSelectors.map((s) => utils.deepQuerySelector(s)).find(Boolean), config.TIMINGS.SUBMIT_TIMEOUT, 'UI就绪');
                    const value = await GM_getValue(config.KEYS.SHARED_QUERY);
                    if (value) this.processSharedQuery(value);
                } catch (error) {}
                GM_addValueChangeListener(config.KEYS.SHARED_QUERY, (name, old_value, new_value, remote) => {
                    if (remote && new_value) {
                        try {
                            if (JSON.parse(new_value).sourceId !== AITabSync.state.thisSite.id) this.processSharedQuery(new_value);
                        } catch (e) {}
                    }
                });
            },
        },

        // --- 9. Main Application Logic ---
        main: {
            async loadInitialState() {
                const { state, config } = AITabSync;
                state.isLoggingEnabled = await GM_getValue(config.KEYS.LOGGING_ENABLED, false);
                state.visibleTargets = await GM_getValue(config.KEYS.VISIBLE_TARGETS, null);
                if (state.visibleTargets === null) {
                    state.visibleTargets = [...config.DISPLAY_ORDER];
                    await GM_setValue(config.KEYS.VISIBLE_TARGETS, state.visibleTargets);
                }
                state.animationStyle = await GM_getValue(config.KEYS.ANIMATION_STYLE, 'spin');
                state.isSelectionSynced = await GM_getValue(config.KEYS.SELECTION_SYNC_ENABLED, true);
                if (state.isSelectionSynced) {
                    const sharedSelection = await GM_getValue(config.KEYS.SHARED_SELECTION, '[]');
                    state.selectedTargets = new Set(JSON.parse(sharedSelection));
                }
            },
            registerGMListeners() {
                const { config, ui, state, utils } = AITabSync;
                GM_addValueChangeListener(config.KEYS.LOGGING_ENABLED, (name, ov, nv) => {
                    state.isLoggingEnabled = nv;
                    ui.updateMenuCommand();
                });
                GM_addValueChangeListener(config.KEYS.ACTIVE_TABS, (name, ov, nv, remote) => {
                    if (remote) ui.updatePanelState();
                });
                GM_addValueChangeListener(config.KEYS.VISIBLE_TARGETS, (name, ov, nv) => {
                    const newTargets = JSON.parse(nv || '[]');
                    state.visibleTargets = newTargets;
                    const oldTargets = config.DISPLAY_ORDER;
                    oldTargets.forEach((id) => {
                        if (!newTargets.includes(id) && state.selectedTargets.has(id)) state.selectedTargets.delete(id);
                    });
                    ui.rebuildChipsUI();
                });
                GM_addValueChangeListener(config.KEYS.SHARED_SELECTION, (name, ov, nv, remote) => {
                    if (remote && state.isSelectionSynced) {
                        utils.log('接收到同步的选择状态:', nv);
                        state.selectedTargets = new Set(JSON.parse(nv || '[]'));
                        ui.updatePanelState();
                        ui.updateSelectAllButtonState();
                    }
                });
            },
            startBackgroundTasks() {
                const { lifecycle, config, ui } = AITabSync;
                lifecycle.registerTabAsActive();
                lifecycle.cleanupStaleTabs();
                setInterval(lifecycle.registerTabAsActive, config.TIMINGS.HEARTBEAT_INTERVAL);
                setInterval(lifecycle.cleanupStaleTabs, config.TIMINGS.CLEANUP_INTERVAL);
                setInterval(() => {
                    if (document.body && !document.getElementById('ai-sync-container')) ui.createMainPanel();
                }, 2000);
            },
            initEarly() {
                AITabSync.state.thisSite = AITabSync.utils.getCurrentSiteInfo();
                if (!AITabSync.state.thisSite) return false;
                AITabSync.comms.deployNetworkInterceptor();
                return true;
            },
            async initDOMReady() {
                const { state, ui, utils, lifecycle, comms, elements } = AITabSync;
                if (!state.thisSite) return;
                try {
                    await utils.waitFor(() => document.body, 10000, 'document.body to be ready');
                    await this.loadInitialState();
                    utils.log(`脚本 v${AITabSync.config.SCRIPT_VERSION} 在 ${state.thisSite.name} 启动。`);
                    ui.injectStyle();
                    ui.createMainPanel();
                    ui.createSettingsModal();
                    ui.createTooltip();
                    elements.fab.classList.add(state.animationStyle === 'spin' ? 'animation-spin' : 'animation-aurora');
                    if (state.animationStyle === 'spin') {
                        elements.fab.classList.add('intro-playing');
                    }
                    AITabSync.events.register();
                    this.registerGMListeners();
                    this.startBackgroundTasks();
                    lifecycle.ensureWindowName();
                    lifecycle.deployHistoryInterceptor();
                    comms.initReceiver();
                    document.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'visible') lifecycle.registerTabAsActive();
                    });
                    window.addEventListener('beforeunload', lifecycle.unregisterTabAsInactive);
                    if (window.self === window.top) ui.updateMenuCommand();
                } catch (error) {
                    utils.log('初始化错误', error);
                }
            },
        },
    };

    if (AITabSync.main.initEarly()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => AITabSync.main.initDOMReady());
        } else {
            AITabSync.main.initDOMReady();
        }
    }
})();