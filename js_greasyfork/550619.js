// ==UserScript==

// @name         纯黑背景模式 - 新能源课程系统

// @namespace    http://tampermonkey.net/

// @version      3.2

// @license MIT

// @description  将指定元素的背景修改为纯黑色，实现极简的暗黑风格，并为侧边栏添加平滑切换动画。

// @author       c-jeremy

// @match        *://bdfz.xnykcxt.com:5002/*

// @grant        GM_addStyle

// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/550619/%E7%BA%AF%E9%BB%91%E8%83%8C%E6%99%AF%E6%A8%A1%E5%BC%8F%20-%20%E6%96%B0%E8%83%BD%E6%BA%90%E8%AF%BE%E7%A8%8B%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/550619/%E7%BA%AF%E9%BB%91%E8%83%8C%E6%99%AF%E6%A8%A1%E5%BC%8F%20-%20%E6%96%B0%E8%83%BD%E6%BA%90%E8%AF%BE%E7%A8%8B%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {

    'use strict';

    GM_addStyle(`

        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');

        /* ---- 全局与基础样式 ---- */

        body * {

            font-family: 'Noto Serif SC', serif !important;

        }

        body,

        body html {

            background-color: #fff !important;

        }

        /* ---- 按背景颜色分组 ---- */

        /* 白色背景 */

        body .app,

        body .folder,

        body .roll-box,

        body .wrap,

        body .folderName.active,

        body .folderName.active:hover,

        body .ant-tree-node-selected,

        body .ant-tree-node-content-wrapper-open,

        body .ant-tree-treenode-selected {

            background-color: #ffffff !important;

        }

        /* 黑色背景 */

        body .slider,

        body .put,

        body .ant-tag-has-color,

        body .sideActive {

            background-color: #000000 !important;

        }

        /* 浅灰色背景 */

        body .score,

        body .tips,

        body .maxAvgScore {

            background-color: #eee !important;

            color: #000000 !important;

            font-size: 15px !important;

        }

        /* 中灰色背景 */

        body .swiper-box,

        body .swiper-container {

            background-color: #ddd !important;

        }

        /* ---- 按组件/功能分类 ---- */

        /* 按钮 */

        body .ant-btn-danger {

            background-color: #fff !important;

            color: #000 !important;

            border-color: #000000 !important;

            border-width: 1px !important;

            border-style: solid !important;

        }

        body .ant-btn-primary {

            background-color: #fff !important;

            border-color: #000000 !important;

            color: #000 !important;

        }



        /* 侧边栏与菜单 (带平滑移动动画) */

        body .menu {

            position: relative !important;

            background-color: #000000 !important;

            color: rgba(255, 255, 255, 0.7) !important;

        }

        body .menu div {

            position: relative;

            z-index: 1;

            transition: color 0.4s ease;

            border-radius: 8px !important;

        }

        body .menu div.active {

            background-color: transparent !important;

            color: #ffffff !important;

            font-weight: 500 !important;

        }

        .menu-active-indicator {

            position: absolute !important;

            z-index: 0;

            left: 4px !important;

            right: 4px !important;

            background-color: #333 !important;

            border-radius: 8px !important;

            /* 核心动画：增加时长并使用自定义 cubic-bezier 使缓动更明显 */

            transition: top 0.4s cubic-bezier(0.65, 0, 0.35, 1), height 0.4s cubic-bezier(0.65, 0, 0.35, 1) !important;

        }



        body .put {

            z-index: 190 !important;

        }

        /* 文件树 */

        body .treeBox {

            border-color: #000000 !important;

            border-width: 1px !important;

            border-style: solid !important;

        }

        body .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before,

        body .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before {

            background-color: #eee !important;

            border-radius: 5px !important;

            font-weight: 500 !important;

        }



        body .wrap .nav .treeBox .folder .folderName[data-v-56a2485d]:hover {

            color: #fff !important;

            background-color: #eee !important;

        }

        /* 弹窗 */

        body .ant-modal-content {

            background-color: rgba(255, 255, 255, 0.6) !important;

            -webkit-backdrop-filter: blur(10px) !important;

            backdrop-filter: blur(10px) !important;

            border-radius: 12px !important;

        }

        body .ant-modal-header {

            background-color: rgba(255, 255, 255, 0.6) !important;

            backdrop-filter: blur(10px) !important;

            border-bottom: 1px solid #000;

            border-radius: 12px 12px 0 0;

        }

        /* 分数显示 */

        body .scoreRate {

            background-color: #eee !important;

            color: #000000 !important;

            font-size: 15px !important;

            margin-top: 1.5rem;

            border-left-width: 2px;

            border-left-style: solid;

            border-left-color: currentColor;

            padding-left: 1.5rem;

            border-radius: 0px !important;

           // height: 70px !important;

        }

        /* 其他独立元素 */

        body .donw {

            display: block !important;

        }

        body .ant-row-flex, body .tips1, body .name-box {
            color: #000 !important;
        }

    `);

    // --- 平滑移动动画逻辑 ---

    // 初始观察器：等待 .menu 元素出现在页面上

    const initialObserver = new MutationObserver((mutations, obs) => {

        const menu = document.querySelector('.menu');

        if (menu) {

            setupSlidingIndicator(menu);

            obs.disconnect(); // 找到并设置后，停止观察

        }

    });

    initialObserver.observe(document.body, { childList: true, subtree: true });

    function setupSlidingIndicator(menu) {

        // 1. 创建并插入指示器元素

        if (menu.querySelector('.menu-active-indicator')) return; // 防止重复添加

        const indicator = document.createElement('div');

        indicator.className = 'menu-active-indicator';

        menu.prepend(indicator);

        // 2. 定义更新指示器位置的核心函数

        const updateIndicator = () => {

            const activeElement = menu.querySelector('div.active');

            if (activeElement) {

                indicator.style.top = `${activeElement.offsetTop}px`;

                indicator.style.height = `${activeElement.offsetHeight}px`;

                indicator.style.opacity = '1';

            } else {

                // 如果没有任何 active 项，则平滑地隐藏指示器

                indicator.style.opacity = '0';

            }

        };

        // 3. 首次加载时定位指示器

        setTimeout(updateIndicator, 150);

        // 4. 【鲁棒性核心】创建第二个观察器，专门监听 .menu 内部的 class 变化

        const menuObserver = new MutationObserver((mutations) => {

            // 只要 class 发生变化，就重新计算指示器位置

            // 不再关心是哪个元素变化，直接查找新的 active 元素

            updateIndicator();

        });

        // 5. 启动对 .menu 的观察

        menuObserver.observe(menu, {

            attributes: true, // 监视属性变化

            attributeFilter: ['class'], // 只关心 class 属性

            subtree: true // 监视所有后代元素（即菜单中的每个 div）

        });

        // 6. 监听窗口大小变化，以防万一

        window.addEventListener('resize', updateIndicator);

    }

})();