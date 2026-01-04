// ==UserScript==
// @name         洛谷题目PDF下载（自动命名）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  洛谷题目页面生成PDF，自动以PXXXX命名
// @author       豆包编程助手
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551337/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AEPDF%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551337/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AEPDF%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = '另存为 PDF';
    downloadBtn.id = 'pdf-download-btn';

    // 按钮样式
    GM_addStyle(`
        #pdf-download-btn {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 9999;
            padding: 10px 18px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        #pdf-download-btn:hover {
            background-color: #0b7dda;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        #pdf-download-btn:active {
            transform: translateY(0);
        }
        #pdf-download-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    `);

    document.body.appendChild(downloadBtn);

    // 从URL提取问题编号（PXXXX格式）
    function getProblemId() {
        // 匹配URL中的/problem/PXXXX部分
        const match = window.location.href.match(/\/problem\/(P\d+)/);
        return match ? match[1] : 'luogu-problem';
    }

    // 点击事件
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadBtn.innerText = '正在生成...';

        try {
            // 获取问题编号作为文件名
            const problemId = getProblemId();
            const fileName = `${problemId}.pdf`;

            // 克隆内容并清理不需要的元素
            const mainContent = document.querySelector('.main-container') || document.body;
            const contentClone = mainContent.cloneNode(true);

            const elementsToRemove = contentClone.querySelectorAll(
                '.lg-content-nav, .lg-right-bar, .ad, .banner, .comment, .discuss, .pagination, .copy-code, #pdf-download-btn'
            );
            elementsToRemove.forEach(el => el.remove());

            // PDF配置（横向A4）
            const opt = {
                margin: 15,
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            // 生成并下载PDF
            await html2pdf().set(opt).from(contentClone).save();
        } catch (error) {
            console.error('PDF生成失败:', error);
            alert('PDF生成失败，请重试');
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerText = '另存为 PDF';
        }
    });
})();
