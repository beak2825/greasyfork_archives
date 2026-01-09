// ==UserScript==
// @name         LIMS Library QC 대기 행 강조
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Library 대기 페이지에서 LIB STATUS가 'Library QC 대기'인 행을 강조 표시합니다.
// @author       김재형
// @match        *://*/ngs/library/retrieveWaitForm.do*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561901/LIMS%20Library%20QC%20%EB%8C%80%EA%B8%B0%20%ED%96%89%20%EA%B0%95%EC%A1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561901/LIMS%20Library%20QC%20%EB%8C%80%EA%B8%B0%20%ED%96%89%20%EA%B0%95%EC%A1%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================================================================================
    // 설정
    // ======================================================================================
    const HIGHLIGHT_COLOR = '#66FF99';    // 강조 색상 (연두색)
    const TARGET_STATUS = 'Library QC 대기';  // 강조할 상태값
    const STATUS_COL_NAME = 'libPrgrStatNm';  // LIB STATUS 컬럼 SaveName

    // ======================================================================================
    // 유틸리티 함수
    // ======================================================================================

    /**
     * 페이지 내 모든 IBSheet 객체를 찾아 배열로 반환
     */
    function findAllSheets() {
        const sheets = [];
        try {
            Object.keys(unsafeWindow).forEach(key => {
                const obj = unsafeWindow[key];
                if (obj && typeof obj.GetCellValue === 'function' && typeof obj.RowCount === 'function' && typeof obj.LastCol === 'function') {
                    sheets.push({ name: key, sheet: obj });
                }
            });
        } catch (e) {
            console.error('[LIB QC Highlight] 시트 탐색 오류:', e);
        }
        return sheets;
    }

    /**
     * 주어진 시트에서 조건에 맞는 행을 강조
     */
    function highlightRows(sheetInfo) {
        const { name, sheet } = sheetInfo;

        try {
            const safeLastCol = (targetSheet) => {
                try {
                    return targetSheet.LastCol();
                } catch (e) {
                    return null;
                }
            };

            const safeHeaderRows = (targetSheet) => {
                try {
                    return (typeof targetSheet.HeaderRows === 'function') ? targetSheet.HeaderRows() : 1;
                } catch (e) {
                    return 1;
                }
            };

            const safeLastRow = (targetSheet) => {
                try {
                    return targetSheet.LastRow();
                } catch (e) {
                    return 0;
                }
            };

            // 컬럼 인덱스를 동적으로 찾음 (SaveName 또는 헤더 텍스트)
            const colIndex = (function () {
                const totalCols = safeLastCol(sheet);
                if (totalCols === null) return -1;
                for (let i = 0; i <= totalCols; i++) {
                    try {
                        const saveName = sheet.GetCellProperty(0, i, "SaveName");
                        if (saveName && saveName === STATUS_COL_NAME) return i;
                        const headerText = sheet.GetCellText(0, i);
                        if (headerText && headerText.trim() === STATUS_COL_NAME) return i;
                    } catch (_) { }
                }
                return -1;
            })();
            if (colIndex < 0) {
                return; // 해당 컬럼이 없는 시트는 스킵
            }

            const startRow = safeHeaderRows(sheet);
            const lastRow = safeLastRow(sheet);
            if (lastRow <= 0) return;

            for (let row = startRow; row <= lastRow; row++) {
                try {
                    const status = sheet.GetCellValue(row, colIndex);
                    if (status === TARGET_STATUS) {
                        sheet.SetRowBackColor(row, HIGHLIGHT_COLOR);
                    }
                } catch (e) {
                    // 개별 행 처리 오류 무시
                }
            }
        } catch (e) {
            console.error(`[LIB QC Highlight] ${name} 시트 처리 오류:`, e);
        }
    }

    /**
     * 모든 시트에 강조 적용
     */
    function applyHighlightToAllSheets() {
        const sheets = findAllSheets();
        sheets.forEach(highlightRows);
    }

    /**
     * IBSheet 이벤트 훅 설정 (검색 완료 시 강조 적용)
     */
    function hookIBSheetEvents() {
        const sheets = findAllSheets();

        sheets.forEach(({ name, sheet }) => {
            const safeLastCol = (targetSheet) => {
                try {
                    return targetSheet.LastCol();
                } catch (e) {
                    return null;
                }
            };

            // 1. OnSearchEnd 이벤트 훅 (검색 완료 후 호출)
            const searchEndEvent = `${name}_OnSearchEnd`;
            const originalSearchEnd = unsafeWindow[searchEndEvent];

            unsafeWindow[searchEndEvent] = function (code, msg, sXml) {
                if (originalSearchEnd) {
                    originalSearchEnd.apply(this, arguments);
                }
                // 검색 완료 후 강조 적용
                setTimeout(() => highlightRows({ name, sheet }), 100);
            };

            // 2. OnRowSearchEnd 이벤트 훅 (개별 행 로드 시)
            const rowSearchEndEvent = `${name}_OnRowSearchEnd`;
            const originalRowSearchEnd = unsafeWindow[rowSearchEndEvent];

            unsafeWindow[rowSearchEndEvent] = function (row) {
                if (originalRowSearchEnd) {
                    originalRowSearchEnd.apply(this, arguments);
                }

                try {
                    // 컬럼 인덱스를 동적으로 찾음
                    const colIndex = (function () {
                        const totalCols = safeLastCol(sheet);
                        if (totalCols === null) return -1;
                        for (let i = 0; i <= totalCols; i++) {
                            try {
                                const saveName = sheet.GetCellProperty(0, i, "SaveName");
                                if (saveName && saveName === STATUS_COL_NAME) return i;
                                const headerText = sheet.GetCellText(0, i);
                                if (headerText && headerText.trim() === STATUS_COL_NAME) return i;
                            } catch (_) { }
                        }
                        return -1;
                    })();
                    if (colIndex < 0) return;

                    const status = sheet.GetCellValue(row, colIndex);
                    if (status === TARGET_STATUS) {
                        sheet.SetRowBackColor(row, HIGHLIGHT_COLOR);
                    }
                } catch (e) {
                    // 오류 무시
                }
            };
        });
    }

    /**
     * 시트 탐색 및 훅 설정 (지연 실행으로 동적 시트 대응)
     */
    function setupHooksWithRetry() {
        let attempts = 0;
        const maxAttempts = 20;

        const trySetup = () => {
            attempts++;
            const sheets = findAllSheets();

            if (sheets.length > 0) {
                hookIBSheetEvents();
                applyHighlightToAllSheets();
            } else if (attempts < maxAttempts) {
                setTimeout(trySetup, 500);
            }
        };

        trySetup();
    }

    // ======================================================================================
    // 초기화
    // ======================================================================================
    function init() {
        // 시트 로드 후 훅 설정 (재시도 로직 포함)
        setTimeout(setupHooksWithRetry, 1000);

        // 탭 전환 시 재설정 및 재적용
        document.body.addEventListener('click', function (e) {
            // 탭 클릭 감지
            if (e.target.matches && (e.target.matches('.ui-tabs-anchor') || e.target.closest('.ui-tabs-nav'))) {
                setTimeout(() => {
                    setupHooksWithRetry();
                }, 500);
            }
        });

        // 검색 버튼 클릭 감지 (일반적인 검색 버튼 ID 패턴)
        document.body.addEventListener('click', function (e) {
            const target = e.target;
            if (target.matches && (
                target.id?.includes('search') ||
                target.id?.includes('Search') ||
                target.id?.includes('btn') ||
                target.closest('button')?.id?.includes('search')
            )) {
                // 검색 후 데이터 로드 시간을 고려하여 지연 적용
                setTimeout(applyHighlightToAllSheets, 1000);
                setTimeout(applyHighlightToAllSheets, 2000);
            }
        });
    }

    window.addEventListener('load', init);

})();
