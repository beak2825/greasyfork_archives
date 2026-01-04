// ==UserScript==
// @name         知乎纯净阅读-书页宽度版（无右侧/无顶栏/无图/适中行宽）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  移除顶栏/右栏，隐藏图片，限制最大宽度并放大字号，优化阅读体验
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558529/%E7%9F%A5%E4%B9%8E%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB-%E4%B9%A6%E9%A1%B5%E5%AE%BD%E5%BA%A6%E7%89%88%EF%BC%88%E6%97%A0%E5%8F%B3%E4%BE%A7%E6%97%A0%E9%A1%B6%E6%A0%8F%E6%97%A0%E5%9B%BE%E9%80%82%E4%B8%AD%E8%A1%8C%E5%AE%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558529/%E7%9F%A5%E4%B9%8E%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB-%E4%B9%A6%E9%A1%B5%E5%AE%BD%E5%BA%A6%E7%89%88%EF%BC%88%E6%97%A0%E5%8F%B3%E4%BE%A7%E6%97%A0%E9%A1%B6%E6%A0%8F%E6%97%A0%E5%9B%BE%E9%80%82%E4%B8%AD%E8%A1%8C%E5%AE%BD%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ① 样式：无图 + 去右栏 + 适中宽度 + 放大字体
    GM_addStyle(`
        /* 全局字体与行距 */
        html, body {
            font-size: 18px !important;
            line-height: 1.8 !important;
            overflow-x: hidden !important; /* 避免横向滚动 */
        }

        /* 顶部 */
        header, .AppHeader {
            display: none !important;
        }

        /* 隐藏所有图片/视频/图标（但保留节点） */
        img, svg, video, source, picture {
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
        }

        /* 右侧相关占位全部干掉 */
        .Question-sideColumn,
        .TopstorySideBar,
        .ContentLayout-sideColumn,
        [class*="Sidebar"],
        [class*="SideBar"],
        [class*="Creator"],
        [class*="HotSearch"],
        [class*="SearchSide"],
        [class*="推荐关注"],
        [class*="盐言"],
        [data-za-detail-view-path*="RecommendUser"],
        [data-za-detail-view-path*="creation"],
        [class*="Pc-feedAd"],
        .CornerButtons {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* 主体宽度改成「书页模式」而不是全屏 */
        .App-main,
        .Topstory-mainColumn,
        .Question-mainColumn,
        .RichContent,
        .Topstory-container,
        .Page {
            max-width: 900px !important;   /* 你可以改成 800 / 1000 自己试 */
            width: 100% !important;
            margin: 0 auto !important;     /* 居中 */
        }

        /* 段落再微调一点阅读体验 */
        .RichText, .RichContent-inner, .RichContent-inner p {
            font-size: 18px !important;
            line-height: 1.8 !important;
        }
    `);

    // ② 继续用你原来的 remove 逻辑，清理右侧等 DOM
    function removeNodes() {
        const selectors = [
            '.TopstorySideBar',
            '.Question-sideColumn',
            '[class*="Sidebar"]',
            '[class*="SideBar"]',
            '[class*="HotSearch"]',
            '[class*="Creator"]',
            '[data-za-detail-view-path*="RecommendUser"]',
            '[data-za-detail-view-path*="creation"]',
            '[class*="推荐关注"]',
            '[class*="盐言"]',
            '.CornerButtons'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    }

    // 初次执行
    removeNodes();

    // 监听新内容（滚动加载时继续清理）
    const observer = new MutationObserver(removeNodes);
    observer.observe(document.body, { childList: true, subtree: true });
})();
