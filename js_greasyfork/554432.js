// ==UserScript==
// @name         TouchGal 评分隐藏
// @version      1.0
// @description  隐藏 TouchGal 所有评分、星星、评分分布
// @author       高龄啊
// @match        https://www.touchgal.us/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1301540
// @downloadURL https://update.greasyfork.org/scripts/554432/TouchGal%20%E8%AF%84%E5%88%86%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554432/TouchGal%20%E8%AF%84%E5%88%86%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(() => {
    const hide = () => {
        document.querySelectorAll('div.absolute.top-2.right-2.z-10, div.flex.items-center.gap-3, [class*="rating"], [class*="score"]').forEach(el => el.remove());
    };
    hide();
    new MutationObserver(hide).observe(document.documentElement, { childList: true, subtree: true });
})();