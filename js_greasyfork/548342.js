// ==UserScript==
// @name         Roblox 图片自动跳转高清版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       m.
// @description  自动将 roblox 缩略图地址替换为 1024 尺寸 PNG 格式
// @match        https://tr.rbxcdn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548342/Roblox%20%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%AB%98%E6%B8%85%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548342/Roblox%20%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%AB%98%E6%B8%85%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = window.location.href;

    // 提取路径中的宽高和类型
    // 例: /384/216/Image/Jpeg → width=384, height=216, type=Image, format=Jpeg
    let match = url.match(/\/(\d+)\/(\d+)\/([^/]+)\/([^/]+)/i);
    if (!match) return;

    let width  = parseInt(match[1], 10);
    let height = parseInt(match[2], 10);
    let type   = match[3]; // Model / AvatarHeadshot / Image 等
    let format = match[4]; // Webp / Jpeg 等

    let newUrl = url;

    if (width === height) {
        // 正方形 → 1024x1024
        newUrl = url.replace(/\/\d+\/\d+\//, "/1024/1024/");
    } else if (Math.abs(width / height - 1024 / 576) < 0.01) {
        // 接近 16:9 → 1024x576
        newUrl = url.replace(/\/\d+\/\d+\//, "/1024/576/");
    }

    // 不管原始格式是什么，都换成 PNG
    newUrl = newUrl.replace(new RegExp(`/${format}`, "i"), "/Png");

    // 如果发生了变化，就跳转
    if (newUrl !== url) {
        window.location.replace(newUrl);
    }
})();
