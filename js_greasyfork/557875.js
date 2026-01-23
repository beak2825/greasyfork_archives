// ==UserScript==
// @name         MWCA-让微博重新干净（又卫生）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      CC BY 4.0
// @description  让微博重新干净（又卫生）
// @author       qiqikuka
// @match        *://weibo.com/*
// @match        *://www.weibo.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557875/MWCA-%E8%AE%A9%E5%BE%AE%E5%8D%9A%E9%87%8D%E6%96%B0%E5%B9%B2%E5%87%80%EF%BC%88%E5%8F%88%E5%8D%AB%E7%94%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557875/MWCA-%E8%AE%A9%E5%BE%AE%E5%8D%9A%E9%87%8D%E6%96%B0%E5%B9%B2%E5%87%80%EF%BC%88%E5%8F%88%E5%8D%AB%E7%94%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= 0. 设置项管理 =======
    let showSidebar = GM_getValue("mwca_show_sidebar", true);
    let showPublishCard = GM_getValue("mwca_show_publish_card", false);

    GM_registerMenuCommand(showSidebar ? "🚫 隐藏首页左侧栏" : "✅ 显示首页左侧栏", () => {
        GM_setValue("mwca_show_sidebar", !showSidebar);
        location.reload();
    });

    GM_registerMenuCommand(showPublishCard ? "🚫 隐藏发微博模块" : "✅ 显示发微博模块", () => {
        GM_setValue("mwca_show_publish_card", !showPublishCard);
        location.reload();
    });


    // ======= 2. 核心 CSS 布局 =======
    GM_addStyle(`
/* 替换评论图标：仅隐藏原有字体图标，保留容器 */
.woo-font.woo-font--comment._commentIcon_198pe_122::before {
    content: none !important; /* 清除原有字体图标 */
}
/* 强制图标容器样式，保证SVG显示 */
.woo-font.woo-font--comment._commentIcon_198pe_122 {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 1em !important;
    height: 1em !important;
    color: inherit !important; /* 继承父元素颜色 */
}
/* 强制SVG继承颜色，且不超出容器 */
.woo-font.woo-font--comment._commentIcon_198pe_122 svg {
    width: 100% !important;
    height: 100% !important;
    fill: currentColor !important; /* 关键：继承容器颜色 */
    stroke: none !important;
}
        /* [1] 物理中心锁定 */
        main.Main_wrap_2GRrG, [class*="Main_wrap"], [class*="Frame_main"] {
            display: flex !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }

        /* [2] 锁定主内容流宽度 960px */
        .Main_full_1dfQX, [class*="Main_full"], #homeWrap, .vue-recycle-scroller {
            width: 960px !important;
            max-width: 960px !important;
            margin: 0 auto !important;
            flex: none !important;
        }

        /* [3] 内容卡片样式 (20px圆角) */
        article, [class*="Feed_wrap"], [class*="Card_wrap"],
        [class*="_feed_gykin_"] .woo-panel-main,
        [class*="_empty_13iyx_"] {
            width: 960px !important;
            border-radius: 20px !important;
            border: 1px solid rgba(0,0,0,0.06) !important;
            margin-bottom: 16px !important;
            box-sizing: border-box !important;
        }
        /* [3.1] 发微博模块圆角样式 */
        [class*="_publishCard_gykin_"] {
            border-radius: 20px !important;
            display: ${showPublishCard ? "block" : "none"} !important;
        }

        /* --- 个人主页 (Profile) 深度定制 --- */

        /* 1. 强制隐藏个人主页左侧边栏 */
        [class*="Profile_wrap"] [class*="_side_1ubn9_"] {
            display: none !important;
        }

        /* 2. 个人主页头部模块宽度锁定 */
        [class*="_full_1l406_"] {
            width: 960px !important;
            max-width: 960px !important;
            margin: 0 auto !important;
            border-radius: 20px 20px 0 0 !important;
            overflow: hidden !important;
        }
/* [1] 针对个人主页 Tab 模块背景色的最终修复 */
[class*="_visable_r36s9_"] .woo-panel-main,
[class*="_visable_r36s9_"] [class*="_card_1v3kz_"],
[class*="_visable_r36s9_"] [class*="_wrap_6c8b7_"],
[class*="_visable_r36s9_"] .woo-tab-nav {
    background-color: var(--w-card-bg) !important;
    background-image: none !important;
    /* 适配边框颜色，防止深色模式下出现白边 */
    border-color: var(--w-main-border, rgba(128,128,128,0.15)) !important;
}
/* 1. 适配侧边栏背景：使用变量 + 自动回退方案防止透明 */
[class*="_side_1ubn9_"] [class*="_main_mmtyp_"],
[class*="_side_1ubn9_"] [class*="_inner_mmtyp_"],
[class*="_side_1ubn9_"] .woo-panel-main {
    /* 使用 light-dark 函数或变量回退，确保任何模式下都有实色底 */
    background-color: var(--w-card-bg, #ffffff) !important;
    color: var(--w-main-text, #333333) !important;
}

/* 2. 强制覆盖深色模式（针对部分变量加载失败的情况） */
/* 微博深色模式通常在 html 标签上有 .v-dark 类或 data-theme='dark' */
html[data-theme='dark'] [class*="_main_mmtyp_"],
html[data-theme='dark'] [class*="_inner_mmtyp_"],
.v-dark [class*="_main_mmtyp_"],
.v-dark [class*="_inner_mmtyp_"] {
    background-color: #161616 !important; /* 微博标准的深色卡片背景 */
    color: #ebebeb !important; /* 微博标准的深色文字颜色 */
}

/* 3. 移除可能导致冲突的灰色背景强制设定 */
[class*="_side_1ubn9_"].grayTheme {
    background-color: transparent !important;
}
/* [2] 修复文字颜色：确保在深色背景下文字为浅色 */
[class*="_visable_r36s9_"] [class*="_btn_1v3kz_"],
[class*="_visable_r36s9_"] .woo-tab-item-main {
    color: var(--w-main-text) !important;
}
/* 调整个人页面特定模块高度 */
.wbpro-screen-v2 {
    height: 60px !important;
}
/* [3] 强制深色模式硬编码覆盖 (针对变量加载延迟的情况) */
html[data-theme='dark'] [class*="_visable_r36s9_"] .woo-panel-main,
.v-dark [class*="_visable_r36s9_"] .woo-panel-main {
    background-color: #161616 !important; /* 强制深灰底 */
}

html[data-theme='dark'] [class*="_visable_r36s9_"] [class*="_btn_1v3kz_"],
.v-dark [class*="_visable_r36s9_"] [class*="_btn_1v3kz_"] {
    color: #ebebeb !important; /* 强制浅白字 */
}
        /* 修复 class="_main_137iq_" 偏下问题，使其与头部顶部对齐 */
        [class*="_main_137iq_"] {
            margin-top: -1px !important;
            padding-top: 0 !important;
            position: relative !important;
            top: 0 !important;
        }

        /* 3. 个人主页导航栏容器底部圆角化 */
        /* 针对包含 class="_visable_r36s9_" 的容器下的 panel 进行圆角处理 */
        [class*="_visable_r36s9_"] [class*="woo-panel-main"] {
            border-bottom-left-radius: 20px !important;
            border-bottom-right-radius: 20px !important;
            border-top: none !important;
            overflow: hidden !important;
            background-color: var(--w-card-bg, #fff) !important;
            box-shadow: none !important;
        }

        /* 确保内容区居中 */
        [class*="Profile_content"] {
            justify-content: center !important;
        }

        /* --- 侧边栏基础定制 (仅首页/信息流受控) --- */
        [class*="_side_1ubn9_"] {
            display: ${showSidebar ? "block" : "none"} !important;
            margin-right: 16px !important;
            padding: 0 !important;
            background: transparent !important;
            position: sticky !important;
            top: 12px !important;
            align-self: flex-start !important;
            height: fit-content !important;
            z-index: 100;
        }

        /* --- [5] 净化：屏蔽干扰模块 --- */
        [class*="_toolbarSpin_"],
        [class*="picture-viewer_topPlaceholder"],
        [class*="_emptyPic_"],
        [class*="_aria_pn2mr_"],
        [class*="_backTop_imrbt_"],
        [class*="Main_side"],
        [class*="Frame_side"],
        [class*="Links_box"],
        [class*="rightSide"],
        [class*="index_box"],
        [class*="Hot_box"],
        [class*="aside_"],
        /* 新增：屏蔽内容卡片上的特定模块 (如广告标签等) */
        [class*="_wrap_sssx9_"],
        .Main_side_i7Vti,
        .Search_senior_19eQR,
        [aria-label="首页导航"],
        [title="游戏"],
        a[href*="game.weibo.com"],
        [class*="Nav_game"],
        [aria-label="无障碍"],
        [class*="Aria_box_"],
        div[class*="BackTop_wrap"] {
            display: none !important;
        }
/* ==================================================
   MWCA 评论区稳定修复（只追加）
   ================================================== */

/* 1. 评论输入框：宽度 & 自动高度不炸 */
.wbpro-form textarea,
textarea#comment-textarea {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    resize: none !important;
    min-height: 24px !important;
    line-height: 24px !important;
}

/* 2. 评论工具栏整体横排 */
._mar1_1n75r_2 > .woo-box-flex {
    display: flex !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    gap: 8px !important;
}

/* 3. 表情 / 图片 图标区 */
._mar1_1n75r_2 ._iconbox2_1n75r_10 {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
}

/* 4. “同时转发”修复（外层 + 本体） */
._mar1_1n75r_2 > .woo-box-flex > .woo-box-item-flex {
    min-width: 0 !important;
    display: flex !important;
    align-items: center !important;
    flex: 0 0 auto !important;
}

._check_1n75r_18 {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    line-height: 1 !important;
}

._check_1n75r_18 .woo-checkbox-text {
    white-space: nowrap !important;
    writing-mode: horizontal-tb !important;
}

/* 5. 隐藏评论字数 */
._mar1_1n75r_2 ._count_1n75r_33 {
    display: none !important;
}

/* 6. 评论按钮靠右 */
._mar1_1n75r_2 button.woo-button-main {
    margin-left: auto !important;
    flex-shrink: 0 !important;
}

        /* ... 其余原有 CSS 保持不变 ... */
        [class*="_side_1ubn9_"] [class*="_main_mmtyp_"],
        [class*="_side_1ubn9_"] .woo-panel-main,
        [class*="_side_1ubn9_"] [class*="_inner_mmtyp_"] {
            height: auto !important;
            padding: 16px 0 !important;
            border-radius: 20px !important;
            overflow: hidden !important;
            border: none !important;
            box-shadow: none !important;
            background-color: var(--w-card-bg, #fff) !important;
        }
        [class*="_main_118ye_"] { padding-left: 32px !important; justify-content: flex-start !important; background-color: transparent !important; }
        [class*="_side_1ubn9_"] i.woo-font, [class*="_side_1ubn9_"] svg[class*="woo-tip-icon"] { display: none !important; }
        h2[class*="_title_mmtyp_"], [class*="_side_1ubn9_"] i[class*="woo-font--nav"] { display: none !important; }
        [class*="_side_1ubn9_"] button.woo-button-main { border: none !important; box-shadow: none !important; background: transparent !important; }
        [class*="_side_1ubn9_"] h3[class*="_title_r9kj3_"] { margin-left: 32px !important; padding-left: 0 !important; }
        [class*="detail_wbtext_"], [class*="wbpro-feed-ogText"] { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important; font-weight: 500 !important; line-height: 1.6 !important; }
        [class*="_wrap_1jk00_"], [class*="_showPictureViewer_"] { background: transparent !important; width: 860px !important; margin-left: -80px !important; padding: 10px 0 10px 80px !important; height: auto !important; }
        [class*="_imgWrap_1jk00_"], [class*="_pic_1jk00_"] { width: 860px !important; height: auto !important; max-height: none !important; object-fit: initial !important; display: block !important; }
        #mwca-custom-backtop { position: fixed !important; bottom: 50px !important; right: 50px !important; width: 44px !important; height: 44px !important; border-radius: 50% !important; background-color: #ffffff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; display: none; align-items: center !important; justify-content: center !important; cursor: pointer !important; z-index: 999999 !important; transition: opacity 0.3s; }
        #mwca-custom-backtop svg { width: 13px !important; height: 13px !important; fill: #666 !important; opacity: 0.6 !important; }
    `);

    // ======= 3. JS 功能模块 =======
    const LOGO_SVG = '<svg viewBox="0 0 100 100" style="height: 30px; width: 90px;"><g><path fill="#E6162D" d="M73.615,48.447c-1.314-0.399-2.216-0.657-1.533-2.383c5.033-13.409-7.597-15.071-20.803-9.416 c0,0-2.989,1.301-2.216-1.056c1.456-4.702,1.237-8.63-1.03-10.91c-5.152-5.165-18.871,0.193-30.632,11.954 C8.603,45.433,3.489,54.771,3.489,62.848c0,15.432,19.799,24.822,39.159,24.822c25.389,0,42.277-14.749,42.277-26.458 C84.938,54.127,78.974,50.108,73.615,48.447z"></path><path fill="#F1F1F1" d="M42.713,82.131C27.255,83.664,13.91,76.67,12.906,66.532c-1.058-24.473,52.225-29.73,55.956-5.539 C69.88,71.144,58.158,80.611,42.713,82.131z"></path><path fill="#FF9933" d="M90.144,20.486c-6.132-6.801-15.174-9.39-23.521-7.613c-1.932,0.412-3.156,2.319-2.744,4.238 c0.412,1.932,2.306,3.156,4.238,2.744c13.098-2.893,24.605,9.876,20.391,22.594c-1.338,4.509,5.24,6.64,6.801,2.203 C97.931,36.543,96.283,27.28,90.144,20.486z"></path><path fill="#FF9933" d="M79.412,42.69c1.623,0.515,3.349-0.361,3.877-1.984c2.94-8.629-5.084-17.528-13.964-15.47 c-1.662,0.348-2.718,1.997-2.37,3.658c0.361,1.662,1.997,2.718,3.645,2.357c1.984-0.425,4.148,0.193,5.603,1.803 c1.456,1.623,1.855,3.826,1.224,5.758C76.913,40.423,77.789,42.162,79.412,42.69z"></path><path d="M44.246,53.2c-7.355-1.919-15.664,1.752-18.858,8.231c-3.259,6.608-0.103,13.95,7.317,16.346 c7.703,2.486,16.772-1.327,19.927-8.45C55.749,62.346,51.859,55.171,44.246,53.2z M38.63,70.075 c-3.249,5.211-12.149,2.467-8.695-3.852C33.164,61.1,41.972,63.757,38.63,70.075z M43.563,63.763 c-1.113,2.019-4.608,1.073-3.349-1.34C41.332,60.439,44.749,61.343,43.563,63.763z"></path></g></svg>';
    const SETTING_SVG = '<svg viewBox="0 0 512 512" style="width: 18px; height: 18px;"><path d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252 c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366 c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586 c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363 c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005 c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675 c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366 c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.597,5.598-13.36,8.477-21.226,7.552 l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805 c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303 c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799 c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364 c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005 c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007 c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366 c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799 c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z"/></svg>';

    function injectNewBackTop() {
        if (document.getElementById('mwca-custom-backtop')) return;
        const btn = document.createElement('div');
        btn.id = 'mwca-custom-backtop';
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5.5L20 19.5H4L12 5.5Z"></path></svg>';
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        }, { passive: true });
    }

    function fixEverything() {
        const logo = document.querySelector('a[aria-label="Weibo"]');
        if (logo && (!logo.dataset.done || logo.querySelectorAll('path').length < 5)) {
            logo.innerHTML = LOGO_SVG;
            logo.dataset.done = "true";
        }
        document.querySelectorAll('.woo-input-main').forEach(input => { if (input.placeholder) input.placeholder = ''; });
        const setBtn = document.querySelector('button[title="设置"], button[aria-label="设置"], [class*="_wrap_pn2mr_"]:not([class*="_aria_"])');
        if (setBtn && !setBtn.dataset.done) {
            setBtn.innerHTML = SETTING_SVG;
            setBtn.dataset.done = "true";
        }
        document.querySelectorAll('img[src*="sinaimg.cn"]').forEach(img => {
            if (img.src.includes('/face/') || img.dataset.processed) return;
            const pattern = /\/(mw690|mw1024|mw2000|orj360|orj480|thumbnail)\//;
            if (pattern.test(img.src)) { img.src = img.src.replace(pattern, '/large/'); img.dataset.processed = "true"; }
        });
// 替换评论图标为新SVG（修正坐标+适配尺寸）
document.querySelectorAll('.woo-font.woo-font--comment._commentIcon_198pe_122').forEach(iconEl => {
    if (iconEl.dataset.svgReplaced) return; // 避免重复替换

    // 创建新SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.fill = 'currentColor'; // 继承原有颜色
    svg.style.flex = 'none';

    // 修正SVG路径（原坐标translate(-100,-255)，还原为0-32视口）
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M16,26 C14.832,26 13.704,25.864 12.62,25.633 L7.912,28.463 L7.975,23.824 C4.366,21.654 2,18.066 2,14 C2,7.373 8.268,2 16,2 C23.732,2 30,7.373 30,14 C30,20.628 23.732,26 16,26 L16,26 Z M16,0 C7.164,0 0,6.269 0,14 C0,18.419 2.345,22.354 6,24.919 L6,32 L13.009,27.747 C13.979,27.907 14.977,28 16,28 C24.836,28 32,21.732 32,14 C32,6.269 24.836,0 16,0 L16,0 Z');
    path.style.fill = 'currentColor';
    svg.appendChild(path);

    // 替换图标内容
    iconEl.innerHTML = '';
    iconEl.appendChild(svg);
    iconEl.dataset.svgReplaced = 'true';
});
        injectNewBackTop();
    }

    const observer = new MutationObserver(fixEverything);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('DOMContentLoaded', fixEverything);
})();