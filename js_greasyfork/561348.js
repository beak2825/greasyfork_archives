// ==UserScript==
// @name         FA 缩略图放大
// @namespace    Lecrp.com
// @version      1.0
// @description  放大FA搜索结果的缩略图
// @author       jcjyids
// @match        https://www.furaffinity.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @license      GPL-3.0-or-later
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561348/FA%20%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/561348/FA%20%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 配置区域 ===
    const TARGET_HEIGHT = 400; // 设定的高度（纯数字）
    const TIMEOUT = 3000; // 3秒超时
    // ================

    let globalObserver = null;
    let galleryObserver = null;
    let styleInjected = false;

    // 1. 立即注入 CSS 样式
    function injectStyles() {
        if (styleInjected) return;
        const css = `
            section.gallery.s-${TARGET_HEIGHT} figure {
                height: ${TARGET_HEIGHT + 6}px;
            }
            /* 防止图片在处理前溢出或闪烁 */
            section[id^="gallery-"] img {
                object-fit: contain;
            }
        `;
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            styleInjected = true;
        }
    }

    // 2. 核心计算函数
    function processImage(img, containerWidth) {
        const dataW = parseFloat(img.getAttribute('data-width'));
        const dataH = parseFloat(img.getAttribute('data-height'));

        if (isNaN(dataW) || isNaN(dataH)) return;
        if (dataW < 60 && dataH < 60) return;

        // 计算倍率
        const rh = TARGET_HEIGHT / dataH;
        const rw = containerWidth / dataW;
        const r = Math.min(rh, rw); // 取较小值，确保不超出容器且不超过设定高度

        // 计算新尺寸
        const finalW = (dataW * r).toFixed(3);
        const finalH = (dataH * r).toFixed(3);

        // 覆盖属性与样式
        img.setAttribute('data-width', finalW);
        img.setAttribute('data-height', finalH);
        img.style.width = finalW + 'px';
        img.style.height = finalH + 'px';
    }

    // 3. 处理 Gallery 容器
    function handleGallery(el) {
        // 停止全局监听
        if (globalObserver) {
            globalObserver.disconnect();
            globalObserver = null;
        }

        // 先注入样式再改类名
        injectStyles();

        // 修改 Class: 替换 s-数字
        el.className = el.className.replace(/\bs-\d+\b/g, `s-${TARGET_HEIGHT}`);

        // 获取容器宽度逻辑
        let containerWidth = el.offsetWidth;
        if (containerWidth < 100) {
            containerWidth = window.innerWidth - 12;
        }

        // 处理现有图片
        const imgs = el.querySelectorAll('img[data-width][data-height]');
        imgs.forEach(img => processImage(img, containerWidth));

        // 启动局部监听 (针对动态加载)
        galleryObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const imgs = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                        imgs.forEach(img => processImage(img, containerWidth));
                    }
                });
            }
        });
        galleryObserver.observe(el, { childList: true, subtree: true });
    }

    // 4. 初始化监听逻辑
    const findTarget = () => {
        const el = Array.from(document.querySelectorAll('section')).find(s =>
            s.id.includes('gallery-') && /\bs-\d+\b/.test(s.className)
        );
        if (el) {
            handleGallery(el);
            return true;
        }
        return false;
    };

    // 立即执行一次
    if (!findTarget()) {
        // 启动全局监听
        globalObserver = new MutationObserver((mutations, observer) => {
            if (findTarget()) return;
        });

        globalObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 3秒超时停止
        setTimeout(() => {
            if (globalObserver) {
                globalObserver.disconnect();
            }
        }, TIMEOUT);
    }

})();