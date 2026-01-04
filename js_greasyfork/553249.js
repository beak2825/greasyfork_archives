// ==UserScript==
// @name         通用网页水印屏蔽（精准版）-清少更新
// @namespace    https://chat.openai.com/
// @version      2.0
// @description  精准隐藏水印，减少对正常弹窗的影响
// @match        *://*.didichuxing.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553249/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E5%B1%8F%E8%94%BD%EF%BC%88%E7%B2%BE%E5%87%86%E7%89%88%EF%BC%89-%E6%B8%85%E5%B0%91%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553249/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E5%B1%8F%E8%94%BD%EF%BC%88%E7%B2%BE%E5%87%86%E7%89%88%EF%BC%89-%E6%B8%85%E5%B0%91%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideStyle = document.createElement('style');
    hideStyle.innerHTML = `
        /* 恢复核心水印样式选择器，增加组合判断 */
        [style*="opacity: 0.1"][style*="pointer-events: none"],
        [style*="opacity:0.1"][style*="pointer-events: none"],
        [style*="opacity: 0.05"][style*="pointer-events: none"],
        [style*="opacity:0.05"][style*="pointer-events: none"],
        [class*="watermark"],
        .watermark,
        [style*="background-image"][style*="repeat"][style*="pointer-events: none"] {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(hideStyle);

    function removeStyleBasedWatermarks() {
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            // 核心过滤：有交互元素的一定不是水印（保留弹窗）
            if (el.querySelector('button, a, input, select, textarea, [onclick]')) {
                return;
            }

            const style = getComputedStyle(el);
            // 放宽水印特征判断（覆盖更多普通水印）
            const isWatermarkLike =
                parseFloat(style.opacity) <= 0.2 && // 恢复到0.2阈值，覆盖更多半透明水印
                style.pointerEvents === 'none' && // 无交互（核心特征）
                (style.userSelect === 'none' || style.position === 'fixed' || style.position === 'absolute') &&
                (parseInt(style.zIndex) >= 9999 || style.zIndex === 'auto') &&
                (style.backgroundImage !== 'none' || el.textContent.trim().length > 0); // 有水印内容（图或文字）

            // 放宽尺寸判断（适应小水印）
            const isSizeMatch =
                (el.offsetWidth >= 100 && el.offsetHeight >= 30) || // 小水印尺寸下限降低
                (el.offsetWidth >= window.innerWidth * 0.3 && el.offsetHeight >= window.innerHeight * 0.3); // 区域覆盖放宽

            // 放宽结构判断（允许更多子元素）
            const isStructureMatch = el.children.length <= 5; // 子元素上限提高

            if (isWatermarkLike && isSizeMatch && isStructureMatch) {
                el.remove();
                console.log('✅ 移除水印:', el);
            }
        });
    }

    // 恢复检查频率，确保水印被及时处理
    const timer = setInterval(removeStyleBasedWatermarks, 300);
    setTimeout(() => clearInterval(timer), 6000);

    const observer = new MutationObserver(entries => {
        entries.forEach(e => {
            if (e.addedNodes.length) {
                removeStyleBasedWatermarks();
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });
})();