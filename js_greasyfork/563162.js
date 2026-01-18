// ==UserScript==
// @name         AI语言学习专家 (V1.5 DeepSeek版)
// @namespace    http://tampermonkey.net/
// @version      V1.5
// @license      MIT
// @description  全DeepSeek驱动的英语学习专家。
// @author       Gemini & 豆包编程助手
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      api.deepseek.com
// @connect      api.dictionaryapi.dev
// @downloadURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6%20%28V15%20DeepSeek%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6%20%28V15%20DeepSeek%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 0. 环境检测与配置 ====================
    const isTopWindow = (window.self === window.top);

    // 全局变量
    let apiKey = GM_getValue('ds_api_key', '');
    let sidebarWidth = GM_getValue('sidebar_width', 450);
    let sidebarSide = GM_getValue('ds_sidebar_side', 'right');
    let popupWidth = GM_getValue('ds_popup_width', '600px');
    let popupHeight = GM_getValue('ds_popup_height', '350px');
    let isDarkMode = GM_getValue('ds_sidebar_dark_mode', false);
    let autoImport = GM_getValue('ds_auto_import', true);
    let hasShownTutorial = GM_getValue('ds_has_shown_tutorial_v3', false);

    // 弹窗状态持久化
    let isPopupLocked = GM_getValue('ds_popup_locked', false);
    let savedPopupPos = GM_getValue('ds_popup_pos', {x: 100, y: 100});

    // 悬浮球位置持久化
    let fabPos = GM_getValue('ds_fab_pos', { top: '25px', left: '25px', right: 'auto' });

    // 翻译缓存 (Session Level)
    const TRANSLATION_CACHE = {};

    // 侧边栏例句生成的 AbortController
    let rightPanelAbortCtrl = null;

    // 自定义 Prompt
    const defaultPrompts = [
        "同义词=请作为语言专家，列出与查询词【同语种】的至少5个同义词，并进行简要辨析。",
        "反义词=请作为语言专家，列出与查询词【同语种】的至少5个反义词，并进行简要说明。",
        "同根词=请作为语言专家，列出与查询词【同语种】的至少5个同根词或派生词。",
        "词源词根=请详细分析该词的词源和词根（使用与查询词相同的语言或英语学术解释），字数控制在50字到200字之间。"
    ];
    let rawPrompts = GM_getValue('ds_custom_prompts', defaultPrompts);
    let customPrompts = [];

    const parsePrompts = (list) => {
        let result = [];
        if (Array.isArray(list)) {
            list.forEach(item => {
                if (typeof item === 'string') {
                    let parts = item.indexOf('=') > -1 ? item.split('=') : item.split('::');
                    if (parts.length >= 2) {
                        const name = parts[0].trim();
                        const template = item.substring(item.indexOf(parts.length > 1 && item.includes('=') ? '=' : '::') + (item.includes('=') ? 1 : 2)).trim();
                        if (name && template) result.push({name, template});
                    }
                } else if (typeof item === 'object' && item.name && item.template) {
                    result.push(item);
                }
            });
        }
        return result;
    };
    customPrompts = parsePrompts(rawPrompts);

    let lastSelection = { word: "", context: "" };
    let abortCtrl = null;
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const MODEL_NAME = 'deepseek-chat';
    let activeTab = 'ai';

    // AI 上下文记忆
    let currentAiContext = {
        messages: [],
        generatedText: "",
        element: null
    };

    // 高亮相关
    const highlightClass = 'custom-web-highlight-tag';
    const STORAGE_PREFIX = 'v3_pos_highlights_';
    const VOCAB_CACHE_KEY = 'v3_vocab_ds_cache';
    const STORAGE_KEY = STORAGE_PREFIX + btoa(encodeURIComponent(window.location.host + window.location.pathname)).substring(0, 50);

    // 弹窗会话缓存
    const POPUP_CACHE = { dict: {}, context: {} };

    let lastX = 0, lastY = 0;
    let isRestoring = false;
    let highlightContentEl;
    let popupEl = null;

    // 拖动与交互状态
    let isDraggingPopup = false;
    let dragStartX = 0, dragStartY = 0;
    let popupStartX = 0, popupStartY = 0;
    let currentPopupTrigger = null;

    // 悬浮球拖拽状态
    let isDraggingFab = false;
    let fabDragStartX = 0, fabDragStartY = 0;
    let fabStartLeft = 0, fabStartTop = 0;
    let fabHideTimer = null;

    // 面板调整大小状态
    let isResizingPopup = false;
    let resizeDirection = '';
    let resizeStartRect = {};

    // 全文翻译状态
    let isPageTranslated = false;

    // ==================== 1. 样式定义 ====================
    function applyTheme() {
        const t = isDarkMode ? {
            bg: '#0D262E', text: '#939085', msgBg: '#153a45', border: '#1a4a58',
            userBg: '#939085', userText: '#0D262E', headerBg: '#1a4a58', accent: '#007aff',
            highlightBg: '#8B0000', highlightText: '#ffffff',
            menuItemBg: 'rgba(147, 144, 133, 0.08)', menuItemActiveBg: 'rgba(147, 144, 133, 0.3)',
            tabActiveBg: 'rgba(255,255,255,0.15)', tabInactiveText: 'rgba(255,255,255,0.6)',
            popupBg: '#0D262E', popupBorder: '#1a4a58',
            hoverBg: 'rgba(255,255,255,0.1)', continueColor: '#FFD700',
            sliderOff: '#333', sliderOn: '#007aff',
            modalBg: 'rgba(13, 38, 46, 0.95)'
        } : {
            bg: '#ffffff', text: '#1c1c1e', msgBg: '#f2f2f7', border: '#e5e5ea',
            userBg: '#007aff', userText: '#ffffff', headerBg: '#007aff', accent: '#007aff',
            highlightBg: '#8B0000', highlightText: '#ffffff',
            menuItemBg: 'rgba(200, 200, 210, 0.08)', menuItemActiveBg: 'rgba(200, 200, 210, 0.3)',
            tabActiveBg: 'rgba(255,255,255,0.25)', tabInactiveText: 'rgba(255,255,255,0.7)',
            popupBg: '#ffffff', popupBorder: '#e5e5ea',
            hoverBg: 'rgba(0,0,0,0.05)', continueColor: '#b38f00',
            sliderOff: '#ccc', sliderOn: '#007aff',
            modalBg: 'rgba(255, 255, 255, 0.95)'
        };

        const isRight = sidebarSide === 'right';
        const sidebarPosStyle = isRight ? `right:-1200px; border-left:1px solid ${t.border};` : `left:-1200px; border-right:1px solid ${t.border};`;
        const resizerPosStyle = isRight ? `left:0; cursor:ew-resize;` : `right:0; cursor:ew-resize;`;

        const css = `
            /* --- 侧边栏基础样式 --- */
            #ds-sidebar{
                position:fixed;top:0;${sidebarPosStyle}width:${sidebarWidth}px;height:100vh;
                background:${t.bg}!important;z-index:2147483647;box-shadow:${isRight?'-10px':'10px'} 0 30px rgba(0,0,0,0.3);
                transition:right 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1);
                display:flex;flex-direction:column;
                font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
                color:${t.text}!important;
                box-sizing:border-box!important;padding:0!important;
            }
            #ds-resizer{ position:absolute;${resizerPosStyle}width:6px;height:100%;z-index:2147483648;background:transparent; }

            #ds-header{ padding:10px 15px;background:${t.headerBg}!important;color:white!important; display:flex;align-items:center;height:50px;flex-shrink:0;gap: 15px; }
            #ds-tabs-wrapper { display: flex; gap: 8px; flex: 1; align-items: center; }
            .ds-tab { padding: 5px 12px; cursor: pointer; font-size: 14px; font-weight: 500; border-radius: 6px; transition: all 0.2s; color: ${t.tabInactiveText}; user-select: none; }
            .ds-tab:hover { color: #fff; }
            .ds-tab.active { background: ${t.tabActiveBg}; color: #fff; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            #ds-header-actions{display:flex;gap:15px;align-items:center;}
            .header-action{cursor:pointer;font-size:18px;opacity:0.85;transition:opacity 0.2s; display:flex; align-items:center; justify-content:center;}
            .header-action:hover{opacity:1;}

            #ds-help-btn { font-size: 16px; cursor: pointer; filter: grayscale(0); transition: transform 0.2s; }
            #ds-help-btn:hover { transform: scale(1.2); }

            #ds-tab-content{ flex:1;overflow:hidden;display:flex;flex-direction:column; position:relative; }
            .tab-panel{ display:none;flex-direction:column;height:100%;width:100%;overflow:hidden; }
            .tab-panel.active{display:flex;}
            #ds-ai-content{flex:1;}
            #ds-chat-log{ flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column; gap:15px;margin:0; }
            .ds-msg{ padding:12px 16px;border-radius:12px;font-size:14.5px;line-height:1.6; max-width:92%;word-wrap:break-word; }
            .user-msg{align-self:flex-end;background:${t.userBg}!important;color:${t.userText}!important;}
            .ai-msg{ align-self:flex-start;background:${t.msgBg}!important;color:${t.text}!important; border:1px solid ${t.border};white-space:pre-wrap; }

            .ds-continue-text {
                display: block; margin-top: 10px;
                color: ${t.continueColor}; font-weight: bold;
                cursor: pointer; font-size: inherit; text-decoration: underline;
                transition: opacity 0.2s;
            }
            .ds-continue-text:hover { opacity: 0.8; }

            /* 设置面板样式调整 */
            .ds-instruction-text {
                color: ${t.text}; /* 主题色 */
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 5px;
            }
            .ds-instruction-highlight {
                color: #FFD700 !important; /* 黄色高亮 */
                font-weight: bold;
            }

            .highlight-word{color:#1E90FF!important;font-weight:bold!important;text-decoration:none !important; background: rgba(30, 144, 255, 0.1); padding: 0 2px; border-radius: 2px;}

            #ds-fn-bar{ padding:8px 15px 4px 15px; display:flex; gap:6px; flex-wrap: wrap; border-top:1px solid ${t.border}; background:${t.bg}; flex-shrink:0; max-height: 120px; overflow-y: auto; }
            .fn-btn{ flex:1; min-width: 70px; padding:6px 8px; text-align:center; border-radius:6px; cursor:pointer; font-weight:bold;font-size:12px;color:white!important; transition:transform 0.1s;white-space:nowrap; display: flex; align-items: center; justify-content: center; }
            .fn-btn:active{transform:scale(0.95);}
            .custom-prompt-btn { background: ${t.accent}; opacity: 0.9; flex: 0 1 auto !important; }

            #ds-input-area{ padding:4px 15px 15px 15px; background:${t.bg}; flex-shrink:0;margin:0!important;box-sizing:border-box!important;width:100%; }
            #ds-input-wrapper{ display:flex;align-items:stretch;gap:8px;width:100%;box-sizing:border-box; }
            #ds-input{ flex:1;min-height:60px;max-height:200px;border-radius:8px;border:1px solid ${t.border}; padding:8px;outline:none;box-sizing:border-box; background:${isDarkMode?t.msgBg:'#fff'}!important;color:${t.text}!important; font-family:inherit;resize:none;font-size:14px;line-height:1.5;margin:0; }
            #ds-send{ width:40px;border:none;border-radius:8px;background:${t.accent}!important; color:white!important;cursor:pointer;font-size:18px; display:flex;align-items:center;justify-content:center; transition:background 0.2s ease;flex-shrink:0; }
            #ds-send:hover{background:${t.accent}dd!important;}

            /* 统一面板样式 (设置 & 帮助) - 覆盖全屏，字体统一 14px */
            #ds-config-panel, #ds-help-panel {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: ${t.bg}; z-index: 1001; padding: 20px; box-sizing: border-box;
                display: none; flex-direction: column; overflow-y: auto;
                box-shadow: none; border-radius: 0; border: none;
                font-size: 14px; color: ${t.text};
            }
            .cfg-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px; font-size: 14px;}
            #cfg-api-key{width:100%;margin-top:5px;padding:8px;border-radius:4px;border:1px solid ${t.border};background:${t.msgBg};color:${t.text}; font-size: 13px;}
            #cfg-prompts { width: 100%; height: 120px; padding: 8px; border-radius: 4px; border: 1px solid ${t.border}; background: ${t.msgBg}; color: ${t.text}; font-family: monospace; font-size: 12px; resize: vertical; margin-top: 5px; white-space: pre; overflow-x: auto; }

            /* 滑块开关样式 (iOS Style Switch) */
            .ds-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
            .ds-switch input { opacity: 0; width: 0; height: 0; }
            .ds-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${t.sliderOff}; transition: .3s; border-radius: 24px; }
            .ds-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            input:checked + .ds-slider { background-color: ${t.sliderOn}; }
            input:checked + .ds-slider:before { transform: translateX(20px); }

            .ds-help-title, .ds-config-title { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: ${t.accent}; border-bottom: 1px solid ${t.border}; padding-bottom: 10px; }
            .ds-help-item { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
            .ds-help-key { font-weight: bold; color: ${t.text}; font-family: monospace; background: ${t.msgBg}; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content; }
            .ds-help-desc { font-size: 13px; color: ${t.text}; opacity: 0.8; line-height: 1.4; }

            /* 按钮统一样式 (保存按钮 & 关闭说明按钮) */
            .ds-primary-btn { width: 100%; padding: 8px; background: ${t.accent}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: opacity 0.2s; text-align: center; }
            .ds-primary-btn:hover { opacity: 0.9; }
            /* 帮助面板的关闭按钮位置调整 - 修改位置挨在下方 */
            #ds-help-close { margin-top: 20px; }

            #ds-highlight-content{flex:1;}
            #ds-highlight-log{ flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column; gap:6px; margin:0; }
            .${highlightClass} { background-color: ${t.highlightBg} !important; color: ${t.highlightText} !important; padding: 0 2px !important; border-radius: 2px; cursor: pointer; display: inline; }

            /* 内联翻译与呼吸灯 */
            .web-inline-trans {
                color: #1E90FF !important; font-size: 0.95em !important; font-weight: normal !important;
                margin-left: 0px !important; display: block !important; background: transparent !important;
                box-shadow: none !important; border: none !important; padding: 4px 0 8px 0 !important;
            }
            .web-inline-trans::before { content: ""; }
            /* 呼吸灯效果专用 class */
            .ds-inline-loading {
                 animation: pulse 1.5s infinite;
            }

            .web-menu-item { display: flex !important;flex-direction: column !important; align-items: flex-start !important; padding: 10px 12px !important; margin: 0 !important; background: ${t.menuItemBg} !important;border-radius: 8px !important; cursor: default !important;transition: background-color 0.1s ease !important; }
            .web-menu-item:hover { background: ${t.menuItemActiveBg} !important; }
            .web-menu-header { display:flex; justify-content:flex-start; width:100%; align-items:baseline; gap: 8px; }

            /* 生词本单词样式 - 去除变蓝和手型指针 */
            .web-menu-word { font-weight: 700 !important; color: ${t.text} !important; font-size: 15px !important; cursor: default !important; }
            .web-menu-word:hover { text-decoration: none !important; color: ${t.text} !important; }

            .web-menu-ipa { font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif; color: #888 !important; font-size: 13px !important; }
            .web-menu-trans { display: block !important; margin-top: 4px !important; color: ${t.text} !important; opacity: 0.9; font-size: 13px !important; line-height: 1.4 !important; white-space: pre-wrap !important; word-break: break-all !important; width: 100% !important; }

            /* 自定义确认模态框 (和谐样式) */
            #ds-confirm-modal {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 2000;
                display: none; align-items: center; justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            .ds-confirm-box {
                background: ${t.modalBg}; padding: 25px 20px; border-radius: 12px;
                width: 75%; text-align: center; border: 1px solid ${t.border};
                box-shadow: 0 10px 30px rgba(0,0,0,0.3); color: ${t.text};
            }
            .ds-confirm-text { font-size: 15px; margin-bottom: 20px; font-weight: 500; }
            .ds-confirm-btns { display: flex; gap: 12px; justify-content: center; }
            .ds-btn { padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; font-weight: bold; transition: transform 0.1s; }
            .ds-btn:active { transform: scale(0.95); }
            .ds-btn-yes { background: #ff3b30; color: white; }
            .ds-btn-no { background: ${t.msgBg}; color: ${t.text}; border: 1px solid ${t.border}; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

            #ds-fab{
                position:fixed;
                width:40px;height:40px;
                background:${t.headerBg};color:white;border-radius:8px;
                display:flex;align-items:center;justify-content:center;font-size:16px;
                font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.2);
                z-index:2147483646;transition: opacity 0.3s;
                opacity:0;visibility:hidden; user-select: none;
            }
            #ds-fab.visible{opacity:1;visibility:visible;}

            #ds-popup {
                position: fixed;
                background: ${t.popupBg}; color: ${t.text};
                border: 1px solid ${t.popupBorder}; border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4); z-index: 2147483650;
                display: none; flex-direction: column;
                min-width: 400px; min-height: 250px;
                max-width: 90vw; max-height: 80vh;
            }

            .ds-resize-handle { position: absolute; z-index: 100; opacity: 0; }
            .ds-resize-handle:hover { background: rgba(30, 144, 255, 0.2); opacity: 1; }
            .ds-rh-n { top: 0; left: 10px; right: 10px; height: 5px; cursor: ns-resize; }
            .ds-rh-s { bottom: 0; left: 10px; right: 10px; height: 5px; cursor: ns-resize; }
            .ds-rh-w { left: 0; top: 10px; bottom: 10px; width: 5px; cursor: ew-resize; }
            .ds-rh-e { right: 0; top: 10px; bottom: 10px; width: 5px; cursor: ew-resize; }
            .ds-rh-nw { top: 0; left: 0; width: 10px; height: 10px; cursor: nwse-resize; z-index: 101; }
            .ds-rh-ne { top: 0; right: 0; width: 10px; height: 10px; cursor: nesw-resize; z-index: 101; }
            .ds-rh-sw { bottom: 0; left: 0; width: 10px; height: 10px; cursor: nesw-resize; z-index: 101; }
            .ds-rh-se { bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize; z-index: 101; }

            #ds-popup-header-bar {
                height: 30px; width: 100%; cursor: move; flex-shrink: 0; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;
                background: linear-gradient(to bottom, ${t.popupBg}, transparent);
            }
            .ds-popup-icon { cursor: pointer; font-size: 16px; opacity: 0.6; margin-left: 12px; color: ${t.text}; line-height: 1; display:flex; align-items:center; }
            .ds-popup-icon:hover { opacity: 1; color: ${t.accent}; }
            #ds-popup-close-float { margin-left: 15px; font-size: 18px; }
            #ds-popup-lock.locked { opacity: 1; color: ${t.accent}; }

            #ds-popup-body { display: flex; flex: 1; overflow: hidden; position: relative; padding: 0 5px 5px 5px; width: 100%; height: 100%; cursor: default; }
            .ds-split-view { width: 100%; height: 100%; display: flex; }
            .ds-split-left { flex: 1; border-right: 1px solid ${t.border}; padding: 16px; overflow-y: auto; background: ${t.popupBg}; }
            .ds-split-right { flex: 1; padding: 16px; overflow-y: auto; background: ${t.popupBg}; }

            .ds-popup-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; color: ${t.accent}; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
            .ds-popup-text { font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
            /* 统一的 Loading 样式：灰色、斜体、呼吸动画 */
            .ds-popup-loading { color: #888; font-style: italic; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

            .ds-target-italic { color: #1E90FF !important; font-weight: bold; font-style: italic; }
            .ds-head-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
            .ds-headword { color: #1E90FF !important; font-weight: 900; font-size: 1.5em; display: inline-block; }

            .ds-dict-grid { display: grid; grid-template-columns: 45px 1fr; gap: 2px 0px; align-items: baseline; }
            .ds-pos-label { text-align: right; color: #888; font-style: italic; font-weight: bold; font-size: 0.85em; user-select: none; white-space: nowrap; overflow: visible; padding-right: 8px; }
            .ds-def-line { cursor: pointer; padding: 0; margin-bottom: 0; display: inline-block; line-height: 1.35; position: relative; }
            .ds-def-line:hover { color: ${t.accent}; }
            .ds-def-line.active-def { color: ${t.accent}; font-weight: 600; }

            /* 新手引导 (Tutorial) 样式 */
            #ds-tutorial-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.6); z-index: 2147483651;
                display: flex; align-items: center; justify-content: center;
            }
            .ds-tutorial-bubble {
                background: white; border-radius: 12px; padding: 25px;
                width: 380px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                position: relative; animation: popIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                font-family: -apple-system, sans-serif; color: #333;
            }
            @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .ds-tut-header { font-size: 20px; font-weight: bold; color: #007aff; margin-bottom: 10px; display:flex; align-items:center; gap:8px; }
            .ds-tut-step { font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #444; }
            .ds-tut-action { display: flex; justify-content: flex-end; gap: 10px; }
            .ds-tut-btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; font-size: 14px; }
            .ds-tut-next { background: #007aff; color: white; }
            .ds-tut-next:hover { background: #006ce6; }
            .ds-tut-skip { background: transparent; color: #888; }
            .ds-tut-skip:hover { color: #555; }
        `;

        const styleEl = document.getElementById('fusion-style') || document.createElement('style');
        styleEl.id = 'fusion-style';
        styleEl.innerHTML = css;
        document.head.appendChild(styleEl);

        updateSidebarPosition(false);
    }

    // 更新侧边栏位置逻辑
    function updateSidebarPosition(animate = true) {
        const sb = document.getElementById('ds-sidebar');
        const resizer = document.getElementById('ds-resizer');
        if (!sb || !resizer) return;

        sb.style.left = ''; sb.style.right = ''; sb.style.borderLeft = ''; sb.style.borderRight = '';
        resizer.style.left = ''; resizer.style.right = '';

        const t = isDarkMode ? { border: '#1a4a58' } : { border: '#e5e5ea' };

        if (sidebarSide === 'right') {
            sb.style.right = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderLeft = `1px solid ${t.border}`;
            sb.style.boxShadow = '-10px 0 30px rgba(0,0,0,0.3)';
            resizer.style.left = '0';
        } else {
            sb.style.left = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderRight = `1px solid ${t.border}`;
            sb.style.boxShadow = '10px 0 30px rgba(0,0,0,0.3)';
            resizer.style.right = '0';
        }
    }

    // ==================== 2. 工具函数 ====================
    function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    const isChinese = (text) => /[\u4e00-\u9fa5]/.test(text);

    function getArticleContent() {
        const selectors = ['article','main','#content','.content','.article-content','.post-content','.entry-content','.main-content'];
        let articleEl = null;
        for (const s of selectors) {if (articleEl = document.querySelector(s)) break;}
        const targetEl = articleEl || document.body;
        const validTags = ['h1','h2','h3','h4','p','blockquote','li','div'];
        const exclude = ['nav','header','footer','aside','.nav','.header','.footer','.ad','.advert','.banner','.sidebar','.comment','.menu'];
        let text = '';
        validTags.forEach(tag => {
            targetEl.querySelectorAll(tag).forEach(el => {
                if (exclude.some(es => el.closest(es))) return;
                const t = el.textContent.trim();
                if (t.length > 20) text += `${t}\n\n`;
            });
        });
        return text.substring(0,12000).trim() || '未识别到有效文章内容，请手动输入需要总结的文本。';
    }

    // 切换页面全文翻译状态
    function togglePageTranslation() {
        if (isPageTranslated) {
            // 清除模式：移除所有 full-page-trans 元素
            document.querySelectorAll('.ds-full-page-trans').forEach(el => el.remove());
            isPageTranslated = false;
        } else {
            // 翻译模式
            translatePageContent();
        }
    }

    // 执行全文网页内联翻译
    function translatePageContent() {
        const selectors = ['article','main','#content','.content','.article-content','.post-content','.entry-content','.main-content'];
        let articleEl = null;
        for (const s of selectors) {if (articleEl = document.querySelector(s)) break;}
        const targetEl = articleEl || document.body;

        // 查找所有文本块
        const validTags = ['p','h1','h2','h3','h4','li','blockquote'];
        const exclude = ['nav','header','footer','aside','.nav','.header','.footer','.ad','.advert','.banner','.sidebar','.comment','.menu', '#ds-sidebar', '#ds-popup', '#ds-fab'];

        let count = 0;
        validTags.forEach(tag => {
            const elements = targetEl.querySelectorAll(tag);
            elements.forEach(el => {
                if (exclude.some(es => el.closest(es))) return;
                const text = el.innerText.trim();
                if (text.length > 10 && !isChinese(text)) { // 简单过滤
                    count++;
                    const transSpan = document.createElement('div');
                    transSpan.className = 'web-inline-trans ds-full-page-trans ds-inline-loading'; // 添加呼吸灯 class
                    transSpan.style.color = '#1E90FF';
                    transSpan.style.fontSize = '0.95em';
                    // 不预设文本，由流式函数处理
                    el.appendChild(transSpan);

                    // 强制使用 DeepSeek 流式
                    streamDeepSeekInline(text, transSpan);
                }
            });
        });
        if(count > 0) isPageTranslated = true;
        else alert("未找到足够的可翻译正文内容。");
    }

    const autoResizeInput = () => {
        const el = document.getElementById('ds-input');
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight,200) + 'px';
    };

    function clearAllInlineTranslations() {
        document.querySelectorAll('.web-inline-trans').forEach(el => el.remove());
        document.querySelectorAll('.web-trans-source-highlight').forEach(wrapper => {
            const parent = wrapper.parentNode;
            if (parent) {
                while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
                wrapper.remove();
            }
        });
        isPageTranslated = false;
    }

    function getDeepSeekVocabDef(word, callback) {
        if (!apiKey) return;
        const cache = JSON.parse(localStorage.getItem(VOCAB_CACHE_KEY) || '{}');

        // 如果已有有效缓存，直接返回
        if (cache[word] && cache[word] !== "..." && cache[word] !== "waiting") {
            if (callback) callback(cache[word]);
            return;
        }

        // 立即写入“waiting”状态并刷新生词本UI，消除卡顿感
        cache[word] = "waiting";
        localStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(cache));
        if (activeTab === 'highlight') refreshHighlightMenu();

        let sysContent = "你是一个简明英汉词典。请给出单词的音标(IPA)和精准中文释义。格式：[音标] 释义。例如：[hə'ləʊ] 你好。尽量在一行或两行内完成。";
        if (isChinese(word)) {
            sysContent = "你是一个简明汉语词典。请给出词汇的拼音和精准释义。格式：[拼音] 释义。例如：[nǐ hǎo] 打招呼的敬语。尽量在一行或两行内完成。";
        }

        fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{role:"system", content:sysContent},{role:"user", content: word}],
                stream: false // 保持 false 以获取完整 JSON 格式，但前端已通过 waiting 状态解耦
            })
        }).then(res => res.json()).then(data => {
            const content = data.choices?.[0]?.message?.content || "查询失败";
            // 更新缓存
            const freshCache = JSON.parse(localStorage.getItem(VOCAB_CACHE_KEY) || '{}');
            freshCache[word] = content.trim();
            localStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(freshCache));

            if (callback) callback(content.trim());
            // 请求完成后再次刷新 UI
            if (activeTab === 'highlight') refreshHighlightMenu();

        }).catch(e => {
            console.error("DS Fetch Error", e);
            const errCache = JSON.parse(localStorage.getItem(VOCAB_CACHE_KEY) || '{}');
            errCache[word] = "查询失败，请重试";
            localStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(errCache));
            if (activeTab === 'highlight') refreshHighlightMenu();
        });
    }

    async function streamDeepSeekInline(text, targetElement, signal = null) {
        // 【新增功能】检查 Session 缓存
        if (TRANSLATION_CACHE[text]) {
            targetElement.classList.remove('ds-inline-loading'); // 移除呼吸灯
            targetElement.innerText = TRANSLATION_CACHE[text];
            targetElement.style.color = "#1E90FF"; // 确保样式正确
            return;
        }

        if (!apiKey) { targetElement.innerText = "请配置 API Key"; targetElement.classList.remove('ds-inline-loading'); return; }

        // 设置初始“思考中”状态
        targetElement.innerText = "DeepSeek 思考中...";
        // 确保有呼吸效果 class
        if (!targetElement.classList.contains('ds-inline-loading')) targetElement.classList.add('ds-inline-loading');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        {role:"system", content:"你是一个翻译引擎。直接输出以下内容的中文翻译，不要任何解释或前缀。"},
                        {role:"user", content: text}
                    ],
                    stream: true
                }),
                signal: signal
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            // 【优化体验】 只有在接收到第一个数据包时，才清空“思考中”文字，实现无缝 0 秒切换
            let isFirstChunk = true;
            let fullText = ""; // 用于缓存

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                // 收到第一帧数据，立刻清空 Loading 文本并移除呼吸效果
                if (isFirstChunk) {
                    targetElement.innerText = "";
                    targetElement.classList.remove('ds-inline-loading');
                    isFirstChunk = false;
                }

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line!=='data: [DONE]') {
                        const data = JSON.parse(line.substring(6));
                        const delta = data.choices[0].delta.content || "";
                        targetElement.innerText += delta;
                        fullText += delta;
                    }
                }
            }
            // 翻译完成后写入缓存
            if (fullText) TRANSLATION_CACHE[text] = fullText;

        } catch (e) {
            if (e.name !== 'AbortError') {
                 targetElement.innerText = "DeepSeek Error: " + e.message;
                 targetElement.classList.remove('ds-inline-loading');
            }
        }
    }

    function getPathTo(el) {
        if (!el || el === document.body) return 'BODY';
        if (el.id) return `id("${el.id}")`;
        let ix = 0, sibs = el.parentNode.childNodes;
        for (let i = 0; i < sibs.length; i++) {
            if (sibs[i] === el) return getPathTo(el.parentNode) + '/' + el.tagName + '[' + (ix + 1) + ']';
            if (sibs[i].nodeType === 1 && sibs[i].tagName === el.tagName) ix++;
        }
    }

    function getCurrentSentence() {
        let node, offset;
        if (document.caretRangeFromPoint) {
            const range = document.caretRangeFromPoint(lastX, lastY);
            if (!range) return null;
            node = range.startContainer; offset = range.startOffset;
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(lastX, lastY);
            if (!pos) return null;
            node = pos.offsetNode; offset = pos.offset;
        } else { return null; }
        if (node.nodeType !== 3) {
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) { node = node.childNodes[0]; offset = 0; }
            else { return null; }
        }
        const text = node.textContent;
        let s = offset, e = offset;
        const re = /[\w\p{Unified_Ideograph}-]/u;
        if (e >= text.length) e = text.length - 1; if (s >= text.length) s = text.length - 1;
        if (!re.test(text[s])) { if (s > 0 && re.test(text[s - 1])) { s--; e--; } else return null; }
        while (s > 0 && re.test(text[s-1])) s--;
        while (e < text.length && re.test(text[e])) e++;
        const result = text.substring(s, e);
        return result.trim().length === 0 ? null : { text: result, node: node, s, e };
    }

    async function streamToElement(sysPrompt, userPrompt, targetElement, cacheCategory, cacheKey, highlightWord = null, mode = 'normal', signal = null) {
        if (cacheCategory && cacheKey && POPUP_CACHE[cacheCategory][cacheKey]) {
            targetElement.innerHTML = POPUP_CACHE[cacheCategory][cacheKey];
            return;
        }
        if (!apiKey) { targetElement.innerText = "请配置 API Key"; return; }
        targetElement.innerHTML = "<span class='ds-popup-loading'>DeepSeek Thinking...</span>";

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [{role:"system",content:sysPrompt},{role:"user",content:userPrompt}],
                    stream: true
                }),
                signal: signal
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let content = "";
            let finalHtml = "";

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line!=='data: [DONE]') {
                        const data = JSON.parse(line.substring(6));
                        content += data.choices[0].delta.content || "";

                        let safeHtml = content;
                        if (mode === 'dict') {
                            const rawLines = content.split('\n').filter(l => l.trim() !== '');
                            if (rawLines.length > 0) {
                                let html = "";
                                const headword = rawLines[0].replace(/\*\*/g, '').trim();
                                let ipa = "";
                                let defStartIndex = 1;
                                if (rawLines.length > 1 && (rawLines[1].trim().startsWith('/') || rawLines[1].trim().startsWith('['))) {
                                    ipa = rawLines[1].trim(); defStartIndex = 2;
                                }

                                // 移除喇叭 SVG 和 onclick 发音事件，保留静态文本
                                const ipaHtml = ipa ? `<span class="ds-clickable-ipa">${ipa}</span>` : '';

                                html += `<div class="ds-head-row"><span class="ds-headword">${headword}</span>${ipaHtml}</div>`;
                                html += `<div class="ds-dict-grid">`;
                                let lastPos = "";
                                for (let i = defStartIndex; i < rawLines.length; i++) {
                                    let lineText = rawLines[i].trim();
                                    if (/^([a-z]+|[\u4e00-\u9fa5]+)\.$/i.test(lineText) && i + 1 < rawLines.length) {
                                        const nextLine = rawLines[i+1].trim();
                                        if (!/^([a-z]+|[\u4e00-\u9fa5]+)\./i.test(nextLine)) { lineText += " " + nextLine; i++; }
                                    }
                                    const match = lineText.match(/^([a-z]+|[\u4e00-\u9fa5]+)\.\s*(.*)/i);
                                    let pos = ""; let defText = lineText;
                                    if (match) { pos = match[1].toLowerCase(); defText = match[2]; }
                                    let displayPos = pos;
                                    if (pos && pos === lastPos) { displayPos = ""; } else { if (pos) lastPos = pos; }
                                    html += `<div class="ds-pos-label">${displayPos}</div>`;
                                    html += `<div class="ds-def-content"><span class="ds-def-line" title="点击查看例句" data-def="${encodeURIComponent(defText)}">${defText}</span></div>`;
                                }
                                html += `</div>`;
                                finalHtml = html;
                            } else { finalHtml = "<span class='ds-popup-loading'>...</span>"; }
                        } else {
                            safeHtml = safeHtml.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n/g, "<br>");
                            if (highlightWord) {
                                const safeReg = new RegExp(`(?<!<[^>]*)(\\b${escapeRegExp(highlightWord)}\\b)(?![^<]*>)`, 'gi');
                                safeHtml = safeHtml.replace(safeReg, '<span class="ds-target-italic" style="color:#1E90FF!important;">$1</span>');
                            }
                            finalHtml = safeHtml;
                        }
                        targetElement.innerHTML = finalHtml;
                    }
                }
            }
            if (cacheCategory && cacheKey && finalHtml) { POPUP_CACHE[cacheCategory][cacheKey] = finalHtml; }
        } catch (e) {
             if(e.name !== 'AbortError') targetElement.innerText = "Error: " + e.message;
        }
    }

    window.updateRightPanelExamples = function(defText, word) {
        // V1.4: 刷新前先切断上一条流
        if (rightPanelAbortCtrl) {
            rightPanelAbortCtrl.abort();
        }
        rightPanelAbortCtrl = new AbortController();

        const rightHeader = document.querySelector('#ds-popup-right-content .ds-popup-title');
        const rightBody = document.querySelector('#ds-popup-right-content .ds-popup-text');
        if (!rightBody) return;
        document.querySelectorAll('.ds-def-line').forEach(el => el.classList.remove('active-def'));
        event.target.classList.add('active-def');
        rightHeader.innerText = "📖 例句示范";
        rightBody.innerHTML = "<span class='ds-popup-loading'>Generating new example...</span>";

        let prompt = "";
        if (isChinese(word)) {
            prompt = `针对中文词汇 "${word}" 的含义："${defText}"，请生成 **1个** 包含该词的中文例句并附带英文翻译。要求：1. 只要1个例句。2. 不要使用前缀标签。3. 第一行中文例句，第二行英文翻译。`;
        } else {
            prompt = `针对单词 "${word}" 的释义："${defText}"，请生成 **1个** 地道的英文例句并附带中文翻译。要求：1. 只要1个例句。2. **不要** 使用 "En:" 或 "Cn:" 等前缀。3. 第一行英文，第二行中文。`;
        }

        // V1.5 关键修改: 添加随机种子，强制刷新
        prompt += `\n(Ref: ${Date.now()})`;

        // 传入 signal
        streamToElement(prompt, "OneExample", rightBody, null, null, word, 'normal', rightPanelAbortCtrl.signal);
    };

    function copyToClip(text) {
        if (!text) return;
        GM_setClipboard(text);
    }

    // ==================== 3. 核心功能 ====================
    async function askAI(query, targetWord = "", mode = "chat", continueMessages = null, customSystemPrompt = null) {
        if (!apiKey || apiKey.length < 10) {alert("请配置有效的 DeepSeek API Key");return;}
        if (!isSidebarVisible()) showSidebar();
        // 如果当前不在 AI 标签页，自动切换，但保留输入状态
        if (activeTab !== 'ai') switchTab('ai');

        if (!continueMessages && abortCtrl) { abortCtrl.abort(); }
        abortCtrl = new AbortController();
        const log = document.getElementById('ds-chat-log');
        if (!log) return;

        let messages = [];
        let uMsg, aiMsg;

        if (continueMessages) {
             messages = continueMessages;
             aiMsg = currentAiContext.element;
             aiMsg.innerHTML += "<br><br><i>[Continuing...]</i><br>";
        } else {
            uMsg = document.createElement('div'); uMsg.className = 'ds-msg user-msg';
            let display = mode==="dict"?`📖 词典: ${targetWord}`:mode==="explain"?`🔍 沉浸: ${targetWord}`:mode==="summary"?"📄 全文总结":mode==="custom"?"✨ "+query.substring(0,40):query.substring(0,40);
            uMsg.innerText = display; log.appendChild(uMsg);

            aiMsg = document.createElement('div'); aiMsg.className = 'ds-msg ai-msg'; aiMsg.innerText = "...";
            log.appendChild(aiMsg); log.scrollTop = log.scrollHeight;

            let sysPrompt = "你是一位专业的英语教育专家。";
            if (mode==="dict") sysPrompt += "请提供单词的词典释义。包含音标、词性、精准中文含义、不规则形式。严禁提供例句。";
            else if (mode==="explain") sysPrompt += "请引用原文，使用'#'分隔，解析该词在当前语境下的特定含义及作者意图，200字以内。";
            else if (mode==="summary") sysPrompt += "你是一位专业的文本分析师，需要对提供的文章内容进行结构化总结，要求：1. 分点呈现核心观点；2. 提炼文章关键信息、逻辑框架；3. 语言简洁专业，符合分析师报告风格；4. 忽略无关细节，聚焦文章主旨；5. 全部使用中文输出。";
            else if (mode==="custom" && customSystemPrompt) sysPrompt = customSystemPrompt;

            messages = [{role:"system",content:sysPrompt},{role:"user",content:query}];
        }

        currentAiContext = { messages: messages, generatedText: continueMessages ? currentAiContext.generatedText : "", element: aiMsg };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
                signal: abortCtrl.signal,
                body: JSON.stringify({
                    model: MODEL_NAME, messages: messages, stream: true
                })
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            if (!continueMessages) aiMsg.innerText = "";

            while (true) {
                const {done, value} = await reader.read(); if (done) break;
                const chunk = decoder.decode(value); const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line!=='data: [DONE]') {
                        const data = JSON.parse(line.substring(6));
                        const delta = data.choices[0].delta.content || "";
                        currentAiContext.generatedText += delta;
                        let html = currentAiContext.generatedText.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
                        if (targetWord && mode!=="summary" && mode!=="custom") { const reg = new RegExp(`(${targetWord})`,'gi'); html = html.replace(reg,"<span class=\"highlight-word\">$1</span>"); }
                        aiMsg.innerHTML = html; log.scrollTop = log.scrollHeight;
                    }
                }
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                // 【UI优化】点击继续生成，不再是独立按钮，而是融入气泡内
                const continueElem = document.createElement('div');
                continueElem.className = 'ds-continue-text';
                continueElem.innerText = '👉 点击继续生成';
                continueElem.onclick = function() {
                    this.remove();
                    const newMessages = [...currentAiContext.messages];
                    if (newMessages[newMessages.length - 1].role !== 'assistant') { newMessages.push({role: "assistant", content: currentAiContext.generatedText}); }
                    else { newMessages[newMessages.length - 1].content = currentAiContext.generatedText; }
                    newMessages.push({role: "user", content: "请继续（Continue）"});
                    askAI("", targetWord, mode, newMessages);
                };
                aiMsg.appendChild(continueElem); // 添加到气泡内
                log.scrollTop = log.scrollHeight;
            } else { aiMsg.innerText += "\n[请求失败: " + e.message + "]"; }
        }
    }

    function saveHighlights() {
        isRestoring = true; const h = [];
        document.querySelectorAll(`.${highlightClass}`).forEach(el => {
            const parent = el.parentElement; if (parent) {
                let rank = 0; const text = el.textContent; const regex = new RegExp(escapeRegExp(text), 'g');
                for (let i = 0; i < parent.childNodes.length; i++) {
                    const child = parent.childNodes[i]; if (child === el) break;
                    const childText = child.textContent; const matches = childText.match(regex); if (matches) rank += matches.length;
                }
                h.push({ path: getPathTo(parent), text: text, rank: rank });
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
        if (highlightContentEl && activeTab === 'highlight') refreshHighlightMenu();
        setTimeout(() => { isRestoring = false; }, 100);
    }

    function removeHighlight(el) {
        isRestoring = true; const p = el.parentNode;
        if (p) { while (el.firstChild) p.insertBefore(el.firstChild, p.contains(el) ? el : null); el.remove(); saveHighlights(); }
    }

    function applySavedHighlights() {
        if (isRestoring) return; isRestoring = true;
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            saved.forEach(item => {
                const parent = document.evaluate(item.path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (parent) {
                    const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
                    let node; let matchCount = 0; let finishedItem = false;
                    while (node = walker.nextNode()) {
                        if (finishedItem) break; const nodeText = node.textContent; let searchPos = 0;
                        while (true) {
                            const idx = nodeText.indexOf(item.text, searchPos); if (idx === -1) break;
                            if (matchCount === (item.rank || 0)) {
                                if (node.parentElement.classList.contains(highlightClass)) { finishedItem = true; break; }
                                const range = document.createRange(); range.setStart(node, idx); range.setEnd(node, idx + item.text.length);
                                const mark = document.createElement('mark'); mark.className = highlightClass; mark.appendChild(range.extractContents()); range.insertNode(mark);
                                finishedItem = true; break;
                            }
                            matchCount++; searchPos = idx + 1;
                        }
                    }
                }
            });
        } catch(e){}
        setTimeout(() => { isRestoring = false; }, 200);
    }

    function refreshHighlightMenu() {
        if (!highlightContentEl) return;
        const cache = JSON.parse(localStorage.getItem(VOCAB_CACHE_KEY) || '{}');
        const words = [...new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(h => h.text))];
        highlightContentEl.innerHTML = '<div id="ds-highlight-log"></div>';
        const logEl = highlightContentEl.querySelector('#ds-highlight-log');
        if (words.length === 0) { logEl.innerHTML = '<div style="text-align:center;color:#999;margin-top:20px;font-size:13px;">暂无生词记录<br>Alt+1 添加</div>'; return; }
        words.forEach(word => {
            const item = document.createElement('div'); item.className = 'web-menu-item';
            let ipa = "", definition = "..."; const cachedContent = cache[word];

            // 统一 Loading 状态
            let defHtml = "";
            if (cachedContent && cachedContent !== "..." && cachedContent !== "waiting") {
                const match = cachedContent.match(/^(\[.*?\])\s*(.*)/s);
                if (match) { ipa = match[1]; definition = match[2]; } else { definition = cachedContent; }
                defHtml = `<div class="web-menu-trans">${definition}</div>`;
            } else {
                // 使用统一的 ds-popup-loading 样式（灰色、小字号、斜体、呼吸动画）
                defHtml = `<div class="web-menu-trans"><span class='ds-popup-loading' style="font-size:12px;">DeepSeek Thinking...</span></div>`;
            }

            // 移除喇叭 icon
            item.innerHTML = `
                <div class="web-menu-header">
                    <span class="web-menu-word">${word}</span>
                    <span class="web-menu-ipa">${ipa}</span>
                </div>
                ${defHtml}
            `;

            // 点击卡片：1. 跳转位置 2. 同步到输入框
            item.onclick = (e) => {
                // 同步单词到聊天输入框
                const input = document.getElementById('ds-input');
                if (input) {
                    input.value = word;
                    autoResizeInput();
                }

                // 跳转到文中位置
                const target = [...document.querySelectorAll(`.${highlightClass}`)].find(m => m.textContent === word);
                if(target) {
                    target.scrollIntoView({ behavior: 'auto', block: 'center' });
                    const originalBg = target.style.backgroundColor; target.style.transition = "background-color 0.2s"; target.style.backgroundColor = "#FFFF00"; setTimeout(() => { target.style.backgroundColor = ""; }, 500);
                }
            };
            logEl.appendChild(item);
        });
    }

    const isSidebarVisible = () => {
        const sb = document.getElementById('ds-sidebar');
        if (!sb) return false;
        if (sidebarSide === 'right') return sb.style.right === '0px';
        return sb.style.left === '0px';
    };

    const showSidebar = () => {
        const c = document.getElementById('ds-sidebar');
        if (c) {
            if (sidebarSide === 'right') c.style.right = '0';
            else c.style.left = '0';
        }
        document.getElementById('ds-fab').classList.remove('visible');
    };

    const hideSidebar = () => {
        const c = document.getElementById('ds-sidebar');
        if (c) {
            if (sidebarSide === 'right') c.style.right = '-1200px';
            else c.style.left = '-1200px';
        }
        if (abortCtrl) abortCtrl.abort();
        const cp = document.getElementById('ds-config-panel');
        if (cp) cp.style.display = 'none';
        const hp = document.getElementById('ds-help-panel');
        if (hp) hp.style.display = 'none';
    };

    // 切换侧边栏状态（开/关）
    const toggleSidebarState = () => {
        if (isSidebarVisible()) hideSidebar();
        else showSidebar();
    };

    const switchTab = (tabName) => {
        if (tabName !== 'ai' && tabName !== 'highlight') return; activeTab = tabName;
        document.querySelectorAll('.ds-tab').forEach(tab => { tab.classList.remove('active'); if (tab.dataset.tab === tabName) tab.classList.add('active'); });
        document.querySelectorAll('.tab-panel').forEach(panel => { panel.classList.remove('active'); if (panel.dataset.panel === tabName) panel.classList.add('active'); });
        if (tabName === 'highlight') { refreshHighlightMenu(); applySavedHighlights(); }
    };

    function showSmartPopup(text, targetHighlight, context = "", isSelection = false) {
        if (!popupEl) return;
        if (isPopupLocked) {
             popupEl.style.left = savedPopupPos.x + 'px'; popupEl.style.top = savedPopupPos.y + 'px'; popupEl.style.transform = 'none';
        } else {
            let rect;
            if (isSelection) {
                 // 如果是基于文本选择打开的，计算选区位置
                 try {
                     rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                 } catch(e) { return; }
            } else if (targetHighlight) {
                 rect = targetHighlight.getBoundingClientRect();
            } else {
                return;
            }

            const pWidth = parseInt(popupEl.style.width || popupWidth) || 600;
            const pHeight = parseInt(popupEl.style.height || popupHeight) || 350;
            const viewportHeight = window.innerHeight; const viewportWidth = window.innerWidth;
            let top = rect.bottom + 10; let left = rect.left + (rect.width / 2) - (pWidth / 2);
            if (top + pHeight > viewportHeight) { top = rect.top - 10 - pHeight; if (top < 10) top = 10; }
            if (left < 10) left = 10; if (left + pWidth > viewportWidth - 10) left = viewportWidth - pWidth - 10;
            popupEl.style.top = top + 'px'; popupEl.style.left = left + 'px'; popupEl.style.transform = 'none';
        }
        popupEl.style.display = 'flex';
        currentPopupTrigger = targetHighlight;

        const body = popupEl.querySelector('#ds-popup-body');
        body.innerHTML = '';

        // 更新头部 HTML
        popupEl.innerHTML = `
            <div class="ds-resize-handle ds-rh-n" data-dir="n"></div><div class="ds-resize-handle ds-rh-s" data-dir="s"></div><div class="ds-resize-handle ds-rh-w" data-dir="w"></div><div class="ds-resize-handle ds-rh-e" data-dir="e"></div><div class="ds-resize-handle ds-rh-nw" data-dir="nw"></div><div class="ds-resize-handle ds-rh-ne" data-dir="ne"></div><div class="ds-resize-handle ds-rh-sw" data-dir="sw"></div><div class="ds-resize-handle ds-rh-se" data-dir="se"></div>
            <div id="ds-popup-header-bar">
                <div id="ds-popup-open-sidebar" class="ds-popup-icon" title="切换侧边栏 (显示/隐藏)">🏠</div>
                <div id="ds-popup-full-trans" class="ds-popup-icon" title="网页正文全文翻译 (点击切换)">🌐</div>
                <div id="ds-popup-lock" class="ds-popup-icon" title="锁定/解锁 (锁定后位置固定)">🔓</div>
                <div id="ds-popup-close-float" class="ds-popup-icon">✖</div>
            </div>
            <div id="ds-popup-body">
                <div class="ds-split-view">
                    <div class="ds-split-left" id="ds-popup-left-content"><div class="ds-popup-title">📖 词典解析</div><div class="ds-popup-text"></div></div>
                    <div class="ds-split-right" id="ds-popup-right-content"><div class="ds-popup-title">🔍 文中解析</div><div class="ds-popup-text"></div></div>
                </div>
            </div>
        `;

        document.getElementById('ds-popup-close-float').onclick = () => { popupEl.style.display = 'none'; currentPopupTrigger = null; };

        // 🏠 按钮改为 Toggle
        document.getElementById('ds-popup-open-sidebar').onclick = () => {
             toggleSidebarState();
        };
        // 🌐 按钮改为 Toggle
        document.getElementById('ds-popup-full-trans').onclick = () => {
             togglePageTranslation();
        };

        const lockBtn = document.getElementById('ds-popup-lock');
        lockBtn.onclick = () => {
            isPopupLocked = !isPopupLocked; GM_setValue('ds_popup_locked', isPopupLocked);
            if (isPopupLocked) { lockBtn.innerText = '🔒'; lockBtn.classList.add('locked'); savedPopupPos = { x: popupEl.offsetLeft, y: popupEl.offsetTop }; GM_setValue('ds_popup_pos', savedPopupPos); }
            else { lockBtn.innerText = '🔓'; lockBtn.classList.remove('locked'); }
        };
        if (isPopupLocked) { lockBtn.innerText = '🔒'; lockBtn.classList.add('locked'); }

        const headerBar = document.getElementById('ds-popup-header-bar');
        headerBar.addEventListener('mousedown', (e) => {
             const isClickable = e.target.closest('.ds-popup-icon');
             if (isClickable) return;
             isDraggingPopup = true; dragStartX = e.clientX; dragStartY = e.clientY; popupStartX = popupEl.offsetLeft; popupStartY = popupEl.offsetTop;
        });
        popupEl.querySelectorAll('.ds-resize-handle').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation(); e.preventDefault(); isResizingPopup = true; resizeDirection = el.dataset.dir; dragStartX = e.clientX; dragStartY = e.clientY; resizeStartRect = popupEl.getBoundingClientRect();
            });
        });
        const leftEl = popupEl.querySelector('#ds-popup-left-content .ds-popup-text');
        const rightEl = popupEl.querySelector('#ds-popup-right-content .ds-popup-text');
        popupEl.querySelector('#ds-popup-left-content').addEventListener('click', (e) => {
            const defLine = e.target.closest('.ds-def-line');
            if (defLine) { const defText = decodeURIComponent(defLine.dataset.def); window.updateRightPanelExamples(defText, text); }
        });

        const dictKey = text; const contextKey = text + "_" + context.substring(0, 20);
        let dictPrompt = isChinese(text) ? "你是一个专业的汉语词典。请严格按照以下格式解析中文词汇。\n不要直接提供例句！仅列出释义，每条释义单独一行。\n\n格式要求：\n词汇\n/拼音/\n词性. 含义\n词性. 含义\n..." : "你是一个专业的英语词典。请严格按照以下格式解析单词（注意：音标后必须换行）。\n不要直接提供例句！仅列出释义，每条释义单独一行。\n\n格式要求：\n单词\n/音标/\n词性. 中文释义\n詞性. 中文释义\n...";
        streamToElement(dictPrompt, text, leftEl, 'dict', dictKey, text, 'dict');
        const contextPrompt = `你是一个语言专家。请分析"${text}"在以下句子中的用法：\n\n"${context}"\n\n请模仿以下风格进行解析：\n"在句子 '...' 中，'${text}' 是...词性...形式，与...构成...搭配，表示...。这里的固定搭配是...，意思是...。"`;
        streamToElement(contextPrompt, context, rightEl, 'context', contextKey, text, 'normal');
    }

    function buildUI() {
        if (!isTopWindow) return;
        if (document.getElementById('ds-sidebar')) return;
        const container = document.createElement('div'); container.id = 'ds-sidebar';
        // 格式化 prompt 为字符串显示 (使用新格式 =)
        const promptString = customPrompts.map(p => `${p.name}=${p.template}`).join('\n');

        // 修改结构：Tab重命名为 AI 和 生词
        container.innerHTML = `
            <div id="ds-resizer"></div>
            <div id="ds-header">
                <div id="ds-tabs-wrapper">
                    <div class="ds-tab active" data-tab="ai">AI 助手</div>
                    <div class="ds-tab" data-tab="highlight">生词本</div>
                </div>
                <div id="ds-header-actions">
                    <div id="ds-help-btn" class="header-action" title="使用说明">❓</div>
                    <div id="ds-full-page-trans-btn" class="header-action" title="全文翻译开关">🌐</div>
                    <div id="ds-clear-cache" class="header-action" title="清除缓存">🗑️</div>
                    <div id="ds-cfg-toggle" class="header-action" title="设置">⚙️</div>
                    <div id="ds-close" class="header-action" title="关闭">✖</div>
                </div>
                <div id="ds-confirm-modal">
                    <div class="ds-confirm-box">
                        <div class="ds-confirm-text">确定要清空所有生词和缓存吗？</div>
                        <div class="ds-confirm-btns">
                            <button id="ds-confirm-yes" class="ds-btn ds-btn-yes">确定清空</button>
                            <button id="ds-confirm-no" class="ds-btn ds-btn-no">取消</button>
                        </div>
                    </div>
                </div>
                <div id="ds-config-panel">
                    <div class="ds-config-title">⚙️ 设置</div>
                    <div class="cfg-row" style="flex-direction:column; align-items:flex-start;"><span>DeepSeek API Key:</span><input type="text" id="cfg-api-key" style="width:100%;margin-top:5px;padding:6px;" value="${apiKey}"></div>
                    <div class="cfg-row" style="flex-direction:column; align-items:flex-start;">
                        <span class="ds-instruction-text">自定义Prompt格式：</span>
                        <span class="ds-instruction-text ds-instruction-highlight">按钮名=prompt具体指令</span>
                        <textarea id="cfg-prompts" placeholder="按钮名称=具体指令内容\n每行一条...">${promptString}</textarea>
                    </div>
                    <div class="cfg-row">
                        <span>深色模式</span>
                        <label class="ds-switch">
                            <input type="checkbox" id="sw-dark" ${isDarkMode?'checked':''}>
                            <span class="ds-slider"></span>
                        </label>
                    </div>
                    <div class="cfg-row">
                        <span>实时同步选词</span>
                        <label class="ds-switch">
                            <input type="checkbox" id="sw-import" ${autoImport?'checked':''}>
                            <span class="ds-slider"></span>
                        </label>
                    </div>
                    <div class="cfg-row">
                        <span>侧边栏位置 (关=右 / 开=左)</span>
                        <label class="ds-switch">
                            <input type="checkbox" id="sw-side" ${sidebarSide==='left'?'checked':''}>
                            <span class="ds-slider"></span>
                        </label>
                    </div>
                    <button id="save-api-key" class="ds-primary-btn">保存 API Key & Prompts</button>
                </div>
                <div id="ds-help-panel">
                    <div class="ds-help-title">❓ 使用说明</div>
                    <div class="ds-help-item">
                        <span class="ds-help-key">Alt + Alt</span>
                        <span class="ds-help-desc">当鼠标选中文字时，快速双击 Alt 可对该单词进行查词;当鼠标没有选中文字时，快速双击 Alt 可呼出/隐藏侧边栏。</span>
                    </div>
                    <div class="ds-help-item">
                        <span class="ds-help-key">Alt + 2</span>
                        <span class="ds-help-desc">在高亮词上按下该组合键（或者在高亮词上单击右键），可以对文字取消高亮。</span>
                    </div>
                    <div class="ds-help-item">
                        <span class="ds-help-key">Alt + 鼠标左键</span>
                        <span class="ds-help-desc">在段落文字上按下该组合键，可以自动翻译段落。对翻译出来的段落文字点击右键，可以隐藏该文字。</span>
                    </div>
                    <div class="ds-help-item">
                        <span class="ds-help-key">Alt + 1</span>
                        <span class="ds-help-desc">在生词上按下该组合键，可以对文字进行高亮。接下来左键点击高亮词，可以进行查词。</span>
                    </div>
                    <button id="ds-help-close" class="ds-primary-btn">关闭说明</button>
                </div>
            </div>
            <div id="ds-tab-content">
                <div class="tab-panel active" data-panel="ai" id="ds-ai-content">
                    <div id="ds-chat-log"></div>
                </div>
                <div class="tab-panel" data-panel="highlight" id="ds-highlight-content"></div>
            </div>
            <div id="ds-fn-bar"></div>
            <div id="ds-input-area">
                <div id="ds-input-wrapper">
                    <textarea id="ds-input" placeholder="DeepSeek AI 等待您的指令..."></textarea>
                    <button id="ds-send">↵</button>
                </div>
            </div>
        `;

        const fab = document.createElement('div'); fab.id = 'ds-fab'; fab.innerHTML = 'AI';
        fab.style.top = fabPos.top; fab.style.left = fabPos.left; fab.style.right = fabPos.right;

        popupEl = document.createElement('div'); popupEl.id = 'ds-popup';
        popupEl.style.width = popupWidth; popupEl.style.height = popupHeight;
        popupEl.innerHTML = `<div id="ds-popup-body"></div>`;
        popupEl.addEventListener('mouseup', () => { GM_setValue('ds_popup_width', popupEl.style.width); GM_setValue('ds_popup_height', popupEl.style.height); if (isPopupLocked) { savedPopupPos = { x: popupEl.offsetLeft, y: popupEl.offsetTop }; GM_setValue('ds_popup_pos', savedPopupPos); } });

        document.body.appendChild(container); document.body.appendChild(fab); document.body.appendChild(popupEl);
        highlightContentEl = document.getElementById('ds-highlight-content');
        renderCustomButtons(); applyTheme();
    }

    function renderCustomButtons() {
        const bar = document.getElementById('ds-fn-bar'); if (!bar) return; bar.innerHTML = '';
        const summaryBtn = document.createElement('div'); summaryBtn.id = 'fn-summary'; summaryBtn.className = 'fn-btn custom-prompt-btn'; summaryBtn.innerText = '全文总结';
        summaryBtn.onclick = () => { const content = getArticleContent(); askAI(`请对以下文章内容进行结构化总结：\n\n${content}`, "", "summary"); };
        bar.appendChild(summaryBtn);

        customPrompts.forEach(item => {
            if (!item.name || !item.template) return;
            const btn = document.createElement('div');
            btn.className = 'fn-btn custom-prompt-btn';
            btn.innerText = item.name;
            btn.title = item.template;
            btn.onclick = () => {
                const input = document.getElementById('ds-input');
                if (input) {
                    const val = input.value.trim();
                    if (!val) { alert("请先在输入框中输入内容或选中文本"); return; }
                    askAI(val, "", "custom", null, item.template);
                }
            };
            bar.appendChild(btn);
        });
    }

    // ==================== 4. 新手引导逻辑 ====================
    function showTutorial() {
        if (hasShownTutorial) return;
        const overlay = document.createElement('div');
        overlay.id = 'ds-tutorial-overlay';

        const steps = [
            {
                title: "👋 欢迎使用英语专家 AI 版",
                content: "本工具已全面升级为 DeepSeek 驱动。这里有几个核心功能助你高效阅读。",
                btn: "开始引导"
            },
            {
                title: "⚙️ 第一步：配置 API Key",
                content: "插件运行需要 DeepSeek API Key。请点击侧边栏右上角的<b>设置图标 (⚙️)</b>，填入您的 Key 并保存。没有 Key 无法翻译哦！",
                btn: "下一步"
            },
            {
                title: "🔑 核心快捷键: Alt + 1",
                content: "选中任何单词，按下 <b>Alt + 1</b>，即可<b>高亮</b>该词并在侧边栏记录生词，同时弹窗显示 AI 深度解析。",
                btn: "下一步"
            },
            {
                title: "🧹 清除高亮: Alt + 2",
                content: "如果不想要某个高亮，将鼠标悬停在单词上，按下 <b>Alt + 2</b> 即可移除。",
                btn: "下一步"
            },
            {
                title: "💬 内联翻译: Alt + 左键",
                content: "按住 <b>Alt</b> 键并<b>左键点击</b>任意文本段落，DeepSeek 会在下方直接插入中文翻译。",
                btn: "下一步"
            },
            {
                title: "🏠 侧边栏: 双击 Alt",
                content: "快速<b>双击 Alt 键</b>，可以随时呼出或隐藏 AI 侧边栏。",
                btn: "开始使用"
            }
        ];

        let currentStep = 0;

        const renderStep = () => {
            overlay.innerHTML = '';
            const step = steps[currentStep];
            const bubble = document.createElement('div');
            bubble.className = 'ds-tutorial-bubble';
            bubble.innerHTML = `
                <div class="ds-tut-header">
                    <span>${step.title}</span>
                </div>
                <div class="ds-tut-step">${step.content}</div>
                <div class="ds-tut-action">
                    <button class="ds-tut-btn ds-tut-skip">跳过</button>
                    <button class="ds-tut-btn ds-tut-next">${step.btn}</button>
                </div>
            `;
            overlay.appendChild(bubble);

            bubble.querySelector('.ds-tut-next').onclick = () => {
                currentStep++;
                if (currentStep < steps.length) {
                    renderStep();
                } else {
                    closeTutorial();
                }
            };
            bubble.querySelector('.ds-tut-skip').onclick = closeTutorial;
        };

        const closeTutorial = () => {
            overlay.remove();
            hasShownTutorial = true;
            GM_setValue('ds_has_shown_tutorial_v3', true);
            showSidebar(); // 引导结束后展示侧边栏
        };

        document.body.appendChild(overlay);
        renderStep();
    }

    // ==================== 事件绑定 (最终修复版：冷却锁) ====================
    function bindEvents() {
        document.addEventListener('mousemove', e => {
            lastX = e.clientX; lastY = e.clientY;
            if (isTopWindow) {
                if (isDraggingFab) {
                    const dx = e.clientX - fabDragStartX; const dy = e.clientY - fabDragStartY;
                    const fab = document.getElementById('ds-fab');
                    if (fab) { fab.style.left = (fabStartLeft + dx) + 'px'; fab.style.top = (fabStartTop + dy) + 'px'; fab.style.right = 'auto'; }
                    return;
                }
                if (isResizingPopup && popupEl) {
                    const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY; const startRect = resizeStartRect;
                    if (resizeDirection.includes('e')) { popupEl.style.width = (startRect.width + dx) + 'px'; }
                    if (resizeDirection.includes('w')) { popupEl.style.width = (startRect.width - dx) + 'px'; popupEl.style.left = (startRect.left + dx) + 'px'; }
                    if (resizeDirection.includes('s')) { popupEl.style.height = (startRect.height + dy) + 'px'; }
                    if (resizeDirection.includes('n')) { popupEl.style.height = (startRect.height - dy) + 'px'; popupEl.style.top = (startRect.top + dy) + 'px'; }
                    return;
                }
                const fab = document.getElementById('ds-fab');
                if (fab && !isSidebarVisible() && !isDraggingFab) {
                    const nearLeft = e.clientX < 50; const nearRight = e.clientX > window.innerWidth - 50;
                    if (nearLeft || nearRight) {
                          fab.classList.add('visible');
                          if (fabHideTimer) clearTimeout(fabHideTimer);
                          fabHideTimer = setTimeout(() => { if(!fab.matches(':hover')) { fab.classList.remove('visible'); } }, 5000);
                    }
                }
                if(fab && fab.matches(':hover') && fabHideTimer) { clearTimeout(fabHideTimer); }
                const isResizing = document.getElementById('ds-resizer')?.dataset.resizing === 'true';
                if (isResizing) {
                    const container = document.getElementById('ds-sidebar');
                    if (container) {
                        let width; if (sidebarSide === 'right') width = window.innerWidth - e.clientX; else width = e.clientX;
                        if (width > 300 && width < window.innerWidth * 0.9) { container.style.width = width + 'px'; GM_setValue('sidebar_width', width); }
                    }
                }
                if (isDraggingPopup && popupEl) {
                    const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY;
                    popupEl.style.left = (popupStartX + dx) + 'px'; popupEl.style.top = (popupStartY + dy) + 'px';
                }
            }
        }, {passive: true});

        // ========== 核心修复区域：按键逻辑 ==========
        let lastAltUpTime = 0;
        let sidebarLockUntil = 0; // 冷却锁：在此时间戳之前，禁止触发侧边栏
        let isAltDown = false;

        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

            // 1. 监听 Alt 按下
            if (e.key === 'Alt') { isAltDown = true; }

            // 2. Alt+1 高亮
            if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
                e.preventDefault();
                sidebarLockUntil = Date.now() + 600; // 【关键】上锁 600ms，防止侧边栏误触

                const sel = window.getSelection(); let range = null;
                if (sel.rangeCount && sel.toString().trim()) { range = sel.getRangeAt(0); }
                else { const wordObj = getCurrentSentence(); if (wordObj) { range = document.createRange(); range.setStart(wordObj.node, wordObj.s); range.setEnd(wordObj.node, wordObj.e); } }
                if (range) {
                    const text = range.toString().trim(); const parent = range.commonAncestorContainer.parentElement;
                    if (parent && parent.classList.contains(highlightClass)) return;
                    if (range.cloneContents().querySelector(`.${highlightClass}`)) return;
                    copyToClip(text); // 【新增】Alt+1 复制到剪贴板
                    const mark = document.createElement('mark'); mark.className = highlightClass; mark.appendChild(range.extractContents()); range.insertNode(mark);
                    saveHighlights(); sel.removeAllRanges(); getDeepSeekVocabDef(text);
                }
            }

            // 3. Alt+2 删除高亮
            if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
                e.preventDefault();
                sidebarLockUntil = Date.now() + 600; // 【关键】上锁

                const el = document.elementFromPoint(lastX, lastY);
                if (el) { const hl = el.closest(`.${highlightClass}`); if (hl) { removeHighlight(hl); return; } }
            }
        }, true);

        // 处理 Alt 键释放 (侧边栏触发逻辑)
        if (isTopWindow) {
            document.addEventListener('keyup', (e) => {
                if (e.key === 'Alt') {
                    isAltDown = false;
                    const now = Date.now();

                    // 【核心判定】如果当前处于冷却锁定期，直接无视这次 Alt 松开
                    if (now < sidebarLockUntil) {
                        lastAltUpTime = 0; // 重置连击状态
                        return;
                    }

                    if (now - lastAltUpTime < 350) {
                        // Double Click Detected
                        const selText = window.getSelection().toString().trim();
                        const isPopupOpen = popupEl && popupEl.style.display !== 'none';
                        const isSidebarOpen = isSidebarVisible();

                        // 优先级 1: 如果解析面板开着且未锁定，双击先关解析面板
                        // 【修改】如果面板已锁定 (!isPopupLocked 为 false)，则跳过此关闭逻辑，继续向下执行
                        if (isPopupOpen && !isPopupLocked) {
                             popupEl.style.display = 'none';
                             currentPopupTrigger = null;
                             clearAllInlineTranslations();
                        }
                        // 优先级 2: 如果有选中文本，双击打开解析面板
                        else if (selText.length > 0) {
                             copyToClip(selText); // 【新增】选中文字双击Alt复制
                             let context = "";
                             try { context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e){}
                             showSmartPopup(selText, null, context, true); // true 表示是选区触发
                        }
                        // 优先级 3: 否则切换侧边栏
                        else {
                             // 【V1.5 修复】双击Alt逻辑优化：如果没开，打开并切到生词本；如果开了，关闭
                             if (isSidebarVisible()) {
                                 hideSidebar();
                             } else {
                                 showSidebar();
                                 switchTab('highlight'); // 强制切换到生词本Tab
                             }
                        }

                        lastAltUpTime = 0;
                    } else {
                        lastAltUpTime = now;
                    }
                }
            }, true);
        }

        // ... 保持原本的 click/mouseup 逻辑 ...
        document.addEventListener('click', e => { if (e.altKey) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
        if (isTopWindow) {
            document.addEventListener('mouseup', () => {
                const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'false';
                isDraggingPopup = false; isResizingPopup = false;
                if (isDraggingFab) {
                      isDraggingFab = false; const fab = document.getElementById('ds-fab');
                      if(fab) { fabPos = { top: fab.style.top, left: fab.style.left, right: 'auto' }; GM_setValue('ds_fab_pos', fabPos); setTimeout(() => { fab.style.pointerEvents = 'auto'; }, 100); }
                }
            });
            document.getElementById('ds-help-btn')?.addEventListener('click', () => { const hp = document.getElementById('ds-help-panel'); if (hp) { hp.style.display = hp.style.display === 'flex' ? 'none' : 'flex'; } });
            document.getElementById('ds-help-close')?.addEventListener('click', () => { const hp = document.getElementById('ds-help-panel'); if (hp) hp.style.display = 'none'; });
            document.getElementById('ds-full-page-trans-btn')?.addEventListener('click', togglePageTranslation);
            document.getElementById('save-api-key')?.addEventListener('click', () => {
                // 保存逻辑仅保留 API Key 和 Prompts，其他状态在 change 事件中已即时保存
                const cfgApiKey = document.getElementById('cfg-api-key'); const cfgPrompts = document.getElementById('cfg-prompts');
                if (!cfgApiKey) return; apiKey = cfgApiKey.value;
                const rawLines = cfgPrompts.value.split('\n'); customPrompts = [];
                rawLines.forEach(line => {
                    if (line.includes('=')) { const parts = line.split('='); if (parts.length >= 2) { const name = parts[0].trim(); const template = line.substring(line.indexOf('=') + 1).trim(); if(name && template) customPrompts.push({name, template}); } }
                    else if (line.includes('::')) { const parts = line.split('::'); if (parts.length >= 2) { const name = parts[0].trim(); const template = line.substring(line.indexOf('::') + 2).trim(); if(name && template) customPrompts.push({name, template}); } }
                });
                GM_setValue('ds_api_key', apiKey); GM_setValue('ds_custom_prompts', customPrompts);
                renderCustomButtons();
                // 1. 自动关闭设置面板
                const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = 'none';
            });

            // ========== 新增滑块即时响应逻辑 ==========
            document.getElementById('sw-dark')?.addEventListener('change', (e) => {
                isDarkMode = e.target.checked;
                GM_setValue('ds_sidebar_dark_mode', isDarkMode);
                applyTheme(); // 立即应用主题
            });

            document.getElementById('sw-import')?.addEventListener('change', (e) => {
                autoImport = e.target.checked;
                GM_setValue('ds_auto_import', autoImport);
            });

            document.getElementById('sw-side')?.addEventListener('change', (e) => {
                sidebarSide = e.target.checked ? 'left' : 'right'; // 选中为左，未选中为右
                GM_setValue('ds_sidebar_side', sidebarSide);
                updateSidebarPosition(); // 立即调整位置
            });
            // ======================================

            // 优雅的确认对话框逻辑
            const confirmModal = document.getElementById('ds-confirm-modal');
            const confirmYes = document.getElementById('ds-confirm-yes');
            const confirmNo = document.getElementById('ds-confirm-no');

            document.getElementById('ds-clear-cache')?.addEventListener('click', () => {
                confirmModal.style.display = 'flex';
            });

            confirmYes.onclick = () => {
                Object.keys(localStorage).forEach(k => { if(k.startsWith(STORAGE_PREFIX) || k === VOCAB_CACHE_KEY) localStorage.removeItem(k); });
                location.reload();
            };

            confirmNo.onclick = () => {
                confirmModal.style.display = 'none';
            };

            document.getElementById('ds-chat-log')?.addEventListener('contextmenu', (e) => { e.preventDefault(); if (abortCtrl) { abortCtrl.abort(); } });
            document.querySelectorAll('.ds-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
            // 设置按钮逻辑优化：打开/关闭
            document.getElementById('ds-cfg-toggle')?.addEventListener('click', () => { const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = cp.style.display === 'flex' ? 'none' : 'flex'; });

            const handleSendQuery = () => { const el = document.getElementById('ds-input'); if (!el) return; const val = el.value.trim(); if (val) { if (activeTab !== 'ai') switchTab('ai'); askAI(val,"","chat"); el.value = ""; autoResizeInput(); } };
            document.getElementById('ds-send')?.addEventListener('click', handleSendQuery);
            document.getElementById('ds-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { if (!e.shiftKey) { e.preventDefault(); handleSendQuery(); } else setTimeout(autoResizeInput,0); } });
            document.getElementById('ds-resizer')?.addEventListener('mousedown', () => { const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'true'; });
            document.getElementById('ds-close')?.addEventListener('click', hideSidebar);
            document.getElementById('ds-input')?.addEventListener('input', autoResizeInput);
            document.addEventListener('selectionchange', () => { if (!autoImport) return; const sel = window.getSelection().toString().trim(); const el = document.getElementById('ds-input'); if (sel && sel.length < 500 && el) { el.value = sel; lastSelection.word = sel; autoResizeInput(); try { lastSelection.context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e) {lastSelection.context = "";} } });
            const fab = document.getElementById('ds-fab');
            if (fab) {
                fab.addEventListener('mousedown', (e) => { if (e.button !== 0) return; isDraggingFab = true; fabDragStartX = e.clientX; fabDragStartY = e.clientY; fabStartLeft = fab.offsetLeft; fabStartTop = fab.offsetTop; });
                fab.addEventListener('click', (e) => { const dist = Math.hypot(e.clientX - fabDragStartX, e.clientY - fabDragStartY); if (dist < 5) { showSidebar(); if (activeTab === 'highlight') switchTab('highlight'); } });
            }
        }
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const sidebar = document.getElementById('ds-sidebar'); const popup = document.getElementById('ds-popup'); const fab = document.getElementById('ds-fab'); const targetHighlight = e.target.closest(`.${highlightClass}`);
            if (targetHighlight) return;
            const inSidebar = sidebar && sidebar.contains(e.target); const inPopup = popup && popup.style.display !== 'none' && popup.contains(e.target); const inFab = fab && fab.contains(e.target);
            if (!inSidebar && !inPopup && !inFab) { if (popup && popup.style.display !== 'none' && !isPopupLocked && isTopWindow) { popup.style.display = 'none'; currentPopupTrigger = null; clearAllInlineTranslations(); } }
            // Alt + Click 也会上锁，防止点击触发侧边栏
            if (e.altKey) { sidebarLockUntil = Date.now() + 600; }
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 2) return;
            const targetTrans = e.target.closest('.web-inline-trans, .ds-full-page-trans'); if (targetTrans) { e.preventDefault(); e.stopPropagation(); targetTrans.remove(); return; }
            const targetHighlight = e.target.closest(`.${highlightClass}`); if (targetHighlight) { e.preventDefault(); e.stopPropagation(); removeHighlight(targetHighlight); return; }
            const sidebar = document.getElementById('ds-sidebar'); const popup = document.getElementById('ds-popup');
            const inSidebar = sidebar && sidebar.contains(e.target); const inPopup = popup && popup.style.display !== 'none' && popup.contains(e.target);
            if (!inSidebar && !inPopup && isTopWindow) { if (isSidebarVisible()) hideSidebar(); if (popup && popup.style.display !== 'none') { if (!isPopupLocked) { popup.style.display = 'none'; currentPopupTrigger = null; clearAllInlineTranslations(); } } }
        });
        document.addEventListener('mousedown', e => {
            const targetHighlight = e.target.closest(`.${highlightClass}`);
            if (e.altKey && e.button === 0 && !targetHighlight) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); clearAllInlineTranslations();
                let sel = window.getSelection().toString().trim(); let container = e.target;
                const renderTrans = (nodeToInsertAfter) => { const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = "DeepSeek 思考中..."; nodeToInsertAfter.after(transSpan); return transSpan; };
                if (sel.length > 0) { const selection = window.getSelection(); if (!selection.rangeCount) return; const range = selection.getRangeAt(0); const sourceSpan = document.createElement('span'); sourceSpan.className = 'web-trans-source-highlight'; sourceSpan.appendChild(range.extractContents()); range.insertNode(sourceSpan); selection.removeAllRanges(); const transSpan = renderTrans(sourceSpan); streamDeepSeekInline(sel, transSpan); }
                else { while (container && container !== document.body && window.getComputedStyle(container).display === 'inline') container = container.parentElement; const text = container.textContent.trim(); if (text.length > 2) { const tempSpan = document.createElement('div'); container.appendChild(tempSpan); tempSpan.className = 'web-inline-trans'; tempSpan.textContent = "DeepSeek 思考中..."; streamDeepSeekInline(text, tempSpan); } }
                return;
            }
            if (targetHighlight && e.button === 0 && !e.altKey) {
                e.preventDefault(); e.stopPropagation();
                const text = targetHighlight.textContent.trim(); const parentBlock = targetHighlight.closest('p, div, li, h1, h2, h3') || targetHighlight.parentElement; const context = parentBlock ? parentBlock.innerText : text;
                copyToClip(text); // 【新增】点击高亮词复制到剪贴板
                if (isSidebarVisible() && isTopWindow) { const input = document.getElementById('ds-input'); if(input) { input.value = text; autoResizeInput(); } }
                const isWord = (text.split(/\s+/).length <= 3 && text.length < 30);
                if (isWord) { if (isTopWindow) { if (popupEl.style.display === 'flex' && currentPopupTrigger === targetHighlight && !isPopupLocked) { popupEl.style.display = 'none'; currentPopupTrigger = null; return; } showSmartPopup(text, targetHighlight, context); } }
                else { clearAllInlineTranslations(); const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = "DeepSeek 思考中..."; if (targetHighlight.nextSibling) targetHighlight.parentNode.insertBefore(transSpan, targetHighlight.nextSibling); else targetHighlight.parentNode.appendChild(transSpan); streamDeepSeekInline(text, transSpan); }
            }
        }, true);
    }

    function initTimedTasks() { setInterval(() => { if (!isRestoring && isSidebarVisible()) { applySavedHighlights(); } }, 2000); }
    async function init() {
        buildUI();
        bindEvents();
        initTimedTasks();
        refreshHighlightMenu();
        setTimeout(showTutorial, 1000);
    }
    init();
})();