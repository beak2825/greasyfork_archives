// ==UserScript==
// @name         TC PC Universal Randomizer Tester - Protected UI
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Protected UI with total freedom for Min/Max numbers
// @author       Ahnaf Tahmid (s0sukecube)
// @match        http://180.211.162.102:8444/basic_trade_onlinemark/online_marks_tcpc.php*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559602/TC%20PC%20Universal%20Randomizer%20Tester%20-%20Protected%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/559602/TC%20PC%20Universal%20Randomizer%20Tester%20-%20Protected%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Memory Setup
    const getSaved = (key, def) => localStorage.getItem(key) || def;

    // 2. Create Protected UI (Shadow DOM prevents website CSS from breaking the UI)
    const container = document.createElement('div');
    container.style = "position:fixed; top:80px; right:20px; z-index:2147483647; width:240px;";
    document.body.appendChild(container);

    const shadow = container.attachShadow({mode: 'open'});
    const ui = document.createElement('div');
    ui.style = `
        background: white; border: 4px solid black; padding: 15px;
        font-family: Arial, sans-serif; box-shadow: 8px 8px 0px rgba(0,0,0,0.3);
        color: black; display: flex; flex-direction: column; gap: 8px;
    `;

    ui.innerHTML = `
        <div style="background:black; color:white; text-align:center; font-weight:bold; padding:5px; margin:-15px -15px 10px -15px;">MARK RANDOMIZER TEST by Ahnaf Tahmid</div>

        <label style="font-size:12px; font-weight:bold;">TC Range:</label>
        <div style="display:flex; gap:5px;">
            <input type="number" id="tMin" value="${getSaved('tMin','33')}" style="width:100%; padding:5px; border:1px solid black;">
            <input type="number" id="tMax" value="${getSaved('tMax','39')}" style="width:100%; padding:5px; border:1px solid black;">
        </div>

        <label style="font-size:12px; font-weight:bold;">PC Range:</label>
        <div style="display:flex; gap:5px;">
            <input type="number" id="pMin" value="${getSaved('pMin','165')}" style="width:100%; padding:5px; border:1px solid black;">
            <input type="number" id="pMax" value="${getSaved('pMax','196')}" style="width:100%; padding:5px; border:1px solid black;">
        </div>

        <button id="run" style="background:#28a745; color:white; border:2px solid black; padding:10px; font-weight:bold; cursor:pointer; margin-top:5px;">RANDOM FILL PAGE</button>
        <button id="clr" style="background:white; border:1px solid #666; cursor:pointer; font-size:11px; padding:5px;">Clear All Inputs</button>
        <div id="stat" style="font-size:11px; text-align:center; color:blue; font-weight:bold; min-height:15px;"></div>
    `;
    shadow.appendChild(ui);

    // 3. Logic
    const getRandom = (min, max) => {
        const mn = parseInt(min);
        const mx = parseInt(max);
        return Math.floor(Math.random() * (mx - mn + 1)) + mn;
    };

    shadow.getElementById('run').addEventListener('click', () => {
        const tmin = shadow.getElementById('tMin').value;
        const tmax = shadow.getElementById('tMax').value;
        const pmin = shadow.getElementById('pMin').value;
        const pmax = shadow.getElementById('pMax').value;

        // Save settings so they persist across pages
        localStorage.setItem('tMin', tmin); localStorage.setItem('tMax', tmax);
        localStorage.setItem('pMin', pmin); localStorage.setItem('pMax', pmax);

        const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        let filled = 0;

        inputs.forEach(input => {
            const attr = (input.name + input.id).toLowerCase();
            if (attr.includes('tc')) {
                input.value = getRandom(tmin, tmax);
                filled++;
            } else if (attr.includes('pc')) {
                input.value = getRandom(pmin, pmax);
                filled++;
            }
            // Trigger site events so data is recognized
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        shadow.getElementById('stat').innerText = "Success! Filled " + filled + " fields.";
    });

    shadow.getElementById('clr').addEventListener('click', () => {
        document.querySelectorAll('input').forEach(i => {
            if ((i.name+i.id).toLowerCase().match(/tc|pc/)) i.value = "";
        });
        shadow.getElementById('stat').innerText = "Fields Cleared.";
    });

})();