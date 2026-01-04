// ==UserScript==
// @name         네이버 웹툰 헬퍼 (Auto Scroll & UI)
// @name:en      Naver Webtoon Helper (Auto Scroll & UI)
// @description     네이버 웹툰 자동 스크롤 및 다음 화 자동 이동 기능을 제공합니다.
// @description:en  Provides auto-scroll and automatic next episode navigation for Naver Webtoon.
// @author       kor-bim
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @match        https://comic.naver.com/webtoon/detail*
// @icon         https://shared-comic.pstatic.net/favicon/favicon_96x96.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560185/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%9B%B9%ED%88%B0%20%ED%97%AC%ED%8D%BC%20%28Auto%20Scroll%20%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560185/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%9B%B9%ED%88%B0%20%ED%97%AC%ED%8D%BC%20%28Auto%20Scroll%20%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let speed = parseInt(localStorage.getItem('ws_s')) || 100,
        active = localStorage.getItem('ws_a') === 'true',
        acc = 0, isMoving = false;

    // 슬라이더 버튼 스타일
    const style = document.createElement('style');
    style.innerHTML = `
        input[type=range]::-webkit-slider-thumb {
            appearance: none; width: 16px; height: 16px; border-radius: 50%;
            background: #00dc64; border: none; cursor: pointer; margin-top: -4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        input[type=range]::-moz-range-thumb {
            width: 16px; height: 16px; border-radius: 50%;
            background: #00dc64; border: none; cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.style.cssText = `position:fixed; top:${localStorage.getItem('ws_t')||'30px'}; left:${localStorage.getItem('ws_l')||'30px'};
    z-index:10000; width:100px; padding:15px; border-radius:24px; font-family:sans-serif;
    backdrop-filter:blur(12px); cursor:grab; user-select:none; touch-action:none;
    transition: background 0.4s, color 0.4s, box-shadow 0.4s;`;

    ui.innerHTML = `
        <div id="b" style="width:70px; height:70px; line-height:70px; border-radius:50%; text-align:center; cursor:pointer; font-weight:bold; font-size:14px; margin:0 auto 15px; transition:0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></div>
        <div style="padding: 0 5px;">
            <input type="range" id="r" min="100" max="500" value="${speed}" style="width:100%; height:8px; cursor:pointer; appearance:none; border:none; border-radius:10px; outline:none;">
        </div>
        <div style="text-align:center; font-size:13px; font-weight:bold; color:#00dc64; margin-top:10px;"><span id="v">${speed}</span>%</div>
    `;
    document.body.appendChild(ui);

    const btn = ui.querySelector('#b'), rng = ui.querySelector('#r'), val = ui.querySelector('#v');

    const updateSliderFill = (isDark) => {
        const percent = (rng.value / rng.max) * 100;
        const emptyColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
        rng.style.background = `linear-gradient(to right, #00dc64 ${percent}%, ${emptyColor} ${percent}%)`;
    };

    const syncWithWebtoonBg = () => {
        const viewer = document.getElementById('sectionContWide') || document.querySelector('.wt_viewer') || document.body;
        const bgColor = window.getComputedStyle(viewer).backgroundColor;
        const rgb = bgColor.match(/\d+/g);

        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            const isDarkBg = brightness < 128;

            if (isDarkBg) {
                ui.style.background = "rgba(34, 34, 34, 0.9)";
                ui.style.color = "#ffffff";
                ui.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)"; // 더 짙은 그림자
            } else {
                ui.style.background = "rgba(255, 255, 255, 0.9)";
                ui.style.color = "#222222";
                ui.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"; // 부드러운 그림자
            }
            updateSliderFill(isDarkBg);
        }
    };

    const update = () => {
        btn.innerText = active ? 'STOP' : 'START';
        btn.style.background = active ? '#ff4b4b' : '#00dc64';
        btn.style.color = "#fff";
        val.innerText = speed;
        syncWithWebtoonBg();
    };

    // 드래그 로직 (수정 완료)
    let isDragging = false, startX, startY, initialLeft, initialTop;
    ui.onmousedown = (e) => {
        if (e.target === rng || e.target === btn) return;
        isDragging = true; ui.style.cursor = 'grabbing';
        startX = e.clientX; startY = e.clientY;
        initialLeft = ui.offsetLeft; initialTop = ui.offsetTop;
        e.preventDefault();
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        ui.style.left = (initialLeft + (e.clientX - startX)) + 'px';
        ui.style.top = (initialTop + (e.clientY - startY)) + 'px';
    };
    document.onmouseup = () => {
        if (isDragging) {
            isDragging = false; ui.style.cursor = 'grab';
            localStorage.setItem('ws_t', ui.style.top);
            localStorage.setItem('ws_l', ui.style.left);
        }
    };

    const goNext = () => {
        if (isMoving) return;
        isMoving = true;
        const nextBtn = document.querySelector('.link_next, .btn_next, .Nbtn_next, [class*="Paginate__next"]');
        if (nextBtn && !nextBtn.classList.contains('disabled')) {
            nextBtn.click();
            setTimeout(() => { isMoving = false; }, 3000);
        } else {
            // 버튼 클릭 실패 시 URL 강제 이동 시도
            const u = new URL(location.href);
            const no = parseInt(u.searchParams.get('no'));
            if (no) { u.searchParams.set('no', no + 1); location.replace(u.toString()); }
        }
    };

    const run = () => {
        if (!active || isMoving) return;

        acc += (speed / 50);
        if (acc >= 1) {
            window.scrollBy(0, Math.floor(acc));
            acc %= 1;
        }

        // 스크롤 종료 감지 로직 (수정: 뷰어 하단 기준)
        const viewer = document.getElementById('sectionContWide') || document.querySelector('.wt_viewer');
        if (viewer) {
            const rect = viewer.getBoundingClientRect();
            // 뷰어의 바닥이 화면 하단에 거의 닿았을 때 (150px 여유)
            if (rect.bottom <= window.innerHeight + 150) {
                active = false; // 댓글창으로 넘어가지 않게 스크롤 중지
                update();
                goNext();
                return;
            }
        }
        requestAnimationFrame(run);
    };

    btn.onclick = (e) => {
        e.stopPropagation();
        active = !active;
        localStorage.setItem('ws_a', active);
        update();
        if(active) { isMoving = false; run(); }
    };

    rng.oninput = e => {
        speed = e.target.value;
        localStorage.setItem('ws_s', speed);
        val.innerText = speed;
        syncWithWebtoonBg();
    };

    rng.onmousedown = (e) => e.stopPropagation();
    const observer = new MutationObserver(syncWithWebtoonBg);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'data-theme'] });

    update();
    if (active) setTimeout(run, 500);
})();