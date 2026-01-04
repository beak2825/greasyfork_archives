// ==UserScript==
// @name         LIMS 메인 대시보드 - 실시간 작업 현황(PacBio/ONT)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  LIMS 메인 페이지의 환율 섹션을 활용하여 PacBio 및 ONT 실시간 작업 대기 현황을 표시합니다.
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      lims3.macrogen.com
// @downloadURL https://update.greasyfork.org/scripts/560581/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%EC%9E%91%EC%97%85%20%ED%98%84%ED%99%A9%28PacBioONT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560581/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%EC%9E%91%EC%97%85%20%ED%98%84%ED%99%A9%28PacBioONT%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_KEY = 'LRS_STATUS_CACHE';
    const CACHE_TIME_KEY = 'LIMS_STATUS_CACHE_TIME';

    // 보안 토큰(CSRF) 추출 함수
    function getCsrfInfo() {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const header = document.querySelector('meta[name="_csrf_header"]')?.content;
        return { token, header };
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

        if (cachedCounts) {
            updateUITimestamp(cachedTime);
            Object.entries(cachedCounts).forEach(([id, count]) => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerText = count;
                    el.style.color = getCountColor(count);
                }
            });
        }
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
                    <span style="font-weight: 700; font-size: 14px; color: #333; flex-shrink: 0;">📊 실시간 현황</span>
                    <span id="status-update-time" style="font-size: 10px; color: #94a3b8; font-weight: normal; margin-right: auto;">(대기 중)</span>
                    <span id="status-refresh-pq-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 5px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Prep/QC 갱신">P/Q</span>
                    <span id="status-refresh-lr-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 5px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Lib/Run 갱신">L/R</span>
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
            listContainer.style.cssText = 'display: grid; grid-template-columns: 1.2fr 1.2fr 1fr 1fr; gap: 6px; padding: 0; margin: 0; min-height: 68px;';

            const cellBaseStyle = 'display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fbff; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; height: 68px; box-sizing: border-box;';
            const rowStyle = 'display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 8px; height: 50%; box-sizing: border-box;';
            const labelStyle = 'font-size: 9px; font-weight: 600; color: #64748b;';
            const valueStyle = 'font-size: 13px; font-weight: 900;';

            listContainer.innerHTML = `
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-prep" title="DNA/RNA Prep">
                    <div style="${rowStyle} border-bottom: 1px dashed rgba(72, 52, 212, 0.1);">
                        <span style="${labelStyle}">Prep D</span>
                        <span id="status-prep-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">Prep R</span>
                        <span id="status-prep-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-qc" title="DNA/RNA Sample QC">
                    <div style="${rowStyle} border-bottom: 1px dashed rgba(72, 52, 212, 0.1);">
                        <span style="${labelStyle}">QC D</span>
                        <span id="status-qc-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">QC R</span>
                        <span id="status-qc-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-lib" title="Library Prep">
                    <span style="${labelStyle} margin-bottom: 2px;">LIB 대기</span>
                    <span id="status-lib-wait" style="font-size: 16px; font-weight: 900;">--</span>
                </div>
                <div class="stat-cell" style="${cellBaseStyle}" id="cell-run" title="Revio/PromethION Run">
                    <span style="${labelStyle} margin-bottom: 2px;">RUN 대기</span>
                    <span id="status-run-wait" style="font-size: 16px; font-weight: 900;">--</span>
                </div>
            `;
        }
    }

    async function fetchLimsData(url, payload) {
        const csrf = getCsrfInfo();
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify(payload),
                headers: { "Content-Type": "application/json; charset=UTF-8", "X-Requested-With": "XMLHttpRequest", [csrf.header]: csrf.token },
                onload: (res) => {
                    try { const data = JSON.parse(res.responseText); resolve(data.waits || data.result || []); }
                    catch (e) { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

    async function updateStatusDashboard(type = 'all') {
        const btnIdMap = { 'prep-qc': 'status-refresh-pq-btn', 'lib-run': 'status-refresh-lr-btn', 'all': 'status-refresh-all-btn' };
        const labelMap = { 'prep-qc': 'P/Q', 'lib-run': 'L/R', 'all': 'ALL' };

        const btn = document.getElementById(btnIdMap[type]);
        if (btn) {
            btn.style.opacity = '0.7';
            btn.innerText = `${labelMap[type]} 갱신 중...`;
        }

        try {
            const allQueries = [
                { id: 'status-qc-dna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "0" }] } }) },
                { id: 'status-qc-rna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "1" }] } }) },
                { id: 'status-prep-dna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "2" }] } }) },
                { id: 'status-prep-rna', group: 'prep-qc', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "3" }] } }) },
                { id: 'status-lib-wait', group: 'lib-run', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/library/retrieveWaits.do", { "dataSet": { "frmWait": [{ "name": "searchLibTypeCd", "value": "PBL" }, { "name": "menuCd", "value": "NGS120100" }] } }) },
                { id: 'status-run-wait', group: 'lib-run', fn: () => fetchLimsData("https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationSequalTwoList.do", { "dataSet": { "amplificationForm": [{ "name": "amplificationType", "value": "S2" }, { "name": "searchMode", "value": "PAC" }, { "name": "menuCd", "value": "NGS150500" }] } }) }
            ];

            const targetQueries = type === 'all' ? allQueries : allQueries.filter(q => q.group === type);

            // 병렬 요청으로 속도 최적화
            const results = await Promise.all(targetQueries.map(q => q.fn()));
            const currentCounts = GM_getValue(CACHE_KEY) || {};

            const isTarget = (item) => ['Revio', 'PromethION'].includes(item.pltfomNm || item.prfmPltfomNm);
            const isNot16s = (item) => item.libKitNm !== '[3.0] PacBio 16s full-length Library';

            results.forEach((data, index) => {
                const qId = targetQueries[index].id;
                const isTarget = (item) => ['Revio', 'PromethION'].includes(item.pltfomNm || item.prfmPltfomNm);
                const isRevioOnly = (item) => (item.pltfomNm || item.prfmPltfomNm) === 'Revio';
                const isNot16s = (item) => item.libKitNm !== '[3.0] PacBio 16s full-length Library';

                let count;
                if (qId.includes('prep')) {
                    count = data.filter(i => isTarget(i) && isNot16s(i)).length;
                } else if (qId === 'status-run-wait') {
                    // RUN 대기는 ONT(PromethION) 제외, Revio만 카운트
                    count = data.filter(isRevioOnly).length;
                } else {
                    count = data.filter(isTarget).length;
                }

                currentCounts[qId] = count;

                const el = document.getElementById(qId);
                if (el) {
                    el.innerText = count;
                    el.style.color = getCountColor(count);
                    el.style.animation = 'none';
                    setTimeout(() => { el.style.animation = 'pulse 0.5s ease'; }, 10);
                }
            });

            const updateTime = new Date().getTime();
            GM_setValue(CACHE_KEY, currentCounts);
            GM_setValue(CACHE_TIME_KEY, updateTime);
            updateUITimestamp(updateTime);

        } catch (e) {
            console.error('Update Dashboard Error:', e);
        } finally {
            if (btn) { btn.style.opacity = '1'; btn.innerText = labelMap[type]; }
        }
    }

    function updateUITimestamp(timestamp) {
        const el = document.getElementById('status-update-time');
        if (!el || !timestamp) return;
        const d = new Date(timestamp);
        const formatted = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        el.innerText = `(${formatted} 기준)`;
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }`;
    document.head.appendChild(styleTag);

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { setTimeout(init, 200); }
})();
