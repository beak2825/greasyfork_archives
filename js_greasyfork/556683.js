// ==UserScript==
// @name         유튜브뮤직 볼륨 지속 + 조절
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  재생 중 항상 볼륨 낮게 유지 + 모바일에서 배율 조절 가능
// @author       YourName
// @match        https://music.youtube.com/*
// @grant        none
// @locale       ko
// @downloadURL https://update.greasyfork.org/scripts/556683/%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81%20%EB%B3%BC%EB%A5%A8%20%EC%A7%80%EC%86%8D%20%2B%20%EC%A1%B0%EC%A0%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556683/%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81%20%EB%B3%BC%EB%A5%A8%20%EC%A7%80%EC%86%8D%20%2B%20%EC%A1%B0%EC%A0%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetVolume = 0.3; // 초기 볼륨

    function applyVolumeToAll() {
        document.querySelectorAll('video').forEach(video => {
            if (video.volume !== targetVolume) {
                video.volume = targetVolume;
            }
        });
    }

    // 반복 체크
    setInterval(applyVolumeToAll, 10);

    // 모바일용 UI 생성
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.gap = '5px';

    const btnMinus = document.createElement('button');
    btnMinus.textContent = '−';
    btnMinus.style.fontSize = '20px';
    btnMinus.style.width = '40px';
    btnMinus.style.height = '40px';

    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.style.fontSize = '20px';
    btnPlus.style.width = '40px';
    btnPlus.style.height = '40px';

    container.appendChild(btnMinus);
    container.appendChild(btnPlus);
    document.body.appendChild(container);

    // 버튼 이벤트
    btnMinus.addEventListener('click', () => {
        targetVolume = Math.max(0, targetVolume - 0.05);
        applyVolumeToAll();
    });

    btnPlus.addEventListener('click', () => {
        targetVolume = Math.min(1, targetVolume + 0.05);
        applyVolumeToAll();
    });

})();
