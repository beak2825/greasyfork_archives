// ==UserScript==
// @name         ytify Downloader
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      10.2
// @description  搭配 ytify 自架伺服器，在 YouTube 頁面一鍵下載影片
// @author       Jeffrey
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      localhost
// @connect      127.0.0.1
// @connect      *.trycloudflare.com
// @connect      *
// @run-at       document-idle
// @homepageURL  https://jeffrey0117.github.io/Ytify/
// @supportURL   https://github.com/Jeffrey0117/Ytify/issues
// @downloadURL https://update.greasyfork.org/scripts/561869/ytify%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561869/ytify%20Downloader.meta.js
// ==/UserScript==

/**
 * ytify Downloader v10.1
 * - 修復 TrustedHTML 錯誤
 * - 支援同時多個下載任務
 *
 * 官方網站: https://jeffrey0117.github.io/Ytify/
 * GitHub:  https://github.com/Jeffrey0117/Ytify
 */

(function() {
    'use strict';

    // ╔════════════════════════════════════════════════════════════╗
    // ║                    🔧 使用者設定區                          ║
    // ║          修改下方網址為你的 ytify 服務位置                   ║
    // ╚════════════════════════════════════════════════════════════╝

    const YTIFY_API_URL = 'http://localhost:8765';

    // 範例：
    // const YTIFY_API_URL = 'http://localhost:8765';           // 本地
    // const YTIFY_API_URL = 'https://ytify.你的域名.com';       // 自訂域名
    // const YTIFY_API_URL = 'https://xxx.trycloudflare.com';   // 臨時 tunnel

    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        YTIFY_API: YTIFY_API_URL,
        POLL_INTERVAL: 1500,
        POLL_TIMEOUT: 600000,
    };

    const YTIFY_FORMATS = [
        { format: 'best', label: '最佳畫質', audioOnly: false },
        { format: '1080p', label: '1080p', audioOnly: false },
        { format: '720p', label: '720p', audioOnly: false },
        { format: '480p', label: '480p', audioOnly: false },
        { format: 'best', label: '僅音訊', audioOnly: true },
    ];

    GM_addStyle(`
        .ytdl-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            margin-left: 8px;
            background: #065fd4;
            color: white;
            border: none;
            border-radius: 18px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }
        .ytdl-btn:hover { background: #0056b8; }
        .ytdl-btn svg { width: 18px; height: 18px; }
        .ytdl-btn .badge {
            background: #f44336;
            color: white;
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 10px;
            margin-left: 4px;
        }
        .ytdl-menu {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: #212121;
            border-radius: 10px;
            padding: 6px 0;
            min-width: 160px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.4);
            z-index: 9999;
            display: none;
        }
        .ytdl-menu.show { display: block; }
        .ytdl-menu-header {
            padding: 6px 12px 4px;
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
        }
        .ytdl-menu-header svg { width: 12px; height: 12px; flex-shrink: 0; }
        .ytdl-menu-item {
            padding: 7px 12px;
            color: white;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ytdl-menu-item:hover { background: #3a3a3a; }
        .ytdl-menu-item.disabled { color: #666; cursor: not-allowed; }
        .ytdl-menu-item.disabled:hover { background: transparent; }
        .ytdl-menu-item svg { width: 14px; height: 14px; opacity: 0.7; }
        .ytdl-wrapper { position: relative; display: inline-block; }
        .ytdl-ytify-status {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: auto;
        }
        .ytdl-ytify-status.online { background: #4caf50; color: #fff; font-weight: 500; }
        .ytdl-ytify-status.offline { background: #f44336; color: #fff; font-weight: 500; }

        /* ===== 下載面板 ===== */
        .ytdl-panel {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 360px;
            background: #1a1a1a;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            z-index: 999999;
            font-family: 'Roboto', Arial, sans-serif;
            overflow: hidden;
            transform: translateY(calc(100% + 30px));
            transition: transform 0.3s ease;
        }
        .ytdl-panel.show { transform: translateY(0); }
        .ytdl-panel.minimized .ytdl-panel-body { display: none; }
        .ytdl-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #282828;
            cursor: pointer;
            user-select: none;
        }
        .ytdl-panel-header:hover { background: #333; }
        .ytdl-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-weight: 500;
            font-size: 14px;
        }
        .ytdl-panel-title svg { width: 18px; height: 18px; }
        .ytdl-panel-badge {
            background: #065fd4;
            color: white;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
        }
        .ytdl-panel-actions {
            display: flex;
            gap: 8px;
        }
        .ytdl-panel-btn {
            background: transparent;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ytdl-panel-btn:hover { background: #444; color: white; }
        .ytdl-panel-btn svg { width: 16px; height: 16px; }
        .ytdl-panel-body {
            max-height: 300px;
            overflow-y: auto;
        }
        .ytdl-panel-empty {
            padding: 24px;
            text-align: center;
            color: #666;
            font-size: 13px;
        }

        /* 任務項目 */
        .ytdl-task {
            padding: 12px 16px;
            border-bottom: 1px solid #333;
        }
        .ytdl-task:last-child { border-bottom: none; }
        .ytdl-task-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .ytdl-task-title {
            color: white;
            font-size: 13px;
            font-weight: 500;
            max-width: 260px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .ytdl-task-status {
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 4px;
            flex-shrink: 0;
        }
        .ytdl-task-status.downloading { background: #065fd4; color: white; }
        .ytdl-task-status.queued { background: #666; color: white; }
        .ytdl-task-status.processing { background: #ff9800; color: white; }
        .ytdl-task-status.completed { background: #4caf50; color: white; }
        .ytdl-task-status.failed { background: #f44336; color: white; }
        .ytdl-task-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
        }
        .ytdl-task-sub {
            color: #888;
            font-size: 12px;
        }
        .ytdl-task-progress {
            color: #3ea6ff;
            font-size: 12px;
            font-weight: 500;
        }
        .ytdl-task-bar {
            height: 3px;
            background: #444;
            border-radius: 2px;
            overflow: hidden;
        }
        .ytdl-task-bar-fill {
            height: 100%;
            background: #3ea6ff;
            transition: width 0.3s ease;
        }
        .ytdl-task-bar-fill.anim {
            animation: ytdl-pulse 1.5s ease-in-out infinite;
            width: 30% !important;
        }
        @keyframes ytdl-pulse {
            0%, 100% { margin-left: 0; }
            50% { margin-left: 70%; }
        }
        .ytdl-task-bar-fill.done { background: #4caf50; }
        .ytdl-task-bar-fill.fail { background: #f44336; }

        .ytdl-panel-body::-webkit-scrollbar { width: 6px; }
        .ytdl-panel-body::-webkit-scrollbar-track { background: #1a1a1a; }
        .ytdl-panel-body::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
    `);

    // ===== 狀態管理 =====
    let videoId = null;
    let container = null;
    let panel = null;
    let ytifyOnline = false;
    const tasks = new Map();

    const getVideoId = () => new URLSearchParams(location.search).get('v');
    const getTitle = () => {
        const el = document.querySelector('h1 yt-formatted-string');
        return (el?.textContent?.trim() || 'video').replace(/[<>:"/\\|?*]/g, '');
    };

    // ===== SVG 建立（避免 innerHTML）=====
    function createSvg(pathD) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        svg.appendChild(path);
        return svg;
    }

    const SVG_PATHS = {
        download: 'M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z',
        local: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
        video: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
        audio: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
        minimize: 'M19 13H5v-2h14v2z',
        close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    };

    // ===== API 請求 =====
    function ytifyRequest(method, path, data = null, timeout = 30000) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url: CONFIG.YTIFY_API + path,
                headers: { 'Content-Type': 'application/json' },
                data: data ? JSON.stringify(data) : null,
                timeout,
                onload: (res) => {
                    try {
                        const result = JSON.parse(res.responseText);
                        if (res.status >= 400) {
                            reject(new Error(result.detail || result.error || '請求失敗'));
                        } else {
                            resolve(result);
                        }
                    } catch {
                        res.status === 200 ? resolve({ status: 'ok' }) : reject(new Error('解析失敗'));
                    }
                },
                onerror: () => reject(new Error('無法連接 ytify 服務')),
                ontimeout: () => reject(new Error('請求超時')),
            });
        });
    }

    async function checkYtifyStatus() {
        try {
            await ytifyRequest('GET', '/health');
            ytifyOnline = true;
        } catch {
            ytifyOnline = false;
        }
        updateMenuStatus();
    }

    function updateMenuStatus() {
        const indicator = document.querySelector('.ytdl-ytify-indicator');
        if (indicator) {
            indicator.className = 'ytdl-ytify-status ytdl-ytify-indicator ' + (ytifyOnline ? 'online' : 'offline');
            indicator.textContent = ytifyOnline ? '已連線' : '離線';
        }
        document.querySelectorAll('.ytdl-menu-item[data-ytify]').forEach(item => {
            item.classList.toggle('disabled', !ytifyOnline);
        });
    }

    // ===== 下載面板 =====
    function getPanel() {
        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'ytdl-panel';

            // Header
            const header = document.createElement('div');
            header.className = 'ytdl-panel-header';

            const title = document.createElement('div');
            title.className = 'ytdl-panel-title';
            title.appendChild(createSvg(SVG_PATHS.download));
            const titleText = document.createElement('span');
            titleText.textContent = '下載任務';
            title.appendChild(titleText);
            const badge = document.createElement('span');
            badge.className = 'ytdl-panel-badge';
            badge.textContent = '0';
            title.appendChild(badge);

            const actions = document.createElement('div');
            actions.className = 'ytdl-panel-actions';

            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'ytdl-panel-btn ytdl-panel-minimize';
            minimizeBtn.title = '最小化';
            minimizeBtn.appendChild(createSvg(SVG_PATHS.minimize));

            const closeBtn = document.createElement('button');
            closeBtn.className = 'ytdl-panel-btn ytdl-panel-close';
            closeBtn.title = '關閉';
            closeBtn.appendChild(createSvg(SVG_PATHS.close));

            actions.append(minimizeBtn, closeBtn);
            header.append(title, actions);

            // Body
            const body = document.createElement('div');
            body.className = 'ytdl-panel-body';
            const empty = document.createElement('div');
            empty.className = 'ytdl-panel-empty';
            empty.textContent = '沒有進行中的下載';
            body.appendChild(empty);

            panel.append(header, body);

            // Events
            header.onclick = () => panel.classList.toggle('minimized');
            minimizeBtn.onclick = (e) => {
                e.stopPropagation();
                panel.classList.add('minimized');
            };
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                panel.classList.remove('show');
            };

            document.body.appendChild(panel);
        }
        return panel;
    }

    function showPanel() {
        const p = getPanel();
        p.classList.add('show');
        p.classList.remove('minimized');
    }

    function updatePanel() {
        const p = getPanel();
        const body = p.querySelector('.ytdl-panel-body');
        const badge = p.querySelector('.ytdl-panel-badge');
        const activeCount = [...tasks.values()].filter(t => !['completed', 'failed'].includes(t.status)).length;

        badge.textContent = activeCount;
        updateButtonBadge(activeCount);

        // 清空 body
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }

        if (tasks.size === 0) {
            const empty = document.createElement('div');
            empty.className = 'ytdl-panel-empty';
            empty.textContent = '沒有進行中的下載';
            body.appendChild(empty);
            return;
        }

        tasks.forEach((task, taskId) => {
            const el = document.createElement('div');
            el.className = 'ytdl-task';
            el.dataset.taskId = taskId;

            const statusClass = task.status || 'queued';
            const statusText = {
                queued: '排隊中',
                downloading: '下載中',
                processing: '處理中',
                completed: '完成',
                failed: '失敗',
                retrying: '重試中'
            }[statusClass] || statusClass;

            const progress = task.progress || 0;
            const isLoading = ['queued', 'processing', 'retrying'].includes(task.status);
            const isDone = task.status === 'completed';
            const isFail = task.status === 'failed';

            // Task header
            const taskHeader = document.createElement('div');
            taskHeader.className = 'ytdl-task-header';

            const taskTitle = document.createElement('div');
            taskTitle.className = 'ytdl-task-title';
            taskTitle.title = task.title || '';
            taskTitle.textContent = task.title || '載入中...';

            const taskStatus = document.createElement('div');
            taskStatus.className = 'ytdl-task-status ' + statusClass;
            taskStatus.textContent = statusText;

            taskHeader.append(taskTitle, taskStatus);

            // Task info
            const taskInfo = document.createElement('div');
            taskInfo.className = 'ytdl-task-info';

            const taskSub = document.createElement('div');
            taskSub.className = 'ytdl-task-sub';
            taskSub.textContent = (task.format || '') + ' ' + (task.speed || '');

            const taskProgress = document.createElement('div');
            taskProgress.className = 'ytdl-task-progress';
            taskProgress.textContent = isDone ? '100%' : isFail ? '' : Math.round(progress) + '%';

            taskInfo.append(taskSub, taskProgress);

            // Task bar
            const taskBar = document.createElement('div');
            taskBar.className = 'ytdl-task-bar';

            const taskBarFill = document.createElement('div');
            taskBarFill.className = 'ytdl-task-bar-fill';
            if (isLoading) taskBarFill.classList.add('anim');
            if (isDone) taskBarFill.classList.add('done');
            if (isFail) taskBarFill.classList.add('fail');
            taskBarFill.style.width = (isDone ? 100 : isFail ? 100 : progress) + '%';

            taskBar.appendChild(taskBarFill);

            el.append(taskHeader, taskInfo, taskBar);
            body.appendChild(el);
        });
    }

    function updateButtonBadge(count) {
        const badge = document.querySelector('.ytdl-btn .badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    // ===== 下載邏輯 =====
    function triggerBrowserDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function pollTaskStatus(taskId) {
        const startTime = Date.now();
        let fakeProgress = 0;

        const poll = async () => {
            const task = tasks.get(taskId);
            if (!task) return;

            if (Date.now() - startTime > CONFIG.POLL_TIMEOUT) {
                task.status = 'failed';
                task.error = '下載超時';
                updatePanel();
                return;
            }

            try {
                const status = await ytifyRequest('GET', `/api/status/${taskId}`);

                task.status = status.status;
                task.title = status.title || task.title;
                task.speed = status.speed || '';
                task.error = status.error;

                if (status.status === 'downloading' || status.status === 'processing') {
                    if (status.progress && status.progress > 0) {
                        task.progress = status.progress;
                    } else {
                        fakeProgress += fakeProgress < 30 ? 8 : (fakeProgress < 90 ? 2 : 0.5);
                        fakeProgress = Math.min(fakeProgress, 95);
                        task.progress = fakeProgress;
                    }
                } else if (status.status === 'completed') {
                    task.progress = 100;
                    task.filename = status.filename;
                    if (status.filename) {
                        const downloadUrl = `${CONFIG.YTIFY_API}/api/download-file/${encodeURIComponent(status.filename)}`;
                        triggerBrowserDownload(downloadUrl, status.filename);
                    }
                    setTimeout(() => {
                        tasks.delete(taskId);
                        updatePanel();
                    }, 5000);
                } else if (status.status === 'failed') {
                    task.progress = 0;
                    setTimeout(() => {
                        tasks.delete(taskId);
                        updatePanel();
                    }, 10000);
                }

                updatePanel();

                if (!['completed', 'failed'].includes(status.status)) {
                    setTimeout(poll, CONFIG.POLL_INTERVAL);
                }
            } catch {
                setTimeout(poll, CONFIG.POLL_INTERVAL * 2);
            }
        };

        poll();
    }

    async function downloadViaYtify(fmt) {
        if (!ytifyOnline) {
            alert('ytify 服務未連線');
            return;
        }

        const title = getTitle();
        const tempId = 'temp-' + Date.now();

        tasks.set(tempId, {
            title: title,
            format: fmt.label,
            status: 'queued',
            progress: 0,
        });
        showPanel();
        updatePanel();

        try {
            const info = await ytifyRequest('POST', '/api/info', { url: location.href }, 60000);
            const task = tasks.get(tempId);
            if (task) task.title = info.title || title;
            updatePanel();

            const result = await ytifyRequest('POST', '/api/download', {
                url: location.href,
                format: fmt.format,
                audio_only: fmt.audioOnly
            }, 60000);

            if (!result.task_id) throw new Error('無法建立下載任務');

            const taskData = tasks.get(tempId);
            tasks.delete(tempId);
            tasks.set(result.task_id, taskData);

            pollTaskStatus(result.task_id);

        } catch (e) {
            const task = tasks.get(tempId);
            if (task) {
                task.status = 'failed';
                task.error = e.message;
                updatePanel();
                setTimeout(() => {
                    tasks.delete(tempId);
                    updatePanel();
                }, 5000);
            }
        }
    }

    // ===== UI 建立（不使用 innerHTML）=====
    function createUI() {
        const wrap = document.createElement('div');
        wrap.className = 'ytdl-wrapper';

        // 主按鈕
        const btn = document.createElement('button');
        btn.className = 'ytdl-btn';
        btn.appendChild(createSvg(SVG_PATHS.download));
        const btnText = document.createTextNode(' 下載 ');
        btn.appendChild(btnText);
        const btnBadge = document.createElement('span');
        btnBadge.className = 'badge';
        btnBadge.style.display = 'none';
        btnBadge.textContent = '0';
        btn.appendChild(btnBadge);

        // 選單
        const menu = document.createElement('div');
        menu.className = 'ytdl-menu';

        // ytify header
        const ytifyHeader = document.createElement('div');
        ytifyHeader.className = 'ytdl-menu-header';

        const labelSpan = document.createElement('span');
        labelSpan.style.cssText = 'display:flex;align-items:center;gap:4px';
        labelSpan.appendChild(createSvg(SVG_PATHS.local));
        labelSpan.appendChild(document.createTextNode(' YTIFY'));

        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'ytdl-ytify-status ytdl-ytify-indicator offline';
        statusIndicator.textContent = '檢查中';

        ytifyHeader.append(labelSpan, statusIndicator);
        menu.appendChild(ytifyHeader);

        // 格式選項
        YTIFY_FORMATS.forEach(fmt => {
            const item = document.createElement('div');
            item.className = 'ytdl-menu-item disabled';
            item.dataset.ytify = 'true';
            item.appendChild(createSvg(fmt.audioOnly ? SVG_PATHS.audio : SVG_PATHS.video));
            item.appendChild(document.createTextNode(' ' + fmt.label));
            item.onclick = (e) => {
                e.stopPropagation();
                if (!item.classList.contains('disabled')) {
                    menu.classList.remove('show');
                    downloadViaYtify(fmt);
                }
            };
            menu.appendChild(item);
        });

        // 分隔線
        const divider = document.createElement('div');
        divider.style.cssText = 'height:1px;background:#3a3a3a;margin:6px 0';
        menu.appendChild(divider);

        // 查看下載面板
        const panelItem = document.createElement('div');
        panelItem.className = 'ytdl-menu-item';
        panelItem.appendChild(createSvg(SVG_PATHS.download));
        panelItem.appendChild(document.createTextNode(' 查看下載面板'));
        panelItem.onclick = (e) => {
            e.stopPropagation();
            menu.classList.remove('show');
            showPanel();
        };
        menu.appendChild(panelItem);

        wrap.append(btn, menu);

        btn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
            if (menu.classList.contains('show')) {
                checkYtifyStatus();
            }
        };

        document.addEventListener('click', () => menu.classList.remove('show'));

        return wrap;
    }

    function inject() {
        const vid = getVideoId();
        if (!vid) return;
        if (vid === videoId && container && document.contains(container)) return;

        container?.remove();

        const target = document.querySelector('#top-level-buttons-computed, #subscribe-button');
        if (target) {
            videoId = vid;
            container = createUI();
            target.parentNode.insertBefore(container, target.nextSibling);
        }
    }

    async function tryInject() {
        const vid = getVideoId();
        if (!vid) return;

        const checkTarget = () => document.querySelector('#top-level-buttons-computed, #subscribe-button');
        let attempts = 0;
        while (!checkTarget() && attempts < 20) {
            await new Promise(r => setTimeout(r, 400));
            attempts++;
        }
        if (checkTarget()) inject();
    }

    function init() {
        tryInject();

        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                videoId = null;
                container?.remove();
                container = null;
                setTimeout(tryInject, 500);
            }
        }).observe(document.body, { subtree: true, childList: true });

        document.addEventListener('yt-navigate-finish', () => {
            videoId = null;
            container?.remove();
            container = null;
            setTimeout(tryInject, 300);
        });

        setInterval(() => {
            const vid = getVideoId();
            if (vid && (!container || !document.contains(container))) {
                inject();
            }
        }, 1500);

        checkYtifyStatus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
