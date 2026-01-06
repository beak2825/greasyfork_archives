// ==UserScript==
// @name        去除百度文库、csdn、b站复制后缀，去除b站首页直播卡片
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/*
// @match       *://*.wenku.baidu.com/*
// @match       *://*.blog.csdn.net/*
// @icon        https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant       none
// @version     1.7
// @author      -
// @description 2026/1/5 20:16:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561502/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81csdn%E3%80%81b%E7%AB%99%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%EF%BC%8C%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%92%AD%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/561502/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81csdn%E3%80%81b%E7%AB%99%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%EF%BC%8C%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%92%AD%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 通用功能：去除复制限制
    var d = document;
    var add = d.addEventListener;
    add('copy', function(e) {
        e.stopPropagation();
    }, true);

    // 2. B站特定功能：特定卡片模糊化处理
    if (location.hostname.includes('bilibili.com')) {
        var css = `
            /* =========================================================
               第一类：【直播卡片】 -> 模糊 整个卡片
               包含：旧版侧边栏、新版Feed流直播
            ========================================================= */
            .container.is-version8 .floor-single-card,
            .bili-feed-card:has(.bili-live-card.is-rcmd.enable-no-interest) {
                filter: blur(6px) !important;
                opacity: 0.2 !important;
                transition: all 0.4s ease !important;
            }

            /* 直播卡片悬停恢复 */
            .container.is-version8 .floor-single-card:hover,
            .bili-feed-card:has(.bili-live-card.is-rcmd.enable-no-interest):hover {
                filter: none !important;
                opacity: 1 !important;
            }

            /* =========================================================
               第二类：【赞助/广告卡片】 -> 只模糊 图片(img)
               逻辑：找到包含赞助标的卡片，但样式只应用在内部的 img 上
            ========================================================= */
            .bili-feed-card:has(.sponsorThumbnailLabel.sponsorThumbnailLabelVisible) .bili-video-card__cover img,
            .bili-feed-card:has(.sponsorThumbnailLabel.sponsorThumbnailLabelVisible) picture img {
                filter: blur(6px) !important;
                opacity: 0.2 !important;
                transition: all 0.4s ease !important;
            }

            /* 赞助卡片悬停恢复：当鼠标悬停在【整个卡片】上时，让【内部图片】恢复 */
            .bili-feed-card:has(.sponsorThumbnailLabel.sponsorThumbnailLabelVisible):hover img {
                filter: none !important;
                opacity: 1 !important;
            }
        `;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
})();