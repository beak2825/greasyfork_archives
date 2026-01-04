// ==UserScript==
// @name         JAVLibrary Mobile HD Waterfall Layout
// @namespace    https://javlibrary.com
// @version      0.2
// @description  Make thumbnails HD, full width, one column waterfall layout for mobile
// @match        https://www.javlibrary.com/*/vl_newrelease.php*
// @match        https://www.javlibrary.com/*/vl_update.php*
// @match        https://www.javlibrary.com/*/vl_newentries.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557851/JAVLibrary%20Mobile%20HD%20Waterfall%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/557851/JAVLibrary%20Mobile%20HD%20Waterfall%20Layout.meta.js
// ==/UserScript==

(function() {

    /* ------------------------- 高清化缩略图 ------------------------- */

    function upgradeImage(img) {
        if (!img.src) return;

        // 把低分辨率的 ps.jpg 换成 高分辨率 pl.jpg 或 d.jpg
        // 有些片可能没有 d.jpg，所以优先 pl
        img.src = img.src
            .replace(/ps\.jpg/gi, "pl.jpg")
            .replace(/pt\.jpg/gi, "pl.jpg");

        img.style.setProperty("image-rendering", "auto", "important");
    }

    // 替换所有图片
    document.querySelectorAll(".video img").forEach(upgradeImage);

    /* ------------------------- 重新布局 ------------------------- */
    const style = document.createElement("style");
    style.innerHTML = `
        /* 主区域全屏宽 */
        #rightcolumn,
        .videothumblist,
        .videos {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
        }

        /* 单列布局 */
        .videos {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
        }

        /* 视频容器 */
        .video {
            width: 100% !important;
            max-width: 100% !important;
            display: block !important;
            padding: 0 !important;
            background: #fff !important;
            box-sizing: border-box !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
        }

        /* 高清大图全屏宽 */
        .video img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            display: block !important;
            border-radius: 0 !important;
            object-fit: cover !important;
        }

        /* ID 与标题 */
        .video .id {
            font-size: 18px !important;
            font-weight: bold !important;
            padding: 10px !important;
            display: block !important;
        }

        .video .title {
            font-size: 16px !important;
            line-height: 1.5 !important;
            padding: 0 10px 10px 10px !important;
            display: block !important;
        }

        .toolbar {
            padding: 10px !important;
        }

        /* 隐藏侧边栏 */
        #leftmenu {
            display: none !important;
        }

        /* 背景 */
        body,html {
            background: #f5f5f5 !important;
            overflow-x: hidden !important;
        }
    `;
    document.head.appendChild(style);

})();