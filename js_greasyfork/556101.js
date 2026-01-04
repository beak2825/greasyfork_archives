// ==UserScript==
// @name         DC Sensitive Keyword Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  모바일 DC에서 민감 키워드 포함 게시글 차단
// @match        *://m.dcinside.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556101/DC%20Sensitive%20Keyword%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/556101/DC%20Sensitive%20Keyword%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 차단할 민감 키워드
    const blockKeywords = [
        '데뷔 전 영상',
        '벗방',
        '꼭노',
        '기 룡이',
        '틱 톡녀'
    ];

    function blockPosts() {
        const posts = document.querySelectorAll('li'); // 모바일 게시글 목록 li 기준
        posts.forEach(post => {
            const text = post.innerText;
            if (blockKeywords.some(keyword => text.includes(keyword))) {
                post.style.display = 'none';
            }
        });
    }

    // DOM 변경 감지해서 동적 게시글도 차단
    const observer = new MutationObserver(blockPosts);
    observer.observe(document.body, { childList: true, subtree: true });

    // 초기 차단
    blockPosts();
})();