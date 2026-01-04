// ==UserScript==
// @name SOOP 블랙리스트 반자동 도우미
// @name:en SOOP Blacklist Semi-Auto Helper
// @namespace https://www.sooplive.co.kr/
// @version 1.0
// @description 처리 상태 기록 및 Excel 결과 내보내기 기능이 포함된 최종 완성 버전입니다.
// @description:en Exports SOOP blacklist data (User ID, Admin ID, and Date) to a CSV file. Optimized for speed and minimal data collection.
// @author Lmayo
// @match https://*.sooplive.co.kr/*/setting/blacklist
// @icon https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551871/SOOP%20%EB%B8%94%EB%9E%99%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EB%B0%98%EC%9E%90%EB%8F%99%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/551871/SOOP%20%EB%B8%94%EB%9E%99%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EB%B0%98%EC%9E%90%EB%8F%99%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 스크립트 상태 관리 ---
    let idList = [];
    let currentIndex = -1;
    let isBatchRunning = false;
    let observer;
    let results = [];

    // 이 타이머는 '추가' 버튼 클릭 후 성공 신호(UI 변경)가 오지 않을 때 강제 진행을 위해 사용됩니다.
    let timeoutTimer = null;

    // --- 도우미 함수 ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // [수정] timeout을 5000ms(5초)로 증가시켜 검색 실패 오판을 줄임
    async function waitForElement(selector, parent = document, timeout = 5000) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = parent.querySelector(selector);
                if (element) { clearInterval(interval); resolve(element); }
                else if (Date.now() - startTime > timeout) { clearInterval(interval); resolve(null); }
            }, 100);
        });
    }

    /**
     * @description 검색 입력창의 값을 네이티브 방식으로 초기화하고 input 이벤트를 발생시켜 프레임워크와 동기화합니다.
     */
    function resetInputElementValue(inputElement, value = '') {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, value);
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }


    // --- 핵심 로직 ---
    async function processNextId() {
        // 타이머 초기화 (이전에 걸려있던 중복 대기 타이머를 삭제)
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
            timeoutTimer = null;
        }

        if (!isBatchRunning) return;
        currentIndex++;
        const logDiv = document.getElementById('batch-status-log');
        const searchInput = document.querySelector('input[placeholder="유저 아이디 검색"]');

        if (currentIndex >= idList.length) {
            logDiv.innerHTML = `<strong style="color:green;">✔ 완료!</strong> 모든 아이디를 처리했습니다.<br>이제 결과를 내보낼 수 있습니다.`;
            stopBatchProcess();
            return;
        }
        const currentId = idList[currentIndex];
        try {
            await navigator.clipboard.writeText(currentId);

            if (searchInput) {
                resetInputElementValue(searchInput);
                searchInput.focus();
            }

            logDiv.innerHTML = `<strong>(${(currentIndex + 1)}/${idList.length})</strong> 처리 대기 중: <code style="background:#eee; padding:2px 4px; border-radius:4px;">${currentId}</code>`;
        } catch (err) {
            logDiv.innerHTML = `<strong style="color:red;">❌ 오류:</strong> 클립보드 쓰기 권한이 없습니다.`;
            stopBatchProcess();
        }
    }

    async function triggerSearchAndAdd(userId) {
        if (!userId) return;

        await sleep(20);
        const resultForm = await waitForElement('div[class*="ResultForm_resultForm__"]');

        if (resultForm) {
            const addButton = resultForm.querySelector('button');

            // [중복/성공 공통 로직] 버튼이 있으면 무조건 클릭
            if (addButton && addButton.textContent.trim() === '추가') {
                addButton.click();

                // ⬇️ [핵심 수정 로직: 중복 감지 타이머] ⬇️
                // 버튼 클릭 후 0.3초 동안 MutationObserver에서 성공 신호(UI 변경)가 없으면
                // 중복으로 간주하고 강제로 다음 ID로 넘어갑니다.
                timeoutTimer = setTimeout(() => {
                    // 현재 처리 중인 ID가 아직 그대로 남아있는지 확인 (성공하지 않았는지 확인)
                    if (isBatchRunning && idList[currentIndex] === userId) {
                        results.push({ id: userId, status: '이미 추가됨 (타임아웃 감지)' });
                        console.warn(`[타임아웃 감지] '${userId}'님은 이미 추가되었을 가능성이 높습니다. 다음 아이디로 자동 이동합니다.`);
                        const logDiv = document.getElementById('batch-status-log');
                        if (logDiv) {
                            logDiv.innerHTML += `<div style="color:orange;">  -> '${userId}' 이미 추가됨 (강제 이동).</div>`;
                            logDiv.scrollTop = logDiv.scrollHeight;
                        }
                        processNextId(); // 다음 ID로 강제 이동
                    }
                }, 300); // 0.3초 대기
                // ⬆️ [핵심 수정 로직] ⬆️

            } else {
                // 이 블록은 '추가' 버튼이 아닌 다른 버튼이 있거나, 텍스트가 '추가'가 아닐 때 실행됩니다.
                // 일반적인 중복 상황에서는 위의 '핵심 수정 로직'이 대신 처리하게 됩니다.
                // 여기서는 예외적인 상황(예: UI 변경으로 버튼 텍스트가 바뀜)으로 간주하고 다음 ID로 이동합니다.
                results.push({ id: userId, status: '중복 또는 알 수 없는 오류' });
                console.warn(`'${userId}' 님: 알 수 없는 버튼 상태. 다음으로 이동합니다.`);
                const logDiv = document.getElementById('batch-status-log');
                if (logDiv) {
                    logDiv.innerHTML += `<div style="color:red;">  -> '${userId}' 알 수 없는 오류.</div>`;
                    logDiv.scrollTop = logDiv.scrollHeight;
                }
                processNextId();
            }
        } else {
            // 검색 결과 컨테이너를 찾지 못함 (검색 실패)
            results.push({ id: userId, status: '검색 실패 (유저 ID 없음)' });
            console.warn(`'${userId}' 님을 찾을 수 없습니다.`);
            const logDiv = document.getElementById('batch-status-log');
            if (logDiv) {
                logDiv.innerHTML += `<div style="color:red;">  -> '${userId}' 검색 실패.</div>`;
                logDiv.scrollTop = logDiv.scrollHeight;
            }
            processNextId();
        }
    }

    async function handleEnterKey(event) {
        if (event.key !== 'Enter' || !isBatchRunning) return;
        triggerSearchAndAdd(event.target.value);
    }

    async function handleSearchClick(event) {
        if (!isBatchRunning) return;
        const searchForm = event.currentTarget.closest('div[class*="InputForm_inputForm__"]');
        if (searchForm) {
            const searchInput = searchForm.querySelector('input[placeholder="유저 아이디 검색"]');
            if (searchInput) {
                triggerSearchAndAdd(searchInput.value);
            }
        }
    }

    async function pasteFromClipboardOnFocus() {
        if (!isBatchRunning) return;
        const searchInput = this;
        if (searchInput.value !== '') return;
        try {
            const text = await navigator.clipboard.readText();
            if (!text || text.trim() === '') return;
            const userId = text.trim();
            resetInputElementValue(searchInput, userId);
        } catch (err) { /* 권한 오류 등 무시 */ }
    }

    // --- 제어 및 UI 함수 ---
    function startBatchProcess() {
        const textarea = document.getElementById('batch-id-textarea');
        idList = textarea.value.replace(/\n/g, ',').split(',').map(id => id.trim()).filter(id => id);
        if (idList.length === 0) { alert('아이디를 입력하세요.'); return; }

        results = [];
        isBatchRunning = true;
        currentIndex = -1;

        document.getElementById('batch-toggle-btn').textContent = '■ 일괄 처리 중지';
        document.getElementById('export-btn').disabled = true;
        document.getElementById('export-btn').style.backgroundColor = '#aaa';

        processNextId();
    }

    function stopBatchProcess() {
        isBatchRunning = false;
        const button = document.getElementById('batch-toggle-btn');
        if (button) button.textContent = '▶ 일괄 처리 시작';

        if (results.length > 0) {
            document.getElementById('export-btn').disabled = false;
            document.getElementById('export-btn').style.backgroundColor = '#28a745';
        }

        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
            timeoutTimer = null;
        }
    }

    function toggleBatchProcess() {
        if (isBatchRunning) {
            stopBatchProcess();
            const logDiv = document.getElementById('batch-status-log');
            if (logDiv) logDiv.innerHTML = '작업이 중지되었습니다.';
        } else {
            startBatchProcess();
        }
    }

    // [추가] 결과를 CSV 파일로 다운로드하는 함수
    function exportResultsToExcel() {
        if (results.length === 0) {
            alert('내보낼 결과가 없습니다. 먼저 작업을 실행해주세요.');
            return;
        }

        let csvContent = "아이디,처리 상태\r\n"; // CSV 헤더
        results.forEach(result => {
            csvContent += `${result.id},${result.status}\r\n`;
        });

        // 한글 깨짐 방지를 위한 BOM 추가
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        // 파일명: blacklist_results_YYYY-MM-DD.csv
        const filename = `blacklist_results_${new Date().toISOString().slice(0, 10)}.csv`;
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function createBatchUI() {
        const mainContainer = document.querySelector('div[class*="SettingContainer_settingContainer__"]');
        if (mainContainer && !document.getElementById('batch-container')) {
            const batchContainer = document.createElement('div');
            batchContainer.id = 'batch-container';
            batchContainer.style.cssText = `border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 24px;`;
            batchContainer.innerHTML = `
                <h3 style="margin: 0 0 12px 0;">블랙리스트 반자동 도우미</h3>
                <textarea id="batch-id-textarea" placeholder="콤마(,) 또는 엔터(줄바꿈)로 구분된 아이디를 여기에 붙여넣으세요..." style="width: 100%; min-height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                <div style="display: flex; gap: 10px; margin-top: 12px;">
                    <button id="batch-toggle-btn" style="flex-grow: 1; padding: 10px; border: none; border-radius: 4px; background-color: #1a73e8; color: white; font-size: 16px; font-weight: bold; cursor: pointer;">▶ 일괄 처리 시작</button>
                    <button id="export-btn" disabled style="flex-grow: 1; padding: 10px; border: none; border-radius: 4px; background-color: #aaa; color: white; font-size: 16px; font-weight: bold; cursor: pointer;">결과 내보내기 (Excel)</button>
                </div>
                <div id="batch-status-log" style="margin-top: 12px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; min-height: 50px; font-size: 13px; color: #333;">작업 대기 중...</div>
            `;
            mainContainer.parentNode.insertBefore(batchContainer, mainContainer);

            // 이벤트 리스너 연결
            document.getElementById('batch-toggle-btn').onclick = toggleBatchProcess;
            document.getElementById('export-btn').onclick = exportResultsToExcel;
        }
    }

    function setupUIAndListeners() {
        createBatchUI();
        const searchInput = document.querySelector('input[placeholder="유저 아이디 검색"]');
        if (searchInput && !searchInput.hasAttribute('data-batch-listener')) {
            searchInput.addEventListener('focus', pasteFromClipboardOnFocus);
            searchInput.addEventListener('keydown', handleEnterKey);
            searchInput.setAttribute('data-batch-listener', 'true');

            const searchForm = searchInput.closest('div[class*="InputForm_inputForm__"]');
            if (searchForm) {
                const searchButton = searchForm.querySelector('button');
                if (searchButton && !searchButton.hasAttribute('data-batch-click-listener')) {
                    searchButton.addEventListener('click', handleSearchClick);
                    searchButton.setAttribute('data-batch-click-listener', 'true');
                }
            }
        }
    }

    // [수정] 성공 감지 시 타이머를 확실하게 해제하도록 로직 추가
    observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('div[class*="ResultForm_resultForm__"]')) {
                        if (isBatchRunning) {
                            // 성공! 타이머가 아직 남아있다면 해제하고 다음 ID 처리
                                if (timeoutTimer) {
                                    clearTimeout(timeoutTimer);
                                    timeoutTimer = null;
                                }

                            const successId = idList[currentIndex];
                            results.push({ id: successId, status: '성공' });
                            console.log(`'${successId}'님 추가 성공! 다음 아이디를 처리합니다.`);
                            processNextId();
                        }
                    }
                });
            }
        }
        setupUIAndListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();