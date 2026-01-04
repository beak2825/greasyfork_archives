// ==UserScript==
// @name         LIMS 샘플 재접수요청 처리 자동 매칭
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  LIMS SQC 연동 및 자동 매칭 (Timeout & 안정성 강화)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/order/retrieveNgsReSmplReqProcesForm.do*
// @match        https://lims3.macrogen.com/ngs/com/retrieveNgsSmplRcptInfoPopup.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558581/LIMS%20%EC%83%98%ED%94%8C%20%EC%9E%AC%EC%A0%91%EC%88%98%EC%9A%94%EC%B2%AD%20%EC%B2%98%EB%A6%AC%20%EC%9E%90%EB%8F%99%20%EB%A7%A4%EC%B9%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/558581/LIMS%20%EC%83%98%ED%94%8C%20%EC%9E%AC%EC%A0%91%EC%88%98%EC%9A%94%EC%B2%AD%20%EC%B2%98%EB%A6%AC%20%EC%9E%90%EB%8F%99%20%EB%A7%A4%EC%B9%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 메인 페이지와 팝업 간 통신 채널
    const CH_NAME = 'LIMS_PICKER_CHANNEL';
    const bc = new BroadcastChannel(CH_NAME);

    // UI 색상 팔레트
    const PALETTE = {
        PRIMARY: '#1976D2',
        PRIMARY_BG: '#E3F2FD',
        SECONDARY: '#F57F17',
        SECONDARY_BG: '#FFF8E1',
        DANGER: '#C62828',
        SUCCESS: '#2E7D32',
        TEXT_MAIN: '#2D3436',
        TEXT_SUB: '#636E72',
        PANEL_BORDER: '#B2BEC3',
        STATUS_BG: '#2D3436'
    };

    // 타겟 샘플명 저장/조회 (localStorage + Tampermonkey + BroadcastChannel)
    const storage = {
        set: (key, val) => {
            localStorage.setItem(key, val);
            if (typeof GM_setValue !== 'undefined') GM_setValue(key, val);
            bc.postMessage({ type: 'SET_TARGET', key: key, value: val });
        },
        get: (key) => {
            let val = localStorage.getItem(key);
            if (!val && typeof GM_getValue !== 'undefined') val = GM_getValue(key);
            return val;
        }
    };

    // 페이지 타입 감지 (메인 페이지 vs 샘플선택 팝업)
    function detectPageType() {
        const path = window.location.pathname;
        if (path.includes('Popup')) return 'POPUP';
        return 'MAIN';
    }

    // 전역 상태
    let sqcDataMap = {};              // SQC 데이터 (샘플ID -> {날짜, 결과})
    let popupPollingTimer = null;     // 팝업 스캔 타이머
    let matchFoundThisSession = false; // 매칭 성공 여부
    let isSqcFetching = false;        // SQC 데이터 로딩 중 플래그

    // 매칭 상태 초기화 (팝업에서 재검색 시)
    function clearCurrentMatchState(doc) {
        if (popupPollingTimer) clearInterval(popupPollingTimer);
        matchFoundThisSession = false;

        const old = (doc || document).getElementById('lims-nav-panel');
        if (old) old.remove();

        const scanAndClear = (win) => {
            const sheet = win.smplInfoSheet || (win.unsafeWindow && win.unsafeWindow.smplInfoSheet);
            if (sheet && sheet.RowCount() > 0) {
                for (let r = sheet.HeaderRows(); r < sheet.HeaderRows() + sheet.RowCount(); r++) {
                    sheet.SetRowBackColor(r, '#ffffff');
                }
            }
        };
        scanAndClear(window);
        document.querySelectorAll('iframe, frame').forEach(f => {
            try { scanAndClear(f.contentWindow); } catch (e) { }
        });
    }

    // SQC 데이터 로드 완료 후 스캔 트리거
    function triggerScan() {
        const tn = storage.get('targetSampleName');
        if (!tn) return;

        if (detectPageType() === 'MAIN') {
            scanAllFrames(tn);
        } else {
            startPopupScanning(tn);
        }
    }

    // 팝업에서 타겟 샘플 자동 매칭 시작 (200ms 간격으로 스캔, 6초 타임아웃)
    function startPopupScanning(targetName) {
        if (popupPollingTimer) clearInterval(popupPollingTimer);
        matchFoundThisSession = false;
        let attempts = 0;

        popupPollingTimer = setInterval(() => {
            attempts++;
            // SQC 로딩 중이면 잠시 대기 (깜빡임 방지)
            if (isSqcFetching && attempts < 5) return;

            const found = scanAllFrames(targetName);

            if (found) {
                matchFoundThisSession = true;
                clearInterval(popupPollingTimer);
            }

            // 타임아웃: 6초 (200ms * 30회)
            if (attempts > 30) {
                clearInterval(popupPollingTimer);
                if (!matchFoundThisSession) {
                    renderEmptyAlert(document, targetName);
                }
            }
        }, 200);
    }

    // SQC 날짜 데이터 가져오기 (최근 1년치)
    async function fetchSqcDates(ordNo) {
        if (!ordNo) return;
        isSqcFetching = true;
        sqcDataMap = {};
        try {
            const today = new Date();
            const past = new Date(); past.setFullYear(today.getFullYear() - 1);
            const fmt = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
            const fmtDash = (d) => d.toISOString().split('T')[0];
            const payload = {
                dataSet: {
                    qcResultForm: [
                        { name: "searchRgsnCd", value: "01" },
                        { name: "searchRgsnFrom_text", value: fmtDash(past) },
                        { name: "searchRgsnFrom", value: fmt(past) },
                        { name: "searchRgsnTo_text", value: fmtDash(today) },
                        { name: "searchRgsnTo", value: fmt(today) },
                        { name: "searchBaseCd", value: "01" }, { name: "searchBase", value: ordNo },
                        { name: "menuCd", value: "RPT100800" }
                    ]
                }
            };
            const response = await fetch(`/ngs/report/retrieveQcResultList.do`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(payload)
            });
            const rawText = await response.text();
            const cleanText = rawText.replace(/\0/g, '').replace(/^(\/\/\s*|\)\]\}',?\s*)/, '').trim();
            const data = (new Function('return (' + cleanText + ')'))();
            const items = data.result || [];
            sqcDataMap = {};
            items.forEach(item => {
                const sid = (item.smplId || '').trim();
                const rawDate = item.sqcWorkCmplDttm || item.workCmplDttm;
                if (sid && rawDate) {
                    let d = rawDate.toString();
                    if (d.includes(' ')) d = d.split(' ')[0];
                    if (d.length === 8 && !d.includes('-')) d = `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`;
                    sqcDataMap[sid] = { date: d, result: item.sqcManuReslNm || 'Wait' };
                }
            });
        } catch (e) { } finally {
            isSqcFetching = false;
            triggerScan();
        }
    }

    // 모든 프레임에서 타겟 샘플 검색
    function scanAllFrames(targetName) {
        let anyFound = false;
        const scan = (win, doc) => {
            const sheet = win.smplInfoSheet || (win.unsafeWindow && win.unsafeWindow.smplInfoSheet);
            if (sheet && sheet.RowCount() > 0) {
                if (doScanSheet(doc, sheet, targetName)) anyFound = true;
            }
        };
        scan(window, document);
        document.querySelectorAll('iframe, frame').forEach(f => {
            try { scan(f.contentWindow, f.contentDocument); } catch (e) { }
        });
        return anyFound;
    }

    // IBSheet에서 타겟 샘플 찾아서 하이라이트 + 네비게이션 패널 렌더링
    function doScanSheet(doc, sheet, targetName) {
        if (isSqcFetching) return false;

        const candidates = [];
        // 컬럼 인덱스 찾기 (샘플ID, 샘플명, 접수일)
        let idCol = -1, nmCol = -1, dtCol = -1;
        for (let c = 0; c <= sheet.LastCol(); c++) {
            const sn = sheet.ColSaveName(c);
            if (sn === 'smplId') idCol = c;
            if (sn === 'smplNm') nmCol = c;
            if (sn === 'smplArrvDttm') dtCol = c;
        }
        // 모든 행에서 타겟 샘플명 매칭 검색
        for (let r = sheet.HeaderRows(); r < sheet.HeaderRows() + sheet.RowCount(); r++) {
            const name = (sheet.GetCellValue(r, nmCol) || '').toString().trim();
            if (name === targetName) {
                const sid = (sheet.GetCellValue(r, idCol) || '').toString().trim();
                const date = (sheet.GetCellValue(r, dtCol) || '').toString();
                const sqc = sqcDataMap[sid];
                let fDate = date.includes(' ') ? date.split(' ')[0] : (date.length === 8 ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}` : date);
                candidates.push({ rowIdx: r, sid, date: fDate, sqcDate: sqc?.date, sqcRes: sqc?.result, sheet, doc });
            }
        }

        if (candidates.length > 0) {
            // SQC 날짜 우선, 없으면 접수일 기준으로 최신순 정렬
            candidates.sort((a, b) => (b.sqcDate || b.date).localeCompare(a.sqcDate || a.date));
            renderNav(doc, candidates, targetName);
            candidates.forEach((c, i) => {
                let bgColor = '#f8f9fa';
                if (i === 0) bgColor = PALETTE.PRIMARY_BG;
                else if (i === 1) bgColor = PALETTE.SECONDARY_BG;
                c.sheet.SetRowBackColor(c.rowIdx, bgColor);
            });
            candidates[0].sheet.SetTopRow(candidates[0].rowIdx);
            return true;
        }
        return false;
    }

    function renderEmptyAlert(doc, targetName) {
        const old = doc.getElementById('lims-nav-panel'); if (old) old.remove();
        const panel = doc.createElement('div');
        panel.id = 'lims-nav-panel';
        panel.style.cssText = `position:fixed; top:15px; left:80px; background:${PALETTE.SECONDARY_BG}; border:2px solid ${PALETTE.DANGER}; border-radius:12px; padding:16px; z-index:999999; width:240px; box-shadow:0 10px 30px rgba(0,0,0,0.2); font-family: sans-serif; text-align:center;`;
        panel.innerHTML = `
            <div style="font-size:24px; margin-bottom:10px;">⚠️</div>
            <div style="font-weight:bold; color:${PALETTE.DANGER}; font-size:15px; margin-bottom:8px;">매칭되는 샘플 없음</div>
            <div style="font-size:13px; color:${PALETTE.TEXT_MAIN}; margin-bottom:15px; word-break:break-all;">타겟: <strong>${targetName}</strong></div>
            <button id="cls-alert" style="width:100%; padding:8px; background:${PALETTE.DANGER}; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">확인</button>
        `;
        doc.body.appendChild(panel);
        doc.getElementById('cls-alert').onclick = () => panel.remove();
    }

    function renderNav(doc, candidates, targetName) {
        const old = doc.getElementById('lims-nav-panel'); if (old) old.remove();
        const panel = doc.createElement('div');
        panel.id = 'lims-nav-panel';
        panel.style.cssText = `position:fixed; top:15px; left:80px; background:white; border:1.5px solid ${PALETTE.PANEL_BORDER}; border-radius:12px; padding:12px; z-index:999999; width:240px; box-shadow:0 10px 30px rgba(0,0,0,0.15); font-family: 'Segoe UI', Roboto, sans-serif; display:flex; flex-direction:column;`;

        const header = doc.createElement('div');
        header.style.cssText = `font-weight:bold; border-bottom:1px solid #edf2f7; padding-bottom:8px; margin-bottom:12px; font-size:14px; text-align:center; color:${PALETTE.TEXT_MAIN}; cursor:move; user-select:none; padding-top:2px;`;
        header.innerHTML = `타겟: ${targetName} (${candidates.length}건)`;
        panel.appendChild(header);

        let isDragging = false, sx, sy;
        header.onmousedown = (e) => { isDragging = true; sx = e.clientX - panel.offsetLeft; sy = e.clientY - panel.offsetTop; header.style.color = PALETTE.PRIMARY; doc.addEventListener('mousemove', omm); doc.addEventListener('mouseup', omu); };
        const omm = (e) => { if (isDragging) { panel.style.left = (e.clientX - sx) + 'px'; panel.style.top = (e.clientY - sy) + 'px'; } };
        const omu = () => { isDragging = false; header.style.color = PALETTE.TEXT_MAIN; doc.removeEventListener('mousemove', omm); doc.removeEventListener('mouseup', omu); };

        candidates.forEach((c, i) => {
            const btn = doc.createElement('button');
            const hasSqc = !!c.sqcDate;
            const dateStr = hasSqc ?
                `<span style="color:${PALETTE.DANGER}; font-weight:bold; font-size:13px;">${c.sqcDate}</span> <span style="color:${c.sqcRes.includes('Pass') ? PALETTE.SUCCESS : PALETTE.TEXT_SUB}; font-size:11px;">[${c.sqcRes}]</span>` :
                `<span style="color:${PALETTE.TEXT_MAIN}; font-size:13px;">${c.date}</span> <span style="color:${PALETTE.TEXT_SUB}; font-size:11px;">(접수일)</span>`;

            btn.innerHTML = `<div style="margin-bottom:3px;"><strong>${i + 1}.</strong> ${dateStr}</div><div style="font-size:11px; color:${PALETTE.TEXT_SUB}; display:flex; justify-content:space-between;"><span>ID: ${c.sid}</span></div>`;

            let bgColor = 'white', borderColor = '#edf2f7';
            if (i === 0) { bgColor = PALETTE.PRIMARY_BG; borderColor = PALETTE.PRIMARY; }
            else if (i === 1) { bgColor = PALETTE.SECONDARY_BG; borderColor = PALETTE.SECONDARY; }

            btn.style.cssText = `width:100%; text-align:left; padding:10px; margin-bottom:8px; border:1.5px solid ${borderColor}; border-radius:8px; background:${bgColor}; cursor:pointer; transition:all 0.15s ease-in-out; display:block;`;
            btn.onmouseover = () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)'; };
            btn.onmouseout = () => { btn.style.transform = 'translateY(0)'; btn.style.boxShadow = 'none'; };
            btn.onclick = () => { c.sheet.SetTopRow(c.rowIdx - 2); c.sheet.SetCellValue(c.rowIdx, "ibCheck", 1); };
            panel.appendChild(btn);
        });

        const cls = doc.createElement('button'); cls.innerText = '패널 닫기';
        cls.style.cssText = `width:100%; padding:8px; font-size:11px; margin-top:5px; cursor:pointer; background:${PALETTE.PANEL_BORDER}; border:none; border-radius:6px; color:white; font-weight:bold;`;
        cls.onclick = () => panel.remove();
        panel.appendChild(cls);
        doc.body.appendChild(panel);
    }

    function updateStatus(msg) {
        let div = document.getElementById('tm-status');
        if (!div) {
            div = document.createElement('div'); div.id = 'tm-status';
            div.style.cssText = `position:fixed; bottom:20px; right:20px; padding:8px 16px; border-radius:25px; z-index:999999; font-weight:bold; color:white; background:${PALETTE.STATUS_BG}; box-shadow:0 4px 15px rgba(0,0,0,0.25); font-family:sans-serif; border:1px solid ${PALETTE.PRIMARY}; display:flex; align-items:center; gap:6px;`;
            document.body.appendChild(div);
        }
        const val = msg.replace('타겟: ', '');
        div.innerHTML = `<span style="color:${PALETTE.PRIMARY_BG}; font-size:11px;">🎯 TARGET :</span> <span style="font-size:13px;">${val}</span>`;
        div.style.transform = 'scale(1.15)';
        setTimeout(() => { div.style.transform = 'scale(1)'; }, 200);
    }

    // ========== 메인 페이지: 행 클릭 시 타겟 샘플 설정 ==========
    const pageType = detectPageType();
    if (pageType === 'MAIN') {
        const setupClickCapture = () => {
            const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            const sheet = win.reqInfoSheet;

            if (!sheet) {
                setTimeout(setupClickCapture, 1000);
                return;
            }

            const sheetDiv = document.querySelector('[id*="reqInfoSheet"]');
            if (!sheetDiv) {
                setTimeout(setupClickCapture, 500);
                return;
            }

            // 클릭 이벤트 캡처 (LIMS 핸들러보다 먼저 실행)
            sheetDiv.addEventListener('click', function (e) {
                const cell = e.target.closest('td');
                if (!cell) return;

                const row = cell.closest('tr');
                if (!row) return;

                const rowIndex = Array.from(row.parentElement.children).indexOf(row);
                const headerRows = sheet.HeaderRows();
                if (rowIndex < headerRows) return;

                // 클릭한 행의 샘플명 추출 (ordSmplNm 컬럼)
                const target = (sheet.GetCellValue(rowIndex, 'ordSmplNm') || '').toString().trim();

                if (target) {
                    // 타겟 저장 및 우측 하단 표시
                    storage.set('targetSampleName', target);
                    updateStatus(`타겟: ${target}`);
                }
                // 빈 셀 클릭 시 기존 타겟 유지 (행 추가 시나리오)
            }, true);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupClickCapture);
        } else {
            setTimeout(setupClickCapture, 1000);
        }
    } else {
        // ========== 팝업 페이지: 타겟 샘플 자동 매칭 ==========
        const initPopup = async () => {
            const tn = storage.get('targetSampleName');
            const params = new URLSearchParams(location.search);
            let ord = params.get('ordNo');

            const findOrd = () => {
                const input = document.querySelector('input[name="searchBase"]') || document.querySelector('#searchBase');
                return input?.value?.startsWith('HN') ? input.value : null;
            };

            if (!ord) ord = findOrd();

            if (ord) fetchSqcDates(ord);
            else setTimeout(() => { const retry = findOrd(); if (retry) fetchSqcDates(retry); }, 800);

            const trackSearch = () => {
                const btn = Array.from(document.querySelectorAll('button, a, span'))
                    .find(b => b.innerText?.trim() === '조회' || b.innerText?.toUpperCase().includes('SEARCH'));

                if (btn && !btn._tracked) {
                    btn.addEventListener('click', () => {
                        clearCurrentMatchState(document);

                        const input = document.querySelector('input[name="searchBase"]') || document.querySelector('#searchBase');
                        if (input?.value) fetchSqcDates(input.value);
                        if (tn) setTimeout(() => startPopupScanning(tn), 100);
                    });
                    btn._tracked = true;
                    setTimeout(() => btn.click(), 400);
                } else {
                    setTimeout(trackSearch, 400);
                }
            };

            trackSearch();
            if (tn) startPopupScanning(tn);
        };

        if (document.readyState === 'complete') initPopup();
        else window.addEventListener('load', initPopup);
    }

})();
