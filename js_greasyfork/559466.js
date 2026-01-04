// ==UserScript==
// @name         호연학사 설문 대충하기
// @namespace    http://tampermonkey.net/
// @version      2025-12-19
// @description  호연학사 기숙사 퇴사귀가 설문 대충 3번으로 찍어줌
// @author       explainpark101
// @match        https://dormitel.korea.ac.kr/user/addSurvey.do?command=join&siteId=hoyeon&isRandom=NO&handle=5&parent=&id=*&ipsaId=217&classNum=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/559466/%ED%98%B8%EC%97%B0%ED%95%99%EC%82%AC%20%EC%84%A4%EB%AC%B8%20%EB%8C%80%EC%B6%A9%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559466/%ED%98%B8%EC%97%B0%ED%95%99%EC%82%AC%20%EC%84%A4%EB%AC%B8%20%EB%8C%80%EC%B6%A9%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(`[value="3"][type="radio"][id^="question"]`).forEach(el=>el.click());
    document.querySelectorAll(`[value="1"][type="checkbox"][id^="question"]`).forEach(el=>el.click());
    document.querySelectorAll(`textarea`).forEach(el=>el.value='없음');
    // Your code here...
})();