// ==UserScript==
// @name         馒头列表图片鼠标悬浮预览
// @namespace    http://tampermonkey.net/
// @version      2026-01-01
// @description  针对所有列表图片
// @author       np
// @match        https://kp.m-team.cc/browse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/561008/%E9%A6%92%E5%A4%B4%E5%88%97%E8%A1%A8%E5%9B%BE%E7%89%87%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561008/%E9%A6%92%E5%A4%B4%E5%88%97%E8%A1%A8%E5%9B%BE%E7%89%87%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
(function() {
    console.log('🔄 初始化增强版图片预览功能');

    // 创建大图预览容器
    const previewContainer = document.createElement('div');
    Object.assign(previewContainer.style, {
        position: 'fixed',
        display: 'none',
        background: 'transparent',
        zIndex: '10000',
        pointerEvents: 'none',
        width: '900px',
        height: '700px',
        overflow: 'visible'
    });

    const previewImage = document.createElement('img');
    Object.assign(previewImage.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))',
        background: 'transparent',
        borderRadius: '6px'
    });

    previewContainer.appendChild(previewImage);
    document.body.appendChild(previewContainer);

    let isPreviewVisible = false;
    let currentHoverElement = null;
    let hideTimeout = null;

    // 修复关键错误：安全的contains检查
    function isElementOrAncestor(element, target) {
        if (!element || !target) return false;
        let current = target;
        while (current && current !== document.documentElement) {
            if (current === element) return true;
            current = current.parentNode;
        }
        return false;
    }

    // 禁用遮罩层事件
    function disableMaskEvents() {
        const masks = document.querySelectorAll('.ant-image-mask');
        masks.forEach(mask => {
            Object.assign(mask.style, {
                pointerEvents: 'none',
                display: 'none'
            });
        });
    }

    // 事件委托处理函数
    function handleMouseOver(event) {
        const target = event.target;
        // 检查是否为目标图片或相关元素
        const imgElement = target.closest('div.ant-image')?.querySelector('img.ant-image-img.torrent-list__thumbnail');

        if (imgElement && imgElement.src) {
            clearTimeout(hideTimeout);
            currentHoverElement = imgElement.closest('div.ant-image');
            disableMaskEvents();

            showPreview(imgElement.src, event);
        }
    }

    function handleMouseMove(event) {
        if (isPreviewVisible && currentHoverElement) {
            updatePreviewPosition(event);
        }
    }

    function handleMouseOut(event) {
        // 修复关键错误：安全地检查relatedTarget
        const relatedTarget = event.relatedTarget;

        if (!relatedTarget) {
            // 鼠标移出浏览器窗口
            hidePreviewImmediately();
            return;
        }

        // 检查鼠标是否真的离开了当前元素区域
        if (currentHoverElement && !isElementOrAncestor(currentHoverElement, relatedTarget) &&
            !isElementOrAncestor(previewContainer, relatedTarget)) {
            hidePreviewWithDelay();
        }
    }

    function showPreview(imgSrc, event) {
        if (!imgSrc) return;

        previewImage.src = imgSrc;
        previewContainer.style.display = 'block';
        previewContainer.style.opacity = '1';
        isPreviewVisible = true;

        updatePreviewPosition(event);

        previewImage.onerror = function() {
            console.error('❌ 图片加载失败');
            hidePreviewImmediately();
        };
    }

    function hidePreviewImmediately() {
        if (isPreviewVisible) {
            previewContainer.style.display = 'none';
            isPreviewVisible = false;
            currentHoverElement = null;
        }
    }

    function hidePreviewWithDelay() {
        if (isPreviewVisible) {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hidePreviewImmediately, 100);
        }
    }

    // 更新预览位置函数 - 图片中点与鼠标水平对齐
    function updatePreviewPosition(event) {
        const horizontalOffset = 20;
        const containerWidth = 900;
        const containerHeight = 700;

        let x = event.clientX + horizontalOffset;
        let y = event.clientY - (containerHeight / 2);

        if (x + containerWidth > window.innerWidth) {
            x = event.clientX - containerWidth - horizontalOffset;
        }
        if (y + containerHeight > window.innerHeight) {
            y = window.innerHeight - containerHeight - 10;
        }
        if (y < 10) {
            y = 10;
        }

        previewContainer.style.left = x + 'px';
        previewContainer.style.top = y + 'px';
    }

    // 核心功能：设置事件委托
    function setupEventDelegation() {
        const stableParent = document.querySelector('table, tbody') || document.body;

        // 移除旧监听器避免重复绑定
        stableParent.removeEventListener('mouseover', handleMouseOver);
        stableParent.removeEventListener('mousemove', handleMouseMove);
        stableParent.removeEventListener('mouseout', handleMouseOut);

        // 添加新监听器
        stableParent.addEventListener('mouseover', handleMouseOver);
        stableParent.addEventListener('mousemove', handleMouseMove);
        stableParent.addEventListener('mouseout', handleMouseOut);

        console.log('✅ 事件委托已设置');
    }

    // 监听DOM变化以处理动态加载
    const observer = new MutationObserver(function(mutations) {
        let shouldResetup = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.querySelector('div.ant-image, img.ant-image-img') ||
                        node.matches('div.ant-image, tr, tbody, table')
                    )) {
                        shouldResetup = true;
                    }
                });
            }
        });

        if (shouldResetup) {
            setTimeout(setupEventDelegation, 50);
        }

        // 始终禁用新添加的遮罩层
        disableMaskEvents();
    });

    // 初始化函数
    function initialize() {
        setupEventDelegation();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 页面加载完成后再次初始化
        window.addEventListener('load', setupEventDelegation);

        // 处理路由变化（单页应用）
        if (typeof window.history !== 'undefined') {
            const originalPushState = window.history.pushState;
            const originalReplaceState = window.history.replaceState;

            window.history.pushState = function() {
                originalPushState.apply(this, arguments);
                setTimeout(setupEventDelegation, 100);
            };

            window.history.replaceState = function() {
                originalReplaceState.apply(this, arguments);
                setTimeout(setupEventDelegation, 100);
            };
        }

        window.addEventListener('popstate', function() {
            setTimeout(setupEventDelegation, 100);
        });

        console.log('✅ 图片预览功能初始化完成');
    }

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 窗口事件处理
    window.addEventListener('resize', hidePreviewImmediately);
    window.addEventListener('scroll', hidePreviewImmediately);

    // 预览容器事件处理
    previewContainer.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });

    previewContainer.addEventListener('mouseleave', function() {
        hidePreviewWithDelay();
    });
})();