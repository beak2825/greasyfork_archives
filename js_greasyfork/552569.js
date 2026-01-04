// ==UserScript==
// @name         치지직 채팅창 URL 링크 클릭 가능하게 하기
// @namespace    https://chzzk.naver.com/
// @version      2.1
// @description  치지직 채팅창의 URL을 클릭 가능하게 만들고, 동영상/사이트 미리보기를 제공합니다.
// @author       돈통
// @match        https://chzzk.naver.com/*
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552569/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%EC%B0%BD%20URL%20%EB%A7%81%ED%81%AC%20%ED%81%B4%EB%A6%AD%20%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552569/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%EC%B0%BD%20URL%20%EB%A7%81%ED%81%AC%20%ED%81%B4%EB%A6%AD%20%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // [MODIFIED] 설정 키 정의 (일반 링크 미리보기 추가)
    const SETTING_KEY_ASK = 'ask_before_opening';
    const SETTING_KEY_YOUTUBE_PREVIEW = 'enable_youtube_preview'; // (참고) '동영상 미리보기'의 키로 사용
    const SETTING_KEY_GENERAL_PREVIEW = 'enable_general_preview';

    let askBeforeOpening = true;
    let enableYoutubePreview = true;
    let enableGeneralPreview = true;

    // ------------------- 설정 및 저장 함수 -------------------
    // [MODIFIED] 3가지 설정 로드
    async function loadSettings() {
        askBeforeOpening = await GM.getValue(SETTING_KEY_ASK, true);
        enableYoutubePreview = await GM.getValue(SETTING_KEY_YOUTUBE_PREVIEW, true);
        enableGeneralPreview = await GM.getValue(SETTING_KEY_GENERAL_PREVIEW, true);
    }
    async function setAskBeforeOpening(value, showToast = true) {
        await GM.setValue(SETTING_KEY_ASK, value);
        askBeforeOpening = value;
        updateToggleState();
    }
    async function setEnableYoutubePreview(value, showToast = true) {
        await GM.setValue(SETTING_KEY_YOUTUBE_PREVIEW, value);
        enableYoutubePreview = value;
        updateToggleState();
    }
    // [MODIFIED] 일반 링크 설정 함수 추가
    async function setEnableGeneralPreview(value, showToast = true) {
        await GM.setValue(SETTING_KEY_GENERAL_PREVIEW, value);
        enableGeneralPreview = value;
        updateToggleState();
    }
    // ------------------- DOM 처리 및 UI 추가 로직 -------------------
    function handleUrl(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    function processElement(element) {
        const messageElement = element.querySelector('[class*="live_chatting_message_text__"], [class*="live_chatting_donation_message_text__"]');
        if (!messageElement || messageElement.querySelector('a')) return;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(messageElement.textContent)) {
            const newHtml = messageElement.textContent.replace(urlRegex, (url) =>
                `<a href="${url}" target="_blank" style="color:rgb(116, 159, 254);text-decoration:underline;">${url}</a>`
            );
            messageElement.innerHTML = newHtml;
            messageElement.querySelectorAll('a').forEach(link => link.addEventListener('click', linkClickHandler));
        }
    }

    // [MODIFIED] getPreviewHtml - Soop 스크립트 2.6 버전 로직 적용 (동영상 감지)
    function getPreviewHtml(url) {
        // '동영상 미리보기' 설정이 꺼져있으면 아무것도 안함
        if (!enableYoutubePreview) return null;

        // 1. YouTube
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            const videoId = youtubeMatch[1];
            const timeMatch = url.match(/[?&]t=(\d+)/);
            const startParam = timeMatch ? `?start=${timeMatch[1]}` : '';
            return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 375px; background: #000; margin: 15px auto 0 auto; border-radius: 8px;"><iframe src="https://www.youtube.com/embed/${videoId}${startParam}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`;
        }

        // 2. Chzzk (Clip ONLY)
        const chzzkRegex = /https:\/\/chzzk\.naver\.com\/(?:clips?\/([a-zA-Z0-9_]+)|embed\/clip\/([a-zA-Z0-9_]+))/;
        const chzzkMatch = url.match(chzzkRegex);
        if (chzzkMatch) {
            let embedSrc = '';
            if (chzzkMatch[1]) { // Matched /clips/<id> OR /clip/<id>
                embedSrc = `https://chzzk.naver.com/embed/clip/${chzzkMatch[1]}`;
            } else if (chzzkMatch[2]) { // Matched /embed/clip/<id>
                embedSrc = url; // It's already the embed URL
            }
            return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 375px; background: #000; margin: 15px auto 0 auto; border-radius: 8px;"><iframe src="${embedSrc}" frameborder="0" allow="autoplay; clipboard-write; web-share" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`;
        }

        // 3. Soop VOD
        const soopVodRegex = /https:\/\/vod\.sooplive\.co\.kr\/player\/([0-9]+)/;
        const soopVodMatch = url.match(soopVodRegex);
        if (soopVodMatch && soopVodMatch[1]) {
            const videoId = soopVodMatch[1];
            const embedSrc = `https://vod.sooplive.co.kr/player/${videoId}/embed?showChat=false&autoPlay=true&mutePlay=true`;
            return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 375px; background: #000; margin: 15px auto 0 auto; border-radius: 8px;"><iframe src="${embedSrc}" frameborder="0" allowfullscreen="true" allow="clipboard-write; web-share;" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`;
        }

        // 4. 알려진 동영상 타입이 아님
        return null;
    }

    // [MODIFIED] linkClickHandler - Soop 스크립트 2.6 버전 로직 적용
    function linkClickHandler(event) {
        event.preventDefault();
        const url = event.currentTarget.href;

        if (askBeforeOpening) {
            const knownPreviewHtml = getPreviewHtml(url);

            const isGeneralLink = (knownPreviewHtml === null);
            const isPreviewEnabled = (knownPreviewHtml !== null) || (isGeneralLink && enableGeneralPreview);

            // [Style Change] Chzzk 고유 URL 색상(#67e097) 적용
            let initialHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;

            if (knownPreviewHtml !== null) {
                // A) Known video type
                initialHtml += knownPreviewHtml;
            } else if (isGeneralLink && enableGeneralPreview) {
                // B) General link, preview on
                initialHtml += `<div id="swal-preview-loader" style="margin-top:15px; min-height: 50px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                                    <div class="swal2-loader" style="display: block; width: 2.5em; height: 2.5em;"></div>
                                    <div style="margin-top: 10px;">미리보기 로드 중...</div>
                                </div>`;
            }

            Swal.fire({
                title: '링크를 여시겠습니까?',
                html: initialHtml,
                icon: 'question',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'URL 열기',
                denyButtonText: 'URL 복사',
                cancelButtonText: '취소',
                customClass: { popup: 'swal2-dark', title: 'swal2-title-dark', htmlContainer: 'swal2-html-container-dark' },

                didOpen: () => {
                    if (isGeneralLink && enableGeneralPreview) {

                        const encodedUrl = encodeURIComponent(url);
                        const imageUrl = `https://v1.opengraph.11ty.dev/${encodedUrl}/small/auto/onerror/`;

                        const img = new Image();
                        img.src = imageUrl;

                        const timeoutId = setTimeout(() => {
                            img.onload = null;
                            img.onerror = null;
                            console.warn('Preview JS Image timed out for:', url);
                            // [Style Change] Chzzk 고유 URL 색상(#67e097) 적용
                            const finalHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
                            Swal.update({ html: finalHtml });
                        }, 8000);

                        img.onload = () => {
                            clearTimeout(timeoutId);
                            if (img.naturalWidth > 1) {
                                const previewHtml = `
                                    <img src="${imageUrl}"
                                         style="width: 100%; max-width: 375px; height: 200px; object-fit: contain; display: block; margin: 15px auto 0 auto; border-radius: 8px;"
                                         alt="OpenGraph Preview">
                                `;
                                // [Style Change] Chzzk 고유 URL 색상(#67e097) 적용
                                const finalHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>${previewHtml}`;
                                Swal.update({ html: finalHtml });
                            } else {
                                const finalHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
                                Swal.update({ html: finalHtml });
                            }
                        };

                        img.onerror = () => {
                            clearTimeout(timeoutId);
                            const finalHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
                            Swal.update({ html: finalHtml });
                        };
                    }
                } // end didOpen
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUrl(url);
                } else if (result.isDenied) {
                    GM_setClipboard(url);
                    // [Style Change] '복사 완료' 팝업에도 dark 클래스 추가
                    Swal.fire({ icon: 'success', title: '복사 완료', text: '클립보드에 URL이 복사되었습니다.', toast: true, position: 'center', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-dark' } });
                }
            });

        } else {
            handleUrl(url);
        }
    }

    // [MODIFIED] updateToggleState - 일반 링크 토글 상태 업데이트 추가
    function updateToggleState() {
        const popupContainer = document.querySelector('[class*="layer_container__"]');
        if (!popupContainer) return;

        const askToggleButton = popupContainer.querySelector('.ask-setting-toggle');
        if (askToggleButton) {
            const valueSpan = askToggleButton.querySelector('[class*="layer_value__"] strong');
            if (valueSpan) valueSpan.textContent = askBeforeOpening ? '사용' : '사용 안 함';
        }

        const youtubeToggleButton = popupContainer.querySelector('.youtube-preview-toggle');
        if (youtubeToggleButton) {
            const valueSpan = youtubeToggleButton.querySelector('[class*="layer_value__"] strong');
            if (valueSpan) valueSpan.textContent = enableYoutubePreview ? '사용' : '사용 안 함';
        }

        // (추가) 일반 링크 토글
        const generalToggleButton = popupContainer.querySelector('.general-preview-toggle');
        if (generalToggleButton) {
            const valueSpan = generalToggleButton.querySelector('[class*="layer_value__"] strong');
            if (valueSpan) valueSpan.textContent = enableGeneralPreview ? '사용' : '사용 안 함';
        }
    }

    // [MODIFIED] addSettingsToggles - 일반 링크 토글 생성 추가
    function addSettingsToggles(popup) {
        // Check if the popup has the '클린봇' button
        let hasCleanBot = false;
        const contentSpans = popup.querySelectorAll('.layer_contents__QF5mn > span:not([class])');
        for (let span of contentSpans) {
            if (span.textContent.trim() === '클린봇') {
                hasCleanBot = true;
                break;
            }
        }
        if (!hasCleanBot) return;

        const parentElement = popup.querySelector('.layer_wrapper__EFbUG')?.parentElement || popup;

        // 1. 링크 열기 전 확인
        if (!popup.querySelector('.ask-setting-toggle')) {
            const askWrapper = document.createElement('div');
            askWrapper.className = 'layer_wrapper__EFbUG';
            const askToggleButton = document.createElement('button');
            askToggleButton.type = 'button';
            askToggleButton.className = 'layer_button__fFPB8 ask-setting-toggle';
            askToggleButton.innerHTML = `
                <span class="layer_contents__QF5mn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3C10.5523 3 11 3.44772 11 4V9C11 9.55228 10.5523 10 10 10C9.44772 10 9 9.55228 9 9V4C9 3.44772 9.44772 3 10 3ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z" fill="currentColor"></path></svg>
                    <span>링크 열기 전 확인</span>
                </span>
                <span class="layer_value__obnkx">
                    <strong style="color: #67e097;">${askBeforeOpening ? '사용' : '사용 안 함'}</strong>
                </span>`;
            askWrapper.appendChild(askToggleButton);
            askToggleButton.addEventListener('click', () => setAskBeforeOpening(!askBeforeOpening));
            parentElement.appendChild(askWrapper);
        }

        // 2. 동영상 미리보기 (유튜브, 치지직 클립, 숲 VOD)
        if (!popup.querySelector('.youtube-preview-toggle')) {
            const youtubeWrapper = document.createElement('div');
            youtubeWrapper.className = 'layer_wrapper__EFbUG';
            const youtubeToggleButton = document.createElement('button');
            youtubeToggleButton.type = 'button';
            youtubeToggleButton.className = 'layer_button__fFPB8 youtube-preview-toggle';
            // [Style Change] "유튜브 미리보기" -> "동영상 미리보기"
            youtubeToggleButton.innerHTML = `
                <span class="layer_contents__QF5mn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17.5 7.021C17.5 7.021 16.903 4.5 14.28 4.5C12.433 4.5 10 4.5 10 4.5C10 4.5 7.567 4.5 5.72 4.5C3.097 4.5 2.5 7.021 2.5 7.021C2.5 7.021 2.5 8.784 2.5 10.5C2.5 12.216 2.5 13.979 2.5 13.979C2.5 13.979 3.097 16.5 5.72 16.5C7.567 16.5 10 16.5 10 16.5C10 16.5 12.433 16.5 14.28 16.5C16.903 16.5 17.5 13.979 17.5 13.979C17.5 13.979 17.5 12.216 17.5 10.5C17.5 8.784 17.5 7.021 17.5 7.021ZM8 12.001V9C8 8.44772 8.44772 8 9 8C9.28827 8 9.56543 8.12563 9.76189 8.35123L12.7619 10.8512C13.1408 11.1685 13.1408 11.8315 12.7619 12.1488L9.76189 14.6488C9.56543 14.8744 9.28827 15 9 15C8.44772 15 8 14.5523 8 14V12.001Z" fill="currentColor"></path></svg>
                    <span>동영상 미리보기</span>
                </span>
                <span class="layer_value__obnkx">
                    <strong style="color: #67e097;">${enableYoutubePreview ? '사용' : '사용 안 함'}</strong>
                </span>`;
            youtubeWrapper.appendChild(youtubeToggleButton);
            youtubeToggleButton.addEventListener('click', () => setEnableYoutubePreview(!enableYoutubePreview));
            parentElement.appendChild(youtubeWrapper);
        }

        // 3. (추가) 일반 링크 미리보기
        if (!popup.querySelector('.general-preview-toggle')) {
            const generalWrapper = document.createElement('div');
            generalWrapper.className = 'layer_wrapper__EFbUG';
            const generalToggleButton = document.createElement('button');
            generalToggleButton.type = 'button';
            generalToggleButton.className = 'layer_button__fFPB8 general-preview-toggle';
            generalToggleButton.innerHTML = `
                <span class="layer_contents__QF5mn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 17C2.67157 17 2 16.3284 2 15.5V4.5C2 3.67157 2.67157 3 3.5 3H16.5C17.3284 3 18 3.67157 18 4.5V15.5C18 16.3284 17.3284 17 16.5 17H3.5ZM16.5 4.5H3.5V15.5H16.5V4.5Z" fill="currentColor"></path><path d="M5 14C5 13.4477 5.44772 13 6 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H6C5.44772 15 5 14.5523 5 14Z" fill="currentColor"></path><path d="M5 11C5 10.4477 5.44772 10 6 10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H6C5.44772 12 5 11.5523 5 11Z" fill="currentColor"></path><path d="M7 8C7 7.44772 7.44772 7 8 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H8C7.44772 9 7 8.55228 7 8Z" fill="currentColor"></path><path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8Z" fill="currentColor"></path></svg>
                    <span>일반 링크 미리보기</span>
                </span>
                <span class="layer_value__obnkx">
                    <strong style="color: #67e097;">${enableGeneralPreview ? '사용' : '사용 안 함'}</strong>
                </span>`;
            generalWrapper.appendChild(generalToggleButton);
            generalToggleButton.addEventListener('click', () => setEnableGeneralPreview(!enableGeneralPreview));
            parentElement.appendChild(generalWrapper);
        }
    }
    // ------------------- MutationObserver (DOM 변경 감지) -------------------
    const chatObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches('[class*="live_chatting_list_item__"]')) {
                    processElement(node);
                }
            }
        }
    });
    const settingsObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches('[class*="layer_container__"]')) {
                    addSettingsToggles(node);
                }
            }
        }
    });
    // ------------------- 초기화 -------------------
    async function initialize() {
        await loadSettings();
        const style = document.createElement('style');
        style.textContent = `.swal2-popup.swal2-dark { background-color: #2b2e35; color: #fff; } .swal2-title.swal2-title-dark { color: #fff; } .swal2-html-container.swal2-html-container-dark { color: #ccc; }`;
        document.head.appendChild(style);
        const mainObserver = new MutationObserver((mutations, obs) => {
            const chatListWrapper = document.querySelector('[class*="live_chatting_list_wrapper__"]');
            if (chatListWrapper) {
                document.querySelectorAll('[class*="live_chatting_list_item__"]').forEach(processElement);
                chatObserver.observe(chatListWrapper, { childList: true, subtree: true });
                settingsObserver.observe(document.body, { childList: true, subtree: true });
                obs.disconnect();
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    }
    initialize();
})();