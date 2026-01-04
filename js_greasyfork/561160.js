// ==UserScript==
// @name         Zaiko Sidebar Nuker (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  채팅창 제거
// @author       You
// @match        https://zaiko.io/*
// @match        https://live.zaiko.services/*
// @icon         https://cdn-icons-png.flaticon.com/512/0/375.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561160/Zaiko%20Sidebar%20Nuker%20%28Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561160/Zaiko%20Sidebar%20Nuker%20%28Ultimate%29.meta.js
// ==/UserScript==



(function() {

    'use strict';



    const style = `
        /* 1. 사이드바와 모든 관련 부모 요소의 공간 점유 차단 */
        #theatreSidebar,
        .stream-sidebar,
        .sidebar-width,
        #__BVID__15,
        .tabs.stream-sidebar-bottom {
            display: none !important;
            width: 0px !important;
            min-width: 0px !important;
            max-width: 0px !important;
            flex: 0 0 0px !important;
            visibility: hidden !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }



        /* 2. 영상이 담긴 부모 컨테이너(row)의 flex 구조 재설정 */
        .row.flex-lg-nowrap {
            display: block !important; /* Flex 구조를 일반 블록으로 변경해 사이드바 공간 삭제 */
        }



        /* 3. 메인 영역을 화면 전체 너비로 강제 설정 */

        main, .stream-layout {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }



        /* 4. 비디오 프레임의 가로 제한 계산식 무력화 */

        .video_wrapper,
        .iframe-wrapper,
        .video.sticky-top {
            max-width: none !important;
            width: 100% !important;
            height: auto !important;
        }



        /* 5. 비디오 하단 여백이나 남은 레이아웃 정리 */

        #vue-component {
            height: auto !important;
        }
    `;



    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl);



    // ZAIKO의 동적 레이아웃 변경에 대응하기 위한 주기적 체크
    const cleanUp = () => {
        const sidebar = document.getElementById('theatreSidebar');
        if (sidebar) {
            sidebar.remove();
        }
    };

    setInterval(cleanUp, 500);

})();