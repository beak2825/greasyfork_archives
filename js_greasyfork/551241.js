// ==UserScript==
// @name         마작일번가
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  스토브 스토어 출석
// @author       You
// @match        https://event.onstove.com/ko/dailyshop/RIICHICITY_IND/2026*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551241/%EB%A7%88%EC%9E%91%EC%9D%BC%EB%B2%88%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/551241/%EB%A7%88%EC%9E%91%EC%9D%BC%EB%B2%88%EA%B0%80.meta.js
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
    // ✅ 새 탭에 링크 열기 예시
    
        //window.open("https://event.onstove.com/ko/dailyshop/ASTELLIA_IND/202601", "_blank");
    }

    setTimeout(() => {
        mainWork();
    }, 3000);

})();