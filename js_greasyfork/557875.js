// ==UserScript==
// @name         MWCA-让微博重新干净（又卫生）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  让微博重新干净（又卫生）
// @author       qiqikuka
// @match        *://weibo.com/*
// @match        *://www.weibo.com/*
// @license      CC BY 4.0
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557875/MWCA-%E8%AE%A9%E5%BE%AE%E5%8D%9A%E9%87%8D%E6%96%B0%E5%B9%B2%E5%87%80%EF%BC%88%E5%8F%88%E5%8D%AB%E7%94%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557875/MWCA-%E8%AE%A9%E5%BE%AE%E5%8D%9A%E9%87%8D%E6%96%B0%E5%B9%B2%E5%87%80%EF%BC%88%E5%8F%88%E5%8D%AB%E7%94%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // ======= 2. 核心 CSS 布局与长图修复 =======
    GM_addStyle(`
        /* [1] 物理中心锁定 - 彻底解决卡片偏位 */
        main.Main_wrap_2GRrG, [class*="Main_wrap"], [class*="Frame_main"] {
            display: flex !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }

        /* [2] 锁定主内容流宽度为 960px */
        .Main_full_1dfQX, [class*="Main_full"], #homeWrap, .vue-recycle-scroller {
            width: 960px !important;
            max-width: 960px !important;
            margin: 0 auto !important;
            flex: none !important;
        }

        /* [3] 卡片样式与字体精调 */
        article, [class*="Feed_wrap"], [class*="Card_wrap"] {
            width: 960px !important;
            border-radius: 20px !important;
            border: 1px solid rgba(0,0,0,0.06) !important;
            margin-bottom: 16px !important;
            box-sizing: border-box !important;
        }

        /* 正文字体：苹方 Medium */
        .detail_wbtext_4CRf9 {
            font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
            font-weight: 500 !important;
            line-height: 1.6 !important;
        }

        /* [4] 图片预览层：解决“截断”与“偏左”的核心方案 */
        div[class*="picture-viewer_wrap_"] {
            background: transparent !important; /* 保持背景透明 */
            margin: 12px 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;        /* 解决底部截断的关键点 1 */
            box-sizing: border-box !important;
            display: block !important;       /* 恢复自然流排列 */
            position: relative !important;
        }

        /* 内部图片包裹容器：解除微博强制注入的固定高度 */
        div[class*="picture-viewer_imgWrap_"] {
            width: 860px !important;        /* 锁定您要求的 860px 图片区域 */
            max-width: 100% !important;
            height: auto !important;        /* 解决底部截断的关键点 2：强制覆盖内联 height */
            min-height: 100px !important;
            margin: 0 !important;           /* 移除多余边距，确保对齐正文起始位 */
            display: flex !important;
            justify-content: flex-start !important; /* 修正偏左：确保图片从正文起始位开始渲染 */
            box-sizing: border-box !important;
            overflow: visible !important;   /* 确保长图不会溢出隐藏 */
        }

        img[class*="picture-viewer_pic_"] {
            width: 860px !important;
            max-width: 100% !important;
            height: auto !important;        /* 强制图片比例正确显示 */
            display: block !important;
            flex-shrink: 0 !important;
        }

        /* [5] 净化：屏蔽干扰模块 */
        /* 彻底移除预览工具栏 (收起、旋转) */
        [class*="picture-tool-bar_toolbarSpin"], [class*="picture-viewer_topPlaceholder"],
        /* 屏蔽其他冗余项 */
        .Search_senior_19eQR, [aria-label="首页导航"], .Main_side_i7Vti, [class*="Main_side"],
        [class*="Frame_side"], [class*="rightSide"], [class*="Links_box"],
        .Home_publishCard_Ed7g0, [class*="publishCard"], [class*="index_box"],
        [title="游戏"], a[href*="game.weibo.com"], [class*="Nav_game"],
        [aria-label="无障碍"], [class*="Aria_box_"],
        div[class*="BackTop_wrap"], .BackTop_main_3m3aB {
            display: none !important;
        }

        /* 隐藏模糊占位图 */
        div[class*="picture-viewer_imgWrap_"] div:has(img[style*="blur"]),
        div[class*="picture-viewer_imgWrap_"] div[style*="33.75rem"] {
            display: none !important;
        }

        /* [6] 自定义返回顶部按钮精调 */
        #mwca-custom-backtop {
            position: fixed !important; bottom: 50px !important; right: 50px !important;
            width: 44px !important; height: 44px !important; border-radius: 50% !important;
            background-color: #ffffff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            display: none; align-items: center !important; justify-content: center !important;
            cursor: pointer !important; z-index: 999999 !important; transition: opacity 0.3s;
        }
        #mwca-custom-backtop svg {
            width: 13px !important; height: 13px !important; fill: #666 !important;
            opacity: 0.6 !important; transition: transform 0.2s, opacity 0.2s !important;
        }
        #mwca-custom-backtop:hover svg { transform: translateY(-2px) !important; opacity: 1 !important; }
    `);

    // ======= 3. JS 功能模块 =======

    const COMPLETE_LOGO_SVG = `<svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" style="height: 30px; width: 90px;"><g><path fill="#E6162D" d="M73.615,48.447c-1.314-0.399-2.216-0.657-1.533-2.383c5.033-13.409-7.597-15.071-20.803-9.416 c0,0-2.989,1.301-2.216-1.056c1.456-4.702,1.237-8.63-1.03-10.91c-5.152-5.165-18.871,0.193-30.632,11.954 C8.603,45.433,3.489,54.771,3.489,62.848c0,15.432,19.799,24.822,39.159,24.822c25.389,0,42.277-14.749,42.277-26.458 C84.938,54.127,78.974,50.108,73.615,48.447z"></path><path fill="#F1F1F1" d="M42.713,82.131C27.255,83.664,13.91,76.67,12.906,66.532c-1.058-24.473,52.225-29.73,55.956-5.539 C69.88,71.144,58.158,80.611,42.713,82.131z"></path><path fill="#FF9933" d="M90.144,20.486c-6.132-6.801-15.174-9.39-23.521-7.613c-1.932,0.412-3.156,2.319-2.744,4.238 c0.412,1.932,2.306,3.156,4.238,2.744c13.098-2.893,24.605,9.876,20.391,22.594c-1.338,4.509,5.24,6.64,6.801,2.203 C97.931,36.543,96.283,27.28,90.144,20.486z"></path><path fill="#FF9933" d="M79.412,42.69c1.623,0.515,3.349-0.361,3.877-1.984c2.94-8.629-5.084-17.528-13.964-15.47 c-1.662,0.348-2.718,1.997-2.37,3.658c0.361,1.662,1.997,2.718,3.645,2.357c1.984-0.425,4.148,0.193,5.603,1.803 c1.456,1.623,1.855,3.826,1.224,5.758C76.913,40.423,77.789,42.162,79.412,42.69z"></path><path d="M44.246,53.2c-7.355-1.919-15.664,1.752-18.858,8.231c-3.259,6.608-0.103,13.95,7.317,16.346 c7.703,2.486,16.772-1.327,19.927-8.45C55.749,62.346,51.859,55.171,44.246,53.2z M38.63,70.075 c-3.249,5.211-12.149,2.467-8.695-3.852C33.164,61.1,41.972,63.757,38.63,70.075z M43.563,63.763 c-1.113,2.019-4.608,1.073-3.349-1.34C41.332,60.439,44.749,61.343,43.563,63.763z"></path></g></svg>`;

    const COMPLETE_SET_SVG = `<svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;"><path d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252 c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366 c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586 c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363 c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005 c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675 c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366 c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.597,5.598-13.36,8.477-21.226,7.552 l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805 c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303 c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799 c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364 c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005 c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007 c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366 c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799 c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698 c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088 C339.815,267.771,320.972,313.262,281.292,329.698z"/></svg>`;

    function fixEverything() {
        const logo = document.querySelector('a[aria-label="Weibo"]');
        if (logo && (!logo.dataset.done || logo.querySelectorAll('path').length < 5)) {
            logo.innerHTML = COMPLETE_LOGO_SVG;
            logo.dataset.done = "true";
        }
        const searchInput = document.querySelector('input[placeholder="搜索微博"], .woo-input-main');
        if (searchInput && searchInput.placeholder !== "") {
            searchInput.placeholder = "";
        }
        const setBtn = document.querySelector('button[title="设置"], button[aria-label="设置"]');
        if (setBtn && !setBtn.dataset.done) {
            setBtn.innerHTML = COMPLETE_SET_SVG;
            setBtn.style.cssText = "display:flex !important; align-items:center !important; justify-content:center !important;";
            setBtn.dataset.done = "true";
        }
        // 原图加载 (large)
        document.querySelectorAll('img[src*="sinaimg.cn"]').forEach(img => {
            if (img.src.includes('/face/') || img.dataset.processed) return;
            const pattern = /\/(mw690|mw1024|mw2000|orj360|orj480|thumbnail)\//;
            if (pattern.test(img.src)) {
                img.src = img.src.replace(pattern, '/large/');
                img.dataset.processed = "true";
            }
        });
    }

    function injectNewBackTop() {
        if (document.getElementById('mwca-custom-backtop')) return;
        const btn = document.createElement('div');
        btn.id = 'mwca-custom-backtop';
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 5.5L20 19.5H4L12 5.5Z"></path></svg>`;
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        }, { passive: true });
    }

    const observer = new MutationObserver(fixEverything);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('DOMContentLoaded', () => {
        injectNewBackTop();
        fixEverything();
    });
})();