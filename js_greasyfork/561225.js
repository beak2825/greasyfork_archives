// ==UserScript==
// @name         豆瓣想读-ZLibrary助手
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在豆瓣书籍信息上方直接嵌入Z-Library搜索结果，支持自定义域名
// @author       Jaywxl
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
// @downloadURL https://update.greasyfork.org/scripts/561225/%E8%B1%86%E7%93%A3%E6%83%B3%E8%AF%BB-ZLibrary%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561225/%E8%B1%86%E7%93%A3%E6%83%B3%E8%AF%BB-ZLibrary%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 域名配置逻辑 ---
    // 默认域名，如果无法访问，用户可以通过菜单更改
    const DEFAULT_DOMAIN = 'zh.z-library.ec';
    let currentDomain = GM_getValue('zlib_domain', DEFAULT_DOMAIN);

    // 注册菜单命令
    GM_registerMenuCommand("🔧 设置 Z-Lib 域名", () => {
        const newDomain = prompt("请输入 Z-Library 域名 (例如: zh.z-library.se 或 z-library.do)\n当前域名: " + currentDomain, currentDomain);
        if (newDomain !== null && newDomain.trim() !== "") {
            // 清理用户输入的协议头和结尾斜杠
            const cleanDomain = newDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
            GM_setValue('zlib_domain', cleanDomain);
            alert("域名已更新为: " + cleanDomain + "\n页面即将刷新以应用设置。");
            location.reload();
        }
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .zlib-box {
            margin: 0 0 10px 0;
            padding: 10px;
            border: 1px dashed #007722;
            background-color: #f6f9f2;
            font-size: 13px;
            border-radius: 6px;
            clear: both;
        }
        .zlib-header {
            font-weight: bold;
            color: #007722;
            margin-bottom: 8px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            display: flex;
            justify-content: space-between;
        }
        .zlib-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .zlib-item {
            background: #fff;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            transition: all 0.2s;
        }
        .zlib-item:hover { border-color: #007722; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .zlib-link {
            color: #37a;
            text-decoration: none;
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }
        .zlib-author {
            color: #666;
            font-size: 12px;
            margin: 2px 0;
            font-style: italic;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .zlib-meta { color: #888; font-size: 11px; margin-top: auto; padding-top: 4px; }
        .zlib-tag { background: #eef; color: #66b; padding: 1px 4px; border-radius: 2px; margin-right: 3px; }
    `;
    document.head.appendChild(style);

    function init() {
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
                
                if (titleLink) {
                    bookTitle = titleLink.textContent.replace(/\s+/g, ' ').trim().split(' ')[0].split('（')[0].split(':')[0];
                }
                if (pubDiv) {
                    const rawAuthor = pubDiv.textContent.split('/')[0].trim();
                    bookAuthor = rawAuthor.replace(/\[.*?\]/g, '').trim();
                }
                targetContainer = item.querySelector('.info') || item;
            } 
            else if (item.id === 'wrapper') {
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
                    <span>Z-Lib 搜索: ${bookTitle} ${bookAuthor}</span>
                    <span style="font-weight:normal; font-size:10px; color:#999;">来源: ${currentDomain}</span>
                </div>
                <div class="zlib-content">查询中...</div>`;
            
            if (targetContainer && targetContainer.firstChild) {
                targetContainer.insertBefore(zBox, targetContainer.firstChild);
            } else if (targetContainer) {
                targetContainer.appendChild(zBox);
            }

            fetchZLib(bookTitle, bookAuthor, zBox);
        });
    }

    function fetchZLib(title, author, container) {
        const query = `${title} ${author}`.trim();
        // 使用配置的域名组装 URL
        const url = `https://${currentDomain}/s/?q=${encodeURIComponent(query)}`;
        
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                // 如果返回 403 或 404，可能是域名失效
                if (response.status !== 200) {
                    container.querySelector('.zlib-content').innerHTML = `<span style="color:orange;">域名可能失效 (HTTP ${response.status})，请在脚本菜单中更换新域名。</span>`;
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const books = doc.querySelectorAll('z-bookcard');
                const content = container.querySelector('.zlib-content');

                if (!books || books.length === 0) {
                    content.innerHTML = `<span style="color: #999;">未找到相关资源</span>`;
                    return;
                }

                let html = `<div class="zlib-list">`;
                const limit = Math.min(books.length, 6);

                for (let i = 0; i < limit; i++) {
                    const b = books[i];
                    const zTitle = b.querySelector('[slot="title"]')?.textContent.trim() || "未知书名";
                    const zAuthor = b.querySelector('[slot="author"]')?.textContent.trim() || "未知作者";
                    const bSize = b.getAttribute('filesize') || "未知大小";
                    const bExt = b.getAttribute('extension') || "未知格式";
                    const bHref = `https://${currentDomain}` + b.getAttribute('href');

                    html += `
                        <div class="zlib-item">
                            <a class="zlib-link" href="${bHref}" target="_blank" title="${zTitle}">${zTitle}</a>
                            <div class="zlib-author" title="${zAuthor}">${zAuthor}</div>
                            <div class="zlib-meta">
                                <span class="zlib-tag">${bExt.toUpperCase()}</span>
                                <span>${bSize}</span>
                            </div>
                        </div>
                    `;
                }
                html += `</div>`;
                content.innerHTML = html;
            },
            onerror: () => {
                container.querySelector('.zlib-content').innerHTML = `<span style="color:red;">无法访问 ${currentDomain}，请检查域名是否被墙或通过脚本菜单更换。</span>`;
            }
        });
    }

    setTimeout(init, 1200);
})();