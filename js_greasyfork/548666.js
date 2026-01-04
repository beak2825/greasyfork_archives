// ==UserScript==
// @name         贴吧获取楼层链接
// @namespace    http://tampermonkey.net/
// @version      2025-09-07_01-3
// @description  获取贴吧楼层链接并复制到剪贴板
// @author       Howard Wu
// @match        *://tieba.baidu.com/p/*
// @icon         https://tieba.baidu.com/favicon.ico
// @run-at       document-body
// @sandbox      JavaScript
// @license AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/548666/%E8%B4%B4%E5%90%A7%E8%8E%B7%E5%8F%96%E6%A5%BC%E5%B1%82%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/548666/%E8%B4%B4%E5%90%A7%E8%8E%B7%E5%8F%96%E6%A5%BC%E5%B1%82%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function () {
    'use strict';
    function processPost(post) {
        if (post.dataset.copiedLink) return;
        const postId = post.dataset.pid;
        const tailInfo = Array.from(
            post.querySelectorAll("div.d_post_content_main div.core_reply.j_lzl_wrapper div.core_reply_tail.clearfix div span.tail-info")
        ).find(el => /\d+楼/.test(el.textContent));
        if (!tailInfo) return;
        let url = location.href.split('#')[0];
        if (/([&?])pid=\d+/.test(url)) {
            url = url.replace(/([&?])pid=\d+/, `$1pid=${postId}`);
        } else {
            url += (url.includes('?') && !url.endsWith('?') && !url.endsWith('&') ? '&' : '?') + `pid=${postId}`;
        }
        const a = document.createElement('a');
        a.href = url;
        a.textContent = tailInfo.textContent;
        a.rel = 'bookmark';
        a.title = `点击复制${tailInfo.textContent}链接：` + url;
        a.onclick = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(url);
        };
        tailInfo.innerHTML = '';
        tailInfo.appendChild(a);
        post.dataset.copiedLink = '1';
    }

    // 先处理body下所有未处理楼层
    document.body.querySelectorAll('div.j_l_post:not([data-copied-link])').forEach(processPost);

    // 监听后续新增楼层
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                node.id == 'j_p_postlist' && node.querySelectorAll?.('div.j_l_post:not([data-copied-link])').forEach(processPost);
            }
        }
    });
    observer.observe(document.body, { subtree: true, childList: true });
})();
