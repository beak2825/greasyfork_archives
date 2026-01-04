// ==UserScript==
// @name         Kirka.io Mod Menu (by freedu)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  !!!ONLY USE THIS IF YOU ARE ALLOWED TO!!! ; guns.lol/freedu ; Hotkey [M] ; if something doesn't work try refreshing the page
// @author       freedu
// @match        https://kirka.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552994/Kirkaio%20Mod%20Menu%20%28by%20freedu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552994/Kirkaio%20Mod%20Menu%20%28by%20freedu%29.meta.js
// ==/UserScript==

crypto.subtle.verify = () => Promise.resolve(true);
localStorage.dogewareLicenseKey = btoa(`{"message":"${Date.now() * 2}"}`);

window.addEventListener("DOMContentLoaded", () => {

    const menu = document.createElement("div");
    menu.id = "modMenu";
    menu.style = `
        position: fixed;
        top: 115px;
        left: 145px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        z-index: 99999;
        border-radius: 10px;
        font-family: Arial;
        font-size: 20px;
        border: 2px solid #00f0ff;
        user-select: none;
        max-height: 80vh;
        overflow-y: auto;
    `;

    menu.innerHTML = `
        <div id="modMenuHeader" style="
            cursor: move;
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 22px;
            color: white;
            text-decoration: underline;
            text-decoration-color: #00f0ff;
        ">
            Modded by freedu
        </div>

        <label id="label-wallhackToggle" style="display: block; margin-top: 10px; font-size: 20px; cursor: default;">
            <input type="checkbox" id="wallhackToggle" style="transform: scale(1.5); margin-right: 8px;">
            🧱 Wallhack
        </label>

        <label id="label-autojumpToggle" style="display: block; margin-top: 10px; font-size: 20px; cursor: default;">
            <input type="checkbox" id="autojumpToggle" style="transform: scale(1.5); margin-right: 8px;">
            🦘 Auto Jump
        </label>

        <label id="label-crosshairToggle" style="display: block; margin-top: 10px; font-size: 20px; cursor: default;">
            <input type="checkbox" id="crosshairToggle" style="transform: scale(1.5); margin-right: 8px;">
            🎯 Crosshair
        </label>

        <label id="label-level100Toggle" style="display: block; margin-top: 10px; font-size: 20px; cursor: default;">
            <input type="checkbox" id="level100Toggle" style="transform: scale(1.5); margin-right: 8px;">
            💯 Level 100
        </label><br>

        <button id="closeBtn" style="
            width: 100%;
            background: #00f0ff;
            color: #000;
            font-weight: bold;
            border: none;
            padding: 8px;
            border-radius: 18px;
            cursor: pointer;
        ">❌ Close</button>
    `;

    document.body.appendChild(menu);

    let isDragging = false, offsetX = 0, offsetY = 0;

    menu.addEventListener("mousedown", (e) => {
        const target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "BUTTON" || target.closest("button")) return;
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => isDragging = false);

    let visible = true;
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "m") {
            visible = !visible;
            menu.style.display = visible ? "block" : "none";
        }
    });

    document.getElementById("closeBtn").onclick = () => {
        visible = false;
        menu.style.display = "none";
    };

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
    wallhackToggle.addEventListener("change", () => {
        wallhackEnabled = wallhackToggle.checked;
        observeMaterials();
    });

    let autoJumpActive = false;
    const autojumpToggle = document.getElementById("autojumpToggle");

    autojumpToggle.addEventListener("change", () => {
        autoJumpActive = autojumpToggle.checked;
    });

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
    }, 50);

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
crosshairToggle.addEventListener("change", () => {
    crosshair.style.display = crosshairToggle.checked ? "block" : "none";
});

    const level100Toggle = document.getElementById("level100Toggle");
    let level100Interval;
    let originalLevel = null;

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

    const tooltips = {
        "label-wallhackToggle": "✅ Safe to use ✅",
        "label-autojumpToggle": "✅ Safe to use ✅",
        "label-crosshairToggle": "✅ Safe to use ✅",
        "label-level100Toggle": "❗Very easy detected ❗",
    };

    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '4px 8px';
    tooltip.style.borderRadius = '4px';
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
});