// ==UserScript==
// @name         LIMS 메인 대시보드 - META 수행팀
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  META 수행팀 전용 (Metagenome Amplicon / MiSeq) 실시간 작업 현황
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      lims3.macrogen.com
// @downloadURL https://update.greasyfork.org/scripts/560850/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20META%20%EC%88%98%ED%96%89%ED%8C%80.user.js
// @updateURL https://update.greasyfork.org/scripts/560850/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20META%20%EC%88%98%ED%96%89%ED%8C%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_KEY = 'META_STATUS_CACHE';
    const CACHE_TIME_KEY = 'META_STATUS_CACHE_TIME';

    // 스타일 설정 (Soft Tint: 배경 #efefff, 글자 #4834d4, 보더 #4834d4)
    const THEME = {
        bg: '#efefff',
        text: '#4834d4',
        border: '#4834d4',
        label: '#6366f1',
        muted: '#94a3b8'
    };

    function getCsrfInfo() {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const header = document.querySelector('meta[name="_csrf_header"]')?.content;
        return { token, header };
    }

    function getCountColor(count) {
        if (count === 0 || count === '0' || count === '--' || !count) return '#cbd5e1';
        return THEME.text;
    }

    async function init() {
        initStatusSection();

        const cachedCounts = GM_getValue(CACHE_KEY);
        const cachedTime = GM_getValue(CACHE_TIME_KEY);

        if (cachedCounts) {
            updateUITimestamp(cachedTime);
            updateUI(cachedCounts);
        }
    }

    function initStatusSection() {
        // 기존 환율 섹션(exchange)을 찾아서 변형
        const exchangeBox = document.querySelector('.object-wrap.exchange');
        if (!exchangeBox) return;

        const isrBox = document.querySelector('.object-wrap.isr');
        const targetHeight = isrBox ? isrBox.offsetHeight : 135;

        exchangeBox.style.height = targetHeight + 'px';
        exchangeBox.style.minHeight = targetHeight + 'px';
        exchangeBox.style.padding = '12px 10px';
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
                    <span style="font-weight: 700; font-size: 13px; color: #333; flex-shrink: 0;">🧬 META 실시간</span>
                    <span id="meta-update-time" style="font-size: 10px; color: ${THEME.muted}; font-weight: normal; margin-right: auto;">(대기 중)</span>
                    <span id="meta-refresh-pq-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 5px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Prep/QC 갱신">P/Q</span>
                    <span id="meta-refresh-lr-btn" style="cursor: pointer; font-size: 10px; color: #64748b; padding: 2px 5px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 400; transition: 0.2s;" title="Lib/Run 갱신">L/R</span>
                    <span id="meta-refresh-all-btn" style="cursor: pointer; font-size: 10px; color: ${THEME.text}; padding: 2px 5px; background: ${THEME.bg}; border-radius: 4px; border: 1px solid ${THEME.border}; font-weight: 600; transition: 0.2s;" title="전체 갱신">ALL</span>
                </div>
            `;
            document.getElementById('meta-refresh-pq-btn').onclick = () => updateStatusDashboard('prep-qc');
            document.getElementById('meta-refresh-lr-btn').onclick = () => updateStatusDashboard('lib-run');
            document.getElementById('meta-refresh-all-btn').onclick = () => updateStatusDashboard('all');
        }

        const subEl = exchangeBox.querySelector('.object-text-sub');
        if (subEl) subEl.style.display = 'none';

        const listContainer = exchangeBox.querySelector('.object-exchange-ul');
        if (listContainer) {
            // LIB를 주인공으로 (가로 길이 최적화)
            listContainer.style.cssText = 'display: grid; grid-template-columns: 0.5fr 0.5fr 2.1fr 0.4fr; gap: 4px; padding: 0; margin: 0; min-height: 68px;';

            const cellBaseStyle = `display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; height: 68px; box-sizing: border-box; position: relative; overflow: hidden;`;
            const rowStyle = 'display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 4px; height: 50%; box-sizing: border-box;';
            const labelStyle = `font-size: 8px; font-weight: 700; color: #64748b;`;
            const valueStyle = `font-size: 11px; font-weight: 950; color: #333;`;

            listContainer.innerHTML = `
                <!-- Sample QC -->
                <div class="stat-cell" style="${cellBaseStyle}" title="QC 대기">
                    <div style="${rowStyle} border-bottom: 1px dashed #f1f5f9;">
                        <span style="${labelStyle}">QC D</span>
                        <span id="meta-qc-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">QC R</span>
                        <span id="meta-qc-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <!-- Prep -->
                <div class="stat-cell" style="${cellBaseStyle}" title="Prep 대기">
                    <div style="${rowStyle} border-bottom: 1px dashed #f1f5f9;">
                        <span style="${labelStyle}">Prp D</span>
                        <span id="meta-prep-dna" style="${valueStyle}">--</span>
                    </div>
                    <div style="${rowStyle}">
                        <span style="${labelStyle}">Prp R</span>
                        <span id="meta-prep-rna" style="${valueStyle}">--</span>
                    </div>
                </div>
                <!-- LIB (시원시원한 3열 레이아웃 - 가로 폭 최적화) -->
                <div class="stat-cell" style="${cellBaseStyle} padding: 4px 8px; justify-content: space-between; align-items: stretch;" id="meta-cell-lib">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${THEME.bg}; padding-bottom: 2px;">
                        <span style="font-size: 10px; font-weight: 950; color: ${THEME.text}; letter-spacing: -0.5px;">LIB 대기 상세 (ADL)</span>
                        <span id="meta-lib-total" style="font-size: 15px; font-weight: 950; color: ${THEME.text};">--</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px 8px; margin-top: 2px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">16S:</span><span id="meta-lib-16s" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">ITS:</span><span id="meta-lib-its" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">Cust:</span><span id="meta-lib-custom" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">1st:</span><span id="meta-lib-1st" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">Etc:</span><span id="meta-lib-etc" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 8.5px; font-weight: 800; color: #64748b;">LQC:</span><span id="meta-lib-lqc" style="font-size: 11px; font-weight: 950; color: #333;">--</span></div>
                    </div>
                </div>
                <!-- RUN (MiSeq) -->
                <div class="stat-cell" style="${cellBaseStyle}; cursor: pointer;" title="MiSeq Run 대기" onclick="window.openMetaModal()">
                    <span style="${labelStyle} margin-bottom: 2px;">MiSeq</span>
                    <span id="meta-run-wait" style="font-size: 14px; font-weight: 950; color: #333;">--</span>
                </div>
            `;

            // 셀들에 클릭 이벤트 추가 (이벤트 전파 고려하여 처리)
            listContainer.querySelectorAll('.stat-cell').forEach(cell => {
                cell.style.cursor = 'pointer';
                cell.onclick = () => window.openMetaModal();
            });
        }
    }

    function initModal() {
        if (document.getElementById('meta-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'meta-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center;
            z-index: 10000; backdrop-filter: blur(4px); transition: 0.3s;
        `;

        const modal = document.createElement('div');
        modal.id = 'meta-modal-content';
        modal.style.cssText = `
            background: #fff; padding: 30px; border-radius: 20px; width: 800px; max-width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s;
            position: relative; border: 4px solid ${THEME.bg};
        `;

        modal.innerHTML = `
            <div id="meta-modal-close" style="position: absolute; top: 20px; right: 20px; cursor: pointer; font-size: 24px; color: #94a3b8; z-index: 10001; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;" onclick="event.stopPropagation(); window.closeMetaModal()">✕</div>
            <h2 style="margin: 0 0 25px 0; color: #333; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                🧬 META 실시간 상세 현황
                <span id="modal-update-time" style="font-size: 13px; color: #94a3b8; font-weight: normal;"></span>
            </h2>

            <!-- (1) LIB 상세 - 주인공 (최상단) -->
            <div style="background: ${THEME.bg}; padding: 25px; border-radius: 20px; border: 2px solid ${THEME.border}; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(72, 52, 212, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 3px solid #fff; padding-bottom: 12px;">
                    <span style="font-size: 22px; font-weight: 950; color: ${THEME.text};">LIB 대기 전 수량 (ADL)</span>
                    <span id="modal-lib-total" style="font-size: 48px; font-weight: 950; color: ${THEME.text};">--</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px;">
                    <div class="modal-sub-card"><span style="font-size: 14px;">16S</span><b id="modal-lib-16s" style="font-size: 28px;">--</b></div>
                    <div class="modal-sub-card"><span style="font-size: 14px;">ITS</span><b id="modal-lib-its" style="font-size: 28px;">--</b></div>
                    <div class="modal-sub-card"><span style="font-size: 14px;">Custom</span><b id="modal-lib-custom" style="font-size: 28px;">--</b></div>
                    <div class="modal-sub-card"><span style="font-size: 14px;">1st PCR</span><b id="modal-lib-1st" style="font-size: 28px;">--</b></div>
                    <div class="modal-sub-card"><span style="font-size: 14px;">Etc</span><b id="modal-lib-etc" style="font-size: 28px;">--</b></div>
                    <div class="modal-sub-card"><span style="font-size: 14px;">LQC</span><b id="modal-lib-lqc" style="font-size: 28px;">--</b></div>
                </div>
            </div>

            <!-- (2) 하단 서브 정보 (QC/Prep & MiSeq) -->
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="modal-card">
                        <div class="modal-card-label">QC DNA</div>
                        <div id="modal-qc-dna" class="modal-card-value">--</div>
                    </div>
                    <div class="modal-card">
                        <div class="modal-card-label">QC RNA</div>
                        <div id="modal-qc-rna" class="modal-card-value">--</div>
                    </div>
                    <div class="modal-card">
                        <div class="modal-card-label">Prep DNA</div>
                        <div id="modal-prep-dna" class="modal-card-value">--</div>
                    </div>
                    <div class="modal-card">
                        <div class="modal-card-label">Prep RNA</div>
                        <div id="modal-prep-rna" class="modal-card-value">--</div>
                    </div>
                </div>

                <div class="modal-card" style="justify-content: center; background: #fff; border: 2px solid #e2e8f0; padding: 20px;">
                    <div class="modal-card-label" style="font-size: 16px; margin-bottom: 10px;">MiSeq Run 대기</div>
                    <div id="modal-run-wait" class="modal-card-value" style="font-size: 56px; line-height: 1;">--</div>
                </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button id="modal-refresh-btn" style="padding: 12px 60px; background: ${THEME.text}; color: #fff; border: none; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 15px rgba(72, 52, 212, 0.3);">지금 즉시 새로고침</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 함수 전역 등록 (HTML onclick 및 외부 접근용)
        window.updateMetaStatus = (type) => updateStatusDashboard(type);
        window.closeMetaModal = () => {
            modal.style.transform = 'translateY(20px)';
            modal.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 200);
        };

        // 이벤트 리스너 등록
        const refreshBtn = document.getElementById('modal-refresh-btn');
        if (refreshBtn) refreshBtn.onclick = () => window.updateMetaStatus('all');

        const closeBtn = document.getElementById('meta-modal-close');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.closeMetaModal();
            };
            closeBtn.onmouseover = () => { closeBtn.style.color = THEME.text; };
            closeBtn.onmouseout = () => { closeBtn.style.color = '#94a3b8'; };
        }

        overlay.onclick = (e) => { if (e.target === overlay) window.closeMetaModal(); };

        window.openMetaModal = () => {
            overlay.style.display = 'flex';
            setTimeout(() => { modal.style.transform = 'translateY(0)'; modal.style.opacity = '1'; }, 10);
            syncModalData();
        };
    }

    function syncModalData() {
        const ids = [
            'meta-qc-dna', 'meta-qc-rna', 'meta-prep-dna', 'meta-prep-rna', 'meta-run-wait',
            'meta-lib-total', 'meta-lib-16s', 'meta-lib-its', 'meta-lib-custom', 'meta-lib-1st', 'meta-lib-lqc', 'meta-lib-etc'
        ];
        ids.forEach(id => {
            const source = document.getElementById(id);
            const target = document.getElementById(id.replace('meta-', 'modal-'));
            if (source && target) {
                target.innerText = source.innerText;
                if (!id.includes('lib-')) { // 전체 토탈류만 색상 적용
                    target.style.color = source.style.color;
                }
            }
        });
        const timeSource = document.getElementById('meta-update-time');
        const timeTarget = document.getElementById('modal-update-time');
        if (timeSource && timeTarget) timeTarget.innerText = timeSource.innerText;
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
                    try {
                        const data = JSON.parse(res.responseText);
                        resolve(data.waits || data.result || data.amplificationList || []);
                    }
                    catch (e) { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

    async function updateStatusDashboard(type = 'all') {
        const btnIdMap = { 'prep-qc': 'meta-refresh-pq-btn', 'lib-run': 'meta-refresh-lr-btn', 'all': 'meta-refresh-all-btn' };
        const labelMap = { 'prep-qc': 'P/Q', 'lib-run': 'L/R', 'all': 'ALL' };

        const btn = document.getElementById(btnIdMap[type]);
        const modalBtn = document.getElementById('modal-refresh-btn');

        if (btn) {
            btn.style.opacity = '0.7';
            btn.innerText = `⏳ 갱신 중`;
        }
        if (modalBtn) {
            modalBtn.disabled = true;
            modalBtn.style.opacity = '0.6';
            modalBtn.innerText = '⏳ 데이터 갱신 중...';
        }

        // 시각적 피드백: 수치들을 먼저 '...'으로 초기화
        const groupIds = {
            'prep-qc': ['meta-qc-dna', 'meta-qc-rna', 'meta-prep-dna', 'meta-prep-rna'],
            'lib-run': ['meta-run-wait', 'meta-lib-total', 'meta-lib-16s', 'meta-lib-its', 'meta-lib-custom', 'meta-lib-1st', 'meta-lib-lqc', 'meta-lib-etc'],
            'all': ['meta-qc-dna', 'meta-qc-rna', 'meta-prep-dna', 'meta-prep-rna', 'meta-run-wait', 'meta-lib-total', 'meta-lib-16s', 'meta-lib-its', 'meta-lib-custom', 'meta-lib-1st', 'meta-lib-lqc', 'meta-lib-etc']
        };
        const clearIds = groupIds[type] || [];
        clearIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '...';
        });
        if (document.getElementById('meta-modal-overlay')?.style.display === 'flex') {
            syncModalData();
        }

        try {
            const allQueries = [
                // Sample QC (tabIndex 0, 1)
                { id: 'meta-qc-dna', group: 'prep-qc', type: 'sample', url: "https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", payload: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "0" }] } } },
                { id: 'meta-qc-rna', group: 'prep-qc', type: 'sample', url: "https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", payload: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "D" }, { "name": "tabIndex", "value": "1" }] } } },
                // Prep (tabIndex 2, 3)
                { id: 'meta-prep-dna', group: 'prep-qc', type: 'prep-d', url: "https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", payload: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "D" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "2" }] } } },
                { id: 'meta-prep-rna', group: 'prep-qc', type: 'prep-r', url: "https://lims3.macrogen.com/ngs/sample/retrieveWaits.do", payload: { "dataSet": { "frmWait": [{ "name": "searchGeneTypeCd", "value": "R" }, { "name": "searchSmplStatCd", "value": "T" }, { "name": "tabIndex", "value": "3" }] } } },
                // LIB (ADL)
                { id: 'meta-lib', group: 'lib-run', type: 'lib', url: "https://lims3.macrogen.com/ngs/library/retrieveWaits.do", payload: { "dataSet": { "frmWait": [{ "name": "searchLibTypeCd", "value": "ADL" }, { "name": "menuCd", "value": "NGS120100" }] } } },
                // Run (MiSeq)
                { id: 'meta-run-wait', group: 'lib-run', type: 'run', url: "https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationList.do", payload: { "dataSet": { "amplificationForm": [{ "name": "workType", "value": "" }, { "name": "amplificationType", "value": "MI" }, { "name": "searchBeginDate_text", "value": "" }, { "name": "searchBeginDate", "value": "" }, { "name": "searchEndDate_text", "value": "" }, { "name": "searchEndDate", "value": "" }, { "name": "searchPltfomCd", "value": "" }, { "name": "searchRunCaleSn", "value": "" }, { "name": "searchBasiSrchCd", "value": "" }, { "name": "searchKeyword", "value": "" }, { "name": "libPrgrStatChgRsn", "value": "" }, { "name": "menuCd", "value": "NGS150200" }] } } }
            ];

            const targetQueries = type === 'all' ? allQueries : allQueries.filter(q => q.group === type);
            const results = await Promise.all(targetQueries.map(q => fetchLimsData(q.url, q.payload)));
            const currentCounts = GM_getValue(CACHE_KEY) || {};

            targetQueries.forEach((query, index) => {
                const data = results[index];

                if (query.type === 'sample' || query.type === 'prep-r') {
                    // Metagenome Amplicon 카운트 (플랫폼 무시)
                    currentCounts[query.id] = data.filter(i => (i.libKitNm || '').includes('Metagenome Amplicon')).length;
                }
                else if (query.type === 'prep-d') {
                    // DNA Prep: Metagenome Amplicon + PacBio 16s
                    currentCounts[query.id] = data.filter(i =>
                        (i.libKitNm || '').includes('Metagenome Amplicon') ||
                        (i.libKitNm || '') === '[3.0] PacBio 16s full-length Library'
                    ).length;
                }
                else if (query.type === 'lib') {
                    // LIB 상세 카운팅 (prmrNm 기준, smplStatNm 'Lib.'는 LQC로 별도 처리)
                    const stats = { total: data.length, v3v4: 0, its: 0, custom: 0, first: 0, lqc: 0, etc: 0 };
                    data.forEach(item => {
                        const status = item.smplStatNm || '';
                        const name = item.prmrNm || '';

                        if (status === 'Lib.') {
                            stats.lqc++;
                        } else {
                            if (name.includes('16S V3-V4')) stats.v3v4++;
                            else if (name.includes('ITS')) stats.its++;
                            else if (name.includes('Custom Primer')) stats.custom++;
                            else if (name.includes('1st PCR primer')) stats.first++;
                            else stats.etc++;
                        }
                    });
                    currentCounts['meta-lib-total'] = stats.total;
                    currentCounts['meta-lib-16s'] = stats.v3v4;
                    currentCounts['meta-lib-its'] = stats.its;
                    currentCounts['meta-lib-custom'] = stats.custom;
                    currentCounts['meta-lib-1st'] = stats.first;
                    currentCounts['meta-lib-lqc'] = stats.lqc;
                    currentCounts['meta-lib-etc'] = stats.etc;
                }
                else if (query.type === 'run') {
                    // MiSeq 정확히 일치 건수 (prfmPltfomNm) - trim() 추가 및 대소문자 확인
                    currentCounts[query.id] = data.filter(i => {
                        const plat = (i.prfmPltfomNm || '').trim();
                        return plat === 'MiSeq' || plat === 'MISEQ';
                    }).length;

                    if (currentCounts[query.id] === 0 && data.length > 0) {
                        console.log('MiSeq 데이터는 존재하나 필터링 안됨. 첫 데이터 예시:', data[0]);
                    }
                }
            });

            const updateTime = new Date().getTime();
            GM_setValue(CACHE_KEY, currentCounts);
            GM_setValue(CACHE_TIME_KEY, updateTime);
            updateUITimestamp(updateTime);
            updateUI(currentCounts);

        } catch (e) {
            console.error('Meta Dashboard Update Error:', e);
        } finally {
            if (btn) { btn.style.opacity = '1'; btn.innerText = labelMap[type]; }
            if (modalBtn) {
                modalBtn.disabled = false;
                modalBtn.style.opacity = '1';
                modalBtn.innerText = '지금 즉시 새로고침';
            }
        }
    }

    function updateUI(counts) {
        Object.entries(counts).forEach(([id, count]) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = count;
                // 색상 적용 (수치가 있는 항목은 강조색)
                const activeIds = [
                    'meta-lib-total', 'meta-run-wait', 'meta-qc-dna', 'meta-qc-rna', 'meta-prep-dna', 'meta-prep-rna',
                    'meta-lib-16s', 'meta-lib-its', 'meta-lib-custom', 'meta-lib-1st', 'meta-lib-lqc', 'meta-lib-etc'
                ];
                if (activeIds.includes(id)) {
                    el.style.color = getCountColor(count);
                }
            }
        });
        // 모달이 열려있다면 데이터 동기화
        if (document.getElementById('meta-modal-overlay')?.style.display === 'flex') {
            syncModalData();
        }
    }

    function updateUITimestamp(timestamp) {
        const el = document.getElementById('meta-update-time');
        if (!el || !timestamp) return;
        const d = new Date(timestamp);
        const formatted = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        el.innerText = `(${formatted} 기준)`;
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes metaPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .stat-cell:hover { border-color: ${THEME.border} !important; background: ${THEME.bg} !important; box-shadow: 0 4px 12px rgba(72, 52, 212, 0.1); }
        .modal-card { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; }
        .modal-card-label { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 5px; }
        .modal-card-value { font-size: 28px; font-weight: 950; color: #333; }
        .modal-sub-card { background: #fff; padding: 12px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .modal-sub-card span { font-size: 12px; font-weight: 800; color: #64748b; }
        .modal-sub-card b { font-size: 20px; font-weight: 950; color: ${THEME.text}; }
    `;
    document.head.appendChild(styleTag);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { init(); initModal(); });
    }
    else {
        setTimeout(() => { init(); initModal(); }, 300);
    }
})();
