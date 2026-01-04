// ==UserScript==
// @name         搜索引擎切换器 / Search Engine Switcher
// @name:en      Search Engine Switcher
// @namespace    https://github.com/MURChen/Search-Engine-Switcher
// @version      1.0
// @description  在搜索引擎页面左侧显示一个快速切换列表，节省「另开搜索引擎」的时间。支持自定义搜索引擎、夜间模式、自定义自动收起规则、Favicon 本地缓存优化。
// @description:en A highly customizable search engine switcher. Features: dynamic keywords, dark mode, auto-hide rules, and favicon caching.
// @author       MURC&Gemini
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @connect      www.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @match        *://www.google.com/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.youtube.com/*
// @match        *://search.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://v2ex.com/*
// @match        *://www.v2ex.com/*
// @match        *://duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/561263/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%20%20Search%20Engine%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/561263/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%20%20Search%20Engine%20Switcher.meta.js
// ==/UserScript==

// === 默认配置 ===
const DEFAULT_ENGINES = [
  { name: "Google", searchUrl: "https://www.google.com/search?q=", keyName: "q", domain: "google.com" },
  { name: "Bing", searchUrl: "https://www.bing.com/search?q=", keyName: "q", domain: "bing.com" },
  { name: "YouTube", searchUrl: "https://www.youtube.com/results?search_query=", keyName: "search_query", domain: "youtube.com" },
  { name: "V2EX", searchUrl: "https://www.google.com/search?q=site:v2ex.com/t ", keyName: "q", domain: "v2ex.com" },
  { name: "BiliBili", searchUrl: "https://search.bilibili.com/all?keyword=", keyName: "keyword", domain: "bilibili.com" }
];

// === 默认自动收起规则 ===
const DEFAULT_AUTO_HIDE_HOSTS = [
    "bilibili.com",
    "youtube.com"
];

// === 样式注入 ===
const STYLES = `
    .se-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); z-index: 100000;
        display: flex; justify-content: center; align-items: center;
        backdrop-filter: blur(5px);
    }
    .se-panel {
        width: 800px; max-width: 95vw; max-height: 90vh; 
        border-radius: 12px; padding: 25px; 
        overflow-y: auto; overflow-x: hidden;
        box-shadow: 0 15px 40px rgba(0,0,0,0.25); 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex; flex-direction: column; gap: 15px;
        background-color: #fff; color: #333;
        box-sizing: border-box;
    }
    .se-row {
        display: flex; gap: 12px; 
        align-items: center; 
        background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;
        transition: background 0.2s;
    }
    .se-row:hover { background: #f1f3f5; }
    
    .se-input-group { display: flex; flex-direction: column; gap: 6px; }
    
    .se-label {
        font-size: 11px; font-weight: 700; color: #6c757d; 
        margin-left: 2px; letter-spacing: 0.5px; cursor: help; 
    }

    .se-input {
        padding: 8px 12px; border-radius: 6px; border: 1px solid #ced4da;
        background: #fff; color: #495057; font-size: 13px; line-height: 1.5;
        box-sizing: border-box; width: 100%;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    .se-input:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 3px rgba(0,123,255,.15); }
    
    .se-btn { cursor: pointer; border: none; border-radius: 6px; padding: 6px 12px; transition: all 0.2s; white-space: nowrap; font-size: 13px;}
    
    .se-btn-move { 
        background: rgba(0,0,0,0.06); 
        padding: 6px 14px; 
        font-size: 12px; 
        line-height: 1;
        color: #555;
    }
    .se-btn-move:hover { background: rgba(0,0,0,0.12); color: #000; }
    .se-btn-move:disabled { opacity: 0.2; cursor: not-allowed; }

    .se-btn-del { 
        background: #ffe3e3; color: #e03131; 
        padding: 0; width: 32px; height: 32px; 
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; line-height: 1;
        border-radius: 8px;
    }
    .se-btn-del:hover { background: #ffc9c9; }

    .se-btn-add { background: #e9ecef; color: #495057; padding: 12px; font-weight: 600; flex: 2; }
    .se-btn-add:hover { background: #dee2e6; }
    
    .se-btn-reset { background: #fff0f0; color: #d63031; padding: 12px; font-weight: 600; flex: 1; border: 1px dashed #ffcccc; }
    .se-btn-reset:hover { background: #ffe6e6; border-color: #ffaaaa; }
    
    .se-btn-clear-cache { background: #fff8e1; color: #f57f17; padding: 12px; font-weight: 600; flex: 1; border: 1px dashed #ffe082; }
    .se-btn-clear-cache:hover { background: #ffecb3; }

    .se-btn-save { background: #007bff; color: white; padding: 10px 30px; font-size: 14px; font-weight: 500; }
    .se-btn-save:hover { background: #0056b3; }
    .se-btn-cancel { background: transparent; border: 1px solid #ced4da; color: #495057; padding: 10px 30px; }
    .se-btn-cancel:hover { background: #f8f9fa; }

    .se-textarea {
        width: 100%; height: 150px; min-height: 100px;
        padding: 12px; border-radius: 6px; border: 1px solid #ced4da;
        background: #fff; color: #495057; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        box-sizing: border-box; resize: vertical !important;
    }
    .se-textarea:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 3px rgba(0,123,255,.15); }

    /* === 深色模式适配 === */
    @media (prefers-color-scheme: dark) {
        .se-panel { background-color: #212529; color: #f8f9fa; box-shadow: 0 15px 40px rgba(0,0,0,0.5); }
        .se-row { background: #2b3035; border-color: #343a40; }
        .se-row:hover { background: #343a40; }
        .se-label { color: #adb5bd; }
        .se-input { background: #212529; color: #e9ecef; border-color: #495057; }
        .se-input:focus { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13,110,253,.25); }
        .se-textarea { background: #212529; color: #e9ecef; border-color: #495057; }
        .se-textarea:focus { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13,110,253,.25); }
        
        .se-btn-move { background: rgba(255,255,255,0.1); color: #ccc; }
        .se-btn-move:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .se-btn-del { background: #5c2b2b; color: #ff8787; }
        .se-btn-del:hover { background: #753030; }

        .se-btn-add { background: #343a40; color: #adb5bd; }
        .se-btn-add:hover { background: #3d4246; color: #fff; }
        .se-btn-reset { background: #2f2020; color: #ff6b6b; border-color: #553030; }
        .se-btn-reset:hover { background: #3a2525; }
        .se-btn-clear-cache { background: #332b00; color: #ffd54f; border-color: #665c00; }
        .se-btn-clear-cache:hover { background: #4d4000; }
        .se-btn-cancel { border-color: #495057; color: #adb5bd; }
        .se-btn-cancel:hover { background: #2b3035; color: #fff; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #495057; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
    }
`;

// === 核心逻辑 ===

function getConfig() {
    return {
        engines: GM_getValue('engines', DEFAULT_ENGINES),
        autoHideList: GM_getValue('autoHideList', DEFAULT_AUTO_HIDE_HOSTS)
    };
}

function saveConfig(engines, autoHideList) {
    GM_setValue('engines', engines);
    GM_setValue('autoHideList', autoHideList);
    alert('✅ 设置已保存，页面即将刷新。');
    location.reload();
}

// 检查是否在目标网站运行（安全检查）
function isTargetSite(engines) {
    const hostname = window.location.hostname;
    const autoHideList = GM_getValue('autoHideList', DEFAULT_AUTO_HIDE_HOSTS);
    if (autoHideList.some(h => hostname.includes(h))) return true;
    return engines.some(e => hostname.includes(e.domain) || hostname.includes("google") || hostname.includes("bing"));
}

function getKeywords(engines) {
    const urlParams = new URLSearchParams(window.location.search);
    const url = window.location.href;
    if (url.includes("site:v2ex.com/t")) {
        let q = urlParams.get("q") || "";
        return q.replace("site:v2ex.com/t", "").trim();
    }
    for (let engine of engines) {
        if (urlParams.has(engine.keyName)) return urlParams.get(engine.keyName);
    }
    if (window.location.hostname === "search.bilibili.com") {
        const pathArr = window.location.pathname.split('/');
        if (pathArr.length > 1 && pathArr[1] !== 'all') return decodeURIComponent(pathArr[1]);
    }
    return "";
}

// === 图标缓存逻辑 ===
function loadAndCacheIcon(imgElement, domain) {
    if (!domain) return;
    const cacheKey = "icon_cache_" + domain;
    const cachedData = GM_getValue(cacheKey);

    if (cachedData) {
        imgElement.src = cachedData;
        return;
    }
    const onlineUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    imgElement.src = onlineUrl;

    GM_xmlhttpRequest({
        method: "GET", url: onlineUrl, responseType: "blob",
        onload: function(response) {
            if (response.status === 200) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const base64data = reader.result;
                    if (base64data && base64data.length > 100) {
                        GM_setValue(cacheKey, base64data);
                    }
                }
                reader.readAsDataURL(response.response);
            }
        }
    });
}

function clearIconCache() {
    const keys = GM_listValues();
    let count = 0;
    keys.forEach(key => {
        if (key.startsWith("icon_cache_")) {
            GM_deleteValue(key);
            count++;
        }
    });
    alert(`🗑️ 已成功清除 ${count} 个图标的本地缓存。`);
    location.reload();
}

// === UI 创建逻辑 ===

function createSettingsUI() {
    if (document.getElementById('se-settings-modal')) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    const config = getConfig();
    const modal = document.createElement('div');
    modal.id = 'se-settings-modal';
    modal.className = 'se-modal-overlay';

    const panel = document.createElement('div');
    panel.className = 'se-panel';

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #dee2e6; padding-bottom:20px; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:24px;">⚙️</span>
                <h2 style="margin:0; font-size:20px; font-weight:600;">搜索引擎设置</h2>
            </div>
            <span style="font-size:12px; opacity:0.6;">v1.0</span>
        </div>
        
        <h3 style="margin:10px 0 0 0; font-size:15px; font-weight:600;">1. 搜索引擎列表</h3>
        <p style="margin:0 0 10px 0; font-size:12px; opacity:0.6;">自定义配置。将鼠标悬停在输入框上可查看详细说明。</p>
        <div id="se-engine-list" style="display:flex; flex-direction:column; gap:10px;"></div>
        
        <div style="display:flex; gap:10px; margin-top:5px;">
            <button id="se-add-btn" class="se-btn se-btn-add">+ 添加新引擎</button>
            <button id="se-reset-btn" class="se-btn se-btn-reset">↺ 恢复默认列表</button>
            <button id="se-clear-cache-btn" class="se-btn se-btn-clear-cache">🗑️ 清空图标缓存</button>
        </div>

        <h3 style="margin:25px 0 5px 0; font-size:15px; font-weight:600;">2. 自动收起规则</h3>
        <p style="font-size:12px; opacity:0.6; margin:0 0 8px 0;">在以下域名中，侧边栏会自动收起。</p>
        
        <div class="se-input-group">
            <span class="se-label" title="只需输入域名片段，不需要 http 前缀。">域名黑名单 (部分匹配)</span>
            <textarea id="se-hide-hosts" class="se-textarea" spellcheck="false" 
                title="在该列表中的网站，侧边栏会自动收缩以防遮挡内容。请一行输入一个域名（如 bilibili.com）。">${config.autoHideList.join('\n')}</textarea>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:12px; border-top: 1px solid #dee2e6; padding-top:20px;">
            <button id="se-close-btn" class="se-btn se-btn-cancel">取消</button>
            <button id="se-save-btn" class="se-btn se-btn-save">保存并刷新</button>
        </div>
    `;

    modal.appendChild(panel);
    document.body.appendChild(modal);

    const listContainer = panel.querySelector('#se-engine-list');
    
    function renderRows() {
        listContainer.innerHTML = '';
        config.engines.forEach((engine, index) => {
            const row = document.createElement('div');
            row.className = 'se-row';
            
            const tips = {
                name: "显示在侧边栏按钮上的文字。例如：Google、B站。",
                domain: "请输入主域名（例如：bilibili.com），脚本将通过 Google 服务自动抓取该域名的 Favicon 图标。",
                url: "搜索结果页的完整链接前半部分（直到关键词参数之前）。例如：https://www.baidu.com/s?wd=",
                key: "网址中用于传递搜索词的参数名称（=号前面的那个词）。\n例如：百度是 wd，谷歌是 q，B站是 keyword。"
            };

            row.innerHTML = `
                <span style="font-weight:bold; width:24px; opacity:0.4; text-align:center; font-size:14px;">${index+1}</span>
                
                <div style="display:flex; flex-direction:column; flex:1; gap:12px;">
                    <div style="display:flex; gap:10px;">
                        <div class="se-input-group" style="width:160px;">
                            <span class="se-label" title="${tips.name}">搜索引擎名称</span>
                            <input type="text" placeholder="Name" value="${engine.name}" class="se-input se-name" title="${tips.name}">
                        </div>
                        <div class="se-input-group" style="flex:1;">
                            <span class="se-label" title="${tips.domain}">获取引擎图标的url</span>
                            <input type="text" placeholder="例如 google.com" value="${engine.domain}" class="se-input se-domain" title="${tips.domain}">
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div class="se-input-group" style="flex:1;">
                            <span class="se-label" title="${tips.url}">搜索 URL 前缀 (含 https/http)</span>
                            <input type="text" placeholder="https://..." value="${engine.searchUrl}" class="se-input se-url" title="${tips.url}">
                        </div>
                        <div class="se-input-group" style="width:140px;">
                            <span class="se-label" title="${tips.key}">搜索关键词参数名</span>
                            <input type="text" placeholder="q" value="${engine.keyName}" class="se-input se-key" title="${tips.key}">
                        </div>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:15px; margin-left:10px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <button class="se-btn se-btn-move se-up-btn" ${index===0?'disabled':''} title="上移">▲</button>
                        <button class="se-btn se-btn-move se-down-btn" ${index===config.engines.length-1?'disabled':''} title="下移">▼</button>
                    </div>
                    <button class="se-btn se-btn-del se-del-btn" title="删除此引擎">×</button>
                </div>
            `;
            
            row.querySelector('.se-up-btn').onclick = () => { [config.engines[index], config.engines[index-1]] = [config.engines[index-1], config.engines[index]]; renderRows(); };
            row.querySelector('.se-down-btn').onclick = () => { [config.engines[index], config.engines[index+1]] = [config.engines[index+1], config.engines[index]]; renderRows(); };
            row.querySelector('.se-del-btn').onclick = () => { if(confirm('确定删除此引擎吗？')) { config.engines.splice(index, 1); renderRows(); } };
            
            row.querySelector('.se-name').oninput = (e) => config.engines[index].name = e.target.value;
            row.querySelector('.se-domain').oninput = (e) => config.engines[index].domain = e.target.value;
            row.querySelector('.se-url').oninput = (e) => config.engines[index].searchUrl = e.target.value;
            row.querySelector('.se-key').oninput = (e) => config.engines[index].keyName = e.target.value;

            listContainer.appendChild(row);
        });
    }

    renderRows();

    panel.querySelector('#se-add-btn').onclick = () => {
        config.engines.push({ name: "", searchUrl: "", keyName: "q", domain: "" });
        renderRows();
        setTimeout(() => { listContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' }); }, 100);
    };

    panel.querySelector('#se-reset-btn').onclick = () => {
        if (!confirm("确定要恢复默认搜索引擎列表吗？\n\n1. 默认引擎（Google, YouTube, B站等）将恢复到顶部。\n2. 您自己添加的引擎将被保留，并移动到列表底部。")) return;
        const defaultUrls = new Set(DEFAULT_ENGINES.map(e => e.searchUrl));
        const userCustomEngines = config.engines.filter(e => !defaultUrls.has(e.searchUrl));
        config.engines = [...JSON.parse(JSON.stringify(DEFAULT_ENGINES)), ...userCustomEngines];
        renderRows();
        listContainer.scrollTop = 0;
        alert("恢复成功！自定义引擎已移至底部，请记得保存。");
    };

    panel.querySelector('#se-clear-cache-btn').onclick = () => {
        if (confirm("确定要清空所有本地缓存的图标吗？\n\n这可以解决图标显示错误或更新的问题。\n下次加载页面时将重新从网络下载图标。")) {
            clearIconCache();
        }
    };

    panel.querySelector('#se-close-btn').onclick = () => document.body.removeChild(modal);
    panel.querySelector('#se-save-btn').onclick = () => {
        const rawHosts = panel.querySelector('#se-hide-hosts').value;
        const newHosts = rawHosts.split('\n').map(s => s.trim()).filter(s => s);
        if (config.engines.some(e => !e.searchUrl || !e.name)) { alert("⚠️ 错误：请确保所有引擎的名称和URL都不为空！"); return; }
        saveConfig(config.engines, newHosts);
    };
}


function setupSearchLinks(keywords, config) {
  if (!keywords && !document.querySelector('#search-app-box')) return;
  if (!isTargetSite(config.engines)) return;

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isHideMode = config.autoHideList.some(host => window.location.hostname.includes(host));

  const mainDiv = document.createElement("div");
  mainDiv.id = "search-app-box";
  
  Object.assign(mainDiv.style, {
    position: "fixed", top: "180px", width: "120px",
    fontSize: "13px", fontFamily: "-apple-system, sans-serif",
    backgroundColor: isDarkMode ? 'hsla(0, 0%, 15%, .95)' : 'hsla(0, 0%, 100%, .95)',
    backdropFilter: "blur(12px)", webkitBackdropFilter: "blur(12px)",
    borderRadius: "0 12px 12px 0", zIndex: "99999",
    boxShadow: "2px 0 15px rgba(0,0,0,0.15)", overflow: "hidden",
    border: isDarkMode ? "1px solid #444" : "1px solid #ddd", borderLeft: "none",
    transition: "left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  });

  if (isHideMode) {
      mainDiv.style.left = "-100px"; 
      mainDiv.style.opacity = "0.9";
      mainDiv.style.cursor = "pointer";
  } else {
      mainDiv.style.left = "0px";
  }

  document.body.appendChild(mainDiv);

  const headerDiv = document.createElement('div');
  Object.assign(headerDiv.style, {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 8px 10px 15px',
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee",
  });
  
  const title = document.createElement('span');
  title.textContent = "快速切换";
  title.style.fontWeight = "600"; title.style.fontSize = "12px";
  title.style.color = isDarkMode ? '#999' : '#777';

  const settingsBtn = document.createElement('span');
  settingsBtn.innerHTML = "⚙️"; settingsBtn.style.cursor = "pointer";
  settingsBtn.title = "设置";
  settingsBtn.onclick = (e) => { e.stopPropagation(); createSettingsUI(); };

  headerDiv.appendChild(title);
  headerDiv.appendChild(settingsBtn);
  mainDiv.appendChild(headerDiv);

  config.engines.forEach(({ name, searchUrl, domain }) => {
    const link = document.createElement('a');
    link.href = `${searchUrl}${encodeURIComponent(keywords || "")}`;
    Object.assign(link.style, {
      display: 'flex', alignItems: 'center', padding: '10px 0 10px 15px',
      textDecoration: 'none', color: isDarkMode ? '#ddd' : '#333',
      transition: "all 0.2s ease", whiteSpace: "nowrap"
    });

    const icon = document.createElement('img');
    loadAndCacheIcon(icon, domain);

    Object.assign(icon.style, {
      width: '18px', height: '18px', marginRight: '10px',
      borderRadius: '3px', flexShrink: '0'
    });

    link.innerHTML = ''; 
    link.appendChild(icon);
    link.appendChild(document.createTextNode(name));

    link.addEventListener('mouseenter', () => {
      link.style.backgroundColor = isDarkMode ? '#3d3d3d' : '#f5f5f5';
      link.style.paddingLeft = '20px'; link.style.color = isDarkMode ? '#fff' : '#005bb7';
    });
    link.addEventListener('mouseleave', () => {
      link.style.backgroundColor = '';
      link.style.paddingLeft = '15px'; link.style.color = isDarkMode ? '#ddd' : '#333';
    });
    
    mainDiv.appendChild(link);
  });

  if (isHideMode) {
      window.addEventListener("mousemove", (e) => {
        if (e.clientX < 140 && e.clientY > 150 && e.clientY < 500) {
            mainDiv.style.left = "0px"; mainDiv.style.opacity = "1";
            mainDiv.style.boxShadow = "4px 0 25px rgba(0,0,0,0.25)";
        } else {
            mainDiv.style.left = "-100px"; mainDiv.style.opacity = "0.9";
            mainDiv.style.boxShadow = "none";
        }
      });
  }
}

(function() {
    'use strict';
    const config = getConfig();
    const keywords = getKeywords(config.engines);
    if (document.body) { setupSearchLinks(keywords, config); }
    else { window.addEventListener('DOMContentLoaded', () => setupSearchLinks(keywords, config)); }
    GM_registerMenuCommand("⚙️ 搜索引擎设置", createSettingsUI);
})();
