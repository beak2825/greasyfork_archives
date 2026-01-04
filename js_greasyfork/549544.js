// ==UserScript==
// @name          Soop 추가 볼륨 슬라이더
// @namespace     Soop 추가 볼륨 슬라이더
// @match         *://*.play.sooplive.co.kr/*
// @match         *://vod.sooplive.co.kr/player/*
// @version       0.2
// @description   Soop 플레이어에 최대 16배 볼륨 증폭 슬라이더 추가
// @icon          https://www.google.com/s2/favicons?sz=256&domain_url=play.afreecatv.com
// @author        mickey90427 <mickey90427@naver.com>
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/549544/Soop%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/549544/Soop%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%8D%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_VOLUME = 16;
    let gainValue = getSavedVolume() || 1;
    const ORIGINAL_VOLUME = 1;
    let hideTimeout;

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

    function applyVolumeBoost() {
        document.querySelectorAll('video').forEach(video => boostVolume(video, true));
        saveVolume(gainValue);
    }

    function addVolumeSlider() {
        const ctrl = document.querySelector('.ctrlBox .ctrl');
        if (!ctrl) {
            setTimeout(addVolumeSlider, 500);
            return;
        }

        if (document.querySelector('#soopVolumeBoostSlider')) return;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginLeft = '10px';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';

        const slider = document.createElement('input');
        slider.id = 'soopVolumeBoostSlider';
        slider.type = 'range';
        slider.min = 1;
        slider.max = MAX_VOLUME;
        slider.value = gainValue;
        slider.step = 0.1;
        slider.style.width = '120px';
        slider.style.cursor = 'pointer';

        const label = document.createElement('span');
        label.textContent = `🔊 ${gainValue.toFixed(1)}x`;
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

        // 볼륨 컨트롤 옆에 붙이기
        const volumeBox = ctrl.querySelector('.volume');
        if (volumeBox) {
            volumeBox.insertAdjacentElement('afterend', container);
        } else {
            ctrl.appendChild(container);
        }

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

    function saveVolume(value) {
        localStorage.setItem('soop_volume_boost', value);
    }
    function getSavedVolume() {
        const v = localStorage.getItem('soop_volume_boost');
        return v ? parseFloat(v) : null;
    }

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

        // 플레이어 DOM 변동 감지
        const observer = new MutationObserver(() => waitForVideo());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
