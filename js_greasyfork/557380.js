// ==UserScript==
// @name         豆瓣小组预览卡片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无需进入帖子，在列表中预览
// @author       Google Gemini
// @match        https://www.douban.com/group/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557380/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%A2%84%E8%A7%88%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/557380/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%A2%84%E8%A7%88%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 样式优化区域 =================
    const style = `
        /* 列表页的“预览”按钮 (不变) */
        .dbp-btn {
            display: inline-block;
            margin-left: 8px;
            padding: 1px 8px;
            font-size: 12px;
            color: #555;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
        }
        .dbp-btn:hover {
            background-color: #e9e9e9;
            color: #333;
            border-color: #ccc;
        }

        /* 预览卡片容器：舒适间距和较小字体 */
        .dbp-container {
            background: #fff;
            padding: 8px 10px; /* 垂直 8px, 水平 10px */
            margin: 4px 0 8px 0; 
            border-radius: 8px;
            border: 1px solid #ebf0f5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            color: #333;
            font-size: 14px; 
            line-height: 1.7;
            position: relative;
            width: 100%; 
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }

        /* 正文区域 */
        .dbp-content {
            width: 100%;
            overflow: hidden;
            margin-bottom: 0; 
        }
        
        /* 确保第一个/最后一个元素的 margin 不和容器 padding 叠加 */
        .dbp-content > :first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
        .dbp-content > :last-child {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
        }

        /* 恢复 p 标签的基础样式 */
        .dbp-content p {
            margin: 0 0 1em 0; 
            line-height: 1.7; 
        }

        /* 图片占位按钮 (不变) */
        .dbp-img-loader {
            display: inline-block;
            color: #007722 !important; 
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            text-decoration: none; 
            padding: 2px 0;
            margin: 5px 0;
            background: none !important;
            border: none !important;
        }
        .dbp-img-loader:hover {
            color: #007722 !important; 
            text-decoration: none !important; 
        }

        /* 实际显示的图片 (不变) */
        .dbp-content img {
            max-width: 100% !important;
            max-height: 350px !important; 
            width: auto !important;
            height: auto !important;
            display: block;
            margin: 10px 0;
            border-radius: 4px;
            object-fit: contain; 
            cursor: pointer; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        /* 底部操作栏：核心对齐调整 */
        .dbp-footer {
            border-top: 1px dashed #eee;
            padding-top: 8px; /* 调整为 8px，与 container 的 padding-bottom 8px 一致 */
            margin-top: auto;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 15px;
        }

        /* 底部链接样式：移除垂直 padding，确保文本位置由 footer padding 统一控制 */
        .dbp-footer a {
            font-size: 13px;
            color: #007722 !important;
            text-decoration: none;
            background: transparent !important; 
            display: inline-flex;
            align-items: center;
            padding: 0 5px; /* 垂直 padding 设为 0 */
        }
        .dbp-footer a:hover {
            text-decoration: underline;
            background-color: transparent !important;
            color: #006611 !important;
        }
        
        /* 收起按钮样式 (不变) */
        .dbp-close-btn {
            color: #999 !important;
        }
        .dbp-close-btn:hover {
            color: #666 !important;
            text-decoration: none !important;
        }
    `;

    document.head.appendChild(document.createElement('style')).innerHTML = style;

    // ================= 核心逻辑 (不变) =================

    const cache = {};

    function init() {
        const titles = document.querySelectorAll('table.olt td.title');
        if (!titles.length) return;

        titles.forEach(td => {
            const link = td.querySelector('a');
            if (!link) return;

            const btn = document.createElement('span');
            btn.className = 'dbp-btn';
            btn.innerText = '预览';

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                togglePreview(td, link.href);
            });

            if(!td.querySelector('.dbp-btn')) {
                if (link.nextSibling) {
                    td.insertBefore(btn, link.nextSibling);
                } else {
                    td.appendChild(btn);
                }
            }
        });
    }

    function togglePreview(containerTd, url) {
        let previewRow = containerTd.parentNode.nextSibling;
        while(previewRow && previewRow.nodeType !== 1) {
            previewRow = previewRow.nextSibling;
        }

        if (previewRow && previewRow.classList && previewRow.classList.contains('dbp-row')) {
            if (previewRow.dataset.url === url) {
                previewRow.style.display = (previewRow.style.display === 'none') ? 'table-row' : 'none';
                return;
            }
        }

        const tr = document.createElement('tr');
        tr.className = 'dbp-row';
        tr.dataset.url = url;
        
        const td = document.createElement('td');
        td.colSpan = 4;
        td.style.padding = '0';
        td.style.border = 'none';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'dbp-container';
        contentDiv.innerHTML = '<div class="dbp-loading">加载中...</div>';

        td.appendChild(contentDiv);
        tr.appendChild(td);

        const currentRow = containerTd.parentNode;
        currentRow.parentNode.insertBefore(tr, currentRow.nextSibling);

        fetchContent(url, contentDiv);
    }

    // 辅助函数：创建图片占位符
    function createPlaceholder(src) {
        const placeholder = document.createElement('span');
        placeholder.className = 'dbp-img-loader';
        placeholder.innerText = '查看图片';
        placeholder.dataset.src = src; 
        placeholder.title = '点击加载图片';
        return placeholder;
    }

    // 辅助函数：绑定图片加载和收回事件
    function bindImageToggleEvents(element) {
        
        if (element.classList.contains('dbp-img-loader')) {
            element.addEventListener('click', function loaderClickHandler() {
                const realSrc = this.dataset.src;
                
                const newImg = document.createElement('img');
                newImg.src = realSrc;
                newImg.referrerPolicy = "no-referrer"; 
                
                this.replaceWith(newImg);
                
                bindImageToggleEvents(newImg);
            }, { once: true });
            
        } else if (element.tagName === 'IMG') {
            element.addEventListener('click', function imageClickHandler() {
                const realSrc = this.src;
                
                const placeholder = createPlaceholder(realSrc);
                
                this.replaceWith(placeholder);
                
                bindImageToggleEvents(placeholder);
            }, { once: true });
        }
    }


    async function fetchContent(url, container) {
        if (cache[url]) {
            renderContent(container, cache[url], url);
            return;
        }

        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const text = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            let content = doc.querySelector('#link-report') || doc.querySelector('.topic-content');
            
            if (content) {
                content.querySelectorAll('script, style, iframe, .ad, div[id^="ad_"]').forEach(el => el.remove());
                
                content.querySelectorAll('img').forEach(img => {
                    const realSrc = img.dataset.src || img.src;
                    const placeholder = createPlaceholder(realSrc);
                    img.replaceWith(placeholder);
                });

                const htmlData = content.innerHTML;
                cache[url] = htmlData;
                renderContent(container, htmlData, url);
            } else {
                container.innerHTML = '<div style="padding:15px;color:#d9534f;">无法解析正文，可能是该小组需要加入后才能查看。</div>';
            }

        } catch (err) {
            console.error(err);
            container.innerHTML = '<div style="padding:15px;color:#d9534f;">网络请求失败，请稍后重试。</div>';
        }
    }

    function renderContent(container, html, url) {
        // 底部链接为 "详情" 和 "收起"
        const safeHtml = `
            <div class="dbp-content">
                ${html}
            </div>
            <div class="dbp-footer">
                <a href="${url}" target="_blank">详情</a> 
                <a href="javascript:;" class="dbp-close-btn">收起</a> 
            </div>
        `;
        container.innerHTML = safeHtml;

        container.querySelector('.dbp-close-btn').addEventListener('click', function() {
            this.closest('tr').style.display = 'none';
        });

        container.querySelectorAll('.dbp-img-loader').forEach(bindImageToggleEvents);
    }

    init();

    // 监听动态加载
    const observer = new MutationObserver((mutations) => {
        let shouldInit = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) shouldInit = true;
        });
        if (shouldInit) init();
    });

    const table = document.querySelector('table.olt');
    if (table) {
        observer.observe(table, { childList: true, subtree: true });
    }

})();