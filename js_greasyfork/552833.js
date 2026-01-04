// ==UserScript==
// @name         aquagloop war tool
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  1.0
// @match        https://www.torn.com/*
// @connect      monarchaqua.duckdns.org
// @connect      api.torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552833/aquagloop%20war%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/552833/aquagloop%20war%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEBSOCKET_URL = 'wss://monarchaqua.duckdns.org';
    const API_KEY_STORAGE = 'FOUNTAINE_STRIKE_TEAM_API_KEY';
    const UI_POSITION_STORAGE = 'FOUNTAINE_WAR_TOOLS_UI_POS';
    const TEAMS_COLLAPSED_STORAGE = 'FOUNTAINE_TEAMS_COLLAPSED';
    const DIBS_COLLAPSED_STORAGE = 'FOUNTAINE_DIBS_COLLAPSED';

    let ws;
    let currentUserId = null;
    let currentTeams = [];
    let memberStatuses = {};
    let dibs = {};
    let hospTime = {};
    const userNameCache = new Map();

    GM_addStyle(`
        #war-tools-container { position: fixed; width: 280px; background: rgba(40, 40, 40, 0.9); border: 1px solid rgba(80, 80, 80, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 9999; font-size: 12px; color: #ddd; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); font-family: 'Century Gothic', 'Candara', sans-serif; }
        .war-tools-header { background: linear-gradient(to bottom, #4a4a4a, #2a2a2a); padding: 8px; font-weight: bold; text-align: center; cursor: move; border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom: 1px solid #555; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); color: #fff; }
        .collapsible-header { background: rgba(255,255,255,0.05); padding: 6px 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; transition: background 0.2s ease; }
        .collapsible-header:hover { background: rgba(255,255,255,0.1); }
        .collapsible-arrow { margin-right: 8px; transition: transform 0.2s ease-in-out; font-size: 10px; }
        .collapsible-content { padding: 10px; max-height: 400px; overflow-y: auto; transition: all 0.3s ease-in-out; border-top: 1px solid #444; }
        .collapsible-content.collapsed { max-height: 0; padding: 0 10px; overflow: hidden; border-top: none; }
        .header-collapsed .collapsible-arrow { transform: rotate(-90deg); }
        .action-buttons { display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;}
        .action-btn { background: none; border: 1px solid #666; color: #ccc; cursor: pointer; font-size: 16px; padding: 4px; border-radius: 4px; transition: all 0.2s ease; line-height: 1; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { background: rgba(255,255,255,0.15); color: #fff; transform: translateY(-1px); }
        .strike-team { margin-bottom: 10px; }
        .strike-team-title { font-weight: bold; color: #fff; font-size: 14px; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center; }
        .strike-team-info { list-style: none; padding-left: 0; margin: 5px 0; }
        .strike-team-info li { margin-bottom: 4px; }
        .strike-team-members { list-style: none; padding-left: 0; margin: 5px 0; }
        .strike-team-members li { font-size: 11px; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .member-status-bar { width: 4px; height: 10px; border-radius: 2px; flex-shrink: 0; }
        .dibs-indicator { cursor: pointer; font-size: 16px; margin-right: 8px; vertical-align: middle; }
        .dibs-indicator.claimed, .dibs-indicator.unavailable { cursor: default; }
        #dibs-status-bar { position: fixed; top: 0; left: 50%; transform: translateX(-50%); background: rgba(255, 68, 68, 0.9); color: white; padding: 5px 15px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; z-index: 10000; font-weight: bold; }
        .my-dibs-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid #444; padding-bottom: 5px; }
        .my-dibs-item:last-child { border-bottom: none; }
        .my-dibs-info { display: flex; flex-direction: column; }
        .my-dibs-info a { color: #81D4FA; font-weight: normal; text-decoration: none; }
        .my-dibs-info a:hover { text-decoration: underline; }
        .member-bars-container { flex-grow: 1; display: flex; flex-direction: column; gap: 2px; }
        .bar-wrapper { background-color: #555; border-radius: 3px; height: 8px; overflow: hidden; width: 100%; }
        .bar-fill { height: 100%; border-radius: 3px; }
        .health-bar { background-color: #f44336; }
        .energy-bar { background-color: #FFC107; }
        .energy-text { font-size: 10px; color: #FFC107; margin-left: 5px; white-space: nowrap; }
    `);

    function makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) { e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; GM_setValue(storageKey, { top: element.style.top, left: element.style.left }); }
    }

    async function getTornData(apiKey, selection = 'basic', id = '') {
        return new Promise((resolve, reject) => {
            const url = `https://api.torn.com/user/${id}?selections=${selection}&key=${apiKey}`;
            GM_xmlhttpRequest({
                method: 'GET', url,
                onload: (response) => {
                    const data = JSON.parse(response.responseText);
                    if (data.error) return reject(new Error(data.error.error));
                    resolve(data);
                },
                onerror: () => reject(new Error('Network error fetching Torn data.'))
            });
        });
    }

    async function getTornUserId(apiKey) {
        const data = await getTornData(apiKey, 'basic');
        return data.player_id;
    }

    async function fetchAndCacheName(userId, apiKey) {
        if (!userId) return 'N/A';
        if (userNameCache.has(userId)) return userNameCache.get(userId);
        try {
            const data = await getTornData(apiKey, 'profile', userId);
            const name = data.name || `[${userId}]`;
            userNameCache.set(userId, name);
            return name;
        } catch (e) {
            return `[${userId}]`;
        }
    }

    function sendWebSocketMessage(data) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ ...data, userId: currentUserId }));
        }
    }

    function getStatusColor(status) {
        if (!status) return '#888';
        switch (status.state) {
            case 'Okay': return '#4CAF50';
            case 'Hospital': return '#f44336';
            case 'Jail': return '#9E9E9E';
            case 'Traveling': case 'Abroad': return '#2196F3';
            default: return '#888';
        }
    }

    function renderStrikeTeamUI() {
        const contentDiv = document.getElementById('strike-team-content');
        if (!contentDiv) return;
        contentDiv.innerHTML = 'Loading...';
        const finalHtml = document.createElement('div');
        if (currentTeams.length === 0) {
            finalHtml.textContent = 'No active strike teams.';
        } else {
            for (const team of currentTeams) {
                const teamDiv = document.createElement('div');
                teamDiv.className = 'strike-team';
                const teamTitle = document.createElement('div');
                teamTitle.className = 'strike-team-title';
                teamTitle.textContent = `Strike Team #${team.id}`;
                teamDiv.appendChild(teamTitle);
                const infoList = document.createElement('ul');
                infoList.className = 'strike-team-info';
                const teamStatusData = memberStatuses[team.id] || [];
                const leaderStatus = team.leader_id ? teamStatusData.find(m => m.id === team.leader_id) : null;
                const targetStatus = team.target_id ? teamStatusData.find(m => m.id === team.target_id) : null;
                const leaderName = leaderStatus ? leaderStatus.name : (team.leader_id ? `[${team.leader_id}]` : 'Unassigned');
                const targetName = targetStatus ? targetStatus.name : (team.target_id ? `[${team.target_id}]` : 'None');
                infoList.innerHTML = `<li><strong>Leader:</strong> ${leaderName}</li><li><strong>Target:</strong> ${team.target_id ? `<a href="https://www.torn.com/profiles.php?XID=${team.target_id}" target="_blank">${targetName}</a>` : 'None'}</li><li><strong>Members (${team.members.length}/5):</strong></li>`;
                const memberList = document.createElement('ul');
                memberList.className = 'strike-team-members';
                team.members.forEach(memberId => {
                    const memberData = teamStatusData.find(m => m.id === memberId);
                    const li = document.createElement('li');
                    if (memberData) {
                        const statusBar = document.createElement('div');
                        statusBar.className = 'member-status-bar';
                        statusBar.style.backgroundColor = getStatusColor(memberData.status);
                        li.appendChild(statusBar);
                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = memberData.name;
                        li.appendChild(nameSpan);
                        const barsContainer = document.createElement('div');
                        barsContainer.className = 'member-bars-container';
                        const healthPercent = (memberData.life.current / memberData.life.maximum) * 100;
                        const energyPercent = (memberData.energy.current / memberData.energy.maximum) * 100;
                        barsContainer.innerHTML = `
                            <div class="bar-wrapper" title="Health: ${memberData.life.current}/${memberData.life.maximum}">
                                <div class="bar-fill health-bar" style="width: ${healthPercent}%;"></div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div class="bar-wrapper" title="Energy: ${memberData.energy.current}/${memberData.energy.maximum}">
                                    <div class="bar-fill energy-bar" style="width: ${energyPercent}%;"></div>
                                </div>
                                <span class="energy-text">${memberData.energy.current} E</span>
                            </div>
                        `;
                        li.appendChild(barsContainer);
                    } else {
                        li.textContent = `• [${memberId}] (Waiting...)`;
                    }
                    memberList.appendChild(li);
                });
                infoList.appendChild(memberList);
                teamDiv.appendChild(infoList);
                const userIsInThisTeam = team.members.includes(currentUserId);
                const userIsLeader = team.leader_id === currentUserId;
                const userIsInAnyTeam = currentTeams.some(t => t.members.includes(currentUserId));
                const isOnAttackPage = window.location.href.includes('sid=attack&user2ID=');
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'action-buttons';
                if (userIsLeader) {
                    if (isOnAttackPage) {
                        const setTargetBtn = document.createElement('button'); setTargetBtn.className = 'action-btn'; setTargetBtn.title = 'Set Target from URL'; setTargetBtn.innerHTML = '🎯';
                        setTargetBtn.onclick = () => { const urlParams = new URLSearchParams(window.location.search); const targetId = urlParams.get('user2ID'); if (targetId) sendWebSocketMessage({ action: 'setTarget', targetId: parseInt(targetId) }); };
                        buttonContainer.appendChild(setTargetBtn);
                        const alertBtn = document.createElement('button'); alertBtn.className = 'action-btn'; alertBtn.title = 'Alert Team'; alertBtn.innerHTML = '📢';
                        alertBtn.onclick = () => sendWebSocketMessage({ action: 'alertTeam', url: window.location.href });
                        buttonContainer.appendChild(alertBtn);
                    } else {
                         const setTargetBtn = document.createElement('button'); setTargetBtn.className = 'action-btn'; setTargetBtn.title = 'Set Target Manually'; setTargetBtn.innerHTML = '🎯';
                        setTargetBtn.onclick = () => { const targetId = prompt('Enter the Torn ID of the target:'); if (targetId && /^\d+$/.test(targetId)) sendWebSocketMessage({ action: 'setTarget', targetId: parseInt(targetId) }); };
                        buttonContainer.appendChild(setTargetBtn);
                    }
                    const leaveBtn = document.createElement('button'); leaveBtn.className = 'action-btn'; leaveBtn.title = 'Leave & Relinquish Lead'; leaveBtn.innerHTML = '−';
                    leaveBtn.onclick = () => sendWebSocketMessage({ action: 'leaveTeam' });
                    buttonContainer.appendChild(leaveBtn);
                } else if (userIsInThisTeam) {
                    const claimLeadBtn = document.createElement('button'); claimLeadBtn.className = 'action-btn'; claimLeadBtn.title = 'Claim Leadership'; claimLeadBtn.innerHTML = '👑';
                    claimLeadBtn.onclick = () => sendWebSocketMessage({ action: 'setLeader', teamId: team.id });
                    buttonContainer.appendChild(claimLeadBtn);
                    if (isOnAttackPage) {
                        const assistBtn = document.createElement('button'); assistBtn.className = 'action-btn'; assistBtn.title = 'Request Assist'; assistBtn.innerHTML = '🙏';
                        assistBtn.onclick = () => sendWebSocketMessage({ action: 'requestAssist', url: window.location.href });
                        buttonContainer.appendChild(assistBtn);
                    }
                    const leaveBtn = document.createElement('button'); leaveBtn.className = 'action-btn'; leaveBtn.title = 'Leave Team'; leaveBtn.innerHTML = '−';
                    leaveBtn.onclick = () => sendWebSocketMessage({ action: 'leaveTeam' });
                    buttonContainer.appendChild(leaveBtn);
                } else if (!userIsInAnyTeam && team.members.length < 5) {
                    const joinBtn = document.createElement('button'); joinBtn.className = 'action-btn'; joinBtn.title = 'Join Team'; joinBtn.innerHTML = '➕';
                    joinBtn.onclick = () => sendWebSocketMessage({ action: 'joinTeam', teamId: team.id });
                    buttonContainer.appendChild(joinBtn);
                }
                if(buttonContainer.children.length > 0) teamDiv.appendChild(buttonContainer);
                finalHtml.appendChild(teamDiv);
            }
        }
        contentDiv.innerHTML = '';
        contentDiv.appendChild(finalHtml);
    }

    async function renderMyDibsUI() {
        const myDibsContent = document.getElementById('my-dibs-content');
        if (!myDibsContent) return;
        const myDibs = Object.entries(dibs).filter(([targetId, dibsInfo]) => dibsInfo.userId === currentUserId);
        if (myDibs.length > 0) {
            myDibsContent.style.display = 'block';
            myDibsContent.innerHTML = '';
            const apiKey = GM_getValue(API_KEY_STORAGE);
            for (const [targetId, dibsInfo] of myDibs) {
                const targetName = await fetchAndCacheName(targetId, apiKey);
                const itemDiv = document.createElement('div');
                itemDiv.className = 'my-dibs-item';
                const infoDiv = document.createElement('div');
                infoDiv.className = 'my-dibs-info';
                infoDiv.innerHTML = `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}" target="_blank">${targetName} [${targetId}]</a><span id="my-dibs-timer-${targetId}">...</span>`;
                const releaseBtn = document.createElement('button');
                releaseBtn.innerHTML = '−'; releaseBtn.title = 'Release Dibs';
                releaseBtn.onclick = () => sendWebSocketMessage({ action: 'releaseDibs', targetId: parseInt(targetId) });
                itemDiv.appendChild(infoDiv);
                itemDiv.appendChild(releaseBtn);
                myDibsContent.appendChild(itemDiv);
            }
        } else {
            myDibsContent.style.display = 'none';
        }
    }

    function updateWarUI() {
        document.querySelectorAll('.members-list .status.hospital').forEach(node => {
            const row = node.closest('.enemy');
            if (!row) return;
            const link = row.querySelector('a[href*="/profiles.php?XID="]');
            if (!link) return;
            const userId = link.href.match(/XID=(\d+)/)[1];
            const hospitalTimestamp = hospTime[userId];
            if (!hospitalTimestamp) return;
            const totalSeconds = hospitalTimestamp - (Date.now() / 1000);
            if (totalSeconds <= 0) {
                node.textContent = 'Hospital';
                delete hospTime[userId];
                return;
            }
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = Math.floor(totalSeconds % 60);
            const hStr = h > 0 ? `${h.toString().padStart(2, '0')}:` : '';
            const mStr = m.toString().padStart(2, '0');
            const sStr = s.toString().padStart(2, '0');
            node.textContent = `${hStr}${mStr}:${sStr}`;
        });
        const myDibs = Object.entries(dibs).filter(([targetId, dibsInfo]) => dibsInfo.userId === currentUserId);
        myDibs.forEach(([targetId, dibsInfo]) => {
            const timerSpan = document.getElementById(`my-dibs-timer-${targetId}`);
            if (!timerSpan) return;
            const hospitalTimestamp = hospTime[targetId];
            if (hospitalTimestamp) {
                const totalSeconds = hospitalTimestamp - (Date.now() / 1000);
                if (totalSeconds > 0) {
                     const m = Math.floor(totalSeconds / 60);
                     const s = Math.floor(totalSeconds % 60);
                     timerSpan.textContent = `Out in: ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                } else {
                     timerSpan.textContent = 'Out of hospital!';
                }
            } else {
                timerSpan.textContent = 'Status: Okay';
            }
        });
        renderDibsUI();
    }

    function updateDibsIndicator(indicator, targetId) {
        const dibsInfo = dibs[targetId];
        const hospitalTimestamp = hospTime[targetId];
        const nowSeconds = Date.now() / 1000;
        const outInSeconds = hospitalTimestamp ? hospitalTimestamp - nowSeconds : Infinity;
        if (dibsInfo) {
            indicator.textContent = '🔒';
            indicator.style.color = '#f44336';
            if (dibsInfo.userId === currentUserId) {
                indicator.className = 'dibs-indicator claimed';
                indicator.title = 'You have dibs. Click to release.';
                indicator.onclick = (e) => { e.stopPropagation(); sendWebSocketMessage({ action: 'releaseDibs', targetId: parseInt(targetId) }); };
            } else {
                indicator.className = 'dibs-indicator claimed';
                indicator.title = `Dibsed by: User [${dibsInfo.userId}]`;
                indicator.onclick = null;
            }
        } else if (hospitalTimestamp && outInSeconds > 0 && outInSeconds <= 1440) {
            indicator.textContent = '🎯';
            indicator.style.color = '#4CAF50';
            indicator.className = 'dibs-indicator';
            const minutes = Math.floor(outInSeconds / 60);
            const seconds = Math.floor(outInSeconds % 60);
            indicator.title = `Out in ${minutes}m ${seconds}s. Click to call dibs.`;
            indicator.onclick = (e) => { e.stopPropagation(); sendWebSocketMessage({ action: 'claimDibs', targetId: parseInt(targetId) }); };
        } else {
            indicator.textContent = '➖';
            indicator.style.color = '#888';
            indicator.className = 'dibs-indicator unavailable';
            indicator.title = 'Target is not eligible for dibs.';
            indicator.onclick = null;
        }
    }

    function renderDibsUI() {
        if (window.location.href.includes('/war/rank')) {
            const memberRows = document.querySelectorAll('.members-list > .enemy');
            memberRows.forEach(row => {
                const profileLink = row.querySelector('a[href*="/profiles.php?XID="]');
                if (!profileLink) return;
                const targetIdMatch = profileLink.href.match(/XID=(\d+)/);
                if (!targetIdMatch) return;
                const targetId = targetIdMatch[1];
                let indicator = row.querySelector('.dibs-indicator');
                if (!indicator) {
                    indicator = document.createElement('span');
                    indicator.className = 'dibs-indicator';
                    indicator.dataset.targetId = targetId;
                    const statusIconContainer = row.querySelector('.userStatusWrap___ljSJG');
                    if (statusIconContainer) {
                        statusIconContainer.insertAdjacentElement('beforebegin', indicator);
                    }
                }
                updateDibsIndicator(indicator, targetId);
            });
        }

        if (window.location.href.includes('sid=attack&user2ID=')) {
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('user2ID');
            const dibsInfo = dibs[targetId];
            let statusBar = document.getElementById('dibs-status-bar');
            if (dibsInfo) {
                if (!statusBar) { statusBar = document.createElement('div'); statusBar.id = 'dibs-status-bar'; document.body.appendChild(statusBar); }
                statusBar.textContent = `This target has been dibsed by: User [${dibsInfo.userId}]`;
            } else {
                if (statusBar) statusBar.remove();
            }
        }
    }

    function connect() {
        console.log('[Dibs/Strike Team] Attempting to connect to websocket...');
        ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = () => {
            console.log('[Dibs/Strike Team] Websocket connection established!');
            const apiKey = GM_getValue(API_KEY_STORAGE);
            if (apiKey && currentUserId) {
                sendWebSocketMessage({ action: 'storeApiKey', apiKey: apiKey });
            }
            sendWebSocketMessage({ action: 'requestInitialState' });
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'teamsUpdate') {
                currentTeams = data.teams;
                sessionStorage.setItem('fountaine_teams_cache', JSON.stringify(currentTeams));
                renderStrikeTeamUI();
            } else if (data.type === 'statusUpdate') {
                memberStatuses = data.data;
                sessionStorage.setItem('fountaine_status_cache', JSON.stringify(memberStatuses));
                renderStrikeTeamUI();
            } else if (data.type === 'dibsUpdate') {
                dibs = data.dibs;
                sessionStorage.setItem('fountaine_dibs_cache', JSON.stringify(dibs));
                renderDibsUI();
                renderMyDibsUI();
            } else if (data.type === 'teamAlert') {
                if (confirm(`${data.message}\n\nDo you want to open the attack page?`)) {
                    window.open(data.url, '_blank');
                }
            }
        };
        ws.onclose = () => { console.log('[Dibs/Strike Team] Websocket connection closed. Reconnecting in 5 seconds...'); setTimeout(connect, 5000); };
        ws.onerror = (error) => { console.error('[Dibs/Strike Team] Websocket error:', error); ws.close(); };
    }

    function listenToPageData() {
        const targetWindow = unsafeWindow;
        if (!targetWindow) return;

        const oldFetch = targetWindow.fetch;
        targetWindow.fetch = async (...args) => {
            const url = args[0]?.url || args[0];
            const isWarData = url.includes("step=getwarusers") || url.includes("step=getProcessBarRefreshData");
            const response = await oldFetch(...args);
            if (!isWarData) return response;
            const clone = response.clone();
            clone.json().then((json) => {
                let members = json.warDesc?.members || json.userStatuses;
                if (!members) return;
                Object.keys(members).forEach((id) => {
                    const status = members[id].status || members[id];
                    const userId = members[id].userID || id;
                    if (status.text === "Hospital") { hospTime[userId] = status.updateAt; }
                    else { delete hospTime[userId]; }
                });
                sessionStorage.setItem('fountaine_hosp_timers', JSON.stringify(hospTime));
            });
            return response;
        };

        const oldWebSocket = targetWindow.WebSocket;
        targetWindow.WebSocket = function(...args) {
            const socket = new oldWebSocket(...args);
            socket.addEventListener("message", (event) => {
                try {
                    const json = JSON.parse(event.data);
                    const statusUpdate = json?.push?.pub?.data?.message?.namespaces?.users?.actions?.updateStatus;
                    if (!statusUpdate?.status) return;
                    const id = statusUpdate.userId;
                    const status = statusUpdate.status;
                    if (status.text === "Hospital") {
                        hospTime[id] = status.updateAt;
                    } else {
                        delete hospTime[id];
                    }
                    sessionStorage.setItem('fountaine_hosp_timers', JSON.stringify(hospTime));
                } catch (e) {}
            });
            return socket;
        };
    }

    async function main() {
        const container = document.createElement('div');
        container.id = 'war-tools-container';
        container.innerHTML = `
            <div class="war-tools-header">War Tools</div>
            <div class="collapsible-header" id="strike-teams-header-toggle"><span class="collapsible-arrow">▼</span>Strike Teams</div>
            <div class="collapsible-content" id="strike-team-content">Initializing...</div>
            <div class="collapsible-header" id="my-dibs-header-toggle"><span class="collapsible-arrow">▼</span>My Dibs</div>
            <div class="collapsible-content" id="my-dibs-content"></div>
        `;
        document.body.appendChild(container);

        const savedPos = GM_getValue(UI_POSITION_STORAGE, { top: '100px', left: '10px' });
        container.style.top = savedPos.top;
        container.style.left = savedPos.left;
        makeDraggable(container, container.querySelector('.war-tools-header'), UI_POSITION_STORAGE);

        const teamsHeader = document.getElementById('strike-teams-header-toggle');
        const teamsContent = document.getElementById('strike-team-content');
        const dibsHeader = document.getElementById('my-dibs-header-toggle');
        const dibsContent = document.getElementById('my-dibs-content');

        let teamsCollapsed = GM_getValue(TEAMS_COLLAPSED_STORAGE, false);
        if (teamsCollapsed) { teamsContent.classList.add('collapsed'); teamsHeader.classList.add('header-collapsed'); }
        teamsHeader.addEventListener('click', () => {
            teamsCollapsed = !teamsCollapsed;
            teamsContent.classList.toggle('collapsed');
            teamsHeader.classList.toggle('header-collapsed');
            GM_setValue(TEAMS_COLLAPSED_STORAGE, teamsCollapsed);
        });

        let dibsCollapsed = GM_getValue(DIBS_COLLAPSED_STORAGE, false);
        if (dibsCollapsed) { dibsContent.classList.add('collapsed'); dibsHeader.classList.add('header-collapsed'); }
         dibsHeader.addEventListener('click', () => {
            dibsCollapsed = !dibsCollapsed;
            dibsContent.classList.toggle('collapsed');
            dibsHeader.classList.toggle('header-collapsed');
            GM_setValue(DIBS_COLLAPSED_STORAGE, dibsCollapsed);
        });

        let apiKey = GM_getValue(API_KEY_STORAGE);
        if (!apiKey) {
            apiKey = prompt("Please enter your Torn API key (this is needed to identify you and will be sent to the bot):");
            if (apiKey) {
                 try {
                    const userId = await getTornUserId(apiKey);
                    currentUserId = userId;
                    GM_setValue(API_KEY_STORAGE, apiKey);
                    console.log(`[Dibs/Strike Team] Identified as User ID: ${currentUserId}`);
                    connect();
                } catch (e) {
                    document.getElementById('strike-team-content').textContent = `Error: ${e.message}. Invalid API Key.`;
                }
            } else {
                document.getElementById('strike-team-content').textContent = 'API Key required. Please refresh.';
                return;
            }
        } else {
             try {
                const userId = await getTornUserId(apiKey);
                currentUserId = userId;
                console.log(`[Dibs/Strike Team] Identified as User ID: ${currentUserId}`);
                connect();
            } catch (e) {
                document.getElementById('strike-team-content').textContent = `Error: ${e.message}. Please check your API key.`;
                GM_setValue(API_KEY_STORAGE, null);
            }
        }

        setInterval(updateWarUI, 1000);
    }

    listenToPageData();

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        const savedTimers = sessionStorage.getItem('fountaine_hosp_timers');
        if (savedTimers) hospTime = JSON.parse(savedTimers);
        const cachedTeams = sessionStorage.getItem('fountaine_teams_cache');
        if (cachedTeams) currentTeams = JSON.parse(cachedTeams);
        const cachedStatuses = sessionStorage.getItem('fountaine_status_cache');
        if (cachedStatuses) memberStatuses = JSON.parse(cachedStatuses);
        const cachedDibs = sessionStorage.getItem('fountaine_dibs_cache');
        if(cachedDibs) dibs = JSON.parse(cachedDibs);

        main();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            const savedTimers = sessionStorage.getItem('fountaine_hosp_timers');
            if (savedTimers) hospTime = JSON.parse(savedTimers);
            const cachedTeams = sessionStorage.getItem('fountaine_teams_cache');
            if (cachedTeams) currentTeams = JSON.parse(cachedTeams);
            const cachedStatuses = sessionStorage.getItem('fountaine_status_cache');
            if (cachedStatuses) memberStatuses = JSON.parse(cachedStatuses);
            const cachedDibs = sessionStorage.getItem('fountaine_dibs_cache');
            if(cachedDibs) dibs = JSON.parse(cachedDibs);

            main();
        });
    }
})();