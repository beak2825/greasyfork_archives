// ==UserScript==
// @name         Bilibili 首页仅保留搜索框
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  移除Bilibili首页推荐，只保留居中搜索框和个人快捷入口（个人资料、动态、收藏、浏览历史）。
// @author       ApriesL
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/index.html
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563385/Bilibili%20%E9%A6%96%E9%A1%B5%E4%BB%85%E4%BF%9D%E7%95%99%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/563385/Bilibili%20%E9%A6%96%E9%A1%B5%E4%BB%85%E4%BF%9D%E7%95%99%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 样式定义 ===
    const css = `
        /* >>> A. 基础环境 <<< */
        html::before {
            content: "";
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #f6f7f8 !important;
            z-index: 10000 !important;
            pointer-events: auto !important;
        }

        body, html {
            overflow: hidden !important;
            height: 100vh !important;
            background-color: #f6f7f8 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        /* 隐藏 B站原有内容 */
        #i_cecream, #app, .bili-layout, .bili-header, .bili-footer, aside {
            display: none !important;
        }

        /* >>> B. 独立搜索框 (位于屏幕正中偏下一点) <<< */
        #my-google-search-container {
            position: fixed !important;
            top: 50% !important; /* 垂直居中 */
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 30000 !important;

            width: 640px !important;
            height: 54px !important;
            background: #fff !important;
            border: 1px solid #dfe1e5 !important;
            border-radius: 28px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;

            display: flex !important;
            align-items: center !important;
            padding: 0 15px !important;
            transition: all 0.2s !important;
        }

        #my-google-search-container:hover,
        #my-google-search-container.active {
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            background-color: #fff !important;
        }

        #my-custom-input {
            flex-grow: 1 !important;
            border: none !important;
            outline: none !important;
            height: 100% !important;
            font-size: 18px !important;
            color: #333 !important;
            background: transparent !important;
            margin: 0 10px !important;
        }

        #my-search-btn {
            width: 40px; height: 40px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
        }
        #my-search-btn:hover { background-color: #f1f3f4; }
        #my-search-btn svg { width: 22px; height: 22px; fill: #4285f4; }

        /* >>> C. 快捷导航栏 (位于搜索框上方 100px) <<< */
        #my-custom-nav {
            position: fixed !important;
            /* 计算逻辑：搜索框中心在50%，减去(搜索框半高 + 100px + 按钮高度) */
            bottom: 50% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            margin-bottom: 80px !important; /* 距离搜索框中心的距离 */

            z-index: 30000 !important;
            display: flex !important;
            gap: 40px !important; /* 按钮之间的间距加大，更大气 */
        }

        /* 单个按钮样式 */
        .my-nav-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            cursor: pointer !important;
            color: #5f6368 !important;
            padding: 10px 15px !important;
            border-radius: 12px !important;
            transition: all 0.2s !important;
        }

        .my-nav-item:hover {
            background-color: rgba(255,255,255,0.8) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
            transform: translateY(-2px) !important; /* 悬停轻微上浮 */
            color: #1a73e8 !important;
        }

        .my-nav-item:hover svg { fill: #1a73e8 !important; }

        /* 图标稍微放大一点，适应居中布局 */
        .my-nav-item svg {
            width: 32px !important;
            height: 32px !important;
            fill: #5f6368 !important;
            margin-bottom: 8px !important;
        }

        .my-nav-text {
            font-size: 14px !important;
            font-weight: 500 !important;
        }
    `;

    GM_addStyle(css);

    // === 2. 辅助：获取UID ===
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // === 3. 核心构建 ===
    function buildUI() {
        // --- A. 构建搜索框 ---
        if (!document.getElementById('my-google-search-container')) {
            const container = document.createElement('div');
            container.id = 'my-google-search-container';

            const input = document.createElement('input');
            input.id = 'my-custom-input';
            input.type = 'text';
            input.placeholder = '搜索 Bilibili...';
            input.autocomplete = 'off';

            const btn = document.createElement('div');
            btn.id = 'my-search-btn';
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>';

            container.appendChild(input);
            container.appendChild(btn);
            document.body.appendChild(container);

            // === 搜索核心修改：新标签页打开 ===
            const doSearch = () => {
                if (input.value.trim()) {
                    const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(input.value)}`;
                    window.open(url, '_blank'); // 这里的 _blank 表示新标签页
                }
            };

            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); }});
            btn.addEventListener('click', doSearch);
            input.addEventListener('focus', () => container.classList.add('active'));
            input.addEventListener('blur', () => container.classList.remove('active'));
        }

        // --- B. 构建居中快捷菜单 ---
        if (!document.getElementById('my-custom-nav')) {
            const nav = document.createElement('div');
            nav.id = 'my-custom-nav';

            const uid = getCookie('DedeUserID');
            const favLink = uid ? `https://space.bilibili.com/${uid}/favlist` : 'https://space.bilibili.com/';

            const items = [
                {
                    name: '动态',
                    url: 'https://t.bilibili.com/',
                    icon: '<svg viewBox="0 0 24 24"><path d="M17,10.43V2H7v8.43c0,0.35,0.18,0.68,0.49,0.86l4.18,2.51l-4.18,2.51C7.18,16.52,7,16.85,7,17.2V22h10v-4.8 c0-0.35-0.18-0.68-0.49-0.86l-4.18-2.51l4.18-2.51C16.82,11.11,17,10.79,17,10.43z M12,12.86l-1.96-1.18L12,10.5l1.96,1.18L12,12.86z"/></svg>'
                },
                {
                    name: '收藏',
                    url: favLink,
                    icon: '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
                },
                {
                    name: '历史',
                    url: 'https://www.bilibili.com/history',
                    icon: '<svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'
                },
                {
                    name: '我的',
                    url: 'https://space.bilibili.com/',
                    icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
                }
            ];

            items.forEach(item => {
                const link = document.createElement('a');
                link.className = 'my-nav-item';
                link.href = item.url;
                link.target = '_blank'; // 按钮本来就是新标签页打开，保持不变
                link.innerHTML = `${item.icon}<span class="my-nav-text">${item.name}</span>`;
                nav.appendChild(link);
            });

            document.body.appendChild(nav);
        }
    }

    // === 4. 执行 ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUI);
    } else {
        buildUI();
    }

    const observer = new MutationObserver(() => {
        if (!document.getElementById('my-google-search-container')) buildUI();
        const feed = document.querySelector('.bili-feed4');
        if (feed) feed.remove();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();