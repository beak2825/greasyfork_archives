// ==UserScript==
// @name         치지직 라이브 에러 자동 새로고침 (지속 감시)
// @namespace    http://tampermonkey.net/
// @version      2025.09.13
// @description  라이브 재생 오류 감지 시 자동 새로고침 (다른 방송 이동 시에도 감시 유지)
// @match        *://chzzk.naver.com/live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549409/%EC%B9%98%EC%A7%80%EC%A7%81%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%97%90%EB%9F%AC%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%28%EC%A7%80%EC%86%8D%20%EA%B0%90%EC%8B%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549409/%EC%B9%98%EC%A7%80%EC%A7%81%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%97%90%EB%9F%AC%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%28%EC%A7%80%EC%86%8D%20%EA%B0%90%EC%8B%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const errorText = "라이브 재생 중 문제가 발생했습니다.";
    let lastReloadAt = 0; // 너무 잦은 새로고침 방지용

    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // strong 태그 또는 에러 텍스트 포함 여부 확인
                            const strong = node.querySelector?.("strong");
                            if (strong && strong.textContent.includes(errorText)) {
                                const now = Date.now();
                                if (now - lastReloadAt > 5000) { // 최소 5초 간격 제한
                                    console.log("[치지직 스크립트] 에러 감지됨 → 페이지 새로고침");
                                    lastReloadAt = now;
                                    location.reload();
                                } else {
                                    console.log("[치지직 스크립트] 에러 감지됐지만, 너무 빨라서 새로고침 무시");
                                }
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log("[치지직 스크립트] 에러 감시 시작됨");
    }

    // DOMContentLoaded 보장 후 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver);
    } else {
        startObserver();
    }
})();