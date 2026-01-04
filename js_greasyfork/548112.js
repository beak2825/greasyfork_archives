// ==UserScript==
// @name         gitee左侧宽度自适应
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  将 index_goodlook-scroller___xbXb 同级的 w-76 宽度设为 auto !important
// @author       zr
// @match        https://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548112/gitee%E5%B7%A6%E4%BE%A7%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/548112/gitee%E5%B7%A6%E4%BE%A7%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.origin !== 'https://gitee.com') return;

    /* 立即执行一次 */
    fixSiblingW76();

    /* 监听后续动态插入 */
    const obs = new MutationObserver(fixSiblingW76);
    obs.observe(document.body, { childList: true, subtree: true });

    function fixSiblingW76() {
        // 找到所有 index_goodlook-scroller___xbXb 节点
        document.querySelectorAll('.index_goodlook-scroller___xbXb').forEach(scroller => {
            // 获取它的父节点，然后在其所有直接子节点中筛选 .w-76
            scroller.parentElement
                   ?.querySelectorAll(':scope > .w-76')
                   .forEach(el => el.style.setProperty('width', 'auto', 'important'));
        });
    }
})();