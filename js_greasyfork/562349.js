// ==UserScript==
// @name         Pixiv Manager v5.1 (Fixed)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Pixiv专业下载器：修复文件夹创建与下载失败问题 (XHR+Blob方案)
// @author       魔蘑菇骨子
// @match        https://www.pixiv.net/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      pixiv.net
// @connect      i.pximg.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562349/Pixiv%20Manager%20v51%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562349/Pixiv%20Manager%20v51%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const CONFIG = {
        chunkSize: 48,    // 每次API加载数量
        delay: 800,       // 单图下载间隔(ms)
        reqDelay: 350     // API请求间隔(ms)
    };

    // === 状态管理 ===
    const state = {
        userId: null,
        authorName: "Unknown",
        worksMap: {},     // {id: details}
        allIds: [],       // [id1, id2...] (已排序)
        downloadedIds: new Set(),
        filter: 'all',    // 'all', 'illust', 'ugoira'
        isFetching: false,
        stopFlag: false
    };

    const urlMatch = window.location.href.match(/users\/(\d+)/);
    if (!urlMatch) return;
    state.userId = urlMatch[1];

    // === 数据库 ===
    const DB_KEY = "pixiv_download_history";
    function loadHistory() {
        const db = GM_getValue(DB_KEY, {});
        state.downloadedIds = new Set(db[state.userId] || []);
    }
    function saveHistory(newId) {
        const db = GM_getValue(DB_KEY, {});
        const list = db[state.userId] || [];
        if(!list.includes(newId)) list.push(newId);
        db[state.userId] = list;
        GM_setValue(DB_KEY, db);
        state.downloadedIds.add(newId);
    }

    // === 样式 ===
    const style = document.createElement('style');
    style.innerHTML = `
        /* 悬浮球 */
        #pm-fab {
            position: fixed; bottom: 30px; right: 30px;
            width: 60px; height: 60px; border-radius: 50%;
            background: #0096fa; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer; z-index: 9990; display: flex;
            align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 14px;
            transition: transform 0.2s;
        }
        #pm-fab:hover { transform: scale(1.1); }

        /* 窗口 */
        #pm-modal {
            display: none; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; background: rgba(0,0,0,0.75);
            z-index: 9999; justify-content: center; align-items: center;
            font-family: 'Segoe UI', sans-serif;
        }
        .pm-window {
            width: 1000px; max-width: 95%; height: 90%;
            background: #fdfdfd; border-radius: 12px;
            display: flex; flex-direction: column; overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* 头部与工具栏 */
        .pm-header {
            padding: 15px 20px; background: #fff; border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
        }
        .pm-title { font-size: 18px; font-weight: bold; color: #333; }
        .pm-close { cursor: pointer; font-size: 24px; color: #888; }

        .pm-toolbar {
            padding: 10px 20px; background: #f8f9fa; border-bottom: 1px solid #eee;
            display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
        }
        .pm-group {
            display: flex; gap: 5px; padding-right: 15px; border-right: 1px solid #ddd;
            align-items: center;
        }
        .pm-group:last-child { border-right: none; }
        .pm-label { font-size: 12px; color: #666; margin-right: 5px; font-weight:bold;}

        /* 按钮 */
        .pm-btn {
            padding: 5px 12px; border: 1px solid #ccc; border-radius: 4px;
            cursor: pointer; font-size: 12px; background: #fff; color: #333;
            transition: all 0.2s;
        }
        .pm-btn:hover { background: #eee; }
        .pm-btn.active { background: #0096fa; color: white; border-color: #0085de; }
        .btn-primary { background: #0096fa; color: white; border: none; font-weight: bold; padding: 6px 15px;}
        .btn-primary:hover { background: #007acc; }
        .btn-danger { background: #fff; color: #dc3545; border-color: #dc3545; }
        .btn-danger:hover { background: #dc3545; color: white; }

        /* 内容区 */
        .pm-content {
            flex: 1; overflow-y: auto; padding: 20px;
            background: #f0f2f5;
        }
        .pm-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }

        /* 卡片样式 */
        .pm-card {
            background: white; border-radius: 8px; overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: relative; cursor: pointer; transition: 0.2s;
            border: 2px solid transparent; height: 220px; display: flex; flex-direction: column;
        }
        .pm-card:hover { transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .pm-card.selected { border-color: #0096fa; background: #f0f8ff; }

        .card-thumb {
            width: 100%; height: 130px; object-fit: cover; background: #eee;
        }
        .card-body { padding: 8px; flex: 1; display: flex; flex-direction: column; }
        .card-title {
            font-size: 12px; font-weight: bold; margin-bottom: 4px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            overflow: hidden; line-height: 1.4; color: #333;
        }
        .card-meta { margin-top: auto; display: flex; justify-content: space-between; align-items: center;}
        .card-badge {
            font-size: 10px; padding: 2px 4px; border-radius: 3px; background: #eee; color: #555;
        }
        .badge-ugoira { background: #ffebed; color: #ff4060; border: 1px solid #ffccd2; }

        /* 卡片状态遮罩 */
        .card-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.7); display: none;
            flex-direction: column; align-items: center; justify-content: center;
            font-weight: bold; font-size: 13px; z-index: 5;
        }
        .status-downloaded { color: #28a745; display: flex; }
        .status-downloading { color: #0096fa; display: flex; background: rgba(255,255,255,0.9); }
        .status-failed { color: #dc3545; display: flex; background: rgba(255,235,235,0.9); }

        /* 进度条与日志 */
        .pm-footer {
            background: #fff; border-top: 1px solid #eee; padding: 10px 20px;
        }
        .progress-wrap { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar { height: 100%; background: #28a745; width: 0%; transition: width 0.3s; }
        .console-log {
            height: 60px; overflow-y: auto; font-family: monospace; font-size: 11px;
            color: #666; border: 1px solid #eee; padding: 5px; background: #f9f9f9;
        }
    `;
    document.head.appendChild(style);

    // === DOM 构建 ===
    const fab = document.createElement('div');
    fab.id = 'pm-fab';
    fab.innerText = "Pixiv DL";
    document.body.appendChild(fab);

    const modal = document.createElement('div');
    modal.id = 'pm-modal';
    modal.innerHTML = `
        <div class="pm-window">
            <div class="pm-header">
                <div class="pm-title">Pixiv 下载管理器 v5.1 <small style="font-size:12px; color:#999" id="author-display"></small></div>
                <div class="pm-close">&times;</div>
            </div>

            <div class="pm-toolbar">
                <div class="pm-group">
                    <span class="pm-label">筛选:</span>
                    <button class="pm-btn active" id="filter-all">全部</button>
                    <button class="pm-btn" id="filter-illust">插画/漫画</button>
                    <button class="pm-btn" id="filter-ugoira">动图</button>
                </div>
                <div class="pm-group">
                    <span class="pm-label">选择:</span>
                    <button class="pm-btn" id="btn-sel-all">全选</button>
                    <button class="pm-btn" id="btn-sel-new">未下载</button>
                    <button class="pm-btn" id="btn-sel-none">取消</button>
                </div>
                <div class="pm-group" style="flex:1; justify-content:flex-end; border:none;">
                     <button class="pm-btn btn-danger" id="btn-stop" style="display:none">停止下载</button>
                     <button class="pm-btn btn-primary" id="btn-dl">开始下载 (<span id="sel-count">0</span>)</button>
                </div>
            </div>

            <div class="pm-content">
                <div class="pm-grid" id="pm-list"></div>
            </div>

            <div class="pm-footer">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                    <span id="progress-text">等待任务...</span>
                    <span id="total-status">已加载: 0</span>
                </div>
                <div class="progress-wrap"><div class="progress-bar" id="main-progress"></div></div>
                <div class="console-log" id="pm-console">欢迎使用 Pixiv Manager v5.1</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // === 逻辑引用 ===
    const listDiv = document.getElementById('pm-list');
    const consoleDiv = document.getElementById('pm-console');
    const selCountSpan = document.getElementById('sel-count');
    const mainProgress = document.getElementById('main-progress');
    const progressText = document.getElementById('progress-text');

    // === 事件 ===
    fab.onclick = openModal;
    modal.querySelector('.pm-close').onclick = () => modal.style.display = 'none';

    // 筛选按钮
    ['all', 'illust', 'ugoira'].forEach(type => {
        document.getElementById(`filter-${type}`).onclick = (e) => {
            state.filter = type;
            document.querySelectorAll('.pm-group button').forEach(b => {
                if(b.id.startsWith('filter-')) b.classList.remove('active');
            });
            e.target.classList.add('active');
            renderGrid(); // 重新渲染
        };
    });

    // 选择按钮
    document.getElementById('btn-sel-all').onclick = () => selectCards(() => true);
    document.getElementById('btn-sel-none').onclick = () => selectCards(() => false);
    document.getElementById('btn-sel-new').onclick = () => selectCards((id) => !state.downloadedIds.has(id));

    // 下载控制
    document.getElementById('btn-dl').onclick = startBatchDownload;
    document.getElementById('btn-stop').onclick = () => { state.stopFlag = true; log("用户请求停止..."); };

    // === 核心功能 ===

    async function openModal() {
        modal.style.display = 'flex';
        loadHistory();

        // 增强的作者名获取
        const h1 = document.querySelector('h1');
        if(h1) {
            state.authorName = h1.innerText;
        } else {
            const titleMatch = document.title.match(/^(.+?)\s-\s/);
            if (titleMatch) state.authorName = titleMatch[1];
        }

        document.getElementById('author-display').innerText = ` - ${state.authorName} (ID: ${state.userId})`;

        if (state.allIds.length === 0) {
            await fetchAllWorks();
        }
    }

    function log(msg) {
        const time = new Date().toLocaleTimeString();
        consoleDiv.innerHTML = `[${time}] ${msg}<br>` + consoleDiv.innerHTML;
    }

    // 1. 获取 ID 列表 (倒序)
    async function fetchAllWorks() {
        if(state.isFetching) return;
        state.isFetching = true;
        log("正在获取作品索引...");

        try {
            const res = await apiGet(`https://www.pixiv.net/ajax/user/${state.userId}/profile/all`);
            const illusts = res.illusts ? Object.keys(res.illusts) : [];
            const manga = res.manga ? Object.keys(res.manga) : [];

            state.allIds = illusts.concat(manga).sort((a, b) => b - a);

            document.getElementById('total-status').innerText = `总作品数: ${state.allIds.length}`;
            log(`索引获取成功，共 ${state.allIds.length} 个作品。开始获取详情...`);

            await fetchDetailsLoop();

        } catch (e) {
            log("❌ 索引获取失败: " + e);
        } finally {
            state.isFetching = false;
        }
    }

    // 2. 分批获取详情
    async function fetchDetailsLoop() {
        const ids = state.allIds;
        let loaded = 0;

        for (let i = 0; i < ids.length; i += CONFIG.chunkSize) {
            const chunk = ids.slice(i, i + CONFIG.chunkSize);
            const query = chunk.map(id => `ids[]=${id}`).join('&');

            try {
                const url = `https://www.pixiv.net/ajax/user/${state.userId}/profile/illusts?${query}&work_category=illustManga&is_first_page=0`;
                const res = await apiGet(url);
                const works = res.works;

                if (works) {
                    Object.values(works).forEach(w => {
                        if(w && w.id) state.worksMap[w.id] = w;
                    });
                }

                loaded += chunk.length;
                document.getElementById('total-status').innerText = `已加载详情: ${loaded}/${ids.length}`;
                renderGrid(); // 实时渲染

            } catch(e) { console.error(e); }

            await sleep(CONFIG.reqDelay);
        }
        log("所有详情加载完毕。");
        document.getElementById('btn-sel-new').click();
    }

    // 3. 渲染网格
    function renderGrid() {
        listDiv.innerHTML = '';
        const ids = state.allIds;

        let displayCount = 0;

        ids.forEach(id => {
            const work = state.worksMap[id];
            if (!work) return;

            const type = parseInt(work.illustType);
            if (state.filter === 'illust' && type === 2) return;
            if (state.filter === 'ugoira' && type !== 2) return;

            displayCount++;

            const card = document.createElement('div');
            card.className = 'pm-card';
            card.dataset.id = id;
            card.id = `card-${id}`;

            const isDownloaded = state.downloadedIds.has(id);
            const isUgoira = (type === 2);

            let overlayHtml = '';
            if(isDownloaded) {
                overlayHtml = `<div class="card-overlay status-downloaded" style="display:flex"><span>✅ 已下载</span></div>`;
                card.classList.add('downloaded');
            } else {
                overlayHtml = `<div class="card-overlay" id="overlay-${id}"></div>`;
            }

            card.innerHTML = `
                ${overlayHtml}
                <img class="card-thumb" src="${work.url}" loading="lazy">
                <div class="card-body">
                    <div class="card-title" title="${work.title}">${work.title}</div>
                    <div class="card-meta">
                        ${isUgoira ? '<span class="card-badge badge-ugoira">动图</span>' : '<span class="card-badge">图集</span>'}
                        <span class="card-badge">${work.pageCount}P</span>
                    </div>
                </div>
            `;

            card.onclick = (e) => {
                if(card.classList.contains('failed')) {
                    card.classList.remove('failed');
                    card.classList.add('selected');
                    updateSelCount();
                    return;
                }
                card.classList.toggle('selected');
                updateSelCount();
            };

            listDiv.appendChild(card);
        });
    }

    function updateSelCount() {
        const c = document.querySelectorAll('.pm-card.selected').length;
        selCountSpan.innerText = c;
    }

    function selectCards(fn) {
        document.querySelectorAll('.pm-card').forEach(card => {
            if(card.querySelector('.status-downloading')) return;
            const id = card.dataset.id;
            if(fn(id)) card.classList.add('selected');
            else card.classList.remove('selected');
        });
        updateSelCount();
    }

    // 4. 批量下载核心 (包含文件夹修复)
    async function startBatchDownload() {
        const selected = document.querySelectorAll('.pm-card.selected');
        if (selected.length === 0) return alert("未选择任何作品");

        state.stopFlag = false;
        document.getElementById('btn-stop').style.display = 'inline-block';
        document.getElementById('btn-dl').style.display = 'none';

        const total = selected.length;
        let successCount = 0;
        let failCount = 0;

        // === 文件夹命名净化 ===
        let cleanName = state.authorName.replace(/[\\/:*?"<>|]/g, '_'); // 替换非法字符
        cleanName = cleanName.replace(/[\x00-\x1f\x80-\x9f]/g, '');   // 去除控制字符
        cleanName = cleanName.trim().replace(/[. ]+$/, '');             // 去除尾部点和空格
        if (!cleanName) cleanName = "pixiv_user";

        const folderName = `${cleanName}_${state.userId}`;

        log(`🚀 开始任务: 共 ${total} 个作品，保存至 [Downloads/${folderName}]`);

        // 遍历选中的卡片
        for (let i = 0; i < total; i++) {
            if (state.stopFlag) {
                log("🛑 任务已手动停止");
                break;
            }

            const card = selected[i];
            const id = card.dataset.id;

            card.classList.remove('selected');
            const overlay = document.getElementById(`overlay-${id}`);
            overlay.className = 'card-overlay status-downloading';
            overlay.style.display = 'flex';
            overlay.innerHTML = `<span class="spinner">⏳</span><span style="margin-top:5px; font-size:10px">准备中...</span>`;

            const pct = ((i) / total) * 100;
            mainProgress.style.width = `${pct}%`;
            progressText.innerText = `正在处理: ${i + 1} / ${total}`;

            try {
                const tasks = await getDownloadTasks(id);
                const taskTotal = tasks.length;

                for (let j = 0; j < taskTotal; j++) {
                    if (state.stopFlag) throw new Error("Stopped");

                    const task = tasks[j];
                    // 构造子文件夹路径
                    const filename = `${folderName}/${id}${task.suffix}`;

                    overlay.innerHTML = `<span>⏳ 下载中</span><span style="font-size:10px">${j+1}/${taskTotal}</span>`;
                    log(`--> [${id}] 下载文件: ${task.suffix}`);

                    // 调用重写后的下载函数
                    await downloadSingleFile(task.url, filename);
                    await sleep(CONFIG.delay);
                }

                overlay.className = 'card-overlay status-downloaded';
                overlay.innerHTML = `<span>✅ 成功</span>`;
                card.classList.add('downloaded');
                saveHistory(id);
                successCount++;

            } catch (err) {
                console.error(err);
                log(`❌ [${id}] 下载失败: ${err.message || err}`);
                overlay.className = 'card-overlay status-failed';
                overlay.innerHTML = `<span>❌ 失败</span><span style="font-size:10px">点击重试</span>`;
                card.classList.add('failed');
                failCount++;
            }
        }

        mainProgress.style.width = '100%';
        progressText.innerText = `任务结束. 成功: ${successCount}, 失败: ${failCount}`;
        document.getElementById('btn-stop').style.display = 'none';
        document.getElementById('btn-dl').style.display = 'inline-block';

        if(!state.stopFlag) alert(`下载完成！
成功: ${successCount}
失败: ${failCount}`);
    }

    // 获取下载任务
    async function getDownloadTasks(id) {
        let type = 0;
        if(state.worksMap[id]) type = parseInt(state.worksMap[id].illustType);
        else {
            const info = await apiGet(`https://www.pixiv.net/ajax/illust/${id}`);
            type = parseInt(info.illustType);
        }

        const tasks = [];
        if (type === 2) {
            const meta = await apiGet(`https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`);
            tasks.push({ url: meta.originalSrc, suffix: '_ugoira.zip' });
        } else {
            const pages = await apiGet(`https://www.pixiv.net/ajax/illust/${id}/pages`);
            pages.forEach((p, idx) => {
                const ext = p.urls.original.split('.').pop();
                tasks.push({ url: p.urls.original, suffix: `_p${idx}.${ext}` });
            });
        }
        return tasks;
    }

    // === 重要修复：先获取Blob再保存 (绕过Referer限制) ===
    function downloadSingleFile(url, name) {
        return new Promise((resolve, reject) => {
            // 1. 使用 XHR 获取数据 (带 Referer)
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Referer': 'https://www.pixiv.net/'
                },
                responseType: 'blob',
                onload: (res) => {
                    if (res.status === 200) {
                        // 2. 创建 Blob URL
                        const blobUrl = URL.createObjectURL(res.response);
                        // 3. 调用 GM_download 保存 (通过本地Blob绕过浏览器API的Header限制)
                        GM_download({
                            url: blobUrl,
                            name: name,
                            onload: () => {
                                URL.revokeObjectURL(blobUrl); // 释放内存
                                resolve();
                            },
                            onerror: (err) => {
                                URL.revokeObjectURL(blobUrl);
                                reject("Write Error: " + (err.error || "Unknown"));
                            },
                            ontimeout: () => reject("Write Timeout")
                        });
                    } else {
                        reject(`Network Error: ${res.status}`);
                    }
                },
                onerror: (err) => reject("Network Connect Error"),
                ontimeout: () => reject("Network Timeout")
            });
        });
    }

    // 工具函数
    function apiGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                headers: { 'Referer': 'https://www.pixiv.net/' }, // API 请求也加上 Header 以防万一
                onload: (res) => {
                    try {
                        const d = JSON.parse(res.responseText);
                        if(d.error) reject(d.message);
                        else resolve(d.body);
                    } catch(e) { reject("Json Parse Error"); }
                },
                onerror: reject
            });
        });
    }
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

})();
