// ==UserScript==
// @name         LIMS SQC대기 컬럼 너비 조절
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  탭 전환 및 조회 시에도 LIB KIT 컬럼 너비 상시 유지
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/sample/retrieveWaitForm.do?menuCd=NGS110100*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561896/LIMS%20SQC%EB%8C%80%EA%B8%B0%20%EC%BB%AC%EB%9F%BC%20%EB%84%88%EB%B9%84%20%EC%A1%B0%EC%A0%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561896/LIMS%20SQC%EB%8C%80%EA%B8%B0%20%EC%BB%AC%EB%9F%BC%20%EB%84%88%EB%B9%84%20%EC%A1%B0%EC%A0%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_COLUMN = "libKitNm"; // 조절할 컬럼 SaveName
    const TARGET_WIDTH = 200;        // 원하는 너비 (200~250 추천)

    function enforceWidth() {
        // 페이지 내의 모든 IBSheet 객체를 찾아서 처리
        const sheets = [];
        
        // 1. 일반적인 시트 변수명 확인
        if (window.sheet1) sheets.push(window.sheet1);
        if (window.mySheet) sheets.push(window.mySheet);
        
        // 2. window 객체 전체에서 IBSheet 인스턴스 탐색 (탭 전환 시 이름이 바뀔 수 있음)
        Object.values(window).forEach(v => {
            if (v && v.IBSheetVersion && typeof v.SetColWidth === 'function') {
                if (!sheets.includes(v)) sheets.push(v);
            }
        });

        sheets.forEach(sheet => {
            try {
                const colIdx = sheet.SaveNameCol(TARGET_COLUMN);
                if (colIdx !== -1) {
                    const currentWidth = sheet.GetColWidth(colIdx);
                    // 현재 너비가 목표값과 다르면 강제 재설정
                    if (currentWidth !== TARGET_WIDTH) {
                        sheet.SetColWidth(TARGET_COLUMN, TARGET_WIDTH);
                        console.log(`[LIMS Helper] ${TARGET_COLUMN} 너비 고정 적용 완료`);
                    }
                }
            } catch (e) {
                // 시트 초기화 중 발생하는 에러 방지
            }
        });
    }

    // 1초(1000ms)마다 체크하여 너비 강제 유지 (탭 전환 및 조회 대응)
    const monitorInterval = setInterval(enforceWidth, 1000);

    // 페이지 로드 시 즉시 1회 실행
    setTimeout(enforceWidth, 1500);

    console.log("%c[LIMS Helper] 상시 너비 감시 기능이 활성화되었습니다.", "color: #3498db; font-weight: bold;");
})();