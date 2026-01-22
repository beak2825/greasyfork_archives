// ==UserScript==
// @name         MangaTranslator - 리스트 역순 및 오류 타이머
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  만화 번역 사이트 리스트를 역순으로 정렬하고, 완료 항목 숨기기 기능 및 오류 발생 시 경과 시간 타이머를 제공합니다.
// @description:en Reverse list order, toggle completed items, and show an error timer for MangaTranslator.
// @author       Gemini
// @license      MIT
// @match        https://mangatranslator.ai/upload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563512/MangaTranslator%20-%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EC%97%AD%EC%88%9C%20%EB%B0%8F%20%EC%98%A4%EB%A5%98%20%ED%83%80%EC%9D%B4%EB%A8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/563512/MangaTranslator%20-%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EC%97%AD%EC%88%9C%20%EB%B0%8F%20%EC%98%A4%EB%A5%98%20%ED%83%80%EC%9D%B4%EB%A8%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastErrorTime = null;
    let isHidden = true;
    let timerInterval = null;
    let timerDismissed = false;
    let lastErrorCount = 0;

    const style = document.createElement('style');
    style.innerHTML = `
        .sc-beyTiQ.NoNVj {
            display: flex !important;
            flex-direction: column-reverse !important;
            justify-content: flex-end !important;
            width: 100% !important;
        }
        .is-completed-hidden { display: none !important; }
        .is-error-item {
            border: 2px solid #ff4d4f !important;
            background-color: #fff1f0 !important;
            border-radius: 4px;
            margin-bottom: 5px !important;
        }
        #custom-control-wrapper {
            width: 100% !important;
            padding: 10px 0 !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
        #error-timer-display {
            text-align: center;
            font-weight: bold;
            color: #ff4d4f;
            margin-bottom: 8px;
            font-size: 20px;
            display: none;
            cursor: pointer;
            user-select: none;
        }
        #toggle-completed-btn {
            display: block !important;
            width: 100% !important;
            padding: 10px 0 !important;
            background-color: #4A90E2;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    const updateTimer = () => {
        const display = document.getElementById('error-timer-display');
        if (!display || !lastErrorTime || timerDismissed) {
            if (display) display.style.display = 'none';
            return;
        }
        const now = new Date();
        const diffMin = Math.floor((now - lastErrorTime) / 60000);
        display.innerText = `⚠️ 마지막 오류 발생 후 약 ${diffMin}분 경과 (클릭하여 닫기)`;
        display.style.display = 'block';
    };

    const processItems = () => {
        observer.disconnect();

        const items = Array.from(document.querySelectorAll('.sc-beyTiQ.NoNVj > div'));
        let currentErrorCount = 0;

        items.forEach((item, index) => {
            const text = item.innerText;
            const isError = /오류|에러|Fail|Error/.test(text);

            if (isError) {
                currentErrorCount++;
                if (currentErrorCount > lastErrorCount) {
                    timerDismissed = false;
                    lastErrorTime = new Date();
                }
                if (!lastErrorTime && !timerDismissed) lastErrorTime = new Date();
                if (!timerInterval) timerInterval = setInterval(updateTimer, 30000);
                updateTimer();

                item.classList.add('is-error-item');
                item.classList.remove('is-completed-hidden');
                if (index > 0) {
                    items[index - 1].classList.add('is-error-item');
                    items[index - 1].classList.remove('is-completed-hidden');
                }
            } else {
                const isDone = /다운로드|Download/.test(text);
                if (isDone && !item.classList.contains('is-error-item')) {
                    if (isHidden) item.classList.add('is-completed-hidden');
                    else item.classList.remove('is-completed-hidden');
                }
            }
        });

        lastErrorCount = currentErrorCount;
        startObserver();
    };

    const init = () => {
        const container = document.querySelector('.sc-beyTiQ.NoNVj');
        if (!container || document.getElementById('custom-control-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'custom-control-wrapper';
        const timerDiv = document.createElement('div');
        timerDiv.id = 'error-timer-display';
        timerDiv.onclick = () => {
            timerDismissed = true; 
            timerDiv.style.display = 'none';
        };

        const btn = document.createElement('button');
        btn.id = 'toggle-completed-btn';
        btn.innerText = isHidden ? '완료 항목 표시' : '완료 항목 숨기기';
        btn.onclick = () => {
            isHidden = !isHidden;
            btn.innerText = isHidden ? '완료 항목 표시' : '완료 항목 숨기기';
            processItems();
        };

        wrapper.appendChild(timerDiv);
        wrapper.appendChild(btn);
        container.parentNode.insertBefore(wrapper, container);
    };

    const observer = new MutationObserver(() => {
        init();
        processItems();
    });

    const startObserver = () => {
        observer.observe(document.body, { childList: true, subtree: true });
    };

    startObserver();
})();