// ==UserScript==
// @name         New Tab on FnClub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  强制飞牛论坛帖子在新标签页打开
// @match        *://club.fnnas.com/forum.php*
// @match        *://club.fnnas.com/thread-*.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549795/New%20Tab%20on%20FnClub.user.js
// @updateURL https://update.greasyfork.org/scripts/549795/New%20Tab%20on%20FnClub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接覆盖掉 atarget，防止它阻止新标签页
    window.atarget = function(){};

    function fixLinks() {
        document.querySelectorAll('a[onclick*="atarget"]').forEach(a => {
            a.setAttribute('target', '_blank');
        });
    }

    // 页面初始处理
    fixLinks();

    // 监听动态加载
    new MutationObserver(fixLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();