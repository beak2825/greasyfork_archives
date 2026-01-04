// ==UserScript==
// @name         Kirka.io Mod Menu (by freedu) _2_  
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  You find all my cheats right here = feds.lol/freedu , only use if you allowed to
// @author       freedu
// @match        https://kirka.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558151/Kirkaio%20Mod%20Menu%20%28by%20freedu%29%20_2_.user.js
// @updateURL https://update.greasyfork.org/scripts/558151/Kirkaio%20Mod%20Menu%20%28by%20freedu%29%20_2_.meta.js
// ==/UserScript==

crypto.subtle.verify = () => Promise.resolve(true);
localStorage.dogewareLicenseKey = btoa(`{"message":"${Date.now() * 2}"}`);

window.addEventListener("DOMContentLoaded", () => {

    let CHAT_SPAM_MESSAGE = "RIP Terry A. Davis";
    let CHAT_SPAM_INTERVAL_MS = 1000;
    let CHAT_SPAM_REPEAT = 0;

    const FOOTER_TEXT = "feds.lol/freedu";

    const menu = document.createElement("div");
    menu.id = "modMenu";
    menu.style.cssText = `
        position: fixed;
        top: 115px;
        left: 145px;
        width: 520px;
        height: 380px;
        padding: 10px;
        background: rgba(10, 12, 14, 0.95);
        color: #ffffff;
        z-index: 999999;
        border-radius: 10px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 18px;
        border: 2px solid #00f0ff;
        user-select: none;
        box-sizing: border-box;
        display: flex;  
        flex-direction: column;
        overflow: hidden;
    `;

    menu.innerHTML = `
        <div id="modMenuHeader" style="
            display:flex;
            align-items:center;
            gap:12px;
            margin-bottom: 8px;
        ">
            <div id="title" style="
                font-weight: bold;
                font-size: 20px;
                color: white;
                text-decoration: underline;
                text-decoration-color: #00f0ff;
                cursor: grab;
            ">Modded by freedu</div>

            <div id="tabs" style="display:flex; gap:6px; margin-left: 8px;">
                <div class="tab active" data-tab="combat" style="
                    padding:6px 12px;
                    border-radius:8px 8px 0 0;
                    background: linear-gradient(#0b2e3a, #072428);
                    border: 1px solid rgba(0,0,0,0.3);
                    color: #cfefff;
                    font-weight:600;
                ">Combat</div>
                <div class="tab" data-tab="visual" style="
                    padding:6px 12px;
                    border-radius:8px 8px 0 0;
                    background: transparent;
                    border: 1px solid transparent;
                    color: #b8e8ff;
                    font-weight:600;
                ">Visual</div>
                <div class="tab" data-tab="misc" style="
                    padding:6px 12px;
                    border-radius:8px 8px 0 0;
                    background: transparent;
                    border: 1px solid transparent;
                    color: #b8e8ff;
                    font-weight:600;
                ">Misc</div>
            </div>

            <div style="flex:1"></div>

            <button id="closeBtn" style="
                background: #00f0ff;
                color: #000;
                font-weight: bold;
                border: none;
                padding: 6px 10px;
                border-radius: 12px;
                cursor: pointer;
            ">❌</button>
        </div>

        <div id="modMenuBody" style="
            display:flex;
            flex-direction:column;
            gap:8px;
            height: calc(100% - 110px);
            padding: 8px;
            overflow: hidden;
        ">
            <div id="tab-content-combat" class="tab-content" style="display:block; height:100%; overflow:auto; padding-right:6px;">
    <label id="label-autojumpToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="autojumpToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        🦘 Auto Jump
    </label>

    <label id="label-autocrouchToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="autocrouchToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        ⬇️ Auto Crouch
    </label>
</div>

<div id="tab-content-visual" class="tab-content" style="display:none; height:100%; overflow:auto; padding-right:6px;">
    <label id="label-wallhackToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="wallhackToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        🧱 Wallhack
    </label>

    <label id="label-wireframeToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="wireframeToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        🌐 Wireframe
    </label>

    <label id="label-crosshairToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="crosshairToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        🎯 Crosshair
    </label>
</div>

<div id="tab-content-misc" class="tab-content" style="display:none; height:100%; overflow:auto; padding-right:6px;">
    <label id="label-level100Toggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="level100Toggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        💯 Level 100
    </label>

    <label id="label-ChatSpamToggle" style="display: block; margin-top: 6px; font-size: 18px; cursor: default;">
        <input type="checkbox" id="ChatSpamToggle" style="transform: scale(1.4); margin-right: 8px; margin-left: 6px;">
        🗣 ChatSpam
    </label>

    <div id="hotkeySetting" style="margin-top: 10px; font-size: 16px;">
    <span>📀 Menu-Hotkey: </span>
    <input id="hotkeyInput" type="text" value="M" maxlength="1"
           style="width: 30px; text-align: center; font-weight: bold; background:#111; color:#0ff; border:1px solid #0ff; border-radius:6px;">
</div>

</div>

        </div>

        <div id="menuFooter" style="
    text-align:center;
    padding:0px 0px;
    font-size:15px;
    color:#00f0ff;
    border-top:0px solid rgba(255,255,255,0.04);
    background: rgba(0,0,0,0.03);
    line-height: 1.2;
">${FOOTER_TEXT}</div>

    `;

    document.body.appendChild(menu);

    const tabs = menu.querySelectorAll('.tab');
    const contents = {
        combat: document.getElementById('tab-content-combat'),
        visual: document.getElementById('tab-content-visual'),
        misc: document.getElementById('tab-content-misc'),
    };

    function setActiveTab(name) {
        tabs.forEach(t => {
            if (t.dataset.tab === name) {
                t.classList.add('active');
                t.style.background = 'linear-gradient(#0b2e3a, #072428)';
                t.style.border = '1px solid rgba(0,0,0,0.3)';
                t.style.color = '#cfefff';
            } else {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.border = '1px solid transparent';
                t.style.color = '#b8e8ff';
            }
        });
        Object.keys(contents).forEach(k => {
            contents[k].style.display = (k === name) ? 'block' : 'none';
        });
    }
          // next update to this gonna come in 5 years or something but who realy play kirka?
    tabs.forEach(t => {
        t.addEventListener('click', () => setActiveTab(t.dataset.tab));
    });

    let isDragging = false, offsetX = 0, offsetY = 0;
    const titleEl = document.getElementById('title');

    titleEl.addEventListener("mousedown", (e) => {
        const target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "BUTTON" || target.closest("button")) return;
        isDragging = true;
        const rect = menu.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        titleEl.style.cursor = 'grabbing';
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        titleEl.style.cursor = 'grab';
    });

    let visible = true;

    const storedHotkey = localStorage.getItem("adminMenuHotkey");
    let toggleKey = storedHotkey ? storedHotkey : "m";

    const hotkeyInput = document.getElementById("hotkeyInput");
    if (hotkeyInput) {
        hotkeyInput.value = toggleKey.toUpperCase();
        hotkeyInput.addEventListener("keydown", (e) => {
            e.preventDefault();
            const key = e.key.toLowerCase();
            if (/^[a-z0-9]$/i.test(key)) {
                toggleKey = key;
                localStorage.setItem("adminMenuHotkey", key);
                hotkeyInput.value = key.toUpperCase();
            }
        });
        hotkeyInput.addEventListener("click", (e) => {
            hotkeyInput.select();
        });
    }

    function keydownHandler(e) {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (e.key.toLowerCase() === toggleKey) {
            visible = !visible;
            menu.style.display = visible ? "flex" : "none";
        }
    }
    document.removeEventListener("keydown", keydownHandler);
    document.addEventListener("keydown", keydownHandler);

    document.getElementById("closeBtn").onclick = () => {
        visible = false;
        menu.style.display = "none";
    };

    const tooltips = {
        "label-wallhackToggle": "✅ Safe to use ✅",
        "label-autojumpToggle": "✅ Safe to use ✅",
        "label-autocrouchToggle": "✅ Safe to use ✅",
        "label-crosshairToggle": "✅ Safe to use ✅",
        "label-ChatSpamToggle": "❗easy detected❗",
        "label-level100Toggle": "✅ Safe to use ✅",    // its safe but its shit
        "label-wireframeToggle": "✅ Safe to use ✅",
    };

    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '6px 10px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '14px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000000';
    tooltip.style.display = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    document.body.appendChild(tooltip);

    function addTooltip(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('mouseenter', (e) => {
            tooltip.textContent = tooltips[id] || '';
            tooltip.style.display = 'block';
        });
        el.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 12 + 'px';
            tooltip.style.top = e.pageY + 12 + 'px';
        });
        el.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }
    Object.keys(tooltips).forEach(addTooltip);

    let wallhackEnabled = false;
    const modifiedMaterials = new WeakSet();

    const patchMaterial = (material) => {
        if (!material || !material.map || !material.map.image) return;
        const isTarget = material.map.image.width === 64 && material.map.image.height === 64;
        if (!isTarget) return;

        if (wallhackEnabled && !modifiedMaterials.has(material)) {
            for (let key in material) {
                if (material[key] === 3) {
                    material[key] = 1;
                    modifiedMaterials.add(material);
                }
            }
        } else if (!wallhackEnabled && modifiedMaterials.has(material)) {
            for (let key in material) {
                if (material[key] === 1) {
                    material[key] = 3;
                }
            }
            modifiedMaterials.delete(material);
        }
    };

    const proxyHandler = {
        apply(target, thisArg, args) {
            patchMaterial(args[0]);
            return Reflect.apply(target, thisArg, args);
        }
    };

    const originalIsArray = Array.isArray;
    Array.isArray = new Proxy(originalIsArray, proxyHandler);

    const observeMaterials = () => {
        const interval = setInterval(() => {
            if (window.THREE) {
                const walk = (obj) => {
                    if (!obj || typeof obj !== "object") return;
                    if (obj.material) {
                        const mat = obj.material;
                        if (Array.isArray(mat)) mat.forEach(patchMaterial);
                        else patchMaterial(mat);
                    }
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) walk(obj[key]);
                    }
                };
                walk(window);
                clearInterval(interval);
            }
        }, 1000);
    };

    const wallhackToggle = document.getElementById("wallhackToggle");
    if (wallhackToggle) {  // "they" glow you shine
        wallhackToggle.addEventListener("change", () => {
            wallhackEnabled = wallhackToggle.checked;
            observeMaterials();
        });
    }

    let autoJumpActive = false;
    const autojumpToggle = document.getElementById("autojumpToggle");
    if (autojumpToggle) {
        autojumpToggle.addEventListener("change", () => {
            autoJumpActive = autojumpToggle.checked;
        });
    }

    setInterval(() => {
        if (autoJumpActive && document.hasFocus()) {
            const spaceDown = new KeyboardEvent("keydown", {
                key: " ", code: "Space", keyCode: 32, bubbles: true
            });
            const spaceUp = new KeyboardEvent("keyup", {
                key: " ", code: "Space", keyCode: 32, bubbles: true
            });

            const activeEl = document.activeElement || document;
            activeEl.dispatchEvent(spaceDown);
            setTimeout(() => activeEl.dispatchEvent(spaceUp), 10);
        }
    }, 50);  // we all know what "they" did to Terry♰

    let autoCrouchActive = false;
    const autoCrouchToggle = document.getElementById("autocrouchToggle");
    if (autoCrouchToggle) {
        autoCrouchToggle.addEventListener("change", () => {
            autoCrouchActive = autoCrouchToggle.checked;
        });
    }

    setInterval(() => {
        if (autoCrouchActive && document.hasFocus()) {

            const shiftDown = new KeyboardEvent("keydown", {
                key: "Shift",
                code: "ShiftLeft",
                keyCode: 16,
                bubbles: true
            });
            const shiftUp = new KeyboardEvent("keyup", {
                key: "Shift",
                code: "ShiftLeft",
                keyCode: 16,
                bubbles: true
            });

            const activeEl = document.activeElement || document.body || window;
            activeEl.dispatchEvent(shiftDown);

            setTimeout(() => {
                activeEl.dispatchEvent(shiftUp);
            }, 400);
        }
    }, 300);

    const crosshair = document.createElement("div");
    crosshair.id = "crosshair";
    crosshair.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        pointer-events: none;
        z-index: 100000;
        transform: translate(-50%, -50%);
        display: none;
    `;

    const vert = document.createElement("div");
    vert.style.cssText = `
        position: absolute;
        top: 0;
        left: 50%;
        width: 2px;
        height: 100%;
        background-color: red;
        transform: translateX(-50%);
    `;

    const hori = document.createElement("div");
    hori.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: red;
        transform: translateY(-50%);
    `;

    crosshair.appendChild(vert);
    crosshair.appendChild(hori);
    document.body.appendChild(crosshair);

    const crosshairToggle = document.getElementById("crosshairToggle");
    if (crosshairToggle) {
        crosshairToggle.addEventListener("change", () => {
            crosshair.style.display = crosshairToggle.checked ? "block" : "none";
        });
    }

let wireframeEnabled = false;

const WebGL = WebGL2RenderingContext.prototype;

const wireframeHandler = {
    apply(target, thisArgs, args) {
        const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
        if (wireframeEnabled && args[0] === thisArgs.TRIANGLES) {
            args[0] = thisArgs.LINES;
        }
        return Reflect.apply(target, thisArgs, args);
    }
};  // 1969 - 2018 ♰

WebGL.drawElements = new Proxy(WebGL.drawElements, wireframeHandler);
WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, wireframeHandler);   // RIP Terry A. davis

const wireframeToggle = document.getElementById("wireframeToggle");
if (wireframeToggle) {
    wireframeToggle.addEventListener("change", () => {
        wireframeEnabled = wireframeToggle.checked;
        console.log("Wireframe:", wireframeEnabled);
    });
}


    (function chatSpamBlock() {
        const chatToggle = document.getElementById('ChatSpamToggle');
        if (!chatToggle) return;

        let SPAM_MESSAGE = CHAT_SPAM_MESSAGE;
        let INTERVAL_MS = CHAT_SPAM_INTERVAL_MS;
        let REPEAT_COUNT = CHAT_SPAM_REPEAT;

        const wait = ms => new Promise(res => setTimeout(res, ms));

        function findChatInput() {
            const selectors = [
                '#chatInput', '#chat-input',
                '.chat input', '.chat textarea',
                'input.chat-input', 'textarea.chat-input',
                'input[placeholder*="Chat"]', 'textarea[placeholder*="Chat"]',
                'input[placeholder*="chat"]', 'textarea[placeholder*="chat"]'
            ];
            for (const s of selectors) {
                const el = document.querySelector(s);
                if (el) return el;
            }
            return null;
        } 

        function dispatchKey(target, type, opts = {}) {
            const base = Object.assign({
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            }, opts);
            const ev = new KeyboardEvent(type, base);
            (target || document).dispatchEvent(ev);
        }

        function setInputValue(input, value) {
            input.focus();
            try {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                const proto = Object.getPrototypeOf(input);
                const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (setter) setter.call(input, value);
            } catch (e) {}
        }

        async function sendOnce(message) {
            dispatchKey(document, 'keydown', { key: 'Enter', code: 'Enter', keyCode: 13 });
            dispatchKey(document, 'keyup', { key: 'Enter', code: 'Enter', keyCode: 13 });
            await wait(80);

            const input = findChatInput();
            if (input) {
                setInputValue(input, message);
                await wait(60);
                dispatchKey(input, 'keydown', { key: 'Enter', code: 'Enter', keyCode: 13 });
                dispatchKey(input, 'keyup', { key: 'Enter', code: 'Enter', keyCode: 13 });
            } else {
                await wait(50);
                dispatchKey(document, 'keydown', { key: 'Enter', code: 'Enter', keyCode: 13 });
                dispatchKey(document, 'keyup', { key: 'Enter', code: 'Enter', keyCode: 13 });
            }
        }  // This code is ass

        let spamInterval = null;
        let stopped = false;

        async function startSpam(message, intervalMs, repeatCount = 0) {
            stopSpam();
            stopped = false;

            if (repeatCount > 0) {
                for (let i = 0; i < repeatCount; i++) {
                    if (stopped) break;
                    await sendOnce(message);
                    if (i < repeatCount - 1) await wait(Math.max(100, intervalMs));
                }
                chatToggle.checked = false;
                return;
            }  

            spamInterval = setInterval(() => {
                sendOnce(message).catch(()=>{});
            }, Math.max(100, intervalMs));
        }

        function stopSpam() {
            stopped = true;
            if (spamInterval) {
                clearInterval(spamInterval);
                spamInterval = null;
            }
        }

        chatToggle.addEventListener('change', () => {
            if (chatToggle.checked) {
                startSpam(SPAM_MESSAGE, INTERVAL_MS, REPEAT_COUNT);
            } else {
                stopSpam();
            }
        });

        window.addEventListener('beforeunload', stopSpam);
    })();

    const level100Toggle = document.getElementById("level100Toggle");
    let level100Interval;
    let originalLevel = null;

    if (level100Toggle) {
        level100Toggle.addEventListener("change", () => {
            const levelValueElement = document.querySelector('.level-value');
            const levelsElement = document.querySelector('.levels');

            if (level100Toggle.checked) {
                if (!originalLevel && levelValueElement) originalLevel = levelValueElement.textContent;

                level100Interval = setInterval(() => {
                    if (levelsElement) levelsElement.textContent = "100";
                    if (levelValueElement) levelValueElement.textContent = "100";
                }, 500);
            } else {
                clearInterval(level100Interval);
                if (levelsElement && originalLevel) levelsElement.textContent = originalLevel;
                if (levelValueElement && originalLevel) levelValueElement.textContent = originalLevel;
            }
        });
    }

    setActiveTab('combat');

    window.__Menu = {
        open: () => { visible = true; menu.style.display = 'flex'; },
        close: () => { visible = false; menu.style.display = 'none'; },
        setChatSpamMessage: (m) => { CHAT_SPAM_MESSAGE = String(m); },
        setChatSpamInterval: (ms) => { CHAT_SPAM_INTERVAL_MS = Number(ms); },
        setChatSpamRepeat: (n) => { CHAT_SPAM_REPEAT = Number(n); }
    };
});            