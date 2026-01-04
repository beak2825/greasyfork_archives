// ==UserScript==
// @name         云展网(yunzhan365) 全书图片 PDF 下载器 (v2.2 - 动态文件名)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动翻页提取全书 "高清" 图片, 严格按页码排序, 并尝试合并为 PDF。如果失败，则回退显示链接。
// @author       (Your Name)
// @match        *://book.yunzhan365.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @run-at       document-idle
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/556077/%E4%BA%91%E5%B1%95%E7%BD%91%28yunzhan365%29%20%E5%85%A8%E4%B9%A6%E5%9B%BE%E7%89%87%20PDF%20%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v22%20-%20%E5%8A%A8%E6%80%81%E6%96%87%E4%BB%B6%E5%90%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556077/%E4%BA%91%E5%B1%95%E7%BD%91%28yunzhan365%29%20%E5%85%A8%E4%B9%A6%E5%9B%BE%E7%89%87%20PDF%20%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v22%20-%20%E5%8A%A8%E6%80%81%E6%96%87%E4%BB%B6%E5%90%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- [1. 配置项] ---

    // [重要修正] 您设置的 "15" (15毫秒) 太快了。
    // 必须设置足够长的时间 (1.5 秒) 来等待页面响应和图片加载。
    const CLICK_INTERVAL_MS = 0.01; // 1.5 秒

    const NEXT_PAGE_SELECTOR = 'div.button[aria-label="下一页"]';
    const IMAGE_SELECTOR = 'div.side-image img[src*="/files/large/"]';
    const THUMBNAIL_SELECTOR = '.thumbnail_win10 .item.button[aria-label^="page "]';

    // --- [2. 状态变量 (不变)] ---
    let clickIntervalId = null;
    let isRunning = false;
    let controlButton = null;
    let pageUrlMap = new Map();
    let totalPageCount = 0;

    // --- [3. 核心功能函数] ---

    /**
     * @brief [新函数] 清理文件名中的非法字符
     */
    function sanitizeFilename(name) {
        if (!name) return 'downloaded_book';
        // 替换所有在 Windows/Linux/Mac 中不安全的文件名字符
        let illegalChars = /[\\/:*?"<>|]/g;
        let safeName = name.replace(illegalChars, "_"); // 替换为下划线
        return safeName.trim() || 'downloaded_book'; // 确保不是空字符串
    }

    function getTotalPageCount() {
        // ... (此函数与 V2 脚本完全相同) ...
        const allPageThumbs = document.querySelectorAll(THUMBNAIL_SELECTOR);
        if (allPageThumbs.length === 0) {
            const swiperItems = document.querySelectorAll('.thumbnail_win10 .swiper .item_focus');
            if (swiperItems.length === 0) return 0;
            const lastSwiperItem = swiperItems[swiperItems.length - 1];
            const lastPageButtons = lastSwiperItem.querySelectorAll('.item.button[aria-label^="page "]');
            if (lastPageButtons.length === 0) return 0;
            const lastButton = lastPageButtons[lastPageButtons.length - 1];
            const label = lastButton.getAttribute('aria-label');
            if (label) return parseInt(label.replace('page ', ''), 10);
            return 0;
        }
        const lastThumb = allPageThumbs[allPageThumbs.length - 1];
        const label = lastThumb.getAttribute('aria-label');
        if (label) return parseInt(label.replace('page ', ''), 10);
        return 0;
    }

    /**
     * @brief [高清 URL 修复] (与 V2.1 相同)
     */
    function extractCurrentImages() {
        const images = document.querySelectorAll(IMAGE_SELECTOR);
        images.forEach(img => {
            const src = img.src;
            if (!src || src.startsWith('data:')) return;
            const pageElement = img.closest('div[id^="page"]');
            if (pageElement && pageElement.id) {
                const pageNumMatch = pageElement.id.match(/^page(\d+)$/);
                if (pageNumMatch && pageNumMatch[1]) {
                    const pageNum = parseInt(pageNumMatch[1], 10);
                    if (!pageUrlMap.has(pageNum)) {
                        const hdSrc = src.split('?')[0]; // [关键] 获取高清 URL
                        console.log(`油猴脚本: 发现新图片 P${pageNum} (已提取高清 URL)`);
                        pageUrlMap.set(pageNum, hdSrc);
                    }
                }
            }
        });
    }

    function clickNextPage() {
        // ... (此函数与 V2 脚本完全相同) ...
        const nextPageButton = document.querySelector(NEXT_PAGE_SELECTOR);
        if (nextPageButton) {
            nextPageButton.click();
            return true;
        }
        return false;
    }

    function fallbackToShowUrls(sortedUrls) {
        // ... (此函数与 V2 脚本完全相同) ...
        let outputArea = document.getElementById('yz-helper-output');
        if (!outputArea) {
            outputArea = document.createElement('textarea');
            outputArea.id = 'yz-helper-output';
            outputArea.readOnly = true;
            document.body.appendChild(outputArea);
        }
        outputArea.value = sortedUrls.join('\n');
        outputArea.style.display = 'block';
        outputArea.select();
    }

    /**
     * @brief [核心] 尝试从已排序的 URL 数组生成 PDF
     */
    function generatePdfFromUrls(sortedUrls) {
        // ... (检查 sortedUrls 是否为空) ...
        if (!sortedUrls || sortedUrls.length === 0) {
            alert("未提取到任何图片。");
            stopScraping();
            return;
        }

        const { jsPDF } = window.jspdf;
        if (controlButton) {
            controlButton.innerText = '■ PDF 生成中 (0%)...';
            controlButton.disabled = true;
        }

        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`加载图片失败 (可能是CORS): ${url}`));
                img.src = url;
            });
        };

        const imagePromises = sortedUrls.map(loadImage);

        Promise.all(imagePromises)
            .then(images => {
                if (controlButton) controlButton.innerText = '■ 正在拼接 PDF...';
                const firstImg = images[0];
                const w = firstImg.naturalWidth;
                const h = firstImg.naturalHeight;
                const doc = new jsPDF('p', 'px', [w, h]);

                images.forEach((img, index) => {
                    if (index > 0) doc.addPage([w, h], 'p');
                    doc.addImage(img, 'WEBP', 0, 0, w, h);
                    if (controlButton) {
                        const percent = Math.round(((index + 1) / images.length) * 100);
                        controlButton.innerText = `■ PDF 生成中 (${percent}%)...`;
                    }
                });

                // --- [！！！文件名修改！！！] ---
                // 1. 获取页面标题
                const pageTitle = document.title;
                // 2. 清理标题中的非法字符
                const safeFilename = sanitizeFilename(pageTitle);

                // 3. 使用清理后的标题保存
                doc.save(safeFilename + '.pdf');
                // --- [修改结束] ---

                alert("PDF 生成完毕，已开始下载！");
                stopScraping();
            })
            .catch(error => {
                // *** [失败] (CORS) ***
                console.error("PDF 生成失败:", error);
                alert(
                    "❌ PDF 生成失败！(错误: " + error.message + ")\n\n" +
                    "这【极有可能】是由于 CORS 安全策略导致的。\n\n" +
                    "脚本将回退到显示【高清且已排序】的图片链接，请手动复制。"
                );
                fallbackToShowUrls(sortedUrls);
                stopScraping();
            });
    }

    /**
     * @brief 循环检查函数
     */
    function checkAndClickNext() {
        // ... (此函数与 V2 脚本完全相同) ...
        extractCurrentImages();
        const collectedCount = pageUrlMap.size;
        if (controlButton) {
            controlButton.innerText = `■ 提取中 (${collectedCount} / ${totalPageCount})...`;
        }
        if (collectedCount >= totalPageCount) {
            console.log(`油猴脚本: 提取完成! 提取到 ${collectedCount} 张图片。`);
            stopScraping();
            const sortedEntries = Array.from(pageUrlMap.entries());
            sortedEntries.sort((a, b) => a[0] - b[0]);
            const finalSortedUrls = sortedEntries.map(entry => entry[1]);
            generatePdfFromUrls(finalSortedUrls);
        } else {
            if (!clickNextPage()) {
                console.log("油猴脚本: '下一页' 按钮消失，自动停止。");
                stopScraping();
                const sortedEntries = Array.from(pageUrlMap.entries()).sort((a, b) => a[0] - b[0]);
                const finalSortedUrls = sortedEntries.map(entry => entry[1]);
                generatePdfFromUrls(finalSortedUrls);
            }
        }
    }

    // --- [5. "启动" / "停止" 功能] ---
    function startScraping() {
        // ... (此函数与 V2 脚本完全相同) ...
        if (isRunning) return;
        totalPageCount = getTotalPageCount();
        if (totalPageCount === 0) {
            alert("油猴脚本: 无法获取总页数！\n\n[重要] 请先手动点击一次底部的 '缩略图' 按钮 (让缩略图列表加载出来)，然后再点击本按钮。");
            return;
        }
        isRunning = true;
        pageUrlMap.clear();
        console.log(`油猴脚本: 开始提取。目标页数: ${totalPageCount}`);
        if (controlButton) {
            controlButton.innerText = `■ 提取中... (0 / ${totalPageCount})`;
            controlButton.style.backgroundColor = '#d9534f';
        }
        checkAndClickNext();
        clickIntervalId = setInterval(checkAndClickNext, CLICK_INTERVAL_MS);
    }

    function stopScraping() {
        // ... (此函数与 V2 脚本完全相同) ...
        if (!isRunning) return;
        isRunning = false;
        if (clickIntervalId) {
            clearInterval(clickIntervalId);
            clickIntervalId = null;
        }
        console.log("油猴脚本: 提取已停止。");
        if (controlButton) {
            controlButton.innerText = '▶ 自动提取 PDF (v2.2)'; // [修改] 更新按钮文本
            controlButton.style.backgroundColor = '#0275d8';
            controlButton.disabled = false;
        }
    }

    function toggleScraping() {
        // ... (此函数与 V2 脚本完全相同) ...
        if (isRunning) {
            stopScraping();
            const sortedEntries = Array.from(pageUrlMap.entries()).sort((a, b) => a[0] - b[0]);
            const finalSortedUrls = sortedEntries.map(entry => entry[1]);
            generatePdfFromUrls(finalSortedUrls);
        } else {
            startScraping();
        }
    }

    // --- [6. 注入"开关"按钮到页面] ---

    window.addEventListener('load', () => {
        controlButton = document.createElement('button');
        controlButton.id = 'gm-image-scraper-pdf';
        controlButton.innerText = '▶ 自动提取 PDF (v2.2)'; // [修改] 更新按钮文本
        document.body.appendChild(controlButton);
        controlButton.addEventListener('click', toggleScraping);

        // --- 样式 (与 V2 脚本完全相同) ---
        GM_addStyle(`
            #gm-image-scraper-pdf {
                position: fixed; bottom: 10px; right: 10px; z-index: 99999;
                background-color: #0275d8; color: white; border: none;
                padding: 10px 15px; border-radius: 5px; cursor: pointer;
                font-size: 14px; font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: background-color 0.2s;
            }
            #gm-image-scraper-pdf:hover { filter: brightness(1.1); }
            #gm-image-scraper-pdf:disabled { background-color: #5bc0de; cursor: wait; }
            #yz-helper-output {
                position: fixed; bottom: 60px; right: 10px; z-index: 99998;
                width: 400px; height: 300px; border: 2px solid #d9534f;
                border-radius: 5px; display: none; font-size: 12px;
                line-height: 1.5; background: #f8f8f8; color: #333;
                padding: 5px; resize: none;
            }
        `);

        console.log("油猴脚本: 全书图片 PDF 下载器 (v2.2 - 动态文件名) 已注入。");
    });

})();