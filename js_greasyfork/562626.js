// ==UserScript==
// @name         Linux.do 强力直连 - 强制新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Linux.do 论坛使用强力拦截技术，强制所有帖子链接在新标签页打开，并移除重定向。
// @author       你的名字 (例如: GaoQirui)
// @match        https://linux.do/*
// @grant        GM_openInTab
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562626/Linuxdo%20%E5%BC%BA%E5%8A%9B%E7%9B%B4%E8%BF%9E%20-%20%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/562626/Linuxdo%20%E5%BC%BA%E5%8A%9B%E7%9B%B4%E8%BF%9E%20-%20%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ... 这里把之前的 V2.0 完整代码粘贴在下面 ...
    // 为了方便，你可以直接把下面这段完整的复制走：

    console.log('Linux.do 强力拦截脚本已启动...');

    function shouldIgnore(element) {
        if (!element.href) return true;
        if (element.href.startsWith('javascript:')) return true;
        if (element.getAttribute('href').startsWith('#')) return true;
        return false;
    }

    document.addEventListener('click', function(e) {
        let target = e.target.closest('a');
        if (!target) return;
        if (shouldIgnore(target)) return;

        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        let finalUrl = target.href;
        try {
            let urlObj = new URL(finalUrl);
            let params = new URLSearchParams(urlObj.search);
            for (let [key, value] of params.entries()) {
                if (value.startsWith('http')) {
                    finalUrl = decodeURIComponent(value);
                    break;
                }
            }
        } catch (err) {}

        if (typeof GM_openInTab !== 'undefined') {
            GM_openInTab(finalUrl, { active: true, insert: true });
        } else {
            window.open(finalUrl, '_blank');
        }
    }, true);
})();
