// ==UserScript==
// @name         capsula
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  캡슐뽑기 스크립트
// @author       You
// @match        https://reward.onstove.com/ko
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onstove.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551254/capsula.user.js
// @updateURL https://update.greasyfork.org/scripts/551254/capsula.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Stove Reward 100 뽑기 30회 자동 실행 스크립트 (최종 버전)
(async function() {
    const MAX_ATTEMPTS = 30;
    const DELAY_BETWEEN_ATTEMPTS = 4000; // 2초 대기
    const INITIAL_DELAY = 10000; // 초기 버튼 찾기 대기 시간

    console.log(`Stove Reward 자동 뽑기 시작 (${MAX_ATTEMPTS}회 시도)`);

    // 1. 초기 뽑기 버튼 클릭 (특별한 배경 이미지 버튼)
    try {
        console.log('초기 뽑기 버튼 찾는 중...');
        await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY));

        const initialButton = document.querySelector('button:has(.shrink-0.bg-\\[url\\(\\/images\\/webp-output\\/roulette-flake\\.webp\\)\\])');

        if (!initialButton) {
            throw new Error('초기 뽑기 버튼을 찾을 수 없습니다.');
        }

        console.log('초기 뽑기 버튼 찾음. 클릭 중...');
        initialButton.click();
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS));
    } catch (error) {
        console.error('초기 뽑기 버튼 처리 중 오류:', error);
        return;
    }

    // 2. 100 뽑기 실행 (두 번째부터는 stds-button 클래스 사용)
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        try {
            let drawButton;


			// 두 번째부터는 클래스로 찾기
			drawButton = document.querySelector('button.stds-button.stds-button-secondary');


            if (!drawButton) {
                throw new Error(`${i}회차: 뽑기 버튼을 찾을 수 없습니다.`);
            }

            if (drawButton.disabled) {
                console.log(`${i}회차: 뽑기 버튼이 비활성화 상태입니다. (포인트 부족 또는 일일 한도 도달)`);
                break;
            }

            console.log(`${i}회차: 100 뽑기 실행 중...`);
            drawButton.click();

            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS));


        } catch (error) {
            console.error(`${i}회차 실행 중 오류 발생:`, error);
            break;
        }
    }

    console.log('자동 뽑기 완료!');
})();
    // Your code here...
})();