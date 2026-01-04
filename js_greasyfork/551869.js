// ==UserScript==
// @name SOOP 블랙리스트 내보내기 (아이디 전용, 최종 안정화)
// @name:en SOOP Blacklist Export Tool (ID Only)
// @namespace https://www.sooplive.co.kr/
// @version 1.0
// @description 아이디, 등록(ID), 권한 추가일 정보만 수집하며, 등록(ID)는 괄호 안의 순수 ID만 수집하여 더 가볍고 빠르게 동작하는 최종 버전입니다.
// @description:en Exports SOOP blacklist data (User ID, Admin ID, and Date) to a CSV file. Optimized for speed and minimal data collection.
// @author Lmayo
// @match https://*.sooplive.co.kr/*/setting/blacklist
// @icon https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551869/SOOP%20%EB%B8%94%EB%9E%99%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0%20%28%EC%95%84%EC%9D%B4%EB%94%94%20%EC%A0%84%EC%9A%A9%2C%20%EC%B5%9C%EC%A2%85%20%EC%95%88%EC%A0%95%ED%99%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551869/SOOP%20%EB%B8%94%EB%9E%99%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0%20%28%EC%95%84%EC%9D%B4%EB%94%94%20%EC%A0%84%EC%9A%A9%2C%20%EC%B5%9C%EC%A2%85%20%EC%95%88%EC%A0%95%ED%99%94%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let collectedData = [];
    let isMonitoring = false;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    let observer;

    // --- XHR 통신 감시 로직 (기존 유지) ---
    XMLHttpRequest.prototype.open = function(method, url) { this._requestURL = url; originalOpen.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function() {
        if (isMonitoring) {
            this.addEventListener('load', function() {
                if (this.status === 200 && String(this._requestURL).includes('/blacklist')) {
                    try {
                        const json = JSON.parse(this.responseText);
                        const dataList = json.data || [];
                        if (dataList.length > 0) {
                            updateButtonStatus();
                        }
                    } catch (e) { /* 무시 */ }
                }
            });
        }
        originalSend.apply(this, arguments);
    };

    // --- 기능 함수 ---
    function scrapeCurrentPageAndStore() {
        const rows = document.querySelectorAll('.Tbody_tbody__CUfRE tr');
        if (rows.length === 0) {
            updateButtonStatus();
            return;
        }
        const idRegex = /\(([^)]+)\)/;
        const pageData = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return;

            const blacklistUserCell = cells[2];   // 블랙리스트 유저 닉네임(ID) 셀
            const registratorCell = cells[6];   // 등록자 닉네임(ID) 셀 (인덱스 6)
            const dateCell = cells[7];         // 권한 추가일 셀 (인덱스 7)

            if (blacklistUserCell && registratorCell && dateCell) {
                const fullText = blacklistUserCell.textContent || '';
                const match = fullText.match(idRegex);

                const id = match ? match[1] : ''; // 블랙리스트 유저 ID

                // 등록자 ID 추출: 텍스트에서 괄호 안의 값만 추출
                const registratorFullText = registratorCell.textContent || '';
                const registratorMatch = registratorFullText.match(idRegex);
                const registratorId = registratorMatch ? registratorMatch[1] : registratorFullText.trim(); // 괄호 없으면 전체 텍스트

                const dateText = dateCell.textContent ? dateCell.textContent.trim() : '';

                // collectedData에 아이디 기반으로 저장
                if(id && !collectedData.some(d => d['아이디'] === id)) {
                    pageData.push({
                        '아이디': id,
                        '등록(ID)': registratorId, // ✨ 괄호 안의 ID 값만 사용
                        '권한 추가일': dateText
                    });
                }
            }
        });
        collectedData.push(...pageData);
        updateButtonStatus();
    }

    function updateButtonStatus() {
        const exportLabel = document.getElementById('blacklist-export-label');
        if (exportLabel) {
            const uniqueCount = new Map(collectedData.map(item => [item['아이디'], item])).size;
            exportLabel.textContent = `수집 데이터 ${uniqueCount}개 내보내기`;
            exportLabel.parentElement.style.borderColor = '#1e8e3e';
            exportLabel.parentElement.style.backgroundColor = '#e6f4ea';
            exportLabel.parentElement.style.color = '#1e8e3e';
        }
    }

    function clickNextPage() {
        const paginationWrapper = document.querySelector('div[class*="Pagination_pagination__"], div[class*="Pagination-module__wrapper"]');
        if (!paginationWrapper) return;
        const activeButton = paginationWrapper.querySelector('button[class*="defaultPrimary"]');
        if (activeButton) {
            const nextButton = activeButton.nextElementSibling;
            if (nextButton && nextButton.tagName === 'BUTTON') {
                nextButton.click();

                // 페이지 전환 후 DOM 업데이트를 기다린 다음 데이터 수집 실행
                if (isMonitoring) {
                    setTimeout(scrapeCurrentPageAndStore, 500);
                }
            }
        }
    }

    function toggleMonitoring() {
        isMonitoring = !isMonitoring;
        rebuildButtons();
        if (isMonitoring) {
            collectedData = [];
            scrapeCurrentPageAndStore();
            alert('데이터 수집을 시작합니다.\n이제 [다음 페이지] 버튼을 끝까지 눌러주세요.');
        }
    }

    function downloadCollectedData() {
        if (collectedData.length === 0) { alert('수집된 데이터가 없습니다.'); return; }
        const headers = ['No', '아이디', '등록(ID)', '권한 추가일'];
        const csvRows = [headers.join(',')];
        const uniqueData = Array.from(new Map(collectedData.map(item => [item['아이디'], item])).values());
        uniqueData.forEach((item, index) => {
             const values = [
                `"${index + 1}"`,
                `"${item['아이디']}"`,
                `"${item['등록(ID)']}"`,
                `"${item['권한 추가일']}"`
            ];
             csvRows.push(values.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'blacklist_collected_id_only.csv';
        a.click(); URL.revokeObjectURL(url);
    }

    function rebuildButtons() {
        if (observer) observer.disconnect();

        const titleContainer = document.querySelector('.SettingContainer_titleBox__0bRU4 .Title_sectionTitle__QOjq9');
        if (!titleContainer) {
            if (observer) observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        document.getElementById('blacklist-toggle-btn')?.remove();
        document.getElementById('blacklist-next-page-btn')?.remove();
        document.getElementById('blacklist-export-btn')?.remove();

        const buttonStyle = `margin-left: 10px; padding: 4px 8px; font-size: 12px; border: 1px solid; border-radius: 4px; cursor: pointer; font-weight: 500;`;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'blacklist-toggle-btn';
        toggleButton.style.cssText = buttonStyle;
        toggleButton.onclick = toggleMonitoring;
        if (isMonitoring) {
            toggleButton.textContent = '■ 수집 중지';
            toggleButton.style.backgroundColor = '#fce8e6'; toggleButton.style.color = '#d93025'; toggleButton.style.borderColor = '#d93025';
        } else {
            toggleButton.textContent = '▶ 데이터 수집 시작';
            toggleButton.style.backgroundColor = '#e8f0fe'; toggleButton.style.color = '#1a73e8'; toggleButton.style.borderColor = '#1a73e8';
        }

        const nextPageButton = document.createElement('button');
        nextPageButton.id = 'blacklist-next-page-btn';
        nextPageButton.textContent = '다음 페이지';
        nextPageButton.style.cssText = buttonStyle + `border-color: #5f6368; background-color: #f1f3f4; color: #3c4043;`;
        nextPageButton.onclick = clickNextPage;

        const paginationWrapper = document.querySelector('div[class*="Pagination_pagination__"], div[class*="Pagination-module__wrapper"]');
        const activeButton = paginationWrapper ? paginationWrapper.querySelector('button[class*="defaultPrimary"]') : null;
        const nextButtonExists = activeButton ? activeButton.nextElementSibling : null;

        if (!nextButtonExists || (nextButtonExists.tagName === 'BUTTON' && nextButtonExists.disabled)) {
            nextPageButton.disabled = true;
            nextPageButton.textContent = '마지막 페이지';
            nextPageButton.style.opacity = '0.5'; nextPageButton.style.cursor = 'not-allowed';
        }

        const exportButton = document.createElement('button');
        exportButton.id = 'blacklist-export-btn';
        exportButton.style.cssText = buttonStyle;
        exportButton.onclick = downloadCollectedData;
        const exportLabel = document.createElement('span');
        exportLabel.id = 'blacklist-export-label';
        exportButton.appendChild(exportLabel);

        titleContainer.appendChild(toggleButton);
        titleContainer.appendChild(nextPageButton);
        titleContainer.appendChild(exportButton);
        updateButtonStatus();

        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    observer = new MutationObserver(() => {
        rebuildButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();