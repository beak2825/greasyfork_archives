// ==UserScript==
// @name         Chzzk Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  방송 중임에도 영상이 10초 이상 멈춰있거나(리방 오류 등), 새로 시작될 때 알림을 띄웁니다.
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

    // [설정 구역]
    const CHECK_INTERVAL = 3000;      // 3초마다 상태 확인
    const COOLDOWN_TIME = 120000;     // 방송 종료 후 2분간 알림 금지 (쿨다운)
    const AUTO_REFRESH_SECONDS = 5;   // 알림창 뜬 후 자동 새로고침까지 대기 시간

    // [중요] 3초 간격 x 4회 = 약 12초 동안 영상이 멈춰있으면 알림 발생
    // 리방 후 로딩이 꼬여서 10초 이상 멍하니 있는 경우를 잡기 위함입니다.
    const STUCK_THRESHOLD = 4;

    let isPageLoaded = false;
    let hasAlerted = false;
    let lastPlayingTime = 0;
    let cooldownUntil = 0;
    let consecutiveStuckCount = 0;
    let previousApiStatus = null;
    let worker = null;
    let fallbackIntervalId = null;

    // 페이지 로드 후 5초 대기 (안정화)
    setTimeout(() => {
        isPageLoaded = true;
        tryStartEngine();
    }, 5000);

    // --- 엔진 시동 (AdGuard/Tampermonkey 호환) ---
    function tryStartEngine() {
        try {
            const workerScript = `
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        setInterval(function() {
                            self.postMessage('tick');
                        }, ${CHECK_INTERVAL});
                    }
                };
            `;
            const blob = new Blob([workerScript], { type: 'application/javascript' });
            worker = new Worker(URL.createObjectURL(blob));

            worker.onmessage = function(e) {
                if (e.data === 'tick') checkLiveStatus();
            };

            worker.onerror = function() {
                console.warn("⚠️ [Auto Refresh] Worker 에러. 타이머 전환.");
                startFallbackTimer();
            };

            worker.postMessage('start');
            console.log("🟢 [Auto Refresh] Web Worker 모드로 감시 시작");

        } catch (error) {
            console.warn("⚠️ [Auto Refresh] Worker 차단됨. 일반 타이머 사용.");
            startFallbackTimer();
        }
    }

    function startFallbackTimer() {
        if (fallbackIntervalId) clearInterval(fallbackIntervalId);
        if (worker) { worker.terminate(); worker = null; }
        fallbackIntervalId = setInterval(checkLiveStatus, CHECK_INTERVAL);
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

    // 영상 재생 여부 판별 (재생 중이면 true, 멈춤/오류면 false)
    function isVideoPlaying() {
        const video = document.querySelector('video');
        if (!video) return false;
        // paused가 아니고, 데이터가 충분하며, 시간이 흐르고 있어야 함
        return !video.paused && video.readyState > 2 && video.currentTime > 0;
    }

    function forceReload() {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('refresh', Date.now());
        window.location.href = currentUrl.toString();
    }

    // --- 커스텀 알림창 ---
    function showCustomModal(reason) {
        const modalStyle = `
            position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
            background: #1e1e1e; color: white; padding: 25px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7); z-index: 999999;
            text-align: center; font-family: 'Pretendard', sans-serif; min-width: 350px;
            border: 1px solid #444;
        `;
        const btnBaseStyle = `
            padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;
            font-weight: bold; margin: 0 5px; font-size: 14px;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = modalStyle;
        modal.innerHTML = `
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #00ffa3;">📢 방송 상태 확인</h2>
            <p style="margin: 5px 0; font-size: 15px; font-weight: bold;">${reason}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #ccc;">오류 해결을 위해 새로고침이 필요할 수 있습니다.</p>
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
            if (worker) worker.terminate();
            if (fallbackIntervalId) clearInterval(fallbackIntervalId);
            modal.remove();
            alert("자동 감지가 취소되었습니다. 다시 켜려면 페이지를 수동으로 새로고침하세요.");
        };
    }

    // --- 메인 감지 로직 ---
    async function checkLiveStatus() {
        if (!isValidLiveUrl()) return;
        if (!isPageLoaded || hasAlerted) return;
        if (Date.now() < cooldownUntil) return;

        // 1. 영상이 정상 재생 중인 경우
        if (isVideoPlaying()) {
            lastPlayingTime = Date.now();
            consecutiveStuckCount = 0; // 카운트 초기화
            previousApiStatus = 'OPEN';
            return;
        }

        // 2. 방송 종료 판단 (방금 전까지 보다가 끊긴 경우)
        if (lastPlayingTime > 0 && (Date.now() - lastPlayingTime < 30000)) {
            console.warn("🛑 방송 종료 감지. 2분 쿨다운.");
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
            const currentStatus = data.content?.status; // 'OPEN' or 'CLOSE'

            if (currentStatus === 'OPEN') {
                // A. 완전한 방송 시작 (CLOSE -> OPEN)
                if (previousApiStatus === 'CLOSE') {
                    console.warn("🚨 [EVENT] 방송 시작 감지 (즉시)");
                    hasAlerted = true;
                    document.title = "🔴 방송 시작!!";
                    showCustomModal("방송이 시작되었습니다!");
                    return;
                }

                // B. 방송 중인데 영상이 안 나오는 경우 (리방 오류, 로딩 지연 등)
                consecutiveStuckCount++;
                console.log(`⚠️ 방송 중 / 영상 멈춤 감지 중... (${consecutiveStuckCount}/${STUCK_THRESHOLD})`);

                // 4회 연속(약 12초) 멈춰있으면 알림
                if (consecutiveStuckCount >= STUCK_THRESHOLD) {
                    console.warn("🚨 [EVENT] 장시간 멈춤(리방 오류 등) 감지");
                    hasAlerted = true;
                    showCustomModal("방송 중이나 영상 재생이 멈춰있습니다.");
                }

            } else {
                // 방송이 꺼져있으면 카운트 초기화
                consecutiveStuckCount = 0;
            }

            previousApiStatus = currentStatus;

        } catch (error) {
            console.error("❌ 에러:", error);
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible' && !hasAlerted) {
            checkLiveStatus();
        }
    });

    console.log("🟢 [Auto Refresh] v3.2 로드됨 (리방 멈춤 해결)");

})();