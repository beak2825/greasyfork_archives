// ==UserScript==
// @name         SOOP 채팅 레이트 관리자
// @version      1.1.0
// @description  SOOP 채팅 속도 제한 확장 프로그램
// @author       SMI
// @match        https://play.sooplive.co.kr/*
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @license MIT
// @namespace https://greasyfork.org/users/1510796
// @downloadURL https://update.greasyfork.org/scripts/548707/SOOP%20%EC%B1%84%ED%8C%85%20%EB%A0%88%EC%9D%B4%ED%8A%B8%20%EA%B4%80%EB%A6%AC%EC%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/548707/SOOP%20%EC%B1%84%ED%8C%85%20%EB%A0%88%EC%9D%B4%ED%8A%B8%20%EA%B4%80%EB%A6%AC%EC%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastSent = 0;
    let pendingTimer = null;
    let isAutoSending = false;
    let active = true; // 활성화 상태
    const RATE_LIMIT = 850; // ms

    // 상태 표시 함수
    function showStatus(msg) {
        const emptyChat = document.getElementById('empty_chat');
        if (emptyChat) {
            const status = active ? '✅' : '⏸️';
            emptyChat.textContent = `${status} ${msg || ''} | F2:토글`;
            if (msg) {
                setTimeout(() => {
                    emptyChat.textContent = `${active ? '✅' : '⏸️'} | F2:토글`;
                }, 2000);
            }
        }
    }

    // 메시지 전송 함수
    function sendMessage() {
        const writeArea = document.getElementById('write_area');
        const sendBtn = document.getElementById('btn_send');

        if (writeArea && sendBtn && writeArea.textContent.trim()) {
            isAutoSending = true;
            sendBtn.click();
            lastSent = Date.now();
            isAutoSending = false;
        }
    }

    // 지연 전송 함수
    function scheduleMessage(content, timeToWait) {
        // 이미 대기 중인 타이머가 있으면 취소
        if (pendingTimer) {
            clearTimeout(pendingTimer);
        }

        // 입력창 내용 백업
        const writeArea = document.getElementById('write_area');
        if (!writeArea) return;

        // 대기 시간 표시
        const emptyChat = document.getElementById('empty_chat');
        if (emptyChat) {
            const status = active ? '✅' : '⏸️';
            emptyChat.textContent = `${status} ⏱ ${Math.ceil(timeToWait/100)/10}초 후 전송`;
        }

        // 지연 후 전송
        pendingTimer = setTimeout(() => {
            pendingTimer = null;
            if (active) { // 활성화 상태일 때만 전송
                writeArea.innerHTML = content;
                sendMessage();
            }
            showStatus();
        }, timeToWait);
    }

    // 엔터키 이벤트 가로채기
    document.addEventListener('keydown', function(e) {
        // F2 토글
        if (e.key === 'F2') {
            e.preventDefault();
            active = !active;
            showStatus(active ? '활성화' : '비활성화');

            // 비활성화 시 대기 중인 전송 취소
            if (!active && pendingTimer) {
                clearTimeout(pendingTimer);
                pendingTimer = null;
            }
            return;
        }

        // 엔터키 처리 (활성화 상태일 때만)
        if (e.key === 'Enter' && !e.shiftKey && !isAutoSending && active) {
            const writeArea = document.getElementById('write_area');
            if (!writeArea || !writeArea.textContent.trim()) return;

            const timeSinceLastSent = Date.now() - lastSent;
            const timeToWait = RATE_LIMIT - timeSinceLastSent;

            if (timeToWait > 0) {
                e.preventDefault();
                e.stopPropagation();

                // 현재 내용 저장 후 지연 전송 예약
                const content = writeArea.innerHTML;
                writeArea.innerHTML = '';
                scheduleMessage(content, timeToWait);
            } else {
                lastSent = Date.now();
            }
        }
    }, true);

    // 전송 버튼 클릭 가로채기
    document.addEventListener('click', function(e) {
        const sendBtn = document.getElementById('btn_send');
        if (e.target === sendBtn && !isAutoSending && active) {
            const writeArea = document.getElementById('write_area');
            if (!writeArea || !writeArea.textContent.trim()) return;

            const timeSinceLastSent = Date.now() - lastSent;
            const timeToWait = RATE_LIMIT - timeSinceLastSent;

            if (timeToWait > 0) {
                e.preventDefault();
                e.stopPropagation();

                // 현재 내용 저장 후 지연 전송 예약
                const content = writeArea.innerHTML;
                writeArea.innerHTML = '';
                scheduleMessage(content, timeToWait);
            } else {
                lastSent = Date.now();
            }
        }
    }, true);

    // 초기 상태 표시
    setTimeout(() => showStatus(), 1000);

})();