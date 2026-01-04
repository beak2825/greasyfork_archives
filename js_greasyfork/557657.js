// ==UserScript==
// @name         시리즈 이펍 설치창 자동 닫기
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  네이버 시리즈 ePub 설치 가이드 창이 뜨면 강력하게 닫습니다.
// @author       User
// @match        https://series.naver.com/booksviewer/html/nstore/epub_install_guide.html*
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557657/%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EC%9D%B4%ED%8E%8D%20%EC%84%A4%EC%B9%98%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EB%8B%AB%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557657/%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EC%9D%B4%ED%8E%8D%20%EC%84%A4%EC%B9%98%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EB%8B%AB%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 창 닫기 함수 (여러가지 방법을 모두 동원)
    function killPopup() {
        try {
            // 브라우저가 '닫기'를 거부하는 것을 막기 위한 우회술
            window.open('','_self').close();
            
            // 일반적인 닫기
            window.close();
            self.close();
            
            // 네이버 팝업 내부 함수가 있다면 호출 시도 (혹시 모를 상황 대비)
            if (typeof window.close === 'function') {
                window.close();
            }
        } catch (e) {
            console.error("Closing attempt failed:", e);
        }
    }

    // 1. 실행 되자마자 콘텐츠 로딩 강제 중지
    try {
        window.stop();
    } catch (e) {}

    // 2. 화면을 즉시 하얗게 지움 (깜빡임 방지)
    if (document.documentElement) {
        document.documentElement.innerHTML = "";
        document.documentElement.style.backgroundColor = "white";
    }

    // 3. 즉시 닫기 시도
    killPopup();

    // 4. 창이 닫힐 때까지 0.05초마다 계속 닫기 시도 (끈질기게)
    const killInterval = setInterval(() => {
        killPopup();
        // 창이 닫혔는지 확인하기 어려우므로, 3초 뒤에는 인터벌 해제 (메모리 누수 방지)
    }, 50);

    // 5. 3초 뒤 인터벌 종료
    setTimeout(() => {
        clearInterval(killInterval);
    }, 3000);

    // 6. DOMContentLoaded, load 이벤트 발생 시에도 닫기 시도 (안전장치)
    window.addEventListener('DOMContentLoaded', killPopup);
    window.addEventListener('load', killPopup);

})();