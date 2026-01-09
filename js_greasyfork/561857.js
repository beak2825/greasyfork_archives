// ==UserScript==
// @name         X Likes 下载器
// @namespace    https://github.com/K4F7/x-like-downloader
// @version      2.1.20
// @description  下载 X (Twitter) 点赞列表中的图片、GIF和视频
// @author       You
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @connect      abs.twimg.com
// @connect      *
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561857/X%20Likes%20%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561857/X%20Likes%20%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_TEXT = `
        .xld-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }
        .xld-overlay.active {
            display: block;
        }
        .xld-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 360px;
            background: #15202b;
            border-radius: 16px;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #e7e9ea;
        }
        .xld-panel.active {
            display: block;
        }
        .xld-header {
            padding: 16px 20px;
            border-bottom: 1px solid #38444d;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .xld-title {
            font-size: 18px;
            font-weight: 700;
        }
        .xld-close {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: #e7e9ea;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .xld-close:hover {
            background: rgba(239, 243, 244, 0.1);
        }
        .xld-body {
            padding: 20px;
        }
        .xld-section {
            margin-bottom: 20px;
        }
        .xld-label {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #8b98a5;
        }
        .xld-date-input {
            flex: 1;
            padding: 10px 12px;
            background: #273340;
            border: 1px solid #38444d;
            border-radius: 8px;
            color: #e7e9ea;
            font-size: 14px;
        }
        .xld-date-input:focus {
            outline: none;
            border-color: #1d9bf0;
        }
        .xld-checkbox-group {
            display: flex;
            gap: 16px;
        }
        .xld-mode-toggle {
            display: flex;
            margin-top: 8px;
            background: #1f2d3a;
            border: 1px solid #38444d;
            border-radius: 999px;
            padding: 4px;
            gap: 4px;
        }
        .xld-mode-btn {
            flex: 1;
            border: none;
            border-radius: 999px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 700;
            color: #8b98a5;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        .xld-mode-btn.is-active {
            background: #1d9bf0;
            color: #fff;
        }
        .xld-checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
        }
        .xld-checkbox-label input {
            width: 18px;
            height: 18px;
            accent-color: #1d9bf0;
        }
        .xld-input-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            margin-top: 10px;
        }
        .xld-input-label {
            font-size: 12px;
            color: #8b98a5;
            min-width: 84px;
        }
        .xld-input-note {
            margin-top: 6px;
            font-size: 12px;
            color: #8b98a5;
        }
        .xld-btn {
            width: 100%;
            padding: 12px;
            border-radius: 9999px;
            border: none;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
        }
        .xld-btn-primary {
            background: #1d9bf0;
            color: #fff;
        }
        .xld-btn-primary:hover {
            background: #1a8cd8;
        }
        .xld-btn-primary:disabled {
            background: #1d9bf0;
            opacity: 0.5;
            cursor: not-allowed;
        }
        .xld-btn-secondary {
            background: transparent;
            color: #1d9bf0;
            border: 1px solid #536471;
            margin-top: 10px;
        }
        .xld-btn-secondary:hover {
            background: rgba(29, 155, 240, 0.1);
        }
        .xld-foreground-warning {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            width: min(420px, 92%);
            padding: 18px 16px 16px;
            border-radius: 16px;
            background: #f4212e;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            display: none;
            text-align: center;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .xld-foreground-warning.active {
            display: flex;
        }
        .xld-warning-icon {
            width: 72px;
            height: 64px;
            background: #fff;
            color: #f4212e;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            font-size: 28px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 18px rgba(0,0,0,0.3);
            flex-shrink: 0;
        }
        .xld-warning-icon span {
            position: relative;
            top: 6px;
        }
        .xld-warning-message {
            line-height: 1.35;
            font-size: 14px;
        }
        .xld-warning-message span {
            font-weight: 500;
        }
        .xld-warning-status {
            font-size: 13px;
            font-weight: 600;
            opacity: 0.95;
        }
        .xld-warning-progress {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.25);
            border-radius: 999px;
            overflow: hidden;
        }
        .xld-warning-progress-bar {
            height: 100%;
            width: 0%;
            background: #fff;
            transition: width 0.3s;
        }
        .xld-status {
            margin-top: 16px;
            padding: 12px;
            background: #273340;
            border-radius: 8px;
            font-size: 13px;
            text-align: center;
            display: none;
        }
        .xld-status.active {
            display: block;
        }
        .xld-progress {
            margin-top: 8px;
            height: 4px;
            background: #38444d;
            border-radius: 2px;
            overflow: hidden;
        }
        .xld-progress-bar {
            height: 100%;
            background: #1d9bf0;
            width: 0%;
            transition: width 0.3s;
        }
        .xld-marker-info {
            padding: 12px;
            background: #273340;
            border: 1px solid #38444d;
            border-radius: 8px;
            font-size: 13px;
            color: #e7e9ea;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .xld-marker-thumb {
            width: 48px;
            height: 48px;
            border-radius: 6px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .xld-marker-text {
            flex: 1;
            overflow: hidden;
        }
        .xld-marker-title {
            font-size: 13px;
            color: #e7e9ea;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
        }
        .xld-marker-id {
            font-size: 11px;
            color: #8b98a5;
        }
        .xld-marker-empty {
            color: #8b98a5;
        }
        .xld-marker-hint {
            margin-top: 8px;
            font-size: 12px;
            color: #8b98a5;
        }
        .xld-fallback-wrap {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px dashed #38444d;
        }
        .xld-fallback-label {
            font-size: 12px;
            color: #f6c343;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .xld-marker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .xld-marker-actions {
            display: flex;
            gap: 8px;
        }
        .xld-btn-small {
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 9999px;
            border: 1px solid #536471;
            background: transparent;
            color: #8b98a5;
            cursor: pointer;
            transition: all 0.2s;
        }
        .xld-btn-small:hover {
            background: rgba(239, 243, 244, 0.1);
            color: #e7e9ea;
        }
        .xld-btn-danger:hover {
            border-color: #f4212e;
            color: #f4212e;
        }
        .xld-btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 16px;
        }
        .xld-select-mode-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #1d9bf0;
            color: #fff;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .xld-select-mode-bar span {
            font-size: 14px;
            font-weight: 500;
        }
        .xld-select-mode-bar button {
            padding: 6px 16px;
            border-radius: 9999px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: #fff;
            font-size: 13px;
            cursor: pointer;
        }
        .xld-select-mode-bar button:hover {
            background: rgba(255,255,255,0.3);
        }
        .xld-tweet-selectable {
            cursor: pointer !important;
            transition: outline 0.2s;
        }
        .xld-tweet-selectable:hover {
            outline: 3px solid #1d9bf0;
            outline-offset: -3px;
        }
        .xld-init-notice {
            padding: 12px;
            background: rgba(29, 155, 240, 0.1);
            border: 1px solid rgba(29, 155, 240, 0.3);
            border-radius: 8px;
            font-size: 13px;
            color: #8b98a5;
            margin-bottom: 12px;
            line-height: 1.5;
        }
    `;

    const PANEL_HTML = `
        <div class="xld-header">
            <span class="xld-title">X Likes 下载器</span>
            <button class="xld-close">✕</button>
        </div>
        <div class="xld-body">
            <div class="xld-section xld-full-only" id="xld-resume-section">
                <div class="xld-marker-header">
                    <div class="xld-label" style="margin-bottom:0">续传点</div>
                    <div class="xld-marker-actions" id="xld-resume-actions">
                        <button class="xld-btn-small" id="xld-select-resume-btn">选择</button>
                        <button class="xld-btn-small" id="xld-clear-resume-btn">清除</button>
                    </div>
                </div>
                <div class="xld-marker-info" id="xld-resume-info">
                    <span class="xld-marker-empty">未设置续传点</span>
                </div>
                <div class="xld-fallback-wrap" id="xld-fallback-wrap" style="display:none">
                    <div class="xld-fallback-label">自动回退锚点</div>
                    <div class="xld-marker-info" id="xld-fallback-info"></div>
                </div>
            </div>
            <div class="xld-section xld-marker-only">
                <div class="xld-marker-header">
                    <div class="xld-label" style="margin-bottom:0">标记点</div>
                    <div class="xld-marker-actions" id="xld-marker-actions" style="display:none">
                        <button class="xld-btn-small" id="xld-select-marker-btn">选择</button>
                        <button class="xld-btn-small xld-btn-danger" id="xld-clear-marker-btn">清除</button>
                    </div>
                </div>
                <div class="xld-marker-info" id="xld-marker-info">
                    <span class="xld-marker-empty">未设置标记点</span>
                </div>
                <div class="xld-marker-hint">扫描到标记点会自动停止，只下载新内容</div>
            </div>
            <div class="xld-section">
                <div class="xld-label">下载模式</div>
                <div class="xld-mode-toggle" id="xld-mode-toggle">
                    <button type="button" class="xld-mode-btn" data-mode="marker" aria-pressed="true">标记点</button>
                    <button type="button" class="xld-mode-btn" data-mode="full" aria-pressed="false">全量下载</button>
                </div>
                <div class="xld-input-row xld-full-only">
                    <span class="xld-input-label">单次上限</span>
                    <input type="number" id="xld-download-limit" class="xld-date-input" min="1" step="1">
                </div>
                <div class="xld-input-note xld-full-only">建议 200 个媒体/次，可自行调整</div>
                <div class="xld-input-row xld-full-only">
                    <label class="xld-checkbox-label">
                        <input type="checkbox" id="xld-safe-mode">
                        安全模式（慢速定位）
                    </label>
                </div>
                <div class="xld-input-row">
                    <label class="xld-checkbox-label">
                        <input type="checkbox" id="xld-auto-pause">
                        后台自动暂停
                    </label>
                </div>
            </div>
            <div class="xld-section" id="xld-init-section" style="display:none">
                <div class="xld-init-notice">首次使用，请先设置标记点。这会记住当前位置，之后只下载新点赞的内容。</div>
                <button class="xld-btn xld-btn-primary" id="xld-init-btn">自动设置（第一条）</button>
                <button class="xld-btn xld-btn-secondary" id="xld-init-select-btn">手动选择推文</button>
            </div>
            <div class="xld-section">
                <div class="xld-label">下载类型</div>
                <div class="xld-checkbox-group">
                    <label class="xld-checkbox-label">
                        <input type="checkbox" id="xld-type-image" checked>
                        图片
                    </label>
                    <label class="xld-checkbox-label">
                        <input type="checkbox" id="xld-type-gif" checked>
                        GIF
                    </label>
                    <label class="xld-checkbox-label">
                        <input type="checkbox" id="xld-type-video">
                        视频
                    </label>
                </div>
            </div>
            <div class="xld-btn-group">
                <button class="xld-btn xld-btn-primary" id="xld-scan-btn">开始扫描</button>
                <button class="xld-btn xld-btn-primary" id="xld-download-btn" style="display:none">下载全部</button>
            </div>
            <div class="xld-status" id="xld-status">
                <span id="xld-status-text">准备就绪</span>
                <div class="xld-progress">
                    <div class="xld-progress-bar" id="xld-progress-bar"></div>
                </div>
            </div>
        </div>
    `.trim();

    const WARNING_HTML = `
        <div class="xld-warning-icon"><span>!</span></div>
        <div class="xld-warning-message"></div>
        <div class="xld-warning-status"></div>
        <div class="xld-warning-progress">
            <div class="xld-warning-progress-bar"></div>
        </div>
    `.trim();

    GM_addStyle(STYLE_TEXT);

    const RESUME_ANCHOR_COUNT = 10;
    const ANCHOR_SEARCH_COUNT = 30;
    let isScanning = false;
    let collectedMedia = [];
    let lastScanMode = 'marker';
    let lastScanStopReason = null;
    let pendingResumeSnapshot = null;
    let isDownloading = false;
    let foregroundWarningEl = null;
    let lastStatusText = '准备就绪';
    let lastProgressValue = null;

    const SETTING_DEFS = {
        downloadLimit: {
            id: 'xld-download-limit',
            key: 'downloadLimit',
            defaultValue: 200,
            type: 'number',
            validate: value => value > 0
        },
        safeMode: {
            id: 'xld-safe-mode',
            key: 'safeMode',
            defaultValue: false,
            type: 'boolean'
        },
        autoPause: {
            id: 'xld-auto-pause',
            key: 'autoPause',
            defaultValue: true,
            type: 'boolean'
        },
        preloadBuffer: {
            id: 'xld-preload-buffer',
            key: 'preloadBuffer',
            defaultValue: 50,
            type: 'number',
            validate: value => value >= 0
        }
    };

    function normalizeNumberSetting(def, value) {
        const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
        if (Number.isFinite(parsed) && (!def.validate || def.validate(parsed))) {
            return parsed;
        }
        return def.defaultValue;
    }

    function getSetting(def) {
        if (!def) return null;
        const input = def.id ? document.getElementById(def.id) : null;
        if (def.type === 'number') {
            const value = input ? parseInt(input.value, 10) : GM_getValue(def.key, def.defaultValue);
            return normalizeNumberSetting(def, value);
        }
        if (input) return !!input.checked;
        return GM_getValue(def.key, def.defaultValue);
    }

    function bindSetting(panel, def) {
        if (!def || !def.id || !panel) return;
        const input = panel.querySelector(`#${def.id}`);
        if (!input) return;
        if (def.type === 'number') {
            const savedValue = GM_getValue(def.key, def.defaultValue);
            const normalized = normalizeNumberSetting(def, savedValue);
            input.value = normalized;
            input.addEventListener('change', () => {
                const value = parseInt(input.value, 10);
                const nextValue = normalizeNumberSetting(def, value);
                input.value = nextValue;
                GM_setValue(def.key, nextValue);
            });
            return;
        }
        input.checked = !!GM_getValue(def.key, def.defaultValue);
        input.addEventListener('change', () => {
            GM_setValue(def.key, input.checked);
        });
    }

    function bindSettings(panel) {
        Object.values(SETTING_DEFS).forEach(def => bindSetting(panel, def));
    }

    function createPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'xld-overlay';
        overlay.addEventListener('click', closePanel);

        const panel = document.createElement('div');
        panel.className = 'xld-panel';
        panel.innerHTML = PANEL_HTML;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        [
            ['.xld-close', closePanel],
            ['#xld-scan-btn', startScan],
            ['#xld-download-btn', downloadAll],
            ['#xld-clear-marker-btn', clearMarker],
            ['#xld-init-btn', initMarker],
            ['#xld-init-select-btn', () => enterSelectMode('marker')],
            ['#xld-select-marker-btn', () => enterSelectMode('marker')],
            ['#xld-select-resume-btn', () => enterSelectMode('resume')],
            ['#xld-clear-resume-btn', clearResumePoint]
        ].forEach(([selector, handler]) => {
            const target = panel.querySelector(selector);
            if (target) target.addEventListener('click', handler);
        });

        const modeButtons = panel.querySelectorAll('.xld-mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode || 'marker';
                GM_setValue('downloadMode', mode);
                updateModeDisplay();
            });
        });

        const savedMode = GM_getValue('downloadMode', 'marker');
        updateModeToggle(savedMode);

        bindSettings(panel);

        updateModeDisplay();

        return { overlay, panel };
    }

    let panelElements = null;

    function openPanel() {
        if (!panelElements) {
            panelElements = createPanel();
        }
        panelElements.overlay.classList.add('active');
        panelElements.panel.classList.add('active');
    }

    document.addEventListener('visibilitychange', () => {
        updateForegroundWarning();
    });

    function closePanel() {
        if (panelElements) {
            panelElements.overlay.classList.remove('active');
            panelElements.panel.classList.remove('active');
        }
    }

    function ensureForegroundWarning() {
        if (foregroundWarningEl) return;
        foregroundWarningEl = document.createElement('div');
        foregroundWarningEl.className = 'xld-foreground-warning';
        document.body.appendChild(foregroundWarningEl);
    }

    function showForegroundWarning(message) {
        ensureForegroundWarning();
        if (!foregroundWarningEl.dataset.ready) {
            foregroundWarningEl.innerHTML = WARNING_HTML;
            foregroundWarningEl.dataset.ready = 'true';
        }

        const messageEl = foregroundWarningEl.querySelector('.xld-warning-message');
        if (messageEl) messageEl.innerHTML = message;

        const statusEl = foregroundWarningEl.querySelector('.xld-warning-status');
        if (statusEl) {
            const text = lastStatusText || '';
            statusEl.textContent = text;
            statusEl.style.display = text ? 'block' : 'none';
        }

        const progressWrap = foregroundWarningEl.querySelector('.xld-warning-progress');
        const progressBar = foregroundWarningEl.querySelector('.xld-warning-progress-bar');
        if (progressWrap && progressBar) {
            if (typeof lastProgressValue === 'number') {
                const normalized = Math.max(0, Math.min(lastProgressValue, 100));
                progressWrap.style.display = 'block';
                progressBar.style.width = `${normalized}%`;
            } else {
                progressWrap.style.display = 'none';
                progressBar.style.width = '0%';
            }
        }

        foregroundWarningEl.classList.add('active');
    }

    function hideForegroundWarning() {
        if (foregroundWarningEl) {
            foregroundWarningEl.classList.remove('active');
        }
    }

    function updateForegroundWarning() {
        if (!isScanning && !isDownloading) {
            hideForegroundWarning();
            return;
        }

        if (document.hidden) {
            showForegroundWarning('当前标签页在后台，已暂停。<span>请切回前台继续，建议单独拉出窗口。</span>');
            return;
        }

        showForegroundWarning('请保持当前标签页在前台以保证扫描和下载正常进行。<span>建议单独拉出窗口。</span>');
    }

    function getDownloadMode() {
        return GM_getValue('downloadMode', 'marker');
    }

    function buildMarkerInfoHtml(options) {
        const displayText = options.displayText || '(无文字内容)';
        const titleText = options.titleText || '';
        const shortId = options.id ? `${options.id.substring(0, 8)}...` : '';
        const thumbHtml = options.thumbnail
            ? `<img class="xld-marker-thumb" src="${options.thumbnail}" alt="缩略图">`
            : '';
        return `
            ${thumbHtml}
            <div class="xld-marker-text">
                <div class="xld-marker-title" title="${titleText}">${displayText}</div>
                <div class="xld-marker-id">ID: ${shortId}</div>
            </div>
        `.trim();
    }

    function updateResumeDisplay() {
        const resumeInfo = document.getElementById('xld-resume-info');
        const clearBtn = document.getElementById('xld-clear-resume-btn');
        if (!resumeInfo) return;

        const mode = getDownloadMode();
        if (mode !== 'full') {
            return;
        }

        const savedSnapshot = GM_getValue('fullResumeSnapshot', null);
        const savedResume = savedSnapshot?.resumePoint || GM_getValue('fullResumePoint', null);
        if (savedResume && savedResume.id) {
            resumeInfo.innerHTML = buildMarkerInfoHtml({
                id: savedResume.id,
                displayText: savedResume.text || '(无文字内容)',
                titleText: savedResume.text || '',
                thumbnail: savedResume.thumbnail || ''
            });
            if (clearBtn) clearBtn.disabled = false;
        } else {
            resumeInfo.innerHTML = `<span class="xld-marker-empty">未设置续传点</span>`;
            if (clearBtn) clearBtn.disabled = true;
        }
    }

    function clearFallbackAnchorDisplay() {
        const wrap = document.getElementById('xld-fallback-wrap');
        const info = document.getElementById('xld-fallback-info');
        if (info) info.innerHTML = '';
        if (wrap) wrap.style.display = 'none';
    }

    function updateFallbackAnchorDisplay(anchorInfo) {
        const wrap = document.getElementById('xld-fallback-wrap');
        const info = document.getElementById('xld-fallback-info');
        if (!wrap || !info) return;

        if (!anchorInfo || !anchorInfo.id) {
            clearFallbackAnchorDisplay();
            return;
        }

        const rawText = anchorInfo.text || anchorInfo.fullText || '(无文字内容)';
        const displayText = rawText.length > 50 ? `${rawText.substring(0, 50)}...` : rawText;
        info.innerHTML = buildMarkerInfoHtml({
            id: anchorInfo.id,
            displayText: displayText,
            titleText: rawText,
            thumbnail: anchorInfo.thumbnail || ''
        });
        wrap.style.display = 'block';
    }

    function updateModeDisplay() {
        const mode = GM_getValue('downloadMode', 'marker');
        updateModeToggle(mode);
        updateModeVisibility(mode);
        updateMarkerDisplay();
        updateResumeDisplay();
    }

    function updateModeToggle(mode) {
        const buttons = document.querySelectorAll('.xld-mode-btn');
        if (!buttons.length) return;
        buttons.forEach(button => {
            const active = button.dataset.mode === mode;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function updateModeVisibility(mode) {
        const isFull = mode === 'full';
        const elements = document.querySelectorAll('.xld-full-only');
        elements.forEach(element => {
            element.style.display = isFull ? '' : 'none';
        });
        const markerElements = document.querySelectorAll('.xld-marker-only');
        markerElements.forEach(element => {
            element.style.display = isFull ? 'none' : '';
        });
    }

    function updateMarkerDisplay() {
        const markerInfo = document.getElementById('xld-marker-info');
        const markerActions = document.getElementById('xld-marker-actions');
        const initSection = document.getElementById('xld-init-section');
        const scanBtn = document.getElementById('xld-scan-btn');
        const savedMarker = GM_getValue('markerTweetId', null);
        const mode = getDownloadMode();
        const isMarkerMode = mode === 'marker';

        if (savedMarker && savedMarker.id) {
            markerInfo.innerHTML = buildMarkerInfoHtml({
                id: savedMarker.id,
                displayText: savedMarker.text || '(无文字内容)',
                titleText: savedMarker.text || '',
                thumbnail: isMarkerMode && savedMarker.thumbnail ? savedMarker.thumbnail : ''
            });

            if (markerActions) markerActions.style.display = 'flex';
            if (initSection) initSection.style.display = 'none';
            if (scanBtn) scanBtn.style.display = 'block';
        } else {
            markerInfo.innerHTML = `<span class="xld-marker-empty">未设置标记点</span>`;
            if (markerActions) markerActions.style.display = 'none';
            if (initSection) initSection.style.display = isMarkerMode ? 'block' : 'none';
            if (scanBtn) scanBtn.style.display = isMarkerMode ? 'none' : 'block';
        }
    }

    function clearMarker() {
        if (confirm('确定要清除标记点吗？需要重新设置才能使用。')) {
            GM_setValue('markerTweetId', null);
            updateMarkerDisplay();
            updateStatus('标记点已清除');
        }
    }

    function clearResumePoint() {
        if (!confirm('确定要清除续传点吗？此操作会让全量下载从头开始。')) {
            return;
        }
        const confirmText = prompt('请输入“清除”以确认继续：');
        if (confirmText !== '清除') {
            updateStatus('已取消清除续传点');
            return;
        }
        if (!confirm('最后确认：是否清除续传点？')) {
            updateStatus('已取消清除续传点');
            return;
        }
        GM_setValue('fullResumePoint', null);
        GM_setValue('fullResumeSnapshot', null);
        updateResumeDisplay();
        clearFallbackAnchorDisplay();
        updateStatus('续传点已清除');
    }

    let isSelectMode = false;
    let selectModeBar = null;
    let selectModeTarget = 'marker';

    function ensureLikesPage(options) {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/likes')) return true;

        const username = getCurrentUsername();
        if (username) {
            if (options?.onNeedLikesPage) {
                options.onNeedLikesPage(username);
            } else {
                window.location.href = `https://x.com/${username}/likes`;
            }
        } else if (options?.onLoginRequired) {
            options.onLoginRequired();
        }
        return false;
    }

    function buildSelectModeBarHtml(targetLabel) {
        return `
            <span>点击任意推文将其设为${targetLabel}</span>
            <button id="xld-cancel-select">取消</button>
        `.trim();
    }

    function enterSelectMode(target = 'marker') {
        const targetLabel = target === 'resume' ? '续传点' : '标记点';
        if (!ensureLikesPage({
            onNeedLikesPage: (username) => {
                alert(`请先打开你的 Likes 页面，然后再选择${targetLabel}`);
                window.location.href = `https://x.com/${username}/likes`;
            },
            onLoginRequired: () => {
                alert('请先登录');
            }
        })) {
            return;
        }

        isSelectMode = true;
        selectModeTarget = target;
        closePanel();

        selectModeBar = document.createElement('div');
        selectModeBar.className = 'xld-select-mode-bar';
        selectModeBar.innerHTML = buildSelectModeBarHtml(targetLabel);
        document.body.appendChild(selectModeBar);

        selectModeBar.querySelector('#xld-cancel-select').addEventListener('click', exitSelectMode);

        toggleSelectableTweets(document, true);

        startTweetObserver();
    }

    function exitSelectMode() {
        isSelectMode = false;

        if (selectModeBar) {
            selectModeBar.remove();
            selectModeBar = null;
        }

        toggleSelectableTweets(document, false);

        stopTweetObserver();

        openPanel();
    }

    function handleTweetSelect(event) {
        if (!isSelectMode) return;

        event.preventDefault();
        event.stopPropagation();

        const tweet = event.currentTarget;
        const selectedData = extractTweetInfo(tweet);

        if (selectedData.id) {
            if (selectModeTarget === 'resume') {
                const snapshot = buildResumeSnapshot(tweet);
                GM_setValue('fullResumePoint', selectedData);
                GM_setValue('fullResumeSnapshot', snapshot);
                exitSelectMode();
                updateResumeDisplay();
                clearFallbackAnchorDisplay();
                updateStatus('续传点已设置');
            } else {
                GM_setValue('markerTweetId', selectedData);
                exitSelectMode();
                updateMarkerDisplay();
                updateStatus('标记点已设置');
            }
        } else {
            alert('无法获取该推文的ID，请选择其他推文');
        }
    }

    let tweetObserver = null;

    function toggleTweetSelectable(tweet, enabled) {
        if (!tweet) return;
        if (enabled) {
            if (tweet.classList.contains('xld-tweet-selectable')) return;
            tweet.classList.add('xld-tweet-selectable');
            tweet.addEventListener('click', handleTweetSelect, true);
        } else if (tweet.classList.contains('xld-tweet-selectable')) {
            tweet.classList.remove('xld-tweet-selectable');
            tweet.removeEventListener('click', handleTweetSelect, true);
        }
    }

    function toggleSelectableTweets(root, enabled) {
        if (!root) return;
        const tweets = root.querySelectorAll ? root.querySelectorAll('[data-testid="tweet"]') : [];
        tweets.forEach(tweet => toggleTweetSelectable(tweet, enabled));
        if (root.matches && root.matches('[data-testid="tweet"]')) {
            toggleTweetSelectable(root, enabled);
        }
    }

    function startTweetObserver() {
        tweetObserver = new MutationObserver((mutations) => {
            if (!isSelectMode) return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        toggleSelectableTweets(node, true);
                    }
                });
            });
        });

        tweetObserver.observe(document.body, { childList: true, subtree: true });
    }

    function stopTweetObserver() {
        if (tweetObserver) {
            tweetObserver.disconnect();
            tweetObserver = null;
        }
    }

    async function initMarker() {
        const initBtn = document.getElementById('xld-init-btn');
        initBtn.disabled = true;
        initBtn.textContent = '正在初始化...';

        if (!ensureLikesPage({
            onNeedLikesPage: (username) => {
                updateStatus('请先打开你的 Likes 页面');
                initBtn.disabled = false;
                initBtn.textContent = '初始化标记点';
                window.location.href = `https://x.com/${username}/likes`;
            },
            onLoginRequired: () => {
                updateStatus('请先登录');
                initBtn.disabled = false;
                initBtn.textContent = '初始化标记点';
            }
        })) {
            return;
        }

        await sleep(1000);

        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        if (tweets.length > 0) {
            const firstTweet = tweets[0];
            const markerData = extractTweetInfo(firstTweet);

            if (markerData.id) {
                GM_setValue('markerTweetId', markerData);
                updateMarkerDisplay();
                updateStatus('初始化成功！标记点已设置，现在可以开始扫描');
            } else {
                updateStatus('无法获取推文ID，请刷新页面重试');
            }
        } else {
            updateStatus('未找到推文，请确保页面已加载完成');
        }

        initBtn.disabled = false;
        initBtn.textContent = '初始化标记点';
    }

    function collectTweetMeta(tweet) {
        const id = extractTweetId(tweet);

        let authorName = '';
        const userNameEl = tweet.querySelector('[data-testid="User-Name"]');
        if (userNameEl) {
            const nameSpan = userNameEl.querySelector('a span');
            if (nameSpan) {
                authorName = nameSpan.textContent.trim();
            }
        }

        let fullText = '';
        const tweetTextEl = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetTextEl) {
            fullText = tweetTextEl.textContent.trim();
        }

        let thumbnail = '';
        let mediaId = '';
        const img = tweet.querySelector('[data-testid="tweetPhoto"] img');
        if (img && img.src) {
            thumbnail = img.src.replace(/&name=\w+/, '&name=small');
            const mediaMatch = img.src.match(/\/media\/([A-Za-z0-9_-]+)/);
            if (mediaMatch) {
                mediaId = mediaMatch[1];
            }
        }

        let authorUsername = '';
        const authorLink = tweet.querySelector('a[href^="/"][role="link"]');
        if (authorLink) {
            const usernameMatch = authorLink.href.match(/x\.com\/([^\/]+)/);
            if (usernameMatch) {
                authorUsername = usernameMatch[1];
            }
        }

        return { id, fullText, thumbnail, mediaId, authorName, authorUsername };
    }

    function extractTweetInfo(tweet) {
        const meta = collectTweetMeta(tweet);
        let fullText = meta.fullText || '';
        let text = fullText;

        if (text.length > 50) {
            text = text.substring(0, 50) + '...';
        }

        if (!text && meta.authorName) {
            text = `@${meta.authorName} 的推文`;
            fullText = text;
        }

        return {
            id: meta.id,
            text,
            fullText,
            thumbnail: meta.thumbnail,
            mediaId: meta.mediaId,
            authorName: meta.authorName
        };
    }

    function updateStatus(text, progress = null) {
        const statusDiv = document.getElementById('xld-status');
        const statusText = document.getElementById('xld-status-text');
        const progressBar = document.getElementById('xld-progress-bar');

        statusDiv.classList.add('active');
        statusText.textContent = text;
        lastStatusText = text;

        if (progress !== null) {
            progressBar.style.width = `${progress}%`;
            lastProgressValue = progress;
        }

        if (isScanning || isDownloading) {
            updateForegroundWarning();
        }
    }

    function getSelectedTypes() {
        return {
            image: document.getElementById('xld-type-image').checked,
            gif: document.getElementById('xld-type-gif').checked,
            video: document.getElementById('xld-type-video').checked
        };
    }

    let firstTweetInfo = null;

    async function startScan() {
        if (isScanning) return;

        if (!ensureLikesPage({
            onNeedLikesPage: (username) => {
                updateStatus('正在跳转到 Likes 页面...');
                window.location.href = `https://x.com/${username}/likes`;
            },
            onLoginRequired: () => {
                updateStatus('请先登录或手动打开 Likes 页面');
            }
        })) {
            return;
        }

        const mode = getDownloadMode();
        const types = getSelectedTypes();
        const limit = mode === 'full' ? getSetting(SETTING_DEFS.downloadLimit) : Infinity;
        const scanOptions = {
            mode,
            limit,
            safetyMode: getSetting(SETTING_DEFS.safeMode),
            autoPause: getSetting(SETTING_DEFS.autoPause),
            preloadBuffer: getSetting(SETTING_DEFS.preloadBuffer)
        };
        let statusText = '开始扫描...';

        if (mode === 'marker') {
            const savedMarker = GM_getValue('markerTweetId', null);
            if (!savedMarker || !savedMarker.id) {
                updateStatus('请先设置标记点');
                return;
            }
            scanOptions.savedMarker = savedMarker;
            statusText = '开始扫描（到标记点停止）...';
        } else {
            const resumeSnapshot = GM_getValue('fullResumeSnapshot', null);
            const resumePoint = resumeSnapshot?.resumePoint || GM_getValue('fullResumePoint', null);
            scanOptions.resumePoint = resumePoint;
            scanOptions.anchors = resumeSnapshot?.anchors || null;
            statusText = resumePoint ? '开始扫描（从上次进度继续）...' : '开始扫描（全量下载）...';
        }

        isScanning = true;
        lastScanMode = mode;
        lastScanStopReason = null;
        pendingResumeSnapshot = null;
        clearFallbackAnchorDisplay();
        collectedMedia = [];
        firstTweetInfo = null;

        const scanBtn = document.getElementById('xld-scan-btn');
        const downloadBtn = document.getElementById('xld-download-btn');

        scanBtn.disabled = true;
        scanBtn.textContent = '扫描中...';
        downloadBtn.style.display = 'none';

        updateStatus(statusText, 0);
        updateForegroundWarning();

        try {
            const scanResult = await scanLikes(types, scanOptions);
            lastScanStopReason = scanResult.stopReason;
            pendingResumeSnapshot = scanResult.resumeSnapshot || null;

            let completionMsg = '';
            if (scanResult.stopReason === 'marker') {
                completionMsg = `扫描完成！找到 ${collectedMedia.length} 个新文件（已到达标记点）`;
            } else if (scanResult.stopReason === 'limit' && mode === 'full') {
                completionMsg = `扫描完成！已达到单次上限（${limit} 个媒体）`;
            } else if (scanResult.stopReason === 'resume-missing') {
                completionMsg = '未找到续传点，请清除续传点后重试';
                if (mode === 'full') {
                    GM_setValue('fullResumePoint', null);
                    GM_setValue('fullResumeSnapshot', null);
                    updateResumeDisplay();
                }
            } else {
                completionMsg = `扫描完成！找到 ${collectedMedia.length} 个文件`;
            }

            if (scanResult.fallbackUsed) {
                completionMsg += '（续传点未找到，已使用锚点继续下载，可能有少量重复）';
            }

            updateStatus(completionMsg, 100);

            if (collectedMedia.length > 0) {
                downloadBtn.style.display = 'block';
                downloadBtn.textContent = `下载全部 (${collectedMedia.length} 个文件)`;
            } else {
                const emptyMsg = mode === 'full'
                    ? '没有找到可下载的媒体文件'
                    : '没有找到新的媒体文件';
                updateStatus(emptyMsg, 100);
            }
        } catch (error) {
            updateStatus(`扫描出错: ${error.message}`, 0);
            console.error('扫描错误:', error);
        }

        isScanning = false;
        scanBtn.disabled = false;
        scanBtn.textContent = '重新扫描';
        updateForegroundWarning();
    }

    function getCurrentUsername() {
        const accountSwitcher = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
        if (accountSwitcher) {
            const spans = accountSwitcher.querySelectorAll('span');
            for (const span of spans) {
                if (span.textContent.startsWith('@')) {
                    return span.textContent.slice(1);
                }
            }
        }
        return null;
    }

    async function scanLikes(types, options) {
        const seenUrls = new Set();
        const seenTweetIds = new Set();
        const seekSeenTweetIds = new Set();
        let noNewContentCount = 0;
        let reachedMarker = false;
        let reachedLimit = false;
        let totalScanned = 0;
        let lastSeenCount = 0;
        const mode = options?.mode || 'marker';
        const savedMarker = options?.savedMarker || null;
        const resumePoint = options?.resumePoint || null;
        const anchors = options?.anchors || null;
        const limit = Number.isFinite(options?.limit) && options.limit > 0 ? options.limit : Infinity;
        const safetyMode = !!options?.safetyMode;
        const autoPause = !!options?.autoPause;
        const preloadBuffer = Number.isFinite(options?.preloadBuffer) && options.preloadBuffer >= 0 ? options.preloadBuffer : 50;
        const anchorSearchCount = Number.isFinite(options?.anchorSearchCount) && options.anchorSearchCount > 0
            ? options.anchorSearchCount
            : ANCHOR_SEARCH_COUNT;
        let resumeFound = !resumePoint;
        let resumeSkipId = null;
        let fallbackUsed = false;
        let seekStatusShown = false;
        let limitResumeSnapshot = null;
        let seekMode = resumePoint ? (safetyMode ? 'lock' : 'fast') : 'none';
        let lockNoticeShown = false;
        let anchorSearchAttempted = false;
        let anchorSearchQueued = null;
        let anchorMissingAttempts = 0;
        let slowSeekNoticeShown = false;
        const anchorMissingMaxAttempts = 2;

        function applyAnchorSearchResult(anchorResult, allowRetryOnNoResult) {
            if (anchorResult?.anchorMissing) {
                anchorMissingAttempts++;
                seekMode = 'lock';
                if (!slowSeekNoticeShown) {
                    updateStatus('未找到锚点，改为慢扫定位续传点...', null);
                    slowSeekNoticeShown = true;
                }
                if (anchorMissingAttempts <= anchorMissingMaxAttempts) {
                    noNewContentCount = 0;
                    lastSeenCount = seenTweetIds.size;
                }
            }
            if (anchorResult?.found || anchorResult?.fallback) {
                resumeFound = true;
                fallbackUsed = fallbackUsed || !!anchorResult.fallback;
                if (anchorResult.fallback) {
                    if (anchorResult.anchorInfo) {
                        updateFallbackAnchorDisplay(anchorResult.anchorInfo);
                    }
                    updateStatus('续传点未出现，已自动回退到锚点（见上方缩略图），建议点击“选择”手动指定续传点', null);
                } else {
                    updateStatus('已在锚点附近找到续传点，开始下载...', null);
                }
                if (anchorResult.found && resumePoint?.id) {
                    resumeSkipId = resumePoint.id;
                }
                noNewContentCount = 0;
                lastSeenCount = seenTweetIds.size;
                return true;
            }
            if (!anchorResult?.anchorMissing && allowRetryOnNoResult) {
                anchorSearchAttempted = false;
            }
            return false;
        }

        const preloadTarget = mode === 'full' && !resumePoint && Number.isFinite(limit) && limit > 0
            ? limit + preloadBuffer
            : mode === 'marker'
                ? preloadBuffer
                : 0;
        if (preloadTarget > 0) {
            await preloadWindowBeforeScan(preloadTarget, autoPause);
        }

        while (noNewContentCount < 8 && !reachedMarker && !reachedLimit) {
            await waitForForegroundIfNeeded(autoPause);

            const tweets = document.querySelectorAll('[data-testid="tweet"]');

            for (const tweet of tweets) {
                await waitForForegroundIfNeeded(autoPause);
                const tweetId = extractTweetId(tweet);
                const anchorMatch = anchors ? matchAnchorTweet(tweet, anchors) : null;

                if (mode === 'marker' && savedMarker) {
                    const isMarker = isMarkerTweet(tweet, savedMarker);
                    if (isMarker) {
                        console.log('[XLD] ✓✓✓ 找到标记点！停止扫描 ✓✓✓');
                        reachedMarker = true;
                        break;
                    }
                }

                const seekingNow = mode === 'full' && resumePoint && !resumeFound;
                const seenSet = seekingNow ? seekSeenTweetIds : seenTweetIds;

                if (tweetId) {
                    if (seenSet.has(tweetId)) continue;
                    seenSet.add(tweetId);
                    totalScanned++;
                } else if (seekingNow) {
                    totalScanned++;
                } else {
                    continue;
                }

                if (mode === 'full' && !resumeFound) {
                    if (!seekStatusShown) {
                        updateStatus('正在定位续传点...', null);
                        seekStatusShown = true;
                    }
                    if (seekMode === 'fast' && anchorMatch?.side) {
                        seekMode = 'lock';
                        if (!lockNoticeShown) {
                            updateStatus('已定位到快照区间，正在精确定位续传点...', null);
                            lockNoticeShown = true;
                        }
                    }
                    if (anchorMatch?.side === 'after' && anchors && !anchorSearchAttempted) {
                        anchorSearchAttempted = true;
                        anchorSearchQueued = anchorMatch;
                        break;
                    }
                    if (isResumeTweet(tweet, resumePoint)) {
                        resumeFound = true;
                        updateStatus('已定位续传点，开始下载...', null);
                        continue;
                    }
                    if (totalScanned % 30 === 0) {
                        updateStatus(`正在定位续传点... 已扫描 ${totalScanned} 条`, null);
                    }
                    continue;
                }

                if (!firstTweetInfo) {
                    firstTweetInfo = extractTweetInfo(tweet);
                }

                if (resumeSkipId && resumePoint) {
                    if (isResumeTweet(tweet, resumePoint)) {
                        resumeSkipId = null;
                    }
                    continue;
                }

                const mediaItems = await extractMediaWithApiFallback(tweet, types);
                for (const item of mediaItems) {
                    if (!seenUrls.has(item.url)) {
                        seenUrls.add(item.url);
                        collectedMedia.push(item);
                    }
                }

                if (collectedMedia.length >= limit) {
                    reachedLimit = true;
                    if (mode === 'full') {
                        limitResumeSnapshot = buildResumeSnapshot(tweet);
                    }
                    break;
                }

                updateStatus(`已扫描 ${totalScanned} 条推文，找到 ${collectedMedia.length} 个文件...`, null);
            }

            if (anchorSearchQueued && mode === 'full' && resumePoint && !resumeFound && anchors) {
                const anchorResult = await searchResumeAroundAnchors(
                    resumePoint,
                    anchors,
                    autoPause,
                    anchorSearchCount,
                    anchorSearchQueued.side
                );
                anchorSearchQueued = null;
                if (applyAnchorSearchResult(anchorResult, true)) {
                    continue;
                }
            }

            if (reachedMarker || reachedLimit) break;

            const seeking = mode === 'full' && resumePoint && !resumeFound;
            const fastSeeking = seeking && seekMode === 'fast' && !safetyMode;
            const slowSeeking = seeking && !fastSeeking;
            const scrollStep = fastSeeking
                ? window.innerHeight * 2.2
                : slowSeeking
                    ? window.innerHeight * 0.6
                    : window.innerHeight * 0.8;
            const delayMs = fastSeeking ? 200 : slowSeeking ? 900 : 800;
            await waitForForegroundIfNeeded(autoPause);
            window.scrollBy(0, scrollStep);
            await sleep(delayMs);

            const currentSeenCount = (mode === 'full' && resumePoint && !resumeFound)
                ? seekSeenTweetIds.size
                : seenTweetIds.size;
            if (currentSeenCount === lastSeenCount) {
                noNewContentCount++;
            } else {
                noNewContentCount = 0;
            }
            lastSeenCount = currentSeenCount;

            if (mode === 'full' && resumePoint && !resumeFound && anchors && !anchorSearchAttempted && noNewContentCount >= 8) {
                anchorSearchAttempted = true;
                const anchorResult = await searchResumeAroundAnchors(resumePoint, anchors, autoPause, anchorSearchCount, null);
                applyAnchorSearchResult(anchorResult, false);
            }
        }

        if (mode === 'full' && resumePoint && !resumeFound) {
            return { stopReason: 'resume-missing', resumePoint: null, resumeSnapshot: null, fallbackUsed };
        }
        if (reachedMarker) return { stopReason: 'marker', resumePoint: null, fallbackUsed };
        if (reachedLimit) return { stopReason: 'limit', resumePoint: null, resumeSnapshot: limitResumeSnapshot, fallbackUsed };
        return { stopReason: 'end', resumePoint: null, resumeSnapshot: null, fallbackUsed };
    }

    async function preloadWindowBeforeScan(targetCount, autoPause) {
        if (!Number.isFinite(targetCount) || targetCount <= 0) return;

        const startTweet = document.querySelector('[data-testid="tweet"]');
        const startPoint = startTweet ? extractTweetInfo(startTweet) : null;
        const seen = new Set();
        let lastSeenCount = 0;
        let noNewCount = 0;

        updateStatus(`预加载窗口中... 0/${targetCount} 条`, null);

        while (seen.size < targetCount && noNewCount < 6) {
            await waitForForegroundIfNeeded(autoPause);
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            for (const tweet of tweets) {
                const id = extractTweetId(tweet);
                if (id) seen.add(id);
            }

            const currentCount = seen.size;
            if (currentCount === lastSeenCount) {
                noNewCount++;
            } else {
                noNewCount = 0;
            }
            lastSeenCount = currentCount;

            updateStatus(`预加载窗口中... ${Math.min(currentCount, targetCount)}/${targetCount} 条`, null);
            await waitForForegroundIfNeeded(autoPause);
            window.scrollBy(0, window.innerHeight * 2.6);
            await sleep(220);
        }

        updateStatus('预加载完成，正在回到起始位置...', null);
        let returned = false;
        if (startPoint && startPoint.id) {
            returned = await scrollToSavedPoint(startPoint, autoPause);
        }
        if (!returned) {
            window.scrollTo(0, 0);
            await sleep(600);
        }
    }

    async function scrollToSavedPoint(savedPoint, autoPause) {
        if (!savedPoint || !savedPoint.id) return false;
        const maxAttempts = 24;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await waitForForegroundIfNeeded(autoPause);
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            for (const tweet of tweets) {
                if (isMatchTweet(tweet, savedPoint)) {
                    tweet.scrollIntoView({ block: 'center' });
                    await sleep(400);
                    return true;
                }
            }
            await waitForForegroundIfNeeded(autoPause);
            window.scrollBy(0, -window.innerHeight * 2.4);
            await sleep(260);
        }
        return false;
    }

    async function searchResumeAroundAnchors(resumePoint, anchors, autoPause, anchorSearchCount, preferredSide) {
        if (!resumePoint || !anchors) return { found: false, fallback: false };

        updateStatus('续传点未出现，正在定位锚点并二次搜索...', null);
        const anchorLocated = await scrollToAnyAnchor(anchors, autoPause, preferredSide);
        if (!anchorLocated) return { found: false, fallback: false, anchorMissing: true };

        updateStatus('已定位锚点，正在上下搜索续传点...', null);
        const found = await scanResumeAroundAnchor(resumePoint, autoPause, anchorSearchCount, anchorLocated.side);
        const anchorInfo = anchorLocated.tweet ? extractTweetInfo(anchorLocated.tweet) : null;
        if (found) return { found: true, fallback: false, anchorInfo };
        return { found: false, fallback: true, anchorInfo };
    }

    async function scrollToAnyAnchor(anchors, autoPause, preferredSide) {
        const maxAttempts = 26;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await waitForForegroundIfNeeded(autoPause);
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            for (const tweet of tweets) {
                const anchorMatch = matchAnchorTweet(tweet, anchors);
                if (anchorMatch) {
                    tweet.scrollIntoView({ block: 'center' });
                    await sleep(400);
                    return { tweet, side: anchorMatch.side, anchor: anchorMatch.anchor };
                }
            }
            await waitForForegroundIfNeeded(autoPause);
            window.scrollBy(0, -window.innerHeight * 2.6);
            await sleep(260);
        }
        return false;
    }

    async function scanResumeAroundAnchor(resumePoint, autoPause, anchorSearchCount, anchorSide) {
        const perDirection = Number.isFinite(anchorSearchCount) && anchorSearchCount > 0
            ? anchorSearchCount
            : ANCHOR_SEARCH_COUNT;
        const seen = new Set();

        const scanVisible = () => {
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            for (const tweet of tweets) {
                const id = extractTweetId(tweet);
                if (!id || seen.has(id)) continue;
                seen.add(id);
                if (isResumeTweet(tweet, resumePoint)) {
                    return tweet;
                }
            }
            return null;
        };

        let foundTweet = scanVisible();
        if (foundTweet) {
            foundTweet.scrollIntoView({ block: 'center' });
            await sleep(400);
            return true;
        }

        const scanDirection = async (direction) => {
            let counted = 0;
            let lastSeen = seen.size;
            let noNewCount = 0;

            while (counted < perDirection && noNewCount < 4) {
                await waitForForegroundIfNeeded(autoPause);
                window.scrollBy(0, direction * window.innerHeight * 1.1);
                await sleep(320);

                foundTweet = scanVisible();
                if (foundTweet) return foundTweet;

                const currentCount = seen.size;
                const delta = currentCount - lastSeen;
                if (delta > 0) {
                    counted += delta;
                    lastSeen = currentCount;
                    noNewCount = 0;
                } else {
                    noNewCount++;
                }
            }
            return null;
        };

        const directionOrder = anchorSide === 'before' ? [1, -1] : [-1, 1];
        for (const direction of directionOrder) {
            foundTweet = await scanDirection(direction);
            if (foundTweet) {
                foundTweet.scrollIntoView({ block: 'center' });
                await sleep(400);
                return true;
            }
        }
        return false;
    }

    function extractMediaFromTweet(tweet, types) {
        const media = [];
        const tweetId = extractTweetId(tweet);

        if (types.image || types.gif) {
            const images = tweet.querySelectorAll('[data-testid="tweetPhoto"] img');
            images.forEach((img, index) => {
                let url = img.src;

                if (url.includes('pbs.twimg.com/media/')) {
                    url = url.replace(/\?format=\w+/, '?format=jpg')
                             .replace(/&name=\w+/, '&name=orig');
                    if (!url.includes('?format=')) {
                        url = url.split('?')[0] + '?format=jpg&name=orig';
                    }
                }

                const isGif = img.closest('[data-testid="tweetPhoto"]')?.querySelector('video') != null ||
                              url.includes('tweet_video_thumb');

                if (isGif && types.gif) {
                    media.push({
                        type: 'gif',
                        url: url,
                        filename: `${tweetId}_gif_${index}.jpg`,
                        tweetId
                    });
                } else if (!isGif && types.image) {
                    media.push({
                        type: 'image',
                        url: url,
                        filename: `${tweetId}_img_${index}.jpg`,
                        tweetId
                    });
                }
            });
        }

        if (types.video) {
            const videos = tweet.querySelectorAll('video');
            videos.forEach((video, index) => {
                let url = video.src;
                if (url && url.includes('video.twimg.com')) {
                    media.push({
                        type: 'video',
                        url: url,
                        filename: `${tweetId}_video_${index}.mp4`,
                        tweetId
                    });
                }
            });
        }

        return media;
    }

    async function extractMediaWithApiFallback(tweet, types) {
        const domMedia = extractMediaFromTweet(tweet, types);
        const tweetId = extractTweetId(tweet);
        if (!tweetId) return domMedia;

        const shouldFetchApi = types.video || domMedia.length === 0;
        if (!shouldFetchApi) return domMedia;

        try {
            const tweetData = await fetchTweetByApi(tweetId);
            if (!tweetData) return domMedia;

            const apiResult = extractMediaFromApi(tweetData);
            const apiMedia = Array.isArray(apiResult?.media) ? apiResult.media : [];
            const filteredApi = apiMedia
                .filter(item => {
                    if (item.type === 'image') return types.image;
                    if (item.type === 'gif') return types.gif;
                    if (item.type === 'video') return types.video;
                    return false;
                })
                .map((item, index) => ({
                    type: item.type,
                    url: item.url,
                    filename: item.filename || `${tweetId}_${item.type}_${index}`,
                    tweetId
                }));

            if (types.video) {
                const apiVideos = filteredApi.filter(item => item.type === 'video');
                if (apiVideos.length > 0) {
                    const nonVideoDom = domMedia.filter(item => item.type !== 'video');
                    return [...nonVideoDom, ...apiVideos];
                }
            }

            if (domMedia.length > 0) return domMedia;
            return filteredApi;
        } catch (error) {
            console.warn('[XLD] API媒体提取失败:', tweetId, error);
            return domMedia;
        }
    }

    function extractTweetId(tweet) {
        const timeLink = tweet.querySelector('time')?.closest('a[href*="/status/"]');
        if (timeLink) {
            const match = timeLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        const links = tweet.querySelectorAll('a[href*="/status/"]');
        for (const link of links) {
            const isQuoteTweet = link.closest('[data-testid="tweet"]') !== tweet;
            if (!isQuoteTweet) {
                const match = link.href.match(/\/status\/(\d+)/);
                if (match) return match[1];
            }
        }

        const anyLink = tweet.querySelector('a[href*="/status/"]');
        if (anyLink) {
            const match = anyLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        return null;
    }

    function extractFullTweetInfo(tweet) {
        const meta = collectTweetMeta(tweet);
        return {
            id: meta.id,
            fullText: meta.fullText,
            mediaId: meta.mediaId,
            authorUsername: meta.authorUsername
        };
    }

    function buildResumeSnapshot(targetTweet) {
        const resumePoint = extractTweetInfo(targetTweet);
        const snapshot = {
            resumePoint: resumePoint || null,
            anchors: { before: [], after: [] },
            timestamp: Date.now()
        };

        if (!resumePoint || !resumePoint.id) return snapshot;

        const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
        if (tweets.length === 0) return snapshot;

        const targetIndex = tweets.findIndex(item => extractTweetId(item) === resumePoint.id);
        if (targetIndex === -1) return snapshot;

        const beforeTweets = tweets.slice(Math.max(0, targetIndex - RESUME_ANCHOR_COUNT), targetIndex);
        const afterTweets = tweets.slice(targetIndex + 1, targetIndex + 1 + RESUME_ANCHOR_COUNT);

        snapshot.anchors.before = beforeTweets
            .map(extractFullTweetInfo)
            .filter(info => info && info.id);
        snapshot.anchors.after = afterTweets
            .map(extractFullTweetInfo)
            .filter(info => info && info.id);

        return snapshot;
    }

    function matchAnchorTweet(tweet, anchors) {
        if (!anchors) return null;
        const before = Array.isArray(anchors.before) ? anchors.before : [];
        const after = Array.isArray(anchors.after) ? anchors.after : [];

        for (const anchor of before) {
            if (isMatchTweet(tweet, anchor)) return { side: 'before', anchor };
        }
        for (const anchor of after) {
            if (isMatchTweet(tweet, anchor)) return { side: 'after', anchor };
        }
        return null;
    }

    function isMatchTweet(tweet, savedPoint) {
        if (!savedPoint) return false;

        const currentInfo = extractFullTweetInfo(tweet);
        let matchScore = 0;

        if (currentInfo.id && savedPoint.id && currentInfo.id === savedPoint.id) {
            matchScore += 3;
        }

        if (currentInfo.mediaId && savedPoint.mediaId && currentInfo.mediaId === savedPoint.mediaId) {
            matchScore += 2;
        }

        if (currentInfo.fullText && savedPoint.fullText) {
            if (currentInfo.fullText === savedPoint.fullText ||
                currentInfo.fullText.startsWith(savedPoint.fullText) ||
                savedPoint.fullText.startsWith(currentInfo.fullText)) {
                matchScore += 1;
            }
        }

        const isMatch = matchScore >= 2;

        return isMatch;
    }

    function isMarkerTweet(tweet, savedMarker) {
        return isMatchTweet(tweet, savedMarker);
    }

    function isResumeTweet(tweet, resumePoint) {
        return isMatchTweet(tweet, resumePoint);
    }

    async function downloadAll() {
        if (collectedMedia.length === 0) {
            updateStatus('没有可下载的文件');
            return;
        }

        const downloadBtn = document.getElementById('xld-download-btn');
        const autoPause = getAutoPause();
        downloadBtn.disabled = true;
        isDownloading = true;
        updateForegroundWarning();

        const dateStr = new Date().toISOString().split('T')[0];
        const zipFileName = `[Xlike]${dateStr}.zip`;

        let completed = 0;
        let failed = 0;

        if (typeof fflate === 'undefined') {
            updateStatus('fflate 未加载，请刷新页面重试');
            downloadBtn.disabled = false;
            isDownloading = false;
            updateForegroundWarning();
            return;
        }

        const files = {};

        updateStatus(`正在下载文件...`, 0);

        for (const item of collectedMedia) {
            await waitForForegroundIfNeeded(autoPause);
            try {
                updateStatus(`下载中 (${completed + 1}/${collectedMedia.length}): ${item.filename}`, (completed / collectedMedia.length) * 70);

                const blob = await fetchMedia(item.url);
                if (blob && blob.size > 0) {
                    const arrayBuffer = await blob.arrayBuffer();
                    files[item.filename] = new Uint8Array(arrayBuffer);
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`下载失败: ${item.url}`, error);
                failed++;
            }

            completed++;
        }

        if (Object.keys(files).length === 0) {
            updateStatus('所有文件下载失败，请检查网络');
            downloadBtn.disabled = false;
            isDownloading = false;
            updateForegroundWarning();
            return;
        }

        updateStatus(`正在打包 ${Object.keys(files).length} 个文件...`, 75);

        try {
            const zipped = fflate.zipSync(files, { level: 0 });

            const blob = new Blob([zipped], { type: 'application/zip' });

            updateStatus('正在保存 ZIP 文件...', 90);

            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = zipFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            if (lastScanMode === 'marker' && lastScanStopReason === 'marker' && firstTweetInfo && firstTweetInfo.id) {
                GM_setValue('markerTweetId', firstTweetInfo);
                updateMarkerDisplay();
            }

            if (lastScanMode === 'full') {
                if (lastScanStopReason === 'limit' && pendingResumeSnapshot && pendingResumeSnapshot.resumePoint?.id) {
                    GM_setValue('fullResumeSnapshot', pendingResumeSnapshot);
                    GM_setValue('fullResumePoint', pendingResumeSnapshot.resumePoint);
                } else if (lastScanStopReason === 'end') {
                    GM_setValue('fullResumeSnapshot', null);
                    GM_setValue('fullResumePoint', null);
                }
                updateResumeDisplay();
            }

            const failMsg = failed > 0 ? ` (${failed} 个失败)` : '';
            updateStatus(`下载完成！已保存为 ${zipFileName}${failMsg}`, 100);

        } catch (error) {
            updateStatus(`打包失败: ${error.message}`, 0);
            console.error('ZIP生成错误:', error);
        }

        isDownloading = false;
        downloadBtn.disabled = false;
        updateForegroundWarning();
    }

    function fetchMedia(url) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('下载超时'));
            }, 30000);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 30000,
                onload: function(response) {
                    clearTimeout(timeout);
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    reject(error);
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForForegroundIfNeeded(autoPause) {
        if (!autoPause) return;
        while (document.hidden) {
            updateStatus('标签页在后台，已暂停。请切回前台继续。', null);
            await sleep(1000);
        }
    }

    function getCookies() {
        const cookies = {};
        document.cookie.split(';').filter(n => n.indexOf('=') > 0).forEach(n => {
            n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
                cookies[name.trim()] = value.trim();
            });
        });
        return cookies;
    }

    async function fetchTweetByApi(tweetId) {
        const baseUrl = 'https://x.com/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId';
        const variables = {
            'tweetId': tweetId,
            'with_rux_injections': false,
            'includePromotedContent': true,
            'withCommunity': true,
            'withQuickPromoteEligibilityTweetFields': true,
            'withBirdwatchNotes': true,
            'withVoice': true,
            'withV2Timeline': true
        };
        const features = {
            'articles_preview_enabled': true,
            'c9s_tweet_anatomy_moderator_badge_enabled': true,
            'communities_web_enable_tweet_community_results_fetch': false,
            'creator_subscriptions_quote_tweet_preview_enabled': false,
            'creator_subscriptions_tweet_preview_api_enabled': false,
            'freedom_of_speech_not_reach_fetch_enabled': true,
            'graphql_is_translatable_rweb_tweet_is_translatable_enabled': true,
            'longform_notetweets_consumption_enabled': false,
            'longform_notetweets_inline_media_enabled': true,
            'longform_notetweets_rich_text_read_enabled': false,
            'premium_content_api_read_enabled': false,
            'profile_label_improvements_pcf_label_in_post_enabled': true,
            'responsive_web_edit_tweet_api_enabled': false,
            'responsive_web_enhance_cards_enabled': false,
            'responsive_web_graphql_exclude_directive_enabled': false,
            'responsive_web_graphql_skip_user_profile_image_extensions_enabled': false,
            'responsive_web_graphql_timeline_navigation_enabled': false,
            'responsive_web_media_download_video_enabled': false,
            'responsive_web_twitter_article_tweet_consumption_enabled': true,
            'rweb_tipjar_consumption_enabled': true,
            'rweb_video_screen_enabled': false,
            'standardized_nudges_misinfo': true,
            'tweet_awards_web_tipping_enabled': false,
            'tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled': true,
            'tweetypie_unmention_optimization_enabled': false,
            'verified_phone_label_enabled': false,
            'view_counts_everywhere_api_enabled': true
        };

        const url = encodeURI(`${baseUrl}?variables=${JSON.stringify(variables)}&features=${JSON.stringify(features)}`);
        const cookies = getCookies();
        const headers = {
            'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': cookies.lang || 'en',
            'x-csrf-token': cookies.ct0
        };

        if (cookies.ct0 && cookies.ct0.length === 32) {
            headers['x-guest-token'] = cookies.gt;
        }

        const response = await fetch(url, { headers });
        const json = await response.json();

        if (json.errors) {
            throw new Error(json.errors[0].message);
        }

        const tweetResult = json.data?.tweetResult?.result;
        return tweetResult?.tweet || tweetResult;
    }

    function extractMediaFromApi(tweetData) {
        const media = [];
        const tweet = tweetData.legacy;
        const user = tweetData.core?.user_results?.result?.legacy;
        const extendedMedia = tweet?.extended_entities?.media || [];

        extendedMedia.forEach((item, index) => {
            if (item.type === 'photo') {
                media.push({
                    type: 'image',
                    url: item.media_url_https + ':orig',
                    filename: `${tweet.id_str}_img_${index}.jpg`
                });
            } else if (item.type === 'video' || item.type === 'animated_gif') {
                const variants = item.video_info?.variants || [];
                const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                const bestVariant = mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

                if (bestVariant) {
                    const ext = item.type === 'animated_gif' ? 'gif.mp4' : 'mp4';
                    media.push({
                        type: item.type === 'animated_gif' ? 'gif' : 'video',
                        url: bestVariant.url.split('?')[0],
                        bitrate: bestVariant.bitrate,
                        filename: `${tweet.id_str}_${item.type === 'animated_gif' ? 'gif' : 'video'}_${index}.${ext}`
                    });
                }
            }
        });

        return {
            user: user ? `${user.name} (@${user.screen_name})` : 'Unknown',
            text: tweet?.full_text?.substring(0, 100) || '',
            media
        };
    }

    GM_registerMenuCommand('打开 X Likes 下载器', openPanel);

})();
