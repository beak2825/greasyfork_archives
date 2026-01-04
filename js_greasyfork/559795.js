// ==UserScript==
// @name         超星自行火炮
// @namespace    chaoxing-helper
// @version      4.0.12
// @author       isMobile
// @description  超星自行火炮——反对大学水课和人身限制
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @require      https://lib.baomitu.com/vue/3.4.31/vue.global.prod.js
// @require      https://lib.baomitu.com/vue-demi/0.14.7/index.iife.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://lib.baomitu.com/element-plus/2.7.2/index.full.min.js
// @require      https://lib.baomitu.com/pinia/2.1.7/pinia.iife.min.js
// @require      https://lib.baomitu.com/rxjs/7.8.1/rxjs.umd.min.js
// @require      https://lib.baomitu.com/blueimp-md5/2.19.0/js/md5.min.js
// @resource     ElementPlusStyle  https://lib.baomitu.com/element-plus/2.8.2/index.min.css
// @resource     ttf               https://www.forestpolice.org/ttf/2.0/table.json
// @connect      localhost
// @connect      chaoxing.cloud.caqing.top
// @connect      *
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559795/%E8%B6%85%E6%98%9F%E8%87%AA%E8%A1%8C%E7%81%AB%E7%82%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/559795/%E8%B6%85%E6%98%9F%E8%87%AA%E8%A1%8C%E7%81%AB%E7%82%AE.meta.js
// ==/UserScript==

(function(vue, pinia, rxjs, md5, ElementPlus) {
    'use strict';

    // ==================== 0. 环境钩子与防检测 ====================
    const VISIBILITY_EVENTS = [
        'visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange',
        'blur', 'pagehide', 'freeze'
    ];

    const patchVisibilityProps = (doc, win) => {
        if (!doc || !win) return;
        try {
            const docProto = win.Document?.prototype;
            if (docProto && !docProto.__cxHelperVisibilityPatched) {
                Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });
                Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
                docProto.__cxHelperVisibilityPatched = true;
            }
        } catch {}
        try { Object.defineProperty(doc, 'hidden', { get: () => false, configurable: true }); } catch {}
        try { Object.defineProperty(doc, 'visibilityState', { get: () => 'visible', configurable: true }); } catch {}
        try { doc.hasFocus = () => true; } catch {}
        try { doc.onvisibilitychange = null; } catch {}
        try { Object.defineProperty(doc, 'onvisibilitychange', { get: () => null, set: () => {}, configurable: true }); } catch {}
        try {
            win.onblur = null;
            win.onpagehide = null;
        } catch {}
    };

    const patchEventTarget = (win) => {
        try {
            const proto = win.EventTarget?.prototype;
            if (proto && !proto.__cxHelperHooked) {
                const originalAdd = proto.addEventListener;
                proto.addEventListener = function(type, listener, options) {
                    if (VISIBILITY_EVENTS.includes(type)) return;
                    return originalAdd.call(this, type, listener, options);
                };
                proto.__cxHelperHooked = true;
            }
        } catch {}
    };

    const hookBrowser = () => {
        try {
            patchVisibilityProps(document, window);
            patchEventTarget(window);
        } catch (e) {
            console.warn('[超星自行火炮] 环境钩子注入失败:', e);
        }
    };
    hookBrowser();

    const applyDocumentHooks = (doc, win) => {
        if (!doc || !win) return;
        patchVisibilityProps(doc, win);
        patchEventTarget(win);
    };

    // ==================== 1. 顶层窗口检测 ====================
    const isTopWindow = (function() {
        try {
            return window.self === window.top;
        } catch (e) {
            return false;
        }
    })();

    // ==================== 2. 单例检查，防止多次初始化 ====================
    const SCRIPT_ID = 'chaoxing-helper-initialized-v3';
    
    const getTopWindow = () => {
        try {
            return window.top;
        } catch (e) {
            return window;
        }
    };
    
    const topWin = getTopWindow();
    if (topWin[SCRIPT_ID]) {
        console.log('[超星自行火炮] 已初始化，跳过重复加载');
        return;
    }
    
    if (isTopWindow) {
        topWin[SCRIPT_ID] = true;
    }

    // ==================== 3. GM API 封装 ====================
    const _GM_getResourceText = typeof GM_getResourceText !== 'undefined' ? GM_getResourceText : (name) => '';
    const _GM_getValue = typeof GM_getValue !== 'undefined' ? GM_getValue : (key, defaultVal) => defaultVal;
    const _GM_info = typeof GM_info !== 'undefined' ? GM_info : { script: { name: '超星自行火炮', author: 'isMobile', version: '4.0.0' } };
    const _GM_setValue = typeof GM_setValue !== 'undefined' ? GM_setValue : () => {};
    const _GM_xmlhttpRequest = typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : () => {};
    const _unsafeWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ==================== 4. 工具函数 ====================
    const sleep = (second) => new Promise(resolve => setTimeout(resolve, second * 1000));

    const getScriptInfo = () => ({
        name: _GM_info.script.name || '超星自行火炮',
        author: _GM_info.script.author || 'isMobile',
        namespace: _GM_info.script.namespace || 'chaoxing-helper',
        version: _GM_info.script.version || '4.0.0'
    });

    const formatDateTime = (dt) => {
        const pad = n => n < 10 ? "0" + n : n.toString();
        return `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    };

    const getDateTime = () => formatDateTime(new Date());

    const normalizeApiUrl = (url) => {
        if (!url) return '';
        url = url.trim();
        url = url.replace(/\/+$/, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        return url;
    };

    // ==================== 5. 自定义样式 ====================
    const customStyles = `
        .script-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        /* 日志组件 */
        .script-log-container {
            font-size: 13px;
            padding: 4px;
        }
        .script-log-container .log-group-header {
            cursor: pointer;
            user-select: none;
        }
        .script-log-container .log-group-count {
            font-size: 11px;
            color: #909399;
        }
        .script-log-container .log-group-toggle {
            margin-left: auto;
            font-size: 11px;
            color: #409eff;
        }
        .script-log-container .log-item {
            padding: 8px 10px;
            margin: 4px 0;
            border-radius: 6px;
            background: #ffffff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            line-height: 1.4;
            word-break: break-all;
            display: flex;
            align-items: center;
            gap: 8px;
            border-left: 3px solid transparent;
        }
        .script-log-container .log-time {
            color: #909399;
            font-family: 'Menlo', 'Monaco', monospace;
            font-size: 10px;
            flex-shrink: 0;
            background: #f4f6f8;
            padding: 2px 5px;
            border-radius: 3px;
        }
        .script-log-container .log-message {
            flex: 1;
            font-size: 12px;
        }
        .log-item.type-success { border-left-color: #67c23a; }
        .log-item.type-warning { border-left-color: #e6a23c; }
        .log-item.type-danger { border-left-color: #f56c6c; }
        .log-item.type-primary { border-left-color: #409eff; }
        .log-item.type-info { border-left-color: #909399; }
        
        .script-log-container .empty-log {
            text-align: center;
            color: #909399;
            padding: 30px 0;
            font-size: 12px;
        }
        
        /* 设置组件 */
        .script-setting {
            font-size: 13px;
            padding: 4px 0;
        }
        .script-setting .setting-section {
            background: #fff;
            border: 1px solid #ebeef5;
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 10px;
        }
        .script-setting .section-title {
            font-size: 13px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f0f2f5;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .script-setting .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dashed #f0f2f5;
        }
        .script-setting .setting-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .script-setting .setting-label {
            font-size: 12px;
            color: #606266;
        }
        .script-setting .setting-tip {
            font-size: 10px;
            color: #909399;
            margin-top: 2px;
        }
        .script-setting .el-switch {
            --el-switch-on-color: #764ba2;
        }
        .script-setting .el-input-number {
            width: 90px;
        }
        
        /* API管理 */
        .api-manager {
            padding: 4px 0;
        }
        .api-manager .api-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            margin: 4px 0;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #ebeef5;
            cursor: pointer;
            transition: all 0.2s;
        }
        .api-manager .api-item:hover {
            background: #f0f2f5;
        }
        .api-manager .api-item.active {
            background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
            border-color: #764ba2;
        }
        .api-manager .api-item .api-url {
            flex: 1;
            font-size: 12px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .api-manager .api-item.active .api-url {
            color: #764ba2;
            font-weight: 500;
        }
        .api-manager .api-item .action-btns {
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .api-manager .api-item:hover .action-btns {
            opacity: 1;
        }
        .api-manager .api-item .action-btn {
            cursor: pointer;
            padding: 2px;
            border-radius: 3px;
            transition: background 0.2s;
        }
        .api-manager .api-item .action-btn:hover {
            background: rgba(0,0,0,0.05);
        }
        .api-manager .add-api {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }
        .api-manager .add-api .el-input {
            flex: 1;
        }
        .api-manager .edit-row {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 8px;
            margin: 4px 0;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #764ba2;
            box-shadow: 0 2px 8px rgba(118, 75, 162, 0.15);
        }
        .api-manager .edit-row .el-input {
            flex: 1;
        }
        .api-manager .edit-row .edit-actions {
            display: flex;
            gap: 4px;
        }
        .api-manager .edit-row .edit-action-btn {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .api-manager .edit-row .edit-action-btn.confirm {
            background: #67c23a;
            color: #fff;
        }
        .api-manager .edit-row .edit-action-btn.confirm:hover {
            background: #85ce61;
        }
        .api-manager .edit-row .edit-action-btn.cancel {
            background: #f0f2f5;
            color: #909399;
        }
        .api-manager .edit-row .edit-action-btn.cancel:hover {
            background: #e4e7ed;
            color: #606266;
        }
        .api-manager .empty-tip {
            text-align: center;
            color: #909399;
            padding: 20px 0;
            font-size: 12px;
        }
        
        /* 题目表格 */
        .script-question-table {
            width: 100%;
        }
        .script-question-table .el-table {
            font-size: 11px;
            border-radius: 6px;
            --el-table-header-bg-color: #f5f7fa;
        }
        
        /* 主面板 */
        .main-page {
            z-index: 100003;
            position: fixed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .main-page * {
            box-sizing: border-box;
        }
        
        /* 最小化圆环 */
        .mini-circle {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
            box-shadow: 0 1px 4px rgba(118, 75, 162, 0.1);
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            opacity: 0.4;
            user-select: none;
        }
        .mini-circle:hover {
            transform: scale(1.2);
            opacity: 0.6;
            box-shadow: 0 2px 8px rgba(118, 75, 162, 0.2);
        }
        .mini-circle:active {
            cursor: grabbing;
        }
        .mini-circle::after {
            content: '';
            width: 6px;
            height: 6px;
            border: 1.5px solid rgba(255,255,255,0.5);
            border-radius: 50%;
        }
        .mini-circle.paused {
            background: linear-gradient(135deg, rgba(245, 108, 108, 0.3) 0%, rgba(230, 162, 60, 0.3) 100%);
        }
        
        /* 展开面板 */
        .main-panel {
            width: 340px;
        }
        .main-panel .el-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            background: #fff;
        }
        .main-panel .el-card__header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 12px 16px;
            border-bottom: none;
        }
        .main-panel .el-card__header.paused {
            background: linear-gradient(135deg, #f56c6c 0%, #e6a23c 100%);
        }
        .main-panel .el-card__body {
            padding: 12px;
            height: 320px;
            overflow: hidden;
        }
        .main-panel .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        .main-panel .card-header .title {
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .main-panel .card-header .header-btns {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .main-panel .pause-btn,
        .main-panel .minimize-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .main-panel .pause-btn:hover,
        .main-panel .minimize-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .main-panel .minimize-btn::after {
            content: '';
            width: 10px;
            height: 2px;
            background: #fff;
            border-radius: 1px;
        }
        .main-panel .pause-btn .pause-icon {
            width: 8px;
            height: 10px;
            display: flex;
            justify-content: space-between;
        }
        .main-panel .pause-btn .pause-icon::before,
        .main-panel .pause-btn .pause-icon::after {
            content: '';
            width: 3px;
            height: 100%;
            background: #fff;
            border-radius: 1px;
        }
        .main-panel .pause-btn.playing .pause-icon {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 5px 0 5px 8px;
            border-color: transparent transparent transparent #fff;
        }
        .main-panel .pause-btn.playing .pause-icon::before,
        .main-panel .pause-btn.playing .pause-icon::after {
            display: none;
        }
        
        /* 标签页 */
        .main-panel .el-tabs {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .main-panel .el-tabs__header {
            margin-bottom: 8px;
            flex-shrink: 0;
        }
        .main-panel .el-tabs__content {
            flex: 1;
            overflow: hidden;
        }
        .main-panel .el-tab-pane {
            height: 100%;
        }
        .main-panel .el-tabs__nav-wrap::after {
            height: 1px;
            background: #ebeef5;
        }
        .main-panel .el-tabs__active-bar {
            background: linear-gradient(90deg, #667eea, #764ba2);
            height: 2px;
            border-radius: 2px;
        }
        .main-panel .el-tabs__item {
            font-size: 13px;
            color: #606266;
            padding: 0 16px;
            height: 36px;
            line-height: 36px;
        }
        .main-panel .el-tabs__item.is-active {
            color: #764ba2;
            font-weight: 600;
        }
        
        /* 滚动条 */
        .main-panel .el-scrollbar__bar.is-vertical {
            width: 4px;
        }
        .main-panel .el-scrollbar__thumb {
            background-color: #c0c4cc;
        }
        
        /* 按钮 */
        .main-panel .el-button--primary {
            --el-button-bg-color: #764ba2;
            --el-button-border-color: #764ba2;
        }

        /* 状态指示器 */
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            font-size: 12px;
        }
        .status-indicator.running {
            background: linear-gradient(135deg, #67c23a20 0%, #85ce6120 100%);
            color: #67c23a;
        }
        .status-indicator.paused {
            background: linear-gradient(135deg, #e6a23c20 0%, #f56c6c20 100%);
            color: #e6a23c;
        }
        .status-indicator .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
            animation: pulse 1.5s ease-in-out infinite;
        }
        .status-indicator.paused .status-dot {
            animation: none;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
    `;

    // ==================== 6. Element Plus 图标 ====================
    const createIconComponent = (name, pathD) => ({
        name,
        render() {
            return vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 1024 1024",
                style: { width: '1em', height: '1em', fill: 'currentColor' }
            }, [vue.h('path', { fill: "currentColor", d: pathD })]);
        }
    });

    const DeleteIcon = createIconComponent('Delete',
        "M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z");

    const CheckIcon = createIconComponent('Check',
        "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896zm-55.808-536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 423.616z");

    const EditIcon = createIconComponent('Edit',
        "M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640V512z M469.952 554.24l52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.504 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z");

    const CloseIcon = createIconComponent('Close',
        "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z");

    // ==================== 7. Pinia Stores ====================
    // 全局暂停状态 (响应式)
    const globalPauseState = vue.reactive({ isPaused: false });
    let licenseLocked = false;
    const lockLicense = (logStore, message) => {
        licenseLocked = true;
        globalPauseState.isPaused = true;
        if (logStore) logStore.addLog(message || "许可验证失败，已锁定功能", "danger");
    };

    // 媒体处理标记 (WeakMap 防止内存泄漏)
    const __mediaProcessedMap = new WeakMap();

    const keepAlive = (() => {
        let refCount = 0;
        let audioContext = null;
        let oscillator = null;
        let gainNode = null;
        let wakeLock = null;
        let pulseTimer = null;

        const startAudio = () => {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                if (!audioContext || audioContext.state === "closed") {
                    audioContext = new AudioCtx();
                }
                if (audioContext.state === "suspended") {
                    audioContext.resume().catch(() => {});
                }
                if (!oscillator) {
                    oscillator = audioContext.createOscillator();
                    gainNode = audioContext.createGain();
                    gainNode.gain.value = 0.0001;
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.start();
                }
            } catch {}
        };

        const stopAudio = () => {
            try { oscillator?.stop?.(); } catch {}
            oscillator = null;
            try { gainNode?.disconnect?.(); } catch {}
            gainNode = null;
            if (audioContext) {
                const ctx = audioContext;
                audioContext = null;
                try { ctx.close?.(); } catch {}
            }
        };

        const requestWakeLock = () => {
            try {
                const wake = navigator.wakeLock;
                if (!wake?.request) return;
                wake.request("screen").then(lock => {
                    wakeLock = lock;
                }).catch(() => {});
            } catch {}
        };

        const start = () => {
            refCount += 1;
            if (refCount !== 1) return;
            startAudio();
            requestWakeLock();
            if (!pulseTimer) {
                pulseTimer = setInterval(() => startAudio(), 30000);
            }
        };

        const stop = () => {
            if (refCount === 0) return;
            refCount -= 1;
            if (refCount > 0) return;
            if (pulseTimer) {
                clearInterval(pulseTimer);
                pulseTimer = null;
            }
            if (wakeLock) {
                try { wakeLock.release(); } catch {}
                wakeLock = null;
            }
            stopAudio();
        };

        return { start, stop };
    })();

    const useConfigStore = pinia.defineStore("configStore", {
        state: () => {
            const scriptInfo = getScriptInfo();
            const defaultConfig = {
                version: scriptInfo.version,
                isMinus: false,
                licenseKey: "",
                position: { x: "calc(100vw - 380px)", y: "100px" },
                menuIndex: "0",
                platformName: "cx",
                platformParams: {
                    cx: {
                        name: "超星自行火炮",
                        parts: [
                            {
                                name: "章节设置",
                                params: [
                                    { name: "章节作业自动提交", value: true, type: "boolean", tip: "答题后自动提交" },
                                    { name: "是否自动下一章节", value: true, type: "boolean", tip: "完成后自动跳转" },
                                    { name: "跳过已完成任务点", value: true, type: "boolean", tip: "已完成的不再处理" },
                                    { name: "只答题，不做其他", value: false, type: "boolean", tip: "跳过视频音频等" }
                                ]
                            },
                            {
                                name: "考试设置",
                                params: [
                                    { name: "是否自动切换题目", value: true, type: "boolean", tip: "答完自动下一题" }
                                ]
                            },
                            {
                                name: "视频设置",
                                params: [
                                    { name: "静音播放", value: true, type: "boolean", tip: "播放时静音" }
                                ]
                            }
                        ]
                    }
                },
                otherParams: {
                    name: "其他参数",
                    params: [
                        { name: "操作间隔（秒）", value: 3, type: "number", min: 1, max: 30, tip: "每次操作的等待时间" },
                        { name: "重试次数", value: 3, type: "number", min: 1, max: 10, tip: "失败后重试次数" },
                        { name: "自动提交命中率(%)", value: 60, type: "number", min: 0, max: 100, tip: "章节测验命中率低于该值将暂存" },
                        { name: "许可密钥", value: "", type: "string", tip: "后台发放的许可 Key，必填" }
                    ]
                },
                apiList: [
                    "http://localhost:3000",
                    "https://chaoxing.cloud.caqing.top"
                ],
                currentApiIndex: 1
            };

            let globalConfig = defaultConfig;
            const storedConfig = _GM_getValue("config", null);
            
            if (storedConfig) {
                try {
                    const parsed = typeof storedConfig === 'string' ? JSON.parse(storedConfig) : storedConfig;
                    
                    globalConfig = {
                        ...defaultConfig,
                        ...parsed,
                        version: scriptInfo.version,
                        platformParams: defaultConfig.platformParams,
                        otherParams: defaultConfig.otherParams
                    };
                    
                    // 恢复用户设置
                    if (parsed.platformParams?.cx?.parts) {
                        parsed.platformParams.cx.parts.forEach((part, i) => {
                            if (globalConfig.platformParams.cx.parts[i]) {
                                part.params.forEach((param, j) => {
                                    if (globalConfig.platformParams.cx.parts[i].params[j]) {
                                        globalConfig.platformParams.cx.parts[i].params[j].value = param.value;
                                    }
                                });
                            }
                        });
                    }
                    
                    if (parsed.otherParams?.params) {
                        parsed.otherParams.params.forEach((param, i) => {
                            if (globalConfig.otherParams.params[i]) {
                                globalConfig.otherParams.params[i].value = param.value;
                            }
                        });
                    }
                    
                    if (parsed.apiList?.length) {
                        globalConfig.apiList = parsed.apiList;
                    }
                    if (typeof parsed.currentApiIndex === 'number') {
                        globalConfig.currentApiIndex = parsed.currentApiIndex;
                    }
                    if (parsed.licenseKey) {
                        globalConfig.licenseKey = parsed.licenseKey;
                    }
                    const storedLicenseParam = globalConfig.otherParams.params.find((param) => param.name === "许可密钥");
                    if (storedLicenseParam?.value) {
                        globalConfig.licenseKey = storedLicenseParam.value;
                    }
                    
                } catch (e) {
                    console.error("配置解析错误:", e);
                }
            }
            
            return globalConfig;
        },
        getters: {
            currentApiUrl: (state) => {
                const idx = state.currentApiIndex;
                if (idx >= 0 && idx < state.apiList.length) {
                    return normalizeApiUrl(state.apiList[idx]);
                }
                return state.apiList[0] ? normalizeApiUrl(state.apiList[0]) : "http://localhost:3000";
            },
            isPaused: () => globalPauseState.isPaused,
            chapterSettings: (state) => {
                const parts = state.platformParams.cx.parts[0].params;
                return {
                    autoSubmit: parts[0].value,
                    autoNext: parts[1].value,
                    skipCompleted: parts[2].value,
                    onlyQuiz: parts[3].value
                };
            },
            videoSettings: (state) => {
                const parts = state.platformParams.cx.parts[2].params;
                return {
                    muted: parts[0].value
                };
            }
        },
        actions: {
            addApi(url) {
                const normalized = normalizeApiUrl(url);
                if (normalized && !this.apiList.includes(normalized)) {
                    this.apiList.push(normalized);
                    return true;
                }
                return false;
            },
            updateApi(index, url) {
                const normalized = normalizeApiUrl(url);
                if (index >= 0 && index < this.apiList.length && normalized) {
                    const isDuplicate = this.apiList.some((api, i) => i !== index && api === normalized);
                    if (!isDuplicate) {
                        this.apiList[index] = normalized;
                        return true;
                    }
                }
                return false;
            },
            removeApi(index) {
                if (this.apiList.length > 1 && index >= 0 && index < this.apiList.length) {
                    this.apiList.splice(index, 1);
                    if (this.currentApiIndex >= this.apiList.length) {
                        this.currentApiIndex = this.apiList.length - 1;
                    }
                    return true;
                }
                return false;
            },
            selectApi(index) {
                if (index >= 0 && index < this.apiList.length) {
                    this.currentApiIndex = index;
                }
            },
            togglePause() {
                globalPauseState.isPaused = !globalPauseState.isPaused;
                return globalPauseState.isPaused;
            },
            setPaused(value) {
                globalPauseState.isPaused = value;
            }
        }
    });

    const useLogStore = pinia.defineStore("logStore", {
        state: () => ({ logList: [] }),
        actions: {
            addLog(message, type = 'info', meta = {}) {
                const entry = {
                    message,
                    time: getDateTime(),
                    type,
                    taskKey: meta.taskKey || "",
                    taskLabel: meta.taskLabel || ""
                };
                this.logList.push(entry);
                if (this.logList.length > 200) {
                    this.logList = this.logList.slice(-100);
                }
            },
            clearLogs() {
                this.logList = [];
            }
        }
    });

    const useQuestionStore = pinia.defineStore("questionStore", {
        state: () => ({ questionList: [] }),
        actions: {
            addQuestion(question) { 
                this.questionList.push(question); 
            },
            clearQuestion() { 
                this.questionList = []; 
            }
        }
    });

    // ==================== 8. RxJS ====================
    const { from, of, Observable } = rxjs;
    const { mergeMap, toArray, concatMap } = rxjs.operators || rxjs;

    // ==================== 9. IframeUtils ====================
    class IframeUtils {
        static getIframes(element) {
            return Array.from(element.querySelectorAll("iframe"));
        }

        static getAllNestedIframes(element) {
            const iframes = IframeUtils.getIframes(element);
            if (iframes.length === 0) return of([]);
            
            return from(iframes).pipe(
                mergeMap(iframe => new Observable(subscriber => {
                    try {
                        const doc = iframe.contentDocument;
                        const root = doc?.documentElement;
                        if (root) {
                            IframeUtils.getAllNestedIframes(root).subscribe({
                                next: nested => {
                                    subscriber.next([iframe, ...nested]);
                                    subscriber.complete();
                                },
                                error: () => {
                                    subscriber.next([iframe]);
                                    subscriber.complete();
                                }
                            });
                        } else {
                            subscriber.next([iframe]);
                            subscriber.complete();
                        }
                    } catch (e) {
                        subscriber.next([iframe]);
                        subscriber.complete();
                    }
                })),
                toArray(),
                mergeMap(arrays => of(arrays.flat()))
            );
        }
    }

    // ==================== 10. Typr 字体解析库 ====================
    const Typr = {};
    
    Typr._bin = {
        readFixed: (data, o) => (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4),
        readF2dot14: (data, o) => Typr._bin.readShort(data, o) / 16384,
        readInt: (buff, p) => Typr._bin._view(buff).getInt32(p),
        readInt8: (buff, p) => Typr._bin._view(buff).getInt8(p),
        readShort: (buff, p) => Typr._bin._view(buff).getInt16(p),
        readUshort: (buff, p) => Typr._bin._view(buff).getUint16(p),
        readUshorts: (buff, p, len) => {
            const arr = [];
            for (let i = 0; i < len; i++) arr.push(Typr._bin.readUshort(buff, p + i * 2));
            return arr;
        },
        readUint: (buff, p) => Typr._bin._view(buff).getUint32(p),
        readUint64: (buff, p) => Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4),
        readASCII: (buff, p, l) => {
            let s = "";
            for (let i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
            return s;
        },
        readBytes: (buff, p, l) => {
            const arr = [];
            for (let i = 0; i < l; i++) arr.push(buff[p + i]);
            return arr;
        },
        _view: (buff) => buff._dataView || (buff._dataView = buff.buffer 
            ? new DataView(buff.buffer, buff.byteOffset, buff.byteLength) 
            : new DataView(new Uint8Array(buff).buffer))
    };

    Typr.parse = function(buff) {
        const bin = Typr._bin;
        const data = new Uint8Array(buff);
        const tag = bin.readASCII(data, 0, 4);
        if (tag === "ttcf") {
            let offset = 4;
            offset += 4;
            const numF = bin.readUint(data, offset); offset += 4;
            const fnts = [];
            for (let i = 0; i < numF; i++) {
                const foff = bin.readUint(data, offset); offset += 4;
                fnts.push(Typr._readFont(data, foff));
            }
            return fnts;
        }
        return [Typr._readFont(data, 0)];
    };

    Typr._readFont = function(data, offset) {
        const bin = Typr._bin;
        const ooff = offset;
        offset += 4;
        const numTables = bin.readUshort(data, offset); offset += 8;

        const tags = ["cmap", "head", "hhea", "maxp", "hmtx", "loca", "glyf"];
        const obj = { _data: data, _offset: ooff };
        const tabs = {};

        for (let i = 0; i < numTables; i++) {
            const tag = bin.readASCII(data, offset, 4); offset += 4;
            offset += 4;
            const toffset = bin.readUint(data, offset); offset += 4;
            const length = bin.readUint(data, offset); offset += 4;
            tabs[tag] = { offset: toffset, length };
        }

        for (const t of tags) {
            if (tabs[t] && Typr[t]) {
                obj[t] = Typr[t].parse(data, tabs[t].offset, tabs[t].length, obj);
            }
        }
        return obj;
    };

    Typr._tabOffset = function(data, tab, foff) {
        const bin = Typr._bin;
        const numTables = bin.readUshort(data, foff + 4);
        let offset = foff + 12;
        for (let i = 0; i < numTables; i++) {
            const tag = bin.readASCII(data, offset, 4); offset += 4;
            offset += 4;
            const toffset = bin.readUint(data, offset); offset += 4;
            offset += 4;
            if (tag === tab) return toffset;
        }
        return 0;
    };

    Typr.cmap = {
        parse: function(data, offset, length) {
            data = new Uint8Array(data.buffer, offset, length);
            offset = 0;
            const bin = Typr._bin;
            const obj = { tables: [] };
            offset += 2;
            const numTables = bin.readUshort(data, offset); offset += 2;
            const offs = [];

            for (let i = 0; i < numTables; i++) {
                const platformID = bin.readUshort(data, offset); offset += 2;
                const encodingID = bin.readUshort(data, offset); offset += 2;
                const noffset = bin.readUint(data, offset); offset += 4;
                const id = "p" + platformID + "e" + encodingID;
                let tind = offs.indexOf(noffset);

                if (tind === -1) {
                    tind = obj.tables.length;
                    offs.push(noffset);
                    const format = bin.readUshort(data, noffset);
                    let subt;
                    if (format === 4) subt = Typr.cmap.parse4(data, noffset);
                    else if (format === 12) subt = Typr.cmap.parse12(data, noffset);
                    else subt = { format };
                    obj.tables.push(subt);
                }
                if (obj[id] == null) obj[id] = tind;
            }
            return obj;
        },
        parse4: function(data, offset) {
            const bin = Typr._bin;
            const offset0 = offset;
            const obj = {};
            obj.format = bin.readUshort(data, offset); offset += 2;
            const length = bin.readUshort(data, offset); offset += 2;
            offset += 2;
            const segCountX2 = bin.readUshort(data, offset); offset += 2;
            const segCount = segCountX2 / 2;
            offset += 6;
            obj.endCount = bin.readUshorts(data, offset, segCount); offset += segCount * 2;
            offset += 2;
            obj.startCount = bin.readUshorts(data, offset, segCount); offset += segCount * 2;
            obj.idDelta = [];
            for (let i = 0; i < segCount; i++) { obj.idDelta.push(bin.readShort(data, offset)); offset += 2; }
            obj.idRangeOffset = bin.readUshorts(data, offset, segCount); offset += segCount * 2;
            obj.glyphIdArray = [];
            while (offset < offset0 + length) { obj.glyphIdArray.push(bin.readUshort(data, offset)); offset += 2; }
            return obj;
        },
        parse12: function(data, offset) {
            const bin = Typr._bin;
            const obj = {};
            obj.format = bin.readUshort(data, offset); offset += 2;
            offset += 10;
            const nGroups = bin.readUint(data, offset); offset += 4;
            obj.groups = [];
            for (let i = 0; i < nGroups; i++) {
                const off = offset + i * 12;
                obj.groups.push([bin.readUint(data, off), bin.readUint(data, off + 4), bin.readUint(data, off + 8)]);
            }
            return obj;
        }
    };

    Typr.head = {
        parse: function(data, offset) {
            const bin = Typr._bin;
            const obj = {};
            offset += 18;
            obj.unitsPerEm = bin.readUshort(data, offset); offset += 2;
            offset += 30;
            obj.indexToLocFormat = bin.readShort(data, offset);
            return obj;
        }
    };

    Typr.hhea = {
        parse: function(data, offset) {
            const bin = Typr._bin;
            const obj = {};
            offset += 34;
            obj.numberOfHMetrics = bin.readUshort(data, offset);
            return obj;
        }
    };

    Typr.maxp = {
        parse: function(data, offset) {
            const bin = Typr._bin;
            return { numGlyphs: bin.readUshort(data, offset + 4) };
        }
    };

    Typr.hmtx = {
        parse: function(data, offset, length, font) {
            const bin = Typr._bin;
            const obj = { aWidth: [], lsBearing: [] };
            let aw = 0, lsb = 0;
            for (let i = 0; i < font.maxp.numGlyphs; i++) {
                if (i < font.hhea.numberOfHMetrics) {
                    aw = bin.readUshort(data, offset); offset += 2;
                    lsb = bin.readShort(data, offset); offset += 2;
                }
                obj.aWidth.push(aw);
                obj.lsBearing.push(lsb);
            }
            return obj;
        }
    };

    Typr.loca = {
        parse: function(data, offset, length, font) {
            const bin = Typr._bin;
            const obj = [];
            const ver = font.head.indexToLocFormat;
            const len = font.maxp.numGlyphs + 1;
            if (ver === 0) for (let i = 0; i < len; i++) obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
            if (ver === 1) for (let i = 0; i < len; i++) obj.push(bin.readUint(data, offset + (i << 2)));
            return obj;
        }
    };

    Typr.glyf = {
        parse: function(data, offset, length, font) {
            const obj = [];
            for (let g = 0; g < font.maxp.numGlyphs; g++) obj.push(null);
            return obj;
        },
        _parseGlyf: function(font, g) {
            const bin = Typr._bin;
            const data = font._data;
            let offset = Typr._tabOffset(data, "glyf", font._offset) + font.loca[g];
            if (font.loca[g] === font.loca[g + 1]) return null;

            const gl = {};
            gl.noc = bin.readShort(data, offset); offset += 2;
            gl.xMin = bin.readShort(data, offset); offset += 2;
            gl.yMin = bin.readShort(data, offset); offset += 2;
            gl.xMax = bin.readShort(data, offset); offset += 2;
            gl.yMax = bin.readShort(data, offset); offset += 2;

            if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;

            if (gl.noc > 0) {
                gl.endPts = [];
                for (let i = 0; i < gl.noc; i++) { gl.endPts.push(bin.readUshort(data, offset)); offset += 2; }
                const instructionLength = bin.readUshort(data, offset); offset += 2;
                if (data.length - offset < instructionLength) return null;
                offset += instructionLength;
                const crdnum = gl.endPts[gl.noc - 1] + 1;
                gl.flags = [];
                for (let i = 0; i < crdnum; i++) {
                    const flag = data[offset]; offset++;
                    gl.flags.push(flag);
                    if ((flag & 8) !== 0) {
                        const rep = data[offset]; offset++;
                        for (let j = 0; j < rep; j++) { gl.flags.push(flag); i++; }
                    }
                }
                gl.xs = [];
                for (let i = 0; i < crdnum; i++) {
                    const i8 = (gl.flags[i] & 2) !== 0, same = (gl.flags[i] & 16) !== 0;
                    if (i8) { gl.xs.push(same ? data[offset] : -data[offset]); offset++; }
                    else { if (same) gl.xs.push(0); else { gl.xs.push(bin.readShort(data, offset)); offset += 2; } }
                }
                gl.ys = [];
                for (let i = 0; i < crdnum; i++) {
                    const i8 = (gl.flags[i] & 4) !== 0, same = (gl.flags[i] & 32) !== 0;
                    if (i8) { gl.ys.push(same ? data[offset] : -data[offset]); offset++; }
                    else { if (same) gl.ys.push(0); else { gl.ys.push(bin.readShort(data, offset)); offset += 2; } }
                }
                let x = 0, y = 0;
                for (let i = 0; i < crdnum; i++) { x += gl.xs[i]; y += gl.ys[i]; gl.xs[i] = x; gl.ys[i] = y; }
            } else {
                gl.parts = [];
                let flags;
                do {
                    flags = bin.readUshort(data, offset); offset += 2;
                    const part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
                    gl.parts.push(part);
                    part.glyphIndex = bin.readUshort(data, offset); offset += 2;
                    let arg1, arg2;
                    if (flags & 1) { arg1 = bin.readShort(data, offset); offset += 2; arg2 = bin.readShort(data, offset); offset += 2; }
                    else { arg1 = bin.readInt8(data, offset); offset++; arg2 = bin.readInt8(data, offset); offset++; }
                    if (flags & 2) { part.m.tx = arg1; part.m.ty = arg2; }
                    else { part.p1 = arg1; part.p2 = arg2; }
                    if (flags & 8) { part.m.a = part.m.d = Typr._bin.readF2dot14(data, offset); offset += 2; }
                    else if (flags & 64) {
                        part.m.a = Typr._bin.readF2dot14(data, offset); offset += 2;
                        part.m.d = Typr._bin.readF2dot14(data, offset); offset += 2;
                    } else if (flags & 128) {
                        part.m.a = Typr._bin.readF2dot14(data, offset); offset += 2;
                        part.m.b = Typr._bin.readF2dot14(data, offset); offset += 2;
                        part.m.c = Typr._bin.readF2dot14(data, offset); offset += 2;
                        part.m.d = Typr._bin.readF2dot14(data, offset); offset += 2;
                    }
                } while (flags & 32);
            }
            return gl;
        }
    };

    Typr.U = {
        codeToGlyph: function(font, code) {
            const cmap = font.cmap;
            let tind = -1;
            if (cmap.p0e4 != null) tind = cmap.p0e4;
            else if (cmap.p3e1 != null) tind = cmap.p3e1;
            else if (cmap.p1e0 != null) tind = cmap.p1e0;
            else if (cmap.p0e3 != null) tind = cmap.p0e3;
            if (tind === -1) return 0;
            
            const tab = cmap.tables[tind];
            if (tab.format === 4) {
                let sind = -1;
                for (let i = 0; i < tab.endCount.length; i++) { if (code <= tab.endCount[i]) { sind = i; break; } }
                if (sind === -1 || tab.startCount[sind] > code) return 0;
                let gli = 0;
                if (tab.idRangeOffset[sind] !== 0) {
                    gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
                } else { gli = code + tab.idDelta[sind]; }
                return gli & 65535;
            } else if (tab.format === 12) {
                if (code > tab.groups[tab.groups.length - 1][1]) return 0;
                for (const grp of tab.groups) {
                    if (grp[0] <= code && code <= grp[1]) return grp[2] + (code - grp[0]);
                }
            }
            return 0;
        },
        glyphToPath: function(font, gid) {
            const path = { cmds: [], crds: [] };
            if (font.glyf) Typr.U._drawGlyf(gid, font, path);
            return path;
        },
        _drawGlyf: function(gid, font, path) {
            let gl = font.glyf[gid];
            if (gl == null) gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
            if (gl != null) {
                if (gl.noc > -1) Typr.U._simpleGlyph(gl, path);
                else Typr.U._compoGlyph(gl, font, path);
            }
        },
        _simpleGlyph: function(gl, p) {
            for (let c = 0; c < gl.noc; c++) {
                const i0 = c === 0 ? 0 : gl.endPts[c - 1] + 1;
                const il = gl.endPts[c];
                for (let i = i0; i <= il; i++) {
                    const pr = i === i0 ? il : i - 1;
                    const nx = i === il ? i0 : i + 1;
                    const onCurve = gl.flags[i] & 1;
                    const prOnCurve = gl.flags[pr] & 1;
                    const nxOnCurve = gl.flags[nx] & 1;
                    const x = gl.xs[i], y = gl.ys[i];

                    if (i === i0) {
                        if (onCurve) {
                            if (prOnCurve) { p.cmds.push("M"); p.crds.push(gl.xs[pr], gl.ys[pr]); }
                            else { p.cmds.push("M"); p.crds.push(x, y); continue; }
                        } else {
                            if (prOnCurve) { p.cmds.push("M"); p.crds.push(gl.xs[pr], gl.ys[pr]); }
                            else { p.cmds.push("M"); p.crds.push((gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2); }
                        }
                    }
                    if (onCurve) { if (prOnCurve) { p.cmds.push("L"); p.crds.push(x, y); } }
                    else {
                        if (nxOnCurve) { p.cmds.push("Q"); p.crds.push(x, y, gl.xs[nx], gl.ys[nx]); }
                        else { p.cmds.push("Q"); p.crds.push(x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2); }
                    }
                }
                p.cmds.push("Z");
            }
        },
        _compoGlyph: function(gl, font, p) {
            for (const prt of gl.parts) {
                const path = { cmds: [], crds: [] };
                Typr.U._drawGlyf(prt.glyphIndex, font, path);
                const m = prt.m;
                for (let i = 0; i < path.crds.length; i += 2) {
                    const x = path.crds[i], y = path.crds[i + 1];
                    p.crds.push(x * m.a + y * m.b + m.tx);
                    p.crds.push(x * m.c + y * m.d + m.ty);
                }
                for (const cmd of path.cmds) p.cmds.push(cmd);
            }
        }
    };

    // ==================== 11. Font 类 ====================
    class Font {
        constructor(data) {
            const obj = Typr.parse(data);
            if (!obj?.length || typeof obj[0] !== "object") throw new Error("unable to parse font");
            Object.assign(this, obj[0]);
        }
        codeToGlyph(code) { return Typr.U.codeToGlyph(this, code); }
        glyphToPath(gid) { return Typr.U.glyphToPath(this, gid); }
    }

    // ==================== 12. 字体解密 ====================
    function decrypt(iframeDocument) {
        try {
            const styles = iframeDocument.querySelectorAll("style");
            let tip = null;
            for (const style of styles) {
                if (style.textContent?.includes("font-cxsecret")) { tip = style; break; }
            }
            if (!tip) return;

            const fontMatch = tip.textContent.match(/base64,([\w\W]+?)'/);
            if (!fontMatch?.[1]) return;

            const fontArray = Uint8Array.from(atob(fontMatch[1]), c => c.charCodeAt(0));
            const font = new Font(fontArray);
            
            const tableText = _GM_getResourceText("ttf");
            if (!tableText) return;
            
            const table = JSON.parse(tableText);
            const match = {};

            for (let i = 19968; i < 40870; i++) {
                const glyph = font.codeToGlyph(i);
                if (!glyph) continue;
                const path = font.glyphToPath(glyph);
                const hash = md5(JSON.stringify(path)).slice(24);
                if (table[hash]) match[i] = table[hash];
            }

            for (const el of iframeDocument.querySelectorAll(".font-cxsecret")) {
                let html = el.innerHTML;
                for (const key in match) {
                    html = html.replace(new RegExp(String.fromCharCode(Number(key)), "g"), String.fromCharCode(match[key]));
                }
                el.innerHTML = html;
                el.classList.remove("font-cxsecret");
            }
        } catch (e) {
            console.warn("字体解密失败:", e);
        }
    }

    // ==================== 13. API调用 ====================
        const getAnswer = async (question) => {
            const configStore = useConfigStore();
            const logStore = useLogStore();
            const apiUrl = configStore.currentApiUrl + '/search';
            const retryCount = configStore.otherParams.params[1].value;
            const licenseKey = configStore.licenseKey || "";
            
            if (licenseLocked) {
                logStore.addLog("许可验证未通过，功能已锁定", "danger");
                return { code: 403, msg: "许可无效", data: { answer: [] } };
            }
            if (!licenseKey) {
                logStore.addLog("未填写许可密钥，已取消请求", "warning");
                return { code: 403, msg: "未填写许可密钥", data: { answer: [] } };
            }
            
            const data = JSON.stringify({
                question: question.title,
                options: question.optionsText,
                type: question.type,
                questionData: question.element?.outerHTML || "",
                workType: question.workType,
                licenseKey
            });

        await sleep(configStore.otherParams.params[0].value);

        const tryRequest = async (attempt = 1) => {
            return new Promise(resolve => {
                _GM_xmlhttpRequest({
                    url: apiUrl,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    data,
                    timeout: 60000,
                    onload: response => {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            if (attempt < retryCount) {
                                logStore.addLog(`响应解析失败，重试 ${attempt}/${retryCount}`, "warning");
                                setTimeout(() => resolve(tryRequest(attempt + 1)), 1000);
                            } else {
                                logStore.addLog("响应解析失败", "danger");
                                resolve({ code: 500, data: { answer: [] }, msg: "解析失败" });
                            }
                        }
                    },
                    onerror: () => {
                        if (attempt < retryCount) {
                            logStore.addLog(`API请求失败，重试 ${attempt}/${retryCount}`, "warning");
                            setTimeout(() => resolve(tryRequest(attempt + 1)), 1000);
                        } else {
                            logStore.addLog("API请求失败", "danger");
                            resolve({ code: 500, data: { answer: [] }, msg: "请求失败" });
                        }
                    },
                    ontimeout: () => {
                        if (attempt < retryCount) {
                            logStore.addLog(`API请求超时，重试 ${attempt}/${retryCount}`, "warning");
                            setTimeout(() => resolve(tryRequest(attempt + 1)), 1000);
                        } else {
                            logStore.addLog("API请求超时", "warning");
                            resolve({ code: 500, data: { answer: [] }, msg: "请求超时" });
                        }
                    }
                });
            });
        };

        return tryRequest();
    };

    // ==================== 14. 暂停检查工具 ====================
    const waitIfPaused = async () => {
        const logStore = useLogStore();
        
        if (globalPauseState.isPaused) {
            logStore.addLog("脚本已暂停，等待继续...", "warning");
            while (globalPauseState.isPaused) {
                await sleep(0.5);
            }
            logStore.addLog("脚本继续运行", "success");
        }
    };

    // ==================== 15. 题目处理器 ====================
    class BaseQuestionHandler {
        constructor() {
            this._document = document;
            this._window = _unsafeWindow;
            this.questions = [];
            
            const logStore = useLogStore();
            const questionStore = useQuestionStore();
            this.addLog = logStore.addLog.bind(logStore);
            this.addQuestion = questionStore.addQuestion.bind(questionStore);
        }

        questionType = {
            "单选题": "0", "A1型题": "0",
            "多选题": "1", "X型题": "1",
            "填空题": "2", "判断题": "3",
            "简答题": "4", "名词解释": "5",
            "论述题": "6", "计算题": "7"
        };

        removeHtml(html) {
            if (!html) return "";
            return html
                .replace(/<((?!img|sub|sup|br)[^>]+)>/g, "")
                .replace(/&nbsp;/g, " ")
                .replace(/\s+/g, " ")
                .replace(/<br\s*\/?>/g, "\n")
                .replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>')
                .trim();
        }

        clean(str) {
            if (!str) return "";
            return str.replace(/^【.*?】\s*/, "").replace(/\s*（\d+(\.\d+)?分）$/, "").trim();
        }
    }

    class CxQuestionHandler extends BaseQuestionHandler {
        constructor(type, iframe) {
            super();
            this.type = type;
            if (iframe) {
                this._document = iframe.contentDocument;
                this._window = iframe.contentWindow;
            }
        }

        async init() {
            this.questions = [];
            this.parseHtml();

            const total = this.questions.length;
            if (!total) {
                this.addLog("未解析到题目", "warning");
                return { total: 0, hit: 0, hitRate: 0 };
            }

            this.addLog(`解析到 ${total} 道题目`, "primary");
            let hitCount = 0;
            
            for (const [index, question] of this.questions.entries()) {
                await waitIfPaused();
                
                const answerData = await getAnswer(question);
                if (answerData.code === 200 && answerData.data.answer?.length) {
                    hitCount += 1;
                    question.answer = answerData.data.answer;
                    this.fillQuestion(question);
                    this.addLog(`第 ${index + 1} 题已作答`, "success");
                } else {
                    this.addLog(`第 ${index + 1} 题未找到答案`, "warning");
                    question.answer = [answerData.msg || "未找到答案"];
                }
                this.addQuestion(question);
            }
            
            const hitRate = total ? Math.round((hitCount / total) * 100) : 0;
            this.addLog(`答题完成，命中率 ${hitCount}/${total} (${hitRate}%)`, hitCount ? "success" : "warning");
            return { total, hit: hitCount, hitRate };
        }

        parseHtml() {
            if (!this._document) return;
            
            let questionElements;
            if (this.type === "zj") {
                questionElements = this._document.querySelectorAll(".TiMu");
            } else if (["zy", "ks"].includes(this.type)) {
                questionElements = this._document.querySelectorAll(".questionLi");
            }
            
            if (questionElements?.length) {
                this.addQuestions(questionElements);
            }
        }

        extractOptions(optionElements, optionSelector) {
            const optionsObject = {};
            const optionTexts = [];
            
            optionElements.forEach(optionElement => {
                const selectorEl = optionElement.querySelector(optionSelector);
                const optionTextContent = this.removeHtml(selectorEl?.innerHTML || "");
                optionsObject[optionTextContent] = optionElement;
                optionTexts.push(optionTextContent);
            });
            
            return [optionsObject, optionTexts];
        }

        addQuestions(questionElements) {
            questionElements.forEach(questionElement => {
                let questionTitle = "";
                let questionTypeText = "";
                let optionElements;
                let optionsObject = {};
                let optionTexts = [];

                if (["zy", "ks"].includes(this.type)) {
                    const h3El = questionElement.querySelector("h3");
                    const titleElement = h3El?.innerHTML || "";
                    const colorShallowEl = questionElement.querySelector(".colorShallow");
                    const colorShallowElement = colorShallowEl?.outerHTML || "";
                    
                    if (this.type === "zy") {
                        questionTypeText = questionElement.getAttribute("typename") || "";
                    } else if (this.type === "ks") {
                        questionTypeText = this.removeHtml(colorShallowElement).slice(1, 4) || "";
                    }
                    
                    questionTitle = this.removeHtml(titleElement.split(colorShallowElement || "@@NOSPLIT@@")[1] || titleElement);
                    optionElements = questionElement.querySelectorAll(".answerBg");
                    [optionsObject, optionTexts] = this.extractOptions(optionElements, ".answer_p");
                } else if (this.type === "zj") {
                    const fontLabelEl = questionElement.querySelector(".fontLabel");
                    const zyTitleEl = questionElement.querySelector(".newZy_TItle");
                    questionTitle = this.removeHtml(fontLabelEl?.innerHTML || "");
                    questionTypeText = this.removeHtml(zyTitleEl?.innerHTML || "");
                    optionElements = questionElement.querySelectorAll('[class*="before-after"]');
                    [optionsObject, optionTexts] = this.extractOptions(optionElements, ".fl.after");
                }

                const cleanType = questionTypeText.replace(/【|】/g, "").trim();
                
                this.questions.push({
                    element: questionElement,
                    type: this.questionType[cleanType] || "999",
                    title: this.clean(questionTitle),
                    optionsText: optionTexts,
                    options: optionsObject,
                    answer: [],
                    workType: this.type,
                    refer: this._window?.location.href || window.location.href
                });
            });
        }

        fillQuestion(question) {
            if (!this._window) return;

            try {
                if (question.type === "0" || question.type === "1") {
                    question.answer.forEach(answer => {
                        const cleanAnswer = this.removeHtml(answer);
                        for (const key in question.options) {
                            if (key === cleanAnswer) {
                                const optionElement = question.options[key];
                                if (["zj", "zy"].includes(this.type)) {
                                    if (optionElement.getAttribute("aria-checked") !== "true") optionElement.click();
                                } else if (this.type === "ks") {
                                    if (!optionElement.querySelector(".check_answer, .check_answer_dx")) optionElement.click();
                                }
                            }
                        }
                    });
                } else if (question.type === "2") {
                    const textareaElements = question.element.querySelectorAll("textarea");
                    textareaElements.forEach((textareaElement, index) => {
                        const answerText = question.answer[index] || "";
                        try {
                            const ueditor = this._window.UE?.getEditor(textareaElement.name);
                            if (ueditor?.setContent) { ueditor.setContent(answerText); return; }
                        } catch (e) {}
                        textareaElement.value = answerText;
                    });
                } else if (question.type === "3") {
                    let answer = "true";
                    const firstAnswer = question.answer[0] || "";
                    if (firstAnswer.match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/i)) answer = "true";
                    else if (firstAnswer.match(/(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/i)) answer = "false";

                    const trueOrFalse = { "true": "对", "false": "错" };
                    for (const key in question.options) {
                        const optEl = question.options[key];
                        if (["zj", "zy"].includes(this.type)) {
                            const ariaLabel = optEl.getAttribute("aria-label") || "";
                            if (ariaLabel.includes(`${trueOrFalse[answer]}选择`)) {
                                if (optEl.getAttribute("aria-checked") !== "true") optEl.click();
                            }
                        } else if (this.type === "ks") {
                            const optionElement = optEl.querySelector(`span[data='${answer}']`);
                            if (optionElement && !optionElement.querySelector(".check_answer")) optionElement.click();
                        }
                    }
                } else if (question.type === "4" || question.type === "6") {
                    const textareaElement = question.element.querySelector("textarea");
                    if (!textareaElement) return;
                    const answerText = question.answer[0] || "";
                    try {
                        const ueditor = this._window.UE?.getEditor(textareaElement.name);
                        if (ueditor?.setContent) { ueditor.setContent(answerText); return; }
                    } catch (e) {}
                    textareaElement.value = answerText;
                }
            } catch (e) {
                console.warn("填写答案出错:", e);
            }
        }
    }

    // ==================== 16. 章节学习逻辑（简化重写）====================
    const useCxChapterLogic = () => {
        const logStore = useLogStore();
        const configStore = useConfigStore();
        if (licenseLocked) {
            logStore.addLog("许可验证未通过，功能已锁定", "danger");
            return;
        }

        let currentTaskId = 0;
        const RECOVERY_CONFIG = {
            inactivityRefreshMs: 6 * 60 * 1000,
            taskStuckRefreshMs: 3 * 60 * 1000,
            refreshCooldownMs: 90 * 1000
        };
        const SMART_CHECK_CONFIG = {
            initialDelayMs: 60000,
            intervalMs: 25000,
            rescanCooldownMs: 8000,
            pendingMaxMs: 2 * 60 * 1000,
            staleTaskTtlMs: 10 * 60 * 1000,
            missingTaskRefreshMs: 2 * 60 * 1000
        };
        let smartCheckSessionId = 0;
        let smartCheckDelayTimer = null;
        let smartCheckTimer = null;
        let monitorTimer = null;
        let lastActivityAt = Date.now();
        let lastProgressAt = Date.now();
        let lastRefreshAt = 0;
        let activeTaskKey = "";
        let activeTaskLabel = "";
        let lastSmartScanAt = 0;
        let lastSmartActionAt = 0;
        let smartCheckRunning = false;
        let smartKeepAlive = false;
        let chapterComplete = false;
        const taskRegistry = new Map();
        let isScanning = false;
        let pendingScanRoot = null;

        const touchActivity = () => {
            lastActivityAt = Date.now();
        };
        const touchProgress = () => {
            const now = Date.now();
            lastProgressAt = now;
            lastActivityAt = now;
        };
        const updateChapterCompletion = (total, pending) => {
            if (total > 0) {
                chapterComplete = pending === 0;
                return;
            }
            if (pending > 0) chapterComplete = false;
        };
        const resetChapterCompletion = () => {
            chapterComplete = false;
        };
        const touchTaskState = (meta, patch = {}) => {
            if (!meta?.taskKey) return;
            const now = Date.now();
            const current = taskRegistry.get(meta.taskKey) || {
                firstSeenAt: now,
                lastSeenAt: now,
                lastProgressAt: now,
                finished: false,
                saved: false
            };
            current.lastSeenAt = now;
            if (patch.progress) current.lastProgressAt = now;
            if (patch.finished === true) current.finished = true;
            if (patch.saved === true) current.saved = true;
            if (patch.saved === false) current.saved = false;
            if (patch.type) current.type = patch.type;
            taskRegistry.set(meta.taskKey, current);
        };
        const markTaskProgress = (meta) => {
            touchProgress();
            touchTaskState(meta, { progress: true, type: meta?.taskType });
        };
        const updateSmartKeepAlive = (shouldKeep) => {
            if (shouldKeep && !smartKeepAlive) {
                keepAlive.start();
                smartKeepAlive = true;
                return;
            }
            if (!shouldKeep && smartKeepAlive) {
                keepAlive.stop();
                smartKeepAlive = false;
            }
        };
        const setActiveTask = (meta) => {
            activeTaskKey = meta?.taskKey || "";
            activeTaskLabel = meta?.taskLabel || "";
            markTaskProgress(meta);
        };
        const clearActiveTask = (meta) => {
            if (!meta?.taskKey || meta.taskKey === activeTaskKey) {
                activeTaskKey = "";
                activeTaskLabel = "";
                touchProgress();
            }
        };
        const autoRecover = (reason) => {
            if (globalPauseState.isPaused) return;
            if (chapterComplete) return;
            const now = Date.now();
            if (now - lastRefreshAt < RECOVERY_CONFIG.refreshCooldownMs) return;
            if (configStore.chapterSettings.onlyQuiz && !hasPendingWork()) return;
            if (!hasUnfinishedJobs() && !activeTaskKey) return;
            lastRefreshAt = now;
            logStore.addLog(`自动刷新：${reason}`, "warning");
            setTimeout(() => window.location.reload(), 1200);
        };
        const markFailure = (reason) => {
            touchActivity();
            runSmartCheck("failure");
            autoRecover(reason);
        };
        const scheduleSmartCheck = () => {
            smartCheckSessionId += 1;
            const sessionId = smartCheckSessionId;
            if (smartCheckDelayTimer) clearTimeout(smartCheckDelayTimer);
            smartCheckDelayTimer = setTimeout(() => {
                if (sessionId !== smartCheckSessionId) return;
                if (globalPauseState.isPaused) return;
                runSmartCheck("initial");
                startSmartInspector();
            }, SMART_CHECK_CONFIG.initialDelayMs);
        };
        const startRecoveryMonitor = () => {
            if (monitorTimer) clearInterval(monitorTimer);
            monitorTimer = setInterval(() => {
                if (globalPauseState.isPaused) return;
                if (chapterComplete) return;
                if (configStore.chapterSettings.onlyQuiz && !hasPendingWork()) return;
                const now = Date.now();
                if (activeTaskKey && now - lastProgressAt > RECOVERY_CONFIG.taskStuckRefreshMs) {
                    runSmartCheck("stuck");
                    autoRecover(`任务点长时间无进展${activeTaskLabel ? "：" + activeTaskLabel : ""}`);
                    return;
                }
                if (hasUnfinishedJobs() && now - lastActivityAt > RECOVERY_CONFIG.inactivityRefreshMs) {
                    runSmartCheck("idle");
                    autoRecover("长时间无动作");
                }
            }, 15000);
        };

        const init = () => {
            const currentUrl = window.location.href;
            if (!currentUrl.includes("&mooc2=1")) {
                window.location.href = currentUrl + "&mooc2=1";
            }
            logStore.addLog("检测到用户进入到章节学习页面", "primary");
            logStore.addLog("正在解析任务点，请稍等5-10秒（如果长时间没有反应，请刷新页面）", "warning");
            touchActivity();
            scheduleSmartCheck();
            startRecoveryMonitor();
        };

        const processIframeTask = () => {
            const documentElement = document.documentElement;
            const mainIframe = getMainIframe();
            if (!mainIframe) {
                console.warn("No iframe found.");
                return;
            }
            touchActivity();
            const getWatchRoot = () => safeDoc(mainIframe)?.documentElement || documentElement;
            watchIframe(getWatchRoot());
            if (!mainIframe.__cxHelperWatchBound) {
                mainIframe.addEventListener("load", () => watchIframe(getWatchRoot()));
                mainIframe.__cxHelperWatchBound = true;
            }
        };

        const setupInterceptor = () => {
            let currentUrl = window.location.href;
            let currentChapterId = getChapterId();
            let currentIframeSrc = getMainIframe()?.src || "";
            setInterval(() => {
                const nextUrl = window.location.href;
                const nextChapterId = getChapterId();
                const nextIframeSrc = getMainIframe()?.src || "";
                if (currentUrl !== nextUrl || currentChapterId !== nextChapterId || currentIframeSrc !== nextIframeSrc) {
                    currentUrl = nextUrl;
                    currentChapterId = nextChapterId;
                    currentIframeSrc = nextIframeSrc;
                    touchActivity();
                    taskRegistry.clear();
                    activeTaskKey = "";
                    activeTaskLabel = "";
                    isScanning = false;
                    pendingScanRoot = null;
                    resetChapterCompletion();
                    scheduleSmartCheck();
                    processIframeTask();
                }
            }, 2000);
        };

        const watchIframe = (scanRoot) => {
            if (!scanRoot) return;
            if (isScanning) {
                pendingScanRoot = scanRoot;
                return;
            }
            isScanning = true;
            touchActivity();
            const thisTaskId = ++currentTaskId;
            IframeUtils.getAllNestedIframes(scanRoot).subscribe({
                next: (allIframes) => {
                    const taskIframes = allIframes.filter((iframe) => {
                        const src = iframe?.src || "";
                        if (!src || src.includes("javascript:")) return false;
                        if (src.includes("api/work")) return true;
                        const parent = iframe.parentElement;
                        if (!parent) return false;
                        const hasJobIcon = parent.querySelector(".ans-job-icon") !== null;
                        if (!hasJobIcon) return false;
                        const isMedia = src.includes("video") || src.includes("audio");
                        return isMedia || isDocTask(src) || isBookTask(src);
                    });
                    taskIframes.forEach((iframe, index) => {
                        iframe.__cxTaskOrder = index + 1;
                        iframe.__cxTaskTotal = taskIframes.length;
                    });
                    from(allIframes).pipe(concatMap((iframe) => processIframe(iframe, thisTaskId))).subscribe({
                        complete: async () => {
                            isScanning = false;
                            if (pendingScanRoot) {
                                const nextRoot = pendingScanRoot;
                                pendingScanRoot = null;
                                setTimeout(() => watchIframe(nextRoot), 500);
                                return;
                            }
                            if (thisTaskId === currentTaskId) {
                                const stats = await getTaskStats();
                                if (stats.pendingCount > 0) {
                                    logStore.addLog(`检测到仍有未完成任务点（${stats.pendingCount}/${stats.total}），暂不跳转`, "warning");
                                    return;
                                }
                                logStore.addLog("本页任务点已全部完成，正前往下一章节", "success");
                                if (configStore.platformParams.cx.parts[0].params[1].value) {
                                    await sleep(3);
                                    const jumped = await tryJumpNextChapter();
                                    if (!jumped) {
                                        logStore.addLog("未找到下一章节入口，稍后将继续尝试", "warning");
                                        runSmartCheck("next_missing");
                                    } else {
                                        setTimeout(() => handleJobFinishTip(), 1500);
                                    }
                                } else {
                                    logStore.addLog("已经关闭自动下一章节，在设置里可更改", "danger");
                                }
                            }
                        },
                        error: (e) => {
                            console.warn("任务点串行处理异常:", e);
                            isScanning = false;
                        }
                    });
                },
                error: (e) => {
                    console.warn("任务点扫描异常:", e);
                    isScanning = false;
                }
            });
        };

        // 安全获取 iframe 的 contentDocument
        const safeDoc = (iframe) => {
            try { return iframe.contentDocument; } catch { return null; }
        };

        const waitIframeLoad = (iframe) => {
            return new Promise((resolve) => {
                let waited = 0;
                const timer = setInterval(() => {
                    const doc = safeDoc(iframe);
                    if (doc && doc.readyState === "complete") {
                        clearInterval(timer);
                        resolve();
                        return;
                    }
                    waited += 500;
                    if (waited >= 15000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 500);
            });
        };

        const docTypes = ["ppt", "doc", "pptx", "docx", "pdf"];
        const isDocTask = (src) => docTypes.some((type) => src.includes(`modules/${type}`));
        const isBookTask = (src) => src.includes("modules/innerbook");

        let taskSeq = 0;
        const cleanText = (text) => {
            if (!text) return "";
            return String(text).replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
        };
        const includesAny = (text, items) => items.some((item) => text.includes(item));
        const shortText = (text, max = 24) => {
            if (!text) return "";
            const clean = cleanText(text);
            if (clean.length <= max) return clean;
            return clean.slice(0, max) + "...";
        };
        const getRootDoc = () => {
            try { return window.top.document; } catch { return document; }
        };

        const getMainIframe = () => {
            const rootDoc = getRootDoc();
            return rootDoc.querySelector("#iframe") || rootDoc.querySelector("iframe");
        };

        const getPageLabel = () => {
            const rootDoc = getRootDoc();
            const selectors = [
                "#coursetree .currents .posCatalog_name",
                "#coursetree .currents .catalog_name",
                "#coursetree .currents",
                "#coursetree .current",
                ".courseChapter .currents",
                ".courseChapter .current",
                ".catalog .currents",
                ".catalog .current",
                ".prev_next .cur",
                ".prev_next .cur .catalog_name",
                ".breadcrumb .active",
                ".catalog_name",
                ".chapterName",
                ".courseName",
                ".course-title",
                ".article-title",
                ".title",
                "h1",
                "h2"
            ];
            for (const sel of selectors) {
                const el = rootDoc.querySelector(sel);
                const text = cleanText(el?.textContent || "");
                if (text) return shortText(text, 32);
            }
            return shortText(rootDoc.title || document.title || "", 32);
        };

        const getChapterInfo = () => {
            const rootDoc = getRootDoc();
            const activeNode = rootDoc.querySelector(".posCatalog_select.posCatalog_active .posCatalog_name")
                || rootDoc.querySelector(".posCatalog_select.posCatalog_active");
            const code = cleanText(activeNode?.querySelector(".posCatalog_sbar")?.textContent || "");
            let title = cleanText(activeNode?.getAttribute("title") || activeNode?.textContent || "");
            if (code && title.includes(code)) {
                title = cleanText(title.replace(code, ""));
            }
            if (!title) {
                title = getPageLabel();
            }
            const parts = code ? code.split(".").filter(Boolean) : [];
            let chapterLabel = "";
            if (parts[0]) chapterLabel += `第${parts[0]}章`;
            if (parts[1]) chapterLabel += `第${parts[1]}节`;
            return { code, title, chapterLabel };
        };

        const getChapterId = () => {
            const rootDoc = getRootDoc();
            return rootDoc.querySelector("#chapterIdid")?.value
                || rootDoc.querySelector("#curChapterId")?.value
                || "";
        };

        const isTaskFinished = (iframe) => {
            const parent = iframe?.parentElement;
            if (!parent) return false;
            return parent.classList.contains("ans-job-finished");
        };

        const hasUnfinishedJobs = () => {
            const mainIframe = getMainIframe();
            const innerDoc = safeDoc(mainIframe);
            if (!innerDoc) return false;
            const jobIcons = Array.from(innerDoc.querySelectorAll(".ans-job-icon"));
            if (!jobIcons.length) return false;
            return jobIcons.some((icon) => !icon.parentElement?.classList.contains("ans-job-finished"));
        };

        const scrollToUnfinishedJob = () => {
            try {
                if (typeof _unsafeWindow.scroll2Job === "function") {
                    _unsafeWindow.scroll2Job();
                    return true;
                }
            } catch {}
            const mainIframe = getMainIframe();
            const innerDoc = safeDoc(mainIframe);
            if (!innerDoc) return false;
            const jobIcons = Array.from(innerDoc.querySelectorAll(".ans-job-icon"));
            const target = jobIcons.find((icon) => !icon.parentElement?.classList.contains("ans-job-finished"));
            if (!target) return false;
            const node = target.parentElement || target;
            try {
                node.scrollIntoView({ behavior: "smooth", block: "center" });
            } catch {
                node.scrollIntoView();
            }
            return true;
        };

        let lastJobTipAt = 0;
        const handleJobFinishTip = () => {
            const now = Date.now();
            if (now - lastJobTipAt < 3000) return false;
            const rootDoc = getRootDoc();
            const tips = [
                rootDoc.querySelector(".jobFinishTip"),
                rootDoc.querySelector("#jobFinishTip")
            ].filter(Boolean);
            if (!tips.length) return false;
            const isVisible = (el) => {
                try {
                    if (el.style?.display === "none") return false;
                    const style = getComputedStyle(el);
                    return style.display !== "none" && style.visibility !== "hidden";
                } catch {
                    return true;
                }
            };
            let handled = false;
            for (const tip of tips) {
                if (!isVisible(tip)) continue;
                const goLearn = tip.querySelector(".btnBlue.btn_92_cancel, .graybtn02.nextbutton, .popMoveDele");
                if (goLearn?.click) {
                    goLearn.click();
                    handled = true;
                    break;
                }
                const closeBtn = tip.querySelector(".popClose");
                if (closeBtn?.click) {
                    closeBtn.click();
                    handled = true;
                    break;
                }
            }
            if (handled) {
                lastJobTipAt = now;
                try { _unsafeWindow.WAY?.box?.hide?.(); } catch {}
                logStore.addLog("检测到未完成提示，已返回任务点", "warning");
            }
            return handled;
        };

        const getAllIframes = (scanRoot) => new Promise((resolve) => {
            if (!scanRoot) return resolve([]);
            IframeUtils.getAllNestedIframes(scanRoot).subscribe({
                next: (allIframes) => resolve(allIframes || []),
                error: () => resolve([])
            });
        });

        const getTaskTypeFromSrc = (src) => {
            if (src.includes("api/work")) return "work";
            if (src.includes("video")) return "video";
            if (src.includes("audio")) return "audio";
            if (isDocTask(src)) return "doc";
            if (isBookTask(src)) return "book";
            return "task";
        };

        const getTaskIframes = (allIframes) => allIframes.filter((iframe) => {
            const src = iframe?.src || "";
            if (!src || src.includes("javascript:")) return false;
            if (src.includes("api/work")) return true;
            const parent = iframe.parentElement;
            if (!parent) return false;
            const hasJobIcon = parent.querySelector(".ans-job-icon") !== null;
            if (!hasJobIcon) return false;
            return src.includes("video") || src.includes("audio") || isDocTask(src) || isBookTask(src);
        });

        const getDocTextHint = (doc) => {
            const body = doc?.body;
            if (!body) return "";
            const text = typeof body.innerText === "string" ? body.innerText : (body.textContent || "");
            return text.length > 8000 ? text.slice(0, 8000) : text;
        };
        const getMediaDuration = (mediaEl) => {
            const duration = Number.isFinite(mediaEl?.duration) ? mediaEl.duration : null;
            if (!duration || duration <= 0) return null;
            return duration;
        };
        const isMediaFinished = (mediaEl) => {
            if (!mediaEl) return false;
            if (mediaEl.ended) return true;
            const duration = getMediaDuration(mediaEl);
            if (!duration) return false;
            const threshold = Math.max(duration - 0.5, duration * 0.98);
            return mediaEl.currentTime >= threshold;
        };
        const isWorkFinishedByDoc = (doc) => {
            if (!doc) return false;
            const hint = cleanText(getDocTextHint(doc));
            if (!hint) return false;

            const doneAttrSelectors = [
                "[title*='已完成']", "[title*='已提交']", "[title*='已交卷']", "[title*='已批阅']", "[title*='待批阅']",
                "[alt*='已完成']", "[alt*='已提交']", "[alt*='已交卷']", "[alt*='已批阅']", "[alt*='待批阅']"
            ];
            if (doneAttrSelectors.some((selector) => doc.querySelector(selector))) return true;

            const submitBtn = doc.querySelector(
                "#btnBlueSubmit, .btnBlueSubmit, .btnBlue, .bluebtn, .btnSubmit, button[type='submit'], input[type='submit']"
            );
            const submitText = cleanText(submitBtn?.textContent || submitBtn?.value || "");
            const submitDisabled = !!submitBtn && (
                submitBtn.disabled
                || submitBtn.getAttribute("disabled") !== null
                || submitBtn.getAttribute("aria-disabled") === "true"
                || submitBtn.classList?.contains("disabled")
                || submitBtn.classList?.contains("btn-disabled")
            );
            const redoHints = ["重新作答", "再做", "重做", "重新答题", "继续作答", "继续答题", "再次作答", "再次答题", "重新做题", "查看解析", "查看答案", "查看成绩", "查看结果", "查看报告"];
            if (submitText && includesAny(submitText, redoHints)) return true;
            const actionEls = Array.from(doc.querySelectorAll("button, a, input[type='button'], input[type='submit']"));
            const hasRedoAction = actionEls.some((el) => {
                const text = cleanText(el?.textContent || el?.value || "");
                return text && includesAny(text, redoHints);
            });
            if (hasRedoAction) return true;

            const resultSelectors = [
                ".score", ".score-wrap", ".analysis", ".work-result", ".ans-job-finished",
                ".workResult", ".exam-result", ".paper-result", ".resultScore",
                ".scoreView", ".scoreCon", ".analysisResult", ".analysis_wrap",
                ".check_answer", ".check_answer_dx", ".answer-analysis", ".analysis_cont",
                ".analysisCont", ".right_answer", ".correctAnswer", ".answerKey"
            ];
            const hasResultPanel = resultSelectors.some((selector) => doc.querySelector(selector));
            const hasScoreText = /得分\s*\d+|成绩\s*[:：]?\s*\d+|分数\s*[:：]?\s*\d+/.test(hint);

            const questions = doc.querySelectorAll(".TiMu, .questionLi");
            const inputs = doc.querySelectorAll("input, textarea, select");
            const hasInputs = inputs.length > 0;
            const hasEditableInput = hasInputs && Array.from(inputs).some((el) => {
                const disabled = el.disabled || el.getAttribute("disabled") !== null;
                const readonly = el.readOnly || el.getAttribute("readonly") !== null;
                return !(disabled || readonly);
            });
            if (questions.length > 0 && hasInputs && !hasEditableInput) return true;
            if ((hasResultPanel || hasScoreText) && (!submitBtn || submitDisabled || !hasEditableInput)) return true;

            const doneHints = [
                "作业已完成", "本次作业已完成", "已提交", "已交卷", "已批阅", "待批阅",
                "已评分", "成绩", "得分", "提交时间", "完成率100", "答题完成", "提交成功",
                "正确答案", "查看解析"
            ];
            const hasDoneHint = includesAny(hint, doneHints);
            if (hasDoneHint) {
                const notDoneHints = ["未完成", "未提交", "未作答", "未答题", "未交", "未做", "未交卷", "未开始"];
                if (!includesAny(hint, notDoneHints) || hasResultPanel || hasScoreText || submitDisabled) return true;
            }
            return false;
        };

        const getTaskDetail = (iframe) => {
            const src = iframe?.src || "";
            const doc = safeDoc(iframe);
            const type = getTaskTypeFromSrc(src);
            const meta = buildTaskMeta(iframe);
            const state = taskRegistry.get(meta.taskKey) || {};
            const saved = !!state.saved;
            const finishedByDom = isTaskFinished(iframe);
            let finishedByContent = false;
            let mediaTime = null;

            if (doc) {
                if (type === "work") {
                    finishedByContent = isWorkFinishedByDoc(doc);
                } else if (type === "video" || type === "audio") {
                    const mediaEl = doc.querySelector(type === "video" ? "video" : "audio");
                    if (mediaEl) {
                        mediaTime = Number.isFinite(mediaEl.currentTime) ? mediaEl.currentTime : null;
                        finishedByContent = isMediaFinished(mediaEl);
                    }
                } else if (type === "doc" || type === "book") {
                    const hint = getDocTextHint(doc);
                    finishedByContent = /已完成/.test(hint);
                }
            }

            return {
                iframe,
                meta,
                type,
                src,
                finished: finishedByDom || finishedByContent || !!state.finished || saved,
                saved,
                mediaTime
            };
        };

        const updateTaskRegistry = (details) => {
            const now = Date.now();
            const seen = new Set();
            details.forEach((detail) => {
                const key = detail.meta?.taskKey;
                if (!key) return;
                seen.add(key);
                const current = taskRegistry.get(key) || {
                    firstSeenAt: now,
                    lastSeenAt: now,
                    lastProgressAt: now,
                    lastMediaTime: null,
                    finished: false,
                    saved: false
                };
                current.lastSeenAt = now;
                if (detail.mediaTime != null) {
                    if (current.lastMediaTime == null || detail.mediaTime > current.lastMediaTime + 0.1) {
                        current.lastMediaTime = detail.mediaTime;
                        current.lastProgressAt = now;
                    }
                }
                if (detail.saved) current.saved = true;
                if (detail.finished && !current.finished) {
                    current.completedAt = now;
                }
                current.finished = current.finished || current.saved || detail.finished;
                current.type = detail.type;
                taskRegistry.set(key, current);
            });
            for (const [key, state] of taskRegistry) {
                if (!seen.has(key) && now - state.lastSeenAt > SMART_CHECK_CONFIG.staleTaskTtlMs) {
                    taskRegistry.delete(key);
                }
            }
        };

        const hasPendingWork = () => {
            for (const state of taskRegistry.values()) {
                if (state.type === "work" && !state.finished) return true;
            }
            return false;
        };

        const getOldestPendingMs = (pending) => {
            const now = Date.now();
            let oldest = 0;
            pending.forEach((detail) => {
                const state = taskRegistry.get(detail.meta?.taskKey || "");
                const baseTime = state?.lastProgressAt || state?.lastSeenAt || now;
                const age = now - baseTime;
                if (age > oldest) oldest = age;
            });
            return oldest;
        };

        const getTaskStats = async () => {
            const mainIframe = getMainIframe();
            const scanRoot = safeDoc(mainIframe)?.documentElement || document.documentElement;
            const allIframes = await getAllIframes(scanRoot);
            const taskIframes = getTaskIframes(allIframes);
            const details = taskIframes.map(getTaskDetail);
            updateTaskRegistry(details);

            const focusDetails = configStore.chapterSettings.onlyQuiz
                ? details.filter(detail => detail.type === "work")
                : details;
            const pending = focusDetails.filter(detail => !detail.finished);
            const pendingCount = hasUnfinishedJobs()
                ? Math.max(pending.length, 1)
                : pending.length;
            updateChapterCompletion(focusDetails.length, pendingCount);
            return { total: focusDetails.length, pendingCount };
        };

        const findNextChapterTarget = () => {
            const rootDoc = getRootDoc();
            const current = rootDoc.querySelector(".posCatalog_select.posCatalog_active")
                || rootDoc.querySelector("#coursetree .currents")
                || rootDoc.querySelector("#coursetree .current")
                || rootDoc.querySelector(".courseChapter .currents")
                || rootDoc.querySelector(".courseChapter .current");
            if (!current) return null;

            let node = current.nextElementSibling;
            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextElementSibling;
                    continue;
                }
                const disabled = node.classList.contains("disabled")
                    || node.classList.contains("posCatalog_disabled")
                    || node.classList.contains("posCatalog_locked");
                const target = node.querySelector(".posCatalog_name")
                    || node.querySelector(".catalog_name")
                    || node.querySelector("a")
                    || node;
                if (!disabled && target) {
                    return target;
                }
                node = node.nextElementSibling;
            }
            return null;
        };

        const tryJumpNextChapter = async () => {
            const rootDoc = getRootDoc();
            const nextBtn = rootDoc.querySelector("#prevNextFocusNext");
            if (nextBtn && nextBtn.style.display !== "none") {
                nextBtn.click();
                return true;
            }
            const jumpBtn = rootDoc.querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter");
            if (jumpBtn) {
                jumpBtn.click();
                return true;
            }
            const target = findNextChapterTarget();
            if (target?.click) {
                target.click();
                return true;
            }
            return false;
        };

        const runSmartCheck = async (source = "interval") => {
            if (smartCheckRunning || globalPauseState.isPaused) return;
            if (source === "interval" && Date.now() - lastSmartScanAt < SMART_CHECK_CONFIG.intervalMs * 0.6) return;
            smartCheckRunning = true;
            lastSmartScanAt = Date.now();

            try {
                const handledTip = handleJobFinishTip();
                if (handledTip && !isScanning && !activeTaskKey) {
                    lastSmartActionAt = Date.now();
                    processIframeTask();
                }
                const mainIframe = getMainIframe();
                const scanRoot = safeDoc(mainIframe)?.documentElement || document.documentElement;
                const allIframes = await getAllIframes(scanRoot);
                const taskIframes = getTaskIframes(allIframes);
                const details = taskIframes.map(getTaskDetail);
                updateTaskRegistry(details);

                const focusDetails = configStore.chapterSettings.onlyQuiz
                    ? details.filter(detail => detail.type === "work")
                    : details;
                const total = focusDetails.length;
                const pending = focusDetails.filter(detail => !detail.finished);
                const pendingCount = hasUnfinishedJobs()
                    ? Math.max(pending.length, 1)
                    : pending.length;
                updateChapterCompletion(total, pendingCount);
                if (total === 0) {
                    updateSmartKeepAlive(false);
                    const shouldCheckMissing = !configStore.chapterSettings.onlyQuiz || hasPendingWork();
                    if (shouldCheckMissing && hasUnfinishedJobs()) {
                        if (!isScanning && Date.now() - lastSmartActionAt > SMART_CHECK_CONFIG.rescanCooldownMs) {
                            lastSmartActionAt = Date.now();
                            if (scrollToUnfinishedJob()) {
                                logStore.addLog("智能检查：已定位未完成任务点", "warning");
                            }
                            logStore.addLog("智能检查：任务点未加载，尝试重新扫描", "warning");
                            processIframeTask();
                        }
                        if (Date.now() - lastActivityAt > SMART_CHECK_CONFIG.missingTaskRefreshMs) {
                            autoRecover("智能检查：任务点未加载");
                        }
                    }
                    return;
                }

                updateSmartKeepAlive(pendingCount > 0);
                if (pendingCount === 0) return;

                const activeExists = activeTaskKey && focusDetails.some(detail => detail.meta?.taskKey === activeTaskKey);
                if (activeTaskKey && !activeExists) {
                    clearActiveTask();
                }

                if (!isScanning && !activeTaskKey && pendingCount > 0) {
                    const now = Date.now();
                    if (now - lastSmartActionAt > SMART_CHECK_CONFIG.rescanCooldownMs) {
                        lastSmartActionAt = now;
                        if (scrollToUnfinishedJob()) {
                            logStore.addLog("智能检查：已定位未完成任务点", "warning");
                        }
                        logStore.addLog("智能检查：发现未完成任务点，重新排查", "warning");
                        processIframeTask();
                    }
                }

                const oldestPendingMs = getOldestPendingMs(pending);
                if (oldestPendingMs > SMART_CHECK_CONFIG.pendingMaxMs) {
                    autoRecover("智能检查：任务点长时间未完成");
                }
            } finally {
                smartCheckRunning = false;
            }
        };

        const startSmartInspector = () => {
            if (smartCheckTimer) return;
            smartCheckTimer = setInterval(() => runSmartCheck("interval"), SMART_CHECK_CONFIG.intervalMs);
        };

        const extractChapterSection = (text) => {
            const clean = cleanText(text);
            if (!clean) return "";
            const chapterMatch = clean.match(/第\s*([0-9一二三四五六七八九十百]+)\s*章/);
            const sectionMatch = clean.match(/第\s*([0-9一二三四五六七八九十百]+)\s*节/);
            let chapter = chapterMatch?.[1] || "";
            let section = sectionMatch?.[1] || "";
            if (!chapter || !section) {
                const numberMatch = clean.match(/(\d+(?:\.\d+)+)/);
                if (numberMatch) {
                    const parts = numberMatch[1].split(".").filter(Boolean);
                    if (!chapter && parts[0]) chapter = parts[0];
                    if (!section && parts[1]) section = parts[1];
                }
            }
            if (!chapter && !section) return "";
            return `${chapter ? `第${chapter}章` : ""}${section ? `第${section}节` : ""}`;
        };

        const getIframeJobInfo = (iframe) => {
            let jobId = iframe?.getAttribute?.("jobid") || "";
            let objectId = iframe?.getAttribute?.("objectid") || "";
            let mid = iframe?.getAttribute?.("mid") || "";
            let title = iframe?.getAttribute?.("title") || "";
            const dataAttr = iframe?.getAttribute?.("data") || "";
            if (dataAttr) {
                try {
                    const data = JSON.parse(dataAttr);
                    jobId = jobId || data.jobid || data._jobid || "";
                    objectId = objectId || data.objectid || data.objectId || "";
                    mid = mid || data.mid || "";
                    title = title || data.name || data.title || "";
                } catch {}
            }
            return { jobId, objectId, mid, title };
        };

        const buildTaskMeta = (iframe) => {
            const src = iframe?.src || "";
            const taskType = getTaskTypeFromSrc(src);
            let typeName = "任务点";
            if (taskType === "work") typeName = "作业";
            else if (taskType === "video") typeName = "视频";
            else if (taskType === "audio") typeName = "音频";
            else if (taskType === "doc") typeName = "文档";
            else if (taskType === "book") typeName = "电子书";

            const { jobId, objectId, mid } = getIframeJobInfo(iframe);

            let id = "";
            try {
                const url = new URL(src, window.location.href);
                id = url.searchParams.get("jobid")
                    || url.searchParams.get("jobId")
                    || url.searchParams.get("objectid")
                    || url.searchParams.get("objectId")
                    || url.searchParams.get("mid")
                    || url.searchParams.get("knowledgeId")
                    || "";
            } catch {}
            if (!id) {
                id = jobId || objectId || mid || "";
            }

            if (!iframe.__cxTaskKey) {
                const chapterId = getChapterId();
                const keyParts = [typeName, chapterId, jobId || objectId || mid || ""].filter(Boolean);
                if (keyParts.length >= 2) {
                    iframe.__cxTaskKey = keyParts.join("-");
                } else
                if (id) {
                    iframe.__cxTaskKey = `${typeName}-${id}`;
                } else if (iframe?.__cxTaskOrder) {
                    iframe.__cxTaskKey = `${typeName}-idx-${iframe.__cxTaskOrder}`;
                } else if (src) {
                    iframe.__cxTaskKey = `${typeName}-${src}`;
                } else {
                    iframe.__cxTaskKey = `task-${++taskSeq}`;
                }
            }

            const labelParts = [];
            const order = Number(iframe?.__cxTaskOrder || 0);
            const chapterInfo = getChapterInfo();
            const chapterSection = chapterInfo.chapterLabel || extractChapterSection(chapterInfo.title || "");
            if (chapterSection) labelParts.push(chapterSection);
            if (order) {
                labelParts.push(`第${order}个任务点`);
            } else {
                labelParts.push("任务点");
            }

            return {
                taskKey: iframe.__cxTaskKey,
                taskLabel: labelParts.join(" ").trim() || "任务点",
                taskType
            };
        };

        const createTaskLogger = (iframe) => {
            const meta = buildTaskMeta(iframe);
            const log = (message, type = "info") => {
                touchActivity();
                logStore.addLog(message, type, meta);
            };
            return { log, meta };
        };

        // 核心：处理视频/音频（暴力轮询，替代复杂的 VideoGuard）
        const processMedia = (mediaType, doc, win, taskId, addLog, taskMeta) => {
            return new Promise((resolve) => {
                const log = addLog || ((message, type = "info") => logStore.addLog(message, type));
                const typeName = mediaType === 'video' ? '视频' : '音频';
                
                const checkMedia = () => {
                    try {
                        const media = doc.querySelector(mediaType);
                        if (!media) return null;
                        return media;
                    } catch {
                        return null;
                    }
                };

                const tryAutoPlay = async (mediaEl) => {
                    if (!mediaEl) return;
                    if (configStore.videoSettings.muted) {
                        mediaEl.muted = true;
                        mediaEl.volume = 0;
                    }
                    mediaEl.autoplay = true;
                    try {
                        await mediaEl.play();
                    } catch (e) {
                        try {
                            mediaEl.muted = true;
                            mediaEl.volume = 0;
                            await mediaEl.play();
                        } catch {}
                    }
                };
                
                let media = checkMedia();
                if (!media) {
                    // 等待媒体元素出现
                    let waitCount = 0;
                    const waitTimer = setInterval(() => {
                        media = checkMedia();
                        waitCount++;
                        if (media || waitCount > 30) { // 最多等30秒
                            clearInterval(waitTimer);
                            if (!media) {
                                log(`未找到${typeName}元素`, "warning");
                                markFailure(`${typeName}元素未找到`);
                                resolve();
                                return;
                            }
                            startGuard();
                        }
                    }, 1000);
                    return;
                }
                
                startGuard();
                
                function startGuard() {
                    setActiveTask(taskMeta);
                    if (isMediaFinished(media)) {
                        touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || mediaType });
                        log(`${typeName}已完成`, "success");
                        return resolve();
                    }
                    
                    // 检查是否已处理过
                    if (__mediaProcessedMap.has(media)) {
                        log(`${typeName}正在由其他任务处理`, "info");
                        return resolve();
                    }
                    __mediaProcessedMap.set(media, true);
                    keepAlive.start();
                    
                    log(`开始播放${typeName}`, "primary");
                    
                    if (win && !win.__cxHelperAlertHooked) {
                        try {
                            win.alert = () => {};
                            win.confirm = () => true;
                            win.prompt = () => "";
                            win.__cxHelperAlertHooked = true;
                        } catch {}
                    }
                    
                    let stuckCount = 0;
                    let lastTime = media.currentTime;
                    let lastLogTime = 0;
                    let finished = false;
                    let timer = null;
                    let timeoutId = null;

                    const finish = (message, type, done = false) => {
                        if (finished) return;
                        finished = true;
                        if (timer) clearInterval(timer);
                        if (timeoutId) clearTimeout(timeoutId);
                        media.removeEventListener("pause", onPause);
                        media.removeEventListener("ended", onEnded);
                        media.removeEventListener("waiting", onWaiting);
                        media.removeEventListener("stalled", onWaiting);
                        media.removeEventListener("error", onWaiting);
                        media.removeEventListener("timeupdate", onProgress);
                        media.removeEventListener("playing", onProgress);
                        media.removeEventListener("seeked", onProgress);
                        __mediaProcessedMap.delete(media);
                        keepAlive.stop();
                        if (done) {
                            touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || mediaType });
                        }
                        if (message) log(message, type);
                        resolve();
                    };

                    const onPause = () => {
                        if (globalPauseState.isPaused) return;
                        tryAutoPlay(media);
                    };

                    const onEnded = () => {
                        finish(`${typeName}播放结束`, "success", true);
                    };

                    const onWaiting = () => {
                        if (globalPauseState.isPaused) return;
                        tryAutoPlay(media);
                    };
                    const onProgress = () => {
                        markTaskProgress(taskMeta);
                    };

                    media.addEventListener("pause", onPause);
                    media.addEventListener("ended", onEnded);
                    media.addEventListener("waiting", onWaiting);
                    media.addEventListener("stalled", onWaiting);
                    media.addEventListener("error", onWaiting);
                    media.addEventListener("timeupdate", onProgress);
                    media.addEventListener("playing", onProgress);
                    media.addEventListener("seeked", onProgress);

                    tryAutoPlay(media);
                    
                    // 暴力轮询守护（每1.5秒检查一次）
                    timer = setInterval(async () => {
                        // 检查任务失效
                        if (taskId !== currentTaskId) {
                            finish();
                            return;
                        }
                        
                        // 检查全局暂停
                        if (globalPauseState.isPaused) return;
                        
                        // 检查是否结束
                        if (isMediaFinished(media)) {
                            finish(`${typeName}播放结束`, "success", true);
                            return;
                        }
                        
                        // 强制播放（后台保活核心）
                        if (media.paused) {
                            const now = Date.now();
                            if (now - lastLogTime > 10000) { // 10秒最多记录一次
                                log(`${typeName}被暂停，尝试恢复...`, "warning");
                                lastLogTime = now;
                            }
                            await tryAutoPlay(media);
                        }
                        
                        // 卡顿检测
                        if (Math.abs(media.currentTime - lastTime) < 0.1) {
                            stuckCount++;
                            if (stuckCount > 8) { // 16秒无进度
                                log(`${typeName}进度卡顿，尝试恢复`, "danger");
                                try {
                                    media.pause();
                                    await tryAutoPlay(media);
                                } catch {}
                                stuckCount = 0;
                            }
                        } else {
                            stuckCount = 0;
                            lastTime = media.currentTime;
                            markTaskProgress(taskMeta);
                        }
                    }, 1500);
                    
                    // 超时保护：20分钟
                    timeoutId = setTimeout(() => {
                        if (!isMediaFinished(media)) {
                            finish(`${typeName}处理超时`, "warning");
                            markFailure(`${typeName}处理超时`);
                            return;
                        }
                        finish();
                    }, 1200000);
                }
            });
        };

        // 处理章节作业
        const processWork = async (iframe, doc, win, addLog, taskMeta) => {
            const log = addLog || ((message, type = "info") => logStore.addLog(message, type));
            touchActivity();
            log("处理章节测试...", "info");
            
            if (!doc) return;

            try {
                if (isWorkFinishedByDoc(doc)) {
                    log("测试已完成", "success");
                    touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || "work" });
                    return;
                }

                await waitIfPaused();
                
                decrypt(doc);
                const summary = await new CxQuestionHandler("zj", iframe).init();
                
                if (win) win.alert = () => {};
                
                if (!summary?.total) {
                    if (isWorkFinishedByDoc(doc)) {
                        log("测试已完成", "success");
                        touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || "work" });
                        touchProgress();
                        return;
                    }
                    log("未解析到题目，跳过提交", "warning");
                    return;
                }

                let saved = false;
                if (configStore.chapterSettings.autoSubmit) {
                    const threshold = configStore.otherParams.params[2]?.value ?? 0;
                    const hitRate = summary?.hitRate ?? 0;
                    if (threshold > 0 && hitRate < threshold) {
                        log(`命中率低于 ${threshold}%，暂存答案`, "warning");
                        try { await win?.noSubmit?.(); } catch {}
                        saved = true;
                    } else {
                        log("自动提交", "success");
                        try {
                            await win?.btnBlueSubmit?.();
                            await sleep(1);
                            await win?.submitCheckTimes?.();
                        } catch {}
                    }
                } else {
                    log("暂存答案", "info");
                    try { await win?.noSubmit?.(); } catch {}
                    saved = true;
                }
                touchTaskState(taskMeta, { finished: true, saved, type: taskMeta?.taskType || "work" });
                touchProgress();
            } catch (e) {
                log("章节测试处理失败", "warning");
                markFailure("章节测试处理失败");
            }
        };

        const processPpt = async (win, addLog, taskMeta) => {
            const log = addLog || ((message, type = "info") => logStore.addLog(message, type));
            if (!win?.document) return;
            log("处理文档/PPT任务...", "info");
            try {
                const panView = win.document.querySelector("#panView");
                const viewWin = panView?.contentWindow || win;
                const viewDoc = viewWin?.document;
                if (viewDoc?.body) {
                    viewWin.scrollTo({ top: viewDoc.body.scrollHeight, behavior: "smooth" });
                }
                log("阅读完成", "success");
                touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || "doc" });
                touchProgress();
            } catch (e) {
                log("文档处理失败", "warning");
                markFailure("文档处理失败");
            }
        };

        const processBook = async (win, addLog, taskMeta) => {
            const log = addLog || ((message, type = "info") => logStore.addLog(message, type));
            log("处理电子书任务...", "info");
            try {
                if (_unsafeWindow.top?.onchangepage && win?.getFrameAttr) {
                    _unsafeWindow.top.onchangepage(win.getFrameAttr("end"));
                    log("阅读完成", "success");
                    touchTaskState(taskMeta, { finished: true, type: taskMeta?.taskType || "book" });
                    touchProgress();
                } else {
                    log("未找到电子书翻页接口", "warning");
                    markFailure("电子书翻页接口缺失");
                }
            } catch (e) {
                log("电子书处理失败", "warning");
                markFailure("电子书处理失败");
            }
        };

        // 处理单个 iframe
        const processIframe = async (iframe, taskId) => {
            try {
                await waitIfPaused();
                if (taskId !== currentTaskId) return;
                
                await waitIframeLoad(iframe);
                if (taskId !== currentTaskId) return;

                const src = iframe.src || "";
                if (!src || src.includes("javascript:")) return;

                const doc = safeDoc(iframe);
                const win = iframe.contentWindow;
                if (!doc || !win) return;

                applyDocumentHooks(doc, win);
                const parent = iframe.parentElement;
                const hasJobIcon = parent?.querySelector(".ans-job-icon");
                const isTask = src.includes("api/work") || hasJobIcon;
                if (!isTask) return;

                const { log: taskLog, meta: taskMeta } = createTaskLogger(iframe);
                const detail = getTaskDetail(iframe);
                touchTaskState(detail.meta, { finished: detail.finished, saved: detail.saved, type: detail.type });
                setActiveTask(taskMeta);
                if (!iframe.__cxTaskStarted) {
                    taskLog(`正在处理【${taskMeta.taskLabel || "任务点"}】`, "primary");
                    iframe.__cxTaskStarted = true;
                }

                if (detail.saved && detail.type === "work") {
                    taskLog("已暂存，跳过重复答题", "info");
                    touchTaskState(taskMeta, { saved: true, finished: true, type: taskMeta.taskType });
                    clearActiveTask(taskMeta);
                    return;
                }

                // 跳过已完成
                if (detail.finished && configStore.chapterSettings.skipCompleted) {
                    taskLog("跳过已完成任务点", "info");
                    touchTaskState(taskMeta, { finished: true, type: taskMeta.taskType });
                    clearActiveTask(taskMeta);
                    return;
                }

                if (src.includes("api/work")) {
                    await processWork(iframe, doc, win, taskLog, taskMeta);
                    clearActiveTask(taskMeta);
                    return;
                }

                if (configStore.chapterSettings.onlyQuiz) {
                    clearActiveTask(taskMeta);
                    return;
                }

                if (hasJobIcon) {
                    if (src.includes("video")) {
                        await processMedia("video", doc, win, taskId, taskLog, taskMeta);
                    } else if (src.includes("audio")) {
                        await processMedia("audio", doc, win, taskId, taskLog, taskMeta);
                    } else if (isDocTask(src)) {
                        await processPpt(win, taskLog, taskMeta);
                    } else if (isBookTask(src)) {
                        await processBook(win, taskLog, taskMeta);
                    }
                }
                clearActiveTask(taskMeta);
            } catch (e) {
                console.warn("处理iframe出错:", e);
                markFailure("处理任务点出错");
                clearActiveTask();
            }
        };

        // 初始化
        init();
        processIframeTask();
        setupInterceptor();
    };

    // ==================== 17. 作业和考试逻辑 ====================
    const useCxWorkLogic = async () => {
        const logStore = useLogStore();
        if (licenseLocked) {
            logStore.addLog("许可验证未通过，功能已锁定", "danger");
            return;
        }
        logStore.addLog("作业页面", "primary");
        await sleep(2);
        await new CxQuestionHandler("zy").init();
    };

    const useCxExamLogic = async () => {
        const logStore = useLogStore();
        const configStore = useConfigStore();
        if (licenseLocked) {
            logStore.addLog("许可验证未通过，功能已锁定", "danger");
            return;
        }
        logStore.addLog("考试页面", "primary");
        await sleep(2);
        await new CxQuestionHandler("ks").init();
        
        if (configStore.platformParams.cx.parts[1].params[0].value) {
            await sleep(configStore.otherParams.params[0].value);
            const currentQuestionNum = parseInt(_unsafeWindow.document.querySelector(".topicNumber_list .current")?.innerText || "0", 10);
            const totalQuestions = _unsafeWindow.document.querySelectorAll(".topicNumber_list li").length;
            if (totalQuestions && currentQuestionNum >= totalQuestions) {
                logStore.addLog("当前已是最后一题，不再自动切换", "warning");
                logStore.addLog("请检查答案后手动提交试卷", "primary");
            } else {
                _unsafeWindow.getTheNextQuestion?.(1);
            }
        }
    };

    // ==================== 18. Vue 组件 ====================
    
    const ScriptHome = {
        props: { logList: Array },
        setup(props) {
            const scrollRef = vue.ref(null);
            const openGroups = vue.ref([]);
            
            vue.watch(() => props.logList.length, () => {
                vue.nextTick(() => scrollRef.value?.setScrollTop?.(99999));
            });
            
            const isPaused = vue.computed(() => globalPauseState.isPaused);
            const entries = vue.computed(() => {
                const groups = new Map();
                const list = [];
                props.logList.forEach((item, index) => {
                    if (item.taskKey) {
                        const key = item.taskKey;
                        let group = groups.get(key);
                        if (!group) {
                            group = { key, label: item.taskLabel || "任务点", items: [], lastTime: item.time, lastType: item.type };
                            groups.set(key, group);
                            list.push({ type: "group", group, key: `group-${key}` });
                        }
                        if (item.taskLabel) {
                            group.label = item.taskLabel;
                        }
                        group.items.push(item);
                        group.lastTime = item.time;
                        group.lastType = item.type;
                    } else {
                        list.push({ type: "log", item, key: `log-${index}` });
                    }
                });
                return list;
            });

            const isOpen = (key) => openGroups.value.includes(key);
            const toggleGroup = (key) => {
                const set = new Set(openGroups.value);
                if (set.has(key)) set.delete(key);
                else set.add(key);
                openGroups.value = Array.from(set);
            };

            const renderLogItem = (item, key) => {
                return vue.h('div', { key, class: ['log-item', `type-${item.type}`] }, [
                    vue.h('span', { class: 'log-time' }, item.time),
                    vue.h('span', { class: 'log-message' }, item.message)
                ]);
            };

            const renderGroupHeader = (group, opened, key) => {
                const type = group.lastType || "info";
                return vue.h('div', {
                    key,
                    class: ['log-item', 'log-group-header', `type-${type}`],
                    onClick: () => toggleGroup(group.key)
                }, [
                    vue.h('span', { class: 'log-time' }, group.lastTime || ""),
                    vue.h('span', { class: 'log-message' }, group.label || "任务点"),
                    vue.h('span', { class: 'log-group-count' }, `(${group.items.length})`),
                    vue.h('span', { class: 'log-group-toggle' }, opened ? '收起' : '展开')
                ]);
            };
            
            return () => vue.h('div', { class: 'script-log-container', style: { height: '100%' } }, [
                vue.h('div', { 
                    class: ['status-indicator', isPaused.value ? 'paused' : 'running']
                }, [
                    vue.h('span', { class: 'status-dot' }),
                    vue.h('span', isPaused.value ? '已暂停' : '运行中')
                ]),
                vue.h(vue.resolveComponent('el-scrollbar'), { ref: scrollRef, height: "calc(100% - 40px)" }, 
                    () => props.logList.length === 0 
                        ? vue.h('div', { class: 'empty-log' }, '暂无日志')
                        : entries.value.map((entry) => {
                            if (entry.type === "log") {
                                return renderLogItem(entry.item, entry.key);
                            }
                            const group = entry.group;
                            const opened = isOpen(group.key);
                            return vue.h('div', { key: entry.key, class: 'log-group' }, [
                                renderGroupHeader(group, opened, `${entry.key}-header`),
                                opened
                                    ? group.items.map((item, index) => renderLogItem(item, `${entry.key}-${index}`))
                                    : null
                            ]);
                        })
                )
            ]);
        }
    };

    const ApiManager = {
        setup() {
            const configStore = useConfigStore();
            const logStore = useLogStore();
            const newApiUrl = vue.ref("");
            const editingIndex = vue.ref(-1);
            const editingUrl = vue.ref("");
            
            const addApi = () => {
                if (newApiUrl.value.trim()) {
                    if (configStore.addApi(newApiUrl.value)) {
                        logStore.addLog("API添加成功", "success");
                        newApiUrl.value = "";
                    } else {
                        logStore.addLog("API已存在或格式无效", "warning");
                    }
                }
            };
            
            const startEdit = (index, url) => {
                editingIndex.value = index;
                editingUrl.value = url;
            };
            
            const cancelEdit = () => {
                editingIndex.value = -1;
                editingUrl.value = "";
            };
            
            const confirmEdit = () => {
                if (editingUrl.value.trim()) {
                    if (configStore.updateApi(editingIndex.value, editingUrl.value)) {
                        logStore.addLog("API修改成功", "success");
                        cancelEdit();
                    } else {
                        logStore.addLog("API已存在或格式无效", "warning");
                    }
                }
            };
            
            const deleteApi = (index) => {
                if (configStore.removeApi(index)) {
                    logStore.addLog("API删除成功", "success");
                    if (editingIndex.value === index) {
                        cancelEdit();
                    } else if (editingIndex.value > index) {
                        editingIndex.value--;
                    }
                } else {
                    logStore.addLog("至少保留一个API", "warning");
                }
            };
            
            const renderApiItem = (url, index) => {
                if (editingIndex.value === index) {
                    return vue.h('div', { key: 'edit-' + index, class: 'edit-row' }, [
                        vue.h(vue.resolveComponent('el-input'), {
                            modelValue: editingUrl.value,
                            'onUpdate:modelValue': v => editingUrl.value = v,
                            size: "small",
                            placeholder: "输入API地址",
                            autofocus: true,
                            onKeyup: (e) => {
                                if (e.key === 'Enter') confirmEdit();
                                if (e.key === 'Escape') cancelEdit();
                            }
                        }),
                        vue.h('div', { class: 'edit-actions' }, [
                            vue.h('div', {
                                class: 'edit-action-btn confirm',
                                onClick: confirmEdit,
                                title: '确认'
                            }, [
                                vue.h(vue.resolveComponent('el-icon'), { size: 14 }, () => vue.h(CheckIcon))
                            ]),
                            vue.h('div', {
                                class: 'edit-action-btn cancel',
                                onClick: cancelEdit,
                                title: '取消'
                            }, [
                                vue.h(vue.resolveComponent('el-icon'), { size: 14 }, () => vue.h(CloseIcon))
                            ])
                        ])
                    ]);
                }
                
                return vue.h('div', { 
                    key: index,
                    class: ['api-item', { active: index === configStore.currentApiIndex }],
                    onClick: () => configStore.selectApi(index),
                    onDblclick: () => startEdit(index, url)
                }, [
                    vue.h(vue.resolveComponent('el-icon'), { 
                        size: 14, 
                        color: index === configStore.currentApiIndex ? '#764ba2' : '#c0c4cc'
                    }, () => vue.h(CheckIcon)),
                    vue.h('span', { class: 'api-url', title: url }, url),
                    vue.h('div', { class: 'action-btns' }, [
                        vue.h(vue.resolveComponent('el-icon'), {
                            class: 'action-btn',
                            size: 14,
                            color: '#409eff',
                            onClick: (e) => { e.stopPropagation(); startEdit(index, url); },
                            title: '编辑'
                        }, () => vue.h(EditIcon)),
                        configStore.apiList.length > 1 ? vue.h(vue.resolveComponent('el-icon'), {
                            class: 'action-btn',
                            size: 14,
                            color: '#f56c6c',
                            onClick: (e) => { e.stopPropagation(); deleteApi(index); },
                            title: '删除'
                        }, () => vue.h(DeleteIcon)) : null
                    ])
                ]);
            };
            
            return () => vue.h('div', { class: 'api-manager', style: { height: '100%' } }, [
                vue.h(vue.resolveComponent('el-scrollbar'), { height: "calc(100% - 50px)" }, () => 
                    configStore.apiList.length > 0
                        ? configStore.apiList.map((url, index) => renderApiItem(url, index))
                        : vue.h('div', { class: 'empty-tip' }, '暂无API，请添加')
                ),
                vue.h('div', { class: 'add-api' }, [
                    vue.h(vue.resolveComponent('el-input'), {
                        modelValue: newApiUrl.value,
                        'onUpdate:modelValue': v => newApiUrl.value = v,
                        placeholder: "输入API地址 (如: http://localhost:3000)",
                        size: "small",
                        onKeyup: (e) => e.key === 'Enter' && addApi()
                    }),
                    vue.h(vue.resolveComponent('el-button'), {
                        type: "primary",
                        size: "small",
                        onClick: addApi
                    }, () => "添加")
                ])
            ]);
        }
    };

    const ScriptSetting = {
        setup() {
            const configStore = useConfigStore();
            
            const icons = { 
                "章节设置": "📚", 
                "考试设置": "📝", 
                "视频设置": "🎬",
                "其他参数": "⚙️" 
            };
            
            const platformParams = vue.computed(() => configStore.platformParams);
        const otherParams = vue.computed(() => configStore.otherParams);
            
        const updateParamValue = (partIndex, paramIndex, value) => {
            configStore.platformParams.cx.parts[partIndex].params[paramIndex].value = value;
        };
            
        const updateOtherParamValue = (paramIndex, value) => {
            configStore.otherParams.params[paramIndex].value = value;
            if (configStore.otherParams.params[paramIndex].name === "许可密钥") {
                configStore.licenseKey = value;
            }
        };
            
            return () => vue.h('div', { class: "script-setting", style: { height: '100%' } }, [
                vue.h(vue.resolveComponent('el-scrollbar'), { height: "100%" }, () => [
                    ...platformParams.value.cx.parts.map((part, partIndex) => 
                        vue.h('div', { key: 'part-' + partIndex, class: 'setting-section' }, [
                            vue.h('div', { class: 'section-title' }, [
                                vue.h('span', icons[part.name] || '📋'),
                                vue.h('span', part.name)
                            ]),
                            ...part.params.map((param, paramIndex) => 
                                vue.h('div', { key: 'param-' + paramIndex, class: 'setting-item' }, [
                                    vue.h('div', [
                                        vue.h('span', { class: 'setting-label' }, param.name),
                                        param.tip ? vue.h('div', { class: 'setting-tip' }, param.tip) : null
                                    ]),
                                    param.type === "boolean"
                                        ? vue.h(vue.resolveComponent('el-switch'), {
                                            modelValue: param.value,
                                            'onUpdate:modelValue': v => updateParamValue(partIndex, paramIndex, v),
                                            size: "small"
                                        })
                                        : vue.h(vue.resolveComponent('el-input-number'), {
                                            modelValue: param.value,
                                            'onUpdate:modelValue': v => updateParamValue(partIndex, paramIndex, v),
                                            min: param.min || 1,
                                            max: param.max || 100,
                                            size: "small",
                                            controlsPosition: "right"
                                        })
                                ])
                            )
                        ])
                    ),
                    vue.h('div', { class: 'setting-section' }, [
                        vue.h('div', { class: 'section-title' }, [
                            vue.h('span', icons[otherParams.value.name] || '⚙️'),
                            vue.h('span', otherParams.value.name)
                        ]),
                        ...otherParams.value.params.map((param, index) => 
                            vue.h('div', { key: 'other-' + index, class: 'setting-item' }, [
                                vue.h('div', [
                                    vue.h('span', { class: 'setting-label' }, param.name),
                                    param.tip ? vue.h('div', { class: 'setting-tip' }, param.tip) : null
                                ]),
                                param.type === "number"
                                    ? vue.h(vue.resolveComponent('el-input-number'), {
                                        modelValue: param.value,
                                        'onUpdate:modelValue': v => updateOtherParamValue(index, v),
                                        min: param.min || 0,
                                        max: param.max || 100,
                                        size: "small",
                                        controlsPosition: "right"
                                    })
                                    : vue.h(vue.resolveComponent('el-input'), {
                                        modelValue: param.value,
                                        'onUpdate:modelValue': v => updateOtherParamValue(index, v),
                                        size: "small",
                                        placeholder: param.tip || "请输入"
                                    })
                            ])
                        )
                    ])
                ])
            ]);
        }
    };

    const QuestionTable = {
        props: { questionList: Array },
        setup(props) {
            return () => vue.h('div', { class: 'script-question-table', style: { height: '100%' } }, [
                props.questionList.length > 0
                    ? vue.h(vue.resolveComponent('el-scrollbar'), { height: "100%" }, () =>
                        vue.h(vue.resolveComponent('el-table'), {
                            data: props.questionList,
                            stripe: true,
                            size: "small"
                        }, () => [
                            vue.h(vue.resolveComponent('el-table-column'), { type: "index", width: "40", label: "#" }),
                            vue.h(vue.resolveComponent('el-table-column'), { 
                                prop: "title", label: "题目", minWidth: "140", showOverflowTooltip: true 
                            }),
                            vue.h(vue.resolveComponent('el-table-column'), { 
                                prop: "answer", label: "答案", minWidth: "100"
                            }, {
                                default: scope => vue.h('div', { 
                                    style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '11px' },
                                    innerHTML: Array.isArray(scope.row.answer) ? scope.row.answer.join('<br>') : scope.row.answer
                                })
                            })
                        ])
                    )
                    : vue.h(vue.resolveComponent('el-empty'), { description: "暂无题目", imageSize: 50 })
            ]);
        }
    };

    const IndexComponent = {
        setup() {
            const configStore = useConfigStore();
            const logStore = useLogStore();
            const questionStore = useQuestionStore();

            const tabs = [
                { label: "日志", name: "0", component: ScriptHome, props: { logList: logStore.logList } },
                { label: "题目", name: "1", component: QuestionTable, props: { questionList: questionStore.questionList } },
                { label: "API", name: "2", component: ApiManager },
                { label: "设置", name: "3", component: ScriptSetting }
            ];

            return () => vue.h(vue.resolveComponent('el-tabs'), {
                modelValue: configStore.menuIndex,
                'onUpdate:modelValue': v => configStore.menuIndex = v,
                style: { height: '100%' }
            }, () => tabs.map(tab => 
                vue.h(vue.resolveComponent('el-tab-pane'), { 
                    key: tab.name, 
                    label: tab.label,
                    name: tab.name,
                    style: { height: '100%' }
                }, () => vue.h(tab.component, tab.props))
            ));
        }
    };

    const LayoutComponent = {
        setup() {
            const configStore = useConfigStore();
            const logStore = useLogStore();

            logStore.addLog("脚本启动 v" + getScriptInfo().version, "success");
            let logicStarted = false;
            let licenseCheckTimer = null;
            const startLogic = () => {
                const url = window.location.href;
                const urlLogicPairs = [
                    { keyword: "/mycourse/studentstudy", logic: useCxChapterLogic },
                    { keyword: "/mooc2/work/dowork", logic: useCxWorkLogic },
                    { keyword: "/exam-ans/exam", logic: useCxExamLogic },
                    { keyword: "mycourse/stu?courseid", logic: () => logStore.addLog("请进入章节或答题页", "warning") }
                ];

                for (const { keyword, logic } of urlLogicPairs) {
                    if (url.includes(keyword)) {
                        logic();
                        break;
                    }
                }
            };
            const startLogicOnce = () => {
                if (logicStarted) return;
                logicStarted = true;
                startLogic();
            };
            const validateLicense = async () => {
                const api = configStore.currentApiUrl;
                const licenseKey = configStore.licenseKey || "";
                if (!licenseKey) {
                    lockLicense(logStore, "未填写许可密钥，功能已锁定");
                    return false;
                }
                try {
                    await new Promise((resolve, reject) => {
                        _GM_xmlhttpRequest({
                            url: `${api}/licenses/validate`,
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            data: JSON.stringify({ licenseKey }),
                            timeout: 15000,
                            onload: (resp) => {
                                if (resp.status === 200) resolve();
                                else reject(new Error(resp.responseText || "许可验证失败"));
                            },
                            onerror: () => reject(new Error("许可验证请求失败")),
                            ontimeout: () => reject(new Error("许可验证超时"))
                        });
                    });
                    logStore.addLog("许可验证通过", "success");
                    licenseLocked = false;
                    return true;
                } catch (e) {
                    lockLicense(logStore, `许可验证失败：${e.message}`);
                    return false;
                }
            };
            const runLicenseValidation = async () => {
                const ok = await validateLicense();
                if (ok) startLogicOnce();
            };
            const scheduleLicenseValidation = () => {
                if (licenseCheckTimer) clearTimeout(licenseCheckTimer);
                licenseCheckTimer = setTimeout(runLicenseValidation, 600);
            };
            runLicenseValidation();

            vue.watch(configStore, (newVal) => {
                const saveConfig = { ...newVal };
                _GM_setValue("config", JSON.stringify(saveConfig));
            }, { deep: true });
            vue.watch(
                () => [configStore.licenseKey, configStore.currentApiUrl],
                scheduleLicenseValidation
            );

            const isDragging = vue.ref(false);
            const offsetX = vue.ref(0);
            const offsetY = vue.ref(0);

            const position = vue.ref({
                left: configStore.position.x,
                top: configStore.position.y
            });
            
            const isPaused = vue.computed(() => globalPauseState.isPaused);

            const startDrag = (event) => {
                isDragging.value = true;

                const rect = event.currentTarget
                    .closest('.main-panel')
                    .getBoundingClientRect();

                offsetX.value = event.clientX - rect.left;
                offsetY.value = event.clientY - rect.top;

                const onMouseUp = () => {
                    isDragging.value = false;
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                    window.removeEventListener("blur", onMouseUp);
                };

                const onMouseMove = (e) => {
                    if (!isDragging.value) return;

                    if (e.buttons !== 1) {
                        onMouseUp();
                        return;
                    }

                    let x = Math.max(0, Math.min(e.clientX - offsetX.value, window.innerWidth - 360));
                    let y = Math.max(0, Math.min(e.clientY - offsetY.value, window.innerHeight - 50));

                    position.value = { left: `${x}px`, top: `${y}px` };
                    configStore.position.x = `${x}px`;
                    configStore.position.y = `${y}px`;
                };

                window.addEventListener("blur", onMouseUp);
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            };

            const startCircleDrag = (event) => {
                if (event.button !== 0) return;
                event.preventDefault();

                let moved = false;
                isDragging.value = true;

                const circleEl = event.currentTarget;
                const rect = circleEl.getBoundingClientRect();
                const circleW = rect.width || 20;
                const circleH = rect.height || 20;

                offsetX.value = event.clientX - rect.left;
                offsetY.value = event.clientY - rect.top;

                if (event.pointerId != null && circleEl.setPointerCapture) {
                    try { circleEl.setPointerCapture(event.pointerId); } catch {}
                }

                const cleanup = () => {
                    isDragging.value = false;
                    document.removeEventListener("pointermove", onPointerMove);
                    document.removeEventListener("pointerup", onPointerUp);
                    document.removeEventListener("pointercancel", onPointerUp);
                    window.removeEventListener("blur", onPointerUp);
                };

                const onPointerUp = () => {
                    cleanup();
                    if (!moved) configStore.isMinus = false; // click toggles展开
                };

                const onPointerMove = (e) => {
                    if (!isDragging.value || e.buttons !== 1) {
                        cleanup();
                        return;
                    }

                    moved = true;
                    let x = Math.max(0, Math.min(e.clientX - offsetX.value, window.innerWidth - circleW));
                    let y = Math.max(0, Math.min(e.clientY - offsetY.value, window.innerHeight - circleH));

                    position.value = { left: `${x}px`, top: `${y}px` };
                    configStore.position.x = `${x}px`;
                    configStore.position.y = `${y}px`;
                };

                window.addEventListener("blur", onPointerUp);
                document.addEventListener("pointermove", onPointerMove);
                document.addEventListener("pointerup", onPointerUp);
                document.addEventListener("pointercancel", onPointerUp);
            };

            const handleMinimize = () => {
                configStore.isMinus = true;
            };

            const handleTogglePause = () => {
                if (licenseLocked) {
                    logStore.addLog("许可验证未通过，无法解除锁定", "danger");
                    configStore.setPaused(true);
                    return;
                }
                const paused = configStore.togglePause();
                logStore.addLog(paused ? '脚本已暂停' : '脚本已继续', paused ? 'warning' : 'success');
            };

            return () => vue.h('div', { style: position.value, class: "main-page script-container" }, [
                configStore.isMinus
                    ? vue.h('div', {
                        class: ['mini-circle', { paused: isPaused.value }],
                        onPointerdown: startCircleDrag,
                        title: '单击展开 / 按住拖动'
                    })
                    : vue.h('div', { class: 'main-panel' }, [
                        vue.h(vue.resolveComponent('el-card'), { shadow: "always" }, {
                            header: () => vue.h('div', {
                                class: ["card-header"],
                                onMousedown: startDrag
                            }, [
                                vue.h('div', { class: "title" }, [
                                    vue.h('span', "🚀"),
                                    vue.h('span', configStore.platformParams.cx.name)
                                ]),
                                vue.h('div', { class: 'header-btns' }, [
                                    vue.h('div', {
                                        class: ['pause-btn', { playing: isPaused.value }],
                                        onClick: (e) => { e.stopPropagation(); handleTogglePause(); },
                                        title: isPaused.value ? '继续' : '暂停'
                                    }, [
                                        vue.h('div', { class: 'pause-icon' })
                                    ]),
                                    vue.h('div', {
                                        class: "minimize-btn",
                                        onClick: (e) => { e.stopPropagation(); handleMinimize(); },
                                        title: '最小化'
                                    })
                                ])
                            ]),
                            default: () => vue.h(IndexComponent)
                        })
                    ])
            ]);
        }
    };

    const App = {
        setup() {
            const configStore = useConfigStore();
            configStore.platformName = "cx";
            return () => vue.h(LayoutComponent);
        }
    };

    // ==================== 19. 初始化 ====================
    const initApp = () => {
        if (!isTopWindow) {
            console.log('[超星自行火炮] 在iframe中运行，跳过UI初始化');
            return;
        }

        const containerId = 'chaoxing-helper-root';
        if (document.getElementById(containerId)) {
            console.log('[超星自行火炮] 容器已存在，跳过初始化');
            return;
        }

        const app = vue.createApp(App);
        app.use(pinia.createPinia());
        app.use(ElementPlus);

        const container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
        
        const shadow = container.attachShadow({ mode: "closed" });
        const appDiv = document.createElement("div");
        shadow.appendChild(appDiv);

        const eleStyle = _GM_getResourceText("ElementPlusStyle");
        if (eleStyle) {
            const styleSheet = new CSSStyleSheet();
            styleSheet.replaceSync(eleStyle);
            shadow.adoptedStyleSheets = [styleSheet];
        }

        const customSheet = new CSSStyleSheet();
        customSheet.replaceSync(customStyles);
        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, customSheet];

        app.mount(appDiv);
        
        console.log('[超星自行火炮] UI初始化完成');
    };

    if (document.readyState === "complete") {
        initApp();
    } else {
        window.addEventListener('load', initApp, { once: true });
    }

})(Vue, Pinia, rxjs, md5, ElementPlus);
