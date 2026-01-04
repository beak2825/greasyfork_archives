// ==UserScript==
// @name         Auto Mute/Unmute Specific Players by Avatar ID (Blacklist)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Automatically mute/unmute specific players in Drawaria.online by avatar ID, including all alt accounts
// @author       Infinite
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554783/Auto%20MuteUnmute%20Specific%20Players%20by%20Avatar%20ID%20%28Blacklist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554783/Auto%20MuteUnmute%20Specific%20Players%20by%20Avatar%20ID%20%28Blacklist%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("removeTargetIds(['id1', 'id2', 'id3']);");
    console.log("addTargetIds(['id1', 'id2', 'id3']);");

    // Hardcoded initial target avatar IDs
    const hardcodedTargetAvatarIds = [];

    // Global variables
    let targetAvatarIds = JSON.parse(localStorage.getItem('targetAvatarIds') || '[]') || hardcodedTargetAvatarIds;
    let wsTargetStatus = {};
    let muteQueue = [];
    let unmuteQueue = [];
    let isProcessing = false;
    let lastMutedPlayers = new Set();

    // WebSocket override to parse messages
    (function() {
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
            ws.addEventListener('message', function(event) {
                const msg = String(event.data);
                let data = null;
                if (msg.startsWith("430")) {
                    data = msg.slice(3);
                } else if (msg.startsWith("42[")) {
                    data = msg.slice(2);
                }
                if (data) {
                    try {
                        const payload = JSON.parse(data);
                        if (Array.isArray(payload) && payload[0] === "mc_roomplayerschange" && Array.isArray(payload[3])) {
                            payload[3].forEach(player => processPlayerForMute(player, "Format A"));
                        } else if (Array.isArray(payload) && typeof payload[0] === "object" && payload[0].players && Array.isArray(payload[0].players)) {
                            payload[0].players.forEach(player => processPlayerForMute(player, "Format B"));
                        } else if (Array.isArray(payload) && payload[0] === "bc_uc_freedrawsession_changedroom" && payload[3] && Array.isArray(payload[3])) {
                            // Clear stale default avatar entries from lastMutedPlayers and queues
                            const currentPlayerIds = new Set(Array.from(document.querySelectorAll('#playerlist .playerlist-row'))
                                                             .map(row => row.getAttribute('data-playerid')));
                            const defaultPlayerIdsToClear = Array.from(lastMutedPlayers).filter(playerId => {
                                const row = Array.from(document.querySelectorAll('#playerlist .playerlist-row'))
                                .find(r => r.getAttribute('data-playerid') === playerId);
                                return !currentPlayerIds.has(playerId) || (row && extractAvatarId(row.querySelector('.playerlist-avatar').getAttribute('src')) === "default");
                            });
                            defaultPlayerIdsToClear.forEach(playerId => lastMutedPlayers.delete(playerId));
                            muteQueue = muteQueue.filter(item => !defaultPlayerIdsToClear.includes(item.playerId));
                            unmuteQueue = unmuteQueue.filter(item => !defaultPlayerIdsToClear.includes(item.playerId));
                            console.log("[Format C] Cleared stale default avatar entries from lastMutedPlayers and queues for new room");
                            // Delay processing new players to allow DOM update
                            setTimeout(() => {
                                payload[3].forEach(player => {
                                    if (player && typeof player === "object") {
                                        processPlayerForMute(player, "Format C");
                                    } else {
                                        console.log("[Format C] Invalid player object", player);
                                    }
                                });
                            }, 200); // Delay to sync with DOM
                        }
                    } catch(e) {
                        console.error("Error parsing WS message in global override", e);
                    }
                }
            });
            return ws;
        };
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        window.WebSocket.OPEN = OriginalWebSocket.OPEN;
        window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
        window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    })();

    // Process player for mute
    function processPlayerForMute(player, formatLabel) {
        if (player && player.avatarid) {
            let avatarBase = player.avatarid === "undefined.undefined" ? "default" : player.avatarid.split('.')[0];
            if (targetAvatarIds.includes(avatarBase)) {
                wsTargetStatus[avatarBase] = true;
                console.log(`[Global WS Update] (${formatLabel}) Avatar ${avatarBase} is present.`);
                if (player.playerid && !lastMutedPlayers.has(player.playerid)) {
                    enqueueMute(null, player.playerid, avatarBase);
                } else {
                    openPopoverAndMute(avatarBase, player);
                }
            }
        }
    }

    // Save target avatar IDs to localStorage
    function saveTargetData() {
        localStorage.setItem('targetAvatarIds', JSON.stringify(targetAvatarIds));
    }

    // Extract avatar ID from URL
    function extractAvatarId(url) {
        if (url.startsWith("undefined") || url.includes("default.jpg")) {
            return "default";
        }
        const match = url.match(/\/avatar\/cache\/([a-f0-9-]+)\./);
        return match ? match[1] : url;
    }

    // Mute player from popover
    function mutePlayerFromPopover() {
        const popover = document.querySelector('.popover-body');
        if (popover) {
            const muteButton = popover.querySelector('.mutebutton');
            if (muteButton) {
                muteButton.click();
                console.log("Muted player.");
            }
        }
    }

    // Unmute player from popover
    function unmutePlayerFromPopover() {
        const popover = document.querySelector('.popover-body');
        if (popover) {
            const unmuteButton = popover.querySelector('.mutebutton');
            if (unmuteButton) {
                unmuteButton.click();
                console.log("Unmuted player.");
            }
        }
    }

    // Enqueue mute action
    function enqueueMute(playerElement, playerId, avatarId = null) {
        if (!muteQueue.some(item => item.playerId === playerId) && !lastMutedPlayers.has(playerId)) {
            muteQueue.push({ playerElement, playerId, avatarId });
            console.log(`Enqueued player ${playerId} with avatar ${avatarId}`);
            processMuteQueue();
        } else {
            console.log(`Skipped enqueue for player ${playerId}: already queued or muted`);
        }
    }

    // Process mute queue
    function processMuteQueue() {
        if (isProcessing || muteQueue.length === 0) return;
        const { playerElement, playerId, avatarId } = muteQueue.shift();
        console.log(`Processing mute queue for player ${playerId} with avatar ${avatarId}`);
        isProcessing = true;

        const currentRows = Array.from(document.querySelectorAll('#playerlist .playerlist-row'));
        let targetElement = playerElement || currentRows.find(row => row.getAttribute('data-playerid') === playerId);

        if (!targetElement && avatarId === "default") {
            console.log(`processMuteQueue: Skipping stale default avatar player ${playerId} not in current room`);
            lastMutedPlayers.delete(playerId); // Clear stale entry
            isProcessing = false;
            setTimeout(processMuteQueue, 200);
            return;
        }

        if (!targetElement && avatarId) {
            targetElement = currentRows.find(row => {
                const avatarImg = row.querySelector('.playerlist-avatar');
                return avatarImg && extractAvatarId(avatarImg.getAttribute('src')) === avatarId;
            });
        }

        if (targetElement && targetElement.getAttribute('data-playerid') === playerId) {
            mutePlayerSequentially(targetElement, playerId, () => {
                setTimeout(() => {
                    isProcessing = false;
                    processMuteQueue();
                }, 50);
            });
        } else {
            console.log(`processMuteQueue: Player ${playerId} not found in current room, skipping...`);
            isProcessing = false;
            setTimeout(processMuteQueue, 200);
        }
    }

    // Enqueue unmute action
    function enqueueUnmute(playerElement, playerId, avatarId = null) {
        if (!unmuteQueue.some(item => item.playerId === playerId) && lastMutedPlayers.has(playerId)) {
            unmuteQueue.push({ playerElement, playerId, avatarId });
            console.log(`Enqueued unmute for player ${playerId} with avatar ${avatarId}`);
            processUnmuteQueue();
        } else {
            console.log(`Skipped enqueue unmute for player ${playerId}: not muted or already queued`);
        }
    }

    // Process unmute queue
    function processUnmuteQueue() {
        if (isProcessing || unmuteQueue.length === 0) return;
        const { playerElement, playerId, avatarId } = unmuteQueue.shift();
        console.log(`Processing unmute queue for player ${playerId} with avatar ${avatarId}`);
        isProcessing = true;

        let targetElement = playerElement;
        if (!targetElement && avatarId) {
            targetElement = Array.from(document.querySelectorAll('#playerlist .playerlist-row'))
                .find(row => {
                    const avatarImg = row.querySelector('.playerlist-avatar');
                    return avatarImg && extractAvatarId(avatarImg.getAttribute('src')) === avatarId;
                });
        }

        if (targetElement) {
            unmutePlayerSequentially(targetElement, playerId, () => {
                setTimeout(() => {
                    isProcessing = false;
                    processUnmuteQueue();
                }, 50);
            });
        } else {
            console.log(`processUnmuteQueue: Could not find player element for ID ${playerId}, retrying...`);
            if (!unmuteQueue.some(item => item.playerId === playerId)) {
                unmuteQueue.unshift({ playerElement, playerId, avatarId });
            }
            isProcessing = false;
            setTimeout(processUnmuteQueue, 200);
        }
    }

    // Mute player sequentially
    function mutePlayerSequentially(playerElement, playerId, callback) {
        if (lastMutedPlayers.has(playerId)) {
            console.log(`Player ${playerId} already muted, skipping`);
            if (typeof callback === "function") callback();
            isProcessing = false;
            return;
        }
        isProcessing = true;
        playerElement.click();
        setTimeout(() => {
            mutePlayerFromPopover();
            const closeButton = document.querySelector('.playerlist-menu-hidebutton');
            if (closeButton) closeButton.click();
            lastMutedPlayers.add(playerId);
            console.log(`Muted player ${playerId}`);
            isProcessing = false;
            if (typeof callback === "function") callback();
        }, 50); //100ms
    }

    // Unmute player sequentially
    function unmutePlayerSequentially(playerElement, playerId, callback) {
        if (!lastMutedPlayers.has(playerId)) {
            console.log(`Player ${playerId} not muted, skipping`);
            if (typeof callback === "function") callback();
            isProcessing = false;
            return;
        }
        isProcessing = true;
        playerElement.click();
        setTimeout(() => {
            unmutePlayerFromPopover();
            const closeButton = document.querySelector('.playerlist-menu-hidebutton');
            if (closeButton) closeButton.click();
            lastMutedPlayers.delete(playerId);
            console.log(`Unmuted player ${playerId}`);
            isProcessing = false;
            if (typeof callback === "function") callback();
        }, 50); //100ms
    }

    // Try to find and mute player
    function openPopoverAndMute(avatarId, playerData = null, attempt = 0) {
        const MAX_ATTEMPTS = 20;
        const playerElements = Array.from(document.querySelectorAll('#playerlist .playerlist-row'));
        const matchingElement = playerElements.find(row => {
            const avatarImg = row.querySelector('.playerlist-avatar');
            return avatarImg && extractAvatarId(avatarImg.getAttribute('src')) === avatarId;
        });

        if (matchingElement) {
            const playerId = matchingElement.getAttribute('data-playerid');
            if (playerId && !lastMutedPlayers.has(playerId)) {
                enqueueMute(matchingElement, playerId);
            }
        } else if (playerData && playerData.playerid && !lastMutedPlayers.has(playerData.playerid)) {
            enqueueMute(null, playerData.playerid, avatarId);
        } else if (attempt < MAX_ATTEMPTS) {
            setTimeout(() => openPopoverAndMute(avatarId, playerData, attempt + 1), 100);
        } else {
            console.log(`openPopoverAndMute: Could not find DOM row for avatar ${avatarId} after ${MAX_ATTEMPTS} attempts`);
            checkPlayers();
        }
    }

    // Check players for mute
    function checkPlayers() {
        if (isProcessing) return;
        const playerRows = document.querySelectorAll('#playerlist .playerlist-row');
        for (const row of playerRows) {
            const playerId = row.getAttribute('data-playerid');
            const avatarImg = row.querySelector('.playerlist-avatar');
            if (avatarImg) {
                const avatarUrl = avatarImg.getAttribute('src');
                const avatarId = extractAvatarId(avatarUrl);
                if (avatarId && targetAvatarIds.includes(avatarId) && !lastMutedPlayers.has(playerId)) {
                    enqueueMute(row, playerId);
                    break;
                }
            }
        }
    }

    // Toggle mute/unmute for player
    function toggleTargetPlayerForMute() {
        const popover = document.querySelector('.popover-body');
        if (popover) {
            const avatarImg = popover.querySelector('.playerlist-avatarimg');
            if (avatarImg) {
                const avatarUrl = avatarImg.getAttribute('src');
                const avatarId = extractAvatarId(avatarUrl);
                if (avatarId) {
                    if (targetAvatarIds.includes(avatarId)) {
                        // Remove from target list and unmute all players with this avatarId
                        targetAvatarIds = targetAvatarIds.filter(id => id !== avatarId);
                        console.log(`Removed target avatar ID: ${avatarId}`);
                        saveTargetData();
                        const playerRows = Array.from(document.querySelectorAll('#playerlist .playerlist-row'));
                        const matchingRows = playerRows.filter(row => {
                            const img = row.querySelector('.playerlist-avatar');
                            return img && extractAvatarId(img.getAttribute('src')) === avatarId;
                        });
                        matchingRows.forEach(row => {
                            const playerId = row.getAttribute('data-playerid');
                            if (playerId && lastMutedPlayers.has(playerId)) {
                                enqueueUnmute(row, playerId, avatarId);
                            }
                        });
                        checkPlayers();
                    } else {
                        // Add to target list and mute
                        targetAvatarIds.push(avatarId);
                        console.log(`Added target avatar ID: ${avatarId}`);
                        saveTargetData();
                        const playerElement = Array.from(document.querySelectorAll('#playerlist .playerlist-row'))
                            .find(row => {
                                const img = row.querySelector('.playerlist-avatar');
                                return img && extractAvatarId(img.getAttribute('src')) === avatarId;
                            });
                        if (playerElement) {
                            const playerId = playerElement.getAttribute('data-playerid');
                            if (playerId && !lastMutedPlayers.has(playerId)) {
                                enqueueMute(playerElement, playerId);
                            }
                        }
                        checkPlayers();
                    }
                }
            }
        }
    }

    // Add or remove target IDs via console
    window.addTargetIds = function(idsToAdd) {
        if (!Array.isArray(idsToAdd)) {
            console.error("Please provide an array of IDs to add.");
            return;
        }
        idsToAdd.forEach(id => {
            if (!targetAvatarIds.includes(id)) {
                targetAvatarIds.push(id);
                console.log(`Added target avatar ID: ${id}`);
            } else {
                console.log(`Avatar ID already exists in the target list: ${id}`);
            }
        });
        saveTargetData();
        checkPlayers();
    };

    window.removeTargetIds = function(idsToRemove) {
        if (!Array.isArray(idsToRemove)) {
            console.error("Please provide an array of IDs to remove.");
            return;
        }
        idsToRemove.forEach(id => {
            const index = targetAvatarIds.indexOf(id);
            if (index !== -1) {
                targetAvatarIds.splice(index, 1);
                console.log(`Removed target avatar ID: ${id}`);
                const playerRows = Array.from(document.querySelectorAll('#playerlist .playerlist-row'));
                const matchingRows = playerRows.filter(row => {
                    const img = row.querySelector('.playerlist-avatar');
                    return img && extractAvatarId(img.getAttribute('src')) === id;
                });
                matchingRows.forEach(row => {
                    const playerId = row.getAttribute('data-playerid');
                    if (playerId && lastMutedPlayers.has(playerId)) {
                        enqueueUnmute(row, playerId, id);
                    }
                });
            } else {
                console.log(`Avatar ID not found in target list: ${id}`);
            }
        });
        saveTargetData();
        checkPlayers();
    };

    // Keydown event for toggle
    document.addEventListener('keydown', (event) => {
        if (event.key === '7') {
            toggleTargetPlayerForMute();
        }
    });

    // Observe player list changes
    const playerList = document.querySelector('#playerlist');
    if (playerList) {
        const observer = new MutationObserver(() => {
            checkPlayers();
        });
        observer.observe(playerList, { childList: true, subtree: true });
    }

    // Initial and periodic checks
    setTimeout(checkPlayers, 300);
    setInterval(checkPlayers, 300);
    console.log('Loaded target avatar IDs:', targetAvatarIds);
    window.getTargetAvatarIds = () => console.log(targetAvatarIds);
})();
