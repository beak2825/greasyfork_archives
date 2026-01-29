// ==UserScript==
// @name         Yipeek
// @name:zh-CN   一瞥
// @namespace    https://github.com/Chumor/Yipeek
// @version      1.4.0
// @description  "指尖轻触，万象凝于一瞥。A tap, a glimpse — the world in focus."
// @author       Chumor
// @match        *://*/*
// @grant        GM_getResourceText
// @run-at       document-end
// @resource     filteringRules https://raw.githubusercontent.com/Chumor/Yipeek/dev/filtering-rules.json
// @icon         https://cdn.jsdelivr.net/gh/Chumor/Yipeek@dev/assets/google-photos-128.png
// @homepage     https://github.com/Chumor/Yipeek
// @supportURL   https://github.com/Chumor/Yipeek/issues
// @downloadURL https://update.greasyfork.org/scripts/557392/Yipeek.user.js
// @updateURL https://update.greasyfork.org/scripts/557392/Yipeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试与版本信息
    const DEBUG_MODE = false; // 是否开启调试模式（true = 开启）
    const VERSION = typeof GM_info !== 'undefined' ? GM_info.script.version : 'unknown';

    // 加载外部 JSON 过滤规则
    let filteringRules = [];
    try {
        const rulesText = GM_getResourceText('filteringRules'); // 读取外部 JSON
        filteringRules = JSON.parse(rulesText || '{}');

        // DEBUG 模式下打印规则对象
        if (DEBUG_MODE) console.log('[Yipeek] 过滤规则对象 →', filteringRules);

        // 输出规则信息
        const metaVersion = filteringRules._meta?.version || 'unknown';

        const parentClassesCount = filteringRules.ignoreParentClasses?.length || 0;
        const parentClassesRegexCount = filteringRules.ignoreParentClassesRegex?.length || 0;
        const linkPatternsCount = filteringRules.ignoreLinkPatterns?.length || 0;
        const dataAttrCount = filteringRules.ignoreDataAttributes?.length || 0;

        console.log(
            `[Yipeek] 过滤规则加载成功 · v${metaVersion} -> ` +
            `ignoreParentClasses: ${parentClassesCount}, ` +
            `ignoreParentClassesRegex: ${parentClassesRegexCount}, ` +
            `ignoreLinkPatterns: ${linkPatternsCount}, ` +
            `ignoreDataAttributes: ${dataAttrCount}, ` +
            `ignoreOnClick: ${filteringRules.ignoreOnClick ? 1 : 0}`
        );
    } catch (e) {
        console.warn('过滤规则加载失败', e);
    }

    // 过滤规则应用函数
    function applyFilteringRules(img) {
        if (!img || !filteringRules) return;

        // 忽略小图片
        if (img.naturalWidth < filteringRules.minWidth || img.naturalHeight < filteringRules.minHeight) {
            img.style.display = 'none';
            return;
        }

        // 忽略父元素 class
        let parent = img.parentElement;
        while (parent) {
            if (filteringRules.ignoreParentClasses?.some(cls => parent.classList.contains(cls))) {
                return;
            }
            if (filteringRules.ignoreParentClassesRegex?.some(rx => new RegExp(rx).test(parent.className))) {
                return;
            }
            parent = parent.parentElement;
        }

        // 忽略链接属性
        const link = img.closest('a');
        if (link) {
            if (filteringRules.ignoreLinkPatterns?.some(p => new RegExp(p).test(link.href))) return;
            if (filteringRules.ignoreLinkAttribute && link.hasAttribute(filteringRules.ignoreLinkAttribute)) return;
        }

        // 忽略 data 属性
        if (filteringRules.ignoreDataAttributes?.some(attr => img.hasAttribute(attr))) return;

        // 忽略 onclick
        if (filteringRules.ignoreOnClick && (img.onclick || img.parentElement?.onclick)) return;

    }

    let isPreviewMode = false;
    let previewContainer = null;
    let previewImage = null;
    let imageList = [];
    let currentIndex = 0;
    let lastTap = 0;
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;
    let startDragX = 0;
    let startDragY = 0;
    let lastTouchDistance = 0;
    let imageInfoElement = null;
    let zoomIndicator = null;
    let containerWidth = 0;
    let containerHeight = 0;
    let imageNaturalWidth = 0;
    let imageNaturalHeight = 0;
    let bodyOverflow = '';
    let bodyPointerEvents = '';
    let gesturesInited = false;
    let lastFocusX = 0;
    let lastFocusY = 0;
    let rafPending = false;

    function createPreviewContainer() {
        if (previewContainer) return;

        previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview-container';
        previewContainer.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.75);
        z-index: 999999;
        display: none;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        touch-action: none;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        pointer-events: auto;
        transition: opacity 0.32s cubic-bezier(0.22,0.61,0.36,1), transform 0.32s cubic-bezier(0.22,0.61,0.36,1);
        `;

        previewImage = document.createElement('img');
        previewImage.style.cssText = `
        max-width: 95%;
        max-height: 90%;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0.96);
        transition: transform 0.32s cubic-bezier(0.22,0.61,0.36,1), opacity 0.32s ease;
        user-select: none; pointer-events: auto; opacity: 0;
        will-change: transform;
        `;

        imageInfoElement = document.createElement('div');
        imageInfoElement.id = 'yipeek-image-info';
        imageInfoElement.style.cssText = `
        position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
        color: white; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 16px;
        font-size: 13px; z-index: 1000; text-align: center; opacity: 0.9; pointer-events: none;
        max-width: 90%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; transition: opacity 0.3s ease;
        `;

        zoomIndicator = document.createElement('div');
        zoomIndicator.style.cssText = `
        position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
        color: white; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 16px;
        font-size: 13px; z-index: 1000; text-align: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        `;

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
        position: fixed; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%;
        background: rgba(30,30,30,0.8); color: white; display: flex; align-items: center; justify-content: center;
        font-size: 22px; cursor: pointer; z-index: 2147483647; pointer-events: auto; transform: translateZ(0);
        transition: all 0.2s ease; opacity: 0.9;
        `;
        closeBtn.addEventListener('click', e => {
            e.stopPropagation();
            closePreview();
        });
        closeBtn.addEventListener('touchstart', e => {
            e.stopPropagation();
            closePreview();
        });

        previewContainer.appendChild(previewImage);
        previewContainer.appendChild(imageInfoElement);
        previewContainer.appendChild(zoomIndicator);
        previewContainer.appendChild(closeBtn);
        document.body.appendChild(previewContainer);

        previewContainer.addEventListener('click', e => {
            if (e.target === previewContainer) closePreview();
        });
        previewContainer.addEventListener('touchmove', e => {
            if (isDragging) e.preventDefault();
        }, {
            passive: false
        });

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
    }

    function updateContainerSize() {
        containerWidth = Math.max(1, Math.round(window.innerWidth * 0.95));
        containerHeight = Math.max(1, Math.round(window.innerHeight * 0.85));
    }

    function normalizeImageUrl(url) {
        if (!url) return url;
        if (url.includes('github.com') && url.includes('/blob/')) {
            return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        return url;
    }

    function resetTransform() {
        currentScale = 1;
        currentX = 0;
        currentY = 0;
        lastFocusX = containerWidth / 2;
        lastFocusY = containerHeight / 2;
        applyTransform(true);
        zoomIndicator.style.opacity = '0';
    }

    // 应用预览图片的平移与缩放，并更新缩放指示器和边界
    function applyTransform(immediate) {
        if (!previewImage) return;

        const imgWidth = imageNaturalWidth * currentScale;
        const imgHeight = imageNaturalHeight * currentScale;

        const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
        const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

        currentX = Math.max(-maxX, Math.min(maxX, currentX));
        currentY = Math.max(-maxY, Math.min(maxY, currentY));

        const tx = `calc(-50% + ${currentX}px)`;
        const ty = `calc(-50% + ${currentY}px)`;
        const t = `translate(${tx}, ${ty}) scale(${currentScale})`;

        if (immediate || isDragging) {
            previewImage.style.transition = 'transform 0s';
            previewImage.style.transform = t;
        } else {
            previewImage.style.transition = 'transform 0.32s cubic-bezier(0.22,0.61,0.36,1)';
            previewImage.style.transform = t;
        }

        if (currentScale !== 1) {
            zoomIndicator.textContent = `${Math.round(currentScale * 100)}%`;
            zoomIndicator.style.opacity = '0.9';
        } else {
            zoomIndicator.style.opacity = '0';
        }

    }

    function updateBoundary() {
        if (!previewImage) return;
        const imgWidth = imageNaturalWidth * currentScale;
        const imgHeight = imageNaturalHeight * currentScale;
        const maxX = (imgWidth - containerWidth) / 2;
        const maxY = (imgHeight - containerHeight) / 2;
        currentX = Math.max(-maxX, Math.min(maxX, currentX));
        currentY = Math.max(-maxY, Math.min(maxY, currentY));
    }

    function getImageTitle(img) {
        if (!img) return '图片';
        let title = img.alt || img.title || '';
        if (!title && img.src) {
            const filename = img.src.split('/').pop() || '';
            title = filename.replace(/\.[^/.]+$/, '').split('?')[0].split('&')[0].replace(/(^[\d-]+_|[\d-]+$)/g, '').trim() || '图片';
        }
        if (title.length > 25) title = title.substring(0, 22) + '...';
        return title;
    }

    function updateImageInfo() {
        if (!imageInfoElement || !imageList[currentIndex]) return;
        try {
            const img = imageList[currentIndex];
            const title = getImageTitle(img);
            imageInfoElement.textContent = `${title} ${currentIndex+1}/${imageList.length}`;
        } catch (e) {
            imageInfoElement.textContent = `${currentIndex+1}/${imageList.length}`;
        }
        imageInfoElement.style.opacity = '0.9';
    }

    function setOptimalInitialSize() {
        if (!previewImage || imageNaturalWidth <= 0 || imageNaturalHeight <= 0) return;
        const imageRatio = imageNaturalWidth / imageNaturalHeight;
        const containerRatio = containerWidth / containerHeight;
        let targetScale = 1;
        if (imageRatio > containerRatio) {
            targetScale = containerWidth / imageNaturalWidth;
            const heightRatio = (containerHeight * 0.9) / imageNaturalHeight;
            if (heightRatio > targetScale) targetScale = heightRatio;
        } else {
            targetScale = containerHeight / imageNaturalHeight;
        }
        targetScale = Math.min(targetScale, 1.0);
        targetScale = Math.max(targetScale, 0.6);
        currentScale = targetScale;
        currentX = 0;
        currentY = 0;
        lastFocusX = containerWidth / 2;
        lastFocusY = containerHeight / 2;
        applyTransform(true);
    }

    // 初始化触摸手势与点击手势
    function initGestures() {
        // 手势初始化：如果 previewImage 尚未创建，延迟执行
        if (!previewImage) {
            console.warn('previewImage not ready, delaying gesture init');
            setTimeout(initGestures, 50);
            return;
        }

        // 如果手势已初始化，则跳过
        if (gesturesInited) return;
        gesturesInited = true;

        // 点双击手势处理
        previewImage.addEventListener('click', e => {
            e.stopPropagation();
            const now = Date.now();
            const DOUBLE_TAP_DELAY = 300;
            lastFocusX = e.clientX;
            lastFocusY = e.clientY;

            if (now - lastTap < DOUBLE_TAP_DELAY) {
                // 双击
                if (currentScale !== 1) {
                    currentScale = 1;
                    currentX = 0;
                    currentY = 0;
                } else {
                    currentScale = 2;
                }
                applyTransform(true);
                updateImageInfo();
            } else {
                // 单击
                if (currentScale !== 1) {
                    resetTransform();
                    updateImageInfo();
                }
            }
            lastTap = now;
        }, {
            passive: false
        });

        // 单双指 touchstart 手势
        previewImage.addEventListener('touchstart', e => {
            if (!previewImage) return;

            if (e.touches.length === 1) {
                isDragging = true;
                startDragX = e.touches[0].clientX - currentX;
                startDragY = e.touches[0].clientY - currentY;
                lastFocusX = e.touches[0].clientX;
                lastFocusY = e.touches[0].clientY;
                previewImage.style.transition = 'transform 0s';
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
                lastFocusX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                lastFocusY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                previewImage.style.transition = 'transform 0s';
            }
        }, {
            passive: false
        });

        // touchmove 手势处理
        previewImage.addEventListener('touchmove', e => {
            if (!previewImage) return;

            if (e.touches.length === 1 && isDragging) {
                lastX = currentX;
                lastY = currentY;

                // 阻尼拖动（边缘缓冲）
                const dx = e.touches[0].clientX - startDragX;
                const dy = e.touches[0].clientY - startDragY;
                currentX = dx;
                currentY = dy;

                lastFocusX = e.touches[0].clientX;
                lastFocusY = e.touches[0].clientY;

                applyTransform(true);
                e.preventDefault();
                e.stopPropagation();
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (lastTouchDistance > 0) {
                    // 计算缩放比例
                    const scaleChange = distance / lastTouchDistance;
                    // 阻尼范围限制
                    currentScale = Math.max(0.5, Math.min(currentScale * scaleChange, 4.5));
                    lastFocusX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    lastFocusY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    applyTransform(true);
                    e.preventDefault();
                }
                lastTouchDistance = distance;
                e.stopPropagation();
            } else if (e.touches.length > 2) {
                // 多指触控异常处理，重置拖动和缩放状态
                isDragging = false;
                lastTouchDistance = 0;
                previewImage.style.transition = 'transform 0.32s cubic-bezier(0.22,0.61,0.36,1)';
                e.preventDefault();
                e.stopPropagation();
            }
        }, {
            passive: false
        });

        // touchend（阻尼惯性反馈）
        previewImage.addEventListener('touchend', e => {
            isDragging = false;
            if (e.touches && e.touches.length < 2) lastTouchDistance = 0;

            // 阻尼惯性速度
            let vx = (currentX - lastX) * 0.3;
            let vy = (currentY - lastY) * 0.3;
            const friction = 0.9; // 惯性阻尼
            const bounceFactor = 0.8; // 回弹阈值

            function animateInertia() {
                vx *= friction;
                vy *= friction;
                currentX += vx;
                currentY += vy;

                // 越界时回弹
                const imgWidth = imageNaturalWidth * currentScale;
                const imgHeight = imageNaturalHeight * currentScale;
                const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
                const maxY = Math.max(0, (imgHeight - containerHeight) / 2);
                if (currentX > maxX || currentX < -maxX) vx *= -bounceFactor;
                if (currentY > maxY || currentY < -maxY) vy *= -bounceFactor;

                updateBoundary();
                applyTransform(false);

                if (Math.abs(vx) > 0.8 || Math.abs(vy) > 0.8) {
                    requestAnimationFrame(animateInertia);
                } else {
                    previewImage.style.transition = 'transform 0.32s cubic-bezier(0.22,0.61,0.36,1)';
                }
            }
            requestAnimationFrame(animateInertia);

            // 恢复平滑过渡
            previewImage.style.transition = 'transform 0.32s cubic-bezier(0.22,0.61,0.36,1)';
        }, {
            passive: true
        });
        // touchcancel
        previewImage.addEventListener('touchcancel', () => {
            isDragging = false;
            lastTouchDistance = 0;
            previewImage.style.transition = 'transform 0.32s cubic-bezier(0.22,0.61,0.36,1)';
            updateBoundary();
        });
    }

    function previewImageFn(imgElement) {
        if (!imgElement || !imgElement.src || isPreviewMode) return;
        createPreviewContainer();
        isPreviewMode = true;

        bodyOverflow = document.body.style.overflow || '';
        bodyPointerEvents = document.body.style.pointerEvents || '';
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';

        initImageHandlers();
        currentIndex = imageList.indexOf(imgElement);
        if (currentIndex < 0) {
            imageList = [imgElement];
            currentIndex = 0;
        }

        updateImageInfo();
        resetTransform();

        const loading = document.createElement('div');
        loading.id = 'image-preview-loading';
        loading.textContent = '加载中...';
        loading.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:16px;padding:10px 20px;background:rgba(0,0,0,0.5);border-radius:12px;z-index:1000;pointer-events:none;';
        previewContainer.appendChild(loading);

        previewImage.onload = () => {
            imageNaturalWidth = previewImage.naturalWidth;
            imageNaturalHeight = previewImage.naturalHeight;
            loading.remove();
            setOptimalInitialSize();
            initGestures();
            requestAnimationFrame(() => {
                previewImage.style.opacity = '1';
                previewImage.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
                previewContainer.style.opacity = '1';
                previewContainer.style.transform = 'scale(1)';
            });
        };
        previewImage.onerror = (e) => {
            loading.textContent = '加载失败';
            loading.style.backgroundColor = 'rgba(200,0,0,0.7)';
        };

        const rawSrc = normalizeImageUrl(imgElement.src);
        previewImage.src = rawSrc;
        previewContainer.style.display = 'flex';
        previewContainer.style.opacity = '0';
        previewContainer.style.transform = 'scale(0.96)';
        previewImage.style.opacity = '0';
        previewImage.style.transform = 'translate(-50%,-50%) scale(0.96)';
    }

    function initImageHandlers() {
        const allImages = document.querySelectorAll('img');
        imageList = Array.from(allImages);

        imageList.forEach(img => {
            if (img.dataset.yipeekBound) return;
            img.dataset.yipeekBound = 'true';

            // 如果图片匹配忽略规则，则不绑定预览
            if (shouldIgnoreImage(img)) return;

            img.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                if (!isPreviewMode) previewImageFn(img);
            }, {
                passive: false
            });
        });
    }

    function shouldIgnoreImage(img) {
        if (!img || !filteringRules) return false;

        // 忽略小图片
        if (img.naturalWidth < filteringRules.minWidth || img.naturalHeight < filteringRules.minHeight) {
            return true;
        }

        // 忽略父元素 class
        let parent = img.parentElement;
        while (parent) {
            if (filteringRules.ignoreParentClasses?.some(cls => parent.classList.contains(cls))) return true;
            if (filteringRules.ignoreParentClassesRegex?.some(rx => new RegExp(rx).test(parent.className))) return true;
            parent = parent.parentElement;
        }

        // 忽略链接属性
        const link = img.closest('a');
        if (link) {
            if (filteringRules.ignoreLinkPatterns?.some(p => new RegExp(p).test(link.href))) return true;
            if (filteringRules.ignoreLinkAttribute && link.hasAttribute(filteringRules.ignoreLinkAttribute)) return true;
        }

        // 忽略 data 属性
        if (filteringRules.ignoreDataAttributes?.some(attr => img.hasAttribute(attr))) return true;

        // 忽略 onclick
        if (filteringRules.ignoreOnClick && (img.onclick || img.parentElement?.onclick)) return true;

        return false;
    }

    const observer = new MutationObserver(() => {
        if (!isPreviewMode) initImageHandlers();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 关闭图片预览并重置状态
    function closePreview() {
        if (!previewContainer) return;
        previewContainer.style.opacity = '0';
        previewContainer.style.transform = 'scale(0.96)';
        if (previewImage) {
            previewImage.style.opacity = '0';
            previewImage.style.transform = 'translate(-50%,-50%) scale(0.96)';
        }
        setTimeout(() => {
            previewContainer.style.display = 'none';
            document.body.style.overflow = bodyOverflow;
            document.body.style.pointerEvents = bodyPointerEvents;
            isPreviewMode = false;
            gesturesInited = false;
            currentScale = 1;
            currentX = 0;
            currentY = 0;
            isDragging = false;
            imageNaturalWidth = 0;
            imageNaturalHeight = 0;
        }, 320);
    }

    function init() {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initImageHandlers);
        else initImageHandlers();
        createPreviewContainer();
        previewContainer.style.display = 'none';
    }

    init();
    console.log(`[Yipeek] 一瞥 v${VERSION} - 指尖轻触，万象凝于一瞥`);
})();
