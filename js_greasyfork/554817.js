// ==UserScript==
// @name         페이지 불필요 요소 숨기기
// @namespace    https://greasyfork.org/users/000000
// @version      1.0.0
// @description  특정 영역을 숨깁니다
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554817/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EB%B6%88%ED%95%84%EC%9A%94%20%EC%9A%94%EC%86%8C%20%EC%88%A8%EA%B8%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/554817/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EB%B6%88%ED%95%84%EC%9A%94%20%EC%9A%94%EC%86%8C%20%EC%88%A8%EA%B8%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    #bannerList,
    [style] ~ ul,
    .notice,
    #footer_wrap,
    #bnb_wrap,
    #bo_vc,
    #bo_v_atc {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})();
