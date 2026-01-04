// ==UserScript==
// @name         Weflab 후원 내역 CSV 추출기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  위플랩(Weflab) 룰렛 통계 모달의 닫기 버튼 옆에 버튼을 추가하여, 페이지의 전체 후원 내역을 CSV 파일로 추출합니다.
// @author       Your Name
// @match        https://weflab.com/alertlist*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553846/Weflab%20%ED%9B%84%EC%9B%90%20%EB%82%B4%EC%97%AD%20CSV%20%EC%B6%94%EC%B6%9C%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553846/Weflab%20%ED%9B%84%EC%9B%90%20%EB%82%B4%EC%97%AD%20CSV%20%EC%B6%94%EC%B6%9C%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * CSV 내보내기 버튼을 룰렛 통계 모달의 푸터(footer)에 추가하는 함수
     */
    function createExportButtonInModalFooter() {
        // 버튼을 추가할 부모 위치 (모달창의 푸터)
        const footerArea = document.querySelector('#popup_roulette_static .popup_footer');
        // '닫기' 버튼을 기준점으로 찾기
        const closeButton = footerArea ? footerArea.querySelector('.btn_cancel') : null;

        if (footerArea && closeButton) {
            const exportButton = document.createElement('a');
            exportButton.href = '#';
            exportButton.className = 'btns blue'; // 파란색 버튼 스타일 적용
            exportButton.innerHTML = '<i class="fa fa-solid fa-file-csv"></i> <span>CSV 내보내기</span>';

            // '닫기' 버튼과의 간격을 위해 오른쪽 마진 추가
            exportButton.style.marginRight = '8px';

            exportButton.addEventListener('click', (e) => {
                e.preventDefault();
                // 메인 테이블에서 데이터를 추출하는 함수 호출 (기존 로직과 동일)
                extractMainTableDataToCSV();
            });

            // '닫기' 버튼(closeButton) 앞에 새로운 버튼(exportButton) 삽입
            footerArea.insertBefore(exportButton, closeButton);
        }
    }

    /**
     * 메인 후원 관리 테이블 데이터를 CSV로 변환하고 다운로드하는 함수
     * (이전 스크립트와 완전히 동일)
     */
    function extractMainTableDataToCSV() {
        const table = document.querySelector('.alertlist_table');
        if (!table) {
            alert('후원 내역 테이블을 찾을 수 없습니다.');
            return;
        }

        const headers = ['종류', '시간', '이름(아이디)', '후원/구독', '채팅', '룰렛'];
        const rows = [headers];

        const tableRows = table.querySelectorAll('tbody tr');

        if (tableRows.length === 0) {
            alert('추출할 후원 내역이 없습니다. "더 보기"를 눌러 내역을 불러오세요.');
            return;
        }

        tableRows.forEach(tr => {
            const cols = tr.querySelectorAll('td');
            if (cols.length < 7) return;

            const rowData = [];

            // 1. 종류
            rowData.push(cols[0]?.innerText.trim() || '');
            // 2. 시간 (PC 버전)
            const timeEl = cols[1]?.querySelector('p.pc');
            rowData.push(timeEl ? timeEl.innerText.trim() : (cols[1]?.innerText.trim() || ''));
            // 3. 이름(아이디)
            rowData.push(cols[2]?.innerText.replace(/\n/g, ' ').trim() || '');
            // 4. 후원/구독
            const alertEl = cols[3]?.querySelector('p');
            rowData.push(alertEl ? alertEl.innerText.trim() : (cols[3]?.innerText.trim() || ''));
            // 5. 채팅
            rowData.push(cols[4]?.innerText.trim() || '');
            // 6. 룰렛
            let rouletteText = cols[5]?.querySelector('p')?.innerText.trim() || '';
            const moreButton = cols[5]?.querySelector('.btn_roulette_more');
            if (moreButton) {
                const tooltipContent = moreButton.getAttribute('data-tooltip') || '';
                const cleanTooltip = tooltipContent.replace(/<p>/g, '\n').replace(/<\/p>/g, '').trim();
                rouletteText += '\n' + cleanTooltip;
            }
            rowData.push(rouletteText);

            // CSV 형식 유지를 위해 각 셀을 큰따옴표로 감싸기
            const processedRow = rowData.map(cell => `"${(cell || '').replace(/"/g, '""')}"`);
            rows.push(processedRow);
        });

        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        const today = new Date();
        const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        link.setAttribute("download", `${dateString}_weflab_history.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 페이지가 로드되면 즉시 모달에 버튼을 생성합니다.
    createExportButtonInModalFooter();

})();