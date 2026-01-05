// ==UserScript==
// @name         Seedhub 网盘链接自动解析
// @name:zh-CN   Seedhub 网盘链接自动解析
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  动解析 Seedhub 资源页面的二维码
// @author       immwind
// @match        *://*.seedhub.cc/link_start/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=seedhub.cc
// @license      MIT
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561481/Seedhub%20%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/561481/Seedhub%20%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .qr-link {
            display: block;
            margin-top: 5px;
            text-decoration: none;
        }
        .qr-link:hover {
            text-decoration: underline;
        }
    `);

    // 解析二维码图片
    function decodeQRCode(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            resolve(code ? code.data : null);
        });
    }

    // 创建链接元素
    function createLinkElement(url) {
        const link = document.createElement('a');
        link.className = 'qr-link';
        link.href = url;
        link.textContent = url;
        return link;
    }

    async function processQrCode() {
        const mobilePan = document.querySelector('.mobile-pan');
        if (!mobilePan) return;

        const img = document.querySelector('#qrcode img');
        if (!img || !img.src) return;

        const decode = async () => {
            const url = await decodeQRCode(img);
            if (url) {
                const link = createLinkElement(url);
                mobilePan.insertAdjacentElement('afterend', link);
            }
        };

        if (img.complete) {
            await decode();
        } else {
            img.onload = decode;
        }
    }

    // 页面加载时执行一次
    processQrCode();
})();
