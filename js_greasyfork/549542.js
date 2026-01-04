// ==UserScript==
// @name         YouTube 추가 볼륨 슬라이더
// @namespace    youtube-extra-volume
// @match        https://www.youtube.com/*
// @version      0.1
// @description  유튜브에 추가 볼륨 증폭 슬라이더를 넣어 최대 16배까지 볼륨을 키울 수 있습니다.
// @icon         https://www.google.com/s2/favicons?sz=256&domain=youtube.com
// @author       you
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549542/YouTube%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/549542/YouTube%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_VOLUME = 16;
    let gainValue = getSavedVolume() || 1;
    const ORIGINAL_VOLUME = 1;
    let hideTimeout;

    // 볼륨 증폭 적용
    function boostVolume(video, boost) {
        let audioContext = video.audioContext;
        let gainNode = video.gainNode;

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let source = audioContext.createMediaElementSource(video);
            gainNode = audioContext.createGain();
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            video.audioContext = audioContext;
            video.gainNode = gainNode;

            video.addEventListener('play', () => audioContext.resume(), { once: true });
        }

        gainNode.gain.value = boost ? gainValue : ORIGINAL_VOLUME;
    }

    // 비디오 전체에 증폭 적용
    function applyVolumeBoost() {
        document.querySelectorAll('video').forEach(video => boostVolume(video, true));
        saveVolume(gainValue);
    }

    function removeVolumeBoost() {
        document.querySelectorAll('video').forEach(video => boostVolume(video, false));
    }

    // 슬라이더 UI 추가
    function addVolumeSlider() {
        const volumeArea = document.querySelector('.ytp-volume-area'); // ✅ 기존 볼륨 컨트롤바를 찾습니다.
        if (!volumeArea) {
            setTimeout(addVolumeSlider, 1000);
            return;
        }

        if (document.querySelector('#ytVolumeBoostSlider')) return;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginLeft = '10px';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';

        const slider = document.createElement('input');
        slider.id = 'ytVolumeBoostSlider';
        slider.type = 'range';
        slider.min = 1;
        slider.max = MAX_VOLUME;
        slider.value = gainValue;
        slider.step = 0.1;
        slider.style.width = '120px';
        slider.style.cursor = 'pointer';

        const label = document.createElement('span');
        label.id = 'ytVolumeBoostLabel';
        label.textContent = `🔊 ${(gainValue).toFixed(1)}x`;
        label.style.color = '#fff';
        label.style.fontSize = '12px';
        label.style.marginLeft = '5px';

        slider.oninput = () => {
            gainValue = parseFloat(slider.value);
            label.textContent = `🔊 ${gainValue.toFixed(1)}x`;
            applyVolumeBoost();
        };

        container.appendChild(slider);
        container.appendChild(label);

        // ✅ 기존 볼륨 컨트롤러 바로 옆에 삽입합니다.
        volumeArea.after(container);

        // 마우스 움직임 시 슬라이더 보이기
        function showSlider() {
            container.style.opacity = '1';
            resetHideTimeout();
        }

        function hideSlider() {
            container.style.opacity = '0';
        }

        function resetHideTimeout() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hideSlider, 3000);
        }

        document.addEventListener('mousemove', showSlider);
        document.addEventListener('keydown', showSlider);
    }

    // 볼륨 저장 (localStorage)
    function saveVolume(value) {
        localStorage.setItem('yt_volume_boost', value);
    }

    function getSavedVolume() {
        const v = localStorage.getItem('yt_volume_boost');
        return v ? parseFloat(v) : null;
    }

    // 비디오 로드 및 UI 준비
    function init() {
        function waitForVideo() {
            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                applyVolumeBoost();
                addVolumeSlider();
            } else {
                setTimeout(waitForVideo, 200);
            }
        }

        waitForVideo();

        // 플레이어 교체 감지
        const observer = new MutationObserver(() => waitForVideo());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();