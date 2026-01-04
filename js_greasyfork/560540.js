// ==UserScript==
// @name         idleinfinity助手 V9.1
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  idleinfinity 秘境自动化助手，高效寻路，支持boss模式和全图模式，强制开启后台刷图
// @author       AI Assistant
// @match        https://www.idleinfinity.cn/Map/Dungeon*
// @match        https://www.idleinfinity.cn/Battle/InDungeon*
// @license      CC-BY-NC-SA-4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560540/idleinfinity%E5%8A%A9%E6%89%8B%20V91.user.js
// @updateURL https://update.greasyfork.org/scripts/560540/idleinfinity%E5%8A%A9%E6%89%8B%20V91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const curDungeonId = new URLSearchParams(window.location.search).get('id');

    // =========================================================
    // 1. 物理/寻路模块 (保持不动)
    // =========================================================
    const Topology = {
        canPassPhysically: (fromId, toId) => {
            const a = document.getElementById(fromId), b = document.getElementById(toId);
            if (!a || !b) return false;
            const diff = toId - fromId;
            if (Math.abs(diff) === 1 && Math.floor(fromId / 20) !== Math.floor(toId / 20)) return false;
            if (diff === -20) return !a.classList.contains('top');
            if (diff === -1) return !a.classList.contains('left');
            if (diff === 20) return !b.classList.contains('top');
            if (diff === 1) return !b.classList.contains('left');
            return false;
        }
    };

    const Pathfinder = {
        isReachable: (startId, endId, avoidMonsters = true) => {
            if (startId === endId) return true;
            let queue = [startId], visited = new Set([startId]);
            while (queue.length > 0) {
                let curr = queue.shift();
                if (curr === endId) return true;
                const neighbors = [curr - 20, curr + 20, curr - 1, curr + 1];
                for (let nextId of neighbors) {
                    if (nextId < 0 || nextId >= 400 || visited.has(nextId)) continue;
                    const node = document.getElementById(nextId);
                    if (!node || !node.classList.contains('public')) continue;
                    if (avoidMonsters && node.classList.contains('monster') && nextId !== endId) continue;
                    if (Topology.canPassPhysically(curr, nextId)) {
                        visited.add(nextId); queue.push(nextId);
                    }
                }
            }
            return false;
        }
    };

    // =========================================================
    // 2. 扫描模块 (增加弹窗/风险监测)
    // =========================================================
    const Scanner = {
        getPlayerId: () => {
            const n = document.querySelector('.current');
            return n ? parseInt(n.id) : null;
        },
        getMonsterLeft: () => {
            const n = document.querySelector('.monster-left');
            return n ? (parseInt(n.innerText) || 0) : 999;
        },
        detectPopup: () => {
            const banned = ["封号", "禁止", "异常操作", "检测"];
            if (banned.some(key => document.body.innerText.includes(key))) return true;
            const btns = Array.from(document.querySelectorAll('button, a'));
            const confirmBtn = btns.find(el => (el.innerText === '确定' || el.innerText === '确认') && el.offsetParent !== null);
            const title = Array.from(document.querySelectorAll('div, h4, span')).find(el => el.innerText === '提示' && el.offsetParent !== null);
            return !!(confirmBtn || title);
        },
        getFogDensity: (centerId) => {
            let count = 0;
            const cX = centerId % 20, cY = Math.floor(centerId / 20);
            for (let y = cY - 2; y <= cY + 2; y++) {
                for (let x = cX - 2; x <= cX + 2; x++) {
                    if (x >= 0 && x < 20 && y >= 0 && y < 20) {
                        const node = document.getElementById(y * 20 + x);
                        if (node && node.classList.contains('mask')) count++;
                    }
                }
            }
            return count;
        },
        getFogOutposts: () => {
            const masks = Array.from(document.querySelectorAll('.block.mask'));
            const results = [];
            masks.forEach(m => {
                const mId = parseInt(m.id), density = Scanner.getFogDensity(mId);
                [mId-20, mId+20, mId-1, mId+1].forEach(vId => {
                    const vNode = document.getElementById(vId);
                    if (vNode && vNode.classList.contains('public') && Topology.canPassPhysically(vId, mId)) {
                        results.push({ outpost: vNode, target: m, isMonster: vNode.classList.contains('monster'), density: density });
                    }
                });
            });
            return results;
        }
    };

    // =========================================================
    // 3. UI 模块 (修复：日志开关失效、ID锁定日志消失)
    // =========================================================
    const UI = {
        addLog: (msg, color = '#0f0') => {
            const time = new Date().toLocaleTimeString().split(' ')[0];
            const content = document.querySelector('#script-log-content');
            if (content) {
                const line = document.createElement('div');
                line.innerHTML = `<span style="color:#888">[${time}]</span> <span style="color:${color}">${msg}</span>`;
                content.appendChild(line);
                content.scrollTop = content.scrollHeight;
            }
            // ID 锁定持久化
            let storage = JSON.parse(sessionStorage.getItem('script_persistent_logs') || '{"id":"","logs":[]}');
            if (curDungeonId && storage.id && curDungeonId !== storage.id) storage.logs = [];
            if (curDungeonId) storage.id = curDungeonId;
            storage.logs.push({ msg, color, time });
            if (storage.logs.length > 100) storage.logs.shift();
            sessionStorage.setItem('script_persistent_logs', JSON.stringify(storage));
        },
        buildUI: () => {
            if (document.querySelector('#script-ctrl-box')) return;
            const isRun = localStorage.getItem('script_active_all') === 'true';
            const mode = localStorage.getItem('script_strategy') || 'boss_first';
            const logVis = localStorage.getItem('script_log_visible') !== 'false';

            const ctrlBox = document.createElement('div');
            ctrlBox.id = 'script-ctrl-box';
            ctrlBox.style.cssText = `position: fixed; top: 10px; left: 10px; z-index: 10000; display: flex; flex-direction: column; gap: 5px;`;
            document.body.appendChild(ctrlBox);

            const btnRun = UI.createBtn('btn-run', isRun ? '脚本：运行中' : '脚本：已停止', isRun ? '#28a745' : '#dc3545');
            const btnMode = UI.createBtn('btn-mode', mode === 'boss_first' ? '策略：BOSS优先' : '策略：全图清剿', mode === 'boss_first' ? '#007bff' : '#6f42c1');
            const btnLog = UI.createBtn('btn-log', '开启/隐藏日志', '#6c757d');
            [btnRun, btnMode, btnLog].forEach(b => ctrlBox.appendChild(b));

            const logContainer = document.createElement('div');
            logContainer.id = 'script-log-container';
            logContainer.style.cssText = `position: fixed; z-index: 10001; width: 350px; height: 450px; background: rgba(0, 0, 0, 0.9); border: 2px solid #00ff00; border-radius: 8px; display: ${logVis ? 'flex' : 'none'}; flex-direction: column; top: ${localStorage.getItem('log_pos_top') || '10px'}; left: ${localStorage.getItem('log_pos_left') || 'calc(100% - 360px)'};`;
            logContainer.innerHTML = `
                <div id="log-header" style="padding: 8px; background: #008000; color: white; cursor: move; font-size: 12px; font-weight: bold; display: flex;">
                    <span style="flex:1">📜 决策跟踪 V9.0</span><span id="log-close" style="cursor:pointer">✖</span>
                </div>
                <div id="script-log-content" style="flex:1; overflow-y: auto; padding: 10px; color: #0f0; font-family: monospace; font-size: 11px; line-height: 1.4;"></div>
            `;
            document.body.appendChild(logContainer);

            // 历史日志挂载
            const storage = JSON.parse(sessionStorage.getItem('script_persistent_logs') || '{"id":"","logs":[]}');
            if (storage.logs.length > 0 && (!curDungeonId || storage.id === curDungeonId)) {
                const content = document.querySelector('#script-log-content');
                storage.logs.forEach(l => {
                    const line = document.createElement('div');
                    line.innerHTML = `<span style="color:#888">[${l.time}]</span> <span style="color:${l.color}">${l.msg}</span>`;
                    content.appendChild(line);
                });
                content.scrollTop = content.scrollHeight;
            }

            // 事件：状态切换
            btnRun.onclick = () => {
                const now = localStorage.getItem('script_active_all') !== 'true';
                localStorage.setItem('script_active_all', now);
                UI.updateUIState();
                UI.addLog(now ? "--- 开启助手 ---" : "--- 手动停止 ---");
            };
            // 事件：策略切换
            btnMode.onclick = () => {
                const now = (localStorage.getItem('script_strategy') === 'boss_first' ? 'explore_all' : 'boss_first');
                localStorage.setItem('script_strategy', now);
                UI.updateUIState();
                UI.addLog("切换策略: " + now);
            };
            // 事件：日志开关 (修复关键点)
            btnLog.onclick = () => {
                const box = document.getElementById('script-log-container');
                const isHidden = (box.style.display === 'none');
                box.style.display = isHidden ? 'flex' : 'none';
                localStorage.setItem('script_log_visible', isHidden);
            };
            document.getElementById('log-close').onclick = btnLog.onclick;

            // 拖拽
            const header = document.getElementById('log-header');
            let isDrag = false, offset = [0,0];
            header.onmousedown = (e) => { isDrag = true; offset = [e.clientX - logContainer.offsetLeft, e.clientY - logContainer.offsetTop]; };
            document.onmousemove = (e) => { if(isDrag) { logContainer.style.left = (e.clientX - offset[0])+'px'; logContainer.style.top = (e.clientY - offset[1])+'px'; }};
            document.onmouseup = () => { isDrag = false; localStorage.setItem('log_pos_top', logContainer.style.top); localStorage.setItem('log_pos_left', logContainer.style.left); };
        },
        createBtn: (id, text, bg) => {
            const b = document.createElement('button');
            b.id = id; b.innerText = text;
            b.style.cssText = `padding: 8px 12px; font-size: 12px; font-weight: bold; color: white; border: 2px solid #fff; border-radius: 5px; cursor: pointer; background: ${bg}; width: 150px;`;
            return b;
        },
        updateUIState: () => {
            const isRun = localStorage.getItem('script_active_all') === 'true', mode = localStorage.getItem('script_strategy') || 'boss_first';
            const br = document.getElementById('btn-run'), bm = document.getElementById('btn-mode');
            if (br) { br.innerText = isRun ? '脚本：运行中' : '脚本：已停止'; br.style.backgroundColor = isRun ? '#28a745' : '#dc3545'; }
            if (bm) { bm.innerText = mode === 'boss_first' ? '策略：BOSS优先' : '策略：全图清剿'; bm.style.backgroundColor = mode === 'boss_first' ? '#007bff' : '#6f42c1'; }
        }
    };

    // =========================================================
    // 4. 策略决策与执行引擎 (复原：详细决策日志)
    // =========================================================
    const Strategist = {
        getDecision: () => {
            const pId = Scanner.getPlayerId(); if (pId === null) return null;
            const mode = localStorage.getItem('script_strategy') || 'boss_first';
            const failData = JSON.parse(sessionStorage.getItem('script_monster_fails') || '{}');
            const bigBoss = document.querySelector('.monster.boss');
            const isSafe = (node) => (failData[node.id] || 0) < 30;

            if (mode === 'boss_first' && bigBoss) {
                UI.addLog(`探测大BOSS(${bigBoss.id})...`, "#aaa");
                if (isSafe(bigBoss) && Pathfinder.isReachable(pId, parseInt(bigBoss.id), false)) {
                    return { node: bigBoss, type: (pId === parseInt(bigBoss.id) ? "action" : "jump"), desc: "总攻", reason: "锁定大BOSS" };
                }
            }

            let outposts = Scanner.getFogOutposts();
            if (outposts.length > 0) {
                const reachable = outposts.filter(o => Pathfinder.isReachable(pId, parseInt(o.outpost.id), !o.isMonster));
                if (reachable.length > 0) {
                    reachable.sort((a, b) => b.density - a.density);
                    const safeOnes = reachable.filter(o => !o.isMonster);
                    const best = safeOnes.length > 0 ? safeOnes[0] : reachable[0];
                    UI.addLog(`扫描边缘: 发现 ${reachable.length} 条路径，最优密度:${best.density}`, "#aaa");
                    return { node: (pId === parseInt(best.outpost.id) ? best.target : best.outpost), type: (pId === parseInt(best.outpost.id) ? "action" : "jump"), desc: "开图", reason: `密度寻路(潜力:${best.density})` };
                }
            }

            if (mode === 'explore_all') {
                const mobs = Array.from(document.querySelectorAll('.monster:not(.boss)'));
                const target = mobs.find(m => isSafe(m) && Pathfinder.isReachable(pId, parseInt(m.id), true));
                if (target) return { node: target, type: (pId === parseInt(target.id) ? "action" : "jump"), desc: "清怪", reason: "清剿视野怪" };
            }
            return null;
        }
    };

    const Engine = {
        isProcessing: false,
        init: () => {
            var lastT = 0; window.requestAnimationFrame = (cb) => {
                var now = Date.now(), t = Math.max(0, 16 - (now - lastT)); lastT = now + t; return window.setTimeout(() => cb(lastT), t);
            };
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            document.hasFocus = () => true;
            UI.buildUI();
            Engine.tick();
        },
        tick: () => {
            const isRun = localStorage.getItem('script_active_all') === 'true';
            if (isRun && !Engine.isProcessing) Engine.loop();
            setTimeout(() => Engine.tick(), 1200 + Math.random() * 400);
        },
        loop: () => {
            document.querySelectorAll('.block').forEach(el => el.style.outline = "");
            if (Scanner.detectPopup()) {
                localStorage.setItem('script_active_all', 'false');
                UI.addLog("！！！异常弹窗熔断！！！", "#f00");
                UI.updateUIState(); return;
            }
            if (window.location.href.includes("/Battle/")) {
                Engine.handleBattle();
            } else {
                const task = Strategist.getDecision();
                if (task) {
                    UI.addLog(`[决策成功] ${task.reason}`, "#0ff");
                    Engine.execute(task);
                }
            }
        },
        handleBattle: () => {
            const res = Array.from(document.querySelectorAll('.turn')).find(t => (t.innerText.includes("胜利") || t.innerText.includes("失败")) && t.style.display === 'block');
            if (res) {
                const back = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes("返回") && a.href.includes("Map"));
                if (back) Engine.execute({ node: back, type: "jump", desc: "返回" });
            }
        },
        humanClick: (el) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width * 0.6, height = rect.height * 0.6;
            const x = rect.left + rect.width * 0.2 + Math.random() * width;
            const y = rect.top + rect.height * 0.2 + Math.random() * height;
            const opt = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
            el.dispatchEvent(new MouseEvent('mousedown', opt));
            el.dispatchEvent(new MouseEvent('mouseup', opt));
            el.dispatchEvent(new MouseEvent('click', opt));
        },
        execute: (task) => {
            Engine.isProcessing = true;
            const node = task.node;
            node.style.outline = `4px solid ${task.type === 'action' ? 'red' : 'yellow'}`;
            setTimeout(() => {
                UI.addLog(`[执行] -> ${node.id || '返回'}`);
                Engine.humanClick(node);
                setTimeout(() => { if (node) node.style.outline = ""; Engine.isProcessing = false; }, 300);
            }, 1000 + Math.random() * 500);
        }
    };

    Engine.init();
})();