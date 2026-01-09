// ==UserScript==
// @name         LIMS 레포트 자동 생성기
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  LIMS JOB NO별 상세 페이지 병렬 오픈 및 레포트 자동 생성 도구 (팝업 차단 회피 및 절대 경로 지원)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveProductWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveQcWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveExomeWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkDetail.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveProductWorkDetail.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveQcWorkDetail.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveExomeWorkDetail.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcWorkForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveProductWorkForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveQcWorkForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveExomeWorkForm.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcWorkDetail.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveProductWorkDetail.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveQcWorkDetail.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveExomeWorkDetail.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveProductWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveQcWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveExomeWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveProductWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveQcWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveExomeWorkDetailForm.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555108/LIMS%20%EB%A0%88%ED%8F%AC%ED%8A%B8%20%EC%9E%90%EB%8F%99%20%EC%83%9D%EC%84%B1%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555108/LIMS%20%EB%A0%88%ED%8F%AC%ED%8A%B8%20%EC%9E%90%EB%8F%99%20%EC%83%9D%EC%84%B1%EA%B8%B0.meta.js
// ==/UserScript==

/**
 * [변경 이력]
 * v1.6.5: GM_openInTab 사용 시 상대 경로가 확장 프로그램 경로로 오인되는 문제 해결 (절대 경로 적용)
 * v1.6.4: 브라우저 팝업 차단 회피를 위해 GM_openInTab 도입 및 탭 오픈 간격(500ms) 조정
 * v1.6.3: Quiet Mode 적용 - 불필요한 콘솔 로그 제거
 * v1.6.2: 기존 레포트 감지 로직 개선 - 성공 alert 훅을 통한 대기 시간 단축
 * v1.6.1: 실패 작업을 완료로 카운트하던 버그 수정 (성공/실패 분리 추적)
 * v1.6  : ExomeWorkForm 지원 추가 및 PDF 자동 열기 기능 제거 (생성 집중)
 */

(function () {
    'use strict';

    // --- CONFIG ---
    const DEBUG = false; // [v1.6.3] 로깅 제어 플래그 (true: 모든 로그 출력, false: 중요 로그만 출력)

    function log(...args) {
        if (DEBUG) console.log(...args);
    }

    if (window.myLimsReportAutoScriptRunning) {
        log('[LIMS Report Auto] Script already running.');
        return;
    }
    window.myLimsReportAutoScriptRunning = true;

    // 중요 로그는 항상 출력
    console.log('[LIMS Report Auto] 스크립트 시작 (v1.6.3) - Quiet Mode');

    const currentUrl = window.location.href;
    const isSampleQcPage = currentUrl.includes('/ngs/sample/retrieveQcWorkForm.do');
    const isLibraryProductPage = currentUrl.includes('/ngs/library/retrieveProductWorkForm.do');
    const isLibraryQcPage = currentUrl.includes('/ngs/library/retrieveQcWorkForm.do');
    const isLibraryExomePage = currentUrl.includes('/ngs/library/retrieveExomeWorkForm.do');
    const isSampleQcDetail = currentUrl.includes('/ngs/sample/retrieveQcWorkDetail.do') || currentUrl.includes('/ngs/sample/retrieveQcWorkDetailForm.do');
    const isLibraryProductDetail = currentUrl.includes('/ngs/library/retrieveProductWorkDetail.do') || currentUrl.includes('/ngs/library/retrieveProductWorkDetailForm.do');
    const isLibraryQcDetail = currentUrl.includes('/ngs/library/retrieveQcWorkDetail.do') || currentUrl.includes('/ngs/library/retrieveQcWorkDetailForm.do');
    const isLibraryExomeDetail = currentUrl.includes('/ngs/library/retrieveExomeWorkDetail.do') || currentUrl.includes('/ngs/library/retrieveExomeWorkDetailForm.do');

    const isWorkPage = isSampleQcPage || isLibraryProductPage || isLibraryQcPage || isLibraryExomePage;
    const isDetailPage = isSampleQcDetail || isLibraryProductDetail || isLibraryQcDetail || isLibraryExomeDetail;

    log('[LIMS Report Auto] Current URL:', currentUrl);
    log('[LIMS Report Auto] isWorkPage:', isWorkPage, 'isDetailPage:', isDetailPage);
    // [v1.6] 페이지 타입 플래그 로깅
    console.log(`[LIMS Report Auto] isSampleQcPage: ${isSampleQcPage}, isLibraryExomePage: ${isLibraryExomePage}`);

    // --- 유틸리티 함수 ---

    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                // 중단 플래그 확인
                if (GM_getValue('automation_cancelled', false)) {
                    reject(new Error('작업 중단됨 (cancelled)'));
                    return;
                }
                const element = document.querySelector(selector);
                if (element) {
                    log(`[LIMS Report Auto] Element found: ${selector}`);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    console.error(`[LIMS Report Auto] Timeout: ${selector}`);
                    reject(new Error(`Element not found: ${selector}`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    }

    function findSheetObject(currentWindow, sheetName) {
        try {
            if (currentWindow[sheetName] && typeof currentWindow[sheetName].GetTotalRows === 'function') {
                log(`[LIMS Report Auto] Found ${sheetName} in window:`, currentWindow.location.href);
                return currentWindow[sheetName];
            }
            for (let i = 0; i < currentWindow.frames.length; i++) {
                const frameWindow = currentWindow.frames[i];
                const sheetInFrame = findSheetObject(frameWindow, sheetName);
                if (sheetInFrame) {
                    return sheetInFrame;
                }
            }
        } catch (error) { }
        return null;
    }

    function waitForSheetObject(sheetName, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkSheet = () => {
                // 중단 플래그 확인
                if (GM_getValue('automation_cancelled', false)) {
                    reject(new Error('작업 중단됨 (cancelled)'));
                    return;
                }
                const sheet = findSheetObject(unsafeWindow, sheetName);
                // 시트와 데이터 모두 대기 (첫 행의 C2 체크)
                if (sheet && sheet.GetTotalRows() > 0 && sheet.GetCellValue(1, 'C2')) {
                    log(`[LIMS Report Auto] Sheet object found and data model ready: ${sheetName}`);
                    resolve(sheet);
                } else if (Date.now() - startTime > timeout) {
                    console.error(`[LIMS Report Auto] Timeout: Sheet object ${sheetName} (or no data)`);
                    reject(new Error(`Sheet object not found or empty: ${sheetName}`));
                } else {
                    setTimeout(checkSheet, 50); // 공격적 최적화: 250ms → 50ms
                }
            };
            checkSheet();
        });
    }

    // Detail 페이지의 IBSheet "객체"가 로드되고 데이터를 가질 때까지 대기
    function waitForDetailSheet(timeout = 30000) {
        return new Promise((resolve, reject) => {
            let detailSheetName = null;
            if (isSampleQcDetail) detailSheetName = 'ibsQcWorkDetail';
            else if (isLibraryProductDetail) detailSheetName = 'ibsProductWorkDetail';
            else if (isLibraryQcDetail) detailSheetName = 'ibsQcWorkDetail'; // SampleQC와 동일한 시트 이름으로 가정
            else if (isLibraryExomeDetail) detailSheetName = 'ibsExomeWorkDetail';

            if (!detailSheetName) {
                return reject(new Error('이 페이지의 Detail IBSheet 이름을 알 수 없습니다.'));
            }

            console.log(`[LIMS Report Auto] IBSheet Object 대기 중: ${detailSheetName}`);
            const startTime = Date.now();

            const checkSheet = () => {
                if (GM_getValue('automation_cancelled', false)) {
                    reject(new Error('작업 중단됨 (cancelled)'));
                    return;
                }
                // findSheetObject 유틸리티 재사용
                const sheet = findSheetObject(unsafeWindow, detailSheetName);

                // 객체가 존재하고, GetTotalRows 함수가 있으며, 실제 데이터가 1줄 이상 있는지 확인
                if (sheet && typeof sheet.GetTotalRows === 'function' && sheet.GetTotalRows() > 0) {

                    // 데이터가 로드되었는지 추가 확인 (첫 번째 행의 특정 셀)
                    // Sample/Lib QC는 C2(WKST_ID), Product는 C3(ORD_SMPL_NO)를 확인
                    const checkCell = isLibraryProductDetail ? 'C3' : 'C2';

                    if (sheet.GetCellValue(1, checkCell)) {
                        log(`[LIMS Report Auto] ✓ IBSheet Object 준비 완료: ${detailSheetName} (Rows: ${sheet.GetTotalRows()})`);
                        resolve(sheet);
                    } else {
                        // 객체는 있으나 데이터가 아직 로드 중
                        if (Date.now() - startTime > timeout) {
                            console.error(`[LIMS Report Auto] Timeout: IBSheet Object ${detailSheetName} (데이터 로드 지연)`);
                            reject(new Error(`Sheet object data load timeout: ${detailSheetName}`));
                        } else {
                            setTimeout(checkSheet, 100); // 공격적 최적화: 500ms → 100ms
                        }
                    }
                } else if (Date.now() - startTime > timeout) {
                    console.error(`[LIMS Report Auto] Timeout: IBSheet Object ${detailSheetName}`);
                    reject(new Error(`Sheet object not found or empty: ${detailSheetName}`));
                } else {
                    setTimeout(checkSheet, 50); // 공격적 최적화: 250ms → 50ms
                }
            };
            checkSheet();
        });
    }

    // --- Work 페이지 로직 (메인 컨트롤러) ---

    if (isWorkPage) {
        console.log('[LIMS Report Auto] Work page detected');

        const sheetName = isSampleQcPage ? 'ibsQcWork' :
            isLibraryProductPage ? 'ibsProductWork' :
                isLibraryQcPage ? 'ibsQcWork' :
                    isLibraryExomePage ? 'ibsExomeWork' :
                        'ibsQcWork';
        let monitorInterval = null; // 진행상황 모니터링용 인터벌 핸들

        async function showNotification(title, body) {
            if (!("Notification" in window)) {
                console.warn("[LIMS Report Auto] Browser doesn't support notifications. Using alert.");
                return;
            }
            try {
                if (Notification.permission === "granted") {
                    new Notification(title, { body: body });
                } else if (Notification.permission !== "denied") {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        new Notification(title, { body: body });
                    }
                }
            } catch (error) {
                console.error("[LIMS Report Auto] Error showing notification:", error);
            }
        }


        // 1단계(레포트 생성) 완료 상태 체크 (진행바 업데이트)
        const checkStage1Progress = () => {
            const automationMode = GM_getValue('automation_mode');
            if (automationMode !== 'stage1_generate') {
                if (monitorInterval) clearInterval(monitorInterval);
                return; // 1단계에서만 실행
            }

            // 중단되었는지 확인
            if (GM_getValue('automation_cancelled', false)) {
                log('[LIMS Report Auto] 작업이 중단되어 모니터링을 종료합니다.');
                updateProgress(GM_getValue('current_job_index', 0), GM_getValue('total_jobs', 0), '작업 중단됨.');
                if (monitorInterval) clearInterval(monitorInterval);
                GM_deleteValue('automation_mode'); // 중단 시 모드 초기화
                // 버튼 재활성화
                const btnStart = document.getElementById('btnStartReport');
                const btnCancel = document.getElementById('btnCancelReport');
                if (btnStart) btnStart.disabled = false;
                if (btnCancel) btnCancel.disabled = false;
                return;
            }

            const jobDetails = GM_getValue('job_details', []);
            const totalJobs = jobDetails.length;
            if (totalJobs === 0) return;

            // 완료된 작업 카운트 체크
            let completedJobsCount = 0;
            for (const job of jobDetails) {
                if (GM_getValue('report_completed_' + job.jobNo, false)) {
                    completedJobsCount++;
                }
            }
            updateProgress(completedJobsCount, totalJobs, 'Stage A: 레포트 생성 중...');

            // 마스터 타임아웃 (큐 멈춤 대비)
            const startTime = GM_getValue('automation_start_time', 0);
            const maxWaitTime = 600000; // 10분
            if (startTime > 0 && (Date.now() - startTime > maxWaitTime)) {
                console.warn('[LIMS Report Auto] 마스터 타임아웃 도달 (10분). 강제로 2단계 시작.');

                // 미완료 작업을 찾아서 강제로 실패 처리
                const failedOrders = GM_getValue('failed_orders', []);
                jobDetails.forEach(job => {
                    // 미완료 작업을 찾아서 강제로 실패 처리
                    if (!GM_getValue('report_completed_' + job.jobNo, false)) {
                        console.warn(`[LIMS Report Auto] Job ${job.jobNo} 타임아웃.`);
                        // 실패 목록에 추가 (중복 체크)
                        if (!failedOrders.some(f => f.wkstId === job.jobNo)) {
                            failedOrders.push({
                                wkstId: job.jobNo,
                                reason: '탭 응답 시간 초과',
                                url: job.url
                            });
                        }
                    }
                });
                GM_setValue('failed_orders', failedOrders);

                // 2단계 강제 트리거
                GM_setValue('force_stage_2_trigger', Date.now());
            }
        };

        // 2단계 (결과 수집 및 모달 표시)
        const runStage2Collection = async () => {
            console.log('[LIMS Report Auto] 2단계 실행: 결과 수집 중');
            GM_deleteValue('force_stage_2_trigger'); // 트리거 초기화

            // 중단된 상태에서는 2단계 실행 안 함
            if (GM_getValue('automation_cancelled', false)) {
                console.warn('[LIMS Report Auto] 작업이 중단되어 2단계를 실행하지 않습니다.');
                GM_deleteValue('automation_mode');
                GM_deleteValue('automation_cancelled');
                GM_deleteValue('job_details');
                return;
            }

            // Work 페이지 포커스 시도
            try {
                window.focus();
                log('[LIMS Report Auto] Work 페이지 포커스 완료.');
            } catch (e) {
                console.warn('[LIMS Report Auto] 윈도우 포커스 실패:', e);
            }

            createModal();
            showModal();
            updateProgress(0, 1, 'Stage C: 최종 보고서 집계 중...');

            try {
                GM_deleteValue('automation_mode'); // 현재 단계 실행 중

                const failedOrders = GM_getValue('failed_orders', []);
                const jobDetails = GM_getValue('job_details', []);

                // 실패 목록에 없는 작업들을 성공 목록으로 추출
                const successWkstIds = jobDetails
                    .filter(job => !failedOrders.some(f => f.wkstId === job.jobNo))
                    .map(job => job.jobNo);

                // 성공/실패 여부와 관계없이 모달 표시
                log(`[LIMS Report Auto] ${successWkstIds.length}개의 성공 작업 발견.`);
                updateProgress(1, 1, `작업 완료. (성공: ${successWkstIds.length}, 실패: ${failedOrders.length})`);

                // 성공 목록 생성
                const reportUrls = [];
                for (const wkstId of successWkstIds) {
                    reportUrls.push({ wkstId: wkstId, url: '' }); // 성공했다는 의미로만 사용
                }

                GM_setValue('report_urls', reportUrls);
                showResultsModal(reportUrls, failedOrders);

                // 알림 표시
                showNotification('레포트 생성 완료!', `성공: ${successWkstIds.length}개, 실패: ${failedOrders.length}개`);

                // GM 값 정리
                jobDetails.forEach(job => {
                    GM_deleteValue('job_completed_' + job.jobNo);
                    GM_deleteValue('pdf_ready_' + job.jobNo);
                    GM_deleteValue('pdf_date_' + job.jobNo);
                    GM_deleteValue('pdf_generated_time_' + job.jobNo);
                    GM_deleteValue('report_click_time_' + job.jobNo);

                    GM_deleteValue('report_ready_' + job.jobNo);
                    GM_deleteValue('report_completed_' + job.jobNo);
                    GM_deleteValue('report_attempted_' + job.jobNo);
                    // PDF 큐 관련 GM 값 정리
                    GM_deleteValue('pdf_open_order_' + job.jobNo);
                    GM_deleteValue('pdf_open_trigger_' + job.jobNo);
                    GM_deleteValue('pdf_opened_' + job.jobNo);
                    // 페이지 준비 및 클릭 신호 정리
                    GM_deleteValue('page_ready_' + job.jobNo);
                    GM_deleteValue('click_signal_' + job.jobNo);
                });
                GM_deleteValue('job_details');
                // GM_deleteValue('failed_orders'); // 모달에 표시하기 위해 유지
                GM_deleteValue('total_jobs');
                GM_deleteValue('automation_start_time');
                GM_deleteValue('stage2_triggered');

                // 큐 인덱스 정리
                GM_deleteValue('current_job_index');
                GM_deleteValue('current_click_index');
                GM_deleteValue('click_turn_job_no');
                GM_deleteValue('total_ready_to_click');
                GM_deleteValue('current_pdf_index');
                GM_deleteValue('automation_cancelled');

            } catch (error) {
                console.error('[LIMS Report Auto] Error during Stage 2 Collection:', error);
                alert('2단계 PDF 수집 중 오류가 발생했습니다: ' + error.message);
                showResultsModal(GM_getValue('report_urls', []), GM_getValue('failed_orders', []));
            }
        };

        // 최종 결과 모달 표시
        const showResultsModal = (reportUrls, failedOrders) => {
            const modal = document.getElementById('reportGenModal');
            if (!modal) return;

            const successCount = reportUrls.length;
            const failCount = failedOrders.length;

            let resultHTML = `
                <h3 style="color: #333; margin-top: 0;">레포트 생성 완료</h3>
                <div style="margin-bottom: 20px;">
                    <p style="color: #4CAF50; font-weight: 600; font-size: 16px;">✓ 생성 성공: ${successCount}개</p>
                    <p style="color: #f44336; font-weight: 600; font-size: 16px;">✗ 생성 실패: ${failCount}개</p>
                </div>
            `;

            if (reportUrls.length > 0) {
                // *** [MODIFICATION v1.6] ***
                // 모든 페이지에서 PDF 열기를 하지 않으므로 문구 통일
                const successTitle = '생성된 레포트:';
                const successStatus = '✓ 생성 완료';
                // *** [END MODIFICATION v1.6] ***

                resultHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #333;">${successTitle}</h4>
                                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; background: #f9f9f9;">
                `;
                reportUrls.forEach((item, index) => {
                    resultHTML += `
                                    <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
                                        <strong>${index + 1}. ${item.wkstId}</strong>
                                        <span style="color: #4CAF50; font-size: 12px; margin-left: 8px;">${successStatus}</span>
                                    </div>
                    `;
                });
                resultHTML += `</div></div>`;
            }

            if (failedOrders.length > 0) {
                resultHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #333;">실패 목록:</h4>
                                <div style="max-height: 150px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; background: #fff3e0;">
                `;
                failedOrders.forEach((item, index) => {
                    resultHTML += `
                                    <div style="margin-bottom: 8px; font-size: 13px;">
                                        <strong>${index + 1}. ${item.wkstId}</strong>: ${item.reason}
                                    </div>
                    `;
                });
                resultHTML += `</div></div>`;
            }

            // *** [MODIFICATION v1.6] ***
            // 모든 페이지에서 PDF 열기를 하지 않으므로 문구 통일
            const modalMessage = `💡 각 Detail 탭에 레포트가 생성되었습니다.<br>탭을 확인하고 Complete 처리를 진행하세요.`;
            // *** [END MODIFICATION v1.6] ***

            // 모달 메시지
            resultHTML += `
                <div style="margin-top: 20px; text-align: center; padding: 15px; background: #e3f2fd; border-radius: 4px;">
                    <p style="margin: 0; color: #1976d2; font-weight: 600;">
                        ${modalMessage}
                    </p>
                </div>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="btnCloseResults" style="
                        background-color: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 10px 20px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                    ">확인</button>
                </div>
            `;

            const modalContent = modal.querySelector('div > div');
            modalContent.innerHTML = resultHTML;
            modal.style.display = 'block';

            document.getElementById('btnCloseResults').addEventListener('click', hideModal);
        };

        // 'report_completed_' 리스닝
        GM_addValueChangeListener('report_completed_', (key, _oldVal, newVal, remote) => {
            if (newVal && remote) {
                const jobNo = key.replace('report_completed_', '');
                log(`[LIMS Report Auto] 작업 완료 감지: ${jobNo}`);

                // 즉시 진행상황 체크
                checkStage1Progress();
            }
        });

        // 1단계 진행상황 폴링 (백업용)
        if (monitorInterval) clearInterval(monitorInterval);
        monitorInterval = setInterval(checkStage1Progress, 2000);

        // 자동생성 버튼 추가
        const addButton = () => {
            if (document.getElementById('btnAutoReportGen')) return;

            // 여러 가능한 selector 시도
            let searchButton = document.querySelector('#btnSearch');

            if (!searchButton) {
                // 대체 selector 시도
                searchButton = document.querySelector('[id*="Search"]') ||
                    document.querySelector('[id*="search"]') ||
                    document.querySelector('.btn-primary');

                if (searchButton) {
                    console.warn('[LIMS Report Auto] #btnSearch를 찾지 못했지만 대체 버튼을 찾았습니다:', searchButton.id || searchButton.className);
                } else {
                    console.error('[LIMS Report Auto] Search button not found. 페이지의 버튼들:',
                        Array.from(document.querySelectorAll('button')).map(b => b.id || b.className).join(', '));
                    return;
                }
            }
            const button = document.createElement('button');
            button.id = 'btnAutoReportGen';
            button.type = 'button';
            button.className = 'btn btn-primary size-auto';
            button.innerHTML = '&#128202; 레포트 자동생성';
            button.style.cssText = `
                margin-left: 8px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                padding: 8px 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                display: inline-flex;
                align-items: center;
                gap: 4px;
                vertical-align: middle;
                line-height: 1;
            `;
            button.addEventListener('mouseover', () => { button.style.backgroundColor = '#45a049'; });
            button.addEventListener('mouseout', () => { button.style.backgroundColor = '#4CAF50'; });
            button.addEventListener('click', showModal);
            searchButton.parentElement.appendChild(button);
            console.log('[LIMS Report Auto] Button added');
        };

        // 모달 생성
        const createModal = () => {
            if (document.getElementById('reportGenModal')) return;
            const modalHTML = `
                <div id="reportGenModal" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
                    <div style="background-color: #fefefe; margin: 10% auto; padding: 30px; border: 1px solid #888; border-radius: 8px; width: 600px; max-width: 90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div id="modalDynamicContent">
                            <!-- This content will be replaced by showModal() -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.getElementById('reportGenModal').addEventListener('click', (e) => {
                // 모달 바깥 클릭 시에도 취소 로직 실행
                if (e.target.id === 'reportGenModal') hideModal();
            });
            console.log('[LIMS Report Auto] Modal created');
        };

        // 모달 표시 (1단계로 초기화)
        const showModal = () => {
            const modal = document.getElementById('reportGenModal');
            if (modal) {
                const modalContent = modal.querySelector('#modalDynamicContent');
                modalContent.innerHTML = `
                    <h2 style="margin-top: 0; color: #333;">JOB NO (WKST. ID) 레포트 자동 생성</h2>
                    <p style="color: #666; margin-bottom: 20px;">JOB NO (WKST. ID)를 입력하세요 (쉼표 또는 줄바꿈으로 구분)</p>
                    <textarea id="orderNumberInput" style="width: 100%; height: 150px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 14px; resize: vertical; box-sizing: border-box;" placeholder="예시:
HNW251107S001Q002, HNW251107S001Q001
HNW251105S001Q001"></textarea>
                    <div style="margin-top: 20px; text-align: right;">
                        <button id="btnStartReport" style="background-color: #4CAF50; color: white; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; margin-left: 10px;">시작</button>
                        <button id="btnCancelReport" style="background-color: #999; color: white; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; margin-left: 10px;">취소</button>
                    </div>
                    <div id="progressArea" style="display: none; margin-top: 20px;">
                        <div style="background-color: #f0f0f0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                            <div id="progressBar" style="background-color: #4CAF50; height: 20px; border-radius: 4px; width: 0%; transition: width 0.3s;"></div>
                        </div>
                        <div id="progressText" style="color: #666; font-size: 14px;"></div>
                    </div>
                `;
                // 이벤트 재바인딩
                document.getElementById('btnStartReport').addEventListener('click', startReportGeneration);
                document.getElementById('btnCancelReport').addEventListener('click', hideModal);
                modal.style.display = 'block';
            }
        };

        // 모달 숨기기 및 작업 중단 로직
        const hideModal = () => {
            const modal = document.getElementById('reportGenModal');

            // 작업 중단(Cancel) 기능
            const automationMode = GM_getValue('automation_mode');
            if (automationMode === 'stage1_generate' && modal && modal.style.display !== 'none') {
                if (confirm('작업이 진행 중입니다. 정말로 중단하시겠습니까?')) {
                    log('[LIMS Report Auto] 작업 중단(Cancel) 플래그 설정.');
                    GM_setValue('automation_cancelled', true);
                    // 버튼 즉시 활성화
                    const btnStart = document.getElementById('btnStartReport');
                    const btnCancel = document.getElementById('btnCancelReport');
                    if (btnStart) btnStart.disabled = false;
                    if (btnCancel) btnCancel.disabled = false;
                } else {
                    return; // 중단 안 함, 모달 닫지 않음
                }
            }

            if (modal) modal.style.display = 'none';
        };

        const updateProgress = (current, total, message) => {
            const progressArea = document.getElementById('progressArea');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            if (progressArea && progressBar && progressText) {
                progressArea.style.display = 'block';
                const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
                progressBar.style.width = percentage + '%';
                progressText.textContent = `${message} (${current}/${total})`;
            }
        };

        // 레포트 생성 시작 (1단계)
        const startReportGeneration = async () => {
            const input = document.getElementById('orderNumberInput').value.trim();
            if (!input) {
                alert('JOB NO (WKST. ID)를 입력해주세요.');
                return;
            }
            const jobNoInputList = input.split(/[,\n\s]+/).map(num => num.trim()).filter(num => num.length > 0);
            if (jobNoInputList.length === 0) {
                alert('유효한 JOB NO (WKST. ID)를 입력해주세요.');
                return;
            }

            console.log('[LIMS Report Auto] JOB NOs:', jobNoInputList);
            document.getElementById('btnStartReport').disabled = true;
            document.getElementById('btnCancelReport').disabled = false; // 취소 버튼은 활성화

            try {
                updateProgress(0, jobNoInputList.length, '그리드에서 JOB NO 검색 중...');
                const sheet = findSheetObject(unsafeWindow, sheetName);
                if (!sheet) throw new Error(`IBSheet를 찾을 수 없습니다: ${sheetName}`);

                log('[LIMS Report Auto] IBSheet found:', sheetName, 'Total rows:', sheet.GetTotalRows());
                const jobDetails = [];
                const notFoundJobNos = [];

                for (const targetJobNo of jobNoInputList) {
                    let found = false;
                    const totalRows = sheet.GetTotalRows();
                    for (let row = 1; row <= totalRows; row++) {
                        // C2 컬럼(wkstId)에서 JOB NO 검색
                        const jobNoRaw = sheet.GetCellValue(row, 'C2');
                        const jobNo = jobNoRaw ? String(jobNoRaw).trim() : '';

                        if (jobNo === targetJobNo) {
                            // Detail 페이지 URL 생성 (GM_openInTab 사용을 위해 절대 경로로 생성)
                            const origin = window.location.origin;
                            const urlParams = new URLSearchParams(window.location.search);
                            const menuCd = urlParams.get('menuCd') || 'NGS110301'; // 기본값
                            let detailUrl = '';
                            if (isSampleQcPage) detailUrl = `${origin}/ngs/sample/retrieveQcWorkDetailForm.do?workNo=${jobNo}&menuCd=${menuCd}`;
                            else if (isLibraryProductPage) detailUrl = `${origin}/ngs/library/retrieveProductWorkDetailForm.do?workNo=${jobNo}&menuCd=${menuCd}`;
                            else if (isLibraryQcPage) detailUrl = `${origin}/ngs/library/retrieveQcWorkDetailForm.do?workNo=${jobNo}&menuCd=${menuCd}`;
                            else if (isLibraryExomePage) detailUrl = `${origin}/ngs/library/retrieveExomeWorkDetailForm.do?workNo=${jobNo}&menuCd=${menuCd}`;

                            jobDetails.push({ jobNo: jobNo, row: row, url: detailUrl });
                            log(`[LIMS Report Auto] Found: ${jobNo}`);
                            found = true;
                            break;
                        }
                    }
                    if (!found) notFoundJobNos.push(targetJobNo);
                }

                if (notFoundJobNos.length > 0) {
                    if (!confirm(`다음 JOB NO를 찾을 수 없습니다:\n${notFoundJobNos.join(', ')}\n\n찾은 JOB NO(${jobDetails.length}개)로 계속하시겠습니까?`)) {
                        document.getElementById('btnStartReport').disabled = false;
                        document.getElementById('btnCancelReport').disabled = false;
                        return;
                    }
                }
                if (jobDetails.length === 0) {
                    alert('JOB NO를 찾을 수 없습니다.');
                    document.getElementById('btnStartReport').disabled = false;
                    document.getElementById('btnCancelReport').disabled = false;
                    return;
                }

                // 1단계 설정
                GM_setValue('automation_mode', 'stage1_generate');
                GM_setValue('job_details', jobDetails);
                GM_setValue('automation_cancelled', false);

                // GM 값 초기화
                jobDetails.forEach(job => {
                    GM_deleteValue('report_completed_' + job.jobNo);
                    GM_deleteValue('report_attempted_' + job.jobNo);
                    GM_deleteValue('pdf_ready_' + job.jobNo);
                    GM_deleteValue('pdf_open_trigger_' + job.jobNo);
                });
                GM_setValue('failed_orders', []);
                GM_setValue('report_urls', []);
                GM_setValue('total_jobs', jobDetails.length);
                GM_setValue('automation_start_time', Date.now());

                updateProgress(0, jobDetails.length, 'Stage A: 탭 열기 및 레포트 생성 시작...');
                showNotification('Stage A: 레포트 생성', `${jobDetails.length}개 상세 페이지에서 병렬로 레포트를 생성합니다.`);

                // Stage A: 모든 상세 탭 병렬 열기 (팝업 차단 방지를 위해 약간의 간격을 두고 GM_openInTab 사용)
                log(`[LIMS Report Auto] (Stage A) 모든 상세 탭 열기 시작 (${jobDetails.length}개)...`);
                for (let i = 0; i < jobDetails.length; i++) {
                    const job = jobDetails[i];
                    log(`[LIMS Report Auto] 상세 탭 ${i + 1}/${jobDetails.length} 열기: ${job.jobNo}`);

                    try {
                        // GM_openInTab은 브라우저의 팝업 차단을 회피하며, active: false를 통해 백그라운드에서 열기 가능
                        GM_openInTab(job.url, { active: false, insert: true, setParent: true });
                    } catch (e) {
                        console.error('[LIMS Report Auto] GM_openInTab 실패, window.open 폴백 사용:', e);
                        window.open(job.url, '_blank');
                    }

                    // 탭 사이에 0.5초 간격을 두어 "탕탕탕" 순차적으로 열리게 함
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                // 모든 탭 로딩 대기 후 빠른 순차 클릭
                log("[LIMS Report Auto] (Stage A-2) 모든 탭 로딩 대기 후 빠른 순차 클릭...");
                updateProgress(0, jobDetails.length, 'Stage A: 모든 탭 로딩 대기 중...');
                showNotification('Stage A: 레포트 생성', `${jobDetails.length}개 탭 로딩 후, 빠르게 클릭합니다.`);

                // 1단계: 모든 탭 페이지 로딩 완료 대기
                log('[LIMS Report Auto] 1단계: 모든 탭 페이지 로딩 완료 대기...');
                const loadWaitStart = Date.now();
                const loadWaitTimeout = 120000; // 2분
                let allTabsReady = false;

                while (!allTabsReady && (Date.now() - loadWaitStart < loadWaitTimeout)) {
                    if (GM_getValue('automation_cancelled', false)) {
                        log('[LIMS Report Auto] 로딩 대기 중 중단 감지.');
                        throw new Error('작업 중단됨 (cancelled)');
                    }

                    // 개별 플래그를 직접 카운트
                    let readyCount = 0;
                    for (const job of jobDetails) {
                        if (GM_getValue('page_ready_' + job.jobNo, false)) {
                            readyCount++;
                        }
                    }

                    updateProgress(readyCount, jobDetails.length, `Stage A: 탭 로딩 ${readyCount}/${jobDetails.length}...`);

                    if (readyCount === jobDetails.length) {
                        allTabsReady = true;
                        log('[LIMS Report Auto] ✓ 모든 탭 로딩 완료! 이제 빠르게 클릭 시작...');
                        break;
                    }

                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                if (!allTabsReady) {
                    console.warn('[LIMS Report Auto] ⚠ 일부 탭 로딩 타임아웃 (2분)');
                    // 로딩 실패한 탭들을 실패 처리
                    jobDetails.forEach(job => {
                        const isReady = GM_getValue('page_ready_' + job.jobNo, false);
                        if (!isReady) {
                            const failedOrders = GM_getValue('failed_orders', []);
                            if (!failedOrders.some(f => f.wkstId === job.jobNo)) {
                                failedOrders.push({
                                    wkstId: job.jobNo,
                                    reason: '페이지 로딩 시간 초과 (2분)',
                                    url: job.url
                                });
                                GM_setValue('failed_orders', failedOrders);
                            }
                        }
                    });
                }

                // 2단계: 모든 탭에 순차적으로 클릭 신호 전송
                log('[LIMS Report Auto] 2단계: 모든 탭에 빠른 순차 클릭 신호 전송...');
                for (let i = 0; i < jobDetails.length; i++) {
                    const job = jobDetails[i];

                    // 로딩 실패한 탭 스킵
                    const isReady = GM_getValue('page_ready_' + job.jobNo, false);
                    if (!isReady) {
                        log(`[LIMS Report Auto] ${job.jobNo} 로딩 실패로 클릭 스킵`);
                        continue;
                    }

                    log(`[LIMS Report Auto] ${i + 1}/${jobDetails.length} 클릭 신호: ${job.jobNo}`);
                    GM_setValue('click_signal_' + job.jobNo, Date.now());

                    // 짧은 딜레이 (0.1초 -> 1.0초) - DB 무결성 제약 조건(ORA-00001) 오류 방지
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                log('[LIMS Report Auto] ✓ 모든 클릭 신호 전송 완료!');

                // 3단계: 모든 레포트 생성 완료 대기
                log('[LIMS Report Auto] 3단계: 모든 레포트 생성 완료 대기...');
                const stageAStartTime = Date.now();
                // 타임아웃 시간 설정 (클릭 완료 대기)
                const stageATimeout = 60000 + (jobDetails.length * 1000); // 1분 + (작업당 1초)
                let allCompleted = false;

                while (!allCompleted && (Date.now() - stageAStartTime < stageATimeout)) {
                    if (GM_getValue('automation_cancelled', false)) {
                        log('[LIMS Report Auto] 생성 대기 중 중단 감지.');
                        throw new Error('작업 중단됨 (cancelled)');
                    }

                    // *** [FIX v1.6.1] ***
                    // report_attempted는 성공/실패 모두 포함, report_completed는 성공만 포함
                    const attemptedCount = jobDetails.filter(job => GM_getValue('report_attempted_' + job.jobNo, false)).length;
                    const successCount = jobDetails.filter(job => GM_getValue('report_completed_' + job.jobNo, false)).length;
                    updateProgress(attemptedCount, jobDetails.length, `Stage A: 레포트 생성 ${successCount}/${jobDetails.length} (시도: ${attemptedCount})...`);

                    if (attemptedCount === jobDetails.length) {
                        allCompleted = true;
                        log(`[LIMS Report Auto] ✓ (Stage A) 모든 작업 시도 완료! (성공: ${successCount}/${jobDetails.length})`);
                        break;
                    }

                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                if (!allCompleted) {
                    console.warn(`[LIMS Report Auto] ⚠ (Stage A) 일부 레포트 제작 타임아웃 (클릭 응답 없음)`);
                    // *** [FIX v1.6.1] ***
                    // 타임아웃된 작업들 실패 처리 (report_attempted 체크)
                    jobDetails.forEach(job => {
                        if (!GM_getValue('report_attempted_' + job.jobNo, false)) {
                            const failedOrders = GM_getValue('failed_orders', []);
                            if (!failedOrders.some(f => f.wkstId === job.jobNo)) {
                                failedOrders.push({
                                    wkstId: job.jobNo,
                                    reason: `레포트 제작 시간 초과 (클릭 응답 없음)`,
                                    url: job.url
                                });
                                GM_setValue('failed_orders', failedOrders);
                            }
                            // 타임아웃된 작업도 시도 완료로 표시
                            GM_setValue('report_attempted_' + job.jobNo, true);
                        }
                    });
                }

                // *** [MODIFICATION v1.6] ***
                // 모든 작업에 대해 PDF 열기(Stage B)를 건너뛰고 바로 Stage C(결과 수집)로 이동합니다.
                log('[LIMS Report Auto] (Stage B 생략) PDF 열기를 건너뜁니다 (생성만).');
                log('[LIMS Report Auto] (Stage C) 결과 수집 시작...');

                await runStage2Collection();

                // 버튼 활성화 (안전하게 체크 후 설정)
                const btnStart = document.getElementById('btnStartReport');
                const btnCancel = document.getElementById('btnCancelReport');
                if (btnStart) btnStart.disabled = false;
                if (btnCancel) btnCancel.disabled = false;

            } catch (error) {
                console.error('[LIMS Report Auto] Error:', error);
                if (error.message.includes('cancelled')) {
                    log('[LIMS Report Auto] 작업이 사용자에 의해 중단되었습니다.');
                    hideModal(); // 모달 닫기
                } else {
                    alert('오류가 발생했습니다: ' + error.message);
                }

                // 버튼 활성화 (안전하게 체크 후 설정)
                const btnStart = document.getElementById('btnStartReport');
                const btnCancel = document.getElementById('btnCancelReport');
                if (btnStart) btnStart.disabled = false;
                if (btnCancel) btnCancel.disabled = false;
            }
        };

        // 버튼 및 모달 추가
        // 버튼 찾기
        const tryAddButton = async () => {
            console.log('[LIMS Report Auto] 페이지 초기화 시작...');

            // 1. #btnSearch 시도
            try {
                await waitForElement('#btnSearch', 5000);
                log('[LIMS Report Auto] #btnSearch 찾음!');
            } catch (e) {
                console.warn('[LIMS Report Auto] #btnSearch를 찾지 못했습니다. 대체 방법 시도...');

                // 2. 다른 버튼들 확인
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
                const allButtons = document.querySelectorAll('button');
                log('[LIMS Report Auto] 페이지의 모든 버튼:', Array.from(allButtons).map(b => ({
                    id: b.id,
                    class: b.className,
                    text: b.textContent.trim().substring(0, 20)
                })));

                // 3. 페이지가 Work 페이지인지 재확인
                log('[LIMS Report Auto] 현재 URL:', window.location.href);
                log('[LIMS Report Auto] isWorkPage:', isWorkPage);
            }

            addButton();
            createModal();

            // 2단계로 돌아왔는지 먼저 체크
            const automationMode = GM_getValue('automation_mode');
            if (automationMode === 'stage2_collect') {
                runStage2Collection();
            } else if (automationMode === 'stage1_generate') {
                // 페이지 새로고침 후 1단계 모니터링 재개
                log('[LIMS Report Auto] 새로고침 후 1단계 모니터링 재개.');
                if (monitorInterval) clearInterval(monitorInterval);
                monitorInterval = setInterval(checkStage1Progress, 2000);
            }

            // 2단계 트리거 리스너 추가
            GM_addValueChangeListener('force_stage_2_trigger', (key, oldVal, newVal, remote) => {
                if (newVal) {
                    log('[LIMS Report Auto] 2단계 트리거 수신. 바로 결과 수집 실행.');
                    // 새로고침 없이 2단계 바로 실행
                    runStage2Collection();
                }
            });
        };

        // 버튼 추가 실행
        tryAddButton().catch(error => {
            console.error('[LIMS Report Auto] 버튼 추가 실패:', error);
        });
    }

    // --- Detail 페이지 로직 (1단계 실행) ---

    if (isDetailPage) {
        console.log('[LIMS Report Auto] Detail page detected');

        const automationMode = GM_getValue('automation_mode');

        if (automationMode === 'stage1_generate') {
            console.log(`[LIMS Report Auto] Automation mode 'stage1_generate' active.`);

            const urlParams = new URLSearchParams(window.location.search);
            const myWorkNo = urlParams.get('workNo');

            // Alert 발생 시 폴링 중단용 플래그
            let alertTriggered = false;
            let successAlertTriggered = false;

            // 클릭 가능 여부 대기 함수
            async function waitForElementToBeClickable(selector, timeout = 20000) {
                log(`[LIMS Report Auto] Wating for ${selector} to be clickable...`);
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const check = () => {
                        // 중단 플래그 확인
                        if (GM_getValue('automation_cancelled', false)) {
                            reject(new Error('작업 중단됨 (cancelled)'));
                            return;
                        }
                        const element = document.querySelector(selector);
                        // !disabled && offsetParent !== null 체크
                        if (element && !element.disabled && element.offsetParent !== null) {
                            log(`[LIMS Report Auto] Element ${selector} is clickable.`);
                            resolve(element);
                        } else if (Date.now() - startTime > timeout) {
                            console.error(`[LIMS Report Auto] Timeout: ${selector} was not clickable.`);
                            reject(new Error(`Element not clickable: ${selector}`));
                        } else {
                            setTimeout(check, 250);
                        }
                    };
                    check();
                });
            }

            // --- Detail 페이지 헬퍼 함수 ---

            console.log('[LIMS Report Auto] window.confirm 오버라이드하여 다이얼로그 자동 클릭');
            const originalConfirm = unsafeWindow.confirm;
            unsafeWindow.confirm = function (msg) {
                log('[LIMS Report Auto] window.confirm 호출됨:', msg);
                if (msg && msg.includes('리포트') && msg.includes('하시겠습니까')) {
                    log('[LIMS Report Auto] 리포트 다이얼로그 자동 확인.');
                    return true;
                }
                console.warn('[LIMS Report Auto] 처리되지 않은 confirm 다이얼로그:', msg);
                return originalConfirm.apply(unsafeWindow, arguments);
            };

            // alert 훅을 수정하여 성공/실패 구분
            console.log('[LIMS Report Auto] window.alert 오버라이드하여 다이얼로그 자동 처리');
            const originalAlert = unsafeWindow.alert;
            unsafeWindow.alert = function (msg) {
                console.warn('[LIMS Report Auto] window.alert 호출됨:', msg);

                const msgStr = String(msg || '');

                // 성공 메시지 체크 (리포트제작완료)
                if (msgStr.includes('리포트제작완료') || msgStr.includes('완료되었습니다')) {
                    log('[LIMS Report Auto] 성공 alert 감지. 성공 플래그 설정.');
                    successAlertTriggered = true;
                    return; // alert 무시하고 아무것도 하지 않음
                }

                // ORA-00001 (무결성 제약 조건) 에러 체크
                // ORA-00001 에러는 '실패'로 처리
                if (msgStr.includes('ORA-00001') || msgStr.includes('무결성 제약 조건')) {
                    console.warn('[LIMS Report Auto] 무결성 제약 조건 에러 감지 (이미 레포트 존재). 메시지:', msgStr);
                    logFailure('이미 레포트가 존재함 (무결성 제약 조건)');
                    alertTriggered = true;
                    return;
                }

                // 에러 메시지 체크 (이미지 업로드, 필수 입력 항목, 기타 검증 실패)
                const isError = msgStr.includes('이미지가 업로드') ||
                    msgStr.includes('업로드 후 작업완료') ||
                    msgStr.includes('필수 입력 항목') ||
                    msgStr.includes('필수입력') ||
                    msgStr.includes('실패') ||
                    msgStr.includes('오류') ||
                    msgStr.includes('error');

                if (isError) {
                    console.error('[LIMS Report Auto] 에러 alert 감지. 메시지:', msgStr);
                    logFailure(msgStr); // alert 메시지를 실패 사유로 기록
                    alertTriggered = true; // 폴링 즉시 중단 플래그 설정
                    return;
                }

                // 예상하지 못한 alert (로그만 남기고 계속 진행)
                console.warn('[LIMS Report Auto] 알 수 없는 alert 메시지 (계속 진행):', msgStr);
                return;
            };

            const logFailure = (reason) => {
                // 중단으로 인한 실패는 로그하지 않음
                if (GM_getValue('automation_cancelled', false) || (reason && reason.includes('cancelled'))) {
                    log(`[LIMS Report Auto] ${myWorkNo} 작업 중단됨.`);
                    return; // 실패로 기록하지 않음
                }

                log(`[LIMS Report Auto] ${myWorkNo} 실패 기록: ${reason}`);
                const failedOrders = GM_getValue('failed_orders', []);
                if (!failedOrders.some(f => f.wkstId === myWorkNo)) {
                    failedOrders.push({
                        wkstId: myWorkNo,
                        reason: reason,
                        url: window.location.href
                    });
                    GM_setValue('failed_orders', failedOrders);
                }
                // *** [FIX v1.6.1] ***
                // 실패한 작업은 report_completed 플래그를 설정하지 않음 (성공만 카운트)
                // 대신 report_attempted 플래그를 설정하여 작업 시도 완료를 표시
                GM_setValue('report_attempted_' + myWorkNo, true);
            };

            // 한국어 날짜 파싱: "YYYY-MM-DD HH:MM:SS" 및 "YYYY-MM-DD 오전/오후 H:MM" 형식 지원
            const parseKoreanDate = (dateString) => {
                try {
                    if (!dateString || typeof dateString !== 'string') return null;

                    const trimmed = dateString.trim();

                    // "YYYY-MM-DD HH:MM:SS" 형식 먼저 시도 (Basic Info에서)
                    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
                        const [datePart, timePart] = trimmed.split(' ');
                        const [year, month, day] = datePart.split('-').map(Number);
                        const [hour, minute, second] = timePart.split(':').map(Number);

                        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
                            return new Date(year, month - 1, day, hour, minute, second);
                        }
                    }

                    // "YYYY-MM-DD 오전/오후 H:MM" 형식 시도 (PDF 파일 목록에서)
                    const parts = trimmed.split(' ');
                    if (parts.length >= 3) {
                        const date = parts[0];
                        const ampm = parts[1]; // "오전" 또는 "오후"
                        const time = parts[2];

                        const [year, month, day] = date.split('-').map(Number);
                        let [hour, minute] = time.split(':').map(Number);

                        // 숫자 유효성 검사
                        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
                            return null;
                        }

                        if (ampm === '오후' && hour !== 12) {
                            hour += 12;
                        }
                        if (ampm === '오전' && hour === 12) { // 자정
                            hour = 0;
                        }

                        return new Date(year, month - 1, day, hour, minute, 0);
                    }

                    return null;
                } catch (e) {
                    // 폴링 중 콘솔 에러 스팸 방지
                    return null;
                }
            };

            // *** [REMOVED v1.6] ***
            // verifyPdfFreshness 함수 제거됨 (PDF 열기를 하지 않으므로 불필요)
            // *** [END REMOVED v1.6] ***

            // PDF 생성 날짜 폴링 (날짜 변경 여부 체크)
            const waitForPdfDate = (clickTime, timeout = 30000) => {
                log('[LIMS Report Auto] 버튼 클릭 후 레포트 날짜 스탬프 대기 중...');
                let initialDateString = null;
                let hasSeenEmptyDate = false;
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const checkDate = () => {
                        // 중단 플래그 확인
                        if (GM_getValue('automation_cancelled', false)) {
                            reject(new Error('작업 중단됨 (cancelled)'));
                            return;
                        }
                        // 성공 Alert 플래그 먼저 체크
                        if (successAlertTriggered) {
                            log('[LIMS Report Auto] 성공 alert 감지됨. 레포트 생성 완료.');
                            resolve();
                            return;
                        }
                        // 에러 Alert 플래그 체크
                        if (alertTriggered) {
                            log('[LIMS Report Auto] Alert 발생, 날짜 대기 중단.');
                            reject(new Error('레포트 생성 실패 (Alert 발생)'));
                            return;
                        }

                        // Basic Info에서 레포트 생성 날짜 먼저 가져오기 시도 (더 정확)
                        let dateElement = document.querySelector('#reportRgsnDttm_t');
                        let dateString = dateElement ? dateElement.textContent.trim() : '';

                        // Basic Info 날짜를 찾지 못한 경우 PDF 파일 날짜로 폴백
                        if (!dateString) {
                            dateElement = document.querySelector('.ibupload_date');
                            dateString = dateElement ? dateElement.textContent.trim() : '';
                        }

                        // 빈 날짜 처리 (레포트 생성 중)
                        if (!dateString || dateString === '') {
                            if (!hasSeenEmptyDate) {
                                log('[LIMS Report Auto] 날짜가 비어있음 (레포트 생성 중)...');
                                hasSeenEmptyDate = true;
                            }
                            // 날짜가 나타날 때까지 계속 대기
                            if (Date.now() - startTime > timeout) {
                                console.error('[LIMS Report Auto] 타임아웃: 레포트 날짜가 나타나지 않음.');
                                reject(new Error('레포트 생성 시간 초과 (날짜 미표시)'));
                            } else {
                                setTimeout(checkDate, 100); // 100ms
                            }
                            return;
                        }

                        const parsedDate = parseKoreanDate(dateString);

                        if (parsedDate) {
                            // 첫 체크 시 초기 날짜 저장
                            if (initialDateString === null) {
                                initialDateString = dateString;
                                log(`[LIMS Report Auto] 초기 날짜: ${initialDateString}`);
                            }

                            const now = new Date();
                            const minutesDiff = (now.getTime() - parsedDate.getTime()) / 60000;
                            const timeSinceClick = parsedDate.getTime() - clickTime;

                            log(`[LIMS Report Auto] 날짜 발견: ${dateString} (${minutesDiff.toFixed(2)}분 전, 클릭 후 ${(timeSinceClick / 1000).toFixed(1)}초)`);

                            // 날짜가 변경되었거나 빈 상태 후 나타난 경우
                            if (dateString !== initialDateString || hasSeenEmptyDate) {
                                log('[LIMS Report Auto] 날짜 변경됨 또는 생성 후 나타남. 성공.');
                                resolve();
                                return;
                            } else if (minutesDiff < 2) {
                                // 날짜가 변경되지 않았지만 아주 최근(2분 이내) - 방금 생성된 것으로 가정
                                log('[LIMS Report Auto] 날짜가 아주 최근(2분 이내). 방금 생성된 것으로 가정. 성공.');
                                resolve();
                                return;
                            }
                        }

                        if (Date.now() - startTime > timeout) {
                            console.error('[LIMS Report Auto] 타임아웃: 레포트 날짜 스탬프가 나타나지 않거나 업데이트되지 않음.');
                            reject(new Error('레포트 생성 시간 초과 (날짜 미표시)'));
                        } else {
                            setTimeout(checkDate, 100); // 100ms
                        }
                    };
                    checkDate();
                });
            };

            // 페이지 로딩 강화 (기본 필드 + 레포트 영역 확인)
            const waitForPageReady = (timeout = 30000) => {
                log('[LIMS Report Auto] 페이지 로딩 대기 (ordAcpgDttm + 레포트 영역 체크)...');
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const checkData = () => {
                        // 중단 플래그 확인
                        if (GM_getValue('automation_cancelled', false)) {
                            reject(new Error('작업 중단됨 (cancelled)'));
                            return;
                        }

                        // 1차 체크: ordAcpgDttm (기본 정보 로딩)
                        const ordAcpgDttm = document.querySelector("#ordAcpgDttm");
                        const ordAcpgVal = ordAcpgDttm ? ordAcpgDttm.value.trim() : '';

                        if (ordAcpgVal.length === 0) {
                            // 아직 기본 정보도 안 떴음
                            if (Date.now() - startTime > timeout) {
                                console.error('[LIMS Report Auto] 타임아웃: ordAcpgDttm 로딩 실패');
                                reject(new Error(`페이지 로딩 타임아웃 (${timeout}ms)`));
                            } else {
                                setTimeout(checkData, 50);
                            }
                            return;
                        }

                        // 2차 체크: 레포트 영역이 DOM에 존재하는지만 확인
                        const reportDateElement = document.querySelector('#reportRgsnDttm_t');
                        const fileListArea = document.querySelector('#fileDtlData_fileview');

                        // 레포트 정보 영역이 하나라도 존재하면 OK
                        if (reportDateElement || fileListArea) {
                            log(`[LIMS Report Auto] ✓ 페이지 로딩 완료! (ordAcpgDttm: ${ordAcpgVal}, 레포트 영역 확인됨)`);
                            resolve();
                        } else if (Date.now() - startTime > timeout) {
                            console.error('[LIMS Report Auto] 타임아웃: 레포트 영역 로딩 실패');
                            reject(new Error(`페이지 로딩 타임아웃 (레포트 영역 미확인, ${timeout}ms)`));
                        } else {
                            setTimeout(checkData, 50); // 50ms마다 빠르게 체크
                        }
                    };
                    checkData();
                });
            };

            // 수정: 값이 아닌 필드 *존재* 여부만 확인
            const waitForReportDataReady = (timeout = 30000) => {
                log('[LIMS Report Auto] 레포트 데이터 API 응답 대기 중 (필드 존재 여부 확인)...');
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();

                    // rptId 필드가 *존재*하면 데이터 로딩 완료로 간주 (값이 없어도 됨)
                    const checkData = () => {
                        if (GM_getValue('automation_cancelled', false)) {
                            reject(new Error('작업 중단됨 (cancelled)'));
                            return;
                        }

                        // rptId 필드 확인 (hidden input)
                        const rptIdInput = document.querySelector('input[name="rptId"]');
                        // atchmnflNo 필드 확인 (파일 첨부 번호)
                        const atchmnflNoInput = document.querySelector('input[name="atchmnflNo"]');

                        // 두 필드가 DOM에 *존재*하면 서버 데이터 관련 UI가 로드된 것으로 간주
                        // (값이 비어있는 것은 '신규 레포트' 상태이므로 정상임)
                        if (rptIdInput && atchmnflNoInput) {
                            const rptIdValue = rptIdInput ? rptIdInput.value.trim() : '';
                            const atchmnflNoValue = atchmnflNoInput ? atchmnflNoInput.value.trim() : '';
                            log(`[LIMS Report Auto] ✓ 레포트 데이터 필드 확인됨 (rptId: ${rptIdValue || 'empty'}, atchmnflNo: ${atchmnflNoValue || 'empty'})`);
                            resolve();
                        } else if (Date.now() - startTime > timeout) {
                            console.error('[LIMS Report Auto] 타임아웃: 레포트 데이터 필드(input[name="rptId"] 등) 로딩 실패');
                            reject(new Error(`레포트 데이터 필드 로딩 타임아웃 (${timeout}ms)`));
                        } else {
                            setTimeout(checkData, 50);
                        }
                    };
                    checkData();
                });
            };


            // *** [REMOVED v1.6] ***
            // PDF 열기 관련 함수들 제거됨 (openPdfNextToCurrentTab, fallbackToDoubleClick, waitForPdfTrigger)
            // 모든 페이지에서 PDF는 생성만 하고 열지 않음
            // *** [END REMOVED v1.6] ***

            // 병렬 실행 방식 메인 로직 (Detail 페이지)
            (async () => {
                try {
                    log(`[LIMS Report Auto] ${myWorkNo}: (Stage A) 레포트 생성 시작 (병렬 실행)...`);

                    // 중단 플래그 확인
                    if (GM_getValue('automation_cancelled', false)) {
                        console.warn(`[LIMS Report Auto] ${myWorkNo}: 작업 중단(Cancel) 신호 감지.`);
                        throw new Error('작업 중단됨 (cancelled)');
                    }

                    // 1. 페이지 로딩 대기
                    log(`[LIMS Report Auto] ${myWorkNo}: 페이지 로딩 대기...`);
                    await waitForPageReady(30000);
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 페이지 로딩 완료`);

                    // 2. IBSheet Object 대기
                    log(`[LIMS Report Auto] ${myWorkNo}: IBSheet Object 대기...`);
                    const detailSheet = await waitForDetailSheet(30000); // 시트 객체 확보
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ IBSheet Object 로드 완료`);

                    //레포트 데이터 API 응답 대기 (ORA-00001 방지)
                    log(`[LIMS Report Auto] ${myWorkNo}: 레포트 데이터 로딩 대기...`);
                    await waitForReportDataReady(30000); // *** 수정된 함수 ***
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 레포트 데이터 로딩 완료`);

                    //버튼 활성화까지 대기한 후 ready 플래그 설정
                    log(`[LIMS Report Auto] ${myWorkNo}: 레포트 버튼 활성화 대기...`);
                    const btnReport = await waitForElementToBeClickable('#btnReport', 30000); // 30초 대기
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 레포트 버튼 활성화 완료`);

                    // 3. 페이지 준비 완료 신호 전송 (데이터 + 버튼 모두 준비 완료!)
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 페이지 준비 완료!`);
                    GM_setValue('page_ready_' + myWorkNo, true);

                    // 4. 클릭 신호 대기
                    log(`[LIMS Report Auto] ${myWorkNo}: 클릭 신호 대기 중...`);
                    const clickWaitStart = Date.now();
                    const clickWaitTimeout = 300000; // 5분
                    let clickSignalReceived = false;

                    while (!clickSignalReceived && (Date.now() - clickWaitStart < clickWaitTimeout)) {
                        if (GM_getValue('automation_cancelled', false)) {
                            throw new Error('작업 중단됨 (cancelled)');
                        }

                        clickSignalReceived = GM_getValue('click_signal_' + myWorkNo, false);
                        if (clickSignalReceived) {
                            break;
                        }

                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    if (!clickSignalReceived) {
                        throw new Error('클릭 신호 대기 시간 초과 (5분)');
                    }

                    // 클릭 중복 방지 - 이미 클릭했는지 확인
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 클릭 신호 수신!`);
                    const alreadyClicked = GM_getValue('report_click_time_' + myWorkNo, 0);
                    if (alreadyClicked > 0) {
                        console.warn(`[LIMS Report Auto] ${myWorkNo}: ⚠ 이미 클릭됨. 중복 클릭 방지 (${new Date(alreadyClicked).toISOString()})`);
                        return; // 중복 클릭 방지
                    }

                    // 신선도 체크 제거 - LIMS가 알아서 덮어쓰기 처리함. 무조건 클릭!
                    log(`[LIMS Report Auto] ${myWorkNo}: 레포트 생성 버튼 클릭 준비 (기존 레포트 있어도 LIMS가 알아서 덮어씀)`);

                    // 5. 레포트 버튼 클릭
                    const clickTime = Date.now();
                    log(`[LIMS Report Auto] ${myWorkNo}: 레포트 버튼 클릭 시간:`, new Date(clickTime).toISOString());
                    GM_setValue('report_click_time_' + myWorkNo, clickTime);

                    if (isLibraryProductDetail) {
                        log(`[LIMS Report Auto] ${myWorkNo}: Library Product Detail 페이지 감지. 버그있는 fnReport() 검증 우회.`);
                        try {
                            // detailSheet 변수 사용 (이미 로드됨)
                            var saveData = detailSheet.GetSaveJson({
                                "StdCol": "ibCheck",
                                "StdColValue": "1",
                                "ValidKeyField": 0
                            });

                            new unsafeWindow.CommonAjax("/ngs/library/makeReportProductWorkDetail.do")
                                .addParam({ "ibsProductWorkDetail": saveData })
                                .addParam(unsafeWindow.frmProductWorkDetail)
                                .confirm("리포트 제작 하시겠습니까?") // 훅이 잡음
                                .callback(function (resultData) {
                                    unsafeWindow.alert("리포트제작완료 되었습니다."); // 훅이 잡음
                                    unsafeWindow.fnRetrieve();
                                })
                                .execute();

                        } catch (e) {
                            console.error(`[LIMS Report Auto] ${myWorkNo}: 우회한 fnReport() 호출 실패:`, e);
                            throw e;
                        }
                    } else {
                        log(`[LIMS Report Auto] ${myWorkNo}: Non-Product 페이지. 레포트 버튼 직접 클릭.`);
                        btnReport.click();
                    }

                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ 레포트 생성 *요청* 완료!`);

                    // 6. PDF 생성 대기
                    await waitForPdfDate(clickTime, 60000);
                    log(`[LIMS Report Auto] ${myWorkNo}: ✓ PDF 생성 완료!`);

                    // PDF 준비 완료 플래그 설정
                    let finalDateElement = document.querySelector('#reportRgsnDttm_t');
                    let finalDateString = finalDateElement ? finalDateElement.textContent.trim() : '';
                    if (!finalDateString) {
                        finalDateElement = document.querySelector('.ibupload_date');
                        finalDateString = finalDateElement ? finalDateElement.textContent.trim() : '';
                    }

                    GM_setValue('pdf_ready_' + myWorkNo, true);
                    GM_setValue('pdf_date_' + myWorkNo, finalDateString);
                    GM_setValue('pdf_generated_time_' + myWorkNo, Date.now());
                    log(`[LIMS Report Auto] ${myWorkNo}: PDF 준비 완료로 표시, 날짜: ${finalDateString}`);

                    log(`[LIMS Report Auto] ${myWorkNo}: (Stage A) 레포트 생성 완료.`);

                } catch (error) {
                    console.error(`[LIMS Report Auto] ${myWorkNo}: Detail 페이지 (Stage A) 오류:`, error);
                    if (!alertTriggered && !error.message.includes('cancelled')) {
                        logFailure('오류: ' + error.message);
                    } else if (error.message.includes('cancelled')) {
                        logFailure('작업 중단됨 (cancelled)');
                    }
                    // *** [FIX v1.6.2] ***
                    // 에러 발생 시 attempted만 설정하고 종료 (logFailure에서 이미 설정함)
                    return;
                } finally {
                    // *** [FIX v1.6.2] ***
                    // 성공한 경우에만 completed 플래그 설정
                    // (에러 발생 시 catch에서 return되므로 여기 도달 안 함)
                    GM_setValue('report_completed_' + myWorkNo, true);
                    GM_setValue('report_attempted_' + myWorkNo, true);
                    log(`[LIMS Report Auto] ${myWorkNo}: (Stage A) 완료 신호 전송`);

                    // *** [MODIFICATION v1.6] ***
                    // 모든 작업에 대해 PDF 열기(Stage B)를 건너뜁니다.
                    log(`[LIMS Report Auto] ${myWorkNo}: PDF 열기 대기(Stage B)를 건너뜁니다 (생성만).`);
                    // *** [END MODIFICATION v1.6] ***
                }
            })();
        }
    }

})();