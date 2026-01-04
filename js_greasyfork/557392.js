// ==UserScript==
// @name         Yipeek
// @name:zh-CN   一瞥
// @namespace    https://github.com/Chumor/Yipeek
// @version      1.2.1
// @description  "指尖轻触，万象凝于一瞥。A tap, a glimpse — the world in focus."
// @author       Chumor
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @homepage     https://github.com/Chumor/Yipeek
// @supportURL   https://github.com/Chumor/Yipeek/issues
// @downloadURL https://update.greasyfork.org/scripts/557392/Yipeek.user.js
// @updateURL https://update.greasyfork.org/scripts/557392/Yipeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = false;
    const VERSION = typeof GM_info !== 'undefined' ? GM_info.script.version : 'unknown';

    let isPreviewMode = false;
    let previewContainer = null;
    let previewImage = null;
    let imageList = [];
    let currentIndex = 0;
    let lastTap = 0;
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let startDragX = 0;
    let startDragY = 0;
    let lastTouchDistance = 0;
    let imageInfoElement = null;
    let zoomIndicator = null;
    let containerWidth = 0;
    let containerHeight = 0;
    let originalImageWidth = 0;
    let originalImageHeight = 0;
    let imageNaturalWidth = 0;
    let imageNaturalHeight = 0;
    let bodyOverflow = '';
    let bodyPointerEvents = '';

    // 创建预览容器
    function createPreviewContainer() {
        if (previewContainer) return;

        previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview-container';
        previewContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            z-index: 999999;
            display: none;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            touch-action: none;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            pointer-events: auto;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        `;

        // 关闭按钮容器
        const closeButtonContainer = document.createElement('div');
        closeButtonContainer.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            pointer-events: auto;
            transform: translateZ(0);
        `;
        // 关闭按钮
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(30, 30, 30, 0.8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            opacity: 0.9;
            transition: all 0.2s ease;
        `;

        // 触摸反馈
        closeButton.addEventListener('touchstart', function() {
            this.style.opacity = '1';
        });

        closeButton.addEventListener('touchend', function() {
            this.style.opacity = '0.9';
        });

        // 关闭按钮点击
        closeButton.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();
            closePreview();
        });

        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            closePreview();
        });

        closeButtonContainer.appendChild(closeButton);
        previewContainer.appendChild(closeButtonContainer);

        // 图片容器
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            overflow: visible;
            pointer-events: auto;
        `;

        // 图片信息
        imageInfoElement = document.createElement('div');
        imageInfoElement.id = 'yipeek-image-info';
        imageInfoElement.style.cssText = `
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0, 0, 0, 0.6);
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 13px;
            z-index: 1000;
            text-align: center;
            opacity: 0.9;
            pointer-events: none;
            max-width: 90%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: opacity 0.3s ease;
        `;

        // 缩放指示器
        zoomIndicator = document.createElement('div');
        zoomIndicator.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0, 0, 0, 0.6);
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 13px;
            z-index: 1000;
            text-align: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;

        // 加载指示器
        const loading = document.createElement('div');
        loading.id = 'image-preview-loading';
        loading.textContent = '加载中...';
        loading.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            background: rgba(0,0,0,0.5);
            border-radius: 12px;
            z-index: 1000;
            pointer-events: none;
        `;

        previewImage = document.createElement('img');
        previewImage.style.cssText = `
            max-width: 95%;
            max-height: 90%;
            object-fit: contain;
            user-select: none;
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease;
            pointer-events: auto;
        `;

        imageContainer.appendChild(loading);
        imageContainer.appendChild(previewImage);
        previewContainer.appendChild(imageContainer);
        previewContainer.appendChild(imageInfoElement);
        previewContainer.appendChild(zoomIndicator);
        document.body.appendChild(previewContainer);

        // 点击背景关闭预览
        previewContainer.addEventListener('click', function(e) {
            if (e.target === previewContainer) {
                closePreview();
            }
        });

        // 阻止滚动
        previewContainer.addEventListener('touchmove', function(e) {
            if (isDragging) {
                e.preventDefault();
            }
        }, {
            passive: false
        });

        // 更新容器尺寸
        updateContainerSize();

        // 监听窗口大小变化
        window.addEventListener('resize', updateContainerSize);
    }

    // 更新容器尺寸
    function updateContainerSize() {
        if (!previewContainer) return;

        // 图片信息区域预留空间
        const infoHeight = 40;

        containerWidth = window.innerWidth * 0.95;
        containerHeight = window.innerHeight * 0.85;

        // 屏幕适配
        if (containerWidth > window.innerWidth) containerWidth = window.innerWidth;
        if (containerHeight > window.innerHeight) containerHeight = window.innerHeight;
    }

    // GtHub 适配
    function normalizeImageUrl(url) {
        if (!url) return url;

        if (url.includes('github.com') && url.includes('/blob/')) {
            return url
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
        }

        return url;
    }

    // 重置变换
    function resetTransform() {
        currentScale = 1;
        currentX = 0;
        currentY = 0;
        if (previewImage) {
            previewImage.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${currentScale})`;
        }
        zoomIndicator.style.opacity = '0';
    }

    // 应用变换
    function applyTransform() {
        if (previewImage) {
            previewImage.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${currentScale})`;
        }

        // 显示缩放比例
        if (currentScale !== 1) {
            zoomIndicator.textContent = `${Math.round(currentScale * 100)}%`;
            zoomIndicator.style.opacity = '0.9';
        } else {
            zoomIndicator.style.opacity = '0';
        }

        // 更新边界
        updateBoundary();
    }

    // 更新边界
    function updateBoundary() {
        if (!previewImage) return;

        const imgRect = previewImage.getBoundingClientRect();
        const imgWidth = imgRect.width * currentScale;
        const imgHeight = imgRect.height * currentScale;

        // 计算最大可拖动范围
        const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
        const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

        // 限制拖动范围
        currentX = Math.max(-maxX, Math.min(maxX, currentX));
        currentY = Math.max(-maxY, Math.min(maxY, currentY));

        if (previewImage) {
            previewImage.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${currentScale})`;
        }
    }

    // 获取图片标题
    function getImageTitle(img) {
        if (!img) return '图片';

        let title = img.alt || img.title || '';

        // 从src提取文件名
        if (!title && img.src) {
            const filename = img.src.split('/').pop() || '';
            title = filename.replace(/\.[^/.]+$/, '');

            // 移除参数
            title = title.split('?')[0];
            title = title.split('&')[0];

            // 简化常见文件名
            title = title.replace(/(^[\d-]+_|[\d-]+$)/g, '').trim() || '图片';
        }

        // 限制长度
        if (title.length > 25) {
            title = title.substring(0, 22) + '...';
        }

        return title;
    }

    // 更新图片信息
    function updateImageInfo() {
        if (!imageInfoElement) {
            imageInfoElement = document.getElementById('yipeek-image-info');
            if (!imageInfoElement) return;
        }

        if (currentIndex < 0 || currentIndex >= imageList.length) {
            imageInfoElement.textContent = '';
            imageInfoElement.style.opacity = '0';
            return;
        }

        try {
            const img = imageList[currentIndex];
            const title = getImageTitle(img);
            const currentNum = currentIndex + 1;
            const totalNum = imageList.length;

            imageInfoElement.textContent = `${title} ${currentNum}/${totalNum}`;
            imageInfoElement.style.opacity = '0.9';
        } catch (error) {
            console.error('Error updating image info:', error);
            if (imageInfoElement) {
                imageInfoElement.textContent = `${currentIndex + 1}/${imageList.length}`;
                imageInfoElement.style.opacity = '0.9';
            }
        }
    }

    // 预览图片
    function previewImageFn(imgElement) {
        if (!imgElement || !imgElement.src || isPreviewMode) return;

        isPreviewMode = true;

        // 确保预览容器已创建
        createPreviewContainer();

        // 保存body的原始状态
        bodyOverflow = document.body.style.overflow || '';
        bodyPointerEvents = document.body.style.pointerEvents || '';

        // 阻止body滚动和交互
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';

        // 收集图片
        initImageHandlers();

        // 更新当前索引
        currentIndex = imageList.indexOf(imgElement);
        if (currentIndex === -1) {
            currentIndex = 0;
            imageList = [imgElement];
        }

        // 更新图片信息
        updateImageInfo();

        // 显示加载中
        const loading = document.getElementById('image-preview-loading');
        if (loading) loading.style.display = 'block';

        // 重置状态
        resetTransform();

        // 清除旧图片源
        previewImage.src = '';

        // 加载图片
        previewImage.onload = function() {
            // 保存原始尺寸
            originalImageWidth = previewImage.naturalWidth;
            originalImageHeight = previewImage.naturalHeight;
            imageNaturalWidth = originalImageWidth;
            imageNaturalHeight = originalImageHeight;

            // 隐藏加载中
            if (loading) loading.style.display = 'none';

            // 设置初始尺寸
            setOptimalInitialSize();

            // 初始化手势
            initGestures();
        };

        previewImage.onerror = function(e) {
            console.error('Image load error:', e);
            if (loading) {
                loading.textContent = '加载失败';
                loading.style.backgroundColor = 'rgba(200,0,0,0.7)';
            }
        };

        // 加载新图片
        const rawSrc = normalizeImageUrl(imgElement.src);
        previewImage.src = rawSrc;

        // 显示预览
        if (previewContainer) {
            previewContainer.style.display = 'flex';
        }
    }

    // 初始尺寸配置
    function setOptimalInitialSize() {
        if (!previewImage || imageNaturalWidth <= 0 || imageNaturalHeight <= 0) return;

        // 计算图片的宽高比
        const imageRatio = imageNaturalWidth / imageNaturalHeight;
        const containerRatio = containerWidth / containerHeight;

        let targetScale = 1;

        // 计算最佳缩放比例
        if (imageRatio > containerRatio) {
            // 横向图片按宽度缩放，考虑信息区。
            targetScale = containerWidth / imageNaturalWidth;

            // 高度过小时适当放大
            const heightRatio = (containerHeight * 0.9) / imageNaturalHeight;
            if (heightRatio > targetScale) {
                targetScale = heightRatio;
            }
        } else {
            // 纵向图片，以高度为基准
            targetScale = containerHeight / imageNaturalHeight;
        }

        // 限制缩放范围
        const maxScale = 1.0; // 初始不放大
        const minScale = 0.6; // 最小缩放比例

        targetScale = Math.min(targetScale, maxScale);
        targetScale = Math.max(targetScale, minScale);

        // 应用缩放
        currentScale = targetScale;
        currentX = 0;
        currentY = 0;

        // 应用变换
        applyTransform();
    }

    // 初始化手势
    function initGestures() {
        if (!previewImage) return;

        // 双击放大/缩小
        previewImage.addEventListener('click', function(e) {
            e.stopPropagation();
            const now = Date.now();
            const DOUBLE_TAP_DELAY = 300;

            if (now - lastTap < DOUBLE_TAP_DELAY) {
                // 双击重置
                if (currentScale !== 1) {
                    resetTransform();
                } else {
                    // 双击放大到2倍
                    currentScale = 2;
                    applyTransform();
                }
                // 更新信息
                updateImageInfo();
            } else {
                // 单击：放大时重置
                if (currentScale !== 1) {
                    resetTransform();
                    // 更新信息
                    updateImageInfo();
                }
            }
            lastTap = now;
        });

        // 拖动和捏合缩放
        previewImage.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1 && currentScale > 1) {
                isDragging = true;
                startDragX = e.touches[0].clientX - currentX;
                startDragY = e.touches[0].clientY - currentY;
                e.stopPropagation();
            } else if (e.touches.length === 2) {
                // 记录初始距离
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
                e.stopPropagation();
            }
        }, {
            passive: false
        });

        previewImage.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length === 1) {
                currentX = e.touches[0].clientX - startDragX;
                currentY = e.touches[0].clientY - startDragY;
                applyTransform();
                e.preventDefault();
                e.stopPropagation();
            } else if (e.touches.length === 2) {
                // 捏合缩放
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (lastTouchDistance > 0) {
                    const scaleChange = distance / lastTouchDistance;
                    currentScale *= scaleChange;

                    // 限制缩放范围
                    currentScale = Math.max(0.5, Math.min(currentScale, 4));

                    applyTransform();
                    e.preventDefault();
                }

                lastTouchDistance = distance;
                e.stopPropagation();
            }
        }, {
            passive: false
        });

        previewImage.addEventListener('touchend', function(e) {
            if (isDragging) {
                isDragging = false;
            }
            if (e.touches.length < 2) {
                lastTouchDistance = 0;
            }
            updateBoundary();
        }, {
            passive: true
        });

        previewImage.addEventListener('touchcancel', function() {
            isDragging = false;
            lastTouchDistance = 0;
            updateBoundary();
        });
    }

    // 关闭预览
    function closePreview() {
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        // 恢复body的原始状态
        document.body.style.overflow = bodyOverflow;
        document.body.style.pointerEvents = bodyPointerEvents;
        isPreviewMode = false;
        currentScale = 1;
        currentX = 0;
        currentY = 0;
        isDragging = false;
        originalImageWidth = 0;
        originalImageHeight = 0;
        imageNaturalWidth = 0;
        imageNaturalHeight = 0;
    }

    // 为所有图片添加点击事件
    function initImageHandlers() {
        // 收集所有可点击的图片
        const allImages = document.querySelectorAll('img');
        // 过滤可预览图片
        imageList = Array.from(allImages).filter(img => {
            const rect = img.getBoundingClientRect();
            if (rect.width <= 48 && rect.height <= 48) return false;
            const parent = img.parentElement;
            if (parent) {
                const cls = parent.className || '';
                // 无条件忽略
                if (/logo|kmlogo|btn|button|oauth/i.test(cls)) return false;

                // 条件忽略
                const isOtherUI = /to-|goto-|go-|jump-|nav|menu|btn|icon|header|footer|aside|navbar|avatar|ad|banner|sponsor|watermark|placeholder|skeleton/i.test(cls);
                if (isOtherUI && !img.alt && !img.title) return false;
            }
            const parentLink = img.closest('a');
            if (
                (parentLink && parentLink.hasAttribute('data-preview-ignore')) ||
                img.closest('[data-yipeek-ignore]')
            ) return false;
            return true;
        });
        imageList.forEach(img => {
            if (img.dataset.yipeekBound) return;
            img.addEventListener('click', function(e) {
                // 预览功能兜底
                e.preventDefault();
                e.stopPropagation();

                const parentLink = img.closest('a');
                if (parentLink) {
                    parentLink.addEventListener('click', function(e2) {
                        e2.preventDefault();
                        e2.stopPropagation();
                    }, {
                        once: true,
                        passive: false
                    });
                }

                if (!isPreviewMode) {
                    previewImageFn(img);
                }
            }, {
                passive: false
            });
            img.dataset.yipeekBound = 'true';
        });
    }


    // 监听DOM变化
    const observer = new MutationObserver(() => {
        if (!isPreviewMode) {
            initImageHandlers();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initImageHandlers);
        } else {
            initImageHandlers();
        }

        // 首次预览时创建预览容器
        createPreviewContainer();
        previewContainer.style.display = 'none';
    }

    // 启动
    init();

    console.log(`Yipeek 一瞥 v${VERSION} - 指尖轻触，万象凝于一瞥`);
})();
