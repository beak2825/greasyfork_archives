// ==UserScript==
// @name         NSFC_conclusion_downloader_Enhanced
// @namespace    https://blog.xianx.info/
// @version      1.10
// @description  帮助你直接下载国自然结题报告 (增强版: 代理加速、智能终止)
// @author       xianx (Modified by Antigravity)
// @license      MIT
// @match        https://kd.nsfc.gov.cn/finalDetails*
// @match        https://kd.nsfc.cn/finalDetails*
// @require      https://unpkg.com/jspdf@2.3.0/dist/jspdf.umd.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/563434/NSFC_conclusion_downloader_Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/563434/NSFC_conclusion_downloader_Enhanced.meta.js
// ==/UserScript==

/*
 * 🙏 感谢 / Acknowledgements:
 * 1. https://github.com/ejfkdev/NsfcReportExport (提供了图片代理加速思路)
 * 2. https://greasyfork.org/zh-CN/scripts/421052-nsfc-conclusion-downloader (最原始脚本)
 * 3. https://greasyfork.org/zh-CN/scripts/537382-nsfc-conclusion-downloader-enhanced (基础版本，本项目在此基础上修改)
 *
 * 📅 更新日志 / Changelog:
 * v1.10 (2026-01-26)
 * - [Fix] 修复文档结束检测逻辑：优先判定直连 404，解决了代理报错掩盖真实文件结束（导致死循环或只有 Missing 页）的问题。
 * - [Fix] 优化结尾清理逻辑：检测到文档结束时，自动回滚并删除末尾所有因下载失败或 404 产生的空白页 ("Page Missing")，确保 PDF 结尾干净。
 * - [Opt] 改进了错误处理策略，更准确地识别“文件不存在”与“网络拥堵”。
 */

/* globals $, jspdf */

(function () {
    'use strict';

    // UI Configuration
    const STORAGE_KEY_PAGE = 'nsfc_downloader_last_page';
    const STORAGE_KEY_BATCH = 'nsfc_downloader_batch_size';

    // Create UI container
    const container = $('<div style="display: flex; align-items: center; margin-left: 15px; gap: 8px;"></div>');

    const startPageInput = $('<input type="number" min="1" style="width: 50px; padding: 5px; border-radius: 4px; border: 1px solid #dcdfe6;" title="起始页码" />');
    const lastPage = localStorage.getItem(STORAGE_KEY_PAGE);
    startPageInput.val(lastPage ? parseInt(lastPage) + 1 : 1);

    const batchSizeInput = $('<input type="number" min="1" max="10" style="width: 40px; padding: 5px; border-radius: 4px; border: 1px solid #dcdfe6;" title="并发数 (Batch Size)" />');
    const lastBatch = localStorage.getItem(STORAGE_KEY_BATCH);
    batchSizeInput.val(lastBatch ? parseInt(lastBatch) : 3);

    const downloadBtn = $('<button class="el-button el-button--primary is-round" style="padding: 9px 15px;">加速下载</button>');
    const statusText = $('<span style="font-size: 12px; color: #606266; min-width: 120px;"></span>');

    container.append($('<span>Start:</span>'), startPageInput, $('<span>Batch:</span>'), batchSizeInput, downloadBtn, statusText);

    let pauseUntil = 0;

    async function fetchImageWithProxies(originalUrl) {
        // 1. Ensure absolute URL for external proxies
        const absoluteUrl = new URL(originalUrl, location.origin).href;

        // 2. Updated proxy list
        const proxyTemplates = [
            url => `https://img02.sogoucdn.com/v2/thumb/retype_exclude_gif/ext/auto?appid=122&url=${encodeURIComponent(url)}`,
            url => `https://wsrv.nl/?url=${encodeURIComponent(url)}`,
            url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`,
            // url => `https://cors.zme.ink/${url}`, // Removed: dead
            url => originalUrl // Direct fallback (relative is fine here, or absolute)
        ];

        // Randomize 3 proxies + Direct
        const selectedProxies = proxyTemplates
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(t => t(t === originalUrl ? originalUrl : absoluteUrl)); // Use absolute for proxies

        // Ensure direct link is always tried as fallback
        if (!selectedProxies.includes(originalUrl)) selectedProxies.push(originalUrl);

        const fetchBlob = async (url) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!response.ok) {
                    const err = new Error(response.statusText);
                    err.status = response.status;
                    throw err;
                }
                return await response.blob();
            } catch (e) {
                clearTimeout(timeoutId);
                e.url = url; // Attach URL to error for downstream check
                throw e;
            }
        };

        try {
            return await Promise.any(selectedProxies.map(url => fetchBlob(url)));
        } catch (aggregateError) {
            const allErrors = aggregateError.errors || [];
            // strict check: if every single attempt returned 404, the file is gone.
            const all404 = allErrors.length > 0 && allErrors.every(e => e.status === 404);

            // Critical: If the direct link explicitly says 404, it is definitely 404.
            const direct404 = allErrors.find(e => (e.url === originalUrl || e.url === absoluteUrl) && e.status === 404);

            if (all404 || direct404) {
                throw new Error('Definitely_404');
            } else {
                // warning log
                console.warn(`[NSFC] Proxy Fail:`, allErrors.map(e => `${e.status || 'ERR'}(${e.url})`));
                throw new Error('Proxy_Download_Failed');
            }
        }
    }

    async function downloadSinglePage(index, dependUintID) {
        const MAX_RETRIES = 5;
        const MAX_503_RETRIES = 30; // High limit for server busy
        let count503 = 0;
        let hasNext = true;

        for (let retry = 0; retry < MAX_RETRIES; retry++) {
            const now = Date.now();
            if (pauseUntil > now) {
                const waitMs = pauseUntil - now;
                console.log(`[NSFC] Paused for ${waitMs / 1000}s...`);
                await new Promise(r => setTimeout(r, waitMs));
            }

            if (retry > 0) await new Promise(r => setTimeout(r, Math.random() * 1000 + 1000));

            try {
                // 1. Get Image URL via $.post
                let requestData;
                try {
                    const res = await $.post('/api/baseQuery/completeProjectReport', {
                        id: dependUintID,
                        index: index
                    });
                    // Response is usually { code: 200, data: { url: ... }, ... }
                    requestData = res.data;

                    if (!res || res.code !== 200) {
                        if (res && res.code === 503) throw new Error('Service Unavailable');
                        // Proceed check
                    }
                } catch (jqErr) {
                    if (jqErr.status === 503 || jqErr.status === 504) {
                        throw new Error('Service Unavailable');
                    }
                    throw jqErr;
                }

                if (!requestData || !requestData.url) {
                    if (requestData && requestData.hasnext === false) return { success: false, isEnd: true, index };
                    throw new Error('No URL in response');
                }

                if (requestData.hasnext === false) hasNext = false;

                // 2. Download Image (Proxy)
                const blob = await fetchImageWithProxies(requestData.url);

                const objectUrl = URL.createObjectURL(blob);
                const image = new Image();
                image.src = objectUrl;
                await image.decode();

                return { success: true, image, objectUrl, index, isEnd: !hasNext };

            } catch (e) {
                const msg = e.message || '';

                // 503 Handling
                if (e.status === 503 || e.status === 504 || msg.includes('Service Unavailable')) {
                    console.warn(`[NSFC] P${index} 503 Busy. Retry in 5s.`);
                    pauseUntil = Date.now() + 5000 + Math.random() * 3000;

                    count503++;
                    if (count503 < MAX_503_RETRIES) {
                        retry--; // Don't burn a retry
                    }
                    continue;
                }

                // 404 Handling
                if (msg === 'Definitely_404') {
                    return { success: false, is404: true, index };
                }

                // Generic / Proxy Failure -> Retry
                console.warn(`[NSFC] P${index} Retry ${retry + 1}/${MAX_RETRIES} err:`, msg);
            }
        }
        return { success: false, errorMsg: 'Max retries exceeded', index };
    }

    downloadBtn.click(async () => {
        if (downloadBtn.hasClass('is-disabled')) return;
        downloadBtn.prop('disabled', true).addClass('is-disabled').text('Running...');

        const startPage = parseInt(startPageInput.val()) || 1;
        const batchSize = parseInt(batchSizeInput.val()) || 3;
        localStorage.setItem(STORAGE_KEY_BATCH, batchSize);

        try {
            const urlParams = new URLSearchParams(location.search);
            const dependUintID = urlParams.get('id');
            const projectID = $('.basic_info > div.el-row div:contains("项目批准号：") + div').text().trim();
            const projectName = $('.basic_info > div.el-row div:contains("项目名称：") + div').text().trim();

            console.log(`[NSFC] Start ${projectID}, P=${startPage}`);
            statusText.text('Init...');

            const doc = new jspdf.jsPDF();
            doc.deletePage(1);
            doc.setDocumentProperties({ title: `${projectID} ${projectName}`, creator: 'NSFC_Enhanced' });

            let pageIndex = startPage;
            let consecutiveAnyErrors = 0; // Tracks ANY error (missing or failures)
            let consecutive404s = 0;      // Tracks verified 404s

            while (true) {
                statusText.text(`Downloading P${pageIndex} - P${pageIndex + batchSize - 1}...`);
                const promises = [];
                for (let i = 0; i < batchSize; i++) {
                    await new Promise(r => setTimeout(r, 200));
                    promises.push(downloadSinglePage(pageIndex + i, dependUintID));
                }

                const results = await Promise.all(promises);
                let stopEverything = false;

                for (const res of results) {
                    if (res.success) {
                        doc.addPage([res.image.width, res.image.height], res.image.width < res.image.height ? 'p' : 'l');
                        doc.addImage(res.image, "PNG", 0, 0, res.image.width, res.image.height);
                        URL.revokeObjectURL(res.objectUrl);
                        localStorage.setItem(STORAGE_KEY_PAGE, res.index);

                        // Reset counters on success
                        consecutiveAnyErrors = 0;
                        consecutive404s = 0;

                        if (res.isEnd) {
                            console.log(`[NSFC] End detected P${res.index}`);
                            stopEverything = true;
                            break;
                        }
                    } else {
                        consecutiveAnyErrors++;

                        if (res.isEnd) {
                            // Hit explicit end. Remove any trailing failed pages.
                            if (consecutiveAnyErrors > 1) { // >1 because current one is not added yet
                                const pagesToRemove = consecutiveAnyErrors - 1;
                                console.log(`[NSFC] Hit End. Cleaning up last ${pagesToRemove} pages.`);
                                for (let k = 0; k < pagesToRemove; k++) {
                                    if (doc.getNumberOfPages() > 0) doc.deletePage(doc.getNumberOfPages());
                                }
                            }
                            stopEverything = true;
                            break;
                        }

                        // Count 404s to detect end of document
                        if (res.is404) {
                            consecutive404s++;
                            console.log(`[NSFC] P${res.index} is 404. Count=${consecutive404s}`);
                            if (consecutive404s >= 3) {
                                console.log('[NSFC] 3 consecutive 404s -> Stop.');

                                // Remove ALL consecutive errors (failures + 404s) from the end
                                // We added (consecutiveAnyErrors - 1) pages so far.
                                const pagesToRemove = consecutiveAnyErrors - 1;
                                if (pagesToRemove > 0) {
                                    console.log(`[NSFC] Removing last ${pagesToRemove} empty pages.`);
                                    for (let k = 0; k < pagesToRemove; k++) {
                                        if (doc.getNumberOfPages() > 0) doc.deletePage(doc.getNumberOfPages());
                                    }
                                }
                                stopEverything = true;
                                break;
                            }
                        } else {
                            // Non-404 error. Reset 404 counter safely?
                            // Actually, if we have 404, Error, 404, Error... it's confusing.
                            // But usually, if it's end of doc, it should be 404, 404, 404.
                            // With the fix in step 1, we expect consistent 404s now.
                            consecutive404s = 0;
                        }

                        doc.addPage('a4', 'p');
                        doc.text(`Page ${res.index} Missing`, 20, 30);

                        if (consecutiveAnyErrors >= 20) {
                            // Safety brake
                            alert('Too many consecutive errors. Stopping.');
                            stopEverything = true;
                            break;
                        }
                    }
                }

                if (stopEverything) {
                    gotoSave(doc, projectID, projectName);
                    return;
                }
                pageIndex += batchSize;
            }

        } catch (e) {
            console.error(e);
            alert('Error: ' + e.message);
            resetUI();
        }
    });

    function gotoSave(doc, id, name) {
        statusText.text('Saving...');
        try {
            doc.save(`${id} ${name}.pdf`);
            alert('Download Complete!');
        } catch (e) {
            alert('Save Failed: ' + e.message);
        }
        resetUI();
    }

    function resetUI() {
        downloadBtn.prop('disabled', false).removeClass('is-disabled').text('加速下载');
        statusText.text('');
    }

    const observer = new MutationObserver(mutations => {
        const conclusion_another = $('div.link_title:has(div:contains("结题报告"),div:contains("全文"))');
        if (conclusion_another.length > 0 && container.parent().length === 0) {
            conclusion_another.find('div.verticalBar_T').after(container);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();