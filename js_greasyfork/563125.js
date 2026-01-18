// ==UserScript==
// @name         javlib更好的图片预览
// @namespace    http://tampermonkey.net/
// @version      2026-01-18
// @description  Flex layout preview with modal viewer + prev/next
// @author       dan
// @match        https://www.z93j.com/*
// @match        https://www.javlib.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563125/javlib%E6%9B%B4%E5%A5%BD%E7%9A%84%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/563125/javlib%E6%9B%B4%E5%A5%BD%E7%9A%84%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 防止重复初始化 =====
    if (window.__previewThumbsInitialized__) return;
    window.__previewThumbsInitialized__ = true;

    function init() {
        const original = document.querySelector('.previewthumbs');
        if (!original) return;
        if (original.dataset.processed === '1') return;
        original.dataset.processed = '1';

        original.style.display = 'none';

        const links = Array.from(original.querySelectorAll('a'));
        if (links.length === 0) return;

        // ===== 图片数据 =====
        const images = links.map(link => link.href);
        let currentIndex = 0;

        // ===== Flex 容器 =====
        const flexBox = document.createElement('div');
        flexBox.style.cssText = `
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 20px;
            max-width: auto;
            margin: 20px auto;
            justify-content: left;
        `;

        // ===== 弹窗 =====
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalImg = document.createElement('img');
        modalImg.style.cssText = `
            max-width: 92vw;
            max-height: 92vh;
            box-shadow: 0 0 24px rgba(0,0,0,0.8);
        `;

        // ===== 上一张 / 下一张按钮 =====
        const createButton = (text, side) => {
            const btn = document.createElement('div');
            btn.textContent = text;
            btn.style.cssText = `
                position: absolute;
                top: 50%;
                ${side}: -136px;
                transform: translateY(-50%);
                font-size: 40px;
                color: #fff;
                cursor: pointer;
                user-select: none;
                padding: 240px 60px;
                opacity: 0.8;


                background: rgba(40, 40, 40, 0.75);
                border: 1px solid rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(2px);
                border-radius: 12px;

                opacity: 0.6;
                transition:
                    background 0.2s ease,
                    opacity 0.2s ease,
                    transform 0.15s ease;
            `;
            btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '0.8');
            return btn;
        };

        const prevBtn = createButton('‹', 'left');
        const nextBtn = createButton('›', 'right');

        function showImage(index) {
            currentIndex = (index + images.length) % images.length;
            modalImg.src = images[currentIndex];
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });

        modal.appendChild(prevBtn);
        modal.appendChild(modalImg);
        modal.appendChild(nextBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            modalImg.src = '';
        });

        // ===== 缩略图 =====
        links.forEach((link, index) => {
            const img = link.querySelector('img');
            if (!img) return;

            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.loading = 'lazy';
            thumb.style.cssText = `
                width: 120px;
                cursor: pointer;
                border-radius: 4px;
                transition: transform .15s, box-shadow .15s;
            `;

            thumb.addEventListener('mouseenter', () => {
                thumb.style.transform = 'scale(1.05)';
                thumb.style.boxShadow = '0 4px 10px rgba(0,0,0,.4)';
            });

            thumb.addEventListener('mouseleave', () => {
                thumb.style.transform = 'scale(1)';
                thumb.style.boxShadow = 'none';
            });

            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
                overlay.style.display = 'flex';
            });

            flexBox.appendChild(thumb);
        });

        original.parentNode.insertBefore(flexBox, original.nextSibling);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
