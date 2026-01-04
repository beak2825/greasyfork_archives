// ==UserScript==
// @name         哔哩哔哩课堂 打卡下载所有文件（CORS 修复版）
// @namespace    https://citv.cn/
// @version      1.1
// @description  在 .xe-preview__container 添加“下载所有文件”按钮，使用 GM_download 绕过 CORS
// @match        https://*.citv.cn/*
// @run-at       document-end
// @grant        GM_download
// @license      MIT
// @author       Kaesinol
// @downloadURL https://update.greasyfork.org/scripts/559703/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%AF%BE%E5%A0%82%20%E6%89%93%E5%8D%A1%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6%EF%BC%88CORS%20%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559703/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%AF%BE%E5%A0%82%20%E6%89%93%E5%8D%A1%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6%EF%BC%88CORS%20%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 仅移除你指定的参数
    const CLEAN_PARAM_RE =
        /\?(?:imageView2\/2\/q\/100\|imageMogr2\/ignore-error\/1)$/;

    function cleanUrl(url) {
        return url.replace(CLEAN_PARAM_RE, '');
    }

    function uniq(arr) {
        return [...new Set(arr)];
    }

    function getFilename(url) {
        try {
            return decodeURIComponent(
                url.split('/').pop().split('?')[0]
            );
        } catch {
            return 'download';
        }
    }

    function gmDownload(url) {
        return new Promise((resolve) => {
            GM_download({
                url,
                name: getFilename(url),
                saveAs: false,
                onload: resolve,
                onerror: (e) => {
                    console.error('下载失败:', url, e);
                    resolve();
                }
            });
        });
    }

    async function downloadAll(container) {
        const urls = [];

        container.querySelectorAll('img[src]').forEach(e =>
            urls.push(cleanUrl(e.src))
        );
        container.querySelectorAll('video[src], source[src]').forEach(e =>
            urls.push(cleanUrl(e.src))
        );
        container.querySelectorAll('audio[src]').forEach(e =>
            urls.push(cleanUrl(e.src))
        );
        container.querySelectorAll('a[href]').forEach(e =>
            urls.push(cleanUrl(e.href))
        );

        const list = uniq(
            urls.filter(u => /^https?:\/\//.test(u))
        );

        for (const url of list) {
            await gmDownload(url);
            await new Promise(r => setTimeout(r, 300)); // 防止浏览器风控
        }

        alert(`下载完成：${list.length} 个文件`);
    }

    function addButton(container) {
        if (container.querySelector('.tm-download-all')) return;

        const btn = document.createElement('button');
        btn.className = 'tm-download-all';
        btn.textContent = '下载所有文件';

        btn.style.cssText = `
            position: sticky;
            top: 8px;
            z-index: 9999;
            margin: 8px;
            padding: 6px 12px;
            background: #1677ff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        btn.onclick = () => downloadAll(container);
        container.prepend(btn);
    }

    function init(root = document) {
        root.querySelectorAll('.xe-preview__container').forEach(addButton);
    }

    init();

    new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1) init(n);
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
