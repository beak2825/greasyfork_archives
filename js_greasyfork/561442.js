// ==UserScript==
// @name         LIMS Save Index 중복 확인
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  LIMS Index 중복 체크 (DB 데이터 사전 태핑 & 수동 검사 모드)
// @author       Antigravity
// @match        *://lims3.macrogen.com/ngs/com/retrieveIndexPopup.do*
// @match        *://lims3qas.macrogen.com/ngs/com/retrieveIndexPopup.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561442/LIMS%20Save%20Index%20%EC%A4%91%EB%B3%B5%20%ED%99%95%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/561442/LIMS%20Save%20Index%20%EC%A4%91%EB%B3%B5%20%ED%99%95%EC%9D%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const VERSION = "1.0";
    const LOG_PREFIX = `%c[IndexChecker v${VERSION}]`;
    const STYLE_MAIN = 'color: #4834d4; font-weight: bold; font-size: 1.1em;';
    const STYLE_SUCCESS = 'color: #27ae60; font-weight: bold;';

    console.log(LOG_PREFIX + ' Script Loaded (Manual Mode)!', STYLE_MAIN);

    const CONFIG = {
        gridIds: ['ibsIndex', 'ibsSmpl', 'ibsWorksheet', 'ibsLib'],
        apiUrl: '/ngs/order/retrieveOrdLibInfo.do',
        colNames: {
            ordNo: ['ordNo', 'searchOrdNo', 'ORDER #', '수주번호'],
            libId: ['libId', 'lib_id', 'LIB ID', '라이브러리ID'],
            idxCd: ['idxCd', 'indexCd', 'INDEX', '인코딩'],
            idx7: ['idxSeq7', 'idx_seq7', 'INDEX 7'],
            idx5: ['idxSeq5', 'idx_seq5', 'INDEX 5']
        }
    };

    let externalCache = new Map();
    let isChecking = false;
    let globalCheckFunc = null;

    // 배너 생성 (최상단 고정)
    const banner = document.createElement('div');
    banner.id = 'idx-checker-fixed-banner';
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; z-index: 999999;
        background: #fff3e0; color: #e65100; padding: 12px; font-weight: bold;
        border-bottom: 2px solid #ffb74d; text-align: left; font-size: 13px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: pre-wrap;
        display: flex; justify-content: space-between; align-items: center;
        transition: all 0.3s ease; box-sizing: border-box;
    `;
    banner.innerHTML = `<div>⏳ DB 데이터를 불러오는 중입니다...</div><button id="idx-rescan-btn" style="background:#4834d4; color:white; border:none; padding:6px 14px; border-radius:4px; cursor:pointer; font-weight:bold;">중복 검사 시작</button>`;
    document.body.appendChild(banner);

    // CSS 주입: 레이아웃 및 버튼 고정 (제공된 HTML 구조 반영)
    const style = document.createElement('style');
    style.innerHTML = `
        /* 전체 레이아웃 조정 */
        body { padding-top: 55px !important; margin: 0 !important; }
        .pop_cont { padding-bottom: 65px !important; }
        
        /* 배너 스타일 보정 */
        #idx-checker-fixed-banner { box-sizing: border-box; }

        /* 하단 버튼 박스 고정 */
        .btn_box { 
            position: fixed !important; bottom: 0 !important; left: 0 !important; 
            width: 100% !important; background: white !important; z-index: 999998 !important; 
            border-top: 1px solid #ddd !important; padding: 12px 0 !important;
            margin: 0 !important; text-align: center !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
        }
        
        /* 그리드 높이 강제 조절: 화면 크기에 맞춰 축소 */
        #divIbsIndex, #DIV_ibsIndex, 
        #divIbsSmpl, #DIV_ibsSmpl,
        #divIbsWorksheet, #DIV_ibsWorksheet,
        #divIbsLib, #DIV_ibsLib { 
            height: calc(100vh - 190px) !important; 
            min-height: 200px !important;
        }
    `;
    document.head.appendChild(style);

    // 창 크기 자동 확장 (가시 영역 확보)
    const stretchWindow = () => {
        if (window.innerHeight > 0 && !window.data_resized) {
            window.resizeBy(0, 100); // 100px 더 확장
            window.data_resized = true;
        }
    };
    setTimeout(stretchWindow, 500);

    document.getElementById('idx-rescan-btn').onclick = () => { if (globalCheckFunc) globalCheckFunc(true); };

    const normalize = (val) => String(val || '').replace(/[\s-]/g, '').toUpperCase();

    const checkInterval = setInterval(() => {
        for (const id of CONFIG.gridIds) {
            if (window[id] && typeof window[id].GetCellValue === 'function') {
                clearInterval(checkInterval);
                init(id);
                break;
            }
        }
    }, 1000);

    function init(gridId) {
        const sheet = window[gridId];
        console.log(LOG_PREFIX + ` Ready for grid: ${gridId}`, STYLE_MAIN);

        // 그리드 자동 리사이즈 지원
        const resizeInterval = setInterval(() => {
            if (sheet && sheet.FitSize) {
                sheet.FitSize();
                clearInterval(resizeInterval);
            }
        }, 1000);

        function deepCollect(obj, list) {
            if (!obj || typeof obj !== 'object') return;
            if (obj.libId && (obj.idxCd || obj.idxSeq7)) {
                if (!list.some(s => s.libId === obj.libId)) {
                    list.push({
                        libId: String(obj.libId).trim(),
                        idxCd: String(obj.idxCd || '').trim(),
                        normIdx: normalize(obj.idxCd),
                        seqKey: `${normalize(obj.idxSeq7)}|${normalize(obj.idxSeq5)}`
                    });
                }
            }
            for (let k in obj) { if (obj.hasOwnProperty(k)) deepCollect(obj[k], list); }
        }

        function fetchDb(ordNo) {
            if (externalCache.has(ordNo)) return;
            externalCache.set(ordNo, { status: 'loading', data: [] });
            const payload = { dataSet: JSON.stringify({ "undefined": {}, "ordNo": ordNo, "actionGubun": "ordRegist" }) };

            if (window.jQuery) {
                window.jQuery.ajax({
                    url: CONFIG.apiUrl,
                    type: 'POST',
                    data: payload,
                    dataType: 'json',
                    global: false, // LIMS 전역 로딩 스피너 방지
                    success: (res) => {
                        const entry = externalCache.get(ordNo);
                        if (!entry) return;
                        deepCollect(res, entry.data);
                        entry.status = 'done';
                        if (entry.data.length > 0) {
                            console.log(LOG_PREFIX + ` [DB 예열 완료] ${ordNo}: ${entry.data.length}개 로드`, STYLE_SUCCESS);
                        }
                    }
                });
            }
        }

        function check(isManual = false) {
            if (isChecking) return [];
            isChecking = true;
            let errors = [];
            try {
                const rowCount = sheet.RowCount(), hr = sheet.HeaderRows();
                const findCol = (nms) => { for (let n of nms) { let i = sheet.SaveNameCol(n); if (i !== -1) return i; } return -1; };
                const col = {
                    ordNo: findCol(CONFIG.colNames.ordNo), libId: findCol(CONFIG.colNames.libId),
                    idxCd: findCol(CONFIG.colNames.idxCd), idx7: findCol(CONFIG.colNames.idx7), idx5: findCol(CONFIG.colNames.idx5)
                };

                if (col.ordNo === -1 || col.idxCd === -1) return [];

                const localRows = [];
                let lastOrdNo = "";
                let readyDbCount = 0;

                for (let i = hr; i < rowCount + hr; i++) {
                    if (sheet.GetRowStatus(i) === 'D') continue;
                    let curOrd = String(sheet.GetCellValue(i, col.ordNo) || lastOrdNo).trim();
                    lastOrdNo = curOrd;
                    if (!curOrd) continue;

                    if (!externalCache.has(curOrd)) fetchDb(curOrd);
                    const cache = externalCache.get(curOrd);
                    if (cache && cache.status === 'done') readyDbCount += cache.data.length;

                    localRows.push({
                        row: i, ordNo: curOrd,
                        libId: String(sheet.GetCellValue(i, col.libId)).trim(),
                        normIdx: normalize(sheet.GetCellValue(i, col.idxCd)),
                        rawIdx: String(sheet.GetCellValue(i, col.idxCd)).trim(),
                        seqKey: `${normalize(sheet.GetCellValue(i, col.idx7))}|${normalize(sheet.GetCellValue(i, col.idx5))}`
                    });
                }

                // 백그라운드 체크 시 DB 로딩 완료 여부 확인하여 배너 업데이트
                if (!isManual && banner.getAttribute('data-ready') !== 'true') {
                    const cacheEntries = Array.from(externalCache.values());
                    const allDone = cacheEntries.length > 0 && cacheEntries.every(e => e.status === 'done');
                    if (allDone) {
                        banner.firstChild.innerHTML = `🔍 INDEX 중복 검사 준비 완료 (입력 후 우측 버튼을 눌러주세요)`;
                        banner.style.background = '#2196f3'; // 선명한 블루
                        banner.style.color = '#ffffff';
                        banner.style.borderBottomColor = '#1976d2';
                        banner.setAttribute('data-ready', 'true');
                    }
                }

                // 중복 검사 로직 (isManual이거나 저장 시 실행)
                localRows.forEach(local => {
                    if (isManual) sheet.SetRowBackColor(local.row, '');
                    if (!local.normIdx && local.seqKey === '|') return;

                    const cache = externalCache.get(local.ordNo);
                    let conflicts = new Set();

                    if (cache && cache.status === 'done') {
                        cache.data.forEach(db => {
                            // 본인 LIB ID (DB에 이미 저장된 내 기록)는 중복에서 제외
                            if (local.libId && local.libId === db.libId) return;

                            const isIdxMatch = (local.normIdx && local.normIdx === db.normIdx);
                            const isSeqMatch = (local.seqKey !== '|' && local.seqKey === db.seqKey);
                            if (isIdxMatch || isSeqMatch) conflicts.add(`DB:${db.idxCd || db.libId}`);
                        });
                    }

                    localRows.forEach(other => {
                        if (local.row === other.row) return;
                        // 동일한 LIB ID가 그리드에 여러 개 있을 경우(수정 중 등) 제외
                        if (local.libId && local.libId === other.libId) return;

                        const isIdxMatch = (local.normIdx && local.normIdx === other.normIdx);
                        const isSeqMatch = (local.seqKey !== '|' && local.seqKey === other.seqKey);
                        if (isIdxMatch || isSeqMatch) conflicts.add(`${other.row}행`);
                    });

                    if (conflicts.size > 0) {
                        if (isManual) sheet.SetRowBackColor(local.row, '#ffeaa7');
                        errors.push(`[${local.row}행] ${local.rawIdx} -> ${Array.from(conflicts).join(', ')}`);
                    }
                });

                if (isManual) {
                    if (errors.length > 0) {
                        banner.style.background = '#f44336'; // 선명한 레드
                        banner.style.color = '#ffffff';
                        banner.style.borderBottomColor = '#d32f2f';
                        banner.firstChild.innerHTML = `⚠️ INDEX 중복 감지 (DB 대조 완료)\n` + errors.join('\n');
                    } else {
                        banner.style.background = '#4caf50'; // 선명한 그린
                        banner.style.color = '#ffffff';
                        banner.style.borderBottomColor = '#388e3c';
                        banner.firstChild.innerHTML = `✅ 중복 없음 (대조군: DB ${readyDbCount}개 및 그리드 전수 스캔 완료)`;
                    }
                }
            } catch (e) {
                console.error(LOG_PREFIX + ' Check Error:', e);
            } finally {
                isChecking = false;
            }
            return errors;
        }

        globalCheckFunc = check;

        // 저장 시 마지막 검사
        const oldDoAction = window.doAction;
        if (oldDoAction) {
            window.doAction = function (act) {
                if (act === 'save') {
                    const errorList = check(true);
                    if (errorList && errorList.length > 0) {
                        alert("중복된 인덱스가 존재하여 저장이 차단되었습니다.\n상단 배너의 원인을 확인해 주세요.");
                        return false;
                    }
                }
                return oldDoAction.apply(this, arguments);
            };
        }

        // 2초마다 DB 데이터만 조용히 싱크 (화면 표시는 안함)
        setInterval(() => check(false), 2000);
    }
})();
