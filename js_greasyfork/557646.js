// ==UserScript==
// @name         카카오페이지 장르 필터(BL 차단)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  BL은 무조건 차단(카운트 제외)하며, 요청하신 순서(현판, 판타지, 무협, 로판, 로맨스)대로 필터를 제공합니다. (카운트 오류 수정)
// @author       Gemini
// @match        https://page.kakao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kakao.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557646/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9E%A5%EB%A5%B4%20%ED%95%84%ED%84%B0%28BL%20%EC%B0%A8%EB%8B%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557646/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9E%A5%EB%A5%B4%20%ED%95%84%ED%84%B0%28BL%20%EC%B0%A8%EB%8B%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 설정: 기본 필터 상태 ---
    // 현판, 판타지, 무협: 기본 켜짐
    // 로판, 로맨스: 기본 꺼짐
    const DEFAULT_FILTER_STATE = {
        '현판': true,
        '판타지': true,
        '무협': true,
        '로판': false,
        '로맨스': false
    };

    // UI 표시 순서 (요청하신 순서 엄수)
    const FILTER_ORDER = ['현판', '판타지', '무협', '로판', '로맨스'];

    let filterState = GM_getValue('filterState', DEFAULT_FILTER_STATE);

    // 설정 무결성 검사 (저장된 값에 없는 키가 있으면 기본값 사용)
    Object.keys(DEFAULT_FILTER_STATE).forEach(key => {
        if (filterState[key] === undefined) {
            filterState[key] = DEFAULT_FILTER_STATE[key];
        }
    });

    // --- 스타일 정의 ---
    const style = document.createElement('style');
    style.innerHTML = `
        #kpw-filter-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            font-family: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
        }
        #kpw-filter-btn {
            background-color: #FFD200;
            color: #3c1e1e;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        }
        #kpw-filter-btn:hover {
            transform: scale(1.05);
        }
        #kpw-filter-panel {
            display: none;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            min-width: 150px;
        }
        .kpw-option {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
        }
        .kpw-option input {
            margin-right: 8px;
            cursor: pointer;
        }
        .kpw-option:last-child {
            margin-bottom: 0;
        }
        .kpw-title {
            font-size: 12px;
            color: #888;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // --- UI 생성 함수 ---
    function createUI() {
        // 기존 UI가 있다면 제거 (중복 생성 방지)
        const oldContainer = document.getElementById('kpw-filter-container');
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('div');
        container.id = 'kpw-filter-container';

        const panel = document.createElement('div');
        panel.id = 'kpw-filter-panel';

        const title = document.createElement('div');
        title.className = 'kpw-title';
        title.textContent = '장르 필터';
        panel.appendChild(title);

        // 지정된 순서대로 필터 생성
        FILTER_ORDER.forEach(genre => {
            const label = document.createElement('label');
            label.className = 'kpw-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.genre = genre;
            checkbox.checked = filterState[genre];

            checkbox.addEventListener('change', (e) => {
                filterState[genre] = e.target.checked;
                GM_setValue('filterState', filterState);
                runFilter();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(genre));
            panel.appendChild(label);
        });

        const btn = document.createElement('button');
        btn.id = 'kpw-filter-btn';
        btn.textContent = '⚙️ 필터';
        btn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
        });

        container.appendChild(panel);
        container.appendChild(btn);
        document.body.appendChild(container);
    }

    // --- 동적 로딩 감지 설정 ---
    let observer;

    function startObserver() {
        if (!observer) return;
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
    }

    // --- 핵심 로직 ---
    function runFilter() {
        stopObserver(); // 무한 루프 방지

        const items = document.querySelectorAll('.grid > div');
        let visibleCount = 0;

        items.forEach(item => {
            const metaSpans = item.querySelectorAll('span.break-all.align-middle');

            // [중요 수정] 장르 태그가 하나도 없는 요소는 작품이 아님 (빈 박스, 더미 등)
            // 따라서 카운트 및 필터링 대상에서 제외하고 건너뜀
            if (metaSpans.length === 0) return;

            let isBL = false;
            let itemGenre = null;

            metaSpans.forEach(span => {
                const text = span.innerText.trim();
                // BL 체크
                if (text === 'BL') isBL = true;
                // 관리 대상 장르인지 체크
                if (DEFAULT_FILTER_STATE.hasOwnProperty(text)) {
                    itemGenre = text;
                }
            });

            // 표시 여부 결정
            let shouldShow = true;

            if (isBL) {
                // BL은 설정과 무관하게 무조건 숨김
                shouldShow = false;
            } else if (itemGenre) {
                // 관리 대상 장르는 설정값 따름
                if (!filterState[itemGenre]) shouldShow = false;
            } else {
                // 관리하지 않는 장르(예: 드라마, 미스터리 등)는 기본적으로 보여줌
                // 만약 이것들도 숨기고 싶다면 shouldShow = false; 로 변경
                shouldShow = true;
            }

            // 적용
            if (shouldShow) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // 카운트 업데이트
        const countDisplayElement = document.querySelector('.font-small2.flex-1.text-el-50');
        if (countDisplayElement) {
            countDisplayElement.textContent = `${visibleCount}작품`;
        }

        startObserver(); // 감시 재개
    }

    // --- 실행 ---
    createUI();
    setTimeout(runFilter, 500);
    setTimeout(runFilter, 1500);

    let debounceTimer;
    observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
                break;
            }
        }
        if (shouldRun) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runFilter, 100);
        }
    });

    startObserver();

})();