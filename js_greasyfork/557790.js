// ==UserScript==
// @name         Tdgall Watermark Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  투디갤 캡쳐방지 아이피 문구 제거
// @author       You
// @match        https://tdgall.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tdgall.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557790/Tdgall%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/557790/Tdgall%20Watermark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetText = "캡쳐방지"; // 제거할 타겟 텍스트

    function removeWatermarks() {
        // 페이지 내의 모든 div, p, span 요소를 탐색
        const elements = document.querySelectorAll('div, p, span');

        elements.forEach(el => {
            // 1. 해당 요소에 "캡쳐방지" 텍스트가 있고
            // 2. 자식 요소가 너무 많지 않은(본문 통째로 삭제 방지) 경우
            if (el.textContent.includes(targetText) && el.children.length === 0) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                // 필요하다면 아예 DOM에서 제거: el.remove();
            }
        });
    }

    // 1. 페이지 로드 시 최초 실행
    removeWatermarks();

    // 2. 동적으로 로딩되는 콘텐츠(무한 스크롤 등) 대응을 위한 감시자 설정
    const observer = new MutationObserver((mutations) => {
        removeWatermarks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
