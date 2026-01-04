// ==UserScript==
// @name         디시인사이드 심화 검색기 v1.36
// @namespace    http://tampermonkey.net/
// @version      1.36.1
// @description  디시인사이드 특정 갤러리에서 키워드 검색 후 결과를 팝업으로 보여줍니다. (v1.36 - UI 간격, 숫자 step 수정)
// @author       중세게임 마이너 갤러리
// @license MIT
//
// @match        *://gall.dcinside.com/board/lists?*
// @match        *://gall.dcinside.com/board/lists/?*
// @match        *://gall.dcinside.com/mgallery/board/lists?*
// @match        *://gall.dcinside.com/mgallery/board/lists/?*
// @match        *://gall.dcinside.com/mini/board/lists?*
// @match        *://gall.dcinside.com/mini/board/lists/?*
//
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      gall.dcinside.com
// @downloadURL https://update.greasyfork.org/scripts/554181/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%8B%AC%ED%99%94%20%EA%B2%80%EC%83%89%EA%B8%B0%20v136.user.js
// @updateURL https://update.greasyfork.org/scripts/554181/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%8B%AC%ED%99%94%20%EA%B2%80%EC%83%89%EA%B8%B0%20v136.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. (CSS) v1.35와 동일
    GM_addStyle(`
        #gm-search-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background-color: #3b4890; color: white; border: none;
            border-radius: 5px; padding: 10px 15px; font-size: 14px;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #gm-search-btn:hover { background-color: #4a5aaf; }
        .gm-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
        }
        .gm-modal-content {
            background: white; padding: 15px; border-radius: 5px;
            width: 500px; max-height: 80vh; overflow-y: auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            position: relative;
        }

        #gm-results-modal .gm-modal-content {
            min-height: 500px;
            display: flex;
            flex-direction: column;
        }

        .gm-modal-close {
            position: absolute; top: 10px; right: 15px;
            font-size: 28px; font-weight: bold; color: #aaa;
            cursor: pointer; line-height: 1;
        }
        .gm-modal-close:hover { color: #333; }
        .gm-modal-content h3 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            padding-right: 30px; /* X 버튼 공간 확보 */
        }

        .gm-modal-btn-subtle {
            background-color: #f0f5ff;
            color: #3b4890;
            border: 1px solid #d6e0ff;
        }
        .gm-modal-btn-subtle:hover {
            background-color: #e0e8f9;
        }

        #gm-toggle-filter {
            float: right;
            font-size: 12px;
            padding: 3px 8px;
            margin-right: 0;
        }

        .gm-modal-content > label {
            display: block;
            font-weight: 500;
            font-size: 13px;
            margin-top: 6px;
            margin-bottom: 3px;
        }

        .gm-modal-content input[type="text"],
        .gm-modal-content select,
        .gm-modal-content input[type="number"] {
            width: 100%;
            padding: 8px; margin-bottom: 8px;
            border: 1px solid #ccc; border-radius: 3px;
            box-sizing: border-box;
        }

        .gm-modal-content input[readonly] { background-color: #f0f0f0; }

        .gm-modal-content .condition-group {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            min-height: 36px;
        }
        .gm-modal-content .condition-group input[type="checkbox"] { width: auto; margin-right: 5px; }
        .gm-modal-content .condition-group label {
            margin-right: 5px;
            width: 100px;
            display: flex;
            align-items: center;
        }
        .gm-modal-content .condition-group input[type="number"] {
            width: 100px;
            margin-bottom: 0;
        }

        .gm-modal-content button { padding: 8px 12px; border: none; border-radius: 3px; cursor: pointer; margin-right: 10px; }
        .gm-modal-btn-primary { background-color: #3b4890; color: white; }
        .gm-modal-btn-secondary { background-color: #eee; }

        .gm-search-footer {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }
        #gm-status {
            font-size: 13px; color: #555;
            margin-top: 0;
            margin-left: 15px;
            flex-grow: 1;
            text-align: right;
        }

        .gm-tooltip-trigger {
            position: relative;
            display: inline-block;
            cursor: help;
            margin-left: 5px;
            color: #aaa;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            flex-shrink: 0;
        }
        .gm-tooltip-box {
            display: none;
            position: absolute;
            bottom: 110%;
            left: 100%;
            margin-left: 5px;
            width: 260px;
            background-color: #222;
            color: white;
            padding: 8px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: normal;
            text-align: left;
            z-index: 10001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            pointer-events: none;
        }
        .gm-tooltip-trigger:hover .gm-tooltip-box {
            display: block;
        }

        .gm-filter-box {
            display: none;
            flex-direction: column;
            margin-bottom: 5px;
            margin-top: 5px;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 3px;
        }
        .gm-filter-box-row {
            display: flex;
        }
        .gm-filter-box-row select {
            width: 100px;
            margin: 0 5px 0 0 !important;
        }
        .gm-filter-box-row input {
            flex-grow: 1;
            margin: 0 !important;
            border-radius: 0;
        }
        .gm-filter-box-row button {
            margin: 0;
            border-radius: 0 3px 3px 0;
        }

        #gm-results-list {
            max-height: calc(70vh - 250px);
            min-height: 200px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 5px;
            margin-top: 5px;
            flex-grow: 1;
        }
        #gm-results-list a { display: block; padding: 5px 0; border-bottom: 1px solid #f0f0f0; text-decoration: none; color: #333; }
        #gm-results-list a:hover { background-color: #f9f9f9; }

        #gm-results-list .gm-result-date {
            float: right;
            color: #777;
            font-size: 12px;
            padding-right: 5px;
        }
        #gm-copy-status {
            font-size: 12px;
            margin-right: 10px;
            color: green;
        }
        .gm-results-footer {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gm-results-info {
            font-size: 12px;
            color: #555;
        }
        .gm-results-buttons button {
            margin-left: 5px;
            margin-right: 0;
        }

        .gm-copy-icon {
            width: 12px;
            height: 12px;
            vertical-align: -2px;
            margin-right: 4px;
            stroke-width: 2.5;
        }
        /* ----------------------------------
         ✨ 다크 모드 스타일 (v1.36.1: 클래스 기반으로 변경)
        ----------------------------------
        */

        /* #gm-modal-container에 .gm-dark-theme 클래스가 붙었을 때 적용 */
        .gm-dark-theme .gm-modal-content {
            background: #2c2c2e;
            color: #f5f5f7;
        }

        .gm-dark-theme .gm-modal-close {
            color: #9a9a9e;
        }
        .gm-dark-theme .gm-modal-close:hover {
            color: #f5f5f7;
        }

        .gm-dark-theme .gm-modal-content h3 {
            border-bottom-color: #444;
        }

        .gm-dark-theme .gm-modal-content input[type="text"],
        .gm-dark-theme .gm-modal-content select,
        .gm-dark-theme .gm-modal-content input[type="number"] {
            background-color: #1e1e1e;
            color: #f5f5f7;
            border-color: #444;
        }
        .gm-dark-theme .gm-modal-content input[readonly] {
            background-color: #3a3a3c;
        }

        .gm-dark-theme .gm-modal-btn-secondary {
            background-color: #444;
            color: #f5f5f7;
        }
        .gm-dark-theme .gm-modal-btn-secondary:hover {
            background-color: #555;
        }

        .gm-dark-theme .gm-modal-btn-subtle {
            background-color: #3a3a3c;
            color: #d6e0ff;
            border-color: #555;
        }
        .gm-dark-theme .gm-modal-btn-subtle:hover {
            background-color: #4a4a4c;
        }

        .gm-dark-theme #gm-status,
        .gm-dark-theme .gm-results-info {
            color: #9a9a9e;
        }

        .gm-dark-theme .gm-tooltip-trigger {
            color: #9a9a9e;
            border-color: #555;
        }

        .gm-dark-theme .gm-filter-box {
            border-color: #444;
        }

        .gm-dark-theme #gm-results-list {
            border-color: #444;
        }
        .gm-dark-theme #gm-results-list a {
            color: #f5f5f7;
            border-bottom-color: #444;
        }
        .gm-dark-theme #gm-results-list a:hover {
            background-color: #3a3a3c;
        }
        .gm-dark-theme #gm-results-list .gm-result-date {
            color: #9a9a9e;
        }

        .gm-dark-theme .gm-copy-icon {
            stroke: #f5f5f7;
        }
        .gm-dark-theme #gm-copy-status {
            color: #a0f0a0; /* 밝은 연두색 */
        }
    `);

    // 2. (HTML) 검색창 팝업 HTML (v1.36: 개선 1, 2 반영)
    const searchModalHTML = `
        <div class="gm-modal-overlay" id="gm-search-modal">
            <div class="gm-modal-content">
                <span class="gm-modal-close" id="gm-close-search-x">&times;</span>
                <h3>디시인사이드 심화 검색 (v1.36)</h3>

                <label for="gm-gallery-id">갤러리 ID (자동 감지)</label>
                <input type="text" id="gm-gallery-id" placeholder="갤러리 페이지에서 열어주세요" readonly>

                <label for="gm-keyword">검색어</label>
                <input type="text" id="gm-keyword" placeholder="검색어">

                <label for="gm-search-type">검색 옵션</label>
                <select id="gm-search-type">
                    <option value="search_subject_memo">제목+내용</option>
                    <option value="search_subject">제목</option>
                    <option value="search_name">글쓴이</option>
                </select>

                <div class="condition-group" style="margin-top: 15px;">
                    <input type="checkbox" id="gm-cond-posts" checked>
                    <label for="gm-cond-posts">글 개수:
                        <span class="gm-tooltip-trigger">?
                            <span class="gm-tooltip-box">검색할 게시글의 개수 상한을 설정합니다.</span>
                        </span>
                    </label>
                    <input type="number" id="gm-post-count" value="50" step="5">
                </div>
                <div class="condition-group">
                    <input type="checkbox" id="gm-cond-pages">
                    <label for="gm-cond-pages">반복 수:
                        <span class="gm-tooltip-trigger">?
                            <span class="gm-tooltip-box">검색을 시도할 최대 횟수를 설정합니다.</span>
                        </span>
                    </label>
                    <input type="number" id="gm-page-count" value="10" step="5">
                </div>

                <div class="condition-group">
                    <input type="checkbox" id="gm-quick-search">
                    <label for="gm-quick-search">빠른 검색
                        <span class="gm-tooltip-trigger">?
                            <span class="gm-tooltip-box">글쓴이/날짜를 수집하지 않아 검색 속도가 약간 빨라집니다. (고급 검색 시 '글쓴이' 검색 불가)</span>
                        </span>
                    </label>
                </div>

                <div class="gm-search-footer">
                    <div>
                        <button id="gm-start-search" class="gm-modal-btn-primary">검색 시작</button>
                        <button id="gm-close-search" class="gm-modal-btn-secondary">닫기</button>
                    </div>
                    <div id="gm-status"></div>
                </div>
            </div>
        </div>
    `;

    // 3. (HTML) 결과창 팝업 HTML (v1.35와 동일)
    const resultsModalHTML = `
        <div class="gm-modal-overlay" id="gm-results-modal">
            <div class="gm-modal-content">
                <span class="gm-modal-close" id="gm-close-results-x">&times;</span>
                <h3>
                    검색 결과
                    <button id="gm-toggle-filter" class="gm-modal-btn-subtle">고급 검색</button>
                </h3>

                <div class="gm-filter-box">
                    <div class="gm-filter-box-row">
                        <select id="gm-filter-type">
                            <option value="title">제목</option>
                            <option value="writer">글쓴이</option>
                        </select>
                        <input type="text" id="gm-filter-keyword" placeholder="결과 내 고급 검색">
                        <button id="gm-filter-btn" class="gm-modal-btn-secondary">검색</button>
                    </div>
                </div>

                <div id="gm-results-list"></div>

                <div class="gm-results-footer">
                    <div id="gm-results-info" class="gm-results-info"></div>
                    <div class="gm-results-buttons">
                        <span id="gm-copy-status"></span>
                        <button id="gm-search-again" class="gm-modal-btn-secondary">검색창으로</button>
                        <button id="gm-copy-results" class="gm-modal-btn-secondary">
                            <svg class="gm-copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>복사
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 전역 변수 (v1.35와 동일)
    let currentFullResults = [];
    let isSearchCancelled = false;

    // --------------------------------------------------------------------
    // ✨ [v1.36.1] 다크 모드 로직 (새로 추가/수정된 부분)
    // --------------------------------------------------------------------

    /**
     * 시스템 다크 모드와 사이트 다크 모드 상태를 모두 체크하여
     * 모달 컨테이너에 .gm-dark-theme 클래스를 적용/제거합니다.
     */
    function applyDarkTheme() {
        const container = document.getElementById('gm-modal-container');
        if (!container) return; // 모달 컨테이너가 없으면 중단

        // 조건 1: 시스템이 다크 모드인가?
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // 조건 2: 사이트가 다크 모드인가? (dark.css가 로드되었는가?)
        const isSiteDark = document.getElementById('css-darkmode') !== null;

        if (isSystemDark || isSiteDark) {
            container.classList.add('gm-dark-theme');
        } else {
            container.classList.remove('gm-dark-theme');
        }
    }

    // 리스너 1: 시스템 다크 모드 설정이 변경되면 테마 다시 적용
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyDarkTheme);

    // 리스너 2: 사이트의 darkmode() 함수를 후킹(hooking)합니다.
    // Tampermonkey에서 페이지의 window 객체에 접근하려면 unsafeWindow를 사용해야 합니다.
    if (typeof unsafeWindow.darkmode === 'function') {
        const originalDarkmode = unsafeWindow.darkmode; // 원본 함수 저장

        // 원본 함수를 덮어쓰기
        unsafeWindow.darkmode = function() {
            // 1. 원본 'darkmode()' 함수를 먼저 실행
            originalDarkmode.apply(this, arguments);

            // 2. 원본 함수 실행 직후, 우리 테마도 즉시 업데이트
            // (페이지가 리로드되지 않는 경우를 대비)
            applyDarkTheme();
        };
    }
    // 4. (UI) 모달 컨테이너 (v1.35와 동일6.1: 생성 직후 테마 적용)
    const modalContainer = document.createElement('div');
    modalContainer.id = "gm-modal-container";
    document.body.appendChild(modalContainer);
    applyDarkTheme(); // <-- [수정] 컨테이너 생성 직후 현재 테마 상태 적용

    // 5. (UI) 검색 버튼 생성/관리 함수 (v1.35와 동일)
    function createOrEnsureButton() {
        if (document.getElementById('gm-search-btn')) {
            return;
        }
        const triggerButton = document.createElement('button');
        triggerButton.id = 'gm-search-btn';
        triggerButton.innerText = '심화 검색';
        triggerButton.addEventListener('click', showSearchModal);
        document.body.appendChild(triggerButton);
    }

    // 6. (Function) ID 자동 감지 (v1.35와 동일)
    function autoFillGalleryId() {
        const inputEl = document.getElementById('gm-gallery-id');
        if (!inputEl) return;
        const url = window.location.href;
        const match = url.match(/id=([a-zA-Z0-9_]+)/);
        if (match && match[1]) {
            inputEl.value = match[1];
        } else {
             inputEl.placeholder = "갤러리 ID를 URL에서 찾을 수 없습니다.";
        }
    }

    // 7. (Function) 검색창 열기 (v1.36.1: 테마 적용 로직 추가)
    function showSearchModal() {
        if (document.getElementById('gm-search-modal')) return;
        closeModal();
        modalContainer.innerHTML = searchModalHTML;
        document.getElementById('gm-start-search').addEventListener('click', startSearch);
        document.getElementById('gm-close-search').addEventListener('click', closeModal);
        document.getElementById('gm-close-search-x').addEventListener('click', closeModal);
        autoFillGalleryId();
        applyDarkTheme(); // <-- [수정] 모달 열 때 테마 적용
    }

    // 8. (Function) 모달 닫기 (v1.35와 동일)
    function closeModal() {
        isSearchCancelled = true;
        modalContainer.innerHTML = '';
    }

    // 클립보드 복사 함수 (v1.35와 동일)
    function copyResults(results) {
        let textToCopy = '';
        results.forEach(item => {
            textToCopy += `${item.title}\n${item.link}\n\n`;
        });
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyStatus = document.getElementById('gm-copy-status');
            if (copyStatus) {
                copyStatus.textContent = '복사 완료!';
                setTimeout(() => { copyStatus.textContent = ''; }, 2000);
            }
        }).catch(err => {
            const copyStatus = document.getElementById('gm-copy-status');
            if (copyStatus) {
                copyStatus.textContent = '복사 실패!';
            }
        });
    }

    // 결과 목록을 화면에 그리는 함수 (v1.35와 동일)
    function renderResultsList(resultsToShow) {
        const listContainer = document.getElementById('gm-results-list');
        if (!listContainer) return;

        listContainer.innerHTML = ''; // 목록 비우기

        if (resultsToShow.length === 0) {
            listContainer.innerText = '일치하는 항목이 없습니다.';
        } else {
            resultsToShow.forEach(item => {
                const linkEl = document.createElement('a');
                linkEl.href = item.link;
                linkEl.target = '_blank';
                linkEl.title = `글쓴이: ${item.writer}`;
                linkEl.innerHTML = `<span class="gm-result-date">${item.date}</span>${item.title}`;
                listContainer.appendChild(linkEl);
            });
        }
    }

    // 실시간 고급 검색 함수 (v1.35와 동일)
    function handleFilter() {
        const filterText = document.getElementById('gm-filter-keyword').value.toLowerCase();
        const filterType = document.getElementById('gm-filter-type').value;

        if (!filterText) {
            renderResultsList(currentFullResults);
            return;
        }

        const filteredResults = currentFullResults.filter(item => {
            if (filterType === 'title') {
                return item.title.toLowerCase().includes(filterText);
            } else if (filterType === 'writer') {
                return item.writer.toLowerCase().includes(filterText);
            }
            return false;
        });

        renderResultsList(filteredResults);
    }


    // 9. (Function) 결과창 열기 (v1.36.1: 테마 적용 로직 추가)
    function showResultsModal(results, info, isQuickSearch) {
        closeModal();
        isSearchCancelled = false;
        modalContainer.innerHTML = resultsModalHTML;

        currentFullResults = results;

        document.getElementById('gm-close-results-x').addEventListener('click', closeModal);
        document.getElementById('gm-copy-results').addEventListener('click', () => copyResults(results));
        document.getElementById('gm-search-again').addEventListener('click', showSearchModal);

        document.getElementById('gm-toggle-filter').addEventListener('click', () => {
            const filterBox = document.querySelector('.gm-filter-box');
            if (filterBox.style.display === 'flex') {
                filterBox.style.display = 'none';

                const filterInput = document.getElementById('gm-filter-keyword');
                if (filterInput.value !== '') {
                    filterInput.value = '';
                    renderResultsList(currentFullResults);
                }

            } else {
                filterBox.style.display = 'flex';
            }
        });

        document.getElementById('gm-filter-btn').addEventListener('click', handleFilter);
        document.getElementById('gm-filter-keyword').addEventListener('input', handleFilter);
        document.getElementById('gm-filter-type').addEventListener('change', handleFilter);

        if (isQuickSearch) {
            const writerOption = document.getElementById('gm-filter-type').querySelector('option[value="writer"]');
            if(writerOption) {
                writerOption.disabled = true;
                writerOption.textContent = "글쓴이 (빠른 검색 끔)";
            }
        }

        const infoEl = document.getElementById('gm-results-info');
        if (info) {
            infoEl.textContent = `총 ${info.shown}개 표시 (전체 ${info.totalFound}개 발견 / ${info.loops}회 반복)`;
        }

        renderResultsList(currentFullResults);
        applyDarkTheme(); // <-- [수정] 모달 열 때 테마 적용
    }

    // HTML을 가져오는 공통 함수 (v1.35와 동일)
    async function fetchDocument(url) {
        const cacheBustedUrl = url + (url.includes('?') ? '&' : '?') + `_=${new Date().getTime()}`;
        const response = await GM.xmlHttpRequest({
            method: "GET",
            url: cacheBustedUrl,
            headers: { "Cache-Control": "no-store", "Pragma": "no-cache", "Expires": "0" }
        });
        return new DOMParser().parseFromString(response.responseText, 'text/html');
    }

    // 10. (Core Logic) 검색 시작 함수 (v1.35와 동일)
    async function startSearch() {
        const statusEl = document.getElementById('gm-status');

        isSearchCancelled = false;

        // --- 1. 값 가져오기 & 2. 유효성 검사 ---
        const galleryId = document.getElementById('gm-gallery-id').value.trim();
        const keyword = document.getElementById('gm-keyword').value.trim();
        const searchType = document.getElementById('gm-search-type').value;
        const usePostCount = document.getElementById('gm-cond-posts').checked;
        let targetPostCount = parseInt(document.getElementById('gm-post-count').value, 10);
        const usePageCount = document.getElementById('gm-cond-pages').checked;
        let targetPageCount = parseInt(document.getElementById('gm-page-count').value, 10);
        const isQuickSearch = document.getElementById('gm-quick-search').checked;

        if (!galleryId || !keyword) { /* ... */ return; }
        if (!usePostCount && !usePageCount) { /* ... */ return; }
        if (usePostCount && targetPostCount <= 0) targetPostCount = 50;
        if (usePageCount && targetPageCount <= 0) targetPageCount = 10;

        statusEl.innerText = '검색을 시작합니다... (0개)';

        // --- 3. 검색 로직 (v1.35와 동일) ---
        let boardType = '';
        const pathname = window.location.pathname;
        if (pathname.startsWith('/board/lists')) {
            boardType = 'board';
        } else if (pathname.startsWith('/gallery/board/lists')) {
            boardType = 'gallery/board';
        } else if (pathname.startsWith('/mgallery/board/lists')) {
            boardType = 'mgallery/board';
        } else if (pathname.startsWith('/mini/board/lists')) {
            boardType = 'mini/board';
        } else {
            statusEl.innerText = '오류: 알 수 없는 갤러리 경로';
            return;
        }

        let allResults = [];
        let requestCount = 0;
        let currentSearchPosStr = "";
        let keepSearchingPos = true;

        const protocol = window.location.protocol;
        const baseUrl = `${protocol}//gall.dcinside.com/${boardType}/lists/?id=${galleryId}&s_type=${searchType}&s_keyword=${encodeURIComponent(keyword)}`;
        const baseOrigin = `${protocol}//gall.dcinside.com`;

        // --- 🔄 [OUTER LOOP] search_pos ---
        while (keepSearchingPos) {

            if (isSearchCancelled) break;

            requestCount++;
            if (usePageCount && requestCount > targetPageCount) {
                statusEl.innerText = `검색 완료. (목표 반복 수 ${targetPageCount}회 도달)`;
                break; // Outer loop
            }

            let firstPageDoc = null;
            let maxPage = 1;
            const pagesToScrape = new Map();

            try {
                // 1. 1페이지 가져오기
                let pageOneUrl = `${baseUrl}&page=1`;
                if (currentSearchPosStr !== "") {
                    pageOneUrl += `&search_pos=${currentSearchPosStr}`;
                }
                const doc = await fetchDocument(pageOneUrl);
                firstPageDoc = doc;
                pagesToScrape.set(1, pageOneUrl);

                // 2. 페이지 목록 스캔
                const pageLinks = doc.querySelectorAll('.bottom_paging_box a[href*="page="], .paging_search a[href*="page="]');
                pageLinks.forEach(link => {
                    const pageMatch = link.href.match(/page=(\d+)/);
                    if (pageMatch && pageMatch[1]) {
                        const pageNum = parseInt(pageMatch[1], 10);
                        if (!pagesToScrape.has(pageNum)) {
                            let pageUrl = new URL(link.href, baseOrigin).href;
                            if (currentSearchPosStr !== "" && !pageUrl.includes("search_pos=")) {
                                pageUrl += `&search_pos=${currentSearchPosStr}`;
                            }
                            pagesToScrape.set(pageNum, pageUrl);
                        }
                        maxPage = Math.max(maxPage, pageNum);
                    }
                });

                // --- 🔄 [INNER LOOP] for each page in (1/2/3/4...) ---
                const sortedPages = Array.from(pagesToScrape.keys()).sort((a, b) => a - b);

                for (const currentPage of sortedPages) {

                    if (isSearchCancelled) break;

                    statusEl.innerText = `검색 중... (총 ${allResults.length}개 / ${requestCount}회 반복 / ${currentPage}/${maxPage} 페이지)`;

                    let currentDoc;
                    if (currentPage === 1) {
                        currentDoc = firstPageDoc;
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        currentDoc = await fetchDocument(pagesToScrape.get(currentPage));
                    }

                    const rows = currentDoc.querySelectorAll('tr.us-post:not(.ub-notice)');

                    if (rows.length === 0 && currentPage === 1 && requestCount === 1) {
                        statusEl.innerText = '검색 결과가 없습니다.';
                        keepSearchingPos = false; // Outer
                        break; // Inner
                    }

                    // 글 수집
                    for (const row of rows) {
                        const titleEl = row.querySelector('.gall_tit a');
                        let dateText = '';
                        let writerName = '';

                        if (!isQuickSearch) {
                            const dateEl = row.querySelector('.gall_date');
                            const writerEl = row.querySelector('.gall_writer');
                            dateText = dateEl ? dateEl.textContent.trim() : '';
                            if (writerEl) {
                                const writerInner = writerEl.querySelector('a') || writerEl.querySelector('em') || writerEl;
                                writerName = writerInner.textContent.trim();
                            }
                        }

                        if (titleEl) {
                            allResults.push({
                                title: titleEl.textContent.trim(),
                                link: new URL(titleEl.getAttribute('href'), baseOrigin).href,
                                date: dateText,
                                writer: writerName
                            });
                            if (usePostCount && allResults.length >= targetPostCount) {
                                statusEl.innerText = `검색 완료. (목표 글 ${targetPostCount}개 도달)`;
                                keepSearchingPos = false; // Outer
                                break; // for
                            }
                        }
                    }
                    if (!keepSearchingPos) break; // Inner
                } // --- 🔚 [END OF INNER LOOP] ---

            } catch (error) {
                console.error('DCInside 검색 오류:', error);
                statusEl.innerText = '오류가 발생했습니다. (콘솔 확인)';
                keepSearchingPos = false;
            }

            if (!keepSearchingPos || isSearchCancelled) break; // Outer

            // --- 다음 'search_pos' 준비 (v1.35와 동일) ---
            if (!firstPageDoc) {
                statusEl.innerText = `검색 오류. (1페이지 Doc 없음)`;
                keepSearchingPos = false;
                break;
            }

            const nextSearchButton = firstPageDoc.querySelector('.search_next');
            if (nextSearchButton) {
                const nextHref = nextSearchButton.getAttribute('href');
                const match = nextHref.match(/search_pos=([-\d]+)/);
                if (match && match[1]) {
                    currentSearchPosStr = match[1];
                } else {
                    statusEl.innerText = `검색 오류. (search_pos 파싱 실패)`;
                    keepSearchingPos = false;
                }
            } else {
                statusEl.innerText = `검색 완료. (마지막 search_pos 도달)`;
                keepSearchingPos = false;
            }

            if (keepSearchingPos) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } // --- 🔚 [END OF OUTER LOOP] ---

        if (isSearchCancelled) {
            console.log("검색이 사용자에 의해 중단되었습니다.");
            return;
        }

        // --- 4. 결과 표시 (v1.35와 동일) ---
        let finalResults = allResults;
        if (usePostCount) {
            finalResults = allResults.slice(0, targetPostCount);
        }

        const info = {
            totalFound: allResults.length,
            shown: finalResults.length,
            loops: (requestCount > 0) ? requestCount : 0
        };

        closeModal();
        showResultsModal(finalResults, info, isQuickSearch);
    }

    // '뒤로 가기' (bfcache) 대응 (v1.35와 동일)
    window.addEventListener('pageshow', function(event) {
        const currentUrl = window.location.href;
        const isMatch = currentUrl.includes('/gallery/board/lists') ||
                        currentUrl.includes('/board/lists') || // 정식
                        currentUrl.includes('/mgallery/board/lists') || // 마이너
                        currentUrl.includes('/mini/board/lists'); // 미니

        if (event.persisted && isMatch) {
            setTimeout(createOrEnsureButton, 100);
             // [v1.36.1] 뒤로가기 시에도 테마 적용
            setTimeout(applyDarkTheme, 100);
        }
    });

    // 초기 로드 시 버튼 생성
    createOrEnsureButton();

})();