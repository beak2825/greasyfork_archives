// ==UserScript==
// @name         GeoGuessr Auto-Save to Google Sheets
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically saves all solo games to Google Sheets and tracks current games
// @author       Flykii
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.geoguessr.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547918/GeoGuessr%20Auto-Save%20to%20Google%20Sheets.user.js
// @updateURL https://update.greasyfork.org/scripts/547918/GeoGuessr%20Auto-Save%20to%20Google%20Sheets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        GOOGLE_SCRIPT_URL: 'YOUR_URL_HERE',
        DELAY_MS: 500,
        INITIAL_SCAN_PAGES: 20,
        CHECK_INTERVAL: 30000
    };

    let isScanning = false;
    let currentGameToken = null;
    let lastProcessedTime = GM_getValue('lastProcessedTime', Date.now() - 24*60*60*1000);

    function init() {
        console.log('Solo Stats - GeoGuessr Auto-Save to Google Sheets');

        setTimeout(() => {
            scanRecentGames();
        }, 2000);

        startGameMonitoring();

        setInterval(() => {
            if (!isScanning) {
                scanRecentGames();
            }
        }, CONFIG.CHECK_INTERVAL);

        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                handleUrlChange(currentUrl);
            }
        }, 1000);
        checkFirstTime();
    }
    function createHistoricalImportUI() {
        const importUI = document.createElement('div');
        importUI.id = 'historical-import-ui';
        importUI.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #4caf50;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10001;
                font-family: Arial, sans-serif;
                max-width: 400px;
                text-align: center;
            ">
                <h3 style="margin-top: 0; color: #4caf50;">Import Historical Games into your Google Sheet</h3>
                <p style="margin: 15px 0;">Import your previous solo Geoguessr games?</p>
                <div style="margin: 15px 0;">
                    <label for="pageCount">Pages to scan:</label><br>
                    <input type="number" id="pageCount" value="10" min="1" max="100" style="
                        margin: 5px;
                        padding: 5px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        width: 60px;
                    ">
                </div>
                <div style="margin: 15px 0;">
                    <button id="startImport" style="
                        background: #4caf50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 5px;
                    ">Start Import</button>
                    <button id="cancelImport" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 5px;
                    ">Cancel</button>
                </div>
                <div id="importProgress" style="display: none; margin: 15px 0;">
                    <div style="background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                        <div id="progressBar" style="
                            background: #4caf50;
                            height: 20px;
                            width: 0%;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <p id="progressText">Starting...</p>
                </div>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
        overlay.appendChild(importUI);

        document.getElementById('startImport').onclick = () => startHistoricalImport();
        document.getElementById('cancelImport').onclick = () => {
            document.body.removeChild(overlay);
        };
    }

    async function startHistoricalImport() {
        const pageCount = parseInt(document.getElementById('pageCount').value) || 10;
        const progressDiv = document.getElementById('importProgress');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        document.getElementById('startImport').style.display = 'none';
        document.getElementById('cancelImport').style.display = 'none';
        progressDiv.style.display = 'block';

        let importedCount = 0;
        let totalChecked = 0;
        let currentPage = 0;
        let paginationToken = null;

        try {
            while (currentPage < pageCount) {
                progressText.textContent = `Scanning page ${currentPage + 1}/${pageCount}...`;
                progressBar.style.width = `${(currentPage / pageCount) * 100}%`;

                const feedData = await fetchFeedData(paginationToken);
                
                if (!feedData || !feedData.entries || feedData.entries.length === 0) {
                    break;
                }

                for (const entry of feedData.entries) {
                    const gameTokens = extractGameTokens(entry);
                    totalChecked += gameTokens.length;
                    
                    for (const token of gameTokens) {
                        const saved = await saveGameIfSolo(token);
                        if (saved) {
                            importedCount++;
                            progressText.textContent = `Found ${importedCount} games (${totalChecked} checked) - Page ${currentPage + 1}/${pageCount}`;
                        }
                        await delay(200);
                    }
                }

                if (!feedData.paginationToken) break;
                paginationToken = feedData.paginationToken;
                currentPage++;
                await delay(500);
            }

            progressBar.style.width = '100%';
            progressText.innerHTML = `
                Import completed<br>
                <strong>${importedCount}</strong> new games imported<br>
                <small>${totalChecked} games checked total</small>
            `;

            GM_setValue('lastProcessedTime', Date.now());

            setTimeout(() => {
                const overlay = document.querySelector('#historical-import-ui').parentElement.parentElement;
                document.body.removeChild(overlay);
            }, 3000);

        } catch (error) {
            progressText.innerHTML = `Error during import: ${error.message}`;
            console.error('Historical import error:', error);
            
            setTimeout(() => {
                progressDiv.innerHTML += '<br><button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">Close</button>';
            }, 1000);
        }
    }

    function checkFirstTime() {
        const firstTime = GM_getValue('firstTimeUser', true);
        if (firstTime) {
            setTimeout(() => {
                createHistoricalImportUI();
                GM_setValue('firstTimeUser', false);
            }, 3000);
        }
    }





    function startGameMonitoring() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    checkForGameElements();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function handleUrlChange(url) {
        const gameMatch = url.match(/\/games\/([a-zA-Z0-9_-]+)/);
        if (gameMatch && gameMatch[1] !== currentGameToken) {
            currentGameToken = gameMatch[1];
            console.log('Solo Stats - New game :', currentGameToken);

            setTimeout(() => {
                saveCurrentGame(currentGameToken);
            }, 5000);
        }
    }

    function checkForGameElements() {
        const gameEndElements = document.querySelectorAll('[data-qa="game-finished"], .result-view, .results__summary');
        if (gameEndElements.length > 0 && currentGameToken) {
            setTimeout(() => {
                saveCurrentGame(currentGameToken);
            }, 2000);
        }
    }

    async function scanRecentGames() {
        if (isScanning) return;

        isScanning = true;
        console.log('Solo Stats - Scanning recent games...');

        try {
            let paginationToken = null;
            let page = 0;
            let newGamesFound = 0;

            while (page < CONFIG.INITIAL_SCAN_PAGES) {
                const feedData = await fetchFeedData(paginationToken);

                if (!feedData || !feedData.entries || feedData.entries.length === 0) {
                    break;
                }

                for (const entry of feedData.entries) {
                    const entryTime = new Date(entry.created || entry.time).getTime();
                    if (entryTime <= lastProcessedTime) {
                        page = CONFIG.INITIAL_SCAN_PAGES;
                        break;
                    }

                    const gameTokens = extractGameTokens(entry);
                    for (const token of gameTokens) {
                        const saved = await saveGameIfSolo(token);
                        if (saved) {
                            newGamesFound++;
                        }
                        await delay(CONFIG.DELAY_MS);
                    }
                }

                if (!feedData.paginationToken) break;
                paginationToken = feedData.paginationToken;
                page++;
                await delay(CONFIG.DELAY_MS);
            }

            if (newGamesFound > 0) {
                GM_setValue('lastProcessedTime', Date.now());
                console.log(`Solo Stats - ${newGamesFound} new games saved`);
            } else {
                console.log('Solo Stats - 0 New games found');
            }

        } catch (error) {
            console.error('❌ Erreur lors du scan:', error);
        } finally {
            isScanning = false;
        }
    }

    function extractGameTokens(entry) {
        const tokens = [];

        try {
            if (entry.payload && entry.payload.token) {
                tokens.push(entry.payload.token);
            }
            else if (entry.payload && typeof entry.payload === 'string') {
                if (entry.payload.startsWith('[')) {
                    const payloadArray = JSON.parse(entry.payload);
                    for (const item of payloadArray) {
                        if (item.payload && item.payload.gameToken) {
                            tokens.push(item.payload.gameToken);
                        }
                    }
                } else {
                    const payloadData = JSON.parse(entry.payload);
                    if (payloadData.gameToken) {
                        tokens.push(payloadData.gameToken);
                    }
                }
            }
            else if (entry.payload && entry.payload.gameToken) {
                tokens.push(entry.payload.gameToken);
            }

            const fullEntryStr = JSON.stringify(entry);
            const gameMatches = fullEntryStr.match(/"gameToken":"([a-zA-Z0-9_-]+)"/g);
            if (gameMatches) {
                gameMatches.forEach(match => {
                    const token = match.match(/"gameToken":"([a-zA-Z0-9_-]+)"/)[1];
                    if (!tokens.includes(token)) {
                        tokens.push(token);
                    }
                });
            }

            const gameUrlMatch = fullEntryStr.match(/https:\/\/geoguessr\.com\/games\/([a-zA-Z0-9_-]+)/);
            if (gameUrlMatch && !tokens.includes(gameUrlMatch[1])) {
                tokens.push(gameUrlMatch[1]);
            }

        } catch (error) {
            console.warn('extraction tokens error:', error);
        }

        return tokens;
    }

    async function saveCurrentGame(token) {
        return await saveGameIfSolo(token);
    }

    async function saveGameIfSolo(token) {
        try {
            const gameData = await fetchGameData(token);
            if (!gameData) return false;

            if (gameData.type === 'duels' || gameData.type === 'team-duels' || gameData.type === 'battle_royale' ||
                (gameData.players && gameData.players.length > 1)) {
                return false;
            }

            const savedGames = GM_getValue('savedGames', '{}');
            const savedGamesObj = JSON.parse(savedGames);
            if (savedGamesObj[token]) {
                return false;
            }

            const gameInfo = formatGameData(gameData);
            const success = await sendToGoogleSheets(gameInfo);

            if (success) {
                savedGamesObj[token] = true;
                GM_setValue('savedGames', JSON.stringify(savedGamesObj));

                console.log(`Solo Stats - Game saved: ${gameData.mapName} - ${gameInfo.score} points`);
                return true;
            }

        } catch (error) {
            console.error(`Solo Stats - Error savong game ${token}:`, error);
        }

        return false;
    }

    function formatGameData(gameData) {
        const score = gameData.player?.totalScore?.amount || 0;
        const distance = gameData.player?.totalDistanceInMeters || 0;
        const gameMode = getGameModeFromRestrictions(gameData);

        const rounds = gameData.rounds?.map((round, index) => {
            const guess = gameData.player?.guesses?.[index] || {};

            return {
                roundNumber: index + 1,
                score: guess.roundScoreInPoints || guess.roundScore?.amount || 0,
                distance: guess.distanceInMeters || guess.distance?.meters?.amount * 1000 || 0,
                country: round.streakLocationCode || 'unknown',
                lat: round.lat,
                lng: round.lng,
                guessLat: guess.lat,
                guessLng: guess.lng,
                time: guess.time || 0
            };
        }) || [];

        return {
            token: gameData.token,
            date: new Date().toISOString(),
            score: parseInt(score) || 0,
            distance: distance,
            mapName: gameData.mapName || 'Unknown',
            mapId: gameData.map,
            gameMode: gameMode,
            timeLimit: gameData.timeLimit || 0,
            rounds: rounds,
            restrictions: {
                forbidMoving: gameData.forbidMoving || false,
                forbidZooming: gameData.forbidZooming || false,
                forbidRotating: gameData.forbidRotating || false
            }
        };
    }

    function getGameModeFromRestrictions(gameData) {
        const { forbidMoving, forbidZooming, forbidRotating } = gameData;

        if (forbidMoving && forbidZooming && forbidRotating) {
            return 'NMPZ';
        } else if (forbidMoving && !forbidZooming && !forbidRotating) {
            return 'No Move';
        } else if (!forbidMoving && !forbidZooming && !forbidRotating) {
            return 'Moving';
        } else {
            const restrictions = [];
            if (forbidMoving) restrictions.push('NM');
            if (!forbidZooming) restrictions.push('Z');
            if (!forbidRotating) restrictions.push('R');
            return restrictions.length > 0 ? restrictions.join('') : 'Custom';
        }
    }

    async function sendToGoogleSheets(gameData) {
        const userId = await generateUserId();

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.GOOGLE_SCRIPT_URL,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    action: 'saveGame',
                    gameData: gameData,
                    userId: userId
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                showSpreadsheetLink(result.spreadsheetUrl);
                                resolve(true);
                            } else {
                                console.error('Error Google Sheets :', result.error);
                                resolve(false);
                            }
                        } catch (error) {
                            console.error('Erreur parsing Google Sheets response :', error);
                            resolve(false);
                        }
                    } else {
                        console.error(`Error HTTP Google Sheets : ${response.status}`);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('Erreur request Google Sheets :', error);
                    resolve(false);
                }
            });
        });
    }

    async function generateUserId() {
        let userId = GM_getValue('userId');
        if (!userId) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('GeoGuessr User ID', 2, 2);

            const fingerprint = canvas.toDataURL();
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);

            userId = btoa(`${fingerprint.substring(0, 20)}-${timestamp}-${random}`).substring(0, 16);
            GM_setValue('userId', userId);
        }
        return userId;
    }

    function showSpreadsheetLink(url) {
        const shown = GM_getValue('spreadsheetLinkShown', false);
        if (!shown && url) {
            console.log('Solo Stats - GeoGuessr:', url);

            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4caf50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    font-family: Arial, sans-serif;
                    max-width: 300px;
                ">
                    <div style="font-weight: bold; margin-bottom: 8px;">📊 GeoGuessr Stats</div>
                    <div style="font-size: 13px; margin-bottom: 10px;">Solo Stats - Games auto saved</div>
                    <a href="${url}" target="_blank" style="
                        color: white;
                        text-decoration: underline;
                        font-size: 13px;
                    ">Your stats</a>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        float: right;
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: -5px;
                    ">×</button>
                </div>
            `;

            document.body.appendChild(notification);
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);

            GM_setValue('spreadsheetLinkShown', true);
        }
    }

    async function fetchFeedData(paginationToken) {
        let url = '/api/v4/feed/private?count=50';
        if (paginationToken) {
            url += `&paginationToken=${encodeURIComponent(paginationToken)}`;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            reject(new Error('Error parsing JSON: ' + error.message));
                        }
                    } else {
                        reject(new Error(`Error HTTP: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Errr request: ' + error.message));
                }
            });
        });
    }

    async function fetchGameData(token) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `/api/v3/games/${token}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            console.warn(`Errorr parsing game ${token}:`, error);
                            resolve(null);
                        }
                    } else {
                        console.warn(`cant look up for game ${token} : ${response.status}`);
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();