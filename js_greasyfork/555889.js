// ==UserScript==
// @name         디시슬림모드
// @namespace    SlimDC
// @version      1.040
// @description        DCinside slimmode when browser width is small
// @license        GPL-3.0; https://www.gnu.org/licenses/gpl-3.0.txt
// @source        https://github.com/CleanDC/CleanDC
// @match        https://gall.dcinside.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555889/%EB%94%94%EC%8B%9C%EC%8A%AC%EB%A6%BC%EB%AA%A8%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/555889/%EB%94%94%EC%8B%9C%EC%8A%AC%EB%A6%BC%EB%AA%A8%EB%93%9C.meta.js
// ==/UserScript==

/*
* CleanDC 에서 파생됨
* https://github.com/CleanDC/CleanDC
* 원본 프로젝트는 GNU GPL v3.0 라이선스 하에 배포
* 이 유저스크립트 라이선스: GNU GPL v3.0 또는 그 이후
* CleanDC 원저작자에 저작권이 있음
*/

/*
* 기존 클린디씨의 슬림모드에서 변경된점
* dchead(로그인정보) 와 visit_bookmark(최근방문한 갤러리 목록)겹침 제거
* 갤러리 방문목록 및 즐겨찾기 반응형으로 변경
*/

(function() {
    'use strict';

    const css = `
    @media (max-width: 1110px) {
    html, body {
    }

    #search_wrap, .dc_logo {
        display: none;
    }
    .dchead {
        height: 30px;
    }
    .gnb_bar {
        display: none;
    }
    .right_content {
        display: none;
    }

    .list_wrap,
    .view_wrap {
        min-width: 840px;
    }

    .listwrap .issuebox .concept_wrap {
        display: none;
    }
    .listwrap .issue_contentbox {
        display: none;
    }

    .wrap_inner {
        width: 840px;
    }

    .width1160 .dchead,
    .width1160 .gnb,
    .width1160 #container,
    .width1160 .info_policy,
    .width1160 .copyright {
        width: 840px;
    }
    .width1160 .visit_bookmark {
        width: 100% !important;
        min-width: 840px;
    }
    .width1160 .newvisit_history {
        width: 100%;
    }
    .width1160 .under_catelist.newvisit_layer {
        width: 100%;
    }

    .visit_list {
        width: 680px;
    }
    .visit_list li a {
        width: 107px;
    }

    .dc_all {
        display: none;
    }

    #write_wrap {
        padding: 0;
        border: none;
    }

    .visit_history {
        width: 100%;
    }

    .cmt_nickbox {
        margin-right: 3px;
        width: 110px;
    }

    .usertxt,
    .comment_wrap .comment_dccon {
        width: 610px;
    }

    .reply .cmt_nickbox {
        margin-right: 3px;
        width: 110px;
    }

    .reply .usertxt,
    .reply .comment_wrap .comment_dccon {
        width: 540px;
    }

    .cmt_txt_cont textarea {
        width: 634px;
    }

    .cmt_write_box.small .cmt_txt_cont textarea {
        width: 602px;
    }
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
})();