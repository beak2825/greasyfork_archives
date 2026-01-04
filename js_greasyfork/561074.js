// ==UserScript==
// @name         Linux.do 长图自动显示修复 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复Linux.do中长图片显示过小问题，并自动替换为高清原图链接。
// @author       WslzGmzs
// @match        https://linux.do/t/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561074/Linuxdo%20%E9%95%BF%E5%9B%BE%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/561074/Linuxdo%20%E9%95%BF%E5%9B%BE%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入 CSS：强制图片宽度撑满，高度自适应，移除点击放大的遮罩背景
    const css = `
        /* 移除容器限制 */
        .cooked .lightbox-wrapper .aspect-image {
            max-width: 100% !important;
            height: auto !important;
            width: 100% !important;
        }

        /* 强制图片显示原图比例 */
        .cooked .lightbox-wrapper img {
            width: 100% !important;
            height: auto !important;
            max-height: none !important; /* 关键：允许长图展开 */
            display: block !important;
            object-fit: contain;
        }

        /* 隐藏掉原本用来显示"点击查看大图"的元数据，让它看起来像普通图片 */
        .cooked .lightbox-wrapper .meta {
            display: none !important;
        }

        /* 移除外层多余的背景 */
        .cooked .lightbox-wrapper {
            background: transparent !important;
            border: none !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /**
     * 将缩略图替换为原图的核心函数
     * @param {HTMLElement} node - 搜索范围
     */
    function replaceWithOriginal(node) {
        // 查找所有被 lightbox 包裹的图片
        // 范围缩小到 node 内部，避免全页搜索造成性能浪费
        const images = node.querySelectorAll('.cooked .lightbox-wrapper a.lightbox img');

        images.forEach(img => {
            // 防止重复处理
            if (img.dataset.fixed === 'true') return;

            const link = img.closest('a.lightbox');
            if (link && link.href) {
                // 标记已处理
                img.dataset.fixed = 'true';

                // 2. 移除 srcset 和 sizes，这是导致浏览器加载缩略图的元凶
                img.removeAttribute('srcset');
                // 移除宽高限制
                img.removeAttribute('width');
                img.removeAttribute('height');

                // 3. 替换 src 为原图链接
                if (img.src !== link.href) {
                    img.src = link.href;
                }
            }
        });
    }

    // 4. MutationObserver 监听动态加载的内容 (下拉滚动时)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                         // 检查节点本身是否包含图片，或者其内部包含图片
                        replaceWithOriginal(node); 
                    }
                });
            }
        });
    });

    // 5. 启动逻辑
    // 为了防止 document-start 找不到 body，我们在这里做个判断
    function init() {
        const targetNode = document.querySelector('#main-outlet') || document.body;
        if(targetNode) {
            // 先处理一遍当前页面的图片
            replaceWithOriginal(document.body);
            // 开启监听
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
    }

    // 确保 DOM 加载完成后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
