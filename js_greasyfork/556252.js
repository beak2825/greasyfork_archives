// ==UserScript==
// @name         1337X Image Helper
// @namespace    https://peratx.net
// @license      Apache License 2.0
// @version      1.0
// @description  1. 识别 description 中的缩略图(支持懒加载 data-original + 路径替换)，显示高清原图；2. 劫持 window.onload 阻止 ma.js 弹窗脚本执行。
// @author       PeratX
// @match        *://x1337x.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556252/1337X%20Image%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556252/1337X%20Image%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 🛡️ 模块一：拦截 window.onload
    // ============================================================
    try {
        Object.defineProperty(window, 'onload', {
            get: function() {},
            set: function(newValue) {
                console.log("ads blocked");
            },
            configurable: true
        });
    } catch (e) {
        console.error('onload 拦截器设置失败', e);
    }

    // ============================================================
    // 🖼️ 模块二：图片处理
    // ============================================================

    // 1. URL 清洗逻辑 (在这里定义所有变高清的规则)
    function getFullSizeImageUrl(url) {
        let newUrl = url;

        // 规则 A: 14xpics 等通用规则 (.th.jpg 或 .md.jpg -> .jpg)
        if (newUrl.match(/\.(th|md)\./i)) {
            newUrl = newUrl.replace(/\.(th|md)\./i, '.');
        }

        // 规则 B: imgtraffic 特殊规则
        if (newUrl.includes('imgtraffic.com')) {
            // i-1 -> 1
            newUrl = newUrl.replace(/\/i-(\d+)\//, '/$1/');
            // [关键] 1s -> 1 (支持 1s, 2s 等)
            newUrl = newUrl.replace(/\/(\d+)s\//, '/$1/');
            // 去除 .html
            newUrl = newUrl.replace(/\.html$/i, '');
        }

        // 规则 C: 通用去 .html
        if (newUrl.endsWith('.html')) {
            newUrl = newUrl.replace(/\.html$/i, '');
        }

        return newUrl;
    }

    // 2. 插入辅助函数
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // 3. 图片创建辅助函数
    function createNewImageElement(src) {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '10px auto';
        img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        img.style.border = '2px solid #4CAF50';
        img.onerror = function() { this.style.display = 'none'; };
        return img;
    }

    function addSignature(container) {
        // 防止重复添加
        if (container.dataset.hasSignature) return;

        const signature = document.createElement('div');
        signature.innerText = 'Imaged Processed by PERATX';
        // 样式：右对齐，灰色，斜体，小字号
        signature.style.cssText = 'color: #000; font-size: 20px; text-align: right; margin-top: 20px; font-style: italic;';

        container.insertBefore(signature, container.firstChild);
        container.dataset.hasSignature = 'true';
    }

    // 4. 主逻辑
    function processDescription() {
        const descContainer = document.querySelector('#description');
        if (!descContainer) return;
        addSignature(descContainer);

        // --- 场景 A：处理图片 (包括懒加载的占位图) ---
        const images = descContainer.querySelectorAll('img');
        images.forEach(img => {
            // 防止重复处理
            if (img.dataset.hasExpanded) return;

            // 优先读取 data-original (应对 lazy load)，没有则读取 src
            const rawSrc = img.dataset.original || img.src;

            if (rawSrc) {
                // 计算高清地址
                const fullSrc = getFullSizeImageUrl(rawSrc);

                // [关键修改] 这里不再预先判断是否包含 .th/.md
                // 只要计算出来的地址(fullSrc) 和 原地址(rawSrc) 不一样，就说明命中规则，需要替换
                if (fullSrc !== rawSrc) {
                    const newImg = createNewImageElement(fullSrc);

                    // 查找外层包裹的 <a> 标签
                    const wrapper = img.closest('a');
                    const targetNode = wrapper ? wrapper : img;

                    // 在目标位置下方插入大图
                    insertAfter(newImg, targetNode);
                    insertAfter(document.createElement('br'), targetNode);

                    // 移除旧的占位符/链接
                    if (wrapper) {
                        wrapper.remove();
                    } else {
                        img.remove();
                    }

                    console.log('已处理图片:', rawSrc, '->', fullSrc);
                }
            }
            // 标记已检查
            img.dataset.hasExpanded = 'true';
        });

        // --- 场景 B：处理纯文字链接 (<a>) ---
        // (处理那些单纯是文字 URL 的情况)
        const links = descContainer.querySelectorAll('a');
        links.forEach(link => {
            if (link.dataset.hasExpanded) return;
            if (link.querySelector('img')) return; // 避免处理上面图片场景已处理过的

            const href = link.href;
            // 判断是否是图片格式的链接
            if (href.match(/\.(jpg|jpeg|png|gif|webp)(\.html)?$/i)) {
                const fullSrc = getFullSizeImageUrl(href);

                // 同样，只有当链接需要变化，或者它原本是 .html 结尾需要展开时才处理
                // 或者是 Imgtraffic 的链接，即使地址没变，我们也要把它变成图片显示出来
                if (fullSrc !== href || href.includes('imgtraffic.com') || href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                     const newImg = createNewImageElement(fullSrc);
                     insertAfter(newImg, link);
                     insertAfter(document.createElement('br'), link);
                     link.remove(); // 移除原文字链接
                }
            }
            link.dataset.hasExpanded = 'true';
        });
    }

    // 5. 执行控制
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processDescription);
    } else {
        processDescription();
    }

    window.addEventListener('load', () => {
        processDescription();
        // 针对延迟加载的内容，多试几次
        setTimeout(processDescription, 1000);
        setTimeout(processDescription, 2500);
    });

})();