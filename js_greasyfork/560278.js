// ==UserScript==
// @name         云展网/yunzhan365 一键下载器 (v3.0 通用版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @license      MIT
// @description  修复 book.yunzhan365.com 无法下载的问题。支持所有云展网子域名，自动探测 files/large, files/mobile 等多种路径，自动去参，支持 PDF/ZIP 双模式。
// @author       Gemini Assistant
// @match        *://*.yunzhan365.com/*
// @match        *://*.fliphtml5.com/*
// @match        *://book.yunzhan365.com/*
// @match        *://bookh.yunzhan365.com/*
// @match        *://online.fliphtml5.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560278/%E4%BA%91%E5%B1%95%E7%BD%91yunzhan365%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v30%20%E9%80%9A%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560278/%E4%BA%91%E5%B1%95%E7%BD%91yunzhan365%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v30%20%E9%80%9A%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI 样式 ---
    const containerStyle = `
        position: fixed; bottom: 20px; right: 20px; z-index: 999999;
        display: flex; flex-direction: column; gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    const btnStyle = `
        padding: 10px 16px; border: none; border-radius: 6px;
        font-size: 13px; font-weight: 600; cursor: pointer; color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s, opacity 0.2s;
        display: flex; align-items: center; justify-content: center;
    `;

    // --- 创建 UI ---
    const container = document.createElement('div');
    container.style.cssText = containerStyle;
    document.body.appendChild(container);

    const createBtn = (text, bgColor, id) => {
        const b = document.createElement('button');
        b.innerHTML = text;
        b.id = id;
        b.style.cssText = btnStyle + `background-color: ${bgColor};`;
        b.onmouseenter = () => b.style.transform = "translateY(-2px)";
        b.onmouseleave = () => b.style.transform = "translateY(0)";
        container.appendChild(b);
        return b;
    };

    const btnZip = createBtn("📦 下载图片打包 (ZIP)", "#007bff", "dl-zip");
    const btnPdf = createBtn("📄 下载电子书 (PDF)", "#dc3545", "dl-pdf");

    // 状态提示条
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = "background: rgba(0,0,0,0.85); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 12px; display: none; text-align: center; max-width: 200px;";
    container.appendChild(statusDiv);

    const showStatus = (msg, autoHide = false) => {
        statusDiv.style.display = "block";
        statusDiv.innerHTML = msg;
        if (autoHide) setTimeout(() => statusDiv.style.display = "none", 5000);
    };

    // --- 核心依赖加载 ---
    const loadJsPDF = async () => {
        if (window.jspdf) return;
        showStatus("🔧 正在初始化 PDF 组件...");
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = () => { showStatus("✅ 组件就绪", true); resolve(); };
            script.onerror = () => { alert("组件加载失败，请检查网络"); resolve(); }; // 失败也继续，防止卡死
            document.head.appendChild(script);
        });
    };

    // --- 核心逻辑 ---

    // 1. 获取图片列表 (兼容所有变量)
    const getPages = () => {
        const candidates = [
            window.fliphtml5_pages, window.configForPages,
            (window.bookConfig && window.bookConfig.pages),
            (window.htmlConfig && window.htmlConfig.pages),
            (window.sliderConfig && window.sliderConfig.pages),
            (window.articleConfig && window.articleConfig.pages)
        ];
        for (let c of candidates) {
            if (c && Array.isArray(c) && c.length > 0) return c;
        }
        // 暴力扫描 bookConfig
        if (window.bookConfig) {
            for (let key in window.bookConfig) {
                if (Array.isArray(window.bookConfig[key]) && window.bookConfig[key][0]?.path) return window.bookConfig[key];
            }
        }
        return [];
    };

    // 2. 智能探测图片 URL (本次升级核心)
    const probeImage = async (path, baseUrls) => {
        // 彻底清理文件名：去掉开头的 /，去掉 ? 后面的所有参数
        const cleanName = path.split('?')[0].replace(/^\/+/, '');

        // 构造所有可能的路径模板
        // 注意：book.yunzhan365.com 有时候不喜欢 /files/large，而喜欢 /files/mobile
        const patterns = [
            `files/large/${cleanName}`,   // 高清首选
            `files/mobile/${cleanName}`,  // 普通首选
            `files/shot/${cleanName}`,    // 低清备选
            `large/${cleanName}`,         // 变体
            `mobile/${cleanName}`,        // 变体
            `${cleanName}`                // 根目录
        ];

        for (let base of baseUrls) {
            for (let pattern of patterns) {
                // 确保 base 不以 / 结尾，pattern 不以 / 开头，防止双斜杠
                const targetUrl = `${base.replace(/\/$/, '')}/${pattern}`;
                try {
                    // 使用 HEAD 请求快速探测，或者直接 fetch
                    const resp = await fetch(targetUrl);
                    if (resp.ok) return await resp.blob();
                } catch (e) { }
            }
        }
        return null;
    };

    // 3. 计算基准 URL (自动适配 book/bookh)
    const getBaseUrls = () => {
        let currentUrl = window.location.href.split('?')[0];
        // 移除 index.html, mobile 等后缀，拿到书本根目录
        // 例如: https://book.yunzhan365.com/qsrm/tsab/mobile/index.html -> https://book.yunzhan365.com/qsrm/tsab
        let root = currentUrl.replace(/\/mobile\/index\.html$/, '')
                             .replace(/\/mobile\/$/, '')
                             .replace(/\/index\.html$/, '')
                             .replace(/\/$/, '');

        const urls = [root];

        // 自动添加兄弟域名尝试 (book <-> bookh)
        if (root.includes('book.')) urls.push(root.replace('book.', 'bookh.'));
        else if (root.includes('bookh.')) urls.push(root.replace('bookh.', 'book.'));

        return urls;
    };

    // --- 主流程 ---
    const startDownload = async (mode) => {
        const pages = getPages();
        if (!pages.length) return alert("❌ 无法提取图片，请等待书本加载完毕或翻一页再试！");

        if (mode === 'pdf') await loadJsPDF();

        // 锁定 UI
        [btnZip, btnPdf].forEach(b => { b.disabled = true; b.style.opacity = 0.6; });

        const baseUrls = getBaseUrls();
        console.log("探测基准地址:", baseUrls);

        let zip = mode === 'zip' ? new JSZip() : null;
        let pdf = null;
        let successCount = 0;

        for (let i = 0; i < pages.length; i++) {
            showStatus(`⏳ [${i + 1}/${pages.length}] 正在下载...`);

            // 提取文件名
            let p = pages[i];
            let rawPath = (typeof p === 'string') ? p : (p.path || p.url || p.image || (p.n && p.n[0]));
            if (!rawPath) continue;

            // 智能探测下载
            const blob = await probeImage(rawPath, baseUrls);

            if (blob) {
                successCount++;
                if (mode === 'zip') {
                    const ext = blob.type.includes('webp') ? 'webp' : 'jpg';
                    zip.file(`${(i + 1).toString().padStart(3, '0')}.${ext}`, blob);
                } else {
                    // PDF 处理
                    await new Promise((resolve) => {
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => {
                            const { jsPDF } = window.jspdf;
                            const w = img.naturalWidth;
                            const h = img.naturalHeight;

                            if (!pdf) pdf = new jsPDF({ unit: 'px', format: [w, h], orientation: w > h ? 'l' : 'p' });
                            else pdf.addPage([w, h], w > h ? 'l' : 'p');

                            pdf.addImage(img, blob.type.includes('webp') ? 'WEBP' : 'JPEG', 0, 0, w, h);
                            URL.revokeObjectURL(img.src);
                            resolve();
                        };
                        img.onerror = resolve; // 出错跳过
                    });
                }
            } else {
                console.error(`第 ${i+1} 页下载失败:`, rawPath);
            }
        }

        // 导出文件
        const safeTitle = document.title.replace(/[\\/:*?"<>|]/g, "_") || "云展网电子书";

        if (successCount === 0) {
            alert("❌ 所有图片下载失败！\n可能原因：\n1. 此书开启了特殊加密。\n2. 网络连接问题。");
        } else {
            showStatus("📦 正在打包，请稍候...");
            if (mode === 'zip') {
                const content = await zip.generateAsync({ type: "blob" });
                saveFile(content, `${safeTitle}.zip`);
            } else {
                if (pdf) pdf.save(`${safeTitle}.pdf`);
            }
            showStatus(`🎉 完成！成功下载 ${successCount} 页`, true);
        }

        // 恢复 UI
        [btnZip, btnPdf].forEach(b => { b.disabled = false; b.style.opacity = 1; });
    };

    const saveFile = (blob, filename) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 绑定事件
    btnZip.onclick = () => startDownload('zip');
    btnPdf.onclick = () => startDownload('pdf');

})();