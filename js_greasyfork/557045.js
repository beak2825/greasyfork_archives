// ==UserScript==
// @name         Toomics 漫画批量下载 (智能长图修复版)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Toomics下载：5米长页自动分段，修复图片截断/丢失问题
// @match        https://www.toomics.net/sc/webtoon/episode/toon/*
// @grant        GM_xmlhttpRequest
// @connect      toomics.net
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/557045/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%28%E6%99%BA%E8%83%BD%E9%95%BF%E5%9B%BE%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557045/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%28%E6%99%BA%E8%83%BD%E9%95%BF%E5%9B%BE%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const { jsPDF } = window.jspdf;

    // === 核心配置 (关键修改) ===
    // 5000mm (5米) 是浏览器渲染的安全极限。
    // 超过这个长度，Chrome/Edge 可能会无法显示底部内容，导致"图片不全"。
    // 脚本会在达到 5米 时自动切到下一页，确保所有图片都能保存。
    const MAX_PAGE_HEIGHT_MM = 5000;
    const PDF_PAGE_WIDTH_MM = 210; // A4 宽度

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 读取图片信息：DataURL 和 宽高比
     */
    function getImageDetails(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        data: e.target.result,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        ratio: img.naturalHeight / img.naturalWidth
                    });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // === 通用函数 ===
    function getChapterList() {
        const chapters = [];
        const chapterElements = document.querySelectorAll('.list-ep li.normal_ep');
        chapterElements.forEach((li, index) => {
            const link = li.querySelector('a');
            if (link) {
                const onclickMatch = link.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                if (onclickMatch) {
                    const detailUrl = onclickMatch[1];
                    const chapterNum = li.querySelector('.cell-num .num')?.textContent || (index + 1);
                    const title = li.querySelector('.cell-title strong')?.textContent?.trim() || 'Unknown';
                    chapters.push({
                        index: index + 1,
                        chapterNum: parseInt(chapterNum),
                        title: title,
                        detailUrl: 'https://www.toomics.net' + detailUrl,
                        isOwn: li.classList.contains('own')
                    });
                }
            }
        });
        return chapters;
    }

    function fetchAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: 'blob',
                headers: { 'Referer': 'https://www.toomics.net', 'User-Agent': navigator.userAgent },
                onload: res => res.status === 200 ? resolve(res.response) : reject(new Error(res.status)),
                onerror: err => reject(err)
            });
        });
    }

    async function downloadChapter(chapterInfo) {
        try {
            console.log(`开始下载章节 ${chapterInfo.chapterNum}`);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET', url: chapterInfo.detailUrl, responseType: 'text',
                    headers: { 'Referer': 'https://www.toomics.net' },
                    onload: resolve, onerror: reject
                });
            });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const imgNodes = doc.querySelectorAll('#viewer-img img');
            if (!imgNodes.length) return null;

            const imgArray = Array.from(imgNodes);
            const blobs = [];
            // 降低并发数到 5，防止网络拥堵导致丢图
            const concurrency = 5;

            for (let i = 0; i < imgArray.length; i += concurrency) {
                const batch = imgArray.slice(i, i + concurrency);
                const batchPromises = batch.map(async (imgElement, batchIndex) => {
                    let imgURL = imgElement.getAttribute('data-original') || imgElement.getAttribute('data-src') || imgElement.src;
                    if (!imgURL || imgURL.startsWith('data:')) return null;
                    try {
                        const blob = await fetchAsBlob(imgURL);
                        // 稍微降低有效图片门槛，防止小图被误删
                        if (blob && blob.size > 500) return { blob: blob, index: i + batchIndex };
                    } catch (e) { console.error(e); }
                    return null;
                });
                const results = await Promise.all(batchPromises);
                results.forEach(res => { if (res) blobs.push(res); });
                const progressDiv = document.getElementById('dl-progress-text');
                if(progressDiv) progressDiv.innerText = `正在下载第 ${chapterInfo.chapterNum} 话: ${blobs.length}/${imgArray.length}`;
            }
            blobs.sort((a, b) => a.index - b.index);
            return {
                chapterNum: chapterInfo.chapterNum,
                title: chapterInfo.title,
                blobs: blobs.map(b => b.blob)
            };
        } catch (error) { console.error(error); return null; }
    }

    // === PDF 生成核心逻辑 (智能分段版) ===
    async function generateChapterPDF_SmartSplit(chapterResult, mangaName) {
        try {
            const cleanName = name => name.replace(/[<>:"/\\|?*]/g, '_').trim();
            const pdfFileName = `${cleanName(mangaName)}_第${chapterResult.chapterNum}话.pdf`;

            // 1. 预处理
            const processedImages = [];
            for (const blob of chapterResult.blobs) {
                const details = await getImageDetails(blob);
                const renderHeight = details.ratio * PDF_PAGE_WIDTH_MM;

                processedImages.push({
                    ...details,
                    renderHeight: renderHeight,
                    renderWidth: PDF_PAGE_WIDTH_MM
                });
            }

            // 2. 智能分页逻辑
            const pages = [];
            let currentPageImages = [];
            let currentHeight = 0;

            processedImages.forEach(img => {
                // 如果加上当前图片超过 5米 (5000mm)
                if (currentHeight + img.renderHeight > MAX_PAGE_HEIGHT_MM) {
                    // 如果当前页不为空，先保存当前页
                    if (currentPageImages.length > 0) {
                        pages.push({ images: currentPageImages, totalHeight: currentHeight });
                    }
                    // 重置，开启新的一页，并将当前这张图作为新页的第一张
                    currentPageImages = [img];
                    currentHeight = img.renderHeight;
                } else {
                    // 没满，继续追加
                    currentPageImages.push(img);
                    currentHeight += img.renderHeight;
                }
            });

            // 保存最后一页
            if (currentPageImages.length > 0) {
                pages.push({ images: currentPageImages, totalHeight: currentHeight });
            }

            console.log(`生成 PDF: 共 ${processedImages.length} 张图，分成了 ${pages.length} 个长页`);

            // 3. 绘制
            const doc = new jsPDF('p', 'mm', 'a4', true);
            doc.deletePage(1);

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                // 添加自定义长页
                doc.addPage([PDF_PAGE_WIDTH_MM, page.totalHeight]);

                let yOffset = 0;
                for (const img of page.images) {
                    const format = img.data.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                    doc.addImage(img.data, format, 0, yOffset, img.renderWidth, img.renderHeight, undefined, 'FAST');
                    yOffset += img.renderHeight;
                }

                // 更新UI提示进度
                const progressDiv = document.getElementById('dl-progress-text');
                if(progressDiv) progressDiv.innerText = `PDF 绘制中: 页 ${i+1}/${pages.length}`;
            }

            doc.save(pdfFileName);
            return pdfFileName;

        } catch (error) {
            console.error('PDF生成失败:', error);
            throw error;
        }
    }

    // === 主控制流程 ===
    async function downloadChaptersInRange() {
        const startChapter = parseInt(document.getElementById('start-chapter').value) || 1;
        const endChapter = parseInt(document.getElementById('end-chapter').value) || 0;

        let mangaName = '未知漫画';
        const titleEl = document.querySelector('.viewer-title a') || document.querySelector('h2');
        if(titleEl) mangaName = titleEl.innerText.split('第')[0].trim();

        const allChapters = getChapterList();
        let targetChapters = allChapters;
        if (endChapter > 0) {
            targetChapters = allChapters.filter(c => c.chapterNum >= startChapter && c.chapterNum <= endChapter);
        } else {
             targetChapters = allChapters.filter(c => c.chapterNum >= startChapter);
        }

        if (targetChapters.length === 0) {
            alert('未找到目标章节');
            return;
        }

        const btn = document.getElementById('download-all-btn');
        btn.disabled = true;

        const progressDiv = document.createElement('div');
        progressDiv.id = 'dl-progress-box';
        progressDiv.style.cssText = `position: fixed; top: 180px; right: 20px; width: 300px; background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px; z-index: 10000;`;
        document.body.appendChild(progressDiv);

        for (let i = 0; i < targetChapters.length; i++) {
            const chapter = targetChapters[i];

            progressDiv.innerHTML = `
                <div style="font-weight:bold; margin-bottom:10px">修复版 PDF 下载中...</div>
                <div>进度: ${i + 1} / ${targetChapters.length}</div>
                <div>当前: 第 ${chapter.chapterNum} 话</div>
                <div id="dl-progress-text" style="font-size:12px; color:#aaa; margin-top:5px">准备下载...</div>
            `;

            try {
                const result = await downloadChapter(chapter);
                if (result && result.blobs.length > 0) {
                    document.getElementById('dl-progress-text').innerText = '正在智能分页拼接...';
                    await generateChapterPDF_SmartSplit(result, mangaName);
                    progressDiv.innerHTML += `<div style="color:lightgreen; margin-top:5px">✅ 导出成功 (已修复截断)</div>`;
                } else {
                    progressDiv.innerHTML += `<div style="color:red; margin-top:5px">❌ 失败 (无图片)</div>`;
                }
            } catch (err) {
                console.error(err);
                progressDiv.innerHTML += `<div style="color:red; margin-top:5px">❌ 错误: ${err.message}</div>`;
            }
            if (i < targetChapters.length - 1) await sleep(2000);
        }

        btn.disabled = false;
        setTimeout(() => { if(progressDiv.parentNode) progressDiv.parentNode.removeChild(progressDiv); }, 5000);
    }

    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `position: fixed; top: 80px; right: 20px; width: 280px; background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px; z-index: 9999; font-size: 12px;`;
    controlPanel.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold; text-align: center;">长图 PDF (防截断版)</div>
        <div style="margin-bottom: 10px;">
            <label>开始章节:</label>
            <input type="number" id="start-chapter" placeholder="1" style="width: 100%; color:black">
        </div>
        <div style="margin-bottom: 15px;">
            <label>结束章节:</label>
            <input type="number" id="end-chapter" placeholder="留空=最后" style="width: 100%; color:black">
        </div>
        <button id="download-all-btn" style="width: 100%; padding: 10px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">开始导出</button>
    `;
    document.body.appendChild(controlPanel);
    document.getElementById('download-all-btn').addEventListener('click', downloadChaptersInRange);

})();