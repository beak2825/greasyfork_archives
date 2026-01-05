// ==UserScript==
// @name         주문 상세 및 로그 관리(작업 현황, 수행특이사항) 모달
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  [v1.0.7] 연관 수주 조회 기능 강화 - 주문 상세 및 로그 페이지에서 연관 수주번호를 자동으로 탐색하고 모달 내에서 즉시 전환할 수 있는 기능을 제공합니다.
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/order/retrieveOrdSearchDetailForm.do*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559056/%EC%A3%BC%EB%AC%B8%20%EC%83%81%EC%84%B8%20%EB%B0%8F%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%28%EC%9E%91%EC%97%85%20%ED%98%84%ED%99%A9%2C%20%EC%88%98%ED%96%89%ED%8A%B9%EC%9D%B4%EC%82%AC%ED%95%AD%29%20%EB%AA%A8%EB%8B%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559056/%EC%A3%BC%EB%AC%B8%20%EC%83%81%EC%84%B8%20%EB%B0%8F%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%28%EC%9E%91%EC%97%85%20%ED%98%84%ED%99%A9%2C%20%EC%88%98%ED%96%89%ED%8A%B9%EC%9D%B4%EC%82%AC%ED%95%AD%29%20%EB%AA%A8%EB%8B%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        DEBUG: false, // [v1.0.6] Quiet Mode
        BUTTON_LABEL: 'Job Status',
        BUTTON_COLOR: '#5f27cd',
        API_URL: '/ngs/order/retrieveOrdWorkStatusList.do',
        WORK_STATUS_API_URL: '/ngs/order/retrieveOrdPrcsSmList.do',
        SPECIAL_NOTE_API_URL: '/ngs/com/retrievePrfmUnus.do',
        SPECIAL_NOTE_SAVE_URL: '/ngs/com/savePrfmUnus.do',
        SPECIAL_NOTE_DELETE_URL: '/ngs/com/deletePrfmUnus.do',
        MODAL_Z_INDEX: 10001
    };

    function log(msg, ...args) {
        if (CONFIG.DEBUG) {
            console.log(`[JobStatusModal] ${msg}`, ...args);
        }
    }

    // ===================================
    // 1. 초기화 (Initialization)
    // ===================================

    // [v1.0.7] 연관 수주번호 캐시 (로그 페이지 등 대응)
    const relatedOrdersCache = {};

    function init() {
        // LIMS가 동적으로 로드되므로 주기적으로 확인
        const checkInterval = setInterval(() => {
            const container = document.querySelector('.logbiz-btn-container');

            if (!container) {
                const headers = Array.from(document.querySelectorAll('h3'));
                const targetHeader = headers.find(h => {
                    const t = h.textContent.trim();
                    return t === 'Process' || t === 'Processing Dept.' || t.includes('Ord. Info Detail');
                });

                if (targetHeader) {
                    injectContainer(targetHeader);
                }
            } else if (!container.querySelector('.btn-job-status')) {
                injectButton(container);
            }
        }, 1500);
    }

    // [v1.0.7] 연관 수주 수집 로직 (안정성 복구 및 더미 필터 강화)
    async function getAvailableOrders(currentOrdNo) {
        const pageOrdNo = getOrderNo();
        const mainOrdNo = pageOrdNo || currentOrdNo;

        // 캐시 확인
        if (relatedOrdersCache[mainOrdNo]) return relatedOrdersCache[mainOrdNo];

        // 엄격한 수주번호 패턴 (단어 경계 확인)
        const hnPattern = /\bHN\d{8,10}\b/g;

        // 더미 번호 필터링 함수 (HN00000... 또는 HN000000...)
        const isValidHN = (no) => {
            if (!no) return false;
            if (no.startsWith('HN00000')) return false; // 더미 패턴 차단
            return true;
        };

        let resultOrders = [];

        // 1. 현재 페이지 전체 스캔 (안정성 최우선)
        const scanPage = (rootDoc) => {
            const matches = rootDoc.body.innerText.match(hnPattern) || [];
            return matches.filter(isValidHN);
        };

        resultOrders.push(...scanPage(document));

        // 2. 정보가 부족할 경우 배경 조회 (로그 페이지 등)
        if (resultOrders.length <= 1 && mainOrdNo && mainOrdNo.startsWith('HN')) {
            try {
                log('배경 조회 시작:', mainOrdNo);
                const url = `/ngs/order/retrieveOrdSearchDetailForm.do?menuCd=NGS250100&ordNo=${mainOrdNo}`;
                const res = await fetch(url);

                const buffer = await res.arrayBuffer();
                const view = new Uint8Array(buffer);
                let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
                const htmlText = decoder.decode(buffer);

                // 가져온 HTML 텍스트에서 번호 추출
                const bgMatches = htmlText.match(hnPattern) || [];
                resultOrders.push(...bgMatches.filter(isValidHN));
            } catch (e) { log('배경 조회 실패:', e); }
        }

        // 3. 중복 제거 및 현재 메인 주문번호를 맨 앞으로
        let unique = [...new Set(resultOrders)];
        if (mainOrdNo) {
            unique = unique.filter(no => no !== mainOrdNo);
            unique.unshift(mainOrdNo);
        }

        // 캐시 저장 및 반환
        if (unique.length > 1) {
            relatedOrdersCache[mainOrdNo] = unique;
        }
        return unique.length > 0 ? unique : [mainOrdNo];
    }

    function injectContainer(targetHeader) {
        targetHeader.style.display = 'inline-block';
        targetHeader.style.marginRight = '10px';
        const container = document.createElement('div');
        container.className = 'logbiz-btn-container';
        container.style.display = 'inline-block';
        container.style.verticalAlign = 'middle';
        targetHeader.parentNode.insertBefore(container, targetHeader.nextSibling);
    }

    function injectButton(container) {
        const btn = document.createElement('button');
        btn.type = 'button'; // 중요: 폼 제출 방지 (유효성 검사 팝업 차단)
        btn.className = 'btn-job-status';
        btn.textContent = CONFIG.BUTTON_LABEL;
        btn.style.cssText = `
            background-color: #efefff;
            color: #4834d4;
            border: 1px solid #4834d4;
            padding: 5px 10px;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        `;
        btn.onclick = (e) => {
            e.preventDefault(); // 폼 부작용 방지
            handleButtonClick();
        };
        container.appendChild(btn);

        const btnNote = document.createElement('button');
        btnNote.type = 'button';
        btnNote.className = 'btn-special-note';
        btnNote.textContent = 'Special Note';
        btnNote.style.cssText = `
            background-color: #fff7e6;
            color: #d35400;
            border: 1px solid #d35400;
            padding: 5px 10px;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        `;
        btnNote.onclick = (e) => {
            e.preventDefault();
            handleSpecialNoteClick();
        };
        container.appendChild(btnNote);

        const btnWork = document.createElement('button');
        btnWork.type = 'button';
        btnWork.className = 'btn-work-status';
        btnWork.textContent = 'Work Status';
        btnWork.style.cssText = `
            background-color: #e6fffa;
            color: #00947e;
            border: 1px solid #00947e;
            padding: 5px 10px;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        `;
        btnWork.onclick = (e) => {
            e.preventDefault();
            handleWorkStatusClick();
        };
        container.appendChild(btnWork);
    }

    // ===================================
    // 2. 상호작용 (Interaction)
    // ===================================

    // [v1.0.7] 범용적인 호출을 위해 인자를 받도록 리팩토링
    async function openJobStatusModal(ordNo) {
        if (!ordNo) {
            alert('주문번호(Ord No)를 찾을 수 없습니다.');
            return;
        }

        log('Job Status 모달 호출:', ordNo);
        showModal(`Job Status - ${ordNo}`, ordNo);
        updateModalBody(`
            <div style="text-align: center; padding: 40px;">
                <div class="job-spinner"></div>
                <p style="margin-top: 10px; color: #666;">데이터 조회 중... (Direct API v1.4)</p>
            </div>
        `);

        try {
            const data = await fetchJobStatusApi(ordNo);
            renderJobStatus(data);
        } catch (e) {
            console.error(e);
            updateModalBody(`
                <div style="padding: 20px; color: #c0392b; text-align: center;">
                    <h3>API 오류 발생</h3>
                    <p>${e.message}</p>
                    <p>자세한 내용은 콘솔(F12)을 확인하세요.</p>
                </div>
            `);
        }
    }

    async function handleButtonClick() {
        const ordNo = getOrderNo();
        openJobStatusModal(ordNo);
    }

    async function openSpecialNoteModal(ordNo) {
        if (!ordNo) {
            alert('주문번호(Ord No)를 찾을 수 없습니다.');
            return;
        }

        log('Special Note 모달 호출:', ordNo);
        showModal(`Special Note - ${ordNo}`, ordNo);
        updateModalBody(`
            <div style="text-align: center; padding: 40px;">
                <div class="job-spinner"></div>
                <p style="margin-top: 10px; color: #666;">데이터 조회 중... (Codes & Notes)</p>
            </div>
        `);

        try {
            if (!cachedUnusCodes) {
                cachedUnusCodes = await fetchComboCodes('PRFM_UNUS_DIV_CD');
            }
            const data = await fetchSpecialNoteApi(ordNo);
            renderSpecialNote(data, ordNo, cachedUnusCodes);
        } catch (e) {
            console.error(e);
            updateModalBody(`
                <div style="padding: 20px; color: #c0392b; text-align: center;">
                    <h3>API 오류 발생</h3>
                    <p>${e.message}</p>
                    <p>Endpoint 확인 필요: ${CONFIG.SPECIAL_NOTE_API_URL}</p>
                </div>
            `);
        }
    }

    async function handleSpecialNoteClick() {
        const ordNo = getOrderNo();
        openSpecialNoteModal(ordNo);
    }

    async function openWorkStatusModal(ordNo) {
        if (!ordNo) {
            alert('주문번호(Ord No)를 찾을 수 없습니다.');
            return;
        }

        log('Work Status 모달 호출:', ordNo);
        showModal(`Work Status - ${ordNo}`, ordNo);
        updateModalBody(`
            <div style="text-align: center; padding: 40px;">
                <div class="job-spinner"></div>
                <p style="margin-top: 10px; color: #666;">데이터 조회 중... (Process Summary)</p>
            </div>
        `);

        try {
            const data = await fetchWorkStatusApi(ordNo);
            renderWorkStatus(data);
        } catch (e) {
            console.error(e);
            updateModalBody(`
                <div style="padding: 20px; color: #c0392b; text-align: center;">
                    <h3>API 오류 발생</h3>
                    <p>${e.message}</p>
                    <p>Endpoint: ${CONFIG.WORK_STATUS_API_URL}</p>
                </div>
            `);
        }
    }

    async function handleWorkStatusClick() {
        const ordNo = getOrderNo();
        openWorkStatusModal(ordNo);
    }

    function getOrderNo() {
        const hiddenInput = document.querySelector('input[name="ordNo"]');
        if (hiddenInput && hiddenInput.value.trim() !== '') return hiddenInput.value.trim();

        if (typeof window.ibsLogBizReqOrd !== 'undefined') {
            try {
                if (window.ibsLogBizReqOrd.RowCount() > 0) {
                    const val = window.ibsLogBizReqOrd.GetCellValue(1, "ordNo");
                    if (val && val.trim() !== '') return val.trim();
                }
            } catch (e) { }
        }

        if (typeof window.ibsLogBizReqAdd !== 'undefined') {
            try {
                if (window.ibsLogBizReqAdd.RowCount() > 0) {
                    const val = window.ibsLogBizReqAdd.GetCellValue(1, "ordNo");
                    if (val && val.trim() !== '') return val.trim();
                }
            } catch (e) { }
        }

        const params = new URLSearchParams(window.location.search);
        if (params.has('ordNo')) return params.get('ordNo');

        const tds = Array.from(document.querySelectorAll('td'));
        const orderNoPattern = /^[A-Z]{2}\d{8}$/;
        for (const td of tds) {
            const text = td.textContent.trim();
            if (orderNoPattern.test(text)) return text;
        }

        return null;
    }

    async function fetchJobStatusApi(ordNo) {
        // 캡처된 페이로드 구조 일치: {"dataSet":{"undefined":{},"cmpnyCd":"1000","ordNo":"..."}}
        const payload = {
            dataSet: {
                undefined: {},
                cmpnyCd: "1000",
                ordNo: ordNo
            }
        };

        log(`JSON 전송 대상: ${CONFIG.API_URL}`, payload);
        const res = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        // 인코딩 문제 해결:
        // 서버가 종종 UTF-16LE(문자 사이 null 바이트 포함 JSON)를 반환하지만 브라우저는 UTF-8로 처리하므로 수동 디코딩 필요.
        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);

        // 간단한 히리스틱: 두 번째 바이트가 0이면 UTF-16LE일 가능성이 높음 (예: '{'는 0x7B 0x00)
        // UTF-8이라면 두 번째 바이트는 '"'(0x22) 등이 옴.
        let decoder;
        if (view.length > 1 && view[1] === 0) {
            decoder = new TextDecoder('utf-16le');
            log('UTF-16LE 인코딩 감지됨');
        } else {
            // UTF-8 기본값. 만약 한글용 LIMS3에서 실패하면 EUC-KR 고려 가능하나 보통 UTF-8/16LE임.
            decoder = new TextDecoder('utf-8');
        }

        const text = decoder.decode(buffer);

        try {
            const json = JSON.parse(text);
            log('API 응답:', json);
            return json;
        } catch (e) {
            // 비엄격 JSON에 대한 대체 처리
            try {
                const json = new Function(`return ${text}`)();
                log('API 응답 (eval 사용):', json);
                return json;
            } catch (evalErr) {
                console.error('응답 파싱 실패:', evalErr);
                throw new Error('응답이 유효한 JSON이 아닙니다.');
            }
        }
    }




    async function fetchWorkStatusApi(ordNo) {
        const payload = {
            dataSet: {
                undefined: {},
                cmpnyCd: "1000",
                ordNo: ordNo
            }
        };

        log(`Work Status 요청: ${CONFIG.WORK_STATUS_API_URL}`, payload);
        const res = await fetch(CONFIG.WORK_STATUS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);
        let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
        const text = decoder.decode(buffer);

        try {
            const json = JSON.parse(text);
            log('Work Status 응답:', json);
            return json;
        } catch (e) {
            return new Function(`return ${text}`)();
        }
    }

    function renderWorkStatus(data) {
        const list = data.result || [];

        // 데이터가 없는 경우
        if (!list || list.length === 0) {
            updateModalBody(`
                <div class="jsm-container">
                    <h4 class="jsm-section-title" style="color: #00947e;">Work Status (Process Summary)</h4>
                    <p style="padding: 20px; text-align: center; color: #666;">데이터가 없습니다.</p>
                </div>
            `);
            return;
        }

        let html = '<div class="jsm-container">';
        html += '<h4 class="jsm-section-title" style="color: #00947e;">Work Status (Process Summary)</h4>';
        html += '<div style="overflow-x: auto;">'; // 가로 스크롤 허용
        html += '<table class="jsm-table" style="white-space: nowrap;">';

        // 헤더 정의
        const columns = [
            { label: 'PROCESS STEP', key: 'workStempNm' },
            { label: 'JOB NO', key: 'workNo', isLink: true }, // 링크 스타일 적용 예정
            { label: 'USER NAME', key: 'rgsnUserNm' },
            { label: 'STARTED', key: 'workBeginDttm', isDate: true },
            { label: 'COMPLETE', key: 'workCmplDttm', isDate: true },
            { label: 'STATUS', key: 'workPrgrStatNm' },
            { label: 'REPORT', key: 'rptId', isLink: true },
            { label: '# SPL', key: 'smplCnt' },
            { label: '# LIB', key: 'libCnt' },
            { label: 'PASS', key: 'passCnt' },
            { label: 'HOLD', key: 'holdCnt' },
            { label: 'FAIL', key: 'failCnt' },
            { label: 'PROGRESS...', key: 'rtprgs' }, // 키 확인 필요 (rtprgs 추정)
            { label: 'DATE SENT', key: 'sndngDttm' }
        ];

        // 헤더 렌더링
        html += '<thead><tr>';
        columns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';

        // 바디 렌더링
        list.forEach((row, index) => {
            html += '<tr>';
            columns.forEach(col => {
                let val = row[col.key] || '';

                // 날짜 포맷팅 (YYYY/MM/DD)
                if (col.isDate && val) {
                    val = val.split(' ')[0].replace(/-/g, '/');
                }

                // 링크 스타일 (파란색) & 클릭 이벤트
                if (col.isLink && val) {
                    // 데이터 속성으로 row 데이터 저장 (인덱스 사용)
                    const cellId = `jsm-link-${col.key}-${index}`;
                    html += `<td id="${cellId}" style="color: #3498db; font-weight: bold; cursor: pointer;">${val}</td>`;
                } else {
                    html += `<td>${val}</td>`;
                }
            });
            html += '</tr>';
        });

        html += '</tbody></table></div></div>';
        updateModalBody(html);

        // 이벤트 바인딩
        list.forEach((row, index) => {
            // Work No Link
            const workNoId = `jsm-link-workNo-${index}`;
            const workNoEl = document.getElementById(workNoId);
            if (workNoEl) {
                workNoEl.onclick = () => {
                    navigateToJobDetail(row.workNo, row.detailSeq, row.pltfomCd);
                };
            }

            // Report Link
            const rptIdId = `jsm-link-rptId-${index}`;
            const rptIdEl = document.getElementById(rptIdId);
            if (rptIdEl) {
                rptIdEl.onclick = () => {
                    if (row.atchmnflNo) {
                        downloadFile(row.atchmnflNo);
                    } else {
                        alert('첨부파일 번호가 없습니다.');
                    }
                };
            }
        });
    }

    async function downloadFile(atchmnflNo) {
        if (!atchmnflNo) return;
        log(`File Preview Request: ${atchmnflNo}`);

        // 1. 미리 새 창 열기 (팝업 차단 방지 및 로딩 표시)
        const newWin = window.open('', '_blank');
        if (!newWin) {
            alert('팝업 차단이 감지되었습니다. 팝업을 허용해주세요.');
            return;
        }

        newWin.document.write(`
            <html>
                <head><title>Loading Report...</title></head>
                <body style="display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:sans-serif;">
                    <div style="text-align:center;">
                        <h3>성적서(Report) 불러오는 중...</h3>
                        <p>잠시만 기다려주세요.</p>
                    </div>
                </body>
            </html>
        `);

        try {
            const params = new URLSearchParams();
            params.append('atchmnflNo', atchmnflNo);

            const res = await fetch('/com/comm/file/fileDown.do', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: params
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const blob = await res.blob();

            // 강제로 PDF 타입 지정하여 브라우저 내장 뷰어 실행 유도
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const objUrl = URL.createObjectURL(pdfBlob);

            // 새 창 주소를 Blob URL로 변경
            newWin.location.href = objUrl;

            // 메모리 정리 (충분한 시간 후 해제)
            setTimeout(() => URL.revokeObjectURL(objUrl), 60000);

        } catch (e) {
            console.error('Preview failed:', e);
            if (newWin) {
                newWin.document.body.innerHTML = `<div style="color:red; flex-direction:column; display:flex; align-items:center; justify-content:center; height:100%;"><h3>파일 로드 실패</h3><p>${e.message}</p></div>`;
            }
            alert('파일 미리보기 실패: ' + e.message);
        }
    }

    function navigateToJobDetail(workNo, detailSeq, pltfomCd) {
        log(`Navigate to Job Detail: workNo=${workNo}, detailSeq=${detailSeq}, pltfomCd=${pltfomCd}`);

        // 새 창 열기 전용 폼 생성 (기존 frmMenu와 분리하여 사이드 이펙트 방지)
        const formId = 'jsm-nav-form';
        let navForm = document.getElementById(formId);
        if (!navForm) {
            navForm = document.createElement('form');
            navForm.id = formId;
            navForm.style.display = 'none';
            document.body.appendChild(navForm);
        }

        // 폼 초기화
        navForm.innerHTML = '';
        navForm.method = 'get';
        navForm.target = '_blank'; // 새 창/탭에서 열기

        let url = "";
        let menuCd = "";
        let preset = "";

        // 헬퍼: 히든 필드 추가
        const addHidden = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            navForm.appendChild(input);
        };

        if (!workNo) return;

        // detailSeq에 따른 분기 로직 (procsSmSheet_OnClick 참조)
        // 1:Sample Prep, 2:Sample QC, 3:Library Prep, 4:Library QC, 5:Exome, 6:Amplification, 7:Inst, 8:Human ID, 9:Analysis
        if (detailSeq === "1") { // Sample Prep
            menuCd = "NGS110201";
            url = "/ngs/sample/retrievePrepWorkDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "2") { // Sample QC
            menuCd = "NGS110301";
            url = "/ngs/sample/retrieveQcWorkDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "3") { // Library 제작
            menuCd = "NGS120201";
            url = "/ngs/library/retrieveProductWorkDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "4") { // Library QC
            menuCd = "NGS120301";
            url = "/ngs/library/retrieveQcWorkDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "5") { // Exome Capture
            menuCd = "NGS120410";
            url = "/ngs/library/retrieveExomeWorkDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "6") { // Amplification
            // 플랫폼 코드 확인 필요
            let atrb2 = getPlatformAttribute(pltfomCd);

            if (atrb2 === 'ILL') {
                menuCd = "NGS150400";
                url = "/ngs/amplification/retrieveNgsAmplificationHiSeqWorkForm.do";
                preset = 'searchPlateCond:,searchBasiSrchCd:02,searchKeyword:' + workNo;
                addHidden('_preset', preset);
            } else if (atrb2 === 'MGI') {
                menuCd = "NGS150910";
                url = "/ngs/amplification/retrieveNgsAmplificationHiSeqWorkForm.do?searchMode=MGI";
                preset = 'searchPlateCond:,searchBasiSrchCd:02,searchKeyword:' + workNo;
                addHidden('_preset', preset);
            } else if (atrb2 === 'PAC' && ['S1', 'S2'].includes(pltfomCd)) {
                menuCd = "NGS150800";
                url = "/ngs/amplification/retrieveNgsAmplificationSequelTwoWorkForm.do";
                preset = 'searchPltfomCd:,searchPlateCond:,searchBasiSrchCd:02,searchKeyword:' + workNo;
                addHidden('_preset', preset);
            } else if (atrb2 === 'ONT') {
                menuCd = "NGS150800";
                url = "/ngs/amplification/retrieveNgsAmplificationSequelTwoWorkForm.do?searchMode=ONT";
                preset = 'searchPltfomCd:,searchPlateCond:,searchBasiSrchCd:02,searchKeyword:' + workNo;
                addHidden('_preset', preset);
            } else if (atrb2 === 'PAC') {
                menuCd = "NGS150600";
                url = "/ngs/amplification/retrieveNgsAmplificationPacbioWorkForm.do";
                preset = 'searchBeginDate_text:,searchBeginDate:,searchPltfomCd:,searchPlateCond:,searchBasiSrchCd:01,searchKeyword:' + workNo;
                addHidden('_preset', preset);
            } else {
                alert('플랫폼 정보가 확인되지 않거나 지원하지 않는 플랫폼입니다.');
                return;
            }

        } else if (detailSeq === "7") { // Instrument Plate
            let atrb2 = getPlatformAttribute(pltfomCd);

            if (atrb2 === 'ILL') {
                menuCd = "NGS160100";
                url = "/ngs/instrumentPlate/retrieveNgsInstrumentPlateHiSeqDtlForm.do";
                addHidden('insId', workNo);
            } else if (atrb2 === 'MGI') {
                menuCd = "NGS160A01";
                url = "/ngs/instrumentPlate/retrieveNgsInstrumentPlateHiSeqDtlForm.do?searchMode=MGI";
                addHidden('insId', workNo);
            } else if (atrb2 === 'PAC') {
                menuCd = "NGS160200";
                url = "/ngs/instrumentPlate/retrieveNgsInstrumentPlatePacbioDtlForm.do";
                addHidden('insId', workNo);
                addHidden('pltfomCd', pltfomCd);
                addHidden('pltfomType', pltfomCd);
            } else if (atrb2 === 'ONT') {
                menuCd = "NGS160200";
                url = "/ngs/instrumentPlate/retrieveNgsInstrumentPlatePacbioDtlForm.do?searchMode=ONT";
                addHidden('insId', workNo);
                addHidden('pltfomCd', pltfomCd);
                addHidden('pltfomType', pltfomCd);
            } else {
                alert('플랫폼 정보가 확인되지 않거나 지원하지 않는 플랫폼입니다.');
                return;
            }

        } else if (detailSeq === "8") { // Human ID
            menuCd = "NGS140300";
            url = "/ngs/human/retrieveAnalysisDetailForm.do";
            addHidden('workNo', workNo);
        } else if (detailSeq === "9") { // Analysis
            menuCd = "NGS180200";
            url = "/ngs/anly/retrieveAnalysisWorkForm.do";
            preset = 'searchBeginDate:,searchBasicCd:01,searchBasicCn:' + workNo;
            addHidden('_preset', preset);
        }

        if (url) {
            try {
                // menuCd 추가 (LIMS 네비게이션 필수 값일 수 있음)
                if (menuCd) addHidden('menuCd', menuCd);

                log(`Opening New Window: ${url}`);
                navForm.action = url;
                navForm.submit();
            } catch (e) {
                console.error('Navigation failed:', e);
                alert('이동 중 오류가 발생했습니다.');
            }
        } else {
            alert('연결할 링크가 없습니다.');
        }
    }

    function getPlatformAttribute(pltfomCd) {
        // 1. window.objOrdBaseCmmnCmbCodes 확인
        try {
            if (window.objOrdBaseCmmnCmbCodes && window.objOrdBaseCmmnCmbCodes.PLTFOM_CD && window.objOrdBaseCmmnCmbCodes.PLTFOM_CD.data) {
                if (window.objOrdBaseCmmnCmbCodes.PLTFOM_CD.data[pltfomCd]) {
                    return window.objOrdBaseCmmnCmbCodes.PLTFOM_CD.data[pltfomCd].atrb2;
                }
            }
        } catch (e) { }

        // 2. Fallback: Hardcoded Mapping (commonly used codes)
        // This list should be updated based on known LIMS codes
        const mapping = {
            'H1': 'ILL', 'H2': 'ILL', 'N1': 'ILL', 'M1': 'ILL', 'M2': 'ILL',
            'MGI': 'MGI',
            'P1': 'PAC', 'P2': 'PAC', 'S1': 'PAC', 'S2': 'PAC',
            'ONT': 'ONT'
        };

        // Return default or mapped value
        return mapping[pltfomCd] || 'ILL'; // Default to ILL if unknown
    }


    // 전역 변수로 콤보 코드 캐싱
    let cachedUnusCodes = null;


    async function fetchComboCodes(groupCode) {
        const url = '/com/comm/frame/code/retrieveCmmnComboCodes.do';
        const payload = {
            dataSet: {
                groupCodes: [
                    { "groupCode": groupCode, "required": false, "includedNotUse": false }
                ]
            }
        };

        log(`콤보 코드 요청: ${groupCode}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Combo Code Fetch Failed: ${res.status}`);

        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);
        let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
        const text = decoder.decode(buffer);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // LIMS non-strict JSON fallback
            try {
                data = new Function(`return ${text}`)();
            } catch (evalErr) {
                console.error('Combo Code Parsing Failed:', evalErr);
            }
        }

        // IBSheet Combo Format handling
        // Expected: {"codes":{"PRFM_UNUS_DIV_CD":{"ComboCode":"|100|...","ComboText":"|Text|..."}}}
        if (data.codes && data.codes[groupCode]) {
            const group = data.codes[groupCode];
            const codes = (group.ComboCode || '').split('|').filter(x => x !== '');
            const texts = (group.ComboText || '').split('|').filter(x => x !== '');

            const list = codes.map((code, i) => ({
                code: code,
                text: texts[i] || code
            }));

            log(`콤보 코드 파싱 결과(${groupCode}):`, list);
            return list;
        }

        const list = data.dataSet && data.dataSet[groupCode];
        log(`콤보 코드 응답(${groupCode}):`, JSON.stringify(data));
        return list || [];
    }

    async function fetchSpecialNoteApi(ordNo) {
        // 로그 기반 정확한 페이로드 (undefined 포함)
        const payload = {
            dataSet: {
                undefined: {},
                prfmUnusForm: [
                    { name: "ordNo", value: ordNo },
                    { name: "srvcDivCd", value: "NGS" },
                    { name: "prfmUnusDivCd", value: "" }
                ]
            }
        };

        log(`JSON 전송 대상: ${CONFIG.SPECIAL_NOTE_API_URL}`, payload);
        const res = await fetch(CONFIG.SPECIAL_NOTE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);
        let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
        const text = decoder.decode(buffer);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = new Function(`return ${text}`)();
        }
        log('Special Note API 응답(Raw):', JSON.stringify(data));
        return data;
    }

    async function saveSpecialNote(ordNo, noteContent, noteType, existingRecord = null) {
        // 업데이트(U), 삽입(I)
        const isUpdate = existingRecord !== null;

        // 실제 LIMS 저장 페이로드 구조 (캡처된 정확한 형식)
        const payload = {
            dataSet: {
                undefined: {},
                ibsPrfmUnus: {
                    data: [
                        {
                            ibCheck: 1,
                            ibStatus: isUpdate ? "U" : "I",
                            prfmUnusDivCd: noteType,
                            prfmUnusCntn: noteContent,
                            userNm: "",
                            modiUserId: "",
                            modiDttm: "",
                            cmpnyCd: "",
                            srvcDivCd: "NGS",
                            ordNo: ordNo,
                            prfmUnusNo: isUpdate ? (existingRecord.prfmUnusNo || "") : "",
                            ibSeq: 1
                        }
                    ]
                },
                ibsPrfmUnus_upload: {
                    data: []
                }
            }
        };

        log(`저장 요청: ${CONFIG.SPECIAL_NOTE_SAVE_URL}`, payload);
        const res = await fetch(CONFIG.SPECIAL_NOTE_SAVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Save Failed: ${res.status}`);

        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);
        let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
        const text = decoder.decode(buffer);

        log('저장 응답(Raw):', text);

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            // LIMS non-strict JSON fallback
            try {
                json = new Function(`return ${text}`)();
            } catch (evalErr) {
                if (text.includes('<html')) throw new Error('응답이 HTML입니다 (로그인 만료 가능성).');
                throw new Error('응답 파싱 실패: ' + text);
            }
        }

        // LIMS 비즈니스 로직 오류 체크
        if (json.errorMessage && json.errorMessage !== '') {
            throw new Error(`서버 오류: ${json.errorMessage}`);
        }
        if (json.errorCode && json.errorCode !== '000') {
            throw new Error(`서버 오류 [${json.errorCode}]: ${json.errorMessage || '알 수 없는 오류'}`);
        }
        if (json.IBError) throw new Error(json.IBError);

        return true;
    }

    async function deleteSpecialNote(ordNo, record) {
        // 삭제 전용 함수 - deletePrfmUnus.do 사용
        const payload = {
            dataSet: {
                undefined: {},
                ibsPrfmUnus: {
                    data: [
                        {
                            ibCheck: 1,
                            ibStatus: "D",
                            prfmUnusDivCd: record.prfmUnusDivCd || "",
                            prfmUnusCntn: record.prfmUnusCntn || "",
                            userNm: record.userNm || "",
                            modiUserId: record.modiUserId || "",
                            modiDttm: record.modiDttm ?
                                record.modiDttm.replace(/[-:\s.]/g, '').substring(0, 14) : "",
                            cmpnyCd: "1000",
                            srvcDivCd: "NGS",
                            ordNo: ordNo,
                            prfmUnusNo: record.prfmUnusNo || "",
                            ibSeq: 1
                        }
                    ]
                },
                ibsPrfmUnus_upload: {
                    data: []
                }
            }
        };

        log(`삭제 요청: ${CONFIG.SPECIAL_NOTE_DELETE_URL}`, payload);
        const res = await fetch(CONFIG.SPECIAL_NOTE_DELETE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Delete Failed: ${res.status}`);

        const buffer = await res.arrayBuffer();
        const view = new Uint8Array(buffer);
        let decoder = (view.length > 1 && view[1] === 0) ? new TextDecoder('utf-16le') : new TextDecoder('utf-8');
        const text = decoder.decode(buffer);

        log('삭제 응답(Raw):', text);

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            try {
                json = new Function(`return ${text}`)();
            } catch (evalErr) {
                if (text.includes('<html')) throw new Error('응답이 HTML입니다 (로그인 만료 가능성).');
                throw new Error('응답 파싱 실패: ' + text);
            }
        }

        // LIMS 비즈니스 로직 오류 체크
        if (json.errorMessage && json.errorMessage !== '') {
            throw new Error(`서버 오류: ${json.errorMessage}`);
        }
        if (json.errorCode && json.errorCode !== '000') {
            throw new Error(`서버 오류 [${json.errorCode}]: ${json.errorMessage || '알 수 없는 오류'}`);
        }
        if (json.IBError) throw new Error(json.IBError);

        return true;
    }

    // ===================================
    // 3. 렌더링 (Rendering)
    // ===================================

    function renderSpecialNote(data, ordNo, comboCodes) {
        // Correct key based on logs: 'prfmUnus'
        const list = data.prfmUnus || data.ibsPrfmUnus || (data.dataSet && data.dataSet.ibsPrfmUnus) || [];

        // 콤보 코드 맵핑 (Code -> Text)
        const codeMap = {};
        let optionsHtml = '';
        if (comboCodes && comboCodes.length > 0) {
            comboCodes.forEach(c => {
                const code = c.code || c.value;
                const text = c.text || c.name || c.codeNm;

                if (code) {
                    codeMap[code] = text || code;
                    optionsHtml += `<option value="${code}">${text || code}</option>`;
                }
            });
        }

        // 만약 코드를 못 가져왔다면 기본값 유지
        if (!optionsHtml) {
            optionsHtml = `
                <option value="ETC">기타 (ETC)</option>
                <option value="01">공동</option>
                <option value="02">기본공정</option>
                <option value="03">Sequal</option>
                <option value="04">LRS Library</option>
                <option value="05">MI</option>
                <option value="06">HiSeq Library</option>
                <option value="07">HiSeq Run</option>
                <option value="08">LRS Run</option>
                <option value="09">재접수</option>
             `;
        }

        let html = '<div class="jsm-container">';
        html += '<div style="margin-bottom: 10px; text-align: right;">';
        html += '<button id="btn-add-note" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">+ Add Note</button>';
        html += '</div>';

        html += '<table class="jsm-table"><thead><tr>';
        html += '<th>상태</th><th>특이구분</th><th>특이내용</th><th>작성자</th><th>작성일</th><th>작업</th>';
        html += '</tr></thead><tbody>';

        if (list.length === 0) {
            html += '<tr><td colspan="6" style="padding:20px;">조회된 데이터가 없습니다.</td></tr>';
        } else {
            list.forEach((item, idx) => {
                // 특이구분 코드 -> 텍스트 변환
                const divCd = item.prfmUnusDivCd || '';
                const divText = codeMap[divCd] || divCd; // 맵핑 없으면 코드 그대로

                // 상태 변환 (R -> 저장됨)
                let statusText = item.ibStatus || 'R';
                if (statusText === 'R') statusText = '저장됨';

                html += '<tr>';
                html += `<td>${statusText}</td>`;
                html += `<td>${divText}</td>`;
                html += `<td style="text-align:left;">${item.prfmUnusCntn || ''}</td>`;
                html += `<td>${item.userNm || ''}</td>`;
                html += `<td>${item.modiDttm || ''}</td>`;
                html += `<td><button class="btn-delete-note" data-idx="${idx}" style="background:#e74c3c; color:white; border:none; padding:3px 8px; border-radius:3px; cursor:pointer;">삭제</button></td>`;
                html += '</tr>';
            });
        }
        html += '</tbody></table>';

        // 입력 폼 (숨김 상태)
        html += `
            <div id="note-input-form" style="display:none; margin-top:20px; padding:15px; background:#f9f9f9; border:1px solid #ddd;">
                <h4>새 노트 작성</h4>
                <div style="margin-bottom:10px;">
                    <label>구분(Code): </label>
                    <select id="note-type" style="width:150px; padding:3px;">
                        ${optionsHtml}
                    </select>
                </div>
                <div style="margin-bottom:10px;">
                    <label>내용: </label>
                    <textarea id="note-content" style="width:100%; height:60px; padding:5px;"></textarea>
                </div>
                <div style="text-align:center; margin-top: 10px;">
                    <button id="btn-save-note" style="background:#27ae60; color:white; border:none; padding:8px 20px; border-radius:3px; cursor:pointer; font-size:13px; margin-right:5px;">저장</button>
                    <button id="btn-cancel-note" style="background:#fff; border:1px solid #ccc; padding:8px 20px; border-radius:3px; cursor:pointer; font-size:13px;">취소</button>
                </div>
            </div>
        `;

        html += '</div>';
        updateModalBody(html);

        // 이벤트 바인딩
        setTimeout(() => {
            const btnAdd = document.getElementById('btn-add-note');
            const form = document.getElementById('note-input-form');
            const btnCancel = document.getElementById('btn-cancel-note');
            const btnSave = document.getElementById('btn-save-note');
            const btnDeletes = document.querySelectorAll('.btn-delete-note');

            if (btnAdd) btnAdd.onclick = () => {
                form.style.display = 'block';
                // 새 노트 추가 모드: 폼 초기화
                document.getElementById('note-type').value = comboCodes && comboCodes.length > 0 ? comboCodes[0].code : '';
                document.getElementById('note-content').value = '';
            };
            if (btnCancel) btnCancel.onclick = () => form.style.display = 'none';
            if (btnSave) btnSave.onclick = async () => {
                const type = document.getElementById('note-type').value;
                const content = document.getElementById('note-content').value;
                if (!content) { alert('내용을 입력하세요.'); return; }

                try {
                    // 새 노트 추가는 항상 Insert (existingRecord = null)
                    await saveSpecialNote(ordNo, content, type, null, false);
                    alert('저장되었습니다!');
                    handleSpecialNoteClick(); // 재조회
                } catch (e) {
                    console.error('저장 실패:', e);
                    alert('저장 실패: ' + e.message);
                }
            };

            // 삭제 버튼 이벤트
            btnDeletes.forEach(btn => {
                btn.onclick = async () => {
                    const idx = parseInt(btn.getAttribute('data-idx'));
                    const record = list[idx];

                    if (!confirm(`정말 삭제하시겠습니까?\n내용: ${record.prfmUnusCntn}`)) {
                        return;
                    }

                    try {
                        await deleteSpecialNote(ordNo, record);
                        alert('삭제되었습니다!');
                        handleSpecialNoteClick(); // 재조회
                    } catch (e) {
                        console.error('삭제 실패:', e);
                        alert('삭제 실패: ' + e.message);
                    }
                };
            });
        }, 100);
    }


    function renderJobStatus(data) {
        // 유효한 LIMS 응답 기반
        // API 리턴 키: resultSmplList, resultLibList

        // 중첩된 리스트 접근 (프레임워크에 따라 dataSet 내부에 있거나 루트에 있을 수 있음)
        const sampleList = data.resultSmplList || data.workStatusSmplList || (data.dataSet && data.dataSet.workStatusSmplList) || [];
        const libraryList = data.resultLibList || data.workStatusLibList || (data.dataSet && data.dataSet.workStatusLibList) || [];

        if (!sampleList && !libraryList) {
            console.log("예상치 못한 데이터 구조:", data);
        }

        let html = '<div class="jsm-container">';

        // Sample Table
        html += '<h4 class="jsm-section-title">Sample 작업 현황</h4>';
        if (sampleList && sampleList.length > 0) {
            const cols = [
                { id: 'no', label: '#' },
                { id: 'smplNm', label: 'SPL' },
                { id: 'cancCsct', label: 'CANCEL' },
                { id: 'preWorkCsct', label: 'SPL PREP' },
                { id: 'sqcWorkCsct', label: 'SQC' },
                { id: 'smplPrgrStat', label: 'STATUS' }
            ];
            html += generateTable(sampleList, cols);
        } else {
            html += '<p>No Sample Data</p>';
        }

        html += '<div style="height: 20px;"></div>';

        // Library Table
        html += '<h4 class="jsm-section-title">Library 작업 현황</h4>';
        if (libraryList && libraryList.length > 0) {
            const cols = [
                { id: 'no', label: '#' },
                { id: 'libNm', label: 'LIB' },
                { id: 'cancCsct', label: 'CANCEL' },
                { id: 'fragWorkCsct', label: 'LIB 제작' },
                { id: 'lqcWorkCsct', label: 'LIB QC' },
                { id: 'exomeWorkCsct', label: 'EXOMECAPTURE' },
                { id: 'ampWorkCsct', label: 'AMPLIFICATION' },
                { id: 'plateWorkCsct', label: 'INST.' },
                { id: 'anlyWorkCsct', label: 'ANALYSIS' },
                { id: 'libPrgrStat', label: 'STATUS' }
            ];
            html += generateTable(libraryList, cols);
        } else {
            html += '<p>No Library Data</p>';
        }

        html += '</div>';
        updateModalBody(html);
    }

    function getHighlightInfo(status) {
        if (!status) return null;
        const s = status.toLowerCase();

        // 1. Cancel (Red)
        if (s.includes('cancel') || s.includes('취소')) {
            return { colId: 'cancCsct', color: '#e74c3c', textColor: '#ffffff' };
        }

        // 2. Hold / 보류 (Yellow)
        if (s.includes('보류') || s.includes('hold')) {
            const color = '#f1c40f'; // Sunflower Yellow
            const textColor = '#333333'; // Dark Text for readability

            if (s.includes('sample') || s.includes('prep') || s.includes('추출')) return { colId: 'preWorkCsct', color, textColor };
            if (s.includes('sqc')) return { colId: 'sqcWorkCsct', color, textColor };
            if (s.includes('lib') && s.includes('qc')) return { colId: 'lqcWorkCsct', color, textColor };
            if (s.includes('lqc')) return { colId: 'lqcWorkCsct', color, textColor };
            if (s.includes('frag') || s.includes('제작')) return { colId: 'fragWorkCsct', color, textColor };
            if (s.includes('capture') || s.includes('exo') || s.includes('엑솜')) return { colId: 'exomeWorkCsct', color, textColor };
            if (s.includes('amplification')) return { colId: 'ampWorkCsct', color, textColor };
            if (s.includes('inst') || s.includes('run') || s.includes('sequencing')) return { colId: 'plateWorkCsct', color, textColor };
            if (s.includes('analysis') || s.includes('분석')) return { colId: 'anlyWorkCsct', color, textColor };

            // 기본적으로 매핑되지 않은 보류 상태는 상태 컬럼 자체를 칠하거나 무시 (여기선 무시)
            return null;
        }

        // 3. Process Steps (Blue)
        const color = '#5c7cfa';
        const textColor = '#ffffff';

        // --- Sample Statuses ---
        // Sample Pending은 보통 첫 단계(Prep) 대기로 간주
        if (s.includes('sample') && s.includes('pending')) return { colId: 'preWorkCsct', color, textColor };
        if (s.includes('sample') || s.includes('prep') || s.includes('추출')) return { colId: 'preWorkCsct', color, textColor };
        if (s.includes('sqc')) return { colId: 'sqcWorkCsct', color, textColor };

        // --- Library Statuses ---
        // LIB. Pending -> LIB 제작 대기
        if (s.includes('lib') && s.includes('pending')) return { colId: 'fragWorkCsct', color, textColor };

        if (s.includes('lib') && s.includes('제작')) return { colId: 'fragWorkCsct', color, textColor };
        if (s.includes('frag')) return { colId: 'fragWorkCsct', color, textColor };

        if (s.includes('lib') && s.includes('qc')) return { colId: 'lqcWorkCsct', color, textColor };
        if (s.includes('lqc')) return { colId: 'lqcWorkCsct', color, textColor };

        if (s.includes('capture') || s.includes('exo') || s.includes('엑솜')) return { colId: 'exomeWorkCsct', color, textColor };

        if (s.includes('amplification')) return { colId: 'ampWorkCsct', color, textColor };

        if (s.includes('inst') || s.includes('run') || s.includes('sequencing')) return { colId: 'plateWorkCsct', color, textColor };

        if (s.includes('analysis') || s.includes('분석') || s.includes('complete')) return { colId: 'anlyWorkCsct', color, textColor };

        return null;
    }

    function generateTable(rows, columns) {
        let h = '<table class="jsm-table"><thead><tr>';
        columns.forEach(c => h += `<th>${c.label}</th>`);
        h += '</tr></thead><tbody>';

        rows.forEach((row, idx) => {
            const status = row['libPrgrStat'] || row['smplPrgrStat'] || '';
            const highlight = getHighlightInfo(status);

            h += '<tr>';
            columns.forEach(c => {
                let val = row[c.id];
                if (val === undefined || val === null) val = '';
                if (c.id === 'no' && !val) val = idx + 1;

                // 기능: '재접수' 관련 상태 강조
                if (typeof val === 'string' && val.includes('재접수')) {
                    val = `<span style="color: #e74c3c; font-weight: bold;">${val}</span>`;
                }

                // Cell Highlighting
                let cellStyle = '';
                if (highlight && c.id === highlight.colId) {
                    cellStyle = ` style="background-color: ${highlight.color}; color: ${highlight.textColor};"`;
                }

                h += `<td${cellStyle}>${val}</td>`;
            });
            h += '</tr>';
        });

        h += '</tbody></table>';
        return h;
    }

    // ===================================
    // 4. 모달 및 드래그 로직 (Modal & Draggable Logic)
    // ===================================

    async function showModal(title, ordNo = null) {
        let modal = document.getElementById('job-status-modal');
        if (!modal) modal = createModalDOM();

        // [v1.0.7] 수주 네비게이션 업데이트
        const navContainer = modal.querySelector('.jsm-nav-bar');

        // 제목 설정 및 표시
        modal.querySelector('.jsm-title-text').textContent = title;
        modal.style.display = 'block';

        // Work Status 모달인 경우 네비게이션 처리 (비동기 처리)
        if (title.includes('Work Status')) {
            const allOrders = await getAvailableOrders(ordNo);

            if (allOrders.length > 1) {
                let navHtml = '<div style="margin-bottom:10px; padding:8px; background:#f0f2f5; border-radius:5px; font-size:12px;">';
                navHtml += '<strong>Quick Switch: </strong>';
                allOrders.forEach(no => {
                    const isCurrent = (no === ordNo);
                    navHtml += `<button class="jsm-nav-btn" data-no="${no}" style="
                        margin: 0 2px; 
                        padding: 2px 6px; 
                        border: 1px solid ${isCurrent ? '#4834d4' : '#ccc'}; 
                        background: ${isCurrent ? '#4834d4' : '#fff'}; 
                        color: ${isCurrent ? '#fff' : '#333'}; 
                        border-radius: 3px; 
                        cursor: pointer;
                        font-weight: ${isCurrent ? 'bold' : 'normal'};
                    ">${no}</button>`;
                });
                navHtml += '</div>';

                // 모달이 아직 열려있고 타이틀이 일치하는지 확인 후 삽입
                if (modal.style.display === 'block' && modal.querySelector('.jsm-title-text').textContent === title) {
                    navContainer.innerHTML = navHtml;
                    navContainer.style.display = 'block';

                    // 네비게이션 이벤트 바인딩
                    modal.querySelectorAll('.jsm-nav-btn').forEach(btn => {
                        const targetNo = btn.getAttribute('data-no');
                        btn.onclick = () => {
                            if (targetNo !== ordNo) {
                                openWorkStatusModal(targetNo);
                            }
                        };
                    });
                }
            } else {
                navContainer.style.display = 'none';
            }
        } else {
            navContainer.style.display = 'none';
        }
    }

    function updateModalBody(content) {
        const modal = document.getElementById('job-status-modal');
        if (modal) modal.querySelector('.jsm-body').innerHTML = content;
    }

    function createModalDOM() {
        const style = document.createElement('style');
        style.innerHTML = `
            #job-status-modal { display: none; position: fixed; z-index: ${CONFIG.MODAL_Z_INDEX}; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
            .jsm-content { 
                position: absolute; 
                left: 50%; 
                top: 50%; 
                transform: translate(-50%, -50%); 
                background: #fff; 
                width: 85%; 
                max-width: 1100px; 
                max-height: 90vh; 
                border-radius: 8px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); 
                display: flex; 
                flex-direction: column; 
            }
            .jsm-header { 
                padding: 15px 20px; 
                border-bottom: 1px solid #eee; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                background: #f8f9fa; 
                border-radius: 8px 8px 0 0;
                cursor: grab; /* 드래그 가능 표시 */
            }
            .jsm-header:active { cursor: grabbing; }
            .jsm-title-text { font-size: 18px; font-weight: bold; color: #333; pointer-events: none; }
            .jsm-close { font-size: 24px; color: #999; cursor: pointer; }
            .jsm-close:hover { color: #333; }
            .jsm-body { padding: 20px; overflow-y: auto; flex: 1; min-height: 300px; }
            .jsm-container { font-family: 'Malgun Gothic', sans-serif; }
            .jsm-section-title { margin: 20px 0 10px 0; padding-left: 10px; border-left: 4px solid #3498db; font-size: 16px; color: #2c3e50; }
            .jsm-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; }
            .jsm-table th { background-color: #f1f2f6; color: #555; font-weight: bold; padding: 10px; border-bottom: 2px solid #ddd; border-top: 1px solid #ddd; white-space: nowrap; }
            .jsm-table td { padding: 8px; border-bottom: 1px solid #eee; color: #444; }
            .jsm-table tr:hover td { background-color: #f9f9f9; }
            .job-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #8e44ad; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.id = 'job-status-modal';
        div.innerHTML = `
            <div class="jsm-content">
                <div class="jsm-header">
                    <span class="jsm-title-text">Job Status</span>
                    <span class="jsm-close">&times;</span>
                </div>
                <div class="jsm-nav-bar" style="padding: 10px 20px 0 20px; display:none;"></div>
                <div class="jsm-body"></div>
            </div>
        `;

        div.querySelector('.jsm-close').onclick = () => div.style.display = 'none';
        div.onclick = (e) => { if (e.target === div) div.style.display = 'none'; };

        // 드래그 로직 초기화
        makeDraggable(div.querySelector('.jsm-content'), div.querySelector('.jsm-header'));

        document.body.appendChild(div);
        return div;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // 닫기 버튼 클릭 시 드래그 방지
            if (e.target.classList.contains('jsm-close')) return;

            // 입력 요소(input, textarea, select, button) 클릭 시 드래그 방지
            const tagName = e.target.tagName.toLowerCase();
            if (['input', 'textarea', 'select', 'button'].includes(tagName)) return;

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // 새 커서 위치 계산:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 드래그 시작 시 transform 중심축 해제 및 절대 좌표로 전환
            // 첫 드래그 이동 시 transform이 활성화되어 있다면 위치를 고정함
            const style = window.getComputedStyle(element);
            if (style.transform !== 'none') {
                const rect = element.getBoundingClientRect();
                element.style.transform = 'none';
                element.style.left = rect.left + 'px';
                element.style.top = rect.top + 'px';
                element.style.right = 'auto'; // 충돌하는 스타일 제거
                element.style.bottom = 'auto';
            }

            // 요소의 새 위치 설정:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
