// ==UserScript==
// @name         豆瓣电影 PanSou 资源搜索助手
// @namespace    https://toolsdar.cn/
// @version      2.1
// @description  UI 美化 + Tab 分组 + 修复列表滚动 + 顶部Tab显性滚动条
// @author       Toolsdar.cn
// @match        https://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558219/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20PanSou%20%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558219/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20PanSou%20%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置与常量 =================
    const STORAGE_KEY_API = "pansou_full_api_url";
    const STORAGE_KEY_TOKEN = "pansou_api_token";
    
    // ================= 菜单管理 =================
    GM_registerMenuCommand("⚙️ 设置 API 地址", () => {
        const currentUrl = GM_getValue(STORAGE_KEY_API, "");
        const newUrl = prompt("请输入完整 API 地址 (如 https://api.example.com/search)：", currentUrl);
        if (newUrl !== null) {
            GM_setValue(STORAGE_KEY_API, newUrl.trim());
            location.reload();
        }
    });

    GM_registerMenuCommand("🔑 设置 API Token", () => {
        const t = prompt("Token (可选):", GM_getValue(STORAGE_KEY_TOKEN, ""));
        if (t !== null) GM_setValue(STORAGE_KEY_TOKEN, t.trim());
    });

    // ================= 🎨 UI 样式 (保持 V2.0 样式) =================
    GM_addStyle(`
        .pansou-btn { display: inline-flex; align-items: center; justify-content: center; margin-left: 10px; cursor: pointer; vertical-align: middle; background-color: #eef7fe; color: #37a; border: 1px solid #bn; padding: 2px 8px; border-radius: 4px; font-size: 13px; font-weight: normal; transition: all 0.2s; }
        .pansou-btn:hover { background-color: #37a; color: white; }
        #pansou-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 9999; display: none; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
        #pansou-modal { background: #fff; width: 620px; max-width: 90%; height: 70vh; max-height: 85vh; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; overflow: hidden; border: 1px solid #eee; }
        .pm-header { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; background: #fff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .pm-title { font-weight: 600; font-size: 16px; color: #1f1f1f; display:flex; align-items:center; gap: 8px; }
        .pm-close { cursor: pointer; font-size: 22px; color: #999; line-height: 1; }
        .pm-close:hover { color: #333; }
        #pm-container { display: flex; flex-direction: column; flex: 1; min-height: 0; background: #f9f9f9; }
        .pm-tabs { display: flex; gap: 10px; padding: 10px 20px 14px 20px; border-bottom: 1px solid #f0f0f0; background: #fff; overflow-x: auto; flex-shrink: 0; }
        .pm-tabs::-webkit-scrollbar { height: 6px; display: block; }
        .pm-tabs::-webkit-scrollbar-track { background: transparent; }
        .pm-tabs::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        .pm-tabs::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        .pm-tab-item { padding: 6px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; color: #666; background: #f5f5f5; white-space: nowrap; transition: all 0.2s; border: 1px solid transparent; flex-shrink: 0; }
        .pm-tab-item:hover { background: #eef2ff; color: #3b82f6; }
        .pm-tab-item.active { background: #3b82f6; color: white; box-shadow: 0 2px 6px rgba(59,130,246,0.3); }
        .pm-body { padding: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; }
        .pm-body::-webkit-scrollbar { width: 6px; }
        .pm-body::-webkit-scrollbar-track { background: transparent; }
        .pm-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        .pm-body::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        .pm-group-title { padding: 10px 20px; background: #eef2f6; color: #4b5563; font-weight: 600; font-size: 13px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 1; }
        .pm-item { padding: 12px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; background: #fff; transition: background 0.2s; }
        .pm-item:hover { background-color: #f8fbff; }
        .pm-icon { font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; flex-shrink: 0; }
        .pm-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .pm-link-title { color: #111827; text-decoration: none; font-weight: 500; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pm-link-title:hover { color: #2563eb; }
        .pm-meta { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 10px; }
        .pm-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .pm-pwd-badge { background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; border-radius: 99px; padding: 2px 8px; font-size: 12px; font-family: monospace; cursor: pointer; }
        .pm-go-btn { padding: 6px 14px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
        .pm-go-btn:hover { background: #2563eb; }
        .pm-go-btn.copied { background: #10b981; }
        .pm-status { padding: 60px 20px; text-align: center; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pm-status-icon { font-size: 32px; margin-bottom: 5px; }
        .pm-error-box { color: #dc2626; background: #fef2f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 8px; font-size: 12px; text-align: left; width: 90%; word-break: break-all; }
    `);

    // ================= 核心逻辑 =================
    
    function getCleanTitle() {
        let text = document.title;
        if (!text) return null;
        text = text.replace('(豆瓣)', '').trim();
        text = text.replace(/\s\(\d{4}\)$/, '');
        return text;
    }

    function init() {
        const movieName = getCleanTitle();
        if (!movieName) return; 
        const titleH1 = document.querySelector('h1');
        if (!titleH1) return;
        const btn = document.createElement('span');
        btn.className = 'pansou-btn';
        btn.innerHTML = '⚡ 搜网盘';
        btn.title = `搜索《${movieName}》`;
        btn.onclick = () => {
            const url = GM_getValue(STORAGE_KEY_API, "");
            if (!url) return alert("请先在油猴菜单中设置 API 地址！");
            openModal(movieName);
            searchResources(movieName, url);
        };
        titleH1.appendChild(btn);
        createModal();
    }

    function createModal() {
        if (document.getElementById('pansou-modal-overlay')) return;
        const div = document.createElement('div');
        div.id = 'pansou-modal-overlay';
        div.innerHTML = `
            <div id="pansou-modal">
                <div class="pm-header">
                    <span class="pm-title">🔍 资源搜索</span>
                    <span class="pm-close">×</span>
                </div>
                <div id="pm-container">
                    <div class="pm-body" id="pm-content"></div>
                </div>
            </div>`;
        div.querySelector('.pm-close').onclick = () => div.style.display = 'none';
        div.onclick = (e) => { if (e.target === div) div.style.display = 'none'; };
        document.body.appendChild(div);
    }

    function openModal(title) {
        document.querySelector('.pm-title').innerHTML = `<span>🔍</span> 搜索：${title}`;
        document.getElementById('pansou-modal-overlay').style.display = 'flex';
        document.getElementById('pm-content').innerHTML = `
            <div class="pm-status">
                <div class="pm-status-icon">🚀</div>
                <div>正在全网搜索资源...</div>
            </div>`;
        const existingTabs = document.querySelector('.pm-tabs');
        if (existingTabs) existingTabs.remove();
    }

    function searchResources(keyword, fullUrl) {
        const token = GM_getValue(STORAGE_KEY_TOKEN, "");
        GM_xmlhttpRequest({
            method: "POST",
            url: fullUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : "",
                "Referer": "", "Origin": ""
            },
            data: JSON.stringify({ kw: keyword, res: "merge", src: "all" }),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        processData(JSON.parse(response.responseText));
                    } catch (e) {
                        renderError(`JSON 解析失败\n${response.responseText.substring(0, 100)}...`);
                    }
                } else {
                    renderError(`HTTP ${response.status}: ${response.statusText}`);
                }
            },
            onerror: () => renderError("网络请求失败，请检查 API 地址是否正确或跨域设置。")
        });
    }

    // ================= 核心修复：更强的格式兼容 =================
    function processData(data) {
        let results = {};

        // 1. 优先匹配有数据的情况
        if (data.merged_by_type) {
            results = data.merged_by_type;
        } 
        else if (data.data && data.data.merged_by_type) {
            results = data.data.merged_by_type;
        } 
        else if (Array.isArray(data.results)) {
            results = { "搜索结果": data.results };
        } 
        else if (data.data && Array.isArray(data.data.results)) {
            results = { "搜索结果": data.data.results };
        } 
        
        // 2. 关键修复：处理无结果的情况
        // 如果上面都没匹配到，但 code 是 0 或 200，说明请求成功但没数据
        else if (data.code === 0 || data.code === 200) {
            if (data.data && data.data.total === 0) {
                results = {}; // 认为是空结果，而不是格式错误
            } else {
                 // 可能是 {code:0, msg:"success", data:null} 或其他空结构
                 results = {}; 
            }
        }
        
        // 3. 确实无法识别
        else {
            return renderError(`无法识别返回格式。\n${JSON.stringify(data, null, 2)}`);
        }

        renderTabsAndList(results);
    }

    function renderTabsAndList(groups) {
        const container = document.getElementById('pm-container');
        const contentBox = document.getElementById('pm-content');
        contentBox.innerHTML = '';
        
        const oldTabs = document.querySelector('.pm-tabs');
        if (oldTabs) oldTabs.remove();

        // 处理空结果
        if (!groups || Object.keys(groups).length === 0) {
            contentBox.innerHTML = '<div class="pm-status"><div class="pm-status-icon">🍃</div><div>未找到相关资源</div><div style="font-size:12px;color:#999;margin-top:5px">API 返回结果为空</div></div>';
            return;
        }

        // Tabs
        const tabsDiv = document.createElement('div');
        tabsDiv.className = 'pm-tabs';

        let totalCount = 0;
        Object.values(groups).forEach(arr => { if(Array.isArray(arr)) totalCount += arr.length; });

        const tabData = [
            { id: 'all', name: '全部', count: totalCount },
            ...Object.keys(groups).map(key => ({
                id: key,
                name: key,
                count: Array.isArray(groups[key]) ? groups[key].length : 0
            }))
        ];

        tabData.forEach((tab, index) => {
            const btn = document.createElement('div');
            btn.className = `pm-tab-item ${index === 0 ? 'active' : ''}`; 
            btn.innerText = `${tab.name} (${tab.count})`;
            btn.onclick = () => {
                document.querySelectorAll('.pm-tab-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderListItems(groups, tab.id, contentBox);
            };
            tabsDiv.appendChild(btn);
        });

        container.insertBefore(tabsDiv, contentBox);
        renderListItems(groups, 'all', contentBox);
    }

    function renderListItems(groups, activeTab, box) {
        box.innerHTML = '';
        const keys = activeTab === 'all' ? Object.keys(groups) : [activeTab];

        keys.forEach(type => {
            const items = groups[type];
            if (!items || !items.length) return;

            if (activeTab === 'all') {
                const title = document.createElement('div');
                title.className = 'pm-group-title';
                let cloudIcon = '☁️';
                if(type.includes('夸克')) cloudIcon = '🥓'; 
                if(type.includes('阿里')) cloudIcon = '🐜';
                if(type.includes('百度')) cloudIcon = '🐾';
                if(type.includes('迅雷')) cloudIcon = '⚡';
                title.innerText = `${cloudIcon} ${type}`;
                box.appendChild(title);
            }

            items.forEach(item => {
                const row = document.createElement('div');
                row.className = 'pm-item';
                
                const name = item.note || item.title || item.name || '资源链接';
                const pwd = item.password || item.pwd || '';
                const dateRaw = item.datetime || '';
                const dateStr = dateRaw ? dateRaw.split('T')[0] : '';
                const icon = getIconByTitle(name);

                const pwdHtml = pwd 
                    ? `<div class="pm-pwd-badge" title="点击复制" data-pwd="${pwd}">${pwd}</div>` 
                    : '';

                row.innerHTML = `
                    <div class="pm-icon">${icon}</div>
                    <div class="pm-info">
                        <a href="${item.url}" target="_blank" class="pm-link-title" title="${name}">${name}</a>
                        <div class="pm-meta">
                            ${dateStr ? `<span>📅 ${dateStr}</span>` : ''}
                            ${item.source ? `<span>📡 ${item.source}</span>` : ''}
                        </div>
                    </div>
                    <div class="pm-actions">
                        ${pwdHtml}
                        <button class="pm-go-btn" data-url="${item.url}" data-pwd="${pwd}">前往</button>
                    </div>
                `;
                
                const pwdBadge = row.querySelector('.pm-pwd-badge');
                if (pwdBadge) {
                    pwdBadge.onclick = (e) => {
                        e.stopPropagation();
                        GM_setClipboard(pwd);
                        pwdBadge.innerText = '已复制';
                        setTimeout(() => pwdBadge.innerHTML = pwd, 1500);
                    };
                }
                const mainBtn = row.querySelector('.pm-go-btn');
                mainBtn.onclick = () => {
                   if(pwd) { 
                       GM_setClipboard(pwd); 
                       mainBtn.classList.add('copied');
                       mainBtn.innerText = '已复制码';
                       setTimeout(() => window.open(item.url, '_blank'), 300);
                   } else {
                       window.open(item.url, '_blank');
                   }
                };
                box.appendChild(row);
            });
        });
    }

    function getIconByTitle(title) {
        if (!title) return '📂';
        const t = title.toLowerCase();
        if (t.includes('.mp4') || t.includes('.mkv') || t.includes('1080p') || t.includes('4k')) return '🎬';
        if (t.includes('.mp3') || t.includes('.flac') || t.includes('audio')) return '🎵';
        if (t.includes('.zip') || t.includes('.rar') || t.includes('.7z')) return '📦';
        if (t.includes('.pdf') || t.includes('.epub') || t.includes('.txt')) return '📄';
        if (t.includes('.apk') || t.includes('.exe')) return '💾';
        return '📂';
    }

    function renderError(msg) {
        document.getElementById('pm-content').innerHTML = `
            <div class="pm-status">
                <div class="pm-status-icon">⚠️</div>
                <div class="pm-error-box">${msg}</div>
            </div>`;
    }

    init();
})();