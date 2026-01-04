// ==UserScript==
// @name          마크로젠 그룹웨어 NGS 가동률 바로가기 버튼
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  마크로젠 그룹웨어 홈 및 메일 등 서비스 화면 통합검색 좌측에 NGS 가동률 대시보드 링크 버튼을 추가합니다. (깜빡임 및 사라짐 현상 수정)
// @author       김재형
// @match        https://gw.macrogen.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=macrogen.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559787/%EB%A7%88%ED%81%AC%EB%A1%9C%EC%A0%A0%20%EA%B7%B8%EB%A3%B9%EC%9B%A8%EC%96%B4%20NGS%20%EA%B0%80%EB%8F%99%EB%A5%A0%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/559787/%EB%A7%88%ED%81%AC%EB%A1%9C%EC%A0%A0%20%EA%B7%B8%EB%A3%B9%EC%9B%A8%EC%96%B4%20NGS%20%EA%B0%80%EB%8F%99%EB%A5%A0%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 가동률 대시보드 링크 주소
    const NGS_LINK = 'https://ngs-inst.streamlit.app/';
    const BTN_ID = 'ngs-shortcut-btn';

    function injectButton() {
        // 1. 대상 컨테이너 확인
        const combineSearch = document.querySelector('.combine_search');
        if (!combineSearch) return;

        // 2. 기존 버튼의 존재 및 정상 연결 여부 확인
        let btn = document.getElementById(BTN_ID);

        // 버튼이 이미 있고, 올바른 위치에 있으면 추가 작업 불필요
        if (btn && combineSearch.contains(btn)) {
            // 레이아웃 스타일이 사이트 스크립트에 의해 초기화되었을 수 있으므로 재확인
            if (combineSearch.style.display !== 'flex') {
                combineSearch.style.display = 'flex';
                combineSearch.style.alignItems = 'center';
                combineSearch.style.justifyContent = 'flex-end';
            }
            return;
        }

        // 3. 버튼이 없거나 다른 곳에 있다면 기존 객체 제거 (중복 방지)
        if (btn) btn.remove();

        // 4. 버튼 생성
        btn = document.createElement('a');
        btn.id = BTN_ID;
        btn.href = NGS_LINK;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';

        // 검색바와 조화로운 프리미엄 스타일 설정
        btn.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 14px;
            background: linear-gradient(135deg, #005596 0%, #0099d8 100%);
            color: white !important;
            border-radius: 4px;
            font-weight: 700;
            font-size: 12px;
            text-decoration: none;
            height: 28px;
            margin-right: 12px;
            box-shadow: 0 2px 4px rgba(0, 85, 150, 0.2);
            white-space: nowrap;
            flex-shrink: 0;
            transition: all 0.2s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
        `;

        // 아이콘 및 텍스트 구성
        btn.innerHTML = `
            <svg style="width: 13px; height: 13px; margin-right: 6px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span style="letter-spacing: 0.2px;">NGS 가동률</span>
        `;

        // 마우스 상호작용
        btn.onmouseover = () => {
            btn.style.filter = 'brightness(1.1)';
            btn.style.transform = 'translateY(-1px)';
            btn.style.boxShadow = '0 4px 8px rgba(0, 85, 150, 0.3)';
        };
        btn.onmouseout = () => {
            btn.style.filter = 'brightness(1)';
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 4px rgba(0, 85, 150, 0.2)';
        };

        // 클릭 이벤트 (사이트 내부 스크립트 간섭 방지)
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(NGS_LINK, '_blank', 'noopener,noreferrer');
        };

        // 5. 컨테이너 스타일 설정 및 버튼 삽입
        combineSearch.style.display = 'flex';
        combineSearch.style.alignItems = 'center';
        combineSearch.style.justifyContent = 'flex-end';
        combineSearch.prepend(btn);
    }

    // 초기 실행
    injectButton();

    // 동적 변화 감지 및 재주입 (Observer)
    const observer = new MutationObserver((mutations) => {
        // 성능을 위해 루프 없이 바로 실행 (함수 내부에 중복 체크 로직 포함됨)
        injectButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Observer가 놓칠 수 있는 상황을 대비한 폴백 타이머 (2초 주기)
    setInterval(injectButton, 2000);

})();

