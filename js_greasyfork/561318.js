// ==UserScript==
// @name         Linux.do 美化脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Linux.do 界面美化：深色玻璃拟态、圆角卡片、宽屏布局、自动背景适配、去杂线、详情页美化
// @author       Gemini Agent
// @license              MIT
// @match        https://linux.do/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561318/Linuxdo%20%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561318/Linuxdo%20%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义样式常量
    const css = `
        /* ==========================================================================
           1. 核心基础 (Core Base)
           ========================================================================== */
        /* 强制背景图 */
        body {
            background: url('https://img.qlqqs.com/random') no-repeat center center fixed !important;
            background-size: cover !important;
            transition: background 0.3s ease;
        }

        /* 全局深色遮罩 */
        body::before {
            content: ""; position: fixed; top:0; left:0; right:0; bottom:0;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1; pointer-events: none;
        }

        /* 布局容器 */
        .wrap { max-width: 98% !important; }

        /* 隐藏 Discourse 原生杂项 */
        .topic-list-item-separator,
        .sidebar-wrapper::after,
        .sidebar-wrapper::before,
        .topic-list-header,
        .topic-list thead {
            display: none !important;
        }

        /* 透明化 */
        html, #main-outlet, .topic-list, .sidebar-wrapper, .topic-list-body, .d-header {
            background-color: transparent !important;
        }

        /* 去杂线 */
        hr { display: none !important; border: none !important; }

        /* ==========================================================================
           2. 布局通用调整
           ========================================================================== */
        /* 公告栏 */
        #banner, .alert.alert-info {
            text-align: center !important;
            margin: 20px auto !important;
            max-width: 60% !important;
            border-radius: 12px !important;
            backdrop-filter: blur(15px) !important;
           background: rgb(30 30 30 / 34%) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #eee !important;
        }

        /* 导航控制 */
        .list-controls {
            display: flex !important;
            justify-content: center !important;
            background: transparent !important;
            margin-bottom: 20px !important;
        }
        .list-controls .container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: auto !important;
        }

        /* 帖子列表卡片 */
        .topic-list-body tr {
            display: table-row !important;
            border-bottom: 8px solid transparent !important;
            background-clip: padding-box !important;
            backdrop-filter: blur(10px) !important;
            transition: transform 0.2s ease;
            background: rgba(40, 40, 40, 0.75) !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
        }

        .topic-list, .topic-list-body {
            border-top: none !important;
            border-bottom: none !important;
        }

        .topic-list-body tr:hover {
            transform: translateY(-2px);
        }

        .topic-list-body tr td:first-child {
            border-top-left-radius: 12px !important;
            border-bottom-left-radius: 12px !important;
        }
        .topic-list-body tr td:last-child {
            border-top-right-radius: 12px !important;
            border-bottom-right-radius: 12px !important;
        }

        .topic-status-info{
            margin-left:20% !important;
        }

        /* ==========================================================================
           3. 组件样式调整
           ========================================================================== */
        .d-header {
            background: rgba(20, 20, 20, 0.7) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(15px) !important;
        }

        /* 侧边栏清理 */
        .sidebar-wrapper {
            background: rgba(30, 30, 30, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            box-shadow: none !important;
            margin-left: 40px !important;
            min-width: 250px !important;
            width: 280px !important;
            flex-basis: 280px !important;
        }
        .sidebar-wrapper .sidebar-section-wrapper,
        .sidebar-wrapper .sidebar-section-header,
        .sidebar-wrapper .sidebar-more-section,
        .sidebar-wrapper .sidebar-footer-wrapper,
        .sidebar-wrapper .sidebar-section {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
        }
        .sidebar-wrapper .sidebar-section-header::before,
        .sidebar-wrapper .sidebar-section-header::after {
            display: none !important;
        }

        .nav-pills {
            background: rgba(0,0,0,0.5) !important;
            border: 1px solid rgba(255,255,255,0.05) !important;
        }
        .select-kit .select-kit-header {
            background: rgba(40, 40, 40, 0.7) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }

        /* ==========================================================================
           4. 帖子详情页美化 (Topic Detail)
           ========================================================================== */

        #main-outlet {
            padding-top: 20px !important;
            max-width: 98% !important;

        }

        /* 强制整个帖子区域全宽 */
        .container.posts {
            max-width: 100% !important;
            width: 100% !important;
            grid-template-columns: 1fr !important;
        }
        .row {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 标题居中 */
        #topic-title {
            text-align: center !important;
            margin-bottom: 30px !important;
            padding-right: 3% !important;
        }
        #topic-title .title-wrapper {
            justify-content: center !important;
            width: 100% !important;
        }





        aside.onebox {
              box-shadow: 0 0 0 0px rgb(0 0 0 / 0%), 0 0 0 0px rgb(44 44 44 / 0%) !important;
              background: #22222263 !important;
        }
        .badge-wrapper.bullet, .discourse-tag {
            background: rgba(50, 50, 50, 0.6) !important;
            backdrop-filter: blur(8px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 6px !important;
            padding: 4px 10px !important;
            transition: all 0.2s ease !important;
        }
        .badge-wrapper.bullet:hover, .discourse-tag:hover {
            background: rgba(70, 70, 70, 0.8) !important;
            transform: translateY(-1px);
        }
        .badge-category-bg, .badge-category-parent-bg {
            opacity: 0.8 !important;
        }


        /* 单楼层卡片化 */
        .topic-post {
            margin-bottom: 20px !important;
            width: 90% !important;
            margin-left: 10% !important;
            margin-right: auto !important;
        }

        .presence-users{
          margin-left: 10% !important;
        }

        .topic-status-info, .topic-timer-info{
          border-top: 0px solid var(--content-border-color) !important
        }

        .topic-post article {
            border: none !important;
            background: rgba(40, 40, 40, 0.75) !important;
            border-radius: 12px !important;
            padding: 15px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
            color: #ddd !important;
            max-width: 100% !important;
        }

        .topic-post.border-bottom { border-bottom: none !important; }
        .topic-post .row { border-bottom: none !important; }

        /* 内容拓宽 */
        .post-stream { width: 100% !important; max-width: none !important; }
        .topic-body {
            width: calc(100% - 70px) !important;
            max-width: none !important;
            padding-right: 0px !important;
            float: none !important;
        }
        .topic-body .cooked {
            max-width: 100% !important;
            width: 100% !important;
            padding-right: 0px !important;
        }

        /* 图片自适应 */
        .topic-body .cooked img:not(.emoji) {
            max-width: 100% !important;
            height: auto !important;
        }
        .topic-body .cooked .lightbox-wrapper {
            width: auto !important;
            max-width: 100% !important;
        }

        /* 引用块美化 */
        aside.quote {
            background: rgba(0, 0, 0, 0.3) !important;
            border-left: 4px solid #aaa !important;
            border-radius: 8px !important;
        }

        /* 代码块美化 */
        pre code {
            background: rgba(0, 0, 0, 0.5) !important;
            border-radius: 8px !important;
        }

        .more-topics__container{
       max-width: none !important;
        }

        .more-topics__container .nav{
            position: relative !important;
                margin-block: 8px !important;
        }
        .nav-stacked, .nav-pills{
            margin-left: 35px !important;
        }
      .more-topics__browse-more {
    text-align: center;
}
.dismiss-container-bottom {
    display: flex;
    justify-content: flex-end;
}


        /* 底部建议话题 */
        #suggested-topics {

        }
        #suggested-topics .topic-list-body tr {
            background: rgba(50, 50, 50, 0.5) !important;
        }

        #topic-title h1 a {
            color: #fff !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .topic-statuses{
            float: none !important;
        }

        .topic-avatar, .topic-body {
            border-top: none !important;
        }
        .topic-map {
           background: rgba(0,0,0,0.4) !important;
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 8px !important;
        }
        .topic-map section {
            border-top: 1px solid rgba(255,255,255,0.05) !important;
        }

        /* ==========================================================================
           5. 导航栏布局优化
           ========================================================================== */

        /* 帖子列表区域往右移动（缩小左边宽度） */
        .topic-list {
            margin-left: 30px !important;
        }

        /* 类别和标签下拉框高度调小 */
        .list-controls .select-kit .select-kit-header {
            padding: 4px 10px !important;
            min-height: auto !important;
        }
        .list-controls .select-kit-header .selected-name {
            padding: 2px 0 !important;
        }

       .topic-map.--bottom {
          max-width: none !important;
           margin-left: 10% !important;
         }

        .post__topic-map.topic-map.--op {
    max-width: none !important;
    width: 100% !important;
}


.badge-category__wrapper {
  backdrop-filter: blur(2px) saturate(160%);

border-radius: 12px;                   /* 可按你论坛整体圆角风格调整 */
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 4px 8px;                      /* 保持徽章紧凑 */
  transition: background 0.25s ease;
}



/* 悬停时稍微亮一点，保持高级感 */
.badge-category__wrapper:hover {
background: rgb(0 0 0 / 50%);
}


 .small-action.topic-post-visited{
           margin-left: 20% !important;

        }





      .gap {
          display: flex !important;
          justify-content: center !important;
           align-items: center !important;
            width: 100% !important;
           text-align: center !important;
         }

         body:not(.archetype-private_message) .topic-map{
           /* max-width: none !important;
            margin-left: 10% !important;
            margin-right: 10% !important;*/
         }



         #topic-footer-buttons {
           margin: 0 auto;
           width: fit-content;
         }




        /* 整个导航区域布局 - 让所有元素在同一行 */
        .list-controls .container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            flex-wrap: nowrap !important;
            gap: 10px !important;
        }

        /* 筛选器区域 */
        .list-controls .container > ul:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            margin: 0 !important;
        }

        /* 导航标签列表（最新、新、未读...书签） */
        .list-controls .nav-pills {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
            margin: 0 !important;
        }

        .navigation-controls {
          flex-wrap: nowrap !important;
        }
        /* 按钮区域（忽略新话题、新建话题）- 同一行 */
        .list-controls .navigation-controls {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
            margin: 0 !important;
        }

        /* 新建话题按钮 - 往上移一点 
        .list-controls .navigation-controls button.new-topic,
        .list-controls .navigation-controls button:last-child {
           /* transform: translateY(-25px) !important;*/
        }*/

        /* 忽略新话题按钮 - 往下移一点 */
        .list-controls .navigation-controls button:first-child:not(.new-topic) {
            transform: translateY(25px) !important;
        }



        /* 确保整个导航容器是flex布局 */
        .navigation-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-wrap: nowrap !important;
        }

        .navigation-container.is-active {
           background: #00000096  !important;
           padding-top: 0px !important;
       }

        /* 查看新话题提示 - 一行显示 */
        .show-more {
            display: inline-flex !important;
            align-items: center !important;
            white-space: nowrap !important;
            padding: 6px 16px !important;
            border-radius: 20px !important;
        }
        .show-more .alert-text {
            display: inline !important;
            white-space: nowrap !important;
        }
    `;

    // 注入 CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    console.log('Linux.do Glassmorphism (Ultimate v1.5) Loaded.');
})();