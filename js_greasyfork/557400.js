// ==UserScript==
// @name         Thunder Virtual Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A highly customizable virtual controller for Xbox Cloud Gaming.
// @author       Navneetkrh
// @license MIT
// @match        https://www.xbox.com/*/play*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557400/Thunder%20Virtual%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/557400/Thunder%20Virtual%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Thunder Controller] v1.0 Loaded.");

    // --- 1. CONFIGURATION ---
    const DEFAULT_CONFIG = {
        // Visuals
        opacity: 1.0,        
        scale: 1.0,

        // Vibration
        vibrationEnabled: true,
        vibrationStrength: 1.0,

        // POSITIONS (Global Groups)
        leftX: 40, leftY: 40,
        rightX: 40, rightY: 40,
        centerY: 20,

        // INDIVIDUAL OFFSETS
        off_stick_x: 0, off_stick_y: 0,
        off_dpad_x: 0, off_dpad_y: 0,
        off_ls_x: 0, off_ls_y: 0,
        off_lt_x: 0, off_lt_y: 0,
        off_lb_x: 0, off_lb_y: 0,
        off_view_x: 0, off_view_y: 0,

        off_abxy_x: 0, off_abxy_y: 0,
        off_rs_x: 0, off_rs_y: 0,
        off_rt_x: 0, off_rt_y: 0,
        off_rb_x: 0, off_rb_y: 0,
        off_menu_x: 0, off_menu_y: 0,
        
        off_guide_x: 0, off_guide_y: 0,

        // Touch
        swipeSensX: 15.0, 
        swipeSensY: 15.0,
        
        // Physics
        deadzoneCounterweight: 0.15, 
        noiseGate: 0.02,             

        // Gyro
        gyroEnabled: false,
        gyroSensX: 1.5,
        gyroSensY: 1.5,
        invertGyroX: true,
        invertGyroY: false,
        
        // Tuning
        deadzone: 0.10,
        responseCurve: 1.0
    };

    let config = { ...DEFAULT_CONFIG };
    let activeTab = 'Layout'; 
    let isEditing = false;

    const ID_MAP = {
        'elem-stick': ['off_stick_x', 'off_stick_y'],
        'grp-dpad':   ['off_dpad_x', 'off_dpad_y'],
        'btn-10':     ['off_ls_x', 'off_ls_y'],
        'btn-6':      ['off_lt_x', 'off_lt_y'], 
        'btn-4':      ['off_lb_x', 'off_lb_y'], 
        'btn-8':      ['off_view_x', 'off_view_y'],
        'grp-abxy':   ['off_abxy_x', 'off_abxy_y'],
        'btn-11':     ['off_rs_x', 'off_rs_y'],
        'btn-7':      ['off_rt_x', 'off_rt_y'], 
        'btn-5':      ['off_rb_x', 'off_rb_y'], 
        'btn-9':      ['off_menu_x', 'off_menu_y'],
        'btn-16':     ['off_guide_x', 'off_guide_y']
    };

    try {
        const saved = localStorage.getItem("bx-controller-v33-2");
        if (saved) config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) { console.error(e); }

    function saveConfig() {
        localStorage.setItem("bx-controller-v33-2", JSON.stringify(config));
        applyLayout();
    }

    // --- 2. CONTROLLER EMULATION ---
    const virtualGamepad = {
        id: "Xbox 360 Controller (Standard)",
        index: 0, 
        connected: true, 
        timestamp: 0, 
        mapping: "standard",
        axes: [0, 0, 0, 0], 
        buttons: new Array(17).fill(null).map(() => ({ pressed: false, value: 0 })),
        
        vibrationActuator: {
            type: "dual-rumble",
            playEffect: (type, params) => {
                if (!config.vibrationEnabled || !navigator.vibrate) return Promise.resolve();
                const intensity = Math.max(params.weakMagnitude || 0, params.strongMagnitude || 0);
                if (intensity > 0.05) {
                    const scaledIntensity = intensity * config.vibrationStrength;
                    if (scaledIntensity > 0.1) navigator.vibrate(Math.min(params.duration, 200)); 
                } else {
                    navigator.vibrate(0);
                }
                return Promise.resolve("success");
            },
            reset: () => {
                if (navigator.vibrate) navigator.vibrate(0);
                return Promise.resolve("success");
            }
        }
    };

    const originalGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function() { return [virtualGamepad, null, null, null]; };

    function triggerConnectionEvent() {
        const event = new Event("gamepadconnected");
        event.gamepad = virtualGamepad;
        window.dispatchEvent(event);
        console.log("[Thunder Controller] Connected.");
    }
    
    if (document.readyState === "complete") {
        triggerConnectionEvent();
    } else {
        window.addEventListener('load', triggerConnectionEvent);
    }
    setTimeout(triggerConnectionEvent, 3000);


    // --- 3. INPUT STATE ---
    let inputState = {
        touchX: 0, touchY: 0,
        gyroX: 0, gyroY: 0,
        lastTouchX: null, lastTouchY: null,
        stopTimeoutId: null
    };


    // --- 4. PHYSICS ENGINE ---
    function applyPhysics(x, y) {
        if (Math.abs(x) < config.noiseGate) x = 0;
        if (Math.abs(y) < config.noiseGate) y = 0;

        let len = Math.sqrt(x*x + y*y);
        if (len > 0 && len < config.deadzoneCounterweight) {
            let boost = config.deadzoneCounterweight / len;
            x *= boost;
            y *= boost;
        }

        if (config.responseCurve !== 1.0) {
            if (Math.abs(x) > 0) x = Math.sign(x) * Math.pow(Math.abs(x), config.responseCurve);
            if (Math.abs(y) > 0) y = Math.sign(y) * Math.pow(Math.abs(y), config.responseCurve);
        }

        return { x, y };
    }


    // --- 5. GYRO LOGIC ---
    function handleMotion(e) {
        if (!config.gyroEnabled || !e.rotationRate) return;
        const rate = e.rotationRate;
        let dX = 0, dY = 0;

        if (window.innerWidth > window.innerHeight) {
            dX = rate.alpha || 0;
            dY = rate.beta || 0;
            if (Math.abs(window.orientation) === 90) dY = -dY;
        } else {
            dX = rate.gamma || 0;
            dY = rate.beta || 0;
        }

        const baseDivisor = 150;
        let rawX = (dX / baseDivisor) * config.gyroSensX;
        let rawY = (dY / baseDivisor) * config.gyroSensY;

        if (config.invertGyroX) rawX = -rawX;
        if (config.invertGyroY) rawY = -rawY;

        const phys = applyPhysics(rawX, rawY);
        
        inputState.gyroX = Math.max(-1, Math.min(1, phys.x));
        inputState.gyroY = Math.max(-1, Math.min(1, phys.y));
    }
    window.addEventListener("devicemotion", handleMotion, true);


    // --- 6. VELOCITY LOGIC ---
    function processVelocityInput(dx, dy) {
        let vx = (dx * 0.05) * config.swipeSensX; 
        let vy = (dy * 0.05) * config.swipeSensY;

        const phys = applyPhysics(vx, vy);

        inputState.touchX = phys.x;
        inputState.touchY = phys.y;

        if (inputState.stopTimeoutId) clearTimeout(inputState.stopTimeoutId);
        inputState.stopTimeoutId = setTimeout(() => {
            inputState.touchX = 0;
            inputState.touchY = 0;
        }, 50); 
    }


    // --- 7. MIXER LOOP ---
    function updateControllerFrame() {
        let finalX = inputState.touchX + inputState.gyroX;
        let finalY = inputState.touchY + inputState.gyroY;

        if (Math.abs(finalX) < config.deadzone) finalX = 0;
        if (Math.abs(finalY) < config.deadzone) finalY = 0;

        if (finalX > 1) finalX = 1; if (finalX < -1) finalX = -1;
        if (finalY > 1) finalY = 1; if (finalY < -1) finalY = -1;

        virtualGamepad.axes[2] = finalX;
        virtualGamepad.axes[3] = finalY;
        virtualGamepad.timestamp = performance.now();

        requestAnimationFrame(updateControllerFrame);
    }
    requestAnimationFrame(updateControllerFrame);


    // --- 8. UI HELPERS ---
    function createEl(type, id, css) {
        const el = document.createElement(type);
        el.id = id;
        if (css.className) { el.className = css.className; delete css.className; }
        Object.assign(el.style, {
            position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center',
            userSelect: 'none', touchAction: 'none', ...css
        });
        return el;
    }

    function createButton(text, id, css) {
        const btn = createEl('div', id, {
            backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white', borderRadius: '50%',
            fontFamily: 'sans-serif', fontWeight: 'bold', pointerEvents: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(2px)', ...css
        });
        if(text) btn.innerText = text;
        return btn;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(16, 124, 16, 0.9)', color: 'white', padding: '10px 20px',
            borderRadius: '20px', fontFamily: 'sans-serif', fontSize: '14px', zIndex: '9999999',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)', opacity: '0', transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }

    // --- DYNAMIC LAYOUT ENGINE ---
    function applyLayout() {
        const layer = document.getElementById('bx-controls-layer');
        if (!layer) return;

        layer.style.opacity = config.opacity;

        layer.querySelectorAll('.scalable-group').forEach(g => {
            let s = config.scale;
            let baseTransform = (g.id === 'grp-center') ? 'translateX(-50%)' : '';
            g.style.transform = `${baseTransform} scale(${s})`;
        });

        const leftGroup = document.getElementById('grp-left');
        const rightGroup = document.getElementById('grp-right');
        const centerGroup = document.getElementById('grp-center');
        
        if (leftGroup) {
            leftGroup.style.left = `${config.leftX}px`;
            leftGroup.style.bottom = `${config.leftY}px`;
        }
        if (rightGroup) {
            rightGroup.style.right = `${config.rightX}px`;
            rightGroup.style.bottom = `${config.rightY}px`;
        }
        if (centerGroup) {
            centerGroup.style.top = `${config.centerY}px`;
        }

        const setPos = (id, xKey, yKey) => {
            const el = document.getElementById(id);
            if(el) el.style.transform = `translate(${config[xKey]}px, ${-config[yKey]}px)`;
        };

        for (const [id, keys] of Object.entries(ID_MAP)) {
            setPos(id, keys[0], keys[1]);
        }
    }

    // --- DRAG & DROP LOGIC ---
    let dragTarget = null;
    let dragStartMouseX = 0, dragStartMouseY = 0;
    let dragStartConfigX = 0, dragStartConfigY = 0;

    function enableDrag(el) {
        el.addEventListener('touchstart', onDragStart, {passive: false});
        el.addEventListener('mousedown', onDragStart);
    }

    function onDragStart(e) {
        if (!isEditing) return;
        e.preventDefault(); e.stopPropagation();

        const id = e.currentTarget.id;
        if (!ID_MAP[id]) return;

        dragTarget = e.currentTarget;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        dragStartMouseX = clientX;
        dragStartMouseY = clientY;
        
        const keys = ID_MAP[id];
        dragStartConfigX = config[keys[0]];
        dragStartConfigY = config[keys[1]];

        document.addEventListener('touchmove', onDragMove, {passive: false});
        document.addEventListener('touchend', onDragEnd);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        
        dragTarget.style.filter = "drop-shadow(0 0 5px yellow)";
    }

    function onDragMove(e) {
        if (!dragTarget) return;
        e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const deltaX = (clientX - dragStartMouseX) / config.scale;
        const deltaY = (clientY - dragStartMouseY) / config.scale;

        const keys = ID_MAP[dragTarget.id];
        config[keys[0]] = dragStartConfigX + deltaX;
        config[keys[1]] = dragStartConfigY - deltaY;

        dragTarget.style.transform = `translate(${config[keys[0]]}px, ${-config[keys[1]]}px)`;
    }

    function onDragEnd(e) {
        if (dragTarget) {
            dragTarget.style.filter = "";
            dragTarget = null;
            saveConfig();
        }
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }


    // --- 9. MAIN UI ---
    function initUI() {
        if (document.getElementById('bx-virtual-root')) return;
        
        const root = createEl('div', 'bx-virtual-root', { width: '100%', height: '100%', top: '0', left: '0', position: 'fixed', zIndex: '999999', pointerEvents: 'none' });
        document.body.appendChild(root);
        
        const controlsLayer = createEl('div', 'bx-controls-layer', { id: 'bx-controls-layer', width: '100%', height: '100%', top: '0', left: '0', pointerEvents: 'none' });
        root.appendChild(controlsLayer);

        const sysLayer = createEl('div', 'bx-sys-layer', { 
            bottom: '10px', left: '50%', transform: 'translateX(-50%)', 
            display: 'flex', gap: '20px', padding: '0', 
            backgroundColor: 'transparent', 
            pointerEvents: 'auto', zIndex: '1500'
        });
        root.appendChild(sysLayer); 
        
        const btnStyle = { position: 'relative', width: '40px', height: '40px', fontSize: '20px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #555', borderRadius: '50%' };
        
        const hideBtn = createButton("👁️", "btn-hide", btnStyle);
        let areControlsVisible = true;
        hideBtn.onclick = () => { 
            areControlsVisible = !areControlsVisible; 
            controlsLayer.style.display = areControlsVisible ? 'block' : 'none';
            if (!areControlsVisible) {
                inputState.touchX = 0; inputState.touchY = 0;
                inputState.gyroX = 0; inputState.gyroY = 0;
                virtualGamepad.axes = [0,0,0,0];
            }
            hideBtn.innerText = areControlsVisible ? "👁️" : "🚫";
            hideBtn.style.opacity = areControlsVisible ? "1.0" : "0.5";
        };
        sysLayer.appendChild(hideBtn);

        const editBtn = createButton("✏️", "btn-edit", btnStyle);
        editBtn.onclick = () => {
            isEditing = !isEditing;
            editBtn.style.backgroundColor = isEditing ? '#107c10' : 'rgba(0,0,0,0.5)';
            if(isEditing) {
                showToast("Edit Mode: Drag buttons to move");
                controlsLayer.classList.add('editing-mode');
            } else {
                controlsLayer.classList.remove('editing-mode');
                saveConfig();
            }
        };
        sysLayer.appendChild(editBtn);

        const gearBtn = createButton("⚙️", "btn-settings", btnStyle);
        sysLayer.appendChild(gearBtn);

        const fullBtn = createButton("⛶", "btn-full", btnStyle);
        fullBtn.onclick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(e => console.log(e));
                fullBtn.innerText = "><";
            } else {
                document.exitFullscreen();
                fullBtn.innerText = "⛶";
            }
        };
        sysLayer.appendChild(fullBtn);


        // --- SETTINGS PANEL ---
        const settingsWrapper = createEl('div', 'bx-settings-wrapper', {
            top: '0', left: '0', width: '100%', height: '100%', 
            display: 'none', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: 'auto', zIndex: '2000'
        });
        root.appendChild(settingsWrapper);

        const settingsPanel = createEl('div', 'bx-settings-panel', {
            position: 'relative', width: '400px', maxHeight: '90vh',
            backgroundColor: 'rgba(20,20,20,0.95)', borderRadius: '12px', border: '1px solid #555', 
            backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', 
            color: 'white', fontFamily: 'sans-serif', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        });
        
        settingsPanel.addEventListener('touchstart', (e) => e.stopPropagation());
        settingsPanel.addEventListener('touchmove', (e) => e.stopPropagation());
        settingsPanel.addEventListener('touchend', (e) => e.stopPropagation());
        settingsWrapper.appendChild(settingsPanel);
        
        function addControlRow(container, label, key, min, max, step) {
            const row = document.createElement('div');
            row.style.marginBottom = '12px';
            const header = document.createElement('div');
            header.style.display = 'flex'; header.style.justifyContent = 'space-between'; header.style.marginBottom = '4px';
            const txt = document.createElement('span'); txt.innerText = label; txt.style.fontSize = '14px'; txt.style.color = '#ccc';
            const numInput = document.createElement('input');
            numInput.type = 'number'; numInput.value = config[key]; numInput.step = step;
            numInput.style.width = '60px'; numInput.style.background = '#333'; numInput.style.color = 'white'; numInput.style.border = '1px solid #555'; numInput.style.borderRadius = '4px'; numInput.style.textAlign = 'center';
            const rangeInput = document.createElement('input');
            rangeInput.type = 'range'; rangeInput.min = min; rangeInput.max = max; rangeInput.step = step; rangeInput.value = config[key];
            rangeInput.style.width = '100%'; rangeInput.style.marginTop = '2px';

            rangeInput.oninput = (e) => { numInput.value = e.target.value; config[key] = parseFloat(e.target.value); saveConfig(); };
            numInput.onchange = (e) => { rangeInput.value = e.target.value; config[key] = parseFloat(e.target.value); saveConfig(); };

            header.appendChild(txt); header.appendChild(numInput);
            row.appendChild(header); row.appendChild(rangeInput);
            container.appendChild(row);
        }

        function addCheckRow(container, label, key) {
            const row = document.createElement('div');
            row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center'; row.style.marginBottom = '10px';
            const txt = document.createElement('span'); txt.innerText = label; txt.style.fontSize = '14px';
            const chk = document.createElement('input'); chk.type = 'checkbox'; chk.checked = config[key];
            chk.style.width = '20px'; chk.style.height = '20px';
            chk.onchange = (e) => { config[key] = e.target.checked; saveConfig(); };
            row.appendChild(txt); row.appendChild(chk);
            container.appendChild(row);
        }

        function renderSettings() {
            settingsPanel.innerHTML = '';
            
            const header = document.createElement('div');
            header.style.padding = '15px'; header.style.borderBottom = '1px solid #444'; header.style.textAlign = 'center';
            header.innerHTML = '<h3 style="margin:0; font-size:18px;">Controller Settings</h3>';
            settingsPanel.appendChild(header);

            const tabsBar = document.createElement('div');
            tabsBar.style.display = 'flex'; tabsBar.style.gap = '5px'; tabsBar.style.borderBottom = '1px solid #444';
            const tabs = ['General', 'Layout', 'Touch', 'Physics', 'Gyro'];
            
            tabs.forEach(tabName => {
                const tab = document.createElement('div');
                tab.innerText = tabName;
                tab.style.flex = '1'; tab.style.padding = '10px 0'; tab.style.textAlign = 'center'; tab.style.cursor = 'pointer'; tab.style.fontSize = '12px';
                if(activeTab === tabName) {
                    tab.style.backgroundColor = '#2a2a2a'; tab.style.borderBottom = '2px solid #107c10'; tab.style.color = '#fff';
                } else {
                    tab.style.color = '#888';
                }
                tab.onclick = () => { activeTab = tabName; renderSettings(); };
                tabsBar.appendChild(tab);
            });
            settingsPanel.appendChild(tabsBar);

            const content = document.createElement('div');
            content.style.padding = '15px'; content.style.overflowY = 'auto'; content.style.flex = '1';
            
            if(activeTab === 'General') {
                addControlRow(content, "Global Scale", "scale", 0.5, 1.5, 0.1);
                addControlRow(content, "Global Opacity", "opacity", 0.1, 1.0, 0.1);
                addCheckRow(content, "Enable Vibration", "vibrationEnabled");
                addControlRow(content, "Vibration Strength", "vibrationStrength", 0.0, 1.0, 0.1);
                
                content.appendChild(document.createElement('hr')).style.borderColor = '#333';
                
                const btnRow = document.createElement('div');
                btnRow.style.display = 'flex'; btnRow.style.gap = '10px'; btnRow.style.marginTop = '10px';
                
                const createActionBtn = (txt, action, bg = '#222') => {
                    const b = document.createElement('button'); b.innerText = txt;
                    b.style.flex = '1'; b.style.padding = '8px'; b.style.backgroundColor = bg; b.style.color = 'white'; b.style.border = '1px solid #555'; b.style.borderRadius = '4px';
                    b.onclick = action; return b;
                };

                btnRow.appendChild(createActionBtn("Export", () => {
                    navigator.clipboard.writeText(JSON.stringify(config)).then(() => showToast("Copied!"));
                }));
                
                btnRow.appendChild(createActionBtn("Import", () => {
                    const data = prompt("Paste config:");
                    if(data) {
                        try {
                            const parsed = JSON.parse(data);
                            config = { ...DEFAULT_CONFIG, ...parsed };
                            saveConfig();
                            renderSettings(); 
                            showToast("Loaded!");
                        } catch(e) { alert("Invalid!"); }
                    }
                }));

                content.appendChild(btnRow);
                
                const resetBtn = createActionBtn("Reset to Defaults", () => {
                    if(confirm("Reset all?")) {
                        config = { ...DEFAULT_CONFIG };
                        saveConfig();
                        renderSettings();
                        showToast("Reset!");
                    }
                }, '#500');
                resetBtn.style.width = '100%'; resetBtn.style.marginTop = '10px';
                content.appendChild(resetBtn);
            }
            else if(activeTab === 'Layout') {
                content.innerHTML += '<p style="font-size:12px; color:#aaa; text-align:center;">Tip: Use ✏️ Pencil to drag & drop buttons!</p>';
                
                content.appendChild(document.createElement('div')).style.cssText = "font-size:11px; color:#aaa; margin-top:5px; font-weight:bold; border-bottom:1px solid #444; padding-bottom:2px;"; content.lastChild.innerText = "LEFT HAND";
                addControlRow(content, "Group X", "leftX", 0, 1000, 5);
                addControlRow(content, "Group Y", "leftY", 0, 800, 5);
                addControlRow(content, "Stick X", "off_stick_x", -300, 300, 5);
                addControlRow(content, "Stick Y", "off_stick_y", -300, 300, 5);
                addControlRow(content, "D-Pad X", "off_dpad_x", -300, 300, 5);
                addControlRow(content, "D-Pad Y", "off_dpad_y", -300, 300, 5);
                addControlRow(content, "LS (Click) X", "off_ls_x", -300, 300, 5);
                addControlRow(content, "LS (Click) Y", "off_ls_y", -300, 300, 5);
                addControlRow(content, "View X", "off_view_x", -300, 300, 5);
                addControlRow(content, "View Y", "off_view_y", -300, 300, 5);
                addControlRow(content, "LB Offset X", "off_lb_x", -300, 300, 5);
                addControlRow(content, "LB Offset Y", "off_lb_y", -300, 300, 5);
                addControlRow(content, "LT Offset X", "off_lt_x", -300, 300, 5);
                addControlRow(content, "LT Offset Y", "off_lt_y", -300, 300, 5);
                
                content.appendChild(document.createElement('div')).style.cssText = "font-size:11px; color:#aaa; margin-top:15px; font-weight:bold; border-bottom:1px solid #444; padding-bottom:2px;"; content.lastChild.innerText = "RIGHT HAND";
                addControlRow(content, "Group X", "rightX", 0, 1000, 5);
                addControlRow(content, "Group Y", "rightY", 0, 800, 5);
                addControlRow(content, "ABXY X", "off_abxy_x", -300, 300, 5);
                addControlRow(content, "ABXY Y", "off_abxy_y", -300, 300, 5);
                addControlRow(content, "RS (Click) X", "off_rs_x", -300, 300, 5);
                addControlRow(content, "RS (Click) Y", "off_rs_y", -300, 300, 5);
                addControlRow(content, "Menu X", "off_menu_x", -300, 300, 5);
                addControlRow(content, "Menu Y", "off_menu_y", -300, 300, 5);
                addControlRow(content, "RB Offset X", "off_rb_x", -300, 300, 5);
                addControlRow(content, "RB Offset Y", "off_rb_y", -300, 300, 5);
                addControlRow(content, "RT Offset X", "off_rt_x", -300, 300, 5);
                addControlRow(content, "RT Offset Y", "off_rt_y", -300, 300, 5);

                content.appendChild(document.createElement('div')).style.cssText = "font-size:11px; color:#aaa; margin-top:15px; font-weight:bold; border-bottom:1px solid #444; padding-bottom:2px;"; content.lastChild.innerText = "CENTER";
                addControlRow(content, "Group Y", "centerY", 0, 200, 5);
                addControlRow(content, "Guide X", "off_guide_x", -300, 300, 5);
                addControlRow(content, "Guide Y", "off_guide_y", -300, 300, 5);
            } 
            else if(activeTab === 'Touch') {
                addControlRow(content, "X Sensitivity", "swipeSensX", 0.1, 50.0, 0.1);
                addControlRow(content, "Y Sensitivity", "swipeSensY", 0.1, 50.0, 0.1);
            } 
            else if(activeTab === 'Physics') {
                addControlRow(content, "Noise Gate", "noiseGate", 0.0, 0.1, 0.01);
                addControlRow(content, "Min Speed (Kick)", "deadzoneCounterweight", 0.0, 0.5, 0.01);
                addControlRow(content, "Deadzone", "deadzone", 0.0, 0.5, 0.01);
                addControlRow(content, "Response Curve", "responseCurve", 0.2, 1.0, 0.1);
            } 
            else if(activeTab === 'Gyro') {
                addCheckRow(content, "Enable Gyroscope", "gyroEnabled");
                addControlRow(content, "Gyro X Sens", "gyroSensX", 0.1, 30.0, 0.1);
                addControlRow(content, "Gyro Y Sens", "gyroSensY", 0.1, 30.0, 0.1);
                addCheckRow(content, "Invert X", "invertGyroX");
                addCheckRow(content, "Invert Y", "invertGyroY");
            }
            
            settingsPanel.appendChild(content);

            const footer = document.createElement('div');
            footer.style.padding = '10px 15px'; footer.style.borderTop = '1px solid #444';
            const close = document.createElement('button'); close.innerText = "Close"; 
            close.style.width = '100%'; close.style.padding = '10px'; close.style.backgroundColor = '#333'; close.style.color = 'white'; close.style.border = 'none'; close.style.borderRadius = '5px';
            close.onclick = () => settingsWrapper.style.display = 'none';
            footer.appendChild(close);
            settingsPanel.appendChild(footer);
        }
        
        renderSettings();
        gearBtn.onclick = () => { renderSettings(); settingsWrapper.style.display = 'flex'; };


        // =========================================================================
        // --- CONTROLS LAYER ---
        // =========================================================================
        
        const makeGroup = (cls, css, origin) => {
            return createEl('div', cls, { 
                className: 'game-controls scalable-group', 
                ...css, 
                pointerEvents: 'none', 
                'data-origin': origin,
                zIndex: '1000'
            });
        };

        // LEFT SIDE
        const leftGroup = makeGroup('grp-left', { bottom: '40px', left: '40px', width: '250px', height: '250px' }, 'bottom left');
        leftGroup.id = 'grp-left'; 
        controlsLayer.appendChild(leftGroup);

        const lStick = createButton("", "stick-left", { bottom: '0', left: '0', width: '120px', height: '120px', border: '2px dashed rgba(255,255,255,0.3)' });
        lStick.id = 'elem-stick'; enableDrag(lStick);
        const lKnob = createButton("", "knob-left", { width: '50px', height: '50px', background: 'rgba(255,255,255,0.5)', position: 'relative', border: 'none', pointerEvents: 'none' });
        lStick.appendChild(lKnob);
        leftGroup.appendChild(lStick);

        const lsBtn = createButton("LS", "btn-10", {
            bottom: '125px', left: '35px', width: '50px', height: '30px', borderRadius: '8px',
            backgroundColor: 'rgba(50,50,50,0.8)', fontSize: '12px', zIndex: '1000', className: 'game-controls'
        });
        enableDrag(lsBtn); leftGroup.appendChild(lsBtn);

        const dpadBtn = (txt, id, t, l) => createButton(txt, id, { width: '35px', height: '35px', top: t, left: l, borderRadius: '5px', backgroundColor: 'rgba(40,40,40,0.8)' });
        const dpadGroup = createEl('div', 'grp-dpad', { bottom: '0', left: '140px', width: '110px', height: '110px', pointerEvents: 'auto' });
        dpadGroup.id = 'grp-dpad'; enableDrag(dpadGroup);
        dpadGroup.appendChild(dpadBtn("↑", "btn-12", '0px', '37.5px'));
        dpadGroup.appendChild(dpadBtn("↓", "btn-13", '75px', '37.5px'));
        dpadGroup.appendChild(dpadBtn("←", "btn-14", '37.5px', '0px'));
        dpadGroup.appendChild(dpadBtn("→", "btn-15", '37.5px', '75px'));
        leftGroup.appendChild(dpadGroup);

        const lb = createButton("LB", "btn-4", { bottom: '160px', left: '0px', width: '70px', height: '35px', borderRadius: '8px', fontSize: '12px', borderTopLeftRadius:'15px', className: 'game-controls' });
        enableDrag(lb); leftGroup.appendChild(lb);
        const lt = createButton("LT", "btn-6", { bottom: '200px', left: '0px', width: '70px', height: '40px', borderRadius: '8px', fontSize: '12px', borderBottomLeftRadius:'15px', className: 'game-controls' });
        enableDrag(lt); leftGroup.appendChild(lt);
        
        const view = createButton("⧉", "btn-8", { bottom: '160px', left: '140px', width: '40px', height: '40px', backgroundColor: 'rgba(50,50,50,0.8)', fontSize: '16px', className: 'game-controls' });
        enableDrag(view); leftGroup.appendChild(view);


        // RIGHT SIDE
        const rightGroup = makeGroup('grp-right', { bottom: '40px', right: '40px', width: '200px', height: '200px' }, 'bottom right');
        rightGroup.id = 'grp-right';
        controlsLayer.appendChild(rightGroup);

        const abxyGroup = createEl('div', 'grp-abxy', { bottom: '20px', right: '0', width: '150px', height: '150px', pointerEvents: 'auto' });
        abxyGroup.id = 'grp-abxy'; enableDrag(abxyGroup);
        const faceBtn = (txt, id, col, t, l) => createButton(txt, id, { width: '50px', height: '50px', backgroundColor: col, top: t, left: l, fontSize: '18px', border: '1px solid rgba(255,255,255,0.2)' });
        abxyGroup.appendChild(faceBtn("Y", "btn-3", "rgba(240, 200, 0, 0.3)", "0px", "50px"));
        abxyGroup.appendChild(faceBtn("B", "btn-1", "rgba(255, 50, 50, 0.3)", "50px", "100px"));
        abxyGroup.appendChild(faceBtn("A", "btn-0", "rgba(50, 200, 50, 0.3)", "100px", "50px"));
        abxyGroup.appendChild(faceBtn("X", "btn-2", "rgba(50, 50, 255, 0.3)", "50px", "0px"));
        rightGroup.appendChild(abxyGroup);

        const rsBtn = createButton("RS", "btn-11", {
            bottom: '20px', right: '160px', width: '50px', height: '30px', borderRadius: '8px',
            backgroundColor: 'rgba(50,50,50,0.8)', fontSize: '12px', zIndex: '1000', className: 'game-controls'
        });
        enableDrag(rsBtn); rightGroup.appendChild(rsBtn);

        const rb = createButton("RB", "btn-5", { bottom: '160px', right: '0px', width: '70px', height: '35px', borderRadius: '8px', fontSize: '12px', borderTopRightRadius:'15px', className: 'game-controls' });
        enableDrag(rb); rightGroup.appendChild(rb);
        
        const rt = createButton("RT", "btn-7", { bottom: '200px', right: '0px', width: '70px', height: '40px', borderRadius: '8px', fontSize: '12px', borderBottomRightRadius:'15px', className: 'game-controls' });
        enableDrag(rt); rightGroup.appendChild(rt);

        const menu = createButton("☰", "btn-9", { bottom: '160px', right: '100px', width: '40px', height: '40px', backgroundColor: 'rgba(50,50,50,0.8)', fontSize: '16px', className: 'game-controls' });
        enableDrag(menu); rightGroup.appendChild(menu);


        // TOUCHPAD
        const rTouchpad = createEl('div', "touchpad-right", { 
            className: 'game-controls', 
            top: '0', right: '0', width: '50%', height: '100%', 
            zIndex: '500', display: 'block', pointerEvents: 'auto' 
        });
        const rFloatKnob = createButton("", "knob-float", { width: '50px', height: '50px', border: '2px solid rgba(255,255,255,0.8)', position: 'absolute', display: 'none', pointerEvents: 'none' });
        rTouchpad.appendChild(rFloatKnob);
        controlsLayer.appendChild(rTouchpad);

        // CENTER MENU
        const centerGroup = makeGroup('grp-center', { top: '20px', left: '50%', width: '60px', height: '60px', transform: 'translateX(-50%)' }, 'top center');
        centerGroup.id = 'grp-center';
        const guide = createButton("⨂", "btn-16", { top: '0', left: '0', width: '45px', height: '45px', backgroundColor: '#107c10', border: '1px solid #fff', className: 'game-controls' });
        enableDrag(guide); centerGroup.appendChild(guide);
        controlsLayer.appendChild(centerGroup);


        // --- LOGIC ---

        function handleBtn(id, pressed) {
            if(isEditing) return;
            const index = parseInt(id.split('-')[1]);
            virtualGamepad.buttons[index].pressed = pressed;
            virtualGamepad.buttons[index].value = pressed ? 1.0 : 0.0;
            const el = document.getElementById(id);
            if(el) {
                if(pressed) {
                    el.style.transform = (el.style.transform || '') + " scale(0.9)";
                    el.style.filter = "brightness(1.5)";
                } else {
                    el.style.transform = el.style.transform.replace(" scale(0.9)", "");
                    el.style.filter = "none";
                }
            }
        }

        controlsLayer.querySelectorAll('[id^="btn-"]').forEach(btn => {
            const press = (e) => { if(!isEditing) { e.preventDefault(); e.stopPropagation(); handleBtn(btn.id, true); } };
            const release = (e) => { if(!isEditing) { e.preventDefault(); e.stopPropagation(); handleBtn(btn.id, false); } };
            btn.addEventListener('touchstart', press); btn.addEventListener('touchend', release);
            btn.addEventListener('mousedown', press); btn.addEventListener('mouseup', release);
        });

        // Left Stick
        const handleFixedStick = (e, axisX, axisY, knob) => {
            if(isEditing) return;
            e.preventDefault(); e.stopPropagation();
            const touch = e.targetTouches ? e.targetTouches[0] : e;
            const rect = knob.parentElement.getBoundingClientRect();
            let nx = ((touch.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2);
            let ny = ((touch.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2);
            const dist = Math.sqrt(nx*nx + ny*ny);
            if (dist > 1) { nx /= dist; ny /= dist; }
            if(axisX === 0) { virtualGamepad.axes[0] = nx; virtualGamepad.axes[1] = ny; }
            else { inputState.touchX = nx; inputState.touchY = ny; }
            knob.style.transform = `translate(${nx * 25}px, ${ny * 25}px)`;
        };

        const resetStick = (e, axisX, axisY, knob) => {
            if(isEditing) return;
            e.preventDefault();
            if (axisX === 0) { virtualGamepad.axes[0] = 0; virtualGamepad.axes[1] = 0; }
            knob.style.transform = `translate(0px, 0px)`;
        };

        lStick.addEventListener('touchmove', (e) => handleFixedStick(e, 0, 1, lKnob));
        lStick.addEventListener('touchend', (e) => resetStick(e, 0, 1, lKnob));

        // Right Swipe
        rTouchpad.addEventListener('touchstart', (e) => {
            if(isEditing) return;
            e.preventDefault();
            const touch = e.targetTouches[0];
            inputState.lastTouchX = touch.clientX; inputState.lastTouchY = touch.clientY;
            rFloatKnob.style.display = 'block'; 
            rFloatKnob.style.left = (touch.clientX - 25) + 'px'; rFloatKnob.style.top = (touch.clientY - 25) + 'px';
        });

        rTouchpad.addEventListener('touchmove', (e) => {
            if(isEditing) return;
            e.preventDefault();
            const touch = e.targetTouches[0];
            if (inputState.lastTouchX !== null) {
                let dx = touch.clientX - inputState.lastTouchX;
                let dy = touch.clientY - inputState.lastTouchY;
                processVelocityInput(dx, dy);
                rFloatKnob.style.left = (touch.clientX - 25) + 'px'; rFloatKnob.style.top = (touch.clientY - 25) + 'px';
            }
            inputState.lastTouchX = touch.clientX; inputState.lastTouchY = touch.clientY;
        });
        
        rTouchpad.addEventListener('touchend', (e) => {
            if(isEditing) return;
            e.preventDefault();
            rFloatKnob.style.display = 'none';
        });

        // Initial Layout
        applyLayout();
    }

    window.addEventListener('load', () => setTimeout(initUI, 1000));

})();