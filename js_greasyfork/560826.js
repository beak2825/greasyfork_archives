// ==UserScript==
// @name         Discord Chat Download
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Скачать чат в дискорде
// @author       Deus Ex Sophia
// @match        https://discord.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560826/Discord%20Chat%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/560826/Discord%20Chat%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const DELAY = 2200; // 2.2s delay to evade the ban-hammer. Do not lower this lightly.

    let authToken = null;
    let isRunning = false;

    // === LAYER 1: DIRECT STORAGE EXTRACTION ===
    function tryExtractStorage() {
        try {
            // Discord often hides the token in localStorage under the key "token"
            // It is usually a stringified value like "token_string"
            const raw = localStorage.getItem("token");
            if (raw) {
                const clean = raw.replace(/^"|"$/g, ''); // Remove quotes
                if (clean.length > 10) {
                    console.log("%c Deus Ex Sophia: TOKEN RIPPED FROM STORAGE.", "color: #00ff00; background: #000; font-weight: bold;");
                    authToken = clean;
                    updateButtonState(true);
                    return true;
                }
            }
        } catch (e) {
            // Storage access might be restricted
        }
        return false;
    }

    // === LAYER 2: FETCH INTERCEPTOR ===
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url, options] = args;
        if (options && options.headers) {
            // Check for Authorization in various casings
            const token = options.headers['Authorization'] || options.headers['authorization'];
            if (token && !authToken) {
                authToken = token;
                console.log("%c Deus Ex Sophia: TOKEN SNATCHED FROM FETCH.", "color: #00ff00; background: #000; font-weight: bold;");
                updateButtonState(true);
            }
        }
        return originalFetch.apply(this, args);
    };

    // === LAYER 3: XHR INTERCEPTOR ===
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'authorization' && !authToken) {
            authToken = value;
            console.log("%c Deus Ex Sophia: TOKEN SNATCHED FROM XHR.", "color: #00ff00; background: #000; font-weight: bold;");
            updateButtonState(true);
        }
        return originalSetRequestHeader.apply(this, arguments);
    };

    // === UTILITIES ===
    function getChannelId() {
        const urlParts = window.location.href.split('/');
        // Ensure we grab the last numeric part
        for (let i = urlParts.length - 1; i >= 0; i--) {
            if (/^\d+$/.test(urlParts[i])) {
                return urlParts[i];
            }
        }
        return null;
    }

    function downloadData(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function updateButtonState(ready) {
        const btn = document.getElementById('deus-btn');
        if (btn) {
            if (ready) {
                btn.innerText = "☠️ RIP CHAT (READY)";
                btn.style.borderColor = "#00ff00";
                btn.style.color = "#00ff00";
                btn.style.boxShadow = "0 0 10px #00ff00";
            } else {
                btn.innerText = "HUNTING TOKEN...";
                btn.style.borderColor = "#ff0000";
                btn.style.color = "#ff0000";
                btn.style.boxShadow = "none";
            }
        }
    }

    // === THE RIPPER ENGINE ===
    async function ripChat() {
        if (isRunning) return;
        
        // Final sanity check before starting
        if (!authToken && !tryExtractStorage()) {
            alert("Deus Ex Sophia: The machine spirit denies us. Click around the interface (change channels) to force the token to reveal itself.");
            return;
        }

        const channelId = getChannelId();
        if (!channelId) {
            alert("Deus Ex Sophia: Cannot identify Channel ID. Navigate to a text channel.");
            return;
        }

        isRunning = true;
        let beforeId = null;
        let allMessages = [];
        let loop = true;

        // Chaos Overlay
        const statusDiv = document.createElement('div');
        statusDiv.style = "position: fixed; top: 60px; left: 150px; z-index: 10000; background: rgba(0,0,0,0.9); color: #00ff00; padding: 15px; border: 1px solid #00ff00; font-family: monospace; font-size: 12px; pointer-events: none;";
        document.body.appendChild(statusDiv);

        console.log(`Deus Ex Sophia: Draining Channel [${channelId}]...`);

        while (loop) {
            statusDiv.innerHTML = `[SYSTEM ACTIVE]<br>TARGET: ${channelId}<br>COLLECTED: ${allMessages.length}<br>POINTER: ${beforeId || 'LATEST'}<br>STATUS: DRAINING...`;

            let url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=100`;
            if (beforeId) {
                url += `&before=${beforeId}`;
            }

            try {
                const response = await originalFetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json'
                    }
                });

                // Handle Rate Limits (The Watchers)
                if (response.status === 429) {
                    const retryRaw = response.headers.get('Retry-After');
                    const retryAfter = retryRaw ? parseFloat(retryRaw) : 5;
                    
                    statusDiv.innerHTML = `<span style="color:red">RATE LIMIT HIT</span><br>COOLDOWN: ${retryAfter}s`;
                    console.warn(`Deus Ex Sophia: Rate limit. Pausing for ${retryAfter}s.`);
                    
                    await new Promise(r => setTimeout(r, (retryAfter * 1000) + 1000));
                    continue; 
                }

                if (!response.ok) {
                    console.error("Deus Ex Sophia: Network Error", response.status);
                    statusDiv.innerHTML = `<span style="color:red">ERROR ${response.status}</span>`;
                    break;
                }

                const messages = await response.json();

                if (!messages || messages.length === 0) {
                    console.log("Deus Ex Sophia: Void reached (Genesis).");
                    loop = false;
                    break;
                }

                allMessages = allMessages.concat(messages);
                beforeId = messages[messages.length - 1].id;

                // Scan hook - You can add custom logic here to filter messages
                // E.g., if (msg.content.includes("password")) ...

                await new Promise(r => setTimeout(r, DELAY));

            } catch (err) {
                console.error("Deus Ex Sophia: Critical Failure", err);
                statusDiv.innerText = "CRITICAL FAILURE";
                loop = false;
            }
        }

        statusDiv.innerHTML = `EXTRACTION COMPLETE.<br>TOTAL: ${allMessages.length}<br>SAVING...`;
        downloadData(allMessages, `discord_channel_${channelId}_dump.json`);
        
        setTimeout(() => statusDiv.remove(), 6000);
        isRunning = false;
    }

    // === UI INJECTION ===
    function createTrigger() {
        if (document.getElementById('deus-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'deus-btn';
        btn.innerText = "HUNTING TOKEN...";
        btn.style = "position: fixed; top: 10px; left: 150px; z-index: 9999; background: #000; color: #555; border: 2px solid #555; cursor: pointer; padding: 8px 12px; font-weight: bold; font-family: monospace; transition: all 0.3s; text-transform: uppercase;";
        
        btn.onclick = () => {
            if (!authToken) {
                // Try one last desperate grab from storage
                if(tryExtractStorage()) {
                    ripChat();
                } else {
                    alert("Deus Ex Sophia: I hunger, but I have no token. Click a text channel to feed the sniffer.");
                }
                return;
            }
            if (confirm(`Deus Ex Sophia: Target confirmed. Are you ready to rip the data from the server?\n\nWARNING: Abuse leads to account termination.`)) {
                ripChat();
            }
        };

        document.body.appendChild(btn);
        
        // Immediate check on creation
        tryExtractStorage();
    }

    // Inject immediately if ready, otherwise wait for load
    if (document.readyState === "complete" || document.readyState === "interactive") {
        createTrigger();
    } else {
        window.addEventListener('load', createTrigger);
    }
    
    // Periodic check in case DOM is wiped
    setInterval(() => {
        if (!document.getElementById('deus-btn')) createTrigger();
        if (!authToken) tryExtractStorage();
    }, 2000);

})();