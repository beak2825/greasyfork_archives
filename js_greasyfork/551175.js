// ==UserScript==
// @name         一键下载皇后种子
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加一键下载种子按钮，方便一次性下载当前页面的所有种子。
// @author       Adonis142857
// @match        https://open.cd/torrents.php*
// @icon         https://open.cd/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551175/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E7%9A%87%E5%90%8E%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/551175/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E7%9A%87%E5%90%8E%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOWNLOAD_DELAY = 300;

    const downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = '📥 一键下载当前页所有种子';

    downloadAllButton.style.padding = '8px 15px';
    downloadAllButton.style.cursor = 'pointer';
    downloadAllButton.style.border = '1px solid #ccc';
    downloadAllButton.style.borderRadius = '4px';
    downloadAllButton.style.fontSize = '14px';
    downloadAllButton.title = `点击后将以 ${DOWNLOAD_DELAY / 1000} 秒的间隔逐一下载本页所有种子`;



    const searchForm = document.querySelector('form[name="searchbox"]');
    if (searchForm) {
        searchForm.parentNode.insertBefore(downloadAllButton, searchForm);
        downloadAllButton.style.display = 'block';
        downloadAllButton.style.width = 'fit-content';
        downloadAllButton.style.margin = '10px auto 15px auto';
    } else {
        const torrentsTable = document.querySelector('table.torrentname');
        if (torrentsTable) {
            torrentsTable.parentElement.insertBefore(downloadAllButton, torrentsTable);
            downloadAllButton.style.marginBottom = '10px';
        }
    }


    downloadAllButton.addEventListener('click', () => {
        const downloadLinks = document.querySelectorAll('a[href^="download.php?id="]');

        if (downloadLinks.length === 0) {
            alert('错误：当前页面未找到任何种子下载链接！');
            return;
        }


        if (confirm(`检测到 ${downloadLinks.length} 个种子，确定要全部下载吗？`)) {
            let downloadedCount = 0;
            downloadAllButton.textContent = `下载中... (0/${downloadLinks.length})`;
            downloadAllButton.disabled = true;


            downloadLinks.forEach((link, index) => {
                setTimeout(() => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = link.href;
                    document.body.appendChild(iframe);

                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 10000);

                    downloadedCount++;
                    downloadAllButton.textContent = `下载中... (${downloadedCount}/${downloadLinks.length})`;

                    if (downloadedCount === downloadLinks.length) {
                         downloadAllButton.textContent = '✅ 下载任务已全部启动';
                         setTimeout(() => {
                            downloadAllButton.textContent = '📥 一键下载当前页所有种子';
                            downloadAllButton.disabled = false;
                         }, 3000);
                    }
                }, index * DOWNLOAD_DELAY);
            });
        }
    });
})();