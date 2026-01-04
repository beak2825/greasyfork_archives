// ==UserScript==
// @name         EH/EXH 多页阅读器模式 (Safari)
// @version      1.0
// @author       lslqtz
// @license      GPL
// @inject-into  page
// @run-at       document-end
// @match        *://e-hentai.org/mpv/*
// @match        *://exhentai.org/mpv/*
// @description  Enable Safari Reader Mode for EH/EXH's Multi-Viewer
// @namespace https://greasyfork.org/users/155581
// @downloadURL https://update.greasyfork.org/scripts/553738/EHEXH%20%E5%A4%9A%E9%A1%B5%E9%98%85%E8%AF%BB%E5%99%A8%E6%A8%A1%E5%BC%8F%20%28Safari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553738/EHEXH%20%E5%A4%9A%E9%A1%B5%E9%98%85%E8%AF%BB%E5%99%A8%E6%A8%A1%E5%BC%8F%20%28Safari%29.meta.js
// ==/UserScript==

(function() {
    'useT strict';

    /**
     * 递归搜索所有 frame，找到那个真正包含 "action_reload" 函数的窗口
     */
    function findGalleryWindow(startWindow) {
        if (startWindow && typeof startWindow.pagecount === 'number' && typeof startWindow.action_reload === 'function') {
            return startWindow;
        }
        for (let i = 0; i < startWindow.frames.length; i++) {
            try {
                const foundWindow = findGalleryWindow(startWindow.frames[i]);
                if (foundWindow) {
                    return foundWindow; // 在 iframe 里找到了
                }
            } catch (e) {
                console.warn('无法访问 iframe:', startWindow.frames[i], e.message);
            }
        }
        return null;
    }

    // --- 查找目标窗口 ---
    const targetWindow = findGalleryWindow(window.top);

    if (!targetWindow) {
        alert("错误：未能找到页面的图片加载函数。脚本无法在此页面上运行。");
        return;
    }

    // --- 进度与并发控制变量 ---
    const totalCount = targetWindow.pagecount;
    let loadedCount = 0;
    let errorCount = 0;
    let imageStatus = new Array(totalCount + 1).fill('pending'); // 'pending', 'loading', 'loaded', 'error'
    let autoConvertDone = false;
    
    const MAX_CONCURRENCY = 5; // 最大并发数
    let activeLoadCount = 0;
    let pageQueue = [];
    
    // [关键标志 1] 队列激活标志 (防止页面自动加载)
    let loadingActivated = false; 
    // [关键标志 2] 进度条激活标志 (只有点按钮才显示进度)
    let forceLoadActive = false;


    // --- 并发队列处理器 ---
    function processQueue() {
        if (activeLoadCount >= MAX_CONCURRENCY || pageQueue.length === 0) {
            return; 
        }

        const pageNumber = pageQueue.shift();
        if (!pageNumber) return;

        if (imageStatus[pageNumber] === 'pending') {
            activeLoadCount++; 
            imageStatus[pageNumber] = 'loading'; 

            const imgDiv = targetWindow.document.getElementById('image_' + pageNumber);
            if (imgDiv) {
                imgDiv.style.visibility = 'visible';
            }
            
            targetWindow.load_image(pageNumber);
        }
    }

    // --- [修改] 覆盖页面自带的 preload_generic ---
    // 增加一个 loadingActivated 标志，防止页面自动加载
    targetWindow.preload_generic = function(a, b, c) {
        // 如果队列未被（滚动或按钮）激活，则不执行任何操作
        if (!loadingActivated) return; 

        var d = a.scrollTop;
        a = d + a.offsetHeight;
        for (var e = "image" == b, f = 1; f <= targetWindow.pagecount; f++) {
            var g = targetWindow.document.getElementById(b + "_" + f);
            if (!g) continue; 
            var h = g.offsetTop,
                k = h + g.offsetHeight;
            
            if ("hidden" == g.style.visibility && k >= d && h <= a + c) {
                if (e) {
                    // 滚动加载加入队列
                    if (imageStatus[f] === 'pending' && !pageQueue.includes(f)) {
                        pageQueue.push(f);
                        processQueue();
                    }
                } else {
                    targetWindow.load_thumb(f); // 缩略图不受并发限制
                }
                g.style.visibility = "visible"; 
            } 
            else if ("visible" == g.style.visibility) {
                if (e && k >= d + 100 && h <= d + 100) {
                     targetWindow.currentpage = f;
                }
            }
        }
    };

    // [修改] 覆盖 onscroll 以激活队列
    const original_onscroll = targetWindow.pane_images.onscroll;
    targetWindow.pane_images.onscroll = function(e) {
        // 第一次滚动时，激活加载功能
        if (!loadingActivated) {
            console.log("滚动激活，静默加载已启用。");
            loadingActivated = true; // 激活队列
        }
        if (original_onscroll) {
            original_onscroll.call(targetWindow.pane_images, e);
        }
    };


    // --- 按钮 2 的功能：原地 DOM 结构修改 ---
    function convertPageToReader() {
        if (autoConvertDone) return;
        autoConvertDone = true;

        const targetDoc = targetWindow.document; 
        const topDoc = window.top.document;
        const paneOuter = targetDoc.getElementById('pane_outer');
        const paneImages = targetDoc.getElementById('pane_images');

        if (!paneOuter || !paneImages) {
            alert("错误：找不到 #pane_outer 或 #pane_images 容器。");
            autoConvertDone = false; 
            return;
        }

        const pageTitle = targetDoc.title || topDoc.title;
        const pageCount = targetWindow.pagecount;
        const newArticle = targetDoc.createElement('article');
        paneImages.parentNode.insertBefore(newArticle, paneImages);
        newArticle.appendChild(paneImages);
        const h1 = targetDoc.createElement('h1');
        h1.textContent = `${pageTitle} (共 ${pageCount} 张)`;
        paneImages.parentNode.insertBefore(h1, paneImages);

        for (let i = 1; i <= pageCount; i++) {
            const mimgDiv = targetDoc.getElementById('image_' + i);
            if (!mimgDiv) continue; 

            const figure = targetDoc.createElement('figure');
            const img = mimgDiv.querySelector('img[id^="imgsrc_"]');

            if (img && img.src && imageStatus[i] === 'loaded') {
                const newImg = img.cloneNode(true);
                newImg.style = '';
                newImg.id = '';
                const figcaption = targetDoc.createElement('figcaption');
                figcaption.textContent = img.title || 'Image';
                figure.appendChild(newImg);
                figure.appendChild(figcaption);
            } else {
                const figcaption = targetDoc.createElement('figcaption');
                if (imageStatus[i] === 'error') {
                    figcaption.textContent = `Page ${i}: (加载失败)`;
                    figcaption.style.color = 'red';
                } else {
                    figcaption.textContent = `Page ${i}: (未加载)`;
                }
                figure.appendChild(figcaption);
            }
            mimgDiv.parentNode.replaceChild(figure, mimgDiv);
        }

        const styleId = 'reader-style';
        if (!targetDoc.getElementById(styleId)) {
            const styleElement = targetDoc.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
                body { background-color: #222 !important; overflow: auto !important; }
                #pane_thumbs, #bar1, #bar2, #bar3, .mbar { display: none !important; }
                #pane_outer { width: auto !important; height: auto !important; position: static !important; }
                article { max-width: 900px; margin: 20px auto; padding: 10px; background-color: #333; border-radius: 8px; }
                article h1 { font-family: -apple-system, sans-serif; text-align: center; border-bottom: 2px solid #555; padding-bottom: 10px; font-size: 20px; color: #eee; }
                #pane_images { position: static !important; width: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; height: auto !important; }
                figure { margin: 0 0 15px 0; padding: 0; text-align: center; }
                figure img { max-width: 100% !important; height: auto !important; display: block; margin: 0 auto !important; }
                figure figcaption { font-family: -apple-system, sans-serif; font-size: 0.9em; color: #aaa; margin-top: 8px; text-align: center; }
            `;
            targetDoc.head.appendChild(styleElement);
        }

        const controls = topDoc.getElementById('mpv_controls');
        if (controls) {
            controls.remove();
        }
    }


    // --- [修改] 更新进度条的函数 ---
    function updateProgress() {
        // [关键] 只有在“强制加载”模式下才更新UI
        if (!forceLoadActive) return;

        const btnLoad = window.top.document.getElementById('mpv_force_load_btn');
        if (!btnLoad) return;

        let progressText = `加载中... (${loadedCount} / ${totalCount})`;
        if (errorCount > 0) {
            progressText += ` - ${errorCount} 错误!`;
            btnLoad.style.backgroundColor = '#ff9f0a'; // 橙色警告
        }
        btnLoad.textContent = progressText;

        // 检查是否全部处理完毕
        checkAutoConvert();
    }

    // --- [修改] 检查是否自动转换的函数 ---
    function checkAutoConvert() {
        // [关键] 只有在“强制加载”模式下才自动转换
        if (autoConvertDone || !forceLoadActive || (loadedCount + errorCount < totalCount)) {
            return; // 还没加载完, 或已转换, 或不是强制加载模式
        }

        const btnLoad = window.top.document.getElementById('mpv_force_load_btn');
        const btnConvert = window.top.document.getElementById('mpv_convert_btn');

        if (errorCount === 0) {
            if (btnLoad) btnLoad.textContent = '加载完毕!';
            if (btnConvert) btnConvert.textContent = '自动转换...';
            setTimeout(convertPageToReader, 500); 
        } else {
            if (btnLoad) {
                btnLoad.textContent = `加载完毕 (${errorCount} 错误)`;
                btnLoad.style.backgroundColor = '#ff3b30'; // 红色错误
            }
            alert(`加载完成，但有 ${errorCount} 张图片加载失败。\n\n您仍可尝试手动点击 "2. 转换页面"。`);
        }
    }

    // --- [修改] 按钮 1 的功能：填充队列并启动 ---
    function forceLoadAllImages() {
        const btnLoad = window.top.document.getElementById('mpv_force_load_btn');
        const btnConvert = window.top.document.getElementById('mpv_convert_btn');
        if (!btnLoad || !btnConvert) return;
        
        // [修改] 激活 *所有* 标志
        if (!loadingActivated) loadingActivated = true;
        if (!forceLoadActive) forceLoadActive = true;

        console.log(`正在强制请求所有 ${totalCount} 张图片...`);
        btnLoad.textContent = `排队中... (0 / ${totalCount})`; // 立即显示进度
        btnLoad.disabled = true;
        btnConvert.disabled = false;
        btnConvert.style.backgroundColor = '#34c759';

        // 填充队列
        pageQueue = [];
        for (let i = 1; i <= totalCount; i++) {
            if (imageStatus[i] === 'pending') {
                pageQueue.push(i);
            }
        }

        // 启动第一批 "worker"，填满并发槽
        for (let k = 0; k < MAX_CONCURRENCY; k++) {
            processQueue();
        }
    }


    // --- "Monkey-Patch" API 回调函数，以捕获 XHR 失败 ---
    const original_load_image_dispatch = targetWindow.load_image_dispatch;
    targetWindow.load_image_dispatch = function(pageNumber) {
        try {
            const xhr = targetWindow.imagelist[pageNumber - 1].xhr;
            // 检查 API (XHR) 请求是否失败
            if (xhr && xhr.readyState === 4 && xhr.status !== 200) {
                if (imageStatus[pageNumber] === 'loading') { // 仅当我们在跟踪它时
                    console.error(`API request for page ${pageNumber} failed with status ${xhr.status}`);
                    imageStatus[pageNumber] = 'error';
                    errorCount++;
                    activeLoadCount--; // [关键] 释放槽位
                    updateProgress();  // [修改] 现在会检查 forceLoadActive 标志
                    processQueue();    // [关键] 启动下一个任务
                }
            }
        } catch (e) {
            console.error("Error in load_image_dispatch patch:", e);
        }
        
        // 调用原始函数
        original_load_image_dispatch(pageNumber);
    };


    // --- "Monkey-Patch" load_image 函数，添加并发回调 ---
    const original_load_image = targetWindow.load_image;
    targetWindow.load_image = function(pageNumber) {
        
        if (imageStatus[pageNumber] === 'loaded' || imageStatus[pageNumber] === 'error') {
            original_load_image(pageNumber); // 允许缩放
            return;
        }

        original_load_image(pageNumber);

        const img = targetWindow.document.getElementById('imgsrc_' + pageNumber);
        
        if (img && !img.dataset.progressHooked) {
            img.dataset.progressHooked = 'true'; 
            const originalOnError = img.onerror; 

            // [自定义 OnError]
            img.onerror = function(e) {
                if (imageStatus[pageNumber] === 'loading') {
                    imageStatus[pageNumber] = 'error';
                    errorCount++;
                    activeLoadCount--; // [关键] 释放槽位
                    console.error(`图片 ${pageNumber} 加载失败:`, img.src);
                    updateProgress();  // [修改] 现在会检查 forceLoadActive 标志
                    processQueue();    // [关键] 启动下一个任务
                }
                if (originalOnError) {
                    originalOnError.call(img, e);
                }
            };

            // [自定义 OnLoad]
            const handleLoad = function() {
                if (imageStatus[pageNumber] === 'loading') {
                    imageStatus[pageNumber] = 'loaded';
                    loadedCount++;
                    activeLoadCount--; // [关键] 释放槽位
                    updateProgress();  // [修改] 现在会检查 forceLoadActive 标志
                    processQueue();    // [关键] 启动下一个任务
                }
            };

            if (img.complete && img.naturalHeight > 0) { 
                handleLoad();
            } else {
                img.onload = handleLoad;
            }
        }
    };


    // --- 在页面（顶层）创建控制按钮 (保持不变) ---
    const btnContainer = window.top.document.createElement('div');
    btnContainer.id = "mpv_controls";
    btnContainer.style.position = 'fixed';
    btnContainer.style.top = '10px';
    btnContainer.style.right = '10px';
    btnContainer.style.zIndex = '99999';
    btnContainer.style.display = 'flex';
    btnContainer.style.flexDirection = 'column';
    btnContainer.style.gap = '5px';

    const commonBtnStyle = `
        padding: 8px 12px;
        font-size: 14px;
        font-family: -apple-system, sans-serif;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: background-color 0.3s;
    `;

    btnContainer.innerHTML = `
        <button id="mpv_force_load_btn" style="${commonBtnStyle} background-color: #007aff;">
            1. 强制加载图片
        </button>
        <button id="mpv_convert_btn" style="${commonBtnStyle} background-color: #888;" disabled>
            2. 转换页面
        </button>
    `;

    if (!window.top.document.getElementById('mpv_controls')) {
        window.top.document.body.appendChild(btnContainer);
        window.top.document.getElementById('mpv_force_load_btn').addEventListener('click', forceLoadAllImages);
        window.top.document.getElementById('mpv_convert_btn').addEventListener('click', convertPageToReader);
    }

})();