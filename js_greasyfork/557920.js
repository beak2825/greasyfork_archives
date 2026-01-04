// ==UserScript==
// @name         SOOP 자동 미션보드 (가변 빙고 + 폰트 설정 + 탭별 연동)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  달력/빙고 미션보드 팝업 + 배경/미션/폰트 저장 + 별풍선 자동 체크 (버튼 누른 방송만 연동, 빙고 크기 자유 설정, 셀 독립)
// @match        *://*/*
// @grant        none
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/557920/SOOP%20%EC%9E%90%EB%8F%99%20%EB%AF%B8%EC%85%98%EB%B3%B4%EB%93%9C%20%28%EA%B0%80%EB%B3%80%20%EB%B9%99%EA%B3%A0%20%2B%20%ED%8F%B0%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%2B%20%ED%83%AD%EB%B3%84%20%EC%97%B0%EB%8F%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557920/SOOP%20%EC%9E%90%EB%8F%99%20%EB%AF%B8%EC%85%98%EB%B3%B4%EB%93%9C%20%28%EA%B0%80%EB%B3%80%20%EB%B9%99%EA%B3%A0%20%2B%20%ED%8F%B0%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%2B%20%ED%83%AD%EB%B3%84%20%EC%97%B0%EB%8F%99%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_BG_URL =
        'https://source.unsplash.com/random/1000x1000/?gaming,abstract';
    const DEFAULT_BINGO_MISSIONS = [
        10, 33, 50, 100, 109, 282, 300, 500,
        1000, 1004, 1205, 1500, 2000, 3000, 5000, 9999
    ];

    let popup = null;
    let boardOpenedHere = false; // 이 탭에서 버튼 눌렀는지

    // -----------------------------
    // 1. 팝업 열기 + 기본 HTML 주입
    // -----------------------------
    function openMissionBoard() {
        boardOpenedHere = true;

        if (popup && !popup.closed) {
            popup.focus();
            return;
        }

        const pw = Math.min(window.screen.availWidth - 40, 1200);
        const ph = Math.min(window.screen.availHeight - 80, 900);

        popup = window.open(
            '',
            'SOOP_MISSION_BOARD',
            'resizable=yes,scrollbars=yes,width=' + pw + ',height=' + ph
        );
        if (!popup) return;

        popup.document.open();
        popup.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SOOP_MISSION_BOARD</title>
    <style>
        :root {
            --count-font-size: 26px;
            --mission-font-size: 18px;
        }

        body {
            margin:0;
            background-color:#111;
            font-family:'Malgun Gothic', sans-serif;
            background-size:cover;
            background-position:center;
            color:white;
        }
        #app {
            display:flex;
            flex-direction:column;
            align-items:center;
            padding:15px;
            gap:15px;
            height:100vh;
            box-sizing:border-box;
            background:rgba(0,0,0,0.4);
        }
        /* 상단 패널 */
        #config-panel {
            width:95%;
            max-width:900px;
            background:rgba(0,0,0,0.8);
            padding:15px;
            border-radius:8px;
            display:flex;
            flex-direction:column;
            gap:10px;
            font-size:14px;
        }
        #config-panel input[type="text"] {
            width:300px;
            max-width:60vw;
            padding:5px;
            border-radius:4px;
            border:none;
        }
        #config-panel input[type="number"] {
            padding:3px;
            border-radius:4px;
            border:none;
            width:60px;
            text-align:center;
        }
        #config-panel button {
            padding:5px 10px;
            border:none;
            border-radius:4px;
            cursor:pointer;
            background:#FF9800;
            color:white;
            font-weight:bold;
        }
        #reset-board-btn {
            background:#D32F2F !important;
        }
        .title-bar {
            width:95%;
            max-width:900px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:12px;
        }
        .month-title {
            font-size:20px;
            font-weight:bold;
            text-align:center;
        }

        /* 미션판 컨테이너 */
        #mission-container {
            margin-top:5px;
            width:95%;
            max-width:900px;
            min-height:420px;
            padding:10px;
            border:3px solid #fff;
            border-radius:12px;
            background:rgba(0,0,0,0.7);
            box-shadow:0 4px 10px rgba(0,0,0,0.5);
            box-sizing:border-box;
            margin-left:auto;
            margin-right:auto;
        }

        /* grid 레이아웃 */
        .calendar-grid {
            display:grid;
            grid-template-columns:repeat(7, minmax(0,1fr));
            gap:6px;
            margin:0 auto;
        }
        .bingo-grid {
            display:grid;
            gap:8px;
            margin:0 auto;
        }

        .day-header {
            text-align:center;
            font-weight:bold;
            padding:5px 0;
            color:#FFD700;
            background-color:#333;
            border-radius:4px;
        }

        .cell {
            background:#fff;
            border-radius:4px;
            display:flex;
            flex-direction:column;
            justify-content:space-around;
            align-items:center;
            position:relative;
            height:110px;
            padding:6px;
            cursor:pointer;
            box-sizing:border-box;
        }
        .bingo-grid .cell {
            height:120px;
        }
        .cell span,
        .cell .day,
        .cell .count {
            color:#000;
            font-size:14px;
        }
        /* 숫자 폰트: 변수 사용 */
        .bingo-grid .cell .count,
        .calendar-grid .cell .count {
            font-size:var(--count-font-size);
            font-weight:bold;
        }

        .mission-input {
            width:90%;
            padding:4px 6px;
            border:1px solid rgba(0,0,0,0.5);   /* 얇은 어두운 테두리 */
            border-radius:4px;
            font-size:var(--mission-font-size);  /* 내용 폰트 */
            text-align:center;
            box-sizing:border-box;
            background:transparent;              /* 회색 박스 제거 */
            color:#000;                          /* 항상 검은색 글씨 */
        }
        /* 입력창 클릭했을 때 강조 */
        .mission-input:focus {
            border-color:#FFEB3B;
            background:#000;
            color:#FFEB3B;
            outline:none;
        }

        .cell.checked {
            background:#4CAF50;
            border:3px solid #FFEB3B;
        }
        .cell.checked .day,
        .cell.checked .count {
            color:#fff;
        }
        /* ✅ 체크된 셀 안에서는 입력칸 테두리 안 보이게 */
        .cell.checked .mission-input {
            border-color:transparent;
        }

        .check-mark {
            display:none;
            position:absolute;
            font-size:26px;
            color:#FFEB3B;
            text-shadow:2px 2px 0 #000;
            top:4px;
            right:4px;
        }
        .cell.checked .check-mark {
            display:block;
        }
    </style>
</head>

<body>
    <div id="app">

        <div id="config-panel">
            <div>
                배경 이미지 URL:
                <input type="text" id="bg-url-input">
                <button id="save-bg-btn">적용/저장</button>
                <button id="reset-bg-btn">배경 초기화</button>
            </div>

            <div id="bingo-setting-group" style="display:none;">
                <p>빙고 미션 (쉼표로 구분, 셀 개수와 동일해야 함):</p>
                <input type="text" id="bingo-missions-input">
                <button id="save-missions-btn">미션 저장/적용</button>
                <button id="reset-missions-btn">미션 기본값</button>
            </div>

            <div id="bingo-size-group" style="display:none;">
                <p>빙고 크기 (가로 × 세로, 최대 10 × 10):</p>
                <input type="number" id="bingo-cols-input" min="1" max="10"> ×
                <input type="number" id="bingo-rows-input" min="1" max="10">
                <button id="save-size-btn">크기 적용</button>
            </div>

            <div id="font-size-group" style="display:none;">
                <p>폰트 크기 (px) – 숫자 / 내용</p>
                <input type="number" id="font-size-count-input" min="8" max="80">
                /
                <input type="number" id="font-size-mission-input" min="8" max="80">
                <button id="save-font-btn">폰트 적용</button>
            </div>

            <button id="reset-board-btn">현재 보드 초기화 (체크/미션 내용 삭제)</button>
        </div>

        <div class="title-bar">
            <button id="prev-month-btn" style="display:none;">◀ 이전</button>
            <div id="mission-title" class="month-title">미션 보드</div>
            <button id="next-month-btn" style="display:none;">다음 ▶</button>
            <button id="mode-toggle-btn">모드 전환</button>
        </div>

        <div id="mission-container">
            ✨ 미션 보드 준비중…
        </div>

    </div>
</body>
</html>
        `);
        popup.document.close();

        injectPopupLogic();
    }

    // ---------------------------------
    // 2. 팝업 안에 동작 스크립트 주입
    // ---------------------------------
    function injectPopupLogic() {
        if (!popup || popup.closed) return;
        const doc = popup.document;

        const script = doc.createElement('script');
        script.type = 'text/javascript';
        script.textContent = `
(function(){
    const DEFAULT_BG = '${DEFAULT_BG_URL}';
    const DEFAULT_MISSIONS = [${DEFAULT_BINGO_MISSIONS.join(',')}];

    let BINGO_MISSIONS = DEFAULT_MISSIONS.slice();
    let currentMode = 'CALENDAR';
    let currentDisplayDate = new Date();
    let bingoCols = parseInt(localStorage.getItem('bingo_cols') || '4', 10) || 4;
    let bingoRows = parseInt(localStorage.getItem('bingo_rows') || '4', 10) || 4;

    // 폰트 기본값
    let fontCountPx = parseInt(localStorage.getItem('font_count_px') || '26', 10) || 26;
    let fontMissionPx = parseInt(localStorage.getItem('font_mission_px') || '18', 10) || 18;

    function clampSize(v, minV, maxV) {
        v = parseInt(v, 10);
        if (isNaN(v) || v < minV) v = minV;
        if (v > maxV) v = maxV;
        return v;
    }

    function applyFontSizes() {
        document.documentElement.style.setProperty('--count-font-size', fontCountPx + 'px');
        document.documentElement.style.setProperty('--mission-font-size', fontMissionPx + 'px');

        const ci = document.getElementById('font-size-count-input');
        const mi = document.getElementById('font-size-mission-input');
        if (ci) ci.value = fontCountPx;
        if (mi) mi.value = fontMissionPx;
    }

    // 현재 가로×세로 셀 개수에 맞게 미션 배열 길이 조정
    function syncMissionsToSize() {
        const need = bingoCols * bingoRows;
        if (BINGO_MISSIONS.length < need) {
            const last = BINGO_MISSIONS.length ? BINGO_MISSIONS[BINGO_MISSIONS.length - 1] : 0;
            while (BINGO_MISSIONS.length < need) BINGO_MISSIONS.push(last);
        } else if (BINGO_MISSIONS.length > need) {
            BINGO_MISSIONS = BINGO_MISSIONS.slice(0, need);
        }
        localStorage.setItem('bingo_missions', JSON.stringify(BINGO_MISSIONS));
    }

    function loadState() {
        currentMode = localStorage.getItem('mission_mode') || 'CALENDAR';

        const bg = localStorage.getItem('mission_bg') || DEFAULT_BG;
        document.body.style.backgroundImage = 'url(' + bg + ')';
        var bgInput = document.getElementById('bg-url-input');
        if(bgInput) bgInput.value = bg;

        const missions = localStorage.getItem('bingo_missions');
        if (missions) {
            try { BINGO_MISSIONS = JSON.parse(missions); } catch(e){}
        }

        bingoCols = clampSize(bingoCols, 1, 10);
        bingoRows = clampSize(bingoRows, 1, 10);
        syncMissionsToSize();

        var miSet = document.getElementById('bingo-missions-input');
        if(miSet) miSet.value = BINGO_MISSIONS.join(', ');

        var ci = document.getElementById('bingo-cols-input');
        var ri = document.getElementById('bingo-rows-input');
        if (ci) ci.value = bingoCols;
        if (ri) ri.value = bingoRows;

        fontCountPx = clampSize(fontCountPx, 8, 80);
        fontMissionPx = clampSize(fontMissionPx, 8, 80);
        applyFontSizes();
    }

    function saveState() {
        localStorage.setItem('mission_mode', currentMode);
    }

    function render() {
        saveState();
        const container = document.getElementById('mission-container');
        if (!container) return;

        container.classList.remove('calendar-grid','bingo-grid');
        container.style.gridTemplateColumns = '';
        const title = document.getElementById('mission-title');

        if (currentMode === 'CALENDAR') {
            container.classList.add('calendar-grid');
            const y = currentDisplayDate.getFullYear();
            const m = currentDisplayDate.getMonth() + 1;

            title.textContent = y + '년 ' + m + '월 별풍선 달력 미션';
            document.getElementById('prev-month-btn').style.display = 'inline-block';
            document.getElementById('next-month-btn').style.display = 'inline-block';
            document.getElementById('bingo-setting-group').style.display = 'none';
            document.getElementById('bingo-size-group').style.display = 'none';
            document.getElementById('font-size-group').style.display = 'none';

            renderCalendar(container, currentDisplayDate);
        } else {
            container.classList.add('bingo-grid');
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(' + bingoCols + ', minmax(0,1fr))';

            title.textContent = '⭐ 별풍선 빙고 미션 (' + bingoCols + ' × ' + bingoRows + ')';
            document.getElementById('prev-month-btn').style.display = 'none';
            document.getElementById('next-month-btn').style.display = 'none';
            document.getElementById('bingo-setting-group').style.display = 'block';
            document.getElementById('bingo-size-group').style.display = 'block';
            document.getElementById('font-size-group').style.display = 'block';

            renderBingo(container);
        }
    }

    function renderCalendar(container, date) {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const days = new Date(y, m, 0).getDate();
        const first = new Date(y, m - 1, 1).getDay();

        let html = '';
        const week = ['일','월','화','수','목','금','토'];
        week.forEach(d => { html += '<div class="day-header">' + d + '</div>'; });

        for (let i=0;i<first;i++) html += '<div></div>';

        for (let d=1; d<=days; d++) {
            const code = m * 100 + d;
            const checked = localStorage.getItem('checked_calendar_' + code) === 'true' ? 'checked' : '';
            const desc = localStorage.getItem('desc_calendar_' + code) || '';

            html +=
                '<div class="cell ' + checked + '" id="cell-' + code + '" data-mode="calendar" data-id="' + code + '">' +
                    '<span class="day">' + d + '일</span>' +
                    '<span class="count">' + code + '개</span>' +
                    '<input type="text" class="mission-input" data-mode="calendar" data-id="' + code + '" value="' + desc.replace(/"/g,'&quot;') + '" />' +
                    '<div class="check-mark">✔</div>' +
                '</div>';
        }

        container.innerHTML = html;
    }

    function renderBingo(container) {
        let html = '';
        syncMissionsToSize();

        BINGO_MISSIONS.forEach((code, idx) => {
            const checked = localStorage.getItem('checked_bingo_' + idx) === 'true' ? 'checked' : '';
            const desc = localStorage.getItem('desc_bingo_' + idx) || '';

            html +=
                '<div class="cell ' + checked + '" id="bcell-' + idx + '" data-mode="bingo" data-id="' + idx + '" data-mission="' + code + '">' +
                    '<span class="count">' + code + '개</span>' +
                    '<input type="text" class="mission-input" data-mode="bingo" data-id="' + idx + '" value="' + desc.replace(/"/g,'&quot;') + '" />' +
                    '<div class="check-mark">✔</div>' +
                '</div>';
        });

        container.innerHTML = html;
    }

    function onCellClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        if (e.target.classList.contains('mission-input')) return;

        cell.classList.toggle('checked');
        const mode = cell.getAttribute('data-mode');
        const id = cell.getAttribute('data-id');
        const key = mode === 'calendar' ? 'checked_calendar_' : 'checked_bingo_';
        localStorage.setItem(key + id, cell.classList.contains('checked') ? 'true' : 'false');
    }

    function onInputBlur(e) {
        if (!e.target.classList.contains('mission-input')) return;

        const mode = e.target.getAttribute('data-mode');
        const id = e.target.getAttribute('data-id');
        const key = mode === 'calendar' ? 'desc_calendar_' : 'desc_bingo_';
        localStorage.setItem(key + id, e.target.value);
    }

    function resetBoard() {
        if (!confirm('현재 보드를 초기화하시겠습니까?')) return;

        if (currentMode === 'CALENDAR') {
            const y = currentDisplayDate.getFullYear();
            const m = currentDisplayDate.getMonth() + 1;
            const days = new Date(y, m, 0).getDate();
            for (let d=1; d<=days; d++) {
                const code = m * 100 + d;
                localStorage.removeItem('checked_calendar_' + code);
                localStorage.removeItem('desc_calendar_' + code);
            }
        } else {
            for (let i = 0; i < BINGO_MISSIONS.length; i++) {
                localStorage.removeItem('checked_bingo_' + i);
                localStorage.removeItem('desc_bingo_' + i);
            }
        }
        render();
    }

    function saveBackground() {
        const inp = document.getElementById('bg-url-input');
        const url = (inp.value || '').trim() || DEFAULT_BG;
        document.body.style.backgroundImage = 'url(' + url + ')';
        localStorage.setItem('mission_bg', url);
        alert('배경 이미지가 적용되었습니다.');
    }

    function resetBackground() {
        document.body.style.backgroundImage = 'url(' + DEFAULT_BG + ')';
        localStorage.setItem('mission_bg', DEFAULT_BG);
        var inp = document.getElementById('bg-url-input');
        if(inp) inp.value = DEFAULT_BG;
        alert('배경이 기본값으로 초기화되었습니다.');
    }

    function saveBingoMissions() {
        const val = document.getElementById('bingo-missions-input').value;
        const arr = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n>0);
        const need = bingoCols * bingoRows;
        if (arr.length !== need) {
            alert('현재 빙고 크기에는 ' + need + '개의 숫자가 필요합니다.');
            return;
        }
        BINGO_MISSIONS = arr;
        syncMissionsToSize();
        alert('빙고 미션이 저장되었습니다.');
        if (currentMode === 'BINGO') render();
    }

    function resetBingoMissions() {
        BINGO_MISSIONS = DEFAULT_MISSIONS.slice();
        syncMissionsToSize();
        document.getElementById('bingo-missions-input').value = BINGO_MISSIONS.join(', ');
        alert('빙고 미션이 기본값으로 초기화되었습니다.');
        if (currentMode === 'BINGO') render();
    }

    function saveBingoSize() {
        const ci = document.getElementById('bingo-cols-input');
        const ri = document.getElementById('bingo-rows-input');
        bingoCols = clampSize(ci.value, 1, 10);
        bingoRows = clampSize(ri.value, 1, 10);

        localStorage.setItem('bingo_cols', bingoCols);
        localStorage.setItem('bingo_rows', bingoRows);
        syncMissionsToSize();
        alert('빙고 크기가 ' + bingoCols + ' × ' + bingoRows + ' 로 설정되었습니다.');
        if (currentMode === 'BINGO') render();
    }

    function saveFontSizes() {
        const ci = document.getElementById('font-size-count-input');
        const mi = document.getElementById('font-size-mission-input');
        fontCountPx = clampSize(ci.value, 8, 80);
        fontMissionPx = clampSize(mi.value, 8, 80);
        localStorage.setItem('font_count_px', fontCountPx);
        localStorage.setItem('font_mission_px', fontMissionPx);
        applyFontSizes();
        alert('폰트 크기가 적용되었습니다.');
    }

    function initEvents() {
        const cont = document.getElementById('mission-container');
        cont.addEventListener('click', onCellClick);
        cont.addEventListener('blur', onInputBlur, true);

        document.getElementById('mode-toggle-btn').addEventListener('click', function(){
            currentMode = currentMode === 'CALENDAR' ? 'BINGO' : 'CALENDAR';
            render();
        });

        document.getElementById('prev-month-btn').addEventListener('click', function(){
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
            render();
        });

        document.getElementById('next-month-btn').addEventListener('click', function(){
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
            render();
        });

        document.getElementById('reset-board-btn').addEventListener('click', resetBoard);
        document.getElementById('save-bg-btn').addEventListener('click', saveBackground);
        document.getElementById('reset-bg-btn').addEventListener('click', resetBackground);
        document.getElementById('save-missions-btn').addEventListener('click', saveBingoMissions);
        document.getElementById('reset-missions-btn').addEventListener('click', resetBingoMissions);
        document.getElementById('save-size-btn').addEventListener('click', saveBingoSize);
        document.getElementById('save-font-btn').addEventListener('click', saveFontSizes);
    }

    // 별풍 들어오면 자동 체크
    window.addEventListener('message', function(e){
        const num = parseInt(e.data);
        if (!num) return;

        const calCell = document.getElementById('cell-' + num);
        if (calCell && calCell.getAttribute('data-mode') === 'calendar') {
            if (!calCell.classList.contains('checked')) {
                calCell.classList.add('checked');
                const id = calCell.getAttribute('data-id');
                localStorage.setItem('checked_calendar_' + id, 'true');
            }
            return;
        }

        const bingoCells = document.querySelectorAll('.cell[data-mode="bingo"][data-mission="' + num + '"]');
        for (const cell of bingoCells) {
            if (!cell.classList.contains('checked')) {
                cell.classList.add('checked');
                const id = cell.getAttribute('data-id');
                localStorage.setItem('checked_bingo_' + id, 'true');
                break;
            }
        }
    });

    loadState();
    render();
    initEvents();
})();
        `;
        doc.body.appendChild(script);
    }

    // -----------------------------
    // 3. 메인 페이지에 버튼 생성 (하단 중앙)
    // -----------------------------
    function createButton() {
        if (!document.body) return setTimeout(createButton, 300);

        const btn = document.createElement('button');
        btn.textContent = '🎲 미션보드 열기';
        Object.assign(btn.style, {
            position: 'fixed',
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            background: 'yellow',
            border: '3px solid red',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 999999
        });
        btn.onclick = openMissionBoard;
        document.body.appendChild(btn);
    }

    createButton();

    // -----------------------------
    // 4. 채팅 감지 → 팝업으로 전달
    // -----------------------------
    function startChatObserver() {
        const chatArea =
            document.querySelector('#chat_area') ||
            document.querySelector('.chat-list') ||
            document.querySelector('.ChatArea');

        if (!chatArea) {
            setTimeout(startChatObserver, 1000);
            return;
        }

        const regex = /별풍선[^0-9]*([\d,]+)\s*개/;

        new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    const text = node.innerText || node.textContent || '';
                    if (!text) return;

                    const match = text.match(regex);
                    if (!match) return;

                    const count = parseInt(match[1].replace(/,/g,''));
                    if (!count) return;

                    if (boardOpenedHere && popup && !popup.closed) {
                        popup.postMessage(count, '*');
                    }
                });
            });
        }).observe(chatArea, { childList: true, subtree: true });
    }

    startChatObserver();

})();
