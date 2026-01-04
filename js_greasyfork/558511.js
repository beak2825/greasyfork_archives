// ==UserScript==
// @name        DELUGE RPG SCRIPT!!! AutoBattle w/ Menu For Full Control
// @namespace    http://tampermonkey.net/
// @version      3.0
// @license MIT
// @description  Auto battler with Menu. Keep at your own risk.
// @match        https://www.delugerpg.com/battle/*
// @author 0x11 & Anyms
// @icon         https://www.delugerpg.com/images/items/pokeball.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558511/DELUGE%20RPG%20SCRIPT%21%21%21%20AutoBattle%20w%20Menu%20For%20Full%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/558511/DELUGE%20RPG%20SCRIPT%21%21%21%20AutoBattle%20w%20Menu%20For%20Full%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////////////////////////////
    //  CONFIG
    //////////////////////////////
    const MICRO_HESITATION_MIN = 200; 
    const MICRO_HESITATION_MAX = 800; 
    const MISCLICK_CHANCE = 0.02; 
    const RANDOM_OVERRIDE_RULE_CHANCE = 0.015; 
    const HESITATION_PAUSE_MIN = 3000;
    const HESITATION_PAUSE_MAX = 8000; 
    const HESITATION_RANGE_MIN = 50; 
    const HESITATION_RANGE_MAX = 100;

   
    const STORAGE_BATTLE_COUNT = 'autobattler_battle_count_v3';
    const STORAGE_NEXT_HESITATION_TARGET = 'autobattler_next_hesitation_target_v3';

    
    const rand = (min, max) => Math.random() * (max - min) + min;
    const rint = (min, max) => Math.floor(rand(min, max + 1));
    const sleep = ms => new Promise(res => setTimeout(res, ms));

   
    async function microHesitation() {
        
        if (Math.random() < 0.4) {
            await sleep(rint(MICRO_HESITATION_MIN, MICRO_HESITATION_MAX));
        }
    }

    
    function shouldMisclick() {
        return Math.random() < MISCLICK_CHANCE;
    }

    
    function shouldOverrideRule() {
        return Math.random() < RANDOM_OVERRIDE_RULE_CHANCE;
    }

    
    function getBattleCount() {
        const v = parseInt(localStorage.getItem(STORAGE_BATTLE_COUNT) || '0', 10);
        return isNaN(v) ? 0 : v;
    }
    function setBattleCount(n) {
        localStorage.setItem(STORAGE_BATTLE_COUNT, String(n));
    }
    function addBattleCount(delta = 1) {
        const c = getBattleCount() + delta;
        setBattleCount(c);
        return c;
    }
    function getNextHesitationTarget() {
        const v = parseInt(localStorage.getItem(STORAGE_NEXT_HESITATION_TARGET) || '0', 10);
        return (isNaN(v) || v <= 0) ? scheduleNextHesitation() : v;
    }
    function scheduleNextHesitation() {
        const current = getBattleCount();
        const next = current + rint(HESITATION_RANGE_MIN, HESITATION_RANGE_MAX);
        localStorage.setItem(STORAGE_NEXT_HESITATION_TARGET, String(next));
        return next;
    }
    function clearHesitationTarget() {
        localStorage.removeItem(STORAGE_NEXT_HESITATION_TARGET);
    }

    
    const cursor = document.createElement('div');
    cursor.id = 'autobattler_fake_cursor_v3';
    
    Object.assign(cursor.style, {
        position: 'fixed',
        width: '14px',
        height: '14px',
        'border-radius': '50%',
        border: '2px solid rgba(0,0,0,0.6)',
        background: 'rgba(255,255,255,0.9)',
        zIndex: 999999,
        pointerEvents: 'none',
        transform: 'translate(-50%,-50%)',
        transition: 'none',
        left: '50px',
        top: '50px',
        boxShadow: '0 0 2px rgba(0,0,0,0.3)',
        mixBlendMode: 'normal'
    });
    document.body.appendChild(cursor);

    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    
    function dispatchMouseEventAt(clientX, clientY, type = 'mousemove') {
        try {
            const ev = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: Math.round(clientX),
                clientY: Math.round(clientY)
            });
            const el = document.elementFromPoint(Math.round(clientX), Math.round(clientY));
            if (el) el.dispatchEvent(ev);
        } catch (e) {
           
        }
    }

    
    async function moveCursorTo(targetElOrPos, options = {}) {
        const rect = (el => el && el.getBoundingClientRect ? el.getBoundingClientRect() : null)(targetElOrPos);
        const vw = window.innerWidth, vh = window.innerHeight;

        
        const start = {
            x: parseFloat(cursor.style.left) || 50,
            y: parseFloat(cursor.style.top) || 50
        };

        
        const target = rect ? {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        } : {
            x: Math.min(Math.max(targetElOrPos.x, 0), vw),
            y: Math.min(Math.max(targetElOrPos.y, 0), vh)
        };

        
        const offsetRange = Math.min(12, Math.max(6, Math.hypot(rect ? rect.width : 20, rect ? rect.height : 20) * 0.12));
        target.x += rand(-offsetRange, offsetRange);
        target.y += rand(-offsetRange, offsetRange);

        
        const snapChance = 0.18; // ~18% fast snap
        const isSnap = Math.random() < snapChance;
        const duration = options.duration !== undefined ? options.duration : (isSnap ? rint(80, 220) : rint(200, 700));

        
        const cp = {
            x: start.x + (target.x - start.x) * rand(0.2, 0.6) + rand(-80, 80),
            y: start.y + (target.y - start.y) * rand(0.2, 0.6) + rand(-80, 80)
        };

        
        return new Promise(resolve => {
            const t0 = performance.now();
            function frame(now) {
                const t = Math.min(1, (now - t0) / duration);
                const e = easeInOutCubic(t);

                
                const qx = (1 - e) * (1 - e) * start.x + 2 * (1 - e) * e * cp.x + e * e * target.x;
                const qy = (1 - e) * (1 - e) * start.y + 2 * (1 - e) * e * cp.y + e * e * target.y;

                
                const jitterStrength = Math.max(0, (t - 0.75) / 0.25); // 0 until 75%, then ramps
                const jitterX = rand(-1, 1) * 6 * jitterStrength;
                const jitterY = rand(-1, 1) * 6 * jitterStrength;

                cursor.style.left = `${qx + jitterX}px`;
                cursor.style.top = `${qy + jitterY}px`;

               
                dispatchMouseEventAt(qx + jitterX, qy + jitterY, 'mousemove');

                if (t < 1) {
                    requestAnimationFrame(frame);
                } else {
                    // final small micro adjustments
                    cursor.style.left = `${target.x + rand(-2, 2)}px`;
                    cursor.style.top = `${target.y + rand(-2, 2)}px`;
                    // settle a tiny bit
                    setTimeout(resolve, rint(30, 120));
                }
            }
            requestAnimationFrame(frame);
        });
    }

    
    async function humanClick(targetEl, note = '') {
        if (!targetEl) return false;

        
        try {
            if (typeof targetEl.offsetParent !== 'undefined' && targetEl.offsetParent === null) {
                // not visible
                return false;
            }
        } catch (e) { /* ignore cross-origin or other */ }

        await microHesitation();

        
        try {
            await moveCursorTo(targetEl);
        } catch (e) {
            
        }

        
        if (Math.random() < 0.25) await sleep(rint(60, 240));

        
        if (shouldMisclick()) {
            console.log('AutoBattler (HUMAN): simulated misclick — skipping one click on', note || targetEl);
            return false;
        }

        try {
            targetEl.click();
            console.log('AutoBattler: clicked', note || targetEl);
            return true;
        } catch (e) {
            console.warn('AutoBattler: click failed', e, targetEl);
            return false;
        }
    }

    
    async function clickVisibleButton(buttons, name = '') {
        for (const btn of buttons) {
            if (btn && btn.offsetParent !== null) {
                await humanClick(btn, name || `clicked visible button: ${btn.value || btn.textContent}`);
                return true;
            }
        }
        return false;
    }

    async function humanSubmit(formEl) {
        if (!formEl) return false;
        const submitBtn = formEl.querySelector('input[type="submit"], button[type="submit"]');
        if (submitBtn) {
            return humanClick(submitBtn, 'submitted form via button');
        }
        try {
            await microHesitation();
            formEl.submit();
            console.log('AutoBattler: form.submit() called');
            return true;
        } catch (e) {
            console.warn('AutoBattler: form.submit() failed', e);
            return false;
        }
    }

    
    let BATTLE_MODE = window.location.href.includes("/inverse") ? "inverse" : "normal";

    const moveRulesNormal = {
        "Weavile": "Rock Wrecker",
        "Shiny Magnezone": "Precipice Blades",
        "Metallic Mega Gengar": "Prismatic Laser",
        "Ghostly Crobat": "Prismatic Laser",
        "Dark Mega Alakazam": "Sinister Arrow Raid",
        "Shadow Typhlosion": "Rock Wrecker",
        "Shiny Weavile": "Focus Punch",
        "Metallic Magnezone": "Focus Punch",
        "Ghostly Mega Gengar": "Prismatic Laser",
        "Dark Crobat": "Prismatic Laser",
        "Shadow Mega Alakazam": "Sinister Arrow Raid",
        "Mirage Typhlosion": "Rock Wrecker",
    };

    const moveRulesInverse = {
        "Weavile": "Prismatic Laser",
        "Shiny Magnezone": "Rock Wrecker",
        "Metallic Mega Gengar": "Sinister Arrow Raid",
        "Ghostly Crobat": "Rock Wrecker",
        "Dark Mega Alakazam": "Precipice Blades",
        "Shadow Typhlosion": "Prismatic Laser",
    };

    function getActiveRules() {
        return BATTLE_MODE === "inverse" ? moveRulesInverse : moveRulesNormal;
    }

    
    function dynamicIntervalMs() {
        return rint(1000, 1500);
    }

    
    let mainTimer = null;
    function scheduleNextRun(ms = null) {
        if (mainTimer) clearTimeout(mainTimer);
        mainTimer = setTimeout(mainLoop, ms === null ? dynamicIntervalMs() : ms);
    }

    
    async function mainLoop() {
        try {
           
            const startBattleBtn = document.querySelector('input[type="submit"][name="Start Battle"], input[name="Start Battle"], input[name="Start Battle"]');
            if (startBattleBtn) {
                await humanClick(startBattleBtn, "start battle");
                
                const newCount = addBattleCount(1);
                console.log('AutoBattler: battleCount ->', newCount);
                
                if (newCount >= getNextHesitationTarget()) {
                    const pauseMs = rint(HESITATION_PAUSE_MIN, HESITATION_PAUSE_MAX);
                    console.log("AutoBattler (HESITATE): taking a break for", pauseMs, "ms (human pause)");
                    await sleep(pauseMs);
                    scheduleNextHesitation(); // schedule next target
                }
                return scheduleNextRun();
            }

            
            (function handleVictoryRepeat() {
                const inverseBtn = document.querySelector('#battle a.btn-primary[href$="/inverse"]');
                const normalBtn = document.querySelector('#battle a.btn-primary[href^="/battle/trainer/"]:not([href$="/inverse"])');

                if (window.location.href.includes("/inverse")) {
                    if (inverseBtn) {
                        
                        humanClick(inverseBtn, "WIN: inverse repeat");
                        addBattleCount(1);
                        scheduleNextRun();
                        return;
                    }
                }
                if (normalBtn) {
                    humanClick(normalBtn, "WIN: normal repeat");
                    addBattleCount(1);
                    scheduleNextRun();
                    return;
                }
            })();

            
            const skipBtns = Array.from(document.querySelectorAll('input[name="skip_"], input[name="skip"]')).filter(b => b.offsetParent !== null);
            if (skipBtns.length > 0) {
                if (await clickVisibleButton(skipBtns, "skip pokemon selection")) return scheduleNextRun();
            }

            const continueBtns = Array.from(document.querySelectorAll('input[name="continue_"], input[name="continue"]')).filter(b => b.offsetParent !== null);
            if (continueBtns.length > 0) {
                if (await clickVisibleButton(continueBtns, "battle continue")) return scheduleNextRun();
            }

            const postFaintBtns = Array.from(document.querySelectorAll('input.btn-battle_action')).filter(btn => btn.value && btn.value.trim() === "Continue");
            if (postFaintBtns.length > 0) {
                if (await clickVisibleButton(postFaintBtns, "post-faint continue")) return scheduleNextRun();
            }

            
            (function handleRepeatBattle() {
                const links = document.querySelectorAll('#battle a.btn-primary[href]');
                const isInverseURL = window.location.href.includes("/inverse");

                if (isInverseURL) {
                    for (const a of links) {
                        const href = a.getAttribute("href");
                        if (href && href.endsWith("/inverse")) {
                            humanClick(a, "repeat inverse (exact)");
                            addBattleCount(1);
                            scheduleNextRun();
                            return;
                        }
                    }
                    for (const a of links) {
                        const href = a.getAttribute("href");
                        if (href && href.includes("/inverse")) {
                            humanClick(a, "repeat inverse (contains)");
                            addBattleCount(1);
                            scheduleNextRun();
                            return;
                        }
                    }
                    return;
                }

                for (const a of links) {
                    const href = a.getAttribute("href");
                    if (href && !href.includes("/inverse")) {
                        humanClick(a, "repeat normal");
                        addBattleCount(1);
                        scheduleNextRun();
                        return;
                    }
                }
            })();

            
            if (!document.querySelector(".modal-open")) {
                const pokeStartBtn = document.querySelector("#attack > div.cardif > form > div.buttoncenter > input:nth-child(1), #attack input[type='submit']");
                if (pokeStartBtn) {
                    await humanClick(pokeStartBtn, "pokemon start (first option)");
                    return scheduleNextRun();
                }
            }

           
            const attackBtn = document.querySelector('input.btn-battle_action[type="submit"][name="attack_"], input[name="attack_"], button[name="attack_"]');
            if (attackBtn) {
                const attackListVisible = document.querySelector('#user .attklist ul, #user .attklist h2');
                if (!attackListVisible) {
                    await humanClick(attackBtn, "enter attack menu");
                    return scheduleNextRun();
                }
            }

            
            const attackList = document.querySelector('#user .attklist');
            if (!attackList) return scheduleNextRun();

            const radios = attackList.querySelectorAll('input[type="radio"][name="selected"]');
            const labels = attackList.querySelectorAll('label');
            if (!radios || radios.length === 0 || !labels || labels.length === 0) return scheduleNextRun();

            // Find enemy
            const enemyNameSpan = document.querySelector("#opponent .pokemon span.smallcaps");
            let enemyFull = enemyNameSpan ? enemyNameSpan.textContent.trim() : (document.querySelector("#opponent .pokemon img")?.alt || "").trim();
            if (!enemyFull) return scheduleNextRun();

            const enemyShort = enemyFull.split(" ").pop();
            const rules = getActiveRules();
            let chosenMove = rules[enemyFull] || rules[enemyShort];

            
            if (shouldOverrideRule()) {
                chosenMove = null;
                console.log("AutoBattler (HUMAN): random override -> using first move for", enemyFull);
            }

            const firstRadio = attackList.querySelector('input[type="radio"][name="selected"]');
            const submitBtn = attackList.querySelector('input[type="submit"], button[type="submit"]');

            async function useFirstMove(reason) {
                console.log("AutoBattler: fallback -> submit attack only:", reason, "enemy:", enemyFull);

                
                await sleep(rint(60, 180));

                
                if (submitBtn) {
                    await humanClick(submitBtn, "submit attack (fallback no-rule)");
                } else {
                    const formAncestor = attackList.closest('form') || document.querySelector('#user form');
                    if (formAncestor) await humanSubmit(formAncestor);
                }
            }

            if (!chosenMove) {
                await useFirstMove("no rule");
                return scheduleNextRun();
            }

            const chosenLabel = Array.from(labels).find(l => {
                const txt = l.textContent.replace(/\s+/g, ' ').trim();
                return txt.toLowerCase().includes(chosenMove.toLowerCase());
            });

            if (!chosenLabel) {
                await useFirstMove(`rule '${chosenMove}' not present`);
                return scheduleNextRun();
            }

            let radioEl = null;
            if (chosenLabel.previousElementSibling && chosenLabel.previousElementSibling.tagName.toLowerCase() === 'input') {
                radioEl = chosenLabel.previousElementSibling;
            } else {
                const labelArray = Array.from(labels);
                const idx = labelArray.indexOf(chosenLabel);
                if (idx >= 0 && idx < radios.length) radioEl = radios[idx];
                else radioEl = firstRadio;
            }

            if (!radioEl) {
                await useFirstMove("no radio element found for chosen move");
                return scheduleNextRun();
            }


await sleep(rint(40, 100)); 
const isAlreadyChecked = radioEl.checked || radioEl.getAttribute('checked') !== null;

if (isAlreadyChecked) {
    console.log(`AutoBattler: move "${chosenMove}" already selected — skipping radio click`);

    
    await sleep(rint(60, 180));

    if (submitBtn) {
        await humanClick(submitBtn, `submit chosen move "${chosenMove}" (radio already selected)`);
    } else {
        const formAncestor = attackList.closest('form') || document.querySelector('#user form');
        if (formAncestor) await humanSubmit(formAncestor);
    }
} else {
    console.log(`AutoBattler: selecting rule move "${chosenMove}" vs ${enemyFull}`);
    await humanClick(radioEl, `select radio for "${chosenMove}" against ${enemyFull}`);

    
    await sleep(rint(60, 180));
    if (submitBtn) {
        await humanClick(submitBtn, `submit chosen move "${chosenMove}"`);
    } else {
        const formAncestor = attackList.closest('form') || document.querySelector('#user form');
        if (formAncestor) await humanSubmit(formAncestor);
    }
}

        return scheduleNextRun();


        } catch (err) {
            console.error('AutoBattler: error in mainLoop', err);
            return scheduleNextRun();
        }
    }

    
    getNextHesitationTarget();

    

    const STORAGE_RUNNING_KEY = 'autobattler_running_v3';
    function isPersistedRunning() {
        try { return localStorage.getItem(STORAGE_RUNNING_KEY) === '1'; } catch (e) { return false; }
    }
    function setPersistedRunning(val) {
        try { if (val) localStorage.setItem(STORAGE_RUNNING_KEY, '1'); else localStorage.removeItem(STORAGE_RUNNING_KEY); } catch (e) { }
    }

    
    if (isPersistedRunning()) scheduleNextRun(1200);

    
    window.AutoBattlerV3 = {
        getBattleCount,
        setBattleCount,
        scheduleNextHesitation,
        getNextHesitationTarget,
        reset: () => {
            setBattleCount(0);
            scheduleNextHesitation();
            console.log('AutoBattler: reset counters');
        }
    };

    // --- control panel UI (start/stop/reset) ---
    (function createControlPanel() {
        if (document.getElementById('autobattler_control_panel_v3')) return;
        const panel = document.createElement('div');
        panel.id = 'autobattler_control_panel_v3';

        // Load saved position and collapsed state
        const STORAGE_PANEL_POS_KEY = 'autobattler_panel_position_v3';
        const STORAGE_PANEL_COLLAPSED_KEY = 'autobattler_panel_collapsed_v3';

        function getSavedPosition() {
            try {
                const saved = localStorage.getItem(STORAGE_PANEL_POS_KEY);
                if (saved) {
                    const pos = JSON.parse(saved);
                    return { left: pos.left, top: pos.top, right: pos.right, bottom: pos.bottom };
                }
            } catch (e) {}
            return { right: '14px', bottom: '14px' };
        }

        function savePosition() {
            try {
                const pos = {
                    left: panel.style.left,
                    top: panel.style.top,
                    right: panel.style.right,
                    bottom: panel.style.bottom
                };
                localStorage.setItem(STORAGE_PANEL_POS_KEY, JSON.stringify(pos));
            } catch (e) {}
        }

        function isCollapsed() {
            try {
                return localStorage.getItem(STORAGE_PANEL_COLLAPSED_KEY) === 'true';
            } catch (e) {
                return false;
            }
        }

        function setCollapsed(collapsed) {
            try {
                if (collapsed) {
                    localStorage.setItem(STORAGE_PANEL_COLLAPSED_KEY, 'true');
                } else {
                    localStorage.removeItem(STORAGE_PANEL_COLLAPSED_KEY);
                }
            } catch (e) {}
        }

        const savedPos = getSavedPosition();
        const collapsed = isCollapsed();

        Object.assign(panel.style, {
            position: 'fixed',
            ...savedPos,
            background: 'rgba(18,18,20,0.9)',
            color: '#e6eef3',
            padding: '10px',
            borderRadius: '10px',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontSize: '13px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            zIndex: 9999999,
            minWidth: '170px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'default',
            userSelect: 'none'
        });

        
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'move';
        header.style.marginBottom = '4px';
        header.style.paddingBottom = '6px';
        header.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

        const title = document.createElement('div');
        title.textContent = 'AutoBattler';
        title.style.fontWeight = '600';
        title.style.flex = '1';
        header.appendChild(title);

        // Collapse/Expand button
        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = collapsed ? '▼' : '▲';
        collapseBtn.style.background = 'transparent';
        collapseBtn.style.border = 'none';
        collapseBtn.style.color = '#e6eef3';
        collapseBtn.style.cursor = 'pointer';
        collapseBtn.style.padding = '2px 6px';
        collapseBtn.style.fontSize = '10px';
        collapseBtn.style.marginLeft = '8px';

        const contentArea = document.createElement('div');
        contentArea.id = 'autobattler_content_area_v3';
        contentArea.style.display = collapsed ? 'none' : 'flex';
        contentArea.style.flexDirection = 'column';
        contentArea.style.gap = '8px';

        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newCollapsed = !isCollapsed();
            setCollapsed(newCollapsed);
            contentArea.style.display = newCollapsed ? 'none' : 'flex';
            collapseBtn.textContent = newCollapsed ? '▼' : '▲';
        });

        header.appendChild(collapseBtn);
        panel.appendChild(header);

        // Drag functionality
        header.addEventListener('mousedown', (e) => {
            if (e.target === collapseBtn) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.cursor = 'move';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

           
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            savePosition();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.cursor = 'default';
            }
        });

        const status = document.createElement('div');
        status.id = 'autobattler_status_v3';
        status.textContent = isPersistedRunning() ? 'Running' : 'Stopped';
        status.style.fontSize = '12px';
        status.style.opacity = '0.9';
        contentArea.appendChild(status);

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '6px';
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        Object.assign(startBtn.style, {flex: '1', padding: '6px 8px', borderRadius: '6px', border: 'none', background: '#2ecc71', color: '#062016', cursor: 'pointer'});
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        Object.assign(stopBtn.style, {flex: '1', padding: '6px 8px', borderRadius: '6px', border: 'none', background: '#e74c3c', color: '#fff', cursor: 'pointer'});
        row.appendChild(startBtn);
        row.appendChild(stopBtn);
        contentArea.appendChild(row);

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        Object.assign(resetBtn.style, {padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#fff', cursor: 'pointer'});
        contentArea.appendChild(resetBtn);

        
        const cfBypassBtn = document.createElement('button');
        let cfBypassEnabled = localStorage.getItem('cfBypassEnabled') === 'true';
        cfBypassBtn.textContent = cfBypassEnabled ? 'CF Bypass: On' : 'CF Bypass: Off';
        Object.assign(cfBypassBtn.style, {padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', background: cfBypassEnabled ? '#2ecc71' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px'});
        cfBypassBtn.addEventListener('click', () => {
            cfBypassEnabled = !cfBypassEnabled;
            localStorage.setItem('cfBypassEnabled', cfBypassEnabled);
            cfBypassBtn.textContent = cfBypassEnabled ? 'CF Bypass: On' : 'CF Bypass: Off';
            cfBypassBtn.style.background = cfBypassEnabled ? '#2ecc71' : 'transparent';
        });
        contentArea.appendChild(cfBypassBtn);

        // Trainer/Compound navigation input
        const trainerSection = document.createElement('div');
        trainerSection.style.display = 'flex';
        trainerSection.style.flexDirection = 'column';
        trainerSection.style.gap = '4px';
        trainerSection.style.marginTop = '4px';

        const trainerInput = document.createElement('input');
        trainerInput.type = 'text';
        trainerInput.placeholder = 'Enter Battle Name';
        Object.assign(trainerInput.style, {padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', background: '#fff', color: '#000', fontSize: '12px', width: '90%', boxSizing: 'border-box'});

        const navigateBtn = document.createElement('button');
        navigateBtn.textContent = 'Go to Trainer';
        Object.assign(navigateBtn.style, {padding: '6px 8px', borderRadius: '6px', border: 'none', background: '#3498db', color: '#fff', cursor: 'pointer', fontSize: '12px'});

        navigateBtn.addEventListener('click', () => {
            const userInput = trainerInput.value.trim();
            if (userInput) {
                const targetUrl = `https://www.delugerpg.com/battle/user/u/${encodeURIComponent(userInput)}`;
                localStorage.setItem('lastTrainerUrl', targetUrl); // Persist the URL
                window.location.href = targetUrl;
            } else {
                alert('Please enter a valid trainer or compound name.');
            }
        });

        trainerSection.appendChild(trainerInput);
        trainerSection.appendChild(navigateBtn);
        contentArea.appendChild(trainerSection);

        // Auto-refresh input
        const refreshSection = document.createElement('div');
        refreshSection.style.display = 'flex';
        refreshSection.style.flexDirection = 'column';
        refreshSection.style.gap = '4px';
        refreshSection.style.marginTop = '4px';

        const refreshInput = document.createElement('input');
        refreshInput.type = 'number';
        refreshInput.placeholder = 'Enter Refresh (min)';
        Object.assign(refreshInput.style, {padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', background: '#fff', color: '#000', fontSize: '12px', width: '90%', boxSizing: 'border-box'});

        const setRefreshBtn = document.createElement('button');
        setRefreshBtn.textContent = 'Set Auto-Refresh';
        Object.assign(setRefreshBtn.style, {padding: '6px 8px', borderRadius: '6px', border: 'none', background: '#e67e22', color: '#fff', cursor: 'pointer', fontSize: '12px'});

        setRefreshBtn.addEventListener('click', () => {
            const refreshMinutes = parseInt(refreshInput.value, 10);
            if (!isNaN(refreshMinutes) && refreshMinutes > 0) {
                const refreshMs = refreshMinutes * 60 * 1000;
                localStorage.setItem('autoRefreshInterval', refreshMs); // Persist the interval
                alert(`Page will refresh every ${refreshMinutes} minutes.`);
                setTimeout(() => {
                    const lastTrainerUrl = localStorage.getItem('lastTrainerUrl');
                    if (lastTrainerUrl) {
                        window.location.href = lastTrainerUrl;
                    } else {
                        window.location.reload();
                    }
                }, refreshMs);
            } else {
                alert('Please enter a valid refresh interval in minutes.');
            }
        });

        refreshSection.appendChild(refreshInput);
        refreshSection.appendChild(setRefreshBtn);
        contentArea.appendChild(refreshSection);

        // Restore auto-refresh on page load
        const savedRefreshMs = parseInt(localStorage.getItem('autoRefreshInterval'), 10);
        if (!isNaN(savedRefreshMs) && savedRefreshMs > 0) {
            refreshInput.value = (savedRefreshMs / 60000).toString(); // Convert ms to minutes
            setTimeout(() => {
                const lastTrainerUrl = localStorage.getItem('lastTrainerUrl');
                if (lastTrainerUrl) {
                    window.location.href = lastTrainerUrl;
                } else {
                    window.location.reload();
                }
            }, savedRefreshMs);
        }

        function updateButtons(running) {
            status.textContent = running ? 'Running' : 'Stopped';
            startBtn.disabled = running;
            stopBtn.disabled = !running;
            startBtn.style.opacity = running ? '0.6' : '1';
            stopBtn.style.opacity = !running ? '0.6' : '1';
        }

        startBtn.addEventListener('click', () => {
            setPersistedRunning(true);
            scheduleNextRun(60);
            updateButtons(true);
        });
        stopBtn.addEventListener('click', () => {
            setPersistedRunning(false);
            if (mainTimer) {
                clearTimeout(mainTimer);
                mainTimer = null;
            }
            updateButtons(false);
            console.log('AutoBattler: Stopped successfully');
        });
        resetBtn.addEventListener('click', () => {
            setBattleCount(0);
            scheduleNextHesitation();
            setPersistedRunning(false);
            if (mainTimer) {
                clearTimeout(mainTimer);
                mainTimer = null;
            }
            updateButtons(false);
            console.log('AutoBattler: Reset and stopped successfully');

            // Clear trainer/compound input
            trainerInput.value = '';
            localStorage.removeItem('lastTrainerUrl');

            // Clear auto-refresh timer
            refreshInput.value = '';
            localStorage.removeItem('autoRefreshInterval');
        });

        // Auto-scroll toggle
        const autoScrollBtn = document.createElement('button');
        let autoScrollEnabled = localStorage.getItem('autoScrollEnabled') === 'true';
        autoScrollBtn.textContent = autoScrollEnabled ? 'Auto-Scroll: On' : 'Auto-Scroll: Off';
        Object.assign(autoScrollBtn.style, {
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: autoScrollEnabled ? '#2ecc71' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
        });

        autoScrollBtn.addEventListener('click', () => {
            autoScrollEnabled = !autoScrollEnabled;
            localStorage.setItem('autoScrollEnabled', autoScrollEnabled);
            autoScrollBtn.textContent = autoScrollEnabled ? 'Auto-Scroll: On' : 'Auto-Scroll: Off';
            autoScrollBtn.style.background = autoScrollEnabled ? '#2ecc71' : 'transparent';

            if (autoScrollEnabled) {
                const scrollInterval = setInterval(() => {
                    if (!autoScrollEnabled) {
                        clearInterval(scrollInterval);
                        return;
                    }

                    
                    const attackBtn = document.querySelector('input.btn-battle_action[type="submit"][name="attack_"], input[name="attack_"], button[name="attack_"]');
                    if (attackBtn) {
                        attackBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => {
                            window.scrollBy(0, -window.innerHeight / 2);
                        }, 1000);
                    }
                }, 3000);
            }
        });

        contentArea.appendChild(autoScrollBtn);

       
        panel.appendChild(contentArea);

        
        if (autoScrollEnabled) {
            const scrollInterval = setInterval(() => {
                if (!autoScrollEnabled) {
                    clearInterval(scrollInterval);
                    return;
                }

                const attackBtn = document.querySelector('input.btn-battle_action[type="submit"][name="attack_"], input[name="attack_"], button[name="attack_"]');
                if (attackBtn) {
                    attackBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        window.scrollBy(0, -window.innerHeight / 2);
                    }, 1000);
                }
            }, 3000);
        }

        // Keyboard shortcut: Alt+D toggles start/stop
        window.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                if (mainTimer) {
                    stopBtn.click();
                } else {
                    startBtn.click();
                }
            }
        });

        document.body.appendChild(panel);
        updateButtons(isPersistedRunning());
    })();

    console.log('AutoBattler v3 loaded — Balanced mouse + hesitation active');
})();