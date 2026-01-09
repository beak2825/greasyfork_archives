// ==UserScript==
// @name         预加载当前网页图片
// @namespace    https://github.com/
// @version      1
// @description  专注图片：native lazy + data-src 等，滚动欺骗 + MutationObserver，无视频干扰，超轻量
// @author       Grok
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561864/%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/561864/%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isTriggeringLoad = false;
    let lastPreloadTime = 0;
    const PRELOAD_THROTTLE_MS = 500;
    const TRIGGER_DURATION_MS = 200;  // 图片够用，缩短回200ms

    const originalScrollTo = window.scrollTo;
    const originalScrollYDesc = Object.getOwnPropertyDescriptor(window, 'scrollY');
    const originalPageYOffsetDesc = Object.getOwnPropertyDescriptor(window, 'pageYOffset');

    /**
     * 只预加载图片（核心）
     */
    function preloadLazyImages() {
        const now = Date.now();
        if (now - lastPreloadTime < PRELOAD_THROTTLE_MS) return;
        lastPreloadTime = now;

        // 1. Native: loading="lazy" → eager
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.loading = 'eager';
        });

        // 2. JS 懒加载：data-src 等 → src
        const lazyAttrs = [
            'data-src', 'data-srcset',
            'data-lazy', 'data-lazy-src', 'data-lazy-srcset',
            'data-original', 'data-original-src', 'data-bg'
        ];
        document.querySelectorAll('img').forEach(img => {
            for (const attr of lazyAttrs) {
                if (img.hasAttribute(attr)) {
                    const value = img.getAttribute(attr);
                    if (value && (img.src.startsWith('data:image') || img.src !== value || !img.complete)) {
                        if (attr.includes('srcset')) {
                            img.srcset = value;
                        } else {
                            img.src = value;
                        }
                        img.removeAttribute(attr);
                        img.loading = 'eager';
                    }
                    break;
                }
            }
        });

        // 3. <picture> source
        document.querySelectorAll('picture source').forEach(source => {
            const srcsetAttr = ['data-srcset', 'data-lazy-srcset'].find(attr => source.hasAttribute(attr));
            if (srcsetAttr) {
                source.srcset = source.getAttribute(srcsetAttr);
                source.removeAttribute(srcsetAttr);
            }
        });

        console.log('🖼️ 图片预加载完成！');
    }

    /**
     * 临时滚动欺骗（触发 scroll-based 图片懒加载）
     */
    function triggerLoadTemporarily() {
        if (isTriggeringLoad) return;
        isTriggeringLoad = true;

        preloadLazyImages();

        // 锁定 scrollTo @ 页首
        window.scrollTo = (x, y) => originalScrollTo.call(window, 0, 0);

        // 假装滚到底
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        Object.defineProperty(window, 'scrollY', { get: () => docHeight, configurable: true });
        Object.defineProperty(window, 'pageYOffset', { get: () => docHeight, configurable: true });

        // 触发事件
        window.dispatchEvent(new Event('scroll', { bubbles: true }));
        document.dispatchEvent(new Event('scroll', { bubbles: true }));

        // 恢复
        setTimeout(() => {
            window.scrollTo = originalScrollTo;
            if (originalScrollYDesc) Object.defineProperty(window, 'scrollY', originalScrollYDesc);
            if (originalPageYOffsetDesc) Object.defineProperty(window, 'pageYOffset', originalPageYOffsetDesc);
            isTriggeringLoad = false;
        }, TRIGGER_DURATION_MS);
    }

    /**
     * 动态监控新图片
     */
    function initMutationObserver() {
        if (!document.body) return setTimeout(initMutationObserver, 100);
        new MutationObserver(() => requestAnimationFrame(preloadLazyImages))
            .observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['loading', 'src', 'data-src']
            });
    }

    function init() {
        initMutationObserver();
        triggerLoadTemporarily();
        setTimeout(triggerLoadTemporarily, 2000);
        setTimeout(triggerLoadTemporarily, 4000);
        setTimeout(() => { window.scrollTo = originalScrollTo; isTriggeringLoad = false; }, 8000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
