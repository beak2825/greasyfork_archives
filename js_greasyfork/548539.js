// ==UserScript==
// @name         修改设备像素比dpi 调整jellyfin发送的图片分辨率
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  修改浏览器的设备像素比以增加jellyfin图片分辨率
// @author       tanmoumou252
// @match        *://*/web/index.html
// @grant        none
// @license MIT
// @icon         https://cdn.jsdelivr.net/gh/xushier/HD-Icons@main/border-radius/Jellyfin_A.png
// @downloadURL https://update.greasyfork.org/scripts/548539/%E4%BF%AE%E6%94%B9%E8%AE%BE%E5%A4%87%E5%83%8F%E7%B4%A0%E6%AF%94dpi%20%E8%B0%83%E6%95%B4jellyfin%E5%8F%91%E9%80%81%E7%9A%84%E5%9B%BE%E7%89%87%E5%88%86%E8%BE%A8%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/548539/%E4%BF%AE%E6%94%B9%E8%AE%BE%E5%A4%87%E5%83%8F%E7%B4%A0%E6%AF%94dpi%20%E8%B0%83%E6%95%B4jellyfin%E5%8F%91%E9%80%81%E7%9A%84%E5%9B%BE%E7%89%87%E5%88%86%E8%BE%A8%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 指定你想要的 devicePixelRatio 值,3.75时jellyfin给的图片像素为300px,2时为160px
    const customPixelRatio = 8;

    // 修改 devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return customPixelRatio;
        }
    });

    // 打印确认修改结果
    console.log(`devicePixelRatio 已修改为: ${window.devicePixelRatio}`);
})();