// ==UserScript==
// @name         Chzzk Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Web Worker를 사용하여 백그라운드 탭에서도 멈추지 않고 방송 시작을 감지합니다.
// @author       You
// @match        https://chzzk.naver.com/live/*
// @icon         https://ssl.pstatic.net/static/nng/glive/icon/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563234/Chzzk%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/563234/Chzzk%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 설정
    const CHECK_INTERVAL = 3000;      // 3초마다 체크
    const COOLDOWN_TIME = 120000;     // 방송 종료 후 2분 대기
    const AUTO_REFRESH_SECONDS = 5;   // 자동 새로고침 대기 시간
    const STUCK_THRESHOLD = 3;        // 로딩 오탐 방지 카운트

    let isPageLoaded = false;
    let hasAlerted = false;
    let lastPlayingTime = 0;
    let cooldownUntil = 0;
    let consecutiveStuckCount = 0;
    let previousApiStatus = null;
    let worker = null; // Web Worker 변수

    // 페이지 로드 후 5초 대기
    setTimeout(() => {
        isPageLoaded = true;
        console.log("🟢 [Auto Refresh] 감시 시작 (Worker 모드)");
        startWorker(); // Worker 가동 시작
    }, 5000);

    // --- Web Worker 설정 (백그라운드 스로틀링 회피용) ---
    function startWorker() {
        // Worker 내부 스크립트 정의 (별도의 쓰레드에서 돕니다)
        const workerScript = `
            self.onmessage = function(e) {
                if (e.data === 'start') {
                    setInterval(function() {
                        self.postMessage('tick');
                    }, ${CHECK_INTERVAL});
                }
            };
        `;

        // Blob으로 Worker 생성
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        worker = new Worker(URL.createObjectURL(blob));

        // Worker가 신호를 보낼 때마다 메인 로직 실행
        worker.onmessage = function(e) {
            if (e.data === 'tick') {
                checkLiveStatus();
            }
        };

        // 타이머 시작 명령
        worker.postMessage('start');
    }

    // --- 유틸리티 ---
    function isValidLiveUrl() {
        return /^\/live\/[^/]+$/.test(window.location.pathname);
    }

    function getChannelId() {
        const path = window.location.pathname.split('/');
        const liveIndex = path.indexOf('live');
        if (liveIndex !== -1 && path[liveIndex + 1]) return path[liveIndex + 1];
        return null;
    }

    function isVideoPlaying() {
        const video = document.querySelector('video');
        if (!video) return false;
        return !video.paused && video.readyState > 2 && video.currentTime > 0;
    }

    function forceReload() {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('refresh', Date.now());
        window.location.href = currentUrl.toString();
    }

    // --- 알림창 ---
    function showCustomModal(reason) {
        const modalStyle = `
            position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
            background: #1e1e1e; color: white; padding: 25px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7); z-index: 999999;
            text-align: center; font-family: 'Pretendard', sans-serif; min-width: 340px;
            border: 1px solid #444;
        `;
        const btnBaseStyle = `
            padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;
            font-weight: bold; margin: 0 5px; font-size: 14px;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = modalStyle;
        modal.innerHTML = `
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #00ffa3;">📢 방송이 감지되었습니다</h2>
            <p style="margin: 5px 0; font-size: 14px; color: #ccc;">(${reason})</p>
            <p id="czk_timer_msg" style="margin: 15px 0; font-size: 14px; color: #ffcc00;">${AUTO_REFRESH_SECONDS}초 뒤 자동으로 새로고침됩니다.</p>
            <div style="margin-top: 20px;">
                <button id="czk_refresh_btn" style="${btnBaseStyle} background: #00ffa3; color: #000;">새로고침</button>
                <button id="czk_cancel_btn" style="${btnBaseStyle} background: #555; color: #fff;">취소</button>
            </div>
        `;
        document.body.appendChild(modal);

        let timeLeft = AUTO_REFRESH_SECONDS;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            const msgEl = document.getElementById('czk_timer_msg');
            if (msgEl) msgEl.innerText = `${timeLeft}초 뒤 자동으로 새로고침됩니다.`;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                forceReload();
            }
        }, 1000);

        document.getElementById('czk_refresh_btn').onclick = () => {
            clearInterval(countdownInterval);
            forceReload();
        };

        document.getElementById('czk_cancel_btn').onclick = () => {
            clearInterval(countdownInterval);
            if (worker) worker.terminate(); // Worker 종료
            modal.remove();
            console.log("🚫 감지 중단됨.");
            alert("자동 새로고침이 취소되었습니다.");
        };
    }

    // --- 메인 로직 ---
    async function checkLiveStatus() {
        if (!isValidLiveUrl()) return;
        if (!isPageLoaded || hasAlerted) return;
        if (Date.now() < cooldownUntil) return;

        if (isVideoPlaying()) {
            lastPlayingTime = Date.now();
            consecutiveStuckCount = 0;
            previousApiStatus = 'OPEN';
            return;
        }

        if (lastPlayingTime > 0 && (Date.now() - lastPlayingTime < 30000)) {
            console.warn("🛑 방송 종료. 2분 대기");
            cooldownUntil = Date.now() + COOLDOWN_TIME;
            lastPlayingTime = 0;
            previousApiStatus = 'CLOSE';
            return;
        }

        const channelId = getChannelId();
        if (!channelId) return;

        try {
            const response = await fetch(`https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`);
            const data = await response.json();
            const currentStatus = data.content?.status;

            if (currentStatus === 'OPEN') {
                // A. 방송 시작 즉시 감지 (이전 상태가 CLOSE 였을 때)
                if (previousApiStatus === 'CLOSE') {
                    console.warn("🚨 [EVENT] 방송 시작 감지 (Wake Up!)");
                    hasAlerted = true;
                    showCustomModal("방송이 시작되었습니다!");

                    // [추가] 혹시나 브라우저 탭이 자고 있을 때를 대비해 소리로 깨우거나 타이틀을 변경할 수도 있음
                    document.title = "🔴 방송 시작!!";
                    return;
                }

                // B. 로딩 중 오탐 방지 (3회 체크)
                consecutiveStuckCount++;
                console.log(`⚠️ 방송 중/화면 멈춤 (${consecutiveStuckCount}/${STUCK_THRESHOLD})`);

                if (consecutiveStuckCount >= STUCK_THRESHOLD) {
                    hasAlerted = true;
                    showCustomModal("화면이 멈춰있어 새로고침합니다.");
                }

            } else {
                consecutiveStuckCount = 0;
            }

            previousApiStatus = currentStatus;

        } catch (error) {
            console.error("❌ 에러:", error);
        }
    }

    // [보너스] 사용자가 탭을 다시 클릭했을 때(화면 복귀 시) 즉시 한 번 더 체크
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible' && !hasAlerted) {
            console.log("👀 탭 활성화 감지: 즉시 상태 확인");
            checkLiveStatus();
        }
    });

    console.log("🟢 [Auto Refresh] v3.0 로드됨 (강력한 백그라운드 감지)");

})();