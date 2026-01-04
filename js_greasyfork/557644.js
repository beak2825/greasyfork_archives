// ==UserScript==
// @name         시리즈 내서재 자동 정주행
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  시작 확인창 제거, 완료 시 알림음, 통계 표시(총 작품/회차), 페이지 복귀, 상세 설정 기능 포함 (보안 우회, 카운트 버그 수정, 입력창 편의성 개선, UI 최적화)
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

    // === [핵심 패치] 네이버 원본 스크립트 에러 무시 (focus of null 방지) ===
    window.addEventListener('error', function(event) {
        if (event.message && (event.message.includes('focus') || event.message.includes('null'))) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
    }, true);

    // === 설정 및 상수 ===
    const KEY_IS_RUNNING = 'ns_auto_running';
    const KEY_CURRENT_INDEX = 'ns_auto_index';
    const KEY_TARGET_COUNTS = 'ns_auto_target_counts';
    const KEY_LIST_PARAMS = 'ns_auto_list_params';
    const KEY_BATCH_OFFSET = 'ns_auto_batch_offset';

    // [추가] 통계용 키
    const KEY_STAT_WORKS = 'ns_stat_total_works'; // 처리한 총 작품 수
    const KEY_STAT_CLICKS = 'ns_stat_total_clicks'; // 클릭한 총 회차 수

    const DELAY_BEFORE_RELOAD = 1000;

    // === UI 스타일 ===
    GM_addStyle(`
        /* 메인 패널 */
        #ns-auto-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(255, 255, 255, 0.98);
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            border: 1px solid #ddd;
            width: 340px;
            font-family: 'Nanum Gothic', sans-serif;
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 런처 버튼 */
        #ns-launcher-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background-color: #03C75A;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            font-family: 'Nanum Gothic', sans-serif;
            transition: transform 0.2s, background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        #ns-launcher-btn:hover {
            transform: scale(1.05);
            background-color: #02b351;
        }

        /* 공통 UI 요소 */
        .ns-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            font-weight: bold;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 5px;
        }
        .ns-close-btn { cursor: pointer; color: #999; font-size: 18px; padding: 0 5px; }
        .ns-close-btn:hover { color: #333; }

        .ns-status { font-size: 12px; color: #666; text-align: center; margin-bottom: 5px; background: #f8f9fa; padding: 5px; border-radius: 4px; }

        /* 메뉴 선택 버튼 */
        .ns-menu-grid { display: flex; gap: 10px; margin-top: 5px; }
        .ns-menu-btn {
            flex: 1;
            padding: 15px 5px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
            cursor: pointer;
            text-align: center;
            font-weight: bold;
            color: #444;
            transition: all 0.2s;
        }
        .ns-menu-btn:hover { background: #f0f9f0; border-color: #03C75A; color: #03C75A; }
        .ns-menu-icon { display: block; font-size: 20px; margin-bottom: 5px; }

        /* 리스트 스타일 */
        .ns-list-container {
            max-height: 250px;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fff;
        }
        .ns-list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            border-bottom: 1px solid #f5f5f5;
            font-size: 12px;
        }
        .ns-list-item.selected { background-color: #e6f7ff; }
        .ns-item-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px; cursor: pointer; }
        .ns-item-title:hover { color: #03C75A; text-decoration: underline; }

        /* 상세 설정 컨트롤러 */
        .ns-count-ctrl { display: flex; align-items: center; gap: 3px; }
        .ns-ctrl-btn {
            width: 24px; height: 24px;
            border: 1px solid #ddd; background: #fff;
            border-radius: 4px; cursor: pointer;
            font-weight: bold; color: #666;
            display: flex; align-items: center; justify-content: center;
        }
        .ns-ctrl-btn:hover { background: #eee; }

        /* 숫자 입력칸 공통 스타일 */
        .ns-count-input, .ns-mini-input {
            text-align: center; border: 1px solid #ddd;
            border-radius: 4px; font-size: 12px;
            -moz-appearance: textfield;
        }
        .ns-count-input { width: 30px; height: 24px; }
        .ns-mini-input { width: 40px; padding: 3px; font-size: 11px; }

        .ns-count-input::-webkit-outer-spin-button,
        .ns-count-input::-webkit-inner-spin-button,
        .ns-mini-input::-webkit-outer-spin-button,
        .ns-mini-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .ns-count-input:focus, .ns-mini-input:focus {
            border-color: #03C75A; outline: none; background-color: #f0fff4;
        }

        /* 하단 액션 버튼 */
        .ns-action-btn {
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            color: white;
            font-size: 14px;
            width: 100%;
            margin-top: 10px;
        }
        #btn-start { background-color: #03C75A; }
        #btn-start:hover { background-color: #02b351; }
        #btn-stop { background-color: #ff4d4d; }
        #btn-stop:hover { background-color: #e60000; }

        /* 상단 일괄 설정 영역 */
        .ns-toolbar {
            display: flex; align-items: center; justify-content: flex-end;
            margin-bottom: 5px; font-size: 11px; color: #666; gap: 5px; flex-wrap: wrap;
        }
        .ns-mini-btn {
            padding: 4px 8px; border: 1px solid #ddd; background: #fff;
            border-radius: 4px; cursor: pointer; font-size: 11px;
        }
        .ns-mini-btn:hover { border-color: #03C75A; color: #03C75A; }

        /* 스크롤바 */
        .ns-list-container::-webkit-scrollbar { width: 6px; }
        .ns-list-container::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
    `);

    // === 상태 관리 함수 ===
    function isRunning() { return GM_getValue(KEY_IS_RUNNING, false); }
    function setRunning(bool) { GM_setValue(KEY_IS_RUNNING, bool); }

    function getIndex() { return GM_getValue(KEY_CURRENT_INDEX, 0); }
    function setIndex(num) { GM_setValue(KEY_CURRENT_INDEX, num); }

    function getTargetCounts() { return JSON.parse(GM_getValue(KEY_TARGET_COUNTS, '{}')); }
    function setTargetCounts(obj) { GM_setValue(KEY_TARGET_COUNTS, JSON.stringify(obj)); }

    function getBatchOffset() { return GM_getValue(KEY_BATCH_OFFSET, 0); }
    function setBatchOffset(num) { GM_setValue(KEY_BATCH_OFFSET, num); }

    // [추가] 통계 관련 함수
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

    // [로직 1] 내서재 목록 페이지
    function processLibraryPage() {
        GM_setValue(KEY_LIST_PARAMS, window.location.search);

        let index = getIndex();
        const targets = getTargetCounts();
        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');

        // 스킵 로직: 설정값이 0이거나 없는 항목 건너뛰기
        while (index < items.length) {
            const targetCount = targets[index] || 0;
            if (targetCount > 0) {
                break;
            }
            console.log(`[Auto] ${index + 1}번째 작품: 스킵 (설정값 0)`);
            index++;
        }

        setIndex(index);

        // 종료 체크
        if (index >= items.length) {
            finishProcess();
            return;
        }

        const count = targets[index];
        updateStatus(`진행 중: ${index + 1} / ${items.length} 번째 작품 (${count}화 실행 예정)`);

        const targetItem = items[index];
        const moreBtn = targetItem ? targetItem.querySelector('.con_more') : null;
        const viewBtn = targetItem ? targetItem.querySelector('.btn_veiwer') : null;

        // 새 작품 진입 전 배치 오프셋 초기화
        setBatchOffset(0);

        if (moreBtn) {
            console.log(`[Auto] ${index + 1}번째 작품(${count}화) 진입 - 더보기`);
            // [통계] 작품 수 증가
            setStatWorks(getStatWorks() + 1);
            moreBtn.click();
        } else if (viewBtn) {
            console.log(`[Auto] ${index + 1}번째 작품(${count}화) - 단일 회차 바로보기`);
            // [통계] 작품 수 & 클릭 수 증가
            setStatWorks(getStatWorks() + 1);
            setStatClicks(getStatClicks() + 1);

            viewBtn.click();

            setTimeout(() => {
                setIndex(index + 1);
                window.location.href = window.location.href;
            }, DELAY_BEFORE_RELOAD);
        } else {
            console.log(`[Auto] ${index + 1}번째 작품: 버튼 없음. 강제 이동.`);
            setIndex(index + 1);
            location.reload();
        }
    }

    // [로직 2] 회차 목록 페이지 (보안 우회 적용: 1개 열고 리로드 반복)
    function processVolumePage() {
        const index = getIndex();
        const targets = getTargetCounts();

        let countNeeded = (targets[index] !== undefined) ? targets[index] : 1;
        let batchOffset = getBatchOffset();

        // 1. 남은 횟수가 없으면 목록 복귀
        if (countNeeded <= 0) {
            console.log('[Auto] 목표 횟수 달성. 목록으로 복귀합니다.');
            setBatchOffset(0);
            goBackToLibrary();
            return;
        }

        updateStatus(`뷰어 실행 중... (남은 목표: ${countNeeded}화)`);

        // 화면에 보이는 뷰어 버튼들 가져오기
        const viewButtons = Array.from(document.querySelectorAll('.util_mygroup_v3 li .btn_veiwer'));

        if (viewButtons.length > 0) {
            // 2. 현재 오프셋에 해당하는 버튼이 존재하는지 확인
            if (batchOffset < viewButtons.length) {
                console.log(`[Auto] ${batchOffset + 1}번째(Offset) 뷰어 실행 (보안 우회 모드)`);

                // [통계] 클릭 수 증가
                setStatClicks(getStatClicks() + 1);

                // 해당 순서의 버튼 클릭
                viewButtons[batchOffset].click();

                // 3. 상태 업데이트 (카운트 감소, 오프셋 증가)
                targets[index] = countNeeded - 1;
                setTargetCounts(targets);
                setBatchOffset(batchOffset + 1);

                // 4. 보안 차단 방지를 위한 페이지 리로드
                setTimeout(() => {
                    console.log('[Auto] 페이지를 새로고침합니다...');
                    window.location.href = window.location.href;
                }, DELAY_BEFORE_RELOAD);

            } else {
                console.log('[Auto] 더 이상 클릭할 버튼이 없습니다 (오프셋 초과). 다음 작품으로 이동.');
                setBatchOffset(0);
                goBackToLibrary();
            }
        } else {
            console.log('[Auto] 보기 버튼을 찾을 수 없습니다. 건너뜁니다.');
            setBatchOffset(0);
            goBackToLibrary();
        }
    }

    // [복귀 로직]
    function goBackToLibrary() {
        const currentIndex = getIndex();
        setIndex(currentIndex + 1);

        const baseUrl = location.protocol + '//' + location.host + location.pathname;
        const savedParams = GM_getValue(KEY_LIST_PARAMS, '');

        if (savedParams) {
             window.location.href = baseUrl + savedParams;
        } else {
             const currentParams = new URLSearchParams(window.location.search);
             const serviceType = currentParams.get('serviceTypeCode') || 'NOVEL';
             window.location.href = `${baseUrl}?serviceTypeCode=${serviceType}`;
        }
    }

    // [소리 재생]
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

        // [추가] 통계 정보 가져오기
        const totalWorks = getStatWorks();
        const totalClicks = getStatClicks();

        setTimeout(() => {
            alert(`모든 작업이 완료되었습니다.\n\n총 ${totalWorks}작품에서 ${totalClicks}화를 클릭했습니다.`);
            setRunning(false);
            setIndex(0);
            setTargetCounts({});
            setBatchOffset(0);
            setStatWorks(0);
            setStatClicks(0);
            location.reload();
        }, 300);
    }

    // === UI 생성: 런처 버튼 ===
    function createLauncherUI() {
        removeUI();
        const btn = document.createElement('button');
        btn.id = 'ns-launcher-btn';
        btn.innerHTML = '<span>▶</span> 내서재 정주행';
        btn.onclick = () => createMenuUI();
        document.body.appendChild(btn);
    }

    // === UI 생성: 메뉴 선택 ===
    function createMenuUI() {
        removeUI();
        const container = createPanelBase('작업 모드 선택');

        const menuGrid = document.createElement('div');
        menuGrid.className = 'ns-menu-grid';

        const btnSimple = document.createElement('div');
        btnSimple.className = 'ns-menu-btn';
        btnSimple.innerHTML = '<span class="ns-menu-icon">⚡</span>자동 1화<br><span style="font-size:11px;font-weight:normal;">선택 구간 1화씩 보기</span>';
        btnSimple.onclick = () => createSimpleListUI();

        const btnDetail = document.createElement('div');
        btnDetail.className = 'ns-menu-btn';
        btnDetail.innerHTML = '<span class="ns-menu-icon">📝</span>상세 지정<br><span style="font-size:11px;font-weight:normal;">작품별 화수 개별 설정</span>';
        btnDetail.onclick = () => createDetailListUI();

        menuGrid.appendChild(btnSimple);
        menuGrid.appendChild(btnDetail);
        container.appendChild(menuGrid);

        document.body.appendChild(container);
    }

    // === UI 생성: 자동 1화 리스트 ===
    function createSimpleListUI() {
        removeUI();
        const container = createPanelBase('자동 1화 모드');

        const toolbar = document.createElement('div');
        toolbar.className = 'ns-toolbar';
        toolbar.innerHTML = '종료할 작품을 선택하세요 (선택 안 하면 전체)';
        container.appendChild(toolbar);

        const listContainer = document.createElement('div');
        listContainer.className = 'ns-list-container';

        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');
        let selectedEndIndex = -1;

        if (items.length > 0) {
            items.forEach((item, idx) => {
                const title = getTitle(item, idx);
                const div = document.createElement('div');
                div.className = 'ns-list-item';
                div.innerHTML = `<span class="ns-item-title">${idx + 1}. ${title}</span>`;
                div.onclick = () => {
                    const allItems = listContainer.querySelectorAll('.ns-list-item');
                    allItems.forEach((el, i) => {
                        if (i <= idx) el.classList.add('selected');
                        else el.classList.remove('selected');
                    });

                    if (selectedEndIndex === idx) {
                        selectedEndIndex = -1;
                        allItems.forEach(el => el.classList.remove('selected'));
                    } else {
                        selectedEndIndex = idx;
                    }
                };
                listContainer.appendChild(div);
            });
        } else {
            listContainer.innerHTML = '<div style="padding:10px;text-align:center;">목록을 불러올 수 없습니다.</div>';
        }
        container.appendChild(listContainer);

        const startBtn = document.createElement('button');
        startBtn.className = 'ns-action-btn';
        startBtn.id = 'btn-start';
        startBtn.innerText = '▶ 실행 (1화씩)';
        startBtn.onclick = () => {
            const endIndex = selectedEndIndex === -1 ? items.length - 1 : selectedEndIndex;
            const targets = {};
            for (let i = 0; i < items.length; i++) {
                targets[i] = i <= endIndex ? 1 : 0;
            }
            startRunning(targets);
        };
        container.appendChild(startBtn);

        document.body.appendChild(container);
    }

    // === UI 생성: 상세 지정 리스트 ===
    function createDetailListUI() {
        removeUI();
        const container = createPanelBase('상세 지정 모드');

        const items = document.querySelectorAll('.util_mygroup_v3 > ul > li');
        const toolbar = document.createElement('div');
        toolbar.className = 'ns-toolbar';

        const batchInput = document.createElement('input');
        batchInput.type = 'number';
        batchInput.id = 'ns-batch-input';
        batchInput.className = 'ns-mini-input';
        batchInput.value = 1;
        batchInput.min = 1;
        batchInput.placeholder = 'N';

        batchInput.onfocus = function() { this.select(); };
        batchInput.onclick = function() { this.select(); };
        batchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnApplyAll.click();
            }
        };

        toolbar.appendChild(batchInput);

        const label = document.createElement('span');
        label.innerText = '화';
        label.style.marginRight = '5px';
        toolbar.appendChild(label);

        const btnApplyAll = document.createElement('button');
        btnApplyAll.className = 'ns-mini-btn';
        btnApplyAll.innerText = '전체적용';
        btnApplyAll.onclick = () => {
            const val = parseInt(batchInput.value) || 1;
            const inputs = container.querySelectorAll('.ns-count-input');
            const rows = container.querySelectorAll('.ns-list-item');
            inputs.forEach((input, i) => {
                input.value = val;
                rows[i].classList.add('selected');
            });
        };
        toolbar.appendChild(btnApplyAll);

        const btnReset = document.createElement('button');
        btnReset.className = 'ns-mini-btn';
        btnReset.innerText = '초기화';
        btnReset.onclick = () => {
            const inputs = container.querySelectorAll('.ns-count-input');
            const rows = container.querySelectorAll('.ns-list-item');
            inputs.forEach((input, i) => {
                input.value = 0;
                rows[i].classList.remove('selected');
            });
        };
        toolbar.appendChild(btnReset);
        container.appendChild(toolbar);

        const info = document.createElement('div');
        info.style.fontSize = '11px';
        info.style.color = '#888';
        info.style.marginBottom = '5px';
        info.innerText = '* 제목 클릭 시 해당 위치까지 설정 / 입력칸 엔터 시 다음 칸 이동';
        container.appendChild(info);

        const listContainer = document.createElement('div');
        listContainer.className = 'ns-list-container';

        if (items.length > 0) {
            items.forEach((item, idx) => {
                const title = getTitle(item, idx);
                const div = document.createElement('div');
                div.className = 'ns-list-item';

                const titleSpan = document.createElement('span');
                titleSpan.className = 'ns-item-title';
                titleSpan.title = title;
                titleSpan.innerText = `${idx + 1}. ${title}`;

                titleSpan.onclick = () => {
                    const batchVal = parseInt(batchInput.value) || 1;
                    const allInputs = listContainer.querySelectorAll('.ns-count-input');
                    const allRows = listContainer.querySelectorAll('.ns-list-item');

                    allInputs.forEach((input, i) => {
                        if (i <= idx) {
                            input.value = batchVal;
                            allRows[i].classList.add('selected');
                        } else {
                            input.value = 0;
                            allRows[i].classList.remove('selected');
                        }
                    });
                };

                div.appendChild(titleSpan);

                const ctrlDiv = document.createElement('div');
                ctrlDiv.className = 'ns-count-ctrl';

                const minusBtn = document.createElement('button');
                minusBtn.className = 'ns-ctrl-btn';
                minusBtn.innerText = '-';
                minusBtn.tabIndex = -1;
                minusBtn.onclick = () => {
                    const input = div.querySelector('input');
                    const newVal = Math.max(0, parseInt(input.value) - 1);
                    input.value = newVal;
                    if (newVal > 0) div.classList.add('selected');
                    else div.classList.remove('selected');
                };

                const input = document.createElement('input');
                input.className = 'ns-count-input';
                input.type = 'number';
                input.min = 0;
                input.value = 0;

                input.onfocus = function() { this.select(); };
                input.onclick = function() { this.select(); };
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const allInputs = listContainer.querySelectorAll('.ns-count-input');
                        if (idx + 1 < allInputs.length) {
                            allInputs[idx + 1].focus();
                        } else {
                            input.blur();
                        }
                    }
                };

                input.onchange = () => {
                    if (parseInt(input.value) > 0) div.classList.add('selected');
                    else div.classList.remove('selected');
                };

                const plusBtn = document.createElement('button');
                plusBtn.className = 'ns-ctrl-btn';
                plusBtn.innerText = '+';
                plusBtn.tabIndex = -1;
                plusBtn.onclick = () => {
                    const input = div.querySelector('input');
                    input.value = parseInt(input.value) + 1;
                    div.classList.add('selected');
                };

                ctrlDiv.appendChild(minusBtn);
                ctrlDiv.appendChild(input);
                ctrlDiv.appendChild(plusBtn);
                div.appendChild(ctrlDiv);

                listContainer.appendChild(div);
            });
        } else {
            listContainer.innerHTML = '<div style="padding:10px;text-align:center;">목록을 불러올 수 없습니다.</div>';
        }
        container.appendChild(listContainer);

        const startBtn = document.createElement('button');
        startBtn.className = 'ns-action-btn';
        startBtn.id = 'btn-start';
        startBtn.innerText = '▶ 실행 (설정값 적용)';
        startBtn.onclick = () => {
            const inputs = listContainer.querySelectorAll('.ns-count-input');
            const targets = {};
            let total = 0;
            inputs.forEach((input, idx) => {
                const val = parseInt(input.value) || 0;
                targets[idx] = val;
                total += val;
            });

            if (total === 0) {
                alert('설정된 작품이 없습니다. 최소 1개 이상 설정해주세요.');
                return;
            }
            startRunning(targets);
        };
        container.appendChild(startBtn);

        document.body.appendChild(container);
    }

    // === UI 생성: 실행 중 패널 ===
    function createRunningPanelUI() {
        removeUI();
        const container = createPanelBase('자동 정주행 실행 중', false);

        const status = document.createElement('div');
        status.id = 'ns-status-text';
        status.className = 'ns-status';
        status.innerText = '초기화 중...';
        container.appendChild(status);

        const stopBtn = document.createElement('button');
        stopBtn.className = 'ns-action-btn';
        stopBtn.id = 'btn-stop';
        stopBtn.innerText = '■ 중지 / 초기화';
        stopBtn.onclick = () => {
            setRunning(false);
            setTargetCounts({});
            setIndex(0);
            setBatchOffset(0);
            setStatWorks(0); // [추가] 통계 초기화
            setStatClicks(0); // [추가] 통계 초기화
            location.reload();
        };
        container.appendChild(stopBtn);

        document.body.appendChild(container);
    }

    // === 헬퍼 함수 ===
    function createPanelBase(titleText, showClose = true) {
        const container = document.createElement('div');
        container.id = 'ns-auto-control-panel';

        const header = document.createElement('div');
        header.className = 'ns-header';

        const title = document.createElement('span');
        title.innerText = titleText;
        header.appendChild(title);

        if (showClose) {
            const closeBtn = document.createElement('span');
            closeBtn.className = 'ns-close-btn';
            closeBtn.innerHTML = '&#10005;'; // X
            closeBtn.title = '닫기';
            closeBtn.onclick = () => createLauncherUI();
            header.appendChild(closeBtn);
        }
        container.appendChild(header);
        return container;
    }

    function removeUI() {
        const panel = document.getElementById('ns-auto-control-panel');
        if (panel) panel.remove();
        const launcher = document.getElementById('ns-launcher-btn');
        if (launcher) launcher.remove();
    }

    function getTitle(liItem, idx) {
        const titleEl = liItem.querySelector('.list_tit a');
        return titleEl ? titleEl.innerText.trim() : `작품 ${idx + 1}`;
    }

    function updateStatus(msg) {
        const el = document.getElementById('ns-status-text');
        if (el) el.innerText = msg;
    }

    function startRunning(targets) {
        setIndex(0);
        setTargetCounts(targets);
        setBatchOffset(0);
        setRunning(true);
        // [추가] 시작 시 통계 초기화
        setStatWorks(0);
        setStatClicks(0);
        location.reload();
    }

    // 스크립트 로드 시 실행
    window.addEventListener('load', main);

})();