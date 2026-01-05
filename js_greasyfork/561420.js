// ==UserScript==
// @name         ESJZone 样式优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将小说阅读页面的样式应用到阅读页面，添加翻页功能
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
            border-bottom: 1px solid #828282;
        }
        .toolbar .search, .toolbar .account, .toolbar .cart {
            border: 1px solid #828282;
        }
        .tag {
            border: 1px solid #828282;
        }
        .btn-outline-secondary {
            border-color: #828282;
        }

        /* 工具条样式 */
        .toolbar, #mycolor-0 {
            background: rgb(237, 231, 218) !important;
        }
        .page-title {
            background-color: rgb(237, 231, 218) !important;
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

        /* 添加按钮样式（参考代码中的样式） */
        .scroll-controls {
            position: fixed;
            right: 64px;
            top: 85.6%;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .scroll-btn {
            width: 44px;
            height: 44px;
            background: #374250;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .scroll-btn:hover {
            transform: scale(1.1);
        }

        .scroll-btn:active {
            transform: scale(0.95);
        }
    `);

    // 翻页滚动函数（参考代码中的函数）
    function pageScroll(direction) {
        // 计算一屏的高度 - 90%的视口高度
        const pageHeight = window.innerHeight * 0.9;

        window.scrollBy({
            top: direction * pageHeight,
            behavior: 'smooth'
        });
    }

    // 添加滚动控制按钮（参考代码中的函数）
    function addScrollControls() {
        // 检查是否已存在滚动控制按钮
        if (document.querySelector('.scroll-controls')) {
            return;
        }

        // 创建滚动控制容器
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'scroll-controls';

        // 创建向下滚动按钮
        const downBtn = document.createElement('button');
        downBtn.className = 'scroll-btn';
        downBtn.innerHTML = '∇';
        downBtn.title = '向下翻页';

        // 创建向上滚动按钮
        const upBtn = document.createElement('button');
        upBtn.className = 'scroll-btn';
        upBtn.innerHTML = '∆';
        upBtn.title = '向上翻页';

        // 添加到页面
        controlsContainer.appendChild(downBtn);
        controlsContainer.appendChild(upBtn);
        document.body.appendChild(controlsContainer);

        // 按钮点击事件
        downBtn.addEventListener('click', function(e) {
            pageScroll(1);
        });

        upBtn.addEventListener('click', function(e) {
            pageScroll(-1);
        });

        // 键盘控制（参考代码中的键盘控制）
        document.addEventListener('keydown', function(e) {
            // 方向键控制
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

    // 初始化函数
    const init = () => {
        console.log('ESJ Zone 小说阅读样式优化脚本已加载');

        // 等待页面加载完成后调整布局
        setTimeout(() => {
            // 将论坛内容区域居中对齐
            const forumContent = document.querySelector('.forum-content');
            if (forumContent) {
                forumContent.style.margin = '20px auto !important';
            }

            // 添加滚动控制按钮
            addScrollControls();
        }, 100);
    };

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听DOM变化，动态添加的按钮也能生效
    const observer = new MutationObserver(() => {
        // 重新添加滚动控制按钮（防止页面动态加载时按钮丢失）
        setTimeout(addScrollControls, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();