// ==UserScript==
// @name         NGA 帖子在新标签页打开
// @namespace    https://github.com/lostgeek3
// @version      1.0
// @description  使得在 bbs.nga.cn 点击帖子时，在新标签页打开
// @author       lostgeek
// @match        *://bbs.nga.cn/thread.php*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560303/NGA%20%E5%B8%96%E5%AD%90%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/560303/NGA%20%E5%B8%96%E5%AD%90%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        if (target && target.tagName === 'A' && target.href && (target.href.includes('/read.php'))) {
            target.target = "_blank";
            e.stopPropagation();
        }
    }, true);
})();