// ==UserScript==
// @name         DCinside 닉네임 식별코드 표시
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  글 목록, 본문, 댓글 닉네임 옆에 식별코드 표시
// @match        *://m.dcinside.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555999/DCinside%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/555999/DCinside%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function styleSpan(span) {
        span.style.color = '#888';
        span.style.fontSize = '0.85em';
        span.style.marginLeft = '4px';
        span.style.fontWeight = 'normal';
        span.style.display = 'inline-block';
    }

    // 글 목록 닉네임 처리
    function addListUserCode() {
        const items = document.querySelectorAll('li');
        items.forEach(li => {
            if (li.dataset.codeAdded) return;

            const ginfoNick = li.querySelector('ul.ginfo > li:nth-child(2)'); // 닉네임 위치
            const codeSpan = li.querySelector('span.blockInfo[data-info]');
            if (ginfoNick && codeSpan) {
                const code = codeSpan.dataset.info;
                const span = document.createElement('span');
                span.textContent = `(${code})`;
                styleSpan(span);
                ginfoNick.appendChild(span);
                li.dataset.codeAdded = 'true';
            }
        });
    }

    // 글 본문 닉네임 처리
    function addUserCode() {
        const links = document.querySelectorAll('a[href^="/gallog/"]');
        links.forEach(link => {
            if (link.dataset.codeAdded) return;
            const match = link.getAttribute('href').match(/\/gallog\/([^\/">]+)/);
            if (match) {
                const code = match[1];
                const span = document.createElement('span');
                span.textContent = `(${code})`;
                styleSpan(span);
                link.appendChild(span);
                link.dataset.codeAdded = 'true';
            }
        });
    }

    // 댓글 닉네임 처리
    function addCommentCode() {
        const commentLinks = document.querySelectorAll('a.nick[href*="/gallog/"]');
        commentLinks.forEach(link => {
            if (link.dataset.codeAdded) return;
            const match = link.getAttribute('href').match(/\/gallog\/([^\/">]+)/);
            if (match) {
                const code = match[1];
                const span = document.createElement('span');
                span.textContent = `(${code})`;
                styleSpan(span);
                link.appendChild(span);
                link.dataset.codeAdded = 'true';
            }
        });
    }

    // 반복 확인용 (글 목록 비동기 대응)
    setInterval(() => {
        addListUserCode();
        addUserCode();
        addCommentCode();
    }, 500); // 0.5초마다 확인

    // MutationObserver도 추가 (SPA/동적 페이지 안정성)
    const observer = new MutationObserver(() => {
        addListUserCode();
        addUserCode();
        addCommentCode();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();