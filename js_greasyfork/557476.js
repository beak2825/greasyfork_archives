// ==UserScript==
// @name         あいもげ画像動画ビューアーちゃん
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  あいもげの画像、動画ビューアーです
// @match        https://nijiurachan.net/*
// @match        http://nijiurachan.net/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557476/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%94%BB%E5%83%8F%E5%8B%95%E7%94%BB%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557476/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%94%BB%E5%83%8F%E5%8B%95%E7%94%BB%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.match(/\.(jpg|jpeg|png|gif|webp|bmp|mp4|webm)$/i)) {
        return;
    }

    const EXT_IMG = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const EXT_VID = ['.mp4', '.webm'];
    const EXT_ALL = [...EXT_IMG, ...EXT_VID];

    const ICONS = {
        zoom: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
        save: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        close: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        arrowLeft: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        arrowRight: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
    };

    let images = [];
    let currentIndex = -1;
    let isOpen = false;
    let isZoomed = false;

    // ★ 親ウィンドウ取得 ★
    let targetDoc = document;
    try {
        if (window.top && window.top.document) {
            targetDoc = window.top.document;
        }
    } catch (e) {}

    // --- スタイル注入 ---
    if (!targetDoc.getElementById('aimg-style')) {
        const style = targetDoc.createElement('style');
        style.id = 'aimg-style';
        style.textContent = `
            #aimg-overlay {
                position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
                background: rgba(0, 0, 0, 0.95) !important;
                z-index: 2147483647 !important;
                opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
                display: block; margin: 0 !important; padding: 0 !important;
            }
            #aimg-overlay.active { opacity: 1; pointer-events: auto; }

            /* ラッパー */
            #aimg-wrapper {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: auto;
            }

            /* ズームモード時は中央揃えBlock表示 (スクロール用) */
            #aimg-wrapper.mode-zoom {
                display: block !important;
                text-align: center;
            }
            /* Upscale(画面合わせ)時はスクロール不要なのでFlex中央寄せ */
            #aimg-wrapper.mode-upscale {
                display: flex !important;
                width: 100vw !important;
                height: 100vh !important;
                overflow: hidden !important;
            }

            /* 通常時: 画面に収める(縮小) */
            .aimg-media {
                display: none;
                margin: auto;
                max-width: 95vw; max-height: 95vh;
                object-fit: contain;
                box-shadow: 0 0 30px rgba(0,0,0,0.8);
                user-select: none;
                transform-origin: center center;
            }
            img.aimg-media { cursor: zoom-in; transition: transform 0.1s; }
            video.aimg-media { cursor: default; }

            /* ズーム共通 */
            .aimg-media.zoomed {
                cursor: grab;
                position: relative !important;
            }
            .aimg-media.zoomed.grabbing { cursor: grabbing; }

            /* パターンA: 原寸大表示 (大きい画像用) */
            .aimg-media.zoomed.view-original {
                max-width: none !important;
                max-height: none !important;
                width: auto !important;
                height: auto !important;
                display: inline-block;
                margin: 0 auto;
                vertical-align: top;
            }

            /* パターンB: 横幅合わせ (画像が相対的に縦長でない場合) */
            .aimg-media.zoomed.view-fit-width {
                width: 100vw !important;
                height: auto !important;
                max-width: none !important;
                max-height: none !important;
                object-fit: contain; /* 念の為 */
            }

            /* パターンC: 縦幅合わせ (画像が相対的に縦長の場合) */
            .aimg-media.zoomed.view-fit-height {
                height: 100vh !important;
                width: auto !important;
                max-width: none !important;
                max-height: none !important;
                object-fit: contain;
            }

            .aimg-nav {
                position: fixed; top: 50%; transform: translateY(-50%);
                width: auto; height: auto; padding: 20px; border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: rgba(255, 255, 255, 0.2);
                z-index: 2147483648; opacity: 1; transition: all 0.2s;
            }
            .aimg-nav:hover { color: rgba(255,255,255,1); background: rgba(0,0,0,0.5); }
            .aimg-nav svg { width: 60px; height: 60px; filter: drop-shadow(0 0 5px #000); }
            #aimg-prev { left: 20px; }
            #aimg-next { right: 20px; }
            #aimg-overlay.is-zoomed .aimg-nav { display: none; }

            #aimg-toolbar {
                position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 2147483649;
            }
            .aimg-btn {
                width: 44px; height: 44px; border-radius: 50%;
                background: rgba(40,40,40,0.6); border: 1px solid rgba(255,255,255,0.3);
                color: white; display: flex; align-items: center; justify-content: center;
                cursor: pointer; backdrop-filter: blur(4px); transition: 0.2s;
            }
            .aimg-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
            .aimg-btn svg { width: 24px; height: 24px; pointer-events: none; }

            #aimg-counter {
                position: fixed; top: 20px; left: 20px;
                color: #ddd; font-weight: bold; font-family: sans-serif; font-size: 16px;
                background: rgba(0,0,0,0.6); padding: 8px 16px; border-radius: 20px;
                z-index: 2147483649; pointer-events: none;
                border: 1px solid rgba(255,255,255,0.2);
                backdrop-filter: blur(4px);
            }
            #aimg-zoom-rate {
                position: fixed; top: 65px; left: 20px;
                color: #ddd;
                font-weight: bold; font-family: sans-serif; font-size: 14px;
                background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 15px;
                z-index: 2147483649; pointer-events: none;
                border: 1px solid rgba(255,255,255,0.2);
                backdrop-filter: blur(4px);
            }
            #aimg-loading {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                color: white; font-size: 1.5rem; display: none; z-index: 2147483649;
                text-shadow: 0 2px 4px black;
            }
        `;
        (targetDoc.head || targetDoc.documentElement).appendChild(style);
    }

    // --- DOM要素作成 ---
    let overlay = targetDoc.getElementById('aimg-overlay');
    if (!overlay) {
        overlay = targetDoc.createElement('div');
        overlay.id = 'aimg-overlay';
        overlay.innerHTML = `
            <div id="aimg-loading">Loading...</div>
            <div class="aimg-nav" id="aimg-prev">${ICONS.arrowLeft}</div>
            <div class="aimg-nav" id="aimg-next">${ICONS.arrowRight}</div>

            <div id="aimg-counter">0 / 0</div>
            <div id="aimg-zoom-rate">100%</div>

            <div id="aimg-toolbar">
                <div id="aimg-btn-zoom" class="aimg-btn" title="ズーム">${ICONS.zoom}</div>
                <div id="aimg-btn-save" class="aimg-btn" title="保存">${ICONS.save}</div>
                <div id="aimg-btn-close" class="aimg-btn" title="閉じる">${ICONS.close}</div>
            </div>
            <div id="aimg-wrapper">
                <img id="aimg-main-img" class="aimg-media" src="">
                <video id="aimg-main-video" class="aimg-media" controls autoplay loop playsinline></video>
            </div>
        `;
        (targetDoc.body || targetDoc.documentElement).appendChild(overlay);
    }

    const wrapper = overlay.querySelector('#aimg-wrapper');
    const mainImg = overlay.querySelector('#aimg-main-img');
    const mainVideo = overlay.querySelector('#aimg-main-video');
    const loadingIndicator = overlay.querySelector('#aimg-loading');
    const counterEl = overlay.querySelector('#aimg-counter');
    const zoomRateEl = overlay.querySelector('#aimg-zoom-rate');
    const btnZoom = overlay.querySelector('#aimg-btn-zoom');
    const btnClose = overlay.querySelector('#aimg-btn-close');
    const btnSave = overlay.querySelector('#aimg-btn-save');
    const navPrev = overlay.querySelector('#aimg-prev');
    const navNext = overlay.querySelector('#aimg-next');

    // --- ヘルパー ---
    function isMediaUrl(url) {
        if (!url) return false;
        const lower = url.toLowerCase();
        return EXT_ALL.some(ext => lower.endsWith(ext));
    }

    function isFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement) return true;
        try {
            if (window.top.document.fullscreenElement || window.top.document.webkitFullscreenElement) return true;
        } catch(e) {}
        return false;
    }

    function refreshMediaList() {
        const anchors = Array.from(document.querySelectorAll('a'));
        const videos = Array.from(document.querySelectorAll('video'));
        const newImages = [];
        const seenSrc = new Set();

        anchors.forEach(a => {
            const href = a.href;
            if (isMediaUrl(href) && !seenSrc.has(href)) {
                seenSrc.add(href);
                newImages.push({ element: a, src: href, isVideo: EXT_VID.some(ext => href.toLowerCase().endsWith(ext)), filename: href.split('/').pop() });
            }
        });
        videos.forEach(v => {
            if (v.closest('#aimg-overlay')) return;
            if (v.closest('a') && isMediaUrl(v.closest('a').href)) return;
            let src = v.currentSrc || v.src;
            if (!src && v.querySelector('source')) src = v.querySelector('source').src;
            if (src && !seenSrc.has(src)) {
                seenSrc.add(src);
                newImages.push({ element: v, src: src, isVideo: true, filename: src.split('/').pop() });
            }
        });
        images = newImages.sort((a, b) => (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
    }

    window.addEventListener('click', (e) => {
        if (isFullscreen()) return;
        if (e.target.closest('#aimg-overlay')) return;
        let targetSrc = null, targetElement = null, isVideo = false;

        if (e.target.tagName === 'VIDEO') {
            targetElement = e.target;
            targetSrc = targetElement.currentSrc || targetElement.src;
            if (!targetSrc && targetElement.querySelector('source')) targetSrc = targetElement.querySelector('source').src;
            isVideo = true;
        } else {
            const anchor = e.target.closest('a');
            if (anchor && isMediaUrl(anchor.href)) {
                targetElement = anchor;
                targetSrc = anchor.href;
                isVideo = EXT_VID.some(ext => targetSrc.toLowerCase().endsWith(ext));
            }
        }

        if (targetSrc) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            if (isVideo && targetElement.tagName === 'VIDEO') targetElement.pause();
            refreshMediaList();
            let index = images.findIndex(img => img.src === targetSrc);
            if (index === -1) {
                images.push({ src: targetSrc, isVideo: isVideo, filename: targetSrc.split('/').pop(), element: targetElement });
                index = images.length - 1;
            }
            let startTime = 0;
            if (isVideo && targetElement.tagName === 'VIDEO') startTime = targetElement.currentTime || 0;
            openViewer(index, startTime);
        }
    }, true);

    function openViewer(index, startTime = 0) {
        if (index < 0 || index >= images.length) return;
        bindSharedUI();
        mainVideo.pause(); mainVideo.src = ""; mainImg.src = "";

        currentIndex = index;
        const item = images[currentIndex];
        isOpen = true; isZoomed = false;

        overlay.classList.add('active');
        if (targetDoc.body) targetDoc.body.style.overflow = 'hidden';
        loadingIndicator.style.display = 'block';

        if (item.isVideo) {
            mainImg.style.display = 'none'; mainVideo.style.display = 'block'; mainVideo.style.opacity = '0';
            mainVideo.src = item.src;
            if (startTime > 0) mainVideo.currentTime = startTime;
            mainVideo.onloadeddata = () => {
                loadingIndicator.style.display = 'none';
                mainVideo.style.opacity = '1';
                mainVideo.play().catch(()=>{});
                setTimeout(updateUI, 50);
            };
        } else {
            mainVideo.style.display = 'none'; mainImg.style.display = 'block'; mainImg.style.opacity = '0';
            mainImg.src = item.src;
            mainImg.onload = () => {
                loadingIndicator.style.display = 'none';
                mainImg.style.opacity = '1';
                setTimeout(updateUI, 50);
            };
        }
        updateUI();
    }

    function closeViewer() {
        isOpen = false;
        overlay.classList.remove('active');
        if (targetDoc.body) targetDoc.body.style.overflow = '';
        setTimeout(() => { mainVideo.pause(); mainVideo.src = ''; mainImg.src = ''; }, 200);
    }

    function updateUI() {
        const activeEl = images[currentIndex].isVideo ? mainVideo : mainImg;
        counterEl.textContent = `${currentIndex + 1} / ${images.length}`;

        // サイズ判定
        let isLarge = false;
        let naturalW = 0, naturalH = 0;

        if (activeEl) {
            naturalW = activeEl.videoWidth || activeEl.naturalWidth || 0;
            naturalH = activeEl.videoHeight || activeEl.naturalHeight || 0;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            isLarge = naturalW > screenW || naturalH > screenH;
        }

        if (isZoomed) {
            activeEl.classList.add('zoomed');

            if (isLarge) {
                // 原寸大
                activeEl.classList.add('view-original');
                activeEl.classList.remove('view-fit-width');
                activeEl.classList.remove('view-fit-height');
                wrapper.classList.add('mode-zoom');
                wrapper.classList.remove('mode-upscale');
            } else {
                // 画面合わせ (Upscale)
                // アスペクト比判定: (画像アスペクト比 > 画面アスペクト比) ? 横長 : 縦長
                const imgRatio = naturalW / naturalH;
                const screenRatio = window.innerWidth / window.innerHeight;

                if (imgRatio > screenRatio) {
                    // 横長なので横幅を100%にする
                    activeEl.classList.add('view-fit-width');
                    activeEl.classList.remove('view-fit-height');
                } else {
                    // 縦長なので縦幅を100%にする
                    activeEl.classList.add('view-fit-height');
                    activeEl.classList.remove('view-fit-width');
                }

                activeEl.classList.remove('view-original');
                wrapper.classList.add('mode-upscale');
                wrapper.classList.remove('mode-zoom');
            }
            overlay.classList.add('is-zoomed');
        } else {
            // リセット
            activeEl.classList.remove('zoomed');
            activeEl.classList.remove('view-original');
            activeEl.classList.remove('view-fit-width');
            activeEl.classList.remove('view-fit-height');
            activeEl.classList.remove('grabbing');
            overlay.classList.remove('is-zoomed');
            wrapper.classList.remove('mode-zoom');
            wrapper.classList.remove('mode-upscale');
            activeEl.style.transform = '';
            wrapper.scrollTop = 0;
            wrapper.scrollLeft = 0;
        }

        // 倍率計算
        requestAnimationFrame(() => {
            if (!activeEl) return;

            if (activeEl.classList.contains('view-original')) {
                zoomRateEl.textContent = "100%";
            } else if (naturalW > 0) {
                const rect = activeEl.getBoundingClientRect();
                // 実際に表示されているサイズで計算
                const ratio = Math.round((rect.width / naturalW) * 100);
                zoomRateEl.textContent = `${ratio}%`;
            } else {
                zoomRateEl.textContent = '...';
            }
        });
    }

    function bindSharedUI() {
        btnZoom.onclick = (e) => { e.stopPropagation(); toggleZoom(); };
        btnClose.onclick = (e) => { e.stopPropagation(); closeViewer(); };
        navPrev.onclick = (e) => { e.stopPropagation(); prevMedia(); };
        navNext.onclick = (e) => { e.stopPropagation(); nextMedia(); };
        btnSave.onclick = (e) => {
            e.stopPropagation();
            if (images[currentIndex]) downloadFile(images[currentIndex].src, images[currentIndex].filename);
        };

        wrapper.onclick = (e) => {
            if (isDragging || hasDragged) return;
            if (e.target === wrapper) closeViewer();
        };
        mainImg.onclick = (e) => {
            e.stopPropagation();
            if (hasDragged) return;
            toggleZoom();
        };

        wrapper.onmousedown = onDragStart;
        targetDoc.onmouseup = onDragEnd;
        targetDoc.onmousemove = onDragMove;
    }

    function toggleZoom(e) {
        if (e) e.stopPropagation();
        isZoomed = !isZoomed;
        updateUI();
    }

    function nextMedia() { if (images.length) openViewer((currentIndex + 1) % images.length); }
    function prevMedia() { if (images.length) openViewer((currentIndex - 1 + images.length) % images.length); }

    function downloadFile(url, filename) {
        if (typeof GM_download === 'function') {
            GM_download({ url: url, name: filename, saveAs: false });
        } else {
            fetch(url).then(res => res.blob()).then(blob => {
                const u = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = u; a.download = filename; a.target = '_blank';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(u);
            }).catch(() => window.open(url, '_blank'));
        }
    }

    let isDragging = false, hasDragged = false, startX, startY, scrollLeft, scrollTop;

    function onDragStart(e) {
        if (!isZoomed || e.button !== 0) return;
        if (e.target.closest('.aimg-nav') || e.target.closest('#aimg-toolbar')) return;
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;
        const el = images[currentIndex].isVideo ? mainVideo : mainImg;
        el.classList.add('grabbing');
        e.preventDefault();
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        if (Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5) hasDragged = true;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        wrapper.scrollLeft = scrollLeft - walkX;
        wrapper.scrollTop = scrollTop - walkY;
    }

    function onDragEnd() {
        isDragging = false;
        const el = images[currentIndex]?.isVideo ? mainVideo : mainImg;
        if (el) el.classList.remove('grabbing');
        setTimeout(() => { hasDragged = false; }, 50);
    }

    window.addEventListener('keydown', (e) => {
        if (!isOpen) return;
        switch(e.key) {
            case 'ArrowRight': if (!isZoomed) nextMedia(); break;
            case 'ArrowLeft': if (!isZoomed) prevMedia(); break;
            case 'Escape': closeViewer(); break;
            case ' ': e.preventDefault(); toggleZoom(); break;
            case 's': if (images[currentIndex]) downloadFile(images[currentIndex].src, images[currentIndex].filename); break;
        }
    });
})();