// ==UserScript==
// @name         LIMS QC 주간, 월간 리포트 통합 자동화
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  LIMS Sample QC, Library QC, Library 대기 리포트 자동화
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveQcWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveWaitForm.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555369/LIMS%20QC%20%EC%A3%BC%EA%B0%84%2C%20%EC%9B%94%EA%B0%84%20%EB%A6%AC%ED%8F%AC%ED%8A%B8%20%ED%86%B5%ED%95%A9%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/555369/LIMS%20QC%20%EC%A3%BC%EA%B0%84%2C%20%EC%9B%94%EA%B0%84%20%EB%A6%AC%ED%8F%AC%ED%8A%B8%20%ED%86%B5%ED%95%A9%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // [설정] 디버그 모드 (true면 콘솔 로그가 표시됩니다)
    const DEBUG = false;
    const log = (...args) => DEBUG && console.log(...args);
    const warn = (...args) => DEBUG && console.warn(...args);
    const error = (...args) => console.error(...args); // 에러는 중요하므로 일단 유지

    // 스크립트 이중 실행 방지
    if (window.myLimsAutomationScriptRunning) {
        log('[LIMS 자동화] 스크립트가 이미 실행 중입니다.');
        return;
    }
    window.myLimsAutomationScriptRunning = true;

    log('[LIMS 자동화] 스크립트 시작 (v1.3)');

    const currentUrl = window.location.href;
    const isMainPage = currentUrl.includes('/main.do');
    const isSampleQcPage = currentUrl.includes('/ngs/sample/retrieveQcWorkForm.do');
    const isLibraryQcPage = currentUrl.includes('/ngs/library/retrieveQcWorkForm.do');
    const isLibraryWaitPage = currentUrl.includes('/ngs/library/retrieveWaitForm.do');

    function calculateWeeklyDateRange() {
        const today = new Date();
        const dayOfWeek = today.getDay();

        let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
        const endTuesday = new Date(today);
        endTuesday.setDate(today.getDate() + daysUntilTuesday);

        // 수요일(3) 이후 또는 일요일(0)이면 지난 주 화요일 기준
        if (dayOfWeek >= 3 || dayOfWeek === 0) {
            endTuesday.setDate(endTuesday.getDate() - 7);
        }

        const startWednesday = new Date(endTuesday);
        startWednesday.setDate(endTuesday.getDate() - 6);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(startWednesday),
            endDate: formatDate(endTuesday)
        };
    }

    // --- 유틸리티 함수: 날짜 계산 (이전 달 1일 ~ 말일)
    function calculateMonthlyDateRange() {
        const today = new Date();
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(firstDayOfLastMonth),
            endDate: formatDate(lastDayOfLastMonth)
        };
    }

    // --- 유틸리티 함수: 요소가 나타날 때까지 대기
    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    log(`[LIMS 자동화] 요소 찾음: ${selector}`);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    error(`[LIMS 자동화] 타임아웃: ${selector}`);
                    reject(new Error(`요소를 찾을 수 없습니다: ${selector}`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    }

    // --- 유틸리티 함수: 페이지가 완전히 로드될 때까지 대기
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                log('[LIMS 자동화] 페이지 이미 로드됨');
                resolve();
            } else {
                window.addEventListener('load', () => {
                    log('[LIMS 자동화] 페이지 로드 완료');
                    resolve();
                });
            }
        });
    }

    // --- 유틸리티 함수: IBSheet 객체 재귀 탐색
    function findSheetObject(currentWindow, sheetName) {
        try {
            if (currentWindow[sheetName] && typeof currentWindow[sheetName].GetTotalRows === 'function') {
                log(`[LIMS 자동화] ${sheetName} 객체를 윈도우에서 찾았습니다:`, currentWindow.location.href);
                return currentWindow[sheetName];
            }
            for (let i = 0; i < currentWindow.frames.length; i++) {
                const frameWindow = currentWindow.frames[i];
                const sheetInFrame = findSheetObject(frameWindow, sheetName);
                if (sheetInFrame) {
                    return sheetInFrame;
                }
            }
        } catch (error) {
            // 보안 오류 무시
        }
        return null;
    }

    // --- 유틸리티 함수: 브라우저 알림
    async function showNotification(title, body) {
        if (!("Notification" in window)) {
            warn("[LIMS 자동화] 브라우저가 알림을 지원하지 않습니다. alert으로 대체합니다.");
            alert(title + "\n\n" + body);
            return;
        }
        try {
            if (Notification.permission === "granted") {
                new Notification(title, { body: body });
            } else if (Notification.permission !== "denied") {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    new Notification(title, { body: body });
                } else {
                    alert(title + "\n\n" + body);
                }
            } else {
                alert(title + "\n\n" + body);
            }
        } catch (e) {
            error("[LIMS 자동화] 알림 표시 중 오류:", e);
        }
    }

    // --- 유틸리티 함수: PDF 다운로드 (v3.7)
    async function downloadPdf(url, filename) {
        log(`[LIMS 자동화] PDF 다운로드 시도: ${filename} (${url})`);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            log(`[LIMS 자동화] PDF 다운로드 완료: ${filename}`);
            return true;
        } catch (error) {
            error(`[LIMS 자동화] PDF 다운로드 실패: ${filename}`, error);
            showNotification('❌ 다운로드 실패', `파일 다운로드 중 오류가 발생했습니다: ${filename}`);
            return false;
        }
    }

    // --- 유틸리티 함수: HiFi PDF 다운로드 실행 (v3.8 분리, v3.14 디버깅 강화)
    async function executeHiFiPdfDownload(sheet) {
        log('[LIMS 자동화] ========================================');
        log('[LIMS 자동화] HiFi PDF 다운로드 로직 진입');
        log('[LIMS 자동화] ========================================');

        // 성공/실패 카운터
        let successCount = 0;
        let targetCount = 0;

        // 1. 컬럼 인덱스 찾기
        let colPlatform = -1;
        let colLibKit = -1;
        let colReport = -1;
        let colFileId = -1; // 파일 ID 컬럼 인덱스 추가

        // IBSheet 컬럼 헤더 텍스트로 인덱스 찾기
        const headerRows = sheet.HeaderRows(); // 헤더 행 개수 확인
        log(`[LIMS 자동화] 헤더 행 개수: ${headerRows}`);
        log(`[LIMS 자동화] 총 컬럼 개수: ${sheet.LastCol() + 1}`);

        // 모든 헤더 출력 (디버깅용)
        log('[LIMS 자동화] === 헤더 정보 시작 ===');
        for (let r = 0; r < headerRows; r++) {
            for (let c = 0; c <= sheet.LastCol(); c++) {
                const headerText = sheet.GetCellText(r, c);
                log(`[LIMS 자동화] 헤더[${r},${c}]: "${headerText}"`);
            }
        }
        log('[LIMS 자동화] === 헤더 정보 종료 ===');

        for (let r = 0; r < headerRows; r++) {
            for (let c = 0; c <= sheet.LastCol(); c++) {
                const headerText = sheet.GetCellText(r, c).toLowerCase();

                if (colPlatform === -1 && (headerText.includes('platform') || headerText.includes('플랫폼'))) {
                    colPlatform = c;
                    log(`[LIMS 자동화] ✅ Platform 컬럼 찾음: ${c} (Row ${r})`);
                }
                if (colLibKit === -1 && (headerText.includes('lib kit') || headerText.includes('library kit'))) {
                    colLibKit = c;
                    log(`[LIMS 자동화] ✅ LIB KIT 컬럼 찾음: ${c} (Row ${r})`);
                }
                if (colReport === -1 && (headerText.includes('report') || headerText.includes('리포트'))) {
                    colReport = c;
                    log(`[LIMS 자동화] ✅ REPORT 컬럼 찾음: ${c} (Row ${r})`);
                }
                if (colFileId === -1 && (headerText.includes('첨부파일') || headerText.includes('file') && headerText.includes('id') || headerText.includes('atch'))) {
                    colFileId = c;
                    log(`[LIMS 자동화] ✅ 파일 ID 컬럼 찾음: ${c} (Row ${r})`);
                }
            }
        }

        log(`[LIMS 자동화] 컬럼 인덱스 최종 확인: Platform=${colPlatform}, LIB KIT=${colLibKit}, REPORT=${colReport}, FILE_ID=${colFileId}`);

        if (colPlatform === -1 || colLibKit === -1 || colReport === -1) {
            error('[LIMS 자동화] ❌ 필요한 컬럼을 찾지 못했습니다.');
            alert('필요한 컬럼(Platform, LIB KIT, REPORT)을 찾지 못했습니다.\n콘솔 로그에서 헤더 정보를 확인해주세요.');
            return;
        }

        const firstRow = sheet.HeaderRows();
        const lastRow = sheet.LastRow();
        let downloadCount = 0;
        // targetCount는 함수 시작 부분에서 이미 선언됨

        log(`[LIMS 자동화] 데이터 행 범위: ${firstRow} ~ ${lastRow}`);

        for (let row = firstRow; row <= lastRow; row++) {
            const platformVal = sheet.GetCellText(row, colPlatform);
            const libKitVal = sheet.GetCellText(row, colLibKit);

            const isRevio = platformVal.includes('Revio') || platformVal === 'RV';
            const isHiFi = libKitVal.includes('[3.0] PacBio HiFi Library');

            if (isRevio && isHiFi) {
                targetCount++;
                log(`[LIMS 자동화] 🎯 다운로드 대상 발견 (Row ${row}): Platform="${platformVal}" / LIB KIT="${libKitVal}"`);

                const cellValue = sheet.GetCellValue(row, colReport);
                const fileIdValue = sheet.GetCellValue(row, colFileId);
                log(`[LIMS 자동화]    REPORT 값: "${cellValue}"`);
                log(`[LIMS 자동화]    첨부파일 번호: "${fileIdValue}"`);

                if (cellValue && fileIdValue) {
                    log(`[LIMS 자동화]    📥 PDF 다운로드 시도 (fnAttachFileDownForm 사용)`);

                    try {
                        if (typeof unsafeWindow.fnAttachFileDownForm === 'function') {
                            unsafeWindow.fnAttachFileDownForm(fileIdValue, 1, false);
                            successCount++;
                            await new Promise(r => setTimeout(r, 500));
                            continue;
                        } else {
                            log(`[LIMS 자동화]    ⚠️ fnAttachFileDownForm 함수가 없습니다. 대체 방법 시도...`);
                        }

                    } catch (err) {
                        error(`[LIMS 자동화]    ❌ 다운로드 실패:`, err);
                    }
                } else if (!fileIdValue) {
                    log(`[LIMS 자동화]    ⚠️ 첨부파일 번호가 없어서 건너뜀`);
                    continue;
                }

                // 기존 클릭 시도 코드 (fnAttachFileDownForm이 없을 경우 대체)
                if (cellValue) {
                    log(`[LIMS 자동화]    📥 PDF 다운로드 시도 (클릭 방식)`);

                    try {
                        // window.open 후킹으로 새 탭 대신 다운로드 처리
                        const originalWindowOpen = unsafeWindow.open;
                        let downloadTriggered = false;

                        // window.open() 가로채기
                        unsafeWindow.open = function (url, target, features) {
                            log(`[LIMS 자동화]    🔍 window.open 감지: ${url}`);

                            // PDF URL인지 확인
                            if (url && (url.includes('.pdf') || url.includes('fileDown.do'))) {
                                log(`[LIMS 자동화]    📄 PDF URL 캡처 성공!`);

                                // 새 탭 열지 않고 다운로드 처리
                                downloadTriggered = true;

                                // fetch로 PDF 가져와서 다운로드
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: url,
                                    responseType: 'blob',
                                    onload: function (response) {
                                        try {
                                            log(`[LIMS 자동화]    ✅ PDF 다운로드 시작...`);

                                            // Blob 생성
                                            const blob = response.response;

                                            // 다운로드 링크 생성
                                            const downloadUrl = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = downloadUrl;
                                            a.download = cellValue; // 파일명 설정
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);

                                            // URL 해제
                                            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

                                            log(`[LIMS 자동화]    ✅ PDF 다운로드 완료: ${cellValue}`);
                                        } catch (err) {
                                            error(`[LIMS 자동화]    ❌ 다운로드 처리 실패:`, err);
                                        }
                                    },
                                    onerror: function (error) {
                                        error(`[LIMS 자동화]    ❌ PDF fetch 실패:`, error);
                                    }
                                });

                                // 새 탭 열지 않고 null 반환
                                return null;
                            }

                            // PDF가 아니면 정상적으로 새 탭 열기
                            return originalWindowOpen.call(this, url, target, features);
                        };

                        // IBSheet 셀 클릭을 통한 다운로드
                        log(`[LIMS 자동화]    🖱️ IBSheet 셀 클릭 시도...`);

                        try {
                            // 핵심: 가상 스크롤 대응 - 행을 화면에 표시
                            log(`[LIMS 자동화]    📍 ScrollToRow(${row})로 행을 화면에 표시`);
                            if (typeof sheet.ScrollToRow === 'function') {
                                sheet.ScrollToRow(row);
                                await new Promise(r => setTimeout(r, 500)); // 렌더링 대기
                            } else if (typeof sheet.GoToRow === 'function') {
                                sheet.GoToRow(row);
                                await new Promise(r => setTimeout(r, 500));
                            }

                            // SelectCell로 셀 활성화 (렌더링 트리거 + 포커스)
                            log(`[LIMS 자동화]    📌 SelectCell(${row}, ${colReport}) 호출`);
                            sheet.SelectCell(row, colReport);
                            await new Promise(r => setTimeout(r, 500)); // 렌더링 대기 증가

                            // DOM에서 <u> 태그 직접 검색
                            const allUTags = document.querySelectorAll('td u');
                            let foundElement = null;

                            log(`[LIMS 자동화]    🔍 총 ${allUTags.length}개의 <u> 태그 검색 중...`);

                            for (let uTag of allUTags) {
                                const uText = uTag.textContent.trim();
                                if (uText === cellValue) {
                                    foundElement = uTag;
                                    log(`[LIMS 자동화]    ✅ 매칭 <u> 태그 찾음!`);
                                    log(`[LIMS 자동화]    <u> textContent: "${uText}"`);
                                    log(`[LIMS 자동화]    <u> innerHTML:`, uTag.innerHTML);
                                    log(`[LIMS 자동화]    부모 <td> outerHTML:`, uTag.parentElement.outerHTML.substring(0, 300));
                                    break;
                                }
                            }

                            if (foundElement) {
                                const parentTd = foundElement.parentElement;
                                const parentTr = parentTd ? parentTd.parentElement : null;

                                log(`[LIMS 자동화]    🎯 클릭 대상 확인`);
                                log(`[LIMS 자동화]    <u> onclick:`, foundElement.onclick);
                                log(`[LIMS 자동화]    <td> onclick:`, parentTd.onclick);
                                if (parentTr) {
                                    log(`[LIMS 자동화]    <tr> onclick:`, parentTr.onclick);
                                }

                                // 핵심: IBSheet 내부 클릭 핸들러 찾기
                                log(`[LIMS 자동화]    🔍 IBSheet 객체 구조 탐색 중...`);

                                // IBSheet 컬럼 정의 확인
                                if (sheet.Cols && sheet.Cols[colReport]) {
                                    const reportCol = sheet.Cols[colReport];
                                    log(`[LIMS 자동화]    REPORT 컬럼 정의:`, Object.keys(reportCol).join(', '));

                                    if (reportCol.OnClick) {
                                        log(`[LIMS 자동화]    ✅ OnClick 핸들러 발견!`);
                                        log(`[LIMS 자동화]    OnClick 함수:`, reportCol.OnClick.toString().substring(0, 200));
                                    }
                                }

                                // IBSheet의 이벤트 핸들러 확인
                                log(`[LIMS 자동화]    Sheet 이벤트 핸들러:`);
                                log(`[LIMS 자동화]    - OnClick:`, sheet.OnClick ? 'O' : 'X');
                                log(`[LIMS 자동화]    - OnCellClick:`, sheet.OnCellClick ? 'O' : 'X');
                                log(`[LIMS 자동화]    - OnDblClick:`, sheet.OnDblClick ? 'O' : 'X');

                                // ========================================
                                // 🔍 페이지의 전역 함수 분석하여 PDF 다운로드 핸들러 찾기
                                // ========================================
                                log(`[LIMS 자동화]    🔍 페이지 전역 함수 분석 중...`);

                                // 1. window 객체에서 PDF 관련 함수 찾기
                                const pdfRelatedFunctions = [];
                                for (let key in unsafeWindow) {
                                    if (typeof unsafeWindow[key] === 'function') {
                                        const funcName = key.toLowerCase();
                                        if (funcName.includes('pdf') || funcName.includes('download') ||
                                            funcName.includes('report') || funcName.includes('file') ||
                                            funcName.includes('open') || funcName.includes('view')) {
                                            pdfRelatedFunctions.push(key);
                                        }
                                    }
                                }

                                if (pdfRelatedFunctions.length > 0) {
                                    log(`[LIMS 자동화]    ✅ 발견된 PDF 관련 함수들:`, pdfRelatedFunctions.join(', '));

                                    // 각 함수의 소스 코드 일부 확인
                                    pdfRelatedFunctions.forEach(funcName => {
                                        const funcStr = unsafeWindow[funcName].toString();
                                        if (funcStr.length < 500) {
                                            log(`[LIMS 자동화]    📝 ${funcName}():`, funcStr.substring(0, 200));
                                        } else {
                                            log(`[LIMS 자동화]    📝 ${funcName}(): [${funcStr.length} chars]`, funcStr.substring(0, 100) + '...');
                                        }
                                    });
                                }

                                // 2. IBSheet 객체의 이벤트 핸들러 속성들 확인
                                log(`[LIMS 자동화]    🔍 IBSheet 이벤트 핸들러 분석 중...`);
                                const sheetProps = Object.keys(sheet).filter(key =>
                                    key.toLowerCase().includes('click') ||
                                    key.toLowerCase().includes('event') ||
                                    key.toLowerCase().includes('handler')
                                );

                                if (sheetProps.length > 0) {
                                    log(`[LIMS 자동화]    ✅ IBSheet 이벤트 관련 속성:`, sheetProps.join(', '));
                                    sheetProps.forEach(prop => {
                                        if (typeof sheet[prop] === 'function') {
                                            const funcStr = sheet[prop].toString();
                                            log(`[LIMS 자동화]    📝 sheet.${prop}:`, funcStr.substring(0, 150) + '...');
                                        } else {
                                            log(`[LIMS 자동화]    📝 sheet.${prop}:`, sheet[prop]);
                                        }
                                    });
                                }

                                // 3. REPORT 컬럼 설정 확인 (혹시 컬럼에 URL 패턴이 있을 수도)
                                log(`[LIMS 자동화]    🔍 REPORT 컬럼 설정 분석 중...`);
                                // colReport는 이미 위에서 선언됨
                                if (colReport !== -1) {
                                    const colInfo = {
                                        Type: sheet.GetColType ? sheet.GetColType(colReport) : 'unknown',
                                        Format: sheet.GetColFormat ? sheet.GetColFormat(colReport) : 'unknown',
                                        EditType: sheet.GetColEditType ? sheet.GetColEditType(colReport) : 'unknown'
                                    };
                                    log(`[LIMS 자동화]    ✅ REPORT 컬럼 정보:`, colInfo);
                                }

                                // 4. 셀의 실제 DOM 엘리먼트에서 이벤트 리스너 확인
                                log(`[LIMS 자동화]    🔍 DOM 이벤트 리스너 분석 중...`);
                                const cellValue = sheet.GetCellValue(row, colReport);
                                log(`[LIMS 자동화]    📄 셀 값:`, cellValue);

                                // DOM에서 이 파일명을 가진 엘리먼트 찾기
                                const allUTags = sheet.Container.querySelectorAll('u');
                                let targetElement = null;
                                for (let u of allUTags) {
                                    if (u.textContent.trim() === cellValue) {
                                        targetElement = u;
                                        break;
                                    }
                                }

                                if (targetElement) {
                                    log(`[LIMS 자동화]    ✅ DOM 엘리먼트 발견:`, targetElement);

                                    // 엘리먼트의 모든 속성 확인
                                    const attrs = {};
                                    for (let attr of targetElement.attributes || []) {
                                        attrs[attr.name] = attr.value;
                                    }
                                    log(`[LIMS 자동화]    📝 엘리먼트 속성들:`, attrs);

                                    // 부모 요소들 확인
                                    let parent = targetElement.parentElement;
                                    let level = 1;
                                    while (parent && level <= 3) {
                                        log(`[LIMS 자동화]    📝 부모${level}: <${parent.tagName}>`,
                                            parent.className ? `class="${parent.className}"` : '',
                                            parent.onclick ? 'onclick=있음' : 'onclick=없음');
                                        parent = parent.parentElement;
                                        level++;
                                    }
                                }

                                // ========================================
                                // ⚠️ 분석 완료 - 클릭 시도는 일단 중단
                                // ========================================
                                log(`[LIMS 자동화]    ⚠️ 분석 로그 출력 완료. 위 정보를 검토하세요.`);
                                log(`[LIMS 자동화]    💡 PDF 관련 함수나 IBSheet 이벤트 핸들러를 찾으면 직접 호출할 수 있습니다.`);

                                // 일단 클릭 시도는 건너뛰고 다음 파일로
                                if (false) {  // 분석이 끝나면 이 조건을 true로 변경
                                    log(`[LIMS 자동화]    ⚠️ 클릭 시도 건너뛰기 (분석 모드)`);

                                    // 방법 3: IBSheet 테이블 자체에 이벤트 발생
                                    if (ibsheetDiv) {
                                        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                                            const evt = new MouseEvent(eventType, {
                                                bubbles: true,
                                                cancelable: true,
                                                view: unsafeWindow,
                                                button: 0,
                                                buttons: eventType === 'mousedown' ? 1 : 0,
                                                clientX: centerX,
                                                clientY: centerY,
                                                screenX: centerX,
                                                screenY: centerY,
                                                target: foundElement
                                            });
                                            ibsheetDiv.dispatchEvent(evt);
                                        });
                                    }
                                }

                                log(`[LIMS 자동화]    클릭 처리 완료`);
                            } else {
                                error(`[LIMS 자동화]    ❌ <u> 태그를 찾지 못함: "${cellValue}"`);
                                log(`[LIMS 자동화]    💡 ShowRow()가 실행되었는지 확인 필요`);

                                // 디버깅: 현재 DOM에 있는 모든 <u> 태그 출력
                                if (allUTags.length > 0) {
                                    log(`[LIMS 자동화]    현재 DOM의 <u> 태그들 (최대 5개):`);
                                    for (let i = 0; i < Math.min(5, allUTags.length); i++) {
                                        log(`[LIMS 자동화]    - ${i + 1}: "${allUTags[i].textContent.trim()}"`);
                                    }
                                }
                            }

                            // 다운로드 완료 대기
                            await new Promise(r => setTimeout(r, 1500));

                            if (downloadTriggered) {
                                log(`[LIMS 자동화]    ✅ 다운로드 성공!`);
                                downloadCount++;
                            } else {
                                warn(`[LIMS 자동화]    ⚠️ window.open이 호출되지 않았습니다. 셀을 찾지 못했거나 다른 방식으로 동작할 수 있습니다.`);
                            }
                        } catch (clickErr) {
                            error(`[LIMS 자동화]    ❌ 클릭 시뮬레이션 실패:`, clickErr);
                        }

                        // window.open 복원
                        unsafeWindow.open = originalWindowOpen;

                        log(`[LIMS 자동화]    처리 완료 (${downloadCount}/${targetCount})`);

                    } catch (err) {
                        error(`[LIMS 자동화]    ❌ 다운로드 실패: ${err}`);
                        error(`[LIMS 자동화]    에러 스택:`, err.stack);
                    }
                } else {
                    warn(`[LIMS 자동화]    ⚠️ REPORT 컬럼 값이 비어있습니다.`);
                }
            }
        }

        log(`[LIMS 자동화] 다운로드 결과: ${successCount}/${targetCount} 성공`);

        if (successCount > 0) {
            showNotification('✅ HiFi 리포트 다운로드 성공', `${successCount}개의 PDF 파일을 다운로드했습니다.`);
        } else if (targetCount > 0) {
            showNotification('⚠️ 다운로드 실패', `${targetCount}개의 대상을 찾았으나 다운로드에 실패했습니다.\n콘솔 로그를 확인해주세요.`);
        } else {
            log('[LIMS 자동화] 조건에 맞는 HiFi 리포트가 없습니다.');
            showNotification('ℹ️ 다운로드 없음', '조건에 맞는 HiFi 리포트가 없습니다.');
        }
    }

    // --- 유틸리티 함수: 시트 검색 완료 대기
    function awaitSheetSearch(sheet, timeoutSeconds = 60) {
        return new Promise((resolve, reject) => {
            if (!sheet || typeof sheet.id !== 'string') {
                return reject(new Error("유효하지 않은 IBSheet 객체입니다."));
            }
            const sheetId = sheet.id;
            const eventHandlerName = `${sheetId}_OnSearchEnd`;
            log(`[LIMS 자동화] ${eventHandlerName} 이벤트 대기 설정...`);

            const timeoutHandle = setTimeout(() => {
                if (unsafeWindow[eventHandlerName] === newEventHandler) {
                    unsafeWindow[eventHandlerName] = originalOnSearchEnd;
                    log(`[LIMS 자동화] ${eventHandlerName} 이벤트 핸들러 복원 (타임아웃)`);
                }
                reject(new Error(`${sheetId} 시트 검색이 ${timeoutSeconds}초 내에 완료되지 않았습니다.`));
            }, timeoutSeconds * 1000);

            const originalOnSearchEnd = unsafeWindow[eventHandlerName];

            const newEventHandler = function (...args) {
                clearTimeout(timeoutHandle);
                log(`[LIMS 자동화] ${eventHandlerName} 이벤트 발생!`);
                unsafeWindow[eventHandlerName] = originalOnSearchEnd;
                log(`[LIMS 자동화] ${eventHandlerName} 이벤트 핸들러 복원 (성공)`);
                if (typeof originalOnSearchEnd === 'function') {
                    try {
                        originalOnSearchEnd.apply(this, args);
                    } catch (e) {
                        error(`[LIMS 자동화] 기존 ${eventHandlerName} 실행 중 오류:`, e);
                    }
                }
                resolve();
            };
            unsafeWindow[eventHandlerName] = newEventHandler;
        });
    }

    // --- (v3.7) 기준점을 다시 .g-search-user-name 으로 변경
    if (isMainPage) {
        waitForElement('.g-search-user-name')
            .then(userNameElement => {
                log('[LIMS 자동화] 사용자 이름 요소 찾음');

                // (v3.7) 사용자 이름이 줄어들지 않도록 설정
                userNameElement.style.flexShrink = '0';
                userNameElement.style.whiteSpace = 'nowrap';

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    gap: 8px;
                    margin-right: 16px; /* (v3.7) 버튼과 이름 사이 여백 */
                `;

                const weeklyReportButton = document.createElement('button');
                weeklyReportButton.textContent = '📊 주간 QC 리포트';
                weeklyReportButton.style.cssText = `
                    padding: 8px 16px; background-color: #e8f5e9; color: #2e7d32;
                    border: 1px solid #2e7d32; border-radius: 6px; cursor: pointer; font-size: 14px;
                    font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                weeklyReportButton.addEventListener('mouseover', () => {
                    weeklyReportButton.style.backgroundColor = '#c8e6c9';
                    weeklyReportButton.style.boxShadow = '0 6px 12px rgba(46, 125, 50, 0.15)';
                    weeklyReportButton.style.transform = 'translateY(-2px)';
                });
                weeklyReportButton.addEventListener('mouseout', () => {
                    weeklyReportButton.style.backgroundColor = '#e8f5e9';
                    weeklyReportButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    weeklyReportButton.style.transform = 'translateY(0)';
                });
                weeklyReportButton.addEventListener('click', () => {
                    log('[LIMS 자동화] 주간 통합 자동화 시작');
                    GM_setValue('current_automation_task', 'integrated_weekly');
                    GM_setValue('automation_date_range', 'weekly');
                    GM_setValue('automation_queue', [
                        { type: 'sample_qc', items: ['RV', 'OP'] },
                        { type: 'library_qc', items: ['PBL'] },
                        { type: 'library_wait', items: ['ALL'] }
                    ]);
                    GM_setValue('automation_queue_index', 0);
                    GM_setValue('automation_items', ['RV', 'OP']);
                    GM_setValue('automation_item_index', 0); // (v3.6) 인덱스 초기화
                    alert('📊 주간 QC 리포트 자동화를 시작합니다.\n\n처리 순서:\n1. Sample QC Work (RV, OP)\n2. Library QC Work (PBL)\n3. Library 대기 (전체)');
                    window.location.href = 'https://lims3.macrogen.com/ngs/sample/retrieveQcWorkForm.do';
                });

                const monthlyReportButton = document.createElement('button');
                monthlyReportButton.textContent = '📅 월간 QC 리포트';
                monthlyReportButton.style.cssText = `
                    padding: 8px 16px; background-color: #fff3e0; color: #ef6c00;
                    border: 1px solid #ef6c00; border-radius: 6px; cursor: pointer; font-size: 14px;
                    font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                monthlyReportButton.addEventListener('mouseover', () => {
                    monthlyReportButton.style.backgroundColor = '#ffe0b2';
                    monthlyReportButton.style.boxShadow = '0 6px 12px rgba(239, 108, 0, 0.15)';
                    monthlyReportButton.style.transform = 'translateY(-2px)';
                });
                monthlyReportButton.addEventListener('mouseout', () => {
                    monthlyReportButton.style.backgroundColor = '#fff3e0';
                    monthlyReportButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    monthlyReportButton.style.transform = 'translateY(0)';
                });
                monthlyReportButton.addEventListener('click', () => {
                    log('[LIMS 자동화] 월간 통합 자동화 시작');
                    GM_setValue('current_automation_task', 'integrated_monthly');
                    GM_setValue('automation_date_range', 'monthly');
                    GM_setValue('automation_queue', [
                        { type: 'sample_qc', items: ['RV', 'OP'] },
                        { type: 'library_qc', items: ['PBL'] }
                    ]);
                    GM_setValue('automation_queue_index', 0);
                    GM_setValue('automation_items', ['RV', 'OP']);
                    GM_setValue('automation_item_index', 0); // (v3.6) 인덱스 초기화
                    alert('📅 월간 QC 리포트 자동화를 시작합니다.\n\n처리 순서:\n1. Sample QC Work (RV, OP)\n2. Library QC Work (PBL)\n\n이전 달(1일~말일) 기준으로 검색합니다.');
                    window.location.href = 'https://lims3.macrogen.com/ngs/sample/retrieveQcWorkForm.do';
                });

                buttonContainer.appendChild(weeklyReportButton);
                buttonContainer.appendChild(monthlyReportButton);
                // (v3.7) 삽입 위치를 userNameElement *앞*으로 변경
                userNameElement.parentElement.insertBefore(buttonContainer, userNameElement);
                log('[LIMS 자동화] 통합 자동화 버튼 추가 완료 (이름 옆)');
            })
            .catch(error => {
                error('[LIMS 자동화] 버튼 추가 실패:', error);
            });
    }

    if (isSampleQcPage) {
        const currentTask = GM_getValue('current_automation_task');
        if (currentTask === 'integrated_weekly' || currentTask === 'integrated_monthly' || currentTask === 'sample_qc') {
            log('[LIMS 자동화] Sample QC Work 페이지에서 자동화 실행');

            let items = GM_getValue('automation_items', []);
            let currentIndex = GM_getValue('automation_item_index', 0);

            if (!Array.isArray(items)) {
                warn('[LIMS 자동화] automation_items가 배열이 아닙니다. GM_getValue 반환값:', items);
                items = []; // Fallback
            }

            if (currentIndex < items.length) {
                const currentPlatform = items[currentIndex];
                log(`[LIMS 자동화] SQC 처리 중: ${currentPlatform} (${currentIndex + 1}/${items.length})`);

                (async () => {
                    try {
                        await waitForPageLoad();
                        await new Promise(resolve => setTimeout(resolve, 3000));

                        await waitForElement('#searchBeginDe');
                        await waitForElement('#searchEndDe');
                        await waitForElement('#searchPltfomCd');
                        await waitForElement('#searchKeyword1');
                        await waitForElement('#btnSearch');
                        await waitForElement('#excel_down_btn');

                        const sheet = findSheetObject(unsafeWindow, 'ibsQcWork');
                        if (!sheet) throw new Error('ibsQcWork 시트 객체를 찾을 수 없습니다.');

                        // 날짜 범위 설정
                        const dateRangeType = GM_getValue('automation_date_range', 'weekly');
                        let dateRange;
                        if (dateRangeType === 'monthly') {
                            dateRange = calculateMonthlyDateRange();
                            log('[LIMS 자동화] 월간 리포트 날짜 범위 사용:', dateRange);
                        } else {
                            dateRange = calculateWeeklyDateRange();
                            log('[LIMS 자동화] 주간 리포트 날짜 범위 사용:', dateRange);
                        }

                        document.querySelector('#searchKeyword1').value = '';
                        document.querySelector('#searchBeginDe').value = dateRange.startDate;
                        document.querySelector('#searchEndDe').value = dateRange.endDate;
                        document.querySelector('#searchPltfomCd').value = currentPlatform;

                        log('[LIMS 자동화] 검색 조건 설정 완료');

                        const searchCompletePromise = awaitSheetSearch(sheet, 60);
                        document.querySelector('#btnSearch').click();
                        log('[LIMS 자동화] 검색 버튼 클릭');

                        await searchCompletePromise;
                        log(`[LIMS 자동화] 그리드 로딩 완료! 총 ${sheet.GetTotalRows()}개 행`);

                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // --- 엑셀 다운로드 먼저 실행 ---
                        log('[LIMS 자동화] 검색 완료, 엑셀 다운로드 시작');

                        const excelButton = document.querySelector('#excel_down_btn');
                        if (excelButton) {
                            excelButton.click();
                            log('[LIMS 자동화] 엑셀 다운로드 버튼 클릭');
                        }

                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // --- HiFi PDF 다운로드는 주간 리포트에서만 실행 ---
                        if (currentPlatform === 'RV' && dateRangeType === 'weekly') {
                            log('[LIMS 자동화] Revio 플랫폼 + 주간 리포트: HiFi PDF 다운로드 시도');
                            await executeHiFiPdfDownload(sheet);
                        } else if (currentPlatform === 'RV' && dateRangeType === 'monthly') {
                            log('[LIMS 자동화] Revio 플랫폼 + 월간 리포트: HiFi PDF 다운로드 건너뜀');
                        }

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // --- (v3.6) 다음 아이템 처리 ---
                        if (currentIndex + 1 < items.length) {
                            log('[LIMS 자동화] 다음 플랫폼으로 이동 (새로고침)');
                            GM_setValue('automation_item_index', currentIndex + 1);
                            window.location.reload();
                        } else {
                            log('[LIMS 자동화] Sample QC 완료, 다음 작업으로 이동');
                            GM_setValue('automation_item_index', 0);

                            const queueIndex = GM_getValue('automation_queue_index', 0);
                            const queue = GM_getValue('automation_queue', []);

                            if (queueIndex + 1 < queue.length) {
                                const nextTask = queue[queueIndex + 1];
                                GM_setValue('automation_queue_index', queueIndex + 1);
                                GM_setValue('automation_items', nextTask.items);

                                if (nextTask.type === 'library_qc') {
                                    window.location.href = 'https://lims3.macrogen.com/ngs/library/retrieveQcWorkForm.do';
                                } else if (nextTask.type === 'library_wait') {
                                    window.location.href = 'https://lims3.macrogen.com/ngs/library/retrieveWaitForm.do';
                                }
                            } else {
                                log('[LIMS 자동화] 모든 작업 완료!');
                                GM_deleteValue('current_automation_task');
                                GM_deleteValue('automation_items');
                                GM_deleteValue('automation_queue');
                                GM_deleteValue('automation_queue_index');
                                GM_deleteValue('automation_date_range');
                                showNotification('✅ LIMS 자동화 완료', '모든 리포트 다운로드가 완료되었습니다. (SQC, LQC)');
                                window.location.href = 'https://lims3.macrogen.com/main.do';
                            }
                        }

                    } catch (error) {
                        error('[LIMS 자동화] 오류 발생:', error);
                        GM_deleteValue('current_automation_task');
                        GM_deleteValue('automation_items');
                        GM_deleteValue('automation_item_index');
                        GM_deleteValue('automation_queue');
                        GM_deleteValue('automation_queue_index');
                        GM_deleteValue('automation_date_range');
                        showNotification('❌ Sample QC 오류', 'Sample QC 자동화 중 오류가 발생했습니다: ' + error.message);
                        window.location.href = 'https://lims3.macrogen.com/main.do';
                    }
                })();
            }
        }
    }

    // --- (v3.6) Library QC Work 페이지 (v2.9 로직 복귀) ---
    if (isLibraryQcPage) {
        const currentTask = GM_getValue('current_automation_task');
        if (currentTask === 'integrated_weekly' || currentTask === 'integrated_monthly' || currentTask === 'library_qc') {
            log('[LIMS 자동화] Library QC Work 페이지에서 자동화 실행');

            let items = GM_getValue('automation_items', []);
            let currentIndex = GM_getValue('automation_item_index', 0);

            if (!Array.isArray(items)) {
                warn('[LIMS 자동화] automation_items가 배열이 아닙니다. GM_getValue 반환값:', items);
                items = []; // Fallback
            }

            if (currentIndex < items.length) {
                const currentLibType = items[currentIndex];
                log(`[LIMS 자동화] LQC 처리 중: ${currentLibType} (${currentIndex + 1}/${items.length})`);

                (async () => {
                    try {
                        await waitForPageLoad();

                        await waitForElement('#searchBeginDe');
                        await waitForElement('#searchEndDe');
                        await waitForElement('#searchLibType');
                        await waitForElement('#searchKeyword1');
                        await waitForElement('#btnSearch');

                        const sheet = findSheetObject(unsafeWindow, 'ibsQcWork');
                        if (!sheet) throw new Error('ibsQcWork 시트 객체를 찾을 수 없습니다.');

                        // LQC 페이지 초기 검색 대기
                        const initialSearchPromise = awaitSheetSearch(sheet, 60);
                        await initialSearchPromise;
                        log(`[LIMS 자동화] LQC: 초기 검색 완료 (결과: ${sheet.GetTotalRows()}행). 이 결과는 무시합니다.`);

                        // 날짜 범위 설정
                        const dateRangeType = GM_getValue('automation_date_range', 'weekly');
                        let dateRange;
                        if (dateRangeType === 'monthly') {
                            dateRange = calculateMonthlyDateRange();
                            log('[LIMS 자동화] 월간 리포트 날짜 범위 사용:', dateRange);
                        } else {
                            dateRange = calculateWeeklyDateRange();
                            log('[LIMS 자동화] 주간 리포트 날짜 범위 사용:', dateRange);
                        }

                        document.querySelector('#searchKeyword1').value = ''; // ID 값 삭제
                        document.querySelector('#searchBeginDe').value = dateRange.startDate;
                        document.querySelector('#searchEndDe').value = dateRange.endDate;
                        document.querySelector('#searchLibType').value = currentLibType;

                        log(`[LIMS 자동화] LQC: 새 검색 조건 설정 완료 (Type: ${currentLibType})`);

                        const searchCompletePromise = awaitSheetSearch(sheet, 60);
                        document.querySelector('#btnSearch').click();
                        log('[LIMS 자동화] LQC: 새 검색 버튼 클릭');

                        await searchCompletePromise;
                        log(`[LIMS 자동화] LQC: 새 그리드 로딩 완료! 총 ${sheet.GetTotalRows()}개 행`);

                        await new Promise(resolve => setTimeout(resolve, 2000));
                        log('[LIMS 자동화] 검색 완료, 엑셀 다운로드 시작');

                        const excelButton = document.querySelector('.bt_excel');
                        if (excelButton) {
                            excelButton.click();
                            log('[LIMS 자동화] 엑셀 다운로드 버튼 클릭');
                        }

                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // --- (v3.6) 다음 아이템 처리 ---
                        if (currentIndex + 1 < items.length) {
                            log('[LIMS 자동화] 다음 라이브러리 타입으로 이동 (새로고침)');
                            GM_setValue('automation_item_index', currentIndex + 1);
                            window.location.reload();
                        } else {
                            log('[LIMS 자동화] Library QC 완료, 다음 작업으로 이동');
                            GM_setValue('automation_item_index', 0); // 다음 페이지를 위해 인덱스 리셋

                            const queueIndex = GM_getValue('automation_queue_index', 0);
                            const queue = GM_getValue('automation_queue', []);

                            if (queueIndex + 1 < queue.length) {
                                const nextTask = queue[queueIndex + 1];
                                GM_setValue('automation_queue_index', queueIndex + 1);
                                GM_setValue('automation_items', nextTask.items);

                                if (nextTask.type === 'library_wait') {
                                    window.location.href = 'https://lims3.macrogen.com/ngs/library/retrieveWaitForm.do';
                                }
                            } else {
                                // 모든 큐 완료
                                log('[LIMS 자동화] 모든 작업 완료!');
                                GM_deleteValue('current_automation_task');
                                GM_deleteValue('automation_items');
                                GM_deleteValue('automation_item_index');
                                GM_deleteValue('automation_queue');
                                GM_deleteValue('automation_queue_index');
                                GM_deleteValue('automation_date_range');
                                showNotification('✅ LIMS 자동화 완료', '모든 리포트 다운로드가 완료되었습니다.');
                                window.location.href = 'https://lims3.macrogen.com/main.do';
                            }
                        }

                    } catch (error) {
                        error('[LIMS 자동화] 오류 발생:', error);
                        GM_deleteValue('current_automation_task');
                        GM_deleteValue('automation_items');
                        GM_deleteValue('automation_item_index');
                        GM_deleteValue('automation_queue');
                        GM_deleteValue('automation_queue_index');
                        GM_deleteValue('automation_date_range');
                        showNotification('❌ Library QC 오류', 'Library QC 자동화 중 오류가 발생했습니다: ' + error.message);
                        window.location.href = 'https://lims3.macrogen.com/main.do';
                    }
                })();
            }
        }
    }

    // --- (v3.6) Library 대기 페이지 (기존과 동일) ---
    if (isLibraryWaitPage) {
        const currentTask = GM_getValue('current_automation_task');
        if (currentTask === 'integrated_weekly' || currentTask === 'library_wait') {
            log('[LIMS 자동화] Library 대기 페이지에서 자동화 실행');

            (async () => {
                try {
                    await waitForPageLoad();
                    log('[LIMS 자동화] 페이지 로드 완료');

                    await new Promise(resolve => setTimeout(resolve, 3000));
                    log('[LIMS 자동화] 초기화 대기 완료');

                    const searchButton = document.querySelector('button.btn_search#btnSearch');
                    if (!searchButton) throw new Error('Search 버튼을 찾을 수 없습니다');
                    log('[LIMS 자동화] Search 버튼 찾음');

                    const sheet = findSheetObject(unsafeWindow, 'ibsWait1');
                    if (!sheet) throw new Error('ibsWait1 시트 객체를 찾을 수 없습니다.');

                    const searchCompletePromise = awaitSheetSearch(sheet, 60);
                    searchButton.click();
                    log('[LIMS 자동화] 검색 버튼 클릭 완료');

                    await searchCompletePromise;
                    log(`[LIMS 자동화] 그리드 로딩 완료! 총 ${sheet.GetTotalRows()}개 행`);

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    log('[LIMS 자동화] 검색 완료, 엑셀 다운로드 시작');

                    const excelButton = document.querySelector('button.icon-export-white.bt_excel');
                    if (!excelButton) throw new Error('엑셀 다운로드 버튼을 찾을 수 없습니다');

                    log('[LIMS 자동화] 엑셀 버튼 찾음');
                    excelButton.click();
                    log('[LIMS 자동화] Library 대기 엑셀 다운로드 버튼 클릭 완료');

                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // 모든 작업 완료
                    log('[LIMS 자동화] 모든 작업 완료!');
                    GM_deleteValue('current_automation_task');
                    GM_deleteValue('automation_items');
                    GM_deleteValue('automation_item_index');
                    GM_deleteValue('automation_queue');
                    GM_deleteValue('automation_queue_index');
                    GM_deleteValue('automation_date_range');

                    showNotification('✅ LIMS 자동화 완료', '모든 리포트 다운로드가 완료되었습니다.\n\n1. Sample QC (RV, OP)\n2. Library QC (PBL)\n3. Library 대기\n\n다운로드 폴더를 확인해주세요.');
                    window.location.href = 'https://lims3.macrogen.com/main.do';

                } catch (error) {
                    error('[LIMS 자동화] 오류 발생:', error);
                    error('[LIMS 자동화] 오류 스택:', error.stack);
                    GM_deleteValue('current_automation_task');
                    GM_deleteValue('automation_items');
                    GM_deleteValue('automation_item_index');
                    GM_deleteValue('automation_queue');
                    GM_deleteValue('automation_queue_index');
                    GM_deleteValue('automation_date_range');
                    showNotification('❌ Library 대기 오류', 'Library 대기 자동화 중 오류가 발생했습니다.\n\n' + error.message);
                    window.location.href = 'https://lims3.macrogen.com/main.do';
                }
            })();
        }
    }
})();
