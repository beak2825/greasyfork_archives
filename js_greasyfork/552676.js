// ==UserScript==
// @name         NekoIdle - 猫娘自动强化控制器
// @namespace    http://test.nekoidle.art/
// @version      3.0
// @description  精简界面 | 移动端优化 | 自动折叠 | 跳过按钮修复
// @author       Claude Code
// @match        *://test.nekoidle.art/game*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552676/NekoIdle%20-%20%E7%8C%AB%E5%A8%98%E8%87%AA%E5%8A%A8%E5%BC%BA%E5%8C%96%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552676/NekoIdle%20-%20%E7%8C%AB%E5%A8%98%E8%87%AA%E5%8A%A8%E5%BC%BA%E5%8C%96%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mainIntervalId = null;
    let isRunning = false;
    let isMinimized = false;

    // --- 创建精简悬浮控制面板 ---
    const panel = document.createElement('div');
    panel.id = 'auto-panel';
    panel.innerHTML = `
        <div id="panel-header">
            <span id="panel-title">🐱 强化</span>
            <span id="toggle-btn">−</span>
        </div>
        <div id="panel-content">
            <div id="status-bar">
                <span class="label">状态</span>
                <span id="status-text" class="stopped">●</span>
            </div>
            <div id="level-bar">
                <span class="label">当前</span>
                <span id="level-text">--</span>
            </div>
            <div id="target-bar">
                <span class="label">目标</span>
                <input type="number" id="target-input" value="12" min="1" max="99" />
            </div>
            <div id="btn-group">
                <button id="startBtn" class="ctrl-btn start">▶</button>
                <button id="stopBtn" class="ctrl-btn stop" disabled>■</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusText = document.getElementById('status-text');
    const levelText = document.getElementById('level-text');
    const targetInput = document.getElementById('target-input');
    const toggleBtn = document.getElementById('toggle-btn');
    const panelContent = document.getElementById('panel-content');

    // --- 折叠/展开功能 ---
    function togglePanel() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            panelContent.style.display = 'none';
            toggleBtn.textContent = '+';
            panel.classList.add('minimized');
        } else {
            panelContent.style.display = 'block';
            toggleBtn.textContent = '−';
            panel.classList.remove('minimized');
        }
    }

    toggleBtn.addEventListener('click', togglePanel);

    // --- 获取目标等级 ---
    function getTargetLevel() {
        const value = parseInt(targetInput.value);
        return (isNaN(value) || value < 1) ? 12 : value;
    }

    // --- 获取当前强化等级 ---
    function getCurrentLevel() {
        const levelElement = document.querySelector('.current');
        if (levelElement) {
            const match = levelElement.textContent.match(/\+?(\d+)/);
            if (match) return parseInt(match[1]);
        }
        return 0;
    }

    // --- 🆕 修复后的跳过按钮点击函数 ---
    function clickSkipButton() {
        // 方法1: 精确类名匹配（最优先）
        const skipBtn = document.querySelector('.btn.start-action');
        if (skipBtn && skipBtn.offsetParent !== null) {
            const text = skipBtn.textContent.trim();
            if (text === '跳过') {
                console.log('🔘 点击跳过按钮（精确匹配）');
                skipBtn.click();
                return true;
            }
        }
        
        // 方法2: 遍历所有 .btn 元素
        const btnElements = document.querySelectorAll('.btn');
        for (const btn of btnElements) {
            if (btn.offsetParent !== null && btn.textContent.trim() === '跳过') {
                console.log('🔘 点击跳过按钮（.btn匹配）');
                btn.click();
                return true;
            }
        }
        
        // 方法3: start-action 类匹配
        const startActionBtn = document.querySelector('.start-action');
        if (startActionBtn && startActionBtn.offsetParent !== null && 
            startActionBtn.textContent.trim() === '跳过') {
            console.log('🔘 点击跳过按钮（start-action匹配）');
            startActionBtn.click();
            return true;
        }
        
        // 方法4: 通用兜底（最后的后备方案）
        const allDivs = document.querySelectorAll('div');
        for (const div of allDivs) {
            const text = div.textContent.trim();
            // 确保是纯文本"跳过"（避免匹配父元素）
            if (div.offsetParent !== null && text === '跳过' && div.children.length === 0) {
                console.log('🔘 点击跳过按钮（通用匹配）');
                div.click();
                return true;
            }
        }
        
        return false;
    }

    // --- 查找并点击强化按钮 ---
    function findAndClick() {
        const currentLevel = getCurrentLevel();
        const targetLevel = getTargetLevel();

        // 更新显示
        levelText.textContent = currentLevel > 0 ? `+${currentLevel}` : '--';

        // 达到目标
        if (currentLevel >= targetLevel) {
            console.log(`✅ 达到 +${targetLevel}`);
            stopScript();
            
            if (confirm(`🎉 强化完成！\n当前: +${currentLevel}`)) {
                togglePanel();
            }
            return;
        }

        // 优先检测并点击跳过按钮
        if (clickSkipButton()) {
            return;
        }

        // 查找强化按钮
        const selectors = ['button', 'a', '[role="button"]', 'div'];
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element.offsetParent !== null && element.textContent.includes('强化')) {
                    element.click();
                    return;
                }
            }
        }
    }

    // --- 启动脚本 ---
    function startScript() {
        if (isRunning) return;

        const currentLevel = getCurrentLevel();
        const targetLevel = getTargetLevel();

        if (targetLevel < 1 || targetLevel > 99) {
            alert('⚠️ 目标等级需在 1-99 之间');
            return;
        }

        if (currentLevel >= targetLevel) {
            alert(`已达到 +${currentLevel}`);
            return;
        }

        isRunning = true;
        console.log(`🚀 启动 | +${currentLevel} → +${targetLevel}`);

        targetInput.disabled = true;
        mainIntervalId = setInterval(findAndClick, 200);

        statusText.textContent = '●';
        statusText.classList.remove('stopped');
        statusText.classList.add('running');
        startBtn.disabled = true;
        stopBtn.disabled = false;

        setTimeout(() => {
            if (isRunning && !isMinimized) {
                togglePanel();
            }
        }, 800);
    }

    // --- 停止脚本 ---
    function stopScript() {
        if (!isRunning) return;
        isRunning = false;
        console.log('⏹️ 停止');
        
        clearInterval(mainIntervalId);
        mainIntervalId = null;
        targetInput.disabled = false;

        statusText.textContent = '●';
        statusText.classList.remove('running');
        statusText.classList.add('stopped');
        startBtn.disabled = false;
        stopBtn.disabled = true;

        if (isMinimized) {
            togglePanel();
        }
    }

    startBtn.addEventListener('click', startScript);
    stopBtn.addEventListener('click', stopScript);
    targetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isRunning) startScript();
    });

    // --- 样式代码保持不变 ---
    GM_addStyle(`
        #auto-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 0;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            user-select: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 160px;
            max-width: 90vw;
        }

        #auto-panel.dragging {
            box-shadow: 0 16px 48px rgba(0,0,0,0.5);
            transform: scale(1.02);
            cursor: grabbing !important;
            transition: none;
        }

        #auto-panel.minimized {
            border-radius: 20px;
        }

        #panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            cursor: grab;
            color: white;
            font-weight: 600;
            font-size: 14px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px 12px 0 0;
            touch-action: none;
            transition: background 0.2s;
        }

        #panel-header:active {
            cursor: grabbing;
            background: rgba(255,255,255,0.2);
        }

        #auto-panel.minimized #panel-header {
            border-radius: 20px;
        }

        #panel-title {
            font-size: 16px;
            pointer-events: none;
        }

        #toggle-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: all 0.2s;
        }

        #toggle-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

        #toggle-btn:active {
            transform: scale(0.95);
        }

        #panel-content {
            padding: 12px;
            display: block;
        }

        #status-bar, #level-bar, #target-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;
            margin-bottom: 8px;
            background: rgba(255,255,255,0.15);
            border-radius: 8px;
            color: white;
            font-size: 13px;
        }

        .label {
            opacity: 0.9;
            font-weight: 500;
        }

        #status-text {
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s;
        }

        #status-text.running {
            color: #4ade80;
            animation: pulse 1.5s infinite;
        }

        #status-text.stopped {
            color: #f87171;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        #level-text {
            font-weight: bold;
            color: #fbbf24;
            font-size: 15px;
            min-width: 40px;
            text-align: right;
        }

        #target-input {
            width: 60px;
            padding: 4px 8px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            background: rgba(255,255,255,0.2);
            color: white;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            transition: all 0.2s;
        }

        #target-input:focus {
            outline: none;
            border-color: #4ade80;
            background: rgba(255,255,255,0.25);
            box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
        }

        #target-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        #btn-group {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        .ctrl-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .ctrl-btn.start {
            background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
        }

        .ctrl-btn.stop {
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        }

        .ctrl-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        .ctrl-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .ctrl-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none !important;
        }

        @media (max-width: 768px) {
            #auto-panel {
                top: 5px;
                right: 5px;
                font-size: 12px;
                min-width: 140px;
            }

            #panel-header {
                padding: 8px 12px;
                font-size: 13px;
            }

            #panel-title {
                font-size: 14px;
            }

            #panel-content {
                padding: 10px;
            }

            #status-bar, #level-bar, #target-bar {
                padding: 5px 8px;
                margin-bottom: 6px;
                font-size: 12px;
            }

            #target-input {
                width: 50px;
                font-size: 13px;
            }

            .ctrl-btn {
                padding: 8px;
                font-size: 14px;
            }

            #toggle-btn {
                width: 22px;
                height: 22px;
                font-size: 16px;
            }
        }

        @media (max-width: 380px) {
            #auto-panel {
                min-width: 120px;
            }
            
            .label {
                font-size: 11px;
            }
        }

        #target-input::-webkit-inner-spin-button,
        #target-input::-webkit-outer-spin-button {
            opacity: 1;
        }
    `);

    // --- 拖拽支持 ---
    let isDragging = false, offsetX, offsetY;
    const header = document.getElementById('panel-header');

    function startDrag(e) {
        if (e.target === toggleBtn) return;
        isDragging = true;
        panel.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offsetX = clientX - panel.offsetLeft;
        offsetY = clientY - panel.offsetTop;
        
        e.preventDefault();
        document.body.style.userSelect = 'none';
    }

    function doDrag(e) {
        if (!isDragging) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        let left = clientX - offsetX;
        let top = clientY - offsetY;

        const maxLeft = window.innerWidth - panel.offsetWidth;
        const maxTop = window.innerHeight - panel.offsetHeight;
        
        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        
        e.preventDefault();
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            panel.classList.remove('dragging');
            document.body.style.userSelect = '';
        }
    }

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);

    header.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);

    // --- 初始化检测 ---
    setTimeout(() => {
        const level = getCurrentLevel();
        if (level > 0) {
            levelText.textContent = `+${level}`;
            console.log(`✅ 检测到等级: +${level}`);
        }
    }, 1000);

})();
