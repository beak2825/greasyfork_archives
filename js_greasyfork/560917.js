// ==UserScript==
// @name         所有外部链接新标签页打开（智能版）
// @namespace    https://greasyfork.org/users/1554493-飞翔的荷兰人269
// @version      1.0.0
// @description  强制外部链接在新标签页打开，自动排除站内行为和AI工具
// @author       飞翔的荷兰人269
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560917/%E6%89%80%E6%9C%89%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%99%BA%E8%83%BD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560917/%E6%89%80%E6%9C%89%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%99%BA%E8%83%BD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const excludeSites = [
        'chat.openai.com',
        'deepseek.com',
        'kimi.moonshot.cn'
    ];

    function isExcluded() {
        return excludeSites.some(site => location.hostname.includes(site));
    }

    if (isExcluded()) return;

    document.addEventListener('click', function (e) {
        if (e.button !== 0 && e.button !== 1) return;

        const a = e.target.closest('a');
        if (!a) return;

        const href = a.getAttribute('href');
        if (!href) return;

        // 1️⃣ 排除站内行为
        if (
            href.startsWith('#') ||
            href.startsWith('javascript:') ||
            a.getAttribute('role') === 'button' ||
            a.hasAttribute('data-action')
        ) {
            return;
        }

        // 2️⃣ 构造完整 URL
        let url;
        try {
            url = new URL(href, location.href);
        } catch {
            return;
        }

        // 3️⃣ 同源链接（SPA / AI 新会话）不处理如：ai中新建会话则不进行处理
        if (url.origin === location.origin) {
            return;
        }

        // 4️⃣ 真正的外链，强制新开
        e.preventDefault();
        e.stopPropagation();

        window.open(url.href, '_blank', 'noopener,noreferrer');

    }, true);
})();
