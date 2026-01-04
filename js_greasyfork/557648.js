// ==UserScript==
// @name         웹소설 URL 자동 최적화 (문피아 & 리디북스)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  문피아 모바일 링크를 PC 링크로 변환하고, 리디북스의 복잡한 URL을 깔끔한 목록 URL로 자동 변환합니다.
// @author       User
// @match        https://m.munpia.com/novel/detail/*
// @match        https://ridibooks.com/books/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557648/%EC%9B%B9%EC%86%8C%EC%84%A4%20URL%20%EC%9E%90%EB%8F%99%20%EC%B5%9C%EC%A0%81%ED%99%94%20%28%EB%AC%B8%ED%94%BC%EC%95%84%20%20%EB%A6%AC%EB%94%94%EB%B6%81%EC%8A%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557648/%EC%9B%B9%EC%86%8C%EC%84%A4%20URL%20%EC%9E%90%EB%8F%99%20%EC%B5%9C%EC%A0%81%ED%99%94%20%28%EB%AC%B8%ED%94%BC%EC%95%84%20%20%EB%A6%AC%EB%94%94%EB%B6%81%EC%8A%A4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // ---------------------------------------------
    // 1. 문피아 (Munpia) 로직
    // ---------------------------------------------
    if (currentUrl.includes('m.munpia.com')) {
        // 소설 ID 숫자 추출 (예: /novel/detail/492763)
        const munpiaRegex = /\/novel\/detail\/(\d+)/;
        const match = currentUrl.match(munpiaRegex);

        if (match && match[1]) {
            const novelId = match[1];
            const pcUrl = `https://novel.munpia.com/${novelId}`;

            // 모바일 페이지 로딩 방지를 위해 즉시 이동
            window.location.replace(pcUrl);
        }
    }

    // ---------------------------------------------
    // 2. 리디북스 (RidiBooks) 로직
    // ---------------------------------------------
    if (currentUrl.includes('ridibooks.com/books/')) {
        // 작품 ID 숫자 추출 (예: /books/425554025)
        const ridiRegex = /\/books\/(\d+)/;
        const match = currentUrl.match(ridiRegex);

        if (match && match[1]) {
            const bookId = match[1];
            
            // 목표 URL 형식 생성 (구매/목록 페이지)
            const targetUrl = `https://ridibooks.com/books/${bookId}?type=buy#formSeriesList`;

            // 현재 주소가 이미 목표 주소와 같다면 리디렉션 하지 않음 (무한 루프 방지)
            if (currentUrl !== targetUrl) {
                window.location.replace(targetUrl);
            }
        }
    }

})();