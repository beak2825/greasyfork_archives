// ==UserScript==
// @name         FF14跨区小助手
// @namespace    https://github.com/LIDaoJY
// @version      0.6
// @description  FF14 跨区传送辅助脚本 - 自动监控服务器状态并执行跨区传送
// @author       LIDaoJY
// @match        https://ff14bjz.sdo.com/RegionKanTelepo*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      ff14bjz.sdo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556773/FF14%E8%B7%A8%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556773/FF14%E8%B7%A8%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =============== 可设置参数 ===============
    let NOTIFICATION_TIMEOUT = 20000;              // 通知自动关闭时间（毫秒）
    let POLLING_INTERVAL_TIMEOUT = 30000;          // 轮询间隔时间（毫秒）建议大于30秒 
    let RETRY_DELAY_TIMEOUT = 80000;               // 重试间隔时间（毫秒）强烈建议大于60秒

    // =============== 状态 ===============
    let FF14_GROUP_LIST = null;
    let FF14_STATUS_INFO = null;
    let selectedRoleInfo = null;
    let selectedTargetAreaInfo = null;
    let statusCheckIntervalId = null;
    let retryTimeoutId = null;
    let audioContext = null;

    // =============== UI 引用 ===============
    let logContainer = null;
    let fetchButton = null;
    let controlSection = null;
    let linkStartBtn = null;
    let characterSelectionWindow = null;
    let targetAreaSelectionWindow = null;
    let statusWindow = null;

    // =============== 注册全局样式 ===============
    GM_addStyle(`
        /* 主窗口 */
        #ff14-helper-window {
            position: fixed; top: 120px; left: 40px; width: 350px; height: 400px;
            background: rgba(30, 30, 30, 0.9); color: #fff; z-index: 999999;
            padding: 10px; border-radius: 6px; font-size: 14px;
            box-shadow: 0 0 6px rgba(0,0,0,0.5); display: flex; flex-direction: column;
        }
        #ff14-helper-header {
            cursor: move; font-weight: bold; margin-bottom: 6px;
            display: flex; justify-content: space-between; align-items: center;
        }
        #ff14-helper-btns { display: flex; gap: 6px; }
        .ff14-helper-btn {
            background: #444; border-radius: 3px; padding: 2px 6px; cursor: pointer;
        }
        .ff14-helper-btn:hover { background: #666; }

        /* 控制区与日志 */
        #ff14-control-section { flex: 0 0 auto; padding-bottom: 10px; border-bottom: 1px solid #555; }
        #ff14-log-section { flex: 1 1 auto; overflow-y: auto; padding-top: 10px; }
        .ff14-log-entry { font-size: 12px; line-height: 1.4; margin-bottom: 2px; color: #ccc; }

        /* 通用按钮样式 */
        .ff14-action-btn {
            display: inline-block; margin: 5px 5px 0 0; padding: 6px 10px;
            background: linear-gradient(to bottom, #2196F3, #1976D2);
            border: 1px solid #0d47a1; border-radius: 4px; color: white;
            font-size: 13px; cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease;
        }
        .ff14-action-btn:hover {
            background: linear-gradient(to bottom, #1976D2, #1565C0);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3); transform: translateY(-1px);
        }
        .ff14-action-btn:active {
            transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        /* 获取按钮 (绿色)  */
        #ff14-fetch-btn {
            margin-top: 5px; padding: 8px 12px;
            background: linear-gradient(to bottom, #4CAF50, #45a049);
            border: 1px solid #2e7d32; border-radius: 4px; color: white;
            font-size: 14px; cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }
        #ff14-fetch-btn:hover {
            background: linear-gradient(to bottom, #45a049, #3d8b40);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3); transform: translateY(-1px);
        }
        #ff14-fetch-btn:active {
            transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        /* 通知复选框 */
        #ff14-notify-only-checkbox { margin-right: 4px; }

        /* 角色/大区窗口 */
        .ff14-selection-window {
            position: fixed; top: 150px; left: 50%; transform: translateX(-50%);
            background: rgba(30, 30, 30, 0.95); color: #fff; z-index: 1000000;
            padding: 10px; border-radius: 6px; font-size: 14px;
            box-shadow: 0 0 10px rgba(0,0,0,0.7); display: flex; flex-direction: column;
        }
        .ff14-window-header {
            cursor: move; font-weight: bold; margin-bottom: 10px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .ff14-window-btns { display: flex; gap: 6px; }
        .ff14-window-btn {
            background: #444; border-radius: 3px; padding: 2px 6px; cursor: pointer;
        }
        .ff14-window-btn:hover { background: #666; }
        .ff14-window-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ff14-list-container {
            flex: 1; overflow-y: auto; border: 1px solid #555; padding: 5px;
            background-color: #222; font-size: 12px;
        }
        .ff14-list-container ul { list-style: none; padding: 0; margin: 0; }
        .ff14-list-container li {
            padding: 4px 6px; cursor: pointer; border-radius: 2px;
        }
        .ff14-list-container li:hover { background-color: #333; }
        .ff14-list-container li.selected { background-color: #007acc; }
        .ff14-action-row {
            display: flex; justify-content: center; gap: 10px; margin-top: 10px;
        }

        /* 状态窗口 */
        #ff14-status-window {
            position: fixed; top: 120px; left: 50%; transform: translateX(-50%);
            width: 500px; height: 400px; background: rgba(30, 30, 30, 0.95);
            color: #fff; z-index: 999998; padding: 10px; border-radius: 6px;
            font-size: 14px; box-shadow: 0 0 10px rgba(0,0,0,0.7);
            display: flex; flex-direction: column;
        }
        #ff14-status-content { display: flex; flex: 1; overflow: hidden; }
        .status-column {
            flex: 1; overflow-y: auto; padding: 5px; border: 1px solid #555;
            background-color: #222; font-size: 12px;
        }
        .status-column:first-child { margin-right: 5px; }
        .status-item { padding: 3px; border-radius: 2px; }
        .status-area { cursor: pointer; }
        .status-area:hover { background-color: #333; }
        .status-area.selected { background-color: #007acc; }
        .status-open { color: #4CAF50; }
        .status-busy { color: #FFC107; }
        .status-blocked, .status-full { color: #f44336; }

        /* 选择器样式 */
        select {
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 3px;
            padding: 4px;
            font-size: 12px;
        }
        select option {
            background-color: #333;
            color: #fff;
        }
        label {
            color: #ccc;
            font-size: 12px;
        }
    `);

    // =============== 工具函数 ===============
    function addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'ff14-log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        if (logContainer) {
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        console.log(`[${timestamp}] ${message}`);
    }

    function safeJsonParse(str, fallback = null) {
        try { return JSON.parse(str); } catch (e) { return fallback; }
    }

    function apiGet(url, onSuccess, onError = console.error) {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.return_code === 0 && data.return_message === 'ok' &&
                        data.data?.resultCode === 0 && data.data?.resultMsg === '成功') {
                        onSuccess(data.data);
                    } else {
                        const msg = data.data?.resultMsg || data.return_message || '未知错误';
                        addLog(`❌API 错误: ${msg}`);
                    }
                } catch (e) {
                    addLog(`❌响应解析失败: ${e.message}`);
                    onError(e);
                }
            },
            onerror: (err) => {
                const msg = err.statusText || err.error || '网络错误';
                addLog(`❌请求失败: ${msg}`);
                onError(err);
            },
            ontimeout: () => addLog('❌请求超时')
        });
    }

    function playBeep() {
        // 尝试使用 Web Audio API 播放提示音
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const now = audioContext.currentTime;

            // 创建两个振荡器 - 一个主音和一个高音和声
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();

            // 主音 - 上升的积极音调
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(800, now);
            oscillator1.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

            // 和声 - 更高的音调, 增加积极感
            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(1200, now);
            oscillator2.frequency.exponentialRampToValueAtTime(1600, now + 0.2);

            // 创建音量包络 - 稍微长一点, 更柔和
            const gainNode1 = audioContext.createGain();
            const gainNode2 = audioContext.createGain();

            gainNode1.gain.setValueAtTime(0, now);
            gainNode1.gain.linearRampToValueAtTime(0.2, now + 0.05);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            gainNode2.gain.setValueAtTime(0, now);
            gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            // 连接节点
            oscillator1.connect(gainNode1);
            oscillator2.connect(gainNode2);
            gainNode1.connect(audioContext.destination);
            gainNode2.connect(audioContext.destination);

            // 播放
            oscillator1.start();
            oscillator2.start();
            oscillator1.stop(now + 0.3);
            oscillator2.stop(now + 0.25);
        } catch (e) {
            console.warn("无法播放 Web Audio 提示音:", e);
        }
    }

    function enableDrag(element, handle) {
        let isDown = false, offsetX = 0, offsetY = 0;
        handle.addEventListener('mousedown', (e) => {
            isDown = true;
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });
        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', (e) => {
            if (isDown) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
                element.style.transform = 'none';
            }
        });
    }

    // =============== 主窗口 ===============
    function initMainUI() {
        const win = document.createElement('div');
        win.id = 'ff14-helper-window';
        win.innerHTML = `
            <div id="ff14-helper-header">
                <span>⚔ FF14跨区小助手</span>
                <div id="ff14-helper-btns">
                    <div class="ff14-helper-btn" id="ff14-min-btn">－</div>
                    <div class="ff14-helper-btn" id="ff14-close-btn">×</div>
                </div>
            </div>
            <div id="ff14-control-section">
                <button id="ff14-fetch-btn">获取服务器列表</button>
            </div>
            <div id="ff14-log-section"></div>
        `;
        document.body.appendChild(win);

        logContainer = document.getElementById('ff14-log-section');
        fetchButton = document.getElementById('ff14-fetch-btn');
        controlSection = document.getElementById('ff14-control-section');

        // 拖拽
        enableDrag(win, win.querySelector('#ff14-helper-header'));

        // 按钮事件
        document.getElementById('ff14-min-btn').addEventListener('click', () => {
            const ctrl = controlSection, log = logContainer;
            ctrl.style.display = ctrl.style.display === 'none' ? 'block' : 'none';
            log.style.display = ctrl.style.display === 'none' ? 'none' : 'block';
        });
        document.getElementById('ff14-close-btn').addEventListener('click', () => win.style.display = 'none');
        fetchButton.addEventListener('click', fetchAndProcessServerList);

        addLog('✔️脚本已启动, 请在网页登录后获取服务器列表...');
    }

    function hideFetchButton() {
        if (fetchButton) {
            fetchButton.style.display = 'none';
            addLog('✔️服务器列表获取成功,');
        }
    }

    function showActionButtons() {
        controlSection.insertAdjacentHTML('beforeend', `
            <button id="ff14-select-character-btn" class="ff14-action-btn">选择角色</button>
            <button id="ff14-select-target-btn" class="ff14-action-btn">选择目标大区</button>
            <button id="ff14-link-start-btn" class="ff14-action-btn" disabled>LINK START</button>
            <div style="margin-top:8px;">
                <input type="checkbox" id="ff14-notify-only-checkbox">
                <label for="ff14-notify-only-checkbox" style="font-size:12px;">仅通知目标大区可用, 不进行自动传送</label>
            </div>
        `);

        document.getElementById('ff14-select-character-btn').addEventListener('click', openCharacterSelectionWindow);
        document.getElementById('ff14-select-target-btn').addEventListener('click', openTargetAreaSelectionWindow);
        linkStartBtn = document.getElementById('ff14-link-start-btn');
        linkStartBtn.addEventListener('click', toggleStatusCheck);
        updateLinkStartButtonState();
        addLog('✔️展示操作选单, 注意请在选择角色和目标区域后才能执行LINK START');
    }

    function updateLinkStartButtonState() {
        if (selectedRoleInfo && selectedTargetAreaInfo && selectedRoleInfo.selectedAreaId !== selectedTargetAreaInfo.areaId && linkStartBtn) {
            linkStartBtn.disabled = false;
            linkStartBtn.style.opacity = "1";
            linkStartBtn.style.cursor = "pointer";
            addLog('✔️角色和目标大区已选择, LINK START按钮已启用');
            addLog('⚠️请在确认好信息后再执行 LINK START');
        } else if (linkStartBtn) {
            linkStartBtn.disabled = true;
            linkStartBtn.style.opacity = "0.5";
            linkStartBtn.style.cursor = "not-allowed";
        }
    }

    // =============== 服务器列表获取 ===============
    function fetchAndProcessServerList() {
        addLog('🟩开始请求服务器列表...');
        apiGet(
            'https://ff14bjz.sdo.com/api/orderserivce/queryGroupListTravelSource?appId=100001900',
            (data) => {
                const list = safeJsonParse(data.groupList);
                if (!list) {
                    addLog('❌groupList 解析失败');
                    return;
                }
                FF14_GROUP_LIST = list;
                hideFetchButton();
                showActionButtons();
                addLog('🟩服务器列表加载成功');
            }
        );
    }

    // =============== 角色选择窗口 ===============
    function openCharacterSelectionWindow() {
        addLog('🟦打开角色选择窗口...');
        if (characterSelectionWindow && document.body.contains(characterSelectionWindow)) {
            characterSelectionWindow.style.display = 'block';
            return;
        }

        characterSelectionWindow = createWindow('ff14-character-selection-window', '⚔ 查询角色');
        characterSelectionWindow.innerHTML += `
            <div class="ff14-window-content">
                <div id="ff14-selection-controls">
                    <label for="area-select">选择区域:</label>
                    <select id="area-select"></select>
                    <label for="group-select">选择服务器:</label>
                    <select id="group-select"></select>
                    <button id="ff14-query-roles-btn" class="ff14-action-btn">查询角色</button>
                </div>
                <div id="ff14-role-list" class="ff14-list-container"></div>
                <div id="ff14-role-selection-actions" class="ff14-action-row" style="display:none;">
                    <button id="ff14-confirm-role-btn" class="ff14-action-btn">确认</button>
                    <button id="ff14-cancel-role-btn" class="ff14-action-btn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(characterSelectionWindow);

        populateAreaSelect();
        bindCharacterWindowEvents(); // ✅ 此时 characterSelectionWindow 已插入 body
        enableDrag(characterSelectionWindow, characterSelectionWindow.querySelector('.ff14-window-header'));
    }

    function bindCharacterWindowEvents() {
        // ✅ 使用 characterSelectionWindow.querySelector 而非 document.getElementById
        const win = characterSelectionWindow;
        // 修复: 使用正确的关闭按钮ID
        win.querySelector('#ff14-character-selection-window-close-btn').addEventListener('click', () => win.style.display = 'none');
        win.querySelector('#ff14-cancel-role-btn').addEventListener('click', () => win.style.display = 'none');
        win.querySelector('#ff14-query-roles-btn').addEventListener('click', queryRoleList);
        win.querySelector('#ff14-confirm-role-btn').addEventListener('click', () => {
            if (selectedRoleInfo) {
                addLog(`🟦角色选择成功: ${selectedRoleInfo.roleName} (ID: ${selectedRoleInfo.roleId})`);
                win.style.display = 'none';
                updateLinkStartButtonState();
            } else {
                addLog('🟥请先选择一个角色');
            }
        });
    }

    function populateAreaSelect() {
        const areaSelect = characterSelectionWindow.querySelector('#area-select');
        const groupSelect = characterSelectionWindow.querySelector('#group-select');
        areaSelect.innerHTML = '<option value="">--请选择区域--</option>';
        groupSelect.innerHTML = '<option value="">--请选择服务器--</option>';
        if (!FF14_GROUP_LIST || !Array.isArray(FF14_GROUP_LIST)) {
            addLog('❌错误: FF14_GROUP_LIST 未定义或格式不正确');
            return;
        }
        FF14_GROUP_LIST.forEach(area => {
            const opt = document.createElement('option');
            opt.value = area.areaId;
            opt.textContent = `${area.areaName} (ID: ${area.areaId})`;
            areaSelect.appendChild(opt);
        });
        areaSelect.addEventListener('change', () => populateGroupSelect(areaSelect.value));
    }

    function populateGroupSelect(areaId) {
        const groupSelect = characterSelectionWindow.querySelector('#group-select');
        groupSelect.innerHTML = '<option value="">--请选择服务器--</option>';
        if (!areaId || !FF14_GROUP_LIST) return;
        const area = FF14_GROUP_LIST.find(a => a.areaId == areaId);
        if (area?.groups) {
            area.groups.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.groupId;
                opt.textContent = `${g.groupName} (ID: ${g.groupId})`;
                groupSelect.appendChild(opt);
            });
        }
    }

    function queryRoleList() {
        const areaId = characterSelectionWindow.querySelector('#area-select').value;
        const groupId = characterSelectionWindow.querySelector('#group-select').value;
        if (!areaId || !groupId) {
            addLog('🟥请先选择区域和服务器');
            return;
        }
        addLog(`🟦查询角色: 区域 ${areaId}, 服务器 ${groupId}`);
        apiGet(
            `https://ff14bjz.sdo.com/api/gmallgateway/queryRoleList4Migration?appId=100001900&areaId=${areaId}&groupId=${groupId}`,
            (data) => {
                const roles = safeJsonParse(data.roleList);
                displayRoleList(roles || []);
            }
        );
    }

    function displayRoleList(roles) {
        const listDiv = characterSelectionWindow.querySelector('#ff14-role-list');
        const actionsDiv = characterSelectionWindow.querySelector('#ff14-role-selection-actions');
        listDiv.innerHTML = '';
        actionsDiv.style.display = 'none';
        selectedRoleInfo = null;

        if (!Array.isArray(roles) || roles.length === 0) {
            listDiv.textContent = '该服务器下没有可用角色';
            return;
        }

        const ul = document.createElement('ul');
        roles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = role.roleName;
            li.dataset.roleId = role.roleId;
            li.dataset.roleName = role.roleName;
            li.addEventListener('click', function () {
                characterSelectionWindow.querySelectorAll('#ff14-role-list li.selected').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                selectedRoleInfo = {
                    roleId: this.dataset.roleId,
                    roleName: this.dataset.roleName,
                    selectedAreaId: characterSelectionWindow.querySelector('#area-select').value,
                    selectedGroupId: characterSelectionWindow.querySelector('#group-select').value
                };
                actionsDiv.style.display = 'flex';
            });
            ul.appendChild(li);
        });
        listDiv.appendChild(ul);
    }

    // =============== 目标大区窗口 ===============
    function openTargetAreaSelectionWindow() {
        addLog('🟦打开目标大区选择窗口...');
        if (targetAreaSelectionWindow && document.body.contains(targetAreaSelectionWindow)) {
            targetAreaSelectionWindow.style.display = 'block';
            return;
        }

        targetAreaSelectionWindow = createWindow('ff14-target-area-selection-window', '⚔ 选择目标大区');
        targetAreaSelectionWindow.innerHTML += `
            <div class="ff14-window-content">
                <div id="ff14-area-list" class="ff14-list-container"></div>
                <div id="ff14-target-area-selection-actions" class="ff14-action-row" style="display:none;">
                    <button id="ff14-confirm-target-area-btn" class="ff14-action-btn">确认</button>
                    <button id="ff14-cancel-target-area-btn" class="ff14-action-btn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(targetAreaSelectionWindow);

        populateAreaList();
        bindTargetAreaWindowEvents(); // ✅ 此时 targetAreaSelectionWindow 已插入 body
        enableDrag(targetAreaSelectionWindow, targetAreaSelectionWindow.querySelector('.ff14-window-header'));
    }

    function bindTargetAreaWindowEvents() {
        // ✅ 使用 targetAreaSelectionWindow.querySelector
        const win = targetAreaSelectionWindow;
        // 修复: 使用正确的关闭按钮ID
        win.querySelector('#ff14-target-area-selection-window-close-btn').addEventListener('click', () => win.style.display = 'none');
        win.querySelector('#ff14-cancel-target-area-btn').addEventListener('click', () => win.style.display = 'none');
        win.querySelector('#ff14-confirm-target-area-btn').addEventListener('click', () => {
            if (selectedTargetAreaInfo) {
                addLog(`🟦目标大区选择成功: ${selectedTargetAreaInfo.areaName} (ID: ${selectedTargetAreaInfo.areaId})`);
                win.style.display = 'none';
                updateLinkStartButtonState();
            } else {
                addLog('🟥请先选择一个大区');
            }
        });
    }

    function populateAreaList() {
        const listDiv = targetAreaSelectionWindow.querySelector('#ff14-area-list');
        const actionsDiv = targetAreaSelectionWindow.querySelector('#ff14-target-area-selection-actions');
        listDiv.innerHTML = '';
        actionsDiv.style.display = 'none';
        selectedTargetAreaInfo = null;

        if (!FF14_GROUP_LIST || !Array.isArray(FF14_GROUP_LIST)) {
            listDiv.textContent = '无法加载大区列表';
            return;
        }

        const ul = document.createElement('ul');
        FF14_GROUP_LIST.forEach(area => {
            const li = document.createElement('li');
            li.textContent = `${area.areaName} (ID: ${area.areaId})`;
            li.dataset.areaId = area.areaId;
            li.dataset.areaName = area.areaName;
            li.addEventListener('click', function () {
                targetAreaSelectionWindow.querySelectorAll('#ff14-area-list li.selected').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                selectedTargetAreaInfo = {
                    areaId: this.dataset.areaId,
                    areaName: this.dataset.areaName
                };
                actionsDiv.style.display = 'flex';
            });
            ul.appendChild(li);
        });
        listDiv.appendChild(ul);
    }

    // =============== 通用窗口 ===============
    function createWindow(id, title) {
        const win = document.createElement('div');
        win.id = id;
        win.className = 'ff14-selection-window';
        win.innerHTML = `
            <div class="ff14-window-header">
                <span>${title}</span>
                <div class="ff14-window-btns">
                    <div class="ff14-window-btn" id="${id}-close-btn">×</div>
                </div>
            </div>
        `;
        return win;
    }

    // =============== LINK START 服务器监控 ===============
    function getStateText(state) {
        switch (state) {
            case 0: return '开放';
            case 1: return '繁忙';
            case 2: return '阻塞';
            default: return '未知';
        }
    }

    function toggleStatusCheck() {
        // 重试模式
        if (linkStartBtn.textContent === '取消重试') {
            cancelRetry();
            return;
        }

        // LINK START <-> STOP 切换
        if (statusCheckIntervalId) {
            // 停止状态检查
            if (statusCheckIntervalId) {
                clearInterval(statusCheckIntervalId);
                statusCheckIntervalId = null;
            }
            linkStartBtn.textContent = 'LINK START';
            linkStartBtn.style.background = 'linear-gradient(to bottom, #2196F3, #1976D2)';
            if (statusWindow && document.body.contains(statusWindow)) {
                document.body.removeChild(statusWindow);
                statusWindow = null;
            }
            addLog('⏹️停止检查服务器状态');
        } else {
            // 开始状态检查
            startStatusCheck();
        }
    }

    function startStatusCheck() {
        linkStartBtn.textContent = 'STOP';
        linkStartBtn.style.background = 'linear-gradient(to bottom, #f44336, #d32f2f)';
        openStatusWindow();
        queryStatus();
        statusCheckIntervalId = setInterval(queryStatus, POLLING_INTERVAL_TIMEOUT);
        addLog('▶️开始检查服务器状态...');
    }


    // 自动重试模式
    function enterRetryMode() {
        // 停止当前的状态检查
        if (statusCheckIntervalId) {
            clearInterval(statusCheckIntervalId);
            statusCheckIntervalId = null;
        }

        // 设置按钮为黄色"取消重试"
        linkStartBtn.textContent = '取消重试';
        linkStartBtn.style.background = 'linear-gradient(to bottom, #FFC107, #FF9800)'; // 黄色

        addLog('🟡跨区申请失败, 80秒后自动重试... 点击"取消重试"可停止流程');

        // 设置80秒后自动重试
        retryTimeoutId = setTimeout(() => {
            addLog('🔄自动重试开始...');
            clearTimeout(retryTimeoutId);
            retryTimeoutId = null;
            // 重新开始状态检查
            startStatusCheck();
        }, RETRY_DELAY_TIMEOUT);
    }

    // 取消自动重试
    function cancelRetry() {
        if (retryTimeoutId) {
            clearTimeout(retryTimeoutId);
            retryTimeoutId = null;
        }

        // 恢复按钮为绿色LINK START
        linkStartBtn.textContent = 'LINK START';
        linkStartBtn.style.background = 'linear-gradient(to bottom, #2196F3, #1976D2)';

        addLog('⏹️用户取消了重试, 流程已停止');

        // 关闭状态窗口
        if (statusWindow && document.body.contains(statusWindow)) {
            document.body.removeChild(statusWindow);
            statusWindow = null;
        }
    }

    function checkTargetAreaAvailability() {
        if (!selectedTargetAreaInfo || !FF14_STATUS_INFO) return;

        const targetArea = FF14_STATUS_INFO.find(area => area.areaId == selectedTargetAreaInfo.areaId);
        if (!targetArea) return;

        // 状态0或1表示可用
        if (targetArea.state === 0 || targetArea.state === 1) {
            const notifyOnly = document.getElementById('ff14-notify-only-checkbox')?.checked || false;
            // 停止监控 执行STOP
            if (statusCheckIntervalId) {
                clearInterval(statusCheckIntervalId);
                statusCheckIntervalId = null;
                linkStartBtn.textContent = 'LINK START';
                linkStartBtn.style.background = 'linear-gradient(to bottom, #2196F3, #1976D2)';
                if (statusWindow && document.body.contains(statusWindow)) {
                    document.body.removeChild(statusWindow);
                    statusWindow = null;
                }
                addLog('⏹️停止检查服务器状态');
            }

            // 显示页面通知
            showAvailabilityNotification(targetArea);
            // 使用GM_notification通知
            showGMNotification(targetArea);
            // 响铃
            playBeep();

            addLog(`✅目标 ${targetArea.areaName} 状态: ${getStateText(targetArea.state)} 可用! 🎉`);

            // 如果不是仅通知模式, 执行自动跨区
            if (!notifyOnly) {
                const availableGroups = targetArea.groups && targetArea.groups.filter(group =>
                    group.queueTime === 0  // 0表示服务器开放
                );
                if (!availableGroups || availableGroups.length === 0) {
                    addLog(`🚫脚本出错, 目标大区 ${targetArea.areaName} 没有可用的服务器组, 出现此错误请暂停使用等待脚本更新`);
                    return;
                }
                addLog('🚀开始执行自动跨区传送...');
                performAutoMigration(targetArea, availableGroups);
            }
        } else {
            addLog(`⛔目标 ${targetArea.areaName} 状态: ${getStateText(targetArea.state)} 等待30秒`);
        }
    }

    function showAvailabilityNotification(targetArea) {
        // 页面内通知 (保持原有代码) 
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                   background:rgba(40,40,40,0.95); color:#fff; z-index:1000002; 
                   padding:20px; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.8);
                   border:3px solid #4CAF50; min-width:300px; text-align:center;">
                <h3 style="color:#4CAF50; margin-top:0;">🎉 目标大区可用! </h3>
                <p><strong>${targetArea.areaName}</strong></p>
                <p>状态: <span style="color:#4CAF50;">${getStateText(targetArea.state)}</span></p>
                <button id="ff14-notification-close" 
                    style="margin-top:15px; padding:8px 16px; background:#4CAF50; 
                           border:none; border-radius:4px; color:white; cursor:pointer;">
                    确定
                </button>
            </div>
            `;

        document.body.appendChild(notification);

        // 关闭按钮事件
        notification.querySelector('#ff14-notification-close').addEventListener('click', () => {
            document.body.removeChild(notification);
        });

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, NOTIFICATION_TIMEOUT);
    }

    function showGMNotification(targetArea) {
        // 使用油猴的GM_notification API
        GM_notification({
            text: `大区: ${targetArea.areaName}\n状态: ${getStateText(targetArea.state)}`,
            title: "🎉 FF14 目标大区可用",
            image: "https://ff14bjz.sdo.com/favicon.ico",
            timeout: NOTIFICATION_TIMEOUT,
            onclick: function () {
                window.focus();
            }
        });
    }

    function queryStatus() {
        apiGet(
            'https://ff14bjz.sdo.com/api/orderserivce/queryGroupListTravelTarget?appId=100001900&areaId=-1&groupId=-1',
            (data) => {
                const list = safeJsonParse(data.groupList);
                if (!list) return;
                FF14_STATUS_INFO = list.map(area => ({
                    areaId: area.areaId,
                    areaName: area.areaName,
                    state: area.state,
                    groups: area.groups.map(g => ({
                        groupId: g.groupId,
                        groupName: g.groupName,
                        groupCode: g.groupCode,
                        queueTime: g.queueTime
                    }))
                }));
                updateStatusWindowContent(FF14_STATUS_INFO);
                checkTargetAreaAvailability();
            },
            (err) => {
                if (statusWindow) {
                    const areaList = statusWindow.querySelector('#ff14-status-area-list');
                    const serverList = statusWindow.querySelector('#ff14-status-server-list');
                    if (areaList) areaList.innerHTML = '<div style="color:#f44336;">查询失败</div>';
                    if (serverList) serverList.innerHTML = '<div style="color:#f44336;">查询失败</div>';
                }
            }
        );
    }

    function openStatusWindow() {
        if (statusWindow && document.body.contains(statusWindow)) return;
        statusWindow = document.createElement('div');
        statusWindow.id = 'ff14-status-window';
        statusWindow.innerHTML = `
            <div id="ff14-status-header" style="cursor: move; font-weight: bold; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span>⚔ 服务器状态监视器 (在主面板STOP关闭此窗口)</span>
            </div>
            <div id="ff14-status-content">
                <div id="ff14-status-area-list" class="status-column"><div>加载中...</div></div>
                <div id="ff14-status-server-list" class="status-column"><div>加载中...</div></div>
            </div>
        `;
        document.body.appendChild(statusWindow);
        enableDrag(statusWindow, statusWindow.querySelector('#ff14-status-header'));
        statusWindow.querySelector('#ff14-status-area-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('status-area')) {
                statusWindow.querySelectorAll('#ff14-status-area-list .status-area.selected').forEach(el => el.classList.remove('selected'));
                e.target.classList.add('selected');
                showServersForArea(e.target.dataset.areaId);
            }
        });
    }

    function updateStatusWindowContent(statusInfo) {
        if (!statusWindow) return;
        const areaList = statusWindow.querySelector('#ff14-status-area-list');
        const serverList = statusWindow.querySelector('#ff14-status-server-list');
        if (!areaList || !serverList) return;

        const selectedId = statusWindow.querySelector('#ff14-status-area-list .status-area.selected')?.dataset.areaId;
        areaList.innerHTML = '';
        statusInfo.forEach(area => {
            const div = document.createElement('div');
            div.className = 'status-item status-area';
            div.dataset.areaId = area.areaId;
            div.textContent = area.areaName;
            if (area.state === 0) div.classList.add('status-open');
            else if (area.state === 1) div.classList.add('status-busy');
            else div.classList.add('status-blocked');
            areaList.appendChild(div);
        });

        if (selectedId) {
            const el = areaList.querySelector(`[data-area-id="${selectedId}"]`);
            if (el) {
                el.classList.add('selected');
                showServersForArea(selectedId);
            } else {
                serverList.innerHTML = '<div>请先选择区域</div>';
            }
        } else if (selectedTargetAreaInfo) {
            showServersForArea(selectedTargetAreaInfo.areaId);
        } else {
            serverList.innerHTML = '<div>请先选择目标大区</div>';
        }
    }

    function showServersForArea(areaId) {
        const serverList = statusWindow.querySelector('#ff14-status-server-list');
        if (!serverList || !FF14_STATUS_INFO) {
            serverList.innerHTML = '<div>状态未加载</div>';
            return;
        }
        const area = FF14_STATUS_INFO.find(a => a.areaId == areaId);
        if (!area) {
            serverList.innerHTML = '<div>区域未找到</div>';
            return;
        }
        serverList.innerHTML = '';
        area.groups.forEach(g => {
            const div = document.createElement('div');
            div.className = 'status-item status-server';
            div.textContent = g.groupName;
            if (g.queueTime === 0) div.classList.add('status-open');
            else if (g.queueTime === -999) div.classList.add('status-full');
            else div.classList.add('status-busy');
            serverList.appendChild(div);
        });
    }

    // =============== LINK START 跨区申请 ===============
    function performAutoMigration(targetArea, availableGroups) {
        // 获取源区域和服务器信息
        const sourceArea = FF14_GROUP_LIST.find(area => area.areaId == selectedRoleInfo.selectedAreaId);
        const sourceGroup = sourceArea?.groups?.find(group => group.groupId == selectedRoleInfo.selectedGroupId);

        if (!sourceArea || !sourceGroup) {
            addLog('🚫错误: 无法获取源服务器信息, 请暂停使用脚本');
            return;
        }

        let targetGroup = null;
        let candidateGroups = [];
        // 寻找可用的服务器组 (优先选择无队列的服务器) 
        const noQueueGroups = availableGroups.filter(group => group.queueTime === 0);
        if (noQueueGroups.length > 0) {
            candidateGroups = noQueueGroups;
            addLog(`✅发现 ${noQueueGroups.length} 个无队列服务器, 进行随机选择`);
        } else {
            // 如果没有无队列服务器, 在所有可用服务器中随机选择
            candidateGroups = availableGroups;
            addLog(`⚠️无完全符合期望的服务器, 在 ${availableGroups.length} 个可用服务器中随机选择`);
        }

        // 随机选择服务器
        if (candidateGroups.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidateGroups.length);
            targetGroup = candidateGroups[randomIndex];
            addLog(`🎲随机选择: ${targetGroup.groupName} (队列时间: ${targetGroup.queueTime})`);
        }

        if (!targetGroup) {
            addLog('🚫错误: 无法找到可用的目标服务器组, 请暂停使用脚本');
            return;
        }

        // 构建角色列表参数
        const roleList = [{
            roleId: selectedRoleInfo.roleId,
            roleName: selectedRoleInfo.roleName,
            key: 1
        }];

        // 构建请求URL
        const params = new URLSearchParams({
            appId: '100001900', // 应用ID, 固定值
            areaId: sourceArea.areaId, // 源区域ID, 从选择的角色信息中获取
            areaName: sourceArea.areaName, // 源区域名称, URL编码
            groupId: sourceGroup.groupId, // 源服务器组ID, 从选择的角色信息中获取
            groupCode: sourceGroup.groupCode, // 源服务器组代码
            groupName: sourceGroup.groupName, // 源服务器组名称, URL编码
            productId: '1', // 产品ID, 固定值
            productNum: '1', // 猜测为产品数量, 固定值
            migrationType: '4', // 猜测为迁移类型, 4表示跨区传送, 固定值
            targetArea: targetArea.areaId, // 目标区域ID, 从选择的目标区域信息中获取
            targetAreaName: targetArea.areaName, // 目标区域名称, URL编码
            targetGroupId: targetGroup.groupId, // 目标服务器组ID, 从目标区域中选择的第一个可用服务器组
            targetGroupCode: targetGroup.groupCode, // 目标服务器组代码
            targetGroupName: targetGroup.groupName, // 目标服务器组名称, URL编码
            roleList: JSON.stringify(roleList), // 角色列表, JSON格式, 包含角色ID, 名称和key=1
            isMigrationTimes: '0' // 暂无猜测, 目前是固定值
        });

        // 检查关键参数是否存在
        const criticalParams = [
            'areaId', 'areaName', 'groupId', 'groupCode', 'groupName',
            'targetArea', 'targetAreaName', 'targetGroupId', 'targetGroupCode', 'targetGroupName'
        ];

        let hasMissingParams = false;
        criticalParams.forEach(param => {
            const value = params.get(param);
            if (!value || value === 'undefined' || value === 'null') {
                addLog(`🚫错误: 参数 ${param} 为空或无效: ${value}`);
                hasMissingParams = true;
            }
        });

        if (hasMissingParams) {
            addLog('🚫跨区请求参数检查失败, 请暂停使用脚本并检查日志');
            return;
        }

        const url = `https://ff14bjz.sdo.com/api/orderserivce/travelOrder?${params.toString()}`;

        addLog(`🚀发送跨区请求: 从 ${sourceArea.areaName}-${sourceGroup.groupName} 到 ${selectedTargetAreaInfo.areaName}-${targetGroup.groupName}`);
        console.log(`实际请求的URL: ${url}`)

        // 发送跨区请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.return_code === 0 && data.data?.resultCode === 0) {
                        addLog(`✅跨区申请成功! 订单ID: ${data.data.orderId}`);
                        // 确认跳转到订单页面
                        showSuccessConfirmation(data.data.orderId)
                    } else {
                        addLog(`🚫跨区申请失败: ${data.data?.resultMsg || data.return_message || '未知错误'}`);
                        // 进入重试模式
                        enterRetryMode();
                    }
                } catch (e) {
                    addLog(`❌响应解析失败: ${e.message}`);
                }
            },
            onerror: function (error) {
                addLog(`❌跨区请求失败: ${error.statusText || error.error || '网络错误'}`);
                // 进入重试模式
                enterRetryMode();
            }
        });
    }

    // 跨区申请成功提交确认对话框
    function showSuccessConfirmation(orderId) {
        const confirmation = document.createElement('div');
        confirmation.id = 'ff14-success-confirmation';
        confirmation.innerHTML = `
        <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                   background:rgba(40,40,40,0.95); color:#fff; z-index:1000003; 
                   padding:20px; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.8);
                   border:3px solid #4CAF50; min-width:350px; text-align:center;">
            <h3 style="color:#4CAF50; margin-top:0;">✅ 跨区申请已提交</h3>
            <p>您的跨区传送申请已成功提交! </p>
            <p style="font-size:12px; color:#ccc;">订单ID: ${orderId}</p>
            <p style="font-size:12px; margin-bottom:20px;">点击确认按钮跳转到订单页面查看处理状态</p>
            <button id="ff14-confirm-redirect" 
                    style="margin-top:10px; padding:8px 16px; background:#4CAF50; 
                           border:none; border-radius:4px; color:white; cursor:pointer;
                           font-size:14px; font-weight:bold;">
                确认并跳转
            </button>
        </div>
    `;

        document.body.appendChild(confirmation);

        // 确认按钮跳转到订单页面
        confirmation.querySelector('#ff14-confirm-redirect').addEventListener('click', () => {
            document.body.removeChild(confirmation);
            window.location.href = 'https://ff14bjz.sdo.com/orderList';
        });
    }

    // =============== 启动 ===============
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMainUI);
    } else {
        initMainUI();
    }
})();
