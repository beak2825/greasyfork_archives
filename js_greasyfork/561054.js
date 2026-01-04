// ==UserScript==
// @name         Zaiko Gatchibogi
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  버튼 없이 숫자 입력 후 엔터만으로 Zaiko 영상 시간을 조절합니다.
// @author       Gemini
// @match        https://zaiko.io/*
// @match        https://live.zaiko.services/*
// @icon         https://cdn-icons-png.flaticon.com/512/727/727245.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561054/Zaiko%20Gatchibogi.user.js
// @updateURL https://update.greasyfork.org/scripts/561054/Zaiko%20Gatchibogi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 스타일 설정 (버튼 관련 스타일 삭제 및 입력창 디자인 개선)
    const style = `
        .vjs-remaining-time { display: none !important; }
        .my-custom-zaiko-container {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 10px;
            font-family: inherit;
            order: 7;
        }
        #zaiko-input-time {
            width: 80px;
            height: 26px;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.4);
            color: #fff;
            border-radius: 4px;
            text-align: center;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
        }
        #zaiko-input-time:focus {
            background: rgba(255, 255, 255, 0.25);
            border-color: #ff0055;
            width: 90px;
        }
        #zaiko-input-time::placeholder { color: rgba(255, 255, 255, 0.5); }
        .current-display {
            color: #fff;
            font-weight: bold;
            min-width: 65px;
            font-size: 14px;
            letter-spacing: 0.5px;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl);

    // 2. 시간 변환 로직 (13010 -> 1:30:10)
    function parseSmartTime(input) {
        const digits = input.replace(/[^0-9]/g, '');
        if (!digits) return null;
        let h = 0, m = 0, s = 0;
        if (digits.length <= 2) { s = parseInt(digits); }
        else if (digits.length <= 4) { s = parseInt(digits.slice(-2)); m = parseInt(digits.slice(0, -2)); }
        else { s = parseInt(digits.slice(-2)); m = parseInt(digits.slice(-4, -2)); h = parseInt(digits.slice(0, -4)); }
        return (h * 3600) + (m * 60) + s;
    }

    // 3. UI 생성 및 업데이트
    function updateUI() {
        const controlBar = document.querySelector('.vjs-control-bar');
        const remainingTime = document.querySelector('.vjs-remaining-time');
        const progressHolder = document.querySelector('.vjs-progress-holder');
        if (!controlBar || !remainingTime || !progressHolder) return;

        let container = document.querySelector('.my-custom-zaiko-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'my-custom-zaiko-container';
            container.innerHTML = `
                <span class="current-display" id="zaiko-cur-text">00:00</span>
                <input type="text" id="zaiko-input-time" placeholder="시간 입력">
            `;
            controlBar.insertBefore(container, remainingTime.nextSibling);

            // 입력창에서 엔터키 이벤트만 감지
            const inputField = document.getElementById('zaiko-input-time');
            inputField.onkeydown = function(e) {
                // 플레이어 단축키와 겹치지 않게 방어
                e.stopPropagation();

                if (e.key === 'Enter') {
                    const video = document.querySelector('video');
                    const targetSeconds = parseSmartTime(this.value);
                    if (video && targetSeconds !== null) {
                        video.currentTime = targetSeconds;
                        this.value = ''; // 입력 후 비우기
                        this.blur();// 입력 후 포커스 해제 (영상이 바로 재생되도록)
                    }
                }
            };
        }

        // 현재 시간 텍스트 동기화
        const timeText = progressHolder.getAttribute('aria-valuetext');
        if (timeText) {
            const currentTime = timeText.split(' of ')[0].trim();
            const display = document.getElementById('zaiko-cur-text');
            if (display) display.textContent = currentTime;
        }
    }

    setInterval(updateUI, 500);
})();