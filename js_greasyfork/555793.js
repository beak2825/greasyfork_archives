// ==UserScript==
// @name         Bing去掉广告参数,删除推广链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bing搜索时主页会带有推广广告，只需要去除无效参数即可去掉广告，同时去除搜索浏览器、其他搜索引擎时的推广链接
// @author       Mike
// @license      MIT
// @match        https://cn.bing.com/search*
// @match        https://www.bing.com/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555793/Bing%E5%8E%BB%E6%8E%89%E5%B9%BF%E5%91%8A%E5%8F%82%E6%95%B0%2C%E5%88%A0%E9%99%A4%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/555793/Bing%E5%8E%BB%E6%8E%89%E5%B9%BF%E5%91%8A%E5%8F%82%E6%95%B0%2C%E5%88%A0%E9%99%A4%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = location.href;

    // 清除广告后缀
    const cleanUrl = url.replace(/(\?q=[^&]+).*/, '$1');

    if (cleanUrl !== url) {
        history.replaceState(null, "", cleanUrl);
    }

    const style = document.createElement('style');
    style.textContent = `
        [elementtiming="frp.AdsTop"],
        #b_topw,
        .b_poleContent {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.documentElement.appendChild(style);
    //清除国际版广告节点
    function cleanBeforeAdTarget() {
        const target = document.querySelector('[elementtiming="frp.AdsTop"]');
        if (!target) return;

        let node = target;

        while (node.previousElementSibling) {
            node.previousElementSibling.remove();
        }

        target.remove();

    }
    // 清除广告和推广
    function removePoleContent() {
        document.querySelectorAll('#b_topw').forEach(el => el.remove());
        document.querySelectorAll('.b_poleContent').forEach(el => el.remove());
        cleanBeforeAdTarget();
    }
    removePoleContent();

    const observer = new MutationObserver(() => removePoleContent());
    observer.observe(document.body, { childList: true, subtree: true });
})();