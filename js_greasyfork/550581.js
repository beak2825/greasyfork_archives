// ==UserScript==
// @name         Lyra Exporter Fetch
// @name:en      Lyra Exporter Fetch
// @namespace    userscript://lyra-conversation-exporter
// @version      7.5
// @description  Lyra's Exporter - AI对话导出器的配套脚本，专业的AI对话导出器 - 支持Claude、ChatGPT、Gemini、NotebookLM等多平台，轻松管理数百个对话窗口，导出完整时间线、多对话分支、附加图片、思考过程、附件、工具调用、Artifacts、Canvas。向 Amir Harati、Sxuan、AlexMercer 致谢
// @description:en The essential companion script for Lyra's Exporter, designed for unified management and export of your conversation histories across multiple platforms, including Claude, ChatGPT, Gemini, NotebookLM, and more. Acknowledgements to Amir Harati, Sxuan, and AlexMercer
// @homepage     https://github.com/Yalums/lyra-exporter/
// @supportURL   https://github.com/Yalums/lyra-exporter/issues
// @author       Yalums
// @match        https://claude.easychat.top/*
// @match        https://pro.easychat.top/*
// @match        https://claude.ai/*
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/app/*
// @match        https://notebooklm.google.com/*
// @match        https://aistudio.google.com/*
// @include      *://gemini.google.com/*
// @include      *://notebooklm.google.com/*
// @include      *://aistudio.google.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.js
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/550581/Lyra%20Exporter%20Fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/550581/Lyra%20Exporter%20Fetch.meta.js
// ==/UserScript==

    (function() {
        'use strict';
        if (window.lyraFetchInitialized) return;
        window.lyraFetchInitialized = true;

        const Config = {
            CONTROL_ID: 'lyra-controls',
            TOGGLE_ID: 'lyra-toggle-button',
            LANG_SWITCH_ID: 'lyra-lang-switch',
            TREE_SWITCH_ID: 'lyra-tree-mode-switch',
            IMAGE_SWITCH_ID: 'lyra-image-switch',
            CANVAS_SWITCH_ID: 'lyra-canvas-switch',
            WORKSPACE_TYPE_ID: 'lyra-workspace-type',
            MANUAL_ID_BTN: 'lyra-manual-id-btn',
            EXPORTER_URL: 'https://yalums.github.io/lyra-exporter/',
            EXPORTER_ORIGIN: 'https://yalums.github.io'
        };

        const State = {
            currentPlatform: (() => {
                const host = window.location.hostname;
                console.log('[Lyra] Detecting platform, hostname:', host);
                if (host.includes('claude.ai') || host.endsWith('easychat.top') || host.includes('.easychat.top')) {
                    console.log('[Lyra] Platform detected: claude');
                    return 'claude';
                }
                if (host.includes('chatgpt') || host.includes('openai')) {
                    console.log('[Lyra] Platform detected: chatgpt');
                    return 'chatgpt';
                }
                if (host.includes('gemini')) {
                    console.log('[Lyra] Platform detected: gemini');
                    return 'gemini';
                }
                if (host.includes('notebooklm')) {
                    console.log('[Lyra] Platform detected: notebooklm');
                    return 'notebooklm';
                }
                if (host.includes('aistudio')) {
                    console.log('[Lyra] Platform detected: aistudio');
                    return 'aistudio';
                }
                console.log('[Lyra] Platform detected: null (unknown)');
                return null;
            })(),
            isPanelCollapsed: localStorage.getItem('lyraExporterCollapsed') === 'true',
            includeImages: localStorage.getItem('lyraIncludeImages') === 'true',
            capturedUserId: localStorage.getItem('lyraClaudeUserId') || '',
            chatgptAccessToken: null,
            chatgptUserId: localStorage.getItem('lyraChatGPTUserId') || '',
            chatgptWorkspaceId: localStorage.getItem('lyraChatGPTWorkspaceId') || '',
            chatgptWorkspaceType: localStorage.getItem('lyraChatGPTWorkspaceType') || 'user',
            includeVersionTracking: localStorage.getItem('lyraIncludeVersionTracking') === 'true',
            geminiTracker: null,
            panelInjected: false
        };

        let collectedData = new Map();
        const LyraFlags = {
            hasRetryWithoutToolButton: false,
            lastCanvasContent: null,
            lastCanvasMessageIndex: -1
        };

        // Gemini 版本追踪工具函数
        const GeminiVersionTracker = {
            STABLE_MS: 1500,
            
            createEmptyTracker: function() {
                return { turns: {}, order: [] };
            },

            nowTs: function() {
                return Date.now();
            },

            ensureTurn: function(tracker, turnId) {
                let t = tracker.turns[turnId];
                if (!t) {
                    t = {
                        id: turnId,
                        userVersions: [],
                        assistantVersions: [],
                        userLastText: '',
                        assistantCommittedText: '',
                        assistantPendingText: '',
                        assistantPendingSince: 0,
                        uvBest: {}
                    };
                    tracker.turns[turnId] = t;
                    tracker.order.push(turnId);
                }
                return t;
            },

            getTurnId: function(node, idx) {
                const attr = node.getAttribute &&
                    (node.getAttribute('data-message-id') || node.getAttribute('data-id'));
                return attr || `turn-${idx}`;
            },

            containsEither: function(a, b) {
                if (!a || !b) return false;
                const na = a.replace(/\s+/g, ' ').trim();
                const nb = b.replace(/\s+/g, ' ').trim();
                return na.includes(nb) || nb.includes(na);
            },

            handleUser: function(tracker, turnId, text) {
                const t = this.ensureTurn(tracker, turnId);
                const value = (text || '').trim();
                if (!value) return;

                if (!t.userLastText) {
                    t.userLastText = value;
                    t.userVersions.push({ version: 0, type: 'normal', text: value });
                } else if (value !== t.userLastText) {
                    t.userLastText = value;
                    t.userVersions.push({ version: t.userVersions.length, type: 'edit', text: value });
                }
            },

            handleAssistant: function(tracker, turnId, domText) {
                const t = this.ensureTurn(tracker, turnId);
                const text = (domText || '').trim();
                if (!text) return;

                const now = this.nowTs();

                if (text !== t.assistantPendingText) {
                    t.assistantPendingText = text;
                    t.assistantPendingSince = now;
                    return;
                }
                if (now - t.assistantPendingSince < this.STABLE_MS) return;

                let userVersionIndex = null;
                if (t.userVersions.length > 0) {
                    const lastUser = t.userVersions[t.userVersions.length - 1];
                    userVersionIndex = lastUser.version;
                }
                const uvKey = String(userVersionIndex);

                const best = t.uvBest[uvKey];
                if (!best || text.length < best.len) {
                    t.uvBest[uvKey] = { text, len: text.length };
                }

                const prevCommitted = t.assistantCommittedText || '';
                const isSameUVAsLastCommit = (t.assistantVersions.length > 0)
                    ? String(t.assistantVersions[t.assistantVersions.length - 1].userVersion) === uvKey
                    : true;

                const onlyVisibilityNoise = this.containsEither(prevCommitted, text);
                const shouldCommit = (!onlyVisibilityNoise) || !isSameUVAsLastCommit;

                if (!shouldCommit) return;

                const version = t.assistantVersions.length;
                const type = version === 0 ? 'normal' : 'retry';

                t.assistantVersions.push({
                    version,
                    type,
                    userVersion: userVersionIndex,
                    text
                });

                t.assistantCommittedText = text;
            }
        };
        const SCROLL_DELAY_MS = 250;
        const SCROLL_TOP_WAIT_MS = 1000;

        const i18n = {
            languages: {
                zh: {
                    loading: '加载中...', exporting: '导出中...', compressing: '压缩中...', preparing: '准备中...',
                    exportSuccess: '导出成功!', noContent: '没有可导出的对话内容。',
                    exportCurrentJSON: '导出当前', exportAllConversations: '导出全部',
                    branchMode: '多分支', includeImages: '含图像',
                    enterFilename: '请输入文件名(不含扩展名):', untitledChat: '未命名对话',
                    uuidNotFound: '未找到对话UUID!', fetchFailed: '获取对话数据失败',
                    exportFailed: '导出失败: ', gettingConversation: '获取对话',
                    withImages: ' (处理图片中...)', successExported: '成功导出', conversations: '个对话!',
                    manualUserId: '手动设置ID', enterUserId: '请输入您的组织ID (settings/account):',
                    userIdSaved: '用户ID已保存!',
                    workspaceType: '团队空间', userWorkspace: '个人区', teamWorkspace: '工作区',
                    manualWorkspaceId: '手动设置工作区ID', enterWorkspaceId: '请输入工作区ID (工作空间设置/工作空间 ID):',
                    workspaceIdSaved: '工作区ID已保存!', tokenNotFound: '未找到访问令牌!',
                    viewOnline: '预览对话',
                    loadFailed: '加载失败: ',
                    cannotOpenExporter: '无法打开 Lyra Exporter,请检查弹窗拦截',
                },
                en: {
                    loading: 'Loading...', exporting: 'Exporting...', compressing: 'Compressing...', preparing: 'Preparing...',
                    exportSuccess: 'Export successful!', noContent: 'No conversation content to export.',
                    exportCurrentJSON: 'Export', exportAllConversations: 'Save All',
                    branchMode: 'Branch', includeImages: 'Images',
                    enterFilename: 'Enter filename (without extension):', untitledChat: 'Untitled Chat',
                    uuidNotFound: 'UUID not found!', fetchFailed: 'Failed to fetch conversation data',
                    exportFailed: 'Export failed: ', gettingConversation: 'Getting conversation',
                    withImages: ' (processing images...)', successExported: 'Successfully exported', conversations: 'conversations!',
                    manualUserId: 'Customize UUID', enterUserId: 'Organization ID (settings/account)',
                    userIdSaved: 'User ID saved!',
                    workspaceType: 'Workspace', userWorkspace: 'Personal', teamWorkspace: 'Team',
                    manualWorkspaceId: 'Set Workspace ID', enterWorkspaceId: 'Enter Workspace ID(Workspace settings/Workspace ID):',
                    workspaceIdSaved: 'Workspace ID saved!', tokenNotFound: 'Access token not found!',
                    viewOnline: 'Preview',
                    loadFailed: 'Load failed: ',
                    cannotOpenExporter: 'Cannot open Lyra Exporter, please check popup blocker',
                }
            },
            currentLang: localStorage.getItem('lyraExporterLanguage') || (navigator.language.startsWith('zh') ? 'zh' : 'en'),
            t: (key) => i18n.languages[i18n.currentLang]?.[key] || key,
            setLanguage: (lang) => {
                i18n.currentLang = lang;
                localStorage.setItem('lyraExporterLanguage', lang);
            },
            getLanguageShort() {
                return this.currentLang === 'zh' ? '简体中文' : 'English';
            }
        };

        const previewIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        const collapseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        const expandIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        const exportIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
        const zipIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11V9a7 7 0 0 0-7-7a7 7 0 0 0-7 7v2"></path><rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect></svg>';

        const Utils = {
            sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

            sanitizeFilename: (name) => name.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').substring(0, 100),

            blobToBase64: (blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }),

            downloadJSON: (jsonString, filename) => {
                const blob = new Blob([jsonString], { type: 'application/json' });
                Utils.downloadFile(blob, filename);
            },

            downloadFile: (blob, filename) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            },

            setButtonLoading: (btn, text) => {
                btn.disabled = true;
                safeSetInnerHTML(btn, `<div class="lyra-loading"></div> <span>${text}</span>`);
            },

            restoreButton: (btn, originalContent) => {
                btn.disabled = false;
                safeSetInnerHTML(btn, originalContent);
            },

            createButton: (innerHTML, onClick, useInlineStyles = false) => {
                const btn = document.createElement('button');
                btn.className = 'lyra-button';
                safeSetInnerHTML(btn, innerHTML);
                btn.addEventListener('click', () => onClick(btn));

                if (useInlineStyles) {
                    Object.assign(btn.style, {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '8px',
                        width: '100%',
                        maxWidth: '100%',
                        padding: '8px 12px',
                        margin: '8px 0',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        letterSpacing: '0.3px',
                        height: '32px',
                        boxSizing: 'border-box',
                        whiteSpace: 'nowrap'
                    });
                }

                return btn;
            },

            createToggle: (label, id, checked = false) => {
                const container = document.createElement('div');
                container.className = 'lyra-toggle';
                const labelSpan = document.createElement('span');
                labelSpan.className = 'lyra-toggle-label';
                labelSpan.textContent = label;

                const switchLabel = document.createElement('label');
                switchLabel.className = 'lyra-switch';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;
                input.checked = checked;

                const slider = document.createElement('span');
                slider.className = 'lyra-slider';

                switchLabel.appendChild(input);
                switchLabel.appendChild(slider);
                container.appendChild(labelSpan);
                container.appendChild(switchLabel);

                return container;
            },

            createProgressElem: (parent) => {
                const elem = document.createElement('div');
                elem.className = 'lyra-progress';
                parent.appendChild(elem);
                return elem;
            }
        };

    function extractCanvasFromElement(root) {
        const canvasData = [];
        const seen = new Set();
        if (!root || !(root instanceof Element)) return canvasData;

        const codeBlocks = root.querySelectorAll('code-block, pre code, .code-block');
        codeBlocks.forEach((block) => {
            const codeContent = block.textContent || block.innerText;
            if (!codeContent) return;
            const trimmed = codeContent.trim();
            if (!trimmed) return;
            const key = trimmed.substring(0, 100);
            if (seen.has(key)) return;
            seen.add(key);

            const langAttr = block.querySelector('[data-lang]');
            const language = langAttr ? langAttr.getAttribute('data-lang') || 'unknown' : 'unknown';
            canvasData.push({
                type: 'code',
                content: trimmed,
                language: language
            });
        });

        const textSelectors = ['response-element', '.model-response-text', '.markdown'];
        textSelectors.forEach((sel) => {
            const els = root.querySelectorAll(sel);
            els.forEach((el) => {
                if (el.closest('code-block') || el.querySelector('code-block')) return;
                const textContent = el.textContent || el.innerText;
                if (!textContent) return;
                const trimmed = textContent.trim();
                if (!trimmed) return;
                const key = trimmed.substring(0, 100);
                if (seen.has(key)) return;
                seen.add(key);
                canvasData.push({
                    type: 'text',
                    content: trimmed
                });
            });
        });

        if (canvasData.length === 0 && root.querySelector('canvas')) {
            const allText = root.textContent || root.innerText;
            if (allText) {
                const trimmed = allText.trim();
                if (trimmed) {
                    const key = trimmed.substring(0, 100);
                    if (!seen.has(key)) {
                        canvasData.push({
                            type: 'full_content',
                            content: trimmed
                        });
                    }
                }
            }
        }

        return canvasData;
    }

    function extractGlobalCanvasContent() {
        const canvasData = [];
        const seen = new Set();

        let globalRetryLabel = '';
        try {
            const retryBtnGlobal = document.querySelector('button.retry-without-tool-button');
            if (retryBtnGlobal) {
                globalRetryLabel = (retryBtnGlobal.innerText || '').trim();
            }
        } catch (e) {
            globalRetryLabel = '';
        }

        const codeBlocks = document.querySelectorAll('code-block, pre code, .code-block');
        codeBlocks.forEach((block) => {
            const codeContent = block.textContent || block.innerText;
            if (!codeContent) return;
            const trimmed = codeContent.trim();
            if (!trimmed) return;
            const key = trimmed.substring(0, 100);
            if (seen.has(key)) return;
            seen.add(key);

            const langAttr = block.querySelector('[data-lang]');
            const language = langAttr ? langAttr.getAttribute('data-lang') || 'unknown' : 'unknown';
            canvasData.push({
                type: 'code',
                content: trimmed,
                language: language
            });
        });

        const responseElements = document.querySelectorAll('response-element, .model-response-text, .markdown');
        responseElements.forEach((element) => {
            if (element.closest('code-block') || element.querySelector('code-block')) return;
            let clone;
            try {
                clone = element.cloneNode(true);
                clone.querySelectorAll('button.retry-without-tool-button').forEach(btn => btn.remove());
            } catch (e) {
                clone = element;
            }
            let md = '';
            try {
                md = htmlToMarkdown(clone).trim();
            } catch (e) {
                const textContent = element.textContent || element.innerText;
                md = textContent ? textContent.trim() : '';
            }
            if (!md) return;
            const key = md.substring(0, 100);
            if (seen.has(key)) return;
            seen.add(key);
            canvasData.push({
                type: 'text',
                content: md
            });
        });

        return canvasData;
    }
        const LyraCommunicator = {
            open: async (jsonData, filename) => {
                try {
                    const exporterWindow = window.open(Config.EXPORTER_URL, '_blank');
                    if (!exporterWindow) {
                        alert(i18n.t('cannotOpenExporter'));
                        return false;
                    }

                    const checkInterval = setInterval(() => {
                        try {
                            exporterWindow.postMessage({
                                type: 'LYRA_HANDSHAKE',
                                source: 'lyra-fetch-script'
                            }, Config.EXPORTER_ORIGIN);
                        } catch (e) {
                        }
                    }, 1000);

                    const handleMessage = (event) => {
                        if (event.origin !== Config.EXPORTER_ORIGIN) {
                            return;
                        }
                        if (event.data && event.data.type === 'LYRA_READY') {
                            clearInterval(checkInterval);
                            const dataToSend = {
                                type: 'LYRA_LOAD_DATA',
                                source: 'lyra-fetch-script',
                                data: {
                                    content: jsonData,
                                    filename: filename || `${State.currentPlatform}_export_${new Date().toISOString().slice(0,10)}.json`
                                }
                            };
                            exporterWindow.postMessage(dataToSend, Config.EXPORTER_ORIGIN);
                            window.removeEventListener('message', handleMessage);
                        }
                    };

                    window.addEventListener('message', handleMessage);

                    setTimeout(() => {
                        clearInterval(checkInterval);
                        window.removeEventListener('message', handleMessage);
                    }, 60000);

                    return true;
                } catch (error) {
                    alert(`${i18n.t('cannotOpenExporter')}: ${error.message}`);
                    return false;
                }
            }};
    const UI = {

        injectStyle: () => {
            const platformColors = {
                claude: '#141413',
                chatgpt: '#10A37F',
                gemini: '#1a73e8',
                notebooklm: '#4285f4',
                aistudio: '#777779'
            };
            const buttonColor = platformColors[State.currentPlatform] || '#4285f4';
            console.log('[Lyra] Current platform:', State.currentPlatform);
            console.log('[Lyra] Button color:', buttonColor);
            document.documentElement.style.setProperty('--lyra-button-color', buttonColor);
            console.log('[Lyra] CSS variable --lyra-button-color set to:', buttonColor);
            const linkId = 'lyra-fetch-external-css';
                                    GM_addStyle(`
                #lyra-controls {
                    position: fixed !important;
                    top: 50% !important;
                    right: 0 !important;
                    transform: translateY(-50%) translateX(10px) !important;
                    background: white !important;
                    border: 1px solid #dadce0 !important;
                    border-radius: 8px !important;
                    padding: 16px 16px 8px 16px !important;
                    width: 136px !important;
                    z-index: 999999 !important;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
                    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }

                #lyra-controls.collapsed {
                    transform: translateY(-50%) translateX(calc(100% - 35px + 6px)) !important;
                    opacity: 0.6 !important;
                    background: white !important;
                    border-color: #dadce0 !important;
                    border-radius: 8px 0 0 8px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    pointer-events: none !important;
                }
                #lyra-controls.collapsed .lyra-main-controls {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }

                #lyra-controls:hover {
                    opacity: 1 !important;
                }

                #lyra-toggle-button {
                    position: absolute !important;
                    left: 0 !important;
                    top: 50% !important;
                    transform: translateY(-50%) translateX(-50%) !important;
                    cursor: pointer !important;
                    width: 32px !important;
                    height: 32px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: #ffffff !important;
                    color: var(--lyra-button-color) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
                    border: 1px solid #dadce0 !important;
                    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    z-index: 1000 !important;
                    pointer-events: all !important;
                }

                #lyra-controls.collapsed #lyra-toggle-button {
                    z-index: 2 !important;
                    left: 16px !important;
                    transform: translateY(-50%) translateX(-50%) !important;
                    width: 21px !important;
                    height: 21px !important;
                    background: var(--lyra-button-color) !important;
                    color: white !important;
                }

                #lyra-controls.collapsed #lyra-toggle-button:hover {
                    box-shadow:
                        0 4px 12px rgba(0,0,0,0.25),
                        0 0 0 3px rgba(255,255,255,0.9) !important;
                    transform: translateY(-50%) translateX(-50%) scale(1.15) !important;
                    opacity: 0.9 !important;
                }

                .lyra-main-controls {
                    margin-left: 0px !important;
                    padding: 0 3px !important;
                    transition: opacity 0.7s !important;
                }

                .lyra-title {
                    font-size: 16px !important;
                    font-weight: 700 !important;
                    color: #202124 !important;
                    text-align: center;
                    margin-bottom: 12px !important;
                    padding-bottom: 0px !important;
                    letter-spacing: 0.3px !important;
                }

                .lyra-input-trigger {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 3px !important;
                    font-size: 10px !important;
                    margin: 10px auto 0 auto !important;
                    padding: 2px 6px !important;
                    border-radius: 3px !important;
                    background: transparent !important;
                    cursor: pointer !important;
                    transition: all 0.15s !important;
                    white-space: nowrap !important;
                    color: #5f6368 !important;
                    border: none !important;
                    font-weight: 500 !important;
                    width: fit-content !important;
                }

                .lyra-input-trigger:hover {
                    background: #f1f3f4 !important;
                    color: #202124 !important;
                }

                .lyra-button {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: 8px !important;
                    width: 100% !important;
                    padding: 8px 12px !important;
                    margin: 8px 0 !important;
                    border: none !important;
                    border-radius: 6px !important;
                    background: var(--lyra-button-color) !important;
                    color: white !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    letter-spacing: 0.3px !important;
                    height: 32px !important;
                    box-sizing: border-box !important;
                }
                .lyra-button svg {
                    width: 16px !important;
                    height: 16px !important;
                    flex-shrink: 0 !important;
                }
                .lyra-button:disabled {
                    opacity: 0.6 !important;
                    cursor: not-allowed !important;
                }

                .lyra-status {
                    font-size: 10px !important;
                    padding: 6px 8px !important;
                    border-radius: 4px !important;
                    margin: 4px 0 !important;
                    text-align: center !important;
                }
                .lyra-status.success {
                    background: #e8f5e9 !important;
                    color: #2e7d32 !important;
                    border: 1px solid #c8e6c9 !important;
                }
                .lyra-status.error {
                    background: #ffebee !important;
                    color: #c62828 !important;
                    border: 1px solid #ffcdd2 !important;
                }

                .lyra-toggle {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    color: #5f6368 !important;
                    margin: 3px 0 !important;
                    gap: 8px !important;
                    padding: 4px 8px !important;
                }

                .lyra-toggle:last-of-type {
                    margin-bottom: 14px !important;
                }

                .lyra-switch {
                    position: relative !important;
                    display: inline-block !important;
                    width: 32px !important;
                    height: 16px !important;
                    flex-shrink: 0 !important;
                }
                .lyra-switch input {
                    opacity: 0 !important;
                    width: 0 !important;
                    height: 0 !important;
                }
                .lyra-slider {
                    position: absolute !important;
                    cursor: pointer !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background-color: #ccc !important;
                    transition: .3s !important;
                    border-radius: 34px !important;
                    --theme-color: var(--lyra-button-color);
                }
                .lyra-slider:before {
                    position: absolute !important;
                    content: "" !important;
                    height: 12px !important;
                    width: 12px !important;
                    left: 2px !important;
                    bottom: 2px !important;
                    background-color: white !important;
                    transition: .3s !important;
                    border-radius: 50% !important;
                }
                input:checked + .lyra-slider {
                    background-color: var(--theme-color, var(--lyra-button-color)) !important;
                }
                input:checked + .lyra-slider:before {
                    transform: translateX(16px) !important;
                }

                .lyra-loading {
                    display: inline-block !important;
                    width: 14px !important;
                    height: 14px !important;
                    border: 2px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 50% !important;
                    border-top-color: #fff !important;
                    animation: lyra-spin 0.8s linear infinite !important;
                }
                @keyframes lyra-spin {
                    to { transform: rotate(360deg); }
                }

                .lyra-progress {
                    font-size: 10px !important;
                    color: #5f6368 !important;
                    margin-top: 4px !important;
                    text-align: center !important;
                    padding: 4px !important;
                    background: #f8f9fa !important;
                    border-radius: 4px !important;
                }

                .lyra-lang-toggle {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 3px !important;
                    font-size: 10px !important;
                    margin: 4px auto 0 auto !important;
                    padding: 2px 6px !important;
                    border-radius: 3px !important;
                    background: transparent !important;
                    cursor: pointer !important;
                    transition: all 0.15s !important;
                    white-space: nowrap !important;
                    color: #5f6368 !important;
                    border: none !important;
                    font-weight: 500 !important;
                    width: fit-content !important;
                }
                .lyra-lang-toggle:hover {
                    background: #f1f3f4 !important;
                    color: #202124 !important;
                }
            `);
        },

        toggleCollapsed: () => {
            State.isPanelCollapsed = !State.isPanelCollapsed;
            localStorage.setItem('lyraExporterCollapsed', State.isPanelCollapsed);
            const panel = document.getElementById(Config.CONTROL_ID);
            const toggle = document.getElementById(Config.TOGGLE_ID);
            if (!panel || !toggle) return;
            if (State.isPanelCollapsed) {
                panel.classList.add('collapsed');
                safeSetInnerHTML(toggle, collapseIcon);
            } else {
                panel.classList.remove('collapsed');
                safeSetInnerHTML(toggle, expandIcon);
            }
        },

        recreatePanel: () => {
            document.getElementById(Config.CONTROL_ID)?.remove();
            State.panelInjected = false;
            UI.createPanel();
        },

        createPanel: () => {
            if (document.getElementById(Config.CONTROL_ID) || State.panelInjected) return false;

            const container = document.createElement('div');
            container.id = Config.CONTROL_ID;

            // 修复easychat不加载配色（就近生效）
            const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--lyra-button-color')
            .trim() || '#141413';
            container.style.setProperty('--lyra-button-color', color);

            if (State.isPanelCollapsed) container.classList.add('collapsed');

            if (State.currentPlatform === 'notebooklm' || State.currentPlatform === 'gemini') {
                Object.assign(container.style, {
                    position: 'fixed',
                    top: '50%',
                    right: '0',
                    transform: 'translateY(-50%) translateX(10px)',
                    background: 'white',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    padding: '16px 16px 8px 16px',
                    width: '136px',
                    zIndex: '999999',
                    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    boxSizing: 'border-box'
                });
            }

            const toggle = document.createElement('div');
            toggle.id = Config.TOGGLE_ID;
            safeSetInnerHTML(toggle, State.isPanelCollapsed ? collapseIcon : expandIcon);
            toggle.addEventListener('click', UI.toggleCollapsed);
            container.appendChild(toggle);

            const controls = document.createElement('div');
            controls.className = 'lyra-main-controls';

            if (State.currentPlatform === 'notebooklm' || State.currentPlatform === 'gemini') {
                Object.assign(controls.style, {
                    marginLeft: '0px',
                    padding: '0 3px',
                    transition: 'opacity 0.7s'
                });
            }

            const title = document.createElement('div');
            title.className = 'lyra-title';
            const titles = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', notebooklm: 'Note LM', aistudio: 'AI Studio' };
            title.textContent = titles[State.currentPlatform] || 'Exporter';
            controls.appendChild(title);

            if (State.currentPlatform === 'claude') {
                ClaudeHandler.addUI(controls);
                ClaudeHandler.addButtons(controls);

                const inputLabel = document.createElement('div');
                inputLabel.className = 'lyra-input-trigger';
                inputLabel.textContent = `${i18n.t('manualUserId')}`;
                inputLabel.addEventListener('click', () => {
                    const newId = prompt(i18n.t('enterUserId'), State.capturedUserId);
                    if (newId?.trim()) {
                        State.capturedUserId = newId.trim();
                        localStorage.setItem('lyraClaudeUserId', State.capturedUserId);
                        alert(i18n.t('userIdSaved'));
                        UI.recreatePanel();
                    }
                });
                controls.appendChild(inputLabel);
            } else if (State.currentPlatform === 'chatgpt') {
                ChatGPTHandler.addUI(controls);
                ChatGPTHandler.addButtons(controls);
            } else {
                ScraperHandler.addButtons(controls, State.currentPlatform);
            }

            const langToggle = document.createElement('div');
            langToggle.className = 'lyra-lang-toggle';
            langToggle.textContent = `🌐 ${i18n.getLanguageShort()}`;
            langToggle.addEventListener('click', () => {
                i18n.setLanguage(i18n.currentLang === 'zh' ? 'en' : 'zh');
                UI.recreatePanel();
            });
            controls.appendChild(langToggle);

            container.appendChild(controls);
            document.body.appendChild(container);
            State.panelInjected = true;

            const panel = document.getElementById(Config.CONTROL_ID);
            if (State.isPanelCollapsed) {
                panel.classList.add('collapsed');
                safeSetInnerHTML(toggle, collapseIcon);
            } else {
                panel.classList.remove('collapsed');
                safeSetInnerHTML(toggle, expandIcon);
            }

            return true;
        }
    };

    const init = () => {
        if (!State.currentPlatform) return;

        if (State.currentPlatform === 'claude') ClaudeHandler.init();
        if (State.currentPlatform === 'chatgpt') ChatGPTHandler.init();

        UI.injectStyle();

        const initPanel = () => {
            UI.createPanel();
            if (State.currentPlatform === 'claude' || State.currentPlatform === 'chatgpt') {
                let lastUrl = window.location.href;
                new MutationObserver(() => {
                    if (window.location.href !== lastUrl) {
                        lastUrl = window.location.href;
                        setTimeout(() => {
                            if (!document.getElementById(Config.CONTROL_ID)) {
                                UI.createPanel();
                            }
                        }, 1000);
                    }
                }).observe(document.body, { childList: true, subtree: true });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(initPanel, 2000));
        } else {
            setTimeout(initPanel, 2000);
        }
    };

        init();

        const ScraperHandler = {
            handlers: {
                gemini: {
                    getTitle: () => {
                        const input = prompt('请输入对话标题 / Enter title:', '对话');
                        if (input === null) return null;
                        return input || i18n.t('untitledChat');
                    },
                    extractData: async (includeImages = true) => {
                        const useVersionTracking = document.getElementById(Config.CANVAS_SWITCH_ID)?.checked || false;

                        if (useVersionTracking) {
                            // 版本追踪模式
                            if (!State.geminiTracker) {
                                State.geminiTracker = GeminiVersionTracker.createEmptyTracker();
                            }

                            const tracker = State.geminiTracker;
                            const conversationData = [];
                            const turns = document.querySelectorAll("div.conversation-turn, div.single-turn, div.conversation-container");

                            turns.forEach((turn, idx) => {
                                const turnId = GeminiVersionTracker.getTurnId(turn, idx);
                                
                                // 提取用户文本
                                const userEl = turn.querySelector('user-query .query-text') || 
                                              turn.querySelector('.query-text-line');
                                const userText = userEl ? userEl.innerText.trim() : '';
                                
                                // 提取AI文本
                                const modelPanel = turn.querySelector('model-response .markdown-main-panel') ||
                                                  turn.querySelector('.markdown-main-panel') ||
                                                  turn.querySelector('model-response') ||
                                                  turn.querySelector('.response-container');
                                let assistantText = '';
                                if (modelPanel) {
                                    const clone = modelPanel.cloneNode(true);
                                    try {
                                        clone.querySelectorAll('button.retry-without-tool-button').forEach(btn => btn.remove());
                                    } catch (e) {}
                                    assistantText = modelPanel.innerText.trim();
                                }

                                // 处理版本
                                GeminiVersionTracker.handleUser(tracker, turnId, userText);
                                GeminiVersionTracker.handleAssistant(tracker, turnId, assistantText);
                            });

                            // 构建导出数据
                            tracker.order.forEach((id, index) => {
                                const t = tracker.turns[id];
                                if (!t) return;

                                const hasUser = t.userVersions.length > 0;
                                const hasAssistant = t.assistantVersions.length > 0;

                                conversationData.push({
                                    turnIndex: index,
                                    human: hasUser ? {
                                        versions: t.userVersions.map(v => ({
                                            version: v.version,
                                            type: v.type,
                                            text: v.text
                                        }))
                                    } : null,
                                    assistant: hasAssistant ? {
                                        versions: t.assistantVersions.map(v => ({
                                            version: v.version,
                                            type: v.type,
                                            userVersion: v.userVersion,
                                            text: v.text
                                        }))
                                    } : null
                                });
                            });

                            return conversationData;

                        } else {
                            // 简单提取模式（原逻辑）
                            const conversationData = [];
                            const turns = document.querySelectorAll("div.conversation-turn, div.single-turn, div.conversation-container");
                            LyraFlags.hasRetryWithoutToolButton = false;
                            LyraFlags.lastCanvasContent = null;
                            LyraFlags.lastCanvasMessageIndex = -1;

                            const processContainer = async (container) => {
                                const userQueryElement = container.querySelector("user-query .query-text") || container.querySelector(".query-text-line");
                                const modelResponseContainer = container.querySelector("model-response") || container;

                                let hasRetryBtn = false;
                                try {
                                    hasRetryBtn = !!(modelResponseContainer && modelResponseContainer.querySelector('button.retry-without-tool-button'));
                                    if (hasRetryBtn) {
                                        LyraFlags.hasRetryWithoutToolButton = true;
                                    }
                                } catch(e) {
                                    console.warn('[Lyra] retry-without-tool-button check failed:', e);
                                    hasRetryBtn = false;
                                }

                                const modelResponseElement = modelResponseContainer.querySelector("message-content .markdown-main-panel");

                                const humanText = userQueryElement ? userQueryElement.innerText.trim() : "";
                                let assistantText = "";

                                if (modelResponseElement) {
                                    const clone = modelResponseElement.cloneNode(true);
                                    try {
                                        clone.querySelectorAll('button.retry-without-tool-button').forEach(btn => btn.remove());
                                    } catch (e) {
                                    }
                                    assistantText = htmlToMarkdown(clone);
                                } else {
                                    const fallbackEl = modelResponseContainer.querySelector("model-response, .response-container");
                                    if (fallbackEl) assistantText = fallbackEl.innerText.trim();
                                }

                                let userImages = [];
                                let modelImages = [];

                                if (includeImages) {
                                    const userImageElements = container.querySelectorAll("user-query img");
                                    const modelImageElements = modelResponseContainer.querySelectorAll("model-response img");

                                    const userImagesPromises = Array.from(userImageElements).map(processImageElement);
                                    const modelImagesPromises = Array.from(modelImageElements).map(processImageElement);

                                    userImages = (await Promise.all(userImagesPromises)).filter(Boolean);
                                    modelImages = (await Promise.all(modelImagesPromises)).filter(Boolean);
                                }

                                if (hasRetryBtn) {
                                    LyraFlags.lastCanvasMessageIndex = conversationData.length;
                                }

                                if (humanText || assistantText || userImages.length > 0 || modelImages.length > 0) {
                                    const humanObj = { text: humanText };
                                    if (userImages && userImages.length > 0) humanObj.images = userImages;

                                    const assistantObj = { text: assistantText };
                                    if (modelImages && modelImages.length > 0) assistantObj.images = modelImages;

                                    conversationData.push({ human: humanObj, assistant: assistantObj });
                                }
                            };

                            for (const turn of turns) {
                                await processContainer(turn);
                            }

                            try {
                                if (LyraFlags.hasRetryWithoutToolButton) {
                                    const globalCanvas = extractGlobalCanvasContent();
                                    if (globalCanvas && globalCanvas.length > 0) {
                                        const lastBlock = globalCanvas[globalCanvas.length - 1];
                                        if (lastBlock && lastBlock.content) {
                                            LyraFlags.lastCanvasContent = lastBlock.content;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('Global canvas extraction error:', e);
                                LyraFlags.lastCanvasContent = null;
                            }

                            return conversationData;
                        }
                    }
                },
                notebooklm: {
                    getTitle: () => 'NotebookLM_' + new Date().toISOString().slice(0, 10),
                    extractData: async (includeImages = true) => {
                        const data = [];
                        const turns = document.querySelectorAll("div.chat-message-pair");

                        for (const turn of turns) {
                            let question = turn.querySelector("chat-message .from-user-container .message-text-content")?.innerText.trim() || "";
                            if (question.startsWith('[Preamble] ')) question = question.substring('[Preamble] '.length).trim();

                            let answer = "";
                            const answerEl = turn.querySelector("chat-message .to-user-container .message-text-content");
                            if (answerEl) {
                                const parts = [];
                                answerEl.querySelectorAll('labs-tailwind-structural-element-view-v2').forEach(el => {
                                    let line = el.querySelector('.bullet')?.innerText.trim() + ' ' || '';
                                    const para = el.querySelector('.paragraph');
                                    if (para) {
                                        let text = '';
                                        para.childNodes.forEach(node => {
                                            if (node.nodeType === Node.TEXT_NODE) text += node.textContent;
                                            else if (node.nodeType === Node.ELEMENT_NODE && !node.querySelector?.('.citation-marker')) {
                                                text += node.classList?.contains('bold') ? `**${node.innerText}**` : (node.innerText || node.textContent || '');
                                            }
                                        });
                                        line += text;
                                    }
                                    if (line.trim()) parts.push(line.trim());
                                });
                                answer = parts.join('\n\n');
                            }

                            let userImages = [];
                            let modelImages = [];

                            if (includeImages) {
                                const userImageElements = turn.querySelectorAll("chat-message .from-user-container img");
                                const modelImageElements = turn.querySelectorAll("chat-message .to-user-container img");

                                const userImagesPromises = Array.from(userImageElements).map(processImageElement);
                                const modelImagesPromises = Array.from(modelImageElements).map(processImageElement);

                                userImages = (await Promise.all(userImagesPromises)).filter(Boolean);
                                modelImages = (await Promise.all(modelImagesPromises)).filter(Boolean);
                            }

                            if (question || answer || userImages.length > 0 || modelImages.length > 0) {
                                const humanObj = { text: question };
                                if (userImages && userImages.length > 0) humanObj.images = userImages;
                                const assistantObj = { text: answer };
                                if (modelImages && modelImages.length > 0) assistantObj.images = modelImages;
                                data.push({ human: humanObj, assistant: assistantObj });
                            }
                        }
                        return data;
                    }
                },
                aistudio: {
                    getTitle: () => {
                        const input = prompt('请输入对话标题 / Enter title:', 'AI_Studio_Chat');
                        if (input === null) return null;
                        return input || 'AI_Studio_Chat';
                    },
                    extractData: async (includeImages = true) => {
                        collectedData.clear();
                        const scroller = getAIStudioScroller();
                        scroller.scrollTop = 0;
                        await Utils.sleep(SCROLL_TOP_WAIT_MS);

                        let lastScrollTop = -1;

                        while (true) {
                            await extractDataIncremental_AiStudio(includeImages);

                            if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 10) {
                                break;
                            }

                            lastScrollTop = scroller.scrollTop;
                            scroller.scrollTop += scroller.clientHeight * 0.85;
                            await Utils.sleep(SCROLL_DELAY_MS);

                            if (scroller.scrollTop === lastScrollTop) {
                                break;
                            }
                        }

                        await extractDataIncremental_AiStudio(includeImages);
                        await Utils.sleep(500);

                        const finalTurnsInDom = document.querySelectorAll('ms-chat-turn');
                        let sortedData = [];
                        finalTurnsInDom.forEach(turnNode => {
                            if (collectedData.has(turnNode)) {
                                sortedData.push(collectedData.get(turnNode));
                            }
                        });

                        const pairedData = [];
                        let lastHuman = null;
                        sortedData.forEach(item => {
                            if (item.type === 'user') {
                                if (!lastHuman) lastHuman = { text: '', images: [] };
                                lastHuman.text = (lastHuman.text ? lastHuman.text + '\n' : '') + item.text;
                                if (Array.isArray(item.images) && item.images.length > 0) {
                                    lastHuman.images.push(...item.images);
                                }
                            } else if (item.type === 'model' && lastHuman) {
                                const humanObj = { text: lastHuman.text };
                                if (Array.isArray(lastHuman.images) && lastHuman.images.length > 0) humanObj.images = lastHuman.images;
                                const assistantObj = { text: item.text };
                                if (Array.isArray(item.images) && item.images.length > 0) assistantObj.images = item.images;
                                pairedData.push({ human: humanObj, assistant: assistantObj });
                                lastHuman = null;
                            } else if (item.type === 'model' && !lastHuman) {
                                const humanObj = { text: "[No preceding user prompt found]" };
                                const assistantObj = { text: item.text };
                                if (Array.isArray(item.images) && item.images.length > 0) assistantObj.images = item.images;
                                pairedData.push({ human: humanObj, assistant: assistantObj });
                            }
                        });

                        if (lastHuman) {
                            const humanObj = { text: lastHuman.text };
                            if (Array.isArray(lastHuman.images) && lastHuman.images.length > 0) humanObj.images = lastHuman.images;
                            pairedData.push({ human: humanObj, assistant: { text: "[Model response is pending]" } });
                        }

                        return pairedData;
                    }
                }
            },

            addButtons: (controlsArea, platform) => {
            const handler = ScraperHandler.handlers[platform];
            if (!handler) return;

            if (platform === 'gemini') {
                const canvasToggle = Utils.createToggle('版本追踪', Config.CANVAS_SWITCH_ID, State.includeVersionTracking);
                controlsArea.appendChild(canvasToggle);

                const themeColor = '#1a73e8';
                const toggleSwitch = canvasToggle.querySelector('.lyra-switch input');
                if (toggleSwitch) {
                    toggleSwitch.addEventListener('change', (e) => {
                        State.includeVersionTracking = e.target.checked;
                        localStorage.setItem('lyraIncludeVersionTracking', State.includeVersionTracking);
                        // 切换模式时重置tracker
                        if (State.includeVersionTracking) {
                            State.geminiTracker = GeminiVersionTracker.createEmptyTracker();
                        } else {
                            State.geminiTracker = null;
                        }
                        console.log('[Lyra] Version tracking:', State.includeVersionTracking);
                    });

                    const slider = canvasToggle.querySelector('.lyra-slider');
                    if (slider) {
                        slider.style.setProperty('--theme-color', themeColor);
                    }
                }
            }

            if (platform === 'gemini' || platform === 'aistudio') {
            const imageToggle = Utils.createToggle(i18n.t('includeImages'), Config.IMAGE_SWITCH_ID, State.includeImages);
            controlsArea.appendChild(imageToggle);

            const themeColors = { gemini: '#1a73e8', aistudio: '#777779' };
            const toggleSwitch = imageToggle.querySelector('.lyra-switch input');
            if (toggleSwitch) {
            toggleSwitch.addEventListener('change', (e) => {
            State.includeImages = e.target.checked;
            localStorage.setItem('lyraIncludeImages', State.includeImages);
            });

            const slider = imageToggle.querySelector('.lyra-slider');
            if (slider) {
            const color = themeColors[platform];
            slider.style.setProperty('--theme-color', color);
            }
            }
            }

            const useInlineStyles = (platform === 'notebooklm' || platform === 'gemini');
            const buttonColor = { gemini: '#1a73e8', notebooklm: '#000000', aistudio: '#777779' }[platform] || '#4285f4';

            // NotebookLM 只显示导出按钮，不显示预览按钮
            if (platform !== 'notebooklm') {
            const previewBtn = Utils.createButton(
                `${previewIcon} ${i18n.t('viewOnline')}`,
            async (btn) => {
                const title = handler.getTitle();
                        if (!title) return;

                const original = btn.innerHTML;
                        Utils.setButtonLoading(btn, i18n.t('loading'));

                let progressElem = null;
            if (platform === 'aistudio') {
                progressElem = Utils.createProgressElem(controlsArea);
                    progressElem.textContent = i18n.t('loading');
                        }

            try {
            const includeImages = (platform === 'gemini' || platform === 'aistudio') ?
                                (document.getElementById(Config.IMAGE_SWITCH_ID)?.checked || false) : true;

                const conversationData = await handler.extractData(includeImages);
            if (!conversationData || conversationData.length === 0) {
                alert(i18n.t('noContent'));
                Utils.restoreButton(btn, original);
                if (progressElem) progressElem.remove();
                    return;
                            }

            const finalJson = {
                title: title,
                platform: platform,
                exportedAt: new Date().toISOString(),
                    conversation: conversationData
                            };

            if (platform === 'gemini') {
            if (LyraFlags.lastCanvasContent && LyraFlags.lastCanvasMessageIndex >= 0) {
            try {
                    finalJson.conversation[LyraFlags.lastCanvasMessageIndex].assistant.canvas = LyraFlags.lastCanvasContent;
            } catch (e) {
                    console.warn('[Canvas] Failed to attach canvas to assistant:', e);
                    }
                    }
                            }

                const filename = `${platform}_${Utils.sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.json`;
                    await LyraCommunicator.open(JSON.stringify(finalJson, null, 2), filename);
            } catch (error) {
                    alert(`${i18n.t('loadFailed')} ${error.message}`);
            } finally {
                Utils.restoreButton(btn, original);
                    if (progressElem) progressElem.remove();
                    }
                },
                    useInlineStyles
                );

            if (useInlineStyles) {
            Object.assign(previewBtn.style, {
                backgroundColor: buttonColor,
                    color: 'white'
                    });
                }
                controlsArea.appendChild(previewBtn);
            }

                const exportBtn = Utils.createButton(
                    `${exportIcon} ${i18n.t('exportCurrentJSON')}`,
                    async (btn) => {
                        const title = handler.getTitle();
                        if (!title) return;

                        const original = btn.innerHTML;
                        Utils.setButtonLoading(btn, i18n.t('exporting'));

                        let progressElem = null;
                        if (platform === 'aistudio') {
                            progressElem = Utils.createProgressElem(controlsArea);
                            progressElem.textContent = i18n.t('exporting');
                        }

                        try {
                            const includeImages = (platform === 'gemini' || platform === 'aistudio') ?
                                (document.getElementById(Config.IMAGE_SWITCH_ID)?.checked || false) : true;

                            const conversationData = await handler.extractData(includeImages);
                            if (!conversationData || conversationData.length === 0) {
                                alert(i18n.t('noContent'));
                                Utils.restoreButton(btn, original);
                                if (progressElem) progressElem.remove();
                                return;
                            }

                            const finalJson = {
                                title: title,
                                platform: platform,
                                exportedAt: new Date().toISOString(),
                                conversation: conversationData
                            };

                            if (platform === 'gemini') {
                                if (LyraFlags.lastCanvasContent && LyraFlags.lastCanvasMessageIndex >= 0) {
                                    try {
                                        finalJson.conversation[LyraFlags.lastCanvasMessageIndex].assistant.canvas = LyraFlags.lastCanvasContent;
                                    } catch (e) {
                                        console.warn('[Canvas] Failed to attach canvas to assistant:', e);
                                    }
                                }
                            }

                            const filename = `${platform}_${Utils.sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.json`;
                            Utils.downloadJSON(JSON.stringify(finalJson, null, 2), filename);
                        } catch (error) {
                            alert(`${i18n.t('exportFailed')} ${error.message}`);
                        } finally {
                            Utils.restoreButton(btn, original);
                            if (progressElem) progressElem.remove();
                        }
                    },
                    useInlineStyles
                );

                if (useInlineStyles) {
                    Object.assign(exportBtn.style, {
                        backgroundColor: buttonColor,
                        color: 'white'
                    });
                }
                controlsArea.appendChild(exportBtn);
            }
        };

        init();
    })();