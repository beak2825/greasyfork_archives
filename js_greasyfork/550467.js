// ==UserScript==
// @name         音频文件批量下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为音频列表页面添加批量下载功能(unlock-music)
// @author       damu
// @match        https://tool.liumingye.cn/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550467/%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550467/%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createBatchDownloadButton() {
        if (document.getElementById('batchDownloadBtn')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'padding:1rem;text-align:right;margin-bottom:1rem;';

        const batchDownloadBtn = document.createElement('button');
        batchDownloadBtn.id = 'batchDownloadBtn';
        batchDownloadBtn.className = 'chakra-button css-29f77m';
        batchDownloadBtn.textContent = '批量下载音频文件';
        batchDownloadBtn.style.marginLeft = 'auto';

        buttonContainer.appendChild(batchDownloadBtn);
        const stackElement = document.querySelector('.chakra-stack.css-tl3ftk');
        if (stackElement) {
            stackElement.insertBefore(buttonContainer, stackElement.firstChild);
        }

        batchDownloadBtn.addEventListener('click', async function() {
            // 精确选择音频下载链接
            const downloadLinks = Array.from(document.querySelectorAll('.css-64d09f .chakra-link.css-181sfzb'))
                .filter(link => {
                    const filename = link.getAttribute('download') || '';
                    return filename && (filename.endsWith('.mp3') || filename.includes('_HQ'));
                });

            if (downloadLinks.length === 0) {
                GM_notification({
                    title: '提示',
                    text: '没有找到可下载的音频文件',
                    timeout: 3000
                });
                return;
            }

            batchDownloadBtn.disabled = true;
            batchDownloadBtn.textContent = `准备下载 ${downloadLinks.length} 个音频文件...`;

            for (let i = 0; i < downloadLinks.length; i++) {
                const link = downloadLinks[i];
                const url = link.href;
                const filename = link.getAttribute('download');

                try {
                    batchDownloadBtn.textContent = `正在下载 (${i+1}/${downloadLinks.length}): ${filename}`;

                    await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            responseType: 'blob',
                            onload: function(response) {
                                const blob = response.response;
                                const downloadUrl = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(() => {
                                    URL.revokeObjectURL(downloadUrl);
                                    document.body.removeChild(a);
                                    resolve();
                                }, 100);
                            },
                            onerror: reject
                        });
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`下载失败: ${filename}`, error);
                }
            }

            batchDownloadBtn.textContent = '批量下载音频文件';
            batchDownloadBtn.disabled = false;
            GM_notification({
                title: '完成',
                text: `已下载 ${downloadLinks.length} 个音频文件`,
                timeout: 5000
            });
        });
    }

    const observer = new MutationObserver(function() {
        if (document.querySelector('.chakra-stack.css-tl3ftk')) {
            createBatchDownloadButton();
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });

})();