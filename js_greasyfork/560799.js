// ==UserScript==
// @name         Zaiko Current Time Display
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Zaiko 플레이어의 남은 시간을 현재 경과 시간으로 변경하여 표시합니다.
// @author       You
// @match        https://zaiko.io/*
// @match        https://live.zaiko.services/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zaiko.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560799/Zaiko%20Current%20Time%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/560799/Zaiko%20Current%20Time%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        .vjs-remaining-time {
            display: none !important;
        }

        .my-custom-zaiko-timer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1em;
            line-height: 3em;
            font-family: inherit;
            padding: 0 0.5em;
            cursor: default;
            color: #fff;
            font-weight: bold;
        }
    `;

    // 스타일 적용
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(style);
    } else {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
    }

    function updateTimeDisplay() {
        // 1. 정보 원본 (프로그레스 바) 가져오기
        const progressHolder = document.querySelector('.vjs-progress-holder');

        // 2. 남은 시간 컨테이너 찾기
        const remainingTimeContainer = document.querySelector('.vjs-remaining-time');

        if (!progressHolder || !remainingTimeContainer) return;

        // 3. 컨트롤 바 찾기
        const controlBar = remainingTimeContainer.parentNode;

        // 4. 커스텀 타이머가 있는지 확인
        let myTimer = controlBar.querySelector('.my-custom-zaiko-timer');

        // 없으면 생성해서 '남은 시간' 컨테이너 바로 뒤에 삽입
        if (!myTimer) {
            myTimer = document.createElement('div');
            myTimer.className = 'my-custom-zaiko-timer';
            controlBar.insertBefore(myTimer, remainingTimeContainer.nextSibling);
        }

        // 5. 시간 텍스트 추출 및 정제
        const timeText = progressHolder.getAttribute('aria-valuetext');
        if (!timeText) return;

        const timeParts = timeText.split(' of ');
        if (timeParts.length < 2) return;

        let currentTime = timeParts[0];

        currentTime = currentTime.trim();

        // 6. 텍스트 업데이트
        if (myTimer.textContent !== currentTime) {
            myTimer.textContent = currentTime;
        }
    }

    // 0.1초마다 실행
    setInterval(updateTimeDisplay, 100);

})();