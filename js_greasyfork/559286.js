// ==UserScript==
// @name         Bilibili 自动宽屏（稳定版）
// @namespace    https://bilibili.com/
// @version      1.1
// @description  打开B站视频后自动切换宽屏（不破坏UI）
// @match        https://www.bilibili.com/video/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559286/Bilibili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559286/Bilibili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tried = false;

    function trySetWide() {
        if (tried) return;

        const wideBtn = document.querySelector('.bpx-player-ctrl-wide');
        if (wideBtn) {
            wideBtn.click();
            tried = true;
        }
    }

    // 轮询播放器是否加载完成
    const timer = setInterval(() => {
        trySetWide();
        if (tried) clearInterval(timer);
    }, 500);

    // 10 秒兜底，防止死循环
    setTimeout(() => clearInterval(timer), 10000);
})();
