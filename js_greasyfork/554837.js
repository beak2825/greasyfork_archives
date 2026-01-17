// ==UserScript==
// @name         LIMS 생산 자동화
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  LIMS '주문조회'에서 '생산결정' 및 '생산완료'를 자동화합니다. (v1.4.1 - 결과 로그 자동 다운로드 추가)
// @author       김재형
// @match        *://*/ngs/order/retrieveNgsOrdForm.do*
// @match        *://*/ngs/order/retrieveOrdSearchDetailForm.do*
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554837/LIMS%20%EC%83%9D%EC%82%B0%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/554837/LIMS%20%EC%83%9D%EC%82%B0%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 대상 페이지 식별자 ---
    const listPageSelector = 'button#btnSearch.btn_search'; // 관제탑 (목록) 페이지 식별자
    const detailPageSelector = 'button#btnPdctCfm'; // 작업 (상세) 페이지 식별자

    // --- 페이지 이동용 URL (상수) ---
    const listPageURL = '/ngs/order/retrieveNgsOrdForm.do';
    const detailPageURL = '/ngs/order/retrieveOrdSearchDetailForm.do';

    // --- 공통 유틸리티 (localStorage 사용) ---
    // 로그를 localStorage에 배열로 추가
    function appendLogToStorage(key, orderNo, message) {
        let logs = JSON.parse(localStorage.getItem(key) || '[]');
        logs.push({ orderNo, message, time: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(logs));
    }

    // 로그를 localStorage에서 읽기
    function getLogFromStorage(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    // 스크립트 관련 localStorage 키 모두 삭제
    function clearLocalStorage() {
        console.log("[LIMS Auto] 모든 localStorage 정리");
        Object.keys(localStorage)
            .filter(key => key.startsWith('limsAutomation'))
            .forEach(key => localStorage.removeItem(key));
    }


    // ==================================================================
    // --- SCRIPT 2: 작업 (상세) 페이지 로직 ---
    // ==================================================================
    let currentOrderNo, currentStep, alertHookActive, originalAlert, originalConfirm, isAutomationJob;
    let workerStopMonitor = null; // '중지' 요청 감지용 인터벌
    let waitingForSecondCompleteAlert = false; // '생산완료' 2단계 알림 대기용 플래그
    let successMessageOverride = null; // 🆕 소수점 차이 등 성공 메시지 덮어쓰기용

    /**
     * SCRIPT 2 (작업 탭)의 메인 함수.
     * 페이지 로드 시 상태를 확인하고 '중지' 요청이 있다면 즉시 탭을 닫음.
     * 자동화 대상일 경우 '중지' 모니터를 활성화하고 runAutomation()을 호출.
     */
    function initAutomationWorker() {
        currentOrderNo = new URLSearchParams(window.location.search).get('ordNo');
        currentStep = 'init';
        alertHookActive = false;
        originalAlert = unsafeWindow.alert;
        originalConfirm = unsafeWindow.confirm;
        isAutomationJob = false;
        waitingForSecondCompleteAlert = false;
        successMessageOverride = null; // 🆕 초기화

        const status = localStorage.getItem('limsAutomationStatus');
        const hash = window.location.hash;
        isAutomationJob = (status === 'RUNNING' && hash === '#tab12');

        // 1. '중지' 요청이 있는지 즉시 확인
        if (localStorage.getItem('limsAutomationStopRequested') === 'true') {
            console.log("[LIMS Auto] 중지 요청 감지. 'STOPPED' 상태 저장 후 탭을 닫습니다.");
            localStorage.setItem('limsAutomationStatus', 'STOPPED');
            window.close(); // 탭 닫기
            return;
        }

        // 2. 자동화 작업 대상이 아니면 스크립트 종료
        if (!isAutomationJob) {
            console.log("[LIMS Auto] 자동화 작업 대상이 아닙니다.", `Status: ${status}, Hash: ${hash}`);
            return;
        }

        // 3. 자동화 작업 대상이면 즉시 실행
        console.log(`[LIMS Auto] 작업(상세) 페이지 스크립트 v1.1 실행. 대상: ${currentOrderNo}`);

        // '중지' 요청 실시간 감시 시작
        startWorkerStopMonitor();

        // 자동화 시작
        runAutomation();
    }

    /**
     * '중지' 요청을 0.5초마다 감지하는 모니터 시작.
     * '시작 탭'에서 '중지' 버튼을 누르면 localStorage의 플래그가 'true'가 됨.
     */
    function startWorkerStopMonitor() {
        if (workerStopMonitor) clearInterval(workerStopMonitor);

        workerStopMonitor = setInterval(() => {
            if (localStorage.getItem('limsAutomationStopRequested') === 'true') {
                stopWorkerMonitor(); // 모니터 중지
                console.log("[LIMS Auto] (Worker) '중지' 요청 감지. 'STOPPED' 상태 저장 후 탭을 닫습니다.");

                logError("시스템", "사용자 요청으로 작업이 중지됨");

                unhookAlerts();
                localStorage.setItem('limsAutomationStatus', 'STOPPED');
                window.close(); // 탭 닫기
            }
        }, 500); // 0.5초마다 확인
    }

    /**
     * '중지' 모니터 인터벌 해제
     */
    function stopWorkerMonitor() {
        if (workerStopMonitor) {
            clearInterval(workerStopMonitor);
            workerStopMonitor = null;
        }
    }

    // 그리드에서 품목 정보 가져오기
    function getItemDetailsFromGrid(itemCode) {
        try {
            // 1. 그리드 존재 확인
            if (typeof unsafeWindow.prdctnDecsnSheet === 'undefined') {
                console.log("[LIMS Auto] prdctnDecsnSheet가 정의되지 않음");
                return null;
            }

            const sheet = unsafeWindow.prdctnDecsnSheet;

            // 2. 그리드 함수 확인
            if (typeof sheet.GetDataLastRow !== 'function') {
                console.log("[LIMS Auto] GetDataLastRow 함수 없음");
                return null;
            }

            const lastRow = sheet.GetDataLastRow();

            // 3. 각 행 순회하며 찾기
            for (let i = 1; i <= lastRow; i++) {
                try {
                    const bomCd = sheet.GetCellValue(i, "bomCd");
                    const unitCode = sheet.GetCellValue(i, "unitCode");

                    // 코드 매칭 확인
                    if (bomCd === itemCode || unitCode === itemCode) {
                        const details = {
                            bomCd: bomCd,
                            unitCode: unitCode,
                            unitName: sheet.GetCellValue(i, "unitName"),
                            unitGroup: sheet.GetCellValue(i, "unitGroupNm"),
                            warehouse: sheet.GetCellValue(i, "erpWrhousNm")
                        };
                        console.log(`[LIMS Auto] 품목 정보 찾음: ${itemCode} -> ${details.unitName}`);
                        return details;
                    }
                } catch (rowError) {
                    console.warn(`[LIMS Auto] Row ${i} 읽기 오류:`, rowError);
                }
            }

            console.log(`[LIMS Auto] 그리드에서 품목 코드를 찾지 못함: ${itemCode}`);
        } catch (e) {
            console.error("[LIMS Auto] 그리드 조회 중 오류:", e);
        }
        return null;
    }

    // 초과 메시지에서 상세 정보 추출
    function parseExcessDetails(message) {
        // 여러 패턴 시도
        const patterns = [
            { name: "패턴1: (코드, 숫자 -> 숫자)", regex: /\(([^,\)]+),\s*([\d\.]+)\s*->\s*([\d\.]+)\)/ },
            { name: "패턴2: 수주:코드, 숫자 -> 숫자", regex: /수주:([^,]+),\s*([\d\.]+)\s*->\s*([\d\.]+)/ },
            { name: "패턴3: 공백 허용", regex: /수주:\s*([^\s,]+)\s*,\s*([\d\.]+)\s*->\s*([\d\.]+)/ },
            { name: "패턴4: (수주:코드)", regex: /\(수주:([^)]+)\)/ },
            { name: "패턴5: 범용 품목코드", regex: /([A-Z]+-[A-Z0-9]+)/ },
        ];

        for (let i = 0; i < patterns.length; i++) {
            const match = message.match(patterns[i].regex);
            if (match) {
                let itemCode, expected, actual;

                if (i < 3) {
                    // 패턴 1, 2, 3: 전체 정보 포함
                    itemCode = match[1].trim();
                    expected = match[2];
                    actual = match[3];
                } else if (i === 3) {
                    // 패턴 4: 코드만
                    itemCode = match[1].trim();
                } else {
                    // 패턴 5: 코드만
                    itemCode = match[1].trim();
                }

                // 그리드에서 품목 정보 찾기
                const itemDetails = getItemDetailsFromGrid(itemCode);

                const result = {
                    itemCode: itemCode,
                    itemName: itemDetails?.unitName || itemCode,
                    itemGroup: itemDetails?.unitGroup || "",
                    warehouse: itemDetails?.warehouse || "",
                    expected: expected || "?",
                    actual: actual || "?",
                    fullMessage: message,
                    foundInGrid: !!itemDetails
                };

                return result;
            }
        }

        return null;
    }

    /**
     * 자동화 작업의 첫 단계 (생산결정) 실행
     */
    function runAutomation() {
        console.log(`[LIMS Auto] [${currentOrderNo}] 자동화 시작. '생산결정' 단계.`);
        currentStep = 'decision';

        // 0. 먼저 생산완료 여부 빠른 체크 (DOM 로딩 여유를 위해 1초 대기)
        setTimeout(() => {
            const prdctnCmplDttm = document.querySelector('#prdctnCmplDttm');
            if (prdctnCmplDttm && prdctnCmplDttm.textContent.includes('생산수불일자:')) {
                const dateMatch = prdctnCmplDttm.textContent.match(/생산수불일자:\s*(.+)/);
                const completedDate = dateMatch ? dateMatch[1].trim() : '';

                // null이 아니고 실제 날짜가 있으면 이미 완료된 것
                if (completedDate && completedDate !== 'null') {
                    console.log(`[LIMS Auto] [${currentOrderNo}] 이미 생산완료된 수주 감지. 완료일: ${completedDate}`);
                    logSuccess(`이미 생산이 완료된 수주입니다. (완료일: ${completedDate})`);
                    moveToNext(true);
                    return;
                }
            }

            // 생산완료 아니면 기존 로직 진행
            console.log(`[LIMS Auto] [${currentOrderNo}] 생산완료 아님 확인. 그리드 로딩 대기 시작.`);

            // 1. 그리드 로딩 대기
            pollForGridReady((ready) => {
                if (!ready) {
                    logError("생산결정", "그리드(prdctnDecsnSheet) 로딩 30초 초과");
                    moveToNext(false);
                    return;
                }
                console.log(`[LIMS Auto] [${currentOrderNo}] 그리드 로드 완료.`);

                // 2. '생산결정' 버튼 찾기
                const button = document.querySelector(detailPageSelector);
                if (!button) {
                    logError("생산결정", "생산결정 버튼을 찾지 못함");
                    moveToNext(false);
                    return;
                }

                // 3. 알림창 가로채기 및 버튼 클릭
                console.log(`[LIMS Auto] [${currentOrderNo}] '생산결정' 버튼 찾음. 클릭 시도.`);
                hookAlerts();
                button.click();
            });
        }, 1000); // 1초 대기 (DOM 로딩 여유)
    }

    /**
     * '생산결정' 성공 후 '생산완료' 단계 시작
     */
    function startCompleteStep() {
        // '중지' 모니터가 활성 상태인지 확인
        if (workerStopMonitor === null) {
            console.log("[LIMS Auto] '생산완료' 단계 시작 전 '중지' 감지됨. 작업을 진행하지 않습니다.");
            return;
        }

        console.log(`[LIMS Auto] [${currentOrderNo}] '생산완료' 단계 시작.`);
        currentStep = 'complete';
        waitingForSecondCompleteAlert = false; // 2차 알림 대기 상태 초기화

        // 그리드 업데이트 완료 대기 후 생산완료 버튼 클릭
        (async () => {
            try {
                // 1. 그리드 객체 확인
                if (typeof unsafeWindow.prdctnDecsnSheet === 'undefined') {
                    console.warn("[LIMS Auto] prdctnDecsnSheet 객체를 찾을 수 없습니다. 대기 없이 진행합니다.");
                } else {
                    const sheet = unsafeWindow.prdctnDecsnSheet;
                    console.log(`[LIMS Auto] [${currentOrderNo}] 그리드 업데이트 대기 중... (현재 행: ${sheet.RowCount()})`);

                    // 2. 그리드 RowCount 안정화 대기 (증가 감지 후 안정화)
                    await waitForRowCountStable(sheet, 120000);
                    console.log(`[LIMS Auto] [${currentOrderNo}] 그리드 안정화 완료. (총 행: ${sheet.RowCount()})`);
                }

                // 3. '생산완료' 버튼 찾기
                findElement("#btnPdctFns", 10000, (button) => {
                    if (!button) {
                        logError("생산완료", "'생산완료(#btnPdctFns)' 버튼을 10초간 찾지 못함");
                        moveToNext(false);
                        return;
                    }
                    // 4. 버튼 클릭
                    console.log(`[LIMS Auto] [${currentOrderNo}] '생산완료' 버튼 찾음. 클릭 시도.`);
                    button.click();
                });

            } catch (error) {
                console.error(`[LIMS Auto] [${currentOrderNo}] 그리드 업데이트 대기 중 오류:`, error);
                logError("생산완료", `그리드 업데이트 대기 실패: ${error.message}`);
                moveToNext(false);
            }
        })();
    }

    /**
     * LIMS의 alert 및 confirm 창을 가로채서 자동 처리
     */
    function hookAlerts() {
        if (alertHookActive) return;
        alertHookActive = true;

        // Confirm 창은 항상 'true' (확인)
        unsafeWindow.confirm = function (message) {
            if (workerStopMonitor === null) return false; // 중지 요청 시 '취소'
            console.log(`[LIMS Auto] [${currentOrderNo}] [HOOK-CONFIRM] ${message}`);
            return true;
        };

        // Alert 창은 메시지 내용에 따라 분기 처리
        unsafeWindow.alert = function (message) {
            if (workerStopMonitor === null) return; // 중지 요청 시 알림 무시

            console.log(`[LIMS Auto] [${currentOrderNo}] [HOOK-ALERT] (${currentStep} 단계) ${message}`);

            // === '생산결정' 단계 알림 처리 ===
            if (currentStep === 'decision') {
                if (message.includes("저장되었습니다")) {
                    startCompleteStep(); // 성공 -> '생산완료' 단계로
                } else if (message.includes("초과")) {
                    const numbers = parseExcessNumbers(message);
                    const details = parseExcessDetails(message);  // 상세 정보 추출

                    // 🆕 areNumbersClose: 셋째자리까지 비교 (1.0008 vs 1 -> true)
                    if (numbers && areNumbersClose(numbers[0], numbers[1])) {
                        let detailMsg = `소수점 차이 확인필요: ${message}`;
                        if (details) {
                            // 🆕 사용자 요청 메시지 형식으로 변경
                            detailMsg = `[${details.itemCode}] ${details.itemName} ${details.expected} → ${details.actual} (소수 넷째 자리에서만 차이 납니다.)`;
                        } else {
                            detailMsg = `${message} (소수 넷째 자리에서만 차이 납니다.)`;
                        }

                        // 🛑 logWarning() 호출 안 함
                        // logWarning("생산결정", detailMsg);

                        // 🆕 대신 '성공' 메시지를 덮어쓸 준비
                        successMessageOverride = detailMsg;

                        startCompleteStep(); // 소수점 차이 -> '생산완료' 단계로
                    } else {
                        let detailMsg = `수량 중대 차이: ${message}`;
                        if (details) {
                            detailMsg = `[${details.itemCode}] ${details.itemName} 수량 중대 차이: ${details.expected} → ${details.actual}`;
                            if (!details.foundInGrid) {
                                detailMsg += " ⚠️ 그리드에서 품목명 찾지 못함";
                            }
                        }
                        logError("생산결정", detailMsg);
                        moveToNext(false); // 수량 차이 큼 -> 실패
                    }
                } else if (message.includes("생산 품목")) {
                    logWarning("생산결정", `확인필요: ${message}`);
                    startCompleteStep(); // 기타 확인필요 -> '생산완료' 단계로
                } else {
                    logError("생산결정", `예상치 못한 알림: ${message}`);
                    moveToNext(false); // 기타 -> 실패
                }

                // === '생산완료' 단계 알림 처리 ===
            } else if (currentStep === 'complete') {

                if (!waitingForSecondCompleteAlert) {
                    // --- 1차 알림 대기 중 ---
                    if (message.includes("정상적으로 처리되었습니다")) {
                        console.log(`[LIMS Auto] [${currentOrderNo}] 1차 완료 알림. 2차 알림 대기.`);
                        waitingForSecondCompleteAlert = true; // 2차 알림 대기 상태로 변경
                        return;
                    } else if (message.includes("최종생산완료 되었습니다")) {
                        // 🆕 Check for override
                        logSuccess(successMessageOverride || "최종 생산 완료되었습니다.");
                        successMessageOverride = null; // Reset
                        moveToNext(true); // 1차에 바로 완료
                    } else if (message.includes("이미 최종생산완료")) {
                        // 🆕 Check for override
                        logSuccess(successMessageOverride || "이미 최종생산완료된 항목입니다.");
                        successMessageOverride = null; // Reset
                        moveToNext(true); // 이미 완료됨
                    } else {
                        logError("생산완료", `1차 알림 오류: ${message}`);
                        moveToNext(false); // 1차 알림이 '정상'이 아님
                    }

                } else {
                    // --- 2차 알림 대기 중 ---
                    if (message.includes("ERP연동 되지 않은")) {
                        logError("생산완료", `ERP 미연동 오류: ${message}`);
                        moveToNext(false); // 실패
                    } else if (message.includes("최종생산완료 되었습니다")) {
                        // 🆕 Check for override
                        logSuccess(successMessageOverride || "최종 생산 완료되었습니다.");
                        successMessageOverride = null; // Reset
                        moveToNext(true); // 2차에서 완료 (성공)
                    } else if (message.includes("ERP연동")) {
                        // 🆕 Check for override
                        logSuccess(successMessageOverride || "ERP 연동 완료 (생산 완료 처리됨).");
                        successMessageOverride = null; // Reset
                        moveToNext(true); // 2차에서 완료 (성공)
                    } else {
                        logError("생산완료", `2차 알림 오류: ${message}`);
                        moveToNext(false); // 2차 알림이 예상과 다름
                    }
                }
            }
        };
    }

    /**
     * 가로챈 alert/confirm을 원래대로 복구
     */
    function unhookAlerts() {
        if (!alertHookActive) return;
        unsafeWindow.alert = originalAlert;
        unsafeWindow.confirm = originalConfirm;
        alertHookActive = false;
    }

    /**
     * 현재 작업을 완료하고, 다음 작업으로 이동하거나 탭을 닫음
     */
    function moveToNext(isSuccessOrWarning) {
        stopWorkerMonitor(); // '중지' 모니터 중지
        unhookAlerts(); // 알림창 복구

        let queue;

        try {
            queue = JSON.parse(localStorage.getItem('limsAutomationQueue') || '[]');
        } catch (e) {
            console.error("[LIMS Auto] 큐 파싱 오류!", e);
            logError("시스템", "치명적 오류: 작업 큐(JSON) 파싱 실패. 중단합니다.");
            localStorage.setItem('limsAutomationStatus', 'COMPLETED');
            window.close(); // 탭 닫기
            return;
        }

        if (queue.length === 0) {
            console.error("[LIMS Auto] 큐가 비어있으나 moveToNext가 호출됨.");
            localStorage.setItem('limsAutomationStatus', 'COMPLETED');
            window.close(); // 탭 닫기
            return;
        }

        // 현재 작업을 큐에서 제거
        if (queue[0] === currentOrderNo) {
            queue.shift();
        } else {
            // 방어 코드: 큐가 꼬였을 경우, 현재 주문번호를 필터링
            console.warn(`[LIMS Auto] 현재 주문(${currentOrderNo})이 큐의 첫 번째(${queue[0]})와 다릅니다. 필터링을 시도합니다.`);
            queue = queue.filter(ord => ord !== currentOrderNo);
        }

        localStorage.setItem('limsAutomationQueue', JSON.stringify(queue));

        // 🆕 큐에서 제거한 후 진행 상황 업데이트
        updateProgress();

        // 남은 작업이 있으면 다음 작업으로 페이지 이동
        if (queue.length > 0) {
            const nextOrder = queue[0];
            console.log(`[LIMS Auto] 다음 작업으로 이동: ${nextOrder}`);
            const nextUrl = `${detailPageURL}?ordNo=${nextOrder}#tab12`;
            window.location.href = nextUrl;
        } else {
            // 모든 작업 완료
            console.log("[LIMS Auto] 모든 작업 완료. 'COMPLETED' 상태 저장 후 탭을 닫습니다.");
            localStorage.setItem('limsAutomationStatus', 'COMPLETED');
            window.close(); // 탭 닫기
        }
    }

    // --- SCRIPT 2: 진행 상황 업데이트 ---
    /**
     * 진행 상황을 localStorage에 업데이트
     */
    function updateProgress() {
        const totalQueue = JSON.parse(localStorage.getItem('limsAutomationTotalQueue') || '[]');
        const currentQueue = JSON.parse(localStorage.getItem('limsAutomationQueue') || '[]');
        const total = totalQueue.length;
        const remaining = currentQueue.length;
        const completed = total - remaining;

        // 다음 작업 주문번호 (남은 큐의 첫 번째, 없으면 현재 주문)
        const nextOrder = currentQueue.length > 0 ? currentQueue[0] : currentOrderNo;

        localStorage.setItem('limsAutomationProgress', JSON.stringify({
            total: total,
            completed: completed,
            remaining: remaining,
            currentOrder: nextOrder,
            timestamp: Date.now()
        }));
    }

    // --- SCRIPT 2: 로깅 헬퍼 ---
    function logSuccess(message) {
        appendLogToStorage('limsAutomationSuccesses', currentOrderNo, message);
    }
    function logWarning(step, message) {
        appendLogToStorage('limsAutomationWarnings', currentOrderNo, `[${step}] ${message}`);
    }
    function logError(step, message) {
        appendLogToStorage('limsAutomationErrors', currentOrderNo, `[${step}] ${message}`);
    }

    // --- SCRIPT 2: 유틸리티 헬퍼 ---
    // "초과" 알림에서 숫자 2개 파싱
    function parseExcessNumbers(text) {
        const matches = text.match(/([\d\.]+)/g);
        if (matches && matches.length >= 2) {
            const N = matches.length;
            return [parseFloat(matches[N - 2]), parseFloat(matches[N - 1])];
        }
        return null;
    }
    // 소수점 셋째자리까지 비교 (넷째자리 차이는 무시)
    function areNumbersClose(num1, num2, precision = 3) {
        if (isNaN(num1) || isNaN(num2)) return false;
        const factor = Math.pow(10, precision);
        // 셋째자리까지만 비교 (넷째자리부터 버림)
        const truncated1 = Math.trunc(num1 * factor);
        const truncated2 = Math.trunc(num2 * factor);
        return truncated1 === truncated2;
    }
    // 그리드 RowCount 안정화 대기 (증가 감지 후 안정화)
    function waitForRowCountStable(sheet, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = 500; // 0.5초마다 체크
            const stableCount = 3; // 연속 3번 같은 값이면 안정화
            const minWaitTime = 5000; // 최소 5초 대기 (샘플이 많을 때 로딩 시간 확보)
            const zeroStableCount = 8; // 최소 대기 후 연속 8회 0이면 빈 그리드로 판단

            let previousCount = -1;
            let stableCounter = 0;
            let hasIncreased = false; // 값이 한 번이라도 증가했는지

            const checkStability = () => {
                if (workerStopMonitor === null) {
                    reject(new Error("작업이 중지되었습니다."));
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`RowCount 안정화 대기 시간 초과 (${timeout}ms)`));
                    return;
                }

                const currentCount = sheet.RowCount();
                const elapsedTime = Date.now() - startTime;
                console.log(`[LIMS Auto] RowCount 체크: ${currentCount} (이전: ${previousCount}, 증가감지: ${hasIncreased}, 안정: ${stableCounter}/${stableCount}, 경과: ${elapsedTime}ms)`);

                // 값이 증가했는지 확인
                if (previousCount >= 0 && currentCount > previousCount) {
                    hasIncreased = true;
                    console.log(`[LIMS Auto] RowCount 증가 감지: ${previousCount} → ${currentCount}`);
                }

                // 값이 동일한지 확인
                if (currentCount === previousCount) {
                    stableCounter++;
                } else {
                    stableCounter = 1; // 값이 바뀌면 카운터 리셋
                }

                previousCount = currentCount;

                // 안정화 조건 1: 값이 증가한 적이 있고, 연속 3번 같은 값
                if (hasIncreased && stableCounter >= stableCount) {
                    console.log(`[LIMS Auto] RowCount 안정화 완료: ${currentCount}개 (증가 후 ${stableCount}회 연속 동일)`);
                    resolve(currentCount);
                    return;
                }

                // 안정화 조건 2: 값이 증가하지 않은 채 0이 아닌 값으로 안정화된 경우도 허용
                // (생산결정 직후 이미 그리드가 준비되어 있는 경우)
                if (!hasIncreased && currentCount > 0 && stableCounter >= stableCount) {
                    console.log(`[LIMS Auto] RowCount 안정화 완료 (초기값): ${currentCount}개`);
                    resolve(currentCount);
                    return;
                }

                // 안정화 조건 3: RowCount가 0이면서, 최소 대기 시간 경과 후 연속 5회 0
                // (빈 그리드인 경우, 샘플 로딩 시간을 충분히 기다린 후 판단)
                if (currentCount === 0 && elapsedTime >= minWaitTime && stableCounter >= zeroStableCount) {
                    console.log(`[LIMS Auto] RowCount가 0으로 안정화됨 (최소 ${minWaitTime}ms 대기 후 ${zeroStableCount}회 연속 0). 빈 그리드로 간주하고 진행합니다.`);
                    resolve(0);
                    return;
                }

                setTimeout(checkStability, checkInterval);
            };

            checkStability();
        });
    }
    // 그리드(IBSheet) 로딩 대기
    function pollForGridReady(callback, timeout = 30000, interval = 500) {
        const startTime = Date.now();
        (function poll() {
            if (workerStopMonitor === null) { // '중지' 감지
                console.log("[LIMS Auto] (pollForGridReady) '중지' 감지됨. 그리드 대기 중단.");
                callback(false);
                return;
            }
            if (unsafeWindow.prdctnDecsnSheet && typeof unsafeWindow.prdctnDecsnSheet.GetTotalRows === 'function') {
                if (unsafeWindow.prdctnDecsnSheet.GetTotalRows() > -1) {
                    callback(true);
                    return;
                }
            }
            if (Date.now() - startTime > timeout) {
                callback(false);
                return;
            }
            setTimeout(poll, interval);
        })();
    }
    // Element 로딩 대기
    function findElement(selector, timeout, callback) {
        const startTime = Date.now();
        (function poll() {
            if (workerStopMonitor === null) { // '중지' 감지
                console.log("[LIMS Auto] (findElement) '중지' 감지됨. Element 찾기 중단.");
                callback(null);
                return;
            }
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }
            if (Date.now() - startTime > timeout) {
                callback(null);
                return;
            }
            setTimeout(poll, 250);
        })();
    }


    // ==================================================================
    // --- SCRIPT 1: 관제탑 (목록) 페이지 함수 정의 ---
    // ==================================================================
    let workWindow, monitorInterval, checkStatusPollCount;
    let modal, stopButton, batchStartButton, orderListText;
    let originalTitle, titleBlinkInterval;
    let controlTowerTabId; // 🆕 현재 탭의 고유 ID
    let progressUpdateInterval; // 🆕 진행 상황 업데이트 인터벌
    let progressDisplay; // 🆕 진행 상황 표시 엘리먼트
    const MAX_POLL_COUNT = 15; // 15초

    /**
     * SCRIPT 1 (관제탑 탭)의 메인 함수.
     * 탭 이름 리셋, UI 생성, 작업 상태 확인을 수행.
     */
    function initControlTower(searchButton) {
        console.log(`[LIMS Auto] 관제탑(목록) 페이지 스크립트 v1.1 실행.`);

        // 🆕 현재 탭의 고유 ID 생성
        controlTowerTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`[LIMS Auto] 현재 탭 ID: ${controlTowerTabId}`);

        // '작업 탭'에서 복귀한 경우, 탭 이름을 리셋
        if (window.name === '_lims_work_tab') {
            console.log("[LIMS Auto] '작업 탭'에서 복귀한 것을 감지. 이 탭의 이름을 리셋합니다.");
            window.name = `_lims_start_tab_${Date.now()}`;
        }

        checkStatusPollCount = 0;
        originalTitle = document.title;

        createAutomationUI(searchButton); // UI 생성
        checkBatchStatus(); // 페이지 로드 시, 이전 작업 상태 확인
    }

    // 간단한 복사 메시지 생성 함수
    function createSimpleMessage(orderNo, fullMessage) {
        // 생산결정 관련 메시지
        if (fullMessage.includes('[생산결정]')) {
            // 품목명 추출
            const itemNameMatch = fullMessage.match(/\] ([^:]+):/);
            const itemName = itemNameMatch ? itemNameMatch[1].trim() : '';

            if (fullMessage.includes('수량 중대 차이') || fullMessage.includes('소수점')) {
                return `${orderNo}, ${itemName}, 수량 초과입니다.`;
            } else if (fullMessage.includes('생산 품목')) {
                return `${orderNo}, 생산 품목 0이라 생산 불가능합니다.`;
            } else {
                return `${orderNo}, 생산결정 문제가 있습니다.`;
            }
        }

        // 생산완료 관련 메시지
        if (fullMessage.includes('[생산완료]')) {
            if (fullMessage.includes('ERP')) {
                return `${orderNo}, ERP 연동 문제가 있습니다.`;
            } else if (fullMessage.includes('생산 품목')) {
                return `${orderNo}, 생산 품목 0이라 생산 불가능합니다.`;
            } else {
                return `${orderNo}, 생산완료 문제가 있습니다.`;
            }
        }

        // 시스템 오류
        if (fullMessage.includes('시스템')) {
            return `${orderNo}, 시스템 오류가 발생했습니다.`;
        }

        return `${orderNo}, 문제가 있습니다.`;
    }

    /**
     * 버튼, 모달, 스타일 등 UI 생성
     */
    function createAutomationUI(searchButton) {
        console.log("[LIMS Auto] 'Search' 버튼 찾음. UI를 삽입합니다.");

        // 1. 스타일 주입
        const styles = `
            #limsBatchModal { display: none; position: fixed; z-index: 9998; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); }
            .lims-modal-content { background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 600px; border-radius: 8px; }
            #limsBatchClose { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
            #limsUpdateHistoryLink { font-size: 12px; color: #007bff; text-decoration: underline; cursor: pointer; }
            #limsReportSection { display: none; margin-top: 20px; }
            .lims-report-div { width: 95%; height: 80px; padding: 5px; font-family: monospace; resize: vertical; overflow-y: auto; border-width: 2px; border-style: solid; }
            .lims-report-div div { margin-bottom: 2px; }
            /* 🆕 복사 버튼 스타일 수정 */
            .lims-copy-btn { margin-right: 8px; padding: 2px 6px; font-size: 11px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; vertical-align: middle; }
            .lims-copy-btn:hover { background-color: #0056b3; }
            .lims-copy-btn:active { background-color: #004085; }
            .gm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; display: none; justify-content: center; align-items: center; }
            .gm-modal-content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999; min-width: 500px; max-width: 90%; }
            .gm-modal-header { font-size: 20px; font-weight: bold; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .gm-modal-close { cursor: pointer; font-size: 24px; font-weight: bold; }
            .gm-modal-body { max-height: 60vh; overflow-y: auto; }
        `;
        document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

        // 2. '자동 생산 실행' 버튼
        const batchButton = document.createElement('button');
        batchButton.id = 'btnBatchAutomationStart';
        batchButton.innerHTML = '⚙️ 자동 생산 실행';
        batchButton.className = 'btn_search'; // LIMS 네이티브 스타일
        batchButton.style.cssText = "background-color: #FFEB3B; color: #333; margin-left: 10px; font-weight: bold; width: auto; padding: 0 10px; white-space: nowrap;";
        searchButton.insertAdjacentElement('afterend', batchButton);

        // 3. '작업 중지' 버튼
        const stopBtn = document.createElement('button');
        stopBtn.id = 'btnBatchAutomationStop';
        stopBtn.innerHTML = '🛑 작업 중지';
        stopBtn.className = 'btn_search'; // LIMS 네이티브 스타일
        stopBtn.style.cssText = "background-color: #d9534f; color: white; margin-left: 10px; font-weight: bold; width: auto; padding: 0 10px; white-space: nowrap; display: none;";
        batchButton.insertAdjacentElement('afterend', stopBtn);

        // 🆕 3.5. '생산 비상 정지' 버튼
        const forceResetButton = document.createElement('button');
        forceResetButton.id = 'btnForceReset';
        forceResetButton.innerHTML = ' 생산 비상 정지';
        forceResetButton.className = 'btn_search';
        forceResetButton.style.cssText = "background-color: #607D8B; color: white; margin-left: 5px; font-weight: bold; width: auto; padding: 0 10px; white-space: nowrap;";
        batchButton.insertAdjacentElement('afterend', forceResetButton);

        stopButton = stopBtn;
        stopButton.onclick = stopWork;

        // 🆕 4. 진행 상황 표시 영역
        const progressDiv = document.createElement('div');
        progressDiv.id = 'limsProgressDisplay';
        progressDiv.style.cssText = "display: none; margin-left: 10px; padding: 5px 12px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 4px; font-weight: bold; color: #1976D2; vertical-align: middle; white-space: nowrap;";
        stopBtn.insertAdjacentElement('afterend', progressDiv);

        progressDisplay = progressDiv;

        // 4. 메인 모달 HTML
        // 🆕 v1.2 -> v1.0, 업데이트 내역 수정
        const modalHTML = `
            <div id="limsBatchModal">
                <div class="lims-modal-content">
                    <span id="limsBatchClose">&times;</span>
                    <h2 id="limsModalTitle" style="display: inline-block; margin-right: 10px;">LIMS 생산 자동화</h2>
                    <a id="limsUpdateHistoryLink">업데이트 내역 (v1.4.1)</a>
                    <p id="limsModalInstructions" style="margin-top: 15px;">처리할 주문번호(Ord. #) 목록을 한 줄에 하나씩 붙여넣으세요.<br><small style="color: #666;">※ 생산결정 → 생산완료까지 자동으로 연속 처리됩니다.</small></p>
                    <textarea id="limsOrderList" style="width: 95%; height: 100px; border: 1px solid #ccc; padding: 5px; font-family: monospace;"></textarea>

                    <div id="limsReportSection">
                        <h4 style="margin-bottom: 10px;">상세 보고서</h4>
                        <p><b>🟢 성공</b> (<span id="limsSuccessCount">0</span>건)</p>
                        <div id="limsSuccessList" class="lims-report-div" style="border-color: #5cb85c; background: #f0fff0;"></div>
                        <p style="margin-top: 15px;">
                            <b>🟠 생산결정 문제 (확인필요)</b> (<span id="limsWarningCount">0</span>건)
                            <button id="limsCopyWarningOrders" class="lims-copy-btn" style="margin-left: 10px; padding: 4px 8px; font-size: 12px;">📋 수주번호 복사</button>
                        </p>
                        <div id="limsWarningList" class="lims-report-div" style="border-color: #f0ad4e; background: #fff9f0;"></div>
                        <p style="margin-top: 15px;">
                            <b>❌ 생산완료 문제 (실패)</b> (<span id="limsErrorCount">0</span>건)
                            <button id="limsCopyErrorOrders" class="lims-copy-btn" style="margin-left: 10px; padding: 4px 8px; font-size: 12px;">📋 수주번호 복사</button>
                        </p>
                        <div id="limsErrorList" class="lims-report-div" style="border-color: #d9534f; background: #fff0f0;"></div>
                    </div>

                    <!-- 🆕 비상 정지 확인 섹션 -->
                    <div id="limsForceResetSection" style="display: none; text-align: center;">
                        <h3 style="color: #d9534f;">정말로 생산을 비상 정지하시겠습니까?</h3>
                        <p>진행 중인 모든 작업이 즉시 중단되고, 스크립트 상태가 초기화됩니다.<br>스크립트가 멈추거나 정상적으로 종료되지 않을 때 사용하세요.</p>
                        <button id="limsConfirmForceReset" class="btn_search" style="background-color: #d9534f; color: white; width: auto; padding: 0 12px;">네, 비상 정지합니다.</button>
                        <button id="limsCancelForceReset" class="btn_search" style="width: auto; padding: 0 12px;">아니요, 취소합니다.</button>
                    </div>

                    <hr style="margin-top: 20px; margin-bottom: 20px;">
                    <button id="limsBatchStart" class="btn_search" style="background-color: #4CAF50; width: auto; padding: 0 12px; white-space: nowrap;">[생산결정 → 생산완료] 시작</button>
                </div>
            </div>

            <!-- 업데이트 내역 모달 -->
            <div id="gmUpdateModal" class="gm-modal-overlay" style="display: none; z-index: 9999;">
                <div class="gm-modal-content" style="min-width: 500px; margin: 15% auto;">
                    <div class="gm-modal-header">
                        <span>업데이트 내역 (v1.4.1)</span>
                        <span id="gmCloseUpdateModal" class="gm-modal-close">&times;</span>
                    </div>
                    <div class="gm-modal-body">
                        <p><b>v1.4.1 (2026-01-16) - 결과 로그 자동 다운로드 추가</b></p>
                        <ul>
                            <li><b>[신규]</b> 생산 결과 로그 자동 다운로드: 작업이 완료되거나 중지될 때, 상세 내역이 담긴 .txt 파일을 자동으로 저장합니다.</li>
                        </ul>
                        <p><b>v1.4 (2025-01-12) - 비상 정지 기능 추가</b></p>
                        <ul>
                            <li><b>[신규]</b> '🚨 생산 비상 정지' 버튼 추가: 스크립트가 멈추거나 오작동할 때 모든 상태를 강제로 초기화합니다.</li>
                            <li><b>[개선]</b> '작업 중지' 기능 안정성 향상: 중지 버튼 클릭 후 3초간 응답이 없으면 강제로 상태를 변경합니다.</li>
                        </ul>
                        <p><b>v1.3 (2025-01-10) - 완료 수주 감지 및 진행 상황 개선</b></p>
                        <ul>
                            <li><b>[신규]</b> 이미 생산완료된 수주 조기 감지 및 자동 스킵 (성공 처리)</li>
                            <li><b>[개선]</b> 진행 상황 표시 정확도 향상 (완료 카운트 및 현재 주문번호)</li>
                            <li><b>[개선]</b> 그리드 RowCount 안정화 대기 타임아웃 60초 → 120초로 증가</li>
                            <li><b>[개선]</b> 빈 그리드 판단 시간 개선 (최소 대기 5초, 연속 8회 확인)</li>
                        </ul>
                        <p><b>v1.2 (2025-01-10) - 안정화 대기 시간 개선</b></p>
                        <ul>
                            <li><b>[개선]</b> 그리드 RowCount 안정화 대기 타임아웃 증가</li>
                            <li><b>[개선]</b> 빈 그리드 판단 로직 개선</li>
                        </ul>
                        <p><b>v1.1 (2025-01-07) - 진행 상황 표시 추가</b></p>
                        <ul>
                            <li><b>[신규]</b> 관제탑 페이지에 실시간 진행 상황 표시 추가 (예: 📊 진행: 3/10)</li>
                            <li><b>[신규]</b> 여러 창을 열어도 모든 관제탑 창에서 진행 상황 동기화</li>
                            <li><b>[개선]</b> 0.5초마다 자동으로 진행 상황 업데이트</li>
                        </ul>
                        <p><b>v1.0 (2025-01-05) - 정식 릴리즈</b></p>
                        <ul>
                            <li><b>[핵심]</b> '생산결정' → '생산완료' 연속 자동화</li>
                            <li><b>[핵심]</b> '시작 탭'과 '작업 탭' 분리, localStorage를 통한 실시간 통신</li>
                            <li><b>[편의]</b> '수량 초과' 알림 발생 시, 소수점 셋째자리까지 동일하면 '확인필요'로 처리</li>
                            <li><b>[편의]</b> '수량 초과' 알림 발생 시 그리드에서 품목 정보(품목명 등) 자동 추출</li>
                            <li><b>[편의]</b> 완료 보고서에 '메신저 공유용 복사' 버튼 추가</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 5. 이벤트 리스너 바인딩
        modal = document.getElementById('limsBatchModal');
        batchStartButton = document.getElementById('limsBatchStart');
        orderListText = document.getElementById('limsOrderList');

        document.getElementById('limsBatchClose').onclick = () => { modal.style.display = 'none'; };
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
            if (event.target == document.getElementById('gmUpdateModal')) document.getElementById('gmUpdateModal').style.display = 'none';
        };

        batchButton.onclick = function () {
            resetUI(true); // UI를 '시작' 상태로 초기화
            modal.style.display = 'block';
            orderListText.focus();
        };

        // 🆕 '생산 비상 정지' 버튼 클릭 이벤트
        forceResetButton.onclick = function () {
            resetUI(false);
            document.getElementById('limsModalTitle').innerHTML = '생산 비상 정지';
            document.getElementById('limsModalInstructions').style.display = 'none';
            document.getElementById('limsOrderList').style.display = 'none';
            document.getElementById('limsReportSection').style.display = 'none';
            document.getElementById('limsBatchStart').style.display = 'none';
            document.getElementById('limsForceResetSection').style.display = 'block';
            modal.style.display = 'block';
        };
        document.getElementById('limsConfirmForceReset').onclick = emergencyStop;
        document.getElementById('limsCancelForceReset').onclick = () => { modal.style.display = 'none'; };

        batchStartButton.onclick = startBatch; // '시작' 버튼에 기능 연결

        document.getElementById('limsUpdateHistoryLink').onclick = () => { document.getElementById('gmUpdateModal').style.display = 'flex'; };
        document.getElementById('gmCloseUpdateModal').onclick = () => { document.getElementById('gmUpdateModal').style.display = 'none'; };

        // 페이지 로드 시, 'RUNNING' 상태가 남아있으면 '중지' 버튼 활성화
        // 🆕 단, 시작 탭인 경우에만 모니터링 시작
        if (localStorage.getItem('limsAutomationStatus') === 'RUNNING') {
            const startTabId = localStorage.getItem('limsAutomationStartTabId');
            const isStartTab = (startTabId === controlTowerTabId);

            stopButton.style.display = 'inline-block';
            batchButton.disabled = true;
            batchButton.style.opacity = "0.5";

            // 🆕 진행 상황 표시 시작 (모든 탭에서)
            startProgressDisplay();

            // 🆕 시작 탭인 경우에만 모니터링 시작
            if (isStartTab) {
                console.log("[LIMS Auto] 시작 탭에서 작업 재개. 모니터링을 시작합니다.");
                monitorInterval = setInterval(monitorWorkWindow, 1000);
            } else {
                console.log("[LIMS Auto] 시작 탭이 아니므로 모니터링하지 않습니다.");
            }
        }
    }

    /**
     * '자동 생산 실행' 버튼 클릭 시 호출
     */
    function startBatch() {
        const orders = orderListText.value.split('\n').map(o => o.trim()).filter(o => o.length > 0);
        if (orders.length === 0) {
            alert('처리할 주문번호가 없습니다.');
            return;
        }

        if (!confirm(`${orders.length}개의 주문에 대해 [생산결정 → 생산완료] 작업을 시작하시겠습니까?\n\n※ 생산결정 성공/확인필요 시 자동으로 생산완료까지 진행합니다.`)) {
            return;
        }

        console.log(`[LIMS Auto] 작업 시작. 총 ${orders.length}건`);

        clearLocalStorage(); // 스토리지 초기화
        localStorage.setItem('limsAutomationStatus', 'RUNNING');
        localStorage.setItem('limsAutomationQueue', JSON.stringify(orders));
        localStorage.setItem('limsAutomationTotalQueue', JSON.stringify(orders)); // 🆕 전체 큐 저장 (진행 상황 추적용)
        localStorage.setItem('limsAutomationStopRequested', 'false');
        localStorage.setItem('limsAutomationStartTabId', controlTowerTabId); // 🆕 시작 탭 ID 저장

        // 🆕 초기 진행 상황 저장
        localStorage.setItem('limsAutomationProgress', JSON.stringify({
            total: orders.length,
            completed: 0,
            remaining: orders.length,
            currentOrder: orders[0],
            timestamp: Date.now()
        }));

        modal.style.display = 'none';
        document.getElementById("btnBatchAutomationStart").disabled = true;
        document.getElementById("btnBatchAutomationStart").style.opacity = "0.5";
        stopButton.style.display = "inline-block";

        const firstOrder = orders[0];
        const workUrl = `${detailPageURL}?ordNo=${firstOrder}#tab12`;
        workWindow = window.open(workUrl, '_lims_work_tab'); // '작업 탭' 열기

        if (!workWindow) {
            alert("팝업 차단을 해제해주세요.");
            resetUI(false);
            return;
        }
        workWindow.focus();

        // '작업 탭' 감시 시작
        if (monitorInterval) clearInterval(monitorInterval);
        monitorInterval = setInterval(monitorWorkWindow, 1000);

        // 🆕 진행 상황 표시 시작
        startProgressDisplay();
    }

    /**
     * 🆕 진행 상황 표시 시작
     */
    function startProgressDisplay() {
        if (progressDisplay) {
            progressDisplay.style.display = 'inline-block';
            updateProgressDisplay(); // 즉시 업데이트
        }

        // 0.5초마다 진행 상황 업데이트
        if (progressUpdateInterval) clearInterval(progressUpdateInterval);
        progressUpdateInterval = setInterval(updateProgressDisplay, 500);
    }

    /**
     * 🆕 진행 상황 표시 중지
     */
    function stopProgressDisplay() {
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }
        if (progressDisplay) {
            progressDisplay.style.display = 'none';
        }
    }

    /**
     * 🆕 진행 상황 UI 업데이트
     */
    function updateProgressDisplay() {
        if (!progressDisplay) return;

        try {
            const progressData = JSON.parse(localStorage.getItem('limsAutomationProgress') || 'null');
            if (!progressData) {
                progressDisplay.style.display = 'none';
                return;
            }

            const { total, completed, currentOrder } = progressData;
            progressDisplay.innerHTML = `📊 진행: ${completed + 1}/${total} (현재: ${currentOrder})`;
            progressDisplay.style.display = 'inline-block';
        } catch (e) {
            console.error('[LIMS Auto] 진행 상황 표시 오류:', e);
        }
    }

    /**
     * 🆕 [신규] 비상 정지 함수 (모든 상태 초기화)
     */
    function emergencyStop() {
        if (confirm('정말로 모든 작업 상태를 초기화하고 비상 정지하시겠습니까?')) {
            console.warn('[LIMS Auto] 사용자가 비상 정지를 실행했습니다.');
            // 모든 관련 localStorage 키 삭제
            Object.keys(localStorage).filter(key => key.startsWith('limsAutomation')).forEach(key => localStorage.removeItem(key));
            alert('비상 정지가 완료되었습니다. 모든 작업 상태가 초기화되었으며, 페이지를 새로고침합니다.');
            // UI를 완전히 리셋하기 위해 페이지 새로고침
            window.location.reload();
        }
    }

    /**
     * '작업 중지' 버튼 클릭 시 호출
     */
    function stopWork() {
        if (confirm('작업을 중지하시겠습니까?\n\n' +
            '현재 진행 중인 주문이 1개라도 있을 경우,\n' +
            '해당 주문은 [시스템: 사용자 요청으로 중지됨]으로 기록됩니다.')) {
            console.log('[LIMS Auto] 사용자가 작업 중지를 요청했습니다.');
            localStorage.setItem('limsAutomationStopRequested', 'true');
            stopButton.disabled = true;
            stopButton.innerHTML = '🛑 중지 중...';

            // 🆕 안정성을 위해 3초 후 상태를 강제로 STOPPED로 변경하는 타이머 설정
            // 작업 탭이 응답하지 않는 경우를 대비한 안전장치
            setTimeout(forceStopState, 3000);

            // 🆕 새 탭에서 중지를 눌렀을 때도 상태 변화를 감지하도록
            const startTabId = localStorage.getItem('limsAutomationStartTabId');
            const isStartTab = (startTabId === controlTowerTabId);
            if (!isStartTab) {
                console.log('[LIMS Auto] (새 탭) 중지 요청 후 상태 변화 감지를 시작합니다.');
                setTimeout(checkBatchStatus, 1000);
            }
        }
    }

    /**
     * 🆕 [신규] 지정 시간 후에도 상태가 RUNNING이면 강제로 STOPPED로 변경
     */
    function forceStopState() {
        const currentStatus = localStorage.getItem('limsAutomationStatus');
        if (currentStatus === 'RUNNING') {
            console.warn('[LIMS Auto] 중지 요청 3초 후에도 상태가 RUNNING입니다. 상태를 강제로 STOPPED로 변경합니다.');
            localStorage.setItem('limsAutomationStatus', 'STOPPED');
            // 상태 변화를 감지하도록 checkBatchStatus 호출
            checkBatchStatus();
        }
    }

    /**
     * '작업 탭'이 닫혔는지, 또는 작업이 완료/중지되었는지 1초마다 감시
     */
    function monitorWorkWindow() {
        const currentStatus = localStorage.getItem('limsAutomationStatus');

        if (currentStatus !== 'RUNNING') {
            // 'COMPLETED' 또는 'STOPPED' 상태 감지 (정상 종료)
            console.log(`[LIMS Auto] 원본 탭: 작업 완료/중지 상태 감지 (${currentStatus}). 모니터링 중지 및 보고서 생성.`);
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null;
            }
            stopProgressDisplay(); // 🆕 진행 상황 표시 중지
            checkBatchStatus(); // '시작 탭'이 보고서 생성
            return;
        }

        if ((!workWindow || workWindow.closed) && currentStatus === 'RUNNING') {
            // '작업 탭'이 수동으로 닫힌 경우 (비정상 종료)
            console.log("[LIMS Auto] 원본 탭: 작업 탭이 닫힌 것을 감지했습니다 (수동 닫힘 추정).");
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null; // 모니터 중지
            }
            stopProgressDisplay(); // 🆕 진행 상황 표시 중지

            console.log("[LIMS Auto] '작업 탭'이 닫혔으므로, 상태를 'STOPPED'로 강제 변경하고 즉시 보고서를 생성합니다.");
            localStorage.setItem('limsAutomationStatus', 'STOPPED'); // 상태 강제 변경
            appendLogToStorage('limsAutomationErrors', '시스템', `작업 탭이 수동으로 닫혔거나 예기치 않게 종료되었습니다.`);
            checkBatchStatus(); // 즉시 보고서 생성
        }
    }

    /**
     * 페이지 로드 시, 또는 작업 완료/중지 시 호출되어 상태를 확인하고 보고서를 띄움
     */
    function checkBatchStatus() {
        const status = localStorage.getItem('limsAutomationStatus');
        const startTabId = localStorage.getItem('limsAutomationStartTabId'); // 🆕 시작 탭 ID 조회
        const isStartTab = (startTabId === controlTowerTabId); // 🆕 현재 탭이 시작 탭인지 확인

        console.log(`[LIMS Auto] checkBatchStatus 실행. (시도: ${checkStatusPollCount + 1}/${MAX_POLL_COUNT}) 현재 상태: ${status}, 시작탭여부: ${isStartTab}`);

        // 🆕 시작 탭이 아닌 경우
        if (!isStartTab) {
            if (status === 'RUNNING') {
                // RUNNING 상태: UI 조정 + 상태 변화 감지 시작
                console.log(`[LIMS Auto] 현재 탭은 시작 탭이 아닙니다. 작업 중 UI 표시 및 상태 변화 감지를 시작합니다.`);
                stopButton.style.display = "inline-block";
                document.getElementById("btnBatchAutomationStart").disabled = true;
                document.getElementById("btnBatchAutomationStart").style.opacity = "0.5";

                // 🆕 진행 상황 표시 시작 (새 탭에서도)
                startProgressDisplay();

                // 1초마다 상태 변화 감지
                setTimeout(checkBatchStatus, 1000);
                return;
            } else if (status === 'STOPPED' || status === 'COMPLETED') {
                // 작업 완료/중지: 알림만 표시 (보고서는 시작 탭에서만)
                console.log(`[LIMS Auto] (새 탭) 작업이 ${status === 'STOPPED' ? '중지' : '완료'}되었습니다.`);
                stopProgressDisplay(); // 🆕 진행 상황 표시 중지
                const statusText = status === 'STOPPED' ? '중지' : '완료';
                alert(`작업이 ${statusText}되었습니다.\n\n결과는 원래 탭에서 확인하세요.`);
                resetUI(false);
                return;
            } else {
                // null 등: UI 리셋
                stopProgressDisplay(); // 🆕 진행 상황 표시 중지
                resetUI(false);
                return;
            }
        }

        // 모니터가 없는 상태(페이지 새로고침 등)에서 'RUNNING'이 감지되면 15초간 폴링
        if (!monitorInterval) {
            if (status === 'RUNNING') {
                if (checkStatusPollCount < MAX_POLL_COUNT) {
                    checkStatusPollCount++;
                    console.log(`[LIMS Auto] 상태가 RUNNING입니다 (폴링). 1초 후 다시 확인합니다.`);
                    setTimeout(checkBatchStatus, 1000);
                } else {
                    // 15초 타임아웃
                    console.warn(`[LIMS Auto] ${MAX_POLL_COUNT}초간 폴링했지만 'COMPLETED'를 감지 못함. 강제 중지로 처리합니다.`);
                    localStorage.setItem('limsAutomationStatus', 'STOPPED');
                    appendLogToStorage('limsAutomationErrors', '시스템', `작업 탭이 닫혔으나 ${MAX_POLL_COUNT}초간 응답이 없어 강제 중지 처리됨.`);
                    checkBatchStatus(); // 'STOPPED'로 다시 호출
                }
                return;
            }
        } else {
            // 모니터가 살아있는 경우 (작업이 'RUNNING' 중)
            if (status === 'RUNNING') {
                return; // 정상. 모니터가 계속 돌도록 놔둠.
            }
        }

        // --- COMPLETED, STOPPED, 또는 null 상태 ---

        if (status === 'COMPLETED' || status === 'STOPPED') {
            // '시작 탭'이 보고서를 생성
            console.log(`[LIMS Auto] 최종 상태 감지: ${status}. 보고서를 생성합니다.`);

            const successes = getLogFromStorage('limsAutomationSuccesses');
            const warnings = getLogFromStorage('limsAutomationWarnings');
            const errors = getLogFromStorage('limsAutomationErrors');

            showReportModal(status, successes, warnings, errors);
            downloadLogFile(status, successes, warnings, errors); // 🆕 로그 파일 자동 다운로드
            notifyUser(status, successes, warnings, errors);
            resetUI(false);
            clearLocalStorage(); // '시작 탭'이 스토리지 정리
        } else if (status === null) {
            // '작업 탭'이 이미 정리했거나, 원래 상태가 없던 경우
            console.log("[LIMS Auto] checkBatchStatus: 상태가 'null'입니다. UI를 리셋합니다.");
            resetUI(false);
            return;
        }
    }

    /**
     * 클립보드 복사 유틸리티 함수
     */
    function copyToClipboard(text, buttonElement) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
            const originalText = buttonElement.textContent;
            buttonElement.textContent = '✓ 복사됨';
            buttonElement.style.backgroundColor = '#28a745';
            setTimeout(() => {
                buttonElement.textContent = originalText;
                buttonElement.style.backgroundColor = '#007bff';
            }, 2000);
        } else {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = buttonElement.textContent;
                    buttonElement.textContent = '✓ 복사됨';
                    buttonElement.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                        buttonElement.style.backgroundColor = '#007bff';
                    }, 2000);
                }).catch(err => {
                    alert('복사 실패: ' + err);
                });
            } else {
                alert('클립보드 복사를 지원하지 않는 브라우저입니다.');
            }
        }
    }

    /**
     * 보고서 모달을 생성하고 표시
     */
    function showReportModal(status, successes, warnings, errors) {
        console.log('[LIMS Auto] 보고서 모달 생성');

        const titleText = (status === 'STOPPED') ? "작업 중지됨 (부분 보고서)" : "일괄 작업 완료";
        document.getElementById('limsModalTitle').innerHTML = titleText;

        // --- 보고서 분류 ---
        const decisionProblems = [...warnings]; // '생산결정' 경고
        const completeProblems = []; // '생산완료' 또는 '시스템' 오류

        errors.forEach(err => {
            if (err.message.includes('[생산결정]')) {
                decisionProblems.push(err);
            } else {
                completeProblems.push(err);
            }
        });

        document.getElementById("limsSuccessCount").innerText = successes.length;
        document.getElementById("limsWarningCount").innerText = decisionProblems.length;
        document.getElementById("limsErrorCount").innerText = completeProblems.length;

        // 🆕 복사 버튼 포함한 보고서 링크 생성 (버튼 위치 수정 + 조건부 표시)
        const createLinkHTML = (log, listType) => {
            const url = `${detailPageURL}?ordNo=${log.orderNo}#tab12`;
            const message = log.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            let displayMessage = `: ${message}`;
            let copyButtonHTML = '';

            if (listType === 'success') {
                if (message.includes("최종 생산 완료되었습니다.") || message.includes("이미 최종생산완료된 항목입니다.")) {
                    displayMessage = ''; // 1. Normal success: No message
                    // No copy button
                } else if (message.includes("소수 넷째 자리에서만 차이 납니다.")) {
                    displayMessage = `: ${message}`; // 2. Minor decimal: Show message
                    // No copy button
                } else {
                    // Other success? (e.g. ERP 연동) - 메시지는 표시, 복사 버튼 없음
                    displayMessage = `: ${message}`;
                }
            } else {
                // All Warnings (Orange) and Errors (Red) get a copy button
                const simpleMsg = createSimpleMessage(log.orderNo, log.message);
                const copyBtnId = `copy_${log.orderNo}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                copyButtonHTML = `<button class="lims-copy-btn" id="${copyBtnId}" data-copy-text="${simpleMsg.replace(/"/g, '&quot;')}">📋</button>`;
            }

            return `<div>
                ${copyButtonHTML}
                <a href="${url}" target="_blank" style="color: #007bff; text-decoration: underline;">${log.orderNo}</a>
                ${displayMessage}
            </div>`;
        };

        const successListHTML = successes.map(log => createLinkHTML(log, 'success')).join('') || '(없음)';
        const warningListHTML = decisionProblems.map(log => createLinkHTML(log, 'warning')).join('') || '(없음)';
        const errorListHTML = completeProblems.map(log => createLinkHTML(log, 'error')).join('') || '(없음)';

        document.getElementById('limsSuccessList').innerHTML = successListHTML;
        document.getElementById('limsWarningList').innerHTML = warningListHTML;
        document.getElementById('limsErrorList').innerHTML = errorListHTML;

        // 복사 버튼에 이벤트 리스너 추가 (개별 항목 복사)
        document.querySelectorAll('.lims-copy-btn[data-copy-text]').forEach(btn => {
            btn.onclick = function (e) {
                e.preventDefault();
                const textToCopy = this.getAttribute('data-copy-text').replace(/&quot;/g, '"');

                // GM_setClipboard 사용
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(textToCopy);
                    const originalText = this.textContent; // '📋'
                    this.textContent = '✓ 복사됨';
                    this.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '#007bff';
                    }, 2000);
                } else {
                    // 대체 방법: navigator.clipboard API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            const originalText = this.textContent;
                            this.textContent = '✓ 복사됨';
                            this.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                this.textContent = originalText;
                                this.style.backgroundColor = '#007bff';
                            }, 2000);
                        }).catch(err => {
                            alert('복사 실패: ' + err);
                        });
                    } else {
                        alert('클립보드 복사를 지원하지 않는 브라우저입니다.');
                    }
                }
            };
        });

        // 수주번호 전체 복사 버튼 이벤트 리스너
        const copyWarningBtn = document.getElementById('limsCopyWarningOrders');
        const copyErrorBtn = document.getElementById('limsCopyErrorOrders');

        if (copyWarningBtn) {
            copyWarningBtn.onclick = function (e) {
                e.preventDefault();
                const orderNumbers = decisionProblems.map(log => log.orderNo).join('\n');
                if (!orderNumbers) {
                    alert('복사할 수주번호가 없습니다.');
                    return;
                }
                copyToClipboard(orderNumbers, this);
            };
        }

        if (copyErrorBtn) {
            copyErrorBtn.onclick = function (e) {
                e.preventDefault();
                const orderNumbers = completeProblems.map(log => log.orderNo).join('\n');
                if (!orderNumbers) {
                    alert('복사할 수주번호가 없습니다.');
                    return;
                }
                copyToClipboard(orderNumbers, this);
            };
        }

        // --- 보고서 UI로 전환 ---
        document.getElementById('limsReportSection').style.display = 'block';
        document.getElementById('limsOrderList').style.display = 'none';

        let statusText = '';
        if (status === 'STOPPED') {
            if (errors.some(e => e.message.includes('수동으로 닫혔'))) {
                statusText = '<strong style="color: #d9534f;">⚠️ 작업 탭이 수동으로 닫혔습니다.</strong><br>';
            } else {
                statusText = '<strong style="color: #d9534f;">⚠️ 사용자가 작업을 중지했습니다.</strong><br>';
            }
        }

        document.getElementById('limsModalInstructions').innerHTML =
            statusText +
            `<strong>총 ${successes.length + decisionProblems.length + completeProblems.length}건 처리 시도</strong><br>` +
            `<span style="color: #5cb85c;">✅ 성공: ${successes.length}건</span> | ` +
            `<span style="color: #f0ad4e;">🟠 확인필요: ${decisionProblems.length}건</span> | ` +
            `<span style="color: #d9534f;">❌ 실패: ${completeProblems.length}건</span><br>` +
            `<small style="color: #666;">※ 📋 버튼으로 메신저 공유용 메시지를 복사할 수 있습니다. (주문번호 클릭 시 이동)</small>`; // 🆕 문구 수정

        // '시작' 버튼을 '확인' 버튼으로 변경
        batchStartButton.innerHTML = '[확인]';
        batchStartButton.disabled = false;
        batchStartButton.style.backgroundColor = '#007bff'; // 파란색
        batchStartButton.onclick = () => { modal.style.display = 'none'; };

        modal.style.display = 'block';
    }

    /**
     * 브라우저 알림 및 페이지 제목 깜빡임
     */
    function notifyUser(status, successes, warnings, errors) {
        // 보고서 분류
        const decisionProblems = [...warnings];
        const completeProblems = [];
        errors.forEach(err => {
            if (err.message.includes('[생산결정]')) { decisionProblems.push(err); } else { completeProblems.push(err); }
        });

        const title = (status === 'STOPPED') ? "LIMS 작업 중지됨" : "LIMS 작업 완료";
        const body = `성공: ${successes.length}건\n확인필요: ${decisionProblems.length}건\n실패: ${completeProblems.length}건`;

        // Tampermonkey 알림
        GM_notification({
            title: title,
            text: body,
            silent: false,
            timeout: 10000
        });

        // 페이지 제목 깜빡임
        if (titleBlinkInterval) clearInterval(titleBlinkInterval);
        originalTitle = document.title;
        let isOriginal = true;
        titleBlinkInterval = setInterval(() => {
            document.title = isOriginal ? '🔔 작업 완료! - LIMS' : originalTitle;
            isOriginal = !isOriginal;
        }, 1000);

        setTimeout(stopTitleBlink, 10000);
        window.addEventListener('focus', stopTitleBlink, { once: true });
    }

    function stopTitleBlink() {
        if (titleBlinkInterval) {
            clearInterval(titleBlinkInterval);
            titleBlinkInterval = null;
            document.title = originalTitle;
        }
    }

    /**
     * 🆕 [신규] 생산 결과 로그를 .txt 파일로 생성하여 자동 다운로드
     */
    function downloadLogFile(status, successes, warnings, errors) {
        try {
            const now = new Date();
            const dateStr = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

            const fileNameDate = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') + '_' +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0');

            // 보고서 분류 (showReportModal과 동일 로직)
            const decisionProblems = [...warnings];
            const completeProblems = [];
            errors.forEach(err => {
                if (err.message.includes('[생산결정]')) {
                    decisionProblems.push(err);
                } else {
                    completeProblems.push(err);
                }
            });

            let content = `[LIMS 생산 자동화 결과 로그]\n`;
            content += `작업 일시: ${dateStr}\n`;
            content += `최종 상태: ${status === 'STOPPED' ? '중지됨 (사용자 요청 또는 오류)' : '완료'}\n`;
            content += `--------------------------------------------------\n`;
            content += `📊 총 시도: ${successes.length + decisionProblems.length + completeProblems.length}건\n`;
            content += `✅ 성공: ${successes.length}건\n`;
            content += `🟠 확인필요: ${decisionProblems.length}건\n`;
            content += `❌ 실패: ${completeProblems.length}건\n`;
            content += `--------------------------------------------------\n\n`;

            if (successes.length > 0) {
                content += `[✅ 성공 항목]\n`;
                successes.forEach(log => {
                    content += `- ${log.orderNo}: ${log.message}\n`;
                });
                content += `\n`;
            }

            if (decisionProblems.length > 0) {
                content += `[🟠 확인필요 항목 (생산결정)]\n`;
                decisionProblems.forEach(log => {
                    content += `- ${log.orderNo}: ${log.message}\n`;
                });
                content += `\n`;
            }

            if (completeProblems.length > 0) {
                content += `[❌ 실패 항목 (생산완료/시스템)]\n`;
                completeProblems.forEach(log => {
                    content += `- ${log.orderNo}: ${log.message}\n`;
                });
                content += `\n`;
            }

            content += `\n[로그 끝]`;

            // Blob 생성 및 다운로드
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LIMS_Auto_Log_${fileNameDate}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log(`[LIMS Auto] 로그 파일 자동 다운로드 완료: ${a.download}`);
        } catch (e) {
            console.error('[LIMS Auto] 로그 파일 생성 중 오류 발생:', e);
        }
    }

    /**
     * UI를 초기 상태로 되돌림
     */
    function resetUI(isOpeningModal) {
        // 🆕 진행 상황 표시 중지
        stopProgressDisplay();

        // 버튼 리셋
        const startButton = document.getElementById("btnBatchAutomationStart");
        if (startButton) {
            startButton.disabled = false;
            startButton.style.opacity = "1.0";
        }
        if (stopButton) {
            stopButton.style.display = "none";
            stopButton.disabled = false;
            stopButton.innerHTML = '🛑 작업 중지';
        }

        // 모달을 '시작' 상태로 리셋
        if (isOpeningModal && modal) {
            clearLocalStorage(); // '시작' 버튼 누를 때 스토리지 정리
            document.getElementById('limsModalTitle').innerHTML = 'LIMS 생산 자동화';
            document.getElementById('limsModalInstructions').innerHTML = '처리할 주문번호(Ord. #) 목록을 한 줄에 하나씩 붙여넣으세요.<br><small style="color: #666;">※ 생산결정 → 생산완료까지 자동으로 연속 처리됩니다.</small>';
            document.getElementById('limsReportSection').style.display = 'none';
            orderListText.style.display = 'block';
            orderListText.value = '';

            document.getElementById('limsSuccessList').innerHTML = '';
            document.getElementById('limsWarningList').innerHTML = '';
            document.getElementById('limsErrorList').innerHTML = '';

            batchStartButton.innerHTML = '[생산결정 → 생산완료] 시작';
            batchStartButton.style.display = 'inline-block';
            batchStartButton.disabled = false;
            batchStartButton.style.backgroundColor = '#4CAF50';

            // 🆕 비상 정지 UI 숨기기
            document.getElementById('limsForceResetSection').style.display = 'none';

            batchStartButton.onclick = startBatch; // '시작' 기능 다시 연결
        }

        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
        }
        workWindow = null;
        checkStatusPollCount = 0;
        stopTitleBlink();
    }


    // ==================================================================
    // --- 스크립트 실행 분기 ---
    // ==================================================================
    // LIMS 페이지가 UI를 그릴 시간을 500ms 줍니다.
    setTimeout(() => {

        const listPageElement = document.querySelector(listPageSelector);
        const detailPageElement = document.querySelector(detailPageSelector);

        // '#btnSearch' (목록)을 우선으로 확인합니다.
        if (listPageElement) {
            // --- SCRIPT 1 (목록) 실행 ---
            initControlTower(listPageElement);

        } else if (detailPageElement) {
            // --- SCRIPT 2 (상세) 실행 ---
            // 'Search' 버튼이 없고, '생산결정' 버튼이 있으므로 상세 페이지임
            initAutomationWorker();

        } else {
            console.log("[LIMS Auto] v1.1: 자동화 대상 페이지가 아닙니다. (마커 Element를 찾지 못함)");
        }

    }, 500); // LIMS UI가 로드될 때까지 0.5초 대기

})();