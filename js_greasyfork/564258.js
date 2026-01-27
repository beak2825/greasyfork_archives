// ==UserScript==
// @name         OpenFront.io 1v1 ranked opponent shower
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows who you're facing in 1v1, version with elo to come
// @author       Vous
// @match        https://openfront.io/*
// @icon         https://openfront.io/favicon.ico
// @grant        none@
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564258/OpenFrontio%201v1%20ranked%20opponent%20shower.user.js
// @updateURL https://update.greasyfork.org/scripts/564258/OpenFrontio%201v1%20ranked%20opponent%20shower.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.pathname.match(/\/w\d+\/game\/.+/)) return;

    let panelVisible = true;
    let panelMinimized = false;
    let panelData = null;
    let detectionAttempts = 0;
    const maxAttempts = 50;

    const style = document.createElement('style');
    style.textContent = `
        #game-info-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 250px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            user-select: none;
            transition: all 0.3s ease;
        }

        #game-info-panel.minimized {
            width: 40px;
            height: 40px;
            overflow: hidden;
        }

        #game-info-panel.hidden {
            transform: translateX(120%);
            opacity: 0;
        }

        .panel-header {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-title {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.5px;
            opacity: 0.9;
        }

        .panel-controls {
            display: flex;
            gap: 8px;
        }

        .panel-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s;
            font-weight: bold;
        }

        .panel-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .panel-content {
            padding: 20px 15px;
        }

        .vs-display {
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .player-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            align-items: center;
        }

        .player-name {
            font-size: 14px;
            font-weight: 500;
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .player-elo {
            font-size: 14px;
            font-weight: 600;
            color: #FFD700;
        }

        .minimized-content {
            display: none;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
        }

        #game-info-panel.minimized .minimized-content {
            display: flex;
        }

        #game-info-panel.minimized .panel-header,
        #game-info-panel.minimized .panel-content {
            display: none;
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'game-info-panel';
    panel.classList.add('hidden');
    panel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">Partie 1v1</div>
            <div class="panel-controls">
                <button class="panel-btn minimize-btn">-</button>
                <button class="panel-btn close-btn">x</button>
            </div>
        </div>
        <div class="panel-content">
            <div class="vs-display" id="vs-display">Detection en cours...</div>
            <div class="player-info">
                <div class="player-name" id="player1-name">-</div>
                <div class="player-elo" id="player1-elo">ELO: ???</div>
            </div>
            <div class="player-info">
                <div class="player-name" id="player2-name">-</div>
                <div class="player-elo" id="player2-elo">ELO: ???</div>
            </div>
        </div>
        <div class="minimized-content">
            <button class="panel-btn restore-btn">+</button>
        </div>
    `;
    document.body.appendChild(panel);

    const vsDisplay = document.getElementById('vs-display');
    const player1Name = document.getElementById('player1-name');
    const player2Name = document.getElementById('player2-name');
    const player1Elo = document.getElementById('player1-elo');
    const player2Elo = document.getElementById('player2-elo');
    const minimizeBtn = panel.querySelector('.minimize-btn');
    const closeBtn = panel.querySelector('.close-btn');
    const restoreBtn = panel.querySelector('.restore-btn');

    let isDragging = false;
    let offsetX, offsetY;

    panel.querySelector('.panel-header').addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
        if (e.target.classList.contains('panel-btn')) return;
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        panel.style.transition = 'none';
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
        panel.style.right = 'auto';
        panel.style.transform = 'none';
    }

    function stopDrag() {
        isDragging = false;
        panel.style.transition = 'all 0.3s ease';
    }

    minimizeBtn.addEventListener('click', () => {
        panelMinimized = !panelMinimized;
        if (panelMinimized) {
            panel.classList.add('minimized');
            minimizeBtn.textContent = '+';
        } else {
            panel.classList.remove('minimized');
            minimizeBtn.textContent = '-';
        }
    });

    closeBtn.addEventListener('click', () => {
        panelVisible = false;
        panel.classList.add('hidden');
        setTimeout(() => {
            panelVisible = true;
            panel.classList.remove('hidden');
        }, 30000);
    });

    restoreBtn.addEventListener('click', () => {
        panelMinimized = false;
        panel.classList.remove('minimized');
        minimizeBtn.textContent = '-';
    });

    let foundGameData = false;

    function scanConsoleHistory() {
        detectionAttempts++;
        console.log(`[Game Panel] Tentative ${detectionAttempts}/${maxAttempts} - Scan de l'historique console...`);

        const logs = [];
        const originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error
        };

        const proxyHandler = {
            apply: function(target, thisArg, args) {
                logs.push(args.join(' '));
                return target.apply(thisArg, args);
            }
        };

        console.log = new Proxy(originalConsole.log, proxyHandler);
        console.info = new Proxy(originalConsole.info, proxyHandler);
        console.warn = new Proxy(originalConsole.warn, proxyHandler);
        console.error = new Proxy(originalConsole.error, proxyHandler);

        for (const log of logs) {
            if (log.includes('lobby: game started:')) {
                try {
                    const jsonStart = log.indexOf('{');
                    const jsonStr = log.substring(jsonStart);
                    const data = JSON.parse(jsonStr);

                    if (data.gameStartInfo &&
                        data.gameStartInfo.config &&
                        data.gameStartInfo.config.rankedType === '1v1' &&
                        data.gameStartInfo.players &&
                        data.gameStartInfo.players.length >= 2) {

                        console.log(`[Game Panel] SUCCES Tentative ${detectionAttempts} - Partie 1v1 detectee!`);
                        foundGameData = true;
                        updatePanel(data.gameStartInfo.players[0].username, data.gameStartInfo.players[1].username);

                        console.log = originalConsole.log;
                        console.info = originalConsole.info;
                        console.warn = originalConsole.warn;
                        console.error = originalConsole.error;
                        return true;
                    }
                } catch (e) {
                    console.log(`[Game Panel] ERREUR Tentative ${detectionAttempts} - ${e.message}`);
                }
            }
        }

        console.log = originalConsole.log;
        console.info = originalConsole.info;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;

        if (detectionAttempts >= maxAttempts) {
            console.log(`[Game Panel] ARRET Apres ${maxAttempts} tentatives - Aucune partie 1v1 detectee`);
            vsDisplay.textContent = 'Aucune partie 1v1 detectee';
            return false;
        }

        return false;
    }

    function updatePanel(username1, username2) {
        const cleanName1 = username1.replace(/^\[.*?\]\s*/, '');
        const cleanName2 = username2.replace(/^\[.*?\]\s*/, '');

        vsDisplay.textContent = `${cleanName1} VS ${cleanName2}`;
        player1Name.textContent = cleanName1;
        player2Name.textContent = cleanName2;

        panelVisible = true;
        panel.classList.remove('hidden');
        panelData = {
            player1: cleanName1,
            player2: cleanName2
        };

        console.log(`[Game Panel] Panel mis a jour: ${cleanName1} vs ${cleanName2}`);
    }

    console.log('[Game Panel] Script charge. Demarrage du scanner...');

    const scanInterval = setInterval(() => {
        if (foundGameData || detectionAttempts >= maxAttempts) {
            clearInterval(scanInterval);
            console.log(`[Game Panel] Scanner ${foundGameData ? 'reussi' : 'arrete'} apres ${detectionAttempts} tentatives`);
            return;
        }
        scanConsoleHistory();
    }, 1000);

    window.addEventListener('beforeunload', () => {
        clearInterval(scanInterval);
    });
})();