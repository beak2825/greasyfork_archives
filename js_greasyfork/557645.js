// ==UserScript==
// @name         네이버 시리즈 무료 회차 자동 클릭
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  버튼 내부 시스템 코드 최우선 분석 + 제목 분석 시 보편적인 '화' 단위를 '회'보다 먼저 찾도록 로직을 정교화했습니다.
// @author       You
// @match        https://series.naver.com/novel/detail.series?productNo=*
// @match        https://series.naver.com/novel/volumeDetail.series?productNo=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557645/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EB%AC%B4%EB%A3%8C%20%ED%9A%8C%EC%B0%A8%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/557645/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EB%AC%B4%EB%A3%8C%20%ED%9A%8C%EC%B0%A8%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // [설정] 시간 설정 (밀리초 단위)
    const DELAY_VIEWED = 1000;   // 이미 본 회차 클릭 후 대기 시간
    const DELAY_AFTER_LOAD = 1000; // 새로고침 후 대기 시간
    const DELAY_FALLBACK = 4000; // 안전장치 대기 시간
    // ============================================================

    const STORAGE_KEY_QUEUE = 'series_click_queue';
    const STORAGE_KEY_IS_RUNNING = 'series_is_running';

    function createUI() {
        if (document.getElementById('series-ui-container')) return;

        const container = document.createElement('div');
        container.id = 'series-ui-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.gap = '5px';

        const btnStart = document.createElement('button');
        btnStart.id = 'btn-start';
        btnStart.innerText = '▶ 무료 회차';
        applyStyle(btnStart, '#00c73c');
        btnStart.onclick = startNewSession;

        const btnStop = document.createElement('button');
        btnStop.id = 'btn-stop';
        btnStop.innerText = '■ 중지';
        applyStyle(btnStop, '#ff4b4b');
        btnStop.onclick = stopAutoClick;
        btnStop.style.display = 'none';

        container.appendChild(btnStart);
        container.appendChild(btnStop);
        document.body.appendChild(container);

        checkResume();
    }

    function applyStyle(el, bgColor) {
        el.style.padding = '10px 15px';
        el.style.backgroundColor = bgColor;
        el.style.color = 'white';
        el.style.border = 'none';
        el.style.borderRadius = '5px';
        el.style.cursor = 'pointer';
        el.style.fontWeight = 'bold';
        el.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    }

    function updateUI(running) {
        const btnStart = document.getElementById('btn-start');
        const btnStop = document.getElementById('btn-stop');
        if (running) {
            if(btnStart) btnStart.style.display = 'none';
            if(btnStop) btnStop.style.display = 'block';
        } else {
            if(btnStart) btnStart.style.display = 'block';
            if(btnStop) btnStop.style.display = 'none';
        }
    }

    // [핵심 수정] 회차 인식 로직 정교화
    function getEpisodeNumber(button, titleEl) {
        // 1. [Plan A] 버튼 클래스 내의 시스템 코드 분석 (가장 정확함)
        // 예: _orderFreeTicketProduct(NOVEL,8992079,485619,2) -> 4번째 인자가 회차번호(2)
        const classInfo = button.className || "";
        const codeMatch = classInfo.match(/_orderFreeTicketProduct\([^,]+,[^,]+,[^,]+,(\d+)\)/);

        if (codeMatch && codeMatch[1]) {
            return parseInt(codeMatch[1], 10);
        }

        // 2. [Plan B] 코드가 없을 경우 제목 텍스트 분석 (안전장치)
        if (titleEl) {
            const text = titleEl.innerText;

            // 2-1. 가장 보편적인 '화' 단위를 우선적으로 찾습니다. (예: 100화)
            const matchHwa = text.match(/(\d+)화/);
            if (matchHwa) return parseInt(matchHwa[1]);

            // 2-2. 그 다음으로 '회'나 '권'을 찾습니다. (예: 제1회, 3권)
            const matchVol = text.match(/(\d+)[회권]/);
            if (matchVol) return parseInt(matchVol[1]);

            // 2-3. 단위가 없다면 맨 앞 숫자를 가져옵니다.
            const matchFirstNum = text.match(/(\d+)/);
            if (matchFirstNum) return parseInt(matchFirstNum[1]);
        }

        return -1; // 인식 불가
    }

    function startNewSession() {
        let startEpInput = prompt("몇 화부터 시작할까요?", "1");
        if (startEpInput === null) return;
        let endEpInput = prompt("몇 화까지 클릭할까요?", "1000");
        if (endEpInput === null) return;

        const startEp = parseInt(startEpInput.trim());
        const endEp = parseInt(endEpInput.trim());

        if (isNaN(startEp) || isNaN(endEp)) {
            alert("숫자만 입력해주세요.");
            return;
        }

        const targetEps = [];
        const allButtons = document.querySelectorAll('.btn_viewer');

        allButtons.forEach(button => {
            // '무료' 버튼만 대상
            if (button.innerText.trim() !== '무료') return;

            const row = button.closest('tr');
            if (!row) return;
            const titleEl = row.querySelector('.subj strong');

            // 버튼 자체와 제목 요소를 함께 넘김
            const epNum = getEpisodeNumber(button, titleEl);

            if (epNum !== -1 && epNum >= startEp && epNum <= endEp) {
                targetEps.push(epNum);
            }
        });

        if (targetEps.length === 0) {
            alert(`설정하신 범위(${startEp}~${endEp}화) 내의 '무료' 버튼이 없습니다.\n(페이지 번호를 확인해주세요)`);
            return;
        }

        if (!confirm(`총 ${targetEps.length}개의 '무료' 회차를 클릭합니다.`)) {
            return;
        }

        localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(targetEps));
        localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'true');

        updateUI(true);
        processQueue();
    }

    function stopAutoClick() {
        localStorage.removeItem(STORAGE_KEY_QUEUE);
        localStorage.removeItem(STORAGE_KEY_IS_RUNNING);
        updateUI(false);
        alert('자동 클릭이 중지되었습니다.');
    }

    function checkResume() {
        const isRunning = localStorage.getItem(STORAGE_KEY_IS_RUNNING) === 'true';
        if (isRunning) {
            updateUI(true);
            setTimeout(processQueue, DELAY_AFTER_LOAD);
        }
    }

    function processQueue() {
        const isRunning = localStorage.getItem(STORAGE_KEY_IS_RUNNING) === 'true';
        if (!isRunning) return;

        const queueStr = localStorage.getItem(STORAGE_KEY_QUEUE);
        if (!queueStr) {
            finishJob();
            return;
        }

        let queue = JSON.parse(queueStr);
        if (queue.length === 0) {
            finishJob();
            return;
        }

        const currentTargetEp = queue[0];
        const btn = findButtonByEp(currentTargetEp);

        if (btn) {
            const isNewEpisode = btn.classList.contains('cookie') || btn.classList.contains('freeVolumn');

            console.log(`[${currentTargetEp}화] 무료 클릭 시도.`);

            btn.style.backgroundColor = '#ccc';
            btn.innerText = '처리중';

            try {
                btn.click();
            } catch (e) {
                console.error("클릭 에러:", e);
            }

            queue.shift();
            localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));

            if (isNewEpisode) {
                setTimeout(processQueue, DELAY_FALLBACK);
            } else {
                setTimeout(processQueue, DELAY_VIEWED);
            }

        } else {
            console.warn(`${currentTargetEp}화 버튼 없음 - 스킵`);
            queue.shift();
            localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
            setTimeout(processQueue, DELAY_VIEWED);
        }
    }

    function findButtonByEp(targetEp) {
        const allButtons = document.querySelectorAll('.btn_viewer');
        for (let btn of allButtons) {
            if (btn.innerText.trim() !== '무료') continue;

            const row = btn.closest('tr');
            if (!row) continue;
            const titleEl = row.querySelector('.subj strong');

            if (getEpisodeNumber(btn, titleEl) === targetEp) return btn;
        }
        return null;
    }

    // 알림음 재생 함수
    function playNotificationSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("오디오 재생 실패:", e);
        }
    }

    function finishJob() {
        localStorage.removeItem(STORAGE_KEY_QUEUE);
        localStorage.removeItem(STORAGE_KEY_IS_RUNNING);
        updateUI(false);

        playNotificationSound();

        setTimeout(() => {
            alert("작업 완료!");
        }, 100);
    }

    window.addEventListener('load', createUI);

})();