// ==UserScript==
// @name        BEST BLOXD IO BEDWARS CHEAT AUTOBEDBREAK KILLAURA AIMBOT BOWAIMBOT...
// @namespace    https://your-unique-namespace.com/bedwars-panel
// @version      1.15
// @description  Bedwars client panel with multiple modules for display and control.
// @author       SHADOWSPULSE
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555286/BEST%20BLOXD%20IO%20BEDWARS%20CHEAT%20AUTOBEDBREAK%20KILLAURA%20AIMBOT%20BOWAIMBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/555286/BEST%20BLOXD%20IO%20BEDWARS%20CHEAT%20AUTOBEDBREAK%20KILLAURA%20AIMBOT%20BOWAIMBOT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('bedwarsPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'bedwarsPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '350px';
    panel.style.height = '500px';
    panel.style.background = 'rgba(15,15,35,0.95)';
    panel.style.color = '#ffcc00';
    panel.style.fontFamily = 'sans-serif';
    panel.style.border = '2px solid #00ff88';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.zIndex = 9999;
    panel.style.overflowY = 'auto';
    panel.style.display = 'none';

    const title = document.createElement('h2');
    title.innerText = 'Bedwars SuperTool v1.0';
    title.style.textAlign = 'center';
    title.style.color = '#00ff88';
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
        'Killaura',
        'Aimbot',
        'BowAimbot',
        'TriggerBot',
        'AutoGodBridge',
        'AutoTellyBridge',
        'AutoAndromedaBridge',
        'AutoNinjaBridge',
        'AutoSpeedGodBridge',
        'AutoSpeedTellyBridge',
        'Scaffold',
        'BedBreaker',
        'BlockThroughBreaker',
        'AutoMineBlocks',
        'FastRespawn',
        'AutoToolSwitch',
        'ESPPlayers',
        'AutoPickaxe',
        'SuperJump',
        'SpeedBoost'
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
    openBtn.innerText = 'Open Bedwars Panel';
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
