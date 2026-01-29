// ==UserScript==
// @name         Torn Car Upgrades Highlighter
// @namespace    http://tampermonkey.net/
// @version      22.0
// @description  Menu only appears on racing pages. Excludes Rally Cross. Ghost Overlay.
// @author       Bugrilhos + Gemini
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564386/Torn%20Car%20Upgrades%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/564386/Torn%20Car%20Upgrades%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "torn_racing_build_preference";

    // --- CONFIG: PARTS & COLORS ---
    const bestInSlot = [
        [["Forced", "Engine", "Cooling"], "rh-green"],
        [["Cooling", "Ducts", "Brakes"], "rh-green"],
        [["Spoiler", "Adjustable"], "rh-green"],
        [["Diffuser", "Front"], "rh-green"],
        [["Diffuser", "Rear"], "rh-green"],
        [["Bushings", "Front"], "rh-green"],
        [["Bushings", "Rear"], "rh-green"],
        [["Strut", "Brace", "Front"], "rh-green"],
        [["Strut", "Brace", "Rear"], "rh-green"],
        [["Tie", "Rods"], "rh-green"],
        [["Control", "arms"], "rh-green"],
        [["Brake", "Fluid", "Fast"], "rh-green"],
        [["Brake", "Hoses", "Braided"], "rh-green"],
        [["Discs", "Grooved", "Drilled"], "rh-green"],
        [["Brake", "Pads", "Competition"], "rh-green"],
        [["Bias", "Control"], "rh-green"],
        [["6", "Pot", "Brakes"], "rh-green"],
        [["Head", "Polished"], "rh-green"],
        [["Throttle", "Body", "Competition"], "rh-green"],
        [["Fuel", "Pump", "Competition"], "rh-green"],
        [["Bored", "Out", "Engine"], "rh-green"],
        [["Intercooler", "Front"], "rh-green"],
        [["Remap", "Three"], "rh-green"],
        [["Camshaft", "Competition"], "rh-green"],
        [["Quick", "Shift"], "rh-green"],
        [["Differential", "4", "Pin"], "rh-green"],
        [["Clutch", "Competition"], "rh-green"],
        [["Flywheel", "Ultra", "Light"], "rh-green"],
        [["Exhaust", "System", "Full"], "rh-green"],
        [["Manifold", "Stainless"], "rh-green"],
        [["Induction", "Kit", "Custom"], "rh-green"],
        [["Nitrous"], "rh-green"],
        [["Strip", "Out"], "rh-green"],
        [["Steering", "Wheel", "Racing"], "rh-green"],
        [["Dash", "Flocked"], "rh-green"],
        [["Windows", "Polycarbonate"], "rh-green"],
        [["Carbon", "Roof"], "rh-green"],
        [["Carbon", "Trunk"], "rh-green"],
        [["Carbon", "Hood"], "rh-green"],
        [["Alloys", "Ultra", "Lightweight"], "rh-green"]
    ];

    const modules = {
        "Turbo3": [["Turbo", "Kit", "Three"], "rh-pink"],
        "TarmacTires": [["Tires", "Track"], "rh-blue"],
        "DirtTires": [["Tires", "Rally"], "rh-blue"],
        "TarmacSusp": [["Suspension", "Adjustable", "Coilover"], "rh-blue"],
        "DirtSusp": [["Suspension", "Group", "N"], "rh-blue"],
        "PaddleLong": [["Paddle", "Shift", "Long"], "rh-yellow"],
        "PaddleShort": [["Paddle", "Shift", "Short"], "rh-yellow"],
        "RallyLong": [["Rally", "Gearbox", "Long"], "rh-yellow"],
        "RallyShort": [["Rally", "Gearbox", "Short"], "rh-yellow"]
    };

    function getTargetList(buildCode) {
        if (!buildCode) return [];
        let targets = [...bestInSlot, modules.Turbo3];

        if (buildCode.startsWith("T")) {
            targets.push(modules.TarmacTires);
            targets.push(modules.TarmacSusp);
            if (buildCode.includes("L")) targets.push(modules.PaddleLong);
            else targets.push(modules.PaddleShort);
        } else if (buildCode.startsWith("D")) {
            targets.push(modules.DirtTires);
            targets.push(modules.DirtSusp);
            if (buildCode.includes("L")) targets.push(modules.RallyLong);
            else targets.push(modules.RallyShort);
        }
        return targets;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .rh-ghost {
            position: absolute !important;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none !important;
            z-index: 999;
            border-radius: 5px;
        }
        .rh-green { background-color: rgba(0, 255, 0, 0.25); border: 2px solid #00ff00; }
        .rh-blue { background-color: rgba(0, 140, 255, 0.3); border: 2px solid #0088ff; }
        .rh-pink { background-color: rgba(255, 0, 255, 0.3); border: 2px solid #ff00ff; }
        .rh-yellow { background-color: rgba(255, 215, 0, 0.3); border: 2px solid #ffd700; }
        .rh-owned { background-color: rgba(255, 0, 0, 0.3); border: 2px solid #ff0000; }

        #rh-header-bar {
            width: 100%;
            background: #222;
            border-bottom: 2px solid #444;
            padding: 8px 15px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 13px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        #rh-select {
            background: #444;
            color: #fff;
            border: 1px solid #777;
            padding: 4px;
            border-radius: 3px;
            margin-left: 10px;
            font-size: 12px;
            cursor: pointer;
        }

        .rh-legend { display: flex; gap: 10px; font-size: 11px; color: #ccc; }
        .rh-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 3px; }
    `;
    document.head.appendChild(style);

    function clean(str) { return str.toLowerCase().replace(/[^a-z0-9]/g, ""); }
    function isMatch(text, keywords) { return keywords.every(kw => clean(text).includes(clean(kw))); }

    function clearAllHighlights() {
        document.querySelectorAll('.rh-ghost').forEach(el => el.remove());
    }

    function scan() {
        // Double check we are on racing page, otherwise clear highlights
        if (!window.location.href.includes('racing')) {
            clearAllHighlights();
            return;
        }

        const pref = localStorage.getItem(STORAGE_KEY);
        if (!pref) return;

        const targetList = getTargetList(pref);
        const elements = document.querySelectorAll('.title, .name, h5');

        elements.forEach(el => {
            const text = el.innerText || "";
            if (text.length < 3) return;

            // Exclude Rally Cross
            if (text.toLowerCase().includes('cross') && pref.startsWith('D')) {
                return;
            }

            let matchedClass = null;
            for (let [keywords, className] of targetList) {
                if (isMatch(text, keywords)) {
                    matchedClass = className;
                    break;
                }
            }

            if (matchedClass) {
                let box = el.parentElement;
                let i = 0;
                let foundBox = null;

                while (box && i < 10) {
                    if (box.tagName === 'LI') {
                         if (box.innerText.toLowerCase().includes('uninstall') || box.querySelector('[class*="buy-link"]') || box.querySelector('[class*="acc-wrap"]')) {
                             foundBox = box;
                             break;
                         }
                    }
                    if (box.className.includes('item-box-wrap')) { foundBox = box; break; }
                    box = box.parentElement;
                    i++;
                }

                if (foundBox) {
                    if (foundBox.querySelector('.rh-ghost')) return;

                    const html = foundBox.innerHTML.toLowerCase();
                    const isBought = html.includes('uninstall') || html.includes('owned') || foundBox.classList.contains('bought');
                    const finalClass = isBought ? 'rh-owned' : matchedClass;

                    if (window.getComputedStyle(foundBox).position === 'static') {
                        foundBox.style.position = 'relative';
                    }

                    const ghost = document.createElement('div');
                    ghost.className = `rh-ghost ${finalClass}`;
                    foundBox.appendChild(ghost);
                }
            }
        });
    }

    function injectUI() {
        // 1. Strict Page Check: If NOT on racing, remove UI if it exists, and stop.
        if (!window.location.href.includes('racing')) {
            const existing = document.getElementById('rh-header-bar');
            if (existing) existing.remove();
            return;
        }

        // 2. If UI exists already, stop.
        if (document.getElementById('rh-header-bar')) return;

        // 3. Find Anchor
        const anchor = document.querySelector('.upgrade-list') ||
                       document.querySelector('.racing-main-wrap') ||
                       document.querySelector('.content-title');

        if (!anchor) return;

        const bar = document.createElement('div');
        bar.id = 'rh-header-bar';

        const saved = localStorage.getItem(STORAGE_KEY);

        bar.innerHTML = `
            <div style="display:flex; align-items:center;">
                <span style="color:#00ff00; font-weight:bold;">RACING GUIDE</span>
                <select id="rh-select">
                    <option value="">-- Choose Build --</option>
                    <option value="TL3" ${saved==='TL3'?'selected':''}>TL3 (Tarmac L)</option>
                    <option value="TS3" ${saved==='TS3'?'selected':''}>TS3 (Tarmac S)</option>
                    <option value="DL3" ${saved==='DL3'?'selected':''}>DL3 (Dirt L)</option>
                    <option value="DS3" ${saved==='DS3'?'selected':''}>DS3 (Dirt S)</option>
                </select>
            </div>
            <div class="rh-legend">
                <span><span class="rh-dot" style="background:#00ff00;"></span>Core</span>
                <span><span class="rh-dot" style="background:#ff00ff;"></span>Turbo</span>
                <span><span class="rh-dot" style="background:#0088ff;"></span>Susp</span>
                <span><span class="rh-dot" style="background:#ffd700;"></span>Gear</span>
            </div>
        `;

        anchor.parentElement.insertBefore(bar, anchor);

        const sel = document.getElementById('rh-select');
        sel.addEventListener('change', e => {
            localStorage.setItem(STORAGE_KEY, e.target.value);
            clearAllHighlights();
            scan();
        });
    }

    // --- LOOP ---
    setInterval(() => {
        injectUI();
        scan();
    }, 1000);

})();