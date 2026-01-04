// ==UserScript==
// @name         e-hentai Auto Pager
// @name:zh-CN   e-hentai 自动翻页
// @name:zh-TW   e-hentai 自動翻頁
// @name:ja      e-hentai 自動ページ送り
// @namespace    https://greasyfork.org/zh-CN/scripts/554081
// @description  Seamless scrolling experience on e-hentai — auto-load next page as you read, no clicks needed!
// @description:zh-CN  致力于最丝滑的滚动阅读体验 —— 自动翻页，畅享无间断浏览
// @description:zh-TW  在 e-hentai 上實現無縫滾動瀏覽，享受極致流暢體驗
// @description:ja     e-hentaiでスムーズなスクロールを実現し、連続閲覧を快適に
// @version      4.2
// @copyright    2025，Ti kai(https://greasyfork.org/zh-CN/scripts/554081)
// @license      CC BY-NC-ND 4.0
// @icon         https://www.google.com/s2/favicons?domain=e-hentai.org
// @match        https://e-hentai.org/s/*
// @match        https://exhentai.org/s/*
// @match        http://e-hentai.org/s/*
// @match        http://exhentai.org/s/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554081/e-hentai%20Auto%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/554081/e-hentai%20Auto%20Pager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const INITIAL_LOAD_COUNT = 50;      // 第一次加载50张
    const LOAD_BATCH_SIZE = 50;         // 每次加载50张
    const SCROLL_THRESHOLD = 500;       // 滚动阈值
    const PRELOAD_THRESHOLD = 20;       // 预加载阈值：剩余20张时开始加载
    const MAX_CANVAS_HEIGHT = 4000;     // 单个canvas最大高度，超过则创建新canvas

    let loadedImages = [];
    let loading = false;
    let hasMorePages = true;
    let nextPageUrl = document.querySelector('a#next')?.href;
    let currentLoadCount = 0;
    let totalImageCount = 0; // 记录相册总图片数量（从页面解析）
    let lastLoadedPageNum = 0; // 记录最后加载的页码，防止重复加载

    // 分块存储canvas和对应图片
    let canvasChunks = [];
    
    // 固定canvas宽度
    let fixedCanvasWidth = 0;

    if (!nextPageUrl) {
        console.warn("[E-Hentai Infinite Scroller] 无下一页");
        return;
    }

    console.log("[E-Hentai Infinite Scroller] 初始化...");

    // 从页面解析总图片数量
    const pageInfoMatch = document.querySelector('#i6 .gpc')?.textContent?.match(/Showing (\d+)-(\d+) of (\d+)/);
    if (pageInfoMatch) {
        totalImageCount = parseInt(pageInfoMatch[3]);
        console.log(`[E-Hentai Infinite Scroller] 检测到相册总图片数: ${totalImageCount}`);
    }

    // 创建容器
    let container = document.createElement('div');
    container.id = 'long-image-container';
    container.style.margin = '20px 0';
    container.style.textAlign = 'center';

    // 替换原图区域
    const originalContainer = document.getElementById('i3');
    if (originalContainer) {
        originalContainer.style.display = 'none';
        originalContainer.parentNode.insertBefore(container, originalContainer.nextSibling);
    } else {
        document.body.appendChild(container);
    }

    // 初始化固定canvas宽度
    function initializeCanvasWidth() {
        const maxWidth = window.innerWidth * 0.9; // 最大宽度为屏幕90%
        const minWidth = 640;
        fixedCanvasWidth = Math.min(maxWidth, Math.max(minWidth, 1280));
    }

    // 设置canvas宽度
    initializeCanvasWidth();

    // 创建新的canvas块
    function createNewCanvasChunk() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block';
        canvas.style.maxWidth = '100%';
        canvas.style.margin = '0 auto';
        canvas.style.border = '1px solid #ccc';
        canvas.style.imageRendering = 'pixelated';
        
        canvas.width = fixedCanvasWidth;
        canvas.height = 0; // 初始高度为0
        
        container.appendChild(canvas);
        
        const chunk = {
            canvas: canvas,
            ctx: ctx,
            images: [],
            startY: 0
        };
        
        canvasChunks.push(chunk);
        return chunk;
    }

    // 获取当前活跃的canvas块
    function getCurrentCanvasChunk() {
        if (canvasChunks.length === 0) {
            return createNewCanvasChunk();
        }
        
        const lastChunk = canvasChunks[canvasChunks.length - 1];
        if (lastChunk.canvas.height >= MAX_CANVAS_HEIGHT) {
            return createNewCanvasChunk();
        }
        
        return lastChunk;
    }

    // 加载图片函数
    function loadImagesBatch(count) {
        // 检查是否应该继续加载
        if (loading || !hasMorePages || currentLoadCount >= count) {
            console.log(`[E-Hentai Infinite Scroller] 加载条件检查: loading=${loading}, hasMorePages=${hasMorePages}, currentLoadCount=${currentLoadCount}, count=${count}, totalImageCount=${totalImageCount}`);
            if (!hasMorePages) {
                console.log("✅ 已到达最后一页，停止加载");
            }
            if (totalImageCount > 0 && loadedImages.length >= totalImageCount) {
                console.log("✅ 已加载所有图片，停止加载");
                hasMorePages = false;
            }
            return;
        }
        
        loading = true;
        console.log(`[E-Hentai Infinite Scroller] 开始加载批次: ${count}`);

        let batchLoaded = 0;
        const loadNext = () => {
            // 检查是否应该停止加载
            if (!hasMorePages || !nextPageUrl || batchLoaded >= LOAD_BATCH_SIZE || currentLoadCount >= count) {
                loading = false;
                console.log(`[E-Hentai Infinite Scroller] 批次加载完成: batchLoaded=${batchLoaded}, hasMorePages=${hasMorePages}, currentLoadCount=${currentLoadCount}, count=${count}`);
                return;
            }

            const currentUrl = nextPageUrl;
            GM_xmlhttpRequest({
                method: 'GET',
                url: currentUrl,
                withCredentials: true,
                headers: { 'Referer': 'https://e-hentai.org/' },
                onload: function (res) {
                    const html = res.responseText;
                    const imgMatch = html.match(/<img[^>]+id=["']img["'][^>]+src=["']([^"']+)["']/);
                    const nextMatch = html.match(/<a[^>]+id=["']next["'][^>]+href=["']([^"']+)["']/);

                    if (imgMatch) {
                        const imageUrl = imgMatch[1];
                        const pageNum = parseInt(currentUrl.split('-')[2], 10);

                        // 检查是否重复加载同一页（防止重复）
                        if (lastLoadedPageNum === pageNum) {
                            console.log(`[E-Hentai Infinite Scroller] 检测到重复加载页码 ${pageNum}，停止加载`);
                            hasMorePages = false;
                            loading = false;
                            return;
                        }
                        lastLoadedPageNum = pageNum;

                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: imageUrl,
                            withCredentials: true,
                            headers: { 'Referer': currentUrl },
                            responseType: 'blob',
                            onload: function (imgRes) {
                                const blob = imgRes.response;
                                const img = new Image();
                                img.onload = () => {
                                    // 再次检查是否应该停止加载（防止重复加载最后一页）
                                    if (!hasMorePages) {
                                        console.log(`[E-Hentai Infinite Scroller] 已到达最后一页，停止加载图片 ${pageNum}`);
                                        batchLoaded++;
                                        currentLoadCount++;
                                        loadNext();
                                        return;
                                    }

                                    // 检查是否已加载所有图片（基于总图片数）
                                    if (totalImageCount > 0 && loadedImages.length >= totalImageCount) {
                                        console.log(`[E-Hentai Infinite Scroller] 已加载所有 ${totalImageCount} 张图片，停止加载`);
                                        hasMorePages = false;
                                        batchLoaded++;
                                        currentLoadCount++;
                                        loadNext();
                                        return;
                                    }

                                    // 计算基于固定canvas宽度的缩放高度
                                    const scaleX = fixedCanvasWidth / img.width;
                                    const scaledHeight = img.height * scaleX;
                                    
                                    const imageInfo = {
                                        pageNum: pageNum,
                                        image: img,
                                        width: img.width,
                                        height: img.height,
                                        scaledHeight: scaledHeight,
                                        y: 0 // 相对于当前块的y位置
                                    };
                                    
                                    loadedImages.push(imageInfo);

                                    // 获取当前活跃的canvas块
                                    const currentChunk = getCurrentCanvasChunk();
                                    
                                    // 将图片添加到当前块
                                    currentChunk.images.push(imageInfo);
                                    
                                    // 计算新的y位置
                                    let totalHeightInChunk = 0;
                                    currentChunk.images.forEach(imgInChunk => {
                                        imgInChunk.y = totalHeightInChunk;
                                        totalHeightInChunk += imgInChunk.scaledHeight;
                                    });
                                    
                                    // 更新canvas高度
                                    currentChunk.canvas.height = totalHeightInChunk;

                                    // 重绘当前块
                                    redrawCanvasChunk(currentChunk);

                                    batchLoaded++;
                                    currentLoadCount++;
                                    console.log(`✅ 图片 ${pageNum} 已加载并绘制 (当前共${loadedImages.length}张)`);
                                    
                                    // 检查是否已达到总图片数
                                    if (totalImageCount > 0 && loadedImages.length >= totalImageCount) {
                                        console.log(`✅ 已加载所有 ${totalImageCount} 张图片，设置 hasMorePages = false`);
                                        hasMorePages = false;
                                    }
                                    
                                    loadNext();
                                };
                                img.src = URL.createObjectURL(blob);
                            },
                            onerror: function () {
                                console.error(`❌ 图片 ${pageNum} 加载失败`);
                                batchLoaded++;
                                currentLoadCount++;
                                loadNext();
                            }
                        });
                    } else {
                        console.warn(`未找到图片在页面: ${currentUrl}`);
                        // 检查是否到达最后一页（没有图片可能意味着是最后一页）
                        if (!nextMatch) {
                            console.log("✅ 未找到图片且无下一页，到达相册末尾");
                            hasMorePages = false;
                        }
                        batchLoaded++;
                        currentLoadCount++;
                        loadNext();
                    }

                    // 更新下一页URL和状态（修复错误：检查 nextMatch 是否存在）
                    if (nextMatch && nextMatch[1]) {
                        nextPageUrl = nextMatch[1];
                    } else {
                        nextPageUrl = null;
                        hasMorePages = false;
                        console.log("✅ 已到达最后一页，设置 hasMorePages = false");
                    }
                },
                onerror: function () {
                    console.error("页面请求失败");
                    batchLoaded++;
                    currentLoadCount++;
                    loadNext();
                }
            });
        };

        loadNext();
    }

    // 重绘指定的canvas块
    function redrawCanvasChunk(chunk) {
        if (chunk.images.length === 0) return;

        // 清空并重新绘制
        chunk.ctx.clearRect(0, 0, fixedCanvasWidth, chunk.canvas.height);

        // 按顺序绘制每张图片
        chunk.images.forEach(img => {
            chunk.ctx.drawImage(
                img.image,
                0,
                img.y,
                fixedCanvasWidth,    // 使用固定宽度
                img.scaledHeight     // 按比例缩放的高度
            );
        });
    }

    // 滚动事件监听 - 智能预加载
    function checkScroll() {
        if (!hasMorePages) {
            console.log("[E-Hentai Infinite Scroller] 已到达最后一页，停止滚动监听");
            return;
        }

        // 额外检查：如果已加载图片数达到总图片数，停止加载
        if (totalImageCount > 0 && loadedImages.length >= totalImageCount) {
            console.log(`[E-Hentai Infinite Scroller] 已加载所有 ${totalImageCount} 张图片，停止预加载`);
            hasMorePages = false;
            return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 计算当前可视区域底部位置
        const scrollBottom = scrollTop + windowHeight;

        // 计算剩余未加载的图片数量
        if (loadedImages.length > 0) {
            // 获取最后几张图片的平均高度来估算剩余距离
            const recentImages = loadedImages.slice(-PRELOAD_THRESHOLD);
            if (recentImages.length > 0) {
                const avgHeight = recentImages.reduce((sum, img) => sum + img.scaledHeight, 0) / recentImages.length;
                const estimatedRemainingHeight = avgHeight * PRELOAD_THRESHOLD;

                // 如果距离底部小于预估的20张图片高度，开始加载
                if (documentHeight - scrollBottom < estimatedRemainingHeight) {
                    // 额外检查：如果已经加载的图片数量等于或超过总图片数量，则不加载
                    if (totalImageCount > 0 && loadedImages.length >= totalImageCount) {
                        console.log("[E-Hentai Infinite Scroller] 已加载所有图片，跳过预加载");
                        hasMorePages = false;
                        return;
                    }
                    
                    console.log(`智能预加载：当前位置${scrollBottom}, 总高度${documentHeight}, 预估剩余${estimatedRemainingHeight}`);
                    loadImagesBatch(currentLoadCount + LOAD_BATCH_SIZE);
                    return;
                }
            }
        }

        // 备用方案：如果无法估算，使用原始的触底检测
        if (documentHeight - scrollBottom < SCROLL_THRESHOLD && hasMorePages) {
            loadImagesBatch(currentLoadCount + LOAD_BATCH_SIZE);
        }
    }

    // 监听事件
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', () => {
        // 窗口大小改变时重新计算固定宽度
        initializeCanvasWidth();
        
        // 重新创建所有canvas块（因为宽度变了）
        container.innerHTML = '';
        canvasChunks = [];
        loadedImages.forEach(img => {
            const scaleX = fixedCanvasWidth / img.width;
            img.scaledHeight = img.height * scaleX;
        });
        
        // 重新绘制所有图片
        loadedImages.forEach(img => {
            const currentChunk = getCurrentCanvasChunk();
            currentChunk.images.push(img);
            
            // 重新计算y位置
            let totalHeightInChunk = 0;
            currentChunk.images.forEach(imgInChunk => {
                imgInChunk.y = totalHeightInChunk;
                totalHeightInChunk += imgInChunk.scaledHeight;
            });
            
            currentChunk.canvas.height = totalHeightInChunk;
            redrawCanvasChunk(currentChunk);
        });
    });

    // 初始化
    loadImagesBatch(INITIAL_LOAD_COUNT);
})();
