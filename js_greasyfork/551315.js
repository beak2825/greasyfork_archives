// ==UserScript==
// @name        班固米长篇点格子增强
// @version      0.1
// @description  为 Bangumi 长篇剧集提供「看到」操作拦截，和范围标记功能
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/919437
// @downloadURL https://update.greasyfork.org/scripts/551315/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%95%BF%E7%AF%87%E7%82%B9%E6%A0%BC%E5%AD%90%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551315/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%95%BF%E7%AF%87%E7%82%B9%E6%A0%BC%E5%AD%90%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use-strict';

    // --- 配置 ---
    const LONG_SERIES_THRESHOLD = 25;
    const API_CALL_DELAY = 250;
    const MAX_WAIT_TIME = 10000;

    // --- 状态映射表 ---
    const STATUS_MAP = {
        'w': { text: '看过', apiKey: 'watched', cssClass: 'epBtnWatched' },
        'q': { text: '想看', apiKey: 'queue',   cssClass: 'epBtnQueue' }, // 经确认，class为 epBtnQueue
        'd': { text: '抛弃', apiKey: 'drop',    cssClass: 'epBtnDropped' } // 猜测 class 为 epBtnDropped
    };

    // --- 脚本状态变量 ---
    let selectionState = {
        isActive: false,
        step: 'start', // 'start' or 'end'
    };

    /**
     * 等待目标元素出现在页面上
     * @param {string} selector - CSS选择器
     * @returns {Promise<Element>}
     */
    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`等待元素 "${selector}" 超时.`));
            }, MAX_WAIT_TIME);
        });
    }

    /**
     * 显示自定义模态对话框
     * @param {string} title - 对话框标题
     * @param {string} contentHtml - 对话框内容 (HTML)
     * @param {boolean} showCancel - 是否显示取消按钮
     * @returns {Promise<void>} 当用户点击确认时 resolve，点击取消或关闭时 reject
     */
    function showModal(title, contentHtml, showCancel = true) {
        return new Promise((resolve, reject) => {
            // 移除已存在的模态框
            const existingModal = document.getElementById('bgm-manager-modal');
            if (existingModal) existingModal.remove();

            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'bgm-manager-modal';
            modalOverlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6); z-index: 9999;
                display: flex; align-items: center; justify-content: center;
            `;

            modalOverlay.innerHTML = `
                <div style="background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); width: 450px; max-width: 90%;">
                    <h3 style="margin: 0; padding: 15px 20px; border-bottom: 1px solid #e0e0e0; font-size: 16px; color: #333;">${title}</h3>
                    <div style="padding: 20px; line-height: 1.6; color: #555; max-height: 40vh; overflow-y: auto;">${contentHtml}</div>
                    <div style="padding: 10px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
                        ${showCancel ? '<button id="modal-cancel-btn" class="chiiBtn" style="margin-right: 10px;">取消</button>' : ''}
                        <button id="modal-confirm-btn" class="inputBtn">确认</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modalOverlay);

            const confirmBtn = document.getElementById('modal-confirm-btn');
            const cancelBtn = document.getElementById('modal-cancel-btn');

            const closeModal = () => modalOverlay.remove();

            confirmBtn.onclick = () => {
                closeModal();
                resolve();
            };
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    closeModal();
                    reject(new Error('User cancelled'));
                };
            }
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                     closeModal();
                     reject(new Error('User cancelled'));
                }
            };
        });
    }

    /**
     * 脚本主函数
     */
    async function main() {
        const subjectId = window.location.pathname.match(/\/subject\/(\d+)/)?.[1];
        if (!subjectId) return;

        try {
            const response = await fetch(`https://api.bgm.tv/v0/subjects/${subjectId}`);
            const data = await response.json();

            if (data && data.eps != null && (!data.eps || data.eps > LONG_SERIES_THRESHOLD)) {
                const prgManager = await waitForElement('.subject_prg');
                initializeManager(prgManager);
            }
        } catch (error) {
            console.error('BGM 范围标记脚本出错:', error);
        }
    }

    /**
     * 初始化管理器
     * @param {HTMLElement} prgManager - 进度管理区块元素
     */
    function initializeManager(prgManager) {
        const panel = createManagerPanel();
        prgManager.appendChild(panel);

        const toggleBtn = document.createElement('a');
        toggleBtn.href = 'javascript:void(0);';
        toggleBtn.className = 'l';
        toggleBtn.textContent = '长篇管理';
        toggleBtn.style.marginLeft = '10px';
        toggleBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        prgManager.querySelector('a.l').insertAdjacentElement('afterend', toggleBtn);

        // Hook "看到(WatchedTill)" 操作
        if (window.chiiLib?.home?.epStatusClick) {
            const origEpStatusClick = window.chiiLib.home.epStatusClick;
            window.chiiLib.home.epStatusClick = async function (targetElement) {
                const statusType = $(targetElement).attr('id').split('_')[0];
                if (statusType === 'WatchedTill') {
                    try {
                        const epNum = $(targetElement).closest('.prg_popup').parent().find('.epBtnAir, .epBtnQueue, .epBtnDropped').first().text();
                        await showModal('操作确认', `确定要将第 1 集到第 ${epNum} 集全部标记为“看过”吗？`);
                        origEpStatusClick.apply(this, arguments);
                    } catch (e) {
                        // 用户取消操作
                    }
                } else {
                     origEpStatusClick.apply(this, arguments);
                }
            };
        }
    }

    /**
     * 创建主管理面板 (包含两种模式)
     */
    function createManagerPanel() {
        const panel = document.createElement('div');
        panel.id = 'range-manager-panel';
        panel.style.cssText = 'display: none; border: 1px solid #E0E0E0; border-radius: 5px; margin-top: 10px; background-color: #F9F9F9;';

        // Tab 切换
        panel.innerHTML = `
            <div id="manager-tabs" style="display: flex; border-bottom: 1px solid #e0e0e0;">
                <button class="tab-btn active" data-tab="interactive">范围选择</button>
                <button class="tab-btn" data-tab="batch">文件式批量管理</button>
            </div>
            <div id="manager-content" style="padding: 10px;"></div>
        `;

        const contentDiv = panel.querySelector('#manager-content');
        contentDiv.innerHTML = createInteractivePanelHtml(); // 默认显示交互模式

        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = (e) => {
                panel.querySelector('.tab-btn.active').classList.remove('active');
                e.target.classList.add('active');
                if (e.target.dataset.tab === 'interactive') {
                    contentDiv.innerHTML = createInteractivePanelHtml();
                    bindInteractivePanelEvents();
                } else {
                    contentDiv.innerHTML = createBatchPanelHtml();
                    bindBatchPanelEvents();
                }
            };
        });

        // Tab 样式
        const style = document.createElement('style');
        style.textContent = `
            .tab-btn { background: none; border: none; padding: 10px 15px; cursor: pointer; color: #555; font-size: 13px; }
            .tab-btn.active { background-color: #fff; border-bottom: 2px solid #f09199; font-weight: bold; }
            #batch-textarea { width: 95%; min-height: 100px; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-family: monospace; }
        `;
        document.head.appendChild(style);

        // 绑定默认面板的事件
        setTimeout(() => bindInteractivePanelEvents(), 0);

        return panel;
    }

    // --- 交互选择模式 ---
    function createInteractivePanelHtml() {
        return `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <label>范围:</label>
                <input type="number" id="range-start" class="inputtext" style="width: 60px;" min="1" placeholder="开始">
                <span>-</span>
                <input type="number" id="range-end" class="inputtext" style="width: 60px;" min="1" placeholder="结束">
                <button id="interactive-select-btn" class="chiiBtn">交互选择模式</button>
            </div>
            <button id="mark-watched-interactive-btn" class="inputBtn" style="width: 100%;">标记为看过</button>
            <div id="interactive-progress" style="margin-top: 5px; color: #666; font-size: 12px;"></div>
        `;
    }

    function bindInteractivePanelEvents() {
        document.getElementById('interactive-select-btn').onclick = toggleSelectionMode;
        document.getElementById('mark-watched-interactive-btn').onclick = () => {
            const start = document.getElementById('range-start').value;
            const end = document.getElementById('range-end').value;
            executeMarking([{ start, end, status: 'w' }], 'interactive-progress');
        };
    }

    function toggleSelectionMode() {
        const btn = document.getElementById('interactive-select-btn');
        const episodeList = document.querySelector('ul.prg_list');
        selectionState.isActive = !selectionState.isActive;

        if (selectionState.isActive) {
            selectionState.step = 'start';
            btn.textContent = '请选择开始集数';
            btn.classList.add('inputBtn'); //
            episodeList.style.cursor = 'pointer';
            episodeList.addEventListener('click', handleEpisodeSelection);
        } else {
            resetSelectionMode();
        }
    }

    function resetSelectionMode() {
        const btn = document.getElementById('interactive-select-btn');
        const episodeList = document.querySelector('ul.prg_list');
        selectionState.isActive = false;
        if(btn) btn.textContent = '范围选择';
        if(btn) btn.classList.remove('inputBtn');
        if(episodeList) {
            episodeList.style.cursor = '';
            episodeList.removeEventListener('click', handleEpisodeSelection);
        }
    }

    function handleEpisodeSelection(e) {
        e.preventDefault();
        const epNum = parseInt(e.target.textContent, 10);
        if (isNaN(epNum)) return;

        const startInput = document.getElementById('range-start');
        const endInput = document.getElementById('range-end');
        const btn = document.getElementById('interactive-select-btn');

        if (selectionState.step === 'start') {
            startInput.value = epNum;
            endInput.value = ''; // 清空结束，以便重新选择
            selectionState.step = 'end';
            btn.textContent = '请选择结束集数';
        } else {
            // 自动判断大小并填充
            const startVal = parseInt(startInput.value, 10);
            if (epNum < startVal) {
                endInput.value = startVal;
                startInput.value = epNum;
            } else {
                endInput.value = epNum;
            }
            resetSelectionMode();
        }
    }

    // --- 批量输入模式 ---
    function createBatchPanelHtml() {
        return `
            <p style="font-size: 12px; color: #666; margin-top: 0;">每行一条指令: <b>开始集数 结束集数 状态码</b><br>状态码: <b>w</b>=看过, <b>q</b>=想看, <b>d</b>=抛弃</p>
            <textarea id="batch-textarea" placeholder="例如:\n1 12 w\n25 25 d\n130 120 q (范围会自动修正)"></textarea>
            <button id="batch-execute-btn" class="inputBtn" style="margin-top: 10px; width: 100%;">预览并执行</button>
            <div id="batch-progress" style="margin-top: 5px; color: #666; font-size: 12px;"></div>
        `;
    }

    function bindBatchPanelEvents() {
        document.getElementById('batch-execute-btn').onclick = handleBatchInput;
    }

    async function handleBatchInput() {
        const text = document.getElementById('batch-textarea').value;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const progressDiv = document.getElementById('batch-progress');
        let tasks = [];
        let errors = [];

        lines.forEach((line, index) => {
            const parts = line.trim().split(/\s+/);
            if (parts.length !== 3) {
                errors.push(`第 ${index + 1} 行格式错误。`);
                return;
            }
            let [start, end, status] = parts;
            start = parseInt(start, 10);
            end = parseInt(end, 10);
            status = status.toLowerCase();

            if (isNaN(start) || isNaN(end)) {
                errors.push(`第 ${index + 1} 行的集数无效。`);
                return;
            }
            if (!STATUS_MAP[status]) {
                errors.push(`第 ${index + 1} 行的状态码 "${status}" 无效。`);
                return;
            }

            // 智能修正范围
            if (start > end) [start, end] = [end, start];

            tasks.push({ start, end, status });
        });

        if (errors.length > 0) {
            progressDiv.textContent = errors.join(' ');
            return;
        }
        if(tasks.length === 0) {
            progressDiv.textContent = '没有可执行的操作。'; return;
        }

        const previewHtml = tasks.map(t => `<li>将 ${t.start}-${t.end} 集标记为 <b>${STATUS_MAP[t.status].text}</b></li>`).join('');

        try {
            await showModal('操作预览', `<p>将执行以下 ${tasks.length} 个操作，请确认:</p><ul style="margin-top: 10px; padding-left: 20px;">${previewHtml}</ul>`);
            executeMarking(tasks, 'batch-progress');
        } catch(e) {
            progressDiv.textContent = '操作已取消。';
        }
    }

    // --- 通用执行与工具函数 ---
    async function executeMarking(tasks, progressDivId) {
        const progressDiv = document.getElementById(progressDivId);
        const allButtons = document.querySelectorAll('#interactive-select-btn, #mark-watched-interactive-btn, #batch-execute-btn');

        allButtons.forEach(btn => btn.disabled = true);
        progressDiv.textContent = '正在准备...';

        const epMap = getEpisodeMap();
        const token = getSecurityToken();
        if (!token) {
            progressDiv.textContent = '错误: 无法获取安全令牌。';
            allButtons.forEach(btn => btn.disabled = false);
            return;
        }

        let totalMarked = 0;
        for (const task of tasks) {
            for (let i = task.start; i <= task.end; i++) {
                const epInfo = epMap[i];
                if (epInfo) {
                    progressDiv.textContent = `标记中: ${i}集 -> ${STATUS_MAP[task.status].text}...`;
                    await updateEpStatus(epInfo.id, task.status, token);
                    updateButtonLook(epInfo.button, task.status);
                    totalMarked++;
                }
            }
        }

        progressDiv.textContent = `完成! 共标记了 ${totalMarked} 个剧集。`;
        allButtons.forEach(btn => btn.disabled = false);
    }

    function updateEpStatus(epId, statusKey, token) {
        const apiKey = STATUS_MAP[statusKey].apiKey;
        const url = `/subject/ep/${epId}/status/${apiKey}?gh=${token}`;
        return new Promise(resolve => {
            fetch(url)
                .catch(err => console.error(`更新剧集 ${epId} 失败:`, err))
                .finally(() => setTimeout(resolve, API_CALL_DELAY));
        });
    }

    function updateButtonLook(button, statusKey) {
        if (!button) return;
        Object.values(STATUS_MAP).forEach(s => button.classList.remove(s.cssClass));
        button.classList.remove('epBtnAir', 'epBtnNA', 'epBtnUnknown');
        button.classList.add(STATUS_MAP[statusKey].cssClass);
    }

    function getEpisodeMap() {
        const map = {};
        document.querySelectorAll('ul.prg_list li a').forEach(btn => {
            const epNum = parseInt(btn.textContent, 10);
            const epIdMatch = btn.id.match(/prg_(\d+)/);
            if (!isNaN(epNum) && epIdMatch) map[epNum] = { id: epIdMatch[1], button: btn };
        });
        return map;
    }

    function getSecurityToken() {
        const sampleLink = document.querySelector('div.prg_popup a[id^="Watched_"]');
        return sampleLink ? sampleLink.href.match(/gh=([a-f0-9]+)/)?.[1] : null;
    }

    main();

})();