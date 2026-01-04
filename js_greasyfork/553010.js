// ==UserScript==
// @name         Astral's Stream Sniper
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Combines parallel processing speed, a stunning astral theme, and a robust retry mechanism to handle API rate limits.
// @author       Liyaa aka Ilyax
// @match        https://*.roblox.com/*
// @icon         https://i.imgur.com/83AaG5v.png
// @grant        none
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/553010/Astral%27s%20Stream%20Sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/553010/Astral%27s%20Stream%20Sniper.meta.js
// ==/UserScript==

// Copyright © 2025 Astral
// This script may not be copied, modified, or redistributed. 
// Writted by Ilyax

(function() {
    'use strict';

    const DEBUG_MODE = true;

    const _dataCache = new Map();
    const _config = {
        batchSize: 100,
        concurrentBatches: 10,
        retryLimit: 5,
        initialBackoff: 1000,
    };

    const _debug = {
        logContainer: null,
        log(message) {
            if (DEBUG_MODE) {
                if (!this.logContainer) this.logContainer = document.getElementById('astral-debug-log-content');
                if (!this.logContainer) return;
                const p = document.createElement('p');
                p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
                this.logContainer.appendChild(p);
                this.logContainer.scrollTop = this.logContainer.scrollHeight;
            }
        }
    };

    const _utils = {
        getPlaceId: () => window.location.href.match(/games\/(\d+)/)?.[1],
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    };

    const _api = {
        execute: async (url, options = {}, isRetryable = true) => {
            for (let retries = 0; retries < _config.retryLimit; retries++) {
                try {
                    const config = { credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers }, ...options };
                    const response = await fetch(url, config);
                    if (!response.ok) {
                        if (response.status === 429 && isRetryable) {
                            throw new Error(`RateLimited`);
                        }
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                } catch (error) {
                    if (error.message.includes('RateLimited')) {
                        const backoff = _config.initialBackoff * Math.pow(2, retries);
                        _debug.log(`API Rate Limit (429). Waiting ${backoff}ms... (Retry ${retries + 1}/${_config.retryLimit})`);
                        await _utils.delay(backoff);
                    } else {
                        _debug.log(`Critical API Error: ${error.message} on ${url}`);
                        throw error;
                    }
                }
            }
            throw new Error(`API request failed after ${_config.retryLimit} retries on ${url}`);
        },
        getUserId: async (username) => {
            if (_dataCache.has(username)) return _dataCache.get(username);
            _debug.log(`Fetching user ID for '${username}'...`);
            const response = await _api.execute('https://users.roblox.com/v1/usernames/users', {
                method: 'POST', body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
            }, false);
            const userId = response.data[0]?.id;
            if (userId) {
                _dataCache.set(username, userId);
                _debug.log(`User ID found: ${userId}`);
            }
            return userId;
        },
        getUserThumbnail: async (userId) => {
            const cacheKey = `thumb_${userId}`;
            if (_dataCache.has(cacheKey)) return _dataCache.get(cacheKey);
            _debug.log(`Fetching thumbnail for ID ${userId}...`);
            const response = await _api.execute(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&format=Png&size=150x150`);
            const thumbUrl = response.data[0]?.imageUrl;
            if (thumbUrl) _dataCache.set(cacheKey, thumbUrl);
            return thumbUrl;
        },
        getGameServers: async (placeId, cursor = null) => {
            let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100`;
            if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
            return _api.execute(url);
        },
        getBatchThumbnails: async (tokens) => {
            const body = tokens.map(token => ({
                requestId: `0:${token}:AvatarHeadshot:150x150:png:regular`, type: 'AvatarHeadShot', targetId: 0, token, format: 'png', size: '150x150'
            }));
            return _api.execute('https://thumbnails.roblox.com/v1/batch', { method: 'POST', body: JSON.stringify(body) });
        },
    };

    const _core = {
        isSearching: false,
        stopSearch: false,
        search: async (placeId, username, ui) => {
            if (_core.isSearching) return;
            _core.isSearching = true;
            _core.stopSearch = false;
            ui.updateStatus("Searching...", true);

            const startTime = Date.now();
            try {
                ui.updateStatus("Fetching user data...", true);
                const userId = await _api.getUserId(username);
                if (!userId) { ui.updateStatus("User not found.", false); return; }

                const targetThumbUrl = await _api.getUserThumbnail(userId);
                if (!targetThumbUrl) { ui.updateStatus("Failed to get user image.", false); return; }
                ui.setThumbnail(targetThumbUrl);
                ui.updateStatus("User image loaded.", true);

                _debug.log("Collecting server data...");
                ui.updateStatus("Collecting server data...", true);
                let cursor = null;
                const allTokens = [];
                do {
                    const servers = await _api.getGameServers(placeId, cursor);
                    if (!servers || _core.stopSearch) break;
                    servers.data.forEach(server => server.playerTokens.forEach(token => allTokens.push({ token, server })));
                    cursor = servers.nextPageCursor;
                    ui.updateStatus(`Collected ${allTokens.length} player tokens...`, true);
                } while (cursor && !_core.stopSearch);

                if (allTokens.length === 0) { ui.updateStatus("No active servers found.", false); return; }

                _debug.log(`Total ${allTokens.length} players found. Starting parallel scan...`);

                const tokenBatches = [];
                for (let i = 0; i < allTokens.length; i += _config.batchSize) {
                    tokenBatches.push(allTokens.slice(i, i + _config.batchSize));
                }

                let playersProcessed = 0;
                for (let i = 0; i < tokenBatches.length; i += _config.concurrentBatches) {
                    if (_core.stopSearch) break;

                    const concurrentGroup = tokenBatches.slice(i, i + _config.concurrentBatches);
                    const promises = concurrentGroup.map(batch => _api.getBatchThumbnails(batch.map(item => item.token)));

                    _debug.log(`Processing ${concurrentGroup.length} batches (${concurrentGroup.length * _config.batchSize} players) in parallel.`);

                    const results = await Promise.all(promises);

                    for (const result of results) {
                        const foundThumb = result.data?.find(thumb => thumb?.imageUrl === targetThumbUrl);
                        if (foundThumb) {
                            _core.stopSearch = true;
                            const thumbToken = foundThumb.requestId.split(':')[1];
                            const originalBatch = allTokens.find(item => item.token === thumbToken);
                            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                            ui.updateStatus(`Target found! Search completed in ${elapsed} seconds.`, false);
                            _debug.log(`TARGET FOUND! Time: ${elapsed}s.`);
                            ui.showResult(placeId, originalBatch.server.id);
                            return;
                        }
                    }
                    playersProcessed += concurrentGroup.length * _config.batchSize;
                    ui.updateStatus(`Processed ${Math.min(playersProcessed, allTokens.length)}/${allTokens.length} players...`, true);
                }

                if (!_core.stopSearch) ui.updateStatus(`User not found in ${allTokens.length} players.`, false);

            } catch (error) {
                console.error("Search Error:", error);
                ui.updateStatus(`Error: ${error.message}`, false);
                _debug.log(`CRITICAL ERROR: ${error.message}`);
            } finally {
                _core.isSearching = false;
                ui.updateStatus(ui.elements.status.textContent, false);
            }
        }
    };

    const _ui = {
        elements: {},
        createStyles: () => {},
        initialize: () => {
            const targetContainer = document.getElementById('running-game-instances-container');
            if (!targetContainer) { setTimeout(_ui.initialize, 500); return; }
            if (document.getElementById('astral-sniper-container')) return;

            _ui.createStyles();

            const app = document.createElement('div');
            app.id = 'astral-sniper-container';
            app.innerHTML = `
                <div id="astral-sniper-header">
                    <img id="astral-sniper-thumb">
                    <h2>Astral Sniper</h2>
                </div>
                <form id="astral-sniper-form" onsubmit="return false;">
                    <input type="text" id="astral-sniper-username" placeholder="Username..." autocomplete="off">
                    <button type="submit" id="astral-sniper-submit" class="astral-btn">Search</button>
                </form>
                <p id="astral-sniper-status">Enter a username to begin.</p>
                <div id="astral-sniper-result-container"></div>
                <div id="astral-debug-log">
                    <h3>Debugger</h3>
                    <div id="astral-debug-log-content"></div>
                </div>
            `;
            targetContainer.prepend(app);

            const ids = ['form', 'username', 'submit', 'status', 'result-container', 'thumb'];
            ids.forEach(id => _ui.elements[id] = document.getElementById(`astral-sniper-${id}`));

            _ui.elements.form.addEventListener('submit', () => {
                _ui.elements['result-container'].innerHTML = '';
                _ui.elements.thumb.style.display = 'none';
                _core.search(_utils.getPlaceId(), _ui.elements.username.value, _ui);
            });
        },
        updateStatus: (text, isSearching) => {
            if (_ui.elements.status) {
                _ui.elements.status.textContent = text;
                _ui.elements.submit.disabled = isSearching;
            }
        },
        setThumbnail: (src) => { if (_ui.elements.thumb) { _ui.elements.thumb.src = src; _ui.elements.thumb.style.display = 'block'; } },
        showResult: (placeId, jobId) => {
            const joinBtn = document.createElement('button');
            joinBtn.id = 'astral-sniper-join';
            joinBtn.className = 'astral-btn';
            joinBtn.textContent = 'Join Game Instance';
            joinBtn.onclick = () => window.Roblox?.GameLauncher?.joinGameInstance?.(placeId, jobId);
            // HATA BURADAYDI: _ui.elements.result -> _ui.elements['result-container'] olarak düzeltildi.
            const resultContainer = _ui.elements['result-container'];
            resultContainer.innerHTML = '';
            resultContainer.appendChild(joinBtn);
        },
    };

    // UI stillerini tekrar ekleyelim, bir önceki kodda kısaltılmıştı
    _ui.createStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            @keyframes stars {
                0% { background-position: 0 0; } 100% { background-position: 0 1000px; }
            }
            #astral-sniper-container {
                background: #000 url(https://i.imgur.com/gKKf42I.png);
                animation: stars 60s linear infinite;
                border: 1px solid #5A41A5; border-radius: 12px;
                padding: 16px; margin-bottom: 20px;
                font-family: 'Segoe UI', 'Roboto', sans-serif;
                box-shadow: 0 0 15px rgba(128, 90, 213, 0.5);
            }
            #astral-sniper-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            #astral-sniper-header h2 { font-size: 22px; font-weight: 600; margin: 0; color: #fff; text-shadow: 0 0 8px #fff; }
            #astral-sniper-thumb { border-radius: 50%; width: 48px; height: 48px; display: none; border: 2px solid #5A41A5; }
            #astral-sniper-form { display: flex; gap: 10px; margin-bottom: 12px; }
            #astral-sniper-username {
                flex-grow: 1; border: 1px solid #5A41A5; background-color: rgba(0,0,0,0.5);
                border-radius: 8px; padding: 10px 14px; font-size: 16px; color: #fff;
            }
            #astral-sniper-username:focus { outline: none; box-shadow: 0 0 8px #805AD5; }
            .astral-btn {
                border: none; border-radius: 8px; padding: 0 18px; font-size: 16px; font-weight: 600; cursor: pointer;
                transition: all 0.2s ease; text-shadow: 0 0 5px rgba(255,255,255,0.7);
            }
            #astral-sniper-submit { background: linear-gradient(45deg, #8A2BE2, #4B0082); color: white; }
            #astral-sniper-submit:hover { transform: scale(1.05); box-shadow: 0 0 15px #8A2BE2; }
            #astral-sniper-submit:disabled { background: #555; cursor: not-allowed; transform: none; box-shadow: none; }
            #astral-sniper-join { background: linear-gradient(45deg, #00FF7F, #32CD32); color: white; width: 100%; padding: 12px; display: block; }
            #astral-sniper-join:hover { transform: scale(1.02); box-shadow: 0 0 15px #00FF7F; }
            #astral-sniper-status { font-size: 14px; color: #ccc; min-height: 20px; text-align: center; }
            #astral-debug-log { display: ${DEBUG_MODE ? 'block' : 'none'}; margin-top: 15px; border-top: 1px solid #5A41A5; padding-top: 10px; }
            #astral-debug-log h3 { margin: 0 0 5px 0; color: #fff; text-align: left; font-size: 14px; }
            #astral-debug-log-content {
                background-color: rgba(0,0,0,0.7); border: 1px solid #333; border-radius: 5px;
                max-height: 150px; overflow-y: auto; text-align: left; padding: 8px; font-family: 'Consolas', monospace; font-size: 12px;
            }
            #astral-debug-log-content p { margin: 0; padding: 2px 0; border-bottom: 1px dotted #444; color: #00FF7F; }
        `;
        document.head.appendChild(styleSheet);
    };

    const initInterval = setInterval(() => {
        if(document.getElementById('running-game-instances-container')) {
            clearInterval(initInterval);
            _ui.initialize();
        }
    }, 500);
})();