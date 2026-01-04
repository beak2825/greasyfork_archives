// ==UserScript==
// @name         CHZZK - 넓은 화면 자동 선택
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @namespace    http://tampermonkey.net/
// @license      MIT
// @author       maplestudy
// @version      1.0
// @match        *://*.chzzk.naver.com/*
// @description  치지직 넓은 화면 자동 선택
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551861/CHZZK%20-%20%EB%84%93%EC%9D%80%20%ED%99%94%EB%A9%B4%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/551861/CHZZK%20-%20%EB%84%93%EC%9D%80%20%ED%99%94%EB%A9%B4%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let firstRun = true;

    function triggerClick(element) {
        if (element) {
            element.click();

            let event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        }
    }

    function enableWideScreen() {
        let wideButton = document.querySelector('.pzp-viewmode-button');
        if (!wideButton) return;

        // 이미 넓은 화면 모드인지 확인 (aria-label 또는 클래스로 체크)
        let isWideMode = wideButton.classList.contains('pzp-viewmode-button--active') ||
                         wideButton.getAttribute('aria-pressed') === 'true';

        // 넓은 화면이 아닐 때만 클릭
        if (!isWideMode) {
            triggerClick(wideButton);
        }
    }

    function initWideScreen() {
        let delay = firstRun ? 1500 : 500; // 첫 진입: 1.5초, 이후: 0.5초
        firstRun = false;

        setTimeout(() => {
            let wideButton = document.querySelector('.pzp-viewmode-button');
            if (wideButton) {
                enableWideScreen();
            } else {
                // 버튼이 없으면 감지 대기
                let observer = new MutationObserver((mutations, obs) => {
                    let wideButton = document.querySelector('.pzp-viewmode-button');
                    if (wideButton) {
                        enableWideScreen();
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        }, delay);
    }

    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (currentUrl.includes('/live/')) {
                    callback();
                }
            }
        }).observe(document, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (currentUrl.includes('/live/')) {
                    callback();
                }
            }
        });
    }

    // URL이 /live/로 시작하는 경우에만 실행
    if (location.href.includes('/live/')) {
        initWideScreen();
    }
    observeUrlChange(initWideScreen);
})();
