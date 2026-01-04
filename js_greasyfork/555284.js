// ==UserScript==
// @name         Best Bloxd IO Pulse Client
// @namespace    https://your-unique-namespace.com/best-bloxd-pulse
// @version      1.15
// @description  Best Bloxd IO client with multiple modules for display and control.
// @author       SHADOWSPULSE
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555284/Best%20Bloxd%20IO%20Pulse%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/555284/Best%20Bloxd%20IO%20Pulse%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('bloxdPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'bloxdPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '300px';
    panel.style.height = '400px';
    panel.style.background = 'rgba(11,18,32,0.95)';
    panel.style.color = '#9fb9ff';
    panel.style.fontFamily = 'sans-serif';
    panel.style.border = '2px solid #39d353';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.zIndex = 9999;
    panel.style.overflowY = 'auto';
    panel.style.display = 'none';

    const title = document.createElement('h2');
    title.innerText = 'Best Bloxd IO Pulse Client v3.14';
    title.style.textAlign = 'center';
    title.style.color = '#39d353';
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
        'Killaura','Aimbot','Fly','GodMode','AutoMine','AutoBuild','ESP','NoClip',
        'Teleport','Speed','Wallhack','RapidFire','AutoRespawn','LagSwitch','WeatherHack',
        'AutoRecharge','AutoAim','Radar','InfiniteAmmo','SilentAim','TriggerBot','FastPlace',
        'AutoLoot','Chams','AntiKick','InvisibleMode','RecoilControl','SuperJump','AutoSprint','TimeHack'
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
    openBtn.innerText = 'Open Best Bloxd Panel';
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
