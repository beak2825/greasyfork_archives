// ==UserScript==
// @name         EX漫画式阅读器
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  右下角按钮开启关闭，小键盘方向键或空格键翻页。
// @author       Gemini
// @match        https://exhentai.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557448/EX%E6%BC%AB%E7%94%BB%E5%BC%8F%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557448/EX%E6%BC%AB%E7%94%BB%E5%BC%8F%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isReadingMode = false;
    let uiHideTimeout = null;
    let toggleBtn = null;
    let galleryBtn = null;

    // 核心修复变量：用于竞态条件打断机制
    let currentFetchId = 0;

    // UI Elements
    let $readerContainer = null;
    let $imgElement = null;
    let $loaderElement = null;
    let $prevZone = null;
    let $nextZone = null;

    // Cache & State
    const imagePreloadCache = {};
    const linkCache = {};
    const PRELOAD_DEPTH = 10;

    let currentPageUrl = window.location.href;
    let currentPageIndex = 0;
    let totalPages = -1;

    // Icons
    const ICON_BOOK_OPEN = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;"><path d="M12 3v17.5c-1.8-1.2-4.3-1.5-6-1.5s-4.2.3-6 1.5V3c1.8-1.2 4.2-1.5 6-1.5s4.2.3 6 1.5zm2 .5C15.8 2.3 18.2 2 20 2s4.2.3 6 1.5v17.5c-1.8-1.2-4.2-1.5-6-1.5s-4.2.3-6 1.5V3.5z"/></svg>`;
    const ICON_BOOK_CLOSED = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM13 4v8l-2.5-1.5L8 12V4h5z"/></svg>`;
    const ICON_GALLERY = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;"><path d="M4 10h12V8H4v2zm0 4h12v-2H4v2zm0 4h12v-2H4v2zm14-8v-2h2v2h-2zm0 4v-2h2v2h-2zm0 4v-2h2v2h-2z"/></svg>`;

    // --- CSS Styles (恢复 V6.4 的按钮透明度，修复消失问题) ---
    GM_addStyle(`
        #gm-reader-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: #000000; z-index: 9998; display: none;
            justify-content: center; align-items: center; user-select: none;
            flex-direction: column;
        }

        #gm-reader-img {
            max-width: 100%; max-height: 100vh; width: auto; height: auto;
            object-fit: contain;
            transition: opacity 0.2s ease;
        }

        #prevZone, #nextZone {
            position: absolute; top: 0; height: 100%; z-index: 9999; cursor: pointer;
        }
        #prevZone { left: 0; width: 30%; }
        #nextZone { right: 0; width: 70%; }

        .gm-loader {
            border: 5px solid rgba(255, 255, 255, 0.2); border-top: 5px solid #ffffff;
            border-radius: 50%; width: 50px; height: 50px;
            animation: gm-spin 1s linear infinite; position: absolute;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; display: none;
        }
        @keyframes gm-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* 默认状态：非阅读模式，透明度 0.5 (V6.4 默认值) */
        #gm-toggle-btn {
            position: fixed; bottom: 80px; right: 20px; width: 50px; height: 50px;
            background-color: #007bff;
            border-radius: 50%;
            z-index: 2147483647 !important;
            cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
            justify-content: center; align-items: center;
            transition: all 0.3s;
            opacity: 0.5;
            user-select: none;
        }

        #gm-gallery-btn {
            position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
            background-color: #6c757d;
            border-radius: 50%;
            z-index: 2147483647 !important;
            cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
            justify-content: center; align-items: center;
            transition: all 0.3s;
            opacity: 0.5;
            user-select: none;
        }

        /* 阅读模式下的颜色切换 (红色) */
        #gm-toggle-btn.gm-mode-reading {
            background-color: #dc3545;
        }

        /* 阅读模式下的默认隐藏/缩小状态 */
        .gm-mode-reading {
            opacity: 0 !important;
            pointer-events: none;
            transform: scale(0.8);
        }

        /* 阅读模式下鼠标移动时的显示状态 */
        .gm-mode-reading.gm-ui-show {
            opacity: 0.8 !important;
            transform: scale(1);
            pointer-events: auto;
        }

        /* 鼠标悬停时，任何模式下都完全显示并放大 */
        #gm-toggle-btn:hover,
        #gm-gallery-btn:hover,
        .gm-mode-reading.gm-ui-show:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
        }

        body.gm-reading-mode-active { overflow: hidden !important; }
    `);

    // --- Utility Functions ---

    function activateUI(delay = 3000) {
        if (!isReadingMode) return;
        if (uiHideTimeout) clearTimeout(uiHideTimeout);

        if (toggleBtn) toggleBtn.classList.add('gm-ui-show');
        if (galleryBtn) galleryBtn.classList.add('gm-ui-show');

        uiHideTimeout = setTimeout(() => {
            if (toggleBtn) toggleBtn.classList.remove('gm-ui-show');
            if (galleryBtn) galleryBtn.classList.remove('gm-ui-show');
        }, delay);
    }

    function getGalleryIndexUrl() {
        const nativeNextLink = document.getElementById('next');
        if (nativeNextLink && nativeNextLink.href && nativeNextLink.href.includes('/g/')) {
            return nativeNextLink.href;
        }

        const parentGalleryLink = document.querySelector('a[href*="/g/"]:not([href*="/s/"])');
        if (parentGalleryLink) {
            return parentGalleryLink.href;
        }

        return null;
    }

    function requestFullScreen(element) {
        const requestMethod = element.requestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (requestMethod) {
            requestMethod.call(element).catch(err => console.log("Fullscreen request denied:", err));
        }
    }

    function exitFullScreen() {
        const exitMethod = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exitMethod && (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen)) {
            exitMethod.call(document);
        }
    }

    // --- Core Logic ---

    // 1. 初始化和创建 UI
    function initUI() {
        if (document.getElementById('gm-reader-overlay')) return;

        $readerContainer = document.createElement('div');
        $readerContainer.id = 'gm-reader-overlay';
        $imgElement = document.createElement('img');
        $imgElement.id = 'gm-reader-img';
        $loaderElement = document.createElement('div');
        $loaderElement.className = 'gm-loader';

        $prevZone = document.createElement('div');
        $prevZone.id = 'prevZone';
        $nextZone = document.createElement('div');
        $nextZone.id = 'nextZone';

        $readerContainer.appendChild($imgElement);
        $readerContainer.appendChild($loaderElement);
        $readerContainer.appendChild($prevZone);
        $readerContainer.appendChild($nextZone);
        document.body.appendChild($readerContainer);

        galleryBtn = document.createElement('div');
        galleryBtn.id = 'gm-gallery-btn';
        galleryBtn.title = "返回画廊索引页";
        galleryBtn.innerHTML = ICON_GALLERY;
        document.body.appendChild(galleryBtn);

        toggleBtn = document.createElement('div');
        toggleBtn.id = 'gm-toggle-btn';
        toggleBtn.title = "点击开启/关闭阅读模式";
        toggleBtn.innerHTML = ICON_BOOK_OPEN;
        document.body.appendChild(toggleBtn);

        bindReaderEvents();

        parseInitialPageData();
    }

    // 2. 初始页面数据解析
    function parseInitialPageData(attempts = 0) {
        const $nativeImg = document.getElementById('img');

        if (!$nativeImg || !$nativeImg.src || $nativeImg.src.startsWith('data:')) {
            if (attempts < 10) {
                setTimeout(() => parseInitialPageData(attempts + 1), 100);
                return;
            } else {
                 console.error("Failed to find image element or src after 10 attempts. Script initialization aborted.");
                 interceptNativeLinks(false);
                 return;
            }
        }

        const $nativePrev = document.getElementById('prev');
        const $nativeNext = document.getElementById('next');

        const galleryInfo = document.querySelector('div.sn');
        if (galleryInfo) {
            const match = galleryInfo.textContent.match(/Page\s+(\d+)\s+of\s+(\d+)/);
            if (match) {
                currentPageIndex = parseInt(match[1]) - 1;
                totalPages = parseInt(match[2]);
            }
        }

        linkCache[currentPageUrl] = {
            imgUrl: $nativeImg.src,
            prevUrl: $nativePrev ? $nativePrev.href : null,
            nextUrl: $nativeNext ? $nativeNext.href : null
        };

        preloadRolling();
    }

    // 3. 事件绑定
    function bindReaderEvents() {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleReader();
        });

        galleryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const galleryUrl = getGalleryIndexUrl();
            if (galleryUrl) {
                exitReader();
                window.location.href = galleryUrl;
            } else {
                alert('未找到画廊索引链接。');
            }
        });

        $prevZone.addEventListener('click', (e) => {
            if (isReadingMode) {
                e.stopPropagation();
                navigatePage('prev');
            }
        });
        $nextZone.addEventListener('click', (e) => {
            if (isReadingMode) {
                e.stopPropagation();
                navigatePage('next');
            }
        });

        $readerContainer.addEventListener('mousemove', () => {
            activateUI();
        });

        $readerContainer.addEventListener('wheel', handleMouseWheel, true);

        window.addEventListener('keydown', handleKeydown, true);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);

        interceptNativeLinks();
    }

    function handleMouseWheel(e) {
        if (!isReadingMode) return;

        e.preventDefault();
        e.stopPropagation();

        if (e.deltaY > 0) {
            navigatePage('next');
        } else if (e.deltaY < 0) {
            navigatePage('prev');
        }
    }

    function handleKeydown(e) {
        if (!isReadingMode) return;
        const key = e.key;
        const keysToBlock = ['ArrowLeft', 'ArrowRight', ' ', 'Space', 'Escape', 'Left', 'Right'];
        if (keysToBlock.includes(key) || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32 || e.keyCode === 27) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        switch (key) {
            case 'Escape': exitReader(); break;
            case 'ArrowRight': case ' ': case 'Space': case 'Right': navigatePage('next'); break;
            case 'ArrowLeft': case 'Left': navigatePage('prev'); break;
        }
    }

    function handleFullscreenChange() {
        if (isReadingMode && !(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen)) {
            exitReader();
        }
    }

    function toggleReader() {
        if (isReadingMode) {
            exitReader();
        } else {
            enterReader();
        }
    }

    function enterReader() {
        const imageUrl = linkCache[currentPageUrl]?.imgUrl;
        if (!imageUrl) {
            alert('无法获取当前页面图片 URL，请刷新页面或检查 ExHentai 页面是否已完全加载。');
            return;
        }

        isReadingMode = true;
        $imgElement.src = imageUrl;
        $readerContainer.style.display = 'flex';
        document.body.classList.add('gm-reading-mode-active');

        if (toggleBtn) {
            toggleBtn.classList.add('gm-mode-reading');
            toggleBtn.innerHTML = ICON_BOOK_CLOSED;
        }
        if (galleryBtn) galleryBtn.classList.add('gm-mode-reading');

        activateUI(100);
        requestFullScreen(document.documentElement);
    }

    function exitReader() {
        isReadingMode = false;
        $readerContainer.style.display = 'none';
        document.body.classList.remove('gm-reading-mode-active');

        // 核心修复：确保移除所有控制隐藏的 class
        if (toggleBtn) {
            toggleBtn.classList.remove('gm-mode-reading', 'gm-ui-show');
            toggleBtn.innerHTML = ICON_BOOK_OPEN;
        }
        if (galleryBtn) galleryBtn.classList.remove('gm-mode-reading', 'gm-ui-show');

        exitFullScreen();
    }

    // 4. 翻页核心逻辑
    function navigatePage(direction) {
        const linkKey = direction === 'prev' ? 'prevUrl' : 'nextUrl';
        const newUrl = linkCache[currentPageUrl]?.[linkKey];

        // 最后一页跳转画廊索引
        if (direction === 'next' && newUrl && newUrl.includes('/g/')) {
            console.log("Reached the end of the gallery. Exiting reader mode and navigating to gallery index.");
            exitReader();
            window.location.href = newUrl;
            return;
        }

        if (!newUrl || newUrl.includes('#')) {
            console.log(`已经是${direction === 'prev' ? '第一页' : '最后一页'}了。`);
            activateUI();
            return;
        }

        const newIndex = currentPageIndex + (direction === 'next' ? 1 : -1);
        if (newIndex >= 0 && (totalPages === -1 || newIndex < totalPages)) {
            currentPageIndex = newIndex;
        }

        $loaderElement.style.display = 'block';
        $imgElement.style.opacity = '0.1';

        // 核心修复 1: 生成请求 ID (打断机制)
        const newFetchId = ++currentFetchId;

        const cachedData = linkCache[newUrl];
        if (cachedData && cachedData.imgUrl) {
            updatePageState(newUrl, cachedData.imgUrl, cachedData.prevUrl, cachedData.nextUrl, newFetchId);
            preloadRolling();
        } else {
            // 将 ID 传递给 fetchPageContent
            fetchPageContent(newUrl, newFetchId, (data) => {
                updatePageState(newUrl, data.imgUrl, data.prevUrl, data.nextUrl, newFetchId);
                preloadRolling();
            });
        }
    }

    // 5. 滚动预加载核心逻辑 (10 页)
    function preloadRolling() {
        let currentLink = currentPageUrl;
        let depth = PRELOAD_DEPTH;

        while (depth > 0) {
            const cached = linkCache[currentLink];

            if (!cached || !cached.nextUrl || cached.nextUrl.includes('#') || cached.nextUrl.includes('/g/')) {
                break;
            }

            const nextUrl = cached.nextUrl;

            if (linkCache[nextUrl] && linkCache[nextUrl].imgUrl) {
                preloadImage(linkCache[nextUrl].imgUrl);
                currentLink = nextUrl;
                depth--;
            } else {
                // 预加载使用 ID=0，不参与主翻页流的打断
                fetchPageContent(nextUrl, 0, (data) => {
                    if (data.imgUrl) {
                        preloadImage(data.imgUrl);
                    }
                });
                break;
            }
        }
        console.log(`Rolling Preload Started/Updated from Page ${currentPageIndex + 1} for ${PRELOAD_DEPTH} pages.`);
    }

    function preloadImage(imgUrl) {
        if (!imagePreloadCache[imgUrl]) {
            const img = new Image();
            img.src = imgUrl;
            img.decoding = 'async';
            imagePreloadCache[imgUrl] = img;
        }
    }

    // --- AJAX/DOM Helpers ---

    // 核心修复 2: 在状态更新时检查 ID
    function updatePageState(newUrl, newImgUrl, newPrevUrl, newNextUrl, fetchId) {
        // 只有当 ID 匹配时才更新状态
        if (fetchId !== currentFetchId) {
            return;
        }

        currentPageUrl = newUrl;
        window.history.pushState({}, '', newUrl);

        // 更新原生 DOM
        const $nativeImg = document.getElementById('img');
        const $nativePrev = document.getElementById('prev');
        const $nativeNext = document.getElementById('next');
        if ($nativeImg) $nativeImg.src = newImgUrl;
        if ($nativePrev) $nativePrev.href = newPrevUrl || '#';
        if ($nativeNext) $nativeNext.href = newNextUrl || '#';

        displayNewImage(newImgUrl, fetchId);
    }

    // 核心修复 3: 在 AJAX 请求完成后检查 ID
    function fetchPageContent(url, fetchId, callback) {
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: function(response) {
                // 主翻页流 (ID>0) 必须匹配当前 ID，否则忽略
                if (fetchId > 0 && fetchId !== currentFetchId) {
                     // 确保旧请求不会卡住加载动画
                     $loaderElement.style.display = 'none';
                     $imgElement.style.opacity = '1';
                     return;
                }

                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const data = {
                        imgUrl: doc.getElementById('img')?.src || null,
                        prevUrl: doc.getElementById('prev')?.href || null,
                        nextUrl: doc.getElementById('next')?.href || null
                    };
                    linkCache[url] = data;
                    callback(data);
                } else {
                    console.error("AJAX error:", response.status, url);
                    $loaderElement.style.display = 'none'; $imgElement.style.opacity = '1';
                }
            },
            onerror: function(error) {
                console.error("Network error:", error, url);
                $loaderElement.style.display = 'none'; $imgElement.style.opacity = '1';
            }
        });
    }

    // 核心修复 4: 在图片加载完成后检查 ID
    function displayNewImage(url, fetchId) {
        // ID 检查：防止预加载/旧的图片完成事件覆盖
        if (fetchId > 0 && fetchId !== currentFetchId) {
             return;
        }

        const img = imagePreloadCache[url] || new Image();
        img.src = url;

        const completeLoad = () => {
             // 再次检查 ID，防止图片加载花费时间，期间用户又翻页了
             if (fetchId > 0 && fetchId !== currentFetchId) {
                 return;
             }

             $imgElement.src = url;
             $loaderElement.style.display = 'none';
             $imgElement.style.opacity = '1';
             activateUI();
        };

        img.onload = img.onerror = completeLoad;

        if (imagePreloadCache[url] && imagePreloadCache[url].complete) {
            completeLoad();
        }
    }

    function interceptNativeLinks(intercept = true) {
         const links = ['prev', 'next'];
         links.forEach(id => {
             const linkElement = document.getElementById(id);
             if (linkElement && linkElement.tagName === 'A') {
                 linkElement.removeEventListener('click', handleLinkClick, true);
                 if (intercept) {
                     linkElement.addEventListener('click', handleLinkClick, true);
                 }
             }
         });
    }

    function handleLinkClick(e) {
        if (isReadingMode) {
            e.preventDefault();
            e.stopPropagation();
            navigatePage(e.currentTarget.id);
        }
    }

    // --- Main Execution ---
    initUI();

})();