// ==UserScript==
// @name         TikTok 视频信息提取器
// @name:en      TikTok Video Info Extractor
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在TikTok视频页面左下角添加按钮，可提取视频信息、一键生成插表SQL。
// @description:en Add buttons in the bottom-left of TikTok video pages to extract video info and generate an SQL INSERT statement.
// @author       SoyaDokio (Enhanced by AI)
// @match        https://www.tiktok.com/@*/video/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559836/TikTok%20%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559836/TikTok%20%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 注入样式 ---
    GM_addStyle(`
        #extractor-controls-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }

        #info-extractor-button {
            background-color: #FE2C55;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, transform 0.2s;
        }
        #info-extractor-button:hover {
            background-color: #E71D43;
            transform: translateY(-2px);
        }

        #copy-sql-button {
            background-color: #25D366;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, transform 0.2s;
        }
        #copy-sql-button:hover {
            background-color: #1EAE54;
            transform: translateY(-2px);
        }

        #info-extractor-card {
            position: fixed;
            bottom: 70px;
            left: 20px;
            z-index: 9998;
            background-color: white;
            border: 1px solid #E0E0E0;
            border-radius: 12px;
            padding: 20px;
            width: 350px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            color: #333;
            box-sizing: border-box;
        }

        .info-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            line-height: 1.6;
        }

        .info-row strong {
            font-weight: 600;
            color: #161823;
            margin-right: 8px;
            flex-shrink: 0;
            width: 75px;
        }

        .info-value-wrapper {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            word-break: break-word;
        }

        .info-value {
            background-color: #f1f1f2;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Menlo', 'Consolas', monospace;
        }

        .copy-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            margin-left: 8px;
            flex-shrink: 0;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        .copy-btn:hover {
            opacity: 1;
        }
        .copy-btn svg {
            width: 16px;
            height: 16px;
            display: block;
        }

        #info-extractor-toast {
            position: fixed;
            bottom: 120px;
            left: 20px;
            z-index: 10000;
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
        }
        #info-extractor-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
    `);

    // --- 2. 创建 UI 元素 ---
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'extractor-controls-container';
    document.body.appendChild(controlsContainer);

    const button = document.createElement('button');
    button.id = 'info-extractor-button';
    button.innerText = '提取信息';
    controlsContainer.appendChild(button);

    const sqlButton = document.createElement('button');
    sqlButton.id = 'copy-sql-button';
    sqlButton.innerText = '复制插表SQL';
    controlsContainer.appendChild(sqlButton);

    const card = document.createElement('div');
    card.id = 'info-extractor-card';
    const copyIconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;
    card.innerHTML = `
        <div class="info-row">
            <strong>标题:</strong>
            <div class="info-value-wrapper">
                <span class="info-value" id="info-title"></span>
                <button class="copy-btn" data-copy-target="info-title" data-copy-label="标题">${copyIconSvg}</button>
            </div>
        </div>
        <div class="info-row">
            <strong>描述:</strong>
            <div class="info-value-wrapper">
                <span class="info-value" id="info-desc"></span>
                <button class="copy-btn" data-copy-target="info-desc" data-copy-label="描述">${copyIconSvg}</button>
            </div>
        </div>
        <div class="info-row">
            <strong>作者:</strong>
            <div class="info-value-wrapper">
                <span class="info-value" id="info-author"></span>
                <button class="copy-btn" data-copy-target="info-author" data-copy-label="作者">${copyIconSvg}</button>
            </div>
        </div>
        <div class="info-row">
            <strong>发布日期:</strong>
            <div class="info-value-wrapper">
                <span class="info-value" id="info-date"></span>
                <button class="copy-btn" data-copy-target="info-date" data-copy-label="发布日期">${copyIconSvg}</button>
            </div>
        </div>
        <div class="info-row">
            <strong>URL:</strong>
            <div class="info-value-wrapper">
                <span class="info-value" id="info-url"></span>
                <button class="copy-btn" data-copy-target="info-url" data-copy-label="URL">${copyIconSvg}</button>
            </div>
        </div>
    `;
    document.body.appendChild(card);

    const toast = document.createElement('div');
    toast.id = 'info-extractor-toast';
    document.body.appendChild(toast);

    // --- 3. 辅助函数 ---

    function showToast(message) {
        clearTimeout(toastTimer);
        toast.innerText = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    let toastTimer;

    function escapeSql(value) {
        if (typeof value !== 'string') return value;
        return value.replace(/'/g, "''");
    }

    /**
     * 新增：根据 TikTok 视频 ID 计算发布日期
     */
    function getPublishDate(tiktokUrl) {
        try {
            const url = tiktokUrl || window.location.href;
            // 提取视频 ID：匹配 /video/ 后面的数字
            const regex = /\/video\/(\d+)/;
            const match = url.match(regex);
            if (!match) return '未找到';

            const vidId = match[1];

            // 1. 获取 ID 的 64 位二进制表示，前 31 位即为 Unix 时间戳
            const asBinary = BigInt(vidId).toString(2);
            const first31Chars = asBinary.slice(0, 31);
            const unixTimestamp = parseInt(first31Chars, 2);

            // 2. 转换为日期对象
            const dateObject = new Date(unixTimestamp * 1000);

            // 3. 格式化输出 (保持为 YYYY-MM-DD HH:MM:SS 以适配原本的 SQL 逻辑)
            // 格式化函数：补零
            const pad = (n) => String(n).padStart(2, '0');

            const year = dateObject.getFullYear();
            const month = pad(dateObject.getMonth() + 1);
            const day = pad(dateObject.getDate());
            const hours = pad(dateObject.getHours());
            const minutes = pad(dateObject.getMinutes());
            const seconds = pad(dateObject.getSeconds());

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error('解析发布日期失败:', e);
            return '解析失败';
        }
    }

    // --- 4. 信息提取逻辑 ---

    function extractVideoInfo() {
        const info = {
            title: '未找到',
            desc: '未找到',
            author: '未找到',
            publish_date: '未找到',
            url: window.location.href
        };

        try {
            info.title = document.title.replace(/\s*\|\s*TikTok$/, '').trim();
        } catch (e) {
            console.error('提取标题失败:', e);
        }

        try {
            const descContainer = document.querySelector('div[data-e2e="video-desc"]');
            if (descContainer) {
                const baseDescElement = descContainer.querySelector(':scope > span:first-child');
                let finalDesc = baseDescElement ? baseDescElement.innerText : '';
                const tagElements = descContainer.querySelectorAll('a > p');
                tagElements.forEach(tag => {
                    if (tag.innerText) {
                        finalDesc += ` ${tag.innerText}`;
                    }
                });
                info.desc = finalDesc.trim();
            }
        } catch (e) {
            console.error('提取描述失败:', e);
        }

        try {
            const url = window.location.href;
            const authorMatch = url.match(/tiktok\.com\/@([^/]+)/);
            if (authorMatch && authorMatch[1]) {
                info.author = authorMatch[1];
            }
        } catch (e) {
            console.error('提取作者失败:', e);
        }

        // 修改：使用新的逻辑提取发布日期
        info.publish_date = getPublishDate(info.url);

        return info;
    }

    // --- 5. 更新卡片内容 ---
    function updateCard(info) {
        document.getElementById('info-title').innerText = info.title || '无';
        document.getElementById('info-desc').innerText = info.desc || '无';
        document.getElementById('info-author').innerText = info.author || '无';
        document.getElementById('info-date').innerText = info.publish_date || '无';
        document.getElementById('info-url').innerText = info.url || '无';
    }

    // --- 6. 绑定事件 ---
    button.addEventListener('click', () => {
        const isVisible = card.style.display === 'block';
        if (isVisible) {
            card.style.display = 'none';
            button.innerText = '提取信息';
        } else {
            const videoInfo = extractVideoInfo();
            updateCard(videoInfo);
            card.style.display = 'block';
            button.innerText = '隐藏信息';
        }
    });

    card.addEventListener('click', (event) => {
        const copyButton = event.target.closest('.copy-btn');
        if (copyButton) {
            const targetId = copyButton.dataset.copyTarget;
            const label = copyButton.dataset.copyLabel;
            const contentElement = document.getElementById(targetId);
            if (contentElement) {
                const textToCopy = contentElement.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`已复制: ${label}`);
                }).catch(err => {
                    console.error('复制失败:', err);
                    showToast('复制失败!');
                });
            }
        }
    });

    document.getElementById('copy-sql-button').addEventListener('click', () => {
        const info = extractVideoInfo();
        const author = escapeSql(info.author);
        const publish_date = escapeSql(info.publish_date);
        const title = escapeSql(info.title);
        const desc = escapeSql(info.desc);
        const url = escapeSql(info.url);

        const sql = `INSERT INTO my_shorts_creative.t_source_tiktok(tiktok_author, tiktok_publish_date, tiktok_title, tiktok_description, tiktok_url) VALUES ('${author}', '${publish_date}', '${title}', '${desc}', '${url}');`;

        navigator.clipboard.writeText(sql).then(() => {
            showToast('已成功复制插表SQL');
        }).catch(err => {
            console.error('SQL复制失败:', err);
            showToast('SQL复制失败!');
        });
    });

})();