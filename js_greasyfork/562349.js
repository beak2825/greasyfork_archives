// ==UserScript==
// @name         Pixiv Manager v6.2 (Toggle Selection)
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  Pixiv专业下载器：框选开关 + 自动转GIF + 标签筛选 + 状态过滤
// @author       魔蘑菇骨子
// @match        https://www.pixiv.net/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://unpkg.com/gif.js@0.2.0/dist/gif.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      pixiv.net
// @connect      i.pximg.net
// @connect      cdnjs.cloudflare.com/
// @connect      unpkg.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562349/Pixiv%20Manager%20v62%20%28Toggle%20Selection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562349/Pixiv%20Manager%20v62%20%28Toggle%20Selection%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const CONFIG = {
        chunkSize: 48,
        delay: 800,
        reqDelay: 350
    };

    // === GIF Worker ===
    const gifWorkerCode = `
    !function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){var n,r;n=i(1),r=function(t){var e,i,r,o;return e=new n(t.width,t.height),0===t.index?e.writeHeader():t.index+=e.outputBytes().length,i=e.analyzePixels(t.pixels),e.writeFrame(i,t.width,t.height,t.palette,t.delay),r=e.outputBytes(),o=e.outputBytes().length,0===t.index&&(t.index+=o),self.postMessage({index:t.index,data:r,length:o})},self.onmessage=function(t){return r(t.data)}},function(t,e){function i(t,e){this.width=t,this.height=e,this.data=new Uint8Array(t*e),this.index=0}i.prototype.writeHeader=function(){var t;return t=[],t.push(71,73,70,56,57,97),this.writeWord(t,this.width),this.writeWord(t,this.height),t.push(245,0,0),t.push(0,0,0),t},i.prototype.analyzePixels=function(t){var e,i,n,r,o,s,a,h,l,u,c,f,d,p,y,g,w,v,m,b,x,P,S,I,k,B;for(m=t.length,s=m/3,this.data=new Uint8Array(s),o=new Uint8Array(4096),a=[],h={},l=0,u=0,c=0,f=0,d=0,w=0,b=0,I=0;I<s;I++)p=t[I*3],y=t[I*3+1],g=t[I*3+2],v=I,x=p+"_"+y+"_"+g,l=I>0&&x===B?l:h[x],null!=l?this.data[I]=l:(null!=l?(o[0]=p,o[1]=y,o[2]=g,a.push(o),h[x]=c,this.data[I]=c,c++):(this.writeColor(a,o,u,p,y,g),h[x]=u,this.data[I]=u,u++),w+=p,b+=y,f+=g,d++),B=x;return this.palette=a,this.data},i.prototype.writeColor=function(t,e,i,n,r,o){return e[0]=n,e[1]=r,e[2]=o,t[i]=e},i.prototype.writeFrame=function(t,e,i,n,r){var o,s,a;return o=[],s=0,a=0,o.push(33,249,4,5,r&255,r>>8&255,0,0),o.push(44,0,0,0,0),this.writeWord(o,e),this.writeWord(o,i),o.push(0,8),this.lzwEncode(o,t,n),o.push(0,59),o},i.prototype.writeWord=function(t,e){return t.push(e&255),t.push(e>>8&255)},i.prototype.lzwEncode=function(t,e,i){var n,r,o,s,a,h,l,u,c,f,d,p,y,g,w,v,m;for(o=2,s=1<<o,a=s+1,h=s+2,l=h,d={},p=0,y=String(p),g=0,w=e.length;g<w;g++)v=e[g],m=y+"_"+v,d[m]?(p=d[m],y=String(p)):(this.writeBits(t,p,o),p=v,y=String(v),d[m]=h++,h>=1<<o&&o<12&&o++);return this.writeBits(t,p,o),this.writeBits(t,a,o)},i.prototype.writeBits=function(t,e,i){var n,r;for(n=e,r=0;r<i;r++)t.push(n&1),n>>=1},t.exports=i}]);
    `;
    const workerBlob = new Blob([gifWorkerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);

    // === 状态管理 ===
    const state = {
        userId: null,
        authorName: "Unknown",
        worksMap: {},
        allIds: [],
        tagCounts: {},
        selectedTags: new Set(),
        downloadedIds: new Set(),
        filterType: 'all',
        filterStatus: 'all',
        isFetching: false,
        stopFlag: false,
        // 框选相关
        dragMode: false, // 框选开关
        isSelecting: false,
        startX: 0,
        startY: 0,
        initialSelection: new Set()
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
        #pm-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: #0096fa; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; z-index: 9990; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; transition: transform 0.2s; }
        #pm-fab:hover { transform: scale(1.1); }
        #pm-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); z-index: 9999; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif; }
        .pm-window { width: 1100px; max-width: 95%; height: 90%; background: #fdfdfd; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .pm-header { padding: 12px 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .pm-title { font-size: 18px; font-weight: bold; color: #333; }
        .pm-toolbar { padding: 10px 20px; background: #f8f9fa; border-bottom: 1px solid #eee; display: flex; flex-direction: column; gap: 8px; }
        .pm-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .pm-group { display: flex; gap: 5px; padding-right: 15px; border-right: 1px solid #ddd; align-items: center; }
        .pm-btn { padding: 4px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; background: #fff; color: #333; transition: all 0.2s; }
        .pm-btn:hover { background: #eee; }
        .pm-btn.active { background: #0096fa; color: white; border-color: #0085de; }
        .btn-primary { background: #0096fa; color: white; border: none; font-weight: bold; padding: 5px 15px; font-size: 13px; }
        .btn-danger { background: #fff; color: #dc3545; border-color: #dc3545; }
        .btn-danger:hover { background: #dc3545; color: white; }

        .pm-tags-box { max-height: 0; overflow: hidden; transition: max-height 0.3s; background: #fff; border-bottom: 1px solid #eee; padding: 0 20px; }
        .pm-tags-box.open { max-height: 120px; padding: 10px 20px; overflow-y: auto; }
        .tag-item { display: inline-block; font-size: 11px; padding: 2px 6px; border-radius: 10px; background: #eee; margin: 0 4px 4px 0; cursor: pointer; color: #555; }
        .tag-item.active { background: #0096fa; color: white; }

        .pm-content { flex: 1; overflow-y: auto; padding: 20px; background: #f0f2f5; position: relative; user-select: none; }
        .pm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }

        .pm-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; cursor: pointer; transition: 0.1s; border: 2px solid transparent; height: 210px; display: flex; flex-direction: column; }
        .pm-card:hover { transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .pm-card.selected { border-color: #0096fa; background: #e6f3ff; }
        .card-thumb { width: 100%; height: 130px; object-fit: cover; background: #eee; }
        .card-body { padding: 6px; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 11px; font-weight: bold; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; color: #333; }
        .card-meta { margin-top: auto; display: flex; justify-content: space-between; align-items: center;}
        .card-badge { font-size: 10px; padding: 1px 4px; border-radius: 3px; background: #eee; color: #555; }
        .badge-ugoira { background: #ffebed; color: #ff4060; border: 1px solid #ffccd2; }

        .card-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.7); display: none; flex-direction: column; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; z-index: 5; }
        .status-downloaded { color: #28a745; display: flex; }
        .status-downloading { color: #0096fa; display: flex; background: rgba(255,255,255,0.95); }
        .status-failed { color: #dc3545; display: flex; background: rgba(255,235,235,0.9); }

        .pm-footer { background: #fff; border-top: 1px solid #eee; padding: 10px 20px; }
        .progress-info { display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px; font-weight: 700; color: #222; }
        .progress-wrap { height: 14px; background: #ddd; border-radius: 7px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar { height: 100%; background: #28a745; width: 0%; transition: width 0.2s; }
        .console-log { height: 70px; overflow-y: auto; font-family: monospace; font-size: 11px; color: #333; border: 1px solid #ccc; padding: 5px; background: #f4f4f4; }

        #drag-select-box { position: absolute; background: rgba(0, 150, 250, 0.2); border: 1px solid rgba(0, 150, 250, 0.6); display: none; pointer-events: none; z-index: 999; }
    `;
    document.head.appendChild(style);

    // === DOM 构建 ===
    const fab = document.createElement('div');
    fab.id = 'pm-fab';
    fab.innerText = "DL Pro";
    document.body.appendChild(fab);

    const modal = document.createElement('div');
    modal.id = 'pm-modal';
    modal.innerHTML = `
        <div class="pm-window">
            <div class="pm-header">
                <div class="pm-title">Pixiv Manager v6.2 <small style="font-size:12px; color:#666" id="author-display"></small></div>
                <div class="pm-close" style="cursor:pointer; font-size:24px;">&times;</div>
            </div>
            <div class="pm-toolbar">
                <div class="pm-row">
                    <div class="pm-group">
                        <span style="font-size:12px;font-weight:bold;color:#444">类型:</span>
                        <button class="pm-btn active" id="f-type-all">全部</button>
                        <button class="pm-btn" id="f-type-illust">插画/漫画</button>
                        <button class="pm-btn" id="f-type-ugoira">动图(GIF)</button>
                    </div>
                    <div class="pm-group">
                        <span style="font-size:12px;font-weight:bold;color:#444">状态:</span>
                        <button class="pm-btn active" id="f-status-all">全部</button>
                        <button class="pm-btn" id="f-status-dl">已下载</button>
                        <button class="pm-btn" id="f-status-new">未下载</button>
                    </div>
                    <div class="pm-group" style="border:none">
                         <button class="pm-btn" id="btn-toggle-tags">🏷️ 标签筛选 <span id="tag-sel-count"></span></button>
                    </div>
                </div>
                <div class="pm-row">
                    <div class="pm-group">
                        <span style="font-size:12px;font-weight:bold;color:#444">操作:</span>
                        <button class="pm-btn" id="btn-toggle-drag">🖱️ 框选模式: OFF</button>
                        <button class="pm-btn" id="btn-sel-all">全选</button>
                        <button class="pm-btn" id="btn-sel-new">选新图</button>
                        <button class="pm-btn" id="btn-sel-fail">选失败</button>
                        <button class="pm-btn" id="btn-sel-none">取消</button>
                    </div>
                    <div style="flex:1; text-align:right;">
                         <button class="pm-btn btn-danger" id="btn-stop" style="display:none">⏹ 停止</button>
                         <button class="pm-btn btn-primary" id="btn-dl">⬇ 开始下载 (<span id="sel-count">0</span>)</button>
                    </div>
                </div>
            </div>
            <div class="pm-tags-box" id="tag-panel"></div>
            <div class="pm-content" id="pm-content-area">
                <div id="drag-select-box"></div>
                <div class="pm-grid" id="pm-list"></div>
            </div>
            <div class="pm-footer">
                <div class="progress-info">
                    <span id="progress-text">等待任务...</span>
                    <span id="total-status">已加载: 0</span>
                </div>
                <div class="progress-wrap"><div class="progress-bar" id="main-progress"></div></div>
                <div class="console-log" id="pm-console">欢迎使用 v6.2。请点击【框选模式】按钮开启批量框选。</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const listDiv = document.getElementById('pm-list');
    const contentArea = document.getElementById('pm-content-area');
    const consoleDiv = document.getElementById('pm-console');
    const selCountSpan = document.getElementById('sel-count');
    const mainProgress = document.getElementById('main-progress');
    const progressText = document.getElementById('progress-text');
    const tagPanel = document.getElementById('tag-panel');
    const dragBox = document.getElementById('drag-select-box');
    const btnDrag = document.getElementById('btn-toggle-drag');

    // === 事件绑定 ===
    fab.onclick = openModal;
    modal.querySelector('.pm-close').onclick = () => modal.style.display = 'none';

    // 筛选
    bindFilterGroup('f-type-', ['all', 'illust', 'ugoira'], (val) => { state.filterType = val; renderGrid(); });
    bindFilterGroup('f-status-', ['all', 'dl', 'new'], (val) => { state.filterStatus = val; renderGrid(); });

    // 框选模式开关
    btnDrag.onclick = () => {
        state.dragMode = !state.dragMode;
        if(state.dragMode) {
            btnDrag.classList.add('active');
            btnDrag.innerText = "🖱️ 框选模式: ON";
            contentArea.style.cursor = "crosshair";
        } else {
            btnDrag.classList.remove('active');
            btnDrag.innerText = "🖱️ 框选模式: OFF";
            contentArea.style.cursor = "default";
        }
    };

    // 批量选择按钮
    document.getElementById('btn-sel-all').onclick = () => selectCards(() => true);
    document.getElementById('btn-sel-none').onclick = () => selectCards(() => false);
    document.getElementById('btn-sel-new').onclick = () => selectCards((id) => !state.downloadedIds.has(id));
    document.getElementById('btn-sel-fail').onclick = () => {
        document.querySelectorAll('.pm-card.failed').forEach(c => c.classList.add('selected'));
        updateSelCount();
    };

    document.getElementById('btn-toggle-tags').onclick = () => tagPanel.classList.toggle('open');
    document.getElementById('btn-dl').onclick = startBatchDownload;
    document.getElementById('btn-stop').onclick = () => { state.stopFlag = true; log("用户请求停止..."); };

    // === 核心逻辑 ===

    async function openModal() {
        modal.style.display = 'flex';
        loadHistory();

        if(state.authorName === "Unknown") {
            const h1 = document.querySelector('h1');
            if(h1) state.authorName = h1.innerText;
            else {
                const titleMatch = document.title.match(/^(.+?)\s-\s/);
                if (titleMatch) state.authorName = titleMatch[1];
            }
        }
        document.getElementById('author-display').innerText = ` - ${state.authorName} (ID: ${state.userId})`;

        initDragSelection();

        if (state.allIds.length === 0) {
            await fetchAllWorks();
        }
    }

    // === 数据获取 ===
    async function fetchAllWorks() {
        if(state.isFetching) return;
        state.isFetching = true;
        log("正在获取索引...");
        try {
            const res = await apiGet(`https://www.pixiv.net/ajax/user/${state.userId}/profile/all`);
            const illusts = res.illusts ? Object.keys(res.illusts) : [];
            const manga = res.manga ? Object.keys(res.manga) : [];
            state.allIds = illusts.concat(manga).sort((a, b) => b - a);
            document.getElementById('total-status').innerText = `总数: ${state.allIds.length}`;
            await fetchDetailsLoop();
        } catch (e) {
            log("❌ 索引失败: " + e);
        } finally {
            state.isFetching = false;
        }
    }

    async function fetchDetailsLoop() {
        const ids = state.allIds;
        let loaded = 0;
        for (let i = 0; i < ids.length; i += CONFIG.chunkSize) {
            const chunk = ids.slice(i, i + CONFIG.chunkSize);
            const query = chunk.map(id => `ids[]=${id}`).join('&');
            try {
                const url = `https://www.pixiv.net/ajax/user/${state.userId}/profile/illusts?${query}&work_category=illustManga&is_first_page=0`;
                const res = await apiGet(url);
                if (res.works) {
                    Object.values(res.works).forEach(w => {
                        if(w && w.id) {
                            state.worksMap[w.id] = w;
                            w.tags.forEach(t => state.tagCounts[t] = (state.tagCounts[t]||0)+1);
                        }
                    });
                }
                loaded += chunk.length;
                document.getElementById('total-status').innerText = `加载: ${loaded}/${ids.length}`;
                renderGrid();
                updateTagPanel();
            } catch(e) { console.error(e); }
            await sleep(CONFIG.reqDelay);
        }
        log("加载完毕。");
        document.getElementById('btn-sel-new').click();
    }

    // === 渲染与筛选 ===
    function updateTagPanel() {
        const sorted = Object.keys(state.tagCounts).sort((a,b) => state.tagCounts[b] - state.tagCounts[a]);
        tagPanel.innerHTML = sorted.map(t => {
            const act = state.selectedTags.has(t) ? 'active' : '';
            return `<span class="tag-item ${act}" data-tag="${t}">${t} <span style="font-size:9px;opacity:0.7">${state.tagCounts[t]}</span></span>`;
        }).join('');

        tagPanel.querySelectorAll('.tag-item').forEach(el => {
            el.onclick = () => {
                const t = el.dataset.tag;
                if(state.selectedTags.has(t)) state.selectedTags.delete(t);
                else state.selectedTags.add(t);
                updateTagPanel();
                renderGrid();
                const c = state.selectedTags.size;
                document.getElementById('tag-sel-count').innerText = c > 0 ? `(${c})` : '';
            };
        });
    }

    function renderGrid() {
        listDiv.innerHTML = '';
        state.allIds.forEach(id => {
            const work = state.worksMap[id];
            if (!work) return;

            const type = parseInt(work.illustType);
            const isDl = state.downloadedIds.has(id);
            const isUgoira = (type === 2);

            if (state.filterType === 'illust' && isUgoira) return;
            if (state.filterType === 'ugoira' && !isUgoira) return;
            if (state.filterStatus === 'dl' && !isDl) return;
            if (state.filterStatus === 'new' && isDl) return;

            if (state.selectedTags.size > 0) {
                const workTags = new Set(work.tags);
                for(let t of state.selectedTags) if(!workTags.has(t)) return;
            }
                        const card = document.createElement('div');
            card.className = 'pm-card';
            if(isDl) card.classList.add('downloaded');
            card.dataset.id = id;
            card.id = `card-${id}`;

            let overlay = '';
            if(isDl) overlay = `<div class="card-overlay status-downloaded" style="display:flex"><span>✅ 已下载</span></div>`;
            else overlay = `<div class="card-overlay" id="overlay-${id}"></div>`;

            card.innerHTML = `
                ${overlay}
                <img class="card-thumb" src="${work.url}" loading="lazy" draggable="false">
                <div class="card-body">
                    <div class="card-title" title="${work.title}">${work.title}</div>
                    <div class="card-meta">
                        ${isUgoira ? '<span class="card-badge badge-ugoira">动图</span>' : '<span class="card-badge">图集</span>'}
                        <span class="card-badge">${work.pageCount}P</span>
                    </div>
                </div>
            `;

            // 点击事件
            card.onclick = (e) => {
                // 如果处于框选模式，且发生了拖拽行为，不触发点击
                if(state.isSelecting) return;

                card.classList.toggle('selected');
                updateSelCount();
            };

            card.ondragstart = (e) => e.preventDefault();

            listDiv.appendChild(card);
        });
        updateSelCount();
    }

    // === 框选核心逻辑 (带开关) ===
    function initDragSelection() {
        contentArea.onmousedown = (e) => {
            // 只有开启了框选模式，才进行处理
            if (!state.dragMode) return;

            // 忽略滚动条上的点击
            if (e.target.closest('.pm-card') || e.offsetX > contentArea.clientWidth) return;

            e.preventDefault(); // 防止文字选中
            state.isSelecting = true;

            const rect = contentArea.getBoundingClientRect();
            state.startX = e.clientX - rect.left;
            state.startY = e.clientY - rect.top + contentArea.scrollTop;

            dragBox.style.left = state.startX + 'px';
            dragBox.style.top = state.startY + 'px';
            dragBox.style.width = '0px';
            dragBox.style.height = '0px';
            dragBox.style.display = 'block';

            state.initialSelection.clear();
            if(!e.shiftKey) {
                document.querySelectorAll('.pm-card.selected').forEach(c => c.classList.remove('selected'));
            } else {
                document.querySelectorAll('.pm-card.selected').forEach(c => state.initialSelection.add(c.dataset.id));
            }
        };

        contentArea.onmousemove = (e) => {
            if (!state.isSelecting || !state.dragMode) return;

            e.preventDefault();
            const rect = contentArea.getBoundingClientRect();
            const curX = e.clientX - rect.left;
            const curY = e.clientY - rect.top + contentArea.scrollTop;

            const left = Math.min(curX, state.startX);
            const top = Math.min(curY, state.startY);
            const width = Math.abs(curX - state.startX);
            const height = Math.abs(curY - state.startY);

            dragBox.style.left = left + 'px';
            dragBox.style.top = top + 'px';
            dragBox.style.width = width + 'px';
            dragBox.style.height = height + 'px';

            // 碰撞检测
            const cards = listDiv.children;
            for (let card of cards) {
                if(card.style.display === 'none') continue;

                const cLeft = card.offsetLeft;
                const cTop = card.offsetTop;
                const cRight = cLeft + card.offsetWidth;
                const cBottom = cTop + card.offsetHeight;

                const bRight = left + width;
                const bBottom = top + height;

                const isIntersect = !(left > cRight || bRight < cLeft || top > cBottom || bBottom < cTop);

                if (isIntersect) {
                    card.classList.add('selected');
                } else {
                    if(!state.initialSelection.has(card.dataset.id)) {
                        card.classList.remove('selected');
                    }
                }
            }
            updateSelCount();
        };

        const endSelection = () => {
            if (state.isSelecting) {
                state.isSelecting = false;
                dragBox.style.display = 'none';
            }
        };

        contentArea.onmouseup = endSelection;
        contentArea.onmouseleave = endSelection;
    }

    // === 下载逻辑 ===
    async function startBatchDownload() {
        const selected = document.querySelectorAll('.pm-card.selected');
        if (selected.length === 0) return alert("未选择任何作品");

        state.stopFlag = false;
        document.getElementById('btn-stop').style.display = 'inline-block';
        document.getElementById('btn-dl').style.display = 'none';

        let success = 0, fail = 0;
        const total = selected.length;

        let cleanName = state.authorName.replace(/[\\/:*?"<>|]/g, '_').trim() || "pixiv_user";
        const folderName = `${cleanName}_${state.userId}`;

        log(`🚀 开始任务: [Downloads/${folderName}]`);

        for (let i = 0; i < total; i++) {
            if (state.stopFlag) { log("⏹ 停止"); break; }

            const card = selected[i];
            const id = card.dataset.id;
            card.classList.remove('selected');

            const overlay = document.getElementById(`overlay-${id}`);
            overlay.className = 'card-overlay status-downloading';
            overlay.style.display = 'flex';

            mainProgress.style.width = `${((i)/total)*100}%`;
            progressText.innerText = `处理中 [${i+1}/${total}] ID:${id}`;

            try {
                const work = state.worksMap[id];
                const type = parseInt(work ? work.illustType : 0);

                if (type === 2) {
                    overlay.innerHTML = `<span>⚙️ 转GIF...</span>`;
                    await downloadUgoira(id, folderName, (p) => {
                        progressText.innerText = `转码中 [${id}]: ${p}%`;
                    });
                } else {
                    const tasks = await getIllustTasks(id);
                    for(let j=0; j<tasks.length; j++) {
                        if(state.stopFlag) throw new Error("Stopped");
                        const t = tasks[j];
                        progressText.innerText = `下载 [${j+1}/${tasks.length}]: ${t.suffix}`;
                        overlay.innerHTML = `<span>⏳ ${j+1}/${tasks.length}</span>`;
                        await downloadFile(t.url, `${folderName}/${id}${t.suffix}`);
                        await sleep(CONFIG.delay);
                    }
                }

                overlay.className = 'card-overlay status-downloaded';
                overlay.innerHTML = `<span>✅ 成功</span>`;
                card.classList.add('downloaded');
                saveHistory(id);
                success++;
            } catch (err) {
                console.error(err);
                log(`❌ [${id}] 错误: ${err.message||err}`);
                overlay.className = 'card-overlay status-failed';
                overlay.innerHTML = `<span>❌ 失败</span>`;
                card.classList.add('failed');
                fail++;
            }
        }
        mainProgress.style.width = '100%';
        progressText.innerText = `完成! 成功:${success} 失败:${fail}`;
        document.getElementById('btn-stop').style.display = 'none';
        document.getElementById('btn-dl').style.display = 'inline-block';
    }

    // === 下载辅助 ===
    async function getIllustTasks(id) {
        const pages = await apiGet(`https://www.pixiv.net/ajax/illust/${id}/pages`);
        return pages.map((p, idx) => ({
            url: p.urls.original,
            suffix: `_p${idx}.${p.urls.original.split('.').pop()}`
        }));
    }

    async function downloadUgoira(id, folder, onProgress) {
        const meta = await apiGet(`https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`);
        const zipBlob = await xhrGetBlob(meta.originalSrc);
        const zip = await JSZip.loadAsync(zipBlob);

        const gif = new GIF({ workers: 4, quality: 10, workerScript: workerUrl });

        const frames = meta.frames;
        for(let i=0; i<frames.length; i++) {
            const f = frames[i];
            const b64 = await zip.file(f.file).async("base64");
            const img = new Image();
            await new Promise(r => { img.onload=r; img.src = "data:image/jpeg;base64,"+b64; });
            gif.addFrame(img, {delay: f.delay});
            if(i%5===0) onProgress(Math.floor((i/frames.length)*40));
        }

        return new Promise((resolve, reject) => {
            gif.on('progress', p => onProgress(40 + Math.floor(p*60)));
            gif.on('finished', blob => {
                const u = URL.createObjectURL(blob);
                GM_download({
                    url: u, name: `${folder}/${id}_ugoira.gif`,
                    onload: () => { URL.revokeObjectURL(u); resolve(); },
                    onerror: reject
                });
            });
            gif.render();
        });
    }

    function downloadFile(url, name) {
        return new Promise((resolve, reject) => {
            xhrGetBlob(url).then(blob => {
                const u = URL.createObjectURL(blob);
                GM_download({
                    url: u, name: name,
                    onload: () => { URL.revokeObjectURL(u); resolve(); },
                    onerror: (e) => { URL.revokeObjectURL(u); reject("Save Error"); },
                    ontimeout: () => reject("Timeout")
                });
            }).catch(reject);
        });
    }

    function xhrGetBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url,
                headers: { 'Referer': 'https://www.pixiv.net/' },
                responseType: 'blob',
                onload: r => r.status===200 ? resolve(r.response) : reject(r.status),
                onerror: reject, ontimeout: reject
            });
        });
    }

    // === 工具 ===
    function bindFilterGroup(pre, arr, cb) {
        arr.forEach(v => {
            document.getElementById(pre+v).onclick = (e) => {
                arr.forEach(x => document.getElementById(pre+x).classList.remove('active'));
                e.target.classList.add('active');
                cb(v);
            };
        });
    }
    function updateSelCount() { selCountSpan.innerText = document.querySelectorAll('.pm-card.selected').length; }
    function selectCards(fn) {
        document.querySelectorAll('.pm-card').forEach(c => {
            if(c.style.display!=='none' && !c.querySelector('.status-downloading')) {
                if(fn(c.dataset.id)) c.classList.add('selected');
                else c.classList.remove('selected');
            }
        });
        updateSelCount();
    }
    function apiGet(url) {
        return new Promise((res, rej) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, headers: { 'Referer': 'https://www.pixiv.net/' },
                onload: r => { try { res(JSON.parse(r.responseText).body); } catch(e){ rej(e); } },
                onerror: rej
            });
        });
    }
    function log(m) { consoleDiv.innerHTML = `[${new Date().toLocaleTimeString()}] ${m}<br>` + consoleDiv.innerHTML; }
    const sleep = ms => new Promise(r => setTimeout(r, ms));

})();
