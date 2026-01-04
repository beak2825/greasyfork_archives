// ==UserScript==
// @name         DCinside 닉네임 식별코드 표시 (모바일 최적화)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  글 목록, 본문, 댓글 닉네임 옆에 식별코드 표시 (디시 스타일 자연스러운 표시, 동적 로딩 지원)
// @author       (당신의 이름/닉네임)
// @match        *://m.dcinside.com/board/*
// @match        *://m.dcinside.com/view/*
// @match        *://m.dcinside.com/gallog/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556004/DCinside%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%ED%91%9C%EC%8B%9C%20%28%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%B5%9C%EC%A0%81%ED%99%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556004/DCinside%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%ED%91%9C%EC%8B%9C%20%28%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%B5%9C%EC%A0%81%ED%99%94%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 닉네임 옆에 표시될 식별 코드 스타일을 정의
    function getStyleSpan(code) {
        const span = document.createElement('span');
        span.textContent = `(${code})`;
        span.style.cssText = 'color: #888; font-size: 0.85em; margin-left: 4px; font-weight: normal; display: inline-block;';
        return span;
    }

    // 갤러리 글 목록 닉네임 처리
    function addListUserCode() {
        // .gall-detail-list li 요소를 탐색 (글 목록)
        const items = document.querySelectorAll('.gall-detail-list li');
        items.forEach(li => {
            if (li.dataset.codeAdded) return;

            // 닉네임 요소와 식별 코드를 담고 있는 .blockInfo span 탐색
            const ginfoNick = li.querySelector('ul.ginfo > li:nth-child(2)'); 
            const codeSpan = li.querySelector('span.blockInfo[data-info]');

            if (ginfoNick && codeSpan) {
                const code = codeSpan.dataset.info;
                const span = getStyleSpan(code);
                
                // 닉네임 요소의 기존 내용(텍스트) 바로 뒤에 식별 코드를 추가
                ginfoNick.appendChild(span);
                li.dataset.codeAdded = 'true';
            }
        });
    }

    // 글 본문 닉네임 처리 (작성자 닉네임)
    function addUserCode() {
        // /gallog/ 식별코드가 포함된 A 태그 탐색 (보통 글 작성자 닉네임)
        const links = document.querySelectorAll('a[href^="/gallog/"]');
        links.forEach(link => {
            if (link.dataset.codeAdded || link.classList.contains('nick')) return; // 댓글 닉네임은 별도로 처리

            const match = link.getAttribute('href').match(/\/gallog\/([^/]+)/);
            if (match) {
                const code = match[1];
                const span = getStyleSpan(code);
                link.appendChild(span);
                link.dataset.codeAdded = 'true';
            }
        });
    }

    // 댓글 닉네임 처리
    function addCommentCode() {
        // 댓글 닉네임 A 태그 탐색 (class="nick"과 /gallog/ 포함)
        const commentLinks = document.querySelectorAll('a.nick[href*="/gallog/"]');
        commentLinks.forEach(link => {
            if (link.dataset.codeAdded) return;
            
            const match = link.getAttribute('href').match(/\/gallog\/([^/]+)/);
            if (match) {
                const code = match[1];
                const span = getStyleSpan(code);
                link.appendChild(span);
                link.dataset.codeAdded = 'true';
            }
        });
    }

    // 모든 코드 추가 로직을 실행하는 메인 함수
    function runCodeAdders() {
        addListUserCode();
        addUserCode();
        addCommentCode();
    }
    
    // 초기 로드 시 한 번 실행
    runCodeAdders();

    // MutationObserver를 사용하여 동적으로 로드되는 콘텐츠에 대응
    const targetNode = document.getElementById('container') || document.body;
    
    // 컨테이너 또는 body 내부의 변화를 감지
    const observer = new MutationObserver(mutations => {
        // 성능 최적화를 위해 특정 변화가 있을 때만 실행하는 로직을 추가할 수도 있지만,
        // 간단함을 위해 변화 발생 시 전체 함수 실행을 유지합니다.
        runCodeAdders();
    });

    // 동적 로딩이 일어나는 컨테이너를 관찰 (댓글, 무한스크롤 등)
    observer.observe(targetNode, { childList: true, subtree: true });

})();
