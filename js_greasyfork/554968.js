// ==UserScript==
// @name         아스텔리아M 출석
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  아스텔리아M 출석용
// @author       You
// @match        https://event.onstove.com/ko/dailyshop/ASTELLIA_IND/20*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554968/%EC%95%84%EC%8A%A4%ED%85%94%EB%A6%AC%EC%95%84M%20%EC%B6%9C%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/554968/%EC%95%84%EC%8A%A4%ED%85%94%EB%A6%AC%EC%95%84M%20%EC%B6%9C%EC%84%9D.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const $ = jQuery;
 
    function mainWork() {
        // 로그인 상태 확인
        const loginText = $("#login-btn .gnb-text-text").text().trim();
 
        if (loginText === "로그인") {
            console.log("미로그인 상태");
            return;
        }
 
        // 오늘의 아이템 받기 버튼 처리
        setTimeout(() => {
            const $target = $("span.stds-text").not(".whitespace-nowrap")
            .filter(function() { return $(this).text().trim() === "오늘의 아이템 받기"; });
 
            if ($target.length) {
                console.log("오늘의 아이템 받기 버튼 발견:", $target.first().text().trim());
                $target.first().click();
            }
        }, 2000);
    }
 
    setTimeout(() => {
        mainWork();
    }, 3000);
 
})();