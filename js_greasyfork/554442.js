// ==UserScript==
// @name         Minimap Spectator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Better minimap
// @author       Bob
// @match        *://agar.cc/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuF_KSuaJJEkISFCeRF_8UkaxXr60DgP7keQ&s
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554442/Minimap%20Spectator.user.js
// @updateURL https://update.greasyfork.org/scripts/554442/Minimap%20Spectator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let botPlayerList = {};
    let virusList = {};
    let botWs = null;
    let botOwnCellIds = [];
    let botPosition = { x: 0, y: 0 };
    let isBotInitialized = false;
    let capturedServerUrl = null;
    let isMinimapRenderingEnabled = true;
    const VIRUS_COLOR = '#89F336'; // A nice, vibrant lime green

    let mainCtx = null;
    let mainCanvas = null;
    let isMinimapReadyToDraw = false;

    const originalRequestAnimationFrame = unsafeWindow.requestAnimationFrame;
    unsafeWindow.requestAnimationFrame = function(callback) {
        const handle = originalRequestAnimationFrame(callback);

        if (isMinimapReadyToDraw) {
            drawPlayersOnMinimap();
        }
        return handle;
    };
    console.log("MINIMAP: Render loop hooked at document-start.");


    const OriginalWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function(url, protocols) {
        if (url.includes('wss://server.z2se.in') && !url.includes('key=null') && !isBotInitialized) {
            console.log('SPECTATOR: Game server URL captured:', url);
            capturedServerUrl = url;
            isBotInitialized = true;
            startSpectatorBot(url);
        }
        return protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
    };
    unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;

    function startSpectatorBot(serverUrl) {
        connect(serverUrl);
        /*
        setInterval(() => {
            console.clear();
            console.log("--- Spectator Bot Position ---");
            console.log(botPosition);
            console.log("--- Visible Players ---");
            console.table(Object.values(botPlayerList));
        }, 10000);*/
    }
    function resetSpectatorBot() {
        if (!capturedServerUrl) {
            console.log("SPECTATOR: Cannot refresh bot, server URL not captured yet.");
            return;
        }

        console.log("SPECTATOR: Refreshing bot connection...");

        if (botWs) {
            botWs.onclose = null;
            botWs.close();
        }

        botPlayerList = {};
        virusList = {};
        botOwnCellIds = [];
        botPosition = { x: 0, y: 0 };
        botWs = null;

        setTimeout(() => {
            connect(capturedServerUrl);
        }, 250);
    }

    function connect(serverUrl){console.log(`SPECTATOR: Connecting to server...`);if(botWs){botWs.onopen=null;botWs.onmessage=null;botWs.onclose=null;botWs.close()}botWs=new WebSocket(serverUrl);botWs.binaryType="arraybuffer";botWs.onopen=onWsOpen;botWs.onmessage=onWsMessage;botWs.onclose=onWsClose;botWs.onerror=(err)=>console.error(`SPECTATOR: WebSocket error:`,err)}
    function onWsOpen(){console.log(`SPECTATOR: Connected.`);let msg;msg=prepareData(5);msg.setUint8(0,254);msg.setUint32(1,5,true);wsSend(msg);msg=prepareData(5);msg.setUint8(0,255);msg.setUint32(1,123456789,true);wsSend(msg);sendUint8(1)}
    function onWsClose(){console.log(`SPECTATOR: Socket closed.`)}
    function onWsMessage(msg){handleWsMessage(new DataView(msg.data))}
    function prepareData(a){return new DataView(new ArrayBuffer(a))}
    function wsSend(a){if(botWs&&botWs.readyState===WebSocket.OPEN){botWs.send(a.buffer)}}
    function sendUint8(a){const msg=prepareData(1);msg.setUint8(0,a);wsSend(msg)}
    function handleWsMessage(msg){function getString(){let text='',char;while((char=msg.getUint16(offset,true))!==0){offset+=2;text+=String.fromCharCode(char)}offset+=2;return text}let offset=0;if(msg.getUint8(offset)===240){offset+=5}switch(msg.getUint8(offset++)){case 16:updateNodes(msg,offset);break;case 20:botOwnCellIds=[];break;case 32:const myCellId=msg.getUint32(offset,true);if(!botOwnCellIds.includes(myCellId)){botOwnCellIds.push(myCellId)}break}}
    function parsePlayerName(rawName){if(!rawName)return'';let cleanName=rawName;const braceIndex=cleanName.indexOf('}');if(braceIndex!==-1)cleanName=cleanName.substring(braceIndex+1);const asteriskIndex=cleanName.indexOf('*');if(asteriskIndex!==-1)cleanName=cleanName.substring(0,asteriskIndex);return cleanName||''}
    function updateNodes(dataView, offset) {
        function getString() {
            let text = '', char;
            while ((char = dataView.getUint16(offset, true)) !== 0) {
                offset += 2;
                text += String.fromCharCode(char);
            }
            offset += 2;
            return text;
        }

        const cellsEatenCount = dataView.getUint16(offset, true);
        offset += 2 + (cellsEatenCount * 8);

        const myCellsThisUpdate = [];

        while (true) {
            const nodeId = dataView.getUint32(offset, true);
            offset += 4;
            if (nodeId === 0) break;

            const posX = dataView.getInt16(offset, true); offset += 2;
            const posY = dataView.getInt16(offset, true); offset += 2;
            const size = dataView.getInt16(offset, true); offset += 2;

            const r = dataView.getUint8(offset++);
            const g = dataView.getUint8(offset++);
            const b = dataView.getUint8(offset++);

            let colorHex = ((r << 16) | (g << 8) | b).toString(16);
            while (colorHex.length < 6) { colorHex = "0" + colorHex; }
            const cellColor = "#" + colorHex;

            const flags = dataView.getUint8(offset++);
            const isVirus = !!(flags & 1);

            if (flags & 2) offset += 4;
            if (flags & 4) offset += 8;
            if (flags & 8) offset += 16;

            const rawName = getString();
            const cleanName = parsePlayerName(rawName);
            const mass = Math.floor(size * size / 100);

            if (botOwnCellIds.includes(nodeId)) {
                myCellsThisUpdate.push({ x: posX, y: posY, mass: mass });
            }

            if (cleanName && !isVirus) {
                botPlayerList[nodeId] = {
                    id: nodeId, name: cleanName, x: posX, y: posY, mass: mass, color: cellColor
                };
            } else if (isVirus) {
                // If it's a virus, add it to our new virusList
                virusList[nodeId] = {
                    id: nodeId, x: posX, y: posY, mass: mass
                };
            }
        }

        const cellsRemovedCount = dataView.getUint32(offset, true);
        offset += 4;
        for (let i = 0; i < cellsRemovedCount; i++) {
            const removedNodeId = dataView.getUint32(offset, true);
            offset += 4;
            if (botPlayerList[removedNodeId]) {
                delete botPlayerList[removedNodeId];
            }
            if (virusList[removedNodeId]) {
                delete virusList[removedNodeId];
            }
            const indexInOwn = botOwnCellIds.indexOf(removedNodeId);
            if (indexInOwn > -1) {
                botOwnCellIds.splice(indexInOwn, 1);
            }
        }

        if (myCellsThisUpdate.length > 0) {
            let totalMass = 0, totalX = 0, totalY = 0;
            myCellsThisUpdate.forEach(cell => {
                totalX += cell.x * cell.mass;
                totalY += cell.y * cell.mass;
                totalMass += cell.mass;
            });
            botPosition.x = Math.round(totalX / totalMass);
            botPosition.y = Math.round(totalY / totalMass);
        }
    }

    const MINIMAP_MASS_THRESHOLD = 2000;
    const MINIMAP_GAME_DIMENSIONS = { width: 18500, height: 18500 };

    window.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key.toUpperCase() === 'M') {
            event.preventDefault();

            isMinimapRenderingEnabled = !isMinimapRenderingEnabled;

            console.log(`Minimap rendering has been ${isMinimapRenderingEnabled ? 'ENABLED' : 'DISABLED'}.`);
        }
        if (event.ctrlKey && event.key.toUpperCase() === 'M') {
            event.preventDefault();
            resetSpectatorBot();
        }
    });

    function drawPlayersOnMinimap() {
        if (!isMinimapRenderingEnabled || Object.keys(botPlayerList).length === 0) {
            return;
        }

        const minimapSize = 200;
        const mapX = mainCanvas.width - minimapSize - 10;
        const mapY = mainCanvas.height - minimapSize - 5;
        const playersToDraw = Object.values(botPlayerList).filter(p => p.mass > MINIMAP_MASS_THRESHOLD);
        playersToDraw.sort((a, b) => a.mass - b.mass);

        mainCtx.save();
        for (const player of playersToDraw) {
            const minimapPlayerX = mapX + (player.x / MINIMAP_GAME_DIMENSIONS.width) * minimapSize;
            const minimapPlayerY = mapY + (player.y / MINIMAP_GAME_DIMENSIONS.height) * minimapSize;
            const playerRadiusInGame = 10 * Math.sqrt(player.mass);
            const dotRadius = Math.max(2, playerRadiusInGame / (minimapSize / 2));
            const dotColor = player.color || '#ffffff';

            mainCtx.beginPath();
            mainCtx.arc(minimapPlayerX, minimapPlayerY, dotRadius, 0, 2 * Math.PI);
            mainCtx.fillStyle = dotColor;
            mainCtx.fill();
            mainCtx.strokeStyle = 'black';
            mainCtx.lineWidth = 0.5;
            mainCtx.stroke();
        }
        if (Object.keys(virusList).length > 0) {

            mainCtx.shadowColor = VIRUS_COLOR;
            mainCtx.shadowBlur = 5;

            for (const virus of Object.values(virusList)) {
                const minimapVirusX = mapX + (virus.x / MINIMAP_GAME_DIMENSIONS.width) * minimapSize;
                const minimapVirusY = mapY + (virus.y / MINIMAP_GAME_DIMENSIONS.height) * minimapSize;
                const dotRadius = 4;

                mainCtx.beginPath();
                mainCtx.arc(minimapVirusX, minimapVirusY, dotRadius, 0, 2 * Math.PI);
                mainCtx.fillStyle = VIRUS_COLOR;
                mainCtx.fill();
                mainCtx.strokeStyle = 'black';
                mainCtx.lineWidth = 0.5;
                mainCtx.stroke();
            }
        }
        mainCtx.restore();
    }

    function initializeMinimapCanvas() {
        mainCanvas = document.getElementById('canvas');
        if (mainCanvas) {
            mainCtx = mainCanvas.getContext('2d');
            isMinimapReadyToDraw = true;
            console.log("MINIMAP: Canvas found. Drawing is now enabled.");
        } else {
            setTimeout(initializeMinimapCanvas, 250);
        }
    }

    window.addEventListener('DOMContentLoaded', initializeMinimapCanvas);

})();