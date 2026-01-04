// ==UserScript==
// @name         游戏房间监控助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  监控游戏房间并自动加入指定类型的房间，战斗结束后自动返回继续监控
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554476/%E6%B8%B8%E6%88%8F%E6%88%BF%E9%97%B4%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554476/%E6%B8%B8%E6%88%8F%E6%88%BF%E9%97%B4%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置参数（方便修改）====================
    const REFRESH_INTERVAL = 10; // 刷新间隔（秒）
    const REFRESH_RANDOM_RANGE = 3; // 随机浮动范围（秒），实际间隔为 REFRESH_INTERVAL ± REFRESH_RANDOM_RANGE
    // ============================================================

    // 房间类型列表
    const ROOM_TYPES = [
        '魔物巢穴',
        '符石遗迹',
        '虚空裂隙',
        '圣物遗迹',
        '魔龙山巅'
    ];

    // 脚本状态
    let scriptState = {
        mode: 'idle', // idle, monitoring, inBattle
        monitorInterval: null,
        countdownInterval: null,
        battleCheckInterval: null,
        remainingSeconds: 0,
        joinedRoomType: null,
        lastBattleHp: null
    };

    // 添加样式
    GM_addStyle(`
        #room-monitor-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 180px;
            background: rgba(0, 0, 0, 0.85);
            border-radius: 4px;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
            z-index: 999999;
            font-family: Arial, sans-serif;
            color: #e0e0e0;
            transition: width 0.3s;
        }

        #room-monitor-panel.minimized {
            width: 120px;
        }

        #room-monitor-panel.minimized #panel-content {
            display: none;
        }

        #room-monitor-panel h3 {
            margin: 0 0 8px 0;
            font-size: 13px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #444;
        }

        .panel-header h3 {
            margin: 0;
            font-size: 12px;
            flex: 1;
            color: #fff;
        }

        .header-buttons {
            display: flex;
            gap: 4px;
        }

        .header-btn {
            background: #2c2c2c;
            border: 1px solid #444;
            color: #aaa;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .header-btn:hover {
            background: #3c3c3c;
            border-color: #555;
            color: #fff;
        }

        .header-btn.close:hover {
            background: #5c2c2c;
            border-color: #8c3c3c;
            color: #ff6666;
        }

        .room-type-item {
            background: #2c2c2c;
            border: 1px solid #444;
            padding: 4px 6px;
            margin-bottom: 4px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            transition: all 0.2s;
        }

        .room-type-item:hover {
            background: #3c3c3c;
            border-color: #555;
        }

        .room-type-item input[type="checkbox"] {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            cursor: pointer;
            accent-color: #409eff;
        }

        .room-type-item label {
            cursor: pointer;
            flex: 1;
            font-size: 11px;
            color: #e0e0e0;
        }

        .settings-btn {
            background: #2c2c2c;
            border: 1px solid #555;
            color: #409eff;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 10px;
            cursor: pointer;
            margin-left: 4px;
            transition: all 0.2s;
        }

        .settings-btn:hover {
            background: #3c3c3c;
            border-color: #409eff;
        }

        .clue-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #444;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
            z-index: 1000000;
            width: 320px;
        }

        .clue-modal.active {
            display: block;
        }

        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
        }

        .modal-overlay.active {
            display: block;
        }

        .clue-modal h4 {
            margin: 0 0 15px 0;
            color: #409eff;
            font-size: 16px;
        }

        .clue-modal label {
            display: block;
            font-size: 13px;
            margin-bottom: 8px;
            color: #e0e0e0;
        }

        .clue-modal input {
            width: 100%;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #444;
            background: #2c2c2c;
            color: #e0e0e0;
            font-size: 13px;
            box-sizing: border-box;
            margin-bottom: 8px;
        }

        .clue-modal input:focus {
            outline: none;
            border-color: #409eff;
        }

        .clue-modal .hint {
            font-size: 11px;
            color: #999;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
        }

        .modal-buttons button {
            flex: 1;
            padding: 10px;
            border: 1px solid;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .btn-confirm {
            background: #409eff;
            color: white;
            border-color: #409eff;
        }

        .btn-confirm:hover {
            background: #66b1ff;
            border-color: #66b1ff;
        }

        .btn-cancel {
            background: #606266;
            color: white;
            border-color: #606266;
        }

        .btn-cancel:hover {
            background: #78787a;
            border-color: #78787a;
        }

        .status-bar {
            background: #2c2c2c;
            border: 1px solid #444;
            padding: 4px 6px;
            border-radius: 3px;
            margin-top: 6px;
            font-size: 10px;
        }

        .status-bar .status-line {
            margin: 2px 0;
            display: flex;
            justify-content: space-between;
            color: #bbb;
        }

        .status-bar .countdown {
            font-weight: bold;
            color: #67c23a;
        }

        .control-buttons {
            display: flex;
            gap: 4px;
            margin-top: 6px;
        }

        .control-buttons button {
            flex: 1;
            padding: 4px;
            border: 1px solid #444;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .btn-start {
            background: #409eff;
            color: white;
            border-color: #409eff;
        }

        .btn-start:hover {
            background: #66b1ff;
            border-color: #66b1ff;
        }

        .btn-stop {
            background: #f56c6c;
            color: white;
            border-color: #f56c6c;
        }

        .btn-stop:hover {
            background: #f78989;
            border-color: #f78989;
        }

        .btn-start:disabled, .btn-stop:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .drag-handle {
            cursor: move;
            text-align: center;
            padding: 3px;
            margin: -8px -8px 6px -8px;
            background: #1c1c1c;
            border-bottom: 1px solid #444;
            border-radius: 4px 4px 0 0;
            font-size: 10px;
            color: #888;
            touch-action: none;
        }

        .drag-handle:hover {
            color: #aaa;
        }
    `);

    // 创建面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'room-monitor-panel';
        panel.innerHTML = `
            <div class="drag-handle">☰</div>
            <div class="panel-header">
                <h3>🎮 监控</h3>
                <div class="header-buttons">
                    <button class="header-btn minimize" id="minimize-btn" title="最小化">−</button>
                    <button class="header-btn close" id="close-btn" title="关闭">×</button>
                </div>
            </div>
            <div id="panel-content">
                <div id="room-types-container"></div>
                <div class="control-buttons">
                    <button id="start-monitor" class="btn-start">开始</button>
                    <button id="stop-monitor" class="btn-stop" disabled>停止</button>
                </div>
                <div class="status-bar">
                    <div class="status-line">
                        <span>状态:</span>
                        <span id="monitor-status">未启动</span>
                    </div>
                    <div class="status-line">
                        <span>模式:</span>
                        <span id="monitor-mode">待机</span>
                    </div>
                    <div class="status-line">
                        <span>倒计时:</span>
                        <span id="countdown" class="countdown">-</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 创建线索设置弹窗
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'clue-modal-overlay';
        document.body.appendChild(modalOverlay);

        const modal = document.createElement('div');
        modal.className = 'clue-modal';
        modal.id = 'clue-modal';
        modal.innerHTML = `
            <h4>⚙️ 圣物线索设置</h4>
            <label>线索列表（可选）</label>
            <input type="text" id="clue-input-modal" placeholder="多个线索用逗号分隔">
            <div class="hint">例如: 极冰之核,精灵之翼<br>留空则不限制线索</div>
            <div class="modal-buttons">
                <button class="btn-confirm" id="modal-confirm">确定</button>
                <button class="btn-cancel" id="modal-cancel">取消</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 创建房间类型选项
        const container = document.getElementById('room-types-container');
        ROOM_TYPES.forEach((type, index) => {
            const item = document.createElement('div');
            item.className = 'room-type-item';
            const checked = GM_getValue(`room_type_${index}`, false);

            // 如果是圣物遗迹或魔物巢穴，添加设置按钮
            const needSettings = type === '圣物遗迹' || type === '魔物巢穴' || type === '符石遗迹';
            const settingsBtn = needSettings ? `<button class="settings-btn" id="settings-${index}">⚙️</button>` : '';

            item.innerHTML = `
                <input type="checkbox" id="room-type-${index}" ${checked ? 'checked' : ''}>
                <label for="room-type-${index}">${type}</label>
                ${settingsBtn}
            `;
            container.appendChild(item);

            // 保存选择状态
            item.querySelector('input').addEventListener('change', (e) => {
                GM_setValue(`room_type_${index}`, e.target.checked);
            });

            // 绑定设置按钮事件
            if (needSettings) {
                const btn = item.querySelector(`#settings-${index}`);
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openSettingsModal(type);
                });
            }
        });

        // 弹窗控制
        function openSettingsModal(roomType) {
            const modal = document.getElementById('clue-modal');
            const overlay = document.getElementById('clue-modal-overlay');
            const title = modal.querySelector('h4');
            const label = modal.querySelector('label');
            const input = document.getElementById('clue-input-modal');
            const hint = modal.querySelector('.hint');

            if (roomType === '圣物遗迹') {
                title.textContent = '⚙️ 圣物线索设置';
                label.textContent = '线索列表（可选）';
                input.placeholder = '多个线索用逗号分隔';
                hint.innerHTML = '例如: 极冰之核,熔岩之核,憾地之核,风暴之核<br>留空则不限制线索';
                input.value = GM_getValue('relic_clues', '');
                input.dataset.type = 'relic';
            } else if (roomType === '魔物巢穴') {
                title.textContent = '⚙️ 怪物名称设置';
                label.textContent = '怪物名称（可选）';
                input.placeholder = '多个怪物用逗号分隔';
                hint.innerHTML = '例如: 钢铁人,行尸,幽灵,半人马<br>支持中英文逗号，留空则不限制';
                input.value = GM_getValue('monster_names', '');
                input.dataset.type = 'monster';
            } else if (roomType === '符石遗迹') {
                title.textContent = '⚙️ 光泽设置';
                label.textContent = '光泽（可选）';
                input.placeholder = '多个光泽用逗号分隔，如：明亮, 闪耀';
                hint.innerHTML = '示例：明亮, 闪耀<br>留空则不限制光泽';
                input.value = GM_getValue('gloss_list', '');
                input.dataset.type = 'gloss';
            }


            modal.classList.add('active');
            overlay.classList.add('active');
        }

        function closeClueModal() {
            const modal = document.getElementById('clue-modal');
            const overlay = document.getElementById('clue-modal-overlay');

            modal.classList.remove('active');
            overlay.classList.remove('active');
        }

        // 绑定弹窗按钮事件
        document.getElementById('modal-confirm').addEventListener('click', () => {
            const input = document.getElementById('clue-input-modal');
            const type = input.dataset.type;

            if (type === 'relic') {
                GM_setValue('relic_clues', input.value.trim());
                console.log('圣物线索已保存:', input.value.trim());
            } else if (type === 'monster') {
                GM_setValue('monster_names', input.value.trim());
                console.log('怪物名称已保存:', input.value.trim());
            } else if (type === 'gloss') {
                GM_setValue('gloss_list', input.value.trim());
                console.log('光泽已保存:', input.value.trim());
            }


            closeClueModal();
        });

        document.getElementById('modal-cancel').addEventListener('click', closeClueModal);
        document.getElementById('clue-modal-overlay').addEventListener('click', closeClueModal);

        // 绑定按钮事件
        document.getElementById('start-monitor').addEventListener('click', startMonitor);
        document.getElementById('stop-monitor').addEventListener('click', stopMonitor);

        // 最小化按钮
        const minimizeBtn = document.getElementById('minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation(); // 更改为 stopImmediatePropagation
                toggleMinimize();
            });
        }

        // 关闭按钮
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation(); // 更改为 stopImmediatePropagation
                closePanel();
            });
        }

        // 实现拖动功能（支持鼠标和触摸）
        makeDraggable(panel);
    }

    // 最小化/展开面板
    function toggleMinimize() {
        const panel = document.getElementById('room-monitor-panel');
        const btn = document.getElementById('minimize-btn');

        if (!panel || !btn) return;

        panel.classList.toggle('minimized');

        if (panel.classList.contains('minimized')) {
            btn.textContent = '+';
            btn.title = '展开';
        } else {
            btn.textContent = '−';
            btn.title = '最小化';
        }
    }

    // 关闭面板
    function closePanel() {
        console.log('关闭面板');

        // 停止所有监控
        if (scriptState.mode !== 'idle') {
            stopMonitor();
        }

        // 移除面板
        const panel = document.getElementById('room-monitor-panel');
        if (panel) {
            panel.remove();
        }

        // 移除弹窗
        const modal = document.getElementById('clue-modal');
        const overlay = document.getElementById('clue-modal-overlay');
        if (modal) modal.remove();
        if (overlay) overlay.remove();

        console.log('面板已关闭，所有功能已停止');
    }

    // 使面板可拖动（优化性能，支持鼠标和触摸）
    function makeDraggable(element) {
        const handle = element.querySelector('.drag-handle');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // 鼠标事件
        handle.addEventListener('mousedown', dragMouseDown);

        // 触摸事件
        handle.addEventListener('touchstart', dragTouchStart, { passive: false });

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        function dragTouchStart(e) {
            e.preventDefault();
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.addEventListener('touchmove', elementTouchDrag, { passive: false });
            document.addEventListener('touchend', closeDragElement);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            updatePosition();
        }

        function elementTouchDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            updatePosition();
        }

        function updatePosition() {
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;

            element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop)) + "px";
            element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft)) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('touchmove', elementTouchDrag);
            document.removeEventListener('touchend', closeDragElement);
        }
    }

    // 更新状态显示
    function updateStatus(status, mode, countdown) {
        const statusEl = document.getElementById('monitor-status');
        const modeEl = document.getElementById('monitor-mode');
        const countdownEl = document.getElementById('countdown');

        if (statusEl && status !== undefined) statusEl.textContent = status;
        if (modeEl && mode !== undefined) modeEl.textContent = mode;
        if (countdownEl && countdown !== undefined) countdownEl.textContent = countdown;
    }

    // 开始监控
    function startMonitor() {
        // 检查是否选择了房间类型
        const selectedTypes = getSelectedRoomTypes();
        if (selectedTypes.length === 0) {
            alert('请至少选择一个房间类型！');
            return;
        }

        document.getElementById('start-monitor').disabled = true;
        document.getElementById('stop-monitor').disabled = false;

        scriptState.mode = 'monitoring';
        updateStatus('运行中', '监控房间', '-');

        // 立即执行一次检查
        checkRooms();

        // 开始定时监控
        startRoomMonitoring();
    }

    // 停止监控
    function stopMonitor() {
        console.log('用户手动停止监控');
        clearAllIntervals();

        document.getElementById('start-monitor').disabled = false;
        document.getElementById('stop-monitor').disabled = true;

        scriptState.mode = 'idle';
        scriptState.lastBattleHp = null;
        scriptState.joinedRoomType = null;

        updateStatus('已停止', '待机中', '-');
    }

    // 清除所有定时器
    function clearAllIntervals() {
        if (scriptState.monitorInterval) {
            clearTimeout(scriptState.monitorInterval); // 改为 clearTimeout
            scriptState.monitorInterval = null;
        }
        if (scriptState.countdownInterval) {
            clearInterval(scriptState.countdownInterval);
            scriptState.countdownInterval = null;
        }
        if (scriptState.battleCheckInterval) {
            clearInterval(scriptState.battleCheckInterval);
            scriptState.battleCheckInterval = null;
        }
    }

    // 获取选中的房间类型
    function getSelectedRoomTypes() {
        const selectedTypes = [];
        ROOM_TYPES.forEach((type, index) => {
            if (GM_getValue(`room_type_${index}`, false)) {
                selectedTypes.push(type);
            }
        });
        return selectedTypes;
    }

    // 获取随机刷新间隔
    function getRandomRefreshInterval() {
        const randomOffset = Math.floor(Math.random() * (REFRESH_RANDOM_RANGE * 2 + 1)) - REFRESH_RANDOM_RANGE;
        const interval = REFRESH_INTERVAL + randomOffset;
        console.log(`本次刷新间隔: ${interval}秒 (基础${REFRESH_INTERVAL}秒 ${randomOffset >= 0 ? '+' : ''}${randomOffset}秒)`);
        return Math.max(1, interval); // 最少1秒
    }

    // 开始房间监控模式
    function startRoomMonitoring() {
        const interval = getRandomRefreshInterval();
        scriptState.remainingSeconds = interval;

        // 定时检查房间（使用随机间隔）
        function scheduleNextCheck() {
            const nextInterval = getRandomRefreshInterval();
            scriptState.remainingSeconds = nextInterval;

            scriptState.monitorInterval = setTimeout(() => {
                checkRooms();
                scheduleNextCheck(); // 递归调度下一次检查
            }, nextInterval * 1000);
        }

        scheduleNextCheck();

        // 倒计时显示
        scriptState.countdownInterval = setInterval(() => {
            scriptState.remainingSeconds--;
            if (scriptState.remainingSeconds < 0) {
                scriptState.remainingSeconds = 0;
            }
            updateStatus(undefined, undefined, `${scriptState.remainingSeconds}秒`);
        }, 1000);
    }

    // 获取配置的怪物名称列表
    function getMonsterNames() {
        const savedNames = GM_getValue('monster_names', '');
        if (!savedNames || !savedNames.trim()) {
            return [];
        }

        // 分割并去除空白，支持中英文逗号
        return savedNames.split(/[,，]/)
            .map(name => name.trim())
            .filter(name => name.length > 0);
    }

    // 检查房间是否满足怪物名称条件
    function checkMonsterNames(roomItem, roomType) {
        // 只对魔物巢穴检查怪物名称
        if (roomType !== '魔物巢穴') {
            return true;
        }

        const configuredMonsters = getMonsterNames();

        // 如果没有配置怪物名称，直接通过
        if (configuredMonsters.length === 0) {
            console.log('未配置怪物名称，直接通过');
            return true;
        }

        // 查找当前怪物名称
        const monsterButton = roomItem.querySelector('.left > div:first-child button span span:first-child');
        if (!monsterButton) {
            console.log('未找到怪物名称元素');
            return false;
        }

        const monsterName = monsterButton.textContent.trim();
        console.log('当前怪物:', monsterName);
        console.log('监控怪物:', configuredMonsters);

        // 检查怪物名称是否匹配（OR逻辑）
        const hasMatch = configuredMonsters.some(configMonster =>
            monsterName.includes(configMonster) || configMonster.includes(monsterName)
        );

        if (hasMatch) {
            console.log('✅ 找到匹配的怪物');
        } else {
            console.log('❌ 没有匹配的怪物');
        }

        return hasMatch;
    }
    // 读取用户配置的光泽（用逗号分隔）
    function getGlossList() {
        const raw = GM_getValue('gloss_list', '');
        if (!raw || !raw.trim()) return [];
        return raw.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    }

    // 只对「符石遗迹」做光泽过滤
    function checkGloss(roomItem, roomType) {
        if (roomType !== '符石遗迹') {
            return true;
        }

        const configured = getGlossList(); // 用户配置的光泽列表
        if (configured.length === 0) {
            console.log('未配置光泽，直接通过');
            return true;
        }

        // 方案A：根据常见稀有度类名获取（legend/epic/rare/uncommon/common）
        let gloss = null;
        const glossEl = roomItem.querySelector('.left .legend, .left .epic, .left .rare, .left .uncommon, .left .common');
        if (glossEl) {
            gloss = glossEl.textContent.trim();
        } else {
            // 方案B：回退到文本匹配 “光泽：xxxx”
            const cand = Array.from(roomItem.querySelectorAll('.left p, .left span'))
                .find(el => /光泽：/.test(el.textContent));
            if (cand) {
                const text = cand.textContent.replace(/\s+/g, '');
                const m = text.match(/光泽：([^，、\s]+)/);
                if (m) gloss = m[1];
            }
        }

        if (!gloss) {
            console.log('未解析到光泽');
            return false;
        }

        const ok = configured.some(x => gloss.includes(x) || x.includes(gloss));
        console.log('当前光泽:', gloss, '监控光泽:', configured, ok ? '✅匹配' : '❌不匹配');
        return ok;
    }


    // 获取配置的圣物线索列表
    function getRelicClues() {
        const savedClues = GM_getValue('relic_clues', '');
        if (!savedClues || !savedClues.trim()) {
            return [];
        }

        // 分割并去除空白，支持中英文逗号
        return savedClues.split(/[,，]/)
            .map(clue => clue.trim())
            .filter(clue => clue.length > 0);
    }

    // 检查房间是否满足圣物线索条件
    function checkRelicClues(roomItem, roomType) {
        // 只对圣物遗迹检查线索
        if (roomType !== '圣物遗迹') {
            return true;
        }

        const configuredClues = getRelicClues();

        // 如果没有配置线索，直接通过
        if (configuredClues.length === 0) {
            console.log('未配置圣物线索，直接通过');
            return true;
        }

        // 查找房间的圣物线索
        const clueElements = roomItem.querySelectorAll('.left p:last-child span span');
        if (clueElements.length === 0) {
            console.log('未找到圣物线索元素');
            return false;
        }

        // 提取房间的所有线索
        const roomClues = [];
        clueElements.forEach(el => {
            const clueText = el.textContent.trim();
            if (clueText && clueText !== '、') {
                roomClues.push(clueText);
            }
        });

        console.log('房间线索:', roomClues);
        console.log('监控线索:', configuredClues);

        // 检查是否有任何一个配置的线索在房间线索中（OR逻辑）
        const hasMatch = configuredClues.some(configClue =>
            roomClues.some(roomClue => roomClue.includes(configClue))
        );

        if (hasMatch) {
            console.log('✅ 找到匹配的圣物线索');
        } else {
            console.log('❌ 没有匹配的圣物线索');
        }

        return hasMatch;
    }

    // 检查房间
    function checkRooms() {
        console.log('开始检查房间...');

        const selectedTypes = getSelectedRoomTypes();
        if (selectedTypes.length === 0) {
            console.log('未选择任何房间类型');
            return;
        }

        // 查找房间列表
        const roomItems = document.querySelectorAll('.item.border-wrap');
        console.log(`找到 ${roomItems.length} 个房间`);

        for (const item of roomItems) {
            const roomTypeElement = item.querySelector('.left p:nth-child(2) span');
            if (!roomTypeElement) continue;

            const roomType = roomTypeElement.textContent.trim();
            console.log(`检测到房间类型: ${roomType}`);

            if (selectedTypes.includes(roomType)) {
                console.log(`房间类型匹配: ${roomType}`);

                // 检查怪物名称条件（魔物巢穴）
                if (!checkMonsterNames(item, roomType)) {
                    console.log('怪物名称不匹配，跳过此房间');
                    continue;
                }

                // 检查圣物线索条件（圣物遗迹）
                if (!checkRelicClues(item, roomType)) {
                    console.log('圣物线索不匹配，跳过此房间');
                    continue;
                }
                // 检查光泽条件（符石遗迹）
                if (!checkGloss(item, roomType)) {
                    console.log('光泽不匹配，跳过此房间');
                    continue;
                }


                const joinButton = item.querySelector('.right button');

                if (joinButton && !joinButton.disabled) {
                    console.log('✅ 所有条件满足，点击加入按钮');
                    joinButton.click();

                    // 保存加入的房间类型
                    scriptState.joinedRoomType = roomType;

                    // 切换到战斗等待模式
                    waitForJoinResult();

                    return;
                }
            }
        }

        // 刷新房间列表
        refreshRoomList();
    }

    function waitForJoinResult() {
        const START = Date.now();
        const TIMEOUT = 8000; // 8秒超时
        const TICK = 500;     // 0.5秒检查一次

        const timer = setInterval(() => {
            // 判断加入是否成功
            const inRoom = document.querySelector('.team, .room, .队伍信息, .房间信息');
            const inBattle = document.querySelector('.person-fight, .team-fight');

            if (inRoom || inBattle) {
                clearInterval(timer);
                switchToBattleMode();
                return;
            }

            if (Date.now() - START > TIMEOUT) {
                clearInterval(timer);
                console.log('加入失败，恢复监控');
                updateStatus('运行中', '加入失败，恢复监控', '-');

                clearAllIntervals();
                scriptState.mode = 'monitoring';
                scriptState.lastBattleHp = null;
                scriptState.joinedRoomType = null;

                startRoomMonitoring();
            }
        }, TICK);
    }

    // 刷新房间列表
    function refreshRoomList() {
        const refreshButtons = document.querySelectorAll('button.el-button.el-button--primary.el-button--small.is-plain');
        for (const btn of refreshButtons) {
            if (btn.textContent.trim() === '刷新') {
                console.log('点击刷新按钮');
                btn.click();
                break;
            }
        }
    }

    // 切换到战斗等待模式
    function switchToBattleMode() {
        console.log('切换到战斗等待模式，等待战斗开始...');

        // 清除房间监控的定时器
        clearAllIntervals();
        if (scriptState.countdownInterval) {
            clearInterval(scriptState.countdownInterval);
            scriptState.countdownInterval = null;
        }


        scriptState.mode = 'inBattle';
        scriptState.lastBattleHp = null;
        scriptState.remainingSeconds = 60; // 60秒倒计时

        updateStatus('运行中', '等待战斗开始', '60秒');

        // 开始倒计时显示
        scriptState.countdownInterval = setInterval(() => {
            scriptState.remainingSeconds--;
            if (scriptState.remainingSeconds < 0) {
                scriptState.remainingSeconds = 0;
            }
            updateStatus(undefined, undefined, `${scriptState.remainingSeconds}秒`);
        }, 1000);

        // 开始监控战斗血量（每2秒检测一次）
        scriptState.battleCheckInterval = setInterval(checkBattleEnd, 2000);
    }

    // 检查战斗是否结束（仅检测血量是否为0）
    function checkBattleEnd() {
        console.log('检查战斗状态...');

        // 获取战斗血量
        const battleHp = getBattleHp();

        if (battleHp !== null) {
            console.log(`当前战斗血量: ${battleHp}%`);

            // 如果检测到血量数据，更新模式显示
            if (scriptState.lastBattleHp === null) {
                updateStatus(undefined, '战斗中...', undefined);
            }

            // 记录当前血量
            const previousHp = scriptState.lastBattleHp;
            scriptState.lastBattleHp = battleHp;

            // 只有当血量为0时，才判定战斗结束
            if (battleHp === 0) {
                console.log('战斗结束，血量归零');
                onBattleEnd();
            }
        } else {
            console.log('未检测到战斗数据');
            // 如果之前检测到血量为0，现在没有数据了，说明已经结束
            if (scriptState.lastBattleHp === 0) {
                console.log('战斗数据消失，确认战斗已结束');
                onBattleEnd();
            }
        }
    }

    // 获取战斗血量
    function getBattleHp() {
        // 尝试获取个人战斗数据
        const personFight = document.querySelector('.person-fight');
        if (personFight) {
            const hpElement = personFight.querySelector('.el-progress-bar__innerText span');
            if (hpElement) {
                const hpText = hpElement.textContent.trim().replace('%', '');
                const hp = parseFloat(hpText);
                if (!isNaN(hp)) {
                    return hp;
                }
            }
        }

        // 尝试获取团队战斗数据
        const teamFight = document.querySelector('.team-fight');
        if (teamFight) {
            const hpElement = teamFight.querySelector('.el-progress-bar__innerText span');
            if (hpElement) {
                const hpText = hpElement.textContent.trim().replace('%', '');
                const hp = parseFloat(hpText);
                if (!isNaN(hp)) {
                    return hp;
                }
            }
        }

        return null;
    }

    // 战斗结束处理
    function onBattleEnd() {
        console.log('战斗结束，准备返回');
        if (scriptState.countdownInterval) {
            clearInterval(scriptState.countdownInterval);
            scriptState.countdownInterval = null;
        }

        // 清除战斗监控
        if (scriptState.battleCheckInterval) {
            clearInterval(scriptState.battleCheckInterval);
            scriptState.battleCheckInterval = null;
        }

        updateStatus('运行中', '返回中...', '等待');

        // 等待2秒后点击返回按钮
        setTimeout(() => {
            clickReturnButton();
        }, 2000);
    }

    // 点击返回按钮
    function clickReturnButton() {
        console.log('尝试点击返回按钮');

        const returnButtons = document.querySelectorAll('button.el-button.el-button--success.is-plain.main');
        for (const btn of returnButtons) {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === '返回') {
                console.log('找到返回按钮，点击');
                btn.click();

                // 等待2秒后点击组队房间按钮
                setTimeout(() => {
                    clickTeamRoomButton();
                }, 2000);

                return;
            }
        }

        console.log('未找到返回按钮，1秒后重试');
        setTimeout(clickReturnButton, 1000);
    }

    // 点击组队房间按钮
    function clickTeamRoomButton() {
        console.log('尝试点击组队房间按钮');

        const teamRoomButtons = document.querySelectorAll('button.el-button.el-button--primary.el-button--small.is-plain');
        for (const btn of teamRoomButtons) {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === '组队房间') {
                console.log('找到组队房间按钮，点击');
                btn.click();

                // 等待2秒后重新开始监控
                setTimeout(() => {
                    restartMonitoring();
                }, 2000);

                return;
            }
        }

        console.log('未找到组队房间按钮，1秒后重试');
        setTimeout(clickTeamRoomButton, 1000);
    }

    // 重新开始监控
    function restartMonitoring() {
        clearAllIntervals();
        console.log('重新开始房间监控');

        scriptState.mode = 'monitoring';
        scriptState.lastBattleHp = null;
        scriptState.joinedRoomType = null;

        updateStatus('运行中', '监控房间', '-');

        // 立即检查一次房间
        checkRooms();

        // 重新开始定时监控
        startRoomMonitoring();
    }

    // 初始化
    setTimeout(() => {
        createPanel();
        console.log('房间监控助手已加载');
    }, 1000);

})();