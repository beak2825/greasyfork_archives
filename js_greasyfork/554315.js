// ==UserScript==
// @name         NexusPHP 批量多页下载 (泛站适配)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  [V2.1 泛站适配] 在 NexusPHP 架构站点的种子列表页添加控制面板，允许指定页码范围，后台抓取所有范围内的种子并建立下载队列，最后统一、安全、带延迟地批量下载。
// @author       (Your Name) - Designed by Gemini & Original Author
// @match        *://*/torrents.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554315/NexusPHP%20%E6%89%B9%E9%87%8F%E5%A4%9A%E9%A1%B5%E4%B8%8B%E8%BD%BD%20%28%E6%B3%9B%E7%AB%99%E9%80%82%E9%85%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554315/NexusPHP%20%E6%89%B9%E9%87%8F%E5%A4%9A%E9%A1%B5%E4%B8%8B%E8%BD%BD%20%28%E6%B3%9B%E7%AB%99%E9%80%82%E9%85%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    // 1. 每次下载的间隔时间（毫秒）。
    const DOWNLOAD_DELAY = 1000; // 1秒/个
    // 2. 抓取每个页面HTML之间的间隔时间（毫秒）。
    const PAGE_FETCH_DELAY = 500; // 0.5秒/页
    // --- 配置项结束 ---

    /**
     * 辅助函数：休眠指定毫秒
     * @param {number} ms - 毫秒数
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 辅助函数：清理文件名中的非法字符
     * @param {string} filename - 原始文件名
     */
    const sanitizeFilename = (filename) => {
        // 移除 Windows/Linux/macOS 文件名中的非法字符
        return filename.replace(/[\\/:*?"<>|]/g, '_').trim();
    };

    /**
     * 【重要改动】辅助函数：使用 GM_xmlhttpRequest 代替 fetch
     * 原因：fetch 在跨域时，特别是对没有 CORS 头部的站点，可能无法获取内容。
     * GM_xmlhttpRequest (GM_XHR) 提供了跨域能力（@connect *），可以更可靠地抓取其他页面。
     * @param {string} url - 目标 URL
     * @returns {Promise<string>} - HTML 文本
     */
    const fetchPageContent = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(`HTTP Status ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject(`GM_XHR Error: ${error.error}`);
                }
            });
        });
    };

    /**
     * 辅助函数：创建并点击一个下载链接
     * @param {string} url - 下载的URL
     * @param {string} filename - 保存的文件名
     */
    const triggerBrowserDownload = (url, filename) => {
        try {
            const tempLink = document.createElement('a');
            tempLink.href = url;
            // 确保文件名有 .torrent 后缀
            if (!filename.toLowerCase().endsWith('.torrent')) {
                filename += '.torrent';
            }
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            return true;
        } catch (err) {
            console.error(`[NexusPHP Downloader] 模拟点击下载失败: ${filename}`, err);
            return false;
        }
    };

    /**
     * 获取当前 URL 并指定页码
     * @param {number} pageNumber - 目标页码
     * @returns {string} - 完整的 URL
     */
    const getPageUrl = (pageNumber) => {
        const url = new URL(window.location.href);
        // NexusPHP 架构通常使用 'page' 参数来分页
        url.searchParams.set('page', pageNumber);
        return url.href;
    };

    /**
     * 主下载函数 (V2.1)
     * @param {Event} event - 点击事件
     */
    async function downloadPageRange(event) {
        const downloadBtn = event.target;
        const startPageInput = document.getElementById('u2DownloaderStartPage');
        const endPageInput = document.getElementById('u2DownloaderEndPage');

        // 1. 验证输入
        const startPage = parseInt(startPageInput.value, 10);
        const endPage = parseInt(endPageInput.value, 10);

        if (isNaN(startPage) || isNaN(endPage) || startPage < 0 || endPage < startPage) {
            alert('请输入有效的起始和结束页码 (0或更大)，且结束页码必须大于等于起始页码。');
            return;
        }

        downloadBtn.disabled = true;
        const originalBtnText = downloadBtn.textContent;
        const downloadQueue = []; // 总下载队列

        // 2. 循环抓取所有页面
        try {
            for (let i = startPage; i <= endPage; i++) {
                downloadBtn.textContent = `[1/2 抓取] 正在抓取第 ${i} 页...`;
                console.log(`[NexusPHP Downloader] 正在抓取第 ${i} 页...`);
                const pageUrl = getPageUrl(i);

                try {
                    const htmlText = await fetchPageContent(pageUrl);

                    // 3. 解析 HTML 并查找种子
                    const parser = new DOMParser();
                    const pageDom = parser.parseFromString(htmlText, 'text/html');

                    // 【关键点：通用选择器】NexusPHP 架构的种子列表通常在 ID="torrent_table" 或 class="torrents" 的 table 中
                    // 种子下载图标通常是 download.php?id=XXX，且链接在 torrents.php 页面的表格中
                    const downloadLinks = pageDom.querySelectorAll('table.torrents a[href*="download.php?id="]');

                    const links = Array.from(downloadLinks).filter(a => {
                        // 过滤掉可能不是实际下载链接的元素，例如：下载图标<img>的父元素就是链接 itself
                        const isImgParent = a.querySelector('img.download[title="下载种子"]');
                        // 某些站点的种子链接本身就是下载链接，这里取 a 标签
                        return isImgParent || true;
                    });

                    // 去重，因为有些站点可能一个种子有两个下载链接（例如 img 和 纯文字）
                    const uniqueLinks = new Map();
                    links.forEach(link => {
                        uniqueLinks.set(link.href, link);
                    });

                    const finalLinks = Array.from(uniqueLinks.values());


                    if (finalLinks.length === 0) {
                        console.log(`[NexusPHP Downloader] 第 ${i} 页未找到种子。`);
                        continue;
                    }

                    console.log(`[NexusPHP Downloader] 第 ${i} 页找到 ${finalLinks.length} 个种子。`);

                    // 4. 提取信息并加入队列
                    for (const linkElement of finalLinks) {
                        const row = linkElement.closest('tr');
                        const relativeUrl = linkElement.getAttribute('href');
                        const downloadUrl = new URL(relativeUrl, window.location.origin).href;

                        let filename = `torrent_${new Date().getTime()}_p${i}.torrent`; // 默认文件名

                        // NexusPHP 架构的标题链接通常在同一行，且链接到 details.php?id=XXX
                        const detailsLink = row.querySelector('a[href*="details.php?id="]');

                        // 标题通常是 detailsLink 上的 title 属性，或者它的文本内容
                        let title = detailsLink ? (detailsLink.title || detailsLink.textContent) : null;

                        if (title) {
                            filename = `${sanitizeFilename(title)}`; // 不加 .torrent，由 triggerBrowserDownload 添加
                        } else {
                             // 尝试从下载链接的相邻 td 中获取标题，作为最后的手段
                             const titleCell = row.querySelector('td.rowfollow:nth-child(2) a[href*="details.php?id="], td.rowhead + td a[href*="details.php?id="]');
                             if(titleCell && titleCell.title) {
                                filename = `${sanitizeFilename(titleCell.title)}`;
                             }
                        }

                        // 避免重复添加，如果一个种子有两个下载按钮，通过 URL 去重
                        if (!downloadQueue.some(item => item.url === downloadUrl)) {
                            downloadQueue.push({ url: downloadUrl, name: filename });
                        }
                    }

                } catch (err) {
                    console.error(`[NexusPHP Downloader] 抓取第 ${i} 页时出错:`, err);
                }

                // 在抓取下一页之前短暂休眠，保护服务器
                await sleep(PAGE_FETCH_DELAY);
            } // 抓取循环结束

            // 5. 检查队列并确认
            if (downloadQueue.length === 0) {
                alert('在指定的所有页面中均未找到可下载的种子。');
                downloadBtn.textContent = originalBtnText;
                downloadBtn.disabled = false;
                return;
            }

            const totalDownloads = downloadQueue.length;
            const confirmed = confirm(
                `已成功抓取 ${endPage - startPage + 1} 个页面。\n` +
                `共找到 ${totalDownloads} 个唯一的种子。\n\n` +
                `即将以 ${DOWNLOAD_DELAY / 1000} 秒/个 的间隔开始批量下载。\n` +
                `!! 浏览器将询问“是否允许下载多个文件？”，请务必点击“允许”。\n\n` +
                `是否继续？`
            );

            if (!confirmed) {
                downloadBtn.textContent = originalBtnText;
                downloadBtn.disabled = false;
                return;
            }

            // 6. 开始处理下载队列
            let successCount = 0;
            for (let i = 0; i < totalDownloads; i++) {
                const task = downloadQueue[i];
                downloadBtn.textContent = `[2/2 下载] (${i + 1}/${totalDownloads}) ${task.name}`;

                console.log(`[NexusPHP Downloader] 准备启动下载 (${i + 1}/${totalDownloads}): ${task.name}`);

                if (triggerBrowserDownload(task.url, task.name)) {
                    successCount++;
                }

                // 每次下载之间必须延迟
                await sleep(DOWNLOAD_DELAY);
            }

            // 7. 下载完成
            downloadBtn.textContent = `✅ 已启动 ${successCount} / ${totalDownloads} 个下载`;
            setTimeout(() => {
                downloadBtn.textContent = originalBtnText;
                downloadBtn.disabled = false;
            }, 5000);

        } catch (error) {
            console.error('[NexusPHP Downloader] 抓取/下载循环出错:', error);
            alert('发生意外错误，请检查控制台 (F12)。');
            downloadBtn.textContent = originalBtnText;
            downloadBtn.disabled = false;
        }
    }

    /**
     * 注入CSS样式 (V2.1)
     */
    function addStyles() {
        // 由于 CSS 是通用的，保持不变
        GM_addStyle(`
            #u2DownloaderPanel {
                background-color: #f4f4f4;
                border: 1px solid #ccc;
                padding: 15px;
                margin: 10px 0 10px 5px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap; /* 适应小屏幕 */
            }
            #u2DownloaderPanel label {
                font-weight: bold;
                font-size: 14px;
                color: #333;
            }
            #u2DownloaderPanel input[type="number"] {
                width: 80px;
                padding: 8px;
                font-size: 14px;
                border: 1px solid #aaa;
                border-radius: 4px;
            }
            #u2DownloadRangeButton {
                padding: 10px 15px;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                background-color: #28a745; /* 绿色，改为更通用的颜色 */
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            #u2DownloadRangeButton:hover {
                background-color: #1e7e34;
            }
            #u2DownloadRangeButton:disabled {
                background-color: #999;
                cursor: not-allowed;
            }
        `);
    }

    /**
     * 脚本主入口 (V2.1)
     */
    function main() {
        // 1. 找到锚点
        // NexusPHP 站点的分页器通常是 p.pager，或者在 torrents.php 页面顶部有一个 table
        const anchorElement = document.querySelector('p.pager, table.torrents');
        if (!anchorElement) {
            console.warn('[NexusPHP Downloader] 未找到用于插入控制面板的锚点元素。');
            return;
        }

        // 2. 获取当前页码 (首页通常是 page=0)
        const currentUrl = new URL(window.location.href);
        const currentPage = currentUrl.searchParams.get('page') || '0';

        // 3. 创建控制面板 (Panel)
        const panel = document.createElement('div');
        panel.id = 'u2DownloaderPanel'; // 沿用 ID

        panel.innerHTML = `
            <label for="u2DownloaderStartPage">起始页码:</label>
            <input type="number" id="u2DownloaderStartPage" min="0" value="${currentPage}">

            <label for="u2DownloaderEndPage">结束页码:</label>
            <input type="number" id="u2DownloaderEndPage" min="0" value="${currentPage}">

            <button id="u2DownloadRangeButton">下载指定范围种子</button>
        `;

        // 4. 将面板插入页面
        // 插入到锚点元素的前面
        anchorElement.parentNode.insertBefore(panel, anchorElement);

        // 5. 绑定按钮事件
        document.getElementById('u2DownloadRangeButton').addEventListener('click', downloadPageRange);

        // 6. 注入样式
        addStyles();
    }

    // 执行
    main();

})();