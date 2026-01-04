// ==UserScript==
// @name         unlucid.ai 자동 출석체크
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  unlucid.ai 사이트에 방문하여 로그인, 출석체크를 자동으로 수행하고 탭을 닫습니다. (속도 및 안정성 개선)
// @author       AI Assistant
// @match        https://unlucid.ai/*
// @match        https://accounts.google.com/*
// @grant        window.close
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551206/unlucidai%20%EC%9E%90%EB%8F%99%20%EC%B6%9C%EC%84%9D%EC%B2%B4%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551206/unlucidai%20%EC%9E%90%EB%8F%99%20%EC%B6%9C%EC%84%9D%EC%B2%B4%ED%81%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 설정: 만약 버튼이 찾아지지 않는다면, 이 부분의 텍스트를 실제 사이트의 버튼 텍스트와 맞게 수정해주세요. ---
    const SIGN_IN_BUTTON_TEXT = 'Sign in';
    const GOOGLE_BUTTON_TEXT = 'Google';
    const ATTENDANCE_BUTTON_TEXT = 'Claim Free Gems!';
    // ---------------------------------------------------------------------------------------------------------

    /**
     * 특정 텍스트를 포함하는 버튼을 찾는 헬퍼 함수 (대소문자 구분 없음)
     * @param {string} text - 찾을 버튼의 텍스트
     * @returns {HTMLElement|null} - 찾은 버튼 요소 또는 null
     */
    function findButtonByText(text) {
        const buttons = document.querySelectorAll('button');
        const searchText = text.toLowerCase();
        for (const button of buttons) {
            if (button.textContent.trim().toLowerCase().includes(searchText)) {
                return button;
            }
        }
        return null;
    }

    /**
     * 특정 요소가 나타나거나 조건에 맞을 때까지 기다리는 Promise 기반 함수
     * @param {function} selectorFn - 요소를 찾고 조건을 확인하는 함수. 요소를 반환하면 성공.
     * @param {number} timeout - 최대 대기 시간 (밀리초)
     * @returns {Promise<HTMLElement>} - 찾아낸 요소를 resolve하는 프로미스
     */
    function waitForElement(selectorFn, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const element = selectorFn();
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = selectorFn();
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true, // 버튼의 disabled 속성 변경 감지를 위해 추가
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element not found within ${timeout / 1000} seconds.`));
            }, timeout);
        });
    }

    // --- unlucid.ai 페이지 처리 로직 ---
    async function handleUnlucidPage() {
        console.log('[출석체크 스크립트] unlucid.ai 페이지입니다.');

        try {
            // "Sign in" 버튼 또는 "Google" 버튼을 먼저 찾습니다.
            const signInButton = findButtonByText(SIGN_IN_BUTTON_TEXT);
            const googleLoginButton = findButtonByText(GOOGLE_BUTTON_TEXT);

            if (signInButton) {
                console.log(`[출석체크 스크립트] "${SIGN_IN_BUTTON_TEXT}" 버튼을 발견했습니다. 클릭합니다.`);
                signInButton.click();

                // "Sign in" 클릭 후 나타나는 "Google" 버튼 기다리기
                const googleButtonAfterClick = await waitForElement(() => findButtonByText(GOOGLE_BUTTON_TEXT));
                console.log(`[출석체크 스크립트] "${GOOGLE_BUTTON_TEXT}" 로그인 버튼을 발견했습니다. 클릭합니다.`);
                googleButtonAfterClick.click();
            } else if (googleLoginButton) {
                console.log(`[출석체크 스크립트] "${GOOGLE_BUTTON_TEXT}" 로그인 버튼을 바로 발견했습니다. 클릭합니다.`);
                googleLoginButton.click();
            } else {
                // 로그인 버튼이 없으면, 로그인된 상태로 간주하고 출석체크 로직 실행
                console.log('[출석체크 스크립트] 로그인 상태로 판단됩니다. 출석체크 버튼을 찾습니다.');
                
                // 활성화된 출석체크 버튼 기다리기 (최대 5분)
                const attendanceButton = await waitForElement(() => {
                    const btn = findButtonByText(ATTENDANCE_BUTTON_TEXT);
                    // 버튼이 존재하고, disabled 상태가 아닐 때 반환
                    return (btn && !btn.disabled) ? btn : null;
                }, 5 * 60 * 1000);

                console.log('[출석체크 스크립트] 활성화된 출석체크 버튼을 발견했습니다. 클릭합니다.');
                // 1초 대기 후 클릭
                setTimeout(() => {
                    attendanceButton.click();
                    console.log('[출석체크 스크립트] 출석 완료. 2초 후 탭을 닫습니다.');
                    setTimeout(()=>{window.close();}, 2000)
                }, 1000);
            }
        } catch (error) {
            console.error('[출석체크 스크립트] 오류 발생:', error.message);
        }
    }

    // --- Google 로그인 페이지 처리 로직 ---
    async function handleGoogleLoginPage() {
        console.log('[출석체크 스크립트] Google 로그인 페이지를 감지했습니다.');
        try {
            // 계정 선택 요소 기다리기
            const firstAccount = await waitForElement(() => document.querySelector('div[data-email]'));
            console.log(`[출석체크 스크립트] 첫 번째 계정(${firstAccount.dataset.email})을 선택합니다.`);
            firstAccount.click();
        } catch (error) {
            console.error('[출석체크 스크립트] Google 계정 선택 요소를 찾지 못했습니다:', error.message);
        }
    }

    // --- 메인 실행 로직 ---
    function main() {
        console.log(`[출석체크 스크립트] 실행 시작: ${window.location.href}`);

        if (window.location.hostname.includes('unlucid.ai')) {
            handleUnlucidPage();
        } else if (window.location.hostname.includes('accounts.google.com')) {
            handleGoogleLoginPage();
        }
    }

    // 페이지 로드가 완료되면 바로 스크립트 실행
    main();

})();