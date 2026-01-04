// ==UserScript==
// @name         Bilibili 全站净化（精简版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  全站覆盖：移除首页/频道轮播、各类荣誉榜单、搜索结果页热搜、番剧页干扰、新旧版空间充电、播放器信息及点赞数据、评论区、右侧其他推荐、三连栏、页脚等。
// @author       Gemini
// @match        *://www.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://search.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559676/Bilibili%20%E5%85%A8%E7%AB%99%E5%87%80%E5%8C%96%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559676/Bilibili%20%E5%85%A8%E7%AB%99%E5%87%80%E5%8C%96%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************************************************************************
     * 1. CSS 静态拦截
     ************************************************************************/
    const style = document.createElement('style');
    style.textContent = `
        /* 1.1 搜索净化 - 覆盖 www 与 search 域名下的所有热搜组件 */
        .search-panel .header,               /* 搜索框热搜标题 */
        .search-panel .trending,             /* 热搜容器 */
        .search-panel .trendings-single,     /* 单列热搜列表 */
        .search-panel .trendings-double,     /* 双列热搜列表 */
        div[class*="activity-game-list"],    /* 搜索页游戏推广 */
        div[class*="brand-ad-list"] {        /* 搜索页品牌广告 */
            display: none !important;
        }

        /* 1.2 首页与频道页净化 */
        .recommended-swipe,                  /* 首页推荐轮播图 */
        .banner-carousel.channel-carousel,   /* 频道页顶部轮播图 */
        .bili-video-card__info--icon-text {  /* 视频卡片点赞数 */
            display: none !important;
        }

        /* 1.3 视频页荣誉榜单 (全站/每周/入站/游戏等) */
        .honor-item,
        .video-honor,
        a[href*="popular/rank"],
        a[href*="popular/weekly"],
        a[href*="popular/precious"] {
            display: none !important;
        }

        /* 1.4 番剧/电影页净化 */
        div[class*="recommend_wrap"],        /* 相关推荐 */
        div[class*="paybar_container"],       /* 会员续费提示 */
        div[id*="danmukuBox"],               /* 弹幕列表 */
        div[class*="DanmukuBox_wrap"],
        div[id*="pc-cashier-wrapper"],       /* 支付推广 */
        div[class*="mediainfo_mediaToolbar"] { /* 番剧功能栏 */
            display: none !important;
        }

        /* 1.5 播放器内部信息条 */
        .bpx-player-video-info {
            display: none !important;
        }

        /* 1.6 个人空间页净化 (新旧版本兼容) */
        .elec-section,                       /* 新版充电 */
        .section.elec,                       /* 旧版充电 */
        .up-res-tag {                        /* 空间推广标签 */
            display: none !important;
        }

        /* 1.7 装扮与挂件 (头像框、卡片、评论装饰) */
        #card, #ornament, .sailing-card, bili-comment-user-sailing-card {
            display: none !important;
            visibility: hidden !important;
        }

        /* 1.8 通用侧边栏及广告净化 */
        .right-container, .activity-m-v1, .ad-report, .video-tag-container {
            display: none !important;
        }

        /* 1.9 导航栏净化 (下载App、大会员推广 - 保留导航栏主体) */
        .left-entry li:has(a[href*="app.bilibili.com"]),
        .right-entry li:has(a[href*="big"]) {
            display: none !important;
        }

        /* =========================================================
           新增：极致专注模式补充包
           ========================================================= */

        /* 2.0 右侧推荐列表 (防止无限跳转) */
        #reco_list,
        .recommend-list-v1,
        .right-container-inner {
            display: none !important;
        }

        /* 2.1 视频结束三连黑屏 (移除结束后的遮罩推荐) */
        .bpx-player-ending-panel {
            display: none !important;
        }

        /* 2.2 视频下方三连工具栏 (移除点赞/投币/分享按钮) */
        #arc_toolbar_report,
        .video-toolbar {
            display: none !important;
        }

        /* 2.3 网页底部页脚 (关于我们/备案号等) */
        .bili-footer,
        #bili-footer,
        .footer {
            display: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    /************************************************************************
     * 2. Shadow DOM 深度扫描与 Hook
     ************************************************************************/
    function removeOrnamentDeep(root) {
        if (!root) return;
        try {
            // 尝试移除常见的Shadow DOM内的干扰元素
            root.querySelectorAll?.('#ornament, #card').forEach(el => el.remove());
        } catch (_) {}

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) removeOrnamentDeep(node.shadowRoot);
        }
    }

    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
        const shadow = originalAttachShadow.call(this, init);
        requestAnimationFrame(() => removeOrnamentDeep(shadow));
        return shadow;
    };

    /************************************************************************
     * 3. 监控执行
     ************************************************************************/
    const observer = new MutationObserver(() => removeOrnamentDeep(document));
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const run = () => removeOrnamentDeep(document);
    run();
    window.addEventListener('load', run);

})();
