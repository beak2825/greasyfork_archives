// ==UserScript==
// @name        AI语言学习专家
// @namespace   http://tampermonkey.net/
// @version     1.0
// @license     MIT
// @description 全DeepSeek驱动的英语学习专家。新增：侧边栏“挤压模式”开关（↔️），可选择覆盖网页或将网页挤开。纯原生DOM操作重构，彻底杜绝XSS风险。1.适配YouTube动态加载；2.精准挂载DOM；3.右键任意停止输出。快捷键更新：Alt+1切换高亮(添加/删除)；Alt+2切换侧边栏；双击Alt同步输入框。新增：自动复制开关。
// @author      Gemini & 豆包编程助手
// @match       *://*/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @connect     api.deepseek.com
// @connect     api.dictionaryapi.dev
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
                } else if (key === 'checked') {
                    element.checked = !!val;
                } else if (key === 'type') {
                    element.type = val;
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

    const parsePrompts = (list) => {
        let result = [];
        if (Array.isArray(list)) {
            list.forEach(item => {
                if (typeof item === 'string') {
                    let parts = item.indexOf('=') > -1 ? item.split('=') : item.split('::');
                    if (parts.length >= 2) {
                        result.push({name: parts[0].trim(), template: item.substring(item.indexOf('=') + 1).trim()});
                    }
                } else if (typeof item === 'object') {
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
            autoCopy: GM_getValue('ds_auto_copy', false), // NEW: Auto copy setting, default false
            isDocked: GM_getValue('ds_is_docked', false),
            pushMode: GM_getValue('ds_push_mode', false),
            customPrompts: parsePrompts(GM_getValue('ds_custom_prompts', DEFAULT_PROMPTS)),
            disabledSites: GM_getValue('ds_disabled_sites', []),
            fabPos: GM_getValue('ds_fab_pos', { side: 'right', top: '50%' }),
            showFab: GM_getValue('ds_show_fab', true)
        },
        runtime: {
            activeTab: 'highlight',
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
            isDraggingFab: false,
            fabDragStartY: 0, fabDragStartX: 0,
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
            isSwitchingContext: false
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

    const DOM = { sidebar: null, popup: null, highlightContent: null, fab: null };

    // ==================== 2. 样式定义 ====================
    function injectStyles() {
        const css = `:root{--ds-bg:#202328;--ds-text:#c0c4c9;--ds-msg-bg:#25282e;--ds-border:#3a3f47;--ds-user-bg:#c0c4c9;--ds-user-text:#1a1d21;--ds-header-bg:#2b3038;--ds-accent:#3a7bd5;--ds-highlight-bg:#8B0000;--ds-highlight-text:#ffffff;--ds-menu-bg:#202328;--ds-menu-active-bg:#353b45;--ds-tab-inactive-bg:#2a2f36;--ds-tab-active-bg:#4a5059;--ds-tab-inactive-text:#888;--ds-popup-bg:#202328;--ds-popup-border:#444;--ds-hover-bg:rgba(255,255,255,0.06);--ds-continue-color:#6db3f2;--ds-slider-off:#444;--ds-slider-on:#3a7bd5;--ds-modal-bg:rgba(32,35,40,0.98);--ds-scrollbar-thumb:#4a5059}.ds-scrollable::-webkit-scrollbar,#ds-chat-log::-webkit-scrollbar,#ds-highlight-log::-webkit-scrollbar,#ds-input::-webkit-scrollbar,#ds-popup-left-content::-webkit-scrollbar,#ds-popup-right-content::-webkit-scrollbar,.ds-docked-scroll::-webkit-scrollbar{width:6px;height:6px}.ds-scrollable::-webkit-scrollbar-thumb,#ds-chat-log::-webkit-scrollbar-thumb,#ds-highlight-log::-webkit-scrollbar-thumb,#ds-input::-webkit-scrollbar-thumb,#ds-popup-left-content::-webkit-scrollbar-thumb,#ds-popup-right-content::-webkit-scrollbar-thumb,.ds-docked-scroll::-webkit-scrollbar-thumb{background:var(--ds-scrollbar-thumb);border-radius:3px}.ds-scrollable::-webkit-scrollbar-track,#ds-chat-log::-webkit-scrollbar-track,#ds-highlight-log::-webkit-scrollbar-track,#ds-input::-webkit-scrollbar-track,#ds-popup-left-content::-webkit-scrollbar-track,#ds-popup-right-content::-webkit-scrollbar-track,.ds-docked-scroll::-webkit-scrollbar-track{background:0 0}

        #ds-sidebar{position:fixed;top:0;width:${DS_CONFIG.settings.sidebarWidth}px;height:100vh;background:var(--ds-bg)!important;z-index:2147483647;transition:right .3s cubic-bezier(.4,0,.2,1),left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:row;color:var(--ds-text)!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box!important;padding:0!important;box-shadow:0 0 20px rgba(0,0,0,.4)}

        #ds-vertical-toolbar{width:36px;background:var(--ds-header-bg);border-left:1px solid var(--ds-border);border-right:1px solid var(--ds-border);display:flex;flex-direction:column;align-items:center;padding-top:10px;gap:12px;z-index:10;flex-shrink:0}
        .ds-v-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;color:var(--ds-text);opacity:0.7;font-size:16px;transition:all .2s;user-select:none}
        .ds-v-icon:hover{opacity:1;background:var(--ds-hover-bg);color:#fff}
        .ds-v-icon.active{color:var(--ds-accent);opacity:1}

        #ds-main-panel{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative}

        #ds-resizer{position:absolute;width:10px;height:100%;z-index:2147483648;background:transparent;cursor:ew-resize;transition:background .2s}#ds-resizer:hover{background:rgba(58,123,213,.1)}

        #ds-tab-header{height:42px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--ds-border);background:var(--ds-bg);padding:0 8px;flex-shrink:0}
        #ds-tabs-wrapper{display:flex;gap:2px;align-items:center;height:100%;z-index:1}.ds-tab{width:32px;height:28px;cursor:pointer;font-size:15px;border-radius:6px;transition:background .2s,color .2s;color:var(--ds-tab-inactive-text);user-select:none;display:flex;align-items:center;justify-content:center;background:transparent!important;border:1px solid transparent!important}.ds-tab:hover{color:#eee;background:var(--ds-hover-bg)!important}.ds-tab.active{background:var(--ds-tab-active-bg)!important;color:#fff!important;font-weight:700;border:1px solid #555!important;box-shadow:0 1px 2px rgba(0,0,0,.2)}

        #ds-tab-content{flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative}.tab-panel{display:none;flex-direction:column;height:100%;width:100%;overflow:hidden}.tab-panel.active{display:flex}#ds-ai-content{flex:1}#ds-chat-log{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:15px;margin:0;scroll-behavior:smooth}.ds-msg{padding:12px 16px;border-radius:8px;font-size:14.5px;line-height:1.6;max-width:94%;word-wrap:break-word}.user-msg{align-self:flex-end;background:var(--ds-user-bg)!important;color:var(--ds-user-text)!important;border-top-right-radius:2px}.ai-msg{align-self:flex-start;background:var(--ds-msg-bg)!important;color:var(--ds-text)!important;border:1px solid var(--ds-border);border-top-left-radius:2px;white-space:pre-wrap}.ds-continue-text{display:block;margin-top:12px;color:var(--ds-accent);font-weight:700;cursor:pointer;text-decoration:none!important;transition:all .2s;font-size:14px;padding:4px 0;opacity:.9;letter-spacing:.5px}.ds-continue-text:hover{opacity:1;filter:brightness(1.3)}.ds-instruction-text{color:var(--ds-text);font-weight:700;font-size:13px;margin-bottom:5px}.ds-instruction-highlight{color:#FFD700!important;font-weight:700}.highlight-word{color:#1E90FF!important;font-weight:700!important;text-decoration:none!important;background:rgba(30,144,255,.1);padding:0 2px;border-radius:2px}#ds-fn-bar{padding:8px 10px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid var(--ds-border);background:var(--ds-bg);flex-shrink:0;max-height:120px;overflow-y:auto}.fn-btn{flex:1;min-width:60px;padding:6px 8px;text-align:center;border-radius:4px;cursor:pointer;font-size:12px;color:var(--ds-text)!important;background:var(--ds-menu-active-bg);border:1px solid var(--ds-border);transition:all .2s;white-space:nowrap;display:flex;align-items:center;justify-content:center}.fn-btn:hover{background:var(--ds-hover-bg);border-color:#666}.fn-btn:active{transform:scale(.98)}.custom-prompt-btn{flex:0 1 auto!important}#ds-input-area{padding:10px 10px 15px;background:var(--ds-bg);flex-shrink:0;box-sizing:border-box!important;width:100%;border-top:1px solid var(--ds-border)}#ds-input-wrapper{display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box}#ds-input{width:100%;height:96px!important;border-radius:6px;border:1px solid var(--ds-border);padding:8px;outline:0;box-sizing:border-box;background:var(--ds-msg-bg)!important;color:rgba(255,255,255,0.08)!important;font-family:inherit;resize:none;font-size:14px;line-height:1.5;margin:0;overflow-y:auto;transition:color .2s ease,border-color .2s ease}#ds-input:focus{border-color:var(--ds-accent);color:var(--ds-text)!important}#ds-send-row{display:flex;justify-content:space-between;align-items:center;margin-top:4px}.ds-action-btn{width:80px;padding:6px 0;border:0;border-radius:12px;background:var(--ds-accent)!important;color:#fff!important;cursor:pointer;font-size:13px;font-weight:700;transition:opacity .2s ease,transform .1s;text-align:center}.ds-action-btn:hover{opacity:.9}.ds-action-btn:active{transform:scale(.96)}

        #ds-config-panel,#ds-help-panel{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--ds-bg);z-index:1001;padding:20px;box-sizing:border-box;display:none;flex-direction:column;overflow-y:auto}.cfg-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;font-size:14px}#cfg-api-key{width:100%;margin-top:5px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-size:13px}.ds-cfg-textarea{width:100%;height:120px;padding:8px;border-radius:4px;border:1px solid var(--ds-border);background:var(--ds-msg-bg);color:var(--ds-text);font-family:monospace;font-size:12px;resize:vertical;margin-top:5px;white-space:pre-wrap;overflow-x:hidden;word-wrap:break-word}.ds-panel-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ds-border);padding-bottom:10px;margin-bottom:20px}.ds-panel-title{font-size:18px;font-weight:700;color:var(--ds-accent)}.ds-panel-top-btn{padding:4px 12px;background:var(--ds-accent);color:#fff;border-radius:4px;font-size:12px;cursor:pointer;border:none}.ds-panel-top-btn:hover{opacity:0.9}.ds-help-item{margin-bottom:15px;display:flex;flex-direction:column;gap:5px}.ds-help-key{font-weight:700;color:var(--ds-text);font-family:monospace;background:var(--ds-msg-bg);padding:2px 6px;border-radius:4px;display:inline-block;width:fit-content}.ds-help-desc{font-size:13px;color:var(--ds-text);opacity:.8;line-height:1.4;white-space:pre-wrap}.ds-primary-btn{width:100%;padding:8px;background:var(--ds-accent);color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:14px;transition:opacity .2s;text-align:center}.ds-primary-btn:hover{opacity:.9}#ds-highlight-content{flex:1}#ds-highlight-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:0;margin:0}.${DS_CONFIG.consts.HIGHLIGHT_CLASS}{background-color:var(--ds-highlight-bg)!important;color:var(--ds-highlight-text)!important;padding:0 2px!important;border-radius:2px;cursor:pointer;display:inline}.web-inline-trans{color:#1E90FF!important;font-size:.95em!important;font-weight:400!important;margin-left:0!important;display:block!important;background:0 0!important;box-shadow:none!important;border:0!important;padding:4px 0 8px!important}.web-inline-trans::before{content:""}.ds-inline-loading{animation:pulse 1.5s infinite}.ds-full-page-trans{color:#1E90FF!important;font-size:14px!important;font-weight:400!important;display:block!important;margin-top:4px!important;padding:2px 0 6px!important;line-height:1.5!important}.web-menu-item{display:flex!important;flex-direction:column!important;align-items:flex-start!important;padding:8px 12px!important;margin:0!important;background:var(--ds-menu-bg)!important;border-radius:0!important;cursor:default!important;transition:background-color .1s ease!important;border-bottom:1px solid rgba(255,255,255,.05)}.web-menu-item:hover{background:#353b45!important}.web-menu-header{display:flex;justify-content:flex-start;width:100%;align-items:baseline;gap:8px}.web-menu-word{font-weight:700!important;color:#1E90FF!important;font-size:15px!important;cursor:pointer!important}.web-menu-word:hover{text-decoration:none!important;color:var(--ds-accent)!important}.web-menu-ipa{font-family:"Lucida Sans Unicode","Arial Unicode MS",sans-serif;color:#777!important;font-size:13px!important}.web-menu-trans{display:block!important;margin-top:2px!important;color:#aaa!important;opacity:1;font-size:13px!important;line-height:1.4!important;white-space:pre-wrap!important;word-break:break-all!important;width:100%!important}#ds-confirm-modal{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);backdrop-filter:blur(2px);z-index:2000;display:none;align-items:center;justify-content:center;animation:fadeIn .2s ease}.ds-confirm-box{background:var(--ds-modal-bg);padding:25px 20px;border-radius:12px;width:75%;text-align:center;border:1px solid var(--ds-border);box-shadow:0 10px 30px rgba(0,0,0,.5);color:var(--ds-text)}.ds-confirm-text{font-size:15px;margin-bottom:20px;font-weight:500}.ds-confirm-btns{display:flex;gap:12px;justify-content:center}.ds-btn{padding:8px 20px;border-radius:6px;border:0;cursor:pointer;font-size:14px;font-weight:700;transition:transform .1s}.ds-btn:active{transform:scale(.95)}.ds-btn-yes{background:#ff3b30;color:#fff}.ds-btn-no{background:var(--ds-msg-bg);color:var(--ds-text);border:1px solid var(--ds-border)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}#ds-popup{position:fixed;background:var(--ds-popup-bg);color:var(--ds-text);border:1px solid var(--ds-popup-border);border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.6);z-index:2147483650;display:none;flex-direction:column;min-width:400px;min-height:250px;max-width:90vw;max-height:80vh}.ds-resize-handle{position:absolute;z-index:100;opacity:0}.ds-resize-handle:hover{background:rgba(30,144,255,.2);opacity:1}.ds-rh-n{top:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-s{bottom:0;left:10px;right:10px;height:5px;cursor:ns-resize}.ds-rh-w{left:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-e{right:0;top:10px;bottom:10px;width:5px;cursor:ew-resize}.ds-rh-nw{top:0;left:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}.ds-rh-ne{top:0;right:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-sw{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize;z-index:101}.ds-rh-se{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize;z-index:101}#ds-popup-header-bar{height:36px;width:100%;cursor:move;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;gap:6px;background:var(--ds-header-bg);border-bottom:1px solid var(--ds-border)}.ds-popup-icon{cursor:pointer;font-size:15px;opacity:.6;transition:opacity .2s;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--ds-text)}.ds-popup-icon:hover{opacity:1;background:var(--ds-hover-bg)}#ds-popup-close-float{font-size:16px}#ds-popup-body{display:flex;flex:1;overflow:hidden;position:relative;padding:0;width:100%;height:100%;cursor:default}.ds-split-view{width:100%;height:100%;display:flex}.ds-split-left{flex:1;border-right:1px solid var(--ds-border);padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}.ds-split-right{flex:1;padding:16px;overflow-y:auto;background:var(--ds-popup-bg)}#ds-docked-panel{flex-direction:column;background:var(--ds-bg)}.ds-docked-toolbar{padding:8px;border-bottom:1px solid var(--ds-border);display:flex;justify-content:center;align-items:center;background:#2f343c}.ds-docked-title{font-size:13px;font-weight:700;color:#aaa}#ds-undock-btn{padding:4px 12px;border:1px solid var(--ds-border);background:var(--ds-menu-bg);color:var(--ds-text);border-radius:4px;font-size:12px;cursor:pointer}#ds-undock-btn:hover{background:var(--ds-hover-bg);border-color:#666}.ds-docked-content{flex:1;overflow-y:auto;display:flex;flex-direction:column}.ds-docked-section{padding:15px;border-bottom:1px solid var(--ds-border)}.ds-docked-scroll{overflow-y:auto;max-height:50%}.ds-popup-title{font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ds-accent);opacity:.9;letter-spacing:.5px;display:flex;align-items:center;gap:6px}.ds-popup-text{font-size:14px;line-height:1.6;white-space:pre-wrap;color:#ccc}.ds-popup-loading{color:#888;font-style:italic;animation:pulse 1.5s infinite}@keyframes pulse{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}.ds-target-italic{color:#1E90FF!important;font-weight:700;font-style:italic}.ds-head-row{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;flex-wrap:wrap}.ds-headword{color:#1E90FF!important;font-weight:900;font-size:18px!important;display:inline-block}.ds-dict-grid{display:grid;grid-template-columns:45px 1fr;gap:4px 0;align-items:flex-start}.ds-pos-label{text-align:right;color:#777;font-style:italic;font-weight:700;font-size:12px;user-select:none;white-space:nowrap;overflow:visible;padding-right:8px;margin-top:3px}.ds-def-split{cursor:pointer;border-bottom:1px dashed transparent;transition:all .1s}.ds-def-split:hover{color:var(--ds-accent)}#ds-fab{position:fixed;width:25px;height:25px;background:var(--ds-accent);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;user-select:none;z-index:2147483648;box-shadow:0 2px 6px rgba(0,0,0,0.3);transition:transform .1s}#ds-fab:active{transform:scale(.9)}.ds-fab-left{left:0;border-radius:0 50% 50% 0}.ds-fab-right{right:0;border-radius:50% 0 0 50%}.ds-is-streaming .ds-def-split{pointer-events:none!important;cursor:wait}.ds-is-streaming{cursor:wait}#ds-input::placeholder{color:rgba(255,255,255,0.15)!important;opacity:1}#ds-tab-docked{width:58px!important;justify-content:space-evenly!important;padding:0 2px!important}.ds-dock-lock{cursor:default}.ds-dock-restore{cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s;border-radius:4px;padding:0 4px;width:20px;text-align:center}.ds-dock-restore:hover{opacity:1;background:var(--ds-hover-bg)}`;
        const switchCss = `.ds-switch{position:relative;display:inline-block;width:36px;height:20px}.ds-switch input{opacity:0;width:0;height:0}.ds-slider-btn{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--ds-slider-off);transition:.4s;border-radius:34px}.ds-slider-btn:before{position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.ds-slider-btn{background-color:var(--ds-slider-on)}input:checked+.ds-slider-btn:before{transform:translateX(16px)}`;
        GM_addStyle(css + switchCss);
    }

// NEW: Update page layout based on push mode
    function updatePageLayout() {
        const sb = document.getElementById('ds-sidebar');
        // 如果侧边栏不存在、隐藏或未开启挤压模式，清除所有样式
        if (!sb || !isSidebarVisible() || !DS_CONFIG.settings.pushMode) {
            document.body.style.marginLeft = '';
            document.body.style.marginRight = '';
            document.body.style.paddingLeft = ''; // 清除 padding
            document.body.style.paddingRight = ''; // 清除 padding
            document.body.style.overflowX = '';
            document.body.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
            return;
        }

        const width = parseInt(DS_CONFIG.settings.sidebarWidth);
        const side = DS_CONFIG.settings.sidebarSide;

        // 这里设置你想要的文字间距 (12px)
        const gap = 0;

        // 计算总共需要的挤压距离 (侧边栏宽度 + 间距)
        const totalDistance = width + gap;

        // 强制隐藏水平滚动条
        document.body.style.overflowX = 'hidden';

        // 确保 box-sizing 正确，防止宽度溢出
        document.body.style.boxSizing = 'border-box';
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';

        // 先清除 Margin (防止旧样式残留)
        document.body.style.marginLeft = '';
        document.body.style.marginRight = '';

        if (side === 'right') {
            // 使用 Padding 而不是 Margin
            // 侧边栏覆盖住前 width 像素，剩下的 gap 像素显示为网页背景
            document.body.style.paddingRight = totalDistance + 'px';
            document.body.style.paddingLeft = '';
        } else {
            document.body.style.paddingLeft = totalDistance + 'px';
            document.body.style.paddingRight = '';
        }
    }
    function toggleSidebarPushMode() {
        DS_CONFIG.settings.pushMode = !DS_CONFIG.settings.pushMode;
        GM_setValue('ds_push_mode', DS_CONFIG.settings.pushMode);

        const btn = document.getElementById('ds-push-toggle');
        if (btn) {
            if (DS_CONFIG.settings.pushMode) btn.classList.add('active');
            else btn.classList.remove('active');
        }
        updatePageLayout();
    }

    function updateSidebarPosition(animate = true) {
        const sb = document.getElementById('ds-sidebar');
        const resizer = document.getElementById('ds-resizer');
        const toggleBtn = document.getElementById('ds-side-toggle');
        const verticalToolbar = document.getElementById('ds-vertical-toolbar');
        const mainPanel = document.getElementById('ds-main-panel');

        if (!sb || !resizer) return;
        if (!animate) { sb.style.transition = 'none'; } else { sb.style.transition = 'right 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1)'; }

        sb.style.left = ''; sb.style.right = '';
        sb.style.borderLeft = ''; sb.style.borderRight = '';
        resizer.style.left = ''; resizer.style.right = '';

        if (DS_CONFIG.settings.sidebarSide === 'right') {
            // Sidebar on Right
            sb.style.right = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderLeft = '1px solid #3a3f47';
            resizer.style.left = '0';
            if (toggleBtn) { toggleBtn.innerText = '👈🏻'; toggleBtn.title = "切换至左侧"; }

            // Reorder for Right Side: Content | Toolbar (screen edge)
            if (verticalToolbar) { verticalToolbar.style.order = '2'; verticalToolbar.style.borderLeft = '1px solid var(--ds-border)'; verticalToolbar.style.borderRight = 'none'; }
            if (mainPanel) { mainPanel.style.order = '1'; }

        } else {
            // Sidebar on Left
            sb.style.left = isSidebarVisible() ? '0' : '-1200px';
            sb.style.borderRight = '1px solid #3a3f47';
            resizer.style.right = '0';
            if (toggleBtn) { toggleBtn.innerText = '👉🏻'; toggleBtn.title = "切换至右侧"; }

            // Reorder for Left Side: Toolbar (screen edge) | Content
            if (verticalToolbar) { verticalToolbar.style.order = '0'; verticalToolbar.style.borderRight = '1px solid var(--ds-border)'; verticalToolbar.style.borderLeft = 'none'; }
            if (mainPanel) { mainPanel.style.order = '1'; }
        }
        updatePageLayout();
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
                if (isFirstChunk) { targetElement.textContent = ""; targetElement.classList.remove('ds-inline-loading'); isFirstChunk = false; }
                targetElement.textContent = fullText;
            },
            onFinish: (fullText) => { if (fullText) DS_CONFIG.runtime.translationCache[text] = fullText; },
            onError: (e) => { if (e.name !== 'AbortError') { targetElement.textContent = "DeepSeek Error: " + e.message; targetElement.classList.remove('ds-inline-loading'); } }
        });
    }

    async function streamToElement(sysPrompt, userPrompt, targetElement, cacheCategory, cacheKey, highlightWord = null, mode = 'normal', signal = null) {
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
            },
            onError: (e) => {
                targetElement.classList.remove('ds-is-streaming');
                if(e.name === 'AbortError') {
                    if (!DS_CONFIG.runtime.isSwitchingContext && !isStreamFinished) {
                        let sideKey = null;
                        if (targetElement.closest('#ds-popup-left-content') || targetElement.closest('#ds-docked-left-content')) sideKey = 'left';
                        if (targetElement.closest('#ds-popup-right-content') || targetElement.closest('#ds-docked-right-content')) sideKey = 'right';

                        if (sideKey && !targetElement.querySelector('.ds-continue-text')) {
                             const wrapper = UI.el('div', { className: 'ds-continue-text', 'data-side': sideKey }, '🖌️ 继续');
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
            let display = mode==="dict"?`📖 词典: ${targetWord}`:mode==="explain"?`🔍 沉浸: ${targetWord}`:mode==="summary"?"🧠 全文总结":mode==="custom"?"✨ "+query.substring(0,40):query.substring(0,40);
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
                    }, '🖌️ 继续');
                    aiMsg.appendChild(continueElem);
                    log.scrollTop = log.scrollHeight;
                } else { aiMsg.appendChild(document.createTextNode("\n[请求失败: " + e.message + "]")); }
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
            let ipa = "", definition = "..."; const cachedContent = cache[word];
            let defEl;

            if (cachedContent && cachedContent !== "..." && cachedContent !== "waiting") {
                const match = cachedContent.match(/^(\[.*?\])\s*(.*)/s);
                if (match) { ipa = match[1]; definition = match[2]; } else { definition = cachedContent; }
                defEl = UI.el('div', { className: 'web-menu-trans' }, definition);
            } else {
                defEl = UI.el('div', { className: 'web-menu-trans' }, [
                    UI.el('span', { className: 'ds-popup-loading', style: { fontSize: '12px' } }, 'DeepSeek Thinking...')
                ]);
            }

            const item = UI.el('div', { className: 'web-menu-item', 'data-word': word }, [
                UI.el('div', { className: 'web-menu-header' }, [
                    UI.el('span', { className: 'web-menu-word' }, word),
                    UI.el('span', { className: 'web-menu-ipa' }, ipa)
                ]),
                defEl
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
    };

    const switchTab = (tabName) => {
        if (tabName !== 'ai' && tabName !== 'highlight' && tabName !== 'docked') return;
        DS_CONFIG.runtime.activeTab = tabName;
        document.querySelectorAll('.ds-tab').forEach(tab => { tab.classList.remove('active'); if (tab.dataset.tab === tabName) tab.classList.add('active'); });
        document.querySelectorAll('.tab-panel').forEach(panel => { panel.classList.remove('active'); if (panel.dataset.panel === tabName) panel.classList.add('active'); });
        if (tabName === 'highlight') { refreshHighlightMenu(); applySavedHighlights(); }
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
                showSidebar();
                switchTab('docked');
            }
        } else {
            if (dockedTab) dockedTab.style.display = 'none';
            if (DS_CONFIG.runtime.activeTab === 'docked') switchTab('highlight');
        }
    }

    function showSmartPopup(text, targetHighlight, context = "", isSelection = false) {
        DS_CONFIG.runtime.isSwitchingContext = true;
        if (DS_CONFIG.runtime.popupAbortCtrl) DS_CONFIG.runtime.popupAbortCtrl.abort();
        setTimeout(() => { DS_CONFIG.runtime.isSwitchingContext = false; }, 0);

        DS_CONFIG.runtime.popupAbortCtrl = new AbortController();
        const signal = DS_CONFIG.runtime.popupAbortCtrl.signal;

        const dictPrompt = isChinese(text) ? "你是一个专业的汉语词典接口。请严格按照词典格式输出，不要废话。" : "你是一个基于 ECDICT (Collins + Oxford) 数据库的词典接口。请严格按照以下 ECDICT 数据结构输出信息，不要提供例句。\n\n格式要求：\n单词原型\n/音标/\n词性. 中文释义\nExchange: ...\nTags: ...\n...";
        const dictKey = text;
        const contextKey = text + "_" + context.substring(0, 20);
        const contextPrompt = `你是一个语言专家。请分析"${text}"在以下句子中的用法：\n\n"${context}"\n\n请模仿以下风格进行解析：\n"在句子 '...' 中，'${text}' 是...词性...形式，与...构成...搭配，表示...。这里的固定搭配是...，意思是...。"`;

        let leftEl, rightEl;
        if (DS_CONFIG.settings.isDocked) {
            showSidebar();
            switchTab('docked');
            leftEl = document.querySelector('#ds-docked-left-content .ds-popup-text');
            rightEl = document.querySelector('#ds-docked-right-content .ds-popup-text');
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

            // Rebuild Popup Content securely
            UI.clear(DOM.popup);
            ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'].forEach(dir => {
                DOM.popup.appendChild(UI.el('div', { className: `ds-resize-handle ds-rh-${dir}`, 'data-dir': dir }));
            });

            const headerBar = UI.el('div', { id: 'ds-popup-header-bar' }, [
                UI.el('div', { id: 'ds-popup-lock', className: 'ds-popup-icon', title: '锁定并吸附到侧边栏' }, '🔓'),
                UI.el('div', { id: 'ds-popup-close-float', className: 'ds-popup-icon' }, '✖')
            ]);
            DOM.popup.appendChild(headerBar);

            const body = UI.el('div', { id: 'ds-popup-body' }, [
                UI.el('div', { className: 'ds-split-view' }, [
                    UI.el('div', { className: 'ds-split-left', id: 'ds-popup-left-content' }, [
                          UI.el('div', { className: 'ds-popup-title' }, '🔤 词典解析'),
                          UI.el('div', { className: 'ds-popup-text' })
                    ]),
                    UI.el('div', { className: 'ds-split-right', id: 'ds-popup-right-content' }, [
                          UI.el('div', { className: 'ds-popup-title' }, '🔍 文中解析'),
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
                else if (icon.id === 'ds-popup-lock') { toggleDockingMode(true); }
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

    function buildUI() {
        const isTopWindow = (window.self === window.top);
        if (!isTopWindow) return;
        if (document.getElementById('ds-sidebar')) return;

        // Container (Flex Row)
        const container = UI.el('div', { id: 'ds-sidebar' });
        const promptString = DS_CONFIG.settings.customPrompts.map(p => `${p.name}=${p.template}`).join('\n');
        const disabledSitesString = DS_CONFIG.settings.disabledSites.join('\n');

        // ============ 1. Vertical Toolbar ============
        // Order: Close(✖) -> Switch(👈🏻) -> Trans(🌐) -> [Push] -> Help(💡) -> Clear(🗑️) -> Settings(⚙️)
        const verticalToolbar = UI.el('div', { id: 'ds-vertical-toolbar' }, [
            UI.el('div', { id: 'ds-close', className: 'ds-v-icon', title: '关闭' }, '✖'),
            UI.el('div', { id: 'ds-side-toggle', className: 'ds-v-icon', title: '切换侧边栏方向' }, '👈🏻'),
            UI.el('div', { id: 'ds-full-page-trans-btn', className: 'ds-v-icon', title: '全文翻译开关' }, '🌐'),
            UI.el('div', { id: 'ds-push-toggle', className: `ds-v-icon ${DS_CONFIG.settings.pushMode ? 'active' : ''}`, title: '挤压模式：是否将网页内容挤开' }, '↔️'), // NEW BUTTON
            UI.el('div', { id: 'ds-help-btn', className: 'ds-v-icon', title: '使用说明' }, '💡'),
            UI.el('div', { id: 'ds-clear-cache', className: 'ds-v-icon', title: '清除缓存' }, '🗑️'),
            UI.el('div', { id: 'ds-cfg-toggle', className: 'ds-v-icon', title: '设置' }, '⚙️'),
        ]);

        // ============ 2. Main Content Panel (New Wrapper) ============
        const mainPanel = UI.el('div', { id: 'ds-main-panel' });

        // Header for Tabs (Simplified)
        const tabHeader = UI.el('div', { id: 'ds-tab-header' }, [
            UI.el('div', { id: 'ds-tabs-wrapper' }, [
                UI.el('div', { className: 'ds-tab active', 'data-tab': 'highlight', title: '生词本' }, '📩'),
                UI.el('div', { className: 'ds-tab', 'data-tab': 'ai', title: 'AI 助手' }, '💬'),
                UI.el('div', { className: 'ds-tab', id: 'ds-tab-docked', 'data-tab': 'docked', title: '固定模式', style: { display: 'none' } }, [
                    UI.el('span', { className: 'ds-dock-lock', title: '已锁定' }, '🔒'),
                    UI.el('span', { className: 'ds-dock-restore', title: '恢复浮窗' }, '✖')
                ])
            ])
        ]);

        // Confirm Modal (Inside main panel or sidebar, keeping absolute to cover main panel)
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
                UI.el('span', { style: { fontWeight: 'bold' } }, '显示悬浮球 (🏠):'),
                UI.el('label', { className: 'ds-switch' }, [
                    UI.el('input', { type: 'checkbox', id: 'cfg-show-fab', checked: DS_CONFIG.settings.showFab }),
                    UI.el('span', { className: 'ds-slider-btn' })
                ])
            ]),
            // NEW: Auto Copy Switch
            UI.el('div', { className: 'cfg-row' }, [
                UI.el('span', { style: { fontWeight: 'bold' } }, '高亮/查询时自动复制:'),
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
            createHelpItem('Alt + Alt', '快速双击，调出浮窗对鼠标所指文本查词。'),
            createHelpItem('Alt', '关闭浮窗。'),
            createHelpItem('Alt + 1（可在系统中自定义快捷键）', '对鼠标所指文本切换高亮状态。'),
            createHelpItem('Alt + 2（可在系统中自定义快捷键）', '开启/关闭侧边栏。'),
            createHelpItem('Alt + 左键', '可对鼠标所指文本段落进行翻译。'),
            createHelpItem('🔒 锁定功能', '在浮窗点击🔓后，浮窗将被锁定在侧边栏。\n需再次点击侧边栏顶部🔒标签旁的“✖”才可恢复。')
        ]);

        // Tab Content
        const tabContent = UI.el('div', { id: 'ds-tab-content' }, [
            UI.el('div', { className: 'tab-panel active', 'data-panel': 'highlight', id: 'ds-highlight-content' }),
            UI.el('div', { className: 'tab-panel', 'data-panel': 'ai', id: 'ds-ai-content' }, [
                UI.el('div', { id: 'ds-chat-log' })
            ]),
            UI.el('div', { className: 'tab-panel', 'data-panel': 'docked', id: 'ds-docked-panel' }, [
                UI.el('div', { className: 'ds-docked-content' }, [
                    UI.el('div', { className: 'ds-docked-section ds-docked-scroll', id: 'ds-docked-left-content', style: { flex: 1, borderBottom: '1px solid #444' } }, [
                        UI.el('div', { className: 'ds-popup-title' }, '🔤 词典解析'),
                        UI.el('div', { className: 'ds-popup-text' })
                    ]),
                    UI.el('div', { className: 'ds-docked-section ds-docked-scroll', id: 'ds-docked-right-content', style: { flex: 1 } }, [
                        UI.el('div', { className: 'ds-popup-title' }, '🔍 文中解析'),
                        UI.el('div', { className: 'ds-popup-text' })
                    ])
                ])
            ])
        ]);

        // Input Area
        const inputArea = UI.el('div', { id: 'ds-input-area' }, [
            UI.el('div', { id: 'ds-input-wrapper' }, [
                UI.el('textarea', { id: 'ds-input', placeholder: 'DeepSeek AI 等待您的指令...' }),
                UI.el('div', { id: 'ds-send-row' }, [
                    UI.el('button', { id: 'ds-summary-btn', className: 'ds-action-btn' }, '🧠 总结'),
                    UI.el('button', { id: 'ds-send', className: 'ds-action-btn' }, '🚀 发送')
                ])
            ])
        ]);

        // Assemble Main Panel
        mainPanel.appendChild(tabHeader);
        mainPanel.appendChild(confirmModal);
        mainPanel.appendChild(configPanel);
        mainPanel.appendChild(helpPanel);
        mainPanel.appendChild(tabContent);
        mainPanel.appendChild(UI.el('div', { id: 'ds-fn-bar' }));
        mainPanel.appendChild(inputArea);

        // Assemble Sidebar
        container.appendChild(UI.el('div', { id: 'ds-resizer' }));
        container.appendChild(verticalToolbar);
        container.appendChild(mainPanel);

        // Popup & FAB
        const popupEl = UI.el('div', { id: 'ds-popup', style: { width: DS_CONFIG.settings.popupWidth, height: DS_CONFIG.settings.popupHeight } });
        popupEl.addEventListener('mouseup', () => {
            GM_setValue('ds_popup_width', popupEl.style.width);
            GM_setValue('ds_popup_height', popupEl.style.height);
        });

        const fab = UI.el('div', { id: 'ds-fab', style: { top: DS_CONFIG.settings.fabPos.top } }, '🏠');
        if (DS_CONFIG.settings.fabPos.side === 'right') {
            fab.style.right = '0px'; fab.classList.add('ds-fab-right');
        } else {
            fab.style.left = '0px'; fab.classList.add('ds-fab-left');
        }
        if (!DS_CONFIG.settings.showFab) { fab.style.display = 'none'; }

        document.body.appendChild(container);
        document.body.appendChild(popupEl);
        document.body.appendChild(fab);

        DOM.sidebar = container;
        DOM.popup = popupEl;
        DOM.highlightContent = document.getElementById('ds-highlight-content');
        DOM.fab = fab;

        const fabSwitch = document.getElementById('cfg-show-fab');
        if (fabSwitch) {
            fabSwitch.addEventListener('change', (e) => {
                 const isChecked = e.target.checked;
                 DS_CONFIG.settings.showFab = isChecked;
                 GM_setValue('ds_show_fab', isChecked);
                 if(DOM.fab) DOM.fab.style.display = isChecked ? 'flex' : 'none';
            });
        }

        // NEW: Auto Copy Switch Event
        const autoCopySwitch = document.getElementById('cfg-auto-copy');
        if (autoCopySwitch) {
            autoCopySwitch.addEventListener('change', (e) => {
                 const isChecked = e.target.checked;
                 DS_CONFIG.settings.autoCopy = isChecked;
                 GM_setValue('ds_auto_copy', isChecked);
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
        DS_CONFIG.settings.customPrompts.forEach(item => {
            if (!item.name || !item.template) return;
            const btn = UI.el('div', {
                className: 'fn-btn custom-prompt-btn',
                title: item.template,
                onclick: () => {
                    const input = document.getElementById('ds-input');
                    if (input) {
                        const val = input.value.trim();
                        if (!val) { return; }
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
        if (DOM.fab) {
            DOM.fab.addEventListener('mousedown', (e) => {
                e.preventDefault(); e.stopPropagation();
                DS_CONFIG.runtime.isDraggingFab = true;
                DS_CONFIG.runtime.fabDragStartY = e.clientY;
                DS_CONFIG.runtime.fabDragStartX = e.clientX;
            });
        }

        document.addEventListener('click', (e) => {
             if (e.target && e.target.classList.contains('ds-def-split')) {
                 const defText = e.target.dataset.def;
                 const word = DS_CONFIG.runtime.lastPopupParams.left?.hw || "";
                 if(word) window.updateRightPanelExamples(defText, word);
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

        document.addEventListener('contextmenu', (e) => {
            stopAllStreams();
        });

        document.addEventListener('mousemove', e => {
            DS_CONFIG.runtime.lastX = e.clientX; DS_CONFIG.runtime.lastY = e.clientY;
            const isTopWindow = (window.self === window.top);
            if (isTopWindow) {
                if (DS_CONFIG.runtime.isDraggingFab && DOM.fab) {
                    let newTop = e.clientY - 12;
                    if (newTop < 0) newTop = 0;
                    if (newTop > window.innerHeight - 25) newTop = window.innerHeight - 25;
                    DOM.fab.style.top = newTop + 'px';
                    let newLeft = e.clientX - 12;
                    DOM.fab.style.left = newLeft + 'px';
                    DOM.fab.style.right = '';
                    DOM.fab.classList.remove('ds-fab-left', 'ds-fab-right');
                    return;
                }

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
                            updatePageLayout(); // Update push margin in real-time
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

            if (DS_CONFIG.runtime.isDraggingFab && DOM.fab) {
                DS_CONFIG.runtime.isDraggingFab = false;
                const movedY = Math.abs(e.clientY - DS_CONFIG.runtime.fabDragStartY);
                const movedX = Math.abs(e.clientX - DS_CONFIG.runtime.fabDragStartX);

                if (movedX < 5 && movedY < 5) {
                    const currentSide = DS_CONFIG.settings.fabPos.side;
                    DOM.fab.style.left = ''; DOM.fab.style.right = '';
                    if (currentSide === 'right') { DOM.fab.style.right = '0px'; DOM.fab.classList.add('ds-fab-right'); }
                    else { DOM.fab.style.left = '0px'; DOM.fab.classList.add('ds-fab-left'); }

                    if (isSidebarVisible()) { hideSidebar(); } else { showSidebar(); }
                } else {
                    const isRight = e.clientX > window.innerWidth / 2;
                    DOM.fab.style.left = ''; DOM.fab.style.right = '';
                    DOM.fab.classList.remove('ds-fab-left', 'ds-fab-right');

                    if (isRight) {
                        DOM.fab.style.right = '0px'; DOM.fab.classList.add('ds-fab-right'); DS_CONFIG.settings.fabPos.side = 'right';
                    } else {
                        DOM.fab.style.left = '0px'; DOM.fab.classList.add('ds-fab-left'); DS_CONFIG.settings.fabPos.side = 'left';
                    }
                    DS_CONFIG.settings.fabPos.top = DOM.fab.style.top;
                    GM_setValue('ds_fab_pos', DS_CONFIG.settings.fabPos);
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Alt') { DS_CONFIG.runtime.lastAltUpTime = 0; }

            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

            // Alt + 1: Toggle Highlight (Add/Remove)
            if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
                e.preventDefault();
                DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600;

                // 1. Check if hovering over existing highlight
                const el = document.elementFromPoint(DS_CONFIG.runtime.lastX, DS_CONFIG.runtime.lastY);
                const existingHighlight = el ? el.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`) : null;

                if (existingHighlight) {
                    removeHighlight(existingHighlight);
                } else {
                    const sel = window.getSelection(); let range = null;
                    if (sel.rangeCount && sel.toString().trim()) { range = sel.getRangeAt(0); }
                    else { const wordObj = getCurrentSentence(); if (wordObj) { range = document.createRange(); range.setStart(wordObj.node, wordObj.s); range.setEnd(wordObj.node, wordObj.e); } }

                    if (range) {
                        const text = range.toString().trim();
                        if (!range.commonAncestorContainer.parentElement.classList.contains(DS_CONFIG.consts.HIGHLIGHT_CLASS)) {
                            // CHECK SETTING
                            if (DS_CONFIG.settings.autoCopy) {
                                copyToClip(text);
                            }
                            const mark = document.createElement('mark'); mark.className = DS_CONFIG.consts.HIGHLIGHT_CLASS; mark.appendChild(range.extractContents()); range.insertNode(mark);
                            saveHighlights(); sel.removeAllRanges(); getDeepSeekVocabDef(text);
                        }
                    }
                }
            }

            // Alt + 2: Toggle Sidebar
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

                    if (now - DS_CONFIG.runtime.lastAltUpTime < 1000) {
                        const selText = window.getSelection().toString().trim();
                        if (selText.length > 0) {
                            // CHECK SETTING
                            if (DS_CONFIG.settings.autoCopy) {
                                copyToClip(selText);
                            }
                            let context = ""; try { context = window.getSelection().getRangeAt(0).commonAncestorContainer.parentElement.innerText; } catch(e){}

                            if (isSidebarVisible() && isTopWindow) {
                                const input = document.getElementById('ds-input');
                                if(input) input.value = selText;
                            }

                            showSmartPopup(selText, null, context, true);
                        }
                        else {
                            const wordObj = getCurrentSentence();
                            if (wordObj && wordObj.text) {
                                // CHECK SETTING
                                if (DS_CONFIG.settings.autoCopy) {
                                    copyToClip(wordObj.text);
                                }
                                const context = wordObj.node.parentElement ? wordObj.node.parentElement.innerText : wordObj.text;

                                if (isSidebarVisible() && isTopWindow) {
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
            DOM.sidebar.addEventListener('click', (e) => {
                const dockRestore = e.target.closest('.ds-dock-restore');
                if (dockRestore) {
                    e.stopPropagation();
                    toggleDockingMode(false);
                    return;
                }

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
                            el.style.transition = 'backgroundColor 0.2s';
                            el.style.backgroundColor = '#FFD700';
                            setTimeout(() => { el.style.backgroundColor = ''; }, 600);
                            break;
                        }
                    }
                    return;
                }

                const targetId = e.target.id || e.target.closest('.ds-v-icon')?.id || e.target.closest('.header-action')?.id || e.target.closest('button')?.id;
                if (!targetId) return;

                if (targetId === 'ds-help-btn') { const hp = document.getElementById('ds-help-panel'); if (hp) hp.style.display = hp.style.display === 'flex' ? 'none' : 'flex'; }
                else if (targetId === 'ds-help-close') { document.getElementById('ds-help-panel').style.display = 'none'; }
                else if (targetId === 'ds-full-page-trans-btn') { togglePageTranslation(); }
                else if (targetId === 'ds-clear-cache') { document.getElementById('ds-confirm-modal').style.display = 'flex'; }
                else if (targetId === 'ds-cfg-toggle') { const cp = document.getElementById('ds-config-panel'); if (cp) cp.style.display = cp.style.display === 'flex' ? 'none' : 'flex'; }
                else if (targetId === 'ds-close') { hideSidebar(); }
                else if (targetId === 'ds-side-toggle') { toggleSidebarSide(); }
                else if (targetId === 'ds-push-toggle') { toggleSidebarPushMode(); } // NEW CLICK HANDLER
                else if (targetId === 'save-api-key') {
                    const cfgApiKey = document.getElementById('cfg-api-key');
                    const cfgPrompts = document.getElementById('cfg-prompts');
                    const cfgDisabled = document.getElementById('cfg-disabled-sites');

                    if (!cfgApiKey) return;
                    DS_CONFIG.settings.apiKey = cfgApiKey.value;

                    const rawLines = cfgPrompts.value.split('\n'); DS_CONFIG.settings.customPrompts = [];
                    rawLines.forEach(line => {
                        if (line.includes('=')) { const parts = line.split('='); if (parts.length >= 2) { const name = parts[0].trim(); const template = line.substring(line.indexOf('=') + 1).trim(); if(name && template) DS_CONFIG.settings.customPrompts.push({name, template}); } }
                    });

                    if (cfgDisabled) {
                        const sites = cfgDisabled.value.split('\n').map(s => s.trim()).filter(s => s !== '');
                        DS_CONFIG.settings.disabledSites = sites;
                        GM_setValue('ds_disabled_sites', sites);
                    }

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
            if (e.target.closest('#ds-fab')) return;

            const inSidebar = DOM.sidebar && DOM.sidebar.contains(e.target); const inPopup = DOM.popup && DOM.popup.style.display !== 'none' && DOM.popup.contains(e.target);
            if (!inSidebar && !inPopup) { if (DOM.popup && DOM.popup.style.display !== 'none' && isTopWindow) { DOM.popup.style.display = 'none'; DS_CONFIG.runtime.currentPopupTrigger = null; clearAllInlineTranslations(); } }
            if (e.altKey) { DS_CONFIG.runtime.sidebarLockUntil = Date.now() + 600; }
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 2) return;
            const targetTrans = e.target.closest('.web-inline-trans, .ds-full-page-trans'); if (targetTrans) { e.preventDefault(); e.stopPropagation(); targetTrans.remove(); return; }
            const targetHighlight = e.target.closest(`.${DS_CONFIG.consts.HIGHLIGHT_CLASS}`); if (targetHighlight) { e.preventDefault(); e.stopPropagation(); removeHighlight(targetHighlight); return; }
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
                // CHECK SETTING
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
    }
    init();
})();