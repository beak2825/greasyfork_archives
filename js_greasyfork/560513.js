// ==UserScript==
// @name         나무위키 신고 게시판 카테고리 색상 변경
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  신고 게시판에서 카테고리별 배경색 변경: 신고(빨간색), 완료(기존 그대로), 보류(회색)
// @author       You
// @match        https://board.namu.wiki/b/report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560513/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EC%8B%A0%EA%B3%A0%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%20%EC%83%89%EC%83%81%20%EB%B3%80%EA%B2%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560513/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EC%8B%A0%EA%B3%A0%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%20%EC%83%89%EC%83%81%20%EB%B3%80%EA%B2%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 카테고리 배지 색상 변경 함수
    function updateCategoryColors() {
        // 모든 badge-success 요소 선택
        const badges = document.querySelectorAll('.badge.badge-success');

        badges.forEach(badge => {
            const text = badge.textContent.trim();

            // 텍스트에 키워드가 포함되어 있는지 확인 (이모지 대응)
            if (text.includes('신고')) {
                // 빨간색 배경
                badge.style.backgroundColor = '#dc3545';
                badge.style.color = '#ffffff';
            } else if (text.includes('보류')) {
                // 회색 배경
                badge.style.backgroundColor = '#6c757d';
                badge.style.color = '#ffffff';
            } else if (text.includes('완료')) {
                // 기존 그대로 (greenish badge-success 유지)
                // 아무 변경 없음
            }
        });
    }

    // 페이지 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCategoryColors);
    } else {
        updateCategoryColors();
    }

    // 동적으로 로드되는 콘텐츠를 위한 MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                updateCategoryColors();
            }
        });
    });

    // body 감시 시작
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
