// ==UserScript==
// @name         X 推文图片原图链接一键复制 + 合成图片下载
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  复制当前推文图片原图链接，并可按顺序合成为一张图片
// @match        https://x.com/*/status/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563183/X%20%E6%8E%A8%E6%96%87%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20%2B%20%E5%90%88%E6%88%90%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/563183/X%20%E6%8E%A8%E6%96%87%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20%2B%20%E5%90%88%E6%88%90%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========= Toast ========= */
    function showToast(text) {
        const toast = document.createElement('div');
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
            padding: 10px 16px;
            background: rgba(0,0,0,.75);
            color: #fff;
            font-size: 14px;
            border-radius: 8px;
            opacity: 0;
            transition: opacity .25s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 250);
        }, 1800);
    }

    /* ========= Tweet ========= */
    function getCurrentTweetArticle() {
        const id = location.pathname.match(/status\/(\d+)/)?.[1];
        if (!id) return null;
        return [...document.querySelectorAll('article')]
            .find(a => a.querySelector(`a[href*="/status/${id}"]`));
    }

    function getImageUrls() {
        const article = getCurrentTweetArticle();
        if (!article) return [];

        const urls = [];
        article.querySelectorAll('img').forEach(img => {
            if (!img.src?.includes('pbs.twimg.com/media/')) return;
            const u = new URL(img.src);
            u.searchParams.set('name', 'orig');
            if (!urls.includes(u.toString())) urls.push(u.toString());
        });
        return urls;
    }

    /* ========= Actions ========= */
    function copyImages() {
        const urls = getImageUrls();
        if (!urls.length) {
            showToast('未检测到图片');
            return;
        }
        GM_setClipboard(urls.join('\n'));
        showToast(`已复制 ${urls.length} 张原图链接`);
    }

    async function mergeImages() {
        const urls = getImageUrls();
        if (!urls.length) {
            showToast('没有可合成的图片');
            return;
        }

        showToast('正在合成…');

        const images = await Promise.all(urls.map(u => new Promise((res, rej) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = u;
        })));

        const width = Math.max(...images.map(i => i.width));
        const height = images.reduce((s, i) => s + i.height, 0);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        let y = 0;
        images.forEach(img => {
            ctx.drawImage(img, 0, y);
            y += img.height;
        });

        const blob = await new Promise(r => canvas.toBlob(r));
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'tweet_merged.png';
        a.click();
        URL.revokeObjectURL(url);

        showToast('合成完成，已下载');
    }

    /* ========= UI ========= */
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        display: flex;
        gap: 8px;
        padding: 6px;
        background: rgba(255,255,255,.9);
        backdrop-filter: blur(6px);
        border-radius: 10px;
        box-shadow: 0 4px 14px rgba(0,0,0,.12);
    `;

    function makeBtn(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 6px 14px;
            font-size: 13px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            background: #1d9bf0;
            color: #fff;
            transition: all .15s ease;
        `;
        btn.onmouseenter = () => btn.style.background = '#1a8cd8';
        btn.onmouseleave = () => btn.style.background = '#1d9bf0';
        btn.onmousedown = () => btn.style.transform = 'scale(0.96)';
        btn.onmouseup = () => btn.style.transform = 'scale(1)';
        return btn;
    }

    const copyBtn = makeBtn('复制原图');
    const mergeBtn = makeBtn('合成图片');

    copyBtn.onclick = copyImages;
    mergeBtn.onclick = mergeImages;

    panel.append(copyBtn, mergeBtn);
    document.body.appendChild(panel);
})();
