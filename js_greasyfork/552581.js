// ==UserScript==
// @name         SOOP (숲) 채팅창 URL 링크 클릭 가능하게 하기
// @namespace    https://sooplive.co.kr/
// @version      2.1
// @description  SOOP(숲) 채팅창의 URL을 클릭 가능하게 만들어줍니다.
// @author       돈통
// @match        *://play.sooplive.co.kr/*
// @match        *://dashboard.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552581/SOOP%20%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%EC%B0%BD%20URL%20%EB%A7%81%ED%81%AC%20%ED%81%B4%EB%A6%AD%20%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552581/SOOP%20%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%EC%B0%BD%20URL%20%EB%A7%81%ED%81%AC%20%ED%81%B4%EB%A6%AD%20%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 설정 키와 변수
    const SETTING_KEY_ASK = 'soop_ask_before_opening';
    const SETTING_KEY_YOUTUBE_PREVIEW = 'soop_enable_youtube_preview'; // (참고) 치지직, 숲 VOD도 이 설정을 따름
    const SETTING_KEY_GENERAL_PREVIEW = 'soop_enable_general_preview';
    let askBeforeOpening = true;
    let enableYoutubePreview = true;
    let enableGeneralPreview = true;

    const isPlay = location.hostname === 'play.sooplive.co.kr';
    const isDashboard = location.hostname === 'dashboard.sooplive.co.kr';
    // ------------------- 설정 및 저장 함수 -------------------
    async function loadSettings() {
        askBeforeOpening = await GM.getValue(SETTING_KEY_ASK, true);
        enableYoutubePreview = await GM.getValue(SETTING_KEY_YOUTUBE_PREVIEW, true);
        enableGeneralPreview = await GM.getValue(SETTING_KEY_GENERAL_PREVIEW, true);
    }
    async function setAskBeforeOpening(value) {
        await GM.setValue(SETTING_KEY_ASK, value);
        askBeforeOpening = value;
        updateToggleState();
    }
    async function setEnableYoutubePreview(value) {
        await GM.setValue(SETTING_KEY_YOUTUBE_PREVIEW, value);
        enableYoutubePreview = value;
        updateToggleState();
    }
    async function setEnableGeneralPreview(value) {
        await GM.setValue(SETTING_KEY_GENERAL_PREVIEW, value);
        enableGeneralPreview = value;
        updateToggleState();
    }
    // ------------------- DOM 처리 및 UI 추가 로직 -------------------
    function handleUrl(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    function processElement(element) {
        const messageElement = element.querySelector('.message-text .msg');
        if (!messageElement || messageElement.querySelector('a')) return;

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let textToProcess = messageElement.textContent;

        if (urlRegex.test(textToProcess)) {
            if (textToProcess.endsWith('번역')) {
                textToProcess = textToProcess.slice(0, -2);
            }
            const newHtml = textToProcess.replace(urlRegex, (url) => {
                let cleanUrl = url;
                if (cleanUrl.endsWith('번역')) {
                    cleanUrl = cleanUrl.slice(0, -2);
                }
                return `<a href="${cleanUrl}" target="_blank" style="color: #6a95e2; text-decoration: underline;">${cleanUrl}</a>`;
            });

            messageElement.innerHTML = newHtml;
            messageElement.querySelectorAll('a').forEach(link => link.addEventListener('click', linkClickHandler));
        }
    }

    // [MODIFIED] Chzzk 로직 수정 (clip/clips 둘 다 인식)
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
        // [MODIFIED] /clips/ (복수) 와 /clip/ (단수) 모두 인식
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
            const embedSrc = `https://vod.sooplive.co.kr/player/${videoId}/embed?showChat=false&autoPlay=true&mutePlay=true`; // 자동/음소거 재생
            return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 375px; background: #000; margin: 15px auto 0 auto; border-radius: 8px;"><iframe src="${embedSrc}" frameborder="0" allowfullscreen="true" allow="clipboard-write; web-share;" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`;
        }

        // 4. 알려진 동영상 타입이 아님
        return null;
    }

    function linkClickHandler(event) {
        event.preventDefault();
        const url = event.currentTarget.href;

        if (askBeforeOpening) {
            const knownPreviewHtml = getPreviewHtml(url);

            const isGeneralLink = (knownPreviewHtml === null);
            const isPreviewEnabled = (knownPreviewHtml !== null) || (isGeneralLink && enableGeneralPreview);

            let initialHtml = `<strong style="color:#82c8ff;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;

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
                customClass: { popup: 'swal2-dark', title: 'sw-title-dark', htmlContainer: 'swal2-html-container-dark' },

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
                            const finalHtml = `<strong style="color:#82c8ff;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
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
                                const finalHtml = `<strong style="color:#82c8ff;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>${previewHtml}`;
                                Swal.update({ html: finalHtml });
                            } else {
                                const finalHtml = `<strong style="color:#82c8ff;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
                                Swal.update({ html: finalHtml });
                            }
                        };

                        img.onerror = () => {
                            clearTimeout(timeoutId);
                            const finalHtml = `<strong style="color:#82c8ff;">URL:</strong> <a href="${url}" target="_blank" style="color: #fff; text-decoration: underline; word-break: break-all;">${url}</a>`;
                            Swal.update({ html: finalHtml });
                        };
                    }
                } // end didOpen
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUrl(url);
                } else if (result.isDenied) {
                    GM_setClipboard(url);
                    Swal.fire({ icon: 'success', title: '복사 완료', text: '클립보드에 URL이 복사되었습니다.', toast: true, position: 'center', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-dark' } });
                }
            });

        } else {
            handleUrl(url);
        }
    }


    function updateToggleState() {
        if (isPlay) {
            const settingsPanel = document.querySelector('.chat_layer.setting_chat');
            if (!settingsPanel) return;
            const askToggleStrong = settingsPanel.querySelector('.ask-setting-toggle strong');
            if (askToggleStrong) askToggleStrong.textContent = askBeforeOpening ? '사용' : '사용 안 함';

            const youtubeToggleStrong = settingsPanel.querySelector('.youtube-preview-toggle strong');
            if (youtubeToggleStrong) youtubeToggleStrong.textContent = enableYoutubePreview ? '사용' : '사용 안 함';
            const generalToggleStrong = settingsPanel.querySelector('.general-preview-toggle strong');
            if (generalToggleStrong) generalToggleStrong.textContent = enableGeneralPreview ? '사용' : '사용 안 함';

        } else if (isDashboard) {
            const askInput = document.querySelector('#_AskBeforeOpeningToggle');
            if (askInput) askInput.checked = askBeforeOpening;

            const youtubeInput = document.querySelector('#_YoutubePreviewToggle');
            if (youtubeInput) youtubeInput.checked = enableYoutubePreview;
            const generalInput = document.querySelector('#_GeneralPreviewToggle');
            if (generalInput) generalInput.checked = enableGeneralPreview;
        }
    }
    // 설정 메뉴 추가 함수
    function addSettings() {
        if (isPlay) {
            const settingsPanel = document.querySelector('.chat_layer.setting_chat');
            if (!settingsPanel || settingsPanel.querySelector('.ask-setting-toggle')) return;
            const targetUl = settingsPanel.querySelector('.contents ul:nth-of-type(2)');
            if (!targetUl) return;
            const createPlayToggle = (text, className, initialValue, action) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = 'javascript:;';
                a.className = className;
                a.style.display = 'flex';
                a.style.justifyContent = 'space-between';
                a.innerHTML = `<span>${text}</span><strong style="color: #82c8ff;">${initialValue ? '사용' : '사용 안 함'}</strong>`;
                a.addEventListener('click', function() {
                    const strong = this.querySelector('strong');
                    const current = strong.textContent === '사용';
                    action(!current);
                });
                li.appendChild(a);
                targetUl.appendChild(li);
            };
            createPlayToggle('링크 열기 전 확인', 'ask-setting-toggle', askBeforeOpening, setAskBeforeOpening);

            createPlayToggle('동영상 미리보기', 'youtube-preview-toggle', enableYoutubePreview, setEnableYoutubePreview);
            createPlayToggle('일반 링크 미리보기', 'general-preview-toggle', enableGeneralPreview, setEnableGeneralPreview);

        } else if (isDashboard) {
            const targetUl = document.querySelector('#ChatThreeDotLayer .select_list');
            if (!targetUl || targetUl.querySelector('#_AskBeforeOpeningToggle')) return;
            const createDashboardToggle = (id, text, initialValue, action) => {
                const li = document.createElement('li');
                li.className = 'sc-setting-row';
                const label = document.createElement('label');
                label.className = 'sc-setting-label';
                label.htmlFor = id;
                label.textContent = text;
                const switchWrapper = document.createElement('label');
                switchWrapper.className = 'sc-switch';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;
                input.checked = initialValue;
                input.addEventListener('change', () => action(input.checked));
                const slider = document.createElement('span');
                slider.className = 'sc-slider';
                switchWrapper.appendChild(input);
                switchWrapper.appendChild(slider);
                li.appendChild(label);
                li.appendChild(switchWrapper);
                targetUl.appendChild(li);
            };
            createDashboardToggle('_AskBeforeOpeningToggle', '링크 열기 전 확인', askBeforeOpening, setAskBeforeOpening);

            createDashboardToggle('_YoutubePreviewToggle', '동영상 미리보기', enableYoutubePreview, setEnableYoutubePreview);
            createDashboardToggle('_GeneralPreviewToggle', '일반 링크 미리보기', enableGeneralPreview, setEnableGeneralPreview);
        }
        updateToggleState();
    }
    // '어두운 모드' 상태에 따라 스크립트 버튼의 테마를 동기화하는 함수
    function syncThemeWithDarkMode() {
        const listItems = document.querySelectorAll('#ChatThreeDotLayer .select_list li');
        let darkModeInput = null;
        listItems.forEach(li => {
            if (li.querySelector('label')?.textContent.includes('어두운 모드')) {
                darkModeInput = li.querySelector('input[type="checkbox"]');
            }
        });
        if (darkModeInput) {
            const applyTheme = () => {
                if (darkModeInput.checked) {
                    document.body.classList.add('sc-dark-theme-active');
                } else {
                    document.body.classList.remove('sc-dark-theme-active');
                }
            };
            applyTheme(); // 최초 실행 시 테마 적용
            if (!darkModeInput.hasAttribute('data-theme-listener-added')) {
                darkModeInput.addEventListener('change', applyTheme);
                darkModeInput.setAttribute('data-theme-listener-added', 'true');
            }
        }
    }
    // ------------------- 초기화 -------------------
    async function initialize() {
        await loadSettings();
        const style = document.createElement('style');
        style.textContent = `
            .swal2-popup.swal2-dark { background-color: #2b2b2b; color: #fff; }
            .swal2-title.swal2-title-dark { color: #fff; }
            .swal2-html-container.swal2-html-container-dark { color: #ccc; }
            /* --- 대시보드 토글 스위치 스타일 --- */
            .sc-setting-row {
                display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; list-style: none;
            }
            .sc-setting-label {
                font-size: 13px; cursor: pointer; color: #5580f5;
            }
            .sc-switch {
                position: relative; display: inline-block; width: 30px; height: 16px; flex-shrink: 0;
            }
            .sc-switch input { opacity: 0; width: 0; height: 0; }
            .sc-slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #e2e4e9; /* 라이트 모드 '꺼짐' 색상 */
                transition: background-color .3s; border-radius: 16px;
            }
            .sc-slider:before {
                position: absolute; content: ""; height: 12px; width: 12px; left: 2px; bottom: 2px;
                background-color: white; transition: transform .3s; border-radius: 50%;
            }
            .sc-switch input:checked + .sc-slider {
                background-color: #0182ff !important; /* ✅ !important 추가로 최우선 적용 */
            }
            input:checked + .sc-slider:before {
                transform: translateX(14px);
            }
            /* --- '어두운 모드' 활성화 시 덮어쓰는 스타일 --- */
            body.sc-dark-theme-active .sc-setting-label {
                color: #c8cacf;
            }
            body.sc-dark-theme-active .sc-slider {
                background-color: #3b3d45; /* '꺼짐' 상태의 색상만 변경 */
            }
        `;
        document.head.appendChild(style);
        const chatObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches('.chatting-list-item')) {
                        processElement(node);
                    }
                }
            }
        });
        const settingsObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (isPlay) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.matches('.chat_layer.setting_chat')) {
                            setTimeout(addSettings, 100);
                        }
                    }
                } else if (isDashboard) {
                    if ( (mutation.type === 'childList' && Array.from(mutation.addedNodes).some(n => n.nodeType === 1 && n.matches('#ChatThreeDotLayer'))) ||
                         (mutation.type === 'attributes' && mutation.target.id === 'ChatThreeDotLayer' && mutation.target.classList.contains('on')) )
                    {
                        setTimeout(addSettings, 100);
                        setTimeout(syncThemeWithDarkMode, 110);
                    }
                }
            }
        });
        settingsObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        const mainObserver = new MutationObserver((mutations, obs) => {
            const chatListContainer = document.querySelector('#chat_area');
            if (chatListContainer) {
                document.querySelectorAll('.chatting-list-item').forEach(processElement);
                chatObserver.observe(chatListContainer, { childList: true });
                obs.disconnect();
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
        const initialChatContainer = document.querySelector('#chat_area');
        if (initialChatContainer) {
            document.querySelectorAll('.chatting-list-item').forEach(processElement);
            chatObserver.observe(initialChatContainer, { childList: true });
        }
        if (isPlay && document.querySelector('.chat_layer.setting_chat')) addSettings();
        if (isDashboard && document.querySelector('#ChatThreeDotLayer.on')) {
            addSettings();
            syncThemeWithDarkMode();
        }
    }
    initialize();
})();