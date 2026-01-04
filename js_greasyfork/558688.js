// ==UserScript==
// @name         Bing US Region + Auto Accept License (Stable)
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  持久设置 Bing 区域为美国 + 自动接受许可弹窗（更稳更耐页面变动）
// @author       老大
// @match        https://www.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558688/Bing%20US%20Region%20%2B%20Auto%20Accept%20License%20%28Stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558688/Bing%20US%20Region%20%2B%20Auto%20Accept%20License%20%28Stable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ————————————————————————————————————————————————
    // 1) 稳健地把 Bing 的区域参数设成美国 + 英语
    // 不重复刷新页面（用 replace 替换历史而不会无限跳）
    // ————————————————————————————————————————————————
    const currentUrl = new URL(window.location.href);

    // 检查是否已经是我们想要的参数
    const needsRegionFix = (
        currentUrl.searchParams.get('cc') !== 'US' ||
        currentUrl.searchParams.get('setLang') !== 'en-US'
    );

    if (needsRegionFix) {
        currentUrl.searchParams.set('cc', 'US');
        currentUrl.searchParams.set('setLang', 'en-US');
        // 用 replace 而不是 href = ，减少历史污染
        window.location.replace(currentUrl.toString());
        return; // 停在这里，避免继续执行下面的自动点逻辑干扰跳转
    }

    // ————————————————————————————————————————————————
    // 2) DOM 轮询查找并点击许可同意按钮
    // 这样比 “只等 200ms” 更稳健：即使加载慢也能点上
    // ————————————————————————————————————————————————
    const ACCEPT_BUTTON_SELECTOR = '#bnp_btn_accept.bnp_btn_accept';

    const acceptInterval = setInterval(() => {
        const acceptBtn = document.querySelector(ACCEPT_BUTTON_SELECTOR);
        if (acceptBtn) {
            acceptBtn.click();
            clearInterval(acceptInterval);
        }
    }, 300); // 每 300ms 查一次，直到找到为止

})();
