// ==UserScript==
// @name         NSFC_conclusion_downloader_Enhanced
// @namespace    https://blog.xianx.info/
// @version      1.2
// @description  帮助你直接下载国自然结题报告 (增强版: 断点续传、自动重试、跳过错误页)
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

/* globals $, jspdf */

(function () {
    'use strict';

    // UI Configuration
    const STORAGE_KEY = 'nsfc_downloader_last_page';

    // Create UI container
    const container = $('<div style="display: flex; align-items: center; margin-left: 15px; gap: 10px;"></div>');

    // Start Page Input
    const startPageInput = $('<input type="number" min="1" style="width: 60px; padding: 5px; border-radius: 4px; border: 1px solid #dcdfe6;" title="起始页码" />');
    const lastPage = localStorage.getItem(STORAGE_KEY);
    startPageInput.val(lastPage ? parseInt(lastPage) + 1 : 1);

    // Download Button
    const downloadBtn = $('<button class="el-button el-button--primary is-round" style="padding: 9px 15px;">开始下载</button>');

    // Status Text
    const statusText = $('<span style="font-size: 12px; color: #606266; min-width: 100px;"></span>');

    container.append($('<span>从第</span>'), startPageInput, $('<span>页</span>'), downloadBtn, statusText);

    // Main Logic
    downloadBtn.click(async () => {
        if (downloadBtn.hasClass('is-disabled')) return;

        // Lock UI
        downloadBtn.prop('disabled', true).addClass('is-disabled').text('准备中...');
        const startPage = parseInt(startPageInput.val()) || 1;

        if (/暂无结题报告全文/.test($('#related').text())) {
            alert("当前页面显示“暂无结题报告全文”，无法下载。");
            resetUI();
            return;
        }

        try {
            // Get Project Info
            const urlParams = new URLSearchParams(location.search);
            const dependUintID = urlParams.get('id');
            const projectID = $('.basic_info > div.el-row div:contains("项目批准号：") + div').text().trim();
            const projectName = $('.basic_info > div.el-row div:contains("项目名称：") + div').text().trim();

            console.log(`[NSFC] 开始下载: ${projectID} ${projectName}, 从第 ${startPage} 页开始`);
            statusText.text('初始化PDF...');

            // Initialize PDF
            const doc = new jspdf.jsPDF();
            doc.deletePage(1); // Delete default first page
            doc.setDocumentProperties({
                title: `${projectID} ${projectName}`,
                subject: location.href,
                creator: 'NSFC_conclusion_downloader_Enhanced'
            });

            let consecutiveErrors = 0;
            const MAX_CONSECUTIVE_ERRORS = 10;
            const MAX_RETRIES = 3;
            let pageIndex = startPage;
            const image = new Image();

            while (true) {
                // Check if user wants to stop? (Not implemented, but loop condition could handle it)

                let success = false;
                let errorMsg = '';

                // Retry Loop
                for (let retry = 0; retry < MAX_RETRIES; retry++) {
                    downloadBtn.text(`下载 P${pageIndex} ${retry > 0 ? `(重试${retry})` : ''}`);
                    statusText.text(`正在处理第 ${pageIndex} 页...`);

                    // Random delay to be nice to the server (300-800ms usually enough, but kept conservative)
                    // If retrying, wait longer
                    const delay = retry === 0 ? (Math.random() * 2000 + 1000) : (3000 + retry * 2000);
                    await new Promise(r => setTimeout(r, delay));

                    try {
                        // 1. Get Image URL
                        const { data: requestData } = await $.post('/api/baseQuery/completeProjectReport', {
                            id: dependUintID,
                            index: pageIndex
                        });

                        if (!requestData || !requestData.url) {
                            // If API returns success but no URL, it might be end of document
                            if (requestData && requestData.hasnext === false) {
                                console.log(`[NSFC] 第 ${pageIndex} 页 hasnext=false, 结束。`);
                                gotoSave(doc, projectID, projectName); // Defined below
                                return; // Exit completely
                            }
                            throw new Error('API响应无URL');
                        }

                        // 2. Download Image Blob
                        const blob = await $.ajax({
                            url: requestData.url,
                            method: 'GET',
                            xhrFields: { responseType: 'blob' },
                            timeout: 15000 // 15s timeout
                        });

                        // 3. Load Image
                        const objectUrl = URL.createObjectURL(blob);
                        image.src = objectUrl;
                        await image.decode();

                        // 4. Add to PDF
                        doc.addPage([image.width, image.height], image.width < image.height ? 'p' : 'l');
                        doc.addImage(image, "PNG", 0, 0, image.width, image.height);

                        console.log(`[NSFC] P${pageIndex} 成功`);
                        localStorage.setItem(STORAGE_KEY, pageIndex); // Save progress

                        URL.revokeObjectURL(objectUrl);
                        success = true;

                        // Check hasnext
                        if (requestData.hasnext === false) {
                            console.log(`[NSFC] P${pageIndex} 是最后一页。`);
                            gotoSave(doc, projectID, projectName);
                            return;
                        }

                        break; // Exit retry loop

                    } catch (e) {
                        console.warn(`[NSFC] P${pageIndex} 第 ${retry + 1} 次失败:`, e);
                        errorMsg = e.message || e.statusText || 'Unknown Error';
                        if (e.status === 404) {
                            // 404 usually means end of document if we went too far,
                            // OR the specifically requested page doesn't exist but hasnext said yes?
                            // Safe to treat as end if it's consistently 404.
                            // But let's let the retry logic handle transient 404s if any.
                        }
                    }
                }

                if (!success) {
                    console.error(`[NSFC] P${pageIndex} 彻底失败，跳过。`);
                    // Add Error Page to PDF
                    doc.addPage('a4', 'p');
                    doc.setFontSize(16);
                    doc.text(`Page ${pageIndex} Download Failed`, 20, 30);
                    doc.setFontSize(12);
                    doc.text(`Error: ${errorMsg}`, 20, 50);
                    doc.text(`Please try downloading this page individually later.`, 20, 70);

                    consecutiveErrors++;
                    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                        alert(`连续 ${MAX_CONSECUTIVE_ERRORS} 页下载失败，已停止。现有进度已保存。`);
                        gotoSave(doc, projectID, projectName);
                        return;
                    }
                } else {
                    consecutiveErrors = 0;
                }

                pageIndex++;
            }

        } catch (globalError) {
            console.error('全局错误', globalError);
            alert('发生严重错误: ' + globalError.message);
            resetUI();
        }
    });

    function gotoSave(doc, id, name) {
        statusText.text('正在保存PDF...');
        try {
            const filename = `${id} ${name}.pdf`;
            doc.save(filename);
            console.log(`[NSFC] 文件已保存: ${filename}`);
            alert('下载任务结束，文件已保存！');
        } catch (e) {
            alert('保存PDF失败: ' + e.message);
        }
        resetUI();
    }

    function resetUI() {
        downloadBtn.prop('disabled', false).removeClass('is-disabled').text('开始下载');
        statusText.text('');
    }

    // Insert to DOM
    console.log("NSFC Downloader: 监听DOM...");
    const observer = new MutationObserver(mutations => {
        const conclusion_another = $('div.link_title:has(div:contains("结题报告"),div:contains("全文"))');
        if (conclusion_another.length > 0 && container.parent().length === 0) {
            console.log("NSFC Downloader: 插入UI...");
            conclusion_another.find('div.verticalBar_T').after(container);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();