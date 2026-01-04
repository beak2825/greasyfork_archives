// ==UserScript==
// @name         투디갤 캡쳐방지 완전 제거 (Strong Mode)
// @version      2.0
// @description  CSS 가상 요소와 숨겨진 텍스트까지 찾아내어 캡쳐방지 문구를 삭제합니다.
// @match        https://tdgall.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1544220
// @downloadURL https://update.greasyfork.org/scripts/557791/%ED%88%AC%EB%94%94%EA%B0%A4%20%EC%BA%A1%EC%B3%90%EB%B0%A9%EC%A7%80%20%EC%99%84%EC%A0%84%20%EC%A0%9C%EA%B1%B0%20%28Strong%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557791/%ED%88%AC%EB%94%94%EA%B0%A4%20%EC%BA%A1%EC%B3%90%EB%B0%A9%EC%A7%80%20%EC%99%84%EC%A0%84%20%EC%A0%9C%EA%B1%B0%20%28Strong%20Mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetKeyword = "캡쳐방지";

    function removeDeepWatermarks() {
        const allElements = document.querySelectorAll('*');

        allElements.forEach(el => {
            // 1. CSS 가상 요소(::before, ::after)에 숨겨진 텍스트 확인
            const beforeStyle = window.getComputedStyle(el, '::before').content;
            const afterStyle = window.getComputedStyle(el, '::after').content;

            if ((beforeStyle && beforeStyle.includes(targetKeyword)) ||
                (afterStyle && afterStyle.includes(targetKeyword))) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                return; // 찾았으면 다음 요소로
            }

            // 2. 일반 텍스트 확인 (공백 제거 후 검사)
            // 본문 통삭제 방지를 위해, 자식 요소가 없거나 적은 경우만 타겟팅
            if (el.children.length < 3 && el.innerText) {
                const cleanText = el.innerText.replace(/\s+/g, ''); // 공백/엔터 제거
                if (cleanText.includes(targetKeyword)) {
                    el.style.setProperty('display', 'none', 'important');
                    el.style.setProperty('visibility', 'hidden', 'important');
                }
            }
        });
    }

    // 1. 즉시 실행
    removeDeepWatermarks();

    // 2. 1초마다 반복 실행 (스크롤 내리거나 뒤늦게 뜨는 것 방지)
    setInterval(removeDeepWatermarks, 1000);
})();
