// ==UserScript==
// @name         YouTube 댓글/추천/PIP/전체화면 버튼 (데스크탑/모바일 하이브리드)
// @namespace    http://tampermonkey.net/
// @version      1.80
// @description  [v1.80] PIP 버튼 상태 오류 수정: 버튼이 활성 상태일 때 클릭 시, 실제 상태 무관하게 PIP 종료 시도 및 상태 초기화.
// @author       DP
// @match        https://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @noframes
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553441/YouTube%20%EB%8C%93%EA%B8%80%EC%B6%94%EC%B2%9CPIP%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20%EB%B2%84%ED%8A%BC%20%28%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%83%91%EB%AA%A8%EB%B0%94%EC%9D%BC%20%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553441/YouTube%20%EB%8C%93%EA%B8%80%EC%B6%94%EC%B2%9CPIP%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20%EB%B2%84%ED%8A%BC%20%28%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%83%91%EB%AA%A8%EB%B0%94%EC%9D%BC%20%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. SCRIPT-WIDE CONSTANTS (SHARED) ---
    const PIP_BUTTON_COLOR = '#EE0F0F';
    const PIP_BUTTON_ACTIVE_COLOR = '#ECB7B7';
    const M_BTN_BASE_BG = '#272727';
    const M_BTN_ACTIVE_BG = '#535353';
    const M_BTN_TEXT = '#FFFFFF';
    const M_BTN_BORDER = 'rgba(255, 255, 255, 0.2)';

    // --- 1. BROWSER/ENVIRONMENT DETECTION ---
    const isTouchDevice = ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));
    const isIOS = (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) || (navigator.platform === 'MacIntel' && isTouchDevice);
    const isFirefox = /Firefox/i.test(navigator.userAgent);
    const isMobileWeb = window.location.hostname === 'm.youtube.com';

    if (isMobileWeb) {
        /*******************************************************************/
        /* --- 2. MOBILE WEB --- (v1.80)                  */
        /* (m.youtube.com 에 접속했을 때 실행되는 코드)         */
        /*******************************************************************/
        console.log("YouTube Mobile Web 스크립트 v1.80-M 로드 중...");

        // --- M: 상수 ---
        const M_COMMENTS_BUTTON_ID = 'toggle-comments-mobile-button';
        const M_RELATED_BUTTON_ID = 'toggle-related-mobile-button';
        const M_BOTH_BUTTON_ID = 'toggle-both-mobile-button';
        const M_FULLSCREEN_BUTTON_ID = 'toggle-fullscreen-mobile-button';
        const M_PIP_BUTTON_ID = 'toggle-pip-mobile-button';
        const M_BUTTON_GROUP_ID = 'custom-button-group-mobile-container';
        const M_BUTTON_INSERTION_POINT_SELECTOR = 'ytm-single-column-watch-next-results-renderer';
        const M_COMMENTS_CONTAINER_SELECTOR = 'ytm-item-section-renderer:has(yt-video-metadata-carousel-view-model)';
        const M_RELATED_CONTAINER_SELECTOR = 'ytm-item-section-renderer[section-identifier="related-items"]';
        const M_VIDEO_SELECTOR = 'video.html5-main-video';
        const M_NATIVE_PIP_BUTTON_SELECTOR = '.ytp-pip-button';

        // --- M: 상태 ---
        let mobileSetupComplete = false;
        let currentVideoId_M = null;
        let debounceTimer_M = null;

        // --- M: CSS --- (v1.79 스타일 유지)
        GM_addStyle(`
            ${M_COMMENTS_CONTAINER_SELECTOR}.hidden-section-mobile,
            ${M_RELATED_CONTAINER_SELECTOR}.hidden-section-mobile { display: none !important; }
            #${M_BUTTON_GROUP_ID} { display: flex; height: 36px; border-radius: 18px !important; overflow: hidden !important; margin: 8px 12px 4px 12px; position: relative; z-index: 1; }
            #${M_BUTTON_GROUP_ID} button { all: unset; cursor: pointer; height: 100%; padding: 0 12px; font-family: "Roboto", "Arial", sans-serif; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.1s ease; flex: 1; text-align: center; white-space: nowrap; border: none; }
            button#${M_COMMENTS_BUTTON_ID}, button#${M_RELATED_BUTTON_ID}, button#${M_BOTH_BUTTON_ID} { background-color: ${M_BTN_BASE_BG} !important; color: ${M_BTN_TEXT} !important; border-right: 1px solid ${M_BTN_BORDER}; }
            button#${M_COMMENTS_BUTTON_ID}:hover, button#${M_RELATED_BUTTON_ID}:hover, button#${M_BOTH_BUTTON_ID}:hover,
            button#${M_COMMENTS_BUTTON_ID}.active, button#${M_RELATED_BUTTON_ID}.active, button#${M_BOTH_BUTTON_ID}.active { background-color: ${M_BTN_ACTIVE_BG} !important; }
            button#${M_FULLSCREEN_BUTTON_ID} { background-color: ${PIP_BUTTON_COLOR} !important; color: white !important; border-right: 1px solid ${M_BTN_BORDER}; }
            button#${M_FULLSCREEN_BUTTON_ID}:hover { background-color: color-mix(in srgb, ${PIP_BUTTON_COLOR} 85%, black) !important; }
            button#${M_FULLSCREEN_BUTTON_ID}.active { background-color: ${PIP_BUTTON_ACTIVE_COLOR} !important; color: black !important; }
            button#${M_PIP_BUTTON_ID} { background-color: ${PIP_BUTTON_COLOR} !important; color: white !important; border-right: none; }
            button#${M_PIP_BUTTON_ID}:hover { background-color: color-mix(in srgb, ${PIP_BUTTON_COLOR} 85%, black) !important; }
            button#${M_PIP_BUTTON_ID}.active { background-color: ${PIP_BUTTON_ACTIVE_COLOR} !important; color: black !important; }
        `);
        // console.log("M: CSS 스타일 적용됨");

        // --- M: 헬퍼 함수 ---
        function dispatchMouseClick_M(element) { if (!element) return false; try { const downEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }); const upEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }); element.dispatchEvent(downEvent); element.dispatchEvent(upEvent); return true; } catch (e) { console.error("M: 마우스 이벤트 디스패치 실패:", e); return false; } }
        function forceShowPlayerControls_M(callback) { const player = document.querySelector('ytm-player, ytm-player-legacy'); if (!player) return; const tapEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window }); player.dispatchEvent(tapEvent); setTimeout(callback, 10); }
        function updatePipButtonStyle_M() { const pipButton = document.getElementById(M_PIP_BUTTON_ID); if (pipButton) pipButton.classList.toggle('active', !!document.pictureInPictureElement); }
        function setupPipListeners_M() { if (isFirefox) return; const video = document.querySelector(M_VIDEO_SELECTOR); if (video && !video.dataset.pipListenersAttached) { video.addEventListener('enterpictureinpicture', updatePipButtonStyle_M); video.addEventListener('leavepictureinpicture', updatePipButtonStyle_M); video.dataset.pipListenersAttached = 'true'; } }

        // --- [v1.80] PIP 토글 로직 수정 ---
        async function togglePip_M() {
            const pipButton = document.getElementById(M_PIP_BUTTON_ID);
            const isVisuallyActive = pipButton && pipButton.classList.contains('active');

            if (isFirefox) {
                console.log("M-Firefox: 'click'로 컨트롤바 표시 시도...");
                forceShowPlayerControls_M(() => {
                    const nativePipButton = document.querySelector(M_NATIVE_PIP_BUTTON_SELECTOR);
                    if (nativePipButton) {
                        console.log("M-Firefox: PIP 버튼 클릭!");
                        dispatchMouseClick_M(nativePipButton);
                        // 클릭 후 상태 강제 업데이트 (실제 상태와 무관하게 토글된 것처럼 처리)
                        if(pipButton) pipButton.classList.toggle('active');
                    } else {
                        console.error("M-Firefox PIP 실패: 네이티브 버튼(.ytp-pip-button)을 찾을 수 없습니다.");
                        if(pipButton) pipButton.classList.remove('active'); // 실패 시 비활성화
                    }
                });
                return;
            }

            // 표준 API
            if (isVisuallyActive) { // 버튼이 활성화된 것처럼 보일 때 (상태 꼬임 포함)
                console.log("M-PIP: 버튼 활성 상태 -> 종료 시도 및 상태 초기화");
                try {
                    if (document.pictureInPictureElement) { // 실제 PIP 상태이면 종료 시도
                       await document.exitPictureInPicture();
                    }
                } catch (error) {
                    console.error("M-PIP 종료 시도 중 오류 (무시 가능):", error);
                } finally {
                    // 성공/실패 여부와 관계없이 버튼 상태 강제 비활성화
                    if (pipButton) pipButton.classList.remove('active');
                }
            } else { // 버튼이 비활성화된 것처럼 보일 때
                console.log("M-PIP: 버튼 비활성 상태 -> 시작 시도");
                try {
                    const video = document.querySelector(M_VIDEO_SELECTOR);
                    if (!video) {
                        console.warn("M-PIP: 비디오 요소를 찾을 수 없습니다.");
                        return;
                    }
                    if (!document.pictureInPictureElement) { // 만약 실제론 PIP가 아니라면 시작
                       setupPipListeners_M();
                       await video.requestPictureInPicture();
                       // 성공 시 리스너가 상태 업데이트하므로 여기서 active 추가 안 함
                    } else {
                         // 혹시 실제론 PIP 상태인데 버튼만 비활성이었다면? 종료 시도
                         await document.exitPictureInPicture();
                         if(pipButton) pipButton.classList.remove('active'); // 확실히 비활성화
                    }
                } catch (error) {
                    console.error("M-PIP 시작/종료 시도 중 오류:", error);
                    // 실패 시 버튼 상태 변경 안 함 (또는 비활성화 유지)
                    if (pipButton) pipButton.classList.remove('active');
                }
            }
        }

        function updateFullscreenButtonStyle_M() { /* ... v1.79와 동일 ... */ const btn = document.getElementById(M_FULLSCREEN_BUTTON_ID); if (btn) { const isFs = !!(document.fullscreenElement || document.webkitIsFullScreen); btn.classList.toggle('active', isFs); } }
        async function toggleFullscreen_M() { /* ... v1.79와 동일 ... */ try { if (document.fullscreenElement || document.webkitIsFullScreen) { console.log("M: exitFullscreen 시도"); await document.exitFullscreen(); } else { console.log("M: requestFullscreen 시도"); const video = document.querySelector(M_VIDEO_SELECTOR); if (!video) { console.warn("M-전체화면: 비디오 요소를 찾을 수 없습니다."); return; } const playerContainer = video.closest('ytm-player, ytm-player-legacy, .player-size') || video; await playerContainer.requestFullscreen(); } } catch (e) { console.error("M-전체화면 토글 중 오류:", e); } }

        document.addEventListener('fullscreenchange', updateFullscreenButtonStyle_M);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonStyle_M);

        // --- M: 핵심 기능 함수 --- (v1.79와 동일)
        function showSection_M(mode = 'comments') { const commentsContainer = document.querySelector(M_COMMENTS_CONTAINER_SELECTOR); const relatedContainers = document.querySelectorAll(M_RELATED_CONTAINER_SELECTOR); const commentsButton = document.getElementById(M_COMMENTS_BUTTON_ID); const relatedButton = document.getElementById(M_RELATED_BUTTON_ID); const bothButton = document.getElementById(M_BOTH_BUTTON_ID); if (!commentsContainer || relatedContainers.length === 0) { } if (mode === 'comments') { if (commentsContainer) commentsContainer.classList.remove('hidden-section-mobile'); relatedContainers.forEach(el => el.classList.add('hidden-section-mobile')); } else if (mode === 'related') { if (commentsContainer) commentsContainer.classList.add('hidden-section-mobile'); relatedContainers.forEach(el => el.classList.remove('hidden-section-mobile')); } else { if (commentsContainer) commentsContainer.classList.remove('hidden-section-mobile'); relatedContainers.forEach(el => el.classList.remove('hidden-section-mobile')); } if (commentsButton) commentsButton.classList.toggle('active', mode === 'comments'); if (relatedButton) relatedButton.classList.toggle('active', mode === 'related'); if (bothButton) bothButton.classList.toggle('active', mode === 'both'); }
        function setupGroupButtons_M() { if (mobileSetupComplete) return true; const insertionParent = document.querySelector(M_BUTTON_INSERTION_POINT_SELECTOR); if (!insertionParent) { return false; } let group = document.getElementById(M_BUTTON_GROUP_ID); if (!group) { group = document.createElement('div'); group.id = M_BUTTON_GROUP_ID; insertionParent.prepend(group); console.log("M: 버튼 그룹 생성됨."); } else { group.innerHTML = ''; } const btns = [ { id: M_COMMENTS_BUTTON_ID, text: '댓글', fn: () => showSection_M('comments') }, { id: M_RELATED_BUTTON_ID, text: '추천', fn: () => showSection_M('related') }, { id: M_BOTH_BUTTON_ID, text: '둘다', fn: () => showSection_M('both') }, { id: M_FULLSCREEN_BUTTON_ID, text: '전체', fn: toggleFullscreen_M }, { id: M_PIP_BUTTON_ID, text: 'PIP', fn: togglePip_M }, ]; for (const b of btns) { const el = document.createElement('button'); el.id = b.id; el.textContent = b.text; el.onclick = b.fn; group.appendChild(el); } setTimeout(() => { updateFullscreenButtonStyle_M(); if (!isFirefox) { updatePipButtonStyle_M(); setupPipListeners_M(); } }, 500); showSection_M('comments'); mobileSetupComplete = true; console.log("Part M (Mobile Button Group) 설정 완료"); return true; }

        // --- M: MutationObserver --- (v1.79와 동일)
        function mutationCallback_M() { clearTimeout(debounceTimer_M); debounceTimer_M = setTimeout(async () => { const newId = new URLSearchParams(window.location.search).get('v'); const watchPage = document.querySelector('ytm-watch:not([hidden])'); if (watchPage && newId && (newId !== currentVideoId_M || !mobileSetupComplete)) { if (newId !== currentVideoId_M) { currentVideoId_M = newId; mobileSetupComplete = false; } if (!mobileSetupComplete) { if (setupGroupButtons_M()) { if (!isFirefox) setupPipListeners_M(); } } else { if (!isFirefox) setupPipListeners_M(); } } }, 300); }

        const observer_M = new MutationObserver(mutationCallback_M);
        const startObserver_M = () => { if (document.body) { observer_M.observe(document.body, { childList: true, subtree: true }); console.log("M: Mobile Observer 시작 (v1.80)"); mutationCallback_M(); } else requestAnimationFrame(startObserver_M); };
        startObserver_M();

    } else {
        /*******************************************************************/
        /* --- 3. DESKTOP WEB --- (v1.80)                  */
        /* (www.youtube.com 등 모바일이 아닐 때 실행되는 코드)     */
        /*******************************************************************/

        console.log("YouTube Desktop Web 스크립트 v1.80-D 로드 중...");

        // --- 상수 정의 ---
        const COMMENTS_BUTTON_ID = 'toggle-comments-userscript-button';
        const RELATED_BUTTON_ID = 'toggle-related-userscript-button';
        const BOTH_BUTTON_ID = 'toggle-both-userscript-button';
        const FULLSCREEN_BUTTON_ID = 'toggle-fullscreen-userscript-button';
        const PIP_BUTTON_ID = 'toggle-pip-userscript-button';
        const BUTTON_GROUP_ID = 'custom-button-group-container';
        const METADATA_TOGGLE_LINK_ID = 'metadata-toggle-link';
        const RICH_METADATA_CONTAINER_SELECTOR = 'ytd-watch-metadata > #above-the-fold + ytd-metadata-row-container-renderer';
        const RICH_METADATA_CONTENT_SELECTOR = '#always-shown ytd-rich-metadata-row-renderer';
        const RICH_METADATA_ALWAYS_SHOWN_SELECTOR = '#always-shown';
        const RICH_METADATA_COLLAPSIBLE_SELECTOR = '#collapsible';
        const RELATED_CONTAINER_SELECTOR = 'ytd-watch-next-secondary-results-renderer';
        const COMMENTS_CONTAINER_SELECTOR = '#comments';
        const BUTTON_CONTAINER_SELECTOR = '#clarify-box';
        const WATCH_FLEXY_SELECTOR = 'ytd-watch-flexy';
        const VIDEO_SELECTOR = 'video.html5-main-video';
        const PLAYER_CONTAINER_SELECTOR = '#movie_player';
        const NATIVE_PIP_BUTTON_SELECTOR = '.ytp-pip-button';

        // --- 상태 변수 ---
        let setupPartA_Complete = false;
        let setupPartC_Complete = false;
        let currentVideoId = null;
        let debounceTimer = null;

        // --- CSS 추가 ---
        GM_addStyle(`
            ${RELATED_CONTAINER_SELECTOR}.hidden-section { display: none !important; }
            ${RELATED_CONTAINER_SELECTOR}.visible-section { display: block !important; visibility: visible; opacity: 1; transition: opacity 0.3s ease; }
            ${COMMENTS_CONTAINER_SELECTOR}.hidden-section { display: none !important; }
            ${COMMENTS_CONTAINER_SELECTOR}.visible-section { display: block !important; visibility: visible; opacity: 1; transition: opacity 0.3s ease; }
            ${BUTTON_CONTAINER_SELECTOR} { display: flex !important; justify-content: flex-start !important; padding: 0 !important; margin-top: 8px !important; margin-bottom: 8px !important; }
            #${BUTTON_GROUP_ID} { display: inline-flex; height: var(--yt-spec-touch-target-height, 36px); border-radius: var(--yt-spec-button-border-radius, 18px) !important; overflow: hidden !important; flex-shrink: 0; margin-left: 12px; }
            #${BUTTON_GROUP_ID} button { all: unset; cursor: pointer; height: 100%; padding: 0 16px; font-family: "YouTube Noto", "Roboto", "Arial", sans-serif; font-size: var(--yt-spec-button-font-size, 14px); font-weight: var(--yt-spec-button-font-weight, 500); display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.1s ease; }
            button#${COMMENTS_BUTTON_ID}, button#${RELATED_BUTTON_ID}, button#${BOTH_BUTTON_ID} { background-color: var(--yt-spec-button-chip-background, rgba(255,255,255,0.1)); color: var(--yt-spec-text-primary, #fff); border-right: 1px solid var(--yt-spec-10-percent-layer, rgba(255,255,255,0.1)); }
            button#${COMMENTS_BUTTON_ID}:hover, button#${RELATED_BUTTON_ID}:hover, button#${BOTH_BUTTON_ID}:hover,
            button#${COMMENTS_BUTTON_ID}.active, button#${RELATED_BUTTON_ID}.active, button#${BOTH_BUTTON_ID}.active { background-color: var(--yt-spec-button-chip-background-hover, rgba(255,255,255,0.2)); }
            button#${FULLSCREEN_BUTTON_ID} { background-color: ${PIP_BUTTON_COLOR} !important; color: white !important; border-right: 1px solid rgba(255,255,255,0.1); }
            button#${FULLSCREEN_BUTTON_ID}:hover { background-color: color-mix(in srgb, ${PIP_BUTTON_COLOR} 85%, black) !important; }
            button#${FULLSCREEN_BUTTON_ID}.active { background-color: ${PIP_BUTTON_ACTIVE_COLOR} !important; color: black !important; }
            button#${PIP_BUTTON_ID} { background-color: ${PIP_BUTTON_COLOR} !important; color: white !important; border-right: none; }
            button#${PIP_BUTTON_ID}:hover { background-color: color-mix(in srgb, ${PIP_BUTTON_COLOR} 85%, black) !important; }
            button#${PIP_BUTTON_ID}.active { background-color: ${PIP_BUTTON_ACTIVE_COLOR} !important; color: black !important; }
            #${METADATA_TOGGLE_LINK_ID} { all: unset; display: inline-block; cursor: pointer; font-family: "YouTube Noto", "Roboto", "Arial", sans-serif; font-size: 14px; font-weight: 500; padding: 8px 16px; margin: 8px 0 12px 0; background-color: var(--yt-spec-button-chip-background, rgba(255,255,255,0.1)); color: var(--yt-spec-text-primary, #fff); border-radius: 18px; transition: background-color 0.1s ease; text-align: left; box-sizing: border-box; }
            #${METADATA_TOGGLE_LINK_ID}:hover { background-color: var(--yt-spec-button-chip-background-hover, rgba(255,255,255,0.2)); color: var(--yt-spec-text-primary, #fff); }
        `);
        // console.log("D: CSS 스타일 적용됨");

        // --- D: 헬퍼 및 기능 함수 ---
        function showSection(mode = 'comments', shouldScroll = false) { /* ... v1.78과 동일 ... */ const commentsContainer = document.querySelector(COMMENTS_CONTAINER_SELECTOR); const relatedContainer = document.querySelector(RELATED_CONTAINER_SELECTOR); const commentsButton = document.getElementById(COMMENTS_BUTTON_ID); const relatedButton = document.getElementById(RELATED_BUTTON_ID); const bothButton = document.getElementById(BOTH_BUTTON_ID); if (!commentsContainer || !relatedContainer) return; if (mode === 'comments') { commentsContainer.classList.remove('hidden-section'); commentsContainer.classList.add('visible-section'); relatedContainer.classList.remove('visible-section'); relatedContainer.classList.add('hidden-section'); } else if (mode === 'related') { commentsContainer.classList.remove('visible-section'); commentsContainer.classList.add('hidden-section'); relatedContainer.classList.remove('hidden-section'); relatedContainer.classList.add('visible-section'); } else { commentsContainer.classList.add('visible-section'); relatedContainer.classList.add('visible-section'); } if (shouldScroll) { const targetScroll = (mode === 'comments') ? commentsContainer : relatedContainer; setTimeout(() => targetScroll.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); } if (commentsButton) commentsButton.classList.toggle('active', mode === 'comments'); if (relatedButton) relatedButton.classList.toggle('active', mode === 'related'); if (bothButton) bothButton.classList.toggle('active', mode === 'both'); }
        function dispatchMouseClick(element) { /* ... v1.78과 동일 ... */ if (!element) return false; try { const downEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }); const upEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }); element.dispatchEvent(downEvent); element.dispatchEvent(upEvent); return true; } catch (e) { console.error("D: 마우스 이벤트 디스패치 실패:", e); return false; } }
        function forceShowPlayerControls(callback) { /* ... v1.78과 동일 ... */ const player = document.querySelector(PLAYER_CONTAINER_SELECTOR); if (!player) return; const moveEvent = new MouseEvent('mousemove', { bubbles: true, cancelable: true, view: window }); player.dispatchEvent(moveEvent); setTimeout(callback, 10); }
        function updatePipButtonStyle() { /* ... v1.78과 동일 ... */ const pipButton = document.getElementById(PIP_BUTTON_ID); if (pipButton) pipButton.classList.toggle('active', !!document.pictureInPictureElement); }
        function setupPipListeners() { /* ... v1.78과 동일 ... */ if (isFirefox) return; const video = document.querySelector(VIDEO_SELECTOR); if (video && !video.dataset.pipListenersAttached) { video.addEventListener('enterpictureinpicture', updatePipButtonStyle); video.addEventListener('leavepictureinpicture', updatePipButtonStyle); video.dataset.pipListenersAttached = 'true'; } }

        // --- [v1.80] PIP 토글 로직 수정 ---
        async function togglePip() {
            const pipButton = document.getElementById(PIP_BUTTON_ID);
            const isVisuallyActive = pipButton && pipButton.classList.contains('active');

            if (isFirefox) {
                console.log("D-Firefox: 컨트롤바 표시 시도...");
                forceShowPlayerControls(() => {
                    const nativePipButton = document.querySelector(NATIVE_PIP_BUTTON_SELECTOR);
                    if (nativePipButton) {
                        console.log("D-Firefox: PIP 버튼 클릭!");
                        dispatchMouseClick(nativePipButton);
                         // 클릭 후 상태 강제 업데이트
                        if(pipButton) pipButton.classList.toggle('active');
                    } else {
                        console.error("D-Firefox PIP 실패: 네이티브 버튼(.ytp-pip-button)을 찾을 수 없습니다.");
                         if(pipButton) pipButton.classList.remove('active'); // 실패 시 비활성화
                    }
                });
                return;
            }

            // 표준 API
            if (isVisuallyActive) { // 버튼 활성 상태일 때
                 console.log("D-PIP: 버튼 활성 상태 -> 종료 시도 및 상태 초기화");
                 try {
                     if (document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                     }
                 } catch (error) {
                     console.error("D-PIP 종료 시도 중 오류 (무시 가능):", error);
                 } finally {
                     if (pipButton) pipButton.classList.remove('active'); // 강제 비활성화
                 }
            } else { // 버튼 비활성 상태일 때
                 console.log("D-PIP: 버튼 비활성 상태 -> 시작 시도");
                 try {
                     const video = document.querySelector(VIDEO_SELECTOR);
                     if (!video) {
                         console.warn("D-PIP: 비디오 요소를 찾을 수 없습니다.");
                         return;
                     }
                      if (!document.pictureInPictureElement) {
                         setupPipListeners();
                         await video.requestPictureInPicture();
                         // 성공 시 리스너가 상태 업데이트
                     } else {
                         await document.exitPictureInPicture(); // 혹시 모를 종료 시도
                         if(pipButton) pipButton.classList.remove('active');
                     }
                 } catch (error) {
                     console.error("D-PIP 시작/종료 시도 중 오류:", error);
                     if (pipButton) pipButton.classList.remove('active'); // 실패 시 비활성화
                 }
            }
        }


        function updateFullscreenButtonStyle() { /* ... v1.78과 동일 ... */ const btn = document.getElementById(FULLSCREEN_BUTTON_ID); if (btn) { const isFs = !!(document.fullscreenElement || document.webkitIsFullScreen); btn.classList.toggle('active', isFs); } }
        async function toggleFullscreen() { /* ... v1.78과 동일 ... */ try { if (document.fullscreenElement || document.webkitIsFullScreen) { console.log("D: exitFullscreen 시도"); await document.exitFullscreen(); } else { console.log("D: requestFullscreen 시도"); const video = document.querySelector(VIDEO_SELECTOR); if (!video) { console.warn("D-전체화면: 비디오 요소를 찾을 수 없습니다."); return; } const playerContainer = video.closest(PLAYER_CONTAINER_SELECTOR) || video; await playerContainer.requestFullscreen(); } } catch (e) { console.error("D-전체화면 토글 중 오류:", e); } }

        document.addEventListener('fullscreenchange', updateFullscreenButtonStyle);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonStyle);

        function toggleMetadataSection() { /* ... v1.78과 동일 ... */ const link = document.getElementById(METADATA_TOGGLE_LINK_ID); const container = link ? link.closest(RICH_METADATA_CONTAINER_SELECTOR) : null; if (!container || !link) return; const alwaysShown = container.querySelector(RICH_METADATA_ALWAYS_SHOWN_SELECTOR); const collapsible = container.querySelector(RICH_METADATA_COLLAPSIBLE_SELECTOR); const isCurrentlyHidden = alwaysShown && alwaysShown.style.display === 'none'; if (isCurrentlyHidden) { if (alwaysShown) alwaysShown.style.display = ''; if (collapsible) collapsible.style.display = ''; link.textContent = '정보 접기'; } else { if (alwaysShown) alwaysShown.style.display = 'none'; if (collapsible) collapsible.style.display = 'none'; link.textContent = '정보 펼치기'; } }

        // --- [v1.78] 데스크탑: 메타데이터 토글 함수 개선된 로직 유지 ---
        function setupMetadataToggle() {
            // 완료 플래그 제거, 항상 재검사
            const container = document.querySelector(RICH_METADATA_CONTAINER_SELECTOR);
            const oldLink = document.getElementById(METADATA_TOGGLE_LINK_ID);
            const hasContent = container && container.querySelector(RICH_METADATA_CONTENT_SELECTOR);

            let alwaysShown = container ? container.querySelector(RICH_METADATA_ALWAYS_SHOWN_SELECTOR) : null;
            let collapsible = container ? container.querySelector(RICH_METADATA_COLLAPSIBLE_SELECTOR) : null;

            if (!container || !hasContent) { // 콘텐츠 없으면
                if (oldLink) { oldLink.remove(); } // 버튼 제거
                // native 섹션 보이도록 복원
                if (alwaysShown) alwaysShown.style.display = '';
                if (collapsible) collapsible.style.display = '';
                setupPartC_Complete = true; // 완료 처리 (불필요한 반복 방지 목적)
                return true;
            }

            // --- 메타데이터 내용이 있는 경우 ---
            let link = oldLink;
            if (!link) { // 버튼 없으면 생성
                link = document.createElement('div');
                link.id = METADATA_TOGGLE_LINK_ID;
                link.onclick = toggleMetadataSection;
                container.prepend(link);
            }
            link.style.display = 'inline-block'; // 버튼 보이도록

            // 초기 상태: 내용 숨기고 버튼 텍스트 설정
            if (alwaysShown) alwaysShown.style.display = 'none';
            if (collapsible) collapsible.style.display = 'none';
            link.textContent = '정보 펼치기';

            setupPartC_Complete = true; // 완료 처리
            return true;
        }


        function setupGroupButtons() { /* ... v1.78과 동일 ... */ if (setupPartA_Complete) return true; const container = document.querySelector(BUTTON_CONTAINER_SELECTOR); if (!container) return false; let group = document.getElementById(BUTTON_GROUP_ID); if (!group) { group = document.createElement('div'); group.id = BUTTON_GROUP_ID; container.appendChild(group); } else group.innerHTML = ''; const btns = [ { id: COMMENTS_BUTTON_ID, text: '댓글', fn: () => showSection('comments') }, { id: RELATED_BUTTON_ID, text: '추천 영상', fn: () => showSection('related') }, { id: BOTH_BUTTON_ID, text: '둘다', fn: () => showSection('both') }, ]; if (!isIOS) { btns.push({ id: FULLSCREEN_BUTTON_ID, text: '전체화면', fn: toggleFullscreen }); } btns.push({ id: PIP_BUTTON_ID, text: 'PIP', fn: togglePip }); for (const b of btns) { const el = document.createElement('button'); el.id = b.id; el.textContent = b.text; el.onclick = b.fn; group.appendChild(el); } setTimeout(() => { if (!isIOS) updateFullscreenButtonStyle(); if (!isFirefox) { updatePipButtonStyle(); setupPipListeners(); } }, 500); isTouchDevice ? showSection('comments') : showSection('both'); setupPartA_Complete = true; /* console.log("Part A 설정 완료"); */ return true; }

        // --- D: MutationObserver --- (v1.78과 동일 - 로직 유지)
        function mutationCallback() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const newId = new URLSearchParams(window.location.search).get('v');
                const watchPage = document.querySelector(WATCH_FLEXY_SELECTOR);

                if (newId && watchPage) { // 비디오 ID가 있고, 비디오 페이지에 있다면
                    let needsReset = false;
                    if (newId !== currentVideoId) { // 비디오 ID가 변경되었는지 확인
                        currentVideoId = newId;
                        setupPartA_Complete = false;
                        setupPartC_Complete = false; // 메타데이터 상태도 리셋
                        needsReset = true;
                    }

                    setupMetadataToggle(); // 항상 호출

                    if (needsReset || !setupPartA_Complete) {
                        setupGroupButtons(); // 버튼 그룹 재설정 시도
                    }

                    if (!isFirefox) setupPipListeners(); // PIP 리스너 설정 시도

                } else if (!newId && currentVideoId) { // 비디오 페이지를 벗어났다면
                    currentVideoId = null;
                    setupPartA_Complete = false;
                    setupPartC_Complete = false;
                }
            }, 300);
        }


        const observer = new MutationObserver(mutationCallback);
        const startObserver = () => { if (document.body) { observer.observe(document.body, { childList: true, subtree: true }); console.log("D: Observer 시작 (v1.80)"); mutationCallback(); } else requestAnimationFrame(startObserver); };
        startObserver();

        console.log("D: 스크립트 실행 시작");
    }

})();
