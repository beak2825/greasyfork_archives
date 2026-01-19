// ==UserScript==
// @name         Chzzk Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  방송 시작은 즉시 감지하고,새로고침합니다.
// @author       떱_
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
    const STUCK_THRESHOLD = 3;        // 이미 켜진 방송에서 멈춤 판단 기준 (3회)

    let isPageLoaded = false;
    let hasAlerted = false;
    let lastPlayingTime = 0;
    let cooldownUntil = 0;
    let mainIntervalId = null;
    let consecutiveStuckCount = 0;
    
    // [신규] 이전 방송 상태 기록 (null / 'OPEN' / 'CLOSE')
    let previousApiStatus = null;

    // 페이지 로드 후 5초 대기
    setTimeout(() => {
        isPageLoaded = true;
        console.log("🟢 [Auto Refresh] 감시 시작");
    }, 5000);

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

    // 강력 새로고침 (Cache Busting)
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
            if (mainIntervalId) clearInterval(mainIntervalId);
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

        // 1. 영상 시청 중
        if (isVideoPlaying()) {
            lastPlayingTime = Date.now();
            consecutiveStuckCount = 0;
            previousApiStatus = 'OPEN'; // 보고 있으면 당연히 OPEN
            return;
        }

        // 2. 방송 종료 판단
        if (lastPlayingTime > 0 && (Date.now() - lastPlayingTime < 30000)) {
            console.warn("🛑 방송 종료. 2분 대기");
            cooldownUntil = Date.now() + COOLDOWN_TIME;
            lastPlayingTime = 0;
            previousApiStatus = 'CLOSE'; // 종료되었으므로 상태 업데이트
            return;
        }

        // 3. API 체크
        const channelId = getChannelId();
        if (!channelId) return;

        try {
            const response = await fetch(`https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`);
            const data = await response.json();
            const currentStatus = data.content?.status;

            if (currentStatus === 'OPEN') {
                // [핵심 로직]
                // Case A: 방금 전까지 'CLOSE' 였다가 'OPEN'이 됨 -> 방송 시작! (즉시 발동)
                if (previousApiStatus === 'CLOSE') {
                    console.warn("🚨 [EVENT] 방송 시작 감지 (즉시 반응)");
                    hasAlerted = true;
                    showCustomModal("방송이 시작되었습니다!");
                    return;
                }

                // Case B: 처음부터 'OPEN' 이거나 기록이 없음 -> 로딩 중일 수 있음 (신중 모드)
                consecutiveStuckCount++;
                console.log(`⚠️ 방송 중이나 화면 멈춤 (${consecutiveStuckCount}/${STUCK_THRESHOLD})`);

                if (consecutiveStuckCount >= STUCK_THRESHOLD) {
                    console.warn("🚨 [EVENT] 화면 멈춤 지속 감지");
                    hasAlerted = true;
                    showCustomModal("화면이 멈춰있어 새로고침합니다.");
                }

            } else {
                // 방송 중 아님
                consecutiveStuckCount = 0;
            }
            
            // 상태 기록 업데이트
            previousApiStatus = currentStatus;

        } catch (error) {
            console.error("❌ 에러:", error);
        }
    }

    console.log("🟢 [Auto Refresh] v2.3 로드됨 (즉시 감지 & 오탐 방지)");
    mainIntervalId = setInterval(checkLiveStatus, CHECK_INTERVAL);

})();