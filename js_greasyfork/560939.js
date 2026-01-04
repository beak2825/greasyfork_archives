// ==UserScript==
// @name         玉豆分享订阅展示
// @namespace    https://github.com/widrin/yudou_decode/
// @license      GPLv3
// @version      1.0
// @description  自动显示玉豆分享中被密码隐藏的订阅内容（非暴力破解，仅前端展示）
// @author       jammywong
// @match        https://www.yudou789.top/*.html
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBjbGFzcz0ic2l6ZS02Ij4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS41OSAxNC4zN2E2IDYgMCAwIDEtNS44NCA3LjM4di00LjhtNS44NC0yLjU4YTE0Ljk4IDE0Ljk4IDAgMCAwIDYuMTYtMTIuMTJBMTQuOTggMTQuOTggMCAwIDAgOS42MzEgOC40MW01Ljk2IDUuOTZhMTQuOTI2IDE0LjkyNiAwIDAgMS01Ljg0MSAyLjU4bS0uMTE5LTguNTRhNiA2IDAgMCAwLTcuMzgxIDUuODRoNC44bTIuNTgxLTUuODRhMTQuOTI3IDE0LjkyNyAwIDAgMC0yLjU4IDUuODRtMi42OTkgMi43Yy0uMTAzLjAyMS0uMjA3LjA0MS0uMzExLjA2YTE1LjA5IDE1LjA5IDAgMCAxLTIuNDQ4LTIuNDQ4IDE0LjkgMTQuOSAwIDAgMSAuMDYtLjMxMm0tMi4yNCAyLjM5YTQuNDkzIDQuNDkzIDAgMCAwLTEuNzU3IDQuMzA2IDQuNDkzIDQuNDkzIDAgMCAwIDQuMzA2LTEuNzU4TTE2LjUgOWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMFoiIC8+Cjwvc3ZnPgo=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560939/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%AE%A2%E9%98%85%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560939/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%AE%A2%E9%98%85%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 DOM 变化，确保动态加载的内容也能被处理
    const observer = new MutationObserver(() => {
        revealHiddenContent();
    });

    function revealHiddenContent() {
        document.querySelectorAll('.cl-noindent-wrapper').forEach(function(box) {
            const card = box.querySelector('.cl-lock-card');
            const content = box.querySelector('.cl-hidden-content');
            if (card && content) {
                card.style.display = 'none';
                content.style.display = 'block';
            }
        });
    }

    // 初始执行
    revealHiddenContent();

    // 开始观察整个文档的变动
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();