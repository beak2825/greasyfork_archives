// ==UserScript==
// @name         工匠放置暗黑小工具之1：自动挂机
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Boss/Siege/Treant/Golem 自动加入 + 可配置的自动切换 + UI面板可拖动、隐藏并记忆位置。
// @match        https://idleartisan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549039/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E6%9A%97%E9%BB%91%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/549039/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E6%9A%97%E9%BB%91%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cooldown flags to prevent spamming actions
    let bossCooldown = false;
    let siegeCooldown = false;
    let treantCooldown = false;
    let golemCooldown = false;
    let activitySwitchCooldown = false;

    // ===== Settings Management =====
    const settings = {
        boss: JSON.parse(localStorage.getItem('autoBoss') ?? 'true'),
        siege: JSON.parse(localStorage.getItem('autoSiege') ?? 'true'),
        treant: JSON.parse(localStorage.getItem('autoTreant') ?? 'true'),
        golem: JSON.parse(localStorage.getItem('autoGolem') ?? 'true'),
        skipChance: parseInt(localStorage.getItem('skipChance') ?? '0', 10),
        defaultActivity: localStorage.getItem('defaultActivity') ?? 'mining',
        cbActivity: localStorage.getItem('cbActivity') ?? 'goldBars'
    };

    function saveSettings() {
        localStorage.setItem('autoBoss', settings.boss);
        localStorage.setItem('autoSiege', settings.siege);
        localStorage.setItem('autoTreant', settings.treant);
        localStorage.setItem('autoGolem', settings.golem);
        localStorage.setItem('skipChance', settings.skipChance);
        localStorage.setItem('defaultActivity', settings.defaultActivity);
        localStorage.setItem('cbActivity', settings.cbActivity);
    }

    function shouldSkip() {
        return Math.random() * 100 < settings.skipChance;
    }

    // ===== Core Action Functions =====
    function selectActivityById(radioId, activityName) {
        if (activitySwitchCooldown) return;
        const radioBtn = document.getElementById(radioId);
        if (radioBtn && !radioBtn.checked) {
            if (shouldSkip()) {
                console.log(`跳过活动切换'${activityName}'（概率触发）`);
                activitySwitchCooldown = true;
                setTimeout(() => activitySwitchCooldown = false, 30 * 1000);
                return;
            }
            activitySwitchCooldown = true;
            const delay = 3000 + Math.random() * 5000;
            console.log(`检测到活动切换需求，将在 ${(delay/1000).toFixed(2)} 秒后切换到: ${activityName}`);
            setTimeout(() => {
                radioBtn.click();
                console.log(`已切换活动到: ${activityName}`);
                setTimeout(() => activitySwitchCooldown = false, 2000);
            }, delay);
        }
    }

    function autoSwitchActivityByTitle() {
        const title = document.title;
        if (title.includes('CB')) {
            switch(settings.cbActivity) {
                case 'goldBars': selectActivityById('activityChooserACT6', '金锭 (CB)'); break;
                case 'ironBars': selectActivityById('activityChooserACT4', '铁锭 (CB)'); break;
                case 'planks': selectActivityById('activityChooserACT5', '木板 (CB)'); break;
            }
        } else if (title.includes('MB')) {
            selectActivityById('activityChooserACT1', '采矿');
        } else if (title.includes('WB')) {
            selectActivityById('activityChooserACT2', '伐木');
        } else if (title.includes('BB')) {
            selectActivityById('activityChooserACT3', '战斗');
        } else {
            switch(settings.defaultActivity) {
                case 'mining': selectActivityById('activityChooserACT1', '采矿 (默认)'); break;
                case 'woodcutting': selectActivityById('activityChooserACT2', '伐木 (默认)'); break;
                case 'battling': selectActivityById('activityChooserACT3', '战斗 (默认)'); break;
            }
        }
    }

    // ===== Event Auto-Join Functions =====
    function tryJoinBoss() {
        if (!settings.boss || bossCooldown) return;
        const joinBtn = document.querySelector('#boss-fight-join-btn');
        if (document.title.includes('BF') && joinBtn && !joinBtn.disabled) {
            if (shouldSkip()) { console.log('跳过 Boss 事件（概率触发）'); bossCooldown = true; setTimeout(() => bossCooldown = false, 5 * 60 * 1000); return; }
            const delay = 500 + Math.random() * 1500;
            console.log(`检测到 Boss 事件，${(delay/1000).toFixed(2)}秒后自动加入`);
            bossCooldown = true;
            setTimeout(() => { joinBtn.click(); console.log('已自动加入 Boss 事件，冷却开始5分钟'); setTimeout(() => bossCooldown = false, 5 * 60 * 1000); }, delay);
        }
    }

    function tryJoinSiege() {
        if (!settings.siege || siegeCooldown) return;
        const isSiegeEvent = document.title.includes("Siege") || document.title.includes("围攻");
        if (isSiegeEvent) {
            if (siegeCooldown) return;
            if (!document.querySelector('.siege-controls button[data-siege-activity="fightGoblins"]')) { return; }
            if (shouldSkip()) {
                console.log('跳过 Siege 事件（概率触发）');
                siegeCooldown = true;
                setTimeout(() => siegeCooldown = false, 5 * 60 * 1000);
                return;
            }
            siegeCooldown = true;
            const delay = 3500 + Math.random() * 1500;
            console.log(`检测到 Siege 事件，将在 ${(delay/1000).toFixed(2)} 秒后自动战斗`);
            setTimeout(() => {
                const communityTab = document.querySelector('button[onclick*="Community"]');
                if (communityTab && !communityTab.classList.contains('active')) {
                    communityTab.click();
                }
                setTimeout(() => {
                    const fightBtn = document.querySelector('.siege-controls button[data-siege-activity="fightGoblins"]');
                    if (fightBtn && !fightBtn.disabled) {
                        fightBtn.click();
                        console.log('已自动点击 Siege 战斗，冷却开始5分钟');
                        setTimeout(() => siegeCooldown = false, 5 * 60 * 1000);
                    }
                }, 500);
            }, delay);
        }
    }

    function tryJoinTreant() {
        if (!settings.treant || treantCooldown) return;
        const joinBtn = document.querySelector('#treant-join-btn');
        if (document.title.includes('AT') && joinBtn && !joinBtn.disabled) {
            if (shouldSkip()) { console.log('跳过 Treant 事件（概率触发）'); treantCooldown = true; setTimeout(() => treantCooldown = false, 5 * 60 * 1000); return; }
            const delay = 500 + Math.random() * 1500;
            console.log(`检测到 Treant 事件，${(delay/1000).toFixed(2)}秒后自动加入`);
            treantCooldown = true;
            setTimeout(() => { joinBtn.click(); console.log('已自动加入 Treant 事件，冷却开始5分钟'); setTimeout(() => treantCooldown = false, 5 * 60 * 1000); }, delay);
        }
    }

    function tryJoinGolem() {
        if (!settings.golem || golemCooldown) return;
        const joinBtn = document.querySelector('#golem-join-btn');
        if (document.title.includes('RG') && joinBtn && !joinBtn.disabled) {
            if (shouldSkip()) { console.log('跳过 符文魔像 事件（概率触发）'); golemCooldown = true; setTimeout(() => golemCooldown = false, 5 * 60 * 1000); return; }
            const delay = 500 + Math.random() * 1500;
            console.log(`检测到 符文魔像 事件，${(delay/1000).toFixed(2)}秒后自动加入`);
            golemCooldown = true;
            setTimeout(() => { joinBtn.click(); console.log('已自动加入 符文魔像 事件，冷却开始5分钟'); setTimeout(() => golemCooldown = false, 5 * 60 * 1000); }, delay);
        }
    }

    // ===== Control Panel UI (Draggable, Hideable, and Position is Saved) =====
    function createPanel() {
        // 从 localStorage 加载保存的位置，如果没有则使用默认值
        const savedPosition = JSON.parse(localStorage.getItem('autoPanelPosition')) || { top: '80px', right: '20px', left: 'auto', bottom: 'auto' };

        const panel = document.createElement('div');
        panel.id = 'autoPanel';
        panel.innerHTML = `
            <div style="font-weight:bold;font-size:14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                <span>⚙️ 全局自动控制</span>
                <span id="hidePanel" title="隐藏面板" style="cursor:pointer;font-size:20px;line-height:1;margin-left:8px;font-weight:bold;">－</span>
            </div>
            <label><input type="checkbox" id="toggleBoss"> Boss 自动加入</label><br>
            <label><input type="checkbox" id="toggleSiege"> 围攻 自动战斗</label><br>
            <label><input type="checkbox" id="toggleTreant"> 树人 自动加入</label><br>
            <label><input type="checkbox" id="toggleGolem"> 魔像 自动加入</label><br>
            <div style="margin-top:8px;">
              跳过概率: <input type="number" id="skipChance" min="0" max="100" value="${settings.skipChance}" style="width:50px;margin-left:4px;"> %
            </div>
            <div style="margin-top:10px;border-top:1px solid #eee;padding-top:10px;">
                <div style="font-weight:bold;margin-bottom:4px;">活动自动切换</div>
                <label for="cbActivityChooser" style="display:block;margin-bottom:4px;">制作工作:</label>
                <select id="cbActivityChooser" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ccc;background-color:#fff;font-size:13px;margin-bottom:8px;">
                    <option value="goldBars">金锭</option>
                    <option value="ironBars">铁锭</option>
                    <option value="planks">木板</option>
                </select>
                <label for="defaultActivityChooser" style="display:block;margin-bottom:4px;">默认活动:</label>
                <select id="defaultActivityChooser" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ccc;background-color:#fff;font-size:13px;">
                    <option value="mining">采矿</option>
                    <option value="woodcutting">伐木</option>
                    <option value="battling">战斗</option>
                </select>
            </div>
        `;

        Object.assign(panel.style, {
            position: 'fixed', background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            padding: '12px 15px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '13px', color: '#333', zIndex: 9999, cursor: 'grab', width: '220px',
            boxSizing: 'border-box',
            top: savedPosition.top,
            left: savedPosition.left,
            right: savedPosition.right,
            bottom: savedPosition.bottom
        });
        document.body.appendChild(panel);

        const showPanelBtn = document.createElement('div');
        showPanelBtn.id = 'showPanelBtn';
        showPanelBtn.innerHTML = '⚙️';
        showPanelBtn.title = '显示面板';
        Object.assign(showPanelBtn.style, {
            position: 'fixed', background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            width: '48px', height: '48px', fontSize: '28px', zIndex: 10000, cursor: 'pointer',
            display: 'none', justifyContent: 'center', alignItems: 'center', color: '#333',
            top: savedPosition.top,
            left: savedPosition.left,
            right: savedPosition.right,
            bottom: savedPosition.bottom
        });
        document.body.appendChild(showPanelBtn);

        // 初始化 UI
        document.querySelector('#toggleBoss').checked = settings.boss;
        document.querySelector('#toggleSiege').checked = settings.siege;
        document.querySelector('#toggleTreant').checked = settings.treant;
        document.querySelector('#toggleGolem').checked = settings.golem;
        document.querySelector('#defaultActivityChooser').value = settings.defaultActivity;
        document.querySelector('#cbActivityChooser').value = settings.cbActivity;

        // 设置事件监听
        document.querySelector('#toggleBoss').addEventListener('change', e => { settings.boss = e.target.checked; saveSettings(); });
        document.querySelector('#toggleSiege').addEventListener('change', e => { settings.siege = e.target.checked; saveSettings(); });
        document.querySelector('#toggleTreant').addEventListener('change', e => { settings.treant = e.target.checked; saveSettings(); });
        document.querySelector('#toggleGolem').addEventListener('change', e => { settings.golem = e.target.checked; saveSettings(); });
        document.querySelector('#skipChance').addEventListener('input', e => { settings.skipChance = Math.min(100, Math.max(0, parseInt(e.target.value || '0'))); saveSettings(); });
        document.querySelector('#defaultActivityChooser').addEventListener('change', e => { settings.defaultActivity = e.target.value; saveSettings(); autoSwitchActivityByTitle(); });
        document.querySelector('#cbActivityChooser').addEventListener('change', e => { settings.cbActivity = e.target.value; saveSettings(); autoSwitchActivityByTitle(); });

        document.querySelector('#hidePanel').addEventListener('click', () => {
            const panelRect = panel.getBoundingClientRect();
            panel.style.display = 'none';
            showPanelBtn.style.display = 'flex';
            showPanelBtn.style.top = `${panelRect.top}px`;
            showPanelBtn.style.left = `${panelRect.left}px`;
        });

        showPanelBtn.addEventListener('click', () => {
            const gearRect = showPanelBtn.getBoundingClientRect();
            showPanelBtn.style.display = 'none';
            panel.style.display = 'block';
            panel.style.top = `${gearRect.top}px`;
            panel.style.left = `${gearRect.left}px`;
        });

        // --- 统一的拖拽逻辑 ---
        let dragTarget = null, offsetX, offsetY;

        function startDrag(e, target) {
            // 阻止在输入控件上开始拖拽
            if (['INPUT', 'SELECT', 'SPAN'].includes(e.target.tagName) && target === panel) return;
            dragTarget = target;
            offsetX = e.clientX - dragTarget.getBoundingClientRect().left;
            offsetY = e.clientY - dragTarget.getBoundingClientRect().top;
            dragTarget.style.cursor = 'grabbing';
        }

        function onDrag(e) {
            if (!dragTarget) return;
            dragTarget.style.left = `${e.clientX - offsetX}px`;
            dragTarget.style.top = `${e.clientY - offsetY}px`;
            dragTarget.style.right = 'auto';
            dragTarget.style.bottom = 'auto';
        }

        function stopDrag() {
            if (!dragTarget) return;
            // 保存最后的位置
            const position = {
                top: dragTarget.style.top,
                left: dragTarget.style.left,
                right: 'auto',
                bottom: 'auto'
            };
            localStorage.setItem('autoPanelPosition', JSON.stringify(position));
            dragTarget.style.cursor = dragTarget === panel ? 'grab' : 'pointer';
            dragTarget = null;
        }

        panel.addEventListener('mousedown', (e) => startDrag(e, panel));
        showPanelBtn.addEventListener('mousedown', (e) => startDrag(e, showPanelBtn));
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }


    // ===== Initialization and Timers =====
    function runChecks() {
        tryJoinBoss();
        tryJoinSiege();
        tryJoinTreant();
        tryJoinGolem();
        autoSwitchActivityByTitle();
    }

    // Initial setup
    createPanel();
    runChecks();

    // Set up regular checks
    setInterval(runChecks, 2000);

    // Also check when the page title changes
    const titleObserver = new MutationObserver(runChecks);
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, { childList: true });
    }

})();