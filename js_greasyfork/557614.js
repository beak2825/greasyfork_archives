// ==UserScript==
// @name         LIMS 주요 고객 알리미
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  IBSheet 기반 고객 알림 및 관리 시스템
// @author       김재형
// @match        *://*/ngs/sample/retrieveWaitForm.do*
// @match        *://*/ngs/order/retrieveNgsOrdRceptForm.do*
// @match        *://*/ngs/order/retrieveNgsOrdRceptDetailForm.do*
// @match        *://*/ngs/library/retrieveWaitForm.do*
// @match        *://*/ngs/sample/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/557614/LIMS%20%EC%A3%BC%EC%9A%94%20%EA%B3%A0%EA%B0%9D%20%EC%95%8C%EB%A6%AC%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/557614/LIMS%20%EC%A3%BC%EC%9A%94%20%EA%B3%A0%EA%B0%9D%20%EC%95%8C%EB%A6%AC%EB%AF%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================================================================================
    // 1. 설정 및 상태
    // ======================================================================================
    const STORAGE_KEY = 'watched_customers';
    const SNOOZE_KEY = 'alert_snoozed';
    const HIGHLIGHT_COLOR = '#FFFF00'; // 형광 노란색 (Bright Yellow)
    const TARGET_SHEETS = ['ibsWaitDna', 'ibsWaitRna', 'ibsWaitDnaPrep', 'ibsWaitRnaPrep'];
    const CUSTOMER_COL_NAME = 'userName'; // 고객명 컬럼

    let watchedList = GM_getValue(STORAGE_KEY, {});
    let badgeCount = 0;
    let isSnoozed = GM_getValue(SNOOZE_KEY, false);
    let detectedCustomers = new Set();

    // ======================================================================================
    // 2. UI 컴포넌트 (배지 & 패널)
    // ======================================================================================
    function createUI() {
        // 2.1 배지 (Badge)
        const badge = document.createElement('div');
        badge.id = 'customer-alert-badge';
        badge.innerHTML = `
            <span id="alert-icon">🔔</span>
            <span id="alert-count" style="display:none">0</span>
        `;
        document.body.appendChild(badge);

        // 2.2 제어 패널 (모달)
        const panel = document.createElement('div');
        panel.id = 'customer-alert-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>🔔 알림 목록 관리</h3>
                <div style="display:flex; gap:5px;">
                    <button id="snooze-btn" style="cursor:pointer; padding:2px 5px;">🔕</button>
                    <button id="close-panel" style="cursor:pointer;">✖</button>
                </div>
            </div>
            <div class="panel-body">
                <ul id="watched-list-ul"></ul>
            </div>
            <div class="panel-footer">
                <small>그리드에서 고객명을 <b>Alt + 클릭</b>하여 추가/삭제하세요.</small>
            </div>
        `;
        document.body.appendChild(panel);

        // 이벤트 (Events)
        badge.addEventListener('click', () => {
            if (panel.style.display === 'none') {
                reapplyHighlights();
                panel.style.display = 'block';
                renderList();
            } else {
                panel.style.display = 'none';
            }
        });
        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        document.getElementById('snooze-btn').addEventListener('click', toggleSnooze);

        // 스타일 (Styles)
        GM_addStyle(`
            #customer-alert-badge {
                position: fixed; bottom: 40px; right: 20px;
                width: 50px; height: 50px;
                background: white; border-radius: 50%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex; justify-content: center; align-items: center;
                font-size: 24px; cursor: pointer; z-index: 9999;
                transition: transform 0.2s;
            }
            #customer-alert-badge:hover { transform: scale(1.1); }
            #alert-count {
                position: absolute; top: -5px; right: -5px;
                background: red; color: white;
                font-size: 12px; font-weight: bold;
                padding: 2px 6px; border-radius: 10px;
            }
            #customer-alert-panel {
                position: fixed; bottom: 80px; right: 20px;
                width: 300px; max-height: 400px;
                background: white; border: 1px solid #ccc;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999; border-radius: 8px;
                display: flex; flex-direction: column;
            }
            .panel-header {
                padding: 10px; background: #f8f9fa; border-bottom: 1px solid #eee;
                display: flex; justify-content: space-between; align-items: center;
            }
            .panel-body { padding: 10px; overflow-y: auto; flex-grow: 1; }
            .panel-footer { padding: 10px; background: #f8f9fa; border-top: 1px solid #eee; font-size: 11px; color: #666; }
            #watched-list-ul { list-style: none; padding: 0; margin: 0; }
            #watched-list-ul li {
                display: flex; justify-content: space-between;
                padding: 5px 0; border-bottom: 1px solid #f0f0f0;
            }
            .delete-btn { color: red; cursor: pointer; font-weight: bold; margin-left: 10px; }

            @keyframes shake {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
                100% { transform: rotate(0deg); }
            }
            .shake-animation {
                animation: shake 0.4s ease-in-out;
            }
            .toast-message {
                position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8); color: white;
                padding: 10px 20px; border-radius: 20px;
                z-index: 10000; font-size: 14px;
                opacity: 0; transition: opacity 0.3s;
                pointer-events: none;
            }
            .toast-message.show { opacity: 1; }
        `);
    }

    function renderList() {
        const ul = document.getElementById('watched-list-ul');
        ul.innerHTML = '';
        Object.keys(watchedList).forEach(name => {
            const isDetected = detectedCustomers.has(name);
            const li = document.createElement('li');
            if (isDetected) {
                li.style.backgroundColor = '#fff3cd';
            }
            li.innerHTML = `
                <span>${name} ${isDetected ? '<span style="color:red; font-weight:bold; margin-left:5px;">(발견!)</span>' : ''}</span>
                <span class="delete-btn" data-name="${name}">삭제</span>
            `;
            ul.appendChild(li);
        });

        // 삭제 이벤트 추가
        ul.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                toggleWatchList(name);
                renderList();
            });
        });
    }

    // ======================================================================================
    // 3. 로직 & 훅 (Logic & Hooks)
    // ======================================================================================

    function showToast(message) {
        let toast = document.getElementById('customer-alert-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'customer-alert-toast';
            toast.className = 'toast-message';
            document.body.appendChild(toast);
        }

        toast.innerText = message;
        toast.classList.add('show');

        if (toast.timer) clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function isWatched(name) {
        if (!name) return false;
        // 정확히 일치하는 경우
        if (watchedList.hasOwnProperty(name)) return true;
        // watchedList의 각 항목에서 괄호 앞 이름만 추출해서 비교
        const normalizedName = name.split('(')[0].trim();
        for (const key of Object.keys(watchedList)) {
            const normalizedKey = key.split('(')[0].trim();
            if (normalizedName === normalizedKey) return true;
        }
        return false;
    }

    function toggleWatchList(name) {
        if (!name) return;
        if (watchedList[name]) {
            delete watchedList[name];
            showToast(`🗑️ [${name}] 알림 해제`);
        } else {
            watchedList[name] = { addedAt: new Date().toISOString() };
            showToast(`🔔 [${name}] 알림 설정`);
        }
        GM_setValue(STORAGE_KEY, watchedList);
        reapplyHighlights();
    }

    function updateSnoozeUI() {
        const btn = document.getElementById('snooze-btn');
        const badge = document.getElementById('customer-alert-badge');
        if (!btn || !badge) return;

        if (isSnoozed) {
            btn.innerText = "🔔"; // 켜기 아이콘 (현재 꺼짐 상태임)
            btn.title = "알림 켜기";
            badge.style.opacity = "0.5";
            badge.style.filter = "grayscale(100%)";
        } else {
            btn.innerText = "🔕"; // 끄기 아이콘 (현재 켜짐 상태임)
            btn.title = "알림 끄기";
            badge.style.opacity = "1";
            badge.style.filter = "none";
        }
    }

    function toggleSnooze() {
        isSnoozed = !isSnoozed;
        GM_setValue(SNOOZE_KEY, isSnoozed);
        updateSnoozeUI();

        if (!isSnoozed) {
            shakeBadge();
        }
        updateBadge(true);
    }

    function shakeBadge() {
        if (isSnoozed) return;
        const badge = document.getElementById('customer-alert-badge');
        badge.classList.remove('shake-animation');
        void badge.offsetWidth; // 리플로우 강제
        badge.classList.add('shake-animation');
    }

    function updateBadge(skipShake) {
        const countEl = document.getElementById('alert-count');
        if (badgeCount > 0) {
            countEl.innerText = badgeCount;
            countEl.style.display = 'block';
            if (!skipShake && !isSnoozed) shakeBadge();
        } else {
            countEl.style.display = 'none';
        }
    }

    // 시트가 현재 화면에 보이는지 확인하는 함수
    function isSheetVisible(sheetName) {
        // 1. 기존 규칙 (div + SheetName) 시도 (탭이 있는 경우를 위해)
        const containerId1 = "div" + sheetName.charAt(0).toUpperCase() + sheetName.slice(1);
        const containerId2 = "div" + sheetName;

        const el = document.getElementById(containerId1) || document.getElementById(containerId2);

        if (el) {
            // 컨테이너가 존재하면, 실제 가시성(탭 활성화 여부) 확인
            return el.offsetParent !== null;
        }

        // 2. 컨테이너를 찾지 못한 경우 (예: 주문접수 페이지의 ordRceptSheet)
        // 탭에 숨겨진 것이 아니라고 가정하고 항상 보이는 것으로 처리
        return true;
    }

    function reapplyHighlights() {
        // 카운트 초기화
        badgeCount = 0;
        detectedCustomers.clear();

        TARGET_SHEETS.forEach(sheetName => {
            if (unsafeWindow[sheetName]) {
                const sheet = unsafeWindow[sheetName];

                // 필수 메서드 확인
                if (!sheet.RowCount || !sheet.GetCellValue || !sheet.LastRow) {
                    return;
                }

                const isVisible = isSheetVisible(sheetName);
                const colName = getCustomerColName(sheet);
                if (!colName) return;

                // 행 순회 (HeaderRows 부터 LastRow 까지)
                const startRow = (sheet.HeaderRows && typeof sheet.HeaderRows === 'function') ? sheet.HeaderRows() : 1;
                const lastRow = sheet.LastRow();

                for (let row = startRow; row <= lastRow; row++) {
                    try {
                        const name = sheet.GetCellValue(row, colName);
                        if (name && isWatched(name)) {
                            // sheet.SetRowBackColor(row, HIGHLIGHT_COLOR); // 기존: 행 전체 강조

                            // 변경: 고객명과 주문번호 컬럼만 강조
                            sheet.SetCellBackColor(row, colName, HIGHLIGHT_COLOR);

                            const ordColName = getOrderNoColName(sheet);
                            if (ordColName) {
                                sheet.SetCellBackColor(row, ordColName, HIGHLIGHT_COLOR);
                            }

                            if (isVisible) {
                                detectedCustomers.add(name);
                                badgeCount++;
                            }
                        }
                    } catch (e) {
                        // 오류 무시
                    }
                }
            }
        });

        updateBadge();
    }

    // 후킹 함수 (Hooking Function)
    function hookIBSheet() {
        const win = unsafeWindow;

        TARGET_SHEETS.forEach(sheetName => {
            // 1. OnRowSearchEnd 훅
            const eventNameSearch = `${sheetName}_OnRowSearchEnd`;
            const originalSearch = win[eventNameSearch];

            win[eventNameSearch] = function (row) {
                if (originalSearch) originalSearch.apply(this, arguments);
                try {
                    const sheet = win[sheetName];
                    if (sheet) {
                        const colName = getCustomerColName(sheet);
                        if (colName) {
                            const name = sheet.GetCellValue(row, colName);
                            if (isWatched(name)) {
                                // sheet.SetRowBackColor(row, HIGHLIGHT_COLOR); // 기존: 행 전체 강조

                                // 변경: 고객명과 주문번호 컬럼만 강조
                                sheet.SetCellBackColor(row, colName, HIGHLIGHT_COLOR);

                                const ordColName = getOrderNoColName(sheet);
                                if (ordColName) {
                                    sheet.SetCellBackColor(row, ordColName, HIGHLIGHT_COLOR);
                                }

                                if (isSheetVisible(sheetName)) {
                                    badgeCount++;
                                    updateBadge();
                                }
                            }
                        }
                    }
                } catch (e) { /* 오류 무시 */ }
            };

            // 2. OnClick 훅
            const eventNameClick = `${sheetName}_OnClick`;
            const originalClick = win[eventNameClick];

            win[eventNameClick] = function (row, col, value, cellX, cellY, cellW, cellH, rowtype) {
                const e = win.event;
                const isDataRow = (rowtype === "DataRow") || (rowtype === undefined);

                if (e && e.altKey && isDataRow) {
                    const sheet = win[sheetName];
                    if (sheet) {
                        const clickedColName = sheet.ColSaveName(col);
                        const targetColName = getCustomerColName(sheet);

                        if (clickedColName === targetColName) {
                            toggleWatchList(value);
                        }
                    }
                }

                if (originalClick) originalClick.apply(this, arguments);
            };
        });
    }

    // 동적으로 IBSheet 인스턴스를 찾는 함수
    function findIBSheets() {
        try {
            Object.keys(unsafeWindow).forEach(key => {
                // 'ibs'로 시작하고 IBSheet의 핵심 메서드를 가진 객체를 찾음
                if (key.startsWith('ibs') || key.endsWith('Sheet')) { // ibs로 시작하거나 Sheet로 끝나는 변수명 탐색
                    const sheet = unsafeWindow[key];
                    if (sheet && typeof sheet.GetCellValue === 'function') {
                        if (!TARGET_SHEETS.includes(key)) {
                            TARGET_SHEETS.push(key);
                        }
                    }
                }
            });
        } catch (e) {
            // 오류 무시
        }
    }

    // 시트별 고객명 컬럼 찾기
    function getCustomerColName(sheet) {
        try {
            // 1. userName 확인
            if (sheet.SaveNameCol("userName") > -1) return "userName";
            // 2. custNm 확인 (주문접수 페이지 등)
            if (sheet.SaveNameCol("custNm") > -1) return "custNm";
        } catch (e) {
            console.error("Error checking column names:", e);
        }
        return null;
    }

    // 시트별 주문번호 컬럼 찾기
    function getOrderNoColName(sheet) {
        try {
            const candidates = ['ordNo', 'ngsOrdNo', 'orderNo'];
            for (const name of candidates) {
                if (sheet.SaveNameCol(name) > -1) return name;
            }
        } catch (e) {
            console.error("Error checking order column names:", e);
        }
        return null;
    }

    // 상세 페이지(Detail Form)에서 고객명 강조
    function highlightDetailPage() {
        let attempts = 0;
        const maxAttempts = 30; // 최대 15초 (500ms * 30)

        const checkAndHighlight = () => {
            attempts++;
            const custViewInput = document.getElementById('custView');
            const customerName = custViewInput ? custViewInput.value.split('(')[0].trim() : '';

            if (customerName) {
                if (isWatched(customerName)) {
                    if (custViewInput) {
                        const parentTd = custViewInput.closest('td');
                        if (parentTd) {
                            parentTd.style.backgroundColor = HIGHLIGHT_COLOR;
                            custViewInput.style.backgroundColor = HIGHLIGHT_COLOR;
                            detectedCustomers.add(customerName);
                            badgeCount++;
                            updateBadge();
                        }
                    }
                }
            } else if (attempts < maxAttempts) {
                setTimeout(checkAndHighlight, 500);
            }
        };

        checkAndHighlight();
    }

    // ======================================================================================
    // 4. 초기화 (Initialization)
    // ======================================================================================
    function init() {
        findIBSheets(); // 동적으로 시트 탐색
        createUI();
        updateSnoozeUI(); // 초기 스누즈 상태 반영
        setTimeout(hookIBSheet, 1000);

        // 상세 페이지인 경우 고객명 강조 (자체 폴링으로 데이터 대기)
        if (window.location.href.includes('DetailForm.do')) {
            setTimeout(highlightDetailPage, 500);
        }

        // 탭 클릭 이벤트 감지 (탭 전환 시 배지 갱신)
        // jQuery UI Tabs의 앵커 클래스 사용
        document.body.addEventListener('click', function (e) {
            if (e.target.matches('.ui-tabs-anchor')) {
                // 탭 전환 애니메이션 등을 고려하여 약간의 지연 후 갱신
                setTimeout(reapplyHighlights, 200);
            }
        });
    }

    window.addEventListener('load', init);

})();
