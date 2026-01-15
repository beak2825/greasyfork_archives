// ==UserScript==
// @name         扫雷+数独+拼图 三合一全能外挂【左侧悬浮窗·完美稳定版】
// @namespace    http://tampermonkey.net/
// @version      12.6
// @description  彻底修复所有拼写错误+加载问题！三重保障稳定显示，行列宫缺数+推荐填数+禁用非推荐按钮+一键通关，零报错零警告！
// @author       豆包
// @match        *://sjz.hengj.cn/minig/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562422/%E6%89%AB%E9%9B%B7%2B%E6%95%B0%E7%8B%AC%2B%E6%8B%BC%E5%9B%BE%20%E4%B8%89%E5%90%88%E4%B8%80%E5%85%A8%E8%83%BD%E5%A4%96%E6%8C%82%E3%80%90%E5%B7%A6%E4%BE%A7%E6%82%AC%E6%B5%AE%E7%AA%97%C2%B7%E5%AE%8C%E7%BE%8E%E7%A8%B3%E5%AE%9A%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/562422/%E6%89%AB%E9%9B%B7%2B%E6%95%B0%E7%8B%AC%2B%E6%8B%BC%E5%9B%BE%20%E4%B8%89%E5%90%88%E4%B8%80%E5%85%A8%E8%83%BD%E5%A4%96%E6%8C%82%E3%80%90%E5%B7%A6%E4%BE%A7%E6%82%AC%E6%B5%AE%E7%AA%97%C2%B7%E5%AE%8C%E7%BE%8E%E7%A8%B3%E5%AE%9A%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 全局配置 =====================
    let isSudokuAssistOpen = false;
    const PANEL_ZINDEX = 99999999;
    const DEBUG_MODE = false;
    let panelCreated = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 15;
    const CHECK_INTERVAL = 500;

    function log(msg) {
        if(DEBUG_MODE) console.log(`[三合一外挂][${new Date().toLocaleTimeString()}] ${msg}`);
    }

    // ===================== 面板拖动功能 =====================
    function dragElement(elmnt) {
        if(!elmnt) return;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.right = "auto";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // ===================== 扫雷功能 =====================
    function mineSweeperOneKeyMark(showMsg) {
        if (!window.gameBoard || !window.boardWidth || !window.boardHeight) {
            showMsg('⚠️ 扫雷游戏未加载');
            return;
        }
        let markCount = 0;
        for(let y = 0; y < window.boardHeight; y++){
            for(let x = 0; x < window.boardWidth; x++){
                if(window.gameBoard[y][x][1] === 1 && window.gameBoard[y][x][0] !== 2){
                    if(typeof window.toggleFlag === 'function'){
                        window.toggleFlag(x, y);
                        markCount++;
                    }
                }
            }
        }
        showMsg(`✅ 标记${markCount}个地雷`);
    }

    function mineSweeperOneKeyWin(showMsg) {
        if (!window.gameBoard) {
            showMsg('⚠️ 扫雷游戏未加载');
            return;
        }
        if(window.gameStatus !== 0) {
            showMsg('⚠️ 扫雷已结束');
            return;
        }
        if(typeof window.forceEvacuate === 'function'){
            window.forceEvacuate();
            showMsg('🎉 扫雷通关成功！');
        }
    }

    // ===================== 拼图一键还原 =====================
    function triggerPuzzleWin() {
        const puzzleTimer = document.getElementById('timer');
        const puzzleTimerInterval = window.timerInterval;
        if (puzzleTimerInterval) clearInterval(puzzleTimerInterval);
        window.timerInterval = -1;
        const puzzleMsg = document.getElementById('message');
        if (puzzleMsg) {
            const useTime = puzzleTimer ? puzzleTimer.textContent : '00:00';
            puzzleMsg.textContent = `恭喜您！拼图还原成功，用时 ${useTime}！`;
        }
        document.querySelectorAll('.puzzle-btn, #reset-btn, #shuffle-btn, .control-btn').forEach(btn => { btn.disabled = true; btn.style.opacity = 0.3; });
        document.querySelectorAll('.piece').forEach(p => { p.style.pointerEvents = 'none'; });
    }

    function puzzleOneKeyRestore(showMsg) {
        const puzzleBox = document.querySelector('.puzzle');
        const puzzlePieces = document.querySelectorAll('.piece');
        if (!puzzleBox || puzzlePieces.length === 0) {
            showMsg('⚠️ 未检测到拼图游戏');
            return;
        }
        puzzlePieces.forEach(piece => {
            piece.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)";
            piece.style.transition = "all 0.6s ease-out";
        });
        setTimeout(() => { triggerPuzzleWin(); }, 600);
        showMsg(`🎉 拼图一键还原成功！共还原${puzzlePieces.length}块碎片`);
    }

    // ===================== 数独一键解题 =====================
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }
    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    function triggerSudokuWin() {
        const timerDisplay = document.getElementById('timer');
        const timerInterval = window.timerInterval;
        if (timerInterval) clearInterval(timerInterval);
        window.timerInterval = -1;
        const messageDisplay = document.getElementById('message');
        if (messageDisplay) {
            const timeElapsed = timerDisplay ? timerDisplay.textContent : '00:00';
            messageDisplay.textContent = `恭喜您!您完成数独的时间是 ${timeElapsed}!`;
        }
        document.querySelectorAll('.cell.user-input').forEach(cell => { cell.style.pointerEvents = 'none'; });
        document.querySelectorAll('#number-input-panel .num-btn').forEach(btn => { btn.disabled = true; });
        const undoBtn = document.getElementById('undo-btn');
        const noteModeBtn = document.getElementById('note-mode-btn');
        if (undoBtn) undoBtn.disabled = true;
        if (noteModeBtn) noteModeBtn.disabled = true;
    }
    function sudokuOneKeySolve(showMsg) {
        const sudokuContainer = document.getElementById('sudoku-container');
        const cells = document.querySelectorAll('#sudoku-container .cell');
        if (!sudokuContainer || cells.length !== 81) {
            showMsg('⚠️ 未检测到数独盘面');
            return;
        }
        const sudokuBoard = Array(9).fill(0).map(() => Array(9).fill(0));
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row || 0);
            const col = parseInt(cell.dataset.col || 0);
            const val = cell.textContent.trim();
            if (val && cell.classList.contains('initial')) {
                sudokuBoard[row][col] = parseInt(val);
            }
        });
        const solveBoard = JSON.parse(JSON.stringify(sudokuBoard));
        const solved = solveSudoku(solveBoard);
        if (!solved) { showMsg('⚠️ 该数独无解'); return; }
        let fillCount = 0;
        cells.forEach(cell => {
            if (cell.classList.contains('initial')) return;
            const row = parseInt(cell.dataset.row || 0);
            const col = parseInt(cell.dataset.col || 0);
            const answer = solveBoard[row][col];
            cell.textContent = answer;
            fillCount++;
            cell.classList.remove('error', 'note-mode-display');
            cell.dataset.pencilNotes = '';
            cell.innerHTML = answer;
        });
        setTimeout(() => { triggerSudokuWin(); }, 300);
        showMsg(`🎉 数独解题完成！共填充${fillCount}格`);
    }

    // ===================== 核心：数独行列宫缺数+推荐填数【✅ 完全无拼写错误】 =====================
    function getCurrentSudokuData() {
        const cells = document.querySelectorAll('#sudoku-container .cell');
        if(!cells || cells.length !== 81) {
            log('未检测到81个单元格');
            return Array(9).fill(0).map(() => Array(9).fill(0));
        }
        const sudokuData = Array(9).fill(0).map(() => Array(9).fill(0));
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row || 0);
            const col = parseInt(cell.dataset.col || 0);
            const cellText = cell.textContent.trim();
            sudokuData[row][col] = /^[1-9]$/.test(cellText) ? parseInt(cellText) : 0;
        });
        return sudokuData;
    }

    function getSudokuLackNums(row, col) {
        if(row < 0 || row > 8 || col < 0 || col > 8) {
            log(`行列号越界：row=${row}, col=${col}`);
            return { rowLack: [], colLack: [], boxLack: [], recommendNums: [] };
        }
        const sudokuData = getCurrentSudokuData();
        const allNums = [1,2,3,4,5,6,7,8,9];

        const rowFilled = sudokuData[row].filter(num => num !== 0);
        const rowLack = allNums.filter(num => !rowFilled.includes(num));

        const colFilled = [];
        for(let i = 0; i < 9; i++){
            if(sudokuData[i] && sudokuData[i][col] !== 0) colFilled.push(sudokuData[i][col]);
        }
        // ✅ 绝对正确：变量名就是 colFilled 无任何多余字符
        const colLack = allNums.filter(num => !colFilled.includes(num));

        const boxFilled = [];
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                const r = startRow + i;
                const c = startCol + j;
                if(sudokuData[r] && sudokuData[r][c] !== 0) boxFilled.push(sudokuData[r][c]);
            }
        }
        const boxLack = allNums.filter(num => !boxFilled.includes(num));

        const recommendNums = rowLack.filter(num => {
            return colLack.includes(num) && boxLack.includes(num);
        });

        return { rowLack, colLack, boxLack, recommendNums };
    }

    // ===================== 推荐数字自动禁用非推荐按钮 =====================
    function enableAllNumButtons() {
        const numBtns = document.querySelectorAll('#number-input-panel .num-btn');
        if(numBtns.length === 0) return log('未找到数字按钮');
        numBtns.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });
    }

    function disableUnRecommendedNums(recommendNums) {
        const numBtns = document.querySelectorAll('#number-input-panel .num-btn');
        if(numBtns.length === 0) return log('未找到数字按钮');
        if(!recommendNums || recommendNums.length === 0){
            enableAllNumButtons();
            return;
        }
        numBtns.forEach(btn => {
            const btnVal = parseInt(btn.dataset.value);
            const isRecommend = recommendNums.includes(btnVal);
            btn.disabled = !isRecommend;
            btn.style.opacity = isRecommend ? "1" : "0.3";
            btn.style.cursor = isRecommend ? "pointer" : "not-allowed";
        });
    }

    // ===================== 创建悬浮面板 =====================
    function createLeftFloatPanel() {
        if (panelCreated) { log('悬浮窗已创建，跳过重复创建'); return; }

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: ${PANEL_ZINDEX};
            width: 200px;
            background: rgba(30,30,40,0.98) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 4px 30px rgba(0,0,0,0.7);
            cursor: move;
            user-select: none;
            transition: all 0.3s ease;
            display: block !important;
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);

        const title = document.createElement('div');
        title.style.cssText = `text-align:center;color:#fff;font-size:16px;font-weight:bold;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.2);`;
        title.innerText = '扫雷&数独&拼图 辅助面板';
        panel.appendChild(title);

        const btnBaseStyle = `width:100%;height:36px;line-height:36px;border:none;border-radius:6px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;margin-bottom:8px;transition:all 0.2s ease;text-align:center;`;
        const mineMarkBtn = document.createElement('button'); mineMarkBtn.style.cssText = btnBaseStyle + `background:linear-gradient(135deg, #1677ff, #0c5fc9);`; mineMarkBtn.innerText = '💣 扫雷 - 一键标雷';
        const mineWinBtn = document.createElement('button'); mineWinBtn.style.cssText = btnBaseStyle + `background:linear-gradient(135deg, #00b42a, #009122);`; mineWinBtn.innerText = '🏆 扫雷 - 一键通关';
        const puzzleRestoreBtn = document.createElement('button'); puzzleRestoreBtn.style.cssText = btnBaseStyle + `background:linear-gradient(135deg, #ff9f43, #ff6b35);`; puzzleRestoreBtn.innerText = '🧩 拼图 - 一键还原';
        const sudokuSolveBtn = document.createElement('button'); sudokuSolveBtn.style.cssText = btnBaseStyle + `background:linear-gradient(135deg, #722ed1, #5a23b5);`; sudokuSolveBtn.innerText = '🧩 数独 - 一键解题';
        const sudokuAssistBtn = document.createElement('button'); sudokuAssistBtn.style.cssText = btnBaseStyle + `background:linear-gradient(135deg, #666666, #444444);height:32px;line-height:32px;font-size:11px;`; sudokuAssistBtn.innerText = '🔍 数独辅助【关闭】';

        panel.appendChild(mineMarkBtn);panel.appendChild(mineWinBtn);panel.appendChild(puzzleRestoreBtn);panel.appendChild(sudokuSolveBtn);panel.appendChild(sudokuAssistBtn);

        const assistPanel = document.createElement('div');
        assistPanel.style.cssText = `width:85%;padding:10px;color:#fff;font-size:12px;border-radius:6px;background:rgba(10,10,20,0.9);border:1px solid rgba(255,255,255,0.1);display:block;line-height:1.8;white-space:pre-wrap;margin-top:10px;`;
        assistPanel.id = 'sudoku-assist-info';
        panel.appendChild(assistPanel);

        const msgBox = document.createElement('div');
        msgBox.style.cssText = `width:100%;min-height:28px;margin-top:10px;padding:5px 0;text-align:center;color:#ccc;font-size:11px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;`;
        msgBox.innerText = '准备就绪';
        panel.appendChild(msgBox);

        [mineMarkBtn, mineWinBtn, puzzleRestoreBtn, sudokuSolveBtn, sudokuAssistBtn].forEach(btn => {
            btn.onmouseover = () => btn.style.opacity = 0.9;
            btn.onmouseout = () => btn.style.opacity = 1;
        });

        const showMessage = (text) => {
            msgBox.innerText = text; msgBox.style.opacity = '1'; setTimeout(() => msgBox.style.opacity = '0', 3000);
        };

        mineMarkBtn.onclick = () => mineSweeperOneKeyMark(showMessage);
        mineWinBtn.onclick = () => mineSweeperOneKeyWin(showMessage);
        puzzleRestoreBtn.onclick = () => puzzleOneKeyRestore(showMessage);
        sudokuSolveBtn.onclick = () => sudokuOneKeySolve(showMessage);

        document.addEventListener('click', (e) => {
            const cell = e.target;
            const isSudokuCell = cell.classList.contains('cell') && cell.dataset.row && cell.dataset.col && cell.closest('#sudoku-container');

            if (!isSudokuAssistOpen || !isSudokuCell) {
                assistPanel.style.display = 'none'; assistPanel.innerHTML = ''; enableAllNumButtons(); return;
            }
            if(cell.classList.contains('initial')){
                assistPanel.innerHTML = `<span style="color:#ffd700;">当前格子是固定数字，不可填写</span>`;
                assistPanel.style.display = 'block'; enableAllNumButtons(); return;
            }

            const row = parseInt(cell.dataset.row || 0);
            const col = parseInt(cell.dataset.col || 0);
            const { rowLack, colLack, boxLack, recommendNums } = getSudokuLackNums(row, col);

            // ✅ 绝对正确：变量名就是 colLack 无任何多余字符
            assistPanel.innerHTML = `
当前选中：行${row+1} | 列${col+1}
━━━━━━━━━━━━
本行剩余：${rowLack.join('  ') || '无'}
本列剩余：${colLack.join('  ') || '无'}
本九宫格剩余：${boxLack.join('  ') || '无'}
━━━━━━━━━━━━
<span style="color:#00ff9d;font-weight:bold;">✅ 推荐填入：${recommendNums.join('  ') || '无'}</span>
            `;
            assistPanel.style.display = 'block';
            disableUnRecommendedNums(recommendNums);
        });

        sudokuAssistBtn.onclick = function() {
            isSudokuAssistOpen = !isSudokuAssistOpen;
            if(isSudokuAssistOpen){
                this.style.background = 'linear-gradient(135deg, #ff7d00, #ff5500)';
                this.innerText = '🔍 数独辅助【开启】';
                assistPanel.style.display = 'block';
                assistPanel.innerHTML = '<span style="color:#ffd700;">点击数独格子查看提示</span>';
            }else{
                this.style.background = 'linear-gradient(135deg, #666666, #444444)';
                this.innerText = '🔍 数独辅助【关闭】';
                assistPanel.style.display = 'none'; assistPanel.innerHTML = ''; enableAllNumButtons();
            }
        };

        document.body.appendChild(panel);
        dragElement(panel);
        panelCreated = true;
        log('悬浮窗创建成功');
        showMessage('🎉 悬浮窗已就绪！');
    }

    // ===================== 三重保障初始化 =====================
    function isGameReady() {
        return document.getElementById('sudoku-container') || document.querySelector('.puzzle') || window.gameBoard || document.getElementById('timer') || document.getElementById('message');
    }
    function smartInit() {
        initAttempts++;
        log(`初始化尝试 ${initAttempts}/${MAX_INIT_ATTEMPTS}`);
        if (panelCreated) return;
        if (isGameReady()) { createLeftFloatPanel(); return; }
        if (initAttempts < MAX_INIT_ATTEMPTS) setTimeout(smartInit, CHECK_INTERVAL);
        else createLeftFloatPanel();
    }
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => { if (!panelCreated && isGameReady()) createLeftFloatPanel(); });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        log('页面变化监听器已启动');
    }

    // ===================== 初始化入口 =====================
    smartInit();
    observePageChanges();
    document.addEventListener('DOMContentLoaded', () => { if (!panelCreated) smartInit(); });
    window.addEventListener('load', () => { if (!panelCreated) smartInit(); });

})();