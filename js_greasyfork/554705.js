// ==UserScript==
// @name         Empornium 种子信息列增强
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在种子列表中增加一列，直接显示 overlay 信息（图片和详情），无需鼠标悬浮
// @author       江畔
// @match        https://www.empornium.sx/*
// @match        https://www.empornium.is/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.sx
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/554705/Empornium%20%E7%A7%8D%E5%AD%90%E4%BF%A1%E6%81%AF%E5%88%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554705/Empornium%20%E7%A7%8D%E5%AD%90%E4%BF%A1%E6%81%AF%E5%88%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        /* 预览列样式 */
        table.torrent_table td img {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        table.torrent_table td img:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .preview-placeholder {
            color: #999;
            font-size: 12px;
            padding: 10px;
        }
        .preview-error {
            color: #e74c3c;
            font-size: 11px;
            padding: 5px;
            text-align: center;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    /**
     * 提取 overlay 中的图片 URL
     */
    function extractImageUrl(scriptTag) {
        if (!scriptTag) return null;

        const scriptContent = scriptTag.textContent.trim();
        const overlayMatch = scriptContent.match(/var\s+overlay\d+\s*=\s*"(.+)"\s*$/s);

        if (!overlayMatch) return null;

        // 解析 overlay HTML 内容
        const overlayHTML = overlayMatch[1]
            .replace(/\\"/g, '"')
            .replace(/\\\//g, '/')
            .replace(/\\n/g, '')
            .replace(/<\\/g, '</');

        // 提取图片 URL
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = overlayHTML;
        const img = tempDiv.querySelector('img');

        return img ? img.getAttribute('src') : null;
    }

    /**
     * 创建预览单元格
     */
    function createPreviewCell(imgSrc) {
        const cell = document.createElement('td');
        cell.className = 'center';
        cell.style.cssText = 'vertical-align: middle; padding: 5px;';

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 50px;';

        let retryTimer = null; // 重试定时器

        // 加载图片的函数（支持自动重试）
        function loadImage() {
            // 清除之前的定时器
            if (retryTimer) {
                clearInterval(retryTimer);
                retryTimer = null;
            }

            // 清空容器
            container.innerHTML = '';

            if (!imgSrc) {
                const placeholder = document.createElement('div');
                placeholder.className = 'preview-placeholder';
                placeholder.textContent = '-';
                container.appendChild(placeholder);
                return;
            }

            const img = document.createElement('img');
            // 添加时间戳避免缓存问题
            img.src = imgSrc + (imgSrc.includes('?') ? '&' : '?') + '_t=' + Date.now();
            img.style.cssText = 'max-width: 200px; max-height: 150px; cursor: pointer; border-radius: 4px; display: block;';
            img.title = '点击查看大图';

            // 图片加载失败处理 - 每秒自动重试
            img.onerror = function() {
                this.remove();
                const errorMsg = document.createElement('div');
                errorMsg.className = 'preview-error';
                errorMsg.textContent = '图片加载失败，重试中...';
                container.appendChild(errorMsg);

                // 设置定时器，每秒重试一次
                retryTimer = setInterval(loadImage, 1000);
            };

            // 图片加载成功，清除定时器
            img.onload = function() {
                if (retryTimer) {
                    clearInterval(retryTimer);
                    retryTimer = null;
                }
            };

            // 点击图片在新标签页打开
            img.onclick = () => window.open(imgSrc, '_blank');

            container.appendChild(img);
        }

        // 初始加载
        loadImage();

        cell.appendChild(container);
        return cell;
    }

    /**
     * 处理单个种子行
     */
    function processTorrentRow(row) {
        const scriptTag = row.querySelector('script');
        const imgSrc = extractImageUrl(scriptTag);
        const previewCell = createPreviewCell(imgSrc);

        // 插入到第一列（cats_col）之后，作为第二列显示
        const firstCell = row.querySelector('td:first-child');
        if (firstCell) {
            firstCell.insertAdjacentElement('afterend', previewCell);
        }
    }

    /**
     * 处理表格
     */
    function processTable(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const headerRow = tbody.querySelector('tr.colhead');
        if (!headerRow) return;

        // 检查是否已处理过
        const existingPreview = Array.from(headerRow.querySelectorAll('td')).find(td =>
            td.textContent.includes('预览')
        );
        if (existingPreview) return;

        // 添加表头 - 插入到第一列之后
        const headerCell = document.createElement('td');
        headerCell.textContent = '预览';
        headerCell.style.cssText = 'width: 220px; text-align: center;';

        const firstHeaderCell = headerRow.querySelector('td:first-child');
        if (firstHeaderCell) {
            firstHeaderCell.insertAdjacentElement('afterend', headerCell);
        }

        // 处理所有种子行
        tbody.querySelectorAll('tr.torrent').forEach(processTorrentRow);
    }

    /**
     * 检查是否应该运行脚本（排除种子详情页）
     */
    function shouldRun() {
        const url = window.location.href;
        // 如果 URL 包含 torrents.php?id= 说明是详情页，不运行
        if (url.includes('torrents.php?id=')) {
            return false;
        }
        return true;
    }

    /**
     * 初始化
     */
    function init() {
        // 检查是否应该运行
        if (!shouldRun()) {
            return;
        }

        const tables = document.querySelectorAll('table.torrent_table');
        tables.forEach(processTable);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听动态加载的内容
    const observer = new MutationObserver(() => {
        // 检查是否应该运行
        if (!shouldRun()) {
            return;
        }

        document.querySelectorAll('table.torrent_table').forEach(table => {
            const headerRow = table.querySelector('tr.colhead');
            if (headerRow) {
                const hasPreview = Array.from(headerRow.querySelectorAll('td')).some(td =>
                    td.textContent.includes('预览')
                );
                if (!hasPreview) {
                    processTable(table);
                }
            }
        });
    });

    // 只在非详情页启动监听
    if (shouldRun()) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
