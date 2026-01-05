// ==UserScript==
// @name         LIMS Save Index 중복 확인
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  수주별 통합 실시간 중복 체크 ( v1.1.1: 조회 기간 2개월 연장 반영 )
// @author       김재형
// @match        *://lims3.macrogen.com/ngs/com/retrieveIndexPopup.do*
// @match        *://lims3qas.macrogen.com/ngs/com/retrieveIndexPopup.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561442/LIMS%20Save%20Index%20%EC%A4%91%EB%B3%B5%20%ED%99%95%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/561442/LIMS%20Save%20Index%20%EC%A4%91%EB%B3%B5%20%ED%99%95%EC%9D%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const VERSION = "1.1.1";
    const IS_POPUP_PAGE = window.location.href.includes('retrieveIndexPopup.do');
    const LOG_PREFIX = `%c[IndexChecker]`;
    const LOG_STYLE = 'color: #4834d4; font-weight: bold;';

    // === 날짜 유틸리티 ===
    const getDateRange = () => {
        const today = new Date();
        const twoMonthsAgo = new Date(today);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        const fmt = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
        const fmtText = (d) => d.toISOString().slice(0, 10);
        return { begin: fmt(twoMonthsAgo), beginText: fmtText(twoMonthsAgo), end: fmt(today), endText: fmtText(today) };
    };

    // === API 규격 ===
    const API_CONFIG = {
        LIST_API: {
            url: '/ngs/library/retrieveWorksheetLists.do',
            buildPayload: (ordNo) => {
                const range = getDateRange();
                return {
                    dataSet: {
                        "undefined": {},
                        frmWorksheetList: [
                            { name: "searchBeginDe_text", value: range.beginText },
                            { name: "searchBeginDe", value: range.begin },
                            { name: "searchEndDe_text", value: range.endText },
                            { name: "searchEndDe", value: range.end },
                            { name: "searchBasiSrchCd1", value: "01" },
                            { name: "searchKeyword1", value: ordNo },
                            { name: "menuCd", value: "NGS120150" }
                        ]
                    }
                };
            }
        },
        DATA_API: {
            url: '/ngs/library/retrieveWorksheetDetails.do',
            buildPayload: (worksheetId, worksheetName) => {
                return {
                    dataSet: {
                        "undefined": {},
                        frmWorksheetDetail: [
                            { name: "worksheetId", value: worksheetId },
                            { name: "worksheetName", value: worksheetName || "" },
                            { name: "menuCd", value: "NGS120A01" }
                        ]
                    }
                };
            }
        }
    };

    // === 유틸리티 ===
    const normalize = (val) => String(val || '').trim().toUpperCase();
    const normalizeIndex = (val) => normalize(val).replace(/-/g, '');
    const safeGetCell = (grid, row, col) => {
        try { return grid.GetCellValue(row, col); } catch (e) { return ''; }
    };
    const firstFilled = (values) => {
        for (const val of values) {
            if (val && String(val).trim() !== '') return val;
        }
        return '';
    };
    const getInputValue = (selectors) => {
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.value) return el.value;
        }
        return '';
    };

    const getWorksheetId = (grid, headRow) => {
        const urlParams = new URLSearchParams(window.location.search);
        let id = firstFilled([urlParams.get('worksheetId'), urlParams.get('libWshId'), urlParams.get('libWshNo')]);
        if (id) return id.toUpperCase();
        id = firstFilled([getInputValue(['input[name="worksheetId"]', '#worksheetId']), getInputValue(['input[name="libWshId"]', '#libWshId'])]);
        if (id) return id.toUpperCase();
        if (grid && typeof grid.RowCount === 'function') {
            for (let i = headRow; i < headRow + grid.RowCount(); i++) {
                id = firstFilled([safeGetCell(grid, i, 'libWshId'), safeGetCell(grid, i, 'worksheetId')]);
                if (id) return id.toUpperCase();
            }
        }
        return '';
    };

    const autoDetectWorksheetId = (detailsById, currentSamples) => {
        const currentIndexSet = new Set(currentSamples.map(s => s.idxComp));
        let bestId = '', bestScore = 0;
        Object.entries(detailsById).forEach(([id, details]) => {
            let score = 0;
            details.forEach(item => {
                const idx = normalizeIndex(item.idxCd || item.idxNo || '');
                if (idx && currentIndexSet.has(idx)) score++;
            });
            if (score > bestScore) { bestScore = score; bestId = id; }
        });
        return bestScore > 0 ? bestId : '';
    };

    // === 배너 & CSS (OLD 디자인 참고) ===
    let banner;
    if (IS_POPUP_PAGE) {
        banner = document.createElement('div');
        banner.id = 'idx-checker-banner';
        banner.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; z-index: 999999;
            background: #fff3e0; color: #e65100; padding: 12px; font-weight: bold;
            border-bottom: 2px solid #ffb74d; text-align: left; font-size: 13px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: pre-wrap;
            display: flex; justify-content: space-between; align-items: center;
            transition: all 0.3s ease; box-sizing: border-box;
        `;
        banner.innerHTML = `<div>⏳ DB 데이터를 불러오는 중입니다...</div>` +
            `<button id="idx-run-full" style="background:#4834d4; color:white; border:none; padding:6px 14px; border-radius:4px; cursor:pointer; font-weight:bold;">검사 시작</button>`;
        document.body.appendChild(banner);

        const style = document.createElement('style');
        style.innerHTML = `
            body { padding-top: 55px !important; margin: 0 !important; }
            .pop_cont { padding-bottom: 65px !important; }
            .btn_box { 
                position: fixed !important; bottom: 0 !important; left: 0 !important; 
                width: 100% !important; background: white !important; z-index: 999998 !important; 
                border-top: 1px solid #ddd !important; padding: 12px 0 !important;
                margin: 0 !important; text-align: center !important;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
            }
            #divIbsIndex, #DIV_ibsIndex, #divIbsSmpl, #DIV_ibsSmpl, #divIbsWorksheet, #DIV_ibsWorksheet, #divIbsLib, #DIV_ibsLib { 
                height: calc(100vh - 190px) !important; 
                min-height: 200px !important;
            }
        `;
        document.head.appendChild(style);
    }

    let bannerLock = false;
    const updateBanner = (msg, status = 'loading') => {
        if (!IS_POPUP_PAGE || !banner) return;
        if (bannerLock && status === 'loading') return;

        const colors = {
            loading: { bg: '#fff3e0', text: '#e65100', border: '#ffb74d' },
            ready: { bg: '#2196f3', text: '#ffffff', border: '#1976d2' },
            success: { bg: '#4caf50', text: '#ffffff', border: '#388e3c' },
            error: { bg: '#f44336', text: '#ffffff', border: '#d32f2f' }
        };

        const theme = colors[status] || colors.loading;
        banner.style.background = theme.bg;
        banner.style.color = theme.text;
        banner.style.borderBottomColor = theme.border;

        const defaultMsg = status === 'ready' ? '동일 수주 INDEX 중복 확인 준비 완료' : '동일 수주 INDEX 중복 확인';
        banner.firstChild.innerHTML = msg || defaultMsg;

        if (status === 'success' || status === 'error') {
            bannerLock = true;
            setTimeout(() => { bannerLock = false; }, 8000);
        }
    };

    // === AJAX ===
    const ajaxPost = async (url, payload) => {
        return new Promise((resolve, reject) => {
            if (window.jQuery && window.jQuery.ajax) {
                window.jQuery.ajax({
                    url, type: 'POST', contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify(payload), dataType: 'json', global: false,
                    success: resolve, error: (xhr, status, error) => reject(new Error(`${status}: ${error}`))
                });
            } else {
                fetch(url, {
                    method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                    body: JSON.stringify(payload)
                }).then(res => res.json()).then(resolve).catch(reject);
            }
        });
    };

    // === 핵심 검사 로직 ===
    const detailCache = new Map();

    async function runFullCheck(manual = false) {
        if (!IS_POPUP_PAGE) return [];
        const grid = window.ibsIndex || window.ibsSheet;
        if (!grid) return [];

        const headRow = grid.HeaderRows();
        if (manual) {
            for (let i = headRow; i < headRow + grid.RowCount(); i++) grid.SetRowBackColor(i, '');
        }

        const samplesByOrd = {};
        for (let i = headRow; i < headRow + grid.RowCount(); i++) {
            if (grid.GetRowStatus(i) === 'D') continue;
            const idxVal = safeGetCell(grid, i, 'idxCd') || safeGetCell(grid, i, 'idxNo');
            const normOrdNo = normalize(firstFilled([safeGetCell(grid, i, 'ordNo'), safeGetCell(grid, i, 'smplReslOrdNo'), safeGetCell(grid, i, 'orderNo')]));
            if (idxVal && normOrdNo.startsWith('HN')) {
                if (!samplesByOrd[normOrdNo]) samplesByOrd[normOrdNo] = [];
                samplesByOrd[normOrdNo].push({ row: i, idxComp: normalizeIndex(idxVal), rawIdx: idxVal });
            }
        }

        const ordNos = Object.keys(samplesByOrd);
        if (ordNos.length === 0) {
            if (manual) updateBanner('수주번호를 찾을 수 없습니다.', 'error');
            return [];
        }

        if (manual) updateBanner('중복 대조 중...', 'loading');
        let totalConflicts = 0;
        let conflictDetails = [];
        const curWkstId = normalize(getWorksheetId(grid, headRow));

        try {
            for (const ordNo of ordNos) {
                const currentSamples = samplesByOrd[ordNo];
                const listRes = await ajaxPost(API_CONFIG.LIST_API.url, API_CONFIG.LIST_API.buildPayload(ordNo));
                const worksheets = (listRes.worksheetLists || []).map(ws => ({ id: ws.libWshId, idNorm: normalize(ws.libWshId), name: ws.libWshNm })).filter(ws => ws.idNorm);

                const detailsById = {};
                for (const target of worksheets) {
                    if (detailCache.has(target.idNorm)) { detailsById[target.idNorm] = detailCache.get(target.idNorm); continue; }
                    try {
                        const dataRes = await ajaxPost(API_CONFIG.DATA_API.url, API_CONFIG.DATA_API.buildPayload(target.id, target.name));
                        const details = dataRes.worksheetDetails || [];
                        detailsById[target.idNorm] = details;
                        detailCache.set(target.idNorm, details);
                    } catch (e) { detailsById[target.idNorm] = []; }
                }

                let currentWorksheetId = curWkstId;
                if (!currentWorksheetId) currentWorksheetId = autoDetectWorksheetId(detailsById, currentSamples);

                const targetWorksheets = worksheets.filter(ws => !currentWorksheetId || ws.idNorm !== currentWorksheetId);
                for (const target of targetWorksheets) {
                    (detailsById[target.idNorm] || []).forEach(item => {
                        const extIdxComp = normalizeIndex(item.idxCd || item.idxNo || '');
                        if (!extIdxComp) return;
                        currentSamples.forEach(curr => {
                            if (curr.idxComp === extIdxComp) {
                                if (manual) grid.SetRowBackColor(curr.row, '#fff9c4');
                                totalConflicts++;
                                conflictDetails.push(`[${curr.row}행] ${curr.rawIdx} (중복: ${target.idNorm})`);
                            }
                        });
                    });
                }
            }

            if (manual) {
                if (totalConflicts > 0) updateBanner(`INDEX 중복 감지 (${totalConflicts}건)\n` + conflictDetails.join('\n'), 'error');
                else updateBanner(`중복 없음 (동일 수주 내 타 워크시트 대조 완료)`, 'success');
            } else if (banner.getAttribute('data-ready') !== 'true') {
                updateBanner('동일 수주 INDEX 중복 확인 준비 완료', 'ready');
                banner.setAttribute('data-ready', 'true');
            }
        } catch (e) {
            console.error(LOG_PREFIX, e);
            if (manual) updateBanner('검사 실패: ' + e.message, 'error');
        }
        return conflictDetails;
    }

    // === 초기화 & 이벤트 ===
    if (IS_POPUP_PAGE) {
        document.getElementById('idx-run-full').onclick = () => runFullCheck(true);

        const oldDoAction = window.doAction;
        if (oldDoAction) {
            window.doAction = async function (act) {
                if (act === 'save') {
                    const errors = await runFullCheck(true);
                    if (errors.length > 0) {
                        alert("⚠️ 중복된 인덱스가 존재합니다!\n상단 배너에서 원인 워크시트를 확인해 주세요.");
                        return;
                    }
                }
                return oldDoAction.apply(this, arguments);
            };
        }

        const initAnalysis = setInterval(() => {
            const grid = window.ibsIndex || window.ibsSheet;
            if (grid && typeof grid.GetCellValue === 'function') {
                clearInterval(initAnalysis);
                runFullCheck(false); // 즉시 예열 분석
                setInterval(() => runFullCheck(false), 3000); // 이후 3초 주기
            }
        }, 1000);

        console.log(LOG_PREFIX, "초기화 완료 (그리드 감지 대기 중)");
    }
})();
