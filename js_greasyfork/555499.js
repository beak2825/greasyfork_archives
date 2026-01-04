// ==UserScript==
// @name         思齐钓鱼小助手
// @namespace    http://tampermonkey.net/
// @version      2.9.9.2
// @description  钓鱼图鉴助手，显示缺失/富余鱼类，并可一键赠送好友（支持舔狗模式），另外当前页面会展示不同鱼竿/鱼饵的概率。
// @author       kiwi4814
// @license      Copyright (c) 2025 kiwi4814, All Rights Reserved
// @match        https://si-qi.xyz/siqi_fishing.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555499/%E6%80%9D%E9%BD%90%E9%92%93%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555499/%E6%80%9D%E9%BD%90%E9%92%93%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================================================================================
    // SHARED UTILS & CONSTANTS
    // ======================================================================================
    const CONSTANTS = {
        DEBUG_MODE: false,
        LICKDOG_MODE_KEY: 'FISHING_HELPER_LICKDOG_MODE',
        TIME_SLOT_MAP: {
            1: '00:00 - 03:59 (深夜)',
            2: '04:00 - 07:59 (清晨)',
            3: '08:00 - 11:59 (上午)',
            4: '12:00 - 15:59 (午后)',
            5: '16:00 - 19:59 (傍晚)',
            6: '20:00 - 23:59 (夜晚)',
        },
        RARITY_ORDER: ['传说', '史诗', '稀有', '不常见', '普通'],
        RARITY_TO_TASK_ID: {
            '普通': 1, '不常见': 2, '稀有': 3, '史诗': 4, '传说': 5,
        }
    };

    const Logger = {
        log: (msg, ...args) => { if (CONSTANTS.DEBUG_MODE) console.log(`[钓鱼助手] ${msg}`, ...args); },
        error: (msg, ...args) => console.error(`[钓鱼助手] ${msg}`, ...args)
    };


    let GlobalState = {
        fishingData: null
    };
    // ======================================================================================
    // MODULE 1: 图鉴与赠送助手
    // ======================================================================================
    class CodexHelper {
        constructor() {
            this.initialized = false;
            this.codexMap = {};
            this.surplusMap = {}; // 我有的多余
            this.missingMap = {}; // 我缺少的
            this.isAllTaskDone = false;
            this.dataIsStale = false;

            // Load Settings
            const savedMode = localStorage.getItem(CONSTANTS.LICKDOG_MODE_KEY);
            this.lickDogMode = savedMode === '1';

            this.init();
        }

        init() {
            if (this.initialized) return;
            this.addStyles();
            this.createButton();
            this.initialized = true;
        }

        // --- Core Logic ---

        getNeededQuantity(fishInfo, userTasks) {
            if (this.lickDogMode) return 0;
            if (this.isAllTaskDone) return 0;

            const rarity = fishInfo.rarity_label;
            const rarityTaskId = CONSTANTS.RARITY_TO_TASK_ID[rarity];
            const isRarityTaskDone = rarityTaskId && userTasks[rarityTaskId] && userTasks[rarityTaskId].status === 'completed';

            return isRarityTaskDone ? 1 : 2;
        }

        getCurrentTimeSlotId() {
            const h = new Date().getHours();
            if (h < 4) return 1; if (h < 8) return 2; if (h < 12) return 3;
            if (h < 16) return 4; if (h < 20) return 5; return 6;
        }

        async apiGiftFish(friendId, fishCode, quantity) {
            Logger.log(`Sending ${quantity} of #${fishCode} to ${friendId}`);
            const formData = new URLSearchParams();
            formData.append('action', 'gift_fish');
            formData.append('fish_code', fishCode);
            formData.append('target_uid', friendId);
            formData.append('quantity', quantity);

            return fetch('siqi_fishing.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', accept: '*/*' },
                body: formData,
            }).then((response) => response.json());
        }

        /**
         * 生成交易字符串
         * @param {string|null} targetRarity - 如果传入稀有度(如'传说')，则只包含该稀有度的鱼；如果为null，包含所有。
         */
        generateTradeString(targetRarity = null) {
            // 1. 过滤 Missing
            let missingCodes = Object.keys(this.missingMap).map(Number);
            if (targetRarity) {
                missingCodes = missingCodes.filter(c => this.missingMap[c].rarity_label === targetRarity);
            }
            missingCodes.sort((a, b) => a - b);

            // 2. 过滤 Surplus
            let surplusCodes = Object.keys(this.surplusMap).map(Number);
            if (targetRarity) {
                surplusCodes = surplusCodes.filter(c => this.surplusMap[c].rarity === targetRarity);
            }
            surplusCodes.sort((a, b) => a - b);

            // 3. 生成字符串
            // 格式: [缺:1,2][余:3,4]
            let suffix = targetRarity ? `[${targetRarity}]` : `[全量]`;
            const str = `${suffix}[缺:${missingCodes.join(',')}][余:${surplusCodes.join(',')}]`;

            return {
                text: str,
                count: missingCodes.length + surplusCodes.length
            };
        }

        parseTradeString(str) {
            const result = { friendMissing: [], friendSurplus: [], isValid: false };

            const missingMatch = str.match(/\[缺:([\d,]+)\]/);
            const surplusMatch = str.match(/\[余:([\d,]+)\]/);

            if (missingMatch || surplusMatch) {
                result.isValid = true;
                if (missingMatch) {
                    result.friendMissing = missingMatch[1].split(',').map(Number).filter(n => n > 0);
                }
                if (surplusMatch) {
                    result.friendSurplus = surplusMatch[1].split(',').map(Number).filter(n => n > 0);
                }
            }
            return result;
        }

        // --- Analysis & UI Rendering ---

        analyzeAndShowReport() {
            const data = GlobalState.fishingData;
            Logger.log('Analyzing data...');

            if (!data || !data.codex || !data.tasks) {
                alert('图鉴助手：未找到数据 (codex 或 tasks)！请刷新页面。');
                return;
            }

            // Restore previous inputs
            let prevFishInput = '', prevIdInput = '';
            const existingModal = document.getElementById('codexHelperModal');
            if (existingModal) {
                const fInput = existingModal.querySelector('#friendFishInput');
                const iInput = existingModal.querySelector('#friendIdInput');
                if (fInput) prevFishInput = fInput.value;
                if (iInput) prevIdInput = iInput.value;
                existingModal.remove();
            }

            // Reset Maps
            this.codexMap = {};
            this.surplusMap = {};
            this.missingMap = {};
            const slotSummary = {};
            const missingSummary = {};
            const surplusSummary = {};
            const globalSlotCount = {};

            CONSTANTS.RARITY_ORDER.forEach((r) => {
                slotSummary[r] = { total: 0, slots: {} };
                missingSummary[r] = [];
                surplusSummary[r] = [];
            });

            data.codex.forEach((fish) => (this.codexMap[fish.code] = fish));

            const inventory = data.inventory.fish;
            const userTasks = data.tasks || {};
            this.isAllTaskDone = userTasks['6'] && userTasks['6'].status === 'completed';
            const currentSlotId = this.getCurrentTimeSlotId();
            const getCode = (item) => (typeof item === 'object' ? item.code : item);

            // Analyze Missing
            data.codex.forEach((fish) => {
                const quantity = inventory[fish.code] ? inventory[fish.code].quantity : 0;
                if (quantity === 0) {
                    const rarity = fish.rarity_label;
                    const slot = fish.time_slot;
                    const missingItem = fish.discovered ? { code: fish.code, name: fish.name } : fish.code;

                    slotSummary[rarity].total++;
                    if (!slotSummary[rarity].slots[slot]) slotSummary[rarity].slots[slot] = { count: 0, codes: [] };
                    slotSummary[rarity].slots[slot].count++;
                    slotSummary[rarity].slots[slot].codes.push(missingItem);
                    missingSummary[rarity].push(missingItem);
                    this.missingMap[fish.code] = fish;

                    if (!globalSlotCount[slot]) globalSlotCount[slot] = 0;
                    globalSlotCount[slot]++;
                }
            });
            CONSTANTS.RARITY_ORDER.forEach((r) => missingSummary[r].sort((a, b) => getCode(a) - getCode(b)));

            // Analyze Surplus
            for (const codeStr in inventory) {
                const item = inventory[codeStr];
                const code = parseInt(codeStr, 10);
                const fishInfo = this.codexMap[code];
                if (!fishInfo) continue;

                const quantity = item.quantity;
                const neededQuantity = this.getNeededQuantity(fishInfo, userTasks);

                if (quantity > neededQuantity) {
                    const surplusFish = {
                        code,
                        name: fishInfo.name,
                        quantity,
                        rarity: fishInfo.rarity_label,
                    };
                    surplusSummary[fishInfo.rarity_label].push(surplusFish);
                    this.surplusMap[code] = surplusFish;
                }
            }
            CONSTANTS.RARITY_ORDER.forEach((r) => surplusSummary[r].sort((a, b) => a.code - b.code));

            this.renderModal({
                prevFishInput,
                prevIdInput,
                missingSummary,
                surplusSummary,
                globalSlotCount,
                slotSummary,
                currentSlotId
            });
        }

        renderModal(ctx) {
            const modal = document.createElement('div');
            modal.id = 'codexHelperModal';

            let modalBodyHTML = `<div id="dataStatusWarning" style="display: ${this.dataIsStale ? 'block' : 'none'};">
                ⚠️ 当前库存数据可能已变更，请 <button id="reloadStatsBtn" class="helper-btn-sm">刷新统计</button> 或 <button id="reloadPageBtn" class="helper-btn-sm">刷新页面</button> 获取准确数据。
            </div>`;

            // Friend Gift Section
            modalBodyHTML += `<div class="report-section friend-compare">
                <h3>海鲜市场</h3>
                <div class="lickdog-mode-container ${this.lickDogMode ? 'active' : ''}">
                    <label class="lickdog-switch">
                        <input type="checkbox" id="lickDogModeToggle" ${this.lickDogMode ? 'checked' : ''}>
                        <span class="lickdog-slider"></span>
                    </label>
                    <span class="lickdog-label">舔狗模式 ${this.lickDogMode ? '(已开启 - 清空家底)' : '(已关闭 - 保留任务鱼)'}</span>
                </div>

                <div class="gift-inputs">
                    <input type="text" id="friendFishInput" placeholder="输入好友缺失鱼类，或粘贴【交易码】..." value="${ctx.prevFishInput}">
                    <input type="text" id="friendIdInput" placeholder="好友ID" value="${ctx.prevIdInput}" style="flex-grow:0.5; width:80px;">
                </div>
                <div class="action-buttons">
                    <button id="compareFriendBtn">🔍 解析与查询</button>
                    <button id="copyTradeStringBtn" class="btn-secondary" style="margin-left:10px;">📋 复制交易码</button>
                </div>

                <div id="tradeAnalysisResult" style="margin-top:10px;"></div>
                <div id="giftResult"></div>
                <div id="giftProgress"></div>
            </div>`;

            // Missing Summary
            modalBodyHTML += `<div class="report-section summary-section"><h3>缺失总览</h3><ul class="summary-list">`;
            CONSTANTS.RARITY_ORDER.forEach((rarity) => {
                const items = ctx.missingSummary[rarity];
                let content = items.length === 0 ? '<span class="no-data">✔️ 已集齐</span>' :
                    `<div class="code-badge-container">${items.map(item => (typeof item === 'object' ? `<span class="code-badge known-missing-badge">#${item.code} ${item.name}</span>` : `<span class="code-badge">#${item}</span>`)).join('')}</div>`;

                // 仅复制该稀有度的按钮
                const copyTierBtn = `<button class="copy-tier-btn" data-copy-rarity="${rarity}" title="复制仅含【${rarity}】的交易码">📋</button>`;

                modalBodyHTML += `<li class="summary-item">
                    <div style="display:flex;align-items:center;">
                        <strong class="rarity-title rarity-${rarity}">${rarity} (${items.length}条)</strong>
                        ${copyTierBtn}
                    </div>
                    ${content}
                </li>`;
            });
            modalBodyHTML += `</ul></div>`;

            // Surplus Summary
            modalBodyHTML += `<div class="report-section summary-section surplus-list"><h3>富余统计</h3><ul class="summary-list">`;
            CONSTANTS.RARITY_ORDER.forEach((rarity) => {
                const fishes = ctx.surplusSummary[rarity];
                let content = fishes.length === 0 ? '<span class="no-data">-- 无 --</span>' :
                    `<div class="code-badge-container">${fishes.map(f => `<span class="code-badge surplus-badge">#${f.code} ${f.name} (x${f.quantity})</span>`).join('')}</div>`;
                modalBodyHTML += `<li class="summary-item"><strong class="rarity-title rarity-${rarity}">${rarity} (${fishes.length}种)</strong>${content}</li>`;
            });
            modalBodyHTML += `</ul></div>`;

            // Missing Details (Time Slots)
            modalBodyHTML += `<div class="report-section"><h3>缺失详情</h3>`;
            const sortedSlots = Object.entries(ctx.globalSlotCount).filter(([, count]) => count > 0).sort(([, countA], [, countB]) => countB - countA);
            if (sortedSlots.length > 0) {
                modalBodyHTML += `<div class="slot-priority-summary"><strong>优先时段 (总计):</strong><div class="priority-badge-container">${sortedSlots.map(([slotId, count], index) => {
                    let hotnessClass = index === 0 ? 'priority-high' : (index === 1 ? 'priority-medium' : 'priority-low');
                    return `<span class="priority-badge ${hotnessClass}">${CONSTANTS.TIME_SLOT_MAP[slotId] || '时段' + slotId} (缺 ${count})</span>`;
                }).join('')}</div></div>`;
            }

            CONSTANTS.RARITY_ORDER.forEach((rarity) => {
                const data = ctx.slotSummary[rarity];
                if (data.total === 0) {
                    modalBodyHTML += `<div class="rarity-section"><h3 class="rarity-title rarity-${rarity}">${rarity} <span class="rarity-summary-inline complete"> (✔️ 已集齐)</span></h3></div>`;
                } else {
                    let content = `<ul class="slot-list">`;
                    Object.keys(data.slots).sort((a, b) => a - b).forEach((slotKey) => {
                        const slotData = data.slots[slotKey];
                        const getCode = (item) => (typeof item === 'object' ? item.code : item);
                        const codesBadges = slotData.codes.sort((a, b) => getCode(a) - getCode(b))
                            .map(item => (typeof item === 'object' ? `<span class="code-badge known-missing-badge">#${item.code} ${item.name}</span>` : `<span class="code-badge">#${item}</span>`)).join('');

                        const isCurrentSlot = slotKey == ctx.currentSlotId;
                        content += `<li class="${isCurrentSlot ? 'slot-item current-timeslot-highlight' : 'slot-item'}">
                            <strong>${CONSTANTS.TIME_SLOT_MAP[slotKey] || '时段' + slotKey} ${isCurrentSlot ? '🚩 <span class="current-slot-marker">[当前时段]</span>' : ''} <span class="slot-summary-inline">(缺失 ${slotData.count} 条)</span></strong>
                            <div class="code-badge-container">${codesBadges}</div></li>`;
                    });
                    content += '</ul>';
                    modalBodyHTML += `<div class="rarity-section"><h3 class="rarity-title rarity-${rarity}">${rarity} <span class="rarity-summary-inline">(共缺失 ${data.total} 条)</span></h3>${content}</div>`;
                }
            });
            modalBodyHTML += `</div>`;

            modal.innerHTML = `<div class="modal-content"><span class="modal-close">&times;</span><h2>🐠 钓鱼图鉴助手</h2><div class="modal-body">${modalBodyHTML}</div></div>`;
            document.body.appendChild(modal);

            this.bindModalEvents(modal, ctx);
        }

        bindModalEvents(modal, ctx) {
            modal.querySelector('.modal-close').onclick = () => modal.remove();
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

            if (this.dataIsStale) {
                modal.querySelector('#reloadStatsBtn').onclick = () => this.analyzeAndShowReport();
                modal.querySelector('#reloadPageBtn').onclick = () => window.location.reload();
            }

            // Copy Full Trade String
            const copyBtn = modal.querySelector('#copyTradeStringBtn');
            copyBtn.onclick = () => {
                const res = this.generateTradeString(null); // Copy All
                navigator.clipboard.writeText(res.text).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✅ 已复制全量!';
                    setTimeout(() => copyBtn.textContent = originalText, 2000);
                });
            };

            // Copy Tiered Trade String
            modal.querySelectorAll('.copy-tier-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const rarity = e.target.dataset.copyRarity;
                    const res = this.generateTradeString(rarity);
                    if (res.count === 0) {
                        alert(`当前【${rarity}】分类下，你既没有缺的，也没有富余的，生成了个寂寞。`);
                        return;
                    }
                    navigator.clipboard.writeText(res.text).then(() => {
                        const originalText = e.target.textContent;
                        e.target.textContent = '✅';
                        setTimeout(() => e.target.textContent = originalText, 1500);
                    });
                };
            });

            const performQuery = () => this.handleGiftQuery(modal);
            modal.querySelector('#compareFriendBtn').onclick = performQuery;

            const lickDogToggle = modal.querySelector('#lickDogModeToggle');
            if (lickDogToggle) {
                lickDogToggle.onchange = (e) => {
                    this.lickDogMode = e.target.checked;
                    localStorage.setItem(CONSTANTS.LICKDOG_MODE_KEY, this.lickDogMode ? '1' : '0');
                    Logger.log('舔狗模式已', this.lickDogMode ? '开启' : '关闭');
                    this.analyzeAndShowReport();
                };
            }

            if (ctx.prevFishInput && ctx.prevFishInput.trim().length > 0) performQuery();

            modal.querySelector('#giftResult').onclick = (e) => {
                if (e.target && e.target.id === 'batchGiftBtn') this.handleBatchGift(modal, e.target);
            };
        }

        // --- Intelligent Matching Logic ---
        handleGiftQuery(modal) {
            const input = modal.querySelector('#friendFishInput').value.trim();
            const resultDiv = modal.querySelector('#giftResult');
            const analysisDiv = modal.querySelector('#tradeAnalysisResult');
            const progressDiv = modal.querySelector('#giftProgress');

            // Reset UI
            if (resultDiv) { resultDiv.innerHTML = ''; resultDiv.style.color = '#dc3545'; }
            if (analysisDiv) { analysisDiv.innerHTML = ''; analysisDiv.style.display = 'none'; }
            if (progressDiv) progressDiv.style.display = 'none';

            if (!input) return;

            let friendMissingCodes = [];
            let friendSurplusCodes = [];
            let isTradeMode = false;

            // 1. Parse Input
            const tradeData = this.parseTradeString(input);
            if (tradeData.isValid) {
                isTradeMode = true;
                friendMissingCodes = tradeData.friendMissing;
                friendSurplusCodes = tradeData.friendSurplus;
            } else {
                friendMissingCodes = input.split(/[\s,]+/).map((c) => parseInt(c.replace('#', ''), 10)).filter((c) => !isNaN(c) && c > 0);
            }

            if (friendMissingCodes.length === 0 && friendSurplusCodes.length === 0) {
                resultDiv.innerHTML = '<span class="gift-error">未识别到有效的鱼编号</span>';
                return;
            }

            // 2. Intelligent Trade Matching (What they have -> I need)
            if (isTradeMode && friendSurplusCodes.length > 0) {
                const perfectTrades = []; // Same Rarity
                const unevenTrades = [];  // Cross Rarity

                // Helper to get rarity index
                const rIndex = (r) => CONSTANTS.RARITY_ORDER.indexOf(r);

                friendSurplusCodes.forEach(code => {
                    if (this.missingMap[code]) {
                        const fish = this.missingMap[code];
                        // 简化逻辑：只展示我缺的，并标记稀有度
                        const tradeItem = { code: fish.code, name: fish.name, rarity: fish.rarity_label };
                        perfectTrades.push(tradeItem);
                    }
                });

                if (perfectTrades.length > 0) {
                    analysisDiv.style.display = 'block';
                    // Group by rarity for display
                    perfectTrades.sort((a,b) => rIndex(a.rarity) - rIndex(b.rarity));
                    const matchHtml = perfectTrades
                        .map((f) => {
                            const colorMap = {
                                '传说': '#d79000',
                                '史诗': '#7b3fa1',
                                '稀有': '#4169e1',
                                '不常见': '#3c9d9b',
                                '普通': '#5e807f',
                            };
                            const color = colorMap[f.rarity] || '#5e807f';
                            const style = `border: 1px solid ${color}; color: ${color}; background-color: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.05);`;
                            return `<span class="code-badge" style="${style}">[${f.rarity}] #${f.code} ${f.name}</span>`;
                        })
                        .join('');

                    analysisDiv.innerHTML = `<div class="trade-match-box">
                        <strong>双向匹配 (对方有 ${perfectTrades.length} 种你缺的):</strong>
                        <div class="code-badge-container" style="margin-top:5px;">${matchHtml}</div>
                        <div style="font-size:0.85em;color:#666;margin-top:4px;">(请与对方乞讨或交换)</div>
                    </div>`;
                }
            }

            // 3. Gifting Logic (What I have -> They need)
            const ownSurplusCodes = Object.keys(this.surplusMap).map(Number);
            const canGiftCodes = ownSurplusCodes.filter((c) => friendMissingCodes.includes(c));

            if (canGiftCodes.length > 0) {
                const itemsHTML = canGiftCodes.sort((a, b) => a - b).map((code) => {
                    const fish = this.surplusMap[code];
                    const currentQuantity = GlobalState.fishingData.inventory.fish[code] ? GlobalState.fishingData.inventory.fish[code].quantity : 0;
                    if (currentQuantity === 0) return '';
                    return `<div class="gift-item" data-fish-code="${fish.code}">
                        <input type="checkbox" class="gift-item-check" id="check-gift-${fish.code}">
                        <label for="check-gift-${fish.code}"><span class="rarity-dot rarity-${fish.rarity}"></span> #${fish.code} ${fish.name} (你有 ${currentQuantity})</label>
                        <input type="number" class="gift-item-quantity" value="1" min="1" max="${currentQuantity}">
                    </div>`;
                }).join('');

                if (itemsHTML === '') {
                    resultDiv.style.color = '#5a3300';
                    resultDiv.innerHTML = '暂无可赠送的鱼 (可能在内存中已送完)';
                } else {
                    const headerHtml = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                            <h4 style="margin:0;"> 我可赠送/交换 (${canGiftCodes.length}种):</h4>
                            <label style="font-size:0.9em; cursor:pointer; user-select:none;">
                                <input type="checkbox" id="giftSelectAllBtn" style="vertical-align:middle;"> 全选
                            </label>
                        </div>`;

                    resultDiv.innerHTML = headerHtml + itemsHTML + '<button id="batchGiftBtn" class="gift-btn-batch"> 批量赠送选中</button>';

                    const selectAllBtn = resultDiv.querySelector('#giftSelectAllBtn');
                    if (selectAllBtn) {
                        selectAllBtn.onchange = (e) => {
                            const isChecked = e.target.checked;
                            resultDiv.querySelectorAll('.gift-item-check').forEach(cb => {
                                cb.checked = isChecked;
                            });
                        };
                    }
                }
            } else {
                resultDiv.style.color = '#5a3300';
                resultDiv.innerHTML = isTradeMode ? '暂无可赠送给对方的鱼。' : '暂无可赠送的鱼。';
            }
        }

        async handleBatchGift(modal, btn) {
            const friendIdInput = modal.querySelector('#friendIdInput');
            const friendId = friendIdInput.value.trim();

            if (!friendId) {
                alert('请先在上方输入好友的用户ID，然后再点击赠送！');
                friendIdInput.focus();
                return;
            }

            const checkedItems = modal.querySelectorAll('.gift-item-check:checked');
            if (checkedItems.length === 0) {
                alert('请至少勾选一种要赠送的鱼！');
                return;
            }

            const giftsToMake = [];
            const warnings = [];
            const userTasks = GlobalState.fishingData.tasks || {};

            for (const checkbox of checkedItems) {
                const itemDiv = checkbox.closest('.gift-item');
                const fishCode = itemDiv.dataset.fishCode;
                const quantityInput = itemDiv.querySelector('.gift-item-quantity');
                const quantityToGift = parseInt(quantityInput.value, 10);
                const fishInfo = this.codexMap[fishCode];
                const currentQuantity = GlobalState.fishingData.inventory.fish[fishCode].quantity;

                if (isNaN(quantityToGift) || quantityToGift <= 0 || quantityToGift > currentQuantity) {
                    alert(`#${fishCode} ${fishInfo.name} 的数量( ${quantityToGift} )无效！\n你最多只能送 ${currentQuantity} 条。`);
                    return;
                }

                giftsToMake.push({ code: fishCode, name: fishInfo.name, quantityToGift, currentQuantity });

                if (!this.lickDogMode) {
                    const needed = this.getNeededQuantity(fishInfo, userTasks);
                    const remaining = currentQuantity - quantityToGift;
                    if (remaining < needed) warnings.push(`#${fishCode} ${fishInfo.name} (赠送后剩余 ${remaining}条, 任务需 ${needed}条)`);
                }
            }

            let confirmMessage = `确定要赠送 ${giftsToMake.length} 种鱼给好友 #${friendId} 吗？`;
            if (warnings.length > 0) confirmMessage += `\n\n- - - ⚠️ 警告! - - -\n以下鱼类赠送后将不足以完成任务：\n${warnings.join('\n')}\n\n是否仍然继续？`;
            if (!confirm(confirmMessage)) return;

            btn.disabled = true;
            btn.textContent = '赠送中...';
            const progressDiv = modal.querySelector('#giftProgress');
            progressDiv.style.display = 'block';
            progressDiv.innerHTML = '<h3>赠送进度</h3>';

            let successCount = 0, failCount = 0, totalGifted = 0;

            for (const gift of giftsToMake) {
                progressDiv.innerHTML += `<div>⏳ 正在赠送 #${gift.code} ${gift.name} (x${gift.quantityToGift})...</div>`;
                try {
                    const data = await this.apiGiftFish(friendId, gift.code, gift.quantityToGift);
                    if (data.success) {
                        successCount++;
                        totalGifted += gift.quantityToGift;
                        progressDiv.innerHTML += `<div class="progress-success">  ✔️ 成功! ${data.message}</div>`;
                        GlobalState.fishingData.inventory.fish[gift.code].quantity -= gift.quantityToGift;
                        this.dataIsStale = true;
                    } else {
                        failCount++;
                        progressDiv.innerHTML += `<div class="progress-fail">  ❌ 失败: ${data.message}</div>`;
                    }
                } catch (err) {
                    failCount++;
                    Logger.error('Gift API Error:', err);
                    progressDiv.innerHTML += `<div class="progress-fail">  ❌ 发生网络错误: ${err.message}</div>`;
                }
            }

            progressDiv.innerHTML += `<hr><div><b>🎉 批量赠送完成</b><br>共 ${giftsToMake.length} 种鱼，成功 ${successCount} 种，失败 ${failCount} 种。 (总计送出 ${totalGifted} 条)</div>`;
            const resultDiv = modal.querySelector('#giftResult');
            if (resultDiv) resultDiv.innerHTML = '';

            if (this.dataIsStale) {
                const warningDiv = modal.querySelector('#dataStatusWarning');
                if (warningDiv) warningDiv.style.display = 'block';
            }
        }

        createButton() {
            const button = document.createElement('button');
            button.id = 'codexHelperButton';
            button.innerHTML = '图鉴<br>分析';
            button.onclick = () => this.analyzeAndShowReport();
            document.body.appendChild(button);
        }

        addStyles() {
            const css = `
                #codexHelperButton{position:fixed;top:10px;right:10px;z-index:9998;background:linear-gradient(135deg,#f7a325,#d27907);color:white;border:none;border-radius:8px;padding:6px 10px;font-size:13px;font-weight:bold;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.3);line-height:1.2;}
                #codexHelperButton:hover{transform:translateY(-1px);box-shadow:0 6px 12px rgba(0,0,0,0.35);}
                #codexHelperModal{position:fixed;z-index:10000;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;}
                #codexHelperModal .modal-content{background:#fff7e6;color:#5a3300;padding:0;border-radius:16px;border:2px solid #f7a325;box-shadow:0 10px 30px rgba(0,0,0,0.3);width:90%;max-width:750px;max-height:85vh;position:relative;font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:16px;display:flex;flex-direction:column;}
                #codexHelperModal .modal-close{position:absolute;top:10px;right:20px;font-size:30px;font-weight:bold;color:#d27907;cursor:pointer;z-index:10;}
                #codexHelperModal h2{color:#d27907;text-align:center;margin:0;padding:20px 30px 25px;border-bottom:1px solid rgba(210,121,7,0.2);}
                #codexHelperModal .modal-body{padding:0px 30px 20px 30px;overflow-y:auto;flex:1;}
                #codexHelperModal h3{color:#d27907;text-align:left;margin-top:0;margin-bottom:15px;font-size:1.25em;border-bottom:1px solid rgba(210,121,7,0.3);padding-bottom:8px;}
                #codexHelperModal .report-section { margin-bottom: 15px; }
                #codexHelperModal .rarity-title{margin:0 0 4px 0;padding:4px 10px;border-radius:6px;display:inline-block;color:white;font-size:1em;}
                #codexHelperModal .rarity-传说{background-color:#d79000;}#codexHelperModal .rarity-史诗{background-color:#7b3fa1;}#codexHelperModal .rarity-稀有{background-color:#4169e1;}#codexHelperModal .rarity-不常见{background-color:#3c9d9b;}#codexHelperModal .rarity-普通{background-color:#5e807f;}
                #codexHelperModal .code-badge-container{display:flex;flex-wrap:wrap;gap:6px 8px;margin-top:4px;padding-left:5px;line-height:1.3;}
                #codexHelperModal .code-badge{background-color:rgba(210,121,7,0.1);color:#c77400;padding:3px 8px;border-radius:5px;font-size:0.9em;font-weight:500;white-space:nowrap;border:1px solid rgba(210,121,7,0.2);}
                #codexHelperModal .surplus-badge{background-color:rgba(40,167,69,0.08);color:#28a745;border:1px solid rgba(40,167,69,0.3);}
                #codexHelperModal .known-missing-badge{background-color:rgba(220,53,69,0.08);color:#dc3545;border:1px solid rgba(220,53,69,0.3);}
                #dataStatusWarning { background-color: #ffebeb; color: #dc3545; border: 1px solid #dc3545; padding: 10px 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9em; font-weight: bold; line-height: 1.5; }
                .helper-btn-sm { background: #d27907; color: white; border: none; border-radius: 4px; padding: 3px 8px; font-size: 0.9em; cursor: pointer; margin: 0 4px; }
                .helper-btn-sm:hover { background: #f7a325; }
                .friend-compare { padding-bottom: 15px; margin-bottom: 25px; }
                .friend-compare .gift-inputs { display: flex; gap: 10px; margin-bottom: 10px; }
                .friend-compare input[type="text"] { flex: 1; padding: 6px 10px; border: 1px solid #d27907; border-radius: 4px; background-color: #fff; color: #5a3300; font-size: 0.9em; min-width: 0; }
                .friend-compare input[type="text"]#friendFishInput { flex-grow: 2; }
                .friend-compare input[type="text"]:focus { outline: 2px solid #f7a325; box-shadow: 0 0 5px rgba(247, 163, 37, 0.5); }
                .friend-compare button { padding: 6px 12px; border: none; border-radius: 4px; background: #d27907; color: #fff; cursor: pointer; font-weight: bold; font-size: 0.9em; opacity: 0.9; transition: opacity 0.2s ease; }
                .friend-compare button:hover { opacity: 1; }
                .friend-compare .btn-secondary { background: #5e807f; }
                .friend-compare .btn-secondary:hover { background: #4a6665; }
                .friend-compare #giftResult { margin-top: 10px; color: #5a3300; font-size: 0.95em; }
                .friend-compare .gift-error { color: #dc3545; font-weight: bold; }
                .trade-match-box { background-color: #f0faff; border: 1px solid #81d4fa; color: #01579b; padding: 10px; border-radius: 6px; margin-bottom: 10px; font-size: 0.95em; }
                .lickdog-mode-container { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 8px 12px; background: rgba(210, 121, 7, 0.08); border: 1px solid rgba(210, 121, 7, 0.3); border-radius: 6px; transition: background-color 0.3s ease; }
                .lickdog-mode-container.active { background: rgba(210, 121, 7, 0.18); border-color: #f7a325; }
                .lickdog-label { font-size: 0.95em; font-weight: 600; color: #5a3300; }
                .lickdog-switch { position: relative; display: inline-block; width: 46px; height: 22px; }
                .lickdog-switch input { opacity: 0; width: 0; height: 0; }
                .lickdog-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.3s; border-radius: 22px; }
                .lickdog-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
                .lickdog-switch input:checked + .lickdog-slider { background-color: #f7a325; }
                .lickdog-switch input:checked + .lickdog-slider:before { transform: translateX(24px); }
                .gift-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; margin-bottom: 5px; border-radius: 5px; border: 1px solid transparent; background: transparent; transition: background-color 0.2s ease, border-color 0.2s ease; }
                .gift-item:hover { background-color: rgba(210, 121, 7, 0.05); border-color: rgba(210, 121, 7, 0.2); }
                .gift-item label { flex: 1; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #5a3300; font-weight: 500; }
                .gift-item input[type="checkbox"] { margin: 0; }
                .gift-item input[type="number"] { width: 50px; padding: 3px 5px; border: 1px solid #d27907; border-radius: 4px; text-align: center; font-size: 0.9em; background: #fff; }
                .rarity-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: middle; flex-shrink: 0; }
                .rarity-dot.rarity-传说 { background-color: #d79000; } .rarity-dot.rarity-史诗 { background-color: #7b3fa1; } .rarity-dot.rarity-稀有 { background-color: #4169e1; } .rarity-dot.rarity-不常见 { background-color: #3c9d9b; } .rarity-dot.rarity-普通 { background-color: #5e807f; }
                .gift-btn-batch { background-color: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; font-size: 1em; font-weight: bold; cursor: pointer; text-align: center; transition: background-color 0.2s ease; width: 100%; margin-top: 10px; }
                .gift-btn-batch:hover { background-color: #218838; } .gift-btn-batch:disabled { background-color: #999; cursor: not-allowed; }
                #giftProgress { display: none; margin-top: 15px; padding: 10px; border-radius: 5px; background-color: rgba(0,0,0,0.03); border: 1px solid rgba(210,121,7,0.2); font-size: 0.9em; line-height: 1.6; }
                #giftProgress h3 { margin: 0 0 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(210,121,7,0.2); font-size: 1.1em;}
                .progress-success { color: #155724; } .progress-fail { color: #dc3545; font-weight: bold; }
                .copy-tier-btn { background: none; border: none; font-size: 16px; cursor: pointer; margin-left: 6px; transition: transform 0.2s; }
                .copy-tier-btn:hover { transform: scale(1.2); }
                .rarity-section { margin-bottom: 15px; border-bottom: 1px solid rgba(210,121,7,0.15); padding-bottom: 15px; } .rarity-section:last-child { border-bottom: none; padding-bottom: 5px; }
                .rarity-summary-inline { font-size: 0.9em; font-weight: 500; color: #ffffff; opacity: 0.85; margin-left: 5px; } .rarity-summary-inline.complete { color: #cfffdc; opacity: 1; font-weight: 600; }
                .slot-list { list-style-type: none; padding-left: 10px; margin-top: 10px; } .slot-item { margin-bottom: 10px; } .slot-item > strong { display: block; margin-bottom: 4px; color: #d27907; }
                .slot-summary-inline { font-size: 0.9em; font-weight: 500; color: #5a3300; opacity: 0.9; margin-left: 5px; }
                .slot-priority-summary { background: #fdfaf2; padding: 10px 12px; border-radius: 6px; margin-bottom: 15px; border: 1px solid rgba(210,121,7,0.2); }
                .slot-priority-summary > strong { display: block; margin-bottom: 8px; color: #5a3300; font-size: 0.95em; }
                .priority-badge-container { display: flex; flex-wrap: wrap; gap: 6px; }
                .priority-badge { color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; white-space: nowrap; }
                .priority-badge.priority-high { background-color: #dc3545; } .priority-badge.priority-medium { background-color: #d27907; } .priority-badge.priority-low { background-color: #5a3300; opacity: 0.8; }
                .current-timeslot-highlight { border: 2px solid #f7a325 !important; background: #ffffff !important; border-radius: 6px !important; padding: 10px 12px !important; margin: 0 0 12px 3px !important; box-shadow: 0 2px 8px rgba(210,121,7,0.2); }
                .current-slot-marker { font-weight: bold; color: #d27907; font-size: 0.9em; margin-left: 4px; }
            `;
            const styleNode = document.createElement('style');
            styleNode.innerHTML = css;
            document.head.appendChild(styleNode);
        }
    }

    // ======================================================================================
    // MODULE 2: 概率数据分析
    // ======================================================================================
    class ProbabilityManager {
        constructor() {
            this.tableContainer = null;
            this.comboContainer = null;
            this.observer = null;

            const savedRodState = localStorage.getItem('FISHING_ROD_TABLE_COLLAPSED');
            const savedLureState = localStorage.getItem('FISHING_LURE_TABLE_COLLAPSED');
            this.isRodCollapsed = savedRodState === null ? true : (savedRodState === 'true');
            this.isLureCollapsed = savedLureState === null ? true : (savedLureState === 'true');

            this.injectStyles();
            this.hookNetwork();
            this.initUI();
            this.startDOMObserver();
        }

        toggleSection(type) {
            if (type === 'rod') {
                this.isRodCollapsed = !this.isRodCollapsed;
                localStorage.setItem('FISHING_ROD_TABLE_COLLAPSED', this.isRodCollapsed);
            } else if (type === 'lure') {
                this.isLureCollapsed = !this.isLureCollapsed;
                localStorage.setItem('FISHING_LURE_TABLE_COLLAPSED', this.isLureCollapsed);
            }
            this.renderTablePanel();
        }

        hookNetwork() {
            const originalFetch = window.fetch;
            const self = this;
            window.fetch = async function (...args) {
                const response = await originalFetch(...args);
                const clone = response.clone();
                clone.json().then(res => {
                    if (res && res.success && res.data) {
                        // Update Shared Global State
                        GlobalState.fishingData = res.data;
                        if (typeof g_FishingData !== 'undefined') g_FishingData = res.data;

                        // Update UI
                        self.renderAll();
                    }
                }).catch(() => {});
                return response;
            };
        }

        startDOMObserver() {
            const targetNode = document.querySelector('.fishing-left');
            if (!targetNode) return;
            this.observer = new MutationObserver((mutations) => {
                if (!targetNode.contains(this.comboContainer)) {
                    this.initUI();
                }
            });
            this.observer.observe(targetNode, { childList: true, subtree: true });
        }

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .prob-section { background: var(--bg-card); border-radius: 16px; margin-bottom: 24px; padding: 12px 14px; box-shadow: 0 10px 24px rgba(168, 86, 0, 0.12); border: 1px solid rgba(247, 163, 37, 0.25); }
                .prob-header { cursor:pointer; user-select:none; display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; }
                .prob-header h2 { margin: 0; font-size: 16px; color: var(--primary-dark); display:flex; align-items:center; gap:6px; }
                .prob-table-wrapper { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(247, 163, 37, 0.25); }
                .prob-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; white-space:nowrap; background: rgba(255, 253, 247, 0.9); }
                .prob-table thead { background: rgba(247, 163, 37, 0.22); color: var(--text-secondary); }
                .prob-table th, .prob-table td { padding: 10px 12px; border-bottom: 1px solid rgba(247, 163, 37, 0.15); }
                .prob-table tr:hover { background: rgba(255, 240, 208, 0.55); }
                .item-cell { display:flex; align-items:center; gap:8px; justify-content: flex-start; color: var(--text-main); font-weight: 500;}
                .item-icon { width: 20px; height: 20px; object-fit:contain; }
                .stat-wrapper { display: flex; flex-direction: column; align-items: center; line-height: 1.2; }
                .stat-percent { font-family: "Segoe UI", sans-serif; font-weight: bold; }
                .stat-boost { font-size: 11px; margin-top: 1px; }
                .c-up { color: #28a745; } .c-down { color: #dc3545; }
                .stat-card { background: linear-gradient(180deg, rgba(255, 251, 242, 0.92), rgb(255, 249, 241)); border: 1px solid rgba(247, 163, 37, 0.22); border-radius: 14px; padding: 16px; margin-top: 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 12px rgba(168, 86, 0, 0.05); }
                .stat-card-title { display:flex; justify-content:space-between; align-items:center; }
                .stat-card-title h3 { margin:0; font-size:14px; color: var(--text-main); }
                .combo-row { display:flex; align-items:center; margin-bottom:8px; font-size:13px; }
                .combo-bar-bg { height: 6px; background: rgba(247, 163, 37, 0.15); border-radius: 3px; overflow: hidden; flex-grow: 1; margin: 0 8px; }
                .combo-bar-fill { height: 100%; transition: width 0.3s ease; }
                .toggle-arrow { transition: transform 0.3s; font-size:12px; color:var(--text-secondary); }
                .collapsed .toggle-arrow { transform: rotate(-90deg); }
                .collapsed + .prob-content { display: none; }
            `;
            document.head.appendChild(style);
        }

        getPercentageStats(itemEffect, baseRarities) {
            let totalWeight = 0;
            const order = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
            const finalWeights = {};
            order.forEach(key => {
                const base = baseRarities[key].base_prob;
                const mod = itemEffect[key] || 0;
                const final = Math.max(0, base + mod);
                finalWeights[key] = final;
                totalWeight += final;
            });
            const percentages = {};
            order.forEach(key => {
                percentages[key] = totalWeight > 0 ? (finalWeights[key] / totalWeight) * 100 : 0;
            });
            return percentages;
        }

        renderAll() {
            if (!document.contains(this.tableContainer) || !document.contains(this.comboContainer)) {
                 this.initUI();
                 return;
            }
            this.renderTablePanel();
            this.renderCurrentComboPanel();
        }

        renderTablePanel() {
            if (!this.tableContainer || !GlobalState.fishingData) return;
            const data = GlobalState.fishingData;
            const rarities = data.config.rarities;
            const rods = data.config.rods;
            const lures = data.config.lures;
            const baseStats = this.getPercentageStats({}, rarities);

            const generateRows = (items) => {
                return Object.values(items).map(item => {
                    const itemStats = this.getPercentageStats(item.effect || {}, rarities);
                    const iconDisplay = item.key === 'normal' ? `<span style="font-size:18px">${item.icon}</span>` : `<img src="${item.icon}" class="item-icon">`;
                    let cells = '';
                    ['common', 'uncommon', 'rare', 'epic', 'legendary'].forEach(key => {
                        const p = itemStats[key];
                        const baseP = baseStats[key];
                        const diff = p - baseP;
                        let diffHtml = '';
                        if (diff > 0.01) diffHtml = `<span class="stat-boost c-up">+${diff.toFixed(1)}%</span>`;
                        else if (diff < -0.01) diffHtml = `<span class="stat-boost c-down">${diff.toFixed(1)}%</span>`;
                        cells += `<td><div class="stat-wrapper"><span class="stat-percent" style="color:${rarities[key].color}">${p.toFixed(1)}%</span>${diffHtml}</div></td>`;
                    });
                    return `<tr><td class="text-left"><div class="item-cell">${iconDisplay} <span>${item.name}</span></div></td>${cells}</tr>`;
                }).join('');
            };

            const headerCols = ['普通', '不常见', '稀有', '史诗', '传说'].map(label => `<th>${label}</th>`).join('');
            const rodClass = this.isRodCollapsed ? 'collapsed' : '';
            const lureClass = this.isLureCollapsed ? 'collapsed' : '';

            this.tableContainer.innerHTML = `
                <div class="prob-section">
                    <div class="prob-header ${rodClass}" id="rodTableToggle">
                        <h2>🎣 鱼竿概率表</h2><span class="toggle-arrow">▼</span>
                    </div>
                    <div class="prob-content">
                        <div class="prob-table-wrapper">
                            <table class="prob-table">
                                <thead><tr><th class="text-left" style="min-width:100px;">名称</th>${headerCols}</tr></thead>
                                <tbody>${generateRows(rods)}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="prob-section">
                    <div class="prob-header ${lureClass}" id="lureTableToggle">
                        <h2>🐛 鱼饵概率表</h2><span class="toggle-arrow">▼</span>
                    </div>
                    <div class="prob-content">
                        <div class="prob-table-wrapper">
                            <table class="prob-table">
                                <thead><tr><th class="text-left" style="min-width:100px;">名称</th>${headerCols}</tr></thead>
                                <tbody>${generateRows(lures)}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            this.tableContainer.querySelector('#rodTableToggle').onclick = () => this.toggleSection('rod');
            this.tableContainer.querySelector('#lureTableToggle').onclick = () => this.toggleSection('lure');
        }

        renderCurrentComboPanel() {
            if (!this.comboContainer || !GlobalState.fishingData) return;
            const data = GlobalState.fishingData;
            const rarities = data.config.rarities;
            const currentRodKey = data.state.selected_rod;
            const currentLureKey = data.state.selected_lure;
            const rod = data.config.rods[currentRodKey];
            const lure = data.config.lures[currentLureKey];

            const combinedEffect = {};
            ['common', 'uncommon', 'rare', 'epic', 'legendary'].forEach(key => {
                const rMod = (rod.effect && rod.effect[key]) || 0;
                const lMod = (lure.effect && lure.effect[key]) || 0;
                combinedEffect[key] = rMod + lMod;
            });
            const finalStats = this.getPercentageStats(combinedEffect, rarities);

            const rowsHtml = ['common', 'uncommon', 'rare', 'epic', 'legendary'].map(key => {
                const r = rarities[key];
                const p = finalStats[key];
                if (p < 0.1) return '';
                return `
                    <div class="combo-row">
                        <span style="width:8px;height:8px;border-radius:50%;background:${r.color};margin-right:4px;"></span>
                        <span style="font-size:12px;color:var(--text-main);width:42px;">${r.label}</span>
                        <div class="combo-bar-bg"><div class="combo-bar-fill" style="width:${p}%; background:${r.color};"></div></div>
                        <span style="font-weight:bold;color:${r.color};min-width:40px;text-align:right;">${p.toFixed(1)}%</span>
                    </div>
                `;
            }).join('');

            this.comboContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-card-title"><h3>📊 当前最终概率</h3></div>
                    <div>${rowsHtml}</div>
                </div>
            `;
        }

        initUI() {
            if (this.tableContainer) this.tableContainer.remove();
            if (this.comboContainer) this.comboContainer.remove();

            this.tableContainer = document.createElement('div');
            const headerSection = document.querySelector('.header-section');
            if (headerSection && headerSection.parentNode) {
                headerSection.parentNode.insertBefore(this.tableContainer, headerSection.nextSibling);
            }

            this.comboContainer = document.createElement('div');
            const leftCol = document.querySelector('.fishing-left');
            if (leftCol) {
                const comboStack = leftCol.querySelector('.combo-stack');
                if (comboStack) {
                    leftCol.insertBefore(this.comboContainer, comboStack.nextSibling);
                } else {
                    leftCol.appendChild(this.comboContainer);
                }
            }
            this.renderTablePanel();
            this.renderCurrentComboPanel();
        }
    }

    // ======================================================================================
    // MAIN ENTRY POINT
    // ======================================================================================
    class MainController {
        static run() {
            const regex = /const\s+FISHING_DATA\s*=\s*(\{.*?\});/s;
            const pageHtml = document.documentElement.innerHTML;
            if (!pageHtml || pageHtml.length < 100) return;

            const match = pageHtml.match(regex);
            if (!match || !match[1]) {
                Logger.error('未找到 FISHING_DATA');
                return;
            }

            try {
                GlobalState.fishingData = JSON.parse(match[1]);
                if (typeof g_FishingData === 'undefined') {
                    window.g_FishingData = GlobalState.fishingData;
                }
                new CodexHelper();
                new ProbabilityManager();

            } catch (e) {
                Logger.error('初始化失败', e);
            }
        }
    }

    MainController.run();

})();