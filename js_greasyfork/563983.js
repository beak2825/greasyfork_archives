// ==UserScript==
// @name         B 站视频卡片?!屏蔽
// @namespace    bilibili-video-card-shock-filter
// @version      1.0
// @description  屏蔽 b 站含?!震惊体特征的视频卡片（含热门页，搜索页和主页推荐，标题中同时带有问号和感叹号或两个问号或两个感叹号以上的进行屏蔽，注意并未针对BV视频播放页，未针对单个感叹号，未设计关键词屏蔽），检测规则：？+！/≥2 个？/≥2 个！/结尾单个！
// @author       doubao ai
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563983/B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%21%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/563983/B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%21%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function ()
{
    'use strict';

    // 调试模式：开启后控制台打印屏蔽日志
    const DEBUG = true;

    // ===================== 震惊体检测规则（不变）=====================
    const SHOCK_RULE = {
        qMark: /[？?]/g,    // 匹配中英文问号
        exMark: /[！!]/g,   // 匹配中英文感叹号
        endSingleEx: /[！!]$/  // 匹配结尾单个中英文感叹号
    };

    // ===================== 核心：新增热门页 video-card 卡片适配 =====================
    const SELECTORS = {
        // 覆盖所有视频卡片标题类名 + 热门页 video-card 卡片标题（.video-name）
        videoTitle: [
            '.bili-video-card__info--tit',  // 首页/推荐页核心标题
            '.video-card__title',           // 分区页视频标题
            '.archive-title',               // 视频列表页标题
            '.video-item__title',           // 动态页/搜索结果页标题
            '.small-item-title',            // 侧边推荐栏标题
            '.thumbnail-info__title',       // 专栏页关联视频标题
            '.floor-card-inner .title span',// floor-card-inner 卡片标题
            '.video-card .video-name'       // 新增：热门页 video-card 卡片标题（精准匹配 DOM）
        ].join(', '),
        // 视频卡片容器 + 热门页 video-card 容器
        videoCard: [
            '.bili-video-card',             // 首页/推荐页卡片容器
            '.video-card',                  // 新增：热门页 video-card 卡片容器（直接匹配类名）
            '.video-item',                  // 动态页/搜索页卡片容器
            '.archive-item',                // 列表页卡片容器
            '.small-item',                  // 侧边推荐栏卡片容器
            '.thumbnail-wrapper',           // 专栏页关联视频容器
            '.floor-card-inner'             // floor-card-inner 卡片容器
        ].join(', ')
    };

    // ===================== 核心检测函数（不变）=====================
    function isShockText(text)
    {
        if (!text || text.trim() === '') return false;
        const t = text.trim();

        // 统计标点数量
        const qCount = (t.match(SHOCK_RULE.qMark) || []).length;
        const exCount = (t.match(SHOCK_RULE.exMark) || []).length;
        // 检测结尾单个感叹号
        const hasEndSingleEx = SHOCK_RULE.endSingleEx.test(t);

        // 震惊体判定规则（满足其一即触发）
        return (qCount > 0 && exCount > 0) || qCount >= 2 || exCount >= 2 || hasEndSingleEx;
    }

    // ===================== 处理视频卡片（不变）=====================
    function processVideoCards()
    {
        // 获取所有未处理的视频标题
        const titleElements = document.querySelectorAll(`${SELECTORS.videoTitle}:not([data-card-scanned="true"])`);

        titleElements.forEach(titleEl =>
        {
            // 标记为已处理，避免重复检测
            titleEl.setAttribute('data-card-scanned', 'true');
            const titleText = titleEl.textContent.trim();

            // 检测到震惊体则删除整个视频卡片
            if (isShockText(titleText))
            {
                const cardEl = titleEl.closest(SELECTORS.videoCard);
                if (cardEl)
                {
                    cardEl.remove();
                    if (DEBUG)
                    {
                        console.log(`[视频卡片屏蔽] 已删除震惊体卡片：${titleText.substring(0, 30)}...`);
                    }
                }
            }
        });
    }

    // ===================== 动态监听（适配滚动加载，不变）=====================
    function initDynamicMonitor()
    {
        // 监听 DOM 变化，处理滚动加载的视频卡片
        const observer = new MutationObserver((mutations) =>
        {
            let needProcess = false;
            mutations.forEach(mutation =>
            {
                // 仅检测新增节点，且节点包含视频卡片相关元素
                if (mutation.addedNodes.length > 0)
                {
                    needProcess = true;
                }
            });

            if (needProcess)
            {
                // 延迟 200ms，确保卡片完全渲染（热门页卡片加载速度适配）
                setTimeout(processVideoCards, 200);
            }
        });

        // 监听整个页面的 DOM 变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // 定时兜底检测（3 秒一次），防止 Observer 漏监
        setInterval(processVideoCards, 3000);
    }

    // ===================== 初始化执行（不变）=====================
    // 页面加载完成后立即执行一次
    setTimeout(processVideoCards, 500);
    // 启动动态监听
    initDynamicMonitor();

    //console.log('B 站视频卡片?!屏蔽脚本已启动');
})();