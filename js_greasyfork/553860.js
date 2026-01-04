// ==UserScript==
// @name         Weflab 후원 내역 Google Sheets 연동
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tampermonkey 메뉴를 통해 URL을 설정하고, weflab 페이지의 룰렛 내역을 Google Sheets에 실시간으로 업데이트합니다.
// @author       kalowo56
// @match        https://weflab.com/alertlist*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553860/Weflab%20%ED%9B%84%EC%9B%90%20%EB%82%B4%EC%97%AD%20Google%20Sheets%20%EC%97%B0%EB%8F%99.user.js
// @updateURL https://update.greasyfork.org/scripts/553860/Weflab%20%ED%9B%84%EC%9B%90%20%EB%82%B4%EC%97%AD%20Google%20Sheets%20%EC%97%B0%EB%8F%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tampermonkey의 내장 저장소를 사용하기 위한 키
    const STORAGE_KEY = 'weflab_gas_url';

    /**
     * Google Apps Script URL을 설정/수정하는 함수.
     * @returns {Promise<string|null>} 성공적으로 설정되면 URL 문자열을, 사용자가 취소하면 null을 반환합니다.
     */
    async function setWebAppUrl() {
        const currentUrl = await GM_getValue(STORAGE_KEY, '');
        const newUrl = prompt('Google Apps Script 웹 앱 URL을 입력하세요.', currentUrl);

        if (newUrl === null) { // 사용자가 '취소'를 누른 경우
            alert('URL 설정이 취소되었습니다.');
            return null;
        }

        if (newUrl.trim() === '') { // 사용자가 빈 값을 입력한 경우
            alert('⚠️ URL이 비어있습니다. 유효한 URL을 입력해주세요.');
            return null;
        }

        await GM_setValue(STORAGE_KEY, newUrl.trim());
        alert('✅ URL이 성공적으로 저장되었습니다.');
        return newUrl.trim();
    }

    /**
     * Tampermonkey 메뉴에 'URL 설정' 옵션을 등록합니다.
     */
    function registerMenuCommands() {
        GM_registerMenuCommand('Google Sheets URL 수정', setWebAppUrl);
    }



    /**
     * 데이터를 Google Sheets 웹 앱으로 전송하는 함수
     * @param {Array} data - 전송할 데이터 배열
     */
    async function sendDataToGoogleSheet(data) {
        // Tampermonkey 저장소에서 URL을 비동기적으로 가져옵니다.
        const webAppUrl = await GM_getValue(STORAGE_KEY);

        // URL이 없을 경우, 설정 함수를 호출하고 URL을 받아옵니다.
        if (!webAppUrl) {
            alert("Google Sheets 연동 URL이 설정되지 않았습니다.\nURL 설정창을 엽니다.");
            webAppUrl = await setWebAppUrl();

            // 사용자가 URL 설정을 취소했다면 함수를 중단합니다.
            if (!webAppUrl) {
                return;
            }
        }

        if (data.length === 0) {
            alert('Google Sheets로 전송할 룰렛 데이터가 없습니다.');
            return;
        }

        try {
            await fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            });
            alert(`✅ 총 ${data.length}개의 룰렛 결과를 Google Sheets로 전송 요청했습니다.\n잠시 후 시트를 확인해주세요.`);
        } catch (error) {
            console.error('Google Sheets 전송 실패:', error);
            alert('❌ Google Sheets로 데이터를 전송하는 중 오류가 발생했습니다. 개발자 콘솔(F12)을 확인해주세요.');
        }
    }


    /**
     * 메인 후원 관리 테이블에서 룰렛 데이터를 파싱하는 함수
     */
    function parseAndSendData() {
        const table = document.querySelector('.alertlist_table');
        if (!table) {
            alert('후원 내역 테이블을 찾을 수 없습니다.');
            return;
        }

        const tableRows = table.querySelectorAll('tbody tr');
        const results = [];
        const probabilityRegex = /\s*\(\d+\.?\d*%\)\s*/g; // 확률 텍스트 제거용

        tableRows.forEach(tr => {
            const cols = tr.querySelectorAll('td');
            if (cols.length < 7) return;

            const userNameText = cols[2]?.innerText.replace(/\n/g, ' ').trim() || '';
            const rouletteCell = cols[5];
            if (!rouletteCell || rouletteCell.innerText.trim() === '') return;

            // '꽝'이 아닌 결과만 추출
            const mainResultText = (rouletteCell.querySelector('p')?.innerText || '').trim();
            if (mainResultText && !mainResultText.includes('꽝')) {
                results.push({ user: userNameText, rouletteItem: mainResultText.replace(probabilityRegex, '').trim() });
            }

            // "더 보기" 툴팁 내용 파싱
            const moreButton = rouletteCell.querySelector('.btn_roulette_more');
            if (moreButton) {
                const tooltipContent = moreButton.getAttribute('data-tooltip') || '';
                const moreResults = tooltipContent.match(/<p>(.*?)<\/p>/g) || [];
                moreResults.forEach(pTag => {
                    const cleanText = pTag.replace(/<[^>]+>/g, '').trim();
                    if (cleanText && !cleanText.includes('꽝')) {
                         results.push({ user: userNameText, rouletteItem: cleanText.replace(probabilityRegex, '').trim() });
                    }
                });
            }
        });

        if (results.length > 0) {
            sendDataToGoogleSheet(results);
        } else {
            alert('카운트할 룰렛 결과("꽝" 제외)가 없습니다.');
        }
    }


    /**
     * 페이지에 'Sheets 연동' 버튼만 추가하는 함수
     */
    function createSyncButton() {
        // 버튼을 추가할 부모 위치 (모달창의 푸터)
        const footerArea = document.querySelector('#popup_roulette_static .popup_footer');
        // '닫기' 버튼을 기준점으로 찾기
        const closeButton = footerArea ? footerArea.querySelector('.btn_cancel') : null;

        if (footerArea && closeButton) {
            const syncButton = document.createElement('a');
            syncButton.href = '#';
            syncButton.className = 'btns nm green';
            syncButton.innerHTML = '<i class="fa-regular fa-file-excel" style="margin-right: 5px;"></i> Sheets 연동';
            syncButton.style.marginLeft = '8px';
            syncButton.setAttribute('data-tooltip', '현재 페이지의 룰렛 당첨 내역을 Google Sheets에 업데이트합니다.');

            syncButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('현재 페이지의 룰렛 당첨 내역("꽝" 제외)을 Google Sheets에 업데이트 하시겠습니까?')) {
                    parseAndSendData();
                }
            });
            // '닫기' 버튼(closeButton) 앞에 새로운 버튼(exportButton) 삽입
            footerArea.insertBefore(syncButton, closeButton);
        }
    }

    // --- 스크립트 실행 시작 ---
    // 1. Tampermonkey 메뉴를 등록합니다.
    registerMenuCommands();
    // 2. 페이지에 동기화 버튼을 추가합니다.
    setTimeout(createSyncButton, 1000);

})();