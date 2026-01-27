// ==UserScript==
// @name         시리즈 내서재 자동 정주행
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  지정 모드 및 자동 모드(대여시점 오작동 수정, 만료 감지 강화, 대여 3일전 자동 작업) 지원.
// @author       User
// @match        https://series.naver.com/my/library/productList.series*
// @icon         https://ssl.pstatic.net/static/nstore/series_favicon_152.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557644/%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EB%82%B4%EC%84%9C%EC%9E%AC%20%EC%9E%90%EB%8F%99%20%EC%A0%95%EC%A3%BC%ED%96%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557644/%EC%8B%9C%EB%A6%AC%EC%A6%88%20%EB%82%B4%EC%84%9C%EC%9E%AC%20%EC%9E%90%EB%8F%99%20%EC%A0%95%EC%A3%BC%ED%96%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === [핵심 패치] 네이버 원본 스크립트 에러 무시 ===
    window.addEventListener('error', function(event) {
        if (event.message && (event.message.includes('focus') || event.message.includes('null'))) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
    }, true);

    // === 설정 및 상수 ===
    const KEY_IS_RUNNING = 'ns_auto_running';
    const KEY_MODE = 'ns_auto_mode'; // 'MANUAL' or 'AUTO'
    const KEY_CURRENT_INDEX = 'ns_auto_index';
    const KEY_TARGET_COUNTS = 'ns_auto_target_counts';
    const KEY_LIST_PARAMS = 'ns_auto_list_params';
    const KEY_BATCH_OFFSET = 'ns_auto_batch_offset';

    const KEY_STAT_WORKS = 'ns_stat_total_works';
    const KEY_STAT_CLICKS = 'ns_stat_total_clicks';

    const DELAY_BEFORE_RELOAD = 1000;

    // === UI 스타일 ===
    GM_addStyle(`
        #ns-auto-control-panel {
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            display: flex; flex-direction: column; gap: 10px;
            background: rgba(255, 255, 255, 0.98); padding: 15px; border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #ddd;
            width: 340px; font-family: 'Nanum Gothic', sans-serif; animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        #ns-launcher-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            background-color: #03C75A; color: white; border: none; border-radius: 25px;
            padding: 12px 20px; font-weight: bold; font-size: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer;
            font-family: 'Nanum Gothic', sans-serif; transition: transform 0.2s, background-color 0.2s;
            display: flex; align-items: center; gap: 5px;
        }
        #ns-launcher-btn:hover { transform: scale(1.05); background-color: #02b351; }
        .ns-header {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 15px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;
            padding-bottom: 10px; margin-bottom: 5px;
        }
        .ns-close-btn { cursor: pointer; color: #999; font-size: 18px; padding: 0 5px; }
        .ns-close-btn:hover { color: #333; }
        .ns-status { font-size: 12px; color: #666; text-align: center; margin-bottom: 5px; background: #f8f9fa; padding: 5px; border-radius: 4px; }
        .ns-mode-grid { display: flex; gap: 10px; margin-top: 10px; }
        .ns-mode-btn {
            flex: 1; padding: 15px 5px; border: 1px solid #ddd; border-radius: 8px; background: #fff;
            cursor: pointer; text-align: center; font-weight: bold; color: #444; transition: all 0.2s;
        }
        .ns-mode-btn:hover { background: #f0f9f0; border-color: #03C75A; color: #03C75A; }
        .ns-mode-icon { display: block; font-size: 20px; margin-bottom: 5px; }
        .ns-list-container {
            max-height: 250px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; background: #fff;
        }
        .ns-list-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 8px 10px; border-bottom: 1px solid #f5f5f5; font-size: 12px; cursor: pointer;
        }
        .ns-list-item.selected { background-color: #e6f7ff; }
        .ns-list-item.range-hover { background-color: #e8f5e9; border-left: 3px solid #03C75A; }
        .ns-item-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px; }
        .ns-item-title:hover { color: #03C75A; text-decoration: underline; }
        .ns-count-ctrl { display: flex; align-items: center; gap: 3px; }
        .ns-ctrl-btn {
            width: 24px; height: 24px; border: 1px solid #ddd; background: #fff;
            border-radius: 4px; cursor: pointer; font-weight: bold; color: #666;
            display: flex; align-items: center; justify-content: center;
        }
        .ns-ctrl-btn:hover { background: #eee; }
        .ns-count-input { width: 30px; height: 24px; text-align: center; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; }
        .ns-action-btn {
            padding: 12px; border: none; border-radius: 6px; font-weight: bold;
            cursor: pointer; color: white; font-size: 14px; width: 100%; margin-top: 10px;
        }
        #btn-start { background-color: #03C75A; }
        #btn-start:hover { background-color: #02b351; }
        #btn-stop { background-color: #ff4d4d; }
        #btn-stop:hover { background-color: #e60000; }
        .ns-toolbar {
            display: flex; align-items: center; justify-content: flex-end;
            margin-bottom: 5px; font-size: 11px; color: #666; gap: 5px; flex-wrap: wrap;
        }
        .ns-mini-btn {
            padding: 4px 8px; border: 1px solid #ddd; background: #fff;
            border-radius: 4px; cursor: pointer; font-size: 11px;
        }
        .ns-mini-btn:hover { border-color: #03C75A; color: #03C75A; }
        .ns-mini-input { width: 40px; padding: 3px; font-size: 11px; text-align: center; border: 1px solid #ddd; border-radius: 4px; }
        .ns-list-container::-webkit-scrollbar { width: 6px; }
        .ns-list-container::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
    `);

    // === 상태 관리 ===
    function isRunning() { return GM_getValue(KEY_IS_RUNNING, false); }
    function setRunning(bool) { GM_setValue(KEY_IS_RUNNING, bool); }
    function getMode() { return GM_getValue(KEY_MODE, 'MANUAL'); }
    function setMode(mode) { GM_setValue(KEY_MODE, mode); }
    function getIndex() { return GM_getValue(KEY_CURRENT_INDEX, 0); }
    function setIndex(num) { GM_setValue(KEY_CURRENT_INDEX, num); }
    function getTargetCounts() { return JSON.parse(GM_getValue(KEY_TARGET_COUNTS, '{}')); }
    function setTargetCounts(obj) { GM_setValue(KEY_TARGET_COUNTS, JSON.stringify(obj)); }
    function getBatchOffset() { return GM_getValue(KEY_BATCH_OFFSET, 0); }
    function setBatchOffset(num) { GM_setValue(KEY_BATCH_OFFSET, num); }
    function getStatWorks() { return GM_getValue(KEY_STAT_WORKS, 0); }
    function setStatWorks(num) { GM_setValue(KEY_STAT_WORKS, num); }
    function getStatClicks() { return GM_getValue(KEY_STAT_CLICKS, 0); }
    function setStatClicks(num) { GM_setValue(KEY_STAT_CLICKS, num); }

    // === 메인 로직 ===
    function main() {
        if (isRunning()) {
            createRunningPanelUI();
            runAutoLogic();
        } else {
            createLauncherUI();
        }
    }

    function runAutoLogic() {
        const urlParams = new URLSearchParams(window.location.search);
        const isVolumeListMode = urlParams.has('viewVolumnListByContentNo');
        if (isVolumeListMode) {
            processVolumePage();
        } else {
            processLibraryPage();
        }
    }

    // [로직] 내서재 목록
    function processLibraryPage() {
        GM_setValue(KEY_LIST_PARAMS, window.location.search);
        let index = getIndex();
        const targets = getTargetCounts();
        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');

        while (index < items.length) {
            if ((targets[index] || 0) > 0) break;
            index++;
        }
        setIndex(index);

        if (index >= items.length) {
            finishProcess();
            return;
        }

        const modeText = (getMode() === 'AUTO') ? '자동 모드' : '지정 모드';
        updateStatus(`${modeText}: ${index + 1} / ${items.length} 번째 작품 진입`);

        const targetItem = items[index];
        const moreBtn = targetItem ? targetItem.querySelector('.con_more') : null;
        const viewBtn = targetItem ? targetItem.querySelector('.btn_veiwer') : null;
        setBatchOffset(0);

        if (moreBtn) {
            setStatWorks(getStatWorks() + 1);
            moreBtn.click();
        } else if (viewBtn) {
            setStatWorks(getStatWorks() + 1);
            setStatClicks(getStatClicks() + 1);
            viewBtn.click();
            setTimeout(() => {
                setIndex(index + 1);
                window.location.href = window.location.href;
            }, DELAY_BEFORE_RELOAD);
        } else {
            setIndex(index + 1);
            location.reload();
        }
    }

    // [로직] 회차 목록 분기
    function processVolumePage() {
        const index = getIndex();
        if (getMode() === 'AUTO') {
            processVolumePageAuto(index);
        } else {
            processVolumePageManual(index);
        }
    }

    // [로직] 회차 목록 - 지정 모드
    function processVolumePageManual(index) {
        const targets = getTargetCounts();
        let countNeeded = (targets[index] !== undefined) ? targets[index] : 0;
        let batchOffset = getBatchOffset();

        if (countNeeded <= 0) {
            setBatchOffset(0);
            goBackToLibrary();
            return;
        }
        updateStatus(`[지정 모드] 진행 중... (남은 목표: ${countNeeded}화)`);
        const viewButtons = Array.from(document.querySelectorAll('.util_mygroup_v3 li .btn_veiwer'));

        if (viewButtons.length > 0 && batchOffset < viewButtons.length) {
            setStatClicks(getStatClicks() + 1);
            viewButtons[batchOffset].click();
            targets[index] = countNeeded - 1;
            setTargetCounts(targets);
            setBatchOffset(batchOffset + 1);
            setTimeout(() => window.location.href = window.location.href, DELAY_BEFORE_RELOAD);
        } else {
            setBatchOffset(0);
            goBackToLibrary();
        }
    }

    // [로직] 회차 목록 - 자동 모드 (대여시점 제외 / 만료 방지턱 / 3일뒤 대여만)
    function processVolumePageAuto(index) {
        updateStatus(`[자동 모드] 탐색 중...`);
        let batchOffset = getBatchOffset();

        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');
        let cutoffIndex = items.length;

        // 1. 만료된 항목이 어디인지 먼저 감지 (방지턱)
        // 만료 항목을 찾으면 그 이후 인덱스는 모두 무시 (items는 시간 역순으로 되어있을 가능성이 높으므로)
        for (let i = 0; i < items.length; i++) {
            if (items[i].innerText.includes('만료')) {
                cutoffIndex = i;
                console.log(`[Auto] 만료된 항목 감지: index ${i}. 이후 항목 작업 중단.`);
                break;
            }
        }

        // 2. 오늘 기준 3일 뒤 날짜 문자열 생성 (~ YYYY.MM.DD)
        const d = new Date();
        d.setDate(d.getDate() + 3);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const targetDateStr = `~ ${yyyy}.${mm}.${dd}`;
        console.log(`[Auto] 타겟 대여일: ${targetDateStr}`);

        // 3. 유효한 버튼 목록 추출
        const validButtons = [];
        for (let i = 0; i < items.length; i++) {
            // 방지턱: 만료된 항목이 나오면 그 즉시, 그리고 그 이후의 모든 항목 중단
            if (i >= cutoffIndex) break;

            const text = items[i].innerText;
            const btn = items[i].querySelector('.btn_veiwer');

            if (!btn) continue;

            // [조건 0] "대여시점" 텍스트가 있으면 무조건 스킵 (무료분/이미 본 것) -> 버그 수정 핵심
            if (text.includes('대여시점')) {
                continue;
            }

            // [조건 1] "대여기한" (~ YYYY.MM.DD) 패턴이 있는 경우
            if (text.match(/~ \d{4}\.\d{2}\.\d{2}/)) {
                // 타겟 날짜(3일 뒤)와 정확히 일치하지 않으면 스킵
                if (!text.includes(targetDateStr)) {
                    continue;
                }
            }

            // [조건 2] "대여시점"도 아니고 "대여기한" 패턴도 없으면 -> 소장(Owned)으로 간주하여 추가
            validButtons.push(btn);
        }

        if (validButtons.length > 0) {
            if (batchOffset < validButtons.length) {
                console.log(`[Auto] ${batchOffset + 1} / ${validButtons.length} 유효 버튼 실행`);
                setStatClicks(getStatClicks() + 1);
                validButtons[batchOffset].click();
                setBatchOffset(batchOffset + 1);
                setTimeout(() => window.location.href = window.location.href, DELAY_BEFORE_RELOAD);
            } else {
                setBatchOffset(0);
                goBackToLibrary();
            }
        } else {
             console.log('[Auto] 유효 작업 없음. 다음 이동.');
             setBatchOffset(0);
             goBackToLibrary();
        }
    }

    function goBackToLibrary() {
        const currentIndex = getIndex();
        setIndex(currentIndex + 1);
        const baseUrl = location.protocol + '//' + location.host + location.pathname;
        const savedParams = GM_getValue(KEY_LIST_PARAMS, '');
        if (savedParams) window.location.href = baseUrl + savedParams;
        else {
             const currentParams = new URLSearchParams(window.location.search);
             const serviceType = currentParams.get('serviceTypeCode') || 'NOVEL';
             window.location.href = `${baseUrl}?serviceTypeCode=${serviceType}`;
        }
    }

    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio Play Error:", e);
        }
    }

    function finishProcess() {
        playSuccessSound();
        const totalWorks = getStatWorks();
        const totalClicks = getStatClicks();
        setTimeout(() => {
            alert(`완료되었습니다.\n\n총 ${totalWorks}작품, ${totalClicks}회차 처리됨.`);
            setRunning(false); setIndex(0); setTargetCounts({}); setBatchOffset(0);
            setStatWorks(0); setStatClicks(0);
            location.reload();
        }, 300);
    }

    // === UI ===
    function createLauncherUI() {
        removeUI();
        const btn = document.createElement('button');
        btn.id = 'ns-launcher-btn';
        btn.innerHTML = '<span>▶</span> 정주행 메뉴';
        btn.onclick = () => createModeSelectUI();
        document.body.appendChild(btn);
    }

    function createModeSelectUI() {
        removeUI();
        const container = createPanelBase('작업 모드 선택');
        const menuGrid = document.createElement('div');
        menuGrid.className = 'ns-mode-grid';

        const btnManual = document.createElement('div');
        btnManual.className = 'ns-mode-btn';
        btnManual.innerHTML = '<span class="ns-mode-icon">📝</span>지정 모드<br><span style="font-size:11px;font-weight:normal;">횟수 직접 입력</span>';
        btnManual.onclick = () => createManualListUI();

        const btnAuto = document.createElement('div');
        btnAuto.className = 'ns-mode-btn';
        btnAuto.innerHTML = '<span class="ns-mode-icon">⚡</span>자동 모드<br><span style="font-size:11px;font-weight:normal;">대여(3일전) & 소장<br>(만료 이후 정지)</span>';
        btnAuto.onclick = () => createAutoListUI();

        menuGrid.appendChild(btnManual);
        menuGrid.appendChild(btnAuto);
        container.appendChild(menuGrid);
        document.body.appendChild(container);
    }

    function createManualListUI() {
        removeUI();
        const container = createPanelBase('지정 모드');
        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');

        const toolbar = document.createElement('div');
        toolbar.className = 'ns-toolbar';
        const batchInput = document.createElement('input');
        batchInput.type = 'number'; batchInput.className = 'ns-mini-input'; batchInput.value = 1; batchInput.placeholder = 'N';
        toolbar.appendChild(batchInput);
        const label = document.createElement('span'); label.innerText = '화'; label.style.marginRight='5px'; toolbar.appendChild(label);
        const btnApply = document.createElement('button'); btnApply.className = 'ns-mini-btn'; btnApply.innerText = '전체적용';
        btnApply.onclick = () => {
             const val = parseInt(batchInput.value)||1;
             container.querySelectorAll('.ns-count-input').forEach((inp,i) => {
                 inp.value=val; container.querySelectorAll('.ns-list-item')[i].classList.add('selected');
             });
        };
        toolbar.appendChild(btnApply);
        const btnReset = document.createElement('button'); btnReset.className = 'ns-mini-btn'; btnReset.innerText = '초기화';
        btnReset.onclick = () => {
             container.querySelectorAll('.ns-count-input').forEach((inp,i) => {
                 inp.value=0; container.querySelectorAll('.ns-list-item')[i].classList.remove('selected');
             });
        };
        toolbar.appendChild(btnReset);
        container.appendChild(toolbar);

        const listContainer = document.createElement('div'); listContainer.className = 'ns-list-container';
        items.forEach((item, idx) => {
            const title = getTitle(item, idx);
            const div = document.createElement('div'); div.className = 'ns-list-item';
            div.innerHTML = `<span class="ns-item-title">${idx+1}. ${title}</span>`;
            const ctrl = document.createElement('div'); ctrl.className = 'ns-count-ctrl';
            const btnM = document.createElement('button'); btnM.className='ns-ctrl-btn'; btnM.innerText='-';
            const inp = document.createElement('input'); inp.className='ns-count-input'; inp.type='number'; inp.value=0;
            const btnP = document.createElement('button'); btnP.className='ns-ctrl-btn'; btnP.innerText='+';
            btnM.onclick = () => { inp.value = Math.max(0, parseInt(inp.value)-1); checkSel(); };
            btnP.onclick = () => { inp.value = parseInt(inp.value)+1; checkSel(); };
            inp.onchange = () => checkSel();
            function checkSel(){ if(parseInt(inp.value)>0) div.classList.add('selected'); else div.classList.remove('selected'); }
            div.querySelector('.ns-item-title').onclick = () => {
                 const v = parseInt(batchInput.value)||1;
                 const allInps = listContainer.querySelectorAll('.ns-count-input');
                 const allRows = listContainer.querySelectorAll('.ns-list-item');
                 allInps.forEach((input, i) => {
                     if(i<=idx) { input.value=v; allRows[i].classList.add('selected'); }
                     else { input.value=0; allRows[i].classList.remove('selected'); }
                 });
            };
            ctrl.append(btnM, inp, btnP); div.appendChild(ctrl); listContainer.appendChild(div);
        });
        container.appendChild(listContainer);
        const startBtn = document.createElement('button');
        startBtn.className = 'ns-action-btn';
        startBtn.id = 'btn-start';
        startBtn.innerText = '▶ 실행 시작';
        startBtn.onclick = () => {
            const targets = {}; let total = 0;
            listContainer.querySelectorAll('.ns-count-input').forEach((inp, i) => { const v = parseInt(inp.value)||0; targets[i]=v; total+=v; });
            if(total===0) listContainer.querySelectorAll('.ns-count-input').forEach((_,i)=> targets[i]=1);
            startRunning(targets, 'MANUAL');
        };
        container.appendChild(startBtn);
        document.body.appendChild(container);
    }

    function createAutoListUI() {
        removeUI();
        const container = createPanelBase('자동 모드');
        const info = document.createElement('div');
        info.style.fontSize = '12px'; info.style.color = '#555'; info.style.padding = '5px';
        info.innerHTML = '종료할 작품을 클릭하세요.<br><b>소장 작품 + 대여 만료 3일 전인 화</b>만 자동 진행됩니다.<br><span style="color:red;font-size:11px;">* 만료, 대여시점(이미 봄/무료)은 건너뜁니다.</span>';
        container.appendChild(info);

        const listContainer = document.createElement('div'); listContainer.className = 'ns-list-container';
        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');
        items.forEach((item, idx) => {
            const title = getTitle(item, idx);
            const div = document.createElement('div'); div.className = 'ns-list-item';
            div.innerHTML = `<span class="ns-item-title">${idx+1}. ${title}</span>`;
            div.onmouseenter = () => {
                const rows = listContainer.querySelectorAll('.ns-list-item');
                rows.forEach((r, i) => { if(i<=idx) r.classList.add('range-hover'); else r.classList.remove('range-hover'); });
            };
            listContainer.onmouseleave = () => listContainer.querySelectorAll('.ns-list-item').forEach(r => r.classList.remove('range-hover'));

            div.onclick = () => {
                const targets = {};
                for(let i=0; i<items.length; i++) targets[i] = (i <= idx) ? 1 : 0;
                startRunning(targets, 'AUTO');
            };
            listContainer.appendChild(div);
        });
        container.appendChild(listContainer);
        document.body.appendChild(container);
    }

    function createRunningPanelUI() {
        removeUI();
        const container = createPanelBase('실행 중', false);
        const status = document.createElement('div'); status.id = 'ns-status-text'; status.className = 'ns-status'; status.innerText = '준비 중...';
        container.appendChild(status);
        const stopBtn = document.createElement('button'); stopBtn.className = 'ns-action-btn'; stopBtn.id = 'btn-stop'; stopBtn.innerText = '■ 중지';
        stopBtn.onclick = () => { setRunning(false); setTargetCounts({}); setIndex(0); setBatchOffset(0); setStatWorks(0); setStatClicks(0); location.reload(); };
        container.appendChild(stopBtn);
        document.body.appendChild(container);
    }

    function createPanelBase(titleText, showClose = true) {
        const container = document.createElement('div'); container.id = 'ns-auto-control-panel';
        const header = document.createElement('div'); header.className = 'ns-header';
        const title = document.createElement('span'); title.innerText = titleText; header.appendChild(title);
        if (showClose) {
            const closeBtn = document.createElement('span'); closeBtn.className = 'ns-close-btn'; closeBtn.innerHTML = '&#10005;';
            closeBtn.onclick = () => createLauncherUI(); header.appendChild(closeBtn);
        }
        container.appendChild(header); return container;
    }
    function removeUI() {
        const panel = document.getElementById('ns-auto-control-panel'); if(panel) panel.remove();
        const launcher = document.getElementById('ns-launcher-btn'); if(launcher) launcher.remove();
    }
    function getTitle(item, idx) { const t = item.querySelector('.list_tit a'); return t ? t.innerText.trim() : `작품 ${idx+1}`; }
    function updateStatus(msg) { const el = document.getElementById('ns-status-text'); if(el) el.innerText = msg; }
    function startRunning(targets, mode) {
        setIndex(0); setTargetCounts(targets); setMode(mode); setBatchOffset(0); setRunning(true); setStatWorks(0); setStatClicks(0); location.reload();
    }

    window.addEventListener('load', main);
})();