// ==UserScript==
// @name         치치직 재생속도 조절 버튼+슬라이더 (멀티 페이지 지원)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  버튼 클릭으로 재생속도 슬라이더 열기/닫기, video/clip 등 지정 페이지에서 작동
// @match        *://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550724/%EC%B9%98%EC%B9%98%EC%A7%81%20%EC%9E%AC%EC%83%9D%EC%86%8D%EB%8F%84%20%EC%A1%B0%EC%A0%88%20%EB%B2%84%ED%8A%BC%2B%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94%20%28%EB%A9%80%ED%8B%B0%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A7%80%EC%9B%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550724/%EC%B9%98%EC%B9%98%EC%A7%81%20%EC%9E%AC%EC%83%9D%EC%86%8D%EB%8F%84%20%EC%A1%B0%EC%A0%88%20%EB%B2%84%ED%8A%BC%2B%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94%20%28%EB%A9%80%ED%8B%B0%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A7%80%EC%9B%90%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'chzzk_playback_rate';
    const defaultRate = 1.0;
    let savedRate = parseFloat(localStorage.getItem(STORAGE_KEY)) || defaultRate;

    // 적용할 페이지 경로들 (여기 원하는 것 계속 추가 가능)
    const ENABLED_PATHS = ['/video/', '/clips/'];

    function isEnabledPage() {
        return ENABLED_PATHS.some(path => location.href.includes(path));
    }

    function applyPlaybackRate(rate) {
        document.querySelectorAll('video').forEach(video => {
            if (video.playbackRate !== rate) {
                video.playbackRate = rate;
                console.log(`[Chzzk] 재생속도 ${rate.toFixed(2)}x 적용`);
            }
        });
    }

    function createUI() {
        // 버튼
        const btn = document.createElement('button');
        btn.textContent = '⚡';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.left = '50%';
        btn.style.zIndex = '99999';
        btn.style.background = 'transparent'; // 투명
        btn.style.color = '#fff';             // 흰색 아이콘
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.fontSize = '24px';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '0.8';

        // 팝업
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.bottom = '80px';
        popup.style.left = '45%';
        popup.style.zIndex = '99999';
        popup.style.background = 'rgba(0,0,0,0.8)';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.borderRadius = '8px';
        popup.style.display = 'none';
        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        // 슬라이더
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0.25;
        slider.max = 3.0;
        slider.step = 0.05;
        slider.value = savedRate;
        slider.style.width = '200px';

        // 속도 표시 텍스트
        const label = document.createElement('div');
        label.textContent = `속도: ${savedRate.toFixed(2)}x`;
        label.style.textAlign = 'center';
        label.style.marginTop = '5px';
        label.style.fontSize = '14px';

        slider.addEventListener('input', () => {
            const newRate = parseFloat(slider.value);
            savedRate = newRate;
            localStorage.setItem(STORAGE_KEY, newRate);
            label.textContent = `속도: ${newRate.toFixed(2)}x`;
            applyPlaybackRate(newRate);
        });

        popup.appendChild(slider);
        popup.appendChild(label);
        document.body.appendChild(btn);
        document.body.appendChild(popup);

        btn.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        });
    }

    function checkAndApply() {
        if (isEnabledPage()) {
            applyPlaybackRate(savedRate);
        }
    }

    // DOM 변화 감지
    const observer = new MutationObserver(() => {
        checkAndApply();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // URL 변경 감지
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndApply();
        }
    }, 2500);

    createUI();
    checkAndApply();
})();
