// ==UserScript==
// @name         阿里云先知社区 - 删除动态广告容器
// @version      1.0
// @description  自动删除页面中 id 以 "server-containerx" 开头的广告/推广容器
// @author       @0day404
// @match        https://xz.aliyun.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1535850
// @downloadURL https://update.greasyfork.org/scripts/555272/%E9%98%BF%E9%87%8C%E4%BA%91%E5%85%88%E7%9F%A5%E7%A4%BE%E5%8C%BA%20-%20%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A%E5%AE%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555272/%E9%98%BF%E9%87%8C%E4%BA%91%E5%85%88%E7%9F%A5%E7%A4%BE%E5%8C%BA%20-%20%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A%E5%AE%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeDynamicContainer() {
        // 匹配所有 id 以 "server-containerx" 开头的 div
        const elements = document.querySelectorAll('div[id^="server-containerx"]');
        elements.forEach(el => {
            console.log('[Tampermonkey] 已移除:', el.id);
            el.remove();
        });
    }

    // 立即执行一次（适用于静态或快速加载的内容）
    removeDynamicContainer();

    // 监听 DOM 变化，应对动态插入（如 SPA 或延迟加载）
    const observer = new MutationObserver(removeDynamicContainer);
    observer.observe(document.body, { childList: true, subtree: true });

})();