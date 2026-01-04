// ==UserScript==
// @name         Pixiv漫画式阅读器
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Shift+V 或右下角按钮开启关闭，小键盘方向键、空格、鼠标滚轮翻页。
// @author       Gemini
// @match        *://www.pixiv.net/*
// @match        *://*.pximg.net/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556319/Pixiv%E6%BC%AB%E7%94%BB%E5%BC%8F%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556319/Pixiv%E6%BC%AB%E7%94%BB%E5%BC%8F%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isReadingMode = false;
    let currentIndex = 0;
    let imagesList = [];
    let container = null;
    let imgElement = null;
    let infoElement = null;
    let loaderElement = null;
    let toggleBtn = null;
    let uiHideTimeout = null;

    // 预加载缓存集合
    const preloadedUrls = new Set();
    const imageObjCache = [];
    const PRELOAD_COUNT = 10;
    const CACHE_MAX_SIZE = 50;

    // 图标 SVG
    const ICON_BOOK_OPEN = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;"><path d="M12 3v17.5c-1.8-1.2-4.3-1.5-6-1.5s-4.2.3-6 1.5V3c1.8-1.2 4.2-1.5 6-1.5s4.2.3 6 1.5zm2 .5C15.8 2.3 18.2 2 20 2s4.2.3 6 1.5v17.5c-1.8-1.2-4.2-1-6-1s-4.2.3-6 1.5V3.5z"/></svg>`;
    const ICON_BOOK_CLOSED = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM13 4v8l-2.5-1.5L8 12V4h5z"/></svg>`;

    // 注入增强的CSS样式
    const css = `
        #gm-reader-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: #000000; z-index: 2147483640;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            user-select: none; outline: none;
        }

        #gm-reader-img {
            max-width: 100%; max-height: 100vh; object-fit: contain; cursor: pointer;
            transition: opacity 0.2s ease; will-change: transform, opacity;
        }

        .gm-loader {
            border: 5px solid rgba(255, 255, 255, 0.2); border-top: 5px solid #ffffff;
            border-radius: 50%; width: 50px; height: 50px; animation: gm-spin 1s linear infinite;
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10; display: none; pointer-events: none;
        }

        @keyframes gm-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        #gm-reader-info {
            position: absolute; bottom: 20px; color: rgba(255, 255, 255, 0.8);
            font-family: sans-serif; font-size: 14px; background: rgba(0, 0, 0, 0.7);
            padding: 6px 16px; border-radius: 20px; pointer-events: none; z-index: 20;
            opacity: 0; transition: opacity 0.3s ease;
        }

        #gm-reader-overlay.gm-ui-visible #gm-reader-info {
            opacity: 1;
        }

        /* === 圆形悬浮开关按钮 === */
        #gm-toggle-btn {
            position: fixed; bottom: 50px; right: 50px; width: 50px; height: 50px;
            background-color: #87CEFA; border-radius: 50%; z-index: 2147483647;
            cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex; justify-content: center; align-items: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); user-select: none;
            opacity: 0.5;
        }

        #gm-toggle-btn:hover {
            transform: scale(1.1); box-shadow: 0 4px 15px rgba(0,0,0,0.4); opacity: 1;
        }

        #gm-toggle-btn svg {
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        }

        /* 状态：阅读模式中 (默认隐藏) */
        #gm-toggle-btn.gm-mode-reading {
            background-color: #ff5252; opacity: 0; transform: scale(0.8);
            pointer-events: none;
        }

        /* 状态：阅读模式中 + 鼠标活动 (显示) */
        #gm-toggle-btn.gm-mode-reading.gm-ui-show {
            opacity: 0.8; transform: scale(1); pointer-events: auto;
        }

        #gm-toggle-btn.gm-mode-reading:hover {
            opacity: 1 !important; transform: scale(1.1) !important; pointer-events: auto !important;
        }

        body.gm-reading-mode-active {
            overflow: hidden !important;
        }
    `;

    // 添加样式（使用 `GM_addStyle` 或 fallback）
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 初始化悬浮按钮
    createToggleButton();

    // ====== 核心：事件监听系统 ======

    // 键盘事件
    window.addEventListener('keydown', handleKeydown, true);

    function handleKeydown(e) {
        // Shift+V 切换
        if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleReader();
            return;
        }

        if (!isReadingMode) return;

        const key = e.key;
        const blockKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Space', 'Enter', 'PageUp', 'PageDown', 'Home', 'End', 'F11'];

        // 阻止默认行为和事件冒泡，防止页面滚动或触发其他快捷键
        if (blockKeys.includes(key) || key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }

        switch (key) {
            case 'Escape':
                exitReader();
                break;
            case 'ArrowRight':
            case ' ':
            case 'Space':
            case 'Enter':
            case 'PageDown':
                nextPage();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                prevPage();
                break;
        }
    }

    // 鼠标滚轮事件
    window.addEventListener('wheel', handleWheel, { passive: false });

    function handleWheel(e) {
        if (!isReadingMode) return;

        e.preventDefault();
        e.stopPropagation();

        // 避免在阅读模式下快速连续触发翻页
        if (Math.abs(e.deltaY) < 10) return;

        if (e.deltaY > 0) {
            nextPage(); // 向下滚动，下一页
        } else if (e.deltaY < 0) {
            prevPage(); // 向上滚动，上一页
        }
    }


    // ====== 功能逻辑 ======

    /** 切换阅读模式 */
    function toggleReader() {
        isReadingMode ? exitReader() : enterReader();
    }

    /** 进入阅读模式 */
    function enterReader() {
        const found = extractImages();
        if (found.length === 0) {
            alert("未检测到漫画图片，请确保页面已加载完毕。");
            return;
        }
        imagesList = found;

        // 重置缓存和状态
        preloadedUrls.clear();
        imageObjCache.length = 0;
        currentIndex = 0;
        isReadingMode = true;

        if (!container) createUI();

        container.style.display = 'flex';
        document.body.classList.add('gm-reading-mode-active');

        updateToggleButtonState(true);
        requestFullScreen(document.documentElement);
        container.focus(); // 聚焦容器以接收按键事件
        showImage(currentIndex);
        preloadImages(currentIndex + 1, PRELOAD_COUNT);
    }

    /** 退出阅读模式 */
    function exitReader() {
        isReadingMode = false;
        if (container) container.style.display = 'none';
        document.body.classList.remove('gm-reading-mode-active');
        updateToggleButtonState(false);
        exitFullScreen();
    }

    /** 更新悬浮按钮状态 */
    function updateToggleButtonState(inReadingMode) {
        if (!toggleBtn) return;
        if (inReadingMode) {
            toggleBtn.classList.add('gm-mode-reading');
            toggleBtn.innerHTML = ICON_BOOK_CLOSED;
            activateUI(); // 触发 UI 激活，让用户看到按钮变化
        } else {
            toggleBtn.classList.remove('gm-mode-reading', 'gm-ui-show');
            toggleBtn.innerHTML = ICON_BOOK_OPEN;
        }
    }

    /** 请求全屏 */
    function requestFullScreen(element) {
        const req = element.requestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (req) req.call(element).catch(err => console.log("Full screen request denied:", err));
    }

    /** 退出全屏 */
    function exitFullScreen() {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exit && document.fullscreenElement) exit.call(document);
    }

    /** 提取图片 URL */
    function extractImages() {
        let results = [];

        // --- 1. 新增隔离逻辑：匹配新版 Pixiv 链接结构 (包含 data-page 的链接即为原图链接) ---
        // 目标：<a href="HIGH_RES_URL" ... data-page="N">
        document.querySelectorAll('a[data-page]').forEach(a => {
            const url = a.href;
            if (url) results.push(url);
        });

        // --- 2. 原有的 Pixiv 漫画页的结构 (div[role="presentation"]) ---
        // 目标：用于匹配旧版或特定嵌入式漫画视图
        document.querySelectorAll('div[role="presentation"]').forEach(div => {
            const link = div.querySelector('a[target="_blank"]');
            const img = div.querySelector('img');
            // 链接优先 (href 是大图链接)，否则使用图片 src (master 链接)
            if (link && link.href) {
                results.push(link.href);
            } else if (img && img.src) {
                results.push(img.src);
            }
        });

        // 提前去重一次，减少不必要的通用查找
        results = [...new Set(results)];

        // --- 3. 通用查找逻辑 (作为最终后备，仅在未找到任何图片时执行) ---
        if (results.length === 0) {
            document.querySelectorAll('img').forEach(img => {
                // 排除太小的图片
                if (img.width > 300 && img.height > 300) {
                    const parentLink = img.closest('a');
                    // 如果父链接指向图片文件，则使用链接，否则使用图片 src
                    if (parentLink && parentLink.href && parentLink.href.match(/\.(jpg|png|jpeg|webp)$/i)) {
                        results.push(parentLink.href);
                    } else {
                        results.push(img.src);
                    }
                }
            });
        }

        // 最终去重并返回结果
        return [...new Set(results)];
    }

    /** 创建悬浮按钮 */
    function createToggleButton() {
        if (document.getElementById('gm-toggle-btn')) return;

        toggleBtn = document.createElement('div');
        toggleBtn.id = 'gm-toggle-btn';
        toggleBtn.title = "点击开启阅读模式 (Shift+V)";
        toggleBtn.innerHTML = ICON_BOOK_OPEN;

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleReader();
        });

        document.body.appendChild(toggleBtn);
    }

    // UI 激活与自动隐藏逻辑
    function activateUI() {
        if (!isReadingMode) return;

        if (container) container.classList.add('gm-ui-visible');
        if (toggleBtn) toggleBtn.classList.add('gm-ui-show');

        if (uiHideTimeout) clearTimeout(uiHideTimeout);

        uiHideTimeout = setTimeout(() => {
            if (container) container.classList.remove('gm-ui-visible');
            if (toggleBtn) toggleBtn.classList.remove('gm-ui-show');
        }, 2000);
    }

    /** 创建阅读器 UI 容器 */
    function createUI() {
        container = document.createElement('div');
        container.id = 'gm-reader-overlay';
        container.setAttribute('tabindex', '-1');

        // 鼠标移动监听：激活 UI
        container.addEventListener('mousemove', activateUI);
        // 鼠标点击图片翻页
        container.addEventListener('click', (e) => {
             e.stopPropagation();
             nextPage();
        });

        imgElement = document.createElement('img');
        imgElement.id = 'gm-reader-img';
        imgElement.decoding = 'async';

        loaderElement = document.createElement('div');
        loaderElement.className = 'gm-loader';

        infoElement = document.createElement('div');
        infoElement.id = 'gm-reader-info';

        container.appendChild(imgElement);
        container.appendChild(loaderElement);
        container.appendChild(infoElement);
        document.body.appendChild(container);
    }

    /** 显示指定页的图片 */
    function showImage(index) {
        // 边界检查
        currentIndex = Math.max(0, Math.min(index, imagesList.length - 1));

        const url = imagesList[currentIndex];
        if (!url || !imgElement) return;

        // 显示加载器，降低当前图片透明度
        if (loaderElement) loaderElement.style.display = 'block';
        imgElement.style.opacity = '0.5';
        imgElement.src = url;

        imgElement.onload = () => {
            if (loaderElement) loaderElement.style.display = 'none';
            imgElement.style.opacity = '1';
            preloadImages(currentIndex + 1, PRELOAD_COUNT); // 继续预加载下一页
        };

        imgElement.onerror = () => {
             if (loaderElement) loaderElement.style.display = 'none';
             imgElement.style.opacity = '1'; // 加载失败也恢复透明度
        };

        if (infoElement) infoElement.textContent = `${currentIndex + 1} / ${imagesList.length}`;

        // 激活 UI 以显示页码信息
        activateUI();
    }

    /** 翻到下一页 */
    function nextPage() {
        if (currentIndex < imagesList.length - 1) {
            showImage(currentIndex + 1);
        }
    }

    /** 翻到上一页 */
    function prevPage() {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    }

    /** 预加载图片 */
    function preloadImages(startIndex, count) {
        for (let i = startIndex; i < startIndex + count; i++) {
            if (i < imagesList.length) {
                const url = imagesList[i];
                if (!preloadedUrls.has(url)) {
                    const img = new Image();
                    img.decoding = 'async';
                    img.src = url;
                    imageObjCache.push(img);
                    preloadedUrls.add(url);
                    // 保持缓存大小，避免内存占用过高
                    if (imageObjCache.length > CACHE_MAX_SIZE) {
                        imageObjCache.shift();
                    }
                }
            }
        }
    }

})();