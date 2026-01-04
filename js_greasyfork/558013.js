// ==UserScript==
// @name         ScienceDirect 阅读增强
// @namespace    https://www.sciencedirect.com/
// @version      2.0
// @description  固定目录，隐藏侧栏，扩展正文区域
// @author       klklk09
// @license      MIT
// @match        https://www.sciencedirect.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558013/ScienceDirect%20%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558013/ScienceDirect%20%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LEFT_SELECTORS = [
        '.TableOfContents',
        '#toc',
        '.sidebar-left',
        '[class*="Outline"]'
    ];
    const RIGHT_SELECTORS = [
        '.u-display-block-from-md.col-lg-6.col-md-8',
        '.RelatedContent',
        'aside',
        '[class*="Right"]'
    ];
    const ARTICLE_SELECTORS = [
        'article.col-lg-12',
        'article.col-md-16',
        'article',
        '.Article',
        '[class*="Article"]'
    ];

    const MIN_DESKTOP_PX = 900;

    function findFirst(selectors) {
        for (const s of selectors) {
            const el = document.querySelector(s);
            if (el) return el;
        }
        return null;
    }

    function findAllMatching(selectors) {
        const set = new Set();
        for (const s of selectors) {
            document.querySelectorAll(s).forEach(el => set.add(el));
        }
        return Array.from(set);
    }

    function computeLeftWidth(el) {
        if (!el) return 260;
        const r = el.getBoundingClientRect();
        return (r && r.width > 40) ? Math.round(r.width) : 260;
    }

    function applyStyles() {
        if (window.innerWidth < MIN_DESKTOP_PX) return;

        const leftElement = findFirst(LEFT_SELECTORS);
        const articleElement = findFirst(ARTICLE_SELECTORS);
        const rightElements = findAllMatching(RIGHT_SELECTORS);

        if (!articleElement || !leftElement) return;

        // 隐藏右栏
        rightElements.forEach(re => {
            re.style.display = 'none';
            re.style.visibility = 'hidden';
        });

        // 锁定左栏宽度并设置 sticky
        const leftW = computeLeftWidth(leftElement);


        leftElement.style.minWidth = leftW + 'px';
        leftElement.style.maxWidth = leftW + 'px';
        leftElement.style.flexShrink = '0';  // 防止 flex 容器中被压缩

        // 设置 sticky
        leftElement.style.position = 'sticky';
        leftElement.style.top = '16px';
        leftElement.style.zIndex = '1000';
        leftElement.style.overflow = 'auto';

        // 扩展正文区域
        articleElement.style.marginLeft = leftW + 'px';
        articleElement.style.width = `calc(100% - ${leftW}px)`;
        articleElement.style.float = 'none';
        articleElement.style.maxWidth = 'none';
        articleElement.style.boxSizing = 'border-box';
        articleElement.style.position = 'relative';
        articleElement.style.left = '0';
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyStyles);
    } else {
        setTimeout(applyStyles, 300);
    }
})();
