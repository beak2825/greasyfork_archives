// ==UserScript==
// @name         ESJZone 样式优化
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将小说阅读页面的样式应用到阅读页面，添加翻页功能（适配手机页面）
// @author       deepseek
// @match        https://www.esjzone.cc/forum/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561420/ESJZone%20%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561420/ESJZone%20%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加第一个网页的阅读样式
    GM_addStyle(`
        /* 主容器样式 */
        .offcanvas-wrapper {
            background: rgb(237, 231, 218) url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAACVBMVEX28ef48+n69esoK7jYAAAB4UlEQVQozw2OsW4bQQxEhwLXkDrysGdEqRRgVShfQQq8wOr2jD0jSpXCLvwXbtKfADlFqgSwC/9ljqweZgYzQFnb/QGepYhA9jzmTc1WaSEtQpbFgjWATI00ZZtIckXx8q2Oe5yEByBy+RHOTcM+VVTadULsvxvRC/q8WTwgcWGD+Mnaqa0oy2gw2pKFzK+PzEsus5hP9AHojKslVynLlioVTBEN8cjDNnZoR1uMGViZAAN47HxMtEkGUE9b8HWzkqNX5Lpk0yVziAJOs46rK1lG/xNuXLjz95fSDoJE5IqG23MAYPtWoeWPvfVtIV/Ng9oH3W0gGMPIOqd4MK4QZ55dV61gOb8Zxp7I9qayaGxp6Q91cmC0ZRdBwEQVHWzSAanlZwVWc9yljeTCeaHjBVvlPSLeyeBUT2rPdJegQI103jVS3uYkyIx1il6mslMDedZuOkwzolsagvPuQAfp7cYg7k9V1NOxfq64PNSvMdwONV4VYEmqlbpZy5OAakRKkjPnL4CBv5/OZRgoWHBmNbxB0LgB1I4vXFj93UoF2/0TPEsWwV9EhbIiTPqYoTHYoMn3enTDjmrFeDTIzaL1bUC/PBIMuF+vSSYSaxoVt90EO3Gu1zrMuMRGUk7Ffv3L+A131Gsb/yBoIgAAAABJRU5ErkJggg==") !important;
        }

        /* 论坛内容区域样式 */
        .forum-content {
            background: rgb(237, 231, 218) url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAACVBMVEX28ef48+n69esoK7jYAAAB4UlEQVQozw2OsW4bQQxEhwLXkDrysGdEqRRgVShfQQq8wOr2jD0jSpXCLvwXbtKfADlFqgSwC/9ljqweZgYzQFnb/QGepYhA9jzmTc1WaSEtQpbFgjWATI00ZZtIckXx8q2Oe5yEByBy+RHOTcM+VVTadULsvxvRC/q8WTwgcWGD+Mnaqa0oy2gw2pKFzK+PzEsus5hP9AHojKslVynLlioVTBEN8cjDNnZoR1uMGViZAAN47HxMtEkGUE9b8HWzkqNX5Lpk0yVziAJOs46rK1lG/xNuXLjz95fSDoJE5IqG23MAYPtWoeWPvfVtIV/Ng9oH3W0gGMPIOqd4MK4QZ55dV61gOb8Zxp7I9qayaGxp6Q91cmC0ZRdBwEQVHWzSAanlZwVWc9yljeTCeaHjBVvlPSLeyeBUT2rPdJegQI103jVS3uYkyIx1il6mslMDedZuOkwzolsagvPuQAfp7cYg7k9V1NOxfq64PNSvMdwONV4VYEmqlbpZy5OAakRKkjPnL4CBv5/OZRgoWHBmNbxB0LgB1I4vXFj93UoF2/0TPEsWwV9EhbIiTPqYoTHYoMn3enTDjmrFeDTIzaL1bUC/PBIMuF+vSSYSaxoVt90EO3Gu1zrMuMRGUk7Ffv3L+A131Gsb/yBoIgAAAABJRU5ErkJggg==") !important;
            width: 800px !important;
            max-width: 100% !important;
            margin: 20px auto !important;
            padding: 40px !important;
            border-radius: 5px !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.1) !important;
            line-height: 1.8 !important;
            color: #333 !important;
            position: relative;
        }

        /* 标题样式 */
        .forum-content h2 {
            text-align: center !important;
            font-size: 24px !important;
            margin-bottom: 30px !important;
            padding-bottom: 15px !important;
            border-bottom: 1px solid rgba(0,0,0,0.1) !important;
            font-weight: bold !important;
        }

        /* 导航按钮样式 */
        .entry-navigation {
            background: rgb(237, 231, 218) !important;
            padding: 15px !important;
            border-radius: 5px !important;
            display: flex !important;
            justify-content: space-between !important;
            border-top: 1px solid #82828200;
            border-bottom: 1px solid #82828200;
        }
        .navbar {
            background-color: rgb(237, 231, 218) !important;
            border-bottom: 1px solid #828282;
        }
        .toolbar .search, .toolbar .account, .toolbar .cart {
            border: 1px solid #828282;
        }
        .tag {
            border: 1px solid #828282;
        }
        .widget-title {
            border-bottom: 1px solid #828282;
        }
        .btn-outline-secondary {
            border-color: #828282;
        }

        /* 工具条样式 */
        .toolbar, #mycolor-0 {
            background: rgb(237, 231, 218) !important;
        }
        .page-title {
            background-color: rgba(251, 239, 212, 0.41) !important;
            border-bottom: 1px solid #828282;
        }

        /* 评论区域样式 */
        .btn-secondary {
            background-color: rgb(237, 231, 218) !important;
            border-color: #828282;
        }
        .fr-toolbar {
            background: rgb(237, 231, 218) !important;
            border: 1px solid #828282;
        }
        .pagination > li:first-child > a, .pagination > li:first-child > span {
            border-radius: 0;
        }
        .fr-box.fr-basic .fr-wrapper {
            background: rgb(237, 231, 218) !important;
            border: 1px solid #828282;
        }
        .second-toolbar {
            background: rgb(237, 231, 218) !important;
            border-color: transparent #828282 #828282 #828282;
        }
        .fr-toolbar .fr-newline {
            background: #828282;
        }
        .pagination > li > a, .pagination > li > span {
            background-color: rgb(237, 231, 218) !important;
            border: 1px solid #828282;
        }
        .pagination > .active > a, .pagination > .active > span, .pagination > .active > a:hover, .pagination > .active > span:hover, .pagination > .active > a:focus, .pagination > .active > span:focus {
            color: #3c7fb8;
        }
        .pagination > .disabled > span, .pagination > .disabled > span:hover, .pagination > .disabled > span:focus, .pagination > .disabled > a, .pagination > .disabled > a:hover, .pagination > .disabled > a:focus {
            border-color: #828282;
        }
        .comment .comment-body {
            background-color: rgb(237, 231, 218) !important;
            border: 1px solid #828282;
        }
        .comment .comment-header {
            border-radius: 5px !important;
            background-color: #a69b8114;
        }
        .comment .comment-body::after, .comment .comment-body::before {
            border: 0;
        }

        /* 页面宽度调整 */
        .container {
            max-width: 1200px !important;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
            .forum-content {
                width: 95% !important;
                padding: 20px !important;
                margin: 10px auto !important;
            }

            .forum-content p {
                font-size: 16px !important;
            }
        }
    `);

    // 初始化函数
    const init = () => {
        console.log('ESJZone 阅读样式优化脚本已加载');

        // 等待页面加载完成后调整布局
        setTimeout(() => {
            // 将论坛内容区域居中对齐
            const forumContent = document.querySelector('.forum-content');
            if (forumContent) {
                forumContent.style.margin = '20px auto !important';
            }
        }, 100);
    };

    // 滚动翻页
    // 滚动翻页按钮的样式
    const buttonStyles = `
        .scroll-page-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            right: 16px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: rgba(0,0,0,0.3) !important;
            color: #fff !important;
            font-size: 20px;
            z-index: 2000;
            text-align: center;
            text-decoration: none !important;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            border: none !important;
            outline: none !important;
        }

        .scroll-page-btn:hover,
        .scroll-page-btn:active,
        .scroll-page-btn:visited,
        .scroll-page-btn:focus {
            background-color: rgba(0,0,0,0.3) !important;
            color: #fff !important;
            text-decoration: none !important;
        }

        .scroll-page-btn.down {
            bottom: 100px;
        }
        .scroll-page-btn.up {
            bottom: 160px; /* 在向下按钮的上方 */
        }
    `;

    // 注入CSS样式
    const styleElement = document.createElement('style');
    styleElement.textContent = buttonStyles;
    document.head.appendChild(styleElement);

    // 翻页滚动函数
    function pageScroll(direction) {
        const pageHeight = window.innerHeight * 0.9;
        window.scrollBy({
            top: direction * pageHeight,
            behavior: 'smooth'
        });
    }

    // 除页面上原有的按钮
    function removeOriginalButtons() {
        // 查找并删除 "滚动到底部" 按钮
        const originalEndBtn = document.querySelector('.scroll-to-end-btn');
        if (originalEndBtn) {
            originalEndBtn.remove();
        }

        // 查找并删除 "滚动到顶部" 按钮
        const originalTopBtn = document.querySelector('.scroll-to-top-btn');
        if (originalTopBtn) {
            originalTopBtn.remove();
        }
    }

    // 创建并添加脚本的按钮
    function createScrollButtons() {
        // 创建向上翻页按钮
        const upBtn = document.createElement('a');
        upBtn.className = 'scroll-page-btn up';
        upBtn.innerHTML = '<i class="icon-arrow-up"></i>';
        upBtn.title = '向上翻页';

        // 创建向下翻页按钮
        const downBtn = document.createElement('a');
        downBtn.className = 'scroll-page-btn down';
        downBtn.innerHTML = '<i class="icon-arrow-down"></i>';
        downBtn.title = '向下翻页';

        // 为按钮绑定点击事件
        upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pageScroll(-1);
        });

        downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pageScroll(1);
        });

        // 将按钮添加到页面
        document.body.appendChild(upBtn);
        document.body.appendChild(downBtn);
    }

    // 添加键盘控制
    function setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                pageScroll(1);
            }
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                pageScroll(-1);
            }
        });
    }

    // 当页面加载完成后执行设置
    window.addEventListener('load', () => {
        // 删除原始按钮
        removeOriginalButtons();
        // 创建新按钮
        createScrollButtons();
        // 设置键盘控制
        setupKeyboardControls();
    });

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
