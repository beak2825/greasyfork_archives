// ==UserScript==
// @name            OpenFront.IO UI Enhancer
// @version         1.0.1
// @description     Enhances the OpenFront.IO game interface with troop ratios, visual indicators, and threat icons for better decision making.
// @author          Speedrunner
// @license         MIT
// @namespace       https://greasyfork.org/
// @match           *://*.openfront.io/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @icon            https://images4.imagebam.com/94/4a/ff/ME190M0L_o.png
// @downloadURL https://update.greasyfork.org/scripts/560119/OpenFrontIO%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560119/OpenFrontIO%20UI%20Enhancer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const ATOM_COST = 750000;
    const HYDROGEN_COST = 5000000;
    const ATOM_ICON = "🚀";
    const HYDROGEN_ICON = "💥";

    const CURRENT_WEAKNESS_THRESHOLD = 0.1;
    const TOTAL_POTENTIAL_THRESHOLD = 0.3;
    const DANGER_TRESHOLD = 1.35;

    const style = document.createElement('style');
    style.textContent = `
        .flashing-orange {
            color: white !important;
            animation: flash 0.2s infinite;
        }
        @keyframes flash {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
        }

        .player-name-span {
            font-family: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace;
            color: black;
            text-shadow: 0 0 0.03em #ffffffff;
            font-weight: 600;
        }

        .player-troops {
            font-family: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace;
            text-shadow: 0 0 0.03em #ffffffff;
            font-weight: 600;
        }

        .max-troops {
            font-size: 0.65em;
            color: #3b3b3bff;
            text-shadow: 0 0 0.05em #ffffffff;
        }

        .troop-ratio-bar {
            width: 30px;
            height: 4px;
            background-color: rgba(34,34,34,0.5);
            position: relative;
            margin-top: 0px;
            border: 1px solid rgba(68, 68, 68, 0.6);
        }

        .ratio-fill-bar, .ratio-buffer-bar {
            height: 100%;
            position: absolute;
        }

        .ratio-buffer-bar {
            background-color: rgba(255, 166, 0, 0.48);
        }
    `;
    document.head.appendChild(style);

    let showRatioBar = GM_getValue('showRatioBar', true);
    let showTroopRatios = GM_getValue('showTroopRatios', true);
    let showWeaknessIndicator = GM_getValue('showWeaknessIndicator', true);
    let showDangerIndicator = GM_getValue('showDangerIndicator', true);
    let showThreatIcons = GM_getValue('showThreatIcons', true);

    GM_registerMenuCommand('Toggle Ratio/Health Bar', () => {
        showRatioBar = !showRatioBar;
        GM_setValue('showRatioBar', showRatioBar);
        const bars = document.querySelectorAll('.troop-ratio-bar');
        bars.forEach(bar => {
            bar.style.display = showRatioBar ? '' : 'none';
        });
    });

    GM_registerMenuCommand('Toggle Max Troops', () => {
        showTroopRatios = !showTroopRatios;
        GM_setValue('showTroopRatios', showTroopRatios);
        const troops = nameLayerContainer.querySelectorAll('.player-troops');
        troops.forEach(troopDiv => updateTroopDisplay(troopDiv));
    });

    GM_registerMenuCommand('Toggle Weakness Indicator (Flashing Orange)', () => {
        showWeaknessIndicator = !showWeaknessIndicator;
        GM_setValue('showWeaknessIndicator', showWeaknessIndicator);
        const troops = nameLayerContainer.querySelectorAll('.player-troops');
        troops.forEach(troopDiv => updateTroopDisplay(troopDiv));
    });

    GM_registerMenuCommand('Toggle Danger Indicator (Red Troop Count)', () => {
        showDangerIndicator = !showDangerIndicator;
        GM_setValue('showDangerIndicator', showDangerIndicator);
        const troops = nameLayerContainer.querySelectorAll('.player-troops');
        troops.forEach(troopDiv => updateTroopDisplay(troopDiv));
    });

    GM_registerMenuCommand('Toggle Threat Icons', () => {
        showThreatIcons = !showThreatIcons;
        GM_setValue('showThreatIcons', showThreatIcons);
        const troops = nameLayerContainer.querySelectorAll('.player-troops');
        troops.forEach(troopDiv => updateTroopDisplay(troopDiv));
    });

    GM_registerMenuCommand('Show Current Settings', () => {
        console.log('Troop Script Settings:');
        console.log('Ratio/Health Bar:', showRatioBar ? 'ON' : 'OFF');
        console.log('Troop Ratios:', showTroopRatios ? 'ON' : 'OFF');
        console.log('Weakness Indicator:', showWeaknessIndicator ? 'ON' : 'OFF');
        console.log('Danger Indicator:', showDangerIndicator ? 'ON' : 'OFF');
        console.log('Threat Icons:', showThreatIcons ? 'ON' : 'OFF');
        alert('Check the browser console (F12) for current settings.');
    });

    let game = null;
    let nameLayerContainer = null;

    function waitForGame() {
        try {
            const leaderboard = document.querySelector('leader-board');
            if (leaderboard && leaderboard.game) {
                game = leaderboard.game;
                findNameLayerContainer();
            } else {
                setTimeout(waitForGame, 1000);
            }
        } catch (e) {
            console.error('Error in waitForGame:', e);
        }
    }

    function findNameLayerContainer() {
        try {
            const containers = document.querySelectorAll('div[style*="position: fixed"][style*="left: 50%"][style*="top: 50%"][style*="pointer-events: none"][style*="z-index: 2"]'); // Fragile; update if site layout changes
            if (containers.length > 0) {
                nameLayerContainer = containers[0];
                setupObservers();
            } else {
                setTimeout(findNameLayerContainer, 1000);
            }
        } catch (e) {
            console.error('Error in findNameLayerContainer:', e);
        }
    }

    function setupObservers() {
        try {
            const containerObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const troopsDiv = node.querySelector('.player-troops');
                            if (troopsDiv) {
                                setupTroopObserver(troopsDiv);
                            }
                        }
                    });
                });
            });

            containerObserver.observe(nameLayerContainer, { childList: true, subtree: true });

            const existingTroops = nameLayerContainer.querySelectorAll('.player-troops');
            existingTroops.forEach(setupTroopObserver);
        } catch (e) {
            console.error('Error in setupObservers:', e);
        }
    }

    function setupTroopObserver(troopsDiv) {
        const observer = new MutationObserver((mutations) => {
            if (troopsDiv.textContent && !troopsDiv.textContent.includes('/')) {
                updateTroopDisplay(troopsDiv);
            }
        });

        observer.observe(troopsDiv, { childList: true, characterData: true, subtree: true });
        troopsDiv._observer = observer;
    }

    function updateTroopDisplay(troopsDiv) {
        if (!game) return;

        const myPlayer = game.myPlayer();

        const element = troopsDiv.parentElement;
        if (!element) return;

        const nameSpan = element.querySelector('.player-name-span');
        if (!nameSpan) return;

        const playerName = nameSpan.innerHTML.replace(new RegExp(`${ATOM_ICON}|${HYDROGEN_ICON}`, 'g'), "");

        const players = game.playerViews();
        const player = players.find(p => p.name() === playerName || p.displayName() === playerName);
        if (!player) return;

        const observer = troopsDiv._observer;
        if (observer) observer.disconnect(); // Prevent triggering on our own DOM updates

        try {
            const currentTroops = player.troops();
            const maxTroops = game.config().maxTroops(player);
            const attackingTroops = player.outgoingAttacks().reduce((sum, attack) => sum + (attack.retreating ? 0 : attack.troops), 0);

            if (isNaN(currentTroops) || isNaN(maxTroops) || isNaN(attackingTroops)) return;

            // Troop ratio display
            const formattedCurrent = formatTroopCount(currentTroops);
            const formattedMax = formatTroopCount(maxTroops);
            troopsDiv.innerHTML = showTroopRatios ? `${formattedCurrent}<span class="max-troops">/${formattedMax}</span>` : formattedCurrent;

            // Ratio bar
            let ratioBar = element.querySelector('.troop-ratio-bar');
            let fill, bufferFill;

            if (!ratioBar) {
                ratioBar = document.createElement('div');
                ratioBar.className = 'troop-ratio-bar';

                fill = document.createElement('div');
                fill.className = 'ratio-fill-bar';

                bufferFill = document.createElement('div');
                bufferFill.className = 'ratio-buffer-bar';

                ratioBar.appendChild(fill);
                ratioBar.appendChild(bufferFill);
                element.appendChild(ratioBar);
            } else {
                fill = ratioBar.firstElementChild;
                bufferFill = ratioBar.lastElementChild;
            }

            const isBot = player.type() === 'BOT';

            if (!showRatioBar || isBot) {
                ratioBar.style.display = 'none';
            } else {
                ratioBar.style.display = '';

                const totalPotential = currentTroops + attackingTroops;
                const totalRatio = maxTroops > 0 ? Math.min(totalPotential / maxTroops, 1) : 0;
                const mainRatio = attackingTroops === 0 ? 1 : (totalPotential > 0 ? currentTroops / totalPotential : 0);
                const bufferRatio = attackingTroops === 0 ? 0 : (totalPotential > 0 ? attackingTroops / totalPotential : 0);

                const mainWidth = mainRatio * totalRatio * 100;
                const bufferWidth = bufferRatio * totalRatio * 100;

                fill.style.width = mainWidth + '%';
                fill.style.backgroundColor = 'rgba(0,255,0,0.7)';

                bufferFill.style.width = bufferWidth + '%';
                bufferFill.style.left = mainWidth + '%';
            }

            const isTeamMode = game.config().gameConfig().gameMode === 'Team';

            // Dynamic danger coloring
            if (myPlayer && player.id() !== myPlayer.id()) {
                troopsDiv.style.color = 'black';

                const myTroops = myPlayer.troops();
                if (!isNaN(myTroops) && myTroops > 0) {
                    const dangerRatio = currentTroops / myTroops; // Does not take into account attackingTroops atm (not sure if neccessary as it might get confusing)

                    if (showWeaknessIndicator && currentTroops <= CURRENT_WEAKNESS_THRESHOLD * maxTroops && (currentTroops + attackingTroops) < TOTAL_POTENTIAL_THRESHOLD * maxTroops) {
                        troopsDiv.classList.add('flashing-orange');
                    } else if (showDangerIndicator && dangerRatio >= DANGER_TRESHOLD) {
                        troopsDiv.classList.remove('flashing-orange');
                        if (!isTeamMode || !player.isOnSameTeam(myPlayer)) {
                            troopsDiv.style.color = 'red';
                        }
                    } else {
                        troopsDiv.classList.remove('flashing-orange');
                    }
                }
            } else {
                troopsDiv.classList.remove('flashing-orange');
                troopsDiv.style.color = '';
            }

            // Threat indicator for nuke capability
            let icon = "";
            if (showThreatIcons && (!myPlayer || myPlayer.id() !== player.id())) {
                const hasSilo = player.units("Missile Silo").length > 0;
                const playerGold = isNaN(Number(player.gold())) ? 0 : Number(player.gold());
                if (hasSilo) {
                    if (playerGold >= HYDROGEN_COST) {
                        icon = HYDROGEN_ICON;
                    } else if (playerGold >= ATOM_COST) {
                        icon = ATOM_ICON;
                    }
                }
            }

            nameSpan.innerHTML = playerName + (icon ? `<span style="font-size: smaller; opacity: 0.6;">${icon}</span>` : "");

        } catch (e) {
            console.error('Error in updateTroopDisplay:', e);
        }

        if (observer) observer.observe(troopsDiv, { childList: true, characterData: true, subtree: true });
    }

    function formatTroopCount(troops) {
        const num = troops / 10;
        if (num >= 10000000) return (Math.floor(num / 100000) / 10).toFixed(1) + "M";
        if (num >= 1000000) return (Math.floor(num / 10000) / 100).toFixed(2) + "M";
        if (num >= 100000) return Math.floor(num / 1000) + "K";
        if (num >= 10000) return (Math.floor(num / 100) / 10).toFixed(1) + "K";
        if (num >= 1000) return (Math.floor(num / 10) / 100).toFixed(2) + "K";
        return Math.floor(num).toString();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForGame);
    } else {
        waitForGame();
    }
})();