// ==UserScript==
// @name         KU LMS 설문조사 스킵
// @namespace    https://lms.korea.ac.kr/lms_term_surveys
// @version      1.0
// @description  고려대학교 LMS 학기중간 설문조사 페이지 스킵
// @author       You
// @match        https://lms.korea.ac.kr/lms_term_surveys?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/553145/KU%20LMS%20%EC%84%A4%EB%AC%B8%EC%A1%B0%EC%82%AC%20%EC%8A%A4%ED%82%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/553145/KU%20LMS%20%EC%84%A4%EB%AC%B8%EC%A1%B0%EC%82%AC%20%EC%8A%A4%ED%82%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get("return_url"))
        return location.href = searchParams.get("return_url");
    document.querySelctor(".blue")?.click();

    // https://lms.korea.ac.kr/lms_term_surveys?from=lx&token=5Nb1F5HJrIh3uZhPB59w0KtbaWJs1V3B4OaVcm0FXcQrpGPQyDqnL86d85HdzlJT%2FpGX608cnK1u0JI%2BoDLFmhxc3nkcrOWTwt8%2BmrrQKB0%3D


    // Your code here...
})();