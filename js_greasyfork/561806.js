// ==UserScript==
// @name         4D4Y 帖子新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制 4d4y 论坛帖子列表在点击标题时新开标签页
// @author       GeBron
// @match        *://www.4d4y.com/forum/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561806/4D4Y%20%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561806/4D4Y%20%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 选取所有在 th.subject 内的标题链接
    const links = document.querySelectorAll('th.subject span a[href^="viewthread.php?tid="]');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
})();