// ==UserScript==
// @name         英语专家 (V1.0 谷歌deepseek交互版)
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @license      MIT
// @description  集成 DeepSeek AI 的全能语言助手。支持网页划词翻译、单词深度辨析（词源、同义词、词根）、全文内联翻译及 AI 交互聊天。内置 IPA 音标发音与侧边栏管理，让外文阅读与英语学习更智能。
// @author       Gemini & 豆包编程助手
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      api.deepseek.com
// @connect      translate.googleapis.com
// @connect      api.dictionaryapi.dev
// @downloadURL https://update.greasyfork.org/scripts/563133/%E8%8B%B1%E8%AF%AD%E4%B8%93%E5%AE%B6%20%28V10%20%E8%B0%B7%E6%AD%8Cdeepseek%E4%BA%A4%E4%BA%92%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563133/%E8%8B%B1%E8%AF%AD%E4%B8%93%E5%AE%B6%20%28V10%20%E8%B0%B7%E6%AD%8Cdeepseek%E4%BA%A4%E4%BA%92%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 0. 环境检测与配置 ====================
    const isTopWindow = (window.self === window.top);

    // 全局变量
    let apiKey = GM_getValue('ds_api_key', '');
    let sidebarWidth = GM_getValue('sidebar_width', 450);
    let sidebarSide = GM_getValue('ds_sidebar_side', 'right'); // 'left' or 'right'
    let popupWidth = GM_getValue('ds_popup_width', '600px');
    let popupHeight = GM_getValue('ds_popup_height', '350px');
    let isDarkMode = GM_getValue('ds_sidebar_dark_mode', false);
    let autoImport = GM_getValue('ds_auto_import', true);
    let useDeepSeekForInline = GM_getValue('ds_use_deepseek_inline', false);

    // 弹窗状态持久化
    let isPopupLocked = GM_getValue('ds_popup_locked', false);
    let savedPopupPos = GM_getValue('ds_popup_pos', {x: 100, y: 100});

    // 悬浮球位置持久化
    let fabPos = GM_getValue('ds_fab_pos', { top: '25px', left: '25px', right: 'auto' });

    // 自定义 Prompt
    const defaultPrompts = [
        {name: "同义词", template: "请作为语言专家，列出与查询词【同语种】的至少5个同义词，并进行简要辨析。"},
        {name: "反义词", template: "请作为语言专家，列出与查询词【同语种】的至少5个反义词，并进行简要说明。"},
        {name: "同根词", template: "请作为语言专家，列出与查询词【同语种】的至少5个同根词或派生词。"},
        {name: "词源词根", template: "请详细分析该词的词源和词根（使用与查询词相同的语言或英语学术解释），字数控制在50字到200字之间。"}
    ];
    let rawPrompts = GM_getValue('ds_custom_prompts', defaultPrompts);
    let customPrompts = [];
    if (Array.isArray(rawPrompts) && rawPrompts.length > 0 && typeof rawPrompts[0] === 'string') {
        customPrompts = rawPrompts.map(p => ({name: p.substring(0, 4), template: p}));
    } else {
        customPrompts = rawPrompts;
    }

    let lastSelection = { word: "", context: "" };
    let altCnt = 0;
    let altTimer = null;
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
    const TRANS_CACHE_KEY = 'v3_trans_cache_v2';
    const VOCAB_CACHE_KEY = 'v3_vocab_ds_cache';
    const STORAGE_KEY = STORAGE_PREFIX + btoa(encodeURIComponent(window.location.host + window.location.pathname)).substring(0, 50);

    // 弹窗会话缓存
    const POPUP_CACHE = { dict: {}, context: {} };

    let lastX = 0, lastY = 0;
    let isRestoring = false;
    let isRequesting = false;
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
    let fabHideTimer = null; // 悬浮球隐藏定时器

    // 面板调整大小状态
    let isResizingPopup = false;
    let resizeDirection = ''; // 'nw', 'ne', 'sw', 'se'
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
            hoverBg: 'rgba(255,255,255,0.1)'
        } : {
            bg: '#ffffff', text: '#1c1c1e', msgBg: '#f2f2f7', border: '#e5e5ea',
            userBg: '#007aff', userText: '#ffffff', headerBg: '#007aff', accent: '#007aff',
            highlightBg: '#8B0000', highlightText: '#ffffff',
            menuItemBg: 'rgba(200, 200, 210, 0.08)', menuItemActiveBg: 'rgba(200, 200, 210, 0.3)',
            tabActiveBg: 'rgba(255,255,255,0.25)', tabInactiveText: 'rgba(255,255,255,0.7)',
            popupBg: '#ffffff', popupBorder: '#e5e5ea',
            hoverBg: 'rgba(0,0,0,0.05)'
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

            #ds-traffic-light { width: 19px; height: 19px; border-radius: 50%; background: ${useDeepSeekForInline ? '#ff453a' : '#30d158'}; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 0 5px rgba(0,0,0,0.3); transition: background 0.3s, transform 0.2s; cursor: pointer; }
            #ds-traffic-light:hover { transform: scale(1.1); }

            #ds-tab-content{ flex:1;overflow:hidden;display:flex;flex-direction:column; position:relative; }
            .tab-panel{ display:none;flex-direction:column;height:100%;width:100%;overflow:hidden; }
            .tab-panel.active{display:flex;}
            #ds-ai-content{flex:1;}
            #ds-chat-log{ flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column; gap:15px;margin:0; }
            .ds-msg{ padding:12px 16px;border-radius:12px;font-size:14.5px;line-height:1.6; max-width:92%;word-wrap:break-word; }
            .user-msg{align-self:flex-end;background:${t.userBg}!important;color:${t.userText}!important;}
            .ai-msg{ align-self:flex-start;background:${t.msgBg}!important;color:${t.text}!important; border:1px solid ${t.border};white-space:pre-wrap; }

            .ds-continue-btn {
                align-self: flex-start; margin-top: -5px; padding: 4px 10px;
                background: ${t.accent}; color: white; border-radius: 12px;
                font-size: 12px; cursor: pointer; border: none; opacity: 0.8;
                transition: opacity 0.2s;
            }
            .ds-continue-btn:hover { opacity: 1; }

            .highlight-word{color:#1E90FF!important;font-weight:bold!important;text-decoration:none !important; background: rgba(30, 144, 255, 0.1); padding: 0 2px; border-radius: 2px;}

            /* Prompt按钮栏 */
            #ds-fn-bar{ padding:8px 15px 4px 15px; display:flex; gap:6px; flex-wrap: wrap; border-top:1px solid ${t.border}; background:${t.bg}; flex-shrink:0; max-height: 120px; overflow-y: auto; }
            .fn-btn{ flex:1; min-width: 70px; padding:6px 8px; text-align:center; border-radius:6px; cursor:pointer; font-weight:bold;font-size:12px;color:white!important; transition:transform 0.1s;white-space:nowrap; display: flex; align-items: center; justify-content: center; }
            .fn-btn:active{transform:scale(0.95);}
            .custom-prompt-btn { background: ${t.accent}; opacity: 0.9; flex: 0 1 auto !important; }

            /* 输入框区域 */
            #ds-input-area{ padding:4px 15px 15px 15px; background:${t.bg}; flex-shrink:0;margin:0!important;box-sizing:border-box!important;width:100%; }
            #ds-input-wrapper{ display:flex;align-items:stretch;gap:8px;width:100%;box-sizing:border-box; }
            #ds-input{ flex:1;min-height:60px;max-height:200px;border-radius:8px;border:1px solid ${t.border}; padding:8px;outline:none;box-sizing:border-box; background:${isDarkMode?t.msgBg:'#fff'}!important;color:${t.text}!important; font-family:inherit;resize:none;font-size:14px;line-height:1.5;margin:0; }
            #ds-send{ width:40px;border:none;border-radius:8px;background:${t.accent}!important; color:white!important;cursor:pointer;font-size:18px; display:flex;align-items:center;justify-content:center; transition:background 0.2s ease;flex-shrink:0; }
            #ds-send:hover{background:${t.accent}dd!important;}

            #ds-config-panel{ position:absolute;top:55px;right:10px;width:300px;background:${t.bg}; border:1px solid ${t.border};border-radius:12px;padding:18px;display:none; box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:2147483649;color:${t.text}; border-top:4px solid ${t.accent}; }
            .cfg-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
            #cfg-api-key{width:100%;margin-top:5px;padding:6px;border-radius:4px;border:1px solid ${t.border};background:${t.msgBg};color:${t.text};}
            #cfg-prompts { width: 100%; height: 120px; padding: 6px; border-radius: 4px; border: 1px solid ${t.border}; background: ${t.msgBg}; color: ${t.text}; font-family: monospace; font-size: 12px; resize: vertical; margin-top: 5px; white-space: pre; overflow-x: auto; }

            #ds-highlight-content{flex:1;}
            #ds-highlight-log{ flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column; gap:6px; margin:0; }
            .${highlightClass} { background-color: ${t.highlightBg} !important; color: ${t.highlightText} !important; padding: 0 2px !important; border-radius: 2px; cursor: pointer; display: inline; }

            .web-inline-trans {
                color: #1E90FF !important; font-size: 0.95em !important; font-weight: normal !important;
                margin-left: 0px !important; display: block !important; background: transparent !important;
                box-shadow: none !important; border: none !important; padding: 4px 0 8px 0 !important;
            }
            .web-inline-trans::before { content: ""; }

            .web-menu-item { display: flex !important;flex-direction: column !important; align-items: flex-start !important; padding: 10px 12px !important; margin: 0 !important; background: ${t.menuItemBg} !important;border-radius: 8px !important; cursor: pointer !important;transition: background-color 0.1s ease !important; }
            .web-menu-item:hover { background: ${t.menuItemActiveBg} !important; }
            .web-menu-header { display:flex; justify-content:flex-start; width:100%; align-items:baseline; gap: 8px; }
            .web-menu-word { font-weight: 700 !important; color: ${t.text} !important; font-size: 15px !important; }
            .web-menu-ipa { font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif; color: #888 !important; font-size: 13px !important; }
            .web-menu-trans { display: block !important; margin-top: 4px !important; color: ${t.text} !important; opacity: 0.9; font-size: 13px !important; line-height: 1.4 !important; white-space: pre-wrap !important; word-break: break-all !important; width: 100% !important; }

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
            .ds-popup-loading { color: #888; font-style: italic; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

            .ds-target-italic { color: #1E90FF !important; font-weight: bold; font-style: italic; }
            .ds-head-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
            .ds-headword { color: #1E90FF !important; font-weight: 900; font-size: 1.5em; display: inline-block; }
            .ds-speaker-svg { width: 14px; height: 14px; vertical-align: middle; fill: #888; margin-left: 4px; cursor: pointer; transition: fill 0.2s; }
            .ds-speaker-svg:hover { fill: ${t.accent}; }
            .ds-clickable-ipa { font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif; color: #888; cursor: pointer; font-size: 0.9em; display: inline-flex; align-items: center; }
            .ds-clickable-ipa:hover { color: ${t.accent}; }
            .ds-dict-grid { display: grid; grid-template-columns: 45px 1fr; gap: 2px 0px; align-items: baseline; }
            .ds-pos-label { text-align: right; color: #888; font-style: italic; font-weight: bold; font-size: 0.85em; user-select: none; white-space: nowrap; overflow: visible; padding-right: 8px; }
            .ds-def-line { cursor: pointer; padding: 0; margin-bottom: 0; display: inline-block; line-height: 1.35; position: relative; }
            .ds-def-line:hover { color: ${t.accent}; }
            .ds-def-line.active-def { color: ${t.accent}; font-weight: 600; }
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
        const config = document.getElementById('ds-config-panel');
        if (!sb || !resizer) return;

        sb.style.left = ''; sb.style.right = ''; sb.style.borderLeft = ''; sb.style.borderRight = '';
        resizer.style.left = ''; resizer.style.right = '';

        const t = isDarkMode ? { border: '#1a4a58' } : { border: '#e5e5ea' };

        if (sidebarSide === 'right') {
            sb.style.right = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderLeft = `1px solid ${t.border}`;
            sb.style.boxShadow = '-10px 0 30px rgba(0,0,0,0.3)';
            resizer.style.left = '0';
            if (config) config.style.right = '10px';
        } else {
            sb.style.left = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderRight = `1px solid ${t.border}`;
            sb.style.boxShadow = '10px 0 30px rgba(0,0,0,0.3)';
            resizer.style.right = '0';
            if (config) config.style.left = '10px';
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
                    transSpan.className = 'web-inline-trans ds-full-page-trans'; // 添加专用class以便清除
                    transSpan.style.color = '#1E90FF';
                    transSpan.style.fontSize = '0.95em';
                    transSpan.innerText = "正在翻译...";
                    el.appendChild(transSpan);

                    getTranslation(text, (res) => {
                         transSpan.innerText = res;
                    });
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

    function playNetworkAudio(word) {
        if (!word) return;
        word = word.replace(/[\/\[\]]/g, '').trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (Array.isArray(data) && data.length > 0) {
                        let audioUrl = "";
                        for (const entry of data) {
                            for (const phone of entry.phonetics) { if (phone.audio) { audioUrl = phone.audio; break; } }
                            if (audioUrl) break;
                        }
                        if (audioUrl) new Audio(audioUrl).play();
                        else alert("暂无发音源");
                    }
                } catch(e) {}
            }
        });
    }

    function getTranslation(text, callback) {
        if (!text || text.trim().length < 1) return;
        const cache = JSON.parse(localStorage.getItem(TRANS_CACHE_KEY) || '{}');
        if (cache[text]) return callback(cache[text]);
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
            timeout: 5000,
            onload: (res) => {
                if (res.status !== 200) return;
                try {
                    const data = JSON.parse(res.responseText);
                    let trans = "";
                    data[0].forEach(line => { if(line[0]) trans += line[0]; });
                    if (trans.trim()) {
                        cache[text] = trans;
                        localStorage.setItem(TRANS_CACHE_KEY, JSON.stringify(cache));
                        callback(trans);
                    }
                } catch (e) {}
            }
        });
    }

    function getDeepSeekVocabDef(word, callback) {
        if (!apiKey) return;
        const cache = JSON.parse(localStorage.getItem(VOCAB_CACHE_KEY) || '{}');
        if (cache[word] && cache[word] !== "...") {
            if (callback) callback(cache[word]);
            return;
        }
        if (!cache[word]) {
            cache[word] = "...";
            localStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(cache));
            if (callback) callback("...");
        }
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
                stream: false
            })
        }).then(res => res.json()).then(data => {
            const content = data.choices?.[0]?.message?.content || "查询失败";
            cache[word] = content.trim();
            localStorage.setItem(VOCAB_CACHE_KEY, JSON.stringify(cache));
            if (callback) callback(content.trim());
        }).catch(e => { console.error("DS Fetch Error", e); });
    }

    async function streamDeepSeekInline(text, targetElement) {
        if (!apiKey) { targetElement.innerText = "请配置 API Key"; return; }
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
                })
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            targetElement.innerText = "";
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line!=='data: [DONE]') {
                        const data = JSON.parse(line.substring(6));
                        const delta = data.choices[0].delta.content || "";
                        targetElement.innerText += delta;
                    }
                }
            }
        } catch (e) { targetElement.innerText = "DeepSeek Error: " + e.message; }
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

    async function streamToElement(sysPrompt, userPrompt, targetElement, cacheCategory, cacheKey, highlightWord = null, mode = 'normal') {
        if (cacheCategory && cacheKey && POPUP_CACHE[cacheCategory][cacheKey]) {
            targetElement.innerHTML = POPUP_CACHE[cacheCategory][cacheKey];
            return;
        }
        if (!apiKey) { targetElement.innerText = "请配置 API Key"; return; }
        targetElement.innerHTML = "<span class='ds-popup-loading'>Analyzing...</span>";

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [{role:"system",content:sysPrompt},{role:"user",content:userPrompt}],
                    stream: true
                })
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
                                const speakerSvg = `<svg class="ds-speaker-svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`;
                                const ipaHtml = ipa ? `<span class="ds-clickable-ipa" onclick="window.playAudio(this, '${ipa.replace(/[\/\[\]]/g,'')}')">${ipa}${speakerSvg}</span>` : '';

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
        } catch (e) { targetElement.innerText = "Error: " + e.message; }
    }

    window.updateRightPanelExamples = function(defText, word) {
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
        streamToElement(prompt, "OneExample", rightBody, null, null, word, 'normal');
    };

    window.playAudio = function(el, ipaText) {
        event.stopPropagation();
        const headword = document.querySelector('.ds-headword')?.innerText || "";
        if (isChinese(headword)) {
            const u = new SpeechSynthesisUtterance(headword); u.lang = 'zh-CN'; window.speechSynthesis.speak(u);
        } else { if(headword) playNetworkAudio(headword); }
    };

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
                const continueBtn = document.createElement('button');
                continueBtn.className = 'ds-continue-btn'; continueBtn.innerText = '👉 点击继续生成';
                continueBtn.onclick = function() {
                    this.remove();
                    const newMessages = [...currentAiContext.messages];
                    if (newMessages[newMessages.length - 1].role !== 'assistant') { newMessages.push({role: "assistant", content: currentAiContext.generatedText}); }
                    else { newMessages[newMessages.length - 1].content = currentAiContext.generatedText; }
                    newMessages.push({role: "user", content: "请继续（Continue）"});
                    askAI("", targetWord, mode, newMessages);
                };
                log.appendChild(continueBtn); log.scrollTop = log.scrollHeight;
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
            if (cachedContent && cachedContent !== "...") {
                const match = cachedContent.match(/^(\[.*?\])\s*(.*)/s);
                if (match) { ipa = match[1]; definition = match[2]; } else { definition = cachedContent; }
            } else if (cachedContent === "...") { definition = "DeepSeek 正在查询..."; } else { definition = "等待 Alt+1 后台获取..."; }
            item.innerHTML = `<div class="web-menu-header"><span class="web-menu-word">${word}</span><span class="web-menu-ipa">${ipa}</span></div><div class="web-menu-trans">${definition}</div>`;
            item.onclick = (e) => {
                e.stopPropagation();
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

    function showSmartPopup(text, targetHighlight, context = "") {
        if (!popupEl) return;
        if (isPopupLocked) {
             popupEl.style.left = savedPopupPos.x + 'px'; popupEl.style.top = savedPopupPos.y + 'px'; popupEl.style.transform = 'none';
        } else {
            const rect = targetHighlight.getBoundingClientRect();
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

        // 更新头部 HTML，图标功能增强
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
        // 格式化 prompt 为字符串显示
        const promptString = customPrompts.map(p => `${p.name}::${p.template}`).join('\n');

        // 修改结构：Tab重命名为 AI 和 生词
        container.innerHTML = `
            <div id="ds-resizer"></div>
            <div id="ds-header">
                <div id="ds-tabs-wrapper">
                    <div class="ds-tab active" data-tab="ai">AI</div>
                    <div class="ds-tab" data-tab="highlight">生词</div>
                </div>
                <div id="ds-header-actions">
                    <div id="ds-traffic-light" class="header-action" title="点击切换翻译源"></div>
                    <div id="ds-full-page-trans-btn" class="header-action" title="全文翻译开关">🌐</div>
                    <div id="ds-clear-cache" class="header-action" title="清除缓存">🗑️</div>
                    <div id="ds-cfg-toggle" class="header-action" title="设置">⚙️</div>
                    <div id="ds-close" class="header-action" title="关闭">✖</div>
                </div>
                <div id="ds-config-panel">
                    <div class="cfg-row" style="flex-direction:column; align-items:flex-start;"><span>DeepSeek API Key:</span><input type="text" id="cfg-api-key" style="width:100%;margin-top:5px;padding:6px;" value="${apiKey}"></div>
                    <div class="cfg-row" style="flex-direction:column; align-items:flex-start;">
                        <span>自定义Prompt (格式: 按钮名::Prompt指令)</span>
                        <textarea id="cfg-prompts" placeholder="按钮名称::具体指令内容\n每行一条...">${promptString}</textarea>
                    </div>
                    <div class="cfg-row"><span>深色模式</span><input type="checkbox" id="sw-dark" ${isDarkMode?'checked':''}></div>
                    <div class="cfg-row"><span>实时同步选词</span><input type="checkbox" id="sw-import" ${autoImport?'checked':''}></div>
                    <div class="cfg-row">
                        <span>侧边栏位置</span>
                        <select id="sw-side" style="padding: 2px 5px; border-radius: 4px;">
                            <option value="right" ${sidebarSide==='right'?'selected':''}>右侧</option>
                            <option value="left" ${sidebarSide==='left'?'selected':''}>左侧</option>
                        </select>
                    </div>
                    <button id="save-api-key" style="width:100%;padding:8px;background:#007aff;color:white;border:none;border-radius:4px;cursor:pointer;">保存设置</button>
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
                    <textarea id="ds-input" placeholder="输入内容..."></textarea>
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

    // ==================== 事件绑定 ====================
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
                    // 左侧或右侧 50px 触发
                    const nearLeft = e.clientX < 50;
                    const nearRight = e.clientX > window.innerWidth - 50;

                    if (nearLeft || nearRight) {
                         fab.classList.add('visible');
                         // 清除旧定时器，重置5秒倒计时
                         if (fabHideTimer) clearTimeout(fabHideTimer);
                         fabHideTimer = setTimeout(() => {
                             // 如果鼠标没悬停在fab上，则隐藏
                             if(!fab.matches(':hover')) {
                                fab.classList.remove('visible');
                             }
                         }, 5000);
                    }
                }

                // 确保 FAB 悬停时不消失
                if(fab && fab.matches(':hover') && fabHideTimer) {
                    clearTimeout(fabHideTimer);
                }

                const isResizing = document.getElementById('ds-resizer')?.dataset.resizing === 'true';
                if (isResizing) {
                    const container = document.getElementById('ds-sidebar');
                    if (container) {
                        let width;
                        if (sidebarSide === 'right') width = window.innerWidth - e.clientX;
                        else width = e.clientX;
                        if (width > 300 && width < window.innerWidth * 0.9) { container.style.width = width + 'px'; GM_setValue('sidebar_width', width); }
                    }
                }
                if (isDraggingPopup && popupEl) {
                    const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY;
                    popupEl.style.left = (popupStartX + dx) + 'px'; popupEl.style.top = (popupStartY + dy) + 'px';
                }
            }
        }, {passive: true});

        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
            // Alt+1 高亮功能
            if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
                e.preventDefault();
                // 关键修正：Alt+1 触发时，强制重置双击 Alt 的计数器，防止冲突
                altCnt = 0;
                if (altTimer) clearTimeout(altTimer);

                const sel = window.getSelection(); let range = null;
                if (sel.rangeCount && sel.toString().trim()) { range = sel.getRangeAt(0); }
                else { const wordObj = getCurrentSentence(); if (wordObj) { range = document.createRange(); range.setStart(wordObj.node, wordObj.s); range.setEnd(wordObj.node, wordObj.e); } }
                if (range) {
                    const text = range.toString().trim(); const parent = range.commonAncestorContainer.parentElement;
                    if (parent && parent.classList.contains(highlightClass)) return;
                    if (range.cloneContents().querySelector(`.${highlightClass}`)) return;
                    const mark = document.createElement('mark'); mark.className = highlightClass; mark.appendChild(range.extractContents()); range.insertNode(mark);
                    saveHighlights(); sel.removeAllRanges(); getDeepSeekVocabDef(text);
                }
            }
            // Alt+2 删除高亮
            if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
                const el = document.elementFromPoint(lastX, lastY);
                if (el) { const hl = el.closest(`.${highlightClass}`); if (hl) { e.preventDefault(); removeHighlight(hl); return; } }
            }
        }, true);

        if (isTopWindow) {
            document.addEventListener('keydown', (e) => {
                 // 如果按下非Alt键，重置计数器 (例如 Alt+1 操作中按下了1)
                 if (e.key !== 'Alt') {
                     altCnt = 0;
                     if (altTimer) clearTimeout(altTimer);
                     return;
                 }
                 if (e.key === 'Alt') {
                     e.preventDefault();
                     // 防止长按被识别为连击
                     if (e.repeat) return;

                     altCnt++;
                     clearTimeout(altTimer);
                     // 修改：0.3秒内连续按两次
                     altTimer = setTimeout(() => {altCnt=0;}, 300);
                     if (altCnt >= 2) {
                         altCnt = 0;
                         toggleSidebarState();
                     }
                 }
            }, true);
        }

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

            document.getElementById('ds-traffic-light')?.addEventListener('click', () => { useDeepSeekForInline = !useDeepSeekForInline; GM_setValue('ds_use_deepseek_inline', useDeepSeekForInline); const light = document.getElementById('ds-traffic-light'); if (light) light.style.background = useDeepSeekForInline ? '#ff453a' : '#30d158'; });

            // 绑定侧边栏中的 🌐 全文翻译按钮
            document.getElementById('ds-full-page-trans-btn')?.addEventListener('click', togglePageTranslation);

            document.getElementById('save-api-key')?.addEventListener('click', () => {
                const cfgApiKey = document.getElementById('cfg-api-key'); const cfgPrompts = document.getElementById('cfg-prompts'); const swDark = document.getElementById('sw-dark'); const swImport = document.getElementById('sw-import'); const swSide = document.getElementById('sw-side');
                if (!cfgApiKey) return; apiKey = cfgApiKey.value; isDarkMode = swDark.checked; autoImport = swImport.checked; sidebarSide = swSide.value;

                const rawLines = cfgPrompts.value.split('\n');
                customPrompts = [];
                rawLines.forEach(line => {
                    const parts = line.split('::');
                    if (parts.length >= 2) {
                        const name = parts[0].trim();
                        const template = parts.slice(1).join('::').trim();
                        if(name && template) customPrompts.push({name, template});
                    }
                });

                GM_setValue('ds_api_key', apiKey); GM_setValue('ds_sidebar_dark_mode', isDarkMode); GM_setValue('ds_auto_import', autoImport);
                GM_setValue('ds_custom_prompts', customPrompts);
                GM_setValue('ds_sidebar_side', sidebarSide);

                applyTheme(); renderCustomButtons();
                document.getElementById('ds-config-panel').style.display = 'none';
                updateSidebarPosition();
            });

            document.getElementById('ds-chat-log')?.addEventListener('contextmenu', (e) => { e.preventDefault(); if (abortCtrl) { abortCtrl.abort(); } });
            document.querySelectorAll('.ds-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
            document.getElementById('ds-cfg-toggle')?.addEventListener('click', () => { const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = cp.style.display === 'block' ? 'none' : 'block'; });
            document.getElementById('ds-clear-cache')?.addEventListener('click', () => { if (confirm('确定清除所有生词记录和翻译缓存吗？')) { Object.keys(localStorage).forEach(k => { if(k.startsWith(STORAGE_PREFIX) || k === TRANS_CACHE_KEY || k === VOCAB_CACHE_KEY) localStorage.removeItem(k); }); location.reload(); } });

            // 发送逻辑
            const handleSendQuery = () => {
                const el = document.getElementById('ds-input');
                if (!el) return;
                const val = el.value.trim();
                if (val) {
                    if (activeTab !== 'ai') switchTab('ai'); // 自动切换
                    askAI(val,"","chat");
                    el.value = "";
                    autoResizeInput();
                }
            };
            document.getElementById('ds-send')?.addEventListener('click', handleSendQuery);
            document.getElementById('ds-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { if (!e.shiftKey) { e.preventDefault(); handleSendQuery(); } else setTimeout(autoResizeInput,0); } });
            document.getElementById('ds-resizer')?.addEventListener('mousedown', () => { const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'true'; });
            document.getElementById('ds-close')?.addEventListener('click', hideSidebar);
            document.getElementById('ds-input')?.addEventListener('input', autoResizeInput);
            document.addEventListener('selectionchange', () => { if (!autoImport) return; const sel = window.getSelection().toString().trim(); const el = document.getElementById('ds-input'); if (sel && sel.length < 500 && el) { el.value = sel; lastSelection.word = sel; autoResizeInput(); try { lastSelection.context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e) {lastSelection.context = "";} } });

            const fab = document.getElementById('ds-fab');
            if (fab) {
                fab.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return;
                    isDraggingFab = true; fabDragStartX = e.clientX; fabDragStartY = e.clientY; fabStartLeft = fab.offsetLeft; fabStartTop = fab.offsetTop;
                });
                fab.addEventListener('click', (e) => {
                      const dist = Math.hypot(e.clientX - fabDragStartX, e.clientY - fabDragStartY);
                      if (dist < 5) { showSidebar(); if (activeTab === 'highlight') switchTab('highlight'); }
                });
            }
        }

        // ==================== 页面交互 ====================
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const sidebar = document.getElementById('ds-sidebar'); const popup = document.getElementById('ds-popup'); const fab = document.getElementById('ds-fab'); const targetHighlight = e.target.closest(`.${highlightClass}`);
            if (targetHighlight) return;
            const inSidebar = sidebar && sidebar.contains(e.target); const inPopup = popup && popup.style.display !== 'none' && popup.contains(e.target); const inFab = fab && fab.contains(e.target);
            if (!inSidebar && !inPopup && !inFab) { if (popup && popup.style.display !== 'none' && !isPopupLocked && isTopWindow) { popup.style.display = 'none'; currentPopupTrigger = null; clearAllInlineTranslations(); } }
        });

        // 鼠标右键逻辑 (Button 2)
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 2) return;

            // 1. 优先判定：是否点击了翻译内容 (内联翻译 或 全文翻译)
            const targetTrans = e.target.closest('.web-inline-trans, .ds-full-page-trans');
            if (targetTrans) {
                e.preventDefault();
                e.stopPropagation();
                targetTrans.remove(); // 隐藏（移除）该条翻译
                return;
            }

            // 2. 判定高亮删除
            const targetHighlight = e.target.closest(`.${highlightClass}`);
            if (targetHighlight) { e.preventDefault(); e.stopPropagation(); removeHighlight(targetHighlight); return; }

            // 3. 侧边栏与弹窗关闭逻辑
            const sidebar = document.getElementById('ds-sidebar'); const popup = document.getElementById('ds-popup');
            const inSidebar = sidebar && sidebar.contains(e.target); const inPopup = popup && popup.style.display !== 'none' && popup.contains(e.target);
            if (!inSidebar && !inPopup && isTopWindow) {
                if (isSidebarVisible()) hideSidebar();
                if (popup && popup.style.display !== 'none') { if (!isPopupLocked) { popup.style.display = 'none'; currentPopupTrigger = null; clearAllInlineTranslations(); } }
            }
        });

        document.addEventListener('mousedown', e => {
            const targetHighlight = e.target.closest(`.${highlightClass}`);
            if (e.altKey && e.button === 0 && !targetHighlight) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); clearAllInlineTranslations();
                let sel = window.getSelection().toString().trim(); let container = e.target;
                const renderTrans = (originalText, transText, nodeToInsertAfter) => { const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = transText; nodeToInsertAfter.after(transSpan); };
                if (sel.length > 0) {
                    const selection = window.getSelection(); if (!selection.rangeCount) return; const range = selection.getRangeAt(0);
                    const sourceSpan = document.createElement('span'); sourceSpan.className = 'web-trans-source-highlight'; sourceSpan.appendChild(range.extractContents()); range.insertNode(sourceSpan); selection.removeAllRanges();
                    if (useDeepSeekForInline) { renderTrans(sel, "DeepSeek 思考中...", sourceSpan); streamDeepSeekInline(sel, sourceSpan.nextSibling); } else { getTranslation(sel, (res) => renderTrans(sel, res, sourceSpan)); }
                } else {
                    while (container && container !== document.body && window.getComputedStyle(container).display === 'inline') container = container.parentElement;
                    const text = container.textContent.trim();
                    if (text.length > 2) {
                        if (useDeepSeekForInline) { const tempSpan = document.createElement('div'); container.appendChild(tempSpan); tempSpan.className = 'web-inline-trans'; tempSpan.textContent = "DeepSeek 思考中..."; streamDeepSeekInline(text, tempSpan); }
                        else { getTranslation(text, (res) => { const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = res; container.appendChild(transSpan); }); }
                    }
                }
                return;
            }

            if (targetHighlight && e.button === 0 && !e.altKey) {
                e.preventDefault(); e.stopPropagation();
                const text = targetHighlight.textContent.trim();
                const parentBlock = targetHighlight.closest('p, div, li, h1, h2, h3') || targetHighlight.parentElement;
                const context = parentBlock ? parentBlock.innerText : text;
                if (isSidebarVisible() && isTopWindow) { const input = document.getElementById('ds-input'); if(input) { input.value = text; autoResizeInput(); } }
                const isWord = (text.split(/\s+/).length <= 3 && text.length < 30);
                if (isWord) {
                    if (isTopWindow) {
                         if (popupEl.style.display === 'flex' && currentPopupTrigger === targetHighlight && !isPopupLocked) { popupEl.style.display = 'none'; currentPopupTrigger = null; return; }
                         showSmartPopup(text, targetHighlight, context);
                    }
                } else {
                    clearAllInlineTranslations();
                    const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = "DeepSeek 思考中...";
                    if (targetHighlight.nextSibling) targetHighlight.parentNode.insertBefore(transSpan, targetHighlight.nextSibling); else targetHighlight.parentNode.appendChild(transSpan);
                    if (useDeepSeekForInline) streamDeepSeekInline(text, transSpan); else getTranslation(text, (res) => { transSpan.textContent = res; });
                }
            }
        }, true);
    }

    function initTimedTasks() { setInterval(() => { if (!isRestoring && isSidebarVisible()) { applySavedHighlights(); } }, 2000); }
    async function init() { buildUI(); bindEvents(); initTimedTasks(); refreshHighlightMenu(); }
    init();
})();