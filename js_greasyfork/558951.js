// ==UserScript==
// @name         Hanime1 Aria2 Connector (ID Mode Safe)
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  v21.0: 云端同步已下载状态 (基于WebDAV hanime_history.json)。
// @author       Gemini User
// @license      MIT
// @match        https://hanime1.me/*
// @connect      *
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558951/Hanime1%20Aria2%20Connector%20%28ID%20Mode%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558951/Hanime1%20Aria2%20Connector%20%28ID%20Mode%20Safe%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置管理 ---
    const DEFAULTS = {
        aria2Url: 'http://localhost:6800/jsonrpc',
        aria2Token: '',
        rootPath: '/mnt/external/',
        safeMode: false,
        webdavUrl: '',
        webdavUser: '',
        webdavPass: '',
        enableVideo: true,
        enableImage: true,
        enableNfo: true
    };

    const HISTORY_FILE = "hanime_history.json"; // 云端记录文件名

    function getConfig() {
        return {
            aria2Url: GM_getValue('aria2Url', DEFAULTS.aria2Url),
            aria2Token: GM_getValue('aria2Token', DEFAULTS.aria2Token),
            rootPath: GM_getValue('rootPath', DEFAULTS.rootPath),
            safeMode: GM_getValue('safeMode', DEFAULTS.safeMode),
            webdavUrl: GM_getValue('webdavUrl', DEFAULTS.webdavUrl),
            webdavUser: GM_getValue('webdavUser', DEFAULTS.webdavUser),
            webdavPass: GM_getValue('webdavPass', DEFAULTS.webdavPass),
            enableVideo: GM_getValue('enableVideo', DEFAULTS.enableVideo),
            enableImage: GM_getValue('enableImage', DEFAULTS.enableImage),
            enableNfo: GM_getValue('enableNfo', DEFAULTS.enableNfo)
        };
    }

    function saveConfig(newConfig) {
        for (const key in newConfig) {
            GM_setValue(key, newConfig[key]);
        }
    }

    // --- 状态管理 (本地 + 云端) ---

    // 1. 本地检查 (快速)
    function isLocalDone(id) {
        return GM_getValue('h1_done_' + id, false);
    }

    // 2. 标记本地 (快速)
    function markLocalDone(id) {
        GM_setValue('h1_done_' + id, Date.now());
    }

    // 3. 从 WebDAV 同步 (读取)
    function syncFromCloud(currentVideoId, btnElement) {
        const cfg = getConfig();
        if (!cfg.webdavUrl || !cfg.webdavUrl.startsWith('http')) return;

        const historyUrl = cfg.webdavUrl + HISTORY_FILE;

        GM_xmlhttpRequest({
            method: "GET",
            url: historyUrl,
            user: cfg.webdavUser,
            password: cfg.webdavPass,
            headers: { "Cache-Control": "no-cache" }, // 防止缓存
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        const history = JSON.parse(res.responseText);
                        let updatedCount = 0;
                        // 将云端数据合并到本地
                        history.forEach(id => {
                            if (!isLocalDone(id)) {
                                markLocalDone(id);
                                updatedCount++;
                            }
                        });
                        console.log(`[Cloud Sync] Pulled ${history.length} records. Updated local: ${updatedCount}`);
                        
                        // 如果当前视频在云端记录里，更新按钮状态
                        if (isLocalDone(currentVideoId) && btnElement) {
                            updateButtonToDone(btnElement);
                        }
                    } catch (e) {
                        console.error("[Cloud Sync] JSON Parse Error", e);
                    }
                } else if (res.status === 404) {
                    console.log("[Cloud Sync] No history file found. Will create one on next download.");
                }
            }
        });
    }

    // 4. 推送到 WebDAV (写入：读取 -> 追加 -> 上传)
    function pushToCloud(newId) {
        const cfg = getConfig();
        if (!cfg.webdavUrl || !cfg.webdavUrl.startsWith('http')) return;

        const historyUrl = cfg.webdavUrl + HISTORY_FILE;

        // Step 1: 先下载最新的列表 (防止覆盖其他设备的记录)
        GM_xmlhttpRequest({
            method: "GET",
            url: historyUrl,
            user: cfg.webdavUser,
            password: cfg.webdavPass,
            headers: { "Cache-Control": "no-cache" },
            onload: (res) => {
                let history = [];
                if (res.status === 200) {
                    try { history = JSON.parse(res.responseText); } catch (e) {}
                }
                
                // Step 2: 追加 ID (去重)
                if (!history.includes(newId)) {
                    history.push(newId);
                    const jsonContent = JSON.stringify(history);
                    
                    // Step 3: 上传回 WebDAV
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: historyUrl,
                        user: cfg.webdavUser,
                        password: cfg.webdavPass,
                        data: jsonContent,
                        headers: { "Content-Type": "application/json" },
                        onload: (upRes) => {
                            if (upRes.status < 300) console.log(`[Cloud Sync] Added ID ${newId} to cloud.`);
                            else console.error("[Cloud Sync] Upload failed", upRes.status);
                        }
                    });
                }
            }
        });
    }

    function updateButtonToDone(btn) {
        if (!btn.classList.contains('gm-done')) {
            btn.classList.add('gm-done');
            btn.innerHTML = `<i class="material-icons">check_circle</i> 已执行 (Re-run)`;
        }
    }

    // --- 2. 样式 ---
    const css = `
        .video-buttons-wrapper {
            display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
            padding: 15px 0 20px 0 !important; margin-top: 10px !important; margin-bottom: 10px !important;
            position: relative !important; z-index: 999 !important; pointer-events: auto !important; clear: both !important;
        }
        .gm-action-btn {
            display: inline-flex; align-items: center; justify-content: center; height: 38px; padding: 0 15px;
            border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer; user-select: none; color: #fff;
            transition: transform 0.1s, background 0.2s; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1);
            position: relative; z-index: 1000;
        }
        .gm-action-btn:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
        .gm-action-btn:active { transform: translateY(1px); }
        .gm-action-btn i { font-size: 18px; margin-right: 6px; }
        
        #gm-aria2-batch { background: #e74c3c; border-color: #e74c3c; flex-grow: 1; max-width: 200px; transition: background 0.3s; }
        #gm-aria2-batch:hover { background: #c0392b; }
        
        #gm-aria2-batch.gm-done { background: #27ae60 !important; border-color: #27ae60 !important; }
        #gm-aria2-batch.gm-done:hover { background: #219150 !important; }

        #gm-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: none; align-items: center; justify-content: center; }
        .gm-modal-content { background: #222; color: #eee; padding: 20px; border-radius: 8px; width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; max-height: 90vh; overflow-y: auto; }
        .gm-modal-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;}
        .gm-section-title { font-size: 12px; color: #e74c3c; font-weight: bold; margin: 15px 0 5px 0; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px;}
        .gm-input-group { margin-bottom: 10px; }
        .gm-input-group label { display: block; margin-bottom: 4px; font-size: 12px; color: #aaa; }
        .gm-input-group input[type="text"], .gm-input-group input[type="password"] {
            width: 100%; padding: 6px 8px; border: 1px solid #444; border-radius: 4px;
            font-size: 13px; background: #333; color: #fff; outline: none; box-sizing: border-box;
        }
        .gm-input-group input:focus { border-color: #e74c3c; }
        .gm-checkbox-group { display: flex; align-items: center; margin: 5px 0; background: #333; padding: 8px; border-radius: 4px;}
        .gm-checkbox-group input { margin-right: 10px; transform: scale(1.2); }
        .gm-checkbox-group label { cursor: pointer; user-select: none; }
        .gm-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .gm-btn-save { background: #e74c3c; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
        .gm-btn-cancel { background: #444; color: #ccc; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
        #bottom-ads, #right-ads, iframe[src*="ad"], .exoclick-banner { display: none !important; }
    `;
    GM_addStyle(css);

    // --- 3. 核心 Helper ---
    function getVideoTitle() {
        try {
            const panel = document.querySelector('.video-description-panel');
            if (panel) {
                const children = panel.children;
                for (let i = 0; i < children.length; i++) {
                    const el = children[i];
                    if (!el.classList.contains('hidden-xs') && !el.classList.contains('video-caption-text')) {
                        return el.innerText.trim().replace(/[\\/:*?"<>|#]/g, ' ');
                    }
                }
            }
        } catch (e) { console.error("Title parse error", e); }
        return document.title.replace(' - Hanime1.me', '').trim().replace(/[\\/:*?"<>|#]/g, ' ');
    }

    function getVideoID() {
        try {
            const params = new URLSearchParams(window.location.search);
            const v = params.get('v');
            if (v) return v;
        } catch (e) {}
        return 'Unknown_' + Math.floor(Date.now() / 1000);
    }

    function getPageThumbUrl(video) {
        const metaOG = document.querySelector('meta[property="og:image"]');
        if (metaOG && metaOG.content) return metaOG.content;
        return (video.poster && video.poster.startsWith('http')) ? video.poster : null;
    }

    function generateNFO() {
        const title = getVideoTitle();
        let plot = document.querySelector('.video-caption-text')?.innerText.trim() || "No description.";
        let year = new Date().getFullYear();
        let dateAdded = new Date().toISOString().split('T')[0];
        const dateEl = document.querySelector('.video-description-panel .hidden-xs');
        if (dateEl) { const match = dateEl.innerText.match(/(\d{4}-\d{2}-\d{2})/); if (match) { dateAdded = match[1]; year = match[1].split('-')[0]; } }

        let studio = "Hanime1";
        const studioEl = document.getElementById('video-artist-name');
        if (studioEl) studio = studioEl.innerText.trim();

        let tagsXML = "";
        document.querySelectorAll('.single-video-tag a').forEach(tag => {
            let t = tag.innerText.trim();
            t = t.replace(/\s*\(\d+\)$/, '');
            if (!t || t.toLowerCase() === 'add' || t.toLowerCase() === 'remove') return;
            tagsXML += `    <tag>${t}</tag>\n`;
        });

        return `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<movie>\n    <title>${title}</title>\n    <originaltitle>${title}</originaltitle>\n    <year>${year}</year>\n    <premiered>${dateAdded}</premiered>\n    <plot>${plot}</plot>\n    <studio>${studio}</studio>\n${tagsXML}    <uniqueid type="hanime1" default="true">${window.location.href}</uniqueid>\n</movie>`;
    }

    // --- 4. 设置面板 ---
    function createSettingsModal() {
        if (document.getElementById('gm-settings-modal')) return;
        const html = `
            <div id="gm-settings-modal">
                <div class="gm-modal-content">
                    <div class="gm-modal-title">配置面板 (v21.0 - Cloud Sync)</div>
                    
                    <div class="gm-section-title">任务开关</div>
                    <div class="gm-checkbox-group">
                        <input type="checkbox" id="gm-cfg-enable-video">
                        <label for="gm-cfg-enable-video">下载视频 (Aria2)</label>
                    </div>
                    <div class="gm-checkbox-group">
                        <input type="checkbox" id="gm-cfg-enable-image">
                        <label for="gm-cfg-enable-image">上传封面 (WebDAV, landscape.jpg)</label>
                    </div>
                    <div class="gm-checkbox-group">
                        <input type="checkbox" id="gm-cfg-enable-nfo">
                        <label for="gm-cfg-enable-nfo">上传 NFO (WebDAV)</label>
                    </div>

                    <div class="gm-section-title">Aria2 (视频下载)</div>
                    <div class="gm-input-group"><label>RPC 地址</label><input type="text" id="gm-cfg-url" placeholder="http://192.168.x.x:6800/jsonrpc"></div>
                    <div class="gm-input-group"><label>Token</label><input type="password" id="gm-cfg-token"></div>
                    <div class="gm-input-group"><label>下载路径</label><input type="text" id="gm-cfg-path" placeholder="/mnt/external/"></div>

                    <div class="gm-section-title">WebDAV (文件 & 状态同步)</div>
                    <div class="gm-input-group">
                        <label>WebDAV 父目录 URL (存放 history.json 和文件)</label>
                        <input type="text" id="gm-cfg-webdav-url" placeholder="http://host:port/dav/local/">
                    </div>
                    <div class="gm-input-group"><label>用户</label><input type="text" id="gm-cfg-webdav-user"></div>
                    <div class="gm-input-group"><label>密码</label><input type="password" id="gm-cfg-webdav-pass"></div>
                    
                    <div class="gm-checkbox-group">
                        <input type="checkbox" id="gm-cfg-safe">
                        <label for="gm-cfg-safe" style="color: #e74c3c; font-weight:bold;">开启 ID 脱敏模式 (例: Hanime_9527)</label>
                    </div>
                    
                    <div class="gm-modal-footer">
                        <button class="gm-btn-cancel" id="gm-cfg-cancel">取消</button>
                        <button class="gm-btn-save" id="gm-cfg-save">保存</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('gm-cfg-cancel').onclick = () => document.getElementById('gm-settings-modal').style.display = 'none';
        document.getElementById('gm-cfg-save').onclick = () => {
            saveConfig({
                aria2Url: document.getElementById('gm-cfg-url').value.trim(),
                aria2Token: document.getElementById('gm-cfg-token').value.trim(),
                rootPath: document.getElementById('gm-cfg-path').value.trim(),
                safeMode: document.getElementById('gm-cfg-safe').checked,
                webdavUrl: document.getElementById('gm-cfg-webdav-url').value.trim().replace(/\/$/, '') + '/',
                webdavUser: document.getElementById('gm-cfg-webdav-user').value.trim(),
                webdavPass: document.getElementById('gm-cfg-webdav-pass').value.trim(),
                enableVideo: document.getElementById('gm-cfg-enable-video').checked,
                enableImage: document.getElementById('gm-cfg-enable-image').checked,
                enableNfo: document.getElementById('gm-cfg-enable-nfo').checked
            });
            document.getElementById('gm-settings-modal').style.display = 'none';
            alert('设置已保存');
        };
        document.getElementById('gm-settings-modal').onclick = (e) => { if(e.target.id === 'gm-settings-modal') e.target.style.display = 'none'; };
    }

    function openSettings() {
        createSettingsModal();
        const cfg = getConfig();
        document.getElementById('gm-cfg-url').value = cfg.aria2Url;
        document.getElementById('gm-cfg-token').value = cfg.aria2Token;
        document.getElementById('gm-cfg-path').value = cfg.rootPath;
        document.getElementById('gm-cfg-safe').checked = cfg.safeMode;
        document.getElementById('gm-cfg-webdav-url').value = cfg.webdavUrl;
        document.getElementById('gm-cfg-webdav-user').value = cfg.webdavUser;
        document.getElementById('gm-cfg-webdav-pass').value = cfg.webdavPass;
        
        document.getElementById('gm-cfg-enable-video').checked = cfg.enableVideo;
        document.getElementById('gm-cfg-enable-image').checked = cfg.enableImage;
        document.getElementById('gm-cfg-enable-nfo').checked = cfg.enableNfo;
        
        document.getElementById('gm-settings-modal').style.display = 'flex';
    }

    // --- 5. 网络模块 ---
    function callAria2(method, params, btn) {
        const config = getConfig();
        const payload = { jsonrpc: '2.0', method: method, id: 'gm-' + Date.now(), params: params };
        if (config.aria2Token) payload.params.unshift('token:' + config.aria2Token);
        GM_xmlhttpRequest({
            method: "POST", url: config.aria2Url, data: JSON.stringify(payload), headers: { "Content-Type": "application/json" },
            onload: (res) => { if (res.status === 200) { if(btn) triggerFeedback(btn, 'check', '视频任务已发'); } else { alert('Aria2 错误: ' + res.statusText); } },
            onerror: () => alert('Aria2 连接失败')
        });
    }

    function uploadToWebdavRaw(folderName, fileName, content, contentType) {
        const cfg = getConfig();
        if (!cfg.webdavUrl || !cfg.webdavUrl.startsWith('http')) { 
            console.log("No WebDAV URL configured, skipping upload:", fileName);
            return; 
        }
        const folderUrl = cfg.webdavUrl + encodeURIComponent(folderName) + '/';
        const fileUrl = folderUrl + encodeURIComponent(fileName);

        console.log(`WebDAV Upload [${fileName}] -> ${fileUrl}`);

        GM_xmlhttpRequest({
            method: "MKCOL", url: folderUrl, user: cfg.webdavUser, password: cfg.webdavPass,
            onload: () => { performPut(fileUrl, content, cfg, contentType); },
            onerror: () => { performPut(fileUrl, content, cfg, contentType); }
        });
    }

    function performPut(url, content, cfg, contentType) {
        GM_xmlhttpRequest({
            method: "PUT", url: url, user: cfg.webdavUser, password: cfg.webdavPass, data: content, headers: { "Content-Type": contentType },
            onload: (res) => {
                if (res.status < 300) console.log("WebDAV Upload Success:", url);
                else console.error("WebDAV Error:", res.status, res.statusText);
            },
            onerror: () => console.error("WebDAV Network Error")
        });
    }

    function fetchAndUploadImage(imgUrl, folderName, targetFileName) {
        if (!imgUrl) return;
        console.log("Fetching image:", imgUrl);
        GM_xmlhttpRequest({
            method: "GET", url: imgUrl, responseType: "arraybuffer", headers: { "Referer": window.location.href },
            onload: (res) => {
                if (res.status === 200) uploadToWebdavRaw(folderName, targetFileName, res.response, "image/jpeg");
                else console.error("Image Fetch Error:", res.status);
            }
        });
    }

    function triggerFeedback(btn, icon, text) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<i class="material-icons">${icon}</i> ${text}`;
        setTimeout(() => btn.innerHTML = originalHtml, 3000);
    }

    // --- 6. 按钮逻辑 ---
    function injectButtons(video) {
        const wrapper = document.querySelector('.video-buttons-wrapper');
        if (!wrapper || document.getElementById('gm-aria2-batch')) return;

        const originalTitle = getVideoTitle();
        const videoID = getVideoID();

        // 创建按钮
        const createBtn = (id, icon, text, onClick) => {
            const b = document.createElement('div');
            b.id = id; b.className = 'gm-action-btn';
            b.innerHTML = `<i class="material-icons">${icon}</i> ${text}`;
            b.onclick = onClick;
            return b;
        };

        const batchBtn = createBtn('gm-aria2-batch', 'cloud_download', 'Execute Tasks', () => {
            const cfg = getConfig();
            
            let videoUrl = "";
            const src = video.querySelector('source[type="video/mp4"]');
            if (src) videoUrl = src.src;
            else if (unsafeWindow.hls && unsafeWindow.hls.url) videoUrl = unsafeWindow.hls.url;
            
            if (cfg.enableVideo && !videoUrl) { alert('未找到视频地址'); return; }

            // 1. 立即更新界面为已下载
            markLocalDone(videoID);
            updateButtonToDone(batchBtn);
            
            // 2. 异步推送到云端
            pushToCloud(videoID);

            // 命名与路径处理
            let finalTitle, folderName;
            if (cfg.safeMode) {
                finalTitle = `Hanime_${videoID}`;
                folderName = finalTitle;
            } else {
                finalTitle = originalTitle;
                folderName = originalTitle.replace(/(\s+|#|第)\d+(\s*(集|話|话|vol|part))?$/i, '').trim() || originalTitle;
            }

            let cleanRoot = cfg.rootPath.replace(/\\/g, '/').replace(/\/$/, '');
            if (!cleanRoot.startsWith('/') && !cleanRoot.match(/^[a-zA-Z]:/)) cleanRoot = '/' + cleanRoot;
            
            const targetDir = `${cleanRoot}/${folderName}`;

            // 任务逻辑
            if (cfg.enableVideo) {
                const vName = finalTitle + (videoUrl.includes('.m3u8') ? '.ts' : '.mp4');
                const headers = [`User-Agent: ${navigator.userAgent}`, `Referer: ${window.location.href}`];
                const videoOptions = {
                    'out': vName, 'dir': targetDir, 'header': headers,
                    'file-allocation': 'none', 'auto-file-renaming': 'false',
                    'split': '1', 'max-connection-per-server': '1', 'continue': 'true'
                };
                callAria2('aria2.addUri', [[videoUrl], videoOptions], batchBtn);
            }
            if (cfg.enableImage) {
                const webThumbUrl = getPageThumbUrl(video);
                if (webThumbUrl) {
                    setTimeout(() => { fetchAndUploadImage(webThumbUrl, folderName, "landscape.jpg"); }, 1000);
                }
            }
            if (cfg.enableNfo) {
                const nfoContent = generateNFO();
                const nfoName = finalTitle + ".nfo";
                setTimeout(() => { uploadToWebdavRaw(folderName, nfoName, nfoContent, "text/xml"); }, 2000);
            }
        });

        const settingsBtn = createBtn('gm-settings-btn', 'settings', '', openSettings);
        settingsBtn.style.padding = '0 10px';

        wrapper.insertBefore(createBtn('gm-copy', 'content_copy', '', ()=>{ const src = video.querySelector('source[type="video/mp4"]'); if(src) GM_setClipboard(src.src); }), wrapper.firstChild);
        wrapper.insertBefore(settingsBtn, wrapper.firstChild);
        wrapper.insertBefore(batchBtn, wrapper.firstChild);

        // --- 页面加载完成后，触发同步逻辑 ---
        // 1. 先用本地缓存快速渲染状态
        if (isLocalDone(videoID)) {
            updateButtonToDone(batchBtn);
        }
        // 2. 然后从云端拉取更新 (如果不一致，会自动变绿)
        syncFromCloud(videoID, batchBtn);
    }

    let initDone = false;
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            injectButtons(video);
            if (unsafeWindow.hls && unsafeWindow.hls.levels) {
                const hls = unsafeWindow.hls;
                if (hls.currentLevel !== hls.levels.length - 1) hls.currentLevel = hls.levels.length - 1;
            }
            if (!initDone && video.paused) { initDone = true; video.muted = true; video.play().catch(()=>{}); }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();