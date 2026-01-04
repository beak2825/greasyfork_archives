// ==UserScript==
// @name         Force YouTube Login on Embeds (Corrected)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Changes www.youtube-nocookie.com embeds to www.youtube.com to enable logged-in features.
// @author       Your Mentor
// @match        https://chzzk.naver.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549405/Force%20YouTube%20Login%20on%20Embeds%20%28Corrected%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549405/Force%20YouTube%20Login%20on%20Embeds%20%28Corrected%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertNoCookieFrames() {
        const iframes = document.querySelectorAll('iframe[src*="youtube-nocookie.com"]');
        iframes.forEach(iframe => {
            // 'www.youtube-nocookie.com' 전체를 'www.youtube.com'으로 정확하게 교체합니다.
            iframe.src = iframe.src.replace('www.youtube-nocookie.com', 'www.youtube.com');
        });
    }

    // 페이지 로드 및 동적 콘텐츠 변경 시 스크립트 실행
    const observer = new MutationObserver(convertNoCookieFrames);
    observer.observe(document.body, { childList: true, subtree: true });

    // 초기 로드 시 실행
    convertNoCookieFrames();
})();