// ==UserScript==
// @name         Chzzk Util: Auto Click View more
// @name:ko      Chzzk Util: 더보기 버튼 자동화
// @namespace    Chzzk Util: Auto Click View more
// @version      1.1
// @description  치지적 팔로잉 채널의 더보기 버튼을 자동으로 클릭
// @author       DOGJIP
// @match        https://chzzk.naver.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552244/Chzzk%20Util%3A%20Auto%20Click%20View%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/552244/Chzzk%20Util%3A%20Auto%20Click%20View%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;
    let isProcessing = false;
    let checkTimeout = null;
    let retryCount = 0;
    const MAX_RETRIES = 10;
    let theaterModeTimeout = null; // 극장 모드 디바운스용

    // 더보기 버튼 클릭 함수
    function clickMoreButton() {
        if (isProcessing || retryCount >= MAX_RETRIES) {
            if (retryCount >= MAX_RETRIES) {
                //console.log('[CHZZK Auto Expand] 최대 재시도 횟수 도달');
                retryCount = 0;
            }
            return;
        }

        const moreButton = document.querySelector('.navigation_bar_box__5WNl4 button.navigation_bar_more_button__7DoyA');

        if (!moreButton) {
            isProcessing = false;
            retryCount = 0;
            return;
        }

        const ariaLabel = moreButton.getAttribute('aria-label');
        const ariaExpanded = moreButton.getAttribute('aria-expanded');

        if (ariaLabel === '더보기' && ariaExpanded === 'false') {
            //console.log('[CHZZK Auto Expand] 더보기 버튼 클릭 (시도:', ++retryCount, ')');
            isProcessing = true;
            moreButton.click();

            checkTimeout = setTimeout(() => {
                isProcessing = false;
                clickMoreButton();
            }, 300);
        } else if (ariaLabel === '접기') {
            //console.log('[CHZZK Auto Expand] 모든 채널 확장 완료');
            isProcessing = false;
            retryCount = 0;
        } else {
            isProcessing = false;
            retryCount = 0;
        }
    }

    // 극장 모드 전환 처리 (디바운스 적용)
    function handleTheaterModeToggle(source) {
        // 중복 호출 방지
        if (theaterModeTimeout) {
            clearTimeout(theaterModeTimeout);
        }

        //console.log(`[CHZZK Theater Mode] ${source} 감지 - 극장 모드 토글`);

        theaterModeTimeout = setTimeout(() => {
            isProcessing = false;
            retryCount = 0;
            clickMoreButton();
            theaterModeTimeout = null;
        }, 600);
    }

    // 전체화면 변경 감지
    document.addEventListener('fullscreenchange', () => {
        //console.log('[CHZZK Fullscreen] 전체화면 상태 변경');
        handleTheaterModeToggle('전체화면 변경');
    });

    // T키 입력 감지 (극장 모드 토글)
    document.addEventListener('keydown', (e) => {
        // input, textarea 등에서 입력 중일 때는 무시
        if (e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.isContentEditable) {
            return;
        }

        if (e.key === 't' || e.key === 'T') {
            handleTheaterModeToggle('T키');
        }

        if (e.key === 'Escape') {
            handleTheaterModeToggle('Esc키');
        }
    }, { passive: true }); // passive 옵션으로 성능 개선

    // 극장 모드 버튼 클릭 감지 & 메뉴 확장 시
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const ariaLabel = target.getAttribute('aria-label');

        // 극장 모드 버튼 클릭 감지
        if (ariaLabel?.includes('좁은')) {
            handleTheaterModeToggle('극장 모드 버튼');
        }

        // 메뉴 확장 버튼 클릭 감지 (엄밀히 극장 모드는 아님)
        if (ariaLabel?.includes('메뉴 확장')) {
            handleTheaterModeToggle ('메뉴 확장 버튼');
        }
    }, { capture: true, passive: true }); // passive 옵션 추가


    // History API 감지
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleUrlChange();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleUrlChange();
    };

    window.addEventListener('popstate', handleUrlChange);

    // URL 변경 처리 함수
    function handleUrlChange() {
        if (location.href !== lastUrl) {
            //console.log('[CHZZK Auto Expand] URL 변경:', location.href);
            lastUrl = location.href;
            isProcessing = false;
            retryCount = 0;

            if (checkTimeout) clearTimeout(checkTimeout);
            if (theaterModeTimeout) clearTimeout(theaterModeTimeout);

            setTimeout(clickMoreButton, 800);
        }
    }

    // MutationObserver - 더보기 버튼이 나타날 때만 감지
    const observerConfig = {
        childList: true,
        subtree: false
    };

    let observerTimeout = null;
    const observer = new MutationObserver((mutations) => {
        const hasRelevantChange = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node =>
                node.nodeType === 1 &&
                (node.classList?.contains('navigation_bar_box__5WNl4') ||
                 node.querySelector?.('.navigation_bar_box__5WNl4'))
            );
        });

        if (hasRelevantChange) {
            if (observerTimeout) clearTimeout(observerTimeout);
            observerTimeout = setTimeout(() => {
                if (!isProcessing) clickMoreButton();
            }, 100);
        }
    });

    // 네비게이션 영역만 관찰
    function startObserver() {
        const navSection = document.querySelector('nav.navigation_bar_section__hDpyD');
        if (navSection) {
            observer.observe(navSection, observerConfig);
            //console.log('[CHZZK Auto Expand] 네비게이션 영역 감시 시작');
        } else {
            setTimeout(startObserver, 500);
        }
    }

    // 초기화
    function init() {
        //console.log('[CHZZK Auto Expand] 스크립트 시작 (최적화 v3.3)');
        startObserver();
        setTimeout(clickMoreButton, 2000);
        // 초기 로딩 보강: 더보기 버튼이 늦게 생길 경우 5초간 주기적으로 재시도
        let initRetry = 0;
        const initInterval = setInterval(() => {
            const btn = document.querySelector('.navigation_bar_box__5WNl4 button.navigation_bar_more_button__7DoyA');
            if (btn) {
                //console.log('[CHZZK Auto Expand] 초기 더보기 버튼 감지됨 - 클릭');
                clickMoreButton();
                clearInterval(initInterval);
            } else if (++initRetry > 10) {
                clearInterval(initInterval);
            }
        }, 500);
    }

    // DOM이 준비되면 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();