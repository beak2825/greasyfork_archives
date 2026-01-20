// ==UserScript==
// @name         AI语言学习专家 (Deepseek驱动)
// @namespace    http://tampermonkey.net/
// @version      V3.12-Scrollbar-Fix
// @license      MIT
// @description  全DeepSeek驱动的英语学习专家。V3.12更新：1. 边缘触发范围扩大至20px；2. 右侧增加滚动条避让逻辑，从滚动条左侧开始计算触发区。
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
// @downloadURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6%20%28Deepseek%E9%A9%B1%E5%8A%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563162/AI%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E4%B8%93%E5%AE%B6%20%28Deepseek%E9%A9%B1%E5%8A%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 🔴 核心修复：Trusted Types 强力绕过补丁 (不变)
    // =================================================================
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            const policyName = 'ds-bypass-' + Math.floor(Math.random() * 10000);
            const policy = window.trustedTypes.createPolicy(policyName, { createHTML: (string) => string });
            const oldInnerHtmlDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
            const oldInnerHtml = oldInnerHtmlDescriptor.set;
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    try { oldInnerHtml.call(this, policy.createHTML(value)); }
                    catch(e) { oldInnerHtml.call(this, value); }
                }
            });
        } catch (e) { console.warn("⚠️ [DeepSeek AI] 补丁注入警告:", e); }
    }

    // ==================== 0. 配置与状态集中管理 ====================
    const isTopWindow = (window.self === window.top);

    const DEFAULT_PROMPTS = [
        "同义词=请作为语言专家，列出与查询词【同语种】的至少5个同义词，并进行简要辨析。",
        "反义词=请作为语言专家，列出与查询词【同语种】的至少5个反义词，并进行简要说明。",
        "同根词=请作为语言专家，列出与查询词【同语种】的至少5个同根词或派生词。",
        "词源词根=请详细分析该词的词源和词根（使用与查询词相同的语言或英语学术解释），字数控制在50字到200字之间。"
    ];

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

    const DS_CONFIG = {
        settings: {
            apiKey: GM_getValue('ds_api_key', ''),
            sidebarWidth: GM_getValue('sidebar_width', 450),
            sidebarSide: GM_getValue('ds_sidebar_side', 'right'),
            popupWidth: GM_getValue('ds_popup_width', '600px'),
            popupHeight: GM_getValue('ds_popup_height', '350px'),
            autoImport: true,
            hasShownTutorial: GM_getValue('ds_has_shown_tutorial_v3', false),
            customPrompts: parsePrompts(GM_getValue('ds_custom_prompts', DEFAULT_PROMPTS)),
        },
        state: {
            isPopupLocked: GM_getValue('ds_popup_locked', false),
            savedPopupPos: GM_getValue('ds_popup_pos', {x: 100, y: 100}),
        },
        runtime: {
            activeTab: 'highlight',
            isPageTranslated: false,
            translationCache: {},
            exampleCache: {},
            popupCache: { dict: {}, context: {} },
            abortCtrl: null,
            rightPanelAbortCtrl: null,
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
            isAltDown: false,
            isRestoring: false,
            edgeTimer: null
        },
        consts: {
            API_URL: 'https://api.deepseek.com/v1/chat/completions',
            MODEL_NAME: 'deepseek-chat',
            HIGHLIGHT_CLASS: 'custom-web-highlight-tag',
            STORAGE_PREFIX: 'v3_pos_highlights_',
            VOCAB_CACHE_KEY: 'v3_vocab_ds_cache',
            STORAGE_KEY: 'v3_pos_highlights_' + btoa(encodeURIComponent(window.location.host + window.location.pathname)).substring(0, 50)
        }
    };

    const DOM = { sidebar: null, popup: null, highlightContent: null };

    // ==================== 1. 样式定义 (CSS 压缩版) ====================
    function injectStyles() {
        const css = `:root{--ds-bg:#202328;--ds-text:#c0c4c9;--ds-msg-bg:#25282e;--ds-border:#3a3f47;--ds-user-bg:#c0c4c9;--ds-user-text:#1a1d21;--ds-header-bg:#2b3038;--ds-accent:#3a7bd5;--ds-highlight-bg:#8B0000;--ds-highlight-text:#ffffff;--ds-menu-bg:#202328;--ds-menu-active-bg:#353b45;--ds-tab-inactive-bg:#2a2f36;--ds-tab-active-bg:#4a5059;--ds-tab-inactive-text:#888;--ds-popup-bg:#202328;--ds-popup-border:#444;--ds-hover-bg:rgba(255,255,255,0.06);--ds-continue-color:#6db3f2;--ds-slider-off:#444;--ds-slider-on:#3a7bd5;--ds-modal-bg:rgba(32,35,40,0.98);--ds-scrollbar-thumb:#4a5059}.ds-scrollable::-webkit-scrollbar,#ds-chat-log::-webkit-scrollbar,#ds-highlight-log::-webkit-scrollbar,#ds-input::-webkit-scrollbar,#ds-popup-left-content::-webkit-scrollbar,#ds-popup-right-content::-webkit-scrollbar,#cfg-prompts::-webkit-scrollbar{width:6px;height:6px}.ds-scrollable::-webkit-scrollbar-thumb,#ds-chat-log::-webkit-scrollbar-thumb,#ds-highlight-log::-webkit-scrollbar-thumb,#ds-input::-webkit-scrollbar-thumb,#ds-popup-left-content::-webkit-scrollbar-thumb,#ds-popup-right-content::-webkit-scrollbar-thumb,#cfg-prompts::-webkit-scrollbar-thumb{background:var(--ds-scrollbar-thumb);border-radius:3px}.ds-scrollable::-webkit-scrollbar-track,#ds-chat-log::-webkit-scrollbar-track,#ds-highlight-log::-webkit-scrollbar-track,#ds-input::-webkit-scrollbar-track,#ds-popup-left-content::-webkit-scrollbar-track,#ds-popup-right-content::-webkit-scrollbar-track,#cfg-prompts::-webkit-scrollbar-track{background:0 0}#ds-sidebar{position:fixed;top:0;width:${DS_CONFIG.settings.sidebarWidth}px;height:100vh;background:var(--ds-bg)!important;z-index:2147483647;transition:right .3s cubic-bezier(.4,0,.2,1),left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;color:var(--ds-text)!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box!important;padding:0!important;box-shadow:0 0 20px rgba(0,0,0,.4)}#ds-resizer{position:absolute;width:8px;height:100%;z-index:2147483648;background:0 0;cursor:ew-resize;transition:background .2s}#ds-resizer:hover{background:rgba(58,123,213,.1)}#ds-header{padding:0 12px;background:var(--ds-header-bg)!important;display:flex;align-items:center;justify-content:space-between;position:relative;height:42px;flex-shrink:0;border-bottom:1px solid var(--ds-border);cursor:default}#ds-header-left,#ds-header-right{display:flex;gap:6px;align-items:center;z-index:2}#ds-tabs-wrapper{display:flex;gap:6px;align-items:center;height:100%;position:absolute;left:50%;transform:translateX(-50%);z-index:1}.ds-tab{padding:4px 14px;cursor:pointer;font-size:15px;border-radius:6px;transition:all .2s;color:var(--ds-tab-inactive-text);user-select:none;display:flex;align-items:center;justify-content:center;height:28px;background:var(--ds-tab-inactive-bg)!important;border:1px solid transparent!important}.ds-tab:hover{color:#eee;background:#353b45!important}.ds-tab.active{background:var(--ds-tab-active-bg)!important;color:#fff!important;font-weight:700;border:1px solid #666!important;box-shadow:0 1px 3px rgba(0,0,0,.3)}.header-action{cursor:pointer;font-size:15px;opacity:.6;transition:opacity .2s;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px}.header-action:hover{opacity:1;background:var(--ds-hover-bg)}#ds-tab-content{flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative}.tab-panel{display:none;flex-direction:column;height:100%;width:100%;overflow:hidden}.tab-panel.active{display:flex}#ds-ai-content{flex:1}#ds-chat-log{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:15px;margin:0;scroll-behavior:smooth}.ds-msg{padding:12px 16px;border-radius:8px;font-size:14.5px;line-height:1.6;max-width:94%;word-wrap:break-word}.user-msg{align-self:flex-end;background:var(--ds-user-bg)!important;color:var(--ds-user-text)!important;border-top-right-radius:2px}.ai-msg{align-self:flex-start;background:var(--ds-msg-bg)!important;color:var(--ds-text)!important;border:1px solid var(--ds-border);border-top-left-radius:2px;white-space:pre-wrap}.ds-continue-text{display:block;margin-top:10px;color:var(--ds-continue-color);font-weight:700;cursor:pointer;text-decoration:none;transition:opacity .2s}.ds-continue-text:hover{opacity:.8}.ds-instruction-text{color:var(--ds-text);font-weight:700;font-size:13px;margin-bottom:5px}.ds-instruction-highlight{color:#FFD700!important;font-weight:700}.highlight-word{color:#1E90FF!important;font-weight:700!important;text-decoration:none!important;background:rgba(30,144,255,.1);padding:0 2px;border-radius:2px}#ds-fn-bar{padding:8px 10px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid var(--ds-border);background:var(--ds-bg);flex-shrink:0;max-height:120px;overflow-y:auto}.fn-btn{flex:1;min-width:60px;padding:6px 8px;text-align:center;border-radius:4px;cursor:pointer;font-size:12px;color:var(--ds-text)!important;background:var(--ds-menu-active-bg);border:1px solid var(--ds-border);transition:all .2s;white-space:nowrap;display:flex;align-items:center;justify-content:center}.fn-btn:hover{background:var(--ds-hover-bg);border-color:#666}.fn-btn:active{transform:scale(.98)}.custom-prompt-btn{flex:0 1 auto!important}#ds-input-area{padding:10px 10px 15px;background:var(--ds-bg);flex-shrink:0;box-sizing:border-box!important;width:100%;border-top:1px solid var(--ds-border)}#ds-input-wrapper{display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box}#ds-input{width:100%;height:96px!important;border-radius:6px;border:1px solid var(--ds-border);padding:8px;outline:0;box-sizing:border-box;background:var(--ds-msg-bg)!important;color:var(--ds-text)!important;font-family:inherit;resize:none;font-size:14px;line-height:1.5;margin:0;overflow-y:auto}#ds-input:focus{border-color:var(--ds-accent)}#ds-send-row{display:flex;justify-content:space-between;align-items:center;margin-top:4px}.ds-action-btn{width:80px;padding:6px 0;border:0;border-radius:12px;background:var(--ds-accent)!important;color:#fff!important;cursor:pointer;font-size:13px;font-weight:700;transition:opacity .2s ease,transform .1s;text-align:center}.ds-action-btn:hover{opacity:.9}.ds-action-btn:active{transform:scale(.96)}#ds-config-panel,#ds-help-panel{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--ds-bg);z-index:1001;padding:20px;box-sizing:border-box;display:none;flex-direction:column;overflow-y:auto}.cfg-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;font-size:14px}#cfg-api-key{width:100%;margin-top:5px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-size:13px}#cfg-prompts{width:100%;height:120px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-family:monospace;font-size:12px;resize:vertical;margin-top:5px;white-space:pre;overflow-x:auto}.ds-help-title,.ds-config-title{font-size:18px;font-weight:700;margin-bottom:20px;color:var(--ds-accent);border-bottom:1px solid var(--ds-border);padding-bottom:10px}.ds-help-item{margin-bottom:15px;display:flex;flex-direction:column;gap:5px}.ds-help-key{font-weight:700;color:var(--ds-text);font-family:monospace;background:var(--ds-msg-bg);padding:2px 6px;border-radius:4px;display:inline-block;width:fit-content}.ds-help-desc{font-size:13px;color:var(--ds-text);opacity:.8;line-height:1.4}.ds-primary-btn{width:100%;padding:8px;background:var(--ds-accent);color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:14px;transition:opacity .2s;text-align:center}.ds-primary-btn:hover{opacity:.9}#ds-help-close{margin-top:20px}#ds-highlight-content{flex:1}#ds-highlight-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:0;margin:0}.${DS_CONFIG.consts.HIGHLIGHT_CLASS}{background-color:var(--ds-highlight-bg)!important;color:var(--ds-highlight-text)!important;padding:0 2px!important;border-radius:2px;cursor:pointer;display:inline}.web-inline-trans{color:#1E90FF!important;font-size:.95em!important;font-weight:400!important;margin-left:0!important;display:block!important;background:0 0!important;box-shadow:none!important;border:0!important;padding:4px 0 8px!important}.web-inline-trans::before{content:""}.ds-inline-loading{animation:pulse 1.5s infinite}.web-menu-item{display:flex!important;flex-direction:column!important;align-items:flex-start!important;padding:8px 12px!important;margin:0!important;background:var(--ds-menu-bg)!important;border-radius:0!important;cursor:default!important;transition:background-color .1s ease!important;border-bottom:1px solid rgba(255,255,255,.05)}.web-menu-item:hover{background:#353b45!important}.web-menu-header{display:flex;justify-content:flex-start;width:100%;align-items:baseline;gap:8px}.web-menu-word{font-weight:700!important;color:#1E90FF!important;font-size:15px!important;cursor:pointer!important}.web-menu-word:hover{text-decoration:none!important;color:var(--ds-accent)!important}.web-menu-ipa{font-family:"Lucida Sans Unicode","Arial Unicode MS",sans-serif;color:#777!important;font-size:13px!important}.web-menu-trans{display:block!important;margin-top:2px!important;color:#aaa!important;opacity:1;font-size:13px!important;line-height:1.4!important;white-space:pre-wrap!important;word-break:break-all!important;width:100%!important}#ds-confirm-modal{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);backdrop-filter:blur(2px);z-index:2000;display:none;align-items:center;justify-content:center;animation:fadeIn .2s ease}.ds-confirm-box{background:var(--ds-modal-bg);padding:25px 20px;border-radius:12px;width:75%;text-align:center;border:1px solid var(--ds-border);box-shadow:0 10px 30px rgba(0,0,0,.5);color:var(--ds-text)}.ds-confirm-text{font-size:15px;margin-bottom:20px;font-weight:500}.ds-confirm-btns{display:flex;gap:12px;justify-content:center}.ds-btn{padding:8px 20px;border-radius:6px;border:0;cursor:pointer;font-size:14px;font-weight:700;transition:transform .1s}.ds-btn:active{transform:scale(.95)}.ds-btn-yes{background:#ff3b30;color:#fff}.ds-btn-no{background:var(--ds-msg-bg);color:var(--ds-text);border:1px solid var(--ds-border)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}#ds-popup{position:fixed;background:var(--ds-popup-bg);color:var(--ds-text);border:1px solid var(--ds-popup-border);border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.6);z-index:2147483650;display:none;flex-direction:column;min-width:400px;min-height:250px;max-width:90vw;max-height:80vh}.ds-resize-handle{position:absolute;z-index:100;opacity:0}.ds-resize-handle:hover{background:rgba(30,144,255,.2);opacity:1}.ds-rh-n{top:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-s{bottom:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-w{left:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-e{right:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-nw{top:0;left:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}.ds-rh-ne{top:0;right:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-sw{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-se{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}#ds-popup-header-bar{height:36px;width:100%;cursor:move;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;gap:6px;background:var(--ds-header-bg);border-bottom:1px solid var(--ds-border)}.ds-popup-icon{cursor:pointer;font-size:15px;opacity:.6;transition:opacity .2s;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--ds-text)}.ds-popup-icon:hover{opacity:1;background:var(--ds-hover-bg)}#ds-popup-close-float{font-size:16px}#ds-popup-lock.locked{opacity:1;color:var(--ds-accent)}#ds-popup-body{display:flex;flex:1;overflow:hidden;position:relative;padding:0;width:100%;height:100%;cursor:default}.ds-split-view{width:100%;height:100%;display:flex}.ds-split-left{flex:1;border-right:1px solid var(--ds-border);padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}.ds-split-right{flex:1;padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}.ds-popup-title{font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ds-accent);opacity:.9;letter-spacing:.5px;display:flex;align-items:center;gap:6px}.ds-popup-text{font-size:14px;line-height:1.6;white-space:pre-wrap;color:#ccc}.ds-popup-loading{color:#888;font-style:italic;animation:pulse 1.5s infinite}@keyframes pulse{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}.ds-target-italic{color:#1E90FF!important;font-weight:700;font-style:italic}.ds-head-row{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;flex-wrap:wrap}.ds-headword{color:#1E90FF!important;font-weight:900;font-size:1.2em;display:inline-block}.ds-dict-grid{display:grid;grid-template-columns:45px 1fr;gap:4px 0;align-items:flex-start}.ds-pos-label{text-align:right;color:#777;font-style:italic;font-weight:700;font-size:.85em;user-select:none;white-space:nowrap;overflow:visible;padding-right:8px;margin-top:3px}.ds-def-split{cursor:pointer;border-bottom:1px dashed transparent;transition:all .1s}.ds-def-split:hover{color:var(--ds-accent)}`;
        GM_addStyle(css);
    }

    function updateSidebarPosition(animate = true) {
        const sb = document.getElementById('ds-sidebar');
        const resizer = document.getElementById('ds-resizer');
        const toggleBtn = document.getElementById('ds-side-toggle');

        if (!sb || !resizer) return;

        if (!animate) {
            sb.style.transition = 'none';
        } else {
            sb.style.transition = 'right 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1)';
        }

        // 清除可能的行内样式残留
        sb.style.left = '';
        sb.style.right = '';
        sb.style.borderLeft = '';
        sb.style.borderRight = '';
        resizer.style.left = '';
        resizer.style.right = '';

        const borderColor = '#3a3f47';

        if (DS_CONFIG.settings.sidebarSide === 'right') {
            // 右侧模式
            sb.style.right = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderLeft = `1px solid ${borderColor}`;
            resizer.style.left = '0';
            if (toggleBtn) {
                toggleBtn.innerText = '👈🏻';
                toggleBtn.title = "切换至左侧";
            }
        } else {
            // 左侧模式
            sb.style.left = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderRight = `1px solid ${borderColor}`;
            resizer.style.right = '0';
            if (toggleBtn) {
                toggleBtn.innerText = '👉🏻';
                toggleBtn.title = "切换至右侧";
            }
        }
    }

    // 修改：切换时保持打开状态
    function toggleSidebarSide() {
        const wasVisible = (DOM.sidebar.style.right === '0px' || DOM.sidebar.style.left === '0px');
        DS_CONFIG.settings.sidebarSide = DS_CONFIG.settings.sidebarSide === 'right' ? 'left' : 'right';
        GM_setValue('ds_sidebar_side', DS_CONFIG.settings.sidebarSide);
        updateSidebarPosition(true);
        // 如果之前是打开的，强制保持打开
        if (wasVisible) showSidebar();
    }

    // ==================== 2. 工具函数 ====================
    function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    const isChinese = (text) => /[\u4e00-\u9fa5]/.test(text);

    function getArticleContent() {
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
            document.querySelectorAll('.ds-full-page-trans').forEach(el => el.remove());
            DS_CONFIG.runtime.isPageTranslated = false;
        } else {
            translatePageContent();
        }
    }

    function translatePageContent() {
        let articleEl = document.querySelector('article, main, #content, .content, .article-content');
        const targetEl = articleEl || document.body;
        const validTags = ['p','h1','h2','h3','h4','li','blockquote'];
        const exclude = ['nav','header','footer','aside','.nav','.header','.footer','.ad','.banner','.sidebar','.comment','.menu', '#ds-sidebar', '#ds-popup'];
        let count = 0;
        validTags.forEach(tag => {
            targetEl.querySelectorAll(tag).forEach(el => {
                if (exclude.some(es => el.closest(es))) return;
                const text = el.innerText.trim();
                // 修改：不再限制最小字数（原为>10），只要有内容且非纯中文即可，同时移除报警
                if (text.length > 0 && !isChinese(text)) {
                    count++;
                    const transSpan = document.createElement('div');
                    transSpan.className = 'web-inline-trans ds-full-page-trans ds-inline-loading';
                    transSpan.style.color = '#1E90FF';
                    transSpan.style.fontSize = '0.95em';
                    transSpan.style.fontSize = '0.95em';
                    el.appendChild(transSpan);
                    streamDeepSeekInline(text, transSpan);
                }
            });
        });
        if(count > 0) DS_CONFIG.runtime.isPageTranslated = true;
        // 修改：移除了 else alert(...)，静默处理
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
        DS_CONFIG.runtime.isPageTranslated = false;
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

    // ==================== 3. 核心 API 逻辑 ====================
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

    function getDeepSeekVocabDef(word, callback) {
        if (!DS_CONFIG.settings.apiKey) return;
        const cache = JSON.parse(localStorage.getItem(DS_CONFIG.consts.VOCAB_CACHE_KEY) || '{}');
        if (cache[word] && cache[word] !== "..." && cache[word] !== "waiting") {
            if (callback) callback(cache[word]);
            return;
        }
        cache[word] = "waiting";
        localStorage.setItem(DS_CONFIG.consts.VOCAB_CACHE_KEY, JSON.stringify(cache));
        if (DS_CONFIG.runtime.activeTab === 'highlight') refreshHighlightMenu();

        let sysContent = "你是一个简明英汉词典。请给出单词的音标(IPA)和精准中文释义。格式：[音标] 释义。例如：[hə'ləʊ] 你好。尽量在一行或两行内完成。";
        if (isChinese(word)) {
            sysContent = "你是一个简明汉语词典。请给出词汇的拼音和精准释义。格式：[拼音] 释义。例如：[nǐ hǎo] 打招呼的敬语。尽量在一行或两行内完成。";
        }

        fetch(DS_CONFIG.consts.API_URL, {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${DS_CONFIG.settings.apiKey}`},
            body: JSON.stringify({ model: DS_CONFIG.consts.MODEL_NAME, messages: [{role:"system", content:sysContent},{role:"user", content: word}], stream: false })
        }).then(res => res.json()).then(data => {
            const content = data.choices?.[0]?.message?.content || "查询失败";
            const freshCache = JSON.parse(localStorage.getItem(DS_CONFIG.consts.VOCAB_CACHE_KEY) || '{}');
            freshCache[word] = content.trim();
            localStorage.setItem(DS_CONFIG.consts.VOCAB_CACHE_KEY, JSON.stringify(freshCache));
            if (callback) callback(content.trim());
            if (DS_CONFIG.runtime.activeTab === 'highlight') refreshHighlightMenu();
        }).catch(e => {
            const errCache = JSON.parse(localStorage.getItem(DS_CONFIG.consts.VOCAB_CACHE_KEY) || '{}');
            errCache[word] = "查询失败，请重试";
            localStorage.setItem(DS_CONFIG.consts.VOCAB_CACHE_KEY, JSON.stringify(errCache));
            if (DS_CONFIG.runtime.activeTab === 'highlight') refreshHighlightMenu();
        });
    }

    async function streamDeepSeekInline(text, targetElement, signal = null) {
        if (DS_CONFIG.runtime.translationCache[text]) {
            targetElement.classList.remove('ds-inline-loading');
            targetElement.innerText = DS_CONFIG.runtime.translationCache[text];
            targetElement.style.color = "#1E90FF";
            return;
        }
        if (!DS_CONFIG.settings.apiKey) { targetElement.innerText = "请配置 API Key"; targetElement.classList.remove('ds-inline-loading'); return; }
        targetElement.innerText = "DeepSeek 思考中...";
        if (!targetElement.classList.contains('ds-inline-loading')) targetElement.classList.add('ds-inline-loading');
        let isFirstChunk = true;
        await requestAI({
            messages: [{role:"system", content:"你是一个翻译引擎。直接输出以下内容的中文翻译，不要任何解释或前缀。"},{role:"user", content: text}],
            signal: signal,
            onUpdate: (delta, fullText) => {
                if (isFirstChunk) { targetElement.innerText = ""; targetElement.classList.remove('ds-inline-loading'); isFirstChunk = false; }
                targetElement.innerText = fullText;
            },
            onFinish: (fullText) => { if (fullText) DS_CONFIG.runtime.translationCache[text] = fullText; },
            onError: (e) => { if (e.name !== 'AbortError') { targetElement.innerText = "DeepSeek Error: " + e.message; targetElement.classList.remove('ds-inline-loading'); } }
        });
    }

    async function streamToElement(sysPrompt, userPrompt, targetElement, cacheCategory, cacheKey, highlightWord = null, mode = 'normal', signal = null) {
        if (cacheCategory && cacheKey && DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey]) {
            targetElement.innerHTML = DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey];
            return;
        }
        if (!DS_CONFIG.settings.apiKey) { targetElement.innerText = "请配置 API Key"; return; }
        targetElement.innerHTML = "<span class='ds-popup-loading'>DeepSeek Thinking...</span>";

        await requestAI({
            messages: [{role:"system",content:sysPrompt},{role:"user",content:userPrompt}],
            signal: signal,
            onUpdate: (delta, fullText) => {
                let finalHtml = "";
                if (mode === 'dict') {
                    const rawLines = fullText.split('\n').filter(l => l.trim() !== '');
                    if (rawLines.length > 0) {
                        let html = "";
                        const headword = rawLines[0].replace(/\*\*/g, '').trim();
                        let ipa = "";
                        let defStartIndex = 1;
                        if (rawLines.length > 1 && (rawLines[1].trim().startsWith('/') || rawLines[1].trim().startsWith('['))) {
                            ipa = rawLines[1].trim(); defStartIndex = 2;
                        }
                        const ipaHtml = ipa ? `<span class="ds-clickable-ipa">${ipa}</span>` : '';
                        html += `<div class="ds-head-row"><span class="ds-headword">${headword}</span>${ipaHtml}</div>`;
                        html += `<div class="ds-dict-grid">`;
                        let lastPos = "";
                        for (let i = defStartIndex; i < rawLines.length; i++) {
                            let lineText = rawLines[i].trim();
                            if (/^(Exchange|Tags)/i.test(lineText)) continue;

                            if (/^([a-z]+|[\u4e00-\u9fa5]+)\.$/i.test(lineText) && i + 1 < rawLines.length) {
                                const nextLine = rawLines[i+1].trim();
                                if (!/^([a-z]+|[\u4e00-\u9fa5]+)\./i.test(nextLine) && !/^(Exchange|Tags)/i.test(nextLine)) {
                                    lineText += " " + nextLine; i++;
                                }
                            }
                            const match = lineText.match(/^([a-z]+|[\u4e00-\u9fa5]+)\.\s*(.*)/i);
                            let pos = ""; let defText = lineText;
                            if (match) { pos = match[1].toLowerCase(); defText = match[2]; }
                            let displayPos = pos;
                            if (pos && pos === lastPos) { displayPos = ""; } else { if (pos) lastPos = pos; }

                            const segments = defText.split(/([;；])/);
                            let segHtml = "";
                            segments.forEach(seg => {
                                if (seg.match(/[;；]/)) { segHtml += `<span style="margin-right:4px;color:#999;">${seg}</span>`; }
                                else if (seg.trim()) { segHtml += `<span class="ds-def-split" data-def="${encodeURIComponent(seg.trim())}" title="点击为此义项生成例句">${seg}</span>`; }
                            });
                            html += `<div class="ds-pos-label">${displayPos}</div>`;
                            html += `<div class="ds-def-content">${segHtml}</div>`;
                        }
                        html += `</div>`;
                        finalHtml = html;
                    } else { finalHtml = "<span class='ds-popup-loading'>...</span>"; }
                } else {
                    let safeHtml = fullText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n/g, "<br>");
                    if (highlightWord) {
                        const safeReg = new RegExp(`(?<!<[^>]*)(\\b${escapeRegExp(highlightWord)}\\b)(?![^<]*>)`, 'gi');
                        safeHtml = safeHtml.replace(safeReg, '<span class="ds-target-italic" style="color:#1E90FF!important;">$1</span>');
                    }
                    finalHtml = safeHtml;
                }
                targetElement.innerHTML = finalHtml;
            },
            onFinish: (fullText) => {
                 if (cacheCategory && cacheKey && targetElement.innerHTML) { DS_CONFIG.runtime.popupCache[cacheCategory][cacheKey] = targetElement.innerHTML; }
            },
            onError: (e) => { if(e.name !== 'AbortError') targetElement.innerText = "Error: " + e.message; }
        });
    }

    window.updateRightPanelExamples = function(defText, word) {
        if (DS_CONFIG.runtime.rightPanelAbortCtrl) { DS_CONFIG.runtime.rightPanelAbortCtrl.abort(); }
        const rightBody = document.querySelector('#ds-popup-right-content .ds-popup-text');
        if (!rightBody) return;
        document.querySelectorAll('.ds-def-split').forEach(el => el.style.color = '');
        if (event.target.classList.contains('ds-def-split')) { event.target.style.color = '#3a7bd5'; }
        const rightHeader = document.querySelector('#ds-popup-right-content .ds-popup-title');
        rightHeader.innerText = "📖 例句示范";
        const cacheKey = word + "_" + defText;
        if (DS_CONFIG.runtime.exampleCache[cacheKey]) { rightBody.innerHTML = DS_CONFIG.runtime.exampleCache[cacheKey]; return; }
        DS_CONFIG.runtime.rightPanelAbortCtrl = new AbortController();
        rightBody.innerHTML = "<span class='ds-popup-loading'>Generating 2 examples...</span>";
        let prompt = "";
        if (isChinese(word)) { prompt = `针对中文词汇 "${word}" 的特定含义："${defText}"，请生成 **2个** 包含该词的中文例句并附带英文翻译。要求：1. 必须提供2个不同场景的例句。2. 不要使用前缀标签。3. 中英文交替显示。`; }
        else { prompt = `针对单词 "${word}" 的特定含义："${defText}"，请生成 **2个** 地道的英文例句并附带中文翻译。要求：1. 必须提供2个不同场景的例句。2. **不要** 使用 "En:" 或 "Cn:" 等前缀。3. 第一行英文，第二行中文，依次排列。`; }
        prompt += `\n(Ref: ${Date.now()})`;
        requestAI({
            messages: [{role:"system",content:prompt},{role:"user",content:word}],
            signal: DS_CONFIG.runtime.rightPanelAbortCtrl.signal,
            onUpdate: (delta, fullText) => {
                let html = fullText.replace(/\n/g, "<br>");
                const safeReg = new RegExp(`(?<!<[^>]*)(\\b${escapeRegExp(word)}\\b)(?![^<]*>)`, 'gi');
                html = html.replace(safeReg, '<span class="ds-target-italic" style="color:#1E90FF!important;">$1</span>');
                rightBody.innerHTML = html;
            },
            onFinish: (fullText) => { if (fullText && rightBody.innerHTML) { DS_CONFIG.runtime.exampleCache[cacheKey] = rightBody.innerHTML; } },
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
             messages = continueMessages; aiMsg = DS_CONFIG.runtime.currentAiContext.element; aiMsg.innerHTML += "<br><br><i>[Continuing...]</i><br>";
        } else {
            uMsg = document.createElement('div'); uMsg.className = 'ds-msg user-msg';
            let display = mode==="dict"?`📖 词典: ${targetWord}`:mode==="explain"?`🔍 沉浸: ${targetWord}`:mode==="summary"?"🧠 全文总结":mode==="custom"?"✨ "+query.substring(0,40):query.substring(0,40);
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
        DS_CONFIG.runtime.currentAiContext = { messages: messages, generatedText: continueMessages ? DS_CONFIG.runtime.currentAiContext.generatedText : "", element: aiMsg };
        await requestAI({
            messages: messages, signal: DS_CONFIG.runtime.abortCtrl.signal,
            onUpdate: (delta, fullText) => {
                DS_CONFIG.runtime.currentAiContext.generatedText = fullText;
                if (!continueMessages && aiMsg.innerText === "...") aiMsg.innerText = "";
                let html = fullText.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
                if (targetWord && mode!=="summary" && mode!=="custom") {
                      const reg = new RegExp(`(${targetWord})`,'gi');
                      html = html.replace(reg,"<span class=\"highlight-word\">$1</span>");
                }
                aiMsg.innerHTML = html;
                const threshold = 150;
                const isNearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < threshold;
                if (isNearBottom) { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); }
            },
            onError: (e) => {
                if (e.name === 'AbortError') {
                    const continueElem = document.createElement('div');
                    continueElem.className = 'ds-continue-text';
                    continueElem.innerText = '👉 点击继续生成';
                    continueElem.onclick = function() {
                        this.remove();
                        const newMessages = [...DS_CONFIG.runtime.currentAiContext.messages];
                        if (newMessages[newMessages.length - 1].role !== 'assistant') { newMessages.push({role: "assistant", content: DS_CONFIG.runtime.currentAiContext.generatedText}); }
                        else { newMessages[newMessages.length - 1].content = DS_CONFIG.runtime.currentAiContext.generatedText; }
                        newMessages.push({role: "user", content: "请继续（Continue）"});
                        askAI("", targetWord, mode, newMessages);
                    };
                    aiMsg.appendChild(continueElem);
                    log.scrollTop = log.scrollHeight;
                } else { aiMsg.innerText += "\n[请求失败: " + e.message + "]"; }
            }
        });
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
        if (DOM.highlightContent && DS_CONFIG.runtime.activeTab === 'highlight') refreshHighlightMenu();
        setTimeout(() => { DS_CONFIG.runtime.isRestoring = false; }, 100);
    }

    function removeHighlight(el) {
        DS_CONFIG.runtime.isRestoring = true; const p = el.parentNode;
        if (p) { while (el.firstChild) p.insertBefore(el.firstChild, p.contains(el) ? el : null); el.remove(); saveHighlights(); }
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
        const cache = JSON.parse(localStorage.getItem(DS_CONFIG.consts.VOCAB_CACHE_KEY) || '{}');
        const words = [...new Set(JSON.parse(localStorage.getItem(DS_CONFIG.consts.STORAGE_KEY) || '[]').map(h => h.text))];
        DOM.highlightContent.innerHTML = '<div id="ds-highlight-log"></div>';
        const logEl = DOM.highlightContent.querySelector('#ds-highlight-log');
        if (words.length === 0) { logEl.innerHTML = '<div style="text-align:center;color:#666;margin-top:20px;font-size:13px;">暂无生词记录<br>Alt+1 添加</div>'; return; }
        words.forEach(word => {
            const item = document.createElement('div'); item.className = 'web-menu-item';
            item.dataset.word = word;
            let ipa = "", definition = "..."; const cachedContent = cache[word];
            let defHtml = "";
            if (cachedContent && cachedContent !== "..." && cachedContent !== "waiting") {
                const match = cachedContent.match(/^(\[.*?\])\s*(.*)/s);
                if (match) { ipa = match[1]; definition = match[2]; } else { definition = cachedContent; }
                defHtml = `<div class="web-menu-trans">${definition}</div>`;
            } else {
                defHtml = `<div class="web-menu-trans"><span class='ds-popup-loading' style="font-size:12px;">DeepSeek Thinking...</span></div>`;
            }
            item.innerHTML = `<div class="web-menu-header"><span class="web-menu-word">${word}</span><span class="web-menu-ipa">${ipa}</span></div>${defHtml}`;
            logEl.appendChild(item);
        });
    }

    const isSidebarVisible = () => {
        if (!DOM.sidebar) return false;
        if (DS_CONFIG.settings.sidebarSide === 'right') return DOM.sidebar.style.right === '0px';
        return DOM.sidebar.style.left === '0px';
    };

    const showSidebar = () => {
        if (DOM.sidebar) {
            // 清除对侧样式，确保吸附正确
            if (DS_CONFIG.settings.sidebarSide === 'right') {
                DOM.sidebar.style.right = '0';
                DOM.sidebar.style.left = '';
            } else {
                DOM.sidebar.style.left = '0';
                DOM.sidebar.style.right = '';
            }
        }
        if (DS_CONFIG.runtime.activeTab !== 'highlight' && DS_CONFIG.runtime.activeTab !== 'ai') switchTab('highlight');
        switchTab('highlight');
    };

    const hideSidebar = () => {
        if (DOM.sidebar) {
            if (DS_CONFIG.settings.sidebarSide === 'right') {
                DOM.sidebar.style.right = '-1200px';
                DOM.sidebar.style.left = '';
            } else {
                DOM.sidebar.style.left = '-1200px';
                DOM.sidebar.style.right = '';
            }
        }
        if (DS_CONFIG.runtime.abortCtrl) DS_CONFIG.runtime.abortCtrl.abort();
        const cp = document.getElementById('ds-config-panel');
        if (cp) cp.style.display = 'none';
        const hp = document.getElementById('ds-help-panel');
        if (hp) hp.style.display = 'none';
    };

    const toggleSidebarState = () => {
        if (isSidebarVisible()) hideSidebar();
        else showSidebar();
    };

    const switchTab = (tabName) => {
        if (tabName !== 'ai' && tabName !== 'highlight') return; DS_CONFIG.runtime.activeTab = tabName;
        document.querySelectorAll('.ds-tab').forEach(tab => { tab.classList.remove('active'); if (tab.dataset.tab === tabName) tab.classList.add('active'); });
        document.querySelectorAll('.tab-panel').forEach(panel => { panel.classList.remove('active'); if (panel.dataset.panel === tabName) panel.classList.add('active'); });
        if (tabName === 'highlight') { refreshHighlightMenu(); applySavedHighlights(); }
    };

    function showSmartPopup(text, targetHighlight, context = "", isSelection = false) {
        if (!DOM.popup) return;
        if (DS_CONFIG.state.isPopupLocked) {
              DOM.popup.style.left = DS_CONFIG.state.savedPopupPos.x + 'px'; DOM.popup.style.top = DS_CONFIG.state.savedPopupPos.y + 'px'; DOM.popup.style.transform = 'none';
        } else {
            let rect;
            if (isSelection) {
                  try { rect = window.getSelection().getRangeAt(0).getBoundingClientRect(); } catch(e) { return; }
            } else if (targetHighlight) {
                  rect = targetHighlight.getBoundingClientRect();
            } else {
                  // Fallback for hover (non-highlight, non-selection)
                  // Construct a fake rect around mouse
                  rect = { top: DS_CONFIG.runtime.lastY - 10, bottom: DS_CONFIG.runtime.lastY + 10, left: DS_CONFIG.runtime.lastX - 10, width: 20, height: 20 };
            }

            const pWidth = parseInt(DOM.popup.style.width || DS_CONFIG.settings.popupWidth) || 600;
            const pHeight = parseInt(DOM.popup.style.height || DS_CONFIG.settings.popupHeight) || 350;
            const viewportHeight = window.innerHeight; const viewportWidth = window.innerWidth;
            let top = rect.bottom + 10; let left = rect.left + (rect.width / 2) - (pWidth / 2);
            if (top + pHeight > viewportHeight) { top = rect.top - 10 - pHeight; if (top < 10) top = 10; }
            if (left < 10) left = 10; if (left + pWidth > viewportWidth - 10) left = viewportWidth - pWidth - 10;
            DOM.popup.style.top = top + 'px'; DOM.popup.style.left = left + 'px'; DOM.popup.style.transform = 'none';
        }
        DOM.popup.style.display = 'flex';
        DS_CONFIG.runtime.currentPopupTrigger = targetHighlight;

        DOM.popup.innerHTML = `<div class="ds-resize-handle ds-rh-n" data-dir="n"></div><div class="ds-resize-handle ds-rh-s" data-dir="s"></div><div class="ds-resize-handle ds-rh-w" data-dir="w"></div><div class="ds-resize-handle ds-rh-e" data-dir="e"></div><div class="ds-resize-handle ds-rh-nw" data-dir="nw"></div><div class="ds-resize-handle ds-rh-ne" data-dir="ne"></div><div class="ds-resize-handle ds-rh-sw" data-dir="sw"></div><div class="ds-resize-handle ds-rh-se" data-dir="se"></div><div id="ds-popup-header-bar"><div id="ds-popup-open-sidebar" class="ds-popup-icon" title="切换侧边栏 (显示/隐藏)">🏠</div><div id="ds-popup-full-trans" class="ds-popup-icon" title="网页正文全文翻译 (点击切换)">🌐</div><div id="ds-popup-lock" class="ds-popup-icon" title="锁定/解锁 (锁定后位置固定)">🔓</div><div id="ds-popup-close-float" class="ds-popup-icon">✖</div></div><div id="ds-popup-body"><div class="ds-split-view"><div class="ds-split-left" id="ds-popup-left-content"><div class="ds-popup-title">🔤 词典解析</div><div class="ds-popup-text"></div></div><div class="ds-split-right" id="ds-popup-right-content"><div class="ds-popup-title">🔍 文中解析</div><div class="ds-popup-text"></div></div></div></div>`;

        const headerBar = document.getElementById('ds-popup-header-bar');
        headerBar.addEventListener('mousedown', (e) => {
             const icon = e.target.closest('.ds-popup-icon');
             if (icon) return;
             DS_CONFIG.runtime.isDraggingPopup = true; DS_CONFIG.runtime.dragStartX = e.clientX; DS_CONFIG.runtime.dragStartY = e.clientY; DS_CONFIG.runtime.popupStartX = DOM.popup.offsetLeft; DS_CONFIG.runtime.popupStartY = DOM.popup.offsetTop;
        });
        headerBar.addEventListener('click', (e) => {
            const icon = e.target.closest('.ds-popup-icon');
            if (!icon) return;
            if (icon.id === 'ds-popup-close-float') { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; }
            else if (icon.id === 'ds-popup-open-sidebar') { toggleSidebarState(); }
            else if (icon.id === 'ds-popup-full-trans') { togglePageTranslation(); }
            else if (icon.id === 'ds-popup-lock') {
                DS_CONFIG.state.isPopupLocked = !DS_CONFIG.state.isPopupLocked; GM_setValue('ds_popup_locked', DS_CONFIG.state.isPopupLocked);
                if (DS_CONFIG.state.isPopupLocked) { icon.innerText = '🔒'; icon.classList.add('locked'); DS_CONFIG.state.savedPopupPos = { x: DOM.popup.offsetLeft, y: DOM.popup.offsetTop }; GM_setValue('ds_popup_pos', DS_CONFIG.state.savedPopupPos); }
                else { icon.innerText = '🔓'; icon.classList.remove('locked'); }
            }
        });

        DOM.popup.querySelectorAll('.ds-resize-handle').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation(); e.preventDefault(); DS_CONFIG.runtime.isResizingPopup = true; DS_CONFIG.runtime.resizeDirection = el.dataset.dir; DS_CONFIG.runtime.dragStartX = e.clientX; DS_CONFIG.runtime.dragStartY = e.clientY; DS_CONFIG.runtime.resizeStartRect = DOM.popup.getBoundingClientRect();
            });
        });

        const leftEl = DOM.popup.querySelector('#ds-popup-left-content .ds-popup-text');
        const rightEl = DOM.popup.querySelector('#ds-popup-right-content .ds-popup-text');

        DOM.popup.querySelector('#ds-popup-left-content').addEventListener('click', (e) => {
            if (e.target.classList.contains('ds-def-split')) {
                const defText = decodeURIComponent(e.target.dataset.def);
                window.updateRightPanelExamples(defText, text);
            }
        });

        const dictKey = text; const contextKey = text + "_" + context.substring(0, 20);
        let dictPrompt = isChinese(text) ?
            "你是一个专业的汉语词典接口。请严格按照词典格式输出，不要废话。" :
            "你是一个基于 ECDICT (Collins + Oxford) 数据库的词典接口。请严格按照以下 ECDICT 数据结构输出信息，不要提供例句。\n\n格式要求：\n单词原型\n/音标/\n词性. 中文释义\nExchange: ...\nTags: ...\n...";

        streamToElement(dictPrompt, text, leftEl, 'dict', dictKey, text, 'dict');
        const contextPrompt = `你是一个语言专家。请分析"${text}"在以下句子中的用法：\n\n"${context}"\n\n请模仿以下风格进行解析：\n"在句子 '...' 中，'${text}' 是...词性...形式，与...构成...搭配，表示...。这里的固定搭配是...，意思是...。"`;
        streamToElement(contextPrompt, context, rightEl, 'context', contextKey, text, 'normal');
    }

    function buildUI() {
        if (!isTopWindow) return;
        if (document.getElementById('ds-sidebar')) return;
        const container = document.createElement('div'); container.id = 'ds-sidebar';
        const promptString = DS_CONFIG.settings.customPrompts.map(p => `${p.name}=${p.template}`).join('\n');

        container.innerHTML = `
        <div id="ds-resizer"></div>
        <div id="ds-header">
            <div id="ds-header-left">
                <div id="ds-cfg-toggle" class="header-action" title="设置">⚙️</div>
                <div id="ds-clear-cache" class="header-action" title="清除缓存">🗑️</div>
                <div id="ds-help-btn" class="header-action" title="使用说明">💡</div>
            </div>
            <div id="ds-tabs-wrapper">
                <div class="ds-tab active" data-tab="highlight" title="生词本">📖</div>
                <div class="ds-tab" data-tab="ai" title="AI 助手">💬</div>
            </div>
            <div id="ds-header-right">
                <div id="ds-side-toggle" class="header-action" title="切换侧边栏方向">👈🏻</div>
                <div id="ds-full-page-trans-btn" class="header-action" title="全文翻译开关">🌐</div>
                <div id="ds-close" class="header-action" title="关闭">✖</div>
            </div>
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
            <div class="cfg-row" style="flex-direction:column;align-items:flex-start;">
                <span>DeepSeek API Key:</span>
                <input type="text" id="cfg-api-key" style="width:100%;margin-top:5px;padding:6px;" value="${DS_CONFIG.settings.apiKey}">
            </div>
            <div class="cfg-row" style="flex-direction:column;align-items:flex-start;">
                <span class="ds-instruction-text">自定义Prompt格式：</span>
                <span class="ds-instruction-text ds-instruction-highlight">按钮名=prompt具体指令</span>
                <textarea id="cfg-prompts" placeholder="按钮名称=具体指令内容\n每行一条...">${promptString}</textarea>
            </div>
            <button id="save-api-key" class="ds-primary-btn">保存并退出</button>
        </div>
        <div id="ds-help-panel">
            <div class="ds-help-title">💡 使用说明</div>
            <div class="ds-help-item">
                <span class="ds-help-key">Alt + Alt</span>
                <span class="ds-help-desc">快速双击 Alt，可对被悬浮或被选中的文本展开浮窗进行查词。</span>
            </div>
            <div class="ds-help-item">
                <span class="ds-help-key">Alt + 1</span>
                <span class="ds-help-desc">可对被悬浮或被选中的文本进行高亮，并加入侧边栏高亮文本列表。</span>
            </div>
            <div class="ds-help-item">
                <span class="ds-help-key">Alt + 2 或 右键</span>
                <span class="ds-help-desc">可对被悬浮或被选中的文本移除高亮，并移出侧边栏高亮文本列表。</span>
            </div>
            <div class="ds-help-item">
                <span class="ds-help-key">Alt + 左键</span>
                <span class="ds-help-desc">（于有非中文文本的段落上）可对该段落进行文本翻译。</span>
            </div>
            <div class="ds-help-item">
                <span class="ds-help-key">Alt 或 右键</span>
                <span class="ds-help-desc">（于非浮窗/侧边栏区域上）可关闭浮窗/侧边栏。</span>
            </div>
            <div class="ds-help-item">
                <span class="ds-help-key">鼠标移动至屏幕边缘停留0.5秒</span>
                <span class="ds-help-desc">唤醒侧边栏，可由此查阅高亮文本列表或使用AI进阶功能。</span>
            </div>
            <button id="ds-help-close" class="ds-primary-btn">关闭说明</button>
        </div>
        <div id="ds-tab-content">
            <div class="tab-panel active" data-panel="highlight" id="ds-highlight-content"></div>
            <div class="tab-panel" data-panel="ai" id="ds-ai-content">
                <div id="ds-chat-log"></div>
            </div>
        </div>
        <div id="ds-fn-bar"></div>
        <div id="ds-input-area">
            <div id="ds-input-wrapper">
                <textarea id="ds-input" placeholder="DeepSeek AI 等待您的指令..."></textarea>
                <div id="ds-send-row">
                    <button id="ds-summary-btn" class="ds-action-btn">🧠 总结</button>
                    <button id="ds-send" class="ds-action-btn">🚀 发送</button>
                </div>
            </div>
        </div>`;

        const popupEl = document.createElement('div'); popupEl.id = 'ds-popup';
        popupEl.style.width = DS_CONFIG.settings.popupWidth; popupEl.style.height = DS_CONFIG.settings.popupHeight;
        popupEl.innerHTML = `<div id="ds-popup-body"></div>`;
        popupEl.addEventListener('mouseup', () => {
            GM_setValue('ds_popup_width', popupEl.style.width);
            GM_setValue('ds_popup_height', popupEl.style.height);
            if (DS_CONFIG.state.isPopupLocked) {
                DS_CONFIG.state.savedPopupPos = { x: popupEl.offsetLeft, y: popupEl.offsetTop };
                GM_setValue('ds_popup_pos', DS_CONFIG.state.savedPopupPos);
            }
        });

        document.body.appendChild(container); document.body.appendChild(popupEl);

        DOM.sidebar = container;
        DOM.popup = popupEl;
        DOM.highlightContent = document.getElementById('ds-highlight-content');

        renderCustomButtons();
        injectStyles();
        updateSidebarPosition(false);
    }

    function renderCustomButtons() {
        const bar = document.getElementById('ds-fn-bar'); if (!bar) return; bar.innerHTML = '';
        DS_CONFIG.settings.customPrompts.forEach(item => {
            if (!item.name || !item.template) return;
            const btn = document.createElement('div');
            btn.className = 'fn-btn custom-prompt-btn';
            btn.innerText = item.name; btn.title = item.template;
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

    // ==================== 4. 事件绑定 (委托优化) ====================
    function bindEvents() {
        document.addEventListener('mousemove', e => {
            DS_CONFIG.runtime.lastX = e.clientX; DS_CONFIG.runtime.lastY = e.clientY;
            if (isTopWindow) {
                // Edge Sidebar Trigger (Modification V3.12 with Scrollbar Smart Fix)
                const edgeThreshold = 20; // 扩大到 20px
                const clientWidth = document.documentElement.clientWidth || window.innerWidth;

                const isLeftEdge = e.clientX < edgeThreshold;

                // 核心修改：右侧触发范围，依据 clientWidth (不含滚动条的宽度) 计算
                // 确保触发区域是 [内容右边界 - 20px] 到 [内容右边界]
                // 且不延伸到滚动条区域 (即 <= clientWidth)
                const isRightEdge = (e.clientX > clientWidth - edgeThreshold) && (e.clientX <= clientWidth);

                if (!isSidebarVisible()) {
                    if (isRightEdge || isLeftEdge) {
                        // 进入边缘区域，启动计时器
                        if (!DS_CONFIG.runtime.edgeTimer) {
                            DS_CONFIG.runtime.edgeTimer = setTimeout(() => {
                                // 0.5秒后再次检查鼠标位置，决定是否打开
                                const currentX = DS_CONFIG.runtime.lastX;
                                const curClientWidth = document.documentElement.clientWidth || window.innerWidth;
                                const curRight = (currentX > curClientWidth - edgeThreshold) && (currentX <= curClientWidth);
                                const curLeft = currentX < edgeThreshold;

                                if (curRight) {
                                     if (DS_CONFIG.settings.sidebarSide !== 'right') {
                                         DS_CONFIG.settings.sidebarSide = 'right';
                                         GM_setValue('ds_sidebar_side', 'right');
                                         updateSidebarPosition(false);
                                     }
                                     showSidebar();
                                } else if (curLeft) {
                                     if (DS_CONFIG.settings.sidebarSide !== 'left') {
                                         DS_CONFIG.settings.sidebarSide = 'left';
                                         GM_setValue('ds_sidebar_side', 'left');
                                         updateSidebarPosition(false);
                                     }
                                     showSidebar();
                                }
                                DS_CONFIG.runtime.edgeTimer = null;
                            }, 500); // 500ms 延迟
                        }
                    } else {
                        // 离开边缘区域，立即取消计时
                        if (DS_CONFIG.runtime.edgeTimer) {
                            clearTimeout(DS_CONFIG.runtime.edgeTimer);
                            DS_CONFIG.runtime.edgeTimer = null;
                        }
                    }
                }

                if (DS_CONFIG.runtime.isResizingPopup && DOM.popup) {
                    const dx = e.clientX - DS_CONFIG.runtime.dragStartX; const dy = e.clientY - DS_CONFIG.runtime.dragStartY; const startRect = DS_CONFIG.runtime.resizeStartRect;
                    if (DS_CONFIG.runtime.resizeDirection.includes('e')) { DOM.popup.style.width = (startRect.width + dx) + 'px'; }
                    if (DS_CONFIG.runtime.resizeDirection.includes('w')) { DOM.popup.style.width = (startRect.width - dx) + 'px'; DOM.popup.style.left = (startRect.left + dx) + 'px'; }
                    if (DS_CONFIG.runtime.resizeDirection.includes('s')) { DOM.popup.style.height = (startRect.height + dy) + 'px'; }
                    if (DS_CONFIG.runtime.resizeDirection.includes('n')) { DOM.popup.style.height = (startRect.height - dy) + 'px'; DOM.popup.style.top = (startRect.top + dy) + 'px'; }
                    return;
                }
                const isResizing = document.getElementById('ds-resizer')?.dataset.resizing === 'true';
                if (isResizing) {
                    document.body.style.cursor = 'ew-resize';
                    if (DOM.sidebar) {
                        let width;
                        if (DS_CONFIG.settings.sidebarSide === 'right') {
                            width = window.innerWidth - e.clientX;
                        } else {
                            width = e.clientX;
                        }

                        if (width > 300 && width < window.innerWidth * 0.9) { DOM.sidebar.style.width = width + 'px'; GM_setValue('sidebar_width', width); DS_CONFIG.settings.sidebarWidth = width; }
                    }
                }
                if (DS_CONFIG.runtime.isDraggingPopup && DOM.popup) {
                    const dx = e.clientX - DS_CONFIG.runtime.dragStartX; const dy = e.clientY - DS_CONFIG.runtime.dragStartY;
                    DOM.popup.style.left = (DS_CONFIG.runtime.popupStartX + dx) + 'px'; DOM.popup.style.top = (DS_CONFIG.runtime.popupStartY + dy) + 'px';
                }
            }
        }, {passive: true});

        document.addEventListener('mouseup', () => {
            const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'false';
            document.body.style.cursor = 'default';
            DS_CONFIG.runtime.isDraggingPopup = false; DS_CONFIG.runtime.isResizingPopup = false;
        });

        document.addEventListener('keydown', (e) => {
            // 核心修复：如果按下的键不是Alt，立即作废双击计时
            if (e.key !== 'Alt') { DS_CONFIG.runtime.lastAltUpTime = 0; }

            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
            if (e.key === 'Alt') { DS_CONFIG.runtime.isAltDown = true; }
            if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
                e.preventDefault(); DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;
                const sel = window.getSelection(); let range = null;
                if (sel.rangeCount && sel.toString().trim()) { range = sel.getRangeAt(0); }
                else { const wordObj = getCurrentSentence(); if (wordObj) { range = document.createRange(); range.setStart(wordObj.node, wordObj.s); range.setEnd(wordObj.node, wordObj.e); } }
                if (range) {
                    const text = range.toString().trim();
                    if (!range.commonAncestorContainer.parentElement.classList.contains(DS_CONFIG.consts.HIGHLIGHT_CLASS)) {
                        copyToClip(text);
                        const mark = document.createElement('mark'); mark.className = DS_CONFIG.consts.HIGHLIGHT_CLASS; mark.appendChild(range.extractContents()); range.insertNode(mark);
                        saveHighlights(); sel.removeAllRanges(); getDeepSeekVocabDef(text);
                    }
                }
            }
            if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
                e.preventDefault(); DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;
                const el = document.elementFromPoint(DS_CONFIG.runtime.lastX, DS_CONFIG.runtime.lastY);
                if (el) { const hl = el.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`); if (hl) { removeHighlight(hl); return; } }
            }
        }, true);

        if (isTopWindow) {
            document.addEventListener('keyup', (e) => {
                if (e.key === 'Alt') {
                    DS_CONFIG.runtime.isAltDown = false; const now = Date.now();
                    if (now < DS_CONFIG.runtime.sidebarLockUntil) { DS_CONFIG.runtime.lastAltUpTime = 0; return; }

                    // Double Alt Logic
                    if (now - DS_CONFIG.runtime.lastAltUpTime < 1000) {
                        const selText = window.getSelection().toString().trim();
                        // 1. If selection exists -> Popup
                        if (selText.length > 0) {
                             copyToClip(selText);
                             let context = ""; try { context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e){}
                             showSmartPopup(selText, null, context, true);
                        }
                        // 2. Hover Logic (New): If no selection, get word under cursor
                        else {
                            const wordObj = getCurrentSentence();
                            if (wordObj && wordObj.text) {
                                const context = wordObj.node.parentElement ? wordObj.node.parentElement.innerText : wordObj.text;
                                showSmartPopup(wordObj.text, null, context, false);
                            }
                        }
                        DS_CONFIG.runtime.lastAltUpTime = 0; // Reset
                    }
                    // Single Alt Logic (Close Action)
                    else {
                        let actionTaken = false;
                        // Close Popup if open
                        if (DOM.popup && DOM.popup.style.display !== 'none' && !DS_CONFIG.state.isPopupLocked) {
                            DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; clearAllInlineTranslations();
                            actionTaken = true;
                        }
                        // Close Sidebar if open
                        if (isSidebarVisible()) {
                             hideSidebar();
                             actionTaken = true;
                        }
                        // If we closed something, we generally don't want to start a double-click timer immediately,
                        // but to allow "Close then Open" quickly, we still set the time.
                        DS_CONFIG.runtime.lastAltUpTime = now;
                    }
                }
            }, true);
        }

        document.addEventListener('click', e => { if (e.altKey) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

        if (isTopWindow) {
            DOM.sidebar.addEventListener('click', (e) => {
                const tab = e.target.closest('.ds-tab');
                if (tab) { switchTab(tab.dataset.tab); return; }

                const menuItem = e.target.closest('.web-menu-item');
                if (menuItem) {
                    const word = menuItem.dataset.word;
                    const input = document.getElementById('ds-input');
                    if (input) { input.value = word; }
                    const highlights = document.querySelectorAll(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
                    for (let el of highlights) {
                        if (el.textContent.trim() === word) {
                            el.scrollIntoView({ behavior: 'auto', block: 'center' });
                            el.style.transition = 'background-color 0.2s';
                            el.style.backgroundColor = '#FFD700';
                            setTimeout(() => { el.style.backgroundColor = ''; }, 600);
                            break;
                        }
                    }
                    return;
                }

                const targetId = e.target.id || e.target.closest('.header-action')?.id || e.target.closest('button')?.id;
                if (!targetId) return;

                if (targetId === 'ds-help-btn') { const hp = document.getElementById('ds-help-panel'); if (hp) hp.style.display = hp.style.display === 'flex' ? 'none' : 'flex'; }
                else if (targetId === 'ds-help-close') { document.getElementById('ds-help-panel').style.display = 'none'; }
                else if (targetId === 'ds-full-page-trans-btn') { togglePageTranslation(); }
                else if (targetId === 'ds-clear-cache') { document.getElementById('ds-confirm-modal').style.display = 'flex'; }
                else if (targetId === 'ds-cfg-toggle') { const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = cp.style.display === 'flex' ? 'none' : 'flex'; }
                else if (targetId === 'ds-close') { hideSidebar(); }
                else if (targetId === 'ds-side-toggle') { toggleSidebarSide(); }
                else if (targetId === 'save-api-key') {
                    const cfgApiKey = document.getElementById('cfg-api-key'); const cfgPrompts = document.getElementById('cfg-prompts');
                    if (!cfgApiKey) return;
                    DS_CONFIG.settings.apiKey = cfgApiKey.value;
                    const rawLines = cfgPrompts.value.split('\n'); DS_CONFIG.settings.customPrompts = [];
                    rawLines.forEach(line => {
                        if (line.includes('=')) { const parts = line.split('='); if (parts.length >= 2) { const name = parts[0].trim(); const template = line.substring(line.indexOf('=') + 1).trim(); if(name && template) DS_CONFIG.settings.customPrompts.push({name, template}); } }
                    });
                    GM_setValue('ds_api_key', DS_CONFIG.settings.apiKey); GM_setValue('ds_custom_prompts', DS_CONFIG.settings.customPrompts);
                    renderCustomButtons();
                    document.getElementById('ds-config-panel').style.display = 'none';
                }
                else if (targetId === 'ds-send') {
                    const el = document.getElementById('ds-input'); if (!el) return; const val = el.value.trim();
                    if (val) { if (DS_CONFIG.runtime.activeTab !== 'ai') switchTab('ai'); askAI(val,"","chat"); el.value = ""; }
                }
                else if (targetId === 'ds-summary-btn') {
                      const content = getArticleContent();
                      askAI(`请对以下文章内容进行结构化总结：\n\n${content}`, "", "summary");
                }
                else if (targetId === 'ds-confirm-yes') {
                    Object.keys(localStorage).forEach(k => { if(k.startsWith(DS_CONFIG.consts.STORAGE_PREFIX) || k === DS_CONFIG.consts.VOCAB_CACHE_KEY) localStorage.removeItem(k); });
                    location.reload();
                }
                else if (targetId === 'ds-confirm-no') { document.getElementById('ds-confirm-modal').style.display = 'none'; }
            });

            document.getElementById('ds-chat-log')?.addEventListener('contextmenu', (e) => { e.preventDefault(); if (DS_CONFIG.runtime.abortCtrl) { DS_CONFIG.runtime.abortCtrl.abort(); } });
            document.getElementById('ds-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { if (!e.shiftKey) { e.preventDefault(); document.getElementById('ds-send').click(); } } });
            document.getElementById('ds-resizer')?.addEventListener('mousedown', () => { const resizer = document.getElementById('ds-resizer'); if (resizer) resizer.dataset.resizing = 'true'; });
            document.addEventListener('selectionchange', () => { if (!DS_CONFIG.settings.autoImport) return; const sel = window.getSelection().toString().trim(); const el = document.getElementById('ds-input'); if (sel && sel.length < 500 && el) { el.value = sel; DS_CONFIG.runtime.lastSelection.word = sel; try { DS_CONFIG.runtime.lastSelection.context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e) {DS_CONFIG.runtime.lastSelection.context = "";} } });
        }

        document.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
            if (targetHighlight) return;
            const inSidebar = DOM.sidebar && DOM.sidebar.contains(e.target); const inPopup = DOM.popup && DOM.popup.style.display !== 'none' && DOM.popup.contains(e.target);
            if (!inSidebar && !inPopup) { if (DOM.popup && DOM.popup.style.display !== 'none' && !DS_CONFIG.state.isPopupLocked && isTopWindow) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; clearAllInlineTranslations(); } }
            if (e.altKey) { DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600; }
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 2) return;
            const targetTrans = e.target.closest('.web-inline-trans, .ds-full-page-trans'); if (targetTrans) { e.preventDefault(); e.stopPropagation(); targetTrans.remove(); return; }
            const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`); if (targetHighlight) { e.preventDefault(); e.stopPropagation(); removeHighlight(targetHighlight); return; }
            const inSidebar = DOM.sidebar && DOM.sidebar.contains(e.target); const inPopup = DOM.popup && DOM.popup.style.display !== 'none' && DOM.popup.contains(e.target);
            if (!inSidebar && !inPopup && isTopWindow) { if (isSidebarVisible()) hideSidebar(); if (DOM.popup && DOM.popup.style.display !== 'none') { if (!DS_CONFIG.state.isPopupLocked) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; clearAllInlineTranslations(); } } }
        });
        document.addEventListener('mousedown', e => {
            const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`);
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
                copyToClip(text);
                if (isSidebarVisible() && isTopWindow) { const input = document.getElementById('ds-input'); if(input) { input.value = text; } }
                const isWord = (text.split(/\s+/).length <= 3 && text.length < 30);
                if (isWord) { if (isTopWindow) { if (DOM.popup.style.display === 'flex' && DS_CONFIG.runtime.currentPopupTrigger === targetHighlight && !DS_CONFIG.state.isPopupLocked) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; return; } showSmartPopup(text, targetHighlight, context); } }
                else { clearAllInlineTranslations(); const transSpan = document.createElement('div'); transSpan.className = 'web-inline-trans'; transSpan.textContent = "DeepSeek 思考中..."; if (targetHighlight.nextSibling) targetHighlight.parentNode.insertBefore(transSpan, targetHighlight.nextSibling); else targetHighlight.parentNode.appendChild(transSpan); streamDeepSeekInline(text, transSpan); }
            }
        }, true);
    }

    function initTimedTasks() { setInterval(() => { if (!DS_CONFIG.runtime.isRestoring && isSidebarVisible()) { applySavedHighlights(); } }, 2000); }
    async function init() {
        buildUI();
        bindEvents();
        initTimedTasks();
        refreshHighlightMenu();
    }
    init();
})();