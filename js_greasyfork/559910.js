// ==UserScript==
// @name         M3U8/bilibili 视频嗅探下载 + MediaGo 投喂器
// @version      2.5.6
// @description  强力视频嗅探与投喂：自动抓取 M3U8 及 B 站资源，一键投喂至 MediaGo（支持 Docker 与本地版）全画质彩色标注，支持域名自动归类文件夹、智能路径去重及防重名命名系统。保留原始长链接，提供动态投喂状态反馈，让视频资源整理从此整整齐齐。
// @author       zhecydn
// @match        *://*/*
// @allframes    true
// @run-at       document-start
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://blog.zhecydn.asia/
// @downloadURL https://update.greasyfork.org/scripts/559910/M3U8bilibili%20%E8%A7%86%E9%A2%91%E5%97%85%E6%8E%A2%E4%B8%8B%E8%BD%BD%20%2B%20MediaGo%20%E6%8A%95%E5%96%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559910/M3U8bilibili%20%E8%A7%86%E9%A2%91%E5%97%85%E6%8E%A2%E4%B8%8B%E8%BD%BD%20%2B%20MediaGo%20%E6%8A%95%E5%96%82%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 变量与内存金库 (地基 2.4.6) ---
    let MEDIAGO_URL = GM_getValue('mediago_url', '');
    let theme = GM_getValue('theme', 'dark');
    let mode = GM_getValue('mode', 'api');
    let target = GM_getValue('target', 'nas');
    let folderType = GM_getValue('folder_type', 'domain');
    let counter = GM_getValue('counter', {});
    let isMinimized = GM_getValue('is_minimized', false);
    let savedPos = GM_getValue('panel_pos', { top: '20px', left: 'auto', right: '20px' });

    let detectedUrls = new Set();
    let memoryVault = [];
    let panel = null;
    let gearIcon = null;

    const isBiliPage = location.hostname.includes('bilibili.com');

    // --- 2. 增强后台逻辑：过滤、去重与勋章 ---
    function getResTag(u) {
        u=u.toLowerCase();
        if(u.includes('8k') || u.includes('4320')) return '<span style="color:#ffa502;font-weight:bold;">[👑 8K]</span> ';
        if(u.includes('4k') || u.includes('2160')) return '<span style="color:#ff4757;font-weight:bold;">[💎 4K]</span> ';
        if(u.includes('1080') || u.includes('1920')) return '<span style="color:#e67e22;font-weight:bold;">[🔥 1080P]</span> ';
        if(u.includes('720')) return '<span style="color:#2ed573;font-weight:bold;">[🎬 720P]</span> ';
        if(u.includes('480')) return '<span style="color:#2980b9;font-weight:bold;">[📺 480P]</span> ';
        return '';
    }

    function addUrl(url, customTitle = null, isBiliBatch = false) {
        if (typeof url !== 'string') return;

        // 【智能引擎增强】：路径指纹去重（忽略随机参数）
        const fingerprint = url.split('?')[0];
        if (detectedUrls.has(fingerprint)) return;

        if (!isBiliBatch && !/\.m3u8(\?|$)/i.test(url)) return;

        // 【智能引擎增强】：过滤无效碎片（通常分片链接长且含 fragment 字样）
        if (!isBiliBatch && url.includes('fragment') && (url.includes('.ts') || url.includes('seg-'))) return;

        if (window.self !== window.top) {
            window.top.postMessage({ type: 'VIDEO_MSG_V256', url, customTitle, isBiliBatch }, '*');
            return;
        }

        detectedUrls.add(fingerprint);
        memoryVault.push({ url, customTitle, isBiliBatch });

        if (!panel && !isMinimized) createPanel();
        if (panel) renderSingleItem({ url, customTitle, isBiliBatch });
    }

    function renderSingleItem(item) {
        const list = document.getElementById('m3u8-list');
        if (!list) return;
        const li = document.createElement('li');
        li.className = 'm3u8-item';
        let tag = item.isBiliBatch ? '<span style="color:#fb7299;font-weight:bold;">[🎬 选集]</span> ' : getResTag(item.url);

        // 【核心地基】长链接显示逻辑
        const name = item.customTitle ? `${tag}${item.customTitle}` : `${tag}${item.url.split('?')[0].substring(0, 55)}...`;

        li.innerHTML = `<input type="checkbox" class="checkbox" data-url="${item.url}" data-title="${item.customTitle || ''}"><div class="url-content"><div class="url-text" title="${item.url}">${name}</div><button class="single-send">${target==='nas'?'投喂docker':'投喂本地'}</button></div>`;
        li.onclick = (e) => { if (e.target.tagName !== 'BUTTON') { const cb = li.querySelector('.checkbox'); cb.checked = !cb.checked; li.classList.toggle('selected', cb.checked); isBiliPage ? updateBiliBtnText() : updateBatchBtnText(); } };
        list.prepend(li);
        li.querySelector('.single-send').onclick = (e) => { e.stopPropagation(); sendTask(item.url, e.target, item.customTitle, item.isBiliBatch); };
    }

    // --- 3. UI 物理隔离切换 (100% 2.4.6 原始 CSS 与布局) ---
    function createPanel() {
        if (document.getElementById('mediago-panel')) return;
        if (gearIcon) { gearIcon.remove(); gearIcon = null; }

        panel = document.createElement('div');
        panel.id = 'mediago-panel';
        panel.className = theme;
        applyPos(panel);
        panel.innerHTML = `
            <div id="p-header"><span id="min-btn" style="cursor:pointer;margin-right:8px;">➖</span>🔍 m3u8资源嗅探器 <span id="theme-toggle" style="float:right;cursor:pointer;margin-left:12px;">🌓</span><span id="set-btn" style="float:right;cursor:pointer;">⚙️</span></div>
            <div class="top-bar">
                <button id="sel-all">全选</button>
                ${isBiliPage ? '<button id="scan-bili" style="background:#e67e22 !important;">🔍 扫描可见选集</button><button id="bili-main-btn" style="background:#fb7299 !important;">🚀 投喂b站直链</button>' : '<button id="batch-btn" style="background:#fd7e14 !important;">🚀 一键投喂</button>'}
            </div>
            <ul id="m3u8-list"></ul>
            <div id="p-footer">
                <div class="ctrl-row">目标: <label><input type="radio" name="target" value="nas" ${target==='nas'?'checked':''}> docker</label> <label><input type="radio" name="target" value="local" ${target==='local'?'checked':''}> 本地</label> <span style="margin:0 5px;opacity:0.3">|</span> 模式: <label><input type="radio" name="mode" value="api" ${mode==='api'?'checked':''}> API</label> <label><input type="radio" name="mode" value="url" ${mode==='url'?'checked':''}> URL</label></div>
                <div class="ctrl-row">归类: <label><input type="radio" name="folder" value="domain" ${folderType==='domain'?'checked':''}> 域名文件夹</label> <label><input type="radio" name="folder" value="default" ${folderType==='default'?'checked':''}> 默认根目录</label></div>
                <div class="tutorial-box"><a href="https://blog.zhecydn.asia/archives/1962" target="_blank" class="mg-blog-link" style="font-size:12px !important;">📖 脚本使用教程</a></div>
            </div>`;
        (document.body || document.documentElement).appendChild(panel);
        memoryVault.forEach(item => renderSingleItem(item));
        setupEvents(panel);
    }

    function createGear() {
        if (document.getElementById('mediago-gear')) return;
        if (panel) { panel.remove(); panel = null; }
        gearIcon = document.createElement('div');
        gearIcon.id = 'mediago-gear';
        gearIcon.innerHTML = '⚙️';
        applyPos(gearIcon);
        (document.body || document.documentElement).appendChild(gearIcon);
        setupEvents(gearIcon);
    }

    function toggleMin(toMin) {
        isMinimized = toMin;
        GM_setValue('is_minimized', isMinimized);
        if (isMinimized) createGear(); else createPanel();
    }

    // --- 4. 投喂逻辑 (稳健算法增强 + 动态反馈) ---
    function sendTask(url, btn, customName = null, forceBili = false) {
        const isBili = forceBili || url.includes('bilibili.com');
        const finalType = isBili ? 'bilibili' : 'm3u8';

        // 【内功增强】：稳健命名算法，彻底杜绝 NAS 覆盖
        let base = (customName || document.title).replace(/[\\/:\*\?"<>\|]/g, "_").trim();
        if(!counter[base]) counter[base] = 0; counter[base]++;
        GM_setValue('counter', counter);
        const finalName = `${base.substring(0,30)}_${counter[base]}_${new Date().getTime().toString().slice(-4)}`;

        const folder = folderType === 'domain' ? location.hostname.split('.')[0] : '';
        const encodedName = encodeURIComponent(finalName), encodedUrl = encodeURIComponent(url);
        const folderParam = folder ? `&folder=${encodeURIComponent(folder)}` : '';

        // 【反馈增强】：三态动态显示
        if (btn) {
            btn.innerText = "⏳ 投喂中...";
            btn.style.background = "#f1c40f"; // 黄色反馈
            btn.style.pointerEvents = "none";
        }

        const successAction = () => {
            if (btn) {
                btn.innerText = "✅ 已成功投喂";
                btn.style.background = "#27ae60"; // 绿色反馈
                btn.style.opacity = "0.7";
                setTimeout(() => {
                    btn.style.pointerEvents = "auto";
                    btn.style.background = "";
                    if(btn.id === 'bili-main-btn') updateBiliBtnText();
                    else if(btn.className.includes('single-send')) btn.innerText = target==='nas'?'投喂docker':'投喂本地';
                    else if(btn.id === 'batch-btn') updateBatchBtnText();
                }, 2000);
            }
        };

        if (target === 'local') {
            window.open(`mediago://index.html/?n=true&name=${encodedName}&url=${encodedUrl}&type=${finalType}&silent=true${folderParam}`, '_blank');
            successAction();
        } else {
            if (!MEDIAGO_URL) return alert('请先⚙️设置 mediago docker 地址');
            if (mode === 'api') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MEDIAGO_URL}/api/download-now`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ name: finalName, url: url, type: finalType, folder: folder }),
                    onload: () => successAction(),
                    onerror: () => { if(btn) { btn.innerText = "❌ 失败"; btn.style.background = "#e74c3c"; btn.style.pointerEvents="auto"; } }
                });
            } else {
                window.open(`${MEDIAGO_URL}/?n=true&name=${encodedName}&url=${encodedUrl}&type=${finalType}&silent=true${folderParam}`, '_blank');
                successAction();
            }
        }
    }

    // --- 5. 其余辅助逻辑 ---
    function scanBili() {
        let count = 0;
        document.querySelectorAll('.imageListItem_wrap__o28QW, .video-pod__item').forEach(el => {
            const bv = el.getAttribute('data-key');
            const a = el.querySelector('a');
            if (bv) { addUrl(`https://www.bilibili.com/video/${bv}`, el.querySelector('.title')?.innerText.trim(), true); count++; }
            else if (a) { addUrl(new URL(a.getAttribute('href'), location.href).href, el.querySelector('.imageListItem_titleWrap__YTlLH')?.getAttribute('title'), true); count++; }
        });
        if (count > 0) updateBiliBtnText();
        else alert("雷达空空如也...这好像是个单集视频哦，直接投喂即可！🧐");
    }

    function applyPos(el) { el.style.top = savedPos.top; el.style.left = savedPos.left; el.style.right = savedPos.right; }
    function updateBiliBtnText() { const btn=document.getElementById('bili-main-btn'); if(btn){ const n=panel.querySelectorAll('.checkbox:checked').length; btn.innerText=n>0?`🚀 投喂 ${n} 个` : `🚀 投喂b站直链`; } }
    function updateBatchBtnText() { const btn=document.getElementById('batch-btn'); if(btn){ const n=panel.querySelectorAll('.checkbox:checked').length; btn.innerText=n>0?`🚀 投喂 ${n} 个` : `🚀 一键投喂`; } }

    function setupEvents(el) {
        if (el.id === 'mediago-panel') {
            document.getElementById('min-btn').onclick = () => toggleMin(true);
            document.getElementById('theme-toggle').onclick = () => { theme=(theme==='dark'?'light':'dark'); GM_setValue('theme', theme); panel.className=theme; };
            document.getElementById('set-btn').onclick = () => { let u=prompt('mediago docker地址:', MEDIAGO_URL); if(u){ MEDIAGO_URL=u.trim().replace(/\/+$/, ''); GM_setValue('mediago_url', MEDIAGO_URL); } };
            if(isBiliPage) {
                document.getElementById('scan-bili').onclick = scanBili;
                document.getElementById('bili-main-btn').onclick = function() {
                    const checked = panel.querySelectorAll('.checkbox:checked');
                    if(checked.length) checked.forEach((cb, i) => setTimeout(() => sendTask(cb.dataset.url, this, cb.dataset.title, true), i*1000));
                    else sendTask(location.href.split('?')[0], this, document.title.split('_')[0]);
                };
            } else {
                document.getElementById('batch-btn').onclick = function() {
                    const checked = panel.querySelectorAll('.checkbox:checked');
                    if(checked.length) {
                        const p = prompt(`🚀 一键投喂:`, document.title);
                        if(p) checked.forEach((cb, i) => setTimeout(() => sendTask(cb.dataset.url, this, `${p}_${i+1}`), i*800));
                    }
                };
            }
            document.getElementById('sel-all').onclick = () => { const cbs=panel.querySelectorAll('.checkbox'), all=Array.from(cbs).every(c=>c.checked); cbs.forEach(c=>{ c.checked=!all; c.closest('.m3u8-item').classList.toggle('selected', !all); }); isBiliPage?updateBiliBtnText():updateBatchBtnText(); };
            panel.querySelectorAll('input[name="target"]').forEach(r => r.onchange = e => { target=e.target.value; GM_setValue('target', target); updateBtnLabels(); });
            panel.querySelectorAll('input[name="mode"]').forEach(r => r.onchange = e => { mode=e.target.value; GM_setValue('mode', mode); });
            panel.querySelectorAll('input[name="folder"]').forEach(r => r.onchange = e => { folderType=e.target.value; GM_setValue('folder_type', folderType); });
        } else { el.onclick = () => { if(el.dataset.dragged!=='true') toggleMin(false); }; }

        let isDrag = false, ox, oy;
        const dragHeader = el.id==='mediago-panel'?document.getElementById('p-header'):el;
        dragHeader.onmousedown = e => { if(e.target.tagName==='SPAN') return; isDrag=true; el.dataset.dragged='false'; ox=e.clientX-el.offsetLeft; oy=e.clientY-el.offsetTop; };
        document.onmousemove = e => { if(isDrag){ el.dataset.dragged='true'; let nx=(e.clientX-ox)+'px', ny=(e.clientY-oy)+'px'; el.style.left=nx; el.style.top=ny; el.style.right='auto'; savedPos={top:ny, left:nx, right:'auto'}; }};
        document.onmouseup = () => { if(isDrag){ isDrag=false; GM_setValue('panel_pos', savedPos); }};
    }

    function updateBtnLabels() { document.querySelectorAll('.single-send').forEach(b => b.innerText = target==='nas'?'投喂docker':'投喂本地'); }

    GM_addStyle(`
        #mediago-panel { position: fixed !important; width: 380px !important; z-index: 2147483647 !important; border-radius: 12px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important; display: flex !important; flex-direction: column !important; padding: 10px !important; font-family: sans-serif !important; border: 1px solid rgba(128,128,128,0.3) !important; font-size: 13px !important; }
        #mediago-panel.dark { background: rgba(30,30,30,0.95) !important; color: #fff !important; }
        #mediago-panel.light { background: rgba(255,255,255,0.98) !important; color: #111 !important; }
        #mediago-gear { position: fixed !important; width: 42px !important; height: 42px !important; background: rgba(30,30,30,0.9) !important; color: #fb7299 !important; border-radius: 50% !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; font-size: 24px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important; border: 1px solid rgba(251,114,153,0.4) !important; }
        #p-header { cursor: move !important; padding: 8px !important; background: rgba(128,128,128,0.2) !important; border-radius: 8px !important; font-weight: bold !important; font-size: 13px !important; margin-bottom: 6px !important; }
        .top-bar { display: flex !important; gap: 4px !important; margin-bottom: 8px !important; }
        .top-bar button { flex: 1 !important; padding: 6px 2px !important; border: none !important; border-radius: 6px !important; cursor: pointer !important; font-size: 11px !important; font-weight: bold !important; color: #fff !important; background: #555 !important; }
        #m3u8-list { list-style: none !important; padding: 0 !important; margin: 0 !important; overflow-y: auto !important; flex: 1 !important; max-height: 350px !important; }
        .m3u8-item { display: flex !important; align-items: center !important; padding: 8px !important; background: rgba(128,128,128,0.1) !important; margin-bottom: 4px !important; border-radius: 8px !important; cursor: pointer !important; border-left: 4px solid #a55eea !important; transition: 0.2s !important; }
        .m3u8-item.selected { background: rgba(165, 94, 234, 0.15) !important; border-left-color: #00aeec !important; }
        .checkbox { margin-right: 8px !important; width: 15px !important; height: 15px !important; }
        .url-text { font-size: 12px !important; word-break: break-all !important; line-height: 1.3 !important; }
        .single-send { width: 100% !important; background: #27ae60 !important; border: none !important; color: #fff !important; padding: 4px !important; border-radius: 5px !important; cursor: pointer !important; font-size: 11px !important; font-weight: bold !important; margin-top: 4px !important; transition: 0.2s !important; }
        #p-footer { border-top: 1px solid rgba(128,128,128,0.2) !important; padding-top: 8px !important; }
        .ctrl-row { display: flex !important; justify-content: center !important; align-items: center !important; gap: 6px !important; margin-bottom: 4px !important; font-size: 11px !important; }
        .tutorial-box { text-align: center !important; margin-top: 6px !important; padding-top: 4px !important; border-top: 1px dashed rgba(128,128,128,0.3) !important; }
        .mg-blog-link { color: #a55eea !important; text-decoration: none !important; font-size: 12px !important; font-weight: bold !important; }
    `);

    const oX = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(m, u) { try { addUrl(new URL(u, location.href).href); } catch(e){} return oX.apply(this, arguments); };
    const oF = window.fetch; window.fetch = function(r) { let u = typeof r === 'string' ? r : (r && r.url); if(u){ try { addUrl(new URL(u, location.href).href); } catch(e){} } return oF.apply(this, arguments); };
    if (isMinimized) createGear(); else createPanel();
    window.addEventListener('message', e => { if (e.data && e.data.type === 'VIDEO_MSG_V256') addUrl(e.data.url, e.data.customTitle, e.data.isBiliBatch); });
})();