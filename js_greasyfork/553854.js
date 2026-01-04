// ==UserScript==
// @name         漫画图片下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 Kindle 阅读器中实时截取当前漫画画面并保存
// @author       匿名
// @match        https://read.amazon.co.jp/manga/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553854/%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553854/%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '保存当前页';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        fontSize: '14px'
    });
    document.body.appendChild(btn);

    // 点击按钮保存
    btn.addEventListener('click', () => {
        const img = document.querySelectorAll('img')[1];
        if (!img) {
            alert('未找到图片');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `page_${Date.now()}.jpg`; // 每次不同文件名
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 1.0);
    });
})();
