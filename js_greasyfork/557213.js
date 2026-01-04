// ==UserScript==
// @name         Google AI Studio Exporter
// @name:zh-CN   Google AI Studio 对话导出器
// @namespace    https://github.com/GhostXia/Google-AI-Studio-Exporter
// @version      1.5.0
// @description  Export your Gemini chat history from Google AI Studio to a text file. Features: Auto-scrolling, User/Model role differentiation, clean output, and full mobile optimization.
// @description:zh-CN 完美导出 Google AI Studio 对话记录。具备自动滚动加载、精准去重、防抖动、User/Model角色区分，以及全平台响应式优化。支持 PC、平板、手机全平台。
// @author       GhostXia
// @license      AGPL-3.0
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @homepageURL  https://github.com/GhostXia/Google-AI-Studio-Exporter
// @supportURL   https://github.com/GhostXia/Google-AI-Studio-Exporter/issues
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      cdnjs.cloudflare.com
// @connect      cdn.jsdelivr.net
// @connect      unpkg.com
// @connect      lh3.googleusercontent.com
// @connect      googleusercontent.com
// @connect      storage.googleapis.com
// @connect      gstatic.com
// @downloadURL https://update.greasyfork.org/scripts/557213/Google%20AI%20Studio%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/557213/Google%20AI%20Studio%20Exporter.meta.js
// ==/UserScript==

// 在 IIFE 外部捕获 @require 加载的 JSZip（避免沙盒作用域问题）
/* global JSZip */
const _JSZipRef = (typeof JSZip !== 'undefined') ? JSZip : null;

    (function () {
        'use strict';

        const DEBUG = false;
        const dlog = (...args) => { if (DEBUG) console.log(...args); };
        dlog('[AI Studio Exporter] Script started');
        dlog('[AI Studio Exporter] _JSZipRef:', _JSZipRef);
        dlog('[AI Studio Exporter] typeof JSZip:', typeof JSZip);
        dlog('[AI Studio Exporter] unsafeWindow.JSZip:', typeof unsafeWindow !== 'undefined' ? unsafeWindow.JSZip : 'unsafeWindow not available');

    // ==========================================
    // 0. 国际化 (i18n)
    // ==========================================
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
        const translations = {
            'zh': {
                'btn_export': '🚀 导出',
                'title_ready': '准备就绪',
                'status_init': '初始化中...',
            'btn_save': '💾 保存',
            'btn_close': '关闭',
            'title_countdown': '准备开始',
            'status_countdown': '请松开鼠标，不要操作！<br><span class="ai-red">{s} 秒后开始自动滚动</span>',
            'title_scrolling': '正在采集...',
            'status_scrolling': '正在向下滚动并抓取内容。<br>按 <b>ESC</b> 键可强制停止并保存。',
            'title_finished': '🎉 导出成功',
            'status_finished': '文件已生成。<br>请检查下载栏。',
            'title_error': '❌ 出错了',
            'title_mode_select': '选择导出模式',
            'status_mode_select': '请选择导出格式',
            'btn_mode_full': '📦 包含附件',
            'btn_mode_text': '📄 纯文本',
            'file_header': 'Google AI Studio 完整对话记录',
            'file_time': '时间',
            'file_count': '条数',
            'file_turns': '回合数',
            'file_paragraphs': '输出段落数',
            'role_user': 'User',
            'role_gemini': 'Gemini',
            'role_thoughts': '思考',
            'err_no_scroller': '未找到滚动容器。请尝试刷新页面或手动滚动一下再试。',
            'err_no_data': '未采集到任何对话数据。请检查页面是否有对话内容。',
            'err_runtime': '运行错误: ',
            'status_packaging_images': '正在打包 {n} 张图片...',
            'status_packaging_images_progress': '打包图片: {c}/{t}',
            'status_packaging_files': '正在打包 {n} 个文件...',
            'status_packaging_files_progress': '打包文件: {c}/{t}',
            'ui_turns': '回合数',
            'ui_paragraphs': '输出段落数',
            'title_zip_missing': 'JSZip 加载失败',
            'status_zip_missing': '无法加载附件打包库。是否回退到纯文本？',
            'btn_retry': '重试',
            'btn_cancel': '取消',
            'status_esc_hint': '按 <b>ESC</b> 可取消并选择保存方式',
            'title_cancel': '已取消导出',
            'status_cancel': '请选择继续打包附件或改为纯文本保存',
            'banner_top': '📎 附件已合并为 Markdown 链接（纯文本导出）',
            'attachments_section': '附件',
            'attachments_link_unavailable': '链接不可用'
            },
            'en': {
                'btn_export': '🚀 Export',
                'title_ready': 'Ready',
                'status_init': 'Initializing...',
            'btn_save': '💾 Save',
            'btn_close': 'Close',
            'title_countdown': 'Get Ready',
            'status_countdown': 'Please release mouse!<br><span class="ai-red">Auto-scroll starts in {s}s</span>',
            'title_scrolling': 'Exporting...',
            'status_scrolling': 'Scrolling down and capturing content.<br>Press <b>ESC</b> to stop and save.',
            'title_finished': '🎉 Finished',
            'status_finished': 'File generated.<br>Check your downloads.',
            'title_error': '❌ Error',
            'title_mode_select': 'Select Export Mode',
            'status_mode_select': 'Choose export format',
            'btn_mode_full': '📦 With Attachments',
            'btn_mode_text': '📄 Text Only',
            'file_header': 'Google AI Studio Chat History',
            'file_time': 'Time',
            'file_count': 'Count',
            'file_turns': 'Turns',
            'file_paragraphs': 'Output paragraphs',
            'role_user': 'User',
            'role_gemini': 'Gemini',
            'role_thoughts': 'Thoughts',
            'err_no_scroller': 'Scroll container not found. Try refreshing or scrolling manually.',
            'err_no_data': 'No conversation data was collected. Please check if the page has any chat content.',
            'err_runtime': 'Runtime Error: ',
            'status_packaging_images': 'Packaging {n} images...',
            'status_packaging_images_progress': 'Packaging images: {c}/{t}',
            'status_packaging_files': 'Packaging {n} files...',
            'status_packaging_files_progress': 'Packaging files: {c}/{t}',
            'ui_turns': 'Turns',
            'ui_paragraphs': 'Output paragraphs',
            'title_zip_missing': 'JSZip load failed',
            'status_zip_missing': 'Could not load ZIP library. Fallback to text?',
            'btn_retry': 'Retry',
            'btn_cancel': 'Cancel',
            'status_esc_hint': 'Press <b>ESC</b> to cancel and choose how to save',
            'title_cancel': 'Export cancelled',
            'status_cancel': 'Choose to continue attachments or save as text',
            'banner_top': '📎 Attachments merged as Markdown links (Text-only export)',
            'attachments_section': 'Attachments',
            'attachments_link_unavailable': 'link unavailable'
            }
        };

    function t(key, params = {}) {
        let str = translations[lang][key] || key;
        // Legacy support for single parameter
        if (typeof params !== 'object' || params === null) {
            str = str.replace(/{s}/g, params);
            return str;
        }
        for (const pKey in params) {
            str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
        }
        return str;
    }

    // ==========================================
    // 1. 样式与 UI (全平台响应式优化版)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        /* 全局遮罩层 */
        #ai-overlay-v14 {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); z-index: 2147483647;
            display: flex; justify-content: center; align-items: center;
            font-family: 'Google Sans', Roboto, -apple-system, sans-serif;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            animation: ai-fade-in 0.2s ease-out;
        }
        
        @keyframes ai-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 主弹窗 */
        #ai-box {
            background: white; 
            padding: 32px; 
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 92%; 
            max-width: 560px;
            text-align: center; 
            position: relative;
            animation: ai-slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes ai-slide-up {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .ai-title { 
            font-size: 26px; 
            font-weight: 700; 
            margin-bottom: 16px; 
            color: #202124;
            letter-spacing: -0.5px;
        }
        .ai-banner {
            background: #fff7cd;
            color: #5f6368;
            padding: 10px 12px;
            border-radius: 10px;
            margin-bottom: 14px;
            font-size: 13px;
        }
        
        .ai-status { 
            font-size: 15px; 
            margin-bottom: 24px; 
            line-height: 1.7; 
            color: #5f6368; 
            word-break: break-word; 
            white-space: pre-wrap;
        }
        
        .ai-count { 
            font-size: 14px; 
            font-weight: 600; 
            color: #5f6368; 
            margin-top: 8px;
            line-height: 1.6;
            white-space: pre-line;
        }
        
        .ai-btn-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .ai-btn {
            background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
            color: white; 
            border: none; 
            padding: 14px 32px;
            border-radius: 12px; 
            cursor: pointer; 
            font-size: 16px; 
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
            transition: all 0.2s ease;
            flex: 1;
            max-width: 150px;
        }
        .ai-btn[disabled] {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        .ai-btn-secondary {
            background: linear-gradient(135deg, #5f6368 0%, #3c4043 100%);
        }
        
        .ai-btn-secondary:hover {
            background: linear-gradient(135deg, #4a4d51 0%, #2d3033 100%);
        }
        
        .ai-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(26, 115, 232, 0.4);
        }
        
        .ai-btn:active {
            transform: translateY(0);
        }
        
        .ai-red { 
            color: #d93025; 
            font-weight: 700; 
        }
        .ai-hint {
            color: #5f6368;
            font-size: 13px;
            align-self: center;
        }

        /* 悬浮按钮 - PC 默认样式 */
        .ai-entry {
            position: fixed; 
            z-index: 2147483646;
            padding: 14px 28px;
            background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
            color: white;
            border: none;
            border-radius: 50px; 
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
            font-weight: 700;
            font-size: 15px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            top: 80px; 
            right: 28px;
            letter-spacing: -0.3px;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .ai-entry:hover { 
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 8px 24px rgba(26, 115, 232, 0.5);
        }
        
        .ai-entry:active {
            transform: scale(1.02);
        }

        /* ========================================== */
        /* 平板适配 (600px - 900px) */
        /* ========================================== */
        @media (max-width: 900px) and (min-width: 601px) {
            .ai-entry {
                top: 70px;
                right: 24px;
                padding: 12px 24px;
                font-size: 14px;
            }
            #ai-box {
                max-width: 420px;
                padding: 28px;
            }
            .ai-title { font-size: 22px; }
            .ai-count { font-size: 14px; }
        }

        /* ========================================== */
        /* 手机适配 (最大 600px) */
        /* ========================================== */
        @media (max-width: 600px) {
            .ai-entry {
                /* 移动端：右下角悬浮球 */
                top: auto; 
                bottom: 140px; 
                right: 16px;
                padding: 16px 20px;
                font-size: 14px;
                min-width: 56px;
                min-height: 56px; /* 符合移动端 44-56px 最小触控标准 */
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 24px rgba(26, 115, 232, 0.6);
            }
            
            #ai-box {
                padding: 24px 20px;
                border-radius: 16px;
                width: 92%;
                max-width: none;
            }
            
            .ai-title { 
                font-size: 20px;
                margin-bottom: 12px;
            }
            
            .ai-status {
                font-size: 14px;
                margin-bottom: 20px;
            }
            
            .ai-count { 
                font-size: 14px;
                margin-top: 8px;
            }
            
            .ai-btn {
                padding: 12px 28px;
                font-size: 15px;
                border-radius: 10px;
                width: 100%;
                max-width: 200px;
            }
        }

        /* ========================================== */
        /* 超小屏幕适配 (最大 360px) */
        /* ========================================== */
        @media (max-width: 360px) {
            .ai-entry {
                bottom: 130px;
                right: 12px;
                padding: 14px 16px;
                font-size: 13px;
            }
            
            #ai-box {
                padding: 20px 16px;
            }
            
            .ai-title { font-size: 18px; }
            .ai-count { font-size: 13px; }
            .ai-status { font-size: 13px; }
        }

        /* 深色模式适配 */
        @media (prefers-color-scheme: dark) {
            #ai-overlay-v14 {
                background: rgba(0, 0, 0, 0.92);
            }
            #ai-box {
                background: #202124;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            }
            .ai-title { color: #e8eaed; }
            .ai-status { color: #9aa0a6; }
            .ai-count { color: #9aa0a6; }
        }
        
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. 状态管理
    // ==========================================
    let isRunning = false;
    let hasFinished = false;
    let collectedData = new Map();
    let turnOrder = []; // Array to store turn IDs in the correct order
    let processedTurnIds = new Set();
    let overlay, titleEl, statusEl, countEl, closeBtn;
    let exportMode = null; // 'full' or 'text'
    let cachedExportBlob = null;
    let cancelRequested = false;
    let isHandlingEscape = false;
    const EMBED_JSZIP_BASE64 = '';
    const DISABLE_SCRIPT_INJECTION = true;
    const ATTACHMENT_COMBINED_FALLBACK = true;
    const ATTACHMENT_MAX_DIST = 160;
    const scannedAttachmentTurns = new Set();
    const ATTACHMENT_SCAN_CONCURRENCY = 3;
    const JSZIP_URLS = [
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.js',
        'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
        'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js'
    ];

    // ==========================================
    // 3. UI 逻辑
    // ==========================================
    function createEntryButton() {
        if (document.getElementById('ai-entry-btn-v14')) return;
        const btn = document.createElement('button');
        btn.id = 'ai-entry-btn-v14';
        btn.className = 'ai-entry';
        btn.innerHTML = t('btn_export');
        btn.onclick = startProcess;
        document.body.appendChild(btn);
    }

    function initUI() {
        if (document.getElementById('ai-overlay-v14')) {
            overlay.style.display = 'flex';
            return;
        }
        overlay = document.createElement('div');
        overlay.id = 'ai-overlay-v14';
        overlay.innerHTML = `
            <div id="ai-box">
                <div class="ai-title">${t('title_ready')}</div>
                <div class="ai-banner">${t('banner_top')}</div>
                <div class="ai-status">${t('status_init')}</div>
                <div class="ai-count">0</div>
                <div class="ai-btn-container">
                    <button id="ai-save-btn" class="ai-btn">${t('btn_save')}</button>
                    <button id="ai-close-btn" class="ai-btn ai-btn-secondary">${t('btn_close')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        titleEl = overlay.querySelector('.ai-title');
        statusEl = overlay.querySelector('.ai-status');
        countEl = overlay.querySelector('.ai-count');
        closeBtn = overlay.querySelector('#ai-close-btn');
        const saveBtn = overlay.querySelector('#ai-save-btn');

        closeBtn.onclick = () => { overlay.style.display = 'none'; };
        saveBtn.onclick = async () => {
            if (cachedExportBlob) {
                downloadBlob(cachedExportBlob, `Gemini_Chat_v14_${Date.now()}.${exportMode === 'full' ? 'zip' : 'md'}`);
                return;
            }
            try {
                const result = await downloadCollectedData();
                if (!result) {
                    updateUI('ERROR', t('err_no_data'));
                }
            } catch (err) {
                console.error("Failed to re-download file:", err);
                debugLog((t('err_runtime') + (err && err.message ? err.message : '')), 'error');
                updateUI('ERROR', t('err_runtime') + err.message);
            }
        };
    }

    function computeCounts(order, map, includeUser = false) {
        const turns = order.length;
        let paragraphs = 0;
        for (const id of order) {
            const item = map.get(id);
            if (!item) continue;
            if (item.role === ROLE_GEMINI && item.thoughts) paragraphs++;
            const textOut = (item.text || '').trim();
            if (textOut.length > 0) {
                if (includeUser) {
                    paragraphs++;
                } else if (item.role !== ROLE_USER) {
                    paragraphs++;
                }
            }
        }
        return { turns, paragraphs };
    }

    function getDualCounts() {
        return computeCounts(turnOrder, collectedData, false);
    }

    function resetExportState() {
        collectedData.clear();
        turnOrder = [];
        processedTurnIds.clear();
        scannedAttachmentTurns.clear();
        cachedExportBlob = null;
        cancelRequested = false;
        hasFinished = false;
    }

    // 更新遮罩界面状态（支持多种流程状态）
    // Update overlay UI state (supports multiple workflow states)
    function updateUI(state, msg = "") {
        initUI();
        const saveBtn = overlay.querySelector('#ai-save-btn');
        const btnContainer = overlay.querySelector('.ai-btn-container');
        btnContainer.style.display = 'none';
        // Hide any mode-selection buttons by default; only show them from showModeSelection()
        btnContainer.querySelectorAll('.ai-mode-btn').forEach(btn => btn.style.display = 'none');

        if (state === 'COUNTDOWN') {
            titleEl.innerText = t('title_countdown');
            statusEl.innerHTML = t('status_countdown', msg);
            countEl.style.display = 'none';
            countEl.innerText = '';
        } else if (state === 'SCROLLING') {
            titleEl.innerText = t('title_scrolling');
            statusEl.innerHTML = t('status_scrolling');
            countEl.style.display = 'block';
            const { turns, paragraphs } = getDualCounts();
            countEl.innerText = `${t('ui_turns')}: ${turns}\n${t('ui_paragraphs')}: ${paragraphs}`;
        } else if (state === 'PACKAGING') {
            titleEl.innerText = t('title_scrolling');
            statusEl.innerHTML = msg + '<br>' + t('status_esc_hint');
            countEl.style.display = 'none';
        } else if (state === 'FINISHED') {
            titleEl.innerText = t('title_finished');
            statusEl.innerHTML = t('status_finished');
            const { turns, paragraphs } = getDualCounts();
            countEl.innerText = `${t('ui_turns')}: ${turns}\n${t('ui_paragraphs')}: ${paragraphs}`;
            btnContainer.style.display = 'flex';
            saveBtn.style.display = 'inline-block';
            closeBtn.style.display = 'inline-block';
        } else if (state === 'ERROR') {
            titleEl.innerText = t('title_error');
            statusEl.innerHTML = `<span class="ai-red">${msg}</span>`;
            debugLog(msg, 'error');
            btnContainer.style.display = 'flex';
            closeBtn.style.display = 'inline-block';
        }
    }

    // 显示导出模式选择（附件/纯文本）
    // Show export mode selection (attachments/text-only)
    function showModeSelection() {
        return new Promise((resolve, reject) => {
            initUI();
            titleEl.innerText = t('title_mode_select');
            statusEl.innerHTML = t('status_mode_select');
            countEl.innerText = '';

            const btnContainer = overlay.querySelector('.ai-btn-container');
            // Hide the persistent save/close pair while in mode-selection UI
            const saveBtn = overlay.querySelector('#ai-save-btn');
            const closeBtnEl = overlay.querySelector('#ai-close-btn');
            if (saveBtn) saveBtn.style.display = 'none';
            if (closeBtnEl) closeBtnEl.style.display = 'none';

            btnContainer.style.display = 'flex';
            // Remove any previously created mode buttons but keep save/close
            btnContainer.querySelectorAll('.ai-mode-btn').forEach(btn => btn.remove());

            // Helper to create buttons
            const createModeButton = (id, text, isPrimary, onClick) => {
                const btn = document.createElement('button');
                btn.id = id;
                btn.className = (isPrimary ? 'ai-btn' : 'ai-btn ai-btn-secondary') + ' ai-mode-btn';
                btn.textContent = text;
                btn.onclick = onClick;
                btnContainer.appendChild(btn);
                return btn;
            };

            const fullBtn = createModeButton('ai-mode-full', t('btn_mode_full'), true, () => {
                exportMode = 'full';
                resolve('full');
            });
            fullBtn.disabled = true;
            const fullHint = document.createElement('span');
            fullHint.className = 'ai-hint';
            fullHint.textContent = '（已合并至纯文本）';
            btnContainer.appendChild(fullHint);

            createModeButton('ai-mode-text', t('btn_mode_text'), false, () => {
                exportMode = 'text';
                resolve('text');
            });

            createModeButton('ai-mode-close', t('btn_close'), false, () => {
                overlay.style.display = 'none';
                reject(new Error('Export cancelled by user.'));
            });
        });
    }

    function debugLog(message, level = 'info') {
        try {
            if (!overlay) initUI();
            if (!statusEl) return;
            const line = document.createElement('div');
            if (level === 'error') {
                line.className = 'ai-red';
            }
            line.textContent = message;
            statusEl.appendChild(line);
        } catch (_) {}
    }

    window.addEventListener('error', (e) => {
        const msg = e && e.message ? e.message : 'Script error';
        debugLog(msg, 'error');
    });
    window.addEventListener('unhandledrejection', (e) => {
        const reason = e && e.reason ? (e.reason.message || String(e.reason)) : 'Unhandled rejection';
        debugLog(reason, 'error');
    });

    // 当 ZIP 库不可用时的回退提示（纯文本/重试/取消）
    // Fallback prompt when ZIP library is unavailable (text/retry/cancel)
    function showZipFallbackPrompt() {
        return new Promise((resolve) => {
            initUI();
            titleEl.innerText = t('title_zip_missing');
            statusEl.innerHTML = t('status_zip_missing');
            countEl.innerText = '';
            const btnContainer = overlay.querySelector('.ai-btn-container');
            const saveBtn = overlay.querySelector('#ai-save-btn');
            const closeBtnEl = overlay.querySelector('#ai-close-btn');
            if (saveBtn) saveBtn.style.display = 'none';
            if (closeBtnEl) closeBtnEl.style.display = 'none';
            btnContainer.style.display = 'flex';
            btnContainer.querySelectorAll('.ai-mode-btn').forEach(btn => btn.remove());

            const createModeButton = (id, text, isPrimary, onClick) => {
                const btn = document.createElement('button');
                btn.id = id;
                btn.className = (isPrimary ? 'ai-btn' : 'ai-btn ai-btn-secondary') + ' ai-mode-btn';
                btn.textContent = text;
                btn.onclick = onClick;
                btnContainer.appendChild(btn);
            };

            createModeButton('ai-fallback-text', t('btn_mode_text'), true, () => {
                exportMode = 'text';
                resolve('text');
            });

            createModeButton('ai-retry-zip', t('btn_retry'), false, () => {
                resolve('retry');
            });

            createModeButton('ai-cancel', t('btn_cancel'), false, () => {
                overlay.style.display = 'none';
                resolve('cancel');
            });
        });
    }

    // 用户按下 ESC 的取消提示（选择继续打包或改为纯文本）
    // Cancel prompt when user presses ESC (continue attachments or text-only)
    function showCancelPrompt() {
        return new Promise((resolve) => {
            initUI();
            titleEl.innerText = t('title_cancel');
            statusEl.innerHTML = t('status_cancel');
            countEl.innerText = '';
            const btnContainer = overlay.querySelector('.ai-btn-container');
            const saveBtn = overlay.querySelector('#ai-save-btn');
            const closeBtnEl = overlay.querySelector('#ai-close-btn');
            if (saveBtn) saveBtn.style.display = 'none';
            if (closeBtnEl) closeBtnEl.style.display = 'none';
            btnContainer.style.display = 'flex';
            btnContainer.querySelectorAll('.ai-mode-btn').forEach(btn => btn.remove());

            const createModeButton = (id, text, isPrimary, onClick) => {
                const btn = document.createElement('button');
                btn.id = id;
                btn.className = (isPrimary ? 'ai-btn' : 'ai-btn ai-btn-secondary') + ' ai-mode-btn';
                btn.textContent = text;
                btn.onclick = onClick;
                btnContainer.appendChild(btn);
            };

            createModeButton('ai-cancel-text', t('btn_mode_text'), true, () => resolve('text'));
            createModeButton('ai-cancel-retry', t('btn_retry'), false, () => resolve('retry'));
            createModeButton('ai-cancel-close', t('btn_cancel'), false, () => resolve('cancel'));
        });
    }

    // ==========================================
    // 4. 核心流程
    // ==========================================
    // 导出主流程：模式选择 → 倒计时 → 采集 → 导出
    // Main export flow: mode select → countdown → capture → export
    async function startProcess() {
        if (isRunning) return;
        resetExportState();

        autoFixFormFieldAttributes();

        // 显示模式选择
        try {
            await showModeSelection();
        } catch (e) {
            dlog('Export cancelled.');
            // isRunning is still false here, so no cleanup needed
            return;
        }

        isRunning = true; // Enable global ESC handler only after mode is selected

        for (let i = 3; i > 0; i--) {
            updateUI('COUNTDOWN', i);
            await sleep(1000);
        }

        let scroller = findRealScroller();

        // 移动端增强激活逻辑
        if (!scroller || scroller.scrollHeight <= scroller.clientHeight) {
            dlog("尝试主动激活滚动容器...");
            // 先尝试滚动 window
            window.scrollBy(0, 1);
            await sleep(100);
            scroller = findRealScroller();
        }

        // 如果还是找不到，尝试触摸激活
        if (!scroller || scroller.scrollHeight <= scroller.clientHeight) {
            dlog("尝试触摸激活...");
            const bubble = document.querySelector('ms-chat-turn');
            if (bubble) {
                bubble.scrollIntoView({ behavior: 'instant' });
                await sleep(200);
                scroller = findRealScroller();
            }
        }

        if (!scroller) {
            endProcess("ERROR", t('err_no_scroller'));
            return;
        }

        updateUI('SCROLLING', 0);

        // ========================================
        // 智能跳转：使用滚动条按钮直接跳到第一个对话
        // ========================================
        dlog("尝试使用滚动条按钮跳转到第一个对话...");

        // 查找所有对话轮次按钮
        const scrollbarButtons = document.querySelectorAll('button[id^="scrollbar-item-"]');
        dlog(`找到 ${scrollbarButtons.length} 个对话轮次按钮`);

        if (scrollbarButtons.length > 0) {
            // 点击第一个按钮（最早的对话）
            const firstButton = scrollbarButtons[0];
            dlog("点击第一个对话按钮:", firstButton.getAttribute('name') || firstButton.id);
            firstButton.click();

            // 等待跳转和渲染
            await sleep(1500);
            dlog("跳转后 scrollTop:", scroller.scrollTop);
        } else {
            dlog("未找到滚动条按钮，使用备用方案...");
        }

        // 备用方案：如果按钮不存在或跳转失败，逐步向上滚动
        const initialScrollTop = scroller.scrollTop;
        if (initialScrollTop > 500) {
            dlog("执行备用滚动方案，当前 scrollTop:", initialScrollTop);
            let currentPos = initialScrollTop;
            let upwardAttempts = 0;
            const maxUpwardAttempts = 15; // 减少尝试次数

            while (currentPos > 100 && upwardAttempts < maxUpwardAttempts) {
                upwardAttempts++;

                // 每次向上滚动一个视口高度
                const scrollAmount = Math.min(window.innerHeight, currentPos);
                scroller.scrollBy({ top: -scrollAmount, behavior: 'smooth' });

                await sleep(500);

                const newPos = scroller.scrollTop;
                dlog(`向上滚动 ${upwardAttempts}/${maxUpwardAttempts}: ${currentPos} → ${newPos}`);

                // 如果卡住了，尝试直接设置
                if (Math.abs(newPos - currentPos) < 10) {
                    dlog("检测到卡住，尝试直接设置...");
                    scroller.scrollTop = Math.max(0, currentPos - scrollAmount);
                    await sleep(300);
                }

                currentPos = scroller.scrollTop;

                // 如果已经到顶部附近，退出
                if (currentPos < 100) {
                    break;
                }
            }
        }

        // 最终确保到达顶部
        dlog("执行最终回到顶部，当前 scrollTop:", scroller.scrollTop);
        scroller.scrollTop = 0;
        await sleep(500);

        // 再次确认
        if (scroller.scrollTop > 10) {
            scroller.scrollTo({ top: 0, behavior: 'instant' });
            await sleep(500);
        }

        dlog("✓ 回到顶部完成，最终 scrollTop:", scroller.scrollTop);

        // 等待 DOM 稳定
        await sleep(800);





        let lastScrollTop = -9999;
        let stuckCount = 0;

        try {
            while (isRunning) {
                await captureData(scroller);
                updateUI('SCROLLING', collectedData.size);

                scroller.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });

                await sleep(900);

                const currentScroll = scroller.scrollTop;

                if (Math.abs(currentScroll - lastScrollTop) <= 2) {
                    stuckCount++;
                    if (stuckCount >= 3) {
                        dlog("判定到底", currentScroll);
                        break;
                    }
                } else {
                    stuckCount = 0;
                }
                lastScrollTop = currentScroll;
            }
        } catch (e) {
            console.error(e);
            endProcess("ERROR", t('err_runtime') + e.message);
            return;
        }

        endProcess("FINISHED");
    }

    function autoFixFormFieldAttributes() {
        try {
            const fields = document.querySelectorAll(
                'input[autocomplete]:not([name]), textarea[autocomplete]:not([name]), select[autocomplete]:not([name])'
            );
            let i = 0;
            fields.forEach(el => {
                const nm = 'ai_exporter_field_' + (i++);
                el.setAttribute('name', nm);
            });
            if (fields.length > 0) debugLog('Auto-assigned name for ' + fields.length + ' form fields');
        } catch (_) {}
    }

    // ==========================================
    // 5. 辅助功能
    // ==========================================

    // Shared Regex Constants
    // Capture: 1=Alt/Text, 2=URL, 3=Optional title (supports ')' in URL and single/double-quoted titles)
    const IMG_REGEX = /!\[([^\]]*)\]\((.+?)(\s+["'][^"']*["'])?\)/g;
    const LINK_REGEX = /\[([^\]]*)\]\((.+?)(\s+["'][^"']*["'])?\)/g;
    const ROLE_USER = 'User';
    const ROLE_GEMINI = 'Gemini';
    const ROLE_GEMINI_THOUGHTS = 'Gemini-Thoughts';

    function findRealScroller() {
        // Prioritize finding chat turns within the main content area to avoid sidebars
        const bubble = document.querySelector('main ms-chat-turn') || document.querySelector('ms-chat-turn');
        if (!bubble) {
            return document.querySelector('div[class*="scroll"]') || document.body;
        }

        let el = bubble.parentElement;
        while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight >= el.clientHeight) {
                return el;
            }
            el = el.parentElement;
    }
    return document.documentElement;
}

function normalizeHref(href) {
    try {
        const raw = String(href || '').trim();
        if (!raw || raw === '#') return '';
        const u = new URL(raw, window.location.href);
        return u.href;
    } catch (_) {
        return '';
    }
}

function filterHref(href) {
        if (!href) return false;
        const lower = href.toLowerCase();
        if (lower.startsWith('http:') || lower.startsWith('https:')) return true;
        if (ATTACHMENT_COMBINED_FALLBACK && lower.startsWith('blob:')) return true;
        return false;
}

function extractDownloadLinksFromTurn(el) {
    const links = [];
    const isDownloadish = (href, a) => {
        if (!href) return false;
        const h = href.toLowerCase();
        const hasDownloadAttr = !!(a && a.getAttribute('download'));
        const tokenMatch = h.includes('/download') || h.includes('download=true') || h.includes('/dl/');
        const extMatch = /(\.zip|\.pdf|\.png|\.jpe?g|\.gif|\.webp|\.mp4|\.mov|\.tgz|\.tar\.gz|\.exe|\.rar|\.7z|\.csv|\.txt|\.json|\.md|\.xlsx|\.docx)(?:$|[?#])/i.test(h);
        let hostMatch = false;
        try {
            const u = new URL(href, window.location.href);
            const host = u.hostname.toLowerCase();
            hostMatch = [
                's3.amazonaws.com',
                'googleapis.com',
                'storage.googleapis.com',
                'drive.google.com',
                'blob.core.windows.net',
                'googleusercontent.com'
            ].some(domain => host === domain || host.endsWith('.' + domain));
        } catch (_) {}
        const schemeMatch = h.startsWith('blob:') || h.startsWith('data:');
        return hasDownloadAttr || tokenMatch || extMatch || hostMatch || schemeMatch;
    };
    const icons = el.querySelectorAll('span.material-symbols-outlined, span.ms-button-icon-symbol');
    icons.forEach(sp => {
        const txt = (sp.textContent || '').trim().toLowerCase();
        if (txt === 'download' || txt === '下载') {
            const a = sp.closest('a') || sp.parentElement?.querySelector('a[href]');
            const href = normalizeHref(a?.getAttribute('href') || '');
            if (filterHref(href)) links.push(href);
        }
    });
    const anchors = el.querySelectorAll('a[href]');
    anchors.forEach(a => {
        const href = normalizeHref(a.getAttribute('href') || '');
        if (isDownloadish(href, a) && filterHref(href)) links.push(href);
    });
    return Array.from(new Set(links));
}

    async function captureData(scroller = document) {
        // Scope the query to the scroller container to avoid capturing elements from other parts of the page
        const turns = scroller.querySelectorAll('ms-chat-turn');

        // Helper to derive a stable turn id from container or inner chunks
        const getTurnId = (el) => {
            if (el.id) return el.id;
            const chunk = el.querySelector('ms-prompt-chunk[id], ms-response-chunk[id], ms-thought-chunk[id]');
            return chunk ? chunk.id : null;
        };

        // Update turn order based on visible turns
        const visibleTurnIds = Array.from(new Set(Array.from(turns)
            .filter(t => t.offsetParent !== null && window.getComputedStyle(t).visibility !== 'hidden')
            .map(t => getTurnId(t))
            .filter(id => !!id)));
        updateTurnOrder(visibleTurnIds);

        for (const turn of turns) {
            // Check if the element is visible (offsetParent is null for hidden elements)
            if (turn.offsetParent === null || window.getComputedStyle(turn).visibility === 'hidden') continue;

            const turnId = getTurnId(turn);
            if (!turnId) continue;

            const role = (turn.querySelector('[data-turn-role="Model"]') || turn.querySelector('[class*="model-prompt-container"]')) ? ROLE_GEMINI : ROLE_USER;
            const existing = collectedData.get(turnId) || { role };
            const hasThoughtChunkNow = role === ROLE_GEMINI && !!turn.querySelector('ms-thought-chunk');

            if (processedTurnIds.has(turnId) && !(role === ROLE_GEMINI && !existing.thoughts && hasThoughtChunkNow)) continue;

            // Extract download links from the original turn before stripping UI-only elements
            let dlLinks = extractDownloadLinksFromTurn(turn);
            if (dlLinks.length > 0) {
                const prev = existing.attachments || [];
                existing.attachments = Array.from(new Set([...prev, ...dlLinks]));
            }

            if ((!existing.attachments || existing.attachments.length === 0) && !scannedAttachmentTurns.has(turnId)) {
                const imgs = Array.from(turn.querySelectorAll('img'));
                const found = [];
                existing.attachmentScanAttempted = true;
                const scanImg = async (img) => {
                    const r1 = img.getBoundingClientRect();
                    img.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                    img.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                    await sleep(80);
                    const spans = turn.querySelectorAll('span.material-symbols-outlined, span.ms-button-icon-symbol');
                    spans.forEach(sp => {
                        const txt = (sp.textContent || '').trim().toLowerCase();
                        if (txt !== 'download' && txt !== '下载') return;
                        const a = sp.closest('a') || sp.parentElement?.querySelector('a[href]');
                        if (a) {
                            const r2 = a.getBoundingClientRect();
                            const cx1 = (r1.left + r1.right) / 2, cy1 = (r1.top + r1.bottom) / 2;
                            const cx2 = (r2.left + r2.right) / 2, cy2 = (r2.top + r2.bottom) / 2;
                            const dist = Math.hypot(cx1 - cx2, cy1 - cy2);
                            if (dist < ATTACHMENT_MAX_DIST) {
                                const href = a?.getAttribute('href') || '';
                                if (filterHref(href)) found.push(href);
                            }
                        }
                    });
                    img.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                };
                await Promise.all(imgs.map(img => scanImg(img)));
                if (found.length > 0) {
                    const prev = existing.attachments || [];
                    existing.attachments = Array.from(new Set([...prev, ...found]));
                }
                scannedAttachmentTurns.add(turnId);
            }

            const clone = turn.cloneNode(true);
            const trash = ['.actions-container', '.turn-footer', 'button', 'mat-icon', 'ms-grounding-sources', 'ms-search-entry-point', '.role-label', '.ms-role-tag', 'svg', '.author-label'];
            trash.forEach(s => clone.querySelectorAll(s).forEach(e => e.remove()));

            if (role === ROLE_GEMINI) {
                const thoughtChunk = clone.querySelector('ms-thought-chunk');
                if (thoughtChunk) {
                    const thoughtsText = cleanMarkdown(htmlToMarkdown(thoughtChunk));
                    thoughtChunk.remove();
                    if (thoughtsText.length > 0 && !existing.thoughts) {
                        existing.thoughts = thoughtsText;
                    }
                }
            }

            const text = cleanMarkdown(htmlToMarkdown(clone));
            if (text.length > 0 && !existing.text) {
                existing.text = text;
            }

            if (existing.text || existing.thoughts || (Array.isArray(existing.attachments) && existing.attachments.length > 0)) {
                collectedData.set(turnId, existing);
                if (role === ROLE_USER || (role === ROLE_GEMINI && !!existing.text)) {
                    processedTurnIds.add(turnId);
                }
            }
        }
    }

    function findLastCommonIdx(newIds, oldOrder) {
        for (let i = newIds.length - 1; i >= 0; i--) {
            if (oldOrder.includes(newIds[i])) return i;
        }
        return -1;
    }

    function mergeWithOverlap(oldOrder, newIds) {
        const oldIdSet = new Set(oldOrder);
        const result = [...oldOrder];
        newIds.forEach((newId, index) => {
            if (!oldIdSet.has(newId)) {
                let prevInOldIdx = -1;
                for (let i = index - 1; i >= 0; i--) {
                    const neighborId = newIds[i];
                    const pos = result.indexOf(neighborId);
                    if (pos !== -1) { prevInOldIdx = pos; break; }
                }
                result.splice(prevInOldIdx + 1, 0, newId);
            }
        });
        return result;
    }

    function appendDisjointIds(oldOrder, newIds) {
        return [...oldOrder, ...newIds];
    }

    function updateTurnOrder(newIds) {
        if (!newIds || newIds.length === 0) return;
        if (turnOrder.length === 0) {
            turnOrder = [...newIds];
            return;
        }
        const firstCommonIdx = newIds.findIndex(id => turnOrder.includes(id));
        if (firstCommonIdx !== -1) {
            turnOrder = mergeWithOverlap(turnOrder, newIds);
        } else {
            turnOrder = appendDisjointIds(turnOrder, newIds);
        }
        turnOrder = [...new Set(turnOrder)];
    }

    function htmlToMarkdown(node, listContext = null, indent = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const tag = node.tagName.toLowerCase();

        // Images
        if (tag === 'img') {
            const alt = node.getAttribute('alt') || '';
            const src = node.getAttribute('src') || '';
            return `![${alt}](${src})`;
        }

        // Code blocks
        if (tag === 'pre') {
            const codeEl = node.querySelector('code');
            if (codeEl) {
                const language = Array.from(codeEl.classList).find(c => c.startsWith('language-'))?.replace('language-', '') || '';
                const code = codeEl.textContent;
                return `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
            }
        }

        // Inline code
        if (tag === 'code') {
            const text = node.textContent;
            // Handle backticks inside inline code for correct Markdown rendering.
            if (text.includes('`')) {
                return `\`\` ${text} \`\``;
            }
            return `\`${text}\``;
        }

        // Headings
        if (/^h[1-6]$/.test(tag)) {
            const level = parseInt(tag[1]);
            return '\n' + '#'.repeat(level) + ' ' + getChildrenText(node, listContext, indent) + '\n';
        }

        // Bold
        if (tag === 'strong' || tag === 'b') {
            return `**${getChildrenText(node, listContext, indent)}**`;
        }

        // Italic
        if (tag === 'em' || tag === 'i') {
            return `*${getChildrenText(node, listContext, indent)}*`;
        }

        // Links
        if (tag === 'a') {
            const href = node.getAttribute('href') || '';
            const text = getChildrenText(node, listContext, indent);
            return `[${text}](${href})`;
        }

        // Lists - pass context to children
        if (tag === 'ul' || tag === 'ol') {
            const listType = tag; // 'ul' or 'ol'
            let index = 0;
            let result = '\n';

            for (const child of node.childNodes) {
                if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
                    index++;
                    // Pass indent + 1 to children
                    result += htmlToMarkdown(child, { type: listType, index: index }, indent + 1);
                } else {
                    // Pass indent + 1 to children even if not li (e.g. nested ul)
                    result += htmlToMarkdown(child, listContext, indent + 1);
                }
            }

            return result + '\n';
        }

        // List items - use context to determine format
        if (tag === 'li') {
            // Children of li are at the same indent level as the li itself (which is already indented by parent)
            const content = getChildrenText(node, listContext, indent);
            // Render bullet at indent - 1
            const indentStr = '  '.repeat(Math.max(0, indent - 1));
            if (listContext && listContext.type === 'ol') {
                return `${indentStr}${listContext.index}. ${content}\n`;
            } else {
                return `${indentStr}- ${content}\n`;
            }
        }

        // Line breaks
        if (tag === 'br') {
            return '  \n';
        }

        // Blockquotes - prefix each line with >
        if (tag === 'blockquote') {
            const content = getChildrenText(node, listContext, indent);
            // Split by lines and prefix each with "> "
            return '\n' + content.split('\n')
                .map(line => `> ${line}`)
                .join('\n') + '\n';
        }

        // Block elements
        if (['div', 'p'].includes(tag)) {
            return '\n' + getChildrenText(node, listContext, indent) + '\n';
        }

        return getChildrenText(node, listContext, indent);
    }

    function getChildrenText(node, listContext = null, indent = 0) {
        return Array.from(node.childNodes).map(child => htmlToMarkdown(child, listContext, indent)).join('');
    }

    function cleanMarkdown(str) {
        return str.trim().replace(/\n{3,}/g, '\n\n');
    }

    // Helper: Get role name for display
    function getRoleName(role) {
        switch (role) {
            case ROLE_GEMINI_THOUGHTS:
                return t('role_thoughts');
            case ROLE_GEMINI:
                return t('role_gemini');
            case ROLE_USER:
                return t('role_user');
            default:
                return role; // 为未知的角色类型提供回退
        }
    }

    // Normalize: merge consecutive Gemini-thoughts-only into next Gemini text within the same segment
    function normalizeConversation() {
        if (turnOrder.length === 0 || collectedData.size === 0) return;
        const newOrder = [];
        const newMap = new Map();

        for (let i = 0; i < turnOrder.length; i++) {
            const id = turnOrder[i];
            const item = collectedData.get(id);
            if (!item) continue;

            if (item.role === ROLE_GEMINI && item.thoughts && !item.text) {
                let merged = false;
                for (let j = i + 1; j < turnOrder.length; j++) {
                    const nextId = turnOrder[j];
                    const nextItem = collectedData.get(nextId);
                    if (!nextItem) continue;
                    if (nextItem.role === ROLE_USER) break;
                    if (nextItem.role === ROLE_GEMINI && nextItem.text) {
                        nextItem.thoughts = nextItem.thoughts
                            ? (item.thoughts + '\n\n' + nextItem.thoughts)
                            : item.thoughts;
                        collectedData.set(nextId, nextItem);
                        merged = true;
                        break;
                    }
                }
                if (merged) {
                    continue; // skip adding this thoughts-only entry
                }
            }

            newOrder.push(id);
            newMap.set(id, item);
        }

        turnOrder = newOrder;
        collectedData = newMap;
    }

    // 统计导出内容的段落数（不含 User 段落）
    // Count exported paragraphs (excluding User paragraphs)
    function countParagraphs() {
        return computeCounts(turnOrder, collectedData, false).paragraphs;
    }

    // Helper: Download text-only mode
    // 仅文本导出：生成 Markdown 并下载
    // Text-only export: generate Markdown and download
    async function downloadTextOnly() {
        let content = `# ${t('file_header')}` + "\n\n";
        content += `**${t('file_time')}:** ${new Date().toLocaleString()}` + "\n\n";
        content += `**${t('file_turns')}:** ${turnOrder.length}` + "\n\n";
        content += `**${t('file_paragraphs')}:** ${countParagraphs()}` + "\n\n";
        content += "---\n\n";

        for (const id of turnOrder) {
            const item = collectedData.get(id);
            if (!item) continue;
            if (item.role === ROLE_GEMINI && item.thoughts) {
                const processedThoughts = convertResourcesToLinks(item.thoughts || '');
                content += `## ${t('role_thoughts')}\n\n${processedThoughts}\n\n`;
                content += `---\n\n`;
            }
            const roleName = getRoleName(item.role);
            const textOut = (item.text || '').trim();
            const attachmentsMd = generateAttachmentsMarkdown(item);
            if (textOut.length > 0) {
                const processedText = convertResourcesToLinks(textOut);
                content += `## ${roleName}\n\n${processedText}\n\n`;
                if (attachmentsMd) content += attachmentsMd;
                content += `---\n\n`;
            } else if (attachmentsMd) {
                content += attachmentsMd + `---\n\n`;
            }
        }

        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        cachedExportBlob = blob;
        downloadBlob(blob, `Gemini_Chat_v14_${Date.now()}.md`);
        return;
    }

    // Generic Helper: Process resources (images or files)
    // 通用打包助手：并发下载资源、支持进度与取消
    // Generic packaging helper: concurrent downloads with progress and cancel support
    async function processResources(uniqueUrls, zipFolder, config) {
        const resourceMap = new Map();

        if (uniqueUrls.size > 0) {
            updateUI('PACKAGING', t(config.statusStart, { n: uniqueUrls.size }));
            let completedCount = 0;

            const promises = Array.from(uniqueUrls).map(async (url, index) => {
                if (cancelRequested) return;
                try {
                    const blob = await fetchResource(url);
                    if (blob) {
                        const filename = config.filenameGenerator(url, index, blob);
                        zipFolder.file(filename, blob);
                        resourceMap.set(url, `${config.subDir}/${filename}`);
                    }
                } catch (e) {
                    console.error(`${config.subDir} download failed:`, url, e);
                    debugLog(`${config.subDir} download failed: ${url} (${e && e.message ? e.message : 'error'})`, 'error');
                }
                completedCount++;
                if (completedCount % 5 === 0 || completedCount === uniqueUrls.size) {
                    updateUI('PACKAGING', t(config.statusProgress, { c: completedCount, t: uniqueUrls.size }));
                }
            });

            let cancelIntervalId = null;
            const cancelWatcher = new Promise(resolve => {
                cancelIntervalId = setInterval(() => {
                    if (cancelRequested) { clearInterval(cancelIntervalId); resolve(); }
                }, 200);
            });
            try {
                await Promise.race([Promise.all(promises), cancelWatcher]);
            } finally {
                if (cancelIntervalId) clearInterval(cancelIntervalId);
            }
        }
        return resourceMap;
    }

    // Helper: Collect unique image URLs from all messages
    function collectImageUrls() {
        const uniqueUrls = new Set();
        for (const item of collectedData.values()) {
            const text = item.text || '';
            const thoughts = item.thoughts || '';

            for (const match of text.matchAll(IMG_REGEX)) {
                uniqueUrls.add(match[2]);
            }
            for (const match of thoughts.matchAll(IMG_REGEX)) {
                uniqueUrls.add(match[2]);
            }
        }
        return uniqueUrls;
    }

    // Helper: Process and download images
    async function processImages(imgFolder) {
        const uniqueUrls = collectImageUrls();
        return processResources(uniqueUrls, imgFolder, {
            subDir: 'images',
            statusStart: 'status_packaging_images',
            statusProgress: 'status_packaging_images_progress',
            filenameGenerator: (url, index, blob) => {
                const extension = (blob.type.split('/')[1] || 'png').split('+')[0];
                return `image_${index}.${extension}`;
            }
        });
    }

    // Helper: Collect unique file URLs from all messages
    function collectFileUrls() {
        const downloadableExtensions = ['.pdf', '.csv', '.txt', '.json', '.py', '.js', '.html', '.css', '.md', '.zip', '.tar', '.gz'];
        const uniqueUrls = new Set();

        const fileFilter = (match) => {
            // match[0].startsWith('!') check removed as it's ineffective for LINK_REGEX matches
            const url = match[2];
            const lowerUrl = url.toLowerCase();
            const isBlob = lowerUrl.startsWith('blob:');
            const isGoogleStorage = lowerUrl.includes('googlestorage') || lowerUrl.includes('googleusercontent');
            const hasExt = downloadableExtensions.some(ext => lowerUrl.split('?')[0].endsWith(ext));
            return isBlob || isGoogleStorage || hasExt;
        };

        for (const item of collectedData.values()) {
            const text = item.text || '';
            const thoughts = item.thoughts || '';

            for (const match of text.matchAll(LINK_REGEX)) {
                // Skip image-style markdown links: `![alt](url)`
                if (match.index > 0 && text[match.index - 1] === '!') continue;

                if (fileFilter(match)) {
                    uniqueUrls.add(match[2]);
                }
            }
            for (const match of thoughts.matchAll(LINK_REGEX)) {
                if (match.index > 0 && thoughts[match.index - 1] === '!') continue;
                if (fileFilter(match)) {
                    uniqueUrls.add(match[2]);
                }
            }
        }
        return uniqueUrls;
    }

    // Helper: Process and download files
    async function processFiles(fileFolder) {
        const uniqueUrls = collectFileUrls();
        return processResources(uniqueUrls, fileFolder, {
            subDir: 'files',
            statusStart: 'status_packaging_files',
            statusProgress: 'status_packaging_files_progress',
            filenameGenerator: (url, index, blob) => {
                let filename = "file";
                try {
                    const urlObj = new URL(url);
                    filename = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
                } catch (e) {
                    filename = url.split('/').pop().split('?')[0];
                }

                let decodedFilename = filename;
                try {
                    decodedFilename = decodeURIComponent(filename);
                } catch (e) {
                    console.warn(`Could not decode filename: ${filename}`, e);
                }
                // Increased limit from 50 to 100 as per PR review
                if (!decodedFilename || decodedFilename.length > 100) {
                    const extMatch = filename.match(/\.[^./?]+$/);
                    const ext = extMatch ? extMatch[0] : '';
                    decodedFilename = `file_${index}${ext}`;
                }
                return `${index}_${decodedFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            }
        });
    }

    // Helper: Generate Markdown content with URL replacements
    function generateMarkdownContent(imgMap, fileMap) {
        let content = `# ${t('file_header')}` + "\n\n";
        content += `**${t('file_time')}:** ${new Date().toLocaleString()}` + "\n\n";
        content += `**${t('file_turns')}:** ${turnOrder.length}` + "\n\n";
        content += `**${t('file_paragraphs')}:** ${countParagraphs()}` + "\n\n";
        content += "---\n\n";

        for (const id of turnOrder) {
            const item = collectedData.get(id);
            if (!item) continue;
            if (item.role === ROLE_GEMINI && item.thoughts) {
                let processedThoughts = item.thoughts;
                processedThoughts = processedThoughts.replace(IMG_REGEX, (match, alt, url, title) => {
                    if (imgMap.has(url)) {
                        const titleStr = title || '';
                        return `![${alt}](${imgMap.get(url)}${titleStr})`;
                    }
                    return match;
                });
                processedThoughts = processedThoughts.replace(LINK_REGEX, (match, text, url, title) => {
                    if (fileMap.has(url)) {
                        const titleStr = title || '';
                        return `[${text}](${fileMap.get(url)}${titleStr})`;
                    }
                    return match;
                });
                content += `## ${t('role_thoughts')}\n\n${processedThoughts}\n\n`;
                content += `---\n\n`;
            }

            const roleName = getRoleName(item.role);
            let processedText = (item.text || '').trim();
            const attachmentsMd = generateAttachmentsMarkdown(item);

            processedText = processedText.replace(IMG_REGEX, (match, alt, url, title) => {
                if (imgMap.has(url)) {
                    const titleStr = title || '';
                    return `![${alt}](${imgMap.get(url)}${titleStr})`;
                }
                return match;
            });
            processedText = processedText.replace(LINK_REGEX, (match, text, url, title) => {
                if (fileMap.has(url)) {
                    const titleStr = title || '';
                    return `[${text}](${fileMap.get(url)}${titleStr})`;
                }
                return match;
            });

            if (processedText.length > 0) {
                content += `## ${roleName}\n\n${processedText}\n\n`;
                if (attachmentsMd) content += attachmentsMd;
                content += `---\n\n`;
            } else if (attachmentsMd) {
                content += attachmentsMd + `---\n\n`;
            }
        }

        return content;
    }

    function toFileName(url) {
        let base = 'file';
        try {
            const u = new URL(url);
            base = u.pathname.substring(u.pathname.lastIndexOf('/') + 1) || 'file';
            if (!base || base === 'file') {
                const qp = new URLSearchParams(u.search);
                const cand = qp.get('filename') || qp.get('file') || qp.get('name');
                if (cand) base = cand;
            }
        } catch (_) {
            base = url.split('/').pop().split('?')[0] || 'file';
            if (!base || base === 'file') {
                const m = String(url).match(/[?&](?:filename|file|name)=([^&]+)/i);
                if (m) base = m[1];
            }
        }
        base = String(base).replace(/^['"]+|['"]+$/g, '');
        try {
            return decodeURIComponent(base);
        } catch (_) {
            return base;
        }
    }

    function escapeMdLabel(s) {
        return String(s || '').replace(/]/g, '\\]').replace(/\n/g, ' ');
    }

    function generateAttachmentsMarkdown(item) {
        const links = Array.isArray(item.attachments) ? item.attachments : [];
        if (links.length === 0 && !(ATTACHMENT_COMBINED_FALLBACK && item.attachmentScanAttempted)) {
            return '';
        }
        let listContent;
        if (links.length > 0) {
            listContent = links.map(u => {
                const label = escapeMdLabel(toFileName(u));
                return `- [${label}](<${u}>)`;
            }).join('\n');
        } else {
            listContent = `- ${t('attachments_link_unavailable')}`;
        }
        return `### ${t('attachments_section')}\n\n${listContent}\n\n`;
    }

    function convertResourcesToLinks(text) {
        const replacedImages = text.replace(IMG_REGEX, (match, alt, url) => {
            const name = (alt && alt.trim().length > 0) ? alt.trim() : toFileName(url);
            return `[${name}](${url})`;
        });
        const replacedLinks = replacedImages.replace(LINK_REGEX, (match, textLabel, url) => {
            const name = (textLabel && textLabel.trim().length > 0) ? textLabel.trim() : toFileName(url);
            return `[${name}](${url})`;
        });
        return replacedLinks;
    }

    // 获取 JSZip：优先使用 IIFE 外部捕获的引用
    // Get JSZip: prefer the reference captured outside IIFE
    function getJSZip() {
        // 1. 使用 IIFE 外部捕获的引用（@require 加载的）
        if (_JSZipRef) {
            return _JSZipRef;
        }
        // 2. 检查当前作用域中的 JSZip
        if (typeof JSZip !== 'undefined') {
            return JSZip;
        }
        // 3. 检查页面上下文（通过 script 标签注入的）
        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.JSZip !== 'undefined') {
            return unsafeWindow.JSZip;
        }
        // 4. 检查 window 对象
        if (typeof window !== 'undefined' && typeof window.JSZip !== 'undefined') {
            return window.JSZip;
        }
        return null;
    }

    // 加载 JSZip 的备用方案（通过 blob URL 注入脚本绕过 CSP）
    // Fallback loader for JSZip (inject script via blob URL to bypass CSP)
    async function ensureJSZip() {
        const existing = getJSZip();
        if (existing) return existing;

        if (DISABLE_SCRIPT_INJECTION) {
            debugLog('Script injection disabled due to CSP. Use @require or choose text-only.', 'error');
            return null;
        }

        // GM 注入：依次尝试多 CDN
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            for (const url of JSZIP_URLS) {
                try {
                    /* eslint-disable no-await-in-loop */
                    const lib = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url,
                            responseType: 'blob',
                            onload: (response) => {
                                try {
                                    const blobUrl = URL.createObjectURL(response.response);
                                    const script = document.createElement('script');
                                    script.src = blobUrl;
                                    script.onload = () => {
                                        URL.revokeObjectURL(blobUrl);
                                        const loaded = getJSZip();
                                        loaded ? resolve(loaded) : reject(new Error('JSZip not defined after load'));
                                    };
                                    script.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('JSZip script load failed')); };
                                    document.head.appendChild(script);
                                } catch (e) { reject(e); }
                            },
                            onerror: () => reject(new Error('JSZip download failed'))
                        });
                    });
                    if (lib) return lib;
                } catch (e) { debugLog('JSZip load failed: ' + url + ' (' + (e && e.message ? e.message : 'error') + ')', 'error'); }
            }
        }

        // script 注入：依次尝试多 CDN
        for (const url of JSZIP_URLS) {
            try {
                /* eslint-disable no-await-in-loop */
                const lib = await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = () => {
                        const loaded = getJSZip();
                        loaded ? resolve(loaded) : reject(new Error('JSZip not defined after load'));
                    };
                    script.onerror = () => reject(new Error('JSZip load failed'));
                    document.head.appendChild(script);
                });
                if (lib) return lib;
            } catch (e) { debugLog('JSZip script injection failed: ' + url + ' (' + (e && e.message ? e.message : 'error') + ')', 'error'); }
        }
        debugLog('All JSZip CDN attempts failed', 'error');
        throw new Error('All JSZip CDN attempts failed');
    }

    // Main function: orchestrate the download process
    // 导出调度：纯文本/附件模式、ZIP 生成与回退
    // Export orchestrator: text/attachments modes, ZIP generation & fallback
    async function downloadCollectedData() {
        if (collectedData.size === 0) return false;
        // Normalize conversation before exporting (affects both modes)
        normalizeConversation();

        // Text-only mode
        if (exportMode === 'text') {
            downloadTextOnly();
            return true;
        }

        // Full mode with attachments
        let JSZipLib = getJSZip();
        if (!JSZipLib) {
            try { JSZipLib = await ensureJSZip(); } catch (e) { console.error('ensureJSZip failed:', e); debugLog('ensureJSZip failed: ' + (e && e.message ? e.message : 'error'), 'error'); }
        }
        while (!JSZipLib) {
            const action = await showZipFallbackPrompt();
            if (action === 'text') {
                downloadTextOnly();
                return true;
            }
            if (action === 'retry') {
                try { JSZipLib = await ensureJSZip(); } catch (e) { console.error('ensureJSZip retry failed:', e); }
                continue;
            }
            return false;
        }
        const zip = new JSZipLib();
        const imgFolder = zip.folder("images");
        const fileFolder = zip.folder("files");

        // Process images and files in parallel (memory-efficient approach)
        const [imgMap, fileMap] = await Promise.all([
            processImages(imgFolder),
            processFiles(fileFolder)
        ]);

        // Generate final Markdown content
        const content = generateMarkdownContent(imgMap, fileMap);

        zip.file("chat_history.md", content);
        let zipBlob;
        try {
            zipBlob = await Promise.race([
                zip.generateAsync({ type: "blob" }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('ZIP timeout')), 15000))
            ]);
        } catch (e) {
            const action = await showZipFallbackPrompt();
            if (action === 'text') {
                downloadTextOnly();
                return true;
            }
            if (action === 'retry') {
                try {
                    zipBlob = await zip.generateAsync({ type: "blob" });
                } catch (_) {
                    downloadTextOnly();
                    return true;
                }
            } else {
                return false;
            }
        }
        cachedExportBlob = zipBlob;
        downloadBlob(zipBlob, `Gemini_Chat_v14_${Date.now()}.zip`);

        return true;
    }

    // 资源下载：支持 GM_xmlhttpRequest 与 fetch，并内置超时
    // Resource fetcher: supports GM_xmlhttpRequest and fetch, with timeout
    function fetchResource(url) {
        const timeoutMs = 10000;
        return new Promise((resolve) => {
            let settled = false;
            const timeout = setTimeout(() => { if (!settled) { settled = true; debugLog(`Resource fetch timed out: ${url}`, 'error'); resolve(null); } }, timeoutMs);
            const finish = (val) => { if (!settled) { settled = true; clearTimeout(timeout); resolve(val); } };

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            finish(response.response);
                        } else {
                            console.warn(`Resource fetch failed with status ${response.status}:`, url);
                            debugLog(`Resource fetch failed (${response.status}): ${url}`, 'error');
                            finish(null);
                        }
                    },
                    onerror: () => { debugLog(`Resource fetch network error: ${url}`, 'error'); finish(null); }
                });
            } else {
                fetch(url, { credentials: 'include' })
                    .then(r => {
                        if (r.ok) return r.blob();
                        debugLog(`Fetch failed (${r.status}): ${url}`, 'error');
                        return null;
                    })
                    .then(finish)
                    .catch(() => { debugLog(`Fetch error: ${url}`, 'error'); finish(null); });
            }
        });
    }

    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function endProcess(status, msg) {
        if (hasFinished) return;
        hasFinished = true;
        isRunning = false;

        if (status === "FINISHED") {
            if (collectedData.size > 0) {
                downloadCollectedData().then(() => {
                    updateUI('FINISHED', collectedData.size);
                }).catch(err => {
                    console.error("Failed to generate and download file:", err);
                    updateUI('ERROR', t('err_runtime') + err.message);
                });
            } else {
                updateUI('ERROR', t('err_no_data'));
            }
        } else {
            updateUI('ERROR', msg);
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // 全局 ESC 处理：弹出取消提示并根据选择继续或回退
    // Global ESC handler: show cancel prompt and proceed based on choice
    document.addEventListener('keydown', async e => {
        if (e.key !== 'Escape') return;
        if (!isRunning || isHandlingEscape) return;
        isHandlingEscape = true;
        try {
            cancelRequested = true;
            const choice = await showCancelPrompt();
            if (choice === 'text') {
                normalizeConversation();
                exportMode = 'text';
                try { await downloadTextOnly(); } catch (err) { debugLog('Text export failed: ' + (err && err.message ? err.message : 'error'), 'error'); }
                updateUI('FINISHED', collectedData.size);
                isRunning = false;
            } else if (choice === 'retry') {
                cancelRequested = false;
                exportMode = 'full';
                isRunning = true;
                try { await downloadCollectedData(); } catch (err) { debugLog('Retry export failed: ' + (err && err.message ? err.message : 'error'), 'error'); }
            } else {
                isRunning = false;
                overlay.style.display = 'none';
            }
        } finally {
            isHandlingEscape = false;
        }
    });

    setInterval(createEntryButton, 2000);
})();
