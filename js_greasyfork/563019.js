// ==UserScript==
// @name         Apple App Store 助手: 自动切区 + 强制复制 + 图片修复
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  1. 自动将非中国区(cn)的 App Store 页面重定向到中国区；2. 解锁网页复制/右键限制；3. 修复图片复制为 1x1.gif 的问题。
// @author       Gemini
// @match        *://apps.apple.com/*
// @match        *://itunes.apple.com/*
// @icon         https://www.apple.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563019/Apple%20App%20Store%20%E5%8A%A9%E6%89%8B%3A%20%E8%87%AA%E5%8A%A8%E5%88%87%E5%8C%BA%20%2B%20%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%20%2B%20%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/563019/Apple%20App%20Store%20%E5%8A%A9%E6%89%8B%3A%20%E8%87%AA%E5%8A%A8%E5%88%87%E5%8C%BA%20%2B%20%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%20%2B%20%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 模块 0: 自动重定向到中国区 (CN)
    // ==========================================
    function autoRedirectToCN() {
        // 获取 URL 路径部分，例如: /jp/app/polarr/id988173374
        const pathSegments = window.location.pathname.split('/');

        // Apple URL 结构通常是: domain/[地区代码]/app/...
        // pathSegments[0] 是空字符串, pathSegments[1] 通常是地区代码
        const currentRegion = pathSegments[1];

        // 地区代码通常是 2 位字母 (如 'us', 'jp') 或者带连字符 (如 'en-gb')
        // 如果当前有地区代码，且不是 'cn'，则进行替换
        // 注意：有些 URL 可能没有地区代码（默认为 US），这种情况下通常 pathSegments[1] 是 'app' 或 'story'
        // 所以我们只针对明确是 "非cn" 的 "国家代码" 进行跳转
        const regionPattern = /^[a-z]{2}(-[a-z]{2})?$/;

        if (regionPattern.test(currentRegion) && currentRegion !== 'cn') {
            // 替换地区代码为 cn
            pathSegments[1] = 'cn';
            const newPath = pathSegments.join('/');
            const newUrl = window.location.origin + newPath + window.location.search + window.location.hash;

            console.log(`检测到非中国区链接 (${currentRegion})，正在重定向到 CN...`);
            // 使用 replace 避免历史记录堆积
            window.location.replace(newUrl);
            return true; // 表示发生了重定向
        }
        return false;
    }

    // 如果发生了重定向，则停止执行后续脚本（因为页面要刷新了）
    if (autoRedirectToCN()) return;


    // ==========================================
    // 模块 1: CSS 暴力解锁 (样式注入)
    // ==========================================
    const css = `
        *, *::before, *::after {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
            -webkit-touch-callout: default !important;
        }
        /* 移除图片遮罩层 */
        .we-artwork__overlay, .we-lockup__overlay {
            display: none !important;
            pointer-events: none !important;
            z-index: -1 !important;
        }
    `;

    // 注入样式
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        // document-start 阶段 head 可能还不存在，监听 DOMContentLoaded
        if (document.head) {
             const style = document.createElement('style');
             style.type = 'text/css';
             style.appendChild(document.createTextNode(css));
             document.head.appendChild(style);
        } else {
             window.addEventListener('DOMContentLoaded', () => {
                 const style = document.createElement('style');
                 style.type = 'text/css';
                 style.appendChild(document.createTextNode(css));
                 document.head.appendChild(style);
             });
        }
    }

    // ==========================================
    // 模块 2: JS 事件拦截 (解除右键限制)
    // ==========================================
    const eventsToUnlock = [
        'copy', 'cut', 'contextmenu', 'selectstart',
        'mousedown', 'mouseup', 'mousemove', 'keydown', 'keypress', 'keyup'
    ];

    eventsToUnlock.forEach(eventName => {
        window.addEventListener(eventName, function(e) {
            e.stopPropagation();
        }, true);
    });

    // ==========================================
    // 模块 3: 图片 URL 修复 (Markdown 预览修复)
    // ==========================================
    function fixAppStoreImages() {
        const images = document.querySelectorAll('picture img');

        images.forEach(img => {
            if (img.dataset.fixed === "true" && !img.src.includes('1x1.gif')) return;

            const picture = img.closest('picture');
            if (!picture) return;

            const sources = picture.querySelectorAll('source');
            let bestUrl = '';

            // 1. 找 source 里的高清图
            for (let source of sources) {
                const srcset = source.srcset;
                if (srcset) {
                    const candidates = srcset.split(',');
                    // 取最后一个通常是最高清的
                    const bestCandidate = candidates[candidates.length - 1].trim().split(' ')[0];
                    if (bestCandidate) bestUrl = bestCandidate;
                }
            }

            // 2. 找 img 自身的 srcset
            if (!bestUrl && img.srcset) {
                const candidates = img.srcset.split(',');
                bestUrl = candidates[candidates.length - 1].trim().split(' ')[0];
            }

            // 3. 替换并清理 srcset
            if (bestUrl && bestUrl !== img.src) {
                img.src = bestUrl;
                img.removeAttribute('srcset');
                sources.forEach(s => s.removeAttribute('srcset'));
                img.dataset.fixed = "true";
            }
        });
    }

    // ==========================================
    // 模块 4: 观察者模式 (处理动态加载)
    // ==========================================
    // 只有在 DOM 加载完成后才启动观察者
    window.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver((mutations) => {
            fixAppStoreImages();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始运行
        fixAppStoreImages();
        // 延迟兜底
        setTimeout(fixAppStoreImages, 2000);
    });

    console.log('App Store 增强脚本 v3.0 已激活');
})();