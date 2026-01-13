// ==UserScript==
// @name         豆瓣想读-ZLibrary+山西省图看板
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  仅在想读页面显示借阅看板，风格统一，支持自定义Token
// @author       Jaywxl & Assistant
// @match        https://book.douban.com/people/*/wish*
// @match        https://book.douban.com/mine?status=wish*
// @match        https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561225/%E8%B1%86%E7%93%A3%E6%83%B3%E8%AF%BB-ZLibrary%2B%E5%B1%B1%E8%A5%BF%E7%9C%81%E5%9B%BE%E7%9C%8B%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/561225/%E8%B1%86%E7%93%A3%E6%83%B3%E8%AF%BB-ZLibrary%2B%E5%B1%B1%E8%A5%BF%E7%9C%81%E5%9B%BE%E7%9C%8B%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_DOMAIN = 'zh.z-library.ec';
    let currentDomain = GM_getValue('zlib_domain', DEFAULT_DOMAIN);
    let libToken = GM_getValue('lib_token', '');

    // --- 菜单配置 ---
    GM_registerMenuCommand("🔧 设置 Z-Lib 域名", () => {
        const newDomain = prompt("请输入 Z-Library 域名:", currentDomain);
        if (newDomain) {
            GM_setValue('zlib_domain', newDomain.replace(/^https?:\/\//, '').replace(/\/$/, ''));
            location.reload();
        }
    });

    GM_registerMenuCommand("🔑 设置图书馆 Token", () => {
        const newToken = prompt("请输入图书馆 Authorization Token:", libToken);
        if (newToken !== null) {
            GM_setValue('lib_token', newToken.trim());
            location.reload();
        }
    });

    // --- 样式注入 ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* 借阅看板 & ZLib 盒子 统一风格 */
        .zlib-box, .lib-dashboard-box {
            margin: 0 0 15px 0;
            padding: 12px;
            border: 1px dashed #007722;
            background-color: #f6f9f2;
            font-size: 13px;
            border-radius: 6px;
            clear: both;
        }
        .lib-header, .zlib-header {
            font-weight: bold;
            color: #007722;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .lib-header a { color: #007722; text-decoration: none; }
        .lib-header a:hover { text-decoration: underline; }

        /* 网格布局 */
        .lib-list, .zlib-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }

        /* 每一项的卡片样式 */
        .lib-item, .zlib-item {
            background: #fff;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            transition: all 0.2s;
        }
        .lib-item:hover, .zlib-item:hover { border-color: #007722; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .lib-title, .zlib-link {
            color: #37a;
            font-weight: bold;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
        }
        .lib-info { color: #666; font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between; }

        /* 倒计时标签 */
        .days-tag { padding: 1px 5px; border-radius: 3px; font-weight: bold; color: #fff; font-size: 11px; }
        .days-safe { background: #52c41a; }
        .days-warning { background: #faad14; }
        .days-danger { background: #ff4d4f; animation: blink 1s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
    `;
    document.head.appendChild(style);

    // --- 日期处理 ---
    function getDaysInfo(retuDateStr) {
        const year = retuDateStr.substring(0, 4);
        const month = retuDateStr.substring(4, 6);
        const day = retuDateStr.substring(6, 8);
        const target = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        let type = "days-safe";
        if (diff <= 3) type = "days-danger";
        else if (diff <= 7) type = "days-warning";
        return { diff, type, date: `${year}-${month}-${day}` };
    }

    // --- 图书馆数据请求 ---
    function fetchLibraryData(callback) {
        if (!libToken) return callback(null);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://uilas.sxlib.org.cn/prod-api/readerBook/renewBookList?sortField=loanDate&sortBy=desc",
            headers: { "Authorization": libToken, "istoken": "true" },
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    callback(data.code === 200 ? data.data : null);
                } catch (e) { callback(null); }
            },
            onerror: () => callback(null)
        });
    }

    // --- 渲染借阅看板 ---
    function renderDashboard(books) {
        // 只在"想读"页面触发
        if (!location.href.includes('mine?status=wish')) return;

        const container = document.querySelector('#content .grid-16-8 .article') || document.querySelector('#content');
        if (!container) return;

        const board = document.createElement('div');
        board.className = 'lib-dashboard-box';
        
        let itemsHtml = books.map(book => {
            const info = getDaysInfo(book.retudate);
            return `
                <div class="lib-item">
                    <div class="lib-title" title="${book.title}">${book.title}</div>
                    <div class="lib-info">
                        <span>到期: ${info.date}</span>
                        <span class="days-tag ${info.type}">${info.diff}天</span>
                    </div>
                </div>
            `;
        }).join('');

        board.innerHTML = `
            <div class="lib-header">
                <a href="https://uilas.sxlib.org.cn/NTRdrLogin.do#/personal" target="_blank">📚 陕西省图借阅看板 </a>
                <span style="font-weight:normal; font-size:10px; color:#999;">共借阅 ${books.length} 本</span>
            </div>
            <div class="lib-list">${itemsHtml}</div>
        `;
        container.insertBefore(board, container.firstChild);
    }

    function init() {
        // 1. 如果在想读页面，加载看板
        if (location.href.includes('mine?status=wish')) {
            fetchLibraryData((books) => {
                if (books && books.length > 0) renderDashboard(books);
            });
        }

        // 2. 加载 Z-Lib 搜索框 (原有逻辑)
        const items = document.querySelectorAll('.subject-item, .interest-list .item, #wrapper');
        items.forEach((item) => {
            if (item.getAttribute('data-zlib-loaded') || (item.id === 'wrapper' && !document.querySelector('#info'))) return;
            item.setAttribute('data-zlib-loaded', 'true');

            let bookTitle = "";
            let bookAuthor = "";
            let targetContainer = null;

            if (item.classList.contains('subject-item') || item.classList.contains('item')) {
                const titleLink = item.querySelector('.info h2 a') || item.querySelector('.title a');
                const pubDiv = item.querySelector('.pub, .meta');
                if (titleLink) bookTitle = titleLink.textContent.replace(/\s+/g, ' ').trim().split(' ')[0].split('（')[0].split(':')[0];
                if (pubDiv) bookAuthor = pubDiv.textContent.split('/')[0].trim().replace(/\[.*?\]/g, '').trim();
                targetContainer = item.querySelector('.info') || item;
            } else if (item.id === 'wrapper') {
                const titleNode = document.querySelector('h1 span');
                bookTitle = titleNode ? titleNode.textContent.trim() : "";
                const infoSpans = document.querySelectorAll('#info span.pl');
                for (let span of infoSpans) {
                    if (span.textContent.includes('作者')) {
                        bookAuthor = span.nextElementSibling.textContent.trim();
                        break;
                    }
                }
                targetContainer = document.querySelector('#info');
            }

            if (!bookTitle) return;

            const zBox = document.createElement('div');
            zBox.className = 'zlib-box';
            zBox.innerHTML = `
                <div class="zlib-header">
                    <span>Z-Lib 搜索: ${bookTitle}</span>
                    <span style="font-weight:normal; font-size:10px; color:#999;">${currentDomain}</span>
                </div>
                <div class="zlib-content">查询中...</div>`;
            
            if (targetContainer) targetContainer.insertBefore(zBox, targetContainer.firstChild);
            fetchZLib(bookTitle, bookAuthor, zBox);
        });
    }

    function fetchZLib(title, author, container) {
        const query = `${title} ${author}`.trim();
        const url = `https://${currentDomain}/s/?q=${encodeURIComponent(query)}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status !== 200) {
                    container.querySelector('.zlib-content').innerHTML = `域名失效`;
                    return;
                }
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const books = doc.querySelectorAll('z-bookcard');
                const content = container.querySelector('.zlib-content');
                if (!books || books.length === 0) {
                    content.innerHTML = `<span style="color: #999;">未找到资源</span>`;
                    return;
                }
                let html = `<div class="zlib-list">`;
                const limit = Math.min(books.length, 4);
                for (let i = 0; i < limit; i++) {
                    const b = books[i];
                    const zTitle = b.querySelector('[slot="title"]')?.textContent.trim() || "未知";
                    const bSize = b.getAttribute('filesize') || "";
                    const bExt = b.getAttribute('extension') || "";
                    const bHref = `https://${currentDomain}` + b.getAttribute('href');
                    html += `
                        <div class="zlib-item">
                            <a class="zlib-link" href="${bHref}" target="_blank" title="${zTitle}">${zTitle}</a>
                            <div class="lib-info"><span>${bExt.toUpperCase()}</span> <span>${bSize}</span></div>
                        </div>`;
                }
                html += `</div>`;
                content.innerHTML = html;
            }
        });
    }

    setTimeout(init, 1000);
})();