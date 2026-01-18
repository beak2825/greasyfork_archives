// ==UserScript==
// @name         B站下载助手 - 作者刘不行
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  左键点击卡片即可强制下载并重命名（视频标题-画质.mp4），文件大小超过20MB需要“右键-链接另存为”才能下载。
// @author       刘不行
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/562999/B%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20%E4%BD%9C%E8%80%85%E5%88%98%E4%B8%8D%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/562999/B%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20%E4%BD%9C%E8%80%85%E5%88%98%E4%B8%8D%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 0. 全局配置 ===
    const UI_CONFIG = {
        themeColor: '#00AEEC',
        accentColor: '#FF6699',
        panelWidth: '480px',
        zIndex: 999999
    };

    // === 1. 样式注入 (CSS) ===
    function injectStyles() {
        if (document.getElementById('bdl-style')) return;
        const css = `
            /* 全局字体重置 */
            .bdl-root, #bili-dl-panel * { 
                box-sizing: border-box; 
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Roboto, "Segoe UI", sans-serif; 
                font-weight: 400; 
            }
            
            /* === 悬浮球 === */
            #bili-dl-btn {
                position: fixed; top: 180px; left: 20px; z-index: ${UI_CONFIG.zIndex};
                width: 48px; height: 48px; background: ${UI_CONFIG.themeColor}; color: #fff;
                border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: transform 0.2s, background 0.2s, box-shadow 0.2s; user-select: none;
            }
            #bili-dl-btn:hover { transform: scale(1.1); background: #009CD6; box-shadow: 0 8px 20px rgba(0,174,236,0.3); }
            #bili-dl-btn:active { transform: scale(0.95); }
            #bili-dl-btn svg { width: 24px; height: 24px; fill: currentColor; }
            #bili-dl-btn.loading { opacity: 0.7; pointer-events: none; animation: spin 1s infinite linear; }
            
            /* === 主面板 (美化版) === */
            #bili-dl-panel {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: ${UI_CONFIG.panelWidth}; max-height: 85vh; overflow-y: auto; overflow-x: hidden;
                background: rgba(255, 255, 255, 0.98); 
                backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                z-index: ${UI_CONFIG.zIndex + 1}; border-radius: 20px;
                box-shadow: 0 24px 70px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
                animation: panelFadeIn 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                color: #333; border: 1px solid rgba(255,255,255,1);
            }

            /* 头部 (增加渐变) */
            .bdl-head { 
                padding: 18px 24px; 
                border-bottom: 1px solid rgba(0,0,0,0.04);
                display: flex; justify-content: space-between; align-items: center; 
                background: linear-gradient(to bottom, #ffffff, #f9f9fa);
                position: sticky; top: 0; z-index: 10;
            }
            .bdl-title { font-size: 18px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;}
            .bdl-title svg { fill: ${UI_CONFIG.themeColor}; width: 20px; height: 20px; }
            .bdl-close { 
                cursor: pointer; width: 30px; height: 30px; border-radius: 50%; background: #f0f0f4; 
                display: flex; align-items: center; justify-content: center; color: #86868b; 
                font-size: 18px; line-height: 1; transition: all 0.2s;
            }
            .bdl-close:hover { background: #e5e5ea; color: #1d1d1f; transform: rotate(90deg); }

            /* 内容区域 */
            .bdl-body { padding: 20px 24px 30px; background: linear-gradient(to bottom, #f9f9fa, #ffffff); min-height: 300px; }
            
            /* 板块分组 */
            .bdl-group { margin-bottom: 30px; }
            .bdl-group:last-child { margin-bottom: 0; }
            
            /* 板块标题 */
            .bdl-label { 
                font-size: 13px; font-weight: 700; color: #1d1d1f; margin-bottom: 14px; 
                letter-spacing: 0.2px; display: flex; align-items: center;
            }
            .bdl-label::before {
                content: ''; display: inline-block; width: 4px; height: 14px; 
                background: ${UI_CONFIG.themeColor}; border-radius: 4px; margin-right: 10px;
                box-shadow: 0 2px 4px rgba(0,174,236,0.2);
            }

            /* 列表容器 (Grid) */
            .bdl-list { 
                display: grid; 
                grid-template-columns: repeat(2, 1fr); 
                gap: 14px; 
            }

            /* 下载卡片 (美化) */
            .bdl-card {
                display: flex; flex-direction: column; justify-content: space-between;
                background: #fff; border: 1px solid rgba(0,0,0,0.04); border-radius: 14px;
                padding: 14px; text-decoration: none; transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
                cursor: pointer; position: relative; height: 100%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                overflow: hidden;
            }
            .bdl-card::before { /* 左侧强调色条 */
                content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0;
                background: ${UI_CONFIG.themeColor}; transition: width 0.2s;
            }
            .bdl-card:hover { 
                border-color: rgba(0,174,236,0.3); 
                transform: translateY(-3px);
                box-shadow: 0 12px 24px rgba(0,174,236,0.12);
            }
            .bdl-card:hover::before { width: 4px; }
            .bdl-card:active { transform: scale(0.98); }

            .bdl-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
            .bdl-name { font-size: 14px; font-weight: 600; color: #333; line-height: 1.4; padding-left: 2px;}
            
            /* 卡片底部信息 */
            .bdl-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
            .bdl-tag { 
                font-size: 10px; padding: 3px 7px; border-radius: 6px; 
                font-weight: 600; letter-spacing: 0.3px;
            }
            .bdl-tag.blue { background: #e3f2fd; color: #0277bd; }
            .bdl-tag.orange { background: #fff3e0; color: #ef6c00; }
            .bdl-tag.gray { background: #f5f5f7; color: #86868b; }

            /* 下载图标 */
            .bdl-icon {
                width: 26px; height: 26px; border-radius: 50%; background: #f5f5f7; color: #d1d1d6;
                display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 8px;
                transition: all 0.2s;
            }
            .bdl-card:hover .bdl-icon { background: ${UI_CONFIG.themeColor}; color: #fff; transform: rotate(-90deg); }
            .bdl-icon svg { width: 14px; height: 14px; fill: currentColor; }

            /* 底部提示 */
            .bdl-tips { 
                font-size: 12px; color: #999; text-align: center; margin-top: 28px; 
                padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.02); 
            }
            .bdl-tips b { color: ${UI_CONFIG.themeColor}; }
            
            /* 动画 */
            @keyframes panelFadeIn { from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        const style = document.createElement('style');
        style.id = 'bdl-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // === 2. 核心工具函数 ===
    
    // 2.1 从 URL 获取 BVID
    function getBvidFromUrl() {
        const match = location.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    // 2.2 获取并清洗视频标题 (同步最新)
    function getVideoTitle() {
        let title = document.title.replace('_哔哩哔哩_bilibili', '').trim();
        const titleEle = document.querySelector('.video-title') || document.querySelector('.tit');
        if (titleEle && titleEle.innerText) {
            title = titleEle.innerText.trim();
        }
        return title.replace(/[\\/:*?"<>|]/g, '_');
    }

    // 2.3 通过 API 联网获取 CID
    async function fetchCidFromApi(bvid) {
        try {
            const res = await fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&jsonp=jsonp`).then(r => r.json());
            if (res.code === 0 && res.data && res.data.length > 0) {
                const urlParams = new URLSearchParams(location.search);
                const p = parseInt(urlParams.get('p')) || 1;
                const pageData = res.data[p - 1] || res.data[0];
                return pageData.cid;
            }
        } catch (e) { console.warn('[BDL] API Fetch Error:', e); }
        return null;
    }

    // 2.4 静态扫描页面变量
    function readPageVariablesFromDom() {
        let data = { cid: null, bvid: null, epid: null };
        try {
            for (const script of document.scripts) {
                const content = script.innerHTML || script.textContent || "";
                if (content.includes('window.__INITIAL_STATE__=')) {
                    const match = content.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
                    if (match && match[1]) {
                        try {
                            const state = JSON.parse(match[1]);
                            data.bvid = state.bvid;
                            if (state.videoData) data.cid = state.videoData.cid;
                            if (state.epInfo) { data.cid = state.epInfo.cid; data.epid = state.epInfo.id; }
                        } catch(e) {}
                    }
                }
                if (!data.cid && content.includes('window.__playinfo__=')) {
                     const match = content.match(/window\.__playinfo__\s*=\s*(\{.*?\});/);
                     if (match && match[1]) {
                         try { const pi = JSON.parse(match[1]); if (pi.data) data.cid = pi.data.cid; } catch(e) {}
                     }
                }
                if (data.cid) break;
            }
        } catch (e) {}
        return data;
    }

    // === 3. 核心业务逻辑 ===
    async function startParse() {
        const btn = document.getElementById('bili-dl-btn');
        if(!btn) return;
        btn.classList.add('loading');

        try {
            let bvid = getBvidFromUrl();
            let cid = null;
            let epid = null;

            const pageVars = readPageVariablesFromDom();
            if (pageVars.cid) cid = pageVars.cid;
            if (pageVars.epid) epid = pageVars.epid;
            if (!bvid && pageVars.bvid) bvid = pageVars.bvid;

            if (!cid && bvid) cid = await fetchCidFromApi(bvid);

            if (!cid) throw new Error("无法获取视频 CID，请尝试刷新页面");
            console.log(`[BDL] Target: BVID=${bvid}, CID=${cid}, EPID=${epid}`);

            const playUrlData = await fetchPlayUrl(bvid, cid, epid);
            renderPanel(playUrlData);

        } catch (err) {
            console.error(err);
            alert("❌ " + err.message);
        } finally {
            btn.classList.remove('loading');
        }
    }

    async function fetchPlayUrl(bvid, cid, epid) {
        const apiBase = epid 
            ? `https://api.bilibili.com/pgc/player/web/playurl?ep_id=${epid}` 
            : `https://api.bilibili.com/x/player/playurl?bvid=${bvid}`;
        const params = `&cid=${cid}&qn=120&fourk=1&otype=json`; 
        
        try {
            const [dashRes, flvRes] = await Promise.all([
                fetch(`${apiBase}${params}&fnval=4048`, { credentials: 'include' }).then(r => r.json()),
                fetch(`${apiBase}${params}&fnval=1`, { credentials: 'include' }).then(r => r.json())
            ]);
            return { dash: dashRes?.data || dashRes?.result, flv: flvRes?.data || flvRes?.result };
        } catch (e) {
            throw new Error("网络请求失败，可能是 B 站接口变动或网络问题");
        }
    }

    // === 4. UI 渲染 (逻辑升级) ===

    // 统一卡片生成函数
    function createCard(title, format, size, url, filename) {
        // 使用 data-属性 存储下载信息，不再依赖 href 直接下载
        // 这样我们可以拦截点击事件，使用 GM_download 实现重命名
        return `
            <a class="bdl-card" href="${url}" data-download-url="${url}" data-filename="${filename}">
                <div class="bdl-card-top">
                    <div class="bdl-name">${title}</div>
                    <div class="bdl-icon">
                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </div>
                </div>
                <div class="bdl-meta">
                    <span class="bdl-tag blue">${format}</span>
                    <span class="bdl-tag ${size === '未知' ? 'gray' : 'orange'}">${size}</span>
                </div>
            </a>
        `;
    }

    function renderPanel(data) {
        document.getElementById('bili-dl-panel')?.remove();
        
        const qualityMap = { 
            127:'8K 超清', 126:'杜比视界', 125:'HDR 真彩', 120:'4K 超清', 116:'1080P60', 
            112:'1080P+', 80:'1080P', 64:'720P', 32:'480P', 16:'360P' 
        };
        const videoTitle = getVideoTitle(); 

        let html = `
            <div class="bdl-head">
                <div class="bdl-title">
                    <svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm0 2h-9v2h18v-2h-9z"/></svg>
                    下载助手
                </div>
                <div class="bdl-close" onclick="document.getElementById('bili-dl-panel').remove()">×</div>
            </div>
            <div class="bdl-body">
        `;

        // 1. 完整音视频 (FLV)
        const flvList = data.flv?.durl;
        if (flvList && flvList.length > 0) {
            html += `<div class="bdl-group"><div class="bdl-label">完整音视频</div><div class="bdl-list">`;
            flvList.forEach((item, i) => {
                const size = (item.size / 1024 / 1024).toFixed(1) + ' MB';
                const name = flvList.length > 1 ? `分段 ${i + 1}` : `1080P / 高清`;
                const filename = `${videoTitle}-${name}.mp4`; 
                html += createCard(name, 'MP4', size, item.url, filename);
            });
            html += `</div></div>`;
        }

        // 2. 纯视频 (DASH Video)
        const dashVideo = data.dash?.dash?.video;
        if (dashVideo) {
            html += `<div class="bdl-group"><div class="bdl-label">纯视频 (无声)</div><div class="bdl-list">`;
            const seen = new Set();
            const duration = data.dash?.dash?.duration || 0;
            dashVideo.forEach(v => {
                if(seen.has(v.id)) return;
                seen.add(v.id);
                const name = qualityMap[v.id] || `${v.id}P`;
                const size = duration ? (v.bandwidth * duration / 8 / 1024 / 1024).toFixed(1) + ' MB' : '未知';
                const codec = v.codecs.includes('avc') ? 'AVC' : (v.codecs.includes('hev') ? 'HEVC' : 'AV1');
                const filename = `${videoTitle}-${name}.m4s`;
                html += createCard(name, codec, size, v.baseUrl, filename);
            });
            html += `</div></div>`;
        }

        // 3. 纯音频 (DASH Audio)
        const dashAudio = data.dash?.dash?.audio;
        if (dashAudio) {
            html += `<div class="bdl-group"><div class="bdl-label">纯音频</div><div class="bdl-list">`;
            const duration = data.dash?.dash?.duration || 0;
            dashAudio.slice(0, 2).forEach((a, i) => { 
                const name = i === 0 ? '最高音质' : '标准音质';
                const size = duration ? (a.bandwidth * duration / 8 / 1024 / 1024).toFixed(1) + ' MB' : '未知';
                const filename = `${videoTitle}-${name}.m4a`;
                html += createCard(name, 'M4A', size, a.baseUrl, filename);
            });
            html += `</div></div>`;
        }

        if (!flvList && !dashVideo) html += `<div class="bdl-tips">⚠️ 未解析到链接，请确保您已登录。</div>`;
        // 关键：修改提示语，引导用户左键点击
        html += `<div class="bdl-tips">💡 <b>左键点击</b> 卡片即可自动重命名下载。<br/><span style="color:#aaa;font-size:10px">(右键另存为受浏览器限制，无法自动重命名)</span></div></div>`;

        const panel = document.createElement('div');
        panel.id = 'bili-dl-panel';
        panel.innerHTML = html;
        document.body.appendChild(panel);

        // === 事件委托处理下载 ===
        // 这种方式在 Sandbox 环境下更安全，也支持 GM_download
        panel.addEventListener('click', (e) => {
            const card = e.target.closest('.bdl-card');
            if (!card) return;

            // 如果支持 GM_download，则拦截点击，进行高级下载
            if (typeof GM_download !== 'undefined') {
                e.preventDefault(); // 阻止默认跳转
                const url = card.dataset.downloadUrl;
                const filename = card.dataset.filename;
                
                GM_download({
                    url: url,
                    name: filename,
                    saveAs: true, // 弹出保存框（Chrome Tampermonkey 可能默认直接下）
                    onerror: (err) => {
                        console.error(err);
                        alert('下载出错: ' + (err.error || '未知错误') + '\n请尝试右键另存为。');
                        // 失败后的兜底：打开新标签页
                        window.open(url, '_blank');
                    }
                });
            }
            // 如果不支持 GM_download，则走默认 href 逻辑（只能尝试浏览器默认行为）
        });
    }

    // === 5. 初始化 ===
    function init() {
        if (document.getElementById('bili-dl-btn')) return;
        injectStyles();

        const btn = document.createElement('div');
        btn.id = 'bili-dl-btn';
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm0 2h-9v2h18v-2h-9z"/></svg>`;
        btn.title = '点击解析视频';
        
        let isDragging = false, startX, startY, initX, initY;
        btn.addEventListener('mousedown', e => {
            isDragging = false;
            startX = e.clientX; startY = e.clientY;
            const rect = btn.getBoundingClientRect();
            initX = rect.left; initY = rect.top;
            
            const move = (e) => {
                if (Math.abs(e.clientX - startX) > 2) isDragging = true;
                btn.style.left = initX + (e.clientX - startX) + 'px';
                btn.style.top = initY + (e.clientY - startY) + 'px';
            };
            const stop = () => {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', stop);
            };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', stop);
        });

        btn.addEventListener('click', () => { if(!isDragging) startParse(); });
        document.body.appendChild(btn);
    }

    init();
    let lastHref = location.href;
    setInterval(() => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            document.getElementById('bili-dl-panel')?.remove();
            init();
        }
    }, 1500);

})();