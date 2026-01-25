// ==UserScript==
// @name         Komica Media Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  改善 Komica 媒體展開顯示，提供懸浮、拖曳和縮放功能
// @author       You
// @match        *://*.komica1.org/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563998/Komica%20Media%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/563998/Komica%20Media%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定義樣式
    const style = document.createElement('style');
    style.textContent = `
        .komica-media-container {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #444;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            cursor: move;
            width: 500px;
            height: 400px;
            min-width: 200px;
            min-height: 150px;
            max-width: 90vw;
            max-height: 90vh;
            display: none;
            box-sizing: border-box;
            will-change: transform, left, top;
        }

        .komica-media-container.active {
            display: block;
        }

        .komica-media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 3px 5px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: move;
            height: 28px;
            min-height: 28px;
        }

        .komica-media-controls {
            display: flex;
            gap: 8px;
        }

        .komica-media-btn {
            background: #555;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .komica-media-btn:hover {
            background: #777;
        }

        .komica-media-btn.close-btn {
            background: rgba(255, 77, 77, 0.8);
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .komica-media-btn.close-btn:hover {
            background: rgba(255, 77, 77, 1);
            transform: scale(1.1);
        }

        .komica-media-btn.reset-zoom-btn {
            background: rgba(100, 150, 255, 0.8);
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 14px;
            font-weight: bold;
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .komica-media-btn.reset-zoom-btn:hover {
            background: rgba(100, 150, 255, 1);
            transform: scale(1.1);
        }

        .komica-media-content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: calc(100% - 35px);
            overflow: hidden;
            box-sizing: border-box;
            position: relative;
        }

        .komica-media-content img,
        .komica-media-content video {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            will-change: transform;
            backface-visibility: hidden;
            transform: translateZ(0);
        }

        /* 操作提示 icon */
        .komica-media-hint {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
            align-items: center;
            gap: 6px;
            z-index: 10002;
            pointer-events: none;
            backdrop-filter: blur(5px);
        }

        .komica-media-content:hover .komica-media-hint {
            display: flex;
        }

        .komica-media-hint-icon {
            font-size: 14px;
        }

        /* 調整大小的拖曳點 */
        .komica-resize-handle {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            z-index: 10001;
        }

        .komica-resize-handle:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        .komica-resize-handle.nw {
            top: 0;
            left: 0;
            width: 5px;
            height: 5px;
            cursor: nw-resize;
        }

        .komica-resize-handle.ne {
            top: 0;
            right: 0;
            width: 5px;
            height: 5px;
            cursor: ne-resize;
        }

        .komica-resize-handle.sw {
            bottom: 0;
            left: 0;
            width: 5px;
            height: 5px;
            cursor: sw-resize;
        }

        .komica-resize-handle.se {
            bottom: 0;
            right: 0;
            width: 5px;
            height: 5px;
            cursor: se-resize;
        }

        .komica-resize-handle.n {
            top: 0;
            left: 5px;
            right: 5px;
            height: 5px;
            cursor: n-resize;
        }

        .komica-resize-handle.s {
            bottom: 0;
            left: 5px;
            right: 5px;
            height: 5px;
            cursor: s-resize;
        }

        .komica-resize-handle.w {
            left: 0;
            top: 5px;
            bottom: 5px;
            width: 5px;
            cursor: w-resize;
        }

        .komica-resize-handle.e {
            right: 0;
            top: 5px;
            bottom: 5px;
            width: 5px;
            cursor: e-resize;
        }

        .komica-media-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: none;
        }

        .komica-media-overlay.active {
            display: block;
        }

        /* 隱藏原始展開的媒體（只針對 Komica 的展開媒體，避免與其他腳本衝突） */
        /* 使用更精確的選擇器，排除 YouTube 相關元素 */
        .komica-hide-expanded > .expanded-element,
        .komica-hide-expanded > img.expanded-element,
        .komica-hide-expanded > video[controls][loop] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 創建媒體容器
    const overlay = document.createElement('div');
    overlay.className = 'komica-media-overlay';
    document.body.appendChild(overlay);

    const container = document.createElement('div');
    container.className = 'komica-media-container';
    container.innerHTML = `
        <div class="komica-media-header">
            <div class="komica-media-controls">
                <button class="komica-media-btn reset-zoom-btn" title="重置縮放">⟲</button>
            </div>
            <button class="komica-media-btn close-btn" title="關閉">✕</button>
        </div>
        <div class="komica-media-content">
            <div class="komica-media-hint">
                <span class="komica-media-hint-icon"></span>
                <span class="komica-media-hint-text"></span>
            </div>
        </div>
        <div class="komica-resize-handle nw"></div>
        <div class="komica-resize-handle ne"></div>
        <div class="komica-resize-handle sw"></div>
        <div class="komica-resize-handle se"></div>
        <div class="komica-resize-handle n"></div>
        <div class="komica-resize-handle s"></div>
        <div class="komica-resize-handle w"></div>
        <div class="komica-resize-handle e"></div>
    `;
    document.body.appendChild(container);

    // 狀態變數
    let isDragging = false;
    let isResizing = false;
    let resizeDirection = '';
    let initialX;
    let initialY;
    let initialWidth;
    let initialHeight;
    let initialLeft;
    let initialTop;
    let currentMedia = null;
    let mediaScale = 1;
    let mediaTranslateX = 0;
    let mediaTranslateY = 0;

    // 獲取元素
    const mediaContent = container.querySelector('.komica-media-content');
    const mediaHeader = container.querySelector('.komica-media-header');
    const closeBtn = container.querySelector('.close-btn');
    const resetZoomBtn = container.querySelector('.reset-zoom-btn');
    const resizeHandles = container.querySelectorAll('.komica-resize-handle');
    let mediaHint = container.querySelector('.komica-media-hint');
    let mediaHintIcon = container.querySelector('.komica-media-hint-icon');
    let mediaHintText = container.querySelector('.komica-media-hint-text');

    // 關閉功能
    function closeMedia() {
        container.classList.remove('active');
        overlay.classList.remove('active');
        mediaContent.innerHTML = '';
        currentMedia = null;
        mediaScale = 1;
        mediaTranslateX = 0;
        mediaTranslateY = 0;
    }

    closeBtn.addEventListener('click', closeMedia);
    overlay.addEventListener('click', closeMedia);

    // 重置縮放功能
    function resetMediaZoom() {
        if (!currentMedia) return;
        
        mediaScale = 1;
        mediaTranslateX = 0;
        mediaTranslateY = 0;
        
        currentMedia.style.transform = 'translate(0, 0) scale(1)';
        currentMedia.style.cursor = 'default';
        mediaContent.style.cursor = '';
        
        // 確保媒體在容器中居中顯示
        currentMedia.style.maxWidth = '100%';
        currentMedia.style.maxHeight = '100%';
        currentMedia.style.width = 'auto';
        currentMedia.style.height = 'auto';
    }

    resetZoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetMediaZoom();
    });

    // 滾輪縮放功能（在游標位置局部放大）
    mediaContent.addEventListener('wheel', (e) => {
        if (!currentMedia) return;
        
        e.preventDefault();
        
        const contentRect = mediaContent.getBoundingClientRect();
        const mouseX = e.clientX - contentRect.left;
        const mouseY = e.clientY - contentRect.top;
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.5, Math.min(5, mediaScale + delta));
        
        // 獲取媒體的原始尺寸（未縮放時）
        const naturalWidth = currentMedia.naturalWidth || currentMedia.videoWidth || currentMedia.offsetWidth / mediaScale;
        const naturalHeight = currentMedia.naturalHeight || currentMedia.videoHeight || currentMedia.offsetHeight / mediaScale;
        
        // 計算媒體內容區域的中心點（作為基準點）
        const contentCenterX = contentRect.width / 2;
        const contentCenterY = contentRect.height / 2;
        
        // 計算媒體的基準位置（未縮放時居中）
        const baseMediaLeft = contentCenterX - naturalWidth / 2;
        const baseMediaTop = contentCenterY - naturalHeight / 2;
        
        // 計算當前媒體的實際顯示位置（考慮縮放和平移）
        const currentMediaLeft = baseMediaLeft + mediaTranslateX;
        const currentMediaTop = baseMediaTop + mediaTranslateY;
        
        // 計算游標相對於當前媒體的位置（在當前縮放狀態下）
        const relativeX = (mouseX - currentMediaLeft) / mediaScale;
        const relativeY = (mouseY - currentMediaTop) / mediaScale;
        
        // 計算新的媒體位置，保持游標下的點不變
        // 新的媒體左邊緣位置 = 游標位置 - 相對位置 * 新縮放比例
        const newMediaLeft = mouseX - relativeX * newScale;
        const newMediaTop = mouseY - relativeY * newScale;
        
        // 計算新的平移值（相對於基準位置）
        mediaTranslateX = newMediaLeft - baseMediaLeft;
        mediaTranslateY = newMediaTop - baseMediaTop;
        
        mediaScale = newScale;
        
        // 應用縮放和平移
        currentMedia.style.transform = `translate(${mediaTranslateX}px, ${mediaTranslateY}px) scale(${mediaScale})`;
        currentMedia.style.transformOrigin = '0 0';
        
        // 更新游標樣式
        if (mediaScale > 1) {
            mediaContent.style.cursor = 'grab';
            currentMedia.style.cursor = 'grab';
        } else {
            mediaContent.style.cursor = '';
            currentMedia.style.cursor = 'default';
        }
    }, { passive: false });

    // 更新操作提示
    function updateMediaHint(mediaType) {
        if (mediaType === 'image') {
            mediaHintIcon.textContent = '🖼️';
            mediaHintText.textContent = '滾輪縮放 | 拖曳移動';
        } else if (mediaType === 'video') {
            mediaHintIcon.textContent = '▶️';
            mediaHintText.textContent = '滾輪縮放 | 拖曳移動 | 點擊播放';
        } else {
            mediaHintIcon.textContent = '📄';
            mediaHintText.textContent = '滾輪縮放 | 拖曳移動';
        }
    }

    // 媒體拖曳功能（當縮放後可以拖曳移動）
    let isMediaDragging = false;
    let mediaDragStartX = 0;
    let mediaDragStartY = 0;
    let mediaDragStartTranslateX = 0;
    let mediaDragStartTranslateY = 0;

    mediaContent.addEventListener('mousedown', (e) => {
        if (!currentMedia) return;
        // 避免與影片控制項衝突
        if (e.target.tagName === 'VIDEO' && e.target.controls) {
            const rect = e.target.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            // 如果點擊在控制列區域，不處理拖曳
            if (clickY > rect.height - 50) return;
        }
        if (e.target === currentMedia || currentMedia.contains(e.target)) {
            // 允許在任何狀態下拖曳（如果已縮放）
            if (mediaScale > 1) {
                isMediaDragging = true;
                mediaDragStartX = e.clientX;
                mediaDragStartY = e.clientY;
                mediaDragStartTranslateX = mediaTranslateX;
                mediaDragStartTranslateY = mediaTranslateY;
                mediaContent.style.cursor = 'grabbing';
                if (currentMedia) currentMedia.style.cursor = 'grabbing';
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isMediaDragging && currentMedia) {
            e.preventDefault();
            
            const deltaX = e.clientX - mediaDragStartX;
            const deltaY = e.clientY - mediaDragStartY;
            
            // 直接更新平移值
            mediaTranslateX = mediaDragStartTranslateX + deltaX;
            mediaTranslateY = mediaDragStartTranslateY + deltaY;
            
            // 直接更新 DOM（保留 CSS 硬體加速優化）
            currentMedia.style.transform = `translate(${mediaTranslateX}px, ${mediaTranslateY}px) scale(${mediaScale})`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isMediaDragging) {
            isMediaDragging = false;
            
            if (mediaScale <= 1) {
                mediaContent.style.cursor = '';
                if (currentMedia) currentMedia.style.cursor = 'default';
            } else {
                mediaContent.style.cursor = 'grab';
                if (currentMedia) currentMedia.style.cursor = 'grab';
            }
        }
    });

    // 拖曳功能
    let lastContainerX = 0;
    let lastContainerY = 0;

    function dragStart(e) {
        if (e.target.classList.contains('komica-media-btn')) return;
        if (e.target.classList.contains('komica-resize-handle')) return;
        
        if (e.target === mediaHeader || e.target.closest('.komica-media-header')) {
            isDragging = true;
            container.style.cursor = 'grabbing';
            
            // 獲取當前容器的位置
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            // 計算新位置
            let newLeft = e.clientX - initialX;
            let newTop = e.clientY - initialY;
            
            // 限制在視窗範圍內
            const rect = container.getBoundingClientRect();
            const maxLeft = window.innerWidth - rect.width;
            const maxTop = window.innerHeight - rect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            // 直接更新位置（保留 CSS 硬體加速優化）
            container.style.right = 'auto';
            container.style.top = newTop + 'px';
            container.style.left = newLeft + 'px';
            container.style.transform = 'none';
            
            // 保存位置值（用於 mouseup 時的最終確認）
            lastContainerX = newLeft;
            lastContainerY = newTop;
        } else if (isResizing) {
            e.preventDefault();
            handleResize(e);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'move';
        } else if (isResizing) {
            isResizing = false;
            resizeDirection = '';
            document.body.style.cursor = '';
            
            // 調整容器大小後，重新應用媒體的縮放和平移
            // 保持當前的縮放和平移值不變，只是重新應用 transform
            if (currentMedia) {
                currentMedia.style.transform = `translate(${mediaTranslateX}px, ${mediaTranslateY}px) scale(${mediaScale})`;
            }
        }
    }

    // 調整大小功能
    function resizeStart(e, direction) {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        resizeDirection = direction;
        
        const rect = container.getBoundingClientRect();
        initialWidth = rect.width;
        initialHeight = rect.height;
        initialX = e.clientX;
        initialY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;
        
        document.body.style.cursor = getComputedStyle(e.target).cursor;
    }

    function handleResize(e) {
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;
        
        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialLeft;
        let newTop = initialTop;
        
        const minWidth = 200;
        const minHeight = 150;
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;
        
        if (resizeDirection.includes('e')) {
            newWidth = Math.min(Math.max(initialWidth + deltaX, minWidth), maxWidth);
        }
        if (resizeDirection.includes('w')) {
            newWidth = Math.min(Math.max(initialWidth - deltaX, minWidth), maxWidth);
            newLeft = initialLeft + (initialWidth - newWidth);
        }
        if (resizeDirection.includes('s')) {
            newHeight = Math.min(Math.max(initialHeight + deltaY, minHeight), maxHeight);
        }
        if (resizeDirection.includes('n')) {
            newHeight = Math.min(Math.max(initialHeight - deltaY, minHeight), maxHeight);
            newTop = initialTop + (initialHeight - newHeight);
        }
        
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
        
        // 更新位置
        if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
            container.style.right = 'auto';
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
            container.style.transform = 'none';
        }
    }

    // 為每個調整大小的拖曳點添加事件監聽
    resizeHandles.forEach(handle => {
        const direction = handle.className.split(' ')[1];
        handle.addEventListener('mousedown', (e) => resizeStart(e, direction));
    });

    mediaHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (!container.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeMedia();
        }
    });

    // 計算並設置容器大小
    function resizeContainerToMedia(mediaElement) {
        const naturalWidth = mediaElement.naturalWidth || mediaElement.videoWidth || mediaElement.width;
        const naturalHeight = mediaElement.naturalHeight || mediaElement.videoHeight || mediaElement.height;
        
        // 如果無法獲取尺寸，使用預設值
        if (!naturalWidth || !naturalHeight) {
            container.style.width = '500px';
            container.style.height = '400px';
            return;
        }
        
        // 計算可用的最大尺寸（考慮標題欄、padding、邊距）
        const headerHeight = 35;
        const padding = 20;
        const margin = 40;
        const maxContentHeight = window.innerHeight - headerHeight - padding - margin;
        const maxContentWidth = Math.min(window.innerWidth * 0.9 - padding - margin, 1200);
        
        // 計算縮放比例，確保不超出限制
        const scaleByHeight = maxContentHeight / naturalHeight;
        const scaleByWidth = maxContentWidth / naturalWidth;
        const scale = Math.min(scaleByHeight, scaleByWidth, 1); // 不放大，只縮小
        
        // 計算容器尺寸
        const contentWidth = naturalWidth * scale;
        const contentHeight = naturalHeight * scale;
        const containerWidth = Math.max(contentWidth + padding, 200); // 最小寬度
        const containerHeight = Math.max(contentHeight + headerHeight + padding + 5, 150); // 最小高度（+5 是 margin-bottom）
        
        // 設置容器大小
        container.style.width = containerWidth + 'px';
        container.style.height = containerHeight + 'px';
    }

    // 顯示媒體
    function showMedia(mediaElement) {
        // 重置縮放和平移
        mediaScale = 1;
        mediaTranslateX = 0;
        mediaTranslateY = 0;
        
        // 清空內容但保留提示元素
        const hintElement = mediaContent.querySelector('.komica-media-hint');
        const existingChildren = [];
        if (hintElement) {
            existingChildren.push(hintElement);
        }
        
        // 移除所有子元素（除了提示）
        while (mediaContent.firstChild) {
            if (mediaContent.firstChild !== hintElement) {
                mediaContent.removeChild(mediaContent.firstChild);
            } else {
                break;
            }
        }
        
        // 如果沒有提示元素，創建一個
        if (!hintElement) {
            const newHint = document.createElement('div');
            newHint.className = 'komica-media-hint';
            newHint.innerHTML = `
                <span class="komica-media-hint-icon"></span>
                <span class="komica-media-hint-text"></span>
            `;
            mediaContent.appendChild(newHint);
            mediaHint = newHint;
            mediaHintIcon = newHint.querySelector('.komica-media-hint-icon');
            mediaHintText = newHint.querySelector('.komica-media-hint-text');
        } else {
            // 重新獲取提示元素引用
            mediaHint = hintElement;
            mediaHintIcon = hintElement.querySelector('.komica-media-hint-icon');
            mediaHintText = hintElement.querySelector('.komica-media-hint-text');
        }

        const clone = mediaElement.cloneNode(true);
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.width = 'auto';
        clone.style.height = 'auto';
        clone.style.display = 'block';
        clone.style.transform = 'translate(0, 0) scale(1)';
        clone.style.transformOrigin = '0 0';
        clone.style.cursor = 'default';
        mediaContent.style.cursor = '';
        
        // 如果是影片，確保控制項可用
        if (clone.tagName === 'VIDEO') {
            clone.controls = true;
            clone.loop = true;
            clone.autoplay = true;
            clone.muted = true;
            updateMediaHint('video');
        } else {
            updateMediaHint('image');
        }

        mediaContent.appendChild(clone);
        currentMedia = clone;
        
        container.classList.add('active');
        overlay.classList.add('active');

        // 重置位置到畫面中央
        container.style.right = 'auto';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        
        // 先設置一個臨時的合理大小
        container.style.width = '500px';
        container.style.height = '400px';
        
        // 等待媒體載入後調整容器大小
        if (clone.tagName === 'IMG') {
            if (clone.complete && clone.naturalWidth > 0) {
                // 圖片已載入
                resizeContainerToMedia(clone);
                clone.style.cursor = 'default';
                mediaContent.style.cursor = '';
            } else {
                // 等待圖片載入
                clone.onload = () => {
                    resizeContainerToMedia(clone);
                    clone.style.cursor = 'default';
                    mediaContent.style.cursor = '';
                };
                clone.onerror = () => {
                    // 載入失敗時保持預設大小
                    container.style.width = '500px';
                    container.style.height = '400px';
                };
            }
        } else if (clone.tagName === 'VIDEO') {
            if (clone.readyState >= 2 && clone.videoWidth > 0) {
                // 影片元數據已載入
                resizeContainerToMedia(clone);
                clone.style.cursor = 'default';
                mediaContent.style.cursor = '';
            } else {
                // 等待影片元數據載入
                clone.addEventListener('loadedmetadata', () => {
                    resizeContainerToMedia(clone);
                    clone.style.cursor = 'default';
                    mediaContent.style.cursor = '';
                }, { once: true });
                clone.addEventListener('error', () => {
                    // 載入失敗時保持預設大小
                    container.style.width = '500px';
                    container.style.height = '400px';
                }, { once: true });
            }
        }
    }

    // 監聽點擊事件
    document.addEventListener('click', (e) => {
        // 檢查是否點擊了縮圖連結
        const fileThumb = e.target.closest('.file-thumb');
        if (fileThumb) {
            e.preventDefault();
            e.stopPropagation();
            
            const img = fileThumb.querySelector('img');
            if (img) {
                const fullSrc = fileThumb.href;
                const isVideo = fullSrc.match(/\.(webm|mp4|ogv)$/i);
                
                if (isVideo) {
                    const video = document.createElement('video');
                    video.src = fullSrc;
                    video.controls = true;
                    video.loop = true;
                    video.autoplay = true;
                    video.muted = true;
                    showMedia(video);
                } else {
                    const fullImg = document.createElement('img');
                    fullImg.src = fullSrc;
                    fullImg.alt = img.alt;
                    showMedia(fullImg);
                }
            }
        }
        
        // 檢查是否點擊了已展開的媒體（排除 YouTube 相關元素）
        const expandedElement = e.target.closest('.expanded-element');
        if (expandedElement) {
            // 檢查是否在 YouTube 容器中（避免與 YouTube 腳本衝突）
            const youtubeContainer = expandedElement.closest('.-expand-youtube');
            if (!youtubeContainer) {
                e.preventDefault();
                e.stopPropagation();
                
                if (expandedElement.tagName === 'IMG') {
                    showMedia(expandedElement);
                }
            }
        }
        
        // 檢查是否點擊了展開的影片（排除 YouTube 相關元素）
        const expandedVideo = e.target.closest('video[controls][loop]');
        if (expandedVideo && expandedVideo.closest('.-expanded')) {
            // 檢查是否在 YouTube 容器中（避免與 YouTube 腳本衝突）
            const youtubeContainer = expandedVideo.closest('.-expand-youtube');
            if (!youtubeContainer) {
                e.preventDefault();
                e.stopPropagation();
                showMedia(expandedVideo);
            }
        }
    }, true);

    // 使用 MutationObserver 來隱藏 Komica 的展開媒體，避免與其他腳本衝突
    function hideKomicaExpandedMedia() {
        // 查找所有 -expanded 容器，但排除 YouTube 相關的
        const expandedContainers = document.querySelectorAll('.-expanded');
        expandedContainers.forEach(container => {
            // 檢查是否包含 YouTube 相關元素
            const isYoutube = container.classList.contains('-expand-youtube') || 
                             container.closest('.-expand-youtube') ||
                             container.querySelector('.-expand-youtube');
            
            if (!isYoutube) {
                // 只隱藏包含 expanded-element 的容器
                const hasExpandedElement = container.querySelector('.expanded-element') ||
                                          container.querySelector('img.expanded-element') ||
                                          container.querySelector('video[controls][loop]');
                
                if (hasExpandedElement) {
                    container.classList.add('komica-hide-expanded');
                }
            }
        });
    }

    // 初始執行
    hideKomicaExpandedMedia();

    // 使用 MutationObserver 監聽 DOM 變化
    const observer = new MutationObserver(() => {
        hideKomicaExpandedMedia();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Komica Media Enhancer 已載入');
})();
