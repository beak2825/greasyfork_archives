// ==UserScript==
// @name         Little Alchemy 2 Ultimate Mod
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Advanced mod for Little Alchemy 2 with working unlock, auto-discovery, and encyclopedia!
// @author       You
// @match        https://littlealchemy2.com/*
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553303/Little%20Alchemy%202%20Ultimate%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/553303/Little%20Alchemy%202%20Ultimate%20Mod.meta.js
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

    let autoDiscoveryInterval = null;
    let autoDiscoveryActive = false;
    let discoveredCount = 0;
    let lastDiscoveredCount = 0;

    function getVueStore() {
        const workspace = document.querySelector('#workspace');
        if (workspace && workspace.__vue__ && workspace.__vue__.$store) {
            return workspace.__vue__.$store;
        }
        return null;
    }

    function showNotification(message, duration = 3000) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notif.remove(), 300);
        }, duration);
    }

    function findAndUpdateArrays(obj, allIds, elements, path = '', arraysUpdated = []) {
        for (let key in obj) {
            const currentPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            
            if (Array.isArray(value) && value.length < 700) {
                let isElementArray = false;
                
                if (value.length > 0) {
                    const first = value[0];
                    isElementArray = typeof first === 'string' && elements[first];
                } else {
                    isElementArray = ['progress', 'discovered', 'encyclopedia', 'library', 'history'].some(name => 
                        currentPath.toLowerCase().includes(name)
                    );
                }
                
                if (isElementArray) {
                    let addedCount = 0;
                    allIds.forEach(id => {
                        if (!value.includes(id) && !elements[id].prime) {
                            value.push(id);
                            addedCount++;
                        }
                    });
                    if (addedCount > 0) {
                        arraysUpdated.push(`${currentPath} (+${addedCount})`);
                        console.log(`Added ${addedCount} elements to:`, currentPath);
                    }
                }
            } else if (value && typeof value === 'object' && !Array.isArray(value) && key !== '__ob__') {
                findAndUpdateArrays(value, allIds, elements, currentPath, arraysUpdated);
            }
        }
        return arraysUpdated;
    }

    function unlockAllElements() {
        try {
            const store = getVueStore();
            if (!store) {
                showNotification('❌ Store not found! Wait for game to load.');
                return;
            }

            console.log('=== UNLOCK ATTEMPT ===');
            const beforeCount = store.getters.totalProgress || 0;
            console.log('Before count:', beforeCount);

            const allIds = store.getters.elementsIds;
            const state = store.state;
            const elements = store.getters.elements;
            
            console.log('Searching for element arrays in state...');
            const arraysUpdated = findAndUpdateArrays(state, allIds, elements);

            setTimeout(() => {
                const afterCount = store.getters.totalProgress || 0;
                console.log('After count:', afterCount);
                const unlocked = afterCount - beforeCount;

                if (unlocked > 0) {
                    showNotification(`🎉 Unlocked ${unlocked} elements!`, 4000);
                    console.log('✅ Success! Arrays updated:', arraysUpdated);
                } else {
                    showNotification('⚠️ No new elements unlocked. Already complete?', 4000);
                }

                console.log('Final progress:', store.getters.totalProgress, '/ 720');
            }, 500);

        } catch (e) {
            console.error('Unlock error:', e);
            showNotification('❌ Unlock failed! Check console for details.');
        }
    }

    function viewGameData() {
        const store = getVueStore();
        if (!store) {
            showNotification('❌ Store not found!');
            return;
        }

        console.log('=== LITTLE ALCHEMY 2 GAME DATA ===');
        console.log('Total Discovered:', store.getters.totalProgress);
        console.log('Prime Elements:', store.state.base?.prime);
        console.log('Progress Elements:', store.state.progress);
        console.log('Encyclopedia:', store.state.encyclopedia);
        console.log('Final Elements:', store.state.base?.final);
        console.log('All Discovered:', [...(store.state.progress || []), ...(store.state.base?.prime || [])]);
        console.log('---');
        console.log('Store State Keys:', Object.keys(store.state));
        
        console.log('State Arrays:');
        for (let key in store.state) {
            if (Array.isArray(store.state[key])) {
                console.log(`  ${key}: ${store.state[key].length} items`);
            }
        }
        
        console.log('---');
        console.log('Total Available Elements:', store.getters.elementsIds?.length || 0);
        console.log('=================================');

        showNotification('📊 Game data logged to console! (F12)', 4000);
    }

    function toggleAutoDiscovery() {
        autoDiscoveryActive = !autoDiscoveryActive;
        const btn = document.getElementById('la2-auto-discovery-btn');
        
        if (autoDiscoveryActive) {
            btn.textContent = 'Auto-Discovery [ON]';
            btn.style.background = '#28a745';
            showNotification('🤖 Auto-discovery started!');
            startAutoDiscovery();
        } else {
            btn.textContent = 'Auto-Discovery [OFF]';
            btn.style.background = '#444';
            showNotification('⏸️ Auto-discovery stopped.');
            stopAutoDiscovery();
        }
    }

    function startAutoDiscovery() {
        if (autoDiscoveryInterval) return;

        discoveredCount = 0;
        const store = getVueStore();
        if (!store) {
            showNotification('❌ Store not found!');
            autoDiscoveryActive = false;
            return;
        }

        lastDiscoveredCount = store.getters.totalProgress || 0;

        autoDiscoveryInterval = setInterval(() => {
            try {
                const store = getVueStore();
                if (!store) return;

                const allElements = store.getters.elements;
                const recipes = store.getters.recipes;
                const elementIds = Object.keys(allElements);

                const element1Id = elementIds[Math.floor(Math.random() * elementIds.length)];
                const element2Id = elementIds[Math.floor(Math.random() * elementIds.length)];

                const recipeKey = [element1Id, element2Id].sort().join(',');
                
                if (recipes[recipeKey]) {
                    const result = recipes[recipeKey];
                    const childId = result.child || result;

                    const state = store.state;
                    let added = false;

                    function addToArrays(obj, path = '') {
                        for (let key in obj) {
                            const currentPath = path ? `${path}.${key}` : key;
                            const value = obj[key];
                            
                            if (Array.isArray(value) && value.length < 700) {
                                let isElementArray = false;
                                
                                if (value.length > 0) {
                                    const first = value[0];
                                    isElementArray = typeof first === 'string' && allElements[first];
                                } else {
                                    isElementArray = ['progress', 'discovered', 'encyclopedia', 'library', 'history'].some(name => 
                                        currentPath.toLowerCase().includes(name)
                                    );
                                }
                                
                                if (isElementArray) {
                                    if (!value.includes(childId) && !allElements[childId]?.prime) {
                                        value.push(childId);
                                        added = true;
                                    }
                                }
                            } else if (value && typeof value === 'object' && !Array.isArray(value) && key !== '__ob__') {
                                addToArrays(value, currentPath);
                            }
                        }
                    }

                    addToArrays(state);

                    if (added) {
                        const element1 = allElements[element1Id];
                        const element2 = allElements[element2Id];
                        const child = allElements[childId];
                        console.log(`✨ Discovered: ${child?.name || childId} from ${element1?.name || element1Id} + ${element2?.name || element2Id}`);

                        setTimeout(() => {
                            const newCount = store.getters.totalProgress || 0;
                            if (newCount > lastDiscoveredCount) {
                                discoveredCount++;
                                lastDiscoveredCount = newCount;
                                
                                const autoInfo = document.querySelector('#la2-auto-info');
                                if (autoInfo) {
                                    autoInfo.textContent = `✨ Discovered: ${discoveredCount} new elements`;
                                }
                            }
                        }, 100);
                    }
                }

            } catch (e) {
                console.log('Auto-discovery error:', e);
            }
        }, 1500);
    }

    function stopAutoDiscovery() {
        if (autoDiscoveryInterval) {
            clearInterval(autoDiscoveryInterval);
            autoDiscoveryInterval = null;
        }
    }

    function createGUI() {
        const gui = document.createElement('div');
        gui.id = 'la2-mod-gui';
        gui.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
            color: #fff;
            border: 2px solid #555;
            border-radius: 12px;
            padding: 0;
            z-index: 999998;
            font-family: Arial, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            min-width: 300px;
            max-width: 350px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 12px 15px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            user-select: none;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = '🧪 LA2 Mod v2.4';

        let isMinimized = false;
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 18px;
            line-height: 1;
        `;

        const content = document.createElement('div');
        content.id = 'la2-content';
        content.style.cssText = 'padding: 15px; max-height: 70vh; overflow-y: auto;';

        minimizeBtn.onclick = function(e) {
            e.stopPropagation();
            isMinimized = !isMinimized;
            content.style.display = isMinimized ? 'none' : 'block';
            minimizeBtn.textContent = isMinimized ? '+' : '−';
        };

        header.appendChild(minimizeBtn);
        gui.appendChild(header);
        gui.appendChild(content);

        makeDraggable(gui, header);

        const { section: unlockSection, content: unlockContent } = createCollapsibleSection('🔓 Unlock Elements', true);
        
        const unlockBtn = createButton('Unlock All Elements', unlockAllElements);
        unlockBtn.style.background = '#28a745';
        unlockBtn.style.fontSize = '14px';
        unlockContent.appendChild(unlockBtn);

        const viewDataBtn = createButton('View Game Data (Console)', viewGameData);
        viewDataBtn.style.marginTop = '8px';
        unlockContent.appendChild(viewDataBtn);

        const warningText = document.createElement('div');
        warningText.textContent = '✅ Safe unlock - persists after refresh!';
        warningText.style.cssText = 'font-size: 11px; color: #28a745; margin-top: 10px; text-align: center;';
        unlockContent.appendChild(warningText);
        
        content.appendChild(unlockSection);

        const { section: autoSection, content: autoContent } = createCollapsibleSection('🤖 Auto-Discovery', false);
        
        const autoBtn = createButton('Auto-Discovery [OFF]', toggleAutoDiscovery);
        autoBtn.id = 'la2-auto-discovery-btn';
        autoContent.appendChild(autoBtn);

        const autoInfo = document.createElement('div');
        autoInfo.id = 'la2-auto-info';
        autoInfo.textContent = 'Finds valid combinations and adds them to your discovery list';
        autoInfo.style.cssText = 'font-size: 11px; color: #aaa; margin-top: 8px; line-height: 1.4;';
        autoContent.appendChild(autoInfo);

        content.appendChild(autoSection);

        const { section: infoSection, content: infoContent } = createCollapsibleSection('ℹ️ Info', false);
        
        const infoText = document.createElement('div');
        infoText.innerHTML = `
            <div style="font-size: 12px; line-height: 1.6; color: #ccc;">
                <strong>v2.4 - Fixed All Issues!</strong><br>
                • Unlock now persists after refresh ✅<br>
                • Auto-discovery works correctly ✅<br>
                • Encyclopedia updates properly ✅<br><br>
                <em style="color: #999;">Press F12 for detailed debug info</em>
            </div>
        `;
        infoContent.appendChild(infoText);

        content.appendChild(infoSection);

        document.body.appendChild(gui);
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
        arrow.style.cssText = 'font-size: 12px;';

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

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-bottom: 5px;
            background: #444;
            color: white;
            border: 1px solid #555;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        `;
        btn.onmouseover = () => {
            btn.style.background = '#555';
            btn.style.transform = 'translateY(-1px)';
        };
        btn.onmouseout = () => {
            btn.style.background = btn.id === 'la2-auto-discovery-btn' && autoDiscoveryActive ? '#28a745' : '#444';
            btn.style.transform = 'translateY(0)';
        };
        btn.onclick = onClick;
        return btn;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    function waitForPage() {
        if (document.body && document.querySelector('#workspace')) {
            setTimeout(() => {
                createGUI();
                showNotification('✨ Little Alchemy 2 Mod v2.4 loaded!');
                
                setTimeout(() => {
                    const store = getVueStore();
                    if (store) {
                        console.log('✅ Vue store detected!');
                        console.log('Current progress:', store.getters.totalProgress, '/ 720');
                    }
                }, 1000);
            }, 2000);
        } else {
            setTimeout(waitForPage, 200);
        }
    }

    waitForPage();
})();
