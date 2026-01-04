// ==UserScript==
// @name         Blob拦截图片拼接脚本（纯净版）——实现为豆包ai生成的所有图片去水印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  直接拦截Blob URL创建，强制进行图片拼接（无拼接标记）
// @author       小张 | 个人博客：https://blog.z-l.top | 公众号“爱吃馍” | 设计导航站 ：https://dh.z-l.top | quicker账号昵称：星河城野❤
// @license      GPL-3.0
// @match        https://www.doubao.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556071/Blob%E6%8B%A6%E6%88%AA%E5%9B%BE%E7%89%87%E6%8B%BC%E6%8E%A5%E8%84%9A%E6%9C%AC%EF%BC%88%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%89%E2%80%94%E2%80%94%E5%AE%9E%E7%8E%B0%E4%B8%BA%E8%B1%86%E5%8C%85ai%E7%94%9F%E6%88%90%E7%9A%84%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556071/Blob%E6%8B%A6%E6%88%AA%E5%9B%BE%E7%89%87%E6%8B%BC%E6%8E%A5%E8%84%9A%E6%9C%AC%EF%BC%88%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%89%E2%80%94%E2%80%94%E5%AE%9E%E7%8E%B0%E4%B8%BA%E8%B1%86%E5%8C%85ai%E7%94%9F%E6%88%90%E7%9A%84%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=====================================');
    console.log('Blob拦截图片拼接脚本（纯净版）已加载');
    console.log('=====================================');

    // 配置
    const CONFIG = {
        DEBUG_MODE: true,
        SPLIT_RATIO: 0.5,  // 分割比例
        TIMEOUT: 20000,    // 超时时间
        FORCE_SPLICING: true // 强制拼接模式
    };

    // 全局状态
    const state = {
        originalCreateObjectURL: null,
        originalRevokeObjectURL: null,
        pendingBlobs: new Map(),      // 待处理的Blob
        processedBlobs: new Map(),    // 已处理的Blob
        inPaintingImageData: null,    // in_painting_picture图片数据
        downloadTriggered: false,     // 是否触发了下载
        lastSplicedUrl: null          // 最后拼接的URL
    };

    // 初始化 - 在document-start阶段立即执行
    function initialize() {
        log('开始初始化...');

        // 保存原始方法
        state.originalCreateObjectURL = URL.createObjectURL;
        state.originalRevokeObjectURL = URL.revokeObjectURL;

        // 重写Blob URL方法
        overrideBlobMethods();

        // 设置其他监听器
        setupEventListeners();

        // 开始查找in_painting_picture图片
        startLookingForInPaintingPicture();

        log('初始化完成！');
    }

    // 重写Blob URL相关方法
    function overrideBlobMethods() {
        log('重写Blob URL方法...');

        // 重写createObjectURL
        URL.createObjectURL = function(blob) {
            const timestamp = new Date().toLocaleTimeString();
            log(`[${timestamp}] 拦截到Blob创建:`, {
                type: blob.type,
                size: blob.size,
                isImage: blob.type.startsWith('image/')
            });

            // 如果是图片类型且触发了下载，进行拼接
            if (blob.type.startsWith('image/') && state.downloadTriggered) {
                log('检测到图片Blob且下载已触发，准备拼接...');

                // 存储原始Blob
                const blobId = generateBlobId(blob);
                state.pendingBlobs.set(blobId, blob);

                // 处理拼接
                processBlobSplicing(blobId, blob);

                // 返回临时URL，稍后会被替换
                const tempUrl = state.originalCreateObjectURL.call(URL, new Blob(['processing'], {type: 'text/plain'}));
                state.pendingBlobs.set(tempUrl, blobId);

                return tempUrl;
            }

            // 正常处理非图片Blob或未触发下载的情况
            return state.originalCreateObjectURL.call(URL, blob);
        };

        // 重写revokeObjectURL
        URL.revokeObjectURL = function(url) {
            const timestamp = new Date().toLocaleTimeString();
            log(`[${timestamp}] 拦截到Blob释放:`, url);

            // 如果是我们的临时URL，不释放
            if (state.pendingBlobs.has(url)) {
                log('检测到临时URL，跳过释放');
                return;
            }

            return state.originalRevokeObjectURL.call(URL, url);
        };
    }

    // 设置事件监听器
    function setupEventListeners() {
        log('设置事件监听器...');

        // 监听所有点击事件
        document.addEventListener('click', handleGlobalClick, true);

        // 监听页面变化
        const observer = new MutationObserver(handlePageChanges);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'data-testid']
        });

        // 页面卸载清理
        window.addEventListener('beforeunload', cleanup);
    }

    // 处理全局点击
    function handleGlobalClick(e) {
        if (!e.target) return;

        // 检查是否点击了下载按钮
        const downloadButton = findDownloadButton(e.target);
        if (downloadButton) {
            log('检测到下载按钮点击！');

            // 标记下载已触发
            state.downloadTriggered = true;

            // 设置超时，防止无限等待
            setTimeout(() => {
                state.downloadTriggered = false;
                log('下载触发状态已重置（超时）');
            }, CONFIG.TIMEOUT);

            // 如果是链接，阻止默认行为
            if (downloadButton.tagName === 'A') {
                e.preventDefault();
                e.stopPropagation();

                // 延迟执行，给其他事件处理器时间
                setTimeout(() => {
                    simulateDownloadClick(downloadButton);
                }, 100);
            }
        }
    }

    // 查找下载按钮
    function findDownloadButton(element) {
        let current = element;

        while (current && current !== document) {
            if (isDownloadButton(current)) {
                return current;
            }
            current = current.parentElement;
        }

        return null;
    }

    // 判断是否为下载按钮
    function isDownloadButton(element) {
        if (!element) return false;

        const testId = element.getAttribute('data-testid');
        const className = element.className;
        const text = (element.textContent || element.getAttribute('title') || '').toLowerCase();
        const href = element.tagName === 'A' ? element.href : '';

        const isDownload = (
            testId === 'edit_image_download_button' ||
            className.includes('hover-DQYLdi') ||
            className.includes('imagelink-nowatermark') ||
            text.includes('下载') ||
            text.includes('download') ||
            text.includes('原图') ||
            (href && (href.includes('download') || href.includes('original')))
        );

        if (isDownload) {
            log('识别到下载按钮:', {
                tagName: element.tagName,
                testId: testId,
                className: className,
                text: text,
                href: href
            });
        }

        return isDownload;
    }

    // 模拟下载点击
    function simulateDownloadClick(button) {
        log('模拟下载点击...');

        try {
            // 创建按钮克隆
            const clone = button.cloneNode(true);
            clone.style.display = 'none';
            clone.style.opacity = '0';
            clone.style.pointerEvents = 'none';

            document.body.appendChild(clone);

            // 移除所有事件监听器
            clone.onclick = null;

            // 触发点击
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false
            });

            clone.dispatchEvent(event);
            log('模拟点击已触发');

            setTimeout(() => {
                document.body.removeChild(clone);
            }, 1000);

        } catch (error) {
            log('模拟点击失败:', error);
        }
    }

    // 开始查找in_painting_picture图片
    function startLookingForInPaintingPicture() {
        log('开始查找in_painting_picture图片...');

        // 立即查找
        checkForInPaintingPicture();

        // 定时查找
        setInterval(checkForInPaintingPicture, 2000);
    }

    // 检查in_painting_picture图片
    function checkForInPaintingPicture() {
        if (state.inPaintingImageData) {
            return; // 已经找到了
        }

        const images = document.querySelectorAll('[data-testid="in_painting_picture"]');

        if (images.length > 0) {
            const targetImage = images[0];
            log('找到in_painting_picture图片:', targetImage.src);

            // 下载图片数据
            downloadInPaintingImage(targetImage.src);

            // 监听图片变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'src') {
                        log('in_painting_picture图片src已更新:', targetImage.src);
                        downloadInPaintingImage(targetImage.src);
                    }
                });
            });

            observer.observe(targetImage, { attributes: true });

        } else {
            log('未找到in_painting_picture图片，继续等待...');
        }
    }

    // 下载in_painting_picture图片
    async function downloadInPaintingImage(url) {
        log('下载in_painting_picture图片:', url);

        try {
            const response = await fetch(url, {
                mode: 'cors',
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'image/*',
                    'Referer': window.location.href
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = function(e) {
                state.inPaintingImageData = e.target.result;
                log('in_painting_picture图片下载完成，大小:', blob.size, 'bytes');
            };

            reader.readAsDataURL(blob);

        } catch (error) {
            log('下载in_painting_picture图片失败:', error);
        }
    }

    // 处理Blob拼接
    async function processBlobSplicing(blobId, originalBlob) {
        log('开始处理Blob拼接...');

        try {
            // 等待in_painting_picture图片下载完成
            if (!state.inPaintingImageData) {
                log('等待in_painting_picture图片下载完成...');
                await waitForInPaintingImage();
            }

            log('开始拼接图片...');

            // 转换原始Blob为DataURL
            const originalData = await blobToDataURL(originalBlob);

            // 拼接图片（无标记版本）
            const splicedBlob = await spliceImages(originalData, state.inPaintingImageData);

            // 生成新的Blob URL
            const splicedUrl = state.originalCreateObjectURL.call(URL, splicedBlob);
            state.processedBlobs.set(blobId, splicedUrl);
            state.lastSplicedUrl = splicedUrl;

            log('图片拼接完成，生成新Blob URL:', splicedUrl);

            // 触发下载
            triggerDownload(splicedUrl, 'spliced_image.png');

            // 重置下载状态
            state.downloadTriggered = false;

        } catch (error) {
            log('Blob拼接失败:', error);

            // 失败时使用原始Blob
            const originalUrl = state.originalCreateObjectURL.call(URL, originalBlob);
            triggerDownload(originalUrl, 'original_image.png');

            state.downloadTriggered = false;
        }
    }

    // 等待in_painting_picture图片
    function waitForInPaintingImage() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkInterval = setInterval(() => {
                if (state.inPaintingImageData) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > CONFIG.TIMEOUT) {
                    clearInterval(checkInterval);
                    reject(new Error('等待in_painting_picture图片超时'));
                }
            }, 100);
        });
    }

    // Blob转换为DataURL
    function blobToDataURL(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(blob);
        });
    }

    // 拼接图片（无标记版本）
    function spliceImages(originalData, editData) {
        log('执行图片拼接...');

        return new Promise((resolve, reject) => {
            const originalImg = new Image();
            const editImg = new Image();

            let originalLoaded = false;
            let editLoaded = false;

            originalImg.onload = function() {
                log('原始图片加载完成:', originalImg.width, '×', originalImg.height);
                originalLoaded = true;
                checkReady();
            };

            editImg.onload = function() {
                log('编辑图片加载完成:', editImg.width, '×', editImg.height);
                editLoaded = true;
                checkReady();
            };

            originalImg.onerror = function() {
                reject(new Error('原始图片加载失败'));
            };

            editImg.onerror = function() {
                reject(new Error('编辑图片加载失败'));
            };

            originalImg.src = originalData;
            editImg.src = editData;

            function checkReady() {
                if (originalLoaded && editLoaded) {
                    try {
                        // 创建Canvas
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // 确定目标尺寸
                        const targetWidth = Math.max(originalImg.width, editImg.width);
                        const targetHeight = Math.max(originalImg.height, editImg.height);

                        canvas.width = targetWidth;
                        canvas.height = targetHeight;

                        log('拼接画布尺寸:', targetWidth, '×', targetHeight);

                        // 计算分割线位置
                        const splitX = Math.floor(targetWidth * CONFIG.SPLIT_RATIO);
                        log('分割线位置:', splitX);

                        // 绘制原始图片左半部分
                        ctx.drawImage(
                            originalImg,
                            0, 0, splitX, originalImg.height,  // 源区域
                            0, 0, splitX, targetHeight         // 目标区域
                        );

                        // 绘制编辑图片右半部分
                        const editSplitX = Math.floor(editImg.width * CONFIG.SPLIT_RATIO);
                        ctx.drawImage(
                            editImg,
                            editSplitX, 0, editImg.width - editSplitX, editImg.height,  // 源区域
                            splitX, 0, targetWidth - splitX, targetHeight                 // 目标区域
                        );

                        // 转换为Blob（不添加任何标记）
                        canvas.toBlob((blob) => {
                            log('图片拼接成功，生成Blob大小:', blob.size, 'bytes');
                            resolve(blob);
                        }, 'image/png', 1.0);

                    } catch (error) {
                        reject(new Error('图片拼接失败:' + error.message));
                    }
                }
            }
        });
    }

    // 触发下载
    function triggerDownload(blobUrl, filename) {
        log('触发下载:', filename);

        try {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;

            a.style.cssText = `
                position: fixed !important;
                left: -9999px !important;
                top: -9999px !important;
                display: block !important;
                opacity: 0 !important;
                pointer-events: none !important;
            `;

            document.body.appendChild(a);

            // 创建鼠标事件
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 1,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false,
                button: 0,
                buttons: 1
            });

            a.dispatchEvent(event);
            log('下载事件已触发');

            setTimeout(() => {
                if (document.body.contains(a)) {
                    document.body.removeChild(a);
                }

                // 延迟释放资源
                setTimeout(() => {
                    if (blobUrl !== state.lastSplicedUrl) {
                        state.originalRevokeObjectURL.call(URL, blobUrl);
                        log('已释放Blob URL资源:', blobUrl);
                    }
                }, 30000);

            }, 100);

        } catch (error) {
            log('触发下载失败:', error);
            throw error;
        }
    }

    // 处理页面变化
    function handlePageChanges(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查新添加的元素中是否有in_painting_picture图片
                        const images = node.querySelectorAll('[data-testid="in_painting_picture"]');
                        if (images.length > 0 && !state.inPaintingImageData) {
                            log('页面变化中发现in_painting_picture图片');
                            checkForInPaintingPicture();
                        }
                    }
                });
            }
        });
    }

    // 生成Blob ID
    function generateBlobId(blob) {
        return `blob_${Date.now()}_${blob.size}_${blob.type}`;
    }

    // 清理资源
    function cleanup() {
        log('清理脚本资源...');

        // 恢复原始方法
        if (state.originalCreateObjectURL) {
            URL.createObjectURL = state.originalCreateObjectURL;
        }
        if (state.originalRevokeObjectURL) {
            URL.revokeObjectURL = state.originalRevokeObjectURL;
        }

        // 释放所有Blob URL
        state.processedBlobs.forEach((url) => {
            try {
                state.originalRevokeObjectURL.call(URL, url);
            } catch (e) {
                // 忽略已释放的URL
            }
        });

        state.pendingBlobs.clear();
        state.processedBlobs.clear();

        log('脚本资源清理完成');
    }

    // 日志函数
    function log(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log('[Blob拦截拼接脚本]', new Date().toLocaleTimeString(), ...args);
        }
    }

    // 立即启动脚本
    initialize();

})();