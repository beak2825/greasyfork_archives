// ==UserScript==
// @name         DeepWiki History Tracker
// @name:zh-CN   DeepWiki 历史记录追踪器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  DeepWiki (deepwiki.com) lacks a native history feature. This script auto-saves your viewed repos and chat history to a floating sidebar.
// @description:zh-CN  DeepWiki (deepwiki.com) 缺乏原生的历史记录功能。此脚本会自动将您浏览过的 GitHub 仓库和 AI 对话记录保存到侧边栏，支持 URL 解析和智能命名。
// @author       Little Midas
// @match        https://deepwiki.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://deepwiki.com/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563999/DeepWiki%20History%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563999/DeepWiki%20History%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置 =================
    const CONFIG = {
        storageKey: 'deepwiki_history_v5', // 再次升级 Key，确保从头开始
        maxHistory: 30,
        historyPanelWidth: '320px'
    };

    // ================= 样式 (无变化) =================
    const styles = `
        #dw-history-toggle {
            position: fixed; bottom: 30px; right: 30px;
            width: 48px; height: 48px;
            background: #2563eb; border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            cursor: pointer; z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 22px; transition: transform 0.2s;
        }
        #dw-history-toggle:hover { transform: scale(1.1); background: #1d4ed8; }
        #dw-history-panel {
            position: fixed; top: 0; right: -${CONFIG.historyPanelWidth};
            width: ${CONFIG.historyPanelWidth}; height: 100vh;
            background: #0f0f0f; border-left: 1px solid #333;
            box-shadow: -10px 0 30px rgba(0,0,0,0.7);
            z-index: 10000; transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column; color: #e5e5e5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #dw-history-panel.open { right: 0; }
        .dw-panel-header {
            padding: 16px 20px; border-bottom: 1px solid #2a2a2a;
            display: flex; justify-content: space-between; align-items: center; background: #181818;
        }
        .dw-panel-title { font-weight: 600; font-size: 15px; }
        .dw-close-btn { cursor: pointer; color: #888; } .dw-close-btn:hover { color: white; }
        .dw-history-list { flex: 1; overflow-y: auto; padding: 12px; }
        .dw-history-item {
            display: flex; flex-direction: column; padding: 12px; margin-bottom: 8px;
            background: #1a1a1a; border: 1px solid #333; border-radius: 8px;
            text-decoration: none; color: #ccc; transition: all 0.2s;
        }
        .dw-history-item:hover { background: #252525; border-color: #555; }
        .dw-item-header { display: flex; align-items: flex-start; gap: 8px; }
        .dw-type-icon { font-size: 16px; margin-top: 1px; flex-shrink: 0; }
        .dw-item-title { font-size: 14px; font-weight: 500; word-break: break-word; color: #fff; line-height: 1.4; }
        .dw-item-meta {
            display: flex; justify-content: space-between; align-items: center;
            margin-top: 8px; padding-top: 8px; border-top: 1px solid #2a2a2a;
            font-size: 11px; color: #666;
        }
        .dw-tag { padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .dw-tag.chat { background: #3730a3; color: #c7d2fe; }
        .dw-tag.repo { background: #064e3b; color: #a7f3d0; }
        .dw-panel-footer { padding: 15px; border-top: 1px solid #2a2a2a; text-align: center; background: #181818; }
        .dw-clear-btn { background: transparent; border: 1px solid #444; color: #888; padding: 6px 14px; border-radius: 4px; cursor: pointer; }
        .dw-clear-btn:hover { border-color: #ef4444; color: #ef4444; }
    `;
    GM_addStyle(styles);

    // ================= 核心逻辑：混合识别引擎 =================

    const HybridEngine = {
        // 工具：检查字符串是否像一个 repo (例如 user/repo)
        isRepoLike: (str) => {
            if (!str) return false;
            // 必须包含 /，且不包含 deepwiki.com，且不是 Search
            return str.includes('/') && !str.includes('deepwiki.com') && !str.toLowerCase().startsWith('search');
        },

        // 策略1：从 URL 获取 (最稳，针对文档页)
        getFromURL: () => {
            const path = window.location.pathname; // 例如 /github/user/repo 或 /user/repo
            const parts = path.split('/').filter(p => p);

            // 排除 search 页面
            if (path.includes('/search/')) return null;

            // 情况 A: /github/user/repo
            if (parts[0] === 'github' && parts.length >= 3) {
                return `${parts[1]}/${parts[2]}`;
            }
            // 情况 B: /user/repo (直接跟在域名后)
            if (parts.length >= 2 && parts[0] !== 'search') {
                return `${parts[0]}/${parts[1]}`;
            }
            return null;
        },

        // 策略2：从 DOM 获取 (针对对话页)
        getFromDOM: () => {
            // 扫描所有 A 标签
            const allLinks = Array.from(document.querySelectorAll('a'));

            // 寻找最像 Repo 名字的链接
            // 特征：href 包含 '/'，且文本包含 '/'，且出现在页面顶部区域
            const candidate = allLinks.find(a => {
                const text = a.innerText.trim();
                const href = a.getAttribute('href');

                if (!href || href === '/' || href.includes('login')) return false;

                // v5修正：不再强制 href 包含 'github'，只要文本像 user/repo 即可
                // 这样能兼容 996icu/996.ICU 这种可能没有 github 前缀的情况
                if (text.includes('/') && text.split('/').length === 2) {
                    // 排除掉 "Search/..." 这种可能的误判
                    if (text.toLowerCase().includes('search')) return false;
                    return true;
                }
                return false;
            });

            if (candidate) {
                return candidate.innerText.replace(/←|->/g, '').trim();
            }

            return null;
        },

        // 主解析函数
        resolveName: () => {
            // 1. 优先尝试 URL (文档页秒杀)
            const urlName = HybridEngine.getFromURL();
            if (urlName) return urlName;

            // 2. 尝试 DOM (对话页)
            const domName = HybridEngine.getFromDOM();
            if (domName) return domName;

            return null;
        }
    };

    const StorageManager = {
        getHistory: () => {
            try { return JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]'); } catch { return []; }
        },

        saveItem: (name, url, type) => {
            // 终极过滤：绝对不要保存 Search 或 Format JSON
            if (!name || name === 'Search' || name === 'DeepWiki' || name.includes('Format JSON')) return;

            let history = StorageManager.getHistory();
            history = history.filter(item => item.url !== url); // 去重

            history.unshift({
                name: name,
                url: url,
                type: type,
                timestamp: Date.now()
            });

            if (history.length > CONFIG.maxHistory) history = history.slice(0, CONFIG.maxHistory);
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
            UIManager.renderList();
        },

        // 轮询尝试保存 (解决 SPA 加载慢的问题)
        startTracker: () => {
            const currentUrl = window.location.href;
            if (currentUrl === 'https://deepwiki.com/') return;

            const type = (currentUrl.includes('/search/') || currentUrl.includes('search-result')) ? 'chat' : 'repo';
            let attempts = 0;

            const interval = setInterval(() => {
                attempts++;
                const name = HybridEngine.resolveName();

                if (name) {
                    StorageManager.saveItem(name, currentUrl, type);
                    clearInterval(interval);
                } else if (attempts >= 10) {
                    // 兜底逻辑：如果实在找不到名字，且是 Repo 页，强制用 URL 的后两段
                    // 避免“一片空白”
                    if (type === 'repo') {
                        const parts = window.location.pathname.split('/').filter(p=>p);
                        if(parts.length >= 2) {
                             StorageManager.saveItem(`${parts[parts.length-2]}/${parts[parts.length-1]}`, currentUrl, type);
                        }
                    }
                    clearInterval(interval);
                }
            }, 800); // 每0.8秒试一次
        },

        clearHistory: () => {
            if(confirm('Clear all?')) {
                localStorage.removeItem(CONFIG.storageKey);
                UIManager.renderList();
            }
        }
    };

    // ================= UI (无变化) =================
    const UIManager = {
        init: () => {
            const btn = document.createElement('div');
            btn.id = 'dw-history-toggle';
            btn.innerHTML = '📂';
            btn.onclick = () => document.getElementById('dw-history-panel').classList.toggle('open');
            document.body.appendChild(btn);

            const panel = document.createElement('div');
            panel.id = 'dw-history-panel';
            panel.innerHTML = `
                <div class="dw-panel-header">
                    <span class="dw-panel-title">Browsing History</span>
                    <span class="dw-close-btn" onclick="document.getElementById('dw-history-panel').classList.remove('open')">✕</span>
                </div>
                <div class="dw-history-list" id="dw-history-list"></div>
                <div class="dw-panel-footer"><button class="dw-clear-btn" id="dw-clear-btn">Clear All</button></div>
            `;
            document.body.appendChild(panel);
            document.getElementById('dw-clear-btn').onclick = StorageManager.clearHistory;
            UIManager.renderList();
        },

        renderList: () => {
            const list = document.getElementById('dw-history-list');
            const history = StorageManager.getHistory();
            if (history.length === 0) {
                list.innerHTML = '<div style="color:#666;text-align:center;padding:20px;font-size:13px">Waiting for data...<br>(Visit a repo to start)</div>';
                return;
            }
            list.innerHTML = history.map(item => `
                <a href="${item.url}" class="dw-history-item">
                    <div class="dw-item-header">
                        <span class="dw-type-icon">${item.type === 'chat' ? '💬' : '📖'}</span>
                        <span class="dw-item-title">${item.name}</span>
                    </div>
                    <div class="dw-item-meta">
                        <span class="dw-tag ${item.type}">${item.type === 'chat' ? 'CHAT' : 'DOCS'}</span>
                        <span>${new Date(item.timestamp).toLocaleString([], {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                </a>
            `).join('');
        }
    };

    // ================= 启动 =================
    const NavigationObserver = {
        init: () => {
            ['pushState', 'replaceState'].forEach(evt => {
                const original = history[evt];
                history[evt] = function() {
                    original.apply(this, arguments);
                    StorageManager.startTracker();
                };
            });
            window.addEventListener('popstate', () => StorageManager.startTracker());
            setTimeout(StorageManager.startTracker, 500);
        }
    };

    UIManager.init();
    NavigationObserver.init();
})();