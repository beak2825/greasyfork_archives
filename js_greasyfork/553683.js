// ==UserScript==
// @name         Go to Sooplivegg
// @namespace    http://tampermonkey.net/
// @version      2.41
// @description  게시물 페이지에서 버튼 클릭 시 sooplivegg.co.kr의 댓글 전용 페이지를 새 탭으로 엽니다. 삽입 안정성을 위해 게시물 컨테이너를 사용합니다.
// @author       Gemini
// @match        *://www.sooplive.co.kr/station/*/post/*
// @match        *://www.sooplivegg.co.kr/station/*/post/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553683/Go%20to%20Sooplivegg.user.js
// @updateURL https://update.greasyfork.org/scripts/553683/Go%20to%20Sooplivegg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Gemini Script] 수플라이브 댓글 페이지 바로가기 v2.4 시작됨 (새 탭 열기 기능 추가).');

    // 버튼 삽입 위치를 게시물 본문이나 페이지의 주요 콘텐츠 컨테이너로 변경합니다.
    const POST_CONTAINER_SELECTOR = '.post_wrap, .view-content-wrap, div[class*="post_body"], .post_view_wrap, .content-wrap, .layout_container, main, section';


    /**
     * 댓글 목록 상단에 'GG 댓글 페이지로 이동' 버튼을 추가하는 함수
     */
    function addNavigationButton() {
        // 게시물 컨테이너를 찾습니다.
        const targetContainer = document.querySelector(POST_CONTAINER_SELECTOR);

        if (!targetContainer) {
            console.warn('[Gemini Script] 경고: 버튼을 삽입할 게시물/페이지 컨테이너를 찾을 수 없습니다.');
            return;
        }

        // 이미 버튼 래퍼가 있는지 확인
        if (document.querySelector('.gg-button-wrapper')) {
            return;
        }

        // 현재 sooplive.co.kr 도메인일 때만 버튼을 생성합니다. (sooplivegg.co.kr에서는 필요 없으므로)
        const currentUrl = window.location.href;
        if (currentUrl.includes('sooplivegg.co.kr')) {
             console.log('[Gemini Script] 현재 GG 도메인입니다. 이동 버튼을 추가하지 않습니다.');
             return;
        }

        // 1. 버튼 래퍼 생성 (버튼의 위치와 스타일을 제어하는 용도)
        const wrapper = document.createElement('div');
        wrapper.className = 'gg-button-wrapper';
        wrapper.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 20px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            border-top: 1px solid #eee;
        `;

        // 2. 버튼 생성 및 스타일링
        const button = document.createElement('button');
        button.textContent = '➡️ GG 댓글 전용 페이지 새 탭으로 열기'; // 텍스트도 새 탭으로 변경
        button.className = 'gg-comment-navigation-btn';

        button.style.cssText = `
            padding: 12px 24px;
            background-color: #f97316; /* Orange color for distinction */
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.4); /* Subtle glow */
            width: fit-content;
        `;
        button.onmouseover = () => button.style.backgroundColor = '#ea580c';
        button.onmouseout = () => button.style.backgroundColor = '#f97316';
        button.onmousedown = () => button.style.transform = 'scale(0.98)';
        button.onmouseup = () => button.style.transform = 'scale(1)';


        // 3. 클릭 이벤트 핸들러 설정
        button.onclick = (e) => {
            e.preventDefault();

            // 현재 URL에서 도메인만 gg로 변경합니다.
            const newUrl = currentUrl.replace('sooplive.co.kr', 'sooplivegg.co.kr');

            console.log(`[Gemini Script] GG 페이지를 새 탭으로 엽니다: ${newUrl}`);

            // 핵심 수정: window.open(URL, '_blank')를 사용하여 새 탭으로 엽니다.
            window.open(newUrl, '_blank');
        };

        // 4. 버튼 삽입: 래퍼에 버튼을 넣고, 래퍼를 컨테이너 맨 위에 삽입합니다.
        wrapper.appendChild(button);
        targetContainer.prepend(wrapper);

        console.log('[Gemini Script] "GG 댓글 전용 페이지 새 탭으로 열기" 버튼이 추가되었습니다.');
    }

    // ---------------------------------------------
    // MutationObserver를 사용하여 페이지 로딩 완료 후 실행
    // ---------------------------------------------
    function observePageLoad() {
        // 페이지가 로드되고 게시물 영역이 나타날 때까지 기다립니다.
        const maxAttempts = 20;
        let attempt = 0;

        const tryAddingButton = () => {
            if (document.querySelector(POST_CONTAINER_SELECTOR) || attempt >= maxAttempts) {
                addNavigationButton();
            } else {
                attempt++;
                setTimeout(tryAddingButton, 500);
            }
        };

        tryAddingButton();
    }

    observePageLoad();
})();
