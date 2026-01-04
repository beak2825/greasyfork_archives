// ==UserScript==
// @name         SOOP 클립 및 라이브 깔끔하게 캡쳐 Beta
// @name:ko-KR   SOOP 클립 및 라이브 깔끔하게 캡쳐
// @name:en-US   SOOP Live & Clip Clean Capture Helper
// @name:ja-JP   SOOP 切り抜き＆生配信 すっきりスクショ
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @license      MIT
// @description       Adds a controller visibility toggle button and capture button to hide the player controller section when taking screenshots in the SOOP Live and SOOP Clip windows.
// @description:ko-KR SOOP 라이브 및 클립 창에서 화면 캡쳐시 플레이어 컨트롤러 부분을 보이지 않게 할 수 있도록 컨트롤러 비활성화/캡쳐 버튼을 추가합니다.
// @description:ja-JP SOOPのライブやクリップ画面で、プレイヤーコントロールを非表示にするボタンとキャプチャボタンを追加します。
// @author       Linseed, Gemini
// @match        https://stbbs.sooplive.co.kr/*
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/*
// @exclude      https://mul.live/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://github.com/PRO-2684/GM_config/releases/download/v1.2.2/config.js#md5=fca1967de605996e44d14d2eab403706
// @downloadURL https://update.greasyfork.org/scripts/551576/SOOP%20%ED%81%B4%EB%A6%BD%20%EB%B0%8F%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%94%EB%81%94%ED%95%98%EA%B2%8C%20%EC%BA%A1%EC%B3%90%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/551576/SOOP%20%ED%81%B4%EB%A6%BD%20%EB%B0%8F%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%94%EB%81%94%ED%95%98%EA%B2%8C%20%EC%BA%A1%EC%B3%90%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const configDesc = {
        "$default": {
            autoClose: false
        },
        saveMethod: {
            name: "Save as",
            title: "저장 방식을 설정합니다.",
            type: "enum",
            options: ["Clipboard", "File", "Both"],
        },
        shownUIs:{
            name: "Exclude UI from hiding",
            title: "잠금 상태에서 숨기지 않을 UI를 선택합니다.",
            type: "folder",
            items: {
                hideControl: {
                    name: "Controls (play, pause, etc)",
                    title: "플레이어 컨트롤러 (재생, 일시정지 등) UI입니다.",
                    type: "enum",
                    options: ["Hide all", "Hide only gradient", "Show all"],
                    default: 0
                },
                hidePlayerInfo: {
                    name: "Player info (profile pic, title, viewers)",
                    title: "스트리머 프로필, 방송 제목, 시청자 수 등 꽉찬 화면에서 영상을 가리는 UI입니다.",
                    type: "enum",
                    options: ["Hide all", "Hide only gradient", "Show all"],
                    default: 0
                },

                hideViewControl: {
                    name: "Chat button & Related videos",
                    title: "전체 / 꽉찬 화면 시 우상단에 표시되는 채팅창 열기 버튼 및 관련 영상 버튼 UI입니다.",
                    type: "enum",
                    options: ["Hide", "Show"],
                    default: 0
                },
                hideCatchUI: {
                    name: "Catch making UI",
                    title: "스트리머 프로필, 방송 제목, 시청자 수 등 꽉찬 화면에서 영상을 가리는 UI입니다.",
                    type: "enum",
                    options: ["Hide", "Show"],
                    default: 1
                }
            }
        }
    }
    const config = new GM_config(configDesc);

    // --- 스크립트 설정 ---
    const CHECK_INTERVAL = 500; // 플레이어 요소를 찾기 위한 반복 확인 간격 (ms)

    /**
     * 필요한 DOM 요소들이 로드될 때까지 기다립니다.
     */
    const waitForElements = setInterval(() => {
        const videoLayer = document.getElementById('videoLayer');
        const ctrlBox = document.querySelector('.player_ctrlBox');
        const titleElement = document.querySelector('.u_clip_title');
        const nicknameElement = document.querySelector('.nickname');
        const playerInfo = document.getElementById('player_info');
        const viewCtrl = document.querySelector('.view_ctrl');

        if (videoLayer && ctrlBox && (titleElement || nicknameElement)) {
            clearInterval(waitForElements);
            main(videoLayer, ctrlBox, titleElement, nicknameElement, playerInfo, viewCtrl);
        }
    }, CHECK_INTERVAL);

    /**
     * 스크립트의 메인 로직을 실행합니다.
     */
    function main(videoLayer, ctrlBox, titleElement, nicknameElement, playerInfo, viewCtrl) {
        // Define elements to be controlled by lock state
        const controlledElements = [
            { element: ctrlBox, type: 'control', configKey: 'shownUIs.hideControl' },
            { element: playerInfo, type: 'info', configKey: 'shownUIs.hidePlayerInfo' },
            { element: viewCtrl, type: 'control', configKey: 'shownUIs.hideViewControl' }
        ];

        let isLocked = false;

        // Insert containers containing lock and capture buttons.
        const container = document.createElement('div');
        container.id = 'soop-script-container';
        
        if (titleElement) {
            titleElement.after(container);
        } else if (nicknameElement) {
            nicknameElement.after(container);
        }

        // Create buttons inside the container.
        const lockButton = document.createElement('button');
        lockButton.id = 'lockBtn';
        lockButton.textContent = '🔓';
        lockButton.title = '컨트롤러 잠금/해제 (Alt + L)';
        container.appendChild(lockButton);

        const captureButton = document.createElement('button');
        captureButton.id = 'captureBtn';
        captureButton.textContent = '📷';
        captureButton.title = '현재 화면 캡쳐 (Alt + P)';
        container.appendChild(captureButton);

        GM_addStyle(`
            #soop-script-container { display: inline-flex; gap: 8px; margin-left: 10px; vertical-align: middle; }
            #soop-script-container button { padding: 4px 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 6px; background-color: rgba(240, 240, 240, 0.85); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease-in-out; line-height: 1; }
            #soop-script-container button:hover { background-color: rgba(255, 255, 255, 1); transform: translateY(-1px); }
            #player .player_ctrlBox.no-gradient { background: none !important; }
            #player_info.no-gradient { background: none !important; }
            #player .view_ctrl.no-gradient { background: none !important; }
        `);

        const setLockState = (locked) => {
            isLocked = locked;
            lockButton.textContent = isLocked ? '🔒' : '🔓';
            
            if (!isLocked) {
                // Show everything when unlocked
                controlledElements.forEach(({ element }) => {
                    element.style.display = '';
                    // Only try to remove class if it exists
                    element.classList.remove('no-gradient');
                });
                return;
            }

            // Update visibility based on configuration when locked
            controlledElements.forEach(({ element, configKey }) => {
                const setting = config.get(configKey);

                // Reset styles before applying new ones
                element.style.display = '';
                element.classList.remove('no-gradient');

                switch (setting) {
                    case 0: // Hide all
                        element.style.display = 'none';
                        break;
                    case 1: // Hide only background gradient
                        element.classList.add('no-gradient');
                        break;
                    case 2: // Show all
                        // Do nothing, already reset
                        break;
                }
            });
        };

        lockButton.addEventListener('click', () => setLockState(!isLocked));
        config.addEventListner("set", (e) => setLockState(isLocked))  // update UI when config changes

        captureButton.addEventListener('click', async () => {
            const originalLockState = isLocked;

                //if (!originalLockState) {
                //    setLockState(true);
                //    await new Promise(resolve => setTimeout(resolve, 100));
                //}

            try {
                const videoElement = videoLayer.querySelector('video');
                if (!videoElement) throw new Error('플레이어에서 <video> 요소를 찾을 수 없습니다.');

                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // --- 설정값에 따라 저장 방식 분기 ---
                const saveMethod = config.get('saveMethod');

                const saveToClipboard = (canvasEl) => {
                    return new Promise((resolve, reject) => {
                        canvasEl.toBlob(async (blob) => {
                            if (blob) {
                                try {
                                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                                    resolve();
                                } catch (err) {
                                    reject(err);
                                }
                            } else {
                                reject(new Error('Canvas toBlob returned null.'));
                            }
                        }, 'image/png');
                    });
                };

                const saveToFile = (canvasEl) => {
                    const link = document.createElement('a');
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
                    link.download = `soop-capture-${timestamp}.png`;
                    link.href = canvasEl.toDataURL('image/png');
                    link.click();
                };

                if (saveMethod == 0 || saveMethod == 2) {
                    try {
                        await saveToClipboard(canvas);
                    } catch(e) {
                        console.error('클립보드 저장 실패:', e);
                        alert('클립보드 저장에 실패했습니다. 브라우저 콘솔을 확인해주세요.');
                    }
                }
                if (saveMethod == 1 || saveMethod == 2) {
                    saveToFile(canvas);
                }

            } catch (error) {
                console.error('스크립트 캡쳐 오류:', error);
                alert('화면 캡쳐에 실패했습니다. 비디오가 다른 도메인에서 재생되는 경우(CORS) 캡쳐가 불가능할 수 있습니다. 브라우저 콘솔을 확인해주세요.');
            } finally {
                // Restore original UI state
                if (!originalLockState) {
                    setLockState(false);
                }
                // equivalent to: setLockState(originalLockState), but stated in this way for clarity
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!event.altKey) return;
            switch (event.key.toLowerCase()) {
                case 'l':
                    event.preventDefault();
                    lockButton.click();
                    break;
                case 'p':
                    event.preventDefault();
                    captureButton.click();
                    break;
            }
        });
    }
})();
 