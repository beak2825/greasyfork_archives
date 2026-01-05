// ==UserScript==
// @name         SOOP Time Recorder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  SOOP 라이브 및 VOD에서 타임스탬프 기록 및 관리
// @author       result41
// @match        https://play.sooplive.co.kr/*
// @match        https://stbbs.sooplive.co.kr/vodclip/index.php/*
// @match        https://vod.sooplive.co.kr/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559104/SOOP%20Time%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/559104/SOOP%20Time%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let historyWindow = null;
    const HOST = window.location.host;
    const IS_CLIP_POPUP = HOST === 'stbbs.sooplive.co.kr';
    const IS_VOD = HOST === 'vod.sooplive.co.kr';

    function showToast(message) {
        const existingToast = document.getElementById('soop_custom_toast');
        if (existingToast) { existingToast.remove(); }
        if (IS_CLIP_POPUP) return;
        const toast = document.createElement('div');
        toast.id = 'soop_custom_toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '100px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '999999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        toast.style.fontSize = '14px';
        toast.innerText = message;
        document.documentElement.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => {
                if (toast.parentNode) { toast.parentNode.removeChild(toast); }
            });
        }, 3000);
    }

    // --- 통합 BJ ID 추출 함수 ---
    function getCurrentBjId() {
        // 1. VOD 페이지 로직 (썸네일 박스 href 파싱)
        if (IS_VOD) {
            const thumbLink = document.querySelector('.thumbnail_box .thumb');
            if (thumbLink && thumbLink.href) {
                // 예: https://www.sooplive.co.kr/station/songhy -> songhy 추출
                const parts = thumbLink.href.split('/').filter(part => part.length > 0);
                return parts[parts.length - 1];
            }
            return null;
        }

        // 2. 클립 팝업 (URL 파라미터)
        const urlMatch = window.location.href.match(/bj_id=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }

        // 3. 라이브 플레이어 (URL 경로)
        const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/\d+/);
        if (pathMatch && pathMatch[1]) {
            return pathMatch[1];
        }

        return null;
    }

    function getStorageKey(bjId) {
        return `soop_record_${bjId || 'default'}`;
    }

    function getCleanedHistory(bjId) {
        const key = getStorageKey(bjId);
        let storedData = JSON.parse(GM_getValue(key, '[]'));
        if (!Array.isArray(storedData)) { storedData = []; }
        const now = Date.now();
        const validHistory = storedData.filter(item => {
            return !item.expiry || item.expiry > now;
        });
        if (validHistory.length !== storedData.length) {
            GM_setValue(key, JSON.stringify(validHistory));
        }
        return validHistory;
    }

    function setHistory(bjId, historyArray) {
        const key = getStorageKey(bjId);
        GM_setValue(key, JSON.stringify(historyArray));
    }

    function deleteHistory() {
        if (!confirm("정말 모든 기록을 삭제하시겠습니까?")) {
            return;
        }

        const bjId = getCurrentBjId();
        const key = getStorageKey(bjId);

        GM_setValue(key, null);

        showToast(`✔ 기록이 모두 삭제되었습니다.`);

        if (historyWindow && !historyWindow.closed) {
            historyWindow.close();
            historyWindow = null;
        }
    }
    // ---------------------------------------------


    if (IS_CLIP_POPUP) {
        function waitForPopupElements() {
            const bjIdQuery = getCurrentBjId();
            if (!bjIdQuery) return;
            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(() => {
                const titleElement = document.querySelector('.u_clip_title ');
                attempts++;
                if (titleElement) {
                    clearInterval(interval);
                    displayClipTimer(bjIdQuery, titleElement);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 500);
        }

        function displayClipTimer(bjId, titleElement) {
            const history = getCleanedHistory(bjId);
            if (history.length === 0) return;
            const latestRecord = history[history.length - 1];
            if (!latestRecord.expiry) return;
            const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
            const savedTimeMs = latestRecord.expiry - THIRTY_DAYS_MS;
            const now = Date.now();
            const TEN_MINUTES_MS = 10 * 60 * 1000;
            const timeElapsed = now - savedTimeMs;

            if (timeElapsed < TEN_MINUTES_MS) {
                const timeLeftMs = TEN_MINUTES_MS - timeElapsed;
                const minutes = Math.floor(timeLeftMs / 60000);
                const seconds = Math.floor((timeLeftMs % 60000) / 1000);
                const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                const timerSpan = document.createElement('span');
                timerSpan.style.marginRight = '10px';
                timerSpan.style.fontWeight = 'bold';
                timerSpan.style.color = '#8e958c';
                timerSpan.innerText = `⏳ 마지막 Record 시간: ${timeString}`;

                titleElement.parentNode.insertBefore(timerSpan, titleElement);
            }
        }
        waitForPopupElements();
        return;
    }


    // --- 메인 및 VOD 페이지 로직 ---
    const MAX_ATTEMPTS = 40;
    let attempts = 0;

    const loadInterval = setInterval(() => {
        if (attempts >= MAX_ATTEMPTS) {
            clearInterval(loadInterval);
            return;
        }

        // 1. VOD 페이지 로직
        if (IS_VOD) {
            // player_item_list 클래스를 가진 모든 요소를 찾음 (보통 2개)
            const playerLists = document.querySelectorAll('.player_item_list');
            if (playerLists.length > 0) {
                let injectedCount = 0;
                playerLists.forEach(list => {
                    // 각 리스트에 버튼 컨테이너가 이미 있는지 확인 (클래스로 확인)
                    if (!list.querySelector('.soop_custom_buttons_vod')) {
                        createButtons(list, 'vod_page');
                    }
                    if (list.querySelector('.soop_custom_buttons_vod')) {
                        injectedCount++;
                    }
                });

                // 찾은 리스트 모두에 삽입되었으면 인터벌 종료
                if (injectedCount === playerLists.length) {
                    clearInterval(loadInterval);
                    return;
                }
            }
        }
        // 2. 라이브 플레이어 로직
        else {
            const broadState = document.querySelector('#broadInfo #broadState');
            if (broadState && !document.getElementById('soop_custom_buttons')) {
                clearInterval(loadInterval);
                createButtons(broadState, 'broadState');
                return;
            }

            const broadcastArea = document.querySelector('#broadcastArea');
            if (broadcastArea && !document.getElementById('soop_custom_buttons')) {
                if (!broadState) {
                    clearInterval(loadInterval);
                    createButtons(broadcastArea, 'broadcastArea');
                    return;
                }
            }
        }

        attempts++;
    }, 500);
    // ----------------------------------------------------


    window.addEventListener('message', (event) => {
        if (!event.data || event.data.source !== 'soop_time_recorder_popup') {
            return;
        }

        const { action, value, historyUpdates, id, newTime } = event.data;
        const bjId = getCurrentBjId();

        switch (action) {
            case 'SAVE_ALL_MEMOS':
                if (historyUpdates && Array.isArray(historyUpdates)) {
                    const currentHistory = getCleanedHistory(bjId);
                    historyUpdates.forEach(update => {
                        const index = currentHistory.findIndex(item => item.id === update.id);
                        if (index > -1) {
                            currentHistory[index].memo = update.memo;
                        }
                    });
                    setHistory(bjId, currentHistory);

                    if (value === 'COPYING') {
                        if (historyWindow && !historyWindow.closed && historyWindow.startCopy) {
                            historyWindow.startCopy();
                        }
                    }
                }
                break;

            case 'DELETE_SINGLE':
                if (id) {
                    let currentHistory = getCleanedHistory(bjId);
                    const originalLength = currentHistory.length;
                    currentHistory = currentHistory.filter(item => item.id !== id);
                    if (currentHistory.length !== originalLength) {
                        setHistory(bjId, currentHistory);
                        showToast("🗑️ 항목이 삭제되었습니다.");
                    }
                }
                break;

            case 'UPDATE_TIME':
                if (id && newTime) {
                    const currentHistory = getCleanedHistory(bjId);
                    const index = currentHistory.findIndex(item => item.id === id);
                    if (index > -1) {
                        currentHistory[index].videoTime = newTime;
                        setHistory(bjId, currentHistory);
                        showToast(`✏️ 시간이 수정되었습니다: ${newTime}`);
                    }
                }
                break;
        }
    });
    // ----------------------------------------------------


    // --- 버튼 및 팝업 관련 함수 정의 ---
    function createButtons(targetElement, insertType) {
        const container = document.createElement('span');

        const btnRecord = document.createElement('button');
        btnRecord.innerText = 'Record';
        styleButton(btnRecord, '#4CAF50');
        btnRecord.onclick = recordTime;

        const btnHistory = document.createElement('button');
        btnHistory.innerText = 'History';
        styleButton(btnHistory, '#2196F3');
        btnHistory.onclick = openHistoryWindow;

        const btnDelete = document.createElement('button');
        btnDelete.innerText = 'Delete All';
        styleButton(btnDelete, '#f44336');
        btnDelete.onclick = deleteHistory;

        if (insertType === 'broadState') {
            container.id = 'soop_custom_buttons'; // 라이브는 ID 사용
            container.style.marginLeft = '10px';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';
            container.style.gap = '5px';
            container.style.position = 'relative';

            container.appendChild(btnRecord);
            container.appendChild(btnHistory);
            container.appendChild(btnDelete);

            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);

        } else if (insertType === 'broadcastArea') {
            container.id = 'soop_custom_buttons'; // 라이브는 ID 사용
            container.style.display = 'block';
            container.style.position = 'absolute';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.zIndex = '10';

            const innerFlex = document.createElement('div');
            innerFlex.style.display = 'flex';
            innerFlex.style.gap = '5px';
            container.appendChild(innerFlex);

            innerFlex.appendChild(btnRecord);
            innerFlex.appendChild(btnHistory);
            innerFlex.appendChild(btnDelete);

            targetElement.appendChild(container);

        } else if (insertType === 'vod_page') {
            // VOD 페이지: 다중 삽입을 위해 ID 대신 클래스 사용
            container.className = 'soop_custom_buttons_vod';
            container.style.display = 'inline-block';
            container.style.marginRight = '10px';
            container.style.verticalAlign = 'middle';

            // Record 버튼 제외, History와 Delete만 추가
            container.appendChild(btnHistory);
            container.appendChild(document.createTextNode(' '));
            container.appendChild(btnDelete);

            btnHistory.style.marginRight = '4px';

            // targetElement(.player_item_list)의 첫 번째 자식으로 삽입
            targetElement.insertBefore(container, targetElement.firstChild);
        }
    }

    function recordTime() {
        const timeElement = document.querySelector('#broadInfo #time');

        let currentTime = "00:00:00";
        if (timeElement) {
             currentTime = timeElement.innerText.trim();
        } else {
            showToast("시간 정보를 찾을 수 없습니다.");
            return;
        }

        if (currentTime === "00:00:00") {
            showToast("시간 정보를 찾을 수 없습니다.");
            return;
        }

        const now = new Date();
        const timestamp = now.toLocaleTimeString();

        const bjId = getCurrentBjId();
        if (!bjId) {
            showToast("방송인 ID를 찾을 수 없어 기록할 수 없습니다.");
            return;
        }

        const key = getStorageKey(bjId);
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        const expiryTime = now.getTime() + THIRTY_DAYS_MS;
        const history = getCleanedHistory(bjId);

        history.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            videoTime: currentTime,
            memo: "",
            savedAt: timestamp,
            expiry: expiryTime
        });

        setHistory(bjId, history);
        showToast(`✔ 타임스탬프 저장됨: ${currentTime} `);

        if (historyWindow && !historyWindow.closed) {
             historyWindow.close();
             historyWindow = null;
             openHistoryWindow();
        }
    }

    function openHistoryWindow() {
        if (historyWindow && !historyWindow.closed) {
            historyWindow.focus();
            return;
        }

        const bjId = getCurrentBjId();
        if (!bjId) {
            showToast("BJ ID를 찾을 수 없어 History를 열 수 없습니다.");
            return;
        }

        const currentHistory = getCleanedHistory(bjId);
        const escapedHistoryJson = JSON.stringify(currentHistory).replace(/</g, '\\u003c');


        historyWindow = window.open('', 'SOOP_Time_History', 'width=450,height=550,scrollbars=no,resizable=yes');

        if (!historyWindow) {
            alert('팝업 창이 차단되었습니다. 팝업 차단을 해제해 주세요.');
            return;
        }

        const doc = historyWindow.document;
        doc.title = 'SOOP 타임스탬프 기록';

        doc.write(`
            <html>
            <head>
                <style>
                    html, body {
                        height: 100%; margin: 0; padding: 0; overflow: hidden;
                    }
                    body {
                        font-family: sans-serif; background-color: #2c2c2c; color: #fff; padding: 15px;
                        display: flex; flex-direction: column; box-sizing: border-box;
                    }
                    h3 {
                        color: #FFD700; border-bottom: 2px solid #555; padding-bottom: 5px; margin-top: 0;
                        flex-shrink: 0;
                    }
                    #content_area { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
                    #list_container { flex-grow: 1; overflow-y: auto; padding-right: 10px; margin-bottom: 15px; }
                    ul { list-style: none; padding: 0; margin: 0; }
                    li { border-bottom: 1px solid #444; padding: 8px 0; margin-bottom: 10px; display: flex; flex-direction: column; }
                    .header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                    .time-info { display: flex; align-items: center; gap: 10px; }

                    .video-time {
                        font-weight: bold; color: #4CAF50; font-size: 1.2em;
                        cursor: pointer;
                        transition: color 0.2s;
                    }
                    .video-time:hover { color: #81C784; text-decoration: underline; }

                    .time-edit-input {
                        background-color: #444; color: #fff; border: 1px solid #4CAF50;
                        font-size: 1.1em; font-weight: bold; width: 100px; padding: 2px;
                        border-radius: 3px;
                    }

                    .saved-at { font-size: 0.8em; color: #aaa; }
                    .memo-input {
                        width: 100%; height: 50px; padding: 5px; box-sizing: border-box; border: 1px solid #555;
                        background-color: #3a3a3a; color: white; margin-top: 5px; resize: vertical; font-family: sans-serif;
                    }
                    .history-btn {
                        border: none; padding: 8px; border-radius: 4px; cursor: pointer;
                        font-weight: bold; width: 100%; box-sizing: border-box; flex-shrink: 0;
                        margin-bottom: 5px;
                    }
                    .delete-one-btn {
                        background-color: transparent;
                        border: 1px solid #f44336;
                        color: #f44336;
                        border-radius: 3px;
                        cursor: pointer;
                        padding: 2px 6px;
                        font-size: 0.8em;
                        transition: all 0.2s;
                    }
                    .delete-one-btn:hover {
                        background-color: #f44336;
                        color: white;
                    }

                    #copy_btn { background-color: #2196F3; color: white; }
                    #copy_btn:hover { background-color: #1976D2; }
                    .empty-message { color: #ccc; text-align: center; padding: 20px; }
                </style>
            </head>
            <body>
                <h3>SOOP 타임스탬프 기록 (${bjId})</h3>
                <div id="content_area"></div>

                <script>
                    let historyData = JSON.parse('${escapedHistoryJson}');

                    window.deleteEntry = function(id) {
                        if (!confirm('이 기록을 삭제하시겠습니까?')) {
                            return;
                        }
                        const itemElement = document.getElementById('item-' + id);
                        if (itemElement) itemElement.remove();

                        historyData = historyData.filter(item => item.id !== id);

                        if (historyData.length === 0) {
                            const listContainer = document.querySelector('#list_container');
                            if (listContainer) listContainer.innerHTML = '<p class="empty-message">저장된 기록이 없습니다.</p>';
                        }

                        window.opener.postMessage({
                            source: 'soop_time_recorder_popup',
                            action: 'DELETE_SINGLE',
                            id: id
                        }, '*');
                    };

                    window.editTime = function(id, spanElement) {
                        const originalText = spanElement.innerText.replace('⏰ ', '');
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = originalText;
                        input.className = 'time-edit-input';

                        input.onblur = function() { finishEditTime(id, input, spanElement, originalText); };
                        input.onkeydown = function(e) {
                            if (e.key === 'Enter') {
                                input.blur();
                            }
                        };

                        spanElement.style.display = 'none';
                        spanElement.parentNode.insertBefore(input, spanElement);
                        input.focus();
                    };

                    function finishEditTime(id, inputElement, spanElement, originalText) {
                        const newTime = inputElement.value.trim();

                        if (newTime === originalText || newTime === '') {
                            inputElement.remove();
                            spanElement.style.display = 'inline';
                            return;
                        }

                        spanElement.innerText = '⏰ ' + newTime;
                        inputElement.remove();
                        spanElement.style.display = 'inline';

                        const index = historyData.findIndex(item => item.id === id);
                        if (index > -1) {
                            historyData[index].videoTime = newTime;
                        }

                        window.opener.postMessage({
                            source: 'soop_time_recorder_popup',
                            action: 'UPDATE_TIME',
                            id: id,
                            newTime: newTime
                        }, '*');
                    }

                    function sendAllMemos(actionType) {
                        const memoUpdates = [];
                        const textareas = document.querySelectorAll('.memo-input');

                        textareas.forEach(textarea => {
                            const recordId = textarea.id.split('-')[2];
                            memoUpdates.push({
                                id: recordId,
                                memo: textarea.value
                            });
                            const index = historyData.findIndex(item => item.id === recordId);
                            if (index > -1) {
                                historyData[index].memo = textarea.value;
                            }
                        });

                        window.opener.postMessage({
                            source: 'soop_time_recorder_popup',
                            action: 'SAVE_ALL_MEMOS',
                            historyUpdates: memoUpdates,
                            value: actionType
                        }, '*');
                    }

                    window.onbeforeunload = function() {
                        sendAllMemos('CLOSING');
                    };

                    window.startCopy = function() {
                        copyFullHistory(true);
                    };

                    function copyFullHistory(isSaved) {
                        if (!isSaved) {
                            sendAllMemos('COPYING');
                            return;
                        }

                        const textToCopy = historyData.slice().map(item => {
                            const baseTime = '[ ' + item.videoTime + ' ]';
                            const memoText = item.memo ? item.memo.trim() : "";
                            return memoText ? baseTime + ' - ' + memoText : baseTime;
                        }).join('\\n');

                        if (!textToCopy) {
                            alert('복사할 기록이 없습니다.');
                            return;
                        }

                        const tempTextArea = document.createElement('textarea');
                        tempTextArea.value = textToCopy;
                        tempTextArea.style.position = 'fixed';
                        tempTextArea.style.left = '-9999px';
                        document.body.appendChild(tempTextArea);

                        try {
                            tempTextArea.select();
                            if (document.execCommand('copy')) {
                                alert('✔ 전체 기록이 클립보드에 복사되었습니다.\\n팝업 창을 닫습니다.');
                                window.close();
                            } else {
                                alert('클립보드 복사에 실패했습니다.');
                            }
                        } catch (err) {
                            console.error('클립보드 복사 실패:', err);
                        } finally {
                            document.body.removeChild(tempTextArea);
                        }
                    }

                    document.body.addEventListener('click', function(event) {
                        const target = event.target;
                        if (target.id === 'copy_btn') {
                            copyFullHistory(false);
                        }
                    });

                    function renderHistoryContent(contentArea, historyArray) {
                        if (!contentArea) return;
                        const history = historyArray;

                        contentArea.innerHTML = '';

                        let listHTML = '<div id="list_container"><ul>';

                        if (history.length === 0) {
                            listHTML += '<p class="empty-message">저장된 기록이 없습니다.</p>';
                        } else {
                            [...history].reverse().forEach((item) => {
                                listHTML += \`
                                    <li id="item-\${item.id}">
                                        <div class="header-line">
                                            <div class="time-info">
                                                <span class="video-time" title="더블클릭하여 시간 수정" ondblclick="editTime('\${item.id}', this)">⏰ \${item.videoTime}</span>
                                                <span class="saved-at">\${item.savedAt}</span>
                                            </div>
                                            <button class="delete-one-btn" onclick="deleteEntry('\${item.id}')">삭제</button>
                                        </div>
                                        <textarea
                                            id="memo-input-\${item.id}"
                                            class="memo-input"
                                            rows="2"
                                            placeholder="메모를 입력하세요..."
                                        >\${item.memo}</textarea>
                                    </li>
                                \`;
                            });
                        }
                        listHTML += '</ul></div>';

                        const copyButtonHTML = \`<button id="copy_btn" class="history-btn">📄 전체 목록 복사하기</button>\`;

                        contentArea.innerHTML = listHTML + copyButtonHTML;
                    }

                    renderHistoryContent(document.getElementById('content_area'), historyData);

                </script>
            </body>
            </html>
        `);
        doc.close();
    }

    function styleButton(btn, bgColor) {
         btn.style.backgroundColor = bgColor;
         btn.style.color = 'white';
         btn.style.border = 'none';
         btn.style.padding = '4px 8px';
         btn.style.borderRadius = '3px';
         btn.style.cursor = 'pointer';
         btn.style.fontSize = '12px';
         btn.style.fontWeight = 'bold';
         btn.style.fontFamily = 'dotum, sans-serif';
    }

})();