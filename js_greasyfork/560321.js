// ==UserScript==
// @name         LIMS 수행기본정보 병목 수주 찾기
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  ORDER 내 LIB PRGR STAT 상태 혼재로 매출화 지연되는 병목 수주 찾기
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/report/retrievePerformBasicInfoForm.do*
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560321/LIMS%20%EC%88%98%ED%96%89%EA%B8%B0%EB%B3%B8%EC%A0%95%EB%B3%B4%20%EB%B3%91%EB%AA%A9%20%EC%88%98%EC%A3%BC%20%EC%B0%BE%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560321/LIMS%20%EC%88%98%ED%96%89%EA%B8%B0%EB%B3%B8%EC%A0%95%EB%B3%B4%20%EB%B3%91%EB%AA%A9%20%EC%88%98%EC%A3%BC%20%EC%B0%BE%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 스타일 정의
    const styles = `
        .bottleneck-btn {
            background-color: #ede9fe;
            color: #4834d4;
            border: 1px solid #4834d4;
            padding: 0 10px;
            height: 24px;
            line-height: 21px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            margin-left: 4px;
            transition: all 0.2s ease;
        }
        .bottleneck-btn:hover {
            background-color: #4834d4;
            color: #fff;
        }
        .bottleneck-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .bottleneck-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .bottleneck-modal-content {
            background: white;
            border-radius: 12px;
            width: 95%;
            max-width: 1400px;
            max-height: 92vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.3s ease-out;
        }
        .bottleneck-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
        .bottleneck-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .bottleneck-modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #999;
            line-height: 1;
        }
        .bottleneck-modal-close:hover {
            color: #333;
        }
        .bottleneck-form-group {
            margin-bottom: 16px;
        }
        .bottleneck-form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #555;
        }
        .bottleneck-form-group input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        .bottleneck-progress {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            border: 1px solid #eee;
        }
        .bottleneck-progress-bar {
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
        }
        .bottleneck-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4834d4, #686de0);
            transition: width 0.3s;
        }
        .bottleneck-result-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            table-layout: fixed;
        }
        .bottleneck-result-table th,
        .bottleneck-result-table td {
            padding: 15px 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
        }
        .bottleneck-result-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #555;
            border-bottom: 2px solid #eee;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .bottleneck-result-table tr:hover {
            background: #f8f9ff;
        }
        .stat-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-right: 4px;
            margin-bottom: 4px;
            border: 1px solid transparent;
        }
        .stat-badge-ready {
            background: #f0fdf4;
            color: #16a34a;
            border-color: #bcf0da;
        }
        .stat-badge-delayed {
            background: #fff7ed;
            color: #ea580c;
            border-color: #fed7aa;
        }
        .bottleneck-stat-blocked {
            color: #e74c3c;
            font-weight: 700;
        }
        .bottleneck-summary-container {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
        }
        .bottleneck-summary-box {
            flex: 1;
            background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .bottleneck-summary-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
        }
        .bottleneck-summary-value {
            font-size: 36px;
            font-weight: 700;
            line-height: 1;
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;

    function injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}${m}${d}`;
    }

    function formatExpcMems(val) {
        if (!val || val.length !== 6) return val || '';
        return `${val.substring(0, 4)}-${val.substring(4, 6)}`;
    }

    function parseDate(str) {
        const parts = str.split('-');
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }

    function splitDateRange(startDate, endDate, intervalDays) {
        const ranges = [];
        let current = new Date(startDate);
        while (current < endDate) {
            const rangeEnd = new Date(current);
            rangeEnd.setDate(rangeEnd.getDate() + intervalDays - 1);
            if (rangeEnd > endDate) rangeEnd.setTime(endDate.getTime());
            ranges.push({ from: formatDate(current), to: formatDate(rangeEnd) });
            current.setDate(current.getDate() + intervalDays);
        }
        return ranges;
    }

    function fetchData(fromDate, toDate) {
        return new Promise((resolve, reject) => {
            const form = document.getElementById('performBasicForm');
            if (!form) return reject(new Error('Form not found'));

            const originalFrom = document.getElementById('searchRgsnFrom').value;
            const originalTo = document.getElementById('searchRgsnTo').value;
            const originalStatus = document.getElementById('searchOrdPrgrStatCd').value;

            const alertHooks = [];
            [window, window.parent, window.top].forEach(win => {
                try {
                    const old = win.alert;
                    win.alert = () => { console.log('LIMS Alert blocked'); };
                    alertHooks.push({ win, old });
                } catch (e) { }
            });

            const fromInput = document.getElementById('searchRgsnFrom');
            const toInput = document.getElementById('searchRgsnTo');
            const statusInput = document.getElementById('searchOrdPrgrStatCd');
            const nFrom = fromDate.substring(0, 4) + '-' + fromDate.substring(4, 6) + '-' + fromDate.substring(6, 8);
            const nTo = toDate.substring(0, 4) + '-' + toDate.substring(4, 6) + '-' + toDate.substring(6, 8);

            if (nFrom > toInput.value) { toInput.value = nTo; fromInput.value = nFrom; }
            else { fromInput.value = nFrom; toInput.value = nTo; }
            statusInput.value = '';

            if (typeof CommonAjax !== 'undefined') {
                new CommonAjax('/ngs/report/retrievePerformBasicList.do')
                    .addParam(form)
                    .callback(function (res) {
                        fromInput.value = originalFrom; toInput.value = originalTo; statusInput.value = originalStatus;
                        alertHooks.forEach(h => h.win.alert = h.old);
                        if (res && res.result) resolve({ exceeded: res.result.length >= 40000, data: res.result });
                        else resolve({ exceeded: false, data: [] });
                    })
                    .execute();
            } else {
                alertHooks.forEach(h => h.win.alert = h.old);
                reject(new Error('CommonAjax not found'));
            }
        });
    }

    async function fetchDataForPeriod(startDate, endDate, updateProgress) {
        let allData = [];
        const ranges14 = splitDateRange(startDate, endDate, 14);
        let exceeded = false;
        for (let i = 0; i < ranges14.length; i++) {
            const r = ranges14[i];
            updateProgress(i, ranges14.length, `[14일 단위] ${r.from} ~ ${r.to} (${i + 1}/${ranges14.length})`);
            const res = await fetchData(r.from, r.to);
            if (res.exceeded) { exceeded = true; break; }
            if (res.data) allData = allData.concat(res.data);
            await new Promise(r => setTimeout(r, 350));
        }
        if (exceeded) {
            allData = [];
            const ranges7 = splitDateRange(startDate, endDate, 7);
            for (let i = 0; i < ranges7.length; i++) {
                const r = ranges7[i];
                updateProgress(i, ranges7.length, `⚠ 초과 발생! [7일 단위 재수집] ${r.from} ~ ${r.to}`);
                const res = await fetchData(r.from, r.to);
                if (res.data) allData = allData.concat(res.data);
                await new Promise(r => setTimeout(r, 350));
            }
        }
        return allData;
    }

    function analyzeBottlenecks(data) {
        const orderMap = {};
        data.forEach(row => {
            const ordNo = row.ordNo;
            if (!ordNo) return;
            if (!orderMap[ordNo]) {
                orderMap[ordNo] = {
                    ordNo, samples: [], expcMems: formatExpcMems(row.expcMems),
                    ordPrgrStatNm: row.ordPrgrStatNm || '', custNm: row.custNm || '',
                    actPlatfNm: row.pltfomNm || row.prfmPltfomNm || ''
                };
            }
            orderMap[ordNo].samples.push({ libPrgrStatNm: row.libPrgrStatNm || '' });
        });

        const bottlenecks = [];
        const readyStats = ['Analysis 대기', 'Analysis 생성'];
        Object.values(orderMap).forEach(order => {
            if (order.ordPrgrStatNm.toLowerCase().includes('compl')) return;
            let hasReady = false, hasDelayed = false;
            const statCounts = {};
            order.samples.forEach(s => {
                const st = s.libPrgrStatNm;
                statCounts[st] = (statCounts[st] || 0) + 1;
                if (readyStats.some(t => st.includes(t)) && !st.includes('보류')) hasReady = true;
                else if (st && st.trim() !== '') hasDelayed = true;
            });
            if (hasReady && hasDelayed) {
                const bCount = order.samples.filter(s => {
                    const st = s.libPrgrStatNm;
                    const isReady = readyStats.some(t => st.includes(t)) && !st.includes('보류');
                    return !isReady && st.trim() !== '';
                }).length;
                bottlenecks.push({ ...order, statCounts, blockedCount: bCount, totalSamples: order.samples.length });
            }
        });
        return bottlenecks;
    }

    function showResults(bottlenecks) {
        const modal = document.createElement('div');
        modal.className = 'bottleneck-modal';
        const content = document.createElement('div');
        content.className = 'bottleneck-modal-content';
        modal.appendChild(content);

        const totalDelayed = bottlenecks.reduce((sum, b) => sum + b.blockedCount, 0);
        const readyStats = ['Analysis 대기', 'Analysis 생성'];

        const tableRows = bottlenecks.map(b => {
            const sorted = Object.entries(b.statCounts).sort((a, b) => {
                const aR = readyStats.some(s => a[0].includes(s)) && !a[0].includes('보류');
                const bR = readyStats.some(s => b[0].includes(s)) && !b[0].includes('보류');
                if (aR && !bR) return -1; if (!aR && bR) return 1; return a[0].localeCompare(b[0]);
            });
            const statStr = sorted.map(([k, v]) => {
                const isR = readyStats.some(s => k.includes(s)) && !k.includes('보류');
                return `<span class="stat-badge ${isR ? 'stat-badge-ready' : 'stat-badge-delayed'}">${k}: ${v}</span>`;
            }).join('');

            return `
                <tr>
                    <td style="font-weight:700;color:#4834d4;text-align:center">${b.ordNo}</td>
                    <td title="${b.custNm}" style="text-align:center">${b.custNm}</td>
                    <td style="text-align:center">${b.actPlatfNm}</td>
                    <td style="text-align:center">${b.expcMems}</td>
                    <td style="text-align:center">${b.ordPrgrStatNm}</td>
                    <td style="text-align:right;font-weight:600">${b.totalSamples}</td>
                    <td class="bottleneck-stat-blocked" style="text-align:right;font-size:15px">${b.blockedCount}</td>
                    <td style="white-space:normal; line-height:1.6; padding:12px">${statStr}</td>
                </tr>
            `;
        }).join('');

        content.innerHTML = `
            <div style="padding: 30px 30px 10px 30px;">
                <div class="bottleneck-modal-header">
                    <div class="bottleneck-modal-title">🔍 병목 수주 분석 결과</div>
                    <button class="bottleneck-modal-close" id="closeResults">&times;</button>
                </div>
                <div class="bottleneck-summary-container">
                    <div class="bottleneck-summary-box">
                        <div class="bottleneck-summary-label">병목 수주 수</div>
                        <div class="bottleneck-summary-value">${bottlenecks.length}</div>
                    </div>
                    <div class="bottleneck-summary-box" style="background: linear-gradient(135deg, #cb4335, #922b21);">
                        <div class="bottleneck-summary-label">지연 샘플 수</div>
                        <div class="bottleneck-summary-value">${totalDelayed}</div>
                    </div>
                </div>
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <button class="bottleneck-btn" id="downloadExcel" style="height:32px; padding:0 20px">📥 Excel 다운로드</button>
                    <span style="font-size: 12px; color: #666;">* 마우스를 올리면 전체 내용을 볼 수 있습니다.</span>
                </div>
            </div>
                <div style="flex: 1; overflow-y: auto; padding: 0 30px 30px 30px; position: relative;">
                    ${bottlenecks.length > 0 ? `
                        <table class="bottleneck-result-table">
                            <colgroup>
                                <col style="width: 120px;"> <!-- ORDER# -->
                                <col style="width: 250px;"> <!-- CUSTOMER -->
                                <col style="width: 120px;"> <!-- ACT PLATF -->
                                <col style="width: 100px;"> <!-- 매출월 -->
                                <col style="width: 100px;"> <!-- 상태 -->
                                <col style="width: 75px;">  <!-- 총샘플 -->
                                <col style="width: 75px;">  <!-- 지연 -->
                                <col style="width: 440px;"> <!-- 분포 -->
                            </colgroup>
                            <thead>
                                <tr>
                                    <th style="text-align:center">ORDER#</th>
                                    <th style="text-align:center">CUSTOMER</th>
                                    <th style="text-align:center">ACT PLATF</th>
                                    <th style="text-align:center">매출월</th>
                                    <th style="text-align:center">상태</th>
                                    <th style="text-align:right">총샘플</th>
                                    <th style="text-align:right">지연</th>
                                    <th style="padding-left:15px">LIB PRGR STAT 분포</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    ` : '<p style="text-align:center;padding:50px 0;color:#666;">병목 수주가 없습니다! 🎉</p>'}
                </div>
            `;
        document.body.appendChild(modal);

        modal.querySelector('#closeResults').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelector('#downloadExcel')?.addEventListener('click', async () => {
            const btn = modal.querySelector('#downloadExcel');
            btn.disabled = true; btn.textContent = '생성 중...';
            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('병목 수주');
                worksheet.columns = [
                    { header: 'ORDER#', key: 'ordNo', width: 14 },
                    { header: 'CUSTOMER', key: 'custNm', width: 25 },
                    { header: 'ACT PLATF', key: 'actPlatfNm', width: 15 },
                    { header: '예상매출월', key: 'expcMems', width: 12 },
                    { header: '수주상태', key: 'ordPrgrStatNm', width: 12 },
                    { header: '총샘플수', key: 'totalSamples', width: 10 },
                    { header: '지연샘플수', key: 'blockedCount', width: 12 },
                    { header: '분포', key: 'statStr', width: 50 }
                ];
                bottlenecks.forEach(b => {
                    const sorted = Object.entries(b.statCounts).sort((a, b) => {
                        const aR = readyStats.some(s => a[0].includes(s)) && !a[0].includes('보류');
                        const bR = readyStats.some(s => b[0].includes(s)) && !b[0].includes('보류');
                        if (aR && !bR) return -1; if (!aR && bR) return 1; return a[0].localeCompare(b[0]);
                    });
                    const statStr = sorted.map(([k, v]) => `${k}: ${v}`).join('; ');
                    worksheet.addRow({ ...b, statStr });
                });
                const header = worksheet.getRow(1);
                header.font = { bold: true };
                header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
                header.alignment = { horizontal: 'center' };
                header.eachCell(c => c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } });
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `bottleneck_${formatDate(new Date())}.xlsx`;
                a.click(); URL.revokeObjectURL(url);
                btn.textContent = '📥 Excel 다운로드'; btn.disabled = false;
            } catch (err) { alert('Excel 생성 실패'); btn.textContent = '📥 Excel 다운로드'; btn.disabled = false; }
        });
    }

    function showInputModal() {
        const modal = document.createElement('div');
        modal.className = 'bottleneck-modal';
        const today = new Date(), thirtyAgo = new Date(); thirtyAgo.setDate(today.getDate() - 30);

        modal.innerHTML = `
            <div class="bottleneck-modal-content" style="max-width:500px; padding:30px">
                <div class="bottleneck-modal-header">
                    <div class="bottleneck-modal-title">🔍 병목 수주 찾기</div>
                    <button class="bottleneck-modal-close" id="closeInput">&times;</button>
                </div>
                <div class="bottleneck-form-group">
                    <label>시작일</label><input type="date" id="fromDate" value="${thirtyAgo.toISOString().split('T')[0]}">
                </div>
                <div class="bottleneck-form-group">
                    <label>종료일</label><input type="date" id="toDate" value="${today.toISOString().split('T')[0]}">
                </div>
                <p style="font-size:13px;color:#666;margin-bottom:16px">
                    ℹ️ 14일 간격으로 조회합니다. 40,000건 초과 시 7일 간격으로 자동 재시도합니다.
                </p>
                <div id="progressArea" class="bottleneck-progress" style="display:none">
                    <div id="progressText" style="font-size:13px; margin-bottom:5px">대기 중...</div>
                    <div class="bottleneck-progress-bar"><div id="progressFill" class="bottleneck-progress-fill" style="width:0%"></div></div>
                </div>
                <div style="text-align:right; margin-top:20px">
                    <button class="bottleneck-btn" id="startBtn" style="height:36px; padding:0 24px">분석 시작</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#closeInput').onclick = () => modal.remove();
        const fInput = modal.querySelector('#fromDate'), tInput = modal.querySelector('#toDate');
        fInput.onchange = () => { if (fInput.value > tInput.value) tInput.value = fInput.value; };
        tInput.onchange = () => { if (tInput.value < fInput.value) fInput.value = tInput.value; };

        modal.querySelector('#startBtn').onclick = async () => {
            const fDate = parseDate(fInput.value), tDate = parseDate(tInput.value);
            const btn = modal.querySelector('#startBtn');
            btn.disabled = true; btn.textContent = '진행 중...';
            const pArea = modal.querySelector('#progressArea'), pText = modal.querySelector('#progressText'), pFill = modal.querySelector('#progressFill');
            pArea.style.display = 'block';

            try {
                const data = await fetchDataForPeriod(fDate, tDate, (curr, tot, msg) => {
                    pText.textContent = msg; pFill.style.width = `${Math.round((curr / tot) * 100)}%`;
                });
                const res = analyzeBottlenecks(data);
                modal.remove();
                showResults(res);
            } catch (err) { alert('에러: ' + err.message); btn.disabled = false; btn.textContent = '분석 시작'; }
        };
    }

    function createUI() {
        if (document.getElementById('bottleneckBtn')) return;
        const target = document.querySelector('#btnSearch, .btn_search, [onclick*="fnSearch"]') ||
            document.querySelector('.btn-primary') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Search'));
        if (target) {
            const btn = document.createElement('button');
            btn.id = 'bottleneckBtn'; btn.type = 'button'; btn.className = 'bottleneck-btn';
            btn.textContent = '🔍 병목 수주 찾기';
            btn.onclick = showInputModal;
            target.parentNode.insertBefore(btn, target.nextSibling);
        }
    }

    injectStyles();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
    else setTimeout(createUI, 1200);
})();
