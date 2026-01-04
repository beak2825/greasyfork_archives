// ==UserScript==
// @name         Bing拼图游戏辅助
// @name:zh-CN   必应拼图游戏辅助
// @namespace    https://greasyfork.org/zh-CN/users/27731
// @version      1.3
// @description  半自动解决bing拼图
// @description:zh-CN  自动解决 Bing 拼图游戏。包含智能容器识别、参考图网格辅助、连带撤销功能，以及详细的进度显示。
// @author       viness
// @license      MIT
// @match        *://*.bing.com/spotlight/imagepuzzle*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560635/Bing%E6%8B%BC%E5%9B%BE%E6%B8%B8%E6%88%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/560635/Bing%E6%8B%BC%E5%9B%BE%E6%B8%B8%E6%88%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置参数 ===
    const CONFIG = {
        stepDelay: 450,
        colors: {
            valid: '#4caf50',   // 绿色
            invalid: '#f44336', // 红色
            ref: '#ffeb3b',     // 黄色
            text: '#f0f0f0'
        }
    };

    // === 注入 CSS 样式 ===
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .bing-puzzle-panel {
            position: fixed; top: 80px; right: 30px; z-index: 999999;
            width: 260px;
            background: rgba(25, 25, 25, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: ${CONFIG.colors.text};
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
            font-size: 13px;
            overflow: hidden;
            transition: opacity 0.3s;
        }
        .bing-puzzle-header {
            background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .bing-puzzle-body { padding: 15px; }
        .step-box { margin-bottom: 12px; animation: fadeIn 0.3s ease; }
        .step-label { color: #aaa; margin-bottom: 6px; font-size: 12px; display: flex; align-items: center; }
        .step-label::before {
            content: ''; display: inline-block; width: 6px; height: 6px;
            background: #666; border-radius: 50%; margin-right: 6px;
        }
        .step-active .step-label { color: #fff; }
        .step-active .step-label::before { background: ${CONFIG.colors.valid}; box-shadow: 0 0 5px ${CONFIG.colors.valid}; }

        .bpa-btn {
            width: 100%; padding: 10px; border: none; border-radius: 6px;
            background: rgba(255, 255, 255, 0.1); color: #ccc; cursor: pointer;
            transition: all 0.2s; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .bpa-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.2); color: #fff; transform: translateY(-1px); }
        .bpa-btn:disabled { opacity: 0.7; cursor: not-allowed; background: rgba(255,0,0,0.1); color: #ff9999; }

        .btn-exec { background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); color: white; box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3); }
        .btn-exec:hover:not(:disabled) { background: linear-gradient(135deg, #388e3c 0%, #66bb6a 100%); box-shadow: 0 6px 14px rgba(76, 175, 80, 0.4); }
        .btn-reset { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #888; padding: 6px; font-size: 12px; }
        .btn-reset:hover { border-color: #aaa; color: #aaa; }

        .status-container { margin-top: 15px; background: rgba(0,0,0,0.3); border-radius: 6px; padding: 10px; display: none; }
        .status-text { text-align: center; color: #fff; font-size: 12px; margin-bottom: 6px; font-family: monospace; }
        .progress-bar-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar-fill { height: 100%; width: 0%; background: ${CONFIG.colors.valid}; transition: width 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .puzzle-helper-num { font-family: "Segoe UI", sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
    `;
    document.head.appendChild(styleSheet);

    // === UI 初始化 ===
    const panel = document.createElement('div');
    panel.className = 'bing-puzzle-panel';
    panel.innerHTML = `
        <div class="bing-puzzle-header">
            <span>🧩 拼图助手</span>
            <span style="font-size:10px; opacity:0.6;">v1.3</span>
        </div>
        <div class="bing-puzzle-body">
            <div id="step-1" class="step-box step-active">
                <div class="step-label">1. 选择拼图区域 (3x3)</div>
                <button id="btn-select-puzzle" class="bpa-btn">🎯 点击选取拼图</button>
            </div>
            <div id="step-2" class="step-box" style="display:none;">
                <div class="step-label">2. 选择参考图</div>
                <button id="btn-select-ref" class="bpa-btn" style="color:#ffeb3b;">🖼️ 点击选取参考图</button>
            </div>
            <div id="step-3" class="step-box" style="display:none;">
                <div class="step-label">3. 依次点击匹配 (右键撤销)</div>
                <div id="instruction-panel" style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; text-align:center; margin-bottom:10px; border:1px solid rgba(255,255,255,0.1); min-height: 24px;">
                    <div id="instruction-text" style="font-weight:bold; font-size:15px; color:#fff;">准备就绪</div>
                </div>
                <button id="btn-exec" class="bpa-btn btn-exec" style="display:none;">▶ 开始自动执行</button>
                <button id="btn-reset" class="bpa-btn btn-reset" style="margin-top:8px;">↺ 重置所有步骤</button>
            </div>
            <div id="status-container" class="status-container">
                <div id="status-text" class="status-text">准备计算...</div>
                <div class="progress-bar-bg">
                    <div id="progress-bar-fill" class="progress-bar-fill"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 全局变量
    let puzzleTiles = [];
    let puzzleState = new Array(9).fill(null);
    let placedNumbers = new Set();
    let globalRefOverlay = null;
    let isMatchingPhase = false;
    let lastHighlightedElement = null;

    // ==========================================
    // 容器识别逻辑
    // ==========================================
    function findGridContainer(target) {
        let current = target;
        for (let i = 0; i < 5; i++) {
            if (!current || current === document.body) break;
            const children = Array.from(current.children).filter(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
            if (children.length === 9) return { container: current, children: children };
            current = current.parentElement;
        }
        return null;
    }

    // ==========================================
    // 视觉交互：智能高亮
    // ==========================================
    function clearHighlight() {
        if (lastHighlightedElement) {
            lastHighlightedElement.style.outline = "";
            lastHighlightedElement.style.boxShadow = "";
            lastHighlightedElement = null;
        }
    }

    function highlightHandler(e, mode) {
        clearHighlight();
        const target = e.target;
        if (mode === 'puzzle') {
            const result = findGridContainer(target);
            if (result) {
                lastHighlightedElement = result.container;
                lastHighlightedElement.style.outline = `3px solid ${CONFIG.colors.valid}`;
                lastHighlightedElement.style.boxShadow = `0 0 15px ${CONFIG.colors.valid}`;
                document.body.style.cursor = "pointer";
            } else {
                lastHighlightedElement = target;
                lastHighlightedElement.style.outline = `1px solid ${CONFIG.colors.invalid}`;
                document.body.style.cursor = "not-allowed";
            }
        } else {
            lastHighlightedElement = target;
            lastHighlightedElement.style.outline = `2px solid ${CONFIG.colors.ref}`;
        }
    }

    // ==========================================
    // 步骤 1 & 2：区域选择 (支持右键和Esc取消)
    // ==========================================
    function startSelection(mode, btnId) {
        const btn = document.getElementById(btnId);
        const oldText = btn.innerHTML;

        // 更改按钮文字，提示用户
        btn.innerHTML = "❌ 右键 / Esc 取消";
        btn.disabled = true;

        // 取消逻辑
        function onCancel(e) {
            // 如果是 Esc 键触发，防止默认行为
            if (e.type === 'keydown') e.preventDefault();

            // 如果是鼠标右键触发
            if (e.type === 'contextmenu') {
                e.preventDefault();
                e.stopPropagation();
            }

            cleanup();

            // 恢复 UI 状态，提示用户已取消
            btn.innerHTML = "🚫 已取消";
            setTimeout(() => { btn.innerHTML = oldText; }, 1000);
        }

        // 键盘监听逻辑
        function onKeyDown(e) {
            if (e.key === 'Escape') {
                onCancel(e);
            }
        }

        // 鼠标移动高亮
        function onMouseOver(e) { highlightHandler(e, mode); }

        // 确认选择
        function onClick(e) {
            e.preventDefault(); e.stopPropagation();

            if (mode === 'puzzle') {
                const result = findGridContainer(e.target);
                if (!result) return; // 点错不取消，继续等待

                puzzleTiles = result.children;
                puzzleTiles.forEach(t => t.style.boxShadow = `inset 0 0 0 1px ${CONFIG.colors.valid}`);

                document.getElementById('step-1').className = 'step-box';
                document.getElementById('step-1').style.display = 'none';
                document.getElementById('step-2').style.display = 'block';
                document.getElementById('step-2').className = 'step-box step-active';

            } else {
                createRefGrid(e.target);
                document.getElementById('step-2').className = 'step-box';
                document.getElementById('step-2').style.display = 'none';
                document.getElementById('step-3').style.display = 'block';
                document.getElementById('step-3').className = 'step-box step-active';
                startMatchingPhase();
            }
            cleanup();
        }

        function cleanup() {
            clearHighlight();
            document.body.removeEventListener('mouseover', onMouseOver, true);
            document.body.removeEventListener('click', onClick, true);
            document.body.removeEventListener('contextmenu', onCancel, true); // 移除右键监听
            document.removeEventListener('keydown', onKeyDown, true); // 移除键盘监听
            document.body.style.cursor = "default";
            btn.innerHTML = oldText; btn.disabled = false;
        }

        // 绑定事件
        document.body.addEventListener('mouseover', onMouseOver, true);
        document.body.addEventListener('click', onClick, true);
        document.body.addEventListener('contextmenu', onCancel, true); // 绑定右键取消
        document.addEventListener('keydown', onKeyDown, true); // 绑定键盘取消
    }

    // ==========================================
    // 辅助功能：参考图网格
    // ==========================================
    function createRefGrid(target) {
        if (globalRefOverlay) globalRefOverlay.remove();
        const rect = target.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute; top: ${rect.top + window.scrollY}px; left: ${rect.left + window.scrollX}px;
            width: ${rect.width}px; height: ${rect.height}px; z-index: 999999;
            pointer-events: none; display: grid;
            grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
            border: 2px solid ${CONFIG.colors.ref}; box-sizing: border-box;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;
        for (let i = 1; i <= 9; i++) {
            const cell = document.createElement('div');
            cell.innerText = i === 9 ? "" : i;
            cell.style.cssText = `border: 1px dashed rgba(255,255,255,0.4); display: flex; justify-content: center; align-items: center; color: ${CONFIG.colors.ref}; font-size: 18px; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.9);`;
            overlay.appendChild(cell);
        }
        document.body.appendChild(overlay);
        globalRefOverlay = overlay;
    }

    // ==========================================
    // 步骤 3：匹配与撤销
    // ==========================================
    function startMatchingPhase() {
        isMatchingPhase = true;
        puzzleState = new Array(9).fill(null);
        placedNumbers.clear();
        updateInstruction();

        puzzleTiles.forEach((tile, index) => {
            tile.addEventListener('click', (e) => handleTileClick(e, index, tile), true);
            tile.addEventListener('contextmenu', (e) => handleTileUndo(e, index, tile), true);
            tile.addEventListener('mousedown', (e) => { if(isMatchingPhase) e.stopPropagation(); }, true);
            tile.addEventListener('mouseup', (e) => { if(isMatchingPhase) e.stopPropagation(); }, true);
        });
    }

    function handleTileClick(e, index, tile) {
        if (isMatchingPhase) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        } else { return; }

        const num = getNextNum();
        if (num && puzzleState[index] === null) {
            puzzleState[index] = num;
            placedNumbers.add(num);
            addOverlay(tile, num);
            updateInstruction();
        }
    }

    function handleTileUndo(e, index, tile) {
        if (isMatchingPhase) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        } else { return; }

        const numToUndo = puzzleState[index];
        if (!numToUndo) return;

        for (let i = 0; i < 9; i++) {
            const currentNum = puzzleState[i];
            if (currentNum !== null && currentNum >= numToUndo) {
                puzzleState[i] = null;
                placedNumbers.delete(currentNum);
                removeOverlay(puzzleTiles[i]);
            }
        }
        updateInstruction();
    }

    function getNextNum() {
        for (let i = 1; i <= 8; i++) if (!placedNumbers.has(i)) return i;
        return null;
    }

    function updateInstruction() {
        const num = getNextNum();
        const txt = document.getElementById('instruction-text');
        const btnExec = document.getElementById('btn-exec');

        if (num) {
            txt.innerHTML = `点击拼图 <span style="color:${CONFIG.colors.valid}; font-size:22px;">${num}</span> 号`;
            btnExec.style.display = 'none';
        } else {
            txt.innerText = "✅ 匹配完成，请执行";
            btnExec.style.display = 'flex';
        }
    }

    function addOverlay(el, num) {
        let container = el;
        if (el.tagName === 'IMG') container = el.parentElement;
        if (window.getComputedStyle(container).position === 'static') container.style.position = 'relative';

        const div = document.createElement('div');
        div.className = 'puzzle-helper-num';
        div.innerText = num;
        div.style.cssText = `
            position:absolute; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.6); color:#fff; font-size:32px; font-weight:bold;
            display:flex; justify-content:center; align-items:center;
            pointer-events:none; z-index:1000; border-radius: 4px;
        `;
        container.appendChild(div);
    }

    function removeOverlay(el) {
        let container = el;
        if (el.tagName === 'IMG') container = el.parentElement;
        const div = container.querySelector('.puzzle-helper-num');
        if(div) div.remove();
    }

    // ==========================================
    // 执行阶段
    // ==========================================
    async function solveAndRun() {
        isMatchingPhase = false;

        const emptyIndex = puzzleState.findIndex(val => val === null);
        if (emptyIndex !== -1) puzzleState[emptyIndex] = 0;

        document.querySelectorAll('.puzzle-helper-num').forEach(el => el.remove());
        if(globalRefOverlay) globalRefOverlay.remove();
        document.getElementById('btn-exec').style.display = 'none';
        document.getElementById('instruction-panel').style.display = 'none';

        const statusContainer = document.getElementById('status-container');
        const statusText = document.getElementById('status-text');
        const progressBar = document.getElementById('progress-bar-fill');
        statusContainer.style.display = 'block';

        const solution = solvePuzzleAStar(puzzleState);

        if (!solution) {
            statusText.innerText = "❌ 无解 (请重置检查顺序)";
            statusText.style.color = CONFIG.colors.invalid;
            isMatchingPhase = true;
            return;
        }

        const totalSteps = solution.length;

        for (let i = 0; i < totalSteps; i++) {
            const tileIndex = solution[i];
            const tile = puzzleTiles[tileIndex];

            const currentStep = i + 1;
            const remaining = totalSteps - currentStep;
            const percent = (currentStep / totalSteps) * 100;

            statusText.innerHTML = `总共: ${totalSteps} | 当前: ${currentStep} | 剩余: ${remaining}`;
            progressBar.style.width = `${percent}%`;

            if (tile) {
                tile.click();
                const img = tile.querySelector('img');
                if (img) img.click();
            }

            await new Promise(r => setTimeout(r, CONFIG.stepDelay));
        }

        statusText.innerText = "🎉 执行完成！";
        setTimeout(() => {
            statusContainer.style.opacity = '0';
            setTimeout(() => { statusContainer.style.display = 'none'; statusContainer.style.opacity = '1'; }, 500);
        }, 3000);
    }

    document.getElementById('btn-select-puzzle').onclick = () => startSelection('puzzle', 'btn-select-puzzle');
    document.getElementById('btn-select-ref').onclick = () => startSelection('ref', 'btn-select-ref');
    document.getElementById('btn-reset').onclick = () => location.reload();
    document.getElementById('btn-exec').onclick = solveAndRun;

    function solvePuzzleAStar(s){const g=[1,2,3,4,5,6,7,8,0];const k=v=>v.join('');const h=d=>{let t=0;for(let i=0;i<9;i++){if(d[i]===0)continue;let x=d[i]-1;t+=Math.abs(Math.floor(i/3)-Math.floor(x/3))+Math.abs((i%3)-(x%3))}return t};const o=[{s:s,g:0,h:h(s),p:[]}];const c=new Set();let z=0;while(o.length&&z++<5000){o.sort((a,b)=>(a.g+a.h)-(b.g+b.h));const u=o.shift();if(k(u.s)===k(g))return u.p;c.add(k(u.s));const idx=u.s.indexOf(0);const r=Math.floor(idx/3),l=idx%3;const n=[];if(r>0)n.push(idx-3);if(r<2)n.push(idx+3);if(l>0)n.push(idx-1);if(l<2)n.push(idx+1);for(let v of n){const ns=[...u.s];[ns[idx],ns[v]]=[ns[v],ns[idx]];if(!c.has(k(ns)))o.push({s:ns,g:u.g+1,h:h(ns),p:[...u.p,v]})}}return null}

})();