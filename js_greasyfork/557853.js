// ==UserScript==
// @name         MissAV Mobile Full Image + Keep Header/Sidebar
// @namespace    https://missav.ws
// @version      0.3
// @description  Full-screen thumbnails, one-column layout, keep header & sidebar
// @match        https://missav.ws/*
// @match        https://missav.ws/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557853/MissAV%20Mobile%20Full%20Image%20%2B%20Keep%20HeaderSidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/557853/MissAV%20Mobile%20Full%20Image%20%2B%20Keep%20HeaderSidebar.meta.js
// ==/UserScript==

(function() {

    const style = document.createElement("style");
    style.innerHTML = `
        /* ------ 背景与滚动优化 ------ */
        body {
            background: #111 !important;
            overflow-x: hidden !important;
            scroll-behavior: smooth !important;
        }

        /* ------ 保持 header 但压缩高度 ------ */
        header, .fixed.z-max {
            background: rgba(0,0,0,0.8) !important;
            backdrop-filter: blur(10px) !important;
        }

        /* ------ 主体容器保持宽度（不要全屏）------ */
        main {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 10px !important;
        }

        /* ------ 网格改为 1 列瀑布流布局 ------ */
        .grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 22px !important;
            width: 100% !important;
        }

        /* ------ 每个卡片全宽、带圆角阴影 ------ */
        .grid > div {
            width: 100% !important;
            background: #000 !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }

        /* ------ 图片全屏宽、高清显示 ------ */
        .grid img {
            width: 100% !important;
            height: auto !important;
            display: block !important;
            object-fit: cover !important;
            border-radius: 0 !important;
        }

        /* ------ 标题更大，更适合手机阅读 ------ */
        .font-serif,
        h2, h3, h4 {
            font-size: 18px !important;
            line-height: 1.5 !important;
            padding: 12px !important;
            color: #eee !important;
        }

        /* ------ 隐藏视频预览（更省电） ------ */
        video,
        .hover\\:block {
            display: none !important;
        }

        /* ------ 侧边栏宽度优化 ------ */
        aside {
            max-width: 300px !important;
        }

        /* 标签字体稍大 */
        .text-xs {
            font-size: 14px !important;
        }
    `;
    document.head.appendChild(style);


    /* ------ 清理视频预览 DOM 节点 ------ */
    setInterval(() => {
        document.querySelectorAll("video").forEach(v => v.remove());
    }, 1500);


    /* ------ 立即加载懒加载图片 ------ */
    setInterval(() => {
        document.querySelectorAll("img[data-src]").forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
        });
    }, 1500);


})();
