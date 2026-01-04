// ==UserScript==
// @name         Cookie Clicker Ultimate Mod Suite
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Complete Cookie Clicker mod with draggable GUI, auto-features, event spawner, building editor, and prestige manager
// @author       notfamous
// @match        https://orteil.dashnet.org/cookieclicker/*
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552927/Cookie%20Clicker%20Ultimate%20Mod%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/552927/Cookie%20Clicker%20Ultimate%20Mod%20Suite.meta.js
// ==/UserScript==

/*
    This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
    To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/

    You are free to share and adapt this code, but:
    - You must give appropriate credit.
    - You may not use this work for commercial purposes.
*/

(function() {
    'use strict';

    let speed = 1;
    const baseIncrement = 16.67;
    let fakeNow = Date.now();
    let autoGoldenCookie = false;
    let smartAutoBuyer = false;
    let autoClickCookie = false;
    let autoSpawnGolden = false;
    let goldenCookieInterval = null;
    let autoBuyerInterval = null;
    let autoClickInterval = null;
    let autoSpawnInterval = null;
    let goldenSpawnRate = 5000;
    let autoClickRate = 100;
    let isMinimized = false;

    const realDateNow = Date.now.bind(Date);

    Date.now = function() {
        fakeNow += speed * baseIncrement;
        return Math.floor(fakeNow);
    };

    function showNotification(message, duration = 3000) {
        let notifContainer = document.getElementById('modNotifications');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.id = 'modNotifications';
            notifContainer.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 99999;
                pointer-events: none;
            `;
            document.body.appendChild(notifContainer);
        }

        const notif = document.createElement('div');
        notif.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-family: sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
            pointer-events: auto;
        `;
        notif.textContent = message;
        notifContainer.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notif.remove(), 300);
        }, duration);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateY(-100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    function waitForGame() {
        if (typeof Game !== 'undefined' && Game.ready) {
            setupGUI();
            initializeFeatures();
        } else {
            setTimeout(waitForGame, 1000);
        }
    }

    function initializeFeatures() {
        console.log('Cookie Clicker Ultimate Mod Loaded');
    }

    function toggleAutoGoldenCookie() {
        autoGoldenCookie = !autoGoldenCookie;
        if (autoGoldenCookie) {
            goldenCookieInterval = setInterval(() => {
                if (Game.shimmers && Game.shimmers.length > 0) {
                    for (let shimmer of Game.shimmers) {
                        if (shimmer.type === 'golden') {
                            shimmer.pop();
                        }
                    }
                }
            }, 100);
        } else {
            if (goldenCookieInterval) {
                clearInterval(goldenCookieInterval);
                goldenCookieInterval = null;
            }
        }
        return autoGoldenCookie;
    }

    function toggleAutoSpawnGolden() {
        autoSpawnGolden = !autoSpawnGolden;
        if (autoSpawnGolden) {
            autoSpawnInterval = setInterval(() => {
                spawnGoldenCookie();
            }, goldenSpawnRate);
            showNotification(`Auto-spawning golden cookies every ${goldenSpawnRate / 1000}s`);
        } else {
            if (autoSpawnInterval) {
                clearInterval(autoSpawnInterval);
                autoSpawnInterval = null;
            }
        }
        return autoSpawnGolden;
    }

    function toggleAutoClickCookie() {
        autoClickCookie = !autoClickCookie;
        if (autoClickCookie) {
            autoClickInterval = setInterval(() => {
                Game.ClickCookie();
            }, autoClickRate);
            showNotification(`Auto-clicking cookie every ${autoClickRate}ms`);
        } else {
            if (autoClickInterval) {
                clearInterval(autoClickInterval);
                autoClickInterval = null;
            }
        }
        return autoClickCookie;
    }

    function spawnGoldenCookie() {
        const newShimmer = new Game.shimmer('golden');
        showNotification('Golden cookie spawned!');
    }

    function calculateEfficiency(object) {
        if (!object || object.locked) return -1;
        const price = object.getPrice ? object.getPrice() : object.price;
        if (price > Game.cookies) return -1;
        
        let gain = 0;
        if (object.cps) {
            gain = object.cps(object);
        } else if (object.type === 'upgrade') {
            const before = Game.cookiesPs;
            object.bought = 1;
            Game.CalculateGains();
            const after = Game.cookiesPs;
            gain = after - before;
            object.bought = 0;
            Game.CalculateGains();
        }
        
        return gain > 0 ? gain / price : -1;
    }

    function toggleSmartAutoBuyer() {
        smartAutoBuyer = !smartAutoBuyer;
        if (smartAutoBuyer) {
            autoBuyerInterval = setInterval(() => {
                let bestObject = null;
                let bestEfficiency = -1;

                for (let i in Game.Objects) {
                    const obj = Game.Objects[i];
                    const efficiency = calculateEfficiency(obj);
                    if (efficiency > bestEfficiency) {
                        bestEfficiency = efficiency;
                        bestObject = obj;
                    }
                }

                for (let i in Game.Upgrades) {
                    const upgrade = Game.Upgrades[i];
                    if (!upgrade.bought && !upgrade.unlocked) continue;
                    if (upgrade.bought) continue;
                    
                    const price = upgrade.getPrice();
                    if (price <= Game.cookies) {
                        const efficiency = calculateEfficiency(upgrade);
                        if (efficiency > bestEfficiency) {
                            bestEfficiency = efficiency;
                            bestObject = upgrade;
                        }
                    }
                }

                if (bestObject && bestEfficiency > 0) {
                    if (bestObject.buy) {
                        bestObject.buy();
                    } else if (bestObject.buyFunction) {
                        bestObject.buyFunction();
                    }
                }
            }, 1000);
        } else {
            if (autoBuyerInterval) {
                clearInterval(autoBuyerInterval);
                autoBuyerInterval = null;
            }
        }
        return smartAutoBuyer;
    }

    function unlockAllAchievements() {
        if (typeof Game === 'undefined' || !Game.ready) {
            showNotification('Game not ready yet!');
            return;
        }
        
        let count = 0;
        for (let i in Game.Achievements) {
            if (!Game.Achievements[i].won) {
                Game.Win(Game.Achievements[i].name);
                count++;
            }
        }
        showNotification(`Unlocked ${count} achievements!`);
    }

    function timeWarp(hours) {
        if (typeof Game === 'undefined' || !Game.ready) {
            showNotification('Game not ready yet!');
            return;
        }

        const hoursNum = parseFloat(hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
            showNotification('Please enter a valid number of hours');
            return;
        }

        const cookiesPerSecond = Game.cookiesPs;
        const secondsToSimulate = hoursNum * 3600;
        const cookiesToAdd = cookiesPerSecond * secondsToSimulate;

        Game.cookies += cookiesToAdd;
        Game.cookiesEarned += cookiesToAdd;

        for (let i in Game.Objects) {
            const obj = Game.Objects[i];
            if (obj.amount > 0) {
                obj.totalCookies += obj.storedTotalCps * secondsToSimulate;
            }
        }

        showNotification(`Time warped ${hoursNum} hours! Added ${Beautify(cookiesToAdd)} cookies`);
    }

    function setLumps(amount) {
        const val = parseFloat(amount);
        if (!isNaN(val) && val >= 0) {
            Game.lumps = val;
            Game.lumpsTotal = Math.max(Game.lumpsTotal, val);
            showNotification(`Sugar lumps set to ${val}`);
        } else {
            showNotification('Please enter a valid number');
        }
    }

    function reincarnateKeepProgress() {
        if (typeof Game === 'undefined' || !Game.ready) {
            showNotification('Game not ready yet!');
            return;
        }

        const savedState = {
            cookies: Game.cookies,
            cookiesEarned: Game.cookiesEarned,
            cookieClicks: Game.cookieClicks,
            goldenClicks: Game.goldenClicks,
            handmadeCookies: Game.handmadeCookies,
            buildings: {},
            upgrades: [],
            achievements: []
        };

        for (let i in Game.Objects) {
            savedState.buildings[i] = {
                amount: Game.Objects[i].amount,
                bought: Game.Objects[i].bought,
                totalCookies: Game.Objects[i].totalCookies
            };
        }

        for (let i in Game.Upgrades) {
            if (Game.Upgrades[i].bought) {
                savedState.upgrades.push(i);
            }
        }

        for (let i in Game.Achievements) {
            if (Game.Achievements[i].won) {
                savedState.achievements.push(i);
            }
        }

        const prestigeGain = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
        const chipGain = prestigeGain - Game.prestige;

        Game.prestige = prestigeGain;
        Game.heavenlyChips += chipGain;
        Game.heavenlyChipsSpent = 0;

        Game.cookies = savedState.cookies;
        Game.cookiesEarned = savedState.cookiesEarned;
        Game.cookieClicks = savedState.cookieClicks;
        Game.goldenClicks = savedState.goldenClicks;
        Game.handmadeCookies = savedState.handmadeCookies;

        for (let i in savedState.buildings) {
            if (Game.Objects[i]) {
                Game.Objects[i].amount = savedState.buildings[i].amount;
                Game.Objects[i].bought = savedState.buildings[i].bought;
                Game.Objects[i].totalCookies = savedState.buildings[i].totalCookies;
            }
        }

        for (let upgName of savedState.upgrades) {
            if (Game.Upgrades[upgName]) {
                if (!Game.Upgrades[upgName].unlocked) {
                    Game.Upgrades[upgName].unlock();
                }
                if (!Game.Upgrades[upgName].bought) {
                    Game.Upgrades[upgName].bought = 1;
                }
            }
        }

        for (let achName of savedState.achievements) {
            if (Game.Achievements[achName] && !Game.Achievements[achName].won) {
                Game.Win(achName);
            }
        }

        Game.CalculateGains();
        Game.RebuildUpgrades();
        
        showNotification(`Gained ${chipGain} prestige! All progress kept!`);
    }

    function triggerBuff(buffType, duration = 77) {
        if (typeof Game === 'undefined' || !Game.ready) {
            showNotification('Game not ready yet!');
            return;
        }

        let buffName = '';
        let mult = 1;

        switch(buffType) {
            case 'frenzy':
                buffName = 'Frenzy';
                mult = 7;
                Game.gainBuff('frenzy', duration, mult);
                break;
            case 'clickfrenzy':
                buffName = 'Click Frenzy';
                mult = 777;
                Game.gainBuff('click frenzy', duration, mult);
                break;
            case 'dragonflight':
                buffName = 'Dragonflight';
                mult = 1111;
                Game.gainBuff('dragonflight', duration, mult);
                break;
            case 'building':
                buffName = 'Building Special';
                Game.gainBuff('building buff', duration, 1);
                break;
            default:
                showNotification('Unknown buff type');
                return;
        }

        showNotification(`${buffName} activated for ${duration} seconds!`);
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        
        handle.style.cursor = 'move';
        handle.style.userSelect = 'none';

        handle.addEventListener('mousedown', dragMouseDown, false);

        function dragMouseDown(e) {
            if (e.target.tagName === 'BUTTON') return;
            
            e.preventDefault();
            e.stopPropagation();
            isDragging = false;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.addEventListener('mouseup', closeDragElement, false);
            document.addEventListener('mousemove', elementDrag, false);
        }

        function elementDrag(e) {
            e.preventDefault();
            isDragging = true;
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }

        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement, false);
            document.removeEventListener('mousemove', elementDrag, false);
        }
    }

    function setupGUI() {
        const gui = document.createElement('div');
        gui.id = 'cookieModGUI';
        gui.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0;
            background-color: #222;
            color: #fff;
            border: 2px solid #555;
            border-radius: 8px;
            z-index: 9999;
            font-family: sans-serif;
            font-size: 14px;
            min-width: 280px;
            max-height: 90vh;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            padding: 10px 15px;
            border-bottom: 2px solid #555;
            background: #333;
            border-radius: 6px 6px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = '🍪 Cookie Mod Suite';
        header.appendChild(titleSpan);

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = `
            background: #444;
            border: 1px solid #666;
            color: #fff;
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 18px;
            line-height: 1;
        `;
        
        const content = document.createElement('div');
        content.id = 'modContent';
        content.style.cssText = 'padding: 15px; max-height: 80vh; overflow-y: auto;';

        minimizeBtn.onclick = function(e) {
            e.stopPropagation();
            isMinimized = !isMinimized;
            if (isMinimized) {
                content.style.display = 'none';
                minimizeBtn.textContent = '+';
                gui.style.minWidth = '180px';
            } else {
                content.style.display = 'block';
                minimizeBtn.textContent = '−';
                gui.style.minWidth = '280px';
            }
        };

        header.appendChild(minimizeBtn);
        gui.appendChild(header);
        gui.appendChild(content);

        makeDraggable(gui, header);

        const { section: coreSection, content: coreContent } = createCollapsibleSection('⚙️ Core Settings', true);
        
        const cookieInput = createInput('number', 'Enter cookies');
        const cookieBtn = createButton('Set Cookies', () => {
            const val = parseFloat(cookieInput.value);
            if (!isNaN(val)) {
                Game.cookies = val;
                showNotification('Cookies set to ' + Beautify(val));
            } else {
                showNotification('Please enter a valid number');
            }
        });
        coreContent.appendChild(cookieInput);
        coreContent.appendChild(cookieBtn);
        
        const lumpInput = createInput('number', 'Enter lumps');
        lumpInput.style.marginTop = '10px';
        const lumpBtn = createButton('Set Sugar Lumps', () => setLumps(lumpInput.value));
        coreContent.appendChild(lumpInput);
        coreContent.appendChild(lumpBtn);
        
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Game Speed: 1.0x';
        speedLabel.style.cssText = 'display: block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;';
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '1';
        speedSlider.max = '10';
        speedSlider.value = '1';
        speedSlider.step = '0.1';
        speedSlider.style.cssText = 'width: 100%; cursor: pointer;';
        speedSlider.oninput = function() {
            speed = parseFloat(speedSlider.value);
            speedLabel.textContent = `Game Speed: ${speed.toFixed(1)}x`;
        };
        coreContent.appendChild(speedLabel);
        coreContent.appendChild(speedSlider);
        content.appendChild(coreSection);

        const { section: autoSection, content: autoContent } = createCollapsibleSection('🤖 Auto Features', false);
        
        const autoClickToggle = createToggleButton('Auto Click Cookie [OFF]', toggleAutoClickCookie);
        autoContent.appendChild(autoClickToggle);
        const clickRateInput = createInput('number', 'Click interval (ms)', autoClickRate);
        clickRateInput.style.width = '100%';
        clickRateInput.style.marginTop = '5px';
        clickRateInput.onchange = function() {
            const newRate = parseInt(clickRateInput.value);
            if (!isNaN(newRate) && newRate >= 10) {
                autoClickRate = newRate;
                if (autoClickCookie) {
                    clearInterval(autoClickInterval);
                    autoClickInterval = setInterval(() => Game.ClickCookie(), autoClickRate);
                }
                showNotification(`Click interval set to ${autoClickRate}ms`);
            }
        };
        autoContent.appendChild(clickRateInput);
        
        const autoBuyerBtn = createToggleButton('Smart Auto-Buyer [OFF]', toggleSmartAutoBuyer);
        autoBuyerBtn.style.marginTop = '10px';
        autoContent.appendChild(autoBuyerBtn);
        content.appendChild(autoSection);

        const { section: goldenSection, content: goldenContent } = createCollapsibleSection('🔥 Golden Cookies', false);
        
        const spawnGoldenBtn = createButton('Spawn Golden Cookie', spawnGoldenCookie);
        goldenContent.appendChild(spawnGoldenBtn);
        
        const autoClickGolden = createToggleButton('Auto Click Golden [OFF]', toggleAutoGoldenCookie);
        autoClickGolden.style.marginTop = '5px';
        goldenContent.appendChild(autoClickGolden);
        
        const autoSpawnGolden = createToggleButton('Auto Spawn Golden [OFF]', toggleAutoSpawnGolden);
        autoSpawnGolden.style.marginTop = '5px';
        goldenContent.appendChild(autoSpawnGolden);
        
        const spawnRateInput = createInput('number', 'Auto-spawn interval (ms)', goldenSpawnRate);
        spawnRateInput.style.width = '100%';
        spawnRateInput.style.marginTop = '5px';
        spawnRateInput.onchange = function() {
            const newRate = parseInt(spawnRateInput.value);
            if (!isNaN(newRate) && newRate >= 100) {
                goldenSpawnRate = newRate;
                if (autoSpawnGolden) {
                    clearInterval(autoSpawnInterval);
                    autoSpawnInterval = setInterval(spawnGoldenCookie, goldenSpawnRate);
                }
                showNotification(`Spawn interval set to ${goldenSpawnRate}ms`);
            }
        };
        goldenContent.appendChild(spawnRateInput);
        content.appendChild(goldenSection);

        const { section: eventSection, content: eventContent } = createCollapsibleSection('✨ Event Spawner', false);
        
        const eventButtons = [
            { name: 'Frenzy', type: 'frenzy' },
            { name: 'Click Frenzy', type: 'clickfrenzy' },
            { name: 'Dragonflight', type: 'dragonflight' },
            { name: 'Building Special', type: 'building' }
        ];
        eventButtons.forEach(event => {
            const btn = createButton(event.name, () => triggerBuff(event.type));
            btn.style.marginBottom = '5px';
            eventContent.appendChild(btn);
        });
        content.appendChild(eventSection);

        const { section: editorsSection, content: editorsContent } = createCollapsibleSection('🏗️ Editors', false);
        
        const buildingLabel = document.createElement('div');
        buildingLabel.textContent = 'Building Editor';
        buildingLabel.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #aaa;';
        editorsContent.appendChild(buildingLabel);
        
        const buildingContainer = document.createElement('div');
        buildingContainer.style.cssText = 'max-height: 200px; overflow-y: auto; margin-bottom: 15px; padding: 5px; background: #1a1a1a; border-radius: 3px;';
        
        for (let i in Game.Objects) {
            const obj = Game.Objects[i];
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px; gap: 5px;';
            
            const label = document.createElement('span');
            label.textContent = obj.name;
            label.style.cssText = 'flex: 1; font-size: 12px;';
            
            const input = createInput('number', '0', obj.amount);
            input.style.width = '60px';
            input.style.fontSize = '12px';
            
            const setBtn = document.createElement('button');
            setBtn.textContent = 'Set';
            setBtn.style.cssText = 'padding: 3px 8px; font-size: 11px; cursor: pointer; background: #444; color: #fff; border: 1px solid #555; border-radius: 3px;';
            setBtn.onclick = function() {
                const val = parseInt(input.value);
                if (!isNaN(val) && val >= 0) {
                    obj.amount = val;
                    Game.CalculateGains();
                    showNotification(`${obj.name} set to ${val}`);
                }
            };
            
            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(setBtn);
            buildingContainer.appendChild(row);
        }
        editorsContent.appendChild(buildingContainer);
        
        const prestigeLabel = document.createElement('div');
        prestigeLabel.textContent = 'Prestige Manager';
        prestigeLabel.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #aaa;';
        editorsContent.appendChild(prestigeLabel);
        
        const prestigeInput = createInput('number', 'Prestige level');
        const prestigeBtn = createButton('Set Prestige', () => {
            const val = parseFloat(prestigeInput.value);
            if (!isNaN(val) && val >= 0) {
                Game.prestige = val;
                Game.CalculateGains();
                showNotification(`Prestige set to ${val}`);
            }
        });
        editorsContent.appendChild(prestigeInput);
        editorsContent.appendChild(prestigeBtn);
        
        const chipsInput = createInput('number', 'Heavenly chips');
        chipsInput.style.marginTop = '10px';
        const chipsBtn = createButton('Add Chips', () => {
            const val = parseFloat(chipsInput.value);
            if (!isNaN(val) && val > 0) {
                Game.heavenlyChips += val;
                Game.heavenlyChipsSpent += val;
                showNotification(`Added ${Beautify(val)} heavenly chips`);
            }
        });
        editorsContent.appendChild(chipsInput);
        editorsContent.appendChild(chipsBtn);
        content.appendChild(editorsSection);

        const { section: timeWarpSection, content: timeWarpContent } = createCollapsibleSection('🌌 Time Warp', false);
        
        const timeWarpInput = createInput('number', 'Hours to simulate', 1);
        const timeWarpBtn = createButton('Warp Time', () => timeWarp(timeWarpInput.value));
        timeWarpContent.appendChild(timeWarpInput);
        timeWarpContent.appendChild(timeWarpBtn);
        
        const quickWarpDiv = document.createElement('div');
        quickWarpDiv.style.cssText = 'margin-top: 10px; display: flex; gap: 5px;';
        [1, 8, 24].forEach(hours => {
            const btn = createButton(`${hours}h`, () => timeWarp(hours));
            btn.style.flex = '1';
            btn.style.fontSize = '11px';
            quickWarpDiv.appendChild(btn);
        });
        timeWarpContent.appendChild(quickWarpDiv);
        content.appendChild(timeWarpSection);

        const { section: miscSection, content: miscContent } = createCollapsibleSection('🎯 Miscellaneous', false);
        
        const achievementBtn = createButton('Unlock All Achievements', unlockAllAchievements);
        miscContent.appendChild(achievementBtn);
        
        const reincarnateBtn = createButton('Reincarnate (Keep Progress)', reincarnateKeepProgress);
        reincarnateBtn.style.background = '#c42';
        reincarnateBtn.style.marginTop = '10px';
        miscContent.appendChild(reincarnateBtn);
        content.appendChild(miscSection);

        document.body.appendChild(gui);
    }

    function createInput(type, placeholder, value = '') {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.value = value;
        input.style.cssText = 'width: 140px; margin-right: 5px; padding: 5px; border-radius: 3px; border: 1px solid #555; background: #333; color: #fff;';
        return input;
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 5px; cursor: pointer; border-radius: 3px; border: 1px solid #555; background: #444; color: #fff; font-weight: bold;';
        btn.onclick = onClick;
        return btn;
    }

    function createToggleButton(text, toggleFunction) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 5px; cursor: pointer; border-radius: 3px; border: 1px solid #555; background: #444; color: #fff; font-weight: bold;';
        
        btn.onclick = function() {
            const state = toggleFunction();
            const baseText = text.replace(/\s*\[(ON|OFF)\]/, '');
            btn.textContent = baseText + (state ? ' [ON]' : ' [OFF]');
            btn.style.background = state ? '#2a5' : '#444';
        };
        
        return btn;
    }

    function createDivider() {
        const div = document.createElement('div');
        div.style.cssText = 'border-top: 1px solid #555; margin: 15px 0;';
        return div;
    }

    function createCollapsibleSection(title, isExpanded = false) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 10px; border: 1px solid #555; border-radius: 5px; background: #2a2a2a;';

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px 15px;
            cursor: pointer;
            user-select: none;
            background: #333;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            transition: background 0.2s;
        `;
        header.onmouseover = () => header.style.background = '#3a3a3a';
        header.onmouseout = () => header.style.background = '#333';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;

        const arrow = document.createElement('span');
        arrow.textContent = isExpanded ? '▼' : '▶';
        arrow.style.cssText = 'font-size: 12px; transition: transform 0.2s;';

        header.appendChild(titleSpan);
        header.appendChild(arrow);

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 10px 15px;
            display: ${isExpanded ? 'block' : 'none'};
        `;

        header.onclick = function(e) {
            e.stopPropagation();
            const isNowExpanded = content.style.display === 'none';
            content.style.display = isNowExpanded ? 'block' : 'none';
            arrow.textContent = isNowExpanded ? '▼' : '▶';
        };

        section.appendChild(header);
        section.appendChild(content);

        return { section, content };
    }

    waitForGame();
})();
