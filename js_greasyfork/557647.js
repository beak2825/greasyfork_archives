// ==UserScript==
// @name         네이버 시리즈 필터 UI
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  네이버 시리즈의 모든 영역(타임딜, TOP10 등 포함)에서 19금, [무료연재], [단행본] 작품을 필터링합니다. (작동 범위 수정됨)
// @author       Gemini
// @match        https://series.naver.com/novel/home.series
// @match        https://series.naver.com/novel/recentList.series
// @match        https://series.naver.com/novel/recentList.series?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557647/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8B%9C%EB%A6%AC%EC%A6%88%20%ED%95%84%ED%84%B0%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/557647/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8B%9C%EB%A6%AC%EC%A6%88%20%ED%95%84%ED%84%B0%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 설정: 기본 필터 상태 (true: 보임, false: 숨김) ---
    const DEFAULT_FILTER_STATE = {
        '19금_보기': false,      // 기본값: 19금 숨김
        '무료연재_보기': true,   // 기본값: 무료연재 보임
        '단행본_보기': true      // 기본값: 단행본 보임
    };

    let filterState = GM_getValue('naverFilterState', DEFAULT_FILTER_STATE);

    // --- 스타일 정의 (네이버 테마 적용) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #ns-filter-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            font-family: "Nanum Gothic", sans-serif;
        }
        #ns-filter-btn {
            background-color: #03C75A; /* 네이버 그린 */
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        }
        #ns-filter-btn:hover {
            transform: scale(1.05);
            background-color: #02b351;
        }
        #ns-filter-panel {
            display: none;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            min-width: 170px;
        }
        .ns-option {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
        }
        .ns-option input {
            margin-right: 8px;
            cursor: pointer;
            accent-color: #03C75A;
        }
        .ns-option:last-child {
            margin-bottom: 0;
        }
        .ns-title {
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
        const container = document.createElement('div');
        container.id = 'ns-filter-container';

        const panel = document.createElement('div');
        panel.id = 'ns-filter-panel';

        const title = document.createElement('div');
        title.className = 'ns-title';
        title.textContent = '작품 필터 설정';
        panel.appendChild(title);

        // 옵션 생성
        const options = [
            { key: '19금_보기', label: '🔞 19금 작품 표시' },
            { key: '무료연재_보기', label: '🆓 [무료연재] 표시' },
            { key: '단행본_보기', label: '📘 [단행본] 표시' }
        ];

        options.forEach(opt => {
            const label = document.createElement('label');
            label.className = 'ns-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = filterState[opt.key];

            // 체크박스 변경 이벤트
            checkbox.addEventListener('change', (e) => {
                filterState[opt.key] = e.target.checked;
                GM_setValue('naverFilterState', filterState); // 설정 저장
                runFilter(); // 필터 즉시 적용
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(opt.label));
            panel.appendChild(label);
        });

        const btn = document.createElement('button');
        btn.id = 'ns-filter-btn';
        btn.textContent = '✅ 필터';
        btn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
        });

        container.appendChild(panel);
        container.appendChild(btn);
        document.body.appendChild(container);
    }

    // --- 필터링 로직 ---
    function runFilter() {
        // [중요 변경점] 선택자 확장:
        // .lst_thum li : 일반 리스트
        // .lst_thum_free li : 타임딜, 프리패스, 무료 리스트
        // .bstop10_list li : 우측 TOP 10 리스트
        const items = document.querySelectorAll('.lst_thum li, .lst_thum_free li, .bstop10_list li');

        items.forEach(item => {
            // 1. 작품 정보 파악
            const isAdult = item.querySelector('.ico.n19') !== null;

            const img = item.querySelector('img');
            const titleLink = item.querySelector('a');

            const freeKeyword = '[무료연재]';
            const volumeKeyword = '[단행본]';

            let isFreeSerial = false;
            let isVolume = false;

            // 텍스트 확인 로직 (이미지 alt, 제목 title, 내부 텍스트 순서로 확인)
            const checkText = (keyword) => {
                if (img && img.alt && img.alt.includes(keyword)) return true;
                if (titleLink && titleLink.title && titleLink.title.includes(keyword)) return true;
                if (item.innerText.includes(keyword)) return true;
                return false;
            };

            isFreeSerial = checkText(freeKeyword);
            isVolume = checkText(volumeKeyword);

            // 2. 표시 여부 결정
            let show = true;

            // 조건 A: 19금 필터링
            if (!filterState['19금_보기'] && isAdult) {
                show = false;
            }

            // 조건 B: 무료연재 필터링
            if (!filterState['무료연재_보기'] && isFreeSerial) {
                show = false;
            }

            // 조건 C: 단행본 필터링
            if (!filterState['단행본_보기'] && isVolume) {
                show = false;
            }

            // 3. 스타일 적용
            item.style.display = show ? '' : 'none';
        });
    }

    // --- 실행 ---
    createUI();
    runFilter();

    // 동적 로딩 감지 (더보기, 탭 전환 등)
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
                break;
            }
        }
        if (shouldRun) {
            runFilter();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();