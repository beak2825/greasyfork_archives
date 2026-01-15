// ==UserScript==
// @name         pokechill天气手自动切怪助手 1.0
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  天气检测 + 智能槽位接力(2->6) + 视觉同步修复 + ShadowDOM防翻译
// @author       黄黄
// @match        https://play-pokechill.github.io/*
// @match        https://g1tyx.github.io/play-pokechill/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562531/pokechill%E5%A4%A9%E6%B0%94%E6%89%8B%E8%87%AA%E5%8A%A8%E5%88%87%E6%80%AA%E5%8A%A9%E6%89%8B%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/562531/pokechill%E5%A4%A9%E6%B0%94%E6%89%8B%E8%87%AA%E5%8A%A8%E5%88%87%E6%80%AA%E5%8A%A9%E6%89%8B%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectedScript() {
        console.log("[Pokechill Helper] 天气手自动切怪助手已加载");

        // =========================================================
        // 1. UI 创建 (Shadow DOM 封装)
        // =========================================================
        function createUI() {
            const host = document.createElement('div');
            host.id = 'gemini-weather-host';
            host.style.position = 'fixed';
            host.style.top = '100px';
            host.style.right = '20px';
            host.style.zIndex = '999999';
            document.body.appendChild(host);

            const shadow = host.attachShadow({ mode: 'open' });

            const style = document.createElement('style');
            style.textContent = `
                :host { font-family: 'Segoe UI', sans-serif; font-size: 13px; color: white; user-select: none; }
                .panel {
                    width: 220px; background: rgba(18, 18, 18, 0.96);
                    border: 1px solid #444; border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.7); overflow: hidden;
                }
                .header {
                    background: linear-gradient(90deg, #1e3c72, #2a5298);
                    padding: 10px; text-align: center; font-weight: bold;
                    cursor: move; border-bottom: 1px solid #444; letter-spacing: 1px;
                }
                .content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
                .row { display: flex; justify-content: space-between; align-items: center; }
                .val { font-weight: bold; color: #ffeb3b; }
                .target-info {
                    margin-top: 8px; padding-top: 8px; border-top: 1px solid #333;
                    font-size: 12px; color: #ccc; display: flex; justify-content: space-between;
                }
                .target-slot { color: #00e676; font-weight: bold; }
                
                .note {
                    font-size: 11px; color: #888; text-align: center;
                    margin-top: 5px; padding-top: 5px; border-top: 1px dashed #333;
                }
                
                /* 开关样式 */
                .switch { position: relative; display: inline-block; width: 34px; height: 18px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 18px; }
                .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #00e676; }
                input:checked + .slider:before { transform: translateX(16px); }
            `;

            const wrapper = document.createElement('div');
            wrapper.className = 'panel';
            wrapper.setAttribute('translate', 'no');
            wrapper.classList.add('notranslate');
            
            wrapper.innerHTML = `
                <div class="header" id="drag-area">☁️ 天气手自动切怪助手 1.0</div>
                <div class="content">
                    <div class="row">
                        <span>切怪开关:</span>
                        <label class="switch">
                            <input type="checkbox" id="auto-sw" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="row">
                        <span>当前天气:</span>
                        <span id="st-val" class="val">检测中...</span>
                    </div>
                    <div class="row">
                        <span>剩余回合:</span>
                        <span id="tm-val" class="val">-</span>
                    </div>
                    <div class="target-info">
                        <span>当前宝可梦:</span>
                        <span id="target-slot-display" class="target-slot">1号位</span>
                    </div>
                    <div class="note">
                        说明：需要把天气手放到1号位
                    </div>
                </div>
            `;

            shadow.appendChild(style);
            shadow.appendChild(wrapper);

            return {
                host,
                header: shadow.getElementById('drag-area'),
                status: shadow.getElementById('st-val'),
                timer: shadow.getElementById('tm-val'),
                targetDisplay: shadow.getElementById('target-slot-display'),
                toggle: shadow.getElementById('auto-sw')
            };
        }

        const ui = createUI();

        // =========================================================
        // 2. 拖拽逻辑
        // =========================================================
        let isDragging = false, startX, startY, initialLeft, initialTop;
        ui.header.onmousedown = (e) => {
            e.preventDefault(); isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initialLeft = ui.host.offsetLeft; initialTop = ui.host.offsetTop;
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
        };
        function onDragMove(e) {
            if (!isDragging) return;
            ui.host.style.left = (initialLeft + (e.clientX - startX)) + 'px';
            ui.host.style.top = (initialTop + (e.clientY - startY)) + 'px';
            ui.host.style.right = 'auto';
        }
        function onDragEnd() { isDragging = false; document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd); }

        // =========================================================
        // 3. 核心游戏逻辑 (智能接力 + 视觉修复)
        // =========================================================
        
        const MAP = {
            "sunny": "☀️ 晴天", "sun": "☀️ 晴天",
            "rainy": "🌧️ 雨天", "rain": "🌧️ 雨天",
            "sandstorm": "🥪 沙暴", "sand": "🥪 沙暴",
            "hail": "❄️ 冰雹", "snow": "❄️ 雪天",
            "foggy": "🌫️ 浓雾",
            "none": "☁️ 无天气", "": "☁️ 无天气"
        };

        function gameLoop() {
            // 安全检查
            if (typeof saved === 'undefined' || typeof team === 'undefined' || typeof exploreActiveMember === 'undefined') return;

            // --- A. 数据获取 ---
            let w = saved.weather; 
            let t = saved.weatherTimer;
            if (typeof t !== 'number') t = 0;

            // 判定是否“有天气” (Timer > 0 且 weather 不为空)
            let isWeatherActive = (w && w !== 'none' && w !== '' && t > 0);
            let displayT = Math.max(0, t);

            // --- B. UI 更新 ---
            let statusText = isWeatherActive ? (MAP[w] || w) : "☁️ 无天气 (Clear)";
            ui.status.innerText = statusText;
            ui.status.style.color = isWeatherActive ? "#ffeb3b" : "#ffffff";
            ui.timer.innerText = displayT;
            ui.timer.style.color = (displayT === 0) ? "#aaa" : "#fff";

            // --- C. 智能接力逻辑 (Priority Logic) ---
            if (!ui.toggle.checked) return;

            let finalTarget = 'slot1'; // 默认保底

            if (isWeatherActive) {
                // 如果有天气，按顺序查找 Slot 2 -> Slot 6 哪个是活着的
                let foundAlive = false;
                for (let i = 2; i <= 6; i++) {
                    let s = 'slot' + i;
                    if (isAlive(s)) {
                        finalTarget = s;
                        foundAlive = true;
                        break; // 找到了优先的，立刻停止循环
                    }
                }
                // 如果 foundAlive 依然是 false (说明2-6全死了)，finalTarget 会保持 'slot1'
            } else {
                // 如果无天气，强制回 Slot 1
                finalTarget = 'slot1';
            }

            // 更新面板上的目标显示 (格式：1号位)
            ui.targetDisplay.innerText = finalTarget.replace('slot', '') + "号位";
            
            // --- D. 执行切换 & 视觉同步 ---
            if (exploreActiveMember !== finalTarget) {
                
                // 再次检查目标是否存活 (防止切到死怪)
                if (isAlive(finalTarget)) {
                    console.log(`[接力切换] 天气:${isWeatherActive}, 目标:${finalTarget}`);
                    
                    // 1. 修改核心逻辑变量
                    exploreActiveMember = finalTarget;
                    
                    // 2. 视觉同步 I: 刷新队伍UI
                    if (typeof updateTeamPkmn === 'function') updateTeamPkmn();
                    
                    // 3. 视觉同步 II: 尝试刷新战斗场景 (Sprite)
                    if (typeof saved !== 'undefined') saved.team_selected = finalTarget; 

                    // 4. 视觉同步 III: 模拟点击 (终极大法)
                    try {
                        const slotBtn = document.querySelector(`.team-slot[data-id="${finalTarget}"]`) 
                                     || document.querySelector(`#${finalTarget}-btn`); 
                        if (slotBtn) slotBtn.click();
                    } catch(e) {}
                    
                }
            }
        }

        // 辅助：判断槽位是否存活
        function isAlive(slot) {
            try {
                if (!team[slot] || !team[slot].pkmn) return false;
                let id = team[slot].pkmn.id;
                if (pkmn[id] && pkmn[id].playerHp > 0) return true;
                return false;
            } catch(e) {
                return false; 
            }
        }

        setInterval(gameLoop, 250); 
    }

    const script = document.createElement('script');
    script.textContent = `(${injectedScript.toString()})();`;
    document.body.appendChild(script);

})();