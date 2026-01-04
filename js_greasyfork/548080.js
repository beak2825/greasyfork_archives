// ==UserScript==
// @name         roblox join links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  adds copy join link buttons with real job IDs to roblox friend server cards and public server cards. literally just a rip off of ropro but it doesnt have api errors.
// @match        https://www.roblox.com/games/*
// @grant        none
// @author       mr. cool guy
// @downloadURL https://update.greasyfork.org/scripts/548080/roblox%20join%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/548080/roblox%20join%20links.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const placeId = window.location.pathname.match(/^\/games\/(\d+)/)?.[1];
    if (!placeId) {
        console.log('[RJS] no placeId found.');
        return;
    }
    console.log('[RJS] placeId:', placeId);

    // APIs to fetch friend and public servers
    const friendServersApi = `https://games.roblox.com/v1/games/${placeId}/servers/Friends?limit=100`;
    const publicServersApi = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=100`;

    // Fetch with CSRF token retry logic
    async function fetchWithCsrf(url) {
        let res = await fetch(url, { credentials: 'include' });
        if (res.status === 403 || res.status === 429) {
            const token = res.headers.get('x-csrf-token');
            if (token) {
                res = await fetch(url, {
                    credentials: 'include',
                    headers: { 'X-CSRF-Token': token }
                });
            }
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    // Fetch friend servers
    async function fetchFriendServers() {
        try {
            const data = await fetchWithCsrf(friendServersApi);
            return data.data || [];
        } catch (e) {
            console.error('[RJS] failed to fetch friend servers:', e);
            return [];
        }
    }

    // Fetch public servers
    async function fetchPublicServers() {
        try {
            const data = await fetchWithCsrf(publicServersApi);
            return data.data || [];
        } catch (e) {
            console.error('[RJS] failed to fetch public servers:', e);
            return [];
        }
    }

    // Create copy button
    function createCopyButton(joinLink) {
        const btn = document.createElement('button');
        btn.textContent = 'copy join link';
        btn.title = 'copy the join link with the real job ID';
        btn.className = 'copy-join-link-btn';
        btn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: #4CAF50;
            border: none;
            border-radius: 4px;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            z-index: 9999;
        `;
        btn.addEventListener('click', e => {
            e.stopPropagation();
            navigator.clipboard.writeText(joinLink).then(() => {
                alert(`copied join link:\n${joinLink}`);
            }).catch(() => {
                alert('failed to copy join link. try again.');
            });
        });
        return btn;
    }

    // Add buttons to friend server cards
    function addFriendServerButtons(friendServers) {
        const friendCards = document.querySelectorAll('div.card-item.card-item-friends-server');
        friendCards.forEach(card => {
            if (card.querySelector('.copy-join-link-btn')) return;

            // Extract player IDs shown
            const avatars = Array.from(card.querySelectorAll('.player-avatar a'));
            const playerIds = avatars.map(a => a.href.match(/\/users\/(\d+)\/profile/)?.[1]).filter(Boolean);

            // Match friend server by player IDs
            let matchedServer = null;
            for (const server of friendServers) {
                const serverPlayerIds = server.players.map(p => p.id.toString());
                if (playerIds.every(pid => serverPlayerIds.includes(pid))) {
                    matchedServer = server;
                    break;
                }
            }

            const joinLink = matchedServer
                ? `roblox://placeId=${placeId}&gameInstanceId=${matchedServer.id}`
                : `roblox://placeId=${placeId}`;

            card.style.position = 'relative';
            card.appendChild(createCopyButton(joinLink));

            console.log('[RJS] added friend server button', matchedServer ? '(matched)' : '(fallback)');
        });
    }

    // Add buttons to public server cards
    function addPublicServerButtons(publicServers) {
        const publicCards = document.querySelectorAll('li.rbx-public-game-server-item');

        publicCards.forEach(card => {
            if (card.querySelector('.copy-join-link-btn')) return;

            // Find matching public server by job ID or player count & max
            // Get player count and max from the card text
            const details = card.querySelector('div.server-player-count-gauge');
            const statusText = card.querySelector('div.rbx-public-game-server-status')?.textContent || '';
            // For safer matching, we try to match by jobId stored in server.id

            // Extract the short ID from UI (fallback)
            const serverIdDiv = card.querySelector('div.card-item-public-server div.server-id-text');
            let shortId = null;
            if (serverIdDiv) {
                const idMatch = serverIdDiv.textContent.match(/ID:\s*([\w-]+)/);
                if (idMatch) shortId = idMatch[1];
            }

            // Try to match the public server by shortId or by order/index
            let matchedServer = null;

            // Roblox short IDs don’t directly match full IDs,
            // So best to match by order: index of card == index of server in publicServers

            const cardArray = Array.from(document.querySelectorAll('li.rbx-public-game-server-item'));
            const idx = cardArray.indexOf(card);

            if (idx !== -1 && idx < publicServers.length) {
                matchedServer = publicServers[idx];
            }

            if (!matchedServer) {
                console.log('[RJS] no matching public server for card', card);
                return;
            }

            const joinLink = `roblox://placeId=${placeId}&gameInstanceId=${matchedServer.id}`;

            const cardInner = card.querySelector('div.card-item-public-server');
            if (!cardInner) return;

            cardInner.style.position = 'relative';
            cardInner.appendChild(createCopyButton(joinLink));

            console.log('[RJS] added public server button with jobId:', matchedServer.id);
        });
    }

    // Wait for server cards to load
    function waitForServerCards() {
        return new Promise(resolve => {
            const maxWait = 15000;
            let waited = 0;
            const interval = setInterval(() => {
                const friendCards = document.querySelectorAll('div.card-item.card-item-friends-server');
                const publicCards = document.querySelectorAll('li.rbx-public-game-server-item');
                if ((friendCards.length > 0 || publicCards.length > 0) || waited >= maxWait) {
                    clearInterval(interval);
                    resolve();
                }
                waited += 500;
            }, 500);
        });
    }

    await waitForServerCards();

    const [friendServers, publicServers] = await Promise.all([fetchFriendServers(), fetchPublicServers()]);

    addFriendServerButtons(friendServers);
    addPublicServerButtons(publicServers);

})();
