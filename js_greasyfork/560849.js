// ==UserScript==
// @name         LIMS 메인 대시보드 - LRS 수행팀
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  LRS 수행팀 전용 (PacBio / ONT) 실시간 작업 현황 + Demulti 실시간 알림
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      lims3.macrogen.com
// @downloadURL https://update.greasyfork.org/scripts/560849/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20LRS%20%EC%88%98%ED%96%89%ED%8C%80.user.js
// @updateURL https://update.greasyfork.org/scripts/560849/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20LRS%20%EC%88%98%ED%96%89%ED%8C%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_KEY = 'LRS_STATUS_CACHE';
    const CACHE_TIME_KEY = 'LRS_STATUS_CACHE_TIME';
    const RUNNING_LIST_KEY = 'LRS_DEMULTI_RUNNING';
    const HOLD_LIST_KEY = 'LRS_DEMULTI_HOLD';

    // 보안 토큰(CSRF) 추출 함수
    function getCsrfInfo() {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const header = document.querySelector('meta[name="_csrf_header"]')?.content;
        return { token, header };
    }

    // 날짜 포맷 함수 (YYYYMMDD, YYYY-MM-DD)
    function getFormattedDate(date, separator = '') {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return separator ? `${y}${separator}${m}${separator}${d}` : `${y}${m}${d}`;
    }

    // 숫자에 따른 색상 결정
    function getCountColor(count) {
        if (count === 0 || count === '0' || count === '--' || !count) return '#cbd5e1';
        return '#4834d4';
    }

    async function init() {
        initStatusSection();

        const cachedCounts = GM_getValue(CACHE_KEY);
        const cachedTime = GM_getValue(CACHE_TIME_KEY);

        // 캐시 데이터가 있으면 우선 표시 (새로고침 전까지 활용)
        if (cachedCounts) {
            updateUITimestamp(cachedTime);
            updateUI(cachedCounts);
        }

        initModal();

        // 초기 실행: 40번 스크립트 부하 분산 후 필요한 데이터만 갱신
        setTimeout(() => {
            updateStatusDashboard('demulti');
        }, 10000);

        setInterval(() => {
            updateStatusDashboard('demulti');
        }, 5 * 60 * 1000);
    }

    function initStatusSection() {
        const exchangeBox = document.querySelector('.object-wrap.exchange');
        if (!exchangeBox) return;

        const isrBox = document.querySelector('.object-wrap.isr');
        const targetHeight = isrBox ? isrBox.offsetHeight : 135;

        exchangeBox.style.height = targetHeight + 'px';
        exchangeBox.style.minHeight = targetHeight + 'px';
        exchangeBox.style.padding = '12px 15px';
        exchangeBox.style.boxSizing = 'border-box';

        const titleEl = exchangeBox.querySelector('.object-text-title') || exchangeBox.querySelector('.object-exchange-title');
        if (titleEl) {
            titleEl.style.display = 'flex';
            titleEl.style.alignItems = 'center';
            titleEl.style.width = '100%';
            titleEl.style.padding = '0';
            titleEl.style.marginBottom = '10px';
            titleEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 4px; width: 100%;">
                    <span style="font-weight: 700; font-size: 13px; color: #333; flex-shrink: 0;">📊 LRS 실시간</span>
                    <span id="status-update-time" style="font-size: 10px; color: #94a3b8; font-weight: normal; margin-right: auto;">(대기 중)</span>
                    <span id="status-refresh-pq-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 4px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Prep/QC 갱신">P/Q</span>
                    <span id="status-refresh-lr-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 4px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Lib/Run 갱신">L/R</span>
                    <span id="status-refresh-all-btn" style="cursor: pointer; font-size: 10px; color: #4834d4; padding: 2px 5px; background: #efefff; border-radius: 4px; border: 1px solid #4834d4; font-weight: 600; transition: 0.2s;" title="전체 갱신">ALL</span>
                </div>
            `;
            document.getElementById('status-refresh-pq-btn').onclick = () => updateStatusDashboard('prep-qc');
            document.getElementById('status-refresh-lr-btn').onclick = () => updateStatusDashboard('lib-run');
            document.getElementById('status-refresh-all-btn').onclick = () => updateStatusDashboard('all');
        }

        const subEl = exchangeBox.querySelector('.object-text-sub');
        if (subEl) subEl.style.display = 'none';

        const listContainer = exchangeBox.querySelector('.object-exchange-ul');
        if (listContainer) {
            // 컬럼 비율 조정: LIB 대기 칸을 대폭 확보 (0.5fr 0.5fr 3.0fr 0.5fr 0.8fr)
            listContainer.style.cssText = 'display: grid; grid-template-columns: 0.5fr 0.5fr 3.0fr 0.5fr 0.8fr; gap: 4px; padding: 0; margin: 0; min-height: 68px;';

            const cellBaseStyle = 'display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fbff; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; height: 68px; box-sizing: border-box; overflow: hidden;';
            const rowStyle = 'display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 4px; height: 50%; box-sizing: border-box;';
            const labelStyle = 'font-size: 8px; font-weight: 600; color: #64748b; white-space: nowrap;';
            const valueStyle = 'font-size: 11px; font-weight: 900;';

            listContainer.innerHTML = `
                <!-- Prep -->
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-prep" title="DNA/RNA Prep">
                    <div style="${rowStyle} border-bottom: 1px dashed rgba(72, 52, 212, 0.1);">
                        <span style="${labelStyle}">P D</span>
                        <span id="status-prep-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">P R</span>
                        <span id="status-prep-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <!-- QC -->
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-qc" title="DNA/RNA Sample QC">
                    <div style="${rowStyle} border-bottom: 1px dashed rgba(72, 52, 212, 0.1);">
                        <span style="${labelStyle}">Q D</span>
                        <span id="status-qc-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">Q R</span>
                        <span id="status-qc-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <!-- LIB (상세 레이아웃 - 클릭 시 모달) -->
                <div class="stat-cell" style="${cellBaseStyle} padding: 4px 8px; justify-content: space-between; align-items: stretch; background: #fff; cursor: pointer;" id="cell-lib">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #efefff; padding-bottom: 2px;">
                        <span style="font-size: 10px; font-weight: 900; color: #4834d4; letter-spacing: -0.5px;">LIB 대기 상세 (PBL)</span>
                        <span id="status-lib-total" style="font-size: 14px; font-weight: 950; color: #4834d4;">--</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px 4px; margin-top: 2px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">MB:</span><span id="status-lib-mb" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">MSG:</span><span id="status-lib-msg" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">HiFi:</span><span id="status-lib-hifi" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">16s:</span><span id="status-lib-16s" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">Amp:</span><span id="status-lib-amp" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">KNX:</span><span id="status-lib-knx" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">ONT:</span><span id="status-lib-ont" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8px; font-weight: 700; color: #64748b;">Etc:</span><span id="status-lib-etc" style="font-size: 10px; font-weight: 950; color: #333;">--</span></div>
                    </div>
                </div>
                <!-- RUN -->
                <div class="stat-cell" style="${cellBaseStyle}; cursor: pointer;" id="cell-run" title="Revio/PromethION Run">
                    <span style="${labelStyle} padding-top: 2px;">RUN</span>
                    <span id="status-run-wait" style="font-size: 14px; font-weight: 900;">--</span>
                </div>
                <!-- Demulti -->
                <div class="stat-cell" style="${cellBaseStyle} background: #eff6ff; border-color: #bfdbfe; cursor: pointer;" id="cell-demulti" title="PacBio Demultiplexing">
                    <div style="${rowStyle} border-bottom: 1px dashed rgba(59, 130, 246, 0.1); height: 50%;">
                        <span style="${labelStyle} color: #2563eb;">Ing</span>
                        <span id="status-dem-run" style="${valueStyle} color: #2563eb;">--</span>
                        <span style="${labelStyle} margin-left: 2px;">Hold</span>
                        <span id="status-dem-hold" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle} height: 50%;">
                        <span style="${labelStyle}">Cnf (7d)</span>
                        <span id="status-dem-cfmd" style="${valueStyle}">--</span>
                    </div>
                </div>
            `;

            // 이벤트 리스너 등록 (onclick 대신 JS에서 바인딩하여 샌드박스 오류 방지)
            const clickableIds = ['cell-lib', 'cell-run', 'cell-demulti'];
            clickableIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.onclick = () => { if (window.openLrsModal) window.openLrsModal(); };
            });
        }
    }

    async function fetchLimsData(url, payload) {
        const csrf = getCsrfInfo();
        const headers = {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        };
        if (csrf.header && csrf.token) {
            headers[csrf.header] = csrf.token;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify(payload),
                headers: headers,
                timeout: 30000, // 30초 타임아웃 추가
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        // 다양한 리턴 형태 대응 (waits, result, resultList, dataSet 내의 여러 키)
                        const list = data.waits || data.result || data.resultList ||
                            data.dataSet?.waits || data.dataSet?.result ||
                            data.dataSet?.resultList || data.dataSet?.demultiList || [];
                        resolve(Array.isArray(list) ? list : []);
                    } catch (e) {
                        console.error(`[LRS] Parse Error (${url}):`, e);
                        resolve([]);
                    }
                },
                onerror: (err) => {
                    console.error(`[LRS] Network Error (${url}):`, err);
                    resolve([]);
                },
                ontimeout: () => {
                    console.error(`[LRS] Timeout Error (${url})`);
                    resolve([]);
                }
            });
        });
    }

    async function updateStatusDashboard(type = 'all') {
        const btnIdMap = { 'prep-qc': 'status-refresh-pq-btn', 'lib-run': 'status-refresh-lr-btn', 'all': 'status-refresh-all-btn', 'demulti': null };
        const labelMap = { 'prep-qc': 'P/Q', 'lib-run': 'L/R', 'all': 'ALL', 'demulti': 'DEM' };

        const btn = document.getElementById(btnIdMap[type]);
        const modalBtn = document.getElementById('modal-refresh-btn');

        if (btn) {
            btn.style.opacity = '0.7';
            btn.innerText = `⏳`;
        }
        if (modalBtn) {
            modalBtn.disabled = true;
            modalBtn.style.opacity = '0.6';
            modalBtn.innerText = '⏳ 데이터 갱신 중...';
        }

        const groupIds = {
            'prep-qc': ['status-qc-dna', 'status-qc-rna', 'status-prep-dna', 'status-prep-rna'],
            'lib-run': ['status-run-wait', 'status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi', 'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc'],
            'demulti': ['status-dem-run', 'status-dem-hold', 'status-dem-cfmd'],
            'all': [
                'status-qc-dna', 'status-qc-rna', 'status-prep-dna', 'status-prep-rna',
                'status-run-wait', 'status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi',
                'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc',
                'status-dem-run', 'status-dem-hold', 'status-dem-cfmd'
            ]
        };
        const clearIds = groupIds[type] || [];
        clearIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = '--';
                el.style.color = '#cbd5e1'; // 로딩 중인 필드만 초기화 (나머지 섹션은 캐시 유지)
            }
        });

        // 모달 데이터도 즉시 동기화하여 시각적 혼동 방지
        if (document.getElementById('lrs-modal-overlay')?.style.display === 'flex') {
            syncModalData();
        }

        try {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);

            const queries = [
                { id: 'status-qc-dna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "0" }] } }) },
                { id: 'status-qc-rna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "1" }] } }) },
                { id: 'status-prep-dna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "2" }] } }) },
                { id: 'status-prep-rna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "3" }] } }) },
                { id: 'status-lib-wait', group: 'lib-run', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/library/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchLibTypeCd", "value": "PBL" }, { "name": "menuCd", "value": "NGS120100" }] } }) },
                { id: 'status-run-wait', group: 'lib-run', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationSequalTwoList.do", { "dataSet": { "amplificationForm": [{ "name": "amplificationType", "value": "S2" }, { "name": "searchMode", "value": "PAC" }, { "name": "menuCd", "value": "NGS150500" }] } }) },
                {
                    id: 'demulti-data', group: 'demulti', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/demulti/retrievePacBioReportList.do", {
                        "dataSet": {
                            "demultiForm": [
                                { "name": "searchMode", "value": "PAC" },
                                { "name": "searchBeginDate_text", "value": getFormattedDate(lastWeek, '-') },
                                { "name": "searchBeginDate", "value": getFormattedDate(lastWeek) },
                                { "name": "searchEndDate_text", "value": getFormattedDate(today, '-') },
                                { "name": "searchEndDate", "value": getFormattedDate(today) },
                                { "name": "searchPltfomCd", "value": "" },
                                { "name": "searchEqtbListSn", "value": "" },
                                { "name": "searchDemStatCd", "value": "" },
                                { "name": "searchBasicCd", "value": "01" },
                                { "name": "searchBasicCn", "value": "" },
                                { "name": "menuCd", "value": "NGS170201" }
                            ]
                        }
                    })
                }
            ];

            const targetQueries = type === 'all' ? queries : queries.filter(q => q.group === type || q.id === 'demulti-data');

            // 갱신 중인 섹션만 담을 임시 저장소
            const sessionCounts = {};

            for (const q of targetQueries) {
                const data = await q.fn();
                const qId = q.id;

                if (qId === 'demulti-data') {
                    processDemultiData(data, sessionCounts);
                } else {
                    const isTarget = (item) => item && ['Revio', 'PromethION'].includes(item.pltfomNm || item.prfmPltfomNm);
                    const isRevioOnly = (item) => item && (item.pltfomNm || item.prfmPltfomNm) === 'Revio';
                    const isNot16s = (item) => item && item.libKitNm !== '[3.0] PacBio 16s full-length Library';

                    if (qId === 'status-lib-wait') {
                        const stats = { total: 0, mb: 0, msg: 0, hifi: 0, s16: 0, amp: 0, knx: 0, ont: 0, etc: 0 };
                        const filteredData = data.filter(isTarget);
                        stats.total = filteredData.length;
                        filteredData.forEach(item => {
                            const kitNm = item.libKitNm || '';
                            const platform = item.pltfomNm || item.prfmPltfomNm || '';

                            if (platform === 'PromethION') stats.ont++;
                            else if (kitNm.includes('Kinnex')) stats.knx++;
                            else if (kitNm === '[3.0] PacBio Microbial Library') stats.mb++;
                            else if (kitNm === '[3.0] PacBio MetaShotgun Library') stats.msg++;
                            else if (kitNm === '[3.0] PacBio HiFi Library') stats.hifi++;
                            else if (kitNm === '[3.0] PacBio 16s full-length Library') stats.s16++;
                            else if (kitNm === '[3.0] PacBio Amplicon Library') stats.amp++;
                            else stats.etc++;
                        });

                        const mapping = { 'lib-total': stats.total, 'lib-mb': stats.mb, 'lib-msg': stats.msg, 'lib-hifi': stats.hifi, 'lib-16s': stats.s16, 'lib-amp': stats.amp, 'lib-knx': stats.knx, 'lib-ont': stats.ont, 'lib-etc': stats.etc };
                        Object.entries(mapping).forEach(([k, v]) => sessionCounts[`status-${k}`] = v);
                    } else {
                        let count;
                        if (qId.includes('prep') || qId.includes('qc')) {
                            count = data.filter(i => isTarget(i) && isNot16s(i)).length;
                        } else if (qId === 'status-run-wait') {
                            count = data.filter(isRevioOnly).length;
                        } else {
                            count = data.filter(isTarget).length;
                        }
                        sessionCounts[qId] = count;
                    }
                }

                // 갱신된 항목만 즉시 반영
                updateUI(sessionCounts);

                await new Promise(r => setTimeout(r, 500));
            }

            const updateTime = new Date().getTime();
            const globalCache = GM_getValue(CACHE_KEY, {});
            Object.assign(globalCache, sessionCounts);

            GM_setValue(CACHE_KEY, globalCache);
            GM_setValue(CACHE_TIME_KEY, updateTime);
            updateUITimestamp(updateTime);

        } catch (e) {
            console.error('[LRS] Update Dashboard Error:', e);
        } finally {
            if (btn) { btn.style.opacity = '1'; btn.innerText = labelMap[type]; }
            if (modalBtn) {
                modalBtn.disabled = false;
                modalBtn.style.opacity = '1';
                modalBtn.innerText = '지금 즉시 새로고침';
            }
        }
    }

    function processDemultiData(data, currentCounts) {
        // 고유 키 생성 함수 (DATA ID[Raw Dir] + CELL 위치 조합으로 충돌 원천 봉쇄)
        const getCellKey = (item) => {
            const runId = item.imprtId || item.insId || '';
            const cellPos = item.celPosition || '';
            if (!runId && !cellPos) return null;
            return `${runId}|${cellPos}`; // 구분자를 | 로 변경하여 ID 내 언더바(_) 혼동 방지
        };

        const runningItems = data.filter(item => item.demStatNm === 'Running');
        const holdItems = data.filter(item => item.demStatNm === 'Hold compl.');
        const cfmdItems = data.filter(item => item.demStatNm === 'cfmd');

        const currentlyRunningKeys = runningItems.map(getCellKey).filter(k => k);
        const currentlyHoldKeys = holdItems.map(getCellKey).filter(k => k);

        const prevRunningKeys = GM_getValue(RUNNING_LIST_KEY, []);
        const prevHoldKeys = GM_getValue(HOLD_LIST_KEY, []);

        // 알림 처리 로직 통합 및 강화
        const notifyIfCompleted = (prevKeys, statusLabel) => {
            prevKeys.forEach(oldKey => {
                if (!oldKey) return;
                const currentItem = data.find(item => getCellKey(item) === oldKey);
                // 이전 상태가 리스트에 있었는데 현재 cfmd 상태라면 알림
                if (currentItem && currentItem.demStatNm === 'cfmd') {
                    GM_notification({
                        title: `🚀 디멀티플렉싱 완료! (${statusLabel})`,
                        text: `PLATE: ${currentItem.insId || '-'}\nCELL: ${currentItem.celPosition || '-'}\nRUN: ${currentItem.imprtId || 'N/A'}\n작업이 완료되었습니다.`,
                        onclick: () => window.focus()
                    });
                }
            });
        };

        if (prevRunningKeys.length > 0) notifyIfCompleted(prevRunningKeys, "Running");
        if (prevHoldKeys.length > 0) notifyIfCompleted(prevHoldKeys, "Hold");

        // 다음 비교를 위해 현재 상태 저장
        GM_setValue(RUNNING_LIST_KEY, currentlyRunningKeys);
        GM_setValue(HOLD_LIST_KEY, currentlyHoldKeys);

        // UI 표시용 (Running은 Run단위, Hold/Completed는 Cell단위 수량 표시)
        const uniqueRunningPlateCount = [...new Set(runningItems.map(item => item.imprtId || item.insId))].length;
        currentCounts['status-dem-run'] = uniqueRunningPlateCount;
        currentCounts['status-dem-hold'] = holdItems.length;
        currentCounts['status-dem-cfmd'] = cfmdItems.length;

        const runEl = document.getElementById('status-dem-run');
        const holdEl = document.getElementById('status-dem-hold');
        const cfmdEl = document.getElementById('status-dem-cfmd');

        if (runEl) {
            runEl.innerText = uniqueRunningPlateCount;
            runEl.style.color = uniqueRunningPlateCount > 0 ? '#2563eb' : '#cbd5e1';
        }
        if (holdEl) {
            holdEl.innerText = holdItems.length;
            holdEl.style.color = getCountColor(holdItems.length);
        }
        if (cfmdEl) {
            cfmdEl.innerText = cfmdItems.length;
            cfmdEl.style.color = getCountColor(cfmdItems.length);
        }
    }

    function updateUITimestamp(timestamp) {
        const el = document.getElementById('status-update-time');
        if (!el || !timestamp) return;
        const d = new Date(timestamp);
        const formatted = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        el.innerText = `(${formatted} 기준)`;
    }

    function updateUI(counts) {
        Object.entries(counts).forEach(([id, count]) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = count;
                el.style.color = getCountColor(count);
            }
        });
        // 모달이 열려있다면 데이터 동기화
        if (document.getElementById('lrs-modal-overlay')?.style.display === 'flex') {
            syncModalData();
        }
    }

    function initModal() {
        if (document.getElementById('lrs-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'lrs-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center;
            z-index: 10000; backdrop-filter: blur(4px); transition: 0.3s;
        `;

        const modal = document.createElement('div');
        modal.id = 'lrs-modal-content';
        modal.style.cssText = `
            background: #fff; padding: 30px; border-radius: 20px; width: 850px; max-width: 95%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s;
            position: relative; border: 4px solid #efefff;
        `;

        modal.innerHTML = `
            <div id="lrs-modal-close" style="position: absolute; top: 20px; right: 20px; cursor: pointer; font-size: 24px; color: #94a3b8; z-index: 10001; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">✕</div>
            <h2 style="margin: 0 0 25px 0; color: #333; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                📊 LRS 실시간 상세 현황
                <span id="modal-update-time" style="font-size: 13px; color: #94a3b8; font-weight: normal;"></span>
            </h2>

            <!-- (1) LIB 상세 -->
            <div style="background: #efefff; padding: 25px; border-radius: 20px; border: 2px solid #4834d4; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(72, 52, 212, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 3px solid #fff; padding-bottom: 12px;">
                    <span style="font-size: 22px; font-weight: 950; color: #4834d4;">LIB 대기 전 수량 (PBL)</span>
                    <span id="modal-lib-total" style="font-size: 48px; font-weight: 950; color: #4834d4;">--</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    <div class="modal-sub-card"><span>Microbial</span><b id="modal-lib-mb">--</b></div>
                    <div class="modal-sub-card"><span>MetaShotgun</span><b id="modal-lib-msg">--</b></div>
                    <div class="modal-sub-card"><span>HiFi Lib</span><b id="modal-lib-hifi">--</b></div>
                    <div class="modal-sub-card"><span>16s Full</span><b id="modal-lib-16s">--</b></div>
                    <div class="modal-sub-card"><span>Amplicon</span><b id="modal-lib-amp">--</b></div>
                    <div class="modal-sub-card"><span>Kinnex</span><b id="modal-lib-knx">--</b></div>
                    <div class="modal-sub-card"><span>ONT (Prom)</span><b id="modal-lib-ont">--</b></div>
                    <div class="modal-sub-card"><span>Etc</span><b id="modal-lib-etc">--</b></div>
                </div>
            </div>

            <!-- (2) 하단 서브 정보 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                <div class="modal-card">
                    <div class="modal-card-label">Prep (DNA/RNA)</div>
                    <div style="display: flex; gap: 20px;">
                        <div style="text-align: center;"><span style="font-size: 12px; color: #64748b;">D</span><div id="modal-prep-dna" style="font-size: 24px; font-weight: 900;">--</div></div>
                        <div style="text-align: center;"><span style="font-size: 12px; color: #64748b;">R</span><div id="modal-prep-rna" style="font-size: 24px; font-weight: 900;">--</div></div>
                    </div>
                </div>
                <div class="modal-card">
                    <div class="modal-card-label">QC (DNA/RNA)</div>
                    <div style="display: flex; gap: 20px;">
                        <div style="text-align: center;"><span style="font-size: 12px; color: #64748b;">D</span><div id="modal-qc-dna" style="font-size: 24px; font-weight: 900;">--</div></div>
                        <div style="text-align: center;"><span style="font-size: 12px; color: #64748b;">R</span><div id="modal-qc-rna" style="font-size: 24px; font-weight: 900;">--</div></div>
                    </div>
                </div>
                <div class="modal-card">
                    <div class="modal-card-label">RUN 대기 (Revio)</div>
                    <div id="modal-run-wait" style="font-size: 36px; font-weight: 900; color: #4834d4;">--</div>
                </div>
            </div>

            <div style="margin-top: 25px; padding: 15px; background: #f0f7ff; border-radius: 12px; display: flex; justify-content: space-around; align-items: center; border: 1px solid #bfdbfe;">
                <div style="text-align: center;"><span style="font-size: 12px; color: #2563eb; font-weight: 700;">Demulti 진행 중</span><div id="modal-dem-run" style="font-size: 22px; font-weight: 900; color: #2563eb;">--</div></div>
                <div style="text-align: center;"><span style="font-size: 12px; color: #64748b; font-weight: 700;">Demulti 대기</span><div id="modal-dem-hold" style="font-size: 22px; font-weight: 900;">--</div></div>
                <div style="text-align: center;"><span style="font-size: 12px; color: #64748b; font-weight: 700;">완료 (7d)</span><div id="modal-dem-cfmd" style="font-size: 22px; font-weight: 900;">--</div></div>
            </div>

            <div style="margin-top: 25px; text-align: center;">
                <button id="modal-refresh-btn" style="padding: 12px 60px; background: #efefff; color: #4834d4; border: 2px solid #4834d4; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 15px rgba(72, 52, 212, 0.1);">지금 즉시 새로고침</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        window.openLrsModal = () => {
            overlay.style.display = 'flex';
            setTimeout(() => { modal.style.transform = 'translateY(0)'; modal.style.opacity = '1'; }, 10);
            syncModalData();
        };

        window.closeLrsModal = () => {
            modal.style.transform = 'translateY(20px)';
            modal.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 200);
        };

        document.getElementById('lrs-modal-close').onclick = window.closeLrsModal;
        overlay.onclick = (e) => { if (e.target === overlay) window.closeLrsModal(); };
        document.getElementById('modal-refresh-btn').onclick = () => updateStatusDashboard('all');
    }

    function syncModalData() {
        const ids = [
            'status-prep-dna', 'status-prep-rna', 'status-qc-dna', 'status-qc-rna',
            'status-run-wait', 'status-dem-run', 'status-dem-hold', 'status-dem-cfmd',
            'status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi',
            'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc'
        ];
        ids.forEach(id => {
            const source = document.getElementById(id);
            const target = document.getElementById(id.replace('status-', 'modal-'));
            if (source && target) {
                target.innerText = source.innerText;
                target.style.color = source.style.color;
            }
        });
        const timeSource = document.getElementById('status-update-time');
        const timeTarget = document.getElementById('modal-update-time');
        if (timeSource && timeTarget) timeTarget.innerText = timeSource.innerText;
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .stat-cell:hover { border-color: #4834d4 !important; background: #efefff !important; box-shadow: 0 4px 12px rgba(72, 52, 212, 0.1); }
        .modal-card { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .modal-card-label { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
        .modal-sub-card { background: #fff; padding: 12px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .modal-sub-card span { font-size: 11px; font-weight: 800; color: #64748b; }
        .modal-sub-card b { font-size: 22px; font-weight: 950; color: #4834d4; }
    `;
    document.head.appendChild(styleTag);

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { setTimeout(init, 200); }
})();
