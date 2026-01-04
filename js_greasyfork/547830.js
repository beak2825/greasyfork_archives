// ==UserScript==
// @name         네이버 카페 이미지 다운로드
// @namespace    https://cafe.naver.com/img/donwload
// @version      1.0
// @description  네이버 카페 이미지에 우클릭으로 이미지 저장 가능하게 해줌.
// @author       언네임드
// @match        https://cafe.naver.com/common/storyphoto/viewer.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547830/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/547830/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("img").onmousedown = null;
    document.body.oncontextmenu = null;

    // Your code here...
})();