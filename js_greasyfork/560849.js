// ==UserScript==
// @name         LIMS 메인 대시보드 - LRS 수행팀
// @namespace    http://tampermonkey.net/
// @version      1.2.8
// @description  LRS 수행팀 전용 (PacBio / ONT) 실시간 작업 현황 + 지능형 YLD 모니터링
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        unsafeWindow
// @connect      lims3.macrogen.com
// @downloadURL https://update.greasyfork.org/scripts/560849/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20LRS%20%EC%88%98%ED%96%89%ED%8C%80.user.js
// @updateURL https://update.greasyfork.org/scripts/560849/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20LRS%20%EC%88%98%ED%96%89%ED%8C%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '1.2.7';
    const CACHE_KEY = 'LRS_STATUS_CACHE';
    const CACHE_TIME_KEY = 'LRS_STATUS_CACHE_TIME';
    const MONITOR_YLD_KEY = 'LRS_MONITOR_YLD_ACTIVE';
    const PROGRESS_CACHE_KEY = 'LRS_PLATE_PROGRESS';
    const LAST_YLD_CHECK_TIME = 'LRS_LAST_YLD_TIME';
    const LAST_YLD_COUNT_KEY = 'LRS_LAST_YLD_COUNT';

    // 보안 토큰(CSRF) 추출 함수
    function getCsrfInfo() {
        const tokenEl = document.querySelector('meta[name="_csrf"]');
        const headerEl = document.querySelector('meta[name="_csrf_header"]');
        const token = tokenEl ? tokenEl.content : undefined;
        const header = headerEl ? headerEl.content : undefined;
        return { token, header };
    }

    // 날짜 포맷 함수
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
        let retryCount = 0;
        const maxRetries = 10;

        async function tryInit() {
            const exchangeBox = document.querySelector('.object-wrap.exchange');
            if (!exchangeBox) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(tryInit, 1000);
                }
                return;
            }

            initStatusSection();
            initModal();

            const cachedCounts = GM_getValue(CACHE_KEY);
            const cachedTime = GM_getValue(CACHE_TIME_KEY);
            if (cachedCounts) {
                updateUITimestamp(cachedTime);
                updateUI(cachedCounts);
            }
        }

        tryInit();

        // 상시 감시 루프 (5분 주기)
        setInterval(() => {
            const isMonitoring = GM_getValue(MONITOR_YLD_KEY, false);
            if (isMonitoring) {
                const now = Date.now();
                const lastCheck = GM_getValue(LAST_YLD_CHECK_TIME, 0);
                if (now - lastCheck >= 9 * 60 * 1000) {
                    updateStatusDashboard('yld');
                }
            } else {
                updateStatusDashboard('plate');
            }
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
            listContainer.style.cssText = 'display: grid; grid-template-columns: 0.5fr 0.5fr 3.0fr 0.5fr 0.5fr; gap: 4px; padding: 0; margin: 0; min-height: 68px;';

            const cellBaseStyle = 'display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fbff; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; height: 68px; box-sizing: border-box; overflow: hidden;';
            const labelStyle = 'font-size: 11px; font-weight: 600; color: #64748b; white-space: nowrap;';
            const valueStyle = 'font-size: 14px; font-weight: 900;';

            listContainer.innerHTML = `
                <div class="stat-cell" style="${cellBaseStyle} cursor: pointer;" id="cell-prep" title="Prep (DNA/RNA)">
                    <div style="font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 2px;">Prep</div>
                    <div style="display: flex; width: 100%; justify-content: space-around; align-items: center; padding: 0 4px;">
                        <div style="display: flex; flex-direction: column; align-items: center;"><span style="${labelStyle}">D</span><span id="status-prep-dna" style="${valueStyle}">--</span></div>
                        <div style="display: flex; flex-direction: column; align-items: center;"><span style="${labelStyle}">R</span><span id="status-prep-rna" style="${valueStyle}">--</span></div>
                    </div>
                </div>
                <div class="stat-cell" style="${cellBaseStyle} cursor: pointer;" id="cell-sqc" title="SQC (DNA/RNA)">
                    <div style="font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 2px;">SQC</div>
                    <div style="display: flex; width: 100%; justify-content: space-around; align-items: center; padding: 0 4px;">
                        <div style="display: flex; flex-direction: column; align-items: center;"><span style="${labelStyle}">D</span><span id="status-sqc-dna" style="${valueStyle}">--</span></div>
                        <div style="display: flex; flex-direction: column; align-items: center;"><span style="${labelStyle}">R</span><span id="status-sqc-rna" style="${valueStyle}">--</span></div>
                    </div>
                </div>
                <div class="stat-cell" style="${cellBaseStyle} padding: 4px 8px; justify-content: space-between; align-items: stretch; background: #fff; cursor: pointer;" id="cell-lib">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #efefff; padding-bottom: 2px;">
                        <span style="font-size: 12px; font-weight: 900; color: #4834d4;">LIB 대기 상세 (PBL)</span>
                        <span id="status-lib-total" style="font-size: 17px; font-weight: 950; color: #4834d4;">--</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px 4px; margin-top: 2px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">MB:</span><span id="status-lib-mb" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">MSG:</span><span id="status-lib-msg" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">HiFi:</span><span id="status-lib-hifi" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">16s:</span><span id="status-lib-16s" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">Amp:</span><span id="status-lib-amp" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">KNX:</span><span id="status-lib-knx" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">ONT:</span><span id="status-lib-ont" style="font-size: 13px; font-weight: 950;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 10px; color: #64748b;">Etc:</span><span id="status-lib-etc" style="font-size: 13px; font-weight: 950;">--</span></div>
                    </div>
                </div>
                <div class="stat-cell" style="${cellBaseStyle}; cursor: pointer;" id="cell-run" title="Revio Run">
                    <span style="${labelStyle} padding-top: 2px;">RUN</span>
                    <span id="status-run-wait" style="font-size: 17px; font-weight: 900;">--</span>
                </div>
                <div class="stat-cell" style="${cellBaseStyle} background: #eff6ff; border-color: #bfdbfe; position: relative; cursor: pointer;" id="cell-yld" title="Yield Check 모니터링">
                    <span id="yld-label" style="${labelStyle} color: #2563eb; position: absolute; top: 4px;">YLD</span>
                    <span id="status-yld-count" style="font-size: 24px; font-weight: 900; color: #2563eb;">--</span>
                    <button id="yld-stop-btn" style="display: none; position: absolute; bottom: 4px; padding: 1px 4px; background: #fff; color: #ef4444; border: 1px solid #ef4444; border-radius: 4px; font-size: 8px; font-weight: 700; cursor: pointer;">종료</button>
                    <span id="yld-wait-text" style="font-size: 11px; color: #94a3b8; position: absolute; bottom: 4px;">트리거 대기 중</span>
                </div>
            `;

            document.getElementById('cell-prep').onclick = () => window.openLrsModal();
            document.getElementById('cell-sqc').onclick = () => window.openLrsModal();
            document.getElementById('cell-lib').onclick = () => window.openLrsModal();
            document.getElementById('cell-run').onclick = () => window.openLrsModal();
            document.getElementById('cell-yld').onclick = (e) => {
                if (e.target.id === 'yld-stop-btn') return;
                window.openLrsModal();
            };
            document.getElementById('yld-stop-btn').onclick = (e) => {
                e.stopPropagation();
                stopYldMonitoring();
            };
        }
    }

    async function fetchLimsData(url, payload) {
        const csrf = getCsrfInfo();
        const headers = {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "menucd": "NGS170600",
            "referer": "https://lims3.macrogen.com/ngs/demulti/retireveYieldCheckForm.do?menuCd=NGS170600"
        };
        if (csrf.header && csrf.token) headers[csrf.header] = csrf.token;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST", url, data: JSON.stringify(payload), headers, timeout: 30000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        let list = [];
                        if (data.waits) list = data.waits;
                        else if (data.result) list = data.result;
                        else if (data.resultList) list = data.resultList;
                        else if (data.dataSet) {
                            const ds = data.dataSet;
                            list = ds.waits || ds.result || ds.resultList || ds.demultiList || ds.instrumentPlateList || [];
                        }
                        resolve(Array.isArray(list) ? list : []);
                    } catch (e) { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

    function stopYldMonitoring() {
        GM_setValue(MONITOR_YLD_KEY, false);
        const countEl = document.getElementById('status-yld-count');
        const btn = document.getElementById('yld-stop-btn');
        const waitText = document.getElementById('yld-wait-text');
        if (countEl) countEl.innerText = '--';
        if (btn) btn.style.display = 'none';
        if (waitText) waitText.style.display = 'block';
    }

    const setGlobal = (name, fn) => {
        if (typeof unsafeWindow !== 'undefined') unsafeWindow[name] = fn;
        window[name] = fn;
    };
    setGlobal('LRS_FORCE_MONITORING', () => {
        GM_setValue(MONITOR_YLD_KEY, true);
        updateStatusDashboard('yld');
        GM_notification({ title: "📡 YLD 모니터링 강제 활성화", text: "YLD 모니터링을 즉시 시작합니다.", timeout: 3000 });
    });
    setGlobal('LRS_STOP_MONITORING', stopYldMonitoring);
    setGlobal('LRS_CHECK_STATUS', () => updateStatusDashboard('all'));
    setGlobal('LRS_TEST_PLATE', () => updateStatusDashboard('plate'));

    async function updateStatusDashboard(type = 'all') {
        const btnIdMap = { 'prep-qc': 'status-refresh-pq-btn', 'lib-run': 'status-refresh-lr-btn', 'all': 'status-refresh-all-btn' };
        const labelMap = { 'prep-qc': 'P/Q', 'lib-run': 'L/R', 'all': 'ALL' };
        const btn = document.getElementById(btnIdMap[type]);
        if (btn) { btn.innerText = '⏳'; btn.style.opacity = '0.7'; }

        try {
            const today = new Date();
            const sessionCounts = GM_getValue(CACHE_KEY, {});

            const resetTargets = {
                'prep-qc': ['status-sqc-dna', 'status-sqc-rna', 'status-prep-dna', 'status-prep-rna'],
                'lib-run': ['status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi', 'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc', 'status-run-wait'],
                'yld': ['status-yld-count'],
                'all': ['status-sqc-dna', 'status-sqc-rna', 'status-prep-dna', 'status-prep-rna', 'status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi', 'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc', 'status-run-wait', 'status-yld-count']
            };
            if (resetTargets[type]) {
                resetTargets[type].forEach(id => {
                    sessionCounts[id] = '--';
                    const el = document.getElementById(id);
                    if (el) { el.innerText = '--'; el.style.color = '#cbd5e1'; }
                });
                updateUI(sessionCounts);
            }

            const lrsPlatforms = ['REVIO', 'PROMETHION', 'SEQUEL', 'GRIDION', 'PACBIO', 'ONT'];
            const lrsKits = ['ISO-SEQ', 'NANOPORE', 'HIFI'];

            if (type === 'all' || type === 'prep-qc') {
                const queries = [
                    { id: 'status-sqc-dna', p: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "0" }] } } },
                    { id: 'status-sqc-rna', p: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "1" }] } } },
                    { id: 'status-prep-dna', p: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "2" }] } } },
                    { id: 'status-prep-rna', p: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "3" }] } } }
                ];
                for (const q of queries) {
                    const data = await fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", q.p);
                    sessionCounts[q.id] = data.filter(i => {
                        const plat = (i.pltfomNm || i.prfmPltfomNm || i.prfmPltfomCd || '').toUpperCase();
                        const kit = (i.libKitNm || '').toUpperCase();
                        return lrsPlatforms.some(p => plat.includes(p)) || lrsKits.some(k => kit.includes(k));
                    }).length;
                    updateUI(sessionCounts);
                }
            }

            if (type === 'all' || type === 'lib-run') {
                const libData = await fetchLimsData("https://lims3.macrogen.com/ngs/library/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchLibTypeCd", "value": "PBL" }, { "name": "menuCd", "value": "NGS120100" }] } });
                const stats = { total: 0, mb: 0, msg: 0, hifi: 0, s16: 0, amp: 0, knx: 0, ont: 0, etc: 0 };
                libData.filter(i => {
                    const plat = (i.pltfomNm || i.prfmPltfomNm || i.prfmPltfomCd || '').toUpperCase();
                    return lrsPlatforms.some(p => plat.includes(p));
                }).forEach(item => {
                    const kit = (item.libKitNm || '').toUpperCase();
                    stats.total++;
                    if (item.pltfomNm && (item.pltfomNm.toUpperCase().includes('PROMETHION') || item.pltfomNm.toUpperCase().includes('ONT'))) stats.ont++;
                    else if (kit.indexOf('KINNEX') !== -1) stats.knx++;
                    else if (kit.indexOf('MICROBIAL') !== -1) stats.mb++;
                    else if (kit.indexOf('METASHOTGUN') !== -1) stats.msg++;
                    else if (kit.indexOf('HIFI LIB') !== -1) stats.hifi++;
                    else if (kit.indexOf('16S') !== -1) stats.s16++;
                    else if (kit.indexOf('AMPLICON') !== -1) stats.amp++;
                    else stats.etc++;
                });
                Object.assign(sessionCounts, { 'status-lib-total': stats.total, 'status-lib-mb': stats.mb, 'status-lib-msg': stats.msg, 'status-lib-hifi': stats.hifi, 'status-lib-16s': stats.s16, 'status-lib-amp': stats.amp, 'status-lib-knx': stats.knx, 'status-lib-ont': stats.ont, 'status-lib-etc': stats.etc });
                updateUI(sessionCounts);

                const runData = await fetchLimsData("https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationSequalTwoList.do", { "dataSet": { "amplificationForm": [{ "name": "amplificationType", "value": "S2" }, { "name": "searchMode", "value": "PAC" }, { "name": "menuCd", "value": "NGS150500" }] } });
                const lrsPlatformsRun = ['REVIO', 'SEQUEL', 'PACBIO'];
                const revioRuns = runData.filter(i => {
                    const plat = (i.pltfomNm || i.prfmPltfomNm || '').toUpperCase();
                    return lrsPlatformsRun.some(p => plat.includes(p));
                });
                sessionCounts['status-run-wait'] = revioRuns.length;
                updateUI(sessionCounts);
            }

            if (type === 'all' || type === 'plate') {
                const beginDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                const platePayload = {
                    "dataSet": { "instrumentPlateForm": [{ "name": "pltfomCd", "value": "" }, { "name": "pltfomType", "value": "" }, { "name": "insId", "value": "" }, { "name": "searchMode", "value": "PAC" }, { "name": "searchBeginDate_text", "value": (beginDate.getFullYear()) + "-" + (String(beginDate.getMonth() + 1).padStart(2, '0')) + "-" + (String(beginDate.getDate()).padStart(2, '0')) }, { "name": "searchBeginDate", "value": getFormattedDate(beginDate) }, { "name": "searchEndDate_text", "value": (today.getFullYear()) + "-" + (String(today.getMonth() + 1).padStart(2, '0')) + "-" + (String(today.getDate()).padStart(2, '0')) }, { "name": "searchEndDate", "value": getFormattedDate(today) }, { "name": "searchPltfomCd", "value": "" }, { "name": "searchPlateStatCd", "value": "" }, { "name": "searchBasiSrchCd", "value": "" }, { "name": "searchKeyword", "value": "" }, { "name": "menuCd", "value": "NGS160200" }] }
                };
                const plateRawResponse = await new Promise((resolve) => {
                    const csrf = getCsrfInfo();
                    const headers = {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "menucd": "NGS160200"
                    };
                    if (csrf.header && csrf.token) headers[csrf.header] = csrf.token;
                    GM_xmlhttpRequest({
                        method: "POST", url: "https://lims3.macrogen.com/ngs/instrumentPlate/retrieveNgsInstrumentPlatePacBioList.do",
                        data: JSON.stringify(platePayload), headers, timeout: 30000,
                        onload: (res) => { try { resolve(JSON.parse(res.responseText)); } catch (e) { resolve(null); } },
                        onerror: () => resolve(null)
                    });
                });
                const plateData = (plateRawResponse && plateRawResponse.dataSet && plateRawResponse.dataSet.instrumentPlateList) ||
                    (plateRawResponse && plateRawResponse.instrumentPlateList) ||
                    (plateRawResponse && plateRawResponse.result) ||
                    (plateRawResponse && plateRawResponse.resultList) || [];

                const prevProg = GM_getValue(PROGRESS_CACHE_KEY, {});
                const newProg = {};
                let triggered = false;

                plateData.forEach(p => {
                    const key = p.imprtId || p.insId;
                    const prog = p.runProgRatio !== undefined ? p.runProgRatio : (p.progressRatio !== undefined ? p.progressRatio : null);
                    if (key && prog !== null) {
                        const progStr = String(prog);
                        newProg[key] = progStr;
                        if (prevProg[key] !== undefined && prevProg[key] !== progStr) triggered = true;
                    }
                });
                GM_setValue(PROGRESS_CACHE_KEY, newProg);
                if (triggered && !GM_getValue(MONITOR_YLD_KEY, false)) {
                    GM_setValue(MONITOR_YLD_KEY, true);
                    GM_notification({ title: "📡 YLD 모니터링 자동 활성화", text: "플레이트 진행률 변화가 감지되었습니다. 10분 주기로 모니터링을 시작합니다.", timeout: 5000 });
                    updateStatusDashboard('yld');
                }
            }

            if (type === 'yld' || (type === 'all' && GM_getValue(MONITOR_YLD_KEY, false))) {
                const yldListPayload = { "dataSet": { "undefined": {}, "demultiForm": [{ "name": "searchBeginDate_text", "value": "" }, { "name": "searchBeginDate", "value": "" }, { "name": "searchEndDate_text", "value": "" }, { "name": "searchEndDate", "value": "" }, { "name": "searchPltfomCd", "value": "RV" }, { "name": "searchRunTypeCd", "value": "" }, { "name": "searchBasicCd", "value": "01" }, { "name": "searchBasicCn", "value": "" }, { "name": "menuCd", "value": "NGS170600" }] } };
                const yldData = await fetchLimsData("https://lims3.macrogen.com/ngs/demulti/retrieveYieldCheckList.do", yldListPayload);
                const newYldCount = yldData.length;
                const prevYldCount = GM_getValue(LAST_YLD_COUNT_KEY, null);

                if (GM_getValue(MONITOR_YLD_KEY, false) && prevYldCount !== null && prevYldCount !== newYldCount) {
                    const diff = newYldCount - prevYldCount;
                    const diffText = diff > 0 ? `+${diff}건 증가` : `${diff}건 감소`;
                    GM_notification({ title: "🔔 YLD 수량 변경 감지", text: `${prevYldCount}건 → ${newYldCount}건 (${diffText})\n확인 후 모니터링을 종료하세요.`, timeout: 10000 });
                }

                GM_setValue(LAST_YLD_COUNT_KEY, newYldCount);
                sessionCounts['status-yld-count'] = newYldCount;
                GM_setValue(LAST_YLD_CHECK_TIME, Date.now());
                updateUI(sessionCounts);
            }

            updateUI(sessionCounts);
            GM_setValue(CACHE_KEY, sessionCounts);
            GM_setValue(CACHE_TIME_KEY, Date.now());
            updateUITimestamp(Date.now());
        } catch (e) {
            console.error('[LRS] Error:', e);
        } finally {
            if (btn) { btn.innerText = labelMap[type] || 'ALL'; btn.style.opacity = '1'; }
        }
    }

    function updateUITimestamp(ts) {
        const el = document.getElementById('status-update-time');
        if (!el || !ts) return;
        const d = new Date(ts);
        el.innerText = "(" + (d.getMonth() + 1) + "/" + d.getDate() + " " + String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0') + " 기준)";
    }

    function updateUI(counts) {
        Object.entries(counts).forEach(([id, count]) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = count; el.style.color = getCountColor(count); }
        });
        const active = GM_getValue(MONITOR_YLD_KEY, false);
        const btn = document.getElementById('yld-stop-btn');
        const wait = document.getElementById('yld-wait-text');
        if (btn) btn.style.display = active ? 'block' : 'none';
        if (wait) wait.style.display = active ? 'none' : 'block';
        const modalOverlay = document.getElementById('lrs-modal-overlay');
        if (modalOverlay && modalOverlay.style.display === 'flex') syncModalData();
    }

    function initModal() {
        if (document.getElementById('lrs-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'lrs-modal-overlay';
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); transition: 0.3s;";
        const modal = document.createElement('div');
        modal.id = 'lrs-modal-content';
        modal.style.cssText = "background: #fff; padding: 30px; border-radius: 20px; width: 850px; max-width: 95%; box-shadow: 0 20px 50px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s; border: 4px solid #efefff;";
        modal.innerHTML = `
            <div id="lrs-modal-close" style="position: absolute; top: 20px; right: 20px; cursor: pointer; font-size: 24px; color: #94a3b8;">✕</div>
            <h2 style="margin: 0 0 25px 0; color: #333; font-size: 20px;">📊 LRS 실시간 상세 현황 <span id="modal-update-time" style="font-size: 13px; color: #94a3b8; font-weight: normal;"></span></h2>
            <div style="background: #efefff; padding: 25px; border-radius: 20px; border: 2px solid #4834d4; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 3px solid #fff; padding-bottom: 12px;">
                    <span style="font-size: 22px; font-weight: 950; color: #4834d4;">LIB 대기 전 수량 (PBL)</span><span id="modal-lib-total" style="font-size: 48px; font-weight: 950; color: #4834d4;">--</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    <div class="modal-sub-card"><span>Microbial</span><b id="modal-lib-mb">--</b></div><div class="modal-sub-card"><span>MetaShotgun</span><b id="modal-lib-msg">--</b></div><div class="modal-sub-card"><span>HiFi Lib</span><b id="modal-lib-hifi">--</b></div><div class="modal-sub-card"><span>16s Full</span><b id="modal-lib-16s">--</b></div>
                    <div class="modal-sub-card"><span>Amplicon</span><b id="modal-lib-amp">--</b></div><div class="modal-sub-card"><span>Kinnex</span><b id="modal-lib-knx">--</b></div><div class="modal-sub-card"><span>ONT (Prom)</span><b id="modal-lib-ont">--</b></div><div class="modal-sub-card"><span>Etc</span><b id="modal-lib-etc">--</b></div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr) 0.8fr; gap: 20px;">
                <div class="modal-card" style="flex-direction: row; justify-content: space-around; padding: 15px;">
                    <div style="display: flex; flex-direction: column; align-items: center; border-right: 1px solid #e2e8f0; padding-right: 20px;">
                        <div class="modal-card-label">Prep (DNA)</div>
                        <div id="modal-prep-dna" style="font-size: 32px; font-weight: 900; color: #4834d4;">--</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; padding-left: 10px;">
                        <div class="modal-card-label">Prep (RNA)</div>
                        <div id="modal-prep-rna" style="font-size: 32px; font-weight: 900; color: #4834d4;">--</div>
                    </div>
                </div>
                <div class="modal-card" style="flex-direction: row; justify-content: space-around; padding: 15px;">
                    <div style="display: flex; flex-direction: column; align-items: center; border-right: 1px solid #e2e8f0; padding-right: 20px;">
                        <div class="modal-card-label">SQC (DNA)</div>
                        <div id="modal-sqc-dna" style="font-size: 32px; font-weight: 900; color: #4834d4;">--</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; padding-left: 10px;">
                        <div class="modal-card-label">SQC (RNA)</div>
                        <div id="modal-sqc-rna" style="font-size: 32px; font-weight: 900; color: #4834d4;">--</div>
                    </div>
                </div>
                <div class="modal-card"><div class="modal-card-label">RUN 대기 (Revio)</div><div id="modal-run-wait" style="font-size: 36px; font-weight: 950; color: #4834d4; margin-top: 10px;">--</div></div>
            </div>
            <div style="margin-top: 25px; padding: 15px; background: #f0f7ff; border-radius: 12px; display: flex; justify-content: center; align-items: center; border: 1px solid #bfdbfe;">
                <div style="text-align: center;"><span style="font-size: 14px; color: #2563eb; font-weight: 800;">🛰️ YLD 실시간 모니터링 수량</span><div id="modal-yld-count" style="font-size: 32px; font-weight: 950; color: #2563eb; margin-top: 5px;">--</div></div>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: center;">
                <button id="modal-refresh-btn" style="padding: 12px 30px; background: #4834d4; color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(72, 52, 212, 0.3);">지금 즉시 새로고침</button>
            </div>
        `;
        overlay.appendChild(modal); document.body.appendChild(overlay);
        window.openLrsModal = () => { overlay.style.display = 'flex'; setTimeout(() => { modal.style.transform = 'translateY(0)'; modal.style.opacity = '1'; }, 10); syncModalData(); };
        window.closeLrsModal = () => { modal.style.transform = 'translateY(20px)'; modal.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 200); };
        document.getElementById('lrs-modal-close').onclick = window.closeLrsModal;
        document.getElementById('modal-refresh-btn').onclick = () => { updateStatusDashboard('all'); };
        overlay.onclick = (e) => { if (e.target === overlay) window.closeLrsModal(); };
    }

    function syncModalData() {
        const ids = ['status-prep-dna', 'status-prep-rna', 'status-sqc-dna', 'status-sqc-rna', 'status-run-wait', 'status-yld-count', 'status-lib-total', 'status-lib-mb', 'status-lib-msg', 'status-lib-hifi', 'status-lib-16s', 'status-lib-amp', 'status-lib-knx', 'status-lib-ont', 'status-lib-etc'];
        ids.forEach(id => {
            const src = document.getElementById(id);
            const tgt = document.getElementById(id.replace('status-', 'modal-'));
            if (src && tgt) {
                tgt.innerText = src.innerText;
                tgt.style.color = (id === 'status-yld-count') ? '#2563eb' : src.style.color;
            }
        });
        const timeSrc = document.getElementById('status-update-time');
        const timeTgt = document.getElementById('modal-update-time');
        if (timeSrc && timeTgt) timeTgt.innerText = timeSrc.innerText;
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = ".stat-cell:hover { border-color: #4834d4 !important; background: #efefff !important; } .modal-card { background: #f8fafc; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; } .modal-card-label { font-size: 13px; font-weight: 800; color: #64748b; margin-bottom: 5px; } .sub-label { font-size: 10px; font-weight: 800; color: #94a3b8; margin-bottom: 2px; } .modal-sub-card { background: #fff; padding: 10px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; } .modal-sub-card span { font-size: 9px; font-weight: 800; color: #64748b; } .modal-sub-card b { font-size: 18px; font-weight: 950; color: #4834d4; } #modal-refresh-btn:hover { background: #3c2bb7 !important; transform: translateY(-2px); } #modal-refresh-btn:active { transform: translateY(0); }";
    document.head.appendChild(styleTag);

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else setTimeout(init, 200);
})();
