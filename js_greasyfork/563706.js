// ==UserScript==
// @name         LIMS 메인 대시보드 - 업무 요청 현황 (팀 우선)
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  LIMS 메인 페이지에 팀별 미완료 업무 요청 리스트를 직관적으로 표시하며, 엑셀 복사 기능을 지원합니다. (팀 우선 버전)
// @author       김재형
// @match        https://lims3.macrogen.com/main.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      lims3.macrogen.com
// @downloadURL https://update.greasyfork.org/scripts/563706/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20%EC%97%85%EB%AC%B4%20%EC%9A%94%EC%B2%AD%20%ED%98%84%ED%99%A9%20%28%ED%8C%80%20%EC%9A%B0%EC%84%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563706/LIMS%20%EB%A9%94%EC%9D%B8%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%20-%20%EC%97%85%EB%AC%B4%20%EC%9A%94%EC%B2%AD%20%ED%98%84%ED%99%A9%20%28%ED%8C%80%20%EC%9A%B0%EC%84%A0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_DETAIL_URL = 'https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestDetailForm.do';
    const ORD_DETAIL_URL = 'https://lims3.macrogen.com/ngs/order/retrieveOrdSearchDetailForm.do';

    // 부서 마스터 데이터
    const DEPARTMENTS = [
        { id: '10244', name: 'NGS수행1부>기기운영팀' },
        { id: '10002', name: 'NGS수행2부>WGS수행팀' },
        { id: '10006', name: 'NGS수행2부>WTS수행팀' },
        { id: '10007', name: 'NGS수행2부>WES수행팀' },
        { id: '10150', name: 'NGS수행2부>Single Cell 수행팀' },
        { id: '10151', name: 'NGS수행2부>핵심공정팀' },
        { id: '10003', name: 'NGS수행3부>Meta수행팀' },
        { id: '10211', name: 'NGS수행3부>LRS수행팀' }
    ];

    // [설정] 사용자 정보 로딩
    let ME = GM_getValue('LRS_CONFIG', {
        name: '김재형',
        deptId: '10211',
        deptName: 'NGS수행3부>LRS수행팀'
    });

    let currentMode = 'team'; // 'team' | 'my' | 'instruct'
    const MEMORY_CACHE = { team: null, my: null, instruct: null }; // 메모리 캐시 저장소

    // 보안 토큰(CSRF) 추출 함수
    function getCsrfInfo() {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const header = document.querySelector('meta[name="_csrf_header"]')?.content;
        return { token, header };
    }

    async function init() {
        const isrBox = Array.from(document.querySelectorAll('.object-wrap')).find(el => el.innerText.includes('ISR'));
        const isrRow = isrBox?.closest('.flex-box');

        const customSection = createCustomSection();

        if (isrRow) {
            isrRow.after(customSection);
        } else {
            const noticeSection = document.querySelector('.object-wrap.notice') || document.querySelector('.object-notice-title')?.closest('.object-wrap');
            if (noticeSection) noticeSection.before(customSection);
        }

        // 이벤트 바인딩
        customSection.querySelector('#lrs-refresh-btn').onclick = () => fetchData(currentMode);
        customSection.querySelector('#lrs-team-btn').onclick = () => fetchData('team');
        customSection.querySelector('#lrs-my-btn').onclick = () => fetchData('my');
        customSection.querySelector('#lrs-instruct-btn').onclick = () => fetchData('instruct');
        customSection.querySelector('#lrs-setting-btn').onclick = toggleSettings;
        customSection.querySelector('#lrs-save-btn').onclick = saveSettings;
        customSection.querySelector('#lrs-copy-btn').onclick = copyToExcel;
        customSection.querySelector('#lrs-copy-ordno-btn').onclick = copyOrderNumbersOnly;
        customSection.querySelector('#lrs-multi-search-btn').onclick = toggleMultiSearchPanel;
        customSection.querySelector('#lrs-multi-search-open-btn').onclick = openMultipleOrders;

        await fetchData('team');
    }

    // 커스텀 섹션 구조 생성
    function createCustomSection() {
        if (document.getElementById('custom-lrs-work-section')) return document.getElementById('custom-lrs-work-section');

        const section = document.createElement('div');
        section.id = 'custom-lrs-work-section';
        section.className = 'flex-box';
        section.style.cssText = 'margin: 15px 0; width: 100%; display: flex; position: relative;';

        const deptOptions = DEPARTMENTS.map(d => `<option value="${d.id}" ${d.id === ME.deptId ? 'selected' : ''}>${d.name}</option>`).join('');

        section.innerHTML = `
            <div class="object-wrap" style="width: 100%; background: #fff; border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); font-family: 'Inter', 'Noto Sans KR', sans-serif;">
                <div style="padding: 12px 20px; background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <h3 id="lrs-title" style="margin: 0; font-size: 15px; color: #fff; font-weight: 700; min-width: 250px; white-space: nowrap;">📂 업무 요청 현황</h3>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div id="lrs-mode-toggle" style="display: flex; background: rgba(0,0,0,0.2); padding: 2px; border-radius: 8px; gap: 2px;">
                                <span id="lrs-team-btn" class="lrs-mode-btn active" style="cursor: pointer; font-size: 11px; color: #fff; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 6px; transition: 0.2s; font-weight: 600; display: flex; align-items: center; gap: 4px;">🏢 팀</span>
                                <span id="lrs-my-btn" class="lrs-mode-btn" style="cursor: pointer; font-size: 11px; color: rgba(255,255,255,0.6); padding: 4px 10px; border-radius: 6px; transition: 0.2s; font-weight: 600; display: flex; align-items: center; gap: 4px;">📑 내 요청</span>
                                <span id="lrs-instruct-btn" class="lrs-mode-btn" style="cursor: pointer; font-size: 11px; color: rgba(255,255,255,0.6); padding: 4px 10px; border-radius: 6px; transition: 0.2s; font-weight: 600; display: flex; align-items: center; gap: 4px;">📋 지시</span>
                            </div>
                            <div id="lrs-refresh-group" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden;">
                                <span id="lrs-refresh-btn" class="lrs-control-btn" style="cursor: pointer; font-size: 11px; color: #fff; padding: 4px 10px; transition: 0.2s; border-right: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 4px;">🔄 새로고침</span>
                                <span id="lrs-data-count" style="font-size: 11px; color: rgba(255,255,255,0.9); padding: 4px 8px; font-weight: 700; min-width: 35px; text-align: center;"></span>
                            </div>
                            <div id="lrs-copy-group" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; margin-left: 8px;">
                                <span id="lrs-copy-btn" class="lrs-control-btn" style="cursor: pointer; font-size: 11px; color: #fff; padding: 4px 10px; transition: 0.2s; border-right: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 4px;">📋 엑셀 복사</span>
                                <span id="lrs-copy-ordno-btn" class="lrs-control-btn" style="cursor: pointer; font-size: 11px; color: #fff; padding: 4px 10px; transition: 0.2s; display: flex; align-items: center; gap: 4px;">📋 수주번호만</span>
                            </div>
                            <div id="lrs-search-group" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; margin-left: 8px;">
                                <span id="lrs-multi-search-btn" class="lrs-control-btn" style="cursor: pointer; font-size: 11px; color: #fff; padding: 4px 10px; transition: 0.2s; display: flex; align-items: center; gap: 4px;">🔍 다중검색</span>
                            </div>
                        </div>
                    </div>
                    <button id="lrs-setting-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 6px; padding: 4px 8px; font-size: 14px; cursor: pointer; transition: 0.2s;">⚙️ 설정</button>
                </div>

                <!-- 다중검색 패널 -->
                <div id="lrs-multi-search-panel" style="display: none; padding: 15px; background: #f0f9ff; border-bottom: 1px solid #7dd3fc; animation: slideDown 0.3s ease;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <label style="font-size: 11px; font-weight: 700; color: #0369a1; margin: 0;">🔍 수주번호 다중 입력</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button id="lrs-multi-search-open-btn" style="padding: 4px 12px; background: #0284c7; color: #fff; border: none; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);">🚀 열기 (Ctrl+Enter)</button>
                                <span id="lrs-multi-search-count" style="font-size: 11px; color: #64748b; font-weight: 700; background: rgba(255,255,255,0.6); padding: 2px 6px; border-radius: 4px; border: 1px solid #7dd3fc;">0건</span>
                            </div>
                        </div>
                        <textarea id="lrs-multi-search-input" placeholder="수주번호를 붙여넣으세요..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #7dd3fc; border-radius: 4px; font-size: 12px; font-family: monospace; resize: vertical; outline: none;" onfocus="this.style.borderColor='#0284c7'" onblur="this.style.borderColor='#7dd3fc'"></textarea>
                    </div>
                </div>

                <!-- 설정 패널 -->
                <div id="lrs-setting-panel" style="display: none; padding: 15px; background: #f8fafc; border-bottom: 1px solid #e1e4e8; animation: slideDown 0.3s ease;">
                    <div style="display: flex; gap: 15px; align-items: flex-end;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 5px;">🏢 팀 선택</label>
                            <select id="lrs-input-dept" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
                                ${deptOptions}
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 5px;">👤 작업자 성함</label>
                            <input id="lrs-input-name" type="text" value="${ME.name}" placeholder="성함 입력" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
                        </div>
                        <button id="lrs-save-btn" style="padding: 6px 15px; background: #4834d4; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: 700; cursor: pointer;">저장 및 적용</button>
                    </div>
                </div>

                <div id="lrs-work-table-container" style="padding: 15px; max-height: 450px; overflow-y: auto; min-height: 80px; position: relative;">
                    <p style="text-align: center; color: #888; padding: 20px;">데이터를 불러오는 중...</p>
                </div>
            </div>
        `;
        return section;
    }

    function toggleSettings() {
        const panel = document.getElementById('lrs-setting-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    // 다중검색 패널 토글
    function toggleMultiSearchPanel() {
        const panel = document.getElementById('lrs-multi-search-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';

        // 입력 이벤트로 건수 업데이트
        const input = document.getElementById('lrs-multi-search-input');
        const countSpan = document.getElementById('lrs-multi-search-count');

        input.oninput = () => {
            const orderNumbers = parseOrderNumbers(input.value);
            countSpan.textContent = `${orderNumbers.length}건`;
        };

        // 단축키 지원 (Ctrl + Enter)
        input.onkeydown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                openMultipleOrders();
            }
        };

        // 패널 열릴 때 자동 포커스
        if (panel.style.display !== 'none') {
            setTimeout(() => input.focus(), 100);
        }
    }

    // 수주번호 파싱 (줄바꿈, 쉼표, 공백 구분 지원)
    function parseOrderNumbers(text) {
        return text
            .split(/[\n,\s]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    // 다중 수주번호 열기
    function openMultipleOrders() {
        const input = document.getElementById('lrs-multi-search-input');
        const orderNumbers = parseOrderNumbers(input.value);

        if (orderNumbers.length === 0) {
            alert('수주번호를 입력해주세요.');
            return;
        }

        if (orderNumbers.length > 20) {
            if (!confirm(`${orderNumbers.length}개의 탭을 열겠습니까? (많은 탭을 열면 브라우저가 느려질 수 있습니다)`)) {
                return;
            }
        }

        // 각 수주번호를 즉시 새 탭으로 열기 (동시 오픈)
        orderNumbers.forEach((ordNo) => {
            window.open(`${ORD_DETAIL_URL}?menuCd=NGS100300&ordNo=${ordNo}`, '_blank');
        });

        // 버튼 피드백
        const btn = document.getElementById('lrs-multi-search-open-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = `✅ ${orderNumbers.length}개 열림!`;
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '#0284c7';
        }, 2000);

        // 입력창 초기화
        input.value = '';
        document.getElementById('lrs-multi-search-count').textContent = '0건';
    }

    function saveSettings() {
        const deptId = document.getElementById('lrs-input-dept').value;
        const deptName = DEPARTMENTS.find(d => d.id === deptId).name;
        let name = document.getElementById('lrs-input-name').value.trim();

        if (!name) {
            alert('성함을 입력해주세요.');
            return;
        }

        // IME 중복 입력 버그 방지 (예: 김재형형 -> 김재형)
        if (name.length > 1 && name[name.length - 1] === name[name.length - 2]) {
            // 마지막 글자가 이전 글자와 동일하고 2글자 이상인 경우 끝 글자 제거 (자동 보정)
            name = name.slice(0, -1);
        }

        ME = { name, deptId, deptName };
        GM_setValue('LRS_CONFIG', ME);

        document.getElementById('lrs-setting-panel').style.display = 'none';
        fetchData(currentMode);
    }

    // 엑셀 복사 함수 (수주 ID, 상태, 요청 내용)
    function copyToExcel() {
        const data = MEMORY_CACHE[currentMode];
        if (!data || data.length === 0) {
            alert('복사할 데이터가 없습니다.');
            return;
        }

        // 탭 구분자로 줄 생성 (수주 ID \t 상태 \t 요청 내용)
        const lines = data.map(item => {
            const ordId = item.logProcessTrgtId || '';
            const status = item.logPrgrStatNm || '';
            const content = (item.cntn || '').replace(/[\t\r\n]/g, ' '); // 탭/개행 제거
            return `${ordId}\t${status}\t${content}`;
        });

        // 헤더 포함
        const textToCopy = `수주 ID\t상태\t요청 내용\n${lines.join('\n')}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            // 버튼 피드백
            const btn = document.getElementById('lrs-copy-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ 복사됨!';
            btn.style.background = 'rgba(34, 197, 94, 0.3)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1500);
        }).catch(err => {
            alert('클립보드 복사 실패: ' + err);
        });
    }

    // 수주번호만 복사 함수
    function copyOrderNumbersOnly() {
        const data = MEMORY_CACHE[currentMode];
        if (!data || data.length === 0) {
            alert('복사할 데이터가 없습니다.');
            return;
        }

        // 수주번호만 추출하여 줄바꿈으로 구분
        const orderNumbers = data
            .map(item => item.logProcessTrgtId || '')
            .filter(id => id) // 빈 값 제외
            .join('\n');

        navigator.clipboard.writeText(orderNumbers).then(() => {
            // 버튼 피드백
            const btn = document.getElementById('lrs-copy-ordno-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ 복사됨!';
            btn.style.background = 'rgba(34, 197, 94, 0.3)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1500);
        }).catch(err => {
            alert('클립보드 복사 실패: ' + err);
        });
    }

    let isFetching = false;

    // 데이터 호출 함수
    async function fetchData(mode = 'team') {
        if (isFetching) return;
        isFetching = true;

        currentMode = mode;
        const container = document.getElementById('lrs-work-table-container');
        const countSpan = document.getElementById('lrs-data-count');
        const titleEl = document.getElementById('lrs-title');
        if (!container) {
            isFetching = false;
            return;
        }

        // UI 상태 업데이트
        document.querySelectorAll('.lrs-mode-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.color = 'rgba(255,255,255,0.6)';
            btn.style.background = 'transparent';
        });
        const activeBtn = document.getElementById(`lrs-${mode}-btn`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.color = '#fff';
            activeBtn.style.background = 'rgba(255,255,255,0.15)';
        }

        const titleText = mode === 'my' ? `📑 ${ME.name}님의 내 요청` : (mode === 'instruct' ? `📋 ${ME.name}님의 지시 업무` : `📂 ${ME.deptName.split('>')[1] || ME.deptName}`);
        if (titleEl) titleEl.innerText = titleText;

        // [추가] 메모리 캐시가 있다면 즉시 렌더링하여 지연 시간 제거
        if (MEMORY_CACHE[mode]) {
            renderTable(container, MEMORY_CACHE[mode]);
            container.style.opacity = '0.7'; // 갱신 중임을 시각적으로 표시
        } else {
            container.style.opacity = '0.5';
            container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">데이터를 불러오는 중...</p>';
        }
        const csrf = getCsrfInfo();

        const now = new Date();
        const past = new Date();
        past.setMonth(now.getMonth() - 2); // 3개월 -> 2개월로 단축하여 데이터량 최적화

        const formatDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const formatDateNum = (d) => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');

        const statusCodes = (mode === 'team' || mode === 'instruct') ? ["00", "10", "20", "30", "31"] : ["00", "10", "20", "30", "31", "40"];

        const logForm = [
            { "name": "logProcessTrgtDivCd", "value": "" },
            { "name": "logProcessTrgtId", "value": "" },
            { "name": "logGropNo", "value": "" },
            { "name": "deptId", "value": "" },
            { "name": "logId", "value": "" },
            { "name": "searchLogPrgrStatCds", "value": statusCodes.join(',') + ',' },
            { "name": "isPopup", "value": "N" },
            { "name": "searchBeginDate_text", "value": formatDateStr(past) },
            { "name": "searchBeginDate", "value": formatDateNum(past) },
            { "name": "searchEndDate_text", "value": formatDateStr(now) },
            { "name": "searchEndDate", "value": formatDateNum(now) },
            { "name": "searchSrvcDomnCd", "value": "" },
            { "name": "searchUrgentYn", "value": "" },
            { "name": "searchLogProcessTrgtDivCd", "value": "" },
            { "name": "searchReqstDeptId", "value": "" },
            { "name": "searchReqstDeptId_text", "value": "" },
            { "name": "searchApplionTypeCd", "value": "" },
            { "name": "searchAnalysisYn", "value": "" },
            { "name": "searchNationGroupCd", "value": "" }
        ];

        if (mode === 'my') {
            logForm.push({ "name": "searchDeptId", "value": "" });
            logForm.push({ "name": "searchDeptId_text", "value": "" });
            logForm.push({ "name": "searchBasiSrchCd1", "value": "07" }); // 07: 요청자
            logForm.push({ "name": "searchKeyword1", "value": ME.name });
        } else if (mode === 'instruct') {
            logForm.push({ "name": "searchDeptId", "value": "" });
            logForm.push({ "name": "searchDeptId_text", "value": "" });
            logForm.push({ "name": "searchBasiSrchCd1", "value": "09" }); // 09: 처리자
            logForm.push({ "name": "searchKeyword1", "value": ME.name });
        } else {
            logForm.push({ "name": "searchDeptId", "value": ME.deptId });
            logForm.push({ "name": "searchDeptId_text", "value": ME.deptName });
            logForm.push({ "name": "searchBasiSrchCd1", "value": "01" });
            logForm.push({ "name": "searchKeyword1", "value": "" });
        }

        statusCodes.forEach(code => logForm.push({ "name": "searchLogPrgrStatCd", "value": code }));
        logForm.push({ "name": "menuCd", "value": "NGS250100" });

        const payload = { "dataSet": { "undefined": {}, "logForm": logForm } };

        // 즉시 실행 (사용자 클릭은 최우선, 지연 없음)
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestMgr.do",
            data: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                [csrf.header]: csrf.token
            },
            onload: function (response) {
                isFetching = false;
                container.style.opacity = '1';
                try {
                    const res = JSON.parse(response.responseText);
                    let list = res.result || [];
                    MEMORY_CACHE[mode] = list; // 메모리에 저장
                    if (countSpan) countSpan.textContent = `(${list.length}건)`;
                    list.sort((a, b) => (b.rgsnDttm || '').localeCompare(a.rgsnDttm || ''));
                    renderTable(container, list);
                } catch (e) {
                    container.innerHTML = `<p style="color:#e53e3e; text-align:center; padding: 20px;">⚠️ 데이터 해석 오류</p>`;
                }
            },
            onerror: function () {
                isFetching = false;
                container.style.opacity = '1';
                container.innerHTML = `<p style="color:#e53e3e; text-align:center; padding: 20px;">서버 연결 오류</p>`;
            }
        });
    }

    // 상태값별 스타일 반환 (색상 간 명확한 대비 확보)
    function getStatusStyle(status) {
        const styles = {
            '요청': 'background: #efefff; color: #4834d4; border: 1px solid #4834d4;', // Purple (P36)
            '지시': 'background: #fff7ed; color: #ea580c; border: 1px solid #fdba74;', // Orange
            '처리중': 'background: #f0fdf4; color: #15803d; border: 1px solid #4ade80;', // Vivid Green
            '전문': 'background: #fff1f2; color: #e11d48; border: 1px solid #fda4af;', // Red
            '답변': 'background: #f0f9ff; color: #0284c7; border: 1px solid #7dd3fc;', // Sky Blue (Distinct from Teal/Purple)
            '처리완료': 'background: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0; font-weight: 500;', // Grey
        };
        return styles[status] || 'background: #f8fafc; color: #475569; border: 1px solid #f1f5f9;';
    }

    // 테이블 렌더링 함수
    function renderTable(container, items) {
        if (!items || items.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px; font-size: 14px;">처리 대기 중인 업무가 없습니다. 🎉</p>';
            return;
        }

        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead style="position: sticky; top: -15px; background: #fff; z-index: 10;">
                    <tr style="text-align: left; background: #f1f5f9; color: #475569;">
                        <th style="padding: 12px 10px; border-bottom: 2px solid #e2e8f0; width: 65px; text-align: center;">상세</th>
                        <th style="padding: 12px 10px; border-bottom: 2px solid #e2e8f0; width: 110px;">수주 ID</th>
                        <th style="padding: 12px 10px; border-bottom: 2px solid #e2e8f0; width: 85px; text-align: center;">상태</th>
                        <th style="padding: 12px 10px; border-bottom: 2px solid #e2e8f0;">요청 내용</th>
                        <th style="padding: 12px 10px; border-bottom: 2px solid #e2e8f0; width: 100px;">등록일</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach((item) => {
            const gropno = item.logGropNo;
            const logid = item.logId;
            const deptid = item.deptId || ME.deptId;
            const targetId = item.logProcessTrgtId || '';
            const content = item.cntn || '';
            const status = item.logPrgrStatNm || '';
            const date = (item.rgsnDttm || '').substring(0, 10);
            const isUrgent = item.urgnYn === 'Y';
            const isDone = status === '처리완료';
            const rowBg = isUrgent ? '#fff1f2' : 'transparent';
            const rowStyle = isDone ? 'color: #94a3b8; opacity: 0.8;' : 'color: #1e293b;';

            html += `
                <tr style="border-bottom: 1px solid #f1f5f9; background: ${rowBg}; ${rowStyle} transition: 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='${rowBg}'">
                    <td style="padding: 10px; text-align: center;">
                        <button class="lrs-detail-btn" data-gropno="${gropno}" data-logid="${logid}" data-deptid="${deptid}"
                                style="padding: 4px 10px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 11px; cursor: pointer;">열기</button>
                    </td>
                    <td style="padding: 10px;">
                        <span class="lrs-ord-link" data-ordno="${targetId}" style="color: ${isDone ? '#94a3b8' : '#2563eb'}; cursor: pointer; text-decoration: underline;">${targetId}</span>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 800; ${getStatusStyle(status)}">${status}</span>
                    </td>
                    <td style="padding: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px; ${isDone ? 'color: #94a3b8;' : ''}" title="${content}">
                        ${isUrgent ? '<span style="color:red; font-weight:900;">[긴급]</span> ' : ''}${content}
                    </td>
                    <td style="padding: 10px; color: ${isDone ? '#cbd5e1' : '#64748b'};">${date}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        // 링크 이벤트
        const openInNewTab = (url) => {
            window.open(url, '_blank');
        };

        const openMaximized = (url, name) => {
            const w = screen.availWidth;
            const h = screen.availHeight;
            window.open(url, name, `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`);
        };

        container.querySelectorAll('.lrs-detail-btn').forEach(btn => {
            btn.onclick = () => {
                const { gropno, logid, deptid } = btn.dataset;
                openMaximized(`${LOG_DETAIL_URL}?menuCd=NGS250100&logGropNo=${gropno}&deptId=${deptid}&logId=${logid}`, 'LogDetail');
            };
        });

        container.querySelectorAll('.lrs-ord-link').forEach(link => {
            link.onclick = () => {
                openInNewTab(`${ORD_DETAIL_URL}?menuCd=NGS100300&ordNo=${link.dataset.ordno}`);
            };
        });
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .lrs-mode-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .lrs-mode-btn.active { background: rgba(255,255,255,0.2) !important; }
    `;
    document.head.appendChild(styleTag);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100); // 실행 우선순위 확보를 위해 100ms로 단축
    }
})();
