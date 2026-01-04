// ==UserScript==
// @name         PostImg Gallery Viewer
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @license      MIT
// @description  Добавляет удобный просмотр изображений с перелистыванием, предзагрузкой и скачиванием всей галереи для PostImg
// @author       NastyaLove
// @match        https://postimg.cc/gallery/*
// @match        https://postimg.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=postimg.cc
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/551572/PostImg%20Gallery%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/551572/PostImg%20Gallery%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isGalleryPage = window.location.pathname.includes('/gallery/');
    const isSingleImagePage = !isGalleryPage && /^\/[a-zA-Z0-9]+$/.test(window.location.pathname);

    if (isSingleImagePage) {
        initSingleImageViewer();
        return;
    }

    if (isGalleryPage) {
        initGalleryViewer();
        return;
    }

    function initSingleImageViewer() {
        console.log('🖼️ PostImg Single Image Viewer активирован');

        const downloadLink = document.querySelector('#download');
        if (!downloadLink) {
            console.warn('⚠️ Не найдена ссылка на оригинал');
            return;
        }

        const originalUrl = downloadLink.href;
        console.log('✅ Найден оригинал:', originalUrl);

        const originalCodeMatch = originalUrl.match(/postimg\.cc\/([\-a-zA-Z0-9]+)\//);
        if (!originalCodeMatch) {
            console.warn('⚠️ Не удалось извлечь код оригинала');
            return;
        }

        const originalCode = originalCodeMatch[1];
        console.log('🔑 Код оригинала:', originalCode);

        const mainImage = document.querySelector('.img-fluid');
        if (!mainImage) {
            console.warn('⚠️ Не найдено главное изображение');
            return;
        }

        const currentSrc = mainImage.src;
        const newSrc = currentSrc.replace(/postimg\.cc\/([\-a-zA-Z0-9]+)\//, `postimg.cc/${originalCode}/`);

        console.log('🔄 Замена URL:');
        console.log('  Было:', currentSrc);
        console.log('  Стало:', newSrc);

        mainImage.src = newSrc;

        const style = document.createElement('style');
        style.textContent = `
            .original-badge {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(39, 174, 96, 0.4);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        const badge = document.createElement('div');
        badge.className = 'original-badge';
        badge.textContent = '✨ Оригинальное качество';
        document.body.appendChild(badge);

        console.log('✅ Изображение заменено на оригинал!');
    }

    function initGalleryViewer() {
        console.log('📸 PostImg Gallery Viewer активирован');

        const loadingStyles = document.createElement('style');
        loadingStyles.textContent = `
            #gallery-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .loading-content {
                text-align: center;
                color: white;
                animation: slideUp 0.5s ease-out;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .loading-spinner {
                width: 80px;
                height: 80px;
                border: 8px solid rgba(255, 255, 255, 0.2);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 30px;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                letter-spacing: 1px;
            }

            .loading-counter {
                font-size: 20px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            #loading-count {
                font-size: 32px;
                font-weight: bold;
                color: #fff;
                display: inline-block;
                min-width: 50px;
                animation: pulse 1s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .loading-status {
                margin-top: 20px;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                font-style: italic;
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(loadingStyles);

        function smoothScroll(targetY, duration = 1000) {
            return new Promise(resolve => {
                const startY = window.pageYOffset;
                const distance = targetY - startY;
                const startTime = performance.now();

                function scroll() {
                    const currentTime = performance.now();
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const easeProgress = progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                    window.scrollTo(0, startY + distance * easeProgress);

                    if (progress < 1) {
                        requestAnimationFrame(scroll);
                    } else {
                        window.dispatchEvent(new Event('scroll'));
                        resolve();
                    }
                }

                requestAnimationFrame(scroll);
            });
        }

        function getImageCount() {
            return document.querySelectorAll('#thumb-list > .col').length;
        }

        function waitForStability(maxWait = 1000, checkInterval = 100) {
            return new Promise(resolve => {
                let lastCount = getImageCount();
                let stableTime = 0;
                const startTime = Date.now();

                const checkInterval_id = setInterval(() => {
                    const currentCount = getImageCount();
                    const elapsed = Date.now() - startTime;

                    if (currentCount === lastCount) {
                        stableTime += checkInterval;
                        if (stableTime >= maxWait) {
                            clearInterval(checkInterval_id);
                            resolve(currentCount);
                        }
                    } else {
                        stableTime = 0;
                        lastCount = currentCount;
                    }

                    if (elapsed > maxWait * 10) {
                        clearInterval(checkInterval_id);
                        resolve(currentCount);
                    }
                }, checkInterval);
            });
        }

        async function loadAllImages() {
            console.log('🚀 Начинаем загрузку изображений...');

            console.log('⬆️ Прокручиваем в начало страницы...');
            await smoothScroll(0, 500);
            await new Promise(resolve => setTimeout(resolve, 300));

            console.log('⬇️ Прокручиваем вниз...');
            const maxHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            await smoothScroll(maxHeight, 2000);

            console.log('⏳ Ждём загрузки изображений...');
            const countAfterFirstScroll = await waitForStability(1000, 100);
            console.log(`📊 После первой прокрутки: ${countAfterFirstScroll} изображений`);

            if (countAfterFirstScroll > 48) {
                console.log('🔄 Делаем контрольную прокрутку...');

                await smoothScroll(0, 1000);
                await new Promise(resolve => setTimeout(resolve, 300));

                const maxHeight2 = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                );
                await smoothScroll(maxHeight2, 2000);

                const finalCount = await waitForStability(1000, 100);
                console.log(`✅ После контрольной прокрутки: ${finalCount} изображений`);

                await smoothScroll(0, 800);
                return finalCount;
            } else {
                await smoothScroll(0, 800);
                return countAfterFirstScroll;
            }
        }

        function showLoadingOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'gallery-loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">✨ Загрузка галереи ✨</div>
                    <div class="loading-counter">
                        Найдено: <span id="loading-count">0</span> изображений
                    </div>
                    <div class="loading-status">Прокручиваем и загружаем...</div>
                </div>
            `;
            document.body.appendChild(overlay);
            return overlay;
        }

        function updateLoadingCounter() {
            const countEl = document.getElementById('loading-count');
            if (countEl) {
                const count = getImageCount();
                countEl.textContent = count;
            }
        }

        async function initialize() {
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const overlay = showLoadingOverlay();
            const counterInterval = setInterval(updateLoadingCounter, 100);

            try {
                const totalImages = await loadAllImages();
                console.log(`🎉 Загрузка завершена! Найдено ${totalImages} изображений`);
            } catch (error) {
                console.error('❌ Ошибка при загрузке изображений:', error);
            }

            clearInterval(counterInterval);
            updateLoadingCounter();

            await new Promise(resolve => setTimeout(resolve, 500));

            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                initializeGallery();
            }, 300);
        }

        function initializeGallery() {
            const images = [];

            document.querySelectorAll('#thumb-list > .col').forEach((el, index) => {
                const hotlink = el.dataset.hotlink;
                const imageKey = el.dataset.image;
                const name = el.dataset.name;
                const ext = el.dataset.ext;
                if (!hotlink || !imageKey || !name || !ext) return;

                const imgEl = el.querySelector('img');
                if (!imgEl) return;

                const fullUrl = `https://i.postimg.cc/${hotlink}/${name}.${ext}`;
                images.push({
                    thumbnail: imgEl.src,
                    full: fullUrl,
                    name: `${name}.${ext}`,
                    key: imageKey,
                    hotlink: hotlink,
                    loaded: false,
                    preloadedImage: null
                });
            });

            if (images.length === 0) {
                console.warn('⚠️ Не найдено изображений в галерее');
                return;
            }

            console.log(`✅ Инициализация галереи с ${images.length} изображениями`);

            let currentIndex = 0;
            const PRELOAD_COUNT = 20;
            const style = document.createElement('style');

            style.textContent = `
                .gallery-viewer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: none;
                    flex-direction: column;
                }

                .gallery-viewer.active {
                    display: flex;
                }

                .gallery-header {
                    padding: 15px 20px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .gallery-info {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .gallery-counter {
                    font-size: 16px;
                    font-weight: bold;
                }

                .gallery-title {
                    font-size: 14px;
                    color: #ccc;
                    max-width: 600px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .gallery-preload-status {
                    font-size: 12px;
                    color: #95a5a6;
                }

                .gallery-close {
                    background: #e74c3c;
                    border: none;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: background 0.2s;
                }

                .gallery-close:hover {
                    background: #c0392b;
                }

                .gallery-main {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                .gallery-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    user-select: none;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .gallery-image.loaded {
                    opacity: 1;
                }

                .gallery-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    padding: 20px 15px;
                    cursor: pointer;
                    font-size: 24px;
                    border-radius: 4px;
                    transition: background 0.2s;
                    z-index: 10;
                }

                .gallery-nav:hover {
                    background: rgba(0, 0, 0, 0.9);
                }

                .gallery-nav:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .gallery-nav-prev {
                    left: 20px;
                }

                .gallery-nav-next {
                    right: 20px;
                }

                .gallery-thumbnails {
                    background: rgba(0, 0, 0, 0.8);
                    padding: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    overflow-x: auto;
                    overflow-y: hidden;
                    white-space: nowrap;
                    max-height: 150px;
                }

                .gallery-thumbnails::-webkit-scrollbar {
                    height: 8px;
                }

                .gallery-thumbnails::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }

                .gallery-thumbnails::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }

                .gallery-thumb {
                    display: inline-block;
                    width: 100px;
                    height: 100px;
                    margin-right: 10px;
                    cursor: pointer;
                    border: 3px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                    transition: border-color 0.2s;
                    position: relative;
                }

                .gallery-thumb:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .gallery-thumb.active {
                    border-color: #3498db;
                }

                .gallery-thumb.preloaded::after {
                    content: '✓';
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: #27ae60;
                    color: white;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                }

                .gallery-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .gallery-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .gallery-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .open-gallery-btn {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s;
                    z-index: 1000;
                }

                .open-gallery-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }

                .download-all-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
                    transition: all 0.3s;
                    z-index: 1000;
                }

                .download-all-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.6);
                }

                .download-all-btn.downloading {
                    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                    pointer-events: none;
                }

                .download-progress {
                    position: fixed;
                    bottom: 140px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    z-index: 1000;
                    display: none;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                }

                .download-progress.active {
                    display: block;
                }

                .download-progress-bar {
                    width: 200px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                    overflow: hidden;
                    margin-top: 10px;
                }

                .download-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
                    transition: width 0.3s;
                }
            `;
            document.head.appendChild(style);

            const viewer = document.createElement('div');
            viewer.className = 'gallery-viewer';
            viewer.innerHTML = `
                <div class="gallery-header">
                    <div class="gallery-info">
                        <div class="gallery-counter">
                            <span class="current">1</span> / <span class="total">${images.length}</span>
                        </div>
                        <div class="gallery-title"></div>
                        <div class="gallery-preload-status"></div>
                    </div>
                    <button class="gallery-close">✕ Закрыть</button>
                </div>
                <div class="gallery-main">
                    <button class="gallery-nav gallery-nav-prev">‹</button>
                    <img class="gallery-image" src="" alt="">
                    <div class="gallery-loading">
                        <div class="gallery-spinner"></div>
                        <div>Загрузка...</div>
                    </div>
                    <button class="gallery-nav gallery-nav-next">›</button>
                </div>
                <div class="gallery-thumbnails"></div>
            `;
            document.body.appendChild(viewer);

            const openBtn = document.createElement('button');
            openBtn.className = 'open-gallery-btn';
            openBtn.textContent = `📷 Просмотр (${images.length})`;
            document.body.appendChild(openBtn);

            const downloadAllBtn = document.createElement('button');
            downloadAllBtn.className = 'download-all-btn';
            downloadAllBtn.innerHTML = `💾 Скачать всё (${images.length})`;
            document.body.appendChild(downloadAllBtn);

            const downloadProgress = document.createElement('div');
            downloadProgress.className = 'download-progress';
            downloadProgress.innerHTML = `
                <div class="download-progress-text" id="download-status">Подготовка...</div>
                <div>Загружено: <span id="download-current">0</span>/<span id="download-total">${images.length}</span></div>
                <div class="download-progress-bar">
                    <div class="download-progress-fill" id="download-fill"></div>
                </div>
            `;
            document.body.appendChild(downloadProgress);

            const mainImage = viewer.querySelector('.gallery-image');
            const loading = viewer.querySelector('.gallery-loading');
            const counterCurrent = viewer.querySelector('.current');
            const titleEl = viewer.querySelector('.gallery-title');
            const preloadStatus = viewer.querySelector('.gallery-preload-status');
            const prevBtn = viewer.querySelector('.gallery-nav-prev');
            const nextBtn = viewer.querySelector('.gallery-nav-next');
            const closeBtn = viewer.querySelector('.gallery-close');
            const thumbnailsContainer = viewer.querySelector('.gallery-thumbnails');

            const thumbElements = [];
            images.forEach((img, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'gallery-thumb';
                thumb.innerHTML = `<img src="${img.thumbnail}" alt="${img.name}">`;
                thumb.addEventListener('click', () => showImage(index));
                thumbnailsContainer.appendChild(thumb);
                thumbElements.push(thumb);
            });

            downloadAllBtn.addEventListener('click', async () => {
                if (downloadAllBtn.classList.contains('downloading')) return;

                downloadAllBtn.classList.add('downloading');
                downloadAllBtn.innerHTML = '⏳ Создание ZIP...';
                downloadProgress.classList.add('active');

                const downloadStatus = document.getElementById('download-status');
                const downloadCurrent = document.getElementById('download-current');
                const downloadFill = document.getElementById('download-fill');

                try {
                    const zip = new JSZip();
					
                    downloadStatus.textContent = 'Загрузка изображений...';
                    for (let i = 0; i < images.length; i++) {
                        const img = images[i];
                        
                        downloadCurrent.textContent = i + 1;
                        downloadFill.style.width = `${((i + 1) / images.length) * 100}%`;

                        try {
                            const response = await fetch(img.full);
                            const blob = await response.blob();
                            
                            zip.file(img.name, blob);
                            console.log(`✅ Добавлено: ${img.name}`);
                        } catch (error) {
                            console.error(`❌ Ошибка загрузки ${img.name}:`, error);
                        }
                    }

                    downloadStatus.textContent = 'Создание архива...';
                    const zipBlob = await zip.generateAsync({
                        type: 'blob',
                        compression: 'DEFLATE',
                        compressionOptions: { level: 6 }
                    }, (metadata) => {
                        const percent = metadata.percent.toFixed(0);
                        downloadStatus.textContent = `Создание архива: ${percent}%`;
                    });

                    downloadStatus.textContent = 'Скачивание...';
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(zipBlob);
                    link.download = `PostImgGallery-${Math.floor(Math.random() * 100)}.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);

                    downloadAllBtn.classList.remove('downloading');
                    downloadAllBtn.innerHTML = `✅ Готово!`;
                    downloadStatus.textContent = '✅ Архив скачан!';
                    
                    setTimeout(() => {
                        downloadAllBtn.innerHTML = `📦 Скачать ZIP (${images.length})`;
                        downloadProgress.classList.remove('active');
                    }, 3000);

                } catch (error) {
                    console.error('❌ Ошибка создания ZIP:', error);
                    downloadAllBtn.classList.remove('downloading');
                    downloadAllBtn.innerHTML = `❌ Ошибка`;
                    downloadStatus.textContent = '❌ Ошибка создания архива';
                    
                    setTimeout(() => {
                        downloadAllBtn.innerHTML = `📦 Скачать ZIP (${images.length})`;
                        downloadProgress.classList.remove('active');
                    }, 3000);
                }
            });

            function preloadImage(index) {
                if (index < 0 || index >= images.length) return Promise.resolve();
                if (images[index].loaded) return Promise.resolve();

                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        images[index].loaded = true;
                        images[index].preloadedImage = img;
                        thumbElements[index].classList.add('preloaded');
                        updatePreloadStatus();
                        resolve();
                    };
                    img.onerror = (e) => {
                        console.warn(`Ошибка предзагрузки изображения ${index}`);
                        reject();
                    };
                    img.src = images[index].full;
                });
            }

            function preloadSurroundingImages(centerIndex) {
                const promises = [];

                if (!images[centerIndex].loaded) {
                    promises.push(preloadImage(centerIndex));
                }

                for (let i = 1; i <= PRELOAD_COUNT; i++) {
                    const nextIndex = centerIndex + i;
                    if (nextIndex < images.length && !images[nextIndex].loaded) {
                        promises.push(preloadImage(nextIndex));
                    }
                }

                for (let i = 1; i <= PRELOAD_COUNT; i++) {
                    const prevIndex = centerIndex - i;
                    if (prevIndex >= 0 && !images[prevIndex].loaded) {
                        promises.push(preloadImage(prevIndex));
                    }
                }

                return Promise.all(promises);
            }

            function updatePreloadStatus() {
                const loadedCount = images.filter(img => img.loaded).length;
                preloadStatus.textContent = `Предзагружено: ${loadedCount}/${images.length}`;
            }

            function showImage(index) {
                if (index < 0 || index >= images.length) return;

                currentIndex = index;
                const img = images[index];

                counterCurrent.textContent = index + 1;
                titleEl.textContent = img.name;

                loading.style.display = 'flex';
                mainImage.classList.remove('loaded');

                if (img.loaded && img.preloadedImage) {
                    mainImage.src = img.preloadedImage.src;
                    mainImage.classList.add('loaded');
                    loading.style.display = 'none';
                } else {
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        mainImage.src = img.full;
                        mainImage.classList.add('loaded');
                        loading.style.display = 'none';
                        img.loaded = true;
                        img.preloadedImage = tempImg;
                        thumbElements[index].classList.add('preloaded');
                        updatePreloadStatus();
                    };
                    tempImg.onerror = (e) => {
                        loading.innerHTML = '<div>Ошибка загрузки</div>';
                        console.error(e);
                    };
                    tempImg.src = img.full;
                }

                thumbElements.forEach((thumb, i) => {
                    thumb.classList.toggle('active', i === index);
                });

                const activeThumb = thumbnailsContainer.children[index];
                if (activeThumb) {
                    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }

                prevBtn.disabled = index === 0;
                nextBtn.disabled = index === images.length - 1;

                preloadSurroundingImages(index);
            }

            prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

            document.addEventListener('keydown', (e) => {
                if (!viewer.classList.contains('active')) return;

                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
                if (e.key === 'Escape') closeViewer();
            });

            function openViewer() {
                viewer.classList.add('active');
                showImage(0);
                document.body.style.overflow = 'hidden';
            }

            function closeViewer() {
                viewer.classList.remove('active');
                document.body.style.overflow = '';
            }

            openBtn.addEventListener('click', openViewer);
            closeBtn.addEventListener('click', closeViewer);

            viewer.addEventListener('click', (e) => {
                if (e.target === viewer) closeViewer();
            });

            updatePreloadStatus();
            preloadSurroundingImages(0).then(() => {
                console.log(`✅ Галерея готова! ${images.length} изображений`);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
})();