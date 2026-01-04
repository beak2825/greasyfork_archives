// ==UserScript==
// @name         N1Green Tools - Script Manager
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Green Tools: Script Manager ESP with Speed & Jump Boost for Narrow One
// @author       Green Tools
// @match        https://narrow.one/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552351/N1Green%20Tools%20-%20Script%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/552351/N1Green%20Tools%20-%20Script%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPassword() {
        const part1 = [71, 114, 101, 101, 110]; 
        const part2 = [80, 64]; 
        const part3 = [115, 115, 119, 111, 114, 100]; 

        return part1.map(c => String.fromCharCode(c)).join('') +
               part2.map(c => String.fromCharCode(c)).join('') +
               part3.map(c => String.fromCharCode(c)).join('');
    }

    const validPassword = getPassword();
    let isSpeedBoostActive = false;
    let isJumpBoostActive = false;
    let isESPActive = false;
    let savedScripts = GM_getValue('savedScripts', {});
    
    function getRandomColor() {
        const colors = [
            'rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)', 'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 192, 0.9)', 'rgba(153, 102, 255, 0.9)', 'rgba(255, 159, 64, 0.9)',
            'rgba(199, 199, 199, 0.9)', 'rgba(83, 102, 255, 0.9)', 'rgba(40, 159, 64, 0.9)',
            'rgba(210, 105, 30, 0.9)', 'rgba(139, 69, 19, 0.9)', 'rgba(0, 128, 128, 0.9)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function createKeyOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'keyOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.fontSize = '30px';
        overlay.style.fontWeight = 'bold';

        const randomColor = getRandomColor();

        overlay.innerHTML = `
            <div style="text-align: center; background: ${randomColor}; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(255,255,255,0.3);">
                <h1 style="margin-bottom: 20px;">Enter the Password:</h1>
                <input id="keyInput" type="password" placeholder="Enter Password" style="font-size: 20px; padding: 10px; margin: 10px; border: 2px solid white; border-radius: 5px; background: rgba(255,255,255,0.1); color: white;"/>
                <br>
                <button id="submitKey" style="font-size: 20px; padding: 10px 20px; margin: 10px; border: none; border-radius: 5px; background: white; color: black; cursor: pointer;">Submit</button>
                <div id="errorMessage" style="color: yellow; font-size: 20px; margin-top: 10px;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('keyInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    }
    
    function verifyPassword() {
        const userInput = document.getElementById('keyInput').value;
        if (userInput === validPassword) {
            document.getElementById('keyOverlay').style.display = 'none';
            console.log('Password valid. Green Tools activated.');
            createFloatingWindow();
        } else {
            document.getElementById('errorMessage').innerText = 'Invalid password, please try again.';
        }
    }

    function initPasswordSystem() {
        document.getElementById('submitKey').addEventListener('click', verifyPassword);
    }

    function createFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'greenToolsWindow';
        floatingWindow.style.position = 'fixed';
        floatingWindow.style.top = '50px';
        floatingWindow.style.right = '50px';
        floatingWindow.style.width = '350px';
        floatingWindow.style.backgroundColor = 'rgba(0, 100, 0, 0.9)';
        floatingWindow.style.border = '2px solid #00ff00';
        floatingWindow.style.borderRadius = '10px';
        floatingWindow.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        floatingWindow.style.zIndex = '10000';
        floatingWindow.style.fontFamily = 'Arial, sans-serif';
        floatingWindow.style.color = 'white';
        floatingWindow.style.overflow = 'hidden';

        floatingWindow.innerHTML = `
            <div style="background: rgba(0, 80, 0, 0.9); padding: 10px; display: flex; justify-content: space-between; align-items: center; cursor: move; border-bottom: 1px solid #00ff00;">
                <div style="font-weight: bold; font-size: 16px;">Green Tools</div>
                <div>
                    <button id="minimizeBtn" style="background: transparent; border: none; color: white; cursor: pointer; margin-right: 5px;">−</button>
                    <button id="closeBtn" style="background: transparent; border: none; color: white; cursor: pointer;">×</button>
                </div>
            </div>
            <div id="windowContent" style="padding: 15px; max-height: 500px; overflow-y: auto;">
                <div style="margin-bottom: 15px;">
                    <h3 style="margin-top: 0; border-bottom: 1px solid #00ff00; padding-bottom: 5px;">Built-in Features</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Speed Boost</span>
                        <button id="speedToggle" style="background: #ff4444; border: none; border-radius: 15px; width: 50px; height: 25px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; background: white; border-radius: 50%; transition: left 0.3s;"></div>
                        </button>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Jump Boost</span>
                        <button id="jumpToggle" style="background: #ff4444; border: none; border-radius: 15px; width: 50px; height: 25px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; background: white; border-radius: 50%; transition: left 0.3s;"></div>
                        </button>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Player ESP</span>
                        <button id="espToggle" style="background: #ff4444; border: none; border-radius: 15px; width: 50px; height: 25px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; background: white; border-radius: 50%; transition: left 0.3s;"></div>
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <h3 style="border-bottom: 1px solid #00ff00; padding-bottom: 5px;">Custom Scripts</h3>
                    <textarea id="scriptInput" placeholder="Paste your script here..." style="width: 100%; height: 100px; background: rgba(255,255,255,0.1); color: white; border: 1px solid #00ff00; border-radius: 5px; padding: 5px; margin-bottom: 10px; resize: vertical;"></textarea>
                    <div style="display: flex; justify-content: space-between;">
                        <button id="runScript" style="background: #00aa00; border: none; border-radius: 5px; color: white; padding: 5px 10px; cursor: pointer;">Run</button>
                        <button id="saveScript" style="background: #0088cc; border: none; border-radius: 5px; color: white; padding: 5px 10px; cursor: pointer;">Save</button>
                        <input type="text" id="scriptName" placeholder="Script name" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid #00ff00; border-radius: 5px; padding: 5px; width: 100px;">
                    </div>
                </div>

                <div>
                    <h3 style="border-bottom: 1px solid #00ff00; padding-bottom: 5px;">Saved Scripts</h3>
                    <div id="savedScriptsList" style="max-height: 200px; overflow-y: auto;">
                        <!-- Saved scripts will be listed here -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(floatingWindow);
        makeDraggable(floatingWindow);

        document.getElementById('speedToggle').addEventListener('click', toggleSpeedBoost);
        document.getElementById('jumpToggle').addEventListener('click', toggleJumpBoost);
        document.getElementById('espToggle').addEventListener('click', toggleESP);
        document.getElementById('runScript').addEventListener('click', runCustomScript);
        document.getElementById('saveScript').addEventListener('click', saveCustomScript);
        document.getElementById('minimizeBtn').addEventListener('click', toggleMinimize);
        document.getElementById('closeBtn').addEventListener('click', closeWindow);

        loadSavedScripts();
    }

    function makeDraggable(element) {
        const header = element.querySelector('div');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }
    
    function toggleSpeedBoost() {
        const toggle = document.getElementById('speedToggle');
        const toggleCircle = toggle.querySelector('div');

        if (!isSpeedBoostActive) {
            toggle.style.background = '#44ff44';
            toggleCircle.style.left = '27px';
            applySpeedBoost();
            isSpeedBoostActive = true;
            showNotification('Speed Boost Activated');
        } else {
            toggle.style.background = '#ff4444';
            toggleCircle.style.left = '2px';
            removeSpeedBoost();
            isSpeedBoostActive = false;
            showNotification('Speed Boost Deactivated');
        }
    }
    
    function applySpeedBoost() {
        const targetWalkSpeed = 115;

        Object.defineProperty(Object.prototype, 'walkSpeed', {
            get() {
                return this._walkSpeed || targetWalkSpeed;
            },
            set(value) {
                this._walkSpeed = targetWalkSpeed;
                console.log('walkSpeed set to ' + this._walkSpeed);
            },
            configurable: true
        });

        Object.defineProperty(Object.prototype, 'flagWalkSpeed', {
            get() {
                return this._flagWalkSpeed || targetWalkSpeed;
            },
            set(value) {
                this._flagWalkSpeed = targetWalkSpeed;
                console.log('flagWalkSpeed set to ' + this._flagWalkSpeed);
            },
            configurable: true
        });
    }
    
    function removeSpeedBoost() {
        delete Object.prototype.walkSpeed;
        delete Object.prototype.flagWalkSpeed;
    }
    
    function toggleJumpBoost() {
        const toggle = document.getElementById('jumpToggle');
        const toggleCircle = toggle.querySelector('div');

        if (!isJumpBoostActive) {
            toggle.style.background = '#44ff44';
            toggleCircle.style.left = '27px';
            applyJumpBoost();
            isJumpBoostActive = true;
            showNotification('Jump Boost Activated');
        } else {
            toggle.style.background = '#ff4444';
            toggleCircle.style.left = '2px';
            removeJumpBoost();
            isJumpBoostActive = false;
            showNotification('Jump Boost Deactivated');
        }
    }
    
    function applyJumpBoost() {
        const targetJumpForce = 20;

        Object.defineProperty(Object.prototype, 'jumpForce', {
            get() {
                return this._jumpForce || targetJumpForce;
            },
            set(value) {
                this._jumpForce = targetJumpForce;
                console.log('jumpForce set to ' + this._jumpForce);
            },
            configurable: true
        });
    }

    function removeJumpBoost() {
        delete Object.prototype.jumpForce;
    }
    function toggleESP() {
        const toggle = document.getElementById('espToggle');
        const toggleCircle = toggle.querySelector('div');

        if (!isESPActive) {
            toggle.style.background = '#44ff44';
            toggleCircle.style.left = '27px';
            applyESP();
            isESPActive = true;
            showNotification('Player ESP Activated');
        } else {
            toggle.style.background = '#ff4444';
            toggleCircle.style.left = '2px';
            removeESP();
            isESPActive = false;
            showNotification('Player ESP Deactivated');
        }
    }

    function applyESP() {
        if (!window.originalNameProperty) {
            window.originalNameProperty = Object.getOwnPropertyDescriptor(Object.prototype, 'name');
        }
        Object.defineProperty(Object.prototype, 'name', {
            get() {
                return this._name;
            },
            set(v) {
                this._name = v;
                if (v === 'player') {
                    removeDepthTest(this.material);
                }
            },
            configurable: true
        });
        try {
            const objects = Object.values(window).filter(obj => obj && typeof obj === 'object');
            objects.forEach(obj => {
                if (obj.name === 'player') {
                    removeDepthTest(obj.material);
                }
            });
        } catch (e) {
            console.log('ESP: Re-triggering player objects');
        }
    }

    function removeESP() {
        if (window.originalNameProperty) {
            Object.defineProperty(Object.prototype, 'name', window.originalNameProperty);
            delete window.originalNameProperty;
        } else {
            delete Object.prototype.name;
        }
        try {
            const objects = Object.values(window).filter(obj => obj && typeof obj === 'object');
            objects.forEach(obj => {
                if (obj.material) {
                    restoreDepthTest(obj.material);
                }
            });
        } catch (e) {
            console.log('ESP: Restoring depth test');
        }
    }

    function removeDepthTest(material) {
        if (!material) return;
        if (Array.isArray(material)) {
            material.forEach(mat => {
                if (mat && typeof mat === 'object') {
                    mat.depthTest = false;
                    mat._depthTestModified = true;
                }
            });
        } else if (typeof material === 'object') {
            material.depthTest = false;
            material._depthTestModified = true;
        }
    }

    function restoreDepthTest(material) {
        if (!material) return;
        if (Array.isArray(material)) {
            material.forEach(mat => {
                if (mat && mat._depthTestModified) {
                    mat.depthTest = true;
                    delete mat._depthTestModified;
                }
            });
        } else if (material._depthTestModified) {
            material.depthTest = true;
            delete material._depthTestModified;
        }
    }

    function runCustomScript() {
        const scriptCode = document.getElementById('scriptInput').value;
        if (scriptCode.trim()) {
            try {
                eval(scriptCode);
                showNotification('Custom script executed');
            } catch (error) {
                showNotification('Error in script: ' + error.message, true);
            }
        } else {
            showNotification('Please enter a script', true);
        }
    }
    
    function saveCustomScript() {
        const scriptCode = document.getElementById('scriptInput').value;
        const scriptName = document.getElementById('scriptName').value;

        if (scriptCode.trim() && scriptName.trim()) {
            savedScripts[scriptName] = scriptCode;
            GM_setValue('savedScripts', savedScripts);
            loadSavedScripts();
            showNotification('Script saved: ' + scriptName);
            document.getElementById('scriptName').value = '';
        } else {
            showNotification('Please enter both script and name', true);
        }
    }
    
    function loadSavedScripts() {
        const savedScriptsList = document.getElementById('savedScriptsList');
        savedScriptsList.innerHTML = '';

        for (const name in savedScripts) {
            const scriptItem = document.createElement('div');
            scriptItem.style.display = 'flex';
            scriptItem.style.justifyContent = 'space-between';
            scriptItem.style.alignItems = 'center';
            scriptItem.style.marginBottom = '5px';
            scriptItem.style.padding = '5px';
            scriptItem.style.backgroundColor = 'rgba(255,255,255,0.1)';
            scriptItem.style.borderRadius = '3px';

            scriptItem.innerHTML = `
                <span>${name}</span>
                <div>
                    <button class="run-saved-script" data-name="${name}" style="background: #00aa00; border: none; border-radius: 3px; color: white; padding: 2px 8px; margin-right: 5px; cursor: pointer; font-size: 12px;">Run</button>
                    <button class="delete-script" data-name="${name}" style="background: #ff4444; border: none; border-radius: 3px; color: white; padding: 2px 8px; cursor: pointer; font-size: 12px;">Delete</button>
                </div>
            `;

            savedScriptsList.appendChild(scriptItem);
        }
        
        document.querySelectorAll('.run-saved-script').forEach(button => {
            button.addEventListener('click', function() {
                const scriptName = this.getAttribute('data-name');
                try {
                    eval(savedScripts[scriptName]);
                    showNotification('Script executed: ' + scriptName);
                } catch (error) {
                    showNotification('Error in script: ' + error.message, true);
                }
            });
        });

        document.querySelectorAll('.delete-script').forEach(button => {
            button.addEventListener('click', function() {
                const scriptName = this.getAttribute('data-name');
                delete savedScripts[scriptName];
                GM_setValue('savedScripts', savedScripts);
                loadSavedScripts();
                showNotification('Script deleted: ' + scriptName);
            });
        });
    }
    
    function toggleMinimize() {
        const content = document.getElementById('windowContent');
        if (content.style.display === 'none') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    }
    
    function closeWindow() {
        document.getElementById('greenToolsWindow').style.display = 'none';
        showNotification('Green Tools minimized to system tray');
        const reopenBtn = document.createElement('div');
        reopenBtn.innerHTML = 'GT';
        reopenBtn.style.position = 'fixed';
        reopenBtn.style.bottom = '10px';
        reopenBtn.style.right = '10px';
        reopenBtn.style.width = '30px';
        reopenBtn.style.height = '30px';
        reopenBtn.style.backgroundColor = 'rgba(0, 100, 0, 0.9)';
        reopenBtn.style.border = '1px solid #00ff00';
        reopenBtn.style.borderRadius = '50%';
        reopenBtn.style.display = 'flex';
        reopenBtn.style.alignItems = 'center';
        reopenBtn.style.justifyContent = 'center';
        reopenBtn.style.color = 'white';
        reopenBtn.style.fontSize = '12px';
        reopenBtn.style.fontWeight = 'bold';
        reopenBtn.style.cursor = 'pointer';
        reopenBtn.style.zIndex = '10000';
        reopenBtn.id = 'greenToolsReopen';

        reopenBtn.addEventListener('click', function() {
            document.getElementById('greenToolsWindow').style.display = 'block';
            this.remove();
        });

        document.body.appendChild(reopenBtn);
    }
    
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10001';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    console.log(`
  ____                                  _____                   _
 / ___|  _ __    ___    ___   _ __     |_   _|   ___     ___   | |  ___
| |  _  | '__|  / _ \\  / _ \\ | '_ \\      | |    / _ \\   / _ \\  | | / __|
| |_| | | |    |  __/ |  __/ | | | |     | |   | (_) | | (_) | | | \\__ \\
 \\____| |_|     \\___|  \\___| |_| |_|     |_|    \\___/   \\___/  |_| |___/

Green Tools - Script Manager for Narrow One
    `);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const checkOverlay = setInterval(() => {
            if (!document.getElementById('keyOverlay')) {
                createKeyOverlay();
                initPasswordSystem();
            }
        }, 1000);
        setTimeout(() => {
            clearInterval(checkOverlay);
        }, 10000);
        createKeyOverlay();
        initPasswordSystem();
    }
})();