// ==UserScript==
// @name         AI作品图库：缩略图拖拽打开作品页
// @namespace    https://ai.10110000.xyz/
// @version      1.0
// @description  左键拖动缩略图时不打开图片链接，而是打开 https://ai.10110000.xyz/i/{id} 的真实作品页
// @match        https://ai.10110000.xyz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556859/AI%E4%BD%9C%E5%93%81%E5%9B%BE%E5%BA%93%EF%BC%9A%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%8B%96%E6%8B%BD%E6%89%93%E5%BC%80%E4%BD%9C%E5%93%81%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/556859/AI%E4%BD%9C%E5%93%81%E5%9B%BE%E5%BA%93%EF%BC%9A%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%8B%96%E6%8B%BD%E6%89%93%E5%BC%80%E4%BD%9C%E5%93%81%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听整个页面的拖拽事件
    document.addEventListener("dragstart", function(e) {

        const img = e.target.closest("img[data-work-id]");
        if (!img) return;

        const workId = img.dataset.workId;
        if (!workId) return;

        // 替换拖拽的默认链接
        const realUrl = `https://ai.10110000.xyz/i/${workId}`;

        // 如果浏览器允许，修改 dataTransfer 的 URL
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/uri-list", realUrl);
            e.dataTransfer.setData("text/plain", realUrl);
        }
    });

})();
