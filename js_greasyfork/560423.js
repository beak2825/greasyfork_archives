// ==UserScript==
// @name         header-bar inert 제거 + z-index 설정
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1
// @description  header-bar 요소의 inert 속성을 제거하고 z-index를 9로 설정합니다.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560423/header-bar%20inert%20%EC%A0%9C%EA%B1%B0%20%2B%20z-index%20%EC%84%A4%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/560423/header-bar%20inert%20%EC%A0%9C%EA%B1%B0%20%2B%20z-index%20%EC%84%A4%EC%A0%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function fixHeaderBar() {
    const el = document.getElementById('header-bar');
    if (!el) return;

    // inert 제거
    if (el.hasAttribute('inert')) {
      el.removeAttribute('inert');
    }

    // z-index 강제 적용
    el.style.zIndex = '9';
  }

  // 최초 실행
  fixHeaderBar();

  // DOM 변경 감지
  const observer = new MutationObserver(() => {
    fixHeaderBar();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
  });
})();