// ==UserScript==
// @name         Chzzk Timemachine Chat Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  과거 시점 재생 중일 때 채팅 입력창 비활성화 및 안내 문구 표시
// @match        https://chzzk.naver.com/live/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/554352/Chzzk%20Timemachine%20Chat%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/554352/Chzzk%20Timemachine%20Chat%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('치지직 타임머신 감지 스크립트 실행 중');

    // ===== 핵심 함수 =====
    function checkState() {
        const liveBtn = document.querySelector('.live_time_button');
        const chatContainer = [...document.querySelectorAll('div[class^="live_chatting_input_container__"]')][0];
        const chatInput = [...document.querySelectorAll('textarea[class^="live_chatting_input_input__"]')][0];

        if (!liveBtn || !chatContainer || !chatInput) return;

        const isLive = liveBtn.classList.contains('on');

        if (!isLive) {
            // 과거 시점 → 채팅 비활성화
            chatContainer.style.pointerEvents = 'none';
            chatContainer.style.opacity = '0.5';
            chatInput.placeholder = '타임머신 시청 중';
        } else {
            // 실시간 → 채팅 활성화
            chatContainer.style.pointerEvents = '';
            chatContainer.style.opacity = '';
            chatInput.placeholder = '메시지를 입력하세요...';
        }
    }

    // ===== 옵저버 설정 =====
    function initObserver() {
        const target = document.querySelector('.pzp-pc__bottom-buttons-left');
        if (!target) {
            // 아직 로드 전이면 재시도
            setTimeout(initObserver, 1000);
            return;
        }

        // 최초 상태 확인
        checkState();

        const observer = new MutationObserver(() => {
            checkState();
        });
        observer.observe(target, { childList: true, subtree: true, attributes: true });

        console.log('✅ pzp-pc__bottom-buttons-left 영역 감시 시작');
    }

    // ===== 초기 실행 =====
    initObserver();

    // SPA 페이지 전환 시를 대비한 주기적 상태 확인
    setInterval(checkState, 2000);
})();
