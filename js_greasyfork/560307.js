// ==UserScript==
// @name         微信读书网页版 - 极致纯净阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  完全隐藏微信读书网页版的所有边距和间距，只保留核心阅读内容，减小行间距
// @author       YourName
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560307/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%9E%81%E8%87%B4%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/560307/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%9E%81%E8%87%B4%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        // 给一些时间让页面完全渲染
        setTimeout(applyStyles, 1000);
    });

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        applyStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function applyStyles() {
        // 创建样式
        const style = document.createElement('style');
        style.id = 'weread-ultra-clean-style';
        style.textContent = `
            /* 隐藏顶部导航栏 */
            .readerTopBar, .readerControls_header {
                display: none !important;
            }

            /* 隐藏底部工具栏 */
            .readerFooter, .readerControls_footer {
                display: none !important;
            }

            /* 隐藏左侧目录栏 */
            .readerCatalog, .readerCatalogPanel {
                display: none !important;
            }

            /* 隐藏右侧注释/想法栏 */
            .readerControls, .readerNotePanel, .readerNoteList {
                display: none !important;
            }

            /* 隐藏阅读器控制按钮 */
            .readerControls_button, .readerControls_item, .readerTopBar_item {
                display: none !important;
            }

            /* 最大化阅读区域 - 完全移除所有边距 */
            .app_content, .reader_content {
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            /* 阅读容器 - 完全移除边距 */
            .readerContainer, .reader_container {
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            /* 调整阅读区域 - 完全移除边距 */
            .readerContent, .wr_page {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                left: 0 !important;
                right: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
            }

            /* 移除正文容器的所有边距和内边距 */
            .wr_white, .wr_pageContent, .readerChapterContent {
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
            }

            /* 隐藏广告和推广 */
            .banner, .ad, .promotion, .recommend {
                display: none !important;
            }

            /* 隐藏VIP提示等 */
            .vipCard, .readerTopBar_vipCard, .readerTopBar_right {
                display: none !important;
            }

            /* 隐藏章节进度条 */
            .readerChapterProgress {
                display: none !important;
            }

            /* 隐藏分享按钮等 */
            .readerTopBar_share, .readerTopBar_more, .readerTopBar_left {
                display: none !important;
            }

            /* 隐藏可能存在的浮动元素 */
            .floating, .popup, .modal, .dialog {
                display: none !important;
            }

            /* 隐藏左侧可能存在的菜单按钮 */
            [class*="sidebar"], [class*="menu"], [class*="nav"] {
                display: none !important;
            }

            /* 正文文本样式 - 减小行间距 */
            .wr_white p, .wr_pageContent p, .readerChapterContent p {
                line-height: 1.3 !important;  /* 减小行间距 */
                margin: 0 !important;         /* 移除段落间距 */
                padding: 0 !important;        /* 移除内边距 */
            }

            /* 标题样式 - 减小间距 */
            .wr_white h1, .wr_white h2, .wr_white h3,
            .wr_pageContent h1, .wr_pageContent h2, .wr_pageContent h3,
            .readerChapterContent h1, .readerChapterContent h2, .readerChapterContent h3 {
                line-height: 1.2 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 列表项样式 - 减小间距 */
            .wr_white li, .wr_pageContent li, .readerChapterContent li {
                line-height: 1.3 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 整体页面调整 - 完全移除边距 */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
                width: 100% !important;
                height: 100% !important;
            }

            /* 正文内容区 - 完全填充 */
            .readerChapterContent {
                line-height: 1.3 !important;  /* 全局行间距 */
            }

            /* 阅读器主体 */
            .reader_main {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            /* 章节内容 */
            .chapterItem_content {
                line-height: 1.3 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 移除所有可能的内边距 */
            * {
                box-sizing: border-box;
            }

            /* 强制移除所有容器的边距 */
            div, section, article, main, header, footer {
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 特别处理阅读区域的容器 */
            .readerContent > div, .wr_page > div {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            /* 确保没有滚动条干扰 */
            ::-webkit-scrollbar {
                display: none !important;
            }

            /* 阅读区域绝对定位填充 */
            .reader_content {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
            }

            /* 文本对齐和字体优化 */
            .readerChapterContent {
                text-align: justify !important;
                word-break: break-all !important;
                hyphens: auto !important;
            }
            #routerView > div > div.wr_horizontalReader_app_content > div.wr_various_font_provider_wrapper > div,
            /*强制两个元素的高度为100%，撑满空间。*/
#routerView > div > div.wr_horizontalReader_app_content > div.wr_various_font_provider_wrapper > div > div { height: 100% !important; min-height: 100% !important; }
.renderTarget_pager button {
    display: none !important;
}
/* 隐藏您指定的浮动书签/角标工具栏 */
#routerView > div > div.wr_horizontalReader_app_content > div.wr_various_font_provider_wrapper > div > div > div.renderTargetContainer > div.wr_reader_float_corner_bookmark_wrapper > div {
    display: none !important;
}
/* 隐藏特定位置的子元素 */
#routerView > div > div.wr_horizontalReader_app_content > div.wr_various_font_provider_wrapper > div > div > div.renderTargetContainer > div:nth-child(5) > div:nth-child(3) {
    display: none !important;
}
/* 基础：容器样式（单双页通用） */
.wr_canvasContainer {
    position: relative !important;
    width: 97% !important;          /* 控制整体阅读区宽度，调整左右外边距 */
   /*  max-width: 1600px !important;   可选：防止在大屏幕上过宽 */
    margin: 0 auto !important;      /* 居中 */
    padding: 0 !important;
}

/* 基础：Canvas通用样式（单双页通用） */
.wr_canvasContainer canvas {
    position: absolute !important;
    top: 0 !important;
    height: auto !important;        /* 或根据需求改为 100% */
    margin: 0 !important;
}

/* === 双页模式专用规则（当有2个canvas时）=== */
/* 左边的canvas：仅当它不是唯一子元素时生效（即存在兄弟元素） */
.wr_canvasContainer canvas:first-child:not(:last-child) {
    left: 0 !important;
    width: calc(50% - 8px) !important; /* 各占一半，并留出间隙 */
}
/* 右边的canvas：仅当它不是唯一子元素时生效 */
.wr_canvasContainer canvas:last-child:not(:first-child) {
    right: 0 !important;
    width: calc(50% - 8px) !important; /* 各占一半，并留出间隙 */
}

/* === 【修正】单页模式专用规则 - 提高优先级和强度 === */
.wr_canvasContainer canvas:only-child {
    /* 关键：彻底重置定位和尺寸，覆盖内联样式 */
    position: relative !important; /* 改为相对定位，使其受父容器流式布局约束 */
    left: 0 !important;
    right: auto !important; /* 清除可能的右定位 */
    top: 0 !important;
    width: 100% !important; /* 宽度撑满父容器 */
    max-width: 100% !important;
    height: auto !important;
    margin: 0 auto !important; /* 水平居中 */
    display: block !important;
    /* 以下属性确保彻底清除内联样式的影响 */
    min-width: 0 !important;
    box-sizing: border-box !important;
}
  `;

        // 移除旧的样式（如果存在）
        const oldStyle = document.getElementById('weread-ultra-clean-style');
        if (oldStyle) {
            oldStyle.remove();
        }

        // 添加新样式
        document.head.appendChild(style);

        // 额外调整：设置阅读区域全屏显示
        const contentArea = document.querySelector('.readerContent, .wr_pageContent, .readerChapterContent');
        if (contentArea) {
            contentArea.style.width = '100%';
            contentArea.style.maxWidth = 'none';
            contentArea.style.padding = '0';
            contentArea.style.margin = '0';
            contentArea.style.left = '0';
            contentArea.style.right = '0';
        }

        // 强制移除所有可能限制宽度的容器
        const containers = document.querySelectorAll('div');
        containers.forEach(container => {
            // 如果是阅读相关容器，移除所有边距
            if (container.className.includes('reader') ||
                container.className.includes('wr_') ||
                container.className.includes('chapter') ||
                container.className.includes('content')) {
                container.style.margin = '0';
                container.style.padding = '0';
                container.style.maxWidth = 'none';
                container.style.width = '100%';
            }
        });

        // 特别处理正文段落
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.margin = '0';
            p.style.padding = '0';
            p.style.lineHeight = '1.3';
        });

        // 处理标题
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(h => {
            h.style.margin = '0';
            h.style.padding = '0';
            h.style.lineHeight = '1.2';
        });
    }

    // 初始执行
    applyStyles();

    // 监听窗口大小变化，重新调整布局
    window.addEventListener('resize', applyStyles);

    console.log('微信读书极致纯净阅读模式已启用');
})();