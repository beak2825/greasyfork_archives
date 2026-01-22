// ==UserScript==
// @name         B站下载助手 - 作者刘不行
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  点击下载可以下载视频封面、纯视频、纯音频和完整音视频
// @author       刘不行
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/562999/B%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20%E4%BD%9C%E8%80%85%E5%88%98%E4%B8%8D%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/562999/B%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20%E4%BD%9C%E8%80%85%E5%88%98%E4%B8%8D%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 0. 全局配置 (B站设计语言系统) ===
    const UI_CONFIG = {
        themePink: '#FB7299', // B站粉
        themeBlue: '#00AEEC', // B站蓝
        textMain: '#18191C',  // 主要文字
        textGray: '#9499A0',  // 次要文字
        panelWidth: '520px',
        zIndex: 999999,
        radius: '10px'
    };

    // === 1. 样式注入 (CSS - 深度美化版) ===
    function injectStyles() {
        if (document.getElementById('bdl-style')) return;
        const css = `
            /* 全局重置 */
            .bdl-root, #bili-dl-panel * { 
                box-sizing: border-box; 
                font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; 
                margin: 0; padding: 0;
            }
            
            /* === 悬浮球 === */
            #bili-dl-btn {
                position: fixed; top: 180px; left: 20px; z-index: ${UI_CONFIG.zIndex};
                width: 48px; height: 48px; 
                background: ${UI_CONFIG.themePink}; color: #fff;
                border-radius: 50%; 
                box-shadow: 0 4px 12px rgba(251, 114, 153, 0.4);
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: all 0.2s ease-in-out; user-select: none;
            }
            #bili-dl-btn:hover { transform: scale(1.1) rotate(5deg); background: #fc8bab; box-shadow: 0 6px 16px rgba(251, 114, 153, 0.6); }
            #bili-dl-btn svg { width: 22px; height: 22px; fill: currentColor; }
            #bili-dl-btn.loading { opacity: 0.8; cursor: wait; animation: spin 1s infinite linear; }
            
            /* === 主面板 === */
            #bili-dl-panel {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: ${UI_CONFIG.panelWidth}; max-height: 85vh; overflow-y: auto; overflow-x: hidden;
                background: #FFFFFF; 
                z-index: ${UI_CONFIG.zIndex + 1}; border-radius: ${UI_CONFIG.radius};
                box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.15);
                animation: panelFadeIn 0.25s cubic-bezier(0.2, 0, 0.2, 1);
            }

            /* 头部 */
            .bdl-head { 
                padding: 18px 24px; 
                border-bottom: 1px solid #F1F2F3;
                display: flex; justify-content: space-between; align-items: center; 
                background: #fff; position: sticky; top: 0; z-index: 10;
            }
            .bdl-title { font-size: 16px; font-weight: 600; color: ${UI_CONFIG.textMain}; display: flex; align-items: center; gap: 8px;}
            .bdl-title svg { fill: ${UI_CONFIG.themePink}; width: 22px; height: 22px; }
            .bdl-close { 
                cursor: pointer; width: 28px; height: 28px; border-radius: 6px; 
                display: flex; align-items: center; justify-content: center; color: ${UI_CONFIG.textGray}; 
                font-size: 20px; transition: all 0.2s; background: #F6F7F8;
            }
            .bdl-close:hover { background: #E3E5E7; color: ${UI_CONFIG.textMain}; }

            /* 内容区域 */
            .bdl-body { padding: 0 24px 30px; }
            
            /* 顶部提示条 */
            .bdl-top-tip {
                background: #F6F7F8; border-radius: 6px; padding: 12px 16px; margin: 20px 0;
                font-size: 12px; color: #61666D; line-height: 1.6;
                border-left: 4px solid ${UI_CONFIG.themePink};
            }
            .bdl-top-tip b { color: ${UI_CONFIG.themePink}; font-weight: 600; margin: 0 2px; }

            /* 板块分组 */
            .bdl-group { margin-bottom: 28px; }
            .bdl-label { 
                font-size: 14px; font-weight: 600; color: ${UI_CONFIG.textMain}; margin-bottom: 14px; 
                display: flex; align-items: center;
            }

            /* 列表容器 */
            .bdl-list { 
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; 
            }

            /* 下载卡片 */
            .bdl-card {
                display: flex; flex-direction: column; justify-content: space-between;
                background: #fff; border: 1px solid #E3E5E7; border-radius: 8px;
                padding: 14px; text-decoration: none; transition: all 0.2s;
                cursor: pointer; position: relative;
                min-height: 84px; 
            }
            .bdl-card:hover { 
                border-color: ${UI_CONFIG.themeBlue}; 
                box-shadow: 0 4px 12px rgba(0, 174, 236, 0.15);
                transform: translateY(-2px);
            }
            .bdl-card-top { margin-bottom: 10px; }
            .bdl-name { font-size: 13px; font-weight: 500; color: ${UI_CONFIG.textMain}; line-height: 1.5; word-break: break-all;}
            
            /* 标签系统 */
            .bdl-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
            .bdl-tag { 
                font-size: 11px; padding: 3px 8px; border-radius: 4px; 
                font-weight: 500; display: inline-block;
            }
            .bdl-tag.pink { background: #FFECF1; color: ${UI_CONFIG.themePink}; }
            .bdl-tag.blue { background: #E1F4FC; color: ${UI_CONFIG.themeBlue}; }
            .bdl-tag.green { background: #E7F9F1; color: #2E7D59; } 
            .bdl-tag.gray { background: #F1F2F3; color: ${UI_CONFIG.textGray}; }

            /* 底部声明 */
            .bdl-footer-note { 
                font-size: 12px; color: ${UI_CONFIG.textGray}; text-align: center; margin-top: 24px; border-top: 1px solid #E3E5E7; padding-top: 16px;
            }

            /* 滚动条美化 */
            #bili-dl-panel::-webkit-scrollbar { width: 6px; }
            #bili-dl-panel::-webkit-scrollbar-thumb { background: #E3E5E7; border-radius: 4px; }
            #bili-dl-panel::-webkit-scrollbar-thumb:hover { background: #C9CCD0; }

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
    function getBvidFromUrl() {
        const match = location.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    function getVideoTitle() {
        let title = document.title.replace('_哔哩哔哩_bilibili', '').trim();
        const titleEle = document.querySelector('.video-title') || document.querySelector('.tit');
        if (titleEle && titleEle.innerText) {
            title = titleEle.innerText.trim();
        }
        return title.replace(/[\\/:*?"<>|]/g, '_');
    }

    function getVideoCover() {
        const meta = document.querySelector('meta[property="og:image"]');
        if (meta && meta.content) {
            return meta.content.split('@')[0];
        }
        if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoData) {
            return window.__INITIAL_STATE__.videoData.pic;
        }
        return null;
    }

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

    // === 3. 核心解析逻辑 ===
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
            
            const playUrlData = await fetchPlayUrl(bvid, cid, epid);
            playUrlData.cover = getVideoCover();
            
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

    // === 4. UI 渲染 ===
    function createCard(title, format, size, url, filename) {
        let tagClass = 'blue';
        if (format === 'JPG' || format === 'PNG') tagClass = 'green';
        else if (format === 'M4A') tagClass = 'pink';

        return `
            <a class="bdl-card" href="${url}" data-download-url="${url}" data-filename="${filename}">
                <div class="bdl-card-top">
                    <div class="bdl-name">${title}</div>
                </div>
                <div class="bdl-meta">
                    <span class="bdl-tag ${tagClass}">${format}</span>
                    <span class="bdl-tag ${size === '未知' ? 'gray' : 'gray'}">${size}</span>
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
                    资源下载
                </div>
                <div class="bdl-close" onclick="document.getElementById('bili-dl-panel').remove()">×</div>
            </div>
            <div class="bdl-body">
                <div class="bdl-top-tip">
                    <b>一般情况下</b> 可直接点击左键下载；<br/>
                    <b>左键下载不了</b> 请右键卡片选择“链接另存为”。
                </div>
        `;

        // 0. 图像资源
        if (data.cover) {
            html += `<div class="bdl-group"><div class="bdl-label">图像资源</div><div class="bdl-list">`;
            const ext = data.cover.includes('.png') ? 'png' : 'jpg';
            const filename = `${videoTitle}-封面.${ext}`;
            html += createCard('视频高清封面', ext.toUpperCase(), '高清', data.cover, filename);
            html += `</div></div>`;
        }

        // 1. FLV
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

        // 2. Dash Video
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

        // 3. Dash Audio
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

        if (!flvList && !dashVideo && !data.cover) html += `<div class="bdl-footer-note">⚠️ 未解析到链接，请确保您已登录B站。</div>`;
        
        html += `</div>`;

        const panel = document.createElement('div');
        panel.id = 'bili-dl-panel';
        panel.innerHTML = html;
        document.body.appendChild(panel);

        // === 点击事件拦截 (下载逻辑) ===
        panel.addEventListener('click', (e) => {
            const card = e.target.closest('.bdl-card');
            if (!card) return;

            if (typeof GM_download !== 'undefined') {
                e.preventDefault(); 
                e.stopPropagation();

                const url = card.dataset.downloadUrl;
                const filename = card.dataset.filename;
                
                GM_download({
                    url: url, 
                    name: filename, 
                    saveAs: true, 
                    onerror: (err) => {
                        console.error("GM_download Error:", err);
                        alert('自动下载失败，正在尝试浏览器默认下载...');
                        window.open(url, '_blank');
                    }
                });
            }
        });
    }

    // === 5. 初始化 (UI & Events) ===
    function init() {
        if (document.getElementById('bili-dl-btn')) return;
        injectStyles();

        const btn = document.createElement('div');
        btn.id = 'bili-dl-btn';
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm0 2h-9v2h18v-2h-9z"/></svg>`;
        btn.title = '左键下载，右键隐藏，刷新回来';
        
        let isDragging = false, startX, startY, initX, initY;
        btn.addEventListener('mousedown', e => {
            if(e.button !== 0) return; 
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

        // === V1.4 交互升级：右键直接隐藏 ===
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // 阻止浏览器菜单
            btn.style.display = 'none'; // 立即隐藏
        });

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