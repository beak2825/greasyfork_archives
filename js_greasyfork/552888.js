// ==UserScript==
// @name         链接新标签页打开
// @namespace    https://bestlzk.cn/
// @version      1.0
// @description  a标签添加target=_blank属性
// @author       bestlzk
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552888/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/552888/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

function updateLinks(selector) {
    document.querySelectorAll(selector).forEach(link => {
        if (!link.target) link.target = '_blank';
    });
}

// document.querySelectorAll('').forEach(link => {console.log(link.href)})
const linkUpdateConfig = {
    'news.ycombinator.com': [
        'td.title > span > a'
    ]
};

(function() {
    const hostname = location.hostname;
    const selectors = linkUpdateConfig[hostname];
    if (!Array.isArray(selectors)) return;

    selectors.forEach(updateLinks);

    const observer = new MutationObserver(() => {
        selectors.forEach(updateLinks);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();