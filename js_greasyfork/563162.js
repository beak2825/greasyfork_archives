// ==UserScript==
// @name        AI语言学习专家
// @namespace   http://tampermonkey.net/
// @version     1.39
// @license     MIT
// @description 全DeepSeek驱动的英语学习专家。双击Alt查词(0.5s)，Alt+1高亮，Alt+2开关侧边栏(自动吸附查词)，Alt+3开关阅读模式。支持自定义跳转AI网站与生词本。
// @author      杨俊贤 & Gemini & 豆包编程助手
// @match       *://*/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @grant       GM_openInTab
// @require     https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.4/Readability.min.js
// @connect     api.deepseek.com
// @downloadURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

// ==================== 0. DOM 构建工具 ====================
const UI = {
    el: (tag, attrs = {}, children = []) => {
        const element = document.createElement(tag);
        Object.entries(attrs).forEach(([key, val]) => {
            if (key === 'style' && typeof val === 'object') {
                Object.assign(element.style, val);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, val);
            } else if (key === 'className') {
                element.className = val;
            } else if (key === 'onclick' && typeof val === 'function') {
                element.onclick = val;
            } else if (key === 'onchange' && typeof val === 'function') {
                element.onchange = val;
            } else if (key === 'onmousedown' && typeof val === 'function') {
                element.onmousedown = val;
            } else if (key === 'onblur' && typeof val === 'function') {
                element.onblur = val;
            } else if (key === 'oninput' && typeof val === 'function') {
                element.oninput = val;
            } else if (key === 'checked') {
                element.checked = !!val;
            } else if (key === 'value') {
                element.value = val;
            } else if (key === 'type') {
                element.type = val;
            } else if (key === 'draggable') {
                element.draggable = val;
            } else {
                element[key] = val;
            }
        });
        const appendChild = (child) => {
            if (child === null || child === undefined) return;
            if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            } else if (Array.isArray(child)) {
                child.forEach(appendChild);
            }
        };
        if (Array.isArray(children)) children.forEach(appendChild);
        else appendChild(children);
        return element;
    },
    clear: (element) => {
        if (element) element.textContent = '';
    },
    renderMarkdown: (container, text, highlightWord = null) => {
        UI.clear(container);
        if (!text) return;
        const lines = text.split(/\n|\\n/);
        lines.forEach((line, index) => {
            if (index > 0) container.appendChild(document.createElement('br'));
            if (!line) return;
            const parts = line.split(/\*\*(.*?)\*\*/g);
            parts.forEach((part, i) => {
                if (!part) return;
                let node;
                const isBold = (i % 2 === 1);
                if (highlightWord) {
                    const regex = new RegExp(`(${highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    const subParts = part.split(regex);
                    const frag = document.createDocumentFragment();
                    subParts.forEach((subPart, j) => {
                        if (!subPart) return;
                        if (j % 2 === 1) {
                            const span = UI.el('span', {
                                className: 'ds-target-italic',
                                style: { color: '#1E90FF', fontWeight: 'bold', fontStyle: 'italic' }
                            }, [subPart]);
                            frag.appendChild(span);
                        } else {
                            frag.appendChild(document.createTextNode(subPart));
                        }
                    });
                    if (isBold) {
                        node = document.createElement('strong');
                        node.appendChild(frag);
                    } else {
                        node = frag;
                    }
                } else {
                    if (isBold) {
                        node = document.createElement('strong');
                        node.textContent = part;
                    } else {
                        node = document.createTextNode(part);
                    }
                }
                if (node instanceof DocumentFragment) container.appendChild(node);
                else container.appendChild(node);
            });
        });
    },
    renderDict: (container, text) => {
        UI.clear(container);
        const lines = text.split('\n').filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        const headword = lines[0].replace(/\*\*/g, '').trim();
        let ipa = "";
        let defStartIndex = 1;
        if (lines.length > 1 && (lines[1].trim().startsWith('/') || lines[1].trim().startsWith('['))) {
            ipa = lines[1].trim();
            defStartIndex = 2;
        }
        const headRow = UI.el('div', { className: 'ds-head-row' }, [
            UI.el('span', { className: 'ds-headword' }, headword),
            ipa ? UI.el('span', { className: 'ds-clickable-ipa' }, ipa) : null
        ]);
        container.appendChild(headRow);
        const grid = UI.el('div', { className: 'ds-dict-grid' });
        let lastPos = "";
        for (let i = defStartIndex; i < lines.length; i++) {
            let lineText = lines[i].trim();
            if (/^(Exchange|Tags)/i.test(lineText)) continue;
            if (/^([a-z]+|[\u4e00-\u9fa5]+)\.$/i.test(lineText) && i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (!/^([a-z]+|[\u4e00-\u9fa5]+)\./i.test(nextLine) && !/^(Exchange|Tags)/i.test(nextLine)) {
                    lineText += " " + nextLine;
                    i++;
                }
            }
            const match = lineText.match(/^([a-z]+|[\u4e00-\u9fa5]+)\.\s*(.*)/i);
            let pos = "";
            let defText = lineText;
            if (match) {
                pos = match[1].toLowerCase();
                defText = match[2];
            }
            let displayPos = pos;
            if (pos && pos === lastPos) {
                displayPos = "";
            } else {
                if (pos) lastPos = pos;
            }
            grid.appendChild(UI.el('div', { className: 'ds-pos-label' }, displayPos));
            const segments = defText.split(/([;；])/);
            const defContent = UI.el('div', { className: 'ds-def-content' });
            segments.forEach(seg => {
                if (seg.match(/[;；]/)) {
                    defContent.appendChild(UI.el('span', { style: { marginRight: '4px', color: '#999' } }, seg));
                } else if (seg.trim()) {
                    defContent.appendChild(UI.el('span', {
                        className: 'ds-def-split',
                        'data-def': seg.trim(),
                        title: '点击为此义项生成例句'
                    }, seg.trim()));
                }
            });
            grid.appendChild(defContent);
        }
        container.appendChild(grid);
    }
};

// ==================== 1. 配置与状态管理 ====================
const DEFAULT_PROMPTS = [
    "同义词=请作为语言专家，列出与查询词【同语种】的至少5个同义词，并进行简要辨析。",
    "反义词=请作为语言专家，列出与查询词【同语种】的至少5个反义词，并进行简要说明。",
    "同根词=请作为语言专家，列出与查询词【同语种】的至少5个同根词或派生词。",
    "词源词根=请详细分析该词的词源和词根，字数控制在50字到200字之间。"
];

const DEFAULT_SITES = [
    "DeepSeek=https://chat.deepseek.com/",
    "豆包=https://www.doubao.com/chat/",
    "元宝=https://yuanbao.tencent.com/chat",
    "Gemini=https://gemini.google.com/app",
    "ChatGPT=https://chatgpt.com/",
    "Grok=https://grok.com/"
];

const parseConfigLines = (list) => {
    let result = [];
    if (Array.isArray(list)) {
        list.forEach(item => {
            if (typeof item === 'string') {
                let parts = item.indexOf('=') > -1 ? item.split('=') : item.split('::');
                if (parts.length >= 2) {
                    result.push({name: parts[0].trim(), value: item.substring(item.indexOf('=') + 1).trim()});
                }
            } else if (typeof item === 'object') {
                result.push(item);
            }
        });
    }
    return result;
};

// Compatible parser for Prompts (uses 'template' instead of 'value')
const parsePrompts = (list) => {
    const parsed = parseConfigLines(list);
    return parsed.map(p => ({ name: p.name, template: p.template || p.value }));
};

const DS_CONFIG = {
    settings: {
        apiKey: GM_getValue('ds_api_key', ''),
        sidebarWidth: GM_getValue('sidebar_width', 450),
        sidebarSide: GM_getValue('ds_sidebar_side', 'right'),
        popupWidth: GM_getValue('ds_popup_width', '600px'),
        popupHeight: GM_getValue('ds_popup_height', '350px'),
        autoImport: true,
        autoCopy: GM_getValue('ds_auto_copy', false),
        jumpCopy: GM_getValue('ds_jump_copy', true),
        isDocked: GM_getValue('ds_is_docked', false),
        customPrompts: parsePrompts(GM_getValue('ds_custom_prompts', DEFAULT_PROMPTS)),
        customSites: parseConfigLines(GM_getValue('ds_custom_sites', DEFAULT_SITES)),
        disabledSites: GM_getValue('ds_disabled_sites', []),
        lastAiSite: GM_getValue('ds_last_ai_site', DEFAULT_SITES[0].split('=')[1]),
        historySort: GM_getValue('ds_history_sort', 'time_desc'),
        hiddenIcons: GM_getValue('ds_hidden_icons', []) // 新增：存储隐藏的图标ID
    },
    runtime: {
        activeTab: 'history',
        isPageTranslated: false,
        observer: null,
        observerTimeout: null,
        translationCache: {},
        exampleCache: {},
        popupCache: { dict: {}, context: {} },
        abortCtrl: null,
        rightPanelAbortCtrl: null,
        popupAbortCtrl: null,
        inlineAbortCtrl: null,
        currentAiContext: { messages: [], generatedText: "", element: null },
        lastSelection: { word: "", context: "" },
        isDraggingPopup: false,
        isResizingPopup: false,
        dragStartX: 0, dragStartY: 0,
        popupStartX: 0, popupStartY: 0,
        lastX: 0, lastY: 0,
        resizeDirection: '',
        resizeStartRect: {},
        currentPopupTrigger: null,
        sidebarLockUntil: 0,
        lastAltUpTime: 0,
        isRestoring: false,
        lastPopupParams: { left: null, right: null },
        isSwitchingContext: false,
        isReaderMode: false,
        readerFontSize: 20,
        readerLineHeight: 1.6,
        readerPageWidth: 800,
        preventContextMenuOnce: false,
        historyLimit: 50 // 新增：控制历史记录显示数量
    },
    consts: {
        API_URL: 'https://api.deepseek.com/v1/chat/completions',
        MODEL_NAME: 'deepseek-chat',
        HIGHLIGHT_CLASS: 'custom-web-highlight-tag',
        STORAGE_PREFIX: 'v3_pos_highlights_',
        GLOBAL_STORAGE_KEY: 'ds_global_history_v1',
        VOCAB_CACHE_KEY: 'v3_vocab_ds_cache',
        GLOBAL_DICT_CACHE_KEY: 'ds_dict_cache_global', // Cache for dictionaries
        STORAGE_KEY: 'v3_pos_highlights_' + btoa(encodeURIComponent(window.location.host + window.location.pathname)).substring(0, 50)
    }
};

const DOM = { sidebar: null, popup: null, highlightContent: null, readerWrapper: null };

// ==================== 2. 样式定义 ====================
function injectStyles() {
    const css = `:root{--ds-bg:#202328;--ds-text:#c0c4c9;--ds-msg-bg:#25282e;--ds-border:#3a3f47;--ds-user-bg:#c0c4c9;--ds-user-text:#1a1d21;--ds-header-bg:#2b3038;--ds-accent:#3a7bd5;--ds-highlight-bg:#8B0000;--ds-highlight-text:#ffffff;--ds-menu-bg:#202328;--ds-menu-active-bg:#353b45;--ds-tab-inactive-bg:#2a2f36;--ds-tab-active-bg:#4a5059;--ds-tab-inactive-text:#888;--ds-popup-bg:#202328;--ds-popup-border:#444;--ds-hover-bg:rgba(255,255,255,0.06);--ds-continue-color:#6db3f2;--ds-slider-off:#444;--ds-slider-on:#3a7bd5;--ds-modal-bg:rgba(32,35,40,0.98);--ds-scrollbar-thumb:#4a5059}.ds-scrollable::-webkit-scrollbar,#ds-chat-log::-webkit-scrollbar,#ds-highlight-log::-webkit-scrollbar,#ds-input::-webkit-scrollbar,#ds-popup-left-content::-webkit-scrollbar,#ds-popup-right-content::-webkit-scrollbar,.ds-docked-scroll::-webkit-scrollbar{width:6px;height:6px}.ds-scrollable::-webkit-scrollbar-thumb,#ds-chat-log::-webkit-scrollbar-thumb,#ds-highlight-log::-webkit-scrollbar-thumb,#ds-input::-webkit-scrollbar-thumb,#ds-popup-left-content::-webkit-scrollbar-thumb,#ds-popup-right-content::-webkit-scrollbar-thumb,.ds-docked-scroll::-webkit-scrollbar-thumb{background:var(--ds-scrollbar-thumb);border-radius:3px}.ds-scrollable::-webkit-scrollbar-track,#ds-chat-log::-webkit-scrollbar-track,#ds-highlight-log::-webkit-scrollbar-track,#ds-input::-webkit-scrollbar-track,#ds-popup-left-content::-webkit-scrollbar-track,#ds-popup-right-content::-webkit-scrollbar-track,.ds-docked-scroll::-webkit-scrollbar-track{background:0 0}

    #ds-sidebar{position:fixed;top:0;width:${DS_CONFIG.settings.sidebarWidth}px;height:100vh;background:var(--ds-bg)!important;z-index:2147483647;transition:right .3s cubic-bezier(.4,0,.2,1),left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:row;color:var(--ds-text)!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box!important;padding:0!important;box-shadow:0 0 20px rgba(0,0,0,.4)}

    /* Toolbar Expansion */
    #ds-vertical-toolbar{width:36px;background:var(--ds-header-bg);border-left:1px solid var(--ds-border);border-right:1px solid var(--ds-border);display:flex;flex-direction:column;align-items:center;padding-top:10px;gap:12px;z-index:10;flex-shrink:0;transition:width 0.2s ease;}
    #ds-vertical-toolbar.expanded { width: 120px; align-items: flex-start; }
    #ds-vertical-toolbar.expanded .ds-v-icon { justify-content: flex-start; padding-left: 12px; width: 100%; box-sizing: border-box; }
    .ds-v-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;color:var(--ds-text);opacity:0.7;font-size:16px;transition:all .2s;user-select:none}
    .ds-v-icon:hover{opacity:1;background:var(--ds-hover-bg);color:#fff}
    .ds-v-icon.active{color:var(--ds-accent);opacity:1}
    .ds-v-label { display: none; margin-left: 8px; font-size: 13px; white-space: nowrap; color: var(--ds-text); }
    #ds-vertical-toolbar.expanded .ds-v-label { display: inline-block; }

    /* 新增：侧边栏分区与编辑模式样式 */
    #ds-toolbar-active { display: flex; flex-direction: column; gap: 12px; width: 100%; align-items: center; padding-bottom: 10px; min-height: 50px; transition: all 0.2s; }

    #ds-toolbar-hidden {
        display: none; /* 默认隐藏 */
        flex-direction: column; gap: 12px; width: 100%; align-items: center;
        background: rgba(255,255,255,0.08); /* 稍微亮一点的背景 */
        border-top: 1px dashed #555;
        margin-top: auto; /* 关键：推到最底部 */
        flex-grow: 1; /* 占据剩余空间 */
        padding-top: 40px;
        padding-bottom: 15px;
        justify-content: flex-end;
        position: relative;
        box-sizing: border-box;
    }

    #ds-vertical-toolbar.ds-edit-mode #ds-toolbar-hidden { display: flex; animation: fadeIn 0.3s; }
    #ds-vertical-toolbar.ds-edit-mode { height: 100vh; overflow: hidden; } /* 确保容器占满高度 */

    .ds-hidden-text {
        position: absolute; top: 15px; left: 50%; transform: translateX(-50%);
        writing-mode: vertical-rl; text-orientation: mixed;
        font-size: 11px; color: #777; letter-spacing: 3px;
        pointer-events: none; white-space: nowrap; opacity: 0.8;
    }

    .ds-v-icon.dragging { opacity: 0.3; transform: scale(0.9); border: 1px dashed #fff; }

    /* 处于编辑模式时，活跃区即使为空也要有高度以便拖回 */
    #ds-vertical-toolbar.ds-edit-mode #ds-toolbar-active { min-height: 150px; padding-bottom: 20px; border-bottom: 1px solid transparent; }

    #ds-main-panel{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative}

    #ds-resizer{position:absolute;width:10px;height:100%;z-index:2147483648;background:transparent;cursor:ew-resize;transition:background .2s}#ds-resizer:hover{background:rgba(58,123,213,.1)}

    #ds-tab-header{height:42px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--ds-border);background:var(--ds-bg);padding:0 8px;flex-shrink:0}
    #ds-tabs-wrapper{display:flex;gap:4px;align-items:center;height:100%;z-index:1}
    /* Updated Tab Styling */
    .ds-tab{height:28px;cursor:pointer;font-size:15px;border-radius:6px;transition:all .2s;color:var(--ds-text);user-select:none;display:flex;align-items:center;justify-content:center;background:transparent!important;border:1px solid transparent!important;opacity:0.6;padding:0 8px;}
    .ds-tab:hover{color:#eee;background:var(--ds-hover-bg)!important;opacity:1}
    .ds-tab.active{background:var(--ds-tab-active-bg)!important;color:#fff!important;font-weight:700;border:1px solid #555!important;box-shadow:0 1px 2px rgba(0,0,0,.2);opacity:1}
    .ds-tab.dragging { opacity: 0.5; border: 1px dashed #666 !important; }

    .ds-tab-label { display: none; margin-left: 6px; font-size: 13px; }
    #ds-sidebar.expanded .ds-tab { width: auto; padding: 0 12px; }
    #ds-sidebar.expanded .ds-tab-label { display: inline; }

    #ds-tab-content{flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative}.tab-panel{display:none;flex-direction:column;height:100%;width:100%;overflow:hidden}.tab-panel.active{display:flex}#ds-ai-content{flex:1}#ds-chat-log{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:15px;margin:0;scroll-behavior:smooth}.ds-msg{padding:12px 16px;border-radius:8px;font-size:14.5px;line-height:1.6;max-width:94%;word-wrap:break-word}.user-msg{align-self:flex-end;background:var(--ds-user-bg)!important;color:var(--ds-user-text)!important;border-top-right-radius:2px}.ai-msg{align-self:flex-start;background:var(--ds-msg-bg)!important;color:var(--ds-text)!important;border:1px solid var(--ds-border);border-top-left-radius:2px;white-space:pre-wrap}.ds-continue-text{display:block;margin-top:12px;color:var(--ds-accent);font-weight:700;cursor:pointer;text-decoration:none!important;transition:all .2s;font-size:14px;padding:4px 0;opacity:.9;letter-spacing:.5px}.ds-continue-text:hover{opacity:1;filter:brightness(1.3)}.ds-instruction-text{color:var(--ds-text);font-weight:700;font-size:13px;margin-bottom:5px}.ds-instruction-highlight{color:#FFD700!important;font-weight:700}.highlight-word{color:#1E90FF!important;font-weight:700!important;text-decoration:none!important;background:rgba(30,144,255,.1);padding:0 2px;border-radius:2px}#ds-fn-bar{padding:8px 10px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid var(--ds-border);background:var(--ds-bg);flex-shrink:0;max-height:120px;overflow-y:auto}.fn-btn{flex:1;min-width:60px;padding:6px 8px;text-align:center;border-radius:4px;cursor:pointer;font-size:12px;color:var(--ds-text)!important;background:var(--ds-menu-active-bg);border:1px solid var(--ds-border);transition:all .2s;white-space:nowrap;display:flex;align-items:center;justify-content:center}.fn-btn:hover{background:var(--ds-hover-bg);border-color:#666}.fn-btn:active{transform:scale(.98)}.custom-prompt-btn{flex:0 1 auto!important}#ds-input-area{padding:10px 10px 15px;background:var(--ds-bg);flex-shrink:0;box-sizing:border-box!important;width:100%;border-top:1px solid var(--ds-border)}#ds-input-wrapper{display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box}#ds-input{width:100%;height:96px!important;border-radius:6px;border:1px solid var(--ds-border);padding:8px;outline:0;box-sizing:border-box;background:var(--ds-msg-bg)!important;color:rgba(255,255,255,0.08)!important;font-family:inherit;resize:none;font-size:14px;line-height:1.5;margin:0;overflow-y:auto;transition:color .2s ease,border-color .2s ease}#ds-input:focus{border-color:var(--ds-accent);color:var(--ds-text)!important}#ds-send-row{display:flex;justify-content:space-between;align-items:center;margin-top:4px}.ds-action-btn{width:80px;padding:6px 0;border:0;border-radius:12px;background:var(--ds-accent)!important;color:#fff!important;cursor:pointer;font-size:13px;font-weight:700;transition:opacity .2s ease,transform .1s;text-align:center}.ds-action-btn:hover{opacity:.9}.ds-action-btn:active{transform:scale(.96)}

    .ds-jump-wrapper{display:flex;gap:5px;align-items:center;position:relative;}
    .ds-jump-select-wrapper {position:relative;}
    .ds-jump-select-btn {background:var(--ds-msg-bg);color:var(--ds-text);border:1px solid var(--ds-border);border-radius:6px;padding:4px 8px;font-size:12px;min-width:85px;cursor:pointer;height:26px;display:flex;align-items:center;justify-content:space-between;}
    .ds-jump-select-btn:hover{border-color:#666}
    .ds-site-panel {
        position: absolute; bottom: 100%; left: 0; margin-bottom: 5px;
        background: var(--ds-msg-bg); border: 1px solid var(--ds-border);
        border-radius: 6px; padding: 8px; width: 220px;
        display: none; grid-template-columns: repeat(2, 1fr); gap: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 100;
    }
    .ds-site-panel.active { display: grid; }
    .ds-site-item {
        padding: 6px; font-size: 12px; color: var(--ds-text);
        background: var(--ds-menu-active-bg); border: 1px solid transparent;
        border-radius: 4px; cursor: pointer; text-align: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ds-site-item:hover { background: var(--ds-hover-bg); border-color: #666; }
    .ds-site-item.active { border-color: var(--ds-accent); color: var(--ds-accent); }

    #ds-config-panel,#ds-help-panel{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--ds-bg);z-index:1001;padding:20px;box-sizing:border-box;display:none;flex-direction:column;overflow-y:auto}.cfg-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;font-size:14px}#cfg-api-key{width:100%;margin-top:5px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-size:13px}.ds-cfg-textarea{width:100%;height:120px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-family:monospace;font-size:12px;resize:vertical;margin-top:5px;white-space:pre-wrap;overflow-x:hidden;word-wrap:break-word}.ds-panel-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ds-border);padding-bottom:10px;margin-bottom:20px}.ds-panel-title{font-size:18px;font-weight:700;color:var(--ds-accent)}.ds-panel-top-btn{padding:4px 12px;background:var(--ds-accent);color:#fff;border-radius:4px;font-size:12px;cursor:pointer;border:none}.ds-panel-top-btn:hover{opacity:0.9}.ds-help-item{margin-bottom:15px;display:flex;flex-direction:column;gap:5px}.ds-help-key{font-weight:700;color:var(--ds-text);font-family:monospace;background:var(--ds-msg-bg);padding:2px 6px;border-radius:4px;display:inline-block;width:fit-content}.ds-help-desc{font-size:13px;color:var(--ds-text);opacity:.8;line-height:1.4;white-space:pre-wrap}.ds-primary-btn{width:100%;padding:8px;background:var(--ds-accent);color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:14px;transition:opacity .2s;text-align:center}.ds-primary-btn:hover{opacity:.9}#ds-highlight-content{flex:1}#ds-highlight-log,#ds-history-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:0;margin:0}.${DS_CONFIG.consts.HIGHLIGHT_CLASS}{background-color:var(--ds-highlight-bg)!important;color:var(--ds-highlight-text)!important;padding:0 2px!important;border-radius:2px;cursor:pointer;display:inline}.web-inline-trans{color:#1E90FF!important;font-size:.95em!important;font-weight:400!important;margin-left:0!important;display:block!important;background:0 0!important;box-shadow:none!important;border:0!important;padding:4px 0 8px!important}.web-inline-trans::before{content:""}.ds-inline-loading{animation:pulse 1.5s infinite}.ds-full-page-trans{color:#1E90FF!important;font-size:14px!important;font-weight:400!important;display:block!important;margin-top:4px!important;padding:2px 0 6px!important;line-height:1.5!important}.web-menu-item{display:flex!important;flex-direction:column!important;align-items:flex-start!important;padding:8px 12px!important;margin:0!important;background:var(--ds-menu-bg)!important;border-radius:0!important;cursor:default!important;transition:background-color .1s ease!important;border-bottom:1px solid rgba(255,255,255,.05)}.web-menu-item:hover{background:#353b45!important}.web-menu-header{display:flex;justify-content:space-between;width:100%;align-items:center;gap:8px;cursor:pointer}.web-menu-word{font-weight:700!important;color:#1E90FF!important;font-size:15px!important;}.web-menu-word:hover{text-decoration:none!important;color:var(--ds-accent)!important}.web-menu-jump{cursor:pointer;opacity:0.5;font-size:14px;padding:2px 6px}.web-menu-jump:hover{opacity:1;background:var(--ds-hover-bg);border-radius:4px}.web-menu-trans{display:none;margin-top:2px!important;color:#aaa!important;opacity:1;font-size:13px!important;line-height:1.4!important;white-space:pre-wrap!important;word-break:break-all!important;width:100%!important}#ds-confirm-modal{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);backdrop-filter:blur(2px);z-index:2000;display:none;align-items:center;justify-content:center;animation:fadeIn .2s ease}.ds-confirm-box{background:var(--ds-modal-bg);padding:25px 20px;border-radius:12px;width:75%;text-align:center;border:1px solid var(--ds-border);box-shadow:0 10px 30px rgba(0,0,0,.5);color:var(--ds-text)}.ds-confirm-text{font-size:15px;margin-bottom:20px;font-weight:500}.ds-confirm-btns{display:flex;gap:12px;justify-content:center}.ds-btn{padding:8px 20px;border-radius:6px;border:0;cursor:pointer;font-size:14px;font-weight:700;transition:transform .1s}.ds-btn:active{transform:scale(.95)}.ds-btn-yes{background:#ff3b30;color:#fff}.ds-btn-no{background:var(--ds-msg-bg);color:var(--ds-text);border:1px solid var(--ds-border)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}#ds-popup{position:fixed;background:var(--ds-popup-bg);color:var(--ds-text);border:1px solid var(--ds-popup-border);border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.6);z-index:2147483660;display:none;flex-direction:column;min-width:400px;min-height:250px;max-width:90vw;max-height:80vh}.ds-resize-handle{position:absolute;z-index:100;opacity:0}.ds-resize-handle:hover{background:rgba(30,144,255,.2);opacity:1}.ds-rh-n{top:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-s{bottom:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-w{left:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-e{right:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-nw{top:0;left:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}.ds-rh-ne{top:0;right:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-sw{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-se{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}#ds-popup-header-bar{height:36px;width:100%;cursor:move;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;gap:6px;background:var(--ds-header-bg);border-bottom:1px solid var(--ds-border)}.ds-popup-icon{cursor:pointer;font-size:15px;opacity:.6;transition:opacity .2s;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--ds-text)}.ds-popup-icon:hover{opacity:1;background:var(--ds-hover-bg)}#ds-popup-close-float{font-size:16px}#ds-popup-body{display:flex;flex:1;overflow:hidden;position:relative;padding:0;width:100%;height:100%;cursor:default}.ds-split-view{width:100%;height:100%;display:flex}.ds-split-left{flex:1;border-right:1px solid var(--ds-border);padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}.ds-split-right{flex:1;padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}#ds-docked-panel{flex-direction:column;background:var(--ds-bg)}.ds-docked-toolbar{padding:8px;border-bottom:1px solid var(--ds-border);display:flex;justify-content:center;align-items:center;background:#2f343c}.ds-docked-title{font-size:13px;font-weight:700;color:#aaa}#ds-undock-btn{padding:4px 12px;border:1px solid var(--ds-border);background:var(--ds-menu-bg);color:var(--ds-text);border-radius:4px;font-size:12px;cursor:pointer}#ds-undock-btn:hover{background:var(--ds-hover-bg);border-color:#666}.ds-docked-content{flex:1;overflow-y:auto;display:flex;flex-direction:column}.ds-docked-section{padding:15px;border-bottom:1px solid var(--ds-border)}.ds-docked-scroll{overflow-y:auto;max-height:50%}.ds-popup-title{font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ds-accent);opacity:.9;letter-spacing:.5px;display:flex;align-items:center;gap:6px}.ds-popup-text{font-size:14px;line-height:1.6;white-space:pre-wrap;color:#ccc}.ds-popup-loading{color:#888;font-style:italic;animation:pulse 1.5s infinite}@keyframes pulse{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}.ds-target-italic{color:#1E90FF!important;font-weight:700;font-style:italic}.ds-head-row{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;flex-wrap:wrap}.ds-headword{color:#1E90FF!important;font-weight:700;font-size:15px!important;display:inline-block}.ds-dict-grid{display:grid;grid-template-columns:45px 1fr;gap:4px 0;align-items:baseline}.ds-pos-label{text-align:right;color:#98c379;font-style:italic;font-weight:700;font-size:12px;user-select:none;white-space:nowrap;overflow:visible;padding-right:8px}.ds-def-split{cursor:pointer;border-bottom:1px dashed transparent;transition:all .1s}.ds-def-split:hover{color:var(--ds-accent)}#ds-fab{display:none!important;}.ds-is-streaming .ds-def-split{pointer-events:none!important;cursor:wait}.ds-is-streaming{cursor:wait}#ds-input::placeholder{color:rgba(255,255,255,0.15)!important;opacity:1}#ds-tab-docked{padding:0 8px!important}.ds-dock-lock{cursor:default}.ds-dock-restore{cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s;border-radius:4px;padding:0 4px;width:20px;text-align:center}.ds-dock-restore:hover{opacity:1;background:var(--ds-hover-bg)}.ds-clickable-ipa{color:#98c379;font-family:'Lucida Sans Unicode','Arial Unicode MS',sans-serif}
    #ds-config-panel input, #ds-config-panel textarea {font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;color:var(--ds-text)!important;background:var(--ds-msg-bg)!important;border:1px solid var(--ds-border)!important;font-size:13px!important}
    .web-menu-item.active .ds-history-date { display: none; }
    .ds-undo-mode { background: transparent !important; cursor: default !important; justify-content: center; align-items: center; display: flex; }
    .ds-undo-mode:hover { background: transparent !important; }
    `;
    const switchCss = `.ds-switch{position:relative;display:inline-block;width:36px;height:20px}.ds-switch input{opacity:0;width:0;height:0}.ds-slider-btn{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--ds-slider-off);transition:.4s;border-radius:34px}.ds-slider-btn:before{position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.ds-slider-btn{background-color:var(--ds-slider-on)}input:checked+.ds-slider-btn:before{transform:translateX(16px)}`;
    const readerCss = `
    #custom-reader-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: #0D262E !important; color: #939085 !important;
        z-index: 2147483649; overflow-y: auto;
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        line-height: 1.6; scroll-behavior: smooth;
        -ms-overflow-style: none; scrollbar-width: none;
    }
    #custom-reader-overlay::-webkit-scrollbar { display: none; }
    /* Fix: Ensure highlighted words in reader mode stay red and white */
    #custom-reader-overlay mark, #custom-reader-overlay .custom-web-highlight-tag {
        background-color: var(--ds-highlight-bg) !important;
        color: var(--ds-highlight-text) !important;
    }
    /* Fix: Spacing between paragraphs */
    #reader-content-body p, #reader-content-body div, #reader-content-body li {
        margin-bottom: 24px !important;
    }

    #reader-ctrl-bar {
        position: fixed; top: 0 !important; margin: 0 !important;
        display: flex; flex-direction: column;
        background: #16323a;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2147483651;
        opacity: 0.2;
        transition: opacity 0.3s;
        overflow: hidden;
        border: 1px solid rgba(147, 144, 133, 0.15);
        backface-visibility: hidden; transform: translateZ(0);
    }
    #reader-ctrl-bar:hover { opacity: 0.95; }
    .ctrl-btn {
        background: transparent; border: none;
        border-bottom: 1px solid rgba(147, 144, 133, 0.1);
        color: #939085;
        cursor: pointer; width: 38px; height: 38px;
        display: flex; align-items: center; justify-content: center;
        font-weight: 300; transition: all 0.2s;
        padding: 0; margin: 0;
        outline: none; box-sizing: border-box;
    }
    .ctrl-btn:last-child { border-bottom: none; }
    .ctrl-btn:hover { background: rgba(147, 144, 133, 0.15); color: #fff; }
    .btn-width { font-size: 14px; letter-spacing: -1px; }
    .btn-fs-plus { font-size: 18px; }
    .btn-fs-minus { font-size: 12px; }
    .exit-btn:hover { background: #EA4335 !important; color: white !important; }
    #reader-progress-v {
        position: fixed; top: 0; right: 0; width: 2px; height: 0%;
        background: #4285F4; opacity: 0.4; transition: height 0.1s; z-index: 2147483650;
    }
    #custom-reader-container { transition: width 0.3s, font-size 0.2s, line-height 0.2s; margin: 0 auto; }
    .reader-mode-active { overflow: hidden !important; }
    #reader-content-body img { max-width: 100%; height: auto; display: block; margin: 25px auto; border-radius: 4px; opacity: 0.8; }
    `;

    const fixCss = `
    #ds-highlight-content .ds-clickable-ipa { font-family: 'Lucida Sans Unicode', 'Arial Unicode MS', sans-serif; font-size: 13px; color: #98c379; }
    #ds-highlight-content .ds-head-row { margin-bottom: 6px; cursor: pointer; }
    #ds-highlight-content .ds-def-split { cursor: text !important; border-bottom: none !important; color: inherit !important; }
    #ds-highlight-content .ds-def-split:hover { color: inherit !important; background: transparent !important; }

    .web-menu-item { position: relative; transition: background-color 0.2s; }
    .web-menu-item.active { background: var(--ds-menu-active-bg); }
    .web-menu-item.active .web-menu-word { display: none !important; }
    .web-menu-item.active .web-menu-header { height: 0; padding: 0 !important; margin: 0 !important; border: none; display: block; overflow: visible; }
    .web-menu-item.active .web-menu-jump { position: absolute; right: 10px; top: 12px; z-index: 10; }
    .web-menu-item.active .web-menu-trans { margin-top: 0 !important; padding-top: 8px; display: block !important; }
    `;
    GM_addStyle(css + switchCss + readerCss + fixCss);
}

function updatePageLayout() {
    const sb = document.getElementById('ds-sidebar');
    const readerOverlay = document.getElementById('custom-reader-overlay');
    const width = parseInt(DS_CONFIG.settings.sidebarWidth);
    const side = DS_CONFIG.settings.sidebarSide;

    const resetReader = () => {
        if (readerOverlay) {
            readerOverlay.style.left = '0';
            readerOverlay.style.width = '100%';
            readerOverlay.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
        }
    };

    // 如果侧边栏不可见，则重置所有
    if (!sb || !isSidebarVisible()) {
        document.body.style.marginLeft = '';
        document.body.style.marginRight = '';
        document.body.style.paddingLeft = '';
        document.body.style.paddingRight = '';
        document.body.style.width = '';
        document.body.style.minWidth = '';
        document.body.style.overflowX = '';
        document.body.style.boxSizing = '';
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';

        resetReader();
        return;
    }

    // 默认开启挤压模式
    const gap = 0;
    const totalDistance = width + gap;

    document.body.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    document.body.style.boxSizing = 'border-box';

    document.body.style.marginLeft = '';
    document.body.style.marginRight = '';
    document.body.style.paddingLeft = '';
    document.body.style.paddingRight = '';
    document.body.style.width = '';
    document.body.style.minWidth = '';

    if (side === 'right') {
        document.body.style.width = `calc(100% - ${totalDistance}px)`;
        document.body.style.overflowX = 'auto';

        if (readerOverlay) {
            readerOverlay.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
            readerOverlay.style.left = '0';
            readerOverlay.style.width = `calc(100% - ${totalDistance}px)`;
        }

    } else {
        document.body.style.paddingLeft = totalDistance + 'px';
        document.body.style.width = '100%';
        document.body.style.overflowX = 'hidden';

        if (readerOverlay) {
            readerOverlay.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
            readerOverlay.style.left = totalDistance + 'px';
            readerOverlay.style.width = `calc(100% - ${totalDistance}px)`;
        }
    }
}

// Replaced toggleSidebarPushMode with toggleToolbarExpansion
function toggleToolbarExpansion() {
    const toolbar = document.getElementById('ds-vertical-toolbar');
    const sidebar = document.getElementById('ds-sidebar');
    if (toolbar) toolbar.classList.toggle('expanded');
    if (sidebar) sidebar.classList.toggle('expanded');
}

function updateSidebarPosition(animate = true) {
    const sb = document.getElementById('ds-sidebar');
    const resizer = document.getElementById('ds-resizer');
    const toggleBtn = document.getElementById('ds-side-toggle');
    const verticalToolbar = document.getElementById('ds-vertical-toolbar');
    const mainPanel = document.getElementById('ds-main-panel');

    // FIX: 之前使用 nextElementSibling 导致误选中了下一个图标（地球图标），并覆盖了其内容
    const label = toggleBtn ? toggleBtn.querySelector('.ds-v-label') : null;

    if (!sb || !resizer) return;
    if (!animate) { sb.style.transition = 'none'; } else { sb.style.transition = 'right 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1)'; }

    sb.style.left = ''; sb.style.right = '';
    sb.style.borderLeft = ''; sb.style.borderRight = '';
    resizer.style.left = ''; resizer.style.right = '';

    // Helper to update text node without destroying span label
    const updateIconText = (btn, text) => {
        if (btn && btn.firstChild && btn.firstChild.nodeType === 3) {
            btn.firstChild.nodeValue = text;
        }
    };

    if (DS_CONFIG.settings.sidebarSide === 'right') {
        sb.style.right = isSidebarVisible() ? '0' : '-1200px';
        sb.style.borderLeft = '1px solid #3a3f47';
        resizer.style.left = '0';
        if (toggleBtn) { updateIconText(toggleBtn, '👈🏻'); toggleBtn.title = "切换至左侧"; }
        if (label) label.textContent = "切至左侧";

        if (verticalToolbar) { verticalToolbar.style.order = '2'; verticalToolbar.style.borderLeft = '1px solid var(--ds-border)'; verticalToolbar.style.borderRight = 'none'; }
        if (mainPanel) { mainPanel.style.order = '1'; }

    } else {
        sb.style.left = isSidebarVisible() ? '0' : '-1200px';
        sb.style.borderRight = '1px solid #3a3f47';
        resizer.style.right = '0';
        if (toggleBtn) { updateIconText(toggleBtn, '👉🏻'); toggleBtn.title = "切换至右侧"; }
        if (label) label.textContent = "切至右侧";

        if (verticalToolbar) { verticalToolbar.style.order = '0'; verticalToolbar.style.borderRight = '1px solid var(--ds-border)'; verticalToolbar.style.borderLeft = 'none'; }
        if (mainPanel) { mainPanel.style.order = '1'; }
    }
    updatePageLayout();
    if(DS_CONFIG.runtime.isReaderMode) updateReaderCtrlPosition();
}

function toggleSidebarSide() {
    const wasVisible = (DOM.sidebar.style.right === '0px' || DOM.sidebar.style.left === '0px');
    DS_CONFIG.settings.sidebarSide = DS_CONFIG.settings.sidebarSide === 'right' ? 'left' : 'right';
    GM_setValue('ds_sidebar_side', DS_CONFIG.settings.sidebarSide);
    updateSidebarPosition(true);
    if (wasVisible) showSidebar();
}

function setSidebarSide(side) {
    DS_CONFIG.settings.sidebarSide = side;
    GM_setValue('ds_sidebar_side', side);
    updateSidebarPosition(true);
}

// ==================== 3. 工具函数 ====================
function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const isChinese = (text) => /[\u4e00-\u9fa5]/.test(text);

function getArticleContent() {
    if (location.hostname.includes('youtube.com')) {
        const desc = document.querySelector('#description-inline-expander .ytd-text-inline-expander') || document.querySelector('#description');
        if(desc) return desc.innerText.substring(0, 10000);
    }
    let articleEl = document.querySelector('article, main, #content, .content, .article-content, .post-content');
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

function togglePageTranslation() {
    if (DS_CONFIG.runtime.isPageTranslated) {
        if (DS_CONFIG.runtime.observer) {
            DS_CONFIG.runtime.observer.disconnect();
            DS_CONFIG.runtime.observer = null;
        }
        document.querySelectorAll('.ds-full-page-trans').forEach(el => el.remove());
        document.querySelectorAll('[data-ds-translated]').forEach(el => el.removeAttribute('data-ds-translated'));
        DS_CONFIG.runtime.isPageTranslated = false;
    } else {
        DS_CONFIG.runtime.isPageTranslated = true;
        translatePageContent();
        setupSPAObserver();
    }
}

function setupSPAObserver() {
    if (DS_CONFIG.runtime.observer) return;
    DS_CONFIG.runtime.observer = new MutationObserver((mutations) => {
        if (!DS_CONFIG.runtime.isPageTranslated) return;
        if (DS_CONFIG.runtime.observerTimeout) clearTimeout(DS_CONFIG.runtime.observerTimeout);
        DS_CONFIG.runtime.observerTimeout = setTimeout(() => {
            translatePageContent();
        }, 1000);
    });
    DS_CONFIG.runtime.observer.observe(document.body, { childList: true, subtree: true });
}

function translatePageContent() {
    if (DS_CONFIG.runtime.inlineAbortCtrl) {
    } else {
         DS_CONFIG.runtime.inlineAbortCtrl = new AbortController();
    }
    const signal = DS_CONFIG.runtime.inlineAbortCtrl.signal;

    let selectors = 'p, h1, h2, h3, h4, li, blockquote';
    if (location.hostname.includes('youtube.com')) {
        selectors += ', #content-text, #description-inline-expander, #video-title, .ytd-video-primary-info-renderer';
    }

    const targetEl = document.querySelector('article, main, #content, #columns') || document.body;
    const exclude = ['nav','header','footer','aside','.nav','.header','.footer','.ad','.banner','.sidebar','.menu', '#ds-sidebar', '#ds-popup'];

    targetEl.querySelectorAll(selectors).forEach(el => {
        if (el.dataset.dsTranslated === "true") return;
        if (el.closest('.ds-full-page-trans')) return;
        if (exclude.some(es => el.closest(es))) return;
        if (el.id === 'video-title' && el.closest('#dismissible')) { /* preview title */ }

        const text = el.innerText.trim();
        if (text.length > 0 && !isChinese(text)) {
            el.dataset.dsTranslated = "true";
            const transDiv = UI.el('div', { className: 'ds-full-page-trans ds-inline-loading' }, 'DeepSeek 思考中...');

            if (el.id === 'content-text') {
                  el.parentElement.appendChild(transDiv);
            } else if (el.tagName.startsWith('H')) {
                  el.appendChild(transDiv);
            } else {
                  el.appendChild(transDiv);
            }

            streamDeepSeekInline(text, transDiv, signal);
        }
    });
}

function clearAllInlineTranslations() {
    document.querySelectorAll('.web-inline-trans').forEach(el => el.remove());
    document.querySelectorAll('.web-trans-source-highlight').forEach(wrapper => {
        const parent = wrapper.parentNode;
        if (parent) {
            while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
        }
    });
    if (!DS_CONFIG.runtime.isPageTranslated) {
         document.querySelectorAll('.ds-full-page-trans').forEach(el => el.remove());
         document.querySelectorAll('[data-ds-translated]').forEach(el => el.removeAttribute('data-ds-translated'));
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
        const range = document.caretRangeFromPoint(DS_CONFIG.runtime.lastX, DS_CONFIG.runtime.lastY);
        if (!range) return null;
        node = range.startContainer; offset = range.startOffset;
    } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(DS_CONFIG.runtime.lastX, DS_CONFIG.runtime.lastY);
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

// ==================== 4. 核心 API 逻辑 ====================
async function requestAI({ messages, signal, onUpdate, onFinish, onError }) {
    if (!DS_CONFIG.settings.apiKey) {
        if (onError) onError(new Error("请配置 API Key"));
        return;
    }
    try {
        const res = await fetch(DS_CONFIG.consts.API_URL, {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${DS_CONFIG.settings.apiKey}`},
            body: JSON.stringify({ model: DS_CONFIG.consts.MODEL_NAME, messages: messages, stream: true }),
            signal: signal
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.substring(6));
                        const delta = data.choices[0].delta.content || "";
                        fullText += delta;
                        if (onUpdate) onUpdate(delta, fullText);
                    } catch(e) {}
                }
            }
        }
        if (onFinish) onFinish(fullText);
    } catch (e) {
        if (onError) onError(e);
        else console.error("requestAI Error:", e);
    }
}

// Global Cache Helper
const manageGlobalCache = {
    get: (key) => {
        try {
            const cache = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_DICT_CACHE_KEY, '{}'));
            return cache[key] ? cache[key].data : null;
        } catch(e) { return null; }
    },
    save: (key, data) => {
        try {
            let cache = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_DICT_CACHE_KEY, '{}'));
            cache[key] = { data: data, time: Date.now() };

            const json = JSON.stringify(cache);
            // Limit to roughly 50MB
            if (json.length > 50 * 1024 * 1024) {
                 const entries = Object.entries(cache).sort((a,b) => a[1].time - b[1].time);
                 // Delete oldest 20%
                 const limit = Math.floor(entries.length * 0.2);
                 for(let i=0; i<limit; i++) {
                     delete cache[entries[i][0]];
                 }
            }
            GM_setValue(DS_CONFIG.consts.GLOBAL_DICT_CACHE_KEY, JSON.stringify(cache));
        } catch(e) {}
    }
};

function fetchVocabDefinition(word, container) {
    if (!DS_CONFIG.settings.apiKey) return;

    // Check Global Cache First
    const cachedData = manageGlobalCache.get(word);
    if (cachedData) {
        UI.renderDict(container, cachedData);
        // Sync to runtime cache
        DS_CONFIG.runtime.popupCache.dict[word] = cachedData;
        return;
    }

    if (DS_CONFIG.runtime.popupCache.dict[word]) {
        UI.renderDict(container, DS_CONFIG.runtime.popupCache.dict[word]);
        return;
    }

    UI.clear(container);
    container.appendChild(UI.el('span', { className: 'ds-popup-loading' }, 'DeepSeek 查询中...'));

    const prompt = isChinese(word) ? "你是一个专业的汉语词典接口。请严格按照词典格式输出，不要废话。" : "你是一个基于 ECDICT (Collins + Oxford) 数据库的词典接口。请严格按照以下 ECDICT 数据结构输出信息，不要提供例句。请严格控制输出在150字以内，避免重复循环。\n\n格式要求：\n单词原型\n/音标/\n词性. 中文释义\nExchange: ...\nTags: ...\n...";

    requestAI({
        messages: [{role:"system",content:prompt},{role:"user",content:word}],
        onUpdate: (delta, full) => {
            UI.renderDict(container, full);
        },
        onFinish: (full) => {
            DS_CONFIG.runtime.popupCache.dict[word] = full;
            manageGlobalCache.save(word, full); // Save to global
        },
        onError: (e) => {
            container.innerText = "查询失败: " + e.message;
        }
    });
}

async function streamDeepSeekInline(text, targetElement, signal = null) {
    if (DS_CONFIG.runtime.translationCache[text]) {
        targetElement.classList.remove('ds-inline-loading');
        targetElement.textContent = DS_CONFIG.runtime.translationCache[text];
        targetElement.style.color = "#1E90FF";
        return;
    }
    if (!DS_CONFIG.settings.apiKey) { targetElement.textContent = "请配置 API Key"; targetElement.classList.remove('ds-inline-loading'); return; }
    targetElement.textContent = "DeepSeek 思考中...";
    if (!targetElement.classList.contains('ds-inline-loading')) targetElement.classList.add('ds-inline-loading');
    let isFirstChunk = true;
    await requestAI({
        messages: [{role:"system", content:"你是一个翻译引擎。直接输出以下内容的中文翻译，不要任何解释或前缀。"},{role:"user", content: text}],
        signal: signal,
        onUpdate: (delta, fullText) => {
            if (isFirstChunk) { targetElement.textContent = ""; targetElement.classList.remove('ds-inline-loading'); isFirstChunk = false; isFirstChunk = false; }
            targetElement.textContent = fullText;
        },
        onFinish: (fullText) => { if (fullText) DS_CONFIG.runtime.translationCache[text] = fullText; },
        onError: (e) => { if (e.name !== 'AbortError') { targetElement.textContent = "DeepSeek Error: " + e.message; targetElement.classList.remove('ds-inline-loading'); } }
    });
}

async function streamToElement(sysPrompt, userPrompt, targetElement, cacheCategory, cacheKey, highlightWord = null, mode = 'normal', signal = null) {
    // Check global cache for dict mode
    if (mode === 'dict') {
        const gCache = manageGlobalCache.get(highlightWord);
        if (gCache) {
            UI.renderDict(targetElement, gCache);
            DS_CONFIG.runtime.popupCache.dict[highlightWord] = gCache;
            return;
        }
    }

    if (cacheCategory && cacheKey && DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey]) {
        if (mode === 'dict') UI.renderDict(targetElement, DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey]);
        else UI.renderMarkdown(targetElement, DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey], highlightWord);
        return;
    }
    if (!DS_CONFIG.settings.apiKey) { targetElement.innerText = "请配置 API Key"; return; }

    UI.clear(targetElement);
    targetElement.appendChild(UI.el('span', { className: 'ds-popup-loading' }, 'DeepSeek Thinking...'));
    targetElement.classList.add('ds-is-streaming');

    let isStreamFinished = false;

    await requestAI({
        messages: [{role:"system",content:sysPrompt},{role:"user",content:userPrompt}],
        signal: signal,
        onUpdate: (delta, fullText) => {
            if (mode === 'dict') {
                UI.renderDict(targetElement, fullText);
            } else {
                UI.renderMarkdown(targetElement, fullText, highlightWord);
            }
        },
        onFinish: (fullText) => {
            isStreamFinished = true;
            targetElement.classList.remove('ds-is-streaming');
            if (cacheCategory && cacheKey && fullText) { DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey] = fullText; }
            if (mode === 'dict' && fullText) { manageGlobalCache.save(highlightWord, fullText); }
        },
        onError: (e) => {
            targetElement.classList.remove('ds-is-streaming');
            if(e.name === 'AbortError') {
                if (!DS_CONFIG.runtime.isSwitchingContext && !isStreamFinished) {
                    let sideKey = null;
                    if (targetElement.closest('#ds-popup-left-content') || targetElement.closest('#ds-docked-left-content')) sideKey = 'left';
                    if (targetElement.closest('#ds-popup-right-content') || targetElement.closest('#ds-docked-right-content')) sideKey = 'right';

                    if (sideKey && !targetElement.querySelector('.ds-continue-text')) {
                         const wrapper = UI.el('div', { className: 'ds-continue-text', 'data-side': sideKey }, '▶️ 继续');
                         targetElement.appendChild(wrapper);
                    }
                }
            }
            else { targetElement.innerText = "Error: " + e.message; }
        }
    });
}

window.updateRightPanelExamples = function(defText, word) {
    if (DS_CONFIG.runtime.rightPanelAbortCtrl) { DS_CONFIG.runtime.rightPanelAbortCtrl.abort(); }

    const isDocked = DS_CONFIG.settings.isDocked;
    const rightContainerSelector = isDocked ? '#ds-docked-right-content' : '#ds-popup-right-content';
    const rightContainer = document.querySelector(rightContainerSelector);

    if (!rightContainer) return;

    const rightBody = rightContainer.querySelector('.ds-popup-text');
    const rightHeader = rightContainer.querySelector('.ds-popup-title');

    if (!rightBody) return;

    document.querySelectorAll('.ds-def-split').forEach(el => el.style.color = '');
    if (event && event.target && event.target.classList.contains('ds-def-split')) { event.target.style.color = '#3a7bd5'; }

    rightHeader.innerText = "📖 例句示范";
    const cacheKey = word + "_" + defText;
    if (DS_CONFIG.runtime.exampleCache[cacheKey]) { UI.renderMarkdown(rightBody, DS_CONFIG.runtime.exampleCache[cacheKey], word); return; }
    DS_CONFIG.runtime.rightPanelAbortCtrl = new AbortController();

    UI.clear(rightBody);
    rightBody.appendChild(UI.el('span', { className: 'ds-popup-loading' }, 'Generating 2 examples...'));

    let prompt = "";
    if (isChinese(word)) { prompt = `针对中文词汇 "${word}" 的特定含义："${defText}"，请生成 **2个** 包含该词的中文例句并附带英文翻译。要求：1. 必须提供2个不同场景的例句。2. 不要使用前缀标签。3. 中英文交替显示。`; }
    else { prompt = `针对单词 "${word}" 的特定含义："${defText}"，请生成 **2个** 地道的英文例句并附带中文翻译。要求：1. 必须提供2个不同场景的例句。2. **不要** 使用 "En:" 或 "Cn:" 等前缀。3. 第一行英文，第二行中文，依次排列。`; }
    prompt += `\n(Ref: ${Date.now()})`;
    requestAI({
        messages: [{role:"system",content:prompt},{role:"user",content:word}],
        signal: DS_CONFIG.runtime.rightPanelAbortCtrl.signal,
        onUpdate: (delta, fullText) => {
            UI.renderMarkdown(rightBody, fullText, word);
        },
        onFinish: (fullText) => { if (fullText) { DS_CONFIG.runtime.exampleCache[cacheKey] = fullText; } },
        onError: (e) => { if(e.name !== 'AbortError') rightBody.innerText = "Error: " + e.message; }
    });
};

function copyToClip(text) { if (!text) return; GM_setClipboard(text); }

async function askAI(query, targetWord = "", mode = "chat", continueMessages = null, customSystemPrompt = null) {
    if (!DS_CONFIG.settings.apiKey || DS_CONFIG.settings.apiKey.length < 10) {alert("请配置有效的 DeepSeek API Key");return;}
    if (!isSidebarVisible()) showSidebar();
    if (DS_CONFIG.runtime.activeTab !== 'ai') switchTab('ai');
    if (!continueMessages && DS_CONFIG.runtime.abortCtrl) { DS_CONFIG.runtime.abortCtrl.abort(); }
    DS_CONFIG.runtime.abortCtrl = new AbortController();
    const log = document.getElementById('ds-chat-log');
    if (!log) return;
    let messages = [];
    let uMsg, aiMsg;
    if (continueMessages) {
       messages = continueMessages; aiMsg = DS_CONFIG.runtime.currentAiContext.element;
       aiMsg.appendChild(document.createElement('br'));
       aiMsg.appendChild(document.createElement('br'));
       aiMsg.appendChild(UI.el('i', {}, '[Continuing...]'));
       aiMsg.appendChild(document.createElement('br'));
    } else {
        uMsg = UI.el('div', { className: 'ds-msg user-msg' });
        let display = mode==="dict"?`📖 词典: ${targetWord}`:mode==="explain"?`🔍 沉浸: ${targetWord}`:mode==="summary"?"🎯 全文总结":mode==="custom"?"✨ "+query.substring(0,40):query.substring(0,40);
        uMsg.innerText = display; log.appendChild(uMsg);
        aiMsg = UI.el('div', { className: 'ds-msg ai-msg' }, '...');
        log.appendChild(aiMsg); log.scrollTop = log.scrollHeight;
        let sysPrompt = "你是一位专业的英语教育专家。";
        if (mode==="dict") sysPrompt += "请提供单词的词典释义。包含音标、词性、精准中文含义、不规则形式。严禁提供例句。";
        else if (mode==="explain") sysPrompt += "请引用原文，使用'#'分隔，解析该词在当前语境下的特定含义及作者意图，200字以内。";
        else if (mode==="summary") sysPrompt += "你是一位专业的文本分析师，需要对提供的文章内容进行结构化总结，要求：1. 分点呈现核心观点；2. 提炼文章关键信息、逻辑框架；3. 语言简洁专业，符合分析师报告风格；4. 忽略无关细节，聚焦文章主旨；5. 全部使用中文输出。";
        else if (mode==="custom" && customSystemPrompt) sysPrompt = customSystemPrompt;
        messages = [{role:"system",content:sysPrompt},{role:"user",content:query}];
    }
    DS_CONFIG.runtime.currentAiContext = { messages: messages, generatedText: continueMessages ? DS_CONFIG.runtime.currentAiContext.generatedText : "", element: aiMsg };
    await requestAI({
        messages: messages, signal: DS_CONFIG.runtime.abortCtrl.signal,
        onUpdate: (delta, fullText) => {
            DS_CONFIG.runtime.currentAiContext.generatedText = fullText;
            if (!continueMessages && aiMsg.innerText === "...") aiMsg.innerText = "";

            UI.renderMarkdown(aiMsg, fullText, (mode !== "summary" && mode !== "custom") ? targetWord : null);

            const threshold = 150;
            const isNearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < threshold;
            if (isNearBottom) { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); }
        },
        onError: (e) => {
            if (e.name === 'AbortError') {
                const continueElem = UI.el('div', {
                    className: 'ds-continue-text',
                    onclick: function() {
                        this.remove();
                        const newMessages = [...DS_CONFIG.runtime.currentAiContext.messages];
                        if (newMessages[newMessages.length - 1].role !== 'assistant') { newMessages.push({role: "assistant", content: DS_CONFIG.runtime.currentAiContext.generatedText}); }
                        else { newMessages[newMessages.length - 1].content = DS_CONFIG.runtime.currentAiContext.generatedText; }
                        newMessages.push({role: "user", content: "请继续（Continue）"});
                        askAI("", targetWord, mode, newMessages);
                    }
                }, '▶️ 继续');
                aiMsg.appendChild(continueElem);
                log.scrollTop = log.scrollHeight;
            } else { aiMsg.appendChild(document.createTextNode("\n[请求失败: " + e.message + "]")); }
        }
    });
}

// Undo Helper
function softDelete(element, onConfirm) {
    if (!element) return;
    const originalHTML = element.innerHTML;
    const originalClass = element.className;

    // 获取当前条目绑定的单词 (防止undefined，给个空字符串兜底)
    const word = element.dataset.word || "";

    element.className = 'web-menu-item ds-undo-mode';

    // 修改：将 word 包裹在 span 中，并设置 color:#1E90FF (这是DeepSeek查词/高亮的标准蓝色)
    // 外层文字保持 #6db3f2 (浅蓝)，中间单词变为 #1E90FF (亮蓝)
    element.innerHTML = `<span style="color:#6db3f2;cursor:pointer;font-weight:bold">🔄 取消对 <span style="color:#1E90FF">“${word}”</span> 的删除</span>`;

    let isRestored = false;
    const timer = setTimeout(() => {
        if (!isRestored) {
            element.remove();
            if (onConfirm) onConfirm();
        }
    }, 3000); // 保持3秒撤回时间

    element.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        clearTimeout(timer);
        isRestored = true;
        element.className = originalClass;
        element.innerHTML = originalHTML;
        element.onclick = null; // Remove temp handler
    };
}

function saveHighlights() {
    DS_CONFIG.runtime.isRestoring = true; const h = [];
    document.querySelectorAll(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`).forEach(el => {
        const parent = el.parentElement; if (parent) {
            let rank = 0; const text = el.textContent; const regex = new RegExp(escapeRegExp(text), 'g');
            for (let i = 0; i < parent.childNodes.length; i++) {
                const child = parent.childNodes[i]; if (child === el) break;
                const childText = child.textContent; const matches = childText.match(regex); if (matches) rank += matches.length;
            }
            h.push({ path: getPathTo(parent), text: text, rank: rank });
        }
    });
    localStorage.setItem(DS_CONFIG.consts.STORAGE_KEY, JSON.stringify(h));
    // 修改处：如果当前在 history 标签页，则刷新 history 菜单以更新📍状态
    if (DS_CONFIG.runtime.activeTab === 'history') renderHistoryMenu();
    setTimeout(() => { DS_CONFIG.runtime.isRestoring = false; }, 100);
}

function removeHighlight(el) {
    DS_CONFIG.runtime.isRestoring = true;

    // --- 新增逻辑开始 ---
    // 1. 获取当前高亮文本
    const text = el.textContent.trim();
    // 2. 调用历史记录删除函数（从全局历史中移除该词）
    if(text) deleteFromHistory(text);
    // --- 新增逻辑结束 ---

    const p = el.parentNode;
    if (p) {
        while (el.firstChild) p.insertBefore(el.firstChild, p.contains(el) ? el : null);
        el.remove();
        saveHighlights();
    }
}

function deleteWord(word, elementRef = null) {
    const doDelete = () => {
        let removedFromDom = false;
        document.querySelectorAll(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`).forEach(el => {
            if (el.textContent.trim() === word) {
                const p = el.parentNode;
                while (el.firstChild) p.insertBefore(el.firstChild, el);
                el.remove();
                removedFromDom = true;
            }
        });
        if (removedFromDom) {
            saveHighlights();
        } else {
            const saved = JSON.parse(localStorage.getItem(DS_CONFIG.consts.STORAGE_KEY) || '[]');
            const newSaved = saved.filter(h => h.text !== word);
            localStorage.setItem(DS_CONFIG.consts.STORAGE_KEY, JSON.stringify(newSaved));
            refreshHighlightMenu();
        }
    };

    if (elementRef) {
        softDelete(elementRef, doDelete);
    } else {
        doDelete();
    }
}

function applySavedHighlights() {
    if (DS_CONFIG.runtime.isRestoring) return; DS_CONFIG.runtime.isRestoring = true;
    try {
        const saved = JSON.parse(localStorage.getItem(DS_CONFIG.consts.STORAGE_KEY) || '[]');
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
                            if (node.parentElement.classList.contains(DS_CONFIG.consts.HIGHLIGHT_CLASS)) { finishedItem = true; break; }
                            const range = document.createRange(); range.setStart(node, idx); range.setEnd(node, idx + item.text.length);
                            const mark = document.createElement('mark'); mark.className = DS_CONFIG.consts.HIGHLIGHT_CLASS; mark.appendChild(range.extractContents()); range.insertNode(mark);
                            finishedItem = true; break;
                        }
                        matchCount++; searchPos = idx + 1;
                    }
                }
            }
        });
    } catch(e){}
    setTimeout(() => { DS_CONFIG.runtime.isRestoring = false; }, 200);
}

function refreshHighlightMenu() {
    if (!DOM.highlightContent) return;
    const words = [...new Set(JSON.parse(localStorage.getItem(DS_CONFIG.consts.STORAGE_KEY) || '[]').map(h => h.text))];

    UI.clear(DOM.highlightContent);
    const logEl = UI.el('div', { id: 'ds-highlight-log' });

    if (words.length === 0) {
        logEl.appendChild(UI.el('div', { style: { textAlign: 'center', color: '#666', marginTop: '20px', fontSize: '13px' } }, [
            "暂无生词记录", document.createElement('br')
        ]));
        DOM.highlightContent.appendChild(logEl);
        return;
    }

    words.forEach(word => {
        const item = UI.el('div', { className: 'web-menu-item', 'data-word': word }, [
            UI.el('div', { className: 'web-menu-header' }, [
                UI.el('span', { className: 'web-menu-word' }, word),
                UI.el('span', { className: 'web-menu-jump', title: '跳转到文中位置' }, '📍')
            ]),
            UI.el('div', { className: 'web-menu-trans', style: { display: 'none' } })
        ]);
        logEl.appendChild(item);
    });
    DOM.highlightContent.appendChild(logEl);
}

const isSidebarVisible = () => {
    if (!DOM.sidebar) return false;
    if (DS_CONFIG.settings.sidebarSide === 'right') return DOM.sidebar.style.right === '0px';
    return DOM.sidebar.style.left === '0px';
};

const showSidebar = () => {
    if (DOM.sidebar) {
        if (DS_CONFIG.settings.sidebarSide === 'right') { DOM.sidebar.style.right = '0'; DOM.sidebar.style.left = ''; }
        else { DOM.sidebar.style.left = '0'; DOM.sidebar.style.right = ''; }
    }
    updatePageLayout();
    if (!DS_CONFIG.settings.isDocked) toggleDockingMode(true);
};

const hideSidebar = () => {
    if (DOM.sidebar) {
        if (DS_CONFIG.settings.sidebarSide === 'right') { DOM.sidebar.style.right = '-1200px'; DOM.sidebar.style.left = ''; }
        else { DOM.sidebar.style.left = '-1200px'; DOM.sidebar.style.right = ''; }
    }
    if (DS_CONFIG.runtime.abortCtrl) DS_CONFIG.runtime.abortCtrl.abort();
    const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = 'none';
    const hp = document.getElementById('ds-help-panel'); if (hp) hp.style.display = 'none';
    updatePageLayout();
    if (DS_CONFIG.settings.isDocked) toggleDockingMode(false);
};

const switchTab = (tabName) => {
    // 移除了 'highlight' 的判断
    if (tabName !== 'ai' && tabName !== 'docked' && tabName !== 'history') return;
    DS_CONFIG.runtime.activeTab = tabName;
    document.querySelectorAll('.ds-tab').forEach(tab => { tab.classList.remove('active'); if (tab.dataset.tab === tabName) tab.classList.add('active'); });
    document.querySelectorAll('.tab-panel').forEach(panel => { panel.classList.remove('active'); if (panel.dataset.panel === tabName) panel.classList.add('active'); });

// 原 highlight 的 applySavedHighlights 现在由定时器或初始化自动调用
    // history tab 承担渲染职责
    if (tabName === 'history') {
        // 修改：每次打开历史Tab，强制按最新时间排序，无需保存
        DS_CONFIG.settings.historySort = 'time_desc';
        DS_CONFIG.runtime.historyLimit = 50; // 重置显示数量
        renderHistoryMenu();
    }
};

function toggleDockingMode(enable, isInit = false) {
    DS_CONFIG.settings.isDocked = enable;
    GM_setValue('ds_is_docked', enable);

    const dockedTab = document.getElementById('ds-tab-docked');
    const popup = document.getElementById('ds-popup');

    if (enable) {
        popup.style.display = 'none';
        if (dockedTab) dockedTab.style.display = 'flex';
        if (!isInit) {
            switchTab('docked');
        }
} else {
        if (dockedTab) dockedTab.style.display = 'none';
        if (DS_CONFIG.runtime.activeTab === 'docked') switchTab('history'); // 改为回退到 history
    }
}

// ==================== READER MODE LOGIC ====================
function toggleReaderMode() {
    if (DS_CONFIG.runtime.isReaderMode) exitReaderMode();
    else enterReaderMode();
}

function enterReaderMode() {
    if (DS_CONFIG.runtime.isReaderMode) return;
    if (typeof Readability === 'undefined') {
        alert("Readability library failed to load. Please check your connection.");
        return;
    }
    const documentClone = document.cloneNode(true);
    const reader = new Readability(documentClone);
    const article = reader.parse();
    if (!article) return alert("抱歉，未能识别正文内容。");

    DS_CONFIG.runtime.isReaderMode = true;
    document.documentElement.classList.add('reader-mode-active');
    document.body.classList.add('reader-mode-active');

    DOM.readerWrapper = document.createElement('div');
    DOM.readerWrapper.id = 'custom-reader-overlay';

    DOM.readerWrapper.innerHTML = `
        <div id="reader-progress-v"></div>
        <div id="reader-ctrl-bar">
            <button class="ctrl-btn btn-width" id="pw-minus" title="加宽">‹ ›</button>
            <button class="ctrl-btn btn-width" id="pw-plus" title="缩窄">› ‹</button>
            <button class="ctrl-btn btn-fs-plus" id="fs-plus" title="增大字号">A</button>
            <button class="ctrl-btn btn-fs-minus" id="fs-minus" title="减小字号">ᴀ</button>
            <button class="ctrl-btn" id="lh-plus" title="增大行高" style="font-size:16px">☰+</button>
            <button class="ctrl-btn" id="lh-minus" title="减小行高" style="font-size:12px">☰-</button>
            <button class="ctrl-btn exit-btn" id="reader-exit" title="退出">✕</button>
        </div>

        <div id="custom-reader-container" style="width: ${DS_CONFIG.runtime.readerPageWidth}px; font-size: ${DS_CONFIG.runtime.readerFontSize}px; line-height: ${DS_CONFIG.runtime.readerLineHeight}; padding: 60px 20px 100px 20px;">
            <h1 style="font-size: ${DS_CONFIG.runtime.readerFontSize + 12}px; color: #A8A495; margin: 0 0 40px 0; line-height: 1.3;">${article.title}</h1>
            <div id="reader-content-body">${article.content}</div>
        </div>
    `;
    document.body.appendChild(DOM.readerWrapper);

    // 【新增修复】：将浮窗元素重新移动到 Body 末尾，确保它位于阅读模式遮罩层之上
    if (DOM.popup && DOM.popup.parentNode) {
        document.body.appendChild(DOM.popup);
    }

    updateReaderCtrlPosition();
    updatePageLayout();

    DOM.readerWrapper.onscroll = () => {
        const height = DOM.readerWrapper.scrollHeight - DOM.readerWrapper.clientHeight;
        const scrolled = (DOM.readerWrapper.scrollTop / height) * 100 || 0;
        const prog = document.getElementById("reader-progress-v");
        if (prog) prog.style.height = scrolled + "%";
    };

    document.getElementById('fs-plus').onclick = () => updateReaderStyle('fs', 2);
    document.getElementById('fs-minus').onclick = () => updateReaderStyle('fs', -2);
    document.getElementById('pw-plus').onclick = () => updateReaderStyle('pw', -50);
    document.getElementById('pw-minus').onclick = () => updateReaderStyle('pw', 50);
    document.getElementById('lh-plus').onclick = () => updateReaderStyle('lh', 0.1);
    document.getElementById('lh-minus').onclick = () => updateReaderStyle('lh', -0.1);
    document.getElementById('reader-exit').onclick = exitReaderMode;
}

function updateReaderCtrlPosition() {
    const bar = document.getElementById('reader-ctrl-bar');
    if (!bar) return;

    bar.style.left = '';
    bar.style.right = '';
    bar.style.borderRadius = '';
    bar.style.borderWidth = '1px';
    bar.style.borderStyle = 'solid';
    bar.style.borderTop = 'none';

    if (DS_CONFIG.settings.sidebarSide === 'right') {
        bar.style.left = '0';
        bar.style.right = 'auto';
        bar.style.borderRadius = '0 0 4px 0';
        bar.style.borderLeft = 'none';
    } else {
        bar.style.right = '0';
        bar.style.left = 'auto';
        bar.style.borderRadius = '0 0 0 4px';
        bar.style.borderRight = 'none';
    }
}

function exitReaderMode() {
    if (!DS_CONFIG.runtime.isReaderMode) return;
    DS_CONFIG.runtime.isReaderMode = false;
    if (DOM.readerWrapper) DOM.readerWrapper.remove();
    document.documentElement.classList.remove('reader-mode-active');
    document.body.classList.remove('reader-mode-active');
    updatePageLayout();
}

function updateReaderStyle(type, delta) {
    const container = document.getElementById('custom-reader-container');
    if (!container) return;
    if (type === 'fs') {
        DS_CONFIG.runtime.readerFontSize += delta;
        container.style.fontSize = DS_CONFIG.runtime.readerFontSize + 'px';
        const title = container.querySelector('h1');
        if (title) title.style.fontSize = (DS_CONFIG.runtime.readerFontSize + 12) + 'px';
    } else if (type === 'pw') {
        DS_CONFIG.runtime.readerPageWidth += delta;
        const maxW = window.innerWidth - 150;
        if (DS_CONFIG.runtime.readerPageWidth < 400) DS_CONFIG.runtime.readerPageWidth = 400;
        if (DS_CONFIG.runtime.readerPageWidth > maxW) DS_CONFIG.runtime.readerPageWidth = maxW;
        container.style.width = DS_CONFIG.runtime.readerPageWidth + 'px';
    } else if (type === 'lh') {
        DS_CONFIG.runtime.readerLineHeight += delta;
        if (DS_CONFIG.runtime.readerLineHeight < 1.0) DS_CONFIG.runtime.readerLineHeight = 1.0;
        container.style.lineHeight = DS_CONFIG.runtime.readerLineHeight;
    }
}

function showSmartPopup(text, targetHighlight, context = "", isSelection = false) {
    // NEW: 强制关闭可能遮挡的面板
    const cp = document.getElementById('ds-config-panel');
    const hp = document.getElementById('ds-help-panel');
    if (cp) cp.style.display = 'none';
    if (hp) hp.style.display = 'none';

    DS_CONFIG.runtime.isSwitchingContext = true;
    if (DS_CONFIG.runtime.popupAbortCtrl) DS_CONFIG.runtime.popupAbortCtrl.abort();
    setTimeout(() => { DS_CONFIG.runtime.isSwitchingContext = false; }, 0);

    DS_CONFIG.runtime.popupAbortCtrl = new AbortController();
    const signal = DS_CONFIG.runtime.popupAbortCtrl.signal;

    // Modified Prompt: Added strict word limit
    const dictPrompt = isChinese(text) ? "你是一个专业的汉语词典接口。请严格按照词典格式输出，不要废话。" : "你是一个基于 ECDICT (Collins + Oxford) 数据库的词典接口。请严格按照以下 ECDICT 数据结构输出信息，不要提供例句。请严格控制输出在150字以内，避免重复循环。\n\n格式要求：\n单词原型\n/音标/\n词性. 中文释义\nExchange: ...\nTags: ...\n...";
    const dictKey = text;
    const contextKey = text + "_" + context.substring(0, 20);
    const contextPrompt = `你是一个语言专家。请分析"${text}"在以下句子中的用法：\n\n"${context}"\n\n请模仿以下风格进行解析：\n"在句子 '...' 中，'${text}' 是...词性...形式，与...构成...搭配，表示...。这里的固定搭配是...，意思是...。"`;

    let leftEl, rightEl;
    if (DS_CONFIG.settings.isDocked) {
        showSidebar(); // 确保侧边栏打开
        switchTab('docked');
        leftEl = document.querySelector('#ds-docked-left-content .ds-popup-text');
        rightEl = document.querySelector('#ds-docked-right-content .ds-popup-text');

        // Update Title to "🧠 文中解析"
        const rightTitle = document.querySelector('#ds-docked-right-content .ds-popup-title');
        if (rightTitle) rightTitle.innerText = '🧠 文中解析';
    } else {
        if (!DOM.popup) return;
        let rect;
        if (isSelection) { try { rect = window.getSelection().getRangeAt(0).getBoundingClientRect(); } catch(e) { return; } }
        else if (targetHighlight) { rect = targetHighlight.getBoundingClientRect(); }
        else { rect = { top: DS_CONFIG.runtime.lastY - 10, bottom: DS_CONFIG.runtime.lastY + 10, left: DS_CONFIG.runtime.lastX - 10, width: 20, height: 20 }; }
        const pWidth = parseInt(DOM.popup.style.width || DS_CONFIG.settings.popupWidth) || 600;
        const pHeight = parseInt(DOM.popup.style.height || DS_CONFIG.settings.popupHeight) || 350;
        const viewportHeight = window.innerHeight; const viewportWidth = window.innerWidth;
        let top = rect.bottom + 10; let left = rect.left + (rect.width / 2) - (pWidth / 2);
        if (top + pHeight > viewportHeight) { top = rect.top - 10 - pHeight; if (top < 10) top = 10; }
        if (left < 10) left = 10; if (left + pWidth > viewportWidth - 10) left = viewportWidth - pWidth - 10;
        DOM.popup.style.top = top + 'px'; DOM.popup.style.left = left + 'px'; DOM.popup.style.transform = 'none';
        DOM.popup.style.display = 'flex';
        DS_CONFIG.runtime.currentPopupTrigger = targetHighlight;

        UI.clear(DOM.popup);
        ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'].forEach(dir => {
            DOM.popup.appendChild(UI.el('div', { className: `ds-resize-handle ds-rh-${dir}`, 'data-dir': dir }));
        });

        const headerBar = UI.el('div', { id: 'ds-popup-header-bar' }, [
            UI.el('div', { id: 'ds-popup-lock', className: 'ds-popup-icon', title: '锁定并吸附到侧边栏' }, '🏠'),
            UI.el('div', { id: 'ds-popup-close-float', className: 'ds-popup-icon' }, '✖')
        ]);
        DOM.popup.appendChild(headerBar);

        // Update Titles in Popup
        const body = UI.el('div', { id: 'ds-popup-body' }, [
            UI.el('div', { className: 'ds-split-view' }, [
                UI.el('div', { className: 'ds-split-left', id: 'ds-popup-left-content' }, [
                      UI.el('div', { className: 'ds-popup-title' }, '🔍 词典解析'),
                      UI.el('div', { className: 'ds-popup-text' })
                ]),
                UI.el('div', { className: 'ds-split-right', id: 'ds-popup-right-content' }, [
                      UI.el('div', { className: 'ds-popup-title' }, '🧠 文中解析'),
                      UI.el('div', { className: 'ds-popup-text' })
                ])
            ])
        ]);
        DOM.popup.appendChild(body);

        bindPopupEvents(text);
        leftEl = DOM.popup.querySelector('#ds-popup-left-content .ds-popup-text');
        rightEl = DOM.popup.querySelector('#ds-popup-right-content .ds-popup-text');
    }

    if (!leftEl || !rightEl) return;
    DS_CONFIG.runtime.lastPopupParams.left = { sys: dictPrompt, user: text, el: leftEl, cat: 'dict', key: dictKey, hw: text, mode: 'dict' };
    DS_CONFIG.runtime.lastPopupParams.right = { sys: contextPrompt, user: context, el: rightEl, cat: 'context', key: contextKey, hw: text, mode: 'normal' };

    streamToElement(dictPrompt, text, leftEl, 'dict', dictKey, text, 'dict', signal);
    streamToElement(contextPrompt, context, rightEl, 'context', contextKey, text, 'normal', signal);
}

function bindPopupEvents(text) {
    const headerBar = document.getElementById('ds-popup-header-bar');
    if(headerBar) {
        headerBar.addEventListener('mousedown', (e) => {
            const icon = e.target.closest('.ds-popup-icon');
            if (icon) return;
            DS_CONFIG.runtime.isDraggingPopup = true; DS_CONFIG.runtime.dragStartX = e.clientX; DS_CONFIG.runtime.dragStartY = e.clientY; DS_CONFIG.runtime.popupStartX = DOM.popup.offsetLeft; DS_CONFIG.runtime.popupStartY = DOM.popup.offsetTop;
            document.body.classList.add('ds-global-cursor-move');
            document.documentElement.classList.add('ds-global-cursor-move');
        });
        headerBar.addEventListener('click', (e) => {
            const icon = e.target.closest('.ds-popup-icon');
            if (!icon) return;
            if (icon.id === 'ds-popup-close-float') { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; }
            else if (icon.id === 'ds-popup-lock') { showSidebar(); }
        });
    }
    DOM.popup.querySelectorAll('.ds-resize-handle').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            e.preventDefault(); e.stopPropagation();
            DS_CONFIG.runtime.isResizingPopup = true;
            DS_CONFIG.runtime.resizeDirection = el.dataset.dir;
            DS_CONFIG.runtime.dragStartX = e.clientX;
            DS_CONFIG.runtime.dragStartY = e.clientY;
            DS_CONFIG.runtime.resizeStartRect = DOM.popup.getBoundingClientRect();
        });
    });
}

function createSidebarIcon(id, icon, title, labelText, active = false) {
    const iconDiv = UI.el('div', { id: id, className: `ds-v-icon ${active ? 'active' : ''}`, title: title, draggable: true }, icon);
    const labelSpan = UI.el('span', { className: 'ds-v-label' }, labelText);
    iconDiv.appendChild(labelSpan);
    return iconDiv;
}

function buildUI() {
    const isTopWindow = (window.self === window.top);
    if (!isTopWindow) return;
    if (document.getElementById('ds-sidebar')) return;

    const container = UI.el('div', { id: 'ds-sidebar' });
    const promptString = DS_CONFIG.settings.customPrompts.map(p => `${p.name}=${p.template}`).join('\n');
    const sitesString = DS_CONFIG.settings.customSites.map(s => `${s.name}=${s.value}`).join('\n');
    const disabledSitesString = DS_CONFIG.settings.disabledSites.join('\n');

    const activeZone = UI.el('div', { id: 'ds-toolbar-active' });
    const hiddenZone = UI.el('div', { id: 'ds-toolbar-hidden' }, [
        UI.el('span', { className: 'ds-hidden-text' }, '可将图标拖动此处隐藏')
    ]);

    const verticalToolbar = UI.el('div', { id: 'ds-vertical-toolbar' }, [activeZone, hiddenZone]);

    // 定义所有图标数据
    const allIconsData = [
        { id: 'ds-close', icon: '✖', title: '关闭', label: '关闭' },
        { id: 'ds-side-toggle', icon: '👈🏻', title: '切换侧边栏方向', label: '切至左侧' },
        { id: 'ds-full-page-trans-btn', icon: '🌐', title: '全文翻译开关', label: '全文翻译' },
        { id: 'ds-expand-toolbar', icon: '↔️', title: '展开菜单', label: '展开菜单' },
        { id: 'ds-summary-btn', icon: '🎯', title: '全文总结', label: '全文总结' },
        { id: 'ds-reader-mode-btn', icon: '👓', title: '阅读模式 (简读)', label: '阅读模式' },
        { id: 'ds-help-btn', icon: '💡', title: '使用说明', label: '使用说明' },
        { id: 'ds-cfg-toggle', icon: '⚙️', title: '设置', label: '设置' }
    ];

    // 根据配置渲染图标到不同区域
    const hiddenSet = new Set(DS_CONFIG.settings.hiddenIcons);
    allIconsData.forEach(data => {
        const btn = createSidebarIcon(data.id, data.icon, data.title, data.label);
        // 强制 设置按钮 和 关闭按钮 始终显示（防止用户把自己锁死）
        if (data.id === 'ds-cfg-toggle' || data.id === 'ds-close') {
            activeZone.appendChild(btn);
        } else if (hiddenSet.has(data.id)) {
            hiddenZone.appendChild(btn); // 放入隐藏区
        } else {
            activeZone.appendChild(btn); // 放入活跃区
        }
    });

    // Drag and Drop Logic (Refined for 2 Zones)
    let draggedItem = null;

    const handleDragStart = (e) => {
        if (e.target.classList.contains('ds-v-icon')) {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            // 关键修正：添加 dragging 类名，确保 getDragAfterElement 计算准确
            setTimeout(() => e.target.classList.add('dragging'), 0);
        }
    };

    const handleDragEnd = (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.style.opacity = '';

            // 保存隐藏状态
            const newHiddenList = [];
            hiddenZone.querySelectorAll('.ds-v-icon').forEach(el => newHiddenList.push(el.id));
            GM_setValue('ds_hidden_icons', newHiddenList);
            DS_CONFIG.settings.hiddenIcons = newHiddenList;

            draggedItem = null;
        }
    };

    // ... (前面是 handleDragStart 和 handleDragEnd) ...

    const handleDragOver = (e, container) => {
        e.preventDefault();

        // 1. 只有在编辑模式下，或者 目标是活跃区 时才允许拖动 (允许从隐藏区拖回活跃区)
        const isEditMode = verticalToolbar.classList.contains('ds-edit-mode');

        // 如果不在编辑模式，严禁拖入隐藏区
        if (!isEditMode && container.id === 'ds-toolbar-hidden') return;

        // 2. 保护机制：强制 设置按钮 和 关闭按钮 不能被拖入隐藏区
        if (draggedItem && (draggedItem.id === 'ds-cfg-toggle' || draggedItem.id === 'ds-close') && container.id === 'ds-toolbar-hidden') {
            return;
        }

        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedItem);
        } else {
            container.insertBefore(draggedItem, afterElement);
        }
    };

    function getDragAfterElement(container, y) {
        // 排除正在拖动的元素自身
        const draggableElements = [...container.querySelectorAll('.ds-v-icon:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }


    // 绑定事件
    verticalToolbar.addEventListener('dragstart', handleDragStart);
    verticalToolbar.addEventListener('dragend', handleDragEnd);
    activeZone.addEventListener('dragover', (e) => handleDragOver(e, activeZone));
    hiddenZone.addEventListener('dragover', (e) => handleDragOver(e, hiddenZone));

    // ============ 2. Main Content Panel (New Wrapper) ============
    const mainPanel = UI.el('div', { id: 'ds-main-panel' });

    // Header for Tabs (Simplified)
    const createTab = (id, icon, label, title, active=false) => {
         return UI.el('div', { className: `ds-tab ${active?'active':''}`, 'data-tab': id, title: title, draggable: true }, [
             document.createTextNode(icon),
             UI.el('span', { className: 'ds-tab-label' }, label)
         ]);
    };

const tabHeader = UI.el('div', { id: 'ds-tab-header' }, [
        UI.el('div', { id: 'ds-tabs-wrapper' }, [
            // 合并后的Tab：使用🕒图标，名字改为历史，默认active
            createTab('history', '🕒', '历史', '历史与高亮', true),
            createTab('ai', '💬', '对话', 'AI 助手'),
            UI.el('div', { className: 'ds-tab', id: 'ds-tab-docked', 'data-tab': 'docked', title: '固定模式', style: { display: 'none' }, draggable: true }, [
                document.createTextNode('📖'),
                UI.el('span', { className: 'ds-tab-label' }, '词典')
            ])
        ])
    ]);

    // Tab Drag and Drop Logic
    let draggedTab = null;
    const tabsWrapper = tabHeader.querySelector('#ds-tabs-wrapper');

    tabsWrapper.addEventListener('dragstart', (e) => {
        const tab = e.target.closest('.ds-tab');
        if (tab) {
            draggedTab = tab;
            tab.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    tabsWrapper.addEventListener('dragend', (e) => {
        const tab = e.target.closest('.ds-tab');
        if (tab) {
            tab.classList.remove('dragging');
            draggedTab = null;
        }
    });

    tabsWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterTab(tabsWrapper, e.clientX);
        const dragging = tabsWrapper.querySelector('.dragging');
        if (dragging) {
            if (afterElement == null) {
                tabsWrapper.appendChild(dragging);
            } else {
                tabsWrapper.insertBefore(dragging, afterElement);
            }
        }
    });

    function getDragAfterTab(container, x) {
        const draggableElements = [...container.querySelectorAll('.ds-tab:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Confirm Modal
    const confirmModal = UI.el('div', { id: 'ds-confirm-modal' }, [
        UI.el('div', { className: 'ds-confirm-box' }, [
            UI.el('div', { className: 'ds-confirm-text' }, '确定要清空所有生词和缓存吗？'),
            UI.el('div', { className: 'ds-confirm-btns' }, [
                UI.el('button', { id: 'ds-confirm-yes', className: 'ds-btn ds-btn-yes' }, '确定清空'),
                UI.el('button', { id: 'ds-confirm-no', className: 'ds-btn ds-btn-no' }, '取消')
            ])
        ])
    ]);

    // Config Panel
    const configPanel = UI.el('div', { id: 'ds-config-panel' }, [
        UI.el('div', { className: 'ds-panel-header' }, [
            UI.el('span', { className: 'ds-panel-title' }, '⚙️ 设置'),
            UI.el('button', { id: 'save-api-key', className: 'ds-panel-top-btn' }, '保存并退出')
        ]),
UI.el('div', { className: 'cfg-row' }, [
            UI.el('span', { style: { fontWeight: 'bold' } }, '查询/高亮/跳转时复制文本:'),
            UI.el('label', { className: 'ds-switch' }, [
                UI.el('input', { type: 'checkbox', id: 'cfg-auto-copy', checked: DS_CONFIG.settings.autoCopy }),
                UI.el('span', { className: 'ds-slider-btn' })
            ])
        ]),
        UI.el('div', { className: 'cfg-row', style: { flexDirection: 'column', alignItems: 'flex-start' } }, [
            UI.el('span', { style: { fontWeight: 'bold' } }, 'DeepSeek API Key:'),
            UI.el('input', { type: 'password', id: 'cfg-api-key', style: { width: '100%', marginTop: '5px', padding: '6px' }, value: DS_CONFIG.settings.apiKey })
        ]),
        UI.el('div', { className: 'cfg-row', style: { flexDirection: 'column', alignItems: 'flex-start' } }, [
            UI.el('span', { className: 'ds-instruction-text' }, '自定义Prompt格式（每行一个Prompt）：'),
            UI.el('span', { className: 'ds-instruction-text', style: { fontWeight: 'normal', color: 'var(--ds-text)', opacity: 0.8 } }, '按钮名=prompt具体指令'),
            UI.el('textarea', { id: 'cfg-prompts', className: 'ds-cfg-textarea', placeholder: '按钮名称=具体指令内容\n每行一条...', value: promptString })
        ]),
        // New: Custom AI Sites Config
        UI.el('div', { className: 'cfg-row', style: { flexDirection: 'column', alignItems: 'flex-start' } }, [
            UI.el('span', { className: 'ds-instruction-text' }, '自定义求助网站格式（每行一个网站）：'),
            UI.el('span', { className: 'ds-instruction-text', style: { fontWeight: 'normal', color: 'var(--ds-text)', opacity: 0.8 } }, '按钮名=网站具体网址'),
            UI.el('textarea', { id: 'cfg-ai-sites', className: 'ds-cfg-textarea', placeholder: 'DeepSeek=https://chat.deepseek.com/\n...', value: sitesString })
        ]),
        UI.el('div', { className: 'cfg-row', style: { flexDirection: 'column', alignItems: 'flex-start' } }, [
            UI.el('span', { className: 'ds-instruction-text' }, '禁用网站名单：'),
            UI.el('textarea', { id: 'cfg-disabled-sites', className: 'ds-cfg-textarea', placeholder: 'example.com\nyoutube.com/shorts\n...', value: disabledSitesString })
        ])
    ]);

    // Help Panel
    const createHelpItem = (key, desc) => UI.el('div', { className: 'ds-help-item' }, [
        UI.el('span', { className: 'ds-help-key' }, key),
        UI.el('span', { className: 'ds-help-desc' }, desc)
    ]);
    const helpPanel = UI.el('div', { id: 'ds-help-panel' }, [
        UI.el('div', { className: 'ds-panel-header' }, [
            UI.el('span', { className: 'ds-panel-title' }, '💡 使用说明'),
            UI.el('button', { id: 'ds-help-close', className: 'ds-panel-top-btn' }, '退出')
        ]),
        createHelpItem('Alt + Alt', '快速双击 (0.5s内)，调出浮窗对鼠标所指文本查词。'),
        createHelpItem('Alt', '关闭浮窗。'),
        createHelpItem('Alt + 1', '对鼠标所指文本切换高亮状态。'),
        createHelpItem('Alt + 2', '开关侧边栏（开启时自动吸附查词）。'),
        createHelpItem('Alt + 3', '开关沉浸式阅读模式。'),
        createHelpItem('Alt + 左键', '可对鼠标所指文本段落进行翻译。'),
    ]);

// Tab Content
    const tabContent = UI.el('div', { id: 'ds-tab-content' }, [
        // 删除了 ds-highlight-content，将 history 设为 active
        UI.el('div', { className: 'tab-panel active', 'data-panel': 'history', id: 'ds-history-content' }),
        UI.el('div', { className: 'tab-panel', 'data-panel': 'ai', id: 'ds-ai-content' }, [
            UI.el('div', { id: 'ds-chat-log' })
        ]),
        UI.el('div', { className: 'tab-panel', 'data-panel': 'docked', id: 'ds-docked-panel' }, [
            UI.el('div', { className: 'ds-docked-content' }, [
                UI.el('div', { className: 'ds-docked-section ds-docked-scroll', id: 'ds-docked-left-content', style: { flex: 1, borderBottom: '1px solid #444' } }, [
                    UI.el('div', { className: 'ds-popup-title' }, '🔍 词典解析'),
                    UI.el('div', { className: 'ds-popup-text' })
                ]),
                UI.el('div', { className: 'ds-docked-section ds-docked-scroll', id: 'ds-docked-right-content', style: { flex: 1 } }, [
                    UI.el('div', { className: 'ds-popup-title' }, '🧠 文中解析'),
                    UI.el('div', { className: 'ds-popup-text' })
                ])
            ])
        ])
    ]);

    // NEW: Jump Button Panel Implementation (No more Select)
    const currentSiteName = DS_CONFIG.settings.customSites.find(s => s.value === DS_CONFIG.settings.lastAiSite)?.name || "DeepSeek";

    const jumpWrapper = UI.el('div', { className: 'ds-jump-wrapper' }, [
        UI.el('button', { id: 'ds-jump-btn', className: 'ds-action-btn', style: { marginRight: '5px' } }, '🔗 求助'),
        UI.el('div', { className: 'ds-jump-select-wrapper' }, [
            UI.el('button', { id: 'ds-cur-site-btn', className: 'ds-jump-select-btn', title: '点击切换跳转目标' }, [
                 document.createTextNode(currentSiteName),
                 UI.el('span', { style: {fontSize: '10px', opacity: 0.7} }, '▼')
            ]),
            UI.el('div', { id: 'ds-site-panel', className: 'ds-site-panel' })
        ])
    ]);

    // Populate Site Panel
    const updateSitePanel = () => {
        const panel = jumpWrapper.querySelector('#ds-site-panel');
        UI.clear(panel);
        DS_CONFIG.settings.customSites.forEach(s => {
            const btn = UI.el('div', {
                className: `ds-site-item ${s.value === DS_CONFIG.settings.lastAiSite ? 'active' : ''}`,
                title: s.value
            }, s.name);
            btn.addEventListener('click', () => {
                DS_CONFIG.settings.lastAiSite = s.value;
                GM_setValue('ds_last_ai_site', s.value);

                // Active class update
                panel.querySelectorAll('.ds-site-item').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');

                const curBtn = document.getElementById('ds-cur-site-btn');
                if (curBtn) {
                     curBtn.firstChild.textContent = s.name;
                }
                panel.classList.remove('active');
            });
            panel.appendChild(btn);
        });
    };
    updateSitePanel();

    // Input Area
    const inputArea = UI.el('div', { id: 'ds-input-area' }, [
        UI.el('div', { id: 'ds-input-wrapper' }, [
            UI.el('textarea', { id: 'ds-input', placeholder: 'DeepSeek AI 等待您的指令...' }),
            UI.el('div', { id: 'ds-send-row' }, [
                jumpWrapper,
                UI.el('button', { id: 'ds-send', className: 'ds-action-btn' }, '🚀 发送')
            ])
        ])
    ]);

    mainPanel.appendChild(tabHeader);
    mainPanel.appendChild(confirmModal);
    mainPanel.appendChild(configPanel);
    mainPanel.appendChild(helpPanel);
    mainPanel.appendChild(tabContent);
    mainPanel.appendChild(UI.el('div', { id: 'ds-fn-bar' }));
    mainPanel.appendChild(inputArea);

    container.appendChild(UI.el('div', { id: 'ds-resizer' }));
    container.appendChild(verticalToolbar);
    container.appendChild(mainPanel);

    const popupEl = UI.el('div', { id: 'ds-popup', style: { width: DS_CONFIG.settings.popupWidth, height: DS_CONFIG.settings.popupHeight } });
    popupEl.addEventListener('mouseup', () => {
        GM_setValue('ds_popup_width', popupEl.style.width);
        GM_setValue('ds_popup_height', popupEl.style.height);
    });

    document.body.appendChild(container);
    document.body.appendChild(popupEl);

    DOM.sidebar = container;
    DOM.popup = popupEl;
    DOM.highlightContent = document.getElementById('ds-highlight-content');

const autoCopySwitch = document.getElementById('cfg-auto-copy');
    if (autoCopySwitch) {
        autoCopySwitch.addEventListener('change', (e) => {
             const isChecked = e.target.checked;
             DS_CONFIG.settings.autoCopy = isChecked;
             // 同时更新两个值以保持兼容性，或者后续逻辑只用 autoCopy
             GM_setValue('ds_auto_copy', isChecked);
             GM_setValue('ds_jump_copy', isChecked);
             DS_CONFIG.settings.jumpCopy = isChecked;
        });
    }

    renderCustomButtons();
    injectStyles();
    updateSidebarPosition(false);

    if (DS_CONFIG.settings.isDocked) {
        toggleDockingMode(true, true);
    }
}

function renderCustomButtons() {
    const bar = document.getElementById('ds-fn-bar'); if (!bar) return;
    UI.clear(bar);

    // Add Custom Prompts ONLY (Summary removed from here)
    DS_CONFIG.settings.customPrompts.forEach(item => {
        if (!item.name || !item.template) return;
        const btn = UI.el('div', {
            className: 'fn-btn custom-prompt-btn',
            title: item.template,
            onclick: () => {
                const input = document.getElementById('ds-input');
                if (input) {
                    const val = input.value.trim();
                    if (!val) {
                        // Optional: Flash input placeholder or similar if needed
                         input.placeholder = "请输入内容后点击...";
                         setTimeout(() => input.placeholder = "DeepSeek AI 等待您的指令...", 2000);
                         return;
                    }
                    askAI(val, "", "custom", null, item.template);
                }
            }
        }, item.name);
        bar.appendChild(btn);
    });
}

function stopAllStreams() {
    if (DS_CONFIG.runtime.abortCtrl) { DS_CONFIG.runtime.abortCtrl.abort(); DS_CONFIG.runtime.abortCtrl = null; }
    if (DS_CONFIG.runtime.rightPanelAbortCtrl) { DS_CONFIG.runtime.rightPanelAbortCtrl.abort(); DS_CONFIG.runtime.rightPanelAbortCtrl = null; }
    if (DS_CONFIG.runtime.inlineAbortCtrl) { DS_CONFIG.runtime.inlineAbortCtrl.abort(); DS_CONFIG.runtime.inlineAbortCtrl = null; }
    if (DS_CONFIG.runtime.popupAbortCtrl) {
        DS_CONFIG.runtime.popupAbortCtrl.abort();
        DS_CONFIG.runtime.popupAbortCtrl = null;
    }
}

// ==================== 5. 事件绑定 ====================
function bindEvents() {
    document.addEventListener('click', (e) => {
         if (e.target && e.target.classList.contains('ds-def-split')) {
             if (e.target.closest('#ds-highlight-content')) return;
             const defText = e.target.dataset.def;
             const word = DS_CONFIG.runtime.lastPopupParams.left?.hw || "";
             if(word) window.updateRightPanelExamples(defText, word);
         }
         // Close site panel if clicking outside
         const sitePanel = document.getElementById('ds-site-panel');
         const curSiteBtn = document.getElementById('ds-cur-site-btn');
         if (sitePanel && sitePanel.classList.contains('active')) {
             if (!sitePanel.contains(e.target) && !curSiteBtn.contains(e.target)) {
                 sitePanel.classList.remove('active');
             }
         }
    });

    document.addEventListener('click', (e) => {
         const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
         if (targetHighlight && !e.altKey) {
             e.preventDefault();
             e.stopPropagation();
         }
    }, true);

    const handleContinueClick = (e) => {
        if (e.target.classList.contains('ds-continue-text')) {
            const side = e.target.dataset.side;
            e.target.remove();
            if (!DS_CONFIG.runtime.popupAbortCtrl) {
                DS_CONFIG.runtime.popupAbortCtrl = new AbortController();
            }
            const signal = DS_CONFIG.runtime.popupAbortCtrl.signal;
            const params = DS_CONFIG.runtime.lastPopupParams[side];

            if (params) {
                streamToElement(params.sys, params.user, params.el, params.cat, params.key, params.hw, params.mode, signal);
            }
        }
    };
    if(DOM.popup) DOM.popup.addEventListener('click', handleContinueClick);
    const dockedPanel = document.getElementById('ds-docked-panel');
    if(dockedPanel) dockedPanel.addEventListener('click', handleContinueClick);

    // FIX START: 拦截右键菜单 & 全局右键清除翻译
    document.addEventListener('contextmenu', (e) => {
        // 1. 如果点击的是侧边栏或浮窗内部，不进行拦截（允许复制等默认行为）
        const inSidebar = DOM.sidebar && DOM.sidebar.contains(e.target);
        const inPopup = DOM.popup && DOM.popup.contains(e.target);
        if (inSidebar || inPopup) return;

        // 2. 优先检查：是否点击了【高亮词】（删除高亮优先）
        const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
        if (targetHighlight) {
            e.preventDefault();
            e.stopPropagation();
            removeHighlight(targetHighlight); // 执行删除高亮
            // 设置标志位，防止冲突
            DS_CONFIG.runtime.preventContextMenuOnce = true;
            setTimeout(() => { DS_CONFIG.runtime.preventContextMenuOnce = false; }, 300);
            stopAllStreams();
            return;
        }

        // 3. 次级检查：是否有可见的翻译元素 (插入式或全文)
        const hasInlineTrans = document.querySelector('.web-inline-trans');
        const hasPageTrans = document.querySelector('.ds-full-page-trans');
        const hasSourceHighlight = document.querySelector('.web-trans-source-highlight');

        // 如果存在翻译内容，右键动作执行“清除翻译”，并拦截菜单
        if (hasInlineTrans || hasPageTrans || hasSourceHighlight) {
            e.preventDefault();
            e.stopPropagation();
            clearAllInlineTranslations();
            return;
        }
    });
    // FIX END

    document.addEventListener('mousemove', e => {
        DS_CONFIG.runtime.lastX = e.clientX; DS_CONFIG.runtime.lastY = e.clientY;
        const isTopWindow = (window.self === window.top);
        if (isTopWindow) {
            if (DS_CONFIG.runtime.isResizingPopup && DOM.popup) {
                e.preventDefault();
                const dx = e.clientX - DS_CONFIG.runtime.dragStartX; const dy = e.clientY - DS_CONFIG.runtime.dragStartY; const startRect = DS_CONFIG.runtime.resizeStartRect;
                if (DS_CONFIG.runtime.resizeDirection.includes('e')) { DOM.popup.style.width = (startRect.width + dx) + 'px'; }
                if (DS_CONFIG.runtime.resizeDirection.includes('w')) { DOM.popup.style.width = (startRect.width - dx) + 'px'; DOM.popup.style.left = (startRect.left + dx) + 'px'; }
                if (DS_CONFIG.runtime.resizeDirection.includes('s')) { DOM.popup.style.height = (startRect.height + dy) + 'px'; }
                if (DS_CONFIG.runtime.resizeDirection.includes('n')) { DOM.popup.style.height = (startRect.height - dy) + 'px'; DOM.popup.style.top = (startRect.top + dy) + 'px'; }
                return;
            }
            const isResizing = document.getElementById('ds-resizer')?.dataset.resizing === 'true';
            if (isResizing) {
                e.preventDefault();
                if (DOM.sidebar) {
                    let width;
                    if (DS_CONFIG.settings.sidebarSide === 'right') { width = window.innerWidth - e.clientX; }
                    else { width = e.clientX; }
                    if (width > 300 && width < window.innerWidth * 0.9) {
                        DOM.sidebar.style.width = width + 'px';
                        GM_setValue('sidebar_width', width);
                        DS_CONFIG.settings.sidebarWidth = width;
                        updatePageLayout();
                    }
                }
            }
            if (DS_CONFIG.runtime.isDraggingPopup && DOM.popup) {
                const dx = e.clientX - DS_CONFIG.runtime.dragStartX; const dy = e.clientY - DS_CONFIG.runtime.dragStartY;
                DOM.popup.style.left = (DS_CONFIG.runtime.popupStartX + dx) + 'px'; DOM.popup.style.top = (DS_CONFIG.runtime.popupStartY + dy) + 'px';
            }
        }
    }, {passive: false});

    document.addEventListener('mouseup', (e) => {
        const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'false';
        document.body.classList.remove('ds-global-cursor-ew', 'ds-global-cursor-ns', 'ds-global-cursor-nwse', 'ds-global-cursor-nesw', 'ds-global-cursor-move');
        document.documentElement.classList.remove('ds-global-cursor-ew', 'ds-global-cursor-ns', 'ds-global-cursor-nwse', 'ds-global-cursor-nesw', 'ds-global-cursor-move');

        DS_CONFIG.runtime.isDraggingPopup = false; DS_CONFIG.runtime.isResizingPopup = false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DS_CONFIG.runtime.isReaderMode) {
            exitReaderMode();
        }

        if (e.key !== 'Alt') { DS_CONFIG.runtime.lastAltUpTime = 0; }

        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

        // Alt + 3: Toggle Reader Mode
        if (e.altKey && (e.key === '3' || e.code === 'Digit3')) {
            e.preventDefault();
            DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;
            toggleReaderMode();
            return;
        }

        if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
            e.preventDefault();
            DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;

            const el = document.elementFromPoint(DS_CONFIG.runtime.lastX, DS_CONFIG.runtime.lastY);
            const existingHighlight = el ? el.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`) : null;
            const sidebarItem = el ? el.closest('.web-menu-item') : null;

            if (sidebarItem) {
                 const word = sidebarItem.dataset.word;
                 if(word) deleteWord(word, sidebarItem);
                 return;
            }

            if (existingHighlight) {
                removeHighlight(existingHighlight);
            } else {
                const sel = window.getSelection(); let range = null;
                if (sel.rangeCount && sel.toString().trim()) { range = sel.getRangeAt(0); }
                else { const wordObj = getCurrentSentence(); if (wordObj) { range = document.createRange(); range.setStart(wordObj.node, wordObj.s); range.setEnd(wordObj.node, wordObj.e); } }

                if (range) {
                    const text = range.toString().trim();
                    if (!range.commonAncestorContainer.parentElement.classList.contains(DS_CONFIG.consts.HIGHLIGHT_CLASS)) {
                        if (DS_CONFIG.settings.autoCopy) {
                            copyToClip(text);
                        }
                        const mark = document.createElement('mark'); mark.className = DS_CONFIG.consts.HIGHLIGHT_CLASS; mark.appendChild(range.extractContents()); range.insertNode(mark);
                        saveHighlights();
                        addToGlobalHistory(text, range.commonAncestorContainer.textContent);
                        sel.removeAllRanges();

                        // ADDED: Sync to AI Input for Alt + 1
                        // 修改：移除可见性判断，确保高亮时无论侧边栏是否打开，输入框都会同步
                        if (window.self === window.top) {
                             const input = document.getElementById('ds-input');
                             if(input) input.value = text;
                        }
                    }
                }
            }
        }
        if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
            e.preventDefault();
            DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;
            if (isSidebarVisible()) hideSidebar(); else showSidebar();
        }
    }, true);

    const isTopWindow = (window.self === window.top);
    if (isTopWindow) {
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Alt') {
                if (DOM.popup.style.display !== 'none' && !DS_CONFIG.settings.isDocked) {
                    DOM.popup.style.display = 'none';
                    DS_CONFIG.runtime.currentPopupTrigger = null;
                    return;
                }

                const now = Date.now();
                if (now < DS_CONFIG.runtime.sidebarLockUntil) { DS_CONFIG.runtime.lastAltUpTime = 0; return; }

                if (now - DS_CONFIG.runtime.lastAltUpTime < 500) {
                    const selText = window.getSelection().toString().trim();
                    if (selText.length > 0) {
                        if (DS_CONFIG.settings.autoCopy) {
                            copyToClip(selText);
                        }
                        let context = ""; try { context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e){}

                        // 修改：移除可见性判断，浮窗选词时同步输入框
                        if (isTopWindow) {
                            const input = document.getElementById('ds-input');
                            if(input) input.value = selText;
                        }

                        showSmartPopup(selText, null, context, true);
                    }
                    else {
                        const wordObj = getCurrentSentence();
                        if (wordObj && wordObj.text) {
                            if (DS_CONFIG.settings.autoCopy) {
                                copyToClip(wordObj.text);
                            }
                            const context = wordObj.node.parentElement ? wordObj.node.parentElement.innerText : wordObj.text;

                            // 修改：移除可见性判断，浮窗取词时同步输入框
                            if (isTopWindow) {
                                const input = document.getElementById('ds-input');
                                if(input) input.value = wordObj.text;
                            }

                            showSmartPopup(wordObj.text, null, context, false);
                        }
                    }
                    DS_CONFIG.runtime.lastAltUpTime = 0;
                }
                else {
                    DS_CONFIG.runtime.lastAltUpTime = now;
                }
            }
        }, true);

        const inputEl = document.getElementById('ds-input');
        inputEl?.addEventListener('focus', function(e) {
             setTimeout(() => {
               this.selectionStart = this.selectionEnd = this.value.length;
               this.scrollTop = this.scrollHeight;
             }, 0);
        });
    }

    document.addEventListener('click', e => { if (e.altKey) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

    if (isTopWindow) {
        if (DOM.sidebar) {
            DOM.sidebar.addEventListener('contextmenu', (e) => {
                 const item = e.target.closest('.web-menu-item');
                 if (item) {
                     e.preventDefault();
                     const word = item.dataset.word;
                     if (DS_CONFIG.runtime.activeTab === 'history') {
                         deleteFromHistory(word, item);
                     } else {
                         if(word) deleteWord(word, item);
                     }
                 }
            });
        }

        DOM.sidebar.addEventListener('click', (e) => {
            const menuJump = e.target.closest('.web-menu-jump');
            if (menuJump) {
                const item = menuJump.closest('.web-menu-item');
                const word = item.dataset.word;

                const highlights = document.querySelectorAll(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
                for (let el of highlights) {
                    if (el.textContent.trim() === word) {
                        el.scrollIntoView({ behavior: 'auto', block: 'center' });
                        el.style.transition = 'backgroundColor 0.2s';
                        el.style.backgroundColor = '#FFD700';
                        setTimeout(() => { el.style.backgroundColor = ''; }, 600);
                        break;
                    }
                }
                return;
            }

            if (e.target.classList.contains('ds-def-split')) {
                return;
            }

            const item = e.target.closest('.web-menu-item');
            if (item) {
                if (window.getSelection().toString().length > 0) return;

                const word = item.dataset.word;
                const trans = item.querySelector('.web-menu-trans');
                const isActive = item.classList.contains('active');

                // Clear other active items
                const contentId = DS_CONFIG.runtime.activeTab === 'history' ? 'ds-history-content' : 'ds-highlight-content';
                document.querySelectorAll(`#${contentId} .web-menu-item.active`).forEach(activeItem => {
                    activeItem.classList.remove('active');
                    const t = activeItem.querySelector('.web-menu-trans');
                    if (t) t.style.display = 'none';
                });

                if (!isActive) {
                    const inputEl = document.getElementById('ds-input');
                    if(inputEl) inputEl.value = word;

                    item.classList.add('active');
                    if (trans) {
                        trans.style.display = 'block';
                        if (!trans.hasChildNodes()) {
                            fetchVocabDefinition(word, trans);
                        }
                    }
                }
                return;
            }

            const dockRestore = e.target.closest('.ds-dock-restore');
            if (dockRestore) {
                e.stopPropagation();
                hideSidebar();
                return;
            }

            const tab = e.target.closest('.ds-tab');
            if (tab) { switchTab(tab.dataset.tab); return; }

            const targetId = e.target.id || e.target.closest('.ds-v-icon')?.id || e.target.closest('.header-action')?.id || e.target.closest('button')?.id;
            if (!targetId) return;

            if (targetId === 'ds-help-btn') {
                const hp = document.getElementById('ds-help-panel');
                const cp = document.getElementById('ds-config-panel');
                if (cp) cp.style.display = 'none';
                if (hp) hp.style.display = hp.style.display === 'flex' ? 'none' : 'flex';
            }
            else if (targetId === 'ds-help-close') { document.getElementById('ds-help-panel').style.display = 'none'; }
            else if (targetId === 'ds-full-page-trans-btn') { togglePageTranslation(); }
            else if (targetId === 'ds-clear-cache') { document.getElementById('ds-confirm-modal').style.display = 'flex'; }
            else if (targetId === 'ds-cfg-toggle') {
                const cp = document.getElementById('ds-config-panel');
                const hp = document.getElementById('ds-help-panel');
                const tb = document.getElementById('ds-vertical-toolbar');

                if (hp) hp.style.display = 'none';

                const isOpening = cp.style.display !== 'flex';
                cp.style.display = isOpening ? 'flex' : 'none';

                // 切换编辑模式样式
                if (isOpening) {
                    tb.classList.add('ds-edit-mode');
                } else {
                    tb.classList.remove('ds-edit-mode');
                }
            }
            else if (targetId === 'ds-close') { hideSidebar(); }
            else if (targetId === 'ds-side-toggle') { toggleSidebarSide(); }
            else if (targetId === 'ds-expand-toolbar') { toggleToolbarExpansion(); } // New Handler
            else if (targetId === 'ds-reader-mode-btn') { toggleReaderMode(); }
            else if (targetId === 'ds-cur-site-btn') { // New Site Panel Toggle
                const panel = document.getElementById('ds-site-panel');
                if (panel) panel.classList.toggle('active');
            }
            else if (targetId === 'save-api-key') {
                const cfgApiKey = document.getElementById('cfg-api-key');
                const cfgPrompts = document.getElementById('cfg-prompts');
                const cfgSites = document.getElementById('cfg-ai-sites');
                const cfgDisabled = document.getElementById('cfg-disabled-sites');

                if (!cfgApiKey) return;
                DS_CONFIG.settings.apiKey = cfgApiKey.value;

                // Save Custom Prompts
                const rawLines = cfgPrompts.value.split('\n');
                DS_CONFIG.settings.customPrompts = [];
                rawLines.forEach(line => {
                    if (line.includes('=')) { const parts = line.split('='); if (parts.length >= 2) { const name = parts[0].trim(); const template = line.substring(line.indexOf('=') + 1).trim(); if(name && template) DS_CONFIG.settings.customPrompts.push({name, template}); } }
                });

                // Save Custom Sites
                if (cfgSites) {
                    const rawSites = cfgSites.value.split('\n');
                    DS_CONFIG.settings.customSites = parseConfigLines(rawSites);
                    GM_setValue('ds_custom_sites', DS_CONFIG.settings.customSites);

                    // Refresh Site Panel (Explicit Rebuild)
                    const panel = document.getElementById('ds-site-panel');
                    if (panel) {
                         UI.clear(panel);
                         DS_CONFIG.settings.customSites.forEach(s => {
                            const btn = UI.el('div', {
                                className: `ds-site-item ${s.value === DS_CONFIG.settings.lastAiSite ? 'active' : ''}`,
                                title: s.value
                            }, s.name);
                            btn.addEventListener('click', () => {
                                DS_CONFIG.settings.lastAiSite = s.value;
                                GM_setValue('ds_last_ai_site', s.value);
                                panel.querySelectorAll('.ds-site-item').forEach(el => el.classList.remove('active'));
                                btn.classList.add('active');
                                const curBtn = document.getElementById('ds-cur-site-btn');
                                if (curBtn) curBtn.firstChild.textContent = s.name;
                                panel.classList.remove('active');
                            });
                            panel.appendChild(btn);
                        });
                    }
                }

                if (cfgDisabled) {
                    const sites = cfgDisabled.value.split('\n').map(s => s.trim()).filter(s => s !== '');
                    DS_CONFIG.settings.disabledSites = sites;
                    GM_setValue('ds_disabled_sites', sites);
                }

                GM_setValue('ds_api_key', DS_CONFIG.settings.apiKey); GM_setValue('ds_custom_prompts', DS_CONFIG.settings.customPrompts);
                renderCustomButtons();
                document.getElementById('ds-config-panel').style.display = 'none';
                document.getElementById('ds-vertical-toolbar').classList.remove('ds-edit-mode'); // 退出编辑模式
            }
            else if (targetId === 'ds-send') {
                const el = document.getElementById('ds-input'); if (!el) return; const val = el.value.trim();
                if (val) { if (DS_CONFIG.runtime.activeTab !== 'ai') switchTab('ai'); askAI(val,"","chat"); el.value = ""; }
            }
            else if (targetId === 'ds-jump-btn') {
                // New Jump Logic: No Auto-Fill Transfer
                const el = document.getElementById('ds-input');
                const text = el ? el.value.trim() : "";

                // Copy to clipboard if enabled (使用统一的 autoCopy 设置)
                if (DS_CONFIG.settings.autoCopy && text) {
                    copyToClip(text);
                }

                // Simply open the tab
                window.open(DS_CONFIG.settings.lastAiSite, '_blank');
            }
            else if (targetId === 'ds-summary-btn') { // New Handler Location (legacy check, though we have explicit onclick now)
                  const content = getArticleContent();
                  askAI(`请对以下文章内容进行结构化总结：\n\n${content}`, "", "summary");
            }
            else if (targetId === 'ds-confirm-yes') {
                // Clear Local Storage (Current Page Highlights)
                Object.keys(localStorage).forEach(k => {
                    if(k.startsWith(DS_CONFIG.consts.STORAGE_PREFIX) || k === DS_CONFIG.consts.VOCAB_CACHE_KEY) localStorage.removeItem(k);
                });
                // Clear Global Storage (Cross-Page History & Cache)
                GM_setValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, '[]');
                GM_setValue(DS_CONFIG.consts.GLOBAL_DICT_CACHE_KEY, '{}');
                location.reload();
            }
            else if (targetId === 'ds-confirm-no') { document.getElementById('ds-confirm-modal').style.display = 'none'; }
        });

        document.getElementById('ds-chat-log')?.addEventListener('contextmenu', (e) => { e.preventDefault(); if (DS_CONFIG.runtime.abortCtrl) { DS_CONFIG.runtime.abortCtrl.abort(); } });
        document.getElementById('ds-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { if (!e.shiftKey) { e.preventDefault(); document.getElementById('ds-send').click(); } } });
        document.getElementById('ds-resizer')?.addEventListener('mousedown', (e) => {
            e.preventDefault(); e.stopPropagation();
            const resizer = document.getElementById('ds-resizer');
            if (resizer) resizer.dataset.resizing = 'true';
        });
        document.addEventListener('selectionchange', () => { if (!DS_CONFIG.settings.autoImport) return; const sel = window.getSelection().toString().trim(); const el = document.getElementById('ds-input'); if (sel && sel.length < 500 && el) {
            if (el.value !== sel) {
                  el.value = sel;
                  el.selectionStart = el.selectionEnd = el.value.length;
                  el.scrollTop = el.scrollHeight;
            }
            DS_CONFIG.runtime.lastSelection.word = sel; try { DS_CONFIG.runtime.lastSelection.context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e) {DS_CONFIG.runtime.lastSelection.context = "";} } });
    }

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
        if (targetHighlight) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const inSidebar = DOM.sidebar && DOM.sidebar.contains(e.target); const inPopup = DOM.popup && DOM.popup.style.display !== 'none' && DOM.popup.contains(e.target);
        if (!inSidebar && !inPopup) { if (DOM.popup && DOM.popup.style.display !== 'none' && isTopWindow) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; clearAllInlineTranslations(); } }
        if (e.altKey) { DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600; }
    });

    document.addEventListener('mousedown', e => {
        const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
        if (e.altKey && e.button === 0 && !targetHighlight) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); clearAllInlineTranslations();
            let sel = window.getSelection().toString().trim(); let container = e.target;
            const renderTrans = (nodeToInsertAfter) => {
                const transSpan = UI.el('div', { className: 'web-inline-trans' }, 'DeepSeek 思考中...');
                nodeToInsertAfter.after(transSpan);
                return transSpan;
            };
            if (sel.length > 0) {
                  const selection = window.getSelection(); if (!selection.rangeCount) return;
                  const range = selection.getRangeAt(0); const sourceSpan = document.createElement('span'); sourceSpan.className = 'web-trans-source-highlight'; sourceSpan.appendChild(range.extractContents()); range.insertNode(sourceSpan); selection.removeAllRanges(); const transSpan = renderTrans(sourceSpan);
                  if (DS_CONFIG.runtime.inlineAbortCtrl) DS_CONFIG.runtime.inlineAbortCtrl.abort();
                  DS_CONFIG.runtime.inlineAbortCtrl = new AbortController();
                  streamDeepSeekInline(sel, transSpan, DS_CONFIG.runtime.inlineAbortCtrl.signal);
            }
            else {
                while (container && container !== document.body && window.getComputedStyle(container).display === 'inline') container = container.parentElement; const text = container.textContent.trim();
                if (text.length > 2) {
                    const tempSpan = UI.el('div', { className: 'web-inline-trans' }, 'DeepSeek 思考中...');
                    container.appendChild(tempSpan);
                    if (DS_CONFIG.runtime.inlineAbortCtrl) DS_CONFIG.runtime.inlineAbortCtrl.abort();
                    DS_CONFIG.runtime.inlineAbortCtrl = new AbortController();
                    streamDeepSeekInline(text, tempSpan, DS_CONFIG.runtime.inlineAbortCtrl.signal);
                }
            }
            return;
        }
        if (targetHighlight && e.button === 0 && !e.altKey) {
            e.preventDefault(); e.stopPropagation();
            const text = targetHighlight.textContent.trim(); const parentBlock = targetHighlight.closest('p, div, li, h1, h2, h3') || targetHighlight.parentElement; const context = parentBlock ? parentBlock.innerText : text;
            if (DS_CONFIG.settings.autoCopy) {
                copyToClip(text);
            }
            if (isSidebarVisible() && isTopWindow) { const input = document.getElementById('ds-input'); if(input) { input.value = text; } }
            const isWord = (text.split(/\s+/).length <= 3 && text.length < 30);
            if (isWord) {
                if (isTopWindow) {
                    if (DS_CONFIG.settings.isDocked) {
                        showSmartPopup(text, targetHighlight, context);
                        return;
                    }
                    if (DOM.popup.style.display === 'flex' && DS_CONFIG.runtime.currentPopupTrigger === targetHighlight) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; return; }
                    showSmartPopup(text, targetHighlight, context);
                }
            }
            else {
                  clearAllInlineTranslations();
                  const transSpan = UI.el('div', { className: 'web-inline-trans' }, 'DeepSeek 思考中...');
                  if (targetHighlight.nextSibling) targetHighlight.parentNode.insertBefore(transSpan, targetHighlight.nextSibling); else targetHighlight.parentNode.appendChild(transSpan);
                  if (DS_CONFIG.runtime.inlineAbortCtrl) DS_CONFIG.runtime.inlineAbortCtrl.abort();
                  DS_CONFIG.runtime.inlineAbortCtrl = new AbortController();
                  streamDeepSeekInline(text, transSpan, DS_CONFIG.runtime.inlineAbortCtrl.signal);
            }
        }
    }, true);
}

function addToGlobalHistory(word, context) {
    if (!word) return;
    // 使用 GM_getValue 读取全局历史
    let history = [];
    try {
        history = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, '[]'));
    } catch(e) { history = []; }

    const existingIndex = history.findIndex(i => i.word === word);
    if (existingIndex > -1) {
        history.splice(existingIndex, 1);
    }
    history.push({ word, context: "", date: Date.now() });
    // 使用 GM_setValue 保存全局历史
    GM_setValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, JSON.stringify(history));
    if (DS_CONFIG.runtime.activeTab === 'history') renderHistoryMenu();
}

function deleteFromHistory(word, elementRef = null) {
    const doDelete = () => {
        let history = [];
        try {
            history = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, '[]'));
        } catch(e) { history = []; }

        const newHistory = history.filter(i => i.word !== word);
        GM_setValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, JSON.stringify(newHistory));
        renderHistoryMenu();
    };

    if (elementRef) {
        softDelete(elementRef, doDelete);
    } else {
        doDelete();
    }
}

// Added export functionality
function exportHistoryToTxt() {
    let history = [];
    try {
        history = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, '[]'));
    } catch(e) { history = []; }

    if (history.length === 0) {
        alert('没有历史记录可导出');
        return;
    }

    // 根据当前的排序设置对数据进行排序
    history.sort((a, b) => {
        if (DS_CONFIG.settings.historySort === 'time_desc') return b.date - a.date;
        if (DS_CONFIG.settings.historySort === 'time_asc') return a.date - b.date;
        if (DS_CONFIG.settings.historySort === 'alpha_asc') return a.word.localeCompare(b.word);
        if (DS_CONFIG.settings.historySort === 'alpha_desc') return b.word.localeCompare(a.word);
        return 0;
    });

    const content = history.map(h => h.word).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepSeek_Words_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function renderHistoryMenu() {
    const container = document.getElementById('ds-history-content');
    if (!container) return;

    // 记录当前的滚动位置 (如果存在)
    const currentScroll = document.getElementById('ds-history-log')?.scrollTop || 0;

    UI.clear(container);

    // Modified control bar with split layout
    const controls = UI.el('div', { style: { padding: '10px', borderBottom: '1px solid var(--ds-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ds-menu-bg)' } }, [
        // Left side: Sort icons
        UI.el('div', { style: { display: 'flex', gap: '10px' } }, [
            UI.el('span', {
                className: 'ds-sort-btn ' + (DS_CONFIG.settings.historySort.includes('time') ? 'active' : ''),
                style: { cursor: 'pointer', opacity: DS_CONFIG.settings.historySort.includes('time') ? 1 : 0.5 },
                onclick: () => {
                    DS_CONFIG.settings.historySort = DS_CONFIG.settings.historySort === 'time_desc' ? 'time_asc' : 'time_desc';
                    GM_setValue('ds_history_sort', DS_CONFIG.settings.historySort);
                    DS_CONFIG.runtime.historyLimit = 50; // 切换排序时重置显示数量
                    renderHistoryMenu();
                }
            }, DS_CONFIG.settings.historySort === 'time_asc' ? '📅 ⬆️' : '📅 ⬇️'),
            UI.el('span', {
                className: 'ds-sort-btn ' + (DS_CONFIG.settings.historySort.includes('alpha') ? 'active' : ''),
                style: { cursor: 'pointer', opacity: DS_CONFIG.settings.historySort.includes('alpha') ? 1 : 0.5 },
                onclick: () => {
                    DS_CONFIG.settings.historySort = DS_CONFIG.settings.historySort === 'alpha_asc' ? 'alpha_desc' : 'alpha_asc';
                    GM_setValue('ds_history_sort', DS_CONFIG.settings.historySort);
                    DS_CONFIG.runtime.historyLimit = 50; // 切换排序时重置显示数量
                    renderHistoryMenu();
                }
            }, DS_CONFIG.settings.historySort === 'alpha_desc' ? '🔤 ⬇️' : '🔤 ⬆️')
        ]),
        // Right side: Export and Delete
        UI.el('div', { style: { display: 'flex', gap: '10px' } }, [
             UI.el('span', {
                className: 'ds-sort-btn',
                style: { cursor: 'pointer', opacity: 0.7 },
                title: '导出为TXT',
                onclick: exportHistoryToTxt
            }, '📤'),
            UI.el('span', {
                className: 'ds-sort-btn',
                style: { cursor: 'pointer', opacity: 0.7 },
                title: '清空所有缓存',
                onclick: () => { document.getElementById('ds-confirm-modal').style.display = 'flex'; }
            }, '🗑️')
        ])
    ]);
    container.appendChild(controls);

    const listContainer = UI.el('div', { id: 'ds-history-log' });

    // 从 GM_getValue 读取全局数据
    let history = [];
    try {
        history = JSON.parse(GM_getValue(DS_CONFIG.consts.GLOBAL_STORAGE_KEY, '[]'));
    } catch(e) { history = []; }

    // 获取当前页面所有高亮的词，用于判断是否显示跳转按钮
    const localHighlights = new Set(JSON.parse(localStorage.getItem(DS_CONFIG.consts.STORAGE_KEY) || '[]').map(h => h.text));

    history.sort((a, b) => {
        if (DS_CONFIG.settings.historySort === 'time_desc') return b.date - a.date;
        if (DS_CONFIG.settings.historySort === 'time_asc') return a.date - b.date;
        if (DS_CONFIG.settings.historySort === 'alpha_asc') return a.word.localeCompare(b.word);
        if (DS_CONFIG.settings.historySort === 'alpha_desc') return b.word.localeCompare(a.word);
        return 0;
    });

    // === 分页逻辑开始 ===
    if (!DS_CONFIG.runtime.historyLimit) DS_CONFIG.runtime.historyLimit = 50;
    const totalCount = history.length;
    const visibleHistory = history.slice(0, DS_CONFIG.runtime.historyLimit);
    // === 分页逻辑结束 ===

    if (visibleHistory.length === 0) {
        listContainer.appendChild(UI.el('div', { style: { textAlign: 'center', color: '#666', marginTop: '20px', fontSize: '13px' } }, "暂无历史记录"));
    } else {
        visibleHistory.forEach(item => {
             // 检查该词是否在当前页面高亮中
             const isLocal = localHighlights.has(item.word);
             const children = [
                UI.el('span', { className: 'web-menu-word' }, item.word)
             ];

             // 如果是当前页面的词，添加跳转图标
             if (isLocal) {
                 children.push(UI.el('span', {
                     className: 'web-menu-jump',
                     title: '跳转到文中位置',
                     style: { marginLeft: 'auto', marginRight: '4px' } // 靠右对齐
                 }, '📍'));
             }

             const div = UI.el('div', { className: 'web-menu-item', 'data-word': item.word }, [
                UI.el('div', { className: 'web-menu-header' }, children),
                UI.el('div', { className: 'web-menu-trans', style: { display: 'none' } })
             ]);
             listContainer.appendChild(div);
        });

        // === 载入更多按钮 ===
        if (totalCount > DS_CONFIG.runtime.historyLimit) {
            const remaining = totalCount - DS_CONFIG.runtime.historyLimit;
            const loadMoreBtn = UI.el('div', {
                style: {
                    textAlign: 'center', padding: '12px', cursor: 'pointer',
                    color: '#3a7bd5', fontSize: '13px', fontWeight: 'bold',
                    borderTop: '1px solid var(--ds-border)', marginTop: '5px',
                    transition: 'background 0.2s', borderRadius: '4px'
                },
                className: 'ds-load-more-btn',
                onclick: function() {
                    this.textContent = "载入中...";
                    DS_CONFIG.runtime.historyLimit += 50; // 增加50个
                    renderHistoryMenu();
                }
            }, `⬇️ 载入更多 (剩余 ${remaining} 个)`);

            // 鼠标悬停效果
            loadMoreBtn.onmouseover = () => loadMoreBtn.style.background = 'var(--ds-hover-bg)';
            loadMoreBtn.onmouseout = () => loadMoreBtn.style.background = 'transparent';

            listContainer.appendChild(loadMoreBtn);
        }
    }

    container.appendChild(listContainer);

    // 恢复滚动位置
    if (currentScroll > 0) {
        setTimeout(() => {
            if (listContainer) listContainer.scrollTop = currentScroll;
        }, 0);
    }
}

function initTimedTasks() { setInterval(() => { if (!DS_CONFIG.runtime.isRestoring && isSidebarVisible()) { applySavedHighlights(); } }, 2000); }
async function init() {
    const currentUrl = window.location.href;
    const currentHost = window.location.hostname;
    const isDisabled = DS_CONFIG.settings.disabledSites.some(site => {
        if (!site) return false;
        return currentUrl.toLowerCase().includes(site.toLowerCase()) || currentHost.toLowerCase().includes(site.toLowerCase());
    });

    if (isDisabled) {
        console.log('[AI语言学习专家] 当前网站在黑名单中，脚本已停止运行。');
        return;
    }

    buildUI();
    bindEvents();
    initTimedTasks();
    refreshHighlightMenu();
    // AutoFill logic removed as requested
}
init();
})();