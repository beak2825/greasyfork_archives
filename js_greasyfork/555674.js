// ==UserScript==
// @name         LIMS 인쇄 레이아웃 수정 (페이지 나뉨 오류)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  인쇄 시 페이지 나뉨 오류 수정 및 컨테이너 속성 초기화로 공간 최적화
// @author       김재형
//
// @match        https://lims3.macrogen.com/ngs/library/retrieveWorksheetDetailsPrint.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveWorksheetPrintPopup.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveWorksheetPrintPopup.do*
// @match        https://lims3.macrogen.com/ngs/human/retrieveHumanAnalysisSheetPrintPopup.do*
//
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555674/LIMS%20%EC%9D%B8%EC%87%84%20%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83%20%EC%88%98%EC%A0%95%20%28%ED%8E%98%EC%9D%B4%EC%A7%80%20%EB%82%98%EB%89%A8%20%EC%98%A4%EB%A5%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555674/LIMS%20%EC%9D%B8%EC%87%84%20%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83%20%EC%88%98%EC%A0%95%20%28%ED%8E%98%EC%9D%B4%EC%A7%80%20%EB%82%98%EB%89%A8%20%EC%98%A4%EB%A5%98%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // @media print 규칙을 포함하여, 인쇄 시에만 적용될 CSS를 주입합니다.
    GM_addStyle(`
        @media print {
            /* 1. 테이블 및 행/칸의 강제 나뉨 방지 해제 및 자동 계산 유도 */
            #tbody tr, #tbody td,
            tbody tr, tbody td,
            table, tbody {
                page-break-inside: auto !important;
                break-inside: auto !important;
                page-break-after: auto !important;
                page-break-before: auto !important;
            }

            /* 2. 브라우저가 공간을 잘못 계산하게 만드는 가로/세로 제한 해제 */
            /* LIMS 팝업 및 메인 컨테이너들의 레이아웃을 인쇄에 최적화된 블록 형태로 변경 */
            html, body, #container, #content, .content, .popup_content, [id*="wrap"], [class*="wrap"] {
                height: auto !important;
                min-height: auto !important;
                overflow: visible !important;
                display: block !important;
            }

            /* 3. 테이블 레이아웃 최적화 */
            table {
                display: table !important;
                width: 100% !important;
                border-collapse: collapse !important;
                table-layout: auto !important;
            }
        }
    `);
})();