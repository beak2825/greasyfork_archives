// ==UserScript==
// @name         Twitter X 圖片長按放大 + 可見切換箭頭
// @name:en      Twitter X Media Viewer Visible Side Buttons
// @name:ja      Twitter X メディアビューア（サイドボタン付き）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description         長按推特圖片放大，支援滾輪縮放、拖曳移動、左右整頁切圖與箭頭提示，不會誤關閉。
// @description:en      Long-press to enlarge Twitter images with zoom, drag, and visible side arrows for navigation.
// @description:ja      Twitter画像を長押しで拡大！ズーム・ドラッグ・左右切り替え＆矢印ヒント付きビューア。
// @author       Leam
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552349/Twitter%20X%20%E5%9C%96%E7%89%87%E9%95%B7%E6%8C%89%E6%94%BE%E5%A4%A7%20%2B%20%E5%8F%AF%E8%A6%8B%E5%88%87%E6%8F%9B%E7%AE%AD%E9%A0%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/552349/Twitter%20X%20%E5%9C%96%E7%89%87%E9%95%B7%E6%8C%89%E6%94%BE%E5%A4%A7%20%2B%20%E5%8F%AF%E8%A6%8B%E5%88%87%E6%8F%9B%E7%AE%AD%E9%A0%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LONGPRESS_TIME = 500;
    let allImages = [];
    let overlay, imgLarge, currentIndex;
    let scale = 1, offsetX = 0, offsetY = 0;
    let isDragging = false, justDragged = false;
    let dragStartX = 0, dragStartY = 0;

    const observer = new MutationObserver(() => {
        allImages = Array.from(document.querySelectorAll('img[src*="twimg.com/media"]'));
        allImages.forEach(img => {
            if(img.dataset.viewerAdded) return;
            img.dataset.viewerAdded = true;

            img.style.cursor = 'zoom-in';
            let timer;
            img.addEventListener('mousedown', (e) => {
                if(e.button !== 0) return;
                timer = setTimeout(() => openOverlay(allImages.indexOf(img)), LONGPRESS_TIME);
            });
            img.addEventListener('mouseup', () => clearTimeout(timer));
            img.addEventListener('mouseleave', () => clearTimeout(timer));
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function openOverlay(index) {
        currentIndex = index;
        scale = 1; offsetX = 0; offsetY = 0;

        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;
        overlay.style.overflow = 'hidden';

        imgLarge = document.createElement('img');
        imgLarge.src = getLarge(allImages[currentIndex].src);
        imgLarge.style.maxWidth = '90%';
        imgLarge.style.maxHeight = '90%';
        imgLarge.style.borderRadius = '8px';
        imgLarge.style.cursor = 'grab';
        imgLarge.style.userSelect = 'none';
        imgLarge.style.transform = `translate(0px,0px) scale(${scale})`;
        overlay.appendChild(imgLarge);

        // 左右全高度切換區+箭頭提示
        addFullSideBtn('left', () => change(-1));
        addFullSideBtn('right', () => change(1));

        overlay.addEventListener('click', (e) => {
            if(!isDragging && !justDragged) closeOverlay();
        });

        // 滾輪縮放
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = imgLarge.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width/2);
            const dy = e.clientY - (rect.top + rect.height/2);

            let oldScale = scale;
            scale += e.deltaY * -0.0015;
            scale = Math.min(Math.max(0.2, scale), 5);

            offsetX -= dx * (scale - oldScale);
            offsetY -= dy * (scale - oldScale);
            updateTransform();
        });

        // 拖曳
        imgLarge.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            isDragging = true;
            dragStartX = e.clientX - offsetX;
            dragStartY = e.clientY - offsetY;
            imgLarge.setPointerCapture(e.pointerId);
            imgLarge.style.cursor = 'grabbing';
        });

        imgLarge.addEventListener('pointermove', (e) => {
            if(!isDragging) return;
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            updateTransform();
        });

        imgLarge.addEventListener('pointerup', (e) => {
            if(!isDragging) return;
            isDragging = false;
            justDragged = true;
            imgLarge.releasePointerCapture(e.pointerId);
            imgLarge.style.cursor = 'grab';
            setTimeout(() => { justDragged = false; }, 50);
        });

        document.body.appendChild(overlay);
    }

    function updateTransform() {
        imgLarge.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    function addFullSideBtn(side, callback) {
        const btn = document.createElement('div');
        btn.style.position = 'absolute';
        btn.style.top = '0';
        btn.style[side] = '0';
        btn.style.height = '100%';
        btn.style.width = '150px';           // 寬度夠大
        btn.style.cursor = 'pointer';
        btn.style.zIndex = 10000;
        btn.style.userSelect = 'none';
        btn.style.background = 'rgba(255,255,255,0.1)'; // 半透明提示

        // 箭頭提示
        const arrow = document.createElement('div');
        arrow.textContent = side === 'left' ? '⟨' : '⟩';
        arrow.style.position = 'absolute';
        arrow.style.top = '50%';
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.fontSize = '3rem';
        arrow.style.color = 'white';
        arrow.style.textAlign = 'center';
        arrow.style.width = '100%';
        arrow.style.pointerEvents = 'none'; // 不阻擋點擊
        btn.appendChild(arrow);

        overlay.appendChild(btn);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
            scale = 1; offsetX = 0; offsetY = 0;
            updateTransform();
        });
    }

    function getLarge(src) { return src.replace(/&name=.*$/, '&name=large'); }

    function change(dir) {
        currentIndex = (currentIndex + dir + allImages.length) % allImages.length;
        imgLarge.src = getLarge(allImages[currentIndex].src);
        scale = 1; offsetX = 0; offsetY = 0; updateTransform();
    }

    function closeOverlay() {
        if(overlay) document.body.removeChild(overlay);
        overlay = null;
        isDragging = false;
        justDragged = false;
    }
})();
