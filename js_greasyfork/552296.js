// ==UserScript==
// @name         BCU 치지직 채팅창 확장
// @namespace    https://cafe.naver.com/kanetv
// @version      2.6
// @description  치지직 채팅창에 URL 링크 열기, 동영상/사이트 미리보기, 유저 검색 기능을 추가합니다.
// @author       돈통
// @match        https://chzzk.naver.com/live/*
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/552296/BCU%20%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%ED%99%95%EC%9E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/552296/BCU%20%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%ED%99%95%EC%9E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- 설정 키 및 변수 정의 ---
    const SETTING_KEY_METHOD = 'url_open_method';
    const SETTING_KEY_ASK = 'ask_before_opening';
    const SETTING_KEY_YOUTUBE_PREVIEW = 'enable_youtube_preview'; // (참고) '동영상 미리보기'의 키로 사용
    const SETTING_KEY_GENERAL_PREVIEW = 'enable_general_preview'; // [NEW]

    const METHOD_PYTHON = 'python';
    const METHOD_BROWSER = 'browser';
    let currentMethod = METHOD_PYTHON;
    let askBeforeOpening = true;
    let enableYoutubePreview = true;
    let enableGeneralPreview = true; // [NEW]

    // ------------------- 설정 및 저장 함수 -------------------
    async function loadSettings() {
        currentMethod = await GM.getValue(SETTING_KEY_METHOD, METHOD_PYTHON);
        askBeforeOpening = await GM.getValue(SETTING_KEY_ASK, true);
        enableYoutubePreview = await GM.getValue(SETTING_KEY_YOUTUBE_PREVIEW, true);
        enableGeneralPreview = await GM.getValue(SETTING_KEY_GENERAL_PREVIEW, true); // [NEW]
    }
    async function setSetting(key, value, messages) {
        await GM.setValue(key, value);
        let message;
        if (key === SETTING_KEY_METHOD) {
            message = (value === METHOD_BROWSER) ? messages.true : messages.false;
        } else {
            message = value ? messages.true : messages.false;
        }
        switch (key) {
            case SETTING_KEY_METHOD: currentMethod = value; break;
            case SETTING_KEY_ASK: askBeforeOpening = value; break;
            case SETTING_KEY_YOUTUBE_PREVIEW: enableYoutubePreview = value; break;
            case SETTING_KEY_GENERAL_PREVIEW: enableGeneralPreview = value; break; // [NEW]
        }
        updateToggleState();
    }
    // ------------------- BCU(Python) 통신 함수 -------------------
    function sendUrlToPython(url) {
        fetch('http://127.0.0.1:5000/open_url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .catch(error => {
            console.error('BCU Error:', error);
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: 'BCU로 URL 전송을 실패했습니다. BCU가 실행 중인지 확인 후 새로고침 해주세요.',
                customClass: { popup: 'swal2-dark' } // [Style]
            });
        });
    }
    function sendSearchToPython(type, username) {
        fetch('http://127.0.0.1:5000/usersearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: type, nickname: username })
        })
        .catch(error => {
            console.error('BCU Error:', error);
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '유저 검색 요청을 실패했습니다. BCU가 실행 중인지 확인 후 새로고침 해주세요.',
                customClass: { popup: 'swal2-dark' } // [Style]
            });
        });
    }
    // ------------------- DOM 처리 및 UI 추가 로직 -------------------
    function handleUrl(url) {
        if (currentMethod === METHOD_BROWSER) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            sendUrlToPython(url);
        }
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

    // [MODIFIED] linkClickHandler - Soop 스크립트 2.6 로직 + BCU didOpen 로직 병합
    function linkClickHandler(event) {
        event.preventDefault();
        const url = event.currentTarget.href;

        if (askBeforeOpening) {
            const knownPreviewHtml = getPreviewHtml(url);

            const isGeneralLink = (knownPreviewHtml === null);
            const isPreviewEnabled = (knownPreviewHtml !== null) || (isGeneralLink && enableGeneralPreview);

            // [Style] Chzzk 고유 URL 색상(#67e097) + [NEW] div#swal-preview-container
            let initialHtml = `<strong style="color:#67e097;">URL:</strong> <a href="${url}" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>
                               <div id="swal-preview-container">`; // [NEW] 컨테이너

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
            initialHtml += `</div>`; // [/NEW] 컨테이너 닫기

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

                // [MODIFIED] BCU 로직 + SOOP 로직 병합
                didOpen: (popup) => {
                    // 1. (BCU 로직) 팝업 내의 URL을 클릭 가능하게 (가장 중요)
                    const linkInPopup = popup.querySelector('a');
                    if (linkInPopup) {
                        linkInPopup.addEventListener('click', (e) => {
                            e.preventDefault();
                            handleUrl(url); // BCU/브라우저 방식 적용
                            Swal.close();
                        });
                    }

                    // 2. (SOOP 로직) 일반 링크일 경우, 미리보기 로드
                    const previewContainer = document.getElementById('swal-preview-container');
                    if (isGeneralLink && enableGeneralPreview && previewContainer) {

                        const encodedUrl = encodeURIComponent(url);
                        const imageUrl = `https://v1.opengraph.11ty.dev/${encodedUrl}/small/auto/onerror/`;

                        const img = new Image();
                        img.src = imageUrl;

                        const timeoutId = setTimeout(() => {
                            img.onload = null;
                            img.onerror = null;
                            console.warn('Preview JS Image timed out for:', url);
                            previewContainer.innerHTML = ''; // 타임아웃 시 로더 제거
                        }, 8000);

                        img.onload = () => {
                            clearTimeout(timeoutId);
                            if (img.naturalWidth > 1) {
                                previewContainer.innerHTML = `
                                    <img src="${imageUrl}"
                                         style="width: 100%; max-width: 375px; height: 200px; object-fit: contain; display: block; margin: 15px auto 0 auto; border-radius: 8px;"
                                         alt="OpenGraph Preview">
                                `;
                            } else {
                                previewContainer.innerHTML = ''; // 이미지 없음
                            }
                        };

                        img.onerror = () => {
                            clearTimeout(timeoutId);
                            previewContainer.innerHTML = ''; // 로드 실패
                        };
                    }
                } // end didOpen

            }).then((result) => {
                if (result.isConfirmed) {
                    handleUrl(url); // BCU/브라우저 방식 적용
                } else if (result.isDenied) {
                    GM_setClipboard(url);
                    // [Style] dark 클래스 추가
                    Swal.fire({ icon: 'success', title: '복사 완료', text: '클립보드에 URL이 복사되었습니다.', toast: true, position: 'center', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-dark' } });
                }
            });

        } else {
            handleUrl(url);
        }
    }

    // [MODIFIED] updateToggleState - 일반 링크 토글 업데이트 추가
    function updateToggleState() {
        const popupContainer = document.querySelector('[class*="layer_container__"]');
        if (!popupContainer) return;
        const updateText = (selector, text) => {
            const element = popupContainer.querySelector(selector);
            if (element) element.textContent = text;
        };
        updateText('.url-setting-toggle strong', currentMethod === METHOD_PYTHON ? '기본 브라우저' : '채팅창 동일 브라우저');
        updateText('.ask-setting-toggle strong', askBeforeOpening ? '사용' : '사용 안 함');
        updateText('.youtube-preview-toggle strong', enableYoutubePreview ? '사용' : '사용 안 함');
        updateText('.general-preview-toggle strong', enableGeneralPreview ? '사용' : '사용 안 함'); // [NEW]
    }

    // [MODIFIED] addSettingsToggles - 일반 링크 토글 추가
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

        const parentElement = popup.querySelector('[class*="layer_wrapper__"]')?.parentElement || popup;
        const createToggle = (className, svg, text, initialValue, clickHandler) => {
            if (popup.querySelector(`.${className}`)) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'layer_wrapper__EFbUG';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `layer_button__fFPB8 ${className}`;
            button.innerHTML = `
                <span class="layer_contents__QF5mn">${svg}<span>${text}</span></span>
                <span class="layer_value__obnkx"><strong style="color: #67e097;">${initialValue}</strong></span>`;
            button.addEventListener('click', clickHandler);
            wrapper.appendChild(button);
            parentElement.appendChild(wrapper);
        };
        const methodSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm-1 11.5a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 1 0v4Zm2 0a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 1 0v4Z"/><path fill="currentColor" fill-rule="evenodd" d="M10 4.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" clip-rule="evenodd"/></svg>`;
        const askSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3C10.5523 3 11 3.44772 11 4V9C11 9.55228 10.5523 10 10 10C9.44772 10 9 9.55228 9 9V4C9 3.44772 9.44772 3 10 3ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z" fill="currentColor"></path></svg>`;
        const youtubeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17.5 7.021C17.5 7.021 16.903 4.5 14.28 4.5C12.433 4.5 10 4.5 10 4.5C10 4.5 7.567 4.5 5.72 4.5C3.097 4.5 2.5 7.021 2.5 7.021C2.5 7.021 2.5 8.784 2.5 10.5C2.5 12.216 2.5 13.979 2.5 13.979C2.5 13.979 3.097 16.5 5.72 16.5C7.567 16.5 10 16.5 10 16.5C10 16.5 12.433 16.5 14.28 16.5C16.903 16.5 17.5 13.979 17.5 13.979C17.5 13.979 17.5 12.216 17.5 10.5C17.5 8.784 17.5 7.021 17.5 7.021ZM8 12.001V9C8 8.44772 8.44772 8 9 8C9.28827 8 9.56543 8.12563 9.76189 8.35123L12.7619 10.8512C13.1408 11.1685 13.1408 11.8315 12.7619 12.1488L9.76189 14.6488C9.56543 14.8744 9.28827 15 9 15C8.44772 15 8 14.5523 8 14V12.001Z" fill="currentColor"></path></svg>`;
        const generalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 17C2.67157 17 2 16.3284 2 15.5V4.5C2 3.67157 2.67157 3 3.5 3H16.5C17.3284 3 18 3.67157 18 4.5V15.5C18 16.3284 17.3284 17 16.5 17H3.5ZM16.5 4.5H3.5V15.5H16.5V4.5Z" fill="currentColor"></path><path d="M5 14C5 13.4477 5.44772 13 6 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H6C5.44772 15 5 14.5523 5 14Z" fill="currentColor"></path><path d="M5 11C5 10.4477 5.44772 10 6 10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H6C5.44772 12 5 11.5523 5 11Z" fill="currentColor"></path><path d="M7 8C7 7.44772 7.44772 7 8 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H8C7.44772 9 7 8.55228 7 8Z" fill="currentColor"></path><path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8Z" fill="currentColor"></path></svg>`; // [NEW]

        createToggle('url-setting-toggle', methodSvg, '링크 열기 방식', (currentMethod === METHOD_PYTHON ? '기본 브라우저' : '채팅창 동일 브라우저'), () => setSetting(SETTING_KEY_METHOD, currentMethod === METHOD_PYTHON ? METHOD_BROWSER : METHOD_PYTHON, { true: '✅ 채팅창 동일 브라우저로 열도록 변경되었습니다.', false: '✅ 기본 브라우저로 열도록 변경되었습니다.' }));
        createToggle('ask-setting-toggle', askSvg, '링크 열기 전 확인', (askBeforeOpening ? '사용' : '사용 안 함'), () => setSetting(SETTING_KEY_ASK, !askBeforeOpening, { true: '✅ 링크 클릭 시 확인 창이 표시됩니다.', false: '✅ 링크 클릭 시 바로 열립니다.' }));
        createToggle('youtube-preview-toggle', youtubeSvg, '동영상 미리보기', (enableYoutubePreview ? '사용' : '사용 안 함'), () => setSetting(SETTING_KEY_YOUTUBE_PREVIEW, !enableYoutubePreview, { true: '✅ 동영상 미리보기가 활성화됩니다.', false: '✅ 동영상 미리보기가 비활성화됩니다.' })); // [Text Change]
        createToggle('general-preview-toggle', generalSvg, '일반 링크 미리보기', (enableGeneralPreview ? '사용' : '사용 안 함'), () => setSetting(SETTING_KEY_GENERAL_PREVIEW, !enableGeneralPreview, { true: '✅ 일반 링크 미리보기가 활성화됩니다.', false: '✅ 일반 링크 미리보기가 비활성화됩니다.' })); // [NEW]
    }
    function addUserSearchButtons(profilePopup) {
        const profileList = profilePopup.querySelector('[class*="live_chatting_popup_profile_list__"]');
        if (!profileList || profileList.querySelector('.bcu-search-button')) return;
        const createButton = (text, clickHandler) => {
            const button = document.createElement('button');
            button.className = 'live_chatting_popup_profile_item__tOguB bcu-search-button';
            button.textContent = text;
            button.addEventListener('click', clickHandler);
            return button;
        };
        const nicknameElement = profilePopup.querySelector('[class*="live_chatting_popup_profile_name__"] [class*="name_text__"]');
        if (!nicknameElement) return;
        const nickname = nicknameElement.textContent;
        const searchButton = createButton('채팅 부검', () => sendSearchToPython(0, nickname));
        const moaButton = createButton('채팅 모아보기', () => sendSearchToPython(1, nickname));
        profileList.prepend(moaButton);
        profileList.prepend(searchButton);
    }
    // ------------------- MutationObserver (DOM 변경 감지) -------------------
    async function initialize() {
        await loadSettings();
        const style = document.createElement('style');
        style.textContent = `.swal2-popup.swal2-dark{background-color:#2b2e35;color:#fff}.swal2-title.swal2-title-dark{color:#fff}.swal2-html-container.swal2-html-container-dark{color:#ccc}`;
        document.head.appendChild(style);
        const mainObserver = new MutationObserver((mutations, obs) => {
            const chatListWrapper = document.querySelector('[class*="live_chatting_list_wrapper__"]');
            if (chatListWrapper) {
                document.querySelectorAll('[class*="live_chatting_list_item__"]').forEach(processElement);
                const dynamicObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType !== 1) continue;
                                if (node.matches('[class*="live_chatting_list_item__"]')) {
                                    processElement(node);
                                }
                                if (node.matches('[class*="layer_container__"]') && !node.matches('[class*="profile_layer_container__"]')) {
                                    addSettingsToggles(node);
                                }
                                const profilePopup = node.querySelector('[class*="popup_contents__"]');
                                if (profilePopup) {
                                    addUserSearchButtons(profilePopup);
                                }
                            }
                        } else if (mutation.type === 'attributes') {
                            if (mutation.target.matches('[class*="popup_container__"]')) {
                                const profilePopup = mutation.target.querySelector('[class*="popup_contents__"]');
                                if (profilePopup) {
                                    addUserSearchButtons(profilePopup);
                                }
                            }
                        }
                    }
                });
                dynamicObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
                obs.disconnect();
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    }
    initialize();
})();