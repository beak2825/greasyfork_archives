// ==UserScript==
// @name         每日大乱斗-去广告
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  删除伪装广告、公告、按钮矩阵、标签云、底部导航及评论区，列表页标题下移美化
// @author       Yuehua
// @match        *://accuse.dltrnju.cc/*
// @match        *://mrdld.com/*
// @match        *://being.dltrnju.cc/*
// @match        *://allow.dltrnju.cc/*
// @match        *://balance.dltrnju.cc/*
// @icon         https://accuse.dltrnju.cc/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563329/%E6%AF%8F%E6%97%A5%E5%A4%A7%E4%B9%B1%E6%96%97-%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/563329/%E6%AF%8F%E6%97%A5%E5%A4%A7%E4%B9%B1%E6%96%97-%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS 样式调整：静默隐藏所有目标元素，包括新增加的评论区区块
    const css = `
        /* --- 1. 全局广告、导流组件及底部评论区隐藏 --- */
        .adspop, .horizontal-banner, .post-card-ads, .popup-container, 
        .article-ads-btn, .content-tabs, .tags, #foot-menu, #button5,
        #body-bottom { 
            display: none !important; 
        }

        /* --- 2. 列表页卡片布局优化：标题下移至底部 --- */
        .post-card-container {
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            padding-bottom: 12px !important;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%) !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .post-card-title {
            margin-bottom: 4px !important;
            text-align: left !important;
            padding: 0 12px !important;
            font-size: 16px !important;
            color: #fff !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8) !important;
            line-height: 1.3 !important;
        }

        .post-card-info {
            text-align: left !important;
            padding: 0 12px !important;
            font-size: 11px !important;
            color: #ccc !important;
        }
    `;
    
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);
    }

    // 2. JS 逻辑：执行物理删除
    function cleanGarbage() {
        // A. 列表页精准识别（防止误杀带标题的真实文章卡片）
        const articles = document.querySelectorAll('article');
        articles.forEach(art => {
            const container = art.querySelector('.post-card-container');
            if (container) {
                const titleText = container.querySelector('h2');
                const hasRealTitle = titleText && titleText.innerText.trim().length > 0;
                // 只有既没标题又包含广告加载脚本的块才删除
                if (!hasRealTitle && art.innerHTML.includes('loadBannerDirect')) {
                    art.remove();
                }
            }
        });

        // B. 特征文本匹配：删除包含导流信息的 blockquote 引用块
        const bqs = document.querySelectorAll('blockquote');
        const adKeywords = ['最新地址', '官方客服', '最新网址', 'QQ群', 'TG群', '最新域名'];
        bqs.forEach(bq => {
            const text = bq.innerText;
            if (adKeywords.some(key => text.includes(key))) {
                bq.remove();
            }
        });

        // C. 多目标物理删除（包括新增的 body-bottom）
        const selectors = [
            '.article-ads-btn', 
            '.content-tabs', 
            '.adspop', 
            '.tags', 
            '#button5', 
            '#foot-menu',
            '#body-bottom'  /* 元素1：底部评论区整个区块 */
        ];
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => el.remove());
        });
    }

    // 3. 执行巡逻
    cleanGarbage();
    window.addEventListener('load', cleanGarbage);
    setInterval(cleanGarbage, 500);

})();