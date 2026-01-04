// ==UserScript==
// @name         Chaoxing Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于下载超星学习通课件
// @author       Twist Mark
// @match        *://*.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556363/Chaoxing%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556363/Chaoxing%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PDF_LIBRARY_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    const SCROLL_THRESHOLD = 50;
    const STABILIZE_WAIT_MS = 3000;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 1500;

    let isRunning = false;
    let stabilizeTimer = null;

    function loadJsPDF() {
        return new Promise((resolve, reject) => {
            if (typeof window.jspdf !== 'undefined' && typeof window.jspdf.jsPDF === 'function') {
                return resolve();
            }
            const script = document.createElement('script');
            script.src = PDF_LIBRARY_URL;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function showStatus(text, color = '#333') {
        let el = document.getElementById('cx-pdf-status');
        if (!el) {
            el = document.createElement('div');
            el.id = 'cx-pdf-status';
            el.style.cssText = 'position:fixed; top:10px; right:10px; padding:8px 12px; background:rgba(255,255,255,0.95); border:1px solid #ccc; border-radius:4px; z-index:999999; font-size:12px; color:#333; box-shadow:0 2px 8px rgba(0,0,0,0.2); font-family: sans-serif;';
            document.body.appendChild(el);
        }
        el.style.color = color;
        el.innerHTML = `📄 <b>${text}</b>`;
    }

    async function fetchWithRetry(url, pageNum) {
        let retries = 0;
        while (retries <= MAX_RETRIES) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return response;
                } else if (response.status === 404) {
                    if (retries < MAX_RETRIES) {
                        showStatus(`第 ${pageNum} 页未就绪，等待重试 (${retries+1}/${MAX_RETRIES})...`, '#d35400');
                        await new Promise(r => setTimeout(r, RETRY_DELAY));
                        retries++;
                    } else {
                        return response;
                    }
                } else {
                    return response;
                }
            } catch (err) {
                retries++;
                await new Promise(r => setTimeout(r, RETRY_DELAY));
            }
        }
        throw new Error(`Failed to fetch ${url}`);
    }

    async function startDownloadProcess() {
        isRunning = true;
        window.removeEventListener('scroll', handleScroll);
        document.body.removeEventListener('scroll', handleScroll);

        showStatus('检测到触底，正在分析图片链接...', 'blue');

        try {
            await loadJsPDF();

            const firstImg = document.querySelector("#anchor1 > img") || document.querySelector("img[src*='/thumb/']");

            if (!firstImg) {
                showStatus('❌ 未找到任何课件图片', 'red');
                return;
            }

            const fullUrl = firstImg.src;
            const urlMatch = fullUrl.match(/^(.*)\/thumb\/\d+\.png/i);

            if (!urlMatch || !urlMatch[1]) {
                showStatus('❌ 图片 URL 格式不支持', 'red');
                return;
            }

            const IMAGE_HEADER_URL = urlMatch[1];
            let DOC_ID = 'doc';
            const idMatch = IMAGE_HEADER_URL.match(/([0-9a-f]{32})$/i);
            if (idMatch) DOC_ID = idMatch[1];

            let doc = null;
            let pageNum = 1;
            let hasMore = true;
            const downloadedImages = [];
            const MAX_PAGES = 1000;

            showStatus('🚀 开始下载...', 'blue');

            while (hasMore && pageNum <= MAX_PAGES) {
                const currentUrl = `${IMAGE_HEADER_URL}/thumb/${pageNum}.png`;

                try {
                    const response = await fetchWithRetry(currentUrl, pageNum);

                    if (response.ok) {
                        const blob = await response.blob();
                        downloadedImages.push({ blob: blob, page: pageNum });
                        showStatus(`已下载 ${pageNum} 页...`, '#2980b9');
                        pageNum++;
                    } else {
                        hasMore = false;
                    }
                } catch (err) {
                    hasMore = false;
                }

                await new Promise(r => setTimeout(r, 50));
            }

            if (downloadedImages.length === 0) {
                showStatus('下载失败：0张图片', 'red');
                return;
            }

            showStatus(`📦 正在打包 ${downloadedImages.length} 页 PDF...`, '#8e44ad');

            for (let i = 0; i < downloadedImages.length; i++) {
                const item = downloadedImages[i];
                const imgData = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(item.blob);
                });

                const img = new Image();
                img.src = imgData;
                await new Promise(r => img.onload = r);

                const w = img.width;
                const h = img.height;
                const orientation = w > h ? 'l' : 'p';

                if (i === 0) {
                    doc = new window.jspdf.jsPDF({
                        orientation: orientation,
                        unit: 'px',
                        format: [w, h]
                    });
                } else {
                    doc.addPage([w, h], orientation);
                }

                doc.addImage(imgData, 'PNG', 0, 0, w, h, undefined, 'FAST');
            }

            const fileName = `课件_${DOC_ID}_${new Date().toISOString().slice(0,10)}.pdf`;
            doc.save(fileName);
            showStatus(`✅ 下载完成！`, '#27ae60');

        } catch (error) {
            showStatus('❌ 发生错误', 'red');
            console.error(error);
        }
    }

    function handleScroll() {
        if (isRunning) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
            const currentImgCount = document.querySelectorAll("img[src*='/thumb/']").length;
            showStatus(`检测到触底 (当前 ${currentImgCount} 张)... 等待加载完毕`, '#e67e22');

            if (stabilizeTimer) clearTimeout(stabilizeTimer);

            stabilizeTimer = setTimeout(() => {
                const finalImgCount = document.querySelectorAll("img[src*='/thumb/']").length;
                showStatus(`加载稳定 (共 ${finalImgCount} 张)，准备启动...`, '#27ae60');
                startDownloadProcess();
            }, STABILIZE_WAIT_MS);
        }
    }

    function init() {
        const targetImg = document.querySelector("img[src*='/thumb/']");
        if (!targetImg) return;

        showStatus('请缓慢滚动至底部以触发下载', '#7f8c8d');

        window.addEventListener('scroll', handleScroll);
        document.body.addEventListener('scroll', handleScroll);
    }

    setTimeout(init, 2000);

})();