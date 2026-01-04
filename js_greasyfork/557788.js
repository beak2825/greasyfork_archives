// ==UserScript==
// @name         투디갤 캡쳐방지 제거 (TDGall Cleaner)
// @version      1.0
// @description  투디갤의 '캡쳐방지' 텍스트 레이어를 제거합니다.
// @match        https://tdgall.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1544220
// @downloadURL https://update.greasyfork.org/scripts/557788/%ED%88%AC%EB%94%94%EA%B0%A4%20%EC%BA%A1%EC%B3%90%EB%B0%A9%EC%A7%80%20%EC%A0%9C%EA%B1%B0%20%28TDGall%20Cleaner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557788/%ED%88%AC%EB%94%94%EA%B0%A4%20%EC%BA%A1%EC%B3%90%EB%B0%A9%EC%A7%80%20%EC%A0%9C%EA%B1%B0%20%28TDGall%20Cleaner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const clean = () => {
        document.querySelectorAll('div, p, span').forEach(el => {
            // '캡쳐방지' 텍스트가 있고, 하위 태그가 없는(말단) 요소만 타겟팅
            if (el.textContent.includes('캡쳐방지') && el.children.length === 0) {
                el.style.display = 'none';
            }
        });
    };
    clean();
    // 스크롤 내릴 때 생기는 것도 감지해서 삭제
    new MutationObserver(clean).observe(document.body, {childList: true, subtree: true});
})();
