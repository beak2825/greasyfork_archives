// ==UserScript==
// @name         국가법령정보센터 가독성 향상
// @namespace    https://github.com/explainpark101/law.go.kr.readability
// @version      1.6
// @description  국가법령정보센터 법령 본문의 줄간격, 문단 여백을 원본 CSS 구조에 맞게 최적화합니다.
// @author       explainpark101
// @match        https://*.law.go.kr/lsInfoP.do?*
// @match        https://*.law.go.kr/lsSc.do?*
// @match        https://*.law.go.kr/lsLinkCommonInfo.do?*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555814/%EA%B5%AD%EA%B0%80%EB%B2%95%EB%A0%B9%EC%A0%95%EB%B3%B4%EC%84%BC%ED%84%B0%20%EA%B0%80%EB%8F%85%EC%84%B1%20%ED%96%A5%EC%83%81.user.js
// @updateURL https://update.greasyfork.org/scripts/555814/%EA%B5%AD%EA%B0%80%EB%B2%95%EB%A0%B9%EC%A0%95%EB%B3%B4%EC%84%BC%ED%84%B0%20%EA%B0%80%EB%8F%85%EC%84%B1%20%ED%96%A5%EC%83%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    @font-face {
    font-family: 'Ridibatang';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff');
    font-weight: normal;
    font-display: swap;
}
        body, div, th, td, ol, ul, li, a, strong, span, input, select, textarea {
            font-family : Ridibatang !important;
        }

        /* 1. 콘텐츠 전체 영역(조문, 부칙)에 일관된 줄간격 적용 */
        /* 원본 .pgroup의 line-height:190%를 모든 p태그에 명시적으로 적용 */
        #conScroll .lawcon p,
        #conScroll #arDivArea p {
            line-height: 1.9 !important; /* 190% */
        }

        /* 2. [핵심] 조문 내의 문단(항, 호 등) 간의 수직 여백 추가 */
        /* 원본 CSS는 p 태그의 margin이 0이므로, 여기에 여백을 추가합니다. */
        #conScroll .lawcon p,
        #conScroll #arDivArea .pgroup p {
            margin-top: 0;
            margin-bottom: 0.75em; /* 기본 문단 간격 */
        }

        /* 3. 리스트 항목(항, 호) 간 여백 미세 조정 (조금 더 촘촘하게) */
        /* pty1_de2_1 (①), pty1_de2h (1.), pty1_de3 (가.) */
        #conScroll .lawcon p.pty1_de2_1,
        #conScroll .lawcon p.pty1_de2h,
        #conScroll .lawcon p.pty1_de3,
        #conScroll #arDivArea .pty3_dep1 { /* 부칙 항 */
            margin-bottom: 0.5em;
        }

        /* 4. 조항 제목(pty1_p4)과 본문 첫 줄 사이 여백 조정 */
        #conScroll .lawcon p.pty1_p4 {
            margin-bottom: 0.5em; /* 제목과 본문 사이는 좁게 */
        }

        /* 5. [개선] 조문/부칙 그룹의 마지막 p 태그 여백 제거 (이중 여백 방지) */
        /* 원본 .pgroup (margin-bottom: 22px)와 겹치지 않도록 */
        #conScroll .lawcon .pgroup p:last-child,
        #conScroll #arDivArea .pgroup p:last-child {
            margin-bottom: 0;
        }

        /* 6. 조문 그룹(pgroup) 하단 여백 및 구분선 */
        /* 원본의 margin-bottom: 22px을 padding-bottom으로 변경하여 구분선 포함 */
        #conScroll .pgroup {
            /* 원본 margin-bottom: 22px; 을 아래와 같이 재조정 */
            margin-bottom: 1.5em;  /* 조문 그룹 간 여백 */
            padding-bottom: 1.5em; /* 구분선과 내용 사이 여백 */
            border-bottom: 1px solid #eaeaea;
        }
        #conScroll .pgroup:last-of-type {
            border-bottom: none;
            margin-bottom: 0; /* 마지막 조문은 하단 여백 불필요 */
        }

        /* 7. [유지] '제n조(제목)' 이후 줄바꿈 추가 */
        #conScroll .lawcon .pty1_p4 .bl::after {
            content: '\\A';     /* CSS에서 줄바꿈 문자 */
            white-space: pre;  /* 줄바꿈 문자를 인식하도록 설정 */
        }

        /* 8. [유지] 개정/신설 이력 (sfon) 스타일 */
        #conScroll .sfon {
            color: #666;
            font-weight: 400;
        }

        /* 9. [유지] 조항 제목 굵게 처리 */
        /* 원본 CSS(.bl)에 이미 정의되어 있지만, Userscript에서 명시적으로 제어 */
        #conScroll .lawcon .pty1_p4 .bl {
            font-weight: 600;
        }

        div.pgroup p.pty1_de2h {
           padding: 0 0 0 calc(48px + 15px);
        }

        div.pgroup p.pty1_de3 {
            padding: 0 0 0 calc(65px + 17px);
        }
        div.pgroup p.pty1_de4_1 {
            padding: 0 0 0 calc(67px + 17px);
        }

        p {
            word-break: keep-all !important;
        }
    `;

    // 스타일 적용
    GM_addStyle(css);
})();