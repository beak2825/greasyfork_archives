// ==UserScript==
// @name         小红书笔记链接自动复制
// @version      1.1
// @description  切换到笔记页时自动复制当前完整 URL
// @match        https://www.xiaohongshu.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1284881
// @downloadURL https://update.greasyfork.org/scripts/564215/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/564215/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastCopiedUrl = '';

    function copyIfExplorePage() {
        const url = location.href;

        if (!url.includes('/explore/')) return;
        if (url === lastCopiedUrl) return;

        lastCopiedUrl = url;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                console.log('[XHS] 链接已复制:', url);
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            console.log('[XHS] 链接已复制（fallback）:', url);
        }
    }

    // hook history API
    function hookHistory(method) {
        const original = history[method];
        history[method] = function () {
            const result = original.apply(this, arguments);
            setTimeout(copyIfExplorePage, 300);
            return result;
        };
    }

    hookHistory('pushState');
    hookHistory('replaceState');

    window.addEventListener('popstate', () => {
        setTimeout(copyIfExplorePage, 300);
    });

    // 首次加载兜底
    window.addEventListener('load', () => {
        setTimeout(copyIfExplorePage, 300);
    });
})();
