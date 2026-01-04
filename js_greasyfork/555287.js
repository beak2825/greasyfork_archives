// ==UserScript==
// @name         Cave/Hole PvP BEST BLOXD HACK
// @namespace    https://your-unique-namespace.com/cave-pvp-panel
// @version      1.15
// @description  Cave/Hole PvP client panel with multiple modules for display and control.
// @author       SHADOWSPULSE
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555287/CaveHole%20PvP%20BEST%20BLOXD%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/555287/CaveHole%20PvP%20BEST%20BLOXD%20HACK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('cavePvPPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'cavePvPPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '350px';
    panel.style.height = '500px';
    panel.style.background = 'rgba(20,20,40,0.95)';
    panel.style.color = '#ff77ff';
    panel.style.fontFamily = 'sans-serif';
    panel.style.border = '2px solid #ff00ff';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.zIndex = 9999;
    panel.style.overflowY = 'auto';
    panel.style.display = 'none';

    const title = document.createElement('h2');
    title.innerText = 'Cave/Hole PvP Panel v1.0';
    title.style.textAlign = 'center';
    title.style.color = '#ff00ff';
    panel.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.display = 'block';
    closeBtn.style.margin = '10px auto';
    closeBtn.style.padding = '5px 10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => panel.style.display = 'none';
    panel.appendChild(closeBtn);

    const modules = [
        'Auto Spike Placer',
        'Auto Net Placer',
        'Killaura',
        'AutoBuff',
        'Auto Potion',
        'Potion AI Agent',
        'Anti Spike For Yourself',
        'Anti Net For Yourself',
        'No Slow In Net',
        'AI Helper',
        'AI Spike Placer',
        'AI Net Placer',
        'Stacked Potions'
    ];

    modules.forEach(m => {
        const div = document.createElement('div');
        div.style.margin = '5px 0';

        const label = document.createElement('label');
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '5px';
        checkbox.onclick = () => console.log(`${m} toggled ${checkbox.checked ? 'ON' : 'OFF'}`);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(m));
        div.appendChild(label);
        panel.appendChild(div);
    });

    const openBtn = document.createElement('button');
    openBtn.innerText = 'Open Cave PvP Panel';
    openBtn.style.position = 'fixed';
    openBtn.style.top = '10px';
    openBtn.style.right = '20px';
    openBtn.style.padding = '5px 10px';
    openBtn.style.zIndex = 9999;
    openBtn.style.cursor = 'pointer';
    openBtn.onclick = () => panel.style.display = 'block';
    document.body.appendChild(openBtn);

    document.body.appendChild(panel);
})();
