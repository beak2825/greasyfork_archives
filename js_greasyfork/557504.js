// ==UserScript==
// @name         THEOL PDF/PPT 批量下载助手 (单张版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 THEOL 教学平台页面添加“批量下载”按钮，自动逐张保存所有图片格式的课件。适用于所有使用 THEOL 在线教学平台的学校（如北京化工大学、北京大学等）。
// @author       YourName
// @license      MIT
// @match        *://*/meol/analytics/resPdfShow.do*
// @match        *://*/meol/common/resPdfShow.do*
// @match        *://*/*/resPdfShow.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557504/THEOL%20PDFPPT%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28%E5%8D%95%E5%BC%A0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557504/THEOL%20PDFPPT%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28%E5%8D%95%E5%BC%A0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const CONFIG = {
        btnText: '📥 批量保存图片',
        btnProcessing: '⏳ 下载中...',
        btnDone: '✅ 下载完成',
        interval: 500 // 下载间隔(毫秒)，太快可能会被浏览器拦截
    };

    // --- 样式设置 ---
    const btnStyle = `
        position: fixed;
        bottom: 50px;
        right: 50px;
        z-index: 9999;
        padding: 12px 20px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        cursor: pointer;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: bold;
        transition: background-color 0.3s;
    `;

    // --- 初始化 ---
    function init() {
        // 避免在 iframe 内部重复添加按钮，只在顶层或特定的 iframe 逻辑中运行
        // 但由于我们需要操作 iframe 内的 DOM，按钮最好加在用户能看到的那个文档层
        
        // 简单判断：如果当前窗口是顶层窗口，或者当前窗口包含 pdfContainer，则添加按钮
        if (window.self === window.top || document.querySelector('.pageContainer')) {
             createButton();
        }
    }

    function createButton() {
        if (document.getElementById('theol-download-btn')) return;

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'theol-download-btn';
        downloadBtn.innerText = CONFIG.btnText;
        downloadBtn.style.cssText = btnStyle;
        downloadBtn.title = '点击开始批量下载（请先手动滚动浏览完所有页面以加载图片）';

        // 鼠标悬停效果
        downloadBtn.onmouseover = () => downloadBtn.style.backgroundColor = '#1976D2';
        downloadBtn.onmouseout = () => downloadBtn.style.backgroundColor = '#2196F3';

        document.body.appendChild(downloadBtn);

        downloadBtn.onclick = () => startDownloadProcess(downloadBtn);
    }

    function startDownloadProcess(btn) {
        console.log("[THEOL Helper] 初始化下载脚本...");

        // 1. 确定操作的文档对象 (兼容直接运行和 iframe 情况)
        let targetDoc = document;
        const iframe = document.getElementById('pdf1frame');

        // 如果当前页面有一个 id 为 pdf1frame 的 iframe，说明我们在父页面，需要深入进去
        if (iframe) {
            try {
                targetDoc = iframe.contentDocument || iframe.contentWindow.document;
                console.log("[THEOL Helper] 检测到 iframe，切换上下文...");
            } catch (e) {
                alert("无法访问课件 iframe，可能是跨域限制。\n请尝试点击页面内的课件区域，或者联系脚本作者。");
                return;
            }
        }

        // 2. 查找图片
        const images = targetDoc.querySelectorAll('div.pageContainer img');

        if (images.length === 0) {
            alert("未找到图片！\n\n请尝试：\n1. 【重要】先手动把滚动条拉到最底部，让所有图片都加载出来。\n2. 确保页面已完全加载。");
            return;
        }

        // 3. 确认开始
        const confirmMsg = `共检测到 ${images.length} 页课件。\n\n【重要提示】\n1. 请确保你已经手动滚动浏览过所有页面，否则下载的可能是空白页。\n2. 浏览器若提示“允许下载多个文件”，请务必点击【允许】。\n\n是否开始逐张下载？`;
        if (!confirm(confirmMsg)) return;

        btn.innerText = CONFIG.btnProcessing;
        btn.disabled = true;
        btn.style.backgroundColor = '#ccc';

        // 4. 执行循环下载
        let index = 0;
        
        function downloadNext() {
            if (index >= images.length) {
                alert("✅ 所有页面下载完成！");
                btn.innerText = CONFIG.btnText;
                btn.disabled = false;
                btn.style.backgroundColor = '#2196F3';
                return;
            }

            const img = images[index];
            const src = img.src;

            // 检查是否是 base64 图片且内容有效
            if (src && src.startsWith('data:image')) {
                const link = document.createElement('a');
                link.href = src;
                // 文件名格式：Page_001.png
                link.download = `Page_${(index + 1).toString().padStart(3, '0')}.png`;

                document.body.appendChild(link);
                link.click(); // 触发点击下载
                document.body.removeChild(link);

                // 更新按钮状态
                btn.innerText = `⏳ (${index + 1}/${images.length})`;
            } else {
                console.warn(`[THEOL Helper] 第 ${index + 1} 页数据无效或未加载，跳过。`);
            }

            index++;
            // 间隔防止浏览器卡死或拦截
            setTimeout(downloadNext, CONFIG.interval);
        }

        downloadNext();
    }

    // 延时加载以确保 DOM 准备好
    setTimeout(init, 1000);

})();