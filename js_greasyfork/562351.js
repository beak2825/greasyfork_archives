// ==UserScript==
// @name         Dio Enhancer
// @version      127.0.0.41
// @namespace    http://tampermonkey.net/
// @description  测试服添加队列强化+20
// @author       DelayNoMore
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562351/Dio%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/562351/Dio%20Enhancer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const CONFIG = {
        MAX_LEVEL: 20,
        SAFE_LIMIT: 5000,
        FIXED_MIN_LEVEL: 2,
        DEFAULT_PROT: "mirror_of_protection",
        MOO_SECONDARY: "philosophers_mirror",
        DIO_DELAY: { MIN: 1500, MAX: 1800 },
        MOO_DELAY: 6000,
        SELECTORS: {
            ENHANCE_BTN: 'button[class*="Button_success"][class*="Button_fullWidth"]',
            ITEM_CONTAINER: '.SkillActionDetail_primaryItemSelectorContainer__nrvNW',
            CUSTOM_PANEL_CLASS: 'dnm-enhancer-panel'
        },
        FIB_TABLE: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040]
    };

    const State = {
        ws: null,
        characterId: new URLSearchParams(window.location.search).get('characterId'),
        storageKey: 'dnm_enhancer_loadouts',
        settingsKey: 'dnm_enhancer_settings',
        isProcessing: false,
        stopRequested: false,
        isHardcore: false,
        useMirror: false,

        init: function() {
            const savedSettings = JSON.parse(localStorage.getItem(this.settingsKey) || "{}");
            this.isHardcore = !!savedSettings.isHardcore;
            this.useMirror = !!savedSettings.useMirror;
        },

        saveSettings: function() {
            localStorage.setItem(this.settingsKey, JSON.stringify({
                isHardcore: this.isHardcore,
                useMirror: this.useMirror
            }));
        },

        getSavedLoadoutId: function() {
            const cache = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
            return cache[this.characterId] || null;
        },
        saveLoadoutId: function(id) {
            const cache = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
            cache[this.characterId] = id;
            localStorage.setItem(this.storageKey, JSON.stringify(cache));
        }
    };

    const Utils = {
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        sleepRandom: (min, max) => Utils.sleep(Math.floor(Math.random() * (max - min + 1)) + min),
        getFib: (n) => (n < 0 ? 0 : (n < CONFIG.FIB_TABLE.length ? CONFIG.FIB_TABLE[n] : 0)),
        getCurrentItemHrid: () => {
            const container = document.querySelector(CONFIG.SELECTORS.ITEM_CONTAINER);
            const useEl = container?.querySelector('use');
            return useEl ? useEl.getAttribute('href').split('#')[1] : null;
        },
        getProtectionName: (itemHrid) => {
            if (State.useMirror) {
                return CONFIG.DEFAULT_PROT;
            }
            return DATA_MAPPING[itemHrid] || CONFIG.DEFAULT_PROT;
        },
        formatTime: (seconds) => {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        },
        el: (tag, className, props = {}, children = []) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            for (const key in props) {
                if (key === 'dataset') {
                    for (const dataKey in props[key]) element.dataset[dataKey] = props[key][dataKey];
                } else {
                    element[key] = props[key];
                }
            }
            children.forEach(child => element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
            return element;
        },
        log: (msg, type = 'info', data = null) => {
            const styles = {
                info: 'color: #0ea5e9; font-weight: bold;',
                success: 'color: #22c55e; font-weight: bold;',
                step: 'color: #eab308; font-weight: bold;',
                error: 'color: #ef4444; font-weight: bold;'
            };
            if (data) console.log(`%c[Dio] ${msg}`, styles[type], data);
            else console.log(`%c[Dio] ${msg}`, styles[type]);
        }
    };

    const Inventory = {
        getGameRootStateNode: () => {
            const sel = document.querySelector('[class^="GamePage"]');
            if (!sel) return null;
            const key = Object.keys(sel).find(k => k.startsWith('__reactFiber$'));
            return sel[key]?.return?.stateNode;
        },
        getItemCounts: (targetHrid) => {
            const root = Inventory.getGameRootStateNode();
            if (!root) return null;
            let state = root.state || root?.return?.stateNode?.state || root?.props?.state || root;
            let charMap = state?.characterItemMap || root.props?.state?.characterItemMap;
            if (!charMap) return null;
            const counts = {};
            const processItem = (item) => {
                if (!item) return;
                let data = item;
                if (Array.isArray(item) && item.length >= 2) data = item[1];
                if (data.itemHrid && data.itemHrid.endsWith(`/${targetHrid}`)) {
                    const lvl = data.enhancementLevel || 0;
                    const num = Number(data.count || 0);
                    if (num > 0) counts[lvl] = (counts[lvl] || 0) + num;
                }
            };
            if (charMap instanceof Map) charMap.forEach(v => processItem(v));
            else if (Array.isArray(charMap)) charMap.forEach(v => processItem(v));
            else if (typeof charMap === 'object') Object.values(charMap).forEach(v => processItem(v));
            return counts;
        }
    };

    const Network = {
        hook: () => {
            const origSend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(data) {
                try {
                    const msg = JSON.parse(data);
                    if (msg.type === "new_character_action" && msg.newCharacterActionData.actionHrid === "/actions/enhancing/enhance") {
                        const lId = msg.newCharacterActionData.characterLoadoutId;
                        if (lId) {
                            State.saveLoadoutId(lId);
                            const indicator = document.querySelector('.dnm-id-badge');
                            if (indicator) indicator.textContent = `配装ID: ${lId}`;
                        }
                    }
                } catch (e) {}
                return origSend.apply(this, arguments);
            };
            const origDataGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data').get;
            Object.defineProperty(MessageEvent.prototype, 'data', {
                get: function() {
                    const socket = this.currentTarget;
                    if (socket instanceof WebSocket && socket.url.includes('/ws') && socket.readyState === 1) {
                        State.ws = socket;
                        window.gameWS = socket;
                    }
                    return origDataGet.call(this);
                }, configurable: true
            });
        },
        createDioPayload: (itemHrid, level) => {
            const protName = Utils.getProtectionName(itemHrid);
            const savedId = State.getSavedLoadoutId();
            return {
                type: "new_character_action",
                newCharacterActionData: {
                    actionHrid: "/actions/enhancing/enhance",
                    primaryItemHash: `${State.characterId}::/item_locations/inventory::/items/${itemHrid}::0`,
                    secondaryItemHash: `${State.characterId}::/item_locations/inventory::/items/${protName}::0`,
                    enhancingMaxLevel: level,
                    enhancingProtectionMinLevel: CONFIG.FIXED_MIN_LEVEL,
                    characterLoadoutId: savedId || 0,
                    shouldClearQueue: false,
                    hasMaxCount: false, maxCount: 0
                }
            };
        },
        createMooPayload: (itemHrid, targetLevel) => {
            const savedId = State.getSavedLoadoutId();
            const currentLevel = targetLevel - 1;
            return {
                type: "new_character_action",
                newCharacterActionData: {
                    actionHrid: "/actions/enhancing/enhance",
                    primaryItemHash: `${State.characterId}::/item_locations/inventory::/items/${itemHrid}::${currentLevel}`,
                    secondaryItemHash: `${State.characterId}::/item_locations/inventory::/items/${CONFIG.MOO_SECONDARY}::0`,
                    enhancingMaxLevel: targetLevel,
                    enhancingProtectionMinLevel: CONFIG.FIXED_MIN_LEVEL,
                    characterLoadoutId: savedId || 0,
                    shouldClearQueue: false,
                    hasMaxCount: false,
                    maxCount: 0
                }
            };
        },
        sendDioAction: async (itemHrid, level) => {
            if (!State.ws) throw new Error("WebSocket 未连接");
            const payload = Network.createDioPayload(itemHrid, level);
            State.ws.send(JSON.stringify(payload));
            await Utils.sleepRandom(CONFIG.DIO_DELAY.MIN, CONFIG.DIO_DELAY.MAX);
        },
        sendMooAction: async (itemHrid, targetLevel) => {
            if (!State.ws) throw new Error("WebSocket 未连接");
            const payload = Network.createMooPayload(itemHrid, targetLevel);
            State.ws.send(JSON.stringify(payload));
            await Utils.sleep(CONFIG.MOO_DELAY);
        }
    };

    const Core = {
        Planner: {
            calcHardcoreNeeds: (inventoryInput) => {
                let simInventory = { ...inventoryInput };
                let dioNeeds = { 10: 0, 11: 0 };
                let mooSteps = [];
                const resolveNeed = (level) => {
                    if (level <= 11) {
                        if (simInventory[level] && simInventory[level] > 0) { simInventory[level]--; }
                        else { dioNeeds[level] = (dioNeeds[level] || 0) + 1; }
                        return;
                    }
                    if (simInventory[level] && simInventory[level] > 0) { simInventory[level]--; return; }
                    resolveNeed(level - 1); resolveNeed(level - 2);
                    mooSteps.push({ target: level });
                };
                resolveNeed(20);
                return { dioNeeds, mooSteps, leftovers: simInventory };
            },
            getDioPlan: (input) => {
                let tasks = [];
                let msg = "";
                const protItem = State.useMirror ? "保护之镜" : "自动匹配";

                if (State.isHardcore) {
                    const plan = Core.Planner.calcHardcoreNeeds(input);
                    const c10 = plan.dioNeeds[10] || 0, c11 = plan.dioNeeds[11] || 0;
                    for (let i=0; i<c11; i++) tasks.push(11);
                    for (let i=0; i<c10; i++) tasks.push(10);
                    if (tasks.length === 0) return null;
                    msg = `Hardcore Dio 确认：<br>保护策略：<b>${protItem}</b><br>+11: <b>${c11}</b> 个<br>+10: <b>${c10}</b> 个<br>总计 <b>${tasks.length}</b> 个队列`;
                } else {
                    const baseLevel = input;
                    const cHigh = Utils.getFib(CONFIG.MAX_LEVEL - baseLevel);
                    const cLow = Utils.getFib(CONFIG.MAX_LEVEL - baseLevel - 1);
                    for (let i=0; i<cHigh; i++) tasks.push(baseLevel + 1);
                    for (let i=0; i<cLow; i++) tasks.push(baseLevel);
                    if (tasks.length > CONFIG.SAFE_LIMIT) throw new Error("超过安全上限");
                    msg = `Traditional Dio 确认：<br>保护策略：<b>${protItem}</b><br>共 <b>${tasks.length}</b> 个队列`;
                }
                return { tasks, confirmMsg: msg, isMoo: false, avgDelay: 1.65 };
            },
            getMooPlan: (input) => {
                let tasks = [];
                let msg = "";
                if (State.isHardcore) {
                    const plan = Core.Planner.calcHardcoreNeeds(input);
                    let need10 = plan.dioNeeds[10] || 0;
                    let need11 = plan.dioNeeds[11] || 0;
                    let conversionMsg = "";
                    let canProceed = false;
                    if (need10 === 0 && need11 === 0) canProceed = true;
                    else if (need11 > 0) canProceed = false;
                    else if (need10 > 0) {
                        const surplus11 = plan.leftovers[11] || 0;
                        if (surplus11 >= need10) {
                            canProceed = true;
                            conversionMsg = `<br><span style='color:#22c55e'>✅ 智能策略：检测到 +10 不足，但 +11 溢出。利用溢出抵扣，允许执行。</span><br>`;
                        } else canProceed = false;
                    }
                    if (!canProceed) throw new Error(`基底不足！请先执行 Dio 补充：\n+10: ${need10}个, +11: ${need11}个`);
                    if (plan.mooSteps.length === 0) return null;
                    tasks = plan.mooSteps.sort((a, b) => a.target - b.target).map(s => s.target);
                    const counts = {};
                    tasks.forEach(t => { counts[t] = (counts[t] || 0) + 1 });
                    let details = Object.keys(counts).sort((a,b)=>a-b).map((l, i) => `${i+1}、+${l} 队列 x${counts[l]}`).join('<br>');
                    msg = `Hardcore Moo 确认：<br>共 <b>${tasks.length}</b> 步合成。${conversionMsg}<br><div style='max-height:150px;overflow-y:auto;font-size:12px;background:#0f172a;padding:5px;border-radius:4px'>${details}</div>`;
                } else {
                    const startLevel = input;
                    const firstTarget = startLevel + 2;
                    let total = 0;
                    for (let t = firstTarget; t <= CONFIG.MAX_LEVEL; t++) {
                        const c = Utils.getFib(CONFIG.MAX_LEVEL - t + 1);
                        total += c;
                        for(let k=0; k<c; k++) tasks.push(t);
                    }
                    if (total > CONFIG.SAFE_LIMIT) throw new Error("超过安全上限");
                    msg = `Traditional Moo 确认：共 <b>${total}</b> 个队列`;
                }
                const estTime = Utils.formatTime(tasks.length * (CONFIG.MOO_DELAY / 1000));
                return { tasks, confirmMsg: `${msg}<br>预计耗时 <b>${estTime}</b>`, isMoo: true, avgDelay: CONFIG.MOO_DELAY / 1000 };
            }
        },

        Executor: {
            run: async (itemHrid, plan, updateUI) => {
                if (!plan) return UI.showToast("✅ 简直完美！无需任何操作。", 'success');

                const confirmed = await UI.showConfirm(plan.confirmMsg);
                if (!confirmed) return;

                State.isProcessing = true;
                State.stopRequested = false;
                let processed = 0;
                const total = plan.tasks.length;

                console.group(`🚀 Dio Enhancer Task [${new Date().toLocaleTimeString()}]`);
                Utils.log(`Mode: ${plan.isMoo ? 'Moo' : 'Dio'} | Total Steps: ${total}`);

                try {
                    for (const target of plan.tasks) {
                        if (State.stopRequested) break;
                        processed++;
                        const remaining = total - processed;

                        const actionName = plan.isMoo ? `Moo: 合成至 +${target}` : `Dio: 添加 +${target}`;
                        const eta = Utils.formatTime(remaining * plan.avgDelay);
                        updateUI(actionName, Math.floor((processed / total) * 100), eta);

                        Utils.log(`[Step ${processed}/${total}] ${actionName}`, 'step');

                        if (plan.isMoo) await Network.sendMooAction(itemHrid, target);
                        else await Network.sendDioAction(itemHrid, target);
                    }

                    if (State.stopRequested) {
                        Utils.log('User stopped the process.', 'error');
                        UI.showToast(`⛔ 已手动停止！完成 ${processed}/${total}`, 'error');
                    } else {
                        Utils.log('All tasks completed successfully.', 'success');
                        UI.showToast(`✅ 任务完成！共处理 ${total} 个队列。`, 'success');
                    }

                } catch (e) {
                    Utils.log(`Error: ${e.message}`, 'error');
                    UI.showToast(`❌ 错误: ${e.message}`, 'error');
                } finally {
                    console.groupEnd();
                    State.isProcessing = false;
                }
            }
        }
    };

    const UI = {
        init: () => {
            State.init(); // 加载设置
            UI.injectStyles();
            UI.createGlobalElements();

            const observer = new MutationObserver(() => {
                const enhanceBtn = document.querySelector(CONFIG.SELECTORS.ENHANCE_BTN);
                const panel = document.querySelector(`.${CONFIG.SELECTORS.CUSTOM_PANEL_CLASS}`);
                const isEnhanceTab = enhanceBtn && (enhanceBtn.textContent.includes('强化') || enhanceBtn.textContent.includes('Enhance'));

                if (isEnhanceTab) {
                    if (panel) {
                        panel.style.display = 'block';
                        if (enhanceBtn.parentNode.lastElementChild !== panel) enhanceBtn.parentNode.appendChild(panel);
                    } else {
                        UI.renderControls(enhanceBtn.parentNode);
                    }
                } else if (panel) {
                    panel.style.display = 'none';
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        createGlobalElements: () => {
            const toast = document.createElement('div');
            toast.id = 'dnm-toast';
            toast.className = 'dnm-toast';
            document.body.appendChild(toast);

            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'dnm-confirm-overlay';
            modalOverlay.className = 'dnm-confirm-overlay';
            modalOverlay.innerHTML = `
                <div class="dnm-confirm-box">
                    <div class="dnm-confirm-title">⚠️ 操作确认</div>
                    <div class="dnm-confirm-content" id="dnm-confirm-text"></div>
                    <div class="dnm-confirm-actions">
                        <button class="dnm-btn dnm-btn-cancel" id="dnm-btn-cancel">取消 (Cancel)</button>
                        <button class="dnm-btn dnm-btn-confirm" id="dnm-btn-confirm">确认 (Confirm)</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalOverlay);
        },

        showToast: (msg, type = 'info') => {
            const t = document.getElementById('dnm-toast');
            if(!t) return;
            t.innerText = msg;
            t.className = `dnm-toast dnm-toast-show dnm-toast-${type}`;
            if(window._dnm_toast_timer) clearTimeout(window._dnm_toast_timer);
            window._dnm_toast_timer = setTimeout(() => {
                t.classList.remove('dnm-toast-show');
            }, 3000);
        },

        showConfirm: (htmlContent) => {
            return new Promise((resolve) => {
                const overlay = document.getElementById('dnm-confirm-overlay');
                const textEl = document.getElementById('dnm-confirm-text');
                const btnOk = document.getElementById('dnm-btn-confirm');
                const btnCancel = document.getElementById('dnm-btn-cancel');

                if (!overlay) return resolve(false);

                textEl.innerHTML = htmlContent;
                overlay.style.display = 'flex';

                const close = (result) => {
                    overlay.style.display = 'none';
                    btnOk.onclick = null;
                    btnCancel.onclick = null;
                    resolve(result);
                };

                btnOk.onclick = () => close(true);
                btnCancel.onclick = () => close(false);
            });
        },

        injectStyles: () => {
            if (document.getElementById('dnm-style')) return;
            const style = document.createElement('style');
            style.id = 'dnm-style';
            style.textContent = `
                /* 面板布局：居中，固定宽度 - v41 */
                .dnm-enhancer-panel { margin: 15px auto; padding: 15px; padding-bottom: 25px; background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; border-radius: 12px; color: #e2e8f0; position: relative; width: 420px; box-sizing: border-box; clear: both; transition: all 0.3s ease; }

                /* 头部布局：分两行 */
                .dnm-header { margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
                .dnm-header-row1 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .dnm-header-row2 { display: flex; justify-content: center; gap: 15px; } /* 开关居中 */

                .dnm-title { font-weight: bold; color: #e2e8f0; font-size: 13px; }
                .dnm-id-badge { font-size: 10px; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: bold; }
                .dnm-footer { position: absolute; bottom: 5px; right: 10px; font-size: 10px; color: #475569; opacity: 0.6; }

                /* 左右两列布局 */
                .dnm-columns { display: flex; gap: 15px; }
                .dnm-col { flex: 1; min-width: 0; } /* 均分宽度 */

                /* 滑块按钮 (105px 宽度) */
                .dnm-switch-btn {
                    position: relative;
                    width: 105px;
                    height: 24px;
                    border-radius: 12px;
                    background: #334155;
                    cursor: pointer;
                    transition: 0.3s;
                    border: 1px solid #475569;
                    overflow: hidden;
                    user-select: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dnm-switch-btn::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 3px;
                    width: 18px;
                    height: 18px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
                    z-index: 2;
                }

                .dnm-switch-btn.active::after {
                    left: calc(100% - 21px);
                }

                .dnm-switch-text {
                    font-size: 11px;
                    font-weight: bold;
                    z-index: 1;
                    transition: 0.3s;
                    color: white;
                    position: relative;
                    left: 10px;
                }
                .dnm-switch-btn.active .dnm-switch-text {
                    left: -10px;
                }

                .dnm-switch-btn.mode-trad { background: #0ea5e9; border-color: #0284c7; }
                .dnm-switch-btn.mode-hard { background: #d97706; border-color: #b45309; }

                .dnm-switch-btn.prot-auto { background: #10b981; border-color: #059669; }
                .dnm-switch-btn.prot-force { background: #8b5cf6; border-color: #7c3aed; }

                .dnm-section-title { font-size: 11px; color: #fbbf24; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
                .dnm-select { width: 100%; padding: 8px; background: #0f172a; color: white; border: 1px solid #475569; border-radius: 6px; margin-bottom: 8px; cursor: pointer; font-size: 12px; }
                .dnm-btn { width: 100%; padding: 8px; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; transition: all 0.2s; font-size: 13px; }
                .dnm-btn-dio { background: linear-gradient(90deg, #3b82f6, #2563eb); }
                .dnm-btn-moo { background: linear-gradient(90deg, #d97706, #b45309); }
                .dnm-btn-scan { background: #059669; margin-bottom: 10px; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                .dnm-btn-scan:hover { background: #047857; }
                .dnm-btn-stop { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); animation: pulse 2s infinite; display: none; margin-top: 10px;}
                .dnm-btn:disabled { background: #475569; cursor: not-allowed; opacity: 0.7; }

                /* 硬核模式 Grid 修正 */
                .dnm-hardcore-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 5px; }
                .dnm-input-group { display: flex; align-items: center; justify-content: center; gap: 8px; }
                .dnm-input-label { font-size: 10px; color: #94a3b8; width: 25px; text-align: right; }
                .dnm-num-input {
                    width: 55px; /* 限制宽度: 3位数+spinner */
                    flex: none; /* 不自动拉伸 */
                    background: #0f172a;
                    border: 1px solid #475569;
                    color: #e2e8f0;
                    text-align: center;
                    border-radius: 4px;
                    padding: 2px 0;
                    font-size: 11px;
                }
                .dnm-num-input:focus { border-color: #fbbf24; outline: none; }
                /* 强制显示增减按钮 */
                .dnm-num-input::-webkit-inner-spin-button,
                .dnm-num-input::-webkit-outer-spin-button {
                    -webkit-appearance: inner-spin-button;
                    opacity: 1;
                }

                .dnm-status-bar { margin-top: 10px; display: none; }
                .dnm-status-info { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-family: monospace; }
                .dnm-timer { color: #22c55e; text-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
                .dnm-progress-bg { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; position: relative; }
                .dnm-progress-fill { height: 100%; width: 0%; background: linear-gradient(45deg, #22c55e 25%, #16a34a 25%, #16a34a 50%, #22c55e 50%, #22c55e 75%, #16a34a 75%, #16a34a); background-size: 20px 20px; transition: width 0.3s linear; animation: stripe-move 1s linear infinite; }

                .dnm-toast { position: fixed; top: 10%; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 8px; color: white; font-weight: bold; font-size: 14px; z-index: 20000; opacity: 0; pointer-events: none; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                .dnm-toast-show { opacity: 1; transform: translateX(-50%) translateY(10px); }
                .dnm-toast-success { background: #059669; border: 1px solid #047857; }
                .dnm-toast-error { background: #dc2626; border: 1px solid #b91c1c; }
                .dnm-toast-info { background: #0ea5e9; border: 1px solid #0284c7; }

                .dnm-confirm-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 21000; display: none; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
                .dnm-confirm-box { background: #0f172a; width: 400px; max-width: 90%; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.6); overflow: hidden; animation: pulse 0.2s ease-out; }
                .dnm-confirm-title { background: #1e293b; padding: 12px 16px; font-weight: bold; color: #fbbf24; border-bottom: 1px solid #334155; }
                .dnm-confirm-content { padding: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.5; }
                .dnm-confirm-actions { padding: 16px; display: flex; gap: 10px; justify-content: flex-end; background: #1e293b; border-top: 1px solid #334155; }
                .dnm-btn-confirm { background: linear-gradient(90deg, #3b82f6, #2563eb); width: auto; margin: 0; }
                .dnm-btn-cancel { background: #334155; border: 1px solid #475569; width: auto; margin: 0; }
                .dnm-btn-cancel:hover { background: #475569; }

                @keyframes stripe-move { 0% { background-position: 0 0; } 100% { background-position: 20px 0; } }
                @keyframes pulse { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `;
            document.head.appendChild(style);
        },

        renderControls: (container) => {
            const { el } = Utils;
            const savedId = State.getSavedLoadoutId();

            // 开关
            const txtMode = el('span', 'dnm-switch-text', {}, ['传统模式']);
            const switchMode = el('div', 'dnm-switch-btn', {}, [ txtMode ]);
            const txtProt = el('span', 'dnm-switch-text', {}, ['自动匹配']);
            const switchProt = el('div', 'dnm-switch-btn', {}, [ txtProt ]);

            // 头部：第一行 标题+ID，第二行 开关组
            const header = el('div', 'dnm-header', {}, [
                el('div', 'dnm-header-row1', {}, [
                    el('span', 'dnm-title', {}, ['DIO ENHANCER']),
                    el('span', 'dnm-id-badge', { textContent: savedId ? `配装ID: ${savedId}` : '配装ID: 未激活' })
                ]),
                el('div', 'dnm-header-row2', {}, [switchMode, switchProt])
            ]);

            // Dio 列
            const btnDio = el('button', 'dnm-btn dnm-btn-dio', { textContent: '开 DIO' });
            const selectDio = el('select', 'dnm-select');
            for (let i = 1; i <= 18; i++) selectDio.appendChild(el('option', '', { value: i, textContent: `+${i} & +${i+1}`, selected: i===10 }));

            const colDio = el('div', 'dnm-col', { id: 'dnm-col-dio' }, [
                el('div', 'dnm-section-title', { textContent: 'Dio (制作基底)' }),
                selectDio,
                btnDio
            ]);

            // Moo 列
            const btnMoo = el('button', 'dnm-btn dnm-btn-moo', { textContent: '开 MOO' });
            const selectMoo = el('select', 'dnm-select');
            for (let i = 1; i <= 18; i++) selectMoo.appendChild(el('option', '', { value: i, textContent: `+${i} & +${i+1} -> +20`, selected: i===10 }));

            const colMoo = el('div', 'dnm-col', { id: 'dnm-col-moo' }, [
                el('div', 'dnm-section-title', { textContent: 'Moo (合成+20)' }),
                selectMoo,
                btnMoo
            ]);

            // 硬核模式特有UI
            const grid = el('div', 'dnm-hardcore-grid');
            for (let i = 10; i <= 19; i++) {
                grid.appendChild(el('div', 'dnm-input-group', {}, [
                    el('span', 'dnm-input-label', { textContent: `+${i}` }),
                    el('input', 'dnm-num-input', { type: 'number', min: '0', value: '0', dataset: { level: i } })
                ]));
            }
            const btnScan = el('button', 'dnm-btn dnm-btn-scan', { textContent: '📥 读取背包' });
            const divHard = el('div', '', { id: 'dnm-hard-controls', style: 'display:none; margin-bottom:10px;' }, [
                el('div', 'dnm-section-title', { textContent: '现有库存' }),
                btnScan,
                grid
            ]);

            // 双列容器
            const columns = el('div', 'dnm-columns', {}, [colDio, colMoo]);

            const btnStop = el('button', 'dnm-btn dnm-btn-stop', { textContent: '⛔ STOP', disabled: true });
            const statusBar = el('div', 'dnm-status-bar', {}, [
                el('div', 'dnm-status-info', {}, [
                    el('span', '', { id: 'dnm-status-text', textContent: '...' }),
                    el('span', 'dnm-timer', { id: 'dnm-status-timer', textContent: '--:--' })
                ]),
                el('div', 'dnm-progress-bg', {}, [el('div', 'dnm-progress-fill')])
            ]);

            const footer = el('div', 'dnm-footer', { textContent: 'v127.0.0.41' });

            const panel = el('div', CONFIG.SELECTORS.CUSTOM_PANEL_CLASS, {}, [
                header, divHard, columns, statusBar, btnStop, footer
            ]);

            // 状态渲染
            const updateUIState = () => {
                txtMode.textContent = State.isHardcore ? '硬核模式' : '传统模式';
                switchMode.className = `dnm-switch-btn ${State.isHardcore ? 'active mode-hard' : 'mode-trad'}`;
                txtProt.textContent = State.useMirror ? '强制用镜' : '自动匹配';
                switchProt.className = `dnm-switch-btn ${State.useMirror ? 'active prot-force' : 'prot-auto'}`;

                divHard.style.display = State.isHardcore ? 'block' : 'none';

                // 传统模式下显示下拉框，硬核模式下隐藏
                selectDio.style.display = State.isHardcore ? 'none' : 'block';
                selectMoo.style.display = State.isHardcore ? 'none' : 'block';
            };
            updateUIState();

            switchMode.onclick = () => { State.isHardcore = !State.isHardcore; State.saveSettings(); updateUIState(); };
            switchProt.onclick = () => { State.useMirror = !State.useMirror; State.saveSettings(); updateUIState(); };

            // Scan Logic
            btnScan.onclick = () => {
                const hrid = Utils.getCurrentItemHrid();
                if(!hrid) return UI.showToast("❌ 未找到物品ID", 'error');
                const counts = Inventory.getItemCounts(hrid);
                if (!counts) return UI.showToast("⚠️ 读取失败", 'error');
                let filled = 0;
                grid.querySelectorAll('.dnm-num-input').forEach(inp => {
                    const lvl = parseInt(inp.dataset.level);
                    if (counts[lvl] !== undefined) { inp.value = counts[lvl]; filled++; } else { inp.value = 0; }
                });
                UI.showToast(`✅ 更新 ${filled} 组数据`, 'success');
            };

            const handleProcessing = async (type) => {
                if (State.isProcessing) return;
                const itemHrid = Utils.getCurrentItemHrid();
                if (!itemHrid) return UI.showToast('⚠️ 未检测到装备', 'error');

                let input;
                if (State.isHardcore) {
                    input = {};
                    grid.querySelectorAll('.dnm-num-input').forEach(inp => {
                        const val = parseInt(inp.value) || 0;
                        if (val > 0) input[parseInt(inp.dataset.level)] = val;
                    });
                } else {
                    input = parseInt(type === 'dio' ? selectDio.value : selectMoo.value);
                }

                let plan;
                try {
                    plan = type === 'dio' ? Core.Planner.getDioPlan(input) : Core.Planner.getMooPlan(input);
                } catch (e) {
                    return UI.showToast(`❌ ${e.message}`, 'error');
                }

                columns.style.display = 'none'; divHard.style.display = 'none';
                btnStop.style.display = 'block'; btnStop.disabled = false;
                statusBar.style.display = 'block';

                const pFill = statusBar.querySelector('.dnm-progress-fill');
                const sText = statusBar.querySelector('#dnm-status-text');
                const sTimer = statusBar.querySelector('#dnm-status-timer');

                await Core.Executor.run(itemHrid, plan, (text, percent, eta) => {
                    sText.textContent = text;
                    pFill.style.width = `${percent}%`;
                    if (eta) sTimer.textContent = eta;
                });

                columns.style.display = 'flex';
                if (State.isHardcore) divHard.style.display = 'block';
                btnStop.style.display = 'none';
                statusBar.style.display = 'none';
                pFill.style.width = '0%';
            };

            btnDio.onclick = () => handleProcessing('dio');
            btnMoo.onclick = () => handleProcessing('moo');

            btnStop.onclick = async () => {
                const confirmed = await UI.showConfirm('⚠️ 确定要强制停止？');
                if (confirmed) {
                    State.stopRequested = true;
                    btnStop.textContent = '停止中...';
                    btnStop.disabled = true;
                }
            };

            container.appendChild(panel);
        }
    };

    console.log('🚀 Dio Enhancer v127.0.0.41 Loaded');
    Network.hook();
    UI.init();

    const DATA_MAPPING = {
        "cotton_hat": "cotton_hat",
        "cotton_boots": "cotton_boots",
        "wooden_shield": "wooden_shield",
        "wooden_bow": "wooden_bow",
        "wooden_crossbow": "wooden_crossbow",
        "silk_hat": "silk_hat",
        "silk_boots": "silk_boots",
        "bamboo_hat": "bamboo_hat",
        "bamboo_boots": "bamboo_boots",
        "umbral_boots": "umbral_boots",
        "rainbow_pot": "rainbow_pot",
        "rainbow_sword": "rainbow_sword",
        "rainbow_boots": "rainbow_boots",
        "rainbow_needle": "rainbow_needle",
        "rough_boots": "rough_boots",
        "verdant_pot": "verdant_pot",
        "verdant_sword": "verdant_sword",
        "verdant_boots": "verdant_boots",
        "verdant_needle": "verdant_needle",
        "large_pouch": "large_pouch",
        "radiant_hat": "radiant_hat",
        "radiant_boots": "radiant_boots",
        "black_bear_shoes": "black_bear_fluff",
        "redwood_shield": "redwood_shield",
        "redwood_bow": "redwood_bow",
        "redwood_crossbow": "redwood_crossbow",
        "birch_shield": "birch_shield",
        "birch_bow": "birch_bow",
        "birch_crossbow": "birch_crossbow",
        "crimson_pot": "crimson_pot",
        "crimson_sword": "crimson_sword",
        "crimson_boots": "crimson_boots",
        "crimson_needle": "crimson_needle",
        "cotton_robe_top": "cotton_robe_top",
        "cotton_robe_bottoms": "cotton_robe_bottoms",
        "cotton_gloves": "cotton_gloves",
        "cheese_pot": "cheese_pot",
        "cheese_sword": "cheese_sword",
        "cheese_boots": "cheese_boots",
        "cheese_needle": "cheese_needle",
        "knights_aegis": "knights_ingot",
        "burble_pot": "burble_pot",
        "burble_sword": "burble_sword",
        "burble_boots": "burble_boots",
        "burble_needle": "burble_needle",
        "arcane_shield": "arcane_shield",
        "arcane_bow": "arcane_bow",
        "arcane_crossbow": "arcane_crossbow",
        "holy_pot": "holy_pot",
        "holy_sword": "holy_sword",
        "holy_boots": "holy_boots",
        "holy_needle": "holy_needle",
        "vision_shield": "magnifying_glass",
        "treant_shield": "treant_bark",
        "silk_gloves": "silk_gloves",
        "azure_pot": "azure_pot",
        "azure_sword": "azure_sword",
        "azure_boots": "azure_boots",
        "azure_needle": "azure_needle",
        "sorcerer_boots": "sorcerers_sole",
        "vampiric_bow": "vampire_fang",
        "small_pouch": "small_pouch",
        "manticore_shield": "manticore_sting",
        "celestial_pot": "butter_of_proficiency",
        "celestial_needle": "butter_of_proficiency",
        "cedar_shield": "cedar_shield",
        "cedar_bow": "cedar_bow",
        "cedar_crossbow": "cedar_crossbow",
        "linen_hat": "linen_hat",
        "linen_boots": "linen_boots",
        "beast_boots": "beast_boots",
        "ginkgo_shield": "ginkgo_shield",
        "ginkgo_bow": "ginkgo_bow",
        "ginkgo_crossbow": "ginkgo_crossbow",
        "medium_pouch": "medium_pouch",
        "bamboo_robe_top": "bamboo_robe_top",
        "bamboo_robe_bottoms": "bamboo_robe_bottoms",
        "bamboo_gloves": "bamboo_gloves",
        "purpleheart_shield": "purpleheart_shield",
        "purpleheart_bow": "purpleheart_bow",
        "purpleheart_crossbow": "purpleheart_crossbow",
        "grizzly_bear_shoes": "grizzly_bear_fluff",
        "umbral_hood": "umbral_hood",
        "umbral_bracers": "umbral_bracers",
        "umbral_chaps": "umbral_chaps",
        "umbral_tunic": "umbral_tunic",
        "centaur_boots": "centaur_hoof",
        "earrings_of_critical_strike": "earrings_of_critical_strike",
        "ring_of_critical_strike": "ring_of_critical_strike",
        "guzzling_pouch": "mirror_of_protection",
        "polar_bear_shoes": "polar_bear_fluff",
        "frost_staff": "frost_sphere",
        "icy_robe_top": "icy_cloth",
        "icy_robe_bottoms": "icy_cloth",
        "tailors_top": "thread_of_expertise",
        "tailors_bottoms": "thread_of_expertise",
        "earrings_of_gathering": "earrings_of_gathering",
        "ring_of_gathering": "ring_of_gathering",
        "rainbow_hammer": "rainbow_hammer",
        "rainbow_hatchet": "rainbow_hatchet",
        "rainbow_spatula": "rainbow_spatula",
        "rainbow_gauntlets": "rainbow_gauntlets",
        "rainbow_shears": "rainbow_shears",
        "rainbow_brush": "rainbow_brush",
        "rainbow_helmet": "rainbow_helmet",
        "rainbow_plate_legs": "rainbow_plate_legs",
        "rainbow_plate_body": "rainbow_plate_body",
        "rainbow_buckler": "rainbow_buckler",
        "rainbow_chisel": "rainbow_chisel",
        "rainbow_spear": "rainbow_spear",
        "rainbow_bulwark": "rainbow_bulwark",
        "chefs_top": "thread_of_expertise",
        "chefs_bottoms": "thread_of_expertise",
        "magnetic_gloves": "magnet",
        "rough_hood": "rough_hood",
        "rough_bracers": "rough_bracers",
        "rough_chaps": "rough_chaps",
        "rough_tunic": "rough_tunic",
        "verdant_hammer": "verdant_hammer",
        "verdant_hatchet": "verdant_hatchet",
        "verdant_spatula": "verdant_spatula",
        "verdant_gauntlets": "verdant_gauntlets",
        "verdant_shears": "verdant_shears",
        "verdant_brush": "verdant_brush",
        "verdant_helmet": "verdant_helmet",
        "verdant_plate_legs": "verdant_plate_legs",
        "verdant_plate_body": "verdant_plate_body",
        "verdant_buckler": "verdant_buckler",
        "verdant_chisel": "verdant_chisel",
        "verdant_spear": "verdant_spear",
        "verdant_bulwark": "verdant_bulwark",
        "demonic_plate_legs": "demonic_core",
        "demonic_plate_body": "demonic_core",
        "gator_vest": "gator_vest",
        "enchanted_gloves": "chrono_sphere",
        "gobo_boots": "gobo_boots",
        "crafters_top": "thread_of_expertise",
        "crafters_bottoms": "thread_of_expertise",
        "radiant_robe_top": "radiant_robe_top",
        "radiant_robe_bottoms": "radiant_robe_bottoms",
        "radiant_gloves": "radiant_gloves",
        "turtle_shell_legs": "turtle_shell",
        "turtle_shell_body": "turtle_shell",
        "marine_tunic": "marine_scale",
        "marine_chaps": "marine_scale",
        "earrings_of_armor": "earrings_of_armor",
        "ring_of_armor": "ring_of_armor",
        "earrings_of_regeneration": "earrings_of_regeneration",
        "ring_of_regeneration": "ring_of_regeneration",
        "chaotic_flail": "chaotic_chain",
        "spiked_bulwark": "stalactite_shard",
        "crimson_hammer": "crimson_hammer",
        "crimson_hatchet": "crimson_hatchet",
        "crimson_spatula": "crimson_spatula",
        "crimson_gauntlets": "crimson_gauntlets",
        "crimson_shears": "crimson_shears",
        "crimson_brush": "crimson_brush",
        "crimson_helmet": "crimson_helmet",
        "crimson_plate_legs": "crimson_plate_legs",
        "crimson_plate_body": "crimson_plate_body",
        "crimson_buckler": "crimson_buckler",
        "crimson_chisel": "crimson_chisel",
        "crimson_spear": "crimson_spear",
        "crimson_bulwark": "crimson_bulwark",
        "necklace_of_wisdom": "necklace_of_wisdom",
        "shoebill_shoes": "shoebill_feather",
        "watchful_relic": "eye_of_the_watcher",
        "giant_pouch": "mirror_of_protection",
        "colossus_plate_legs": "colossus_core",
        "colossus_plate_body": "colossus_core",
        "regal_sword": "regal_jewel",
        "earrings_of_resistance": "earrings_of_resistance",
        "ring_of_resistance": "ring_of_resistance",
        "furious_spear": "regal_jewel",
        "werewolf_slasher": "werewolf_claw",
        "infernal_battlestaff": "infernal_ember",
        "flaming_robe_top": "flaming_cloth",
        "flaming_robe_bottoms": "flaming_cloth",
        "sundering_crossbow": "sundering_jewel",
        "anchorbound_plate_legs": "damaged_anchor",
        "anchorbound_plate_body": "damaged_anchor",
        "enchanted_cloak": "enchanted_cloak",
        "sighted_bracers": "sighted_bracers",
        "magicians_hat": "magicians_cloth",
        "cheese_hammer": "cheese_hammer",
        "cheese_hatchet": "cheese_hatchet",
        "cheese_spatula": "cheese_spatula",
        "cheese_gauntlets": "cheese_gauntlets",
        "cheese_shears": "cheese_shears",
        "cheese_brush": "cheese_brush",
        "cheese_helmet": "cheese_helmet",
        "cheese_plate_legs": "cheese_plate_legs",
        "cheese_plate_body": "cheese_plate_body",
        "cheese_buckler": "cheese_buckler",
        "cheese_chisel": "cheese_chisel",
        "cheese_spear": "cheese_spear",
        "cheese_bulwark": "cheese_bulwark",
        "maelstrom_plate_legs": "maelstrom_plating",
        "maelstrom_plate_body": "maelstrom_plating",
        "chimerical_quiver": "chimerical_quiver",
        "snake_fang_dirk": "snake_fang",
        "ranger_necklace": "ranger_necklace",
        "burble_hammer": "burble_hammer",
        "burble_hatchet": "burble_hatchet",
        "burble_spatula": "burble_spatula",
        "burble_gauntlets": "burble_gauntlets",
        "burble_shears": "burble_shears",
        "burble_brush": "burble_brush",
        "burble_helmet": "burble_helmet",
        "burble_plate_legs": "burble_plate_legs",
        "burble_plate_body": "burble_plate_body",
        "burble_buckler": "burble_buckler",
        "burble_chisel": "burble_chisel",
        "burble_spear": "burble_spear",
        "burble_bulwark": "burble_bulwark",
        "marksman_bracers": "marksman_brooch",
        "holy_hammer": "holy_hammer",
        "holy_hatchet": "holy_hatchet",
        "holy_spatula": "holy_spatula",
        "holy_gauntlets": "holy_gauntlets",
        "holy_shears": "holy_shears",
        "holy_brush": "holy_brush",
        "holy_helmet": "holy_helmet",
        "holy_plate_legs": "holy_plate_legs",
        "holy_plate_body": "holy_plate_body",
        "holy_buckler": "holy_buckler",
        "holy_chisel": "holy_chisel",
        "holy_spear": "holy_spear",
        "holy_bulwark": "holy_bulwark",
        "griffin_chaps": "griffin_leather",
        "griffin_tunic": "griffin_leather",
        "griffin_bulwark": "griffin_talon",
        "stalactite_spear": "stalactite_shard",
        "chrono_gloves": "chrono_sphere",
        "vision_helmet": "goggles",
        "collectors_boots": "gobo_rag",
        "silk_robe_top": "silk_robe_top",
        "silk_robe_bottoms": "silk_robe_bottoms",
        "necklace_of_speed": "necklace_of_speed",
        "gluttonous_pouch": "mirror_of_protection",
        "revenant_chaps": "revenant_anima",
        "revenant_tunic": "revenant_anima",
        "azure_hammer": "azure_hammer",
        "azure_hatchet": "azure_hatchet",
        "azure_spatula": "azure_spatula",
        "azure_gauntlets": "azure_gauntlets",
        "azure_shears": "azure_shears",
        "azure_brush": "azure_brush",
        "azure_helmet": "azure_helmet",
        "azure_plate_legs": "azure_plate_legs",
        "azure_plate_body": "azure_plate_body",
        "azure_buckler": "azure_buckler",
        "azure_chisel": "azure_chisel",
        "azure_spear": "azure_spear",
        "azure_bulwark": "azure_bulwark",
        "wizard_necklace": "wizard_necklace",
        "philosophers_earrings": "mirror_of_protection",
        "philosophers_ring": "mirror_of_protection",
        "philosophers_necklace": "mirror_of_protection",
        "necklace_of_efficiency": "necklace_of_efficiency",
        "pincer_gloves": "crab_pincer",
        "celestial_hammer": "butter_of_proficiency",
        "celestial_hatchet": "butter_of_proficiency",
        "celestial_spatula": "butter_of_proficiency",
        "celestial_shears": "butter_of_proficiency",
        "celestial_brush": "butter_of_proficiency",
        "celestial_chisel": "butter_of_proficiency",
        "panda_gloves": "panda_fluff",
        "linen_robe_top": "linen_robe_top",
        "linen_robe_bottoms": "linen_robe_bottoms",
        "linen_gloves": "linen_gloves",
        "beast_hood": "beast_hood",
        "beast_bracers": "beast_bracers",
        "beast_chaps": "beast_chaps",
        "beast_tunic": "beast_tunic",
        "sinister_cape": "sinister_cape",
        "tome_of_the_elements": "tome_of_the_elements",
        "luna_robe_top": "luna_wing",
        "luna_robe_bottoms": "luna_wing",
        "fighter_necklace": "fighter_necklace",
        "eye_watch": "eye_of_the_watcher",
        "tome_of_healing": "tome_of_healing",
        "cursed_bow": "cursed_ball",
        "bishops_codex": "bishops_scroll",
        "foragers_top": "thread_of_expertise",
        "foragers_bottoms": "thread_of_expertise",
        "rainbow_mace": "rainbow_mace",
        "rainbow_enhancer": "rainbow_enhancer",
        "rainbow_alembic": "rainbow_alembic",
        "blazing_trident": "kraken_fang",
        "verdant_mace": "verdant_mace",
        "verdant_enhancer": "verdant_enhancer",
        "verdant_alembic": "verdant_alembic",
        "dodocamel_gauntlets": "dodocamel_plume",
        "lumberjacks_top": "thread_of_expertise",
        "lumberjacks_bottoms": "thread_of_expertise",
        "gobo_shooter": "gobo_shooter",
        "gobo_hood": "gobo_hood",
        "gobo_slasher": "gobo_slasher",
        "gobo_bracers": "gobo_bracers",
        "gobo_boomstick": "gobo_boomstick",
        "gobo_chaps": "gobo_chaps",
        "gobo_tunic": "gobo_tunic",
        "gobo_stabber": "gobo_stabber",
        "red_culinary_hat": "red_panda_fluff",
        "redwood_fire_staff": "redwood_fire_staff",
        "redwood_water_staff": "redwood_water_staff",
        "granite_bludgeon": "living_granite",
        "birch_fire_staff": "birch_fire_staff",
        "birch_water_staff": "birch_water_staff",
        "dairyhands_top": "thread_of_expertise",
        "dairyhands_bottoms": "thread_of_expertise",
        "crimson_mace": "crimson_mace",
        "crimson_enhancer": "crimson_enhancer",
        "crimson_alembic": "crimson_alembic",
        "kraken_chaps": "kraken_leather",
        "kraken_tunic": "kraken_leather",
        "rippling_trident": "kraken_fang",
        "alchemists_top": "thread_of_expertise",
        "alchemists_bottoms": "thread_of_expertise",
        "soul_hunter_crossbow": "soul_fragment",
        "jackalope_staff": "jackalope_antler",
        "corsair_helmet": "corsair_crest",
        "wooden_fire_staff": "wooden_fire_staff",
        "wooden_water_staff": "wooden_water_staff",
        "cheese_mace": "cheese_mace",
        "cheese_enhancer": "cheese_enhancer",
        "cheesemakers_top": "thread_of_expertise",
        "cheesemakers_bottoms": "thread_of_expertise",
        "cheese_alembic": "cheese_alembic",
        "reptile_boots": "reptile_boots",
        "fluffy_red_hat": "red_panda_fluff",
        "enhancers_top": "thread_of_expertise",
        "enhancers_bottoms": "thread_of_expertise",
        "burble_mace": "burble_mace",
        "burble_enhancer": "burble_enhancer",
        "burble_alembic": "burble_alembic",
        "arcane_fire_staff": "arcane_fire_staff",
        "arcane_water_staff": "arcane_water_staff",
        "holy_mace": "holy_mace",
        "holy_enhancer": "holy_enhancer",
        "holy_alembic": "holy_alembic",
        "azure_mace": "azure_mace",
        "azure_enhancer": "azure_enhancer",
        "azure_alembic": "azure_alembic",
        "snail_shell_helmet": "snail_shell",
        "vampire_fang_dirk": "vampire_fang",
        "celestial_enhancer": "butter_of_proficiency",
        "celestial_alembic": "butter_of_proficiency",
        "cedar_fire_staff": "cedar_fire_staff",
        "cedar_water_staff": "cedar_water_staff",
        "ginkgo_fire_staff": "ginkgo_fire_staff",
        "ginkgo_water_staff": "ginkgo_water_staff",
        "brewers_top": "thread_of_expertise",
        "brewers_bottoms": "thread_of_expertise",
        "acrobatic_hood": "acrobats_ribbon",
        "blooming_trident": "kraken_fang",
        "purpleheart_fire_staff": "purpleheart_fire_staff",
        "purpleheart_water_staff": "purpleheart_water_staff",
        "master_foraging_charm": "mirror_of_protection",
        "master_brewing_charm": "mirror_of_protection",
        "master_woodcutting_charm": "mirror_of_protection",
        "master_defense_charm": "mirror_of_protection",
        "master_tailoring_charm": "mirror_of_protection",
        "master_attack_charm": "mirror_of_protection",
        "master_milking_charm": "mirror_of_protection",
        "master_melee_charm": "mirror_of_protection",
        "master_alchemy_charm": "mirror_of_protection",
        "master_magic_charm": "mirror_of_protection",
        "master_stamina_charm": "mirror_of_protection",
        "master_cooking_charm": "mirror_of_protection",
        "master_enhancing_charm": "mirror_of_protection",
        "master_ranged_charm": "mirror_of_protection",
        "master_crafting_charm": "mirror_of_protection",
        "master_intelligence_charm": "mirror_of_protection",
        "advanced_foraging_charm": "mirror_of_protection",
        "advanced_brewing_charm": "mirror_of_protection",
        "advanced_woodcutting_charm": "mirror_of_protection",
        "advanced_defense_charm": "mirror_of_protection",
        "advanced_tailoring_charm": "mirror_of_protection",
        "advanced_attack_charm": "mirror_of_protection",
        "advanced_milking_charm": "mirror_of_protection",
        "advanced_melee_charm": "mirror_of_protection",
        "advanced_alchemy_charm": "mirror_of_protection",
        "advanced_magic_charm": "mirror_of_protection",
        "advanced_stamina_charm": "mirror_of_protection",
        "advanced_cooking_charm": "mirror_of_protection",
        "advanced_enhancing_charm": "mirror_of_protection",
        "advanced_task_badge": "advanced_task_badge",
        "advanced_ranged_charm": "mirror_of_protection",
        "advanced_crafting_charm": "mirror_of_protection",
        "advanced_intelligence_charm": "mirror_of_protection",
        "gobo_defender": "gobo_defender",
        "gobo_smasher": "gobo_smasher",
        "redwood_nature_staff": "redwood_nature_staff",
        "birch_nature_staff": "birch_nature_staff",
        "royal_fire_robe_top": "royal_cloth",
        "royal_fire_robe_bottoms": "royal_cloth",
        "royal_water_robe_top": "royal_cloth",
        "royal_water_robe_bottoms": "royal_cloth",
        "basic_foraging_charm": "mirror_of_protection",
        "basic_brewing_charm": "mirror_of_protection",
        "basic_woodcutting_charm": "mirror_of_protection",
        "basic_defense_charm": "mirror_of_protection",
        "basic_tailoring_charm": "mirror_of_protection",
        "basic_attack_charm": "mirror_of_protection",
        "basic_milking_charm": "mirror_of_protection",
        "basic_melee_charm": "mirror_of_protection",
        "basic_alchemy_charm": "mirror_of_protection",
        "basic_magic_charm": "mirror_of_protection",
        "basic_stamina_charm": "mirror_of_protection",
        "basic_cooking_charm": "mirror_of_protection",
        "basic_enhancing_charm": "mirror_of_protection",
        "basic_task_badge": "basic_task_badge",
        "basic_ranged_charm": "mirror_of_protection",
        "basic_crafting_charm": "mirror_of_protection",
        "basic_intelligence_charm": "mirror_of_protection",
        "earrings_of_essence_find": "earrings_of_essence_find",
        "ring_of_essence_find": "ring_of_essence_find",
        "wooden_nature_staff": "wooden_nature_staff",
        "reptile_hood": "reptile_hood",
        "reptile_bracers": "reptile_bracers",
        "reptile_chaps": "reptile_chaps",
        "reptile_tunic": "reptile_tunic",
        "knights_aegis_refined": "knights_aegis_refined",
        "arcane_nature_staff": "arcane_nature_staff",
        "trainee_foraging_charm": "mirror_of_protection",
        "trainee_brewing_charm": "mirror_of_protection",
        "trainee_woodcutting_charm": "mirror_of_protection",
        "trainee_defense_charm": "mirror_of_protection",
        "trainee_tailoring_charm": "mirror_of_protection",
        "trainee_attack_charm": "mirror_of_protection",
        "trainee_milking_charm": "mirror_of_protection",
        "trainee_melee_charm": "mirror_of_protection",
        "trainee_alchemy_charm": "mirror_of_protection",
        "trainee_magic_charm": "mirror_of_protection",
        "trainee_stamina_charm": "mirror_of_protection",
        "trainee_cooking_charm": "mirror_of_protection",
        "trainee_enhancing_charm": "mirror_of_protection",
        "trainee_ranged_charm": "mirror_of_protection",
        "trainee_crafting_charm": "mirror_of_protection",
        "trainee_intelligence_charm": "mirror_of_protection",
        "earrings_of_rare_find": "earrings_of_rare_find",
        "ring_of_rare_find": "ring_of_rare_find",
        "cedar_nature_staff": "cedar_nature_staff",
        "ginkgo_nature_staff": "ginkgo_nature_staff",
        "expert_foraging_charm": "mirror_of_protection",
        "expert_brewing_charm": "mirror_of_protection",
        "expert_woodcutting_charm": "mirror_of_protection",
        "expert_defense_charm": "mirror_of_protection",
        "expert_tailoring_charm": "mirror_of_protection",
        "expert_attack_charm": "mirror_of_protection",
        "expert_milking_charm": "mirror_of_protection",
        "expert_melee_charm": "mirror_of_protection",
        "expert_alchemy_charm": "mirror_of_protection",
        "expert_magic_charm": "mirror_of_protection",
        "expert_stamina_charm": "mirror_of_protection",
        "expert_cooking_charm": "mirror_of_protection",
        "expert_enhancing_charm": "mirror_of_protection",
        "expert_task_badge": "expert_task_badge",
        "expert_ranged_charm": "mirror_of_protection",
        "expert_crafting_charm": "mirror_of_protection",
        "expert_intelligence_charm": "mirror_of_protection",
        "purpleheart_nature_staff": "purpleheart_nature_staff",
        "grandmaster_foraging_charm": "mirror_of_protection",
        "grandmaster_brewing_charm": "mirror_of_protection",
        "grandmaster_woodcutting_charm": "mirror_of_protection",
        "grandmaster_defense_charm": "mirror_of_protection",
        "grandmaster_tailoring_charm": "mirror_of_protection",
        "grandmaster_attack_charm": "mirror_of_protection",
        "grandmaster_milking_charm": "mirror_of_protection",
        "grandmaster_melee_charm": "mirror_of_protection",
        "grandmaster_alchemy_charm": "mirror_of_protection",
        "grandmaster_magic_charm": "mirror_of_protection",
        "grandmaster_stamina_charm": "mirror_of_protection",
        "grandmaster_cooking_charm": "mirror_of_protection",
        "grandmaster_enhancing_charm": "mirror_of_protection",
        "grandmaster_ranged_charm": "mirror_of_protection",
        "grandmaster_crafting_charm": "mirror_of_protection",
        "grandmaster_intelligence_charm": "mirror_of_protection",
        "royal_nature_robe_top": "royal_cloth",
        "royal_nature_robe_bottoms": "royal_cloth",
        "chaotic_flail_refined": "mirror_of_protection",
        "regal_sword_refined": "mirror_of_protection",
        "furious_spear_refined": "mirror_of_protection",
        "sundering_crossbow_refined": "mirror_of_protection",
        "anchorbound_plate_legs_refined": "mirror_of_protection",
        "anchorbound_plate_body_refined": "mirror_of_protection",
        "enchanted_cloak_refined": "mirror_of_protection",
        "magicians_hat_refined": "mirror_of_protection",
        "maelstrom_plate_legs_refined": "mirror_of_protection",
        "maelstrom_plate_body_refined": "mirror_of_protection",
        "chimerical_quiver_refined": "mirror_of_protection",
        "marksman_bracers_refined": "mirror_of_protection",
        "griffin_bulwark_refined": "mirror_of_protection",
        "sinister_cape_refined": "mirror_of_protection",
        "cursed_bow_refined": "mirror_of_protection",
        "bishops_codex_refined": "mirror_of_protection",
        "blazing_trident_refined": "mirror_of_protection",
        "master_cheesesmithing_charm": "mirror_of_protection",
        "dodocamel_gauntlets_refined": "mirror_of_protection",
        "advanced_cheesesmithing_charm": "mirror_of_protection",
        "basic_cheesesmithing_charm": "mirror_of_protection",
        "kraken_chaps_refined": "mirror_of_protection",
        "kraken_tunic_refined": "mirror_of_protection",
        "rippling_trident_refined": "mirror_of_protection",
        "corsair_helmet_refined": "mirror_of_protection",
        "trainee_cheesesmithing_charm": "mirror_of_protection",
        "acrobatic_hood_refined": "mirror_of_protection",
        "blooming_trident_refined": "mirror_of_protection",
        "expert_cheesesmithing_charm": "mirror_of_protection",
        "grandmaster_cheesesmithing_charm": "mirror_of_protection",
        "royal_fire_robe_top_refined": "mirror_of_protection",
        "royal_fire_robe_bottoms_refined": "mirror_of_protection",
        "royal_water_robe_top_refined": "mirror_of_protection",
        "royal_water_robe_bottoms_refined": "mirror_of_protection",
        "royal_nature_robe_top_refined": "mirror_of_protection",
        "royal_nature_robe_bottoms_refined": "mirror_of_protection",
    };

})();