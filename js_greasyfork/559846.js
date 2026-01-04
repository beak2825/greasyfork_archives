// ==UserScript==
// @name         PTer-猫站保种页面种子下载链接-批量复制
// @namespace    https://pterclub.net/
// @version      1.2
// @description  在 reseed.php 页面批量提取真实下载链接（含 passkey）
// @match        https://pterclub.net/reseed.php*
// @grant        GM_setClipboard
// @icon         https://pterclub.net/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559846/PTer-%E7%8C%AB%E7%AB%99%E4%BF%9D%E7%A7%8D%E9%A1%B5%E9%9D%A2%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5-%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/559846/PTer-%E7%8C%AB%E7%AB%99%E4%BF%9D%E7%A7%8D%E9%A1%B5%E9%9D%A2%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5-%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getDownloadLinks() {
        const set = new Set();

        document.querySelectorAll('a[href*="download.php?id="]').forEach(a => {
            let href = a.getAttribute('href');
            if (!href) return;

            // 统一成完整 URL
            if (href.startsWith('/')) {
                href = location.origin + href;
            } else if (!href.startsWith('http')) {
                href = location.origin + '/' + href;
            }

            set.add(href);
        });

        return Array.from(set);
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '复制 reseed 下载链接';
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 30px;
            z-index: 99999;
            padding: 10px 16px;
            background: #e91e63;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        `;

        btn.onclick = () => {
            const links = getDownloadLinks();
            if (links.length === 0) {
                alert('未找到任何下载链接（请确认已登录）');
                return;
            }
            GM_setClipboard(links.join('\n'));
            alert(`已复制 ${links.length} 条下载链接`);
        };

        document.body.appendChild(btn);
    }

    // 确保 DOM 就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
})();