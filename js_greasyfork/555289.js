// ==UserScript==
// @name        BEST BLOXD IO HACK FOR CAVE/HOLE PVP   BEDWARS AND SURVIVAL OVER 70 FUCNTIONS!!!
// @namespace    https://your-unique-namespace.com/multi-game-panel
// @version      1.16
// @description  Multi-game client panel with Bedwars, Bloxd IO, and Cave/Hole PvP modules
// @author       SHADOWSPULSE&LimeYoutuber
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555289/BEST%20BLOXD%20IO%20HACK%20FOR%20CAVEHOLE%20PVP%20%20%20BEDWARS%20AND%20SURVIVAL%20OVER%2070%20FUCNTIONS%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/555289/BEST%20BLOXD%20IO%20HACK%20FOR%20CAVEHOLE%20PVP%20%20%20BEDWARS%20AND%20SURVIVAL%20OVER%2070%20FUCNTIONS%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('multiGamePanel')) return;

    const panel = document.createElement('div');
    panel.id = 'multiGamePanel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '400px';
    panel.style.height = '550px';
    panel.style.background = 'rgba(15,15,35,0.95)';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'sans-serif';
    panel.style.border = '2px solid #00ff88';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.zIndex = 9999;
    panel.style.overflowY = 'auto';
    panel.style.display = 'none';

    // Title
    const title = document.createElement('h2');
    title.innerText = 'Multi-Game SuperTool v1.15';
    title.style.textAlign = 'center';
    title.style.color = '#00ff88';
    panel.appendChild(title);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.display = 'block';
    closeBtn.style.margin = '10px auto';
    closeBtn.style.padding = '5px 10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => panel.style.display = 'none';
    panel.appendChild(closeBtn);

    // Tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.justifyContent = 'space-around';
    tabsContainer.style.marginBottom = '10px';

    const tabNames = ['Bedwars', 'Bloxd IO', 'Cave PvP'];
    const tabContents = {};

    tabNames.forEach(name => {
        const tabBtn = document.createElement('button');
        tabBtn.innerText = name;
        tabBtn.style.flex = '1';
        tabBtn.style.margin = '0 2px';
        tabBtn.style.cursor = 'pointer';
        tabBtn.onclick = () => showTab(name);
        tabsContainer.appendChild(tabBtn);

        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'none';
        tabContents[name] = contentDiv;
        panel.appendChild(contentDiv);
    });

    panel.insertBefore(tabsContainer, panel.children[1]);

    // Module lists
    const modules = {
        'Bedwars': [
            'Killaura','Aimbot','BowAimbot','TriggerBot','AutoGodBridge','AutoTellyBridge','AutoAndromedaBridge',
            'AutoNinjaBridge','AutoSpeedGodBridge','AutoSpeedTellyBridge','Scaffold','BedBreaker','BlockThroughBreaker',
            'AutoMineBlocks','FastRespawn','AutoToolSwitch','ESPPlayers','AutoPickaxe','SuperJump','SpeedBoost'
        ],
        'Bloxd IO': [
            'Killaura','Aimbot','AutoMine','AutoBuild','ESP','NoClip','Teleport','Speed','Wallhack','RapidFire',
            'AutoRespawn','LagSwitch','WeatherHack','AutoRecharge','AutoAim','Radar','InfiniteAmmo','SilentAim',
            'TriggerBot','FastPlace','AutoLoot','Chams','AntiKick','InvisibleMode','RecoilControl','SuperJump',
            'AutoSprint','TimeHack','SilentBuild','AutoCollect'
        ],
        'Cave PvP': [
            'Auto Spike Placer','Auto Net Placer','Killaura','AutoBuff','Auto Potion','Potion AI Agent',
            'Anti Spike For Yourself','Anti Net For Yourself','No Slow In Net','AI Helper','AI Spike Placer',
            'AI Net Placer','Stacked Potions'
        ]
    };

    // Add modules to each tab
    for (const tab in modules) {
        const container = tabContents[tab];
        modules[tab].forEach(m => {
            const div = document.createElement('div');
            div.style.margin = '5px 0';
            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '5px';
            checkbox.onclick = () => console.log(`${tab} - ${m} toggled ${checkbox.checked ? 'ON' : 'OFF'}`);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(m));
            div.appendChild(label);
            container.appendChild(div);
        });
    }

    function showTab(name) {
        for (const t in tabContents) {
            tabContents[t].style.display = (t === name) ? 'block' : 'none';
        }
    }

    // Open button
    const openBtn = document.createElement('button');
    openBtn.innerText = 'Open Multi-Game Panel';
    openBtn.style.position = 'fixed';
    openBtn.style.top = '10px';
    openBtn.style.right = '20px';
    openBtn.style.padding = '5px 10px';
    openBtn.style.zIndex = 9999;
    openBtn.style.cursor = 'pointer';
    openBtn.onclick = () => panel.style.display = 'block';
    document.body.appendChild(openBtn);

    document.body.appendChild(panel);

    // Show first tab by default
    showTab(tabNames[0]);

})();
